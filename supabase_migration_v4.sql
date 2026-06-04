-- =====================================================================
-- EQUIVESA — Migration v4.1 (Safe ALTER TABLE — uuid-fixed)
-- Voer dit éénmalig uit in Supabase SQL Editor
-- Alle ALTER TABLE's zijn IF NOT EXISTS → veilig te herhalen
-- =====================================================================

-- ── 1. CONTACTS ───────────────────────────────────────────────────────
alter table public.contacts add column if not exists company   text;
alter table public.contacts add column if not exists website   text;
alter table public.contacts add column if not exists photo_url text;

-- ── 2. LOCATIONS ──────────────────────────────────────────────────────
alter table public.locations add column if not exists location_type text default 'stable';
alter table public.locations add column if not exists type         text;
alter table public.locations add column if not exists photo_url    text;
alter table public.locations add column if not exists lat          numeric;
alter table public.locations add column if not exists lng          numeric;

-- ── 3. DOCUMENTS ──────────────────────────────────────────────────────
alter table public.documents add column if not exists notes         text;
alter table public.documents add column if not exists document_type text;
alter table public.documents add column if not exists file_type     text;
-- horse_id as uuid (horses.id is uuid)
alter table public.documents add column if not exists horse_id uuid references public.horses(id) on delete set null;

-- ── 4. CATALOG ────────────────────────────────────────────────────────
alter table public.catalog add column if not exists name        text;
alter table public.catalog add column if not exists description text;
alter table public.catalog add column if not exists price       numeric(10,2) default 0;
alter table public.catalog add column if not exists stock       integer default 0;
alter table public.catalog add column if not exists unit        text;
alter table public.catalog add column if not exists category    text;
alter table public.catalog add column if not exists photo_url   text;

-- ── 5. SUPPLIES_NEEDED ────────────────────────────────────────────────
alter table public.supplies_needed add column if not exists photo_url    text;
alter table public.supplies_needed add column if not exists item_name    text;
alter table public.supplies_needed add column if not exists quantity     text;
alter table public.supplies_needed add column if not exists requested_by text;
alter table public.supplies_needed add column if not exists report_type  text default 'supply';

-- ── 6. BOOKINGS ───────────────────────────────────────────────────────
alter table public.bookings add column if not exists photo_url text;
-- horse_id as uuid
alter table public.bookings add column if not exists horse_id uuid references public.horses(id) on delete set null;

-- ── 7. INVOICES ───────────────────────────────────────────────────────
alter table public.invoices add column if not exists client_name  text;
alter table public.invoices add column if not exists invoice_date date;
alter table public.invoices add column if not exists subtotal     numeric(10,2) default 0;
alter table public.invoices add column if not exists tax_rate     numeric(5,2)  default 21;
alter table public.invoices add column if not exists tax_amount   numeric(10,2) default 0;
alter table public.invoices add column if not exists total        numeric(10,2) default 0;

-- ── 8. TASKS ──────────────────────────────────────────────────────────
alter table public.tasks add column if not exists photo_url text;
alter table public.tasks add column if not exists end_time  time;

-- ── 9. HEALTH_RECORDS ─────────────────────────────────────────────────
alter table public.health_records add column if not exists photo_url    text;
alter table public.health_records add column if not exists performed_by text;
alter table public.health_records add column if not exists cost         numeric(10,2);

-- ── 10. TRANSACTIONS ──────────────────────────────────────────────────
alter table public.transactions add column if not exists category    text;
alter table public.transactions add column if not exists reference   text;
alter table public.transactions add column if not exists receipt_url text;
alter table public.transactions add column if not exists description text;
-- horse_id as uuid
alter table public.transactions add column if not exists horse_id uuid references public.horses(id) on delete set null;

-- ── 11. MARES_BREEDING ────────────────────────────────────────────────
alter table public.mares_breeding add column if not exists horse_id           uuid references public.horses(id) on delete cascade;
alter table public.mares_breeding add column if not exists expected_foal_date date;
alter table public.mares_breeding add column if not exists notes              text;
alter table public.mares_breeding add column if not exists photo_url          text;

