/**
 * Internationalization (i18n) module
 * Supports English and Hindi with voice cue text
 */
const I18N = {
    en: {
        appTitle: 'Breathing Metronome',
        choosePattern: 'Choose Your Breathing Pattern',
        choosePatternSub: 'Evidence-based techniques for focus, calm, and resilience',
        back: 'Back',
        howItWorks: 'How It Works',
        bestFor: 'Best For',
        researchBasis: 'Research Basis',
        sessionDuration: 'Session Duration',
        visualStyle: 'Visual Style',
        circle: 'Circle',
        shape: 'Shape',
        bar: 'Bar',
        startSession: 'Start Session',
        getReady: 'Get Ready',
        inhale: 'Inhale',
        hold: 'Hold',
        exhale: 'Exhale',
        cycle: 'Cycle',
        sessionComplete: 'Session Complete',
        duration: 'Duration',
        cycles: 'Cycles',
        pattern: 'Pattern',
        repeatSession: 'Repeat Session',
        chooseAnother: 'Choose Another Pattern',
        langLabel: 'EN',
        prepText: 'Find a comfortable position...',
        // Duration labels
        '1min': '1 min',
        '3min': '3 min',
        '5min': '5 min',
        '10min': '10 min',
        '15min': '15 min',
        '20min': '20 min',
        // Voice cues
        voiceInhale: 'Breathe in',
        voiceHold: 'Hold',
        voiceExhale: 'Breathe out',
    },
    hi: {
        appTitle: 'ब्रीदिंग मेट्रोनोम',
        choosePattern: 'अपना श्वास पैटर्न चुनें',
        choosePatternSub: 'फोकस, शांति और लचीलेपन के लिए विज्ञान-आधारित तकनीकें',
        back: 'वापस',
        howItWorks: 'यह कैसे काम करता है',
        bestFor: 'किसके लिए सर्वोत्तम',
        researchBasis: 'शोध आधार',
        sessionDuration: 'सत्र अवधि',
        visualStyle: 'विज़ुअल शैली',
        circle: 'वृत्त',
        shape: 'आकार',
        bar: 'बार',
        startSession: 'सत्र शुरू करें',
        getReady: 'तैयार हो जाइए',
        inhale: 'सांस लें',
        hold: 'रोकें',
        exhale: 'सांस छोड़ें',
        cycle: 'चक्र',
        sessionComplete: 'सत्र पूरा हुआ',
        duration: 'अवधि',
        cycles: 'चक्र',
        pattern: 'पैटर्न',
        repeatSession: 'सत्र दोहराएं',
        chooseAnother: 'दूसरा पैटर्न चुनें',
        langLabel: 'हि',
        prepText: 'आरामदायक स्थिति में बैठें...',
        // Duration labels
        '1min': '1 मिनट',
        '3min': '3 मिनट',
        '5min': '5 मिनट',
        '10min': '10 मिनट',
        '15min': '15 मिनट',
        '20min': '20 मिनट',
        // Voice cues (for TTS)
        voiceInhale: 'सांस लें',
        voiceHold: 'रोकें',
        voiceExhale: 'सांस छोड़ें',
    }
};

let currentLang = 'en';

function t(key) {
    return I18N[currentLang][key] || I18N['en'][key] || key;
}

function setLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang === 'hi' ? 'hi' : 'en';
}

function getLanguage() {
    return currentLang;
}
