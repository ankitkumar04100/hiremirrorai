-- Create mentor chat messages table
CREATE TABLE public.mentor_chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.mentor_chat_messages ENABLE ROW LEVEL SECURITY;

-- Public read/write by session_id (no auth required per spec - skip signup)
CREATE POLICY "Anyone can insert messages"
  ON public.mentor_chat_messages
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can read messages by session"
  ON public.mentor_chat_messages
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can delete messages by session"
  ON public.mentor_chat_messages
  FOR DELETE
  USING (true);
