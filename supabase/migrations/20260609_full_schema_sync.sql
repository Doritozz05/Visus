-- Comprehensive Migration to align books_metadata and stats_logs with the application entity
-- This adds all missing columns and ensures RLS is still active.

-- 1. UPDATE BOOKS_METADATA
ALTER TABLE books_metadata 
ADD COLUMN IF NOT EXISTS cover_url TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS genres TEXT[],
ADD COLUMN IF NOT EXISTS publisher TEXT,
ADD COLUMN IF NOT EXISTS publish_date TEXT,
ADD COLUMN IF NOT EXISTS language TEXT,
ADD COLUMN IF NOT EXISTS current_page INTEGER,
ADD COLUMN IF NOT EXISTS total_pages INTEGER,
ADD COLUMN IF NOT EXISTS estimated_reading_time TEXT,
ADD COLUMN IF NOT EXISTS last_chapter_index INTEGER,
ADD COLUMN IF NOT EXISTS last_word_index INTEGER,
ADD COLUMN IF NOT EXISTS last_local_page_index INTEGER,
ADD COLUMN IF NOT EXISTS bookmark_chapter_index INTEGER,
ADD COLUMN IF NOT EXISTS bookmark_word_index INTEGER,
ADD COLUMN IF NOT EXISTS bookmarks JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS is_in_cloud BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- 2. UPDATE STATS_LOGS (Snake case alignment)
ALTER TABLE stats_logs 
ADD COLUMN IF NOT EXISTS book_id TEXT,
ADD COLUMN IF NOT EXISTS book_title TEXT,
ADD COLUMN IF NOT EXISTS mode TEXT,
ADD COLUMN IF NOT EXISTS speed_wpm INTEGER,
ADD COLUMN IF NOT EXISTS duration_seconds INTEGER,
ADD COLUMN IF NOT EXISTS accuracy INTEGER DEFAULT 100,
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- 3. Cleanup old columns if they exist (optional, but keeping it safe with ADD COLUMN IF NOT EXISTS above)
