import React, { useEffect, useState } from 'react';
import { QrCode, Search, CheckCircle2, AlertCircle, ExternalLink, Hash, RefreshCcw } from 'lucide-react';
import { ordersService } from '../services/orders.service';
import { paymentsService } from '../services/payments.service';
import { Order, Payment } from '../types';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Modal } from '../components/ui/Modal';

export const PaymentsPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [verifyMd5Input, setVerifyMd5Input] = useState<string>('');
  const [verifyResult, setVerifyResult] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // Selected Payment details modal
  const [inspectPayment, setInspectPayment] = useState<Payment | null>(null);

  const fetchPaymentLogs = async () => {
    setIsLoading(true);
    try {
      const data = await ordersService.getAllAdmin();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching payments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentLogs();
  }, []);

  const handleVerifyMd5 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyMd5Input.trim()) return;
    setIsVerifying(true);
    try {
      const res = await paymentsService.verifyKhqr(verifyMd5Input.trim());
      setVerifyResult(res);
    } catch (err: any) {
      console.error('Verification failed:', err);
      setVerifyResult({
        error: err.response?.data?.message || 'Transaction MD5 not verified or expired.',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // Filter orders with non-pending payment records (SUCCESS, FAILED, EXPIRED)
  const orderList = Array.isArray(orders) ? orders : [];
  const paymentRecords: { order: Order; payment: Payment }[] = orderList
    .filter((o) => !!o.payment && o.payment.status !== 'PENDING')
    .map((o) => ({ order: o, payment: o.payment! }));

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">
              Bakong KHQR Payments Monitor
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold">
              NBC Bakong
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Real-time Bakong KHQR transaction logs, MD5 hashes, deep links, and webhook callbacks.
          </p>
        </div>
        <button
          onClick={fetchPaymentLogs}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 transition-all self-start sm:self-auto"
        >
          <RefreshCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Sync Transactions</span>
        </button>
      </div>

      {/* Payment Transactions Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800">
          <h3 className="text-base font-bold text-white">Recorded Payment Log</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="px-6 py-4">Order Ref</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Bakong MD5</th>
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {paymentRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    No payment transactions generated yet.
                  </td>
                </tr>
              ) : (
                paymentRecords.map(({ order, payment }) => (
                  <tr key={payment.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-white">
                      #{order.orderNumber || order.id.slice(0, 8)}
                    </td>

                    <td className="px-6 py-4 font-black text-emerald-400">
                      ${payment.amount?.toFixed(2)} {payment.currency || 'USD'}
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full bg-slate-800 text-sky-400 text-xs font-mono border border-slate-700">
                        {payment.paymentMethod}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge type="payment" status={payment.status} />
                    </td>

                    <td className="px-6 py-4 font-mono text-xs text-slate-400">
                      {payment.md5 ? `${payment.md5.slice(0, 10)}...` : 'N/A'}
                    </td>

                    <td className="px-6 py-4 font-mono text-xs text-slate-400">
                      {payment.transactionId || 'N/A'}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setInspectPayment(payment)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Payment Modal */}
      {inspectPayment && (
        <Modal
          isOpen={!!inspectPayment}
          onClose={() => setInspectPayment(null)}
          title="Payment Payload Inspector"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs font-mono">
              <div>
                <span className="text-slate-500">Payment ID:</span>{' '}
                <span className="text-white">{inspectPayment.id}</span>
              </div>
              <div>
                <span className="text-slate-500">Order ID:</span>{' '}
                <span className="text-white">{inspectPayment.orderId}</span>
              </div>
              <div>
                <span className="text-slate-500">MD5:</span>{' '}
                <span className="text-sky-400">{inspectPayment.md5 || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-500">KHQR String Payload:</span>
                <p className="p-2 mt-1 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-300 break-all">
                  {inspectPayment.khqrString || 'N/A'}
                </p>
              </div>
              <div>
                <span className="text-slate-500">Deep Link:</span>
                <p className="p-2 mt-1 rounded bg-slate-950 border border-slate-800 text-[11px] text-rose-400 break-all">
                  {inspectPayment.deepLink || 'N/A'}
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setInspectPayment(null)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
