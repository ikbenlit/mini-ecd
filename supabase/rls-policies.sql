-- Mini-ECD Demo RLS Policies
-- Simple security model for demo/MVP: authenticated users have full access
-- Run these commands in Supabase SQL editor to fix RLS policy errors

-- =============================================================================
-- CLIENTS TABLE POLICIES
-- =============================================================================

-- Enable RLS on clients table
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Policy: Allow PUBLIC read access to all clients for the demo
DROP POLICY IF EXISTS "Public read access for clients" ON clients;
CREATE POLICY "Public read access for clients" ON clients
    FOR SELECT
    USING (true);

-- Policy: Allow authenticated users to insert clients
DROP POLICY IF EXISTS "demo_clients_insert_policy" ON clients;
CREATE POLICY "demo_clients_insert_policy" ON clients
    FOR INSERT 
    TO authenticated 
    WITH CHECK (true);
-- Policy: Allow authenticated users to update clients
DROP POLICY IF EXISTS "demo_clients_update_policy" ON clients;
CREATE POLICY "demo_clients_update_policy" ON clients
    FOR UPDATE 
    TO authenticated 
    USING (true) 
    WITH CHECK (true);

-- Policy: Allow authenticated users to delete clients
DROP POLICY IF EXISTS "demo_clients_delete_policy" ON clients;
CREATE POLICY "demo_clients_delete_policy" ON clients
    FOR DELETE
    TO authenticated
    USING (true);

-- =============================================================================
-- INTAKE_NOTES TABLE POLICIES
-- =============================================================================

-- Enable RLS on intake_notes table (if not already enabled)
ALTER TABLE intake_notes ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to read all intake notes
DROP POLICY IF EXISTS "demo_intake_notes_select_policy" ON intake_notes;
CREATE POLICY "demo_intake_notes_select_policy" ON intake_notes
    FOR SELECT
    TO authenticated
    USING (true);

-- Policy: Allow authenticated users to insert intake notes
DROP POLICY IF EXISTS "demo_intake_notes_insert_policy" ON intake_notes;
CREATE POLICY "demo_intake_notes_insert_policy" ON intake_notes
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Policy: Allow authenticated users to update intake notes
DROP POLICY IF EXISTS "demo_intake_notes_update_policy" ON intake_notes;
CREATE POLICY "demo_intake_notes_update_policy" ON intake_notes
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Policy: Allow authenticated users to delete intake notes
DROP POLICY IF EXISTS "demo_intake_notes_delete_policy" ON intake_notes;
CREATE POLICY "demo_intake_notes_delete_policy" ON intake_notes
    FOR DELETE
    TO authenticated
    USING (true);

-- =============================================================================
-- PROBLEM_PROFILES TABLE POLICIES
-- =============================================================================

-- Enable RLS on problem_profiles table (if not already enabled)
ALTER TABLE problem_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to read all problem profiles
DROP POLICY IF EXISTS "demo_problem_profiles_select_policy" ON problem_profiles;
CREATE POLICY "demo_problem_profiles_select_policy" ON problem_profiles
    FOR SELECT
    TO authenticated
    USING (true);

-- Policy: Allow authenticated users to insert problem profiles
DROP POLICY IF EXISTS "demo_problem_profiles_insert_policy" ON problem_profiles;
CREATE POLICY "demo_problem_profiles_insert_policy" ON problem_profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Policy: Allow authenticated users to update problem profiles
DROP POLICY IF EXISTS "demo_problem_profiles_update_policy" ON problem_profiles;
CREATE POLICY "demo_problem_profiles_update_policy" ON problem_profiles
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Policy: Allow authenticated users to delete problem profiles
DROP POLICY IF EXISTS "demo_problem_profiles_delete_policy" ON problem_profiles;
CREATE POLICY "demo_problem_profiles_delete_policy" ON problem_profiles
    FOR DELETE
    TO authenticated
    USING (true);

-- =============================================================================
-- TREATMENT_PLANS TABLE POLICIES
-- =============================================================================

-- Enable RLS on treatment_plans table (if not already enabled)
ALTER TABLE treatment_plans ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to read all treatment plans
DROP POLICY IF EXISTS "demo_treatment_plans_select_policy" ON treatment_plans;
CREATE POLICY "demo_treatment_plans_select_policy" ON treatment_plans
    FOR SELECT
    TO authenticated
    USING (true);

-- Policy: Allow authenticated users to insert treatment plans
DROP POLICY IF EXISTS "demo_treatment_plans_insert_policy" ON treatment_plans;
CREATE POLICY "demo_treatment_plans_insert_policy" ON treatment_plans
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Policy: Allow authenticated users to update treatment plans
DROP POLICY IF EXISTS "demo_treatment_plans_update_policy" ON treatment_plans;
CREATE POLICY "demo_treatment_plans_update_policy" ON treatment_plans
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Policy: Allow authenticated users to delete treatment plans
DROP POLICY IF EXISTS "demo_treatment_plans_delete_policy" ON treatment_plans;
CREATE POLICY "demo_treatment_plans_delete_policy" ON treatment_plans
    FOR DELETE
    TO authenticated
    USING (true);

-- =============================================================================
-- AI_EVENTS TABLE POLICIES
-- =============================================================================

-- Enable RLS on ai_events table (if not already enabled)
ALTER TABLE ai_events ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to read all AI events
DROP POLICY IF EXISTS "demo_ai_events_select_policy" ON ai_events;
CREATE POLICY "demo_ai_events_select_policy" ON ai_events
    FOR SELECT
    TO authenticated
    USING (true);

-- Policy: Allow authenticated users to insert AI events
DROP POLICY IF EXISTS "demo_ai_events_insert_policy" ON ai_events;
CREATE POLICY "demo_ai_events_insert_policy" ON ai_events
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Policy: Allow authenticated users to update AI events
DROP POLICY IF EXISTS "demo_ai_events_update_policy" ON ai_events;
CREATE POLICY "demo_ai_events_update_policy" ON ai_events
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Policy: Allow authenticated users to delete AI events
DROP POLICY IF EXISTS "demo_ai_events_delete_policy" ON ai_events;
CREATE POLICY "demo_ai_events_delete_policy" ON ai_events
    FOR DELETE
    TO authenticated
    USING (true);

-- =============================================================================
-- VERIFICATION QUERIES
-- =============================================================================

-- Verify all policies are created correctly
SELECT schemaname, tablename, policyname, roles, cmd
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, cmd;

-- Check RLS status for all tables
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename IN ('clients', 'intake_notes', 'problem_profiles', 'treatment_plans', 'ai_events');