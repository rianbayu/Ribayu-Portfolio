import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  Award,
  BriefcaseBusiness,
  CheckCircle2,
  Code2,
  Database,
  Download,
  ExternalLink,
  FileCode2,
  Github,
  GraduationCap,
  Layers3,
  Mail,
  MapPin,
  Phone,
  TestTube2,
  Workflow,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from "react";
import ChatWidget from "./components/ChatWidget";
import LandingPreviewCard from "./components/LandingPreviewCard";
import LiveStats from "./components/LiveStats";
import Navbar from "./components/Navbar";
import ProfilePin from "./components/ProfilePin";
import ScrollTopButton from "./components/ScrollTopButton";
import SectionHeading from "./components/SectionHeading";
import SplashScreen from "./components/SplashScreen";
import TetrisRain from "./components/TetrisRain";
import {
  certifications,
  education,
  experiences,
  focusAreas,
  landingPages,
  metrics,
  profile,
  projects,
  skillIcons,
  skills,
  type Project,
} from "./data/portfolio";
import AnimatedWave from "./components/AnimatedWave";

const skillIconsByIndex = [Code2, Database, Workflow, Layers3];
const focusIconsByIndex = [FileCode2, Workflow, TestTube2, CheckCircle2];

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (showSplash) return undefined;

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const handleAnchorClick = (event: globalThis.MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;

      const anchor = (
        event.target as Element | null
      )?.closest<HTMLAnchorElement>('a[href^="#"]');
      const hash = anchor?.getAttribute("href");
      if (!anchor || !hash || hash === "#") return;

      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (!target) return;

      event.preventDefault();
      const targetTop =
        target.getBoundingClientRect().top + window.scrollY - 72;

      window.scrollTo({
        top: Math.max(0, targetTop),
        left: 0,
        behavior: reduceMotion ? "auto" : "smooth",
      });
      window.history.pushState(null, "", hash);
    };

    document.addEventListener("click", handleAnchorClick);

    const revealElements = Array.from(
      document.querySelectorAll<HTMLElement>(".reveal, .timeline-item"),
    );
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    revealElements.forEach((element, index) => {
      element.style.setProperty(
        "--reveal-delay",
        `${Math.min(index % 8, 7) * 42}ms`,
      );
      revealObserver.observe(element);
    });

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      revealObserver.disconnect();
    };
  }, [showSplash]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-ink text-paper">
      <a className="skip-link" href="#main-content">
        Lewati ke konten utama
      </a>
      <div className="site-atmosphere" aria-hidden="true" />
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <Navbar />
      <main id="main-content">
        <Hero splashDone={!showSplash} />
        <ProfileSection />
        <FocusSection />
        <ExperienceSection />
        <ProjectsSection />
        <LandingPagesSection />
        <SkillsSection />
        <EducationSection />
        <StatsSection />
        <ContactSection />
        <Footer />
      </main>
      {!showSplash && (
        <div className="floating-dock">
          <ChatWidget />
          <ScrollTopButton />
        </div>
      )}
    </div>
  );
}

