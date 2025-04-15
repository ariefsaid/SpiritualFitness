
# Step-by-Step Supabase & Clerk Configuration Guide

## Clerk Dashboard Setup (https://dashboard.clerk.com)

1. [x] Create New Application
   - Click "Add Application" button
   - Name it "FaithfulSteps"
   - Select "Next.js" as your framework

2. Set Up Authentication Methods
   - Go to "JWT Templates" in sidebar
   - Click "New Template"
   - Choose "Supabase" from templates
   - Copy provided template
   - Click "Create Template"

3. Enable Sign-In Methods
   - Go to "User & Authentication" → "Email, Phone, Username"
   - Enable "Email/Password"
   - (Optional) Enable "Google" under "Social Connections"

4. Copy Environment Variables
   - Go to "API Keys" in sidebar
   - Copy "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
   - Copy "CLERK_SECRET_KEY"
   - These are already set in Replit Secrets ✅

## Supabase Project Setup (https://app.supabase.com)

1. Create New Project
   - Click "New project" button
   - Name it "FaithfulSteps"
   - Choose a strong database password
   - Select closest region
   - Wait for setup (~2 minutes)

2. Get Project Credentials
   - Go to Project Settings → API
   - Copy "Project URL" (already set as SUPABASE_URL in Replit) ✅
   - Copy "anon/public" key (already set as SUPABASE_ANON_KEY in Replit) ✅

3. Create Base Tables
   - Go to "SQL Editor"
   - Copy and paste this SQL:

```sql
-- Create users table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  clerk_id TEXT NOT NULL UNIQUE,
  username TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated reads
CREATE POLICY "Users can read own data"
ON users
FOR SELECT
USING (auth.uid() = clerk_id);

-- Create policy for authenticated updates
CREATE POLICY "Users can update own data"
ON users
FOR UPDATE
USING (auth.uid() = clerk_id);
```

4. Run the SQL query
   - Click "Run" button
   - Verify tables are created under "Database" → "Tables"

## Verification Steps

1. Check Clerk Setup
   - Visit your app URL
   - Click Sign In/Sign Up
   - Try to create a new account
   - Verify you can sign in

2. Check Supabase Connection
   - Sign in to your app
   - Check browser console for any errors
   - Verify user entry is created in Supabase users table
