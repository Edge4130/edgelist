-- EdgeList, step 4: make the old WingList and BeerList tables read-only backups.
-- Removes every existing rule on ratings and beer_pours, then allows reading only.
-- Nothing is deleted. The old sites can still display data but can no longer add, edit or delete.

do $$
declare p record;
begin
  for p in select policyname, tablename from pg_policies
           where schemaname = 'public' and tablename in ('ratings', 'beer_pours')
  loop
    execute format('drop policy %I on public.%I', p.policyname, p.tablename);
  end loop;
end $$;

alter table public.ratings enable row level security;
alter table public.beer_pours enable row level security;
create policy "read-only backup" on public.ratings for select using (true);
create policy "read-only backup" on public.beer_pours for select using (true);

-- Check: should list exactly two rules, both "read-only backup" for SELECT.
select tablename, policyname, cmd from pg_policies
where schemaname = 'public' and tablename in ('ratings', 'beer_pours')
order by tablename;
