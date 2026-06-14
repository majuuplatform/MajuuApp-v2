-- RLS Helpers and Policies Migration

-- 1. Helper Functions
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'super_admin'::profile_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_agency_admin_of(p_agency_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.agency_admins
    WHERE agency_id = p_agency_id AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.owns_request(p_request_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.requests
    WHERE id = p_request_id AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_request_agency_admin(p_request_id uuid)
RETURNS boolean AS $$
DECLARE
  v_agency_id uuid;
BEGIN
  SELECT agency_id INTO v_agency_id FROM public.requests WHERE id = p_request_id;
  RETURN public.is_agency_admin_of(v_agency_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.featured_countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agency_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agency_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_reads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_views ENABLE ROW LEVEL SECURITY;

-- 3. Policies

-- profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Super admins can manage all profiles" ON public.profiles FOR ALL USING (public.is_super_admin());

-- categories
CREATE POLICY "Categories are publicly readable" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Super admins can manage categories" ON public.categories FOR ALL USING (public.is_super_admin());

-- countries
CREATE POLICY "Countries are publicly readable" ON public.countries FOR SELECT USING (true);
CREATE POLICY "Super admins can manage countries" ON public.countries FOR ALL USING (public.is_super_admin());

-- featured_countries
CREATE POLICY "Featured countries publicly readable" ON public.featured_countries FOR SELECT USING (true);
CREATE POLICY "Super admins can manage featured countries" ON public.featured_countries FOR ALL USING (public.is_super_admin());

-- services
CREATE POLICY "Services are publicly readable if published" ON public.services FOR SELECT USING (published = true OR public.is_super_admin());
CREATE POLICY "Super admins can manage services" ON public.services FOR ALL USING (public.is_super_admin());

-- agencies
CREATE POLICY "Agencies are publicly readable" ON public.agencies FOR SELECT USING (true); -- Note: UI should filter sensitive fields
CREATE POLICY "Agency admins can update their agency" ON public.agencies FOR UPDATE USING (public.is_agency_admin_of(id));
CREATE POLICY "Super admins can manage agencies" ON public.agencies FOR ALL USING (public.is_super_admin());

-- agency_admins
CREATE POLICY "Agency admins can view own agency staff" ON public.agency_admins FOR SELECT USING (public.is_agency_admin_of(agency_id));
CREATE POLICY "Super admins can manage agency admins" ON public.agency_admins FOR ALL USING (public.is_super_admin());

-- agency_services
CREATE POLICY "Agency services publicly readable" ON public.agency_services FOR SELECT USING (true);
CREATE POLICY "Agency admins can manage their services" ON public.agency_services FOR ALL USING (public.is_agency_admin_of(agency_id));
CREATE POLICY "Super admins can manage agency services" ON public.agency_services FOR ALL USING (public.is_super_admin());

-- form_templates
CREATE POLICY "Agency admins can read linked form templates" ON public.form_templates FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.agency_services
    WHERE service_id = form_templates.service_id AND public.is_agency_admin_of(agency_id)
  )
);
CREATE POLICY "Super admins can manage form templates" ON public.form_templates FOR ALL USING (public.is_super_admin());

-- form_fields
CREATE POLICY "Agency admins can read linked form fields" ON public.form_fields FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.form_templates t
    JOIN public.agency_services asv ON asv.service_id = t.service_id
    WHERE t.id = form_fields.template_id AND public.is_agency_admin_of(asv.agency_id)
  )
);
CREATE POLICY "Super admins can manage form fields" ON public.form_fields FOR ALL USING (public.is_super_admin());

-- form_responses
CREATE POLICY "Users can manage own responses" ON public.form_responses FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Agency admins can read responses for their requests" ON public.form_responses FOR SELECT USING (public.is_request_agency_admin(request_id));
CREATE POLICY "Super admins can view all responses" ON public.form_responses FOR SELECT USING (public.is_super_admin());

-- requests
CREATE POLICY "Users can view own requests" ON public.requests FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own requests" ON public.requests FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own requests" ON public.requests FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Agency admins can view assigned requests" ON public.requests FOR SELECT USING (public.is_agency_admin_of(agency_id));
CREATE POLICY "Agency admins can update assigned requests" ON public.requests FOR UPDATE USING (public.is_agency_admin_of(agency_id));
CREATE POLICY "Super admins can view all requests" ON public.requests FOR SELECT USING (public.is_super_admin());

