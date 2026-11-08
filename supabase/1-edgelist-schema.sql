-- EdgeList, step 1: new tables. Run once in the SQL Editor of the WingList Supabase project.
-- Creates new tables only. Does not touch ratings (WingList) or beer_pours (BeerList).

create table if not exists public.entries (
  id text primary key default gen_random_uuid()::text,
  topic text not null,                       -- 'wings', 'beer', ...
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  item_name text not null,                   -- restaurant, beer, whiskey...
  maker text,                                -- brewery, distillery
  reviewer text,
  entry_date date,
  place_name text,
  address text,
  lat double precision,
  lng double precision,
  photo text,
  style text,
  total integer,
  comments text,
  answers jsonb not null default '{}'::jsonb, -- everything topic-specific (scores, heat, flaws...)
  config_version integer not null default 1
);
create index if not exists entries_topic_created_idx on public.entries (topic, created_at desc);

-- Who counts as the owner. Only you.
create table if not exists public.edgelist_admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);

alter table public.edgelist_admins enable row level security;
drop policy if exists "admins see own row" on public.edgelist_admins;
create policy "admins see own row" on public.edgelist_admins for select using (user_id = auth.uid());

create or replace function public.is_edgelist_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.edgelist_admins where user_id = auth.uid());
$$;

alter table public.entries enable row level security;
drop policy if exists "anyone can read entries" on public.entries;
drop policy if exists "anyone can add entries" on public.entries;
drop policy if exists "owner can edit entries" on public.entries;
drop policy if exists "owner can delete entries" on public.entries;
create policy "anyone can read entries"  on public.entries for select using (true);
create policy "anyone can add entries"   on public.entries for insert with check (true);
create policy "owner can edit entries"   on public.entries for update using (public.is_edgelist_admin()) with check (public.is_edgelist_admin());
create policy "owner can delete entries" on public.entries for delete using (public.is_edgelist_admin());
