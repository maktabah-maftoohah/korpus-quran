/**
 * Maktabah Maftoohah — Korpus Al-Quran
 * Enjin Tatabahasa, Morfologi & I'rab Al-Quran
 */

export const POS_DICTIONARY = {
  N: {
    name_ms: "Kata Nama (Isim)",
    name_en: "Noun (Ism)",
    name_ar: "اسم",
    desc_ms: "Kata yang merujuk kepada zat, orang, tempat, benda, konsep atau sifat yang tidak terikat dengan masa.",
    desc_en: "A word pointing to a person, place, thing, concept, or attribute, independent of time.",
    category: "isim"
  },
  PN: {
    name_ms: "Kata Nama Khas (Isim 'Alam)",
    name_en: "Proper Noun (Ism 'Alam)",
    name_ar: "اسم علم",
    desc_ms: "Kata nama khas yang khusus merujuk kepada nama Allah SWT, nama nabi, malaikat, kaum, atau tempat khusus.",
    desc_en: "A proper noun specifically referring to Allah SWT, a prophet, angel, people, or specific location.",
    category: "isim"
  },
  ADJ: {
    name_ms: "Kata Sifat (Sifat / Na'at)",
    name_en: "Adjective (Sifah / Na't)",
    name_ar: "صفة / نعت",
    desc_ms: "Kata yang menerangkan sifat atau keadaan bagi kata nama sebelumnya (al-Man'ut).",
    desc_en: "A qualifying word describing the attribute or state of the preceding noun (Man'ut).",
    category: "isim"
  },
  V: {
    name_ms: "Kata Kerja (Fi'il)",
    name_en: "Verb (Fi'l)",
    name_ar: "فعل",
    desc_ms: "Kata yang menunjukkan perbuatan atau peristiwa yang terikat dengan masa (masa lalu, sekarang, atau akan datang).",
    desc_en: "A word indicating an action or event bound to time (past, present, or future).",
    category: "fiil"
  },
  P: {
    name_ms: "Kata Sendi Nama / Partikel (Harf Jar)",
    name_en: "Preposition (Harf Jarr)",
    name_ar: "حرف جر",
    desc_ms: "Partikel yang mendahului kata nama dan menjadikannya berbaris bawah (Majrur). Contoh: bi (dengan), fi (dalam), min (dari).",
    desc_en: "A preposition that precedes a noun and governs it in the genitive case (Majrur). E.g. bi (with), fi (in), min (from).",
    category: "harf"
  },
  PRON: {
    name_ms: "Kata Ganti Nama (Dhamir)",
    name_en: "Pronoun (Dhamir)",
    name_ar: "ضمير",
    desc_ms: "Kata yang menggantikan nama orang atau benda, sama ada bersambung (muttasil) atau berasingan (munfasil).",
    desc_en: "A word that replaces a noun, either attached (muttasil) or detached (munfasil).",
    category: "isim"
  },
  DEM: {
    name_ms: "Kata Tunjuk (Isim Isyarah)",
    name_en: "Demonstrative Pronoun (Ism Isharah)",
    name_ar: "اسم إشارة",
    desc_ms: "Kata penunjuk dekat atau jauh, seperti 'ini' (hadza, hadzihi) atau 'itu' (dhalika, tilka).",
    desc_en: "A pointing word for near or far reference, such as 'this' (hadha) or 'that' (dhalika).",
    category: "isim"
  },
  REL: {
    name_ms: "Kata Hubung Relatif (Isim Mausul)",
    name_en: "Relative Pronoun (Ism Mawsul)",
    name_ar: "اسم موصول",
    desc_ms: "Kata penghubung yang merujuk kepada 'yang' (alladzi, allati, alladhina) dan memerlukan ayat penerang (Silah al-Mausul).",
    desc_en: "A connective pronoun pointing to 'who/which' (alladhi, allati, alladhina) requiring a relative clause (Silah).",
    category: "isim"
  },
  CONJ: {
    name_ms: "Kata Hubung (Harf 'Ataf)",
    name_en: "Coordinating Conjunction (Harf 'Atf)",
    name_ar: "حرف عطف",
    desc_ms: "Huruf penghubung antara perkataan atau ayat, seperti waw (dan), fa (maka), thumma (kemudian).",
    desc_en: "A conjunction joining words or clauses, such as waw (and), fa (then/so), thumma (then/thereupon).",
    category: "harf"
  },
  NEG: {
    name_ms: "Partikel Nafi / Penafian (Harf Nafi)",
    name_en: "Negative Particle (Harf Nafi)",
    name_ar: "حرف نفي",
    desc_ms: "Huruf untuk menafikan pernyataan, seperti ma (tidak), la (tidak/bukan), lam (belum/tidak).",
    desc_en: "A particle used to negate statements, such as ma (not), la (no/not), lam (did not/not yet).",
    category: "harf"
  },
  INTG: {
    name_ms: "Kata Tanya (Isim / Harf Istifham)",
    name_en: "Interrogative Particle / Noun (Istifham)",
    name_ar: "اسم / حرف استفهام",
    desc_ms: "Kata untuk mengemukakan pertanyaan, seperti hal / a (adakah), man (siapa), ma (apa), ayna (di mana).",
    desc_en: "A word used to ask questions, such as hal / a (is/are), man (who), ma (what), ayna (where).",
    category: "harf"
  },
  VOC: {
    name_ms: "Partikel Seruan (Harf Nida')",
    name_en: "Vocative Particle (Harf Nida')",
    name_ar: "حرف نداء",
    desc_ms: "Huruf untuk menyeru atau memanggil, seperti ya (wahai) diikuti oleh orang/pihak yang diseru (al-Munada).",
    desc_en: "A particle used to call or address someone, such as ya (O / Oh) followed by the vocative noun (Munada).",
    category: "harf"
  },
  COND: {
    name_ms: "Kata Syarat (Harf Syarat)",
    name_en: "Conditional Particle (Harf Shart)",
    name_ar: "حرف شرط",
    desc_ms: "Huruf pengandaian atau syarat, seperti in (jika), lau (sekiranya), idza (apabila).",
    desc_en: "A conditional particle introducing a condition, such as in (if), law (if only), idha (when).",
    category: "harf"
  },
  T: {
    name_ms: "Kata Keterangan Masa (Zharf Zaman)",
    name_en: "Adverb of Time (Zharf Zaman)",
    name_ar: "ظرف زمان",
    desc_ms: "Kata nama yang menunjukkan waktu berlakunya perbuatan dan secara lazim berkedudukan Mansub.",
    desc_en: "A noun denoting the time of an action, typically in the accusative case (Mansub).",
    category: "isim"
  },
  LOC: {
    name_ms: "Kata Keterangan Tempat (Zharf Makan)",
    name_en: "Adverb of Place (Zharf Makan)",
    name_ar: "ظرف مكان",
    desc_ms: "Kata nama yang menunjukkan tempat berlakunya perbuatan (seperti fauqa, tahta, amama, khalfa).",
    desc_en: "A noun denoting the location of an action (such as fauqa / above, tahta / beneath, amama / in front).",
    category: "isim"
  },
  EMPH: {
    name_ms: "Partikel Penegas (Lam Taukid / Harf Taukid)",
    name_en: "Emphatic Particle (Lam / Harf Tawkid)",
    name_ar: "لام التوكيد",
    desc_ms: "Huruf penegasan untuk menguatkan makna ayat (contoh: sesungguhnya, benar-benar).",
    desc_en: "An emphatic particle reinforcing the certainty of a statement (e.g. surely, verily).",
    category: "harf"
  },
  SUB: {
    name_ms: "Partikel Masdariah / Subordinat (Harf Masdari)",
    name_en: "Subordinating Conjunction (Harf Masdari)",
    name_ar: "حرف مصدري",
    desc_ms: "Huruf yang menasabkan fi'il mudhari' dan membentuk takwil masdar (seperti an, kay).",
    desc_en: "A particle governing an imperfect verb in the subjunctive mood to form an infinitive clause (such as an, kay).",
    category: "harf"
  }
};

