import os
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

def check_relative_paths():
    print("[CHECK 1] Checking relative paths in HTML, CSS, JS...")
    for ext in ["*.html", "*.js", "*.css"]:
        for f in ROOT.glob(f"**/{ext}"):
            if "node_modules" in str(f):
                continue
            content = f.read_text(encoding="utf-8", errors="ignore")
            # Look for absolute root paths like href="/data" or src="/js"
            bad_matches = re.findall(r'(?:href|src|url)\s*=\s*["\']/(?!\/)[^"\']*["\']', content)
            if bad_matches:
                raise ValueError(f"Absolute root path detected in {f}: {bad_matches}")
    print("  [PASS] All paths are strictly relative.")

def check_files():
    print("[CHECK 2] Verifying standard files & schemas...")
    assert (ROOT / ".nojekyll").exists(), "Missing .nojekyll"
    assert (ROOT / "AGENTS.md").exists(), "Missing AGENTS.md"
    assert (ROOT / "manifest.webmanifest").exists(), "Missing manifest.webmanifest"
    assert (ROOT / "sw.js").exists(), "Missing sw.js"
    assert (ROOT / "LICENSE").exists(), "Missing LICENSE"

    # Data checks
    surahs_file = ROOT / "data" / "surahs.json"
    assert surahs_file.exists(), "Missing data/surahs.json"
    with open(surahs_file, "r", encoding="utf-8") as f:
        surahs = json.load(f)
    assert len(surahs) == 114, f"Expected 114 surahs, got {len(surahs)}"

    roots_file = ROOT / "data" / "roots-index.json"
    assert roots_file.exists(), "Missing data/roots-index.json"
    with open(roots_file, "r", encoding="utf-8") as f:
        roots = json.load(f)
    assert len(roots) >= 1600, f"Expected >1600 roots, got {len(roots)}"

    # Morphology count
    morph_files = list((ROOT / "data" / "morphology").glob("*.json"))
    assert len(morph_files) == 114, f"Expected 114 morphology files, got {len(morph_files)}"

    # Arabic count
    ar_files = list((ROOT / "data" / "arabic").glob("*.json"))
    assert len(ar_files) == 114, f"Expected 114 arabic files, got {len(ar_files)}"

    print("  [PASS] All schemas and data files verified.")

def check_encoding():
    print("[CHECK 3] Verifying UTF-8 encoding without BOM...")
    for p in ROOT.rglob("*"):
        if p.is_file() and p.suffix in [".json", ".js", ".html", ".css", ".md", ".py"]:
            if "node_modules" in str(p) or ".git" in str(p):
                continue
            with open(p, "rb") as f:
                raw = f.read(3)
                assert raw != b"\xef\xbb\xbf", f"File contains UTF-8 BOM: {p}"
    print("  [PASS] All files strictly UTF-8 without BOM.")

def main():
    print("=" * 60)
    print("VERIFYING KORPUS AL-QURAN PROJECT INTEGRITY")
    print("=" * 60)
    check_relative_paths()
    check_files()
    check_encoding()
    print("=" * 60)
    print(">>> ALL CHECKS PASSED SUCCESSFULLY! <<<")
    print("=" * 60)

if __name__ == "__main__":
    main()
