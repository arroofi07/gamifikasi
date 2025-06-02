<script lang="ts">
    import { audioManager } from '$lib/stores/audio';
    import { onMount } from 'svelte';

    let testResults = $state<string[]>([]);

    function addResult(message: string) {
        testResults = [...testResults, message];
    }

    async function testSound(soundName: string) {
        if (audioManager) {
            addResult(`Testing ${soundName} sound...`);
            await audioManager.playSound(soundName);
            addResult(`✅ ${soundName} sound played`);
        } else {
            addResult(`❌ Audio manager not available`);
        }
    }

    async function testBackgroundMusic() {
        if (audioManager) {
            addResult(`Starting background music file...`);
            await audioManager.startBackgroundMusic();
            addResult(`✅ Background music file (backsound.mp3) started`);
        } else {
            addResult(`❌ Audio manager not available`);
        }
    }

    function stopBackgroundMusic() {
        if (audioManager) {
            addResult(`Stopping background music...`);
            audioManager.stopBackgroundMusic();
            addResult(`🛑 Background music stopped`);
        }
    }

    onMount(() => {
        addResult('Audio Test Component Loaded');
    });
</script>

<div class="fixed bottom-4 left-4 z-50 bg-black/80 text-white p-4 rounded-lg max-w-xs max-h-64 overflow-y-auto">
    <h3 class="font-bold mb-2">🔊 Audio Test</h3>
    
    <div class="space-y-2 mb-4">
        <button class="bg-blue-500 text-white px-3 py-1 rounded text-sm" onclick={() => testSound('click')}>
            Test Click
        </button>
        <button class="bg-green-500 text-white px-3 py-1 rounded text-sm" onclick={() => testSound('correct')}>
            Test Correct
        </button>
        <button class="bg-red-500 text-white px-3 py-1 rounded text-sm" onclick={() => testSound('incorrect')}>
            Test Incorrect
        </button>
        <button class="bg-yellow-500 text-white px-3 py-1 rounded text-sm" onclick={() => testSound('achievement')}>
            Test Achievement
        </button>
        <button class="bg-purple-500 text-white px-3 py-1 rounded text-sm" onclick={() => testSound('combo')}>
            Test Combo
        </button>
        <button class="bg-orange-500 text-white px-3 py-1 rounded text-sm" onclick={() => testBackgroundMusic()}>
            Start Music
        </button>
        <button class="bg-gray-500 text-white px-3 py-1 rounded text-sm" onclick={() => stopBackgroundMusic()}>
            Stop Music
        </button>
    </div>

    <div class="text-xs space-y-1">
        {#each testResults.slice(-5) as result}
            <div class="opacity-80">{result}</div>
        {/each}
    </div>
</div>