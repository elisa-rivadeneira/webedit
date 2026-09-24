-- Copia y pega TODO este archivo en Supabase → SQL Editor → New query → Run.
-- Crea las 3 tablas que necesita el sitio y el lugar donde se guardan las fotos.

-- 1) Contenido del sitio (una sola fila, siempre id = 1)
create table if not exists site_content (
  id integer primary key default 1,
  business_name text not null default '',
  logo_url text not null default '',
  hero_title text not null default '',
  hero_description text not null default '',
  hero_image_url text not null default '',
  promo1_image_url text not null default '',
  promo2_image_url text not null default '',
  footer_tagline text not null default '',
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);

insert into site_content (id, business_name, hero_title, hero_description, footer_tagline)
values (1, 'Mi Negocio', 'Bienvenido a nuestro negocio', 'Cuéntanos qué ofreces en pocas palabras.', 'Gracias por visitarnos.')
on conflict (id) do nothing;

-- 2) Enlaces a redes sociales
create table if not exists social_links (
  platform text primary key,
  url text not null default ''
);

insert into social_links (platform, url) values
  ('whatsapp', ''), ('instagram', ''), ('facebook', ''), ('tiktok', '')
on conflict (platform) do nothing;

-- 3) Usuario administrador (se llena con el script de seed, no aquí)
create table if not exists admin_users (
  id bigserial primary key,
  username text unique not null,
  password_hash text not null
);

-- Seguridad: nadie puede leer/escribir estas tablas directamente desde el navegador.
-- Solo nuestro servidor (con la llave "service role", que nunca viaja al navegador) puede.
alter table site_content enable row level security;
alter table social_links enable row level security;
alter table admin_users enable row level security;

-- 4) Lugar donde se guardan las fotos (logo, imagen principal, promociones)
insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true)
on conflict (id) do nothing;
