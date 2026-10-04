-- Phase 1: Schema
-- Creates the CMS content tables in the public schema.

create table if not exists public.admin_users (
    id uuid primary key references auth.users(id) on delete cascade,
    role text not null default 'owner' check (role in ('owner', 'editor')),
    created_at timestamptz not null default now()
);

create table if not exists public.site_content (
    id uuid primary key default gen_random_uuid(),
    key text unique not null,
    value text not null,
    "group" text not null,
    is_public boolean not null default false,
    updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
    id uuid primary key default gen_random_uuid(),
    key text unique not null,
    value text not null,
    is_public boolean not null default false,
    updated_at timestamptz not null default now()
);

create table if not exists public.research_projects (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    slug text unique not null,
    description text,
    supervisor text,
    project_focus text,
    enrolment_id text,
    abstract text,
    highlights jsonb not null default '[]'::jsonb,
    pdf_path text,
    sort_order int not null default 0,
    published boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.clinical_duties (
    id uuid primary key default gen_random_uuid(),
    key text unique not null,
    label text not null,
    title text not null,
    highlight text,
    bullets jsonb not null default '[]'::jsonb,
    quote text,
    sort_order int not null default 0,
    published boolean not null default true
);

create table if not exists public.contact_links (
    id uuid primary key default gen_random_uuid(),
    label text not null,
    type text not null check (type in ('email', 'url')),
    value text not null,
    sort_order int not null default 0,
    published boolean not null default true
);

create table if not exists public.poems (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    slug text unique not null,
    excerpt text,
    content text not null,
    status text not null default 'draft' check (status in ('draft', 'published')),
    published_at timestamptz,
    tags jsonb not null default '[]'::jsonb,
    sort_order int not null default 0,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);
