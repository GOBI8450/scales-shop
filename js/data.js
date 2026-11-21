'use strict';
/* Scales demo: catalog definitions and seed data.
   Shop names are real Israeli reptile / pet businesses used only as templates.
   Every description, product, price, sales figure and review below is invented.
   Photos come from PHOTOS (js/credits.js): pools of freely licensed Wikimedia Commons photos per key.
   seed() gives every listing a photo of its own, so no two listings share a picture. */

const DB_VERSION = 3;

const CATS = [
  { id: 'snakes',     he: 'נחשים',          icon: '🐍', img: 'img/ball-00.jpg',    animal: true },
  { id: 'geckos',     he: 'שממיות',         icon: '🦎', img: 'img/leopard-00.jpg', animal: true },
  { id: 'lizards',    he: 'לטאות',          icon: '🐉', img: 'img/bearded-00.jpg', animal: true },
  { id: 'inverts',    he: 'חסרי חוליות',    icon: '🕷️', img: 'img/tarantula-00.jpg', animal: true },
  { id: 'food',       he: 'מזון',           icon: '🦗', img: 'img/crickets-00.jpg', animal: false },
  { id: 'terrariums', he: 'טרריומים',       icon: '🏠', img: 'img/terrarium-00.jpg', animal: false },
  { id: 'heat',       he: 'חימום ותאורה',   icon: '💡', img: 'img/heatlamp-00.jpg', animal: false },
  { id: 'gear',       he: 'ציוד ועיצוב',    icon: '🪵', img: 'img/plants-00.jpg', animal: false },
];

const REGIONS = ['צפון', 'חיפה והסביבה', 'השרון', 'מרכז', 'ירושלים והסביבה', 'שפלה', 'דרום'];

