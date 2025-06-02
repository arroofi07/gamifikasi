<script lang="ts">
	import { audioSettings, audioManager } from '$lib/stores/audio';
	import { onMount } from 'svelte';

	let settings = $state({
		musicEnabled: true,
		soundEnabled: true,
		musicVolume: 0.2,
		soundVolume: 0.7
	});

	let showControls = $state(false);

	onMount(() => {
		const unsubscribe = audioSettings.subscribe((s) => {
			settings = s;
		});

		// Start background music if enabled
		if (audioManager && settings.musicEnabled) {
			// Add a small delay to ensure user interaction
			setTimeout(() => {
				audioManager.startBackgroundMusic();
			}, 1000);
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
			// Start background music on first interaction if enabled
			if (settings.musicEnabled) {
				audioManager.startBackgroundMusic();
			}
		}
	}

	function toggleSound() {
		audioSettings.toggleSound();
		if (audioManager && settings.soundEnabled) {
			audioManager.playSound('click');
		}
	}

	function handleVolumeChange() {
		// Test sound when adjusting volume
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
		handleVolumeChange();
	}
</script>

<!-- Audio Control Button -->
<button
	class="fixed top-4 right-4 z-50 rounded-full bg-white/10 p-3 shadow-lg backdrop-blur-md transition-all hover:bg-white/20"
	onclick={() => {
		showControls = !showControls;
		// Start background music on first interaction if enabled
		if (audioManager && settings.musicEnabled && !showControls) {
			audioManager.startBackgroundMusic();
		}
	}}
>
	{#if settings.musicEnabled || settings.soundEnabled}
		🔊
	{:else}
		🔇
	{/if}
</button>

<!-- Audio Control Panel -->
{#if showControls}
	<div
		class="fixed top-16 right-4 z-50 min-w-[250px] rounded-lg bg-white/10 p-4 shadow-lg backdrop-blur-md"
	>
		<h3 class="mb-3 font-bold text-white">Audio Settings</h3>

		<!-- Music Controls -->
		<div class="mb-4">
			<div class="mb-2 flex items-center justify-between">
				<span class="text-sm text-white">Background Music</span>
				<button class="text-2xl" onclick={toggleMusic}>
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
					class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-white/20"
				/>
			{/if}
		</div>

		<!-- Sound Effects Controls -->
		<div>
			<div class="mb-2 flex items-center justify-between">
				<span class="text-sm text-white">Sound Effects</span>
				<button class="text-2xl" onclick={toggleSound}>
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
					class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-white/20"
				/>
			{/if}
		</div>
	</div>
{/if}

<style>
	/* Custom range slider styling */
	input[type='range']::-webkit-slider-thumb {
		appearance: none;
		width: 16px;
		height: 16px;
		background: white;
		border-radius: 50%;
		cursor: pointer;
	}

	input[type='range']::-moz-range-thumb {
		width: 16px;
		height: 16px;
		background: white;
		border-radius: 50%;
		cursor: pointer;
		border: none;
	}
</style>
