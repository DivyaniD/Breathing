/**
 * Breathing Pattern Library - All 8 evidence-based patterns
 * Each pattern defines timing (inhale-hold-exhale-hold2 in seconds),
 * metadata, and localized content.
 */
const PATTERNS = [
    {
        id: '4-7-8',
        timing: [4, 7, 8, 0],
        accent: '#4A90D9',
        en: {
            name: '4-7-8 Breathing',
            subtitle: 'Relaxation & Sleep',
            bestFor: 'Insomnia, anxiety, pre-sleep routine, panic attacks',
            research: "Dr. Andrew Weil's adaptation of pranayama; increases heart rate variability (HRV).",
            mechanism: [
                'Extended exhale (8 sec) activates parasympathetic nervous system',
                '7-second hold increases CO2 tolerance, deepening relaxation response',
                'Ratio favors exhale, signaling safety to vagus nerve',
                'Stimulates GABA production, natural anti-anxiety neurotransmitter'
            ],
            tags: ['Sleep', 'Anxiety', 'Relaxation', 'Panic Relief']
        },
        hi: {
            name: '4-7-8 श्वास',
            subtitle: 'विश्राम और नींद',
            bestFor: 'अनिद्रा, चिंता, सोने से पहले की दिनचर्या, पैनिक अटैक',
            research: 'डॉ. एंड्रयू वेइल का प्राणायाम रूपांतरण; हृदय गति परिवर्तनशीलता (HRV) बढ़ाता है।',
            mechanism: [
                'लंबी साँस छोड़ना (8 सेकंड) पैरासिम्पेथेटिक नर्वस सिस्टम को सक्रिय करता है',
                '7-सेकंड रोकना CO2 सहनशीलता बढ़ाता है, विश्राम प्रतिक्रिया को गहरा करता है',
                'अनुपात साँस छोड़ने के पक्ष में, वेगस तंत्रिका को सुरक्षा का संकेत देता है',
                'GABA उत्पादन को उत्तेजित करता है, प्राकृतिक चिंता-विरोधी न्यूरोट्रांसमीटर'
            ],
            tags: ['नींद', 'चिंता', 'विश्राम', 'पैनिक से राहत']
        }
    },
    {
        id: '4-4-4-4',
        timing: [4, 4, 4, 4],
        accent: '#50B86C',
        en: {
            name: '4-4-4-4 Box Breathing',
            subtitle: 'Focus & Balance',
            bestFor: 'Pre-performance, tactical situations, maintaining calm focus, PTSD management',
            research: 'Used in military training (Navy SEALs); improves cognitive performance under stress.',
            mechanism: [
                'Equal ratios create autonomic balance (neither activation nor suppression)',
                'Consistent pattern entrains heart rhythm, stabilizing HRV',
                'Navy SEALs use for stress inoculation and mental clarity',
                'Optimizes oxygen-CO2 exchange without hyperventilation'
            ],
            tags: ['Focus', 'Military', 'Balance', 'PTSD']
        },
        hi: {
            name: '4-4-4-4 बॉक्स ब्रीदिंग',
            subtitle: 'फोकस और संतुलन',
            bestFor: 'प्रदर्शन से पहले, सामरिक स्थितियाँ, शांत फोकस बनाए रखना, PTSD प्रबंधन',
            research: 'सैन्य प्रशिक्षण (नेवी सील्स) में उपयोग; तनाव में संज्ञानात्मक प्रदर्शन सुधारता है।',
            mechanism: [
                'समान अनुपात स्वायत्त संतुलन बनाता है (न सक्रियण न दमन)',
                'सुसंगत पैटर्न हृदय ताल को प्रशिक्षित करता है, HRV को स्थिर करता है',
                'नेवी सील्स तनाव टीकाकरण और मानसिक स्पष्टता के लिए उपयोग करते हैं',
                'हाइपरवेंटिलेशन के बिना ऑक्सीजन-CO2 विनिमय को अनुकूलित करता है'
            ],
            tags: ['फोकस', 'सैन्य', 'संतुलन', 'PTSD']
        }
    },
    {
        id: '6-2-6-2',
        timing: [6, 2, 6, 2],
        accent: '#D4A843',
        en: {
            name: '6-2-6-2 Breathing',
            subtitle: 'Quick Reset & Energizing',
            bestFor: 'Midday energy dip, quick stress reset, maintaining alertness, work breaks',
            research: 'Resonance frequency breathing shown to maximize HRV; 5-6 breaths per minute optimal.',
            mechanism: [
                'Shorter holds (2 sec) prevent CO2 buildup that causes drowsiness',
                'Equal inhale/exhale maintains balance while allowing faster cycling',
                '6-second phases align with optimal resonance frequency (~5 breaths/min)',
                'Brief holds maintain some vagal tone without sedation'
            ],
            tags: ['Energy', 'Quick Reset', 'Alertness', 'Work Break']
        },
        hi: {
            name: '6-2-6-2 श्वास',
            subtitle: 'त्वरित रीसेट और ऊर्जा',
            bestFor: 'दोपहर की ऊर्जा गिरावट, त्वरित तनाव रीसेट, सतर्कता बनाए रखना, काम के ब्रेक',
            research: 'रेज़ोनेंस फ्रीक्वेंसी ब्रीदिंग HRV को अधिकतम करती है; 5-6 श्वास प्रति मिनट इष्टतम।',
            mechanism: [
                'छोटे रोक (2 सेकंड) CO2 संचय को रोकते हैं जो उनींदापन का कारण बनता है',
                'समान साँस लेना/छोड़ना तेज़ चक्रण की अनुमति देते हुए संतुलन बनाए रखता है',
                '6-सेकंड चरण इष्टतम रेज़ोनेंस फ्रीक्वेंसी (~5 श्वास/मिनट) के साथ संरेखित होते हैं',
                'संक्षिप्त रोक बेहोश करने के बिना कुछ वेगल टोन बनाए रखते हैं'
            ],
            tags: ['ऊर्जा', 'त्वरित रीसेट', 'सतर्कता', 'काम का ब्रेक']
        }
    },
    {
        id: '5-5-5-5',
        timing: [5, 5, 5, 5],
        accent: '#9B6DD7',
        en: {
            name: '5-5-5-5 Breathing',
            subtitle: 'Coherence & Heart-Brain Sync',
            bestFor: 'Emotional regulation, decision-making, chronic stress, building resilience',
            research: "HeartMath Institute's coherence research; improves emotional regulation.",
            mechanism: [
                'Creates cardiovascular coherence (smooth, sine-wave HRV pattern)',
                'Synchronizes heart rhythm, respiration, and blood pressure oscillations',
                '5-second intervals = 6 breaths/minute (therapeutic zone)',
                'Enhances prefrontal cortex regulation of limbic system'
            ],
            tags: ['Coherence', 'Emotional', 'Resilience', 'Decision-Making']
        },
        hi: {
            name: '5-5-5-5 श्वास',
            subtitle: 'सामंजस्य और हृदय-मस्तिष्क सिंक',
            bestFor: 'भावनात्मक नियमन, निर्णय लेना, पुराना तनाव, लचीलापन बनाना',
            research: 'हार्टमैथ इंस्टीट्यूट का सामंजस्य अनुसंधान; भावनात्मक नियमन में सुधार करता है।',
            mechanism: [
                'कार्डियोवैस्कुलर सामंजस्य बनाता है (चिकनी, साइन-वेव HRV पैटर्न)',
                'हृदय ताल, श्वसन, और रक्तचाप दोलनों को सिंक्रनाइज़ करता है',
                '5-सेकंड अंतराल = 6 श्वास/मिनट (चिकित्सीय क्षेत्र)',
                'लिम्बिक सिस्टम के प्रीफ्रंटल कॉर्टेक्स नियमन को बढ़ाता है'
            ],
            tags: ['सामंजस्य', 'भावनात्मक', 'लचीलापन', 'निर्णय']
        }
    },
    {
        id: '4-4-6-2',
        timing: [4, 4, 6, 2],
        accent: '#5AAFB8',
        en: {
            name: '4-4-6-2 Breathing',
            subtitle: 'Extended Exhale - Gentle Calming',
            bestFor: 'Beginners, mild anxiety, gentle wind-down, accessible calming',
            research: 'Modified coherence breathing; safer for those with breath-holding anxiety.',
            mechanism: [
                'Longer exhale (6 sec) without extreme hold duration',
                '2-second retention prevents hyperventilation between cycles',
                'Gradual activation of parasympathetic without intense CO2 response',
                'Gentler than 4-7-8 for breathing exercise beginners'
            ],
            tags: ['Beginner', 'Gentle', 'Calming', 'Accessible']
        },
        hi: {
            name: '4-4-6-2 श्वास',
            subtitle: 'विस्तारित साँस छोड़ना - हल्की शांति',
            bestFor: 'शुरुआती, हल्की चिंता, धीरे-धीरे शांत होना, सुलभ शांति',
            research: 'संशोधित सामंजस्य श्वास; साँस रोकने की चिंता वालों के लिए सुरक्षित।',
            mechanism: [
                'अत्यधिक रोक अवधि के बिना लंबी साँस छोड़ना (6 सेकंड)',
                '2-सेकंड प्रतिधारण चक्रों के बीच हाइपरवेंटिलेशन को रोकता है',
                'तीव्र CO2 प्रतिक्रिया के बिना पैरासिम्पेथेटिक का क्रमिक सक्रियण',
                'श्वास व्यायाम शुरुआती के लिए 4-7-8 से अधिक कोमल'
            ],
            tags: ['शुरुआती', 'कोमल', 'शांति', 'सुलभ']
        }
    },
    {
        id: '3-12-6-0',
        timing: [3, 12, 6, 0],
        accent: '#D94A6B',
        warning: true,
        en: {
            name: '3-12-6-0 Breathing',
            subtitle: 'Deep Parasympathetic Activation',
            bestFor: 'Severe anxiety, insomnia, trauma response, deep meditation',
            research: 'Advanced pranayama adaptation; powerful vagal brake activation.',
            mechanism: [
                'Very long hold (12 sec) maximizes CO2 retention',
                'Triggers strong dive reflex and vagal response',
                'Extended exhale (6 sec) compounds parasympathetic effect',
                'No post-exhale hold allows immediate cycle restart'
            ],
            warningText: 'Not for beginners or those with respiratory issues.',
            tags: ['Advanced', 'Deep Calm', 'Meditation', 'Trauma']
        },
        hi: {
            name: '3-12-6-0 श्वास',
            subtitle: 'गहरा पैरासिम्पेथेटिक सक्रियण',
            bestFor: 'गंभीर चिंता, अनिद्रा, आघात प्रतिक्रिया, गहरा ध्यान',
            research: 'उन्नत प्राणायाम रूपांतरण; शक्तिशाली वेगल ब्रेक सक्रियण।',
            mechanism: [
                'बहुत लंबा रोक (12 सेकंड) CO2 प्रतिधारण को अधिकतम करता है',
                'मजबूत डाइव रिफ्लेक्स और वेगल प्रतिक्रिया को ट्रिगर करता है',
                'विस्तारित साँस छोड़ना (6 सेकंड) पैरासिम्पेथेटिक प्रभाव को मिश्रित करता है',
                'साँस छोड़ने के बाद कोई रोक नहीं, तुरंत चक्र पुनरारंभ की अनुमति देता है'
            ],
            warningText: 'शुरुआती या श्वसन संबंधी समस्याओं वालों के लिए नहीं।',
            tags: ['उन्नत', 'गहरी शांति', 'ध्यान', 'आघात']
        }
    },
    {
        id: '4-0-4-0',
        timing: [4, 0, 4, 0],
        accent: '#6BBF8A',
        en: {
            name: '4-0-4-0 Coherent Breathing',
            subtitle: 'Pure Coherent Breathing',
            bestFor: 'Meditation, breath-holding anxiety, COPD patients (modified), continuous practice',
            research: 'Coherent breathing research by Dr. Stephen Elliott; safest pattern.',
            mechanism: [
                'No holds = continuous, smooth breathing',
                '4 seconds each = 7.5 breaths/minute (within therapeutic range)',
                'Gentlest method for autonomic balance',
                'No breath-holding stress for those with claustrophobia/panic'
            ],
            tags: ['Meditation', 'Safe', 'Continuous', 'Gentle']
        },
        hi: {
            name: '4-0-4-0 सुसंगत श्वास',
            subtitle: 'शुद्ध सुसंगत श्वास',
            bestFor: 'ध्यान, साँस रोकने की चिंता, COPD रोगी (संशोधित), निरंतर अभ्यास',
            research: 'डॉ. स्टीफन इलियट द्वारा सुसंगत श्वास अनुसंधान; सबसे सुरक्षित पैटर्न।',
            mechanism: [
                'कोई रोक नहीं = निरंतर, चिकनी श्वास',
                '4 सेकंड प्रत्येक = 7.5 श्वास/मिनट (चिकित्सीय सीमा के भीतर)',
                'स्वायत्त संतुलन के लिए सबसे कोमल विधि',
                'क्लॉस्ट्रोफोबिया/पैनिक वालों के लिए साँस रोकने का कोई तनाव नहीं'
            ],
            tags: ['ध्यान', 'सुरक्षित', 'निरंतर', 'कोमल']
        }
    },
    {
        id: '6-0-6-0',
        timing: [6, 0, 6, 0],
        accent: '#7B8FD4',
        en: {
            name: '6-0-6-0 Resonance Breathing',
            subtitle: 'Resonance Breathing',
            bestFor: 'HRV training, biofeedback practice, autonomic optimization, long sessions',
            research: 'Gold standard for HRV biofeedback; most researched pattern.',
            mechanism: [
                '5 breaths/minute = optimal resonance frequency for most adults',
                'Maximizes respiratory sinus arrhythmia (RSA)',
                'No cognitive load from counting holds',
                'Entrains baroreflex sensitivity'
            ],
            tags: ['HRV', 'Biofeedback', 'Resonance', 'Advanced']
        },
        hi: {
            name: '6-0-6-0 रेज़ोनेंस श्वास',
            subtitle: 'रेज़ोनेंस श्वास',
            bestFor: 'HRV प्रशिक्षण, बायोफीडबैक अभ्यास, स्वायत्त अनुकूलन, लंबे सत्र',
            research: 'HRV बायोफीडबैक के लिए स्वर्ण मानक; सबसे शोधित पैटर्न।',
            mechanism: [
                '5 श्वास/मिनट = अधिकांश वयस्कों के लिए इष्टतम रेज़ोनेंस फ्रीक्वेंसी',
                'रेस्पिरेटरी साइनस एरिथमिया (RSA) को अधिकतम करता है',
                'रोक गिनने से कोई संज्ञानात्मक भार नहीं',
                'बैरोरिफ्लेक्स संवेदनशीलता को प्रशिक्षित करता है'
            ],
            tags: ['HRV', 'बायोफीडबैक', 'रेज़ोनेंस', 'उन्नत']
        }
    }
];

// Phase names for labels
const PHASE_NAMES = {
    en: ['Inhale', 'Hold', 'Exhale', 'Hold'],
    hi: ['सांस लें', 'रोकें', 'सांस छोड़ें', 'रोकें']
};

// Phase colors (inhale, hold, exhale, hold2)
const PHASE_COLORS = ['#4A90D9', '#50B86C', '#9B6DD7', '#D4A843'];
