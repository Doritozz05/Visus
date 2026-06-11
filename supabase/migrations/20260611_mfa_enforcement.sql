-- MFA Enforcement for RLS
-- This migration ensures that users with MFA enabled MUST use aal2 to access their data.

CREATE OR REPLACE FUNCTION public.check_mfa_satisfied(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the user has any verified MFA factors
  -- If they do, require aal2. If they don't, aal1 is sufficient.
  RETURN (
    NOT EXISTS (
      SELECT 1 FROM auth.mfa_factors 
      WHERE auth.mfa_factors.user_id = $1 
      AND auth.mfa_factors.status = 'verified'
    )
    OR (auth.jwt() ->> 'aal') = 'aal2'
  );
END;
$$;

-- Update BOOKS_METADATA policies
DROP POLICY IF EXISTS "Users can only select their own books" ON books_metadata;
CREATE POLICY "Users can only select their own books" 
ON books_metadata 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id AND public.check_mfa_satisfied(auth.uid()));

DROP POLICY IF EXISTS "Users can only modify their own books" ON books_metadata;
CREATE POLICY "Users can only modify their own books" 
ON books_metadata 
FOR ALL 
TO authenticated 
USING (auth.uid() = user_id AND public.check_mfa_satisfied(auth.uid()))
WITH CHECK (auth.uid() = user_id AND public.check_mfa_satisfied(auth.uid()));

-- Update STATS_LOGS policies
DROP POLICY IF EXISTS "Users can only select their own stats" ON stats_logs;
CREATE POLICY "Users can only select their own stats" 
ON stats_logs 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id AND public.check_mfa_satisfied(auth.uid()));

DROP POLICY IF EXISTS "Users can only modify their own stats" ON stats_logs;
CREATE POLICY "Users can only modify their own stats" 
ON stats_logs 
FOR ALL 
TO authenticated 
USING (auth.uid() = user_id AND public.check_mfa_satisfied(auth.uid()))
WITH CHECK (auth.uid() = user_id AND public.check_mfa_satisfied(auth.uid()));

-- Update DELETED_RECORDS policies
DROP POLICY IF EXISTS "Users can only see their own deleted records" ON deleted_records;
CREATE POLICY "Users can only see their own deleted records"
ON deleted_records FOR SELECT TO authenticated
USING (auth.uid() = user_id AND public.check_mfa_satisfied(auth.uid()));

DROP POLICY IF EXISTS "Users can only insert their own deleted records" ON deleted_records;
CREATE POLICY "Users can only insert their own deleted records"
ON deleted_records FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id AND public.check_mfa_satisfied(auth.uid()));

-- Update STORAGE policies
-- Note: We use auth.uid() in the check_mfa_satisfied call
DROP POLICY IF EXISTS "Users can only access their own storage folder" ON storage.objects;
CREATE POLICY "Users can only access their own storage folder"
ON storage.objects FOR ALL TO authenticated
USING (
  bucket_id = 'books_binary' 
  AND (storage.foldername(name))[1] = auth.uid()::text
  AND public.check_mfa_satisfied(auth.uid())
)
WITH CHECK (
  bucket_id = 'books_binary' 
  AND (storage.foldername(name))[1] = auth.uid()::text
  AND public.check_mfa_satisfied(auth.uid())
);
