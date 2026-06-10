'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'id' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, variables?: Record<string, string | number>) => string;
  translateDynamic: (text: string | null | undefined) => string;
}

const translations = {
  id: {
    appTitle: "SmartHalal – Cek Status Kehalalan Bahan Pangan",
    heroBadge: "✦ Platform Edukasi Kehalalan Bahan Pangan ✦",
    heroTitlePart1: "Cek Status ",
    heroTitleGradGreen: "Halal",
    heroTitlePart2: "Bahan Pangan ",
    heroTitleGradGold: "Instan",
    heroSubtitle: "Verifikasi status kehalalan zat tambahan pangan, kode E-Number, dan komposisi produk secara cepat dan akurat.",
    searchPlaceholder: "Cari nama bahan atau kode E-Number...",
    searchButton: "Cari",
    tryLabel: "Coba:",
    statTotal: "Total Bahan",
    statHalal: "Status Halal",
    statSyubhat: "Status Syubhat",
    statHaram: "Status Haram",
    descHalal: "Halal — Aman dikonsumsi",
    descSyubhat: "Syubhat — Perlu diwaspadai",
    descHaram: "Haram — Tidak boleh",
    loading: "Menelusuri database...",
    foundResults: "Ditemukan {count} hasil",
    notFoundTitle: "Bahan Tidak Ditemukan",
    notFoundDesc: "Kami belum memiliki data untuk bahan tersebut. Coba kata kunci atau ejaan lain.",
    sourceLabel: "Sumber",
    dbActive: "Database Aktif",
    checkFood: "Cek Bahan Pangan",
    statusHalal: "HALAL",
    statusHaram: "HARAM",
    statusSyubhat: "SYUBHAT",
    sourceText: "Sumber",
  },
  en: {
    appTitle: "SmartHalal – Check Food Ingredients Halal Status",
    heroBadge: "✦ Halal Food Ingredients Education Platform ✦",
    heroTitlePart1: "Check ",
    heroTitleGradGreen: "Halal",
    heroTitlePart2: "Status of Instant ",
    heroTitleGradGold: "Ingredients",
    heroSubtitle: "Verify the halal status of food additives, E-Number codes, and product compositions quickly and accurately.",
    searchPlaceholder: "Search ingredient name or E-Number code...",
    searchButton: "Search",
    tryLabel: "Try:",
    statTotal: "Total Ingredients",
    statHalal: "Halal Status",
    statSyubhat: "Doubtful Status",
    statHaram: "Haram Status",
    descHalal: "Halal — Safe to consume",
    descSyubhat: "Doubtful — Use with caution",
    descHaram: "Haram — Forbidden / Prohibited",
    loading: "Searching database...",
    foundResults: "Found {count} results",
    notFoundTitle: "Ingredient Not Found",
    notFoundDesc: "We don't have data for that ingredient yet. Try another keyword or spelling.",
    sourceLabel: "Source",
    dbActive: "Database Active",
    checkFood: "Check Ingredients",
    statusHalal: "HALAL",
    statusHaram: "HARAM",
    statusSyubhat: "DOUBTFUL",
    sourceText: "Source",
  }
};

