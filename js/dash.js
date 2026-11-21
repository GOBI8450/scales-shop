'use strict';
/* Scales demo: seller dashboard (shop design, products, orders, messages) and site admin. */

let draft = { key: '', imgs: [], logo: '', banner: '' };

function readImage(file, max) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) return reject(new Error('type'));
    const img = new Image(), url = URL.createObjectURL(file);
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height); ctx.drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url); resolve(c.toDataURL('image/jpeg', 0.8));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('load')); };
    img.src = url;
  });
}
async function handleUpload(input) {
  const kind = input.dataset.upload;
  try {
    if (kind === 'product') {
      for (const f of input.files) { if (draft.imgs.length >= 5) { toast('אפשר להעלות עד 5 תמונות למודעה', true); break; } draft.imgs.push(await readImage(f, 900)); }
      $('#up-thumbs').innerHTML = thumbsHtml();
    } else if (input.files[0]) {
      draft[kind] = await readImage(input.files[0], kind === 'logo' ? 320 : 1400);
      refreshShopPreview();
    }
  } catch (e) { toast('לא הצלחנו לקרוא את הקובץ. צריך קובץ תמונה (JPG, PNG או WebP).', true); }
  input.value = '';
}
const thumbsHtml = () => draft.imgs.length
  ? draft.imgs.map((u, i) => '<figure><img src="' + esc(u) + '" alt="תמונה ' + (i + 1) + '"><button type="button" data-act="rmimg" data-i="' + i + '" aria-label="הסרת תמונה ' + (i + 1) + '">✕</button></figure>').join('')
  : '<span class="small mute">עוד לא נבחרו תמונות. בלי תמונה תוצג אייקון של הקטגוריה.</span>';
function refreshShopPreview() {
  const s = myShop(); if (!s || !$('#prev-ban')) return;
  const f = $('form[data-form=shop]');
  const tmp = Object.assign({}, s, { logo: draft.logo, banner: draft.banner, color: f.color.value, icon: f.icon.value || s.icon });
  $('#prev-ban').style.cssText = shopBanner(tmp);
  $('#prev-logo').innerHTML = shopLogo(tmp, 72);
}

