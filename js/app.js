(() => {
"use strict";

/* =========================================================
   Reference data
   ========================================================= */
const CATS = [
  { id: "geckos",     name: "שממיות",            ic: "🦎", kind: "animal" },
  { id: "lizards",    name: "חרדונים ולטאות",     ic: "🐉", kind: "animal" },
  { id: "snakes",     name: "נחשים",              ic: "🐍", kind: "animal" },
  { id: "amphibians", name: "דו־חיים",            ic: "🐸", kind: "animal" },
  { id: "inverts",    name: "עכבישים וחרקים",     ic: "🕷️", kind: "animal" },
  { id: "terrariums", name: "טרריומים",           ic: "🏠", kind: "supply" },
  { id: "heat",       name: "חימום ותאורה",       ic: "💡", kind: "supply" },
  { id: "food",       name: "מזון ומזון חי",      ic: "🦗", kind: "supply" },
  { id: "decor",      name: "מצעים ועיצוב",       ic: "🪵", kind: "supply" },
  { id: "care",       name: "בריאות ואביזרים",    ic: "🧰", kind: "supply" },
];
const catById = id => CATS.find(c => c.id === id) || CATS[0];

const PALETTE = ["#13795B","#1C8C8C","#2E7D32","#5B8C1A","#C26A00","#D9480F","#B8325A","#7B4FB0","#2F6FB3","#0E7490","#8A6D1D","#4E6B3A"];
const ICONS = ["🦎","🐍","🐉","🐢","🐸","🕷️","🦂","🦗","🌿","🏠","💡","🪲"];
const TINTS = { geckos:"#FFF1D6", lizards:"#FFE6DA", snakes:"#E3F4E8", amphibians:"#E2F5F1", inverts:"#EFE8F7", terrariums:"#E6F0FA", heat:"#FFF6CC", food:"#F1F6DC", decor:"#F3EBDD", care:"#E8EEF7" };

/* Product templates used to seed the demo catalogue */
const TPL = [
  // animals
  { t:"שממית נמרית (Leopard Gecko) צעירה", cat:"geckos", e:"🦎", p:250, sex:"נקבה", age:"4 חודשים", level:"מתאים למתחילים", d:"שממית נמרית מגידול בשבי, אוכלת חרקים חיים היטב. רגועה ונוחה להחזקה. מומלץ טרריום של 60 ס״מ לפחות עם מקור חום." },
  { t:"שממית מצויצת (Crested Gecko)", cat:"geckos", e:"🦎", p:320, sex:"לא ידוע", age:"3 חודשים", level:"מתאים למתחילים", d:"שממית מצויצת מגידול בשבי, ניזונה ממזון אבקתי ייעודי וחרקים. אוהבת טרריום גבוה עם צמחייה." },
  { t:"שממית גרגויל (Gargoyle Gecko)", cat:"geckos", e:"🦎", p:450, sex:"זכר", age:"6 חודשים", level:"בינוני", d:"שממית גרגויל בצבעי כתום־אפור. פעילה בלילה, מתאימה לטרריום אנכי." },
  { t:"שממית שמנת זנב אפריקאית", cat:"geckos", e:"🦎", p:380, sex:"נקבה", age:"5 חודשים", level:"מתאים למתחילים", d:"שממית שקטה ורגועה, צריכה לחות מעט גבוהה יותר משממית נמרית." },
  { t:"חרדון מזוקן (Bearded Dragon) צעיר", cat:"lizards", e:"🐉", p:450, sex:"לא ידוע", age:"3 חודשים", level:"מתאים למתחילים", d:"חרדון מזוקן מגידול בשבי. חברותי וסקרן. דורש תאורת UVB ומקום חם של 38–40 מעלות." },
  { t:"סקינק לשון כחולה", cat:"lizards", e:"🦎", p:1200, sex:"זכר", age:"8 חודשים", level:"בינוני", d:"סקינק לשון כחולה רגוע, אוכל מגוון ירקות, חלבונים ופירות. מגיע עם הדרכה ראשונית." },
  { t:"זיקית מצוירת (Veiled Chameleon)", cat:"lizards", e:"🦎", p:600, sex:"זכר", age:"4 חודשים", level:"למגדלים מנוסים", d:"זיקית מגידול בשבי. דורשת כלוב רשת, טפטוף מים ותאורת UVB. לא מתאימה למגע תכוף." },
  { t:"פיתון מלכותי (Ball Python)", cat:"snakes", e:"🐍", p:550, sex:"נקבה", age:"5 חודשים", level:"מתאים למתחילים", d:"פיתון מלכותי מגידול בשבי, אוכל עכברים קפואים. רגוע, גדל לאורך של כמטר וחצי." },
  { t:"נחש תירס (Corn Snake)", cat:"snakes", e:"🐍", p:300, sex:"זכר", age:"4 חודשים", level:"מתאים למתחילים", d:"נחש תירס בצבע כתום־אדום קלאסי. קל לטיפול, אוכל טוב." },
  { t:"נחש מלך קליפורני", cat:"snakes", e:"🐍", p:420, sex:"נקבה", age:"6 חודשים", level:"בינוני", d:"נחש מלך עם פסים שחור־לבן. פעיל וחזק, יש להחזיק לבד בטרריום." },
  { t:"נחש חלב הונדורסי", cat:"snakes", e:"🐍", p:480, sex:"זכר", age:"5 חודשים", level:"בינוני", d:"נחש חלב בצבעי אדום, שחור וצהוב. מגידול בשבי." },
  { t:"נחש חרטום (Western Hognose)", cat:"snakes", e:"🐍", p:900, sex:"נקבה", age:"4 חודשים", level:"בינוני", d:"נחש קטן עם אף מורם ואופי מצחיק. נשאר קטן יחסית." },
  { t:"צפרדע פקמן (Pacman Frog)", cat:"amphibians", e:"🐸", p:220, sex:"לא ידוע", age:"3 חודשים", level:"מתאים למתחילים", d:"צפרדע עגולה וירוקה שכמעט לא זזה. צריכה לחות גבוהה ומצע לח." },
  { t:"צפרדע עץ של וייט", cat:"amphibians", e:"🐸", p:260, sex:"לא ידוע", age:"4 חודשים", level:"מתאים למתחילים", d:"צפרדע עץ ירוקה ורגועה, פעילה בערב. מתאימה לטרריום גבוה." },
  { t:"טרנטולה ברכיפלמה (Brachypelma)", cat:"inverts", e:"🕷️", p:180, sex:"לא ידוע", age:"צעירה", level:"מתאים למתחילים", d:"טרנטולה רגועה יחסית, גדלה לאט. מגיעה בקופסת העברה." },
  // supplies
  { t:"טרריום זכוכית 60×45×45 עם דלתות קדמיות", cat:"terrariums", e:"🏠", p:690, d:"טרריום זכוכית עם פתיחה קדמית, רשת אוורור עליונה ונעילה. מתאים לשממיות ולחרדון צעיר." },
  { t:"טרריום זכוכית 90×45×45", cat:"terrariums", e:"🏠", p:990, d:"טרריום גדול לחרדון מזוקן בוגר או נחש בינוני. כולל פתחים לחוטי חשמל." },
  { t:"כלוב רשת לזיקיות 45×45×90", cat:"terrariums", e:"🏠", p:420, d:"כלוב רשת אלומיניום מאוורר, גבוה, מתאים לזיקיות ולצפרדעי עץ." },
  { t:"נורת UVB 10.0 T5 באורך 54 ס״מ", cat:"heat", e:"💡", p:180, d:"נורת UVB למדבריים. חשובה לבריאות העצמות של חרדונים וזיקיות. להחליף כל 12 חודשים." },
  { t:"נורת חימום 75 וואט", cat:"heat", e:"💡", p:45, d:"נורה ליצירת נקודת חום בטרריום. מומלץ לשלב עם תרמוסטט." },
  { t:"משטח חימום 20 וואט", cat:"heat", e:"🔥", p:95, d:"משטח חימום מודבק לתחתית הטרריום. מתאים לשממיות ונחשים." },
  { t:"תרמוסטט דיגיטלי עם חיישן", cat:"heat", e:"🌡️", p:160, d:"שומר על טמפרטורה קבועה ומונע התחממות יתר. קל להתקנה." },
  { t:"צרצרים חיים, קופסה של 50", cat:"food", e:"🦗", p:25, d:"צרצרים בגודל בינוני, מתאימים לשממיות ולחרדונים צעירים." },
  { t:"זחלי קמח, 100 גרם", cat:"food", e:"🪱", p:20, d:"זחלי קמח טריים. לשמור בקירור." },
  { t:"ג׳וקים דוביה, 30 יחידות", cat:"food", e:"🪳", p:40, d:"מזון חי מזין ושקט, לא מטפס על זכוכית. מתאים לחרדונים." },
  { t:"עכברים קפואים, 10 יחידות", cat:"food", e:"🐭", p:60, d:"עכברים קפואים בגודל מתאים לפיתון מלכותי צעיר. להפשיר לפני האכלה." },
  { t:"מזון אבקתי לשממית מצויצת 200 גרם", cat:"food", e:"🥣", p:85, d:"מזון מלא לשממיות מצויצות וגרגויל. מערבבים עם מים." },
  { t:"אבקת סידן עם ויטמין D3", cat:"care", e:"🧂", p:45, d:"תוסף סידן לפיזור על חרקים לפני האכלה." },
  { t:"מצע סיבי קוקוס, 8 ליטר", cat:"decor", e:"🥥", p:35, d:"מצע טבעי שומר לחות, מתאים לצפרדעים ולטרופיים." },
  { t:"מצע חול מדברי, 5 ק״ג", cat:"decor", e:"🏜️", p:55, d:"מצע מדברי לחרדונים. לא מתאים לצעירים מאוד." },
  { t:"מחבוא סלע מלאכותי", cat:"decor", e:"🪨", p:70, d:"מערה לחה או יבשה לשממיות ונחשים. קל לניקוי." },
  { t:"ענף עץ טבעי לטיפוס", cat:"decor", e:"🪵", p:65, d:"ענף מעובד ובטוח לשימוש בטרריום." },
  { t:"מדחום ומד לחות דיגיטלי", cat:"care", e:"🌡️", p:40, d:"מציג טמפרטורה ולחות על מסך גדול וקריא." },
  { t:"מלקחיים להאכלה 30 ס״מ", cat:"care", e:"🥢", p:35, d:"מלקחיים מנירוסטה להאכלה בטוחה." },
  { t:"מרסס מים 1 ליטר", cat:"care", e:"💧", p:30, d:"לריסוס הטרריום ושמירה על לחות." },
];

/* PHOTOS:START */
const PHOTOS = {"leopard": ["img/leopard-0.jpg", "img/leopard-1.jpg", "img/leopard-2.jpg"], "crested": ["img/crested-1.jpg", "img/crested-0.jpg", "img/crested-2.jpg"], "fattail": ["img/fattail-0.jpg", "img/fattail-2.jpg"], "bearded": ["img/bearded-0.jpg", "img/bearded-1.jpg", "img/bearded-2.jpg"], "bluetongue": ["img/bluetongue-0.jpg", "img/bluetongue-1.jpg"], "veiled": ["img/veiled-0.jpg"], "ball": ["img/ball-1.jpg", "img/ball-2.jpg", "img/ball-0.jpg"], "corn": ["img/corn-2.jpg"], "king": ["img/king-0.jpg", "img/king-1.jpg"], "milk": ["img/milk-1.jpg"], "hognose": ["img/hognose-0.jpg"], "pacman": ["img/pacman-0.jpg", "img/pacman-1.jpg", "img/pacman-2.jpg"], "whites": ["img/whites-0.jpg", "img/whites-1.jpg", "img/whites-2.jpg"], "heatlamp": ["img/heatlamp-0.jpg", "img/heatlamp-1.jpg"], "crickets": ["img/crickets-0.jpg", "img/crickets-1.jpg"]};
const CREDITS = [{"src": "img/leopard-0.jpg", "title": "File:Eublepharis macularius 2009 G6.jpg", "page": "https://commons.wikimedia.org/wiki/File:Eublepharis_macularius_2009_G6.jpg", "artist": "George Chernilevsky", "license": "Public domain"}, {"src": "img/leopard-1.jpg", "title": "File:Eublepharis macularius 2009 G5.jpg", "page": "https://commons.wikimedia.org/wiki/File:Eublepharis_macularius_2009_G5.jpg", "artist": "George Chernilevsky", "license": "Public domain"}, {"src": "img/leopard-2.jpg", "title": "File:Eublepharis macularius 2009 G8.jpg", "page": "https://commons.wikimedia.org/wiki/File:Eublepharis_macularius_2009_G8.jpg", "artist": "George Chernilevsky", "license": "Public domain"}, {"src": "img/crested-1.jpg", "title": "File:Gekkoninae Rhacodactylus ciliatus orange.png", "page": "https://commons.wikimedia.org/wiki/File:Gekkoninae_Rhacodactylus_ciliatus_orange.png", "artist": "annakilljoy, moderator of geckoleo.com/forum", "license": "Public domain"}, {"src": "img/crested-0.jpg", "title": "File:Gekkoninae Rhacodactylus ciliatus tete.png", "page": "https://commons.wikimedia.org/wiki/File:Gekkoninae_Rhacodactylus_ciliatus_tete.png", "artist": "annakilljoy, moderator of geckoleo.com/forum", "license": "Public domain"}, {"src": "img/crested-2.jpg", "title": "File:Correlophus ciliatus 33605230.jpg", "page": "https://commons.wikimedia.org/wiki/File:Correlophus_ciliatus_33605230.jpg", "artist": "Lennart Hudel", "license": "CC BY 4.0"}, {"src": "img/fattail-0.jpg", "title": "File:Hemitheconyx caudicinctus.jpg", "page": "https://commons.wikimedia.org/wiki/File:Hemitheconyx_caudicinctus.jpg", "artist": "", "license": "CC BY-SA 3.0"}, {"src": "img/fattail-2.jpg", "title": "File:Fat-Tailed Gecko Sleeping.jpeg", "page": "https://commons.wikimedia.org/wiki/File:Fat-Tailed_Gecko_Sleeping.jpeg", "artist": "User:Kevronichebroni", "license": "CC BY-SA 3.0"}, {"src": "img/bearded-0.jpg", "title": "File:Pogona vitticeps close-up 2009 G3.jpg", "page": "https://commons.wikimedia.org/wiki/File:Pogona_vitticeps_close-up_2009_G3.jpg", "artist": "George Chernilevsky", "license": "Public domain"}, {"src": "img/bearded-1.jpg", "title": "File:383 - Head of central bearded dragon (Pogona vitticeps).jpg", "page": "https://commons.wikimedia.org/wiki/File:383_-_Head_of_central_bearded_dragon_(Pogona_vitticeps).jpg", "artist": "Virtual-Pano", "license": "CC BY 4.0"}, {"src": "img/bearded-2.jpg", "title": "File:Pogona vitticeps 2009 G2.jpg", "page": "https://commons.wikimedia.org/wiki/File:Pogona_vitticeps_2009_G2.jpg", "artist": "George Chernilevsky", "license": "Public domain"}, {"src": "img/bluetongue-0.jpg", "title": "File:Tiliqua scincoides (White, 1790).jpg", "page": "https://commons.wikimedia.org/wiki/File:Tiliqua_scincoides_(White,_1790).jpg", "artist": "Michael Gäbler", "license": "CC BY-SA 3.0"}, {"src": "img/bluetongue-1.jpg", "title": "File:Eastern blue-tongued lizard - Tiliqua scincoides scincoides - 3.jpg", "page": "https://commons.wikimedia.org/wiki/File:Eastern_blue-tongued_lizard_-_Tiliqua_scincoides_scincoides_-_3.jpg", "artist": "Geoff Penaluna", "license": "CC BY 2.0"}, {"src": "img/veiled-0.jpg", "title": "File:Chamaeleo calyptratus 01.jpg", "page": "https://commons.wikimedia.org/wiki/File:Chamaeleo_calyptratus_01.jpg", "artist": "H. Zell", "license": "CC BY-SA 3.0"}, {"src": "img/ball-1.jpg", "title": "File:Ball python lucy.JPG", "page": "https://commons.wikimedia.org/wiki/File:Ball_python_lucy.JPG", "artist": "HCA (talk)", "license": "CC BY-SA 3.0"}, {"src": "img/ball-2.jpg", "title": "File:Pythonidae Python regius 3.jpg", "page": "https://commons.wikimedia.org/wiki/File:Pythonidae_Python_regius_3.jpg", "artist": "NasserHalaweh", "license": "CC BY-SA 4.0"}, {"src": "img/ball-0.jpg", "title": "File:Python-regius-kopf-königspython.jpg", "page": "https://commons.wikimedia.org/wiki/File:Python-regius-kopf-k%C3%B6nigspython.jpg", "artist": "Holger Krisp", "license": "CC BY 3.0"}, {"src": "img/corn-2.jpg", "title": "File:Kornnatter (Pantherophis guttatus), Seitenansicht.jpg", "page": "https://commons.wikimedia.org/wiki/File:Kornnatter_(Pantherophis_guttatus),_Seitenansicht.jpg", "artist": "Peter Paplanus", "license": "CC BY 2.0"}, {"src": "img/king-0.jpg", "title": "File:Californiakingsnake.jpg", "page": "https://commons.wikimedia.org/wiki/File:Californiakingsnake.jpg", "artist": "Calibas", "license": "CC BY-SA 3.0"}, {"src": "img/king-1.jpg", "title": "File:California Kingsnake (Lampropeltis getula californiae).JPG", "page": "https://commons.wikimedia.org/wiki/File:California_Kingsnake_(Lampropeltis_getula_californiae).JPG", "artist": "Connor Long", "license": "CC BY-SA 4.0"}, {"src": "img/milk-1.jpg", "title": "File:Lampropeltis triangulum hondurensis, a Hondurian Milksnake.jpg", "page": "https://commons.wikimedia.org/wiki/File:Lampropeltis_triangulum_hondurensis,_a_Hondurian_Milksnake.jpg", "artist": "Dick Culbert", "license": "CC BY 2.0"}, {"src": "img/hognose-0.jpg", "title": "File:Heterodon nasicus.jpg", "page": "https://commons.wikimedia.org/wiki/File:Heterodon_nasicus.jpg", "artist": "The original uploader was Dawson at English Wikipedia.", "license": "CC BY-SA 2.5"}, {"src": "img/pacman-0.jpg", "title": "File:Ceratophrys cranwelli 56095539.jpg", "page": "https://commons.wikimedia.org/wiki/File:Ceratophrys_cranwelli_56095539.jpg", "artist": "Pablo H Capovilla", "license": "CC BY-SA 4.0"}, {"src": "img/pacman-1.jpg", "title": "File:Cranwell's horned frog.jpg", "page": "https://commons.wikimedia.org/wiki/File:Cranwell%27s_horned_frog.jpg", "artist": "Diberri  and  Celgeofrog", "license": "CC BY-SA 3.0"}, {"src": "img/pacman-2.jpg", "title": "File:Cranwell's horned frog (Ceratophrys cranwelli), Entomica.jpg", "page": "https://commons.wikimedia.org/wiki/File:Cranwell%27s_horned_frog_(Ceratophrys_cranwelli),_Entomica.jpg", "artist": "Fungus Guy", "license": "CC BY-SA 4.0"}, {"src": "img/whites-0.jpg", "title": "File:Ranoidea caerulea - Wilhelma 01.jpg", "page": "https://commons.wikimedia.org/wiki/File:Ranoidea_caerulea_-_Wilhelma_01.jpg", "artist": "Llez", "license": "CC BY-SA 3.0"}, {"src": "img/whites-1.jpg", "title": "File:Australia green tree frog (Litoria caerulea) crop.jpg", "page": "https://commons.wikimedia.org/wiki/File:Australia_green_tree_frog_(Litoria_caerulea)_crop.jpg", "artist": "LiquidGhoul", "license": "Public domain"}, {"src": "img/whites-2.jpg", "title": "File:Litoria caerulea - Darwin NT.jpg", "page": "https://commons.wikimedia.org/wiki/File:Litoria_caerulea_-_Darwin_NT.jpg", "artist": "Bidgee", "license": "CC BY 3.0"}, {"src": "img/heatlamp-0.jpg", "title": "File:Ampoule céramique infrarouge 2.jpg", "page": "https://commons.wikimedia.org/wiki/File:Ampoule_c%C3%A9ramique_infrarouge_2.jpg", "artist": "Lionel Allorge", "license": "CC BY-SA 3.0"}, {"src": "img/heatlamp-1.jpg", "title": "File:Ampoule céramique infrarouge 1.jpg", "page": "https://commons.wikimedia.org/wiki/File:Ampoule_c%C3%A9ramique_infrarouge_1.jpg", "artist": "Lionel Allorge", "license": "CC BY-SA 3.0"}, {"src": "img/crickets-0.jpg", "title": "File:Gryllus assimilis (1).jpg", "page": "https://commons.wikimedia.org/wiki/File:Gryllus_assimilis_(1).jpg", "artist": "Philipp Weigell", "license": "CC BY 3.0"}, {"src": "img/crickets-1.jpg", "title": "File:Gryllus assimilis male 02.jpg", "page": "https://commons.wikimedia.org/wiki/File:Gryllus_assimilis_male_02.jpg", "artist": "Schönitzer", "license": "CC BY-SA 3.0"}];
/* PHOTOS:END */
const PHOTO_KEYS = [["Leopard","leopard"],["Crested","crested"],["Gargoyle","gargoyle"],["שמנת זנב","fattail"],["Bearded","bearded"],["לשון כחולה","bluetongue"],["Veiled","veiled"],["Ball","ball"],["Corn","corn"],["מלך","king"],["חלב","milk"],["Hognose","hognose"],["Pacman","pacman"],["וייט","whites"],["Brachypelma","tarantula"],["טרריום זכוכית","terrarium"],["כלוב רשת","meshcage"],["UVB","uvb"],["נורת חימום","heatlamp"],["משטח חימום","heatmat"],["תרמוסטט","thermostat"],["צרצרים","crickets"],["זחלי קמח","mealworms"],["דוביה","dubia"],["עכברים","mice"],["מזון אבקתי","cgd"],["סידן","calcium"],["קוקוס","coco"],["חול","sand"],["מחבוא","hide"],["ענף","branch"],["מד לחות","hygro"],["מלקחיים","tongs"],["מרסס","sprayer"]];
const photosFor = title => { const k = PHOTO_KEYS.find(([t]) => title.includes(t)); return k && PHOTOS[k[1]] ? PHOTOS[k[1]] : []; };

/* Morphs (colour/genetic variants) per species, used for seeding and as suggestions */
const MORPHS = {
  "Leopard":["נורמל","טנג׳רין","מק סנואו","אלבינו טרמפר","באנדיט"],
  "Crested":["הארלקין","פינסטרייפ","דלמטיאן","פלאים"],
  "Gargoyle":["אדום מנומר","כתום פסים","רטיקולייטד"],
  "שמנת זנב":["נורמל","אוראו","זברה"],
  "Bearded":["נורמל","היפו","טרנס","ציטרוס"],
  "לשון כחולה":["צפוני","אינדונזי"],
  "Veiled":["נורמל","טרנסלוסנט"],
  "Ball":["נורמל","פאסטל","בננה","ספיידר","קלאון","מוג׳בה"],
  "Corn":["נורמל","אמלנו","סנואו","אנריתרו"],
  "מלך":["פסים","טבעות","בננה"],
  "חלב":["נורמל","טנג׳רין","היפו"],
  "Hognose":["נורמל","אנקונדה","אלבינו","ארקטיק"],
  "Pacman":["ירוק","אלבינו","סטרוברי"],
};
const morphsFor = title => { const k = Object.keys(MORPHS).find(k => title.includes(k)); return k ? MORPHS[k] : []; };
const REGIONS = ["צפון","חיפה והקריות","מרכז","תל אביב והסביבה","ירושלים והסביבה","שפלה","דרום"];
const CITY_REGION = { "רמת הגולן":"צפון", "עפולה":"צפון", "כפר הנגיד":"שפלה", "בארות יצחק":"מרכז", "תל אביב־יפו":"תל אביב והסביבה", "אמינדב":"ירושלים והסביבה" };

/* 20 demo shops. Names are real Israeli reptile/pet businesses used ONLY as templates.
   All descriptions, products and prices are invented for the demo. */
const SHOPS = [
  { slug:"snakeshop",    name:"סנייק שופ",              en:"Snakeshop",              city:"",              icon:"🐍", color:"#2E7D32", focus:["snakes","heat","terrariums","food"] },
  { slug:"herpshop",     name:"הרפ שופ",                en:"HERP Shop",              city:"",              icon:"🦎", color:"#C26A00", focus:["geckos","lizards","decor","care"] },
  { slug:"reptiles-center", name:"המרכז הישראלי לזוחלים", en:"Israeli Center for Reptiles", city:"",        icon:"🐉", color:"#13795B", focus:["lizards","snakes","heat","care"] },
  { slug:"zochalia",     name:"זוחליה נחשייה",          en:"Zochalia",               city:"בארות יצחק",     icon:"🐢", color:"#5B8C1A", focus:["snakes","geckos","food"] },
  { slug:"animal-club",  name:"אנימל קלאב",             en:"Animal Club",            city:"רמת הגולן",      icon:"🌿", color:"#0E7490", focus:["lizards","amphibians","decor"] },
  { slug:"pet-town",     name:"פט טאון",                en:"Pet Town",               city:"",              icon:"🏠", color:"#2F6FB3", focus:["terrariums","heat","decor","amphibians"] },
  { slug:"zoo-afula",    name:"זו עפולה",               en:"Zoo Afula",              city:"עפולה",          icon:"🦎", color:"#D9480F", focus:["terrariums","heat","geckos"] },
  { slug:"chowchow",     name:"צ׳או צ׳או",              en:"Chow Chow",              city:"",              icon:"🪵", color:"#B8325A", focus:["decor","terrariums","care"] },
  { slug:"petbest",      name:"פטבסט",                  en:"PetBest",                city:"",              icon:"💡", color:"#7B4FB0", focus:["terrariums","heat","care"] },
  { slug:"megapet",      name:"מגה פט",                 en:"MegaPet",                city:"",              icon:"🏠", color:"#1C8C8C", focus:["terrariums","food","decor"] },
  { slug:"just4pet",     name:"ג׳אסט פור פט",           en:"Just4Pet",               city:"",              icon:"🦗", color:"#8A6D1D", focus:["food","care","heat"] },
  { slug:"meital-labs",  name:"מיטל מעבדות",            en:"Meital Labs",            city:"",              icon:"🪲", color:"#4E6B3A", focus:["food","inverts"] },
  { slug:"zoo-center",   name:"זו סנטר",                en:"Zoo Center",             city:"תל אביב־יפו",    icon:"🐸", color:"#2E7D32", focus:["amphibians","geckos","decor"] },
  { slug:"petway",       name:"פטוויי",                 en:"Petway",                 city:"",              icon:"🌿", color:"#0E7490", focus:["food","care","decor"] },
  { slug:"animal-house", name:"אנימל האוס",             en:"Animal House",           city:"כפר הנגיד",      icon:"🐉", color:"#C26A00", focus:["lizards","terrariums","heat"] },
  { slug:"safari-house", name:"בית הספארי ירושלים",     en:"Safari House Jerusalem", city:"אמינדב",         icon:"🦂", color:"#8A6D1D", focus:["inverts","snakes","decor"] },
  { slug:"herp-hobby",   name:"הרפ הובי שופ",           en:"Herp Hobby Shop",        city:"",              icon:"🐍", color:"#13795B", focus:["snakes","geckos","food"] },
  { slug:"eranpets",     name:"ערן וחיות אחרות",        en:"Eran & Other Animals",   city:"",              icon:"🦎", color:"#D9480F", focus:["geckos","terrariums","food"] },
  { slug:"cichlidon",    name:"ציקלידון",               en:"Cichlidon",              city:"",              icon:"🐸", color:"#2F6FB3", focus:["geckos","amphibians","decor"] },
  { slug:"pet-point",    name:"פט פוינט",               en:"Pet Point",              city:"תל אביב־יפו",    icon:"💡", color:"#B8325A", focus:["food","heat","care"] },
];

const DESCS = {
  snakes:"נחשים מגידול בשבי לצד כל מה שצריך כדי להחזיק אותם נכון: טרריום, חימום ומזון קפוא.",
  geckos:"שממיות לכל רמה, ממתחילים ועד מגדלים ותיקים, עם מזון חי ומזון אבקתי.",
  lizards:"חרדונים מזוקנים, סקינקים וזיקיות, עם הדרכה ראשונית לכל קונה.",
  amphibians:"צפרדעים ודו־חיים, וכל מה שצריך לטרריום לח ומוצל.",
  inverts:"טרנטולות, חרקים ומזון חי לאוהבי חסרי החוליות.",
  terrariums:"טרריומים בכל הגדלים, עם התאמה לבעל החיים ולמקום בבית.",
  heat:"נורות UVB, חימום ותרמוסטטים, עם עזרה בבחירת הציוד הנכון.",
  food:"מזון חי וקפוא שמתחדש כל שבוע, צרצרים, זחלי קמח וג׳וקים דוביה.",
  decor:"מצעים, ענפים, מחבואים וכל מה שהופך טרריום לבית.",
  care:"אביזרים, תוספי סידן וכלי מדידה לשמירה על בריאות בעלי החיים.",
};
const TAGLINES = {
  snakes:"נחשים מגידול בשבי וכל הציוד שצריך",
  geckos:"שממיות מגידול בשבי ומזון לכל גיל",
  lizards:"חרדונים, סקינקים וזיקיות",
  amphibians:"צפרדעים וטרריומים לחים",
  inverts:"טרנטולות, חרקים ומזון חי",
  terrariums:"טרריומים וסידור מקצועי",
  heat:"חימום, תאורה ו־UVB",
  food:"מזון חי וקפוא בכל שבוע",
  decor:"מצעים, ענפים ומחבואים",
  care:"אביזרים, תוספים ובריאות",
};

/* =========================================================
   Storage (per browser). Falls back to memory if blocked.
   ========================================================= */
const KEY = "scales-demo-v4";
let mem = null;
function load() {
  try { const raw = localStorage.getItem(KEY); if (raw) return JSON.parse(raw); } catch (e) {}
  return mem;
}
function save() {
  mem = db;
  try { localStorage.setItem(KEY, JSON.stringify(db)); }
  catch (e) { toast("הדפדפן לא שומר שינויים (אולי מצב פרטי). השינויים יישמרו רק עד רענון הדף."); }
}
function getPref(k, d) { try { return localStorage.getItem("scales-pref-" + k) || d; } catch (e) { return d; } }
function setPref(k, v) { try { localStorage.setItem("scales-pref-" + k, v); } catch (e) {} }

/* deterministic random for seeding */
function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
const uid = p => p + "_" + Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-3);

function seed() {
  const r = rng(20261113);
  const now = Date.now();
  const DAY = 86400000;
  const users = [], shops = [], products = [];
  SHOPS.forEach((s, i) => {
    const n = String(i + 1).padStart(2, "0");
    const userId = "u_shop" + n, shopId = "s_" + s.slug;
    users.push({ id:userId, email:s.slug + "@scales.demo", password:"scales" + n, name:"מנהל/ת " + s.name, role:"seller", shopId, createdAt: now - (60 + i) * DAY });
    const mainCats = s.focus.map(c => catById(c).name).join(", ");
    shops.push({
      id: shopId, slug: s.slug, ownerId: userId, name: s.name, nameEn: s.en, city: s.city,
      tagline: TAGLINES[s.focus[0]],
      description: DESCS[s.focus[0]] + " בחנות הזו תמצאו: " + mainCats + ". (תוכן לדוגמה)",
      region: CITY_REGION[s.city] || REGIONS[i % REGIONS.length], color: s.color, icon: s.icon, logo: null, banner: null, phone: "", delivery: "איסוף עצמי או משלוח בתיאום",
      shipPrice: [25,30,35,40,45,50][i % 6], freeOver: [0,300,250,400,0][i % 5], pickup: true,
      demo: true, createdAt: now - (60 + i) * DAY,
    });
    // choose 6 products weighted by shop focus
    const pool = TPL.filter(t => s.focus.includes(t.cat));
    const extra = TPL.filter(t => !s.focus.includes(t.cat));
    const picks = new Set();
    while (picks.size < Math.min(5, pool.length)) picks.add(pool[Math.floor(r() * pool.length)]);
    picks.add(extra[Math.floor(r() * extra.length)]);
    [...picks].forEach((t, j) => {
      const factor = 0.85 + r() * 0.35;
      const price = Math.max(10, Math.round(t.p * factor / 5) * 5);
      const isAnimal = catById(t.cat).kind === "animal";
      const ms = morphsFor(t.t); const morph = ms.length ? ms[Math.floor(r() * ms.length)] : "";
      products.push({
        id: "p_" + s.slug + "_" + j, shopId, title: t.t, cat: t.cat, kind: isAnimal ? "animal" : "supply",
        price, stock: isAnimal ? 1 + Math.floor(r() * 4) : 5 + Math.floor(r() * 30),
        emoji: t.e, ...(() => { const ph = photosFor(t.t); if (!ph.length) return { image: null, images: [] }; const o = (i + j) % ph.length; const imgs = ph.slice(o).concat(ph.slice(0, o)); return { image: imgs[0], images: imgs }; })(), desc: t.d,
        sex: t.sex || "", morph, age: t.age || "", level: t.level || "",
        createdAt: now - Math.floor(r() * 40 * DAY) - j * 3600000,
      });
    });
  });
  users.push({ id:"u_buyer", email:"buyer@scales.demo", password:"buyer123", name:"דנה הקונה", role:"buyer", shopId:null, createdAt: now - 10 * DAY });
  return { v:1, users, shops, products, orders:[], session:null, cart:[] };
}

let db = load() || seed();
if (!load()) save();

/* =========================================================
   Helpers
   ========================================================= */
const $ = (s, el = document) => el.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
const money = n => "₪" + Number(n).toLocaleString("he-IL");
const me = () => db.users.find(u => u.id === db.session) || null;
const myShop = () => { const u = me(); return u && u.shopId ? db.shops.find(s => s.id === u.shopId) : null; };
const shopOf = p => db.shops.find(s => s.id === p.shopId);
const productsOf = shopId => db.products.filter(p => p.shopId === shopId);
const isNew = p => Date.now() - p.createdAt < 7 * 86400000;
const shipOf = s => Number(s && s.shipPrice != null ? s.shipPrice : 35);
const shipText = s => shipOf(s) === 0 ? "משלוח חינם" : `משלוח ${money(shipOf(s))}` + (s.freeOver ? ` · חינם מעל ${money(s.freeOver)}` : "");
let pickupChoice = {}; // shopId -> true when buyer chose self-pickup
function cartGroups() {
  const rows = db.cart.map(c => ({ ...c, p: db.products.find(p => p.id === c.productId) })).filter(r => r.p && shopOf(r.p));
  const groups = [];
  rows.forEach(r => { let g = groups.find(x => x.shop.id === r.p.shopId); if (!g) { g = { shop: shopOf(r.p), rows: [] }; groups.push(g); } g.rows.push(r); });
  groups.forEach(g => {
    g.subtotal = g.rows.reduce((a, r) => a + r.p.price * r.qty, 0);
    g.pickup = !!pickupChoice[g.shop.id] && g.shop.pickup !== false;
    g.free = !!g.shop.freeOver && g.subtotal >= g.shop.freeOver;
    g.ship = g.pickup || g.free ? 0 : shipOf(g.shop);
  });
  return groups;
}
const cartCount = () => db.cart.reduce((a, c) => a + c.qty, 0);
const initials = name => name.replace(/[׳"']/g, "").split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join("");
let toastT;
function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 2600); }

const scalesBg = color => `background-color:${color};background-image:radial-gradient(circle at 50% 0, rgba(255,255,255,.22) 0 46%, transparent 47%),radial-gradient(circle at 0 50%, rgba(255,255,255,.12) 0 46%, transparent 47%);background-size:44px 30px;`;

const IC = {
  search:'<path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM21 21l-4.3-4.3"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
  cart:'<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.6 12.4a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.5L22 7H6"/>',
  store:'<path d="M3 9l1.5-5h15L21 9M3 9v11h18V9M3 9h18M9 20v-6h6v6"/>',
  truck:'<path d="M1 6h13v10H1zM14 10h4l3 3v3h-7"/><circle cx="5.5" cy="18" r="1.8"/><circle cx="17.5" cy="18" r="1.8"/>',
  pin:'<path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>',
  scale:'<path d="M12 3v18M5 7h14M5 7l-3 7a4 4 0 0 0 6 0L5 7zM19 7l-3 7a4 4 0 0 0 6 0l-3-7z"/>',
  heart:'<path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z"/>',
  leaf:'<path d="M5 21c0-9 6-15 16-16-1 10-7 16-16 16zM5 21l7-7"/>',
  check:'<path d="M20 6L9 17l-5-5"/>',
  bell:'<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21a2 2 0 0 0 4 0"/>',
  dna:'<path d="M7 3c0 6 10 6 10 12s-10 6-10 6M17 3c0 6-10 6-10 12M8 7h8M8 17h8"/>',
  book:'<path d="M4 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4zM20 4h-6M20 4v14h-6"/>',
  chart:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  quiz:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.7M12 17h.01"/>',
  arrow:'<path d="M19 12H5M11 6l-6 6 6 6"/>',
};
const icon = (n, cls = "") => `<svg class="ico ${cls}" viewBox="0 0 24 24" aria-hidden="true">${IC[n]}</svg>`;
const catPhoto = id => { const k = { geckos:"leopard", lizards:"bearded", snakes:"ball", amphibians:"whites", heat:"heatlamp", food:"crickets" }[id]; return k && PHOTOS[k] ? PHOTOS[k][0] : null; };
function shopDot(s) { return s.logo ? `<span class="dot"><img src="${s.logo}" alt=""></span>` : `<span class="dot" style="background:${esc(s.color)}" aria-hidden="true">${esc(s.icon)}</span>`; }

function logoHTML(s, cls = "") {
  if (s.logo) return `<div class="logo ${cls}" style="background:#fff"><img src="${s.logo}" alt="הלוגו של ${esc(s.name)}"></div>`;
  return `<div class="logo ${cls}" style="background:${esc(s.color)}" aria-hidden="true">${esc(s.icon)}<span class="ini">${esc(initials(s.name))}</span></div>`;
}
function pimgInner(p) {
  return p.image ? `<img src="${p.image}" alt="${esc(p.title)}" loading="lazy">` : `<span aria-hidden="true">${esc(p.emoji || catById(p.cat).ic)}</span>`;
}
function pimgStyle(p) { return p.image ? "background:#fff" : "background:#EEF0F2"; }

function productCard(p) {
  const s = shopOf(p); if (!s) return "";
  const c = catById(p.cat);
  const sex = p.kind === "animal" && p.sex && p.sex !== "לא ידוע" ? (p.sex === "זכר" ? `<span class="sex m" title="זכר">♂</span>` : `<span class="sex f" title="נקבה">♀</span>`) : "";
  const traits = p.kind === "animal" ? `${sex}${p.morph ? `<span class="chip morph">${esc(p.morph)}</span>` : ""}${p.age ? `<span class="chip">${esc(p.age)}</span>` : ""}` : `<span class="chip">${esc(c.name)}</span>`;
  return `<article class="pcard">
    <a class="pimg" href="#product-${p.id}" style="${pimgStyle(p)}" aria-label="${esc(p.title)}">${pimgInner(p)}${isNew(p) ? '<span class="badge new">חדש</span>' : ""}</a>
    <div class="pbody">
      <a class="ptitle" href="#product-${p.id}">${esc(p.title)}</a>
      <div class="ptraits">${traits}</div>
      <div class="price-row"><span class="price">${money(p.price)}</span><span class="pship">${icon("truck")}${shipOf(s) ? money(shipOf(s)) : "חינם"}</span></div>
      <a class="pshop" href="#shop-${s.slug}">${shopDot(s)}<span>${esc(s.name)} · ${esc(s.region || s.city || "ישראל")}</span></a>
    </div>
    <div class="pfoot"><button class="btn btn-ghost btn-sm" data-act="add" data-id="${p.id}" ${p.stock < 1 ? "disabled" : ""}>${p.stock < 1 ? "אזל" : "הוספה לעגלה"}</button></div>
  </article>`;
}
function shopCard(s) {
  const n = productsOf(s.id).length;
  const strip = s.banner ? `background-image:url('${s.banner}')` : scalesBg(s.color);
  return `<a class="scard" href="#shop-${s.slug}">
    <div class="strip" style="${strip}"></div>
    <div class="sbody">
      ${logoHTML(s)}
      <h3>${esc(s.name)}</h3>
      <div class="meta">${icon("pin")} ${esc(s.city || s.region || "ישראל")} · ${n} מוצרים</div>
      <p>${esc(s.description)}</p>
    </div>
    <div class="go"><span>כניסה לחנות</span>${icon("arrow")}</div>
  </a>`;
}

/* =========================================================
   Layout
   ========================================================= */
const EMPTY_SEARCH = { q:"", cat:"", kind:"", sort:"new", shop:"", sex:"", region:"", max:"" };
let searchState = { ...EMPTY_SEARCH };

function header(route) {
  const u = me();
  const catOpts = CATS.map(c => `<option value="${c.id}" ${searchState.cat === c.id ? "selected" : ""}>${esc(c.name)}</option>`).join("");
  const size = document.documentElement.dataset.size || "m";
  return `<header class="topbar"><div class="wrap">
    <a class="brand" href="#home" aria-label="Scales, לעמוד הבית">
      <span class="brand-mark"><svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true"><path d="M6 22c0-7 5-13 12-13 4 0 8 2 8 6 0 3-3 4-5 4-3 0-4 2-4 4 0 3-3 4-6 4-3 0-5-2-5-5z" fill="#fff"/><circle cx="21" cy="13" r="1.6" fill="#13795B"/><path d="M9 21c2 0 3-1 4-2M11 25c2 0 3-1 4-2" stroke="#13795B" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg></span>
      <span class="brand-name">Scales<small>כל מוכרי הזוחלים במקום אחד</small></span>
    </a>
    <form class="search" id="searchForm" role="search">
      <label class="sr" for="sCat" hidden>קטגוריה</label>
      <select id="sCat" aria-label="קטגוריה"><option value="">הכול</option>${catOpts}</select>
      <input id="sQ" type="search" placeholder="מה מחפשים? למשל: שממית, נורת UVB" value="${esc(searchState.q)}" aria-label="חיפוש">
      <button type="submit">${icon("search")}<span class="lbl-hide">חיפוש</span></button>
    </form>
    <div class="head-actions">
      <div class="textsize" role="group" aria-label="גודל טקסט">
        <button data-act="size" data-v="m" aria-pressed="${size === "m"}" title="טקסט רגיל">א</button>
        <button data-act="size" data-v="l" aria-pressed="${size === "l"}" title="טקסט גדול" style="font-size:1.15em">א</button>
        <button data-act="size" data-v="xl" aria-pressed="${size === "xl"}" title="טקסט גדול מאוד" style="font-size:1.35em">א</button>
      </div>
      <a class="hbtn sell" href="#open-shop">${icon("store")}<span class="lbl-hide">מכירה באתר</span></a>
      ${u ? `<a class="hbtn" href="#account">${icon("user")}<span class="lbl-hide">${esc(u.name.split(" ")[0])}</span></a>` : `<a class="hbtn" href="#login">${icon("user")}<span class="lbl-hide">כניסה</span></a>`}
      ${u && u.shopId ? `<a class="hbtn" href="#dashboard">${icon("store")}<span class="lbl-hide">החנות שלי</span></a>` : ""}
      <a class="hbtn" href="#saved" aria-label="התראות, ${alertCount()} חדשות">${icon("bell")}<span class="lbl-hide">התראות</span>${alertCount() ? `<span class="count">${alertCount()}</span>` : ""}</a>
      <a class="hbtn" href="#cart" aria-label="עגלה, ${cartCount()} פריטים">${icon("cart")}<span class="lbl-hide">עגלה</span><span class="count">${cartCount()}</span></a>
    </div>
  </div></header>
  <nav class="catnav" aria-label="קטגוריות"><div class="wrap">
    <a href="#shops" class="${route === "shops" ? "on" : ""}">כל החנויות</a>
    <a href="#new" class="${route === "new" ? "on" : ""}">חדש באתר</a>
    <a href="#genetics" class="tool ${route === "genetics" ? "on" : ""}">${icon("dna")} מחשבון גנטיקה</a>
    <a href="#guides" class="tool ${route === "guides" || route.startsWith("guide-") ? "on" : ""}">${icon("book")} מדריכי גידול</a>
    <a href="#prices" class="tool ${route === "prices" ? "on" : ""}">${icon("chart")} מדד מחירים</a>
    <a href="#quiz" class="tool ${route === "quiz" ? "on" : ""}">${icon("quiz")} איזה זוחל מתאים לי?</a>
    <span class="navsep" aria-hidden="true"></span>
    ${CATS.map(c => `<a href="#cat-${c.id}" class="${route === "cat-" + c.id ? "on" : ""}">${esc(c.name)}</a>`).join("")}
    <a href="#demo-accounts" class="strong">חשבונות לניסיון</a>
  </div></nav>
  <div class="demo-strip"><div class="wrap">
    <span>זו גרסת הדגמה. חשבונות לניסיון: <a href="#demo-accounts">רשימת 20 החנויות והסיסמאות</a>. שינויים נשמרים רק בדפדפן הזה.</span>
  </div></div>`;
}
function footer() {
  return `<footer><div class="wrap">
    <div class="col">
      <h4>Scales · שוק הזוחלים של ישראל</h4>
      <span>כל החנויות והמגדלים הפרטיים במקום אחד. משווים מחירים, מכירים את המוכר וקונים בביטחון.</span>
    </div>
    <div class="col">
      <h4>לקונים</h4>
      <a href="#new">חדש באתר</a><a href="#shops">כל החנויות</a><a href="#cat-geckos">שממיות</a><a href="#cat-snakes">נחשים</a><a href="#cart">העגלה שלי</a><a href="#genetics">מחשבון גנטיקה</a><a href="#guides">מדריכי גידול</a><a href="#prices">מדד מחירים</a><a href="#saved">חיפושים שמורים</a>
    </div>
    <div class="col">
      <h4>למוכרים</h4>
      <a href="#open-shop">פתיחת חנות בחינם</a><a href="#dashboard">לוח ניהול החנות</a><a href="#demo-accounts">חשבונות לניסיון</a><a href="#photo-credits">קרדיט לתמונות</a>
    </div>
    <div class="fine">
      <span>גרסת הדגמה. שמות החנויות משמשים כתבנית בלבד; התיאורים, המוצרים והמחירים הומצאו. מכירת בעלי חיים כפופה לחוק ולהיתרי רשות הטבע והגנים.</span>
      <button class="btn btn-ghost btn-sm" data-act="reset">איפוס נתוני הדמו</button>
    </div>
  </div></footer>`;
}

/* =========================================================
   Views
   ========================================================= */
function viewHome() {
  const newest = [...db.products].sort((a, b) => b.createdAt - a.createdAt).slice(0, 10);
  const animals = db.products.filter(p => p.kind === "animal").sort((a, b) => (b.image ? 1 : 0) - (a.image ? 1 : 0) || b.createdAt - a.createdAt).slice(0, 10);
  const ordered = [...db.shops.filter(s => !s.demo), ...db.shops.filter(s => s.demo)];
  return `
  <section class="intro">
    <div>
      <h1>קונים ומוכרים זוחלים בישראל</h1>
      <p>כל החנויות והמגדלים הפרטיים במקום אחד. מחפשים לפי מין, מורף, מחיר ואזור, ומזמינים ישירות מהמוכר.</p>
      <div class="quick"><span>חיפושים נפוצים:</span>${["שממית נמרית", "פיתון מלכותי", "חרדון מזוקן", "שממית מצויצת", "צפרדע", "מזון חי", "נורת UVB"].map(q => `<a href="#search" data-act="quick" data-q="${q}">${q}</a>`).join("")}</div>
    </div>
    <div class="intro-stats">
      <div>${db.products.filter(p => p.kind === "animal").length}<small>בעלי חיים</small></div>
      <div>${db.products.filter(p => p.kind === "supply").length}<small>מוצרי ציוד</small></div>
      <div>${db.shops.length}<small>מוכרים</small></div>
    </div>
  </section>

  <section class="tools-row" aria-label="כלים למגדלים">
    <a href="#genetics">${icon("dna")}<span><b>מחשבון גנטיקה</b><small>מה ייצא מהזיווג? אחוזים לכל מורף</small></span></a>
    <a href="#guides">${icon("book")}<span><b>מדריכי גידול בעברית</b><small>10 מינים, עם ערכת ציוד בלחיצה</small></span></a>
    <a href="#prices">${icon("chart")}<span><b>מדד מחירים</b><small>כמה עולה כל מין בישראל</small></span></a>
    <a href="#quiz">${icon("quiz")}<span><b>איזה זוחל מתאים לי?</b><small>5 שאלות והמלצה אישית</small></span></a>
  </section>

  <section aria-labelledby="h-cats">
    <div class="section-head"><h2 id="h-cats">קטגוריות</h2></div>
    <div class="cats">${CATS.map(c => { const ph = catPhoto(c.id); return `<a class="cat" href="#cat-${c.id}"><span class="ic" aria-hidden="true">${ph ? `<img src="${ph}" alt="">` : c.ic}</span><span class="cl">${esc(c.name)}<small>${db.products.filter(p => p.cat === c.id).length} מודעות</small></span></a>`; }).join("")}</div>
  </section>

  <section aria-labelledby="h-new">
    <div class="section-head"><div><h2 id="h-new">מודעות חדשות</h2><p>מה שהמוכרים העלו לאחרונה</p></div><a class="link-more" href="#new">לכל המודעות החדשות ${icon("arrow")}</a></div>
    <div class="pgrid">${newest.map(productCard).join("")}</div>
  </section>

  <section aria-labelledby="h-shops">
    <div class="section-head"><div><h2 id="h-shops">חנויות ומגדלים</h2><p>${db.shops.length} מוכרים. לחצו על חנות כדי לראות את כל המודעות שלה.</p></div><a class="link-more" href="#shops">לכל החנויות ${icon("arrow")}</a></div>
    <div class="sgrid">${ordered.slice(0, 9).map(shopCard).join("")}</div>
  </section>

  <section aria-labelledby="h-animals">
    <div class="section-head"><div><h2 id="h-animals">בעלי חיים למכירה</h2><p>מגידול בשבי, עם מין, גיל ומורף</p></div><a class="link-more" href="#cat-geckos">לשממיות ${icon("arrow")}</a></div>
    <div class="pgrid">${animals.map(productCard).join("")}</div>
  </section>

  <section class="sell">
    <div><h2>מגדלים או מוכרים?</h2><p>פותחים חנות בחינם, מעלים לוגו, באנר ומודעות, וקובעים מחיר משלוח.</p></div>
    <div class="btn-row"><a class="btn btn-brand" href="#open-shop">פתיחת חנות</a><a class="btn btn-ghost" href="#demo-accounts">לנסות חנות לדוגמה</a></div>
  </section>`;
}

function viewShops() {
  const userShops = db.shops.filter(s => !s.demo);
  const ordered = [...userShops, ...db.shops.filter(s => s.demo)];
  return `<section>
    <div class="section-head"><div><h1>כל החנויות</h1><p>${db.shops.length} חנויות ומוכרים. בחרו חנות כדי לראות את המוצרים שלה.</p></div>
      <a class="btn btn-cta" href="#open-shop">פתיחת חנות חדשה</a></div>
    <div class="sgrid">${ordered.map(shopCard).join("")}</div>
  </section>`;
}

function viewShop(slug) {
  const s = db.shops.find(x => x.slug === slug);
  if (!s) return notFound();
  const items = productsOf(s.id).sort((a, b) => b.createdAt - a.createdAt);
  const owner = me() && me().shopId === s.id;
  const bannerStyle = s.banner ? `background-image:url('${s.banner}')` : scalesBg(s.color);
  return `<section class="shop-hero">
    <div class="banner" style="${bannerStyle}" role="img" aria-label="הבאנר של ${esc(s.name)}"></div>
    <div class="shop-id">
      ${logoHTML(s, "lg")}
      <div class="txt">
        <h1>${esc(s.name)}</h1>
        <p>${esc(s.tagline)}</p>
      </div>
      ${owner ? `<a class="btn btn-brand" href="#dashboard">עריכת החנות</a>` : ""}
    </div>
    <div class="shop-about">
      <div style="display:grid;gap:12px">
        <h2 style="font-size:1.2rem">על החנות</h2>
        <p>${esc(s.description)}</p>
        ${s.demo ? `<div class="note">חנות לדוגמה. השם ${esc(s.nameEn ? "(" + s.nameEn + ")" : "")} משמש כתבנית בלבד, והתוכן הומצא לצורך הדמו.</div>` : ""}
      </div>
      <div class="infobox">
        <div><span>אזור</span><b>${esc([s.city, s.region].filter(Boolean).join(", ") || "ישראל")}</b></div>
        <div><span>מוצרים</span><b>${items.length}</b></div>
        <div><span>משלוח</span><b>${shipOf(s) ? money(shipOf(s)) : "חינם"}</b></div>
        ${s.freeOver ? `<div><span>משלוח חינם</span><b>מעל ${money(s.freeOver)}</b></div>` : ""}
        <div><span>איסוף עצמי</span><b>${s.pickup !== false ? "כן" : "לא"}</b></div>
        <div><span>טלפון</span><b dir="ltr">${esc(s.phone || "לא צוין")}</b></div>
      </div>
    </div>
  </section>
  <section>
    <div class="section-head"><h2>המוצרים של ${esc(s.name)}</h2></div>
    ${items.length ? `<div class="pgrid">${items.map(productCard).join("")}</div>` : `<div class="empty"><strong>עוד אין מוצרים בחנות הזו.</strong>${owner ? `<a class="btn btn-cta" href="#dashboard-new">הוספת מוצר ראשון</a>` : ""}</div>`}
  </section>`;
}

function viewProduct(id) {
  const p = db.products.find(x => x.id === id);
  if (!p) return notFound();
  const s = shopOf(p), c = catById(p.cat);
  const similar = db.products.filter(x => x.cat === p.cat && x.id !== p.id).sort((a, b) => a.price - b.price).slice(0, 4);
  const qty = pdpQty[p.id] || 1;
  return `<nav class="crumbs" aria-label="מיקום"><a href="#home">ראשי</a><span>›</span><a href="#cat-${c.id}">${esc(c.name)}</a><span>›</span><span>${esc(p.title)}</span></nav>
  <section class="pdp">
    <div class="gallery">
      <div class="pimg" id="mainImg" style="${pimgStyle(p)}">${pimgInner(p)}${isNew(p) ? '<span class="badge new">חדש</span>' : ""}</div>
      ${(p.images || []).length > 1 ? `<div class="thumbs">${p.images.map((src, i) => `<button class="thumb ${i === 0 ? "on" : ""}" data-act="thumb" data-src="${esc(src)}" aria-label="תמונה ${i + 1}"><img src="${esc(src)}" alt=""></button>`).join("")}</div>` : ""}
      ${p.image && !p.image.startsWith("data:") ? `<a class="credit-link" href="#photo-credits">קרדיט לצילום</a>` : ""}
    </div>
    <div class="pdp-info">
      <div class="chips"><span class="chip ${p.kind === "animal" ? "animal" : ""}">${p.kind === "animal" ? "בעל חיים" : "ציוד"}</span><span class="chip">${esc(c.name)}</span></div>
      <h1 style="font-size:1.8rem">${esc(p.title)}</h1>
      <div class="price">${money(p.price)} <small>כולל מע״מ</small></div>
      ${priceVerdict(p)}
      <div class="shipbox"><b>${icon("truck")} ${shipText(s)}</b><span>המשלוח מחושב פעם אחת לכל מוכר: אם מזמינים כמה מוצרים מ־${esc(s.name)}, משלמים משלוח אחד על כולם.${s.pickup !== false ? " אפשר גם איסוף עצמי בחינם." : ""}</span></div>
      <p style="margin:0">${esc(p.desc)}</p>
      <dl class="spec">
        ${p.kind === "animal" ? `<div><dt>מורף</dt><dd>${esc(p.morph || "לא צוין")}</dd></div><div><dt>מין</dt><dd>${esc(p.sex || "לא ידוע")}</dd></div><div><dt>גיל</dt><dd>${esc(p.age || "לא צוין")}</dd></div><div><dt>רמת טיפול</dt><dd>${esc(p.level || "לא צוין")}</dd></div><div><dt>מקור</dt><dd>מגידול בשבי</dd></div>` : ""}
        <div><dt>במלאי</dt><dd>${p.stock > 0 ? p.stock + " יחידות" : "אזל"}</dd></div>
      </dl>
      ${p.kind === "animal" ? `<div class="note warn">בעלי חיים נמסרים באיסוף עצמי או במשלוח מותאם בתיאום עם המוכר. כדאי לוודא שהטרריום מוכן לפני ההגעה.</div>` : ""}
      ${p.stock > 0 ? `<div class="btn-row" style="align-items:center">
        <div class="qty" role="group" aria-label="כמות"><button data-act="pq" data-id="${p.id}" data-d="-1" aria-label="פחות">−</button><span>${qty}</span><button data-act="pq" data-id="${p.id}" data-d="1" aria-label="יותר">+</button></div>
        <button class="btn btn-cta" style="flex:1" data-act="add" data-id="${p.id}" data-qty="${qty}">הוספה לעגלה</button>
      </div>
      <button class="btn btn-brand" data-act="buynow" data-id="${p.id}">קנייה עכשיו</button>` : `<div class="err">המוצר אזל מהמלאי</div>`}
      <a class="seller" href="#shop-${s.slug}">${logoHTML(s)}<div><div style="color:var(--muted);font-size:.9rem">נמכר על ידי</div><strong>${esc(s.name)}</strong><div style="color:var(--muted);font-size:.9rem">${esc(s.city || "ישראל")} · ${productsOf(s.id).length} מוצרים</div></div></a>
    </div>
  </section>
  ${similar.length ? `<section><div class="section-head"><div><h2>להשוואת מחירים: ${esc(c.name)} בחנויות אחרות</h2><p>מסודר מהזול ליקר</p></div></div><div class="pgrid">${similar.map(productCard).join("")}</div></section>` : ""}`;
}
const pdpQty = {};

function runSearch() {
  const q = searchState.q.trim().toLowerCase();
  let list = db.products.filter(p => {
    const s = shopOf(p); if (!s) return false;
    if (searchState.cat && p.cat !== searchState.cat) return false;
    if (searchState.kind && p.kind !== searchState.kind) return false;
    if (searchState.shop && p.shopId !== searchState.shop) return false;
    if (searchState.sex && p.sex !== searchState.sex) return false;
    if (searchState.region && s.region !== searchState.region) return false;
    if (searchState.max && p.price > Number(searchState.max)) return false;
    if (q) {
      const hay = (p.title + " " + (p.morph || "") + " " + p.desc + " " + s.name + " " + (s.nameEn || "") + " " + catById(p.cat).name).toLowerCase();
      return q.split(/\s+/).every(w => hay.includes(w));
    }
    return true;
  });
  const sorters = { new:(a,b)=>b.createdAt-a.createdAt, low:(a,b)=>a.price-b.price, high:(a,b)=>b.price-a.price };
  return list.sort(sorters[searchState.sort] || sorters.new);
}
function viewSearch(title) {
  const list = runSearch();
  const radio = (name, val, label) => `<label><input type="radio" name="${name}" value="${val}" ${searchState[name] === val ? "checked" : ""} data-filter="${name}"> ${label}</label>`;
  const heading = title || (searchState.q ? `תוצאות עבור „${esc(searchState.q)}”` : searchState.cat ? esc(catById(searchState.cat).name) : "כל המוצרים");
  return `<section>
    <div class="results">
      <aside class="filters" aria-label="סינון">
        <fieldset><legend>סוג</legend>${radio("kind", "", "הכול")}${radio("kind", "animal", "בעלי חיים")}${radio("kind", "supply", "ציוד ומזון")}</fieldset>
        <fieldset><legend>מין (לבעלי חיים)</legend>${radio("sex", "", "הכול")}${radio("sex", "זכר", "זכר")}${radio("sex", "נקבה", "נקבה")}</fieldset>
        <div class="field"><label for="fMax">מחיר עד (₪)</label><input id="fMax" type="number" min="0" inputmode="numeric" dir="ltr" value="${esc(searchState.max)}" data-filter="max" placeholder="ללא הגבלה"></div>
        <div class="field"><label for="fRegion">אזור המוכר</label><select id="fRegion" data-filter="region"><option value="">כל הארץ</option>${REGIONS.map(r => `<option ${searchState.region === r ? "selected" : ""}>${r}</option>`).join("")}</select></div>
        <fieldset><legend>קטגוריה</legend>${radio("cat", "", "כל הקטגוריות")}${CATS.map(c => radio("cat", c.id, esc(c.name))).join("")}</fieldset>
        <div class="field"><label for="fShop">חנות</label><select id="fShop" data-filter="shop"><option value="">כל החנויות</option>${db.shops.map(s => `<option value="${s.id}" ${searchState.shop === s.id ? "selected" : ""}>${esc(s.name)}</option>`).join("")}</select></div>
        <button class="btn btn-ghost btn-sm" data-act="clearfilters">ניקוי הסינון</button>
      </aside>
      <div>
        <div class="sortbar"><div><h1 style="font-size:1.25rem">${heading}</h1><span style="color:var(--muted)">${list.length} מודעות</span></div>
          <button class="btn btn-ghost btn-sm" data-act="savesearch">${icon("bell")} שמירת חיפוש והתראה</button>
          <label for="fSort">מיון<select id="fSort" data-filter="sort"><option value="new" ${searchState.sort === "new" ? "selected" : ""}>החדשות ביותר</option><option value="low" ${searchState.sort === "low" ? "selected" : ""}>מחיר: מהזול ליקר</option><option value="high" ${searchState.sort === "high" ? "selected" : ""}>מחיר: מהיקר לזול</option></select></label></div>
        ${list.length ? `<div class="pgrid">${list.map(productCard).join("")}</div>` : `<div class="empty"><strong>לא נמצאו מוצרים.</strong><span>נסו מילה אחרת או נקו את הסינון.</span><button class="btn btn-ghost" data-act="clearfilters">ניקוי הסינון</button></div>`}</div>
    </div>
  </section>`;
}

/* ---------- auth ---------- */
let formError = "";
function viewLogin() {
  return `<section class="panel narrow">
    <form class="form" id="loginForm">
      <h1>כניסה לחשבון</h1>
      ${formError ? `<div class="err" role="alert">${esc(formError)}</div>` : ""}
      <div class="field"><label for="lEmail">אימייל</label><input id="lEmail" type="email" dir="ltr" autocomplete="username" required placeholder="name@example.com"></div>
      <div class="field"><label for="lPass">סיסמה</label><input id="lPass" type="password" dir="ltr" autocomplete="current-password" required></div>
      <button class="btn btn-cta" type="submit">כניסה</button>
      <p style="margin:0">אין לכם חשבון? <a href="#register">הרשמה מהירה</a></p>
      <div class="note">לניסיון: <b dir="ltr">buyer@scales.demo</b> / <b dir="ltr">buyer123</b> (קונה), או אחת מ־<a href="#demo-accounts">20 החנויות לדוגמה</a>.</div>
    </form>
  </section>`;
}
function viewRegister(seller) {
  return `<section class="panel narrow">
    <form class="form" id="registerForm">
      <h1>${seller ? "פתיחת חנות בחינם" : "הרשמה"}</h1>
      <p style="margin:0;color:var(--muted)">${seller ? "שלב 1 מתוך 2: יוצרים חשבון. בשלב הבא בוחרים שם, לוגו ובאנר לחנות." : "חשבון אחד לקנייה ולמכירה."}</p>
      ${formError ? `<div class="err" role="alert">${esc(formError)}</div>` : ""}
      <div class="field"><label for="rName">שם מלא</label><input id="rName" required autocomplete="name"></div>
      <div class="field"><label for="rEmail">אימייל</label><input id="rEmail" type="email" dir="ltr" required autocomplete="email"></div>
      <div class="field"><label for="rPass">סיסמה</label><input id="rPass" type="password" dir="ltr" minlength="4" required autocomplete="new-password"><span class="hint">לפחות 4 תווים</span></div>
      <div class="choice" role="radiogroup" aria-label="סוג חשבון">
        <label><input type="radio" name="rRole" value="buyer" ${seller ? "" : "checked"}><span><b>אני רוצה לקנות</b><br><small>לגלוש, להשוות ולהזמין</small></span></label>
        <label><input type="radio" name="rRole" value="seller" ${seller ? "checked" : ""}><span><b>אני רוצה למכור</b><br><small>חנות או מגדל/ת פרטי/ת</small></span></label>
      </div>
      <button class="btn btn-cta" type="submit">יצירת חשבון</button>
      <p style="margin:0">כבר רשומים? <a href="#login">כניסה</a></p>
    </form>
  </section>`;
}

/* ---------- account ---------- */
function viewAccount() {
  const u = me(); if (!u) { go("login"); return ""; }
  const orders = db.orders.filter(o => o.userId === u.id).sort((a, b) => b.createdAt - a.createdAt);
  return `<section class="panel" style="display:grid;gap:20px">
    <div class="section-head" style="margin:0"><div><h1>שלום, ${esc(u.name)}</h1><p dir="ltr" style="text-align:right">${esc(u.email)}</p></div>
      <div class="btn-row">${u.shopId ? `<a class="btn btn-brand" href="#dashboard">ניהול החנות שלי</a>` : `<a class="btn btn-cta" href="#open-shop">פתיחת חנות</a>`}<button class="btn btn-ghost" data-act="logout">יציאה</button></div></div>
    <h2>ההזמנות שלי</h2>
    ${orders.length ? orders.map(orderBlock).join("") : `<div class="empty"><strong>עוד לא ביצעתם הזמנות.</strong><a class="btn btn-cta" href="#new">למוצרים החדשים</a></div>`}
  </section>`;
}
function orderBlock(o, forShopId) {
  const items = forShopId ? o.items.filter(i => i.shopId === forShopId) : o.items;
  const ships = (o.shipping || []).filter(x => !forShopId || x.shopId === forShopId);
  const shipSum = ships.reduce((a, x) => a + x.price, 0);
  const total = items.reduce((a, i) => a + i.price * i.qty, 0) + shipSum;
  return `<div style="border:1px solid var(--line);border-radius:14px;padding:16px;display:grid;gap:8px">
    <div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap"><b>הזמנה ${esc(o.id.slice(-6).toUpperCase())}</b><span style="color:var(--muted)">${new Date(o.createdAt).toLocaleString("he-IL")}</span></div>
    ${forShopId ? `<div>לקוח/ה: <b>${esc(o.name)}</b> · <span dir="ltr">${esc(o.phone)}</span> · ${esc(o.address)}</div>` : ""}
    <div class="tbl-wrap"><table><tbody>${items.map(i => `<tr><td>${esc(i.title)}</td><td>${forShopId ? "" : esc((db.shops.find(s => s.id === i.shopId) || {}).name || "")}</td><td class="num">×${i.qty}</td><td class="num">${money(i.price * i.qty)}</td></tr>`).join("")}</tbody></table></div>
    ${ships.length ? `<div style="color:var(--muted)">${ships.map(x => (forShopId ? "" : esc((db.shops.find(s => s.id === x.shopId) || {}).name || "") + ": ") + (x.method === "pickup" ? "איסוף עצמי" : x.price ? "משלוח " + money(x.price) : "משלוח חינם")).join(" · ")}</div>` : ""}
    <div style="font-weight:700">סה״כ ${money(total)} · <span style="color:var(--brand-strong)">התקבלה, המוכר ייצור קשר</span></div>
  </div>`;
}

/* ---------- cart ---------- */
function viewCart() {
  const groups = cartGroups();
  if (!groups.length) return `<section class="empty"><h1>העגלה ריקה</h1><span>מוסיפים מוצרים מכל חנות שרוצים, ומזמינים יחד.</span><a class="btn btn-cta" href="#new">למוצרים החדשים</a></section>`;
  const items = groups.reduce((a, g) => a + g.subtotal, 0);
  const ship = groups.reduce((a, g) => a + g.ship, 0);
  const u = me();
  return `<h1>העגלה שלי</h1>
  <section class="cart">
    <div class="panel" style="padding-block:8px">
      ${groups.map(g => { const s = g.shop; return `<div class="cgroup">
        <div class="ghead">${logoHTML(s)}<div><a class="ptitle" href="#shop-${s.slug}">${esc(s.name)}</a><div class="pship">${g.rows.length} מוצרים מהמוכר הזה · משלוח אחד לכולם</div></div></div>
        ${g.rows.map(r => `<div class="citem">
          <a class="mini" href="#product-${r.p.id}" style="${pimgStyle(r.p)}">${pimgInner(r.p)}</a>
          <div style="min-width:0;display:grid;gap:4px"><a class="ptitle" href="#product-${r.p.id}">${esc(r.p.title)}</a><span class="price" style="font-size:1.15rem">${money(r.p.price)}</span></div>
          <div class="cend" style="display:grid;gap:8px;justify-items:end">
            <div class="qty" role="group" aria-label="כמות"><button data-act="cq" data-id="${r.p.id}" data-d="-1" aria-label="פחות">−</button><span>${r.qty}</span><button data-act="cq" data-id="${r.p.id}" data-d="1" aria-label="יותר">+</button></div>
            <button class="btn btn-danger btn-sm" data-act="cdel" data-id="${r.p.id}">הסרה</button>
          </div></div>`).join("")}
        <div class="gfoot">
          <div class="sumline"><span>מוצרים מ${esc(s.name)}</span><span>${money(g.subtotal)}</span></div>
          ${s.pickup !== false ? `<label><input type="radio" name="ship-${s.id}" value="ship" data-ship="${s.id}" ${g.pickup ? "" : "checked"}> משלוח עד הבית: ${g.free ? "חינם" : money(shipOf(s))}</label>
          <label><input type="radio" name="ship-${s.id}" value="pickup" data-ship="${s.id}" ${g.pickup ? "checked" : ""}> איסוף עצמי מ${esc(s.city || s.region || "המוכר")}: חינם</label>` : `<div class="sumline"><span>משלוח</span><span>${g.free ? "חינם" : money(shipOf(s))}</span></div>`}
          ${!g.pickup && !g.free && s.freeOver ? `<span class="freehint">עוד ${money(s.freeOver - g.subtotal)} מהמוכר הזה וקבלו משלוח חינם</span>` : ""}
          ${g.free && !g.pickup ? `<span class="freehint">הגעתם למשלוח חינם מהמוכר הזה</span>` : ""}
          <div class="sumline" style="font-weight:700"><span>סה״כ למוכר</span><span>${money(g.subtotal + g.ship)}</span></div>
        </div>
      </div>`; }).join("")}
    </div>
    <div class="panel summary">
      <h2 style="font-size:1.3rem">סיכום</h2>
      <div class="sumline"><span>${cartCount()} פריטים מ־${groups.length} ${groups.length === 1 ? "מוכר" : "מוכרים"}</span><span>${money(items)}</span></div>
      ${groups.map(g => `<div class="sumline" style="color:var(--muted)"><span>משלוח: ${esc(g.shop.name)}</span><span>${g.pickup ? "איסוף עצמי" : g.ship ? money(g.ship) : "חינם"}</span></div>`).join("")}
      <div class="sumline total"><span>סה״כ לתשלום</span><span>${money(items + ship)}</span></div>
      <form class="form" id="checkoutForm">
        ${formError ? `<div class="err" role="alert">${esc(formError)}</div>` : ""}
        <div class="field"><label for="cName">שם מלא</label><input id="cName" required value="${esc(u ? u.name : "")}"></div>
        <div class="field"><label for="cPhone">טלפון</label><input id="cPhone" type="tel" dir="ltr" required placeholder="050-0000000"></div>
        <div class="field"><label for="cAddr">עיר וכתובת</label><input id="cAddr" required></div>
        <button class="btn btn-cta" type="submit">ביצוע הזמנה</button>
        <span class="hint" style="color:var(--muted);font-size:.9rem">בדמו אין תשלום אמיתי. כל מוכר מקבל את החלק שלו בהזמנה.</span>
      </form>
    </div>
  </section>`;
}
function viewThanks() {
  return `<section class="empty" style="padding:48px"><span style="font-size:3rem" aria-hidden="true">✅</span><h1>ההזמנה התקבלה</h1><span>כל מוכר יראה את ההזמנה בלוח הניהול שלו ויצור איתכם קשר לתיאום.</span><div class="btn-row"><a class="btn btn-brand" href="#account">להזמנות שלי</a><a class="btn btn-ghost" href="#home">חזרה לדף הבית</a></div></section>`;
}

/* ---------- seller dashboard ---------- */
let draft = {};   // uploaded images waiting for save: { logo, banner, pimage }
let editingProduct = null;

function shopForm(s, isNew) {
  s = s || { name:"", tagline:"", description:"", city:"", region:"מרכז", phone:"", delivery:"איסוף עצמי או משלוח בתיאום", shipPrice:35, freeOver:0, pickup:true, color:PALETTE[0], icon:ICONS[0] };
  const logo = draft.logo !== undefined ? draft.logo : s.logo;
  const banner = draft.banner !== undefined ? draft.banner : s.banner;
  return `<form class="form" id="shopForm">
    <h1>${isNew ? "פתיחת חנות" : "פרטי החנות ועיצוב"}</h1>
    ${isNew ? `<p style="margin:0;color:var(--muted)">שלב 2 מתוך 2: איך החנות תיראה ללקוחות. אפשר לשנות הכול גם אחר כך.</p>` : ""}
    ${formError ? `<div class="err" role="alert">${esc(formError)}</div>` : ""}
    <div class="row2">
      <div class="field"><label for="shName">שם החנות</label><input id="shName" required value="${esc(s.name)}" placeholder="למשל: השממיות של יוסי"></div>
      <div class="field"><label for="shCity">עיר</label><input id="shCity" value="${esc(s.city)}" placeholder="למשל: חיפה"></div>
    </div>
    <div class="field"><label for="shRegion">אזור בארץ</label><select id="shRegion">${REGIONS.map(r => `<option ${s.region === r ? "selected" : ""}>${r}</option>`).join("")}</select><span class="hint">קונים יכולים לסנן לפי אזור כדי למצוא מוכר קרוב</span></div>
    <div class="field"><label for="shTag">משפט קצר על החנות</label><input id="shTag" required maxlength="70" value="${esc(s.tagline)}" placeholder="למשל: שממיות מגידול ביתי ומזון חי"><span class="hint">מופיע מתחת לשם החנות, עד 70 תווים</span></div>
    <div class="field"><label for="shDesc">תיאור החנות</label><textarea id="shDesc" required placeholder="מה אתם מוכרים, איך אתם מטפלים בבעלי החיים, איך מתאמים איסוף">${esc(s.description)}</textarea></div>
    <div class="row2">
      <div class="field"><label for="shPhone">טלפון ליצירת קשר</label><input id="shPhone" type="tel" dir="ltr" value="${esc(s.phone)}" placeholder="050-0000000"></div>
      <div class="field"><label for="shDel">הערה על משלוחים</label><input id="shDel" value="${esc(s.delivery)}" placeholder="למשל: שליח תוך 3 ימי עסקים"></div>
    </div>
    <div class="row2">
      <div class="field"><label for="shShip">מחיר משלוח (₪)</label><input id="shShip" type="number" min="0" inputmode="numeric" dir="ltr" value="${esc(s.shipPrice ?? 35)}"><span class="hint">נגבה פעם אחת לכל הזמנה מהחנות, לא לכל מוצר. 0 = משלוח חינם</span></div>
      <div class="field"><label for="shFree">משלוח חינם מעל (₪)</label><input id="shFree" type="number" min="0" inputmode="numeric" dir="ltr" value="${esc(s.freeOver || "")}" placeholder="ריק = בלי"></div>
    </div>
    <label style="display:flex;gap:10px;align-items:center;font-weight:700;cursor:pointer"><input id="shPickup" type="checkbox" style="width:22px;height:22px;accent-color:var(--brand)" ${s.pickup !== false ? "checked" : ""}> אפשר איסוף עצמי בחינם</label>
    <div class="field"><span class="lbl">לוגו</span>
      <div class="upload"><div class="prev">${logo ? `<img src="${logo}" alt="תצוגה מקדימה של הלוגו">` : "אין לוגו"}</div>
        <span class="btn btn-ghost btn-sm filebtn">העלאת תמונה<input type="file" accept="image/*" data-upload="logo" aria-label="העלאת לוגו"></span>
        ${logo ? `<button type="button" class="btn btn-danger btn-sm" data-act="clearimg" data-k="logo">הסרה</button>` : ""}</div>
      <span class="hint">בלי לוגו? נשתמש בסמל ובצבע שתבחרו כאן למטה.</span></div>
    <div class="field"><span class="lbl">באנר עליון</span>
      <div class="upload"><div class="prev wide">${banner ? `<img src="${banner}" alt="תצוגה מקדימה של הבאנר">` : "אין באנר"}</div>
        <span class="btn btn-ghost btn-sm filebtn">העלאת תמונה רחבה<input type="file" accept="image/*" data-upload="banner" aria-label="העלאת באנר"></span>
        ${banner ? `<button type="button" class="btn btn-danger btn-sm" data-act="clearimg" data-k="banner">הסרה</button>` : ""}</div></div>
    <div class="field"><span class="lbl" id="lblColor">צבע החנות</span>
      <div class="swatches" role="radiogroup" aria-labelledby="lblColor">${PALETTE.map((c, i) => `<label style="background:${c}" title="צבע ${i + 1}"><input type="radio" name="shColor" value="${c}" ${s.color === c ? "checked" : ""} aria-label="צבע ${i + 1}"></label>`).join("")}</div></div>
    <div class="field"><span class="lbl" id="lblIcon">סמל</span>
      <div class="icons" role="radiogroup" aria-labelledby="lblIcon">${ICONS.map(ic => `<label><input type="radio" name="shIcon" value="${ic}" ${s.icon === ic ? "checked" : ""}>${ic}</label>`).join("")}</div></div>
    <div class="btn-row"><button class="btn btn-cta" type="submit">${isNew ? "פתיחת החנות" : "שמירת השינויים"}</button>${isNew ? "" : `<a class="btn btn-ghost" href="#shop-${s.slug}">צפייה בחנות</a>`}</div>
  </form>`;
}

function productForm(p) {
  p = p || { title:"", kind:"animal", cat:"geckos", price:"", stock:1, desc:"", sex:"", age:"", level:"", emoji:"" };
  const img = draft.pimage !== undefined ? draft.pimage : p.image;
  const kind = draft.kind || p.kind;
  const catOpts = CATS.filter(c => c.kind === kind).map(c => `<option value="${c.id}" ${p.cat === c.id ? "selected" : ""}>${esc(c.name)}</option>`).join("");
  return `<form class="form" id="productForm">
    <h1>${p.id ? "עריכת מוצר" : "מוצר חדש"}</h1>
    ${formError ? `<div class="err" role="alert">${esc(formError)}</div>` : ""}
    <div class="choice" role="radiogroup" aria-label="סוג המוצר">
      <label><input type="radio" name="pKind" value="animal" ${kind === "animal" ? "checked" : ""} data-act="pkind"><span><b>בעל חיים</b><br><small>שממית, נחש, צפרדע…</small></span></label>
      <label><input type="radio" name="pKind" value="supply" ${kind === "supply" ? "checked" : ""} data-act="pkind"><span><b>ציוד או מזון</b><br><small>טרריום, תאורה, מזון חי…</small></span></label>
    </div>
    <div class="field"><label for="pTitle">שם המוצר</label><input id="pTitle" required value="${esc(p.title)}" placeholder="${kind === "animal" ? "למשל: שממית נמרית צעירה" : "למשל: נורת UVB 10.0"}"></div>
    <div class="row2">
      <div class="field"><label for="pCat">קטגוריה</label><select id="pCat">${catOpts}</select></div>
      <div class="field"><label for="pPrice">מחיר בשקלים</label><input id="pPrice" type="number" inputmode="numeric" min="1" required value="${esc(p.price)}" dir="ltr"></div>
    </div>
    <div class="row2">
      <div class="field"><label for="pStock">כמה יש במלאי</label><input id="pStock" type="number" min="0" required value="${esc(p.stock)}" dir="ltr"></div>
      <div class="field"><label for="pEmoji">סמל (אם אין תמונה)</label><input id="pEmoji" maxlength="4" value="${esc(p.emoji)}" placeholder="🦎"></div>
    </div>
    ${kind === "animal" ? `<div class="row2">
      <div class="field"><label for="pSex">מין</label><select id="pSex">${["לא ידוע","זכר","נקבה"].map(x => `<option ${p.sex === x ? "selected" : ""}>${x}</option>`).join("")}</select></div>
      <div class="field"><label for="pMorph">מורף / צבע</label><input id="pMorph" list="morphList" value="${esc(p.morph || "")}" placeholder="למשל: טנג׳רין, פאסטל"><datalist id="morphList">${[...new Set(Object.values(MORPHS).flat())].map(m => `<option value="${esc(m)}">`).join("")}</datalist></div>
    </div>
    <div class="row2">
      <div class="field"><label for="pAge">גיל</label><input id="pAge" value="${esc(p.age)}" placeholder="למשל: 4 חודשים"></div>
    <div class="field"><label for="pLevel">רמת טיפול</label><select id="pLevel">${["מתאים למתחילים","בינוני","למגדלים מנוסים"].map(x => `<option ${p.level === x ? "selected" : ""}>${x}</option>`).join("")}</select></div>
    </div>` : ""}
    <div class="field"><label for="pDesc">תיאור</label><textarea id="pDesc" required placeholder="מה חשוב לקונה לדעת">${esc(p.desc)}</textarea></div>
    <div class="field"><span class="lbl">תמונה</span>
      <div class="upload"><div class="prev">${img ? `<img src="${img}" alt="תצוגה מקדימה">` : "אין תמונה"}</div>
      <span class="btn btn-ghost btn-sm filebtn">העלאת תמונה<input type="file" accept="image/*" data-upload="pimage" aria-label="העלאת תמונת מוצר"></span>
      ${img ? `<button type="button" class="btn btn-danger btn-sm" data-act="clearimg" data-k="pimage">הסרה</button>` : ""}</div></div>
    <div class="btn-row"><button class="btn btn-cta" type="submit">${p.id ? "שמירה" : "פרסום המוצר"}</button><a class="btn btn-ghost" href="#dashboard-products">ביטול</a></div>
  </form>`;
}

function viewDashboard(tab) {
  const u = me(); if (!u) { go("login"); return ""; }
  const s = myShop();
  if (!s) return `<section class="panel" style="max-width:820px;margin:0 auto;width:100%">${shopForm(null, true)}</section>`;
  const items = productsOf(s.id).sort((a, b) => b.createdAt - a.createdAt);
  const orders = db.orders.filter(o => o.items.some(i => i.shopId === s.id)).sort((a, b) => b.createdAt - a.createdAt);
  const revenue = orders.reduce((a, o) => a + o.items.filter(i => i.shopId === s.id).reduce((x, i) => x + i.price * i.qty, 0), 0);
  let body = "";
  if (tab === "products") {
    body = `<div class="section-head"><h1>המוצרים שלי</h1><a class="btn btn-cta" href="#dashboard-new">הוספת מוצר</a></div>
      ${items.length ? `<div class="tbl-wrap"><table><thead><tr><th></th><th>מוצר</th><th>מחיר</th><th>מלאי</th><th></th></tr></thead><tbody>
      ${items.map(p => `<tr><td><div class="mini" style="${pimgStyle(p)}">${pimgInner(p)}</div></td><td><a class="ptitle" href="#product-${p.id}">${esc(p.title)}</a><div class="chips" style="margin-top:4px"><span class="chip">${esc(catById(p.cat).name)}</span></div></td><td class="num">${money(p.price)}</td><td class="num">${p.stock}</td>
      <td><div class="btn-row" style="gap:6px;flex-wrap:nowrap"><a class="btn btn-ghost btn-sm" href="#edit-${p.id}">עריכה</a><button class="btn btn-danger btn-sm" data-act="pdel" data-id="${p.id}">מחיקה</button></div></td></tr>`).join("")}
      </tbody></table></div>` : `<div class="empty"><strong>עוד אין מוצרים.</strong><a class="btn btn-cta" href="#dashboard-new">הוספת מוצר ראשון</a></div>`}`;
  } else if (tab === "new" || tab === "edit") {
    body = productForm(tab === "edit" ? editingProduct : null);
  } else if (tab === "orders") {
    body = `<h1 style="margin-bottom:16px">הזמנות שקיבלתי</h1>${orders.length ? `<div style="display:grid;gap:12px">${orders.map(o => orderBlock(o, s.id)).join("")}</div>` : `<div class="empty"><strong>עוד אין הזמנות.</strong><span>טיפ: התחברו כקונה (buyer@scales.demo) והזמינו מהחנות שלכם כדי לראות איך זה נראה.</span></div>`}`;
  } else if (tab === "branding") {
    body = shopForm(s, false);
  } else {
    body = `<div class="section-head"><div><h1>${esc(s.name)}</h1><p>לוח הניהול של החנות</p></div><a class="btn btn-ghost" href="#shop-${s.slug}">צפייה בחנות כמו שהלקוחות רואים</a></div>
      <div class="stat-row"><div class="stat"><b>${items.length}</b><span>מוצרים</span></div><div class="stat"><b>${orders.length}</b><span>הזמנות</span></div><div class="stat"><b>${money(revenue)}</b><span>סך המכירות</span></div></div>
      <div class="btn-row" style="margin-top:20px"><a class="btn btn-cta" href="#dashboard-new">הוספת מוצר</a><a class="btn btn-brand" href="#dashboard-branding">שינוי לוגו, באנר ותיאור</a></div>`;
  }
  const t = tab === "edit" ? "products" : tab || "home";
  return `<section class="dash">
    <nav class="side" aria-label="ניהול החנות">
      <a href="#dashboard" class="${t === "home" ? "on" : ""}">סקירה</a>
      <a href="#dashboard-products" class="${t === "products" ? "on" : ""}">המוצרים שלי</a>
      <a href="#dashboard-new" class="${t === "new" ? "on" : ""}">הוספת מוצר</a>
      <a href="#dashboard-branding" class="${t === "branding" ? "on" : ""}">עיצוב החנות</a>
      <a href="#dashboard-orders" class="${t === "orders" ? "on" : ""}">הזמנות</a>
    </nav>
    <div class="panel">${body}</div>
  </section>`;
}

function viewCreds() {
  const sellers = db.users.filter(u => u.role === "seller" && u.id.startsWith("u_shop"));
  const buyer = db.users.find(u => u.id === "u_buyer");
  const card = u => { const s = db.shops.find(x => x.id === u.shopId); return `<div class="cred"><b>${esc(s ? s.name : u.name)}</b><span>אימייל: <code>${esc(u.email)}</code></span><span>סיסמה: <code>${esc(u.password)}</code></span><button class="btn btn-ghost btn-sm" data-act="quicklogin" data-id="${u.id}">כניסה מהירה</button></div>`; };
  return `<section class="panel" style="display:grid;gap:18px">
    <h1>חשבונות לניסיון</h1>
    <p style="margin:0">כל חשבון חנות יכול לערוך את הלוגו, הבאנר והתיאור, להוסיף ולמחוק מוצרים ולראות הזמנות. לחצו „כניסה מהירה” כדי להיכנס בלי להקליד.</p>
    <h2 style="font-size:1.2rem">קונה</h2>
    <div class="creds">${buyer ? `<div class="cred"><b>${esc(buyer.name)}</b><span>אימייל: <code>${esc(buyer.email)}</code></span><span>סיסמה: <code>${esc(buyer.password)}</code></span><button class="btn btn-ghost btn-sm" data-act="quicklogin" data-id="${buyer.id}">כניסה מהירה</button></div>` : ""}</div>
    <h2 style="font-size:1.2rem">20 החנויות</h2>
    <div class="creds">${sellers.map(card).join("")}</div>
  </section>`;
}
function viewCredits() {
  return `<section class="panel" style="display:grid;gap:14px">
    <h1>קרדיט לתמונות</h1>
    <p style="margin:0">התמונות באתר הדמו לקוחות מ־Wikimedia Commons ברישיונות חופשיים. הרקע הוסר והוחלף ברקע לבן. לחצו על שם הקובץ כדי לראות את המקור ואת הרישיון המלא.</p>
    <div class="tbl-wrap"><table><thead><tr><th>תמונה</th><th>קובץ מקור</th><th>צלם/ת</th><th>רישיון</th></tr></thead><tbody>
    ${CREDITS.map(c => `<tr><td><div class="mini" style="background:#fff"><img src="${esc(c.src)}" alt=""></div></td><td><a href="${esc(c.page)}" target="_blank" rel="noopener" dir="ltr">${esc(c.title.replace(/^File:/, ""))}</a></td><td dir="auto">${esc(c.artist || "לא צוין")}</td><td dir="ltr">${esc(c.license)}</td></tr>`).join("")}
    </tbody></table></div>
  </section>`;
}
function notFound() { return `<section class="empty"><h1>הדף לא נמצא</h1><a class="btn btn-brand" href="#home">לדף הבית</a></section>`; }

/* =========================================================
   FEATURES: genetics calculator, care guides + starter kits,
   price guide, beginner quiz, saved searches
   ========================================================= */

/* ---------- species keys shared by guides, prices and photos ---------- */
const SPECIES = {
  leopard:   { he:"שממית נמרית", en:"Leopard Gecko", match:"Leopard" },
  crested:   { he:"שממית מצויצת", en:"Crested Gecko", match:"Crested" },
  gargoyle:  { he:"שממית גרגויל", en:"Gargoyle Gecko", match:"Gargoyle" },
  fattail:   { he:"שממית שמנת זנב", en:"African Fat-tailed Gecko", match:"שמנת זנב" },
  bearded:   { he:"חרדון מזוקן", en:"Bearded Dragon", match:"Bearded" },
  bluetongue:{ he:"סקינק לשון כחולה", en:"Blue-tongued Skink", match:"לשון כחולה" },
  veiled:    { he:"זיקית מצוירת", en:"Veiled Chameleon", match:"Veiled" },
  ball:      { he:"פיתון מלכותי", en:"Ball Python", match:"Ball" },
  corn:      { he:"נחש תירס", en:"Corn Snake", match:"Corn" },
  king:      { he:"נחש מלך", en:"Kingsnake", match:"מלך" },
  milk:      { he:"נחש חלב", en:"Milk Snake", match:"חלב" },
  hognose:   { he:"נחש חרטום", en:"Western Hognose", match:"Hognose" },
  pacman:    { he:"צפרדע פקמן", en:"Pacman Frog", match:"Pacman" },
  whites:    { he:"צפרדע עץ של וייט", en:"White's Tree Frog", match:"וייט" },
  tarantula: { he:"טרנטולה ברכיפלמה", en:"Brachypelma Tarantula", match:"Brachypelma" },
};
const speciesOf = p => Object.keys(SPECIES).find(k => p.title.includes(SPECIES[k].match)) || null;

/* =========================================================
   1. GENETICS
   type: rec = recessive, inc = incomplete dominant (has super form), dom = dominant
   ========================================================= */
const GENES = {
  ball: { name:"פיתון מלכותי", clutch:6, genes:[
    ["pastel","פאסטל","Pastel","inc","סופר פאסטל"],["spider","ספיידר","Spider","dom"],["pinstripe","פינסטרייפ","Pinstripe","dom"],
    ["banana","בננה","Banana","inc","סופר בננה"],["mojave","מוג׳בה","Mojave","inc","סופר מוג׳בה (BEL)"],["enchi","אנצ׳י","Enchi","inc","סופר אנצ׳י"],
    ["yb","ילו בלי","Yellow Belly","inc","אייבורי (Ivory)"],["cinnamon","סינמון","Cinnamon","inc","סופר סינמון"],["fire","פייר","Fire","inc","בלאק אייד לוסי"],
    ["leopard","לאופרד","Leopard","inc","סופר לאופרד"],["clown","קלאון","Clown","rec"],["piebald","פייבלד","Piebald","rec"],
    ["albino","אלבינו","Albino","rec"],["axanthic","אקסנטיק","Axanthic","rec"]],
    combos:[[["pastel:1","spider:1"],"באמבלבי","Bumblebee"],[["pastel:2","spider:1"],"קילר בי","Killer Bee"],[["pastel:1","pinstripe:1"],"פסטרייפ","Pastripe"],[["spider:1","pinstripe:1"],"ספיינר","Spinner"]] },
  leopard: { name:"שממית נמרית", clutch:2, genes:[
    ["mack","מק סנואו","Mack Snow","inc","סופר סנואו"],["enigma","אניגמה","Enigma","dom"],["wy","ווייט אנד ילו","White & Yellow","dom"],
    ["tremper","טרמפר אלבינו","Tremper Albino","rec"],["bell","בל אלבינו","Bell Albino","rec"],["rainwater","ריינווטר אלבינו","Rainwater Albino","rec"],
    ["eclipse","אקליפס","Eclipse","rec"],["blizzard","בליזרד","Blizzard","rec"],["murphy","מרפי פטרנלס","Murphy Patternless","rec"]],
    combos:[[["mack:1","enigma:1"],"מק סנואו אניגמה","Mack Snow Enigma"]] },
  corn: { name:"נחש תירס", clutch:12, genes:[
    ["amel","אמלנו","Amelanistic","rec"],["anery","אנריתרו","Anerythristic","rec"],["hypo","היפו","Hypomelanistic","rec"],
    ["caramel","קרמל","Caramel","rec"],["charcoal","צ׳רקול","Charcoal","rec"],["lavender","לבנדר","Lavender","rec"],
    ["motley","מוטלי","Motley","rec"],["diffused","דיפוזד","Diffused","rec"],["palmetto","פאלמטו","Palmetto","rec"],["tessera","טסרה","Tessera","dom"]],
    combos:[[["amel:2","anery:2"],"סנואו","Snow"],[["amel:2","caramel:2"],"באטר","Butter"],[["anery:2","caramel:2"],"קרמל אנרי (אמבר)","Amber"],[["amel:2","lavender:2"],"אופל","Opal"],[["anery:2","hypo:2"],"גוסט","Ghost"]] },
  bearded: { name:"חרדון מזוקן", clutch:20, genes:[
    ["hypo","היפו","Hypo","rec"],["trans","טרנס","Translucent","rec"],["leather","לת׳רבק","Leatherback","inc","סילקבק (Silkback)"],
    ["witblits","ויטבליץ","Witblits","rec"],["zero","זירו","Zero","rec"],["dunner","דאנר","Dunner","dom"]],
    combos:[[["hypo:2","trans:2"],"היפו טרנס","Hypo Trans"]] },
  crested: { name:"שממית מצויצת", clutch:2, genes:[
    ["lilly","לילי וויט","Lilly White","inc","סופר לילי וויט (לא שורד)"],["cappuccino","קפוצ׳ינו","Cappuccino","inc","פרפוצ׳ינו (Frappuccino)"],["axanthic","אקסנטיק","Axanthic","rec"]],
    combos:[], note:"רוב התכונות בשממית מצויצת (הארלקין, פינסטרייפ, דלמטיאן) הן פוליגניות ואי אפשר לחשב אותן במחשבון. מחושבים כאן רק הגנים הידועים." },
  hognose: { name:"נחש חרטום", clutch:10, genes:[
    ["anaconda","אנקונדה","Anaconda","inc","סופר אנקונדה (Superconda)"],["arctic","ארקטיק","Arctic","inc","סופר ארקטיק"],
    ["albino","אלבינו","Albino","rec"],["axanthic","אקסנטיק","Axanthic","rec"],["lavender","לבנדר","Lavender","rec"],["toffee","טופי","Toffee","rec"]],
    combos:[] },
};
/* parent state per gene: {id, z} where z is: "vis" | "het" | "p66" | "p50" | "single" | "super" */
const ZOPTS = {
  rec: [["vis","ויזואלי (2 עותקים)"],["het","הט (נושא)"],["p66","66% אפשרי הט"],["p50","50% אפשרי הט"]],
  inc: [["single","רגיל (עותק אחד)"],["super","סופר (2 עותקים)"]],
  dom: [["single","עותק אחד"],["super","הומוזיגוטי (2 עותקים)"]],
};
let genState = { sp:"ball", male:[{ id:"pastel", z:"single" }, { id:"clown", z:"het" }], female:[{ id:"clown", z:"het" }], clutch:6 };

function transmitProb(z) { // probability a parent passes the mutant allele
  return { vis:1, super:1, het:.5, single:.5, p66:(2/3)*.5, p50:.25 }[z] ?? 0;
}
function calcGenetics() {
  const sp = GENES[genState.sp];
  const ids = [...new Set([...genState.male, ...genState.female].map(g => g.id))];
  // per gene outcome list: [{p, vis:[{he,en,key}], het:[{he,en}]}]
  const perGene = ids.map(id => {
    const g = sp.genes.find(x => x[0] === id); if (!g) return [{ p:1, vis:[], het:[] }];
    const [, he, en, type, superHe] = g;
    const t1 = transmitProb((genState.male.find(x => x.id === id) || {}).z);
    const t2 = transmitProb((genState.female.find(x => x.id === id) || {}).z);
    const P2 = t1 * t2, P1 = t1 * (1 - t2) + t2 * (1 - t1), P0 = (1 - t1) * (1 - t2);
    const out = [];
    if (type === "rec") {
      if (P2 > 1e-9) out.push({ p:P2, vis:[{ he, en, key:id + ":2" }], het:[] });
      const nv = P0 + P1;
      if (nv > 1e-9) { const h = P1 / nv; out.push({ p:nv, vis:[], het: h > 1e-9 ? [{ he:(h > .999 ? "" : Math.round(h * 100) + "% ") + "הט " + he, en:(h > .999 ? "" : Math.round(h * 100) + "% ") + "het " + en }] : [] }); }
    } else {
      if (P2 > 1e-9) out.push({ p:P2, vis:[ type === "inc" ? { he:superHe, en:"Super " + en, key:id + ":2" } : { he:he + " (הומוזיגוטי)", en:en + " (homozygous)", key:id + ":2" } ], het:[] });
      if (P1 > 1e-9) out.push({ p:P1, vis:[{ he, en, key:id + ":1" }], het:[] });
      if (P0 > 1e-9) out.push({ p:P0, vis:[], het:[] });
    }
    return out;
  });
  let combos = [{ p:1, vis:[], het:[] }];
  perGene.forEach(list => { const next = []; combos.forEach(c => list.forEach(o => next.push({ p:c.p * o.p, vis:[...c.vis, ...o.vis], het:[...c.het, ...o.het] }))); combos = next; });
  // apply known combo names
  combos.forEach(c => {
    const keys = c.vis.map(v => v.key);
    sp.combos.forEach(([need, he, en]) => {
      const ok = need.every(k => keys.includes(k));
      if (ok) { c.vis = c.vis.filter(v => !need.includes(v.key)); c.vis.unshift({ he:he, en:en, key:"combo" }); }
    });
  });
  const merged = {};
  combos.forEach(c => {
    const he = c.vis.length ? c.vis.map(v => v.he).join(" ") : "נורמל";
    const en = c.vis.length ? c.vis.map(v => v.en).join(" ") : "Normal";
    const hetHe = c.het.map(h => h.he).join(", "), hetEn = c.het.map(h => h.en).join(", ");
    const k = he + "|" + hetHe;
    if (!merged[k]) merged[k] = { p:0, he, en, hetHe, hetEn, visCount:c.vis.length };
    merged[k].p += c.p;
  });
  return Object.values(merged).sort((a, b) => b.p - a.p);
}
function parentBox(side) {
  const sp = GENES[genState.sp];
  const list = genState[side];
  const used = new Set(list.map(g => g.id));
  return `<div class="gparent">
    <h3>${side === "male" ? '<span class="sex m">♂</span> אב' : '<span class="sex f">♀</span> אם'}</h3>
    ${list.length ? list.map((g, i) => { const d = sp.genes.find(x => x[0] === g.id); if (!d) return ""; return `<div class="grow">
      <b>${esc(d[1])} <small dir="ltr">${esc(d[2])}</small></b>
      <select aria-label="זיגוטיות ${esc(d[1])}" data-gz="${side}:${i}">${ZOPTS[d[3]].map(([v, l]) => `<option value="${v}" ${g.z === v ? "selected" : ""}>${l}</option>`).join("")}</select>
      <button class="btn btn-ghost btn-sm" data-act="gdel" data-side="${side}" data-i="${i}" aria-label="הסרת ${esc(d[1])}">✕</button></div>`; }).join("") : `<p class="muted">נורמל (בלי גנים). הוסיפו גן מהרשימה.</p>`}
    <select class="gadd" data-gadd="${side}" aria-label="הוספת גן ל${side === "male" ? "אב" : "אם"}"><option value="">+ הוספת גן…</option>
      ${["rec", "inc", "dom"].map(t => `<optgroup label="${{ rec:"רצסיבי", inc:"קו־דומיננטי", dom:"דומיננטי" }[t]}">${sp.genes.filter(x => x[3] === t && !used.has(x[0])).map(x => `<option value="${x[0]}">${esc(x[1])} (${esc(x[2])})</option>`).join("")}</optgroup>`).join("")}
    </select>
  </div>`;
}
function viewGenetics() {
  const sp = GENES[genState.sp];
  const res = calcGenetics();
  const n = Math.max(1, Number(genState.clutch) || sp.clutch);
  const spKey = genState.sp;
  return `<section class="tool">
    <div class="tool-head"><div><h1>מחשבון גנטיקה</h1><p>בוחרים מין, מוסיפים את הגנים של האב והאם, ורואים מה הסיכוי לכל מורף בצאצאים.</p></div>
      <div class="field" style="min-width:220px"><label for="gSp">מין בעל החיים</label><select id="gSp">${Object.entries(GENES).map(([k, v]) => `<option value="${k}" ${k === genState.sp ? "selected" : ""}>${v.name}</option>`).join("")}</select></div></div>
    ${sp.note ? `<div class="note">${sp.note}</div>` : ""}
    <div class="gparents">${parentBox("male")}<div class="gx" aria-hidden="true">×</div>${parentBox("female")}</div>
    <div class="sortbar"><div><h2 style="font-size:1.15rem">תוצאות: ${res.length} אפשרויות</h2><span class="muted">הסיכוי לכל צאצא, לפי חוקי מנדל</span></div>
      <label for="gClutch">גודל תטולה<input id="gClutch" type="number" min="1" max="60" value="${n}" dir="ltr" style="width:80px"></label></div>
    <div class="tbl-wrap panel" style="padding:0"><table class="gtable"><thead><tr><th>סיכוי</th><th>מורף</th><th>נושא גם (הט)</th><th>צפי בתטולה של ${n}</th><th></th></tr></thead><tbody>
      ${res.map(r => `<tr><td class="num"><div class="pbar"><span style="width:${(r.p * 100).toFixed(1)}%"></span></div>${(r.p * 100).toFixed(r.p * 100 % 1 ? 1 : 0)}%</td>
        <td><b>${esc(r.he)}</b><div class="muted" dir="ltr" style="text-align:right;font-size:.85rem">${esc(r.en)}</div></td>
        <td>${r.hetHe ? esc(r.hetHe) : "<span class='muted'>—</span>"}</td>
        <td class="num">${(r.p * n).toFixed(1)}</td>
        <td>${r.visCount ? `<a href="#search" data-act="quick" data-q="${esc(r.he.split(" ")[0])}">למודעות</a>` : ""}</td></tr>`).join("")}
    </tbody></table></div>
    <p class="muted" style="font-size:.88rem">החישוב מניח שהגנים עוברים בנפרד. הוא לא מטפל בגנים אלליים (למשל קבוצת BEL בפיתונים) ולא בתכונות פוליגניות. אחוזי ה"הט" הם הסיכוי שצאצא שלא מראה את התכונה נושא אותה.</p>
    ${GUIDES[spKey] ? `<p><a href="#guide-${spKey}">מדריך הגידול: ${esc(SPECIES[spKey].he)}</a></p>` : ""}
  </section>`;
}

/* =========================================================
   2. CARE GUIDES (written for Scales; facts checked against
   common keeper references such as ReptiFiles and snakes.co.il)
   kit: [search keyword, what it is for, required?]
   ========================================================= */
const GUIDES = {
  leopard: { level:"מתחילים", facts:[["גודל בוגר","20–25 ס״מ"],["תוחלת חיים","15–20 שנה"],["טרריום לבוגר","לפחות 90×45×45 ס״מ, עדיף 120×60"],["חום","נקודה חמה 32–35°, צד קריר 22–26°"],["לילה","לא פחות מ־18°"],["לחות","30–40%, ומחבוא לח להשלת עור"],["תאורה","UVB חלש (5–6%) מומלץ"],["תזונה","חרקים חיים עם אבקת סידן"],["האכלה","צעירים כל יום, בוגרים 2–3 פעמים בשבוע"]],
    intro:"שממית לילית, שקטה ורגועה, שמגיעה מאזורים צחיחים בדרום אסיה. היא לא מטפסת על זכוכית, לא צריכה ריסוס יומי ומתרגלת טוב למגע, ולכן היא הבחירה הנפוצה ביותר למגדלים מתחילים.",
    sections:[["הטרריום","טרריום זכוכית שנפתח מלפנים, עם שלושה מחבואים: אחד בצד החם, אחד בצד הקריר ואחד לח (קופסה עם סיבי קוקוס או טחב) שעוזר בהשלת העור. מצע מתאים הוא תערובת אדמה וחול, אריחי אבן או נייר לצעירים."],["חימום ותאורה","משטח חימום מתחת לצד אחד של הטרריום, מחובר תמיד לתרמוסטט. נורת UVB חלשה עוזרת לספיגת סידן. כבו את כל האורות בלילה."],["האכלה","צרצרים, ג׳וקים דוביה וזחלי קמח בגודל שלא עולה על המרווח בין העיניים. מפזרים אבקת סידן עם D3 על החרקים בכל האכלה לצעירים ובכל האכלה שנייה לבוגרים, ומשאירים צלוחית מים רדודה."],["מגע וטיפול","מחכים שבוע אחרי ההגעה לפני שמרימים. מרימים מלמטה ולא תופסים בזנב, כי הוא יכול להשתחרר."],["בעיות נפוצות","עור שלא ירד מהאצבעות (לחות נמוכה), מחלת עצמות (חוסר סידן), והשמנה מעודף זחלי קמח."]],
    kit:[["שממית נמרית","בעל החיים",0],["טרריום זכוכית 60","טרריום לצעיר, להחליף ל־90 ס״מ כשגדל",1],["משטח חימום","מקור החום העיקרי",1],["תרמוסטט","מונע התחממות יתר",1],["מחבוא","מחבוא חם, קר ולח",1],["מדחום","מדידת חום ולחות",1],["סידן","תוסף לכל האכלה",1],["צרצרים","מזון חי",1]] },
  crested: { level:"מתחילים", facts:[["גודל בוגר","20 ס״מ כולל זנב"],["תוחלת חיים","15–20 שנה"],["טרריום לבוגר","טרריום גבוה, לפחות 45×45×60 ס״מ"],["חום","22–26°, לא יותר מ־28°"],["לילה","18–22°"],["לחות","60–80% אחרי ריסוס, להתייבש בין ריסוסים"],["תאורה","UVB חלש מומלץ"],["תזונה","מזון אבקתי ייעודי וחרקים"],["האכלה","3 פעמים בשבוע"]],
    intro:"שממית עצים מקלדוניה החדשה עם ריסים מעל העיניים. היא לא צריכה חום גבוה ואוכלת מזון אבקתי מוכן, ולכן קל לגדל אותה בבית בישראל, בתנאי שמונעים חום קיצוני בקיץ.",
    sections:[["הטרריום","טרריום גבוה עם הרבה ענפים וצמחים לטיפוס ולהסתתרות. מצע טבעי כמו סיבי קוקוס שומר על לחות."],["חום בקיץ","הסכנה העיקרית בישראל היא חום. מעל 28° השממית נכנסת לעקה, ולכן מומלץ חדר ממוזג בקיץ."],["האכלה","מזון אבקתי (CGD) מעורבב במים, בצלוחית גבוהה, 3 פעמים בשבוע. אפשר להוסיף צרצרים קטנים פעם בשבוע."],["ריסוס","מרססים בערב פעם או פעמיים, כך שהלחות עולה ואז יורדת עד הבוקר."],["בעיות נפוצות","נשירת זנב (לא גדל מחדש), עקת חום, ובעיות השלה בגלל יובש."]],
    kit:[["שממית מצויצת","בעל החיים",0],["כלוב רשת","טרריום גבוה ומאוורר",1],["מזון אבקתי","המזון העיקרי",1],["מרסס","ריסוס ערב",1],["ענף","טיפוס",1],["קוקוס","מצע שומר לחות",1],["מד לחות","מעקב חום ולחות",1]] },
  bearded: { level:"מתחילים", facts:[["גודל בוגר","40–55 ס״מ"],["תוחלת חיים","10–15 שנה"],["טרריום לבוגר","לפחות 120×60×60 ס״מ"],["חום","משטח חמימה 40–45°, צד קריר 24–29°"],["לילה","18–22°, בלי אור"],["לחות","30–40%"],["תאורה","UVB חזק חובה (T5 10–12%), 12–14 שעות ביום"],["תזונה","חרקים וירקות עליים"],["האכלה","צעירים: חרקים כל יום. בוגרים: ירקות כל יום, חרקים 2–3 פעמים בשבוע"]],
    intro:"לטאה אוסטרלית חברותית וסקרנית, שאוהבת להשתזף ולהסתובב מחוץ לטרריום. היא דורשת טרריום גדול ותאורת UVB חזקה, אבל היא סלחנית ומתאימה מאוד למתחילים.",
    sections:[["הטרריום","טרריום רחב עם אבן או ענף להשתזפות קרוב לנורת החימום, ומחבוא בצד הקריר."],["תאורה","נורת UVB לינארית לאורך כשני שלישים מהטרריום, ונורת חימום מעל נקודת ההשתזפות. בלי UVB מתפתחת מחלת עצמות."],["האכלה","צעירים אוכלים בעיקר חרקים. ככל שהם גדלים עוברים לירקות עליים (עלי חרדל, עולש, כרוב עלים) עם מעט חרקים. מוסיפים סידן."],["מגע וטיפול","רוב החרדונים נהנים ממגע יומי. רחיצה פושרת פעם בשבוע עוזרת בהשלה ובשתייה."],["בעיות נפוצות","מחלת עצמות מחוסר UVB, חסימת מעיים מחרקים גדולים מדי, והשמנה."]],
    kit:[["חרדון מזוקן","בעל החיים",0],["טרריום זכוכית 90","טרריום (לבוגר עדיף 120 ס״מ)",1],["UVB","תאורת UVB חובה",1],["נורת חימום","נקודת השתזפות",1],["תרמוסטט","שליטה בחום",1],["דוביה","מזון חי",1],["סידן","תוסף",1],["חול","מצע",0]] },
  ball: { level:"מתחילים", facts:[["גודל בוגר","90–150 ס״מ"],["תוחלת חיים","20–30 שנה"],["טרריום לבוגר","לפחות 120×60×60 ס״מ"],["חום","נקודה חמה 31–33°, צד קריר 24–27°"],["לילה","לא פחות מ־22°"],["לחות","60–80%"],["תאורה","UVB חלש אופציונלי, מחזור יום ולילה"],["תזונה","מכרסמים קפואים מופשרים"],["האכלה","צעירים כל 7–10 ימים, בוגרים כל 2–4 שבועות"]],
    intro:"נחש רגוע ממערב אפריקה שמתכדרר לכדור כשהוא נלחץ. הוא נשאר בגודל נוח ומגיע במאות מורפים, ולכן הוא הנחש הפופולרי ביותר בעולם לגידול ולרבייה.",
    sections:[["הטרריום","שני מחבואים צמודים, אחד בצד החם ואחד בצד הקר, הרבה כיסוי (ענפים, צמחים מלאכותיים) וקערת מים גדולה. הוא מרגיש בטוח במקום צפוף ומוסתר."],["חימום","משטח חימום או נורת חימום, תמיד עם תרמוסטט. בדקו את הטמפרטורה עם מדחום דיגיטלי, לא לפי תחושה."],["האכלה","עכבר או חולדה מופשרים בגודל של החלק העבה בגוף. האכלה עם מלקחיים מונעת נשיכות. צום של כמה שבועות בחורף נפוץ ולרוב לא מסוכן אם המשקל נשמר."],["מגע וטיפול","לא מרימים 48 שעות אחרי האכלה. תומכים בגוף בשתי ידיים."],["בעיות נפוצות","השלה חלקית (לחות נמוכה), דלקת בדרכי הנשימה (קור ולחות), וסירוב לאכול בגלל לחץ."]],
    kit:[["פיתון מלכותי","בעל החיים",0],["טרריום זכוכית 90","טרריום (לבוגר עדיף 120 ס״מ)",1],["משטח חימום","מקור חום",1],["תרמוסטט","שליטה בחום",1],["מחבוא","שני מחבואים",1],["מד לחות","מעקב לחות",1],["עכברים קפואים","מזון",1],["מלקחיים","האכלה בטוחה",1],["קוקוס","מצע שומר לחות",1]] },
  corn: { level:"מתחילים", facts:[["גודל בוגר","120–150 ס״מ"],["תוחלת חיים","15–20 שנה"],["טרריום לבוגר","לפחות 120×60×60 ס״מ"],["חום","נקודה חמה 29–32°, צד קריר 22–26°"],["לילה","20–22°"],["לחות","40–60%"],["תאורה","UVB חלש מומלץ"],["תזונה","עכברים קפואים מופשרים"],["האכלה","צעירים כל 5–7 ימים, בוגרים כל 10–14 ימים"]],
    intro:"נחש אמריקאי פעיל, צבעוני וקל לטיפול, שכמעט לא נושך. הוא מגיע במגוון ענק של צבעים ותבניות, ולכן הוא אחד הנחשים הכי מומלצים למתחילים.",
    sections:[["הטרריום","טרריום סגור היטב, כי נחשי תירס הם אמני בריחה. מחבואים בשני הצדדים, ענפים לטיפוס וקערת מים."],["חימום","משטח חימום עם תרמוסטט בצד אחד. אין צורך בחום גבוה."],["האכלה","עכבר מופשר בגודל החלק העבה בגוף. נחשי תירס כמעט אף פעם לא מסרבים לאכול."],["מגע וטיפול","סקרנים ונוחים להחזקה. נותנים להם לזחול בין הידיים במקום לאחוז חזק."],["בעיות נפוצות","בריחה מהטרריום, השלה חלקית, והשמנה מהאכלה תכופה מדי."]],
    kit:[["נחש תירס","בעל החיים",0],["טרריום זכוכית 90","טרריום",1],["משטח חימום","מקור חום",1],["תרמוסטט","שליטה בחום",1],["מחבוא","מחבואים",1],["ענף","טיפוס",0],["עכברים קפואים","מזון",1],["מלקחיים","האכלה",0]] },
  bluetongue: { level:"בינוני", facts:[["גודל בוגר","45–60 ס״מ"],["תוחלת חיים","15–20 שנה ויותר"],["טרריום לבוגר","לפחות 120×60×60 ס״מ"],["חום","השתזפות 38–43°, צד קריר 24–27°"],["לילה","20–24°"],["לחות","40–60% (אינדונזי: 60–80%)"],["תאורה","UVB מומלץ"],["תזונה","אוכל־כל: ירקות, חלבון ומעט פירות"],["האכלה","צעירים כמעט כל יום, בוגרים 2–3 פעמים בשבוע"]],
    intro:"סקינק גדול ורגוע עם לשון כחולה בולטת. הוא אוכל מגוון רחב של מזונות, אוהב לחפור ומתרגל למגע, אבל צריך מקום ותזונה מגוונת.",
    sections:[["הטרריום","מצע עמוק לחפירה (אדמה וקוקוס), מחבואים רחבים ומשטח השתזפות שטוח."],["תזונה","כחצי ירקות, כ־40% חלבון (חרקים, ביצה מבושלת, מזון ייעודי) ומעט פירות. מוסיפים סידן."],["מגע וטיפול","מרימים בשתי ידיים ותומכים בכל הגוף. הוא כבד ולא אוהב ליפול."],["בעיות נפוצות","השמנה, השלה חלקית באצבעות, ותזונה חד־גונית."]],
    kit:[["לשון כחולה","בעל החיים",0],["טרריום זכוכית 90","טרריום",1],["UVB","תאורת UVB",1],["נורת חימום","נקודת השתזפות",1],["תרמוסטט","שליטה בחום",1],["קוקוס","מצע לחפירה",1],["דוביה","חלבון",1],["סידן","תוסף",1]] },
  pacman: { level:"מתחילים", facts:[["גודל בוגר","10–15 ס״מ"],["תוחלת חיים","10–15 שנה"],["טרריום לבוגר","45×45×30 ס״מ מספיק"],["חום","24–28°"],["לילה","21–24°"],["לחות","60–80%, מצע לח תמיד"],["תאורה","לא חובה, מחזור יום ולילה"],["תזונה","חרקים, לפעמים תולעים"],["האכלה","צעירים כל 2–3 ימים, בוגרים פעם בשבוע"]],
    intro:"צפרדע עגולה מדרום אמריקה שיושבת חצי קבורה ומחכה לטרף. היא כמעט לא זזה ולא צריכה טרריום גדול, ולכן היא דו־חי נוח במיוחד לדירה.",
    sections:[["הטרריום","מצע לח ועמוק (קוקוס או טחב) שהצפרדע יכולה להיקבר בו, וקערת מים רדודה."],["מים","דו־חיים סופגים מים דרך העור. משתמשים במים בלי כלור (מים שעמדו 24 שעות או מים מטופלים)."],["האכלה","צרצרים, דוביה ותולעים עם מלקחיים. היא תבלע כל מה שזז, אז לא מכניסים חפצים קטנים."],["מגע וטיפול","לא מרימים בלי צורך. העור רגיש לשמנים וסבון על הידיים."],["בעיות נפוצות","בליעת מצע, התייבשות, וזיהומי עור ממים מלוכלכים."]],
    kit:[["פקמן","בעל החיים",0],["טרריום זכוכית 60","טרריום",1],["קוקוס","מצע לח",1],["משטח חימום","חום עדין",0],["מרסס","שמירה על לחות",1],["צרצרים","מזון חי",1],["מלקחיים","האכלה",1]] },
  whites: { level:"מתחילים", facts:[["גודל בוגר","10–12 ס״מ"],["תוחלת חיים","15–20 שנה"],["טרריום לבוגר","טרריום גבוה, 45×45×60 ס״מ"],["חום","24–28° ביום"],["לילה","20–24°"],["לחות","50–70%"],["תאורה","UVB חלש מומלץ"],["תזונה","חרקים"],["האכלה","כל 2–3 ימים"]],
    intro:"צפרדע עצים אוסטרלית שמנמנה וירוקה, עם הבעה שנראית כמו חיוך. היא רגועה, חיה הרבה שנים ופעילה בערב.",
    sections:[["הטרריום","טרריום גבוה עם ענפים עבים וצמחים, וקערת מים גדולה מספיק לטבילה."],["מים ולחות","מרססים פעם ביום במים בלי כלור. לא צריך לחות גבוהה מאוד, ואוורור טוב חשוב."],["האכלה","צרצרים ודוביה עם סידן, כל יומיים־שלושה. נוטות להשמנה, אז לא מגזימים."],["בעיות נפוצות","השמנה, זיהומי עור, והתייבשות."]],
    kit:[["וייט","בעל החיים",0],["כלוב רשת","טרריום גבוה",1],["ענף","טיפוס",1],["מרסס","לחות",1],["צרצרים","מזון חי",1],["סידן","תוסף",1],["מד לחות","מעקב",1]] },
  veiled: { level:"למגדלים מנוסים", facts:[["גודל בוגר","זכר 45–60 ס״מ, נקבה 25–35 ס״מ"],["תוחלת חיים","5–8 שנים"],["כלוב לבוגר","כלוב רשת, לפחות 60×60×120 ס״מ"],["חום","השתזפות 32–35°, כללי 24–29°"],["לילה","18–22°"],["לחות","40–60%, עם ריסוס או טפטוף"],["תאורה","UVB חובה (T5 6%)"],["תזונה","חרקים בלבד"],["האכלה","צעירים כל יום, בוגרים כל יומיים"]],
    intro:"זיקית מתימן ומדרום ערב שמשנה צבעים, עם קסדה גבוהה על הראש. היא מרהיבה אבל רגישה ללחץ ודורשת כלוב רשת מאוורר ומערכת מים, ולכן היא מתאימה למי שכבר גידל זוחלים.",
    sections:[["הכלוב","כלוב רשת גבוה ולא טרריום זכוכית סגור, עם הרבה ענפים וצמחים חיים."],["מים","זיקיות לא שותות מקערה. הן מלקקות טיפות מהעלים, אז מרססים כמה פעמים ביום או מתקינים טפטפת."],["תאורה","UVB לינארי על גג הכלוב ונורת חימום להשתזפות בחלק העליון."],["מגע וטיפול","זיקיות לא אוהבות מגע. רוב הזמן מסתכלים, לא מחזיקים."],["בעיות נפוצות","התייבשות, מחלת עצמות, ובנקבות: ביצים תקועות. נקבות צריכות כלי הטלה גם בלי זכר."]],
    kit:[["זיקית מצוירת","בעל החיים",0],["כלוב רשת","כלוב רשת גבוה",1],["UVB","תאורת UVB",1],["נורת חימום","השתזפות",1],["מרסס","ריסוס כמה פעמים ביום",1],["ענף","טיפוס",1],["צרצרים","מזון חי",1],["סידן","תוסף",1]] },
  tarantula: { level:"מתחילים", facts:[["גודל בוגר","12–15 ס״מ מוטת רגליים"],["תוחלת חיים","נקבות 20–30 שנה, זכרים 5–10"],["כלי מגורים","רוחב פי 3 ממוטת הרגליים, גובה נמוך"],["חום","22–27°, טמפרטורת חדר"],["לחות","50–65% וקערת מים קטנה"],["תאורה","לא צריך"],["תזונה","חרקים"],["האכלה","פעם בשבוע, פחות לפני השלה"]],
    intro:"טרנטולה מקסיקנית רגועה בצבעי שחור וכתום, שגדלה לאט וחיה עשרות שנים. היא לא דורשת חום או תאורה מיוחדים ומתאימה למי שמתחיל עם חסרי חוליות.",
    sections:[["כלי המגורים","כלי רחב ונמוך, כי נפילה מגובה יכולה לקרוע לה את הבטן. מצע יבש ברובו, מחבוא וקערת מים קטנה."],["האכלה","צרצר או ג׳וק בגודל הגוף שלה, פעם בשבוע. מוציאים טרף שלא נאכל אחרי יום."],["השלה","לפני השלה היא מפסיקה לאכול, ואחריה נשכבת על הגב. לא נוגעים בה ולא מאכילים עד שבוע אחרי."],["מגע","לא מומלץ להחזיק. היא יכולה לזרוק שערות מגרות מהבטן ולהיפגע מנפילה."]],
    kit:[["Brachypelma","בעל החיים",0],["מחבוא","מחבוא",1],["קוקוס","מצע",1],["צרצרים","מזון חי",1],["מלקחיים","האכלה",1]] },
};

function cheapest(keyword) {
  const list = db.products.filter(p => p.stock > 0 && (p.title.includes(keyword)));
  return list.sort((a, b) => a.price - b.price)[0] || null;
}
function kitRows(key) {
  return GUIDES[key].kit.map(([kw, why, req]) => ({ kw, why, req, p: cheapest(kw) }));
}
function viewGuides() {
  return `<section>
    <div class="section-head"><div><h1>מדריכי גידול</h1><p>מדריכים בעברית לכל מין נפוץ, עם רשימת ציוד שאפשר לקנות מהמוכרים באתר</p></div><a class="link-more" href="#quiz">איזה זוחל מתאים לי? ←</a></div>
    <div class="ggrid">${Object.keys(GUIDES).map(k => { const ph = (PHOTOS[k] || [])[0]; const g = GUIDES[k]; return `<a class="gcard" href="#guide-${k}">
      <span class="gimg">${ph ? `<img src="${ph}" alt="">` : `<span aria-hidden="true">🕷️</span>`}</span>
      <span class="gtxt"><b>${esc(SPECIES[k].he)}</b><small dir="ltr">${esc(SPECIES[k].en)}</small><span class="chip ${g.level === "מתחילים" ? "animal" : "morph"}">${g.level}</span></span></a>`; }).join("")}</div>
  </section>`;
}
function viewGuide(key) {
  const g = GUIDES[key]; if (!g) return notFound();
  const sp = SPECIES[key]; const ph = (PHOTOS[key] || [])[0];
  const rows = kitRows(key);
  const total = rows.filter(r => r.p && r.req).reduce((a, r) => a + r.p.price, 0);
  const listings = db.products.filter(p => speciesOf(p) === key).sort((a, b) => a.price - b.price);
  const st = priceStats(key);
  return `<nav class="crumbs"><a href="#guides">מדריכי גידול</a><span>›</span><span>${esc(sp.he)}</span></nav>
  <article class="guide">
    <div class="guide-main">
      <h1>איך מגדלים ${esc(sp.he)} <small dir="ltr">${esc(sp.en)}</small></h1>
      <p class="lead">${esc(g.intro)}</p>
      ${g.sections.map(([h, t]) => `<h2>${esc(h)}</h2><p>${esc(t)}</p>`).join("")}
      <div class="note">המדריך כתוב בשביל Scales ומסכם הנחיות מקובלות בקהילת המגדלים. לקריאה נוספת: <a href="https://www.snakes.co.il/" target="_blank" rel="noopener">snakes.co.il</a>, <a href="https://reptifiles.com/" target="_blank" rel="noopener">ReptiFiles</a> (באנגלית). בכל בעיה בריאותית פנו לווטרינר של זוחלים.</div>
    </div>
    <aside class="guide-side">
      ${ph ? `<img class="guide-photo" src="${ph}" alt="${esc(sp.he)}">` : ""}
      <dl class="facts"><div><dt>רמת קושי</dt><dd>${g.level}</dd></div>${g.facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
      ${GENES[key] ? `<a class="btn btn-ghost" href="#genetics" data-act="gsp" data-sp="${key}">מחשבון גנטיקה ל${esc(sp.he)}</a>` : ""}
    </aside>
  </article>
  <section class="panel kit">
    <div class="section-head"><div><h2>ערכת התחלה: ${esc(sp.he)}</h2><p>הציוד שצריך, במחיר הזול ביותר שיש כרגע באתר</p></div></div>
    <div class="tbl-wrap"><table><thead><tr><th>פריט</th><th>למה צריך</th><th>ההצעה הזולה באתר</th><th>מחיר</th></tr></thead><tbody>
      ${rows.map(r => `<tr><td><b>${esc(r.kw)}</b>${r.req ? "" : r.why === "בעל החיים" ? ' <span class="chip animal">החיה עצמה</span>' : ' <span class="chip">לא חובה</span>'}</td><td>${esc(r.why)}</td>
        <td>${r.p ? `<a href="#product-${r.p.id}">${esc(r.p.title)}</a><div class="muted" style="font-size:.85rem">${esc(shopOf(r.p).name)}</div>` : '<span class="muted">אין כרגע באתר</span>'}</td>
        <td class="num">${r.p ? money(r.p.price) : "—"}</td></tr>`).join("")}
    </tbody></table></div>
    <div class="sortbar" style="margin:12px 0 0"><div><b>סה״כ לפריטי החובה: ${money(total)}</b> <span class="muted">(לפני משלוח)</span></div>
      <button class="btn btn-cta" data-act="kit" data-key="${key}">הוספת ערכת החובה לעגלה</button></div>
  </section>
  ${listings.length ? `<section><div class="section-head"><div><h2>${esc(sp.he)} למכירה עכשיו</h2><p>${st ? `${st.n} מודעות · מחיר חציוני ${money(st.median)}` : ""}</p></div><a class="link-more" href="#prices">מדד המחירים ←</a></div><div class="pgrid">${listings.slice(0, 5).map(productCard).join("")}</div></section>` : ""}`;
}

/* =========================================================
   3. PRICE GUIDE
   ========================================================= */
function median(a) { const s = [...a].sort((x, y) => x - y); const m = Math.floor(s.length / 2); return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2); }
function priceStats(key, morph) {
  const ps = db.products.filter(p => p.kind === "animal" && speciesOf(p) === key && (!morph || p.morph === morph));
  if (!ps.length) return null;
  const prices = ps.map(p => p.price);
  return { n: ps.length, min: Math.min(...prices), max: Math.max(...prices), median: median(prices), cheapest: ps.sort((a, b) => a.price - b.price)[0] };
}
function priceVerdict(p) {
  const key = speciesOf(p); if (!key || p.kind !== "animal") return "";
  const st = priceStats(key); if (!st || st.n < 2) return "";
  const diff = Math.round((p.price - st.median) / st.median * 100);
  const cls = diff <= -10 ? "good" : diff >= 15 ? "high" : "fair";
  const txt = diff <= -10 ? `${Math.abs(diff)}% מתחת למחיר החציוני` : diff >= 15 ? `${diff}% מעל המחיר החציוני` : "מחיר מקובל בשוק";
  return `<div class="verdict ${cls}"><b>${txt}</b><span>${st.n} מודעות של ${esc(SPECIES[key].he)} באתר: ${money(st.min)}–${money(st.max)}, חציון ${money(st.median)}. <a href="#prices">למדד המחירים</a></span></div>`;
}
function viewPrices() {
  const keys = Object.keys(SPECIES).filter(k => priceStats(k));
  return `<section>
    <div class="section-head"><div><h1>מדד מחירים</h1><p>כמה עולה כל מין בישראל, לפי כל המודעות הפעילות באתר. מתעדכן אוטומטית עם כל מודעה חדשה.</p></div></div>
    <div class="panel" style="padding:0"><div class="tbl-wrap"><table class="ptable"><thead><tr><th>מין</th><th>מודעות</th><th>הכי זול</th><th>חציון</th><th>הכי יקר</th><th>טווח</th><th>ההצעה הזולה</th></tr></thead><tbody>
    ${keys.map(k => { const st = priceStats(k); const morphs = [...new Set(db.products.filter(p => speciesOf(p) === k && p.morph).map(p => p.morph))];
      const lo = st.min, hi = st.max; const span = Math.max(1, hi - lo);
      return `<tr><td><b>${esc(SPECIES[k].he)}</b><div class="muted" style="font-size:.82rem">${morphs.map(esc).join(" · ")}</div></td><td class="num">${st.n}</td><td class="num">${money(st.min)}</td><td class="num">${money(st.median)}</td><td class="num">${money(st.max)}</td>
        <td style="min-width:140px"><div class="range"><span style="inset-inline-start:${((st.median - lo) / span * 100).toFixed(0)}%"></span></div></td>
        <td><a href="#product-${st.cheapest.id}">${money(st.cheapest.price)} · ${esc(shopOf(st.cheapest).name)}</a></td></tr>`; }).join("")}
    </tbody></table></div></div>
    <p class="muted" style="font-size:.88rem">החציון הוא המחיר האמצעי: חצי מהמודעות זולות ממנו וחצי יקרות ממנו. בכל עמוד מודעה מופיעה השוואה למחיר החציוני של אותו מין.</p>
  </section>`;
}

