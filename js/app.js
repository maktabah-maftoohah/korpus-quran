/**
 * Maktabah Maftoohah — Korpus Al-Quran
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

    this.viewContainer.innerHTML = `
      <div class="section-title-bar">
        <div>
          <h2 class="section-title">${i18n.t('navRoots')}</h2>
          <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.25rem;">
            ${i18n.t('rootDesc')}
          </p>
        </div>
      </div>

      <div class="search-wrapper" style="margin: 0 0 1.5rem 0; max-width: 100%;">
        <input type="text" id="rootFilterInput" class="search-input" placeholder="${i18n.t('filterPlaceholder')}" value="${initialQuery}">
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

    const meaningsList = isEn && rootDetail.meanings_en?.length ? rootDetail.meanings_en : (rootDetail.meanings_ms || []);
    const meanings = meaningsList.join(', ') || '—';
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
            📊 ${rootDetail.count} ${i18n.t('occurrencesInQuran')}
          </span>
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
        <div style="display: flex; gap: 0.5rem;">
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
          <button class="btn-action btn-primary" onclick="window.corpusApp.playPronounce(${s}, ${a}, ${p})">
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
}

window.corpusApp = new CorpusApp();
document.addEventListener('DOMContentLoaded', () => {
  window.corpusApp.init();
});
