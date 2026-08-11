// BERKAS INI DIHASILKAN OTOMATIS -- JANGAN DIEDIT MANUAL.
// Sumber: Supabase, ditarik oleh scripts/fetch-content.mjs saat build.
// Untuk mengubah isinya, gunakan panel admin di /admin lalu build ulang.
// Terakhir ditarik: 2026-08-11T12:01:03.741Z

import type {
  Experience,
  FocusArea,
  LandingPage,
  Project,
} from "./portfolio";

export const profile = {
  "name": "Rian Bayu Ananda",
  "role": "Front-End Web Developer",
  "secondaryRole": "System Analyst",
  "email": "ribayu1204@gmail.com",
  "phone": "+62-859-5977-2116",
  "githubPrimary": "https://github.com/RiBayu-Seleris",
  "githubPersonal": "https://github.com/rianbayu",
  "location": "Jakarta / Depok, Indonesia",
  "cv": "/files/CV_RianBayuAnanda.pdf",
  "photo": "/images/komari.webp",
  "intro": "Lulusan S1 Sistem Informasi Universitas Gunadarma dengan fokus pada pengembangan antarmuka, integrasi REST API, dan pengujian fitur aplikasi.",
  "about": "Saya berpengalaman membangun landing page, website internal, dashboard admin, dan aplikasi berbasis kebutuhan bisnis. Kekuatan saya ada pada penerjemahan desain UI/UX menjadi interface responsif, kolaborasi dengan tim, dokumentasi alur sistem, serta validasi fitur agar produk tetap stabil dan mudah digunakan."
};

export const theme = "default";

export const metrics = [
  {
    "value": "2025",
    "label": "Lulus S.Kom."
  },
  {
    "value": "3.49",
    "label": "GPA Universitas Gunadarma"
  },
  {
    "value": "2025",
    "label": "Front-End Developer aktif"
  },
  {
    "value": "8+",
    "label": "Project web dan sistem"
  }
];

export const experiences: Experience[] = [
  {
    "company": "PT Seleris Meditekno Internasional",
    "role": "Front-End Web Developer",
    "period": "Jun 2025 - Sekarang",
    "location": "Jakarta",
    "summary": "Mengembangkan landing page dan antarmuka aplikasi berdasarkan kebutuhan bisnis serta desain UI/UX.",
    "points": [
      "Membuat dan mengembangkan landing page perusahaan dan proyek baru.",
      "Mengintegrasikan RESTful API untuk mendukung fungsionalitas aplikasi.",
      "Menerapkan desain UI/UX menjadi kode responsif, terstruktur, dan mudah dipelihara.",
      "Melakukan pemeliharaan, pengembangan fitur, pengujian, dan perbaikan pada proyek berjalan."
    ],
    "stack": [
      "Vue.js 3",
      "Tailwind CSS",
      "HTML",
      "CSS",
      "JavaScript",
      "ChatGPT",
      "Claude",
      "Codex"
    ]
  },
  {
    "company": "PT Rynest Technology Indomedia",
    "role": "System Analyst",
    "period": "Jun 2023 - Jan 2024",
    "location": "Depok",
    "summary": "Menganalisis kebutuhan bisnis dan menerjemahkannya menjadi alur sistem untuk aplikasi rekrutmen.",
    "points": [
      "Menyusun spesifikasi fungsional, alur kerja, struktur data, dan dokumentasi API.",
      "Merancang proses bisnis dan dokumentasi teknis untuk aplikasi rekrutmen.",
      "Melakukan pengujian alur kerja, fungsionalitas, dan kegunaan sistem."
    ],
    "stack": [
      "Postman",
      "Draw.io",
      "Dokumentasi API",
      "User Guide"
    ]
  },
  {
    "company": "BEM FIKTI Universitas Gunadarma",
    "role": "Kepala Biro Pengembangan Teknologi Informasi",
    "period": "Okt 2021 - Agu 2022",
    "location": "Depok",
    "summary": "Memimpin tim pengembangan teknologi informasi untuk website kegiatan fakultas dan sistem organisasi.",
    "points": [
      "Mengelola pembagian tugas dan memantau progres proyek menggunakan Trello.",
      "Melakukan review dan pengujian website yang dikembangkan oleh anggota tim.",
      "Mengembangkan website pendaftaran, informasi kegiatan, Open Recruitment, dan website resmi BEM FIKTI."
    ],
    "stack": [
      "PHP 7/8",
      "MySQL",
      "Bootstrap 4",
      "Trello",
      "FileZilla",
      "MySQL Workbench"
    ]
  },
  {
    "company": "BEM FIKTI Universitas Gunadarma",
    "role": "Anggota Biro Pengembangan Teknologi Informasi",
    "period": "Sep 2020 - Sep 2021",
    "location": "Depok",
    "summary": "Mengembangkan website pendukung kegiatan organisasi dan dokumentasi teknis proyek.",
    "points": [
      "Mengembangkan website pendaftaran dan informasi kegiatan fakultas.",
      "Mengembangkan website Open Recruitment dan website pendukung struktur organisasi BEM.",
      "Membuat dokumentasi proyek dan dokumentasi teknis menggunakan Milanote."
    ],
    "stack": [
      "PHP 7",
      "MySQL",
      "Bootstrap 4",
      "Milanote",
      "FileZilla",
      "MySQL Workbench"
    ]
  }
];

