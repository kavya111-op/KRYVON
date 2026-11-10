
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_CATALOGUE } from './src/data/catalogue.ts';
import { defaultPolicyEngine } from './src/services/policyEngine.ts';
import { LedgerOrder, Product } from './src/types/index.ts';

dotenv.config();

const app = express();
const PORT = Number.parseInt(process.env.PORT || '3000', 10);
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(express.json({ limit: '100kb' }));

// -----------------------------------------------------------------------------
// Configuration
// -----------------------------------------------------------------------------

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

const GEMINI_MODEL =
  process.env.GEMINI_MODEL || 'gemini-3.8-flash';

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || '';
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || '';

const PAYPAL_MODE =
  (process.env.PAYPAL_MODE || 'sandbox').toLowerCase() === 'live'
    ? 'live'
    : 'sandbox';

const PAYPAL_BASE_URL =
  PAYPAL_MODE === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

const PAYPAL_CONFIGURED = Boolean(
  PAYPAL_CLIENT_ID && PAYPAL_CLIENT_SECRET
);

const INR_TO_USD_RATE = 86.5;

// -----------------------------------------------------------------------------
// In-memory data
// -----------------------------------------------------------------------------

const orderLedger: LedgerOrder[] = [
  {
    orderId: 'ORD-98214',
    paypalOrderId: 'PAYPAL-SANDBOX-89123847',
    paypalCaptureId: 'CAP-7492819283',
    productId: 'kry-wear-02',
    productName: 'PulseTrack Pro 5 Advanced Health Tracker',
    productImage:
      '/src/assets/images/smartwatch_amoled_matte_1793726640001.jpg',
    amountINR: 2499,
    amountCharged: 2499,
    currency: 'INR',
    paymentMethod: 'PayPal Sandbox (Demo Record)',
    paymentStatus: 'COMPLETED',
    policyStatusAtPurchase: 'ALLOWED',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    payerEmail: 'sandbox-buyer@kryvon.ai',
    payerName: 'Demo Customer'
  }
];

type PendingPayPalOrder = {
  productId: string;
  productName: string;
  amountINR: number;
  currency: string;
  createdAt: number;
};

const pendingPayPalOrders = new Map<string, PendingPayPalOrder>();

const verifiedCaptureIds = new Set<string>();

// -----------------------------------------------------------------------------
// Gemini initialization
// -----------------------------------------------------------------------------

let genAI: GoogleGenAI | null = null;

if (GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  } catch (error) {
    console.error('[KRYVON] Gemini SDK initialization failed:', error);
  }
}

async function generateGeminiContent(
  prompt: string,
  responseMimeType?: string
): Promise<string | null> {
  if (!genAI) return null;

  try {
    const config = responseMimeType
      ? { responseMimeType }
      : undefined;

    const response = await genAI.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config
    });

    return response.text?.trim() || null;
  } catch (error: any) {
    console.warn(
      `[KRYVON] Gemini request failed with model "${GEMINI_MODEL}":`,
      error?.message || error
    );

    return null;
  }
}

// -----------------------------------------------------------------------------
// Validation helpers
// -----------------------------------------------------------------------------

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isPositiveFiniteNumber(value: unknown): boolean {
  const numberValue = Number(value);

  return Number.isFinite(numberValue) && numberValue > 0;
}

function getProduct(productId: unknown): Product | undefined {
  if (!isNonEmptyString(productId)) return undefined;

  return INITIAL_CATALOGUE.find(
    (product) => product.id === productId
  );
}

function sendInternalError(
  res: Response,
  message: string,
  error: unknown
) {
  console.error(`[KRYVON] ${message}:`, error);

  res.status(500).json({
    error: IS_PRODUCTION
      ? message
      : error instanceof Error
        ? error.message
        : message
  });
}

function safeJsonParse<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function getExpectedUSD(product: Product): string {
  return (product.priceINR / INR_TO_USD_RATE).toFixed(2);
}

// -----------------------------------------------------------------------------
// PayPal helpers
// -----------------------------------------------------------------------------

