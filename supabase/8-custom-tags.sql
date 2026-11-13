-- EdgeList: which descriptor tags are people using? Run any time (read-only).
-- Tags typed by users that aren't in the suggestion lists show what the lists are missing.
-- Change 'whiskey' to another topic key to check that topic.

select tag, count(*) as times_used
from public.entries e,
     jsonb_each(coalesce(e.answers->'sections', '{}'::jsonb)) as section(key, val),
     jsonb_each(coalesce(section.val->'tags', '{}'::jsonb)) as row_tags(key, list),
     jsonb_array_elements_text(row_tags.list) as tag
where e.topic = 'whiskey'
group by tag
order by times_used desc, tag;