/* ---------- seller dashboard ---------- */
function viewDash(tab, id) {
  if (me.role !== 'seller' || !myShop()) return { title: 'ניהול החנות', html: '<div class="empty panel"><b>🏪</b>לחשבון הזה אין חנות. <a href="#/register?role=shop">פתיחת חנות</a></div>' };
  const s = myShop();
  const prods = db.products.filter(p => p.shopId === s.id).sort(SORTS.best[1]);
  const orders = db.orders.filter(o => o.shopId === s.id).sort((a, b) => b.date - a.date);
  const msgs = db.messages.filter(m => m.shopId === s.id).sort((a, b) => b.date - a.date);
  const newOrders = orders.filter(o => o.status === 'new').length, openMsgs = msgs.filter(m => !m.reply).length;
  const link = (t, label, n) => '<a href="#/dash' + (t === 'home' ? '' : '/' + t) + '"' + (tab === t || (t === 'products' && tab === 'edit') ? ' class="on"' : '') + '>' + label + (n ? ' <span class="badge red">' + n + '</span>' : '') + '</a>';
  let body, title = 'ניהול החנות';

  if (tab === 'products') {
    title = 'המודעות שלי';
    body = '<div class="toolbar"><h1 style="margin:0">המודעות שלי <span class="mute small">(' + prods.length + ')</span></h1><a class="btn primary" href="#/dash/new">+ מודעה חדשה</a></div>' +
      (prods.length ? '<div class="tscroll"><table class="list"><thead><tr><th></th><th>מודעה</th><th>מחיר</th><th>מלאי</th><th>נמכרו</th><th>מצב</th><th>פעולות</th></tr></thead><tbody>' +
        prods.map(p => '<tr><td><img class="mini" src="' + esc(imgOf(p)) + '" alt=""></td><td><a href="#/p/' + p.id + '"><b>' + esc(p.title) + '</b></a><div class="small mute">' + catOf(p.cat).he + '</div></td>' +
          '<td>' + money(p.price) + '</td><td>' + p.qty + '</td><td>' + soldOf(p) + '</td><td><span class="badge ' + (p.status === 'active' ? 'green' : '') + '">' + { active: 'פעילה', hidden: 'מוסתרת', sold: 'נמכרה' }[p.status] + '</span></td>' +
          '<td><div class="actions"><a class="btn sm" href="#/dash/edit/' + p.id + '">עריכה</a>' +
          '<button type="button" class="btn sm" data-act="ptoggle" data-id="' + p.id + '">' + (p.status === 'active' ? 'הסתרה' : 'הפעלה') + '</button>' +
          '<button type="button" class="btn sm danger" data-act="pdel" data-id="' + p.id + '">מחיקה</button></div></td></tr>').join('') + '</tbody></table></div>'
        : '<div class="empty panel"><b>📋</b>עוד אין מודעות. <a href="#/dash/new">פרסום המודעה הראשונה</a></div>');
  } else if (tab === 'new' || tab === 'edit') {
    const p = tab === 'edit' ? prods.find(x => x.id === id) : null;
    if (tab === 'edit' && !p) return null;
    const key = tab + (id || '');
    if (draft.key !== key) draft = { key, imgs: p ? p.images.slice() : [], logo: '', banner: '' };
    const v = p || { title: '', cat: 'snakes', species: '', morph: '', sex: '', birth: '', weight: '', price: '', oldPrice: '', qty: 1, desc: '', status: 'active' };
    const opt = (val, label, cur) => '<option value="' + val + '"' + (cur === val ? ' selected' : '') + '>' + label + '</option>';
    title = p ? 'עריכת מודעה' : 'מודעה חדשה';
    body = '<h1>' + title + '</h1><form class="panel form" data-form="product" data-id="' + (p ? p.id : '') + '">' +
      '<label class="field"><span>כותרת</span><input type="text" name="title" required maxlength="80" value="' + esc(v.title) + '" placeholder="למשל: פיתון מלכותי באנאנה, נקבה 2025"></label>' +
      '<div class="row"><label class="field"><span>קטגוריה</span><select name="cat" data-catsel>' + CATS.map(c => opt(c.id, c.he, v.cat)).join('') + '</select></label>' +
      '<label class="field"><span>מחיר (₪)</span><input type="number" name="price" required min="1" max="999999" value="' + esc(v.price) + '"></label>' +
      '<label class="field"><span>מחיר קודם <em>למבצע, לא חובה</em></span><input type="number" name="oldPrice" min="0" max="999999" value="' + esc(v.oldPrice || '') + '"></label>' +
      '<label class="field"><span>כמות במלאי</span><input type="number" name="qty" required min="0" max="9999" value="' + esc(v.qty) + '"></label></div>' +
      '<div id="animal-fields" class="row' + (catOf(v.cat).animal ? '' : ' hidden') + '">' +
      '<label class="field"><span>מין <em>לא חובה</em></span><select name="species">' + opt('', 'אחר / לא ברשימה', v.species) + Object.keys(SPECIES).map(k => opt(k, SPECIES[k].he, v.species)).join('') + '</select></label>' +
      '<label class="field"><span>מורף / צבע</span><input type="text" name="morph" maxlength="60" value="' + esc(v.morph) + '"></label>' +
      '<label class="field"><span>זכר / נקבה</span><select name="sex">' + opt('', 'לא רלוונטי', v.sex) + opt('male', 'זכר', v.sex) + opt('female', 'נקבה', v.sex) + opt('unknown', 'לא ידוע', v.sex) + '</select></label>' +
      '<label class="field"><span>שנת לידה</span><input type="number" name="birth" min="1990" max="2030" value="' + esc(v.birth || '') + '"></label>' +
      '<label class="field"><span>משקל (גרם)</span><input type="number" name="weight" min="0" max="99999" value="' + esc(v.weight || '') + '"></label></div>' +
      '<label class="field"><span>תיאור</span><textarea name="desc" maxlength="2000" placeholder="מצב בריאותי, האכלה, הורים, מה כלול במחיר">' + esc(v.desc) + '</textarea></label>' +
      '<div class="field"><span>תמונות <em>עד 5, הראשונה היא התמונה הראשית</em></span><div class="up-thumbs" id="up-thumbs">' + thumbsHtml() + '</div>' +
      '<input type="file" accept="image/*" multiple data-upload="product" aria-label="העלאת תמונות"></div>' +
      '<label class="field" style="max-width:240px"><span>מצב המודעה</span><select name="status">' + opt('active', 'פעילה', v.status) + opt('hidden', 'מוסתרת', v.status) + opt('sold', 'נמכרה', v.status) + '</select></label>' +
      '<div class="actions"><button class="btn primary">' + (p ? 'שמירת שינויים' : 'פרסום המודעה') + '</button><a class="btn" href="#/dash/products">ביטול</a></div></form>';
  } else if (tab === 'shop') {
    if (draft.key !== 'shop') draft = { key: 'shop', imgs: [], logo: s.logo, banner: s.banner };
    const tmp = Object.assign({}, s, { logo: draft.logo, banner: draft.banner });
    title = 'עיצוב החנות';
    body = '<div class="toolbar"><h1 style="margin:0">עיצוב החנות</h1><a class="btn" href="#/s/' + s.slug + '">צפייה בעמוד החנות</a></div><form class="form" data-form="shop">' +
      '<div class="panel form"><h2 style="margin:0">מראה</h2><div><div class="prev-ban" id="prev-ban" style="' + shopBanner(tmp) + '"></div>' +
      '<div id="prev-logo" style="margin:-36px 16px 0;position:relative">' + shopLogo(tmp, 72) + '</div></div><div class="row">' +
      '<div class="field"><span>לוגו <em>תמונה מרובעת</em></span><input type="file" accept="image/*" data-upload="logo" aria-label="העלאת לוגו"><button type="button" class="btn sm" data-act="clearimg" data-k="logo">הסרת הלוגו</button></div>' +
      '<div class="field"><span>תמונת נושא <em>רחבה, 1400×400 בערך</em></span><input type="file" accept="image/*" data-upload="banner" aria-label="העלאת תמונת נושא"><button type="button" class="btn sm" data-act="clearimg" data-k="banner">הסרת התמונה</button></div></div><div class="row">' +
      '<label class="field"><span>צבע החנות</span><input type="color" name="color" value="' + esc(s.color) + '" data-prev></label>' +
      '<label class="field"><span>אימוג׳י <em>מוצג כשאין לוגו</em></span><input type="text" name="icon" maxlength="4" value="' + esc(s.icon) + '" data-prev></label></div></div>' +
      '<div class="panel form"><h2 style="margin:0">פרטים</h2><div class="row">' +
      '<label class="field"><span>שם החנות</span><input type="text" name="name" required maxlength="60" value="' + esc(s.name) + '"></label>' +
      '<label class="field"><span>סוג</span><select name="type"><option value="shop"' + (s.type === 'shop' ? ' selected' : '') + '>חנות</option><option value="breeder"' + (s.type === 'breeder' ? ' selected' : '') + '>מגדל פרטי</option></select></label></div><div class="row">' +
      '<label class="field"><span>עיר</span><input type="text" name="city" maxlength="40" value="' + esc(s.city) + '"></label>' +
      '<label class="field"><span>אזור</span><select name="region"><option value="">ללא</option>' + REGIONS.map(r => '<option' + (s.region === r ? ' selected' : '') + '>' + r + '</option>').join('') + '</select></label>' +
      '<label class="field"><span>טלפון <em>יוצג לקונים</em></span><input type="tel" name="phone" maxlength="20" dir="ltr" value="' + esc(s.phone) + '"></label></div>' +
      '<label class="field"><span>על החנות</span><textarea name="about" maxlength="1500">' + esc(s.about) + '</textarea></label></div>' +
      '<div class="panel form"><h2 style="margin:0">משלוחים ומדיניות</h2>' +
      '<label class="check"><input type="checkbox" name="pickup"' + (s.pickup ? ' checked' : '') + '> איסוף עצמי</label>' +
      '<label class="check"><input type="checkbox" name="delivery"' + (s.delivery ? ' checked' : '') + '> משלוח עד הבית</label>' +
      '<label class="field" style="max-width:240px"><span>מחיר משלוח (₪)</span><input type="number" name="shipPrice" min="0" max="999" value="' + esc(s.shipPrice) + '"></label>' +
      '<label class="field"><span>מדיניות החזרות ואחריות</span><textarea name="policy" maxlength="800">' + esc(s.policy) + '</textarea></label></div>' +
      '<div><button class="btn primary">שמירת החנות</button></div></form>';
  } else if (tab === 'orders') {
    title = 'הזמנות';
    body = '<h1>הזמנות שהתקבלו</h1>' + (orders.length ? orders.map(o => orderHtml(o, true)).join('') : '<div class="empty panel"><b>📦</b>עוד לא התקבלו הזמנות.</div>');
  } else if (tab === 'messages') {
    title = 'פניות';
    body = '<h1>פניות מקונים</h1>' + (msgs.length ? msgs.map(m => messageHtml(m, true)).join('') : '<div class="empty panel"><b>✉️</b>עוד לא התקבלו פניות.</div>');
  } else {
    const revenue = orders.filter(o => o.status !== 'cancelled').reduce((a, o) => a + o.total, 0);
    const r = ratingOf(s.id);
    body = '<div class="toolbar"><h1 style="margin:0">שלום, ' + esc(s.name) + '</h1><a class="btn primary" href="#/dash/new">+ מודעה חדשה</a></div><div class="kpis">' +
      '<div class="kpi"><b>' + prods.filter(p => p.status === 'active').length + '</b><span>מודעות פעילות</span></div>' +
      '<div class="kpi"><b>' + orders.length + '</b><span>הזמנות' + (newOrders ? ' (' + newOrders + ' חדשות)' : '') + '</span></div>' +
      '<div class="kpi"><b>' + money(revenue) + '</b><span>סך המכירות</span></div>' +
      '<div class="kpi"><b>' + (r.n ? r.avg.toFixed(1) : '–') + '</b><span>דירוג (' + r.n + ' ביקורות)</span></div>' +
      '<div class="kpi"><b>' + openMsgs + '</b><span>פניות ממתינות</span></div>' +
      '<div class="kpi"><b>' + prods.reduce((a, p) => a + soldOf(p), 0) + '</b><span>פריטים שנמכרו</span></div></div>' +
      (s.verified ? '<p class="note vnote" style="margin-top:16px">' + vMark(s) + ' <span><b>החנות מאומתת.</b> סימון ה־V מופיע ליד שם החנות בכל האתר.</span></p>'
        : '<p class="note" style="margin-top:16px"><b>החנות עוד לא מאומתת.</b> סימון V ניתן לחנויות עם רישיון עסק בתוקף למכירת בעלי חיים, אחרי שצוות האתר בודק את המסמכים. בגרסה האמיתית תהיה כאן העלאת רישיון.</p>') +
      (prods.length ? '<div class="sec-head"><h2>הנמכרים ביותר שלי</h2><a href="#/dash/products">לכל המודעות ←</a></div><div class="tscroll"><table class="list"><tbody>' +
        prods.slice(0, 5).map((p, i) => '<tr><td>' + (i + 1) + '</td><td><a href="#/p/' + p.id + '">' + esc(p.title) + '</a></td><td>' + soldOf(p) + ' נמכרו</td></tr>').join('') + '</tbody></table></div>' : '') +
      (!s.about || (!s.logo && !s.banner) ? '<p class="note" style="margin-top:16px">טיפ: חנות עם לוגו, תמונת נושא ותיאור נראית אמינה יותר. <a href="#/dash/shop">לעיצוב החנות</a></p>' : '') +
      '<div class="sec-head"><h2>הזמנות אחרונות</h2><a href="#/dash/orders">לכל ההזמנות ←</a></div>' +
      (orders.length ? orders.slice(0, 3).map(o => orderHtml(o, true)).join('') : '<div class="empty panel">עוד לא התקבלו הזמנות.</div>');
  }
  return { title, html: '<div class="dash"><nav class="side" aria-label="ניהול החנות">' + link('home', 'סקירה') + link('products', 'המודעות שלי') + link('new', 'מודעה חדשה') +
    link('shop', 'עיצוב החנות') + link('orders', 'הזמנות', newOrders) + link('messages', 'פניות', openMsgs) + '<a href="#/s/' + s.slug + '">עמוד החנות ↗</a></nav><section>' + body + '</section></div>' };
}

