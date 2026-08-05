import {
  certifications,
  education,
  experiences,
  focusAreas,
  landingPages,
  metrics,
  profile,
  projects,
  skills,
} from "./portfolio";

export type ChatReply = {
  text: string;
  chips?: string[];
};

type Intent = {
  id: string;
  keywords: string[];
  phrases?: string[];
  build: () => ChatReply;
};

const bullet = (items: string[]) => items.map((item) => `• ${item}`).join("\n");

export const quickPrompts = [
  "Pengalaman kerja",
  "Landing page live",
  "Keahlian teknis",
  "Cara menghubungi",
];

export const greetingReply: ChatReply = {
  text: `Halo! Saya asisten portofolio ${profile.name}.\nSaya bisa bantu jelaskan pengalaman, proyek, keahlian, dan cara menghubungi beliau. Mau mulai dari mana?`,
  chips: quickPrompts,
};

const intents: Intent[] = [
  {
    id: "greeting",
    keywords: ["halo", "hai", "hi", "hello", "hey", "pagi", "siang", "sore", "malam", "assalamualaikum"],
    build: () => ({
      text: `Halo! Senang bertemu. Ada yang ingin ditanyakan soal profil ${profile.name}?`,
      chips: quickPrompts,
    }),
  },
  {
    id: "profile",
    keywords: ["siapa", "profil", "tentang", "about", "perkenalan", "biodata", "background"],
    phrases: ["ceritakan diri", "kenalan"],
    build: () => ({
      text: `${profile.name} — ${profile.role} (${profile.secondaryRole}).\n${profile.intro}\n\n${profile.about}`,
      chips: ["Pengalaman kerja", "Keahlian teknis", "Pendidikan"],
    }),
  },
  {
    id: "experience",
    keywords: ["pengalaman", "kerja", "karir", "karier", "perusahaan", "kantor", "experience", "magang", "jabatan", "posisi"],
    phrases: ["riwayat kerja", "pernah kerja"],
    build: () => ({
      text: `Ada ${experiences.length} pengalaman utama:\n${bullet(
        experiences.map(
          (item) => `${item.role} — ${item.company} (${item.period}, ${item.location})`,
        ),
      )}\n\nSaat ini: ${experiences[0].summary}`,
      chips: ["Detail pekerjaan sekarang", "Proyek unggulan", "Keahlian teknis"],
    }),
  },
  {
    id: "current-job",
    keywords: ["sekarang", "terkini", "current", "seleris"],
    phrases: ["pekerjaan sekarang", "kerja dimana", "detail pekerjaan"],
    build: () => {
      const current = experiences[0];
      return {
        text: `${current.role} di ${current.company} (${current.period}).\n${current.summary}\n\n${bullet(
          current.points,
        )}\n\nStack: ${current.stack.join(", ")}.`,
        chips: ["Pengalaman kerja", "Proyek unggulan", "Cara menghubungi"],
      };
    },
  },
  {
    id: "project-government",
    keywords: ["maluku", "pemerintah", "government", "codeigniter"],
    build: () => buildProject(0),
  },
  {
    id: "project-recruitment",
    keywords: ["recruitment", "rekrutmen", "oprec", "bem"],
    phrases: ["open recruitment"],
    build: () => buildProject(1),
  },
  {
    id: "project-camunda",
    keywords: ["camunda", "skripsi", "bpmn", "thesis"],
    phrases: ["proses bisnis"],
    build: () => buildProject(2),
  },
  {
    id: "project-mbkm",
    keywords: ["mbkm", "smart", "command", "penajam"],
    phrases: ["ug-smart", "ug smart"],
    build: () => buildProject(3),
  },
  {
    id: "projects",
    keywords: ["proyek", "project", "portofolio", "portfolio", "karya", "aplikasi", "produk"],
    phrases: ["pernah buat", "hasil kerja"],
    build: () => ({
      text: `Beberapa proyek yang pernah dikerjakan:\n${bullet(
        projects.map((item) => `${item.title} — ${item.label} (${item.role})`),
      )}\n\nSebut salah satu namanya kalau ingin detail, misalnya "Camunda" atau "Open Recruitment".`,
      chips: ["Proyek pemerintah", "Open Recruitment", "Skripsi Camunda"],
    }),
  },
  {
    id: "landing",
    keywords: ["landing", "situs", "website", "web", "live", "demo", "link", "url", "tayang", "deploy", "selica", "salvion", "smi"],
    phrases: ["landing page", "bisa dilihat"],
    build: () => ({
      text: `Ada ${landingPages.length} landing page yang sudah tayang dan bisa dibuka langsung:\n${bullet(
        landingPages.map(
          (page) =>
            `${page.name} (${page.statusLabel}) — ${page.url}\n  ${page.summary}`,
        ),
      )}\n\nPratinjau langsungnya ada di bagian "Landing Page" pada halaman ini.`,
      chips: ["Proyek unggulan", "Keahlian teknis", "Cara menghubungi"],
    }),
  },
  {
    id: "skills",
    keywords: ["keahlian", "skill", "kemampuan", "teknologi", "stack", "framework", "bahasa", "tools", "menguasai"],
    phrases: ["tech stack", "bisa apa"],
    build: () => ({
      text: `Keahlian utama:\n${bullet(
        skills.map((group) => `${group.title}: ${group.tools.join(", ")}`),
      )}`,
      chips: ["Fokus pekerjaan", "Proyek unggulan", "Sertifikasi"],
    }),
  },
  {
    id: "focus",
    keywords: ["fokus", "spesialisasi", "layanan", "cara"],
    phrases: ["cara kerja", "alur kerja", "bisa bantu apa"],
    build: () => ({
      text: `Fokus pengerjaan dibagi tiga:\n${bullet(
        focusAreas.map((area) => `${area.title} — ${area.description}`),
      )}`,
      chips: ["Keahlian teknis", "Proyek unggulan", "Cara menghubungi"],
    }),
  },
  {
    id: "education",
    keywords: ["pendidikan", "kuliah", "kampus", "universitas", "gunadarma", "ipk", "gpa", "jurusan", "lulus", "sarjana"],
    phrases: ["s1", "education"],
    build: () => ({
      text: `${education.degree} — ${education.school} (${education.period}, ${education.location}).\nIPK ${education.gpa}.\n\nSertifikasi:\n${bullet(
        certifications,
      )}`,
      chips: ["Pengalaman kerja", "Keahlian teknis", "Unduh CV"],
    }),
  },
  {
    id: "certification",
    keywords: ["sertifikat", "sertifikasi", "certificate", "pelatihan", "kursus"],
    build: () => ({
      text: `Sertifikasi yang dimiliki:\n${bullet(certifications)}`,
      chips: ["Pendidikan", "Keahlian teknis"],
    }),
  },
  {
    id: "contact",
    keywords: ["kontak", "hubungi", "email", "kirim", "telepon", "hp", "nomor", "whatsapp", "wa", "contact"],
    phrases: ["cara menghubungi", "gimana hubungi"],
    build: () => ({
      text: `Silakan hubungi lewat:\n${bullet([
        `Email: ${profile.email}`,
        `Telepon / WhatsApp: ${profile.phone}`,
        `GitHub: ${profile.githubPrimary}`,
        `Lokasi: ${profile.location}`,
      ])}\n\nBiasanya email paling cepat dibalas.`,
      chips: ["Unduh CV", "Status ketersediaan", "Proyek unggulan"],
    }),
  },
  {
    id: "cv",
    keywords: ["cv", "resume", "unduh", "download", "berkas", "dokumen"],
    build: () => ({
      text: `CV lengkap bisa diunduh di bagian Kontak, atau langsung lewat tombol "CV" di navbar (${profile.cv}).`,
      chips: ["Cara menghubungi", "Pengalaman kerja"],
    }),
  },
  {
    id: "availability",
    keywords: ["tersedia", "ketersediaan", "available", "freelance", "lowongan", "rekrut", "hire", "kolaborasi", "kerjasama", "gaji", "rate"],
    phrases: ["kerja sama", "buka lowongan", "terima project"],
    build: () => ({
      text: `Terbuka untuk peluang front-end, kolaborasi proyek, maupun diskusi kebutuhan sistem.\nUntuk pembahasan lingkup dan timeline, silakan kirim detail ke ${profile.email} atau ${profile.phone}.`,
      chips: ["Cara menghubungi", "Proyek unggulan", "Keahlian teknis"],
    }),
  },
  {
    id: "location",
    keywords: ["lokasi", "domisili", "tinggal", "alamat", "kota", "jakarta", "depok", "remote"],
    build: () => ({
      text: `Berbasis di ${profile.location}. Terbiasa bekerja on-site di area Jabodetabek maupun remote dengan koordinasi tim.`,
      chips: ["Status ketersediaan", "Cara menghubungi"],
    }),
  },
  {
    id: "metrics",
    keywords: ["statistik", "angka", "ringkasan", "highlight", "pencapaian", "prestasi"],
    build: () => ({
      text: `Ringkasan singkat:\n${bullet(metrics.map((item) => `${item.value} — ${item.label}`))}`,
      chips: ["Pengalaman kerja", "Pendidikan", "Proyek unggulan"],
    }),
  },
  {
    id: "ai",
    keywords: ["ai", "chatgpt", "claude", "codex", "prompt", "prompting"],
    build: () => ({
      text: `AI dipakai sebagai alat bantu kerja: eksplorasi solusi, percepatan penulisan kode, review, dan penyusunan dokumentasi — dengan tetap melakukan verifikasi manual sebelum masuk ke produk.\nTools: ChatGPT, Claude, Codex.`,
      chips: ["Keahlian teknis", "Fokus pekerjaan"],
    }),
  },
  {
    id: "thanks",
    keywords: ["terima", "makasih", "thanks", "thank", "mantap", "keren", "oke", "ok", "sip"],
    build: () => ({
      text: "Sama-sama! Kalau ada yang ingin ditanyakan lagi, silakan ketik saja.",
      chips: quickPrompts,
    }),
  },
  {
    id: "bye",
    keywords: ["bye", "dadah", "selesai", "cukup", "pamit"],
    phrases: ["sampai jumpa"],
    build: () => ({
      text: `Terima kasih sudah mampir! Jangan sungkan menghubungi ${profile.email} kalau butuh diskusi lebih lanjut.`,
    }),
  },
  {
    id: "help",
    keywords: ["bantuan", "help", "menu", "opsi", "pilihan"],
    phrases: ["bisa apa aja", "kamu siapa"],
    build: () => ({
      text: "Saya asisten otomatis di portofolio ini. Topik yang bisa saya jawab: profil, pengalaman kerja, proyek, keahlian, pendidikan, sertifikasi, ketersediaan, dan kontak.",
      chips: quickPrompts,
    }),
  },
];

