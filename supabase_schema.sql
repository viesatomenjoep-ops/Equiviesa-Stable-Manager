-- ==========================================
-- EQUIVESA - Supabase Database Schema
-- SAFE MIGRATION: uses IF NOT EXISTS everywhere
-- Run this on an existing or fresh database
-- ==========================================

create extension if not exists "uuid-ossp";

-- ============================================================
-- 1. PROFILES
-- ============================================================
create table if not exists public.profiles (
    id uuid references auth.users on delete cascade primary key,
    created_at timestamptz default now() not null,
    name text not null,
    email text unique not null,
    role text not null default 'roleStaff' check (role in ('roleAdmin', 'roleManager', 'roleStaff', 'roleVet', 'roleOwner')),
    perms text[] default '{}'::text[] not null,
    avatar_url text
);
alter table public.profiles enable row level security;

-- ============================================================
-- 2. HORSES
-- ============================================================
create table if not exists public.horses (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now() not null,
    name text not null,
    studbook text,
    sex text,
    color text,
    birthdate date,
    ueln text,
    chip text,
    feiid text,
    location text,
    tint text not null default '#2FB6A0',
    archived boolean not null default false,
    photo_url text,
    sire_id uuid references public.horses(id) on delete set null,
    dam_id uuid references public.horses(id) on delete set null,
    sire_name text,
    dam_name text
);
-- Add new columns if they don't exist yet (migration-safe)
alter table public.horses add column if not exists breed text;
alter table public.horses add column if not exists discipline text;
alter table public.horses add column if not exists horse_type text;

create index if not exists horses_name_idx on public.horses (name);
create index if not exists horses_archived_idx on public.horses (archived);
alter table public.horses enable row level security;

-- ============================================================
-- 3. FEED SCHEDULES
-- ============================================================
create table if not exists public.feed_schedules (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now() not null,
    horse_id uuid references public.horses(id) on delete cascade not null,
    slot text not null,
    product text not null,
    qty text
);
create index if not exists feed_schedules_horse_idx on public.feed_schedules (horse_id);
alter table public.feed_schedules enable row level security;

-- ============================================================
-- 4. TRANSACTIONS
-- ============================================================
create table if not exists public.transactions (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now() not null,
    type text not null,
    "when" date not null default current_date,
    category text not null,
    who text,
    reference text,
    description text,
    amount numeric(12, 2) not null default 0,
    horse_id uuid references public.horses(id) on delete set null,
    attachment_url text,
    created_by uuid references public.profiles(id) on delete set null
);
create index if not exists transactions_horse_idx on public.transactions (horse_id);
create index if not exists transactions_when_idx on public.transactions ("when");
alter table public.transactions enable row level security;

-- ============================================================
-- 5. TASKS
-- ============================================================
create table if not exists public.tasks (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now() not null,
    title text not null,
    description text,
    due_date date,
    is_completed boolean not null default false,
    category text not null default 'general',
    horse_id uuid references public.horses(id) on delete cascade,
    assigned_to uuid references public.profiles(id) on delete set null
);
alter table public.tasks add column if not exists start_time time;
alter table public.tasks add column if not exists end_time time;

create index if not exists tasks_due_date_idx on public.tasks (due_date);
create index if not exists tasks_is_completed_idx on public.tasks (is_completed);
alter table public.tasks enable row level security;

-- ============================================================
-- 6. HEALTH RECORDS
-- ============================================================
create table if not exists public.health_records (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now() not null,
    horse_id uuid references public.horses(id) on delete cascade not null,
    category text not null,
    scheduled_date date not null,
    completed boolean not null default false,
    notes text,
    performed_by text,
    cost numeric(12, 2),
    transaction_id uuid references public.transactions(id) on delete set null
);
create index if not exists health_records_horse_category_idx on public.health_records (horse_id, category);
alter table public.health_records enable row level security;

-- ============================================================
-- 7. DOCUMENTS
-- ============================================================
create table if not exists public.documents (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now() not null,
    name text not null,
    url text not null,
    file_type text,
    horse_id uuid references public.horses(id) on delete cascade,
    uploaded_by uuid references public.profiles(id) on delete set null
);
alter table public.documents add column if not exists category text default 'other';
alter table public.documents add column if not exists description text;
alter table public.documents add column if not exists file_size integer;

create index if not exists documents_horse_idx on public.documents (horse_id);
create index if not exists documents_category_idx on public.documents (category);
alter table public.documents enable row level security;

