import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/app/:path*', '/auth/:path*', '/admin/:path*', '/super-admin/:path*'],
};
