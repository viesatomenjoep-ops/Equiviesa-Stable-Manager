-- ==========================================
-- EQUIVESA — Master SQL Schema v3
-- Volledig idempotent: veilig te her-uitvoeren
-- RLS: open voor anon (app gebruikt geen auth)
-- Gegenereerd: 2026-06-04
-- ==========================================

-- UUID extension (veilig in exception-blok)
do $$ begin
  create extension if not exists "uuid-ossp";
exception when others then null;
end $$;

-- ============================================================
-- 1. PROFILES / USERS
-- ============================================================
create table if not exists public.profiles (
    id uuid references auth.users on delete cascade primary key,
    created_at timestamptz default now() not null,
    name text not null,
    email text unique not null,
    role text not null default 'roleStaff' check (role in ('roleAdmin','roleManager','roleStaff','roleVet','roleOwner')),
    perms text[] default '{}'::text[] not null,
    avatar_url text
);
alter table public.profiles enable row level security;

-- ============================================================
-- 2. HORSES
-- ============================================================
create table if not exists public.horses (
    id bigserial primary key,
    created_at timestamptz default now() not null,
    name text not null,
    breed text,
    birthdate date,
    color_hex text default '#8B6F47',
    photo_url text,
    sire_name text,
    dam_name text,
    gender text default 'mare' check (gender in ('mare','stallion','gelding','colt','filly','unknown')),
    location_id bigint,
    archived boolean default false not null,
    notes text
);
alter table public.horses enable row level security;

-- ============================================================
-- 3. FEED SCHEDULES
-- ============================================================
create table if not exists public.feed_schedules (
    id bigserial primary key,
    created_at timestamptz default now() not null,
    horse_id bigint references public.horses on delete cascade not null,
    slot text not null check (slot in ('morning','noon','evening','night')),
    product text not null,
    qty text
);
alter table public.feed_schedules enable row level security;

-- ============================================================
-- 4. TRANSACTIONS (Finance)
-- ============================================================
create table if not exists public.transactions (
    id bigserial primary key,
    created_at timestamptz default now() not null,
    horse_id bigint references public.horses on delete set null,
    amount numeric(10,2) not null default 0,
    type text default 'expense' check (type in ('income','expense')),
    date date,
    description text,
    receipt_url text,
    category text
);
alter table public.transactions enable row level security;

-- ============================================================
-- 5. TASKS
-- ============================================================
create table if not exists public.tasks (
    id bigserial primary key,
    created_at timestamptz default now() not null,
    title text not null,
    description text,
    due_date date,
    start_time time,
    end_time time,
    category text default 'general' check (category in ('general','horse')),
    horse_id bigint references public.horses on delete set null,
    photo_url text,
    is_completed boolean default false not null,
    assigned_to uuid references public.profiles on delete set null
);
alter table public.tasks enable row level security;

-- ============================================================
-- 6. HEALTH RECORDS
-- category MOET overeenkomen met HealthEditor categorieën
-- ============================================================
create table if not exists public.health_records (
    id bigserial primary key,
    created_at timestamptz default now() not null,
    horse_id bigint references public.horses on delete cascade not null,
    scheduled_date date not null,
    notes text,
    performed_by text,
    cost numeric(10,2),
    category text default 'generalCare' check (category in (
        'generalCare','vaccinations','deworming','farrier',
        'dental','treatments','appointments','medication'
    )),
    photo_url text,
    completed boolean default false not null
);
alter table public.health_records enable row level security;

-- ============================================================
-- 7. DOCUMENTS
-- ============================================================
create table if not exists public.documents (
    id bigserial primary key,
    created_at timestamptz default now() not null,
    name text not null,
    url text,
    file_type text,
    horse_id bigint references public.horses on delete set null,
    document_type text,
    notes text
);
alter table public.documents enable row level security;

-- ============================================================
-- 8. MARES BREEDING
-- ============================================================
create table if not exists public.mares_breeding (
    id bigserial primary key,
    created_at timestamptz default now() not null,
    horse_id bigint references public.horses on delete cascade,
    stallion_name text not null,
    service_date date,
    expected_foal_date date,
    status text default 'inseminated' check (status in (
        'inseminated','confirmed_pregnant','empty','aborted','foaled'
    )),
    notes text,
    photo_url text
);
alter table public.mares_breeding enable row level security;

-- ============================================================
-- 9. EMBRYOS
-- ============================================================
create table if not exists public.embryos (
    id bigserial primary key,
    created_at timestamptz default now() not null,
    horse_id bigint references public.horses on delete cascade,
    stallion_name text not null,
    flush_date date not null,
    status text default 'frozen' check (status in ('frozen','transferred','pregnant','failed')),
    notes text,
    photo_url text
);
alter table public.embryos enable row level security;

