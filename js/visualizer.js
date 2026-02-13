/**
 * Visualizer module - Handles all visual feedback for breathing phases
 * Supports three modes: circle (progress arc), shape (expanding/contracting), bar
 */
const Visualizer = (() => {
    let mode = 'circle'; // 'circle' | 'shape' | 'bar'
    let animFrameId = null;

    const CIRCUMFERENCE = 2 * Math.PI * 120; // r=120

    // DOM refs (cached on init)
    let els = {};

    function init() {
        els = {
            progressArc: document.getElementById('progress-arc'),
            innerShape: document.getElementById('inner-shape'),
            visCircle: document.getElementById('vis-circle'),
            visBar: document.getElementById('vis-bar'),
            barFill: document.getElementById('bar-fill'),
            phaseLabel: document.getElementById('phase-label'),
            phaseCountdown: document.getElementById('phase-countdown'),
            patternDisplay: document.getElementById('session-pattern-display'),
            container: document.getElementById('visual-container'),
            visualArea: document.querySelector('.session-visual-area'),
            // Phase bar segments
            segInhale: document.getElementById('phase-seg-inhale'),
            segHold: document.getElementById('phase-seg-hold'),
            segExhale: document.getElementById('phase-seg-exhale'),
            segHold2: document.getElementById('phase-seg-hold2'),
        };
    }

    function setMode(m) {
        mode = m;
        if (!els.visCircle) return;
        if (m === 'bar') {
            els.visCircle.style.display = 'none';
            els.visBar.style.display = 'block';
        } else {
            els.visCircle.style.display = 'block';
            els.visBar.style.display = 'none';
        }
    }

    /**
     * Update the visualization for the current phase
     * @param {number} phaseIndex - 0=inhale, 1=hold, 2=exhale, 3=hold2
     * @param {number} progress - 0 to 1 within the current phase
     * @param {number} secondsLeft - integer seconds remaining in phase
     * @param {number[]} timing - the pattern timing array
     */
    function update(phaseIndex, progress, secondsLeft, timing) {
        const color = PHASE_COLORS[phaseIndex];
        const phaseNames = PHASE_NAMES[getLanguage()];

        // Update text
        els.phaseLabel.textContent = phaseNames[phaseIndex];
        els.phaseLabel.style.color = color;
        els.phaseCountdown.textContent = Math.ceil(secondsLeft);
        els.phaseCountdown.style.color = color;

        // Update phase bar
        updatePhaseBar(phaseIndex, timing);

        // Update glow
        if (els.visualArea) {
            els.visualArea.style.setProperty('--glow-color', color.replace(')', ', 0.1)').replace('rgb', 'rgba'));
        }

        if (mode === 'circle') {
            updateCircle(phaseIndex, progress, color);
        } else if (mode === 'shape') {
            updateShape(phaseIndex, progress, color);
        } else if (mode === 'bar') {
            updateBar(phaseIndex, progress, color);
        }
    }

    function updateCircle(phaseIndex, progress, color) {
        // Progress arc: fill based on progress through current phase
        const offset = CIRCUMFERENCE * (1 - progress);
        els.progressArc.setAttribute('stroke-dashoffset', offset);
        els.progressArc.setAttribute('stroke', color);

        // Hide inner shape in circle mode
        els.innerShape.setAttribute('r', 0);
    }

    function updateShape(phaseIndex, progress, color) {
        // Expanding/contracting circle based on breathing phase
        const maxR = 100;
        const minR = 30;
        let r;

        if (phaseIndex === 0) {
            // Inhale: expand
            r = minR + (maxR - minR) * progress;
        } else if (phaseIndex === 1) {
            // Hold after inhale: stay expanded
            r = maxR;
        } else if (phaseIndex === 2) {
            // Exhale: contract
            r = maxR - (maxR - minR) * progress;
        } else {
            // Hold after exhale: stay contracted
            r = minR;
        }

        els.innerShape.setAttribute('r', r);
        els.innerShape.setAttribute('fill', color);
        els.innerShape.setAttribute('opacity', 0.15 + progress * 0.1);

        // Also update arc
        const offset = CIRCUMFERENCE * (1 - progress);
        els.progressArc.setAttribute('stroke-dashoffset', offset);
        els.progressArc.setAttribute('stroke', color);
    }

    function updateBar(phaseIndex, progress, color) {
        let fillPct;

        if (phaseIndex === 0) {
            // Inhale: fill up
            fillPct = progress * 100;
        } else if (phaseIndex === 1) {
            // Hold after inhale: full
            fillPct = 100;
        } else if (phaseIndex === 2) {
            // Exhale: empty
            fillPct = (1 - progress) * 100;
        } else {
            // Hold after exhale: empty
            fillPct = 0;
        }

        els.barFill.style.width = fillPct + '%';
        els.barFill.style.background = color;
    }

    function updatePhaseBar(activePhase, timing) {
        const segs = [els.segInhale, els.segHold, els.segExhale, els.segHold2];
        const total = timing.reduce((a, b) => a + b, 0);

        segs.forEach((seg, i) => {
            seg.classList.remove('active');
            if (timing[i] === 0) {
                seg.classList.add('skip');
            } else {
                seg.classList.remove('skip');
                seg.style.flex = timing[i] / total;
            }
            if (i === activePhase) {
                seg.classList.add('active');
            }
        });
    }

    function setPatternDisplay(text) {
        if (els.patternDisplay) {
            els.patternDisplay.textContent = text;
        }
    }

    function reset() {
        if (els.progressArc) {
            els.progressArc.setAttribute('stroke-dashoffset', CIRCUMFERENCE);
            els.progressArc.setAttribute('stroke', PHASE_COLORS[0]);
        }
        if (els.innerShape) {
            els.innerShape.setAttribute('r', 0);
        }
        if (els.barFill) {
            els.barFill.style.width = '0%';
        }
        if (els.phaseLabel) {
            els.phaseLabel.textContent = t('getReady');
            els.phaseLabel.style.color = '';
        }
        if (els.phaseCountdown) {
            els.phaseCountdown.textContent = '';
            els.phaseCountdown.style.color = '';
        }
    }

    return {
        init,
        setMode,
        update,
        setPatternDisplay,
        reset,
        get mode() { return mode; }
    };
})();
