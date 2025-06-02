<script lang="ts">
    import { onMount } from 'svelte';
    import { fade, fly } from 'svelte/transition';
    import type { Achievement } from '$lib/stores/achievements';
    import { audioManager } from '$lib/stores/audio';

    interface Props {
        achievement: Achievement;
        onClose: () => void;
    }

    let { achievement, onClose }: Props = $props();

    onMount(() => {
        // Play achievement sound
        if (audioManager) {
            audioManager.playSound('achievement');
        }

        // Auto close after 5 seconds
        const timer = setTimeout(() => {
            onClose();
        }, 5000);

        return () => clearTimeout(timer);
    });
</script>

<div 
    class="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-sm w-full px-4"
    transition:fly={{ y: -50, duration: 500 }}
>
    <div class="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg shadow-2xl p-4 text-white">
        <div class="flex items-center gap-3">
            <div class="text-4xl animate-bounce">{achievement.icon}</div>
            <div class="flex-1">
                <h3 class="font-bold text-lg">Achievement Unlocked!</h3>
                <p class="font-semibold">{achievement.title}</p>
                <p class="text-sm opacity-90">{achievement.description}</p>
                <p class="text-xs mt-1">+{achievement.points} Achievement Points</p>
            </div>
            <button 
                class="text-white/80 hover:text-white text-xl"
                onclick={onClose}
            >
                ×
            </button>
        </div>
    </div>
</div>

<style>
    @keyframes glow {
        0%, 100% {
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
        }
        50% {
            box-shadow: 0 0 30px rgba(255, 215, 0, 0.8);
        }
    }
    
    .shadow-2xl {
        animation: glow 2s ease-in-out infinite;
    }
</style>