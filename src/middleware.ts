import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const url = new URL(request.url);
  const isPlatformRoute = url.pathname.startsWith('/majuu-platform');
  const isAppRoute = url.pathname.startsWith('/app');
  const isAuthRoute = url.pathname.startsWith('/auth');

  if (isPlatformRoute || isAppRoute) {
    if (!user) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('next', url.pathname);
      return NextResponse.redirect(loginUrl);
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const isAdmin = profile?.role === 'super_admin' || profile?.role === 'agency_admin';

    const host = request.headers.get('host') ?? '';
    const isLocal = host.includes('localhost') || host.includes('127.0.0.1');

    if (isPlatformRoute && !isAdmin) {
      const appHost = isLocal ? '' : 'https://majuu.vercel.app';
      return NextResponse.redirect(new URL('/app/home', isLocal ? request.url : appHost));
    }

    if (isAppRoute && isAdmin) {
      if (url.pathname !== '/app/blocked') {
        return NextResponse.redirect(new URL('/app/blocked', request.url));
      }
    }

    if (url.pathname === '/app/blocked' && !isAdmin) {
      return NextResponse.redirect(new URL('/app/home', request.url));
    }
  }

  if (isAuthRoute && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const isAdmin = profile?.role === 'super_admin' || profile?.role === 'agency_admin';
    const host = request.headers.get('host') ?? '';
    const isLocal = host.includes('localhost') || host.includes('127.0.0.1');

    if (isAdmin) {
      const platformHost = isLocal ? '' : 'https://majuu-platform.vercel.app';
      const path = profile.role === 'super_admin' ? '/majuu-platform/admin/dashboard' : '/majuu-platform/agency/dashboard';
      return NextResponse.redirect(new URL(path, isLocal ? request.url : platformHost));
    } else {
      const appHost = isLocal ? '' : 'https://majuu.vercel.app';
      return NextResponse.redirect(new URL('/app/home', isLocal ? request.url : appHost));
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/app/:path*',
    '/auth/:path*',
    '/majuu-platform/:path*',
  ],
};