export const IRAB_CASES = {
  marfu: {
    name_ms: "Marfu' (Rafa' / Keadaan Subjek/Pokok)",
    name_en: "Nominative Case (Marfu' / Rafa')",
    name_ar: "مرفوع",
    sign_ms: "Tanda asal: Dhammah (baris hadapan) ُ , atau penggantinya (Waw bagi Jamak Muzakkar Salim, Alif bagi Muthanna, Nun bagi Af'al al-Khamsah).",
    sign_en: "Primary marker: Dhammah ُ , or its substitutes (Waw for Sound Masculine Plural, Alif for Dual, Nun for Five Verbs).",
    roles_ms: "Kedudukan lazim: Pelaku (Fa'il), Pengganti Pelaku (Na'ibul Fa'il), Subjek Ayat Ismiyyah (Mubtada'), Predikat (Khabar), Isim Kana, Khabar Inna.",
    roles_en: "Common roles: Subject/Doer (Fa'il), Deputy Doer (Na'ibul Fa'il), Topic (Mubtada'), Predicate (Khabar), Noun of Kana, Predicate of Inna."
  },
  mansub: {
    name_ms: "Mansub (Nasab / Keadaan Objek/Pelengkap)",
    name_en: "Accusative Case (Mansub / Nasab)",
    name_ar: "منصوب",
    sign_ms: "Tanda asal: Fathah (baris atas) َ , atau penggantinya (Ya' bagi Jamak & Muthanna, Kasrah bagi Jamak Muannath Salim, Alif bagi Asma' al-Khamsah).",
    sign_en: "Primary marker: Fathah َ , or its substitutes (Ya' for Sound Plural & Dual, Kasrah for Sound Feminine Plural, Alif for Five Nouns).",
    roles_ms: "Kedudukan lazim: Objek Perbuatan (Maf'ul Bih), Keterangan Masa/Tempat (Zharf/Maf'ul Fih), Keterangan Keadaan (Hal), Pembeza (Tamyiz), Isim Inna, Khabar Kana.",
    roles_en: "Common roles: Direct Object (Maf'ul Bih), Adverb of Time/Place (Zharf), Circumstance (Hal), Specification (Tamyiz), Noun of Inna, Predicate of Kana."
  },
  majrur: {
    name_ms: "Majrur / Makhfudh (Khafadh / Jar / Keadaan Sandaran)",
    name_en: "Genitive Case (Majrur / Khafdh)",
    name_ar: "مجرور",
    sign_ms: "Tanda asal: Kasrah (baris bawah) ِ , atau penggantinya (Ya' bagi Jamak/Muthanna/Asma' al-Khamsah, Fathah bagi Mamnu' minas Sharf).",
    sign_en: "Primary marker: Kasrah ِ , or its substitutes (Ya' for Sound Plural/Dual/Five Nouns, Fathah for Diptotes).",
    roles_ms: "Kedudukan lazim: Didahului Kata Sendi Nama (Majrur bi Harf Jar) atau Kata Penyandar Pemilikan (Mudhaf Ilayh).",
    roles_en: "Common roles: Governed by preposition (Majrur bi Harf Jarr) or Possessor in annexation (Mudhaf Ilayh)."
  },
  majzum: {
    name_ms: "Majzum (Jazam / Keadaan Fi'il Berhenti/Bersyarat)",
    name_en: "Jussive Mood (Majzum / Jazm)",
    name_ar: "مجزوم",
    sign_ms: "Tanda asal: Sukun (tanda mati) ْ , atau penggantinya (Gugur Huruf 'Illah atau Gugur Huruf Nun).",
    sign_en: "Primary marker: Sukun ْ , or omission of defective radical / final Nun.",
    roles_ms: "Kedudukan khusus untuk Kata Kerja (Fi'il Mudhari'): Didahului partikel penafi/larangan (Lam, La an-Nahiyah) atau partikel syarat.",
    roles_en: "Specific to Imperfect Verbs: Preceded by negative/prohibitive particle (Lam, La an-Nahiyah) or conditional particle."
  },
  mabni: {
    name_ms: "Mabni (Kekal / Tidak Berubah Akhiran)",
    name_en: "Invariable / Indeclinable (Mabni)",
    name_ar: "مبني",
    sign_ms: "Kedudukan baris akhir kekal tetap dalam semua keadaan sintaksis (Dhamir, Isim Isyarah, Isim Mausul, Fi'il Madhi, Huruf).",
    sign_en: "Vowel ending remains invariable across all syntactic positions (Pronouns, Demonstratives, Relatives, Past Verbs, Particles).",
    roles_ms: "Berada 'Fi Mahalli' (pada kedudukan rafa', nasab, atau jar mengikut fungsi dalam ayat).",
    roles_en: "Virtual syntactic locus 'Fi Mahalli' (occupying nominative, accusative, or genitive position according to clause role)."
  }
};

