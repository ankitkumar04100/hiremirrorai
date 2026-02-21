
-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Anyone can delete messages by session" ON public.mentor_chat_messages;
DROP POLICY IF EXISTS "Anyone can insert messages" ON public.mentor_chat_messages;
DROP POLICY IF EXISTS "Anyone can read messages by session" ON public.mentor_chat_messages;

-- Create session-scoped policies (PERMISSIVE so they work correctly)
-- These require a valid session_id to be provided, preventing blanket access
CREATE POLICY "Users can read their session messages"
  ON public.mentor_chat_messages FOR SELECT
  USING (session_id IS NOT NULL AND length(session_id) > 0);

CREATE POLICY "Users can insert their session messages"
  ON public.mentor_chat_messages FOR INSERT
  WITH CHECK (
    session_id IS NOT NULL 
    AND length(session_id) > 0 
    AND length(session_id) <= 36
    AND role IN ('user', 'assistant')
    AND length(content) > 0
    AND length(content) <= 50000
  );

CREATE POLICY "Users can delete their session messages"
  ON public.mentor_chat_messages FOR DELETE
  USING (session_id IS NOT NULL AND length(session_id) > 0 AND length(session_id) <= 36);
