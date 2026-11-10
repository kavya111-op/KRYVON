
import React from 'react';
import { CurrencyCode, Product, PolicyVerdict } from '../types';
import { formatPrice } from '../utils/currency';
import {
  Heart,
  Trash2,
  ArrowRight,
  Sparkles,
  Star,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

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
  const totalValueINR = wishlistProducts.reduce(
    (sum, product) => sum + product.priceINR,
    0
  );

  // EMPTY WISHLIST
  if (wishlistProducts.length === 0) {
    return (
      <section className="bg-[#F1EAF3] border border-[#E4D9E8] rounded-3xl p-8 sm:p-12 text-center shadow-sm relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#E6D9ED] rounded-full opacity-40 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-[#F5DDE5] rounded-full opacity-40 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-[#F8E7ED] border border-[#EBD0DA] text-[#A84F70] flex items-center justify-center mx-auto mb-5 shadow-sm">
            <Heart className="w-7 h-7" />
          </div>

          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#967B9F] mb-2">
            Your personal collection
          </p>

          <h3 className="text-xl sm:text-2xl font-bold text-[#342C39] tracking-tight">
            Your Wishlist is Waiting
          </h3>

          <p className="text-sm text-[#756B78] max-w-md mx-auto mt-3 leading-relaxed">
            Every great find deserves a place. Save the products you love
            and come back whenever you're ready to make them yours.
          </p>

          <button
            onClick={onBrowseCatalogue}
            className="mt-7 px-6 py-3 rounded-xl bg-[#51415D] hover:bg-[#40334B] text-white font-semibold text-sm transition-all shadow-sm hover:shadow-md active:scale-95 cursor-pointer"
          >
            Explore Collection
            <ArrowRight className="inline-block w-4 h-4 ml-2" />
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#F1EAF3] border border-[#E4D9E8] rounded-3xl p-5 sm:p-8 shadow-sm space-y-7 relative overflow-hidden">

      {/* Soft decorative background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#E7DCEC] rounded-full opacity-30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#F4DDE5] rounded-full opacity-30 blur-3xl pointer-events-none" />

      <div className="relative z-10">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 pb-6 border-b border-[#DED2E3]">

          <div>
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-[#F8E7ED] text-[#A84F70] border border-[#EBD0DA]">
                <Heart className="w-5 h-5 fill-[#A84F70]" />
              </span>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#967B9F]">
                  Saved with love
                </p>
                <h2 className="text-xl sm:text-2xl font-bold text-[#342C39] tracking-tight">
                  My Wishlist
                  <span className="ml-2 text-sm font-semibold text-[#967B9F]">
                    ({wishlistProducts.length})
                  </span>
                </h2>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#756B78] mt-3 leading-relaxed">
              Your favourite finds, all in one place. Compare, explore
              and shop whenever you're ready.
            </p>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
            <div className="bg-[#FFFCF7] border border-[#E9DFD5] rounded-xl px-4 py-2.5 text-left sm:text-right">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8A7C83] block">
                Collection value
              </span>
              <span className="text-lg font-bold text-[#51415D] block mt-0.5">
                {formatPrice(totalValueINR, currency)}
              </span>
            </div>

            <button
              onClick={onClearWishlist}
              className="px-3 py-2 text-xs font-semibold text-[#96717E] hover:text-[#A84F70] hover:bg-[#F8E7ED] border border-[#E9D5DC] rounded-xl transition-all cursor-pointer"
              title="Clear all saved items"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* PRODUCT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

          {wishlistProducts.map((product) => {
            const verdict = getProductPolicyVerdict(product);
            const isAllowed = verdict.status === 'ALLOWED';
            const isApprovalRequired =
              verdict.status === 'APPROVAL_REQUIRED';
            const isBlocked = verdict.status === 'BLOCKED';

            return (
              <article
                key={product.id}
                className="bg-[#FFFCF7] border border-[#E9DFD5] hover:border-[#D9C5D0] rounded-2xl overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 p-4 space-y-4"
              >
                <div>

                  {/* PRODUCT DETAILS */}
                  <div className="flex items-start gap-3">

                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#F3EDE5] border border-[#E9DFD5] shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">

                      <div className="flex items-center justify-between text-[10px] mb-2">
                        <span className="font-bold uppercase tracking-wider text-[#92769D]">
                          {product.category}
                        </span>

                        <div className="flex items-center gap-1 bg-[#F8F0DF] px-2 py-1 rounded-full">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span className="font-bold text-[#695B45]">
                            {product.rating}
                          </span>
                        </div>
                      </div>

                      <h4
                        className="text-sm font-bold text-[#342C39] leading-snug line-clamp-2"
                        title={product.name}
                      >
                        {product.name}
                      </h4>

                      <span className="text-base font-bold text-[#51415D] block mt-2">
                        {formatPrice(product.priceINR, currency)}
                      </span>
                    </div>
                  </div>

                  {/* PRODUCT SPECIFICATIONS */}
                  <div className="mt-4 p-3 rounded-xl bg-[#F7F1EA] border border-[#E9DED2] text-[11px] text-[#746B63] space-y-2">

                    {product.specs.batteryLife && (
                      <div className="flex justify-between gap-2">
                        <span className="font-semibold text-[#51415D]">
                          Battery
                        </span>
                        <span className="text-right truncate">
                          {product.specs.batteryLife}
                        </span>
                      </div>
                    )}

                    {product.specs.connectivity && (
                      <div className="flex justify-between gap-2">
                        <span className="font-semibold text-[#51415D]">
                          Connectivity
                        </span>
                        <span className="text-right truncate">
                          {product.specs.connectivity}
                        </span>
                      </div>
                    )}

                  </div>

                  {/* POLICY STATUS */}
                  <div
                    className={`mt-3 text-[10px] font-semibold p-2.5 rounded-xl flex items-center justify-between gap-2 ${
                      isAllowed
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : isApprovalRequired
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold">
                      {isAllowed ? (
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      )}

                      <span>{verdict.status.replace('_', ' ')}</span>
                    </div>

                    <span className="opacity-90 text-right">
                      {isAllowed
                        ? 'Ready to purchase'
                        : isApprovalRequired
                        ? 'Review required'
                        : 'Budget limit exceeded'}
                    </span>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="space-y-2 pt-3 border-t border-[#EEE5DC]">

                  <div className="grid grid-cols-2 gap-2">

                    <button
                      type="button"
                      disabled={isBlocked}
                      onClick={() => onInitiatePurchase(product)}
                      className="w-full py-2.5 px-2 rounded-xl bg-[#51415D] hover:bg-[#40334B] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer active:scale-95 transition-all"
                    >
                      <span>Purchase</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#E9D8F0]" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onLaunchMissionForProduct(product)}
                      className="w-full py-2.5 px-2 rounded-xl bg-[#EEE7F4] hover:bg-[#E4D8ED] text-[#665078] border border-[#DCCCE7] font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95"
                      title="Launch shopping mission for this product"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI Mission</span>
                    </button>

                  </div>

                  <button
                    type="button"
                    onClick={() => onRemoveFromWishlist(product.id)}
                    className="w-full py-2 text-[11px] font-medium text-[#9B858D] hover:text-[#A84F70] hover:bg-[#F8E7ED] rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove from wishlist</span>
                  </button>

                </div>
              </article>
            );
          })}

        </div>
      </div>
    </section>
  );
};
