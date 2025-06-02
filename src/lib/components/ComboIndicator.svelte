<script lang="ts">
    import { spring } from 'svelte/motion';
    import { onMount } from 'svelte';

    interface Props {
        combo: number;
        maxCombo: number;
    }

    let { combo, maxCombo }: Props = $props();
    
    let showCombo = $state(false);
    let scale = spring(1, { stiffness: 0.3, damping: 0.8 });

    $effect(() => {
        if (combo > 0) {
            showCombo = true;
            // Animate scale on combo increase
            scale.set(1.2);
            setTimeout(() => scale.set(1), 200);
        } else {
            showCombo = false;
        }
    });

    // Combo level thresholds
    let comboLevel = $derived(
        combo >= 10 ? 'legendary' :
        combo >= 7 ? 'epic' :
        combo >= 5 ? 'rare' :
        combo >= 3 ? 'uncommon' :
        'common'
    );

    let comboMultiplier = $derived(
        combo >= 10 ? 3 :
        combo >= 7 ? 2.5 :
        combo >= 5 ? 2 :
        combo >= 3 ? 1.5 :
        1
    );

    const comboColors: Record<string, string> = {
        common: 'from-gray-400 to-gray-600',
        uncommon: 'from-green-400 to-green-600',
        rare: 'from-blue-400 to-blue-600',
        epic: 'from-purple-400 to-purple-600',
        legendary: 'from-yellow-400 to-orange-600'
    };

    const comboEmojis: Record<string, string> = {
        common: '🔥',
        uncommon: '⚡',
        rare: '💫',
        epic: '🌟',
        legendary: '💎'
    };
</script>

{#if showCombo && combo > 0}
    <div 
        class="fixed top-20 right-4 z-30 transform transition-all duration-300"
        style="transform: scale({$scale})"
    >
        <div class="bg-gradient-to-r {comboColors[comboLevel]} text-white rounded-lg p-4 shadow-2xl">
            <div class="flex items-center gap-3">
                <div class="text-3xl animate-bounce">
                    {comboEmojis[comboLevel]}
                </div>
                <div>
                    <div class="font-bold text-xl">
                        Combo x{combo}
                    </div>
                    <div class="text-sm opacity-90">
                        Multiplier: x{comboMultiplier}
                    </div>
                    {#if maxCombo > combo}
                        <div class="text-xs opacity-75">
                            Best: x{maxCombo}
                        </div>
                    {/if}
                </div>
            </div>
            
            <!-- Progress to next level -->
            {#if combo < 10}
                <div class="mt-2">
                    <div class="text-xs opacity-75 mb-1">
                        Next level in {combo < 3 ? 3 - combo : combo < 5 ? 5 - combo : combo < 7 ? 7 - combo : 10 - combo} correct answers
                    </div>
                    <div class="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                        <div 
                            class="h-full bg-white/80 rounded-full transition-all duration-300"
                            style="width: {combo < 3 ? (combo/3)*100 : combo < 5 ? ((combo-3)/2)*100 : combo < 7 ? ((combo-5)/2)*100 : ((combo-7)/3)*100}%"
                        ></div>
                    </div>
                </div>
            {/if}
        </div>
        
        <!-- Particle effects for high combos -->
        {#if combo >= 5}
            <div class="absolute inset-0 pointer-events-none">
                {#each Array(Math.min(combo, 10)) as _, i}
                    <div 
                        class="absolute w-2 h-2 bg-yellow-400 rounded-full animate-float-up opacity-70"
                        style="left: {Math.random() * 100}%; animation-delay: {i * 0.1}s"
                    ></div>
                {/each}
            </div>
        {/if}
    </div>
{/if}

<style>
    @keyframes float-up {
        0% {
            transform: translateY(0) scale(1);
            opacity: 0.7;
        }
        100% {
            transform: translateY(-50px) scale(0);
            opacity: 0;
        }
    }
    
    .animate-float-up {
        animation: float-up 2s ease-out infinite;
    }
</style>