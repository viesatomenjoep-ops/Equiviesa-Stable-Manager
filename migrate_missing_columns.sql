-- ============================================================
-- EQUIVESA — Migration SQL
-- Voegt ALLE ontbrekende kolommen toe aan bestaande tabellen
-- Veilig te her-uitvoeren (ADD COLUMN IF NOT EXISTS)
-- Voer dit uit NAAST (of NA) de master SQL v3
-- ============================================================

-- ============================================================
-- horses
-- ============================================================
alter table public.horses add column if not exists notes text;
alter table public.horses add column if not exists photo_url text;
alter table public.horses add column if not exists gender text default 'mare';
alter table public.horses add column if not exists sire_name text;
alter table public.horses add column if not exists dam_name text;
alter table public.horses add column if not exists location_id bigint;
alter table public.horses add column if not exists archived boolean default false;

-- ============================================================
-- tasks
-- ============================================================
alter table public.tasks add column if not exists start_time time;
alter table public.tasks add column if not exists end_time time;
alter table public.tasks add column if not exists photo_url text;
alter table public.tasks add column if not exists horse_id bigint references public.horses on delete set null;
alter table public.tasks add column if not exists assigned_to uuid;
-- Rename is_complete → is_completed if needed (safe: add new, keep old)
alter table public.tasks add column if not exists is_completed boolean default false;

-- ============================================================
-- health_records
-- ============================================================
alter table public.health_records add column if not exists photo_url text;
alter table public.health_records add column if not exists completed boolean default false;
alter table public.health_records add column if not exists performed_by text;
alter table public.health_records add column if not exists cost numeric(10,2);
-- Fix category constraint: drop old, add new
alter table public.health_records drop constraint if exists health_records_category_check;
alter table public.health_records add constraint health_records_category_check
    check (category in ('generalCare','vaccinations','deworming','farrier','dental','treatments','appointments','medication'));

-- ============================================================
-- feed_schedules
-- ============================================================
alter table public.feed_schedules add column if not exists qty text;

-- ============================================================
-- documents
-- ============================================================
alter table public.documents add column if not exists document_type text;
alter table public.documents add column if not exists horse_id bigint references public.horses on delete set null;
alter table public.documents add column if not exists notes text;

-- ============================================================
-- supplies_needed  ← FIXES de huidige foutmelding
-- ============================================================
alter table public.supplies_needed add column if not exists photo_url text;
alter table public.supplies_needed add column if not exists amazon_link text;
alter table public.supplies_needed add column if not exists notes text;
alter table public.supplies_needed add column if not exists qty text;
-- Fix category constraint if it doesn't match
alter table public.supplies_needed drop constraint if exists supplies_needed_category_check;
alter table public.supplies_needed add constraint supplies_needed_category_check
    check (category in ('feed','medical','equipment','bedding','cleaning','clothing','other'));
-- Fix status constraint
alter table public.supplies_needed drop constraint if exists supplies_needed_status_check;
alter table public.supplies_needed add constraint supplies_needed_status_check
    check (status in ('needed','ordered','received'));

-- ============================================================
-- contacts
-- ============================================================
alter table public.contacts add column if not exists photo_url text;
alter table public.contacts add column if not exists notes text;
-- Fix role constraint
alter table public.contacts drop constraint if exists contacts_role_check;
alter table public.contacts add constraint contacts_role_check
    check (role in ('owner','client','vet','farrier','rider','supplier','other'));

-- ============================================================
-- mares_breeding
-- ============================================================
alter table public.mares_breeding add column if not exists photo_url text;
alter table public.mares_breeding add column if not exists notes text;
alter table public.mares_breeding add column if not exists horse_id bigint references public.horses on delete cascade;

-- ============================================================
-- embryos
-- ============================================================
alter table public.embryos add column if not exists photo_url text;
alter table public.embryos add column if not exists notes text;
alter table public.embryos add column if not exists horse_id bigint references public.horses on delete cascade;

