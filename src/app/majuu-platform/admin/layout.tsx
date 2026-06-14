'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Settings, 
  LogOut, 
  ShieldAlert 
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/majuu-platform/admin/dashboard', icon: LayoutDashboard },
  { name: 'Agencies', href: '/majuu-platform/admin/agencies', icon: Building2 },
  { name: 'Users', href: '/majuu-platform/admin/users', icon: Users },
  { name: 'Settings (Invites)', href: '/majuu-platform/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { profile, loading, signOut, isSuperAdmin } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  // Double-check authorization on client side
  if (!profile || !isSuperAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
        <div className="max-w-md rounded-3xl border border-rose-500/30 bg-slate-900/80 p-8 text-center shadow-2xl backdrop-blur-xl">
          <ShieldAlert className="mx-auto h-12 w-12 text-rose-500" />
          <h2 className="mt-4 text-2xl font-bold text-white">Access Denied</h2>
          <p className="mt-2 text-slate-400">
            This section is restricted to Super Admins only.
          </p>
          <button 
            onClick={() => signOut()}
            className="mt-6 rounded-2xl bg-rose-600 px-6 py-2.5 font-medium text-white transition hover:bg-rose-700"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      {/* Sidebar */}
      <aside className="fixed bottom-0 top-0 left-0 z-20 w-64 border-r border-slate-900 bg-slate-950/80 backdrop-blur-xl">
        <div className="flex h-full flex-col px-4 py-6">
          {/* Logo */}
          <div className="px-3 mb-8">
            <h1 className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-2xl font-black tracking-wider text-transparent">
              MAJUU
            </h1>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Super Admin Panel
            </p>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/25'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Profile + Logout */}
          <div className="border-t border-slate-900 pt-4 mt-auto">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-sm font-bold text-white uppercase">
                {profile.full_name?.[0] ?? profile.email?.[0] ?? 'A'}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium text-white">
                  {profile.full_name ?? 'Super Admin'}
                </p>
                <p className="truncate text-xs text-slate-500">{profile.email}</p>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="mt-2 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-400 hover:bg-rose-950/20 hover:text-rose-400 transition"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="pl-64 flex-1 flex flex-col min-h-screen">
        <header className="flex h-16 items-center justify-between border-b border-slate-900 px-8">
          <h2 className="text-lg font-semibold text-white">
            {navItems.find((item) => item.href === pathname)?.name ?? 'Admin'}
          </h2>
          <div className="flex items-center gap-4 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Super Admin Session
          </div>
        </header>
        <main className="flex-1 p-8 bg-slate-950">
          {children}
        </main>
      </div>
    </div>
  );
}
