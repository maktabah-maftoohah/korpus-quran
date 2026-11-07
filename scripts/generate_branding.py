import os
import pathlib
import uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from playwright.sync_api import sync_playwright

root = pathlib.Path(__file__).resolve().parent.parent
assets_dir = root / "assets"
assets_dir.mkdir(parents=True, exist_ok=True)

cache_dir = root / "scripts" / ".cache_fonts"
amiri_font_path = cache_dir / "Amiri-Bold.ttf"
inter_font_path = cache_dir / "Inter.ttf"

def text_to_path(font_path, text, font_size, direction='ltr', language='en', script='Latn'):
    font_data = open(font_path, 'rb').read()
    ttfont = TTFont(font_path)
    glyph_set = ttfont.getGlyphSet()
    
    face = hb.Face(font_data)
    font = hb.Font(face)
    
    upem = ttfont['head'].unitsPerEm
    scale = font_size / upem
    
    buf = hb.Buffer()
    buf.add_str(text)
    buf.guess_segment_properties()
    if direction:
        buf.direction = direction
    if language:
        buf.language = language
    if script:
        buf.script = script
        
    hb.shape(font, buf)
    
    cursor_x = 0
    cursor_y = 0
    path_commands = []
    
    for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
        glyph_name = ttfont.getGlyphName(info.codepoint)
        x_offset = (cursor_x + pos.x_offset) * scale
        y_offset = (cursor_y + pos.y_offset) * scale
        
        pen = SVGPathPen(glyph_set)
        tpen = TransformPen(pen, (scale, 0, 0, -scale, x_offset, -y_offset))
        glyph_set[glyph_name].draw(tpen)
        cmd = pen.getCommands()
        if cmd:
            path_commands.append(cmd)
            
        cursor_x += pos.x_advance
        cursor_y += pos.y_advance
        
    total_width = cursor_x * scale
    return ' '.join(path_commands), total_width

print("Generating vector text outlines for Korpus Al-Quran...")

# 1. Generate text outlines
p_banner_ar, _ = text_to_path(amiri_font_path, 'مُعْجَم وَإِعْرَاب القُرْآن الكَرِيم', 48, direction='rtl', language='ar', script='Arab')
p_banner_ar_sub, _ = text_to_path(amiri_font_path, 'المكتبة المفتوحة', 15, direction='rtl', language='ar', script='Arab')
p_banner_org, _ = text_to_path(inter_font_path, 'MAKTABAH MAFTOOHAH', 13.5)
p_banner_title, _ = text_to_path(inter_font_path, 'Korpus Al-Quran', 62)
p_banner_desc, _ = text_to_path(inter_font_path, 'Korpus Tatabahasa, I\'rab, Morfologi & Mu\'jam 1,651 Akar Kata', 20)
p_banner_subdesc, _ = text_to_path(inter_font_path, 'Kajian sintaksis bahasa Arab, lema, dan konkordans 77,429 kalimah dalam Bahasa Melayu.', 15)

# Pills
p_pill1, _ = text_to_path(inter_font_path, '1,651 Akar Kata', 13.5)
p_pill2, _ = text_to_path(inter_font_path, 'Analisis I\'rab & Nahu', 13.5)
p_pill3, _ = text_to_path(inter_font_path, '77,429 Kalimah Quran', 13.5)
p_pill4, _ = text_to_path(inter_font_path, 'Konkordans Lengkap', 13.5)
p_pill5, _ = text_to_path(inter_font_path, 'Bahasa Melayu', 12.5)
p_pill6, _ = text_to_path(inter_font_path, 'Zero-Build PWA', 12.5)
p_pill7, _ = text_to_path(inter_font_path, 'Tafsir Basmeih Terbina', 12.5)
p_url, _ = text_to_path(inter_font_path, 'maktabah-maftoohah.github.io/korpus-quran', 14)
p_star_text, _ = text_to_path(inter_font_path, 'Inisiatif Bebas Sumber Terbuka', 13)