function Hero({ splashDone }: { splashDone: boolean }) {
  return (
    <section
      id="home"
      className="hero-shell relative isolate overflow-hidden border-b border-white/10 bg-ink pt-16"
    >
      <div className="figma-starfield" aria-hidden="true">
        <span className="meteor meteor-a" />
        <span className="meteor meteor-b" />
        <span className="meteor meteor-c" />
      </div>
      <div className="cosmic-ring cosmic-ring-a" aria-hidden="true" />
      <div className="cosmic-ring cosmic-ring-b" aria-hidden="true" />
      <div className="hero-measure" aria-hidden="true" />
      <div className="hero-layout relative z-10 mx-auto grid min-h-[92svh] max-w-7xl items-center px-4 py-20 sm:px-6 lg:grid-cols-[0.96fr_1.04fr] lg:px-8">
        <div className="hero-centerpiece lg:col-span-2">
          <ProfilePin start={splashDone} />
        </div>
        <div className="hero-copy min-w-0 max-w-3xl">
          <p className="hero-badge mb-4 inline-flex items-center gap-2 rounded-md border border-signal/40 bg-signal/10 px-3 py-2 text-sm font-medium text-signal">
            <BriefcaseBusiness size={16} />
            Portfolio Personal · Front-End Developer
          </p>
          <h1 className="hero-title font-display text-4xl font-semibold leading-tight text-paper sm:text-6xl lg:text-7xl">
            <span className="block lg:inline">Rian Bayu</span>
            <span className="block lg:inline"> Ananda</span>
          </h1>
          <p className="hero-rank mt-4">
            {profile.role} / {profile.secondaryRole}
          </p>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-paper/75">
            {profile.intro}
          </p>
          <div className="hero-proofline mt-7 flex max-w-2xl flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-paper/70">
            <span>Landing page</span>
            <span>Dashboard UI</span>
            <span>REST API</span>
            <span>Testing flow</span>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#proyek"
              className="primary-action tetris-host inline-flex items-center justify-center gap-2 rounded-md bg-signal px-5 py-3 text-sm font-semibold text-ink transition hover:bg-brass"
            >
              <TetrisRain />
              <span>Lihat Proyek</span>
              <ArrowRight size={17} />
            </a>
            <a
              href={profile.cv}
              className="secondary-action tetris-host inline-flex items-center justify-center gap-2 rounded-md border border-paper/20 px-5 py-3 text-sm font-semibold text-paper transition hover:border-ember/70 hover:text-ember"
            >
              <TetrisRain />
              <Download size={17} />
              <span>Download CV</span>
            </a>
          </div>
          <div className="hero-socials mt-5 flex flex-wrap gap-3">
            <a
              className="tetris-host"
              href={profile.githubPersonal}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Rian Bayu"
            >
              <TetrisRain />
              <Github size={17} />
              <span>GitHub</span>
            </a>
            <a
              className="tetris-host"
              href={`mailto:${profile.email}`}
              aria-label="Email Rian Bayu"
            >
              <TetrisRain />
              <Mail size={17} />
              <span>Email</span>
            </a>
          </div>
          <div className="mt-10 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="metric-tile tetris-host rounded-md border border-white/10 bg-white/[0.06] p-4"
              >
                <TetrisRain />
                <p className="text-2xl font-semibold text-paper">
                  {metric.value}
                </p>
                <p className="mt-1 text-xs leading-5 text-paper/60">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
        </div>
        <HeroShowcase />
      </div>
    </section>
  );
}

