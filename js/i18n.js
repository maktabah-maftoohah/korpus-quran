/**
 * Maktabah Maftoohah — Korpus Al-Quran
 * Terjemahan & Penyetempatan Bahasa (Localization)
 */

export const translations = {
  ms: {
    siteTitle: "Maktabah Maftoohah — Korpus Al-Quran",
    brandTitle: "Korpus Al-Quran",
    navHome: "Laman Utama",
    navRoots: "Mu'jam Akar Kata",
    navWord: "Analisis Kata & I'rab",
    navSurah: "Daftar Surah",
    searchPlaceholder: "Cari akar kata (cth: ر ح م), kalimah Arab, terjemahan, atau jump (cth: 1:1:1)...",
    searchBtn: "Cari",
    heroTitle: "Korpus Al-Quran",
    heroSubtitle: "Analisis sintaksis, tatabahasa Arab, morfologi, I'rab, dan mu'jam akar kata lengkap.",
    statRoots: "Akar Kata Unik",
    statTokens: "Kalimah Dianalisis",
    statSurahs: "Surah Lengkap",
    statAyahs: "Ayat Al-Quran",
    viewInQuranApp: "Buka di Maktabah Al-Quran ↗",
    audioPronounce: "Dengar Sebutan",
    rootOccurrences: "Kemunculan dalam Al-Quran",
    rootLemmas: "Bentuk Lema Terbitan",
    grammarAnalysis: "Analisis Tatabahasa & Morfologi",
    posLabel: "Kelas Kata (POS)",
    irabLabel: "Keadaan I'rab & Sintaksis",
    rootLabel: "Kata Dasar (Akar Kata)",
    lemmaLabel: "Lema (Bentuk Dasar)",
    concordanceTitle: "Konkordans Ayat (Senarai Kemunculan)",
    backToRoots: "← Kembali ke Senarai Akar Kata",
    noResults: "Tiada rekod ditemui untuk carian tersebut.",
    footerText: "Maktabah Maftoohah — Korpus Al-Quran Sumber Terbuka."
  },
  en: {
    siteTitle: "Maktabah Maftoohah — Quranic Linguistic Corpus",
    brandTitle: "Quranic Linguistic Corpus",
    navHome: "Home",
    navRoots: "Root Lexicon",
    navWord: "Word Analysis & I'rab",
    navSurah: "Surah List",
    searchPlaceholder: "Search roots (e.g. ر ح م), Arabic word, translation, or jump (e.g. 1:1:1)...",
    searchBtn: "Search",
    heroTitle: "Quranic Linguistic Corpus",
    heroSubtitle: "Comprehensive syntactic, grammatical, morphological, and root lexicon analysis.",
    statRoots: "Unique Roots",
    statTokens: "Word Tokens",
    statSurahs: "Complete Surahs",
    statAyahs: "Quranic Verses",
    viewInQuranApp: "Open in Maktabah Al-Quran ↗",
    audioPronounce: "Listen Pronunciation",
    rootOccurrences: "Occurrences in Quran",
    rootLemmas: "Derived Lemmas",
    grammarAnalysis: "Grammar & Morphology Breakdown",
    posLabel: "Part of Speech (POS)",
    irabLabel: "Grammatical Case & Syntax",
    rootLabel: "Root Word (Al-Jidhr)",
    lemmaLabel: "Lemma (Base Form)",
    concordanceTitle: "Verse Concordance (Occurrences List)",
    backToRoots: "← Back to Root Lexicon",
    noResults: "No records found for that search query.",
    footerText: "Maktabah Maftoohah — Open Source Quranic Linguistic Corpus."
  }
};

class I18nEngine {
  constructor() {
    this.lang = localStorage.getItem('mm_korpus_lang') || 'ms';
  }

  get currentLang() {
    return this.lang;
  }

  setLang(lang) {
    if (translations[lang]) {
      this.lang = lang;
      localStorage.setItem('mm_korpus_lang', lang);
      document.documentElement.lang = lang;
    }
  }

  t(key) {
    return translations[this.lang]?.[key] || translations.ms[key] || key;
  }
}

export const i18n = new I18nEngine();
