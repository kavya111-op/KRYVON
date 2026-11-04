import { motion } from 'motion/react';
import React, { useState } from 'react';
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
  Loader2
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
  const [step, setStep] = useState<'review' | 'approving' | 'paypal_sandbox' | 'capturing' | 'failed'>('review');
  const [userConfirmedApproval, setUserConfirmedApproval] = useState(false);
  const [paypalOrderId, setPaypalOrderId] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const isApprovalRequired = policyVerdict.status === 'APPROVAL_REQUIRED';
  const isBlocked = policyVerdict.status === 'BLOCKED';

  // Step 1: Initialize PayPal Order via backend
  const handleStartPayPalFlow = async () => {
    if (isApprovalRequired && !userConfirmedApproval) {
      setErrorMessage('Explicit human authorization is required before PayPal dispatch.');
      return;
    }

    try {
      setStep('approving');
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
      setStep('paypal_sandbox');
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment initiation failed.');
      setStep('failed');
    }
  };

  // Step 2: Authorize & Capture via Backend
  const handleAuthorizeCapture = async () => {
    try {
      setStep('capturing');
      setErrorMessage('');

      const res = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paypalOrderId,
          productId: product.id,
          payerEmail: 'sandbox-buyer@kryvon.ai',
          payerName: 'Kavya Gupta'
        }),
      });

      const data = await res.json();
      if (!res.ok || data.captureStatus !== 'COMPLETED') {
        throw new Error(data.error || 'PayPal capture returned non-completed status.');
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
              Verified Settlement Gate · 256-Bit SSL
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
                className="w-14 h-14 rounded-lg object-cover bg-slate-200 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-slate-900 truncate">{product.name}</h4>
                <span className="text-[11px] text-slate-500 block">{product.specs.brand} · {product.category}</span>
                <span className="text-sm font-mono font-extrabold text-slate-900">
                  {formatPrice(product.priceINR, currency)}
                </span>
              </div>
            </div>

            {/* Spending Policy Verdict Banner */}
            <div
              className={`p-3.5 rounded-xl border text-xs ${
                policyVerdict.status === 'ALLOWED'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-amber-50 border-amber-300 text-amber-900'
              }`}
            >
              <div className="flex items-center gap-2 font-mono font-bold mb-1">
                {policyVerdict.status === 'ALLOWED' ? (
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                )}
                <span>POLICY: {policyVerdict.status.replace('_', ' ')}</span>
              </div>
              <p className="leading-relaxed opacity-90">{policyVerdict.primaryReason}</p>
            </div>

            {/* Human-in-the-Loop Explicit Confirmation if required */}
            {isApprovalRequired && (
              <div className="p-3.5 bg-amber-50/60 border border-amber-300 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-amber-900 text-xs font-bold">
                  <Lock className="w-3.5 h-3.5 text-amber-700" />
                  <span>Mandatory Human Authorization Required</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-normal">
                  This purchase exceeds your automatic clearance threshold. By approving, you authorize KRYVON to dispatch this order to PayPal Sandbox.
                </p>
                <label className="flex items-center gap-2.5 pt-1 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={userConfirmedApproval}
                    onChange={(e) => setUserConfirmedApproval(e.target.checked)}
                    className="accent-amber-600 w-4 h-4 rounded cursor-pointer"
                  />
                  <span className="text-xs text-slate-900 font-medium">
                    I explicitly authorize this purchase of {formatPrice(product.priceINR, currency)}
                  </span>
                </label>
              </div>
            )}

            {errorMessage && (
              <p className="text-xs text-rose-700 bg-rose-50 border border-rose-300 p-2.5 rounded-lg">
                {errorMessage}
              </p>
            )}

            {/* Action Buttons */}
            <div className="pt-2">
              <button
                type="button"
                disabled={isBlocked || (isApprovalRequired && !userConfirmedApproval)}
                onClick={handleStartPayPalFlow}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-[#0070ba] hover:bg-[#005ea6] text-white transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>Launch PayPal Sandbox Authorization</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="mt-2 text-center text-[10px] font-mono text-slate-400">
                Sandboxed payment environment · No real currency deducted
              </div>
            </div>
          </div>
        )}

        {/* Step: Approving / Launching */}
        {step === 'approving' && (
          <div className="py-10 text-center space-y-4">
            <Loader2 className="w-8 h-8 text-cyan-600 animate-spin mx-auto" />
            <h3 className="text-sm font-bold text-slate-900">Communicating with PayPal Sandbox...</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Creating verifiable order token on backend and verifying security policies.
            </p>
          </div>
        )}

        {/* Step: PayPal Sandbox User Interaction Simulator */}
        {step === 'paypal_sandbox' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-blue-200">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200">
                <span className="font-mono text-blue-700 font-bold">PayPal Sandbox Dialog</span>
                <span className="text-slate-400 font-mono text-[10px]">{paypalOrderId}</span>
              </div>
              <div className="py-3 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Merchant:</span>
                  <span className="text-slate-900 font-medium">KRYVON Autonomous Commerce</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Account:</span>
                  <span className="text-slate-900 font-mono">sandbox-buyer@kryvon.ai</span>
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

            <p className="text-xs text-slate-500 leading-relaxed">
              Click below to complete authorization in PayPal Sandbox. The backend will capture and verify the transaction in real time.
            </p>

            <button
              onClick={handleAuthorizeCapture}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 active:scale-98 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Complete Authorization & Capture</span>
            </button>
          </div>
        )}

        {/* Step: Capturing */}
        {step === 'capturing' && (
          <div className="py-10 text-center space-y-4">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
            <h3 className="text-sm font-bold text-slate-900">Verifying PayPal Capture Status...</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Confirming server capture with PayPal REST API and synchronizing ledger.
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
            <p className="text-xs text-rose-700 bg-rose-50 border border-rose-200 p-3 rounded-lg">
              {errorMessage || 'Payment could not be verified by the PayPal backend gateway.'}
            </p>
            <button
              onClick={() => setStep('review')}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white rounded-lg transition-colors cursor-pointer"
            >
              Retry Checkout
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
