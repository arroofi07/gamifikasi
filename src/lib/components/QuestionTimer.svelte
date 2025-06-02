<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { audioManager } from '$lib/stores/audio';

    interface Props {
        duration: number;
        onTimeout: () => void;
        isActive: boolean;
    }

    let { duration, onTimeout, isActive }: Props = $props();
    
    let timeLeft = $state(duration);
    let interval: ReturnType<typeof setInterval>;
    let hasPlayedWarning = false;

    $effect(() => {
        if (isActive) {
            timeLeft = duration;
            hasPlayedWarning = false;
            startTimer();
        } else {
            stopTimer();
        }

        return () => stopTimer();
    });

    function startTimer() {
        interval = setInterval(() => {
            timeLeft--;
            
            // Play warning sound at 5 seconds
            if (timeLeft === 5 && !hasPlayedWarning && audioManager) {
                audioManager.playSound('countdown');
                hasPlayedWarning = true;
            }
            
            if (timeLeft <= 0) {
                stopTimer();
                onTimeout();
            }
        }, 1000);
    }

    function stopTimer() {
        if (interval) {
            clearInterval(interval);
        }
    }

    // Calculate progress percentage
    let progress = $derived(((duration - timeLeft) / duration) * 100);
    let isWarning = $derived(timeLeft <= 5);
    let isUrgent = $derived(timeLeft <= 3);
</script>

{#if isActive}
    <div class="fixed top-4 left-1/2 -translate-x-1/2 z-30 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 shadow-lg">
        <div class="flex items-center gap-3">
            <div class="text-2xl">
                {#if isUrgent}
                    ⏰
                {:else if isWarning}
                    ⏱️
                {:else}
                    ⏲️
                {/if}
            </div>
            
            <div class="relative w-32 h-2 bg-white/20 rounded-full overflow-hidden">
                <div 
                    class="absolute inset-y-0 left-0 transition-all duration-1000 rounded-full"
                    class:bg-green-500={!isWarning}
                    class:bg-yellow-500={isWarning && !isUrgent}
                    class:bg-red-500={isUrgent}
                    class:animate-pulse={isUrgent}
                    style="width: {100 - progress}%"
                ></div>
            </div>
            
            <div 
                class="font-bold text-lg min-w-[3ch] text-center"
                class:text-white={!isWarning}
                class:text-yellow-400={isWarning && !isUrgent}
                class:text-red-400={isUrgent}
                class:animate-bounce={isUrgent}
            >
                {timeLeft}
            </div>
        </div>
    </div>
{/if}

<style>
    @keyframes pulse {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: 0.5;
        }
    }
    
    .animate-pulse {
        animation: pulse 1s ease-in-out infinite;
    }
</style>