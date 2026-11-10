
import React, { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  CurrencyCode,
  Product,
  AgentStageLog,
  LedgerOrder,
  PolicyRuleConfig,
  PolicyVerdict,
  MissionPriority,
  SystemStatus,
} from './types';

import { INITIAL_CATALOGUE } from './data/catalogue';
import { defaultPolicyEngine, DEFAULT_POLICY_CONFIG } from './services/policyEngine';

import { Header } from './components/Header';
import KryvonHomeHero from './components/KryvonHomeHero';
import { ShoppingWorkspace } from './components/ShoppingWorkspace';
import { AgentActivityTimeline } from './components/AgentActivityTimeline';
import { ProductCard } from './components/ProductCard';
import { ProductComparisonModal } from './components/ProductComparisonModal';
import { BudgetGuardian } from './components/BudgetGuardian';
import { PayPalCheckoutModal } from './components/PayPalCheckoutModal';
import { PaymentSuccessModal } from './components/PaymentSuccessModal';
import { OrderLedger } from './components/OrderLedger';
import { WishlistSection } from './components/WishlistSection';
import Dashboard from './components/Dashboard';
import { Footer } from './components/Footer';
import { CartDrawer, type CartItem } from './components/CartDrawer';

import { Sparkles, ArrowLeft, ArrowRight } from 'lucide-react';

type KryvonCategory = 'audio' | 'mobile' | 'computing' | 'gaming';

type SectionName =
  | 'home'
  | 'dashboard'
  | 'workspace'
  | 'discovery'
  | 'wishlist'
  | 'guardian'
  | 'ledger';