/* =========================================================
   4. BEGINNER QUIZ
   ========================================================= */
const QUIZ = [
  ["exp","יש לכם ניסיון עם זוחלים?",[["0","זה יהיה הראשון שלי"],["1","היה לי אחד או שניים"],["2","יש לי ניסיון רב"]]],
  ["touch","כמה חשוב לכם להחזיק אותו ביד?",[["2","מאוד, אני רוצה חיה חברותית"],["1","מדי פעם"],["0","מספיק לי להסתכל"]]],
  ["space","כמה מקום יש לטרריום?",[["1","מעט, עד 60 ס״מ"],["2","בינוני, עד 90 ס״מ"],["3","הרבה, 120 ס״מ ויותר"]]],
  ["food","מה אתם מוכנים להאכיל?",[["insects","חרקים חיים"],["rodents","מכרסמים קפואים"],["powder","רק מזון מוכן"],["any","כל דבר"]]],
  ["budget","תקציב לציוד ההתחלתי",[["1","עד ₪500"],["2","₪500–1,000"],["3","יותר מ־₪1,000"]]],
];
const QPROFILE = { // level, touch, space, food[], cost
  leopard:[0,2,1,["insects"],1], crested:[0,1,1,["powder","insects"],1], bearded:[0,2,3,["insects"],3], ball:[0,2,3,["rodents"],2],
  corn:[0,2,2,["rodents"],2], bluetongue:[1,2,3,["insects","powder"],3], pacman:[0,0,1,["insects"],1], whites:[0,1,2,["insects"],2],
  veiled:[2,0,3,["insects"],3], tarantula:[0,0,1,["insects"],1],
};
let quizAns = {};
function quizResults() {
  const exp = +quizAns.exp, touch = +quizAns.touch, space = +quizAns.space, budget = +quizAns.budget, food = quizAns.food;
  return Object.entries(QPROFILE).map(([k, [lvl, t, sp, f, cost]]) => {
    let s = 0; const why = [];
    if (lvl > exp) s -= 6 * (lvl - exp); else { s += 2; if (lvl === 0) why.push("מתאים למתחילים"); }
    s -= Math.abs(t - touch) * 2; if (t === touch && touch === 2) why.push("חברותי ונוח להחזקה"); if (touch === 0 && t === 0) why.push("נהנים ממנו בעיקר בצפייה");
    if (sp > space) s -= 4 * (sp - space); else why.push("נכנס במקום שיש לכם");
    if (food !== "any" && !f.includes(food)) s -= 6; else if (food !== "any") why.push(food === "insects" ? "אוכל חרקים" : food === "rodents" ? "אוכל מכרסמים קפואים" : "אוכל מזון מוכן");
    if (cost > budget) s -= 3 * (cost - budget); else why.push("בתוך התקציב");
    return { k, s, why };
  }).sort((a, b) => b.s - a.s).slice(0, 3);
}
function viewQuiz() {
  const done = QUIZ.every(([id]) => quizAns[id] !== undefined);
  return `<section class="tool">
    <div class="tool-head"><div><h1>איזה זוחל מתאים לי?</h1><p>חמש שאלות קצרות, ואנחנו ממליצים על המינים שהכי מתאימים לכם, עם מדריך ומודעות.</p></div></div>
    <form id="quizForm" class="quiz">${QUIZ.map(([id, q, opts], i) => `<fieldset class="panel"><legend><span class="qn">${i + 1}</span> ${q}</legend><div class="qopts">${opts.map(([v, l]) => `<label><input type="radio" name="q-${id}" value="${v}" data-quiz="${id}" ${quizAns[id] === v ? "checked" : ""}> ${l}</label>`).join("")}</div></fieldset>`).join("")}</form>
    ${done ? `<div class="section-head" style="margin-top:8px"><h2>ההמלצות שלנו</h2><button class="btn btn-ghost btn-sm" data-act="quizreset">להתחיל מחדש</button></div>
      <div class="qres">${quizResults().map((r, i) => { const ph = (PHOTOS[r.k] || [])[0]; const st = priceStats(r.k); return `<div class="qcard">
        ${ph ? `<img src="${ph}" alt="">` : `<div class="qph">🕷️</div>`}
        <div class="qbody"><span class="chip ${i === 0 ? "morph" : ""}">${i === 0 ? "ההתאמה הכי טובה" : "מתאים גם"}</span><h3>${esc(SPECIES[r.k].he)}</h3>
        <ul>${r.why.slice(0, 4).map(w => `<li>${w}</li>`).join("")}</ul>
        ${st ? `<div class="muted">${st.n} מודעות באתר, מ־${money(st.min)}</div>` : ""}
        <div class="btn-row"><a class="btn btn-brand btn-sm" href="#guide-${r.k}">למדריך ולערכת ההתחלה</a></div></div></div>`; }).join("")}</div>` : `<p class="muted">ענו על כל השאלות כדי לראות המלצות.</p>`}
  </section>`;
}