/* k = photo pool in PHOTOS, pop = how well it sells (drives the invented sales numbers). */
const SPECIES = {
  ball:       { he: 'פיתון מלכותי',        lat: 'Python regius',            cat: 'snakes',     k: 'ball',       pop: 9, price: [400, 4200],  weight: [90, 1600], morphs: ['נורמל', 'פסטל', 'מוחבה', 'אנצ׳י', 'בלאק פסטל', 'באנאנה', 'אלבינו', 'קלאון', 'פייבלד'] },
  corn:       { he: 'נחש תירס',            lat: 'Pantherophis guttatus',    cat: 'snakes',     k: 'corn',       pop: 8, price: [250, 900],   weight: [20, 600],  morphs: ['קלאסי', 'אמלניסטי', 'אנרי', 'סנואו', 'אוקיטי', 'טסרה'] },
  hognose:    { he: 'נחש חוטם חזיר',       lat: 'Heterodon nasicus',        cat: 'snakes',     k: 'hognose',    pop: 6, price: [700, 3200],  weight: [15, 250],  morphs: ['נורמל', 'אלבינו', 'אקסנתיק', 'ארקטיק', 'סופר קונדה'] },
  king:       { he: 'נחש מלך',             lat: 'Lampropeltis californiae', cat: 'snakes',     k: 'king',       pop: 5, price: [350, 1200],  weight: [25, 700],  morphs: ['קליפורני פסים', 'קליפורני טבעות', 'אלבינו', 'מקסיקני שחור'] },
  milk:       { he: 'נחש חלב',             lat: 'Lampropeltis triangulum',  cat: 'snakes',     k: 'milk',       pop: 4, price: [400, 1300],  weight: [20, 500],  morphs: ['הונדורס', 'נלסון', 'פואבלן', 'סינלואה'] },
  boa:        { he: 'בואה',                lat: 'Boa imperator',            cat: 'snakes',     k: 'boa',        pop: 3, price: [900, 4500],  weight: [100, 9000], morphs: ['נורמל', 'היפו', 'אנרי', 'סנואו', 'מוטלי'] },
  rainbowboa: { he: 'בואת קשת',            lat: 'Epicrates cenchria',       cat: 'snakes',     k: 'rainbowboa', pop: 2, price: [1100, 2600], weight: [50, 2500], morphs: ['ברזילאי', 'היפו'] },
  leopard:    { he: 'שממית נמרית',         lat: 'Eublepharis macularius',   cat: 'geckos',     k: 'leopard',    pop: 9, price: [150, 2500],  weight: [8, 85],    morphs: ['נורמל', 'היי ילו', 'מק סנואו', 'טנג׳רין', 'אלבינו טרמפר', 'ראפטור', 'בלאק נייט'] },
  crested:    { he: 'שממית מצויצת',        lat: 'Correlophus ciliatus',     cat: 'geckos',     k: 'crested',    pop: 8, price: [300, 3000],  weight: [4, 55],    morphs: ['פליים', 'הארלי', 'דלמטי', 'טייגר', 'פינסטרייפ', 'לילי וייט'] },
  gargoyle:   { he: 'שממית גרגויל',        lat: 'Rhacodactylus auriculatus', cat: 'geckos',    k: 'gargoyle',   pop: 3, price: [450, 1800],  weight: [5, 70],    morphs: ['נמרי', 'פסים', 'אדום מנומר'] },
  fattail:    { he: 'שממית שמנת זנב',      lat: 'Hemitheconyx caudicinctus', cat: 'geckos',    k: 'fattail',    pop: 4, price: [350, 1800],  weight: [8, 75],    morphs: ['נורמל', 'סטרייפ', 'אלבינו', 'אוראו', 'וייטאאוט'] },
  tokay:      { he: 'שממית טוקאי',         lat: 'Gekko gecko',              cat: 'geckos',     k: 'tokay',      pop: 2, price: [200, 600],   weight: [15, 300],  morphs: ['נורמל', 'כחול', 'גרניט'] },
  daygecko:   { he: 'שממית יום ענקית',      lat: 'Phelsuma grandis',         cat: 'geckos',     k: 'daygecko',   pop: 3, price: [400, 1100],  weight: [10, 70],   morphs: ['נורמל', 'אדום נקודות'] },
  bearded:    { he: 'דרקון מזוקן',         lat: 'Pogona vitticeps',         cat: 'lizards',    k: 'bearded',    pop: 9, price: [250, 1500],  weight: [15, 480],  morphs: ['נורמל', 'היפו', 'ציטרוס', 'לדרבק', 'רד', 'טרנסלוסנט'] },
  bluetongue: { he: 'סקינק כחול לשון',     lat: 'Tiliqua scincoides',       cat: 'lizards',    k: 'bluetongue', pop: 4, price: [1200, 3500], weight: [60, 550],  morphs: ['צפוני', 'אינדונזי', 'מראוקה'] },
  veiled:     { he: 'זיקית תימנית',        lat: 'Chamaeleo calyptratus',    cat: 'lizards',    k: 'veiled',     pop: 4, price: [250, 700],   weight: [10, 180],  morphs: ['נורמל', 'טרנסלוסנט'] },
  uromastyx:  { he: 'חרדון צב',            lat: 'Uromastyx',                cat: 'lizards',    k: 'uromastyx',  pop: 3, price: [700, 2200],  weight: [40, 600],  morphs: ['אורנטוס', 'גאוגרפי', 'צהוב'] },
  waterdragon:{ he: 'דרקון מים סיני',       lat: 'Physignathus cocincinus',  cat: 'lizards',    k: 'waterdragon', pop: 2, price: [450, 900],  weight: [20, 600],  morphs: ['נורמל'] },
  tarantula:  { he: 'טרנטולה',             lat: 'Theraphosidae',            cat: 'inverts',    k: 'tarantula',  pop: 5, icon: '🕷️', price: [120, 700],   weight: [2, 40],    morphs: ['כילה רוז', 'ברכיים אדומות', 'קרלי הייר', 'גרין בוטל בלו'] },
  scorpion:   { he: 'עקרב קיסרי',          lat: 'Pandinus imperator',       cat: 'inverts',    k: 'scorpion',   pop: 3, icon: '🦂', price: [150, 400],   weight: [5, 30],    morphs: ['בוגר', 'צעיר'] },
  isopods:    { he: 'איזופודים (מושבה)',   lat: 'Isopoda',                  cat: 'inverts',    k: 'isopods',    pop: 6, icon: '🪲', price: [40, 180],    weight: [1, 1],     morphs: ['דיירי קאו', 'אורנג׳', 'זברה', 'פנדה קינג'] },
};