-- ============================================================
-- 10. LOCATIONS
-- ============================================================
create table if not exists public.locations (
    id bigserial primary key,
    created_at timestamptz default now() not null,
    name text not null,
    type text,
    capacity integer,
    notes text,
    lat numeric,
    lng numeric,
    photo_url text
);
alter table public.locations enable row level security;

-- ============================================================
-- 11. CONTACTS
-- ============================================================
create table if not exists public.contacts (
    id bigserial primary key,
    created_at timestamptz default now() not null,
    name text not null,
    email text,
    phone text,
    role text default 'other' check (role in ('owner','client','vet','farrier','rider','supplier','other')),
    notes text,
    photo_url text
);
alter table public.contacts enable row level security;

-- ============================================================
-- 12. SUPPLIES NEEDED
-- ============================================================
create table if not exists public.supplies_needed (
    id bigserial primary key,
    created_at timestamptz default now() not null,
    name text not null,
    qty text,
    status text default 'needed' check (status in ('needed','ordered','received')),
    category text default 'feed' check (category in ('feed','medical','equipment','bedding','cleaning','clothing','other')),
    amazon_link text,
    photo_url text,
    notes text
);
alter table public.supplies_needed enable row level security;

-- ============================================================
-- 13. CLIENTS (aparte tabel voor klantenportaal)
-- ============================================================
create table if not exists public.clients (
    id bigserial primary key,
    created_at timestamptz default now() not null,
    name text not null,
    email text,
    phone text,
    address text,
    notes text,
    photo_url text
);
alter table public.clients enable row level security;

-- ============================================================
-- 14. BOOKINGS
-- Velden matchen exact met BookingEditor
-- ============================================================
create table if not exists public.bookings (
    id bigserial primary key,
    created_at timestamptz default now() not null,
    title text not null,
    booking_type text default 'other' check (booking_type in (
        'arena','lesson','training','vet_visit','farrier_visit',
        'competition','transport','other'
    )),
    booking_date date not null,
    start_time time,
    end_time time,
    status text default 'pending' check (status in ('pending','confirmed','cancelled','completed')),
    location text,
    notes text,
    photo_url text,
    client_id bigint references public.clients on delete set null,
    horse_id bigint references public.horses on delete set null
);
alter table public.bookings enable row level security;

-- ============================================================
-- 15. INVOICES
-- Velden matchen exact met InvoiceEditor
-- ============================================================
create table if not exists public.invoices (
    id bigserial primary key,
    created_at timestamptz default now() not null,
    invoice_number text,
    client_name text not null,
    client_id bigint references public.clients on delete set null,
    invoice_date date,
    due_date date not null,
    subtotal numeric(10,2) default 0,
    tax_rate numeric(5,2) default 21,
    tax_amount numeric(10,2) default 0,
    total numeric(10,2) default 0,
    status text default 'draft' check (status in ('draft','sent','paid','overdue','partial')),
    notes text
);
alter table public.invoices enable row level security;

-- ============================================================
-- 16. COMPANY SETTINGS
-- ============================================================
create table if not exists public.company_settings (
    id bigserial primary key,
    created_at timestamptz default now() not null,
    name text,
    address text,
    phone text,
    email text,
    logo_url text,
    kvk text,
    btw text,
    iban text,
    currency text default 'EUR'
);
alter table public.company_settings enable row level security;

-- ============================================================
-- 17. CATALOG (diensten / producten)
-- ============================================================
create table if not exists public.catalog (
    id bigserial primary key,
    created_at timestamptz default now() not null,
    name text,
    description text,
    price numeric(10,2) default 0,
    unit text,
    category text,
    photo_url text
);
alter table public.catalog enable row level security;

-- ============================================================
-- 18. STALLS (boxen)
-- ============================================================
create table if not exists public.stalls (
    id bigserial primary key,
    created_at timestamptz default now() not null,
    name text not null,
    horse_id bigint references public.horses on delete set null,
    notes text,
    status text default 'available' check (status in ('available','occupied','maintenance'))
);
alter table public.stalls enable row level security;

-- ============================================================
-- 19. STAFF MEMBERS
-- ============================================================
create table if not exists public.staff_members (
    id bigserial primary key,
    created_at timestamptz default now() not null,
    name text not null,
    role text default 'groom',
    email text,
    phone text,
    photo_url text,
    available boolean default true not null,
    pin text
);
alter table public.staff_members enable row level security;

-- ============================================================
-- 20. CALENDAR EVENTS
-- ============================================================
create table if not exists public.calendar_events (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now() not null,
    title text not null,
    event_type text not null default 'general' check (event_type in (
        'general','competition','vet_visit','farrier_visit','transport',
        'training','lesson','meeting','holiday','reminder','other'
    )),
    event_date date not null,
    start_time time,
    end_time time,
    description text,
    horse_id bigint references public.horses on delete set null,
    all_day boolean default false,
    color text
);
create index if not exists calendar_events_date_idx on public.calendar_events (event_date);
alter table public.calendar_events enable row level security;

