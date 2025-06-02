import { browser } from '$app/environment';

// Audio context for synthesized sounds
let audioContext: AudioContext | null = null;
let isAudioContextReady = false;

export function getAudioContext(): AudioContext | null {
    if (!browser) return null;
    
    if (!audioContext) {
        try {
            audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported:', e);
            return null;
        }
    }
    
    return audioContext;
}

// Initialize audio context on user interaction
export async function initializeAudioContext(): Promise<boolean> {
    const ctx = getAudioContext();
    if (!ctx) return false;
    
    if (ctx.state === 'suspended') {
        try {
            await ctx.resume();
        } catch (e) {
            console.warn('Failed to resume audio context:', e);
            return false;
        }
    }
    
    isAudioContextReady = true;
    return true;
}

// Create a simple tone
function createTone(frequency: number, duration: number, type: OscillatorType = 'sine'): void {
    const ctx = getAudioContext();
    if (!ctx || !isAudioContextReady) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
}

// Sound effects using Web Audio API
export const synthesizedSounds = {
    click: () => createTone(800, 0.1, 'square'),
    
    correct: () => {
        // Happy ascending chord
        createTone(523, 0.15); // C5
        setTimeout(() => createTone(659, 0.15), 100); // E5
        setTimeout(() => createTone(784, 0.2), 200); // G5
    },
    
    incorrect: () => {
        // Sad descending tone
        createTone(400, 0.3, 'sawtooth');
        setTimeout(() => createTone(300, 0.3, 'sawtooth'), 150);
    },
    
    achievement: () => {
        // Fanfare-like sound
        createTone(523, 0.2); // C5
        setTimeout(() => createTone(659, 0.2), 100); // E5
        setTimeout(() => createTone(784, 0.2), 200); // G5
        setTimeout(() => createTone(1047, 0.3), 300); // C6
    },
    
    countdown: () => {
        // Urgent beep
        createTone(1000, 0.1, 'square');
    },
    
    combo: () => {
        // Rising tone for combo
        createTone(440, 0.1);
        setTimeout(() => createTone(554, 0.1), 50);
        setTimeout(() => createTone(659, 0.1), 100);
    }
};

// Background music using Web Audio API
export function playBackgroundMusic(volume: number = 0.3): (() => void) | null {
    const ctx = getAudioContext();
    if (!ctx) return null;

    let isPlaying = true;
    const masterGain = ctx.createGain();
    masterGain.connect(ctx.destination);
    masterGain.gain.setValueAtTime(volume, ctx.currentTime);

    // Simple ambient space music
    function playAmbientTone() {
        if (!isPlaying || !ctx) return;

        const frequencies = [110, 146.83, 220, 293.66]; // A2, D3, A3, D4
        const frequency = frequencies[Math.floor(Math.random() * frequencies.length)];
        
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(masterGain);

        oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
        oscillator.type = 'sine';
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, ctx.currentTime);

        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 2);
        gainNode.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 8);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 12);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 12);

        // Schedule next tone
        setTimeout(() => playAmbientTone(), 8000 + Math.random() * 4000);
    }

    // Start the ambient music
    playAmbientTone();

    // Return stop function
    return () => {
        isPlaying = false;
        masterGain.disconnect();
    };
}