import { NextResponse, type NextRequest } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - api routes that don't require auth
     */
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|service-worker.js|workbox-*.js|robots.txt|sitemap.xml|api/auth/login|api/auth/register|api/quotes|api/community/groups).*)',
  ],
};

export default async function middleware(request: NextRequest) {
  // Get path and session token
  const path = request.nextUrl.pathname;
  const hasSession = request.cookies.has('next-auth.session-token');

  // Public pages accessible without login
  const publicPages = ['/', '/auth/login', '/auth/register'];
  const isPublicPage = publicPages.some(page => path === page || path.startsWith('/static'));

  // If it's a public page or they have a session, proceed
  if (isPublicPage || hasSession) {
    return NextResponse.next();
  }

  // API route handling happens in the API routes themselves
  if (path.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Redirect to login
  const url = new URL('/auth/login', request.url);
  url.searchParams.set('callbackUrl', encodeURI(request.url));
  return NextResponse.redirect(url);
}