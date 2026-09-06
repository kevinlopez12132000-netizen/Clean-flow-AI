-- CleanFlow-AI multi-tenant structure: businesses, business_members, and
-- business-scoped RLS across clients/crews/jobs/payments.
--
-- Assumes 0001_init.sql has been applied and its tables are still empty
-- (no real client/crew/job/payment data yet) — this migration adds
-- business_id as NOT NULL directly rather than backfilling existing rows.
-- If you already have rows in those tables, backfill business_id manually
-- before running this migration.

create table if not exists businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  phone text not null,
  city text not null,
  service_area text not null,
  cleaning_type text not null check (cleaning_type in ('residencial', 'comercial', 'ambas')),
  created_at timestamptz not null default now()
);

create table if not exists business_members (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null default 'owner' check (role in ('owner', 'member')),
  created_at timestamptz not null default now(),
  unique (business_id, user_id)
);

create index if not exists business_members_user_id_idx on business_members (user_id);

-- Auto-enroll the creator of a business as its owner member. This is the
-- only way business_members gets populated for now (no INSERT policy is
-- defined below) — enough until an "invite teammate" flow exists.
create or replace function public.handle_new_business()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into business_members (business_id, user_id, role)
  values (new.id, new.owner_id, 'owner');
  return new;
end;
$$;

drop trigger if exists on_business_created on businesses;
create trigger on_business_created
  after insert on businesses
  for each row execute function public.handle_new_business();

-- Security-definer helper so RLS policies can check membership without a
-- self-referential subquery on business_members, which would otherwise
-- trigger "infinite recursion detected in policy".
create or replace function public.is_business_member(target_business_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from business_members
    where business_id = target_business_id
      and user_id = auth.uid()
  );
$$;

alter table businesses enable row level security;
alter table business_members enable row level security;

drop policy if exists "Members can view their businesses" on businesses;
create policy "Members can view their businesses" on businesses
  for select using (is_business_member(id));

drop policy if exists "Users can create their own business" on businesses;
create policy "Users can create their own business" on businesses
  for insert with check (owner_id = auth.uid());

drop policy if exists "Members can update their businesses" on businesses;
create policy "Members can update their businesses" on businesses
  for update using (is_business_member(id)) with check (is_business_member(id));

drop policy if exists "Users can view their own membership rows" on business_members;
create policy "Users can view their own membership rows" on business_members
  for select using (user_id = auth.uid());

-- Add business_id to existing domain tables.
alter table clients add column if not exists business_id uuid references businesses (id) on delete cascade;
alter table crews add column if not exists business_id uuid references businesses (id) on delete cascade;
alter table jobs add column if not exists business_id uuid references businesses (id) on delete cascade;
alter table payments add column if not exists business_id uuid references businesses (id) on delete cascade;

alter table clients alter column business_id set not null;
alter table crews alter column business_id set not null;
alter table jobs alter column business_id set not null;
alter table payments alter column business_id set not null;

create index if not exists clients_business_id_idx on clients (business_id);
create index if not exists crews_business_id_idx on crews (business_id);
create index if not exists jobs_business_id_idx on jobs (business_id);
create index if not exists payments_business_id_idx on payments (business_id);

-- Replace the permissive "any authenticated user" policies from 0001 with
-- business-scoped ones. RLS is the source of truth for isolation — the
-- app also filters by business_id explicitly, but must never rely on that
-- filtering alone.
drop policy if exists "Authenticated users can manage clients" on clients;
create policy "Business members can manage their clients" on clients
  for all using (is_business_member(business_id)) with check (is_business_member(business_id));

drop policy if exists "Authenticated users can manage crews" on crews;
create policy "Business members can manage their crews" on crews
  for all using (is_business_member(business_id)) with check (is_business_member(business_id));

drop policy if exists "Authenticated users can manage jobs" on jobs;
create policy "Business members can manage their jobs" on jobs
  for all using (is_business_member(business_id)) with check (is_business_member(business_id));

drop policy if exists "Authenticated users can manage payments" on payments;
create policy "Business members can manage their payments" on payments
  for all using (is_business_member(business_id)) with check (is_business_member(business_id));
