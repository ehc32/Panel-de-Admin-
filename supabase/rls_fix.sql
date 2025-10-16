-- Fix RLS so el admin vea todo y solo admin pueda escribir.
-- 1) Borra la policy anterior si existe
DROP POLICY IF EXISTS cotizaciones_admin_all ON public.cotizaciones;

-- 2) Permitir leer a cualquier usuario autenticado
CREATE POLICY cotizaciones_read_all
ON public.cotizaciones
FOR SELECT
USING ( auth.role() = 'authenticated' );

-- 3) Solo admin puede insertar, actualizar y eliminar
CREATE POLICY cotizaciones_write_admin_insert
ON public.cotizaciones
FOR INSERT
WITH CHECK ( (auth.jwt() ->> 'email') = current_setting('app.admin_email', true) );

CREATE POLICY cotizaciones_write_admin_update
ON public.cotizaciones
FOR UPDATE
USING ( (auth.jwt() ->> 'email') = current_setting('app.admin_email', true) )
WITH CHECK ( (auth.jwt() ->> 'email') = current_setting('app.admin_email', true) );

CREATE POLICY cotizaciones_write_admin_delete
ON public.cotizaciones
FOR DELETE
USING ( (auth.jwt() ->> 'email') = current_setting('app.admin_email', true) );

-- 4) Establece el email del admin en la sesión SQL antes de probar:
--    Reemplaza por tu correo admin real (el que usas en Supabase Auth)
-- select set_config('app.admin_email', 'admin@example.com', false);
