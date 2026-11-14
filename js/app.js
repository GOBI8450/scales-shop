'use strict';
/* Scales demo: storage, routing, shared UI and the buyer-facing pages.
   Seller dashboard and admin pages live in dash.js. */

const KEY = 'scales-db-v1';
let db = null;
let me = null;

/* ---------- helpers ---------- */
const $ = (s, el = document) => el.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const money = n => '₪' + Number(n || 0).toLocaleString('he-IL');
const uid = p => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const fdate = t => new Date(t).toLocaleDateString('he-IL');
const catOf = id => CATS.find(c => c.id === id) || CATS[0];
const shopById = id => db.shops.find(s => s.id === id);
const shopOf = p => shopById(p.shopId);
const myShop = () => (me && me.shopId ? shopById(me.shopId) : null);
const SEX = { male: '♂ זכר', female: '♀ נקבה', unknown: 'מין לא ידוע' };
const ORDER_STATUS = { new: 'חדשה', confirmed: 'אושרה', shipped: 'נשלחה', done: 'הושלמה', cancelled: 'בוטלה' };
const TYPE = { shop: 'חנות', breeder: 'מגדל פרטי' };

function load() {
  try { db = JSON.parse(localStorage.getItem(KEY)); } catch (e) { db = null; }
  if (!db || db.v !== DB_VERSION) { db = seed(); save(); }
  me = db.users.find(u => u.id === db.session) || null;
}
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(db)); return true; }
  catch (e) { toast('אין מספיק מקום בדפדפן לשמירה. נסו להעלות פחות תמונות.', true); return false; }
}
let toastTimer;
function toast(text, err) {
  const t = $('#toast');
  t.textContent = text; t.className = 'show' + (err ? ' err' : '');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.className = ''; }, 3200);
}
function ph(icon, color) {
  return 'data:image/svg+xml,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="' + (color || '#dde7e1') +
    '"/><text x="200" y="190" font-size="120" text-anchor="middle">' + icon + '</text></svg>');
}
const imgOf = (p, i = 0) => p.images[i] || ph(p.icon || catOf(p.cat).icon);
function stars(n) {
  const k = Math.round(n);
  return '<span class="stars" aria-label="דירוג ' + n.toFixed(1) + ' מתוך 5">' + '★'.repeat(k) + '<i>' + '★'.repeat(5 - k) + '</i></span>';
}
function ratingOf(shopId) {
  const rs = db.reviews.filter(r => r.shopId === shopId);
  return { n: rs.length, avg: rs.length ? rs.reduce((a, r) => a + r.rating, 0) / rs.length : 0 };
}
function ratingHtml(shopId) {
  const r = ratingOf(shopId);
  return r.n ? stars(r.avg) + ' <span class="small mute">' + r.avg.toFixed(1) + ' (' + r.n + ')</span>' : '<span class="small mute">אין עדיין ביקורות</span>';
}
function shopLogo(s, size) {
  const st = 'width:' + size + 'px;height:' + size + 'px;font-size:' + Math.round(size * 0.5) + 'px;background:' + esc(s.color);
  return '<span class="slogo" style="' + st + '">' + (s.logo ? '<img src="' + esc(s.logo) + '" alt="">' : esc(s.icon)) + '</span>';
}
function shopBanner(s) {
  return s.banner ? 'background-image:url(\'' + esc(s.banner) + '\')' : 'background:linear-gradient(120deg,' + esc(s.color) + ',#17212e)';
}
const cartCount = () => db.cart.reduce((a, c) => a + c.qty, 0);
const liveProducts = () => db.products.filter(p => p.status === 'active' && p.qty > 0);

