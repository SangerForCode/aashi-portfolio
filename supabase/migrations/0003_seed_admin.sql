-- Phase 1: Admin seed (bootstrap)
--
-- Both Auth accounts that exist at application time have been explicitly
-- approved as admins. The count guard prevents accidentally granting access to
-- an unexpected account. Auth IDs are selected from auth.users, not hardcoded.

do $seed_admin$
declare
    auth_user_count bigint;
begin
    select count(*) into auth_user_count from auth.users;

    if auth_user_count <> 2 then
        raise exception 'Expected exactly two approved Supabase Auth users; found %', auth_user_count;
    end if;

    insert into public.admin_users (id, role)
    select id, 'owner'
    from auth.users
    on conflict (id) do update set role = excluded.role;
end
$seed_admin$;

-- Once the owner is seeded, additional editors can be added by the owner from
-- the admin UI (subject to the admin manage policies).
