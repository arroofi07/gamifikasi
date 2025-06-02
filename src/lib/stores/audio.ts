import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { synthesizedSounds, initializeAudioContext } from '$lib/utils/audioSynthesis';
import backgroundMusicFile from '$lib/assets/sounds/backsound.mp3';

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
    private settings: AudioSettings = {
        musicEnabled: true,
        soundEnabled: true,
        musicVolume: 0.5,
        soundVolume: 0.7
    };
    private backgroundMusic: HTMLAudioElement | null = null;

    constructor() {
        // Subscribe to settings changes
        audioSettings.subscribe(settings => {
            this.settings = settings;
            this.updateBackgroundMusic();
        });
    }

    // Play a sound effect using Web Audio API
    async playSound(name: string) {
        if (!browser || !this.settings.soundEnabled) return;
        
        // Initialize audio context on first sound
        await initializeAudioContext();
        
        const soundFunction = synthesizedSounds[name as keyof typeof synthesizedSounds];
        if (soundFunction) {
            try {
                soundFunction();
            } catch (e) {
                console.log('Sound play failed:', e);
            }
        }
    }

    // Start background music
    async startBackgroundMusic() {
        if (!browser || !this.settings.musicEnabled) return;
        
        // Initialize audio context first
        await initializeAudioContext();
        
        this.stopBackgroundMusic();
        
        try {
            this.backgroundMusic = new Audio(backgroundMusicFile);
            this.backgroundMusic.loop = true;
            this.backgroundMusic.volume = this.settings.musicVolume;
            
            // Play with user interaction handling
            this.backgroundMusic.play().catch(e => {
                console.log('Background music play failed (likely no user interaction yet):', e);
            });
        } catch (e) {
            console.log('Background music failed:', e);
        }
    }

    // Stop background music
    stopBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
            this.backgroundMusic = null;
        }
    }

    // Update background music based on settings
    private updateBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.volume = this.settings.musicVolume;
            
            if (this.settings.musicEnabled) {
                this.backgroundMusic.play().catch(e => {
                    console.log('Background music resume failed:', e);
                });
            } else {
                this.backgroundMusic.pause();
            }
        }
    }

    // Cleanup
    destroy() {
        this.stopBackgroundMusic();
    }
}

// Export singleton instance
export const audioManager = browser ? new AudioManager() : null;