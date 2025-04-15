
# Minimum Viable Supabase-Clerk Configuration

## Supabase Dashboard Setup

1. Enable Row Level Security (RLS) on all tables
2. Create base users table:

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

## Clerk Dashboard Setup

1. Configure Supabase as JWT template:
   - Navigate to JWT Templates
   - Add new template for Supabase
   - Set custom claims:
     ```json
     {
       "role": "authenticated"
     }
     ```

2. Enable required authentication methods:
   - Email/Password
   - OAuth (optional)

## Basic Integration Test

1. Sign in with Clerk
2. Verify JWT token contains required Supabase claims
3. Test Supabase authenticated query
4. Verify RLS policies are working

Note: This is the minimal setup required for authentication. Additional tables and policies will be added in subsequent tickets.
