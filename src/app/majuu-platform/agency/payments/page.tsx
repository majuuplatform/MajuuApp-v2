'use client';

import React, { useEffect, useState } from 'react';
import { supabaseBrowserClient } from '@/lib/supabase/client';
import { useAuth } from '@/providers/AuthProvider';
import { CreditCard, Calendar, ArrowUpRight, DollarSign, Wallet } from 'lucide-react';

interface PaymentItem {
  id: string;
  amount: number;
  currency: string;
  payment_type: string;
  status: string;
  provider_payment_id: string | null;
  created_at: string;
  profiles?: { full_name: string | null; email: string } | null;
  requests?: { request_number: string | null; agency_id: string } | null;
}

export default function PaymentsPage() {
  const { profile } = useAuth();
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    if (!profile?.id) return;
    setLoading(true);

    const { data: adminData } = (await supabaseBrowserClient
      .from('agency_admins')
      .select('agency_id')
      .eq('user_id', profile.id)
      .single()) as { data: { agency_id?: string } | null };

    const agencyId = (adminData as { agency_id?: string } | null)?.agency_id;

    if (agencyId) {
      const { data, error } = await supabaseBrowserClient
        .from('payments')
        .select(`
          id,
          amount,
          currency,
          payment_type,
          status,
          provider_payment_id,
          created_at,
          payer_id,
          request_id
        `)
        .order('created_at', { ascending: false });

      if (!error && data) {
        // Fetch payers manually to avoid nested JOIN limits
        const payerIds = data.map((p: any) => p.payer_id).filter(Boolean);
        const { data: profilesData } = await supabaseBrowserClient
          .from('profiles')
          .select('id, full_name, email')
          .in('id', payerIds);

        // Normalize typing for Supabase response
        const profilesList = (profilesData ?? []) as { id: string; full_name: string | null; email: string }[];
        const profileMap = new Map(profilesList.map(p => [p.id, p]));

        // Fetch requests for filtering
        const reqIds = data.map((p: any) => p.request_id).filter(Boolean);
        const { data: requestsData } = await supabaseBrowserClient
          .from('requests')
          .select('id, request_number, agency_id')
          .in('id', reqIds);
        
        const requestsList = (requestsData ?? []) as { id: string; request_number?: string | null; agency_id?: string | null }[];
        const requestMap = new Map(requestsList.map(r => [r.id, r]));

        // Filter and enrich payments related to this agency
        const enriched = data
          .map((p: any) => ({
            ...p,
            profiles: profileMap.get(p.payer_id) ?? null,
            requests: requestMap.get(p.request_id) ?? null
          }))
          .filter((p: any) => p.requests?.agency_id === agencyId);

        setPayments(enriched);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPayments();
  }, [profile]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Financial Ledger</h2>
        <p className="text-sm text-slate-400">Track unlocking fees and applicant service payments.</p>
      </div>

      {loading ? (
        <div className="flex py-12 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent"></div>
        </div>
      ) : payments.length === 0 ? (
        <div className="rounded-3xl border border-slate-900 bg-slate-900/10 p-12 text-center">
          <CreditCard className="mx-auto h-12 w-12 text-slate-600 mb-3" />
          <h3 className="text-md font-semibold text-white">No Payments Processed</h3>
          <p className="text-sm text-slate-500 mt-1">Payments from unlocked guides or services will appear here.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-slate-900 bg-slate-900/20">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-900 text-xs font-semibold uppercase text-slate-400 bg-slate-950/40">
                <th className="p-5">Payer Details</th>
                <th className="p-5">Request Reference</th>
                <th className="p-5">Payment Type</th>
                <th className="p-5">Transaction Details</th>
                <th className="p-5 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 text-sm">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-slate-900/20 transition">
                  <td className="p-5">
                    <div>
                      <p className="font-semibold text-white">{payment.profiles?.full_name ?? 'Applicant'}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{payment.profiles?.email}</p>
                    </div>
                  </td>
                  <td className="p-5 text-slate-300">
                    <span className="flex items-center gap-1.5 text-xs">
                      <Wallet className="h-3.5 w-3.5 text-slate-500" />
                      {payment.requests?.request_number ?? 'General Unlock'}
                    </span>
                  </td>
                  <td className="p-5">
                    <span className="text-xs text-slate-400 font-medium bg-slate-950/55 px-2.5 py-1 rounded-lg border border-slate-900">
                      {payment.payment_type}
                    </span>
                  </td>
                  <td className="p-5">
                    <div className="space-y-1">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        payment.status === 'SUCCESS'
                          ? 'text-emerald-400 bg-emerald-500/10'
                          : 'text-amber-400 bg-amber-500/10'
                      }`}>
                        {payment.status}
                      </span>
                      {payment.provider_payment_id && (
                        <p className="text-[10px] text-slate-500 mt-1">TxID: {payment.provider_payment_id}</p>
                      )}
                    </div>
                  </td>
                  <td className="p-5 text-right">
                    <span className="font-bold text-white text-md flex items-center justify-end gap-0.5">
                      {payment.currency} {payment.amount.toLocaleString()}
                      <ArrowUpRight className="h-4 w-4 text-emerald-400" />
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      {new Date(payment.created_at).toLocaleDateString()}
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
