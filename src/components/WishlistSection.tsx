import React from 'react';
import { CurrencyCode, Product, PolicyVerdict } from '../types';
import { formatPrice } from '../utils/currency';
import { Heart, Trash2, ArrowRight, Sparkles, Star, ShieldCheck, AlertTriangle } from 'lucide-react';

interface WishlistSectionProps {
  wishlistProducts: Product[];
  currency: CurrencyCode;
  onRemoveFromWishlist: (productId: string) => void;
  onClearWishlist: () => void;
  onInitiatePurchase: (product: Product) => void;
  onLaunchMissionForProduct: (product: Product) => void;
  onBrowseCatalogue: () => void;
  getProductPolicyVerdict: (product: Product) => PolicyVerdict;
}

export const WishlistSection: React.FC<WishlistSectionProps> = ({
  wishlistProducts,
  currency,
  onRemoveFromWishlist,
  onClearWishlist,
  onInitiatePurchase,
  onLaunchMissionForProduct,
  onBrowseCatalogue,
  getProductPolicyVerdict,
}) => {
  const totalValueINR = wishlistProducts.reduce((sum, p) => sum + p.priceINR, 0);

  if (wishlistProducts.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 text-center shadow-sm">
        <div className="w-14 h-14 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <Heart className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">Your Wishlist is Empty</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
          You haven't saved any products yet. Click the heart icon on any product in the catalogue to save items, monitor specifications, and execute purchases when ready.
        </p>
        <button
          onClick={onBrowseCatalogue}
          className="mt-6 px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          Explore Verified Catalogue
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200">
              <Heart className="w-5 h-5 fill-rose-600" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Tracked Wishlist ({wishlistProducts.length})
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Persisted in your local session. Monitor items, evaluate policy clearances, or trigger targeted missions.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[11px] font-mono text-slate-500 block font-semibold">Total Estimated Value</span>
            <span className="text-lg font-mono font-extrabold text-slate-900">
              {formatPrice(totalValueINR, currency)}
            </span>
          </div>

          <button
            onClick={onClearWishlist}
            className="px-3 py-1.5 text-xs text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            title="Clear all saved items"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Grid of Wishlisted Products */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistProducts.map((product) => {
          const verdict = getProductPolicyVerdict(product);
          const isAllowed = verdict.status === 'ALLOWED';
          const isApprovalRequired = verdict.status === 'APPROVAL_REQUIRED';
          const isBlocked = verdict.status === 'BLOCKED';

          return (
            <div
              key={product.id}
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-all p-4 space-y-4"
            >
              <div>
                <div className="flex items-start gap-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                      <span className="font-mono uppercase font-bold text-cyan-700">{product.category}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="font-mono font-bold text-slate-800">{product.rating}</span>
                      </div>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 leading-snug truncate" title={product.name}>
                      {product.name}
                    </h4>
                    <span className="text-base font-extrabold font-mono text-slate-900 block mt-1">
                      {formatPrice(product.priceINR, currency)}
                    </span>
                  </div>
                </div>

                {/* Key Spec Highlight */}
                <div className="mt-3 p-2 rounded bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
                  {product.specs.batteryLife && (
                    <div className="truncate">
                      <span className="font-medium text-slate-700">Power:</span> {product.specs.batteryLife}
                    </div>
                  )}
                  {product.specs.connectivity && (
                    <div className="truncate">
                      <span className="font-medium text-slate-700">Connectivity:</span> {product.specs.connectivity}
                    </div>
                  )}
                </div>

                {/* Policy Preview Badge */}
                <div
                  className={`mt-2.5 text-[10px] font-mono p-1.5 rounded flex items-center justify-between ${
                    isAllowed
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : isApprovalRequired
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  <div className="flex items-center gap-1 font-bold">
                    {isAllowed ? (
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                    )}
                    <span>{verdict.status.replace('_', ' ')}</span>
                  </div>
                  <span className="opacity-90">{isAllowed ? 'Auto-cleared' : isApprovalRequired ? 'Needs review' : 'Exceeds cap'}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={isBlocked}
                    onClick={() => onInitiatePurchase(product)}
                    className="w-full py-2 px-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-xs cursor-pointer active:scale-95"
                  >
                    <span>Purchase</span>
                    <ArrowRight className="w-3 h-3 text-cyan-400" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onLaunchMissionForProduct(product)}
                    className="w-full py-2 px-2.5 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 font-semibold text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    title="Launch shopping mission to optimize for this product"
                  >
                    <Sparkles className="w-3 h-3 text-cyan-600" />
                    <span>AI Mission</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => onRemoveFromWishlist(product.id)}
                  className="w-full py-1 text-[11px] text-slate-400 hover:text-rose-600 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Remove from wishlist</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
