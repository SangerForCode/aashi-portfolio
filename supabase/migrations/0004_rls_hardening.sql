-- Phase 1: Limit direct access to the RLS helper and avoid per-row auth lookup.

revoke all on function public.is_admin() from public;
revoke all on function public.is_admin() from anon;
grant execute on function public.is_admin() to authenticated;

drop policy if exists "admin read own row" on public.admin_users;
create policy "admin read own row" on public.admin_users
    for select to authenticated
    using (id = (select auth.uid()));
