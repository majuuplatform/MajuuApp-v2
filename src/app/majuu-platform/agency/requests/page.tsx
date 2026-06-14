'use client';

import React, { useEffect, useState } from 'react';
import { supabaseBrowserClient } from '@/lib/supabase/client';
import { useAuth } from '@/providers/AuthProvider';
import { FileText, Calendar, Mail, User, CheckCircle, Clock } from 'lucide-react';

interface RequestItem {
  id: string;
  request_number: string | null;
  status: 'NEW' | 'IN_PROGRESS' | 'DONE';
  created_at: string;
  profiles?: { full_name: string | null; email: string } | null;
  services?: { title: string } | null;
}

export default function RequestsPage() {
  const { profile } = useAuth();
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [agencyId, setAgencyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAgencyAndRequests = async () => {
    if (!profile?.id) return;
    setLoading(true);

    const { data: adminData } = (await supabaseBrowserClient
      .from('agency_admins')
      .select('agency_id')
      .eq('user_id', profile.id)
      .single()) as { data: { agency_id?: string } | null };

    const agencyIdFound = (adminData as { agency_id?: string } | null)?.agency_id;

    if (agencyIdFound) {
      setAgencyId(agencyIdFound);

      const { data: reqs, error } = await supabaseBrowserClient
        .from('requests')
        .select(`
          id,
          request_number,
          status,
          created_at,
          user_id
        `)
        .eq('agency_id', agencyIdFound)
        .order('created_at', { ascending: false });

      if (!error && reqs) {
        // Ensure we have a typed array for requests to avoid `never` typings
        type RequestRow = {
          id: string;
          request_number: string | null;
          status: 'NEW' | 'IN_PROGRESS' | 'DONE';
          created_at: string;
          user_id?: string | null;
        };

        const reqList = (reqs ?? []) as RequestRow[];

        // Fetch profiles and services manually to prevent complex nested join limitations on standard configurations
        const userIds = reqList.map(r => r.user_id).filter(Boolean) as string[];
        const { data: profilesData } = await supabaseBrowserClient
          .from('profiles')
          .select('id, full_name, email')
          .in('id', userIds);
        
        const profilesList = (profilesData ?? []) as { id: string; full_name: string | null; email: string }[];
        const profileMap = new Map(profilesList.map(p => [p.id, p]));

        // Also get request services if mapped
        const { data: reqServices } = await supabaseBrowserClient
          .from('request_services')
          .select(`
            request_id,
            agency_services (
              services (
                title
              )
            )
          `)
          .in('request_id', reqList.map(r => r.id));

        const serviceMap = new Map<string, string>();
        reqServices?.forEach((rs: any) => {
          const title = rs.agency_services?.services?.title;
          if (title) serviceMap.set(rs.request_id, title);
        });

        const enrichedRequests = reqList.map((r) => ({
          ...r,
          profiles: profileMap.get(r.user_id ?? '') ?? null,
          services: serviceMap.has(r.id) ? { title: serviceMap.get(r.id)! } : { title: 'General Service' }
        }));

        setRequests(enrichedRequests);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAgencyAndRequests();
  }, [profile]);

  const handleStatusChange = async (id: string, newStatus: 'NEW' | 'IN_PROGRESS' | 'DONE') => {
    // Cast the query builder to `any` to bypass temporary typing issues
    // (replace with proper DB typings later in `src/types/database.types.ts`).
    const { error } = await (supabaseBrowserClient.from('requests') as any)
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      fetchAgencyAndRequests();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Student Requests</h2>
        <p className="text-sm text-slate-400">Manage applicant documents, visa assistance tasks, and update workflow status.</p>
      </div>

      {loading ? (
        <div className="flex py-12 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent"></div>
        </div>
      ) : requests.length === 0 ? (
        <div className="rounded-3xl border border-slate-900 bg-slate-900/10 p-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-slate-600 mb-3" />
          <h3 className="text-md font-semibold text-white">No Requests Found</h3>
          <p className="text-sm text-slate-500 mt-1">New requests from applicants will appear here.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-slate-900 bg-slate-900/20">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-900 text-xs font-semibold uppercase text-slate-400 bg-slate-950/40">
                <th className="p-5">Request Info</th>
                <th className="p-5">Applicant</th>
                <th className="p-5">Status</th>
                <th className="p-5 text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 text-sm">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-900/20 transition">
                  <td className="p-5">
                    <div>
                      <p className="font-bold text-white text-md">
                        {req.request_number ?? `REQ-${req.id.substring(0, 8).toUpperCase()}`}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">{req.services?.title}</p>
                      <span className="flex items-center gap-1.5 text-slate-500 text-[11px] mt-2">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(req.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="space-y-1">
                      <p className="font-semibold text-white flex items-center gap-1.5">
                        <User className="h-4 w-4 text-slate-500" />
                        {req.profiles?.full_name ?? 'Applicant'}
                      </p>
                      <span className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Mail className="h-3.5 w-3.5" /> {req.profiles?.email}
                      </span>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                      req.status === 'NEW'
                        ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
                        : req.status === 'IN_PROGRESS'
                        ? 'text-purple-400 bg-purple-500/10 border-purple-500/20'
                        : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                    }`}>
                      {req.status === 'DONE' ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <Clock className="h-3 w-3" />
                      )}
                      {req.status}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => handleStatusChange(req.id, 'IN_PROGRESS')}
                        disabled={req.status === 'IN_PROGRESS'}
                        className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-purple-500/30 text-purple-400 hover:bg-purple-500/10 transition disabled:opacity-40"
                      >
                        Start Work
                      </button>
                      <button
                        onClick={() => handleStatusChange(req.id, 'DONE')}
                        disabled={req.status === 'DONE'}
                        className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition disabled:opacity-40"
                      >
                        Complete
                      </button>
                    </div>
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
