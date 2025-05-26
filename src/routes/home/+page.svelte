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
    import { onMount, onDestroy } from 'svelte';
    import { goto } from '$app/navigation';

    let selectedPlanet: any = $state(null);

    const planets = [
        {
            name: "Matahari",
            image: sunImage,
            width: 230,
            height: 230,
            animation: "rotate",
            question: "Pusat tata surya kita",
            answer: ["Matahari", "Bumi", "Pluto"],
            color: "#FFD700"
        },
        {
            name: "Merkurius",
            image: mercuryImage,
            width: 70,
            height: 70,
            position: "ml-42",
            animation: "bounce",
               question: "Pusat tata surya kita",
            answer: ["Matahari", "Bumi", "Pluto"],
            color: "#8C7853"
        },
        {
            name: "Venus",
            image: venusImage,
            width: 80,
            height: 80,
            position: "mr-52",
            animation: "pulse",
            question: "Pusat tata surya kita",
            answer: ["Matahari", "Bumi", "Pluto"],
            color: "#FFC649"
        },
        {
            name: "Bumi",
            image: earthImage,
            width: 100,
            height: 100,
            position: "ml-10",
            animation: "float",
           question: "Pusat tata surya kita",
            answer: ["Matahari", "Bumi", "Pluto"],
            color: "#6B93D6"
        },
        {
            name: "Mars",
            image: mars,
            width: 80,
            height: 80,
            position: "ml-52",
            animation: "shake",
       question: "Pusat tata surya kita",
            answer: ["Matahari", "Bumi", "Pluto"],
            color: "#CD5C5C"
        },
        {
            name: "Jupiter",
            image: jupiter,
            width: 200,
            height: 200,
            position: "ml-2",
            animation: "float",
              question: "Pusat tata surya kita",
            answer: ["Matahari", "Bumi", "Pluto"],
            color: "#D8CA9D"
        },
        {
            name: "Saturnus",
            image: saturnus,
            width: 200,
            height: 200,
            position: "mr-5",
            animation: "wobble",
              question: "Pusat tata surya kita",
            answer: ["Matahari", "Bumi", "Pluto"],
            color: "#FAD5A5"
        },
        {
            name: "Uranus",
            image: uranus,
            width: 150,
            height: 150,
            position: "mr-52",
            animation: "orbit",
                question: "Pusat tata surya kita",
            answer: ["Matahari", "Bumi", "Pluto"],
            color: "#4FD0E7"
        },
        {
            name: "Neptunus",
            image: neptune,
            width: 100,
            height: 100,
            position: "ml-52",
            animation: "glow",
              question: "Pusat tata surya kita",
            answer: ["Matahari", "Bumi", "Pluto"],
            color: "#4B70DD"
        }
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



    // handle point
    let point = $state(0);

    const handlePoint = () => {
        point += 1;
    };

    let intervalId: any;

    onMount(() => {
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
</script>

<svelte:head>
    <link rel="preload" as="image" href={spaceImage} />
</svelte:head>


<!-- Mobile Only Content -->
<div 
    class="md:hidden space-container text-white relative"
    style="min-height: 100vh;">
    
    <!-- Background image with loading state -->
    <img
        src={spaceImage}
        alt="space background"
        class="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 -z-10"
        class:opacity-0={!imageLoaded}
        onload={handleImageLoad}
        loading="eager"
        decoding="async"
    />

    <!-- Loading placeholder -->
        <div class="absolute inset-0 bg-gradient-to-b from-[#0B0B3B] to-[#000033]"></div>

    <!-- Stars background -->
    <div class="stars">
        <div class="star"></div>
        <div class="star"></div>
        <div class="star"></div>
        <div class="star"></div>
        <div class="star"></div>
        <div class="star"></div>
        <div class="star"></div>
        <div class="star"></div>
        <div class="star"></div>
        <div class="star"></div>
        <div class="star"></div>
        <div class="star"></div>
        <div class="star"></div>
        <div class="star"></div>
        <div class="star"></div>
        <div class="star"></div>
        <div class="star"></div>
        <div class="star"></div>
    </div>

    <!-- Header -->
    <div class="space-header">
        <h1 class="space-title">SOLAR SYSTEM</h1>
        <p class="space-subtitle">Jelajahi Keajaiban Tata Surya</p>
        <p class="space-subtitle">Point Kamu adalah {point}</p>
    </div>

    <!-- Planets Grid -->
    <div class="gap-8 grid-cols-1 grid justify-items-center items-center px-4 pb-20 relative z-3">
        {#each planets as planet, index}
            <div 
                class="planet-container {planet.position} mb-8"
                style="--planet-color: {planet.color}"
                class:selected={selectedPlanet === planet}
                onclick={() => selectPlanet(planet)}
                onkeydown={(e) => e.key === 'Enter' && selectPlanet(planet)}
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
            </div>
        {/each}
    </div>

    <!-- Planet Info Modal -->
    {#if selectedPlanet}
        <div 
            class="planet-info"
            style="--planet-color: {selectedPlanet.color}"
        >
            <h3>{selectedPlanet.name}</h3>
            <p>{selectedPlanet.question}</p>
            <button onclick={handlePoint} >{selectedPlanet.answer}</button>
            <button 
                class="close-btn"
                onclick={() => selectedPlanet = null}
            >
                Tutup
            </button>
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
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');

    /* Animasi yang sudah ada */
    @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }

    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
    }

    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }

    @keyframes float {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-15px) rotate(5deg); }
    }

    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }

    @keyframes spin {
        from { transform: rotateY(0deg); }
        to { transform: rotateY(360deg); }
    }

    @keyframes wobble {
        0%, 100% { transform: rotate(-3deg); }
        50% { transform: rotate(3deg); }
    }

    @keyframes orbit {
        from { transform: rotate(0deg) translateX(10px) rotate(0deg); }
        to { transform: rotate(360deg) translateX(10px) rotate(-360deg); }
    }

    @keyframes glow {
        0%, 100% { 
            filter: brightness(100%) drop-shadow(0 0 5px rgba(255,255,255,0.7)); 
        }
        50% { 
            filter: brightness(120%) drop-shadow(0 0 20px rgba(255,255,255,0.9)); 
        }
    }

    /* Animasi baru */
    @keyframes twinkle {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 1; }
    }

    @keyframes slideInFromTop {
        0% { transform: translateY(-100px); opacity: 0; }
        100% { transform: translateY(0); opacity: 1; }
    }

    @keyframes fadeInUp {
        0% { transform: translateY(30px); opacity: 0; }
        100% { transform: translateY(0); opacity: 1; }
    }

    /* Classes untuk animasi */
    .rotate { animation: rotate 20s linear infinite; }
    .bounce { animation: bounce 3s ease-in-out infinite; }
    .pulse { animation: pulse 4s ease-in-out infinite; }
    .float { animation: float 5s ease-in-out infinite; }
    .shake { animation: shake 2s ease-in-out infinite; }
    .spin { animation: spin 15s linear infinite; }
    .wobble { animation: wobble 3s ease-in-out infinite; }
    .orbit { animation: orbit 8s linear infinite; }
    .glow { animation: glow 4s ease-in-out infinite; }

    /* Styling untuk container utama */
    .space-container {
        font-family: 'Orbitron', monospace;
        position: relative;
        overflow-x: hidden;
    }

    .space-container::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
            45deg,
            rgba(0, 0, 0, 0.3) 0%,
            rgba(25, 25, 112, 0.2) 50%,
            rgba(0, 0, 0, 0.3) 100%
        );
        z-index: 1;
    }

    /* Stars background */
    .stars {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 2;
    }

    .star {
        position: absolute;
        background: white;
        border-radius: 50%;
        animation: twinkle 2s infinite;
    }

    .star:nth-child(1) { top: 10%; left: 20%; width: 2px; height: 2px; animation-delay: 0s; }
    .star:nth-child(2) { top: 20%; left: 80%; width: 1px; height: 1px; animation-delay: 0.5s; }
    .star:nth-child(3) { top: 30%; left: 40%; width: 3px; height: 3px; animation-delay: 1s; }
    .star:nth-child(4) { top: 50%; left: 10%; width: 2px; height: 2px; animation-delay: 1.5s; }
    .star:nth-child(5) { top: 70%; left: 90%; width: 1px; height: 1px; animation-delay: 2s; }
    .star:nth-child(6) { top: 80%; left: 60%; width: 2px; height: 2px; animation-delay: 0.3s; }

    /* Planet styling */
    .planet-container {
        position: relative;
        z-index: 3;
        cursor: pointer;
        transition: all 0.3s ease;
        border-radius: 50%;
        padding: 10px;
    }

    .planet-container:hover {
        transform: scale(1.1);
        filter: brightness(1.2);
    }

    .planet-container.selected {
        box-shadow: 0 0 30px var(--planet-color);
        transform: scale(1.15);
    }

    .planet-image {
        border-radius: 50%;
        transition: all 0.3s ease;
        filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
    }

    /* Header styling */
    .space-header {
        position: relative;
        z-index: 4;
        text-align: center;
        padding: 2rem 1rem;
        animation: slideInFromTop 1s ease-out;
    }

    .space-title {
        font-size: 2.5rem;
        font-weight: 900;
        background: linear-gradient(45deg, #FFD700, #FFA500, #FF6347);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
        margin-bottom: 0.5rem;
    }

    .space-subtitle {
        font-size: 1rem;
        color: #E6E6FA;
        font-weight: 400;
        opacity: 0.9;
    }

    /* Planet info modal */
    .planet-info {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(135deg, rgba(25, 25, 112, 0.95), rgba(0, 0, 0, 0.95));
        backdrop-filter: blur(10px);
        border-top: 2px solid var(--planet-color);
        padding: 1.5rem;
        z-index: 10;
        animation: fadeInUp 0.5s ease-out;
        border-radius: 20px 20px 0 0;
    }

    .planet-info h3 {
        color: var(--planet-color);
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
        text-shadow: 0 0 10px var(--planet-color);
    }

    .planet-info p {
        color: #E6E6FA;
        font-size: 1rem;
        line-height: 1.5;
        margin-bottom: 1rem;
    }

    .close-btn {
        background: var(--planet-color);
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-family: 'Orbitron', monospace;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .close-btn:hover {
        transform: scale(1.05);
        box-shadow: 0 0 15px var(--planet-color);
    }

    /* Desktop warning enhancement */
    .desktop-warning {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        font-family: 'Orbitron', monospace;
    }

    .warning-card {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
    }
</style>

