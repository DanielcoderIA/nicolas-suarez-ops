-- Seed: Mar y Tierra menu items (100+ items)
-- restaurant_id: 22222222-2222-2222-2222-222222222222
-- Run AFTER 20250514_000012_expand_menu_categories.sql

-- ═══ ENTRADAS ═══
INSERT INTO menu_items (restaurant_id,name,description,price,category,sort_order,is_available) VALUES
('22222222-2222-2222-2222-222222222222','Chips de plátano con suero','10 unidades con suero costeño.',20000,'entradas',1,true),
('22222222-2222-2222-2222-222222222222','Camarones apanados','15 unidades, salsa de la casa, acompañado con papa a la francesa o chips de plátano.',38000,'entradas',2,true),
('22222222-2222-2222-2222-222222222222','Camarones al ajillo','15 unidades, acompañado con papa a la francesa y chips de plátano.',37000,'entradas',3,true),
('22222222-2222-2222-2222-222222222222','Ceviche de camarón tradicional','A base de salsa roja o rosada con cebolla, limón, cilantro y pimienta.',36000,'entradas',4,true),
('22222222-2222-2222-2222-222222222222','Ceviche peruano','Pescado blanco, camarón en leche de tigre, acompañado de chips de plátano.',38000,'entradas',5,true),
('22222222-2222-2222-2222-222222222222','Ceviche peruano mixto','Pescado blanco, camarón en leche de tigre acompañado con chips de plátano.',42000,'entradas',6,true),
('22222222-2222-2222-2222-222222222222','Patacones con suero costeño','4 unidades.',20000,'entradas',7,true),
('22222222-2222-2222-2222-222222222222','Patacones con hogao','4 unidades.',18000,'entradas',8,true),
('22222222-2222-2222-2222-222222222222','Patacones gratinados',NULL,20000,'entradas',9,true),
('22222222-2222-2222-2222-222222222222','Patacones con hogao y gratinados','4 unidades.',24000,'entradas',10,true);

-- ═══ ESPECIALIDADES ═══
INSERT INTO menu_items (restaurant_id,name,description,price,category,sort_order,is_available) VALUES
('22222222-2222-2222-2222-222222222222','Paella mediterránea','Frutos del mar (trozos de pechuga, cerdo con arveja y zanahoria).',52000,'especialidades',11,true),
('22222222-2222-2222-2222-222222222222','Paella valenciana','Cerdo, chorizo, pechuga de pollo con arveja y zanahoria.',50000,'especialidades',12,true),
('22222222-2222-2222-2222-222222222222','Arroz marinero','Frutos del mar con arveja y zanahoria.',48000,'especialidades',13,true),
('22222222-2222-2222-2222-222222222222','Arroz con camarones','Frutos del mar con arveja y zanahoria.',50000,'especialidades',14,true),
('22222222-2222-2222-2222-222222222222','Arroz mar y tierra','Frutos del mar con trozos de churrasco y pechuga de pollo con arveja y zanahoria.',50000,'especialidades',15,true),
('22222222-2222-2222-2222-222222222222','Arroz mexicano','Trozos de churrasco y pechuga de pollo, maíz, arveja y zanahoria.',48000,'especialidades',16,true),
('22222222-2222-2222-2222-222222222222','Pasta marinera','Frutos del mar en salsa marinera, acompañados de pan baguette y patacón.',48000,'especialidades',17,true),
('22222222-2222-2222-2222-222222222222','Pasta con camarones','15 camarones en salsa marinera, acompañados de pan baguette y patacón.',54000,'especialidades',18,true),
('22222222-2222-2222-2222-222222222222','Pasta carbonara','Cerdo, tocineta en salsa carbonara, acompañadas de pan baguette o patacón.',50000,'especialidades',19,true),
('22222222-2222-2222-2222-222222222222','Pasta mar y tierra','Frutos del mar con trozos de carne de res y pechuga en salsa marinera, acompañados de pan baguette o patacón.',50000,'especialidades',20,true);