/* =========================================================
   5. SAVED SEARCHES / ALERTS
   ========================================================= */
function savedList() { db.saved = db.saved || []; return db.saved; }
const searchLabel = st => [st.q && `„${st.q}”`, st.cat && catById(st.cat).name, st.kind && (st.kind === "animal" ? "בעלי חיים" : "ציוד"), st.sex, st.region, st.max && `עד ${money(st.max)}`, st.shop && (db.shops.find(s => s.id === st.shop) || {}).name].filter(Boolean).join(" · ") || "כל המודעות";
function matchesSaved(st) { const keep = searchState; searchState = { ...EMPTY_SEARCH, ...st }; const r = runSearch(); searchState = keep; return r; }
function newForSaved(s) { return matchesSaved(s.st).filter(p => p.createdAt > s.seenAt); }
function alertCount() { return savedList().reduce((a, s) => a + newForSaved(s).length, 0); }
function viewSaved() {
  const list = savedList();
  return `<section>
    <div class="section-head"><div><h1>חיפושים שמורים והתראות</h1><p>שומרים חיפוש, ובכל פעם שמוכר מעלה מודעה שמתאימה לו, היא מופיעה כאן ובפעמון שבראש האתר.</p></div></div>
    ${list.length ? `<div class="panel" style="padding:0"><div class="tbl-wrap"><table><thead><tr><th>חיפוש</th><th>מודעות מתאימות</th><th>חדשות</th><th></th></tr></thead><tbody>
      ${list.map((s, i) => { const all = matchesSaved(s.st), nw = newForSaved(s); return `<tr><td><b>${esc(searchLabel(s.st))}</b></td><td class="num">${all.length}</td><td>${nw.length ? `<span class="badge-inline">${nw.length} חדשות</span>` : '<span class="muted">אין חדשות</span>'}</td>
        <td><div class="btn-row" style="gap:6px"><button class="btn btn-brand btn-sm" data-act="runsaved" data-i="${i}">הצגה</button><button class="btn btn-danger btn-sm" data-act="delsaved" data-i="${i}">מחיקה</button></div></td></tr>`; }).join("")}
    </tbody></table></div></div>` : `<div class="empty"><strong>עוד אין חיפושים שמורים.</strong><span>מחפשים משהו (למשל פיתון מלכותי נקבה עד ₪600) ולוחצים „שמירת חיפוש והתראה”.</span><a class="btn btn-brand" href="#cat-snakes">לחיפוש</a></div>`}
  </section>`;
}

