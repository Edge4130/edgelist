-- EdgeList, step 5: topics live in the database, edited by the Topic Builder.
-- Run once in the SQL Editor. Then run 6-seed-topics.sql to load WingList and BeerList.

create table if not exists public.topics (
  slug text primary key,                       -- 'wings', 'beer' ... matches VITE_TOPIC
  draft jsonb not null,                        -- what you're editing in the builder
  published jsonb,                             -- what the live app uses
  published_version integer not null default 0,
  archived boolean not null default false,
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create table if not exists public.topic_versions (
  id bigserial primary key,
  slug text not null references public.topics (slug) on delete cascade,
  version integer not null,
  config jsonb not null,
  published_at timestamptz not null default now(),
  unique (slug, version)
);

-- Only the owner can see or change topics directly. The apps read the published
-- config through get_published_topic(), which never exposes drafts.
alter table public.topics enable row level security;
alter table public.topic_versions enable row level security;
drop policy if exists "owner manages topics" on public.topics;
drop policy if exists "owner reads versions" on public.topic_versions;
create policy "owner manages topics" on public.topics for all using (public.is_edgelist_admin()) with check (public.is_edgelist_admin());
create policy "owner reads versions" on public.topic_versions for select using (public.is_edgelist_admin());

create or replace function public.get_published_topic(p_slug text)
returns jsonb language sql stable security definer set search_path = public as $$
  select case when published is null then null
              else published || jsonb_build_object('_version', published_version) end
  from public.topics where slug = p_slug and archived = false;
$$;
grant execute on function public.get_published_topic(text) to anon, authenticated;

-- Publish: copies the draft live and saves it as a numbered version, in one step.
create or replace function public.publish_topic(p_slug text)
returns integer language plpgsql security definer set search_path = public as $$
declare v integer;
begin
  if not public.is_edgelist_admin() then raise exception 'Only the owner can publish'; end if;
  update public.topics
     set published = draft, published_version = published_version + 1, published_at = now(), updated_at = now()
   where slug = p_slug
   returning published_version into v;
  if v is null then raise exception 'No topic named %', p_slug; end if;
  insert into public.topic_versions (slug, version, config) select slug, published_version, published from public.topics where slug = p_slug;
  return v;
end $$;
grant execute on function public.publish_topic(text) to authenticated;

-- Restore: puts an older version back into the draft, ready to review and publish.
create or replace function public.restore_topic_version(p_slug text, p_version integer)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_edgelist_admin() then raise exception 'Only the owner can restore'; end if;
  update public.topics t set draft = v.config, updated_at = now()
    from public.topic_versions v
   where t.slug = p_slug and v.slug = p_slug and v.version = p_version;
  if not found then raise exception 'Version % not found for %', p_version, p_slug; end if;
end $$;
grant execute on function public.restore_topic_version(text, integer) to authenticated;
