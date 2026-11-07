/**
 * Maktabah Maftoohah — Korpus Al-Quran
 * Tema Semantik & Pengelompokan Mu'jam (Semantic Domains / Maudu'iy)
 */

export const SEMANTIC_THEMES = [
  {
    id: "all",
    icon: "📖",
    name_ms: "Semua Akar Kata",
    name_en: "All Roots",
    desc_ms: "Papar kesemua 1,651 akar kata Al-Quran mengikut susunan kekerapan.",
    desc_en: "View all 1,651 Quranic roots ordered by occurrence frequency.",
    roots: []
  },
  {
    id: "tauhid",
    icon: "✨",
    name_ms: "Akidah & Asma'ul Husna",
    name_en: "Theology & Divine Attributes",
    desc_ms: "Akar kata berkaitan keesaan Allah, sifat ketuhanan, penciptaan, dan kebesaran Ilahi.",
    desc_en: "Roots concerning the oneness of Allah, divine attributes, and sovereign power.",
    roots: [
      "أ ل ه", "ر ب ب", "ر ح م", "ق د س", "ح ك م", "ع ل م", "خ ل ق", "م ل ك", 
      "ق د ر", "ع ز ز", "غ ف ر", "س م ع", "ب ص ر", "ح ي ي", "ق ي م", "و ح د", 
      "ص م د", "ح م د", "ش ك ر", "ع ف و", "ت و ب", "ع ظ م", "ك ر م", "و ك ل"
    ]
  },
  {
    id: "ibadah",
    icon: "🕌",
    name_ms: "Ibadah & Syariat",
    name_en: "Worship & Rites",
    desc_ms: "Akar kata berkaitan solat, puasa, zakat, haji, doa, dan syiar Islam.",
    desc_en: "Roots regarding prayer, fasting, charity, pilgrimage, invocation, and rituals.",
    roots: [
      "ص ل و", "ص و م", "ح ج ج", "ز ك و", "ذ ب ح", "ن ذ ر", "د ع و", "ط ه ر", 
      "س ج د", "ر ك ع", "ع ب د", "ق ر ب", "ت ل و", "ذ ك ر", "ن س ك", "ع م ر"
    ]
  },
  {
    id: "akhlak",
    icon: "❤️",
    name_ms: "Akhlak & Tazkiyah Hati",
    name_en: "Ethics & Spiritual Purification",
    desc_ms: "Akar kata berkaitan kesabaran, kebenaran, kemaafan, keikhlasan, dan sifat mahmudah.",
    desc_en: "Roots on patience, truthfulness, forgiveness, sincerity, and virtuous conduct.",
    roots: [
      "ص ب ر", "ش ك ر", "ص د ق", "ع د ل", "ح س ن", "خ ش ع", "ت ق ي", "ب ر ر", 
      "و ف ي", "ح ل م", "ع ف و", "س ل م", "ك ظ م", "ه د ي", "خ ل ص", "ر ف ق"
    ]
  },
  {
    id: "qiamat",
    icon: "⚖️",
    name_ms: "Hari Kiamat & Alam Ghaib",
    name_en: "Eschatology & The Unseen",
    desc_ms: "Akar kata berkaitan kebangkitan, hisab, syurga, neraka, malaikat, dan akhirat.",
    desc_en: "Roots on resurrection, reckoning, Paradise, Hellfire, angels, and the Hereafter.",
    roots: [
      "ب ع ث", "ح ش ر", "ج ن ن", "ن و ر", "ع ذ ب", "م و ت", "س ع ر", "ح س ب", 
      "و ز ن", "ص ر ط", "ش ف ع", "خ ل د", "ج ز ي", "ق ي م", "ن ف خ", "ص ح ف"
    ]
  },
  {
    id: "anbiya",
    icon: "📜",
    name_ms: "Kisah Para Nabi & Umat",
    name_en: "Prophets & Nations",
    desc_ms: "Akar kata berkaitan risalah kenabian, wahyu, mukjizat, dan sejarah kaum terdahulu.",
    desc_en: "Roots covering prophetic missions, revelation, miracles, and historical lessons.",
    roots: [
      "ن ب أ", "ر س ل", "ق ص ص", "أ م م", "ق و م", "ف ر ع", "ب ن ي", "و ح ي", 
      "ب ش ر", "ن ذ ر", "ص ح ب", "ه ل ك", "ن ج و", "ع ص ي"
    ]
  },
  {
    id: "alam",
    icon: "🌍",
    name_ms: "Alam Semesta & Kosmologi",
    name_en: "Cosmos & Nature",
    desc_ms: "Akar kata berkaitan langit, bumi, matahari, bulan, bintang, air, hujan, dan alam flora/fauna.",
    desc_en: "Roots describing heavens, earth, sun, moon, stars, water, rain, and the living world.",
    roots: [
      "س م و", "أ ر ض", "ش م س", "ق م ر", "ن ج م", "م و ه", "ش ج ر", "ب ح ر", 
      "ج ب ل", "ف ل ك", "ل ي ل", "ن ه ر", "ر ي ح", "س ح ب", "ن ب ت", "د ب ب"
    ]
  },
  {
    id: "muamalat",
    icon: "🤝",
    name_ms: "Keluarga & Hubungan Sosial",
    name_en: "Family & Social Relations",
    desc_ms: "Akar kata berkaitan nikah, wasiat, jual beli, keadilan sosial, dan persaudaraan.",
    desc_en: "Roots concerning marriage, inheritance, commerce, social justice, and fraternity.",
    roots: [
      "ن ك ح", "ط ل ق", "و ل د", "ر ض ع", "و ر ث", "ب ي ع", "ت ج ر", "ر ب و", 
      "ش ه د", "ك ت ب", "ق س ط", "أ خ و", "أ ه ل", "ر ح م", "ع ق د"
    ]
  }
];
