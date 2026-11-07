# Samy Tcheikman Portfolio — Agent Notes

Static one-page portfolio (HTML5/CSS/JS). **No `package.json`, no bundler, no build step, no test suite, no linter, no CI.** All dependencies are vendored under `assets/vendor/`.

## Local preview

```bash
python3 -m http.server 8000
# open http://localhost:8000
```
or `npx serve .` from the repo root. No install step required.

## Deploy — Cloudflare Pages

Connect the GitHub repo in Cloudflare Dashboard → Workers & Pages → Pages. Settings:
- Framework preset: **None**
- Build command: *(empty)*
- Output directory: `/` (repo root)
- Custom domain: `www.samytcheikman.com`, enforce HTTPS
- Submit `https://www.samytcheikman.com/sitemap.xml` to Google Search Console after deploy

## Contact form

- Frontend form: `index.html` `#contact-form`, posts FormData to `/api/contact` (`assets/js/contact.js`, expects plain-text `OK` on success)
- Backend: Cloudflare Pages Function at `functions/api/contact.js` → route `POST /api/contact`
- Required env var (Pages Dashboard → Settings → Environment variables): `RESEND_API_KEY`
- Optional: `CONTACT_TO` (default `samytcheikman@gmail.com`), `CONTACT_FROM`
- Honeypot: hidden `company` field — non-empty value fakes a 200 OK
- Rate limit: 5 requests / 60 s per IP (in-memory, per isolate)
- Legacy `forms/contact.php` does not exist and does not run on Pages

## Structure

| Path | Purpose |
|---|---|
| `index.html` | One-page site entry (Hero, About, Skills, Resume, Services, Portfolio, Testimonials, Contact) |
| `portfolio-details.html` | Project detail template |
| `assets/css/style.css` | Custom theme; accent color `#18d26e` |
| `assets/js/main.js` | Nav, sections, Swiper, Isotope, GLightbox, PureCounter, Waypoints |
| `assets/js/canvas.js` | Starfield background; tweak `initStarsPopulation` / `params` |
| `assets/js/contact.js` | Contact form client validation + POST |
| `assets/vendor/` | Vendored Bootstrap, Swiper, GLightbox, Isotope, etc. (~21 MB, offline-friendly) |
| `sitemap.xml`, `robots.txt` | Root SEO files |
| `functions/api/contact.js` | Pages Function (contact API) |

## Conventions

- Content edits are plain HTML in `index.html` — no build needed; refresh to see changes
- Images in `assets/img/portfolio/` — keep cards at 800×600 for consistency
- Do not add a build step, bundler, or test framework without updating this file
- README.md claims the contact section is commented out — it is **not**; the form is live in `index.html` line 690
