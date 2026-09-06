-- CleanFlow-AI initial schema: clients, crews, jobs, payments.

create extension if not exists "pgcrypto";

create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  address text not null,
  lat double precision,
  lng double precision,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists crews (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  members text[] not null default '{}',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients (id) on delete cascade,
  crew_id uuid references crews (id) on delete set null,
  scheduled_at timestamptz not null,
  duration_minutes integer not null default 60,
  status text not null default 'scheduled'
    check (status in ('scheduled', 'in_progress', 'completed', 'canceled')),
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs (id) on delete cascade,
  client_id uuid not null references clients (id) on delete cascade,
  amount_cents integer not null,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'overdue')),
  due_date date not null,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists jobs_scheduled_at_idx on jobs (scheduled_at);
create index if not exists jobs_crew_id_idx on jobs (crew_id);
create index if not exists payments_status_idx on payments (status);

alter table clients enable row level security;
alter table crews enable row level security;
alter table jobs enable row level security;
alter table payments enable row level security;

-- Placeholder policies: any authenticated user can read/write everything.
-- Tighten these once auth/roles (owner, dispatcher, crew member) are defined.
create policy "Authenticated users can manage clients" on clients
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "Authenticated users can manage crews" on crews
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "Authenticated users can manage jobs" on jobs
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "Authenticated users can manage payments" on payments
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
