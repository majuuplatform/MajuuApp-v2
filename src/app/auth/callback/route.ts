import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

interface AdminWhitelistEntry {
  id: string;
  email: string;
  role: 'SUPER_ADMIN' | 'AGENT_ADMIN';
  agency_id: string | null;
  can_create_superadmin: boolean;
  invited_by: string | null;
  created_at: string;
  used_at: string | null;
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createClient();
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data?.user) {
      const email = data.user.email;
      
      // Query admin whitelist to check role
      const adminDb = createAdminClient();
      const { data: whitelistEntry } = await adminDb
        .from('admin_whitelist')
        .select('*')
        .eq('email', email ?? '')
        .single() as { data: AdminWhitelistEntry | null };
        
      const host = request.headers.get('host') ?? '';
      const isLocal = host.includes('localhost') || host.includes('127.0.0.1');

      if (whitelistEntry) {
        const platformHost = isLocal ? '' : 'https://majuu-platform.vercel.app';
        if (whitelistEntry.role === 'SUPER_ADMIN') {
          return NextResponse.redirect(new URL('/majuu-platform/admin/dashboard', isLocal ? request.url : platformHost));
        } else if (whitelistEntry.role === 'AGENT_ADMIN') {
          return NextResponse.redirect(new URL('/majuu-platform/agency/dashboard', isLocal ? request.url : platformHost));
        }
      } else {
        const appHost = isLocal ? '' : 'https://majuu.vercel.app';
        return NextResponse.redirect(new URL('/app/home', isLocal ? request.url : appHost));
      }
    }
  }

  // Return user to original target or home page if authentication fails
  return NextResponse.redirect(new URL(next, request.url));
}
