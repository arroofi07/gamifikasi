<script lang="ts">
	import '../app.css';
	import AudioControls from '$lib/components/AudioControls.svelte';
	import ParticleEffects from '$lib/components/ParticleEffects.svelte';
	import AudioTest from '$lib/components/AudioTest.svelte';
	import { dev } from '$app/environment';

	let { children } = $props();
</script>

<AudioControls />
<ParticleEffects />
{#if dev}
	<AudioTest />
{/if}
{@render children()}
