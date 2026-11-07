/**
 * Maktabah Maftoohah — Korpus Al-Quran (Bahasa Melayu)
 * Enjin Aplikasi Utama & Penghala (Router & Application Controller)
 */

import { corpusStore } from './store.js';
import { generateGrammarReport } from './grammar.js';
import { i18n } from './i18n.js';

class CorpusApp {
  constructor() {
    this.viewContainer = document.getElementById('appView');
    this.currentRoute = '';
    this.rootsIndex = [];
    this.surahs = [];
  }

  async init() {
    try {
      // Register Service Worker if supported
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js').catch(() => {});
      }

      this.setupHeaderEvents();
      [this.surahs, this.rootsIndex] = await Promise.all([
        corpusStore.fetchSurahs(),
        corpusStore.fetchRootsIndex()
      ]);

      window.addEventListener('hashchange', () => this.handleRouting());
      this.handleRouting();
    } catch (err) {
      console.error('Ralat pemulaan Korpus:', err);
      this.viewContainer.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem;">
          <h2 style="color: var(--accent-rose);">Ralat Memuatkan Data</h2>
          <p style="color: var(--text-secondary); margin-top: 0.5rem;">Sila muat semula halaman ini.</p>
        </div>
      `;
    }
  }

  setupHeaderEvents() {
    const langBtn = document.getElementById('btnLangToggle');
    if (langBtn) {
      langBtn.textContent = i18n.currentLang === 'ms' ? 'EN' : 'MY';
      langBtn.addEventListener('click', () => {
        const nextLang = i18n.currentLang === 'ms' ? 'en' : 'ms';
        i18n.setLang(nextLang);
        langBtn.textContent = nextLang === 'ms' ? 'EN' : 'MY';
        this.updateStaticTranslations();
        this.handleRouting();
      });
    }
  }

  updateStaticTranslations() {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      el.textContent = i18n.t(key);
    });
  }

  updateNavActive(navId) {
    document.querySelectorAll('.nav-item').forEach((item) => {
      if (item.getAttribute('data-nav') === navId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  async handleRouting() {
    const hash = window.location.hash.slice(1).trim() || 'home';
    this.currentRoute = hash;

    if (hash === 'home') {
      this.updateNavActive('home');
      this.renderHome();
    } else if (hash === 'roots') {
      this.updateNavActive('roots');
      this.renderRootsView();
    } else if (hash.startsWith('root/')) {
      this.updateNavActive('roots');
      const rootParam = decodeURIComponent(hash.slice(5));
      this.renderRootDetail(rootParam);
    } else if (hash.startsWith('word/')) {
      this.updateNavActive('');
      const wordRef = hash.slice(5);
      this.renderWordDetail(wordRef);
    } else if (hash === 'surahs') {
      this.updateNavActive('surahs');
      this.renderSurahsList();
    } else if (hash.startsWith('surah/')) {
      this.updateNavActive('surahs');
      const sNum = parseInt(hash.slice(6), 10);
      this.renderSurahExplorer(sNum);
    } else {
      this.renderHome();
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  renderHome() {
    const topRoots = this.rootsIndex.slice(0, 18);
    this.viewContainer.innerHTML = `
      <section class="hero-box">
        <h2>${i18n.t('heroTitle')}</h2>
        <p>${i18n.t('heroSubtitle')}</p>

        <form class="search-wrapper" id="homeSearchForm">
          <input type="text" id="searchInput" class="search-input" placeholder="${i18n.t('searchPlaceholder')}" autocomplete="off">
          <button type="submit" class="btn-search">${i18n.t('searchBtn')}</button>
        </form>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-number">1,651</div>
            <div class="stat-label">${i18n.t('statRoots')}</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">77,429</div>
            <div class="stat-label">${i18n.t('statTokens')}</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">114</div>
            <div class="stat-label">${i18n.t('statSurahs')}</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">6,236</div>
            <div class="stat-label">${i18n.t('statAyahs')}</div>
          </div>
        </div>
      </section>

      <section>
        <div class="section-title-bar">
          <h3 class="section-title">Akar Kata Paling Kerap Digunakan</h3>
          <a href="#roots" class="btn-action" style="font-size: 0.85rem;">Lihat Semua 1,651 Akar Kata &rarr;</a>
        </div>
        <div class="roots-grid">
          ${topRoots.map(r => this.renderRootCardHtml(r)).join('')}
        </div>
      </section>
    `;

    document.getElementById('homeSearchForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const val = document.getElementById('searchInput').value.trim();
      if (!val) return;
      this.processSearchQuery(val);
    });
  }

  renderRootCardHtml(r) {
    const meanings = (r.meanings_ms || []).join(', ') || '—';
    return `
      <a href="#root/${encodeURIComponent(r.root)}" class="root-card">
        <div class="root-ar">${r.root}</div>
        <div class="root-count-badge">${r.count} kemunculan</div>
        <div class="root-meanings" title="${meanings}">"${meanings}"</div>
      </a>
    `;
  }

  processSearchQuery(query) {
    // 1. Direct word jump: 1:1:1 or 2:255
    const jumpMatch = query.match(/^(\d+):(\d+)(?::(\d+))?$/);
    if (jumpMatch) {
      const s = jumpMatch[1];
      const a = jumpMatch[2];
      const p = jumpMatch[3] || '1';
      window.location.hash = `#word/${s}:${a}:${p}`;
      return;
    }

