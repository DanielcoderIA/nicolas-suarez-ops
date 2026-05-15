/**
 * Mar y Tierra — Complete Menu Data
 * Static menu data for SSG rendering. Each item follows the MenuItem interface.
 */

export interface StaticMenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  /** For items with variable pricing (e.g. fish by weight) */
  priceVariants?: { label: string; price: number }[];
  category: string;
  is_available: boolean;
}

/** Human-readable category labels */
export const CATEGORY_LABELS: Record<string, string> = {
  todos: "Todo",
  entradas: "Entradas",
  especialidades: "Especialidades",
  "pescados-fritos": "Pescados Fritos",
  "pescados-plancha": "Pescados a la Plancha",
  "pescados-marinera": "Salsa Marinera",
  "pescados-criolla": "Salsa Criolla",
  "cazuelas-sancochos": "Cazuelas & Sancochos",
  "platos-tipicos": "Platos Típicos",
  carnes: "Carnes",
  ensaladas: "Ensaladas",
  hamburguesas: "Hamburguesas",
  vegetarianos: "Vegetarianos",
  "menu-infantil": "Menú Infantil",
  adiciones: "Adiciones",
  bebidas: "Bebidas",
  vinos: "Vinos",
  postres: "Postres",
  cocteles: "Cócteles",
};

/** Ordered list of categories as they appear in the physical menu */
export const CATEGORY_ORDER: string[] = [
  "entradas",
  "especialidades",
  "pescados-fritos",
  "pescados-plancha",
  "pescados-marinera",
  "pescados-criolla",
  "cazuelas-sancochos",
  "platos-tipicos",
  "carnes",
  "ensaladas",
  "hamburguesas",
  "vegetarianos",
  "menu-infantil",
  "adiciones",
  "bebidas",
  "vinos",
  "postres",
  "cocteles",
];

/** Section subtitles for categories with accompaniment notes */
export const CATEGORY_SUBTITLES: Record<string, string> = {
  "pescados-fritos": "Acompañados con: patacón o papa francesa, arroz blanco o de coco, ensalada o guacamole",
  "pescados-plancha": "Acompañados con: patacón o papa francesa, arroz blanco o de coco, ensalada o guacamole",
  "pescados-marinera": "Acompañados con: patacón o papa francesa, arroz blanco o de coco, ensalada o guacamole",
  "pescados-criolla": "Acompañados con: papa, yuca y plátano, arroz blanco o de coco, aguacate, patacón",
  carnes: "Acompañados con 2 guarniciones: papa salada, papa criolla, papa francesa, patacón, ensalada, arroz blanco o arroz de coco",
  hamburguesas: "Acompañadas con papas francesas",
};

/** Category icons — emoji shorthand for visual flair */
export const CATEGORY_ICONS: Record<string, string> = {
  entradas: "🥑",
  especialidades: "⭐",
  "pescados-fritos": "🐟",
  "pescados-plancha": "🔥",
  "pescados-marinera": "🦐",
  "pescados-criolla": "🍲",
  "cazuelas-sancochos": "🫕",
  "platos-tipicos": "🇨🇴",
  carnes: "🥩",
  ensaladas: "🥗",
  hamburguesas: "🍔",
  vegetarianos: "🌿",
  "menu-infantil": "👶",
  adiciones: "➕",
  bebidas: "🍹",
  vinos: "🍷",
  postres: "🍨",
  cocteles: "🍸",
};

let _id = 0;
const id = () => `mt-${++_id}`;

