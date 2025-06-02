<script lang="ts">
    import { db } from "../firebase";
    import { collection, addDoc, getDocs, query, orderBy, limit } from "firebase/firestore";
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import vid from '../lib/assets/video.mp4';
    import { gameSettings, type Difficulty } from '$lib/stores/gameSettings';
    import { audioManager, audioSettings } from '$lib/stores/audio';
    import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
    import SkeletonLoader from '$lib/components/SkeletonLoader.svelte';
    
    let username = $state("");
    let leaderboard = $state<any[]>([]);
    let showVideo = $state(true);
    let removeVideo = $state(false);
    let selectedDifficulty: Difficulty = $state('medium');
    let showSettings = $state(false);
    let isLoading = $state(true);
    let isCreatingUser = $state(false);
    let audioSettingsData = $state({ musicEnabled: true, soundEnabled: true });

    onMount(async () => {
        // Subscribe to audio settings
        const unsubscribe = audioSettings.subscribe(settings => {
            audioSettingsData = settings;
        });
        
        try {
            // Fetch top 10 scores
            const scoresRef = collection(db, "scores");
            const q = query(scoresRef, orderBy("points", "desc"), limit(100));
            const querySnapshot = await getDocs(q);
            leaderboard = querySnapshot.docs.map(doc => doc.data());
        } catch (error) {
            console.error("Error fetching leaderboard:", error);
        } finally {
            isLoading = false;
        }

        // Hide video after 2 seconds
        setTimeout(() => {
            showVideo = false;
            // Remove video from DOM after fade out animation
            setTimeout(() => {
                removeVideo = true;
            }, 500); // Wait for fade out animation to complete
        }, 2000);
    });

    const createUser = async () => {
        if (!username.trim()) {
            alert("Please enter a username");
            return;
        }

        isCreatingUser = true;

        // Play click sound and start background music
        if (audioManager) {
            audioManager.playSound('click');
            // Start background music on user interaction if enabled
            if (audioManager && audioSettingsData.musicEnabled) {
                audioManager.startBackgroundMusic();
            }
        }

        // Update game settings with selected difficulty
        gameSettings.updateSettings({ difficulty: selectedDifficulty });

        try {
            const usersRef = collection(db, "users");
            const docRef = await addDoc(usersRef, {
                username: username,
                createdAt: new Date(),
                difficulty: selectedDifficulty
            });

            
            const userData = {
                id: docRef.id,
                username: username,
                expiry: new Date().getTime() + (60 * 60 * 1000)
            };
            
            localStorage.setItem("userData", JSON.stringify(userData));
            await goto('/home');
            username = "";
        } catch (error) {
            console.error("Error creating user: ", error);
            alert("Terjadi kesalahan. Silakan coba lagi.");
        } finally {
            isCreatingUser = false;
        }
    }
</script>

