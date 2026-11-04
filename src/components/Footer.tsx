import React from 'react';
import { ShieldCheck, Lock, CreditCard } from 'lucide-react';

interface FooterProps {
  onNavigate: (section: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-slate-50 text-slate-600 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded bg-gradient-to-tr from-cyan-600 to-cyan-500 flex items-center justify-center font-mono font-black text-xs text-white">
                K
              </div>
              <span className="font-extrabold text-base tracking-tight text-slate-900">KRYVON</span>
            </div>
            <p className="text-slate-500 max-w-sm text-xs leading-relaxed">
              Autonomous commerce platform. "Intent in. Intelligence in action."
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-semibold">
            <button
              onClick={() => onNavigate('workspace')}
              className="hover:text-cyan-700 transition-colors cursor-pointer"
            >
              Shopping Workspace
            </button>
            <button
              onClick={() => onNavigate('discovery')}
              className="hover:text-cyan-700 transition-colors cursor-pointer"
            >
              Catalogue Discovery
            </button>
            <button
              onClick={() => onNavigate('guardian')}
              className="hover:text-cyan-700 transition-colors cursor-pointer"
            >
              Budget Guardian
            </button>
            <button
              onClick={() => onNavigate('ledger')}
              className="hover:text-cyan-700 transition-colors cursor-pointer"
            >
              Activity Ledger
            </button>
          </div>
        </div>

        {/* Security and Compliance Strip */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-mono">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Deterministic Spending Guardian</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5 text-slate-700">
              <CreditCard className="w-3.5 h-3.5 text-blue-600" />
              <span>PayPal Sandbox Verified</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5 text-slate-700">
              <Lock className="w-3.5 h-3.5 text-cyan-700" />
              <span>Server-Side Gemini 3.8 Flash</span>
            </span>
          </div>

          <span>© {new Date().getFullYear()} KRYVON Inc. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};
