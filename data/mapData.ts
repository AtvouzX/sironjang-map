export interface POIDetails {
  [key: string]: string;
}

export interface MapPOI {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category: 'administrasi' | 'umkm' | 'peternakan' | 'pertanian' | 'fasilitas' | 'evakuasi' | 'wisata';
  description: string;
  icon: string;
  details: POIDetails;
}

export interface MapCategory {
  id: 'administrasi' | 'umkm' | 'peternakan' | 'pertanian' | 'fasilitas' | 'evakuasi' | 'wisata';
  name: string;
  color: string; // Tailwind color class e.g. 'blue', 'orange', 'emerald'
  markerColor: string; // Hex color for markers
  icon: string;
  description: string;
  stats: { label: string; value: string }[];
}

export interface MapZone {
  id?: string;
  name: string;
  category: string;
  color: string;
  coordinates: [number, number][];
}

export const MAP_CATEGORIES: MapCategory[] = [];
export const MAP_POIS: MapPOI[] = [];

export const DEFAULT_CATEGORIES: MapCategory[] = [
  {
    id: 'administrasi',
    name: 'Administrasi',
    color: 'indigo',
    markerColor: '#609966',
    icon: 'Building2',
    description: 'Peta batas wilayah administratif Kelurahan Pakintelan, Gunungpati, Semarang. Menampilkan kantor kelurahan dan balai pertemuan warga.',
    stats: [
      { label: 'Luas Wilayah', value: '± 2.45 km²' },
      { label: 'Jumlah RW', value: '3 RW' },
      { label: 'Jumlah RT', value: '18 RT' }
    ]
  },
  {
    id: 'umkm',
    name: 'Zonasi UMKM',
    color: 'amber',
    markerColor: '#f59e0b',
    icon: 'Store',
    description: 'Peta sebaran Usaha Mikro, Kecil, dan Menengah (UMKM) lokal. Mendukung pengembangan ekonomi kreatif warga Pakintelan.',
    stats: [
      { label: 'Total UMKM', value: '42 Usaha' },
      { label: 'Sektor Dominan', value: 'Kuliner & Kerajinan' },
      { label: 'Tenaga Kerja', value: '120 Warga' }
    ]
  },
  {
    id: 'peternakan',
    name: 'Peternakan',
    color: 'lime',
    markerColor: '#84cc16',
    icon: 'Milk',
    description: 'Kawasan budidaya peternakan rakyat, sapi perah, sapi potong, kambing, dan unggas yang terorganisir untuk meminimalkan dampak lingkungan.',
    stats: [
      { label: 'Kelompok Ternak', value: '4 Kelompok' },
      { label: 'Populasi Sapi', value: '80 Ekor' },
      { label: 'Kambing & Domba', value: '110 Ekor' }
    ]
  },
  {
    id: 'pertanian',
    name: 'Pertanian & Perkebunan',
    color: 'emerald',
    markerColor: '#10b981',
    icon: 'Sprout',
    description: 'Sentra agraris Pakintelan yang subur. Menampilkan area persawahan padi irigasi dan perkebunan durian serta buah-buahan lokal unggulan.',
    stats: [
      { label: 'Lahan Pertanian', value: '45% Wilayah' },
      { label: 'Komoditas Utama', value: 'Padi, Durian, Alpukat' },
      { label: 'Kelompok Tani', value: '3 Gapoktan' }
    ]
  },
  {
    id: 'fasilitas',
    name: 'Aksesbilitas Fasilitas',
    color: 'cyan',
    markerColor: '#06b6d4',
    icon: 'School',
    description: 'Peta sebaran fasilitas umum, pendidikan, peribadatan, kesehatan, dan transportasi umum pendukung mobilitas harian warga.',
    stats: [
      { label: 'Sekolah Dasar', value: '2 SDN' },
      { label: 'Tempat Ibadah', value: '5 Lokasi' },
      { label: 'Pos Kesehatan', value: '1 Pustu, 3 Posyandu' }
    ]
  },
  {
    id: 'evakuasi',
    name: 'Jalur Evakuasi',
    color: 'red',
    markerColor: '#ef4444',
    icon: 'ShieldAlert',
    description: 'Peta kebencanaan dan mitigasi darurat. Menampilkan rute evakuasi aman serta titik kumpul sementara (TES) warga jika terjadi keadaan darurat.',
    stats: [
      { label: 'Titik Kumpul', value: '3 Lokasi Aman' },
      { label: 'Zona Rawan', value: 'Lereng Tebing Barat' },
      { label: 'Kapasitas TES', value: '1,500 Jiwa' }
    ]
  },
  {
    id: 'wisata',
    name: 'Wisata & Kuliner',
    color: 'rose',
    markerColor: '#f43f5e',
    icon: 'Compass',
    description: 'Rekomendasi destinasi wisata alam, kebun edukasi, cagar budaya sejarah, serta cafe estetik untuk bersantai di lereng perbukitan Pakintelan.',
    stats: [
      { label: 'Ekowisata', value: '2 Lokasi' },
      { label: 'Situs Sejarah', value: 'Ondo Rante' },
      { label: 'Kuliner Hits', value: 'Kopi Joss, Kebun Durian' }
    ]
  }
];

