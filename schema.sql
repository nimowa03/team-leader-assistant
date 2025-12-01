-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create members table
create table if not exists members (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  status text not null default 'ALIVE', -- 'ALIVE' or 'ELIMINATED'
  absent_count int default 0,
  missed_assignment_count int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create settings table (single row)
create table if not exists settings (
  id int primary key default 1,
  team_name text default '우리 조',
  discord_webhook_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Insert default settings if not exists
insert into settings (id, team_name)
values (1, '우리 조')
on conflict (id) do nothing;