/* ---------- routing ---------- */
function parseHash() {
  const h = location.hash.replace(/^#/, '') || '/';
  const i = h.indexOf('?');
  return { path: i < 0 ? h : h.slice(0, i), q: Object.fromEntries(new URLSearchParams(i < 0 ? '' : h.slice(i + 1))) };
}
function href(path, q) {
  const s = q ? new URLSearchParams(Object.entries(q).filter(([, v]) => v !== '' && v != null)).toString() : '';
  return '#' + path + (s ? '?' + s : '');
}
function go(path, q) {
  const h = href(path, q);
  if (location.hash === h) render(); else location.hash = h;
}
const ROUTES = [
  [/^\/$/, () => viewHome()],
  [/^\/browse$/, (m, q) => viewBrowse(q)],
  [/^\/p\/([\w-]+)$/, m => viewProduct(m[1])],
  [/^\/shops$/, (m, q) => viewShops(q)],
  [/^\/s\/([\w-]+)$/, (m, q) => viewShop(m[1], q)],
  [/^\/login$/, (m, q) => viewLogin(q)],
  [/^\/register$/, (m, q) => viewRegister(q)],
  [/^\/demo$/, () => viewDemo()],
  [/^\/cart$/, () => viewCart()],
  [/^\/checkout$/, () => needLogin(viewCheckout)],
  [/^\/favorites$/, () => needLogin(viewFavorites)],
  [/^\/account$/, (m, q) => needLogin(() => viewAccount(q))],
  [/^\/about$/, () => viewAbout()],
  [/^\/credits$/, () => viewCredits()],
  [/^\/dash(?:\/(\w+))?(?:\/([\w-]+))?$/, m => needLogin(() => viewDash(m[1] || 'home', m[2]))],
  [/^\/admin(?:\/(\w+))?$/, m => needLogin(() => viewAdmin(m[1] || 'users'))],
];
function needLogin(view) {
  if (me) return view();
  return viewLogin({ next: location.hash.replace(/^#/, '') });
}
function render() {
  const { path, q } = parseHash();
  let html = null;
  for (const [re, fn] of ROUTES) { const m = path.match(re); if (m) { html = fn(m, q); break; } }
  if (html == null) html = { title: 'העמוד לא נמצא', html: '<div class="empty panel"><b>🦎</b>העמוד לא נמצא. <a href="#/">חזרה לדף הבית</a></div>' };
  $('#hdr').innerHTML = header(path, q);
  $('#main').innerHTML = '<div class="wrap">' + html.html + '</div>';
  $('#ftr').innerHTML = footer();
  document.title = html.title + ' | Scales';
}

/* ---------- layout ---------- */
function header(path, q) {
  const cur = path === '/browse' ? q : {};
  const acct = me
    ? '<a href="#/account"><small>שלום, ' + esc(me.name) + '</small>החשבון שלי</a>' +
      (me.role === 'seller' ? '<a href="#/dash"><small>מוכרים</small>ניהול החנות</a>' : '') +
      (me.role === 'admin' ? '<a href="#/admin"><small>מנהל</small>ניהול האתר</a>' : '') +
      '<button type="button" data-act="logout"><small>&nbsp;</small>יציאה</button>'
    : '<a href="#/login"><small>שלום, אורח</small>כניסה / הרשמה</a>';
  return '<div class="demo-strip">אתר הדגמה: אין תשלומים אמיתיים, והמוצרים והמחירים בדויים. <a href="#/demo">חשבונות לניסיון</a></div>' +
    '<header class="hdr"><div class="wrap hdr-top">' +
    '<a class="logo" href="#/"><i>🦎</i><span>Scales<small>שוק הזוחלים של ישראל</small></span></a>' +
    '<form class="search" data-form="search" role="search"><select name="cat" aria-label="קטגוריה"><option value="">הכול</option>' +
    CATS.map(c => '<option value="' + c.id + '"' + (cur.cat === c.id ? ' selected' : '') + '>' + c.he + '</option>').join('') +
    '</select><input type="search" name="q" placeholder="חיפוש מין, מורף, ציוד או חנות" aria-label="חיפוש" value="' + esc(cur.q || '') + '">' +
    '<button aria-label="חיפוש">🔍</button></form>' +
    '<nav class="hdr-links" aria-label="חשבון">' + acct +
    '<a href="#/favorites"><small>שמורים</small>♥ מועדפים</a>' +
    '<a href="#/cart"><small>לתשלום</small>🛒 עגלה<span class="count">' + cartCount() + '</span></a></nav></div>' +
    '<div class="hdr-nav"><nav class="wrap" aria-label="קטגוריות">' +
    '<a href="#/browse"' + (path === '/browse' && !cur.cat && !cur.type && !cur.sale ? ' class="on"' : '') + '>כל המודעות</a>' +
    CATS.map(c => '<a href="#/browse?cat=' + c.id + '"' + (cur.cat === c.id ? ' class="on"' : '') + '>' + c.icon + ' ' + c.he + '</a>').join('') +
    '<a href="#/browse?sale=1"' + (cur.sale ? ' class="on"' : '') + '>מבצעים</a>' +
    '<span class="sep"></span>' +
    '<a href="#/shops"' + (path === '/shops' ? ' class="on"' : '') + '>חנויות ומגדלים</a>' +
    '<a class="cta" href="' + (me && me.role === 'seller' ? '#/dash' : '#/register?role=shop') + '">פתיחת חנות בחינם</a>' +
    '</nav></div></header>';
}
function footer() {
  return '<div class="wrap"><div class="cols">' +
    '<div><h3>🦎 Scales</h3><p>כל חנויות הזוחלים והמגדלים הפרטיים בישראל במקום אחד, כדי שיהיה קל למצוא, להשוות ולקנות.</p></div>' +
    '<div><h3>לקונים</h3><ul><li><a href="#/browse">כל המודעות</a></li><li><a href="#/shops">חנויות ומגדלים</a></li><li><a href="#/browse?sale=1">מבצעים</a></li><li><a href="#/favorites">המועדפים שלי</a></li></ul></div>' +
    '<div><h3>למוכרים</h3><ul><li><a href="#/register?role=shop">פתיחת חנות</a></li><li><a href="#/register?role=breeder">הרשמה כמגדל פרטי</a></li><li><a href="#/dash">ניהול החנות</a></li></ul></div>' +
    '<div><h3>על הדמו</h3><ul><li><a href="#/about">איך זה עובד</a></li><li><a href="#/demo">חשבונות לניסיון</a></li><li><a href="#/credits">קרדיט לתמונות</a></li>' +
    '<li><button type="button" data-act="reset">איפוס נתוני הדמו</button></li></ul></div>' +
    '</div><p class="small" style="margin:20px 0 0">שמות החנויות הם של עסקים אמיתיים ומשמשים כתבנית בלבד. התיאורים, המוצרים, המחירים והביקורות בדויים, ואין קשר בין האתר לעסקים.</p></div>';
}

/* ---------- shared pieces ---------- */
function card(p) {
  const s = shopOf(p);
  const fav = me && me.favs.includes(p.id);
  const sale = p.oldPrice > p.price;
  const sub = p.species ? [SPECIES[p.species] ? SPECIES[p.species].lat : '', p.birth ? 'שנת ' + p.birth : ''].filter(Boolean).join(' · ') : catOf(p.cat).he;
  return '<article class="card">' +
    '<a class="card-img" href="#/p/' + p.id + '"><img loading="lazy" src="' + esc(imgOf(p)) + '" alt="' + esc(p.title) + '">' +
    '<span class="card-tags">' + (p.sex ? '<span class="badge">' + SEX[p.sex] + '</span>' : '') + (sale ? '<span class="badge red">מבצע</span>' : '') +
    (s.type === 'breeder' ? '<span class="badge blue">מגדל פרטי</span>' : '') + '</span></a>' +
    '<button type="button" class="fav' + (fav ? ' on' : '') + '" data-act="fav" data-id="' + p.id + '" aria-pressed="' + !!fav + '" aria-label="שמירה במועדפים">♥</button>' +
    '<div class="card-body"><a class="card-title" href="#/p/' + p.id + '">' + esc(p.title) + '</a>' +
    '<div class="card-sub"><span' + (p.species ? ' class="ltr"' : '') + '>' + esc(sub) + '</span></div>' +
    '<div class="price' + (sale ? ' sale' : '') + '">' + money(p.price) + (sale ? '<s>' + money(p.oldPrice) + '</s>' : '') + '</div>' +
    '<a class="card-shop" href="#/s/' + s.slug + '">' + shopLogo(s, 22) + '<span>' + esc(s.name) + (s.city ? ' · ' + esc(s.city) : '') + '</span></a>' +
    '</div></article>';
}
const grid = list => list.length ? '<div class="grid">' + list.map(card).join('') + '</div>' : '<div class="empty panel"><b>🔍</b>לא נמצאו מודעות מתאימות.</div>';
function shopCard(s) {
  const n = liveProducts().filter(p => p.shopId === s.id).length;
  return '<a class="shop-card" href="#/s/' + s.slug + '"><div class="ban" style="' + shopBanner(s) + '"></div><div class="in">' + shopLogo(s, 52) +
    '<h3>' + esc(s.name) + ' ' + (s.verified ? '<span class="badge green">מאומת</span>' : '') + '</h3>' +
    '<div><span class="badge ' + (s.type === 'breeder' ? 'blue' : 'gold') + '">' + TYPE[s.type] + '</span> <span class="small mute">' + esc(s.city || 'משלוחים לכל הארץ') + '</span></div>' +
    '<div>' + ratingHtml(s.id) + '</div><div class="small mute">' + n + ' מודעות פעילות</div></div></a>';
}

/* ---------- home ---------- */
function viewHome() {
  const live = liveProducts();
  const animals = live.filter(p => catOf(p.cat).animal);
  const newest = animals.slice().sort((a, b) => b.created - a.created).slice(0, 10);
  const deals = live.filter(p => p.oldPrice > p.price).sort((a, b) => (b.oldPrice - b.price) / b.oldPrice - (a.oldPrice - a.price) / a.oldPrice).slice(0, 5);
  const breeders = live.filter(p => shopOf(p).type === 'breeder').slice(0, 5);
  const top = db.shops.slice().sort((a, b) => ratingOf(b.id).avg - ratingOf(a.id).avg).slice(0, 4);
  const sec = (title, link, body) => '<div class="sec-head"><h2>' + title + '</h2>' + (link ? '<a href="' + link + '">לכל המודעות ←</a>' : '') + '</div>' + body;
  return { title: 'שוק הזוחלים של ישראל', html:
    '<section class="hero"><div class="hero-txt"><h1>כל מוכרי הזוחלים בישראל, במקום אחד</h1>' +
    '<p>חנויות ומגדלים פרטיים מציגים זה לצד זה. משווים מחירים, קוראים ביקורות וקונים ישירות מהמוכר.</p>' +
    '<div class="btns"><a class="btn buy" href="#/browse">לכל המודעות</a><a class="btn ghost" href="#/register?role=shop">פתיחת חנות בחינם</a></div>' +
    '<div class="stats"><div><b>' + db.shops.length + '</b><span>חנויות ומגדלים</span></div><div><b>' + live.length + '</b><span>מודעות פעילות</span></div><div><b>' + Object.keys(SPECIES).length + '</b><span>מינים</span></div></div></div>' +
    '<div class="hero-img"><img src="img/crested-1.jpg" alt="שממית מצויצת על ענף"></div></section>' +
    sec('קטגוריות', '', '<div class="cats">' + CATS.map(c => '<a class="cat" href="#/browse?cat=' + c.id + '"><div class="pic">' +
      (c.img ? '<img loading="lazy" src="' + c.img + '" alt="">' : c.icon) + '</div><b>' + c.he + '</b><small>' + live.filter(p => p.cat === c.id).length + ' מודעות</small></a>').join('') + '</div>') +
    sec('חדשים באתר', '#/browse', grid(newest)) +
    (deals.length ? sec('מבצעים', '#/browse?sale=1', grid(deals)) : '') +
    (breeders.length ? sec('ממגדלים פרטיים', '#/browse?type=breeder', grid(breeders)) : '') +
    '<div class="sec-head"><h2>חנויות מובילות</h2><a href="#/shops">לכל החנויות ←</a></div><div class="shops">' + top.map(shopCard).join('') + '</div>' +
    sec('למה Scales', '', '<div class="how">' +
      '<div class="panel"><b class="ic">🔎</b><h3>מוצאים בקלות</h3><p class="mute">כל המוכרים במקום אחד, גם מגדלים פרטיים שעד היום הגיעו אליהם רק דרך מכרים.</p></div>' +
      '<div class="panel"><b class="ic">⚖️</b><h3>משווים מחירים</h3><p class="mute">בכל מודעה מופיעה טבלה של מוכרים אחרים שמציעים את אותו מין או מוצר.</p></div>' +
      '<div class="panel"><b class="ic">⭐</b><h3>קונים בביטחון</h3><p class="mute">ביקורות של קונים על כל מוכר, ופנייה ישירה למוכר לפני הקנייה.</p></div></div>') };
}

/* ---------- browse ---------- */
function filterProducts(q) {
  let list = liveProducts();
  if (q.cat) list = list.filter(p => p.cat === q.cat);
  if (q.species) list = list.filter(p => p.species === q.species);
  if (q.sex) list = list.filter(p => p.sex === q.sex);
  if (q.min) list = list.filter(p => p.price >= +q.min);
  if (q.max) list = list.filter(p => p.price <= +q.max);
  if (q.region) list = list.filter(p => shopOf(p).region === q.region);
  if (q.type) list = list.filter(p => shopOf(p).type === q.type);
  if (q.sale) list = list.filter(p => p.oldPrice > p.price);
  if (q.q) {
    const words = q.q.trim().toLowerCase().split(/\s+/);
    list = list.filter(p => {
      const sp = SPECIES[p.species];
      const hay = [p.title, p.morph, p.desc, shopOf(p).name, shopOf(p).en, sp ? sp.he + ' ' + sp.lat : '', catOf(p.cat).he].join(' ').toLowerCase();
      return words.every(w => hay.includes(w));
    });
  }
  const sort = q.sort || 'new';
  list.sort(sort === 'cheap' ? (a, b) => a.price - b.price : sort === 'dear' ? (a, b) => b.price - a.price : (a, b) => b.created - a.created);
  return list;
}
function viewBrowse(q) {
  const list = filterProducts(q);
  const opt = (v, label, cur) => '<option value="' + esc(v) + '"' + (cur === v ? ' selected' : '') + '>' + esc(label) + '</option>';
  const species = Object.keys(SPECIES).filter(k => !q.cat || SPECIES[k].cat === q.cat);
  const title = q.q ? 'תוצאות חיפוש: ' + q.q : q.cat ? catOf(q.cat).he : q.sale ? 'מבצעים' : 'כל המודעות';
  const chips = [];
  const drop = k => { const o = Object.assign({}, q); delete o[k]; return href('/browse', o); };
  if (q.q) chips.push(['q', '״' + q.q + '״']);
  if (q.species && SPECIES[q.species]) chips.push(['species', SPECIES[q.species].he]);
  if (q.sex) chips.push(['sex', SEX[q.sex]]);
  if (q.region) chips.push(['region', q.region]);
  if (q.type) chips.push(['type', TYPE[q.type]]);
  if (q.sale) chips.push(['sale', 'מבצעים בלבד']);
  if (q.min) chips.push(['min', 'מ־' + money(q.min)]);
  if (q.max) chips.push(['max', 'עד ' + money(q.max)]);
  return { title, html:
    '<div class="browse"><details class="filters"' + (window.innerWidth > 820 ? ' open' : '') + '><summary>סינון</summary>' +
    '<form class="form" data-form="filter" data-auto><input type="hidden" name="q" value="' + esc(q.q || '') + '">' +
    '<label class="field"><span>קטגוריה</span><select name="cat">' + opt('', 'כל הקטגוריות', q.cat || '') + CATS.map(c => opt(c.id, c.he, q.cat)).join('') + '</select></label>' +
    (species.length ? '<label class="field"><span>מין</span><select name="species">' + opt('', 'כל המינים', q.species || '') + species.map(k => opt(k, SPECIES[k].he, q.species)).join('') + '</select></label>' : '') +
    '<label class="field"><span>זכר / נקבה</span><select name="sex">' + opt('', 'הכול', q.sex || '') + opt('male', 'זכר', q.sex) + opt('female', 'נקבה', q.sex) + opt('unknown', 'לא ידוע', q.sex) + '</select></label>' +
    '<div class="field"><span>מחיר (₪)</span><div class="pair"><input type="number" name="min" min="0" placeholder="מ־" aria-label="מחיר מינימלי" value="' + esc(q.min || '') + '">' +
    '<input type="number" name="max" min="0" placeholder="עד" aria-label="מחיר מקסימלי" value="' + esc(q.max || '') + '"></div></div>' +
    '<label class="field"><span>אזור</span><select name="region">' + opt('', 'כל הארץ', q.region || '') + REGIONS.map(r => opt(r, r, q.region)).join('') + '</select></label>' +
    '<label class="field"><span>סוג מוכר</span><select name="type">' + opt('', 'כל המוכרים', q.type || '') + opt('shop', 'חנויות', q.type) + opt('breeder', 'מגדלים פרטיים', q.type) + '</select></label>' +
    '<label class="check"><input type="checkbox" name="sale" value="1"' + (q.sale ? ' checked' : '') + '> מבצעים בלבד</label>' +
    '<input type="hidden" name="sort" value="' + esc(q.sort || '') + '">' +
    '<button class="btn primary">סינון</button><a class="btn" href="#/browse">ניקוי הכול</a></form></details>' +
    '<section><div class="toolbar"><div><h1 style="margin:0">' + esc(title) + '</h1><span class="mute">' + list.length + ' מודעות</span></div>' +
    '<label class="pair"><span class="small">מיון:</span><select data-sort aria-label="מיון">' + opt('new', 'החדשים ביותר', q.sort || 'new') + opt('cheap', 'מחיר: מהזול ליקר', q.sort) + opt('dear', 'מחיר: מהיקר לזול', q.sort) + '</select></label></div>' +
    (chips.length ? '<div class="chips">' + chips.map(([k, l]) => '<a class="chip" href="' + drop(k) + '" aria-label="הסרת הסינון ' + esc(l) + '">' + esc(l) + ' ✕</a>').join('') + '</div>' : '') +
    grid(list) + '</section></div>' };
}

/* ---------- product ---------- */
function viewProduct(id) {
  const p = db.products.find(x => x.id === id);
  if (!p) return null;
  const s = shopOf(p), sp = SPECIES[p.species], cat = catOf(p.cat);
  const sale = p.oldPrice > p.price;
  const available = p.status === 'active' && p.qty > 0;
  const imgs = p.images.length ? p.images : [imgOf(p)];
  const rivals = liveProducts().filter(x => (p.species ? x.species === p.species : x.title === p.title)).sort((a, b) => a.price - b.price).slice(0, 8);
  const cheapest = rivals.length > 1 && rivals[0].price === p.price;
  const more = liveProducts().filter(x => x.shopId === s.id && x.id !== p.id).slice(0, 5);
  const row = (k, v) => v ? '<tr><th scope="row">' + k + '</th><td>' + v + '</td></tr>' : '';
  const mine = me && me.shopId === s.id;
  return { title: p.title, html:
    '<div class="crumbs"><a href="#/">דף הבית</a> › <a href="#/browse?cat=' + cat.id + '">' + cat.he + '</a>' +
    (sp ? ' › <a href="' + href('/browse', { cat: cat.id, species: p.species }) + '">' + sp.he + '</a>' : '') + '</div>' +
    '<div class="pp"><div class="gallery"><div class="main"><img id="pp-main" src="' + esc(imgs[0]) + '" alt="' + esc(p.title) + '"></div>' +
    (imgs.length > 1 ? '<div class="thumbs">' + imgs.map((u, i) => '<button type="button" class="' + (i ? '' : 'on') + '" data-act="thumb" data-src="' + esc(u) + '" aria-label="תמונה ' + (i + 1) + '"><img src="' + esc(u) + '" alt=""></button>').join('') + '</div>' : '') +
    (p.images.some(u => u.startsWith('img/')) ? '<p class="small"><a href="#/credits">קרדיט לצילום</a></p>' : '') + '</div>' +
    '<div><h1>' + esc(p.title) + '</h1>' + (sp ? '<p class="mute ltr" style="margin:-6px 0 8px"><i>' + sp.lat + '</i></p>' : '') +
    '<div class="actions">' + (sale ? '<span class="badge red">מבצע</span>' : '') + (cheapest ? '<span class="badge green">המחיר הזול באתר</span>' : '') +
    (s.type === 'breeder' ? '<span class="badge blue">מגדל פרטי</span>' : '') + (!available ? '<span class="badge">לא זמין</span>' : '') + '</div>' +
    '<table class="traits">' + row('קטגוריה', cat.he) + row('מין', sp ? sp.he : '') + row('מורף / צבע', esc(p.morph)) + row('זכר / נקבה', p.sex ? SEX[p.sex] : '') +
    row('שנת לידה', p.birth || '') + row('משקל', p.weight ? p.weight + ' גרם' : '') + row('פורסם', fdate(p.created)) + '</table>' +
    '<h3>תיאור</h3><p style="white-space:pre-line">' + esc(p.desc) + '</p></div>' +
    '<aside class="panel buybox"><div class="price' + (sale ? ' sale' : '') + '">' + money(p.price) + (sale ? '<s>' + money(p.oldPrice) + '</s>' : '') + '</div>' +
    '<div class="small ' + (available ? '' : 'mute') + '">' + (available ? (p.qty > 1 ? 'במלאי: ' + p.qty + ' יחידות' : 'יחידה אחרונה') : 'המודעה אינה זמינה כרגע') + '</div>' +
    '<div class="small mute">' + [s.pickup ? 'איסוף עצמי' + (s.city ? ' מ' + esc(s.city) : '') : '', s.delivery ? 'משלוח ' + money(s.shipPrice) : ''].filter(Boolean).join(' · ') + '</div>' +
    (mine ? '<a class="btn primary block" href="#/dash/edit/' + p.id + '">עריכת המודעה</a>'
      : available ? '<button type="button" class="btn buy block" data-act="add" data-id="' + p.id + '">הוספה לעגלה</button>' +
        '<button type="button" class="btn primary block" data-act="buynow" data-id="' + p.id + '">קנייה עכשיו</button>' : '') +
    '<button type="button" class="btn block" data-act="fav" data-id="' + p.id + '">' + (me && me.favs.includes(p.id) ? '♥ שמור במועדפים' : '♡ שמירה במועדפים') + '</button>' +
    '<hr style="width:100%;border:0;border-top:1px solid var(--line)">' +
    '<a class="seller-mini" href="#/s/' + s.slug + '">' + shopLogo(s, 46) + '<span><b>' + esc(s.name) + '</b><br>' + ratingHtml(s.id) + '</span></a>' +
    (mine ? '' : '<form class="form" data-form="ask" data-id="' + p.id + '"><label class="field"><span>שאלה למוכר</span>' +
      '<textarea name="text" required maxlength="600" placeholder="למשל: אפשר לקבל תמונות של ההורים?"></textarea></label><button class="btn">שליחת הודעה</button></form>') +
    '</aside></div>' +
    (rivals.length > 1 ? '<div class="sec-head"><h2>השוואת מחירים: ' + esc(sp ? sp.he : p.title) + '</h2><span class="mute small">' + rivals.length + ' הצעות, מהזול ליקר</span></div>' +
      '<div class="tscroll"><table class="list"><thead><tr><th>מודעה</th><th>מוכר</th><th>אזור</th><th>מחיר</th><th></th></tr></thead><tbody>' +
      rivals.map(x => { const xs = shopOf(x); return '<tr' + (x.id === p.id ? ' class="me"' : '') + '><td>' + esc(x.title) + (x.sex ? ' <span class="small mute">' + SEX[x.sex] + '</span>' : '') + '</td>' +
        '<td><a href="#/s/' + xs.slug + '">' + esc(xs.name) + '</a> <span class="badge ' + (xs.type === 'breeder' ? 'blue' : 'gold') + '">' + TYPE[xs.type] + '</span></td>' +
        '<td>' + esc(xs.city || 'כל הארץ') + '</td><td><b>' + money(x.price) + '</b></td><td>' + (x.id === p.id ? '<span class="small mute">המודעה הזו</span>' : '<a class="btn sm" href="#/p/' + x.id + '">לצפייה</a>') + '</td></tr>'; }).join('') +
      '</tbody></table></div>' : '') +
    (more.length ? '<div class="sec-head"><h2>עוד מ' + esc(s.name) + '</h2><a href="#/s/' + s.slug + '">לחנות ←</a></div>' + grid(more) : '') };
}

/* ---------- shops ---------- */
function viewShops(q) {
  let list = db.shops.slice();
  if (q.type) list = list.filter(s => s.type === q.type);
  if (q.region) list = list.filter(s => s.region === q.region);
  list.sort((a, b) => ratingOf(b.id).avg - ratingOf(a.id).avg);
  const tab = (t, label) => '<a href="' + href('/shops', { type: t, region: q.region }) + '"' + ((q.type || '') === t ? ' class="on"' : '') + '>' + label + '</a>';
  return { title: 'חנויות ומגדלים', html:
    '<h1>חנויות ומגדלים</h1><p class="mute">' + db.shops.length + ' מוכרים רשומים. לחיצה על מוכר פותחת את עמוד החנות שלו.</p>' +
    '<div class="tabs">' + tab('', 'כולם') + tab('shop', 'חנויות') + tab('breeder', 'מגדלים פרטיים') + '</div>' +
    '<form class="toolbar" data-form="shopfilter" data-auto><input type="hidden" name="type" value="' + esc(q.type || '') + '"><label class="pair"><span class="small">אזור:</span><select name="region"><option value="">כל הארץ</option>' +
    REGIONS.map(r => '<option' + (q.region === r ? ' selected' : '') + '>' + r + '</option>').join('') + '</select></label></form>' +
    (list.length ? '<div class="shops">' + list.map(shopCard).join('') + '</div>' : '<div class="empty panel"><b>🏪</b>אין מוכרים באזור הזה עדיין.</div>') };
}
function viewShop(slug, q) {
  const s = db.shops.find(x => x.slug === slug);
  if (!s) return null;
  const tab = q.tab || 'products';
  const items = liveProducts().filter(p => p.shopId === s.id).sort((a, b) => b.created - a.created);
  const revs = db.reviews.filter(r => r.shopId === s.id).sort((a, b) => b.date - a.date);
  const mine = me && me.shopId === s.id;
  const t = (id, label) => '<a href="#/s/' + s.slug + '?tab=' + id + '"' + (tab === id ? ' class="on"' : '') + '>' + label + '</a>';
  let body;
  if (tab === 'reviews') {
    const my = me && revs.find(r => r.userId === me.id);
    body = (mine ? '' : me
      ? '<form class="panel form" data-form="review" data-id="' + s.id + '"><h3 style="margin:0">' + (my ? 'עדכון הביקורת שלי' : 'כתיבת ביקורת') + '</h3>' +
        '<label class="field"><span>דירוג</span><select name="rating" style="max-width:200px">' + [5, 4, 3, 2, 1].map(n => '<option value="' + n + '"' + (my && my.rating === n ? ' selected' : '') + '>' + '★'.repeat(n) + ' (' + n + ')</option>').join('') + '</select></label>' +
        '<label class="field"><span>מה דעתך על המוכר?</span><textarea name="text" required maxlength="600">' + esc(my ? my.text : '') + '</textarea></label><div><button class="btn primary">פרסום</button></div></form>'
      : '<p class="note">כדי לכתוב ביקורת צריך <a href="' + href('/login', { next: '/s/' + s.slug + '?tab=reviews' }) + '">להיכנס לחשבון</a>.</p>') +
      '<div style="margin-top:16px">' + (revs.length ? revs.map(r => '<div class="msg"><b>' + esc(r.name) + '</b> ' + stars(r.rating) + ' <span class="small mute">' + fdate(r.date) + '</span><p style="margin:6px 0 0">' + esc(r.text) + '</p></div>').join('') : '<div class="empty panel">אין עדיין ביקורות.</div>') + '</div>';
  } else if (tab === 'about') {
    body = '<div class="panel"><h3>על המוכר</h3><p style="white-space:pre-line">' + esc(s.about) + '</p><h3>משלוחים ואיסוף</h3><p>' +
      [s.pickup ? 'איסוף עצמי' + (s.city ? ' מ' + esc(s.city) : '') : '', s.delivery ? 'משלוח עד הבית: ' + money(s.shipPrice) : ''].filter(Boolean).join(' · ') + '</p>' +
      (s.policy ? '<h3>מדיניות</h3><p style="white-space:pre-line">' + esc(s.policy) + '</p>' : '') +
      (s.phone ? '<h3>טלפון</h3><p class="ltr">' + esc(s.phone) + '</p>' : '') + '<p class="small mute">באתר מאז ' + fdate(s.created) + '</p></div>';
  } else body = grid(items);
  return { title: s.name, html:
    '<div class="shop-ban" style="' + shopBanner(s) + '"></div><div class="shop-head">' + shopLogo(s, 96) +
    '<div class="info"><h1>' + esc(s.name) + ' ' + (s.verified ? '<span class="badge green">מאומת</span>' : '') + '</h1>' +
    '<div class="actions"><span class="badge ' + (s.type === 'breeder' ? 'blue' : 'gold') + '">' + TYPE[s.type] + '</span><span class="mute">📍 ' + esc(s.city || 'משלוחים לכל הארץ') + '</span><span>' + ratingHtml(s.id) + '</span></div></div>' +
    (mine ? '<a class="btn primary" href="#/dash/shop">עיצוב החנות</a>' : '') + '</div>' +
    '<div class="tabs">' + t('products', 'מודעות (' + items.length + ')') + t('reviews', 'ביקורות (' + revs.length + ')') + t('about', 'על המוכר') + '</div>' + body };
}

/* ---------- auth ---------- */
function viewLogin(q) {
  return { title: 'כניסה', html: '<div class="auth panel"><h1>כניסה לחשבון</h1>' +
    '<form class="form" data-form="login"><input type="hidden" name="next" value="' + esc(q.next || '') + '">' +
    '<label class="field"><span>אימייל</span><input type="email" name="email" required autocomplete="username" dir="ltr"></label>' +
    '<label class="field"><span>סיסמה</span><input type="password" name="password" required autocomplete="current-password" dir="ltr"></label>' +
    '<button class="btn primary">כניסה</button></form>' +
    '<p>אין לך חשבון? <a href="' + href('/register', { next: q.next }) + '">הרשמה</a></p>' +
    '<p class="note">רוצים רק לנסות? בעמוד <a href="#/demo">חשבונות לניסיון</a> אפשר להיכנס בלחיצה לכל אחת מהחנויות.</p></div>' };
}
function viewRegister(q) {
  const role = ['shop', 'breeder'].includes(q.role) ? q.role : 'buyer';
  const ch = (v, title, sub) => '<label><input type="radio" name="role" value="' + v + '"' + (role === v ? ' checked' : '') + '> <b>' + title + '</b><small>' + sub + '</small></label>';
  return { title: 'הרשמה', html: '<div class="auth panel"><h1>פתיחת חשבון</h1>' +
    '<form class="form" data-form="register"><input type="hidden" name="next" value="' + esc(q.next || '') + '">' +
    '<fieldset style="border:0;padding:0;margin:0"><legend class="field"><span>סוג החשבון</span></legend><div class="choice">' +
    ch('buyer', 'קונה', 'קנייה, מועדפים וביקורות') + ch('shop', 'חנות', 'עסק שמוכר בעלי חיים או ציוד') + ch('breeder', 'מגדל פרטי', 'מכירה מגידול ביתי') + '</div></fieldset>' +
    '<label class="field"><span>שם מלא</span><input type="text" name="name" required maxlength="60" autocomplete="name"></label>' +
    '<label class="field"><span>אימייל</span><input type="email" name="email" required autocomplete="username" dir="ltr"></label>' +
    '<label class="field"><span>סיסמה <em>לפחות 6 תווים</em></span><input type="password" name="password" required minlength="6" autocomplete="new-password" dir="ltr"></label>' +
    '<div id="seller-fields" class="form' + (role === 'buyer' ? ' hidden' : '') + '">' +
    '<label class="field"><span>שם החנות</span><input type="text" name="shopName" maxlength="60"></label>' +
    '<div class="row"><label class="field"><span>עיר</span><input type="text" name="city" maxlength="40"></label>' +
    '<label class="field"><span>אזור</span><select name="region"><option value="">בחירה</option>' + REGIONS.map(r => '<option>' + r + '</option>').join('') + '</select></label></div></div>' +
    '<p class="note">זהו אתר הדגמה: הנתונים נשמרים רק בדפדפן הזה, והסיסמה אינה מוצפנת. אל תשתמשו בסיסמה אמיתית.</p>' +
    '<button class="btn primary">הרשמה</button></form><p>כבר רשומים? <a href="#/login">כניסה</a></p></div>' };
}
function viewDemo() {
  const rows = db.users.map(u => {
    const s = u.shopId ? shopById(u.shopId) : null;
    const kind = u.role === 'admin' ? 'מנהל האתר' : u.role === 'buyer' ? 'קונה' : s ? TYPE[s.type] : 'מוכר';
    return '<tr><td>' + (s ? '<a href="#/s/' + s.slug + '">' + esc(s.name) + '</a>' : esc(u.name)) + '</td><td>' + kind + '</td>' +
      '<td><span class="ltr">' + esc(u.email) + '</span></td><td><span class="ltr">' + esc(u.password) + '</span></td>' +
      '<td><button type="button" class="btn sm primary" data-act="quick" data-id="' + u.id + '">כניסה מהירה</button></td></tr>';
  }).join('');
  return { title: 'חשבונות לניסיון', html: '<h1>חשבונות לניסיון</h1>' +
    '<p class="mute">כל החשבונות באתר הדמו. לחיצה על "כניסה מהירה" מכניסה לחשבון בלי להקליד סיסמה.</p>' +
    '<div class="tscroll"><table class="list"><thead><tr><th>חשבון</th><th>סוג</th><th>אימייל</th><th>סיסמה</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div>' };
}

/* ---------- cart / checkout ---------- */
function cartLines() {
  db.cart = db.cart.filter(c => db.products.some(p => p.id === c.pid && p.status === 'active' && p.qty > 0));
  return db.cart.map(c => { const p = db.products.find(x => x.id === c.pid); c.qty = Math.min(c.qty, p.qty); return { p, qty: c.qty }; });
}
function cartGroups() {
  const groups = [];
  cartLines().forEach(l => {
    let g = groups.find(x => x.shop.id === l.p.shopId);
    if (!g) groups.push(g = { shop: shopOf(l.p), lines: [], sub: 0 });
    g.lines.push(l); g.sub += l.p.price * l.qty;
  });
  return groups;
}
function viewCart() {
  const groups = cartGroups();
  if (!groups.length) return { title: 'עגלת הקניות', html: '<div class="empty panel"><b>🛒</b>העגלה ריקה. <a href="#/browse">לכל המודעות</a></div>' };
  const total = groups.reduce((a, g) => a + g.sub, 0);
  return { title: 'עגלת הקניות', html: '<h1>עגלת הקניות</h1><div class="cart"><div>' + groups.map(g =>
    '<div class="panel"><a class="seller-mini" href="#/s/' + g.shop.slug + '">' + shopLogo(g.shop, 30) + '<b>' + esc(g.shop.name) + '</b></a>' +
    g.lines.map(l => '<div class="cart-item"><a href="#/p/' + l.p.id + '"><img src="' + esc(imgOf(l.p)) + '" alt=""></a>' +
      '<div><a href="#/p/' + l.p.id + '"><b>' + esc(l.p.title) + '</b></a><div class="small mute">' + money(l.p.price) + ' ליחידה</div></div>' +
      '<div class="end actions"><input type="number" min="1" max="' + l.p.qty + '" value="' + l.qty + '" data-qty="' + l.p.id + '" aria-label="כמות">' +
      '<b>' + money(l.p.price * l.qty) + '</b><button type="button" class="btn sm danger" data-act="rm" data-id="' + l.p.id + '">הסרה</button></div></div>').join('') + '</div>').join('') +
    '</div><aside class="panel"><h2>סיכום</h2><div class="sum-row"><span>מוצרים</span><span>' + money(total) + '</span></div>' +
    '<div class="sum-row mute small"><span>משלוח</span><span>ייבחר בשלב הבא</span></div><div class="sum-row total"><span>סה״כ ביניים</span><span>' + money(total) + '</span></div>' +
    '<p class="small mute">ההזמנה מתחלקת לפי מוכר: כל מוכר מקבל הזמנה נפרדת.</p><a class="btn buy block" href="#/checkout">המשך לקופה</a></aside></div>' };
}
function viewCheckout() {
  const groups = cartGroups();
  if (!groups.length) return viewCart();
  const total = groups.reduce((a, g) => a + g.sub, 0);
  return { title: 'קופה', html: '<h1>קופה</h1><form class="cart" data-form="checkout"><div>' +
    '<div class="panel form"><h2 style="margin:0">פרטי המזמין</h2><div class="row">' +
    '<label class="field"><span>שם מלא</span><input type="text" name="name" required value="' + esc(me.name) + '" autocomplete="name"></label>' +
    '<label class="field"><span>טלפון</span><input type="tel" name="phone" required value="' + esc(me.phone) + '" dir="ltr" autocomplete="tel"></label></div><div class="row">' +
    '<label class="field"><span>עיר</span><input type="text" name="city" required value="' + esc(me.city) + '"></label>' +
    '<label class="field"><span>כתובת <em>למשלוח</em></span><input type="text" name="address" autocomplete="street-address"></label></div></div>' +
    groups.map(g => '<div class="panel form"><h3 style="margin:0">' + esc(g.shop.name) + ' <span class="mute small">' + g.lines.length + ' פריטים · ' + money(g.sub) + '</span></h3>' +
      '<label class="field"><span>איך לקבל את ההזמנה?</span><select name="ship_' + g.shop.id + '" data-ship="' + g.shop.shipPrice + '">' +
      (g.shop.pickup ? '<option value="pickup">איסוף עצמי' + (g.shop.city ? ' מ' + esc(g.shop.city) : '') + ' (חינם)</option>' : '') +
      (g.shop.delivery ? '<option value="delivery">משלוח עד הבית (' + money(g.shop.shipPrice) + ')</option>' : '') + '</select></label></div>').join('') +
    '<div class="panel"><h3>תשלום</h3><p class="note" style="margin:0">אתר הדגמה: לא מתבצע חיוב. ההזמנה תופיע אצל המוכר בלוח הניהול.</p></div></div>' +
    '<aside class="panel"><h2>סיכום הזמנה</h2><div class="sum-row"><span>מוצרים</span><span>' + money(total) + '</span></div>' +
    '<div class="sum-row"><span>משלוח</span><span id="co-ship">' + money(0) + '</span></div>' +
    '<div class="sum-row total"><span>סה״כ</span><span id="co-total" data-sub="' + total + '">' + money(total) + '</span></div><button class="btn buy block" style="margin-top:12px">ביצוע הזמנה</button></aside></form>' };
}
function updateCheckoutTotal() {
  const tot = $('#co-total'); if (!tot) return;
  let ship = 0;
  document.querySelectorAll('select[data-ship]').forEach(s => { if (s.value === 'delivery') ship += +s.dataset.ship; });
  $('#co-ship').textContent = money(ship);
  tot.textContent = money(+tot.dataset.sub + ship);
}

/* ---------- account ---------- */
function orderHtml(o, forSeller) {
  const s = shopById(o.shopId);
  return '<div class="msg"><div class="toolbar" style="margin:0"><div><b>הזמנה ' + esc(o.num) + '</b> <span class="small mute">' + fdate(o.date) + '</span> ' +
    '<span class="badge ' + (o.status === 'cancelled' ? 'red' : o.status === 'done' ? 'green' : 'gold') + '">' + ORDER_STATUS[o.status] + '</span><br>' +
    (forSeller ? '<span class="small">' + esc(o.addr.name) + ' · <span class="ltr">' + esc(o.addr.phone) + '</span> · ' + esc(o.addr.city) + (o.addr.address ? ', ' + esc(o.addr.address) : '') + '</span>'
      : '<span class="small">מוכר: ' + (s ? '<a href="#/s/' + s.slug + '">' + esc(s.name) + '</a>' : 'חנות שנמחקה') + '</span>') + '</div>' +
    '<div><b>' + money(o.total) + '</b><div class="small mute">' + (o.ship === 'delivery' ? 'משלוח ' + money(o.shipPrice) : 'איסוף עצמי') + '</div></div></div>' +
    '<ul style="margin:8px 0 0;padding-inline-start:20px">' + o.items.map(i => '<li>' + esc(i.title) + ' × ' + i.qty + ' · ' + money(i.price * i.qty) + '</li>').join('') + '</ul>' +
    (forSeller && !['done', 'cancelled'].includes(o.status) ? '<div class="actions" style="margin-top:10px">' +
      ({ new: [['confirmed', 'אישור הזמנה']], confirmed: [['shipped', 'סימון כנשלחה'], ['done', 'סימון כהושלמה']], shipped: [['done', 'סימון כהושלמה']] }[o.status] || [])
        .map(([st, label]) => '<button type="button" class="btn sm primary" data-act="ostatus" data-id="' + o.id + '" data-st="' + st + '">' + label + '</button>').join('') +
      '<button type="button" class="btn sm danger" data-act="ostatus" data-id="' + o.id + '" data-st="cancelled">ביטול</button></div>' : '') + '</div>';
}
function messageHtml(m, forSeller) {
  const p = db.products.find(x => x.id === m.pid), s = shopById(m.shopId);
  return '<div class="msg"><div class="small mute">' + fdate(m.date) + ' · ' + (forSeller ? 'מאת ' + esc(m.fromName) : 'אל ' + esc(s ? s.name : '')) +
    (p ? ' · על <a href="#/p/' + p.id + '">' + esc(p.title) + '</a>' : '') + '</div><p style="margin:6px 0 0;white-space:pre-line">' + esc(m.text) + '</p>' +
    (m.reply ? '<div class="reply"><b>תשובת המוכר:</b> <span style="white-space:pre-line">' + esc(m.reply) + '</span></div>'
      : forSeller ? '<form class="form" data-form="reply" data-id="' + m.id + '" style="margin-top:8px"><textarea name="text" required maxlength="600" aria-label="תשובה" placeholder="תשובה לקונה"></textarea><div><button class="btn sm primary">שליחת תשובה</button></div></form>'
      : '<div class="small mute" style="margin-top:6px">ממתין לתשובת המוכר</div>') + '</div>';
}
function viewAccount(q) {
  const tab = q.tab || 'orders';
  const t = (id, label) => '<a href="#/account?tab=' + id + '"' + (tab === id ? ' class="on"' : '') + '>' + label + '</a>';
  const orders = db.orders.filter(o => o.buyerId === me.id).sort((a, b) => b.date - a.date);
  const msgs = db.messages.filter(m => m.fromId === me.id).sort((a, b) => b.date - a.date);
  let body;
  if (tab === 'profile') body = '<form class="panel form" data-form="profile" style="max-width:560px">' +
    '<label class="field"><span>שם מלא</span><input type="text" name="name" required maxlength="60" value="' + esc(me.name) + '"></label>' +
    '<label class="field"><span>אימייל</span><input type="email" value="' + esc(me.email) + '" disabled dir="ltr"></label>' +
    '<div class="row"><label class="field"><span>טלפון</span><input type="tel" name="phone" value="' + esc(me.phone) + '" dir="ltr"></label>' +
    '<label class="field"><span>עיר</span><input type="text" name="city" value="' + esc(me.city) + '"></label></div>' +
    '<label class="field"><span>סיסמה חדשה <em>להשאיר ריק כדי לא לשנות</em></span><input type="password" name="password" minlength="6" autocomplete="new-password" dir="ltr"></label>' +
    '<div><button class="btn primary">שמירה</button></div></form>';
  else if (tab === 'messages') body = msgs.length ? msgs.map(m => messageHtml(m, false)).join('') : '<div class="empty panel"><b>✉️</b>עוד לא שלחת הודעות למוכרים.</div>';
  else body = orders.length ? orders.map(o => orderHtml(o, false)).join('') : '<div class="empty panel"><b>📦</b>עוד אין הזמנות. <a href="#/browse">לכל המודעות</a></div>';
  return { title: 'החשבון שלי', html: '<h1>החשבון שלי</h1><div class="tabs">' + t('orders', 'ההזמנות שלי (' + orders.length + ')') + t('messages', 'הודעות למוכרים (' + msgs.length + ')') + t('profile', 'פרטים אישיים') + '</div>' + body };
}
function viewFavorites() {
  const list = me.favs.map(id => db.products.find(p => p.id === id)).filter(Boolean);
  return { title: 'מועדפים', html: '<h1>המועדפים שלי</h1>' + (list.length ? grid(list) : '<div class="empty panel"><b>♡</b>עוד לא שמרת מודעות. לחיצה על הלב בכל מודעה שומרת אותה כאן.</div>') };
}
function viewAbout() {
  return { title: 'איך זה עובד', html: '<div class="panel" style="max-width:820px;margin:auto"><h1>איך Scales עובד</h1>' +
    '<p>היום קונים זוחלים וציוד בישראל בשתי דרכים: בחנויות, שבהן המחירים גבוהים, או אצל מגדלים פרטיים, שקשה למצוא בלי להכיר מישהו בקהילה. Scales מרכז את כולם באתר אחד.</p>' +
    '<h3>לקונים</h3><p>מחפשים לפי מין, מורף, מחיר או אזור, משווים בין מוכרים, קוראים ביקורות ושולחים שאלה למוכר לפני שמזמינים.</p>' +
    '<h3>למוכרים</h3><p>חנות או מגדל פרטי פותחים חשבון בחינם, מעצבים את עמוד החנות עם לוגו ותמונת נושא, ומעלים מודעות עם תמונות. הזמנות והודעות מגיעות ללוח הניהול.</p>' +
    '<h3>מה זה הדמו הזה</h3><p>האתר רץ כולו בדפדפן, בלי שרת. הנתונים נשמרים במחשב שלך בלבד, אין תשלומים אמיתיים, והסיסמאות אינן מוצפנות. גרסה אמיתית תצטרך שרת, אימות משתמשים, אחסון תמונות ותשלומים.</p>' +
    '<p><a class="btn primary" href="#/demo">לחשבונות לניסיון</a></p></div>' };
}
function viewCredits() {
  return { title: 'קרדיט לתמונות', html: '<h1>קרדיט לתמונות</h1><p class="mute">התמונות באתר הן ברישיון חופשי מוויקישיתוף.</p>' +
    '<div class="tscroll"><table class="list"><thead><tr><th></th><th>קובץ</th><th>צלם</th><th>רישיון</th></tr></thead><tbody>' +
    CREDITS.map(c => '<tr><td><img class="mini" loading="lazy" src="' + esc(c.src) + '" alt=""></td><td><a class="ltr" href="' + esc(c.page) + '" target="_blank" rel="noopener">' + esc(c.title.replace(/^File:/, '')) + '</a></td>' +
      '<td><span class="ltr">' + esc(c.artist) + '</span></td><td><span class="ltr">' + esc(c.license) + '</span></td></tr>').join('') + '</tbody></table></div>' };
}

/* ---------- actions ---------- */
function login(u, next) {
  db.session = u.id; me = u; save();
  toast('שלום, ' + u.name);
  go(next || (u.role === 'seller' ? '/dash' : u.role === 'admin' ? '/admin' : '/'));
}
function addToCart(id) {
  const p = db.products.find(x => x.id === id);
  if (!p || p.status !== 'active' || p.qty < 1) { toast('המודעה אינה זמינה', true); return false; }
  const c = db.cart.find(x => x.pid === id);
  if (c) { if (c.qty >= p.qty) { toast('אין יחידות נוספות במלאי', true); return true; } c.qty++; } else db.cart.push({ pid: id, qty: 1 });
  save(); return true;
}
const ACTS = {
  logout() { db.session = null; me = null; save(); toast('יצאת מהחשבון'); go('/'); },
  reset() { if (confirm('לאפס את כל נתוני הדמו? חשבונות, חנויות ומודעות שיצרת יימחקו.')) { localStorage.removeItem(KEY); load(); toast('נתוני הדמו אופסו'); go('/'); } },
  quick(el) { const u = db.users.find(x => x.id === el.dataset.id); if (u) login(u); },
  fav(el) {
    if (!me) { toast('כדי לשמור מועדפים צריך להיכנס לחשבון'); return go('/login', { next: location.hash.replace(/^#/, '') }); }
    const i = me.favs.indexOf(el.dataset.id);
    if (i < 0) me.favs.push(el.dataset.id); else me.favs.splice(i, 1);
    save(); toast(i < 0 ? 'נשמר במועדפים' : 'הוסר מהמועדפים'); render();
  },
  add(el) { if (addToCart(el.dataset.id)) { toast('נוסף לעגלה'); render(); } },
  buynow(el) { if (addToCart(el.dataset.id)) go('/checkout'); },
  rm(el) { db.cart = db.cart.filter(c => c.pid !== el.dataset.id); save(); render(); },
  thumb(el) { $('#pp-main').src = el.dataset.src; el.parentNode.querySelectorAll('button').forEach(b => b.classList.toggle('on', b === el)); },
};
const FORMS = {
  search(d) { go('/browse', { q: d.q.trim(), cat: d.cat }); },
  filter(d) { if (d.species && d.cat && SPECIES[d.species] && SPECIES[d.species].cat !== d.cat) d.species = ''; go('/browse', d); },
  shopfilter(d) { go('/shops', d); },
  login(d) {
    const u = db.users.find(x => x.email.toLowerCase() === d.email.trim().toLowerCase() && x.password === d.password);
    if (!u) return toast('אימייל או סיסמה שגויים', true);
    login(u, d.next);
  },
  register(d) {
    const email = d.email.trim().toLowerCase();
    if (db.users.some(u => u.email.toLowerCase() === email)) return toast('כבר קיים חשבון עם האימייל הזה', true);
    const seller = d.role === 'shop' || d.role === 'breeder';
    if (seller && !d.shopName.trim()) return toast('חסר שם לחנות', true);
    const u = { id: uid('u'), name: d.name.trim(), email, password: d.password, role: seller ? 'seller' : 'buyer', shopId: '', phone: '', city: (d.city || '').trim(), favs: [], created: Date.now() };
    if (seller) {
      const s = { id: uid('s'), slug: 'shop-' + Date.now().toString(36), name: d.shopName.trim(), en: '', type: d.role, ownerId: u.id, city: u.city, region: d.region || '',
        icon: d.role === 'breeder' ? '🦎' : '🏪', color: '#25a862', logo: '', banner: '', phone: '', about: '', pickup: true, delivery: false, shipPrice: 35, policy: '', verified: false, created: Date.now() };
      u.shopId = s.id; db.shops.push(s);
    }
    db.users.push(u);
    login(u, seller ? '/dash/shop' : d.next);
  },
  profile(d) {
    me.name = d.name.trim() || me.name; me.phone = d.phone.trim(); me.city = d.city.trim();
    if (d.password) me.password = d.password;
    save(); toast('הפרטים נשמרו'); render();
  },
  ask(d, f) {
    if (!me) { toast('כדי לשלוח הודעה צריך להיכנס לחשבון'); return go('/login', { next: location.hash.replace(/^#/, '') }); }
    const p = db.products.find(x => x.id === f.dataset.id);
    db.messages.push({ id: uid('m'), pid: p.id, shopId: p.shopId, fromId: me.id, fromName: me.name, text: d.text.trim(), date: Date.now(), reply: '' });
    save(); f.reset(); toast('ההודעה נשלחה למוכר. התשובה תופיע בחשבון שלך.');
  },
  review(d, f) {
    const shopId = f.dataset.id;
    db.reviews = db.reviews.filter(r => !(r.shopId === shopId && r.userId === me.id));
    db.reviews.push({ id: uid('r'), shopId, userId: me.id, name: me.name, rating: Math.min(5, Math.max(1, +d.rating)), text: d.text.trim(), date: Date.now() });
    save(); toast('הביקורת פורסמה'); render();
  },
  checkout(d) {
    const groups = cartGroups();
    if (!groups.length) return go('/cart');
    if (groups.some(g => d['ship_' + g.shop.id] === 'delivery') && !d.address.trim()) return toast('חסרה כתובת למשלוח', true);
    me.phone = d.phone.trim(); me.city = d.city.trim();
    groups.forEach(g => {
      const ship = d['ship_' + g.shop.id] === 'delivery' && g.shop.delivery ? 'delivery' : 'pickup';
      const shipPrice = ship === 'delivery' ? g.shop.shipPrice : 0;
      db.orders.push({ id: uid('o'), num: '#' + (1000 + db.orders.length + 1), buyerId: me.id, shopId: g.shop.id, date: Date.now(), status: 'new', ship, shipPrice,
        items: g.lines.map(l => ({ pid: l.p.id, title: l.p.title, price: l.p.price, qty: l.qty })), total: g.sub + shipPrice,
        addr: { name: d.name.trim(), phone: d.phone.trim(), city: d.city.trim(), address: d.address.trim() } });
      g.lines.forEach(l => { l.p.qty -= l.qty; if (l.p.qty <= 0) { l.p.qty = 0; l.p.status = 'sold'; } });
    });
    db.cart = []; save();
    toast('ההזמנה בוצעה. המוכרים קיבלו אותה.');
    go('/account', { tab: 'orders' });
  },
};

/* ---------- events ---------- */
document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]');
  if (!el || !ACTS[el.dataset.act]) return;
  e.preventDefault(); ACTS[el.dataset.act](el, e);
});
document.addEventListener('submit', e => {
  const f = e.target.closest('form[data-form]');
  if (!f || !FORMS[f.dataset.form]) return;
  e.preventDefault(); FORMS[f.dataset.form](Object.fromEntries(new FormData(f)), f);
});
document.addEventListener('change', e => {
  const t = e.target;
  if (t.matches('[data-upload]')) return handleUpload(t);
  if (t.matches('[data-sort]')) { const q = parseHash().q; q.sort = t.value; return go('/browse', q); }
  if (t.matches('[data-qty]')) {
    const c = db.cart.find(x => x.pid === t.dataset.qty);
    if (c) { c.qty = Math.max(1, Math.min(+t.value || 1, +t.max || 1)); save(); render(); }
    return;
  }
  if (t.matches('select[data-ship]')) return updateCheckoutTotal();
  if (t.name === 'role' && $('#seller-fields')) return $('#seller-fields').classList.toggle('hidden', t.value === 'buyer');
  if (t.matches('[data-catsel]')) return $('#animal-fields').classList.toggle('hidden', !catOf(t.value).animal);
  const auto = t.closest('form[data-auto]');
  if (auto) auto.requestSubmit();
});
window.addEventListener('hashchange', () => { render(); window.scrollTo(0, 0); $('#main').focus({ preventScroll: true }); });
window.addEventListener('DOMContentLoaded', () => { load(); render(); });
