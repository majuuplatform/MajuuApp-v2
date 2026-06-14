'use client';

import React, { useEffect, useState } from 'react';
import { supabaseBrowserClient } from '@/lib/supabase/client';
import { Building2, CheckCircle2, XCircle, Plus, Globe, Mail } from 'lucide-react';

interface Agency {
  id: string;
  name: string;
  slug: string;
  website: string | null;
  verified: boolean;
  contact_email: string;
  active: boolean;
}

export default function AgenciesPage() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [website, setWebsite] = useState('');

  const fetchAgencies = async () => {
    setLoading(true);
    const { data, error } = await supabaseBrowserClient
      .from('agencies')
      .select('id, name, slug, website, verified, contact_email, active')
      .order('name');
    if (!error && data) {
      setAgencies(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAgencies();
  }, []);

  const handleVerify = async (id: string, verifiedStatus: boolean) => {
    const { error } = await supabaseBrowserClient
      .from('agencies')
      // @ts-ignore - Type mismatch due to Supabase SDK type inference
      .update({ verified: verifiedStatus })
      .eq('id', id);

    if (!error) {
      fetchAgencies();
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug || !contactEmail) return;

    const { error } = await supabaseBrowserClient
      .from('agencies')
      .insert({
        // @ts-ignore - Type mismatch due to Supabase SDK type inference
        name,
        slug,
        contact_email: contactEmail,
        website: website || null,
        verified: false,
        active: true,
      });

    if (!error) {
      setName('');
      setSlug('');
      setContactEmail('');
      setWebsite('');
      setShowForm(false);
      fetchAgencies();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Agencies</h2>
          <p className="text-sm text-slate-400">View and verify agencies operating on the platform.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 text-sm font-medium transition shadow-lg shadow-indigo-600/25"
        >
          <Plus className="h-4 w-4" /> Register Agency
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="rounded-3xl border border-slate-900 bg-slate-900/40 p-6 space-y-4 max-w-xl">
          <h3 className="text-md font-semibold text-white">New Agency Registration</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Agency Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                }}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Slug</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Contact Email</label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Website URL (Optional)</label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-xl border border-slate-800 bg-slate-950 text-slate-400 px-4 py-2 text-sm font-medium hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 text-sm font-medium"
            >
              Save Agency
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex py-12 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent"></div>
        </div>
      ) : agencies.length === 0 ? (
        <div className="rounded-3xl border border-slate-900 bg-slate-900/10 p-12 text-center">
          <Building2 className="mx-auto h-12 w-12 text-slate-600 mb-3" />
          <h3 className="text-md font-semibold text-white">No Agencies Registered</h3>
          <p className="text-sm text-slate-500 mt-1">Register the first agency to get started.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-slate-900 bg-slate-900/20">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-900 text-xs font-semibold uppercase text-slate-400 bg-slate-950/40">
                <th className="p-5">Agency Profile</th>
                <th className="p-5">Contact Email</th>
                <th className="p-5">Verification Status</th>
                <th className="p-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 text-sm">
              {agencies.map((agency) => (
                <tr key={agency.id} className="hover:bg-slate-900/20 transition">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{agency.name}</p>
                        {agency.website ? (
                          <a href={agency.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-indigo-400 hover:underline mt-0.5">
                            <Globe className="h-3 w-3" /> {agency.website}
                          </a>
                        ) : (
                          <span className="text-xs text-slate-600">No website</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <Mail className="h-4 w-4 text-slate-500" />
                      {agency.contact_email}
                    </span>
                  </td>
                  <td className="p-5">
                    {agency.verified ? (
                      <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full w-fit border border-emerald-500/20">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full w-fit border border-amber-500/20">
                        <XCircle className="h-3.5 w-3.5" /> Unverified
                      </span>
                    )}
                  </td>
                  <td className="p-5 text-right">
                    <button
                      onClick={() => handleVerify(agency.id, !agency.verified)}
                      className={`text-xs font-semibold px-4 py-2 rounded-xl transition ${
                        agency.verified
                          ? 'border border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-white'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      {agency.verified ? 'Revoke Verification' : 'Verify Agency'}
                    </button>
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
