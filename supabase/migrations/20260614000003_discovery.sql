-- Discovery Layer Migration

-- Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  id text PRIMARY KEY,
  title text NOT NULL,
  description text,
  icon_url text
);

-- Countries Table
CREATE TABLE IF NOT EXISTS public.countries (
  iso_code char(2) PRIMARY KEY,
  name text NOT NULL,
  flag_url text,
  currency_code char(3),
  meta jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz
);

-- Featured Countries Table
CREATE TABLE IF NOT EXISTS public.featured_countries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id char(2) NOT NULL REFERENCES public.countries(iso_code) ON DELETE CASCADE,
  category_id text NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  display_order int NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz
);

CREATE INDEX IF NOT EXISTS featured_countries_active_idx ON public.featured_countries (active);
CREATE INDEX IF NOT EXISTS featured_countries_category_idx ON public.featured_countries (category_id, display_order);

-- Services Table
CREATE TABLE IF NOT EXISTS public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  category_id text NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  country_iso char(2) NOT NULL REFERENCES public.countries(iso_code) ON DELETE RESTRICT,
  unlock_fee numeric(12,2) NOT NULL DEFAULT 0,
  discount_percentage numeric(5,2) NOT NULL DEFAULT 0,
  currency char(3) NOT NULL DEFAULT 'KES',
  duration_estimate text,
  thumbnail_url text,
  published boolean NOT NULL DEFAULT false,
  tags text[],
  metadata jsonb,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz
);

CREATE INDEX IF NOT EXISTS services_category_country_idx ON public.services (category_id, country_iso);
CREATE INDEX IF NOT EXISTS services_published_idx ON public.services (published);
