'use strict';
/* Scales demo: catalog definitions and seed data.
   Shop names are real Israeli reptile / pet businesses used only as templates.
   Every description, product, price and review below is invented. */

const DB_VERSION = 1;

const CATS = [
  { id: 'snakes',     he: 'נחשים',          icon: '🐍', img: 'img/ball-1.jpg',     animal: true },
  { id: 'geckos',     he: 'שממיות',         icon: '🦎', img: 'img/leopard-0.jpg',  animal: true },
  { id: 'lizards',    he: 'לטאות',          icon: '🐉', img: 'img/bearded-0.jpg',  animal: true },
  { id: 'amphibians', he: 'דו־חיים',        icon: '🐸', img: 'img/whites-0.jpg',   animal: true },
  { id: 'inverts',    he: 'חסרי חוליות',    icon: '🕷️', img: '',                   animal: true },
  { id: 'food',       he: 'מזון',           icon: '🦗', img: 'img/crickets-0.jpg', animal: false },
  { id: 'terrariums', he: 'טרריומים',       icon: '🏠', img: '',                   animal: false },
  { id: 'heat',       he: 'חימום ותאורה',   icon: '💡', img: 'img/heatlamp-0.jpg', animal: false },
  { id: 'gear',       he: 'ציוד ועיצוב',    icon: '🪵', img: '',                   animal: false },
];

const REGIONS = ['צפון', 'חיפה והסביבה', 'השרון', 'מרכז', 'ירושלים והסביבה', 'שפלה', 'דרום'];

