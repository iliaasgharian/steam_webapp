// Shared catalog page: hero + LEFT filter sidebar + results grid.
// Used by Browse (all games) and by every collection page (bundles, free games, top week...).
// To change the filter UI for all of them, edit this one file.
//
// opts = { data, kicker, title, desc, genres, genreCount(g), sorts:[[value,label],...], totalText(n) }

/* ================= SHARED CATALOG (filters on the left) ================= */
function renderCatalog(opts){
  const { data, kicker, title, desc, genres: genreList, genreCount, sorts, totalText } = opts;
  view.innerHTML = `
    <div class="page page-hero reveal">
      <span class="k">${kicker}</span><h1>${title}</h1>
      <p>${desc}</p>
    </div>
    <div class="page section-tight">
      <div class="browse-layout reveal">
        <aside class="filter-panel browse-filter-panel">
          <div class="filter-panel-head"><div><span class="filter-kicker">FILTERS</span><h3>Find your game</h3></div><div class="filter-head-right"><span class="filter-count-badge" id="filterCountBadge" hidden></span><span class="pending-dot" id="filterPendingDot"></span></div></div>
          <div class="filter-group">
            <div class="filter-title">Genre</div>
            ${genreList.map(g=>`<label class="check-row"><input type="checkbox" class="browse-genre" value="${g}"> <span>${g}</span><span class="check-count">${genreCount(g)}</span></label>`).join("")}
          </div>
          <details class="filter-dropdown">
            <summary>Filter by features <span>⌄</span></summary>
            <div class="filter-dropdown-body">
              ${FEATURE_FILTERS.map(f=>`<label class="check-row compact"><input type="checkbox" class="browse-feature" value="${f}"><span>${f}</span></label>`).join("")}
            </div>
          </details>
          <details class="filter-dropdown">
            <summary>Filter by user tags <span>⌄</span></summary>
            <div class="filter-dropdown-body">
              ${ALL_TAGS.map(t=>`<label class="check-row compact"><input type="checkbox" class="browse-tag" value="${t}"><span>${t}</span></label>`).join("")}
            </div>
          </details>
          <div class="filter-group">
            <div class="filter-title">Release date</div>
            <div class="browse-date-filter stacked">
              <label for="browseDateFrom">From</label><input id="browseDateFrom" type="date" aria-label="Release date from">
              <label for="browseDateTo">To</label><input id="browseDateTo" type="date" aria-label="Release date to">
            </div>
          </div>
          <div class="filter-group rating-filter">
            <div class="rating-filter-head"><span>Rating: ≥<b id="ratingValue">0</b>%</span><span>0 — 100</span></div>
            <input id="ratingRange" type="range" min="0" max="100" value="0" step="1" aria-label="Minimum review rating">
          </div>
          <div class="filter-group">
            <div class="filter-title">Platform</div>
            <div class="plat-row"><button type="button" class="plat-btn on" data-platform="Win">Win</button><button type="button" class="plat-btn" data-platform="Mac">Mac</button><button type="button" class="plat-btn" data-platform="Linux">Linux</button></div>
          </div>
          <div class="filter-group">
            <div class="filter-title">Developer</div>
            ${DEVELOPERS.map(d=>`<label class="check-row"><input type="checkbox" class="browse-developer" value="${d}"> <span>${d}</span><span class="check-count">${(data.filter(g=>g.developer===d).length)}</span></label>`).join("")}
          </div>
          <div class="filter-group">
            <div class="filter-title">Publisher</div>
            ${PUBLISHERS.map(p=>`<label class="check-row"><input type="checkbox" class="browse-publisher" value="${p}"> <span>${p}</span><span class="check-count">${(data.filter(g=>g.publisher===p).length)}</span></label>`).join("")}
          </div>
          <div class="filter-actions"><button class="apply-filter-btn" id="applyBrowseFilters">Apply filters</button><button class="clear-filter-btn" id="clearBrowseFilters">Clear all</button></div>
          <div class="filter-hint">Choose everything you want first. Results update only after <b>Apply filters</b>.</div>
        </aside>
        <div>
          <div class="browse-toolbar">
            <span class="result-count" id="browseResultCount">${totalText(data.length)}</span>
            <select class="sort-select" id="browseSort">${sorts.map(([v,l])=>`<option value="${v}">${l}</option>`).join('')}</select>
          </div>
          <div class="active-filter-summary" id="activeFilterSummary"><span>All games</span></div>
          <div class="grid" id="browseGrid"></div>
        </div>
      </div>
    </div>
  `;

  const grid=document.getElementById('browseGrid');
  const from=document.getElementById('browseDateFrom');
  const to=document.getElementById('browseDateTo');
  const sort=document.getElementById('browseSort');
  const resultCount=document.getElementById('browseResultCount');
  const ratingRange=document.getElementById('ratingRange');
  const ratingValue=document.getElementById('ratingValue');
  const pendingDot=document.getElementById('filterPendingDot');
  const summary=document.getElementById('activeFilterSummary');
  const genres=[...view.querySelectorAll('.browse-genre')];
  const features=[...view.querySelectorAll('.browse-feature')];
  const tags=[...view.querySelectorAll('.browse-tag')];
  const developers=[...view.querySelectorAll('.browse-developer')];
  const publishers=[...view.querySelectorAll('.browse-publisher')];
  const platformBtns=[...view.querySelectorAll('.plat-btn')];
  let applied={genres:[],features:[],tags:[],developers:[],publishers:[],from:'',to:'',rating:0,platform:'Win'};
  // A developer/publisher profile can hand off its selection to the Browse filters.
  try{
    const selection=JSON.parse(localStorage.getItem('playbaseCatalogSelection')||'null');
    if(selection && selection.value && ['developer','publisher'].includes(selection.type)){
      const list=selection.type==='developer'?developers:publishers;
      const match=list.find(x=>x.value===selection.value);
      if(match){match.checked=true; applied[selection.type==='developer'?'developers':'publishers']=[match.value];}
      localStorage.removeItem('playbaseCatalogSelection');
    }
  }catch(e){}

  function pendingState(){
    const pending={genres:genres.filter(x=>x.checked).map(x=>x.value),features:features.filter(x=>x.checked).map(x=>x.value),tags:tags.filter(x=>x.checked).map(x=>x.value),developers:developers.filter(x=>x.checked).map(x=>x.value),publishers:publishers.filter(x=>x.checked).map(x=>x.value),from:from.value,to:to.value,rating:+ratingRange.value,platform:(platformBtns.find(x=>x.classList.contains('on'))||{}).dataset?.platform||'Win'};
    const changed=JSON.stringify(pending)!==JSON.stringify(applied);
    pendingDot.classList.toggle('show',changed);
  }
  function filterList(state){
    let list=data.filter(g=>{
      const date=g.releaseDate||'';
      const gameTags=tagsForGame(g), gameFeatures=featuresForGame(g);
      const genreOK=!state.genres.length || state.genres.some(x=>(g.genres||[]).includes(x));
      const featureOK=!state.features.length || state.features.every(x=>gameFeatures.includes(x));
      const tagOK=!state.tags.length || state.tags.every(x=>gameTags.includes(x));
      const developerOK=!state.developers.length||state.developers.includes(g.developer);
      const publisherOK=!state.publishers.length||state.publishers.includes(g.publisher);
      const platformOK=state.platform==='Win';
      return genreOK&&featureOK&&tagOK&&developerOK&&publisherOK&&(!state.from||date>=state.from)&&(!state.to||date<=state.to)&&(g.reviews||0)>=state.rating&&platformOK;
    });
    if(sort.value==='discount') list=[...list].sort((a,b)=>(b.discount||0)-(a.discount||0));
    if(sort.value==='price') list=[...list].sort((a,b)=>(a.price||0)-(b.price||0));
    if(sort.value==='score') list=[...list].sort((a,b)=>(b.reviews||0)-(a.reviews||0));
    if(sort.value==='players') list=[...list].sort((a,b)=>(b.players||0)-(a.players||0));
    if(sort.value==='date-new') list=[...list].sort((a,b)=>(b.releaseDate||'').localeCompare(a.releaseDate||''));
    if(sort.value==='date-old') list=[...list].sort((a,b)=>(a.releaseDate||'').localeCompare(b.releaseDate||''));
    return list;
  }
  function renderResults(){
    const list=filterList(applied);
    resultCount.textContent=totalText(list.length);
    grid.innerHTML=list.length?list.map(gameTile).join(''):`<div class="collection-empty">No games match these filters.</div>`;
    const chips=[];
    applied.genres.forEach(x=>chips.push(x)); applied.features.forEach(x=>chips.push(x)); applied.tags.forEach(x=>chips.push(x)); applied.developers.forEach(x=>chips.push('Developer: '+x)); applied.publishers.forEach(x=>chips.push('Publisher: '+x));
    if(applied.from)chips.push(`From ${applied.from}`); if(applied.to)chips.push(`To ${applied.to}`); if(applied.rating)chips.push(`Rating ≥ ${applied.rating}%`);
    summary.innerHTML=chips.length?chips.map(x=>`<span>${x}</span>`).join(''):`<span>All games</span>`;
    armReveals();
  }
  function apply(){
    applied={genres:genres.filter(x=>x.checked).map(x=>x.value),features:features.filter(x=>x.checked).map(x=>x.value),tags:tags.filter(x=>x.checked).map(x=>x.value),developers:developers.filter(x=>x.checked).map(x=>x.value),publishers:publishers.filter(x=>x.checked).map(x=>x.value),from:from.value,to:to.value,rating:+ratingRange.value,platform:(platformBtns.find(x=>x.classList.contains('on'))||{}).dataset?.platform||'Win'};
    renderResults(); pendingState();
  }
  genres.forEach(x=>x.addEventListener('change',pendingState));
  features.forEach(x=>x.addEventListener('change',pendingState));
  tags.forEach(x=>x.addEventListener('change',pendingState));
  developers.forEach(x=>x.addEventListener('change',pendingState));
  publishers.forEach(x=>x.addEventListener('change',pendingState));
  from.addEventListener('change',pendingState); to.addEventListener('change',pendingState);
  ratingRange.addEventListener('input',()=>{ratingValue.textContent=ratingRange.value;pendingState();});
  platformBtns.forEach(btn=>btn.addEventListener('click',()=>{platformBtns.forEach(x=>x.classList.remove('on'));btn.classList.add('on');pendingState();}));
  document.getElementById('applyBrowseFilters').addEventListener('click',apply);
  document.getElementById('clearBrowseFilters').addEventListener('click',()=>{genres.forEach(x=>x.checked=false);features.forEach(x=>x.checked=false);tags.forEach(x=>x.checked=false);developers.forEach(x=>x.checked=false);publishers.forEach(x=>x.checked=false);from.value='';to.value='';ratingRange.value=0;ratingValue.textContent='0';platformBtns.forEach(x=>x.classList.toggle('on',x.dataset.platform==='Win'));apply();});
  sort.addEventListener('change',renderResults);
  renderResults();
  pendingState();
}
