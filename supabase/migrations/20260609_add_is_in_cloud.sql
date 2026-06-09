-- Add is_in_cloud column to books_metadata table
-- This column tracks if the book's binary file is stored in Supabase Storage

ALTER TABLE books_metadata 
ADD COLUMN IF NOT EXISTS is_in_cloud BOOLEAN DEFAULT false;

-- Also ensure updated_at exists for sync
ALTER TABLE books_metadata 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());
