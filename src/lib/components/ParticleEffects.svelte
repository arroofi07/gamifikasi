<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';

    let particles: Array<{ id: number; type: string; x: number; y: number }> = [];
    let particleId = 0;
    let intervalId: ReturnType<typeof setInterval>;

    onMount(() => {
        if (!browser) return;

        // Generate random particles periodically
        intervalId = setInterval(() => {
            // Random chance to create different particle types
            const rand = Math.random();
            
            if (rand < 0.7) {
                // Floating stars (most common)
                createParticle('star', Math.random() * window.innerWidth, window.innerHeight);
            } else if (rand < 0.95) {
                // Sparkles (less common)
                createParticle('sparkle', Math.random() * window.innerWidth, Math.random() * window.innerHeight);
            } else {
                // Comets (rare)
                createParticle('comet', -50, Math.random() * window.innerHeight * 0.5);
            }
        }, 2000);

        // Also create particles on click for interactivity
        window.addEventListener('click', handleClick);
    });

    onDestroy(() => {
        if (intervalId) clearInterval(intervalId);
        if (browser) {
            window.removeEventListener('click', handleClick);
        }
    });

    function createParticle(type: string, x: number, y: number) {
        const id = particleId++;
        particles = [...particles, { id, type, x, y }];
        
        // Remove particle after animation completes
        setTimeout(() => {
            particles = particles.filter(p => p.id !== id);
        }, type === 'sparkle' ? 1000 : type === 'comet' ? 3000 : 10000);
    }

    function handleClick(e: MouseEvent) {
        // Create sparkle effect at click position
        createParticle('sparkle', e.clientX, e.clientY);
    }
</script>

<div class="particles-container pointer-events-none fixed inset-0 z-50">
    {#each particles as particle (particle.id)}
        <div 
            class="particle particle-{particle.type}" 
            style="left: {particle.x}px; top: {particle.y}px;"
        ></div>
    {/each}
</div>

<style>
    .particles-container {
        overflow: hidden;
    }
</style>