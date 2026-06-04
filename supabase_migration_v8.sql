-- Fix health_records category constraint to include 'appointments'
ALTER TABLE public.health_records DROP CONSTRAINT IF EXISTS health_records_category_check;
ALTER TABLE public.health_records ADD CONSTRAINT health_records_category_check CHECK (category IN (
    'generalCare','vaccinations','deworming','farrier',
    'dental','treatments','appointments','medication'
));
