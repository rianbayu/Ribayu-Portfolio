/**
 * Menarik konten dari Supabase lalu menuliskannya menjadi
 * src/data/portfolio.generated.ts.
 *
 * Dijalankan otomatis sebelum `npm run build` lewat script `prebuild`.
 *
 * Prinsipnya: situs tetap 100% statis. Data diambil saat build, bukan saat
 * pengunjung membuka halaman. Itu membuat situs tetap cepat dan tetap hidup
 * meski project Supabase gratis sedang dijeda.
 *
 * Kalau penarikan gagal karena alasan apa pun, berkas hasil sebelumnya
 * DIBIARKAN UTUH dan build tetap lanjut. Portofolio yang tayang jauh lebih
 * berharga daripada build yang gagal gara-gara jaringan.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { CONTENT_QUERIES, mapContent } from "../src/data/mapContent.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = resolve(root, "src/data/portfolio.generated.ts");
const SLUG = "rianbayu";

function readEnv() {
  const file = resolve(root, ".env");
  const env = { ...process.env };

  if (existsSync(file)) {
    for (const line of readFileSync(file, "utf8").split("\n")) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
      if (match) env[match[1]] ??= match[2].trim();
    }
  }

  return env;
}

const env = readEnv();
const URL_BASE = (env.VITE_SUPABASE_URL ?? "")
  .trim()
  .replace(/\/+$/, "")
  .replace(/\/rest\/v1$/, "");
const KEY = (env.VITE_SUPABASE_ANON_KEY ?? "").trim();

function bail(reason) {
  console.warn(`[konten] ${reason}`);
  console.warn("[konten] Memakai portfolio.generated.ts yang sudah ada.");
  process.exit(0);
}

async function get(path) {
  const response = await fetch(`${URL_BASE}/rest/v1/${path}`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
  });

  if (!response.ok) {
    throw new Error(`${path} -> HTTP ${response.status}`);
  }

  return response.json();
}

async function main() {
  if (!URL_BASE || !KEY) bail("VITE_SUPABASE_URL / ANON_KEY belum diisi.");

  const portfolios = await get(
    `portfolios?slug=eq.${SLUG}&select=*&limit=1`,
  );
  const portfolio = portfolios[0];
  if (!portfolio) bail(`Portofolio "${SLUG}" tidak ditemukan atau belum terbit.`);

  const tables = Object.entries(CONTENT_QUERIES);
  const results = await Promise.all(
    tables.map(([table, cols]) =>
      get(
        `${table}?portfolio_id=eq.${portfolio.id}&select=${cols}&order=sort_order.asc`,
      ),
    ),
  );
  const raw = Object.fromEntries(
    tables.map(([table], index) => [table, results[index]]),
  );

  // Sanity check: kalau database kosong, jangan timpa berkas yang ada.
  // Lebih baik menayangkan konten lama daripada portofolio kosong.
  if (!raw.experiences.length && !raw.projects.length) {
    bail("Database mengembalikan konten kosong; penulisan dibatalkan.");
  }

  // Pemetaan dipakai bersama dengan src/lib/liveContent.ts, supaya data
  // hasil build dan hasil penyegaran runtime tidak pernah berbeda bentuk.
  const c = mapContent(portfolio, raw);
  const j = (value) => JSON.stringify(value, null, 2);

  const out = `// BERKAS INI DIHASILKAN OTOMATIS -- JANGAN DIEDIT MANUAL.
// Sumber: Supabase, ditarik oleh scripts/fetch-content.mjs saat build.
// Untuk mengubah isinya, gunakan panel admin di /admin lalu build ulang.
// Terakhir ditarik: ${new Date().toISOString()}

import type {
  Experience,
  FocusArea,
  LandingPage,
  Project,
} from "./portfolio";

export const profile = ${j(c.profile)};

export const theme = ${j(c.theme)};

export const metrics = ${j(c.metrics)};

export const experiences: Experience[] = ${j(c.experiences)};

export const projects: Project[] = ${j(c.projects)};

export const landingPages: LandingPage[] = ${j(c.landingPages)};

export const focusAreas: FocusArea[] = ${j(c.focusAreas)};

export const skills = ${j(c.skills)};

export const skillIcons = ${j(c.skillIcons)};

export const education = ${j(c.education)};

export const certifications: string[] = ${j(c.certifications)};
`;

  writeFileSync(OUT, out, "utf8");

  console.log(
    `[konten] Ditulis ke portfolio.generated.ts -- ` +
      `${c.experiences.length} pengalaman, ${c.projects.length} proyek, ` +
      `${c.landingPages.length} landing page, ${c.skills.length} grup keahlian, ` +
      `${c.certifications.length} sertifikasi.`,
  );
}

main().catch((error) => bail(`Gagal menarik konten: ${error.message}`));
