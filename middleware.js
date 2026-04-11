import { NextResponse } from 'next/server';

const SITE_USER = process.env.SITE_AUTH_USER || 'demo';
const SITE_PASS = process.env.SITE_AUTH_PASS || 'guardian2024';

export function middleware(request) {
  const authHeader = request.headers.get('authorization');

  if (authHeader) {
    const base64 = authHeader.split(' ')[1];
    const decoded = atob(base64);
    const [user, pass] = decoded.split(':');

    if (user === SITE_USER && pass === SITE_PASS) {
      return NextResponse.next();
    }
  }

  return new NextResponse('Access Denied', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Guardian Trust Demo Site"',
    },
  });
}

export const config = {
  // Protect all routes except Next.js internals and static files
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
