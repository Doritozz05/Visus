-- Add file_hash column for deduplication strategy
ALTER TABLE public.books_metadata ADD COLUMN IF NOT EXISTS file_hash text;
