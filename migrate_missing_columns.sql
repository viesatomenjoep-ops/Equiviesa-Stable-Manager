-- Migration: Add missing columns to live database
-- Run these SQL statements in your Supabase SQL Editor (https://supabase.com/dashboard)
-- Project: gnnmawvauudarkcrvcwt

-- 1. Add photo_url to health_records
ALTER TABLE public.health_records ADD COLUMN IF NOT EXISTS photo_url text;

-- 2. Add amazon_link to supplies_needed (in case it was created before this column was added)
ALTER TABLE public.supplies_needed ADD COLUMN IF NOT EXISTS amazon_link text;

-- Done! Both columns are now available.
