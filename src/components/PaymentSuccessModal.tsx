import { motion } from 'motion/react';
import React from 'react';
import { CurrencyCode, LedgerOrder } from '../types';
import { formatPrice } from '../utils/currency';
import { CheckCircle2, ArrowRight } from 'lucide-react';

interface PaymentSuccessModalProps {
  order: LedgerOrder;
  currency: CurrencyCode;
  onClose: () => void;
  onViewLedger: () => void;
}

export const PaymentSuccessModal: React.FC<PaymentSuccessModalProps> = ({
  order,
  currency,
  onClose,
  onViewLedger,
}) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="bg-white border border-emerald-300 rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative text-center"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 10 }}
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
      >
        {/* Animated Success Icon */}
        <motion.div
          className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center mx-auto mb-4"
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.15 }}
        >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.35 }}
          >
            <CheckCircle2 className="w-9 h-9 text-emerald-600" />
          </motion.div>
        </motion.div>

        <span className="font-mono text-xs uppercase tracking-widest text-emerald-700 font-bold">
          Verified Settlement Completed
        </span>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1">
          Purchase Executed Successfully
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Verified by PayPal Sandbox gateway and recorded in the auditable ledger.
        </p>

        {/* Order Receipt Card */}
        <div className="my-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-2.5 text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <span className="text-slate-500">Order ID:</span>
            <span className="font-mono font-bold text-slate-900">{order.orderId}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">PayPal Capture Ref:</span>
            <span className="font-mono text-cyan-800 text-[11px] truncate max-w-[180px] font-semibold">{order.paypalCaptureId}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">Item Purchased:</span>
            <span className="font-medium text-slate-900 truncate max-w-[200px]">{order.productName}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">Policy Gate at Purchase:</span>
            <span className="font-mono text-emerald-700 font-bold">{order.policyStatusAtPurchase}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">Payment Gateway:</span>
            <span className="text-slate-800">{order.paymentMethod}</span>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-slate-200 font-bold text-sm">
            <span className="text-slate-900">Amount Captured:</span>
            <span className="font-mono text-emerald-700">{formatPrice(order.amountINR, currency)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2.5">
          <button
            onClick={onViewLedger}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95 cursor-pointer"
          >
            <span>View in Activity Ledger</span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-medium text-xs transition-colors cursor-pointer"
          >
            Return to Shopping Workspace
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