async function getPayPalAccessToken(): Promise<string | null> {
  if (!PAYPAL_CONFIGURED) return null;

  try {
    const auth = Buffer.from(
      `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
    ).toString('base64');

    const response = await fetch(
      `${PAYPAL_BASE_URL}/v1/oauth2/token`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
      }
    );

    if (!response.ok) {
      console.error(
        '[PayPal] OAuth token request failed:',
        response.status
      );

      return null;
    }

    const data = await response.json() as {
      access_token?: string;
    };

    return data.access_token || null;
  } catch (error) {
    console.error(
      '[PayPal] Could not obtain access token:',
      error
    );

    return null;
  }
}

async function paypalRequest<T>(
  endpoint: string,
  accessToken: string,
  method: 'GET' | 'POST',
  body?: unknown,
  requestId?: string
): Promise<{
  ok: boolean;
  status: number;
  data: T | null;
}> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  };

  if (requestId) {
    headers['PayPal-Request-Id'] = requestId;
  }

  const response = await fetch(
    `${PAYPAL_BASE_URL}${endpoint}`,
    {
      method,
      headers,
      ...(body === undefined
        ? {}
        : { body: JSON.stringify(body) })
    }
  );

  const responseText = await response.text();

  const data = responseText
    ? safeJsonParse<T | null>(responseText, null)
    : null;

  return {
    ok: response.ok,
    status: response.status,
    data
  };
}

function getPayPalCapture(orderData: any): any | null {
  const purchaseUnits = orderData?.purchase_units;

  if (!Array.isArray(purchaseUnits)) return null;

  for (const unit of purchaseUnits) {
    const captures = unit?.payments?.captures;

    if (Array.isArray(captures) && captures.length > 0) {
      const completedCapture = captures.find(
        (item: any) => item?.status === 'COMPLETED'
      );

      if (completedCapture) return completedCapture;

      return captures[0];
    }
  }

  return null;
}

function verifyPayPalOrderProduct(
  orderData: any,
  product: Product
): boolean {
  const purchaseUnits = orderData?.purchase_units;

  if (!Array.isArray(purchaseUnits) || purchaseUnits.length === 0) {
    return false;
  }

  return purchaseUnits.some((unit: any) => {
    const referenceMatches =
      unit?.reference_id === product.id;

    const expectedAmount = Number(getExpectedUSD(product));
    const actualAmount = Number(unit?.amount?.value);

    const currencyMatches =
      unit?.amount?.currency_code === 'USD';

    const amountMatches =
      Number.isFinite(actualAmount) &&
      Math.abs(actualAmount - expectedAmount) <= 0.01;

    return (
      referenceMatches &&
      currencyMatches &&
      amountMatches
    );
  });
}

function verifyPayPalCapture(
  orderData: any,
  capture: any,
  product: Product
): {
  valid: boolean;
  reason?: string;
} {
  if (orderData?.status !== 'COMPLETED') {
    return {
      valid: false,
      reason: `Order status is ${orderData?.status || 'UNKNOWN'}`
    };
  }

  if (capture?.status !== 'COMPLETED') {
    return {
      valid: false,
      reason: `Capture status is ${capture?.status || 'MISSING'}`
    };
  }

  if (!isNonEmptyString(capture?.id)) {
    return {
      valid: false,
      reason: 'PayPal capture ID is missing'
    };
  }

  if (capture?.amount?.currency_code !== 'USD') {
    return {
      valid: false,
      reason: 'Capture currency does not match USD'
    };
  }

  const expectedAmount = Number(getExpectedUSD(product));
  const capturedAmount = Number(capture?.amount?.value);

  if (
    !Number.isFinite(capturedAmount) ||
    Math.abs(capturedAmount - expectedAmount) > 0.01
  ) {
    return {
      valid: false,
      reason: 'Captured amount does not match the product price'
    };
  }

  return { valid: true };
}

function createLedgerOrder(
  paypalOrderId: string,
  capture: any,
  product: Product,
  paypalData: any
): LedgerOrder {
  const payerEmail =
    paypalData?.payer?.email_address ||
    'sandbox-customer@kryvon.ai';

  const payerName = [
    paypalData?.payer?.name?.given_name,
    paypalData?.payer?.name?.surname
  ]
    .filter(Boolean)
    .join(' ') || 'PayPal Sandbox Customer';

  return {
    orderId: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
    paypalOrderId,
    paypalCaptureId: capture.id,
    productId: product.id,
    productName: product.name,
    productImage: product.image,
    amountINR: product.priceINR,
    amountCharged: product.priceINR,
    currency: 'INR',
    paymentMethod: `PayPal ${PAYPAL_MODE.toUpperCase()} (Verified Capture)`,
    paymentStatus: 'COMPLETED',
    policyStatusAtPurchase:
      product.priceINR >
      defaultPolicyEngine.getConfig().autoApprovalMaxINR
        ? 'APPROVAL_REQUIRED'
        : 'ALLOWED',
    createdAt: new Date().toISOString(),
    payerEmail,
    payerName
  };
}

function recordCompletedPayment(
  paypalOrderId: string,
  capture: any,
  product: Product,
  paypalData: any
): LedgerOrder {
  // Avoid creating duplicate ledger entries.
  const existing = orderLedger.find(
    (order) =>
      order.paypalOrderId === paypalOrderId ||
      order.paypalCaptureId === capture.id
  );

  if (existing) return existing;

  const ledgerItem = createLedgerOrder(
    paypalOrderId,
    capture,
    product,
    paypalData
  );

  orderLedger.unshift(ledgerItem);
  verifiedCaptureIds.add(capture.id);
  pendingPayPalOrders.delete(paypalOrderId);

  return ledgerItem;
}

// -----------------------------------------------------------------------------
// 1. API: System Status
// -----------------------------------------------------------------------------

app.get('/api/system/status', (_req: Request, res: Response) => {
  res.json({
    geminiModel: GEMINI_MODEL,
    geminiConnected: Boolean(genAI),
    paypalMode: PAYPAL_MODE,
    paypalCredentialsConfigured: PAYPAL_CONFIGURED,
    paypalCheckoutAvailable: PAYPAL_CONFIGURED,
    policyEngineActive: true,
    catalogueItemCount: INITIAL_CATALOGUE.length,
    activeEnvironment: process.env.NODE_ENV || 'development'
  });
});

// -----------------------------------------------------------------------------
// 2. API: Agent Mission Analysis
// -----------------------------------------------------------------------------

app.post(
  '/api/agent/mission',
  async (req: Request, res: Response) => {
    try {
      const {
        query,
        maxBudgetINR = 10000,
        priority = 'price'
      } = req.body ?? {};

      if (!isNonEmptyString(query)) {
        res.status(400).json({
          error: 'A shopping query is required.'
        });
        return;
      }

      const cleanQuery = query.trim().slice(0, 500);
      const parsedBudget = Number(maxBudgetINR);

      if (
        !Number.isFinite(parsedBudget) ||
        parsedBudget <= 0 ||
        parsedBudget > 100000000
      ) {
        res.status(400).json({
          error: 'Budget must be a valid positive amount.'
        });
        return;
      }

      const allowedPriorities = [
        'price',
        'quality',
        'features',
        'durability'
      ];

      const cleanPriority = allowedPriorities.includes(priority)
        ? priority
        : 'price';

      const catalogueGrounding = INITIAL_CATALOGUE.map(
        (product) => ({
          id: product.id,
          name: product.name,
          category: product.category,
          priceINR: product.priceINR,
          rating: product.rating,
          summary: product.summary,
          keySpecs: product.specs
        })
      );

      type AgentPayload = {
        missionSummary: string;
        categoryIdentified: string;
        rankedProducts: Array<{
          id: string;
          matchScore: number;
          aiRecommendationReason: string;
        }>;
        agentRationale: string;
      };

      let agentResponsePayload: AgentPayload | null = null;

      if (genAI) {
        const prompt = `You are KRYVON's Autonomous Shopping Agent.
The user issued this shopping mission: "${cleanQuery}".
User max budget: ₹${parsedBudget}.
User priority: "${cleanPriority}".

Use only this authentic product catalogue:
${JSON.stringify(catalogueGrounding, null, 2)}

Understand the user's intent, category, desired features and budget.
Rank matching catalogue products. Scores must be between 50 and 99.
Explain why each product matches and mention relevant trade-offs.
Return valid JSON only, matching this structure:
{
  "missionSummary": "Short summary of user intent and constraints",
  "categoryIdentified": "audio | peripherals | wearables | workspace | all",
  "rankedProducts": [
    {
      "id": "exact catalogue id",
      "matchScore": 95,
      "aiRecommendationReason": "Specific explanation grounded in catalogue data"
    }
  ],
  "agentRationale": "Why the top product is a suitable choice"
}`;

        const rawText = await generateGeminiContent(
          prompt,
          'application/json'
        );

        if (rawText) {
          const parsed = safeJsonParse<AgentPayload | null>(
            rawText,
            null
          );

          if (
            parsed &&
            Array.isArray(parsed.rankedProducts) &&
            typeof parsed.missionSummary === 'string'
          ) {
            agentResponsePayload = parsed;
          }
        }
      }

      // Deterministic fallback when Gemini is unavailable.
      if (!agentResponsePayload) {
        const queryLower = cleanQuery.toLowerCase();

        const scoredProducts = INITIAL_CATALOGUE.map(
          (product) => {
            let score = 60;

            const searchableText = [
              product.name,
              product.category,
              product.summary,
              JSON.stringify(product.specs),
              product.strengths.join(' ')
            ]
              .join(' ')
              .toLowerCase();

            const terms = queryLower
              .split(/\s+/)
              .filter((term) => term.length > 2);

            for (const term of terms) {
              if (searchableText.includes(term)) score += 12;
            }

            if (
              (queryLower.includes('noise') ||
                queryLower.includes('anc')) &&
              product.specs.noiseCancellation
            ) {
              score += 20;
            }

            if (
              queryLower.includes('headphone') &&
              product.category === 'audio'
            ) {
              score += 20;
            }

            if (
              queryLower.includes('earbud') &&
              product.id.includes('aud-02')
            ) {
              score += 25;
            }

            if (
              queryLower.includes('keyboard') &&
              product.category === 'peripherals'
            ) {
              score += 25;
            }

            if (
              (queryLower.includes('watch') ||
                queryLower.includes('wearable')) &&
              product.category === 'wearables'
            ) {
              score += 25;
            }

            if (
              queryLower.includes('battery') &&
              product.specs.batteryLife
            ) {
              score += 10;
            }

            score +=
              product.priceINR <= parsedBudget ? 15 : -30;

            if (
              cleanPriority === 'price' &&
              product.priceINR < parsedBudget * 0.7
            ) {
              score += 10;
            }

            if (
              cleanPriority === 'quality' &&
              product.rating >= 4.7
            ) {
              score += 10;
            }

            const matchScore = Math.min(
              98,
              Math.max(45, score)
            );

            const reason =
              product.priceINR <= parsedBudget
                ? `Within your ₹${parsedBudget.toLocaleString('en-IN')} budget at ₹${product.priceINR.toLocaleString('en-IN')}. Rating: ${product.rating}★.`
                : `Exceeds your budget by ₹${(
                    product.priceINR - parsedBudget
                  ).toLocaleString('en-IN')}; consider it only if its features justify the difference.`;

            return {
              id: product.id,
              matchScore,
              aiRecommendationReason: reason
            };
          }
        ).sort((a, b) => b.matchScore - a.matchScore);

        agentResponsePayload = {
          missionSummary: `Evaluated "${cleanQuery}" against the product catalogue with a ₹${parsedBudget.toLocaleString('en-IN')} budget and ${cleanPriority} priority.`,
          categoryIdentified:
            queryLower.includes('headphone') ||
            queryLower.includes('sound')
              ? 'audio'
              : queryLower.includes('keyboard')
                ? 'peripherals'
                : queryLower.includes('watch') ||
                    queryLower.includes('wearable')
                  ? 'wearables'
                  : 'all',
          rankedProducts: scoredProducts,
          agentRationale:
            'Products were ranked using catalogue matches, budget fit and the selected priority.'
        };
      }

      const rankedById = new Map(
        agentResponsePayload.rankedProducts.map(
          (item) => [item.id, item]
        )
      );

      const augmentedProducts = INITIAL_CATALOGUE.map(
        (product) => {
          const match = rankedById.get(product.id);

          return {
            ...product,
            matchScore: match
              ? Math.min(
                  99,
                  Math.max(0, Number(match.matchScore) || 50)
                )
              : 50,
            aiRecommendationReason:
              match?.aiRecommendationReason || product.summary
          };
        }
      ).sort((a, b) => b.matchScore - a.matchScore);

      res.json({
        success: true,
        missionSummary: agentResponsePayload.missionSummary,
        agentRationale: agentResponsePayload.agentRationale,
        categoryIdentified: agentResponsePayload.categoryIdentified,
        products: augmentedProducts,
        evaluatedAt: new Date().toISOString()
      });
    } catch (error) {
      sendInternalError(res, 'Mission execution failed.', error);
    }
  }
);

// -----------------------------------------------------------------------------
// 3. API: Side-by-Side Comparison
// -----------------------------------------------------------------------------

app.post(
  '/api/agent/compare',
  async (req: Request, res: Response) => {
    try {
      const { productIds } = req.body ?? {};

      if (
        !Array.isArray(productIds) ||
        productIds.length < 2 ||
        productIds.length > 4 ||
        !productIds.every((id) => typeof id === 'string')
      ) {
        res.status(400).json({
          error: 'Provide between 2 and 4 valid product IDs.'
        });
        return;
      }

      const selectedProducts = INITIAL_CATALOGUE.filter(
        (product) => productIds.includes(product.id)
      );

      if (selectedProducts.length < 2) {
        res.status(404).json({
          error: 'Matching products were not found in the catalogue.'
        });
        return;
      }

      let comparisonAnalysis: any = null;

      if (genAI) {
        const prompt = `You are KRYVON's Intelligent Commerce Comparison Agent.
Compare these catalogue products objectively:
${JSON.stringify(selectedProducts, null, 2)}

Return valid JSON only:
{
  "winnerByCategory": [
    { "category": "Value for Money", "winnerId": "exact product id", "rationale": "..." },
    { "category": "Build & Specifications", "winnerId": "exact product id", "rationale": "..." }
  ],
  "recommendationSummary": "Concise advice based on the user's likely use case"
}`;

        const rawText = await generateGeminiContent(
          prompt,
          'application/json'
        );

        if (rawText) {
          comparisonAnalysis = safeJsonParse<any>(
            rawText,
            null
          );
        }
      }

      if (
        !comparisonAnalysis ||
        !Array.isArray(comparisonAnalysis.winnerByCategory) ||
        typeof comparisonAnalysis.recommendationSummary !== 'string'
      ) {
        const sortedByPrice = [...selectedProducts].sort(
          (a, b) => a.priceINR - b.priceINR
        );

        const sortedByRating = [...selectedProducts].sort(
          (a, b) => b.rating - a.rating
        );

        comparisonAnalysis = {
          winnerByCategory: [
            {
              category: 'Value for Money',
              winnerId: sortedByPrice[0].id,
              rationale: `${sortedByPrice[0].name} has the lowest listed price at ₹${sortedByPrice[0].priceINR.toLocaleString('en-IN')}.`
            },
            {
              category: 'Customer Satisfaction',
              winnerId: sortedByRating[0].id,
              rationale: `${sortedByRating[0].name} has the highest listed rating at ${sortedByRating[0].rating}★.`
            }
          ],
          recommendationSummary: `Choose ${sortedByPrice[0].name} for the lowest price, or consider ${sortedByRating[0].name} for its higher rating.`
        };
      }

      comparisonAnalysis.winnerByCategory =
        comparisonAnalysis.winnerByCategory.map(
          (item: any) => ({
            ...item,
            winnerId: selectedProducts.some(
              (product) => product.id === item.winnerId
            )
              ? item.winnerId
              : selectedProducts[0].id
          })
        );

      res.json({
        success: true,
        products: selectedProducts,
        analysis: comparisonAnalysis
      });
    } catch (error) {
      sendInternalError(res, 'Comparison failed.', error);
    }
  }
);

// -----------------------------------------------------------------------------
// 4. API: Policy Engine Evaluation
// -----------------------------------------------------------------------------

app.post(
  '/api/policy/evaluate',
  (req: Request, res: Response) => {
    try {
      const {
        productId,
        missionBudgetINR = 10000,
        userSpendingLimitINR = 25000
      } = req.body ?? {};

      const product = getProduct(productId);

      if (!product) {
        res.status(404).json({
          error: 'Product not found.'
        });
        return;
      }

      if (
        !isPositiveFiniteNumber(missionBudgetINR) ||
        !isPositiveFiniteNumber(userSpendingLimitINR)
      ) {
        res.status(400).json({
          error: 'Budget and spending limit must be positive numbers.'
        });
        return;
      }

      const currentLedgerSpend = orderLedger
        .filter(
          (order) => order.paymentStatus === 'COMPLETED'
        )
        .reduce(
          (sum, order) => sum + order.amountINR,
          0
        );

      const verdict = defaultPolicyEngine.evaluateOrder({
        product,
        missionBudgetINR: Number(missionBudgetINR),
        userSpendingLimitINR: Number(userSpendingLimitINR),
        currentLedgerTotalINR: currentLedgerSpend
      });

      res.json({
        success: true,
        verdict,
        policyConfig: defaultPolicyEngine.getConfig()
      });
    } catch (error) {
      sendInternalError(res, 'Policy evaluation failed.', error);
    }
  }
);

// -----------------------------------------------------------------------------
// 5. API: PayPal Order Creation
// -----------------------------------------------------------------------------

app.post(
  '/api/paypal/create-order',
  async (req: Request, res: Response) => {
    try {
      const {
        productId,
        currency = 'INR',
        missionBudgetINR = 10000,
        userSpendingLimitINR = 25000
      } = req.body ?? {};

      const product = getProduct(productId);

      if (!product) {
        res.status(404).json({
          error: 'Product not found.'
        });
        return;
      }

      if (!['INR', 'USD', 'EUR'].includes(currency)) {
        res.status(400).json({
          error: 'Unsupported currency.'
        });
        return;
      }

      if (
        !isPositiveFiniteNumber(missionBudgetINR) ||
        !isPositiveFiniteNumber(userSpendingLimitINR)
      ) {
        res.status(400).json({
          error: 'Budget and spending limit must be positive numbers.'
        });
        return;
      }

      const verdict = defaultPolicyEngine.evaluateOrder({
        product,
        missionBudgetINR: Number(missionBudgetINR),
        userSpendingLimitINR: Number(userSpendingLimitINR)
      });

      if (verdict.status === 'BLOCKED') {
        res.status(403).json({
          error:
            'Order creation was blocked by the Spending Intelligence Guardian.',
          verdict
        });
        return;
      }

      if (!PAYPAL_CONFIGURED) {
        res.status(503).json({
          error:
            'PayPal is not configured. Add PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET to the server environment.'
        });
        return;
      }

      const accessToken = await getPayPalAccessToken();

      if (!accessToken) {
        res.status(502).json({
          error:
            'Could not authenticate with PayPal. Check the server credentials.'
        });
        return;
      }

      // Use the server's own origin rather than trusting a client-supplied
      // Origin header for PayPal redirects.
      const host = req.get('host') || `localhost:${PORT}`;
      const origin = `${req.protocol}://${host}`;

      const usdValue = getExpectedUSD(product);

      const returnUrl =
        `${origin}/?paypal_action=return&productId=${encodeURIComponent(product.id)}`;

      const cancelUrl =
        `${origin}/?paypal_action=cancel&productId=${encodeURIComponent(product.id)}`;

      const paypalResult = await paypalRequest<any>(
        '/v2/checkout/orders',
        accessToken,
        'POST',
        {
          intent: 'CAPTURE',
          purchase_units: [
            {
              reference_id: product.id,
              description: product.name.slice(0, 120),
              amount: {
                currency_code: 'USD',
                value: usdValue
              }
            }
          ],
          application_context: {
            brand_name: 'KRYVON Autonomous Commerce',
            landing_page: 'NO_PREFERENCE',
            user_action: 'PAY_NOW',
            return_url: returnUrl,
            cancel_url: cancelUrl
          }
        }
      );

      if (!paypalResult.ok || !paypalResult.data?.id) {
        console.error(
          '[PayPal] Create order failed:',
          paypalResult.status,
          paypalResult.data
        );

        res.status(502).json({
          error: 'PayPal could not create the checkout order.'
        });
        return;
      }

      const paypalOrderId = paypalResult.data.id as string;

      const approveLink = Array.isArray(
        paypalResult.data.links
      )
        ? paypalResult.data.links.find(
            (link: any) => link.rel === 'approve'
          )?.href
        : undefined;

      if (!approveLink) {
        res.status(502).json({
          error: 'PayPal did not return an approval URL.'
        });
        return;
      }

      pendingPayPalOrders.set(paypalOrderId, {
        productId: product.id,
        productName: product.name,
        amountINR: product.priceINR,
        currency: 'INR',
        createdAt: Date.now()
      });

      console.log('[PayPal] Checkout order created:', {
        paypalOrderId,
        productId: product.id,
        amountUSD: usdValue,
        mode: PAYPAL_MODE
      });

      res.json({
        success: true,
        paypalOrderId,
        approveUrl: approveLink,
        mode: PAYPAL_MODE,
        amountINR: product.priceINR,
        productName: product.name,
        currency: 'INR',
        policyStatus: verdict.status
      });
    } catch (error) {
      sendInternalError(
        res,
        'PayPal order creation failed.',
        error
      );
    }
  }
);

