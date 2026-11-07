/**
 * Maktabah Maftoohah — Korpus Al-Quran
 * Pengurus Data & Storan Tempatan (Data Store Engine)
 */

class CorpusStore {
  constructor() {
    this.cache = {
      surahs: null,
      rootsIndex: null,
      fullRoots: null,
      morphology: new Map(),
      arabic: new Map(),
      basmeih: null,
      sahih: null
    };
  }

  async fetchSurahs() {
    if (this.cache.surahs) return this.cache.surahs;
    const res = await fetch('./data/surahs.json');
    if (!res.ok) throw new Error(`Gagal memuatkan surahs.json: ${res.status}`);
    this.cache.surahs = await res.json();
    return this.cache.surahs;
  }

  async fetchRootsIndex() {
    if (this.cache.rootsIndex) return this.cache.rootsIndex;
    const res = await fetch('./data/roots-index.json');
    if (!res.ok) throw new Error(`Gagal memuatkan roots-index.json: ${res.status}`);
    this.cache.rootsIndex = await res.json();
    return this.cache.rootsIndex;
  }

  async fetchFullRoots() {
    if (this.cache.fullRoots) return this.cache.fullRoots;
    const res = await fetch('./data/roots.json');
    if (!res.ok) throw new Error(`Gagal memuatkan roots.json: ${res.status}`);
    this.cache.fullRoots = await res.json();
    return this.cache.fullRoots;
  }

  async fetchMorphology(surahNum) {
    const s = Number(surahNum);
    if (this.cache.morphology.has(s)) return this.cache.morphology.get(s);
    const res = await fetch(`./data/morphology/${s}.json`);
    if (!res.ok) throw new Error(`Gagal memuatkan data morfologi surah ${s}`);
    const data = await res.json();
    this.cache.morphology.set(s, data);
    return data;
  }

  async fetchArabicSurah(surahNum) {
    const s = Number(surahNum);
    if (this.cache.arabic.has(s)) return this.cache.arabic.get(s);
    const res = await fetch(`./data/arabic/${s}.json`);
    if (!res.ok) return null;
    const data = await res.json();
    this.cache.arabic.set(s, data);
    return data;
  }

  async fetchBasmeih() {
    if (this.cache.basmeih) return this.cache.basmeih;
    try {
      const res = await fetch('./data/translations/ms/basmeih.json');
      if (res.ok) {
        this.cache.basmeih = await res.json();
      }
    } catch {
      this.cache.basmeih = {};
    }
    return this.cache.basmeih || {};
  }

  async fetchSahih() {
    if (this.cache.sahih) return this.cache.sahih;
    try {
      const res = await fetch('./data/translations/en/sahih.json');
      if (res.ok) {
        this.cache.sahih = await res.json();
      }
    } catch {
      this.cache.sahih = {};
    }
    return this.cache.sahih || {};
  }

  async fetchTranslation(lang = 'ms') {
    if (lang === 'en') {
      return this.fetchSahih();
    }
    return this.fetchBasmeih();
  }

  async getWordToken(surahNum, ayahNum, wordPos) {
    const morph = await this.fetchMorphology(surahNum);
    const ayahTokens = morph.ayahs?.[String(ayahNum)] || [];
    const token = ayahTokens.find(t => t.pos === Number(wordPos));
    return token || null;
  }

  async getRootDetails(rootStr) {
    const fullRoots = await this.fetchFullRoots();
    const cleanSearch = (rootStr || '').replace(/\s+/g, '');
    return fullRoots.find(r => r.root_clean === cleanSearch || r.root === rootStr) || null;
  }
}

export const corpusStore = new CorpusStore();
