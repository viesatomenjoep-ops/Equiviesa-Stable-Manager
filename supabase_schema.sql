-- ==========================================
-- EQUIVESA - Supabase Database Schema
-- Volledig idempotent: veilig te her-uitvoeren
-- Gegenereerd: 2026-06-04
-- ==========================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- 1. PROFILES / USERS
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
    breed text,
    discipline text,
    horse_type text,
    sire_id uuid references public.horses(id) on delete set null,
    dam_id uuid references public.horses(id) on delete set null,
    sire_name text,
    dam_name text
);
create index if not exists horses_name_idx on public.horses (name);
create index if not exists horses_archived_idx on public.horses (archived);
alter table public.horses enable row level security;

-- ============================================================
-- 3. FEEDING SCHEDULES
-- ============================================================
create table if not exists public.feed_schedules (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now() not null,
    horse_id uuid references public.horses(id) on delete cascade not null,
    slot text not null check (slot in ('morning', 'noon', 'evening', 'night')),
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
    start_time time,
    end_time time,
    is_completed boolean not null default false,
    category text not null check (category in ('horse', 'general')),
    horse_id uuid references public.horses(id) on delete cascade,
    assigned_to uuid references public.profiles(id) on delete set null,
    location text,
    photo_url text
);
create index if not exists tasks_due_date_idx on public.tasks (due_date);
create index if not exists tasks_is_completed_idx on public.tasks (is_completed);
alter table public.tasks enable row level security;

-- Voeg ontbrekende kolommen toe als ze nog niet bestaan
alter table public.tasks add column if not exists location text;
alter table public.tasks add column if not exists photo_url text;

-- ============================================================
-- 6. HEALTH RECORDS
-- ============================================================
create table if not exists public.health_records (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now() not null,
    horse_id uuid references public.horses(id) on delete cascade not null,
    category text not null check (category in ('appointments', 'farrier', 'deworming', 'vaccinations', 'generalCare', 'treatments', 'dental', 'medication')),
    scheduled_date date not null,
    completed boolean not null default false,
    notes text,
    performed_by text,
    cost numeric(12, 2),
    photo_url text,
    transaction_id uuid references public.transactions(id) on delete set null
);
create index if not exists health_records_horse_category_idx on public.health_records (horse_id, category);
alter table public.health_records enable row level security;

-- Voeg ontbrekende kolom toe als die nog niet bestaat
alter table public.health_records add column if not exists photo_url text;

-- ============================================================
-- 7. DOCUMENTS
-- ============================================================
create table if not exists public.documents (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now() not null,
    name text not null,
    url text not null,
    file_type text,
    category text not null default 'other' check (category in (
        'passport', 'vaccination', 'vet_report', 'xray', 'insurance',
        'contract', 'invoice', 'registration', 'pedigree', 'sales_photo',
        'sales_video', 'competition', 'training', 'farrier_report',
        'dental_report', 'transport', 'feed_plan', 'other'
    )),
    description text,
    file_size integer,
    horse_id uuid references public.horses(id) on delete cascade,
    uploaded_by uuid references public.profiles(id) on delete set null
);
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
    stallion_studbook text,
    service_date date,
    service_type text check (service_type in ('natural', 'fresh_ai', 'chilled_ai', 'frozen_ai', 'icsi')),
    expected_foal_date date,
    scan_dates text[],
    last_scan_result text,
    vet_name text,
    status text not null check (status in ('inseminated', 'confirmed_pregnant', 'empty', 'aborted', 'foaled', 'resorbed', 'twin_reduced')),
    photo_urls text[],
    passport_url text,
    cost numeric(12, 2),
    notes text
);
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
    stallion_studbook text,
    flush_date date not null,
    grade text,
    recipient_mare_id uuid references public.horses(id) on delete set null,
    recipient_mare_name text,
    transfer_date date,
    status text not null check (status in ('frozen', 'transferred', 'pregnant', 'failed', 'discarded', 'exported')),
    storage_location text,
    storage_tank text,
    straw_number text,
    vet_name text,
    cost numeric(12, 2),
    photo_urls text[],
    notes text
);
create index if not exists embryos_donor_idx on public.embryos (donor_mare_id);
alter table public.embryos enable row level security;

-- ============================================================
-- 10. FOALS
-- ============================================================
create table if not exists public.foals (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now() not null,
    name text not null,
    dam_id uuid references public.horses(id) on delete set null,
    sire_name text,
    birth_date date not null,
    birth_time time,
    sex text check (sex in ('sexMare', 'sexStallion', 'sexGelding')),
    color text,
    markings text,
    birth_weight text,
    birth_type text check (birth_type in ('normal', 'assisted', 'dystocia', 'caesarean')),
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
    status text not null default 'healthy' check (status in ('healthy', 'under_observation', 'sick', 'deceased', 'sold', 'weaned')),
    photo_urls text[],
    passport_url text,
    notes text
);
create index if not exists foals_dam_idx on public.foals (dam_id);
create index if not exists foals_birth_idx on public.foals (birth_date);
alter table public.foals enable row level security;

