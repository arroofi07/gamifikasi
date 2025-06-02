export interface Question {
    question: string;
    answer: string[];
    kunciJawaban: string;
    difficulty: 'easy' | 'medium' | 'hard';
}

export interface Planet {
    name: string;
    image: string;
    width: number;
    height: number;
    position?: string;
    animation: string;
    questions: {
        easy: Question;
        medium: Question;
        hard: Question;
    };
    color: string;
    info?: {
        description: string;
        facts: string[];
    };
}

export const planetsData: Planet[] = [
    {
        name: "Matahari",
        image: "sun",
        width: 230,
        height: 230,
        animation: "glow",
        questions: {
            easy: {
                question: "Apa yang dimaksud dengan korupsi?",
                answer: ["Mengambil uang negara", "Berbohong", "Mencuri", "Membolos"],
                kunciJawaban: "Mengambil uang negara",
                difficulty: "easy"
            },
            medium: {
                question: "Istilah korupsi dalam bahasa Latin yang benar adalah…",
                answer: ["Corrupt", "Corruption", "Corrumpere", "Korruptie"],
                kunciJawaban: "Corrumpere",
                difficulty: "medium"
            },
            hard: {
                question: "Menurut UU No. 31/1999, kerugian negara minimal untuk dikategorikan korupsi adalah?",
                answer: ["Rp 1 juta", "Rp 2,5 juta", "Rp 5 juta", "Tidak ada batas minimal"],
                kunciJawaban: "Tidak ada batas minimal",
                difficulty: "hard"
            }
        },
        color: "#FFD700",
        info: {
            description: "Matahari adalah pusat tata surya kita, memberikan cahaya dan kehangatan untuk kehidupan.",
            facts: [
                "Diameter 1,4 juta km",
                "Suhu permukaan 5,500°C",
                "Usia sekitar 4,6 miliar tahun"
            ]
        }
    },
    {
        name: "Merkurius",
        image: "mercury",
        width: 70,
        height: 70,
        position: "ml-42",
        animation: "bounce",
        questions: {
            easy: {
                question: "Siapa yang bertugas memberantas korupsi di Indonesia?",
                answer: ["Polisi", "KPK", "Tentara", "Guru"],
                kunciJawaban: "KPK",
                difficulty: "easy"
            },
            medium: {
                question: "Istilah korupsi dari bahasa Malaysia yang benar adalah…",
                answer: ["Korupsi", "Rasuah", "Busuk", "Disuap"],
                kunciJawaban: "Rasuah",
                difficulty: "medium"
            },
            hard: {
                question: "Dalam UNCAC, berapa jumlah negara penandatangan konvensi anti-korupsi PBB?",
                answer: ["140 negara", "165 negara", "189 negara", "193 negara"],
                kunciJawaban: "189 negara",
                difficulty: "hard"
            }
        },
        color: "#C0C0C0",
        info: {
            description: "Merkurius adalah planet terdekat dengan Matahari dan terkecil dalam tata surya.",
            facts: [
                "Jarak dari Matahari: 58 juta km",
                "1 hari di Merkurius = 59 hari Bumi",
                "Tidak memiliki atmosfer"
            ]
        }
    },
    {
        name: "Venus",
        image: "venus",
        width: 80,
        height: 80,
        position: "mr-52",
        animation: "pulse",
        questions: {
            easy: {
                question: "Apa akibat dari korupsi?",
                answer: ["Negara rugi", "Negara untung", "Rakyat kaya", "Semua senang"],
                kunciJawaban: "Negara rugi",
                difficulty: "easy"
            },
            medium: {
                question: "Suatu tindakan maupun ucapan yang lurus, tidak berbohong dan tidak curang disebut…",
                answer: ["Keadilan", "Tanggung Jawab", "Kejujuran", "Kesederhanaan"],
                kunciJawaban: "Kejujuran",
                difficulty: "medium"
            },
            hard: {
                question: "Indeks Persepsi Korupsi Indonesia tahun 2023 berada di peringkat berapa dari 180 negara?",
                answer: ["89", "102", "115", "121"],
                kunciJawaban: "115",
                difficulty: "hard"
            }
        },
        color: "#FFA500",
        info: {
            description: "Venus sering disebut 'Bintang Kejora' dan merupakan planet terpanas dalam tata surya.",
            facts: [
                "Suhu permukaan: 462°C",
                "Atmosfer: 96% karbon dioksida",
                "1 hari Venus = 243 hari Bumi"
            ]
        }
    },
    {
        name: "Bumi",
        image: "earth",
        width: 100,
        height: 100,
        position: "ml-10",
        animation: "rotate",
        questions: {
            easy: {
                question: "Contoh perilaku jujur di sekolah adalah?",
                answer: ["Mencontek", "Tidak mencontek", "Bolos", "Terlambat"],
                kunciJawaban: "Tidak mencontek",
                difficulty: "easy"
            },
            medium: {
                question: "Komponen dari pengertian korupsi di bawah ini yang tidak benar adalah …",
                answer: [
                    "Suatu perilaku yang terkait penyalahgunaan wewenang atau kekuasaan",
                    "Perbuatan tersebut memperkaya diri sendiri dan/atau kelompok",
                    "Merugikan keuangan negara",
                    "Perbuatannya ditujukan untuk mensejahterakan rakyat"
                ],
                kunciJawaban: "Perbuatannya ditujukan untuk mensejahterakan rakyat",
                difficulty: "medium"
            },
            hard: {
                question: "Berapa maksimal hukuman mati untuk tindak pidana korupsi di Indonesia?",
                answer: ["Hanya untuk korupsi di atas Rp 1 Miliar", "Untuk semua jenis korupsi", "Dalam keadaan tertentu sesuai UU", "Tidak ada hukuman mati"],
                kunciJawaban: "Dalam keadaan tertentu sesuai UU",
                difficulty: "hard"
            }
        },
        color: "#4169E1",
        info: {
            description: "Bumi adalah rumah kita, satu-satunya planet yang diketahui memiliki kehidupan.",
            facts: [
                "71% permukaan tertutup air",
                "Atmosfer: 78% nitrogen, 21% oksigen",
                "Memiliki 1 satelit alami: Bulan"
            ]
        }
    },
    {
        name: "Mars",
        image: "mars",
        width: 80,
        height: 80,
        position: "ml-52",
        animation: "shake",
        questions: {
            easy: {
                question: "KPK singkatan dari?",
                answer: ["Komisi Pemberantasan Korupsi", "Komisi Pemilihan Korupsi", "Komite Pencegahan Korupsi", "Komisi Pengadilan Korupsi"],
                kunciJawaban: "Komisi Pemberantasan Korupsi",
                difficulty: "easy"
            },
            medium: {
                question: "Lembaga yang khusus dibentuk oleh Undang-Undang untuk mencegah dan memberantas korupsi di Indonesia adalah…",
                answer: ["Dewan Perwakilan Rakyat Republik Indonesia", "Komisi Pemberantasan Korupsi Republik Indonesia", "Mahkamah Agung Republik Indonesia", "Komisi Yudisial Republik Indonesia"],
                kunciJawaban: "Komisi Pemberantasan Korupsi Republik Indonesia",
                difficulty: "medium"
            },
            hard: {
                question: "Berapa jumlah kasus korupsi yang ditangani KPK dengan kerugian negara terbesar dalam sejarah?",
                answer: ["Rp 108 triliun", "Rp 271 triliun", "Rp 349 triliun", "Rp 454 triliun"],
                kunciJawaban: "Rp 271 triliun",
                difficulty: "hard"
            }
        },
        color: "#DC143C",
        info: {
            description: "Mars dikenal sebagai 'Planet Merah' karena oksida besi di permukaannya.",
            facts: [
                "Memiliki 2 bulan: Phobos dan Deimos",
                "Hari di Mars = 24 jam 37 menit",
                "Gravity: 38% dari Bumi"
            ]
        }
    },
    {
        name: "Jupiter",
        image: "jupiter",
        width: 200,
        height: 200,
        position: "ml-2",
        animation: "float",
        questions: {
            easy: {
                question: "Apa yang harus dilakukan jika melihat korupsi?",
                answer: ["Diam saja", "Ikut korupsi", "Laporkan", "Pura-pura tidak tahu"],
                kunciJawaban: "Laporkan",
                difficulty: "easy"
            },
            medium: {
                question: "Petty Corruption adalah…",
                answer: [
                    "Penyalahgunaan kekuatan tingkat tinggi yang menguntungkan segelintir orang dengan mengorbankan banyak orang.",
                    "Penyalahgunaan kekuasaan oleh pejabat publik dalam interaksi mereka dengan warga biasa di kehidupan sehari-hari.",
                    "Manipulasi kebijakan, institusi dan dan aturan prosedur oleh para pengambil keputusan politik.",
                    "Perbuatan mengambil barang milik orang lain untuk dikuasai sendiri dengan ancaman kekerasan."
                ],
                kunciJawaban: "Penyalahgunaan kekuasaan oleh pejabat publik dalam interaksi mereka dengan warga biasa di kehidupan sehari-hari.",
                difficulty: "medium"
            },
            hard: {
                question: "Berapa persen aset hasil korupsi yang berhasil dikembalikan ke negara sejak reformasi?",
                answer: ["15-20%", "25-30%", "35-40%", "45-50%"],
                kunciJawaban: "25-30%",
                difficulty: "hard"
            }
        },
        color: "#DAA520",
        info: {
            description: "Jupiter adalah planet terbesar dalam tata surya kita dengan badai raksasa.",
            facts: [
                "Memiliki 95 bulan yang diketahui",
                "Great Red Spot: badai selama 400+ tahun",
                "Massa: 2.5x semua planet lain digabung"
            ]
        }
    },
    {
        name: "Saturnus",
        image: "saturnus",
        width: 200,
        height: 200,
        position: "mr-5",
        animation: "wobble",
        questions: {
            easy: {
                question: "Contoh gratifikasi yang dilarang adalah?",
                answer: ["Hadiah ulang tahun dari keluarga", "THR dari perusahaan", "Parcel lebaran untuk pejabat", "Gaji bulanan"],
                kunciJawaban: "Parcel lebaran untuk pejabat",
                difficulty: "easy"
            },
            medium: {
                question: "Berikut jenis-jenis tindak pidana korupsi, kecuali: …",
                answer: [
                    "Gratifikasi, Suap-Menyuap dan Penggelapan dalam jabatan",
                    "Kerugian keuangan negara, benturan kepentingan dalam pengadaan, dan merintangi pemeriksanaan",
                    "Pencurian, Pemerasan, dan Gratifikasi",
                    "Perbuatan curang, suap-menyuap dan pemerasan."
                ],
                kunciJawaban: "Pencurian, Pemerasan, dan Gratifikasi",
                difficulty: "medium"
            },
            hard: {
                question: "Berapa nilai gratifikasi yang wajib dilaporkan ke KPK?",
                answer: ["Rp 1 juta", "Rp 5 juta", "Rp 10 juta", "Semua nilai"],
                kunciJawaban: "Rp 10 juta",
                difficulty: "hard"
            }
        },
        color: "#F0E68C",
        info: {
            description: "Saturnus terkenal dengan cincin spektakulernya yang terbuat dari es dan batuan.",
            facts: [
                "Memiliki 146 bulan",
                "Cincin terdiri dari miliaran partikel",
                "Densitas lebih rendah dari air"
            ]
        }
    },
    {
        name: "Uranus",
        image: "uranus",
        width: 150,
        height: 150,
        position: "mr-52",
        animation: "orbit",
        questions: {
            easy: {
                question: "Nilai anti korupsi yang paling penting adalah?",
                answer: ["Kekayaan", "Kejujuran", "Kepandaian", "Ketampanan"],
                kunciJawaban: "Kejujuran",
                difficulty: "easy"
            },
            medium: {
                question: "Fraud Triangle merupakan teori yang menjelaskan faktor-faktor penyebab korupsi. Penjelasan mengenai Fraud Triangle yang benar adalah..",
                answer: [
                    "Capability, Rationalization, Pressure",
                    "Pressure, Opportunity, Rationalization",
                    "Pressure, Rationalization, Capability",
                    "Opportunity, Capability, Rationalization"
                ],
                kunciJawaban: "Pressure, Opportunity, Rationalization",
                difficulty: "medium"
            },
            hard: {
                question: "Diamond Fraud Theory menambahkan satu elemen ke Fraud Triangle, yaitu?",
                answer: ["Capability", "Competence", "Arrogance", "Intelligence"],
                kunciJawaban: "Capability",
                difficulty: "hard"
            }
        },
        color: "#40E0D0",
        info: {
            description: "Uranus adalah planet yang unik karena berotasi miring hampir 90 derajat.",
            facts: [
                "Memiliki 27 bulan",
                "Musim berlangsung 21 tahun",
                "Atmosfer mengandung metana"
            ]
        }
    },
    {
        name: "Neptunus",
        image: "neptune",
        width: 100,
        height: 100,
        position: "ml-52",
        animation: "glow",
        questions: {
            easy: {
                question: "Contoh perilaku koruptif siswa adalah?",
                answer: ["Belajar rajin", "Mencontek", "Membantu teman", "Datang tepat waktu"],
                kunciJawaban: "Mencontek",
                difficulty: "easy"
            },
            medium: {
                question: "Jenis-jenis perilaku koruptif yang sering dilakukan siswa yang paling tepat adalah…",
                answer: [
                    "Terlambat, mencontek, plagiat, mark up uang buku, dan bolos",
                    "Plagiat, berbohong, mencuri, dan suap",
                    "Mencontek, tawuran, suap, gratifikasi",
                    "Gratifikasi, Penyalahgunaan Dana Beasiswa, Mark-up uang sekolah dan penipuan"
                ],
                kunciJawaban: "Terlambat, mencontek, plagiat, mark up uang buku, dan bolos",
                difficulty: "medium"
            },
            hard: {
                question: "Menurut penelitian, berapa persen siswa yang pernah mencontek minimal sekali?",
                answer: ["50-60%", "60-70%", "70-80%", "80-90%"],
                kunciJawaban: "80-90%",
                difficulty: "hard"
            }
        },
        color: "#0000CD",
        info: {
            description: "Neptunus adalah planet terjauh dalam tata surya dengan angin tercepat.",
            facts: [
                "Kecepatan angin hingga 2,100 km/jam",
                "Memiliki 16 bulan",
                "1 tahun = 165 tahun Bumi"
            ]
        }
    },
    {
        name: "Pluto",
        image: "pluto",
        width: 75,
        height: 75,
        position: "mr-3",
        animation: "float",
        questions: {
            easy: {
                question: "GONE Theory terdiri dari Greed, Opportunities, Needs, dan?",
                answer: ["Education", "Exposure", "Experience", "Example"],
                kunciJawaban: "Exposure",
                difficulty: "easy"
            },
            medium: {
                question: "GONE Theory yang dikemukakan oleh Jack Bologne, merupakan singkatan dari:…",
                answer: [
                    "Greeds, Opportunities, Needs, Exposure",
                    "Greeds, Option, Needs, Exposure",
                    "Greats, Opportunities, Needs, Exposure",
                    "Greats, Option, Needs, Exposure"
                ],
                kunciJawaban: "Greeds, Opportunities, Needs, Exposure",
                difficulty: "medium"
            },
            hard: {
                question: "Menurut teori GONE, faktor mana yang paling sulit dikendalikan dalam pencegahan korupsi?",
                answer: ["Greed (Keserakahan)", "Opportunities (Kesempatan)", "Needs (Kebutuhan)", "Exposure (Pengungkapan)"],
                kunciJawaban: "Greed (Keserakahan)",
                difficulty: "hard"
            }
        },
        color: "#8B4513",
        info: {
            description: "Pluto adalah planet kerdil yang dulu dianggap planet ke-9.",
            facts: [
                "Ditemukan tahun 1930",
                "Memiliki 5 bulan",
                "Lebih kecil dari Bulan Bumi"
            ]
        }
    },
    {
        name: "Asteroid",
        image: "asteroid",
        width: 60,
        height: 60,
        position: "mr-52",
        animation: "rotate",
        questions: {
            easy: {
                question: "Korupsi merugikan?",
                answer: ["Diri sendiri", "Keluarga", "Negara", "Tetangga"],
                kunciJawaban: "Negara",
                difficulty: "easy"
            },
            medium: {
                question: "Dampak langsung dari korupsi adalah …",
                answer: ["Kerusakan lingkungan", "Meningkatnya hutang negara", "Kerugian Negara", "Mahalnya harga jasa dan pelayanan publik"],
                kunciJawaban: "Kerugian Negara",
                difficulty: "medium"
            },
            hard: {
                question: "Berapa estimasi kerugian negara akibat korupsi per tahun di Indonesia?",
                answer: ["Rp 50-100 triliun", "Rp 100-200 triliun", "Rp 200-300 triliun", "Rp 300-400 triliun"],
                kunciJawaban: "Rp 200-300 triliun",
                difficulty: "hard"
            }
        },
        color: "#696969",
        info: {
            description: "Asteroid adalah benda langit kecil yang mengorbit Matahari.",
            facts: [
                "Sebagian besar berada di Sabuk Asteroid",
                "Terbuat dari batuan dan logam",
                "Sisa pembentukan tata surya"
            ]
        }
    },
    {
        name: "Nebula",
        image: "nebula",
        width: 100,
        height: 100,
        position: "ml-10",
        animation: "glow",
        questions: {
            easy: {
                question: "UU Anti Korupsi di Indonesia adalah UU Nomor?",
                answer: ["20 Tahun 2001", "31 Tahun 1999", "32 Tahun 2004", "8 Tahun 2010"],
                kunciJawaban: "31 Tahun 1999",
                difficulty: "easy"
            },
            medium: {
                question: "Dasar hukum pemberantasan tindak pidana korupsi adalah…",
                answer: [
                    "Undang-Undang Nomor 12 Tahun 2011",
                    "Undang-Undang Dasar Tahun 1945",
                    "Undang-Undang Nomor 31 Tahun 1999",
                    "Undang-Undang Nomor 8 Tahun 1981"
                ],
                kunciJawaban: "Undang-Undang Nomor 31 Tahun 1999",
                difficulty: "medium"
            },
            hard: {
                question: "UU Tipikor telah mengalami berapa kali perubahan sejak 1999?",
                answer: ["1 kali", "2 kali", "3 kali", "4 kali"],
                kunciJawaban: "2 kali",
                difficulty: "hard"
            }
        },
        color: "#9370DB",
        info: {
            description: "Nebula adalah awan gas dan debu di luar angkasa, tempat lahirnya bintang.",
            facts: [
                "Terdiri dari hidrogen dan helium",
                "Bisa mencapai ratusan tahun cahaya",
                "Tempat pembentukan bintang baru"
            ]
        }
    },
    {
        name: "Stasiun Luar Angkasa",
        image: "iss",
        width: 65,
        height: 65,
        position: "ml-52",
        animation: "shake",
        questions: {
            easy: {
                question: "Nilai anti korupsi meliputi kejujuran, tanggung jawab, dan?",
                answer: ["Kekayaan", "Kedisiplinan", "Kecantikan", "Kepopuleran"],
                kunciJawaban: "Kedisiplinan",
                difficulty: "easy"
            },
            medium: {
                question: "Nilai nilai yang harus ditanamkan sebagai sikap anti korupsi, kecuali:…",
                answer: [
                    "Kejujuran, Kemandirian dan Kerja Keras",
                    "Tanggung Jawab, Adil dan Berani",
                    "Sederhana, Peduli, dan Disiplin",
                    "Adil, Peduli, Pantang Menyerah"
                ],
                kunciJawaban: "Adil, Peduli, Pantang Menyerah",
                difficulty: "medium"
            },
            hard: {
                question: "Berapa jumlah nilai integritas yang ditetapkan KPK dalam pendidikan anti korupsi?",
                answer: ["7 nilai", "9 nilai", "11 nilai", "13 nilai"],
                kunciJawaban: "9 nilai",
                difficulty: "hard"
            }
        },
        color: "#C0C0C0",
        info: {
            description: "ISS adalah laboratorium luar angkasa yang mengorbit Bumi.",
            facts: [
                "Ketinggian orbit: 400 km",
                "Kecepatan: 27,600 km/jam",
                "Kerjasama 15 negara"
            ]
        }
    }
];