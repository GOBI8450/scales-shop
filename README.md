# Scales: Israeli reptile marketplace (demo)

A Hebrew (RTL) marketplace demo for reptile and exotic-pet sellers in Israel, in the style of MorphMarket.
Plain HTML, CSS and JavaScript: no framework, no dependencies, no backend.

## Run it on your PC

You need [Git](https://git-scm.com/downloads). [Node.js](https://nodejs.org/) (LTS) is optional but recommended.

```sh
git clone https://github.com/GOBI8450/scales-shop.git
cd scales-shop
npm start
```

Then open http://localhost:8080 in your browser. Stop the server with Ctrl+C.

No Node? Any of these work too:

- Double-click `index.html` (it runs straight from the file).
- Or with Python: `python -m http.server 8080` and open http://localhost:8080

## Project layout

| Path | What it is |
|------|------------|
| `index.html` | Page shell: loads the font, `css/styles.css` and `js/app.js` |
| `css/styles.css` | All styling (light theme, large text, RTL) |
| `js/app.js` | The whole app: data, hash routing, views, gene calculator, guides, price guide, quiz, saved searches |
| `img/` | Freely licensed photos from Wikimedia Commons, one per sample item (authors and licenses on the site's "קרדיט לתמונות" page) |
| `tools/build.mjs` | `npm run build` makes `dist/scales-shop.html`, a single file with CSS and JS inlined, plus `dist/img/` |
| `DEMO-ACCOUNTS.md` | The 20 sample shop logins and the buyer login |

## Working on it

Edit the files and refresh the browser. Useful places in `js/app.js`:

- `SHOPS` and `seed()`: the 20 template shops (`v:1` = verified), sample products, sample sales and orders, and demo logins
- `TPL`: the product types the sample catalogue is built from (`k` = photo pool, `pop` = how well it sells)
- `SORTS`: sort options (best-selling, newest, price, by group)
- `GENES` and `calcGenetics()`: the gene calculator
- `GUIDES`: the care guides and starter kits
- `QUIZ`: the "which reptile fits me" quiz
- `render()` and the `view*` functions: one function per page (`#home`, `#shops`, `#product-…`, `#genetics`, …)

## Data

Everything (accounts, shops, products, orders, uploaded images, saved searches) is stored in the browser's
`localStorage` under the key `scales-demo-v5`. The "איפוס נתוני הדמו" link at the bottom of the site restores
the sample data. Each browser and each address (file vs. localhost) keeps its own copy.

## Limits

This is a front-end demo. Passwords are stored in plain text in the browser and there are no real payments.
A production version needs a backend: database, real authentication, image hosting and payments.
Store names are real Israeli businesses used only as templates; all descriptions, products and prices are invented.
