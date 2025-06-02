<script lang="ts">
    import { fade, fly } from 'svelte/transition';
    import type { Planet } from '$lib/data/questions';
    
    // Import images
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

    interface Props {
        planet: Planet;
        onClose: () => void;
    }

    let { planet, onClose }: Props = $props();
    
    // Map planet images
    const planetImages = {
        sun: sunImage,
        mercury: mercuryImage,
        venus: venusImage,
        earth: earthImage,
        mars: mars,
        jupiter: jupiter,
        saturnus: saturnus,
        uranus: uranus,
        neptune: neptune,
        pluto: pluto,
        asteroid: asteroid,
        nebula: nebula,
        iss: iss
    };
    
    // Get the correct image for this planet
    const planetImageSrc = planetImages[planet.image as keyof typeof planetImages] || sunImage;
</script>

<div 
    class="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
    transition:fade={{ duration: 200 }}
    onclick={onClose}
    onkeydown={(e) => e.key === 'Escape' && onClose()}
    role="button"
    tabindex="0"
    aria-label="Close modal"
>
    <div 
        class="bg-gradient-to-br from-blue-900/90 to-purple-900/90 rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-white/20"
        transition:fly={{ y: 50, duration: 300 }}
        onclick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
    >
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
            <h2 class="text-2xl font-bold text-white flex items-center gap-2">
                <span class="text-3xl">{planet.animation === 'glow' ? '✨' : '🪐'}</span>
                {planet.name}
            </h2>
            <button 
                class="text-white/70 hover:text-white text-2xl transition-colors"
                onclick={onClose}
            >
                ×
            </button>
        </div>

        <!-- Planet Image -->
        <div class="flex justify-center mb-4">
            <div class="relative">
                <img 
                    src={planetImageSrc} 
                    alt={planet.name}
                    class="w-32 h-32 object-contain animate-float drop-shadow-2xl"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-transparent to-white/10 rounded-full blur-xl -z-10"></div>
                <!-- Glowing effect behind planet -->
                <div class="absolute inset-0 bg-gradient-radial from-blue-400/20 to-transparent rounded-full blur-2xl -z-20"></div>
            </div>
        </div>

        <!-- Description -->
        {#if planet.info}
            <div class="space-y-4">
                <p class="text-white/90 text-sm leading-relaxed">
                    {planet.info.description}
                </p>

                <!-- Facts -->
                <div class="bg-white/10 rounded-lg p-4">
                    <h3 class="text-white font-semibold mb-2 flex items-center gap-2">
                        <span>📊</span> Fakta Menarik
                    </h3>
                    <ul class="space-y-1">
                        {#each planet.info.facts as fact}
                            <li class="text-white/80 text-sm flex items-start gap-2">
                                <span class="text-yellow-400 mt-1">•</span>
                                <span>{fact}</span>
                            </li>
                        {/each}
                    </ul>
                </div>

                <!-- Educational Tie-in -->
                <div class="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg p-3 border border-yellow-500/30">
                    <p class="text-white/90 text-xs italic">
                        💡 Seperti {planet.name} yang memiliki peran penting dalam tata surya, 
                        setiap individu memiliki peran penting dalam memerangi korupsi!
                    </p>
                </div>
            </div>
        {/if}

        <!-- Action Button -->
        <button
            class="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
            onclick={onClose}
        >
            Tutup
        </button>
    </div>
</div>

<style>
    @keyframes float {
        0%, 100% {
            transform: translateY(0) rotate(0deg);
        }
        50% {
            transform: translateY(-10px) rotate(5deg);
        }
    }

    .animate-float {
        animation: float 3s ease-in-out infinite;
    }
</style>