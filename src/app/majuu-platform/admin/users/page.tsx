'use client';

import React, { useEffect, useState } from 'react';
import { supabaseBrowserClient } from '@/lib/supabase/client';
import { Users, Mail, Phone, Calendar, ShieldCheck } from 'lucide-react';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  created_at: string;
  phone: string | null;
}

export default function UsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabaseBrowserClient
      .from('profiles')
      .select('id, email, full_name, role, created_at, phone')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setUsers(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Platform Users</h2>
        <p className="text-sm text-slate-400">Manage runtime identity and profiles across the MAJUU ecosystem.</p>
      </div>

      {loading ? (
        <div className="flex py-12 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent"></div>
        </div>
      ) : users.length === 0 ? (
        <div className="rounded-3xl border border-slate-900 bg-slate-900/10 p-12 text-center">
          <Users className="mx-auto h-12 w-12 text-slate-600 mb-3" />
          <h3 className="text-md font-semibold text-white">No Profiles Found</h3>
          <p className="text-sm text-slate-500 mt-1">Users will appear here once they register.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-slate-900 bg-slate-900/20">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-900 text-xs font-semibold uppercase text-slate-400 bg-slate-950/40">
                <th className="p-5">Name & Email</th>
                <th className="p-5">Phone</th>
                <th className="p-5">System Role</th>
                <th className="p-5">Registered At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 text-sm">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-900/20 transition">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-slate-300">
                        {user.full_name?.[0] ?? user.email?.[0] ?? 'U'}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{user.full_name ?? 'Unnamed User'}</p>
                        <span className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                          <Mail className="h-3 w-3" /> {user.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className="flex items-center gap-1.5 text-slate-300 text-xs">
                      {user.phone ? (
                        <>
                          <Phone className="h-3.5 w-3.5 text-slate-500" />
                          {user.phone}
                        </>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </span>
                  </td>
                  <td className="p-5">
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                      user.role === 'super_admin'
                        ? 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                        : user.role === 'agency_admin'
                        ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
                        : 'text-slate-400 bg-slate-500/10 border-slate-500/20'
                    }`}>
                      <ShieldCheck className="h-3.5 w-3.5" />
                      {user.role}
                    </span>
                  </td>
                  <td className="p-5">
                    <span className="flex items-center gap-1.5 text-slate-400 text-xs">
                      <Calendar className="h-3.5 w-3.5 text-slate-600" />
                      {new Date(user.created_at).toLocaleDateString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
