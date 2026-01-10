// Browse page ("All games") — uses the shared catalog layout from catalog.js

/* ================= BROWSE ================= */
function renderBrowse(){
  renderCatalog({
    data: GAMES,
    kicker: 'CATALOG',
    title: 'Browse all games',
    desc: 'Build your filter first, then apply it to the catalog.',
    genres: ALL_GENRES,
    genreCount: () => (Math.random()*8000+400)|0,   // fake counts for the prototype
    sorts: [['relevance','Sort: Relevance'],['price','Sort: Price (low → high)'],['score','Sort: Review score'],['players','Sort: Players online'],['date-new','Sort: Release date (newest)'],['date-old','Sort: Release date (oldest)']],
    totalText: n => `${n} of 61,204 games`
  });
}
