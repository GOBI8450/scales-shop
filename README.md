# Scales: Israeli reptile marketplace (demo)

A Hebrew (RTL) marketplace that puts Israel's reptile shops and private breeders on one site, in the style of
MorphMarket with an Amazon-like shopping flow. Plain HTML, CSS and JavaScript: no framework, no dependencies, no backend.

## Run it

```sh
git clone https://github.com/GOBI8450/scales-shop.git
cd scales-shop
npm start
```

Then open http://localhost:8080. Without Node, double-clicking `index.html` also works.

## What is in the demo

**Buyers**
- Home page with categories, new listings, deals, private-breeder listings and top shops
- Search and browse with filters: category, species, sex, price range, region, seller type, deals, verified sellers only; group chips (snakes, geckos, terrariums…) and five sort orders: best-selling (default), newest, price up, price down, by group
- Listing page with gallery, traits, a price-comparison table of every other seller offering the same species or product, and a question form to the seller
- Favorites, cart grouped by seller, checkout with pickup or delivery per seller (no real payment), order history
- Shop pages with banner, logo, listings (best-selling first, with group chips and sorting), reviews and an "about" tab; logged-in buyers can write a review
- Best-seller badges, "sold" counts on every listing and a best-sellers row on the home page
- A blue V mark next to verified sellers (big stores with a licence); unverified sellers show no mark

**Sellers (shops and private breeders)**
- Registration that opens a shop in one step
- Shop design: logo and banner upload, color, emoji, description, city and region, phone, shipping options and policy, with a live preview
- Listings: create, edit, hide, mark sold, delete, with up to 5 uploaded photos (resized in the browser)
- Incoming orders with status updates (confirm, ship, complete, cancel with stock return) and buyer questions with replies

**Site admin**
- Users, shops and listings tables; delete any of them; mark shops as verified

## Demo accounts

25 accounts are preloaded: 20 shops, 3 private breeders, a buyer and a site admin. They are listed in
[DEMO-ACCOUNTS.md](DEMO-ACCOUNTS.md) and on the site's "חשבונות לניסיון" page (`#/demo`), which also has one-click login.

## Project layout

| Path | What it is |
|------|------------|
| `index.html` | Page shell |
| `css/styles.css` | All styling |
| `js/data.js` | Categories, species, supplies, shop templates (`v: 1` = verified) and `seed()`, which builds the demo database: about 240 listings, each with its own photo, plus invented sales and past orders |
| `js/app.js` | Storage, hash routing, header and footer, and the buyer pages |
| `js/dash.js` | Seller dashboard, image upload and site admin |
| `js/credits.js` | `PHOTOS` (photo pools per species or product) and `CREDITS` (author and license of every file in `img/`) |
| `tools/serve.mjs` | The static server behind `npm start` |
| `tools/accounts.mjs` | `npm run accounts` regenerates `DEMO-ACCOUNTS.md` from the seed data |

## Data

Everything (accounts, shops, listings, orders, messages, uploaded images) is stored in the browser's `localStorage`
under the key `scales-db-v1`. "איפוס נתוני הדמו" in the footer restores the sample data. Each browser keeps its own copy,
so a shop created on one computer is not visible on another.

## Limits

- This is a front-end demo. Passwords are stored unencrypted in the browser, the admin and ownership checks run in the
  browser only, and there are no real payments. A real version needs a server, a database, proper authentication,
  image hosting and a payment provider.
- Shop names are real Israeli businesses used only as templates. Their descriptions, listings, prices and reviews are
  invented, and the site has no connection to them. Get each shop's agreement before showing its name publicly.
- Check which species may legally be traded in Israel before real listings go live.
- Photos are freely licensed images from Wikimedia Commons, credited on the "קרדיט לתמונות" page.
