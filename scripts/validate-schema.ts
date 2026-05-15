import * as cheerio from "cheerio";

/**
 * Script de Validación Schema.org (JSON-LD)
 * 
 * Verifica que las páginas públicas contengan los metadatos necesarios
 * para SEO Local y Google Maps (Restaurant Schema).
 */

const PAGES = [
  "http://localhost:3010",        // La Carreta
  "http://localhost:3010/menu",
  "http://localhost:3020",        // Mar y Tierra
  "http://localhost:3020/menu",
  "http://localhost:3030",        // Delica
  "http://localhost:3030/menu",
];

const REQUIRED_FIELDS = [
  "@type",
  "name",
  "url",
  "address",
  "servesCuisine",
  "openingHours",
];

async function validatePage(url: string) {
  console.log(`\n🔍 Validando Schema en: ${url}`);
  
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    
    const jsonLdScripts = $('script[type="application/ld+json"]');
    
    if (jsonLdScripts.length === 0) {
      console.log("   ❌ Error: No se encontró bloque JSON-LD");
      return false;
    }

    let isValid = false;
    jsonLdScripts.each((_, element) => {
      try {
        const data = JSON.parse($(element).html() || "{}");
        
        // Buscamos el objeto de tipo Restaurant
        const restaurant = data["@type"] === "Restaurant" ? data : 
                           Array.isArray(data["@graph"]) ? data["@graph"].find((node: Record<string, unknown>) => node["@type"] === "Restaurant") : 
                           null;

        if (restaurant) {
          const missing = REQUIRED_FIELDS.filter(field => !restaurant[field]);
          if (missing.length === 0) {
            console.log("   ✅ Schema válido (Restaurant)");
            isValid = true;
          } else {
            console.log(`   ❌ Faltan campos: ${missing.join(", ")}`);
          }
        }
      } catch (e) {
        console.log("   ⚠️ Error parseando bloque JSON-LD");
      }
    });

    return isValid;
  } catch (error) {
    console.log(`   ❌ Error de red al acceder a ${url}`);
    return false;
  }
}

async function main() {
  let allValid = true;
  for (const url of PAGES) {
    const valid = await validatePage(url);
    if (!valid) allValid = false;
  }

  if (allValid) {
    console.log("\n✨ Todas las páginas tienen Schema.org válido.");
  } else {
    console.log("\n⚠️ Se encontraron errores en el Schema.org.");
    process.exit(1);
  }
}

main();
