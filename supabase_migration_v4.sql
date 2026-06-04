-- =====================================================================
-- EQUIVESA — Migration v4 (Safe ALTER TABLE)
-- Voer dit éénmalig uit in Supabase SQL Editor
-- Alle ALTER TABLE's zijn IF NOT EXISTS → veilig te herhalen
-- =====================================================================

-- ── 1. CONTACTS ───────────────────────────────────────────────────────
-- ContactEditor stuurt: name, company, email, phone, role, website, notes, photo_url
alter table public.contacts add column if not exists company     text;
alter table public.contacts add column if not exists website     text;
alter table public.contacts add column if not exists photo_url   text;

-- ── 2. LOCATIONS ──────────────────────────────────────────────────────
-- LocationEditor stuurt: name, location_type, capacity, notes, photo_url
-- DB had kolom 'type', editor stuurde 'location_type' → voeg beide toe
alter table public.locations add column if not exists location_type text default 'stable';
alter table public.locations add column if not exists type         text;
alter table public.locations add column if not exists photo_url    text;
alter table public.locations add column if not exists lat          numeric;
alter table public.locations add column if not exists lng          numeric;

-- ── 3. DOCUMENTS ──────────────────────────────────────────────────────
-- DocumentEditor stuurt: name, category, horse_id, url, notes
alter table public.documents add column if not exists notes        text;
alter table public.documents add column if not exists document_type text;
alter table public.documents add column if not exists file_type    text;
alter table public.documents add column if not exists horse_id     bigint references public.horses on delete set null;

-- ── 4. CATALOG ────────────────────────────────────────────────────────
-- CatalogEditor stuurt: name, description, price, stock, photo_url
alter table public.catalog add column if not exists name        text;
alter table public.catalog add column if not exists description text;
alter table public.catalog add column if not exists price       numeric(10,2) default 0;
alter table public.catalog add column if not exists stock       integer default 0;
alter table public.catalog add column if not exists unit        text;
alter table public.catalog add column if not exists category    text;
alter table public.catalog add column if not exists photo_url   text;

-- ── 5. SUPPLIES_NEEDED ────────────────────────────────────────────────
-- SupplyEditor stuurt: item_name, quantity, requested_by, notes, photo_url, report_type
alter table public.supplies_needed add column if not exists photo_url    text;
alter table public.supplies_needed add column if not exists item_name    text;
alter table public.supplies_needed add column if not exists quantity     text;
alter table public.supplies_needed add column if not exists requested_by text;
alter table public.supplies_needed add column if not exists report_type  text default 'supply';

-- ── 6. BOOKINGS ───────────────────────────────────────────────────────
-- BookingEditor stuurt: title, booking_type, booking_date, start_time, end_time, status, location, notes, photo_url
alter table public.bookings add column if not exists photo_url    text;
alter table public.bookings add column if not exists client_id    bigint references public.clients on delete set null;
alter table public.bookings add column if not exists horse_id     bigint references public.horses on delete set null;

-- ── 7. INVOICES ───────────────────────────────────────────────────────
-- InvoiceEditor stuurt: invoice_number, client_name, invoice_date, due_date, total, subtotal, tax_rate, status, notes
alter table public.invoices add column if not exists client_name  text;
alter table public.invoices add column if not exists invoice_date date;
alter table public.invoices add column if not exists subtotal     numeric(10,2) default 0;
alter table public.invoices add column if not exists tax_rate     numeric(5,2)  default 21;
alter table public.invoices add column if not exists tax_amount   numeric(10,2) default 0;
alter table public.invoices add column if not exists total        numeric(10,2) default 0;

-- ── 8. TASKS ──────────────────────────────────────────────────────────
-- TaskEditor stuurt: title, description, due_date, start_time, end_time, category, horse_id, photo_url
alter table public.tasks add column if not exists photo_url  text;
alter table public.tasks add column if not exists end_time   time;

-- ── 9. HEALTH_RECORDS ─────────────────────────────────────────────────
-- HealthEditor stuurt: horse_id, scheduled_date, notes, performed_by, cost, category, photo_url
alter table public.health_records add column if not exists photo_url    text;
alter table public.health_records add column if not exists performed_by text;
alter table public.health_records add column if not exists cost         numeric(10,2);

-- ── 10. TRANSACTIONS ──────────────────────────────────────────────────
-- FinanceEditor stuurt: type, category, amount, description, reference, horse_id, date, receipt_url
alter table public.transactions add column if not exists category    text;
alter table public.transactions add column if not exists reference   text;
alter table public.transactions add column if not exists receipt_url text;
alter table public.transactions add column if not exists description text;
alter table public.transactions add column if not exists horse_id    bigint references public.horses on delete set null;

-- ── 11. MARES_BREEDING ────────────────────────────────────────────────
-- MareEditor stuurt: stallion_name, service_date, expected_foal_date, status
alter table public.mares_breeding add column if not exists horse_id          bigint references public.horses on delete cascade;
alter table public.mares_breeding add column if not exists expected_foal_date date;
alter table public.mares_breeding add column if not exists notes             text;
alter table public.mares_breeding add column if not exists photo_url         text;

-- ── 12. EMBRYOS ───────────────────────────────────────────────────────
-- EmbryoEditor stuurt: stallion_name, flush_date, status
alter table public.embryos add column if not exists horse_id   bigint references public.horses on delete cascade;
alter table public.embryos add column if not exists notes      text;
alter table public.embryos add column if not exists photo_url  text;

