/**
 * Maktabah Maftoohah Korpus Al-Quran - Analytics Module (analytics.js)
 * Google Analytics 4 (GA4) integration with SPA virtual pageview tracking
 * and specialized linguistic/grammatical corpus metrics.
 * 
 * Invariants:
 * - Zero external build dependencies (Vanilla ES6).
 * - Offline-first resilient: fails silently when offline without throwing errors.
 * - Respects Do Not Track (DNT) header.
 * - Privacy-respecting: IP anonymization enabled.
 */

// Default Measurement ID placeholder (Replace with production GA4 ID or configure in localStorage)
const DEFAULT_MEASUREMENT_ID = 'G-XXXXXXXXXX';

class AnalyticsService {
  constructor() {
    this.initialized = false;
    this.measurementId = null;
    this.lastTrackedPath = null;
  }

  /**
   * Retrieves the active Measurement ID (localStorage override or default placeholder).
   */
  getMeasurementId() {
    try {
      const stored = localStorage.getItem('maktabah_ga_id');
      if (stored && stored.trim()) return stored.trim();
    } catch {
      // ignore localStorage restriction
    }
    return DEFAULT_MEASUREMENT_ID;
  }

  /**
   * Initialize GA4 snippet dynamically if measurement ID is valid and not a placeholder.
   */
  init(customId = null) {
    if (this.initialized) return;

    this.measurementId = customId || this.getMeasurementId();

    // Do nothing if placeholder or unset
    if (!this.measurementId || this.measurementId === 'G-XXXXXXXXXX' || !this.measurementId.startsWith('G-')) {
      return;
    }

    // Respect Do-Not-Track
    if (typeof navigator !== 'undefined') {
      const dnt = navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack;
      if (dnt === '1' || dnt === 'yes') {
        return;
      }
    }

    // Avoid network request when offline
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      if (typeof window !== 'undefined') {
        window.addEventListener('online', () => this.init(this.measurementId), { once: true });
      }
      return;
    }

    try {
      window.dataLayer = window.dataLayer || [];
      window.gtag = window.gtag || function() {
        window.dataLayer.push(arguments);
      };

      window.gtag('js', new Date());
      // send_page_view: false allows explicit SPA router pageview tracking
      window.gtag('config', this.measurementId, {
        send_page_view: false,
        anonymize_ip: true,
        cookie_flags: 'SameSite=None;Secure'
      });

      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
      script.onerror = () => {
        // Offline or blocked by privacy extensions - fail silently
      };
      document.head.appendChild(script);

      this.initialized = true;

      // Track initial route once DOM is ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.trackCurrentRoute());
      } else {
        this.trackCurrentRoute();
      }
    } catch {
      // Safe fail
    }
  }

  /**
   * Dispatches custom event to GA4 safely.
   */
  trackEvent(eventName, params = {}) {
    if (!this.initialized || typeof window.gtag !== 'function') return;
    try {
      window.gtag('event', eventName, {
        ...params,
        app_name: 'Maktabah Maftoohah Korpus Al-Quran'
      });
    } catch {
      // Silent error handling for offline/sandboxed contexts
    }
  }

  /**
   * Tracks a virtual pageview for SPA hash routes (e.g. /korpus-quran/#root/ر ح م).
   */
  trackPageView(pagePath, pageTitle) {
    if (!this.initialized || typeof window.gtag !== 'function') return;

    const path = pagePath || (window.location.pathname + (window.location.hash || '#home'));
    if (path === this.lastTrackedPath) return;
    this.lastTrackedPath = path;

    const title = pageTitle || document.title || 'Maktabah Maftoohah Korpus Al-Quran';

    try {
      window.gtag('event', 'page_view', {
        page_path: path,
        page_title: title,
        page_location: window.location.href
      });
    } catch {
      // Safe fail
    }
  }

  trackCurrentRoute() {
    this.trackPageView(window.location.pathname + (window.location.hash || '#home'));
  }

  // Specialized Linguistic & Corpus Event Helpers
  trackNav(sectionName) {
    this.trackEvent('nav_section', {
      section: sectionName
    });
  }

  trackRootSearch(root, occurrences = 0) {
    if (!root) return;
    this.trackEvent('view_root', {
      root_arabic: root,
      occurrences: Number(occurrences)
    });
  }

  trackWordInspect(surah, ayah, wordIndex, pos = '') {
    this.trackEvent('inspect_word_grammar', {
      surah_number: Number(surah),
      ayah_number: Number(ayah),
      word_index: Number(wordIndex),
      part_of_speech: pos
    });
  }

  trackThemeSelect(themeKey) {
    this.trackEvent('select_theme', {
      theme_key: themeKey
    });
  }

  trackCompare(root1, root2) {
    this.trackEvent('compare_roots', {
      root1,
      root2
    });
  }

  trackQuizComplete(score, total) {
    this.trackEvent('complete_quiz', {
      score: Number(score),
      total: Number(total),
      percentage: total > 0 ? Math.round((score / total) * 100) : 0
    });
  }
}

export const analytics = new AnalyticsService();
