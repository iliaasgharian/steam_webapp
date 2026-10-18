# Playbase

**A Steam game database and analytics front-end: search the catalog, compare prices across regions, follow player trends and discover what to play next.**

Playbase is a UI/UX prototype built with plain HTML, CSS and JavaScript. There is no build step, no framework and no server needed: open `index.html` and it runs. It ships with real data for **300 Steam games**, so every page has something real to show.

> **Status:** front-end prototype. It is the design reference for a planned Next.js version and a FastAPI + PostgreSQL backend (see [Roadmap](#roadmap)).

<!-- Add screenshots here, for example:
![Home](docs/screenshot-home.png)
![Game detail](docs/screenshot-detail.png)
-->

## Features

**Discover**
- Home page with live-style stats, trending games, next big Steam sale countdown and a currency converter
- Browse all games with a left filter sidebar (genre, tags and more), shared by every list page
- Collection pages: Popular, Top this week, Top this month, Most wishlisted, Free games, Bundles, Upcoming
- Genres page, Tags page, and directory pages for Developers and Publishers
- Floating hover preview on game tiles, search overlay, wishlist (saved in the browser)

**Game detail page**
- Overview, Analytics, Steam Intelligence, Screenshots, Requirements, Price history, DLC and Similar games tabs
- Charts for player counts and price signals, regional price list, tags, categories, developer and publisher
- Real description, release date, platforms, Metacritic score, review label, requirements, screenshots and a "View on Steam" link for scraped games

**Game Mixer**
- Pick two games and get a blended game concept: a name, a pitch, shared and unique "DNA" tags, and the three closest existing games

**Account demo**
- Login, sign-up and a user panel, stored in `localStorage` only (no real authentication)

**Polish**
- Loading screen, count-up numbers, scroll-reveal animations, smooth hover effects
- Responsive layout with a mobile menu
- Design tokens in one file, so re-theming is a small change

## Getting started

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
```

Then either:

- **Open `index.html`** in your browser (works from a folder, no server needed), or
- run a local server:

  ```bash
  python -m http.server 8000
  # open http://localhost:8000
  ```

Fonts (Space Grotesk, Inter, IBM Plex Mono) load from Google Fonts, so the first load needs an internet connection.

## Project structure

```
index.html              page markup (navbar, footer, #view container) + <link>/<script> tags
css/
  variables.css         colors, radius, fonts. Start here to change the look
  base.css              reset and base styles
  navbar.css            navbar, dropdowns, search overlay
  layout.css            containers and sections
  home.css              homepage
  components.css        game tiles / grid, page headers
  browse.css            browse page + filters
  analytics.css         analytics page
  game-detail.css       game detail page
  pages.css             about, contact, developer/publisher pages, price history
  mixer.css             Game Mixer
  account.css           login / sign-up / panel
  footer.css            footer
  enhancements.css      loader, animations, hover effects
  mobile.css            mobile menu + responsive rules
  hover-and-filters.css floating hover preview, tag filter
  hybrid.css            hybrid design system overrides
  intelligence.css      "Steam Intelligence" tab
  light-theme.css       light theme overrides (must stay last)
js/
  data.js               sample games, tags, developers, DLC, comments
  data-real.js          merges real Steam data into the game list
  steam-games-data.js   300 scraped games (generated from data/steam_games.json)
  utils.js              formatters, tile builders, chart helpers
  ui.js                 navbar, search, mobile menu, reveal, count-up
  router.js             #/path -> page function
  pages/                one file per page (home, browse, game-detail, mixer, ...)
    catalog.js          shared layout: hero + filter sidebar + results grid
  main.js               init (keep it last)
data/steam_games.json   scraped Steam data
images/games/           game covers and screenshots (see below)
tools/
  download_images.py    downloads real covers, banners and screenshots
  json_to_js.py         converts data/steam_games.json to js/steam-games-data.js
```

**Order matters.** CSS files later in `index.html` override earlier ones. All JS files share one global scope, so `data.js` and `utils.js` must load before the pages, and `main.js` must load last.

## Routes

The app is a single page with a hash router (`js/router.js`).

| Route | Page |
| --- | --- |
| `#/` | Home |
| `#/browse` | All games with filters |
| `#/game/<id>` | Game detail |
| `#/genres`, `#/tags` | Genres and tags |
| `#/developers`, `#/publishers` | Directory of studios and publishers |
| `#/developers/<name>`, `#/publishers/<name>` | Games from one studio or publisher |
| `#/popular`, `#/top-week`, `#/top-month`, `#/wishlisted`, `#/free-games`, `#/bundles`, `#/upcoming` | Collections |
| `#/trending`, `#/deals`, `#/analytics` | Trending, deals, analytics |
| `#/mixer` | Game Mixer |
| `#/login`, `#/signup`, `#/panel` | Account demo |
| `#/about`, `#/contact` | Info pages |

## Data

The 300 games come from a scrape of Steam's public store data, saved as `data/steam_games.json`.

To refresh or replace it:

1. Put your scraped file at `data/steam_games.json`.
2. Run `python tools/json_to_js.py`. It writes `js/steam-games-data.js`.
3. Reload the site.

Why a `.js` file and not `fetch()`: pages opened from a folder (`file://`) cannot fetch local files. Behind a real server or the backend you can fetch the JSON instead.

Delete `js/steam-games-data.js` to fall back to the small hand-written sample set in `js/data-real.js`.

**What is real and what is sample**

| Real (from the scraped data) | Sample / placeholder |
| --- | --- |
| Description, developer, publisher, release date, platforms, categories, Steam Deck status, review label, Metacritic, requirements, screenshots, yesterday's peak players, DLC count, Steam link | Bundles, analytics charts, regional prices (fixed exchange rates), price signal, Steam Intelligence panels, site-wide numbers, comments |

## Game images

The site looks for `images/games/<id>.jpg` first, then several Steam CDN hosts, then falls back to a generated gradient. To make real art always available, run once (needs internet):

```bash
python tools/download_images.py
```

It saves covers, wide banners and screenshots into `images/games/`. Existing files are skipped.

## Customizing

- **Colors, fonts, radius:** `css/variables.css`. Some gradients in `hybrid.css` and `light-theme.css` use their own values.
- **Filters:** the filter sidebar lives only in `js/pages/catalog.js`. Browse and the collection pages pass it their data and labels, so one change applies everywhere.
- **Add a page:** create `js/pages/yourpage.js` with a `renderYourPage()` function, add a `<script>` tag before `main.js`, and add a branch in `js/router.js`.
- **Game Mixer logic:** `mixGames()` in `js/pages/mixer.js` runs in the browser on the sample data. Replace it with an API call later; the UI stays the same.

## Roadmap

- [ ] Migrate the UI to Next.js
- [ ] Connect to the backend (FastAPI + PostgreSQL) instead of local data
- [ ] Real price history per region and player-count history, recorded over time (SteamDB style)
- [ ] Real accounts and server-side wishlists
- [ ] Mixer powered by similarity search and an LLM

## Contributing

Issues and pull requests are welcome. For larger changes, please open an issue first to discuss what you would like to change.

## Disclaimer

Playbase is an independent project and is not affiliated with or endorsed by Valve Corporation. Steam and the Steam logo are trademarks of Valve Corporation. Game names, images and descriptions belong to their respective owners and are used here for demonstration only. Check their terms before publishing a site that uses them.

## License

Add a `LICENSE` file to choose one (MIT is a common choice for projects like this).
