-- Create table cotizaciones
create table if not exists public.cotizaciones (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  telefono text not null,
  correo text not null,
  fecha text,
  area_total numeric,
  subtotal_sin_iva numeric,
  iva_amount numeric,
  total_general numeric,
  costo_por_m2 numeric,
  costo_construccion numeric,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.cotizaciones enable row level security;

-- Allow only admin email to access (replace with your admin email)
create policy cotizaciones_admin_all
on public.cotizaciones
for all
using ( auth.email() = current_setting('app.admin_email', true) )
with check ( auth.email() = current_setting('app.admin_email', true) );

-- Set the admin email at runtime in your SQL console:
-- select set_config('app.admin_email', 'admin@example.com', false);
