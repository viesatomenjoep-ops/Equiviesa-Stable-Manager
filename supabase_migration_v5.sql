-- Migration v5: UI/UX Master Prompt updates

-- 1. Tasks: staff assignment and recurrence
alter table public.tasks add column if not exists staff_id uuid references public.staff_members on delete set null;
alter table public.tasks add column if not exists recurrence_rule text;

-- 2. Health Records: performed by and recurrence
alter table public.health_records add column if not exists performed_by text;
alter table public.health_records add column if not exists recurrence_rule text;

-- 3. Supplies Needed: requested by
alter table public.supplies_needed add column if not exists requested_by uuid references public.staff_members on delete set null;

-- 4. Documents: category
alter table public.documents add column if not exists category text;

-- 5. Horses: automatic numbering
alter table public.horses add column if not exists horse_number integer;
