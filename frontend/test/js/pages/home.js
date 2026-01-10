// Home page

/* ================= HOME ================= */
function renderHome(){
  view.innerHTML = `
    <section class="hero">
      <div class="blob blob-a"></div><div class="blob blob-b"></div>
      <div class="page hero-inner">
        <span class="eyebrow"><span class="live-dot"></span> Tracking ${fmt(61204)} games live</span>
        <h1>Every Steam game,<br>in one <span class="hl">searchable</span> place.</h1>
        <p>Search the catalog, compare prices, follow player trends and discover what is worth watching next.</p>
        <div class="hero-actions"><button class="btn-primary" onclick="location.hash='/browse'">Browse the catalog</button><button class="btn-ghost hero-search" onclick="document.getElementById('searchBtn').click()">Search a game</button></div>
        <div class="hero-stats"><div class="hstat"><div class="n" data-count="61204">0</div><div class="l">Games tracked</div></div><div class="hstat"><div class="n" data-count="1280000">0</div><div class="l">Players online now</div></div><div class="hstat"><div class="n" data-count="430">0</div><div class="l">Snapshots / day</div></div><div class="hstat"><div class="n" data-count="9">0</div><div class="l">Genres indexed</div></div></div>
      </div>
    </section>

    <section class="page home-section reveal"><div class="home-grid">
      <div class="sale-card"><div class="sale-k">NEXT MAJOR SALE · STEAM</div><h3>Autumn Sale 2026</h3><p>Seasonal sale starts October 1 and runs through October 8. Keep an eye on your wishlist before the discounts go live.</p><div class="countdown" id="saleCountdown"><div class="count-box"><b>--</b><span>Days</span></div><div class="count-box"><b>--</b><span>Hours</span></div><div class="count-box"><b>--</b><span>Minutes</span></div><div class="count-box"><b>--</b><span>Seconds</span></div></div></div>
      <div class="converter-card"><h3>Currency converter</h3><p>Prototype rates for comparing regional game prices.</p><div class="converter-row"><input id="fxAmount" type="number" value="19.99" min="0" step="0.01"><select id="fxFrom"><option>USD</option><option>EUR</option><option>GBP</option><option>CAD</option><option>JPY</option></select><select id="fxTo"><option>EUR</option><option>USD</option><option>GBP</option><option>CAD</option><option>JPY</option></select></div><div class="convert-result" id="fxResult">€17.00</div></div>
    </div></section>

    <section class="page home-section section-accent"><div class="section-head compact reveal"><div><span class="k">DISCOVER</span><h2>Most Popular Games</h2><p class="sub">The titles pulling the most players right now.</p></div><a class="more" href="#/popular">More →</a></div><div class="mini-grid reveal">${POPULAR.map(gameTile).join("")}</div></section>
    <section class="page home-section"><div class="section-head compact reveal"><div><span class="k">RANKED</span><h2>Top Games of the Week</h2><p class="sub">A quick weekly snapshot of what is getting attention.</p></div><a class="more" href="#/top-week">More →</a></div><div class="mini-grid reveal">${WEEKLY.map((g,i)=>`<div style="position:relative">${gameTile(g)}<span class="rank-badge">#${i+1}</span></div>`).join("")}</div></section>
    <section class="page home-section"><div class="section-head compact reveal"><div><span class="k">EXPERIMENTAL</span><h2>Most Wishlisted</h2><p class="sub">A prototype ranking based on wishlist activity.</p></div><a class="more" href="#/wishlisted">More →</a></div><div class="mini-grid reveal">${WISHLISTED.map((g,i)=>`<div style="position:relative">${gameTile(g)}<span class="rank-badge">W${i+1}</span></div>`).join("")}</div></section>

    <section class="page section"><div class="section-head reveal"><div><span class="k">HOW IT WORKS</span><h2>From search to insight</h2></div></div><div class="steps reveal"><div class="step"><div class="step-num">01</div><h3>Search or browse</h3><p>Find games by name, genre, price, platform, or discovery list.</p></div><div class="step"><div class="step-num">02</div><h3>Read the signals</h3><p>See player counts, review trends, pricing history and regional differences.</p></div><div class="step"><div class="step-num">03</div><h3>Discover what's next</h3><p>Compare similar games, DLC, tags and upcoming releases.</p></div></div></section>
    <section class="page section"><div class="cta-band reveal"><h2>Ready to look up a game?</h2><p>No account needed — search the catalog or browse by genre right now.</p><div class="hero-actions" style="margin-bottom:0"><button class="btn-primary" onclick="location.hash='/browse'">Browse the catalog</button><button class="btn-ghost" onclick="document.getElementById('searchBtn').click()">Open search</button></div></div></section>`;
  document.querySelectorAll(".hstat .n").forEach(el=>countUp(el,parseInt(el.dataset.count,10)));
  startCountdown(); initCurrency();
}
