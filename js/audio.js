/**
 * Audio Engine - Web Audio API metronome + optional voice cues
 * Generates tick sounds, phase transition sounds, and spoken cues
 */
const AudioEngine = (() => {
    let ctx = null;
    let enabled = true;
    let voiceEnabled = true;

    // Pre-loaded voice cue audio elements
    const voiceClips = {
        en: [null, null, null, null],
        hi: [null, null, null, null]
    };
    const CLIP_NAMES = ['inhale', 'hold', 'exhale', 'hold2'];

    /**
     * Preload all voice clip audio elements
     */
    function preloadVoiceClips() {
        ['en', 'hi'].forEach(lang => {
            CLIP_NAMES.forEach((name, i) => {
                const audio = new Audio('audio/' + lang + '/' + name + '.mp3');
                audio.preload = 'auto';
                audio.volume = 0.8;
                voiceClips[lang][i] = audio;
            });
        });
    }

    function getContext() {
        if (!ctx) {
            ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (ctx.state === 'suspended') {
            ctx.resume();
        }
        return ctx;
    }

    /**
     * Play a short tick sound at 60 BPM (one tick = one second)
     * @param {number} frequency - tone frequency in Hz
     * @param {number} volume - gain 0-1
     * @param {number} duration - in seconds
     */
    function playTick(frequency = 800, volume = 0.08, duration = 0.04) {
        if (!enabled) return;
        try {
            const ac = getContext();
            const osc = ac.createOscillator();
            const gain = ac.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(frequency, ac.currentTime);
            gain.gain.setValueAtTime(volume, ac.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration);
            osc.connect(gain);
            gain.connect(ac.destination);
            osc.start(ac.currentTime);
            osc.stop(ac.currentTime + duration);
        } catch (e) {
            // Silently fail if audio context is unavailable
        }
    }

    /**
     * Play a phase transition tone (slightly different per phase)
     * @param {number} phaseIndex - 0=inhale, 1=hold, 2=exhale, 3=hold2
     */
    function playPhaseTransition(phaseIndex) {
        if (!enabled) return;
        const frequencies = [440, 523, 392, 349]; // A4, C5, G4, F4
        const volumes = [0.12, 0.08, 0.1, 0.06];
        playTick(frequencies[phaseIndex], volumes[phaseIndex], 0.12);
    }

    /**
     * Play a countdown tick (preparation phase)
     */
    function playCountdownTick() {
        if (!enabled) return;
        playTick(660, 0.1, 0.06);
    }

    /**
     * Play a session-complete chime
     */
    function playComplete() {
        if (!enabled) return;
        try {
            const ac = getContext();
            const notes = [523, 659, 784]; // C5, E5, G5
            notes.forEach((freq, i) => {
                const osc = ac.createOscillator();
                const gain = ac.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, ac.currentTime + i * 0.15);
                gain.gain.setValueAtTime(0.12, ac.currentTime + i * 0.15);
                gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + i * 0.15 + 0.4);
                osc.connect(gain);
                gain.connect(ac.destination);
                osc.start(ac.currentTime + i * 0.15);
                osc.stop(ac.currentTime + i * 0.15 + 0.4);
            });
        } catch (e) {
            // Silently fail
        }
    }

    /**
     * Play a recorded voice cue for the given phase
     * @param {number} phaseIndex - 0=inhale, 1=hold, 2=exhale, 3=hold2
     */
    function speakPhase(phaseIndex) {
        if (!enabled || !voiceEnabled) return;
        const lang = getLanguage();
        const clip = voiceClips[lang][phaseIndex];
        if (clip) {
            clip.currentTime = 0;
            clip.play().catch(() => {});
        }
    }

    function setEnabled(val) {
        enabled = val;
        if (!val) {
            // Stop any playing voice clips
            ['en', 'hi'].forEach(lang => {
                voiceClips[lang].forEach(clip => {
                    if (clip) { clip.pause(); clip.currentTime = 0; }
                });
            });
        }
    }

    function isEnabled() {
        return enabled;
    }

    function toggleVoice(val) {
        voiceEnabled = val;
    }

    // Resume audio context on user interaction
    function ensureResumed() {
        if (ctx && ctx.state === 'suspended') {
            ctx.resume();
        }
    }

    // Preload voice clips on module load
    preloadVoiceClips();

    return {
        playTick,
        playPhaseTransition,
        playCountdownTick,
        playComplete,
        speakPhase,
        setEnabled,
        isEnabled,
        toggleVoice,
        ensureResumed,
        getContext,
        preloadVoiceClips
    };
})();