export const MENU_ITEMS: StaticMenuItem[] = [
  // ── ENTRADAS ──────────────────────────────────────────────────────────
  { id: id(), name: "Chips de plátano con suero", description: "10 unidades con suero costeño.", price: 20000, category: "entradas", is_available: true },
  { id: id(), name: "Camarones apanados", description: "15 unidades, salsa de la casa, acompañado con papa a la francesa o chips de plátano.", price: 38000, category: "entradas", is_available: true },
  { id: id(), name: "Camarones al ajillo", description: "15 unidades, acompañado con papa a la francesa y chips de plátano.", price: 37000, category: "entradas", is_available: true },
  { id: id(), name: "Ceviche de camarón tradicional", description: "A base de salsa roja o rosada con cebolla, limón, cilantro y pimienta.", price: 36000, category: "entradas", is_available: true },
  { id: id(), name: "Ceviche peruano", description: "Pescado blanco, camarón en leche de tigre, acompañado de chips de plátano.", price: 38000, category: "entradas", is_available: true },
  { id: id(), name: "Ceviche peruano mixto", description: "Pescado blanco, camarón en leche de tigre acompañado con chips de plátano.", price: 42000, category: "entradas", is_available: true },
  { id: id(), name: "Patacones con suero costeño", description: "4 unidades.", price: 20000, category: "entradas", is_available: true },
  { id: id(), name: "Patacones con hogao", description: "4 unidades.", price: 18000, category: "entradas", is_available: true },
  { id: id(), name: "Patacones gratinados", description: null, price: 20000, category: "entradas", is_available: true },
  { id: id(), name: "Patacones con hogao y gratinados", description: "4 unidades.", price: 24000, category: "entradas", is_available: true },

  // ── ESPECIALIDADES ────────────────────────────────────────────────────
  { id: id(), name: "Paella mediterránea", description: "Frutos del mar (trozos de pechuga, cerdo con arveja y zanahoria).", price: 52000, category: "especialidades", is_available: true },
  { id: id(), name: "Paella valenciana", description: "Cerdo, chorizo, pechuga de pollo con arveja y zanahoria.", price: 50000, category: "especialidades", is_available: true },
  { id: id(), name: "Arroz marinero", description: "Frutos del mar con arveja y zanahoria.", price: 48000, category: "especialidades", is_available: true },
  { id: id(), name: "Arroz con camarones", description: "Frutos del mar con arveja y zanahoria.", price: 50000, category: "especialidades", is_available: true },
  { id: id(), name: "Arroz mar y tierra", description: "Frutos del mar con trozos de churrasco y pechuga de pollo con arveja y zanahoria.", price: 50000, category: "especialidades", is_available: true },
  { id: id(), name: "Arroz mexicano", description: "Trozos de churrasco y pechuga de pollo, maíz, arveja y zanahoria.", price: 48000, category: "especialidades", is_available: true },
  { id: id(), name: "Pasta marinera", description: "Frutos del mar en salsa marinera, acompañados de pan baguette y patacón.", price: 48000, category: "especialidades", is_available: true },
  { id: id(), name: "Pasta con camarones", description: "15 camarones en salsa marinera, acompañados de pan baguette y patacón.", price: 54000, category: "especialidades", is_available: true },
  { id: id(), name: "Pasta carbonara", description: "Cerdo, tocineta en salsa carbonara, acompañadas de pan baguette o patacón.", price: 50000, category: "especialidades", is_available: true },
  { id: id(), name: "Pasta mar y tierra", description: "Frutos del mar con trozos de carne de res y pechuga en salsa marinera, acompañados de pan baguette o patacón.", price: 50000, category: "especialidades", is_available: true },

  // ── PESCADOS FRITOS ───────────────────────────────────────────────────
  { id: id(), name: "Mojarra frita", description: "400 grs.", price: 48000, category: "pescados-fritos", is_available: true },
  { id: id(), name: "Bagre frito", description: "500 grs.", price: 51000, category: "pescados-fritos", is_available: true },
  { id: id(), name: "Róbalo frito", description: "Según el tamaño.", price: 58000, category: "pescados-fritos", is_available: true, priceVariants: [{ label: "400 grs", price: 58000 }, { label: "500 grs", price: 68000 }, { label: "600 grs", price: 78000 }, { label: "700 grs", price: 89000 }] },
  { id: id(), name: "Pargo frito", description: "Según el tamaño.", price: 63000, category: "pescados-fritos", is_available: true, priceVariants: [{ label: "400 grs", price: 63000 }, { label: "500 grs", price: 73000 }, { label: "600 grs", price: 83000 }, { label: "700 grs", price: 83000 }] },

  // ── PESCADOS A LA PLANCHA ─────────────────────────────────────────────
  { id: id(), name: "Mojarra al horno", description: null, price: 48000, category: "pescados-plancha", is_available: true },
  { id: id(), name: "Mojarra rellena al horno", description: null, price: 60000, category: "pescados-plancha", is_available: true },
  { id: id(), name: "Filete de mojarra asada", description: null, price: 48000, category: "pescados-plancha", is_available: true },
  { id: id(), name: "Filete de mojarra apanada", description: null, price: 50000, category: "pescados-plancha", is_available: true },
  { id: id(), name: "Filete de mojarra al ajillo", description: null, price: 53000, category: "pescados-plancha", is_available: true },
  { id: id(), name: "Filete de mojarra salsa maracuyá", description: null, price: 53000, category: "pescados-plancha", is_available: true },
  { id: id(), name: "Filete de mojarra con salsa beach", description: null, price: 60000, category: "pescados-plancha", is_available: true },
  { id: id(), name: "Trucha a la plancha", description: null, price: 53000, category: "pescados-plancha", is_available: true },
  { id: id(), name: "Trucha gratinada", description: null, price: 58000, category: "pescados-plancha", is_available: true },
  { id: id(), name: "Trucha al ajillo", description: null, price: 58000, category: "pescados-plancha", is_available: true },
  { id: id(), name: "Trucha con salsa maracuyá", description: null, price: 58000, category: "pescados-plancha", is_available: true },
  { id: id(), name: "Trucha con salsa beach", description: null, price: 65000, category: "pescados-plancha", is_available: true },
  { id: id(), name: "Salmón plancha", description: null, price: 58000, category: "pescados-plancha", is_available: true },
  { id: id(), name: "Salmón gratinado", description: null, price: 63000, category: "pescados-plancha", is_available: true },
  { id: id(), name: "Salmón al ajillo", description: null, price: 63000, category: "pescados-plancha", is_available: true },
  { id: id(), name: "Salmón con salsa maracuyá", description: null, price: 63000, category: "pescados-plancha", is_available: true },
  { id: id(), name: "Salmón con salsa beach", description: null, price: 70000, category: "pescados-plancha", is_available: true },
  { id: id(), name: "Bagre plancha", description: null, price: 51000, category: "pescados-plancha", is_available: true },

  // ── PESCADOS CON SALSA MARINERA ───────────────────────────────────────
  { id: id(), name: "Trucha con salsa marinera", description: "400 grs.", price: 65000, category: "pescados-marinera", is_available: true },
  { id: id(), name: "Trucha gratinada con salsa marinera", description: "500 grs.", price: 72000, category: "pescados-marinera", is_available: true },
  { id: id(), name: "Salmón con salsa marinera", description: "Filete 280 grs.", price: 70000, category: "pescados-marinera", is_available: true },
  { id: id(), name: "Salmón gratinado con salsa marinera", description: "Filete 280 grs.", price: 77000, category: "pescados-marinera", is_available: true },

  // ── PESCADOS EN SALSA CRIOLLA ─────────────────────────────────────────
  { id: id(), name: "Mojarra en salsa criolla", description: "450 grs.", price: 55000, category: "pescados-criolla", is_available: true },
  { id: id(), name: "Bagre en salsa criolla", description: "550 grs.", price: 58000, category: "pescados-criolla", is_available: true },

  // ── CAZUELAS Y SANCOCHOS ──────────────────────────────────────────────
  { id: id(), name: "Cazuela mar y tierra", description: "Acompañado de queso mozzarella, queso parmesano con patacón, arroz con coco y aguacate.", price: 55000, category: "cazuelas-sancochos", is_available: true },
  { id: id(), name: "Cazuela de mariscos", description: "Acompañado con patacón, arroz blanco o arroz con coco y aguacate.", price: 53000, category: "cazuelas-sancochos", is_available: true },
  { id: id(), name: "Cazuela de camarón", description: "Acompañado con patacón, arroz blanco o arroz con coco y aguacate.", price: 58000, category: "cazuelas-sancochos", is_available: true },
  { id: id(), name: "Cazuela mixta", description: "Acompañado filete de mojarra, queso mozzarella con patacón, arroz blanco o arroz con coco y aguacate.", price: 60000, category: "cazuelas-sancochos", is_available: true },
  { id: id(), name: "Mojarra en sancocho", description: "Acompañado con arroz con coco o arroz con coco y aguacate.", price: 55000, category: "cazuelas-sancochos", is_available: true },
  { id: id(), name: "Bagre sancocho", description: "Acompañado con arroz blanco o arroz con coco y aguacate.", price: 58000, category: "cazuelas-sancochos", is_available: true },

  // ── PLATOS TÍPICOS ────────────────────────────────────────────────────
  { id: id(), name: "Bandeja paisa", description: "Arroz, frijoles, carne molida, plátano maduro, aguacate, chorizo, chicharrón, arepa y huevo.", price: 49000, category: "platos-tipicos", is_available: true },
  { id: id(), name: "Ajiaco con pollo", description: "Acompañado de arroz blanco, aguacate, pierna pernil, mazorca, crema de leche y alcaparras.", price: 37000, category: "platos-tipicos", is_available: true },

  // ── CARNES ────────────────────────────────────────────────────────────
  { id: id(), name: "Lomo saltado", description: "Lomo de res, ají amarillo, cebolla, pimentón, tomate, arroz blanco, papas francesas.", price: 50000, category: "carnes", is_available: true },
  { id: id(), name: "Costilla de cerdo", description: "480 grs con salsa BBQ.", price: 50000, category: "carnes", is_available: true },
  { id: id(), name: "Churrasco", description: "300 grs.", price: 58000, category: "carnes", is_available: true },
  { id: id(), name: "Pechuga a la plancha", description: "300 grs.", price: 45000, category: "carnes", is_available: true },
  { id: id(), name: "Baby beef", description: "300 grs.", price: 58000, category: "carnes", is_available: true },
  { id: id(), name: "Punta de anca", description: "300 grs.", price: 58000, category: "carnes", is_available: true },
  { id: id(), name: "Carne asada madurada", description: "300 grs.", price: 42000, category: "carnes", is_available: true },

  // ── ENSALADAS ─────────────────────────────────────────────────────────
  { id: id(), name: "Ensalada mar y tierra", description: "Camarones, anillos, pescado blanco, pollo, variedad de vegetales, queso mozzarella y queso parmesano.", price: 57000, category: "ensaladas", is_available: true },
  { id: id(), name: "Ensalada de camarones", description: "15 camarones, variedad de vegetales, queso mozzarella y queso parmesano.", price: 48000, category: "ensaladas", is_available: true },

  // ── HAMBURGUESAS ──────────────────────────────────────────────────────
  { id: id(), name: "Cangreburguer", description: "Cebolla grille, lechuga, tomate, queso mozzarella, francesa y coca-cola.", price: 35000, category: "hamburguesas", is_available: true },
  { id: id(), name: "Hamburguesa de carne", description: "Cebolla grille, lechuga, tomate, queso mozzarella, francesa y coca-cola.", price: 35000, category: "hamburguesas", is_available: true },
  { id: id(), name: "Hamburguesa de pollo", description: "Cebolla grille, lechuga, tomate, queso mozzarella, francesa y coca-cola.", price: 35000, category: "hamburguesas", is_available: true },

  // ── VEGETARIANOS ──────────────────────────────────────────────────────
  { id: id(), name: "Patacones con vegetales", description: "4 unidades.", price: 35000, category: "vegetarianos", is_available: true },
  { id: id(), name: "Pasta con vegetales", description: "Pasta con vegetales salteados acompañados con pan baguette.", price: 35000, category: "vegetarianos", is_available: true },
  { id: id(), name: "Arroz con vegetales", description: "Arroz salteados con vegetales, patacón o francesa y ensalada.", price: 35000, category: "vegetarianos", is_available: true },

  // ── MENÚ INFANTIL ─────────────────────────────────────────────────────
  { id: id(), name: "Snacks de pollo", description: "Acompañado de papa francesa, salsa de tomate y pony malta.", price: 35000, category: "menu-infantil", is_available: true },
  { id: id(), name: "Snacks de pescado", description: "Acompañado de papa francesa, salsa de tomate y pony malta.", price: 35000, category: "menu-infantil", is_available: true },

  // ── ADICIONES ─────────────────────────────────────────────────────────
  { id: id(), name: "Suero costeño", description: null, price: 9000, category: "adiciones", is_available: true },
  { id: id(), name: "Papa francesa", description: null, price: 9000, category: "adiciones", is_available: true },
  { id: id(), name: "Papa vapor", description: null, price: 10000, category: "adiciones", is_available: true },
  { id: id(), name: "Unidad de patacón", description: null, price: 4000, category: "adiciones", is_available: true },
  { id: id(), name: "Yuca (frita o sudada)", description: null, price: 12000, category: "adiciones", is_available: true },
  { id: id(), name: "Arroz blanco", description: null, price: 8500, category: "adiciones", is_available: true },
  { id: id(), name: "Arroz coco", description: null, price: 9500, category: "adiciones", is_available: true },
  { id: id(), name: "Porción de ensalada", description: "Cebolla, tomate, lechuga y zanahoria.", price: 9000, category: "adiciones", is_available: true },

  // ── BEBIDAS ───────────────────────────────────────────────────────────
  { id: id(), name: "Limonada natural", description: null, price: 9000, category: "bebidas", is_available: true },
  { id: id(), name: "Limonada de coco", description: null, price: 12000, category: "bebidas", is_available: true },
  { id: id(), name: "Limonada cerezada", description: null, price: 12000, category: "bebidas", is_available: true },
  { id: id(), name: "Limonada de hierbabuena", description: null, price: 12000, category: "bebidas", is_available: true },
  { id: id(), name: "Jugo natural en agua", description: "Lulo, mango, maracuyá, mora, fresa o guanábana.", price: 9000, category: "bebidas", is_available: true },
  { id: id(), name: "Jugo natural en leche", description: "Lulo, mango, maracuyá, mora, fresa o guanábana.", price: 11000, category: "bebidas", is_available: true },
  { id: id(), name: "Soda italiana", description: "Cereza, maracuyá o hierbabuena.", price: 18000, category: "bebidas", is_available: true },
  { id: id(), name: "Tinto", description: null, price: 4000, category: "bebidas", is_available: true },
  { id: id(), name: "Agua aromática", description: null, price: 5000, category: "bebidas", is_available: true },
  { id: id(), name: "Botella de agua (600 ml)", description: null, price: 6000, category: "bebidas", is_available: true },
  { id: id(), name: "Botella de agua con gas (600 ml)", description: null, price: 6000, category: "bebidas", is_available: true },
  { id: id(), name: "Gaseosa", description: null, price: 6000, category: "bebidas", is_available: true },
  { id: id(), name: "Cerveza Poker", description: null, price: 8000, category: "bebidas", is_available: true },
  { id: id(), name: "Cerveza Águila", description: null, price: 8000, category: "bebidas", is_available: true },
  { id: id(), name: "Cola y Pola", description: null, price: 8000, category: "bebidas", is_available: true },
  { id: id(), name: "Cerveza Club Colombia Dorada", description: null, price: 10000, category: "bebidas", is_available: true },
  { id: id(), name: "Cerveza Club Colombia Roja", description: null, price: 10000, category: "bebidas", is_available: true },
  { id: id(), name: "Cerveza Club Colombia Trigo", description: null, price: 10000, category: "bebidas", is_available: true },
  { id: id(), name: "Cerveza Corona", description: null, price: 13000, category: "bebidas", is_available: true },
  { id: id(), name: "Cerveza Coronita", description: null, price: 9500, category: "bebidas", is_available: true },
  { id: id(), name: "Soda", description: null, price: 8000, category: "bebidas", is_available: true },
  { id: id(), name: "Jarra de sangría vino tinto o blanco", description: null, price: 79000, category: "bebidas", is_available: true },

  // ── VINOS ─────────────────────────────────────────────────────────────
  { id: id(), name: "Botella de vino tinto o blanco", description: "750 ml.", price: 86000, category: "vinos", is_available: true },
  { id: id(), name: "Botella Gato Negro blanco y tinto", description: "750 ml.", price: 90000, category: "vinos", is_available: true },

  // ── POSTRES ───────────────────────────────────────────────────────────
  { id: id(), name: "Helado artesanal", description: null, price: 6000, category: "postres", is_available: true },
  { id: id(), name: "Brownie con helado", description: null, price: 12000, category: "postres", is_available: true },
  { id: id(), name: "Copa de helado con 2 porciones", description: null, price: 11000, category: "postres", is_available: true },
  { id: id(), name: "Postre de la casa", description: null, price: 13000, category: "postres", is_available: true },
  { id: id(), name: "Cuajada con melado y salsa de mora", description: null, price: 13000, category: "postres", is_available: true },

  // ── CÓCTELES ──────────────────────────────────────────────────────────
  { id: id(), name: "Margarita", description: null, price: 29000, category: "cocteles", is_available: true },
  { id: id(), name: "Mojito cubano", description: null, price: 25000, category: "cocteles", is_available: true },
  { id: id(), name: "Piña colada", description: null, price: 30000, category: "cocteles", is_available: true },
  { id: id(), name: "Piña colada (sin alcohol)", description: null, price: 26000, category: "cocteles", is_available: true },
  { id: id(), name: "Daikiri", description: null, price: 30000, category: "cocteles", is_available: true },
  { id: id(), name: "Cóctel de la casa", description: null, price: 25000, category: "cocteles", is_available: true },
  { id: id(), name: "Jarra de sangría", description: "Vino tinto o blanco.", price: 79000, category: "cocteles", is_available: true },
  { id: id(), name: "½ Jarra de sangría vino blanco", description: null, price: 44000, category: "cocteles", is_available: true },
];

/** Extras/additions grouped by parent category */
export const CATEGORY_EXTRAS: Record<string, { label: string; items: { name: string; price: number }[] }> = {
  carnes: {
    label: "Adiciones para carnes",
    items: [
      { name: "Maracuyá", price: 7000 },
      { name: "Encebollado", price: 6000 },
      { name: "Gratinado", price: 7000 },
    ],
  },
  hamburguesas: {
    label: "Adiciones para hamburguesas",
    items: [
      { name: "Carne extra", price: 10000 },
      { name: "Queso extra", price: 10000 },
    ],
  },
  bebidas: {
    label: "Adiciones para cervezas",
    items: [
      { name: "Zumo de limón", price: 4000 },
      { name: "Michelada", price: 5000 },
    ],
  },
};
