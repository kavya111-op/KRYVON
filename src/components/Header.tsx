import React from 'react';
import { CurrencyCode } from '../types';
import { Sparkles, ShoppingBag } from 'lucide-react';

interface HeaderProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  comparisonCount: number;
  openComparison: () => void;
  onNewMission: () => void;
  wishlistCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  setActiveSection,
  currency,
  setCurrency,
  comparisonCount,
  openComparison,
  onNewMission,
  wishlistCount = 0,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/90 bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => setActiveSection('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-cyan-500 flex items-center justify-center shadow-md shadow-cyan-500/20">
              <span className="font-mono font-black text-sm tracking-tighter text-white">K</span>
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-cyan-600 transition-colors">
              KRYVON
            </span>
          </button>
        </div>

        {/* Zone 2: 4-5 Clean Nav Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveSection('workspace')}
            className={`transition-colors whitespace-nowrap hover:text-slate-900 cursor-pointer ${
              activeSection === 'workspace' ? 'text-cyan-600 font-bold' : ''
            }`}
          >
            Shopping Workspace
          </button>
          <button
            onClick={() => setActiveSection('discovery')}
            className={`transition-colors whitespace-nowrap hover:text-slate-900 cursor-pointer ${
              activeSection === 'discovery' ? 'text-cyan-600 font-bold' : ''
            }`}
          >
            Product Discovery
          </button>
          <button
            onClick={() => setActiveSection('wishlist')}
            className={`transition-colors whitespace-nowrap hover:text-slate-900 cursor-pointer flex items-center gap-1.5 ${
              activeSection === 'wishlist' ? 'text-cyan-600 font-bold' : ''
            }`}
          >
            <span>Wishlist</span>
            {wishlistCount > 0 && (
              <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-200">
                {wishlistCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveSection('guardian')}
            className={`transition-colors whitespace-nowrap hover:text-slate-900 cursor-pointer ${
              activeSection === 'guardian' ? 'text-cyan-600 font-bold' : ''
            }`}
          >
            Spending Guardian
          </button>
          <button
            onClick={() => setActiveSection('ledger')}
            className={`transition-colors whitespace-nowrap hover:text-slate-900 cursor-pointer ${
              activeSection === 'ledger' ? 'text-cyan-600 font-bold' : ''
            }`}
          >
            Activity Ledger
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Currency Toggle */}
          <div className="flex items-center p-0.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-mono">
            {(['INR', 'USD', 'EUR'] as CurrencyCode[]).map((c) => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={`px-2 py-1 rounded transition-colors whitespace-nowrap cursor-pointer ${
                  currency === c
                    ? 'bg-white text-cyan-700 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {c === 'INR' ? '₹ INR' : c === 'USD' ? '$ USD' : '€ EUR'}
              </button>
            ))}
          </div>

          {/* Comparison Trigger if items selected */}
          {comparisonCount > 0 && (
            <button
              onClick={openComparison}
              className="relative px-3 py-1.5 text-xs font-medium text-cyan-800 bg-cyan-50 border border-cyan-200 rounded-lg hover:bg-cyan-100 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <span>Compare</span>
              <span className="w-4 h-4 rounded-full bg-cyan-600 text-white font-bold text-[10px] flex items-center justify-center">
                {comparisonCount}
              </span>
            </button>
          )}

          {/* Primary CTA */}
          <button
            onClick={onNewMission}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-all shadow-sm flex items-center gap-2 whitespace-nowrap cursor-pointer active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>New Mission</span>
          </button>
        </div>
      </div>
    </header>
  );
};
