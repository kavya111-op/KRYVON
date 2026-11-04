import React from 'react';
import { CurrencyCode, PolicyRuleConfig, PolicyVerdict, Product } from '../types';
import { formatPrice } from '../utils/currency';
import { Shield, ShieldAlert, ShieldCheck, ShieldX, Sliders, Lock, AlertCircle } from 'lucide-react';

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
  const remainingGlobalBudget = Math.max(0, userSpendingLimitINR - totalSpentInLedgerINR);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
      {/* Title & Status */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Shield className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Spending Intelligence Guardian
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Deterministic financial policy engine. Purchases are mathematically evaluated against invariant rules before PayPal checkout.
          </p>
        </div>

        {/* Global Policy Engine Seal */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-xs">
          <Lock className="w-3.5 h-3.5 text-cyan-600" />
          <span className="text-slate-600">Policy Engine:</span>
          <span className="text-emerald-700 font-bold">STRICT_DETERMINISTIC</span>
        </div>
      </div>

      {/* Real-time Financial Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-[11px] font-mono uppercase text-slate-500 block mb-1 font-semibold">
            Global Spending Limit
          </span>
          <span className="text-xl font-mono font-extrabold text-slate-900 tabular-nums">
            {formatPrice(userSpendingLimitINR, currency)}
          </span>
          <span className="text-[10px] text-slate-500 block mt-1">Account-level hard ceiling</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-[11px] font-mono uppercase text-slate-500 block mb-1 font-semibold">
            Active Mission Budget
          </span>
          <span className="text-xl font-mono font-extrabold text-cyan-700 tabular-nums">
            {formatPrice(missionBudgetINR, currency)}
          </span>
          <span className="text-[10px] text-slate-500 block mt-1">Target for current mission</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-[11px] font-mono uppercase text-slate-500 block mb-1 font-semibold">
            Current Order Estimate
          </span>
          <span className="text-xl font-mono font-extrabold text-slate-900 tabular-nums">
            {currentTotal > 0 ? formatPrice(currentTotal, currency) : '₹0'}
          </span>
          <span className="text-[10px] text-slate-500 block mt-1">
            {selectedProduct ? selectedProduct.name.slice(0, 24) + '...' : 'No item selected'}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-[11px] font-mono uppercase text-slate-500 block mb-1 font-semibold">
            Remaining Global Headroom
          </span>
          <span className={`text-xl font-mono font-extrabold tabular-nums ${remainingGlobalBudget > 5000 ? 'text-emerald-700' : 'text-amber-700'}`}>
            {formatPrice(remainingGlobalBudget, currency)}
          </span>
          <span className="text-[10px] text-slate-500 block mt-1">
            ₹{totalSpentInLedgerINR.toLocaleString('en-IN')} already spent in ledger
          </span>
        </div>
      </div>

      {/* Active Evaluation Card (if an item is tested or selected) */}
      {policyVerdict && (
        <div
          className={`p-5 rounded-xl border mb-6 transition-all ${
            policyVerdict.status === 'ALLOWED'
              ? 'bg-emerald-50/80 border-emerald-300'
              : policyVerdict.status === 'APPROVAL_REQUIRED'
              ? 'bg-amber-50/80 border-amber-300'
              : 'bg-rose-50/80 border-rose-300'
          }`}
        >
          <div className="flex items-center justify-between gap-4 mb-2">
            <div className="flex items-center gap-2">
              {policyVerdict.status === 'ALLOWED' ? (
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              ) : policyVerdict.status === 'APPROVAL_REQUIRED' ? (
                <ShieldAlert className="w-5 h-5 text-amber-600" />
              ) : (
                <ShieldX className="w-5 h-5 text-rose-600" />
              )}
              <h3 className="font-bold text-sm tracking-tight text-slate-900 uppercase font-mono">
                Policy Verdict: {policyVerdict.status.replace('_', ' ')}
              </h3>
            </div>
            <span className="font-mono text-xs text-slate-500">
              Evaluated at {new Date(policyVerdict.evaluatedAt).toLocaleTimeString()}
            </span>
          </div>

          <p className="text-xs text-slate-800 leading-relaxed font-sans mt-1">
            {policyVerdict.primaryReason}
          </p>

          {/* Violations or Warnings if any */}
          {policyVerdict.violations.length > 0 && (
            <div className="mt-3 space-y-1.5 pt-2 border-t border-slate-200">
              {policyVerdict.violations.map((v, i) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  <AlertCircle
                    className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                      v.severity === 'BLOCK' ? 'text-rose-600' : 'text-amber-600'
                    }`}
                  />
                  <span className={v.severity === 'BLOCK' ? 'text-rose-700 font-medium' : 'text-amber-800 font-medium'}>
                    [{v.code}] {v.message}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Dynamic Rule Governance Controls */}
      <div className="pt-4 border-t border-slate-200">
        <div className="flex items-center gap-2 mb-4">
          <Sliders className="w-4 h-4 text-cyan-600" />
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-800 font-bold">
            Real-time Spending Threshold Tuning
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Threshold 1: Auto-Approval Max */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="text-slate-800 font-semibold">Automatic Clearance Cap</span>
              <span className="font-mono text-emerald-700 font-bold">
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
                onUpdateConfig({ autoApprovalMaxINR: Number(e.target.value) })
              }
              className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
            />
            <p className="text-[11px] text-slate-600 mt-2 leading-tight">
              Purchases equal to or below this amount are marked <strong className="text-emerald-700">ALLOWED</strong> and clear automatically.
            </p>
          </div>

          {/* Threshold 2: Require Approval Ceiling */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="text-slate-800 font-semibold">Approval Required Ceiling</span>
              <span className="font-mono text-amber-700 font-bold">
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
                onUpdateConfig({ requireApprovalMaxINR: Number(e.target.value) })
              }
              className="w-full accent-amber-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
            />
            <p className="text-[11px] text-slate-600 mt-2 leading-tight">
              Amounts between auto-clear and this limit require an explicit user approval modal. Anything above is <strong className="text-rose-700">BLOCKED</strong>.
            </p>
          </div>

          {/* Threshold 3: User Global Account Ceiling */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="text-slate-800 font-semibold">Global Limit</span>
              <span className="font-mono text-cyan-700 font-bold">
                {formatPrice(userSpendingLimitINR, currency)}
              </span>
            </div>
            <input
              type="range"
              min={10000}
              max={50000}
              step={2500}
              value={userSpendingLimitINR}
              onChange={(e) => onUpdateUserSpendingLimit(Number(e.target.value))}
              className="w-full accent-cyan-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
            />
            <p className="text-[11px] text-slate-600 mt-2 leading-tight">
              Hard account firewall. The policy engine blocks any purchase exceeding this boundary under all conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
