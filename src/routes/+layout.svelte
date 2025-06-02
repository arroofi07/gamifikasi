<script lang="ts">
	import '../app.css';
	import AudioControls from '$lib/components/AudioControls.svelte';
	import ParticleEffects from '$lib/components/ParticleEffects.svelte';

	let { children } = $props();
</script>

<AudioControls />
<ParticleEffects />
{@render children()}