/* ---------- admin ---------- */
function viewAdmin(tab) {
  if (me.role !== 'admin') return { title: 'ניהול האתר', html: '<div class="empty panel"><b>🔒</b>העמוד הזה פתוח למנהל האתר בלבד.</div>' };
  const t = (id, label) => '<a href="#/admin/' + id + '"' + (tab === id ? ' class="on"' : '') + '>' + label + '</a>';
  let body;
  if (tab === 'shops') body = '<table class="list"><thead><tr><th>חנות</th><th>סוג</th><th>עיר</th><th>מודעות</th><th>מאומת</th><th></th></tr></thead><tbody>' +
    db.shops.map(s => '<tr><td><a href="#/s/' + s.slug + '">' + esc(s.name) + '</a></td><td>' + TYPE[s.type] + '</td><td>' + esc(s.city || '–') + '</td><td>' + db.products.filter(p => p.shopId === s.id).length + '</td>' +
      '<td><button type="button" class="btn sm" data-act="averify" data-id="' + s.id + '" aria-pressed="' + s.verified + '">' + (s.verified ? '✔ מאומת' : 'סימון כמאומת') + '</button></td>' +
      '<td><button type="button" class="btn sm danger" data-act="adelshop" data-id="' + s.id + '">מחיקה</button></td></tr>').join('') + '</tbody></table>';
  else if (tab === 'products') body = '<table class="list"><thead><tr><th></th><th>מודעה</th><th>חנות</th><th>מחיר</th><th>מצב</th><th></th></tr></thead><tbody>' +
    db.products.map(p => '<tr><td><img class="mini" loading="lazy" src="' + esc(imgOf(p)) + '" alt=""></td><td><a href="#/p/' + p.id + '">' + esc(p.title) + '</a></td><td>' + esc(shopOf(p).name) + '</td><td>' + money(p.price) + '</td>' +
      '<td>' + { active: 'פעילה', hidden: 'מוסתרת', sold: 'נמכרה' }[p.status] + '</td><td><button type="button" class="btn sm danger" data-act="adelprod" data-id="' + p.id + '">מחיקה</button></td></tr>').join('') + '</tbody></table>';
  else body = '<table class="list"><thead><tr><th>שם</th><th>אימייל</th><th>תפקיד</th><th>נרשם</th><th></th></tr></thead><tbody>' +
    db.users.map(u => '<tr><td>' + esc(u.name) + '</td><td><span class="ltr">' + esc(u.email) + '</span></td><td>' + { buyer: 'קונה', seller: 'מוכר', admin: 'מנהל' }[u.role] + '</td><td>' + fdate(u.created) + '</td>' +
      '<td>' + (u.id === me.id ? '' : '<button type="button" class="btn sm danger" data-act="adeluser" data-id="' + u.id + '">מחיקה</button>') + '</td></tr>').join('') + '</tbody></table>';
  return { title: 'ניהול האתר', html: '<h1>ניהול האתר</h1><div class="kpis"><div class="kpi"><b>' + db.users.length + '</b><span>משתמשים</span></div><div class="kpi"><b>' + db.shops.length + '</b><span>חנויות</span></div>' +
    '<div class="kpi"><b>' + db.products.length + '</b><span>מודעות</span></div><div class="kpi"><b>' + db.orders.length + '</b><span>הזמנות</span></div></div>' +
    '<div class="tabs">' + t('users', 'משתמשים') + t('shops', 'חנויות') + t('products', 'מודעות') + '</div><div class="tscroll">' + body + '</div>' };
}
function deleteShop(id) {
  db.products = db.products.filter(p => p.shopId !== id);
  db.reviews = db.reviews.filter(r => r.shopId !== id);
  db.messages = db.messages.filter(m => m.shopId !== id);
  db.shops = db.shops.filter(s => s.id !== id);
  db.users.forEach(u => { if (u.shopId === id) { u.shopId = ''; u.role = u.role === 'seller' ? 'buyer' : u.role; } });
}
const ownProduct = id => db.products.find(p => p.id === id && me && p.shopId === me.shopId);
const isAdmin = () => me && me.role === 'admin';

