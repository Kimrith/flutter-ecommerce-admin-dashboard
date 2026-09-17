import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-100">
        <Loader2 className="w-10 h-10 animate-spin text-sky-500 mb-4" />
        <p className="text-slate-400 font-medium text-sm">Authenticating Admin Access...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-100 p-6">
        <div className="glass-card max-w-md p-8 rounded-2xl text-center border border-red-500/20">
          <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
            🔒
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-slate-400 text-sm mb-6">
            Your account role does not have permission to view the Admin Dashboard.
          </p>
          <a
            href="/login"
            className="inline-block px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-semibold transition-all"
          >
            Switch Account
          </a>
        </div>
      </div>
    );
  }

  return <Outlet />;
};
