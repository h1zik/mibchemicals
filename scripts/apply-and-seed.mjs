// Terapkan migrasi 009–013 + isi SEMUA data dari Company Profile PT MIB - 2024.pdf.
// Jalankan sekali setelah project Supabase aktif:  node scripts/apply-and-seed.mjs
// Idempotent: aman dijalankan ulang (ON CONFLICT (slug) DO UPDATE).
//
// Membaca koneksi dari .env (DIRECT_URL, fallback DATABASE_URL).

import fs from "node:fs";
import path from "node:path";
import pg from "pg";

// ---------- .env ----------
function loadEnv() {
  const env = fs.readFileSync(".env", "utf8");
  const get = (k) => {
    const m = env.match(new RegExp("^" + k + "=(.*)$", "m"));
    if (!m) return null;
    return m[1].trim().replace(/^["']|["']$/g, "");
  };
  return get;
}
const get = loadEnv();
const CONN = get("DIRECT_URL") || get("DATABASE_URL");

const MIGRATIONS = [
  "009_industries.sql",
  "010_solutions.sql",
  "011_testimonials.sql",
  "012_credibility.sql",
  "013_content_media_bucket.sql",
];

// ======================================================================
// DATA (dari Company Profile PT MIB - 2024)
// ======================================================================

const SITE = {
  meta_title_default:
    "MIB Chemicals | Specialty Chemicals, Cleaner & Jasa Maklon Kimia",
  meta_description_default:
    "PT Mandiri Inovasi Bersama (MIB Chemicals) — one stop solution specialty chemicals & cleaner untuk oil & gas, pertambangan, manufaktur, water treatment, household, dan otomotif. Jasa maklon & riset formulasi.",
  site_keywords:
    "specialty chemicals, cleaner, jasa maklon, maklon kimia, water treatment, oil and gas chemical, mining chemical, MIB Chemicals, PT Mandiri Inovasi Bersama",
  company_name: "MIB Chemicals",
  company_tagline:
    "Your Chemical Solution — one stop solution untuk specialty chemicals & cleaner di semua bidang industri.",
  contact_email: "ptmandiriinovasibersama@gmail.com",
  contact_phone: "021-29665724",
  contact_address:
    "Jl. Raya Cisauk Lapan No. 26, Desa Sampora, Cisauk, Tangerang – Banten, Indonesia",
  hero_title: "One Stop Solution untuk Specialty Chemicals",
  hero_subtitle:
    "Specialty chemicals & cleaner untuk oil & gas, pertambangan, manufaktur, water treatment, household, dan otomotif — didukung riset formulasi dan jasa maklon.",
  hero_primary_cta_label: "Hubungi Kami",
  hero_primary_cta_url: "/contact",
  hero_secondary_cta_label: "Lihat Solusi",
  hero_secondary_cta_url: "/solutions",
  solution_problem_title: "Tantangan Industri",
  solution_problem_body:
    "Setiap industri — dari tambang, migas, hingga manufaktur — punya permasalahan proses, korosi, kebersihan, dan pengolahan air yang spesifik.",
  solution_innovation_title: "Riset & Formulasi",
  solution_innovation_body:
    "Kami memformulasikan chemical dengan teknologi terkini. Formulasi bisa dari kami, dari customer, atau hasil riset bersama — kerahasiaan formula customer terjaga.",
  solution_mib_title: "Solusi MIB Chemicals",
  solution_mib_body:
    "Dari formulasi, produksi, hingga jasa maklon dan technical service di lapangan — kami mendampingi dengan kualitas premium dan harga kompetitif.",
  about_page_title: "Tentang MIB Chemicals",
  about_page_subtitle:
    "PT Mandiri Inovasi Bersama — Your Chemical Solution.",
  about_page_body_md: `## Tentang Perusahaan

Berdiri sejak tahun **2017 di Tangerang**, **PT Mandiri Inovasi Bersama (MIB)** memposisikan diri sebagai *one stop solution* untuk specialty chemicals dan cleaner di semua bidang, di antaranya: oil and gas, mining, industri, manufaktur, household, dan water treatment.

MIB tidak sekadar menawarkan produk, tetapi menawarkan kerja sama dengan customer untuk bersama-sama melakukan riset guna mendapatkan produk yang benar-benar dibutuhkan — sehingga produk yang dihasilkan sesuai baik dari sisi kualitas maupun harga yang kompetitif.

MIB juga menyediakan **jasa maklon** untuk semua jenis produk cairan. Formulasi produk dapat berasal dari kami, dari customer, atau hasil riset bersama. Kami sangat menjaga kerahasiaan formulasi yang berasal dari customer. Kualitas produksi sangat terjamin dan harga jasa blending kami sangat bersaing. **Kepuasan customer merupakan tujuan utama kami.**

## Visi

Menjadi perusahaan specialty chemicals yang *leading* dalam inovasi dan penyelesaian masalah customer.

## Misi

Menjalankan bisnis specialty chemicals dengan teknologi terkini, ramah lingkungan, mengutamakan kepuasan pelanggan, harga kompetitif, kualitas premium, dan waktu pengiriman tepat waktu.`,
  // Statistik yang benar-benar terverifikasi dari profil (tidak mengarang).
  company_stats_json: JSON.stringify([
    { value: 2017, suffix: "", label: "Berdiri sejak" },
    { value: 6, suffix: "", label: "Sektor industri dilayani" },
    { value: 70, suffix: "+", label: "Produk & formulasi specialty" },
  ]),
  // Tidak ada sertifikasi yang tercantum di profil → dibiarkan kosong.
  certifications_json: JSON.stringify([]),
};

// slug WAJIB cocok dengan seed migrasi 009 untuk oil-gas/manufacturing/mining/water-treatment.
const INDUSTRIES = [
  {
    slug: "oil-gas",
    name: "Oil & Gas",
    icon_key: "oil-gas",
    sort_order: 10,
    summary:
      "Chemical produksi & maintenance oil and gas dengan teknologi terbaru, didukung pakar R&D.",
    intro_md:
      "Kami terus mengikuti perkembangan teknologi chemical yang digunakan pada produksi oil and gas, sehingga chemicals yang kami tawarkan merupakan hasil teknologi terbaru. Kami memiliki pakar R&D berpengalaman untuk menjawab permasalahan di bidang oil & gas — mulai dari penanganan tumpahan, pemadaman api, pemisahan emulsi, hingga proteksi korosi.",
  },
  {
    slug: "mining",
    name: "Pertambangan",
    icon_key: "mining",
    sort_order: 20,
    summary:
      "Mining maintenance chemicals: pengendalian debu, pendingin, pembersih, dan proteksi peralatan tambang.",
    intro_md:
      "Kami memiliki pengalaman dalam formulasi dan produksi specialty chemicals untuk keperluan perawatan di pertambangan. Formulasi yang kami tawarkan disesuaikan dengan kebutuhan customer dan benar-benar menjawab permasalahan di lapangan — dari pengendalian debu batu bara, pendinginan ban truk HD, hingga pembersihan sparepart.",
  },
  {
    slug: "manufacturing",
    name: "Manufaktur & Industri",
    icon_key: "manufacturing",
    sort_order: 30,
    summary:
      "Chemical maintenance untuk industri & manufaktur: cleaning, coating, pelumas, dan anti-korosi.",
    intro_md:
      "Sebagai chemicals specialist, kami memformulasikan chemical untuk keperluan industri dan manufaktur. Produk yang kami tawarkan tidak terbatas pada list yang ada — kami juga menawarkan kerja sama riset dengan customer yang ingin mengembangkan produk dengan formula baru sesuai kebutuhan.",
  },
  {
    slug: "water-treatment",
    name: "Water Treatment",
    icon_key: "water",
    sort_order: 40,
    summary:
      "Chemical & technical service water treatment: koagulan, flokulan, biocide, scale & oxygen control.",
    intro_md:
      "Untuk melengkapi pelayanan di bidang chemical, kami menyediakan layanan water treatment. Selain chemical, kami juga menyediakan jasa technical service yang membantu melakukan injeksi chemical dan problem solving di lapangan.",
  },
  {
    slug: "household",
    name: "Household, Laundry & Toiletries",
    icon_key: "household",
    sort_order: 50,
    summary:
      "Produk kebutuhan household, laundry, dan general purpose cleaning dengan kualitas bagus & harga bersaing.",
    intro_md:
      "Kami memproduksi kebutuhan household, laundry, dan general purpose cleaning dengan kualitas yang bagus dan harga lebih bersaing. Kami juga menawarkan produk yang disesuaikan dengan permintaan pelanggan — dari pencuci piring, deterjen, pembersih lantai, hingga hand soap & sanitizer.",
  },
  {
    slug: "automotive",
    name: "Otomotif",
    icon_key: "autocare",
    sort_order: 60,
    summary:
      "Perawatan kendaraan: pembersih ruang bakar, karburator, shampo touchless, pelumas, dan water repellent.",
    intro_md:
      "Rangkaian produk perawatan kendaraan MIB membantu menjaga performa dan tampilan kendaraan — dari pembersih karbon ruang bakar, pembersih karburator, shampo touchless, hingga water repellent kaca.",
  },
];

const SERVICES = [
  {
    slug: "jasa-maklon-toll-blending",
    title: "Jasa Maklon & Toll Blending",
    icon_key: "flask",
    sort_order: 10,
    summary:
      "Jasa maklon untuk semua jenis produk cairan. Formulasi dari kami, customer, atau hasil riset bersama — kerahasiaan formula terjaga.",
    body_md:
      "MIB menyediakan **jasa maklon (toll blending)** untuk semua jenis produk cairan. Formulasi produk dapat berasal dari kami, dari customer, atau hasil riset bersama.\n\nKami **menjaga penuh kerahasiaan** formulasi yang berasal dari customer. Kualitas produksi sangat terjamin dan harga jasa blending kami sangat kompetitif. Kepuasan customer adalah tujuan utama kami.",
  },
  {
    slug: "riset-formulasi",
    title: "Riset & Formulasi (R&D)",
    icon_key: "support",
    sort_order: 20,
    summary:
      "Kerja sama riset mengembangkan produk sesuai kebutuhan customer dengan formula baru dan kualitas yang diharapkan.",
    body_md:
      "MIB tidak sekadar menawarkan produk, tetapi menawarkan **kerja sama riset** dengan customer untuk bersama-sama mendapatkan produk yang benar-benar dibutuhkan.\n\nDidukung pakar R&D berpengalaman, kami mengembangkan formula baru yang menjawab permasalahan spesifik di lapangan — dengan kualitas dan harga yang kompetitif.",
  },
  {
    slug: "technical-service-water-treatment",
    title: "Technical Service Water Treatment",
    icon_key: "droplet",
    sort_order: 30,
    summary:
      "Jasa injeksi chemical dan problem solving water treatment langsung di lapangan.",
    body_md:
      "Selain menyediakan chemical water treatment, kami menyediakan **jasa technical service** yang membantu melakukan injeksi chemical dan *problem solving* di lapangan — memastikan sistem pengolahan air beroperasi optimal.",
  },
];

// Solusi (problem → solution) — produk unggulan yang di-reframe per industri.
const SOLUTIONS = [
  // --- Oil & Gas ---
  { slug: "mib-spill-combat", industry: "oil-gas", title: "MIB Spill Combat", solution_label: "MIB Spill Combat", problem: "Tumpahan minyak di laut", summary: "Solusi penanganan tumpahan minyak di laut yang cepat menguraikan & menyebarkan minyak.", body_md: "**MIB SPILL COMBAT** adalah solusi untuk menangani tumpahan minyak di laut. Formula khususnya dengan cepat menguraikan dan menyebarkan minyak, mengurangi dampak lingkungan. Diuji untuk biodegradabilitas dan keamanan bagi lingkungan air, memenuhi standar ketat, serta dapat digunakan dengan berbagai metode aplikasi.", sort_order: 10 },
  { slug: "mib-fire-fight-foam", industry: "oil-gas", title: "MIB Fire Fight Foam", solution_label: "MIB Fire Fight Foam", problem: "Kebakaran bahan bakar hidrokarbon", summary: "Konsentrat busa pemadam api untuk bahan bakar minyak hidrokarbon.", body_md: "**MIB FIRE FIGHT FOAM** adalah cairan pembentuk busa yang diformulasikan sebagai konsentrat busa pemadam api. Digunakan dalam konsentrasi 3% dalam air. Efektif memadamkan bahan bakar minyak hidrokarbon seperti bensin, minyak tanah, dan solar, serta mengandung surfaktan yang menstabilkan busa dan melindungi dari *burnback*.", sort_order: 20 },
  { slug: "mib-demul", industry: "oil-gas", title: "MIB Demul", solution_label: "MIB Demul (Demulsifier)", problem: "Emulsi minyak-air kompleks", summary: "Memisahkan emulsi minyak-air kompleks dalam proses pengolahan minyak bumi.", body_md: "**MIB DEMUL** adalah produk untuk memisahkan emulsi minyak-air yang kompleks dalam proses pengolahan minyak bumi — mengoptimalkan stabilitas produksi, mengurangi gangguan operasional, dan memastikan operasi pengolahan yang lancar di berbagai tahapan.", sort_order: 30 },
  { slug: "mib-rust-shield", industry: "oil-gas", title: "MIB Rust Shield", solution_label: "MIB Rust Shield", problem: "Korosi permukaan logam", summary: "Perlindungan tahan lama terhadap korosi untuk berbagai permukaan logam.", body_md: "**MIB RUST SHIELD** memberikan perlindungan tahan lama terhadap korosi untuk berbagai permukaan logam. Formulanya menghambat pembentukan karat, kompatibel dengan besi, baja, aluminium, dan alloy. Aplikasi mudah melalui penyemprotan, pencelupan, atau penyikatan.", sort_order: 40 },

  // --- Mining ---
  { slug: "mib-dust-coal", industry: "mining", title: "MIB Dust Coal", solution_label: "MIB Dust Coal", problem: "Debu batu bara saat bongkar muat & crushing", summary: "Pengendali debu batu bara selama loading, unloading, crushing, atau transfer.", body_md: "**MIB DUST COAL** adalah solusi untuk mengendalikan debu batu bara selama proses bongkar muat, crushing, atau transfer. Dengan penggunaan teratur, membentuk lapisan proteksi efektif yang mengurangi pelepasan debu serta meningkatkan keamanan dan kebersihan di lokasi pengolahan batu bara.", sort_order: 10 },
  { slug: "mib-road-dust", industry: "mining", title: "MIB Road Dust", solution_label: "MIB Road Dust", problem: "Debu jalan di lapangan tambang", summary: "Penekan debu jalan yang sering muncul di lapangan pertambangan.", body_md: "**MIB ROAD DUST** adalah solusi pengendali debu di industri pertambangan, dirancang untuk menekan debu yang sering muncul di lapangan tambang. Penggunaan rutin membentuk lapisan protektif efektif yang mengurangi pelepasan debu dan meningkatkan keamanan serta kebersihan lokasi.", sort_order: 20 },
  { slug: "mib-tire-coolant", industry: "mining", title: "MIB Tire Coolant", solution_label: "MIB Tire Coolant", problem: "Panas ban truk angkut material tambang (HD)", summary: "Pendingin ban khusus truk angkut material tambang seperti truk HD.", body_md: "**MIB TIRE COOLANT** adalah cairan yang diformulasikan khusus untuk pendingin ban pada truk angkutan material tambang seperti truk HD. Selain mendinginkan dan menstabilkan suhu udara pada ban, juga memproteksi timbulnya karat pada rim/velg.", sort_order: 30 },
  { slug: "mib-radcool", industry: "mining", title: "MIB Radcool", solution_label: "MIB Radcool", problem: "Overheat & karat sistem pendingin mesin", summary: "Cairan pendingin radiator untuk mengoptimalkan sistem pendinginan mesin.", body_md: "**MIB RADCOOL** adalah cairan pendingin radiator yang diformulasikan untuk mengoptimalkan kinerja sistem pendinginan mesin dan berbagai aplikasi industri. Efisien menyerap panas, memastikan mesin beroperasi pada suhu optimal, mencegah overheat sekaligus mencegah karat.", sort_order: 40 },
  { slug: "mib-mounting-compound", industry: "mining", title: "MIB Mounting Compound", solution_label: "MIB Mounting Compound", problem: "Pemasangan & pelepasan ban dari velg", summary: "Pasta lubrikasi berbahan dasar air untuk memasang/melepas ban dari velg.", body_md: "**MIB MOUNTING COMPOUND** adalah material pasta *water based* untuk lubrikasi pemasangan dan pelepasan ban dari velg. Sisa aplikasi dapat dibilas air (meski tidak diperlukan), cocok untuk pemasangan ban manual maupun otomatis, serta aman untuk cat dan logam.", sort_order: 50 },
  { slug: "mib-fastclean", industry: "mining", title: "MIB Fastclean", solution_label: "MIB Fastclean", problem: "Kotoran oli & gemuk yang mengering", summary: "Pembersih berbasis air ramah lingkungan untuk oli & gemuk kering.", body_md: "**MIB FASTCLEAN** adalah pembersih berbasis air yang sangat ramah lingkungan, diformulasikan khusus untuk menghilangkan kotoran oli dan gemuk yang sudah mengering. Cocok untuk aplikasi general engineering, otomotif, dan industri pertambangan.", sort_order: 60 },

  // --- Manufaktur & Industri ---
  { slug: "mib-waterless-hand-cleaner", industry: "manufacturing", title: "MIB Waterless Hand Cleaner", solution_label: "MIB Waterless Hand Cleaner", problem: "Pembersih tangan di area dengan air terbatas", summary: "Pembersih tangan berbentuk pasta aroma lemon tanpa perlu air.", body_md: "**MIB WATERLESS HAND CLEANER** adalah pembersih tangan berbentuk pasta beraroma lemon yang membersihkan tangan dari oli dan grease tanpa pembilasan air. Cocok untuk area tambang dengan ketersediaan air terbatas, aman, tidak korosif, dan lembut di tangan.", sort_order: 10 },
  { slug: "mib-bitguard", industry: "manufacturing", title: "MIB Bitguard", solution_label: "MIB Bitguard", problem: "Kebutuhan waterproofing coating", summary: "Emulsi bitumen berkualitas tinggi untuk aplikasi waterproofing coating.", body_md: "**MIB BITGUARD** adalah emulsi bitumen berkualitas tinggi untuk aplikasi *waterproofing coating*. Teknologi emulsinya menciptakan lapisan tahan air yang efektif melindungi permukaan dari penetrasi air — baik untuk atap, pondasi, atau struktur lain.", sort_order: 20 },
  { slug: "mib-multiclean-break", industry: "manufacturing", title: "MIB Multiclean Break", solution_label: "MIB Multiclean Break", problem: "Kotoran, lemak, dan noda serbaguna", summary: "Pembersih berbasis air serbaguna tanpa meninggalkan residu.", body_md: "**MIB MULTICLEAN BREAK** adalah pembersih berbasis air serbaguna untuk beragam aplikasi. Formulanya efektif menghilangkan kotoran, lemak, dan noda dari berbagai permukaan tanpa meninggalkan residu — konsisten dan andal untuk kebutuhan industri maupun sehari-hari.", sort_order: 30 },
  { slug: "mib-rust-combat", industry: "manufacturing", title: "MIB Rust Combat", solution_label: "MIB Rust Combat", problem: "Deposit karat yang sukar dihilangkan", summary: "Pembersih karat yang mengembalikan kilau permukaan logam.", body_md: "**MIB RUST COMBAT** adalah pembersih karat yang diformulasikan untuk mengembalikan kilau permukaan logam ke keadaan aslinya. Formulanya efektif melarutkan dan menghilangkan deposit karat yang sukar dihilangkan.", sort_order: 40 },
  { slug: "mib-natlube", industry: "manufacturing", title: "MIB Natlube", solution_label: "MIB Natlube", problem: "Gesekan & keausan mesin", summary: "Pelumas minyak alami premium yang mengurangi gesekan & keausan.", body_md: "**MIB NATLUBE** adalah pelumas minyak alami premium yang memberikan pelumasan dan perlindungan unggul. Diformulasikan dari minyak alami terpilih, efektif mengurangi gesekan dan keausan pada mesin & peralatan — pilihan ramah lingkungan untuk operasi yang lancar dan efisien.", sort_order: 50 },

  // --- Water Treatment ---
  { slug: "mib-coanor", industry: "water-treatment", title: "MIB Coanor", solution_label: "MIB Coanor (Coagulant)", problem: "Air keruh oleh partikel tersuspensi", summary: "Coagulant penjernih kinerja tinggi untuk berbagai aplikasi industri.", body_md: "**MIB COANOR** adalah coagulant penjernih kinerja tinggi yang menjernihkan air secara efektif. Formulanya mempromosikan agregasi cepat partikel tersuspensi, memungkinkan penjernihan melalui pengendapan atau filtrasi.", sort_order: 10 },
  { slug: "mib-flocar", industry: "water-treatment", title: "MIB Flocar", solution_label: "MIB Flocar (Flocculant)", problem: "Pemisahan & pengendapan partikel tersuspensi", summary: "Flokulan penjernih untuk meningkatkan pemisahan & pengendapan partikel.", body_md: "**MIB FLOCAR** adalah floculant penjernih kinerja tinggi yang meningkatkan pemisahan dan pengendapan partikel tersuspensi dalam proses penjernihan air. Formulanya mempromosikan agregasi cepat partikel halus, memfasilitasi pemisahan pengotor dari air.", sort_order: 20 },
  { slug: "mib-binox", industry: "water-treatment", title: "MIB Binox", solution_label: "MIB Binox (Biocide)", problem: "Pertumbuhan mikroba dalam sistem air", summary: "Biocide kinerja tinggi untuk mengendalikan pertumbuhan mikroba.", body_md: "**MIB BINOX** adalah biocide berkinerja tinggi untuk mengendalikan pertumbuhan mikroba dalam sistem pengolahan air. Formulanya membunuh berbagai bakteri, alga, dan jamur — melindungi dari kontaminasi mikrobiologis dan memastikan kualitas air optimal.", sort_order: 30 },
  { slug: "mib-scalin", industry: "water-treatment", title: "MIB Scalin", solution_label: "MIB Scalin (Scale Inhibitor)", problem: "Kerak & deposit mineral pada sistem air", summary: "Scale inhibitor untuk mencegah pembentukan kerak/deposit mineral.", body_md: "**MIB SCALIN** adalah scale inhibitor kinerja tinggi untuk mengontrol dan mencegah pembentukan kerak atau deposit mineral dalam sistem pengolahan air. Menyasar proses kristalisasi mineral pembentuk kerak, memperpanjang umur operasional peralatan.", sort_order: 40 },
  { slug: "mib-osca", industry: "water-treatment", title: "MIB Osca", solution_label: "MIB Osca (Oxygen Scavenger)", problem: "Oksigen terlarut penyebab korosi", summary: "Oxygen scavenger untuk menghilangkan oksigen terlarut & mencegah korosi.", body_md: "**MIB OSCA** adalah oxygen scavenger efektif untuk menghilangkan oksigen terlarut dalam air. Mengikat molekul oksigen, mencegah korosi, dan mempertahankan integritas permukaan logam — komponen penting dalam proses pengolahan air.", sort_order: 50 },

  // --- Household ---
  { slug: "kiklin-lemon-dishwash", industry: "household", title: "Kiklin Lemon Dishwash", solution_label: "Kiklin Lemon Dishwash", problem: "Lemak & kotoran pada peralatan makan", summary: "Cairan pencuci piring beraroma lemon yang menghilangkan lemak.", body_md: "**KIKLIN-LEMON DISHWASH** adalah cairan pencuci piring berkualitas tinggi dengan aroma lemon menyegarkan. Formulanya mudah menghilangkan lemak dari kotoran, meninggalkan piring bersih bersinar dan beraroma lemon.", sort_order: 10 },
  { slug: "kiklin-wash", industry: "household", title: "Kiklin Wash", solution_label: "Kiklin Wash", problem: "Noda & bau pada pakaian", summary: "Deterjen pencuci pakaian kinerja tinggi.", body_md: "**KIKLIN WASH** adalah deterjen pencuci pakaian kinerja tinggi yang berpenetrasi ke serat kain, menghilangkan noda dan bau yang sulit dihilangkan — membuat cucian bersih, cerah, dan beraroma segar.", sort_order: 20 },
  { slug: "kiklin-floor", industry: "household", title: "Kiklin Floor", solution_label: "Kiklin Floor", problem: "Lantai kotor & butuh efek anti-bakteri", summary: "Pembersih lantai keramik dengan efek anti-bakteri, aroma pinus/sereh.", body_md: "**KIKLIN FLOOR** diformulasikan khusus untuk membersihkan lantai keramik secara menyeluruh sekaligus memberi efek anti-bakteri. Tersedia dua aroma — pinus segar atau sereh — meninggalkan lantai bersih dengan aroma menyegarkan tahan lama.", sort_order: 30 },
  { slug: "dominatus-multipurpose-cleaner", industry: "household", title: "Dominatus Multipurpose Cleaner", solution_label: "Dominatus Multipurpose Cleaner", problem: "Pembersihan berbagai permukaan tanpa air", summary: "Pembersih serbaguna untuk sepatu, tas, sofa, & interior mobil tanpa air.", body_md: "**DOMINATUS MULTIPURPOSE CLEANER** adalah solusi pembersih serbaguna yang mudah digunakan untuk membersihkan berbagai permukaan kotor secara efisien tanpa perlu air — membuat sepatu, tas, sofa, dan interior mobil kembali bersih seperti baru.", sort_order: 40 },
  { slug: "kiklin-handsoap", industry: "household", title: "Kiklin Handsoap", solution_label: "Kiklin Handsoap", problem: "Kebersihan tangan sehari-hari", summary: "Pembersih tangan berkualitas yang lembut namun efektif.", body_md: "**KIKLIN HANDSOAP** adalah pembersih tangan berkualitas tinggi yang efektif menghilangkan kotoran, kuman, dan zat asing. Formulanya lembut namun efektif, membuat kulit bersih, segar, dan terhidrasi.", sort_order: 50 },
  { slug: "kiklin-handsan", industry: "household", title: "Kiklin Handsan", solution_label: "Kiklin Handsan", problem: "Disinfeksi tangan saat air & sabun tak tersedia", summary: "Hand sanitizer dengan kandungan alkohol seimbang.", body_md: "**KIKLIN HANDSAN** adalah disinfektan tangan yang efektif membunuh kuman dan bakteri pada permukaan kulit. Kandungan alkoholnya seimbang — disinfeksi unggul namun tetap lembut, penting untuk menjaga kebersihan tangan saat air dan sabun tidak tersedia.", sort_order: 60 },

  // --- Otomotif ---
  { slug: "mib-carb-cleaner", industry: "automotive", title: "MIB Carb Cleaner", solution_label: "MIB Carb Cleaner", problem: "Varnish & endapan karbon pada karburator", summary: "Pembersih ampuh varnish & endapan karbon tanpa merusak komponen karburator.", body_md: "**MIB CARB CLEANER** adalah cairan pembersih yang ampuh menghilangkan dan membersihkan varnish dan endapan karbon tanpa merusak komponen karburator lainnya.", sort_order: 10 },
  { slug: "mib-carb-conditioner", industry: "automotive", title: "MIB Carb Conditioner", solution_label: "MIB Carb Conditioner", problem: "Kerak oli & karbon di ruang bakar", summary: "Waterbase; membersihkan kotoran karbon & kerak oli ruang bakar, kembalikan performa.", body_md: "**MIB CARB CONDITIONER** (waterbase) membersihkan kotoran karbon dan kerak oli di ruang bakar mesin. Mengembalikan performa mesin menjadi lebih responsif, menghilangkan gejala ngelitik (knocking), serta meningkatkan efisiensi bahan bakar.", sort_order: 20 },
  { slug: "mib-carwash-tl", industry: "automotive", title: "MIB Carwash TL (Touchless)", solution_label: "MIB Carwash TL", problem: "Pencucian kendaraan tanpa kontak", summary: "Shampo mobil/motor touchless dengan busa lembut & hasil mengkilap.", body_md: "**MIB CARWASH TL (Touch Less)** adalah shampo mobil/motor yang memberikan kelembutan dan kilau maksimal. Busa lembutnya membersihkan sempurna tanpa perlu menyentuh permukaan yang dibersihkan, dengan hasil licin dan mengkilap.", sort_order: 30 },
  { slug: "mib-lub", industry: "automotive", title: "MIB Lub", solution_label: "MIB Lub", problem: "Bagian berkarat & butuh pelumasan", summary: "Melunturkan bagian berkarat, membersihkan, melindungi, melumasi & anti lengket.", body_md: "**MIB LUB** melunturkan bagian yang berkarat, membersihkan, serta melindungi, melumasi, dan bersifat anti lengket — solusi perawatan komponen kendaraan serbaguna.", sort_order: 40 },
  { slug: "mib-windshield-water-repellent", industry: "automotive", title: "MIB Windshield Water Repellent", solution_label: "MIB Windshield Water Repellent", problem: "Noda air/jamur pada permukaan kaca kendaraan", summary: "Menghilangkan noda air/jamur membandel pada permukaan kendaraan.", body_md: "**MIB WINDSHIELD WATER REPELLENT** dirancang untuk menghilangkan noda air/jamur membandel pada permukaan kendaraan, mengembalikan tampilan sempurna. Formula canggihnya memastikan proses penghilangan noda cepat dan efektif.", sort_order: 50 },
];

// Kategori produk (selaras dengan sektor).
const PRODUCT_CATEGORIES = [
  { slug: "oil-gas", name: "Oil & Gas", sort_order: 10 },
  { slug: "mining", name: "Mining Maintenance", sort_order: 20 },
  { slug: "manufacture-industry", name: "Manufaktur & Industri", sort_order: 30 },
  { slug: "water-treatment", name: "Water Treatment", sort_order: 40 },
  { slug: "household", name: "Household & Laundry", sort_order: 50 },
  { slug: "automotive", name: "Otomotif", sort_order: 60 },
];

// Katalog produk lengkap (featured + "Produk Lainnya" dari profil).
const P = (slug, name, category, description_md, featured = false, sort_order = 0) => ({
  slug, name, category, description_md, featured, sort_order,
});
const PRODUCTS = [
  // Oil & Gas
  P("mib-spill-combat", "MIB Spill Combat", "oil-gas", "Solusi penanganan tumpahan minyak di laut; cepat menguraikan & menyebarkan minyak, teruji biodegradabilitas.", true, 10),
  P("mib-fire-fight-foam", "MIB Fire Fight Foam", "oil-gas", "Konsentrat busa pemadam api (3% dalam air) untuk bahan bakar hidrokarbon.", true, 20),
  P("mib-demul", "MIB Demul", "oil-gas", "Demulsifier pemisah emulsi minyak-air dalam pengolahan minyak bumi.", true, 30),
  P("mib-rust-shield", "MIB Rust Shield", "oil-gas", "Rust protective oil; proteksi korosi tahan lama untuk berbagai logam.", true, 40),
  P("mib-solv", "MIB Solv", "oil-gas", "Solvent base cleaner; pencuci sparepart dari kotoran oli, gemuk, dll.", false, 50),
  P("mib-wirelube", "MIB Wirelube", "oil-gas", "Wire rope lubricant; pelumas kabel.", false, 60),
  P("mib-foamweel", "MIB Foamweel", "oil-gas", "Foaming agent; membantu dalam proses pengeboran.", false, 70),
  P("mib-foamcombat", "MIB Foamcombat", "oil-gas", "Antifoam; membunuh/menekan foam.", false, 80),
  P("mib-clarifier", "MIB Clarifier", "oil-gas", "Reverse demulsifier.", false, 90),

  // Mining
  P("mib-dust-coal", "MIB Dust Coal", "mining", "Pengendali debu batu bara saat loading, unloading, crushing, atau transfer.", true, 10),
  P("mib-road-dust", "MIB Road Dust", "mining", "Penekan debu jalan di lapangan pertambangan.", true, 20),
  P("mib-tire-coolant", "MIB Tire Coolant", "mining", "Pendingin ban truk angkut material tambang (HD); proteksi karat velg.", true, 30),
  P("mib-radcool", "MIB Radcool", "mining", "Cairan pendingin radiator; cegah overheat & karat.", true, 40),
  P("mib-mounting-compound", "MIB Mounting Compound", "mining", "Pasta lubrikasi water-based untuk pasang/lepas ban dari velg.", true, 50),
  P("mib-fastclean", "MIB Fastclean", "mining", "Pembersih berbasis air ramah lingkungan untuk oli & gemuk kering.", true, 60),
  P("mib-clean", "MIB Clean", "mining", "Emulsion base cleaner; pencuci sparepart dari gemuk & oli.", false, 70),
  P("mib-bioshield", "MIB Bioshield", "mining", "Biocide; pembunuh bakteri pada tangki penyimpanan solar.", false, 80),
  P("mib-radflush", "MIB Radflush", "mining", "Radiator flushing; membersihkan radiator dari kerak, karat, dll.", false, 90),
  P("mib-tackifier", "MIB Tackifier", "mining", "Hydroseeding tackifier; perekat bibit pada lahan miring.", false, 100),
  P("mib-acitreat", "MIB Acitreat", "mining", "Mining acidic water neutralizer; menetralkan asam tambang.", false, 110),
  P("mib-handclean", "MIB Handclean", "mining", "Waterless hand cleaner; pencuci tangan tanpa air.", false, 120),
  P("mib-calcoal", "MIB Calcoal", "mining", "Chemical untuk menaikkan kalori batu bara & menekan debu.", false, 130),

  // Manufaktur & Industri
  P("mib-waterless-hand-cleaner", "MIB Waterless Hand Cleaner", "manufacture-industry", "Pembersih tangan pasta aroma lemon tanpa air.", true, 10),
  P("mib-bitguard", "MIB Bitguard", "manufacture-industry", "Emulsi bitumen untuk waterproofing coating.", true, 20),
  P("mib-multiclean-break", "MIB Multiclean Break", "manufacture-industry", "Pembersih berbasis air serbaguna tanpa residu.", true, 30),
  P("mib-rust-combat", "MIB Rust Combat", "manufacture-industry", "Pembersih karat; kembalikan kilau permukaan logam.", true, 40),
  P("mib-natlube", "MIB Natlube", "manufacture-industry", "Pelumas minyak alami premium; kurangi gesekan & keausan.", true, 50),
  P("mib-motorclean", "MIB Motorclean", "manufacture-industry", "Motor cleaner; pembersih mesin motor tanpa konsleting.", false, 60),
  P("mib-electroclean", "MIB Electroclean", "manufacture-industry", "Alkaline base cleaner; pembersih secara elektrolitik.", false, 70),
  P("mib-descaler", "MIB Descaler", "manufacture-industry", "Penghilang scale/kerak yang menempel pada logam.", false, 80),
  P("mib-penetrant", "MIB Penetrant", "manufacture-industry", "Penetrating fluid; membuka baut & mur berkarat.", false, 90),
  P("mib-paintcombat", "MIB Paintcombat", "manufacture-industry", "Paint stripper; cairan pengelupas cat.", false, 100),
  P("mib-rustshield-oil", "MIB Rustshield", "manufacture-industry", "Rust protective oil; pencegah karat tahan sampai 12 bulan.", false, 110),
  P("mib-blackcoat", "MIB Blackcoat", "manufacture-industry", "Black coating; pencegah karat 12 bulan, temporary black coat.", false, 120),
  P("mib-clearcoat", "MIB Clearcoat", "manufacture-industry", "Clear coating; pencegah karat 12 bulan, temporary transparent coat.", false, 130),
  P("mib-ac-clean", "MIB AC Clean", "manufacture-industry", "AC cleaner; pembersih sirip kompresor AC.", false, 140),
  P("mib-alubright", "MIB Alubright", "manufacture-industry", "Aluminium brightener; pembersih & pemutih aluminium.", false, 150),
  P("mib-semisincool", "MIB Semisincool", "manufacture-industry", "Semi synthetic coolant; pendingin proses bubut.", false, 160),
  P("mib-oilcool", "MIB Oilcool", "manufacture-industry", "Emulsion coolant; pendingin proses bubut.", false, 170),
  P("mib-weedcombat", "MIB Weedcombat", "manufacture-industry", "Wire rope lubricant; pelumas kabel.", false, 180),
  P("mib-acidcorin", "MIB Acidcorin", "manufacture-industry", "Acid corrosion inhibitor; penghambat korosi oleh asam.", false, 190),
  P("mib-emulclean", "MIB Emulclean", "manufacture-industry", "Emulsion based cleaner; pencuci sparepart, non flammable.", false, 200),
  P("mib-cementcombat", "MIB Cementcombat", "manufacture-industry", "Cement remover; pembersih sisa-sisa semen.", false, 210),
  P("mib-thread", "MIB Thread", "manufacture-industry", "Thread compound; anti karat untuk ulir pipa.", false, 220),
  P("mib-amintreat", "MIB Amintreat", "manufacture-industry", "Neutralizing amine; penetral asam.", false, 230),
  P("mib-soluble-cutting-oil", "MIB Soluble Cutting Oil", "manufacture-industry", "Cairan pendingin & pelumas mata pisau berbasis emulsi pada mesin pemotong.", false, 240),

  // Water Treatment
  P("mib-coanor", "MIB Coanor", "water-treatment", "Coagulant penjernih kinerja tinggi.", true, 10),
  P("mib-flocar", "MIB Flocar", "water-treatment", "Flocculant penjernih kinerja tinggi.", true, 20),
  P("mib-binox", "MIB Binox", "water-treatment", "Biocide pengendali pertumbuhan mikroba.", true, 30),
  P("mib-scalin", "MIB Scalin", "water-treatment", "Scale inhibitor; cegah kerak/deposit mineral.", true, 40),
  P("mib-osca", "MIB Osca", "water-treatment", "Oxygen scavenger; hilangkan oksigen terlarut, cegah korosi.", true, 50),
  P("mib-declor", "MIB Declor", "water-treatment", "Dechlorinating agent / bulk caustic soda.", false, 60),
  P("mib-costik", "MIB Costik", "water-treatment", "Bulk caustic soda.", false, 70),
  P("mib-sulfuric", "MIB Sulfuric", "water-treatment", "Sulfuric acid 98%.", false, 80),
  P("mib-alkaklin", "MIB Alkaklin", "water-treatment", "Alkaline cleaner for RO, pH 11-12.", false, 90),
  P("mib-acidklin", "MIB Acidklin", "water-treatment", "Acid cleaner for RO, pH 1-3.", false, 100),
  P("mib-zinc", "MIB Zinc", "water-treatment", "Corrosion inhibitor, 15-30%.", false, 110),
  P("mib-chlorine-k", "MIB Chlorine K", "water-treatment", "Disinfectant, chlorine.", false, 120),
  P("mib-corin", "MIB Corin", "water-treatment", "Corrosion inhibitor, nitrite powder.", false, 130),
  P("mib-binox-ct", "MIB Binox CT", "water-treatment", "Nonoxidizing biocide.", false, 140),
  P("mib-binox-ro", "MIB Binox RO", "water-treatment", "Biocide untuk RO.", false, 150),
  P("mib-alka-p", "MIB Alka P", "water-treatment", "Alkaline phosphate.", false, 160),
  P("mib-alka-am", "MIB Alka AM", "water-treatment", "Amine pH adjuster.", false, 170),
  P("mib-coanor-pac", "MIB Coanor PAC", "water-treatment", "Coagulant DAF (PAC).", false, 180),
  P("mib-flocan", "MIB Flocan", "water-treatment", "Flocculant anionic.", false, 190),

  // Household
  P("kiklin-lemon-dishwash", "Kiklin Lemon Dishwash", "household", "Cairan pencuci piring aroma lemon.", true, 10),
  P("kiklin-wash", "Kiklin Wash", "household", "Deterjen pencuci pakaian kinerja tinggi.", true, 20),
  P("kiklin-floor", "Kiklin Floor", "household", "Pembersih lantai keramik anti-bakteri, aroma pinus/sereh.", true, 30),
  P("dominatus-multipurpose-cleaner", "Dominatus Multipurpose Cleaner", "household", "Pembersih serbaguna tanpa air untuk sepatu, tas, sofa, interior mobil.", true, 40),
  P("kiklin-handsoap", "Kiklin Handsoap", "household", "Pembersih tangan lembut & efektif.", true, 50),
  P("kiklin-handsan", "Kiklin Handsan", "household", "Hand sanitizer kandungan alkohol seimbang.", true, 60),
  P("mib-desinol", "MIB Desinol", "household", "Disinfektan permukaan.", false, 70),

  // Otomotif
  P("mib-carb-cleaner", "MIB Carb Cleaner", "automotive", "Pembersih varnish & endapan karbon karburator.", true, 10),
  P("mib-carb-conditioner", "MIB Carb Conditioner", "automotive", "Waterbase; pembersih karbon & kerak oli ruang bakar.", true, 20),
  P("mib-carwash-tl", "MIB Carwash TL (Touchless)", "automotive", "Shampo mobil/motor touchless, busa lembut, hasil mengkilap.", true, 30),
  P("mib-lub", "MIB Lub", "automotive", "Melunturkan karat, membersihkan, melindungi & melumasi.", false, 40),
  P("mib-windshield-water-repellent", "MIB Windshield Water Repellent", "automotive", "Menghilangkan noda air/jamur pada kaca kendaraan.", true, 50),
];

// ======================================================================
// Validasi data (tanpa DB) — `node scripts/apply-and-seed.mjs --validate`
// ======================================================================
function validateData() {
  const errors = [];
  const dupes = (arr, key) => {
    const seen = new Set();
    for (const x of arr) {
      if (seen.has(x[key])) errors.push(`Duplikat ${key}: ${x[key]}`);
      seen.add(x[key]);
    }
  };
  dupes(INDUSTRIES, "slug");
  dupes(SERVICES, "slug");
  dupes(SOLUTIONS, "slug");
  dupes(PRODUCT_CATEGORIES, "slug");
  dupes(PRODUCTS, "slug");

  const indSlugs = new Set(INDUSTRIES.map((i) => i.slug));
  for (const s of SOLUTIONS) {
    if (!indSlugs.has(s.industry)) errors.push(`Solusi ${s.slug} → industri tak dikenal: ${s.industry}`);
  }
  const catSlugs = new Set(PRODUCT_CATEGORIES.map((c) => c.slug));
  for (const p of PRODUCTS) {
    if (!catSlugs.has(p.category)) errors.push(`Produk ${p.slug} → kategori tak dikenal: ${p.category}`);
  }
  try { JSON.parse(SITE.company_stats_json); } catch { errors.push("company_stats_json bukan JSON valid"); }
  try { JSON.parse(SITE.certifications_json); } catch { errors.push("certifications_json bukan JSON valid"); }

  console.log(`industries=${INDUSTRIES.length} services=${SERVICES.length} solutions=${SOLUTIONS.length} product_categories=${PRODUCT_CATEGORIES.length} products=${PRODUCTS.length}`);
  if (errors.length) {
    console.error("VALIDASI GAGAL:\n - " + errors.join("\n - "));
    process.exit(1);
  }
  console.log("Validasi data OK — tidak ada duplikat/refensi rusak.");
}

// ======================================================================
// Runner
// ======================================================================
// ======================================================================
// Emit SQL — `node scripts/apply-and-seed.mjs --emit-sql`
// Hanya konten BARU (industries + solutions + statistik). TIDAK menyentuh
// products/services/posts agar konten kurasi yang sudah ada tetap aman.
// ======================================================================
function q(v) {
  if (v === null || v === undefined) return "null";
  return "'" + String(v).replace(/'/g, "''") + "'";
}
function emitSql() {
  const L = [];
  L.push("-- Seed dari Company Profile PT MIB - 2024 (industri + solusi + statistik).");
  L.push("-- Idempotent. Jalankan SETELAH migrasi 009-013. Aman diulang.");
  L.push("-- Tidak mengubah products/services/posts yang sudah ada.\n");

  L.push("-- Industri");
  for (const it of INDUSTRIES) {
    L.push(
      `insert into public.industries (slug, name, summary, intro_md, icon_key, sort_order, published) values (` +
        `${q(it.slug)}, ${q(it.name)}, ${q(it.summary)}, ${q(it.intro_md)}, ${q(it.icon_key)}, ${it.sort_order}, true) ` +
        `on conflict (slug) do update set name=excluded.name, summary=excluded.summary, intro_md=excluded.intro_md, icon_key=excluded.icon_key, sort_order=excluded.sort_order, published=true;`
    );
  }
  L.push("\n-- Solusi (problem -> solution), industry_id via slug");
  for (const s of SOLUTIONS) {
    L.push(
      `insert into public.solutions (slug, title, industry_id, problem, solution_label, summary, body_md, sort_order, published) values (` +
        `${q(s.slug)}, ${q(s.title)}, (select id from public.industries where slug=${q(s.industry)}), ${q(s.problem)}, ${q(s.solution_label)}, ${q(s.summary)}, ${q(s.body_md)}, ${s.sort_order}, true) ` +
        `on conflict (slug) do update set title=excluded.title, industry_id=excluded.industry_id, problem=excluded.problem, solution_label=excluded.solution_label, summary=excluded.summary, body_md=excluded.body_md, sort_order=excluded.sort_order, published=true;`
    );
  }
  L.push("\n-- Statistik perusahaan (blok kredibilitas). Sertifikasi dibiarkan apa adanya.");
  L.push(
    `update public.site_config set company_stats_json = ${q(SITE.company_stats_json)}::jsonb where singleton_key='main';`
  );
  return L.join("\n") + "\n";
}

async function main() {
  if (process.argv.includes("--validate")) {
    validateData();
    return;
  }
  if (process.argv.includes("--emit-sql")) {
    validateData();
    const out = path.join("supabase", "migrations", "014_seed_from_profile.sql");
    fs.writeFileSync(out, emitSql());
    console.log("SQL ditulis ke", out);
    return;
  }
  const SAFE = process.argv.includes("--safe");
  validateData();
  if (!CONN) {
    console.error("DATABASE_URL/DIRECT_URL kosong di .env — isi koneksi Postgres self-hosted dulu, atau pakai --emit-sql untuk jalur Studio SQL Editor.");
    process.exit(1);
  }
  const client = new pg.Client({ connectionString: CONN, ssl: { rejectUnauthorized: false } });
  await client.connect();
  console.log("Terhubung ke database.\n");

  // 1) Migrasi
  for (const file of MIGRATIONS) {
    const sql = fs.readFileSync(path.join("supabase", "migrations", file), "utf8");
    process.stdout.write(`Migrasi ${file} ... `);
    await client.query(sql);
    console.log("ok");
  }
  console.log("");

  // 2) site_config
  // Mode --safe: hanya set statistik & sertifikasi (tidak menimpa company/hero/about kurasi).
  const cols = SAFE ? ["company_stats_json", "certifications_json"] : Object.keys(SITE);
  const setList = cols.map((c, i) => `${c} = $${i + 1}`).join(", ");
  const vals = cols.map((c) => SITE[c]);
  const upd = await client.query(
    `update site_config set ${setList} where singleton_key = 'main'`,
    vals
  );
  if (upd.rowCount === 0 && !SAFE) {
    const insCols = ["singleton_key", ...cols].join(", ");
    const insPh = ["'main'", ...cols.map((_, i) => `$${i + 1}`)].join(", ");
    await client.query(`insert into site_config (${insCols}) values (${insPh})`, vals);
    console.log("site_config: baris dibuat.");
  } else {
    console.log(`site_config: diperbarui${SAFE ? " (safe: hanya statistik/sertifikasi)" : ""}.`);
  }

  // 3) industries (upsert by slug)
  for (const it of INDUSTRIES) {
    await client.query(
      `insert into industries (slug, name, summary, intro_md, icon_key, sort_order, published)
       values ($1,$2,$3,$4,$5,$6,true)
       on conflict (slug) do update set
         name=excluded.name, summary=excluded.summary, intro_md=excluded.intro_md,
         icon_key=excluded.icon_key, sort_order=excluded.sort_order, published=true`,
      [it.slug, it.name, it.summary, it.intro_md, it.icon_key, it.sort_order]
    );
  }
  console.log(`industries: ${INDUSTRIES.length} diproses.`);

  // 4) services (upsert by slug) — dilewati di mode --safe
  for (const s of SAFE ? [] : SERVICES) {
    await client.query(
      `insert into services (slug, title, summary, body_md, icon_key, sort_order, published)
       values ($1,$2,$3,$4,$5,$6,true)
       on conflict (slug) do update set
         title=excluded.title, summary=excluded.summary, body_md=excluded.body_md,
         icon_key=excluded.icon_key, sort_order=excluded.sort_order, published=true`,
      [s.slug, s.title, s.summary, s.body_md, s.icon_key, s.sort_order]
    );
  }
  console.log(`services: ${SERVICES.length} diproses.`);

  // 5) solutions (resolve industry_id by slug)
  for (const s of SOLUTIONS) {
    await client.query(
      `insert into solutions (slug, title, industry_id, problem, solution_label, summary, body_md, sort_order, published)
       values ($1,$2,(select id from industries where slug=$3),$4,$5,$6,$7,$8,true)
       on conflict (slug) do update set
         title=excluded.title, industry_id=excluded.industry_id, problem=excluded.problem,
         solution_label=excluded.solution_label, summary=excluded.summary, body_md=excluded.body_md,
         sort_order=excluded.sort_order, published=true`,
      [s.slug, s.title, s.industry, s.problem, s.solution_label, s.summary, s.body_md, s.sort_order]
    );
  }
  console.log(`solutions: ${SOLUTIONS.length} diproses.`);

  // 6) product_categories (upsert by slug) — dilewati di mode --safe
  for (const c of SAFE ? [] : PRODUCT_CATEGORIES) {
    await client.query(
      `insert into product_categories (slug, name, sort_order)
       values ($1,$2,$3)
       on conflict (slug) do update set name=excluded.name, sort_order=excluded.sort_order`,
      [c.slug, c.name, c.sort_order]
    );
  }
  console.log(`product_categories: ${PRODUCT_CATEGORIES.length} diproses.`);

  // 7) products (resolve category_id by slug) — dilewati di mode --safe
  for (const p of SAFE ? [] : PRODUCTS) {
    await client.query(
      `insert into products (slug, name, category_id, description_md, featured, sort_order, published)
       values ($1,$2,(select id from product_categories where slug=$3),$4,$5,$6,true)
       on conflict (slug) do update set
         name=excluded.name, category_id=excluded.category_id, description_md=excluded.description_md,
         featured=excluded.featured, sort_order=excluded.sort_order, published=true`,
      [p.slug, p.name, p.category, p.description_md, p.featured, p.sort_order]
    );
  }
  console.log(`products: ${PRODUCTS.length} diproses.`);

  await client.end();
  console.log("\nSelesai. Semua data dari Company Profile PT MIB - 2024 sudah dimasukkan.");
}

main().catch((e) => {
  console.error("\nGAGAL:", e.message);
  process.exit(1);
});