// -----------------------------------------------------------------------------
// 6. API: PayPal Order Inspection
// -----------------------------------------------------------------------------

app.get(
  '/api/paypal/order/:paypalOrderId',
  async (req: Request, res: Response) => {
    try {
      const { paypalOrderId } = req.params;

      if (!isNonEmptyString(paypalOrderId)) {
        res.status(400).json({
          error: 'Valid PayPal order ID is required.'
        });
        return;
      }

      const accessToken = await getPayPalAccessToken();

      if (!accessToken) {
        res.status(502).json({
          error: 'Could not authenticate with PayPal.'
        });
        return;
      }

      const orderResult = await paypalRequest<any>(
        `/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}`,
        accessToken,
        'GET'
      );

      if (!orderResult.ok || !orderResult.data) {
        res.status(orderResult.status || 502).json({
          error: 'Could not retrieve PayPal order status.'
        });
        return;
      }

      res.json({
        success: true,
        status: orderResult.data.status,
        order: orderResult.data
      });
    } catch (error) {
      sendInternalError(
        res,
        'Order status check failed.',
        error
      );
    }
  }
);

// -----------------------------------------------------------------------------
// 7. API: PayPal Capture
// -----------------------------------------------------------------------------

app.post(
  '/api/paypal/capture-order',
  async (req: Request, res: Response) => {
    try {
      const { paypalOrderId, productId } = req.body ?? {};

      if (
        !isNonEmptyString(paypalOrderId) ||
        !isNonEmptyString(productId)
      ) {
        res.status(400).json({
          error:
            'A valid PayPal order ID and product ID are required.'
        });
        return;
      }

      const product = getProduct(productId);

      if (!product) {
        res.status(404).json({
          error: 'The purchased product could not be found.'
        });
        return;
      }

      const pendingOrder = pendingPayPalOrders.get(paypalOrderId);

      // If we still have the pending record, make sure it matches.
      if (pendingOrder) {
        if (pendingOrder.productId !== productId) {
          res.status(400).json({
            error:
              'This PayPal order does not match the selected product.'
          });
          return;
        }

        if (
          Date.now() - pendingOrder.createdAt >
          60 * 60 * 1000
        ) {
          pendingPayPalOrders.delete(paypalOrderId);

          res.status(410).json({
            error:
              'This checkout order has expired. Please start checkout again.'
          });
          return;
        }
      }

      const accessToken = await getPayPalAccessToken();

      if (!accessToken) {
        res.status(502).json({
          error:
            'Could not authenticate with PayPal to verify the payment.'
        });
        return;
      }

      // Always inspect the PayPal order before attempting capture.
      const orderCheck = await paypalRequest<any>(
        `/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}`,
        accessToken,
        'GET'
      );

      if (!orderCheck.ok || !orderCheck.data) {
        console.error('[PayPal] Order inspection failed:', {
          status: orderCheck.status,
          paypalOrderId
        });

        res.status(502).json({
          error:
            'Could not verify the PayPal order. Please try again.'
        });
        return;
      }

      const orderData = orderCheck.data;
      const currentStatus = orderData.status;

      // Verify that the order actually belongs to this catalogue product.
      if (!verifyPayPalOrderProduct(orderData, product)) {
        console.error('[PayPal] Product verification failed:', {
          paypalOrderId,
          productId,
          orderStatus: currentStatus
        });

        res.status(400).json({
          error:
            'The PayPal order details do not match the selected product.'
        });
        return;
      }

      // If PayPal has already completed the capture, record it instead
      // of attempting another capture.
      if (currentStatus === 'COMPLETED') {
        const existing = orderLedger.find(
          (order) => order.paypalOrderId === paypalOrderId
        );

        if (existing) {
          pendingPayPalOrders.delete(paypalOrderId);

          res.json({
            success: true,
            captureStatus: 'COMPLETED',
            order: existing,
            alreadyCaptured: true
          });

          return;
        }

        const existingCapture = getPayPalCapture(orderData);

        const verification = verifyPayPalCapture(
          orderData,
          existingCapture,
          product
        );

        if (!verification.valid) {
          console.error(
            '[PayPal] Completed order could not be verified:',
            {
              paypalOrderId,
              orderStatus: currentStatus,
              captureStatus:
                existingCapture?.status || 'MISSING',
              captureIdPresent: Boolean(existingCapture?.id),
              reason: verification.reason
            }
          );

          res.status(402).json({
            error:
              'PayPal reports a completed order, but its capture could not be verified.',
            paypalStatus: currentStatus,
            captureStatus:
              existingCapture?.status || 'MISSING'
          });

          return;
        }

        const recoveredOrder = recordCompletedPayment(
          paypalOrderId,
          existingCapture,
          product,
          orderData
        );

        res.json({
          success: true,
          captureStatus: 'COMPLETED',
          order: recoveredOrder,
          alreadyCaptured: true
        });

        return;
      }

      if (
        currentStatus === 'CREATED' ||
        currentStatus === 'PAYER_ACTION_REQUIRED'
      ) {
        res.status(400).json({
          error:
            'This PayPal order has not been approved yet. Please complete approval on the PayPal portal before capturing payment.',
          paypalStatus: currentStatus,
          approveUrl: orderData.links?.find(
            (link: any) => link.rel === 'approve'
          )?.href
        });

        return;
      }

      if (currentStatus === 'VOIDED') {
        res.status(410).json({
          error: 'This PayPal order was voided or cancelled.',
          paypalStatus: currentStatus
        });

        return;
      }

      if (currentStatus !== 'APPROVED') {
        console.error('[PayPal] Unexpected order status:', {
          paypalOrderId,
          currentStatus
        });

        res.status(409).json({
          error:
            'PayPal has not approved this order for capture yet.',
          paypalStatus: currentStatus || 'UNKNOWN'
        });

        return;
      }

      // Capture only an APPROVED order.
      // The request ID makes repeated capture requests idempotent.
      const captureResult = await paypalRequest<any>(
        `/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}/capture`,
        accessToken,
        'POST',
        {},
        paypalOrderId
      );

      if (!captureResult.ok || !captureResult.data) {
        console.error(
          '[PayPal] Capture request failed:',
          captureResult.status,
          JSON.stringify(captureResult.data ?? null, null, 2)
        );

        const paypalError =
          (captureResult.data as any)?.details?.[0]?.description ||
          (captureResult.data as any)?.message ||
          'PayPal did not confirm the payment capture.';

        res.status(502).json({
          error: paypalError,
          paypalStatus:
            (captureResult.data as any)?.status || 'UNKNOWN'
        });

        return;
      }

      const paypalData = captureResult.data;
      const capture = getPayPalCapture(paypalData);

      const verification = verifyPayPalCapture(
        paypalData,
        capture,
        product
      );

      if (!verification.valid) {
        console.error('[PayPal] Capture not confirmed:', {
          orderStatus: paypalData?.status || 'UNKNOWN',
          captureStatus: capture?.status || 'MISSING',
          captureIdPresent: Boolean(capture?.id),
          purchaseUnitsCount:
            paypalData?.purchase_units?.length ?? 0,
          captureAmount: capture?.amount ?? null,
          reason: verification.reason
        });

        res.status(402).json({
          error:
            'PayPal has not confirmed a completed payment.',
          paypalStatus: paypalData?.status || 'UNKNOWN',
          captureStatus: capture?.status || 'MISSING'
        });

        return;
      }

      // Record only a verified, completed PayPal capture.
      const newLedgerItem = recordCompletedPayment(
        paypalOrderId,
        capture,
        product,
        paypalData
      );

      console.log('[PayPal] Payment successfully captured:', {
        paypalOrderId,
        captureId: capture.id,
        productId: product.id,
        captureStatus: capture.status,
        amount: capture.amount
      });

      res.json({
        success: true,
        captureStatus: 'COMPLETED',
        order: newLedgerItem
      });
    } catch (error) {
      sendInternalError(
        res,
        'PayPal capture failed.',
        error
      );
    }
  }
);