-- ── 12. EMBRYOS ───────────────────────────────────────────────────────
alter table public.embryos add column if not exists horse_id  uuid references public.horses(id) on delete cascade;
alter table public.embryos add column if not exists notes     text;
alter table public.embryos add column if not exists photo_url text;

-- ── 13. STAFF_MEMBERS ─────────────────────────────────────────────────
alter table public.staff_members add column if not exists pin       text;
alter table public.staff_members add column if not exists photo_url text;

-- ── 14. CALENDAR_EVENTS ───────────────────────────────────────────────
alter table public.calendar_events add column if not exists all_day     boolean default false;
alter table public.calendar_events add column if not exists color       text;
alter table public.calendar_events add column if not exists horse_id    uuid references public.horses(id) on delete set null;
alter table public.calendar_events add column if not exists description text;

-- ── 15. CLIENTS (aparte tabel) ────────────────────────────────────────
create table if not exists public.clients (
    id         bigserial primary key,
    created_at timestamptz default now() not null,
    name       text not null,
    email      text,
    phone      text,
    address    text,
    notes      text,
    photo_url  text
);
alter table public.clients enable row level security;
drop policy if exists "Allow anon CRUD" on public.clients;
create policy "Allow anon CRUD" on public.clients
  for all using (auth.role() in ('authenticated','anon'));

-- ── 16. RLS op alle tabellen (drop old + create new) ─────────────────

-- Drop old policy names (authenticated-only, from v1/v2/v3)
do $$ declare
  t text;
begin
  foreach t in array array[
    'contacts','locations','documents','catalog','supplies_needed',
    'bookings','invoices','tasks','health_records','transactions',
    'mares_breeding','embryos','staff_members','calendar_events',
    'horses','clients','feed_schedules'
  ] loop
    execute format('drop policy if exists "Allow authenticated CRUD" on public.%I', t);
    execute format('drop policy if exists "Allow anon CRUD" on public.%I', t);
  end loop;
end $$;

-- Create fresh anon CRUD policies
create policy "Allow anon CRUD" on public.contacts
  for all using (auth.role() in ('authenticated','anon'));
create policy "Allow anon CRUD" on public.locations
  for all using (auth.role() in ('authenticated','anon'));
create policy "Allow anon CRUD" on public.documents
  for all using (auth.role() in ('authenticated','anon'));
create policy "Allow anon CRUD" on public.catalog
  for all using (auth.role() in ('authenticated','anon'));
create policy "Allow anon CRUD" on public.supplies_needed
  for all using (auth.role() in ('authenticated','anon'));
create policy "Allow anon CRUD" on public.bookings
  for all using (auth.role() in ('authenticated','anon'));
create policy "Allow anon CRUD" on public.invoices
  for all using (auth.role() in ('authenticated','anon'));
create policy "Allow anon CRUD" on public.tasks
  for all using (auth.role() in ('authenticated','anon'));
create policy "Allow anon CRUD" on public.health_records
  for all using (auth.role() in ('authenticated','anon'));
create policy "Allow anon CRUD" on public.transactions
  for all using (auth.role() in ('authenticated','anon'));
create policy "Allow anon CRUD" on public.mares_breeding
  for all using (auth.role() in ('authenticated','anon'));
create policy "Allow anon CRUD" on public.embryos
  for all using (auth.role() in ('authenticated','anon'));
create policy "Allow anon CRUD" on public.staff_members
  for all using (auth.role() in ('authenticated','anon'));
create policy "Allow anon CRUD" on public.calendar_events
  for all using (auth.role() in ('authenticated','anon'));
create policy "Allow anon CRUD" on public.horses
  for all using (auth.role() in ('authenticated','anon'));
create policy "Allow anon CRUD" on public.clients
  for all using (auth.role() in ('authenticated','anon'));
create policy "Allow anon CRUD" on public.feed_schedules
  for all using (auth.role() in ('authenticated','anon'));

-- ── KLAAR ✓ ──────────────────────────────────────────────────────────
-- Migration v4.1 — 2026-06-04
-- Fix: horse_id als uuid (was bigint) — past bij horses.id (uuid)
-- =====================================================================