-- ============================================================
-- 8. MARES BREEDING
-- ============================================================
create table if not exists public.mares_breeding (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now() not null,
    mare_id uuid references public.horses(id) on delete cascade not null,
    stallion_name text not null,
    service_date date,
    expected_foal_date date,
    status text not null default 'inseminated',
    notes text
);
alter table public.mares_breeding add column if not exists stallion_studbook text;
alter table public.mares_breeding add column if not exists service_type text;
alter table public.mares_breeding add column if not exists scan_dates text[];
alter table public.mares_breeding add column if not exists last_scan_result text;
alter table public.mares_breeding add column if not exists vet_name text;
alter table public.mares_breeding add column if not exists photo_urls text[];
alter table public.mares_breeding add column if not exists passport_url text;
alter table public.mares_breeding add column if not exists cost numeric(12, 2);

create index if not exists mares_breeding_mare_idx on public.mares_breeding (mare_id);
alter table public.mares_breeding enable row level security;

-- ============================================================
-- 9. EMBRYOS
-- ============================================================
create table if not exists public.embryos (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now() not null,
    donor_mare_id uuid references public.horses(id) on delete cascade not null,
    stallion_name text not null,
    flush_date date not null,
    recipient_mare_id uuid references public.horses(id) on delete set null,
    status text not null default 'frozen',
    notes text
);
alter table public.embryos add column if not exists stallion_studbook text;
alter table public.embryos add column if not exists grade text;
alter table public.embryos add column if not exists recipient_mare_name text;
alter table public.embryos add column if not exists transfer_date date;
alter table public.embryos add column if not exists storage_location text;
alter table public.embryos add column if not exists storage_tank text;
alter table public.embryos add column if not exists straw_number text;
alter table public.embryos add column if not exists vet_name text;
alter table public.embryos add column if not exists cost numeric(12, 2);
alter table public.embryos add column if not exists photo_urls text[];

create index if not exists embryos_donor_idx on public.embryos (donor_mare_id);
alter table public.embryos enable row level security;

-- ============================================================
-- 9b. FOALS
-- ============================================================
create table if not exists public.foals (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now() not null,
    name text not null,
    dam_id uuid references public.horses(id) on delete set null,
    sire_name text,
    birth_date date not null,
    birth_time time,
    sex text,
    color text,
    markings text,
    birth_weight text,
    birth_type text,
    placenta_passed boolean,
    vet_present boolean default false,
    vet_name text,
    igg_tested boolean default false,
    igg_result text,
    microchip text,
    passport_number text,
    registration_number text,
    studbook text,
    weaning_date date,
    status text not null default 'healthy',
    photo_urls text[],
    passport_url text,
    notes text
);
create index if not exists foals_dam_idx on public.foals (dam_id);
create index if not exists foals_birth_idx on public.foals (birth_date);
alter table public.foals enable row level security;

-- ============================================================
-- 10. LOCATIONS
-- ============================================================
create table if not exists public.locations (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now() not null,
    name text not null,
    location_type text not null default 'stable',
    address text,
    city text,
    province text,
    country text,
    continent text,
    postal_code text,
    latitude numeric(10, 7),
    longitude numeric(10, 7),
    photo_url text,
    notes text,
    capacity integer
);
alter table public.locations enable row level security;

-- ============================================================
-- 11. CONTACTS
-- ============================================================
create table if not exists public.contacts (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now() not null,
    name text not null,
    email text,
    phone text,
    role text not null default 'other',
    notes text
);
alter table public.contacts add column if not exists company text;
alter table public.contacts add column if not exists address text;
alter table public.contacts add column if not exists city text;
alter table public.contacts add column if not exists country text;
alter table public.contacts add column if not exists website text;

alter table public.contacts enable row level security;

-- ============================================================
-- 12. SUPPLIES NEEDED
-- ============================================================
create table if not exists public.supplies_needed (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now() not null,
    item_name text not null,
    quantity text,
    requested_by text,
    status text not null default 'pending',
    notes text,
    completed_at timestamptz,
    completed_by uuid references public.profiles(id) on delete set null
);
alter table public.supplies_needed enable row level security;

-- ============================================================
-- 13. CLIENTS
-- ============================================================
create table if not exists public.clients (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now() not null,
    name text not null,
    company text,
    email text,
    phone text,
    client_type text not null default 'other',
    address text,
    city text,
    country text,
    billing_email text,
    vat_number text,
    horse_ids text[],
    notes text,
    active boolean not null default true
);
create index if not exists clients_type_idx on public.clients (client_type);
alter table public.clients enable row level security;