-- chat_threads
CREATE POLICY "Users can view own threads" ON public.chat_threads FOR SELECT USING (public.owns_request(request_id));
CREATE POLICY "Agency admins can view request threads" ON public.chat_threads FOR SELECT USING (public.is_request_agency_admin(request_id));
CREATE POLICY "Super admins can view all threads" ON public.chat_threads FOR SELECT USING (public.is_super_admin());

-- chat_messages
CREATE POLICY "Users can manage own messages if unlocked" ON public.chat_messages FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.chat_threads t
    WHERE t.id = thread_id AND public.owns_request(t.request_id) AND t.is_unlocked = true
  )
);
CREATE POLICY "Agency admins can manage thread messages" ON public.chat_messages FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.chat_threads t
    WHERE t.id = thread_id AND public.is_request_agency_admin(t.request_id)
  )
);
CREATE POLICY "Super admins can view all messages" ON public.chat_messages FOR SELECT USING (public.is_super_admin());

-- message_reads
CREATE POLICY "Users can manage own read receipts" ON public.message_reads FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Super admins can view all reads" ON public.message_reads FOR SELECT USING (public.is_super_admin());

-- documents
CREATE POLICY "Users can view docs for their requests" ON public.documents FOR SELECT USING (
  public.owns_request(request_id) AND visibility IN ('PRIVATE'::document_visibility, 'PUBLIC'::document_visibility)
);
CREATE POLICY "Users can manage own documents" ON public.documents FOR ALL USING (uploader_id = auth.uid());
CREATE POLICY "Agency admins can view request documents" ON public.documents FOR SELECT USING (
  public.is_request_agency_admin(request_id) AND visibility IN ('AGENCY'::document_visibility, 'PUBLIC'::document_visibility, 'PRIVATE'::document_visibility)
);
CREATE POLICY "Super admins can manage all documents" ON public.documents FOR ALL USING (public.is_super_admin());

-- progress_updates
CREATE POLICY "Users can read visible progress updates" ON public.progress_updates FOR SELECT USING (
  public.owns_request(request_id) AND visible_to_user = true
);
CREATE POLICY "Agency admins can manage request progress updates" ON public.progress_updates FOR ALL USING (
  public.is_request_agency_admin(request_id)
);
CREATE POLICY "Super admins can manage all progress updates" ON public.progress_updates FOR ALL USING (public.is_super_admin());

-- payments
CREATE POLICY "Users can read own payments" ON public.payments FOR SELECT USING (payer_id = auth.uid());
CREATE POLICY "Agency admins can read agency payments" ON public.payments FOR SELECT USING (payee_agency_id IS NOT NULL AND public.is_agency_admin_of(payee_agency_id));
CREATE POLICY "Super admins can manage all payments" ON public.payments FOR ALL USING (public.is_super_admin());

-- resources
CREATE POLICY "Public can read active resources" ON public.resources FOR SELECT USING (active = true OR public.is_super_admin());
CREATE POLICY "Super admins can manage resources" ON public.resources FOR ALL USING (public.is_super_admin());

-- resource_history
CREATE POLICY "Users can manage own history" ON public.resource_history FOR ALL USING (user_id = auth.uid());

-- notifications
CREATE POLICY "Users can read own notifications" ON public.notifications FOR SELECT USING (recipient_user_id = auth.uid() OR public.is_agency_admin_of(recipient_agency_id));
CREATE POLICY "Super admins can view all notifications" ON public.notifications FOR SELECT USING (public.is_super_admin());

-- audit_logs
CREATE POLICY "Super admins can view audit logs" ON public.audit_logs FOR SELECT USING (public.is_super_admin());

-- analytics_events
CREATE POLICY "Super admins can view analytics events" ON public.analytics_events FOR SELECT USING (public.is_super_admin());

-- service_views
CREATE POLICY "No client read access for service views" ON public.service_views FOR SELECT USING (false);
CREATE POLICY "Client can insert service views" ON public.service_views FOR INSERT WITH CHECK (true);
