-- EdgeList, step 2: mark your login as the owner.
-- First create your user in Supabase: Authentication > Users > Add user > Create new user
-- (check "Auto Confirm User"). Then put that same email below and run this.

insert into public.edgelist_admins (user_id)
select id from auth.users where email = 'daniel.edgerton@gmail.com'
on conflict do nothing;

-- Should return exactly one row with your email:
select u.email from public.edgelist_admins a join auth.users u on u.id = a.user_id;
