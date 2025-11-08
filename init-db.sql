-- Script de inicialización de PostgreSQL
-- Configuración regional y de formato de fechas

-- Configurar formato de fecha para toda la base de datos
ALTER DATABASE administracion_ganadera SET datestyle = 'ISO, DMY';
ALTER DATABASE administracion_ganadera SET timezone = 'America/Mexico_City';
ALTER DATABASE administracion_ganadera SET lc_time = 'es_ES.UTF-8';

-- Mensaje de confirmación
DO $$
BEGIN
    RAISE NOTICE 'Configuración regional establecida:';
    RAISE NOTICE '  - Formato de fecha: DD/MM/YYYY';
    RAISE NOTICE '  - Formato de hora: 24 horas';
    RAISE NOTICE '  - Zona horaria: America/Mexico_City';
END $$;