/* Supplies sold by several shops under the same title, so prices can be compared. */
const SUPPLIES = {
  food: [
    { t: 'צרצרים בינוניים, קופסה של 50',          p: 22,  k: 'crickets',  pop: 10, icon: '🦗', d: 'צרצרי בית בגודל בינוני, מתאימים לשממיות ולדרקונים צעירים.' },
    { t: 'צרצרים קטנים, קופסה של 100',            p: 25,  k: 'crickets',  pop: 8,  icon: '🦗', d: 'צרצרים קטנים לגורים ולבעלי חיים קטנים. מגיעים עם קרטון ביצים ומזון.' },
    { t: 'תולעי קמח, 100 גרם',                    p: 18,  k: 'mealworms', pop: 9,  icon: '🪱', d: 'תולעי קמח טריות. לשמור במקרר כדי להאט את הגלגול.' },
    { t: 'ג׳וקי דוביה בינוניים, 30 יחידות',       p: 35,  k: 'dubia',     pop: 9,  icon: '🪳', d: 'דוביה עשירים בחלבון, לא מטפסים על זכוכית ולא מרעישים.' },
    { t: 'ארבה חיה, 20 יחידות',                   p: 45,  k: 'locust',    pop: 6,  icon: '🦗', d: 'ארבה בגודל בינוני, מזון חי מזין לדרקונים, זיקיות וסקינקים.' },
    { t: 'זופובס (תולעי ענק), 50 יחידות',          p: 35,  k: 'superworm', pop: 6,  icon: '🪱', d: 'זחלים גדולים ועשירים בחלבון, לדרקונים בוגרים ולשממיות גדולות.' },
    { t: 'עכברים קפואים, אריזה של 10',            p: 60,  k: 'mice',      pop: 8,  icon: '🧊', d: 'עכברים קפואים. להפשיר במים חמימים לפני ההאכלה.' },
    { t: 'מזון אבקתי לשממית מצויצת, 60 גרם',      p: 55,  k: 'food',      pop: 7,  icon: '🥭', d: 'תזונה מלאה בטעם מנגו. מערבבים עם מים ומגישים בקערית.' },
    { t: 'אבקת סידן עם D3, 100 גרם',              p: 42,  k: 'calcium',   pop: 8,  icon: '🧂', d: 'תוסף סידן לאיבוק מזון חי. לשימוש פעם־פעמיים בשבוע.' },
  ],
  terrariums: [
    { t: 'טרריום זכוכית 45×45×60 ס״מ',            p: 520, k: 'vivarium',  pop: 6, icon: '🏠', d: 'טרריום אנכי עם דלתות קדמיות ורשת אוורור עליונה. מתאים לשממיות מטפסות.' },
    { t: 'טרריום זכוכית 60×45×45 ס״מ',            p: 560, k: 'terrarium', pop: 7, icon: '🏠', d: 'טרריום אופקי עם דלתות קדמיות. מתאים לשממית נמרית או לנחש צעיר.' },
    { t: 'טרריום זכוכית 90×45×45 ס״מ',            p: 890, k: 'terrarium', pop: 5, icon: '🏠', d: 'טרריום רחב לדרקון מזוקן צעיר או לנחש בינוני.' },
    { t: 'טרריום PVC 120×60×60 ס״מ',              p: 1650, k: 'terrarium', pop: 3, icon: '📦', d: 'טרריום PVC מבודד ששומר חום ולחות. מתאים לדרקון מזוקן בוגר או לפיתון מלכותי.' },
    { t: 'טרריום צמחי (ביו־אקטיבי) 60×45×60 ס״מ',  p: 1100, k: 'vivarium', pop: 3, icon: '🌿', d: 'טרריום מוכן עם רקע, ניקוז, צמחים חיים ומצע. מתאים למינים טרופיים.' },
    { t: 'כלוב רשת לזיקיות 45×45×90 ס״מ',          p: 420, k: 'meshcage',  pop: 3, icon: '🏠', d: 'כלוב רשת מאוורר וגבוה, מתאים לזיקיות.' },
  ],
  heat: [
    { t: 'נורת חימום 75W',                        p: 39,  k: 'heatlamp',  pop: 9, icon: '💡', d: 'נורת חימום ליצירת נקודת השתזפות. לשימוש עם בית מנורה קרמי בלבד.' },
    { t: 'נורת UVB 10.0 T5 באורך 54 ס״מ',          p: 120, k: 'uvb',       pop: 8, icon: '🔆', d: 'נורת UVB למינים מדבריים. מומלץ להחליף כל שנה.' },
    { t: 'משטח חימום 14W',                        p: 79,  k: 'heatmat',   pop: 7, icon: '♨️', d: 'משטח חימום להדבקה מתחת לטרריום. חובה לחבר לתרמוסטט.' },
    { t: 'תרמוסטט דיגיטלי עם חיישן',              p: 149, k: 'thermostat', pop: 7, icon: '🌡️', d: 'תרמוסטט עם תצוגה דיגיטלית וחיישן באורך 1.5 מטר.' },
    { t: 'מד חום ולחות',                          p: 45,  k: 'hygro',     pop: 7, icon: '🌡️', d: 'מד משולב לטמפרטורה וללחות.' },
  ],
  gear: [
    { t: 'מחבוא שרף דמוי סלע, בינוני',            p: 59,  k: 'hide',      pop: 6, icon: '🪨', d: 'מחבוא יציב שקל לנקות. מומלץ לשים אחד בצד החם ואחד בצד הקר.' },
    { t: 'מצע סיבי קוקוס, 8 ליטר',                p: 35,  k: 'coco',      pop: 7, icon: '🥥', d: 'מצע טבעי ששומר לחות. מתאים למינים טרופיים.' },
    { t: 'מצע חול מדברי, 5 ק״ג',                  p: 49,  k: 'sand',      pop: 5, icon: '🏜️', d: 'מצע מדברי לדרקונים ולחרדוני צב. לא מתאים לצעירים מאוד.' },
    { t: 'טחב ספגנום, 100 גרם',                    p: 30,  k: 'moss',      pop: 5, icon: '🌿', d: 'טחב טבעי ששומר לחות. מעולה למחבוא לח ולהטלת ביצים.' },
    { t: 'ענף גפן טבעי, 40–50 ס״מ',               p: 49,  k: 'branch',    pop: 5, icon: '🪵', d: 'ענף טבעי לטיפוס, עבר ניקוי וייבוש.' },
    { t: 'צמח פוטוס חי לטרריום',                   p: 25,  k: 'plants',    pop: 5, icon: '🪴', d: 'צמח מטפס עמיד לטרריומים לחים, נותן מסתור לבעלי החיים.' },
    { t: 'מלקחי האכלה 30 ס״מ',                    p: 28,  k: 'tongs',     pop: 6, icon: '🥢', d: 'מלקחי נירוסטה להאכלה בטוחה במזון חי או קפוא.' },
    { t: 'מרסס לחות 1 ליטר',                      p: 34,  k: 'sprayer',   pop: 6, icon: '💦', d: 'מרסס ידני לשמירה על לחות בטרריום.' },
  ],
};

