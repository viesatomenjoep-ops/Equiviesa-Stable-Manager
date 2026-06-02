-- ==========================================
-- EQUIVESA - Supabase Database Schema
-- ==========================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES / USERS
create table public.profiles (
    id uuid references auth.users on delete cascade primary key,
    created_at timestamptz default now() not null,
    name text not null,
    email text unique not null,
    role text not null default 'roleStaff' check (role in ('roleAdmin', 'roleManager', 'roleStaff', 'roleVet', 'roleOwner')),
    perms text[] default '{}'::text[] not null,
    avatar_url text
);
alter table public.profiles enable row level security;

-- 2. HORSES
create table public.horses (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now() not null,
    name text not null,
    studbook text,
    sex text check (sex in ('sexMare', 'sexStallion', 'sexGelding')),
    color text,
    birthdate date,
    ueln text unique,
    chip text unique,
    feiid text unique,
    location text,
    tint text not null default '#2FB6A0',
    archived boolean not null default false,
    photo_url text,
    sire_id uuid references public.horses(id) on delete set null,
    dam_id uuid references public.horses(id) on delete set null,
    sire_name text,
    dam_name text
);
create index horses_name_idx on public.horses (name);
create index horses_archived_idx on public.horses (archived);
alter table public.horses enable row level security;

-- 3. FEEDING SCHEDULES (feed)
create table public.feed_schedules (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now() not null,
    horse_id uuid references public.horses(id) on delete cascade not null,
    slot text not null check (slot in ('morning', 'noon', 'evening', 'night')),
    product text not null,
    qty text
);
create index feed_schedules_horse_idx on public.feed_schedules (horse_id);
alter table public.feed_schedules enable row level security;

-- 4. TRANSACTIONS (finance)
create table public.transactions (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now() not null,
    type text not null check (type in ('income', 'expense')),
    "when" date not null default current_date,
    category text not null check (category in ('catConcours', 'catSold', 'catBoard', 'catVet', 'catFarrier', 'catFeed', 'catOther')),
    who text,
    reference text check (char_length(reference) <= 60),
    description text check (char_length(description) <= 255),
    amount numeric(12, 2) not null check (amount >= 0),
    horse_id uuid references public.horses(id) on delete set null,
    attachment_url text,
    created_by uuid references public.profiles(id) on delete set null
);
create index transactions_horse_idx on public.transactions (horse_id);
create index transactions_when_idx on public.transactions ("when");
alter table public.transactions enable row level security;

-- 5. TASKS
create table public.tasks (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now() not null,
    title text not null,
    description text,
    due_date date,
    start_time time,
    end_time time,
    is_completed boolean not null default false,
    category text not null check (category in ('horse', 'general')),
    horse_id uuid references public.horses(id) on delete cascade,
    assigned_to uuid references public.profiles(id) on delete set null
);
create index tasks_due_date_idx on public.tasks (due_date);
create index tasks_is_completed_idx on public.tasks (is_completed);
alter table public.tasks enable row level security;

-- 6. HEALTH RECORDS
create table public.health_records (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now() not null,
    horse_id uuid references public.horses(id) on delete cascade not null,
    category text not null check (category in ('appointments', 'farrier', 'deworming', 'vaccinations', 'generalCare', 'treatments', 'dental', 'medication')),
    scheduled_date date not null,
    completed boolean not null default false,
    notes text,
    performed_by text,
    cost numeric(12, 2),
    transaction_id uuid references public.transactions(id) on delete set null
);
create index health_records_horse_category_idx on public.health_records (horse_id, category);
alter table public.health_records enable row level security;

-- 7. DOCUMENTS
create table public.documents (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now() not null,
    name text not null,
    url text not null,
    file_type text,
    horse_id uuid references public.horses(id) on delete cascade,
    uploaded_by uuid references public.profiles(id) on delete set null
);
alter table public.documents enable row level security;

