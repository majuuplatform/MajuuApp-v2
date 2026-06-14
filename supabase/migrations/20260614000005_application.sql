-- Application Layer Migration

-- Form Templates Table
CREATE TABLE IF NOT EXISTS public.form_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  name text NOT NULL,
  version int NOT NULL DEFAULT 1,
  schema jsonb,
  ui_schema jsonb,
  active boolean NOT NULL DEFAULT true,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz,
  UNIQUE(service_id, version)
);

CREATE INDEX IF NOT EXISTS form_templates_service_idx ON public.form_templates (service_id);

-- Form Fields Table
CREATE TABLE IF NOT EXISTS public.form_fields (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid NOT NULL REFERENCES public.form_templates(id) ON DELETE CASCADE,
  field_key text NOT NULL,
  label text NOT NULL,
  field_type form_field_type NOT NULL,
  placeholder text,
  options jsonb,
  required boolean NOT NULL DEFAULT false,
  validation_rules jsonb,
  display_order int NOT NULL DEFAULT 0,
  section text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(template_id, field_key)
);

CREATE INDEX IF NOT EXISTS form_fields_template_idx ON public.form_fields (template_id, display_order);

-- Requests Table
CREATE TABLE IF NOT EXISTS public.requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_number text NOT NULL UNIQUE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  agency_id uuid NOT NULL REFERENCES public.agencies(id) ON DELETE RESTRICT,
  service_id uuid NOT NULL REFERENCES public.services(id) ON DELETE RESTRICT,
  country_iso char(2) NOT NULL REFERENCES public.countries(iso_code) ON DELETE RESTRICT,
  category_id text NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  status request_status NOT NULL DEFAULT 'NEW'::request_status,
  result request_result,
  assigned_to uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  priority smallint NOT NULL DEFAULT 0,
  is_chat_unlocked boolean NOT NULL DEFAULT false,
  unlock_fee_paid boolean NOT NULL DEFAULT false,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  archived_at timestamptz
);

CREATE INDEX IF NOT EXISTS requests_user_idx ON public.requests (user_id);
CREATE INDEX IF NOT EXISTS requests_agency_idx ON public.requests (agency_id);
CREATE INDEX IF NOT EXISTS requests_status_idx ON public.requests (status);
CREATE INDEX IF NOT EXISTS requests_created_at_idx ON public.requests (created_at);
CREATE INDEX IF NOT EXISTS requests_updated_at_idx ON public.requests (updated_at);
CREATE INDEX IF NOT EXISTS requests_agency_status_created_idx ON public.requests (agency_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS requests_user_status_idx ON public.requests (user_id, status);
CREATE INDEX IF NOT EXISTS requests_active_idx ON public.requests (status) WHERE status != 'DONE';
CREATE INDEX IF NOT EXISTS requests_unarchived_idx ON public.requests (archived_at) WHERE archived_at IS NULL;
CREATE INDEX IF NOT EXISTS requests_metadata_idx ON public.requests USING GIN (metadata);

-- Form Responses Table
CREATE TABLE IF NOT EXISTS public.form_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL REFERENCES public.requests(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  form_template_id uuid NOT NULL REFERENCES public.form_templates(id) ON DELETE RESTRICT,
  template_version int NOT NULL,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  submitted boolean NOT NULL DEFAULT false,
  submitted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz,
  UNIQUE(request_id, form_template_id)
);

CREATE INDEX IF NOT EXISTS form_responses_request_idx ON public.form_responses (request_id);
CREATE INDEX IF NOT EXISTS form_responses_user_idx ON public.form_responses (user_id);
