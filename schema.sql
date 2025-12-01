-- UUID 확장 기능 활성화 (ID 생성을 위해 필요)
create extension if not exists "uuid-ossp";

-- 멤버 테이블 생성
create table if not exists members (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  status text not null default 'ALIVE', -- 'ALIVE'(조원) 또는 'ELIMINATED'(탈락)
  absent_count int default 0,
  missed_assignment_count int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 설정 테이블 생성 (단일 행만 존재)
create table if not exists settings (
  id int primary key default 1,
  team_name text default '우리 조',
  discord_webhook_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 기본 설정값 삽입 (없을 경우에만)
insert into settings (id, team_name)
values (1, '우리 조')
on conflict (id) do nothing;