-- ═══ PESCADOS FRITOS ═══
INSERT INTO menu_items (restaurant_id,name,description,price,category,sort_order,is_available) VALUES
('22222222-2222-2222-2222-222222222222','Mojarra frita','400 grs. Acompañada con patacón o papa francesa, arroz blanco o de coco, ensalada o guacamole.',48000,'pescados-fritos',21,true),
('22222222-2222-2222-2222-222222222222','Bagre frito','500 grs. Acompañado con patacón o papa francesa, arroz blanco o de coco, ensalada o guacamole.',51000,'pescados-fritos',22,true),
('22222222-2222-2222-2222-222222222222','Róbalo frito','Según el tamaño: 400g $58.000 | 500g $68.000 | 600g $78.000 | 700g $89.000.',58000,'pescados-fritos',23,true),
('22222222-2222-2222-2222-222222222222','Pargo frito','Según el tamaño: 400g $63.000 | 500g $73.000 | 600g $83.000 | 700g $83.000.',63000,'pescados-fritos',24,true);

-- ═══ PESCADOS A LA PLANCHA ═══
INSERT INTO menu_items (restaurant_id,name,description,price,category,sort_order,is_available) VALUES
('22222222-2222-2222-2222-222222222222','Mojarra al horno',NULL,48000,'pescados-plancha',25,true),
('22222222-2222-2222-2222-222222222222','Mojarra rellena al horno',NULL,60000,'pescados-plancha',26,true),
('22222222-2222-2222-2222-222222222222','Filete de mojarra asada',NULL,48000,'pescados-plancha',27,true),
('22222222-2222-2222-2222-222222222222','Filete de mojarra apanada',NULL,50000,'pescados-plancha',28,true),
('22222222-2222-2222-2222-222222222222','Filete de mojarra al ajillo',NULL,53000,'pescados-plancha',29,true),
('22222222-2222-2222-2222-222222222222','Filete de mojarra salsa maracuyá',NULL,53000,'pescados-plancha',30,true),
('22222222-2222-2222-2222-222222222222','Filete de mojarra con salsa beach',NULL,60000,'pescados-plancha',31,true),
('22222222-2222-2222-2222-222222222222','Trucha a la plancha',NULL,53000,'pescados-plancha',32,true),
('22222222-2222-2222-2222-222222222222','Trucha gratinada',NULL,58000,'pescados-plancha',33,true),
('22222222-2222-2222-2222-222222222222','Trucha al ajillo',NULL,58000,'pescados-plancha',34,true),
('22222222-2222-2222-2222-222222222222','Trucha con salsa maracuyá',NULL,58000,'pescados-plancha',35,true),
('22222222-2222-2222-2222-222222222222','Trucha con salsa beach',NULL,65000,'pescados-plancha',36,true),
('22222222-2222-2222-2222-222222222222','Salmón plancha',NULL,58000,'pescados-plancha',37,true),
('22222222-2222-2222-2222-222222222222','Salmón gratinado',NULL,63000,'pescados-plancha',38,true),
('22222222-2222-2222-2222-222222222222','Salmón al ajillo',NULL,63000,'pescados-plancha',39,true),
('22222222-2222-2222-2222-222222222222','Salmón con salsa maracuyá',NULL,63000,'pescados-plancha',40,true),
('22222222-2222-2222-2222-222222222222','Salmón con salsa beach',NULL,70000,'pescados-plancha',41,true),
('22222222-2222-2222-2222-222222222222','Bagre plancha',NULL,51000,'pescados-plancha',42,true);

-- ═══ PESCADOS CON SALSA MARINERA ═══
INSERT INTO menu_items (restaurant_id,name,description,price,category,sort_order,is_available) VALUES
('22222222-2222-2222-2222-222222222222','Trucha con salsa marinera','400 grs.',65000,'pescados-marinera',43,true),
('22222222-2222-2222-2222-222222222222','Trucha gratinada con salsa marinera','500 grs.',72000,'pescados-marinera',44,true),
('22222222-2222-2222-2222-222222222222','Salmón con salsa marinera','Filete 280 grs.',70000,'pescados-marinera',45,true),
('22222222-2222-2222-2222-222222222222','Salmón gratinado con salsa marinera','Filete 280 grs.',77000,'pescados-marinera',46,true);

