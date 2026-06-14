'use client';

import React, { useEffect, useState } from 'react';
import { supabaseBrowserClient } from '@/lib/supabase/client';
import { useAuth } from '@/providers/AuthProvider';
import { 
  UserPlus, 
  Mail, 
  ShieldAlert, 
  Trash2, 
  CheckCircle, 
  Clock, 
  Building 
} from 'lucide-react';

interface WhitelistEntry {
  id: string;
  email: string;
  role: 'SUPER_ADMIN' | 'AGENT_ADMIN';
  agency_id: string | null;
  can_create_superadmin: boolean;
  created_at: string;
  used_at: string | null;
  agency?: { name: string } | null;
}

interface Agency {
  id: string;
  name: string;
}

export default function SettingsPage() {
  const { profile } = useAuth();
  const [whitelist, setWhitelist] = useState<WhitelistEntry[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);

  // Invite Form State
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'SUPER_ADMIN' | 'AGENT_ADMIN'>('AGENT_ADMIN');
  const [agencyId, setAgencyId] = useState('');
  const [canCreateSuper, setCanCreateSuper] = useState(false);
  const [canCreateSuperPermission, setCanCreateSuperPermission] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const checkPermission = async () => {
    if (!profile?.email) return;
    // @ts-ignore - Type mismatch due to Supabase SDK type inference for admin_whitelist
    const { data, error } = await supabaseBrowserClient
      .from('admin_whitelist')
      .select('can_create_superadmin')
      .eq('email', profile.email)
      .single();

    if (!error && data) {
      // @ts-ignore
      setCanCreateSuperPermission(data.can_create_superadmin);
    }
  };

  const fetchAgencies = async () => {
    const { data } = await supabaseBrowserClient
      .from('agencies')
      .select('id, name')
      .eq('active', true)
      .order('name');
    if (data) setAgencies(data);
  };

  const fetchWhitelist = async () => {
    setLoading(true);
    // Fetch whitelist entries
    // @ts-ignore - Type mismatch due to Supabase SDK type inference for admin_whitelist
    const { data: whitelistData, error } = await supabaseBrowserClient
      .from('admin_whitelist')
      .select(`
        id, 
        email, 
        role, 
        agency_id, 
        can_create_superadmin, 
        created_at, 
        used_at
      `)
      .order('created_at', { ascending: false });

    if (!error && whitelistData) {
      // Fetch agency names separately to avoid complex joins issues in client
      const { data: agencyData } = await supabaseBrowserClient
        .from('agencies')
        .select('id, name');

      const agencyMap = new Map(agencyData?.map(a => [a.id, a.name]) ?? []);
      
      const enrichedWhitelist = whitelistData.map((entry: any) => ({
        ...entry,
        agency: entry.agency_id ? { name: agencyMap.get(entry.agency_id) ?? 'Unknown Agency' } : null
      }));

      setWhitelist(enrichedWhitelist);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkPermission();
    fetchAgencies();
    fetchWhitelist();
  }, [profile]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email) return;

    // Validation: if creating a super admin but the current user doesn't have permission
    if (role === 'SUPER_ADMIN' && !canCreateSuperPermission) {
      setErrorMsg('You do not have permission to invite Super Admins.');
      return;
    }

    // @ts-ignore - Type mismatch due to Supabase SDK type inference for admin_whitelist
    const { error } = await supabaseBrowserClient
      .from('admin_whitelist')
      .insert({
        email: email.trim().toLowerCase(),
        role,
        agency_id: role === 'AGENT_ADMIN' && agencyId ? agencyId : null,
        can_create_superadmin: role === 'SUPER_ADMIN' ? canCreateSuper : false,
        invited_by: profile?.id,
      });

    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccessMsg(`Successfully invited ${email}!`);
      setEmail('');
      setAgencyId('');
      setCanCreateSuper(false);
      fetchWhitelist();
    }
  };

  const handleDelete = async (id: string) => {
    // @ts-ignore - Type mismatch due to Supabase SDK type inference for admin_whitelist
    const { error } = await supabaseBrowserClient
      .from('admin_whitelist')
      .delete()
      .eq('id', id);

    if (!error) {
      fetchWhitelist();
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-3xl border border-slate-900 bg-slate-900/40 p-6 space-y-4">
            <div className="flex items-center gap-2 text-white">
              <UserPlus className="h-5 w-5 text-indigo-400" />
              <h3 className="text-md font-semibold">Invite Platform User</h3>
            </div>
            
            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. admin@agency.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Platform Role</label>
                <select
                  value={role}
                  onChange={(e) => {
                    const selectedRole = e.target.value as 'SUPER_ADMIN' | 'AGENT_ADMIN';
                    setRole(selectedRole);
                    if (selectedRole === 'SUPER_ADMIN') setAgencyId('');
                  }}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
                >
                  <option value="AGENT_ADMIN">Agent Admin</option>
                  {canCreateSuperPermission && (
                    <option value="SUPER_ADMIN">Super Admin</option>
                  )}
                </select>
              </div>

              {role === 'AGENT_ADMIN' ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Assign Agency</label>
                  <select
                    required
                    value={agencyId}
                    onChange={(e) => setAgencyId(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="">Select an Agency...</option>
                    {agencies.map((agency) => (
                      <option key={agency.id} value={agency.id}>
                        {agency.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                canCreateSuperPermission && (
                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950/40">
                    <div>
                      <p className="text-xs font-semibold text-white">Allow Super Admin Creation</p>
                      <p className="text-[10px] text-slate-500">Can invite other Super Admins</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={canCreateSuper}
                      onChange={(e) => setCanCreateSuper(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-950"
                    />
                  </div>
                )
              )}

              {errorMsg && (
                <div className="flex gap-2 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-400">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="flex gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-400">
                  <CheckCircle className="h-4 w-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 text-sm font-semibold transition"
              >
                Send Invite
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Whitelist Directory */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl border border-slate-900 bg-slate-900/20 overflow-hidden">
            <div className="p-6 border-b border-slate-900 bg-slate-900/40">
              <h3 className="text-md font-semibold text-white">Admin Whitelist Directory</h3>
              <p className="text-xs text-slate-400 mt-1">Pending and used invite tokens for platform authorization.</p>
            </div>

            {loading ? (
              <div className="flex py-12 justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent"></div>
              </div>
            ) : whitelist.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-sm">
                No invites have been sent yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-900 text-xs font-semibold uppercase text-slate-400 bg-slate-950/40">
                      <th className="p-4">Email</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Agency / Details</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900 text-sm">
                    {whitelist.map((entry) => (
                      <tr key={entry.id} className="hover:bg-slate-900/20 transition">
                        <td className="p-4 font-medium text-white">{entry.email}</td>
                        <td className="p-4">
                          <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            entry.role === 'SUPER_ADMIN'
                              ? 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                              : 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
                          }`}>
                            {entry.role}
                          </span>
                        </td>
                        <td className="p-4 text-xs text-slate-400">
                          {entry.role === 'AGENT_ADMIN' ? (
                            <span className="flex items-center gap-1.5">
                              <Building className="h-3.5 w-3.5 text-slate-500" />
                              {entry.agency?.name ?? 'Unassigned'}
                            </span>
                          ) : (
                            <span>
                              {entry.can_create_superadmin ? 'Can Create Superadmins' : 'Standard Superadmin'}
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          {entry.used_at ? (
                            <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full w-fit">
                              <CheckCircle className="h-3 w-3" /> Registered
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full w-fit">
                              <Clock className="h-3 w-3" /> Pending Sign-up
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDelete(entry.id)}
                            className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition"
                            title="Revoke Whitelist"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
