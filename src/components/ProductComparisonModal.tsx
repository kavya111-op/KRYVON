import { motion } from 'motion/react';
import React from 'react';
import { CurrencyCode, Product } from '../types';
import { formatPrice } from '../utils/currency';
import { X, Check, Scale, Star, ArrowRight, Trophy } from 'lucide-react';

interface ProductComparisonModalProps {
  products: Product[];
  currency: CurrencyCode;
  onClose: () => void;
  onRemove: (productId: string) => void;
  onSelectForPurchase: (product: Product) => void;
  comparisonAnalysis?: any;
}

export const ProductComparisonModal: React.FC<ProductComparisonModalProps> = ({
  products,
  currency,
  onClose,
  onRemove,
  onSelectForPurchase,
  comparisonAnalysis
}) => {
  if (products.length === 0) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="bg-white border border-slate-200 rounded-2xl max-w-5xl w-full p-6 sm:p-8 shadow-2xl my-8 relative"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 10 }}
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <Scale className="w-5 h-5 text-cyan-600" />
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Side-by-Side Product Comparison ({products.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Synthesis Summary if available */}
        {comparisonAnalysis?.recommendationSummary && (
          <div className="my-5 p-4 bg-cyan-50 border border-cyan-200 rounded-xl text-xs text-slate-700">
            <div className="flex items-center gap-2 text-cyan-800 font-bold mb-1">
              <Trophy className="w-4 h-4 text-cyan-600" />
              <span>KRYVON Comparative Verdict</span>
            </div>
            <p className="leading-relaxed">{comparisonAnalysis.recommendationSummary}</p>
          </div>
        )}

        {/* Matrix Grid */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-3 px-4 text-slate-500 font-semibold w-1/4">Criteria</th>
                {products.map((p) => (
                  <th key={p.id} className="py-3 px-4 w-1/3 min-w-[200px]">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-slate-900 text-sm">{p.name}</span>
                      <button
                        onClick={() => onRemove(p.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                        title="Remove from comparison"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {/* Image & Price */}
              <tr>
                <td className="py-3 px-4 text-slate-500 font-semibold">Price</td>
                {products.map((p) => (
                  <td key={p.id} className="py-3 px-4">
                    <span className="text-base font-extrabold font-mono text-slate-900">
                      {formatPrice(p.priceINR, currency)}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Rating */}
              <tr>
                <td className="py-3 px-4 text-slate-500 font-semibold">Customer Rating</td>
                {products.map((p) => (
                  <td key={p.id} className="py-3 px-4">
                    <div className="flex items-center gap-1 font-mono text-slate-800">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{p.rating} / 5.0</span>
                      <span className="text-slate-500 text-[11px]">({p.reviewCount} reviews)</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Match Score */}
              <tr>
                <td className="py-3 px-4 text-slate-500 font-semibold">Mission Fit Score</td>
                {products.map((p) => (
                  <td key={p.id} className="py-3 px-4">
                    <span className="font-mono font-bold text-cyan-800 bg-cyan-50 border border-cyan-300 px-2 py-0.5 rounded">
                      {p.matchScore || 85}% Match
                    </span>
                  </td>
                ))}
              </tr>

              {/* Battery Life */}
              <tr>
                <td className="py-3 px-4 text-slate-500 font-semibold">Battery / Power</td>
                {products.map((p) => (
                  <td key={p.id} className="py-3 px-4 text-slate-700 font-mono">
                    {p.specs.batteryLife || 'N/A'}
                  </td>
                ))}
              </tr>

              {/* Connectivity */}
              <tr>
                <td className="py-3 px-4 text-slate-500 font-semibold">Connectivity</td>
                {products.map((p) => (
                  <td key={p.id} className="py-3 px-4 text-slate-700 font-mono">
                    {p.specs.connectivity || 'N/A'}
                  </td>
                ))}
              </tr>

              {/* Noise Cancellation */}
              <tr>
                <td className="py-3 px-4 text-slate-500 font-semibold">Noise Isolation</td>
                {products.map((p) => (
                  <td key={p.id} className="py-3 px-4 text-slate-700">
                    {p.specs.noiseCancellation || 'Passive isolation'}
                  </td>
                ))}
              </tr>

              {/* Warranty */}
              <tr>
                <td className="py-3 px-4 text-slate-500 font-semibold">Warranty</td>
                {products.map((p) => (
                  <td key={p.id} className="py-3 px-4 text-slate-700">
                    {p.specs.warranty || '1 Year Domestic'}
                  </td>
                ))}
              </tr>

              {/* Strengths */}
              <tr>
                <td className="py-3 px-4 text-slate-500 font-semibold">Top Advantage</td>
                {products.map((p) => (
                  <td key={p.id} className="py-3 px-4 text-emerald-800">
                    <div className="flex items-start gap-1">
                      <Check className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{p.strengths[0]}</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Purchase Trigger */}
              <tr>
                <td className="py-4 px-4 text-slate-500 font-semibold">Action</td>
                {products.map((p) => (
                  <td key={p.id} className="py-4 px-4">
                    <button
                      onClick={() => {
                        onClose();
                        onSelectForPurchase(p);
                      }}
                      className="w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
                    >
                      <span>Proceed with {p.specs.brand}</span>
                      <ArrowRight className="w-3 h-3 text-cyan-400" />
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};