-- ============================================================
-- 14. BOOKINGS
-- ============================================================
create table if not exists public.bookings (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now() not null,
    title text not null,
    booking_type text not null default 'other',
    booking_date date not null,
    start_time time,
    end_time time,
    horse_id uuid references public.horses(id) on delete set null,
    client_id uuid references public.clients(id) on delete set null,
    contact_id uuid references public.contacts(id) on delete set null,
    status text not null default 'pending',
    recurring boolean not null default false,
    recurrence_rule text,
    location text,
    price numeric(12, 2),
    notes text,
    calendar_url text
);
create index if not exists bookings_date_idx on public.bookings (booking_date);
create index if not exists bookings_type_idx on public.bookings (booking_type);
create index if not exists bookings_status_idx on public.bookings (status);
alter table public.bookings enable row level security;

-- ============================================================
-- 15. COMPANY SETTINGS
-- ============================================================
create table if not exists public.company_settings (
    id uuid default gen_random_uuid() primary key,
    company_name text not null default 'Equiviesa Stable',
    address text,
    city text,
    country text,
    postal_code text,
    phone text,
    email text,
    website text,
    vat_number text,
    chamber_of_commerce text,
    iban text,
    bank_name text,
    logo_url text,
    invoice_prefix text default 'INV',
    invoice_next_number integer default 1,
    currency text default 'EUR',
    tax_rate numeric(5, 2) default 21.00,
    payment_terms text default 'Net 30',
    footer_text text
);
alter table public.company_settings enable row level security;

-- ============================================================
-- 16. INVOICES
-- ============================================================
create table if not exists public.invoices (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now() not null,
    invoice_number text not null unique,
    client_id uuid references public.clients(id) on delete set null,
    client_name text not null,
    client_email text,
    client_address text,
    client_vat text,
    invoice_date date not null default current_date,
    due_date date not null,
    status text not null default 'draft',
    line_items jsonb not null default '[]'::jsonb,
    subtotal numeric(12, 2) not null default 0,
    tax_rate numeric(5, 2) not null default 21.00,
    tax_amount numeric(12, 2) not null default 0,
    total numeric(12, 2) not null default 0,
    notes text,
    payment_date date,
    payment_method text,
    pdf_url text,
    horse_id uuid references public.horses(id) on delete set null,
    created_by uuid references public.profiles(id) on delete set null
);
create index if not exists invoices_status_idx on public.invoices (status);
create index if not exists invoices_client_idx on public.invoices (client_id);
create index if not exists invoices_date_idx on public.invoices (invoice_date);
alter table public.invoices enable row level security;

-- ============================================================
-- 17. CATALOG
-- ============================================================
create table if not exists public.catalog (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now() not null,
    horse_id uuid references public.horses(id) on delete cascade not null,
    title text not null,
    listing_type text not null default 'for_sale',
    price numeric(12, 2),
    price_on_request boolean not null default false,
    currency text default 'EUR',
    description text,
    highlights text,
    level text,
    achievements text,
    vet_checked boolean not null default false,
    xray_available boolean not null default false,
    video_urls text[],
    photo_urls text[],
    contact_name text,
    contact_phone text,
    contact_email text,
    location text,
    status text not null default 'active',
    featured boolean not null default false,
    views_count integer default 0,
    published_at timestamptz
);
create index if not exists catalog_status_idx on public.catalog (status);
create index if not exists catalog_horse_idx on public.catalog (horse_id);
create index if not exists catalog_type_idx on public.catalog (listing_type);
alter table public.catalog enable row level security;


-- ============================================================
-- RLS POLICIES (drop + recreate to avoid duplicates)
-- ============================================================
do $$
declare
  tbl text;
begin
  for tbl in
    select unnest(array[
      'profiles','horses','feed_schedules','transactions','tasks',
      'health_records','documents','mares_breeding','embryos','foals',
      'contacts','supplies_needed','locations','clients','bookings',
      'company_settings','invoices','catalog'
    ])
  loop
    execute format('drop policy if exists "Allow authenticated CRUD" on public.%I', tbl);
    execute format('create policy "Allow authenticated CRUD" on public.%I for all using (auth.role() = ''authenticated'')', tbl);
  end loop;
end;
$$;


-- ============================================================
-- TRIGGER: auto-create profile on signup
-- ============================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, role, perms)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    'roleStaff',
    array['permHorses', 'permCalendar', 'permTasks', 'permFeeding']::text[]
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
