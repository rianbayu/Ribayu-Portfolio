// Dijalankan lewat: npm run seed
import * as d from "../.seed-tmp/portfolio.js";

const q = (v) => v === null || v === undefined || v === "" ? "null" : `'${String(v).replace(/'/g, "''")}'`;
const arr = (a) => !a?.length ? "'{}'" : `array[${a.map(q).join(", ")}]`;
const P = "(select id from pf)";

const rows = (table, cols, items, map) => {
  if (!items.length) return "";
  const values = items.map((it, i) => `  (${P}, ${i}, ${map(it).join(", ")})`).join(",\n");
  return `insert into public.${table} (portfolio_id, sort_order, ${cols}) values\n${values};\n\n`;
};

let sql = `-- =====================================================================
-- Seed konten portofolio dari src/data/portfolio.ts
-- DIHASILKAN OTOMATIS oleh scripts/generate-seed.mjs -- jangan diedit manual.
--
-- Prasyarat: Anda sudah mendaftar di Authentication > Users dengan email
-- di bawah, dan supabase/cms-schema.sql sudah dijalankan.
-- Aman dijalankan ulang: baris lama milik portofolio ini dihapus dulu.
-- =====================================================================

with pf as (
  insert into public.portfolios (
    owner_id, slug, theme, name, role, secondary_role, email, phone,
    location, cv_url, photo_url, intro, about, github_primary, github_personal
  )
  select u.id, 'rianbayu', 'default',
    ${q(d.profile.name)}, ${q(d.profile.role)}, ${q(d.profile.secondaryRole)},
    ${q(d.profile.email)}, ${q(d.profile.phone)}, ${q(d.profile.location)},
    ${q(d.profile.cv)}, ${q(d.profile.photo)}, ${q(d.profile.intro)},
    ${q(d.profile.about)}, ${q(d.profile.githubPrimary)}, ${q(d.profile.githubPersonal)}
  from auth.users u
  where u.email = ${q(d.profile.email)}
  on conflict (slug) do update set
    name = excluded.name, role = excluded.role, about = excluded.about,
    updated_at = now()
  returning id
)
select id as portfolio_id from pf;

-- Kosongkan konten lama supaya seed bisa diulang tanpa menumpuk.
do $$
declare pid uuid;
begin
  select id into pid from public.portfolios where slug = 'rianbayu';
  if pid is null then
    raise exception 'Portofolio belum ada. Pastikan user dengan email ${d.profile.email} sudah terdaftar di Authentication > Users.';
  end if;
  delete from public.experiences where portfolio_id = pid;
  delete from public.projects where portfolio_id = pid;
  delete from public.landing_pages where portfolio_id = pid;
  delete from public.focus_areas where portfolio_id = pid;
  delete from public.skill_groups where portfolio_id = pid;
  delete from public.skill_icons where portfolio_id = pid;
  delete from public.certifications where portfolio_id = pid;
  delete from public.education where portfolio_id = pid;
  delete from public.metrics where portfolio_id = pid;
end $$;

`.replace(/\(select id from pf\)/g, P);

sql = sql.replace("with pf as", "with pf as"); // no-op, keep readable

// Semua insert berikutnya memakai subquery slug, bukan CTE.
const PF = "(select id from public.portfolios where slug = 'rianbayu')";
const rows2 = (table, cols, items, map) => {
  if (!items.length) return "";
  const values = items.map((it, i) => `  (${PF}, ${i}, ${map(it).join(", ")})`).join(",\n");
  return `insert into public.${table} (portfolio_id, sort_order, ${cols}) values\n${values};\n\n`;
};

sql += rows2("experiences", "company, role, period, location, summary, points, stack", d.experiences,
  (e) => [q(e.company), q(e.role), q(e.period), q(e.location), q(e.summary), arr(e.points), arr(e.stack)]);
sql += rows2("projects", "title, label, role, summary, points, stack", d.projects,
  (p) => [q(p.title), q(p.label), q(p.role), q(p.summary), arr(p.points), arr(p.stack)]);
sql += rows2("landing_pages", "name, tagline, role, url, summary, stack, status, status_label, note", d.landingPages,
  (l) => [q(l.name), q(l.tagline), q(l.role), q(l.url), q(l.summary), arr(l.stack), q(l.status), q(l.statusLabel), q(l.note)]);
sql += rows2("focus_areas", "title, description, tools", d.focusAreas,
  (f) => [q(f.title), q(f.description), arr(f.tools)]);
sql += rows2("skill_groups", "title, tools", d.skills, (s) => [q(s.title), arr(s.tools)]);
sql += rows2("skill_icons", "name, icon_url", d.skillIcons, (s) => [q(s.name), q(s.icon)]);
sql += rows2("certifications", "title", d.certifications.map((t) => ({ t })), (c) => [q(c.t)]);
sql += rows2("education", "school, degree, location, period, gpa", [d.education],
  (e) => [q(e.school), q(e.degree), q(e.location), q(e.period), q(e.gpa)]);
sql += rows2("metrics", "value, label", d.metrics, (m) => [q(m.value), q(m.label)]);

sql += "notify pgrst, 'reload schema';\n";
process.stdout.write(sql);