export const DEFAULT_POIS: MapPOI[] = [
  // Administrasi
  {
    id: 'admin-kelurahan',
    name: 'Kantor Kelurahan Pakintelan',
    lat: -7.09203,
    lng: 110.39348,
    category: 'administrasi',
    description: 'Pusat pelayanan administratif kelurahan Pakintelan, Kecamatan Gunungpati, Kota Semarang.',
    icon: 'Building2',
    details: {
      'Alamat': 'Jl. Winongsari RT 01 RW 02, Pakintelan',
      'Jam Buka': '07:30 - 16:00 (Senin - Jumat)',
      'Kepala Kelurahan': 'Lurah Pakintelan',
      'Layanan Utama': 'Kependudukan, Surat Pengantar, Pengaduan Warga, Pemberdayaan Masyarakat',
      'Kontak': '(024) 76921700'
    }
  },
  {
    id: 'admin-rw1',
    name: 'Balai Pertemuan Warga RW 01',
    lat: -7.0895,
    lng: 110.3912,
    category: 'administrasi',
    description: 'Gedung serbaguna untuk koordinasi, posyandu, dan rapat warga RW 01.',
    icon: 'Users',
    details: {
      'Fasilitas': 'Pendopo Pertemuan, Toilet, Area Parkir Balai',
      'Kapasitas': '± 100 Orang',
      'Kegiatan Rutin': 'Rapat RW Bulanan, Posyandu Balita, Latihan Kesenian'
    }
  },
  {
    id: 'admin-rw3',
    name: 'Balai Warga & Pos Ronda RW 03',
    lat: -7.0965,
    lng: 110.3970,
    category: 'administrasi',
    description: 'Pusat koordinasi warga RW 03 dan pos keamanan lingkungan terpadu.',
    icon: 'Users',
    details: {
      'Fasilitas': 'Ruang Rapat Kecil, Pos Kamling, Papan Informasi Warga',
      'Kegiatan': 'Ronda Malam Terpadu, Rapat Pengurus RT/RW'
    }
  },

  // UMKM
  {
    id: 'umkm-keripik',
    name: 'Sentra Keripik Singkong Maju Mapan',
    lat: -7.0910,
    lng: 110.3905,
    category: 'umkm',
    description: 'Industri makanan ringan skala rumah tangga yang mengolah hasil panen singkong lokal menjadi keripik renyah beraneka rasa.',
    icon: 'Store',
    details: {
      'Pemilik': 'Ibu Sri Wahyuni',
      'Produk': 'Keripik Singkong Original, Keripik Singkong Balado Pedas, Keripik Pisang Tanduk',
      'Harga': 'Rp 8.000 - Rp 15.000 / bungkus',
      'Kontak': '0812-3456-7890',
      'Pemasaran': 'Toko Lokal & Online Marketplace'
    }
  },
  {
    id: 'umkm-batik',
    name: 'Batik Warna Alam Pakintelan',
    lat: -7.0880,
    lng: 110.3872,
    category: 'umkm',
    description: 'Kerajinan batik tulis dan cap ramah lingkungan menggunakan pewarna alami dari ekstrak tanaman lokal.',
    icon: 'Palette',
    details: {
      'Pemilik': 'Pak Bambang',
      'Keunikan': 'Pewarna alami dari daun mangga, indigo, dan kulit kayu mahoni lokal',
      'Produk': 'Kain Batik Tulis, Kemeja Batik, Aksesoris Kain',
      'Jam Buka': '08:00 - 16:00 (Setiap Hari)'
    }
  },
  {
    id: 'umkm-mboksum',
    name: 'Warung Makan Tradisional Mbok Sum',
    lat: -7.0935,
    lng: 110.3920,
    category: 'umkm',
    description: 'Warung kuliner lokal legendaris menyajikan menu sarapan dan makan siang khas Jawa rumahan.',
    icon: 'Utensils',
    details: {
      'Menu Andalan': 'Mangut Lele Asap, Nasi Pecel Gunungpati, Tempe Mendoan Hangat',
      'Rentang Harga': 'Rp 6.000 - Rp 22.000',
      'Jam Buka': '06:00 - 15:30'
    }
  },
  {
    id: 'umkm-berkah',
    name: 'Toko Kelontong & Sembako Berkah',
    lat: -7.0925,
    lng: 110.3940,
    category: 'umkm',
    description: 'Mitra UMKM penyedia sembako dan kebutuhan harian masyarakat sekitar kelurahan.',
    icon: 'ShoppingBag',
    details: {
      'Pemilik': 'Pak Haji Ahmad',
      'Layanan': 'Eceran Sembako, Isi Ulang Gas & Air Mineral, Pembayaran Tagihan Listrik/BPJS'
    }
  },

  // Peternakan
  {
    id: 'ternak-sapi',
    name: 'Kelompok Ternak Sapi Mendho Rejo',
    lat: -7.0970,
    lng: 110.4005,
    category: 'peternakan',
    description: 'Kawasan kandang komunal sapi potong dan sapi perah terpadu dengan pengolahan limbah menjadi biogas.',
    icon: 'Milk',
    details: {
      'Ketua Kelompok': 'Bapak Supardi',
      'Populasi Sapi': '45 Ekor Sapi Limosin & Simmental',
      'Inovasi': 'Pengolahan pupuk kandang kompos organik and instalasi biogas rumah tangga',
      'Fokus Usaha': 'Penyediaan sapi kurban and penjualan pupuk organik'
    }
  },
  {
    id: 'ternak-ayam',
    name: 'Kandang Ayam Petelur Barokah',
    lat: -7.0870,
    lng: 110.3990,
    category: 'peternakan',
    description: 'Peternakan ayam petelur modern berskala menengah dengan pakan organik mandiri.',
    icon: 'Egg',
    details: {
      'Pengelola': 'Pak Joko Susilo',
      'Populasi': '1.500 Ekor Ayam Ras',
      'Kapasitas': '± 55 kg telur segar per hari',
      'Pemasaran': 'Langsung ke warung warga and pasar tradisional terdekat'
    }
  },
  {
    id: 'ternak-kambing',
    name: 'Budidaya Kambing Etawa Pakintelan',
    lat: -7.0945,
    lng: 110.3995,
    category: 'peternakan',
    description: 'Peternakan kambing ras Etawa yang fokus pada produksi susu kambing segar berkualitas tinggi.',
    icon: 'Shield',
    details: {
      'Pengelola': 'Mas Danang',
      'Manfaat Produk': 'Susu kambing etawa berkhasiat untuk terapi pernapasan and imunitas',
      'Kontak': '0821-9988-7766',
      'Jam Kunjungan': '15:00 - 17:00 (Waktu pemerahan susu)'
    }
  },

  // Pertanian & Perkebunan
  {
    id: 'tani-durian',
    name: 'Kebun Durian Wisata Watu Simbar',
    lat: -7.0965,
    lng: 110.3892,
    category: 'pertanian',
    description: 'Kebun wisata edukasi agro durian lokal seluas 1.5 hektar dengan puluhan pohon durian berumur puluhan tahun.',
    icon: 'Trees',
    details: {
      'Pengelola': 'Bapak H. Mulyono',
      'Varietas Utama': 'Durian Kholil (Juara Kontes Lokal), Durian Sukun, Durian Merica',
      'Fasilitas': 'Edu-wisata menanam, Gazebo Santai, Kantin Kuliner Durian',
      'Kontak': '(024) 76921737'
    }
  },
  {
    id: 'tani-padi',
    name: 'Persawahan Irigasi Gapoktan Subur Makmur',
    lat: -7.0915,
    lng: 110.3980,
    category: 'pertanian',
    description: 'Lahan sawah produktif utama warga Pakintelan yang menerapkan sistem pertanian padi semi-organik.',
    icon: 'Sprout',
    details: {
      'Ketua Gapoktan': 'Mbah Carik Sugondo',
      'Luas Lahan': '12 Hektar',
      'Varietas Padi': 'IR-64, Ciherang, Mentik Wangi',
      'Siklus Tanam': '3 kali setahun (Padi - Padi - Palawija)'
    }
  },
  {
    id: 'tani-alpukat',
    name: 'Kebun Alpukat Mentega Organik',
    lat: -7.0980,
    lng: 110.3950,
    category: 'pertanian',
    description: 'Sentra budidaya buah alpukat mentega yang tebal, pulen, manis, dikelola tanpa bahan kimia sintetis.',
    icon: 'Leaf',
    details: {
      'Panen Raya': 'Maret - April & September - Oktober',
      'Kapasitas Panen': '1-2 Ton per panen raya',
      'Pembelian': 'Bisa metik langsung di kebun saat musim panen'
    }
  },

  // Fasilitas
  {
    id: 'fas-sdn1',
    name: 'SD Negeri Pakintelan 01',
    lat: -7.0932,
    lng: 110.3925,
    category: 'fasilitas',
    description: 'Sekolah dasar negeri terbesar di Pakintelan sebagai sarana wajib belajar 9 tahun anak-anak setempat.',
    icon: 'School',
    details: {
      'Akreditasi': 'A',
      'Kepala Sekolah': 'Bapak Supriyadi, M.Pd.',
      'Fasilitas': '6 Ruang Kelas, Perpustakaan, Lab Komputer, Lapangan Upacara/Olahraga',
      'Jumlah Siswa': '± 240 Siswa'
    }
  },
  {
    id: 'fas-sdn2',
    name: 'SD Negeri Pakintelan 02',
    lat: -7.0888,
    lng: 110.3920,
    category: 'fasilitas',
    description: 'Sekolah dasar negeri yang melayani kebutuhan pendidikan bagi warga wilayah utara (dekat perbatasan Sekaran).',
    icon: 'School',
    details: {
      'Akreditasi': 'A',
      'Fasilitas': 'Ruang Kelas Nyaman, Taman Sekolah Hijau, Sarana Bermain'
    }
  },
  {
    id: 'fas-masjid',
    name: 'Masjid Jami Baitul Muttaqin',
    lat: -7.0915,
    lng: 110.3938,
    category: 'fasilitas',
    description: 'Masjid pusat keagamaan umat Muslim kelurahan Pakintelan, terletak strategis di pinggir jalan desa.',
    icon: 'Compass',
    details: {
      'Kapasitas': '± 500 Jemaah',
      'Layanan Sosial': 'Ambulans Gratis untuk Warga, Pengajian Mingguan, TPQ Baitul Muttaqin'
    }
  },
  {
    id: 'fas-pustu',
    name: 'Puskesmas Pembantu (Pustu) Pakintelan',
    lat: -7.0924,
    lng: 110.3930,
    category: 'fasilitas',
    description: 'Fasilitas kesehatan dasar penunjang Puskesmas Gunungpati untuk pemeriksaan medis rutin warga.',
    icon: 'HeartPulse',
    details: {
      'Jam Buka': '08:00 - 12:00 (Senin - Kamis), 08:00 - 11:00 (Jumat)',
      'Pelayanan': 'Pemeriksaan Umum, Posyandu Lansia, Imunisasi Balita, Konsultasi KB',
      'Tenaga Medis': '1 Bidan Desa menetap & Dokter Kunjungan Mingguan'
    }
  },
  {
    id: 'fas-halte',
    name: 'Halte Feeder Trans Semarang Mangunsari',
    lat: -7.0865,
    lng: 110.3895,
    category: 'fasilitas',
    description: 'Pemberhentian bus pengumpan Trans Semarang yang menghubungkan wilayah Pakintelan dengan halte transit UNNES.',
    icon: 'Bus',
    details: {
      'Rute Feeder': 'Rute F4A (Pudakpayung - Sumur Jurang - UNNES)',
      'Jam Operasional': '05:45 - 17:30 WIB',
      'Tarif': 'Rp 3.500 (Umum), Rp 1.000 (Pelajar/Mahasiswa/Lansia)'
    }
  },

  // Evakuasi
  {
    id: 'eva-lapangan',
    name: 'Tempat Evakuasi Sementara - Lapangan Sepak Bola',
    lat: -7.0945,
    lng: 110.3942,
    category: 'evakuasi',
    description: 'Area terbuka paling luas di Pakintelan, ditentukan sebagai Titik Kumpul Aman Utama dari potensi reruntuhan gedung atau longsor tebing.',
    icon: 'ShieldAlert',
    details: {
      'Klasifikasi': 'Tempat Evakuasi Sementara (TES) Terbuka',
      'Kapasitas Tampung': '± 1.500 Orang',
      'Fasilitas Darurat': 'Akses Air Bersih Pos Ronda, Ruang Lapang untuk Pendirian Tenda Darurat BNPB/BPBD'
    }
  },
  {
    id: 'eva-kelurahan',
    name: 'Gedung Kelurahan (Posko Bencana & Logistik)',
    lat: -7.09203,
    lng: 110.39348,
    category: 'evakuasi',
    description: 'Gedung kantor kelurahan difungsikan sebagai pos komando (Posko) darurat, pusat komunikasi bencana, dan gudang logistik.',
    icon: 'ShieldAlert',
    details: {
      'Klasifikasi': 'Tempat Evakuasi Akhir (TEA) Semi-Indoor',
      'Fasilitas': 'Dapur Umum Mandiri, Genset Listrik Darurat, Kamar Mandi, Ruang Medis Sementara',
      'Kapasitas': '± 300 Jiwa di dalam aula kelurahan'
    }
  },

  // Wisata
  {
    id: 'wisata-durian',
    name: 'Wisata Agro Kebun Durian Watu Simbar',
    lat: -7.0965,
    lng: 110.3892,
    category: 'wisata',
    description: 'Kebun rekreasi berhawa sejuk dengan fasilitas lesehan di bawah rimbunnya pohon durian raksasa.',
    icon: 'Trees',
    details: {
      'Daya Tarik': 'Sensasi makan durian jatuh pohon langsung, edukasi perawatan bibit durian unggulan',
      'Tiket': 'Gratis Masuk Area (Hanya membayar buah durian yang dikonsumsi)',
      'Fasilitas': 'Pendopo Kayu, Mushola, Gazebo Alam, Area Parkir Luas'
    }
  },
  {
    id: 'wisata-kali',
    name: 'Ekowisata Pinggir Kali Pakintelan',
    lat: -7.0988,
    lng: 110.3915,
    category: 'wisata',
    description: 'Destinasi wisata bantaran sungai berbatu alami yang jernih, sangat disukai anak-anak untuk mandi sungai dan keluarga untuk berkemah.',
    icon: 'Tent',
    details: {
      'Harga Tiket': 'Rp 5.000 (Kebersihan)',
      'Layanan Sewa': 'Tenda Dome (Rp 35.000/malam), Alat Pancing, Pelampung Ban',
      'Kuliner': 'Kedai kopi khas tepi kali menyajikan pisang goreng hangat dan mi instan rebus'
    }
  },
  {
    id: 'wisata-ondorante',
    name: 'Tangga Bersejarah Ondo Rante',
    lat: -7.0995,
    lng: 110.3985,
    category: 'wisata',
    description: 'Jalur trekking peninggalan era kolonial Belanda berupa ratusan anak tangga beton yang menyusuri pipa air raksasa penyuplai kota Semarang.',
    icon: 'Footprints',
    details: {
      'Daya Tarik': 'Pemandangan lembah Gunungpati yang asri, udara segar hutan jati, jejak sejarah konstruksi pipa kolonial',
      'Panjang Rute': '± 1.2 Kilometer dengan elevasi naik-turun',
      'Rekomendasi': 'Gunakan sepatu olahraga/trekking, bawa air minum sendiri'
    }
  },
  {
    id: 'wisata-kopijoss',
    name: 'Kedai Kopi Joss \'N\' Milk',
    lat: -7.0862,
    lng: 110.3888,
    category: 'wisata',
    description: 'Angkringan cafe modern yang menyajikan Kopi Joss arang membara dipadukan dengan susu murni hasil peternakan Gunungpati.',
    icon: 'CupSoda',
    details: {
      'Jam Buka': '16:00 - 00:00 (Setiap Hari)',
      'Menu Terlaris': 'Kopi Joss Arang Panas, Susu Murni Oreo, Nasi Kucing Bakar teri',
      'Fasilitas': 'Koneksi WiFi Cepat, Tempat Duduk Lesehan Luas, Live Musik Akustik Akhir Pekan'
    }
  }
];

