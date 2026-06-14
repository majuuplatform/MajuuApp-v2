-- Self Help & System Layer Migration

-- Resources Table
CREATE TABLE IF NOT EXISTS public.resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  url text NOT NULL,
  thumbnail_url text,
  description text,
  country_id char(2) NOT NULL REFERENCES public.countries(iso_code) ON DELETE CASCADE,
  category_id text NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  resource_type resource_type NOT NULL,
  tags text[],
  active boolean NOT NULL DEFAULT true,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz
);

CREATE INDEX IF NOT EXISTS resources_country_category_idx ON public.resources (country_id, category_id);
CREATE INDEX IF NOT EXISTS resources_type_idx ON public.resources (resource_type);
CREATE INDEX IF NOT EXISTS resources_tags_idx ON public.resources USING GIN (tags);
CREATE INDEX IF NOT EXISTS resources_active_idx ON public.resources (active) WHERE active = true;

-- Resource History Table
CREATE TABLE IF NOT EXISTS public.resource_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  resource_id uuid NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
  opened_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS resource_history_user_opened_idx ON public.resource_history (user_id, opened_at DESC);
CREATE INDEX IF NOT EXISTS resource_history_resource_idx ON public.resource_history (resource_id);

-- Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipient_agency_id uuid REFERENCES public.agencies(id) ON DELETE CASCADE,
  agency_id uuid REFERENCES public.agencies(id) ON DELETE CASCADE,
  type text NOT NULL,
  actor_id uuid,
  payload jsonb NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz
);

CREATE INDEX IF NOT EXISTS notifications_user_idx ON public.notifications (recipient_user_id);
CREATE INDEX IF NOT EXISTS notifications_recipient_agency_idx ON public.notifications (recipient_agency_id);
CREATE INDEX IF NOT EXISTS notifications_agency_idx ON public.notifications (agency_id);
CREATE INDEX IF NOT EXISTS notifications_unread_idx ON public.notifications (is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS notifications_created_idx ON public.notifications (created_at DESC);

-- Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid,
  actor_role text,
  action text NOT NULL,
  target_table text,
  target_id text,
  details jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS audit_logs_actor_idx ON public.audit_logs (actor_id);
CREATE INDEX IF NOT EXISTS audit_logs_action_idx ON public.audit_logs (action);
CREATE INDEX IF NOT EXISTS audit_logs_created_idx ON public.audit_logs (created_at);
CREATE INDEX IF NOT EXISTS audit_logs_details_idx ON public.audit_logs USING GIN (details);

-- Analytics Events Table
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  actor_id uuid,
  request_id uuid,
  agency_id uuid,
  country_iso char(2),
  service_id uuid,
  properties jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS analytics_events_type_idx ON public.analytics_events (event_type);
CREATE INDEX IF NOT EXISTS analytics_events_agency_idx ON public.analytics_events (agency_id);
CREATE INDEX IF NOT EXISTS analytics_events_created_idx ON public.analytics_events (created_at);
CREATE INDEX IF NOT EXISTS analytics_events_props_idx ON public.analytics_events USING GIN (properties);

-- Service Views Table
CREATE TABLE IF NOT EXISTS public.service_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  service_id uuid NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  agency_id uuid,
  session_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS service_views_service_idx ON public.service_views (service_id);
CREATE INDEX IF NOT EXISTS service_views_agency_idx ON public.service_views (agency_id);
CREATE INDEX IF NOT EXISTS service_views_created_idx ON public.service_views (created_at);