# Logo texts
p_logo_ar, _ = text_to_path(amiri_font_path, 'مُعْجَم وَإِعْرَاب القُرْآن', 34, direction='rtl', language='ar', script='Arab')
p_logo_title, _ = text_to_path(inter_font_path, 'Korpus Quran', 44)
p_logo_org, _ = text_to_path(inter_font_path, 'MAKTABAH MAFTOOHAH', 13.5)
p_logo_sub, _ = text_to_path(inter_font_path, '• Korpus Al-Quran Bahasa Melayu', 13.5)

# Build Distinct Logo Mark for Korpus Al-Quran (512x512)
logo_mark_svg = '''<?xml version="1.0" encoding="UTF-8"?>
<svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="35%" stop-color="#f59e0b"/>
      <stop offset="70%" stop-color="#d97706"/>
      <stop offset="100%" stop-color="#b45309"/>
    </linearGradient>
    <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34d399"/>
      <stop offset="100%" stop-color="#059669"/>
    </linearGradient>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0e172a"/>
      <stop offset="50%" stop-color="#091122"/>
      <stop offset="100%" stop-color="#050a14"/>
    </linearGradient>
    <radialGradient id="ambientGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#2d6cdf" stop-opacity="0.25"/>
      <stop offset="60%" stop-color="#059669" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#0e172a" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Base Rounded Container -->
  <rect width="512" height="512" rx="104" fill="url(#bgGrad)"/>
  <rect width="504" height="504" x="4" y="4" rx="100" fill="none" stroke="url(#goldGrad)" stroke-width="1.8" stroke-opacity="0.4"/>
  <circle cx="256" cy="256" r="230" fill="url(#ambientGlow)"/>

  <!-- Islamic Octagram & Geometric Framing -->
  <g stroke="url(#goldGrad)" stroke-width="1.2" fill="none" opacity="0.45">
    <rect x="96" y="96" width="320" height="320" rx="36"/>
    <rect x="96" y="96" width="320" height="320" rx="36" transform="rotate(45 256 256)"/>
    <circle cx="256" cy="256" r="190"/>
    <circle cx="256" cy="256" r="168" stroke-dasharray="3,5"/>
  </g>

  <!-- Crown Mihrab Arch for Maktabah Maftoohah Identity -->
  <path d="M172 340 V 215 C 172 150, 256 112, 256 112 C 256 112, 340 150, 340 215 V 340" fill="none" stroke="url(#goldGrad)" stroke-width="2" opacity="0.6"/>
  <path d="M188 340 V 222 C 188 165, 256 130, 256 130 C 256 130, 324 165, 324 222 V 340" fill="none" stroke="url(#emeraldGrad)" stroke-width="1.2" opacity="0.5"/>

  <!-- The Open Mushaf / Corpus Book (Rihal Base) -->
  <g transform="translate(0, 10)">
    <!-- Rihal Legs -->
    <path d="M152 400 C 188 385, 230 350, 256 328 C 282 350, 324 385, 360 400 C 348 408, 320 395, 292 382 L 256 352 L 220 382 C 192 395, 164 408, 152 400 Z" fill="#132238" stroke="url(#goldGrad)" stroke-width="1.5"/>
    <polygon points="256,335 264,346 256,357 248,346" fill="url(#goldGrad)"/>

    <!-- Open Pages -->
    <path d="M256 324 C 218 316, 162 306, 134 312 C 128 262, 136 220, 142 214 C 160 209, 216 217, 256 222 Z" fill="#0f1d33" stroke="url(#goldGrad)" stroke-width="1.5"/>
    <path d="M256 324 C 294 316, 350 306, 378 312 C 384 262, 376 220, 370 214 C 352 209, 296 217, 256 222 Z" fill="#0f1d33" stroke="url(#goldGrad)" stroke-width="1.5"/>

    <!-- Subtle Page Text Lines (Script Lines) -->
    <g stroke="rgba(201, 168, 76, 0.4)" stroke-width="1.5" stroke-linecap="round">
      <line x1="165" y1="236" x2="238" y2="241"/>
      <line x1="159" y1="254" x2="238" y2="259"/>
      <line x1="157" y1="272" x2="238" y2="277"/>
      <line x1="161" y1="290" x2="238" y2="295"/>

      <line x1="274" y1="241" x2="347" y2="236"/>
      <line x1="274" y1="259" x2="353" y2="254"/>
      <line x1="274" y1="277" x2="355" y2="272"/>
      <line x1="274" y1="295" x2="351" y2="290"/>
    </g>

    <!-- Center Binding Spine -->
    <rect x="254" y="218" width="4" height="106" fill="url(#goldGrad)"/>
  </g>

  <!-- LINGUISTIC ROOT EMBLEM: Tri-lateral Node Network (Akar Kata / Radical Letters Network) -->
  <g transform="translate(256, 172)">
    <!-- Connecting Arcs -->
    <path d="M-42 8 Q 0 -24 42 8" fill="none" stroke="url(#emeraldGrad)" stroke-width="2" opacity="0.8"/>
    <path d="M-42 8 Q 0 42 42 8" fill="none" stroke="url(#goldGrad)" stroke-width="1.5" opacity="0.8"/>
    <line x1="0" y1="-28" x2="-42" y2="8" stroke="url(#goldGrad)" stroke-width="1.2" opacity="0.6"/>
    <line x1="0" y1="-28" x2="42" y2="8" stroke="url(#goldGrad)" stroke-width="1.2" opacity="0.6"/>

    <!-- Root Nodes (Radical Nodes) -->
    <!-- Node 1 (Fa') Top -->
    <circle cx="0" cy="-28" r="9" fill="#0b172a" stroke="url(#goldGrad)" stroke-width="2"/>
    <circle cx="0" cy="-28" r="4" fill="#34d399"/>

    <!-- Node 2 ('Ain) Bottom-Left -->
    <circle cx="-42" cy="8" r="8" fill="#0b172a" stroke="url(#goldGrad)" stroke-width="2"/>
    <circle cx="-42" cy="8" r="3.5" fill="#f59e0b"/>

    <!-- Node 3 (Lam) Bottom-Right -->
    <circle cx="42" cy="8" r="8" fill="#0b172a" stroke="url(#goldGrad)" stroke-width="2"/>
    <circle cx="42" cy="8" r="3.5" fill="#f59e0b"/>

    <!-- Central Radiant Star Gem -->
    <circle cx="0" cy="8" r="14" fill="#070c18" stroke="url(#goldGrad)" stroke-width="1.5"/>
    <polygon points="0,-1 4,7 13,8 6,13 8,22 0,17 -8,22 -6,13 -13,8 -4,7" fill="url(#goldGrad)" transform="scale(0.65) translate(0, -6)"/>
  </g>
</svg>'''

