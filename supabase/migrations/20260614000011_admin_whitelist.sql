-- 1. Create admin_whitelist Table
CREATE TABLE IF NOT EXISTS public.admin_whitelist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  role text NOT NULL CHECK (role IN ('SUPER_ADMIN','AGENT_ADMIN')),
  agency_id uuid REFERENCES public.agencies(id) ON DELETE SET NULL,
  can_create_superadmin boolean DEFAULT false,
  invited_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  used_at timestamptz
);

-- Enable RLS on admin_whitelist
ALTER TABLE public.admin_whitelist ENABLE ROW LEVEL SECURITY;

-- 2. Create RLS policies for admin_whitelist
CREATE POLICY "Super admins can manage admin_whitelist"
ON public.admin_whitelist
FOR ALL
TO authenticated
USING (public.is_super_admin());

CREATE POLICY "Users can read own whitelist entry"
ON public.admin_whitelist
FOR SELECT
TO authenticated
USING (email = auth.email());

-- 3. Redefine handle_new_user to check the whitelist on sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_role text;
  v_agency_id uuid;
  v_profile_role public.profile_role;
BEGIN
  -- Check if user is in admin_whitelist
  SELECT role, agency_id INTO v_role, v_agency_id
  FROM public.admin_whitelist
  WHERE email = new.email;

  IF FOUND THEN
    -- Map whitelist role to profiles.role enum
    IF v_role = 'SUPER_ADMIN' THEN
      v_profile_role := 'super_admin'::public.profile_role;
    ELSIF v_role = 'AGENT_ADMIN' THEN
      v_profile_role := 'agency_admin'::public.profile_role;
    ELSE
      v_profile_role := 'user'::public.profile_role;
    END IF;

    -- Create profile
    INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
    VALUES (
      new.id,
      new.email,
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'avatar_url',
      v_profile_role
    );

    -- If agent_admin, also insert into agency_admins
    IF v_role = 'AGENT_ADMIN' AND v_agency_id IS NOT NULL THEN
      INSERT INTO public.agency_admins (agency_id, user_id, role, is_primary)
      VALUES (v_agency_id, new.id, 'admin', true)
      ON CONFLICT (agency_id, user_id) DO NOTHING;
    END IF;

    -- Mark whitelist entry as used
    UPDATE public.admin_whitelist
    SET used_at = now()
    WHERE email = new.email;

  ELSE
    -- Treat as normal user
    INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
    VALUES (
      new.id,
      new.email,
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'avatar_url',
      'user'::public.profile_role
    );
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Seed Initial Super Admin
INSERT INTO public.admin_whitelist (
  email,
  role,
  can_create_superadmin
)
VALUES (
  'brioneroo@gmail.com',
  'SUPER_ADMIN',
  true
)
ON CONFLICT (email) DO UPDATE
SET role = EXCLUDED.role,
    can_create_superadmin = EXCLUDED.can_create_superadmin;
