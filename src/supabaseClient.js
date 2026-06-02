import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gnnmawvauudarkcrvcwt.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdubm1hd3ZhdXVkYXJrY3J2Y3d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0MzExOTEsImV4cCI6MjA5NjAwNzE5MX0.KLgJvUNC4cXkwRaXCMCnCYF-E1J97i3O2sQA1zDzcfo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
