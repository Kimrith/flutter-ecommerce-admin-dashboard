import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, Search, Wifi, WifiOff, User as UserIcon, Menu } from 'lucide-react';
import { API_BASE_URL } from '../../services/api';

interface HeaderProps {
  onOpenMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileSidebar }) => {
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
    <header className="sticky top-0 z-30 h-16 glass-panel border-b border-slate-800 px-3.5 sm:px-6 flex items-center justify-between gap-2 sm:gap-4">
      {/* Left side: Mobile Hamburger + Global Search */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-[200px] sm:max-w-xs md:max-w-sm">
        {/* Mobile Hamburger Toggle Button */}
        <button
          onClick={onOpenMobileSidebar}
          aria-label="Open Navigation Menu"
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors md:hidden shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Input */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-9 pr-3 py-1.5 sm:py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
          />
        </div>
      </div>

      {/* Right Header Status & User */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {/* API Backend Status Indicator */}
        <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs">
          {isBackendOnline ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <Wifi className="w-3.5 h-3.5 text-emerald-400 hidden xs:inline" />
              <span className="text-slate-300 font-medium hidden sm:inline">NestJS API Connected</span>
              <span className="text-emerald-400 font-semibold text-[11px] sm:hidden">API</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-300 font-medium hidden sm:inline">Offline / Demo Mode</span>
              <span className="text-amber-400 font-semibold text-[11px] sm:hidden">Offline</span>
            </>
          )}
        </div>

        {/* Notifications Icon */}
        <button className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-sky-500" />
        </button>

        {/* Divider */}
        <div className="hidden sm:block w-px h-6 bg-slate-800" />

        {/* User Profile Info */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-500 p-0.5 shadow-md shadow-sky-500/20">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center text-sky-400 font-bold text-xs sm:text-sm">
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
