-- Adds daily auto-refill tracking for demo accounts.
-- Run in Supabase SQL editor or migration runner.

ALTER TABLE user_plans 
ADD COLUMN IF NOT EXISTS last_refill_date DATE;