/* =========================================================
   Router
   ========================================================= */
function go(h) { if (location.hash !== "#" + h) location.hash = h; else render(); }
function render() {
  const h = (location.hash || "#home").slice(1) || "home";
  let html = "", route = h;
  if (h === "home") html = viewHome();
  else if (h === "shops") html = viewShops();
  else if (h.startsWith("shop-")) html = viewShop(h.slice(5));
  else if (h.startsWith("product-")) html = viewProduct(h.slice(8));
  else if (h.startsWith("cat-")) { searchState = { ...searchState, cat: h.slice(4), q: "", shop: "" }; html = viewSearch(); }
  else if (h === "new") { searchState = { ...EMPTY_SEARCH }; html = viewSearch("חדש באתר"); }
  else if (h === "search") html = viewSearch();
  else if (h === "login") html = viewLogin();
  else if (h === "register") html = viewRegister(false);
  else if (h === "open-shop") { if (me()) { go(myShop() ? "dashboard-branding" : "dashboard"); return; } html = viewRegister(true); }
  else if (h === "account") html = viewAccount();
  else if (h === "cart") html = viewCart();
  else if (h === "thanks") html = viewThanks();
  else if (h === "demo-accounts") html = viewCreds();
  else if (h === "photo-credits") html = viewCredits();
  else if (h === "genetics") html = viewGenetics();
  else if (h === "guides") html = viewGuides();
  else if (h.startsWith("guide-")) html = viewGuide(h.slice(6));
  else if (h === "prices") html = viewPrices();
  else if (h === "quiz") html = viewQuiz();
  else if (h === "saved") html = viewSaved();
  else if (h === "dashboard") html = viewDashboard("");
  else if (h.startsWith("dashboard-")) html = viewDashboard(h.slice(10));
  else if (h.startsWith("edit-")) {
    const p = db.products.find(x => x.id === h.slice(5));
    const s = myShop();
    if (!p || !s || p.shopId !== s.id) html = notFound();
    else { if (!editingProduct || editingProduct.id !== p.id) { editingProduct = p; draft = {}; } html = viewDashboard("edit"); }
  }
  else html = notFound();
  if (html === "") return;
  $("#app").innerHTML = header(route) + `<main class="wrap">${html}</main>` + footer();
}
let lastHash = location.hash;
window.addEventListener("hashchange", () => {
  formError = "";
  const h = location.hash;
  if (!h.startsWith("#dashboard") && !h.startsWith("#edit-")) { draft = {}; editingProduct = null; }
  if (h === "#dashboard-new") { draft = {}; editingProduct = null; }
  lastHash = h;
  render();
  window.scrollTo(0, 0);
});

