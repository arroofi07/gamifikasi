<script lang="ts">
    // Import images
    import spaceImage from '$lib/assets/space.jpg';
    import sunImage from '$lib/assets/sun.png';
    import mercuryImage from '$lib/assets/mercury.png';
    import venusImage from '$lib/assets/venus.png';
    import earthImage from '$lib/assets/earth.png';
    import mars from '$lib/assets/mars.png';
    import saturnus from '$lib/assets/saturnus.png';
    import uranus from '$lib/assets/uranus.png';
    import neptune from '$lib/assets/neptune.png';
    import jupiter from '$lib/assets/jupiter.png';
    import asteroid from '$lib/assets/asteroid.png';
    import pluto from '$lib/assets/pluto.png';
    import gj504 from '$lib/assets/gj504.png';
    import nebula from '$lib/assets/nebula.png';
    import iss from '$lib/assets/iss.png';
    
    // Import utilities
    import { onMount, onDestroy } from 'svelte';
    import { goto } from '$app/navigation';
    import { db } from "../../firebase";
    import { doc, updateDoc, setDoc, getDoc } from "firebase/firestore";
    
    // Import new components and stores
    import { planetsData, type Planet } from '$lib/data/questions';
    import { gameSettings, difficultyMultipliers, timerDurations } from '$lib/stores/gameSettings';
    import { achievementsStore, checkAchievements } from '$lib/stores/achievements';
    import { audioManager } from '$lib/stores/audio';
    import QuestionTimer from '$lib/components/QuestionTimer.svelte';
    import ComboIndicator from '$lib/components/ComboIndicator.svelte';
    import AchievementNotification from '$lib/components/AchievementNotification.svelte';
    import PlanetInfoModal from '$lib/components/PlanetInfoModal.svelte';
    import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';

    // Game state
    let selectedPlanet: Planet | null = $state(null);
    let point = $state(0);
    let answered = $state(false);
    let isCorrect = $state(false);
    let userData: any = null;
    let completedQuestions = $state(new Set());
    let countdown = $state(5);
    let showCompletionModal = $state(false);
    let previousScore = $state(0); // Store previous score
    
    // New features state
    let currentSettings = $state({ difficulty: 'medium', timerEnabled: false, timerDuration: 30, showPlanetInfo: true });
    let combo = $state(0);
    let maxCombo = $state(0);
    let showPlanetInfo = $state(false);
    let selectedPlanetInfo: Planet | null = $state(null);
    let showTimer = $state(false);
    let answerStartTime = $state(0);
    let correctAnswers = $state(0);
    let totalAnswers = $state(0);
    let incorrectStreak = $state(0);
    let unlockedAchievements = $state<string[]>([]);
    let showAchievement = $state(false);
    let currentAchievement = $state(null);
    
    // Subscribe to achievements store
    let achievementsData = $state<any[]>([]);

    onMount(async () => {
        // Get user data from localStorage
        const userDataStr = localStorage.getItem('userData');
        if (userDataStr) {
            userData = JSON.parse(userDataStr);
            
            // Load existing score from database
            try {
                const scoreDoc = await getDoc(doc(db, "scores", userData.id));
                if (scoreDoc.exists()) {
                    const scoreData = scoreDoc.data();
                    previousScore = scoreData.points || 0;
                    point = previousScore; // Start with previous score
                    // Don't load completedQuestions - let user start fresh quiz
                    completedQuestions = new Set(); // Always start with empty set for new quiz
                    // Keep track of lifetime stats
                    maxCombo = 0; // Reset for this session
                    correctAnswers = 0; // Reset for this session
                    totalAnswers = 0; // Reset for this session
                }
            } catch (error) {
                console.error("Error loading previous score:", error);
            }
        }
        
        // Subscribe to game settings
        const unsubscribeSettings = gameSettings.subscribe(settings => {
            currentSettings = settings;
        });
        
        // Subscribe to achievements
        const unsubscribeAchievements = achievementsStore.subscribe(achievements => {
            achievementsData = achievements;
        });
        
        // Check every second
        intervalId = setInterval(() => {
            const userDataStr = localStorage.getItem('userData');
            if (!userDataStr) {
                goto('/');
                return;
            }

            try {
                const userData = JSON.parse(userDataStr);
                const now = new Date().getTime();

                if (now > userData.expiry) {
                    localStorage.removeItem('userData');
                    goto('/');
                }
            } catch (error) {
                localStorage.removeItem('userData');
                goto('/');
            }
        }, 1000); // Check setiap 1 detik
    });

    onDestroy(() => {
        if (intervalId) {
            clearInterval(intervalId);
        }
    });
    
    // Get current question based on difficulty
    function getCurrentQuestion(planet: Planet) {
        return planet.questions[currentSettings.difficulty as keyof typeof planet.questions];
    }
    
    // Handle timer timeout
    function handleTimeout() {
        if (!answered) {
            answered = true;
            isCorrect = false;
            combo = 0;
            incorrectStreak++;
            totalAnswers++;
            audioManager?.playSound('incorrect');
        }
    }

    const checkAnswer = async (answer: string) => {
        if (!selectedPlanet) return;
        
        answered = true;
        showTimer = false;
        
        const answerTime = (Date.now() - answerStartTime) / 1000;
        const currentQuestion = getCurrentQuestion(selectedPlanet);
        
        if (answer === currentQuestion.kunciJawaban) {
            isCorrect = true;
            correctAnswers++;
            combo++;
            incorrectStreak = 0;
            
            // Calculate points with difficulty and combo multipliers
            const basePoints = 10;
            const difficultyBonus = difficultyMultipliers[currentSettings.difficulty as keyof typeof difficultyMultipliers];
            const comboMultiplier = combo >= 10 ? 3 : combo >= 7 ? 2.5 : combo >= 5 ? 2 : combo >= 3 ? 1.5 : 1;
            const pointsEarned = Math.round(basePoints * difficultyBonus * comboMultiplier);
            
            point += pointsEarned;
            maxCombo = Math.max(maxCombo, combo);
            
            // Play sound
            audioManager?.playSound('correct');
            
            // Play combo sound for streaks
            if (combo >= 3) {
                setTimeout(() => audioManager?.playSound('combo'), 200);
            }
        } else {
            isCorrect = false;
            combo = 0;
            incorrectStreak++;
            
            // Play sound
            audioManager?.playSound('incorrect');
        }
        
        totalAnswers++;
        
        completedQuestions.add(selectedPlanet.name);
        
        // Check achievements
        const gameState = {
            correctAnswers,
            totalAnswers,
            consecutiveCorrect: combo,
            visitedPlanets: completedQuestions as Set<string>,
            totalScore: point,
            answerTime,
            incorrectStreak: isCorrect && incorrectStreak > 3 ? incorrectStreak : 0
        };
        
        const newAchievements = checkAchievements(gameState);
        for (const achievementId of newAchievements) {
            achievementsStore.unlock(achievementId);
            // Show achievement notification
            const achievement = achievementsData.find(a => a.id === achievementId);
            if (achievement && !achievement.unlocked) {
                currentAchievement = achievement as any;
                showAchievement = true;
            }
        }
        
        // Update progress achievements
        achievementsStore.updateProgress('explorer', completedQuestions.size);
        achievementsStore.updateProgress('half_journey', Math.min(correctAnswers, 7));
        
        try {
            await setDoc(doc(db, "scores", userData.id), {
                userId: userData.id,
                username: userData.username,
                points: point,
                completedQuestions: Array.from(completedQuestions),
                updatedAt: new Date(),
                difficulty: currentSettings.difficulty,
                maxCombo,
                correctAnswers,
                totalAnswers,
                achievements: achievementsData.filter(a => a.unlocked).map(a => a.id)
            });

            if (completedQuestions.size === planets.length) {
                showCompletionModal = true;
                const timer = setInterval(() => {
                    countdown--;
                    if (countdown === 0) {
                        clearInterval(timer);
                        // Don't remove userData - let user continue playing
                        goto('/');
                    }
                }, 1000);
            }
        } catch (error) {
            console.error("Error saving score:", error);
        }
    };

    const nextQuestion = () => {
        selectedPlanet = null;
        answered = false;
        isCorrect = false;
        showTimer = false;
    };

    // Map planet data with images
    const planetImages = {
        sun: sunImage,
        mercury: mercuryImage,
        venus: venusImage,
        earth: earthImage,
        mars: mars,
        jupiter: jupiter,
        saturnus: saturnus,
        uranus: uranus,
        neptune: neptune,
        pluto: pluto,
        asteroid: asteroid,
        nebula: nebula,
        iss: iss
    };
    
    // Make planets reactive to difficulty changes
    let planets = $derived(planetsData.map(planet => ({
        ...planet,
        image: planetImages[planet.image as keyof typeof planetImages] || sunImage,
        question: getCurrentQuestion(planet).question,
        answer: getCurrentQuestion(planet).answer,
        kunciJawaban: getCurrentQuestion(planet).kunciJawaban
    })));
    

    function selectPlanet(planet: any) {
        if (completedQuestions.has(planet.name)) return;
        
        if (selectedPlanet === planet) {
            selectedPlanet = null;
            showTimer = false;
        } else {
            selectedPlanet = planet;
            answerStartTime = Date.now();
            showTimer = currentSettings.timerEnabled;
            audioManager?.playSound('click');
        }
    }
    
    function showPlanetInfoModal(planet: Planet) {
        selectedPlanetInfo = planet;
        showPlanetInfo = true;
        audioManager?.playSound('click');
    }

    // Add preloading state
    let imageLoaded = $state(false);
    
    // Preload image
    function handleImageLoad() {
        imageLoaded = true;
    }

    // Handle point
    let intervalId: any;
