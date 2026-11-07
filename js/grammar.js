/**
 * Maktabah Maftoohah — Korpus Al-Quran (Bahasa Melayu)
 * Enjin Tatabahasa, Morfologi & I'rab Bahasa Melayu
 */

export const POS_DICTIONARY = {
  N: {
    name_ms: "Kata Nama (Isim)",
    name_ar: "اسم",
    desc_ms: "Kata yang merujuk kepada zat, orang, tempat, benda, konsep atau sifat yang tidak terikat dengan masa.",
    category: "isim"
  },
  PN: {
    name_ms: "Kata Nama Khas (Isim 'Alam)",
    name_ar: "اسم علم",
    desc_ms: "Kata nama khas yang khusus merujuk kepada nama Allah SWT, nama nabi, malaikat, kaum, atau tempat khusus.",
    category: "isim"
  },
  ADJ: {
    name_ms: "Kata Sifat (Sifat / Na'at)",
    name_ar: "صفة / نعت",
    desc_ms: "Kata yang menerangkan sifat atau keadaan bagi kata nama sebelumnya (al-Man'ut).",
    category: "isim"
  },
  V: {
    name_ms: "Kata Kerja (Fi'il)",
    name_ar: "فعل",
    desc_ms: "Kata yang menunjukkan perbuatan atau peristiwa yang terikat dengan masa (masa lalu, sekarang, atau akan datang).",
    category: "fiil"
  },
  P: {
    name_ms: "Kata Sendi Nama / Partikel (Harf Jar)",
    name_ar: "حرف جر",
    desc_ms: "Partikel yang mendahului kata nama dan menjadikannya berbaris bawah (Majrur). Contoh: bi (dengan), fi (dalam), min (dari).",
    category: "harf"
  },
  PRON: {
    name_ms: "Kata Ganti Nama (Dhamir)",
    name_ar: "ضمير",
    desc_ms: "Kata yang menggantikan nama orang atau benda, sama ada bersambung (muttasil) atau berasingan (munfasil).",
    category: "isim"
  },
  DEM: {
    name_ms: "Kata Tunjuk (Isim Isyarah)",
    name_ar: "اسم إشارة",
    desc_ms: "Kata penunjuk dekat atau jauh, seperti 'ini' (hadza, hadzihi) atau 'itu' (dhalika, tilka).",
    category: "isim"
  },
  REL: {
    name_ms: "Kata Hubung Relatif (Isim Mausul)",
    name_ar: "اسم موصول",
    desc_ms: "Kata penghubung yang merujuk kepada 'yang' (alladzi, allati, alladhina) dan memerlukan ayat penerang (Silah al-Mausul).",
    category: "isim"
  },
  CONJ: {
    name_ms: "Kata Hubung (Harf 'Ataf)",
    name_ar: "حرف عطف",
    desc_ms: "Huruf penghubung antara perkataan atau ayat, seperti waw (dan), fa (maka), thumma (kemudian).",
    category: "harf"
  },
  NEG: {
    name_ms: "Partikel Nafi / Penafian (Harf Nafi)",
    name_ar: "حرف نفي",
    desc_ms: "Huruf untuk menafikan pernyataan, seperti ma (tidak), la (tidak/bukan), lam (belum/tidak).",
    category: "harf"
  },
  INTG: {
    name_ms: "Kata Tanya (Isim / Harf Istifham)",
    name_ar: "اسم / حرف استفهام",
    desc_ms: "Kata untuk mengemukakan pertanyaan, seperti hal / a (adakah), man (siapa), ma (apa), ayna (di mana).",
    category: "harf"
  },
  VOC: {
    name_ms: "Partikel Seruan (Harf Nida')",
    name_ar: "حرف نداء",
    desc_ms: "Huruf untuk menyeru atau memanggil, seperti ya (wahai) diikuti oleh orang/pihak yang diseru (al-Munada).",
    category: "harf"
  },
  COND: {
    name_ms: "Kata Syarat (Harf Syarat)",
    name_ar: "حرف شرط",
    desc_ms: "Huruf pengandaian atau syarat, seperti in (jika), lau (sekiranya), idza (apabila).",
    category: "harf"
  },
  T: {
    name_ms: "Kata Keterangan Masa (Zharf Zaman)",
    name_ar: "ظرف زمان",
    desc_ms: "Kata nama yang menunjukkan waktu berlakunya perbuatan dan secara lazim berkedudukan Mansub.",
    category: "isim"
  },
  LOC: {
    name_ms: "Kata Keterangan Tempat (Zharf Makan)",
    name_ar: "ظرف مكان",
    desc_ms: "Kata nama yang menunjukkan tempat berlakunya perbuatan (seperti fauqa, tahta, amama, khlafa).",
    category: "isim"
  },
  EMPH: {
    name_ms: "Partikel Penegas (Lam Taukid / Harf Taukid)",
    name_ar: "لام التوكيد",
    desc_ms: "Huruf penegasan untuk menguatkan makna ayat (contoh: sesungguhnya, benar-benar).",
    category: "harf"
  },
  SUB: {
    name_ms: "Partikel Masdariah / Subordinat (Harf Masdari)",
    name_ar: "حرف مصدري",
    desc_ms: "Huruf yang menasabkan fi'il mudhari' dan membentuk takwil masdar (seperti an, kay).",
    category: "harf"
  }
};