    // 2. Search root in rootsIndex
    const clean = query.replace(/\s+/g, '');
    const foundRoot = this.rootsIndex.find(r => 
      r.root === query || 
      r.root_clean === clean || 
      r.root_norm === clean ||
      (r.meanings_ms && r.meanings_ms.some(m => m.toLowerCase().includes(query.toLowerCase())))
    );

    if (foundRoot) {
      window.location.hash = `#root/${encodeURIComponent(foundRoot.root)}`;
      return;
    }

    // 3. Fallback to roots view with filter
    window.location.hash = `#roots?q=${encodeURIComponent(query)}`;
  }

  renderRootsView() {
    const urlParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
    const initialQuery = urlParams.get('q') || '';

    this.viewContainer.innerHTML = `
      <div class="section-title-bar">
        <div>
          <h2 class="section-title">${i18n.t('navRoots')}</h2>
          <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.25rem;">
            Daftar lengkap 1,651 akar kata Al-Quran dengan makna dan bilangan kemunculan.
          </p>
        </div>
      </div>

      <div class="search-wrapper" style="margin: 0 0 1.5rem 0; max-width: 100%;">
        <input type="text" id="rootFilterInput" class="search-input" placeholder="Tapis akar kata Arab atau makna Bahasa Melayu..." value="${initialQuery}">
      </div>

      <div id="rootsGridTarget" class="roots-grid"></div>
    `;

    const filterInput = document.getElementById('rootFilterInput');
    const target = document.getElementById('rootsGridTarget');

    const updateFilter = () => {
      const q = filterInput.value.trim().toLowerCase();
      const qClean = q.replace(/\s+/g, '');
      const filtered = this.rootsIndex.filter(r => {
        if (!q) return true;
        return (
          r.root.includes(q) ||
          r.root_clean.includes(qClean) ||
          r.root_norm.includes(qClean) ||
          (r.meanings_ms && r.meanings_ms.some(m => m.toLowerCase().includes(q)))
        );
      });

      if (filtered.length === 0) {
        target.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--text-muted);">${i18n.t('noResults')}</div>`;
      } else {
        target.innerHTML = filtered.slice(0, 150).map(r => this.renderRootCardHtml(r)).join('');
      }
    };

    filterInput.addEventListener('input', updateFilter);
    updateFilter();
  }

  async renderRootDetail(rootParam) {
    this.viewContainer.innerHTML = `
      <div style="text-align: center; padding: 3rem 0; color: var(--text-muted);">
        Sedang memuatkan konkordans akar kata...
      </div>
    `;

    const [rootDetail, basmeih] = await Promise.all([
      corpusStore.getRootDetails(rootParam),
      corpusStore.fetchBasmeih()
    ]);

    if (!rootDetail) {
      this.viewContainer.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem;">
          <h2 style="color: var(--accent-rose);">Akar Kata Tidak Ditemui</h2>
          <a href="#roots" class="btn-action" style="margin-top: 1rem;">${i18n.t('backToRoots')}</a>
        </div>
      `;
      return;
    }

    const meanings = (rootDetail.meanings_ms || []).join(', ') || '—';
    const lemmas = (rootDetail.lemmas || []).join(' • ') || '—';

    this.viewContainer.innerHTML = `
      <div style="margin-bottom: 1.5rem;">
        <a href="#roots" class="btn-action">${i18n.t('backToRoots')}</a>
      </div>

      <div class="word-banner-card">
        <div class="word-ar-display">${rootDetail.root}</div>
        <div class="word-gloss-display">"${meanings}"</div>
        <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; margin-top: 1rem;">
          <span class="root-count-badge" style="font-size: 0.9rem; padding: 0.3rem 0.8rem;">
            📊 ${rootDetail.count} kemunculan dalam Al-Quran
          </span>
        </div>
      </div>

      <div class="grammar-card" style="margin-bottom: 2rem;">
        <div class="grammar-card-label">${i18n.t('rootLemmas')}</div>
        <div style="font-family: var(--font-arabic); font-size: 1.3rem; color: var(--accent-gold); margin-top: 0.5rem; line-height: 1.8;">
          ${lemmas}
        </div>
      </div>

      <div class="section-title-bar">
        <h3 class="section-title">${i18n.t('concordanceTitle')} (${rootDetail.occurrences.length})</h3>
      </div>

      <div class="concordance-list">
        ${rootDetail.occurrences.map(occ => {
          const sObj = this.surahs.find(s => s.id === occ.s);
          const sName = sObj ? sObj.name_ms || sObj.transliteration : `Surah ${occ.s}`;
          const transText = basmeih?.[String(occ.s)]?.[String(occ.a)] || '';

          return `
            <div class="concordance-item">
              <div class="concordance-header">
                <a href="#word/${occ.s}:${occ.a}:${occ.p}" class="concordance-ref">
                  ${sName} (${occ.s}:${occ.a}) &bull; Kedudukan Kalimah ${occ.p}
                </a>
                <a href="https://maktabah-maftoohah.github.io/al-quran/#surah/${occ.s}/${occ.a}" target="_blank" rel="noopener noreferrer" class="btn-action" style="font-size: 0.75rem; padding: 0.2rem 0.5rem;">
                  Baca Ayat ↗
                </a>
              </div>
              <div class="concordance-ar">
                <span class="highlight-target">${occ.ar}</span>
              </div>
              ${transText ? `<div class="concordance-ms">"${transText}"</div>` : ''}
              <div style="font-size: 0.8rem; color: var(--text-muted); display: flex; gap: 1rem; align-items: center;">
                <span>Sebutan: <em>${occ.tr}</em></span>
                <span>Lema: <strong style="font-family: var(--font-arabic);">${occ.lemma}</strong></span>
                <span>Terjemahan Harfiah: <strong>${occ.ms}</strong></span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  async renderWordDetail(wordRef) {
    const parts = wordRef.split(':');
    const s = parseInt(parts[0], 10) || 1;
    const a = parseInt(parts[1], 10) || 1;
    const p = parseInt(parts[2], 10) || 1;

    this.viewContainer.innerHTML = `
      <div style="text-align: center; padding: 3rem 0; color: var(--text-muted);">
        Sedang menganalisis tatabahasa kalimah...
      </div>
    `;

    const [token, sObj, arSurah, basmeih] = await Promise.all([
      corpusStore.getWordToken(s, a, p),
      this.surahs.find(item => item.id === s),
      corpusStore.fetchArabicSurah(s),
      corpusStore.fetchBasmeih()
    ]);

    if (!token) {
      this.viewContainer.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem;">
          <h2 style="color: var(--accent-rose);">Kalimah Tidak Ditemui</h2>
          <p style="color: var(--text-secondary); margin-top: 0.5rem;">Rujukan: ${s}:${a}:${p}</p>
          <a href="#home" class="btn-action" style="margin-top: 1rem;">Kembali ke Laman Utama</a>
        </div>
      `;
      return;
    }

    const report = generateGrammarReport(token, s, a);
    const sName = sObj ? sObj.name_ms || sObj.transliteration : `Surah ${s}`;
    const fullAyahArabic = arSurah?.[String(a)]?.uthmani || '';
    const fullAyahBasmeih = basmeih?.[String(s)]?.[String(a)] || '';

    this.viewContainer.innerHTML = `
      <div style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
        <a href="#surah/${s}" class="btn-action">&larr; Kembali ke ${sName}</a>
        <span style="font-weight: 700; color: var(--accent-gold);">${sName} (${s}:${a}) &bull; Kalimah #${p}</span>
      </div>

      <div class="word-banner-card">
        <div class="word-ar-display">${token.ar}</div>
        <div class="word-tr-display">${token.tr}</div>
        <div class="word-gloss-display">"${report.gloss_ms}"</div>

        <div class="word-actions-row">
          <button class="btn-action btn-primary" onclick="window.corpusApp.playPronounce(${s}, ${a}, ${p})">
            🔊 ${i18n.t('audioPronounce')}
          </button>
          <a href="https://maktabah-maftoohah.github.io/al-quran/#surah/${s}/${a}" target="_blank" rel="noopener noreferrer" class="btn-action">
            ${i18n.t('viewInQuranApp')}
          </a>
          ${token.root ? `
            <a href="#root/${encodeURIComponent(token.root)}" class="btn-action">
              🔍 Mu'jam Akar Kata (${token.root}) &rarr;
            </a>
          ` : ''}
        </div>
      </div>

      <div class="section-title-bar">
        <h3 class="section-title">${i18n.t('grammarAnalysis')}</h3>
      </div>

      <div class="grammar-grid">
        <div class="grammar-card">
          <div class="grammar-card-label">${i18n.t('posLabel')}</div>
          <div class="grammar-card-val" style="color: var(--accent-emerald);">${report.partsSummary}</div>
          <div class="grammar-card-desc">
            ${report.parsed.map(part => `
              <div style="margin-top: 0.4rem;">
                <strong style="color: var(--text-primary);">${part.info.name_ar} — ${part.info.name_ms}:</strong>
                <p style="font-size: 0.85rem; color: var(--text-secondary);">${part.info.desc_ms}</p>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="grammar-card">
          <div class="grammar-card-label">${i18n.t('irabLabel')}</div>
          <div class="grammar-card-val" style="color: var(--accent-gold);">${report.irabCase.name_ms}</div>
          <div class="grammar-card-desc">
            <p><strong>Tanda I'rab:</strong> ${report.irabCase.sign_ms}</p>
            <p style="margin-top: 0.35rem;"><strong>Kedudukan Lazim:</strong> ${report.irabCase.roles_ms}</p>
          </div>
        </div>

        <div class="grammar-card">
          <div class="grammar-card-label">${i18n.t('rootLabel')}</div>
          <div class="grammar-card-val" style="font-family: var(--font-arabic); font-size: 1.5rem; color: var(--accent-gold);">
            ${report.root}
          </div>
          <div class="grammar-card-desc">
            Akar kata dasar yang menjadi sumber terbitan kalimah ini dalam Bahasa Arab.
          </div>
        </div>

        <div class="grammar-card">
          <div class="grammar-card-label">${i18n.t('lemmaLabel')}</div>
          <div class="grammar-card-val" style="font-family: var(--font-arabic); font-size: 1.4rem;">
            ${report.lemma}
          </div>
          <div class="grammar-card-desc">
            Bentuk lema (kata entri kamus) bagi kalimah ini.
          </div>
        </div>
      </div>

      ${fullAyahArabic ? `
        <div class="section-title-bar">
          <h3 class="section-title">Konteks Ayat Penuh</h3>
        </div>
        <div class="concordance-item" style="margin-bottom: 2rem;">
          <div class="concordance-ar" style="font-size: 1.8rem;">
            ${fullAyahArabic}
          </div>
          ${fullAyahBasmeih ? `
            <div class="concordance-ms" style="font-size: 1.05rem; margin-top: 0.5rem;">
              "${fullAyahBasmeih}"
            </div>
          ` : ''}
        </div>
      ` : ''}
    `;
  }

  playPronounce(s, a, p) {
    const sStr = String(s).padStart(3, '0');
    const aStr = String(a).padStart(3, '0');
    const pStr = String(p).padStart(3, '0');
    const audioUrl = `https://audio.qurancdn.com/wbw/${sStr}_${aStr}_${pStr}.mp3`;
    const audio = new Audio(audioUrl);
    audio.play().catch(e => {
      console.warn('Gagal memainkan audio sebutan:', e);
    });
  }

  renderSurahsList() {
    this.viewContainer.innerHTML = `
      <div class="section-title-bar">
        <div>
          <h2 class="section-title">${i18n.t('navSurah')}</h2>
          <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.25rem;">
            Pilih surah untuk meneroka analisis morfologi setiap kalimah secara berurutan.
          </p>
        </div>
      </div>

      <div class="roots-grid">
        ${this.surahs.map(s => `
          <a href="#surah/${s.id}" class="root-card">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-weight: 700; color: var(--accent-gold); font-size: 0.9rem;">#${s.id}</span>
              <span class="root-ar" style="font-size: 1.5rem;">${s.arabic}</span>
            </div>
            <div style="font-weight: 600; color: #ffffff; margin-top: 0.4rem;">
              ${s.name_ms || s.transliteration}
            </div>
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.2rem;">
              ${s.total_verses} ayat &bull; ${s.revelation_type}
            </div>
          </a>
        `).join('')}
      </div>
    `;
  }

  async renderSurahExplorer(sNum) {
    const sObj = this.surahs.find(s => s.id === sNum);
    const sName = sObj ? sObj.name_ms || sObj.transliteration : `Surah ${sNum}`;

    this.viewContainer.innerHTML = `
      <div style="text-align: center; padding: 3rem 0; color: var(--text-muted);">
        Sedang memuatkan senarai kalimah ${sName}...
      </div>
    `;

    const morph = await corpusStore.fetchMorphology(sNum);

    this.viewContainer.innerHTML = `
      <div style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
        <a href="#surahs" class="btn-action">&larr; Kembali ke Daftar Surah</a>
        <h2 class="section-title">${sName} (${sObj.arabic}) &bull; ${sObj.total_verses} Ayat</h2>
      </div>

      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        ${Object.entries(morph.ayahs || {}).map(([aStr, tokens]) => `
          <div class="concordance-item">
            <div class="concordance-header">
              <span style="font-weight: 700; color: var(--accent-gold);">Ayat ${aStr}</span>
              <a href="https://maktabah-maftoohah.github.io/al-quran/#surah/${sNum}/${aStr}" target="_blank" rel="noopener noreferrer" class="btn-action" style="font-size: 0.75rem; padding: 0.2rem 0.5rem;">
                Buka di Al-Quran ↗
              </a>
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; direction: rtl; justify-content: flex-start; padding: 0.5rem 0;">
              ${tokens.map(t => `
                <a href="#word/${sNum}:${aStr}:${t.pos}" class="root-card" style="padding: 0.6rem 0.8rem; min-width: 90px; text-align: center; direction: ltr;">
                  <div style="font-family: var(--font-arabic); font-size: 1.4rem; color: var(--accent-gold);">${t.ar}</div>
                  <div style="font-size: 0.75rem; color: var(--accent-blue); font-style: italic;">${t.tr}</div>
                  <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.1rem;">"${t.ms || t.en || ''}"</div>
                </a>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
}

window.corpusApp = new CorpusApp();
document.addEventListener('DOMContentLoaded', () => {
  window.corpusApp.init();
});
