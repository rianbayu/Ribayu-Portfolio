import {
  Award,
  BriefcaseBusiness,
  FolderGit2,
  Gauge,
  GraduationCap,
  Globe,
  Layers3,
  MessageSquare,
  Rocket,
  Sparkles,
  UserRound,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  /** Nama tabel, dipakai dasbor untuk menampilkan jumlah entri. */
  table?: string;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

/**
 * Struktur menu sidebar.
 *
 * Dikelompokkan supaya sebelas menu tidak tampil sebagai satu daftar
 * panjang yang sulit dipindai mata.
 */
export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Ringkasan",
    items: [{ to: "/admin", label: "Dasbor", icon: Gauge }],
  },
  {
    label: "Konten",
    items: [
      {
        to: "/admin/pengalaman",
        label: "Pengalaman",
        icon: BriefcaseBusiness,
        table: "experiences",
      },
      {
        to: "/admin/proyek",
        label: "Proyek",
        icon: FolderGit2,
        table: "projects",
      },
      {
        to: "/admin/landing-page",
        label: "Landing Page",
        icon: Globe,
        table: "landing_pages",
      },
      {
        to: "/admin/cara-kerja",
        label: "Cara Kerja",
        icon: Workflow,
        table: "focus_areas",
      },
      {
        to: "/admin/keahlian",
        label: "Grup Keahlian",
        icon: Layers3,
        table: "skill_groups",
      },
      {
        to: "/admin/ikon-keahlian",
        label: "Ikon Keahlian",
        icon: Sparkles,
        table: "skill_icons",
      },
      {
        to: "/admin/sertifikasi",
        label: "Sertifikasi",
        icon: Award,
        table: "certifications",
      },
      {
        to: "/admin/pendidikan",
        label: "Pendidikan",
        icon: GraduationCap,
        table: "education",
      },
      {
        to: "/admin/metrik",
        label: "Metrik",
        icon: Gauge,
        table: "metrics",
      },
    ],
  },
  {
    label: "Interaksi",
    items: [
      { to: "/admin/buku-tamu", label: "Buku Tamu", icon: MessageSquare },
    ],
  },
  {
    label: "Pengaturan",
    items: [
      { to: "/admin/profil", label: "Profil & Tema", icon: UserRound },
      { to: "/admin/terbitkan", label: "Terbitkan", icon: Rocket },
    ],
  },
];

export const CONTENT_TABLES = NAV_GROUPS.flatMap((group) =>
  group.items.filter((item) => item.table),
) as (NavItem & { table: string })[];
