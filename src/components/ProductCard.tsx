
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
  ArrowRight,
  BatteryCharging,
  Wifi,
  Sparkles,
  Heart,
  Scale,
  ShoppingBag,
} from 'lucide-react';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
  currency: CurrencyCode;
  onInitiatePurchase: (product: Product) => void;
  onAddToCart: (product: Product) => void;
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
  onAddToCart,
  isCompared,
  onToggleCompare,
  policyVerdict,
  isWishlisted = false,
  onToggleWishlist,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [imgError, setImgError] = useState(false);

  const isBlocked = policyVerdict?.status === 'BLOCKED';
  const isApprovalRequired =
    policyVerdict?.status === 'APPROVAL_REQUIRED';
  const isAllowed = policyVerdict?.status === 'ALLOWED';

  return (
    <article className="kryvon-product-card">

      {/* PRODUCT IMAGE */}
      <div className="kryvon-product-media">

        {!imgError ? (
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="kryvon-product-image"
          />
        ) : (
          <div className="kryvon-product-image-fallback">
            <Sparkles size={28} />
            <span>{product.name}</span>
          </div>
        )}

        {/* AI MATCH */}
        {product.matchScore !== undefined && (
          <span className="kryvon-match-label">
            <Sparkles size={12} />
            {product.matchScore}% AI match
          </span>
        )}

        {/* WISHLIST */}
        {onToggleWishlist && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product);
            }}
            className={`kryvon-wishlist-button ${
              isWishlisted ? 'is-wishlisted' : ''
            }`}
            aria-label={
              isWishlisted
                ? 'Remove from Wishlist'
                : 'Save to Wishlist'
            }
            title={
              isWishlisted
                ? 'Remove from Wishlist'
                : 'Save to Wishlist'
            }
          >
            <Heart
              size={18}
              fill={isWishlisted ? 'currentColor' : 'none'}
            />
          </button>
        )}

        {/* COMPARE */}
        <button
          type="button"
          onClick={() => onToggleCompare(product)}
          className={`kryvon-compare-button ${
            isCompared ? 'is-compared' : ''
          }`}
        >
          <Scale size={13} />
          {isCompared ? 'Added to compare' : 'Compare'}
        </button>

      </div>

      {/* PRODUCT INFORMATION */}
      <div className="kryvon-product-info">

        <div className="kryvon-product-meta">
          <span className="kryvon-product-category">
            {product.category}
          </span>

          <span className="kryvon-product-rating">
            <Star size={13} fill="currentColor" />
            <strong>{product.rating}</strong>
            <span>({product.reviewCount.toLocaleString()})</span>
          </span>
        </div>

        <h3 className="kryvon-product-name">
          {product.name}
        </h3>

        {/* PRICE */}
        <div className="kryvon-product-pricing">
          <span className="kryvon-product-price">
            {formatPrice(product.priceINR, currency)}
          </span>

          {product.originalPriceINR > product.priceINR && (
            <span className="kryvon-product-original-price">
              {formatPrice(product.originalPriceINR, currency)}
            </span>
          )}
        </div>

        {/* AI RECOMMENDATION */}
        {product.aiRecommendationReason && (
          <div className="kryvon-ai-reason">
            <Sparkles size={13} />
            <div>
              <strong>Why KRYVON recommends it</strong>
              <p>{product.aiRecommendationReason}</p>
            </div>
          </div>
        )}

        {/* KEY SPECIFICATIONS */}
        <div className="kryvon-product-specs">

          {product.specs.batteryLife && (
            <span className="kryvon-spec">
              <BatteryCharging size={13} />
              {product.specs.batteryLife}
            </span>
          )}

          {product.specs.connectivity && (
            <span className="kryvon-spec">
              <Wifi size={13} />
              {product.specs.connectivity}
            </span>
          )}

          {product.specs.noiseCancellation && (
            <span className="kryvon-spec kryvon-spec-wide">
              <span className="kryvon-spec-dot" />
              {product.specs.noiseCancellation}
            </span>
          )}

        </div>

        {/* TRADE-OFFS */}
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="kryvon-details-toggle"
          aria-expanded={showDetails}
        >
          <span>Trade-offs & Breakdown</span>
          {showDetails ? (
            <ChevronUp size={15} />
          ) : (
            <ChevronDown size={15} />
          )}
        </button>

        {showDetails && (
          <div className="kryvon-product-details">

            <div>
              <span className="kryvon-detail-heading strengths">
                Key strengths
              </span>

              <ul>
                {product.strengths.map((strength, index) => (
                  <li key={index}>
                    <Check size={13} />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="kryvon-detail-heading weaknesses">
                Trade-offs to note
              </span>

              <ul>
                {product.weaknesses.map((weakness, index) => (
                  <li key={index}>
                    <X size={13} />
                    <span>{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        )}

        {/* POLICY AND PURCHASE ACTIONS */}
        <div className="kryvon-product-actions">

          {policyVerdict && (
            <div
              className={`kryvon-policy-status ${
                isAllowed
                  ? 'policy-allowed'
                  : isApprovalRequired
                  ? 'policy-review'
                  : 'policy-blocked'
              }`}
            >
              <span className="kryvon-policy-label">
                {isAllowed ? (
                  <ShieldCheck size={15} />
                ) : isApprovalRequired ? (
                  <AlertTriangle size={15} />
                ) : (
                  <XCircle size={15} />
                )}

                {isAllowed
                  ? 'Allowed'
                  : isApprovalRequired
                  ? 'Approval required'
                  : 'Blocked'}
              </span>

              <span className="kryvon-policy-note">
                {isAllowed
                  ? 'Auto-cleared'
                  : isApprovalRequired
                  ? 'User review'
                  : 'Exceeds limit'}
              </span>
            </div>
          )}

          <button
            type="button"
            disabled={isBlocked || !product.inStock}
            onClick={() => onAddToCart(product)}
            className="mb-2 flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm font-semibold text-cyan-800 transition hover:border-cyan-400 hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ShoppingBag size={16} />
            {isBlocked ? 'Unavailable by Policy' : !product.inStock ? 'Out of Stock' : 'Add to Bag'}
          </button>
          <button
            type="button"
            disabled={isBlocked}
            onClick={() => onInitiatePurchase(product)}
            className={`kryvon-purchase-button ${
              isBlocked
                ? 'purchase-blocked'
                : isApprovalRequired
                ? 'purchase-review'
                : 'purchase-allowed'
            }`}
          >
            <span>
              {isBlocked
                ? 'Blocked by Policy'
                : isApprovalRequired
                ? 'Review & Authorize'
                : 'Explore Product'}
            </span>

            <ArrowRight size={16} />
          </button>

        </div>
      </div>
    </article>
  );
};

