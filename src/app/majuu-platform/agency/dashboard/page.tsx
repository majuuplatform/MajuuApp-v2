'use client';

import React from 'react';
import { 
  FileText, 
  MessageSquare, 
  CreditCard, 
  TrendingUp, 
  UserCheck 
} from 'lucide-react';

const stats = [
  { name: 'Active Requests', value: '24', change: '+4 this week', icon: FileText, color: 'text-indigo-400 bg-indigo-500/10' },
  { name: 'Unread Messages', value: '5', change: 'Require attention', icon: MessageSquare, color: 'text-purple-400 bg-purple-500/10' },
  { name: 'Revenue unlocked (KES)', value: '180,000', change: '6 unlocks total', icon: CreditCard, color: 'text-emerald-400 bg-emerald-500/10' },
];

export default function AgencyDashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="rounded-3xl border border-slate-900 bg-gradient-to-br from-slate-900 to-slate-950 p-8 shadow-xl">
        <h2 className="text-3xl font-bold text-white tracking-tight">Agency Operations</h2>
        <p className="mt-2 text-slate-400 max-w-xl">
          Manage student applications, update request statuses, correspond via live chat, and track unlocking fees.
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

      {/* Recent Activity lists */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-900 bg-slate-900/20 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Latest Requests</h3>
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-900 bg-slate-950/40 p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold text-white">MJ-2026-000124</p>
                <p className="text-xs text-slate-500">Applicant: John Doe · Study Visa Poland</p>
              </div>
              <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full">
                NEW
              </span>
            </div>
            <div className="rounded-2xl border border-slate-900 bg-slate-950/40 p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold text-white">MJ-2026-000119</p>
                <p className="text-xs text-slate-500">Applicant: Sarah W. · Germany Work Permit</p>
              </div>
              <span className="text-xs font-semibold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full">
                IN_PROGRESS
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-900 bg-slate-900/20 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-900 bg-slate-950/40 p-4">
              <UserCheck className="h-5 w-5 text-indigo-400" />
              <div>
                <p className="text-sm font-semibold text-white">New unlock fee processed</p>
                <p className="text-xs text-slate-500">Poland visa guide unlocked by applicant</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-900 bg-slate-950/40 p-4">
              <MessageSquare className="h-5 w-5 text-purple-400" />
              <div>
                <p className="text-sm font-semibold text-white">New chat message from Sarah W.</p>
                <p className="text-xs text-slate-500">"I have uploaded the bank statement..."</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
