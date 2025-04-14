
import { NextResponse, type NextRequest } from 'next/server';

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|service-worker.js|workbox-*.js|robots.txt|sitemap.xml|api/auth/login|api/auth/register|api/quotes|api/community/groups).*)',
  ],
};

export default async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Add security headers
  const headers = new Headers(request.headers);
  headers.set('x-frame-options', 'DENY');
  headers.set('x-content-type-options', 'nosniff');
  headers.set('referrer-policy', 'strict-origin-when-cross-origin');

  // Public pages and API routes that don't need auth
  const publicPaths = ['/', '/auth/login', '/auth/register'];
  const isPublicPath = publicPaths.some(pp => path === pp || path.startsWith('/static'));
  const hasSession = request.cookies.has('next-auth.session-token');

  if (isPublicPath || hasSession) {
    return NextResponse.next({
      request: {
        headers,
      },
    });
  }

  if (path.startsWith('/api/')) {
    return NextResponse.next({
      request: {
        headers,
      },
    });
  }

  const url = new URL('/auth/login', request.url);
  url.searchParams.set('callbackUrl', encodeURI(request.url));
  return NextResponse.redirect(url);
}