// -----------------------------------------------------------------------------
// 8. API: Order Ledger & History
// -----------------------------------------------------------------------------

app.get('/api/ledger/orders', (_req: Request, res: Response) => {
  res.json({
    success: true,
    orders: orderLedger,
    totalExpenditureINR: orderLedger
      .filter(
        (order) => order.paymentStatus === 'COMPLETED'
      )
      .reduce(
        (sum, order) => sum + order.amountINR,
        0
      )
  });
});

// -----------------------------------------------------------------------------
// 9. API: PayPal Refund
// -----------------------------------------------------------------------------

app.post(
  '/api/ledger/refund',
  async (req: Request, res: Response) => {
    try {
      const { orderId } = req.body ?? {};

      if (!isNonEmptyString(orderId)) {
        res.status(400).json({
          error: 'A valid order ID is required.'
        });
        return;
      }

      const order = orderLedger.find(
        (item) => item.orderId === orderId
      );

      if (!order) {
        res.status(404).json({
          error: 'Order not found in the order ledger.'
        });
        return;
      }

      if (order.paymentStatus !== 'COMPLETED') {
        res.status(409).json({
          error: 'Only completed orders can be refunded.'
        });
        return;
      }

      // Seed demo records do not represent real PayPal captures.
      if (order.paypalCaptureId.startsWith('CAP-7492')) {
        res.status(400).json({
          error:
            'This is a seed demo record and cannot be refunded against PayPal. You can place a genuine PayPal Sandbox purchase to test refunds.'
        });

        return;
      }

      const accessToken = await getPayPalAccessToken();

      if (!accessToken) {
        res.status(502).json({
          error:
            'Could not authenticate with PayPal to issue the refund.'
        });

        return;
      }

      const refundResult = await paypalRequest<any>(
        `/v2/payments/captures/${encodeURIComponent(order.paypalCaptureId)}/refund`,
        accessToken,
        'POST',
        {},
        `refund-${order.paypalCaptureId}`
      );

      if (!refundResult.ok || !refundResult.data?.id) {
        console.error(
          '[PayPal] Refund request failed:',
          refundResult.status,
          refundResult.data
        );

        const detailMsg =
          refundResult.data?.message ||
          refundResult.data?.details?.[0]?.description ||
          'PayPal did not confirm the refund. The order remains completed.';

        res.status(502).json({
          error: detailMsg
        });

        return;
      }

      const refundStatus = refundResult.data.status;

      if (!['COMPLETED', 'PENDING'].includes(refundStatus)) {
        res.status(502).json({
          error:
            'PayPal returned an unconfirmed refund status. The order remains completed.'
        });

        return;
      }

      if (
        refundStatus === 'COMPLETED' ||
        refundStatus === 'PENDING'
      ) {
        order.paymentStatus = 'REFUNDED';
        verifiedCaptureIds.delete(order.paypalCaptureId);
      }

      res.json({
        success: true,
        refundStatus,
        message:
          refundStatus === 'COMPLETED'
            ? `PayPal confirmed the refund for order ${orderId}.`
            : `PayPal accepted the refund request for order ${orderId}; it is currently pending.`,
        order
      });
    } catch (error) {
      sendInternalError(
        res,
        'Refund request failed.',
        error
      );
    }
  }
);