const SPECIES = {
  ball:       { he: 'פיתון מלכותי',        lat: 'Python regius',            cat: 'snakes',     imgs: ['ball-0', 'ball-1', 'ball-2'],          price: [400, 4200],  weight: [90, 1600], morphs: ['נורמל', 'פסטל', 'מוחבה', 'אנצ׳י', 'בלאק פסטל', 'באנאנה', 'אלבינו', 'קלאון', 'פייבלד'] },
  corn:       { he: 'נחש תירס',            lat: 'Pantherophis guttatus',    cat: 'snakes',     imgs: ['corn-2'],                              price: [250, 900],   weight: [20, 600],  morphs: ['קלאסי', 'אמלניסטי', 'אנרי', 'סנואו', 'אוקיטי', 'טסרה'] },
  hognose:    { he: 'נחש חוטם חזיר',       lat: 'Heterodon nasicus',        cat: 'snakes',     imgs: ['hognose-0'],                           price: [700, 3200],  weight: [15, 250],  morphs: ['נורמל', 'אלבינו', 'אקסנתיק', 'ארקטיק', 'סופר קונדה'] },
  king:       { he: 'נחש מלך',             lat: 'Lampropeltis californiae', cat: 'snakes',     imgs: ['king-0', 'king-1'],                    price: [350, 1200],  weight: [25, 700],  morphs: ['קליפורני פסים', 'קליפורני טבעות', 'אלבינו', 'מקסיקני שחור'] },
  milk:       { he: 'נחש חלב',             lat: 'Lampropeltis triangulum',  cat: 'snakes',     imgs: ['milk-1'],                              price: [400, 1300],  weight: [20, 500],  morphs: ['הונדורס', 'נלסון', 'פואבלן', 'סינלואה'] },
  leopard:    { he: 'שממית נמרית',         lat: 'Eublepharis macularius',   cat: 'geckos',     imgs: ['leopard-0', 'leopard-1', 'leopard-2'], price: [150, 2500],  weight: [8, 85],    morphs: ['נורמל', 'היי ילו', 'מק סנואו', 'טנג׳רין', 'אלבינו טרמפר', 'ראפטור', 'בלאק נייט'] },
  crested:    { he: 'שממית מצויצת',        lat: 'Correlophus ciliatus',     cat: 'geckos',     imgs: ['crested-0', 'crested-1', 'crested-2'], price: [300, 3000],  weight: [4, 55],    morphs: ['פליים', 'הארלי', 'דלמטי', 'טייגר', 'פינסטרייפ', 'לילי וייט'] },
  fattail:    { he: 'שממית שמנת זנב',      lat: 'Hemitheconyx caudicinctus', cat: 'geckos',    imgs: ['fattail-0', 'fattail-2'],              price: [350, 1800],  weight: [8, 75],    morphs: ['נורמל', 'סטרייפ', 'אלבינו', 'אוראו', 'וייטאאוט'] },
  bearded:    { he: 'דרקון מזוקן',         lat: 'Pogona vitticeps',         cat: 'lizards',    imgs: ['bearded-0', 'bearded-1', 'bearded-2'], price: [250, 1500],  weight: [15, 480],  morphs: ['נורמל', 'היפו', 'ציטרוס', 'לדרבק', 'רד', 'טרנסלוסנט'] },
  bluetongue: { he: 'סקינק כחול לשון',     lat: 'Tiliqua scincoides',       cat: 'lizards',    imgs: ['bluetongue-0', 'bluetongue-1'],        price: [1200, 3500], weight: [60, 550],  morphs: ['צפוני', 'אינדונזי', 'מראוקה'] },
  veiled:     { he: 'זיקית תימנית',        lat: 'Chamaeleo calyptratus',    cat: 'lizards',    imgs: ['veiled-0'],                            price: [250, 700],   weight: [10, 180],  morphs: ['נורמל', 'טרנסלוסנט'] },
  pacman:     { he: 'צפרדע פקמן',          lat: 'Ceratophrys cranwelli',    cat: 'amphibians', imgs: ['pacman-0', 'pacman-1', 'pacman-2'],    price: [150, 600],   weight: [10, 250],  morphs: ['ירוק', 'אלבינו', 'סטרוברי', 'אפריקוט'] },
  whites:     { he: 'צפרדע עץ אוסטרלית',   lat: 'Ranoidea caerulea',        cat: 'amphibians', imgs: ['whites-0', 'whites-1', 'whites-2'],    price: [150, 500],   weight: [8, 90],    morphs: ['ירוק', 'בלו', 'סנופלייק'] },
  tarantula:  { he: 'טרנטולה',             lat: 'Theraphosidae',            cat: 'inverts',    imgs: [], icon: '🕷️',                          price: [120, 700],   weight: [2, 40],    morphs: ['כילה רוז', 'ברכיים אדומות', 'קרלי הייר', 'גרין בוטל בלו'] },
  scorpion:   { he: 'עקרב קיסרי',          lat: 'Pandinus imperator',       cat: 'inverts',    imgs: [], icon: '🦂',                          price: [150, 400],   weight: [5, 30],    morphs: ['בוגר', 'צעיר'] },
  isopods:    { he: 'איזופודים (מושבה)',   lat: 'Isopoda',                  cat: 'inverts',    imgs: [], icon: '🪲',                          price: [40, 180],    weight: [1, 1],     morphs: ['דיירי קאו', 'אורנג׳', 'זברה', 'פנדה קינג'] },
};

