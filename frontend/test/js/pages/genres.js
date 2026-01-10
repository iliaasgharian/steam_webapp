// Genres landing page

/* ================= GENRES LANDING ================= */
function renderGenres(){
  view.innerHTML = `
    <div class="page page-hero reveal">
      <span class="k">CATALOG</span><h1>Browse by genre</h1>
      <p>Pick a genre to jump straight to filtered results.</p>
    </div>
    <div class="page section-tight">
      <div class="genre-grid reveal">
        ${ALL_GENRES.map(g=>`
          <a class="genre-card" href="#/browse" style="background:linear-gradient(150deg, ${gc(g)}18, var(--surface) 60%)">
            <div class="g-dot" style="background:${gc(g)}"></div>
            <span class="g-count">${(Math.random()*9000+300)|0} games</span>
            <h3>${g}</h3>
          </a>`).join("")}
      </div>
    </div>
  `;
}
