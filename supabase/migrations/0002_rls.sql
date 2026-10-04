-- Phase 1: Row Level Security
-- Enable RLS on all tables, define is_admin() helper, and policies.

-- Helper: true when the current authenticated user is in admin_users.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
    select exists (
        select 1 from public.admin_users where id = auth.uid()
    );
$$;

-- Enable RLS
alter table public.admin_users enable row level security;
alter table public.site_content enable row level security;
alter table public.site_settings enable row level security;
alter table public.research_projects enable row level security;
alter table public.clinical_duties enable row level security;
alter table public.contact_links enable row level security;
alter table public.poems enable row level security;

-- admin_users: an admin can read their own row. No anon access.
drop policy if exists "admin read own row" on public.admin_users;
create policy "admin read own row" on public.admin_users
    for select to authenticated
    using (id = auth.uid());

-- site_content: public read, admin manage
drop policy if exists "public read site_content" on public.site_content;
create policy "public read site_content" on public.site_content
    for select to anon, authenticated using (is_public = true);
drop policy if exists "admin manage site_content" on public.site_content;
create policy "admin manage site_content" on public.site_content
    for all to authenticated
    using (public.is_admin())
    with check (public.is_admin());

-- site_settings: public read, admin manage
drop policy if exists "public read site_settings" on public.site_settings;
create policy "public read site_settings" on public.site_settings
    for select to anon, authenticated using (is_public = true);
drop policy if exists "admin manage site_settings" on public.site_settings;
create policy "admin manage site_settings" on public.site_settings
    for all to authenticated
    using (public.is_admin())
    with check (public.is_admin());

-- research_projects: public read published, admin manage
drop policy if exists "public read published research" on public.research_projects;
create policy "public read published research" on public.research_projects
    for select to anon, authenticated using (published = true);
drop policy if exists "admin manage research" on public.research_projects;
create policy "admin manage research" on public.research_projects
    for all to authenticated
    using (public.is_admin())
    with check (public.is_admin());

-- clinical_duties: public read published, admin manage
drop policy if exists "public read published duties" on public.clinical_duties;
create policy "public read published duties" on public.clinical_duties
    for select to anon, authenticated using (published = true);
drop policy if exists "admin manage duties" on public.clinical_duties;
create policy "admin manage duties" on public.clinical_duties
    for all to authenticated
    using (public.is_admin())
    with check (public.is_admin());

-- contact_links: public read published, admin manage
drop policy if exists "public read published links" on public.contact_links;
create policy "public read published links" on public.contact_links
    for select to anon, authenticated using (published = true);
drop policy if exists "admin manage links" on public.contact_links;
create policy "admin manage links" on public.contact_links
    for all to authenticated
    using (public.is_admin())
    with check (public.is_admin());

-- poems: public read published only, admin manage
drop policy if exists "public read published poems" on public.poems;
create policy "public read published poems" on public.poems
    for select to anon, authenticated using (status = 'published');
drop policy if exists "admin manage poems" on public.poems;
create policy "admin manage poems" on public.poems
    for all to authenticated
    using (public.is_admin())
    with check (public.is_admin());
