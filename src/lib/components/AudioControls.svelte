<script lang="ts">
    import { audioSettings, audioManager } from '$lib/stores/audio';
    import { onMount } from 'svelte';

    let settings = $state({ 
        musicEnabled: true, 
        soundEnabled: true,
        musicVolume: 0.5,
        soundVolume: 0.7
    });

    let showControls = $state(false);

    onMount(() => {
        const unsubscribe = audioSettings.subscribe(s => {
            settings = s;
        });

        // Load sound effects
        if (audioManager) {
            // These are placeholder URLs - you'll need to add actual sound files
            audioManager.loadSound('click', '/sounds/click.mp3');
            audioManager.loadSound('correct', '/sounds/correct.mp3');
            audioManager.loadSound('incorrect', '/sounds/incorrect.mp3');
            audioManager.loadSound('achievement', '/sounds/achievement.mp3');
            audioManager.loadSound('countdown', '/sounds/countdown.mp3');
            
            // Play background music
            audioManager.playBackgroundMusic('/sounds/space-ambient.mp3');
        }

        return () => {
            unsubscribe();
            if (audioManager) {
                audioManager.destroy();
            }
        };
    });

    function toggleMusic() {
        audioSettings.toggleMusic();
        if (audioManager) {
            audioManager.playSound('click');
        }
    }

    function toggleSound() {
        audioSettings.toggleSound();
        if (audioManager && settings.soundEnabled) {
            audioManager.playSound('click');
        }
    }

    function updateMusicVolume(e: Event) {
        const target = e.target as HTMLInputElement;
        audioSettings.updateSettings({ musicVolume: parseFloat(target.value) });
    }

    function updateSoundVolume(e: Event) {
        const target = e.target as HTMLInputElement;
        audioSettings.updateSettings({ soundVolume: parseFloat(target.value) });
    }
</script>

<!-- Audio Control Button -->
<button
    class="fixed top-4 right-4 z-50 bg-white/10 backdrop-blur-md p-3 rounded-full shadow-lg transition-all hover:bg-white/20"
    onclick={() => showControls = !showControls}
>
    {#if settings.musicEnabled || settings.soundEnabled}
        🔊
    {:else}
        🔇
    {/if}
</button>

<!-- Audio Control Panel -->
{#if showControls}
    <div class="fixed top-16 right-4 z-50 bg-white/10 backdrop-blur-md p-4 rounded-lg shadow-lg min-w-[250px]">
        <h3 class="text-white font-bold mb-3">Audio Settings</h3>
        
        <!-- Music Controls -->
        <div class="mb-4">
            <div class="flex items-center justify-between mb-2">
                <span class="text-white text-sm">Background Music</span>
                <button
                    class="text-2xl"
                    onclick={toggleMusic}
                >
                    {settings.musicEnabled ? '🎵' : '🔇'}
                </button>
            </div>
            {#if settings.musicEnabled}
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={settings.musicVolume}
                    oninput={updateMusicVolume}
                    class="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                />
            {/if}
        </div>

        <!-- Sound Effects Controls -->
        <div>
            <div class="flex items-center justify-between mb-2">
                <span class="text-white text-sm">Sound Effects</span>
                <button
                    class="text-2xl"
                    onclick={toggleSound}
                >
                    {settings.soundEnabled ? '🔔' : '🔕'}
                </button>
            </div>
            {#if settings.soundEnabled}
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={settings.soundVolume}
                    oninput={updateSoundVolume}
                    class="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                />
            {/if}
        </div>
    </div>
{/if}

<style>
    /* Custom range slider styling */
    input[type="range"]::-webkit-slider-thumb {
        appearance: none;
        width: 16px;
        height: 16px;
        background: white;
        border-radius: 50%;
        cursor: pointer;
    }

    input[type="range"]::-moz-range-thumb {
        width: 16px;
        height: 16px;
        background: white;
        border-radius: 50%;
        cursor: pointer;
        border: none;
    }
</style>