/* =========================================================
   Actions
   ========================================================= */
function addToCart(id, qty = 1) {
  const p = db.products.find(x => x.id === id); if (!p) return;
  const line = db.cart.find(c => c.productId === id);
  const cur = line ? line.qty : 0;
  const next = Math.min(p.stock, cur + qty);
  if (next === cur) { toast("אין יותר במלאי"); return; }
  if (line) line.qty = next; else db.cart.push({ productId: id, qty: next });
  save(); render(); toast("נוסף לעגלה: " + p.title);
}

const armed = new Set();
document.addEventListener("click", e => {
  const b = e.target.closest("[data-act]"); if (!b) return;
  const act = b.dataset.act, id = b.dataset.id;
  if (act === "pkind") return; // handled on change
  if (act === "add") { addToCart(id, Number(b.dataset.qty || 1)); }
  else if (act === "buynow") { addToCart(id, pdpQty[id] || 1); go("cart"); }
  else if (act === "quick") { e.preventDefault(); searchState = { ...EMPTY_SEARCH, q: b.dataset.q }; if (location.hash === "#search") render(); else location.hash = "search"; }
  else if (act === "gdel") { genState[b.dataset.side].splice(+b.dataset.i, 1); render(); }
  else if (act === "gsp") { genState = { sp: b.dataset.sp, male: [], female: [], clutch: GENES[b.dataset.sp].clutch }; }
  else if (act === "quizreset") { quizAns = {}; render(); window.scrollTo(0, 0); }
  else if (act === "kit") { const rows = kitRows(b.dataset.key).filter(r => r.req && r.p); let n = 0; rows.forEach(r => { const l = db.cart.find(c => c.productId === r.p.id); if (!l) { db.cart.push({ productId: r.p.id, qty: 1 }); n++; } }); save(); render(); toast(n ? `${n} פריטים נוספו לעגלה` : "הפריטים כבר בעגלה"); }
  else if (act === "savesearch") { savedList().push({ st: { ...searchState }, savedAt: Date.now(), seenAt: Date.now() }); save(); render(); toast("החיפוש נשמר. מודעות חדשות שיתאימו יופיעו בפעמון."); }
  else if (act === "runsaved") { const sv = savedList()[+b.dataset.i]; sv.seenAt = Date.now(); save(); searchState = { ...EMPTY_SEARCH, ...sv.st }; location.hash = "search"; }
  else if (act === "delsaved") { savedList().splice(+b.dataset.i, 1); save(); render(); toast("החיפוש נמחק"); }
  else if (act === "thumb") { const m = document.querySelector("#mainImg img"); if (m) m.src = b.dataset.src; document.querySelectorAll(".thumb").forEach(t => t.classList.toggle("on", t === b)); }
  else if (act === "pq") { const p = db.products.find(x => x.id === id); pdpQty[id] = Math.max(1, Math.min(p.stock, (pdpQty[id] || 1) + Number(b.dataset.d))); render(); }
  else if (act === "cq") { const l = db.cart.find(c => c.productId === id); const p = db.products.find(x => x.id === id); if (l && p) { l.qty = Math.max(1, Math.min(p.stock, l.qty + Number(b.dataset.d))); save(); render(); } }
  else if (act === "cdel") { db.cart = db.cart.filter(c => c.productId !== id); save(); render(); toast("הוסר מהעגלה"); }
  else if (act === "size") { document.documentElement.dataset.size = b.dataset.v; setPref("size", b.dataset.v); render(); }
  else if (act === "logout") { db.session = null; save(); go("home"); toast("יצאתם מהחשבון"); }
  else if (act === "quicklogin") { db.session = id; save(); const u = me(); toast("נכנסתם בתור " + u.name); go(u.shopId ? "dashboard" : "home"); }
  else if (act === "clearfilters") { searchState = { ...EMPTY_SEARCH }; go("search"); }
  else if (act === "clearimg") { draft[b.dataset.k] = null; keepFormAndRender(); }
  else if (act === "pdel" || act === "reset") {
    if (!armed.has(act + id)) { armed.add(act + id); b.classList.add("armed"); const old = b.textContent; b.textContent = act === "reset" ? "בטוח? לחצו שוב לאיפוס" : "בטוח? לחצו שוב"; setTimeout(() => { armed.delete(act + id); if (b.isConnected) { b.classList.remove("armed"); b.textContent = old; } }, 4000); return; }
    armed.delete(act + id);
    if (act === "pdel") { db.products = db.products.filter(p => p.id !== id); db.cart = db.cart.filter(c => c.productId !== id); save(); render(); toast("המוצר נמחק"); }
    else { db = seed(); save(); searchState = { ...EMPTY_SEARCH }; go("home"); toast("נתוני הדמו אופסו"); }
  }
});

