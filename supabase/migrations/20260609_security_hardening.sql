-- 1. ENABLE RLS
ALTER TABLE books_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats_logs ENABLE ROW LEVEL SECURITY;

-- 2. BOOKS_METADATA POLICIES (English Names)
CREATE POLICY "Users can only select their own books" 
ON books_metadata 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users can only modify their own books" 
ON books_metadata 
FOR ALL 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 3. STATS_LOGS POLICIES
CREATE POLICY "Users can only select their own stats" 
ON stats_logs 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users can only modify their own stats" 
ON stats_logs 
FOR ALL 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 4. DELETED_RECORDS TABLE (For Sync)
CREATE TABLE IF NOT EXISTS deleted_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    record_id TEXT NOT NULL,
    table_name TEXT NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE deleted_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only see their own deleted records"
ON deleted_records FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own deleted records"
ON deleted_records FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 6. STORAGE CONFIGURATION (Private Bucket)
-- Ensure the bucket exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('books_binary', 'books_binary', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Users can only upload/download their own folder (userId/)
CREATE POLICY "Users can only access their own storage folder"
ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'books_binary' AND (storage.foldername(name))[1] = auth.uid()::text)
WITH CHECK (bucket_id = 'books_binary' AND (storage.foldername(name))[1] = auth.uid()::text);

-- 7. PERFORMANCE INDICES
CREATE INDEX IF NOT EXISTS idx_books_metadata_user_id ON books_metadata(user_id);
CREATE INDEX IF NOT EXISTS idx_stats_logs_user_id ON stats_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_deleted_records_user_id ON deleted_records(user_id);