function HeroShowcase() {
  const deliverySteps = [
    { label: "Analisis", value: "Kebutuhan" },
    { label: "Implementasi", value: "Interface" },
    { label: "Validasi", value: "Testing" },
  ];
  const deliverySignals = ["Responsive UI", "REST API", "Flow Testing"];

  return (
    <div className="hero-showcase reveal relative mt-14 min-h-[430px] lg:mt-0">
      <div className="showcase-frame tetris-host">
        <TetrisRain />
        <div className="showcase-topbar">
          <span />
          <span />
          <span />
          <p>rianbayu.delivery</p>
        </div>

        <div className="showcase-head">
          <div>
            <small className="showcase-kicker">Delivery Preview</small>
            <p>Web Interface Delivery</p>
          </div>
          <span>Available</span>
        </div>

        <div className="delivery-board">
          <div className="delivery-primary tetris-host">
            <TetrisRain />
            <div>
              <span>Current Focus</span>
              <strong>Design menjadi interface yang siap dipakai.</strong>
            </div>
          </div>

          <div className="delivery-signals">
            {deliverySignals.map((signal, index) => (
              <div key={signal} className="delivery-signal tetris-host">
                <TetrisRain />
                <span>0{index + 1}</span>
                <p>{signal}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="showcase-terminal">
          <div>
            <span>01</span>
            <p>
              Menerjemahkan kebutuhan bisnis dan desain menjadi layout
              responsif.
            </p>
          </div>
          <div>
            <span>02</span>
            <p>
              Menghubungkan interface dengan REST API dan alur data yang jelas.
            </p>
          </div>
          <div>
            <span>03</span>
            <p>
              Melakukan validasi flow, bug fixing, dan dokumentasi serah terima.
            </p>
          </div>
        </div>

        <AnimatedWave className="showcase-wave" />

        <div className="showcase-footer">
          {deliverySteps.map((step, index) => (
            <div key={step.label} className="showcase-step tetris-host">
              <TetrisRain />
              <span>0{index + 1}</span>
              <p>{step.label}</p>
              <small>{step.value}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


function ProfileSection() {
  return (
    <section
      id="profil"
      className="dark-zone px-4 py-20 text-paper sm:px-6 lg:px-8"
    >
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <SectionHeading
          eyebrow="Profil"
          title="Front-end yang memahami alur sistem dan validasi produk."
          description={profile.about}
        />
        <div className="reveal grid gap-4 sm:grid-cols-2">
          <InfoTile
            icon={<MapPin size={20} />}
            label="Lokasi"
            value={profile.location}
          />
          <InfoTile
            icon={<Mail size={20} />}
            label="Email"
            value={profile.email}
            href={`mailto:${profile.email}`}
          />
          <InfoTile
            icon={<Phone size={20} />}
            label="Telepon"
            value={profile.phone}
            href={`tel:${profile.phone}`}
          />
          <InfoTile
            icon={<Github size={20} />}
            label="GitHub"
            value="RiBayu-Seleris / rianbayu"
            href={profile.githubPersonal}
          />
        </div>
      </div>
    </section>
  );
}

function FocusSection() {
  return (
    <section
      id="cara-kerja"
      className="bg-[#11110f] px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Cara Kerja"
          title="Merapikan kebutuhan menjadi interface yang bisa dipakai."
          description="Setiap pekerjaan diarahkan ke alur yang jelas: memahami kebutuhan, menyusun UI, menghubungkan data, lalu menguji hasilnya sebelum diserahkan."
        />
        <div className="process-strip reveal mb-8">
          {focusAreas.map((item, index) => (
            <div
              key={`process-${item.title}`}
              className="process-node tetris-host"
            >
              <TetrisRain />
              <span>0{index + 1}</span>
              <p>{item.title}</p>
            </div>
          ))}
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {focusAreas.map((item, index) => {
            const Icon = focusIconsByIndex[index] ?? CheckCircle2;

            return (
              <article
                key={item.title}
                className="focus-card tetris-host reveal rounded-md border border-white/10 bg-ink/80 p-5"
              >
                <TetrisRain />
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-md bg-signal/10 text-signal">
                  <Icon size={21} />
                </div>
                <h3 className="text-xl font-semibold text-paper">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-paper/70">
                  {item.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {item.tools.map((tool) => (
                    <span
                      key={`${item.title}-${tool}`}
                      className="rounded-md border border-white/10 bg-white/[0.05] px-2.5 py-1.5 text-xs text-paper/70"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function InfoTile({
  icon,
  label,
  value,
  href,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="profile-tile tetris-host group rounded-md border border-ink/10 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-signal/60 hover:shadow-focus">
      <TetrisRain />
      <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-md bg-ink text-signal">
        {icon}
      </div>
      <p className="text-sm font-medium text-ink/60">{label}</p>
      <p className="mt-2 break-words text-base font-semibold text-ink">
        {value}
      </p>
    </div>
  );

  if (!href) return content;

  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {content}
    </a>
  );
}

function ExperienceSection() {
  return (
    <section
      id="pengalaman"
      className="section-grid bg-ink px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Pengalaman"
          title="Dari analisis proses sampai implementasi antarmuka."
          description="Pengalaman kerja dan organisasi yang membentuk kombinasi teknis, komunikasi, dokumentasi, dan leadership."
        />
        <div className="relative grid gap-5">
          {experiences.map((item, index) => (
            <article
              key={`${item.company}-${item.role}`}
              className="experience-card tetris-host timeline-item grid gap-5 rounded-md border border-white/10 bg-graphite/90 p-5 shadow-xl shadow-black/20 lg:grid-cols-[0.36fr_0.64fr]"
            >
              <TetrisRain />
              <div>
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-md bg-signal/10 text-signal">
                  <BriefcaseBusiness size={20} />
                </div>
                <p className="text-sm font-semibold text-brass">
                  {item.period}
                </p>
                <h3 className="mt-3 text-xl font-semibold text-paper">
                  {item.role}
                </h3>
                <p className="mt-2 text-sm text-paper/60">
                  {item.company} · {item.location}
                </p>
              </div>
              <div>
                <p className="text-base leading-7 text-paper/75">
                  {item.summary}
                </p>
                <ul className="mt-5 grid gap-3">
                  {item.points.map((point) => (
                    <li
                      key={point}
                      className="flex gap-3 text-sm leading-6 text-paper/70"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-sm bg-ember" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex flex-wrap gap-2">
                  {item.stack.map((tool) => (
                    <span
                      key={`${index}-${tool}`}
                      className="rounded-md border border-white/10 bg-white/[0.05] px-2.5 py-1.5 text-xs text-paper/70"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const pin = pinRef.current;
    if (!section || !pin) return undefined;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion || window.matchMedia("(max-width: 767px)").matches) {
      setActiveProjectIndex(0);
      return undefined;
    }

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: () =>
        `+=${Math.max(projects.length, 1) * window.innerHeight * 0.86}`,
      pin,
      scrub: 0.85,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const nextIndex = Math.min(
          projects.length - 1,
          Math.floor(self.progress * projects.length),
        );
        if (activeIndexRef.current === nextIndex) return;
        activeIndexRef.current = nextIndex;
        setActiveProjectIndex(nextIndex);
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="proyek"
      className="projects-section bg-[#11110f] px-4 py-24 sm:px-6 lg:px-8"
    >
      <div ref={pinRef} className="projects-pin mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Proyek"
              title="Project yang fokus pada workflow nyata."
              description="Kumpulan pekerjaan dari CV: sistem pemerintahan, rekrutmen, proses bisnis, dan program implementasi aplikasi."
            />
            <div className="project-index-list reveal">
              {projects.map((project, index) => (
                <div
                  key={`project-index-${project.title}`}
                  className={
                    index === activeProjectIndex ? "is-active" : undefined
                  }
                  aria-current={
                    index === activeProjectIndex ? "step" : undefined
                  }
                >
                  <span>0{index + 1}</span>
                  <p>{project.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="project-stack">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.title}
                project={project}
                index={index}
                active={index === activeProjectIndex}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function LandingPagesSection() {
  return (
    <section
      id="landing-page"
      className="landing-section border-y border-white/10 bg-ink px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Landing Page"
          title="Halaman yang sudah tayang dan bisa dibuka langsung."
          description="Landing page yang saya kerjakan sebagai front-end, dua di antaranya sudah tayang di domain produksi perusahaan. Pratinjau di bawah menampilkan versi desktop dari situs aslinya secara langsung."
        />

        <div className="landing-grid reveal">
          {landingPages.map((page) => (
            <LandingPreviewCard key={page.url} page={page} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  index,
  active = true,
}: {
  project: Project;
  index: number;
  active?: boolean;
}) {
  const handleMove = (event: MouseEvent<HTMLElement>) => {
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = (x / rect.width - 0.5) * 5;
    const rotateX = (y / rect.height - 0.5) * -5;
    element.style.setProperty("--rx", `${rotateX}deg`);
    element.style.setProperty("--ry", `${rotateY}deg`);
  };

  const reset = (event: MouseEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--rx", "0deg");
    event.currentTarget.style.setProperty("--ry", "0deg");
  };

  return (
    <article
      className={`project-card tetris-host min-h-[360px] rounded-md border border-white/10 bg-ink/80 p-5 transition duration-300 hover:border-signal/60 ${
        active ? "is-active" : ""
      }`}
      onMouseMove={handleMove}
      onMouseLeave={reset}
    >
      <TetrisRain />
      <div className="mb-8 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="project-number">0{index + 1}</span>
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-paper text-ink">
            {index % 2 === 0 ? <Workflow size={22} /> : <Code2 size={22} />}
          </div>
        </div>
        <span className="rounded-md border border-brass/30 bg-brass/10 px-3 py-1.5 text-xs font-medium text-brass">
          {project.label}
        </span>
      </div>
      <p className="text-sm font-semibold text-signal">{project.role}</p>
      <h3 className="mt-2 text-2xl font-semibold text-paper">
        {project.title}
      </h3>
      <p className="mt-4 text-sm leading-7 text-paper/70">{project.summary}</p>
      <ul className="mt-5 grid gap-2">
        {project.points.map((point) => (
          <li
            key={point}
            className="flex gap-3 text-sm leading-6 text-paper/60"
          >
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-sm bg-moss" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-wrap gap-2">
        {project.stack.map((tool) => (
          <span
            key={`${project.title}-${tool}`}
            className="rounded-md border border-white/10 bg-white/[0.05] px-2.5 py-1.5 text-xs text-paper/70"
          >
            {tool}
          </span>
        ))}
      </div>
    </article>
  );
}

function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const activeStepRef = useRef(0);
  const totalSkillSteps = skillIcons.length;
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const pin = pinRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!section || !pin || !viewport || !track) return undefined;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) {
      setActiveStep(0);
      return undefined;
    }

    const isCompactViewport = window.matchMedia("(max-width: 767px)").matches;
    const maxX = () => Math.min(0, -(track.scrollWidth - viewport.clientWidth));
    const tween = gsap.to(track, {
      x: maxX,
      ease: "none",
      paused: true,
    });

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: () =>
        `+=${Math.max(totalSkillSteps - 1, 1) * window.innerHeight * (isCompactViewport ? 0.38 : 0.52)}`,
      pin,
      scrub: isCompactViewport ? 0.58 : 0.72,
      animation: tween,
      snap:
        totalSkillSteps > 1
          ? {
              snapTo: 1 / (totalSkillSteps - 1),
              duration: { min: 0.12, max: 0.36 },
              delay: 0.04,
              ease: "power1.out",
            }
          : undefined,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const nextStep = Math.min(
          totalSkillSteps - 1,
          Math.round(self.progress * (totalSkillSteps - 1)),
        );
        if (activeStepRef.current === nextStep) return;
        activeStepRef.current = nextStep;
        setActiveStep(nextStep);
      },
    });

    return () => {
      trigger.kill();
      tween.kill();
    };
  }, [totalSkillSteps]);

  const activeLabel = skillIcons[activeStep]?.name ?? "Skill";

  return (
    <section
      ref={sectionRef}
      id="keahlian"
      className="skills-section dark-zone px-4 py-24 text-paper sm:px-6 lg:px-8"
    >
      <div ref={pinRef} className="skills-pin mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Keahlian"
          title="Stack praktis untuk membangun, menguji, dan mengirim UI."
          description="Skill utama diambil dari CV, dengan penekanan pada front-end, integrasi API, tooling, dan pengembangan berbantuan AI."
        />

        <div className="skills-horizontal-shell">
          <div className="skills-horizontal-head">
            <div>
              <span>Urutan stack</span>
              <p>{activeLabel}</p>
            </div>
            <strong>
              {String(activeStep + 1).padStart(2, "0")} /{" "}
              {String(totalSkillSteps).padStart(2, "0")}
            </strong>
          </div>

          <div className="skills-progress-track" aria-hidden="true">
            <span
              style={{
                width: `${((activeStep + 1) / totalSkillSteps) * 100}%`,
              }}
            />
          </div>

          <div ref={viewportRef} className="skills-horizontal-viewport">
            <div ref={trackRef} className="skills-horizontal-track">
              {skillIcons.map((item, index) => (
                <div
                  key={item.name}
                  className={`skill-snap-slide ${index <= activeStep ? "is-seen" : ""} ${index === activeStep ? "is-active" : ""}`}
                >
                  <article className="skill-snap-card skill-snap-icon-card skill-icon tetris-host rounded-md border border-ink/10 bg-white p-6 text-center shadow-sm">
                    <TetrisRain />
                    <img
                      src={item.icon}
                      alt=""
                      width="92"
                      height="92"
                      loading="lazy"
                      decoding="async"
                    />
                    <h3>{item.name}</h3>
                  </article>
                </div>
              ))}
            </div>
          </div>

          <div className="skills-snap-dots" aria-hidden="true">
            {Array.from({ length: totalSkillSteps }).map((_, index) => (
              <span
                key={`skill-step-${index}`}
                className={index <= activeStep ? "is-active" : ""}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="skill-category-showcase mx-auto mt-14 max-w-7xl">
        <div className="skill-category-heading reveal">
          <span>Ruang kerja</span>
          <h3>Area kemampuan yang dipakai dalam workflow nyata.</h3>
        </div>
        <div className="skill-category-grid">
          {skills.map((group, index) => {
            const Icon = skillIconsByIndex[index] ?? Code2;
            return (
              <article
                key={group.title}
                className="skill-card skill-category-card tetris-host reveal rounded-md border border-ink/10 bg-white p-5"
                style={{ "--reveal-delay": `${index * 90}ms` } as CSSProperties}
              >
                <TetrisRain />
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-md bg-ink text-signal">
                  <Icon size={21} />
                </div>
                <h3 className="text-xl font-semibold text-ink">
                  {group.title}
                </h3>
                <div className="mt-5 flex flex-wrap gap-2">
                  {group.tools.map((tool) => (
                    <span
                      key={`${group.title}-${tool}`}
                      className="rounded-md border border-ink/10 bg-paper px-2.5 py-1.5 text-xs font-medium text-ink/70"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section
      id="statistik"
      className="stats-section bg-[#11110f] px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Statistik"
          title="Angka yang memperbarui dirinya sendiri."
          description="Empat penanda hidup dari portofolio ini: berapa kali dikunjungi, jumlah repositori publik, waktu setempat, dan kapan terakhir diperbarui."
        />
        <LiveStats />
      </div>
    </section>
  );
}

function EducationSection() {
  return (
    <section
      id="pendidikan"
      className="section-grid bg-ink px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <SectionHeading
            eyebrow="Pendidikan"
            title="Sistem Informasi dengan fondasi analisis dan pengembangan web."
          />
          <article className="education-card tetris-host reveal rounded-md border border-white/10 bg-graphite p-6">
            <TetrisRain />
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-md bg-brass/15 text-brass">
              <GraduationCap size={23} />
            </div>
            <h3 className="text-2xl font-semibold text-paper">
              {education.school}
            </h3>
            <p className="mt-2 text-paper/70">{education.degree}</p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Detail label="Lokasi" value={education.location} />
              <Detail label="Periode" value={education.period} />
              <Detail label="GPA" value={education.gpa} />
              <Detail label="Status" value="S.Kom." />
            </div>
          </article>
        </div>

        <div>
          <SectionHeading
            eyebrow="Sertifikasi"
            title="Pelatihan web dan pemrograman."
          />
          <div className="grid gap-3">
            {certifications.map((certification) => (
              <div
                key={certification}
                className="certification-row tetris-host reveal flex items-center gap-4 rounded-md border border-white/10 bg-white/[0.05] p-4"
              >
                <TetrisRain />
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-ember/15 text-ember">
                  <Award size={19} />
                </span>
                <p className="font-medium text-paper/80">{certification}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="detail-tile tetris-host rounded-md border border-white/10 bg-white/[0.05] p-4">
      <TetrisRain />
      <p className="text-xs uppercase text-paper/40">{label}</p>
      <p className="mt-2 font-semibold text-paper">{value}</p>
    </div>
  );
}

function ContactSection() {
  return (
    <section
      id="kontak"
      className="contact-band dark-zone relative overflow-hidden px-4 py-24 text-paper sm:px-6 lg:px-8"
    >
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-end">
        <div className="reveal">
          <p className="mb-3 text-sm font-semibold uppercase text-signal">
            Kontak
          </p>
          <h2 className="font-display text-4xl font-semibold text-paper sm:text-5xl">
            Siap membangun interface yang rapi, responsif, dan bisa diuji.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-paper/70">
            Untuk diskusi project, kerja sama, atau proses rekrutmen, hubungi
            saya lewat email atau lihat repository GitHub yang tersedia di CV.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={`mailto:${profile.email}`}
              className="tetris-host inline-flex items-center justify-center gap-2 rounded-md bg-ink px-5 py-3 text-sm font-semibold text-paper transition hover:bg-signal hover:text-ink"
            >
              <TetrisRain />
              <Mail size={17} />
              <span>Kirim Email</span>
            </a>
            <a
              href={profile.githubPersonal}
              target="_blank"
              rel="noopener noreferrer"
              className="tetris-host inline-flex items-center justify-center gap-2 rounded-md border border-paper/15 px-5 py-3 text-sm font-semibold text-paper transition hover:border-ember/60 hover:text-ember"
            >
              <TetrisRain />
              <Github size={17} />
              <span>GitHub</span>
              <ExternalLink size={15} />
            </a>
          </div>
        </div>

        <div className="contact-card tetris-host reveal rounded-md border border-ink/10 bg-white p-5">
          <TetrisRain />
          <div className="grid gap-3">
            <ContactRow
              icon={<Mail size={18} />}
              label="Email"
              value={profile.email}
              href={`mailto:${profile.email}`}
            />
            <ContactRow
              icon={<Phone size={18} />}
              label="Telepon"
              value={profile.phone}
              href={`tel:${profile.phone}`}
            />
            <ContactRow
              icon={<MapPin size={18} />}
              label="Lokasi"
              value={profile.location}
            />
            <ContactRow
              icon={<Download size={18} />}
              label="CV"
              value="CV_RianBayuAnanda.pdf"
              href={profile.cv}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink px-4 py-8 text-paper sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <a
            href="#home"
            className="inline-flex items-center gap-3"
            aria-label="Kembali ke atas"
          >
            <span className="grid h-9 w-9 place-items-center rounded-md border border-signal/50 bg-signal/10 font-semibold text-paper">
              RB
            </span>
            <span>
              <span className="block text-sm font-semibold">
                {profile.name}
              </span>
              <span className="block text-xs text-paper/55">
                {profile.role} / {profile.secondaryRole}
              </span>
            </span>
          </a>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm text-paper/60">
          <a
            href="#proyek"
            className="rounded-md px-3 py-2 transition hover:bg-white/[0.07] hover:text-paper"
          >
            Proyek
          </a>
          <a
            href="#keahlian"
            className="rounded-md px-3 py-2 transition hover:bg-white/[0.07] hover:text-paper"
          >
            Keahlian
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="rounded-md px-3 py-2 transition hover:bg-white/[0.07] hover:text-paper"
          >
            Email
          </a>
          <a
            href={profile.githubPersonal}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md px-3 py-2 transition hover:bg-white/[0.07] hover:text-paper"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="contact-row tetris-host flex items-center gap-3 rounded-md border border-ink/10 bg-paper p-3 transition hover:border-signal/50">
      <TetrisRain />
      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-ink text-signal">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-semibold uppercase text-ink/50">
          {label}
        </span>
        <span className="block truncate text-sm font-semibold text-ink">
          {value}
        </span>
      </span>
    </div>
  );

  if (!href) return content;

  return (
    <a
      href={href}
      target={
        href.startsWith("http") || href.endsWith(".pdf") ? "_blank" : undefined
      }
      rel={
        href.startsWith("http") || href.endsWith(".pdf")
          ? "noopener noreferrer"
          : undefined
      }
    >
      {content}
    </a>
  );
}

export default App;