(assets_dir / "logo-mark.svg").write_text(logo_mark_svg, encoding="utf-8")
print("[SUCCESS] Wrote assets/logo-mark.svg")

# Build OUTLINED logo.svg (800x200)
logo_svg = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 200" width="800" height="200">
  <defs>
    <linearGradient id="goldGradLogo" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="30%" stop-color="#f59e0b" />
      <stop offset="70%" stop-color="#d97706" />
      <stop offset="100%" stop-color="#b45309" />
    </linearGradient>
  </defs>

  <!-- Background Base Container -->
  <rect width="800" height="200" rx="32" fill="#0b0f19" />
  <rect width="794" height="194" x="3" y="3" rx="29" fill="none" stroke="rgba(245, 158, 11, 0.25)" stroke-width="1.5" />

  <!-- Left: Nested Logo Mark (160x160 at x=20, y=20) -->
  <svg x="20" y="20" width="160" height="160" viewBox="0 0 512 512">
    {logo_mark_svg[logo_mark_svg.find("<svg"):logo_mark_svg.rfind("</svg>")+6]}
  </svg>

  <!-- Vertical Subtle Divider -->
  <line x1="205" y1="36" x2="205" y2="164" stroke="rgba(255, 255, 255, 0.1)" stroke-width="1.5" />

  <!-- Right: 100% Outlined Typography -->
  <!-- Arabic Calligraphy Headline: "معجم وإعراب القرآن" -->
  <path d="{p_logo_ar}" fill="url(#goldGradLogo)" transform="translate(235, 66)" />

  <!-- Latin Primary Title: "Korpus Quran" -->
  <path d="{p_logo_title}" fill="#f8fafc" transform="translate(235, 120)" />

  <!-- Category / Platform Subtitle -->
  <g transform="translate(235, 142)">
    <rect x="0" y="0" width="202" height="26" rx="6" fill="rgba(16, 185, 129, 0.15)" stroke="rgba(16, 185, 129, 0.35)" stroke-width="1" />
    <path d="{p_logo_org}" fill="#34d399" transform="translate(10, 18)" />
    <path d="{p_logo_sub}" fill="#94a3b8" transform="translate(216, 18)" />
  </g>
