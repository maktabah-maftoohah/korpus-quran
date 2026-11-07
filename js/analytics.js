/**
 * Maktabah Maftoohah Korpus Al-Quran - Analytics Module (analytics.js)
 * Google Tag Manager (GTM) and Google Analytics 4 (GA4) integration
 * with SPA virtual pageview tracking and specialized linguistic/grammatical corpus metrics.
 * 
 * Invariants:
 * - Zero external build dependencies (Vanilla ES6).
 * - Offline-first resilient: fails silently when offline without throwing errors.
 * - Respects Do Not Track (DNT) header.
 * - Dual GTM dataLayer & gtag compatibility.
 */

// Google Tag Manager Container ID
const DEFAULT_CONTAINER_ID = 'GTM-NGTG26SD';

class AnalyticsService {
  constructor() {
    this.initialized = false;
    this.containerId = null;
    this.lastTrackedPath = null;
  }

  /**
   * Retrieves the active Container/Measurement ID (localStorage override or default).
   */
  getContainerId() {
    try {
      const stored = localStorage.getItem('maktabah_ga_id');
      if (stored && stored.trim()) return stored.trim();
    } catch {
      // ignore localStorage restriction
    }
    return DEFAULT_CONTAINER_ID;
  }

  /**
   * Initialize GTM/GA4 snippet dynamically if container ID is valid and not a placeholder.
   */
  init(customId = null) {
    if (this.initialized) return;

    this.containerId = customId || this.getContainerId();

    // Do nothing if placeholder or unset
    if (!this.containerId || this.containerId === 'G-XXXXXXXXXX') {
      return;
    }

    // Respect Do-Not-Track
    if (typeof navigator !== 'undefined') {
      const dnt = navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack;
      if (dnt === '1' || dnt === 'yes') {
        return;
      }
    }

    // Ensure dataLayer & gtag exist
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function() {
      window.dataLayer.push(arguments);
    };

    // Check if GTM or GA4 is already embedded in the DOM via static script tag
    const existingScript = document.querySelector('script[src*="googletagmanager.com/gtm.js"], script[src*="googletagmanager.com/gtag/js"]');

    if (!existingScript) {
      // Avoid network request when offline
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        if (typeof window !== 'undefined') {
          window.addEventListener('online', () => this.init(this.containerId), { once: true });
        }
        return;
      }

      try {
        const isGtm = this.containerId.startsWith('GTM-');
        const scriptUrl = isGtm
          ? `https://www.googletagmanager.com/gtm.js?id=${this.containerId}`
          : `https://www.googletagmanager.com/gtag/js?id=${this.containerId}`;

        if (!isGtm) {
          window.gtag('js', new Date());
          window.gtag('config', this.containerId, {
            send_page_view: false,
            anonymize_ip: true,
            cookie_flags: 'SameSite=None;Secure'
          });
        }

        const script = document.createElement('script');
        script.async = true;
        script.src = scriptUrl;
        script.onerror = () => {};
        document.head.appendChild(script);
      } catch {
        // Safe fail
      }
    }

    this.initialized = true;

    // Track initial route once DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.trackCurrentRoute());
    } else {
      this.trackCurrentRoute();
    }
  }

  /**
   * Dispatches custom event to GTM dataLayer and GA4 safely.
   */
  trackEvent(eventName, params = {}) {
    const payload = {
      ...params,
      app_name: 'Maktabah Maftoohah Korpus Al-Quran'
    };

    // Push event to GTM dataLayer
    try {
      if (typeof window !== 'undefined' && Array.isArray(window.dataLayer)) {
        window.dataLayer.push({
          event: eventName,
          ...payload
        });
      }
    } catch {
      // Silent error handling for offline/sandboxed contexts
    }

    // Also call gtag if present
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      try {
        window.gtag('event', eventName, payload);
      } catch {
        // Silent
      }
    }
  }

  /**
   * Tracks a virtual pageview for SPA hash routes (e.g. /korpus-quran/#root/ر ح م).
   */
  trackPageView(pagePath, pageTitle) {
    const path = pagePath || (window.location.pathname + (window.location.hash || '#home'));
    if (path === this.lastTrackedPath) return;
    this.lastTrackedPath = path;

    const title = pageTitle || document.title || 'Maktabah Maftoohah Korpus Al-Quran';
    const payload = {
      page_path: path,
      page_title: title,
      page_location: window.location.href,
      app_name: 'Maktabah Maftoohah Korpus Al-Quran'
    };

    // Push to GTM dataLayer
    try {
      if (typeof window !== 'undefined' && Array.isArray(window.dataLayer)) {
        window.dataLayer.push({
          event: 'page_view',
          ...payload
        });
      }
    } catch {
      // Safe fail
    }

    // Dispatch via gtag
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      try {
        window.gtag('event', 'page_view', payload);
      } catch {
        // Safe fail
      }
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
