
# Clerk & Supabase Integration Implementation Plan

## 1. Dependencies Status
- [x] Next.js with TypeScript (already set up)
- [x] Clerk SDK installed:
  ```bash
  npm install @clerk/nextjs
  ```
- [x] Supabase client installed

## 2. Key Files to Create/Update

### Authentication Components (Using Clerk's Pre-built UI)
- [x] Use `<SignIn />` component for sign-in
- [x] Use `<SignUp />` component for registration 
- [x] Use `<UserButton />` for user menu
- [x] Use `<SignedIn>` and `<SignedOut>` for conditional rendering

### Authentication Layer
- [x] Create: `app/lib/supabase-client.ts` - Supabase client with Clerk token integration
- [x] Update: `app/middleware.ts` - Configure Clerk middleware
- [x] Update: `app/providers.tsx` - Add ClerkProvider wrapper

### Base Configuration
- [x] Environment variables configured 
- [x] Middleware protection for authenticated routes
- Token forwarding setup:
  - [x] Configure Clerk as auth provider in Supabase
  - [x] Create Supabase client with Clerk token forwarding
  - [ ] Test RLS policies with forwarded token

### Database Schema
```sql
CREATE TABLE public.profiles (
    id bigint primary key generated always as identity,
    user_id uuid references auth.users(id) on delete cascade,
    display_name text,
    avatar_url text,
    bio text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Performance optimization
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
```

### Folder Structure
```
app/
  lib/
    supabase-client.ts ✓
  middleware.ts ✓
  providers.tsx ✓
  (sign-in)/
    [[...sign-in]]/
      page.tsx ✓
  (sign-up)/
    [[...sign-up]]/
      page.tsx ✓
```

## 3. Implementation Steps

1. [x] Configure ClerkProvider in app wrapper
2. [x] Set up authentication pages using Clerk components
3. [x] Initialize Supabase client with Clerk integration
4. [x] Set up Clerk middleware for route protection
5. [ ] Test authentication flow

## 4. Next Steps (Future Tickets)
- [ ] User profile syncing between Clerk and Supabase
- [ ] Enhanced RLS policies
- [ ] Storage bucket configuration
- [ ] Offline data sync strategy
