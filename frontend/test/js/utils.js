// Utilities: formatters, game tiles, charts, helpers

/* ================= Utilities ================= */
function money(c){ return "$" + (c/100).toFixed(2); }
function fmt(n){ return Math.round(n).toLocaleString("en-US"); }
function chips(arr){ return arr.map(g=>`<span class="chip">${g}</span>`).join(""); }
// Game images. Put files in images/games/<id>.svg (cover) and <id>-1..5.svg (screenshots),
// or set g.image / g.shots[] in data.js to any path or URL (e.g. a Steam header image).
// If an image is missing, the colored gradient behind it is shown instead.
function gameImg(g){ return g.image || `images/games/${g.id}.svg`; }
function gameShot(g,n){ return (g.shots && g.shots[n-1]) || `images/games/${g.id}-${n}.svg`; }
function tileArt(g,h=100){
  const c1 = gc(g.genres[0]);
  return `<div class="tile-art" style="height:${h}px;background:url(${gameImg(g)}) center/cover no-repeat, linear-gradient(135deg, ${c1}38, #E9ECF2 85%)">
    ${g.discount ? `<span class="discount-badge">-${g.discount}%</span>` : ""}
  </div>`;
}
function gameTile(g){
  const tags=tagsForGame(g);
  const peak=Math.round((g.players||0)*1.35);
  const rating=g.reviews||0;
  const trend=g.delta||0;
  const trendEmoji=trend>2?'📈':trend<-1?'📉':'➖';
  const trendLabel=trend>2?'Rising':trend<-1?'Cooling':'Stable';
  const current=g.discount?money(g.price*(1-g.discount/100)):money(g.price);
  return `<a class="tile game-tile" href="#/game/${g.id}">
    ${tileArt(g)}
    <div class="tile-body">
      <div class="tile-name">${g.name}</div>
      <div class="tile-tags">${tags.slice(0,2).map(tagChip).join('')}</div>
      <div class="tile-foot">
        <div class="price">${g.discount?`<span class="strike">${money(g.price)}</span><span class="now">${current}</span>`:current}</div>
        <div class="players-mini">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>
          ${fmt(g.players||0)}
        </div>
      </div>
    </div>
    <div class="tile-hover-panel">
      <div class="tile-hover-top"><span class="hover-status">${trendEmoji} ${trendLabel}</span><span class="hover-rating">⭐ ${rating}%</span></div>
      <div class="tile-hover-title">${g.name}</div>
      <div class="tile-hover-meta"><span>👤 ${g.developer||'Northwake Studio'}</span><span>📅 ${g.releaseDate||'TBA'}</span></div>
      <div class="tile-hover-stats">
        <div><b>${fmt(g.players||0)}</b><span>Players now</span></div>
        <div><b>${fmt(peak)}</b><span>24h peak</span></div>
        <div><b>${fmt(g.reviewCount||0)}</b><span>Reviews</span></div>
      </div>
      <div class="tile-hover-tags">${tags.slice(0,4).map(tagChip).join('')}</div>
    </div>
  </a>`;
}
function sparkline(seed,color,w=120,h=32){
  let v=50,pts=[];
  for(let i=0;i<20;i++){ v+=(Math.sin(i*seed)+(Math.random()-0.5))*8; v=Math.max(10,Math.min(90,v)); pts.push(v); }
  const step=w/(pts.length-1);
  const d=pts.map((p,i)=>(i===0?"M":"L")+(i*step).toFixed(1)+","+(h-(p/100*h)).toFixed(1)).join(" ");
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><path d="${d}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}
function lineChart(seedOffset=0){
  const w=460,h=170,pad=8; let v=60,pts=[];
  for(let i=0;i<30;i++){ v+=Math.sin((i+seedOffset)*0.4)*3+(Math.random()-0.42)*6; v=Math.max(15,Math.min(95,v)); pts.push(v); }
  const first=Math.round(pts[0]*100),last=Math.round(pts[pts.length-1]*100),delta=last-first;
  const positive=delta>=0,emoji=positive?'📈':'📉',label=positive?'Trending up':'Trending down';
  const step=(w-pad*2)/(pts.length-1);
  const path=pts.map((p,i)=>(i===0?"M":"L")+(pad+i*step).toFixed(1)+","+(h-pad-(p/100*(h-pad*2))).toFixed(1)).join(" ");
  const area=path+` L${(pad+(pts.length-1)*step).toFixed(1)},${h-pad} L${pad},${h-pad} Z`;
  return `<div class="chart-value-row"><span class="chart-value">${last.toLocaleString()}</span><span class="chart-trend" style="${positive?'':'background:rgba(229,56,79,.1);color:var(--bad);border-color:rgba(229,56,79,.22)'}">${emoji} ${label} · ${delta>=0?'+':''}${delta}</span></div><div style="position:relative"><svg width="100%" height="${h}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><defs><linearGradient id="lg${seedOffset}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#6F4FF0" stop-opacity="0.35"/><stop offset="100%" stop-color="#6F4FF0" stop-opacity="0"/></linearGradient></defs><path d="${area}" fill="url(#lg${seedOffset})" stroke="none"/><path d="${path}" fill="none" stroke="#6F4FF0" stroke-width="2"/><text x="12" y="17" fill="#8890A0" font-size="10">100</text><text x="12" y="88" fill="#8890A0" font-size="10">50</text><text x="12" y="164" fill="#8890A0" font-size="10">0</text></svg></div>`;
}
function barChart(){
  const data=[{l:"Positive",v:82,c:"var(--good)"},{l:"Mixed",v:12,c:"var(--gold)"},{l:"Negative",v:6,c:"var(--bad)"}];
  return `<div style="display:flex;flex-direction:column;gap:14px;padding-top:6px">
    ${data.map(d=>`<div>
      <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:5px">
        <span style="color:var(--text-dim)">${d.l}</span><span style="font-family:var(--font-mono)">${d.v}%</span>
      </div>
      <div style="height:7px;background:var(--surface-2);border-radius:4px;overflow:hidden">
        <div style="height:100%;width:${d.v}%;background:${d.c}"></div>
      </div></div>`).join("")}
  </div>`;
}