/* Supplies sold by several shops under the same title, so prices can be compared. */
const SUPPLIES = {
  food: [
    { t: 'צרצרים בינוניים, קופסה של 50',          p: 22,  img: 'crickets-0', icon: '🦗', d: 'צרצרי בית בגודל בינוני, מתאימים לשממיות, לדרקונים צעירים ולצפרדעים.' },
    { t: 'צרצרים קטנים, קופסה של 100',            p: 25,  img: 'crickets-1', icon: '🦗', d: 'צרצרים קטנים לגורים ולבעלי חיים קטנים. מגיעים עם קרטון ביצים ומזון.' },
    { t: 'תולעי קמח, 100 גרם',                    p: 18,  icon: '🪱', d: 'תולעי קמח טריות. לשמור במקרר כדי להאט את הגלגול.' },
    { t: 'ג׳וקי דוביה בינוניים, 30 יחידות',       p: 35,  icon: '🪳', d: 'דוביה עשירים בחלבון, לא מטפסים על זכוכית ולא מרעישים.' },
    { t: 'עכברים קפואים, אריזה של 10',            p: 60,  icon: '🧊', d: 'עכברים קפואים בגודל בוגר. להפשיר במים חמימים לפני ההאכלה.' },
    { t: 'מזון אבקתי לשממית מצויצת, 60 גרם',      p: 55,  icon: '🥭', d: 'תזונה מלאה בטעם מנגו. מערבבים עם מים ומגישים בקערית.' },
    { t: 'אבקת סידן עם D3, 100 גרם',              p: 42,  icon: '🧂', d: 'תוסף סידן לאיבוק מזון חי. לשימוש פעם־פעמיים בשבוע.' },
  ],
  terrariums: [
    { t: 'טרריום זכוכית 45×45×60 ס״מ',            p: 520, icon: '🏠', d: 'טרריום אנכי עם דלתות קדמיות ורשת אוורור עליונה. מתאים לשממיות מטפסות ולצפרדעי עץ.' },
    { t: 'טרריום זכוכית 60×45×45 ס״מ',            p: 560, icon: '🏠', d: 'טרריום אופקי עם דלתות קדמיות. מתאים לשממית נמרית או לנחש צעיר.' },
    { t: 'טרריום זכוכית 90×45×45 ס״מ',            p: 890, icon: '🏠', d: 'טרריום רחב לדרקון מזוקן צעיר או לנחש בינוני.' },
    { t: 'טרריום PVC 120×60×60 ס״מ',              p: 1650, icon: '📦', d: 'טרריום PVC מבודד ששומר חום ולחות. מתאים לדרקון מזוקן בוגר או לפיתון מלכותי.' },
    { t: 'קופסת גידול עם נעילה, 30 ליטר',         p: 85,  icon: '🧰', d: 'קופסת פלסטיק עם חורי אוורור ונעילה, לגידול נחשים צעירים או להסגר.' },
  ],
  heat: [
    { t: 'נורת חימום 75W',                        p: 39,  img: 'heatlamp-0', icon: '💡', d: 'נורת חימום ליצירת נקודת השתזפות. לשימוש עם בית מנורה קרמי בלבד.' },
    { t: 'נורת UVB 10.0 קומפקטית',                p: 95,  img: 'heatlamp-1', icon: '🔆', d: 'נורת UVB למינים מדבריים. מומלץ להחליף כל חצי שנה.' },
    { t: 'משטח חימום 14W',                        p: 79,  icon: '♨️', d: 'משטח חימום להדבקה מתחת לטרריום. חובה לחבר לתרמוסטט.' },
    { t: 'תרמוסטט דיגיטלי עם חיישן',              p: 149, icon: '🌡️', d: 'תרמוסטט און־אוף עם תצוגה דיגיטלית וחיישן באורך 1.5 מטר.' },
    { t: 'מד חום ולחות דיגיטלי',                  p: 45,  icon: '🌡️', d: 'מד משולב לטמפרטורה וללחות, עם חיישן חיצוני.' },
  ],
  gear: [
    { t: 'מחבוא שרף דמוי סלע, בינוני',            p: 59,  icon: '🪨', d: 'מחבוא יציב שקל לנקות. מומלץ לשים אחד בצד החם ואחד בצד הקר.' },
    { t: 'מצע סיבי קוקוס, 8 ליטר',                p: 35,  icon: '🥥', d: 'מצע טבעי ששומר לחות. מתאים למינים טרופיים.' },
    { t: 'קערת מים דמוית סלע, גדולה',             p: 38,  icon: '🥣', d: 'קערה כבדה שלא מתהפכת, עם מדרגות ליציאה קלה.' },
    { t: 'ענף גפן טבעי, 40–50 ס״מ',               p: 49,  icon: '🪵', d: 'ענף טבעי לטיפוס, עבר ניקוי וייבוש.' },
    { t: 'צמחייה מלאכותית תלויה',                 p: 32,  icon: '🌿', d: 'צמח מלאכותי עם וו הצמדה, מוסיף מסתור וגובה לטרריום.' },
    { t: 'מלקחי האכלה 30 ס״מ',                    p: 28,  icon: '🥢', d: 'מלקחי נירוסטה להאכלה בטוחה במזון חי או קפוא.' },
    { t: 'מרסס לחות 1.5 ליטר',                    p: 44,  icon: '💦', d: 'מרסס לחץ ידני לשמירה על לחות בטרריום.' },
  ],
};