-- ═══ PESCADOS EN SALSA CRIOLLA ═══
INSERT INTO menu_items (restaurant_id,name,description,price,category,sort_order,is_available) VALUES
('22222222-2222-2222-2222-222222222222','Mojarra en salsa criolla','450 grs.',55000,'pescados-criolla',47,true),
('22222222-2222-2222-2222-222222222222','Bagre en salsa criolla','550 grs.',58000,'pescados-criolla',48,true);

-- ═══ CAZUELAS Y SANCOCHOS ═══
INSERT INTO menu_items (restaurant_id,name,description,price,category,sort_order,is_available) VALUES
('22222222-2222-2222-2222-222222222222','Cazuela mar y tierra','Acompañado de queso mozzarella, queso parmesano con patacón, arroz con coco y aguacate.',55000,'cazuelas-sancochos',49,true),
('22222222-2222-2222-2222-222222222222','Cazuela de mariscos','Acompañado con patacón, arroz blanco o arroz con coco y aguacate.',53000,'cazuelas-sancochos',50,true),
('22222222-2222-2222-2222-222222222222','Cazuela de camarón','Acompañado con patacón, arroz blanco o arroz con coco y aguacate.',58000,'cazuelas-sancochos',51,true),
('22222222-2222-2222-2222-222222222222','Cazuela mixta','Filete de mojarra, queso mozzarella con patacón, arroz blanco o arroz con coco y aguacate.',60000,'cazuelas-sancochos',52,true),
('22222222-2222-2222-2222-222222222222','Mojarra en sancocho','Acompañado con arroz con coco y aguacate.',55000,'cazuelas-sancochos',53,true),
('22222222-2222-2222-2222-222222222222','Bagre sancocho','Acompañado con arroz blanco o arroz con coco y aguacate.',58000,'cazuelas-sancochos',54,true);

-- ═══ PLATOS TÍPICOS ═══
INSERT INTO menu_items (restaurant_id,name,description,price,category,sort_order,is_available) VALUES
('22222222-2222-2222-2222-222222222222','Bandeja paisa','Arroz, frijoles, carne molida, plátano maduro, aguacate, chorizo, chicharrón, arepa y huevo.',49000,'platos-tipicos',55,true),
('22222222-2222-2222-2222-222222222222','Ajiaco con pollo','Arroz blanco, aguacate, pierna pernil, mazorca, crema de leche y alcaparras.',37000,'platos-tipicos',56,true);

-- ═══ CARNES ═══
INSERT INTO menu_items (restaurant_id,name,description,price,category,sort_order,is_available) VALUES
('22222222-2222-2222-2222-222222222222','Lomo saltado','Lomo de res, ají amarillo, cebolla, pimentón, tomate, arroz blanco, papas francesas.',50000,'carnes',57,true),
('22222222-2222-2222-2222-222222222222','Costilla de cerdo','480 grs con salsa BBQ.',50000,'carnes',58,true),
('22222222-2222-2222-2222-222222222222','Churrasco','300 grs.',58000,'carnes',59,true),
('22222222-2222-2222-2222-222222222222','Pechuga a la plancha','300 grs.',45000,'carnes',60,true),
('22222222-2222-2222-2222-222222222222','Baby beef','300 grs.',58000,'carnes',61,true),
('22222222-2222-2222-2222-222222222222','Punta de anca','300 grs.',58000,'carnes',62,true),
('22222222-2222-2222-2222-222222222222','Carne asada madurada','300 grs.',42000,'carnes',63,true);

-- ═══ ENSALADAS ═══
INSERT INTO menu_items (restaurant_id,name,description,price,category,sort_order,is_available) VALUES
('22222222-2222-2222-2222-222222222222','Ensalada mar y tierra','Camarones, anillos, pescado blanco, pollo, variedad de vegetales, queso mozzarella y parmesano.',57000,'ensaladas',64,true),
('22222222-2222-2222-2222-222222222222','Ensalada de camarones','15 camarones, variedad de vegetales, queso mozzarella y parmesano.',48000,'ensaladas',65,true);

