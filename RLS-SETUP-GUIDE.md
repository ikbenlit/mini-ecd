# Row Level Security (RLS) Setup Guide for Mini-ECD

This guide walks you through fixing the "new row violates row-level security policy" error and setting up proper RLS policies for your Mini-ECD demo application.

## Problem Summary

Your Supabase database has RLS enabled but no policies defined, which blocks all insert operations by default. This affects your seed data functionality and demo workflow.

## Solution Overview

We've implemented a dual approach:
1. **RLS Policies**: Allow authenticated users full access to demo data
2. **Admin Client**: Server-side operations use service role key to bypass RLS

## Step-by-Step Implementation

### Step 1: Apply RLS Policies in Supabase

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `/mnt/c/development/15-mini-epd-prototype/supabase/rls-policies.sql`
4. Paste and execute the SQL commands

The policies will:
- Enable RLS on all tables (clients, intake_notes, problem_profiles, treatment_plans, ai_events)
- Allow authenticated users full CRUD access to all demo data
- Keep the security model simple for MVP/demo purposes

### Step 2: Configure Service Role Key

1. In your Supabase dashboard, go to Settings → API
2. Copy the "service_role" key (not the anon/public key)
3. In your `.env` file, add:
   ```
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```

**Security Note**: The service role key bypasses RLS and should never be exposed to client-side code.

### Step 3: Verify Setup

The seed operations should now work via two paths:

**Path 1: Admin Client (Recommended for seed operations)**
- Uses `supabaseAdmin` client with service role key
- Bypasses RLS entirely for server-side operations
- Used by API endpoints like `/api/seed`

**Path 2: Regular Client with RLS Policies**
- Uses regular `supabase` client with anon key
- Requires user authentication
- Protected by RLS policies we created

## Code Changes Made

### Files Created:
1. `/mnt/c/development/15-mini-epd-prototype/supabase/rls-policies.sql` - RLS policy definitions
2. `/mnt/c/development/15-mini-epd-prototype/src/lib/server/supabase-admin.ts` - Admin client configuration

### Files Modified:
1. `/mnt/c/development/15-mini-epd-prototype/src/lib/utils/seed-client.ts` - Updated to use admin client
2. `/mnt/c/development/15-mini-epd-prototype/.env.example` - Added service role key

## Testing the Setup

### Test 1: Seed Data via API
```bash
# Clear existing data
curl -X DELETE http://localhost:5173/api/seed

# Seed new data
curl -X POST http://localhost:5173/api/seed

# Check status
curl -X GET http://localhost:5173/api/seed
```

### Test 2: Direct Database Access (with authentication)
If you implement user authentication, regular users will be able to access data through the RLS policies.

## RLS Policy Structure

Each table has 4 policies:
- **SELECT**: `demo_<table>_select_policy` - Allows reading all records
- **INSERT**: `demo_<table>_insert_policy` - Allows creating new records  
- **UPDATE**: `demo_<table>_update_policy` - Allows updating existing records
- **DELETE**: `demo_<table>_delete_policy` - Allows deleting records

All policies use `TO authenticated` and `USING (true)` for maximum simplicity in the demo environment.

## Security Considerations for Demo/MVP

✅ **Good for Demo:**
- Simple policies that "just work" for authenticated users
- Admin operations work seamlessly for seeding
- EU data residency maintained (using EU regions)

⚠️ **Before Production:**
- Implement proper user-based access controls
- Add data validation in RLS policies
- Implement audit logging for sensitive operations
- Use more restrictive policies based on user roles

## Troubleshooting

### Issue: "Missing environment variable" 
**Solution**: Ensure `SUPABASE_SERVICE_ROLE_KEY` is in your `.env` file

### Issue: Policies still blocking operations
**Solution**: Verify policies are applied by running the verification queries in the SQL file

### Issue: Client-side operations fail
**Solution**: Implement user authentication or adjust policies as needed

### Issue: Service role key not working
**Solution**: Double-check you copied the service_role key, not the anon key from Supabase dashboard

## Next Steps

1. Apply the RLS policies using the SQL file
2. Configure the service role key in your environment
3. Test seed operations via `/api/seed`
4. Implement user authentication for client-side access
5. Begin building the demo workflow UI

---

**Files Referenced:**
- `/mnt/c/development/15-mini-epd-prototype/supabase/rls-policies.sql`
- `/mnt/c/development/15-mini-epd-prototype/src/lib/server/supabase-admin.ts`
- `/mnt/c/development/15-mini-epd-prototype/src/lib/utils/seed-client.ts`
- `/mnt/c/development/15-mini-epd-prototype/.env.example`