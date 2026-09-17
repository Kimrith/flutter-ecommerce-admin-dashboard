import React from 'react';
import { OrderStatus, PaymentStatus, Role } from '../../types';

interface StatusBadgeProps {
  type: 'order' | 'payment' | 'role';
  status: OrderStatus | PaymentStatus | Role | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ type, status }) => {
  let colorClasses = 'bg-slate-800 text-slate-300 border-slate-700';

  if (type === 'order') {
    switch (status as OrderStatus) {
      case 'PAID':
        colorClasses = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
        break;
      case 'PENDING':
        colorClasses = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
        break;
      case 'SHIPPED':
        colorClasses = 'bg-sky-500/10 text-sky-400 border-sky-500/30';
        break;
      case 'DELIVERED':
        colorClasses = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
        break;
      case 'CANCELLED':
        colorClasses = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
        break;
    }
  } else if (type === 'payment') {
    switch (status as PaymentStatus) {
      case 'SUCCESS':
        colorClasses = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
        break;
      case 'PENDING':
        colorClasses = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
        break;
      case 'FAILED':
      case 'EXPIRED':
        colorClasses = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
        break;
    }
  } else if (type === 'role') {
    switch (status as Role) {
      case 'ADMIN':
        colorClasses = 'bg-purple-500/10 text-purple-400 border-purple-500/30';
        break;
      case 'MERCHANT':
        colorClasses = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
        break;
      case 'USER':
        colorClasses = 'bg-slate-800 text-slate-400 border-slate-700';
        break;
    }
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${colorClasses}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse" />
      {status}
    </span>
  );
};
