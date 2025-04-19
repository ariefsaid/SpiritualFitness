
import { NextResponse, type NextRequest } from 'next/server';

export const config = {
  matcher: [
    // Protected pages and API routes that need auth
    '/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|api/manifest|service-worker.js|workbox-*.js|robots.txt|sitemap.xml|api/auth/login|api/auth/register|api/auth/me|api/test).*)',
  ],
};

export default async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Add security headers
  const headers = new Headers(request.headers);
  headers.set('x-frame-options', 'SAMEORIGIN'); // Changed from DENY to SAMEORIGIN for Replit embedding
  headers.set('x-content-type-options', 'nosniff');
  headers.set('referrer-policy', 'strict-origin-when-cross-origin');
  // Add CORS headers for development in Replit
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Public pages that don't need auth
  const publicPaths = [
    '/', 
    '/login', 
    '/register',
    '/offline'
  ];
  
  const isPublicPath = publicPaths.some(pp => 
    path === pp || 
    path.startsWith('/static') || 
    path.startsWith('/_next')
  );
  
  // Check for user_id cookie (our custom auth system)
  const hasAuth = request.cookies.has('user_id');

  // Allow access to public paths or if user is authenticated
  if (isPublicPath || hasAuth) {
    return NextResponse.next({
      request: {
        headers,
      },
    });
  }

  // Handle API routes that need auth differently
  if (path.startsWith('/api/')) {
    // If it's an API route requiring auth, let the API handle auth errors
    return NextResponse.next({
      request: {
        headers,
      },
    });
  }

  // Redirect unauthenticated users to login
  const url = new URL('/login', request.url);
  url.searchParams.set('callbackUrl', encodeURI(request.url));
  return NextResponse.redirect(url);
}
