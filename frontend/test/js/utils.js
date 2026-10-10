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
function gameHero(g){ return g.hero || gameImg(g); }   // wide banner for the detail page (falls back to the cover)
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
  const saved=getPlaybaseWishlist ? getPlaybaseWishlist() : [];
  const inWishlist=saved.includes(String(g.id));
  return `<div class="tile-wrap">
    <a class="tile game-tile" href="#/game/${g.id}">
      ${tileArt(g)}
      <div class="tile-body">
        <div class="tile-name">${g.name}</div>
        <div class="tile-tags">${tags.slice(0,2).map(tagChip).join('')}</div>
        <div class="tile-foot">
          <div class="price">${g.discount?`<span class="strike">${money(g.price)}</span><span class="now">${current}</span>`:current}</div>
          <div class="players-mini"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>${fmt(g.players||0)}</div>
        </div>
      </div>
      <div class="tile-hover-panel">
        <div class="tile-hover-top"><span class="hover-status">${trendEmoji} ${trendLabel}</span><span class="hover-rating">⭐ ${rating}%</span></div>
        <div class="tile-hover-title">${g.name}</div>
        <div class="tile-hover-meta"><span>👤 ${g.developer||'Northwake Studio'}</span><span>📅 ${g.releaseDate||'TBA'}</span></div>
        <div class="tile-hover-stats"><div><b>${fmt(g.players||0)}</b><span>Players now</span></div><div><b>${fmt(peak)}</b><span>24h peak</span></div><div><b>${fmt(g.reviewCount||0)}</b><span>Reviews</span></div></div>
        <div class="tile-hover-tags">${tags.slice(0,4).map(tagChip).join('')}</div>
      </div>
    </a>
    <button class="wishlist-add wishlist-heart${inWishlist?' is-saved':''}" data-wishlist-id="${String(g.id).replace(/&/g,'&amp;').replace(/"/g,'&quot;')}" type="button" aria-label="${inWishlist?'Remove from wishlist':'Add to wishlist'}" title="${inWishlist?'Remove from wishlist':'Add to wishlist'}" aria-pressed="${inWishlist}"><svg class="wishlist-heart-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/></svg></button>
  </div>`;
}
function sparkline(seed,color,w=120,h=32){
  let v=50,pts=[];
  for(let i=0;i<20;i++){ v+=(Math.sin(i*seed)+(Math.random()-0.5))*8; v=Math.max(10,Math.min(90,v)); pts.push(v); }
  const step=w/(pts.length-1);
  const d=pts.map((p,i)=>(i===0?"M":"L")+(i*step).toFixed(1)+","+(h-(p/100*h)).toFixed(1)).join(" ");
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><path d="${d}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}
/* ---------- Charts ----------
   Every number on a chart is computed from the same points that are drawn, so the line, the axis and
   the headline value always agree. Points are generated deterministically from a seed (game id), so a
   chart looks the same every time the page is opened. Replace makeSeries() with real API data later. */
function seededRandom(seed){
  let h=2166136261; for(const c of String(seed)){ h^=c.charCodeAt(0); h=Math.imul(h,16777619); }
  let a=h>>>0;
  return ()=>{ a=(a+0x6D2B79F5)|0; let t=Math.imul(a^(a>>>15),1|a); t=(t+Math.imul(t^(t>>>7),61|t))^t; return ((t^(t>>>14))>>>0)/4294967296; };
}
function compactNum(n){
  const a=Math.abs(n);
  if(a>=1e6) return (n/1e6).toFixed(a>=1e7?0:2).replace(/\.?0+$/,'')+'M';
  if(a>=1e4) return (n/1e3).toFixed(0)+'K';
  if(a>=1e3) return (n/1e3).toFixed(1).replace(/\.0$/,'')+'K';
  return String(Math.round(n));
}
function niceCeil(v){
  if(v<=0) return 1;
  const p=Math.pow(10,Math.floor(Math.log10(v))), m=v/p;
  const step=[1,1.5,2,2.5,3,4,5,6,8,10].find(x=>m<=x+1e-9);
  return step*p;
}
function makeSeries({seed,kind,end=0,peak,points,delta=0,reviewCount=0}){
  const rnd=seededRandom(seed), clamp=(x,lo,hi)=>Math.max(lo,Math.min(hi,x));
  if(kind==='day'){                       // 24 hourly points, last point = current value, highest point = 24h peak
    const n=points||24, phase=rnd()*Math.PI*2; let v=[];
    for(let i=0;i<n;i++) v.push(0.72+0.28*Math.sin((i/n)*Math.PI*2+phase)+(rnd()-.5)*.06);
    const top=Math.max(...v.slice(0,n-1)), pk=peak||end*1.35;
    v=v.map(x=>Math.max(0,x/top*pk)); v[n-1]=end;
    return v.map(x=>Math.round(x));
  }
  if(kind==='velocity'){                  // new reviews per day
    const n=points||30, base=Math.max(2,reviewCount/180); let v=[];
    for(let i=0;i<n;i++) v.push(Math.max(0,Math.round(base*(1+.25*Math.sin(i*2*Math.PI/7+1)+(rnd()-.5)*.5))));
    return v;
  }
  const n=points||30, drift=clamp(delta/100*2,-.3,.35); let r=[1-drift], phase=rnd()*6;   // "month": 30 daily points
  for(let i=1;i<n;i++) r.push(r[i-1]+drift/(n-1)+(rnd()-.5)*.045+(1-r[i-1])*.05+Math.sin(i*2*Math.PI/7+phase)*.008);
  const last=r[n-1];
  return r.map(x=>Math.max(0,Math.round(end*x/last)));
}
function lineChart(opts={}){
  const {kind='month',unit='players',summary='last',caption=''}=opts;
  const vals=makeSeries(opts), n=vals.length;
  const labelAt=i=>{ const back=n-1-i; return kind==='day'?(back?back+'h ago':'Now'):(back?back+'d ago':'Today'); };
  const axisX=kind==='day'?['24h ago','12h ago','Now']:[`${n-1}d ago`,`${Math.round((n-1)/2)}d ago`,'Today'];
  const max=Math.max(...vals);
  if(!max) return `<div class="lc-empty">No ${unit} data yet.</div>`;
  const top=niceCeil(max*1.05);
  const headline=summary==='sum'?vals.reduce((a,b)=>a+b,0):vals[n-1];
  const ref=summary==='sum'?vals.slice(0,7).reduce((a,b)=>a+b,0):vals[0], cur=summary==='sum'?vals.slice(-7).reduce((a,b)=>a+b,0):vals[n-1];
  const pct=ref?Math.round((cur-ref)/ref*100):0, up=pct>=0;
  const trendTxt=`${up?'📈 Trending up':'📉 Trending down'} · ${up?'+':''}${pct}%`;
  const X=i=>(i/(n-1)*100).toFixed(2), Y=v=>(100-v/top*100).toFixed(2);
  const path=vals.map((v,i)=>(i?'L':'M')+X(i)+','+Y(v)).join(' ');
  const gid='lg'+Math.random().toString(36).slice(2,8);
  const pts=vals.map((v,i)=>[labelAt(i),v,+Y(v)]);
  return `<div class="lc" data-unit="${unit}" data-pts='${JSON.stringify(pts)}'>
    <div class="chart-value-row"><span class="chart-value-wrap"><span class="chart-value">${headline.toLocaleString()}</span><small class="chart-value-cap">${caption}</small></span><span class="chart-trend" style="${up?'':'background:rgba(229,56,79,.1);color:var(--bad);border-color:rgba(229,56,79,.22)'}">${trendTxt}</span></div>
    <div class="lc-body"><div class="lc-y"><span>${compactNum(top)}</span><span>${compactNum(top/2)}</span><span>0</span></div>
      <div class="lc-plot"><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#6F4FF0" stop-opacity=".30"/><stop offset="100%" stop-color="#6F4FF0" stop-opacity="0"/></linearGradient></defs>
        <line x1="0" y1="0" x2="100" y2="0" class="lc-grid"/><line x1="0" y1="50" x2="100" y2="50" class="lc-grid"/><line x1="0" y1="100" x2="100" y2="100" class="lc-grid"/>
        <path d="${path} L100,100 L0,100 Z" fill="url(#${gid})"/><path d="${path}" fill="none" stroke="#6F4FF0" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linejoin="round" stroke-linecap="round"/></svg>
        <div class="lc-cursor"></div><div class="lc-dot"></div><div class="lc-tip"></div></div></div>
    <div class="lc-x">${axisX.map(x=>`<span>${x}</span>`).join('')}</div></div>`;
}
// Review split. Pass the game's positive-review % (g.reviews); with no argument it is weighted across the whole catalog.
function barChart(positive){
  if(positive==null){
    const tot=GAMES.reduce((a,g)=>a+(g.reviewCount||0),0);
    positive=tot?GAMES.reduce((a,g)=>a+(g.reviews||0)*(g.reviewCount||0),0)/tot:0;
  }
  const pos=Math.round(Math.max(0,Math.min(100,positive))), rest=100-pos, mixed=Math.round(rest*.65), neg=rest-mixed;
  const data=[{l:"Positive",v:pos,c:"var(--good)"},{l:"Mixed",v:mixed,c:"var(--gold)"},{l:"Negative",v:neg,c:"var(--bad)"}];
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
