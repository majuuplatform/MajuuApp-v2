-- Core Identity Migration

-- Create auth schema, users table, and auth helper functions inside a DO block
-- to handle permission denied (insufficient_privilege) on managed/remote Supabase databases
DO $$
BEGIN
  -- Attempt to create auth schema
  BEGIN
    CREATE SCHEMA IF NOT EXISTS auth;
  EXCEPTION WHEN insufficient_privilege THEN
    RAISE NOTICE 'Skipping CREATE SCHEMA auth due to insufficient privileges.';
  END;

  -- Attempt to create auth.users table
  BEGIN
    CREATE TABLE IF NOT EXISTS auth.users (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      email text UNIQUE,
      raw_user_meta_data jsonb,
      created_at timestamptz DEFAULT now()
    );
  EXCEPTION WHEN insufficient_privilege THEN
    RAISE NOTICE 'Skipping CREATE TABLE auth.users due to insufficient privileges.';
  END;

  -- Attempt to create auth.uid() function
  BEGIN
    CREATE OR REPLACE FUNCTION auth.uid()
    RETURNS uuid
    LANGUAGE sql STABLE
    AS $fn$
      SELECT coalesce(
        nullif(current_setting('request.jwt.claim.sub', true), ''),
        nullif(current_setting('request.jwt.claims', true)::jsonb->>'sub', '')
      )::uuid;
    $fn$;
  EXCEPTION WHEN insufficient_privilege THEN
    RAISE NOTICE 'Skipping CREATE FUNCTION auth.uid due to insufficient privileges.';
  END;

  -- Attempt to create auth.role() function
  BEGIN
    CREATE OR REPLACE FUNCTION auth.role()
    RETURNS text
    LANGUAGE sql STABLE
    AS $fn$
      SELECT coalesce(
        nullif(current_setting('request.jwt.claim.role', true), ''),
        nullif(current_setting('request.jwt.claims', true)::jsonb->>'role', '')
      )::text;
    $fn$;
  EXCEPTION WHEN insufficient_privilege THEN
    RAISE NOTICE 'Skipping CREATE FUNCTION auth.role due to insufficient privileges.';
  END;

  -- Attempt to create auth.email() function
  BEGIN
    CREATE OR REPLACE FUNCTION auth.email()
    RETURNS text
    LANGUAGE sql STABLE
    AS $fn$
      SELECT coalesce(
        nullif(current_setting('request.jwt.claim.email', true), ''),
        nullif(current_setting('request.jwt.claims', true)::jsonb->>'email', '')
      )::text;
    $fn$;
  EXCEPTION WHEN insufficient_privilege THEN
    RAISE NOTICE 'Skipping CREATE FUNCTION auth.email due to insufficient privileges.';
  END;
END $$;

-- Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL UNIQUE,
  full_name text,
  display_name text,
  avatar_url text,
  phone text,
  role profile_role DEFAULT 'user'::profile_role,
  locale text,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz
);

-- Function to handle new auth users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    COALESCE((new.raw_user_meta_data->>'role')::profile_role, 'user'::profile_role)
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call handle_new_user on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

