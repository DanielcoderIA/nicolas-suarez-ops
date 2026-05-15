-- Migration: Expand menu_items.category CHECK constraint
-- Supports La Carreta, Mar y Tierra, and Delica categories
-- Date: 2025-05-14

-- 1. Drop old constraint
ALTER TABLE menu_items DROP CONSTRAINT IF EXISTS menu_items_category_check;

-- 2. Add expanded constraint
ALTER TABLE menu_items ADD CONSTRAINT menu_items_category_check CHECK (
  category IN (
    -- Original
    'entradas','principales','postres','bebidas','catas',
    -- La Carreta
    'especialidades','carnes-maduradas','cortes-especiales','platos-tipicos',
    'cremas-sopas','pollo-cerdo','pescados-mariscos','ensaladas','vegetarianos',
    'hamburguesas','arroces','guarniciones','bebidas-frescas','bebidas-calientes',
    'cocteles','cervezas','licores','menu-infantil',
    -- Mar y Tierra
    'pescados-fritos','pescados-plancha','pescados-marinera','pescados-criolla',
    'cazuelas-sancochos','carnes','adiciones','vinos'
  )
);
