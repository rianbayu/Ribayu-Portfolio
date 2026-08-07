/** Daftar tema yang tersedia. Ditaruh di satu tempat supaya situs dan
 *  pemilih tema di admin tidak pernah berbeda isinya. */
export const THEMES = [
  { id: "default", label: "Bawaan (Cyan / Ungu)" },
  { id: "samudra", label: "Samudra (Teal)" },
  { id: "senja", label: "Senja (Jingga / Merah muda)" },
  { id: "rimba", label: "Rimba (Hijau)" },
  { id: "mawar", label: "Mawar (Merah muda / Ungu)" },
  { id: "baja", label: "Baja (Abu netral)" },
] as const;

export const THEME_IDS = THEMES.map((t) => t.id);

/** Menempelkan tema ke elemen <html>. Tema "default" tidak memakai
 *  atribut, sehingga palet di :root yang dipakai. */
export function applyTheme(theme: string | undefined) {
  const root = document.documentElement;

  if (!theme || theme === "default" || !THEME_IDS.includes(theme as never)) {
    root.removeAttribute("data-theme");
    return;
  }

  root.setAttribute("data-theme", theme);
}
