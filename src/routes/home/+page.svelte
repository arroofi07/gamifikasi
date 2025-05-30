<script lang="ts">
    import spaceImage from '$lib/assets/space.jpg';
    import sunImage from '$lib/assets/sun.png';
    import mercuryImage from '$lib/assets/mercury.png';
    import venusImage from '$lib/assets/venus.png';
    import earthImage from '$lib/assets/earth.png';
    import mars from '$lib/assets/mars.png';
    import saturnus from '$lib/assets/saturnus.png';
    import uranus from '$lib/assets/uranus.png';
    import neptune from '$lib/assets/neptune.png';
    import jupiter from '$lib/assets/jupiter.png';
    import asteroid from '$lib/assets/asteroid.png';
    import pluto from '$lib/assets/pluto.png';
    import gj504 from '$lib/assets/gj504.png';
    import nebula from '$lib/assets/nebula.png';
    import iss from '$lib/assets/iss.png';
    import { onMount, onDestroy } from 'svelte';
    import { goto } from '$app/navigation';
    import { db } from "../../firebase";
    import { doc, updateDoc, setDoc } from "firebase/firestore";

    let selectedPlanet: any = $state(null);
    let point = $state(0);
    let answered = $state(false);
    let isCorrect = $state(false);
    let userData: any = null;
    let completedQuestions = $state(new Set());

    // Add these with other state variables
    let countdown = $state(5);
    let showCompletionModal = $state(false);

    onMount(() => {
        // Get user data from localStorage
        const userDataStr = localStorage.getItem('userData');
        if (userDataStr) {
            userData = JSON.parse(userDataStr);
        }
        
        // Check every second
        intervalId = setInterval(() => {
            const userDataStr = localStorage.getItem('userData');
            if (!userDataStr) {
                goto('/');
                return;
            }

            try {
                const userData = JSON.parse(userDataStr);
                const now = new Date().getTime();

                if (now > userData.expiry) {
                    localStorage.removeItem('userData');
                    goto('/');
                }
            } catch (error) {
                localStorage.removeItem('userData');
                goto('/');
            }
        }, 1000); // Check setiap 1 detik
    });

    onDestroy(() => {
        if (intervalId) {
            clearInterval(intervalId);
        }
    });

    const checkAnswer = async (answer: string) => {
        answered = true;
        if (answer === selectedPlanet.kunciJawaban) {
            isCorrect = true;

            point += 10;
        } else {
            isCorrect = false;
        }
        
        completedQuestions.add(selectedPlanet.name);
        
        try {
            await setDoc(doc(db, "scores", userData.id), {
                userId: userData.id,
                username: userData.username,
                points: point,
                completedQuestions: Array.from(completedQuestions),
                updatedAt: new Date()
            });

            if (completedQuestions.size === planets.length) {
                showCompletionModal = true;
                const timer = setInterval(() => {
                    countdown--;
                    if (countdown === 0) {
                        clearInterval(timer);
                        localStorage.removeItem('userData');
                        goto('/');
                    }
                }, 1000);
            }
        } catch (error) {
            console.error("Error saving score:", error);
        }
    };

    const nextQuestion = () => {
        selectedPlanet = null;
        answered = false;
        isCorrect = false;
    };

    const planets = [
        {
            name: "Matahari",
            image: sunImage,
            width: 230,
            height: 230,
            animation: "glow",
            question: "Istilah korupsi dalam bahasa Latin yang benar adalah… ",
            answer: ["Corrupt", "Corruption", "Corrumpere", "Korruptie"],
            kunciJawaban: "Corrumpere",
            color: "#6B93D6",
        },
        {
            name: "Merkurius",
            image: mercuryImage,
            width: 70,
            height: 70,
            position: "ml-42",
            animation: "bounce",
            question: "Istilah korupsi dari bahasa Malaysia yang benar adalah… ",
            answer: ["Korupsi", "Rasuah", "Busuk", "Disuap"],
            kunciJawaban: "Rasuah",
            color: "#6B93D6"
        },
        {
            name: "Venus",
            image: venusImage,
            width: 80,
            height: 80,
            position: "mr-52",
            animation: "pulse",
            question: "Suatu tindakan maupun ucapan yang lurus, tidak berbohong dan tidak curang disebut… ",
            answer: ["Keadilan", "Tanggung Jawab", "Kejujuran", "Kesederhanaan"],
            kunciJawaban: "Kejujuran",
            color: "#6B93D6"
        },
        {
            name: "Bumi",
            image: earthImage,
            width: 100,
            height: 100,
            position: "ml-10",
            animation: "rotate",
            question: "Komponen dari pengertian korupsi di bawah ini yang tidak benar adalah … ",
            answer: ["Suatu perilaku yang terkait penyalahgunaan wewenang atau kekuasaan","Perbuatan tersebut memperkaya diri sendiri dan/atau kelompok","Merugikan keuangan negara","Perbuatannya ditujukan untuk mensejahterakan rakyat"],
            kunciJawaban: "Perbuatannya ditujukan untuk mensejahterakan rakyat",
            color: "#6B93D6"
        },
        {
            name: "Mars",
            image: mars,
            width: 80,
            height: 80,
            position: "ml-52",
            animation: "shake",
            question: "Lembaga yang khusus dibentuk oleh Undang-Undang untuk mencegah dan memberantas korupsi di Indonesia adalah… ",
            answer: ["Dewan Perwakilan Rakyat Republik Indonesia", "Komisi Pemberantasan Korupsi Republik Indonesia", "Mahkamah Agung Republik Indonesia", "Komisi Yudisial Republik Indonesia"],
            kunciJawaban: "Komisi Pemberantasan Korupsi Republik Indonesia",
            color: "#6B93D6"
        },
        {
            name: "Jupiter",
            image: jupiter,
            width: 200,
            height: 200,
            position: "ml-2",
            animation: "float",
            question: "Petty Corruption adalah…",
            answer: ["Penyalahgunaan kekuatan tingkat tinggi yang menguntungkan segelintir orang dengan mengorbankan banyak orang.", "Penyalahgunaan kekuasaan oleh pejabat publik dalam interaksi mereka dengan warga biasa di kehidupan sehari-hari.", "Manipulasi kebijakan, institusi dan dan aturan prosedur oleh para pengambil keputusan politik, yang menyalahgunakan posisinya untuk mempertahankan kekuasaan, status, dan kekayaannya.", "Perbuatan mengambil barang milik orang lain untuk dikuasai sendiri dengan ancaman kekerasan."],
            kunciJawaban: "Penyalahgunaan kekuasaan oleh pejabat publik dalam interaksi mereka dengan warga biasa di kehidupan sehari-hari.",
            color: "#6B93D6"
        },
        {
            name: "Saturnus",
            image: saturnus,
            width: 200,
            height: 200,
            position: "mr-5",
            animation: "wobble",
            question: "Berikut jenis-jenis tindak pidana korupsi, kecuali: … ",
            answer: ["Gratifikasi, Suap-Menyuap dan Penggelapan dalam jabatan", "Kerugian keuangan negara, benturan kepentingan dalam pengadaan, dan merintangi pemeriksanaan ", "Pencurian, Pemerasan, dan Gratifikasi", "Perbuatan curang, suap-menyuap dan pemerasan."],
            kunciJawaban: "Pencurian, Pemerasan, dan Gratifikasi",
            color: "#6B93D6"
        },
        {
            name: "Uranus",
            image: uranus,
            width: 150,
            height: 150,
            position: "mr-52",
            animation: "orbit",
            question: "Fraud Triangle merupakan teori yang menjelaskan faktor-faktor penyebab korupsi. Penjelasan mengenai Fraud Triangle yang benar adalah.. ",
            answer:["Capability, Rationalization,Pressure", "Pressure, Opportunity, Rationalization", "Pressure, Rationalization, Capability", "Opportunity, Capability, Rationalization"],
            kunciJawaban: "Pressure, Opportunity, Rationalization",
            color: "#6B93D6"
        },
        {
            name: "Neptunus",
            image: neptune,
            width: 100,
            height: 100,
            position: "ml-52",
            animation: "glow",
            question: "Jenis-jenis perilaku koruptif yang sering dilakukan siswa yang paling tepat adalah… ",
            answer: ["Terlambat, mencontek, plagiat, mark up uang buku, dan bolos", "Plagiat, berbohong, mencuri, dan suap", "Mencontek, tawuran, suap, gratifikasi", "Gratifikasi, Penyalahgunaan Dana Beasiswa, Mark-up uang sekolah dan penipuan"],
            kunciJawaban:"Terlambat, mencontek, plagiat, mark up uang buku, dan bolos",
            color: "#6B93D6"
        },
           {
            name: "Pluto",
            image: pluto,
            width: 75,
            height: 75,
            position: "mr-3",
            animation: "float",
            question: "GONE Theory yang dikemukakan oleh Jack Bologne, merupakan singkatan dari:…",
            answer: ["Greeds, Opportunities, Needs, Exposure", "Greeds, Option, Needs, Exposure", "Greats, Opportunities, Needs, Exposure", "Greats, Option, Needs, Exposure"],
            kunciJawaban: "Greeds, Opportunities, Needs, Exposure",
            color: "#6B93D6"
        },
          {
            name: "Asteroid",
            image: asteroid,
            width: 60,
            height: 60,
            position: "mr-52",
            animation: "rotate",
            question: "Dampak langsung dari korupsi adalah … ",
            answer: ["Kerusakan lingkungan", "Meningkatknya hutang negara", "Kerugian Negara", "Mahalnya harga jasa dan pelayanan public"],
            kunciJawaban: "Kerugian Negara",
            color: "#6B93D6"
        },
             {
            name: "Nebula",
            image: nebula,
            width: 100,
            height: 100,
            position: "ml-10",
            animation: "glow",
            question: "Dasar hukum pemberantasan tindak pidana korupsi adalah… ",
            answer: ["Undang-Undang Nomor 12 Tahun 2011","Undang – Undang Dasar Tahun 1945"," Undang-Undang Nomor 31 Tahun 1999","Undang-Undang Nomor 8 Tahun 1981"],
            kunciJawaban: "Undang-Undang Nomor 31 Tahun 1999",
            color: "#6B93D6"
        },
              {
            name: "Stasiun Luar Angkasa ",
            image: iss,
            width: 65,
            height: 65,
            position: "ml-52",
            animation: "shake",
            question: "Nilai nilai yang harus ditanamkan sebagai sikap anti korupsi, kecuali:… ",
            answer: ["Kejujuran, Kemandirian dan Kerja Keras", "Tanggung Jawab, Adil dan Berani", "Sederhana, Peduli, dan Disiplin", "Adil, Peduli, Pantang Menyerah"],
            kunciJawaban: "Adil, Peduli, Pantang Menyerah",
            color: "#6B93D6"
        },
        //    {
        //     name: "GJ-504",
        //     image: gj504,
        //     width: 200,
        //     height: 200,
        //     position: "ml-2",
        //     animation: "glow",
        //     question: "test",
        //     answer: ["test"],
        //     kunciJawaban: "test",
        //     color: "#6B93D6"
        // },
        
    ];

    function selectPlanet(planet: any) {
        selectedPlanet = selectedPlanet === planet ? null : planet;
    }

    // Add preloading state
    let imageLoaded = $state(false);
    
    // Preload image
    function handleImageLoad() {
        imageLoaded = true;
    }

    // Handle point
    let intervalId: any;
