/**
 * Pemetaan baris database menjadi bentuk yang dipakai komponen.
 *
 * Sengaja JavaScript polos, bukan TypeScript, supaya bisa diimpor oleh
 * DUA pemakai sekaligus:
 *   - scripts/fetch-content.mjs  (Node, saat build)
 *   - src/lib/liveContent.ts     (browser, saat halaman terbuka)
 *
 * Kalau pemetaannya ditulis dua kali, cepat atau lambat keduanya akan
 * berbeda dan menghasilkan bug yang sulit dilacak.
 */

/** Daftar tabel beserta kolom yang perlu diambil. */
export const CONTENT_QUERIES = {
  experiences: "company,role,period,location,summary,points,stack",
  projects: "title,label,role,summary,points,stack",
  landing_pages: "name,tagline,role,url,summary,stack,status,status_label,note",
  focus_areas: "title,description,tools",
  skill_groups: "title,tools",
  skill_icons: "name,icon_url",
  certifications: "title",
  education: "school,degree,location,period,gpa",
  metrics: "value,label",
};

const text = (value) => value ?? "";
const list = (value) => (Array.isArray(value) ? value : []);

export function mapContent(portfolio, raw) {
  const edu = raw.education?.[0] ?? {};

  return {
    profile: {
      name: text(portfolio.name),
      role: text(portfolio.role),
      secondaryRole: text(portfolio.secondary_role),
      email: text(portfolio.email),
      phone: text(portfolio.phone),
      githubPrimary: text(portfolio.github_primary),
      githubPersonal: text(portfolio.github_personal),
      location: text(portfolio.location),
      cv: text(portfolio.cv_url),
      photo: text(portfolio.photo_url),
      intro: text(portfolio.intro),
      about: text(portfolio.about),
    },
    theme: text(portfolio.theme) || "default",
    metrics: list(raw.metrics).map((m) => ({
      value: text(m.value),
      label: text(m.label),
    })),
    experiences: list(raw.experiences).map((e) => ({
      company: text(e.company),
      role: text(e.role),
      period: text(e.period),
      location: text(e.location),
      summary: text(e.summary),
      points: list(e.points),
      stack: list(e.stack),
    })),
    projects: list(raw.projects).map((p) => ({
      title: text(p.title),
      label: text(p.label),
      role: text(p.role),
      stack: list(p.stack),
      summary: text(p.summary),
      points: list(p.points),
    })),
    landingPages: list(raw.landing_pages).map((l) => ({
      name: text(l.name),
      tagline: text(l.tagline),
      role: text(l.role),
      url: text(l.url),
      summary: text(l.summary),
      stack: list(l.stack),
      status: l.status === "prototype" ? "prototype" : "production",
      statusLabel: text(l.status_label),
      ...(l.note ? { note: l.note } : {}),
    })),
    focusAreas: list(raw.focus_areas).map((f) => ({
      title: text(f.title),
      description: text(f.description),
      tools: list(f.tools),
    })),
    skills: list(raw.skill_groups).map((s) => ({
      title: text(s.title),
      tools: list(s.tools),
    })),
    skillIcons: list(raw.skill_icons).map((s) => ({
      name: text(s.name),
      icon: text(s.icon_url),
    })),
    education: {
      school: text(edu.school),
      degree: text(edu.degree),
      location: text(edu.location),
      period: text(edu.period),
      gpa: text(edu.gpa),
    },
    certifications: list(raw.certifications).map((c) => text(c.title)),
  };
}