-- ============================================================
-- RLS POLICIES — open voor anon (app heeft geen auth login)
-- DROP + CREATE zodat heruitvoeren nooit faalt
-- ============================================================
drop policy if exists "Allow authenticated CRUD" on public.profiles;
create policy "Allow authenticated CRUD" on public.profiles for all using (auth.role() in ('authenticated','anon'));

drop policy if exists "Allow authenticated CRUD" on public.horses;
create policy "Allow authenticated CRUD" on public.horses for all using (auth.role() in ('authenticated','anon'));

drop policy if exists "Allow authenticated CRUD" on public.feed_schedules;
create policy "Allow authenticated CRUD" on public.feed_schedules for all using (auth.role() in ('authenticated','anon'));

drop policy if exists "Allow authenticated CRUD" on public.transactions;
create policy "Allow authenticated CRUD" on public.transactions for all using (auth.role() in ('authenticated','anon'));

drop policy if exists "Allow authenticated CRUD" on public.tasks;
create policy "Allow authenticated CRUD" on public.tasks for all using (auth.role() in ('authenticated','anon'));

drop policy if exists "Allow authenticated CRUD" on public.health_records;
create policy "Allow authenticated CRUD" on public.health_records for all using (auth.role() in ('authenticated','anon'));

drop policy if exists "Allow authenticated CRUD" on public.documents;
create policy "Allow authenticated CRUD" on public.documents for all using (auth.role() in ('authenticated','anon'));

drop policy if exists "Allow authenticated CRUD" on public.mares_breeding;
create policy "Allow authenticated CRUD" on public.mares_breeding for all using (auth.role() in ('authenticated','anon'));

drop policy if exists "Allow authenticated CRUD" on public.embryos;
create policy "Allow authenticated CRUD" on public.embryos for all using (auth.role() in ('authenticated','anon'));

drop policy if exists "Allow authenticated CRUD" on public.locations;
create policy "Allow authenticated CRUD" on public.locations for all using (auth.role() in ('authenticated','anon'));

drop policy if exists "Allow authenticated CRUD" on public.contacts;
create policy "Allow authenticated CRUD" on public.contacts for all using (auth.role() in ('authenticated','anon'));

drop policy if exists "Allow authenticated CRUD" on public.supplies_needed;
create policy "Allow authenticated CRUD" on public.supplies_needed for all using (auth.role() in ('authenticated','anon'));

drop policy if exists "Allow authenticated CRUD" on public.clients;
create policy "Allow authenticated CRUD" on public.clients for all using (auth.role() in ('authenticated','anon'));

drop policy if exists "Allow authenticated CRUD" on public.bookings;
create policy "Allow authenticated CRUD" on public.bookings for all using (auth.role() in ('authenticated','anon'));

drop policy if exists "Allow authenticated CRUD" on public.invoices;
create policy "Allow authenticated CRUD" on public.invoices for all using (auth.role() in ('authenticated','anon'));

drop policy if exists "Allow authenticated CRUD" on public.company_settings;
create policy "Allow authenticated CRUD" on public.company_settings for all using (auth.role() in ('authenticated','anon'));

drop policy if exists "Allow authenticated CRUD" on public.catalog;
create policy "Allow authenticated CRUD" on public.catalog for all using (auth.role() in ('authenticated','anon'));

drop policy if exists "Allow authenticated CRUD" on public.stalls;
create policy "Allow authenticated CRUD" on public.stalls for all using (auth.role() in ('authenticated','anon'));

drop policy if exists "Allow authenticated CRUD" on public.staff_members;
create policy "Allow authenticated CRUD" on public.staff_members for all using (auth.role() in ('authenticated','anon'));

drop policy if exists "Allow authenticated CRUD" on public.calendar_events;
create policy "Allow authenticated CRUD" on public.calendar_events for all using (auth.role() in ('authenticated','anon'));

-- ============================================================
-- TRIGGER: profiel aanmaken bij nieuwe gebruiker (optioneel)
-- ============================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)), new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- VIEW: Staff-overzicht met taken
-- ============================================================
create or replace view public.staff_task_overview as
select
    s.id as staff_id,
    s.name as staff_name,
    s.role as staff_role,
    s.photo_url,
    s.available,
    t.id as task_id,
    t.title as task_title,
    t.due_date,
    t.start_time,
    t.is_completed,
    t.category,
    h.name as horse_name
from public.staff_members s
left join public.profiles p on p.email = s.email
left join public.tasks t on t.assigned_to = p.id
left join public.horses h on h.id = t.horse_id;

-- ============================================================
-- KLAAR ✓  — Master v3 — 2026-06-04
-- Alle tabellen: IF NOT EXISTS (veilig)
-- Alle policies: DROP + CREATE voor anon + authenticated
-- Exact afgestemd op: BookingEditor, InvoiceEditor,
--   HealthEditor, TaskEditor, FeedingEditor, alle Editors.jsx
-- ============================================================
