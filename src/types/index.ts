export type CurrencyCode = 'INR' | 'USD' | 'EUR';

export interface ProductSpecs {
  brand: string;
  model: string;
  batteryLife?: string;
  connectivity?: string;
  noiseCancellation?: string;
  weight?: string;
  warranty?: string;
  driverSize?: string;
  displayType?: string;
  refreshRate?: string;
  switchType?: string;
  waterResistance?: string;
  color?: string;
  [key: string]: string | undefined;
}

export interface Product {
  id: string;
  name: string;
  category: 'audio' | 'peripherals' | 'wearables' | 'workspace';
  priceINR: number;
  originalPriceINR: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  image: string;
  badge?: string;
  summary: string;
  specs: ProductSpecs;
  strengths: string[];
  weaknesses: string[];
  matchScore?: number; // 0-100 calculated by agent
  aiRecommendationReason?: string;
}

export type PolicyStatus = 'ALLOWED' | 'APPROVAL_REQUIRED' | 'BLOCKED';

export interface PolicyRuleConfig {
  autoApprovalMaxINR: number;     // Below this: ALLOWED automatically
  requireApprovalMaxINR: number; // Between auto & require: APPROVAL_REQUIRED. Above this: BLOCKED.
  categoryRestrictionsEnabled: boolean;
  blockedCategories: string[];
  requireDualConfirmationForOverINR: number;
}

export interface PolicyViolation {
  code: string;
  severity: 'WARNING' | 'BLOCK';
  message: string;
}

export interface PolicyVerdict {
  status: PolicyStatus;
  primaryReason: string;
  orderTotalINR: number;
  budgetHeadroomINR: number;
  violations: PolicyViolation[];
  evaluatedAt: string;
  requiresUserSignature: boolean;
}

export type MissionPriority = 'price' | 'quality' | 'features' | 'durability';

export interface ShoppingMission {
  id: string;
  query: string;
  maxBudgetINR: number;
  priority: MissionPriority;
  categoryPreference?: string;
  createdAt: string;
  status: 'idle' | 'analyzing' | 'evaluating' | 'verifying' | 'completed' | 'failed';
}

export interface AgentStageLog {
  stage: 'intent' | 'discovery' | 'evaluation' | 'policy' | 'readiness';
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  timestamp: string;
  details?: Record<string, any>;
}

export interface LedgerOrder {
  orderId: string;
  paypalOrderId: string;
  paypalCaptureId: string;
  productId: string;
  productName: string;
  productImage: string;
  amountINR: number;
  amountCharged: number;
  currency: CurrencyCode;
  paymentMethod: string;
  paymentStatus: 'COMPLETED' | 'PENDING' | 'REFUNDED' | 'FAILED';
  policyStatusAtPurchase: PolicyStatus;
  createdAt: string;
  payerEmail: string;
  payerName: string;
}

export interface SystemStatus {
  geminiModel: string;
  geminiConnected: boolean;
  paypalMode: 'sandbox_live' | 'sandbox_simulated';
  policyEngineActive: boolean;
  catalogueItemCount: number;
}
