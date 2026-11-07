/**
 * Maktabah Maftoohah — Korpus Al-Quran
 * Enjin Tatabahasa, Morfologi, Sarf & I'rab Al-Quran (Tiers 5 & 6)
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

export const VERB_FORMS = {
  1: {
    roman: "I",
    pattern_ar: "فَعَلَ",
    name_ms: "Bentuk I (Wazan Asas / فَعَلَ)",
    name_en: "Form I (Basic Trilateral / Fa'ala)",
    desc_ms: "Bentuk dasar kata kerja tanpa sebarang huruf tambahan.",
    desc_en: "Base trilateral root pattern without affixes."
  },
  2: {
    roman: "II",
    pattern_ar: "فَعَّلَ",
    name_ms: "Bentuk II (Intensif & Kausatif / فَعَّلَ)",
    name_en: "Form II (Intensive & Causative / Fa''ala)",
    desc_ms: "Penambahan sabdu pada 'ain fi'il; membawa erti perbuatan berulang-ulang, bersungguh-sungguh, atau menyebabkan pihak lain melakukannya.",
    desc_en: "Doubling the middle radical; signifies repeated, intensive, or causative action."
  },
  3: {
    roman: "III",
    pattern_ar: "فَاعَلَ",
    name_ms: "Bentuk III (Resiprokal & Kerjasama / فَاعَلَ)",
    name_en: "Form III (Reciprocal & Associative / Faa'ala)",
    desc_ms: "Penambahan alif selepas fa' fi'il; menunjukkan perbuatan saling berbalas antara dua pihak atau usaha berterusan.",
    desc_en: "Lengthening vowel after first radical; denotes mutual interaction or sustained effort."
  },
  4: {
    roman: "IV",
    pattern_ar: "أَفْعَلَ",
    name_ms: "Bentuk IV (Kausatif / Transisi / أَفْعَلَ)",
    name_en: "Form IV (Causative & Transitive / Af'ala)",
    desc_ms: "Penambahan hamzah qatha' di hadapan; menjadikan fi'il lazim bertukar kepada transitif (menyebabkan sesuatu berlaku).",
    desc_en: "Prefixed hamza; denotes causative action (causing someone or something to undergo the action)."
  },
  5: {
    roman: "V",
    pattern_ar: "تَفَعَّلَ",
    name_ms: "Bentuk V (Refleksif Form II / تَفَعَّلَ)",
    name_en: "Form V (Reflexive of Form II / Tafa''ala)",
    desc_ms: "Penambahan ta' dan sabdu; membawa maksud menerima kesan perbuatan (muthawa'ah) atau berusaha sedikit demi sedikit.",
    desc_en: "Prefixed ta- with doubled middle radical; reflexive or gradual absorption of Form II action."
  },
  6: {
    roman: "VI",
    pattern_ar: "تَفَاعَلَ",
    name_ms: "Bentuk VI (Saling Berbalas / تَفَاعَلَ)",
    name_en: "Form VI (Mutual Interaction / Tafaa'ala)",
    desc_ms: "Penambahan ta' dan alif; menunjukkan kerjasama/salingan antara banyak pihak atau menzahirkan perbuatan.",
    desc_en: "Denotes mutual participation between multiple parties, or deliberate simulation."
  },
  7: {
    roman: "VII",
    pattern_ar: "اِنْفَعَلَ",
    name_ms: "Bentuk VII (Pasif Diri / اِنْفَعَلَ)",
    name_en: "Form VII (Passive & Inchoative / Infa'ala)",
    desc_ms: "Penambahan alif nun di hadapan; menunjukkan kesan langsung perbuatan pada diri subjek tanpa objek.",
    desc_en: "Prefixed in-; expresses the direct passive outcome or submission to an action."
  },
  8: {
    roman: "VIII",
    pattern_ar: "اِفْتَعَلَ",
    name_ms: "Bentuk VIII (Penyertaan Diri / Usaha / اِفْتَعَلَ)",
    name_en: "Form VIII (Middle Voice & Deliberate Effort / Ifta'ala)",
    desc_ms: "Penambahan alif dan ta' celah; menunjukkan perbuatan yang dilakukan dengan usaha gigih untuk kepentingan diri.",
    desc_en: "Infix -ta-; reflexive action or deliberate personal effort for one's own benefit."
  },
  9: {
    roman: "IX",
    pattern_ar: "اِفْعَلَّ",
    name_ms: "Bentuk IX (Warna & Sifat Fizikal / اِفْعَلَّ)",
    name_en: "Form IX (Colors & Physical Defects / If'alla)",
    desc_ms: "Penambahan sabdu pada lam fi'il; khusus untuk perubahan warna atau sifat fizikal.",
    desc_en: "Doubled final radical; specifically denotes acquiring a color or physical attribute."
  },
  10: {
    roman: "X",
    pattern_ar: "اِسْتَفْعَلَ",
    name_ms: "Bentuk X (Permintaan & Pencarian / اِسْتَفْعَلَ)",
    name_en: "Form X (Seeking & Request / Istaf'ala)",
    desc_ms: "Penambahan ista- di hadapan; membawa erti memohon, mencari, atau menganggap sesuatu mempunyai sifat itu.",
    desc_en: "Prefixed ista-; denotes seeking, requesting, or deeming someone to have an attribute."
  }
};

export const ASPECT_DICTIONARY = {
  PERF: {
    name_ar: "فعل ماض",
    name_ms: "Fi'il Madhi (Kala Lalu / Sempurna)",
    name_en: "Perfect Tense (Past Action / Fi'l Madhi)",
    desc_ms: "Perbuatan yang telah berlaku dan selesai sebelum masa penuturan.",
    desc_en: "Denotes an action completed prior to the time of speech."
  },
  IMPF: {
    name_ar: "فعل مضارع",
    name_ms: "Fi'il Mudhari' (Kala Kini & Akan Datang)",
    name_en: "Imperfect Tense (Present / Future / Fi'l Mudhari')",
    desc_ms: "Perbuatan yang sedang berlaku, berterusan, atau akan berlaku.",
    desc_en: "Denotes an ongoing, habitual, or future incomplete action."
  },
  IMPV: {
    name_ar: "فعل أمر",
    name_ms: "Fi'il Amr (Kata Kerja Perintah / Tuntutan)",
    name_en: "Imperative Mood (Command / Supplication)",
    desc_ms: "Tuntutan atau doa agar sesuatu perbuatan dilaksanakan oleh pihak kedua.",
    desc_en: "A direct command, request, or supplication addressed to the second person."
  }
};

export const VOICE_DICTIONARY = {
  ACT: {
    name_ar: "مبني للمعلوم",
    name_ms: "Mabni Lil Ma'lum (Ragam Aktif)",
    name_en: "Active Voice (Ma'lum)",
    desc_ms: "Pelaku perbuatan (Fa'il) diketahui dan wujud dalam susunan tatabahasa ayat.",
    desc_en: "The subject/doer (Fa'il) of the verbal action is expressed."
  },
  PASS: {
    name_ar: "مبني للمجهول",
    name_ms: "Mabni Lil Majhul (Ragam Pasif)",
    name_en: "Passive Voice (Majhul)",
    desc_ms: "Pelaku perbuatan digantikan dengan Pengganti Pelaku (Na'ibul Fa'il).",
    desc_en: "The agent is unstated; the patient is promoted to deputy subject (Na'ibul Fa'il)."
  }
};

export const MOOD_DICTIONARY = {
  IND: {
    name_ar: "مرفوع",
    name_ms: "Marfu' (Indikatif / Asas)",
    name_en: "Indicative Mood (Marfu')",
    desc_ms: "Tanda asal: Baris hadapan (Dhammah) atau ketetapan huruf Nun.",
    desc_en: "Default verbal mood marked by Dhammah or retention of Nun."
  },
  SUBJ: {
    name_ar: "منصوب",
    name_ms: "Mansub (Subjunktif / Didahului Huruf Nasab)",
    name_en: "Subjunctive Mood (Mansub)",
    desc_ms: "Didahului oleh alat penasab (seperti an, lan, kay). Tanda: Fathah atau gugur Nun.",
    desc_en: "Preceded by a subjunctive particle (e.g. an, lan); marked by Fatha or elision of Nun."
  },
  JUS: {
    name_ar: "مجزوم",
    name_ms: "Majzum (Jusif / Didahului Huruf Jazam)",
    name_en: "Jussive Mood (Majzum)",
    desc_ms: "Didahului oleh alat penjazam (seperti lam, la nahiyah). Tanda: Sukun atau gugur huruf 'illah.",
    desc_en: "Preceded by a jussive particle; marked by Sukun or omission of defective letter."
  }
};

export const PGN_DICTIONARY = {
  "1S": { name_ar: "المتكلم المفرد (أنا)", name_ms: "Orang Pertama Tunggal (Saya / Aku)", name_en: "1st Person Singular (I / Me)" },
  "1P": { name_ar: "المتكلم مع الغير (نحن)", name_ms: "Orang Pertama Jamak (Kami / Kita)", name_en: "1st Person Plural (We / Us)" },
  "2MS": { name_ar: "المخاطب المفرد المذكر (أنتَ)", name_ms: "Orang Kedua Lelaki Tunggal (Engkau - L)", name_en: "2nd Person Masculine Singular (You - M)" },
  "2FS": { name_ar: "المخاطبة المفردة المؤنثة (أنتِ)", name_ms: "Orang Kedua Perempuan Tunggal (Engkau - P)", name_en: "2nd Person Feminine Singular (You - F)" },
  "2MD": { name_ar: "المخاطب المثنى (أنتما)", name_ms: "Orang Kedua Dwi (Kamu Berdua)", name_en: "2nd Person Dual (You Two)" },
  "2FD": { name_ar: "المخاطبة المثنى (أنتما)", name_ms: "Orang Kedua Perempuan Dwi (Kamu Berdua - P)", name_en: "2nd Person Dual Feminine (You Two - F)" },
  "2MP": { name_ar: "المخاطبون الجمع المذكر (أنتم)", name_ms: "Orang Kedua Lelaki Jamak (Kamu Sekalian - L)", name_en: "2nd Person Masculine Plural (You All - M)" },
  "2FP": { name_ar: "المخاطبات الجمع المؤنث (أنتنّ)", name_ms: "Orang Kedua Perempuan Jamak (Kamu Sekalian - P)", name_en: "2nd Person Feminine Plural (You All - F)" },
  "3MS": { name_ar: "الغائب المفرد المذكر (هو)", name_ms: "Orang Ketiga Lelaki Tunggal (Dia - L)", name_en: "3rd Person Masculine Singular (He / It - M)" },
  "3FS": { name_ar: "الغائبة المفردة المؤنثة (هي)", name_ms: "Orang Ketiga Perempuan Tunggal (Dia - P)", name_en: "3rd Person Feminine Singular (She / It - F)" },
  "3MD": { name_ar: "الغائب المثنى (هما)", name_ms: "Orang Ketiga Dwi (Mereka Berdua)", name_en: "3rd Person Dual (They Two)" },
  "3FD": { name_ar: "الغائبة المثنى (هما)", name_ms: "Orang Ketiga Perempuan Dwi (Mereka Berdua - P)", name_en: "3rd Person Dual Feminine (They Two - F)" },
  "3MP": { name_ar: "الغائبون الجمع المذكر (هم)", name_ms: "Orang Ketiga Lelaki Jamak (Mereka - L)", name_en: "3rd Person Masculine Plural (They - M)" },
  "3FP": { name_ar: "الغائبات الجمع المؤنث (هنّ)", name_ms: "Orang Ketiga Perempuan Jamak (Mereka - P)", name_en: "3rd Person Feminine Plural (They - F)" }
};

export const DERIVATION_DICTIONARY = {
  ACT_PCPL: {
    name_ar: "اسم الفاعل",
    name_ms: "Isim Fa'il (Partisipel Aktif / Pelaku Perbuatan)",
    name_en: "Active Participle (Ism Fa'il / Agent)",
    desc_ms: "Kata nama yang menunjukkan pihak yang melakukan perbuatan atau berada dalam sifat itu.",
    desc_en: "A derived noun denoting the performer or subject of the verbal action."
  },
  PASS_PCPL: {
    name_ar: "اسم المفعول",
    name_ms: "Isim Maf'ul (Partisipel Pasif / Yang Dikenakan Perbuatan)",
    name_en: "Passive Participle (Ism Maf'ul / Patient)",
    desc_ms: "Kata nama yang menunjukkan sasaran atau pihak yang menerima perbuatan.",
    desc_en: "A derived noun denoting the entity that undergoes the verbal action."
  },
  VN: {
    name_ar: "مصدر",
    name_ms: "Masdar (Kata Nama Verbal / Intipati Perbuatan)",
    name_en: "Verbal Noun (Masdar / Infinitive)",
    desc_ms: "Kata nama terbitan yang merujuk kepada perbuatan itu sendiri tanpa batasan masa.",
    desc_en: "The abstract verbal concept or action itself, unbound by time."
  }
};

export const SYNTAX_ROLES_DICTIONARY = {
  VOC: { name_ar: "أسلوب النداء", name_ms: "Seruan (Nida')", name_en: "Vocative Particle / Address" },
  COND: { name_ar: "أسلوب الشرط", name_ms: "Pengandaian / Syarat (Shart)", name_en: "Conditional Particle" },
  CIRC: { name_ar: "الحال", name_ms: "Keterangan Keadaan (Hal)", name_en: "Circumstantial State (Hal)" },
  RES: { name_ar: "الحصر / الاستثناء", name_ms: "Pembatasan / Pengecualian (Hasr / Istisna')", name_en: "Restriction / Exception" },
  SUB: { name_ar: "المصدر المؤول", name_ms: "Subordinat Masdariah (Takwil Masdar)", name_en: "Subordinated Infinitive Clause" },
  T: { name_ar: "ظرف الزمان", name_ms: "Keterangan Masa (Zharf Zaman)", name_en: "Temporal Adverbial" },
  LOC: { name_ar: "ظرف المكان", name_ms: "Keterangan Tempat (Zharf Makan)", name_en: "Locative Adverbial" },
  EMPH: { name_ar: "التوكيد", name_ms: "Penegasan (Tawkid)", name_en: "Emphatic Reinforcement" },
  NEG: { name_ar: "النفي", name_ms: "Penafian (Nafi)", name_en: "Negative Particle" },
  PRO: { name_ar: "النهي", name_ms: "Larangan (Nahy)", name_en: "Prohibitive Construction" },
  PRP: { name_ar: "التعليل", name_ms: "Tujuan / Sebab (Ta'lil)", name_en: "Purposive / Causal" },
  REM: { name_ar: "الاستئناف", name_ms: "Permulaan Ayat Baru (Isti'naf)", name_en: "Resumption Clause" },
  RSLT: { name_ar: "جواب الشرط", name_ms: "Hasil / Balasan Syarat (Jawab)", name_en: "Apodosis / Result" }
};

export const IRAB_CASES = {
  marfu: {
    name_ms: "Marfu' (Rafa' / Keadaan Subjek/Pokok)",
    name_en: "Nominative Case (Marfu' / Rafa')",
    name_ar: "مرفوع",
    sign_ms: "Tanda asal: Dhammah ُ , atau penggantinya (Waw bagi Jamak Muzakkar Salim, Alif bagi Muthanna, Nun bagi Af'al al-Khamsah).",
    sign_en: "Primary marker: Dhammah ُ , or its substitutes (Waw for Sound Masculine Plural, Alif for Dual, Nun for Five Verbs).",
    roles_ms: "Kedudukan lazim: Pelaku (Fa'il), Pengganti Pelaku (Na'ibul Fa'il), Subjek Ayat Ismiyyah (Mubtada'), Predikat (Khabar), Isim Kana, Khabar Inna.",
    roles_en: "Common roles: Subject/Doer (Fa'il), Deputy Doer (Na'ibul Fa'il), Topic (Mubtada'), Predicate (Khabar), Noun of Kana, Predicate of Inna."
  },
  mansub: {
    name_ms: "Mansub (Nasab / Keadaan Objek/Pelengkap)",
    name_en: "Accusative Case (Mansub / Nasab)",
    name_ar: "منصوب",
    sign_ms: "Tanda asal: Fathah َ , atau penggantinya (Ya' bagi Jamak & Muthanna, Kasrah bagi Jamak Muannath Salim, Alif bagi Asma' al-Khamsah).",
    sign_en: "Primary marker: Fathah َ , or its substitutes (Ya' for Sound Plural & Dual, Kasrah for Sound Feminine Plural, Alif for Five Nouns).",
    roles_ms: "Kedudukan lazim: Objek Perbuatan (Maf'ul Bih), Keterangan Masa/Tempat (Zharf/Maf'ul Fih), Keterangan Keadaan (Hal), Pembeza (Tamyiz), Isim Inna, Khabar Kana.",
    roles_en: "Common roles: Direct Object (Maf'ul Bih), Adverb of Time/Place (Zharf), Circumstance (Hal), Specification (Tamyiz), Noun of Inna, Predicate of Kana."
  },
  majrur: {
    name_ms: "Majrur / Makhfudh (Khafadh / Jar / Keadaan Sandaran)",
    name_en: "Genitive Case (Majrur / Khafdh)",
    name_ar: "مجرور",
    sign_ms: "Tanda asal: Kasrah ِ , atau penggantinya (Ya' bagi Jamak/Muthanna/Asma' al-Khamsah, Fathah bagi Mamnu' minas Sharf).",
    sign_en: "Primary marker: Kasrah ِ , or its substitutes (Ya' for Sound Plural/Dual/Five Nouns, Fathah for Diptotes).",
    roles_ms: "Kedudukan lazim: Didahului Kata Sendi Nama (Majrur bi Harf Jar) atau Kata Penyandar Pemilikan (Mudhaf Ilayh).",
    roles_en: "Common roles: Governed by preposition (Majrur bi Harf Jarr) or Possessor in annexation (Mudhaf Ilayh)."
  },
  majzum: {
    name_ms: "Majzum (Jazam / Keadaan Fi'il Berhenti/Bersyarat)",
    name_en: "Jussive Mood (Majzum / Jazm)",
    name_ar: "مجزوم",
    sign_ms: "Tanda asal: Sukun ْ , atau penggantinya (Gugur Huruf 'Illah atau Gugur Huruf Nun).",
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
 * Menghasilkan ulasan tatabahasa, sarf & morfologi lengkap
 */
