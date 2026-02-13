/**
 * Session Engine - Core breathing session logic
 * Manages timing, phase transitions, cycle counting, and coordinates audio + visual
 */
const Session = (() => {
    let pattern = null;       // Current pattern object
    let totalDuration = 300;  // Session duration in seconds
    let isRunning = false;
    let isPaused = false;

    // Timing state
    let sessionStartTime = 0;
    let sessionElapsed = 0;
    let phaseIndex = 0;        // 0=inhale, 1=hold, 2=exhale, 3=hold2
    let phaseElapsed = 0;      // Time elapsed in current phase (ms)
    let phaseStartTime = 0;
    let cycleCount = 0;
    let lastTickSecond = -1;
    let animFrameId = null;
    let onCompleteCallback = null;

    // DOM refs
    let elTimerElapsed, elTimerTotal, elCycleCount;

    function init() {
        elTimerElapsed = document.getElementById('timer-elapsed');
        elTimerTotal = document.getElementById('timer-total');
        elCycleCount = document.getElementById('cycle-count');
    }

    /**
     * Start a breathing session
     * @param {Object} pat - pattern from PATTERNS array
     * @param {number} duration - session duration in seconds
     * @param {Function} onComplete - callback when session ends
     */
    function start(pat, duration, onComplete) {
        pattern = pat;
        totalDuration = duration;
        onCompleteCallback = onComplete;
        isRunning = true;
        isPaused = false;
        sessionElapsed = 0;
        phaseIndex = findFirstNonZeroPhase(0);
        phaseElapsed = 0;
        cycleCount = 0;
        lastTickSecond = -1;

        // Update total time display
        elTimerTotal.textContent = formatTime(totalDuration);
        elTimerElapsed.textContent = '0:00';
        elCycleCount.textContent = '0';

        // Set pattern display
        Visualizer.setPatternDisplay(pattern.timing.join('-'));

        // Start the first phase
        phaseStartTime = performance.now();
        sessionStartTime = performance.now();

        // Announce first phase
        AudioEngine.playPhaseTransition(phaseIndex);
        AudioEngine.speakPhase(phaseIndex);

        // Start animation loop
        animFrameId = requestAnimationFrame(tick);
    }

    function stop() {
        isRunning = false;
        if (animFrameId) {
            cancelAnimationFrame(animFrameId);
            animFrameId = null;
        }
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    }

    /**
     * Find next non-zero phase starting from given index
     */
    function findFirstNonZeroPhase(startIdx) {
        let idx = startIdx;
        for (let i = 0; i < 4; i++) {
            if (pattern.timing[idx] > 0) return idx;
            idx = (idx + 1) % 4;
        }
        return 0; // fallback
    }

    /**
     * Get the next non-zero phase index after current
     */
    function nextPhase(currentIdx) {
        let idx = (currentIdx + 1) % 4;
        for (let i = 0; i < 4; i++) {
            if (pattern.timing[idx] > 0) return idx;
            idx = (idx + 1) % 4;
        }
        return 0;
    }

    /**
     * Main animation loop
     */
    function tick(timestamp) {
        if (!isRunning) return;

        const now = performance.now();

        // Update session elapsed
        sessionElapsed = (now - sessionStartTime) / 1000;

        // Check if session is complete
        if (sessionElapsed >= totalDuration) {
            complete();
            return;
        }

        // Update session timer display
        elTimerElapsed.textContent = formatTime(Math.floor(sessionElapsed));

        // Phase timing
        const phaseDuration = pattern.timing[phaseIndex]; // in seconds
        phaseElapsed = (now - phaseStartTime) / 1000;

        // Per-second tick sound
        const currentSecond = Math.floor(phaseElapsed);
        if (currentSecond !== lastTickSecond && currentSecond < phaseDuration) {
            lastTickSecond = currentSecond;
            if (currentSecond > 0) {
                AudioEngine.playTick();
            }
        }

        // Check phase completion
        if (phaseElapsed >= phaseDuration) {
            // Move to next phase
            const prevPhase = phaseIndex;
            phaseIndex = nextPhase(phaseIndex);

            // Count cycle when we return to inhale
            if (phaseIndex === 0 || (phaseIndex <= prevPhase && prevPhase !== 0)) {
                // More precise: count when exhale (or last phase) completes
            }
            // Count cycle at the start of a new inhale
            if (phaseIndex === findFirstNonZeroPhase(0) && prevPhase !== findFirstNonZeroPhase(0)) {
                cycleCount++;
                elCycleCount.textContent = cycleCount;
            }

            phaseStartTime = now;
            phaseElapsed = 0;
            lastTickSecond = -1;

            // Audio cues for new phase
            AudioEngine.playPhaseTransition(phaseIndex);
            AudioEngine.speakPhase(phaseIndex);
        }

        // Calculate phase progress (0 to 1)
        const progress = Math.min(phaseElapsed / phaseDuration, 1);
        const secondsLeft = phaseDuration - phaseElapsed;

        // Update visuals
        Visualizer.update(phaseIndex, progress, secondsLeft, pattern.timing);

        // Continue loop
        animFrameId = requestAnimationFrame(tick);
    }

    function complete() {
        isRunning = false;
        if (animFrameId) {
            cancelAnimationFrame(animFrameId);
            animFrameId = null;
        }
        // Count final partial cycle
        if (phaseIndex !== findFirstNonZeroPhase(0)) {
            cycleCount++;
        }
        AudioEngine.playComplete();
        if (onCompleteCallback) {
            onCompleteCallback({
                duration: totalDuration,
                cycles: cycleCount,
                patternId: pattern.id
            });
        }
    }

    function formatTime(totalSeconds) {
        const mins = Math.floor(totalSeconds / 60);
        const secs = Math.floor(totalSeconds % 60);
        return mins + ':' + String(secs).padStart(2, '0');
    }

    function getState() {
        return {
            isRunning,
            pattern,
            totalDuration,
            sessionElapsed,
            phaseIndex,
            cycleCount
        };
    }

    return {
        init,
        start,
        stop,
        getState,
        formatTime
    };
})();
