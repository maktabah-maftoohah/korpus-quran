/**
 * Maktabah Maftoohah — Korpus Al-Quran
 * Enjin Aplikasi Utama & Penghala (Router & Application Controller)
 */

import { corpusStore } from './store.js';
import { generateGrammarReport } from './grammar.js';
import { i18n } from './i18n.js';
import { SEMANTIC_THEMES } from './themes.js';
import { analytics } from './analytics.js';

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
      const [rawSurahs, rootsIdx] = await Promise.all([
        corpusStore.fetchSurahs(),
        corpusStore.fetchRootsIndex()
      ]);

      this.surahs = rawSurahs.map(s => ({
        ...s,
        id: s.number ?? s.id,
        number: s.number ?? s.id,
        arabic: s.name_arabic || s.arabic || '',
        name_arabic: s.name_arabic || s.arabic || '',
        name_ms: s.name_ms || s.name_latin || '',
        name_latin: s.name_latin || '',
        name_translation: s.name_translation || '',
        transliteration: s.name_latin || s.transliteration || '',
        total_verses: s.total_ayahs ?? s.total_verses ?? 0,
        total_ayahs: s.total_ayahs ?? s.total_verses ?? 0
      }));
      this.rootsIndex = rootsIdx;

      analytics.init();
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
    this.updateStaticTranslations();
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
    document.title = i18n.t('siteTitle');
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      el.textContent = i18n.t(key);
    });
    const headerQuranLink = document.getElementById('headerQuranLink');
    if (headerQuranLink) {
      headerQuranLink.href = `https://maktabah-maftoohah.github.io/al-quran/?lang=${i18n.currentLang}`;
    }
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
    let rawHash = window.location.hash.slice(1).trim() || 'home';
    const langMatch = rawHash.match(/[?&]lang=(en|ms)/);
    if (langMatch) {
      const requestedLang = langMatch[1];
      if (requestedLang !== i18n.currentLang) {
        i18n.setLang(requestedLang);
        const langBtn = document.getElementById('btnLangToggle');
        if (langBtn) langBtn.textContent = requestedLang === 'ms' ? 'EN' : 'MY';
        this.updateStaticTranslations();
      }
      rawHash = rawHash.replace(/[?&]lang=(en|ms)/, '').replace(/\?$/, '');
    }
    const hash = rawHash || 'home';
    this.currentRoute = hash;

    if (hash === 'home') {
      this.updateNavActive('home');
      this.renderHome();
    } else if (hash.startsWith('compare')) {
      this.updateNavActive('compare');
      let r1 = '';
      let r2 = '';
      if (hash.startsWith('compare/')) {
        const parts = hash.slice(8).split('/');
        r1 = decodeURIComponent(parts[0] || '');
        r2 = decodeURIComponent(parts[1] || '');
      } else if (hash.includes('?')) {
        const qParams = new URLSearchParams(hash.split('?')[1]);
        r1 = qParams.get('root1') || '';
        r2 = qParams.get('root2') || '';
      }
      this.renderCompareView(r1, r2);
    } else if (hash.startsWith('learn') || hash.startsWith('flashcards') || hash.startsWith('quiz')) {
      this.updateNavActive('learn');
      this.renderLearnView();
    } else if (hash.startsWith('roots')) {
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
    analytics.trackPageView(window.location.pathname + (window.location.hash || '#home'), document.title);
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
          <h3 class="section-title">${i18n.t('frequentRoots')}</h3>
          <a href="#roots" class="btn-action" style="font-size: 0.85rem;">${i18n.t('viewAllRoots')}</a>
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
    const isEn = i18n.currentLang === 'en';
    const meaningsList = isEn && r.meanings_en?.length ? r.meanings_en : (r.meanings_ms || []);
    const meanings = meaningsList.join(', ') || '—';
    const countBadge = `${r.count} ${i18n.t('occurrences')}`;
    return `
      <a href="#root/${encodeURIComponent(r.root)}" class="root-card">
        <div class="root-ar">${r.root}</div>
        <div class="root-count-badge">${countBadge}</div>
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
      (r.meanings_ms && r.meanings_ms.some(m => m.toLowerCase().includes(query.toLowerCase()))) ||
      (r.meanings_en && r.meanings_en.some(m => m.toLowerCase().includes(query.toLowerCase())))
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
    const isEn = i18n.currentLang === 'en';
    let activeThemeId = 'all';

    this.viewContainer.innerHTML = `
      <div class="section-title-bar">
        <div>
          <h2 class="section-title">${i18n.t('navRoots')}</h2>
          <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.25rem;">
            ${i18n.t('rootDesc')}
          </p>
        </div>
      </div>

      <div class="search-wrapper" style="margin: 0 0 1rem 0; max-width: 100%;">
        <input type="text" id="rootFilterInput" class="search-input" placeholder="${i18n.t('filterPlaceholder')}" value="${initialQuery}">
      </div>

      <!-- Feature 6: Thematic Semantic Filter Pills -->
      <div style="margin-bottom: 0.5rem; font-size: 0.85rem; color: var(--text-muted); font-weight: 600;">
        ${i18n.t('themeFilterLabel')}
      </div>
      <div class="theme-pills-row" id="themePillsRow">
        ${SEMANTIC_THEMES.map(th => {
          const name = isEn ? th.name_en : th.name_ms;
          const isActive = th.id === activeThemeId ? 'active' : '';
          return `
            <button class="theme-pill ${isActive}" data-theme="${th.id}">
              <span>${th.icon}</span>
              <span>${name}</span>
            </button>
          `;
        }).join('')}
      </div>

      <div id="rootsGridTarget" class="roots-grid"></div>
    `;

    const filterInput = document.getElementById('rootFilterInput');
    const target = document.getElementById('rootsGridTarget');
    const themePillsRow = document.getElementById('themePillsRow');

    const updateFilter = () => {
      const q = filterInput.value.trim().toLowerCase();
      const qClean = q.replace(/\s+/g, '');
      const themeObj = SEMANTIC_THEMES.find(t => t.id === activeThemeId);

      const filtered = this.rootsIndex.filter(r => {
        if (themeObj && themeObj.id !== 'all') {
          if (!themeObj.roots.includes(r.root)) return false;
        }
        if (!q) return true;
        return (
          r.root.includes(q) ||
          r.root_clean.includes(qClean) ||
          r.root_norm.includes(qClean) ||
          (r.meanings_ms && r.meanings_ms.some(m => m.toLowerCase().includes(q))) ||
          (r.meanings_en && r.meanings_en.some(m => m.toLowerCase().includes(q)))
        );
      });

      if (filtered.length === 0) {
        target.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--text-muted);">${i18n.t('noResults')}</div>`;
      } else {
        target.innerHTML = filtered.slice(0, 150).map(r => this.renderRootCardHtml(r)).join('');
      }
    };

    if (themePillsRow) {
      themePillsRow.querySelectorAll('.theme-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          themePillsRow.querySelectorAll('.theme-pill').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          activeThemeId = btn.getAttribute('data-theme') || 'all';
          updateFilter();
        });
      });
    }

    filterInput.addEventListener('input', updateFilter);
    updateFilter();
  }

  async renderRootDetail(rootParam) {
    const isEn = i18n.currentLang === 'en';
    this.viewContainer.innerHTML = `
      <div style="text-align: center; padding: 3rem 0; color: var(--text-muted);">
        ${i18n.t('loadingConcordance')}
      </div>
    `;

    const [rootDetail, translations] = await Promise.all([
      corpusStore.getRootDetails(rootParam),
      corpusStore.fetchTranslation(i18n.currentLang)
    ]);

    if (!rootDetail) {
      this.viewContainer.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem;">
          <h2 style="color: var(--accent-rose);">${i18n.t('rootNotFound')}</h2>
          <a href="#roots" class="btn-action" style="margin-top: 1rem;">${i18n.t('backToRoots')}</a>
        </div>
      `;
      return;
    }

    analytics.trackRootSearch(rootDetail.root_arabic, rootDetail.total_occurrences || rootDetail.occurrences?.length || 0);
    const meaningsList = isEn && rootDetail.meanings_en?.length ? rootDetail.meanings_en : (rootDetail.meanings_ms || []);
    const meanings = meaningsList.join(', ') || '—';
    const lemmas = (rootDetail.lemmas || []).join(' • ') || '—';

    // Calculate Makkiyyah vs Madaniyyah & Top Surahs
    let meccanCount = 0;
    let medinanCount = 0;
    const surahCounts = {};

    rootDetail.occurrences.forEach(occ => {
      const sObj = this.surahs.find(s => (s.number || s.id) === occ.s);
      const isMedinan = sObj && (sObj.revelation_type === 'Medinan');
      if (isMedinan) {
        medinanCount++;
      } else {
        meccanCount++;
      }
      surahCounts[occ.s] = (surahCounts[occ.s] || 0) + 1;
    });

    const totalOcc = rootDetail.occurrences.length || 1;
    const meccanPct = Math.round((meccanCount / totalOcc) * 100);
    const medinanPct = 100 - meccanPct;

    const topSurahsList = Object.entries(surahCounts)
      .map(([sId, cnt]) => {
        const sObj = this.surahs.find(s => (s.number || s.id) === parseInt(sId, 10));
        const sName = sObj ? (isEn ? (sObj.name_latin || sObj.name_ms) : (sObj.name_ms || sObj.name_latin)) : `Surah ${sId}`;
        return { sId: parseInt(sId, 10), name: sName, count: cnt };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    this.viewContainer.innerHTML = `
      <div style="margin-bottom: 1.5rem;">
        <a href="#roots" class="btn-action">${i18n.t('backToRoots')}</a>
      </div>

      <div class="word-banner-card">
        <div class="word-ar-display">${rootDetail.root}</div>
        <div class="word-gloss-display">"${meanings}"</div>
        <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; margin-top: 1rem;">
          <span class="root-count-badge" style="font-size: 0.9rem; padding: 0.3rem 0.8rem;">
            📊 ${rootDetail.count} ${i18n.t('occurrencesInQuran')}
          </span>
        </div>
      </div>

      <!-- Feature 1: Distribution Card -->
      <div class="dist-card">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
          <strong style="color: var(--accent-gold); font-size: 0.95rem;">📊 ${i18n.t('rootDistribution')}</strong>
          <span style="font-size: 0.8rem; color: var(--text-muted);">${rootDetail.count} ${i18n.t('occurrencesInQuran')}</span>
        </div>

        <div class="dist-meter-container">
          <div class="dist-meter">
            ${meccanCount > 0 ? `<div class="dist-seg-meccan" style="width: ${meccanPct}%;" title="Makkiyyah: ${meccanCount} (${meccanPct}%)">🕌 ${meccanPct}%</div>` : ''}
            ${medinanCount > 0 ? `<div class="dist-seg-medinan" style="width: ${medinanPct}%;" title="Madaniyyah: ${medinanCount} (${medinanPct}%)">🌴 ${medinanPct}%</div>` : ''}
          </div>
          <div class="dist-labels">
            <span>🕌 ${i18n.t('meccanRatio')}: <strong>${meccanCount}</strong> (${meccanPct}%)</span>
            <span>🌴 ${i18n.t('medinanRatio')}: <strong>${medinanCount}</strong> (${medinanPct}%)</span>
          </div>
        </div>

        <div style="margin-top: 1rem;">
          <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.35rem;">
            ${i18n.t('topSurahs')}:
          </div>
          <div class="dist-surah-chips">
            ${topSurahsList.map(item => `
              <a href="#surah/${item.sId}" class="dist-chip">
                <span>${item.name}</span>
                <span class="dist-chip-count">${item.count}</span>
              </a>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="grammar-card" style="margin-bottom: 2rem;">
        <div class="grammar-card-label">${i18n.t('rootLemmas')}</div>
        <div style="font-family: var(--font-arabic); font-size: 1.3rem; color: var(--accent-gold); margin-top: 0.5rem; line-height: 1.8;">
          ${lemmas}
        </div>
      </div>

      <div class="section-title-bar" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
        <h3 class="section-title">${i18n.t('concordanceTitle')} (<span id="concordanceCount">${rootDetail.occurrences.length}</span>)</h3>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <a href="#compare?root1=${encodeURIComponent(rootDetail.root)}" class="btn-action" style="font-size: 0.8rem; padding: 0.25rem 0.6rem;">${i18n.t('compareAction')}</a>
          <button class="btn-action" id="btnPrintSheet" style="font-size: 0.8rem; padding: 0.25rem 0.6rem;">${i18n.t('printSheetBtn')}</button>
          <button class="btn-action" id="btnExportCsv" style="font-size: 0.8rem; padding: 0.25rem 0.6rem;">${i18n.t('exportCsvBtn')}</button>
          <button class="btn-action" id="btnExportJson" style="font-size: 0.8rem; padding: 0.25rem 0.6rem;">${i18n.t('exportJsonBtn')}</button>
        </div>
      </div>

      <!-- Tier 7: Linguistic Filter Pills -->
      <div class="filter-pills-row" id="concordanceFilterRow">
        <button class="filter-pill active" data-filter="all">${i18n.t('filterAll')}</button>
        <button class="filter-pill" data-filter="verb">${i18n.t('filterVerbs')}</button>
        <button class="filter-pill" data-filter="noun">${i18n.t('filterNouns')}</button>
        <button class="filter-pill" data-filter="act_pcpl">${i18n.t('filterActiveParticiple')}</button>
        <button class="filter-pill" data-filter="pass_pcpl">${i18n.t('filterPassiveParticiple')}</button>
      </div>

      <div class="concordance-list" id="concordanceContainer">
        ${this.renderConcordanceItemsHtml(rootDetail.occurrences, translations, isEn)}
      </div>

      <!-- Feature 4: Classical Arabic Lexicons Integration -->
      <div style="margin-top: 2.5rem;">
        <div class="section-title-bar">
          <div>
            <h3 class="section-title">📚 ${i18n.t('lexiconsTitle')}</h3>
            <p style="color: var(--text-secondary); font-size: 0.85rem; margin-top: 0.2rem;">
              ${i18n.t('lexiconsSubtitle')}
            </p>
          </div>
        </div>

        <div class="lexicon-grid">
          <div class="lexicon-card">
            <div>
              <div class="lexicon-card-title">📖 ${i18n.t('laneLexicon')}</div>
              <div class="lexicon-card-desc">${i18n.t('laneDesc')}</div>
            </div>
            <a href="https://ejtaal.net/aa/#hw4=${rootDetail.root_clean},ll=${rootDetail.root_clean}" target="_blank" rel="noopener noreferrer" class="btn-action" style="text-align: center; font-size: 0.8rem; margin-top: 0.5rem;">
              ${i18n.t('openLexicon')}
            </a>
          </div>

          <div class="lexicon-card">
            <div>
              <div class="lexicon-card-title">📜 ${i18n.t('lisanAlArab')}</div>
              <div class="lexicon-card-desc">${i18n.t('lisanDesc')}</div>
            </div>
            <a href="https://www.almaany.com/ar/dict/ar-ar/${encodeURIComponent(rootDetail.root_clean)}/" target="_blank" rel="noopener noreferrer" class="btn-action" style="text-align: center; font-size: 0.8rem; margin-top: 0.5rem;">
              ${i18n.t('openLexicon')}
            </a>
          </div>

          <div class="lexicon-card">
            <div>
              <div class="lexicon-card-title">🏛️ ${i18n.t('mujamWasit')}</div>
              <div class="lexicon-card-desc">${i18n.t('wasitDesc')}</div>
            </div>
            <a href="https://www.almaany.com/ar/dict/ar-ar/${encodeURIComponent(rootDetail.root_clean)}/?c=%D8%A7%D9%84%D9%85%D8%B9%D8%AC%D9%85+%D8%A7%D9%84%D9%88%D8%B3%D9%8A%D8%B7" target="_blank" rel="noopener noreferrer" class="btn-action" style="text-align: center; font-size: 0.8rem; margin-top: 0.5rem;">
              ${i18n.t('openLexicon')}
            </a>
          </div>
        </div>
      </div>
    `;

    // Bind Filter Pills
    const filterRow = document.getElementById('concordanceFilterRow');
    const container = document.getElementById('concordanceContainer');
    const counterEl = document.getElementById('concordanceCount');

    if (filterRow && container) {
      filterRow.querySelectorAll('.filter-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          filterRow.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const filter = btn.getAttribute('data-filter');

          let filtered = rootDetail.occurrences;
          if (filter === 'verb') {
            filtered = rootDetail.occurrences.filter(o => o.vf || o.asp || (o.pos_tag && o.pos_tag.includes('V')));
          } else if (filter === 'noun') {
            filtered = rootDetail.occurrences.filter(o => o.case || (o.pos_tag && o.pos_tag.includes('N')));
          } else if (filter === 'act_pcpl') {
            filtered = rootDetail.occurrences.filter(o => o.deriv === 'ACT_PCPL');
          } else if (filter === 'pass_pcpl') {
            filtered = rootDetail.occurrences.filter(o => o.deriv === 'PASS_PCPL');
          }

          if (counterEl) counterEl.textContent = filtered.length;
          container.innerHTML = this.renderConcordanceItemsHtml(filtered, translations, isEn);
        });
      });
    }

    // Bind Export Buttons (Tier 8)
    const btnCsv = document.getElementById('btnExportCsv');
    if (btnCsv) {
      btnCsv.addEventListener('click', () => this.exportRootCsv(rootDetail, translations));
    }
    const btnJson = document.getElementById('btnExportJson');
    if (btnJson) {
      btnJson.addEventListener('click', () => this.exportRootJson(rootDetail));
    }
    const btnPrint = document.getElementById('btnPrintSheet');
    if (btnPrint) {
      btnPrint.addEventListener('click', () => window.print());
    }
  }

  renderConcordanceItemsHtml(occurrences, translations, isEn) {
    if (!occurrences || occurrences.length === 0) {
      return `<div style="text-align: center; padding: 2rem; color: var(--text-muted);">${i18n.t('noResults')}</div>`;
    }

    return occurrences.map(occ => {
      const sObj = this.surahs.find(s => (s.number || s.id) === occ.s);
      const sName = sObj ? (isEn ? (sObj.name_latin || sObj.name_ms) : (sObj.name_ms || sObj.name_latin)) : `Surah ${occ.s}`;
      const transText = translations?.[String(occ.s)]?.[String(occ.a)] || '';
      const literalGloss = isEn && occ.en ? occ.en : occ.ms;

      let sarfBadgesHtml = '';
      if (occ.vf) sarfBadgesHtml += `<span class="badge-sarf badge-vf">Form ${occ.vf}</span>`;
      if (occ.asp) {
        const aspLabel = occ.asp === 'PERF' ? 'Madhi' : (occ.asp === 'IMPF' ? 'Mudhari\'' : 'Amr');
        sarfBadgesHtml += `<span class="badge-sarf badge-asp">${aspLabel}</span>`;
      }
      if (occ.vox === 'PASS') sarfBadgesHtml += `<span class="badge-sarf badge-pass">Majhul</span>`;
      if (occ.deriv) {
        const derivLabel = occ.deriv === 'ACT_PCPL' ? 'Isim Fa\'il' : (occ.deriv === 'PASS_PCPL' ? 'Isim Maf\'ul' : 'Masdar');
        sarfBadgesHtml += `<span class="badge-sarf badge-deriv">${derivLabel}</span>`;
      }
      if (occ.case) sarfBadgesHtml += `<span class="badge-sarf badge-case">${occ.case}</span>`;
      if (occ.pgn) sarfBadgesHtml += `<span class="badge-sarf" style="background: rgba(255,255,255,0.08); color: var(--text-secondary);">${occ.pgn}</span>`;

      return `
        <div class="concordance-item">
          <div class="concordance-header">
            <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
              <a href="#word/${occ.s}:${occ.a}:${occ.p}" class="concordance-ref">
                ${sName} (${occ.s}:${occ.a}) &bull; ${i18n.t('wordPosition', { pos: occ.p })}
              </a>
              <button class="btn-action" style="padding: 0.12rem 0.4rem; font-size: 0.72rem;" title="${i18n.t('audioPronounce')}" onclick="window.corpusApp.playPronounce(${occ.s}, ${occ.a}, ${occ.p}, this)">🔊</button>
              ${sarfBadgesHtml}
            </div>
            <a href="https://maktabah-maftoohah.github.io/al-quran/?lang=${i18n.currentLang}#surah/${occ.s}/${occ.a}" target="_blank" rel="noopener noreferrer" class="btn-action" style="font-size: 0.75rem; padding: 0.2rem 0.5rem;">
              ${i18n.t('readAyahBtn')}
            </a>
          </div>
          <div class="concordance-ar">
            <span class="highlight-target">${occ.ar}</span>
          </div>
          ${transText ? `<div class="concordance-ms">"${transText}"</div>` : ''}
          <div style="font-size: 0.8rem; color: var(--text-muted); display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
            <span>${i18n.t('pronunciation')} <em>${occ.tr}</em></span>
            <span>${i18n.t('lemma')} <strong style="font-family: var(--font-arabic);">${occ.lemma}</strong></span>
            <span>${i18n.t('literalTranslation')} <strong>${literalGloss}</strong></span>
          </div>
        </div>
      `;
    }).join('');
  }

  async renderWordDetail(wordRef) {
    const isEn = i18n.currentLang === 'en';
    const parts = wordRef.split(':');
    const s = parseInt(parts[0], 10) || 1;
    const a = parseInt(parts[1], 10) || 1;
    const p = parseInt(parts[2], 10) || 1;

    this.viewContainer.innerHTML = `
      <div style="text-align: center; padding: 3rem 0; color: var(--text-muted);">
        ${i18n.t('analyzingWord')}
      </div>
    `;

    const [token, sObj, arSurah, translation] = await Promise.all([
      corpusStore.getWordToken(s, a, p),
      this.surahs.find(item => (item.number || item.id) === s),
      corpusStore.fetchArabicSurah(s),
      corpusStore.fetchTranslation(i18n.currentLang)
    ]);

    if (!token) {
      this.viewContainer.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem;">
          <h2 style="color: var(--accent-rose);">${i18n.t('wordNotFound')}</h2>
          <p style="color: var(--text-secondary); margin-top: 0.5rem;">${s}:${a}:${p}</p>
          <a href="#home" class="btn-action" style="margin-top: 1rem;">${i18n.t('backToHome')}</a>
        </div>
      `;
      return;
    }

    const report = generateGrammarReport(token, s, a, i18n.currentLang);
    const sName = sObj ? (isEn ? (sObj.name_latin || sObj.name_ms) : (sObj.name_ms || sObj.name_latin)) : `Surah ${s}`;
    const fullAyahArabic = arSurah?.ayahs?.[String(a)]?.uthmani || arSurah?.[String(a)]?.uthmani || '';
    const fullAyahTrans = translation?.[String(s)]?.[String(a)] || '';

    this.viewContainer.innerHTML = `
      <div style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
        <a href="#surah/${s}" class="btn-action">${i18n.t('backToSurah', { surah: sName })}</a>
        <span style="font-weight: 700; color: var(--accent-gold);">${sName} (${s}:${a}) &bull; ${i18n.t('wordNumber', { pos: p })}</span>
      </div>

      <div class="word-banner-card">
        <div class="word-ar-display">${token.ar}</div>
        <div class="word-tr-display">${token.tr}</div>
        <div class="word-gloss-display">"${report.gloss}"</div>

        <div class="word-actions-row">
          <button class="btn-action btn-primary" onclick="window.corpusApp.playPronounce(${s}, ${a}, ${p}, this)">
            🔊 ${i18n.t('audioPronounce')}
          </button>
          <a href="https://maktabah-maftoohah.github.io/al-quran/?lang=${i18n.currentLang}#surah/${s}/${a}" target="_blank" rel="noopener noreferrer" class="btn-action">
            ${i18n.t('viewInQuranApp')}
          </a>
          ${token.root ? `
            <a href="#root/${encodeURIComponent(token.root)}" class="btn-action">
              ${i18n.t('rootLexiconLink', { root: token.root })}
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
                <strong style="color: var(--text-primary);">${part.info.name_ar} — ${part.info.name}:</strong>
                <p style="font-size: 0.85rem; color: var(--text-secondary);">${part.info.desc}</p>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="grammar-card">
          <div class="grammar-card-label">${i18n.t('irabLabel')}</div>
          <div class="grammar-card-val" style="color: var(--accent-gold);">${report.irabCase.name}</div>
          <div class="grammar-card-desc">
            <p><strong>${i18n.t('irabSignLabel')}</strong> ${report.irabCase.sign}</p>
            <p style="margin-top: 0.35rem;"><strong>${i18n.t('irabRoleLabel')}</strong> ${report.irabCase.roles}</p>
          </div>
        </div>

        <div class="grammar-card">
          <div class="grammar-card-label">${i18n.t('rootLabel')}</div>
          <div class="grammar-card-val" style="font-family: var(--font-arabic); font-size: 1.5rem; color: var(--accent-gold);">
            ${report.root}
          </div>
          <div class="grammar-card-desc">
            ${i18n.t('rootLabelDesc')}
          </div>
        </div>

        <div class="grammar-card">
          <div class="grammar-card-label">${i18n.t('lemmaLabel')}</div>
          <div class="grammar-card-val" style="font-family: var(--font-arabic); font-size: 1.4rem;">
            ${report.lemma}
          </div>
          <div class="grammar-card-desc">
            ${i18n.t('lemmaLabelDesc')}
          </div>
        </div>
      </div>

      ${(report.verbForm || report.aspect || report.voice || report.derivation || report.pgn || report.syntaxRole) ? `
        <div class="section-title-bar" style="margin-top: 1.5rem;">
          <h3 class="section-title">📐 ${i18n.t('sarfTitle')}</h3>
        </div>
        <div class="grammar-grid">
          ${report.verbForm ? `
            <div class="grammar-card">
              <div class="grammar-card-label">${i18n.t('verbFormLabel')}</div>
              <div class="grammar-card-val" style="color: var(--accent-gold); font-family: var(--font-arabic); font-size: 1.4rem;">
                ${report.verbForm.pattern_ar} &bull; Form ${report.verbForm.roman}
              </div>
              <div class="grammar-card-desc">
                <strong>${report.verbForm.name}:</strong>
                <p style="margin-top: 0.25rem;">${report.verbForm.desc}</p>
              </div>
            </div>
          ` : ''}

          ${report.aspect ? `
            <div class="grammar-card">
              <div class="grammar-card-label">${i18n.t('aspectLabel')}</div>
              <div class="grammar-card-val" style="color: var(--accent-emerald);">
                ${report.aspect.name_ar}
              </div>
              <div class="grammar-card-desc">
                <strong>${report.aspect.name}:</strong>
                <p style="margin-top: 0.25rem;">${report.aspect.desc}</p>
              </div>
            </div>
          ` : ''}

          ${report.voice ? `
            <div class="grammar-card">
              <div class="grammar-card-label">${i18n.t('voiceLabel')}</div>
              <div class="grammar-card-val" style="color: var(--accent-blue);">
                ${report.voice.name_ar}
              </div>
              <div class="grammar-card-desc">
                <strong>${report.voice.name}:</strong>
                <p style="margin-top: 0.25rem;">${report.voice.desc}</p>
              </div>
            </div>
          ` : ''}

          ${report.derivation ? `
            <div class="grammar-card">
              <div class="grammar-card-label">${i18n.t('derivationLabel')}</div>
              <div class="grammar-card-val" style="color: var(--accent-rose); font-family: var(--font-arabic); font-size: 1.3rem;">
                ${report.derivation.name_ar}
              </div>
              <div class="grammar-card-desc">
                <strong>${report.derivation.name}:</strong>
                <p style="margin-top: 0.25rem;">${report.derivation.desc}</p>
              </div>
            </div>
          ` : ''}

          ${report.pgn ? `
            <div class="grammar-card">
              <div class="grammar-card-label">${i18n.t('pgnLabel')}</div>
              <div class="grammar-card-val" style="color: #ffffff;">
                ${report.pgn.name_ar}
              </div>
              <div class="grammar-card-desc">
                <strong>${report.pgn.name}</strong>
              </div>
            </div>
          ` : ''}

          ${report.syntaxRole ? `
            <div class="grammar-card">
              <div class="grammar-card-label">${i18n.t('syntaxRoleLabel')}</div>
              <div class="grammar-card-val" style="color: var(--accent-gold);">
                ${report.syntaxRole.name_ar}
              </div>
              <div class="grammar-card-desc">
                <strong>${report.syntaxRole.name}</strong>
              </div>
            </div>
          ` : ''}
        </div>
      ` : ''}

      ${fullAyahArabic ? `
        <div class="section-title-bar">
          <h3 class="section-title">${i18n.t('fullVerseContext')}</h3>
        </div>
        <div class="concordance-item" style="margin-bottom: 2rem;">
          <div class="concordance-ar" style="font-size: 1.8rem;">
            ${fullAyahArabic}
          </div>
          ${fullAyahTrans ? `
            <div class="concordance-ms" style="font-size: 1.05rem; margin-top: 0.5rem;">
              "${fullAyahTrans}"
            </div>
          ` : ''}
        </div>
      ` : ''}
    `;
  }

  playPronounce(s, a, p, triggerEl = null) {
    const sStr = String(s).padStart(3, '0');
    const aStr = String(a).padStart(3, '0');
    const pStr = String(p).padStart(3, '0');
    const audioUrl = `https://audio.qurancdn.com/wbw/${sStr}_${aStr}_${pStr}.mp3`;
    
    if (triggerEl) {
      triggerEl.classList.add('playing');
    }

    const audio = new Audio(audioUrl);
    audio.onended = () => {
      if (triggerEl) triggerEl.classList.remove('playing');
    };
    audio.onerror = (e) => {
      if (triggerEl) triggerEl.classList.remove('playing');
      console.warn('Audio sebutan tidak tersedia:', audioUrl, e);
    };

    audio.play().catch(e => {
      if (triggerEl) triggerEl.classList.remove('playing');
      console.warn('Gagal memainkan audio sebutan:', e);
    });
  }

  exportRootCsv(rootDetail, translations) {
    const isEn = i18n.currentLang === 'en';
    const rows = [
      ['Surah', 'Ayah', 'WordPosition', 'Arabic', 'Transliteration', 'Lemma', 'Root', 'VerbForm', 'Aspect', 'Voice', 'Case', 'PGN', 'Derivation', 'SyntaxRole', 'WordGloss', 'VerseTranslation']
    ];

    rootDetail.occurrences.forEach(occ => {
      const transText = translations?.[String(occ.s)]?.[String(occ.a)] || '';
      const gloss = isEn && occ.en ? occ.en : (occ.ms || occ.en || '');
      rows.push([
        occ.s,
        occ.a,
        occ.p,
        `"${(occ.ar || '').replace(/"/g, '""')}"`,
        `"${(occ.tr || '').replace(/"/g, '""')}"`,
        `"${(occ.lemma || '').replace(/"/g, '""')}"`,
        `"${(rootDetail.root || '').replace(/"/g, '""')}"`,
        occ.vf || '',
        occ.asp || '',
        occ.vox || '',
        occ.case || '',
        occ.pgn || '',
        occ.deriv || '',
        occ.syntax || '',
        `"${gloss.replace(/"/g, '""')}"`,
        `"${transText.replace(/"/g, '""')}"`
      ]);
    });

    const csvContent = "\uFEFF" + rows.map(r => r.join(',')).join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const cleanRoot = rootDetail.root_clean || 'root';
    const filename = `korpus_akar_${cleanRoot}.csv`;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  exportRootJson(rootDetail) {
    const cleanRoot = rootDetail.root_clean || 'root';
    const blob = new Blob([JSON.stringify(rootDetail, null, 2)], { type: 'application/json;charset=utf-8;' });
    const filename = `korpus_akar_${cleanRoot}.json`;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  renderSurahsList() {
    const isEn = i18n.currentLang === 'en';
    this.viewContainer.innerHTML = `
      <div class="section-title-bar">
        <div>
          <h2 class="section-title">${i18n.t('navSurah')}</h2>
          <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.25rem;">
            ${i18n.t('surahListSubtitle')}
          </p>
        </div>
      </div>

      <div class="roots-grid">
        ${this.surahs.map(s => {
          const sNum = s.number || s.id;
          const sArabic = s.name_arabic || s.arabic || '';
          const sName = isEn ? (s.name_latin || s.name_ms) : (s.name_ms || s.name_latin || `Surah ${sNum}`);
          const sSub = isEn && s.name_translation ? `(${s.name_translation})` : (s.translation_ms ? `(${s.translation_ms})` : '');
          const sVerses = s.total_ayahs || s.total_verses || 0;
          const revType = isEn 
            ? (s.revelation_type || 'Meccan')
            : (s.revelation_type === 'Medinan' ? i18n.t('revelationMedinan') : i18n.t('revelationMeccan'));

          return `
          <a href="#surah/${sNum}" class="root-card">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-weight: 700; color: var(--accent-gold); font-size: 0.9rem;">#${sNum}</span>
              <span class="root-ar" style="font-size: 1.5rem;">${sArabic}</span>
            </div>
            <div style="font-weight: 600; color: #ffffff; margin-top: 0.4rem;">
              ${sName} <span style="font-size: 0.8rem; font-weight: normal; color: var(--text-muted);">${sSub}</span>
            </div>
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.2rem;">
              ${i18n.t('versesCount', { count: sVerses })} &bull; ${revType}
            </div>
          </a>
        `;}).join('')}
      </div>
    `;
  }

  async renderSurahExplorer(sNum) {
    const isEn = i18n.currentLang === 'en';
    const sObj = this.surahs.find(s => (s.number || s.id) === sNum) || {};
    const sName = isEn ? (sObj.name_latin || sObj.name_ms) : (sObj.name_ms || sObj.name_latin || `Surah ${sNum}`);
    const sArabic = sObj.name_arabic || sObj.arabic || '';
    const sVerses = sObj.total_ayahs || sObj.total_verses || 0;

    this.viewContainer.innerHTML = `
      <div style="text-align: center; padding: 3rem 0; color: var(--text-muted);">
        ${i18n.t('loadingSurahWords', { surah: sName })}
      </div>
    `;

    const morph = await corpusStore.fetchMorphology(sNum);

    this.viewContainer.innerHTML = `
      <div style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
        <a href="#surahs" class="btn-action">${i18n.t('backToSurahList')}</a>
        <h2 class="section-title">${sName} ${sArabic ? `(${sArabic})` : ''} &bull; ${i18n.t('versesCount', { count: sVerses })}</h2>
      </div>

      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        ${Object.entries(morph.ayahs || {}).map(([aStr, tokens]) => `
          <div class="concordance-item">
            <div class="concordance-header">
              <span style="font-weight: 700; color: var(--accent-gold);">${i18n.t('verseBadge', { ayah: aStr })}</span>
              <a href="https://maktabah-maftoohah.github.io/al-quran/?lang=${i18n.currentLang}#surah/${sNum}/${aStr}" target="_blank" rel="noopener noreferrer" class="btn-action" style="font-size: 0.75rem; padding: 0.2rem 0.5rem;">
                ${i18n.t('openInQuranApp')}
              </a>
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; direction: rtl; justify-content: flex-start; padding: 0.5rem 0;">
              ${tokens.map(t => {
                const gloss = isEn ? (t.en || t.ms || '') : (t.ms || t.en || '');
                return `
                <a href="#word/${sNum}:${aStr}:${t.pos}" class="root-card" style="padding: 0.6rem 0.8rem; min-width: 90px; text-align: center; direction: ltr;">
                  <div style="font-family: var(--font-arabic); font-size: 1.4rem; color: var(--accent-gold);">${t.ar}</div>
                  <div style="font-size: 0.75rem; color: var(--accent-blue); font-style: italic;">${t.tr}</div>
                  <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.1rem;">"${gloss}"</div>
                </a>
              `;}).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  async renderCompareView(root1Param, root2Param) {
    const isEn = i18n.currentLang === 'en';
    const defaultR1 = "غ ف ر";
    const defaultR2 = "ع ف و";
    const r1 = (root1Param || defaultR1).trim();
    const r2 = (root2Param || defaultR2).trim();

    this.viewContainer.innerHTML = `
      <div style="text-align: center; padding: 3rem 0; color: var(--text-muted);">
        ${i18n.t('loadingCorpus')}
      </div>
    `;

    const [r1Detail, r2Detail, translations] = await Promise.all([
      corpusStore.getRootDetails(r1),
      corpusStore.getRootDetails(r2),
      corpusStore.fetchTranslation(i18n.currentLang)
    ]);

    const topRootsForSelect = this.rootsIndex.slice(0, 300);

    // Compute stats for R1
    const r1Occ = r1Detail?.occurrences || [];
    let r1Meccan = 0;
    let r1Medinan = 0;
    const r1Surahs = new Set();
    r1Occ.forEach(o => {
      r1Surahs.add(o.s);
      const sObj = this.surahs.find(s => (s.number || s.id) === o.s);
      if (sObj?.revelation_type === 'Medinan') r1Medinan++; else r1Meccan++;
    });
    const r1Total = r1Occ.length || 1;
    const r1MeccanPct = Math.round((r1Meccan / r1Total) * 100);
    const r1MedinanPct = 100 - r1MeccanPct;

    // Compute stats for R2
    const r2Occ = r2Detail?.occurrences || [];
    let r2Meccan = 0;
    let r2Medinan = 0;
    const r2Surahs = new Set();
    r2Occ.forEach(o => {
      r2Surahs.add(o.s);
      const sObj = this.surahs.find(s => (s.number || s.id) === o.s);
      if (sObj?.revelation_type === 'Medinan') r2Medinan++; else r2Meccan++;
    });
    const r2Total = r2Occ.length || 1;
    const r2MeccanPct = Math.round((r2Meccan / r2Total) * 100);
    const r2MedinanPct = 100 - r2MeccanPct;

    // Find Co-occurring verses where BOTH roots appear in the same ayah
    const r1VerseMap = new Map();
    r1Occ.forEach(o => {
      const key = `${o.s}:${o.a}`;
      if (!r1VerseMap.has(key)) r1VerseMap.set(key, []);
      r1VerseMap.get(key).push(o);
    });

    const coOccurring = [];
    const seenCoKey = new Set();
    r2Occ.forEach(o2 => {
      const key = `${o2.s}:${o2.a}`;
      if (r1VerseMap.has(key) && !seenCoKey.has(key)) {
        seenCoKey.add(key);
        coOccurring.push({
          s: o2.s,
          a: o2.a,
          r1Tokens: r1VerseMap.get(key),
          r2Token: o2
        });
      }
    });

    const r1Meanings = isEn && r1Detail?.meanings_en?.length ? r1Detail.meanings_en.join(', ') : (r1Detail?.meanings_ms?.join(', ') || '—');
    const r2Meanings = isEn && r2Detail?.meanings_en?.length ? r2Detail.meanings_en.join(', ') : (r2Detail?.meanings_ms?.join(', ') || '—');

    this.viewContainer.innerHTML = `
      <div class="section-title-bar">
        <div>
          <h2 class="section-title">${i18n.t('compareTitle')}</h2>
          <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.25rem;">
            ${i18n.t('compareSubtitle')}
          </p>
        </div>
      </div>

      <div class="compare-box">
        <form id="compareForm" class="compare-selector-grid">
          <div>
            <label style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 600;">${i18n.t('compareRoot1')}</label>
            <input type="text" id="compInput1" class="search-input" value="${r1}" list="rootsList1" style="font-family: var(--font-arabic); font-size: 1.3rem; text-align: center; margin-top: 0.35rem;" required>
            <datalist id="rootsList1">
              ${topRootsForSelect.map(r => `<option value="${r.root}">${r.root} (${(r.meanings_ms || []).slice(0, 2).join(', ')})</option>`).join('')}
            </datalist>
          </div>

          <div class="compare-vs-badge">VS</div>

          <div>
            <label style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 600;">${i18n.t('compareRoot2')}</label>
            <input type="text" id="compInput2" class="search-input" value="${r2}" list="rootsList2" style="font-family: var(--font-arabic); font-size: 1.3rem; text-align: center; margin-top: 0.35rem;" required>
            <datalist id="rootsList2">
              ${topRootsForSelect.map(r => `<option value="${r.root}">${r.root} (${(r.meanings_ms || []).slice(0, 2).join(', ')})</option>`).join('')}
            </datalist>
          </div>
        </form>

        <div style="text-align: center; margin-top: 1rem;">
          <button type="submit" form="compareForm" class="btn-action btn-primary" style="padding: 0.5rem 1.5rem;">
            🔍 ${i18n.t('compareBtn')}
          </button>
        </div>

        <div class="compare-split-grid">
          <!-- Root 1 Stats Card -->
          <div class="compare-col-card">
            <div style="text-align: center; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;">
              <a href="#root/${encodeURIComponent(r1)}" class="root-ar" style="font-size: 2.5rem; text-decoration: none; display: block;">${r1}</a>
              <div style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 0.25rem;">"${r1Meanings}"</div>
            </div>
            <div style="margin-top: 1rem;">
              <div class="compare-stat-row">
                <span style="color: var(--text-muted);">${i18n.t('occurrences')}:</span>
                <strong style="color: var(--accent-gold);">${r1Occ.length}</strong>
              </div>
              <div class="compare-stat-row">
                <span style="color: var(--text-muted);">${i18n.t('uniqueSurahsCount')}:</span>
                <strong>${r1Surahs.size} surah</strong>
              </div>
              <div class="compare-stat-row">
                <span style="color: var(--text-muted);">${i18n.t('meccanRatio')} / ${i18n.t('medinanRatio')}:</span>
                <span>🕌 ${r1MeccanPct}% / 🌴 ${r1MedinanPct}%</span>
              </div>
              <div class="compare-stat-row">
                <span style="color: var(--text-muted);">${i18n.t('verbFormsUsed')}:</span>
                <span style="color: var(--accent-blue);">${(r1Detail?.verb_forms || []).map(v => 'Form ' + v).join(', ') || 'Form I'}</span>
              </div>
            </div>
          </div>

          <!-- Root 2 Stats Card -->
          <div class="compare-col-card">
            <div style="text-align: center; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;">
              <a href="#root/${encodeURIComponent(r2)}" class="root-ar" style="font-size: 2.5rem; text-decoration: none; display: block;">${r2}</a>
              <div style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 0.25rem;">"${r2Meanings}"</div>
            </div>
            <div style="margin-top: 1rem;">
              <div class="compare-stat-row">
                <span style="color: var(--text-muted);">${i18n.t('occurrences')}:</span>
                <strong style="color: var(--accent-gold);">${r2Occ.length}</strong>
              </div>
              <div class="compare-stat-row">
                <span style="color: var(--text-muted);">${i18n.t('uniqueSurahsCount')}:</span>
                <strong>${r2Surahs.size} surah</strong>
              </div>
              <div class="compare-stat-row">
                <span style="color: var(--text-muted);">${i18n.t('meccanRatio')} / ${i18n.t('medinanRatio')}:</span>
                <span>🕌 ${r2MeccanPct}% / 🌴 ${r2MedinanPct}%</span>
              </div>
              <div class="compare-stat-row">
                <span style="color: var(--text-muted);">${i18n.t('verbFormsUsed')}:</span>
                <span style="color: var(--accent-blue);">${(r2Detail?.verb_forms || []).map(v => 'Form ' + v).join(', ') || 'Form I'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Co-occurring Verses Section -->
      <div class="section-title-bar">
        <h3 class="section-title">
          🔗 ${i18n.t('coOccurringVerses')} (<span id="coOccurCount">${coOccurring.length}</span>)
        </h3>
      </div>

      <div class="concordance-list">
        ${coOccurring.length === 0 ? `
          <div style="text-align: center; padding: 3rem 1rem; color: var(--text-muted); background: var(--bg-card); border-radius: var(--radius-md);">
            ${i18n.t('noCoOccurrences')}
          </div>
        ` : coOccurring.map(item => {
          const sObj = this.surahs.find(s => (s.number || s.id) === item.s);
          const sName = sObj ? (isEn ? (sObj.name_latin || sObj.name_ms) : (sObj.name_ms || sObj.name_latin)) : `Surah ${item.s}`;
          const transText = translations?.[String(item.s)]?.[String(item.a)] || '';
          const r1Words = item.r1Tokens.map(t => t.ar).join(' / ');
          const r2Word = item.r2Token.ar;

          return `
            <div class="concordance-item">
              <div class="concordance-header">
                <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
                  <span style="font-weight: 700; color: var(--accent-gold);">
                    ${sName} (${item.s}:${item.a})
                  </span>
                  <span class="badge-sarf badge-vf">${r1}: ${r1Words}</span>
                  <span class="badge-sarf badge-asp">${r2}: ${r2Word}</span>
                </div>
                <a href="https://maktabah-maftoohah.github.io/al-quran/?lang=${i18n.currentLang}#surah/${item.s}/${item.a}" target="_blank" rel="noopener noreferrer" class="btn-action" style="font-size: 0.75rem; padding: 0.2rem 0.5rem;">
                  ${i18n.t('readAyahBtn')}
                </a>
              </div>
              ${transText ? `<div class="concordance-ms" style="margin-top: 0.5rem;">"${transText}"</div>` : ''}
              <div style="margin-top: 0.5rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
                ${item.r1Tokens.map(tok => `
                  <a href="#word/${item.s}:${item.a}:${tok.p}" class="btn-action" style="font-size: 0.75rem;">
                    🔎 ${tok.ar} (${tok.tr}) &bull; ${tok.ms || tok.en}
                  </a>
                `).join('')}
                <a href="#word/${item.s}:${item.a}:${item.r2Token.p}" class="btn-action" style="font-size: 0.75rem;">
                  🔎 ${item.r2Token.ar} (${item.r2Token.tr}) &bull; ${item.r2Token.ms || item.r2Token.en}
                </a>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    document.getElementById('compareForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const in1 = document.getElementById('compInput1').value.trim();
      const in2 = document.getElementById('compInput2').value.trim();
      if (in1 && in2) {
        window.location.hash = `#compare/${encodeURIComponent(in1)}/${encodeURIComponent(in2)}`;
      }
    });
  }

  renderLearnView() {
    const isEn = i18n.currentLang === 'en';
    const top100 = this.rootsIndex.slice(0, 100);
    let cardIdx = 0;
    let quizScore = 0;
    let quizIdx = 0;

    this.viewContainer.innerHTML = `
      <div class="section-title-bar">
        <div>
          <h2 class="section-title">${i18n.t('learnTitle')}</h2>
          <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.25rem;">
            ${i18n.t('learnSubtitle')}
          </p>
        </div>
      </div>

      <div class="learn-tabs">
        <button class="learn-tab active" id="tabFlashcardsBtn">${i18n.t('tabFlashcards')}</button>
        <button class="learn-tab" id="tabQuizBtn">${i18n.t('tabQuiz')}</button>
      </div>

      <!-- Flashcards Container -->
      <div id="flashcardsPane">
        <div style="text-align: center; color: var(--text-muted); font-size: 0.85rem;" id="cardCounter">
          ${i18n.t('cardProgress', { current: 1, total: top100.length })}
        </div>

        <div class="flashcard-wrapper">
          <div class="flashcard" id="flashcardElement" title="${i18n.t('flipCardHint')}">
            <!-- Front Face -->
            <div class="flashcard-face flashcard-front">
              <div style="font-size: 0.85rem; color: var(--accent-gold); font-weight: 700;">
                TOP #${cardIdx + 1} &bull; ${top100[0]?.count || 0} ${i18n.t('occurrences')}
              </div>
              <div class="flashcard-front-ar" id="cardAr">
                ${top100[0]?.root || ''}
              </div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">
                👆 ${i18n.t('flipCardHint')}
              </div>
            </div>

            <!-- Back Face -->
            <div class="flashcard-face flashcard-back">
              <div style="font-size: 0.85rem; color: var(--text-muted);">
                ${top100[0]?.root || ''} &bull; ${top100[0]?.count || 0} ${i18n.t('occurrences')}
              </div>
              <div style="margin: auto 0;">
                <div style="font-size: 1.3rem; font-weight: 700; color: #ffffff;" id="cardMeanings">
                  "${(isEn ? top100[0]?.meanings_en : top100[0]?.meanings_ms)?.slice(0, 3).join(', ') || '—'}"
                </div>
                <div style="margin-top: 0.75rem; font-size: 0.9rem; color: var(--accent-gold); font-family: var(--font-arabic);" id="cardLemmas">
                  ${(top100[0]?.lemmas || []).join(' • ') || '—'}
                </div>
                <div style="margin-top: 0.5rem; font-size: 0.8rem; color: var(--text-secondary);" id="cardSample">
                  Sample: ${top100[0]?.sample?.ar || ''} (${top100[0]?.sample?.tr || ''}) &bull; "${isEn ? top100[0]?.sample?.en : top100[0]?.sample?.ms}"
                </div>
              </div>
              <div>
                <a href="#root/${encodeURIComponent(top100[0]?.root || '')}" class="btn-action" id="cardLexLink" style="font-size: 0.8rem;">
                  ${i18n.t('rootLexiconLink', { root: top100[0]?.root || '' })}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="flashcard-controls">
          <button class="btn-action" id="btnPrevCard">${i18n.t('prevCard')}</button>
          <button class="btn-action" id="btnShuffleCard">${i18n.t('shuffleCards')}</button>
          <button class="btn-action btn-primary" id="btnNextCard">${i18n.t('nextCard')}</button>
        </div>
      </div>

      <!-- Quiz Container -->
      <div id="quizPane" style="display: none;">
        <div class="quiz-card" id="quizCardElement">
          <!-- Quiz populated dynamically -->
        </div>
      </div>
    `;

    // Setup Flashcard Logic
    const cardEl = document.getElementById('flashcardElement');
    cardEl.addEventListener('click', () => {
      cardEl.classList.toggle('flipped');
    });

    const updateCard = () => {
      cardEl.classList.remove('flipped');
      const item = top100[cardIdx];
      if (!item) return;

      document.getElementById('cardCounter').textContent = i18n.t('cardProgress', { current: cardIdx + 1, total: top100.length });
      document.getElementById('cardAr').textContent = item.root;
      const meanings = (isEn && item.meanings_en?.length ? item.meanings_en : item.meanings_ms) || [];
      document.getElementById('cardMeanings').textContent = `"${meanings.slice(0, 3).join(', ') || '—'}"`;
      document.getElementById('cardLemmas').textContent = (item.lemmas || []).join(' • ') || '—';
      const sampleText = item.sample ? `Sample: ${item.sample.ar || ''} (${item.sample.tr || ''}) &bull; "${isEn ? (item.sample.en || item.sample.ms) : (item.sample.ms || item.sample.en)}"` : '';
      document.getElementById('cardSample').innerHTML = sampleText;
      const lexLink = document.getElementById('cardLexLink');
      lexLink.href = `#root/${encodeURIComponent(item.root)}`;
      lexLink.textContent = i18n.t('rootLexiconLink', { root: item.root });
    };

    document.getElementById('btnPrevCard').addEventListener('click', () => {
      cardIdx = (cardIdx - 1 + top100.length) % top100.length;
      updateCard();
    });
    document.getElementById('btnNextCard').addEventListener('click', () => {
      cardIdx = (cardIdx + 1) % top100.length;
      updateCard();
    });
    document.getElementById('btnShuffleCard').addEventListener('click', () => {
      cardIdx = Math.floor(Math.random() * top100.length);
      updateCard();
    });

    // Quiz Questions Generator
    const generateQuizQuestions = () => {
      const questions = [];
      for (let i = 0; i < 10; i++) {
        const correctRoot = top100[(i * 7 + 3) % top100.length];
        const correctMeanings = (isEn && correctRoot.meanings_en?.length ? correctRoot.meanings_en : correctRoot.meanings_ms) || [];
        const correctAns = correctMeanings.slice(0, 2).join(', ') || correctRoot.root;

        const distractors = [];
        let attempts = 0;
        while (distractors.length < 3 && attempts < 50) {
          attempts++;
          const rand = top100[Math.floor(Math.random() * top100.length)];
          const rMeanings = (isEn && rand.meanings_en?.length ? rand.meanings_en : rand.meanings_ms) || [];
          const text = rMeanings.slice(0, 2).join(', ');
          if (rand.root !== correctRoot.root && text && !distractors.includes(text) && text !== correctAns) {
            distractors.push(text);
          }
        }

        const choices = [correctAns, ...distractors].sort(() => Math.random() - 0.5);
        questions.push({
          root: correctRoot.root,
          correct: correctAns,
          choices: choices
        });
      }
      return questions;
    };

    const quizQuestions = generateQuizQuestions();

    const renderQuizQuestion = () => {
      const q = quizQuestions[quizIdx];
      const qPane = document.getElementById('quizCardElement');
      if (!q) {
        qPane.innerHTML = `
          <div style="text-align: center; padding: 2rem 1rem;">
            <div style="font-size: 3rem;">🏆</div>
            <h3 style="color: var(--accent-gold); margin-top: 0.5rem;">Tahniah! Kuiz Selesai!</h3>
            <p style="font-size: 1.2rem; margin-top: 0.5rem; color: var(--text-primary);">
              ${i18n.t('quizScore')} <strong>${quizScore} / ${quizQuestions.length}</strong>
            </p>
            <button class="btn-action btn-primary" id="btnRestartQuiz" style="margin-top: 1.5rem; padding: 0.5rem 1.5rem;">
              ${i18n.t('quizRestart')}
            </button>
          </div>
        `;
        document.getElementById('btnRestartQuiz')?.addEventListener('click', () => {
          quizScore = 0;
          quizIdx = 0;
          renderQuizQuestion();
        });
        return;
      }

      qPane.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 0.85rem; color: var(--accent-gold); font-weight: 700;">
            ${i18n.t('quizQuestion')} ${quizIdx + 1} / ${quizQuestions.length}
          </span>
          <span style="font-size: 0.85rem; color: var(--text-muted);">
            ${i18n.t('quizScore')} ${quizScore}
          </span>
        </div>

        <div style="text-align: center; margin: 1.5rem 0;">
          <p style="color: var(--text-secondary); font-size: 0.95rem;">
            ${isEn ? 'What is the primary meaning of the Quranic root:' : 'Apakah makna utama bagi akar kata Al-Quran:'}
          </p>
          <div style="font-family: var(--font-arabic); font-size: 3.5rem; color: var(--accent-gold); margin-top: 0.25rem;">
            ${q.root}
          </div>
        </div>

        <div class="quiz-options-grid">
          ${q.choices.map((c) => `
            <button class="quiz-option-btn" data-choice="${c.replace(/"/g, '&quot;')}">
              ${c}
            </button>
          `).join('')}
        </div>

        <div id="quizFeedbackBox" style="margin-top: 1.5rem; text-align: center; display: none;">
          <button class="btn-action btn-primary" id="btnNextQuiz" style="padding: 0.5rem 1.5rem;">
            ${i18n.t('quizNext')}
          </button>
        </div>
      `;

      let answered = false;
      qPane.querySelectorAll('.quiz-option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          if (answered) return;
          answered = true;
          const choice = btn.getAttribute('data-choice');
          const isCorrect = choice === q.correct;

          if (isCorrect) {
            quizScore++;
            btn.classList.add('correct');
          } else {
            btn.classList.add('wrong');
            qPane.querySelectorAll('.quiz-option-btn').forEach(b => {
              if (b.getAttribute('data-choice') === q.correct) b.classList.add('correct');
            });
          }

          document.getElementById('quizFeedbackBox').style.display = 'block';
          document.getElementById('btnNextQuiz').addEventListener('click', () => {
            quizIdx++;
            renderQuizQuestion();
          });
        });
      });
    };

    // Tab switcher
    const tabFlash = document.getElementById('tabFlashcardsBtn');
    const tabQuiz = document.getElementById('tabQuizBtn');
    const pFlash = document.getElementById('flashcardsPane');
    const pQuiz = document.getElementById('quizPane');

    tabFlash.addEventListener('click', () => {
      tabFlash.classList.add('active');
      tabQuiz.classList.remove('active');
      pFlash.style.display = 'block';
      pQuiz.style.display = 'none';
    });

    tabQuiz.addEventListener('click', () => {
      tabQuiz.classList.add('active');
      tabFlash.classList.remove('active');
      pFlash.style.display = 'none';
      pQuiz.style.display = 'block';
      renderQuizQuestion();
    });
  }
}

window.corpusApp = new CorpusApp();
document.addEventListener('DOMContentLoaded', () => {
  window.corpusApp.init();
});
