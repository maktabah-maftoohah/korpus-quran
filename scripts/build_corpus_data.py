import os
import json
import re
from pathlib import Path
from collections import defaultdict

SRC_DIR = Path(r"d:\GitHub\maktabah-maftoohah\al-quran")
DEST_DIR = Path(r"d:\GitHub\maktabah-maftoohah\korpus-quran")

def normalize_arabic(text):
    if not text:
        return ""
    text = re.sub(r'[\u064B-\u065F\u0670\u06D6-\u06ED]', '', text)
    text = re.sub(r'[إأآٱ]', 'ا', text)
    text = re.sub(r'ة', 'ه', text)
    text = re.sub(r'ى', 'ي', text)
    return text.strip()

def main():
    print("Building Korpus Al-Quran dataset...")
    data_dir = DEST_DIR / "data"
    data_dir.mkdir(parents=True, exist_ok=True)
    (data_dir / "morphology").mkdir(parents=True, exist_ok=True)
    (data_dir / "translations" / "ms").mkdir(parents=True, exist_ok=True)
    (data_dir / "arabic").mkdir(parents=True, exist_ok=True)

    # 1. Copy surahs.json
    surahs_src = SRC_DIR / "data" / "surahs.json"
    surahs_dest = data_dir / "surahs.json"
    with open(surahs_src, "r", encoding="utf-8") as f:
        surahs = json.load(f)
    with open(surahs_dest, "w", encoding="utf-8") as f:
        json.dump(surahs, f, ensure_ascii=False, indent=2)
    print(f"Copied {len(surahs)} surahs to {surahs_dest}")

    # 2. Copy Basmeih (MS) and Sahih (EN) translations
    (data_dir / "translations" / "ms").mkdir(parents=True, exist_ok=True)
    (data_dir / "translations" / "en").mkdir(parents=True, exist_ok=True)

    basmeih_src = SRC_DIR / "data" / "translations" / "ms" / "basmeih.json"
    basmeih_dest = data_dir / "translations" / "ms" / "basmeih.json"
    with open(basmeih_src, "r", encoding="utf-8") as f:
        basmeih = json.load(f)
    with open(basmeih_dest, "w", encoding="utf-8") as f:
        json.dump(basmeih, f, ensure_ascii=False)
    print("Copied Basmeih translation for concordance display.")

    sahih_src = SRC_DIR / "data" / "translations" / "en" / "sahih.json"
    sahih_dest = data_dir / "translations" / "en" / "sahih.json"
    if sahih_src.exists():
        with open(sahih_src, "r", encoding="utf-8") as f:
            sahih = json.load(f)
        with open(sahih_dest, "w", encoding="utf-8") as f:
            json.dump(sahih, f, ensure_ascii=False)
        print("Copied Sahih International translation for English concordance display.")

    # 2b. Copy Arabic Uthmani text
    for s_num in range(1, 115):
        ar_src = SRC_DIR / "data" / "arabic" / f"{s_num}.json"
        if ar_src.exists():
            with open(ar_src, "r", encoding="utf-8") as f:
                ar_data = json.load(f)
            with open(data_dir / "arabic" / f"{s_num}.json", "w", encoding="utf-8") as f:
                json.dump(ar_data, f, ensure_ascii=False)
    print("Copied 114 Arabic Uthmani surah texts.")

    # 3. Process morphology & aggregate roots
    roots_map = defaultdict(lambda: {
        "count": 0,
        "lemmas": set(),
        "meanings_ms": set(),
        "meanings_en": set(),
        "occurrences": []
    })

    total_tokens = 0
    total_files = 0

    for s_num in range(1, 115):
        morph_src = SRC_DIR / "data" / "morphology" / f"{s_num}.json"
        if not morph_src.exists():
            continue
        total_files += 1

        with open(morph_src, "r", encoding="utf-8") as f:
            morph_data = json.load(f)

        s_int = morph_data.get("surah", s_num)

        for a_str, tokens in morph_data.get("ayahs", {}).items():
            a_int = int(a_str)
            for t in tokens:
                total_tokens += 1
                pos = t.get("pos", 1)
                # update corpus_url to internal app hash
                t["corpus_url"] = f"#word/{s_int}:{a_int}:{pos}"

                root = (t.get("root") or "").strip()
                if root:
                    roots_map[root]["count"] += 1
                    if t.get("lemma"):
                        roots_map[root]["lemmas"].add(t["lemma"])
                    ms_val = t.get("ms") or t.get("id")
                    if ms_val:
                        roots_map[root]["meanings_ms"].add(ms_val.strip().lower())
                    if t.get("en"):
                        roots_map[root]["meanings_en"].add(t["en"].strip().lower())

                    roots_map[root]["occurrences"].append({
                        "s": s_int,
                        "a": a_int,
                        "p": pos,
                        "ar": t.get("ar", ""),
                        "tr": t.get("tr", ""),
                        "lemma": t.get("lemma", ""),
                        "ms": ms_val or "",
                        "en": t.get("en", "") or "",
                        "pos_tag": t.get("pos_tag", "")
                    })

        # Save transformed morphology file
        morph_dest = data_dir / "morphology" / f"{s_num}.json"
        with open(morph_dest, "w", encoding="utf-8") as f:
            json.dump(morph_data, f, ensure_ascii=False)

    print(f"Processed {total_files} morphology files ({total_tokens} total word tokens).")

    # 4. Save roots.json
    roots_list = []
    for root, d in sorted(roots_map.items(), key=lambda x: -x[1]["count"]):
        root_clean = root.replace(" ", "")
        roots_list.append({
            "root": root,
            "root_clean": root_clean,
            "root_norm": normalize_arabic(root_clean),
            "count": d["count"],
            "lemmas": sorted(list(d["lemmas"])),
            "meanings_ms": sorted(list(d["meanings_ms"]))[:10],
            "meanings_en": sorted(list(d["meanings_en"]))[:10],
            "occurrences": d["occurrences"]
        })

    roots_dest = data_dir / "roots.json"
    with open(roots_dest, "w", encoding="utf-8") as f:
        json.dump(roots_list, f, ensure_ascii=False)
    print(f"Saved {len(roots_list)} roots to {roots_dest} ({os.path.getsize(roots_dest) // 1024} KB).")

    # 5. Lightweight roots summary index (without all occurrences) for fast search and listing
    roots_summary = []
    for r in roots_list:
        roots_summary.append({
            "root": r["root"],
            "root_clean": r["root_clean"],
            "root_norm": r["root_norm"],
            "count": r["count"],
            "lemmas": r["lemmas"][:8],
            "meanings_ms": r["meanings_ms"][:5],
            "meanings_en": r["meanings_en"][:5],
            "sample": r["occurrences"][0] if r["occurrences"] else None
        })

    summary_dest = data_dir / "roots-index.json"
    with open(summary_dest, "w", encoding="utf-8") as f:
        json.dump(roots_summary, f, ensure_ascii=False)
    print(f"Saved lightweight roots index to {summary_dest} ({os.path.getsize(summary_dest) // 1024} KB).")

if __name__ == "__main__":
    main()
