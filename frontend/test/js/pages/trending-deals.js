// Trending and Deals pages

/* ================= TRENDING ================= */
function renderTrending(){
  const sorted = [...GAMES].sort((a,b)=>b.delta-a.delta);
  view.innerHTML = `
    <div class="page page-hero reveal">
      <span class="k">RIGHT NOW</span><h1>Trending this week</h1>
      <p>Ranked by 24-hour change in concurrent players.</p>
    </div>
    <div class="page section-tight reveal">
      <div class="grid">${sorted.map(gameTile).join("")}</div>
    </div>
  `;
}

/* ================= DEALS ================= */
function renderDeals(){
  const deals = GAMES.filter(g=>g.discount>0).sort((a,b)=>b.discount-a.discount);
  view.innerHTML = `
    <div class="page page-hero reveal">
      <span class="k">SAVE</span><h1>Current deals</h1>
      <p>Every discounted game we're tracking right now.</p>
    </div>
    <div class="page section-tight reveal">
      <div class="grid">${deals.map(gameTile).join("")}</div>
    </div>
  `;
}
