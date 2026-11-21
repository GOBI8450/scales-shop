(() => {
"use strict";

/* =========================================================
   Reference data
   ========================================================= */
const CATS = [
  { id: "geckos",     name: "שממיות",            ic: "🦎", kind: "animal" },
  { id: "lizards",    name: "חרדונים ולטאות",     ic: "🐉", kind: "animal" },
  { id: "snakes",     name: "נחשים",              ic: "🐍", kind: "animal" },
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
const TINTS = { geckos:"#FFF1D6", lizards:"#FFE6DA", snakes:"#E3F4E8", inverts:"#EFE8F7", terrariums:"#E6F0FA", heat:"#FFF6CC", food:"#F1F6DC", decor:"#F3EBDD", care:"#E8EEF7" };

/* Product templates used to seed the demo catalogue.
   k = photo pool key (see PHOTOS), pop = how well it sells (drives the sample sales numbers). */
const TPL = [
  // geckos
  { t:"שממית נמרית (Leopard Gecko) צעירה", k:"leopard", cat:"geckos", e:"🦎", p:250, sex:"נקבה", age:"4 חודשים", level:"מתאים למתחילים", pop:9, d:"שממית נמרית מגידול בשבי, אוכלת חרקים חיים היטב. רגועה ונוחה להחזקה. מומלץ טרריום של 60 ס״מ לפחות עם מקור חום." },
  { t:"שממית נמרית (Leopard Gecko) בוגרת", k:"leopard", cat:"geckos", e:"🦎", p:380, sex:"זכר", age:"שנה וחצי", level:"מתאים למתחילים", pop:6, d:"שממית נמרית בוגרת ומורגלת לידיים. אוכלת צרצרים וג׳וקים דוביה, מגיעה עם היסטוריית האכלה." },
  { t:"שממית מצויצת (Crested Gecko)", k:"crested", cat:"geckos", e:"🦎", p:320, sex:"לא ידוע", age:"3 חודשים", level:"מתאים למתחילים", pop:8, d:"שממית מצויצת מגידול בשבי, ניזונה ממזון אבקתי ייעודי וחרקים. אוהבת טרריום גבוה עם צמחייה." },
  { t:"שממית מצויצת (Crested Gecko) בוגרת", k:"crested", cat:"geckos", e:"🦎", p:550, sex:"נקבה", age:"שנתיים", level:"מתאים למתחילים", pop:4, d:"נקבה בוגרת עם צבעוניות חזקה. אוכלת מזון אבקתי בלי בעיה. מתאימה גם להרבייה." },
  { t:"שממית גרגויל (Gargoyle Gecko)", k:"gargoyle", cat:"geckos", e:"🦎", p:450, sex:"זכר", age:"6 חודשים", level:"בינוני", pop:4, d:"שממית גרגויל בצבעי כתום־אפור. פעילה בלילה, מתאימה לטרריום אנכי." },
  { t:"שממית שמנת זנב אפריקאית", k:"fattail", cat:"geckos", e:"🦎", p:380, sex:"נקבה", age:"5 חודשים", level:"מתאים למתחילים", pop:4, d:"שממית שקטה ורגועה, צריכה לחות מעט גבוהה יותר משממית נמרית." },
  { t:"שממית טוקאי (Tokay Gecko)", k:"tokay", cat:"geckos", e:"🦎", p:290, sex:"זכר", age:"8 חודשים", level:"למגדלים מנוסים", pop:2, d:"שממית גדולה ורעשנית בצבע כחול עם נקודות כתומות. נושכת כשמפחדים אותה, מתאימה לצפייה יותר ממגע." },
  { t:"שממית יום ענקית (Phelsuma grandis)", k:"daygecko", cat:"geckos", e:"🦎", p:520, sex:"נקבה", age:"7 חודשים", level:"בינוני", pop:3, d:"שממית יום ירוקה וזוהרת, פעילה ביום. צריכה תאורת UVB, צמחייה ולחות בינונית." },
  // lizards
  { t:"חרדון מזוקן (Bearded Dragon) צעיר", k:"bearded", cat:"lizards", e:"🐉", p:450, sex:"לא ידוע", age:"3 חודשים", level:"מתאים למתחילים", pop:9, d:"חרדון מזוקן מגידול בשבי. חברותי וסקרן. דורש תאורת UVB ומקום חם של 38–40 מעלות." },
  { t:"חרדון מזוקן (Bearded Dragon) בוגר", k:"bearded", cat:"lizards", e:"🐉", p:750, sex:"זכר", age:"שנתיים", level:"מתאים למתחילים", pop:5, d:"חרדון בוגר ורגוע במיוחד, רגיל למגע. אוכל ירקות וחרקים. צריך טרריום של 120 ס״מ." },
  { t:"סקינק לשון כחולה", k:"bluetongue", cat:"lizards", e:"🦎", p:1200, sex:"זכר", age:"8 חודשים", level:"בינוני", pop:4, d:"סקינק לשון כחולה רגוע, אוכל מגוון ירקות, חלבונים ופירות. מגיע עם הדרכה ראשונית." },
  { t:"זיקית מצוירת (Veiled Chameleon)", k:"veiled", cat:"lizards", e:"🦎", p:600, sex:"זכר", age:"4 חודשים", level:"למגדלים מנוסים", pop:4, d:"זיקית מגידול בשבי. דורשת כלוב רשת, טפטוף מים ותאורת UVB. לא מתאימה למגע תכוף." },
  { t:"חרדון זנב קוצני (Uromastyx)", k:"uromastyx", cat:"lizards", e:"🦎", p:900, sex:"נקבה", age:"שנה", level:"בינוני", pop:3, d:"לטאה מדברית צמחונית שאוהבת חום גבוה מאוד. צריכה מצע יבש, UVB חזק ומקום חם של 45 מעלות." },
  { t:"דרקון מים סיני (Water Dragon)", k:"waterdragon", cat:"lizards", e:"🐉", p:650, sex:"זכר", age:"6 חודשים", level:"בינוני", pop:2, d:"לטאה ירוקה וגדולה שאוהבת לחות וטבילה. צריכה טרריום גבוה עם בריכת מים." },
  // snakes
  { t:"פיתון מלכותי (Ball Python)", k:"ball", cat:"snakes", e:"🐍", p:550, sex:"נקבה", age:"5 חודשים", level:"מתאים למתחילים", pop:9, d:"פיתון מלכותי מגידול בשבי, אוכל עכברים קפואים. רגוע, גדל לאורך של כמטר וחצי." },
  { t:"פיתון מלכותי (Ball Python) בוגר", k:"ball", cat:"snakes", e:"🐍", p:900, sex:"זכר", age:"שלוש שנים", level:"מתאים למתחילים", pop:4, d:"זכר בוגר ושקט, אוכל עכבר בוגר פעם בשבועיים. מגיע עם תיעוד החלפות עור." },
  { t:"נחש תירס (Corn Snake)", k:"corn", cat:"snakes", e:"🐍", p:300, sex:"זכר", age:"4 חודשים", level:"מתאים למתחילים", pop:8, d:"נחש תירס בצבע כתום־אדום קלאסי. קל לטיפול, אוכל טוב." },
  { t:"נחש מלך קליפורני", k:"king", cat:"snakes", e:"🐍", p:420, sex:"נקבה", age:"6 חודשים", level:"בינוני", pop:5, d:"נחש מלך עם פסים שחור־לבן. פעיל וחזק, יש להחזיק לבד בטרריום." },
  { t:"נחש חלב הונדורסי", k:"milk", cat:"snakes", e:"🐍", p:480, sex:"זכר", age:"5 חודשים", level:"בינוני", pop:4, d:"נחש חלב בצבעי אדום, שחור וצהוב. מגידול בשבי." },
  { t:"נחש חרטום (Western Hognose)", k:"hognose", cat:"snakes", e:"🐍", p:900, sex:"נקבה", age:"4 חודשים", level:"בינוני", pop:5, d:"נחש קטן עם אף מורם ואופי מצחיק. נשאר קטן יחסית." },
  { t:"בואה קיסרית (Boa imperator)", k:"boa", cat:"snakes", e:"🐍", p:1100, sex:"נקבה", age:"שנה", level:"למגדלים מנוסים", pop:2, d:"בואה מגידול בשבי, רגועה אבל גדלה לשני מטרים ויותר. צריכה טרריום גדול ומנעול טוב." },
  { t:"בואת קשת (Rainbow Boa)", k:"rainbowboa", cat:"snakes", e:"🐍", p:1300, sex:"זכר", age:"8 חודשים", level:"בינוני", pop:2, d:"נחש שהקשקשים שלו מבריקים בצבעי קשת באור. צריך לחות גבוהה." },
  // inverts
  { t:"טרנטולה ברכיפלמה (Brachypelma)", k:"tarantula", cat:"inverts", e:"🕷️", p:180, sex:"לא ידוע", age:"צעירה", level:"מתאים למתחילים", pop:5, d:"טרנטולה רגועה יחסית, גדלה לאט. מגיעה בקופסת העברה." },
  { t:"טרנטולה ורודה צ׳יליאנית (Grammostola rosea)", k:"tarantula2", cat:"inverts", e:"🕷️", p:150, sex:"נקבה", age:"צעירה", level:"מתאים למתחילים", pop:4, d:"טרנטולה שקטה וקלה לטיפול, חיה שנים רבות. צריכה מצע יבש ומחבוא." },
  { t:"עקרב קיסרי (Emperor Scorpion)", k:"scorpion", cat:"inverts", e:"🦂", p:160, sex:"לא ידוע", age:"בוגר", level:"בינוני", pop:3, d:"עקרב שחור וגדול, רגוע יחסית. צריך מצע לח ומחבוא." },
  // terrariums
  { t:"טרריום זכוכית 60×45×45 עם דלתות קדמיות", k:"terrarium", cat:"terrariums", e:"🏠", p:690, pop:7, d:"טרריום זכוכית עם פתיחה קדמית, רשת אוורור עליונה ונעילה. מתאים לשממיות ולחרדון צעיר." },
  { t:"טרריום זכוכית 90×45×45", k:"terrarium", cat:"terrariums", e:"🏠", p:990, pop:5, d:"טרריום גדול לחרדון מזוקן בוגר או נחש בינוני. כולל פתחים לחוטי חשמל." },
  { t:"טרריום 120×60×60 לחרדון בוגר", k:"terrarium", cat:"terrariums", e:"🏠", p:1490, pop:3, d:"טרריום גדול עם דלתות הזזה. מספיק לחרדון מזוקן בוגר או לפיתון מלכותי." },
  { t:"טרריום גבוה 45×45×60 לשממיות עץ", k:"vivarium", cat:"terrariums", e:"🏠", p:590, pop:6, d:"טרריום אנכי לשממית מצויצת, וגרגויל. מגיע עם רקע תלת־ממדי." },
  { t:"כלוב רשת לזיקיות 45×45×90", k:"meshcage", cat:"terrariums", e:"🏠", p:420, pop:3, d:"כלוב רשת אלומיניום מאוורר, גבוה, מתאים לזיקיות." },
  // heat
  { t:"נורת UVB 10.0 T5 באורך 54 ס״מ", k:"uvb", cat:"heat", e:"💡", p:180, pop:8, d:"נורת UVB למדבריים. חשובה לבריאות העצמות של חרדונים וזיקיות. להחליף כל 12 חודשים." },
  { t:"נורת חימום 75 וואט", k:"heatlamp", cat:"heat", e:"💡", p:45, pop:9, d:"נורה ליצירת נקודת חום בטרריום. מומלץ לשלב עם תרמוסטט." },
  { t:"משטח חימום 20 וואט", k:"heatmat", cat:"heat", e:"🔥", p:95, pop:7, d:"משטח חימום מודבק לתחתית הטרריום. מתאים לשממיות ונחשים." },
  { t:"תרמוסטט דיגיטלי עם חיישן", k:"thermostat", cat:"heat", e:"🌡️", p:160, pop:7, d:"שומר על טמפרטורה קבועה ומונע התחממות יתר. קל להתקנה." },
  // food
  { t:"צרצרים חיים, קופסה של 50", k:"crickets", cat:"food", e:"🦗", p:25, pop:10, d:"צרצרים בגודל בינוני, מתאימים לשממיות ולחרדונים צעירים." },
  { t:"זחלי קמח, 100 גרם", k:"mealworms", cat:"food", e:"🪱", p:20, pop:9, d:"זחלי קמח טריים. לשמור בקירור." },
  { t:"ג׳וקים דוביה, 30 יחידות", k:"dubia", cat:"food", e:"🪳", p:40, pop:9, d:"מזון חי מזין ושקט, לא מטפס על זכוכית. מתאים לחרדונים." },
  { t:"ארבה חיה, 20 יחידות", k:"locust", cat:"food", e:"🦗", p:45, pop:6, d:"ארבה בגודל בינוני, מזון חי מזין לחרדונים, זיקיות וסקינקים." },
  { t:"זופובס (תולעי ענק), 50 יחידות", k:"superworm", cat:"food", e:"🪱", p:35, pop:6, d:"זחלים גדולים ועשירים בחלבון, מתאימים לחרדונים בוגרים ולשממיות גדולות." },
  { t:"עכברים קפואים, 10 יחידות", k:"mice", cat:"food", e:"🐭", p:60, pop:8, d:"עכברים קפואים בגודל מתאים לפיתון מלכותי צעיר. להפשיר לפני האכלה." },
  { t:"מזון אבקתי לשממית מצויצת 200 גרם", k:"food", cat:"food", e:"🥣", p:85, pop:7, d:"מזון מלא לשממיות מצויצות וגרגויל. מערבבים עם מים." },
  // decor
  { t:"מצע סיבי קוקוס, 8 ליטר", k:"coco", cat:"decor", e:"🥥", p:35, pop:7, d:"מצע טבעי שומר לחות, מתאים למינים טרופיים." },
  { t:"מצע חול מדברי, 5 ק״ג", k:"sand", cat:"decor", e:"🏜️", p:55, pop:5, d:"מצע מדברי לחרדונים. לא מתאים לצעירים מאוד." },
  { t:"מחבוא סלע מלאכותי", k:"hide", cat:"decor", e:"🪨", p:70, pop:6, d:"מערה לחה או יבשה לשממיות ונחשים. קל לניקוי." },
  { t:"ענף עץ טבעי לטיפוס", k:"branch", cat:"decor", e:"🪵", p:65, pop:5, d:"ענף מעובד ובטוח לשימוש בטרריום." },
  { t:"טחב ספגנום, 100 גרם", k:"moss", cat:"decor", e:"🌿", p:30, pop:5, d:"טחב טבעי ששומר לחות. מעולה למחבוא לח ולהטלת ביצים." },
  { t:"צמח פוטוס חי לטרריום", k:"plants", cat:"decor", e:"🪴", p:25, pop:4, d:"צמח מטפס עמיד שמתאים לטרריומים לחים ונותן מסתור לבעלי החיים." },
  // care
  { t:"אבקת סידן עם ויטמין D3", k:"calcium", cat:"care", e:"🧂", p:45, pop:8, d:"תוסף סידן לפיזור על חרקים לפני האכלה." },
  { t:"מדחום ומד לחות דיגיטלי", k:"hygro", cat:"care", e:"🌡️", p:40, pop:7, d:"מציג טמפרטורה ולחות על מסך גדול וקריא." },
  { t:"מלקחיים להאכלה 30 ס״מ", k:"tongs", cat:"care", e:"🥢", p:35, pop:6, d:"מלקחיים מנירוסטה להאכלה בטוחה." },
  { t:"מרסס מים 1 ליטר", k:"sprayer", cat:"care", e:"💧", p:30, pop:6, d:"לריסוס הטרריום ושמירה על לחות." },
];

/* PHOTOS:START */
const PHOTOS = {"leopard": ["img/leopard-00.jpg", "img/leopard-01.jpg", "img/leopard-02.jpg", "img/leopard-03.jpg", "img/leopard-04.jpg", "img/leopard-05.jpg", "img/leopard-06.jpg", "img/leopard-07.jpg", "img/leopard-08.jpg", "img/leopard-09.jpg", "img/leopard-10.jpg", "img/leopard-11.jpg", "img/leopard-12.jpg", "img/leopard-13.jpg", "img/leopard-14.jpg", "img/leopard-15.jpg", "img/leopard-16.jpg", "img/leopard-17.jpg", "img/leopard-18.jpg", "img/leopard-19.jpg"], "crested": ["img/crested-00.jpg", "img/crested-01.jpg", "img/crested-02.jpg", "img/crested-03.jpg", "img/crested-04.jpg", "img/crested-05.jpg", "img/crested-06.jpg", "img/crested-07.jpg", "img/crested-08.jpg", "img/crested-09.jpg", "img/crested-10.jpg", "img/crested-11.jpg", "img/crested-12.jpg", "img/crested-13.jpg", "img/crested-14.jpg", "img/crested-15.jpg", "img/crested-16.jpg"], "gargoyle": ["img/gargoyle-00.jpg", "img/gargoyle-01.jpg", "img/gargoyle-02.jpg"], "fattail": ["img/fattail-00.jpg", "img/fattail-01.jpg", "img/fattail-02.jpg"], "tokay": ["img/tokay-00.jpg", "img/tokay-01.jpg", "img/tokay-02.jpg", "img/tokay-03.jpg", "img/tokay-04.jpg", "img/tokay-05.jpg", "img/tokay-06.jpg", "img/tokay-07.jpg", "img/tokay-08.jpg", "img/tokay-09.jpg"], "daygecko": ["img/daygecko-00.jpg", "img/daygecko-01.jpg", "img/daygecko-02.jpg", "img/daygecko-03.jpg", "img/daygecko-04.jpg", "img/daygecko-05.jpg", "img/daygecko-06.jpg", "img/daygecko-07.jpg", "img/daygecko-08.jpg", "img/daygecko-09.jpg", "img/daygecko-10.jpg", "img/daygecko-11.jpg"], "bearded": ["img/bearded-00.jpg", "img/bearded-01.jpg", "img/bearded-02.jpg", "img/bearded-03.jpg", "img/bearded-04.jpg", "img/bearded-05.jpg", "img/bearded-06.jpg", "img/bearded-07.jpg", "img/bearded-08.jpg", "img/bearded-09.jpg", "img/bearded-10.jpg", "img/bearded-11.jpg", "img/bearded-12.jpg", "img/bearded-13.jpg", "img/bearded-14.jpg"], "bluetongue": ["img/bluetongue-00.jpg", "img/bluetongue-01.jpg", "img/bluetongue-02.jpg", "img/bluetongue-03.jpg", "img/bluetongue-04.jpg", "img/bluetongue-05.jpg", "img/bluetongue-06.jpg", "img/bluetongue-07.jpg", "img/bluetongue-08.jpg", "img/bluetongue-09.jpg", "img/bluetongue-10.jpg", "img/bluetongue-11.jpg"], "veiled": ["img/veiled-00.jpg", "img/veiled-01.jpg", "img/veiled-02.jpg", "img/veiled-03.jpg", "img/veiled-04.jpg", "img/veiled-05.jpg", "img/veiled-06.jpg", "img/veiled-07.jpg", "img/veiled-08.jpg", "img/veiled-09.jpg", "img/veiled-10.jpg", "img/veiled-11.jpg", "img/veiled-12.jpg", "img/veiled-13.jpg"], "uromastyx": ["img/uromastyx-00.jpg", "img/uromastyx-01.jpg", "img/uromastyx-02.jpg", "img/uromastyx-03.jpg", "img/uromastyx-04.jpg", "img/uromastyx-05.jpg", "img/uromastyx-06.jpg", "img/uromastyx-07.jpg"], "waterdragon": ["img/waterdragon-00.jpg", "img/waterdragon-01.jpg", "img/waterdragon-02.jpg", "img/waterdragon-03.jpg", "img/waterdragon-04.jpg", "img/waterdragon-05.jpg", "img/waterdragon-06.jpg"], "ball": ["img/ball-00.jpg", "img/ball-01.jpg", "img/ball-02.jpg", "img/ball-03.jpg", "img/ball-04.jpg", "img/ball-05.jpg", "img/ball-06.jpg", "img/ball-07.jpg", "img/ball-08.jpg", "img/ball-09.jpg", "img/ball-10.jpg", "img/ball-11.jpg", "img/ball-12.jpg", "img/ball-13.jpg", "img/ball-14.jpg", "img/ball-15.jpg", "img/ball-16.jpg", "img/ball-17.jpg", "img/ball-18.jpg", "img/ball-19.jpg"], "corn": ["img/corn-00.jpg", "img/corn-01.jpg", "img/corn-02.jpg", "img/corn-03.jpg", "img/corn-04.jpg", "img/corn-05.jpg", "img/corn-06.jpg", "img/corn-07.jpg", "img/corn-08.jpg", "img/corn-09.jpg", "img/corn-10.jpg"], "king": ["img/king-00.jpg", "img/king-01.jpg", "img/king-02.jpg", "img/king-03.jpg", "img/king-04.jpg", "img/king-05.jpg"], "milk": ["img/milk-00.jpg", "img/milk-01.jpg", "img/milk-02.jpg", "img/milk-03.jpg", "img/milk-04.jpg", "img/milk-05.jpg", "img/milk-06.jpg", "img/milk-07.jpg", "img/milk-08.jpg", "img/milk-09.jpg", "img/milk-10.jpg", "img/milk-11.jpg"], "hognose": ["img/hognose-00.jpg", "img/hognose-01.jpg", "img/hognose-02.jpg", "img/hognose-03.jpg", "img/hognose-04.jpg", "img/hognose-05.jpg", "img/hognose-06.jpg", "img/hognose-07.jpg", "img/hognose-08.jpg", "img/hognose-09.jpg", "img/hognose-10.jpg"], "boa": ["img/boa-00.jpg", "img/boa-01.jpg", "img/boa-02.jpg", "img/boa-03.jpg", "img/boa-04.jpg", "img/boa-05.jpg", "img/boa-06.jpg", "img/boa-07.jpg", "img/boa-08.jpg", "img/boa-09.jpg", "img/boa-10.jpg", "img/boa-11.jpg", "img/boa-12.jpg", "img/boa-13.jpg", "img/boa-14.jpg"], "rainbowboa": ["img/rainbowboa-00.jpg", "img/rainbowboa-01.jpg", "img/rainbowboa-02.jpg", "img/rainbowboa-03.jpg", "img/rainbowboa-04.jpg", "img/rainbowboa-05.jpg"], "tarantula": ["img/tarantula-00.jpg", "img/tarantula-01.jpg", "img/tarantula-02.jpg"], "tarantula2": ["img/tarantula2-00.jpg", "img/tarantula2-01.jpg", "img/tarantula2-02.jpg", "img/tarantula2-03.jpg", "img/tarantula2-04.jpg", "img/tarantula2-05.jpg"], "scorpion": ["img/scorpion-00.jpg", "img/scorpion-01.jpg", "img/scorpion-02.jpg", "img/scorpion-03.jpg", "img/scorpion-04.jpg", "img/scorpion-05.jpg", "img/scorpion-06.jpg", "img/scorpion-07.jpg"], "terrarium": ["img/terrarium-00.jpg", "img/terrarium-01.jpg", "img/terrarium-02.jpg", "img/terrarium-03.jpg", "img/terrarium-04.jpg", "img/terrarium-05.jpg", "img/terrarium-06.jpg", "img/terrarium-07.jpg", "img/terrarium-08.jpg", "img/terrarium-09.jpg", "img/terrarium-10.jpg", "img/terrarium-11.jpg", "img/terrarium-12.jpg", "img/terrarium-13.jpg", "img/terrarium-14.jpg", "img/terrarium-15.jpg"], "vivarium": ["img/vivarium-00.jpg", "img/vivarium-01.jpg", "img/vivarium-02.jpg", "img/vivarium-03.jpg", "img/vivarium-04.jpg", "img/vivarium-05.jpg"], "meshcage": ["img/meshcage-00.jpg"], "uvb": ["img/uvb-00.jpg", "img/uvb-01.jpg", "img/uvb-02.jpg", "img/uvb-03.jpg", "img/uvb-04.jpg", "img/uvb-05.jpg", "img/uvb-06.jpg"], "heatlamp": ["img/heatlamp-00.jpg", "img/heatlamp-01.jpg", "img/heatlamp-02.jpg", "img/heatlamp-03.jpg", "img/heatlamp-04.jpg"], "heatmat": ["img/heatmat-00.jpg", "img/heatmat-01.jpg"], "thermostat": ["img/thermostat-00.jpg", "img/thermostat-01.jpg", "img/thermostat-02.jpg", "img/thermostat-03.jpg", "img/thermostat-04.jpg"], "crickets": ["img/crickets-00.jpg", "img/crickets-01.jpg", "img/crickets-02.jpg", "img/crickets-03.jpg", "img/crickets-04.jpg", "img/crickets-05.jpg", "img/crickets-06.jpg", "img/crickets-07.jpg", "img/crickets-08.jpg", "img/crickets-09.jpg", "img/crickets-10.jpg"], "mealworms": ["img/mealworms-00.jpg", "img/mealworms-01.jpg", "img/mealworms-02.jpg", "img/mealworms-03.jpg", "img/mealworms-04.jpg", "img/mealworms-05.jpg", "img/mealworms-06.jpg", "img/mealworms-07.jpg", "img/mealworms-08.jpg", "img/mealworms-09.jpg", "img/mealworms-10.jpg", "img/mealworms-11.jpg", "img/mealworms-12.jpg"], "dubia": ["img/dubia-00.jpg", "img/dubia-01.jpg", "img/dubia-02.jpg", "img/dubia-03.jpg", "img/dubia-04.jpg", "img/dubia-05.jpg"], "locust": ["img/locust-00.jpg", "img/locust-01.jpg", "img/locust-02.jpg", "img/locust-03.jpg", "img/locust-04.jpg", "img/locust-05.jpg", "img/locust-06.jpg", "img/locust-07.jpg", "img/locust-08.jpg", "img/locust-09.jpg"], "superworm": ["img/superworm-00.jpg", "img/superworm-01.jpg", "img/superworm-02.jpg", "img/superworm-03.jpg", "img/superworm-04.jpg", "img/superworm-05.jpg", "img/superworm-06.jpg", "img/superworm-07.jpg", "img/superworm-08.jpg", "img/superworm-09.jpg", "img/superworm-10.jpg", "img/superworm-11.jpg"], "coco": ["img/coco-00.jpg", "img/coco-01.jpg", "img/coco-02.jpg", "img/coco-03.jpg", "img/coco-04.jpg"], "sand": ["img/sand-00.jpg", "img/sand-01.jpg", "img/sand-02.jpg", "img/sand-03.jpg", "img/sand-04.jpg", "img/sand-05.jpg"], "branch": ["img/branch-00.jpg", "img/branch-01.jpg", "img/branch-02.jpg"], "moss": ["img/moss-00.jpg", "img/moss-01.jpg", "img/moss-02.jpg", "img/moss-03.jpg", "img/moss-04.jpg", "img/moss-05.jpg"], "plants": ["img/plants-00.jpg", "img/plants-01.jpg", "img/plants-02.jpg", "img/plants-03.jpg", "img/plants-04.jpg", "img/plants-05.jpg", "img/plants-06.jpg", "img/plants-07.jpg", "img/plants-08.jpg"], "hygro": ["img/hygro-00.jpg", "img/hygro-01.jpg", "img/hygro-02.jpg", "img/hygro-03.jpg", "img/hygro-04.jpg"], "tongs": ["img/tongs-00.jpg", "img/tongs-01.jpg", "img/tongs-02.jpg", "img/tongs-03.jpg", "img/tongs-04.jpg"], "sprayer": ["img/sprayer-00.jpg", "img/sprayer-01.jpg", "img/sprayer-02.jpg", "img/sprayer-03.jpg", "img/sprayer-04.jpg"], "calcium": ["img/calcium-00.jpg", "img/calcium-01.jpg", "img/calcium-02.jpg", "img/calcium-03.jpg"], "mice": ["img/mice-00.jpg", "img/mice-01.jpg", "img/mice-02.jpg"], "hide": ["img/hide-00.jpg"], "food": ["img/food-00.jpg", "img/food-01.jpg", "img/food-02.jpg"]};
const CREDITS = [{"src": "img/leopard-00.jpg", "title": "File:Eublepharis macularius 2009 G6.jpg", "page": "https://commons.wikimedia.org/wiki/File:Eublepharis_macularius_2009_G6.jpg", "artist": "George Chernilevsky", "license": "Public domain"}, {"src": "img/leopard-01.jpg", "title": "File:Eublepharis macularius 2009 G5.jpg", "page": "https://commons.wikimedia.org/wiki/File:Eublepharis_macularius_2009_G5.jpg", "artist": "George Chernilevsky", "license": "Public domain"}, {"src": "img/leopard-02.jpg", "title": "File:Eublepharis macularius 2009 G8.jpg", "page": "https://commons.wikimedia.org/wiki/File:Eublepharis_macularius_2009_G8.jpg", "artist": "George Chernilevsky", "license": "Public domain"}, {"src": "img/leopard-03.jpg", "title": "File:Eublepharis macularius 2009 G7.jpg", "page": "https://commons.wikimedia.org/wiki/File:Eublepharis_macularius_2009_G7.jpg", "artist": "George Chernilevsky", "license": "Public domain"}, {"src": "img/leopard-04.jpg", "title": "File:Leopard gecko (Eublepharis macularius), Entomica 2.jpg", "page": "https://commons.wikimedia.org/wiki/File:Leopard_gecko_(Eublepharis_macularius),_Entomica_2.jpg", "artist": "Fungus Guy", "license": "CC BY-SA 4.0"}, {"src": "img/leopard-05.jpg", "title": "File:Leopard gecko (Eublepharis macularius), Entomica 1.jpg", "page": "https://commons.wikimedia.org/wiki/File:Leopard_gecko_(Eublepharis_macularius),_Entomica_1.jpg", "artist": "Fungus Guy", "license": "CC BY-SA 4.0"}, {"src": "img/leopard-06.jpg", "title": "File:Eublepharis macularius after molting.jpg", "page": "https://commons.wikimedia.org/wiki/File:Eublepharis_macularius_after_molting.jpg", "artist": "Kinori", "license": "CC0"}, {"src": "img/leopard-07.jpg", "title": "File:EUBLEPHARIS-MACULARIUS Leopard-Gecko Leopardgecko 201705276004.jpg", "page": "https://commons.wikimedia.org/wiki/File:EUBLEPHARIS-MACULARIUS_Leopard-Gecko_Leopardgecko_201705276004.jpg", "artist": "Christian von Faber-Castell", "license": "CC BY 4.0"}, {"src": "img/leopard-08.jpg", "title": "File:EUBLEPHARIS-MACULARIUS Leopard-Gecko Leopardgecko 201705276007.jpg", "page": "https://commons.wikimedia.org/wiki/File:EUBLEPHARIS-MACULARIUS_Leopard-Gecko_Leopardgecko_201705276007.jpg", "artist": "Christian von Faber-Castell", "license": "CC BY 4.0"}, {"src": "img/leopard-09.jpg", "title": "File:EUBLEPHARIS-MACULARIUS Leopard-Gecko Leopardgecko 201705276003.jpg", "page": "https://commons.wikimedia.org/wiki/File:EUBLEPHARIS-MACULARIUS_Leopard-Gecko_Leopardgecko_201705276003.jpg", "artist": "Christian von Faber-Castell", "license": "CC BY 4.0"}, {"src": "img/leopard-10.jpg", "title": "File:EUBLEPHARIS-MACULARIUS Leopard-Gecko Leopardgecko 201705276011.jpg", "page": "https://commons.wikimedia.org/wiki/File:EUBLEPHARIS-MACULARIUS_Leopard-Gecko_Leopardgecko_201705276011.jpg", "artist": "Christian von Faber-Castell", "license": "CC BY 4.0"}, {"src": "img/leopard-11.jpg", "title": "File:Eublepharis macularius (1).jpg", "page": "https://commons.wikimedia.org/wiki/File:Eublepharis_macularius_(1).jpg", "artist": "Self taken by J.W. Connelly (Darkenism at en.wikipedia)", "license": "Public domain"}, {"src": "img/leopard-12.jpg", "title": "File:EUBLEPHARIS-MACULARIUS Leopard-Gecko Leopardgecko 201705276012.jpg", "page": "https://commons.wikimedia.org/wiki/File:EUBLEPHARIS-MACULARIUS_Leopard-Gecko_Leopardgecko_201705276012.jpg", "artist": "Christian von Faber-Castell", "license": "CC BY 4.0"}, {"src": "img/leopard-13.jpg", "title": "File:Leopard Gecko, Eublepharis macularius.jpg", "page": "https://commons.wikimedia.org/wiki/File:Leopard_Gecko,_Eublepharis_macularius.jpg", "artist": "Ryan Somma", "license": "CC BY 2.0"}, {"src": "img/leopard-14.jpg", "title": "File:Eublepharis macularius J.jpg", "page": "https://commons.wikimedia.org/wiki/File:Eublepharis_macularius_J.jpg", "artist": "J. Polák", "license": "CC0"}, {"src": "img/leopard-15.jpg", "title": "File:Eublepharis macularius 01.JPG", "page": "https://commons.wikimedia.org/wiki/File:Eublepharis_macularius_01.JPG", "artist": "HTO", "license": "Public domain"}, {"src": "img/leopard-16.jpg", "title": "File:Eublepharis macularius 2009 G3.jpg", "page": "https://commons.wikimedia.org/wiki/File:Eublepharis_macularius_2009_G3.jpg", "artist": "George Chernilevsky", "license": "Public domain"}, {"src": "img/leopard-17.jpg", "title": "File:Eublepharis macularius 1.jpg", "page": "https://commons.wikimedia.org/wiki/File:Eublepharis_macularius_1.jpg", "artist": "Michał Zawiślak (mihauz @)", "license": "CC BY-SA 2.5"}, {"src": "img/leopard-18.jpg", "title": "File:Eublepharis macularius 04.jpg", "page": "https://commons.wikimedia.org/wiki/File:Eublepharis_macularius_04.jpg", "artist": "Σ64", "license": "CC BY 4.0"}, {"src": "img/leopard-19.jpg", "title": "File:Eublepharis macularius 2009 G4.jpg", "page": "https://commons.wikimedia.org/wiki/File:Eublepharis_macularius_2009_G4.jpg", "artist": "George Chernilevsky", "license": "Public domain"}, {"src": "img/crested-00.jpg", "title": "File:Correlophus ciliatus 33605230.jpg", "page": "https://commons.wikimedia.org/wiki/File:Correlophus_ciliatus_33605230.jpg", "artist": "Lennart Hudel", "license": "CC BY 4.0"}, {"src": "img/crested-01.jpg", "title": "File:Correlophus ciliatus 34354132.jpg", "page": "https://commons.wikimedia.org/wiki/File:Correlophus_ciliatus_34354132.jpg", "artist": "Lennart Hudel", "license": "CC BY 4.0"}, {"src": "img/crested-02.jpg", "title": "File:Correlophus ciliatus 33484989.jpg", "page": "https://commons.wikimedia.org/wiki/File:Correlophus_ciliatus_33484989.jpg", "artist": "Lennart Hudel", "license": "CC BY 4.0"}, {"src": "img/crested-03.jpg", "title": "File:Correlophus ciliatus 33604286.jpg", "page": "https://commons.wikimedia.org/wiki/File:Correlophus_ciliatus_33604286.jpg", "artist": "Lennart Hudel", "license": "CC BY 4.0"}, {"src": "img/crested-04.jpg", "title": "File:Correlophus ciliatus 33606417.jpg", "page": "https://commons.wikimedia.org/wiki/File:Correlophus_ciliatus_33606417.jpg", "artist": "Lennart Hudel", "license": "CC BY 4.0"}, {"src": "img/crested-05.jpg", "title": "File:Correlophus ciliatus 33603685.jpg", "page": "https://commons.wikimedia.org/wiki/File:Correlophus_ciliatus_33603685.jpg", "artist": "Lennart Hudel", "license": "CC BY 4.0"}, {"src": "img/crested-06.jpg", "title": "File:Correlophus ciliatus 33612285.jpg", "page": "https://commons.wikimedia.org/wiki/File:Correlophus_ciliatus_33612285.jpg", "artist": "Lennart Hudel", "license": "CC BY 4.0"}, {"src": "img/crested-07.jpg", "title": "File:Correlophus ciliatus 33600735.jpg", "page": "https://commons.wikimedia.org/wiki/File:Correlophus_ciliatus_33600735.jpg", "artist": "Lennart Hudel", "license": "CC BY 4.0"}, {"src": "img/crested-08.jpg", "title": "File:Correlophus ciliatus 33605448.jpg", "page": "https://commons.wikimedia.org/wiki/File:Correlophus_ciliatus_33605448.jpg", "artist": "Lennart Hudel", "license": "CC BY 4.0"}, {"src": "img/crested-09.jpg", "title": "File:Correlophus ciliatus 33606516.jpg", "page": "https://commons.wikimedia.org/wiki/File:Correlophus_ciliatus_33606516.jpg", "artist": "Lennart Hudel", "license": "CC BY 4.0"}, {"src": "img/crested-10.jpg", "title": "File:Correlophus ciliatus 33604770.jpg", "page": "https://commons.wikimedia.org/wiki/File:Correlophus_ciliatus_33604770.jpg", "artist": "Lennart Hudel", "license": "CC BY 4.0"}, {"src": "img/crested-11.jpg", "title": "File:Correlophus ciliatus 33605620.jpg", "page": "https://commons.wikimedia.org/wiki/File:Correlophus_ciliatus_33605620.jpg", "artist": "Lennart Hudel", "license": "CC BY 4.0"}, {"src": "img/crested-12.jpg", "title": "File:Super Empty Back Crested Gecko.jpg", "page": "https://commons.wikimedia.org/wiki/File:Super_Empty_Back_Crested_Gecko.jpg", "artist": "Vsnary", "license": "CC0"}, {"src": "img/crested-13.jpg", "title": "File:Crested gecko - 1.jpg", "page": "https://commons.wikimedia.org/wiki/File:Crested_gecko_-_1.jpg", "artist": "Lennart Hudel", "license": "CC BY 4.0"}, {"src": "img/crested-14.jpg", "title": "File:Rhacodactylus ciliatus on a bed.jpg", "page": "https://commons.wikimedia.org/wiki/File:Rhacodactylus_ciliatus_on_a_bed.jpg", "artist": "Zaahir from Brooklin, Canada", "license": "CC BY 2.0"}, {"src": "img/crested-15.jpg", "title": "File:Rhacodactylus ciliatus male.jpg", "page": "https://commons.wikimedia.org/wiki/File:Rhacodactylus_ciliatus_male.jpg", "artist": "Hexasoft", "license": "CC BY-SA 3.0"}, {"src": "img/crested-16.jpg", "title": "File:Crested gecko juvenile.jpg", "page": "https://commons.wikimedia.org/wiki/File:Crested_gecko_juvenile.jpg", "artist": "DigitalLem0n", "license": "CC BY-SA 4.0"}, {"src": "img/gargoyle-00.jpg", "title": "File:Gargoyle gecko (Rhacodactylus auriculatus), Entomica 1.jpg", "page": "https://commons.wikimedia.org/wiki/File:Gargoyle_gecko_(Rhacodactylus_auriculatus),_Entomica_1.jpg", "artist": "Fungus Guy", "license": "CC BY-SA 4.0"}, {"src": "img/gargoyle-01.jpg", "title": "File:Rhacodactylus auriculatus 14.11.2013.JPG", "page": "https://commons.wikimedia.org/wiki/File:Rhacodactylus_auriculatus_14.11.2013.JPG", "artist": "Eveha", "license": "CC BY-SA 3.0"}, {"src": "img/gargoyle-02.jpg", "title": "File:Rhacodactylus auriculatus2.jpg", "page": "https://commons.wikimedia.org/wiki/File:Rhacodactylus_auriculatus2.jpg", "artist": "LA Dawson", "license": "CC BY-SA 2.5"}, {"src": "img/fattail-00.jpg", "title": "File:Hemitheconyx caudicinctus.jpg", "page": "https://commons.wikimedia.org/wiki/File:Hemitheconyx_caudicinctus.jpg", "artist": "Unknown", "license": "CC BY-SA 3.0"}, {"src": "img/fattail-01.jpg", "title": "File:Hemitheconyx caudicinctus in Yaroslavl Zoo.jpg", "page": "https://commons.wikimedia.org/wiki/File:Hemitheconyx_caudicinctus_in_Yaroslavl_Zoo.jpg", "artist": "Stolbovsky", "license": "CC BY-SA 3.0"}, {"src": "img/fattail-02.jpg", "title": "File:Fat-Tailed Gecko Sleeping.jpeg", "page": "https://commons.wikimedia.org/wiki/File:Fat-Tailed_Gecko_Sleeping.jpeg", "artist": "User:Kevronichebroni", "license": "CC BY-SA 3.0"}, {"src": "img/tokay-00.jpg", "title": "File:Chinese gecko (Gekko chinensis) Aberdeen.jpg", "page": "https://commons.wikimedia.org/wiki/File:Chinese_gecko_(Gekko_chinensis)_Aberdeen.jpg", "artist": "Charles J. Sharp", "license": "CC BY-SA 4.0"}, {"src": "img/tokay-01.jpg", "title": "File:Tokay Gecko (Gekko gecko) (7109782823).jpg", "page": "https://commons.wikimedia.org/wiki/File:Tokay_Gecko_(Gekko_gecko)_(7109782823).jpg", "artist": "Bernard DUPONT from FRANCE", "license": "CC BY-SA 2.0"}, {"src": "img/tokay-02.jpg", "title": "File:Tokay.jpg", "page": "https://commons.wikimedia.org/wiki/File:Tokay.jpg", "artist": "Nick Hobgood", "license": "CC BY 2.0"}, {"src": "img/tokay-03.jpg", "title": "File:Tokay gecko (Gekko gecko).jpg", "page": "https://commons.wikimedia.org/wiki/File:Tokay_gecko_(Gekko_gecko).jpg", "artist": "MH Herpetology", "license": "CC BY-SA 4.0"}, {"src": "img/tokay-04.jpg", "title": "File:Tokay gecko in the Perhentians.jpg", "page": "https://commons.wikimedia.org/wiki/File:Tokay_gecko_in_the_Perhentians.jpg", "artist": "Jpatokal", "license": "CC BY-SA 4.0"}, {"src": "img/tokay-05.jpg", "title": "File:Gekkonidae Gekko gecko 1.jpg", "page": "https://commons.wikimedia.org/wiki/File:Gekkonidae_Gekko_gecko_1.jpg", "artist": "NasserHalaweh", "license": "CC BY-SA 4.0"}, {"src": "img/tokay-06.jpg", "title": "File:Gekko gecko 192129898.jpg", "page": "https://commons.wikimedia.org/wiki/File:Gekko_gecko_192129898.jpg", "artist": "Gerard Chartier", "license": "CC BY 4.0"}, {"src": "img/tokay-07.jpg", "title": "File:Gekko gecko 192129852.jpg", "page": "https://commons.wikimedia.org/wiki/File:Gekko_gecko_192129852.jpg", "artist": "Gerard Chartier", "license": "CC BY 4.0"}, {"src": "img/tokay-08.jpg", "title": "File:Gekko gecko 192129928.jpg", "page": "https://commons.wikimedia.org/wiki/File:Gekko_gecko_192129928.jpg", "artist": "Gerard Chartier", "license": "CC BY 4.0"}, {"src": "img/tokay-09.jpg", "title": "File:Gekko gecko 106845652.jpg", "page": "https://commons.wikimedia.org/wiki/File:Gekko_gecko_106845652.jpg", "artist": "Oleg Kosterin", "license": "CC BY 4.0"}, {"src": "img/daygecko-00.jpg", "title": "File:Gecko diurno grande de Madagascar (Phelsuma grandis), Nosy Komba, Madagascar, 2025-09-12, DD 30.jpg", "page": "https://commons.wikimedia.org/wiki/File:Gecko_diurno_grande_de_Madagascar_(Phelsuma_grandis),_Nosy_Komba,_Madagascar,_2025-09-12,_DD_30.jpg", "artist": "Diego Delso", "license": "CC BY-SA 4.0"}, {"src": "img/daygecko-01.jpg", "title": "File:Phelsuma grandis, Stuttgart Zoological Garden.jpg", "page": "https://commons.wikimedia.org/wiki/File:Phelsuma_grandis,_Stuttgart_Zoological_Garden.jpg", "artist": "Holger Krisp", "license": "CC BY 3.0"}, {"src": "img/daygecko-02.jpg", "title": "File:Phelsuma grandis, Mauritius.jpg", "page": "https://commons.wikimedia.org/wiki/File:Phelsuma_grandis,_Mauritius.jpg", "artist": "Michael Kuhn", "license": "CC BY 4.0"}, {"src": "img/daygecko-03.jpg", "title": "File:Madagascar giant day gecko (Phelsuma grandis) head Nosy Komba.jpg", "page": "https://commons.wikimedia.org/wiki/File:Madagascar_giant_day_gecko_(Phelsuma_grandis)_head_Nosy_Komba.jpg", "artist": "Charles J. Sharp", "license": "CC BY-SA 4.0"}, {"src": "img/daygecko-04.jpg", "title": "File:Madagascar giant day gecko (Phelsuma grandis) Nosy Komba.jpg", "page": "https://commons.wikimedia.org/wiki/File:Madagascar_giant_day_gecko_(Phelsuma_grandis)_Nosy_Komba.jpg", "artist": "Charles J. Sharp", "license": "CC BY-SA 4.0"}, {"src": "img/daygecko-05.jpg", "title": "File:Phelsuma grandis by Brian Gratwicke.jpg", "page": "https://commons.wikimedia.org/wiki/File:Phelsuma_grandis_by_Brian_Gratwicke.jpg", "artist": "Brian Gratwicke", "license": "CC BY 2.0"}, {"src": "img/daygecko-06.jpg", "title": "File:Phelsuma grandis - 5540.jpg", "page": "https://commons.wikimedia.org/wiki/File:Phelsuma_grandis_-_5540.jpg", "artist": "Amada44", "license": "CC BY-SA 3.0"}, {"src": "img/daygecko-07.jpg", "title": "File:Phelsuma grandis - 5542.jpg", "page": "https://commons.wikimedia.org/wiki/File:Phelsuma_grandis_-_5542.jpg", "artist": "Amada44", "license": "CC BY-SA 3.0"}, {"src": "img/daygecko-08.jpg", "title": "File:Phelsuma grandis - 5543.jpg", "page": "https://commons.wikimedia.org/wiki/File:Phelsuma_grandis_-_5543.jpg", "artist": "Amada44", "license": "CC BY-SA 3.0"}, {"src": "img/daygecko-09.jpg", "title": "File:Phelsuma grandis - 5536.jpg", "page": "https://commons.wikimedia.org/wiki/File:Phelsuma_grandis_-_5536.jpg", "artist": "Amada44", "license": "CC BY-SA 3.0"}, {"src": "img/daygecko-10.jpg", "title": "File:Phelsuma grandis, Mauritius (edited).jpg", "page": "https://commons.wikimedia.org/wiki/File:Phelsuma_grandis,_Mauritius_(edited).jpg", "artist": "Michael Kuhn", "license": "CC BY 4.0"}, {"src": "img/daygecko-11.jpg", "title": "File:Madagascar giant day gecko (Phelsuma grandis) Nosy Komba (cropped).jpg", "page": "https://commons.wikimedia.org/wiki/File:Madagascar_giant_day_gecko_(Phelsuma_grandis)_Nosy_Komba_(cropped).jpg", "artist": "Charles J. Sharp", "license": "CC BY-SA 4.0"}, {"src": "img/bearded-00.jpg", "title": "File:Pogona vitticeps close-up 2009 G3.jpg", "page": "https://commons.wikimedia.org/wiki/File:Pogona_vitticeps_close-up_2009_G3.jpg", "artist": "George Chernilevsky", "license": "Public domain"}, {"src": "img/bearded-01.jpg", "title": "File:383 - Head of central bearded dragon (Pogona vitticeps).jpg", "page": "https://commons.wikimedia.org/wiki/File:383_-_Head_of_central_bearded_dragon_(Pogona_vitticeps).jpg", "artist": "Virtual-Pano", "license": "CC BY 4.0"}, {"src": "img/bearded-02.jpg", "title": "File:Pogona vitticeps 2009 G2.jpg", "page": "https://commons.wikimedia.org/wiki/File:Pogona_vitticeps_2009_G2.jpg", "artist": "George Chernilevsky", "license": "Public domain"}, {"src": "img/bearded-03.jpg", "title": "File:Pogona vitticeps 2009 G4.jpg", "page": "https://commons.wikimedia.org/wiki/File:Pogona_vitticeps_2009_G4.jpg", "artist": "George Chernilevsky", "license": "Public domain"}, {"src": "img/bearded-04.jpg", "title": "File:Pogona vitticeps close-up 2009 G2.jpg", "page": "https://commons.wikimedia.org/wiki/File:Pogona_vitticeps_close-up_2009_G2.jpg", "artist": "George Chernilevsky", "license": "Public domain"}, {"src": "img/bearded-05.jpg", "title": "File:Pogona vitticeps 2009 G3.jpg", "page": "https://commons.wikimedia.org/wiki/File:Pogona_vitticeps_2009_G3.jpg", "artist": "George Chernilevsky", "license": "Public domain"}, {"src": "img/bearded-06.jpg", "title": "File:Pogona vitticeps 2009 G1.jpg", "page": "https://commons.wikimedia.org/wiki/File:Pogona_vitticeps_2009_G1.jpg", "artist": "George Chernilevsky", "license": "Public domain"}, {"src": "img/bearded-07.jpg", "title": "File:Pogona vitticeps close-up 2009 G4.jpg", "page": "https://commons.wikimedia.org/wiki/File:Pogona_vitticeps_close-up_2009_G4.jpg", "artist": "George Chernilevsky", "license": "Public domain"}, {"src": "img/bearded-08.jpg", "title": "File:Pogona vitticeps close-up 2009 G1.jpg", "page": "https://commons.wikimedia.org/wiki/File:Pogona_vitticeps_close-up_2009_G1.jpg", "artist": "George Chernilevsky", "license": "Public domain"}, {"src": "img/bearded-09.jpg", "title": "File:Pogona vitticeps 01.jpg", "page": "https://commons.wikimedia.org/wiki/File:Pogona_vitticeps_01.jpg", "artist": "H. Zell", "license": "CC BY-SA 3.0"}, {"src": "img/bearded-10.jpg", "title": "File:Pogona vitticeps 02.JPG", "page": "https://commons.wikimedia.org/wiki/File:Pogona_vitticeps_02.JPG", "artist": "H. Zell", "license": "CC BY-SA 3.0"}, {"src": "img/bearded-11.jpg", "title": "File:Osnabrück - Zoo - Pogona vitticeps 01.jpg", "page": "https://commons.wikimedia.org/wiki/File:Osnabr%C3%BCck_-_Zoo_-_Pogona_vitticeps_01.jpg", "artist": "Basotxerri", "license": "CC BY-SA 4.0"}, {"src": "img/bearded-12.jpg", "title": "File:Washington DC Zoo - Inland Bearder Dragon 1.jpg", "page": "https://commons.wikimedia.org/wiki/File:Washington_DC_Zoo_-_Inland_Bearder_Dragon_1.jpg", "artist": "Jarek Tuszyński", "license": "CC BY-SA 3.0"}, {"src": "img/bearded-13.jpg", "title": "File:Central bearded dragon (Pogona vitticeps) at Perth Zoo, June 2023 02.jpg", "page": "https://commons.wikimedia.org/wiki/File:Central_bearded_dragon_(Pogona_vitticeps)_at_Perth_Zoo,_June_2023_02.jpg", "artist": "Calistemon", "license": "CC BY-SA 4.0"}, {"src": "img/bearded-14.jpg", "title": "File:Central bearded dragon (Pogona vitticeps) at Perth Zoo, June 2023 01.jpg", "page": "https://commons.wikimedia.org/wiki/File:Central_bearded_dragon_(Pogona_vitticeps)_at_Perth_Zoo,_June_2023_01.jpg", "artist": "Calistemon", "license": "CC BY-SA 4.0"}, {"src": "img/bluetongue-00.jpg", "title": "File:Tiliqua scincoides (White, 1790).jpg", "page": "https://commons.wikimedia.org/wiki/File:Tiliqua_scincoides_(White,_1790).jpg", "artist": "Michael Gäbler", "license": "CC BY-SA 3.0"}, {"src": "img/bluetongue-01.jpg", "title": "File:Eastern blue-tongued lizard - Tiliqua scincoides scincoides - 3.jpg", "page": "https://commons.wikimedia.org/wiki/File:Eastern_blue-tongued_lizard_-_Tiliqua_scincoides_scincoides_-_3.jpg", "artist": "Geoff Penaluna", "license": "CC BY 2.0"}, {"src": "img/bluetongue-02.jpg", "title": "File:Eastern blue-tongued lizard - Tiliqua scincoides scincoides - 4.jpg", "page": "https://commons.wikimedia.org/wiki/File:Eastern_blue-tongued_lizard_-_Tiliqua_scincoides_scincoides_-_4.jpg", "artist": "Andrew Harvey", "license": "CC BY 2.0"}, {"src": "img/bluetongue-03.jpg", "title": "File:Eastern blue-tongued lizard - Tiliqua scincoides scincoides - 6.jpg", "page": "https://commons.wikimedia.org/wiki/File:Eastern_blue-tongued_lizard_-_Tiliqua_scincoides_scincoides_-_6.jpg", "artist": "Simon_sees", "license": "CC BY 2.0"}, {"src": "img/bluetongue-04.jpg", "title": "File:Eastern blue-tongued lizard - Tiliqua scincoides scincoides - 7.jpg", "page": "https://commons.wikimedia.org/wiki/File:Eastern_blue-tongued_lizard_-_Tiliqua_scincoides_scincoides_-_7.jpg", "artist": "Simon_sees", "license": "CC BY 2.0"}, {"src": "img/bluetongue-05.jpg", "title": "File:Eastern blue-tongued lizard - Tiliqua scincoides scincoides - 5.jpg", "page": "https://commons.wikimedia.org/wiki/File:Eastern_blue-tongued_lizard_-_Tiliqua_scincoides_scincoides_-_5.jpg", "artist": "Andrew Harvey", "license": "CC BY 2.0"}, {"src": "img/bluetongue-06.jpg", "title": "File:Eastern blue-tongued lizard - Tiliqua scincoides scincoides - 2.jpg", "page": "https://commons.wikimedia.org/wiki/File:Eastern_blue-tongued_lizard_-_Tiliqua_scincoides_scincoides_-_2.jpg", "artist": "Simon_sees", "license": "CC BY 2.0"}, {"src": "img/bluetongue-07.jpg", "title": "File:Eastern blue-tongued lizard (Tiliqua scincoides scincoides) - 2022 werrington lake reserve sydney 2.jpg", "page": "https://commons.wikimedia.org/wiki/File:Eastern_blue-tongued_lizard_(Tiliqua_scincoides_scincoides)_-_2022_werrington_lake_reserve_sydney_2.jpg", "artist": "Xyxyzyz", "license": "CC0"}, {"src": "img/bluetongue-08.jpg", "title": "File:Eastern blue-tongued lizard (Tiliqua scincoides scincoides) - 2022 werrington lake reserve sydney 3.jpg", "page": "https://commons.wikimedia.org/wiki/File:Eastern_blue-tongued_lizard_(Tiliqua_scincoides_scincoides)_-_2022_werrington_lake_reserve_sydney_3.jpg", "artist": "Xyxyzyz", "license": "CC0"}, {"src": "img/bluetongue-09.jpg", "title": "File:Eastern blue-tongued lizard (Tiliqua scincoides scincoides) - 2022 werrington lake reserve sydney.jpg", "page": "https://commons.wikimedia.org/wiki/File:Eastern_blue-tongued_lizard_(Tiliqua_scincoides_scincoides)_-_2022_werrington_lake_reserve_sydney.jpg", "artist": "Xyxyzyz", "license": "CC0"}, {"src": "img/bluetongue-10.jpg", "title": "File:Immature eastern blue tongued lizard.jpg", "page": "https://commons.wikimedia.org/wiki/File:Immature_eastern_blue_tongued_lizard.jpg", "artist": "Peripitus", "license": "CC BY-SA 3.0"}, {"src": "img/bluetongue-11.jpg", "title": "File:Eastern Blue Tongue (Tiliqua scincoides scincoides) (8397072985).jpg", "page": "https://commons.wikimedia.org/wiki/File:Eastern_Blue_Tongue_(Tiliqua_scincoides_scincoides)_(8397072985).jpg", "artist": "Matt from Melbourne, Australia", "license": "CC BY 2.0"}, {"src": "img/veiled-00.jpg", "title": "File:Chamaeleo calyptratus 01.jpg", "page": "https://commons.wikimedia.org/wiki/File:Chamaeleo_calyptratus_01.jpg", "artist": "H. Zell", "license": "CC BY-SA 3.0"}, {"src": "img/veiled-01.jpg", "title": "File:Veiled chameleon Chamaeleo calyptratus Berlin Zoo.jpg", "page": "https://commons.wikimedia.org/wiki/File:Veiled_chameleon_Chamaeleo_calyptratus_Berlin_Zoo.jpg", "artist": "Kristof Magnusson", "license": "CC BY-SA 4.0"}, {"src": "img/veiled-02.jpg", "title": "File:Veiled chameleon Chamaeleo calyptratus Aquarium Berlin Zoo.jpg", "page": "https://commons.wikimedia.org/wiki/File:Veiled_chameleon_Chamaeleo_calyptratus_Aquarium_Berlin_Zoo.jpg", "artist": "Kristof Magnusson", "license": "CC BY-SA 4.0"}, {"src": "img/veiled-03.jpg", "title": "File:Veiled chameleon (Chamaeleo calyptratus), Entomica 1.jpg", "page": "https://commons.wikimedia.org/wiki/File:Veiled_chameleon_(Chamaeleo_calyptratus),_Entomica_1.jpg", "artist": "Fungus Guy", "license": "CC BY-SA 4.0"}, {"src": "img/veiled-04.jpg", "title": "File:Chamaeleo calyptratus Esapolis 02.jpg", "page": "https://commons.wikimedia.org/wiki/File:Chamaeleo_calyptratus_Esapolis_02.jpg", "artist": "Syrio", "license": "CC BY-SA 4.0"}, {"src": "img/veiled-05.jpg", "title": "File:Chamaeleo calyptratus Esapolis 01.jpg", "page": "https://commons.wikimedia.org/wiki/File:Chamaeleo_calyptratus_Esapolis_01.jpg", "artist": "Syrio", "license": "CC BY-SA 4.0"}, {"src": "img/veiled-06.jpg", "title": "File:Veiled chameleon (Chamaeleo calyptratus), Entomica 4.jpg", "page": "https://commons.wikimedia.org/wiki/File:Veiled_chameleon_(Chamaeleo_calyptratus),_Entomica_4.jpg", "artist": "Fungus Guy", "license": "CC BY-SA 4.0"}, {"src": "img/veiled-07.jpg", "title": "File:Veiled chameleon (Chamaeleo calyptratus), Entomica 3.jpg", "page": "https://commons.wikimedia.org/wiki/File:Veiled_chameleon_(Chamaeleo_calyptratus),_Entomica_3.jpg", "artist": "Fungus Guy", "license": "CC BY-SA 4.0"}, {"src": "img/veiled-08.jpg", "title": "File:Veiled chameleon (Chamaeleo calyptratus), Entomica 2.jpg", "page": "https://commons.wikimedia.org/wiki/File:Veiled_chameleon_(Chamaeleo_calyptratus),_Entomica_2.jpg", "artist": "Fungus Guy", "license": "CC BY-SA 4.0"}, {"src": "img/veiled-09.jpg", "title": "File:Chamaeleo calyptratus female.jpg", "page": "https://commons.wikimedia.org/wiki/File:Chamaeleo_calyptratus_female.jpg", "artist": "Drägüs", "license": "Public domain"}, {"src": "img/veiled-10.jpg", "title": "File:Chameleon head.jpg", "page": "https://commons.wikimedia.org/wiki/File:Chameleon_head.jpg", "artist": "frank wouters from antwerpen, belgium", "license": "CC BY 2.0"}, {"src": "img/veiled-11.jpg", "title": "File:Chamaeleo calyptratus Yemenkameleont.jpg", "page": "https://commons.wikimedia.org/wiki/File:Chamaeleo_calyptratus_Yemenkameleont.jpg", "artist": "Embreus", "license": "CC BY 3.0"}, {"src": "img/veiled-12.jpg", "title": "File:Chamaeleo calyptratus 03.jpg", "page": "https://commons.wikimedia.org/wiki/File:Chamaeleo_calyptratus_03.jpg", "artist": "Σ64", "license": "CC BY 4.0"}, {"src": "img/veiled-13.jpg", "title": "File:Chamaeleo calyptratus (6337087575).jpg", "page": "https://commons.wikimedia.org/wiki/File:Chamaeleo_calyptratus_(6337087575).jpg", "artist": "Ruben Undheim from Trondheim, Norway", "license": "CC BY-SA 2.0"}, {"src": "img/uromastyx-00.jpg", "title": "File:Monitor lizard swallows Uromastyx in Kuwait.jpg", "page": "https://commons.wikimedia.org/wiki/File:Monitor_lizard_swallows_Uromastyx_in_Kuwait.jpg", "artist": "Mfalhajji", "license": "CC BY-SA 4.0"}, {"src": "img/uromastyx-01.jpg", "title": "File:Spiny-tailed lizards in Kuwait.jpg", "page": "https://commons.wikimedia.org/wiki/File:Spiny-tailed_lizards_in_Kuwait.jpg", "artist": "Manojkiri photography", "license": "CC BY-SA 4.0"}, {"src": "img/uromastyx-02.jpg", "title": "File:Spiny-tailed lizards in Subiya Reserve 2.jpg", "page": "https://commons.wikimedia.org/wiki/File:Spiny-tailed_lizards_in_Subiya_Reserve_2.jpg", "artist": "Ghasem bavi", "license": "CC BY-SA 4.0"}, {"src": "img/uromastyx-03.jpg", "title": "File:Spiny-tailed lizards in Subiya Reserve 3.jpg", "page": "https://commons.wikimedia.org/wiki/File:Spiny-tailed_lizards_in_Subiya_Reserve_3.jpg", "artist": "Ghasem bavi", "license": "CC BY-SA 4.0"}, {"src": "img/uromastyx-04.jpg", "title": "File:Spiny-tailed Lizard.jpg", "page": "https://commons.wikimedia.org/wiki/File:Spiny-tailed_Lizard.jpg", "artist": "Alahamali70", "license": "CC BY 4.0"}, {"src": "img/uromastyx-05.jpg", "title": "File:Uromastyx ocellata qtl1.jpg", "page": "https://commons.wikimedia.org/wiki/File:Uromastyx_ocellata_qtl1.jpg", "artist": "Quartl", "license": "CC BY-SA 3.0"}, {"src": "img/uromastyx-06.jpg", "title": "File:AAB004 Uromastyx hardwickii 763.JPG", "page": "https://commons.wikimedia.org/wiki/File:AAB004_Uromastyx_hardwickii_763.JPG", "artist": "No machine-readable author provided. Nature Loader assumed (based on copyright c", "license": "CC BY-SA 2.5"}, {"src": "img/uromastyx-07.jpg", "title": "File:Agamidae- Uromastyx aegyptia aegyptia (Egyptian Spiny-tailed Lizard) 5.jpg", "page": "https://commons.wikimedia.org/wiki/File:Agamidae-_Uromastyx_aegyptia_aegyptia_(Egyptian_Spiny-tailed_Lizard)_5.jpg", "artist": "Kristof Zyskowski &amp; Yulia Bereshpolova", "license": "CC BY 2.0"}, {"src": "img/waterdragon-00.jpg", "title": "File:Physignathus cocincinus 134241746.jpg", "page": "https://commons.wikimedia.org/wiki/File:Physignathus_cocincinus_134241746.jpg", "artist": "Chris Oldnall", "license": "CC BY-SA 4.0"}, {"src": "img/waterdragon-01.jpg", "title": "File:Physignathus cocincinus 166106879.jpg", "page": "https://commons.wikimedia.org/wiki/File:Physignathus_cocincinus_166106879.jpg", "artist": "Mark Bolnik", "license": "CC BY 4.0"}, {"src": "img/waterdragon-02.jpg", "title": "File:Physignathus cocincinus 59351980.jpg", "page": "https://commons.wikimedia.org/wiki/File:Physignathus_cocincinus_59351980.jpg", "artist": "Daniel Krsek", "license": "CC BY 4.0"}, {"src": "img/waterdragon-03.jpg", "title": "File:Physignathus cocincinus 134241754.jpg", "page": "https://commons.wikimedia.org/wiki/File:Physignathus_cocincinus_134241754.jpg", "artist": "Chris Oldnall", "license": "CC BY-SA 4.0"}, {"src": "img/waterdragon-04.jpg", "title": "File:Physignathus cocincinus 166106903.jpg", "page": "https://commons.wikimedia.org/wiki/File:Physignathus_cocincinus_166106903.jpg", "artist": "Mark Bolnik", "license": "CC BY 4.0"}, {"src": "img/waterdragon-05.jpg", "title": "File:Physignathus cocincinus 68671868.jpg", "page": "https://commons.wikimedia.org/wiki/File:Physignathus_cocincinus_68671868.jpg", "artist": "Oleg Kosterin", "license": "CC BY 4.0"}, {"src": "img/waterdragon-06.jpg", "title": "File:Physignathus cocincinus 166106861.jpg", "page": "https://commons.wikimedia.org/wiki/File:Physignathus_cocincinus_166106861.jpg", "artist": "Mark Bolnik", "license": "CC BY 4.0"}, {"src": "img/ball-00.jpg", "title": "File:Python-regius-kopf-königspython.jpg", "page": "https://commons.wikimedia.org/wiki/File:Python-regius-kopf-k%C3%B6nigspython.jpg", "artist": "Holger Krisp", "license": "CC BY 3.0"}, {"src": "img/ball-01.jpg", "title": "File:Ball python lucy.JPG", "page": "https://commons.wikimedia.org/wiki/File:Ball_python_lucy.JPG", "artist": "HCA (talk)", "license": "CC BY-SA 3.0"}, {"src": "img/ball-02.jpg", "title": "File:Pythonidae Python regius 3.jpg", "page": "https://commons.wikimedia.org/wiki/File:Pythonidae_Python_regius_3.jpg", "artist": "NasserHalaweh", "license": "CC BY-SA 4.0"}, {"src": "img/ball-03.jpg", "title": "File:020240211 Python regius.jpg", "page": "https://commons.wikimedia.org/wiki/File:020240211_Python_regius.jpg", "artist": "Silar", "license": "CC BY-SA 4.0"}, {"src": "img/ball-04.jpg", "title": "File:Python Regius.jpg", "page": "https://commons.wikimedia.org/wiki/File:Python_Regius.jpg", "artist": "Stanislava Kamencayová", "license": "CC BY-SA 4.0"}, {"src": "img/ball-05.jpg", "title": "File:Python regius-- the Royal Python (21376489304).jpg", "page": "https://commons.wikimedia.org/wiki/File:Python_regius--_the_Royal_Python_(21376489304).jpg", "artist": "Dick Culbert from Gibsons, B.C., Canada", "license": "CC BY 2.0"}, {"src": "img/ball-06.jpg", "title": "File:Python regius 1zz.jpg", "page": "https://commons.wikimedia.org/wiki/File:Python_regius_1zz.jpg", "artist": "Photo by David J. Stang", "license": "CC BY-SA 4.0"}, {"src": "img/ball-07.jpg", "title": "File:Ball Python (Python regius) in natural habitat.jpg", "page": "https://commons.wikimedia.org/wiki/File:Ball_Python_(Python_regius)_in_natural_habitat.jpg", "artist": "Oliversamson1", "license": "CC0"}, {"src": "img/ball-08.jpg", "title": "File:D85 3418 Ball Python by Trisorn Triboon.jpg", "page": "https://commons.wikimedia.org/wiki/File:D85_3418_Ball_Python_by_Trisorn_Triboon.jpg", "artist": "Tris T7", "license": "CC BY-SA 4.0"}, {"src": "img/ball-09.jpg", "title": "File:Female Ball python (Python regius).jpg", "page": "https://commons.wikimedia.org/wiki/File:Female_Ball_python_(Python_regius).jpg", "artist": "Squamata55", "license": "CC BY 2.0"}, {"src": "img/ball-10.jpg", "title": "File:Butter champagne ball python at Pinellas County Reptiles, Aug 2020.jpg", "page": "https://commons.wikimedia.org/wiki/File:Butter_champagne_ball_python_at_Pinellas_County_Reptiles,_Aug_2020.jpg", "artist": "MatthewHoobin", "license": "CC BY-SA 4.0"}, {"src": "img/ball-11.jpg", "title": "File:Python regius - ball python.jpg", "page": "https://commons.wikimedia.org/wiki/File:Python_regius_-_ball_python.jpg", "artist": "Brian Gratwicke", "license": "CC BY 2.0"}, {"src": "img/ball-12.jpg", "title": "File:Ball Python (Python regius).jpg", "page": "https://commons.wikimedia.org/wiki/File:Ball_Python_(Python_regius).jpg", "artist": "Seth Cochran", "license": "CC0"}, {"src": "img/ball-13.jpg", "title": "File:Python Regius 2.jpg", "page": "https://commons.wikimedia.org/wiki/File:Python_Regius_2.jpg", "artist": "Namek17", "license": "CC BY-SA 3.0"}, {"src": "img/ball-14.jpg", "title": "File:Ball python (Python regius), Bronx Zoo.jpg", "page": "https://commons.wikimedia.org/wiki/File:Ball_python_(Python_regius),_Bronx_Zoo.jpg", "artist": "MusikAnimal", "license": "CC BY-SA 4.0"}, {"src": "img/ball-15.jpg", "title": "File:Python Regius 1.jpg", "page": "https://commons.wikimedia.org/wiki/File:Python_Regius_1.jpg", "artist": "Namek17", "license": "CC BY-SA 3.0"}, {"src": "img/ball-16.jpg", "title": "File:Python regius in aquarium.jpg", "page": "https://commons.wikimedia.org/wiki/File:Python_regius_in_aquarium.jpg", "artist": "KKPCW（Kyu3）", "license": "CC BY-SA 4.0"}, {"src": "img/ball-17.jpg", "title": "File:Python regius 070731 a.jpg", "page": "https://commons.wikimedia.org/wiki/File:Python_regius_070731_a.jpg", "artist": "Rainer Altenkamp", "license": "CC BY-SA 3.0"}, {"src": "img/ball-18.jpg", "title": "File:Python Regius (163596247).jpeg", "page": "https://commons.wikimedia.org/wiki/File:Python_Regius_(163596247).jpeg", "artist": "Sandro De Sousa", "license": "CC BY 3.0"}, {"src": "img/ball-19.jpg", "title": "File:Ball python (Python regius) at Petco in Jacksonville, Florida.jpg", "page": "https://commons.wikimedia.org/wiki/File:Ball_python_(Python_regius)_at_Petco_in_Jacksonville,_Florida.jpg", "artist": "Moe Epsilon", "license": "CC BY-SA 3.0"}, {"src": "img/corn-00.jpg", "title": "File:Kornnatter (Pantherophis guttatus), Seitenansicht.jpg", "page": "https://commons.wikimedia.org/wiki/File:Kornnatter_(Pantherophis_guttatus),_Seitenansicht.jpg", "artist": "Peter Paplanus", "license": "CC BY 2.0"}, {"src": "img/corn-01.jpg", "title": "File:Corn Snake - Pantherophis guttatus, Sapelo Island, Georgia.jpg", "page": "https://commons.wikimedia.org/wiki/File:Corn_Snake_-_Pantherophis_guttatus,_Sapelo_Island,_Georgia.jpg", "artist": "Judy Gallagher", "license": "CC BY 2.0"}, {"src": "img/corn-02.jpg", "title": "File:Pantherophis guttatus Head.jpg", "page": "https://commons.wikimedia.org/wiki/File:Pantherophis_guttatus_Head.jpg", "artist": "Linda Tanner from Los Osos, California, U.S.A.", "license": "CC BY 2.0"}, {"src": "img/corn-03.jpg", "title": "File:Corn Snake - Pantherophis guttatus, Sapelo Island, Georgia - 16880785352.jpg", "page": "https://commons.wikimedia.org/wiki/File:Corn_Snake_-_Pantherophis_guttatus,_Sapelo_Island,_Georgia_-_16880785352.jpg", "artist": "Judy Gallagher", "license": "CC BY 2.0"}, {"src": "img/corn-04.jpg", "title": "File:Pantherophis guttatus (48325672551).jpg", "page": "https://commons.wikimedia.org/wiki/File:Pantherophis_guttatus_(48325672551).jpg", "artist": "Gilles San Martin from Namur, Belgium", "license": "CC BY-SA 2.0"}, {"src": "img/corn-05.jpg", "title": "File:Cornsnake (Pantherophis guttatus) - Flickr - 2ndPeter.jpg", "page": "https://commons.wikimedia.org/wiki/File:Cornsnake_(Pantherophis_guttatus)_-_Flickr_-_2ndPeter.jpg", "artist": "Peter Paplanus from St. Louis, Missouri", "license": "CC BY 2.0"}, {"src": "img/corn-06.jpg", "title": "File:Kopfprofil Pantherophis guttatus.jpg", "page": "https://commons.wikimedia.org/wiki/File:Kopfprofil_Pantherophis_guttatus.jpg", "artist": "Acapella", "license": "CC BY-SA 3.0"}, {"src": "img/corn-07.jpg", "title": "File:Kornnatter.jpg", "page": "https://commons.wikimedia.org/wiki/File:Kornnatter.jpg", "artist": "Unknown", "license": "Public domain"}, {"src": "img/corn-08.jpg", "title": "File:Pantherophis guttatus-020.jpg", "page": "https://commons.wikimedia.org/wiki/File:Pantherophis_guttatus-020.jpg", "artist": "Danny S.", "license": "CC BY-SA 3.0"}, {"src": "img/corn-09.jpg", "title": "File:Pantherophis guttatus guttatus in Tropicarium-Oceanarium Budapest.JPG", "page": "https://commons.wikimedia.org/wiki/File:Pantherophis_guttatus_guttatus_in_Tropicarium-Oceanarium_Budapest.JPG", "artist": "Хомелка", "license": "CC BY-SA 3.0"}, {"src": "img/corn-10.jpg", "title": "File:Pantherophis guttatus - Nantes.jpg", "page": "https://commons.wikimedia.org/wiki/File:Pantherophis_guttatus_-_Nantes.jpg", "artist": "Selbymay", "license": "CC BY-SA 3.0"}, {"src": "img/king-00.jpg", "title": "File:Californiakingsnake.jpg", "page": "https://commons.wikimedia.org/wiki/File:Californiakingsnake.jpg", "artist": "Calibas", "license": "CC BY-SA 3.0"}, {"src": "img/king-01.jpg", "title": "File:California Kingsnake (Lampropeltis getula californiae).JPG", "page": "https://commons.wikimedia.org/wiki/File:California_Kingsnake_(Lampropeltis_getula_californiae).JPG", "artist": "Connor Long", "license": "CC BY-SA 4.0"}, {"src": "img/king-02.jpg", "title": "File:Lampropeltis californiae im Quarantänebecken.jpg", "page": "https://commons.wikimedia.org/wiki/File:Lampropeltis_californiae_im_Quarant%C3%A4nebecken.jpg", "artist": "Danny S.", "license": "CC BY-SA 4.0"}, {"src": "img/king-03.jpg", "title": "File:Lampropeltis getula californiae - Kalifornische Kettennatter.jpg", "page": "https://commons.wikimedia.org/wiki/File:Lampropeltis_getula_californiae_-_Kalifornische_Kettennatter.jpg", "artist": "5snake5", "license": "CC0"}, {"src": "img/king-04.jpg", "title": "File:Lampropeltis getula californiae 3yrold.jpg", "page": "https://commons.wikimedia.org/wiki/File:Lampropeltis_getula_californiae_3yrold.jpg", "artist": "Guillem", "license": "CC BY-SA 2.5"}, {"src": "img/king-05.jpg", "title": "File:Hul - Lampropeltis getula californiae 1.jpg", "page": "https://commons.wikimedia.org/wiki/File:Hul_-_Lampropeltis_getula_californiae_1.jpg", "artist": "DenesFeri", "license": "CC BY-SA 4.0"}, {"src": "img/milk-00.jpg", "title": "File:Eastern Milk Snake (Lampropeltis triangulum triangulum) (40682943834).jpg", "page": "https://commons.wikimedia.org/wiki/File:Eastern_Milk_Snake_(Lampropeltis_triangulum_triangulum)_(40682943834).jpg", "artist": "Peter Paplanus from St. Louis, Missouri", "license": "CC BY 2.0"}, {"src": "img/milk-01.jpg", "title": "File:Eastern Milksnake (Lampropeltis triangulum) - Flickr - 2ndPeter (2).jpg", "page": "https://commons.wikimedia.org/wiki/File:Eastern_Milksnake_(Lampropeltis_triangulum)_-_Flickr_-_2ndPeter_(2).jpg", "artist": "Peter Paplanus from St. Louis, Missouri", "license": "CC BY 2.0"}, {"src": "img/milk-02.jpg", "title": "File:Lampropeltis triangulum 293880080.jpg", "page": "https://commons.wikimedia.org/wiki/File:Lampropeltis_triangulum_293880080.jpg", "artist": "Shaun Pogacnik", "license": "CC BY 4.0"}, {"src": "img/milk-03.jpg", "title": "File:Eastern Milk Snake (Lampropeltis triangulum triangulum) (42646924152).jpg", "page": "https://commons.wikimedia.org/wiki/File:Eastern_Milk_Snake_(Lampropeltis_triangulum_triangulum)_(42646924152).jpg", "artist": "Peter Paplanus from St. Louis, Missouri", "license": "CC BY 2.0"}, {"src": "img/milk-04.jpg", "title": "File:Eastern Milk Snake (Lampropeltis triangulum triangulum) (27916193197).jpg", "page": "https://commons.wikimedia.org/wiki/File:Eastern_Milk_Snake_(Lampropeltis_triangulum_triangulum)_(27916193197).jpg", "artist": "Will Brown", "license": "CC BY 2.0"}, {"src": "img/milk-05.jpg", "title": "File:Red Milk Snake (Lampropeltis triangulum syspila) (14521230074).jpg", "page": "https://commons.wikimedia.org/wiki/File:Red_Milk_Snake_(Lampropeltis_triangulum_syspila)_(14521230074).jpg", "artist": "Peter Paplanus from St. Louis, Missouri", "license": "CC BY 2.0"}, {"src": "img/milk-06.jpg", "title": "File:Red Milk Snake (Lampropeltis triangulum syspila) (14038551848).jpg", "page": "https://commons.wikimedia.org/wiki/File:Red_Milk_Snake_(Lampropeltis_triangulum_syspila)_(14038551848).jpg", "artist": "Peter Paplanus from St. Louis, Missouri", "license": "CC BY 2.0"}, {"src": "img/milk-07.jpg", "title": "File:Red Milk Snake (Lampropeltis triangulum syspila) (33905210992).jpg", "page": "https://commons.wikimedia.org/wiki/File:Red_Milk_Snake_(Lampropeltis_triangulum_syspila)_(33905210992).jpg", "artist": "Peter Paplanus from St. Louis, Missouri", "license": "CC BY 2.0"}, {"src": "img/milk-08.jpg", "title": "File:Red Milk Snake (Lampropeltis triangulum syspila) (18274863355).jpg", "page": "https://commons.wikimedia.org/wiki/File:Red_Milk_Snake_(Lampropeltis_triangulum_syspila)_(18274863355).jpg", "artist": "Peter Paplanus from St. Louis, Missouri", "license": "CC BY 2.0"}, {"src": "img/milk-09.jpg", "title": "File:Lampropeltis triangulum (Milk Snake), Holyoke, MA (32051000061).jpg", "page": "https://commons.wikimedia.org/wiki/File:Lampropeltis_triangulum_(Milk_Snake),_Holyoke,_MA_(32051000061).jpg", "artist": "Doug McGrady from Warwick, RI, USA", "license": "CC BY 2.0"}, {"src": "img/milk-10.jpg", "title": "File:Lampropeltis triangulum syspila 001.jpg", "page": "https://commons.wikimedia.org/wiki/File:Lampropeltis_triangulum_syspila_001.jpg", "artist": "Psyon", "license": "CC BY-SA 3.0"}, {"src": "img/milk-11.jpg", "title": "File:Lampropeltis triangulum triangulum 2024 06 02 (1) 02.jpg", "page": "https://commons.wikimedia.org/wiki/File:Lampropeltis_triangulum_triangulum_2024_06_02_(1)_02.jpg", "artist": "Lusilier", "license": "CC0"}, {"src": "img/hognose-00.jpg", "title": "File:Heterodon nasicus.jpg", "page": "https://commons.wikimedia.org/wiki/File:Heterodon_nasicus.jpg", "artist": "The original uploader was Dawson at English Wikipedia.", "license": "CC BY-SA 2.5"}, {"src": "img/hognose-01.jpg", "title": "File:Dipsadidae Heterodon nasicus 1.jpg", "page": "https://commons.wikimedia.org/wiki/File:Dipsadidae_Heterodon_nasicus_1.jpg", "artist": "NasserHalaweh", "license": "CC BY-SA 4.0"}, {"src": "img/hognose-02.jpg", "title": "File:Western Hognose Snake (Heterodon nasicus). (c8d8127e-155d-451f-679b-0e236df6f0f2).jpg", "page": "https://commons.wikimedia.org/wiki/File:Western_Hognose_Snake_(Heterodon_nasicus)._(c8d8127e-155d-451f-679b-0e236df6f0f2).jpg", "artist": "NPS Photo", "license": "Public domain"}, {"src": "img/hognose-03.jpg", "title": "File:Western hognose snake heterodon nasicus.jpg", "page": "https://commons.wikimedia.org/wiki/File:Western_hognose_snake_heterodon_nasicus.jpg", "artist": "Stolz Gary M, U.S. Fish and Wildlife Service", "license": "Public domain"}, {"src": "img/hognose-04.jpg", "title": "File:Plains Hognose Snake (Heterodon nasicus) (29833441881).jpg", "page": "https://commons.wikimedia.org/wiki/File:Plains_Hognose_Snake_(Heterodon_nasicus)_(29833441881).jpg", "artist": "Peter Paplanus from St. Louis, Missouri", "license": "CC BY 2.0"}, {"src": "img/hognose-05.jpg", "title": "File:Plains Hognose Snake (Heterodon nasicus) (46054648852).jpg", "page": "https://commons.wikimedia.org/wiki/File:Plains_Hognose_Snake_(Heterodon_nasicus)_(46054648852).jpg", "artist": "Peter Paplanus from St. Louis, Missouri", "license": "CC BY 2.0"}, {"src": "img/hognose-06.jpg", "title": "File:Dusty Hognose Snake (Heterodon nasicus gloydi) (23262712026).jpg", "page": "https://commons.wikimedia.org/wiki/File:Dusty_Hognose_Snake_(Heterodon_nasicus_gloydi)_(23262712026).jpg", "artist": "Peter Paplanus from St. Louis, Missouri", "license": "CC BY 2.0"}, {"src": "img/hognose-07.jpg", "title": "File:Dusty Hognose Snake (Heterodon nasicus gloydi) (10356442354).jpg", "page": "https://commons.wikimedia.org/wiki/File:Dusty_Hognose_Snake_(Heterodon_nasicus_gloydi)_(10356442354).jpg", "artist": "Peter Paplanus from St. Louis, Missouri", "license": "CC BY 2.0"}, {"src": "img/hognose-08.jpg", "title": "File:Iowaherps-heterodon nasicus.jpg", "page": "https://commons.wikimedia.org/wiki/File:Iowaherps-heterodon_nasicus.jpg", "artist": "Don F Becker", "license": "CC BY-SA 4.0"}, {"src": "img/hognose-09.jpg", "title": "File:Western Hognose Snake at Elmwood Park Zoo.JPG", "page": "https://commons.wikimedia.org/wiki/File:Western_Hognose_Snake_at_Elmwood_Park_Zoo.JPG", "artist": "Hshuvaeva", "license": "CC BY-SA 3.0"}, {"src": "img/hognose-10.jpg", "title": "File:Heterodon nasicus Zoo Amneville 28092014 2.jpg", "page": "https://commons.wikimedia.org/wiki/File:Heterodon_nasicus_Zoo_Amneville_28092014_2.jpg", "artist": "Vassil", "license": "CC0"}, {"src": "img/boa-00.jpg", "title": "File:Boa constrictor imperator.jpg", "page": "https://commons.wikimedia.org/wiki/File:Boa_constrictor_imperator.jpg", "artist": "Esteban Alzate", "license": "CC BY-SA 2.5"}, {"src": "img/boa-01.jpg", "title": "File:Boa imperator 97224094.jpg", "page": "https://commons.wikimedia.org/wiki/File:Boa_imperator_97224094.jpg", "artist": "Gerardo Galdamez", "license": "CC BY 4.0"}, {"src": "img/rainbowboa-00.jpg", "title": "File:Epicrates cenchria, Tipnis, 2025 02.jpg", "page": "https://commons.wikimedia.org/wiki/File:Epicrates_cenchria,_Tipnis,_2025_02.jpg", "artist": "Edunavia1", "license": "CC BY-SA 4.0"}, {"src": "img/rainbowboa-01.jpg", "title": "File:Epicrates cenchria 158446770.jpg", "page": "https://commons.wikimedia.org/wiki/File:Epicrates_cenchria_158446770.jpg", "artist": "Vincent A. Vos", "license": "CC BY 4.0"}, {"src": "img/rainbowboa-02.jpg", "title": "File:Rainbow boa (Epicrates cenchria) at night.jpg", "page": "https://commons.wikimedia.org/wiki/File:Rainbow_boa_(Epicrates_cenchria)_at_night.jpg", "artist": "Stijn99", "license": "CC BY-SA 4.0"}, {"src": "img/rainbowboa-03.jpg", "title": "File:Epicrates cenchria 58252676.jpg", "page": "https://commons.wikimedia.org/wiki/File:Epicrates_cenchria_58252676.jpg", "artist": "juan_carlos_caicedo_hernandez", "license": "CC BY 4.0"}, {"src": "img/rainbowboa-04.jpg", "title": "File:Epicrates cenchria 23699843.jpg", "page": "https://commons.wikimedia.org/wiki/File:Epicrates_cenchria_23699843.jpg", "artist": "eamonccorbett", "license": "CC BY 4.0"}, {"src": "img/rainbowboa-05.jpg", "title": "File:Epicrates cenchria 11754091.jpg", "page": "https://commons.wikimedia.org/wiki/File:Epicrates_cenchria_11754091.jpg", "artist": "Julien Renoult", "license": "CC BY 4.0"}, {"src": "img/tarantula-00.jpg", "title": "File:Brachypelma smithi 2009 G09.jpg", "page": "https://commons.wikimedia.org/wiki/File:Brachypelma_smithi_2009_G09.jpg", "artist": "George Chernilevsky", "license": "Public domain"}, {"src": "img/tarantula-01.jpg", "title": "File:ParcPhoenixVivarium.jpg", "page": "https://commons.wikimedia.org/wiki/File:ParcPhoenixVivarium.jpg", "artist": "Gossipguy", "license": "CC0"}, {"src": "img/tarantula-02.jpg", "title": "File:B-smithi.jpg", "page": "https://commons.wikimedia.org/wiki/File:B-smithi.jpg", "artist": "Szakal24, Original uploader was Szakal24 at pl.wikipedia", "license": "CC BY-SA 3.0"}, {"src": "img/tarantula2-00.jpg", "title": "File:Grammostola cf. porteri adult male.jpg", "page": "https://commons.wikimedia.org/wiki/File:Grammostola_cf._porteri_adult_male.jpg", "artist": "Viki", "license": "CC BY-SA 3.0"}, {"src": "img/tarantula2-01.jpg", "title": "File:Spiders Genova - Grammostola rosea 1.jpg", "page": "https://commons.wikimedia.org/wiki/File:Spiders_Genova_-_Grammostola_rosea_1.jpg", "artist": "Syrio", "license": "CC BY-SA 4.0"}, {"src": "img/tarantula2-02.jpg", "title": "File:Spiders Genova - Grammostola rosea 2.jpg", "page": "https://commons.wikimedia.org/wiki/File:Spiders_Genova_-_Grammostola_rosea_2.jpg", "artist": "Syrio", "license": "CC BY-SA 4.0"}, {"src": "img/tarantula2-03.jpg", "title": "File:Grammostola rosea, (Chilean rose tarantula), Natuurmuseum Nijmegen, the Netherlands.JPG", "page": "https://commons.wikimedia.org/wiki/File:Grammostola_rosea,_(Chilean_rose_tarantula),_Natuurmuseum_Nijmegen,_the_Netherlands.JPG", "artist": "Bj.schoenmakers", "license": "CC0"}, {"src": "img/tarantula2-04.jpg", "title": "File:Grammostola rosea III.jpg", "page": "https://commons.wikimedia.org/wiki/File:Grammostola_rosea_III.jpg", "artist": "Fucesa", "license": "CC BY-SA 4.0"}, {"src": "img/tarantula2-05.jpg", "title": "File:Grammostola rosea IV.jpg", "page": "https://commons.wikimedia.org/wiki/File:Grammostola_rosea_IV.jpg", "artist": "Fucesa", "license": "CC BY-SA 4.0"}, {"src": "img/scorpion-00.jpg", "title": "File:Pandinus imperator 2009 G1.jpg", "page": "https://commons.wikimedia.org/wiki/File:Pandinus_imperator_2009_G1.jpg", "artist": "George Chernilevsky", "license": "Public domain"}, {"src": "img/scorpion-01.jpg", "title": "File:Emperor scorpion or Imperial scorpion (Pandinus imperator).jpg", "page": "https://commons.wikimedia.org/wiki/File:Emperor_scorpion_or_Imperial_scorpion_(Pandinus_imperator).jpg", "artist": "Mike Baird", "license": "CC BY 2.0"}, {"src": "img/scorpion-02.jpg", "title": "File:Pandinus imperator 344669760.jpg", "page": "https://commons.wikimedia.org/wiki/File:Pandinus_imperator_344669760.jpg", "artist": "Jan Ebr &amp; Ivana Ebrová", "license": "CC BY 4.0"}, {"src": "img/scorpion-03.jpg", "title": "File:Pandinus imperator 344669743.jpg", "page": "https://commons.wikimedia.org/wiki/File:Pandinus_imperator_344669743.jpg", "artist": "Jan Ebr &amp; Ivana Ebrová", "license": "CC BY 4.0"}, {"src": "img/scorpion-04.jpg", "title": "File:Pandinus imperator 173714645.jpg", "page": "https://commons.wikimedia.org/wiki/File:Pandinus_imperator_173714645.jpg", "artist": "Jean-Paul Boerekamps", "license": "CC0"}, {"src": "img/scorpion-05.jpg", "title": "File:Pandinus imperator 206381130.jpg", "page": "https://commons.wikimedia.org/wiki/File:Pandinus_imperator_206381130.jpg", "artist": "Lucky Atabo Okpanachi", "license": "CC BY 4.0"}, {"src": "img/scorpion-06.jpg", "title": "File:Pandinus imperator 20793583.jpg", "page": "https://commons.wikimedia.org/wiki/File:Pandinus_imperator_20793583.jpg", "artist": "Evgeniy Meyke", "license": "CC BY 4.0"}, {"src": "img/scorpion-07.jpg", "title": "File:Pandinus imperator 173714652.jpg", "page": "https://commons.wikimedia.org/wiki/File:Pandinus_imperator_173714652.jpg", "artist": "Jean-Paul Boerekamps", "license": "CC0"}, {"src": "img/terrarium-00.jpg", "title": "File:Bdg zoo terrarium 28 01-2015.jpg", "page": "https://commons.wikimedia.org/wiki/File:Bdg_zoo_terrarium_28_01-2015.jpg", "artist": "Pit1233", "license": "CC0"}, {"src": "img/terrarium-01.jpg", "title": "File:Bdg zoo terrarium 8 01-2015.jpg", "page": "https://commons.wikimedia.org/wiki/File:Bdg_zoo_terrarium_8_01-2015.jpg", "artist": "Pit1233", "license": "CC0"}, {"src": "img/terrarium-02.jpg", "title": "File:Bdg zoo terrarium 1 01-2015.jpg", "page": "https://commons.wikimedia.org/wiki/File:Bdg_zoo_terrarium_1_01-2015.jpg", "artist": "Pit1233", "license": "CC0"}, {"src": "img/terrarium-03.jpg", "title": "File:Bdg zoo terrarium 9 01-2015.jpg", "page": "https://commons.wikimedia.org/wiki/File:Bdg_zoo_terrarium_9_01-2015.jpg", "artist": "Pit1233", "license": "CC0"}, {"src": "img/terrarium-04.jpg", "title": "File:Bdg zoo terrarium 5 01-2015.jpg", "page": "https://commons.wikimedia.org/wiki/File:Bdg_zoo_terrarium_5_01-2015.jpg", "artist": "Pit1233", "license": "CC0"}, {"src": "img/terrarium-05.jpg", "title": "File:Bdg zoo terrarium 10 01-2015.jpg", "page": "https://commons.wikimedia.org/wiki/File:Bdg_zoo_terrarium_10_01-2015.jpg", "artist": "Pit1233", "license": "CC0"}, {"src": "img/vivarium-00.jpg", "title": "File:Kryptopterus vitreolus (Vivarium Darmstadt).jpg", "page": "https://commons.wikimedia.org/wiki/File:Kryptopterus_vitreolus_(Vivarium_Darmstadt).jpg", "artist": "4028mdk09", "license": "CC BY-SA 3.0"}, {"src": "img/meshcage-00.jpg", "title": "File:A pet chameleon in cage.jpg", "page": "https://commons.wikimedia.org/wiki/File:A_pet_chameleon_in_cage.jpg", "artist": "Dquai", "license": "CC BY-SA 4.0"}, {"src": "img/uvb-00.jpg", "title": "File:Blue Ultraviolet Light Lamp.jpg", "page": "https://commons.wikimedia.org/wiki/File:Blue_Ultraviolet_Light_Lamp.jpg", "artist": "epSos.de", "license": "CC BY 2.0"}, {"src": "img/heatlamp-00.jpg", "title": "File:Incandescent bulb lamp glowing on a desk at night.jpg", "page": "https://commons.wikimedia.org/wiki/File:Incandescent_bulb_lamp_glowing_on_a_desk_at_night.jpg", "artist": "Sihyeon0621", "license": "CC BY-SA 4.0"}, {"src": "img/heatlamp-01.jpg", "title": "File:Kohlefadenrotlichtlampe.jpg", "page": "https://commons.wikimedia.org/wiki/File:Kohlefadenrotlichtlampe.jpg", "artist": "Ulfbastel", "license": "Public domain"}, {"src": "img/heatmat-00.jpg", "title": "File:Electric underfloor heating mats.jpg", "page": "https://commons.wikimedia.org/wiki/File:Electric_underfloor_heating_mats.jpg", "artist": "Ian Haycox", "license": "CC BY-SA 4.0"}, {"src": "img/heatmat-01.jpg", "title": "File:Underfloor heating cable laid in bathroom, Stone County Missouri, 2026-07-24.jpg", "page": "https://commons.wikimedia.org/wiki/File:Underfloor_heating_cable_laid_in_bathroom,_Stone_County_Missouri,_2026-07-24.jpg", "artist": "K&amp;K Data Service Inc.", "license": "CC BY 4.0"}, {"src": "img/thermostat-00.jpg", "title": "File:Robertshaw Non-Programmable Digital Thermostat.JPG", "page": "https://commons.wikimedia.org/wiki/File:Robertshaw_Non-Programmable_Digital_Thermostat.JPG", "artist": "Ente75", "license": "CC0"}, {"src": "img/thermostat-01.jpg", "title": "File:Honeywell E528 Smart Digital Thermostat.jpg", "page": "https://commons.wikimedia.org/wiki/File:Honeywell_E528_Smart_Digital_Thermostat.jpg", "artist": "TaurusEmerald", "license": "CC BY-SA 4.0"}, {"src": "img/thermostat-02.jpg", "title": "File:Room Thermostat Vaillant.jpg", "page": "https://commons.wikimedia.org/wiki/File:Room_Thermostat_Vaillant.jpg", "artist": "Andy Butkaj", "license": "CC BY 2.0"}, {"src": "img/thermostat-03.jpg", "title": "File:Hunter Non-Programmable Digital Thermostat.jpg", "page": "https://commons.wikimedia.org/wiki/File:Hunter_Non-Programmable_Digital_Thermostat.jpg", "artist": "Ente75", "license": "CC0"}, {"src": "img/thermostat-04.jpg", "title": "File:Sunvic thermostat.jpg", "page": "https://commons.wikimedia.org/wiki/File:Sunvic_thermostat.jpg", "artist": "SpicyPhoto", "license": "CC0"}, {"src": "img/crickets-00.jpg", "title": "File:Acheta domesticus head 16121.jpg", "page": "https://commons.wikimedia.org/wiki/File:Acheta_domesticus_head_16121.jpg", "artist": "Carlos Valenzuela", "license": "CC BY-SA 4.0"}, {"src": "img/crickets-01.jpg", "title": "File:Acheta domesticus head161217 2.jpg", "page": "https://commons.wikimedia.org/wiki/File:Acheta_domesticus_head161217_2.jpg", "artist": "Carlos Valenzuela", "license": "CC BY-SA 4.0"}, {"src": "img/crickets-02.jpg", "title": "File:Acheta domesticus (common house cricket).jpg", "page": "https://commons.wikimedia.org/wiki/File:Acheta_domesticus_(common_house_cricket).jpg", "artist": "Matthew Lindsey", "license": "CC BY 2.0"}, {"src": "img/crickets-03.jpg", "title": "File:Acheta domesticus 0zz.jpg", "page": "https://commons.wikimedia.org/wiki/File:Acheta_domesticus_0zz.jpg", "artist": "Photo by David J. Stang", "license": "CC BY-SA 4.0"}, {"src": "img/crickets-04.jpg", "title": "File:House Cricket (Acheta domesticus).jpg", "page": "https://commons.wikimedia.org/wiki/File:House_Cricket_(Acheta_domesticus).jpg", "artist": "Kiloueka", "license": "CC0"}, {"src": "img/crickets-05.jpg", "title": "File:Acheta domesticus 1 1.jpg", "page": "https://commons.wikimedia.org/wiki/File:Acheta_domesticus_1_1.jpg", "artist": "Franziska Walz", "license": "CC BY-SA 3.0"}, {"src": "img/crickets-06.jpg", "title": "File:Acheta domesticus, adultes Weibchen.jpg", "page": "https://commons.wikimedia.org/wiki/File:Acheta_domesticus,_adultes_Weibchen.jpg", "artist": "Geyersberg, Professor emeritus Hans Schneider", "license": "CC BY-SA 3.0"}, {"src": "img/crickets-07.jpg", "title": "File:Acheta domesticus, zirpendes Männchen.jpg", "page": "https://commons.wikimedia.org/wiki/File:Acheta_domesticus,_zirpendes_M%C3%A4nnchen.jpg", "artist": "Geyersberg, Professor emeritus Hans Schneider", "license": "CC BY-SA 3.0"}, {"src": "img/crickets-08.jpg", "title": "File:Acheta domesticus 1.JPG", "page": "https://commons.wikimedia.org/wiki/File:Acheta_domesticus_1.JPG", "artist": "Aiwok", "license": "CC BY-SA 3.0"}, {"src": "img/crickets-09.jpg", "title": "File:Acheta domesticus 4 2.jpg", "page": "https://commons.wikimedia.org/wiki/File:Acheta_domesticus_4_2.jpg", "artist": "Franziska Walz", "license": "CC BY-SA 3.0"}, {"src": "img/crickets-10.jpg", "title": "File:Acheta domesticus male 9243.jpg", "page": "https://commons.wikimedia.org/wiki/File:Acheta_domesticus_male_9243.jpg", "artist": "G.-U. Tolkiehn", "license": "CC BY 2.5"}, {"src": "img/mealworms-00.jpg", "title": "File:Tenebrio molitor larvae FV3.jpg", "page": "https://commons.wikimedia.org/wiki/File:Tenebrio_molitor_larvae_FV3.jpg", "artist": "Fvukajlovic", "license": "CC BY 4.0"}, {"src": "img/mealworms-01.jpg", "title": "File:Tenebrio molitor larvae FV2.jpg", "page": "https://commons.wikimedia.org/wiki/File:Tenebrio_molitor_larvae_FV2.jpg", "artist": "Fvukajlovic", "license": "CC BY 4.0"}, {"src": "img/mealworms-02.jpg", "title": "File:Tenebrio molitor larvae FV.jpg", "page": "https://commons.wikimedia.org/wiki/File:Tenebrio_molitor_larvae_FV.jpg", "artist": "Fvukajlovic", "license": "CC BY 4.0"}, {"src": "img/mealworms-03.jpg", "title": "File:\"+arya+\" Tenebrio molitor ꦲꦸꦭꦼꦂ ꦏꦤ꧀ꦢꦁ ulat kandang 2020 0.jpg", "page": "https://commons.wikimedia.org/wiki/File:%22%2Barya%2B%22_Tenebrio_molitor_%EA%A6%B2%EA%A6%B8%EA%A6%AD%EA%A6%BC%EA%A6%82_%EA%A6%8F%EA%A6%A4%EA%A7%80%EA%A6%A2%EA%A6%81_ulat_kandang_2020_0.jpg", "artist": "Aris riyanto", "license": "CC BY-SA 4.0"}, {"src": "img/mealworms-04.jpg", "title": "File:\"+arya+\" Tenebrio molitor ꦲꦸꦭꦼꦂ ꦏꦤ꧀ꦢꦁ ulat kandang 2020 1.jpg", "page": "https://commons.wikimedia.org/wiki/File:%22%2Barya%2B%22_Tenebrio_molitor_%EA%A6%B2%EA%A6%B8%EA%A6%AD%EA%A6%BC%EA%A6%82_%EA%A6%8F%EA%A6%A4%EA%A7%80%EA%A6%A2%EA%A6%81_ulat_kandang_2020_1.jpg", "artist": "Aris riyanto", "license": "CC BY-SA 4.0"}, {"src": "img/mealworms-05.jpg", "title": "File:Mealworm Bettle Tenebrio molitor Adult pupal stage 02.jpg", "page": "https://commons.wikimedia.org/wiki/File:Mealworm_Bettle_Tenebrio_molitor_Adult_pupal_stage_02.jpg", "artist": "ImagePerson", "license": "CC BY 4.0"}, {"src": "img/mealworms-06.jpg", "title": "File:Mealworm BeetleTenebrio molitor larvae, pupae, molted skin 02.jpg", "page": "https://commons.wikimedia.org/wiki/File:Mealworm_BeetleTenebrio_molitor_larvae,_pupae,_molted_skin_02.jpg", "artist": "ImagePerson", "license": "CC BY 4.0"}, {"src": "img/mealworms-07.jpg", "title": "File:Mealworm Beetle Tenebrio molitor larva 04.jpg", "page": "https://commons.wikimedia.org/wiki/File:Mealworm_Beetle_Tenebrio_molitor_larva_04.jpg", "artist": "ImagePerson", "license": "CC BY 4.0"}, {"src": "img/mealworms-08.jpg", "title": "File:Mealworm BeetleTenebrio molitor larvae, pupae, molted skin 03.jpg", "page": "https://commons.wikimedia.org/wiki/File:Mealworm_BeetleTenebrio_molitor_larvae,_pupae,_molted_skin_03.jpg", "artist": "ImagePerson", "license": "CC BY 4.0"}, {"src": "img/mealworms-09.jpg", "title": "File:Mealworm BeetleTenebrio molitor larvae, pupae, molted skin 01.jpg", "page": "https://commons.wikimedia.org/wiki/File:Mealworm_BeetleTenebrio_molitor_larvae,_pupae,_molted_skin_01.jpg", "artist": "ImagePerson", "license": "CC BY 4.0"}, {"src": "img/mealworms-10.jpg", "title": "File:Mealworm BeetleTenebrio molitor larvae, pupae, molted skin 04.jpg", "page": "https://commons.wikimedia.org/wiki/File:Mealworm_BeetleTenebrio_molitor_larvae,_pupae,_molted_skin_04.jpg", "artist": "ImagePerson", "license": "CC BY 4.0"}, {"src": "img/mealworms-11.jpg", "title": "File:Mealworm Bettle Tenebrio molitor pupal stage 01.jpg", "page": "https://commons.wikimedia.org/wiki/File:Mealworm_Bettle_Tenebrio_molitor_pupal_stage_01.jpg", "artist": "ImagePerson", "license": "CC BY 4.0"}, {"src": "img/mealworms-12.jpg", "title": "File:Mealworm Bettle Tenebrio molitor Adult pupal stage 05.jpg", "page": "https://commons.wikimedia.org/wiki/File:Mealworm_Bettle_Tenebrio_molitor_Adult_pupal_stage_05.jpg", "artist": "ImagePerson", "license": "CC BY 4.0"}, {"src": "img/dubia-00.jpg", "title": "File:Blaptica dubia - various.jpg", "page": "https://commons.wikimedia.org/wiki/File:Blaptica_dubia_-_various.jpg", "artist": "Drägüs", "license": "CC BY-SA 3.0"}, {"src": "img/dubia-01.jpg", "title": "File:Blaptica dubia synchronous undress.jpg", "page": "https://commons.wikimedia.org/wiki/File:Blaptica_dubia_synchronous_undress.jpg", "artist": "Kolonie BLABERUS", "license": "CC BY-SA 4.0"}, {"src": "img/dubia-02.jpg", "title": "File:Blaptica dubia požírá svlek.jpg", "page": "https://commons.wikimedia.org/wiki/File:Blaptica_dubia_po%C5%BE%C3%ADr%C3%A1_svlek.jpg", "artist": "Kolonie BLABERUS", "license": "CC BY-SA 4.0"}, {"src": "img/dubia-03.jpg", "title": "File:Blaptica dubia (Serville, 1839).jpg", "page": "https://commons.wikimedia.org/wiki/File:Blaptica_dubia_(Serville,_1839).jpg", "artist": "Gordon lai (0101a)", "license": "CC BY-SA 4.0"}, {"src": "img/dubia-04.jpg", "title": "File:Blaptica dubia mating - male left, female right.jpg", "page": "https://commons.wikimedia.org/wiki/File:Blaptica_dubia_mating_-_male_left,_female_right.jpg", "artist": "Kolonie BLABERUS", "license": "CC BY-SA 4.0"}, {"src": "img/dubia-05.jpg", "title": "File:Blaptica dubia - female.JPG", "page": "https://commons.wikimedia.org/wiki/File:Blaptica_dubia_-_female.JPG", "artist": "Drägüs", "license": "CC BY-SA 3.0"}, {"src": "img/locust-00.jpg", "title": "File:Locusta-migratoria-wanderheuschrecke.jpg", "page": "https://commons.wikimedia.org/wiki/File:Locusta-migratoria-wanderheuschrecke.jpg", "artist": "Holger Krisp", "license": "CC BY 3.0"}, {"src": "img/locust-01.jpg", "title": "File:Locusta migratoria qtl1.jpg", "page": "https://commons.wikimedia.org/wiki/File:Locusta_migratoria_qtl1.jpg", "artist": "Quartl", "license": "CC BY-SA 3.0"}, {"src": "img/locust-02.jpg", "title": "File:Wanderheuschrecke-03.jpg", "page": "https://commons.wikimedia.org/wiki/File:Wanderheuschrecke-03.jpg", "artist": "Jonathan Hornung", "license": "CC BY-SA 2.0 de"}, {"src": "img/locust-03.jpg", "title": "File:Locusta migratoria mating.jpg", "page": "https://commons.wikimedia.org/wiki/File:Locusta_migratoria_mating.jpg", "artist": "Phonon.b", "license": "CC BY-SA 4.0"}, {"src": "img/locust-04.jpg", "title": "File:Locusta migratoria Lucca 01.jpg", "page": "https://commons.wikimedia.org/wiki/File:Locusta_migratoria_Lucca_01.jpg", "artist": "Syrio", "license": "CC BY-SA 4.0"}, {"src": "img/locust-05.jpg", "title": "File:Locusta migratoria Lucca 02.jpg", "page": "https://commons.wikimedia.org/wiki/File:Locusta_migratoria_Lucca_02.jpg", "artist": "Syrio", "license": "CC BY-SA 4.0"}, {"src": "img/locust-06.jpg", "title": "File:Locusta migratoria migratoria typical.jpg", "page": "https://commons.wikimedia.org/wiki/File:Locusta_migratoria_migratoria_typical.jpg", "artist": "Eastolany", "license": "CC BY-SA 4.0"}, {"src": "img/locust-07.jpg", "title": "File:Locusta migratoria migratoria black morph.jpg", "page": "https://commons.wikimedia.org/wiki/File:Locusta_migratoria_migratoria_black_morph.jpg", "artist": "Eastolany", "license": "CC BY-SA 4.0"}, {"src": "img/locust-08.jpg", "title": "File:Locusta migratoria - Szarańcza wędrowna - Migratory locust (35986877255).jpg", "page": "https://commons.wikimedia.org/wiki/File:Locusta_migratoria_-_Szara%C5%84cza_w%C4%99drowna_-_Migratory_locust_(35986877255).jpg", "artist": "Marta Boroń", "license": "CC BY 2.0"}, {"src": "img/locust-09.jpg", "title": "File:Locusta migratoria - Szarańcza wędrowna - Migratory locust (35986876745).jpg", "page": "https://commons.wikimedia.org/wiki/File:Locusta_migratoria_-_Szara%C5%84cza_w%C4%99drowna_-_Migratory_locust_(35986876745).jpg", "artist": "Marta Boroń", "license": "CC BY 2.0"}, {"src": "img/superworm-00.jpg", "title": "File:Zophobas morio larva - top (aka).jpg", "page": "https://commons.wikimedia.org/wiki/File:Zophobas_morio_larva_-_top_(aka).jpg", "artist": "André Karwath aka Aka", "license": "CC BY-SA 2.5"}, {"src": "img/superworm-01.jpg", "title": "File:Zophobas morio ofter molting.jpg", "page": "https://commons.wikimedia.org/wiki/File:Zophobas_morio_ofter_molting.jpg", "artist": "Buskopan0", "license": "CC BY-SA 4.0"}, {"src": "img/coco-00.jpg", "title": "File:Coir fibery.jpg", "page": "https://commons.wikimedia.org/wiki/File:Coir_fibery.jpg", "artist": "Fotokannan", "license": "CC BY-SA 3.0"}, {"src": "img/coco-01.jpg", "title": "File:Coir doormats coconut products Philippines1.jpg", "page": "https://commons.wikimedia.org/wiki/File:Coir_doormats_coconut_products_Philippines1.jpg", "artist": "Unknown", "license": "CC BY-SA 4.0"}, {"src": "img/coco-02.jpg", "title": "File:Coconut coir fibres peat ropework Philippines11.jpg", "page": "https://commons.wikimedia.org/wiki/File:Coconut_coir_fibres_peat_ropework_Philippines11.jpg", "artist": "Unknown", "license": "CC BY-SA 4.0"}, {"src": "img/coco-03.jpg", "title": "File:Coir doormats coconut products Philippines texture2.jpg", "page": "https://commons.wikimedia.org/wiki/File:Coir_doormats_coconut_products_Philippines_texture2.jpg", "artist": "Unknown", "license": "CC BY-SA 4.0"}, {"src": "img/coco-04.jpg", "title": "File:Coir doormats coconut products Philippines vertical3.jpg", "page": "https://commons.wikimedia.org/wiki/File:Coir_doormats_coconut_products_Philippines_vertical3.jpg", "artist": "Unknown", "license": "CC BY-SA 4.0"}, {"src": "img/sand-00.jpg", "title": "File:Smooth orange Arabian desert sand seamless ground texture.jpg", "page": "https://commons.wikimedia.org/wiki/File:Smooth_orange_Arabian_desert_sand_seamless_ground_texture.jpg", "artist": "Sisters.seamless", "license": "CC0"}, {"src": "img/sand-01.jpg", "title": "File:Desert Sand, മരുഭൂമിയിലെ മണൽ.JPG", "page": "https://commons.wikimedia.org/wiki/File:Desert_Sand,_%E0%B4%AE%E0%B4%B0%E0%B5%81%E0%B4%AD%E0%B5%82%E0%B4%AE%E0%B4%BF%E0%B4%AF%E0%B4%BF%E0%B4%B2%E0%B5%86_%E0%B4%AE%E0%B4%A3%E0%B5%BD.JPG", "artist": "കാക്കര", "license": "CC BY-SA 3.0"}, {"src": "img/sand-02.jpg", "title": "File:WEST DESERT SAND CRACKS.jpg", "page": "https://commons.wikimedia.org/wiki/File:WEST_DESERT_SAND_CRACKS.jpg", "artist": "me ... hesham farouk ragab", "license": "CC BY-SA 4.0"}, {"src": "img/sand-03.jpg", "title": "File:In the desert. - Flickr - gailhampshire.jpg", "page": "https://commons.wikimedia.org/wiki/File:In_the_desert._-_Flickr_-_gailhampshire.jpg", "artist": "gailhampshire from Cradley, Malvern, U.K", "license": "CC BY 2.0"}, {"src": "img/sand-04.jpg", "title": "File:SIWA SAND TEXURE.jpg", "page": "https://commons.wikimedia.org/wiki/File:SIWA_SAND_TEXURE.jpg", "artist": "Hesham Farouk Ragab", "license": "CC BY-SA 4.0"}, {"src": "img/branch-00.jpg", "title": "File:Tronc d'arbre aux Aresquiers.jpg", "page": "https://commons.wikimedia.org/wiki/File:Tronc_d%27arbre_aux_Aresquiers.jpg", "artist": "Christian Ferrer", "license": "CC BY 4.0"}, {"src": "img/branch-01.jpg", "title": "File:Bregenz-Wocherhafen-lake constance-driftwood-01ASD.jpg", "page": "https://commons.wikimedia.org/wiki/File:Bregenz-Wocherhafen-lake_constance-driftwood-01ASD.jpg", "artist": "Asurnipal", "license": "CC BY-SA 4.0"}, {"src": "img/branch-02.jpg", "title": "File:Bregenz-Wocherhafen-autumn-driftwood-07ASD.jpg", "page": "https://commons.wikimedia.org/wiki/File:Bregenz-Wocherhafen-autumn-driftwood-07ASD.jpg", "artist": "Asurnipal", "license": "CC BY-SA 4.0"}, {"src": "img/moss-00.jpg", "title": "File:Nationaal Park Drents-Friese Wold. Locatie Fochteloërveen 01-09-2020. (actm.) 13.jpg", "page": "https://commons.wikimedia.org/wiki/File:Nationaal_Park_Drents-Friese_Wold._Locatie_Fochtelo%C3%ABrveen_01-09-2020._(actm.)_13.jpg", "artist": "Agnes Monkelbaan", "license": "CC BY-SA 4.0"}, {"src": "img/moss-01.jpg", "title": "File:Sphagnum moss in Panthertown Valley bog.jpg", "page": "https://commons.wikimedia.org/wiki/File:Sphagnum_moss_in_Panthertown_Valley_bog.jpg", "artist": "NC Wetlands from Raleigh, NC", "license": "CC0"}, {"src": "img/moss-02.jpg", "title": "File:Red bog-moss (Sphagnum capillifolium) - geograph.org.uk - 1563081.jpg", "page": "https://commons.wikimedia.org/wiki/File:Red_bog-moss_(Sphagnum_capillifolium)_-_geograph.org.uk_-_1563081.jpg", "artist": "Andrew Curtis", "license": "CC BY-SA 2.0"}, {"src": "img/plants-00.jpg", "title": "File:Epipremnum aureum 31082012.jpg", "page": "https://commons.wikimedia.org/wiki/File:Epipremnum_aureum_31082012.jpg", "artist": "Joydeep", "license": "CC BY-SA 3.0"}, {"src": "img/plants-01.jpg", "title": "File:Epipremnum aureum kz01.jpg", "page": "https://commons.wikimedia.org/wiki/File:Epipremnum_aureum_kz01.jpg", "artist": "Krzysztof Ziarnek, Kenraiz", "license": "CC BY-SA 4.0"}, {"src": "img/plants-02.jpg", "title": "File:Money Plant (Epipremnum aureum) 4.jpg", "page": "https://commons.wikimedia.org/wiki/File:Money_Plant_(Epipremnum_aureum)_4.jpg", "artist": "Mokkie", "license": "CC BY-SA 3.0"}, {"src": "img/plants-03.jpg", "title": "File:Epipremnum-aureum-poznan-palmiarnia-abrimaal.jpg", "page": "https://commons.wikimedia.org/wiki/File:Epipremnum-aureum-poznan-palmiarnia-abrimaal.jpg", "artist": "Marek Argent (Abrimaal)", "license": "CC BY-SA 3.0"}, {"src": "img/plants-04.jpg", "title": "File:Epipremnum aureum (silver vine).jpg", "page": "https://commons.wikimedia.org/wiki/File:Epipremnum_aureum_(silver_vine).jpg", "artist": "Filo gèn'", "license": "CC BY-SA 4.0"}, {"src": "img/plants-05.jpg", "title": "File:Epipremnum aureum 20210507 152551 01.jpg", "page": "https://commons.wikimedia.org/wiki/File:Epipremnum_aureum_20210507_152551_01.jpg", "artist": "Satirdan kahraman", "license": "CC BY-SA 4.0"}, {"src": "img/plants-06.jpg", "title": "File:Epipremnum aureum kz04.jpg", "page": "https://commons.wikimedia.org/wiki/File:Epipremnum_aureum_kz04.jpg", "artist": "Krzysztof Ziarnek, Kenraiz", "license": "CC BY-SA 4.0"}, {"src": "img/plants-07.jpg", "title": "File:Epipremnum aureum kz06.jpg", "page": "https://commons.wikimedia.org/wiki/File:Epipremnum_aureum_kz06.jpg", "artist": "Krzysztof Ziarnek, Kenraiz", "license": "CC BY-SA 4.0"}, {"src": "img/plants-08.jpg", "title": "File:Epipremnum aureum (pothos).jpg", "page": "https://commons.wikimedia.org/wiki/File:Epipremnum_aureum_(pothos).jpg", "artist": "Filo gèn'", "license": "CC BY-SA 4.0"}, {"src": "img/hygro-00.jpg", "title": "File:Hygrometer USSR 1987.jpg", "page": "https://commons.wikimedia.org/wiki/File:Hygrometer_USSR_1987.jpg", "artist": "Schekinov Alexey Victorovich", "license": "Public domain"}, {"src": "img/hygro-01.jpg", "title": "File:Hygrometer-MHS 449-P7220181-gradient.jpg", "page": "https://commons.wikimedia.org/wiki/File:Hygrometer-MHS_449-P7220181-gradient.jpg", "artist": "Rama", "license": "CC BY-SA 3.0 fr"}, {"src": "img/hygro-02.jpg", "title": "File:Hygrometer-MHS 449-P7220181-white.jpg", "page": "https://commons.wikimedia.org/wiki/File:Hygrometer-MHS_449-P7220181-white.jpg", "artist": "Rama", "license": "CC BY-SA 3.0 fr"}, {"src": "img/hygro-03.jpg", "title": "File:Absorptionshygrometer (Firma Barigo).jpg", "page": "https://commons.wikimedia.org/wiki/File:Absorptionshygrometer_(Firma_Barigo).jpg", "artist": "Rhetos", "license": "CC0"}, {"src": "img/hygro-04.jpg", "title": "File:001 2015 06 08 Messungen.jpg", "page": "https://commons.wikimedia.org/wiki/File:001_2015_06_08_Messungen.jpg", "artist": "Friedrich Haag", "license": "CC BY-SA 4.0"}, {"src": "img/tongs-00.jpg", "title": "File:Functional ceramic.jpg", "page": "https://commons.wikimedia.org/wiki/File:Functional_ceramic.jpg", "artist": "Giovanna Canu, CNR-ICMATE Giovanna 27", "license": "CC BY 4.0"}, {"src": "img/tongs-01.jpg", "title": "File:Unknown artist - Tweezers - 1920.90 - Cleveland Museum of Art.jpg", "page": "https://commons.wikimedia.org/wiki/File:Unknown_artist_-_Tweezers_-_1920.90_-_Cleveland_Museum_of_Art.jpg", "artist": "Unknown", "license": "CC0"}, {"src": "img/tongs-02.jpg", "title": "File:Tweezers MET DP240501.jpg", "page": "https://commons.wikimedia.org/wiki/File:Tweezers_MET_DP240501.jpg", "artist": "Unknown", "license": "CC0"}, {"src": "img/sprayer-00.jpg", "title": "File:SPRAY BOTTLE.jpg", "page": "https://commons.wikimedia.org/wiki/File:SPRAY_BOTTLE.jpg", "artist": "Kaviyadharshini Selvakumar", "license": "CC BY-SA 4.0"}, {"src": "img/sprayer-01.jpg", "title": "File:Spruehflasche 02 (fcm).jpg", "page": "https://commons.wikimedia.org/wiki/File:Spruehflasche_02_(fcm).jpg", "artist": "Photograph:  Frank C. Müller, Frankfurt am Main", "license": "CC BY-SA 4.0"}, {"src": "img/sprayer-02.jpg", "title": "File:Window cleaner and an empty spray bottle.jpg", "page": "https://commons.wikimedia.org/wiki/File:Window_cleaner_and_an_empty_spray_bottle.jpg", "artist": "Corn cheese", "license": "CC BY 4.0"}, {"src": "img/sprayer-03.jpg", "title": "File:Plastic bottle with hose spray attachment.jpg", "page": "https://commons.wikimedia.org/wiki/File:Plastic_bottle_with_hose_spray_attachment.jpg", "artist": "Rlsheehan", "license": "CC BY-SA 4.0"}, {"src": "img/sprayer-04.jpg", "title": "File:Spray bottle.jpg", "page": "https://commons.wikimedia.org/wiki/File:Spray_bottle.jpg", "artist": "Hustvedt", "license": "CC BY-SA 3.0"}, {"src": "img/calcium-00.jpg", "title": "File:Extracting-and-producing-calcium-carbonate.jpg", "page": "https://commons.wikimedia.org/wiki/File:Extracting-and-producing-calcium-carbonate.jpg", "artist": "Kyungho Park, Sangju Jun, Daehyeon Kim", "license": "CC BY 4.0"}, {"src": "img/calcium-01.jpg", "title": "File:Kreide als Pulverlackrohstoff.JPG", "page": "https://commons.wikimedia.org/wiki/File:Kreide_als_Pulverlackrohstoff.JPG", "artist": "Hardcoreraveman", "license": "Public domain"}, {"src": "img/terrarium-06.jpg", "title": "File:Petco reptiles in a terrarium.jpg", "page": "https://commons.wikimedia.org/wiki/File:Petco_reptiles_in_a_terrarium.jpg", "artist": "Hellacious2", "license": "CC BY-SA 4.0"}, {"src": "img/terrarium-07.jpg", "title": "File:Bdg zoo terrarium 3 01-2015.jpg", "page": "https://commons.wikimedia.org/wiki/File:Bdg_zoo_terrarium_3_01-2015.jpg", "artist": "Pit1233", "license": "CC0"}, {"src": "img/terrarium-08.jpg", "title": "File:Bdg zoo terrarium 6 01-2015.jpg", "page": "https://commons.wikimedia.org/wiki/File:Bdg_zoo_terrarium_6_01-2015.jpg", "artist": "Pit1233", "license": "CC0"}, {"src": "img/terrarium-09.jpg", "title": "File:Bdg zoo terrarium 15 01-2015.jpg", "page": "https://commons.wikimedia.org/wiki/File:Bdg_zoo_terrarium_15_01-2015.jpg", "artist": "Pit1233", "license": "CC0"}, {"src": "img/terrarium-10.jpg", "title": "File:Bdg zoo terrarium 17 01-2015.jpg", "page": "https://commons.wikimedia.org/wiki/File:Bdg_zoo_terrarium_17_01-2015.jpg", "artist": "Pit1233", "license": "CC0"}, {"src": "img/terrarium-11.jpg", "title": "File:Terrarium small.jpg", "page": "https://commons.wikimedia.org/wiki/File:Terrarium_small.jpg", "artist": "christopher*", "license": "CC BY 2.0"}, {"src": "img/terrarium-12.jpg", "title": "File:Vivarium (with plants).jpg", "page": "https://commons.wikimedia.org/wiki/File:Vivarium_(with_plants).jpg", "artist": "Pauloleong2002", "license": "CC BY-SA 4.0"}, {"src": "img/terrarium-13.jpg", "title": "File:Bioactive Arid Vivarium.jpg", "page": "https://commons.wikimedia.org/wiki/File:Bioactive_Arid_Vivarium.jpg", "artist": "Connor Long", "license": "CC BY-SA 4.0"}, {"src": "img/terrarium-14.jpg", "title": "File:Vivarium de l'aquarium de guadeloupe.jpg", "page": "https://commons.wikimedia.org/wiki/File:Vivarium_de_l%27aquarium_de_guadeloupe.jpg", "artist": "myself", "license": "CC BY-SA 3.0"}, {"src": "img/terrarium-15.jpg", "title": "File:OfficeSetup13..jpg", "page": "https://commons.wikimedia.org/wiki/File:OfficeSetup13..jpg", "artist": "JDowns", "license": "CC BY-SA 3.0"}, {"src": "img/vivarium-01.jpg", "title": "File:ZOO Děčín - Rajské ostrovy.jpg", "page": "https://commons.wikimedia.org/wiki/File:ZOO_D%C4%9B%C4%8D%C3%ADn_-_Rajsk%C3%A9_ostrovy.jpg", "artist": "Jitka Erbenová (cheva)", "license": "CC BY-SA 3.0"}, {"src": "img/vivarium-02.jpg", "title": "File:Axolotl paludarium.jpg", "page": "https://commons.wikimedia.org/wiki/File:Axolotl_paludarium.jpg", "artist": "VictoriaLego", "license": "CC BY-SA 4.0"}, {"src": "img/vivarium-03.jpg", "title": "File:Axolotl chonker.jpg", "page": "https://commons.wikimedia.org/wiki/File:Axolotl_chonker.jpg", "artist": "Gameraquai", "license": "CC0"}, {"src": "img/vivarium-04.jpg", "title": "File:Regenwaldterrarium.jpg", "page": "https://commons.wikimedia.org/wiki/File:Regenwaldterrarium.jpg", "artist": "Unknown", "license": "CC BY-SA 2.5"}, {"src": "img/vivarium-05.jpg", "title": "File:Nature Aquarium Aquascape.jpg", "page": "https://commons.wikimedia.org/wiki/File:Nature_Aquarium_Aquascape.jpg", "artist": "Dileepkumardr", "license": "CC0"}, {"src": "img/uvb-01.jpg", "title": "File:Fluorescent light strip 2 tube.JPG", "page": "https://commons.wikimedia.org/wiki/File:Fluorescent_light_strip_2_tube.JPG", "artist": "Chetvorno", "license": "CC0"}, {"src": "img/uvb-02.jpg", "title": "File:BlackLightBulb4300ppx2.jpg", "page": "https://commons.wikimedia.org/wiki/File:BlackLightBulb4300ppx2.jpg", "artist": "FASTILY (TALK)", "license": "CC BY-SA 4.0"}, {"src": "img/uvb-03.jpg", "title": "File:Two fluorescent tubes.JPG", "page": "https://commons.wikimedia.org/wiki/File:Two_fluorescent_tubes.JPG", "artist": "Dmitry G", "license": "CC BY-SA 3.0"}, {"src": "img/uvb-04.jpg", "title": "File:Lack of electronic ballast.JPG", "page": "https://commons.wikimedia.org/wiki/File:Lack_of_electronic_ballast.JPG", "artist": "Dmitry G", "license": "CC BY-SA 3.0"}, {"src": "img/uvb-05.jpg", "title": "File:T12 Fluorescent lamp electrodes - rapid start and instant strt.jpg", "page": "https://commons.wikimedia.org/wiki/File:T12_Fluorescent_lamp_electrodes_-_rapid_start_and_instant_strt.jpg", "artist": "Zaereth", "license": "CC BY-SA 4.0"}, {"src": "img/heatlamp-02.jpg", "title": "File:Goat kids under infrared lamp (2).jpg", "page": "https://commons.wikimedia.org/wiki/File:Goat_kids_under_infrared_lamp_(2).jpg", "artist": "Cjp24", "license": "CC BY-SA 4.0"}, {"src": "img/heatlamp-03.jpg", "title": "File:Infrared Heat Lamp.jpg", "page": "https://commons.wikimedia.org/wiki/File:Infrared_Heat_Lamp.jpg", "artist": "SAgbley", "license": "CC BY-SA 4.0"}, {"src": "img/heatlamp-04.jpg", "title": "File:Heating lamp - Wärmelampe 1.jpg", "page": "https://commons.wikimedia.org/wiki/File:Heating_lamp_-_W%C3%A4rmelampe_1.jpg", "artist": "Sciencia58", "license": "CC BY-SA 4.0"}, {"src": "img/mice-00.jpg", "title": "File:Feeder mice.jpg", "page": "https://commons.wikimedia.org/wiki/File:Feeder_mice.jpg", "artist": "L.A. Dawson (Dawson at en.wikipedia)", "license": "CC BY-SA 2.5"}, {"src": "img/mice-01.jpg", "title": "File:Pinky mice 3.JPG", "page": "https://commons.wikimedia.org/wiki/File:Pinky_mice_3.JPG", "artist": "Pogrebnoj-Alexandroff", "license": "CC BY 3.0"}, {"src": "img/mice-02.jpg", "title": "File:Pinky mice 1.JPG", "page": "https://commons.wikimedia.org/wiki/File:Pinky_mice_1.JPG", "artist": "Pogrebnoj-Alexandroff", "license": "CC BY 3.0"}, {"src": "img/hide-00.jpg", "title": "File:Hide and seek.jpg", "page": "https://commons.wikimedia.org/wiki/File:Hide_and_seek.jpg", "artist": "Vaishnav26", "license": "CC BY-SA 4.0"}, {"src": "img/food-00.jpg", "title": "File:Storebought baby food - fruit and vegetable puree in glass and pouch.jpg", "page": "https://commons.wikimedia.org/wiki/File:Storebought_baby_food_-_fruit_and_vegetable_puree_in_glass_and_pouch.jpg", "artist": "MAKY.OREL", "license": "CC0"}, {"src": "img/food-01.jpg", "title": "File:Rutabaga Puree (140491165).jpeg", "page": "https://commons.wikimedia.org/wiki/File:Rutabaga_Puree_(140491165).jpeg", "artist": "J Doll", "license": "CC BY 3.0"}, {"src": "img/food-02.jpg", "title": "File:Rutabaga puree (28309413067).jpg", "page": "https://commons.wikimedia.org/wiki/File:Rutabaga_puree_(28309413067).jpg", "artist": "Joey Doll", "license": "CC BY 2.0"}, {"src": "img/superworm-02.jpg", "title": "File:3105Superworms in the Philippines 16.jpg", "page": "https://commons.wikimedia.org/wiki/File:3105Superworms_in_the_Philippines_16.jpg", "artist": "Judgefloro", "license": "CC0"}, {"src": "img/superworm-03.jpg", "title": "File:3105Superworms in the Philippines 13.jpg", "page": "https://commons.wikimedia.org/wiki/File:3105Superworms_in_the_Philippines_13.jpg", "artist": "Judgefloro", "license": "CC0"}, {"src": "img/superworm-04.jpg", "title": "File:3105Superworms in the Philippines 12.jpg", "page": "https://commons.wikimedia.org/wiki/File:3105Superworms_in_the_Philippines_12.jpg", "artist": "Judgefloro", "license": "CC0"}, {"src": "img/superworm-05.jpg", "title": "File:3105Superworms in the Philippines 24.jpg", "page": "https://commons.wikimedia.org/wiki/File:3105Superworms_in_the_Philippines_24.jpg", "artist": "Judgefloro", "license": "CC0"}, {"src": "img/superworm-06.jpg", "title": "File:3105Superworms in the Philippines 08.jpg", "page": "https://commons.wikimedia.org/wiki/File:3105Superworms_in_the_Philippines_08.jpg", "artist": "Judgefloro", "license": "CC0"}, {"src": "img/superworm-07.jpg", "title": "File:3105Superworms in the Philippines 10.jpg", "page": "https://commons.wikimedia.org/wiki/File:3105Superworms_in_the_Philippines_10.jpg", "artist": "Judgefloro", "license": "CC0"}, {"src": "img/superworm-08.jpg", "title": "File:3105Superworms in the Philippines 21.jpg", "page": "https://commons.wikimedia.org/wiki/File:3105Superworms_in_the_Philippines_21.jpg", "artist": "Judgefloro", "license": "CC0"}, {"src": "img/superworm-09.jpg", "title": "File:3105Superworms in the Philippines 17.jpg", "page": "https://commons.wikimedia.org/wiki/File:3105Superworms_in_the_Philippines_17.jpg", "artist": "Judgefloro", "license": "CC0"}, {"src": "img/superworm-10.jpg", "title": "File:3105Superworms in the Philippines 15.jpg", "page": "https://commons.wikimedia.org/wiki/File:3105Superworms_in_the_Philippines_15.jpg", "artist": "Judgefloro", "license": "CC0"}, {"src": "img/superworm-11.jpg", "title": "File:3105Superworms in the Philippines 20.jpg", "page": "https://commons.wikimedia.org/wiki/File:3105Superworms_in_the_Philippines_20.jpg", "artist": "Judgefloro", "license": "CC0"}, {"src": "img/moss-03.jpg", "title": "File:SphagnumFallax.jpg", "page": "https://commons.wikimedia.org/wiki/File:SphagnumFallax.jpg", "artist": "Christian Fischer", "license": "CC BY-SA 3.0"}, {"src": "img/moss-04.jpg", "title": "File:Sphagnum (peat bog).jpg", "page": "https://commons.wikimedia.org/wiki/File:Sphagnum_(peat_bog).jpg", "artist": "Jendasss", "license": "CC BY-SA 4.0"}, {"src": "img/moss-05.jpg", "title": "File:Sphagnum.flexuosum.jpg", "page": "https://commons.wikimedia.org/wiki/File:Sphagnum.flexuosum.jpg", "artist": "James K. Lindsey", "license": "CC BY-SA 3.0"}, {"src": "img/tongs-03.jpg", "title": "File:Metals Forceps.jpg", "page": "https://commons.wikimedia.org/wiki/File:Metals_Forceps.jpg", "artist": "Srini297", "license": "CC BY-SA 4.0"}, {"src": "img/tongs-04.jpg", "title": "File:Richet-type forceps, Paris, France, 1851-1900 Wellcome L0057983.jpg", "page": "https://commons.wikimedia.org/wiki/File:Richet-type_forceps,_Paris,_France,_1851-1900_Wellcome_L0057983.jpg", "artist": "Unknown", "license": "CC BY 4.0"}, {"src": "img/calcium-02.jpg", "title": "File:Vegan calcium supplements.jpg", "page": "https://commons.wikimedia.org/wiki/File:Vegan_calcium_supplements.jpg", "artist": "Mx. Granger", "license": "CC0"}, {"src": "img/calcium-03.jpg", "title": "File:Calcium β-hydroxy β-methylbutyrate monohydrate.jpg", "page": "https://commons.wikimedia.org/wiki/File:Calcium_%CE%B2-hydroxy_%CE%B2-methylbutyrate_monohydrate.jpg", "artist": "Seppi333", "license": "CC BY-SA 4.0"}, {"src": "img/boa-02.jpg", "title": "File:Red-tailed boa (Boa constrictor constrictor) Rio Napo.jpg", "page": "https://commons.wikimedia.org/wiki/File:Red-tailed_boa_(Boa_constrictor_constrictor)_Rio_Napo.jpg", "artist": "Charles J. Sharp", "license": "CC BY-SA 4.0"}, {"src": "img/boa-03.jpg", "title": "File:Boa constrictor constrictor guyana.JPG", "page": "https://commons.wikimedia.org/wiki/File:Boa_constrictor_constrictor_guyana.JPG", "artist": "Embreus", "license": "CC BY-SA 3.0"}, {"src": "img/boa-04.jpg", "title": "File:Boa constrictor constrictor 362127312.jpg", "page": "https://commons.wikimedia.org/wiki/File:Boa_constrictor_constrictor_362127312.jpg", "artist": "Thomaz de Carvalho Callado", "license": "CC BY 4.0"}, {"src": "img/boa-05.jpg", "title": "File:Boa constrictor, Vaňkovka, Brno (2).jpg", "page": "https://commons.wikimedia.org/wiki/File:Boa_constrictor,_Va%C5%88kovka,_Brno_(2).jpg", "artist": "I would appreciate being notified if you use my work outside Wikimedia.\nDo not c", "license": "CC BY-SA 4.0"}, {"src": "img/boa-06.jpg", "title": "File:Boa constrictor constrictor 258755669.jpg", "page": "https://commons.wikimedia.org/wiki/File:Boa_constrictor_constrictor_258755669.jpg", "artist": "Kristof Zyskowski", "license": "CC BY 4.0"}, {"src": "img/boa-07.jpg", "title": "File:Boa constrictor constrictor 258756102.jpg", "page": "https://commons.wikimedia.org/wiki/File:Boa_constrictor_constrictor_258756102.jpg", "artist": "Kristof Zyskowski", "license": "CC BY 4.0"}, {"src": "img/boa-08.jpg", "title": "File:Boa constrictor constrictor 258755801.jpg", "page": "https://commons.wikimedia.org/wiki/File:Boa_constrictor_constrictor_258755801.jpg", "artist": "Kristof Zyskowski", "license": "CC BY 4.0"}, {"src": "img/boa-09.jpg", "title": "File:Boa constrictor constrictor DT -CO Pereira Zoo- (2) (20120568584).jpg", "page": "https://commons.wikimedia.org/wiki/File:Boa_constrictor_constrictor_DT_-CO_Pereira_Zoo-_(2)_(20120568584).jpg", "artist": "Diego Tirira from Quito, Ecuador", "license": "CC BY-SA 2.0"}, {"src": "img/boa-10.jpg", "title": "File:Boa constrictor constrictor DT -CO Pereira Zoo- (3) (20120569204).jpg", "page": "https://commons.wikimedia.org/wiki/File:Boa_constrictor_constrictor_DT_-CO_Pereira_Zoo-_(3)_(20120569204).jpg", "artist": "Diego Tirira from Quito, Ecuador", "license": "CC BY-SA 2.0"}, {"src": "img/boa-11.jpg", "title": "File:Boa constrictor constrictor DT -CO Pereira Zoo- (1) (20555183000).jpg", "page": "https://commons.wikimedia.org/wiki/File:Boa_constrictor_constrictor_DT_-CO_Pereira_Zoo-_(1)_(20555183000).jpg", "artist": "Diego Tirira from Quito, Ecuador", "license": "CC BY-SA 2.0"}, {"src": "img/boa-12.jpg", "title": "File:Königsschlange (Boa constrictor).jpg", "page": "https://commons.wikimedia.org/wiki/File:K%C3%B6nigsschlange_(Boa_constrictor).jpg", "artist": "Raimond Spekking", "license": "CC BY-SA 4.0"}, {"src": "img/boa-13.jpg", "title": "File:Columbian Red Tail Boa (Boa constrictor constrictor) (10364706584).jpg", "page": "https://commons.wikimedia.org/wiki/File:Columbian_Red_Tail_Boa_(Boa_constrictor_constrictor)_(10364706584).jpg", "artist": "Bernard DUPONT from FRANCE", "license": "CC BY-SA 2.0"}, {"src": "img/boa-14.jpg", "title": "File:Boa constrictor constrictor - Flickr - Dick Culbert.jpg", "page": "https://commons.wikimedia.org/wiki/File:Boa_constrictor_constrictor_-_Flickr_-_Dick_Culbert.jpg", "artist": "Dick Culbert from Gibsons, B.C., Canada", "license": "CC BY 2.0"}, {"src": "img/uvb-06.jpg", "title": "File:Uv light sanitizer.jpg", "page": "https://commons.wikimedia.org/wiki/File:Uv_light_sanitizer.jpg", "artist": "pureeco", "license": "CC BY-SA 4.0"}, {"src": "img/sand-05.jpg", "title": "File:Sea beach sand in a hand closeup (42621473960).jpg", "page": "https://commons.wikimedia.org/wiki/File:Sea_beach_sand_in_a_hand_closeup_(42621473960).jpg", "artist": "freestocks.org from Olsztyn, Poland", "license": "CC0"}];
/* PHOTOS:END */

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
};
const morphsFor = title => { const k = Object.keys(MORPHS).find(k => title.includes(k)); return k ? MORPHS[k] : []; };
const REGIONS = ["צפון","חיפה והקריות","מרכז","תל אביב והסביבה","ירושלים והסביבה","שפלה","דרום"];
const CITY_REGION = { "רמת הגולן":"צפון", "עפולה":"צפון", "כפר הנגיד":"שפלה", "בארות יצחק":"מרכז", "תל אביב־יפו":"תל אביב והסביבה", "אמינדב":"ירושלים והסביבה" };

/* 20 demo shops. Names are real Israeli reptile/pet businesses used ONLY as templates.
   All descriptions, products and prices are invented for the demo.
   v:1 marks the shops shown as verified (big stores with a licence). In the demo this is illustrative only. */
const SHOPS = [
  { slug:"snakeshop", v:1,    name:"סנייק שופ",              en:"Snakeshop",              city:"",              icon:"🐍", color:"#2E7D32", focus:["snakes","heat","terrariums","food"] },
  { slug:"herpshop", v:1,     name:"הרפ שופ",                en:"HERP Shop",              city:"",              icon:"🦎", color:"#C26A00", focus:["geckos","lizards","decor","care"] },
  { slug:"reptiles-center", v:1, name:"המרכז הישראלי לזוחלים", en:"Israeli Center for Reptiles", city:"",        icon:"🐉", color:"#13795B", focus:["lizards","snakes","heat","care"] },
  { slug:"zochalia", v:1,     name:"זוחליה נחשייה",          en:"Zochalia",               city:"בארות יצחק",     icon:"🐢", color:"#5B8C1A", focus:["snakes","geckos","food"] },
  { slug:"animal-club",  name:"אנימל קלאב",             en:"Animal Club",            city:"רמת הגולן",      icon:"🌿", color:"#0E7490", focus:["lizards","food","decor"] },
  { slug:"pet-town", v:1,     name:"פט טאון",                en:"Pet Town",               city:"",              icon:"🏠", color:"#2F6FB3", focus:["terrariums","heat","decor","food"] },
  { slug:"zoo-afula",    name:"זו עפולה",               en:"Zoo Afula",              city:"עפולה",          icon:"🦎", color:"#D9480F", focus:["terrariums","heat","geckos"] },
  { slug:"chowchow",     name:"צ׳או צ׳או",              en:"Chow Chow",              city:"",              icon:"🪵", color:"#B8325A", focus:["decor","terrariums","care"] },
  { slug:"petbest", v:1,      name:"פטבסט",                  en:"PetBest",                city:"",              icon:"💡", color:"#7B4FB0", focus:["terrariums","heat","care"] },
  { slug:"megapet", v:1,      name:"מגה פט",                 en:"MegaPet",                city:"",              icon:"🏠", color:"#1C8C8C", focus:["terrariums","food","decor"] },
  { slug:"just4pet",     name:"ג׳אסט פור פט",           en:"Just4Pet",               city:"",              icon:"🦗", color:"#8A6D1D", focus:["food","care","heat"] },
  { slug:"meital-labs",  name:"מיטל מעבדות",            en:"Meital Labs",            city:"",              icon:"🪲", color:"#4E6B3A", focus:["food","inverts"] },
  { slug:"zoo-center", v:1,   name:"זו סנטר",                en:"Zoo Center",             city:"תל אביב־יפו",    icon:"🐸", color:"#2E7D32", focus:["lizards","geckos","decor"] },
  { slug:"petway",       name:"פטוויי",                 en:"Petway",                 city:"",              icon:"🌿", color:"#0E7490", focus:["food","care","decor"] },
  { slug:"animal-house", v:1, name:"אנימל האוס",             en:"Animal House",           city:"כפר הנגיד",      icon:"🐉", color:"#C26A00", focus:["lizards","terrariums","heat"] },
  { slug:"safari-house", v:1, name:"בית הספארי ירושלים",     en:"Safari House Jerusalem", city:"אמינדב",         icon:"🦂", color:"#8A6D1D", focus:["inverts","snakes","decor"] },
  { slug:"herp-hobby",   name:"הרפ הובי שופ",           en:"Herp Hobby Shop",        city:"",              icon:"🐍", color:"#13795B", focus:["snakes","geckos","food"] },
  { slug:"eranpets",     name:"ערן וחיות אחרות",        en:"Eran & Other Animals",   city:"",              icon:"🦎", color:"#D9480F", focus:["geckos","terrariums","food"] },
  { slug:"cichlidon",    name:"ציקלידון",               en:"Cichlidon",              city:"",              icon:"🐸", color:"#2F6FB3", focus:["geckos","terrariums","decor"] },
  { slug:"pet-point",    name:"פט פוינט",               en:"Pet Point",              city:"תל אביב־יפו",    icon:"💡", color:"#B8325A", focus:["food","heat","care"] },
];

const DESCS = {
  snakes:"נחשים מגידול בשבי לצד כל מה שצריך כדי להחזיק אותם נכון: טרריום, חימום ומזון קפוא.",
  geckos:"שממיות לכל רמה, ממתחילים ועד מגדלים ותיקים, עם מזון חי ומזון אבקתי.",
  lizards:"חרדונים מזוקנים, סקינקים וזיקיות, עם הדרכה ראשונית לכל קונה.",
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
const KEY = "scales-demo-v6";
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

const DEMO_BUYERS = [["יוסי כהן","חיפה"],["מיכל לוי","תל אביב"],["אבי מזרחי","באר שבע"],["נועה פרץ","ירושלים"],["דניאל ביטון","ראשון לציון"],["שירה אברהם","נתניה"],["עומר דהן","פתח תקווה"],["רותם אזולאי","מודיעין"],["תמר שפירא","רחובות"],["איתי גבאי","כרמיאל"]];
function seed() {
  const r = rng(20261121);
  const now = Date.now();
  const DAY = 86400000;
  const pick = a => a[Math.floor(r() * a.length)];
  const users = [], shops = [], products = [], orders = [];
  const used = {}; // photo key -> how many photos of that pool are taken, so every item gets its own photo
  const hasPhoto = t => (PHOTOS[t.k] || []).length > (used[t.k] || 0);
  const takePhoto = t => { const i = used[t.k] || 0; used[t.k] = i + 1; return PHOTOS[t.k][i]; };
  SHOPS.forEach((s, i) => {
    const n = String(i + 1).padStart(2, "0");
    const userId = "u_shop" + n, shopId = "s_" + s.slug;
    users.push({ id:userId, email:s.slug + "@scales.demo", password:"scales" + n, name:"מנהל/ת " + s.name, role:"seller", shopId, createdAt: now - (60 + i) * DAY });
    const mainCats = s.focus.map(c => catById(c).name).join(", ");
    const shop = {
      id: shopId, slug: s.slug, ownerId: userId, name: s.name, nameEn: s.en, city: s.city,
      tagline: TAGLINES[s.focus[0]],
      description: DESCS[s.focus[0]] + " בחנות הזו תמצאו: " + mainCats + ". (תוכן לדוגמה)",
      region: CITY_REGION[s.city] || REGIONS[i % REGIONS.length], color: s.color, icon: s.icon, logo: null, banner: null, phone: "", delivery: "איסוף עצמי או משלוח בתיאום",
      shipPrice: [25,30,35,40,45,50][i % 6], freeOver: [0,300,250,400,0][i % 5], pickup: true,
      verified: !!s.v, demo: true, createdAt: now - (60 + i) * DAY,
    };
    shops.push(shop);
    // 8 items from the shop's focus categories plus 3 others (verified stores carry 2 more of each)
    const big = s.v ? 1 : 0;
    const picks = [];
    const fill = (list, count) => {
      while (picks.length < count) {
        const cand = list.filter(t => !picks.some(x => x.t === t) && hasPhoto(t));
        if (!cand.length) break;
        const t = pick(cand); picks.push({ t, img: takePhoto(t) });
      }
    };
    fill(TPL.filter(t => s.focus.includes(t.cat)), 8 + big * 2);
    fill(TPL.filter(t => !s.focus.includes(t.cat)), 11 + big * 4);
    picks.forEach(({ t, img }, j) => {
      const factor = 0.85 + r() * 0.35;
      const price = Math.max(10, Math.round(t.p * factor / 5) * 5);
      const isAnimal = catById(t.cat).kind === "animal";
      const ms = morphsFor(t.t); const morph = ms.length ? pick(ms) : "";
      const sold = Math.max(1, Math.round(t.pop * (isAnimal ? 0.5 + r() * 1.8 : 2 + r() * 10) * (big ? 1.4 : 1)));
      products.push({
        id: "p_" + s.slug + "_" + j, shopId, title: t.t, cat: t.cat, kind: isAnimal ? "animal" : "supply",
        price, stock: isAnimal ? 1 + Math.floor(r() * 4) : 5 + Math.floor(r() * 30), sold,
        emoji: t.e, image: img, images: [img], desc: t.d,
        sex: t.sex || "", morph, age: t.age || "", level: t.level || "",
        createdAt: now - Math.floor(r() * 40 * DAY) - j * 3600000,
      });
    });
    // sample orders from the last two months, so the seller dashboard shows sales
    const mine = products.filter(p => p.shopId === shopId);
    const nOrders = 3 + Math.floor(r() * 3) + big * 2;
    for (let k = 0; k < nOrders && mine.length; k++) {
      const [name, city] = pick(DEMO_BUYERS);
      const lines = []; const cnt = Math.min(mine.length, 1 + Math.floor(r() * 3));
      while (lines.length < cnt) { const p = pick(mine); if (!lines.find(l => l.productId === p.id)) lines.push({ productId: p.id, shopId, title: p.title, price: p.price, qty: p.kind === "animal" ? 1 : 1 + Math.floor(r() * 3) }); }
      const sub = lines.reduce((a, l) => a + l.price * l.qty, 0);
      const pickup = r() < 0.3;
      const ship = pickup || (shop.freeOver && sub >= shop.freeOver) ? 0 : shop.shipPrice;
      orders.push({ id: "o_demo_" + s.slug + "_" + k, userId: null, demo: true, name, phone: "050-0000000", address: city,
        createdAt: now - Math.floor((1 + r() * 58) * DAY), items: lines, shipping: [{ shopId, method: pickup ? "pickup" : "ship", price: ship }], total: sub + ship });
    }
  });
  users.push({ id:"u_buyer", email:"buyer@scales.demo", password:"buyer123", name:"דנה הקונה", role:"buyer", shopId:null, createdAt: now - 10 * DAY });
  return { v:2, users, shops, products, orders, session:null, cart:[] };
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
const catPhoto = id => { const k = { geckos:"leopard", lizards:"bearded", snakes:"ball", inverts:"tarantula", terrariums:"terrarium", heat:"heatlamp", food:"crickets", decor:"branch", care:"hygro" }[id]; return k && PHOTOS[k] ? PHOTOS[k][0] : null; };
const vBadge = (s, full) => s && s.verified ? `<span class="vbadge${full ? " full" : ""}" title="מוכר מאומת: חנות גדולה עם רישיון">${icon("check")}${full ? "<span>מוכר מאומת</span>" : ""}</span>` : "";
const soldOf = p => Number(p.sold || 0);
function isBest(p) { // top 3 sellers of its shop
  if (!soldOf(p)) return false;
  return productsOf(p.shopId).sort((a, b) => soldOf(b) - soldOf(a)).slice(0, 3).some(x => x.id === p.id);
}
const SORTS = {
  best: ["הנמכרים ביותר", (a, b) => soldOf(b) - soldOf(a) || b.createdAt - a.createdAt],
  new:  ["החדשים ביותר", (a, b) => b.createdAt - a.createdAt],
  low:  ["מחיר: מהזול ליקר", (a, b) => a.price - b.price],
  high: ["מחיר: מהיקר לזול", (a, b) => b.price - a.price],
  group:["לפי קבוצה (נחשים, שממיות, טרריומים…)", (a, b) => CATS.findIndex(c => c.id === a.cat) - CATS.findIndex(c => c.id === b.cat) || soldOf(b) - soldOf(a)],
};
const sortOptions = cur => Object.entries(SORTS).map(([k, [label]]) => `<option value="${k}" ${cur === k ? "selected" : ""}>${label}</option>`).join("");
function groupChips(items, cur, act) {
  const counts = {}; items.forEach(p => counts[p.cat] = (counts[p.cat] || 0) + 1);
  const chip = (id, label, n) => `<button class="gchip ${cur === id ? "on" : ""}" data-act="${act}" data-v="${id}" aria-pressed="${cur === id}">${label} <span>${n}</span></button>`;
  return `<div class="gchips" role="group" aria-label="סינון לפי קבוצה">${chip("", "הכול", items.length)}${CATS.filter(c => counts[c.id]).map(c => chip(c.id, `${c.ic} ${esc(c.name)}`, counts[c.id])).join("")}</div>`;
}
function gridOrGroups(list, sort) {
  if (sort !== "group") return `<div class="pgrid">${list.map(productCard).join("")}</div>`;
  return CATS.filter(c => list.some(p => p.cat === c.id)).map(c => `<h3 class="ghead">${c.ic} ${esc(c.name)} <span>${list.filter(p => p.cat === c.id).length}</span></h3><div class="pgrid">${list.filter(p => p.cat === c.id).map(productCard).join("")}</div>`).join("");
}
function shopBanner(s) { // uploaded banner, else a real photo of the shop's best-selling item, else the colour pattern
  if (s.banner) return `background-image:url('${s.banner}')`;
  const top = productsOf(s.id).filter(p => p.image).sort(SORTS.best[1])[0];
  return top ? `background-image:url('${top.image}');background-size:cover;background-position:center` : scalesBg(s.color);
}
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
  const meta = p.kind === "animal" ? `${sex}${p.age ? `<span>${esc(p.age)}</span>` : ""}${p.morph ? `<span>${esc(p.morph)}</span>` : ""}` : `<span>${esc(c.name)}</span>`;
  return `<article class="pcard">
    <a class="pimg" href="#product-${p.id}" style="${pimgStyle(p)}" aria-label="${esc(p.title)}">${pimgInner(p)}${s.verified ? `<span class="vshield" title="מוכר מאומת">${icon("check")}</span>` : ""}${isBest(p) ? '<span class="badge best">רב מכר</span>' : isNew(p) ? '<span class="badge new">חדש</span>' : ""}${soldOf(p) ? `<span class="psoldpill" title="נמכרו ${soldOf(p)}">${icon("cart")}${soldOf(p)}</span>` : ""}</a>
    <div class="pbody">
      <a class="ptitle" href="#product-${p.id}">${esc(p.title)}</a>
      <div class="prow">
        <div class="pleft">
          <a class="pshop" href="#shop-${s.slug}"><span>${esc(s.name)}</span>${vBadge(s)}</a>
          <div class="pmeta">${meta}</div>
        </div>
        <span class="price">${money(p.price)}</span>
      </div>
      <div class="pship">${shipOf(s) ? "משלוח " + money(shipOf(s)) : "משלוח חינם"}${soldOf(p) ? `<span class="psold">· נמכרו ${soldOf(p)}</span>` : ""}</div>
    </div>
  </article>`;
}
function shopCard(s) {
  const n = productsOf(s.id).length;
  const strip = shopBanner(s);
  return `<a class="scard" href="#shop-${s.slug}">
    <div class="strip" style="${strip}"></div>
    <div class="sbody">
      ${logoHTML(s)}
      <h3>${esc(s.name)} ${vBadge(s)}</h3>
      <div class="meta">${icon("pin")} ${esc(s.city || s.region || "ישראל")} · ${n} מוצרים</div>
      <p>${esc(s.description)}</p>
    </div>
    <div class="go"><span>כניסה לחנות</span>${icon("arrow")}</div>
  </a>`;
}

/* =========================================================
   Layout
   ========================================================= */
const EMPTY_SEARCH = { q:"", cat:"", kind:"", sort:"best", shop:"", sex:"", region:"", max:"", ver:"" };
let searchState = { ...EMPTY_SEARCH };

function header(route) {
  const u = me();
  const catOpts = CATS.map(c => `<option value="${c.id}" ${searchState.cat === c.id ? "selected" : ""}>${esc(c.name)}</option>`).join("");
  const size = document.documentElement.dataset.size || "m";
  return `<header class="topbar"><div class="wrap">
    <a class="brand" href="#home" aria-label="Scales, לעמוד הבית">
      <span class="brand-mark"><svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true"><path d="M6 22c0-7 5-13 12-13 4 0 8 2 8 6 0 3-3 4-5 4-3 0-4 2-4 4 0 3-3 4-6 4-3 0-5-2-5-5z" fill="#fff"/><circle cx="21" cy="13" r="1.6" fill="#111"/><path d="M9 21c2 0 3-1 4-2M11 25c2 0 3-1 4-2" stroke="#111" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg></span>
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
      <a class="pill pill-dark" href="#open-shop">מכירה באתר</a>
      ${u ? `<a class="hbtn" href="#account">${icon("user")}<span class="lbl-hide">${esc(u.name.split(" ")[0])}</span></a>` : `<a class="pill pill-line" href="#login">כניסה</a>`}
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
  const best = [...db.products].sort(SORTS.best[1]).filter((p, i, a) => a.findIndex(x => x.title === p.title) === i).slice(0, 10); // one card per product type
  const ordered = shopOrder();
  const heroPic = db.products.filter(p => p.kind === "animal" && p.image && p.image.includes("/ball-")).sort(SORTS.best[1])[0];
  return `
  <section class="mmhero">
    ${heroPic ? `<div class="mmhero-pic" style="background-image:url('${heroPic.image}')" role="img" aria-label="${esc(heroPic.title)}"></div>` : ""}
    <div class="mmhero-text">
      <h1>קונים ומוכרים זוחלים בישראל</h1>
      <p>כל החנויות והמגדלים הפרטיים במקום אחד. ${db.products.filter(p => p.kind === "animal").length} בעלי חיים ו־${db.products.filter(p => p.kind === "supply").length} מוצרי ציוד מ־${db.shops.length} מוכרים.</p>
      <div class="btn-row"><a class="btn btn-white" href="#new">לכל המודעות</a><a class="btn btn-outline-white" href="#open-shop">פתיחת חנות</a></div>
    </div>
  </section>
  <div class="quick"><span>חיפושים נפוצים:</span>${["שממית נמרית", "פיתון מלכותי", "חרדון מזוקן", "שממית מצויצת", "טרנטולה", "מזון חי", "נורת UVB"].map(q => `<a href="#search" data-act="quick" data-q="${q}">${q}</a>`).join("")}</div>

  <section class="tools-row" aria-label="כלים למגדלים">
    <a href="#genetics">${icon("dna")}<span><b>מחשבון גנטיקה</b><small>מה ייצא מהזיווג? אחוזים לכל מורף</small></span></a>
    <a href="#guides">${icon("book")}<span><b>מדריכי גידול בעברית</b><small>8 מינים, עם ערכת ציוד בלחיצה</small></span></a>
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

  <section aria-labelledby="h-best">
    <div class="section-head"><div><h2 id="h-best">הנמכרים ביותר</h2><p>מה שקונים הכי הרבה החודש בכל החנויות</p></div><a class="link-more" href="#search" data-act="quick" data-q="">לכל המוצרים ${icon("arrow")}</a></div>
    <div class="pgrid">${best.map(productCard).join("")}</div>
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

function shopOrder() { // the user's own shops first, then verified stores, then by sales
  const sales = s => productsOf(s.id).reduce((a, p) => a + soldOf(p), 0);
  return [...db.shops].sort((a, b) => (a.demo ? 1 : 0) - (b.demo ? 1 : 0) || (b.verified ? 1 : 0) - (a.verified ? 1 : 0) || sales(b) - sales(a));
}
function viewShops() {
  const ordered = shopOrder();
  return `<section>
    <div class="section-head"><div><h1>כל החנויות</h1><p>${db.shops.length} חנויות ומוכרים. בחרו חנות כדי לראות את המוצרים שלה. ${vBadge({ verified: true })} מסמן מוכר מאומת: חנות גדולה עם רישיון.</p></div>
      <a class="btn btn-cta" href="#open-shop">פתיחת חנות חדשה</a></div>
    <div class="sgrid">${ordered.map(shopCard).join("")}</div>
  </section>`;
}

let shopState = { slug: "", cat: "", sort: "best" };
function viewShop(slug) {
  const s = db.shops.find(x => x.slug === slug);
  if (!s) return notFound();
  if (shopState.slug !== slug) shopState = { slug, cat: "", sort: "best" };
  const all = productsOf(s.id);
  const items = all.filter(p => !shopState.cat || p.cat === shopState.cat).sort(SORTS[shopState.sort][1]);
  const soldTotal = all.reduce((a, p) => a + soldOf(p), 0);
  const owner = me() && me().shopId === s.id;
  const bannerStyle = shopBanner(s);
  return `<section class="shop-hero">
    <div class="banner" style="${bannerStyle}" role="img" aria-label="הבאנר של ${esc(s.name)}"></div>
    <div class="shop-id">
      ${logoHTML(s, "lg")}
      <div class="txt">
        <h1>${esc(s.name)} ${vBadge(s, true)}</h1>
        <p>${esc(s.tagline)}</p>
      </div>
      ${owner ? `<a class="btn btn-brand" href="#dashboard">עריכת החנות</a>` : ""}
    </div>
    <div class="shop-about">
      <div style="display:grid;gap:12px">
        <h2 style="font-size:1.2rem">על החנות</h2>
        <p>${esc(s.description)}</p>
        ${s.verified ? `<div class="note ok">${icon("check")} <span><b>מוכר מאומת.</b> חנות גדולה עם רישיון עסק למכירת בעלי חיים, שנבדק על ידי צוות האתר.${s.demo ? " (בדמו הסימון להמחשה בלבד.)" : ""}</span></div>` : ""}
        ${s.demo ? `<div class="note">חנות לדוגמה. השם ${esc(s.nameEn ? "(" + s.nameEn + ")" : "")} משמש כתבנית בלבד, והתוכן הומצא לצורך הדמו.</div>` : ""}
      </div>
      <div class="infobox">
        <div><span>אזור</span><b>${esc([s.city, s.region].filter(Boolean).join(", ") || "ישראל")}</b></div>
        <div><span>מוצרים</span><b>${all.length}</b></div>
        <div><span>נמכרו</span><b>${soldTotal} פריטים</b></div>
        <div><span>משלוח</span><b>${shipOf(s) ? money(shipOf(s)) : "חינם"}</b></div>
        ${s.freeOver ? `<div><span>משלוח חינם</span><b>מעל ${money(s.freeOver)}</b></div>` : ""}
        <div><span>איסוף עצמי</span><b>${s.pickup !== false ? "כן" : "לא"}</b></div>
        <div><span>טלפון</span><b dir="ltr">${esc(s.phone || "לא צוין")}</b></div>
      </div>
    </div>
  </section>
  <section>
    <div class="sortbar"><div><h2 style="font-size:1.25rem">המוצרים של ${esc(s.name)}</h2><span style="color:var(--muted)">${items.length} מוצרים${shopState.sort === "best" ? " · מסודרים לפי הנמכרים ביותר" : ""}</span></div>
      <label for="shopSort">מיון<select id="shopSort" data-shopsort="1">${sortOptions(shopState.sort)}</select></label></div>
    ${all.length ? groupChips(all, shopState.cat, "shopcat") : ""}
    ${items.length ? gridOrGroups(items, shopState.sort) : all.length ? `<div class="empty"><strong>אין מוצרים בקבוצה הזו.</strong></div>` : `<div class="empty"><strong>עוד אין מוצרים בחנות הזו.</strong>${owner ? `<a class="btn btn-cta" href="#dashboard-new">הוספת מוצר ראשון</a>` : ""}</div>`}
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
        <div><dt>נמכרו</dt><dd>${soldOf(p)}${isBest(p) ? " · רב מכר בחנות" : ""}</dd></div>
      </dl>
      ${p.kind === "animal" ? `<div class="note warn">בעלי חיים נמסרים באיסוף עצמי או במשלוח מותאם בתיאום עם המוכר. כדאי לוודא שהטרריום מוכן לפני ההגעה.</div>` : ""}
      ${p.stock > 0 ? `<div class="btn-row" style="align-items:center">
        <div class="qty" role="group" aria-label="כמות"><button data-act="pq" data-id="${p.id}" data-d="-1" aria-label="פחות">−</button><span>${qty}</span><button data-act="pq" data-id="${p.id}" data-d="1" aria-label="יותר">+</button></div>
        <button class="btn btn-cta" style="flex:1" data-act="add" data-id="${p.id}" data-qty="${qty}">הוספה לעגלה</button>
      </div>
      <button class="btn btn-brand" data-act="buynow" data-id="${p.id}">קנייה עכשיו</button>` : `<div class="err">המוצר אזל מהמלאי</div>`}
      <a class="seller" href="#shop-${s.slug}">${logoHTML(s)}<div><div style="color:var(--muted);font-size:.9rem">נמכר על ידי</div><strong>${esc(s.name)} ${vBadge(s, true)}</strong><div style="color:var(--muted);font-size:.9rem">${esc(s.city || "ישראל")} · ${productsOf(s.id).length} מוצרים</div></div></a>
    </div>
  </section>
  ${similar.length ? `<section><div class="section-head"><div><h2>להשוואת מחירים: ${esc(c.name)} בחנויות אחרות</h2><p>מסודר מהזול ליקר</p></div></div><div class="pgrid">${similar.map(productCard).join("")}</div></section>` : ""}`;
}
const pdpQty = {};

function runSearch(ignoreCat) {
  const q = searchState.q.trim().toLowerCase();
  let list = db.products.filter(p => {
    const s = shopOf(p); if (!s) return false;
    if (!ignoreCat && searchState.cat && p.cat !== searchState.cat) return false;
    if (searchState.kind && p.kind !== searchState.kind) return false;
    if (searchState.shop && p.shopId !== searchState.shop) return false;
    if (searchState.sex && p.sex !== searchState.sex) return false;
    if (searchState.region && s.region !== searchState.region) return false;
    if (searchState.ver && !s.verified) return false;
    if (searchState.max && p.price > Number(searchState.max)) return false;
    if (q) {
      const hay = (p.title + " " + (p.morph || "") + " " + p.desc + " " + s.name + " " + (s.nameEn || "") + " " + catById(p.cat).name).toLowerCase();
      return q.split(/\s+/).every(w => hay.includes(w));
    }
    return true;
  });
  return list.sort((SORTS[searchState.sort] || SORTS.best)[1]);
}
function viewSearch(title) {
  const list = runSearch();
  const radio = (name, val, label) => `<label><input type="radio" name="${name}" value="${val}" ${searchState[name] === val ? "checked" : ""} data-filter="${name}"> ${label}</label>`;
  const heading = title || (searchState.q ? `תוצאות עבור „${esc(searchState.q)}”` : searchState.cat ? esc(catById(searchState.cat).name) : "כל המוצרים");
  return `<section>
    <div class="results">
      <aside class="filters" aria-label="סינון">
        <fieldset><legend>מוכר</legend>${radio("ver", "", "כל המוכרים")}${radio("ver", "1", `מוכרים מאומתים בלבד ${vBadge({ verified: true })}`)}</fieldset>
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
          <label for="fSort">מיון<select id="fSort" data-filter="sort">${sortOptions(searchState.sort)}</select></label></div>
        ${groupChips(runSearch(true), searchState.cat, "searchcat")}
        ${list.length ? gridOrGroups(list, searchState.sort) : `<div class="empty"><strong>לא נמצאו מוצרים.</strong><span>נסו מילה אחרת או נקו את הסינון.</span><button class="btn btn-ghost" data-act="clearfilters">ניקוי הסינון</button></div>`}</div>
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
      <label><input type="radio" name="pKind" value="animal" ${kind === "animal" ? "checked" : ""} data-act="pkind"><span><b>בעל חיים</b><br><small>שממית, נחש, טרנטולה…</small></span></label>
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
  const items = productsOf(s.id).sort(SORTS.best[1]);
  const orders = db.orders.filter(o => o.items.some(i => i.shopId === s.id)).sort((a, b) => b.createdAt - a.createdAt);
  const revenue = orders.reduce((a, o) => a + o.items.filter(i => i.shopId === s.id).reduce((x, i) => x + i.price * i.qty, 0), 0);
  let body = "";
  if (tab === "products") {
    body = `<div class="section-head"><h1>המוצרים שלי</h1><a class="btn btn-cta" href="#dashboard-new">הוספת מוצר</a></div>
      ${items.length ? `<div class="tbl-wrap"><table><thead><tr><th></th><th>מוצר</th><th>מחיר</th><th>מלאי</th><th>נמכרו</th><th></th></tr></thead><tbody>
      ${items.map(p => `<tr><td><div class="mini" style="${pimgStyle(p)}">${pimgInner(p)}</div></td><td><a class="ptitle" href="#product-${p.id}">${esc(p.title)}</a><div class="chips" style="margin-top:4px"><span class="chip">${esc(catById(p.cat).name)}</span></div></td><td class="num">${money(p.price)}</td><td class="num">${p.stock}</td><td class="num">${soldOf(p)}</td>
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
      <div class="stat-row"><div class="stat"><b>${items.length}</b><span>מוצרים</span></div><div class="stat"><b>${orders.length}</b><span>הזמנות</span></div><div class="stat"><b>${money(revenue)}</b><span>סך המכירות</span></div><div class="stat"><b>${items.reduce((a, p) => a + soldOf(p), 0)}</b><span>פריטים שנמכרו</span></div></div>
      ${s.verified ? `<div class="note ok" style="margin-top:16px">${icon("check")} <span><b>החנות מאומתת.</b> הסימון ${vBadge(s)} מופיע ליד שם החנות בכל האתר.</span></div>` : `<div class="note" style="margin-top:16px"><b>החנות עוד לא מאומתת.</b> סימון V ניתן לחנויות עם רישיון עסק בתוקף למכירת בעלי חיים, אחרי שצוות האתר בודק את המסמכים. בגרסה האמיתית תהיה כאן העלאת רישיון.</div>`}
      ${items.length ? `<h2 style="font-size:1.15rem;margin:20px 0 10px">הנמכרים ביותר שלי</h2><div class="tbl-wrap"><table><tbody>${items.slice(0, 5).map((p, i) => `<tr><td class="num">${i + 1}</td><td><a href="#product-${p.id}">${esc(p.title)}</a></td><td class="num">${soldOf(p)} נמכרו</td></tr>`).join("")}</tbody></table></div>` : ""}
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
    <p style="margin:0">התמונות באתר הדמו לקוחות מ־Wikimedia Commons ברישיונות חופשיים, כפי שצולמו. לכל מוצר תמונה משלו. לחצו על שם הקובץ כדי לראות את המקור ואת הרישיון המלא.</p>
    <div class="tbl-wrap"><table><thead><tr><th>תמונה</th><th>קובץ מקור</th><th>צלם/ת</th><th>רישיון</th></tr></thead><tbody>
    ${CREDITS.map(c => `<tr><td><div class="mini"><img src="${esc(c.src)}" alt="" loading="lazy"></div></td><td><a href="${esc(c.page)}" target="_blank" rel="noopener" dir="ltr">${esc(c.title.replace(/^File:/, ""))}</a></td><td dir="auto">${esc(c.artist || "לא צוין")}</td><td dir="ltr">${esc(c.license)}</td></tr>`).join("")}
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
  corn:[0,2,2,["rodents"],2], bluetongue:[1,2,3,["insects","powder"],3],
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
  else if (act === "shopcat") { shopState.cat = b.dataset.v; render(); }
  else if (act === "searchcat") { searchState.cat = b.dataset.v; render(); }
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
  if (t.dataset.shopsort) { shopState.sort = t.value; render(); return; }
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
    rows.forEach(r => { r.p.stock = Math.max(0, r.p.stock - r.qty); r.p.sold = (r.p.sold || 0) + r.qty; });
    db.orders.push(order); db.cart = []; pickupChoice = {}; save(); go("thanks"); return;
  }
});

/* boot */
document.documentElement.lang = "he";
document.documentElement.dir = "rtl";
document.documentElement.dataset.size = getPref("size", "m");
render();
})();