</svg>'''

(assets_dir / "logo.svg").write_text(logo_svg, encoding="utf-8")
print("[SUCCESS] Wrote assets/logo.svg")

# Icons definitions
icon_root = '<path d="M12 2v20 M12 12l8-8 M12 12L4 4 M12 16l6-6 M12 16l-6-6" fill="none" stroke="#34d399" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" transform="scale(0.65) translate(8, 7)"/>'
icon_book = '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z M6 6h10" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" transform="scale(0.65) translate(8, 7)"/>'
icon_microscope = '<path d="M6 18h8 M10 14v4 M12 6a4 4 0 0 0-4 4v1h8v-1a4 4 0 0 0-4-4Z M10 2v4" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" transform="scale(0.65) translate(8, 7)"/>'
icon_stack = '<path d="M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" transform="scale(0.65) translate(8, 7)"/>'
icon_globe = '<circle cx="12" cy="12" r="10" fill="none" stroke="#94a3b8" stroke-width="2" transform="scale(0.65) translate(8, 7)"/><line x1="2" y1="12" x2="22" y2="12" stroke="#94a3b8" stroke-width="2" transform="scale(0.65) translate(8, 7)"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" fill="none" stroke="#94a3b8" stroke-width="2" transform="scale(0.65) translate(8, 7)"/>'
icon_lightning = '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="#10b981" transform="scale(0.65) translate(8, 7)"/>'
icon_star = '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="#f59e0b" transform="scale(0.7) translate(14, 11)"/>'

# Build OUTLINED site-banner.svg (1280x640)
site_banner_svg = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 640" width="1280" height="640">
  <defs>
    <linearGradient id="bgBanner" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a1222" />
      <stop offset="50%" stop-color="#070c18" />
      <stop offset="100%" stop-color="#04070e" />
    </linearGradient>
    <radialGradient id="bannerGlow" cx="25%" cy="50%" r="55%">
      <stop offset="0%" stop-color="#2d6cdf" stop-opacity="0.28" />
      <stop offset="50%" stop-color="#059669" stop-opacity="0.18" />
      <stop offset="100%" stop-color="#070c18" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="goldBanner" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="35%" stop-color="#f59e0b" />
      <stop offset="70%" stop-color="#d97706" />
      <stop offset="100%" stop-color="#b45309" />
    </linearGradient>
  </defs>

  <!-- Background Base Container -->
  <rect width="1280" height="640" fill="url(#bgBanner)" />
  <rect width="1272" height="632" x="4" y="4" fill="none" stroke="rgba(245, 158, 11, 0.25)" stroke-width="1.5" />
  <circle cx="300" cy="320" r="380" fill="url(#bannerGlow)" />

  <!-- Left: Large Emblem Mark (380x380 at x=70, y=130) -->
  <svg x="70" y="130" width="380" height="380" viewBox="0 0 512 512">
    {logo_mark_svg[logo_mark_svg.find("<svg"):logo_mark_svg.rfind("</svg>")+6]}
  </svg>

  <!-- Vertical Divider -->
  <line x1="485" y1="130" x2="485" y2="510" stroke="rgba(255, 255, 255, 0.1)" stroke-width="1.5" />

  <!-- Right: Content & Typography -->
  <!-- Top Organization Header Pill -->
  <g transform="translate(530, 95)">
    <rect x="0" y="0" width="310" height="32" rx="16" fill="#132238" stroke="rgba(255, 255, 255, 0.15)" stroke-width="1" />
    <circle cx="16" cy="16" r="4.5" fill="#34d399" />
    <path d="{p_banner_org}" fill="#f8fafc" transform="translate(32, 21)" />
    <path d="{p_banner_ar_sub}" fill="url(#goldBanner)" transform="translate(195, 21)" />
  </g>

  <!-- Arabic Calligraphy Headline -->
  <path d="{p_banner_ar}" fill="url(#goldBanner)" transform="translate(530, 185)" />

  <!-- Main Title: "Korpus Al-Quran" -->
  <path d="{p_banner_title}" fill="#f8fafc" transform="translate(530, 260)" />

  <!-- Taglines -->
  <path d="{p_banner_desc}" fill="#38bdf8" transform="translate(530, 298)" />
  <path d="{p_banner_subdesc}" fill="#94a3b8" transform="translate(530, 326)" />

  <!-- Feature Pills Grid (Row 1) -->
  <g transform="translate(530, 365)">
    <g transform="translate(0, 0)">
      <rect x="0" y="0" width="168" height="34" rx="8" fill="#111827" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1" />
      {icon_root}
      <path d="{p_pill1}" fill="#f8fafc" transform="translate(36, 22)" />
    </g>
    <g transform="translate(180, 0)">
      <rect x="0" y="0" width="194" height="34" rx="8" fill="#111827" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1" />
      {icon_microscope}
      <path d="{p_pill2}" fill="#f8fafc" transform="translate(36, 22)" />
    </g>
    <g transform="translate(386, 0)">
      <rect x="0" y="0" width="198" height="34" rx="8" fill="#111827" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1" />
      {icon_stack}
      <path d="{p_pill3}" fill="#f8fafc" transform="translate(36, 22)" />
    </g>
  </g>

  <!-- Feature Pills Grid (Row 2) -->
  <g transform="translate(530, 412)">
    <g transform="translate(0, 0)">
      <rect x="0" y="0" width="168" height="34" rx="8" fill="#111827" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1" />
      {icon_book}
      <path d="{p_pill4}" fill="#f8fafc" transform="translate(36, 22)" />
    </g>
    <g transform="translate(180, 0)">
      <rect x="0" y="0" width="148" height="34" rx="8" fill="#111827" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1" />
      {icon_globe}
      <path d="{p_pill5}" fill="#f8fafc" transform="translate(36, 22)" />
    </g>
    <g transform="translate(340, 0)">
      <rect x="0" y="0" width="154" height="34" rx="8" fill="#111827" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1" />
      {icon_lightning}
      <path d="{p_pill6}" fill="#f8fafc" transform="translate(36, 22)" />
    </g>
    <g transform="translate(506, 0)">
      <rect x="0" y="0" width="194" height="34" rx="8" fill="#111827" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1" />
      {icon_book}
      <path d="{p_pill7}" fill="#f8fafc" transform="translate(36, 22)" />
    </g>
  </g>

  <!-- Bottom Details & Live Web Link -->
  <g transform="translate(530, 485)">
    <rect x="0" y="0" width="440" height="42" rx="10" fill="#0b1324" stroke="rgba(56, 189, 248, 0.4)" stroke-width="1.2" />
    <circle cx="20" cy="21" r="5" fill="#10b981" />
    <path d="{p_url}" fill="#38bdf8" transform="translate(36, 26)" />

    <g transform="translate(455, 0)">
      <rect x="0" y="0" width="245" height="42" rx="10" fill="#1e293b" stroke="rgba(255, 255, 255, 0.15)" stroke-width="1.2" />
      {icon_star}
      <path d="{p_star_text}" fill="#f8fafc" transform="translate(44, 26)" />
    </g>
  </g>
</svg>'''

