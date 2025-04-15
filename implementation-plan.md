
# Clerk & Supabase Integration Implementation Plan

## 1. Dependencies Status
- [x] Next.js with TypeScript (already set up)
- [x] Need to install Clerk SDK:
  ```bash
  npm install @clerk/nextjs
  ```
- [x] Supabase client installed

## 2. Key Files to Create/Update

### Authentication Components (Using Clerk's Pre-built UI)
- Use `<SignIn />` component for sign-in
- Use `<SignUp />` component for registration 
- Use `<UserButton />` for user menu
- Use `<SignedIn>` and `<SignedOut>` for conditional rendering

### Authentication Layer
- Create: `app/lib/supabase.ts` - Supabase client with Clerk token integration
- Update: `app/middleware.ts` - Configure Clerk middleware
- Update: `app/providers.tsx` - Add ClerkProvider wrapper

### Base Configuration
- [x] Environment variables already configured 
- [x] Middleware protection for authenticated routes
- Token forwarding setup:
  - [x] Configure Clerk as auth provider in Supabase
  - [ ] Create Supabase client with Clerk token forwarding
  - [ ] Test RLS policies with forwarded token

### Folder Structure
```
app/
  lib/
    supabase.ts (new)
  middleware.ts (update)
  providers.tsx (update)
  (sign-in)/
    [[...sign-in]]/
      page.tsx (using Clerk's <SignIn/>)
  (sign-up)/
    [[...sign-up]]/
      page.tsx (using Clerk's <SignUp/>)
```

## 3. Implementation Steps

1. Configure ClerkProvider in app wrapper
2. Set up authentication pages using Clerk components
3. Initialize Supabase client with Clerk integration
4. Set up Clerk middleware for route protection
5. Test authentication flow

## 4. Next Steps (Future Tickets)
- User profile syncing between Clerk and Supabase
- Enhanced RLS policies
- Storage bucket configuration
- Offline data sync strategy