export const projects: Project[] = [
  {
    "title": "Aplikasi Web Pemerintah Provinsi Maluku Utara",
    "label": "Government Web App",
    "role": "Front-End Web Developer",
    "stack": [
      "PHP 8",
      "MySQL",
      "Bootstrap 4",
      "CodeIgniter 3",
      "REST API",
      "Git"
    ],
    "summary": "Antarmuka web pemerintahan yang responsif dengan integrasi API untuk kebutuhan operasional sistem.",
    "points": [
      "Menerapkan desain UI/UX menjadi halaman web responsif dan mudah digunakan.",
      "Mengintegrasikan RESTful API dengan antarmuka aplikasi.",
      "Melakukan pengujian serta perbaikan bug untuk memastikan stabilitas aplikasi."
    ]
  },
  {
    "title": "Aplikasi Open Recruitment BEM",
    "label": "Recruitment Platform",
    "role": "Full Project Contributor",
    "stack": [
      "Node.js",
      "Flutter",
      "Vue.js",
      "Figma",
      "REST API"
    ],
    "summary": "Sistem rekrutmen end-to-end dengan mobile app, website admin, dokumentasi teknis, dan integrasi backend.",
    "points": [
      "Merancang ERD, DCD, flowchart, use case, dan UI/UX aplikasi.",
      "Mengembangkan RESTful API berbasis microservices menggunakan Node.js.",
      "Mengintegrasikan frontend, backend, dan database untuk proses rekrutmen."
    ]
  },
  {
    "title": "Program MBKM UG-SMART",
    "label": "Command Center Support",
    "role": "Analis Sistem Informasi & Fasilitator",
    "stack": [
      "Figma",
      "Website",
      "UI/UX Redesign",
      "Training"
    ],
    "summary": "Dukungan analisis, pelatihan, dan redesain UI/UX untuk implementasi aplikasi UG-SMART.",
    "points": [
      "Memberikan pelatihan dan bimbingan teknis penggunaan aplikasi UG-SMART.",
      "Mendukung persiapan Command Center di Kabupaten Penajam Paser Utara.",
      "Membantu analisis sistem serta redesain UI/UX aplikasi."
    ]
  },
  {
    "title": "Implementasi dan Pengujian Proses Bisnis Menggunakan Camunda",
    "label": "Skripsi",
    "role": "Research & Implementation",
    "stack": [
      "Camunda",
      "Java",
      "BPMN",
      "Website"
    ],
    "summary": "Pemodelan dan validasi alur proses bisnis menggunakan Camunda BPMN sebagai proyek skripsi.",
    "points": [
      "Merancang dan memodelkan alur proses bisnis menggunakan Camunda BPMN.",
      "Melakukan pengujian dan validasi terhadap proses bisnis yang dibuat.",
      "Menganalisis serta mendokumentasikan hasil implementasi proses bisnis."
    ]
  }
];