// =============================================================================
// COMPREHENSIVE INDONESIAN → ENGLISH TRANSLATION DICTIONARY
// Priority: longer/more specific phrases first to avoid partial-match conflicts
// =============================================================================
const dynamicReplacements: [RegExp, string][] = [

  // ─── PHARMACEUTICAL DOSAGE FORMS ───────────────────────────────────────────
  [/Sediaan obat jadi berbentuk Salep\/Krim/gi, "Finished drug formulation in Ointment/Cream form"],
  [/Sediaan obat jadi berbentuk Tablet/gi, "Finished drug formulation in Tablet form"],
  [/Sediaan obat jadi berbentuk Kapsul/gi, "Finished drug formulation in Capsule form"],
  [/Sediaan obat jadi berbentuk Sirup/gi, "Finished drug formulation in Syrup form"],
  [/Sediaan obat dalam cangkang keras atau lunak/gi, "Oral dosage form in hard or soft capsule shell"],
  [/Sediaan obat cair dengan kandungan gula tinggi/gi, "Liquid dosage form with high sugar content"],
  [/Sediaan setengah padat untuk pemakaian luar pada kulit/gi, "Semi-solid formulation for external skin application"],
  [/Sintetis bahan obat bebas gelatin/gi, "Gelatin-free synthetic pharmaceutical ingredient"],
  [/Sintetis bahan obat \+ gelatin cangkang kapsul \(hewan\/nabati\)/gi, "Synthetic drug + gelatin capsule shell (animal/plant-derived)"],
  [/Memerlukan bahan pengisi dan pengikat halal/gi, "Requires halal binders and fillers"],
  [/Memerlukan pengemulsi dan basis minyak halal/gi, "Requires halal emulsifiers and oil base"],
  [/Umumnya halal kecuali ada kandungan alkohol pelarut berlebih/gi, "Generally halal unless solvent alcohol content is excessive"],
  [/Wajib cek status halal cangkang gelatinnya/gi, "Halal status of gelatin capsule shell must be verified"],
  [/cangkang kapsul gelatin sapi/gi, "bovine gelatin capsule shell"],
  [/cangkang kapsul gelatin babi/gi, "porcine gelatin capsule shell"],
  [/cangkang gelatin/gi, "gelatin capsule shell"],
  [/cangkang kapsul/gi, "capsule shell"],

  // ─── ANIMAL SOURCES (compound phrases first) ────────────────────────────────
  [/tulang sapi bersertifikasi/gi, "certified bovine bone"],
  [/tulang babi bersertifikasi/gi, "certified porcine bone"],
  [/lemak babi murni/gi, "pure lard (porcine fat)"],
  [/lemak sapi murni/gi, "pure tallow (bovine fat)"],
  [/lemak babi/gi, "lard (porcine fat)"],
  [/lemak sapi/gi, "beef tallow"],
  [/darah sapi/gi, "bovine blood"],
  [/darah babi/gi, "porcine blood"],
  [/kulit sapi/gi, "bovine hide/skin"],
  [/kulit babi/gi, "porcine skin"],
  [/susu sapi/gi, "cow's milk"],
  [/daging sapi/gi, "beef"],
  [/daging babi/gi, "pork"],
  [/daging ayam/gi, "chicken meat"],
  [/daging kambing/gi, "goat meat"],
  [/daging domba/gi, "lamb meat"],
  [/tulang sapi/gi, "bovine bone"],
  [/tulang babi/gi, "porcine bone"],
  [/tulang ikan/gi, "fish bone"],
  [/gelatin sapi/gi, "bovine gelatin"],
  [/gelatin babi/gi, "porcine gelatin"],
  [/gelatin ikan/gi, "fish gelatin"],
  [/kolagen sapi/gi, "bovine collagen"],
  [/kolagen babi/gi, "porcine collagen"],
  [/kolagen ikan/gi, "marine collagen"],
  [/lemak hewani/gi, "animal fat"],
  [/protein hewani/gi, "animal protein"],
  [/enzim hewan/gi, "animal enzyme"],
  [/gelatin hewan/gi, "animal gelatin"],

  // ─── ANIMAL NOUNS ────────────────────────────────────────────────────────────
  [/\bsapi\b/gi, "bovine/beef"],
  [/\bbabi\b/gi, "porcine/pork"],
  [/\bayam\b/gi, "chicken/poultry"],
  [/\bikan\b/gi, "fish"],
  [/\bkambing\b/gi, "goat"],
  [/\bdomba\b/gi, "lamb"],
  [/\bbebek\b/gi, "duck"],
  [/\bundur-undur\b/gi, "mole cricket"],
  [/\bserangga\b/gi, "insect"],
  [/\blebah\b/gi, "bee"],
  [/\bukuran kecil\b/gi, "small-sized"],
  [/\bhewan\b/gi, "animal"],
  [/\bhewani\b/gi, "animal-derived"],

  // ─── PLANT PARTS (compound first) ───────────────────────────────────────────
  [/Ekstrak Daun/gi, "Leaf Extract"],
  [/Ekstrak Bunga/gi, "Flower Extract"],
  [/Ekstrak Buah/gi, "Fruit Extract"],
  [/Ekstrak Biji/gi, "Seed Extract"],
  [/Ekstrak Akar/gi, "Root Extract"],
  [/Ekstrak Batang/gi, "Stem Extract"],
  [/Minyak Biji/gi, "Seed Oil"],
  [/Minyak Atsiri/gi, "Essential Oil"],
  [/Minyak Buah/gi, "Fruit Oil"],
  [/Sari Buah/gi, "Fruit Juice"],
  [/Bubuk Biji/gi, "Seed Powder"],
  [/Bubuk Daun/gi, "Leaf Powder"],
  [/Gel Daun/gi, "Leaf Gel"],
  [/daun lidah buaya/gi, "aloe vera leaf"],
  [/tanaman lidah buaya/gi, "aloe vera plant"],
  [/Lidah Buaya/gi, "Aloe Vera"],
  [/\bDaun\b/gi, "Leaf"],
  [/\bBunga\b/gi, "Flower"],
  [/\bBuah\b/gi, "Fruit"],
  [/\bBiji\b/gi, "Seed"],
  [/\bAkar\b/gi, "Root"],
  [/\bBatang\b/gi, "Stem"],
  [/\bKulit\b/gi, "Bark/Peel"],
  [/\bGel\b/gi, "Gel"],
  [/\bSari\b/gi, "Extract/Juice"],
  [/\bBubuk\b/gi, "Powder"],
  [/\bEkstrak\b/gi, "Extract"],
  [/\bMinyak\b/gi, "Oil"],

  // ─── BOTANICAL NAMES (Indonesian) ────────────────────────────────────────────
  [/Pegagan/gi, "Centella Asiatica"],
  [/Kunyit/gi, "Turmeric"],
  [/Jahe Merah/gi, "Red Ginger"],
  [/Jahe/gi, "Ginger"],
  [/Teh Hijau/gi, "Green Tea"],
  [/Teh Hitam/gi, "Black Tea"],
  [/Mahkota Dewa/gi, "Phaleria Macrocarpa"],
  [/Temulawak/gi, "Javanese Turmeric"],
  [/Sambiloto/gi, "Andrographis"],
  [/Kayu Manis/gi, "Cinnamon"],
  [/Adas/gi, "Fennel"],
  [/Kemangi/gi, "Lemon Basil"],
  [/Sirih/gi, "Betel Leaf"],
  [/Kelor/gi, "Moringa"],
  [/Kemiri/gi, "Candlenut"],
  [/Kelapa/gi, "Coconut"],
  [/Brokoli/gi, "Broccoli"],
  [/Wortel/gi, "Carrot"],
  [/Bayam/gi, "Spinach"],
  [/Tomat/gi, "Tomato"],
  [/Semangka/gi, "Watermelon"],
  [/Anggur/gi, "Grape"],
  [/Jeruk/gi, "Citrus/Orange"],
  [/Mangga/gi, "Mango"],
  [/Pepaya/gi, "Papaya"],
  [/Pisang/gi, "Banana"],
  [/Nanas/gi, "Pineapple"],
  [/Strawberi/gi, "Strawberry"],
  [/Blueberry/gi, "Blueberry"],
  [/Apel/gi, "Apple"],
  [/Alpukat/gi, "Avocado"],
  [/Delima/gi, "Pomegranate"],
  [/Coklat/gi, "Chocolate/Cocoa"],
  [/Kakao/gi, "Cacao"],
  [/Vanila/gi, "Vanilla"],
  [/Kayu Putih/gi, "Eucalyptus"],
  [/Nilam/gi, "Patchouli"],
  [/Lavender/gi, "Lavender"],
  [/Mawar/gi, "Rose"],
  [/Melati/gi, "Jasmine"],
  [/Chamomile/gi, "Chamomile"],
  [/Rosemary/gi, "Rosemary"],
  [/Peppermint/gi, "Peppermint"],
  [/Bawang Merah/gi, "Red Onion/Shallot"],
  [/Bawang Putih/gi, "Garlic"],
  [/Seledri/gi, "Celery"],
  [/Lemon/gi, "Lemon"],

  // ─── FOOD INGREDIENT TERMS ───────────────────────────────────────────────────
  [/Gelatin Murni/gi, "Pure Gelatin"],
  [/Gelatin/gi, "Gelatin"],
  [/Tepung Terigu/gi, "Wheat Flour"],
  [/Tepung Beras/gi, "Rice Flour"],
  [/Tepung Tapioka/gi, "Tapioca Starch"],
  [/Tepung Jagung/gi, "Corn Starch"],
  [/Tepung/gi, "Flour/Starch"],
  [/Gula Pasir/gi, "White Sugar"],
  [/Gula Merah/gi, "Palm Sugar / Brown Sugar"],
  [/Gula/gi, "Sugar"],
  [/Garam/gi, "Salt"],
  [/Air/gi, "Water"],
  [/Mentega/gi, "Butter"],
  [/Susu/gi, "Milk"],
  [/Telur/gi, "Egg"],
  [/Madu/gi, "Honey"],
  [/Cuka/gi, "Vinegar"],
  [/Kedelai/gi, "Soy/Soybean"],
  [/Jagung/gi, "Corn/Maize"],
  [/Beras/gi, "Rice"],
  [/Gandum/gi, "Wheat"],
  [/Protein Gandum Terhidrolisis/gi, "Hydrolyzed Wheat Protein"],
  [/Protein Kedelai/gi, "Soy Protein"],
  [/Protein/gi, "Protein"],
  [/Pati/gi, "Starch"],
  [/Serat/gi, "Fiber"],
  [/Lemak Nabati/gi, "Vegetable Fat"],
  [/Lemak/gi, "Fat"],

  // ─── ADDITIVES / FUNCTIONAL TERMS ────────────────────────────────────────────
  [/Mono dan Digliserida Asam Lemak/gi, "Mono- and Diglycerides of Fatty Acids"],
  [/Asam Lemak/gi, "Fatty Acid"],
  [/Asam Sitrat/gi, "Citric Acid"],
  [/Asam Benzoat/gi, "Benzoic Acid"],
  [/Asam Askorbat/gi, "Ascorbic Acid (Vitamin C)"],
  [/Asam Laktat/gi, "Lactic Acid"],
  [/Asam Stearat/gi, "Stearic Acid"],
  [/Asam Palmitat/gi, "Palmitic Acid"],
  [/Asam Asetat/gi, "Acetic Acid"],
  [/Asam/gi, "Acid"],
  [/Natrium Benzoat/gi, "Sodium Benzoate"],
  [/Natrium Klorida/gi, "Sodium Chloride (Salt)"],
  [/Natrium Karbonat/gi, "Sodium Carbonate"],
  [/Natrium/gi, "Sodium"],
  [/Kalsium Karbonat/gi, "Calcium Carbonate"],
  [/Kalsium/gi, "Calcium"],
  [/Magnesium Stearat/gi, "Magnesium Stearate"],
  [/Magnesium/gi, "Magnesium"],
  [/Kalium/gi, "Potassium"],
  [/Seng/gi, "Zinc"],
  [/Besi/gi, "Iron"],
  [/Zat Besi/gi, "Iron"],
  [/Zat Pewarna/gi, "Colorant"],
  [/Zat Pemanis/gi, "Sweetener"],
  [/Zat Pengawet/gi, "Preservative"],
  [/Zat Pengemulsi/gi, "Emulsifier"],
  [/Zat Penstabil/gi, "Stabilizer"],
  [/Pewarna Alami/gi, "Natural Colorant"],
  [/Pewarna Buatan/gi, "Artificial Colorant"],
  [/Pewarna/gi, "Colorant/Dye"],
  [/Pemanis Alami/gi, "Natural Sweetener"],
  [/Pemanis Buatan/gi, "Artificial Sweetener"],
  [/Pemanis/gi, "Sweetener"],
  [/Pengawet/gi, "Preservative"],
  [/Pengemulsi/gi, "Emulsifier"],
  [/Penstabil/gi, "Stabilizer"],
  [/Antioksidan/gi, "Antioxidant"],
  [/Pengental/gi, "Thickener"],
  [/Perisa Sintetik/gi, "Synthetic Flavoring"],
  [/Perisa Alami/gi, "Natural Flavoring"],
  [/Perisa/gi, "Flavoring"],
  [/Penyedap Rasa/gi, "Flavor Enhancer"],
  [/Penyedap/gi, "Flavoring/Seasoning"],
  [/Kolagen/gi, "Collagen"],
  [/Keratin/gi, "Keratin"],
  [/Karnitin/gi, "Carnitine"],

  // ─── COSMETIC / SKINCARE TERMS ───────────────────────────────────────────────
  [/Pelembap/gi, "Moisturizer"],
  [/Pelembab/gi, "Moisturizer"],
  [/Pembersih/gi, "Cleanser"],
  [/Perawatan Kulit/gi, "Skincare"],
  [/Perawatan Rambut/gi, "Haircare"],
  [/Kulit Wajah/gi, "Facial Skin"],
  [/Kulit/gi, "Skin"],
  [/Rambut/gi, "Hair"],
  [/Busa/gi, "Foam/Lather"],
  [/Deterjen/gi, "Detergent"],
  [/Sabun/gi, "Soap"],
  [/Sampo/gi, "Shampoo"],
  [/Kondisioner/gi, "Conditioner"],

  // ─── CERTIFICATION / STATUS DESCRIPTORS ──────────────────────────────────────
  [/disembelih sesuai syariat Islam/gi, "slaughtered according to Islamic law"],
  [/sesuai syariat Islam/gi, "according to Islamic law"],
  [/bersertifikasi halal/gi, "halal certified"],
  [/bersertifikasi/gi, "certified"],
  [/proses fermentasi/gi, "fermentation process"],
  [/proses ekstraksi/gi, "extraction process"],
  [/diproduksi secara sintetis/gi, "synthetically produced"],
  [/diproduksi/gi, "produced"],
  [/diperoleh dari/gi, "obtained from"],
  [/diekstrak dari/gi, "extracted from"],
  [/berasal dari/gi, "derived from"],
  [/digunakan sebagai/gi, "used as"],
  [/digunakan dalam/gi, "used in"],
  [/digunakan untuk/gi, "used for"],
  [/digunakan/gi, "used"],
  [/mengandung/gi, "containing"],
  [/tidak halal/gi, "not halal"],
  [/aman dikonsumsi/gi, "safe to consume"],
  [/perlu diwaspadai/gi, "requires caution"],
  [/tidak boleh dikonsumsi/gi, "must not be consumed"],

  // ─── GENERAL DESCRIPTORS ─────────────────────────────────────────────────────
  [/nabati/gi, "plant-based"],
  [/sintetis/gi, "synthetic"],
  [/alami/gi, "natural"],
  [/murni/gi, "pure"],
  [/terkonsentrasi/gi, "concentrated"],
  [/terhidrolisis/gi, "hydrolyzed"],
  [/fermentasi/gi, "fermented"],
  [/organik/gi, "organic"],
  [/kering/gi, "dry/dried"],
  [/segar/gi, "fresh"],
  [/cair/gi, "liquid"],
  [/padat/gi, "solid"],
  [/halus/gi, "fine/smooth"],
  [/kasar/gi, "coarse/rough"],
  [/kualitas tinggi/gi, "high quality"],
  [/berkualitas tinggi/gi, "high quality"],
  [/premium/gi, "premium"],
  [/tradisional/gi, "traditional"],
  [/modern/gi, "modern"],
  [/industri/gi, "industrial"],
  [/komersial/gi, "commercial"],
  [/tulang/gi, "bone"],
  [/darah/gi, "blood"],
  [/lemak/gi, "fat"],
  [/jaringan/gi, "tissue"],
  [/organ/gi, "organ"],
  [/perut/gi, "stomach"],
  [/usus/gi, "intestine"],
  [/empedu/gi, "bile"],

  // ─── USAGE/PURPOSE DESCRIPTIONS ──────────────────────────────────────────────
  [/Kaya antioksidan bioaktif untuk skincare kulit wajah dan minuman herbal/gi, "Rich in bioactive antioxidants for facial skincare and herbal beverages"],
  [/Gel yang diekstrak dari daun/gi, "Gel extracted from the leaf of"],
  [/Digunakan secara luas dalam produk perawatan kulit, rambut, dan minuman kesehatan/gi, "Widely used in skincare, haircare products, and health beverages"],
  [/Digunakan dalam formulasi skincare premium, kosmetik, atau penyedap masakan alami/gi, "Used in premium skincare formulations, cosmetics, or natural culinary flavorings"],
  [/Digunakan dalam campuran jamu herbal tradisional, bumbu, atau masker alami/gi, "Used in traditional herbal blends, seasonings, or natural face masks"],
  [/kaya antioksidan/gi, "rich in antioxidants"],
  [/formulasi skincare/gi, "skincare formulation"],
  [/produk perawatan/gi, "care product"],
  [/jamu herbal/gi, "herbal remedy"],
  [/minuman kesehatan/gi, "health beverage"],
  [/masker alami/gi, "natural face mask"],
  [/penyedap masakan/gi, "culinary flavoring"],

  // ─── SOURCE KEYWORDS ─────────────────────────────────────────────────────────
  [/100% nabati/gi, "100% plant-based"],
  [/Tulang sapi bersertifikasi/gi, "Certified bovine bone"],
  [/Serangga Cochineal/gi, "Cochineal insect"],
  [/tumbuhan/gi, "plant/herb"],
  [/pertanian/gi, "agricultural"],
  [/hutan/gi, "forest"],
  [/laut/gi, "marine/sea"],
  [/tambang/gi, "mineral/mined"],
  [/laboratorium/gi, "laboratory"],
  [/pabrik/gi, "factory/industrial"],

  // ─── INGREDIENT CATEGORY TERMS ───────────────────────────────────────────────
  [/Sediaan padat obat yang dibuat dengan cetak kempa/gi, "Solid dosage form made by compression tableting"],
  [/Tablet/gi, "Tablet"],
  [/Kapsul/gi, "Capsule"],
  [/Sirup/gi, "Syrup"],
  [/Salep/gi, "Ointment"],
  [/Krim/gi, "Cream"],
  [/Larutan/gi, "Solution"],
  [/Suspensi/gi, "Suspension"],
  [/Emulsi/gi, "Emulsion"],
  [/Salep\/Krim/gi, "Ointment/Cream"],

  // ─── NUMBERS / UNITS ─────────────────────────────────────────────────────────
  [/\bdan\b/gi, "and"],
  [/\batau\b/gi, "or"],
  [/\bdari\b/gi, "from"],
  [/\bpada\b/gi, "on/in"],
  [/\buntuk\b/gi, "for"],
  [/\bdengan\b/gi, "with"],
  [/\byang\b/gi, "that/which"],
  [/\bdi\b/gi, "in/at"],
  [/\bke\b/gi, "to"],
  [/\bsebagai\b/gi, "as"],
  [/\bjuga\b/gi, "also"],
  [/\bserta\b/gi, "and/as well as"],
  [/\bkecuali\b/gi, "except"],
  [/\bnamun\b/gi, "however"],
  [/\bakan\b/gi, "will"],
  [/\badalah\b/gi, "is/are"],
  [/\bini\b/gi, "this"],
  [/\bitu\b/gi, "that"],
  [/\bsaat\b/gi, "when/during"],
  [/\bagar\b/gi, "so that"],
  [/\bjika\b/gi, "if"],
  [/\bapabila\b/gi, "when/if"],
  [/\bsehingga\b/gi, "so that/resulting in"],
  [/\bkarena\b/gi, "because"],
  [/\bdapat\b/gi, "can/may"],
  [/\bbisa\b/gi, "can"],
  [/\bsangat/gi, "very"],
  [/\btidak\b/gi, "not"],
  [/\btidak ada\b/gi, "no/none"],
  [/\bbelum\b/gi, "not yet"],
  [/\btelah\b/gi, "has/have"],
  [/\bsudah\b/gi, "already"],
  [/\bsering\b/gi, "often"],
  [/\bbanyak\b/gi, "many/much"],
  [/\bumumnya\b/gi, "generally"],
  [/\bbiasanya\b/gi, "usually"],
  [/\bterutama\b/gi, "especially"],
  [/\bhanya\b/gi, "only"],
  [/\bjenis\b/gi, "type/kind"],
  [/\bbentuk\b/gi, "form/shape"],
  [/\bproses\b/gi, "process"],
  [/\bbahan\b/gi, "ingredient/material"],
  [/\bproduk\b/gi, "product"],
  [/\bkandungan\b/gi, "content/component"],
  [/\bsumber\b/gi, "source"],
  [/\bstatus\b/gi, "status"],
  [/\bkode\b/gi, "code"],
];

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('id');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem('smart-halal-lang') as Language;
    if (savedLang === 'id' || savedLang === 'en') {
      setLanguageState(savedLang);
    }
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('smart-halal-lang', lang);
  };

  const t = (key: string, variables?: Record<string, string | number>): string => {
    const dict = translations[language];
    let text = dict[key as keyof typeof dict] || key;
    if (variables) {
      Object.entries(variables).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    return text;
  };

  const translateDynamic = (text: string | null | undefined): string => {
    if (!text) return '';
    if (language === 'id') return text;

    let translated = text;
    dynamicReplacements.forEach(([regex, replacement]) => {
      translated = translated.replace(regex, replacement);
    });
    return translated;
  };

  if (!mounted) {
    return (
      <LanguageContext.Provider value={{ language: 'id', setLanguage, t, translateDynamic }}>
        <div style={{ opacity: 0 }}>{children}</div>
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translateDynamic }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