export function generateGrammarReport(token, surahNum, ayahNum, lang = 'ms') {
  const isEn = lang === 'en';
  const parsed = parsePosTag(token.pos_tag, lang);
  const partsSummary = parsed.map(p => p.info.name).join(" + ");

  // Mengesan kes tatabahasa (I'rab) berdasarkan tag eksplisit atau tanda akhir
  let irabCaseRaw = IRAB_CASES.mabni;
  if (token.case === 'NOM') {
    irabCaseRaw = IRAB_CASES.marfu;
  } else if (token.case === 'ACC') {
    irabCaseRaw = IRAB_CASES.mansub;
  } else if (token.case === 'GEN') {
    irabCaseRaw = IRAB_CASES.majrur;
  } else {
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
  }

  const irabCase = {
    ...irabCaseRaw,
    name: isEn ? irabCaseRaw.name_en : irabCaseRaw.name_ms,
    sign: isEn ? irabCaseRaw.sign_en : irabCaseRaw.sign_ms,
    roles: isEn ? irabCaseRaw.roles_en : irabCaseRaw.roles_ms
  };

  // Tier 5 & 6 Enriched Sarf & Syntax properties
  const verbForm = token.verb_form && VERB_FORMS[token.verb_form] ? {
    ...VERB_FORMS[token.verb_form],
    name: isEn ? VERB_FORMS[token.verb_form].name_en : VERB_FORMS[token.verb_form].name_ms,
    desc: isEn ? VERB_FORMS[token.verb_form].desc_en : VERB_FORMS[token.verb_form].desc_ms
  } : null;

  const aspect = token.aspect && ASPECT_DICTIONARY[token.aspect] ? {
    ...ASPECT_DICTIONARY[token.aspect],
    name: isEn ? ASPECT_DICTIONARY[token.aspect].name_en : ASPECT_DICTIONARY[token.aspect].name_ms,
    desc: isEn ? ASPECT_DICTIONARY[token.aspect].desc_en : ASPECT_DICTIONARY[token.aspect].desc_ms
  } : null;

  const voice = token.voice && VOICE_DICTIONARY[token.voice] ? {
    ...VOICE_DICTIONARY[token.voice],
    name: isEn ? VOICE_DICTIONARY[token.voice].name_en : VOICE_DICTIONARY[token.voice].name_ms,
    desc: isEn ? VOICE_DICTIONARY[token.voice].desc_en : VOICE_DICTIONARY[token.voice].desc_ms
  } : null;

  const mood = token.mood && MOOD_DICTIONARY[token.mood] ? {
    ...MOOD_DICTIONARY[token.mood],
    name: isEn ? MOOD_DICTIONARY[token.mood].name_en : MOOD_DICTIONARY[token.mood].name_ms,
    desc: isEn ? MOOD_DICTIONARY[token.mood].desc_en : MOOD_DICTIONARY[token.mood].desc_ms
  } : null;

  const pgn = token.pgn && PGN_DICTIONARY[token.pgn] ? {
    ...PGN_DICTIONARY[token.pgn],
    name: isEn ? PGN_DICTIONARY[token.pgn].name_en : PGN_DICTIONARY[token.pgn].name_ms
  } : null;

  const derivation = token.derivation && DERIVATION_DICTIONARY[token.derivation] ? {
    ...DERIVATION_DICTIONARY[token.derivation],
    name: isEn ? DERIVATION_DICTIONARY[token.derivation].name_en : DERIVATION_DICTIONARY[token.derivation].name_ms,
    desc: isEn ? DERIVATION_DICTIONARY[token.derivation].desc_en : DERIVATION_DICTIONARY[token.derivation].desc_ms
  } : null;

  const syntaxRole = token.syntax_role && SYNTAX_ROLES_DICTIONARY[token.syntax_role] ? {
    ...SYNTAX_ROLES_DICTIONARY[token.syntax_role],
    name: isEn ? SYNTAX_ROLES_DICTIONARY[token.syntax_role].name_en : SYNTAX_ROLES_DICTIONARY[token.syntax_role].name_ms
  } : null;

  const defaultNoRoot = isEn ? "No root base (Mabni / Particle)" : "Tiada kata dasar (Mabni/Harf)";
  const gloss = isEn ? (token.en || token.ms || "—") : (token.ms || token.id || token.en || "—");

  return {
    parsed,
    partsSummary,
    irabCase,
    verbForm,
    aspect,
    voice,
    mood,
    pgn,
    derivation,
    syntaxRole,
    root: token.root || defaultNoRoot,
    lemma: token.lemma || token.ar,
    transliteration: token.tr,
    gloss_ms: gloss,
    gloss,
    reference: `${surahNum}:${ayahNum}:${token.pos}`
  };
}
