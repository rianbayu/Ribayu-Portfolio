import { Download, Github, Mail, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { profile } from "../data/portfolio";
import TetrisRain from "./TetrisRain";

const navItems = [
  { label: "Profil", href: "#profil" },
  { label: "Cara Kerja", href: "#cara-kerja" },
  { label: "Pengalaman", href: "#pengalaman" },
  { label: "Proyek", href: "#proyek" },
  { label: "Landing Page", href: "#landing-page" },
  { label: "Keahlian", href: "#keahlian" },
  { label: "Kontak", href: "#kontak" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 16);

    update();
    window.addEventListener("scroll", update, { passive: true });

    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header
      className={`nav-shell fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-ink/80 backdrop-blur-xl ${
        scrolled ? "is-condensed" : ""
      }`}
    >
      <nav className="site-nav mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a
          href="#home"
          className="nav-logo group flex items-center gap-3"
          aria-label="Rian Bayu Ananda"
        >
          <span className="grid h-9 w-9 place-items-center rounded-md border border-signal/50 bg-signal/10 font-semibold text-paper">
            RB
          </span>
          <span className="hidden text-sm font-semibold text-paper sm:block">
            Rian Bayu Ananda
          </span>
        </a>

        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="nav-link tetris-host rounded-md px-3 py-2 text-sm text-paper/70 transition hover:bg-white/[0.07] hover:text-paper"
            >
              <TetrisRain />
              <span>{item.label}</span>
            </a>
          ))}
        </div>

        <div className="nav-actions hidden items-center gap-2 md:flex">
          <a
            href={profile.githubPersonal}
            target="_blank"
            rel="noopener noreferrer"
            className="tetris-host inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/10 text-paper/75 transition hover:border-signal/60 hover:text-paper"
            aria-label="GitHub Rian Bayu"
            title="GitHub"
          >
            <TetrisRain />
            <Github size={18} />
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="tetris-host inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/10 text-paper/75 transition hover:border-ember/60 hover:text-paper"
            aria-label="Email Rian Bayu"
            title="Email"
          >
            <TetrisRain />
            <Mail size={18} />
          </a>
          <a
            href={profile.cv}
            className="tetris-host inline-flex items-center gap-2 rounded-md bg-paper px-4 py-2 text-sm font-semibold text-ink transition hover:bg-brass"
          >
            <TetrisRain />
            <Download size={16} />
            <span>CV</span>
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/10 text-paper md:hidden"
          aria-label={open ? "Tutup menu" : "Buka menu"}
        >
          {open ? <X size={19} /> : <Menu size={19} />}
        </button>
      </nav>

      {open && (
        <div className="mobile-menu border-t border-white/10 bg-ink px-4 py-3 md:hidden">
          <div className="mx-auto grid max-w-7xl gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="nav-link tetris-host rounded-md px-3 py-3 text-sm text-paper/80 hover:bg-white/[0.07] hover:text-paper"
              >
                <TetrisRain />
                <span>{item.label}</span>
              </a>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2">
              <a
                href={`mailto:${profile.email}`}
                className="tetris-host inline-flex items-center justify-center gap-2 rounded-md border border-white/10 px-3 py-3 text-sm text-paper"
              >
                <TetrisRain />
                <Mail size={16} />
                <span>Email</span>
              </a>
              <a
                href={profile.cv}
                className="tetris-host inline-flex items-center justify-center gap-2 rounded-md bg-paper px-3 py-3 text-sm font-semibold text-ink"
              >
                <TetrisRain />
                <Download size={16} />
                <span>CV</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
