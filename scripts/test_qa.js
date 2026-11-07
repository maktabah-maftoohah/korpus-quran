import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');
const PORT = 8111;

let chromium;
try {
  const pw = await import('playwright');
  chromium = pw.chromium;
} catch {
  const fallbackPath = path.join(ROOT, '..', 'al-quran', 'node_modules', 'playwright', 'index.mjs');
  const pw = await import(`file://${fallbackPath.replace(/\\/g, '/')}`);
  chromium = pw.chromium;
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png'
};

function createServer() {
  return http.createServer((req, res) => {
    let reqPath = decodeURIComponent(req.url.split('?')[0]);
    if (reqPath === '/') reqPath = '/index.html';
    const filePath = path.join(ROOT, reqPath.replace(/^\//, ''));

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, {
        'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
        'Access-Control-Allow-Origin': '*'
      });
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  });
}

async function runTests() {
  const server = createServer();
  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`Server test berjalan di http://localhost:${PORT}`);

  const chromePath = [
    process.env.CHROME_BIN,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
  ].find(p => p && fs.existsSync(p));

  const launchOptions = { headless: true };
  if (chromePath) {
    launchOptions.executablePath = chromePath;
  }

  const browser = await chromium.launch(launchOptions);
  const page = await browser.newPage();
  let passed = 0;
  let failed = 0;

  function assert(condition, desc) {
    if (condition) {
      console.log(`  [PASS] ${desc}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${desc}`);
      failed++;
    }
  }

  try {
    console.log('\n[TEST 1] Memuatkan Laman Utama (Home View - Malay Default)');
    await page.goto(`http://localhost:${PORT}/index.html#home`, { waitUntil: 'networkidle' });
    const title = await page.title();
    assert(title.includes('Korpus Al-Quran'), `Tajuk dokumen sah: "${title}"`);

    const hero = await page.$('.hero-box h2');
    const heroText = await hero.textContent();
    assert(heroText.includes('Korpus Al-Quran'), `Hero tajuk dipaparkan: "${heroText}"`);

    const stats = await page.$$('.stat-card');
    assert(stats.length === 4, `4 kad statistik dipaparkan`);

    console.log('\n[TEST 2] Navigasi Mu\'jam Akar Kata (#roots)');
    await page.goto(`http://localhost:${PORT}/index.html#roots`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.root-card');
    const rootCards = await page.$$('.root-card');
    assert(rootCards.length > 50, `Akar kata dipaparkan dalam grid (ditemui: ${rootCards.length})`);

    console.log('\n[TEST 3] Paparan Terperinci Akar Kata (#root/ر ح م)');
    await page.goto(`http://localhost:${PORT}/index.html#root/%D8%B1%20%D8%AD%20%D9%85`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.word-banner-card');
    const rootBanner = await page.$('.word-ar-display');
    const rootText = await rootBanner.textContent();
    assert(rootText.includes('ر ح م'), `Akar kata ر ح م dipaparkan: "${rootText}"`);

    const concordanceItems = await page.$$('.concordance-item');
    assert(concordanceItems.length > 100, `Konkordans ayat dipaparkan (${concordanceItems.length} ayat)`);

    console.log('\n[TEST 4] Paparan Analisis Kalimah & I\'rab (#word/1:1:1)');
    await page.goto(`http://localhost:${PORT}/index.html#word/1:1:1`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.grammar-grid');
    const wordDisplay = await page.$('.word-ar-display');
    const wordText = await wordDisplay.textContent();
    assert(wordText.includes('بِسْمِ'), `Kalimah 1:1:1 dipaparkan: "${wordText}"`);

    const grammarCards = await page.$$('.grammar-card');
    assert(grammarCards.length >= 4, `4 kad tatabahasa & I'rab lengkap dipaparkan`);

    console.log('\n[TEST 5] Paparan Daftar Surah (#surahs) & Tiada Nilai "undefined"');
    await page.goto(`http://localhost:${PORT}/index.html#surahs`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.root-card');
    const surahCards = await page.$$('.root-card');
    assert(surahCards.length === 114, `Tepat 114 Surah dipaparkan dalam direktori, ditemui: ${surahCards.length}`);

    const firstCardText = await surahCards[0].textContent();
    assert(firstCardText.includes('#1') && firstCardText.includes('Al-Fatihah') && firstCardText.includes('7 ayat'), 
      `Kad Surah 1 sah (#1, Al-Fatihah, 7 ayat): "${firstCardText.replace(/\s+/g, ' ').trim()}"`);
    assert(!firstCardText.includes('undefined'), `Kad Surah 1 TIADA teks "undefined"`);

    const pageContent = await page.content();
    assert(!pageContent.includes('undefined'), `Seluruh halaman #surahs bebas daripada teks "undefined"`);

    console.log('\n[TEST 5B] Peneroka Surah (#surah/1)');
    await page.goto(`http://localhost:${PORT}/index.html#surah/1`, { waitUntil: 'networkidle' });
    const surahHeader = await page.$('.section-title');
    const surahHeaderText = await surahHeader.textContent();
    assert(surahHeaderText.includes('Al-Fatihah') && surahHeaderText.toLowerCase().includes('7 ayat'), 
      `Peneroka Surah 1 sah: "${surahHeaderText.trim()}"`);
    assert(!surahHeaderText.includes('undefined'), `Peneroka Surah 1 bebas daripada "undefined"`);

    console.log('\n[TEST 6] Suis Bahasa ke Bahasa Inggeris (MY / EN Localization)');
    await page.goto(`http://localhost:${PORT}/index.html#home`, { waitUntil: 'networkidle' });
    const langBtn = await page.$('#btnLangToggle');
    assert(langBtn !== null, 'Butang pertukaran bahasa wujud');
    await langBtn.click();
    await page.waitForTimeout(100);

    const newLangText = await langBtn.textContent();
    assert(newLangText === 'MY', `Bahasa berjaya ditukar ke Bahasa Inggeris (butang pamer: "${newLangText}")`);

    const enTitle = await page.title();
    assert(enTitle.includes('Quranic Linguistic Corpus'), `Tajuk Bahasa Inggeris tepat: "${enTitle}"`);
    const brandHeading = await page.$('.brand-text h1');
    const brandVal = await brandHeading.textContent();
    assert(brandVal.includes('Quranic Linguistic Corpus'), `Brand tajuk EN tepat: "${brandVal}"`);

    // Check Read Al-Quran button translated
    const readQuranBtn = await page.$('a[data-i18n="readQuranBtn"]');
    const readQuranText = await readQuranBtn.textContent();
    assert(readQuranText.includes('Read Al-Quran'), `Butang header diterjemah: "${readQuranText.trim()}"`);

    // Check Home Section Headings
    const frequentRootsTitle = await page.$('.section-title');
    const frequentRootsText = await frequentRootsTitle.textContent();
    assert(frequentRootsText.includes('Most Frequent Roots'), `Tajuk seksyen diterjemah: "${frequentRootsText.trim()}"`);

    const viewAllLink = await page.$('.section-title-bar a.btn-action');
    const viewAllText = await viewAllLink.textContent();
    assert(viewAllText.includes('View All 1,651 Roots'), `Pautan akar kata diterjemah: "${viewAllText.trim()}"`);

    // Check Root Cards in EN
    const firstRootCard = await page.$('.root-card');
    const cardBadge = await firstRootCard.$('.root-count-badge');
    const badgeText = await cardBadge.textContent();
    assert(badgeText.includes('occurrences'), `Lencana kemunculan dalam EN pamer 'occurrences': "${badgeText.trim()}"`);

    const cardMeanings = await firstRootCard.$('.root-meanings');
    const meaningsText = await cardMeanings.textContent();
    assert(meaningsText.toLowerCase().includes('allah') || meaningsText.toLowerCase().includes('god'), 
      `Makna akar kata terpapar dalam Bahasa Inggeris: "${meaningsText.trim()}"`);

    console.log('\n[TEST 7] Analisis Kalimah & I\'rab dalam Bahasa Inggeris (#word/1:1:1)');
    await page.goto(`http://localhost:${PORT}/index.html#word/1:1:1`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.grammar-grid');

    const wordGloss = await page.$('.word-gloss-display');
    const glossText = await wordGloss.textContent();
    assert(glossText.toLowerCase().includes('name'), `Glos kalimah dalam EN terpapar: "${glossText.trim()}"`);

    const posVal = await page.$('.grammar-card-val');
    const posValText = await posVal.textContent();
    assert(posValText.includes('Preposition') || posValText.includes('Noun'), 
      `Kelas kata (POS) diterjemah dalam EN: "${posValText.trim()}"`);

    const fullVerseTrans = await page.$('.concordance-ms');
    const fullVerseTransText = await fullVerseTrans.textContent();
    assert(fullVerseTransText.includes('In the name of Allah'), 
      `Konteks ayat menggunakan terjemahan Sahih International: "${fullVerseTransText.trim()}"`);

    console.log('\n[TEST 8] Direktori Surah dalam Bahasa Inggeris (#surahs)');
    await page.goto(`http://localhost:${PORT}/index.html#surahs`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.root-card');
    const enSurahCards = await page.$$('.root-card');
    const firstEnCardText = await enSurahCards[0].textContent();
    assert(firstEnCardText.includes('verses') && firstEnCardText.includes('Meccan'), 
      `Kad Surah dalam EN pamer 'verses • Meccan': "${firstEnCardText.replace(/\s+/g, ' ').trim()}"`);

    console.log('\n[TEST 9] Sinkronisasi Bahasa Merentasi Projek (?lang=en dan ?lang=ms)');
    await page.goto(`http://localhost:${PORT}/index.html?lang=en#word/1:1:1`, { waitUntil: 'networkidle' });
    const coldTitle = await page.title();
    assert(coldTitle.includes('Quranic Linguistic Corpus'), `Buka terus dengan ?lang=en memaparkan tajuk EN: "${coldTitle}"`);
    const coldHeaderLink = await page.$('#headerQuranLink');
    const coldHeaderHref = await coldHeaderLink.getAttribute('href');
    assert(coldHeaderHref.includes('lang=en'), `Pautan kembali ke Al-Quran membawa parameter lang=en: "${coldHeaderHref}"`);

    console.log('\n[TEST 10] Tier 5 & 6: Sarf & Awzan al-Fi\'il (#word/1:5:2 dan #word/1:5:4)');
    await page.goto(`http://localhost:${PORT}/index.html#word/1:5:2`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.grammar-grid');
    const sarfHeader = await page.$('.section-title-bar h3');
    const pageText = await page.content();
    assert(pageText.includes('Sarf') || pageText.includes('Morfologi'), `Seksyen Sarf Lanjutan terpapar`);
    assert(pageText.includes('Form I') || pageText.includes('Bentuk I'), `Wazan Form I dikesan pada 1:5:2`);
    assert(pageText.includes('Mudhari') || pageText.includes('Imperfect'), `Kala Mudhari' dikesan pada 1:5:2`);
    assert(pageText.includes('Ma\'lum') || pageText.includes('Active'), `Ragam Ma'lum / Active dikesan pada 1:5:2`);

    await page.goto(`http://localhost:${PORT}/index.html#word/1:5:4`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.grammar-grid');
    const s154Text = await page.content();
    assert(s154Text.includes('Form X') || s154Text.includes('Bentuk X') || s154Text.includes('اِسْتَفْعَلَ'), 
      `Wazan Form X (Istaf'ala) dikesan pada 1:5:4 (nasta'een)`);

    console.log('\n[TEST 11] Tier 7 & 8: Penapis Carian Konkordans & Eksport Data (#root/ع ب د)');
    await page.goto(`http://localhost:${PORT}/index.html#root/%D8%B9%20%D8%A8%20%D8%AF`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.filter-pill');
    const filterPills = await page.$$('.filter-pill');
    assert(filterPills.length >= 4, `Penapis linguistik konkordans dipaparkan (jumlah: ${filterPills.length})`);

    const initialCountEl = await page.$('#concordanceCount');
    const initialCount = parseInt(await initialCountEl.textContent(), 10);
    assert(initialCount > 100, `Jumlah rekod awal konkordans sah: ${initialCount}`);

    const verbFilterBtn = await page.$('.filter-pill[data-filter="verb"]');
    await verbFilterBtn.click();
    await page.waitForTimeout(100);
    const verbFilteredCount = parseInt(await (await page.$('#concordanceCount')).textContent(), 10);
    assert(verbFilteredCount > 0 && verbFilteredCount <= initialCount, 
      `Penapis kata kerja berfungsi, rekod dikurangkan ke: ${verbFilteredCount}`);

    const btnCsv = await page.$('#btnExportCsv');
    assert(btnCsv !== null, 'Butang eksport CSV wujud');
    const btnJson = await page.$('#btnExportJson');
    assert(btnJson !== null, 'Butang eksport JSON wujud');

    console.log('\n[TEST 12] Feature 1 & 7: Taburan Makkiyyah/Madaniyyah & Cetak Lembaran (#root/ر ح م)');
    await page.goto(`http://localhost:${PORT}/index.html#root/%D8%B1%20%D8%AD%20%D9%85`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.dist-card');
    const distCard = await page.$('.dist-card');
    assert(distCard !== null, 'Kad taburan kekerapan wujud');
    const distMeccan = await page.$('.dist-seg-meccan');
    assert(distMeccan !== null, 'Segmen peratusan Makkiyyah terpapar');
    const surahChips = await page.$$('.dist-chip');
    assert(surahChips.length > 0, `Cip surah paling kerap dipaparkan (jumlah: ${surahChips.length})`);
    const btnPrint = await page.$('#btnPrintSheet');
    assert(btnPrint !== null, 'Butang Cetak Lembaran wujud');

    console.log('\n[TEST 13] Feature 4: Rujukan Mu\'jam & Kamus Klasik Arab (Lane, Lisan, Wasit)');
    const lexiconCards = await page.$$('.lexicon-card');
    assert(lexiconCards.length === 3, `3 kad mu'jam klasik Arab dipaparkan (Lane, Lisan al-Arab, Al-Mu'jam al-Wasit)`);
    const laneLink = await page.$('.lexicon-card a[href*="ejtaal.net"]');
    assert(laneLink !== null, 'Pautan Lane\'s Lexicon disahkan');
    const almaanyLink = await page.$('.lexicon-card a[href*="almaany.com"]');
    assert(almaanyLink !== null, 'Pautan Lisan al-\'Arab / Almaany disahkan');

    console.log('\n[TEST 14] Feature 2: Perbandingan Dua Akar Kata (#compare)');
    await page.goto(`http://localhost:${PORT}/index.html#compare/%D8%BA%20%D9%81%20%D8%B1/%D8%B9%20%D9%81%20%D9%88`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.compare-split-grid');
    const compareCols = await page.$$('.compare-col-card');
    assert(compareCols.length === 2, '2 kad perbandingan sebelah-menyebelah dipaparkan');
    const compareText = await page.content();
    assert(compareText.includes('غ ف ر') && compareText.includes('ع ف و'), 'Kedua-dua akar kata dipaparkan');
    const coOccurEl = await page.$('#coOccurCount');
    const coOccurCount = parseInt(await coOccurEl.textContent(), 10);
    assert(coOccurCount > 0, `Ayat musytarakah berjaya dikesan (ditemui: ${coOccurCount} ayat)`);

    console.log('\n[TEST 15] Feature 5: Pusat Ulang Kaji & Kuiz (#learn)');
    await page.goto(`http://localhost:${PORT}/index.html#learn`, { waitUntil: 'networkidle' });
    await page.waitForSelector('#flashcardElement');
    const flashcard = await page.$('#flashcardElement');
    assert(flashcard !== null, 'Kad imbasan wujud');
    await flashcard.click();
    const isFlipped = await page.$eval('#flashcardElement', el => el.classList.contains('flipped'));
    assert(isFlipped === true, 'Kad imbasan berjaya dibalikkan (3D flip effect aktif)');

    // Tab Kuiz
    const tabQuiz = await page.$('#tabQuizBtn');
    await tabQuiz.click();
    await page.waitForSelector('.quiz-options-grid');
    const quizOptions = await page.$$('.quiz-option-btn');
    assert(quizOptions.length === 4, '4 pilihan jawapan kuiz dipaparkan');
    await quizOptions[0].click();
    await page.waitForSelector('#quizFeedbackBox', { state: 'visible' });
    const feedbackBoxVisible = await page.$eval('#quizFeedbackBox', el => el.style.display !== 'none');
    assert(feedbackBoxVisible === true, 'Maklum balas kuiz terpapar serta-merta');

    console.log('\n[TEST 16] Feature 6: Pengelompokan Tema Semantik (#roots)');
    await page.goto(`http://localhost:${PORT}/index.html#roots`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.theme-pill');
    const themePills = await page.$$('.theme-pill');
    assert(themePills.length >= 8, `8 pil tema semantik Al-Quran dipaparkan (jumlah: ${themePills.length})`);
    const ibadahPill = await page.$('.theme-pill[data-theme="ibadah"]');
    await ibadahPill.click();
    await page.waitForTimeout(100);
    const filteredRootsContent = await page.$eval('#rootsGridTarget', el => el.textContent);
    assert(filteredRootsContent.includes('ص ل و') || filteredRootsContent.includes('ص و م'), 
      'Akar kata ditapis mengikut domain semantik Ibadah & Syariat');

    console.log('\n[TEST 17] Feature 3: Audio Sebutan Kalimah pada Konkordans');
    await page.goto(`http://localhost:${PORT}/index.html#root/%D8%B1%20%D8%AD%20%D9%85`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.concordance-item button[title*="Sebutan"], .concordance-item button[title*="Pronunciation"]');
    const concAudioBtns = await page.$$('.concordance-item button[title*="Sebutan"], .concordance-item button[title*="Pronunciation"]');
    assert(concAudioBtns.length > 0, `Butang audio sebutan kalimah hadir dalam konkordans (jumlah: ${concAudioBtns.length})`);

    console.log('\n' + '='.repeat(50));
    console.log(`JUMLAH UJIAN: ${passed + failed}`);
    console.log(`LULUS: ${passed}`);
    console.log(`GAGAL: ${failed}`);
    console.log('='.repeat(50));

    if (failed > 0) {
      process.exit(1);
    }
  } finally {
    await browser.close();
    server.close();
  }
}

runTests().catch((err) => {
  console.error('Ralat ujian:', err);
  process.exit(1);
});