/* Real business names, used only as templates. `city` is filled only where it was known.
   v: 1 marks the bigger stores shown as verified (licensed) in the demo. This is illustrative only. */
const SHOP_TEMPLATES = [
  { slug: 'snakeshop', v: 1,       name: 'סנייק שופ',              en: 'Snakeshop',                  city: '',            region: '',                 icon: '🐍', color: '#2e7d32', focus: ['snakes', 'heat', 'terrariums', 'food'] },
  { slug: 'herpshop', v: 1,        name: 'הרפ שופ',                en: 'HERP Shop',                  city: '',            region: '',                 icon: '🦎', color: '#c26a00', focus: ['geckos', 'lizards', 'gear'] },
  { slug: 'reptiles-center', v: 1, name: 'המרכז הישראלי לזוחלים',  en: 'Israeli Center for Reptiles', city: '',           region: '',                 icon: '🐉', color: '#13795b', focus: ['lizards', 'snakes', 'heat', 'gear'] },
  { slug: 'zochalia', v: 1,        name: 'זוחליה נחשייה',          en: 'Zochalia',                   city: 'בארות יצחק',  region: 'מרכז',             icon: '🐢', color: '#5b8c1a', focus: ['snakes', 'geckos', 'food'] },
  { slug: 'animal-club',     name: 'אנימל קלאב',             en: 'Animal Club',                city: 'רמת הגולן',   region: 'צפון',             icon: '🌿', color: '#0e7490', focus: ['lizards', 'food', 'gear'] },
  { slug: 'pet-town', v: 1,        name: 'פט טאון',                en: 'Pet Town',                   city: '',            region: '',                 icon: '🏠', color: '#2f6fb3', focus: ['terrariums', 'heat', 'gear', 'food'] },
  { slug: 'zoo-afula',       name: 'זו עפולה',               en: 'Zoo Afula',                  city: 'עפולה',       region: 'צפון',             icon: '🦎', color: '#d9480f', focus: ['terrariums', 'heat', 'geckos'] },
  { slug: 'chowchow',        name: 'צ׳או צ׳או',              en: 'Chow Chow',                  city: '',            region: '',                 icon: '🪵', color: '#b8325a', focus: ['gear', 'terrariums', 'food'] },
  { slug: 'petbest', v: 1,         name: 'פטבסט',                  en: 'PetBest',                    city: '',            region: '',                 icon: '💡', color: '#7b4fb0', focus: ['terrariums', 'heat', 'gear'] },
  { slug: 'megapet', v: 1,         name: 'מגה פט',                 en: 'MegaPet',                    city: '',            region: '',                 icon: '🏬', color: '#1c8c8c', focus: ['terrariums', 'food', 'gear'] },
  { slug: 'just4pet',        name: 'ג׳אסט פור פט',           en: 'Just4Pet',                   city: '',            region: '',                 icon: '🦗', color: '#8a6d1d', focus: ['food', 'gear', 'heat'] },
  { slug: 'meital-labs',     name: 'מיטל מעבדות',            en: 'Meital Labs',                city: '',            region: '',                 icon: '🪲', color: '#4e6b3a', focus: ['food', 'inverts'] },
  { slug: 'zoo-center', v: 1,      name: 'זו סנטר',                en: 'Zoo Center',                 city: 'תל אביב־יפו', region: 'מרכז',             icon: '🦎', color: '#2e7d32', focus: ['lizards', 'geckos', 'gear'] },
  { slug: 'petway',          name: 'פטוויי',                 en: 'Petway',                     city: '',            region: '',                 icon: '🌱', color: '#0e7490', focus: ['food', 'gear', 'heat'] },
  { slug: 'animal-house', v: 1,    name: 'אנימל האוס',             en: 'Animal House',               city: 'כפר הנגיד',   region: 'שפלה',             icon: '🐉', color: '#c26a00', focus: ['lizards', 'terrariums', 'heat'] },
  { slug: 'safari-house', v: 1,    name: 'בית הספארי ירושלים',     en: 'Safari House Jerusalem',     city: 'אמינדב',      region: 'ירושלים והסביבה',  icon: '🦂', color: '#8a6d1d', focus: ['inverts', 'snakes', 'gear'] },
  { slug: 'herp-hobby',      name: 'הרפ הובי שופ',           en: 'Herp Hobby Shop',            city: '',            region: '',                 icon: '🐍', color: '#13795b', focus: ['snakes', 'geckos', 'food'] },
  { slug: 'eranpets',        name: 'ערן וחיות אחרות',        en: 'Eran & Other Animals',       city: '',            region: '',                 icon: '🦎', color: '#d9480f', focus: ['geckos', 'terrariums', 'food'] },
  { slug: 'cichlidon',       name: 'ציקלידון',               en: 'Cichlidon',                  city: '',            region: '',                 icon: '🦎', color: '#2f6fb3', focus: ['geckos', 'terrariums', 'gear'] },
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

const DEMO_CUSTOMERS = [['יוסי כהן', 'חיפה'], ['מיכל לוי', 'תל אביב־יפו'], ['אבי מזרחי', 'באר שבע'], ['נועה פרץ', 'ירושלים'], ['דניאל ביטון', 'ראשון לציון'],
  ['שירה אברהם', 'נתניה'], ['עומר דהן', 'פתח תקווה'], ['רותם אזולאי', 'מודיעין'], ['תמר שפירא', 'רחובות'], ['איתי גבאי', 'כרמיאל']];

function seed() {
  const r = mulberry32(20261121);
  const pick = arr => arr[Math.floor(r() * arr.length)];
  const between = (a, b) => a + r() * (b - a);
  const DAY = 864e5, now = Date.now();
  const db = { v: DB_VERSION, session: null, cart: [], users: [], shops: [], products: [], reviews: [], orders: [], messages: [] };
  let pn = 0;
  const used = {};                                     // photo pool -> photos already given out
  const hasPhoto = k => (PHOTOS[k] || []).length > (used[k] || 0);
  const takePhoto = k => { const i = used[k] || 0; used[k] = i + 1; return PHOTOS[k][i]; };

  const addAnimal = (shop, key, cheaper) => {
    const s = SPECIES[key];
    if (!hasPhoto(s.k)) return false;                  // every listing gets its own photo
    const mi = Math.floor(r() * s.morphs.length);
    const rarity = s.morphs.length > 1 ? mi / (s.morphs.length - 1) : 0;
    const age = r();                                   // 0 = hatchling, 1 = adult
    let price = s.price[0] + (s.price[1] - s.price[0]) * (0.75 * rarity * rarity + 0.25 * age * rarity + 0.06 * r());
    if (cheaper) price *= 0.85;                        // private breeders undercut shops
    price = Math.max(30, Math.round(price / 10) * 10);
    const sex = pick(['male', 'female', 'female', 'male', 'unknown']);
    const year = age > 0.66 ? 2024 : age > 0.33 ? 2025 : 2026;
    const weight = Math.round(between(s.weight[0], s.weight[0] + (s.weight[1] - s.weight[0]) * (0.15 + 0.85 * age)));
    const sale = r() < 0.18;
    db.products.push({
      id: 'p' + (++pn), shopId: shop.id, cat: s.cat, species: key,
      title: s.he + ' ' + s.morphs[mi], morph: s.morphs[mi], sex, birth: year, weight: s.weight[1] > 1 ? weight : 0,
      price, oldPrice: sale ? Math.round(price * 1.2 / 10) * 10 : 0, qty: key === 'isopods' ? 6 : 1 + Math.floor(r() * 2),
      sold: Math.max(1, Math.round(s.pop * between(0.4, 2.2) * (shop.verified ? 1.4 : 1))),
      desc: s.he + ' (' + s.lat + ') בצבע ' + s.morphs[mi] + ', מגידול בשבי. אוכל באופן סדיר, בריא ופעיל. ' +
            'אפשר לקבל תמונות נוספות ופרטים על ההורים בהודעה למוכר.',
      images: [takePhoto(s.k)], icon: s.icon || '', status: 'active', created: now - Math.floor(r() * 60) * DAY,
    });
    return true;
  };

  const addSupply = (shop, cat, item) => {
    if (!hasPhoto(item.k)) return false;
    const price = Math.max(5, Math.round(item.p * between(0.86, 1.2)));
    db.products.push({
      id: 'p' + (++pn), shopId: shop.id, cat, species: '', title: item.t, morph: '', sex: '', birth: 0, weight: 0,
      price, oldPrice: r() < 0.15 ? Math.round(price * 1.18) : 0, qty: 5 + Math.floor(r() * 30),
      sold: Math.max(1, Math.round(item.pop * between(2, 12) * (shop.verified ? 1.4 : 1))),
      desc: item.d, images: [takePhoto(item.k)], icon: item.icon, status: 'active',
      created: now - Math.floor(r() * 60) * DAY,
    });
    return true;
  };

  const addReviews = shop => {
    const n = 2 + Math.floor(r() * 4);
    for (let i = 0; i < n; i++) {
      const [rating, text] = pick(REVIEW_TEXTS);
      db.reviews.push({ id: 'r' + db.reviews.length, shopId: shop.id, userId: '', name: pick(REVIEW_NAMES), rating, text, date: now - Math.floor(r() * 200) * DAY });
    }
  };

  // invented past orders from invented customers, so sellers see sales in their dashboard
  const addOrders = shop => {
    const mine = db.products.filter(p => p.shopId === shop.id);
    if (!mine.length) return;
    const n = 3 + Math.floor(r() * 3) + (shop.verified ? 2 : 0);
    for (let k = 0; k < n; k++) {
      const [name, city] = pick(DEMO_CUSTOMERS);
      const items = [];
      const cnt = Math.min(mine.length, 1 + Math.floor(r() * 3));
      while (items.length < cnt) { const p = pick(mine); if (!items.some(i => i.pid === p.id)) items.push({ pid: p.id, title: p.title, price: p.price, qty: p.species ? 1 : 1 + Math.floor(r() * 3) }); }
      const ship = shop.delivery && r() < 0.7 ? 'delivery' : 'pickup';
      const shipPrice = ship === 'delivery' ? shop.shipPrice : 0;
      const age = Math.floor(between(0, 58));
      db.orders.push({ id: 'o-demo-' + db.orders.length, num: '#' + (1000 + db.orders.length + 1), buyerId: '', demo: true, shopId: shop.id, date: now - age * DAY - Math.floor(r() * DAY),
        status: age < 2 ? 'new' : age < 5 ? 'confirmed' : age < 9 ? 'shipped' : 'done', ship, shipPrice,
        items, total: items.reduce((a, i) => a + i.price * i.qty, 0) + shipPrice,
        addr: { name, phone: '050-0000000', city, address: ship === 'delivery' ? 'כתובת לדוגמה' : '' } });
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
      verified: !!t.v, created: now - (200 + Math.floor(r() * 600)) * DAY,
    };
    db.users.push(user); db.shops.push(shop);
    addReviews(shop);
  });

  // Fill the shops in rounds (one item per focus category per round), so the limited photo pools are shared fairly.
  const left = SHOP_TEMPLATES.map((t, i) => ({ shop: db.shops[i], t, pools: {} }));
  for (let round = 0; round < 5; round++) left.forEach(({ shop, t, pools }) => {
    if (round >= (t.v ? 5 : 4)) return;                // bigger (verified) stores carry more
    t.focus.forEach(cat => {
      if (CATS.find(c => c.id === cat).animal) {
        const keys = Object.keys(SPECIES).filter(k => SPECIES[k].cat === cat);
        for (let tries = 0; tries < 12; tries++) if (addAnimal(shop, pick(keys), false)) break;
      } else {
        const pool = pools[cat] || (pools[cat] = SUPPLIES[cat].slice());
        while (pool.length) if (addSupply(shop, cat, pool.splice(Math.floor(r() * pool.length), 1)[0])) break;
      }
    });
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

  db.shops.forEach(addOrders);
  db.users.push({ id: 'u-buyer', name: 'קונה לדוגמה', email: 'buyer@scales.demo', password: 'buyer123', role: 'buyer', shopId: '', phone: '', city: 'תל אביב־יפו', favs: ['p1', 'p5'], created: now - 30 * DAY });
  db.users.push({ id: 'u-admin', name: 'מנהל האתר', email: 'admin@scales.demo', password: 'admin123', role: 'admin', shopId: '', phone: '', city: '', favs: [], created: now - 400 * DAY });
  return db;
}
