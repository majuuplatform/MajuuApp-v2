'use client';

import React from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { ShieldAlert, ExternalLink } from 'lucide-react';

export default function BlockedPage() {
  const { signOut } = useAuth();

  const handleOpenPlatform = async () => {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const targetUrl = isLocal 
      ? '/majuu-platform/admin/dashboard' 
      : 'https://majuu-platform.vercel.app';
    
    // Clear the app session first
    await signOut();
    
    // Redirect to platform
    window.location.href = targetUrl;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <div className="relative max-w-lg overflow-hidden rounded-3xl border border-slate-900 bg-slate-900/40 p-8 text-center shadow-2xl backdrop-blur-xl md:p-12">
        {/* Glow effect */}
        <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl"></div>
        <div className="absolute -right-20 -bottom-20 h-40 w-40 rounded-full bg-purple-500/10 blur-3xl"></div>

        <div className="relative space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <ShieldAlert className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-white">Platform Account Detected</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              This account is an MAJUU Platform admin account. To manage agencies, applications, and payments, please log in using a web browser:
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <code className="text-xs font-semibold text-indigo-400">
              https://majuu-platform.vercel.app
            </code>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center pt-2">
            <button
              onClick={() => signOut()}
              className="rounded-2xl border border-slate-800 bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-white px-6 py-3 text-sm font-medium transition"
            >
              Log Out
            </button>
            <button
              onClick={handleOpenPlatform}
              className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 text-sm font-medium transition shadow-lg shadow-indigo-600/20"
            >
              Open Platform <ExternalLink className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