function buildProject(index: number): ChatReply {
  const project = projects[index];

  return {
    text: `${project.title} (${project.label})\nPeran: ${project.role}\n${project.summary}\n\n${bullet(
      project.points,
    )}\n\nStack: ${project.stack.join(", ")}.`,
    chips: ["Proyek lain", "Keahlian teknis", "Cara menghubungi"],
  };
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function scoreIntent(intent: Intent, text: string, tokens: string[]) {
  let score = 0;

  intent.phrases?.forEach((phrase) => {
    if (text.includes(normalize(phrase))) score += 3;
  });

  intent.keywords.forEach((keyword) => {
    const normalized = normalize(keyword);
    if (normalized.includes(" ")) {
      if (text.includes(normalized)) score += 3;
      return;
    }

    if (tokens.includes(normalized)) {
      score += 2;
      return;
    }

    if (normalized.length > 4 && tokens.some((token) => token.startsWith(normalized))) {
      score += 1;
    }
  });

  return score;
}

const fallbackReply: ChatReply = {
  text: `Maaf, saya belum punya jawaban untuk itu. Saya paling paham soal pengalaman kerja, proyek, keahlian, pendidikan, dan kontak ${profile.name}.\nUntuk pertanyaan lain, silakan email ke ${profile.email}.`,
  chips: quickPrompts,
};

export function resolveReply(input: string): ChatReply {
  const text = normalize(input);
  if (!text) return fallbackReply;

  if (text.includes("proyek lain") || text.includes("project lain")) {
    return intents.find((intent) => intent.id === "projects")!.build();
  }

  const tokens = text.split(" ");
  let bestIntent: Intent | null = null;
  let bestScore = 0;

  for (const intent of intents) {
    const score = scoreIntent(intent, text, tokens);
    if (score > bestScore) {
      bestScore = score;
      bestIntent = intent;
    }
  }

  return bestIntent ? bestIntent.build() : fallbackReply;
}