</script>

<!-- Components -->
<QuestionTimer 
    duration={timerDurations[currentSettings.difficulty as keyof typeof timerDurations]} 
    onTimeout={handleTimeout}
    isActive={showTimer && !answered}
/>

<ComboIndicator combo={combo} maxCombo={maxCombo} />

{#if showAchievement && currentAchievement}
    <AchievementNotification 
        achievement={currentAchievement}
        onClose={() => showAchievement = false}
    />
{/if}

{#if showPlanetInfo && selectedPlanetInfo}
    <PlanetInfoModal 
        planet={selectedPlanetInfo}
        onClose={() => showPlanetInfo = false}
    />
{/if}

<!-- Mobile Only Content -->
<div class="md:hidden space-container text-white relative min-h-screen">
    <img
        src={spaceImage}
        alt="space background"
        class="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 -z-10"
        class:opacity-0={!imageLoaded}
        onload={handleImageLoad}
        loading="eager"
        decoding="async"
    />
    <div class="absolute inset-0 bg-gradient-to-b from-[#0B0B3B] to-[#000033]"></div>

    <div class="stars">
        {#each Array(20) as _, index (index)}
            <div class="star" style="top: {Math.random() * 100}%; left: {Math.random() * 100}%; width: {Math.random() * 3 + 1}px; height: {Math.random() * 3 + 1}px;"></div>
        {/each}
    </div>

    <div class="space-header">
        <h1 class="space-title">SOLAR SYSTEM</h1>
        <p class="space-subtitle">Ayo Jawab Soal yang Ada di Setiap Planet</p>
        <div class="flex justify-center items-center gap-4 mt-2">
            <p class="space-subtitle">Points: <span class="font-bold text-yellow-400">{point}</span></p>
            <span class="text-white/50">|</span>
            <p class="space-subtitle">Level: <span class="font-bold {currentSettings.difficulty === 'easy' ? 'text-green-400' : currentSettings.difficulty === 'medium' ? 'text-yellow-400' : 'text-red-400'}">
                {currentSettings.difficulty === 'easy' ? 'Mudah' : currentSettings.difficulty === 'medium' ? 'Sedang' : 'Sulit'}
            </span></p>
        </div>
        <div class="mt-2 text-sm opacity-75">
            Progress: {completedQuestions.size}/{planets.length} planets
        </div>
    </div>

    <div class="gap-8 grid-cols-1 grid justify-items-center items-center mb-52 px-4 pb-20 relative z-3">
        {#each planets as planet}
            <div 
                class="planet-container {planet.position} mb-8 relative"
                style="--planet-color: {planet.color}"
                class:selected={selectedPlanet === planet}
                class:completed={completedQuestions.has(planet.name)}
                onclick={() => !completedQuestions.has(planet.name) && selectPlanet(planet)}
                onkeydown={(e) => e.key === 'Enter' && !completedQuestions.has(planet.name) && selectPlanet(planet)}
                role="button"
                tabindex="0"
            >
                <img 
                    src={planet.image} 
                    width={planet.width} 
                    height={planet.height} 
                    alt={planet.name}
                    class="planet-image {planet.animation}"
                />
                
                {#if completedQuestions.has(planet.name)}
                    <div class="completed-label">Done ✓</div>
                {/if}
                
                {#if currentSettings.showPlanetInfo}
                    <button 
                        class="absolute top-2 right-2 bg-white/20 rounded-full p-1 text-xs backdrop-blur-sm"
                        onclick={(e) => {
                            e.stopPropagation();
                            const planetData = planetsData.find(p => p.name === planet.name);
                            if (planetData) showPlanetInfoModal(planetData);
                        }}
                    >
                        ℹ️
                    </button>
                {/if}
            </div>
        {/each}
    </div>

    {#if selectedPlanet}
        <div class="planet-info" style="--planet-color: {selectedPlanet.color}">
            <h3>{selectedPlanet.name}</h3>
            <p class="mb-4">{getCurrentQuestion(selectedPlanet).question}</p>
            
            <div class="answers">
                {#if !answered}
                    {#each getCurrentQuestion(selectedPlanet).answer as answer}
                        <button 
                            class="answer-button w-full"
                            onclick={() => checkAnswer(answer)}
                        >
                            {answer}
                        </button>
                    {/each}
                {:else}
                    <div class="feedback-message text-center mb-4">
                        {#if isCorrect}
                            <div class="success-feedback">
                                <p class="text-green-400 font-bold text-xl mb-2">✅ Jawaban Benar!</p>
                                <p class="text-white text-sm">+10 points</p>
                            </div>
                        {:else}
                            <div class="error-feedback">
                                <p class="text-red-400 font-bold text-xl mb-2">❌ Jawaban Salah!</p>
                                <p class="text-white text-sm">Jawaban yang benar:</p>
                                <p class="text-white font-bold mt-1">{getCurrentQuestion(selectedPlanet).kunciJawaban}</p>
                            </div>
                        {/if}
                    </div>
                {/if}
            </div>

            <button 
                class="close-btn mt-4" 
                onclick={nextQuestion}
            >
                {answered ? 'Lanjut' : 'Tutup'}
            </button>
        </div>
    {/if}

    {#if showCompletionModal}
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
            <div class="bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-lg text-center max-w-md mx-4">
                <h2 class="text-2xl font-bold mb-4">🎉 Selamat!</h2>
                <p class="mb-4">Anda telah menyelesaikan semua soal!</p>
                
                <div class="space-y-2 mb-4">
                    <p class="text-lg">Point Sesi Ini: <span class="text-yellow-400">+{point - previousScore}</span></p>
                    <p class="text-xl font-bold">Total Point: <span class="text-yellow-400">{point}</span></p>
                    <p>Jawaban Benar: <span class="text-green-400">{correctAnswers}/{totalAnswers}</span></p>
                    <p>Combo Tertinggi: <span class="text-purple-400">x{maxCombo}</span></p>
                    <p>Difficulty: <span class="{currentSettings.difficulty === 'easy' ? 'text-green-400' : currentSettings.difficulty === 'medium' ? 'text-yellow-400' : 'text-red-400'}">
                        {currentSettings.difficulty === 'easy' ? 'Mudah' : currentSettings.difficulty === 'medium' ? 'Sedang' : 'Sulit'}
                    </span></p>
                </div>
                
                {#if achievementsData.filter(a => a.unlocked).length > 0}
                    <div class="mb-4">
                        <p class="text-sm opacity-75">Achievements Unlocked: {achievementsData.filter(a => a.unlocked).length}</p>
                    </div>
                {/if}
                
                <p class="mt-4">Kembali ke halaman utama dalam...</p>
                <p class="text-4xl font-bold mt-2">{countdown}</p>
                <p class="text-sm opacity-75 mt-2">Anda dapat bermain lagi dengan username yang sama!</p>
            </div>
        </div>
    {/if}
</div>

<!-- Desktop Warning Message -->
<div class="hidden md:flex min-h-screen items-center justify-center desktop-warning">
    <div class="text-center p-8 warning-card">
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
    /* Add to your existing styles */
    .backdrop-blur-md {
        backdrop-filter: blur(8px);
    }
    
    .bg-black\/80 {
        background-color: rgba(0, 0, 0, 0.8);
    }
</style>