Object.assign(ACTS, {
  rmimg(el) { draft.imgs.splice(+el.dataset.i, 1); $('#up-thumbs').innerHTML = thumbsHtml(); },
  clearimg(el) { draft[el.dataset.k] = ''; refreshShopPreview(); },
  ptoggle(el) { const p = ownProduct(el.dataset.id); if (!p) return; p.status = p.status === 'active' ? 'hidden' : 'active'; if (p.status === 'active' && p.qty < 1) p.qty = 1; save(); render(); },
  pdel(el) { const p = ownProduct(el.dataset.id); if (p && confirm('למחוק את המודעה "' + p.title + '"?')) { db.products = db.products.filter(x => x !== p); save(); toast('המודעה נמחקה'); render(); } },
  ostatus(el) {
    const o = db.orders.find(x => x.id === el.dataset.id && me && x.shopId === me.shopId); if (!o) return;
    if (el.dataset.st === 'cancelled') {
      if (!confirm('לבטל את ההזמנה? המלאי יוחזר למודעות.')) return;
      o.items.forEach(i => { const p = db.products.find(x => x.id === i.pid); if (p) { p.qty += i.qty; if (p.status === 'sold') p.status = 'active'; } });
    }
    o.status = el.dataset.st; save(); toast('ההזמנה עודכנה: ' + ORDER_STATUS[o.status]); render();
  },
  averify(el) { if (!isAdmin()) return; const s = shopById(el.dataset.id); s.verified = !s.verified; save(); render(); },
  adelshop(el) { if (!isAdmin()) return; const s = shopById(el.dataset.id); if (confirm('למחוק את החנות "' + s.name + '" ואת כל המודעות שלה?')) { deleteShop(s.id); save(); render(); } },
  adelprod(el) { if (!isAdmin()) return; if (confirm('למחוק את המודעה?')) { db.products = db.products.filter(p => p.id !== el.dataset.id); save(); render(); } },
  adeluser(el) {
    if (!isAdmin()) return;
    const u = db.users.find(x => x.id === el.dataset.id);
    if (!u || !confirm('למחוק את המשתמש "' + u.name + '"' + (u.shopId ? ' ואת החנות שלו' : '') + '?')) return;
    if (u.shopId) deleteShop(u.shopId);
    db.users = db.users.filter(x => x !== u); save(); render();
  },
});