-- 8. MARES BREEDING TRACKING
create table public.mares_breeding (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now() not null,
    mare_id uuid references public.horses(id) on delete cascade not null,
    stallion_name text not null,
    service_date date,
    expected_foal_date date,
    status text not null check (status in ('inseminated', 'confirmed_pregnant', 'empty', 'aborted', 'foaled')),
    notes text
);
alter table public.mares_breeding enable row level security;

-- 9. EMBRYOS
create table public.embryos (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now() not null,
    donor_mare_id uuid references public.horses(id) on delete cascade not null,
    stallion_name text not null,
    flush_date date not null,
    recipient_mare_id uuid references public.horses(id) on delete set null,
    status text not null check (status in ('frozen', 'transferred', 'pregnant', 'failed')),
    notes text
);
alter table public.embryos enable row level security;

-- 10. CONTACTS / CLIENTS
create table public.contacts (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now() not null,
    name text not null,
    email text,
    phone text,
    role text not null check (role in ('owner', 'client', 'vet', 'farrier', 'rider', 'supplier', 'other')),
    notes text
);
alter table public.contacts enable row level security;

-- 11. STABLE SUPPLIES
create table public.supplies_needed (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now() not null,
    item_name text not null,
    quantity text,
    requested_by text,
    status text not null default 'pending' check (status in ('pending', 'purchased')),
    notes text,
    completed_at timestamptz,
    completed_by uuid references public.profiles(id) on delete set null
);
alter table public.supplies_needed enable row level security;

-- 12. LOCATIONS
create table public.locations (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now() not null,
    name text not null,
    type text not null,
    capacity integer,
    notes text
);
alter table public.locations enable row level security;

-- 13. BOOKINGS
create table public.bookings (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now() not null,
    date date not null,
    status text not null default 'pending',
    notes text,
    horse_id uuid references public.horses(id) on delete cascade,
    client_id uuid references public.contacts(id) on delete set null
);
alter table public.bookings enable row level security;

-- 14. INVOICES
create table public.invoices (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now() not null,
    reference text not null,
    date date not null,
    amount numeric(12, 2) not null,
    status text not null default 'unpaid',
    client_id uuid references public.contacts(id) on delete set null,
    document_url text
);
alter table public.invoices enable row level security;

-- 15. CATALOG
create table public.catalog (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now() not null,
    horse_id uuid references public.horses(id) on delete cascade,
    price numeric(12, 2),
    description text,
    visible boolean default false
);
alter table public.catalog enable row level security;

-- ============================================================
-- Row-Level Security (RLS) Basic Policies
-- ============================================================
create policy "Allow authenticated CRUD" on public.profiles for all using (auth.role() = 'authenticated');
create policy "Allow authenticated CRUD" on public.horses for all using (auth.role() = 'authenticated');
create policy "Allow authenticated CRUD" on public.feed_schedules for all using (auth.role() = 'authenticated');
create policy "Allow authenticated CRUD" on public.transactions for all using (auth.role() = 'authenticated');
create policy "Allow authenticated CRUD" on public.tasks for all using (auth.role() = 'authenticated');
create policy "Allow authenticated CRUD" on public.health_records for all using (auth.role() = 'authenticated');
create policy "Allow authenticated CRUD" on public.documents for all using (auth.role() = 'authenticated');
create policy "Allow authenticated CRUD" on public.mares_breeding for all using (auth.role() = 'authenticated');
create policy "Allow authenticated CRUD" on public.embryos for all using (auth.role() = 'authenticated');
create policy "Allow authenticated CRUD" on public.contacts for all using (auth.role() = 'authenticated');
create policy "Allow authenticated CRUD" on public.supplies_needed for all using (auth.role() = 'authenticated');
create policy "Allow authenticated CRUD" on public.locations for all using (auth.role() = 'authenticated');
create policy "Allow authenticated CRUD" on public.bookings for all using (auth.role() = 'authenticated');
create policy "Allow authenticated CRUD" on public.invoices for all using (auth.role() = 'authenticated');
create policy "Allow authenticated CRUD" on public.catalog for all using (auth.role() = 'authenticated');

-- ============================================================
-- Triggers for Automatic User Profile Creation
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

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
