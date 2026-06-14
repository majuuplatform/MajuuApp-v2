'use client';

import React from 'react';
import { 
  Building2, 
  Users, 
  Wallet, 
  TrendingUp, 
  CheckCircle, 
  Clock 
} from 'lucide-react';

const stats = [
  { name: 'Total Agencies', value: '12', change: '+2 this month', icon: Building2, color: 'text-indigo-400 bg-indigo-500/10' },
  { name: 'Active Applicants', value: '148', change: '+18% vs last week', icon: Users, color: 'text-purple-400 bg-purple-500/10' },
  { name: 'System Volume (KES)', value: '450,000', change: '8 unlock payments', icon: Wallet, color: 'text-emerald-400 bg-emerald-500/10' },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="rounded-3xl border border-slate-900 bg-gradient-to-br from-slate-900 to-slate-950 p-8 shadow-xl">
        <h2 className="text-3xl font-bold text-white tracking-tight">System Status Overview</h2>
        <p className="mt-2 text-slate-400 max-w-xl">
          Real-time metrics, system health logs, and global configuration access for the MAJUU platform.
        </p>
      </div>

      {/* Grid of stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div 
              key={stat.name} 
              className="rounded-3xl border border-slate-900 bg-slate-900/40 p-6 shadow-lg hover:border-slate-800 transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.name}</p>
                  <p className="mt-2 text-3xl font-semibold text-white tracking-tight">{stat.value}</p>
                </div>
                <div className={`rounded-2xl p-3 ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-400">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                <span>{stat.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent activity placeholders */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-900 bg-slate-900/20 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Pending Verifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-2xl border border-slate-900 bg-slate-950/40 p-4">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-indigo-400" />
                <div>
                  <p className="text-sm font-semibold text-white">Elite Education Kenya</p>
                  <p className="text-xs text-slate-500">Submitted 2 hours ago</p>
                </div>
              </div>
              <span className="flex items-center gap-1 text-xs text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full">
                <Clock className="h-3 w-3" /> Pending
              </span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-slate-900 bg-slate-950/40 p-4">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-indigo-400" />
                <div>
                  <p className="text-sm font-semibold text-white">Apex Study Planners</p>
                  <p className="text-xs text-slate-500">Submitted 1 day ago</p>
                </div>
              </div>
              <span className="flex items-center gap-1 text-xs text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full">
                <Clock className="h-3 w-3" /> Pending
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-900 bg-slate-900/20 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">System Alerts</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-900 bg-slate-950/40 p-4">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
              <div>
                <p className="text-sm font-semibold text-white">M-Pesa Webhook Active</p>
                <p className="text-xs text-slate-500">Connected to Safaricom Daraja Sandbox</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-900 bg-slate-950/40 p-4">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
              <div>
                <p className="text-sm font-semibold text-white">Supabase Auth Online</p>
                <p className="text-xs text-slate-500">Authentication systems operating normally</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
