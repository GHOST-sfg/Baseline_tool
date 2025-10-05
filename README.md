## Dev Sahayak — Baseline Web Feature Compatibility Checker

Dev Sahayak is a website that helps developers instantly check whether a web platform feature (CSS/JS/HTML/API) is production‑ready across major browsers using Baseline-style status and simple browser support summaries. It’s designed for quick lookups, clear status signals, and links to documentation so you can make fast, confident decisions while building.

### Why this exists
- Baseline makes it easier to know if a feature is broadly supported. This site brings that guidance into a lightweight checker UI so you can search a feature, see its status at a glance, and dig into browser support details when needed without any hassles of searching on different websites and reading through large dataset entries for feature checking.

---

## Features
- Instant search from the Home page with deep-link handoff to the Checker
- Baseline-style status per feature: Widely Available, Limited Support, Not Supported
- Per‑browser support summary (Chrome, Firefox, Safari, Edge) with versions and notes
- Single feature view and category results (e.g., search "css", "javascript")
- Details modal with expanded support info and documentation links (MDN, etc.)
- Responsive UI with semantic HTML and SEO meta tags (Open Graph, canonical)

---

## How it works (high level)
1. On the Home page, you type a feature name or a category. The input is stored in `localStorage` and you’re redirected to the Checker.
2. The Checker loads the feature dataset, hydrates the UI, and runs the search automatically if you arrived with a stored query.
3. If a single feature is matched, you’ll see a centered result card. If a category is matched (`css`, `javascript`, `html`, `api`), you’ll see multiple cards.
4. Each card shows a Baseline-style status, a short description, and per‑browser support. You can open a details modal or jump to documentation.

---

## Project structure

```
baseline_src/
  HTML_MODULE/
    Home.html        # Landing page with search and product sections
    checker.html     # Main checker UI (search, results grid, details)
    About.html       # Mission, team, and stack
    sitemap.xml      # Sitemap for SEO

  CSS_MODULE/
    home.css         # Home page styles
    cheacker.css     # Checker page styles (note the filename)
    about.css        # About page styles
    Responsive_Fixes.css

  SCRIPT_MODULE/
    script.js        # Core client logic for the Checker page
    Features.JSON    # Feature dataset (see Data)
    robots.txt

  logo.ico
  README.md          # This file
```

Notes:
- Navigation links reference `Home.html`, `checker.html`, and `About.html`. Ensure you use the right filename casing when serving on case‑sensitive hosts.
- Some hardcoded links in the HTML use `cheacker.html` and `cheacker.css`. Keep file names and references consistent when deploying.

---

## Data
- The checker expects a JSON dataset of features containing:
  - `id`, `name`, `description`, `category` (one of `css`, `javascript`, `html`, `api`)
  - `support_status` per browser with `category` (e.g., `widely_available`), `version`, and optional `notes`

Dataset location:
- Provided in this repo as `SCRIPT_MODULE/Features.JSON`.

Loader path in `SCRIPT_MODULE/script.js`:
- The script fetches `feature_compat.json` by default. If you’re using `Features.JSON` from this repo, either:
  - rename `Features.JSON` to `feature_compat.json`, or
  - change the fetch path in `script.js` to point to `SCRIPT_MODULE/Features.JSON` and serve that path correctly.

---

## Running locally

Because the site loads JSON via `fetch`, you should run it from a local web server (not via file://).

Option 1 — Quick Python server (if Python is installed):
```bash
cd baseline_src
python -m http.server 8080
```
Then open `http://localhost:8080/HTML_MODULE/Home.html`.

Option 2 — Node http-server (if Node is installed):
```bash
npx http-server -p 8080 .
```
Then open `http://localhost:8080/HTML_MODULE/Home.html`.

Windows PowerShell users can run the same commands in PowerShell. Ensure the JSON path requested by `SCRIPT_MODULE/script.js` is reachable under the server root.

---

## Usage
- From the Home page, try searches like: "css grid", "fetch api", "web components".
- Click Checker in the nav to open the tool directly and search there.
- Click "Check Details" on any result to open an in‑page modal with more information.
- Use "View Documentation" to open MDN or related resources for deeper reading.

---

## Technology stack
- HTML5 (semantic structure, SEO meta, Open Graph, JSON‑LD)
- CSS3 (responsive layout, grid‑based results, animation hooks)
- JavaScript (search, filtering, rendering, modal, notifications)
- JSON dataset for feature compatibility

---

## SEO and accessibility highlights
- Descriptive titles, meta descriptions, canonical links, Open Graph tags, robots.txt
- JSON‑LD `WebApplication` metadata on the Home page
- Keyboard‑friendly UI elements and focusable buttons
- Clear status labels and emojis to improve scannability


---

## Contributing
Contributions are welcome! Ideas to improve:
- Expand/refresh the dataset and add more precise version metadata
- Persist deep links (URL query for search) for sharable results
- Add service worker for offline dataset caching

---

## License
MIT — see your project’s chosen license if different.


