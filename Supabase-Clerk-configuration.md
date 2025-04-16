
# Step-by-Step Supabase & Clerk Configuration Guide

## Clerk Dashboard Setup (https://dashboard.clerk.com)

1. [x] Create New Application
   - Click "Add Application" button
   - Name it "FaithfulSteps"
   - Select "Next.js" as your framework

2. [x] Set Up Native Integration
   - Go to Clerk Dashboard → "Supabase integration setup"
   - Select configuration options and click "Activate Supabase integration"
   - Copy the provided Clerk domain
   - In Supabase Dashboard → "Authentication" → "Sign In / Up"
   - Add Clerk as a provider and paste the Clerk domain

3. [x] Enable Sign-In Methods
   - Go to "User & Authentication" → "Email, Phone, Username"
   - Enable "Email/Password"
   - Enable "Google" under "Social Connections"

4. [x] Copy Environment Variables
   - Go to "API Keys" in sidebar
   - Copy "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
   - Copy "CLERK_SECRET_KEY"
   - These are already set in Replit Secrets ✅

## Supabase Project Setup (https://app.supabase.com)

1. [x] Create New Project
   - Click "New project" button
   - Name it "FaithfulSteps"
   - Choose a strong database password
   - Select closest region
   - Wait for setup (~2 minutes)

2. [x] Get Project Credentials
   - Go to Project Settings → API
   - Copy "Project URL" (already set as SUPABASE_URL in Replit) ✅
   - Copy "anon/public" key (already set as SUPABASE_ANON_KEY in Replit) ✅

3. [x] Create Base Tables
   - Go to "SQL Editor"
   - Create profiles table:

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

-- Create an index on user_id for better performance
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated reads
CREATE POLICY "Users can read own profile" 
ON profiles
FOR SELECT 
USING (auth.jwt()->>'sub' = user_id::text);

-- Create policy for authenticated updates
CREATE POLICY "Users can update own profile"
ON profiles
FOR UPDATE
USING (auth.jwt()->>'sub' = user_id::text)
WITH CHECK (auth.jwt()->>'sub' = user_id::text);

-- Create policy for authenticated inserts
CREATE POLICY "Users can insert own profile"
ON profiles
FOR INSERT
WITH CHECK (auth.jwt()->>'sub' = user_id::text);
```

4. [x] Configure Supabase Client
   - Verify Supabase client is initialized with Clerk token forwarding ✅

## Verification Steps

1. [ ] Check Clerk Setup
   - Visit your app URL
   - Click Sign In/Sign Up
   - Try to create a new account
   - Verify you can sign in

2. [ ] Check Supabase Connection
   - Sign in to your app
   - Check browser console for any errors
   - Verify user entry is created in Supabase profiles table