// -----------------------------------------------------------------------------
// Vite middleware / static asset serving
// -----------------------------------------------------------------------------

async function startServer() {
  const assetsPath = path.resolve(
    process.cwd(),
    'src',
    'assets'
  );

  app.use('/src/assets', express.static(assetsPath));

  if (IS_PRODUCTION) {
    const distPath = path.resolve(
      process.cwd(),
      'dist'
    );

    app.use(express.static(distPath));

    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(
        path.join(distPath, 'index.html')
      );
    });
  } else {
    const { createServer: createViteServer } =
      await import('vite');

    const vite = await createViteServer({
      server: {
        middlewareMode: true
      },
      appType: 'spa'
    });

    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(
      `[KRYVON] Commerce server listening on port ${PORT}`
    );

    console.log(
      `[KRYVON] Environment: ${process.env.NODE_ENV || 'development'}`
    );

    console.log(
      `[KRYVON] Gemini: ${
        genAI
          ? `configured (${GEMINI_MODEL})`
          : 'not configured (fallback mode)'
      }`
    );

    console.log(
      `[KRYVON] PayPal: ${
        PAYPAL_CONFIGURED
          ? PAYPAL_MODE
          : 'not configured'
      }`
    );
  });
}

startServer().catch((error) => {
  console.error(
    '[KRYVON] Server startup failed:',
    error
  );

  process.exit(1);
});