document.addEventListener("change", e => {
  const t = e.target;
  if (t.dataset.filter) { searchState[t.dataset.filter] = t.value; if (location.hash !== "#search") { location.hash = "search"; } else render(); return; }
  if (t.name === "pKind") { snapshotForm(); draft.kind = t.value; keepFormAndRender(); return; }
  if (t.dataset.upload) { handleUpload(t); }
  if (t.dataset.ship) { pickupChoice[t.dataset.ship] = t.value === "pickup"; render(); }
  if (t.id === "gSp") { genState = { sp: t.value, male: [], female: [], clutch: GENES[t.value].clutch }; render(); }
  if (t.id === "gClutch") { genState.clutch = Math.max(1, Math.min(60, Number(t.value) || 1)); render(); }
  if (t.dataset.gz) { const [side, i] = t.dataset.gz.split(":"); genState[side][+i].z = t.value; render(); }
  if (t.dataset.gadd && t.value) { const d = GENES[genState.sp].genes.find(x => x[0] === t.value); genState[t.dataset.gadd].push({ id: t.value, z: d[3] === "rec" ? "het" : "single" }); render(); }
  if (t.dataset.quiz) { quizAns[t.dataset.quiz] = t.value; const y = window.scrollY; render(); window.scrollTo(0, y); }
});