Object.assign(FORMS, {
  product(d, f) {
    const s = myShop(); if (!s) return;
    const animal = catOf(d.cat).animal;
    const price = Math.round(+d.price), oldPrice = Math.round(+d.oldPrice || 0);
    if (!(price > 0)) return toast('המחיר חייב להיות גדול מאפס', true);
    const data = { title: d.title.trim(), cat: catOf(d.cat).id, price, oldPrice: oldPrice > price ? oldPrice : 0, qty: Math.max(0, Math.round(+d.qty || 0)), desc: d.desc.trim(),
      species: animal && SPECIES[d.species] ? d.species : '', morph: animal ? d.morph.trim() : '', sex: animal && SEX[d.sex] ? d.sex : '',
      birth: animal ? +d.birth || 0 : 0, weight: animal ? +d.weight || 0 : 0, images: draft.imgs.slice(), status: ['active', 'hidden', 'sold'].includes(d.status) ? d.status : 'active' };
    if (data.status === 'active' && data.qty < 1) data.status = 'sold';
    let p = f.dataset.id ? ownProduct(f.dataset.id) : null;
    const backup = JSON.stringify(db.products);
    if (p) Object.assign(p, data);
    else db.products.push(p = Object.assign({ id: uid('p'), shopId: s.id, icon: '', created: Date.now() }, data));
    if (!save()) { db.products = JSON.parse(backup); return; }
    draft.key = ''; toast(f.dataset.id ? 'המודעה עודכנה' : 'המודעה פורסמה'); go('/p/' + p.id);
  },
  shop(d) {
    const s = myShop(); if (!s) return;
    const backup = JSON.stringify(s);
    Object.assign(s, { name: d.name.trim() || s.name, type: d.type === 'breeder' ? 'breeder' : 'shop', city: d.city.trim(), region: REGIONS.includes(d.region) ? d.region : '',
      phone: d.phone.trim(), about: d.about.trim(), policy: d.policy.trim(), pickup: !!d.pickup, delivery: !!d.delivery, shipPrice: Math.max(0, Math.round(+d.shipPrice || 0)),
      color: /^#[0-9a-f]{6}$/i.test(d.color) ? d.color : s.color, icon: d.icon.trim() || s.icon, logo: draft.logo, banner: draft.banner });
    if (!s.pickup && !s.delivery) s.pickup = true;
    if (!save()) { Object.assign(s, JSON.parse(backup)); return; }
    toast('החנות נשמרה'); go('/s/' + s.slug);
  },
  reply(d, f) {
    const m = db.messages.find(x => x.id === f.dataset.id && me && x.shopId === me.shopId); if (!m) return;
    m.reply = d.text.trim(); m.replyDate = Date.now(); save(); toast('התשובה נשלחה'); render();
  },
});

document.addEventListener('input', e => { if (e.target.matches('[data-prev]')) refreshShopPreview(); });
