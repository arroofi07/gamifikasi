import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlocked: boolean;
    unlockedAt?: Date;
    progress?: number;
    maxProgress?: number;
    points: number;
}

export const achievements: Achievement[] = [
    {
        id: 'first_correct',
        title: 'Langkah Pertama',
        description: 'Jawab 1 pertanyaan dengan benar',
        icon: '🌟',
        unlocked: false,
        points: 10
    },
    {
        id: 'perfect_5',
        title: 'Streak Sempurna',
        description: 'Jawab 5 pertanyaan berturut-turut dengan benar',
        icon: '⚡',
        unlocked: false,
        points: 25
    },
    {
        id: 'explorer',
        title: 'Penjelajah Ruang Angkasa',
        description: 'Kunjungi semua planet',
        icon: '🚀',
        unlocked: false,
        progress: 0,
        maxProgress: 13,
        points: 50
    },
    {
        id: 'half_journey',
        title: 'Setengah Perjalanan',
        description: 'Selesaikan 50% dari semua pertanyaan',
        icon: '🌗',
        unlocked: false,
        progress: 0,
        maxProgress: 7,
        points: 30
    },
    {
        id: 'master',
        title: 'Master Anti-Korupsi',
        description: 'Selesaikan semua pertanyaan dengan benar',
        icon: '👑',
        unlocked: false,
        points: 100
    },
    {
        id: 'speed_demon',
        title: 'Kilat',
        description: 'Jawab pertanyaan dalam 10 detik',
        icon: '⏱️',
        unlocked: false,
        points: 20
    },
    {
        id: 'comeback',
        title: 'Bangkit Kembali',
        description: 'Jawab benar setelah 3 jawaban salah',
        icon: '💪',
        unlocked: false,
        points: 15
    },
    {
        id: 'perfect_score',
        title: 'Skor Sempurna',
        description: 'Raih 130 poin (semua jawaban benar)',
        icon: '💯',
        unlocked: false,
        points: 50
    },
    {
        id: 'early_bird',
        title: 'Early Bird',
        description: 'Mulai quiz di pagi hari (06:00 - 09:00)',
        icon: '🌅',
        unlocked: false,
        points: 10
    },
    {
        id: 'night_owl',
        title: 'Night Owl',
        description: 'Mulai quiz di malam hari (21:00 - 00:00)',
        icon: '🦉',
        unlocked: false,
        points: 10
    }
];

// Create achievements store
function createAchievementsStore() {
    // Load from localStorage
    const stored = browser ? localStorage.getItem('userAchievements') : null;
    const initial = stored ? JSON.parse(stored) : achievements;

    const { subscribe, set, update } = writable<Achievement[]>(initial);

    return {
        subscribe,
        unlock: (achievementId: string) => {
            update(achvs => {
                const updated = achvs.map(a => {
                    if (a.id === achievementId && !a.unlocked) {
                        return {
                            ...a,
                            unlocked: true,
                            unlockedAt: new Date()
                        };
                    }
                    return a;
                });
                
                if (browser) {
                    localStorage.setItem('userAchievements', JSON.stringify(updated));
                }
                
                return updated;
            });
        },
        updateProgress: (achievementId: string, progress: number) => {
            update(achvs => {
                const updated = achvs.map(a => {
                    if (a.id === achievementId && a.maxProgress) {
                        const newProgress = Math.min(progress, a.maxProgress);
                        const unlocked = newProgress >= a.maxProgress;
                        return {
                            ...a,
                            progress: newProgress,
                            unlocked,
                            unlockedAt: unlocked ? new Date() : a.unlockedAt
                        };
                    }
                    return a;
                });
                
                if (browser) {
                    localStorage.setItem('userAchievements', JSON.stringify(updated));
                }
                
                return updated;
            });
        },
        reset: () => {
            set(achievements);
            if (browser) {
                localStorage.removeItem('userAchievements');
            }
        }
    };
}

export const achievementsStore = createAchievementsStore();

// Derived store for unlocked achievements count
export const unlockedCount = derived(
    achievementsStore,
    $achievements => $achievements.filter(a => a.unlocked).length
);

// Derived store for total achievement points
export const totalAchievementPoints = derived(
    achievementsStore,
    $achievements => $achievements
        .filter(a => a.unlocked)
        .reduce((sum, a) => sum + a.points, 0)
);

// Achievement checking functions
export function checkAchievements(gameState: {
    correctAnswers: number;
    totalAnswers: number;
    consecutiveCorrect: number;
    visitedPlanets: Set<string>;
    totalScore: number;
    answerTime?: number;
    incorrectStreak?: number;
}) {
    const achievements: string[] = [];

    // First correct answer
    if (gameState.correctAnswers === 1) {
        achievements.push('first_correct');
    }

    // Perfect 5 streak
    if (gameState.consecutiveCorrect >= 5) {
        achievements.push('perfect_5');
    }

    // Speed demon - answered in under 10 seconds
    if (gameState.answerTime && gameState.answerTime <= 10) {
        achievements.push('speed_demon');
    }

    // Comeback - correct after 3 wrong
    if (gameState.incorrectStreak && gameState.incorrectStreak >= 3) {
        achievements.push('comeback');
    }

    // Perfect score
    if (gameState.totalScore >= 130) {
        achievements.push('perfect_score');
    }

    // Time-based achievements
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 9) {
        achievements.push('early_bird');
    } else if (hour >= 21 || hour < 1) {
        achievements.push('night_owl');
    }

    return achievements;
}