/* keep typed values when we re-render a form (e.g. after an image upload) */
let formSnap = null;
function snapshotForm() {
  const f = document.querySelector("#shopForm, #productForm"); if (!f) return;
  formSnap = {}; f.querySelectorAll("input[id], select[id], textarea[id]").forEach(el => { formSnap[el.id] = el.value; });
  f.querySelectorAll("input[type=radio]:checked").forEach(el => { formSnap["radio:" + el.name] = el.value; });
}
function keepFormAndRender() {
  if (!formSnap) snapshotForm();
  const snap = formSnap; formSnap = null;
  render();
  if (!snap) return;
  Object.entries(snap).forEach(([k, v]) => {
    if (k.startsWith("radio:")) { const el = document.querySelector(`input[name="${k.slice(6)}"][value="${CSS.escape(v)}"]`); if (el) el.checked = true; }
    else { const el = document.getElementById(k); if (el && el.type !== "file") { try { el.value = v; } catch (e) {} } }
  });
  if (draft.kind) { const c = document.getElementById("pCat"); if (c && !CATS.find(x => x.id === c.value && x.kind === draft.kind)) c.selectedIndex = 0; }
}

function handleUpload(input) {
  const file = input.files && input.files[0]; if (!file) return;
  if (!file.type.startsWith("image/")) { toast("אפשר להעלות רק קובץ תמונה"); return; }
  const k = input.dataset.upload;
  const max = k === "banner" ? 1400 : k === "logo" ? 400 : 800;
  snapshotForm();
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * scale); c.height = Math.round(img.height * scale);
      const ctx = c.getContext("2d"); ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height);
      ctx.drawImage(img, 0, 0, c.width, c.height);
      draft[k] = c.toDataURL("image/jpeg", 0.82);
      keepFormAndRender(); toast("התמונה הועלתה. לחצו שמירה כדי לעדכן.");
    };
    img.onerror = () => toast("לא הצלחנו לקרוא את התמונה. נסו קובץ JPG או PNG.");
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
}

