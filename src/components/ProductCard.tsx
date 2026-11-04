import React, { useState } from 'react';
import { CurrencyCode, Product, PolicyVerdict } from '../types';
import { formatPrice } from '../utils/currency';
import { 
  Star, 
  ShieldCheck, 
  AlertTriangle, 
  XCircle, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  X, 
  Scale, 
  ArrowRight,
  BatteryCharging,
  Wifi,
  Sparkles,
  Bookmark,
  Heart
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
  currency: CurrencyCode;
  onInitiatePurchase: (product: Product) => void;
  isCompared: boolean;
  onToggleCompare: (product: Product) => void;
  policyVerdict?: PolicyVerdict;
  isWishlisted?: boolean;
  onToggleWishlist?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  onInitiatePurchase,
  isCompared,
  onToggleCompare,
  policyVerdict,
  isWishlisted = false,
  onToggleWishlist,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [imgError, setImgError] = useState(false);

  const isBlocked = policyVerdict?.status === 'BLOCKED';
  const isApprovalRequired = policyVerdict?.status === 'APPROVAL_REQUIRED';
  const isAllowed = policyVerdict?.status === 'ALLOWED';

  return (
    <div className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl overflow-hidden flex flex-col h-full transition-[border-color,box-shadow] duration-200 group shadow-xs hover:shadow-md">
      {/* Product Image Slot */}
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        {!imgError ? (
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-500 p-4 text-center">
            <Sparkles className="w-8 h-8 text-cyan-600 mb-2 opacity-50" />
            <span className="text-xs font-mono">{product.name}</span>
          </div>
        )}

        {/* Top-Right Badges: Match Score & Wishlist Toggle */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
          {product.matchScore !== undefined && (
            <div className="bg-white/95 border border-cyan-300 px-2 py-1 rounded text-xs font-mono font-bold text-cyan-800 backdrop-blur-md shadow-xs">
              {product.matchScore}% Match
            </div>
          )}

          {onToggleWishlist && (
            <div className="relative group/wishlist">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleWishlist(product);
                }}
                className={`p-1.5 rounded-lg border transition-all duration-200 backdrop-blur-md cursor-pointer shadow-xs active:scale-90 flex items-center justify-center ${
                  isWishlisted
                    ? 'bg-rose-50 border-rose-300 text-rose-600 hover:bg-rose-100'
                    : 'bg-white/95 text-slate-500 border-slate-300 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50/50'
                }`}
                aria-label={isWishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
              >
                <Heart
                  className={`w-3.5 h-3.5 transition-transform duration-200 group-hover/wishlist:scale-110 ${
                    isWishlisted ? 'fill-rose-500 text-rose-500' : ''
                  }`}
                />
              </button>

              {/* Animated Floating Tooltip */}
              <div className="absolute right-0 top-full mt-1.5 pointer-events-none z-30 opacity-0 group-hover/wishlist:opacity-100 -translate-y-1 group-hover/wishlist:translate-y-0 transition-all duration-200 ease-out whitespace-nowrap">
                <div className="px-2.5 py-1 rounded-md text-[11px] font-sans font-semibold text-white bg-slate-900 shadow-lg flex items-center gap-1.5 border border-slate-800">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isWishlisted ? 'bg-rose-400' : 'bg-cyan-400'
                    }`}
                  />
                  <span>{isWishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Compare Checkbox Affordance */}
        <button
          type="button"
          onClick={() => onToggleCompare(product)}
          className={`absolute top-3 left-3 px-2 py-1 rounded text-xs font-medium border flex items-center gap-1.5 transition-colors backdrop-blur-md cursor-pointer shadow-xs z-10 ${
            isCompared
              ? 'bg-cyan-600 text-white border-cyan-600 font-bold'
              : 'bg-white/90 text-slate-700 border-slate-300 hover:border-slate-400'
          }`}
        >
          <Scale className="w-3 h-3" />
          <span>{isCompared ? 'Comparing' : 'Compare'}</span>
        </button>
      </div>

      {/* Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata: Category and Rating */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="uppercase tracking-wider font-mono text-[11px] text-cyan-700 font-bold">
              {product.category}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-mono font-bold text-slate-800">{product.rating}</span>
              <span className="text-slate-500">({product.reviewCount.toLocaleString()})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="text-base font-bold text-slate-900 group-hover:text-cyan-700 transition-colors leading-snug">
            {product.name}
          </h3>

          {/* Price Block */}
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-xl font-extrabold font-mono text-slate-900 tabular-nums">
              {formatPrice(product.priceINR, currency)}
            </span>
            {product.originalPriceINR > product.priceINR && (
              <span className="text-xs font-mono text-slate-500 line-through">
                {formatPrice(product.originalPriceINR, currency)}
              </span>
            )}
          </div>

          {/* AI Recommendation Reason */}
          {product.aiRecommendationReason && (
            <div className="mt-3 p-2.5 bg-cyan-50/70 border border-cyan-200 rounded-lg text-xs text-slate-700 leading-relaxed">
              <span className="text-cyan-900 font-bold block mb-0.5">Why KRYVON Recommends:</span>
              <p>{product.aiRecommendationReason}</p>
            </div>
          )}

          {/* Key Specs Pills / Grid */}
          <div className="mt-3 grid grid-cols-2 gap-1.5 text-[11px] font-mono text-slate-700">
            {product.specs.batteryLife && (
              <div className="p-1.5 rounded bg-slate-50 border border-slate-200 flex items-center gap-1.5 truncate">
                <BatteryCharging className="w-3 h-3 text-cyan-600 shrink-0" />
                <span className="truncate">{product.specs.batteryLife}</span>
              </div>
            )}
            {product.specs.connectivity && (
              <div className="p-1.5 rounded bg-slate-50 border border-slate-200 flex items-center gap-1.5 truncate">
                <Wifi className="w-3 h-3 text-cyan-600 shrink-0" />
                <span className="truncate">{product.specs.connectivity}</span>
              </div>
            )}
            {product.specs.noiseCancellation && (
              <div className="p-1.5 rounded bg-slate-50 border border-slate-200 col-span-2 flex items-center gap-1.5 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 shrink-0" />
                <span className="truncate">{product.specs.noiseCancellation}</span>
              </div>
            )}
          </div>

          {/* Expandable Strengths & Weaknesses Toggle */}
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="mt-3 flex items-center justify-between w-full text-xs text-slate-500 hover:text-slate-800 py-1 transition-colors border-t border-slate-200 cursor-pointer"
          >
            <span className="font-medium">Trade-offs & Breakdown</span>
            {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showDetails && (
            <div className="mt-2 space-y-2 text-xs pt-1 border-t border-slate-100">
              <div>
                <span className="text-[11px] font-mono uppercase text-emerald-700 font-bold block mb-1">
                  Key Strengths
                </span>
                <ul className="space-y-1">
                  {product.strengths.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 text-slate-700 leading-tight">
                      <Check className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-1.5">
                <span className="text-[11px] font-mono uppercase text-rose-700 font-bold block mb-1">
                  Trade-Offs to Note
                </span>
                <ul className="space-y-1">
                  {product.weaknesses.map((w, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 text-slate-600 leading-tight">
                      <X className="w-3 h-3 text-rose-600 shrink-0 mt-0.5" />
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions & Policy Gate Status */}
        <div className="mt-5 pt-3 border-t border-slate-200 space-y-2">
          {/* Policy Invariant Indicator */}
          {policyVerdict && (
            <div
              className={`text-xs p-2 rounded-lg flex items-center justify-between font-mono ${
                isAllowed
                  ? 'bg-emerald-50 border border-emerald-300 text-emerald-800'
                  : isApprovalRequired
                  ? 'bg-amber-50 border border-amber-300 text-amber-800'
                  : 'bg-rose-50 border border-rose-300 text-rose-800'
              }`}
            >
              <div className="flex items-center gap-1.5 truncate">
                {isAllowed ? (
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                ) : isApprovalRequired ? (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                )}
                <span className="font-bold text-[11px] uppercase">
                  {isAllowed ? 'Allowed' : isApprovalRequired ? 'Approval Req.' : 'Blocked'}
                </span>
              </div>
              <span className="text-[10px] opacity-90 truncate ml-2">
                {isAllowed ? 'Auto-cleared' : isApprovalRequired ? 'User review' : 'Exceeds limit'}
              </span>
            </div>
          )}

          {/* Primary Action Button */}
          <button
            type="button"
            disabled={isBlocked}
            onClick={() => onInitiatePurchase(product)}
            className={`w-full py-2.5 px-4 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
              isBlocked
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                : isApprovalRequired
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-sm active:scale-98 font-bold'
                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm active:scale-98 font-bold'
            }`}
          >
            <span>
              {isBlocked
                ? 'Blocked by Policy'
                : isApprovalRequired
                ? 'Review & Authorize'
                : 'Execute Purchase'}
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
