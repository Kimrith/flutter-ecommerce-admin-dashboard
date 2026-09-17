import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Users,
  QrCode,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Store,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleSidebar }) => {
  const { logout } = useAuth();

  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Categories', path: '/admin/categories', icon: FolderTree },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Users', path: '/admin/users', icon: Users },
    { label: 'Bakong Payments', path: '/admin/payments', icon: QrCode },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen glass-panel border-r border-slate-800 transition-all duration-300 flex flex-col ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Logo Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-sky-500/20 shrink-0">
            <Store className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-white text-base tracking-tight leading-none">
                Bakong Shop
              </span>
              <span className="text-[10px] text-sky-400 font-semibold tracking-wider uppercase mt-1">
                Admin Console
              </span>
            </div>
          )}
        </div>

        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-medium text-sm transition-all group ${
                  isActive
                    ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20 shadow-lg shadow-sky-500/5'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`
              }
            >
              <Icon className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" />
              {!isCollapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Logout Button */}
      <div className="p-3 border-t border-slate-800">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-medium text-sm text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20 border border-transparent transition-all group"
        >
          <LogOut className="w-5 h-5 shrink-0 group-hover:rotate-12 transition-transform" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};
