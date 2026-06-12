-- Migration: Advanced Telemetry and Gamification Schema Setup
-- Date: 2026-06-12

-- 1. Update stats_logs table to support detailed telemetry JSONB
ALTER TABLE public.stats_logs 
ADD COLUMN IF NOT EXISTS telemetry_data JSONB DEFAULT '{}'::jsonb;

-- 2. Create achievements master table
CREATE TABLE IF NOT EXISTS public.achievements (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    tier TEXT NOT NULL CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
    badge_url TEXT,
    criteria_json JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Create user_achievements progress junction table
CREATE TABLE IF NOT EXISTS public.user_achievements (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_id TEXT NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
    progress_json JSONB DEFAULT '{}'::jsonb,
    unlocked_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (user_id, achievement_id)
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS Policies
DROP POLICY IF EXISTS "Allow authenticated read of achievements" ON public.achievements;
CREATE POLICY "Allow authenticated read of achievements" 
ON public.achievements 
FOR SELECT 
TO authenticated 
USING (true);

DROP POLICY IF EXISTS "Users can only read their own achievements" ON public.user_achievements;
CREATE POLICY "Users can only read their own achievements" 
ON public.user_achievements 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can only modify their own achievements" ON public.user_achievements;
CREATE POLICY "Users can only modify their own achievements" 
ON public.user_achievements 
FOR ALL 
TO authenticated 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- 6. Populate default achievements
-- Clear out old ones if this is a rerun or update
DELETE FROM public.achievements;

INSERT INTO public.achievements (id, title, description, tier, criteria_json) VALUES
-- SESSIONS
('sessions-1', 'First Steps', 'Complete your first reading session.', 'bronze', '{"type": "sessions", "target": 1}'),
('sessions-10', 'Casual Reader', 'Complete 10 reading sessions.', 'bronze', '{"type": "sessions", "target": 10}'),
('sessions-50', 'Regular Reader', 'Complete 50 reading sessions.', 'silver', '{"type": "sessions", "target": 50}'),
('sessions-100', 'Dedicated Reader', 'Complete 100 reading sessions.', 'gold', '{"type": "sessions", "target": 100}'),
('sessions-500', 'Bookworm', 'Complete 500 reading sessions.', 'platinum', '{"type": "sessions", "target": 500}'),

-- STREAKS
('streak-3', 'Consistency is Key', 'Read for 3 consecutive days.', 'bronze', '{"type": "streak", "target": 3}'),
('streak-7', 'Weekly Habit', 'Read for 7 consecutive days.', 'silver', '{"type": "streak", "target": 7}'),
('streak-14', 'Fortnight Focus', 'Read for 14 consecutive days.', 'gold', '{"type": "streak", "target": 14}'),
('streak-30', 'Monthly Milestone', 'Read for 30 consecutive days.', 'platinum', '{"type": "streak", "target": 30}'),
('streak-50', 'Unbreakable', 'Read for 50 consecutive days.', 'platinum', '{"type": "streak", "target": 50}'),
('streak-100', 'Century Streak', 'Read for 100 consecutive days.', 'platinum', '{"type": "streak", "target": 100}'),

-- SPEED
('speed-300', 'Finding the Pace', 'Reach a reading speed of 300 WPM.', 'bronze', '{"type": "speed", "target": 300}'),
('speed-400', 'Accelerating', 'Reach a reading speed of 400 WPM.', 'silver', '{"type": "speed", "target": 400}'),
('speed-500', 'Speed Reader', 'Reach a reading speed of 500 WPM.', 'gold', '{"type": "speed", "target": 500}'),
('speed-600', 'Blur of Words', 'Reach a reading speed of 600 WPM.', 'platinum', '{"type": "speed", "target": 600}'),
('speed-700', 'Escape Velocity', 'Reach a reading speed of 700 WPM.', 'platinum', '{"type": "speed", "target": 700}'),
('speed-800', 'Supersonic', 'Reach a reading speed of 800 WPM.', 'platinum', '{"type": "speed", "target": 800}'),
('speed-1000', 'Speed of Light', 'Reach a reading speed of 1000 WPM.', 'platinum', '{"type": "speed", "target": 1000}'),

-- WORDS
('words-5k', 'Word Gatherer', 'Read a total of 5,000 words.', 'bronze', '{"type": "words", "target": 5000}'),
('words-10k', 'Page Turner', 'Read a total of 10,000 words.', 'silver', '{"type": "words", "target": 10000}'),
('words-50k', 'Chapter Eater', 'Read a total of 50,000 words.', 'gold', '{"type": "words", "target": 50000}'),
('words-100k', 'Novel Finisher', 'Read a total of 100,000 words.', 'platinum', '{"type": "words", "target": 100000}'),
('words-250k', 'Epic Journey', 'Read a total of 250,000 words.', 'platinum', '{"type": "words", "target": 250000}'),
('words-500k', 'Library Consumer', 'Read a total of 500,000 words.', 'platinum', '{"type": "words", "target": 500000}'),
('words-1m', 'Millionaire of Words', 'Read a total of 1,000,000 words.', 'platinum', '{"type": "words", "target": 1000000}'),

-- TIME (targets in minutes)
('time-1h', 'Getting Lost', 'Accumulate 1 hour of active reading time.', 'bronze', '{"type": "time", "target": 60}'),
('time-5h', 'Deep Immersion', 'Accumulate 5 hours of active reading time.', 'silver', '{"type": "time", "target": 300}'),
('time-10h', 'Time Traveler', 'Accumulate 10 hours of active reading time.', 'gold', '{"type": "time", "target": 600}'),
('time-24h', 'A Day in Books', 'Accumulate 24 hours of active reading time.', 'platinum', '{"type": "time", "target": 1440}'),
('time-50h', 'Reading Veteran', 'Accumulate 50 hours of active reading time.', 'platinum', '{"type": "time", "target": 3000}'),
('time-100h', 'Time Master', 'Accumulate 100 hours of active reading time.', 'platinum', '{"type": "time", "target": 6000}')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    tier = EXCLUDED.tier,
    criteria_json = EXCLUDED.criteria_json;

-- 7. Trigger function to evaluate achievements automatically when stats are inserted
CREATE OR REPLACE FUNCTION evaluate_achievements_trigger()
RETURNS TRIGGER AS $$
DECLARE
    total_words INTEGER;
    max_speed INTEGER;
    total_time INTEGER;
    total_sessions INTEGER;
    streak_count INTEGER;
    ach_rec RECORD;
    unlocked BOOLEAN;
    progress_val JSONB;
    criteria_type TEXT;
    target_val INTEGER;
BEGIN
    -- Compute aggregate metrics for this user
    SELECT COALESCE(SUM(words_read), 0), COALESCE(MAX(speed_wpm), 0), COALESCE(SUM(duration_seconds), 0), COUNT(*)
    INTO total_words, max_speed, total_time, total_sessions
    FROM public.stats_logs
    WHERE user_id = NEW.user_id;

    -- Compute current streak (consecutive days of reading including today)
    -- Using a window function partition to group consecutive dates
    WITH dates AS (
        SELECT DISTINCT (completed_at AT TIME ZONE 'UTC')::date AS read_date
        FROM public.stats_logs
        WHERE user_id = NEW.user_id
    ),
    groups AS (
        SELECT read_date,
               read_date - (ROW_NUMBER() OVER (ORDER BY read_date))::integer AS grp
        FROM dates
    )
    SELECT COUNT(*) INTO streak_count
    FROM groups
    GROUP BY grp
    ORDER BY MIN(read_date) DESC
    LIMIT 1;

    IF streak_count IS NULL THEN
        streak_count := 0;
    END IF;

    -- Loop through all achievements to update user progress dynamically
    FOR ach_rec IN SELECT * FROM public.achievements LOOP
        unlocked := false;
        progress_val := '{}'::jsonb;
        
        criteria_type := ach_rec.criteria_json->>'type';
        target_val := (ach_rec.criteria_json->>'target')::integer;

        IF criteria_type = 'sessions' THEN
            progress_val := jsonb_build_object('current', total_sessions, 'target', target_val);
            IF total_sessions >= target_val THEN unlocked := true; END IF;
        ELSIF criteria_type = 'speed' THEN
            progress_val := jsonb_build_object('current', max_speed, 'target', target_val);
            IF max_speed >= target_val THEN unlocked := true; END IF;
        ELSIF criteria_type = 'streak' THEN
            progress_val := jsonb_build_object('current', streak_count, 'target', target_val);
            IF streak_count >= target_val THEN unlocked := true; END IF;
        ELSIF criteria_type = 'words' THEN
            progress_val := jsonb_build_object('current', total_words, 'target', target_val);
            IF total_words >= target_val THEN unlocked := true; END IF;
        ELSIF criteria_type = 'time' THEN
            progress_val := jsonb_build_object('current', ROUND(total_time / 60), 'target', target_val);
            IF (total_time / 60) >= target_val THEN unlocked := true; END IF;
        END IF;

        -- Upsert to public.user_achievements
        INSERT INTO public.user_achievements (user_id, achievement_id, progress_json, unlocked_at, updated_at)
        VALUES (
            NEW.user_id,
            ach_rec.id,
            progress_val,
            CASE WHEN unlocked THEN COALESCE((SELECT unlocked_at FROM public.user_achievements WHERE user_id = NEW.user_id AND achievement_id = ach_rec.id), timezone('utc'::text, now())) ELSE NULL END,
            timezone('utc'::text, now())
        )
        ON CONFLICT (user_id, achievement_id) 
        DO UPDATE SET
            progress_json = EXCLUDED.progress_json,
            unlocked_at = CASE WHEN unlocked THEN COALESCE(user_achievements.unlocked_at, EXCLUDED.unlocked_at) ELSE NULL END,
            updated_at = EXCLUDED.updated_at;
    END LOOP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Bind trigger to stats_logs
DROP TRIGGER IF EXISTS evaluate_achievements_after_stat ON public.stats_logs;
CREATE TRIGGER evaluate_achievements_after_stat
AFTER INSERT ON public.stats_logs
FOR EACH ROW
EXECUTE FUNCTION evaluate_achievements_trigger();
