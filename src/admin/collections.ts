/**
 * Spesifikasi koleksi konten.
 *
 * Satu sumber kebenaran untuk seluruh admin: daftar, form, validasi, dan
 * urutan kolom semuanya diturunkan dari sini. Menambah field baru cukup
 * menambah satu baris, tidak perlu menyentuh komponen apa pun.
 */

export type FieldType = "text" | "textarea" | "url" | "list" | "select";

export type FieldSpec = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  maxLength?: number;
  options?: string[];
  help?: string;
};

export type CollectionSpec = {
  table: string;
  slug: string;
  label: string;
  singular: string;
  /** Kolom yang dipakai sebagai judul baris di daftar. */
  titleField: string;
  /** Kolom sekunder yang ditampilkan kecil di bawah judul. */
  subtitleField?: string;
  fields: FieldSpec[];
};

const listHelp = "Satu item per baris.";

export const COLLECTIONS: CollectionSpec[] = [
  {
    table: "experiences",
    slug: "pengalaman",
    label: "Pengalaman",
    singular: "pengalaman",
    titleField: "company",
    subtitleField: "role",
    fields: [
      { name: "company", label: "Perusahaan", type: "text", required: true, maxLength: 160 },
      { name: "role", label: "Posisi", type: "text", required: true, maxLength: 160 },
      { name: "period", label: "Periode", type: "text", maxLength: 80, help: "Contoh: Jun 2025 - Sekarang" },
      { name: "location", label: "Lokasi", type: "text", maxLength: 120 },
      { name: "summary", label: "Ringkasan", type: "textarea", maxLength: 600 },
      { name: "points", label: "Poin pekerjaan", type: "list", help: listHelp },
      { name: "stack", label: "Teknologi", type: "list", help: listHelp },
    ],
  },
  {
    table: "projects",
    slug: "proyek",
    label: "Proyek",
    singular: "proyek",
    titleField: "title",
    subtitleField: "label",
    fields: [
      { name: "title", label: "Judul", type: "text", required: true, maxLength: 200 },
      { name: "label", label: "Kategori", type: "text", maxLength: 80 },
      { name: "role", label: "Peran", type: "text", maxLength: 120 },
      { name: "summary", label: "Ringkasan", type: "textarea", maxLength: 600 },
      { name: "points", label: "Poin pengerjaan", type: "list", help: listHelp },
      { name: "stack", label: "Teknologi", type: "list", help: listHelp },
    ],
  },
  {
    table: "landing_pages",
    slug: "landing-page",
    label: "Landing Page",
    singular: "landing page",
    titleField: "name",
    subtitleField: "url",
    fields: [
      { name: "name", label: "Nama", type: "text", required: true, maxLength: 160 },
      { name: "tagline", label: "Tagline", type: "text", maxLength: 120 },
      { name: "role", label: "Peran", type: "text", maxLength: 120 },
      {
        name: "url",
        label: "URL situs",
        type: "url",
        required: true,
        maxLength: 500,
        help: "Wajib diawali http:// atau https://",
      },
      { name: "summary", label: "Ringkasan", type: "textarea", maxLength: 600 },
      { name: "stack", label: "Teknologi", type: "list", help: listHelp },
      {
        name: "status",
        label: "Status",
        type: "select",
        required: true,
        options: ["production", "prototype"],
      },
      { name: "status_label", label: "Label status", type: "text", maxLength: 60 },
      { name: "note", label: "Catatan", type: "textarea", maxLength: 400 },
    ],
  },
  {
    table: "focus_areas",
    slug: "cara-kerja",
    label: "Cara Kerja",
    singular: "fokus",
    titleField: "title",
    fields: [
      { name: "title", label: "Judul", type: "text", required: true, maxLength: 160 },
      { name: "description", label: "Deskripsi", type: "textarea", maxLength: 600 },
      { name: "tools", label: "Tools", type: "list", help: listHelp },
    ],
  },
  {
    table: "skill_groups",
    slug: "keahlian",
    label: "Grup Keahlian",
    singular: "grup keahlian",
    titleField: "title",
    fields: [
      { name: "title", label: "Nama grup", type: "text", required: true, maxLength: 120 },
      { name: "tools", label: "Daftar keahlian", type: "list", help: listHelp },
    ],
  },
  {
    table: "skill_icons",
    slug: "ikon-keahlian",
    label: "Ikon Keahlian",
    singular: "ikon",
    titleField: "name",
    subtitleField: "icon_url",
    fields: [
      { name: "name", label: "Nama", type: "text", required: true, maxLength: 80 },
      {
        name: "icon_url",
        label: "Path ikon",
        type: "url",
        required: true,
        maxLength: 400,
        help: "Boleh path lokal (/skills-optimized/react.webp) atau URL https://",
      },
    ],
  },
  {
    table: "certifications",
    slug: "sertifikasi",
    label: "Sertifikasi",
    singular: "sertifikasi",
    titleField: "title",
    fields: [
      { name: "title", label: "Nama sertifikasi", type: "text", required: true, maxLength: 200 },
    ],
  },
  {
    table: "education",
    slug: "pendidikan",
    label: "Pendidikan",
    singular: "pendidikan",
    titleField: "school",
    subtitleField: "degree",
    fields: [
      { name: "school", label: "Institusi", type: "text", required: true, maxLength: 160 },
      { name: "degree", label: "Jurusan / gelar", type: "text", maxLength: 160 },
      { name: "location", label: "Lokasi", type: "text", maxLength: 120 },
      { name: "period", label: "Periode", type: "text", maxLength: 80 },
      { name: "gpa", label: "IPK", type: "text", maxLength: 20 },
    ],
  },
  {
    table: "metrics",
    slug: "metrik",
    label: "Metrik",
    singular: "metrik",
    titleField: "value",
    subtitleField: "label",
    fields: [
      { name: "value", label: "Angka", type: "text", required: true, maxLength: 40 },
      { name: "label", label: "Keterangan", type: "text", required: true, maxLength: 120 },
    ],
  },
];

