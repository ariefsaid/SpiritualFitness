# Migration Plan: Express to Next.js

## Overview
This document outlines the step-by-step migration plan from the current Express/Vite/React architecture to a pure Next.js App Router architecture.

## Phase 1: API Migration (In Progress)
- [x] Create Next.js API route handlers for quotes endpoints
- [x] Create Next.js API route handlers for achievements endpoints
- [ ] Create Next.js API route handlers for community endpoints
- [ ] Create Next.js API route handlers for prayer endpoints
- [ ] Create Next.js API route handlers for fasting endpoints
- [ ] Create Next.js API route handlers for Quran reading endpoints
- [ ] Create Next.js API route handlers for user authentication
- [ ] Create Next.js API route handlers for offline sync

## Phase 2: Data Layer Migration
- [ ] Move storage.ts from `/server` directory to `/app/lib/storage.ts`
- [ ] Create a proper database connection layer in Next.js
- [ ] Move schema.ts to `/app/lib/schema.ts`
- [ ] Refactor storage class to use Next.js patterns

## Phase 3: Frontend Migration
- [x] Create Next.js app directory structure
- [x] Set up Next.js layout, page, and loading components
- [x] Implement PWA manifest and service worker
- [ ] Migrate React components to use Next.js patterns
- [ ] Implement client and server components appropriately
- [ ] Adapt authentication flow to Next.js
- [ ] Set up proper error boundaries

## Phase 4: Testing & Validation
- [ ] Set up comprehensive testing for API endpoints
- [ ] Validate offline functionality 
- [ ] Test authentication flows
- [ ] Validate PWA installation and caching

## Phase 5: Cleanup & Optimization
- [ ] Remove Express server code
- [ ] Remove Vite configuration
- [ ] Clean up deprecated dependencies
- [ ] Update package.json scripts
- [ ] Optimize build and deployment configuration

## Timeline
- Phase 1: 2 days
- Phase 2: 1 day
- Phase 3: 2 days
- Phase 4: 1 day
- Phase 5: 1 day

Total estimated time: 7 days