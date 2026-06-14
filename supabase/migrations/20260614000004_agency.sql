-- Agency Layer Migration

-- Agencies Table
CREATE TABLE IF NOT EXISTS public.agencies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  website text,
  verified boolean NOT NULL DEFAULT false,
  active boolean NOT NULL DEFAULT true,
  headquarter_country_iso char(2) REFERENCES public.countries(iso_code) ON DELETE SET NULL,
  logo_url text,
  contact_email text NOT NULL,
  contact_phone text,
  address jsonb,
  payment_type text CHECK (payment_type IN ('TILL_NUMBER', 'PAYBILL', 'BANK_TRANSFER', 'MANUAL')),
  till_number text,
  paybill_number text,
  account_number text,
  daraja_consumer_key text,
  daraja_consumer_secret text,
  daraja_passkey text,
  metadata jsonb,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz
);

CREATE INDEX IF NOT EXISTS agencies_active_idx ON public.agencies (active);
CREATE INDEX IF NOT EXISTS agencies_verified_idx ON public.agencies (verified);

-- Agency Admins Table
CREATE TABLE IF NOT EXISTS public.agency_admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id uuid NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'admin',
  is_primary boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(agency_id, user_id)
);

CREATE INDEX IF NOT EXISTS agency_admins_user_idx ON public.agency_admins (user_id);

-- Agency Services Table
CREATE TABLE IF NOT EXISTS public.agency_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id uuid NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  service_id uuid NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  agency_price numeric(12,2) NOT NULL,
  currency char(3) NOT NULL DEFAULT 'KES',
  active boolean NOT NULL DEFAULT true,
  effective_from date NOT NULL DEFAULT CURRENT_DATE,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz,
  UNIQUE(agency_id, service_id)
);

CREATE INDEX IF NOT EXISTS agency_services_service_idx ON public.agency_services (service_id);
CREATE INDEX IF NOT EXISTS agency_services_active_idx ON public.agency_services (active);