-- ============================================================
-- 11. LOCATIONS
-- ============================================================
create table if not exists public.locations (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now() not null,
    name text not null,
    location_type text not null check (location_type in (
        'stable', 'paddock', 'arena', 'clinic', 'field',
        'pasture', 'trailer', 'showground', 'breeding_center',
        'quarantine', 'other'
    )),
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
-- 12. CONTACTS
-- ============================================================
create table if not exists public.contacts (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now() not null,
    name text not null,
    company text,
    email text,
    phone text,
    role text not null check (role in (
        'owner', 'client', 'vet', 'farrier', 'rider', 'supplier',
        'dealer', 'trainer', 'breeder', 'transporter', 'insurance',
        'dentist', 'physiotherapist', 'osteopath', 'saddler',
        'photographer', 'sponsor', 'federation', 'stable_hand',
        'manager', 'private', 'other'
    )),
    address text,
    city text,
    country text,
    website text,
    notes text,
    photo_url text
);
alter table public.contacts enable row level security;

-- Voeg photo_url toe als die nog niet bestaat
alter table public.contacts add column if not exists photo_url text;

-- ============================================================
-- 13. SUPPLIES NEEDED
-- ============================================================
create table if not exists public.supplies_needed (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now() not null,
    item_name text not null,
    quantity text,
    requested_by text,
    status text not null default 'pending' check (status in ('pending', 'purchased', 'resolved')),
    report_type text not null default 'supply' check (report_type in ('supply', 'defect')),
    photo_url text,
    amazon_link text,
    notes text,
    completed_at timestamptz,
    completed_by uuid references public.profiles(id) on delete set null
);
alter table public.supplies_needed enable row level security;

-- Voeg ontbrekende kolom toe als die nog niet bestaat
alter table public.supplies_needed add column if not exists amazon_link text;

-- ============================================================
-- 14. CLIENTS
-- ============================================================
create table if not exists public.clients (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now() not null,
    name text not null,
    company text,
    email text,
    phone text,
    client_type text not null check (client_type in (
        'horse_owner', 'boarder', 'lesson_student', 'buyer', 'seller',
        'breeding_client', 'competition_rider', 'training_client',
        'livery', 'half_lease', 'full_lease', 'investor', 'syndicate', 'other'
    )),
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
-- 15. BOOKINGS
-- ============================================================
create table if not exists public.bookings (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now() not null,
    title text not null,
    booking_type text not null check (booking_type in (
        'arena', 'lesson', 'training', 'vet_visit', 'farrier_visit',
        'dentist_visit', 'transport', 'competition', 'clinic', 'viewing',
        'trial_ride', 'photo_shoot', 'stable_visit', 'paddock', 'walker',
        'solarium', 'wash_bay', 'other'
    )),
    booking_date date not null,
    start_time time,
    end_time time,
    horse_id uuid references public.horses(id) on delete set null,
    client_id uuid references public.clients(id) on delete set null,
    contact_id uuid references public.contacts(id) on delete set null,
    status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),
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
-- 16. COMPANY SETTINGS
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
-- 17. INVOICES
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
    status text not null default 'draft' check (status in ('draft', 'sent', 'paid', 'overdue', 'cancelled', 'partial')),
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
-- 18. CATALOG / SALES LISTINGS
-- ============================================================
create table if not exists public.catalog (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now() not null,
    horse_id uuid references public.horses(id) on delete cascade not null,
    title text not null,
    listing_type text not null check (listing_type in (
        'for_sale', 'for_lease', 'stud_service', 'broodmare', 'auction',
        'free_lease', 'half_lease', 'retirement', 'adoption', 'other'
    )),
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
    status text not null default 'active' check (status in ('active', 'sold', 'reserved', 'withdrawn', 'expired')),
    featured boolean not null default false,
    views_count integer default 0,
    published_at timestamptz
);
create index if not exists catalog_status_idx on public.catalog (status);
create index if not exists catalog_horse_idx on public.catalog (horse_id);
create index if not exists catalog_type_idx on public.catalog (listing_type);
alter table public.catalog enable row level security;

-- ============================================================
-- 19. STALLS / BOXES (Map Editor)
-- ============================================================
create table if not exists public.stalls (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now() not null,
    location_id uuid references public.locations(id) on delete cascade not null,
    horse_id uuid references public.horses(id) on delete set null,
    name text not null,
    grid_x integer default 0,
    grid_y integer default 0,
    width integer default 1,
    height integer default 1
);
create index if not exists stalls_location_idx on public.stalls (location_id);
alter table public.stalls enable row level security;

-- ============================================================
-- 20. STAFF MEMBERS
-- ============================================================
create table if not exists public.staff_members (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now() not null,
    name text not null,
    role text not null default 'groom' check (role in (
        'groom', 'stable_manager', 'rider', 'trainer', 'vet', 'farrier',
        'cleaner', 'handyman', 'driver', 'admin', 'other'
    )),
    email text,
    phone text,
    photo_url text,
    available boolean not null default true,  -- beschikbaar vandaag
    availability_note text,                    -- bijv. "Vrij op dinsdag"
    contract_type text check (contract_type in ('fulltime', 'parttime', 'freelance', 'volunteer', 'intern')),
    start_date date,
    notes text
);
alter table public.staff_members enable row level security;

-- ============================================================
-- ROW-LEVEL SECURITY POLICIES
-- Altijd drop + create zodat heruitvoeren nooit faalt
-- ============================================================
drop policy if exists "Allow authenticated CRUD" on public.profiles;
create policy "Allow authenticated CRUD" on public.profiles for all using (auth.role() = 'authenticated');

drop policy if exists "Allow authenticated CRUD" on public.horses;
create policy "Allow authenticated CRUD" on public.horses for all using (auth.role() = 'authenticated');

drop policy if exists "Allow authenticated CRUD" on public.feed_schedules;
create policy "Allow authenticated CRUD" on public.feed_schedules for all using (auth.role() = 'authenticated');

drop policy if exists "Allow authenticated CRUD" on public.transactions;
create policy "Allow authenticated CRUD" on public.transactions for all using (auth.role() = 'authenticated');

drop policy if exists "Allow authenticated CRUD" on public.tasks;
create policy "Allow authenticated CRUD" on public.tasks for all using (auth.role() = 'authenticated');

drop policy if exists "Allow authenticated CRUD" on public.health_records;
create policy "Allow authenticated CRUD" on public.health_records for all using (auth.role() = 'authenticated');

drop policy if exists "Allow authenticated CRUD" on public.documents;
create policy "Allow authenticated CRUD" on public.documents for all using (auth.role() = 'authenticated');

drop policy if exists "Allow authenticated CRUD" on public.mares_breeding;
create policy "Allow authenticated CRUD" on public.mares_breeding for all using (auth.role() = 'authenticated');

drop policy if exists "Allow authenticated CRUD" on public.embryos;
create policy "Allow authenticated CRUD" on public.embryos for all using (auth.role() = 'authenticated');

drop policy if exists "Allow authenticated CRUD" on public.foals;
create policy "Allow authenticated CRUD" on public.foals for all using (auth.role() = 'authenticated');

drop policy if exists "Allow authenticated CRUD" on public.locations;
create policy "Allow authenticated CRUD" on public.locations for all using (auth.role() = 'authenticated');

drop policy if exists "Allow authenticated CRUD" on public.contacts;
create policy "Allow authenticated CRUD" on public.contacts for all using (auth.role() = 'authenticated');

drop policy if exists "Allow authenticated CRUD" on public.supplies_needed;
create policy "Allow authenticated CRUD" on public.supplies_needed for all using (auth.role() = 'authenticated');

drop policy if exists "Allow authenticated CRUD" on public.clients;
create policy "Allow authenticated CRUD" on public.clients for all using (auth.role() = 'authenticated');

drop policy if exists "Allow authenticated CRUD" on public.bookings;
create policy "Allow authenticated CRUD" on public.bookings for all using (auth.role() = 'authenticated');

drop policy if exists "Allow authenticated CRUD" on public.company_settings;
create policy "Allow authenticated CRUD" on public.company_settings for all using (auth.role() = 'authenticated');

drop policy if exists "Allow authenticated CRUD" on public.invoices;
create policy "Allow authenticated CRUD" on public.invoices for all using (auth.role() = 'authenticated');

drop policy if exists "Allow authenticated CRUD" on public.catalog;
create policy "Allow authenticated CRUD" on public.catalog for all using (auth.role() = 'authenticated');

drop policy if exists "Allow authenticated CRUD" on public.stalls;
create policy "Allow authenticated CRUD" on public.stalls for all using (auth.role() = 'authenticated');

drop policy if exists "Allow authenticated CRUD" on public.staff_members;
create policy "Allow authenticated CRUD" on public.staff_members for all using (auth.role() = 'authenticated');

-- ============================================================
-- TRIGGER: Automatisch profiel aanmaken bij nieuwe gebruiker
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
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- KLAAR ✓
-- Alle tabellen zijn aangemaakt of bijgewerkt.
-- Alle policies zijn opnieuw aangemaakt zonder conflicten.
-- ============================================================
