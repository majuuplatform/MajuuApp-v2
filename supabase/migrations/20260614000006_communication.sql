-- Communication Layer Migration

-- Chat Threads Table
CREATE TABLE IF NOT EXISTS public.chat_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL UNIQUE REFERENCES public.requests(id) ON DELETE CASCADE,
  is_unlocked boolean NOT NULL DEFAULT false,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  started_at timestamptz,
  last_message_at timestamptz,
  metadata jsonb
);

CREATE INDEX IF NOT EXISTS chat_threads_last_message_idx ON public.chat_threads (last_message_at DESC);

-- Chat Messages Table
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES public.chat_threads(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content text,
  attachments jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  edited_at timestamptz,
  deleted boolean NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS chat_messages_thread_idx ON public.chat_messages (thread_id);
CREATE INDEX IF NOT EXISTS chat_messages_created_idx ON public.chat_messages (created_at DESC);
CREATE INDEX IF NOT EXISTS chat_messages_thread_created_idx ON public.chat_messages (thread_id, created_at DESC);
CREATE INDEX IF NOT EXISTS chat_messages_undeleted_idx ON public.chat_messages (deleted) WHERE deleted = false;

-- Message Reads Table
CREATE TABLE IF NOT EXISTS public.message_reads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL REFERENCES public.chat_messages(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  read_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(message_id, user_id)
);

CREATE INDEX IF NOT EXISTS message_reads_user_message_idx ON public.message_reads (user_id, message_id);
CREATE INDEX IF NOT EXISTS message_reads_message_idx ON public.message_reads (message_id);

-- Documents Table
CREATE TABLE IF NOT EXISTS public.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid REFERENCES public.requests(id) ON DELETE CASCADE,
  uploader_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  origin document_origin NOT NULL,
  attached_message_id uuid REFERENCES public.chat_messages(id) ON DELETE SET NULL,
  storage_path text NOT NULL,
  filename text NOT NULL,
  mime_type text,
  size_bytes bigint,
  visibility document_visibility NOT NULL DEFAULT 'PRIVATE'::document_visibility,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS documents_request_idx ON public.documents (request_id);
CREATE INDEX IF NOT EXISTS documents_uploader_idx ON public.documents (uploader_id);
CREATE INDEX IF NOT EXISTS documents_origin_idx ON public.documents (origin);
CREATE INDEX IF NOT EXISTS documents_metadata_idx ON public.documents USING GIN (metadata);

-- Progress Updates Table
CREATE TABLE IF NOT EXISTS public.progress_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL REFERENCES public.requests(id) ON DELETE CASCADE,
  actor_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  actor_role text NOT NULL,
  status_snapshot text,
  note text,
  data jsonb,
  visible_to_user boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS progress_updates_request_idx ON public.progress_updates (request_id);
CREATE INDEX IF NOT EXISTS progress_updates_actor_idx ON public.progress_updates (actor_id);
CREATE INDEX IF NOT EXISTS progress_updates_created_idx ON public.progress_updates (created_at);
CREATE INDEX IF NOT EXISTS progress_updates_visible_idx ON public.progress_updates (visible_to_user) WHERE visible_to_user = true;
