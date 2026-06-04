-- Migration v7: Map Builder (Stalls)
-- Voegt de benodigde kolommen toe aan stalls voor de Stable Map Builder

ALTER TABLE public.stalls ADD COLUMN IF NOT EXISTS location_id bigint references public.locations on delete cascade;
ALTER TABLE public.stalls ADD COLUMN IF NOT EXISTS grid_x integer default 0;
ALTER TABLE public.stalls ADD COLUMN IF NOT EXISTS grid_y integer default 0;
ALTER TABLE public.stalls ADD COLUMN IF NOT EXISTS width integer default 2;
ALTER TABLE public.stalls ADD COLUMN IF NOT EXISTS height integer default 2;