export const IRAB_CASES = {
  marfu: {
    name_ms: "Marfu' (Rafa' / Keadaan Subjek/Pokok)",
    name_ar: "مرفوع",
    sign_ms: "Tanda asal: Dhammah (baris hadapan) ُ , atau penggantinya (Waw bagi Jamak Muzakkar Salim, Alif bagi Muthanna, Nun bagi Af'al al-Khamsah).",
    roles_ms: "Kedudukan lazim: Pelaku (Fa'il), Pengganti Pelaku (Na'ibul Fa'il), Subjek Ayat Ismiyyah (Mubtada'), Predikat (Khabar), Isim Kana, Khabar Inna."
  },
  mansub: {
    name_ms: "Mansub (Nasab / Keadaan Objek/Pelengkap)",
    name_ar: "منصوب",
    sign_ms: "Tanda asal: Fathah (baris atas) َ , atau penggantinya (Ya' bagi Jamak & Muthanna, Kasrah bagi Jamak Muannath Salim, Alif bagi Asma' al-Khamsah).",
    roles_ms: "Kedudukan lazim: Objek Perbuatan (Maf'ul Bih), Keterangan Masa/Tempat (Zharf/Maf'ul Fih), Keterangan Keadaan (Hal), Pembeza (Tamyiz), Isim Inna, Khabar Kana."
  },
  majrur: {
    name_ms: "Majrur / Makhfudh (Khafadh / Jar / Keadaan Sandaran)",
    name_ar: "مجرور",
    sign_ms: "Tanda asal: Kasrah (baris bawah) ِ , atau penggantinya (Ya' bagi Jamak/Muthanna/Asma' al-Khamsah, Fathah bagi Mamnu' minas Sharf).",
    roles_ms: "Kedudukan lazim: Didahului Kata Sendi Nama (Majrur bi Harf Jar) atau Kata Penyandar Pemilikan (Mudhaf Ilayh)."
  },
  majzum: {
    name_ms: "Majzum (Jazam / Keadaan Fi'il Berhenti/Bersyarat)",
    name_ar: "مجزوم",
    sign_ms: "Tanda asal: Sukun (tanda mati) ْ , atau penggantinya (Gugur Huruf 'Illah atau Gugur Huruf Nun).",
    roles_ms: "Kedudukan khusus untuk Kata Kerja (Fi'il Mudhari'): Didahului partikel penafi/larangan (Lam, La an-Nahiyah) atau partikel syarat."
  },
  mabni: {
    name_ms: "Mabni (Kekal / Tidak Berubah Akhiran)",
    name_ar: "مبني",
    sign_ms: "Kedudukan baris akhir kekal tetap dalam semua keadaan sintaksis (Dhamir, Isim Isyarah, Isim Mausul, Fi'il Madhi, Huruf).",
    roles_ms: "Berada 'Fi Mahalli' (pada kedudukan rafa', nasab, atau jar mengikut fungsi dalam ayat)."
  }
};

/**
 * Menganalisis tag gabungan seperti "P+N", "V+PRON", "CONJ+V"
 */
export function parsePosTag(posTag) {
  if (!posTag) return [{ code: "N", info: POS_DICTIONARY.N }];
  const parts = posTag.split("+").map(p => p.trim());
  return parts.map(part => {
    const info = POS_DICTIONARY[part] || {
      name_ms: `Partikel / Kata (${part})`,
      name_ar: part,
      desc_ms: "Unsur tatabahasa al-Quran.",
      category: "harf"
    };
    return { code: part, info };
  });
}

/**
 * Menghasilkan ulasan tatabahasa & morfologi lengkap dalam Bahasa Melayu
 */
export function generateGrammarReport(token, surahNum, ayahNum) {
  const parsed = parsePosTag(token.pos_tag);
  const partsSummary = parsed.map(p => p.info.name_ms).join(" + ");

  // Mengesan anggaran kes tatabahasa (I'rab) berdasarkan tanda akhir kalimah
  let irabCase = IRAB_CASES.mabni;
  const ar = token.ar || "";
  const lastChar = ar[ar.length - 1];
  const lastHarakat = ar.slice(-2);

  if (token.pos_tag?.includes("P+") || token.pos_tag === "P") {
    irabCase = IRAB_CASES.majrur;
  } else if (ar.endsWith("ِ") || ar.endsWith("ٍ") || ar.endsWith("ينَ") || ar.endsWith("ينِ")) {
    irabCase = IRAB_CASES.majrur;
  } else if (ar.endsWith("ُ") || ar.endsWith("ٌ") || ar.endsWith("ونَ") || ar.endsWith("انِ")) {
    irabCase = IRAB_CASES.marfu;
  } else if (ar.endsWith("َ") || ar.endsWith("ً")) {
    irabCase = IRAB_CASES.mansub;
  } else if (ar.endsWith("ْ")) {
    irabCase = IRAB_CASES.majzum;
  }

  return {
    parsed,
    partsSummary,
    irabCase,
    root: token.root || "Tiada kata dasar (Mabni/Harf)",
    lemma: token.lemma || token.ar,
    transliteration: token.tr,
    gloss_ms: token.ms || token.id || token.en || "—",
    reference: `${surahNum}:${ayahNum}:${token.pos}`
  };
}
