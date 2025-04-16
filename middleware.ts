import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse, type NextRequest } from 'next/server';

// Define routes that should be protected (require authentication)
const isProtectedRoute = createRouteMatcher([
  '/community(.*)', // Protect the community page and all its sub-routes
  '/api/protected/(.*)', // Protect certain API routes
]);

// Clerk middleware to handle authentication
export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();
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

  // Check if the route is protected and the user is not authenticated
  if (isProtectedRoute(request) && !userId) {
    // Redirect unauthenticated users to sign-in
    const signInUrl = new URL('/sign-in', request.url);
    signInUrl.searchParams.set('redirect_url', encodeURI(request.url));
    return NextResponse.redirect(signInUrl);
  }
  
  // Allow the request to proceed
  return NextResponse.next({
    request: {
      headers,
    },
  });
});

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|api/manifest|service-worker.js|workbox-*.js|robots.txt|sitemap.xml).*)',
    // Always run for API routes
    '/api/(.*)',
  ],
};