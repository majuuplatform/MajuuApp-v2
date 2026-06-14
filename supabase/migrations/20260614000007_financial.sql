-- Financial Layer Migration

-- Payments Table
CREATE TABLE IF NOT EXISTS public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid REFERENCES public.requests(id) ON DELETE SET NULL,
  payer_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  payee_agency_id uuid REFERENCES public.agencies(id) ON DELETE RESTRICT,
  type payment_type NOT NULL,
  amount numeric(12,2) NOT NULL,
  currency char(3) NOT NULL DEFAULT 'KES',
  provider text NOT NULL,
  provider_payment_id text,
  status payment_status NOT NULL,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz
);

-- Partial unique index for provider_payment_id
CREATE UNIQUE INDEX IF NOT EXISTS payments_provider_payment_id_idx ON public.payments (provider_payment_id) WHERE provider_payment_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS payments_request_idx ON public.payments (request_id);
CREATE INDEX IF NOT EXISTS payments_payer_idx ON public.payments (payer_id);
CREATE INDEX IF NOT EXISTS payments_payee_idx ON public.payments (payee_agency_id);
CREATE INDEX IF NOT EXISTS payments_status_idx ON public.payments (status);
CREATE INDEX IF NOT EXISTS payments_type_idx ON public.payments (type);
CREATE INDEX IF NOT EXISTS payments_pending_idx ON public.payments (status) WHERE status = 'PENDING'::payment_status;
