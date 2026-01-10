// Game Mixer teaser page

/* ================= GAME MIXER (teaser) ================= */
function renderMixer(){
  view.innerHTML = `
    <div class="page page-hero reveal">
      <span class="k">EXPERIMENTAL · PHASE 2</span><h1>Game Mixer</h1>
      <p>Pick two games you love, and Playbase suggests a new concept blended from both — shared mechanics, tone, and genre DNA.</p>
    </div>
    <div class="page section-tight reveal" style="text-align:center">
      <div class="mixer-demo">
        <div class="mixer-slot filled">${GAMES[4].name}</div>
        <div class="mixer-plus">+</div>
        <div class="mixer-slot filled">${GAMES[2].name}</div>
        <div class="mixer-plus">=</div>
        <div class="mixer-result">A tactical metroidvania with base-building between runs</div>
      </div>
      <p class="page-sub" style="margin:26px auto 0;max-width:52ch">This is a mockup of the eventual output — the real recommendation engine is planned for a later phase, once search, browsing, and analytics are solid.</p>
      <div class="notify-row">
        <input type="text" placeholder="you@example.com — get notified at launch">
        <button class="btn-primary" type="button">Notify me</button>
      </div>
    </div>
  `;
}
