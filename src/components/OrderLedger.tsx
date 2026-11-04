import React, { useState } from 'react';
import { CurrencyCode, LedgerOrder } from '../types';
import { formatPrice } from '../utils/currency';
import { FileText, RotateCcw, CheckCircle2, ShieldCheck, Search } from 'lucide-react';

interface OrderLedgerProps {
  orders: LedgerOrder[];
  currency: CurrencyCode;
  onRefund: (orderId: string) => Promise<void>;
  isLoading: boolean;
}

export const OrderLedger: React.FC<OrderLedgerProps> = ({
  orders,
  currency,
  onRefund,
  isLoading
}) => {
  const [refundingId, setRefundingId] = useState<string | null>(null);
  const [filterQuery, setFilterQuery] = useState('');

  const filteredOrders = orders.filter(
    (o) =>
      o.orderId.toLowerCase().includes(filterQuery.toLowerCase()) ||
      o.productName.toLowerCase().includes(filterQuery.toLowerCase()) ||
      o.paypalCaptureId.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const handleRefundClick = async (orderId: string) => {
    if (!window.confirm(`Are you sure you want to process a verified PayPal Sandbox refund for order ${orderId}?`)) {
      return;
    }
    setRefundingId(orderId);
    try {
      await onRefund(orderId);
    } finally {
      setRefundingId(null);
    }
  };

  const totalExpenditure = orders
    .filter((o) => o.paymentStatus === 'COMPLETED')
    .reduce((acc, curr) => acc + curr.amountINR, 0);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-50 text-cyan-700 border border-cyan-200">
              <FileText className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Order History & Activity Ledger
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Auditable immutable record of all PayPal Sandbox captures and deterministic policy evaluations.
          </p>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-mono text-slate-500 block font-semibold">Total Completed Settlement</span>
          <span className="text-xl font-mono font-extrabold text-emerald-700">
            {formatPrice(totalExpenditure, currency)}
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="my-5 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by order ID, item name, or PayPal capture hash..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:bg-white"
          />
        </div>
        <span className="text-xs font-mono text-slate-500">
          Showing {filteredOrders.length} of {orders.length} transactions
        </span>
      </div>

      {/* Table */}
      {filteredOrders.length === 0 ? (
        <div className="py-12 text-center text-slate-500 text-xs border border-dashed border-slate-200 rounded-xl">
          No transactions found matching your criteria.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-mono text-[11px]">
                <th className="py-3 px-3">Order ID & Date</th>
                <th className="py-3 px-3">Product Item</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-3">Policy Gate</th>
                <th className="py-3 px-3">PayPal Capture Ref</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredOrders.map((order) => {
                const isRefunded = order.paymentStatus === 'REFUNDED';
                const isCompleted = order.paymentStatus === 'COMPLETED';

                return (
                  <tr key={order.orderId} className="hover:bg-slate-50 transition-colors">
                    {/* Order ID & Date */}
                    <td className="py-3 px-3 font-mono">
                      <span className="font-bold text-slate-900 block">{order.orderId}</span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>

                    {/* Product */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2 max-w-[220px]">
                        <img
                          src={order.productImage}
                          alt={order.productName}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded object-cover bg-slate-100 border border-slate-200 shrink-0"
                        />
                        <span className="font-medium text-slate-800 truncate">{order.productName}</span>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-3 px-3 font-mono font-bold text-slate-900 tabular-nums">
                      {formatPrice(order.amountINR, currency)}
                    </td>

                    {/* Policy Gate */}
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                          order.policyStatusAtPurchase === 'ALLOWED'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        <ShieldCheck className="w-3 h-3" />
                        <span>{order.policyStatusAtPurchase}</span>
                      </span>
                    </td>

                    {/* PayPal Capture Ref */}
                    <td className="py-3 px-3 font-mono text-[11px] text-cyan-800 font-medium">
                      <span className="truncate block max-w-[150px]">{order.paypalCaptureId}</span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          isCompleted
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : isRefunded
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {isCompleted && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {isRefunded && <RotateCcw className="w-3 h-3 text-rose-600" />}
                        <span>{order.paymentStatus}</span>
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-3 text-right">
                      {isCompleted ? (
                        <button
                          type="button"
                          disabled={refundingId === order.orderId}
                          onClick={() => handleRefundClick(order.orderId)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-rose-700 hover:text-white hover:bg-rose-600 border border-rose-200 rounded transition-colors cursor-pointer"
                        >
                          {refundingId === order.orderId ? 'Refunding...' : 'Refund'}
                        </button>
                      ) : (
                        <span className="text-slate-400 text-[11px] font-mono">Settled</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
