// Builds dist/scales-shop.html: one self-contained file (CSS and JS inlined) plus dist/img/.
// Usage: npm run build   (or: node tools/build.mjs)
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");

let html = read("index.html")
  .replace('<link rel="stylesheet" href="css/styles.css">', () => `<style>\n${read("css/styles.css")}</style>`)
  .replace('<script src="js/app.js"></script>', () => `<script>\n${read("js/app.js")}</script>`);

const dist = join(root, "dist");
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
writeFileSync(join(dist, "scales-shop.html"), html);
cpSync(join(root, "img"), join(dist, "img"), { recursive: true });
console.log("Built dist/scales-shop.html (" + Math.round(html.length / 1024) + " KB) and dist/img/");