<!-- Video Intro -->
{#if !removeVideo}
    <div class="fixed inset-0 z-50 bg-black transition-opacity duration-500" 
         class:opacity-0={!showVideo}>
        <video autoplay muted class="w-full h-full object-cover">
            <source src={vid} type="video/mp4" />
            Your browser does not support the video tag.
        </video>
    </div>
{/if}

<div class="md:hidden min-h-screen bg-gradient-to-b from-blue-900 to-purple-900 text-white">
    <div class="container mx-auto px-4 py-8">
        <!-- Header -->
        <div class="text-center mb-8">
            <h1 class="text-4xl font-bold mb-2">🚀 Space Quiz</h1>
            <p class="text-lg opacity-80">Jelajahi Tata Surya & Uji Pengetahuanmu</p>
        </div>

        <!-- Login Form -->
        <div class="bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-lg mb-8">
            <h2 class="text-xl font-semibold mb-4">Mulai Petualangan</h2>
            <div class="space-y-4">
                <div>
                    <label for="username" class="block text-sm font-medium mb-1">Username</label>
                    <input 
                        type="text" 
                        id="username" 
                        bind:value={username}
                        class="w-full p-3 rounded bg-white/5 border border-white/20 text-white placeholder-white/50"
                        placeholder="Masukkan username"
                    >
                </div>
                
                <!-- Difficulty Selection -->
                <div>
                    <label class="block text-sm font-medium mb-2">Tingkat Kesulitan</label>
                    <div class="grid grid-cols-3 gap-2">
                        <button
                            class="px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium {selectedDifficulty === 'easy' ? 'bg-green-500' : 'bg-white/10'}"
                            onclick={() => selectedDifficulty = 'easy'}
                        >
                            Mudah
                        </button>
                        <button
                            class="px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium {selectedDifficulty === 'medium' ? 'bg-yellow-500' : 'bg-white/10'}"
                            onclick={() => selectedDifficulty = 'medium'}
                        >
                            Sedang
                        </button>
                        <button
                            class="px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium {selectedDifficulty === 'hard' ? 'bg-red-500' : 'bg-white/10'}"
                            onclick={() => selectedDifficulty = 'hard'}
                        >
                            Sulit
                        </button>
                    </div>
                    <div class="text-xs text-white/70 mt-2">
                        {#if selectedDifficulty === 'easy'}
                            • Pertanyaan dasar • 5 poin per jawaban • Timer 45 detik
                        {:else if selectedDifficulty === 'medium'}
                            • Pertanyaan menengah • 10 poin per jawaban • Timer 30 detik
                        {:else}
                            • Pertanyaan sulit • 20 poin per jawaban • Timer 20 detik
                        {/if}
                    </div>
                </div>

                <button 
                    class="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    onclick={createUser}
                    disabled={isCreatingUser}
                >
                    {#if isCreatingUser}
                        <LoadingSpinner size="small" />
                        <span>Memulai...</span>
                    {:else}
                        Mulai Quiz
                    {/if}
                </button>
            </div>
        </div>

        <!-- Leaderboard -->
        <div class="bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-lg">
            <h2 class="text-xl font-semibold mb-4">🏆 Peringkat Teratas</h2>
            <div class="space-y-3">
                {#if isLoading}
                    <SkeletonLoader type="card" count={5} height="h-16" />
                {:else if leaderboard.length === 0}
                    <p class="text-center text-white/60 py-8">Belum ada pemain. Jadilah yang pertama!</p>
                {:else}
                    {#each leaderboard as user, i}
                        <div class="flex items-center bg-white/5 p-3 rounded transition-all hover:bg-white/10">
                            <div class="text-2xl font-bold w-8">
                                {#if i === 0}🥇
                                {:else if i === 1}🥈
                                {:else if i === 2}🥉
                                {:else}{i + 1}.
                                {/if}
                            </div>
                            <div class="flex-1">
                                <div class="font-medium">{user.username}</div>
                                <div class="text-sm opacity-75">
                                    {user.points} points
                                    {#if user.difficulty}
                                        <span class="ml-2 text-xs px-2 py-0.5 rounded-full bg-white/10">
                                            {user.difficulty === 'easy' ? 'Mudah' : user.difficulty === 'medium' ? 'Sedang' : 'Sulit'}
                                        </span>
                                    {/if}
                                </div>
                            </div>
                        </div>
                    {/each}
                {/if}
            </div>
        </div>
    </div>
</div>

<!-- Desktop Warning Message -->
<div class="hidden md:flex min-h-screen bg-gradient-to-b from-blue-900 to-purple-900 text-white items-center justify-center">
    <div class="text-center p-8 bg-white/10 backdrop-blur-md rounded-lg shadow-lg">
        <div class="text-6xl mb-4">🌌</div>
        <h1 class="text-3xl font-bold mb-4">Eksplorasi Mobile</h1>
        <p class="text-lg opacity-90 mb-4">
            Pengalaman tata surya ini dirancang khusus untuk perangkat mobile
        </p>
        <p class="text-sm opacity-75">
            Silakan buka di smartphone atau tablet untuk menjelajahi planet-planet
        </p>
    </div>
</div>

<style>
    .opacity-0 {
        opacity: 0;
    }

    .transition-opacity {
        transition: opacity 0.5s ease-out;
    }
</style>
