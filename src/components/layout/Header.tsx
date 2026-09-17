import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, Search, Wifi, WifiOff, User as UserIcon } from 'lucide-react';
import { API_BASE_URL } from '../../services/api';

export const Header: React.FC = () => {
  const { user } = useAuth();
  const [isBackendOnline, setIsBackendOnline] = useState<boolean>(true);

  useEffect(() => {
    const checkServer = async () => {
      try {
        const res = await fetch(`${API_BASE_URL.replace('/api/v1', '')}/api/docs`, { method: 'HEAD' });
        setIsBackendOnline(res.ok || res.status === 404 || res.status === 200);
      } catch {
        setIsBackendOnline(false);
      }
    };
    checkServer();
    const interval = setInterval(checkServer, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-16 glass-panel border-b border-slate-800 px-6 flex items-center justify-between">
      {/* Global Search Input */}
      <div className="relative w-72">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search products, orders..."
          className="w-full pl-10 pr-4 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
        />
      </div>

      {/* Right Header Status & User */}
      <div className="flex items-center gap-4">
        {/* API Backend Status Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs">
          {isBackendOnline ? (
            <>
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-300 font-medium">NestJS API Connected</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-300 font-medium">Offline / Demo Mode</span>
            </>
          )}
        </div>

        {/* Notifications Icon */}
        <button className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-sky-500" />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-slate-800" />

        {/* User Profile Info */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-500 p-0.5 shadow-md shadow-sky-500/20">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center text-sky-400 font-bold text-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
            </div>
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-sm font-semibold text-white leading-tight">
              {user?.name || 'Administrator'}
            </span>
            <span className="text-xs text-sky-400 font-medium">
              {user?.email || 'admin@bakong.com'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
