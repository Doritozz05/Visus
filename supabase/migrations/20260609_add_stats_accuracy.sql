-- Add missing accuracy column to stats_logs table
ALTER TABLE stats_logs 
ADD COLUMN IF NOT EXISTS accuracy INTEGER DEFAULT 100;

-- Ensure accuracy is between 0 and 100
ALTER TABLE stats_logs
ADD CONSTRAINT check_accuracy_range CHECK (accuracy >= 0 AND accuracy <= 100);
