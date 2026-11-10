import React from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Activity,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  Heart,
  IndianRupee,
  Package,
  ShieldCheck,
  ShoppingBag,
  Wallet,
  XCircle,
  AlertCircle,
} from 'lucide-react';

import { CurrencyCode, LedgerOrder, SystemStatus, AgentStageLog } from '../types';
import { formatPrice } from '../utils/currency';

interface DashboardProps {
  orders: LedgerOrder[];
  currency: CurrencyCode;
  totalSpentInLedgerINR: number;
  userSpendingLimitINR: number;
  wishlistCount: number;
  catalogueCount: number;
  systemStatus: SystemStatus | null;
  missionLogs: AgentStageLog[];
  missionSummary: string;
  isMissionLoading: boolean;
  isOrdersLoading: boolean;
  onNavigate: (section: 'workspace' | 'discovery' | 'wishlist' | 'guardian' | 'ledger') => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return 'Date unavailable';

  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const statusStyles: Record<string, string> = {
  COMPLETED: 'bg-emerald-50 text-emerald-700',
  PENDING: 'bg-amber-50 text-amber-700',
  REFUNDED: 'bg-slate-100 text-slate-700',
  FAILED: 'bg-rose-50 text-rose-700',
};

const Dashboard: React.FC<DashboardProps> = ({
  orders,
  currency,
  totalSpentInLedgerINR,
  userSpendingLimitINR,
  wishlistCount,
  catalogueCount,
  systemStatus,
  missionLogs,
  missionSummary,
  isMissionLoading,
  isOrdersLoading,
  onNavigate,
}) => {
  const remainingBudget = Math.max(
    0,
    userSpendingLimitINR - totalSpentInLedgerINR
  );

  const budgetPercentage =
    userSpendingLimitINR > 0
      ? Math.min(
          100,
          (totalSpentInLedgerINR / userSpendingLimitINR) * 100
        )
      : 0;

  const completedOrders = orders.filter(
    (order) => order.paymentStatus === 'COMPLETED'
  ).length;

  const recentOrders = orders.slice(0, 4);
  const latestMissionLog = missionLogs[missionLogs.length - 1];

  const serviceStatus = (value: boolean | undefined, label: string) => {
    if (value === undefined) {
      return (
        <span className="inline-flex items-center gap-2 text-xs text-slate-700">
          <span className="h-2 w-2 rounded-full bg-slate-300" />
          {label}: Checking
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-2 text-xs text-slate-700">
        <span
          className={`h-2 w-2 rounded-full ${
            value ? 'bg-emerald-500' : 'bg-amber-400'
          }`}
        />
        {label}: {value ? 'Connected' : 'Not configured'}
      </span>
    );
  };

  return (
    <main className="min-h-screen bg-[#f8f7f4] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* PAGE INTRO */}
        <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#0369A1]">
              KRYVON / YOUR SPACE
            </p>

            <h1 className="text-3xl font-semibold tracking-tight text-[#172554] sm:text-4xl">
              Your dashboard<span className="text-[#0284C7]">.</span>
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-[#475569]">
              A clear view of your shopping activity, spending and AI-powered
              decisions â€” all in one place.
            </p>
          </div>

          <button
            onClick={() => onNavigate('workspace')}
            className="inline-flex w-fit items-center gap-2 rounded-full bg-[#172554] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#51413b]"
          >
            Start a shopping mission
            <ArrowUpRight size={16} />
          </button>
        </section>

        {/* OVERVIEW STATS */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-2xl border border-[#ebe6df] bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#475569]">Total spending</span>
              <span className="rounded-xl bg-[#f5efeb] p-2 text-[#0369A1]">
                <Wallet size={18} />
              </span>
            </div>
            <p className="mt-5 text-2xl font-semibold tracking-tight text-[#172554]">
              {formatPrice(totalSpentInLedgerINR, currency)}
            </p>
            <p className="mt-1 text-xs text-[#64748B]">
              Completed payments only
            </p>
          </div>

          <div className="rounded-2xl border border-[#ebe6df] bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#475569]">Orders placed</span>
              <span className="rounded-xl bg-[#f0f1ed] p-2 text-[#0369A1]">
                <ShoppingBag size={18} />
              </span>
            </div>
            <p className="mt-5 text-2xl font-semibold tracking-tight text-[#172554]">
              {orders.length}
            </p>
            <p className="mt-1 text-xs text-[#64748B]">
              {completedOrders} completed payments
            </p>
          </div>

          <div className="rounded-2xl border border-[#ebe6df] bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#475569]">Wishlist</span>
              <span className="rounded-xl bg-[#f5edf0] p-2 text-[#0369A1]">
                <Heart size={18} />
              </span>
            </div>
            <p className="mt-5 text-2xl font-semibold tracking-tight text-[#172554]">
              {wishlistCount}
            </p>
            <button
              onClick={() => onNavigate('wishlist')}
              className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-[#0369A1] hover:text-[#172554]"
            >
              View saved products <ArrowRight size={13} />
            </button>
          </div>

          <div className="rounded-2xl border border-[#ebe6df] bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#475569]">Catalogue</span>
              <span className="rounded-xl bg-[#efeff5] p-2 text-[#475569]">
                <Package size={18} />
              </span>
            </div>
            <p className="mt-5 text-2xl font-semibold tracking-tight text-[#172554]">
              {catalogueCount}
            </p>
            <p className="mt-1 text-xs text-[#64748B]">
              Products available in the catalogue
            </p>
          </div>
        </section>

        {/* BUDGET + AI ACTIVITY */}
        <section className="grid grid-cols-1 gap-5 lg:grid-cols-5">

          {/* BUDGET PANEL */}
          <div className="rounded-2xl border border-[#e9e1d9] bg-[#f0ebe4] p-6 sm:p-7 lg:col-span-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#475569]">
                  Spending overview
                </p>
                <h2 className="mt-2 text-xl font-semibold text-[#1E293B]">
                  Your budget at a glance
                </h2>
              </div>
              <span className="rounded-xl bg-white/70 p-2.5 text-[#475569]">
                <IndianRupee size={19} />
              </span>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-5">
              <div>
                <p className="text-xs text-[#475569]">Spent so far</p>
                <p className="mt-1 text-xl font-semibold text-[#1E293B] sm:text-2xl">
                  {formatPrice(totalSpentInLedgerINR, currency)}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#475569]">Available balance</p>
                <p className="mt-1 text-xl font-semibold text-[#0369A1] sm:text-2xl">
                  {formatPrice(remainingBudget, currency)}
                </p>
              </div>
            </div>

            <div className="mt-7">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="font-semibold text-[#334155]">
                  Budget utilisation
                </span>
                <span className="font-semibold text-[#334155]">
                  {budgetPercentage.toFixed(1)}%
                </span>
              </div>

              <div className="h-2.5 overflow-hidden rounded-full bg-white/80">
                <div
                  className="h-full rounded-full bg-[#94766a] transition-all duration-500"
                  style={{ width: `${budgetPercentage}%` }}
                />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-[#475569]">
                Spending limit: {formatPrice(userSpendingLimitINR, currency)}
              </p>

              <button
                onClick={() => onNavigate('guardian')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#334155] hover:text-[#172554]"
              >
                Open Budget Guardian <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* AI ACTIVITY PANEL */}
          <div className="rounded-2xl border border-[#e8e4eb] bg-white p-6 sm:p-7 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#475569]">
                  Intelligent shopping
                </p>
                <h2 className="mt-2 text-xl font-semibold text-[#1E293B]">
                  AI activity
                </h2>
              </div>
              <span className="rounded-xl bg-[#f1eff5] p-2.5 text-[#475569]">
                <BrainCircuit size={20} />
              </span>
            </div>

            <div className="mt-7">
              {isMissionLoading ? (
                <div className="flex items-center gap-3 rounded-xl bg-[#f7f5f8] p-4">
                  <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#8d7da4]" />
                  <div>
                    <p className="text-sm font-semibold text-[#334155]">
                      Mission in progress
                    </p>
                    <p className="mt-1 text-xs text-[#475569]">
                      Your AI agent is working through the shopping process.
                    </p>
                  </div>
                </div>
              ) : missionSummary ? (
                <div className="rounded-xl bg-[#f7f5f8] p-4">
                  <p className="text-sm font-semibold text-[#334155]">
                    Latest mission summary
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#475569]">
                    {missionSummary}
                  </p>
                </div>
              ) : (
                <div className="rounded-xl bg-[#f7f5f8] p-4">
                  <p className="text-sm font-semibold text-[#334155]">
                    No recent mission
                  </p>
                  <p className="mt-1 text-xs leading-5 text-[#475569]">
                    Your AI shopping activity will appear here when you run a
                    shopping mission.
                  </p>
                </div>
              )}
            </div>

            {latestMissionLog && (
              <div className="mt-4 flex items-center gap-2 text-xs text-[#475569]">
                <Activity size={14} />
                Latest stage: {latestMissionLog.title}
              </div>
            )}

            <button
              onClick={() => onNavigate('workspace')}
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#475569] hover:text-[#334155]"
            >
              Open AI Workspace <ArrowRight size={15} />
            </button>
          </div>
        </section>

        {/* RECENT ORDERS */}
        <section className="overflow-hidden rounded-2xl border border-[#ebe6df] bg-white">
          <div className="flex flex-col justify-between gap-3 border-b border-[#f0ece7] px-5 py-5 sm:flex-row sm:items-center sm:px-7">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0369A1]">
                Purchase history
              </p>
              <h2 className="mt-1 text-xl font-semibold text-[#1E293B]">
                Recent orders
              </h2>
            </div>

            <button
              onClick={() => onNavigate('ledger')}
              className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#0369A1] hover:text-[#334155]"
            >
              View Activity Ledger <ArrowRight size={15} />
            </button>
          </div>

          {isOrdersLoading ? (
            <div className="px-6 py-12 text-center text-sm text-[#475569]">
              Loading your orders...
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f5f1ed] text-[#92766b]">
                <Package size={21} />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-[#1E293B]">
                No orders yet
              </h3>
              <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-[#475569]">
                Your purchases will appear here once you complete your first
                checkout.
              </p>
              <button
                onClick={() => onNavigate('discovery')}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#172554] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#51413b]"
              >
                Explore products <ArrowRight size={14} />
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#f1ede8]">
              {recentOrders.map((order) => (
                <div
                  key={order.orderId}
                  className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-[#f5f2ee]">
                      {order.productImage ? (
                        <img
                          src={order.productImage}
                          alt={order.productName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[#475569]">
                          <Package size={18} />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#1E293B]">
                        {order.productName}
                      </p>
                      <p className="mt-1 text-xs text-[#64748B]">
                        {formatDate(order.createdAt)} Â· {order.orderId}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:justify-end">
                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-semibold tracking-wide ${
                        statusStyles[order.paymentStatus] ||
                        'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {order.paymentStatus}
                    </span>

                    <span className="min-w-[90px] text-right text-sm font-semibold text-[#1E293B]">
                      {formatPrice(order.amountINR, currency)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* SYSTEM STATUS */}
        <section className="rounded-2xl border border-[#ebe6df] bg-white px-5 py-5 sm:px-7">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={17} className="text-[#475569]" />
                <h2 className="text-sm font-semibold text-[#1E293B]">
                  KRYVON system status
                </h2>
              </div>
              <p className="mt-1 text-xs text-[#64748B]">
                Connection and service availability
              </p>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {serviceStatus(systemStatus?.geminiConnected, 'Gemini AI')}
              {serviceStatus(
                systemStatus?.paypalCheckoutAvailable,
                'PayPal checkout'
              )}
              {serviceStatus(systemStatus?.policyEngineActive, 'Policy engine')}
            </div>
          </div>
        </section>

        {/* QUICK NAVIGATION */}
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            {
              title: 'Discover products',
              description: 'Explore the product catalogue.',
              section: 'discovery' as const,
              icon: Package,
            },
            {
              title: 'Manage your wishlist',
              description: 'Return to your saved products.',
              section: 'wishlist' as const,
              icon: Heart,
            },
            {
              title: 'Review your spending',
              description: 'Manage your shopping budget.',
              section: 'guardian' as const,
              icon: Wallet,
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.title}
                onClick={() => onNavigate(item.section)}
                className="group flex items-center justify-between rounded-2xl border border-[#ebe6df] bg-white p-5 text-left transition hover:border-[#cbb9ad] hover:bg-[#fcfaf8]"
              >
                <div className="flex items-center gap-3">
                  <span className="rounded-xl bg-[#f4efea] p-2.5 text-[#475569]">
                    <Icon size={18} />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-[#1E293B]">
                      {item.title}
                    </span>
                    <span className="mt-1 block text-xs text-[#64748B]">
                      {item.description}
                    </span>
                  </span>
                </div>
                <ArrowUpRight
                  size={17}
                  className="text-[#64748B] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </button>
            );
          })}
        </section>

      </div>
    </main>
  );
};

export default Dashboard;