export const landingPages: LandingPage[] = [
  {
    "name": "SMI AI Solution",
    "tagline": "Landing page perusahaan",
    "role": "Front-End Web Developer",
    "url": "https://seleris.ai/",
    "summary": "Halaman utama lini solusi AI kesehatan: health check cepat, skor risiko kardiovaskular, underwriting asuransi, dan program wellness korporat.",
    "stack": [
      "Vue 3",
      "Tailwind CSS",
      "Swiper",
      "AOS",
      "ApexCharts"
    ],
    "status": "production",
    "statusLabel": "Produksi"
  },
  {
    "name": "SELICA",
    "tagline": "Landing page produk SELICA",
    "role": "Front-End Web Developer",
    "url": "https://seleriscare.ai/",
    "summary": "Halaman produk dengan penyajian data berbasis grafik dan alur konten bertahap untuk menjelaskan manfaat produk ke calon klien.",
    "stack": [
      "Vue 3",
      "Tailwind CSS",
      "ApexCharts",
      "AOS"
    ],
    "status": "production",
    "statusLabel": "Produksi"
  },
  {
    "name": "SALVION AI",
    "tagline": "Landing page eksploratif",
    "role": "Front-End Web Developer",
    "url": "https://salvionlp.pages.dev/",
    "summary": "Eksplorasi konsep dan motion untuk produk pemantauan sinyal kesehatan, dibangun dengan pendekatan animasi berbasis scroll.",
    "stack": [
      "React",
      "Tailwind CSS",
      "Framer Motion"
    ],
    "status": "prototype",
    "statusLabel": "Prototype",
    "note": "Deploy uji coba mandiri via Cloudflare Pages. Dioptimalkan untuk desktop, pengerjaan responsif belum dilanjutkan."
  }
];

export const focusAreas: FocusArea[] = [
  {
    "title": "Implementasi UI Responsif",
    "description": "Mengubah desain dan kebutuhan bisnis menjadi halaman yang konsisten, cepat dipahami, dan nyaman digunakan di desktop maupun mobile.",
    "tools": [
      "HTML",
      "CSS",
      "Tailwind CSS",
      "Bootstrap",
      "Vue.js",
      "React.js"
    ]
  },
  {
    "title": "Integrasi Sistem",
    "description": "Menghubungkan antarmuka dengan REST API, memetakan state, dan memastikan data tampil sesuai alur operasional pengguna.",
    "tools": [
      "REST API",
      "Postman",
      "JavaScript",
      "PHP",
      "Node.js",
      "MySQL"
    ]
  },
  {
    "title": "Validasi Produk",
    "description": "Menguji flow, memperbaiki bug, dan menyiapkan dokumentasi agar fitur lebih stabil saat digunakan tim maupun pengguna akhir.",
    "tools": [
      "Testing",
      "User Guide",
      "Draw.io",
      "Trello",
      "Figma"
    ]
  }
];

export const skills = [
  {
    "title": "Front-End",
    "tools": [
      "HTML",
      "CSS",
      "JavaScript",
      "Bootstrap",
      "Tailwind CSS",
      "React.js",
      "Vue.js"
    ]
  },
  {
    "title": "Back-End",
    "tools": [
      "PHP",
      "Node.js",
      "REST API",
      "MySQL"
    ]
  },
  {
    "title": "Tools",
    "tools": [
      "Git",
      "Trello",
      "Figma",
      "Postman",
      "Draw.io",
      "Google Sheets",
      "Microsoft Office"
    ]
  },
  {
    "title": "AI Assisted",
    "tools": [
      "ChatGPT",
      "Claude",
      "Codex",
      "Prompting",
      "Software Testing"
    ]
  }
];

export const skillIcons = [
  {
    "name": "VUE",
    "icon": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Vue.js_Logo_2.svg/3840px-Vue.js_Logo_2.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail"
  },
  {
    "name": "React",
    "icon": "/skills-optimized/react.webp"
  },
  {
    "name": "TypeScript",
    "icon": "/skills-optimized/ts.webp"
  },
  {
    "name": "JavaScript",
    "icon": "/skills-optimized/js.webp"
  },
  {
    "name": "Tailwind CSS",
    "icon": "/skills-optimized/tailwind.webp"
  },
  {
    "name": "Figma",
    "icon": "/skills-optimized/figma.webp"
  },
  {
    "name": "MySQL",
    "icon": "/skills-optimized/mysql.webp"
  },
  {
    "name": "HTML",
    "icon": "/skills-optimized/html.webp"
  },
  {
    "name": "CSS",
    "icon": "/skills-optimized/css.webp"
  },
  {
    "name": "Node.js",
    "icon": "/skills-optimized/node.webp"
  }
];

export const education = {
  "school": "Universitas Gunadarma",
  "degree": "Sistem Informasi (S.Kom.)",
  "location": "Depok",
  "period": "2020 - 2025",
  "gpa": "3.49/4.00"
};

export const certifications: string[] = [
  "Dasar Pembuatan Aplikasi Web",
  "Membangun Website Menggunakan HTML 5",
  "Pemrograman Go untuk Tingkat Menengah",
  "Pemrograman Go untuk Tingkat Pemula",
  "Dasar Pemrograman Berbasis Web"
];
