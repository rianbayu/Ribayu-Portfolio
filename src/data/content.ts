/**
 * Sumber konten untuk situs publik.
 *
 * Nilai awalnya berasal dari portfolio.generated.ts -- hasil tarikan saat
 * build. Setelah halaman tampil, ContentRefresher boleh menimpanya dengan
 * data terbaru dari Supabase lewat applyLiveContent().
 *
 * Ekspornya memakai `let`, bukan `const`, karena ES module live binding:
 * saat nilainya diganti di sini, semua komponen yang mengimpornya ikut
 * melihat nilai baru pada render berikutnya -- tanpa perlu mengubah satu
 * pun komponen.
 */

import * as baked from "./portfolio.generated";

export type {
  Experience,
  FocusArea,
  LandingPage,
  Project,
} from "./portfolio";

export let profile = baked.profile;
export let theme = baked.theme;
export let metrics = baked.metrics;
export let experiences = baked.experiences;
export let projects = baked.projects;
export let landingPages = baked.landingPages;
export let focusAreas = baked.focusAreas;
export let skills = baked.skills;
export let skillIcons = baked.skillIcons;
export let education = baked.education;
export let certifications = baked.certifications;

export type LiveContent = {
  profile: typeof baked.profile;
  theme: string;
  metrics: typeof baked.metrics;
  experiences: typeof baked.experiences;
  projects: typeof baked.projects;
  landingPages: typeof baked.landingPages;
  focusAreas: typeof baked.focusAreas;
  skills: typeof baked.skills;
  skillIcons: typeof baked.skillIcons;
  education: typeof baked.education;
  certifications: string[];
};

/**
 * Menimpa konten panggangan dengan data terbaru.
 *
 * Mengembalikan true kalau ada yang benar-benar berubah, supaya pemanggil
 * hanya me-render ulang saat perlu -- bukan tiap kali halaman dibuka.
 */
export function applyLiveContent(next: LiveContent): boolean {
  const changed = JSON.stringify(next) !== JSON.stringify(current());

  if (!changed) return false;

  profile = next.profile;
  theme = next.theme;
  metrics = next.metrics;
  experiences = next.experiences;
  projects = next.projects;
  landingPages = next.landingPages;
  focusAreas = next.focusAreas;
  skills = next.skills;
  skillIcons = next.skillIcons;
  education = next.education;
  certifications = next.certifications;

  return true;
}

function current(): LiveContent {
  return {
    profile,
    theme,
    metrics,
    experiences,
    projects,
    landingPages,
    focusAreas,
    skills,
    skillIcons,
    education,
    certifications,
  };
}
