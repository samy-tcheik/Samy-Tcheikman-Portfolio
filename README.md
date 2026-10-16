# Samy Tcheikman — Full-Stack Developer Portfolio

> Personal portfolio website showcasing 6+ years of experience in **React**, **React Native**, and **Laravel**. Built as a fast, SEO-friendly static site ready for **Cloudflare Pages**.

**Live:** https://www.samytcheikman.com/

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=flat&logo=bootstrap&logoColor=white)
![Cloudflare Pages](https://img.shields.io/badge/Cloudflare_Pages-F38020?style=flat&logo=cloudflare&logoColor=white)

---

## ✨ Features

- **One-page portfolio** — Hero, About, Skills, Resume, Services, Portfolio, Testimonials
- **Animated starfield canvas** (`assets/js/canvas.js`) with mouse-trail effect
- **Responsive design** — mobile nav toggle, Bootstrap 5 grid
- **Portfolio filtering** — Isotope layout with App / Card / Web filters + GLightbox
- **Animated counters & sliders** — PureCounter, Swiper testimonials
- **SEO optimized** — canonical, Open Graph, Twitter Cards, `Person` JSON-LD, `sitemap.xml`, `robots.txt`
- **Contact section (currently paused)** — hidden behind an HTML comment, to be restored with a Cloudflare Pages Function + Resend (see Roadmap)

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Markup / Style | HTML5, CSS3 (`assets/css/style.css`), Bootstrap 5 (vendored) |
| JS | Vanilla JS (`assets/js/main.js`, `assets/js/canvas.js`), Swiper, Isotope, GLightbox, Waypoints, PureCounter |
| Icons | Bootstrap Icons, Boxicons, Remixicon |
| Fonts | Google Fonts (Open Sans, Raleway, Poppins) with `preconnect` + `display=swap` |
| Backend | None (static) — contact form intentionally disabled pending serverless endpoint |
| Hosting | Cloudflare Pages (static, no build step) |

> No `package.json`, no bundler — all dependencies are vendored under `assets/vendor/` so the site runs offline from any static host.

## 📁 Project Structure

```
.
├── index.html                  # Main one-page site
├── portfolio-details.html      # Generic project detail template
├── robots.txt                  # Allow all + sitemap pointer
├── sitemap.xml                 # index + portfolio-details
├── assets/
│   ├── css/style.css           # Custom theme (dark + #18d26e accent)
│   ├── js/
│   │   ├── main.js             # Nav, sections, Swiper, Isotope, GLightbox
│   │   └── canvas.js           # Starfield background animation
│   ├── img/
│   │   ├── samy_tcheikman.png  # Profile photo
│   │   ├── favicon.jpeg
│   │   ├── portfolio/          # Portfolio placeholder images
│   │   └── testimonials/       # Testimonial avatars
│   └── vendor/                 # Bootstrap, Swiper, GLightbox, etc. (vendored)
└── forms/
    └── contact.php             # Legacy PHP handler (unused on Cloudflare Pages, to be removed)
```

## 🚀 Getting Started

### Preview locally

```bash
# from the project root
python3 -m http.server 8000
# open http://localhost:8000
```

Or with Node:

```bash
npx serve .
```

### Deploy to Cloudflare Pages

1. Push this repo to GitHub.
2. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → Connect to Git.
3. Build settings:
   - Framework preset: **None**
   - Build command: *(empty)*
   - Output directory: `/` (repo root)
4. Add custom domain `www.samytcheikman.com` → Enforce HTTPS.
5. Submit `https://www.samytcheikman.com/sitemap.xml` in Google Search Console.

## 📬 Contact Form Status

The contact section in `index.html` is currently **commented out**:

```html
<!-- CONTACT PAUSED 2026-10-16 - restore tomorrow with Cloudflare Function + Resend -->
```

**Planned (Option B):** `functions/api/contact.js` (Pages Function) → Resend API → `samytcheikman@gmail.com`, with honeypot, rate-limiting, and Turnstile. The legacy `forms/contact.php` does not run on Pages and will be deleted when the Function lands.

## 🔍 SEO

- `index.html` — canonical, OG/Twitter, `theme-color`, `Person` JSON-LD, descriptive title/meta
- `portfolio-details.html` — canonical + description (no longer empty)
- `robots.txt` + `sitemap.xml` at root
- Fonts use `preconnect` to reduce render-blocking

## 🎨 Customization

- **Colors:** accent `#18d26e` defined throughout `assets/css/style.css`
- **Background:** tweak star count/speed in `assets/js/canvas.js` (`initStarsPopulation`, `params`)
- **Content:** About bio, Resume entries, Services, and Testimonials are plain HTML in `index.html` — edit directly, no build needed
- **Images:** replace files in `assets/img/portfolio/` and update the `portfolio-container` grid; keep 800×600 for consistent cards

## 🗺️ Roadmap

- [ ] Restore contact form via Pages Function + Resend
- [ ] Replace placeholder portfolio items with 3–6 real projects
- [ ] Convert profile photo to WebP + lazy-load below-fold images
- [ ] Prune `assets/vendor/` to minified files only (currently ~21 MB with source maps)
- [ ] Add `_headers` with security headers (CSP, `X-Frame-Options`)

## 👤 Author

**Samy Tcheikman** — Full-Stack Developer, Boumerdes, Algeria

- Email: samytcheikman@gmail.com
- Phone: +213 554 088 171
- LinkedIn: https://www.linkedin.com/in/samy-tcheikman
- Instagram: https://www.instagram.com/samy_tcheikman/
- Facebook: https://www.facebook.com/profile.php?id=61594453346442

## 📄 License

All rights reserved © Samy Tcheikman. Original template based on BootstrapMade "Personal" (BootstrapMade license applies to the underlying theme assets).