-- ═══ HAMBURGUESAS ═══
INSERT INTO menu_items (restaurant_id,name,description,price,category,sort_order,is_available) VALUES
('22222222-2222-2222-2222-222222222222','Cangreburguer','Cebolla grille, lechuga, tomate, queso mozzarella, francesa y coca-cola.',35000,'hamburguesas',66,true),
('22222222-2222-2222-2222-222222222222','Hamburguesa de carne','Cebolla grille, lechuga, tomate, queso mozzarella, francesa y coca-cola.',35000,'hamburguesas',67,true),
('22222222-2222-2222-2222-222222222222','Hamburguesa de pollo','Cebolla grille, lechuga, tomate, queso mozzarella, francesa y coca-cola.',35000,'hamburguesas',68,true);

-- ═══ VEGETARIANOS ═══
INSERT INTO menu_items (restaurant_id,name,description,price,category,sort_order,is_available) VALUES
('22222222-2222-2222-2222-222222222222','Patacones con vegetales','4 unidades.',35000,'vegetarianos',69,true),
('22222222-2222-2222-2222-222222222222','Pasta con vegetales','Pasta con vegetales salteados acompañados con pan baguette.',35000,'vegetarianos',70,true),
('22222222-2222-2222-2222-222222222222','Arroz con vegetales','Arroz salteados con vegetales, patacón o francesa y ensalada.',35000,'vegetarianos',71,true);

-- ═══ MENÚ INFANTIL ═══
INSERT INTO menu_items (restaurant_id,name,description,price,category,sort_order,is_available) VALUES
('22222222-2222-2222-2222-222222222222','Snacks de pollo','Acompañado de papa francesa, salsa de tomate y pony malta.',35000,'menu-infantil',72,true),
('22222222-2222-2222-2222-222222222222','Snacks de pescado','Acompañado de papa francesa, salsa de tomate y pony malta.',35000,'menu-infantil',73,true);

-- ═══ ADICIONES ═══
INSERT INTO menu_items (restaurant_id,name,description,price,category,sort_order,is_available) VALUES
('22222222-2222-2222-2222-222222222222','Suero costeño',NULL,9000,'adiciones',74,true),
('22222222-2222-2222-2222-222222222222','Papa francesa',NULL,9000,'adiciones',75,true),
('22222222-2222-2222-2222-222222222222','Papa vapor',NULL,10000,'adiciones',76,true),
('22222222-2222-2222-2222-222222222222','Unidad de patacón',NULL,4000,'adiciones',77,true),
('22222222-2222-2222-2222-222222222222','Yuca (frita o sudada)',NULL,12000,'adiciones',78,true),
('22222222-2222-2222-2222-222222222222','Arroz blanco',NULL,8500,'adiciones',79,true),
('22222222-2222-2222-2222-222222222222','Arroz coco',NULL,9500,'adiciones',80,true),
('22222222-2222-2222-2222-222222222222','Porción de ensalada','Cebolla, tomate, lechuga y zanahoria.',9000,'adiciones',81,true);

