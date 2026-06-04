-- Migration v6: Fix profiles table constraints for user creation

-- 1. Zoek en verwijder de foreign key koppeling naar auth.users (zodat we users kunnen toevoegen zonder supabase auth account)
DO $$ 
DECLARE
  fk_name text;
BEGIN
  SELECT constraint_name INTO fk_name
  FROM information_schema.key_column_usage
  WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'id' 
    AND position_in_unique_constraint IS NOT NULL;
  
  IF fk_name IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.profiles DROP CONSTRAINT ' || fk_name;
  END IF;
END $$;

-- 2. Zorg dat er automatisch een ID wordt gegenereerd bij het aanmaken van een User
ALTER TABLE public.profiles ALTER COLUMN id SET DEFAULT gen_random_uuid();
