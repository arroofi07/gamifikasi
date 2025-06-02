import { writable } from 'svelte/store';
import { browser } from '$app/environment';

interface AudioSettings {
    musicEnabled: boolean;
    soundEnabled: boolean;
    musicVolume: number;
    soundVolume: number;
}

// Create audio settings store
function createAudioStore() {
    const defaultSettings: AudioSettings = {
        musicEnabled: true,
        soundEnabled: true,
        musicVolume: 0.5,
        soundVolume: 0.7
    };

    // Load settings from localStorage if available
    const stored = browser ? localStorage.getItem('audioSettings') : null;
    const initial = stored ? JSON.parse(stored) : defaultSettings;

    const { subscribe, set, update } = writable<AudioSettings>(initial);

    return {
        subscribe,
        updateSettings: (settings: Partial<AudioSettings>) => {
            update(s => {
                const newSettings = { ...s, ...settings };
                if (browser) {
                    localStorage.setItem('audioSettings', JSON.stringify(newSettings));
                }
                return newSettings;
            });
        },
        toggleMusic: () => {
            update(s => {
                const newSettings = { ...s, musicEnabled: !s.musicEnabled };
                if (browser) {
                    localStorage.setItem('audioSettings', JSON.stringify(newSettings));
                }
                return newSettings;
            });
        },
        toggleSound: () => {
            update(s => {
                const newSettings = { ...s, soundEnabled: !s.soundEnabled };
                if (browser) {
                    localStorage.setItem('audioSettings', JSON.stringify(newSettings));
                }
                return newSettings;
            });
        }
    };
}

export const audioSettings = createAudioStore();

// Audio manager class
class AudioManager {
    private sounds: Map<string, HTMLAudioElement> = new Map();
    private backgroundMusic: HTMLAudioElement | null = null;
    private settings: AudioSettings = {
        musicEnabled: true,
        soundEnabled: true,
        musicVolume: 0.5,
        soundVolume: 0.7
    };

    constructor() {
        // Subscribe to settings changes
        audioSettings.subscribe(settings => {
            this.settings = settings;
            this.updateVolumes();
        });
    }

    // Load a sound effect
    loadSound(name: string, url: string) {
        if (!browser) return;
        
        const audio = new Audio(url);
        audio.preload = 'auto';
        this.sounds.set(name, audio);
    }

    // Play a sound effect
    playSound(name: string) {
        if (!browser || !this.settings.soundEnabled) return;
        
        const sound = this.sounds.get(name);
        if (sound) {
            sound.volume = this.settings.soundVolume;
            sound.currentTime = 0;
            sound.play().catch(e => console.log('Sound play failed:', e));
        }
    }

    // Load and play background music
    playBackgroundMusic(url: string) {
        if (!browser || !this.settings.musicEnabled) return;
        
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
        }
        
        this.backgroundMusic = new Audio(url);
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = this.settings.musicVolume;
        this.backgroundMusic.play().catch(e => console.log('Music play failed:', e));
    }

    // Stop background music
    stopBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
        }
    }

    // Update volumes based on settings
    private updateVolumes() {
        if (this.backgroundMusic) {
            this.backgroundMusic.volume = this.settings.musicVolume;
            if (this.settings.musicEnabled) {
                this.backgroundMusic.play().catch(e => console.log('Music resume failed:', e));
            } else {
                this.backgroundMusic.pause();
            }
        }
    }

    // Cleanup
    destroy() {
        this.stopBackgroundMusic();
        this.sounds.clear();
    }
}

// Export singleton instance
export const audioManager = browser ? new AudioManager() : null;