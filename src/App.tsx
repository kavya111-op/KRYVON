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
  SystemStatus 
} from './types';
import { INITIAL_CATALOGUE } from './data/catalogue';
import { defaultPolicyEngine, DEFAULT_POLICY_CONFIG } from './services/policyEngine';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ShoppingWorkspace } from './components/ShoppingWorkspace';
import { AgentActivityTimeline } from './components/AgentActivityTimeline';
import { ProductCard } from './components/ProductCard';
import { ProductComparisonModal } from './components/ProductComparisonModal';
import { BudgetGuardian } from './components/BudgetGuardian';
import { PayPalCheckoutModal } from './components/PayPalCheckoutModal';
import { PaymentSuccessModal } from './components/PaymentSuccessModal';
import { OrderLedger } from './components/OrderLedger';
import { WishlistSection } from './components/WishlistSection';
import { Footer } from './components/Footer';
import { Sparkles } from 'lucide-react';

export default function App() {
  // Navigation & Preferences
  const [activeSection, setActiveSection] = useState<'home' | 'workspace' | 'discovery' | 'wishlist' | 'guardian' | 'ledger'>('home');
  const [currency, setCurrency] = useState<CurrencyCode>('INR');

  // Catalogue & Missions State
  const [products, setProducts] = useState<Product[]>(INITIAL_CATALOGUE);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'score' | 'price-asc' | 'price-desc' | 'rating'>('score');

  // Wishlist Persistent State
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
      localStorage.setItem('kryvon_wishlist_ids', JSON.stringify(wishlistIds));
    } catch (e) {
      console.warn('Could not persist wishlist to localStorage:', e);
    }
  }, [wishlistIds]);
  
  // Mission & Agent State
  const [isMissionLoading, setIsMissionLoading] = useState(false);
  const [missionLogs, setMissionLogs] = useState<AgentStageLog[]>([]);
  const [missionSummary, setMissionSummary] = useState<string>('');
  const [agentRationale, setAgentRationale] = useState<string>('');
  const [activeMissionBudgetINR, setActiveMissionBudgetINR] = useState<number>(5000);
  const [userSpendingLimitINR, setUserSpendingLimitINR] = useState<number>(25000);

  // Policy Engine State
  const [policyConfig, setPolicyConfig] = useState<PolicyRuleConfig>(DEFAULT_POLICY_CONFIG);

  // Comparison State
  const [comparedProducts, setComparedProducts] = useState<Product[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [comparisonAnalysis, setComparisonAnalysis] = useState<any>(null);

  // Checkout & Ledger State
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [successOrder, setSuccessOrder] = useState<LedgerOrder | null>(null);
  const [orders, setOrders] = useState<LedgerOrder[]>([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(false);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);

  // Fetch initial ledger and system status
  useEffect(() => {
    fetchOrders();
    fetchSystemStatus();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsOrdersLoading(true);
      const res = await fetch('/api/ledger/orders');
      if (res.ok) {
        const data = await res.json();
        if (data.orders) setOrders(data.orders);
      }
    } catch (err) {
      console.warn('Could not fetch ledger orders:', err);
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
    } catch (err) {
      console.warn('Could not fetch system status:', err);
    }
  };

  // Calculate total spent in ledger
  const totalSpentInLedgerINR = useMemo(() => {
    return orders
      .filter((o) => o.paymentStatus === 'COMPLETED')
      .reduce((sum, o) => sum + o.amountINR, 0);
  }, [orders]);

  // Wishlist Actions
  const handleToggleWishlist = (product: Product) => {
    setWishlistIds((prev) =>
      prev.includes(product.id) ? prev.filter((id) => id !== product.id) : [...prev, product.id]
    );
  };

  const handleRemoveFromWishlist = (productId: string) => {
    setWishlistIds((prev) => prev.filter((id) => id !== productId));
  };

  const handleClearWishlist = () => {
    setWishlistIds([]);
  };

  const handleLaunchMissionForProduct = (product: Product) => {
    const missionQuery = `Find alternatives or accessories for ${product.name} under ₹${product.priceINR.toLocaleString('en-IN')}`;
    handleRunMission(missionQuery, product.priceINR, 'quality');
  };

  // Execute Natural-Language Shopping Mission
  const handleRunMission = async (query: string, maxBudget: number, priority: MissionPriority) => {
    setIsMissionLoading(true);
    setActiveMissionBudgetINR(maxBudget);
    setActiveSection('workspace');

    const nowStr = () => new Date().toLocaleTimeString();

    // Stage 1: Intent
    const initialLogs: AgentStageLog[] = [
      {
        stage: 'intent',
        title: '01. Intent Deconstruction',
        description: `Analyzing natural language mission: "${query}"`,
        status: 'in_progress',
        timestamp: nowStr(),
        details: { Query: query, Budget: `₹${maxBudget.toLocaleString('en-IN')}`, Priority: priority }
      }
    ];
    setMissionLogs(initialLogs);

    try {
      // Step progression
      await new Promise(r => setTimeout(r, 450));
      setMissionLogs(prev => [
        { ...prev[0], status: 'completed' },
        {
          stage: 'discovery',
          title: '02. Catalogue Discovery',
          description: `Scanning ${products.length} verified tech products in catalogue`,
          status: 'in_progress',
          timestamp: nowStr()
        }
      ]);

      const res = await fetch('/api/agent/mission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, maxBudgetINR: maxBudget, priority }),
      });

      const data = await res.json();

      await new Promise(r => setTimeout(r, 400));
      setMissionLogs(prev => [
        prev[0],
        { ...prev[1], status: 'completed' },
        {
          stage: 'evaluation',
          title: '03. Multi-Factor Evaluation',
          description: 'Evaluating specifications, battery life, noise cancellation, and trade-offs',
          status: 'in_progress',
          timestamp: nowStr()
        }
      ]);

      await new Promise(r => setTimeout(r, 400));
      setMissionLogs(prev => [
        prev[0],
        prev[1],
        { ...prev[2], status: 'completed' },
        {
          stage: 'policy',
          title: '04. Spending Policy Verification',
          description: `Checking spending policies against ₹${maxBudget.toLocaleString('en-IN')} boundary and auto-clear threshold`,
          status: 'completed',
          timestamp: nowStr(),
          details: {
            'Auto-Clear Cap': `₹${policyConfig.autoApprovalMaxINR.toLocaleString('en-IN')}`,
            'Review Ceiling': `₹${policyConfig.requireApprovalMaxINR.toLocaleString('en-IN')}`
          }
        },
        {
          stage: 'readiness',
          title: '05. Ready for Autonomous Execution',
          description: 'Recommendations grounded in verified specs with transparent buy/review gates',
          status: 'completed',
          timestamp: nowStr()
        }
      ]);

      if (data.success && data.products) {
        setProducts(data.products);
        setMissionSummary(data.missionSummary || '');
        setAgentRationale(data.agentRationale || '');
        if (data.categoryIdentified && data.categoryIdentified !== 'tech' && data.categoryIdentified !== 'all') {
          setSelectedCategory(data.categoryIdentified);
        }
      }
    } catch (err: any) {
      console.error('Mission failed:', err);
      setMissionLogs(prev => [
        ...prev,
        {
          stage: 'intent',
          title: 'Mission Error',
          description: err.message || 'Failed to complete autonomous mission.',
          status: 'failed',
          timestamp: nowStr()
        }
      ]);
    } finally {
      setIsMissionLoading(false);
    }
  };

  // Toggle Product Comparison
  const handleToggleCompare = (product: Product) => {
    setComparedProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds: comparedProducts.map((p) => p.id) }),
      });
      if (res.ok) {
        const data = await res.json();
        setComparisonAnalysis(data.analysis);
      }
    } catch (err) {
      console.warn('Comparison analysis fetch failed:', err);
    }
  };

  // Initiate Purchase Flow (checks policy first)
  const handleInitiatePurchase = (product: Product) => {
    const verdict = defaultPolicyEngine.evaluateOrder({
      product,
      missionBudgetINR: activeMissionBudgetINR,
      userSpendingLimitINR: userSpendingLimitINR,
      currentLedgerTotalINR: totalSpentInLedgerINR,
    });

    if (verdict.status === 'BLOCKED') {
      alert(`Purchase Blocked: ${verdict.primaryReason}`);
      return;
    }

    setCheckoutProduct(product);
  };

  const handlePaymentSuccess = (newOrder: LedgerOrder) => {
    setCheckoutProduct(null);
    setSuccessOrder(newOrder);
    setOrders((prev) => [newOrder, ...prev]);
  };

  const handleRefund = async (orderId: string) => {
    try {
      const res = await fetch('/api/ledger/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.orderId === orderId ? { ...o, paymentStatus: 'REFUNDED' } : o))
        );
      }
    } catch (err) {
      console.error('Refund failed:', err);
    }
  };

  // Filter and Sort Products
  const displayedProducts = useMemo(() => {
    let list = [...products];
    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (sortBy === 'score') {
      list.sort((a, b) => (b.matchScore || 50) - (a.matchScore || 50));
    } else if (sortBy === 'price-asc') {
      list.sort((a, b) => a.priceINR - b.priceINR);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.priceINR - a.priceINR);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [products, selectedCategory, sortBy]);

  // Compute live policy verdict for any product
  const getProductPolicyVerdict = (product: Product): PolicyVerdict => {
    return defaultPolicyEngine.evaluateOrder({
      product,
      missionBudgetINR: activeMissionBudgetINR,
      userSpendingLimitINR: userSpendingLimitINR,
      currentLedgerTotalINR: totalSpentInLedgerINR,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-cyan-500/20 selection:text-cyan-900">
      {/* Top Bar Navigation */}
      <Header
        activeSection={activeSection}
        setActiveSection={(s) => setActiveSection(s as any)}
        currency={currency}
        setCurrency={setCurrency}
        comparisonCount={comparedProducts.length}
        openComparison={handleOpenComparison}
        onNewMission={() => {
          setActiveSection('workspace');
          window.scrollTo({ top: 350, behavior: 'smooth' });
        }}
        wishlistCount={wishlistIds.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 bg-white">
        {/* Landing Hero Section */}
        {activeSection === 'home' && (
          <Hero
            onStartShopping={() => {
              setActiveSection('workspace');
              window.scrollTo({ top: 400, behavior: 'smooth' });
            }}
            onExploreWorkflow={() => {
              setActiveSection('guardian');
            }}
          />
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
          {/* AI Shopping Workspace Section */}
          {(activeSection === 'home' || activeSection === 'workspace') && (
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "easeOut" }} id="workspace-section">
              <ShoppingWorkspace
                onRunMission={handleRunMission}
                isLoading={isMissionLoading}
                currency={currency}
                currentBudget={activeMissionBudgetINR}
              />

              {/* Agent Decision Timeline */}
              <AgentActivityTimeline
                logs={missionLogs}
                missionSummary={missionSummary}
                agentRationale={agentRationale}
                isProcessing={isMissionLoading}
              />
            </motion.section>
          )}

          {/* Product Discovery Section */}
          {(activeSection === 'home' || activeSection === 'workspace' || activeSection === 'discovery') && (
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "easeOut" }} id="discovery-section" className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-cyan-600" />
                    <span>Intelligent Product Discovery</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Verified catalogue items ranked by AI fit score and verified against spending policies.
                  </p>
                </div>

                {/* Filter and Sort Tabs */}
                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                  {/* Category Tabs */}
                  <div className="flex items-center p-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold">
                    {[
                      { id: 'all', label: 'All Tech' },
                      { id: 'audio', label: 'Audio' },
                      { id: 'peripherals', label: 'Peripherals' },
                      { id: 'wearables', label: 'Wearables' },
                      { id: 'workspace', label: 'Workspace' },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`relative px-3 py-1 rounded transition-colors whitespace-nowrap cursor-pointer ${
                          selectedCategory === cat.id
                            ? 'text-cyan-800 font-bold'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {selectedCategory === cat.id && (
                          <motion.span
                            layoutId="category-pill"
                            className="absolute inset-0 bg-white rounded shadow-xs"
                            transition={{ type: "spring", stiffness: 500, damping: 38 }}
                          />
                        )}
                        <span className="relative">{cat.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Sort Selector */}
                  <div className="flex items-center gap-1.5 text-xs">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-slate-50 border border-slate-300 text-slate-700 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 font-mono"
                    >
                      <option value="score">Sort: AI Match Score</option>
                      <option value="price-asc">Sort: Price (Low to High)</option>
                      <option value="price-desc">Sort: Price (High to Low)</option>
                      <option value="rating">Sort: User Rating</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Product Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                {displayedProducts.map((product, i) => (
                  <motion.div
                    key={product.id}
                    layout
                    className="h-full"
                    initial={{ opacity: 0, y: 24, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    whileHover={{ y: -4 }}
                    transition={{ type: "spring", stiffness: 300, damping: 28, delay: Math.min(i, 8) * 0.04 }}
                  >
                  <ProductCard
                    product={product}
                    currency={currency}
                    onInitiatePurchase={handleInitiatePurchase}
                    isCompared={comparedProducts.some((p) => p.id === product.id)}
                    onToggleCompare={handleToggleCompare}
                    policyVerdict={getProductPolicyVerdict(product)}
                    isWishlisted={wishlistIds.includes(product.id)}
                    onToggleWishlist={handleToggleWishlist}
                  />
                  </motion.div>
                ))}
                </AnimatePresence>
              </div>
            </motion.section>
          )}

          {/* Dedicated Wishlist Section */}
          {(activeSection === 'home' || activeSection === 'wishlist') && (
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "easeOut" }} id="wishlist-section">
              <WishlistSection
                wishlistProducts={products.filter((p) => wishlistIds.includes(p.id))}
                currency={currency}
                onRemoveFromWishlist={handleRemoveFromWishlist}
                onClearWishlist={handleClearWishlist}
                onInitiatePurchase={handleInitiatePurchase}
                onLaunchMissionForProduct={handleLaunchMissionForProduct}
                onBrowseCatalogue={() => setActiveSection('discovery')}
                getProductPolicyVerdict={getProductPolicyVerdict}
              />
            </motion.section>
          )}

          {/* Spending Intelligence / Budget Guardian Section */}
          {(activeSection === 'home' || activeSection === 'guardian') && (
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "easeOut" }} id="guardian-section">
              <BudgetGuardian
                policyConfig={policyConfig}
                onUpdateConfig={(newCfg) => {
                  setPolicyConfig((prev) => {
                    const updated = { ...prev, ...newCfg };
                    defaultPolicyEngine.updateConfig(updated);
                    return updated;
                  });
                }}
                userSpendingLimitINR={userSpendingLimitINR}
                onUpdateUserSpendingLimit={(val) => setUserSpendingLimitINR(val)}
                missionBudgetINR={activeMissionBudgetINR}
                selectedProduct={displayedProducts[0]}
                policyVerdict={displayedProducts[0] ? getProductPolicyVerdict(displayedProducts[0]) : undefined}
                currency={currency}
                totalSpentInLedgerINR={totalSpentInLedgerINR}
              />
            </motion.section>
          )}

          {/* Activity Ledger Section */}
          {(activeSection === 'home' || activeSection === 'ledger') && (
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "easeOut" }} id="ledger-section">
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

      <AnimatePresence>
      {/* Side-by-Side Product Comparison Modal */}
      {isCompareModalOpen && (
        <ProductComparisonModal
          key="compare-modal"
          products={comparedProducts}
          currency={currency}
          onClose={() => setIsCompareModalOpen(false)}
          onRemove={(id) => setComparedProducts((prev) => prev.filter((p) => p.id !== id))}
          onSelectForPurchase={(p) => {
            setIsCompareModalOpen(false);
            handleInitiatePurchase(p);
          }}
          comparisonAnalysis={comparisonAnalysis}
        />
      )}

      {/* PayPal Sandbox Checkout Modal */}
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

      {/* Payment Success Screen Modal */}
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

      {/* Footer */}
      <Footer onNavigate={(s) => setActiveSection(s as any)} />
    </div>
  );
}
