# Next.js Migration Guide

This document outlines the migration process from the Vite+React+Express stack to Next.js with App Router.

## Migration Status

- ✅ Set up Next.js App Router directory structure 
- ✅ Migrated all UI components
- ✅ Fixed client-side hooks for Next.js
- ✅ Configured proper client/server rendering
- ✅ Added PWA support (manifest, robots, sitemap)
- ✅ Added scripts for development and production
- ✅ Set up static assets management
- ✅ Implemented server configuration for dual deployment
- ✅ Improved useOffline hook to prevent hydration errors
- ✅ Enhanced logging for better debugging
- ✅ Updated next-server.js for better error handling
- ✅ Cleaned up redundant migration scripts
- ✅ Updated .gitignore for Next.js patterns
- 🔄 Working on removing Vite configurations
- 🔄 Transitioning API routes to Next.js

## How to Run the Next.js App

### Development Mode (Combined Setup)

To run both Express API and Next.js frontend in development mode:

```bash
node run-app.js
```

This script starts:
- Express API server on port 5000
- Next.js frontend server on port 3000

### Development Mode (Next.js Only)

To run only the Next.js development server:

```bash
node next-server.js
```

### Production Build and Start

```bash
# Build both Next.js frontend and Express API
npm run build

# Start the production server
npm run start
```

## Migration Process

1. **Directory Structure**: Created Next.js App Router structure in `/app`
2. **Component Migration**: Migrated components with client/server rendering directives
3. **Hook Fixes**: Updated hooks for proper server/client handling
   - Added `'use client'` directive to all client-side components
   - Fixed useState initialization to prevent hydration mismatches
   - Added safety checks for browser-only APIs
4. **Configuration**: Updated tsconfig.json and next.config.mjs
5. **Theming**: Configured next-themes for dark/light mode
6. **PWA Support**: Added manifest.ts, robots.ts, and sitemap.ts
7. **Static Assets**: Set up public directory with icon files
8. **Server Scripts**: Enhanced scripts for development and production

## Handling Client-Side Code

In Next.js App Router, client-side code needs special handling:

```tsx
// For components that use browser APIs
'use client';

// Safe initialization for useState with browser APIs
const [isOnline, setIsOnline] = useState(() => {
  // Default value for SSR
  if (typeof window === 'undefined') return true;
  // Browser value for client
  return navigator.onLine;
});

// For importing client components in server components
import dynamic from 'next/dynamic';

const ClientComponent = dynamic(() => import('./ClientComponent'), {
  ssr: false, // Don't render during SSR
});
```

## Dual Server Architecture

During migration, we're running two servers:

1. **Express API (port 5000)**: Handles all data operations and authentication
2. **Next.js Frontend (port 3000)**: Serves the UI and static assets

The Express server redirects non-API requests to the Next.js server:

```typescript
// In server/index.ts
app.use((req, res, next) => {
  // If request is for API, process normally
  if (req.path.startsWith('/api')) {
    return next();
  }
  
  // Otherwise redirect to Next.js server
  res.redirect(`http://localhost:3000${req.url}`);
});
```

## Next Steps

1. **API Migration**:
   - Create Next.js API routes to mirror Express endpoints
   - Gradually shift data fetching to Server Components

2. **Server Component Implementation**:
   - Move data fetching logic to server components
   - Optimize rendering with streaming and suspense

3. **Cleanup**:
   - Remove remaining Vite configuration
   - Consolidate server implementations
   - Eliminate redundant code and dependencies

4. **Testing and Deployment**:
   - Comprehensive testing across all features
   - Set up CI/CD pipeline for Next.js application
   - Configure proper environment variables for production