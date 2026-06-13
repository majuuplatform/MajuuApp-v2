import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const cards = [
  { title: 'Auth / Login', href: '/auth/login' },
  { title: 'Auth / Signup', href: '/auth/signup' },
  { title: 'App / Home', href: '/app/home' },
  { title: 'App / Progress', href: '/app/progress' },
  { title: 'App / Profile', href: '/app/profile' },
  { title: 'Admin / Dashboard', href: '/admin/dashboard' },
  { title: 'Super Admin / Dashboard', href: '/super-admin/dashboard' },
];

export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-16">
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl shadow-slate-950/40">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">MAJUU V2 Foundation</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">Welcome to the MAJUU app shell.</h1>
          <p className="mt-3 max-w-2xl text-slate-400">
            This scaffold includes the App Router, Supabase setup, Query provider, shadcn/ui-inspired components, and route groups for auth, app, admin, and super admin.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group rounded-3xl border border-slate-800 bg-slate-900/80 p-6 transition hover:-translate-y-0.5 hover:border-slate-700"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xl font-semibold text-white">{card.title}</p>
                  <p className="mt-2 text-sm text-slate-400">Placeholder page for the {card.title} route.</p>
                </div>
                <ArrowRight className="h-5 w-5 text-slate-400 transition group-hover:text-white" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
