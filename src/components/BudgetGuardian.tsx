
import React from 'react';
import { motion } from 'motion/react';
import {
  CurrencyCode,
  PolicyRuleConfig,
  PolicyVerdict,
  Product,
} from '../types';
import { formatPrice } from '../utils/currency';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  Sliders,
  Lock,
  AlertCircle,
  Wallet,
  ShoppingBag,
  PiggyBank,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';

interface BudgetGuardianProps {
  policyConfig: PolicyRuleConfig;
  onUpdateConfig: (newConfig: Partial<PolicyRuleConfig>) => void;
  userSpendingLimitINR: number;
  onUpdateUserSpendingLimit: (val: number) => void;
  missionBudgetINR: number;
  selectedProduct?: Product;
  policyVerdict?: PolicyVerdict;
  currency: CurrencyCode;
  totalSpentInLedgerINR: number;
}

export const BudgetGuardian: React.FC<BudgetGuardianProps> = ({
  policyConfig,
  onUpdateConfig,
  userSpendingLimitINR,
  onUpdateUserSpendingLimit,
  missionBudgetINR,
  selectedProduct,
  policyVerdict,
  currency,
  totalSpentInLedgerINR,
}) => {
  const currentTotal = selectedProduct ? selectedProduct.priceINR : 0;

  const remainingGlobalBudget = Math.max(
    0,
    userSpendingLimitINR - totalSpentInLedgerINR
  );

  const spendingPercentage =
    userSpendingLimitINR > 0
      ? Math.min(100, (totalSpentInLedgerINR / userSpendingLimitINR) * 100)
      : 0;

  const verdictTitle =
    policyVerdict?.status === 'ALLOWED'
      ? 'Looking good — this fits your budget'
      : policyVerdict?.status === 'APPROVAL_REQUIRED'
      ? 'A quick approval is needed'
      : 'This purchase needs another look';

  const overviewCards = [
    {
      label: 'Your overall budget',
      value: formatPrice(userSpendingLimitINR, currency),
      description: 'Your personal spending limit',
      icon: Wallet,
      card: 'bg-[#EEE7F4] border-[#DDD0E8]',
      iconStyle: 'bg-[#E3D9EC] text-[#80649A]',
      valueStyle: 'text-[#665078]',
      labelStyle: 'text-[#8A759C]',
    },
    {
      label: 'Shopping mission',
      value: formatPrice(missionBudgetINR, currency),
      description: 'Set aside for this shopping trip',
      icon: ShoppingBag,
      card: 'bg-[#F0F3EA] border-[#DCE5D5]',
      iconStyle: 'bg-[#E1EBD9] text-[#6C8B65]',
      valueStyle: 'text-[#58744F]',
      labelStyle: 'text-[#829477]',
    },
    {
      label: 'Selected product',
      value: formatPrice(currentTotal, currency),
      description: selectedProduct
        ? selectedProduct.name
        : 'Choose a product to see its price',
      icon: Sparkles,
      card: 'bg-[#F7EAE3] border-[#EBD8CC]',
      iconStyle: 'bg-[#F0DDD2] text-[#A87560]',
      valueStyle: 'text-[#94634D]',
      labelStyle: 'text-[#A17E6C]',
    },
    {
      label: 'Available to spend',
      value: formatPrice(remainingGlobalBudget, currency),
      description: `${formatPrice(totalSpentInLedgerINR, currency)} spent so far`,
      icon: PiggyBank,
      card: 'bg-[#E4EFE5] border-[#CDDFD0]',
      iconStyle: 'bg-[#D6E8D8] text-[#548064]',
      valueStyle: 'text-[#397451]',
      labelStyle: 'text-[#75937B]',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.65, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-[26px] border border-[#E4DED2] bg-[#F8F5ED] p-5 shadow-[0_12px_40px_rgba(63,48,65,0.055)] sm:p-8"
      style={{
        backgroundImage:
          'radial-gradient(circle at 100% 0%, rgba(213,195,226,0.22), transparent 28%), radial-gradient(circle at 0% 100%, rgba(190,216,198,0.23), transparent 32%)',
      }}
    >
      <div className="pointer-events-none absolute -right-20 top-24 h-64 w-64 rounded-full bg-[#E5D8EB]/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-20 h-56 w-56 rounded-full bg-[#DCE9DF]/40 blur-3xl" />

      <div className="relative z-10">

        {/* HEADER */}
        <div className="flex flex-col justify-between gap-5 border-b border-[#E5DED4] pb-6 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-3">
              <motion.span
                whileHover={{ rotate: 8, scale: 1.05 }}
                className="rounded-2xl border border-[#C9DDCE] bg-[#E5EFE6] p-3 text-[#527D61]"
              >
                <ShieldCheck className="h-6 w-6" />
              </motion.span>

              <div>
                <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#789481]">
                  Shop smart, feel confident
                </span>

                <h2 className="text-xl font-bold tracking-tight text-[#393443] sm:text-2xl">
                  Your Spending Companion
                </h2>
              </div>
            </div>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#77716F]">
              A little peace of mind while you shop. Keep an eye on your
              spending, set comfortable limits and let KRYVON help you
              make thoughtful purchase decisions.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start rounded-xl border border-[#C9DDCE] bg-[#EAF3EA] px-4 py-3 md:self-center">
            <Lock className="h-4 w-4 text-[#648B70]" />
            <span className="text-xs font-medium text-[#718775]">
              Spending protection
            </span>
            <span className="rounded-full bg-[#D8EBDD] px-2 py-1 text-[10px] font-bold text-[#477B58]">
              ACTIVE
            </span>
          </div>
        </div>

        {/* BUDGET OVERVIEW */}
        <div className="my-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {overviewCards.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                whileHover={{ y: -5 }}
                className={`rounded-2xl border p-5 shadow-sm transition-shadow hover:shadow-md ${item.card}`}
              >
                <div className="mb-5 flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-[0.12em] ${item.labelStyle}`}>
                    {item.label}
                  </span>

                  <span className={`rounded-xl p-2 ${item.iconStyle}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                </div>

                <span className={`block break-words font-mono text-2xl font-bold tabular-nums ${item.valueStyle}`}>
                  {item.value}
                </span>

                <span className="mt-2 block truncate text-xs text-[#89817D]" title={item.description}>
                  {item.description}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* SPENDING PROGRESS */}
        <div className="mb-6 rounded-2xl border border-[#E5DED4] bg-[#FFFCF7] p-5 sm:p-6 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-[#E6EFE6] p-2 text-[#648B70]">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
                <h3 className="text-sm font-bold text-[#45404A]">
                  Your spending at a glance
                </h3>
              </div>

              <p className="mt-2 text-xs text-[#89817D]">
                Here's how much of your overall budget you've used.
              </p>
            </div>

            <span className="rounded-full border border-[#DDD2E8] bg-[#F0EAF5] px-3.5 py-1.5 text-xs font-bold text-[#765F8D]">
              {spendingPercentage.toFixed(0)}% used
            </span>
          </div>

          <div
            className="h-3 overflow-hidden rounded-full bg-[#ECE6E9]"
            role="progressbar"
            aria-valuenow={Math.round(spendingPercentage)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Overall spending limit used"
          >
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${spendingPercentage}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-[#9B83B5] via-[#B69AAE] to-[#81A98F]"
            />
          </div>

          <div className="mt-3 flex justify-between gap-3 text-[10px] font-medium text-[#918781]">
            <span>{formatPrice(totalSpentInLedgerINR, currency)} spent</span>
            <span>{formatPrice(userSpendingLimitINR, currency)} total limit</span>
          </div>
        </div>

        {/* POLICY RESULT */}
        {policyVerdict && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`mb-6 rounded-2xl border p-5 sm:p-6 ${
              policyVerdict.status === 'ALLOWED'
                ? 'border-[#C9DDCE] bg-[#EDF5ED]'
                : policyVerdict.status === 'APPROVAL_REQUIRED'
                ? 'border-[#EAD9B9] bg-[#FBF5E9]'
                : 'border-[#E8CDD4] bg-[#FBF0F2]'
            }`}
          >
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-xl p-2.5 ${
                    policyVerdict.status === 'ALLOWED'
                      ? 'bg-[#DCEDE1] text-[#4F8967]'
                      : policyVerdict.status === 'APPROVAL_REQUIRED'
                      ? 'bg-[#F3E8CC] text-[#A47B37]'
                      : 'bg-[#F2DDE2] text-[#A65D70]'
                  }`}
                >
                  {policyVerdict.status === 'ALLOWED' ? (
                    <ShieldCheck className="h-5 w-5" />
                  ) : policyVerdict.status === 'APPROVAL_REQUIRED' ? (
                    <ShieldAlert className="h-5 w-5" />
                  ) : (
                    <ShieldX className="h-5 w-5" />
                  )}
                </span>

                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-[0.15em] text-[#85817F]">
                    Your purchase check
                  </span>
                  <h3 className="text-sm font-bold text-[#45404A]">
                    {verdictTitle}
                  </h3>
                </div>
              </div>

              <span className="text-[11px] text-[#89817D]">
                Checked at{' '}
                {new Date(policyVerdict.evaluatedAt).toLocaleTimeString()}
              </span>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-[#625D59]">
              {policyVerdict.primaryReason}
            </p>

            {policyVerdict.violations.length > 0 && (
              <div className="mt-4 space-y-2 border-t border-[#DED8D2] pt-3">
                {policyVerdict.violations.map((v, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <AlertCircle
                      className={`mt-0.5 h-4 w-4 shrink-0 ${
                        v.severity === 'BLOCK'
                          ? 'text-[#B45E70]'
                          : 'text-[#A47B37]'
                      }`}
                    />
                    <span
                      className={
                        v.severity === 'BLOCK'
                          ? 'font-medium text-[#9C5263]'
                          : 'font-medium text-[#947039]'
                      }
                    >
                      [{v.code}] {v.message}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* SPENDING CONTROLS */}
        <div className="border-t border-[#E5DED4] pt-7">
          <div className="mb-5 flex items-center gap-3">
            <span className="rounded-xl border border-[#DDD0E8] bg-[#EEE7F4] p-2.5 text-[#80649A]">
              <Sliders className="h-4 w-4" />
            </span>

            <div>
              <h4 className="text-sm font-bold text-[#45404A]">
                Set the rules that feel right for you
              </h4>
              <p className="mt-1 text-xs text-[#89817D]">
                You're in control. Adjust your limits whenever you need.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

            {/* AUTOMATIC APPROVAL */}
            <motion.div
              whileHover={{ y: -3 }}
              className="rounded-2xl border border-[#C9DDCE] bg-[#EDF5ED] p-5 transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#526F5D]">
                  Automatic approval limit
                </span>
                <span className="rounded-lg bg-[#DCEBDD] px-2 py-1 font-mono text-sm font-bold text-[#397B5A]">
                  {formatPrice(policyConfig.autoApprovalMaxINR, currency)}
                </span>
              </div>

              <input
                type="range"
                min={2000}
                max={10000}
                step={500}
                value={policyConfig.autoApprovalMaxINR}
                onChange={(e) =>
                  onUpdateConfig({
                    autoApprovalMaxINR: Number(e.target.value),
                  })
                }
                className="h-2 w-full cursor-pointer rounded-lg bg-[#D5E5D6] accent-[#719B7D]"
              />

              <div className="mt-2 flex justify-between text-[10px] text-[#829785]">
                <span>₹2,000</span>
                <span>₹10,000</span>
              </div>

              <p className="mt-3 text-xs leading-relaxed text-[#778C7C]">
                Purchases up to this amount can pass automatically when
                all other spending rules are met.
              </p>
            </motion.div>

            {/* APPROVAL REQUIRED */}
            <motion.div
              whileHover={{ y: -3 }}
              className="rounded-2xl border border-[#EAD9B9] bg-[#FBF5E9] p-5 transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#866E47]">
                  Approval needed up to
                </span>
                <span className="rounded-lg bg-[#F2E7D0] px-2 py-1 font-mono text-sm font-bold text-[#A47B37]">
                  {formatPrice(policyConfig.requireApprovalMaxINR, currency)}
                </span>
              </div>

              <input
                type="range"
                min={10000}
                max={25000}
                step={1000}
                value={policyConfig.requireApprovalMaxINR}
                onChange={(e) =>
                  onUpdateConfig({
                    requireApprovalMaxINR: Number(e.target.value),
                  })
                }
                className="h-2 w-full cursor-pointer rounded-lg bg-[#EFE5D0] accent-[#B28C50]"
              />

              <div className="mt-2 flex justify-between text-[10px] text-[#A08B68]">
                <span>₹10,000</span>
                <span>₹25,000</span>
              </div>

              <p className="mt-3 text-xs leading-relaxed text-[#94846A]">
                Purchases above your automatic limit can ask for your
                approval. Amounts beyond this ceiling are blocked.
              </p>
            </motion.div>

            {/* GLOBAL LIMIT */}
            <motion.div
              whileHover={{ y: -3 }}
              className="rounded-2xl border border-[#D7E3EF] bg-[#F0F5F8] p-5 transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#607D99]">
                  Overall spending ceiling
                </span>
                <span className="rounded-lg bg-[#DCE8F0] px-2 py-1 font-mono text-sm font-bold text-[#527A9D]">
                  {formatPrice(userSpendingLimitINR, currency)}
                </span>
              </div>

              <input
                type="range"
                min={10000}
                max={50000}
                step={2500}
                value={userSpendingLimitINR}
                onChange={(e) =>
                  onUpdateUserSpendingLimit(Number(e.target.value))
                }
                className="h-2 w-full cursor-pointer rounded-lg bg-[#DCE6F0] accent-[#7899B9]"
              />

              <div className="mt-2 flex justify-between text-[10px] text-[#7F91A5]">
                <span>₹10,000</span>
                <span>₹50,000</span>
              </div>

              <p className="mt-3 text-xs leading-relaxed text-[#7F91A5]">
                Your overall account limit. KRYVON will block purchases
                that exceed this boundary.
              </p>
            </motion.div>

          </div>
        </div>

        {/* TRUST NOTE */}
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[#D9E4D9] bg-[#EFF5ED] px-4 py-4 text-xs leading-relaxed text-[#718274]">
          <Shield className="mt-0.5 h-4 w-4 shrink-0 text-[#668C70]" />
          <p>
            Your peace of mind matters. KRYVON's policy engine continues
            checking your spending rules before checkout. This visual
            refresh does not change the underlying approval or blocking logic.
          </p>
        </div>

      </div>
    </motion.div>
  );
};
