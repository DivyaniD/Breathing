/**
 * App Controller - Main application logic
 * Handles screen navigation, UI events, pattern selection, and session lifecycle
 */
const App = (() => {
    // State
    let selectedPattern = null;
    let selectedDuration = 300; // 5 minutes default
    let selectedVisual = 'circle';
    let soundEnabled = true;

    // Screen refs
    let screens = {};
    let currentScreen = 'pattern-select';

    function init() {
        // Cache screen elements
        screens = {
            'pattern-select': document.getElementById('pattern-select-screen'),
            'setup': document.getElementById('setup-screen'),
            'session': document.getElementById('session-screen'),
            'complete': document.getElementById('complete-screen')
        };

        // Initialize modules
        Visualizer.init();
        Session.init();

        // Build pattern cards
        buildPatternGrid();

        // Bind events
        bindEvents();

        // Apply initial language
        applyLanguage();

        // Show pattern select screen
        showScreen('pattern-select');
    }

    function showScreen(name) {
        Object.values(screens).forEach(s => s.classList.remove('active'));
        screens[name].classList.add('active');
        currentScreen = name;

        // Hide/show header in session mode
        const header = document.querySelector('.header');
        if (name === 'session') {
            header.style.display = 'none';
        } else {
            header.style.display = '';
        }
    }

    // === Pattern Grid ===
    function buildPatternGrid() {
        const grid = document.getElementById('pattern-grid');
        grid.innerHTML = '';

        PATTERNS.forEach(pat => {
            const lang = getLanguage();
            const data = pat[lang] || pat.en;
            const card = document.createElement('div');
            card.className = 'pattern-card';
            card.style.setProperty('--card-accent', pat.accent);
            card.dataset.patternId = pat.id;

            const timingStr = pat.timing.join('-');
            const tagsHTML = data.tags.map(tag =>
                `<span class="card-tag">${tag}</span>`
            ).join('');

            card.innerHTML = `
                <div class="card-header">
                    <span class="card-pattern-name">${data.name}</span>
                    <span class="card-timing-badge" style="color:${pat.accent};background:${pat.accent}15">${timingStr}</span>
                </div>
                <p class="card-subtitle">${data.subtitle}</p>
                <div class="card-tags">${tagsHTML}</div>
            `;

            card.addEventListener('click', () => selectPattern(pat));
            grid.appendChild(card);
        });
    }

    // === Pattern Selection ===
    function selectPattern(pat) {
        selectedPattern = pat;
        populateSetupScreen(pat);
        showScreen('setup');
    }

    function populateSetupScreen(pat) {
        const lang = getLanguage();
        const data = pat[lang] || pat.en;

        document.getElementById('setup-pattern-title').textContent = data.name;
        document.getElementById('setup-pattern-subtitle').textContent = data.subtitle;

        // Timing display
        const phaseNames = PHASE_NAMES[lang];
        const timingHTML = pat.timing.map((sec, i) => {
            if (sec === 0) return '';
            return `<span class="timing-phase">
                <span class="dot" style="background:${PHASE_COLORS[i]}"></span>
                ${phaseNames[i]} ${sec}s
            </span>`;
        }).filter(Boolean).join('');
        document.getElementById('setup-timing-display').innerHTML = timingHTML;

        // Mechanism
        const mechList = document.getElementById('setup-mechanism');
        mechList.innerHTML = data.mechanism.map(m => `<li>${m}</li>`).join('');

        // Best for
        document.getElementById('setup-bestfor').textContent = data.bestFor;

        // Research
        document.getElementById('setup-research').textContent = data.research;

        // Warning
        const warningBox = document.getElementById('setup-warning');
        if (pat.warning && data.warningText) {
            warningBox.style.display = 'flex';
            document.getElementById('setup-warning-text').textContent = data.warningText;
        } else {
            warningBox.style.display = 'none';
        }
    }

    // === Event Binding ===
    function bindEvents() {
        // Back button
        document.getElementById('btn-back-to-patterns').addEventListener('click', () => {
            showScreen('pattern-select');
        });

        // Duration buttons
        document.querySelectorAll('.duration-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.duration-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                selectedDuration = parseInt(btn.dataset.duration);
            });
        });

        // Visual style buttons
        document.querySelectorAll('.visual-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.visual-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                selectedVisual = btn.dataset.visual;
            });
        });

        // Start button
        document.getElementById('btn-start').addEventListener('click', startSession);

        // Stop button
        document.getElementById('btn-stop').addEventListener('click', stopSession);

        // Complete screen buttons
        document.getElementById('btn-restart').addEventListener('click', () => {
            startSession();
        });
        document.getElementById('btn-new-pattern').addEventListener('click', () => {
            showScreen('pattern-select');
        });

        // Language toggle
        document.getElementById('lang-toggle').addEventListener('click', toggleLanguage);

        // Sound toggle
        document.getElementById('sound-toggle').addEventListener('click', toggleSound);

        // Keyboard shortcuts
        document.addEventListener('keydown', handleKeyboard);
    }

    // === Session Lifecycle ===
    function startSession() {
        if (!selectedPattern) return;

        AudioEngine.ensureResumed();
        Visualizer.setMode(selectedVisual);
        Visualizer.reset();
        showScreen('session');

        // Preparation countdown (3 seconds)
        runCountdown(3, () => {
            Session.start(selectedPattern, selectedDuration, onSessionComplete);
        });
    }

    function runCountdown(seconds, callback) {
        const overlay = document.createElement('div');
        overlay.className = 'prep-overlay';
        overlay.innerHTML = `
            <div class="prep-count">${seconds}</div>
            <div class="prep-text">${t('prepText')}</div>
        `;
        document.body.appendChild(overlay);

        let count = seconds;
        const countEl = overlay.querySelector('.prep-count');

        AudioEngine.playCountdownTick();

        const interval = setInterval(() => {
            count--;
            if (count > 0) {
                countEl.textContent = count;
                countEl.style.animation = 'none';
                // Force reflow
                countEl.offsetHeight;
                countEl.style.animation = 'fade-in 0.3s ease';
                AudioEngine.playCountdownTick();
            } else {
                clearInterval(interval);
                overlay.remove();
                callback();
            }
        }, 1000);
    }

    function stopSession() {
        Session.stop();
        showScreen('pattern-select');
    }

    function onSessionComplete(stats) {
        document.getElementById('stat-duration').textContent = Session.formatTime(stats.duration);
        document.getElementById('stat-cycles').textContent = stats.cycles;
        document.getElementById('stat-pattern').textContent = stats.patternId;
        showScreen('complete');
    }

    // === Language ===
    function toggleLanguage() {
        const newLang = getLanguage() === 'en' ? 'hi' : 'en';
        setLanguage(newLang);
        applyLanguage();
        buildPatternGrid();
        if (selectedPattern) {
            populateSetupScreen(selectedPattern);
        }
    }

    function applyLanguage() {
        const lang = getLanguage();
        document.getElementById('lang-label').textContent = lang === 'en' ? 'EN' : 'हि';
        document.getElementById('app-title').textContent = t('appTitle');
        document.getElementById('choose-pattern-title').textContent = t('choosePattern');
        document.getElementById('choose-pattern-subtitle').textContent = t('choosePatternSub');
        document.getElementById('back-label').textContent = t('back');
        document.getElementById('mechanism-title').textContent = t('howItWorks');
        document.getElementById('bestfor-title').textContent = t('bestFor');
        document.getElementById('research-title').textContent = t('researchBasis');
        document.getElementById('duration-label').textContent = t('sessionDuration');
        document.getElementById('visual-style-label').textContent = t('visualStyle');
        document.getElementById('visual-circle-label').textContent = t('circle');
        document.getElementById('visual-shape-label').textContent = t('shape');
        document.getElementById('visual-bar-label').textContent = t('bar');
        document.getElementById('start-label').textContent = t('startSession');
        document.getElementById('cycle-label-text').textContent = t('cycle');
        document.getElementById('complete-title').textContent = t('sessionComplete');
        document.getElementById('stat-duration-label').textContent = t('duration');
        document.getElementById('stat-cycles-label').textContent = t('cycles');
        document.getElementById('stat-pattern-label').textContent = t('pattern');
        document.getElementById('restart-label').textContent = t('repeatSession');
        document.getElementById('new-pattern-label').textContent = t('chooseAnother');

        // Phase bar labels
        document.getElementById('phase-seg-inhale-label').textContent = t('inhale');
        document.getElementById('phase-seg-hold-label').textContent = t('hold');
        document.getElementById('phase-seg-exhale-label').textContent = t('exhale');
        document.getElementById('phase-seg-hold2-label').textContent = t('hold');

        // Duration button labels
        const durationKeys = ['1min', '3min', '5min', '10min', '15min', '20min'];
        document.querySelectorAll('.duration-btn').forEach((btn, i) => {
            if (durationKeys[i]) {
                btn.textContent = t(durationKeys[i]);
            }
        });
    }

    // === Sound ===
    function toggleSound() {
        soundEnabled = !soundEnabled;
        AudioEngine.setEnabled(soundEnabled);
        const btn = document.getElementById('sound-toggle');
        btn.classList.toggle('muted', !soundEnabled);
    }

    // === Keyboard ===
    function handleKeyboard(e) {
        if (e.key === 'Escape') {
            if (currentScreen === 'session') {
                stopSession();
            } else if (currentScreen === 'setup') {
                showScreen('pattern-select');
            }
        }
        if (e.key === ' ' && currentScreen === 'setup') {
            e.preventDefault();
            startSession();
        }
    }

    // Boot
    document.addEventListener('DOMContentLoaded', init);

    return {
        init,
        showScreen,
        getSelectedPattern: () => selectedPattern,
        getSelectedDuration: () => selectedDuration
    };
})();