/* Real business names, used only as templates. `city` is filled only where it was known. */
const SHOP_TEMPLATES = [
  { slug: 'snakeshop',       name: 'סנייק שופ',              en: 'Snakeshop',                  city: '',            region: '',                 icon: '🐍', color: '#2e7d32', focus: ['snakes', 'heat', 'terrariums', 'food'] },
  { slug: 'herpshop',        name: 'הרפ שופ',                en: 'HERP Shop',                  city: '',            region: '',                 icon: '🦎', color: '#c26a00', focus: ['geckos', 'lizards', 'gear'] },
  { slug: 'reptiles-center', name: 'המרכז הישראלי לזוחלים',  en: 'Israeli Center for Reptiles', city: '',           region: '',                 icon: '🐉', color: '#13795b', focus: ['lizards', 'snakes', 'heat', 'gear'] },
  { slug: 'zochalia',        name: 'זוחליה נחשייה',          en: 'Zochalia',                   city: 'בארות יצחק',  region: 'מרכז',             icon: '🐢', color: '#5b8c1a', focus: ['snakes', 'geckos', 'food'] },
  { slug: 'animal-club',     name: 'אנימל קלאב',             en: 'Animal Club',                city: 'רמת הגולן',   region: 'צפון',             icon: '🌿', color: '#0e7490', focus: ['lizards', 'amphibians', 'gear'] },
  { slug: 'pet-town',        name: 'פט טאון',                en: 'Pet Town',                   city: '',            region: '',                 icon: '🏠', color: '#2f6fb3', focus: ['terrariums', 'heat', 'gear', 'amphibians'] },
  { slug: 'zoo-afula',       name: 'זו עפולה',               en: 'Zoo Afula',                  city: 'עפולה',       region: 'צפון',             icon: '🦎', color: '#d9480f', focus: ['terrariums', 'heat', 'geckos'] },
  { slug: 'chowchow',        name: 'צ׳או צ׳או',              en: 'Chow Chow',                  city: '',            region: '',                 icon: '🪵', color: '#b8325a', focus: ['gear', 'terrariums', 'food'] },
  { slug: 'petbest',         name: 'פטבסט',                  en: 'PetBest',                    city: '',            region: '',                 icon: '💡', color: '#7b4fb0', focus: ['terrariums', 'heat', 'gear'] },
  { slug: 'megapet',         name: 'מגה פט',                 en: 'MegaPet',                    city: '',            region: '',                 icon: '🏬', color: '#1c8c8c', focus: ['terrariums', 'food', 'gear'] },
  { slug: 'just4pet',        name: 'ג׳אסט פור פט',           en: 'Just4Pet',                   city: '',            region: '',                 icon: '🦗', color: '#8a6d1d', focus: ['food', 'gear', 'heat'] },
  { slug: 'meital-labs',     name: 'מיטל מעבדות',            en: 'Meital Labs',                city: '',            region: '',                 icon: '🪲', color: '#4e6b3a', focus: ['food', 'inverts'] },
  { slug: 'zoo-center',      name: 'זו סנטר',                en: 'Zoo Center',                 city: 'תל אביב־יפו', region: 'מרכז',             icon: '🐸', color: '#2e7d32', focus: ['amphibians', 'geckos', 'gear'] },
  { slug: 'petway',          name: 'פטוויי',                 en: 'Petway',                     city: '',            region: '',                 icon: '🌱', color: '#0e7490', focus: ['food', 'gear', 'heat'] },
  { slug: 'animal-house',    name: 'אנימל האוס',             en: 'Animal House',               city: 'כפר הנגיד',   region: 'שפלה',             icon: '🐉', color: '#c26a00', focus: ['lizards', 'terrariums', 'heat'] },
  { slug: 'safari-house',    name: 'בית הספארי ירושלים',     en: 'Safari House Jerusalem',     city: 'אמינדב',      region: 'ירושלים והסביבה',  icon: '🦂', color: '#8a6d1d', focus: ['inverts', 'snakes', 'gear'] },
  { slug: 'herp-hobby',      name: 'הרפ הובי שופ',           en: 'Herp Hobby Shop',            city: '',            region: '',                 icon: '🐍', color: '#13795b', focus: ['snakes', 'geckos', 'food'] },
  { slug: 'eranpets',        name: 'ערן וחיות אחרות',        en: 'Eran & Other Animals',       city: '',            region: '',                 icon: '🦎', color: '#d9480f', focus: ['geckos', 'terrariums', 'food'] },
  { slug: 'cichlidon',       name: 'ציקלידון',               en: 'Cichlidon',                  city: '',            region: '',                 icon: '🐸', color: '#2f6fb3', focus: ['geckos', 'amphibians', 'gear'] },
  { slug: 'pet-point',       name: 'פט פוינט',               en: 'Pet Point',                  city: 'תל אביב־יפו', region: 'מרכז',             icon: '💡', color: '#b8325a', focus: ['food', 'heat', 'gear'] },
];

