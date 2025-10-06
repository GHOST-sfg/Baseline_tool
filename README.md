## Dev Sahayak — Baseline Web Feature Compatibility Checker

Dev Sahayak is a website that helps developers instantly check whether a web platform feature (CSS/JS/HTML/API) is production‑ready across major browsers using Baseline-style status and simple browser support summaries. It’s designed for quick lookups, clear status signals, and links to documentation so you can make fast, confident decisions while building.

## The Problem We Solve
Web developers waste countless hours researching browser compatibility across multiple sites like MDN, Can I Use, and Baseline. This context switching kills productivity and creates uncertainty about which features are truly production-ready.

Dev Sahayak provides instant, authoritative answers in a single interface, powered by Baseline data and designed for developer workflows.

---

## Features
🔍 Instant Compatibility Checks - Get immediate answers about any web feature
📊 500+ Features Database - Comprehensive coverage of CSS, JavaScript, HTML, and APIs
🌐 Browser Support Data - Detailed Chrome, Firefox, Safari, Edge compatibility
📱 Mobile Responsive - Works perfectly on all devices
⚡ Fast Search - Intelligent search with real-time results
🔗 MDN Integration - Direct links to official documentation

---


## Innovation Highlights
🔍 Search-First Design: Unlike existing tools that require navigation, we put search front and center
🎯 Smart Result Display: Single feature vs category detection with optimized layouts
⚡ Zero Build Process: Pure client-side implementation for instant deployment
📱 Progressive Enhancement: Works without JavaScript with enhanced experience with it

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

## 🏃 Run Locally

- ```bash
# Clone the repository
- git clone https://github.com/your-username/dev-sahayak.git
# Navigate to project directory
- cd dev-sahayak
# Open in browser (no build process needed!)
- open Home.html

---

## Usage
- From the Home page, try searches like: "css grid", "fetch api", "web components".
- Click Checker in the nav to open the tool directly and search there.
- Click "Check Details" on any result to open an in‑page modal with more information.
- Use "View Documentation" to open MDN or related resources for deeper reading.

---

## Hackathon Project
- Built for the Baseline Tooling Hackathon to demonstrate how Baseline data can be integrated into developer tools to accelerate modern web feature adoption.

---

## Future Roadmap
- Real-time Baseline API integration
- Browser extension for development workflows
- IDE plugins (VS Code, WebStorm)
- CI/CD integration for automated compatibility checks
- Advanced filtering by browser, usage, and complexity

---

## Contributing
- We welcome contributions! Areas of interest:
- Expand feature database with more precise metadata
- Add deep linking with URL search parameters
- Implement service worker for offline functionality
- Enhance accessibility with screen reader optimization

---

## License

This project is licensed under the MIT License - see the [License] (License) file for details


