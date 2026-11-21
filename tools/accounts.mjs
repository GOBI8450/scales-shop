// Regenerates DEMO-ACCOUNTS.md from the seed data in js/data.js: `npm run accounts`
import { readFileSync, writeFileSync } from 'node:fs';
const src = readFileSync(new URL('../js/credits.js', import.meta.url), 'utf8') + '\n' + readFileSync(new URL('../js/data.js', import.meta.url), 'utf8');
const db = new Function(src + '; return seed();')();
const kind = u => { const s = db.shops.find(x => x.id === u.shopId); return u.role === 'admin' ? 'Site admin' : u.role === 'buyer' ? 'Buyer' : s.type === 'breeder' ? 'Private breeder (invented)' : 'Shop'; };
const name = u => { const s = db.shops.find(x => x.id === u.shopId); return s ? s.name + (s.en ? ' (' + s.en + ')' : '') : u.name; };
const ver = u => { const s = db.shops.find(x => x.id === u.shopId); return s && s.verified ? '✔' : ''; };
const rows = db.users.map((u, i) => `| ${i + 1} | ${name(u)} | ${kind(u)} | ${ver(u)} | ${u.email} | ${u.password} |`);
writeFileSync(new URL('../DEMO-ACCOUNTS.md', import.meta.url), `# Scales demo: login accounts

Log in with the "כניסה / הרשמה" button, or open "חשבונות לניסיון" (\`#/demo\`) on the site and press "כניסה מהירה" to log in with one click.

Shop names are real Israeli reptile and pet businesses, used only as templates. Descriptions, products, prices and reviews are invented,
and the site has no connection to those businesses. The three private breeders are invented.
Sales numbers and past orders are invented too. The "Verified" mark (✔) is given in the demo to 10 bigger stores to show
how the feature looks; it says nothing about the real businesses' licences.

| # | Account | Type | Verified | Email | Password |
|---|---------|------|----------|-------|----------|
${rows.join('\n')}

These logins exist only in the demo data inside your browser. They are not real accounts anywhere.
`);
console.log('Wrote DEMO-ACCOUNTS.md with', rows.length, 'accounts,', db.shops.length, 'shops,', db.products.length, 'products');