/* Invented private breeders, to show the "private seller" side of the market. */
const BREEDER_TEMPLATES = [
  { slug: 'noa-geckos',   name: 'השממיות של נועה',  owner: 'נועה (דמו)',  city: 'חיפה',         region: 'חיפה והסביבה', icon: '🦎', color: '#7b4fb0', species: ['crested', 'leopard'] },
  { slug: 'dani-morphs',  name: 'המורפים של דני',   owner: 'דני (דמו)',   city: 'באר שבע',      region: 'דרום',         icon: '🐍', color: '#13795b', species: ['ball', 'hognose'] },
  { slug: 'dragon-den',   name: 'מאורת הדרקונים',   owner: 'יעל (דמו)',   city: 'ראשון לציון',  region: 'מרכז',         icon: '🐉', color: '#d9480f', species: ['bearded', 'bluetongue'] },
];

const FOCUS_TEXT = {
  snakes: 'נחשים מגידול בשבי',
  geckos: 'שממיות לכל רמה',
  lizards: 'לטאות, דרקונים וזיקיות',
  amphibians: 'צפרדעים ודו־חיים',
  inverts: 'טרנטולות וחסרי חוליות',
  food: 'מזון חי וקפוא',
  terrariums: 'טרריומים בכל הגדלים',
  heat: 'חימום ותאורת UVB',
  gear: 'ציוד, מצעים ועיצוב לטרריום',
};

