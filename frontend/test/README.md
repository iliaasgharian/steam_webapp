# Playbase — UI/UX Prototype (Light)

Open `index.html` in a browser. No build step and no server are needed.
(Fonts load from Google Fonts, so they need an internet connection.)

## Structure

```
index.html            page markup (navbar, footer, #view container) + <link>/<script> tags
css/
  variables.css       colors, radius, fonts  ← start here to change the look
  base.css            reset and base styles
  navbar.css          navbar, dropdowns, search overlay
  layout.css          containers and sections
  home.css            homepage
  components.css      game tiles / grid, page headers
  browse.css          browse page + filters
  analytics.css       analytics page
  game-detail.css     game detail page
  pages.css           about, mixer, contact
  footer.css          footer
  enhancements.css    loader, animations, hover effects
  mobile.css          mobile menu + responsive rules
  hover-and-filters.css  floating hover preview, tag filter
  hybrid.css          hybrid design system overrides
  intelligence.css    "Steam Intelligence" tab
  light-theme.css     light theme overrides (must stay last)
js/
  data.js             sample games, tags, developers, DLC, comments
  utils.js            formatters, tile builders, chart helpers
  ui.js               navbar, search, mobile menu, reveal, count-up
  router.js           #/path → page function
  pages/              one file per page (home, browse, genres, analytics, ...)
    catalog.js        SHARED layout: hero + left filter sidebar + results grid
                      (used by Browse AND all collection pages: bundles, free, top week...)
  main.js             init — keep it last
```

## Game images

`images/games/<id>.svg` is the cover (tiles, search, detail hero) and `<id>-1.svg … <id>-5.svg` are the screenshots.
The current files are generated placeholders — replace them with real art using the same names (or any extension, by setting `image` / `shots` on the game in `js/data.js`).
If an image is missing, the old colored gradient shows behind it.

## Notes

- **Order matters.** CSS files later in `index.html` override earlier ones; JS files share one global scope, so `data.js` and `utils.js` must load before the pages, and `main.js` last.
- **Add a page:** create `js/pages/yourpage.js` with a `renderYourPage()` function, add a `<script>` tag before `main.js`, and add a branch for it in `js/router.js`.
- **Change colors:** edit `css/variables.css`. Some gradients and overrides in `hybrid.css` and `light-theme.css` use their own values.

- **Filters:** the left filter sidebar lives only in `js/pages/catalog.js`. `browse.js` and `collections.js` just pass it their data and labels, so a change there applies to every page.