-- ═══ BEBIDAS ═══
INSERT INTO menu_items (restaurant_id,name,description,price,category,sort_order,is_available) VALUES
('22222222-2222-2222-2222-222222222222','Limonada natural',NULL,9000,'bebidas',82,true),
('22222222-2222-2222-2222-222222222222','Limonada de coco',NULL,12000,'bebidas',83,true),
('22222222-2222-2222-2222-222222222222','Limonada cerezada',NULL,12000,'bebidas',84,true),
('22222222-2222-2222-2222-222222222222','Limonada de hierbabuena',NULL,12000,'bebidas',85,true),
('22222222-2222-2222-2222-222222222222','Jugo natural en agua','Lulo, mango, maracuyá, mora, fresa o guanábana.',9000,'bebidas',86,true),
('22222222-2222-2222-2222-222222222222','Jugo natural en leche','Lulo, mango, maracuyá, mora, fresa o guanábana.',11000,'bebidas',87,true),
('22222222-2222-2222-2222-222222222222','Soda italiana','Cereza, maracuyá o hierbabuena.',18000,'bebidas',88,true),
('22222222-2222-2222-2222-222222222222','Tinto',NULL,4000,'bebidas',89,true),
('22222222-2222-2222-2222-222222222222','Agua aromática',NULL,5000,'bebidas',90,true),
('22222222-2222-2222-2222-222222222222','Botella de agua (600 ml)',NULL,6000,'bebidas',91,true),
('22222222-2222-2222-2222-222222222222','Botella de agua con gas (600 ml)',NULL,6000,'bebidas',92,true),
('22222222-2222-2222-2222-222222222222','Gaseosa',NULL,6000,'bebidas',93,true),
('22222222-2222-2222-2222-222222222222','Cerveza Poker',NULL,8000,'bebidas',94,true),
('22222222-2222-2222-2222-222222222222','Cerveza Águila',NULL,8000,'bebidas',95,true),
('22222222-2222-2222-2222-222222222222','Cola y Pola',NULL,8000,'bebidas',96,true),
('22222222-2222-2222-2222-222222222222','Cerveza Club Colombia Dorada',NULL,10000,'bebidas',97,true),
('22222222-2222-2222-2222-222222222222','Cerveza Club Colombia Roja',NULL,10000,'bebidas',98,true),
('22222222-2222-2222-2222-222222222222','Cerveza Club Colombia Trigo',NULL,10000,'bebidas',99,true),
('22222222-2222-2222-2222-222222222222','Cerveza Corona',NULL,13000,'bebidas',100,true),
('22222222-2222-2222-2222-222222222222','Cerveza Coronita',NULL,9500,'bebidas',101,true),
('22222222-2222-2222-2222-222222222222','Soda',NULL,8000,'bebidas',102,true),
('22222222-2222-2222-2222-222222222222','Jarra de sangría vino tinto o blanco',NULL,79000,'bebidas',103,true);

-- ═══ VINOS ═══
INSERT INTO menu_items (restaurant_id,name,description,price,category,sort_order,is_available) VALUES
('22222222-2222-2222-2222-222222222222','Botella de vino tinto o blanco','750 ml.',86000,'vinos',104,true),
('22222222-2222-2222-2222-222222222222','Botella Gato Negro blanco y tinto','750 ml.',90000,'vinos',105,true);

-- ═══ POSTRES ═══
INSERT INTO menu_items (restaurant_id,name,description,price,category,sort_order,is_available) VALUES
('22222222-2222-2222-2222-222222222222','Helado artesanal',NULL,6000,'postres',106,true),
('22222222-2222-2222-2222-222222222222','Brownie con helado',NULL,12000,'postres',107,true),
('22222222-2222-2222-2222-222222222222','Copa de helado con 2 porciones',NULL,11000,'postres',108,true),
('22222222-2222-2222-2222-222222222222','Postre de la casa',NULL,13000,'postres',109,true),
('22222222-2222-2222-2222-222222222222','Cuajada con melado y salsa de mora',NULL,13000,'postres',110,true);

-- ═══ CÓCTELES ═══
INSERT INTO menu_items (restaurant_id,name,description,price,category,sort_order,is_available) VALUES
('22222222-2222-2222-2222-222222222222','Margarita',NULL,29000,'cocteles',111,true),
('22222222-2222-2222-2222-222222222222','Mojito cubano',NULL,25000,'cocteles',112,true),
('22222222-2222-2222-2222-222222222222','Piña colada',NULL,30000,'cocteles',113,true),
('22222222-2222-2222-2222-222222222222','Piña colada (sin alcohol)',NULL,26000,'cocteles',114,true),
('22222222-2222-2222-2222-222222222222','Daikiri',NULL,30000,'cocteles',115,true),
('22222222-2222-2222-2222-222222222222','Cóctel de la casa',NULL,25000,'cocteles',116,true),
('22222222-2222-2222-2222-222222222222','Jarra de sangría','Vino tinto o blanco.',79000,'cocteles',117,true),
('22222222-2222-2222-2222-222222222222','½ Jarra de sangría vino blanco',NULL,44000,'cocteles',118,true);
