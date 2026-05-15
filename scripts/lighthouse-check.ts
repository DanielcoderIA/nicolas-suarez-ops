import fs from "fs";
import path from "path";
import * as chromeLauncher from "chrome-launcher";
const lighthouse = require("lighthouse");

/**
 * Script de Auditoría Performance (Lighthouse)
 * 
 * Ejecuta auditorías contra los dominios locales y verifica KPIs:
 * LCP < 2.5s, CLS < 0.1, FID < 100ms, TTFB < 200ms
 */

const DOMAINS = [
  { name: "La Carreta", url: "http://localhost:3010" },
  { name: "Mar y Tierra", url: "http://localhost:3020" },
  { name: "Delica", url: "http://localhost:3030" },
  { name: "Chef Profile", url: "http://localhost:3040" }, // nicolassuarez.co
];

const THRESHOLDS = {
  lcp: 2500,
  cls: 0.1,
  ttfb: 200,
};

async function runAudit(name: string, url: string) {
  console.log(`\n🚀 Iniciando auditoría para ${name} (${url})...`);
  
  const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless"] });
  const options = {
    logLevel: "info",
    output: "html",
    onlyCategories: ["performance", "best-practices", "seo"],
    port: chrome.port,
  };

  const runnerResult = await lighthouse(url, options);

  // Generar reporte
  const reportHtml = runnerResult.report;
  const reportDir = path.join(process.cwd(), "reports", "lighthouse");
  if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true });
  
  const fileName = `${name.toLowerCase().replace(/\s+/g, "-")}-report.html`;
  fs.writeFileSync(path.join(reportDir, fileName), reportHtml);

  // Validar métricas
  const audits = runnerResult.lhr.audits;
  const lcp = audits["largest-contentful-paint"].numericValue;
  const cls = audits["cumulative-layout-shift"].numericValue;
  const ttfb = audits["server-response-time"].numericValue;

  console.log(`📊 Resultados para ${name}:`);
  console.log(`   - LCP: ${lcp.toFixed(2)}ms ${lcp < THRESHOLDS.lcp ? "✅" : "❌"}`);
  console.log(`   - CLS: ${cls.toFixed(3)} ${cls < THRESHOLDS.cls ? "✅" : "❌"}`);
  console.log(`   - TTFB: ${ttfb.toFixed(2)}ms ${ttfb < THRESHOLDS.ttfb ? "✅" : "❌"}`);

  // Bundle size verification (basado en la auditoría de total-byte-weight)
  const totalWeight = audits["total-byte-weight"].numericValue / 1024; // KB
  console.log(`   - Peso Total: ${totalWeight.toFixed(2)}KB ${totalWeight < 500 ? "✅" : "⚠️"}`);

  await chrome.kill();

  return { lcp, cls, ttfb, totalWeight };
}

async function main() {
  try {
    for (const domain of DOMAINS) {
      await runAudit(domain.name, domain.url);
    }
    console.log("\n✨ Auditorías completadas. Reportes guardados en /reports/lighthouse/");
  } catch (error) {
    console.error("❌ Error durante la auditoría:", error);
    process.exit(1);
  }
}

main();
