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
INSERT INTO public.achievements (id, title, description, tier, criteria_json) VALUES
('first-read', 'Primeros Pasos', 'Completa tu primera sesión de lectura.', 'bronze', '{"type": "first_read"}'),
('speed-500-wpm', 'Halcón de Lectura', 'Alcanza una velocidad de lectura de 500 WPM.', 'silver', '{"type": "speed", "target": 500}'),
('speed-700-wpm', 'Velocidad de Escape', 'Alcanza una velocidad de lectura de 700 WPM.', 'gold', '{"type": "speed", "target": 700}'),
('streak-3-days', 'Lector Constante', 'Lee durante 3 días consecutivos.', 'bronze', '{"type": "streak", "target": 3}'),
('streak-10-days', 'Hábito de Acero', 'Lee durante 10 días consecutivos.', 'gold', '{"type": "streak", "target": 10}'),
('total-words-10k', 'Devorador de Páginas', 'Lee un total de 10,000 palabras.', 'silver', '{"type": "words", "target": 10000}'),
('total-words-50k', 'Bibliófilo', 'Lee un total de 50,000 palabras.', 'platinum', '{"type": "words", "target": 50000}'),
('time-1-hour', 'Enfoque Profundo', 'Acumula 1 hora (60 minutos) de tiempo de lectura activa.', 'silver', '{"type": "time", "target": 60}')
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
    streak_count INTEGER;
    ach_rec RECORD;
    unlocked BOOLEAN;
    progress_val JSONB;
BEGIN
    -- Compute aggregate metrics for this user
    SELECT COALESCE(SUM(words_read), 0), COALESCE(MAX(speed_wpm), 0), COALESCE(SUM(duration_seconds), 0)
    INTO total_words, max_speed, total_time
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

    -- Loop through all achievements to update user progress
    FOR ach_rec IN SELECT * FROM public.achievements LOOP
        unlocked := false;
        progress_val := '{}'::jsonb;

        IF ach_rec.id = 'first-read' THEN
            unlocked := true;
            progress_val := '{"current": 1, "target": 1}'::jsonb;
        ELSIF ach_rec.id = 'speed-500-wpm' THEN
            progress_val := jsonb_build_object('current', max_speed, 'target', 500);
            IF max_speed >= 500 THEN unlocked := true; END IF;
        ELSIF ach_rec.id = 'speed-700-wpm' THEN
            progress_val := jsonb_build_object('current', max_speed, 'target', 700);
            IF max_speed >= 700 THEN unlocked := true; END IF;
        ELSIF ach_rec.id = 'streak-3-days' THEN
            progress_val := jsonb_build_object('current', streak_count, 'target', 3);
            IF streak_count >= 3 THEN unlocked := true; END IF;
        ELSIF ach_rec.id = 'streak-10-days' THEN
            progress_val := jsonb_build_object('current', streak_count, 'target', 10);
            IF streak_count >= 10 THEN unlocked := true; END IF;
        ELSIF ach_rec.id = 'total-words-10k' THEN
            progress_val := jsonb_build_object('current', total_words, 'target', 10000);
            IF total_words >= 10000 THEN unlocked := true; END IF;
        ELSIF ach_rec.id = 'total-words-50k' THEN
            progress_val := jsonb_build_object('current', total_words, 'target', 50000);
            IF total_words >= 50000 THEN unlocked := true; END IF;
        ELSIF ach_rec.id = 'time-1-hour' THEN
            progress_val := jsonb_build_object('current', ROUND(total_time / 60), 'target', 60); -- target is 60 minutes
            IF total_time >= 3600 THEN unlocked := true; END IF;
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