/**
 * Menganalisis tag gabungan seperti "P+N", "V+PRON", "CONJ+V"
 */
export function parsePosTag(posTag, lang = 'ms') {
  const isEn = lang === 'en';
  if (!posTag) {
    const defaultInfo = {
      ...POS_DICTIONARY.N,
      name: isEn ? POS_DICTIONARY.N.name_en : POS_DICTIONARY.N.name_ms,
      desc: isEn ? POS_DICTIONARY.N.desc_en : POS_DICTIONARY.N.desc_ms
    };
    return [{ code: "N", info: defaultInfo }];
  }

  const parts = posTag.split("+").map(p => p.trim());
  return parts.map(part => {
    const raw = POS_DICTIONARY[part];
    if (raw) {
      return {
        code: part,
        info: {
          ...raw,
          name: isEn ? raw.name_en : raw.name_ms,
          desc: isEn ? raw.desc_en : raw.desc_ms
        }
      };
    }
    return {
      code: part,
      info: {
        name: isEn ? `Particle / Word (${part})` : `Partikel / Kata (${part})`,
        name_ms: `Partikel / Kata (${part})`,
        name_en: `Particle / Word (${part})`,
        name_ar: part,
        desc: isEn ? "Quranic grammatical element." : "Unsur tatabahasa al-Quran.",
        desc_ms: "Unsur tatabahasa al-Quran.",
        desc_en: "Quranic grammatical element.",
        category: "harf"
      }
    };
  });
}

