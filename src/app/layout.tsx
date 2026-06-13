import type { Metadata } from 'next';
import { QueryProvider } from '@/providers/QueryProvider';
import { SupabaseProvider } from '@/providers/SupabaseProvider';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'MAJUU V2',
  description: 'MAJUU platform foundation',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100">
        <SupabaseProvider>
          <QueryProvider>{children}</QueryProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
