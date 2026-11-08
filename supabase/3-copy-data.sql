-- EdgeList, step 3: copy WingList and BeerList data into entries.
-- Copy only: ratings and beer_pours are left untouched as backups.
-- Safe to run again: rows already copied are skipped, so a second run
-- right before switching a site over picks up anything added since.

-- WingList (ratings -> entries, topic 'wings')
insert into public.entries (id, topic, created_at, updated_at, item_name, reviewer, entry_date, address, lat, lng, photo, style, total, comments, answers, config_version)
select
  r.id,
  'wings',
  to_timestamp(r.created_at / 1000.0),
  to_timestamp(r.created_at / 1000.0),
  r.restaurant,
  r.reviewer,
  case when r.date ~ '^\d{4}-\d{2}-\d{2}$' then r.date::date end,
  r.address,
  r.lat, r.lng,
  r.photo,
  r.style,
  r.total,
  r.comments,
  jsonb_build_object('scores', r.scores, 'heat', r.heat, 'order_again', r.order_again, 'style_other', r.style_other),
  1
from public.ratings r
on conflict (id) do nothing;

-- BeerList (beer_pours -> entries, topic 'beer')
insert into public.entries (id, topic, created_at, updated_at, item_name, maker, entry_date, place_name, lat, lng, photo, style, total, comments, answers, config_version)
select
  b.id::text,
  'beer',
  b.created_at,
  b.updated_at,
  b.beer_name,
  b.brewery,
  b.created_at::date,
  b.place_name,
  b.lat, b.lng,
  b.photo,
  b.style_name,
  b.total,
  b.comments,
  jsonb_build_object('style_number', b.style_number, 'style_variant', b.style_variant, 'serving', b.serving, 'sections', b.sections, 'flaws', b.flaws),
  1
from public.beer_pours b
on conflict (id) do nothing;

-- Check: the two numbers on each row should match.
select 'wings' as topic, (select count(*) from public.ratings) as original, (select count(*) from public.entries where topic = 'wings') as copied
union all
select 'beer', (select count(*) from public.beer_pours), (select count(*) from public.entries where topic = 'beer');
