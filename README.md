# REVOGUE

**Restyle. Reimagine. Repeat.**

REVOGUE is a school project — an AI-powered personal styling web app. Upload photos of clothes you already own, tell it the occasion, and get styled outfit ideas with matching accessories and Amazon shopping links.

## Live Site

Hosted on GitHub Pages: `https://<your-username>.github.io/REVOGUE/`

## Features

- **Landing page** introducing REVOGUE
- **Login / Sign up** — collects name, age and location to personalise suggestions
- **Style Studio (dashboard)**
  - Upload up to 15 clothing photos, tag each by type (top, bottom, dress, outerwear, footwear, accessory)
  - AI Style Advisor: pick an occasion and get a styled look with accessory suggestions and Amazon search links
- **About Us** — studio info and team (Saanvi Kalra, Tanishka Rai)
- **Our Purpose** — the problem REVOGUE solves and academic transparency notes

## Tech

Plain HTML, CSS and vanilla JavaScript — no build step, no backend. Runs entirely in the browser using `localStorage`, so it can be hosted for free as a static site.

Fonts: Playfair Display + Poppins (Google Fonts). Placeholder imagery via [Lorem Picsum](https://picsum.photos).

## Important note on the "AI"

This is a static, client-only site (GitHub Pages has no server and can't securely hold API keys). The **AI Style Advisor is simulated**: a rule-based JavaScript template engine combines occasion, age group and location into a styling suggestion — designed to mirror how a real Google Gemini API integration would behave. See the **Our Purpose** page for details and future scope (real Gemini API via a backend, real AI-generated visuals).

## Running locally

No build tools needed — just serve the folder statically, e.g.:

```bash
npx serve .
# or
python -m http.server 8000
```

Then open `http://localhost:8000` (or wherever it serves) in your browser.

## Project structure

```
REVOGUE/
├── index.html        Landing page
├── login.html         Login / sign up
├── dashboard.html      Style Studio (upload + AI suggestions)
├── about.html         About us / team / office
├── purpose.html       Project purpose & academic notes
├── css/style.css       Shared design system
├── js/
│   ├── storage.js      localStorage helpers, random image/data helpers
│   ├── nav.js         Navbar behaviour, auth-aware nav
│   ├── auth.js        Login / signup logic
│   ├── upload.js       Closet upload, tagging, rendering
│   └── suggest.js       AI Style Advisor (simulated) logic
└── assets/
    ├── logo.svg        Full wordmark logo
    └── logo-mark.svg    Icon-only mark (favicon)
```

## Team

- **Saanvi Kalra** — Co-Founder & Creative Director
- **Tanishka Rai** — Co-Founder & Tech Lead