/**
 * Menghasilkan ulasan tatabahasa & morfologi lengkap
 */
export function generateGrammarReport(token, surahNum, ayahNum, lang = 'ms') {
  const isEn = lang === 'en';
  const parsed = parsePosTag(token.pos_tag, lang);
  const partsSummary = parsed.map(p => p.info.name).join(" + ");

  // Mengesan anggaran kes tatabahasa (I'rab) berdasarkan tanda akhir kalimah
  let irabCaseRaw = IRAB_CASES.mabni;
  const ar = token.ar || "";

  if (token.pos_tag?.includes("P+") || token.pos_tag === "P") {
    irabCaseRaw = IRAB_CASES.majrur;
  } else if (ar.endsWith("ِ") || ar.endsWith("ٍ") || ar.endsWith("ينَ") || ar.endsWith("ينِ")) {
    irabCaseRaw = IRAB_CASES.majrur;
  } else if (ar.endsWith("ُ") || ar.endsWith("ٌ") || ar.endsWith("ونَ") || ar.endsWith("انِ")) {
    irabCaseRaw = IRAB_CASES.marfu;
  } else if (ar.endsWith("َ") || ar.endsWith("ً")) {
    irabCaseRaw = IRAB_CASES.mansub;
  } else if (ar.endsWith("ْ")) {
    irabCaseRaw = IRAB_CASES.majzum;
  }

  const irabCase = {
    ...irabCaseRaw,
    name: isEn ? irabCaseRaw.name_en : irabCaseRaw.name_ms,
    sign: isEn ? irabCaseRaw.sign_en : irabCaseRaw.sign_ms,
    roles: isEn ? irabCaseRaw.roles_en : irabCaseRaw.roles_ms
  };

  const defaultNoRoot = isEn ? "No root base (Mabni / Particle)" : "Tiada kata dasar (Mabni/Harf)";
  const gloss = isEn ? (token.en || token.ms || "—") : (token.ms || token.id || token.en || "—");

  return {
    parsed,
    partsSummary,
    irabCase,
    root: token.root || defaultNoRoot,
    lemma: token.lemma || token.ar,
    transliteration: token.tr,
    gloss_ms: gloss,
    gloss,
    reference: `${surahNum}:${ayahNum}:${token.pos}`
  };
}
