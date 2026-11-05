import { motion } from 'motion/react';
import React, { useState, useEffect } from 'react';
import { CurrencyCode, LedgerOrder, PolicyVerdict, Product } from '../types';
import { formatPrice } from '../utils/currency';
import { 
  ShieldCheck, 
  AlertTriangle, 
  X, 
  Lock, 
  CreditCard, 
  CheckCircle2, 
  ArrowRight,
  Loader2,
  ExternalLink,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

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
  const [step, setStep] = useState<'review' | 'creating' | 'awaiting_approval' | 'capturing' | 'failed'>('review');
  const [userConfirmedApproval, setUserConfirmedApproval] = useState(false);
  const [paypalOrderId, setPaypalOrderId] = useState<string>('');
  const [approveUrl, setApproveUrl] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [hasOpenedPayPal, setHasOpenedPayPal] = useState(false);

  const isApprovalRequired = policyVerdict.status === 'APPROVAL_REQUIRED';
  const isBlocked = policyVerdict.status === 'BLOCKED';

  // Listen for return / postMessage from popup if applicable
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === 'PAYPAL_ORDER_APPROVED' && event.data?.token) {
        if (event.data.token === paypalOrderId || !paypalOrderId) {
          handleCaptureOrder(event.data.token || paypalOrderId);
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [paypalOrderId]);

  // Step 1: Create real order on PayPal via backend
  const handleStartPayPalFlow = async () => {
    if (isBlocked) {
      setErrorMessage(policyVerdict.primaryReason);
      setStep('failed');
      return;
    }

    if (isApprovalRequired && !userConfirmedApproval) {
      setErrorMessage('Explicit human authorization is required before PayPal dispatch.');
      return;
    }

    try {
      setStep('creating');
      setErrorMessage('');

      const res = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          currency,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to initialize PayPal order.');
      }

      setPaypalOrderId(data.paypalOrderId);
      setApproveUrl(data.approveUrl);
      setStep('awaiting_approval');
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment initiation failed.');
      setStep('failed');
    }
  };

  // Launch the genuine PayPal Sandbox window
  const handleOpenPayPalPortal = () => {
    if (!approveUrl) return;
    setHasOpenedPayPal(true);

    const width = 550;
    const height = 720;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      approveUrl,
      'PayPalSandboxPopup',
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
    );

    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      // If popup blocked, redirect directly
      window.location.href = approveUrl;
    }
  };

  // Step 2: Authorize & Capture via Backend once buyer approves
  const handleCaptureOrder = async (orderIdToCapture?: string) => {
    const targetOrderId = orderIdToCapture || paypalOrderId;
    if (!targetOrderId) return;

    try {
      setStep('capturing');
      setErrorMessage('');

      const res = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paypalOrderId: targetOrderId,
          productId: product.id,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.captureStatus !== 'COMPLETED') {
        if (data.error && data.error.includes('not been approved')) {
          setErrorMessage('Payment has not yet been approved on PayPal. Please complete the authorization in the PayPal window, then try again.');
          setStep('awaiting_approval');
          return;
        }
        throw new Error(data.error || 'PayPal capture could not be confirmed.');
      }

      onPaymentSuccess(data.order);
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment capture failed.');
      setStep('failed');
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative my-6"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 10 }}
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-200 mb-5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center">
            <span className="font-mono font-bold text-blue-600 text-xs">PP</span>
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              PayPal Sandbox Autonomous Checkout
            </h2>
            <span className="text-[11px] font-mono text-slate-500">
              Verified Settlement Gate · Genuine Sandbox Flow
            </span>
          </div>
        </div>

        {/* Step: Review & Policy Verification */}
        {step === 'review' && (
          <div className="space-y-4">
            {/* Selected Item Summary */}
            <div className="flex items-center gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-lg object-cover bg-slate-200 border border-slate-300 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="text-xs font-mono uppercase text-cyan-700 font-bold block">{product.category}</span>
                <h3 className="text-xs font-bold text-slate-900 truncate">{product.name}</h3>
                <span className="text-sm font-mono font-extrabold text-slate-900 mt-0.5 block">
                  {formatPrice(product.priceINR, currency)}
                </span>
              </div>
            </div>

            {/* Spending Intelligence Verdict Notice */}
            <div
              className={`p-4 rounded-xl border text-xs space-y-2 ${
                policyVerdict.status === 'ALLOWED'
                  ? 'bg-emerald-50/80 border-emerald-300'
                  : isApprovalRequired
                  ? 'bg-amber-50/80 border-amber-300'
                  : 'bg-rose-50/80 border-rose-300'
              }`}
            >
              <div className="flex items-center justify-between font-bold">
                <div className="flex items-center gap-1.5 font-mono">
                  {policyVerdict.status === 'ALLOWED' ? (
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                  )}
                  <span className={policyVerdict.status === 'ALLOWED' ? 'text-emerald-900' : 'text-amber-900'}>
                    Policy Gate: {policyVerdict.status.replace('_', ' ')}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-slate-500">
                  Total: {formatPrice(policyVerdict.orderTotalINR, currency)}
                </span>
              </div>
              <p className="text-slate-700 leading-relaxed text-[11px]">
                {policyVerdict.primaryReason}
              </p>
            </div>

            {/* Approval Checkbox if required */}
            {isApprovalRequired && (
              <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-xl">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={userConfirmedApproval}
                    onChange={(e) => setUserConfirmedApproval(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                  />
                  <span className="text-xs text-amber-950 font-medium leading-relaxed">
                    I explicitly authorize this autonomous purchase exceeding my automatic clearance threshold.
                  </span>
                </label>
              </div>
            )}

            {/* Disclaimers & Trigger */}
            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={handleStartPayPalFlow}
                disabled={isBlocked || (isApprovalRequired && !userConfirmedApproval)}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-[#0070ba] hover:bg-[#005ea6] text-white transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>Launch PayPal Sandbox Authorization</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="mt-2 text-center text-[10px] font-mono text-slate-400">
                Sandboxed payment environment · Genuine PayPal approval flow
              </div>
            </div>
          </div>
        )}

        {/* Step: Creating order on PayPal backend */}
        {step === 'creating' && (
          <div className="py-10 text-center space-y-4">
            <Loader2 className="w-8 h-8 text-cyan-600 animate-spin mx-auto" />
            <h3 className="text-sm font-bold text-slate-900">Creating PayPal Sandbox Order...</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Registering authenticated purchase unit and obtaining genuine approval token.
            </p>
          </div>
        )}

        {/* Step: Awaiting Approval on genuine PayPal Sandbox */}
        {step === 'awaiting_approval' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-blue-200">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200">
                <span className="font-mono text-blue-700 font-bold">PayPal Sandbox Token</span>
                <span className="text-slate-700 font-mono text-[11px] font-semibold">{paypalOrderId}</span>
              </div>
              <div className="py-3 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Merchant:</span>
                  <span className="text-slate-900 font-medium">KRYVON Autonomous Commerce</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Item:</span>
                  <span className="text-slate-900 font-medium truncate max-w-[200px]">{product.name}</span>
                </div>
                <div className="flex justify-between font-bold text-sm pt-2 border-t border-slate-200 text-slate-900">
                  <span>Total Amount:</span>
                  <span className="text-cyan-700 font-mono">{formatPrice(product.priceINR, currency)}</span>
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={handleOpenPayPalPortal}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-[#0070ba] hover:bg-[#005ea6] text-white transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 active:scale-98 cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>{hasOpenedPayPal ? 'Reopen PayPal Sandbox Window' : 'Sign In & Approve on PayPal Sandbox'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleCaptureOrder()}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 active:scale-98 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>I Have Approved on PayPal — Complete Capture</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-500 text-center leading-relaxed">
              Log into your PayPal Sandbox buyer account in the opened window, review and click <strong>Pay Now</strong> or <strong>Continue</strong>, then click <strong>Complete Capture</strong> above.
            </p>
          </div>
        )}

        {/* Step: Capturing */}
        {step === 'capturing' && (
          <div className="py-10 text-center space-y-4">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
            <h3 className="text-sm font-bold text-slate-900">Verifying PayPal Approval & Capture...</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Connecting with PayPal REST API to verify approved status, execute capture, and write to immutable order ledger.
            </p>
          </div>
        )}

        {/* Step: Failed */}
        {step === 'failed' && (
          <div className="py-6 text-center space-y-4">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <X className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Payment Unsuccessful</h3>
            <p className="text-xs text-rose-700 bg-rose-50 border border-rose-200 p-3 rounded-lg text-left">
              {errorMessage || 'Payment could not be verified by the PayPal backend gateway.'}
            </p>
            <div className="flex gap-2 justify-center">
              <button
                type="button"
                onClick={() => setStep('review')}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white rounded-lg transition-colors cursor-pointer"
              >
                Retry Checkout
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default PayPalCheckoutModal;