-- ── 13. STAFF_MEMBERS ─────────────────────────────────────────────────
alter table public.staff_members add column if not exists pin       text;
alter table public.staff_members add column if not exists photo_url text;

-- ── 14. CALENDAR_EVENTS ───────────────────────────────────────────────
alter table public.calendar_events add column if not exists all_day     boolean default false;
alter table public.calendar_events add column if not exists color       text;
alter table public.calendar_events add column if not exists horse_id    bigint references public.horses on delete set null;
alter table public.calendar_events add column if not exists description text;

-- ── 15. CLIENTS (aparte tabel naast contacts) ─────────────────────────
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

-- ── 16. RLS herinstellen op alle aangepaste tabellen ─────────────────
-- (veilig: drop + create)

drop policy if exists "Allow anon CRUD" on public.contacts;
create policy "Allow anon CRUD" on public.contacts
  for all using (auth.role() in ('authenticated','anon'));

drop policy if exists "Allow anon CRUD" on public.locations;
create policy "Allow anon CRUD" on public.locations
  for all using (auth.role() in ('authenticated','anon'));

drop policy if exists "Allow anon CRUD" on public.documents;
create policy "Allow anon CRUD" on public.documents
  for all using (auth.role() in ('authenticated','anon'));

drop policy if exists "Allow anon CRUD" on public.catalog;
create policy "Allow anon CRUD" on public.catalog
  for all using (auth.role() in ('authenticated','anon'));

drop policy if exists "Allow anon CRUD" on public.supplies_needed;
create policy "Allow anon CRUD" on public.supplies_needed
  for all using (auth.role() in ('authenticated','anon'));

drop policy if exists "Allow anon CRUD" on public.bookings;
create policy "Allow anon CRUD" on public.bookings
  for all using (auth.role() in ('authenticated','anon'));

drop policy if exists "Allow anon CRUD" on public.invoices;
create policy "Allow anon CRUD" on public.invoices
  for all using (auth.role() in ('authenticated','anon'));

drop policy if exists "Allow anon CRUD" on public.tasks;
create policy "Allow anon CRUD" on public.tasks
  for all using (auth.role() in ('authenticated','anon'));

drop policy if exists "Allow anon CRUD" on public.health_records;
create policy "Allow anon CRUD" on public.health_records
  for all using (auth.role() in ('authenticated','anon'));

drop policy if exists "Allow anon CRUD" on public.transactions;
create policy "Allow anon CRUD" on public.transactions
  for all using (auth.role() in ('authenticated','anon'));

drop policy if exists "Allow anon CRUD" on public.mares_breeding;
create policy "Allow anon CRUD" on public.mares_breeding
  for all using (auth.role() in ('authenticated','anon'));

drop policy if exists "Allow anon CRUD" on public.embryos;
create policy "Allow anon CRUD" on public.embryos
  for all using (auth.role() in ('authenticated','anon'));

drop policy if exists "Allow anon CRUD" on public.staff_members;
create policy "Allow anon CRUD" on public.staff_members
  for all using (auth.role() in ('authenticated','anon'));

drop policy if exists "Allow anon CRUD" on public.calendar_events;
create policy "Allow anon CRUD" on public.calendar_events
  for all using (auth.role() in ('authenticated','anon'));

drop policy if exists "Allow anon CRUD" on public.horses;
create policy "Allow anon CRUD" on public.horses
  for all using (auth.role() in ('authenticated','anon'));

-- Verwijder ook de oude policy-namen die in v3 zijn aangemaakt
drop policy if exists "Allow authenticated CRUD" on public.contacts;
drop policy if exists "Allow authenticated CRUD" on public.locations;
drop policy if exists "Allow authenticated CRUD" on public.documents;
drop policy if exists "Allow authenticated CRUD" on public.catalog;
drop policy if exists "Allow authenticated CRUD" on public.supplies_needed;
drop policy if exists "Allow authenticated CRUD" on public.bookings;
drop policy if exists "Allow authenticated CRUD" on public.invoices;
drop policy if exists "Allow authenticated CRUD" on public.tasks;
drop policy if exists "Allow authenticated CRUD" on public.health_records;
drop policy if exists "Allow authenticated CRUD" on public.transactions;
drop policy if exists "Allow authenticated CRUD" on public.mares_breeding;
drop policy if exists "Allow authenticated CRUD" on public.embryos;
drop policy if exists "Allow authenticated CRUD" on public.staff_members;
drop policy if exists "Allow authenticated CRUD" on public.calendar_events;
drop policy if exists "Allow authenticated CRUD" on public.horses;
drop policy if exists "Allow authenticated CRUD" on public.clients;
drop policy if exists "Allow authenticated CRUD" on public.feed_schedules;

drop policy if exists "Allow anon CRUD" on public.feed_schedules;
create policy "Allow anon CRUD" on public.feed_schedules
  for all using (auth.role() in ('authenticated','anon'));

-- ── KLAAR ✓ ──────────────────────────────────────────────────────────
-- Migration v4 — 2026-06-04
-- Elke ALTER is IF NOT EXISTS → 100% veilig opnieuw uitvoeren
-- =====================================================================