// Boundary Polygons for thematic maps
export const BOUNDARY_PAKINTELAN = [
  [
    -7.0828152,
    110.3871509
  ],
  [
    -7.0831445,
    110.3871665
  ],
  [
    -7.0839968,
    110.3872263
  ],
  [
    -7.08441,
    110.3872499
  ],
  [
    -7.0848072,
    110.3872719
  ],
  [
    -7.08502,
    110.3872411
  ],
  [
    -7.0853925,
    110.3871995
  ],
  [
    -7.0857256,
    110.3871942
  ],
  [
    -7.0861309,
    110.3872233
  ],
  [
    -7.0865399,
    110.3873892
  ],
  [
    -7.0868519,
    110.3875553
  ],
  [
    -7.087937,
    110.3879874
  ],
  [
    -7.0883045,
    110.388195
  ],
  [
    -7.0885819,
    110.3883612
  ],
  [
    -7.0890084,
    110.3886277
  ],
  [
    -7.0892025,
    110.388676
  ],
  [
    -7.0893901,
    110.3888188
  ],
  [
    -7.0896132,
    110.3888491
  ],
  [
    -7.0899463,
    110.3889134
  ],
  [
    -7.0900517,
    110.3889385
  ],
  [
    -7.0902613,
    110.3889886
  ],
  [
    -7.090667,
    110.3889622
  ],
  [
    -7.0915124,
    110.3890097
  ],
  [
    -7.0919976,
    110.3890923
  ],
  [
    -7.0929609,
    110.3891951
  ],
  [
    -7.0938723,
    110.3893083
  ],
  [
    -7.094399,
    110.3893839
  ],
  [
    -7.0956015,
    110.389587
  ],
  [
    -7.0959827,
    110.389642
  ],
  [
    -7.0966514,
    110.3896723
  ],
  [
    -7.0971849,
    110.3896231
  ],
  [
    -7.0978777,
    110.389525
  ],
  [
    -7.0980043,
    110.38954
  ],
  [
    -7.0979929,
    110.389919
  ],
  [
    -7.0980655,
    110.3901871
  ],
  [
    -7.0981187,
    110.390291
  ],
  [
    -7.0983519,
    110.3904208
  ],
  [
    -7.0983795,
    110.3905659
  ],
  [
    -7.0985289,
    110.3908767
  ],
  [
    -7.0986624,
    110.391464
  ],
  [
    -7.0988572,
    110.3922753
  ],
  [
    -7.0990414,
    110.3928858
  ],
  [
    -7.0991102,
    110.3933619
  ],
  [
    -7.0992916,
    110.3938853
  ],
  [
    -7.09946,
    110.3940759
  ],
  [
    -7.0995858,
    110.3942606
  ],
  [
    -7.0996214,
    110.3942743
  ],
  [
    -7.0997969,
    110.3944571
  ],
  [
    -7.1000327,
    110.3947486
  ],
  [
    -7.1002363,
    110.3948434
  ],
  [
    -7.1002526,
    110.3948955
  ],
  [
    -7.1003141,
    110.3949078
  ],
  [
    -7.1005262,
    110.39495
  ],
  [
    -7.1006498,
    110.3950957
  ],
  [
    -7.1006424,
    110.3953017
  ],
  [
    -7.1007114,
    110.3953958
  ],
  [
    -7.1007514,
    110.3958158
  ],
  [
    -7.1007914,
    110.3960858
  ],
  [
    -7.100873,
    110.3962912
  ],
  [
    -7.1010952,
    110.3964753
  ],
  [
    -7.101365,
    110.3965751
  ],
  [
    -7.1016379,
    110.3964996
  ],
  [
    -7.1018062,
    110.3965185
  ],
  [
    -7.1018961,
    110.3965419
  ],
  [
    -7.1020198,
    110.3968336
  ],
  [
    -7.1021546,
    110.3970242
  ],
  [
    -7.1023114,
    110.3971272
  ],
  [
    -7.1025739,
    110.3971752
  ],
  [
    -7.1026986,
    110.3971381
  ],
  [
    -7.1027611,
    110.3969303
  ],
  [
    -7.1027709,
    110.3968101
  ],
  [
    -7.1027706,
    110.3965857
  ],
  [
    -7.1029498,
    110.3964507
  ],
  [
    -7.1031853,
    110.3964617
  ],
  [
    -7.1033426,
    110.3966859
  ],
  [
    -7.1032868,
    110.3969329
  ],
  [
    -7.1032605,
    110.3969751
  ],
  [
    -7.1032614,
    110.3969758
  ],
  [
    -7.1032914,
    110.3972458
  ],
  [
    -7.1032814,
    110.3974858
  ],
  [
    -7.1032114,
    110.3976858
  ],
  [
    -7.1029814,
    110.3979058
  ],
  [
    -7.1025914,
    110.3981858
  ],
  [
    -7.1024621,
    110.3984258
  ],
  [
    -7.1024714,
    110.3985258
  ],
  [
    -7.1025111,
    110.3992211
  ],
  [
    -7.1021864,
    110.3995342
  ],
  [
    -7.1019141,
    110.399774
  ],
  [
    -7.1014346,
    110.3999992
  ],
  [
    -7.1008869,
    110.4003034
  ],
  [
    -7.1004661,
    110.4006966
  ],
  [
    -7.0999924,
    110.400991
  ],
  [
    -7.0994895,
    110.401005
  ],
  [
    -7.0990084,
    110.4009163
  ],
  [
    -7.0986888,
    110.4008305
  ],
  [
    -7.0983121,
    110.4008228
  ],
  [
    -7.0980653,
    110.4009198
  ],
  [
    -7.0978009,
    110.4010273
  ],
  [
    -7.0975838,
    110.4011082
  ],
  [
    -7.0971346,
    110.4011077
  ],
  [
    -7.0966964,
    110.40096
  ],
  [
    -7.096486,
    110.4009855
  ],
  [
    -7.0963579,
    110.4011724
  ],
  [
    -7.0961387,
    110.4016505
  ],
  [
    -7.0958825,
    110.4020133
  ],
  [
    -7.095622,
    110.4019671
  ],
  [
    -7.0954045,
    110.4017647
  ],
  [
    -7.0951556,
    110.4015723
  ],
  [
    -7.0949662,
    110.4012642
  ],
  [
    -7.0946801,
    110.4010505
  ],
  [
    -7.0944474,
    110.4010937
  ],
  [
    -7.0941331,
    110.4011739
  ],
  [
    -7.0937143,
    110.4015128
  ],
  [
    -7.093208,
    110.4021973
  ],
  [
    -7.0928636,
    110.4026498
  ],
  [
    -7.0925212,
    110.4029602
  ],
  [
    -7.0920483,
    110.4032059
  ],
  [
    -7.0916234,
    110.4032573
  ],
  [
    -7.0912332,
    110.4030943
  ],
  [
    -7.0909418,
    110.402957
  ],
  [
    -7.090741,
    110.4027822
  ],
  [
    -7.0904387,
    110.40266
  ],
  [
    -7.0901112,
    110.4028141
  ],
  [
    -7.0896968,
    110.4030372
  ],
  [
    -7.0891813,
    110.4032367
  ],
  [
    -7.0886144,
    110.4034967
  ],
  [
    -7.0882412,
    110.4037141
  ],
  [
    -7.0880597,
    110.4038364
  ],
  [
    -7.0877705,
    110.4039794
  ],
  [
    -7.0873645,
    110.4040166
  ],
  [
    -7.0870159,
    110.4039478
  ],
  [
    -7.0866449,
    110.4038133
  ],
  [
    -7.0864024,
    110.4035747
  ],
  [
    -7.0861758,
    110.4033585
  ],
  [
    -7.0859418,
    110.4031707
  ],
  [
    -7.0856283,
    110.4031952
  ],
  [
    -7.0853224,
    110.4033019
  ],
  [
    -7.0850375,
    110.4034841
  ],
  [
    -7.0848612,
    110.4037242
  ],
  [
    -7.0845864,
    110.4040594
  ],
  [
    -7.084164,
    110.4041614
  ],
  [
    -7.0834414,
    110.4041024
  ],
  [
    -7.0829561,
    110.4040951
  ],
  [
    -7.0824868,
    110.4040485
  ],
  [
    -7.0820361,
    110.4038802
  ],
  [
    -7.0819389,
    110.4036694
  ],
  [
    -7.0819216,
    110.4034004
  ],
  [
    -7.0819315,
    110.4032488
  ],
  [
    -7.082019,
    110.4030157
  ],
  [
    -7.0821319,
    110.4025546
  ],
  [
    -7.0821333,
    110.4023639
  ],
  [
    -7.0820185,
    110.4022105
  ],
  [
    -7.08188,
    110.4021827
  ],
  [
    -7.0816633,
    110.4022287
  ],
  [
    -7.0812715,
    110.402312
  ],
  [
    -7.0808645,
    110.4022433
  ],
  [
    -7.080438,
    110.4021313
  ],
  [
    -7.0801618,
    110.4021533
  ],
  [
    -7.0798872,
    110.4022868
  ],
  [
    -7.0795989,
    110.4025689
  ],
  [
    -7.0792298,
    110.4028321
  ],
  [
    -7.0790618,
    110.4030129
  ],
  [
    -7.0788013,
    110.4033452
  ],
  [
    -7.0786712,
    110.4029196
  ],
  [
    -7.078671,
    110.4027681
  ],
  [
    -7.0786805,
    110.4023235
  ],
  [
    -7.0786494,
    110.4016669
  ],
  [
    -7.0787141,
    110.4012752
  ],
  [
    -7.0786914,
    110.4012158
  ],
  [
    -7.0787014,
    110.4010258
  ],
  [
    -7.078992,
    110.4004324
  ],
  [
    -7.0791006,
    110.4002097
  ],
  [
    -7.0792766,
    110.4000533
  ],
  [
    -7.079268,
    110.3999018
  ],
  [
    -7.0791585,
    110.3995852
  ],
  [
    -7.079099,
    110.3994369
  ],
  [
    -7.0790554,
    110.3992823
  ],
  [
    -7.0789153,
    110.3988577
  ],
  [
    -7.0787965,
    110.3983523
  ],
  [
    -7.0787197,
    110.3977463
  ],
  [
    -7.0787011,
    110.3974329
  ],
  [
    -7.0788703,
    110.3972029
  ],
  [
    -7.079003,
    110.3970257
  ],
  [
    -7.079032,
    110.396984
  ],
  [
    -7.0791007,
    110.3968657
  ],
  [
    -7.079165,
    110.3968119
  ],
  [
    -7.0791949,
    110.3966698
  ],
  [
    -7.0792014,
    110.3964858
  ],
  [
    -7.0791314,
    110.3960958
  ],
  [
    -7.0791244,
    110.3959584
  ],
  [
    -7.0791315,
    110.395807
  ],
  [
    -7.0791366,
    110.3956027
  ],
  [
    -7.0791524,
    110.3953609
  ],
  [
    -7.0791466,
    110.3950008
  ],
  [
    -7.0791463,
    110.3947805
  ],
  [
    -7.0790977,
    110.3945387
  ],
  [
    -7.0790637,
    110.3943701
  ],
  [
    -7.0790614,
    110.3943058
  ],
  [
    -7.0788892,
    110.3933896
  ],
  [
    -7.0788867,
    110.3932921
  ],
  [
    -7.0788757,
    110.3931363
  ],
  [
    -7.0788594,
    110.3929805
  ],
  [
    -7.0788645,
    110.3927655
  ],
  [
    -7.0788604,
    110.3926109
  ],
  [
    -7.0788593,
    110.3925717
  ],
  [
    -7.0788318,
    110.3923893
  ],
  [
    -7.0787669,
    110.3920508
  ],
  [
    -7.0787453,
    110.3919165
  ],
  [
    -7.0787428,
    110.3918187
  ],
  [
    -7.0787664,
    110.3916424
  ],
  [
    -7.0787829,
    110.3914362
  ],
  [
    -7.0788094,
    110.3911782
  ],
  [
    -7.0788413,
    110.3909148
  ],
  [
    -7.0788666,
    110.3908156
  ],
  [
    -7.078865,
    110.3907729
  ],
  [
    -7.0788972,
    110.3906218
  ],
  [
    -7.078897,
    110.3904498
  ],
  [
    -7.0788485,
    110.3902887
  ],
  [
    -7.0788054,
    110.3901436
  ],
  [
    -7.0787976,
    110.3900816
  ],
  [
    -7.0787514,
    110.3899664
  ],
  [
    -7.0787351,
    110.3897944
  ],
  [
    -7.078751,
    110.3896224
  ],
  [
    -7.0787346,
    110.3894343
  ],
  [
    -7.0787344,
    110.3892355
  ],
  [
    -7.0787127,
    110.3891065
  ],
  [
    -7.0786857,
    110.3889668
  ],
  [
    -7.0786747,
    110.3887573
  ],
  [
    -7.078642,
    110.3884026
  ],
  [
    -7.0786202,
    110.3881393
  ],
  [
    -7.0785986,
    110.3880555
  ],
  [
    -7.0785767,
    110.3877492
  ],
  [
    -7.0785839,
    110.3877512
  ],
  [
    -7.0785733,
    110.3876379
  ],
  [
    -7.0786331,
    110.3876355
  ],
  [
    -7.0788785,
    110.3876986
  ],
  [
    -7.0790955,
    110.3877541
  ],
  [
    -7.0793325,
    110.3877723
  ],
  [
    -7.0795773,
    110.3878168
  ],
  [
    -7.080017,
    110.3878256
  ],
  [
    -7.0804949,
    110.3877828
  ],
  [
    -7.0807233,
    110.3877198
  ],
  [
    -7.0814751,
    110.3874349
  ],
  [
    -7.0820502,
    110.3872383
  ],
  [
    -7.0823391,
    110.3871822
  ],
  [
    -7.0828152,
    110.3871509
  ]
];

export const DEFAULT_ZONES: MapZone[] = [
  {
    name: 'Zonasi UMKM',
    category: 'umkm',
    color: '#f59e0b',
    coordinates: [
      [-7.0905, 110.3895],
      [-7.0915, 110.3945],
      [-7.0940, 110.3940],
      [-7.0935, 110.3890]
    ]
  },
  {
    name: 'Kawasan Peternakan',
    category: 'peternakan',
    color: '#84cc16',
    coordinates: [
      [-7.0930, 110.3980],
      [-7.0950, 110.4030],
      [-7.0990, 110.4010],
      [-7.0970, 110.3970]
    ]
  },
  {
    name: 'Sentra Pertanian',
    category: 'pertanian',
    color: '#10b981',
    coordinates: [
      [-7.0880, 110.3950],
      [-7.0900, 110.4000],
      [-7.0940, 110.3970],
      [-7.0960, 110.3930],
      [-7.0985, 110.3955],
      [-7.1005, 110.3975],
      [-7.0990, 110.3930]
    ]
  }
];

