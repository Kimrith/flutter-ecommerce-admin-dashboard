import React, { useEffect, useState } from 'react';
import {
  ShoppingBag,
  Eye,
  Edit3,
  Clock,
  User as UserIcon,
  MapPin,
  QrCode,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { ordersService } from '../services/orders.service';
import { Order, OrderStatus } from '../types';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Modal } from '../components/ui/Modal';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Selected Order for Details Drawer/Modal
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  // Status Change Modal
  const [statusModalOrder, setStatusModalOrder] = useState<Order | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>('PENDING');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const data = await ordersService.getAllAdmin();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching admin orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOpenStatusModal = (order: Order) => {
    setStatusModalOrder(order);
    setSelectedStatus(order.status);
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusModalOrder) return;
    setIsUpdatingStatus(true);
    try {
      const updated = await ordersService.updateStatus(statusModalOrder.id, selectedStatus);
      setOrders((prev) => (Array.isArray(prev) ? prev.map((o) => (o.id === updated.id ? updated : o)) : []));
      setStatusModalOrder(null);
    } catch (err) {
      console.error('Failed to update order status:', err);
      alert('Failed to update order status.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const orderList = Array.isArray(orders) ? orders : [];
  const filteredOrders =
    activeTab === 'ALL'
      ? orderList
      : orderList.filter((o) => o.status === (activeTab as OrderStatus));

  const tabs = ['ALL', 'PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">System Orders</h1>
          <p className="text-slate-400 text-sm mt-1">
            Monitor customer checkout orders, delivery statuses, and Bakong KHQR payments.
          </p>
        </div>
        <button
          onClick={fetchOrders}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Tabs Filter Bar */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        {tabs.map((tab) => {
          const count =
            tab === 'ALL' ? orderList.length : orderList.filter((o) => o.status === tab).length;
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
                isActive
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                  : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <span>{tab}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Orders Data Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="px-6 py-4">Order Number</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Total Amount</th>
                <th className="px-6 py-4">Order Status</th>
                <th className="px-6 py-4">Payment Method</th>
                <th className="px-6 py-4">Created Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    No orders registered under status "{activeTab}".
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-white">
                      #{order.orderNumber || order.id.slice(0, 8)}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 text-xs font-bold shrink-0">
                          <UserIcon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-slate-200 font-medium">
                          {order.user?.name || order.userId.slice(0, 8)}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 font-black text-emerald-400">
                      ${order.totalAmount?.toFixed(2)}
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge type="order" status={order.status} />
                    </td>

                    <td className="px-6 py-4 text-slate-300 font-mono text-xs">
                      <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800">
                        {order.payment?.paymentMethod || 'BAKONG_KHQR'}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-400 text-xs">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => setViewingOrder(order)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenStatusModal(order)}
                        className="p-2 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 transition-colors"
                        title="Update Status"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {viewingOrder && (
        <Modal
          isOpen={!!viewingOrder}
          onClose={() => setViewingOrder(null)}
          title={`Order #${viewingOrder.orderNumber || viewingOrder.id.slice(0, 8)}`}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-6">
            {/* Status & Summary */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div>
                <span className="text-xs text-slate-400 uppercase font-semibold">Total Price</span>
                <p className="text-2xl font-black text-emerald-400">
                  ${viewingOrder.totalAmount?.toFixed(2)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge type="order" status={viewingOrder.status} />
                {viewingOrder.payment && (
                  <StatusBadge type="payment" status={viewingOrder.payment.status} />
                )}
              </div>
            </div>

            {/* Customer & Shipping Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-2">
                  <UserIcon className="w-4 h-4 text-sky-400" />
                  <span>Customer Profile</span>
                </div>
                <p className="text-sm font-bold text-white">{viewingOrder.user?.name || 'N/A'}</p>
                <p className="text-xs text-slate-400">{viewingOrder.user?.email || 'N/A'}</p>
                <p className="text-xs text-slate-400">{viewingOrder.user?.phone || 'No phone'}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-2">
                  <MapPin className="w-4 h-4 text-indigo-400" />
                  <span>Shipping Address</span>
                </div>
                {viewingOrder.shippingAddress ? (
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {viewingOrder.shippingAddress.street},{' '}
                    {viewingOrder.shippingAddress.city},{' '}
                    {viewingOrder.shippingAddress.country}
                  </p>
                ) : (
                  <p className="text-xs text-slate-500">No address recorded</p>
                )}
              </div>
            </div>

            {/* Bakong KHQR Payment Metadata */}
            {viewingOrder.payment && (
              <div className="p-4 rounded-xl bg-slate-900/60 border border-rose-500/20 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase">
                  <QrCode className="w-4 h-4" />
                  <span>Bakong KHQR Payment Information</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  <div>
                    <span className="text-slate-500">MD5 Hash:</span>{' '}
                    <span className="text-slate-200">{viewingOrder.payment.md5 || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Transaction ID:</span>{' '}
                    <span className="text-slate-200">
                      {viewingOrder.payment.transactionId || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Order Items List */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Items Ordered ({viewingOrder.items?.length || 0})
              </h4>
              <div className="space-y-2">
                {viewingOrder.items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 text-xs"
                  >
                    <div>
                      <p className="font-bold text-white">{item.product?.name || 'Item'}</p>
                      <p className="text-slate-400 mt-0.5">
                        Quantity: {item.quantity} × ${item.price?.toFixed(2)}
                      </p>
                    </div>
                    <span className="font-extrabold text-emerald-400">
                      ${(item.quantity * item.price).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Status Update Modal */}
      {statusModalOrder && (
        <Modal
          isOpen={!!statusModalOrder}
          onClose={() => setStatusModalOrder(null)}
          title="Update Order Delivery Status"
        >
          <form onSubmit={handleUpdateStatus} className="space-y-4">
            <p className="text-xs text-slate-400">
              Select a new status for Order #{statusModalOrder.orderNumber || statusModalOrder.id.slice(0, 8)}
            </p>

            <div className="space-y-2">
              {['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
                <label
                  key={st}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedStatus === st
                      ? 'bg-sky-500/10 border-sky-500 text-sky-400'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="status"
                      value={st}
                      checked={selectedStatus === st}
                      onChange={() => setSelectedStatus(st as OrderStatus)}
                      className="accent-sky-500"
                    />
                    <span className="text-xs font-bold">{st}</span>
                  </div>
                </label>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setStatusModalOrder(null)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdatingStatus}
                className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl text-xs shadow-lg shadow-sky-500/20"
              >
                {isUpdatingStatus ? 'Updating...' : 'Save New Status'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
