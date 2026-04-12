import { NextResponse } from 'next/server';

const ACCESS_TOKEN = process.env.SITE_ACCESS_TOKEN || 'gt-demo-access-2024';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Allow the gate page and its API through without auth
  if (
    pathname.startsWith('/gate') ||
    pathname.startsWith('/api/gate') ||
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Check for valid access cookie
  const cookie = request.cookies.get('gt_access');
  if (cookie?.value === ACCESS_TOKEN) {
    return NextResponse.next();
  }

  // No valid cookie — redirect to gate page
  const gateUrl = new URL('/gate', request.url);
  gateUrl.searchParams.set('from', pathname);
  return NextResponse.redirect(gateUrl);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