export const PROFILE_FIELDS: FieldSpec[] = [
  {
    name: "theme",
    label: "Tema warna situs",
    type: "select",
    required: true,
    options: ["default", "samudra", "senja", "rimba", "mawar", "baja"],
    help: "Mengubah warna aksen di seluruh halaman. Simpan lalu muat ulang situs untuk melihatnya.",
  },
  { name: "name", label: "Nama lengkap", type: "text", required: true, maxLength: 120 },
  { name: "role", label: "Peran utama", type: "text", maxLength: 120 },
  { name: "secondary_role", label: "Peran kedua", type: "text", maxLength: 120 },
  { name: "email", label: "Email", type: "text", maxLength: 160 },
  { name: "phone", label: "Telepon", type: "text", maxLength: 60 },
  { name: "location", label: "Lokasi", type: "text", maxLength: 160 },
  { name: "cv_url", label: "Path CV", type: "url", maxLength: 400 },
  { name: "photo_url", label: "Path foto", type: "url", maxLength: 400 },
  { name: "github_primary", label: "GitHub utama", type: "url", maxLength: 300 },
  { name: "github_personal", label: "GitHub pribadi", type: "url", maxLength: 300 },
  { name: "linkedin_url", label: "LinkedIn", type: "url", maxLength: 300 },
  { name: "instagram_url", label: "Instagram", type: "url", maxLength: 300 },
  { name: "intro", label: "Intro singkat", type: "textarea", maxLength: 600 },
  { name: "about", label: "Tentang", type: "textarea", maxLength: 1200 },
];

export function findCollection(slug: string | undefined) {
  return COLLECTIONS.find((item) => item.slug === slug);
}

/**
 * Skema URL yang boleh disimpan.
 *
 * Nilai ini akhirnya dirender ke atribut href/src di situs publik, jadi
 * skema seperti `javascript:` harus ditolak sebelum masuk database.
 * Batasan yang sama juga ditegakkan lewat CHECK constraint di Postgres,
 * karena validasi di browser saja bisa dilewati dengan memanggil API
 * secara langsung.
 */
export function isSafeUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return true;
  if (trimmed.startsWith("/")) return true;

  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export type FieldError = { field: string; message: string };

export function validateRecord(
  fields: FieldSpec[],
  values: Record<string, unknown>,
): FieldError[] {
  const errors: FieldError[] = [];

  for (const field of fields) {
    const raw = values[field.name];
    const text = typeof raw === "string" ? raw.trim() : "";

    if (field.required && field.type !== "list" && !text) {
      errors.push({ field: field.name, message: `${field.label} wajib diisi.` });
      continue;
    }

    if (field.maxLength && text.length > field.maxLength) {
      errors.push({
        field: field.name,
        message: `${field.label} maksimal ${field.maxLength} karakter.`,
      });
    }

    if (field.type === "url" && text && !isSafeUrl(text)) {
      errors.push({
        field: field.name,
        message: `${field.label} harus berupa path yang diawali "/" atau URL http(s)://`,
      });
    }

    if (field.type === "select" && text && !field.options?.includes(text)) {
      errors.push({ field: field.name, message: `${field.label} tidak valid.` });
    }
  }

  return errors;
}

/** Teks multi-baris di form <-> text[] di Postgres. */
export const textToList = (value: string) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

export const listToText = (value: unknown) =>
  Array.isArray(value) ? value.join("\n") : "";
