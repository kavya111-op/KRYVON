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
  cartCount?: number;
  onOpenCart?: () => void;
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
  cartCount = 0,
  onOpenCart = () => {},
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'workspace', label: 'Shopping Workspace' },
    { id: 'discovery', label: 'Product Discovery' },
    { id: 'wishlist', label: 'Wishlist' },
    { id: 'guardian', label: 'Spending Guardian' },
    { id: 'ledger', label: 'Activity Ledger' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/90 bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-16 flex items-center justify-between gap-5">

        {/* Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveSection('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-cyan-500 flex items-center justify-center shadow-md shadow-cyan-500/20">
              <span className="font-mono font-black text-sm tracking-tighter text-white">
                K
              </span>
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-cyan-600 transition-colors">
              KRYVON
            </span>
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="hidden md:flex items-center gap-3 lg:gap-4 xl:gap-5 text-xs lg:text-sm font-medium text-slate-600">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`transition-colors whitespace-nowrap hover:text-slate-900 cursor-pointer ${
                activeSection === item.id
                  ? 'text-cyan-600 font-bold'
                  : ''
              }`}
            >
              {item.label}
              {item.id === 'wishlist' && wishlistCount > 0 && (
                <span className="ml-1.5 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-200">
                  {wishlistCount}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Header Actions */}
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
                {c === 'INR' ? 'â‚¹ INR' : c === 'USD' ? '$ USD' : 'â‚¬ EUR'}
              </button>
            ))}
          </div>

          {/* Compare */}
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

                    {/* Shopping Bag */}
          <button
            type="button"
            onClick={onOpenCart}
            aria-label="Open shopping bag"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700"
          >
            <ShoppingBag size={19} />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-cyan-600 px-1 text-[10px] font-bold text-white">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>
          {/* New Mission */}
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


