-- ============================================================
-- 20. HORSE TEMPERATURES
-- ============================================================
create table if not exists public.horse_temperatures (
    id bigserial primary key,
    created_at timestamptz default now() not null,
    horse_id uuid references public.horses on delete cascade not null,
    temperature numeric(4,1) not null,
    measured_at timestamptz default now() not null,
    notes text
);
alter table public.horse_temperatures enable row level security;
drop policy if exists "Allow authenticated CRUD" on public.horse_temperatures;
create policy "Allow authenticated CRUD" on public.horse_temperatures for all using (auth.role() in ('authenticated','anon'));
