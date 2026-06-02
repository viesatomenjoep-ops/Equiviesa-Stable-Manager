-- ==========================================
-- EQUIVESA - Supabase Database Schema
-- ==========================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES / USERS
-- Links to Supabase Auth metadata for users, handles authorization roles and permissions
create table public.profiles (
    id uuid references auth.users on delete cascade primary key,
    created_at timestamptz default now() not null,
    name text not null,
    email text unique not null,
    role text not null default 'roleStaff' check (role in ('roleAdmin', 'roleManager', 'roleStaff', 'roleVet', 'roleOwner')),
    perms text[] default '{}'::text[] not null,
    avatar_url text
);

-- Enable RLS for profiles
alter table public.profiles enable row level security;

-- 2. HORSES
-- Core table representing horses. Includes lineage (sire/dam) and Cloudinary photo links
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
    location text, -- Linked to location string or optional reference
    tint text not null default '#2FB6A0',
    archived boolean not null default false,
    photo_url text, -- Store Cloudinary URL here
    
    -- Breeding lineage reference (Self-referential relations)
    sire_id uuid references public.horses(id) on delete set null,
    dam_id uuid references public.horses(id) on delete set null,
    sire_name text, -- fallback text if father is not in database
    dam_name text   -- fallback text if mother is not in database
);

-- Create indexes for performance on lookups
create index horses_name_idx on public.horses (name);
create index horses_archived_idx on public.horses (archived);

-- Enable RLS for horses
alter table public.horses enable row level security;

-- 3. FEEDING SCHEDULES (feed)
-- Stores feeding instructions per day slot (morning, noon, evening, night)
create table public.feed_schedules (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now() not null,
    horse_id uuid references public.horses(id) on delete cascade not null,
    slot text not null check (slot in ('morning', 'noon', 'evening', 'night')),
    product text not null,
    qty text -- e.g. '2 kg', '1 scoop'
);

create index feed_schedules_horse_idx on public.feed_schedules (horse_id);

-- Enable RLS for feed_schedules
alter table public.feed_schedules enable row level security;

-- 4. TRANSACTIONS (txns / finance)
-- Income & expenses with optional links to horses and files hosted in Cloudinary
create table public.transactions (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now() not null,
    type text not null check (type in ('income', 'expense')),
    "when" date not null default current_date,
    category text not null check (category in ('catConcours', 'catSold', 'catBoard', 'catVet', 'catFarrier', 'catFeed', 'catOther')),
    who text, -- reference to contact name
    reference text check (char_length(reference) <= 60),
    description text check (char_length(description) <= 255),
    amount numeric(12, 2) not null check (amount >= 0),
    horse_id uuid references public.horses(id) on delete set null,
    attachment_url text, -- Cloudinary PDF/Image invoice link
    created_by uuid references public.profiles(id) on delete set null
);

create index transactions_horse_idx on public.transactions (horse_id);
create index transactions_when_idx on public.transactions ("when");

-- Enable RLS for transactions
alter table public.transactions enable row level security;

-- 5. TASKS
-- General tasks or horse-specific tasks (linked to groom or manager views)
create table public.tasks (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now() not null,
    title text not null,
    description text,
    due_date date,
    start_time time, -- e.g. 08:00
    end_time time,   -- e.g. 10:00
    is_completed boolean not null default false,
    category text not null check (category in ('horse', 'general')),
    horse_id uuid references public.horses(id) on delete cascade,
    assigned_to uuid references public.profiles(id) on delete set null
);

create index tasks_due_date_idx on public.tasks (due_date);
create index tasks_is_completed_idx on public.tasks (is_completed);

-- Enable RLS for tasks
alter table public.tasks enable row level security;

-- 6. HEALTH / CARE RECORDS
-- Tracks veterinary, farrier, vaccinations, dewormings and medications
create table public.health_records (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now() not null,
    horse_id uuid references public.horses(id) on delete cascade not null,
    category text not null check (category in ('appointments', 'farrier', 'deworming', 'vaccinations', 'generalCare', 'treatments', 'dental', 'medication')),
    scheduled_date date not null,
    completed boolean not null default false,
    notes text,
    performed_by text, -- name of vet/farrier/groom
    cost numeric(12, 2), -- optional reference cost
    transaction_id uuid references public.transactions(id) on delete set null -- links to finance txn if paid
);

create index health_records_horse_category_idx on public.health_records (horse_id, category);

-- Enable RLS for health_records
alter table public.health_records enable row level security;

-- 7. DOCUMENTS
-- General documents library (Horse passports, certificates, contracts, vet papers)
create table public.documents (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now() not null,
    name text not null,
    url text not null, -- Cloudinary Document Link
    file_type text, -- pdf, docx, jpeg
    horse_id uuid references public.horses(id) on delete cascade,
    uploaded_by uuid references public.profiles(id) on delete set null
);

-- Enable RLS for documents
alter table public.documents enable row level security;

-- 8. MARES BREEDING TRACKING
-- Tracks breeding cycles and statuses of Mares in the breeding module
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

-- Enable RLS for mares_breeding
alter table public.mares_breeding enable row level security;

-- 9. EMBRYOS
-- Advanced breeding: tracks flushed/frozen/transferred embryos
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

-- Enable RLS for embryos
alter table public.embryos enable row level security;

-- 10. CONTACTS / CLIENTS
-- Stable contacts: owners, clients, veterinarians, farriers, riders
create table public.contacts (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now() not null,
    name text not null,
    email text,
    phone text,
    role text not null check (role in ('owner', 'client', 'vet', 'farrier', 'rider', 'supplier', 'other')),
    notes text
);

-- Enable RLS for contacts
alter table public.contacts enable row level security;

-- 11. STABLE SUPPLIES / SHOPPING LIST
-- Tracks supplies needed by grooms (bedding, feed, tools, medical supplies)
create table public.supplies_needed (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now() not null,
    item_name text not null,
    quantity text, -- e.g. "5 bags", "2 bottles"
    requested_by text, -- name of the groom (e.g. Kyara, Christina)
    status text not null default 'pending' check (status in ('pending', 'purchased')),
    notes text,
    completed_at timestamptz,
    completed_by uuid references public.profiles(id) on delete set null
);

-- Enable RLS for supplies_needed
alter table public.supplies_needed enable row level security;


-- ============================================================
-- Row-Level Security (RLS) Basic Policies
-- (Allows reading and writing to authenticated users of the app)
-- ============================================================

-- Simple policy for authenticated users: they can do all actions (CRUD) on all tables.
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


-- ============================================================
-- Triggers for Automatic User Profile Creation
-- ============================================================

-- Function to handle new registered users in Supabase Auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, role, perms)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    'roleStaff', -- default role
    array['permHorses', 'permCalendar', 'permTasks', 'permFeeding']::text[] -- default basic permissions
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to execute when a user signs up
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
