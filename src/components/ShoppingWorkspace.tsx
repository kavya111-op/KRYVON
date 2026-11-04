import React, { useState } from 'react';
import { CurrencyCode, MissionPriority } from '../types';
import { formatPrice } from '../utils/currency';
import { Search, Sparkles, SlidersHorizontal, CornerDownLeft, RefreshCw } from 'lucide-react';

interface ShoppingWorkspaceProps {
  onRunMission: (query: string, maxBudgetINR: number, priority: MissionPriority) => void;
  isLoading: boolean;
  currency: CurrencyCode;
  currentBudget: number;
}

const PRESET_MISSIONS = [
  'Find wireless headphones under ₹5,000 with good battery life and noise cancellation',
  '75% compact wireless mechanical keyboard for coding with hot-swappable switches',
  'Sleek smartwatch with AMOLED display and 7+ days battery life for fitness',
  'True wireless ANC earbuds with low latency and sweat resistance under ₹4,000',
  'Desk lightbar with asymmetric optical lighting and wireless controller'
];

export const ShoppingWorkspace: React.FC<ShoppingWorkspaceProps> = ({
  onRunMission,
  isLoading,
  currency,
  currentBudget
}) => {
  const [query, setQuery] = useState(
    'Find wireless headphones under ₹5,000 with good battery life and noise cancellation'
  );
  const [maxBudget, setMaxBudget] = useState<number>(currentBudget || 5000);
  const [priority, setPriority] = useState<MissionPriority>('price');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;
    onRunMission(query.trim(), maxBudget, priority);
  };

  const handleSelectPreset = (presetText: string) => {
    setQuery(presetText);
    if (presetText.includes('5,000')) setMaxBudget(5000);
    else if (presetText.includes('4,000')) setMaxBudget(4000);
    else if (presetText.includes('keyboard')) setMaxBudget(8000);
    else setMaxBudget(6000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-cyan-100 text-cyan-700">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">AI Shopping Workspace</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            State your requirement in natural language. KRYVON deconstructs criteria, matches verified specs, and guards your budget.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-auto">
          <div className="text-right">
            <span className="text-[11px] font-mono text-slate-500 block">Mission Budget Ceiling</span>
            <span className="text-base font-mono font-bold text-cyan-700">
              {formatPrice(maxBudget, currency)}
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Natural Language Mission Input */}
        <div>
          <label htmlFor="mission-input" className="block text-xs font-semibold text-slate-700 mb-2">
            Shopping Mission Intent
          </label>
          <div className="relative">
            <textarea
              id="mission-input"
              rows={3}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Find noise-cancelling headphones under ₹5,000 with long battery life for remote work..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:bg-white focus:ring-1 focus:ring-cyan-500/40 resize-none font-sans transition-colors leading-relaxed"
            />
            <div className="absolute right-3 bottom-3 flex items-center gap-2">
              <button
                type="submit"
                disabled={isLoading || !query.trim()}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>Execute Mission</span>
                    <CornerDownLeft className="w-3.5 h-3.5 text-cyan-400" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Presets */}
        <div>
          <span className="text-[11px] font-mono uppercase text-slate-500 block mb-2 font-semibold">
            Suggested Shopping Missions
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESET_MISSIONS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className="text-xs text-slate-700 hover:text-cyan-800 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors text-left cursor-pointer"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Controls: Budget Slider & Priority Tuning */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
          {/* Budget Slider */}
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-600" />
                <span>Budget Boundary</span>
              </span>
              <span className="font-mono text-cyan-700 font-bold">
                {formatPrice(maxBudget, currency)}
              </span>
            </div>
            <input
              type="range"
              min={1500}
              max={15000}
              step={500}
              value={maxBudget}
              onChange={(e) => setMaxBudget(Number(e.target.value))}
              className="w-full accent-cyan-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
            />
            <div className="flex justify-between text-[11px] font-mono text-slate-500 mt-1.5">
              <span>₹1,500</span>
              <span>₹5,000 (Target)</span>
              <span>₹10,000</span>
              <span>₹15,000</span>
            </div>
          </div>

          {/* Priority Weighting */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Optimization Priority
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'price', label: 'Price' },
                { id: 'quality', label: 'Quality' },
                { id: 'features', label: 'Features' },
                { id: 'durability', label: 'Durability' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPriority(opt.id as MissionPriority)}
                  className={`py-2 px-2 text-xs font-medium rounded-lg border transition-all text-center cursor-pointer ${
                    priority === opt.id
                      ? 'bg-cyan-50 text-cyan-800 border-cyan-400 font-bold shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