const val = id => (document.getElementById(id) || {}).value?.trim() ?? "";
const radioVal = name => (document.querySelector(`input[name="${name}"]:checked`) || {}).value || "";
function slugify(name) {
  let base = (name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")) || "shop";
  let s = base, i = 2; while (db.shops.some(x => x.slug === s)) s = base + "-" + i++;
  if (s === "shop" || s.startsWith("shop-")) s = "shop-" + Math.random().toString(36).slice(2, 7);
  return s;
}

document.addEventListener("submit", e => {
  e.preventDefault();
  const f = e.target;
  if (f.id === "heroSearch") {
    searchState = { ...EMPTY_SEARCH, q: val("hQ") };
    location.hash = "search"; return;
  }
  if (f.id === "searchForm") {
    searchState = { ...searchState, q: val("sQ"), cat: val("sCat"), shop: "" };
    if (location.hash === "#search") render(); else location.hash = "search";
    return;
  }
  if (f.id === "loginForm") {
    const u = db.users.find(x => x.email.toLowerCase() === val("lEmail").toLowerCase() && x.password === val("lPass"));
    if (!u) { formError = "האימייל או הסיסמה לא נכונים. בדקו שוב או היכנסו עם חשבון לדוגמה."; render(); return; }
    db.session = u.id; save(); toast("שלום " + u.name); go(u.shopId ? "dashboard" : "home"); return;
  }
  if (f.id === "registerForm") {
    const email = val("rEmail").toLowerCase();
    if (db.users.some(x => x.email.toLowerCase() === email)) { formError = "כבר יש חשבון עם האימייל הזה. אפשר להיכנס במקום להירשם."; render(); return; }
    const role = radioVal("rRole") || "buyer";
    const u = { id: uid("u"), email, password: val("rPass"), name: val("rName"), role, shopId: null, createdAt: Date.now() };
    db.users.push(u); db.session = u.id; save();
    toast("החשבון נוצר");
    go(role === "seller" ? "dashboard" : "home"); return;
  }
  if (f.id === "shopForm") {
    const u = me(); if (!u) return;
    let s = myShop();
    const data = { name: val("shName"), city: val("shCity"), region: val("shRegion"), tagline: val("shTag"), description: val("shDesc"), phone: val("shPhone"), delivery: val("shDel"), shipPrice: Math.max(0, Number(val("shShip")) || 0), freeOver: Math.max(0, Number(val("shFree")) || 0), pickup: document.getElementById("shPickup").checked, color: radioVal("shColor") || PALETTE[0], icon: radioVal("shIcon") || ICONS[0] };
    if (!data.name) { formError = "צריך לתת שם לחנות."; render(); return; }
    if (draft.logo !== undefined) data.logo = draft.logo;
    if (draft.banner !== undefined) data.banner = draft.banner;
    if (!s) {
      s = { id: uid("s"), slug: slugify(data.name), ownerId: u.id, logo: null, banner: null, demo: false, nameEn: "", createdAt: Date.now(), ...data };
      db.shops.unshift(s); u.shopId = s.id; u.role = "seller";
      draft = {}; save(); toast("החנות נפתחה! עכשיו מוסיפים מוצרים."); go("dashboard-new"); return;
    }
    Object.assign(s, data); draft = {}; save(); toast("השינויים נשמרו"); go("shop-" + s.slug); return;
  }
  if (f.id === "productForm") {
    const s = myShop(); if (!s) return;
    const kind = radioVal("pKind") || "animal";
    const data = { title: val("pTitle"), kind, cat: val("pCat"), price: Number(val("pPrice")), stock: Math.max(0, Math.floor(Number(val("pStock")))), desc: val("pDesc"), emoji: val("pEmoji") || catById(val("pCat")).ic, sex: kind === "animal" ? val("pSex") : "", morph: kind === "animal" ? val("pMorph") : "", age: kind === "animal" ? val("pAge") : "", level: kind === "animal" ? val("pLevel") : "" };
    if (!(data.price > 0)) { snapshotForm(); formError = "המחיר צריך להיות מספר גדול מאפס."; keepFormAndRender(); return; }
    if (draft.pimage !== undefined) { data.image = draft.pimage; data.images = draft.pimage ? [draft.pimage] : []; }
    if (editingProduct) { Object.assign(editingProduct, data); const id = editingProduct.id; editingProduct = null; draft = {}; save(); toast("המוצר עודכן"); go("product-" + id); }
    else { const p = { id: uid("p"), shopId: s.id, image: null, createdAt: Date.now(), ...data }; db.products.push(p); draft = {}; save(); toast("המוצר פורסם ומופיע ב„מוצרים חדשים”"); go("product-" + p.id); }
    return;
  }
  if (f.id === "checkoutForm") {
    const rows = db.cart.map(c => ({ ...c, p: db.products.find(p => p.id === c.productId) })).filter(r => r.p);
    if (!rows.length) return;
    let u = me();
    const order = { id: uid("o"), userId: u ? u.id : null, name: val("cName"), phone: val("cPhone"), address: val("cAddr"), createdAt: Date.now(),
      items: rows.map(r => ({ productId: r.p.id, shopId: r.p.shopId, title: r.p.title, price: r.p.price, qty: r.qty })) };
    order.shipping = cartGroups().map(g => ({ shopId: g.shop.id, method: g.pickup ? "pickup" : "ship", price: g.ship }));
    order.total = order.items.reduce((a, i) => a + i.price * i.qty, 0) + order.shipping.reduce((a, x) => a + x.price, 0);
    rows.forEach(r => { r.p.stock = Math.max(0, r.p.stock - r.qty); });
    db.orders.push(order); db.cart = []; pickupChoice = {}; save(); go("thanks"); return;
  }
});

/* boot */
document.documentElement.lang = "he";
document.documentElement.dir = "rtl";
document.documentElement.dataset.size = getPref("size", "m");
render();
})();