(assets_dir / "site-banner.svg").write_text(site_banner_svg, encoding="utf-8")
print("[SUCCESS] Wrote assets/site-banner.svg")

# Render all raster PNG and JPG images with Playwright
print("Rendering raster assets with Playwright Chromium...")

chrome_candidates = [
    os.environ.get('CHROME_BIN'),
    r'C:\Program Files\Google\Chrome\Application\chrome.exe',
    r'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe',
    r'C:\Program Files\Microsoft\Edge\Application\msedge.exe',
    r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
]
exec_path = next((p for p in chrome_candidates if p and os.path.exists(p)), None)
launch_opts = {}
if exec_path:
    launch_opts["executable_path"] = exec_path

with sync_playwright() as p:
    browser = p.chromium.launch(**launch_opts)

    # 1. icon-192.png
    page = browser.new_page(viewport={"width": 192, "height": 192}, device_scale_factor=1)
    page.goto(f"file://{assets_dir / 'logo-mark.svg'}")
    page.screenshot(path=str(assets_dir / "icon-192.png"))
    print("[SUCCESS] Generated assets/icon-192.png")

    # 2. icon-512.png / logo-mark.png / avatar.png
    page = browser.new_page(viewport={"width": 512, "height": 512}, device_scale_factor=1)
    page.goto(f"file://{assets_dir / 'logo-mark.svg'}")
    page.screenshot(path=str(assets_dir / "icon-512.png"))
    page.screenshot(path=str(assets_dir / "logo-mark.png"))
    page.screenshot(path=str(assets_dir / "avatar.png"))
    page.screenshot(path=str(assets_dir / "github-avatar.png"))
    print("[SUCCESS] Generated assets/icon-512.png, logo-mark.png, avatar.png, github-avatar.png")

    # 3. logo.png (1600x400 Retina)
    page = browser.new_page(viewport={"width": 800, "height": 200}, device_scale_factor=2)
    page.goto(f"file://{assets_dir / 'logo.svg'}")
    page.wait_for_timeout(400)
    page.screenshot(path=str(assets_dir / "logo.png"))
    print("[SUCCESS] Generated assets/logo.png")

    # 4. site-banner.png (2560x1280 Retina)
    page = browser.new_page(viewport={"width": 1280, "height": 640}, device_scale_factor=2)
    page.goto(f"file://{assets_dir / 'site-banner.svg'}")
    page.wait_for_timeout(400)
    page.screenshot(path=str(assets_dir / "site-banner.png"))
    print("[SUCCESS] Generated assets/site-banner.png")

    # 5. og-banner.jpg (1280x640 JPEG)
    page = browser.new_page(viewport={"width": 1280, "height": 640}, device_scale_factor=1)
    page.goto(f"file://{assets_dir / 'site-banner.svg'}")
    page.wait_for_timeout(400)
    page.screenshot(path=str(assets_dir / "og-banner.jpg"), type="jpeg", quality=95)
    print("[SUCCESS] Generated assets/og-banner.jpg")

    browser.close()

print("\n>>> ALL KORPUS QURAN BRANDING ASSETS SUCCESSFULLY CREATED! <<<")
