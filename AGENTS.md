# Project Invariants: Maktabah Maftoohah Korpus Al-Quran (Bahasa Melayu)

## Core Architectural Invariants
1. **GitHub Pages Subpath Compatibility**:
   - All network requests for assets and data MUST use strictly relative paths (`./data/...`, `./css/...`, `./js/...`).
   - Root absolute paths (e.g. `/data/...`) break under subpath hosting (`https://maktabah-maftoohah.github.io/korpus-quran/`).

2. **Encoding & File Standards**:
   - All text files (JSON, JS, CSS, HTML, MD, PY) MUST strictly use UTF-8 encoding without BOM.
   - Python output operations MUST specify `encoding="utf-8"` and `ensure_ascii=False`.

3. **Zero-Build ES6 Architecture**:
   - Modern browser vanilla ES6 modules (`import` / `export`) only.
   - Zero compilation, bundling, or external npm runtime dependencies.
   - Entry point loaded via `<script type="module" src="./js/app.js"></script>`.

4. **Language & Focus**:
   - Primary language is **Bahasa Melayu (Nusantara)** with accurate Arabic grammatical terms (*I'rab, Tasrif, Kata Nama/Isim, Kata Kerja/Fi'il, Harf*).
   - Deep-linking compatibility with Maktabah Maftoohah Al-Quran: `#word/{surah}:{ayah}:{token}` and `#root/{root}`.

5. **Verification & Testing**:
   - Project Integrity: `python scripts/verify_project.py`.
   - Browser QA Suite: `npm test` (`node scripts/test_qa.js`).
