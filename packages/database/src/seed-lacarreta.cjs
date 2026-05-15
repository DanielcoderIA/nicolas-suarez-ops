
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

const restaurantId = '11111111-1111-1111-1111-111111111111';

const menuData = [
  // ENTRADAS
  { restaurant_id: restaurantId, name: 'Chicharrón con Arepa', description: 'Chicharrón acompañado de arepa con queso doble crema', price: 25000, category: 'entradas', sort_order: 10 },
  { restaurant_id: restaurantId, name: 'Chorizo y Morcilla', description: 'Chorizo antioqueño y morcilla acompañado de arepa con queso doble crema', price: 18000, category: 'entradas', sort_order: 11 },
  { restaurant_id: restaurantId, name: 'Morcilla con Arepa', description: '2 Unidades acompañadas de arepa con queso doble crema', price: 16000, category: 'entradas', sort_order: 12 },
  { restaurant_id: restaurantId, name: 'Chorizo con Arepa', description: '2 Unidades acompañados de arepa con queso doble crema', price: 15000, category: 'entradas', sort_order: 13 },
  { restaurant_id: restaurantId, name: 'Ceviche de Camarón', description: 'A base de salsa roja o rosada', price: 27000, category: 'entradas', sort_order: 14 },
  { restaurant_id: restaurantId, name: 'Patacón Gratinado con Hogao', description: '3 Unidades', price: 12000, category: 'entradas', sort_order: 15 },
  { restaurant_id: restaurantId, name: 'Plátano Maduro con Queso y Salsa de Guayaba', description: '', price: 14000, category: 'entradas', sort_order: 16 },
  { restaurant_id: restaurantId, name: 'Arepa con Queso y Hogao', description: '6 Unidades', price: 11000, category: 'entradas', sort_order: 17 },
  { restaurant_id: restaurantId, name: 'Aguacate a la Parrilla', description: 'Con salsa pico de gallo', price: 16000, category: 'entradas', sort_order: 18 },

  // ESPECIALIDADES
  { restaurant_id: restaurantId, name: 'Lomo al Trapo (600 grs)', description: 'Para compartir, corte de lomo en bloque cubierto en sal, envuelto en lienzo con vino, en término medio', price: 82000, category: 'especialidades', note: 'Vienen con DOS acompañamientos', sort_order: 20 },
  { restaurant_id: restaurantId, name: 'Lomo en Pimienta (550 grs)', description: 'Lomo de res en salsa tres pimientas', price: 72000, category: 'especialidades', note: 'Vienen con DOS acompañamientos', sort_order: 21 },
  { restaurant_id: restaurantId, name: 'Lomo Saltado', description: 'Carne de res, cebolla, ají, vinagre, tomate, perejil y huevo frito', price: 74000, category: 'especialidades', note: 'Vienen con DOS acompañamientos', sort_order: 22 },
  { restaurant_id: restaurantId, name: 'Tomahawk (750 grs)', description: '', price: 89000, category: 'especialidades', note: 'Vienen con DOS acompañamientos', sort_order: 23 },
  { restaurant_id: restaurantId, name: 'Filet Mignon (500 grs)', description: 'Lomo de res con tocineta en salsa champiñón', price: 72000, category: 'especialidades', note: 'Vienen con DOS acompañamientos', sort_order: 24 },
  { restaurant_id: restaurantId, name: 'T-Bone Steak (750 grs)', description: '', price: 90000, category: 'especialidades', note: 'Vienen con DOS acompañamientos', sort_order: 25 },
  { restaurant_id: restaurantId, name: 'Parrillada La Carreta', description: 'Para compartir 2 personas: carne de res (250 grs), lomo de cerdo (250 grs), 2 morcillas, 2 chorizos, chicharrón, papa criolla y arepa', price: 75000, category: 'especialidades', sort_order: 26 },

  // CARNES MADURADAS
  { restaurant_id: restaurantId, name: '1/2 Churrasco (350 grs)', description: '', price: 42000, category: 'carnes-maduradas', note: 'Vienen con DOS acompañamientos', variants: [
    { label: 'Con Champiñón', price: 48000 }, { label: 'Al Pimentón', price: 46000 }, { label: 'Encebollado', price: 46000 }, { label: 'Gratinado', price: 47000 }
  ], sort_order: 30 },
  { restaurant_id: restaurantId, name: 'Churrasco (600 grs)', description: '', price: 68000, category: 'carnes-maduradas', note: 'Vienen con DOS acompañamientos', variants: [
    { label: 'Con Champiñón', price: 74000 }, { label: 'Al Pimentón', price: 72000 }, { label: 'Encebollado', price: 72000 }, { label: 'Gratinado', price: 73000 }
  ], sort_order: 31 },
  { restaurant_id: restaurantId, name: '1/2 Punta de Anca (350 grs)', description: '', price: 47000, category: 'carnes-maduradas', note: 'Vienen con DOS acompañamientos', variants: [
    { label: 'Con Champiñón', price: 53000 }, { label: 'Al Pimentón', price: 51000 }, { label: 'Encebollado', price: 51000 }, { label: 'Gratinado', price: 52000 }
  ], sort_order: 32 },
  { restaurant_id: restaurantId, name: 'Punta de Anca (600 grs)', description: '', price: 78000, category: 'carnes-maduradas', note: 'Vienen con DOS acompañamientos', variants: [
    { label: 'Con Champiñón', price: 85000 }, { label: 'Al Pimentón', price: 83000 }, { label: 'Encebollado', price: 83000 }, { label: 'Gratinado', price: 84000 }
  ], sort_order: 33 },
  { restaurant_id: restaurantId, name: '1/2 Baby Beef (350 grs)', description: '', price: 49000, category: 'carnes-maduradas', note: 'Vienen con DOS acompañamientos', variants: [
    { label: 'Con Champiñón', price: 55000 }, { label: 'Al Pimentón', price: 53000 }, { label: 'Encebollado', price: 53000 }, { label: 'Gratinado', price: 54000 }
  ], sort_order: 34 },
  { restaurant_id: restaurantId, name: 'Baby Beef (500 grs)', description: '', price: 71000, category: 'carnes-maduradas', note: 'Vienen con DOS acompañamientos', variants: [
    { label: 'Con Champiñón', price: 77000 }, { label: 'Al Pimentón', price: 75000 }, { label: 'Encebollado', price: 75000 }, { label: 'Gratinado', price: 76000 }
  ], sort_order: 35 },

  // CORTES ESPECIALES
  { restaurant_id: restaurantId, name: 'Bife de Lomo (600 grs)', description: '', price: 75000, category: 'cortes-especiales', note: 'Vienen con DOS acompañamientos', sort_order: 40 },
  { restaurant_id: restaurantId, name: 'Bife de Punta (600 grs)', description: '', price: 78000, category: 'cortes-especiales', note: 'Vienen con DOS acompañamientos', sort_order: 41 },
  { restaurant_id: restaurantId, name: 'Bife Chorizo (600 grs)', description: '', price: 73000, category: 'cortes-especiales', note: 'Vienen con DOS acompañamientos', sort_order: 42 },

  // PLATOS TÍPICOS
  { restaurant_id: restaurantId, name: 'Bandeja Paisa', description: 'Arroz, frijol, carne molida, huevo frito, arepa, chorizo, plátano maduro, aguacate y chicharrón', price: 36000, category: 'platos-tipicos', sort_order: 50 },
  { restaurant_id: restaurantId, name: 'Ajiaco con Pollo', description: 'Acompañada de arroz, mazorca, 1/4 de pollo y aguacate', price: 35000, category: 'platos-tipicos', sort_order: 51 },

  // CREMAS Y SOPAS
  { restaurant_id: restaurantId, name: 'Crema de Pollo con Champiñones', description: 'Acompañada de pan árabe', price: 18000, category: 'cremas-sopas', sort_order: 60 },
  { restaurant_id: restaurantId, name: 'Crema de Tomate', description: 'Acompañada de pan árabe', price: 16000, category: 'cremas-sopas', sort_order: 61 },
  { restaurant_id: restaurantId, name: 'Taza de Frijol', description: 'Acompañada de arroz blanco', price: 15000, category: 'cremas-sopas', sort_order: 62 },
  { restaurant_id: restaurantId, name: 'Sopa del Día', description: '', price: 15000, category: 'cremas-sopas', sort_order: 63 },

  // POLLO Y CERDO
  { restaurant_id: restaurantId, name: 'Pechuga al Carbón (400 grs)', description: '', price: 40000, category: 'pollo-cerdo', note: 'Vienen con DOS acompañamientos', variants: [
    { label: 'Al Champiñón', price: 47000 }, { label: 'Al Pimentón', price: 45000 }, { label: 'Encebollada', price: 45000 }, { label: 'Gratinada', price: 46000 }
  ], sort_order: 70 },
  { restaurant_id: restaurantId, name: '1/2 Pollo Asado Deshuesado (450 grs)', description: 'Con papa en casco y ensalada tropical', price: 43000, category: 'pollo-cerdo', sort_order: 71 },
  { restaurant_id: restaurantId, name: 'Punta de Anca de Cerdo (500 grs)', description: 'En corte argentino o en mariposa', price: 46000, category: 'pollo-cerdo', note: 'Vienen con DOS acompañamientos', sort_order: 72 },
  { restaurant_id: restaurantId, name: 'Costilla de Cerdo BBQ (500 grs)', description: '', price: 47000, category: 'pollo-cerdo', note: 'Vienen con DOS acompañamientos', sort_order: 73 },

  // PESCADOS Y MARISCOS
  { restaurant_id: restaurantId, name: 'Cezuela de Mariscos', description: 'Acompañada de arroz, patacón y aguacate', price: 46000, category: 'pescados-mariscos', sort_order: 80 },
  { restaurant_id: restaurantId, name: 'Trucha al Carbón (500 grs)', description: 'Acompañada de patacón o papa rustica, arroz y ensaladas', price: 40000, category: 'pescados-mariscos', variants: [
    { label: 'En Salsa Marinera', price: 49000 }, { label: 'Gratinada', price: 46000 }, { label: 'Al Ajillo', price: 47000 }, { label: 'Gratinada y Marinera', price: 53000 }
  ], sort_order: 81 },
  { restaurant_id: restaurantId, name: 'Salmón al Carbón (300 grs)', description: 'Acompañada de patacón o papa rustica, arroz y ensaladas', price: 45000, category: 'pescados-mariscos', variants: [
    { label: 'En Salsa Marinera', price: 54000 }, { label: 'Gratinada', price: 49000 }, { label: 'Al Ajillo', price: 50000 }, { label: 'Gratinada y Marinera', price: 58000 }
  ], sort_order: 82 },
  { restaurant_id: restaurantId, name: 'Mojarra Frita (600 grs)', description: 'Acompañada de patacón o papa rustica, arroz y ensaladas', price: 40000, category: 'pescados-mariscos', sort_order: 83 },
  { restaurant_id: restaurantId, name: 'Paella Mediterránea', description: 'Anillos de calamar, camarones, pulpo, mejillones, almejas, pollo y cerdo, acompañada de pan al ajillo o patacón', price: 45000, category: 'pescados-mariscos', sort_order: 84 },
  { restaurant_id: restaurantId, name: 'Hamburguesa de Salmón (200 grs)', description: 'Con salsa marinera, lechuga, tomate y queso, acompañada de papa rustica', price: 40000, category: 'pescados-mariscos', sort_order: 85 },

  // ENSALADAS
  { restaurant_id: restaurantId, name: 'Ensalada con Pechuga y Tocineta', description: 'Pepino, zanahoria, lechuga, cebolla, tomate cherry, trozos de pechuga y tocineta', price: 30000, category: 'ensaladas', sort_order: 90 },
  { restaurant_id: restaurantId, name: 'Ensalada con Camarones', description: '15 unidades de camarones, pepino, zanahoria, lechuga, cebolla, tomate cherry', price: 38000, category: 'ensaladas', sort_order: 91 },
  { restaurant_id: restaurantId, name: 'Ensalada de la Casa', description: 'Pepino, zanahoria, lechuga, cebolla, tomate cherry con rollos de queso tipo mozarela y aderezo del día', price: 22000, category: 'ensaladas', sort_order: 92 },

  // VEGETARIANOS
  { restaurant_id: restaurantId, name: 'Arroz Vegetariano', description: 'Acompañado de ensalada, patacón y papa rustica', price: 30000, category: 'vegetarianos', sort_order: 100 },
  { restaurant_id: restaurantId, name: 'Patacones con Vegetales Salteadas', description: '3 unidades', price: 38000, category: 'vegetarianos', sort_order: 101 },
  { restaurant_id: restaurantId, name: 'Ensalada Carreta', description: 'Vegetales y champiñones', price: 28000, category: 'vegetarianos', sort_order: 102 },

  // HAMBURGUESAS
  { restaurant_id: restaurantId, name: 'Sabanera Sencilla', description: 'Queso, lechuga y tomate', price: 20000, category: 'hamburguesas', note: '200 grs de carne de res o pollo, acompañadas con papa rustica', sort_order: 110 },
  { restaurant_id: restaurantId, name: 'West Sencilla', description: 'Encebollada con queso, lechuga y tomate', price: 21000, category: 'hamburguesas', note: '200 grs de carne de res o pollo, acompañadas con papa rustica', sort_order: 111 },
  { restaurant_id: restaurantId, name: 'Ranch Sencilla', description: 'Hogao, queso, lechuga y tomate', price: 22000, category: 'hamburguesas', note: '200 grs de carne de res o pollo, acompañadas con papa rustica', sort_order: 112 },
  { restaurant_id: restaurantId, name: 'Cowboy Sencilla', description: 'Salsa con champiñón, queso, lechuga y tomate', price: 23000, category: 'hamburguesas', note: '200 grs de carne de res o pollo, acompañadas con papa rustica', sort_order: 113 },
  { restaurant_id: restaurantId, name: 'Country Sencilla', description: 'Tocineta, queso, lechuga y tomate', price: 22000, category: 'hamburguesas', note: '200 grs de carne de res o pollo, acompañadas con papa rustica', sort_order: 114 },
  { restaurant_id: restaurantId, name: 'Americana Sencilla', description: 'Encebollada, tocineta, queso, lechuga y tomate', price: 23000, category: 'hamburguesas', note: '200 grs de carne de res o pollo, acompañadas con papa rustica', sort_order: 115 },
  { restaurant_id: restaurantId, name: 'Texana Sencilla', description: 'Chorizo, guacamole, queso, lechuga y tomate', price: 27000, category: 'hamburguesas', note: '200 grs de carne de res o pollo, acompañadas con papa rustica', sort_order: 116 },
  { restaurant_id: restaurantId, name: 'Carreta Sencilla', description: 'Salsa con champiñón, tocineta, queso, lechuga y tomate', price: 25000, category: 'hamburguesas', note: '200 grs de carne de res o pollo, acompañadas con papa rustica', sort_order: 117 },
  
  { restaurant_id: restaurantId, name: 'Sabanera Doble', description: 'Queso, lechuga y tomate', price: 29000, category: 'hamburguesas', note: 'DOS porciones de 400 grs de carne de res o pollo, con papa rustica', sort_order: 118 },
  { restaurant_id: restaurantId, name: 'West Doble', description: 'Encebollada con queso, lechuga y tomate', price: 32000, category: 'hamburguesas', note: 'DOS porciones de 400 grs de carne de res o pollo, con papa rustica', sort_order: 119 },
  { restaurant_id: restaurantId, name: 'Ranch Doble', description: 'Hogao, queso, lechuga y tomate', price: 33000, category: 'hamburguesas', note: 'DOS porciones de 400 grs de carne de res o pollo, con papa rustica', sort_order: 120 },
  { restaurant_id: restaurantId, name: 'Cowboy Doble', description: 'Salsa con champiñón, queso, lechuga y tomate', price: 35000, category: 'hamburguesas', note: 'DOS porciones de 400 grs de carne de res o pollo, con papa rustica', sort_order: 121 },
  { restaurant_id: restaurantId, name: 'Country Doble', description: 'Tocineta, queso, lechuga y tomate', price: 34000, category: 'hamburguesas', note: 'DOS porciones de 400 grs de carne de res o pollo, con papa rustica', sort_order: 122 },
  { restaurant_id: restaurantId, name: 'Americana Doble', description: 'Encebollada, tocineta, queso, lechuga y tomate', price: 36000, category: 'hamburguesas', note: 'DOS porciones de 400 grs de carne de res o pollo, con papa rustica', sort_order: 123 },
  { restaurant_id: restaurantId, name: 'Texana Doble', description: 'Chorizo, guacamole, queso, lechuga y tomate', price: 38000, category: 'hamburguesas', note: 'DOS porciones de 400 grs de carne de res o pollo, con papa rustica', sort_order: 124 },
  { restaurant_id: restaurantId, name: 'Carreta Doble', description: 'Salsa con champiñón, tocineta, queso, lechuga y tomate', price: 36000, category: 'hamburguesas', note: 'DOS porciones de 400 grs de carne de res o pollo, con papa rustica', sort_order: 125 },

  // ARROCES
  { restaurant_id: restaurantId, name: 'Arroz Marinero', description: 'Arroz con mariscos, zanahoria y arveja, acompañado de papa rustica, patacón y ensalada', price: 38000, category: 'arroces', sort_order: 130 },
  { restaurant_id: restaurantId, name: 'Arroz con Camarones', description: 'Zanahoria y arveja, acompañado de papa rustica, patacón y ensalada', price: 40000, category: 'arroces', sort_order: 131 },
  { restaurant_id: restaurantId, name: 'Arroz Carreta', description: 'Carne de res, pollo, tocineta, zanahoria y arveja, acompañado de papa rustica, patacón y ensalada', price: 35000, category: 'arroces', sort_order: 132 },
  { restaurant_id: restaurantId, name: 'Arroz Mexicano', description: 'Carne de res, pollo, chorizo, cilantro, plátano, zanahoria, arveja y picante al gusto, acompañado de papa rustica, patacón y ensalada', price: 37000, category: 'arroces', sort_order: 133 },

  // GUARNICIONES
  { restaurant_id: restaurantId, name: 'Papa Francesa', description: '', price: 7000, category: 'guarniciones', sort_order: 140 },
  { restaurant_id: restaurantId, name: 'Porción de Yuca', description: '', price: 6000, category: 'guarniciones', sort_order: 141 },
  { restaurant_id: restaurantId, name: 'Porción de Arroz Blanco', description: '', price: 6000, category: 'guarniciones', sort_order: 142 },
  { restaurant_id: restaurantId, name: 'Porción de Ensalada', description: '', price: 6000, category: 'guarniciones', sort_order: 143 },
  { restaurant_id: restaurantId, name: 'Porción de Aguacate', description: '', price: 6000, category: 'guarniciones', sort_order: 144 },
  { restaurant_id: restaurantId, name: 'Porción de Guacamole', description: '', price: 8000, category: 'guarniciones', sort_order: 145 },
  { restaurant_id: restaurantId, name: 'Porción de Hogao', description: '', price: 6000, category: 'guarniciones', sort_order: 146 },
  { restaurant_id: restaurantId, name: 'Papa en Casquito', description: '', price: 7000, category: 'guarniciones', sort_order: 147 },
  { restaurant_id: restaurantId, name: 'Papa Criolla', description: '', price: 8000, category: 'guarniciones', sort_order: 148 },
  { restaurant_id: restaurantId, name: 'Adición Salsa Marinera', description: '', price: 15000, category: 'guarniciones', sort_order: 149 },
  { restaurant_id: restaurantId, name: 'Adición Queso Gratinado', description: '', price: 8000, category: 'guarniciones', sort_order: 150 },
  { restaurant_id: restaurantId, name: 'Adición de Salsa Champiñón', description: '', price: 10000, category: 'guarniciones', sort_order: 151 },
  { restaurant_id: restaurantId, name: 'Adición de Chorizo', description: '', price: 3500, category: 'guarniciones', sort_order: 152 },
  { restaurant_id: restaurantId, name: 'Adición de Tocineta', description: '', price: 8000, category: 'guarniciones', sort_order: 153 },

  // BEBIDAS FRESCAS
  { restaurant_id: restaurantId, name: 'Jugo Natural en Agua', description: 'Mora, fresa, guanábana, maracuyá, mango y lulo', price: 7500, category: 'bebidas-frescas', sort_order: 160 },
  { restaurant_id: restaurantId, name: 'Jugo Natural en Leche', description: 'Mora, fresa, guanábana, maracuyá, mango y lulo', price: 9000, category: 'bebidas-frescas', sort_order: 161 },
  { restaurant_id: restaurantId, name: 'Limonada Natural', description: '', price: 7500, category: 'bebidas-frescas', sort_order: 162 },
  { restaurant_id: restaurantId, name: 'Limonada de Coco', description: '', price: 10000, category: 'bebidas-frescas', sort_order: 163 },
  { restaurant_id: restaurantId, name: 'Limonada de Mango', description: '', price: 9500, category: 'bebidas-frescas', sort_order: 164 },
  { restaurant_id: restaurantId, name: 'Limonada de Mango Biche', description: '', price: 9500, category: 'bebidas-frescas', sort_order: 165 },
  { restaurant_id: restaurantId, name: 'Limonada de Hierbabuena', description: '', price: 9500, category: 'bebidas-frescas', sort_order: 166 },
  { restaurant_id: restaurantId, name: 'Limonada Cerezada', description: '', price: 9500, category: 'bebidas-frescas', sort_order: 167 },
  { restaurant_id: restaurantId, name: 'Milo Frío', description: '', price: 9000, category: 'bebidas-frescas', sort_order: 168 },
  { restaurant_id: restaurantId, name: 'Gaseosa Postobón y Coca-Cola (400 ml)', description: '', price: 5500, category: 'bebidas-frescas', sort_order: 169 },
  { restaurant_id: restaurantId, name: 'Botella de Agua', description: '', price: 4000, category: 'bebidas-frescas', sort_order: 170 },
  { restaurant_id: restaurantId, name: 'Botella de Agua con Gas', description: '', price: 4500, category: 'bebidas-frescas', sort_order: 171 },
  { restaurant_id: restaurantId, name: 'Adición de Michelada', description: '', price: 4000, category: 'bebidas-frescas', sort_order: 172 },
  { restaurant_id: restaurantId, name: 'Shot de Zumo de Limón', description: '', price: 3000, category: 'bebidas-frescas', sort_order: 173 },

  // BEBIDAS CALIENTES
  { restaurant_id: restaurantId, name: 'Expreso', description: '', price: 4500, category: 'bebidas-calientes', sort_order: 180 },
  { restaurant_id: restaurantId, name: 'Latte', description: '', price: 6500, category: 'bebidas-calientes', sort_order: 181 },
  { restaurant_id: restaurantId, name: 'Americano', description: '', price: 5000, category: 'bebidas-calientes', sort_order: 182 },
  { restaurant_id: restaurantId, name: 'Mocca', description: '', price: 8000, category: 'bebidas-calientes', sort_order: 183 },
  { restaurant_id: restaurantId, name: 'Capuccino', description: '', price: 7000, category: 'bebidas-calientes', sort_order: 184 },
  { restaurant_id: restaurantId, name: 'Milo', description: '', price: 7500, category: 'bebidas-calientes', sort_order: 185 },
  { restaurant_id: restaurantId, name: 'Carajillo con Ron o Aguardiente', description: '', price: 10000, category: 'bebidas-calientes', sort_order: 186 },
  { restaurant_id: restaurantId, name: 'Canelazo con Ron o Aguardiente', description: '', price: 12000, category: 'bebidas-calientes', sort_order: 187 },
  { restaurant_id: restaurantId, name: 'Aromática', description: '', price: 5000, category: 'bebidas-calientes', sort_order: 188 },
  { restaurant_id: restaurantId, name: 'Aromática de Frutas', description: '', price: 7000, category: 'bebidas-calientes', sort_order: 189 },
  { restaurant_id: restaurantId, name: 'Agua de Panela', description: '', price: 4500, category: 'bebidas-calientes', sort_order: 190 },
  { restaurant_id: restaurantId, name: 'Copa de Vino', description: '', price: 20000, category: 'bebidas-calientes', sort_order: 191 },

  // POSTRES
  { restaurant_id: restaurantId, name: 'Brownie con Helado', description: '', price: 13000, category: 'postres', sort_order: 200 },
  { restaurant_id: restaurantId, name: 'Copa de Helado', description: '', price: 9000, category: 'postres', sort_order: 201 },
  { restaurant_id: restaurantId, name: 'Postre de la Casa', description: '', price: 8000, category: 'postres', sort_order: 202 },

  // COCTELES
  { restaurant_id: restaurantId, name: 'Margarita', description: '', price: 26000, category: 'cocteles', sort_order: 210 },
  { restaurant_id: restaurantId, name: 'Margarita Frozen', description: '', price: 28000, category: 'cocteles', sort_order: 211 },
  { restaurant_id: restaurantId, name: 'Margarita Frozen Blue', description: '', price: 30000, category: 'cocteles', sort_order: 212 },
  { restaurant_id: restaurantId, name: 'Mojito', description: '', price: 21000, category: 'cocteles', sort_order: 213 },
  { restaurant_id: restaurantId, name: 'Mojito Cytrus', description: '', price: 23000, category: 'cocteles', sort_order: 214 },
  { restaurant_id: restaurantId, name: 'Mojito Frozen', description: '', price: 23000, category: 'cocteles', sort_order: 215 },
  { restaurant_id: restaurantId, name: 'Mojito Frozen Cytrus', description: '', price: 25000, category: 'cocteles', sort_order: 216 },
  { restaurant_id: restaurantId, name: 'Daiquirí Strawberry', description: '', price: 28000, category: 'cocteles', sort_order: 217 },
  { restaurant_id: restaurantId, name: 'Piña Colada', description: '', price: 28000, category: 'cocteles', sort_order: 218 },
  { restaurant_id: restaurantId, name: 'Long Island', description: '', price: 38000, category: 'cocteles', sort_order: 219 },
  { restaurant_id: restaurantId, name: 'Tinto Verano', description: '', price: 18000, category: 'cocteles', sort_order: 220 },
  { restaurant_id: restaurantId, name: 'Cuba Libre', description: '', price: 26000, category: 'cocteles', sort_order: 221 },
  { restaurant_id: restaurantId, name: 'Jarra de Sangría', description: '', price: 70000, category: 'cocteles', sort_order: 222 },

  // CERVEZAS
  { restaurant_id: restaurantId, name: 'Cerveza Corona', description: '', price: 12000, category: 'cervezas', sort_order: 230 },
  { restaurant_id: restaurantId, name: 'Stella Artois', description: '', price: 13000, category: 'cervezas', sort_order: 231 },
  { restaurant_id: restaurantId, name: 'Budweiser', description: '', price: 12000, category: 'cervezas', sort_order: 232 },
  { restaurant_id: restaurantId, name: 'Cerveza Águila', description: '', price: 7000, category: 'cervezas', sort_order: 233 },
  { restaurant_id: restaurantId, name: 'Cerveza Águila Light', description: '', price: 7000, category: 'cervezas', sort_order: 234 },
  { restaurant_id: restaurantId, name: 'Cerveza Poker', description: '', price: 7000, category: 'cervezas', sort_order: 235 },
  { restaurant_id: restaurantId, name: 'Cola y Pola', description: '', price: 6500, category: 'cervezas', sort_order: 236 },
  { restaurant_id: restaurantId, name: 'Club Colombia', description: '', price: 9000, category: 'cervezas', sort_order: 237 },

  // LICORES
  { restaurant_id: restaurantId, name: 'Vino Gato Negro (Botella)', description: '', price: 80000, category: 'licores', sort_order: 240 },
  { restaurant_id: restaurantId, name: 'Vino Santa Helena (Botella)', description: '', price: 82000, category: 'licores', sort_order: 241 },
  { restaurant_id: restaurantId, name: 'Copa de Vino', description: '', price: 19000, category: 'licores', sort_order: 242 },
  { restaurant_id: restaurantId, name: 'Shot de Aguardiente', description: '', price: 10000, category: 'licores', sort_order: 243 },
  { restaurant_id: restaurantId, name: 'Shot de Tequila Don Julio', description: '', price: 25000, category: 'licores', sort_order: 244 },
  { restaurant_id: restaurantId, name: 'Shot de Ron', description: '', price: 15000, category: 'licores', sort_order: 245 },
  { restaurant_id: restaurantId, name: 'Vaso de Whisky', description: '', price: 25000, category: 'licores', sort_order: 246 },
  { restaurant_id: restaurantId, name: '1/2 Botella Aguardiente Néctar', description: '', price: 56000, category: 'licores', sort_order: 247 },
  { restaurant_id: restaurantId, name: 'Botella de Aguardiente Néctar', description: '', price: 96000, category: 'licores', sort_order: 248 },
  { restaurant_id: restaurantId, name: '1/2 Aguardiente Amarillo de Manzanares', description: '', price: 90000, category: 'licores', sort_order: 249 },
  { restaurant_id: restaurantId, name: 'Botella Aguardiente Amarillo de Manzanares', description: '', price: 150000, category: 'licores', sort_order: 250 },
  { restaurant_id: restaurantId, name: '1/2 Botella de Ron Viejo de Caldas', description: '', price: 59000, category: 'licores', sort_order: 251 },
  { restaurant_id: restaurantId, name: 'Botella de Ron Viejo de Caldas', description: '', price: 98000, category: 'licores', sort_order: 252 },
  { restaurant_id: restaurantId, name: 'Botella de Tequila Don Julio', description: '', price: 260000, category: 'licores', sort_order: 253 },
  { restaurant_id: restaurantId, name: '1/2 Botella de Tequila Jimador', description: '', price: 120000, category: 'licores', sort_order: 254 },
  { restaurant_id: restaurantId, name: 'Botella de Tequila Jimador', description: '', price: 237000, category: 'licores', sort_order: 255 },
  { restaurant_id: restaurantId, name: '1/2 Botella de Vodka Smirnoff', description: '', price: 87000, category: 'licores', sort_order: 256 },
  { restaurant_id: restaurantId, name: 'Botella Vodka Smirnoff', description: '', price: 156000, category: 'licores', sort_order: 257 },
  { restaurant_id: restaurantId, name: '1/2 Botella de Old Parr', description: '', price: 185000, category: 'licores', sort_order: 258 },
  { restaurant_id: restaurantId, name: 'Botella de Old Parr', description: '', price: 250000, category: 'licores', sort_order: 259 },
  { restaurant_id: restaurantId, name: '1/2 Botella de Buchanan\'s', description: '', price: 150000, category: 'licores', sort_order: 260 },
  { restaurant_id: restaurantId, name: 'Botella de Buchanan\'s', description: '', price: 243000, category: 'licores', sort_order: 261 },

  // MENÚ INFANTIL
  { restaurant_id: restaurantId, name: 'Snacks de Pollo', description: 'Papa a la francesa y Pony Malta de 200 mL', price: 22000, category: 'menu-infantil', sort_order: 270 },
  { restaurant_id: restaurantId, name: 'Ajiaquito', description: 'Sopa con pollo desmechado acompañada de arroz o aguacate y Pony Malta de 200 mL', price: 22000, category: 'menu-infantil', sort_order: 271 }
];

async function seed() {
  console.log('--- Iniciando Carga de Menú: La Carreta ---');
  
  // 1. Limpiar platos anteriores
  const { error: deleteError } = await supabase
    .from('menu_items')
    .delete()
    .eq('restaurant_id', restaurantId);

  if (deleteError) {
    console.error('Error al limpiar platos anteriores:', deleteError.message);
    return;
  }
  console.log('✓ Menú anterior limpiado correctamente.');

  // 2. Insertar nuevos platos
  const { error: insertError } = await supabase
    .from('menu_items')
    .insert(menuData);

  if (insertError) {
    console.error('Error al insertar el menú:', insertError.message);
  } else {
    console.log(`✓ ¡Éxito! Se han cargado ${menuData.length} platos en la base de datos.`);
  }
}

seed();
