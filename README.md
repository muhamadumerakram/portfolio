# Muhammad Umer Akram — Portfolio

Software Quality Assurance Engineer portfolio. Static site, designed for GitHub Pages.

Live site: https://muhamadumerakram.github.io/portfolio/

## Run locally

```bash
npm install
npx --yes serve -l 5173
```

Then open `http://localhost:5173`.

You can also open `index.html` directly in a browser. Relative asset paths work on GitHub Pages and locally.

## Deploy to GitHub Pages

This repo deploys from the `main` branch as a static site (no SPA router, no build step required).

1. Commit changes on `main`.
2. Push to `origin`.
3. In GitHub: **Settings → Pages**.
4. Keep **Deploy from a branch**, source **main**, folder **/ (root)**.

Asset paths are relative (`css/`, `js/`, `img/`, `documents/`), so they work at `https://muhamadumerakram.github.io/portfolio/`.

## Contact form (Formspree)

The contact form is wired for Formspree and will not send messages until you add your form ID.

1. Create a free account at [https://formspree.io](https://formspree.io).
2. Create a new form and copy the form ID (example: `xyzabcd`).
3. Open `js/config.js` and replace `YOUR_FORM_ID`:

```js
window.PORTFOLIO_CONFIG = {
  formspreeEndpoint: "https://formspree.io/f/xyzabcd"
};
```

4. Submit a test message from the live site.
5. Confirm the verification email Formspree sends you.

Until that ID is set, the form validates locally and shows a configuration message instead of pretending to send.

Spam protection: honeypot field (`_gotcha`) plus Formspree’s server-side filtering.

## Design tokens

Colors, glass surfaces, radii, and timing live in `css/tokens.css`. Update that file to restyle the site.

## Project structure

- `index.html` — page content and sections
- `css/tokens.css` — design tokens
- `css/style.css` — layout and components
- `js/config.js` — Formspree endpoint
- `js/script.js` — navigation, Bug Lab, contact form
- `img/Photo.jpg` — portrait
- `documents/` — resume and Playwright certificate