export default function App() {
  // --------------------------------------------------
  // NAVIGATION & PREFERENCES
  // --------------------------------------------------

  const [activeSection, setActiveSection] = useState<SectionName>('home');

  const changeSection = (section: SectionName) => {
    setActiveSection(section);
  };

  // --------------------------------------------------
  // PREVIOUS / NEXT SECTION NAVIGATION
  // --------------------------------------------------

  const navigationSections: SectionName[] = [
    'home',
    'dashboard',
    'workspace',
    'discovery',
    'wishlist',
    'guardian',
    'ledger',
  ];

  const currentSectionIndex = navigationSections.indexOf(activeSection);

  const canGoBack = currentSectionIndex > 0;

  const canGoForward =
    currentSectionIndex < navigationSections.length - 1;

  const navigateSection = (direction: -1 | 1) => {
    const nextIndex = currentSectionIndex + direction;

    if (nextIndex < 0 || nextIndex >= navigationSections.length) {
      return;
    }

    setActiveSection(navigationSections[nextIndex]);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const goBack = () => navigateSection(-1);

  const goForward = () => navigateSection(1);

  const [currency, setCurrency] = useState<CurrencyCode>('INR');

  const [selectedCollection, setSelectedCollection] =
    useState<KryvonCategory>('audio');

  // --------------------------------------------------
  // CATALOGUE & PRODUCT FILTERS
  // --------------------------------------------------

  const [products, setProducts] = useState<Product[]>(INITIAL_CATALOGUE);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const [sortBy, setSortBy] = useState<
    'score' | 'price-asc' | 'price-desc' | 'rating'
  >('score');

  // --------------------------------------------------
  // WISHLIST PERSISTENCE
  // --------------------------------------------------

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kryvon_wishlist_ids');
      return saved ? JSON.parse(saved) : ['kry-aud-01'];
    } catch {
      return ['kry-aud-01'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        'kryvon_wishlist_ids',
        JSON.stringify(wishlistIds)
      );
    } catch (error) {
      console.warn('Could not persist wishlist:', error);
    }
  }, [wishlistIds]);

  // --------------------------------------------------
  // SHOPPING BAG
  // --------------------------------------------------

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('kryvon_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('kryvon_cart_items', JSON.stringify(cartItems));
    } catch (error) {
      console.warn('Could not persist shopping bag:', error);
    }
  }, [cartItems]);

  const cartCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const handleAddToCart = (product: Product) => {
    setCartItems((previous) => {
      const existing = previous.find((item) => item.product.id === product.id);

      if (existing) {
        return previous.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...previous, { product, quantity: 1 }];
    });

    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems((previous) =>
        previous.filter((item) => item.product.id !== productId)
      );
      return;
    }

    setCartItems((previous) =>
      previous.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((previous) =>
      previous.filter((item) => item.product.id !== productId)
    );
  };

  // --------------------------------------------------
  // AI SHOPPING MISSION STATE
  // --------------------------------------------------

  const [isMissionLoading, setIsMissionLoading] = useState(false);

  const [missionLogs, setMissionLogs] = useState<AgentStageLog[]>([]);

  const [missionSummary, setMissionSummary] = useState('');

  const [agentRationale, setAgentRationale] = useState('');

  const [activeMissionBudgetINR, setActiveMissionBudgetINR] =
    useState(5000);

  const [userSpendingLimitINR, setUserSpendingLimitINR] =
    useState(25000);

  // --------------------------------------------------
  // POLICY ENGINE
  // --------------------------------------------------

  const [policyConfig, setPolicyConfig] =
    useState<PolicyRuleConfig>(DEFAULT_POLICY_CONFIG);

  // --------------------------------------------------
  // PRODUCT COMPARISON
  // --------------------------------------------------

  const [comparedProducts, setComparedProducts] = useState<Product[]>([]);

  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const [comparisonAnalysis, setComparisonAnalysis] = useState<any>(null);

  // --------------------------------------------------
  // CHECKOUT & ORDER LEDGER
  // --------------------------------------------------

  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);

  const [successOrder, setSuccessOrder] = useState<LedgerOrder | null>(null);

  const [orders, setOrders] = useState<LedgerOrder[]>([]);

  const [isOrdersLoading, setIsOrdersLoading] = useState(false);

  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);

  // --------------------------------------------------
  // INITIAL DATA & PAYPAL REDIRECT HANDLING
  // --------------------------------------------------

  useEffect(() => {
    fetchOrders();
    fetchSystemStatus();

    const params = new URLSearchParams(window.location.search);

    const paypalAction = params.get('paypal_action');
    const token = params.get('token');
    const productId = params.get('productId');

    if (paypalAction === 'return' && token) {
      if (window.opener) {
        window.opener.postMessage(
          { type: 'PAYPAL_ORDER_APPROVED', token },
          window.location.origin
        );

        window.close();
        return;
      }

      if (productId) {
        finalizePayPalRedirect(token, productId);
      }
    } else if (paypalAction === 'cancel') {
      window.history.replaceState({}, '', window.location.pathname);

      alert('PayPal Sandbox payment authorization was cancelled.');
    }
  }, []);

  const finalizePayPalRedirect = async (
    paypalOrderId: string,
    productId: string
  ) => {
    try {
      window.history.replaceState({}, '', window.location.pathname);

      const res = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paypalOrderId,
          productId,
        }),
      });

      const data = await res.json();

      if (res.ok && data.order) {
        handlePaymentSuccess(data.order);
      } else {
        alert(
          data.error ||
            'Could not capture PayPal payment after redirect.'
        );
      }
    } catch (error) {
      console.error('Failed to capture returned PayPal order:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      setIsOrdersLoading(true);

      const res = await fetch('/api/ledger/orders');

      if (res.ok) {
        const data = await res.json();

        if (data.orders) {
          setOrders(data.orders);
        }
      }
    } catch (error) {
      console.warn('Could not fetch ledger orders:', error);
    } finally {
      setIsOrdersLoading(false);
    }
  };

  const fetchSystemStatus = async () => {
    try {
      const res = await fetch('/api/system/status');

      if (res.ok) {
        const data = await res.json();
        setSystemStatus(data);
      }
    } catch (error) {
      console.warn('Could not fetch system status:', error);
    }
  };

  // --------------------------------------------------
  // TOTAL SPENDING
  // --------------------------------------------------

  const totalSpentInLedgerINR = useMemo(() => {
    return orders
      .filter((order) => order.paymentStatus === 'COMPLETED')
      .reduce((sum, order) => sum + order.amountINR, 0);
  }, [orders]);

  // --------------------------------------------------
  // CATEGORY NAVIGATION
  // --------------------------------------------------

  const handleOpenCollection = (category: KryvonCategory) => {
    setSelectedCollection(category);

    setSelectedCategory(category);

    setActiveSection('discovery');

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // --------------------------------------------------
  // WISHLIST ACTIONS
  // --------------------------------------------------

  const handleToggleWishlist = (product: Product) => {
    setWishlistIds((prev) =>
      prev.includes(product.id)
        ? prev.filter((id) => id !== product.id)
        : [...prev, product.id]
    );
  };

  const handleRemoveFromWishlist = (productId: string) => {
    setWishlistIds((prev) =>
      prev.filter((id) => id !== productId)
    );
  };

  const handleClearWishlist = () => {
    setWishlistIds([]);
  };

  // --------------------------------------------------
  // LAUNCH AI MISSION FOR A PRODUCT
  // --------------------------------------------------

  const handleLaunchMissionForProduct = (product: Product) => {
    const missionQuery = [
      'Find alternatives or accessories for ' + product.name,
      'under â‚¹' + product.priceINR.toLocaleString('en-IN'),
    ].join(' ');

    handleRunMission(missionQuery, product.priceINR, 'quality');
  };

  // --------------------------------------------------
  // AUTONOMOUS AI SHOPPING MISSION
  // --------------------------------------------------

  const handleRunMission = async (
    query: string,
    maxBudget: number,
    priority: MissionPriority
  ) => {
    setIsMissionLoading(true);
    setActiveMissionBudgetINR(maxBudget);
    setActiveSection('workspace');

    const nowStr = () => new Date().toLocaleTimeString();

    const initialLogs: AgentStageLog[] = [
      {
        stage: 'intent',
        title: '01. Intent Deconstruction',
        description: 'Analyzing natural language mission: "' + query + '"',
        status: 'in_progress',
        timestamp: nowStr(),
        details: {
          Query: query,
          Budget: 'â‚¹' + maxBudget.toLocaleString('en-IN'),
          Priority: priority,
        },
      },
    ];

    setMissionLogs(initialLogs);

    try {
      await new Promise((resolve) => setTimeout(resolve, 450));

      setMissionLogs((prev) => {
        const next = [...prev];

        if (next[0]) {
          next[0] = { ...next[0], status: 'completed' };
        }

        next[1] = {
          stage: 'discovery',
          title: '02. Catalogue Discovery',
          description:
            'Scanning ' + products.length + ' verified tech products in catalogue',
          status: 'in_progress',
          timestamp: nowStr(),
        };

        return next;
      });

      const res = await fetch('/api/agent/mission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          maxBudgetINR: maxBudget,
          priority,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'AI shopping mission failed.');
      }

      await new Promise((resolve) => setTimeout(resolve, 400));

      setMissionLogs((prev) => {
        const next = [...prev];

        if (next[0]) {
          next[0] = { ...next[0], status: 'completed' };
        }

        if (next[1]) {
          next[1] = { ...next[1], status: 'completed' };
        }

        next[2] = {
          stage: 'evaluation',
          title: '03. Multi-Factor Evaluation',
          description:
            'Evaluating specifications, battery life, noise cancellation, and trade-offs',
          status: 'in_progress',
          timestamp: nowStr(),
        };

        return next;
      });

      await new Promise((resolve) => setTimeout(resolve, 400));

      setMissionLogs((prev) => {
        const next = [...prev];

        if (next[0]) {
          next[0] = { ...next[0], status: 'completed' };
        }

        if (next[1]) {
          next[1] = { ...next[1], status: 'completed' };
        }

        if (next[2]) {
          next[2] = { ...next[2], status: 'completed' };
        }

        const formatMoney = (amount: number) =>
          'â‚¹' + amount.toLocaleString('en-IN');

        next[3] = {
          stage: 'policy',
          title: '04. Spending Policy Verification',
          description:
            'Checking spending policies against ' +
            formatMoney(maxBudget) +
            ' boundary and auto-clear threshold',
          status: 'completed',
          timestamp: nowStr(),
          details: {
            'Auto-Clear Cap': formatMoney(policyConfig.autoApprovalMaxINR),
            'Review Ceiling': formatMoney(policyConfig.requireApprovalMaxINR),
          },
        };

        next[4] = {
          stage: 'readiness',
          title: '05. Ready for Autonomous Execution',
          description:
            'Recommendations grounded in verified specs with transparent buy/review gates',
          status: 'completed',
          timestamp: nowStr(),
        };

        return next;
      });

      if (data.success && data.products) {
        setProducts(data.products);
        setMissionSummary(data.missionSummary || '');
        setAgentRationale(data.agentRationale || '');

        if (
          data.categoryIdentified &&
          data.categoryIdentified !== 'tech' &&
          data.categoryIdentified !== 'all'
        ) {
          setSelectedCategory(data.categoryIdentified);
        }
      }
    } catch (error: any) {
      console.error('Mission failed:', error);

      setMissionLogs((prev) => [
        ...prev,
        {
          stage: 'intent',
          title: 'Mission Error',
          description:
            error?.message || 'Failed to complete autonomous mission.',
          status: 'failed',
          timestamp: nowStr(),
        },
      ]);
    } finally {
      setIsMissionLoading(false);
    }
  };

  // --------------------------------------------------
  // PRODUCT COMPARISON
  // --------------------------------------------------

  const handleToggleCompare = (product: Product) => {
    setComparedProducts((prev) => {
      const exists = prev.some((item) => item.id === product.id);

      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      }

      if (prev.length >= 3) {
        alert('You can compare a maximum of 3 products simultaneously.');
        return prev;
      }

      return [...prev, product];
    });
  };

  const handleOpenComparison = async () => {
    if (comparedProducts.length < 2) return;

    setIsCompareModalOpen(true);

    try {
      const res = await fetch('/api/agent/compare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productIds: comparedProducts.map((product) => product.id),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setComparisonAnalysis(data.analysis);
      }
    } catch (error) {
      console.warn('Comparison analysis fetch failed:', error);
    }
  };

  // --------------------------------------------------
  // PURCHASE POLICY CHECK
  // --------------------------------------------------

  const handleInitiatePurchase = (product: Product) => {
    const verdict = defaultPolicyEngine.evaluateOrder({
      product,
      missionBudgetINR: activeMissionBudgetINR,
      userSpendingLimitINR,
      currentLedgerTotalINR: totalSpentInLedgerINR,
    });

    if (verdict.status === 'BLOCKED') {
      alert(
        'Purchase Blocked by Guardian: ' +
          (verdict.primaryReason || 'Policy restrictions apply.')
      );
      return;
    }

    setCheckoutProduct(product);
  };

  // --------------------------------------------------
  // PAYMENT SUCCESS
  // --------------------------------------------------

  const handlePaymentSuccess = (newOrder: LedgerOrder) => {
    setCheckoutProduct(null);

    setSuccessOrder(newOrder);

    setOrders((prev) => [newOrder, ...prev]);
  };

  // --------------------------------------------------
  // REFUND HANDLING
  // --------------------------------------------------

  const handleRefund = async (orderId: string) => {
    try {
      const res = await fetch('/api/ledger/refund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setOrders((prev) =>
          prev.map((order) =>
            order.orderId === orderId
              ? {
                  ...order,
                  paymentStatus: 'REFUNDED',
                }
              : order
          )
        );

        alert(data.message || 'Refund confirmed for order ' + orderId + '.');
      } else {
        alert(
          'Refund Failed: ' +
            (data.error || 'Server rejected the refund request.')
        );
      }
    } catch (error: any) {
      console.error('Refund failed:', error);

      alert('Refund error: ' + (error.message || 'Network error occurred.'));
    }
  };

  // --------------------------------------------------
  // PRODUCT FILTERING & SORTING
  // --------------------------------------------------

  const displayedProducts = useMemo(() => {
    let list = [...products];

    if (selectedCategory === 'computing') {
      list = list.filter((product) =>
        ['peripherals', 'workspace'].includes(product.category)
      );
    } else if (selectedCategory !== 'all') {
      list = list.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (sortBy === 'score') {
      list.sort(
        (a, b) => (b.matchScore || 50) - (a.matchScore || 50)
      );
    } else if (sortBy === 'price-asc') {
      list.sort((a, b) => a.priceINR - b.priceINR);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.priceINR - a.priceINR);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [products, selectedCategory, sortBy]);

  // --------------------------------------------------
  // LIVE POLICY VERDICT
  // --------------------------------------------------

  const getProductPolicyVerdict = (
    product: Product
  ): PolicyVerdict => {
    return defaultPolicyEngine.evaluateOrder({
      product,
      missionBudgetINR: activeMissionBudgetINR,
      userSpendingLimitINR,
      currentLedgerTotalINR: totalSpentInLedgerINR,
    });
  };

  // --------------------------------------------------
  // APPLICATION UI
  // --------------------------------------------------

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-cyan-500/20 selection:text-cyan-900">

      {/* GLOBAL NAVIGATION */}

      <Header
        activeSection={activeSection}
        setActiveSection={(section) =>
          setActiveSection(section as any)
        }
        currency={currency}
        setCurrency={setCurrency}
        comparisonCount={comparedProducts.length}
        openComparison={handleOpenComparison}
        onNewMission={() => {
          setActiveSection('workspace');

          window.scrollTo({
            top: 350,
            behavior: 'smooth',
          });
        }}
        wishlistCount={wishlistIds.length}
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* MAIN CONTENT */}

  <main className="flex-1 bg-white">

        {/* DASHBOARD */}
        {activeSection === 'dashboard' && (
          <Dashboard
            orders={orders}
            currency={currency}
            totalSpentInLedgerINR={totalSpentInLedgerINR}
            userSpendingLimitINR={userSpendingLimitINR}
            wishlistCount={wishlistIds.length}
            catalogueCount={systemStatus?.catalogueItemCount ?? products.length}
            systemStatus={systemStatus}
            missionLogs={missionLogs}
            missionSummary={missionSummary}
            isMissionLoading={isMissionLoading}
            isOrdersLoading={isOrdersLoading}
            onNavigate={(section) => setActiveSection(section)}
          />
        )}

        {/* HOMEPAGE */}

        {activeSection === 'home' && (
          <KryvonHomeHero
            cartCount={cartCount}
            onOpenCart={() => {
              document
                .getElementById('discovery-section')
                ?.scrollIntoView({
                  behavior: 'smooth',
                });
            }}
            onOpenCollection={handleOpenCollection}
          />
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">

          {/* AI SHOPPING WORKSPACE */}

          {(activeSection === 'home' ||
            activeSection === 'workspace') && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                ease: 'easeOut',
              }}
              id="workspace-section"
            >
              <ShoppingWorkspace
                onRunMission={handleRunMission}
                isLoading={isMissionLoading}
                currency={currency}
                currentBudget={activeMissionBudgetINR}
              />

              <AgentActivityTimeline
                logs={missionLogs}
                missionSummary={missionSummary}
                agentRationale={agentRationale}
                isProcessing={isMissionLoading}
              />
            </motion.section>
          )}

          {/* PRODUCT DISCOVERY */}

          {(activeSection === 'home' ||
            activeSection === 'workspace' ||
            activeSection === 'discovery') && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                ease: 'easeOut',
              }}
              id="discovery-section"
              className="space-y-6"
            >

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">

                <div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-cyan-600" />

                    <span>
                      {selectedCategory === 'all'
                        ? 'Intelligent Product Discovery'
                        : selectedCategory.charAt(0).toUpperCase() +
                          selectedCategory.slice(1) +
                          ' Collection'}
                    </span>
                  </h2>

                  <p className="text-xs text-slate-500 mt-0.5">
                    Verified catalogue items ranked by AI fit score and verified against spending policies.
                  </p>
                </div>

                {/* CATEGORY FILTERS & SORTING */}

                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">

                  <div className="flex flex-wrap items-center p-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold">

                    {[
                      { id: 'all', label: 'All Products' },
                      { id: 'audio', label: 'Audio' },
                      { id: 'mobile', label: 'Mobile' },
                      { id: 'computing', label: 'Computing' },
                      { id: 'gaming', label: 'Gaming' },
                    ].map((category) => (
                      <button
                        key={category.id}
                        onClick={() => {
                          setSelectedCategory(category.id);

                          if (
                            ['audio', 'mobile', 'computing', 'gaming'].includes(
                              category.id
                            )
                          ) {
                            setSelectedCollection(
                              category.id as KryvonCategory
                            );
                          }
                        }}
                        className={[
                          'relative px-3 py-1.5 rounded transition-colors whitespace-nowrap cursor-pointer',
                          selectedCategory === category.id
                            ? 'text-cyan-800 font-bold'
                            : 'text-slate-600 hover:text-slate-900',
                        ].join(' ')}
                      >
                        {selectedCategory === category.id && (
                          <motion.span
                            layoutId="category-pill"
                            className="absolute inset-0 bg-white rounded shadow-xs"
                            transition={{
                              type: 'spring',
                              stiffness: 500,
                              damping: 38,
                            }}
                          />
                        )}

                        <span className="relative">
                          {category.label}
                        </span>
                      </button>
                    ))}

                  </div>

                  <div className="flex items-center gap-1.5 text-xs">
                    <select
                      value={sortBy}
                      onChange={(event) =>
                        setSortBy(event.target.value as any)
                      }
                      className="bg-slate-50 border border-slate-300 text-slate-700 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 font-mono"
                    >
                      <option value="score">
                        Sort: AI Match Score
                      </option>

                      <option value="price-asc">
                        Sort: Price (Low to High)
                      </option>

                      <option value="price-desc">
                        Sort: Price (High to Low)
                      </option>

                      <option value="rating">
                        Sort: User Rating
                      </option>
                    </select>
                  </div>

                </div>
              </div>

              {/* EMPTY COLLECTION STATE */}

              {displayedProducts.length === 0 && (
                <div className="py-20 text-center">
                  <p className="text-2xl text-slate-800 font-serif italic">
                    A new collection is on its way.
                  </p>

                  <p className="text-sm text-slate-500 mt-3">
                    We're preparing more products for this collection.
                  </p>

                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setActiveSection('discovery');
                    }}
                    className="mt-6 text-sm underline underline-offset-4 text-slate-700 hover:text-black"
                  >
                    Explore all products
                  </button>
                </div>
              )}

              {/* PRODUCT CARDS */}

              {displayedProducts.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                  <AnimatePresence mode="popLayout">
                    {displayedProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        layout
                        className="h-full"
                        initial={{
                          opacity: 0,
                          y: 24,
                          scale: 0.96,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          scale: 1,
                        }}
                        exit={{
                          opacity: 0,
                          scale: 0.94,
                        }}
                        whileHover={{
                          y: -4,
                        }}
                        transition={{
                          type: 'spring',
                          stiffness: 300,
                          damping: 28,
                          delay: Math.min(index, 8) * 0.04,
                        }}
                      >
                        <ProductCard
                          product={product}
                          currency={currency}
                          onInitiatePurchase={handleInitiatePurchase}
                          onAddToCart={handleAddToCart}
                          isCompared={comparedProducts.some(
                            (item) => item.id === product.id
                          )}
                          onToggleCompare={handleToggleCompare}
                          policyVerdict={getProductPolicyVerdict(product)}
                          isWishlisted={wishlistIds.includes(product.id)}
                          onToggleWishlist={handleToggleWishlist}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>

                </div>
              )}

            </motion.section>
          )}

          {/* WISHLIST */}

          {(activeSection === 'home' ||
            activeSection === 'wishlist') && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                ease: 'easeOut',
              }}
              id="wishlist-section"
            >
              <WishlistSection
                wishlistProducts={products.filter((product) =>
                  wishlistIds.includes(product.id)
                )}
                currency={currency}
                onRemoveFromWishlist={handleRemoveFromWishlist}
                onClearWishlist={handleClearWishlist}
                onInitiatePurchase={handleInitiatePurchase}
                onLaunchMissionForProduct={handleLaunchMissionForProduct}
                onBrowseCatalogue={() =>
                  setActiveSection('discovery')
                }
                getProductPolicyVerdict={getProductPolicyVerdict}
              />
            </motion.section>
          )}

          {/* BUDGET GUARDIAN */}

          {(activeSection === 'home' ||
            activeSection === 'guardian') && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                ease: 'easeOut',
              }}
              id="guardian-section"
            >
              <BudgetGuardian
                policyConfig={policyConfig}
                onUpdateConfig={(newConfig) => {
                  setPolicyConfig((prev) => {
                    const updated = {
                      ...prev,
                      ...newConfig,
                    };

                    defaultPolicyEngine.updateConfig(updated);

                    return updated;
                  });
                }}
                userSpendingLimitINR={userSpendingLimitINR}
                onUpdateUserSpendingLimit={(value) =>
                  setUserSpendingLimitINR(value)
                }
                missionBudgetINR={activeMissionBudgetINR}
                selectedProduct={displayedProducts[0]}
                policyVerdict={
                  displayedProducts[0]
                    ? getProductPolicyVerdict(displayedProducts[0])
                    : undefined
                }
                currency={currency}
                totalSpentInLedgerINR={totalSpentInLedgerINR}
              />
            </motion.section>
          )}

          {/* ACTIVITY LEDGER */}

          {(activeSection === 'home' ||
            activeSection === 'ledger') && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                ease: 'easeOut',
              }}
              id="ledger-section"
            >
              <OrderLedger
                orders={orders}
                currency={currency}
                onRefund={handleRefund}
                isLoading={isOrdersLoading}
              />
            </motion.section>
          )}

        </div>
      </main>

      {/* MODALS */}

      <AnimatePresence>

        {/* PRODUCT COMPARISON */}

        {isCompareModalOpen && (
          <ProductComparisonModal
            key="compare-modal"
            products={comparedProducts}
            currency={currency}
            onClose={() => setIsCompareModalOpen(false)}
            onRemove={(id) =>
              setComparedProducts((prev) =>
                prev.filter((product) => product.id !== id)
              )
            }
            onSelectForPurchase={(product) => {
              setIsCompareModalOpen(false);
              handleInitiatePurchase(product);
            }}
            comparisonAnalysis={comparisonAnalysis}
          />
        )}

        {/* PAYPAL CHECKOUT */}

        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cartItems}
          currency={currency}
          onUpdateQuantity={handleUpdateCartQuantity}
          onRemove={handleRemoveFromCart}
          onContinueShopping={() => {
            setIsCartOpen(false);
            setActiveSection('discovery');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
        {checkoutProduct && (
          <PayPalCheckoutModal
            key="checkout-modal"
            product={checkoutProduct}
            currency={currency}
            policyVerdict={getProductPolicyVerdict(checkoutProduct)}
            onClose={() => setCheckoutProduct(null)}
            onPaymentSuccess={handlePaymentSuccess}
          />
        )}

        {/* PAYMENT SUCCESS */}

        {successOrder && (
          <PaymentSuccessModal
            key="success-modal"
            order={successOrder}
            currency={currency}
            onClose={() => setSuccessOrder(null)}
            onViewLedger={() => {
              setSuccessOrder(null);
              setActiveSection('ledger');
            }}
          />
        )}

      </AnimatePresence>

      {/* FOOTER */}

      <Footer
        onNavigate={(section) => {
          switch (section) {
            case 'home':
            case 'dashboard':
            case 'workspace':
            case 'discovery':
            case 'wishlist':
            case 'guardian':
            case 'ledger':
              changeSection(section);
              break;
          }
        }}
      />

      {/* FLOATING PREVIOUS / NEXT NAVIGATION */}

      <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-3">

        <button
          type="button"
          onClick={goBack}
          disabled={!canGoBack}
          aria-label="Go to previous section"
          title="Previous section"
          className="
            flex h-12 w-12 items-center justify-center
            rounded-full border border-[#641F36]/15
            bg-white text-[#641F36]
            shadow-lg shadow-black/10
            transition-all duration-200
            hover:-translate-y-1 hover:bg-[#641F36]
            hover:text-white hover:shadow-xl
            disabled:cursor-not-allowed
            disabled:opacity-35 disabled:hover:translate-y-0
            disabled:hover:bg-white disabled:hover:text-[#641F36]
          "
        >
          <ArrowLeft size={20} />
        </button>

        <button
          type="button"
          onClick={goForward}
          disabled={!canGoForward}
          aria-label="Go to next section"
          title="Next section"
          className="
            flex h-12 w-12 items-center justify-center
            rounded-full bg-[#641F36] text-white
            shadow-lg shadow-black/15
            transition-all duration-200
            hover:-translate-y-1 hover:bg-[#7D2D48]
            hover:shadow-xl
            disabled:cursor-not-allowed
            disabled:opacity-35 disabled:hover:translate-y-0
            disabled:hover:bg-[#641F36]
          "
        >
          <ArrowRight size={20} />
        </button>

      </div>

    </div>
  );
}




