-- ============ KnownLabs — Supabase schema ============
-- Run this in your Supabase project's SQL Editor (in order).

-- ---------- helpers ----------
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

-- ---------- inquiries ----------
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text, -- whichever of email/phone the visitor gave (contact field is split in JS)
  phone text,
  service text,
  message text not null,
  status text not null default 'new'
    check (status in ('new','read','replied','archived')),
  created_at timestamptz not null default now()
);

-- ---------- projects ----------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  categories text[] not null default '{}',
  image_url text,
  live_url text,
  deliverables text[] not null default '{}',
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists trg_projects_updated on public.projects;
create trigger trg_projects_updated before update on public.projects
  for each row execute function public.handle_updated_at();

-- ---------- services ----------
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  deliverables text[] not null default '{}',
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists trg_services_updated on public.services;
create trigger trg_services_updated before update on public.services
  for each row execute function public.handle_updated_at();

-- ---------- testimonials ----------
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  company text,
  quote text not null,
  rating int not null default 5 check (rating between 1 and 5),
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists trg_testimonials_updated on public.testimonials;
create trigger trg_testimonials_updated before update on public.testimonials
  for each row execute function public.handle_updated_at();

-- ---------- faqs ----------
create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists trg_faqs_updated on public.faqs;
create trigger trg_faqs_updated before update on public.faqs
  for each row execute function public.handle_updated_at();

-- ============ Admin allowlist ============
-- Only users listed here can manage content. Every other authenticated
-- user gets no write access. Add your login user after creating it:
--   insert into public.admin_users (user_id)
--   select id from auth.users where email = 'you@example.com';
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);
alter table public.admin_users enable row level security;
-- No policies on admin_users: direct reads/writes are denied for everyone.
-- Admin checks go through the SECURITY DEFINER function below, which
-- bypasses RLS and avoids infinite recursion.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

-- ============ Row Level Security ============
alter table public.inquiries enable row level security;
alter table public.projects enable row level security;
alter table public.services enable row level security;
alter table public.testimonials enable row level security;
alter table public.faqs enable row level security;

-- public can read published content
drop policy if exists "public read published projects" on public.projects;
create policy "public read published projects" on public.projects
  for select to anon, authenticated using (is_published = true);
drop policy if exists "public read published services" on public.services;
create policy "public read published services" on public.services
  for select to anon, authenticated using (is_published = true);
drop policy if exists "public read published testimonials" on public.testimonials;
create policy "public read published testimonials" on public.testimonials
  for select to anon, authenticated using (is_published = true);
drop policy if exists "public read published faqs" on public.faqs;
create policy "public read published faqs" on public.faqs
  for select to anon, authenticated using (is_published = true);

-- anyone can submit an inquiry; only signed-in admins can read/manage them
drop policy if exists "anon can submit inquiries" on public.inquiries;
create policy "anon can submit inquiries" on public.inquiries
  for insert to anon, authenticated with check (true);

-- signed-in users (admin) get full access everywhere
drop policy if exists "admin full access inquiries" on public.inquiries;
create policy "admin full access inquiries" on public.inquiries
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin full access projects" on public.projects;
create policy "admin full access projects" on public.projects
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin full access services" on public.services;
create policy "admin full access services" on public.services
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin full access testimonials" on public.testimonials;
create policy "admin full access testimonials" on public.testimonials
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin full access faqs" on public.faqs;
create policy "admin full access faqs" on public.faqs
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ============ Storage: site-images bucket ============
insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do nothing;

drop policy if exists "public read site images" on storage.objects;
create policy "public read site images" on storage.objects
  for select to anon, authenticated using (bucket_id = 'site-images');
drop policy if exists "admin upload site images" on storage.objects;
create policy "admin upload site images" on storage.objects
  for insert to authenticated with check (bucket_id = 'site-images' and public.is_admin());
drop policy if exists "admin update site images" on storage.objects;
create policy "admin update site images" on storage.objects
  for update to authenticated using (bucket_id = 'site-images' and public.is_admin());
drop policy if exists "admin delete site images" on storage.objects;
create policy "admin delete site images" on storage.objects
  for delete to authenticated using (bucket_id = 'site-images' and public.is_admin());
