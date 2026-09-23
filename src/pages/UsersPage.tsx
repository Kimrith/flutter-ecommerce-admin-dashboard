import React, { useEffect, useState } from 'react';
import { Users, Mail, Phone, Shield, RefreshCw } from 'lucide-react';
import { usersService } from '../services/users.service';
import { User } from '../types';
import { StatusBadge } from '../components/ui/StatusBadge';

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await usersService.getAll();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const userList = Array.isArray(users) ? users : [];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">System Users Directory</h1>
          <p className="text-slate-400 text-sm mt-1">
            Registered accounts, permissions, roles (ADMIN, MERCHANT, USER), and contact details.
          </p>
        </div>
        <button
          onClick={fetchUsers}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Users</span>
        </button>
      </div>

      {/* Users Data Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="px-4 sm:px-6 py-3.5 sm:py-4">User</th>
                <th className="px-4 sm:px-6 py-3.5 sm:py-4">Email Address</th>
                <th className="px-4 sm:px-6 py-3.5 sm:py-4">Phone Number</th>
                <th className="px-4 sm:px-6 py-3.5 sm:py-4">Access Role</th>
                <th className="px-4 sm:px-6 py-3.5 sm:py-4">Registration Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {userList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 sm:px-6 py-12 text-center text-slate-500">
                    No users retrieved from backend.
                  </td>
                </tr>
              ) : (
                userList.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 sm:px-6 py-3.5 sm:py-4 font-bold text-white flex items-center gap-3">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-sky-400 font-bold shrink-0 text-xs sm:text-sm">
                        {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{u.name || 'Anonymous User'}</p>
                        <p className="text-[11px] font-mono text-slate-500">{u.id.slice(0, 8)}...</p>
                      </div>
                    </td>

                    <td className="px-4 sm:px-6 py-3.5 sm:py-4 text-slate-300 text-xs">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-500" />
                        <span>{u.email}</span>
                      </div>
                    </td>

                    <td className="px-4 sm:px-6 py-3.5 sm:py-4 text-slate-400 text-xs font-mono">
                      {u.phone ? (
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-slate-500" />
                          <span>{u.phone}</span>
                        </div>
                      ) : (
                        <span className="text-slate-600">N/A</span>
                      )}
                    </td>

                    <td className="px-4 sm:px-6 py-3.5 sm:py-4">
                      <StatusBadge type="role" status={u.role || 'USER'} />
                    </td>

                    <td className="px-4 sm:px-6 py-3.5 sm:py-4 text-slate-400 text-xs">
                      {new Date(u.createdAt).toLocaleDateString()}
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
