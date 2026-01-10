// About page

/* ================= ABOUT ================= */
function renderAbout(){
  view.innerHTML = `
    <div class="page page-hero reveal">
      <span class="k">THE PROJECT</span><h1>About Playbase</h1>
      <p>An informational and analytical website for Steam games, built as a personal/technical learning project — external APIs, databases, backend, and frontend.</p>
    </div>
    <div class="page section-tight">
      <div class="about-block reveal">
        <div class="about-card problem">
          <h3 style="color:var(--bad)">The problem</h3>
          <ul><li>Steam data is scattered, with no visual analysis in one place.</li><li>The official API keeps no history — player-count trends aren't stored anywhere.</li><li>Repeated direct requests run into Steam's rate limits.</li></ul>
        </div>
        <div class="about-card solution">
          <h3 style="color:var(--good)">The solution</h3>
          <ul><li>A one-time bulk fetch of all games into a local database.</li><li>Periodic updates that only fetch newly released games.</li><li>Gradual collection of player-count history to build trend charts.</li><li>An internal API so the frontend never hits Steam directly.</li></ul>
        </div>
      </div>

      <div class="about-block reveal" style="margin-top:20px"><div class="about-card"><h3 style="color:var(--accent)">What Playbase tracks</h3><ul><li>Game discovery through genres, tags, rankings and upcoming releases.</li><li>Player-count snapshots so activity can be viewed as a trend instead of a single number.</li><li>Review signals, regional prices, DLC and other useful game metadata.</li></ul></div><div class="about-card"><h3 style="color:var(--blue)">Why it is useful</h3><ul><li>It turns a large catalog into focused discovery pages.</li><li>Filters make it possible to combine signals instead of browsing one list at a time.</li><li>The interface is designed to grow alongside the backend data pipeline.</li></ul></div></div>
      <div class="section-head reveal" style="margin-top:50px"><div><span class="k">STACK</span><h2>How the project is built</h2><p class="sub">A small full-stack pipeline designed around reusable data.</p></div></div><div class="steps reveal"><div class="step"><div class="step-num">DB</div><h3>SQLite</h3><p>Stores the catalog and historical snapshots locally.</p></div><div class="step"><div class="step-num">API</div><h3>Django / DRF</h3><p>Provides a clean internal API between data and interface.</p></div><div class="step"><div class="step-num">UI</div><h3>Playbase frontend</h3><p>Turns the data into searchable pages, charts and discovery tools.</p></div></div>

      <div class="section-head reveal" id="roadmap" style="margin-top:50px">
        <div><span class="k">STATUS</span><h2>Execution roadmap</h2></div>
      </div>
      <div class="roadmap reveal">
        <div class="rm-item done"><span class="rm-status">Next up</span><h4>1 — Data infrastructure</h4><p>SQLite database populated with all Steam games.</p></div>
        <div class="rm-item next"><span class="rm-status">Planned</span><h4>2 — Automatic updates</h4><p>Script that checks for new games with minimal requests.</p></div>
        <div class="rm-item"><span class="rm-status">Planned</span><h4>3 — Backend API</h4><p>Endpoints for search, game details, and live stats.</p></div>
        <div class="rm-item"><span class="rm-status">Planned</span><h4>4 — Frontend</h4><p>Search page and game detail pages with charts (this UI).</p></div>
        <div class="rm-item"><span class="rm-status">Future</span><h4>5 — Game Mixer</h4><p>A tool suggesting a new game idea from two selected games.</p></div>
      </div>
    </div>
  `;
}
