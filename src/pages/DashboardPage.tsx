import React, { useEffect, useState } from 'react';
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  TrendingUp,
  QrCode,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  RefreshCcw,
} from 'lucide-react';
import { ordersService } from '../services/orders.service';
import { productsService } from '../services/products.service';
import { usersService } from '../services/users.service';
import { Order, Product, User } from '../types';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [fetchedOrders, fetchedProducts, fetchedUsers] = await Promise.allSettled([
        ordersService.getAllAdmin(),
        productsService.getAll(),
        usersService.getAll(),
      ]);

      if (fetchedOrders.status === 'fulfilled') setOrders(Array.isArray(fetchedOrders.value) ? fetchedOrders.value : []);
      if (fetchedProducts.status === 'fulfilled') setProducts(Array.isArray(fetchedProducts.value) ? fetchedProducts.value : []);
      if (fetchedUsers.status === 'fulfilled') setUsers(Array.isArray(fetchedUsers.value) ? fetchedUsers.value : []);
    } catch (err) {
      console.error('Error fetching dashboard metrics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const ordersList = Array.isArray(orders) ? orders : [];
  const productsList = Array.isArray(products) ? products : [];
  const usersList = Array.isArray(users) ? users : [];

  // Calculate Metrics
  const totalRevenue = ordersList.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const paidOrdersCount = ordersList.filter(
    (o) => o.status === 'PAID' || o.status === 'DELIVERED' || o.status === 'SHIPPED'
  ).length;

  const bakongPaymentsCount = ordersList.filter(
    (o) => o.payment?.paymentMethod === 'BAKONG_KHQR'
  ).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time analytics and performance metrics for your store & Bakong KHQR.
          </p>
        </div>
        <button
          onClick={loadDashboardData}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 transition-all self-start sm:self-auto"
        >
          <RefreshCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-white tracking-tight">
              ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-xs text-emerald-400 flex items-center gap-1 mt-1 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+14.2% from last month</span>
            </p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Orders
            </span>
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-white tracking-tight">{ordersList.length}</h3>
            <p className="text-xs text-sky-400 flex items-center gap-1 mt-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{paidOrdersCount} completed orders</span>
            </p>
          </div>
        </div>

        {/* Products Catalog */}
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Active Products
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-white tracking-tight">{productsList.length}</h3>
            <p className="text-xs text-slate-400 mt-1 font-medium">In store catalog</p>
          </div>
        </div>

        {/* Registered Users */}
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Users
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-white tracking-tight">{usersList.length}</h3>
            <p className="text-xs text-purple-400 flex items-center gap-1 mt-1 font-medium">
              <QrCode className="w-3.5 h-3.5" />
              <span>{bakongPaymentsCount} Bakong KHQR transactions</span>
            </p>
          </div>
        </div>
      </div>

      {/* Bakong KHQR Integration Banner */}
      <div className="glass-card p-6 rounded-3xl border border-rose-500/20 bg-gradient-to-r from-slate-900 via-slate-900 to-rose-950/40 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600 to-red-500 flex items-center justify-center text-white shadow-xl shadow-rose-600/30 shrink-0 font-black">
            KHQR
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">Bakong KHQR Payment Gateway</h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                ACTIVE
              </span>
            </div>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Accept instant cashless payments via NBC Bakong KHQR string generation & MD5 verification.
            </p>
          </div>
        </div>

        <Link
          to="/admin/payments"
          className="inline-flex items-center gap-2 px-5 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-rose-600/25 transition-all shrink-0"
        >
          <span>Monitor Transactions</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Recent Orders Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Recent Orders</h2>
            <p className="text-xs text-slate-400">Latest customer purchases across the system</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="px-6 py-3.5">Order Number</th>
                <th className="px-6 py-3.5">Total Amount</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Payment Method</th>
                <th className="px-6 py-3.5">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {ordersList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                    No orders registered yet.
                  </td>
                </tr>
              ) : (
                ordersList.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-semibold text-white">
                      #{order.orderNumber || order.id.slice(0, 8)}
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-400">
                      ${order.totalAmount?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge type="order" status={order.status} />
                    </td>
                    <td className="px-6 py-4 text-slate-300 font-medium text-xs">
                      {order.payment?.paymentMethod || 'BAKONG_KHQR'}
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