</script>


<!-- Mobile Only Content -->
<div class="md:hidden space-container text-white relative min-h-screen">
    <img
        src={spaceImage}
        alt="space background"
        class="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 -z-10"
        class:opacity-0={!imageLoaded}
        onload={handleImageLoad}
        loading="eager"
        decoding="async"
    />
    <div class="absolute inset-0 bg-gradient-to-b from-[#0B0B3B] to-[#000033]"></div>

    <div class="stars">
        {#each Array(20) as _, index (index)}
            <div class="star" style="top: {Math.random() * 100}%; left: {Math.random() * 100}%; width: {Math.random() * 3 + 1}px; height: {Math.random() * 3 + 1}px;"></div>
        {/each}
    </div>

    <div class="space-header">
        <h1 class="space-title">SOLAR SYSTEM</h1>
        <p class="space-subtitle">Ayo Jawab Soal yang Ada di Setiap Planet</p>
        <p class="space-subtitle">Point Kamu adalah {point}</p>
    </div>

    <div class="gap-8 grid-cols-1 grid justify-items-center items-center mb-52 px-4 pb-20 relative z-3">
        {#each planets as planet}
            <div 
                class="planet-container {planet.position} mb-8 relative"
                style="--planet-color: {planet.color}"
                class:selected={selectedPlanet === planet}
                class:completed={completedQuestions.has(planet.name)}
                onclick={() => !completedQuestions.has(planet.name) && selectPlanet(planet)}
                onkeydown={(e) => e.key === 'Enter' && !completedQuestions.has(planet.name) && selectPlanet(planet)}
                role="button"
                tabindex="0"
            >
                <img 
                    src={planet.image} 
                    width={planet.width} 
                    height={planet.height} 
                    alt={planet.name}
                    class="planet-image {planet.animation}"
                />
                
                {#if completedQuestions.has(planet.name)}
                    <div class="completed-label">Done ✓</div>
                {/if}
            </div>
        {/each}
    </div>

    {#if selectedPlanet}
        <div class="planet-info" style="--planet-color: {selectedPlanet.color}">
            <h3>{selectedPlanet.name}</h3>
            <p class="mb-4">{selectedPlanet.question}</p>
            
            <div class="answers">
                {#if !answered}
                    {#each selectedPlanet.answer as answer}
                        <button 
                            class="answer-button w-full"
                            onclick={() => checkAnswer(answer)}
                        >
                            {answer}
                        </button>
                    {/each}
                {:else}
                    <div class="feedback-message text-center mb-4">
                        {#if isCorrect}
                            <div class="success-feedback">
                                <p class="text-green-400 font-bold text-xl mb-2">✅ Jawaban Benar!</p>
                                <p class="text-white text-sm">+10 points</p>
                            </div>
                        {:else}
                            <div class="error-feedback">
                                <p class="text-red-400 font-bold text-xl mb-2">❌ Jawaban Salah!</p>
                                <p class="text-white text-sm">Jawaban yang benar:</p>
                                <p class="text-white font-bold mt-1">{selectedPlanet.kunciJawaban}</p>
                            </div>
                        {/if}
                    </div>
                {/if}
            </div>

            <button 
                class="close-btn mt-4" 
                onclick={nextQuestion}
            >
                {answered ? 'Lanjut' : 'Tutup'}
            </button>
        </div>
    {/if}

    {#if showCompletionModal}
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
            <div class="bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-lg text-center">
                <h2 class="text-2xl font-bold mb-4">🎉 Selamat!</h2>
                <p class="mb-4">Anda telah menyelesaikan semua soal!</p>
                <p class="text-xl font-bold">Point Akhir: {point}</p>
                <p class="mt-4">Kembali ke halaman utama dalam...</p>
                <p class="text-4xl font-bold mt-2">{countdown}</p>
            </div>
        </div>
    {/if}
</div>

<!-- Desktop Warning Message -->
<div class="hidden md:flex min-h-screen items-center justify-center desktop-warning">
    <div class="text-center p-8 warning-card">
        <div class="text-6xl mb-4">🌌</div>
        <h1 class="text-3xl font-bold mb-4">Eksplorasi Mobile</h1>
        <p class="text-lg opacity-90 mb-4">
            Pengalaman tata surya ini dirancang khusus untuk perangkat mobile
        </p>
        <p class="text-sm opacity-75">
            Silakan buka di smartphone atau tablet untuk menjelajahi planet-planet
        </p>
    </div>
</div>

<style>
    /* Add to your existing styles */
    .backdrop-blur-md {
        backdrop-filter: blur(8px);
    }
    
    .bg-black\/80 {
        background-color: rgba(0, 0, 0, 0.8);
    }
</style>