// Analytics page

/* ================= ANALYTICS ================= */
function renderAnalytics(){
  const byPlayers = [...GAMES].sort((a,b)=>b.players-a.players);
  const byReviews = [...GAMES].sort((a,b)=>b.reviewCount-a.reviewCount);
  view.innerHTML = `
    <div class="page page-hero reveal">
      <span class="k">SITE-WIDE</span><h1>Analytics overview</h1>
      <p>Aggregate trends across every game we track — not just one title at a time.</p>
    </div>
    <div class="page section-tight">
      <div class="analytics-grid reveal">
        <div class="chart-card">
          <div class="chart-title">Total concurrent players — 30 days</div>
          <div class="chart-sub">Sum across all tracked games</div>
          ${lineChart({seed:'site-players',kind:'month',end:GAMES.reduce((n,g)=>n+(g.players||0),0),delta:GAMES.reduce((n,g)=>n+(g.delta||0),0)/GAMES.length,unit:'players',caption:'players online now'})}
        </div>
        <div class="chart-card">
          <div class="chart-title">Catalog review sentiment</div>
          <div class="chart-sub">Weighted by review count across tracked games</div>
          ${barChart()}
        </div>
      </div>
      <div class="analytics-grid reveal">
        <div class="chart-card" id="risers">
          <div class="chart-title">Biggest risers (24h)</div>
          <div class="chart-sub">By percent change in concurrent players</div>
          <table class="lb-table"><tbody>
            ${byPlayers.slice(0,5).map((g,i)=>`<tr>
              <td class="lb-rank">${i+1}</td>
              <td class="lb-name"><span class="lb-swatch" style="background:${gc(g.genres[0])}"></span>${g.name}</td>
              <td class="lb-num lb-delta ${g.delta>=0?'up':'down'}">${g.delta>=0?'↑':'↓'} ${Math.abs(g.delta)}%</td>
            </tr>`).join("")}
          </tbody></table>
        </div>
        <div class="chart-card" id="reviewed">
          <div class="chart-title">Most reviewed</div>
          <div class="chart-sub">Total reviews collected</div>
          <table class="lb-table"><tbody>
            ${byReviews.slice(0,5).map((g,i)=>`<tr>
              <td class="lb-rank">${i+1}</td>
              <td class="lb-name"><span class="lb-swatch" style="background:${gc(g.genres[0])}"></span>${g.name}</td>
              <td class="lb-num">${fmt(g.reviewCount)}</td>
            </tr>`).join("")}
          </tbody></table>
        </div>
      </div>
    </div>
  `;
}
