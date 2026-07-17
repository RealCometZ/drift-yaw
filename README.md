# drift-yaw Marketing Site

Premium single-page marketing site for **drift-yaw**, a Neverlose anti-aim / utility Lua script for CS:GO.

Original brand identity (soft violet accent, graphite UI, geometric type). Not a clone of any existing seller page.

## Open locally

No build step. Open the HTML file in a browser:

```text
drift-yaw-site/index.html
```

**Windows**

```powershell
cd drift-yaw-site
start index.html
```

**macOS**

```bash
cd drift-yaw-site
open index.html
```

**Optional local server** (avoids rare `file://` quirks):

```powershell
# Python
python -m http.server 8080
# then open http://localhost:8080
```

```powershell
# Node
npx --yes serve .
```

## Project structure

```text
drift-yaw-site/
├── index.html          # Full single-page site
├── README.md
├── assets/
│   └── logo.svg        # Brand mark
├── styles/
│   └── main.css        # Design system + layout
└── scripts/
    ├── config.js       # Prices, links, brand RGB (edit this)
    └── main.js         # Nav, tabs, pricing render, motion
```

## Easy edits (placeholders)

### Prices & tiers

Edit `scripts/config.js` → `pricing.tiers` and `pricing.matrix`:

```js
price: "39",           // display number
period: "one-time",    // or "lifetime"
featured: true,        // “Recommended” card
```

Currency symbol: `pricing.currency` (default `"$"`).

### Purchase / community links

```js
links: {
  purchase: "#pricing",                    // or checkout URL
  discord: "https://discord.gg/your-invite",
  telegram: "https://t.me/your-channel",
  email: "mailto:support@yourdomain.com",
  terms: "/terms",
  privacy: "/privacy",
}
```

Elements with `data-link="discord"` (etc.) pick these up at runtime.

### Brand colors

```js
brand: {
  accent: "180, 130, 255",   // soft violet (primary)
  accentIce: "180, 200, 255" // damage / info highlight
}
```

Also defined as CSS variables in `styles/main.css` (`--accent-rgb`, `--ice-rgb`).

### Version badge

```js
product: {
  version: "DEBUG 7",
  versionShort: "v7",
  tagline: "Angles that don't sit still.",
}
```

## Sections

1. Sticky nav + mobile menu  
2. Hero (mock UI + floating badges)  
3. Social proof strip (capability stats, not fake user counts)  
4. Feature grid  
5. Builder deep-dive (interactive state tabs)  
6. Defense + AI split  
7. Visuals gallery (indicators / hitlogs / scope mock)  
8. Pricing (3 tiers + comparison matrix)  
9. FAQ accordion  
10. Final CTA + footer  

## Design notes

- **Accent:** RGB(180, 130, 255)  
- **Ice:** RGB(180, 200, 255)  
- **Type:** Syne (headings) · DM Sans (body) · JetBrains Mono (labels)  
- **Motion:** scroll reveal, card hover, builder tabs, light hero parallax; respects `prefers-reduced-motion`  
- **A11y:** semantic HTML, focus-visible rings, ARIA on nav/tabs  

## Deploy

Upload the folder to any static host (Netlify, Cloudflare Pages, GitHub Pages, S3, etc.). Point the root at `index.html`. No backend required.

## Disclaimer

This is a marketing front-end only. Product claims match the script feature list provided for the site.