const REVIEW_NAMES = ['אורי', 'מאיה', 'יונתן', 'שירה', 'עידו', 'תמר', 'רועי', 'ליאור', 'הדס', 'גיא', 'נטע', 'אלון'];
const REVIEW_TEXTS = [
  [5, 'שירות מעולה, קיבלתי הסבר מפורט על הטיפול ובעל החיים הגיע בריא ואוכל יפה.'],
  [5, 'מחיר הוגן ויחס אישי. ענו לי לכל השאלות גם אחרי הקנייה.'],
  [4, 'הזמנה הגיעה מהר והכול היה ארוז טוב. מרוצה מאוד.'],
  [5, 'אחרי שהשוויתי מחירים באתר, כאן היה הכי משתלם. ממליץ.'],
  [4, 'מבחר יפה ומוכר סבלני. המשלוח התעכב ביום אחד, אבל עדכנו אותי.'],
  [5, 'רואים שאכפת להם מבעלי החיים. קיבלתי גם דף טיפול מסודר.'],
  [3, 'המוצר טוב, אבל לקח קצת זמן לקבל תשובה להודעה.'],
  [5, 'קנייה שנייה שלי כאן, ושוב הכול היה מושלם.'],
];

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seed() {
  const r = mulberry32(20261114);
  const pick = arr => arr[Math.floor(r() * arr.length)];
  const between = (a, b) => a + r() * (b - a);
  const DAY = 864e5, now = Date.now();
  const db = { v: DB_VERSION, session: null, cart: [], users: [], shops: [], products: [], reviews: [], orders: [], messages: [] };
  let pn = 0;

  const addAnimal = (shop, key, cheaper) => {
    const s = SPECIES[key];
    const mi = Math.floor(r() * s.morphs.length);
    const rarity = s.morphs.length > 1 ? mi / (s.morphs.length - 1) : 0;
    const age = r();                                   // 0 = hatchling, 1 = adult
    let price = s.price[0] + (s.price[1] - s.price[0]) * (0.75 * rarity * rarity + 0.25 * age * rarity + 0.06 * r());
    if (cheaper) price *= 0.85;                        // private breeders undercut shops
    price = Math.max(30, Math.round(price / 10) * 10);
    const sex = pick(['male', 'female', 'female', 'male', 'unknown']);
    const year = age > 0.66 ? 2024 : age > 0.33 ? 2025 : 2026;
    const weight = Math.round(between(s.weight[0], s.weight[0] + (s.weight[1] - s.weight[0]) * (0.15 + 0.85 * age)));
    const img = s.imgs.length ? ['img/' + s.imgs[pn % s.imgs.length] + '.jpg'] : [];
    const sale = r() < 0.18;
    db.products.push({
      id: 'p' + (++pn), shopId: shop.id, cat: s.cat, species: key,
      title: s.he + ' ' + s.morphs[mi], morph: s.morphs[mi], sex, birth: year, weight: s.weight[1] > 1 ? weight : 0,
      price, oldPrice: sale ? Math.round(price * 1.2 / 10) * 10 : 0, qty: key === 'isopods' ? 6 : 1,
      desc: s.he + ' (' + s.lat + ') בצבע ' + s.morphs[mi] + ', מגידול בשבי. אוכל באופן סדיר, בריא ופעיל. ' +
            'אפשר לקבל תמונות נוספות ופרטים על ההורים בהודעה למוכר.',
      images: img, icon: s.icon || '', status: 'active', created: now - Math.floor(r() * 60) * DAY,
    });
  };

  const addSupply = (shop, cat, item) => {
    const price = Math.max(5, Math.round(item.p * between(0.86, 1.2)));
    db.products.push({
      id: 'p' + (++pn), shopId: shop.id, cat, species: '', title: item.t, morph: '', sex: '', birth: 0, weight: 0,
      price, oldPrice: r() < 0.15 ? Math.round(price * 1.18) : 0, qty: 5 + Math.floor(r() * 30),
      desc: item.d, images: item.img ? ['img/' + item.img + '.jpg'] : [], icon: item.icon, status: 'active',
      created: now - Math.floor(r() * 60) * DAY,
    });
  };

  const addReviews = shop => {
    const n = 2 + Math.floor(r() * 4);
    for (let i = 0; i < n; i++) {
      const [rating, text] = pick(REVIEW_TEXTS);
      db.reviews.push({ id: 'r' + db.reviews.length, shopId: shop.id, userId: '', name: pick(REVIEW_NAMES), rating, text, date: now - Math.floor(r() * 200) * DAY });
    }
  };

  SHOP_TEMPLATES.forEach((t, i) => {
    const n = String(i + 1).padStart(2, '0');
    const user = { id: 'u' + (i + 1), name: t.name, email: t.slug + '@scales.demo', password: 'scales' + n, role: 'seller', shopId: 's' + (i + 1), phone: '', city: t.city, favs: [], created: now - 300 * DAY };
    const shop = {
      id: 's' + (i + 1), slug: t.slug, name: t.name, en: t.en, type: 'shop', ownerId: user.id, city: t.city, region: t.region,
      icon: t.icon, color: t.color, logo: '', banner: '', phone: '',
      about: 'חנות לדוגמה באתר הדמו. התמחות: ' + t.focus.map(f => FOCUS_TEXT[f]).join(', ') + '. התיאור, המוצרים והמחירים בעמוד הזה נוצרו לצורך ההדגמה בלבד.',
      pickup: true, delivery: true, shipPrice: 30 + 5 * Math.floor(r() * 5), policy: 'ליווי והדרכה לכל קונה. החזרת ציוד סגור תוך 14 יום.',
      verified: r() < 0.6, created: now - (200 + Math.floor(r() * 600)) * DAY,
    };
    db.users.push(user); db.shops.push(shop);
    t.focus.forEach(cat => {
      const animal = CATS.find(c => c.id === cat).animal;
      if (animal) {
        const keys = Object.keys(SPECIES).filter(k => SPECIES[k].cat === cat);
        for (let k = 0; k < 3; k++) addAnimal(shop, pick(keys), false);
      } else {
        const pool = SUPPLIES[cat].slice();
        for (let k = 0; k < 3 && pool.length; k++) addSupply(shop, cat, pool.splice(Math.floor(r() * pool.length), 1)[0]);
      }
    });
    addReviews(shop);
  });

  BREEDER_TEMPLATES.forEach((t, i) => {
    const uid = 'u' + (SHOP_TEMPLATES.length + i + 1), sid = 's' + (SHOP_TEMPLATES.length + i + 1);
    db.users.push({ id: uid, name: t.owner, email: t.slug + '@scales.demo', password: 'breeder' + (i + 1), role: 'seller', shopId: sid, phone: '', city: t.city, favs: [], created: now - 120 * DAY });
    const shop = {
      id: sid, slug: t.slug, name: t.name, en: '', type: 'breeder', ownerId: uid, city: t.city, region: t.region,
      icon: t.icon, color: t.color, logo: '', banner: '', phone: '',
      about: 'מגדל פרטי לדוגמה (דמות בדויה). גידול ביתי קטן של ' + t.species.map(k => SPECIES[k].he).join(' ו') + ', עם תיעוד של ההורים ושל ההאכלות.',
      pickup: true, delivery: false, shipPrice: 0, policy: 'איסוף עצמי בתיאום מראש. אשמח לענות על שאלות גם אחרי הקנייה.',
      verified: false, created: now - (60 + Math.floor(r() * 200)) * DAY,
    };
    db.shops.push(shop);
    t.species.forEach(k => { for (let j = 0; j < 3; j++) addAnimal(shop, k, true); });
    addReviews(shop);
  });

  db.users.push({ id: 'u-buyer', name: 'קונה לדוגמה', email: 'buyer@scales.demo', password: 'buyer123', role: 'buyer', shopId: '', phone: '', city: 'תל אביב־יפו', favs: ['p1', 'p5'], created: now - 30 * DAY });
  db.users.push({ id: 'u-admin', name: 'מנהל האתר', email: 'admin@scales.demo', password: 'admin123', role: 'admin', shopId: '', phone: '', city: '', favs: [], created: now - 400 * DAY });
  return db;
}
