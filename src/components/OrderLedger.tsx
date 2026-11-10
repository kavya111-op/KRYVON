
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CurrencyCode, LedgerOrder } from '../types';
import { formatPrice } from '../utils/currency';
import {
  FileText,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  Search,
  ReceiptText,
} from 'lucide-react';

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
  isLoading,
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
    if (
      !window.confirm(
        `Are you sure you want to process a verified PayPal Sandbox refund for order ${orderId}?`
      )
    ) {
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
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.65, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-[26px] border border-[#DCE5EA] bg-[#F4F7F8] p-5 shadow-[0_12px_40px_rgba(46,65,82,0.055)] sm:p-8"
    >
      <div className="relative z-10">

        {/* Header */}
        <div className="flex flex-col justify-between gap-5 border-b border-[#DCE5EA] pb-6 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-3">
              <span className="rounded-xl border border-[#D2E0E8] bg-[#E7F0F4] p-2.5 text-[#547B91]">
                <ReceiptText className="h-5 w-5" />
              </span>

              <div>
                <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7892A2]">
                  Your KRYVON account
                </span>

                <h2 className="text-xl font-bold tracking-tight text-[#263B4A] sm:text-2xl">
                  Your Orders & Payment History
                </h2>
              </div>
            </div>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#788B97]">
              Your shopping journey, all in one place. Review purchases,
              check payment details and manage eligible refunds with ease.
            </p>
          </div>

          <motion.div
            whileHover={{ y: -2 }}
            className="min-w-[190px] rounded-2xl border border-[#D3E1E7] bg-[#EAF1F4] px-5 py-4 md:text-right"
          >
            <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#718C9C]">
              Total successfully paid
            </span>

            <span className="mt-1 block font-mono text-2xl font-bold tabular-nums text-[#426D83]">
              {formatPrice(totalExpenditure, currency)}
            </span>

            <span className="mt-1 block text-[10px] text-[#8296A1]">
              Across completed orders
            </span>
          </motion.div>
        </div>

        {/* Search and order count */}
        <div className="my-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8299A7]" />

            <input
              type="text"
              placeholder="Find an order, product or payment reference..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full rounded-xl border border-[#DCE5E9] bg-[#FBFCFC] py-3 pl-10 pr-4 text-sm text-[#344957] outline-none transition-all placeholder:text-[#9BAAB1] focus:border-[#91B0C0] focus:bg-white focus:ring-4 focus:ring-[#E3EDF1]"
            />
          </div>

          <span className="text-xs font-medium text-[#84939C]">
            Showing{' '}
            <strong className="text-[#4F6B7B]">{filteredOrders.length}</strong>{' '}
            of {orders.length} orders
          </span>
        </div>

        {/* Empty state */}
        {filteredOrders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#CFDDE4] bg-[#F9FBFC] px-5 py-14 text-center">
            <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#E9F0F3] text-[#718FA0]">
              <FileText className="h-5 w-5" />
            </span>

            <h3 className="text-base font-semibold text-[#344957]">
              No matching orders just yet
            </h3>

            <p className="mt-1 text-sm text-[#8999A2]">
              Try another search term or check your spelling.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-[#DCE5E9] bg-[#FCFDFD]">
            <table className="w-full min-w-[950px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[#DCE5E9] bg-[#EDF3F5] text-[10px] font-semibold uppercase tracking-[0.12em] text-[#718793]">
                  <th className="px-4 py-4">Order & date</th>
                  <th className="px-4 py-4">What you bought</th>
                  <th className="px-4 py-4">Amount</th>
                  <th className="px-4 py-4">Spending check</th>
                  <th className="px-4 py-4">Payment reference</th>
                  <th className="px-4 py-4">Payment status</th>
                  <th className="px-4 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#EAF0F2]">
                {filteredOrders.map((order, index) => {
                  const isRefunded = order.paymentStatus === 'REFUNDED';
                  const isCompleted = order.paymentStatus === 'COMPLETED';

                  return (
                    <motion.tr
                      key={order.orderId}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.045 }}
                      className="transition-colors hover:bg-[#F3F7F8]"
                    >
                      <td className="px-4 py-4">
                        <span className="block font-semibold text-[#344957]">
                          {order.orderId}
                        </span>

                        <span className="mt-1 block text-[11px] text-[#92A0A8]">
                          {new Date(order.createdAt).toLocaleDateString()}{' '}
                          {new Date(order.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex max-w-[240px] items-center gap-3">
                          <img
                            src={order.productImage}
                            alt={order.productName}
                            referrerPolicy="no-referrer"
                            className="h-10 w-10 shrink-0 rounded-lg border border-[#DCE5E9] bg-[#EDF2F4] object-cover"
                          />

                          <span className="truncate font-medium text-[#465C69]">
                            {order.productName}
                          </span>
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 font-mono font-bold tabular-nums text-[#344957]">
                        {formatPrice(order.amountINR, currency)}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${
                            order.policyStatusAtPurchase === 'ALLOWED'
                              ? 'border-[#C9DFD1] bg-[#EFF6F0] text-[#548267]'
                              : 'border-[#EAD9BE] bg-[#FAF4E9] text-[#A17B45]'
                          }`}
                        >
                          <ShieldCheck className="h-3 w-3" />
                          {order.policyStatusAtPurchase === 'ALLOWED'
                            ? 'Within budget'
                            : 'Review required'}
                        </span>
                      </td>

                      <td className="px-4 py-4 font-mono text-[11px] text-[#64869A]">
                        <span className="block max-w-[150px] truncate">
                          {order.paypalCaptureId}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${
                            isCompleted
                              ? 'border-[#C9DFD1] bg-[#EFF6F0] text-[#548267]'
                              : isRefunded
                              ? 'border-[#E8CCD3] bg-[#FBF1F3] text-[#A56878]'
                              : 'border-[#DCE5E9] bg-[#F0F4F5] text-[#788C97]'
                          }`}
                        >
                          {isCompleted && <CheckCircle2 className="h-3 w-3" />}
                          {isRefunded && <RotateCcw className="h-3 w-3" />}
                          {isCompleted
                            ? 'Paid'
                            : isRefunded
                            ? 'Refunded'
                            : order.paymentStatus}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-right">
                        {isCompleted ? (
                          <button
                            type="button"
                            disabled={
                              refundingId === order.orderId ||
                              isLoading
                            }
                            onClick={() => handleRefundClick(order.orderId)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5CBD1] bg-[#FCF5F6] px-3 py-2 text-[11px] font-semibold text-[#A56878] transition-all hover:border-[#C99AA5] hover:bg-[#F5E7EA] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <RotateCcw className="h-3 w-3" />
                            {refundingId === order.orderId
                              ? 'Processing...'
                              : 'Request refund'}
                          </button>
                        ) : (
                          <span className="text-[11px] text-[#99A5AB]">
                            {isRefunded ? 'Completed' : 'No action needed'}
                          </span>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Trust note */}
        <div className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-[#82929B]">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#779A88]" />

          <p>
            Your payment records are kept for reference. Payment processing and
            refund actions continue to use the existing PayPal verification
            flow.
          </p>
        </div>
      </div>
    </motion.div>
  );
};
