-- ============================================================
-- courses table
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

create table if not exists public.courses (
  id            uuid primary key default gen_random_uuid(),
  title         text        not null,
  progress      integer     not null default 0 check (progress between 0 and 100),
  icon_name     text        not null default 'BookOpen',
  instructor    text        not null default '',
  color         text        not null default '#10b981',
  category      text        not null default 'General',
  total_lessons integer     not null default 0,
  completed_lessons integer not null default 0,
  created_at    timestamptz not null default now()
);

-- Enable Row Level Security (anon read is fine for a public dashboard)
alter table public.courses enable row level security;

create policy "anyone can read courses"
  on public.courses for select
  using (true);

-- ── Seed data ────────────────────────────────────────────────
insert into public.courses
  (id, title, progress, icon_name, instructor, color, category, total_lessons, completed_lessons)
values
  (
    gen_random_uuid(),
    'Advanced Algorithms',
    72,
    'Brain',
    'Dr. Sarah Chen',
    '#10b981',
    'Computer Science',
    48,
    35
  ),
  (
    gen_random_uuid(),
    'Quantum Mechanics',
    45,
    'Atom',
    'Prof. James Okafor',
    '#06b6d4',
    'Physics',
    36,
    16
  ),
  (
    gen_random_uuid(),
    'Machine Learning Ops',
    88,
    'Cpu',
    'Dr. Leila Hassan',
    '#8b5cf6',
    'Data Science',
    52,
    46
  ),
  (
    gen_random_uuid(),
    'Distributed Systems',
    31,
    'Network',
    'Prof. Marco Silva',
    '#f59e0b',
    'Systems',
    40,
    12
  );
