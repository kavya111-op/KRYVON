
import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  AlertTriangle,
  X,
  Lock,
  CheckCircle2,
  ArrowRight,
  Loader2,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';

import {
  CurrencyCode,
  LedgerOrder,
  PolicyVerdict,
  Product,
} from '../types';

import { formatPrice } from '../utils/currency';
import './PayPalCheckoutModal.css';

interface PayPalCheckoutModalProps {
  product: Product;
  currency: CurrencyCode;
  policyVerdict: PolicyVerdict;
  onClose: () => void;
  onPaymentSuccess: (order: LedgerOrder) => void;
}

export const PayPalCheckoutModal: React.FC<PayPalCheckoutModalProps> = ({
  product,
  currency,
  policyVerdict,
  onClose,
  onPaymentSuccess,
}) => {
  const [step, setStep] = useState<
    'review' | 'creating' | 'awaiting_approval' | 'capturing' | 'failed'
  >('review');

  const [userConfirmedApproval, setUserConfirmedApproval] = useState(false);
  const [paypalOrderId, setPaypalOrderId] = useState('');
  const [approveUrl, setApproveUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [hasOpenedPayPal, setHasOpenedPayPal] = useState(false);

  const isApprovalRequired =
    policyVerdict.status === 'APPROVAL_REQUIRED';

  const isBlocked =
    policyVerdict.status === 'BLOCKED';

  // Listen for PayPal approval messages from the return window.
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (
        event.data?.type === 'PAYPAL_ORDER_APPROVED' &&
        event.data?.token
      ) {
        if (
          event.data.token === paypalOrderId ||
          !paypalOrderId
        ) {
          void handleCaptureOrder(
            event.data.token || paypalOrderId
          );
        }
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [paypalOrderId]);

  // STEP 1: Create the PayPal order through the backend.
  const handleStartPayPalFlow = async () => {
    if (isBlocked) {
      setErrorMessage(policyVerdict.primaryReason);
      setStep('failed');
      return;
    }

    if (isApprovalRequired && !userConfirmedApproval) {
      setErrorMessage(
        'Please confirm that you approve this purchase before continuing.'
      );
      return;
    }

    try {
      setStep('creating');
      setErrorMessage('');

      const res = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          currency,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || 'We could not prepare your PayPal order.'
        );
      }

      setPaypalOrderId(data.paypalOrderId);
      setApproveUrl(data.approveUrl);
      setStep('awaiting_approval');
    } catch (err: any) {
      setErrorMessage(
        err.message || 'We could not start your payment. Please try again.'
      );
      setStep('failed');
    }
  };

  // Open the PayPal approval page.
  const handleOpenPayPalPortal = () => {
    if (!approveUrl) return;

    setHasOpenedPayPal(true);

    const width = 550;
    const height = 720;

    const left =
      window.screenX + (window.outerWidth - width) / 2;

    const top =
      window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      approveUrl,
      'PayPalSandboxPopup',
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
    );

    // If the browser blocks the popup, navigate directly.
    if (
      !popup ||
      popup.closed ||
      typeof popup.closed === 'undefined'
    ) {
      window.location.href = approveUrl;
    }
  };

  // STEP 2: Verify and capture the approved PayPal order.
  const handleCaptureOrder = async (
    orderIdToCapture?: string
  ) => {
    const targetOrderId =
      orderIdToCapture || paypalOrderId;

    if (!targetOrderId) return;

    try {
      setStep('capturing');
      setErrorMessage('');

      const res = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paypalOrderId: targetOrderId,
          productId: product.id,
        }),
      });

      const data = await res.json();

      if (
        !res.ok ||
        data.captureStatus !== 'COMPLETED'
      ) {
        if (
          data.error &&
          data.error.includes('not been approved')
        ) {
          setErrorMessage(
            'Your PayPal payment has not been approved yet. Please finish the approval in PayPal and try again.'
          );

          setStep('awaiting_approval');
          return;
        }

        throw new Error(
          data.error || 'We could not confirm your payment.'
        );
      }

      // Only report success after the backend confirms capture.
      onPaymentSuccess(data.order);
    } catch (err: any) {
      setErrorMessage(
        err.message || 'We could not confirm your payment.'
      );

      setStep('failed');
    }
  };

  return (
    <motion.div
      className="paypal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="paypal-modal"
        initial={{ opacity: 0, scale: 0.97, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        transition={{
          type: 'spring',
          stiffness: 340,
          damping: 30,
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="paypal-checkout-title"
      >
        {/* CLOSE */}
        <button
          type="button"
          onClick={onClose}
          className="paypal-close"
          aria-label="Close checkout"
        >
          <X size={21} />
        </button>

        {/* HEADER */}
        <header className="paypal-header">
          <div className="paypal-brand">
            <img
              src="https://cdn.simpleicons.org/paypal/003087"
              alt="PayPal"
              className="paypal-logo"
            />
            <span>PayPal</span>
          </div>

          <div className="paypal-heading">
            <h2 id="paypal-checkout-title">
              {step === 'review' && 'Complete your order'}
              {step === 'creating' && 'Preparing your order'}
              {step === 'awaiting_approval' && 'Continue with PayPal'}
              {step === 'capturing' && 'Confirming your payment'}
              {step === 'failed' && 'Payment not completed'}
            </h2>

            <p>
              {step === 'review'
                ? 'Review your selection before checkout.'
                : step === 'awaiting_approval'
                ? 'Your order is ready for approval.'
                : 'Your checkout with KRYVON.'}
            </p>
          </div>
        </header>

        {/* REVIEW STEP */}
        {step === 'review' && (
          <div className="paypal-content">

            <div className="paypal-section-label">
              YOUR SELECTION
            </div>

            <div className="paypal-product">
              <div className="paypal-product-image-wrap">
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="paypal-product-image"
                />
              </div>

              <div className="paypal-product-info">
                <span className="paypal-category">
                  {product.category}
                </span>

                <h3>{product.name}</h3>

                <strong className="paypal-product-price">
                  {formatPrice(product.priceINR, currency)}
                </strong>
              </div>
            </div>

            {/* ORDER SUMMARY */}
            <div className="paypal-summary">
              <div className="paypal-section-label">
                ORDER SUMMARY
              </div>

              <div className="paypal-summary-row">
                <span>Product total</span>
                <span>
                  {formatPrice(product.priceINR, currency)}
                </span>
              </div>

              <div className="paypal-summary-row paypal-total-row">
                <strong>Total</strong>
                <strong>
                  {formatPrice(
                    policyVerdict.orderTotalINR,
                    currency
                  )}
                </strong>
              </div>
            </div>

            {/* SPENDING POLICY */}
            <div
              className={`paypal-policy ${
                policyVerdict.status === 'ALLOWED'
                  ? 'paypal-policy-allowed'
                  : isApprovalRequired
                  ? 'paypal-policy-review'
                  : 'paypal-policy-blocked'
              }`}
            >
              <div className="paypal-policy-heading">
                {policyVerdict.status === 'ALLOWED' ? (
                  <ShieldCheck size={18} />
                ) : isApprovalRequired ? (
                  <AlertTriangle size={18} />
                ) : (
                  <AlertCircle size={18} />
                )}

                <strong>
                  {policyVerdict.status === 'ALLOWED'
                    ? 'Within your spending limit'
                    : isApprovalRequired
                    ? 'Your approval is required'
                    : 'This purchase is not allowed'}
                </strong>
              </div>

              <p>{policyVerdict.primaryReason}</p>
            </div>

            {/* MANUAL APPROVAL */}
            {isApprovalRequired && (
              <label className="paypal-approval">
                <input
                  type="checkbox"
                  checked={userConfirmedApproval}
                  onChange={(e) => {
                    setUserConfirmedApproval(e.target.checked);
                    setErrorMessage('');
                  }}
                />

                <span>
                  I have reviewed this purchase and approve
                  proceeding to PayPal.
                </span>
              </label>
            )}

            {/* ERROR */}
            {errorMessage && (
              <div className="paypal-error">
                <AlertCircle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* CONTINUE */}
            <button
              type="button"
              onClick={handleStartPayPalFlow}
              disabled={
                isBlocked ||
                (isApprovalRequired &&
                  !userConfirmedApproval)
              }
              className="paypal-primary-button"
            >
              <span>Continue with PayPal</span>
              <ArrowRight size={17} />
            </button>

            <p className="paypal-footnote">
              You'll review and approve your payment on PayPal.
              This checkout currently uses the PayPal Sandbox.
            </p>
          </div>
        )}

        {/* CREATING ORDER */}
        {step === 'creating' && (
          <div className="paypal-state">
            <Loader2
              className="paypal-spinner"
              size={34}
            />

            <h3>Preparing your order</h3>

            <p>
              We're connecting to PayPal and setting up
              your payment. Please wait a moment.
            </p>
          </div>
        )}

        {/* WAITING FOR PAYPAL APPROVAL */}
        {step === 'awaiting_approval' && (
          <div className="paypal-content">

            <div className="paypal-section-label">
              ORDER DETAILS
            </div>

            <div className="paypal-product">
              <div className="paypal-product-image-wrap">
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="paypal-product-image"
                />
              </div>

              <div className="paypal-product-info">
                <span className="paypal-category">
                  {product.category}
                </span>

                <h3>{product.name}</h3>

                <strong className="paypal-product-price">
                  {formatPrice(product.priceINR, currency)}
                </strong>
              </div>
            </div>

            <div className="paypal-confirmation">
              <div className="paypal-summary-row">
                <span>Order reference</span>
                <span className="paypal-order-id">
                  {paypalOrderId}
                </span>
              </div>

              <div className="paypal-summary-row paypal-total-row">
                <strong>Amount</strong>
                <strong>
                  {formatPrice(
                    policyVerdict.orderTotalINR,
                    currency
                  )}
                </strong>
              </div>
            </div>

            {errorMessage && (
              <div className="paypal-error">
                <AlertCircle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleOpenPayPalPortal}
              className="paypal-primary-button"
            >
              <ExternalLink size={17} />

              <span>
                {hasOpenedPayPal
                  ? 'Open PayPal again'
                  : 'Continue to PayPal'}
              </span>

              <ArrowRight size={17} />
            </button>

            <button
              type="button"
              onClick={() => handleCaptureOrder()}
              className="paypal-secondary-button"
            >
              <CheckCircle2 size={17} />
              I've approved the payment
            </button>

            <p className="paypal-footnote">
              Sign in to your PayPal Sandbox buyer account,
              review the payment and approve it. Then return
              here to confirm your order.
            </p>
          </div>
        )}

        {/* CAPTURING */}
        {step === 'capturing' && (
          <div className="paypal-state">
            <Loader2
              className="paypal-spinner"
              size={34}
            />

            <h3>Confirming your payment</h3>

            <p>
              We're checking your PayPal approval and
              confirming the transaction. Please keep
              this window open.
            </p>
          </div>
        )}

        {/* FAILED */}
        {step === 'failed' && (
          <div className="paypal-state">
            <div className="paypal-failed-icon">
              <X size={23} />
            </div>

            <h3>We couldn't complete your payment</h3>

            <p className="paypal-failed-message">
              {errorMessage ||
                'Your payment could not be confirmed. Please try again.'}
            </p>

            <div className="paypal-state-actions">
              <button
                type="button"
                onClick={() => {
                  setErrorMessage('');
                  setStep('review');
                }}
                className="paypal-primary-button"
              >
                <span>Try again</span>
                <ArrowRight size={17} />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="paypal-secondary-button"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <footer className="paypal-footer">
          <Lock size={13} />
          <span>Payments are processed securely by PayPal</span>
        </footer>

      </motion.div>
    </motion.div>
  );
};

export default PayPalCheckoutModal;
