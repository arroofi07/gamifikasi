import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type Difficulty = 'easy' | 'medium' | 'hard';

interface GameSettings {
    difficulty: Difficulty;
    timerEnabled: boolean;
    timerDuration: number; // in seconds
    showPlanetInfo: boolean;
}

function createGameSettingsStore() {
    const defaultSettings: GameSettings = {
        difficulty: 'medium',
        timerEnabled: false,
        timerDuration: 30,
        showPlanetInfo: true
    };

    // Load from localStorage
    const stored = browser ? localStorage.getItem('gameSettings') : null;
    const initial = stored ? JSON.parse(stored) : defaultSettings;

    const { subscribe, set, update } = writable<GameSettings>(initial);

    return {
        subscribe,
        updateSettings: (settings: Partial<GameSettings>) => {
            update(s => {
                const newSettings = { ...s, ...settings };
                if (browser) {
                    localStorage.setItem('gameSettings', JSON.stringify(newSettings));
                }
                return newSettings;
            });
        },
        reset: () => {
            set(defaultSettings);
            if (browser) {
                localStorage.removeItem('gameSettings');
            }
        }
    };
}

export const gameSettings = createGameSettingsStore();

// Score multipliers based on difficulty
export const difficultyMultipliers = {
    easy: 0.5,
    medium: 1,
    hard: 2
};

// Timer durations based on difficulty
export const timerDurations = {
    easy: 45,
    medium: 30,
    hard: 20
};