-- ============================================================
-- locations
-- ============================================================
alter table public.locations add column if not exists photo_url text;
alter table public.locations add column if not exists lat numeric;
alter table public.locations add column if not exists lng numeric;

-- ============================================================
-- bookings — volledige structuur
-- ============================================================
alter table public.bookings add column if not exists title text;
alter table public.bookings add column if not exists booking_type text default 'other';
alter table public.bookings add column if not exists booking_date date;
alter table public.bookings add column if not exists start_time time;
alter table public.bookings add column if not exists end_time time;
alter table public.bookings add column if not exists location text;
alter table public.bookings add column if not exists photo_url text;
alter table public.bookings add column if not exists client_id bigint;
alter table public.bookings add column if not exists horse_id bigint references public.horses on delete set null;
-- Fix status constraint
alter table public.bookings drop constraint if exists bookings_status_check;
alter table public.bookings add constraint bookings_status_check
    check (status in ('pending','confirmed','cancelled','completed'));

-- ============================================================
-- invoices — volledige structuur
-- ============================================================
alter table public.invoices add column if not exists client_name text;
alter table public.invoices add column if not exists invoice_date date;
alter table public.invoices add column if not exists subtotal numeric(10,2) default 0;
alter table public.invoices add column if not exists tax_rate numeric(5,2) default 21;
alter table public.invoices add column if not exists tax_amount numeric(10,2) default 0;
alter table public.invoices add column if not exists total numeric(10,2) default 0;
alter table public.invoices add column if not exists client_id bigint;
-- Fix status constraint
alter table public.invoices drop constraint if exists invoices_status_check;
alter table public.invoices add constraint invoices_status_check
    check (status in ('draft','sent','paid','overdue','partial'));

-- ============================================================
-- transactions
-- ============================================================
alter table public.transactions add column if not exists receipt_url text;
alter table public.transactions add column if not exists category text;
alter table public.transactions add column if not exists horse_id bigint references public.horses on delete set null;

-- ============================================================
-- catalog
-- ============================================================
alter table public.catalog add column if not exists name text;
alter table public.catalog add column if not exists unit text;
alter table public.catalog add column if not exists category text;
alter table public.catalog add column if not exists photo_url text;

-- ============================================================
-- stalls
-- ============================================================
alter table public.stalls add column if not exists status text default 'available';
alter table public.stalls drop constraint if exists stalls_status_check;
alter table public.stalls add constraint stalls_status_check
    check (status in ('available','occupied','maintenance'));

-- ============================================================
-- staff_members
-- ============================================================
alter table public.staff_members add column if not exists phone text;
alter table public.staff_members add column if not exists pin text;
alter table public.staff_members add column if not exists available boolean default true;

-- ============================================================
-- calendar_events
-- ============================================================
alter table public.calendar_events add column if not exists all_day boolean default false;
alter table public.calendar_events add column if not exists color text;
alter table public.calendar_events add column if not exists horse_id bigint references public.horses on delete set null;

-- ============================================================
-- RLS: zorg dat alle tabellen open zijn voor anon
-- (voor het geval de master SQL nog niet gedraaid is)
-- ============================================================
do $$ declare
  tbl text;
  tbls text[] := array[
    'profiles','horses','feed_schedules','transactions','tasks',
    'health_records','documents','mares_breeding','embryos','locations',
    'contacts','supplies_needed','clients','bookings','invoices',
    'company_settings','catalog','stalls','staff_members','calendar_events'
  ];
begin
  foreach tbl in array tbls loop
    execute format('alter table public.%I enable row level security', tbl);
    execute format('drop policy if exists "Allow authenticated CRUD" on public.%I', tbl);
    execute format(
      'create policy "Allow authenticated CRUD" on public.%I for all using (auth.role() in (''authenticated'', ''anon''))',
      tbl
    );
  end loop;
end $$;

-- ============================================================
-- KLAAR ✓ — Migration SQL — 2026-06-04
-- Alle ontbrekende kolommen toegevoegd
-- Alle constraints bijgewerkt
-- Alle RLS policies open voor anon
-- ============================================================
