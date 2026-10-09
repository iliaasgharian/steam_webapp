// Collection pages (popular, free, bundles, upcoming...), developers/publishers, tags
// Collection pages reuse renderCatalog() from catalog.js for the left filter sidebar.

/* ================= COLLECTION PAGES ================= */
function renderCollection(type){
  const configs={
    popular:{title:"Most Popular Games",k:"DISCOVER",desc:"Games with the strongest current player activity.",data:POPULAR},
    "top-week":{title:"Top Games of the Week",k:"WEEKLY RANKING",desc:"A weekly snapshot of games getting the most attention.",data:WEEKLY},
    "top-month":{title:"Top Games of the Month",k:"MONTHLY RANKING",desc:"The leading titles across the last 30 days.",data:MONTHLY},
    wishlisted:{title:"Most Wishlisted Games",k:"EXPERIMENTAL",desc:"A prototype ranking based on wishlist signals.",data:WISHLISTED},
    "free-games":{title:"Free Games",k:"ZERO COST",desc:"Free-to-play games and zero-price titles in the catalog.",data:FREE_GAMES},
    bundles:{title:"Bundles",k:"COLLECTIONS",desc:"Multi-game collections and discounted packages.",data:BUNDLES},
    upcoming:{title:"Upcoming Games",k:"COMING SOON",desc:"Games with releases on the horizon.",data:UPCOMING}
  };
  const cfg=configs[type]||configs.popular;
  // Same left-sidebar filter layout as "All games" (see catalog.js)
  renderCatalog({
    data: cfg.data,
    kicker: cfg.k,
    title: cfg.title,
    desc: cfg.desc,
    genres: [...new Set(cfg.data.flatMap(g=>g.genres||[]))],
    genreCount: g => cfg.data.filter(x=>(x.genres||[]).includes(g)).length,
    sorts: [['relevance','Sort: Featured'],['players','Sort: Players online'],['score','Sort: Review score'],['price','Sort: Price (low → high)'],['discount','Sort: Biggest discount'],['date-new','Sort: Release date (newest)'],['date-old','Sort: Release date (oldest)']],
    totalText: n => `${n} of ${cfg.data.length} games`
  });
}

function renderTagsPage(){
  view.innerHTML=`<div class="page page-hero reveal tag-page-hero"><div><span class="k">DISCOVERY</span><h1>Game Tags</h1><p>Pick one or several tags to find games that match all of them.</p></div><div class="tag-selected-count" id="tagSelectedCount">0 selected</div></div><div class="page section-tight"><div class="tag-filter-grid reveal">${ALL_TAGS.map(tag=>{const m=TAG_META[tag];return `<button class="tag-filter" data-tag="${tag}"><span class="tag-icon" style="background:${m[1]}18;color:${m[1]}">${m[0]}</span><span><b>${tag}</b><small>Filter games</small></span></button>`}).join('')}</div><div class="collection-meta" style="margin-top:28px"><span id="tagResultCount">0 games</span><button class="btn-ghost" id="clearTags" style="padding:8px 12px">Clear filters</button></div><div class="grid reveal" id="tagGameGrid"></div></div>`;
  const selected=new Set(),grid=document.getElementById('tagGameGrid');
  function update(){const tags=[...selected];const list=GAMES.filter(g=>tags.every(t=>tagsForGame(g).includes(t)));document.getElementById('tagSelectedCount').textContent=`${tags.length} selected`;document.getElementById('tagResultCount').textContent=`${list.length} game${list.length===1?'':'s'}`;grid.innerHTML=list.length?list.map(gameTile).join(''):`<div class="collection-empty">No games match all selected tags.</div>`;armReveals();}
  view.querySelectorAll('.tag-filter').forEach(btn=>btn.addEventListener('click',()=>{const t=btn.dataset.tag;if(selected.has(t)){selected.delete(t);btn.classList.remove('active')}else{selected.add(t);btn.classList.add('active')}update()}));
  document.getElementById('clearTags').addEventListener('click',()=>{selected.clear();view.querySelectorAll('.tag-filter').forEach(b=>b.classList.remove('active'));update()});update();
}
function renderPeoplePage(title,people,k){
  const publisher=title==='Publishers';
  const colors=['#6F4FF0','#0FA37A','#1C86A8','#D98300'];
  const totalGames=people.reduce((n,_,i)=>n+2+(i%3),0);
  const kind=publisher?'publishing groups':'development studios';
  view.innerHTML=`
    <div class="page section-tight" style="padding-top:38px">
      <div class="hybrid-people-hero reveal">
        <div class="hybrid-editorial-lead">
          <span class="k">${k}</span>
          <h1>${title}</h1>
          <p>${publisher?'Explore the publishers behind the catalog — discover their portfolios, connected titles and the footprint they have across Playbase.':'Explore the studios building the catalog — browse their portfolios, connected titles and the teams represented across Playbase.'}</p>
        </div>
        <div class="hybrid-side-stat">
          <span>INDEXED IN PLAYBASE</span>
          <strong>${people.length}</strong>
          <span>${kind} · ${totalGames}+ featured titles</span>
        </div>
      </div>
      <div class="hybrid-section-label reveal"><div><span>${publisher?'PUBLISHING NETWORK':'STUDIO DIRECTORY'}</span><h2>Explore the ${publisher?'publishers':'developers'}</h2></div><span>Curated prototype profiles</span></div>
      <div class="person-grid hybrid-people-grid reveal">
        ${people.map((p,i)=>{const count=2+(i%3);const color=colors[i%colors.length];return `<a class="person-card hybrid-person-card" href="#/browse" data-person-type="${publisher?'publisher':'developer'}" data-person-name="${p.replace(/&/g,'&amp;').replace(/"/g,'&quot;')}" style="--person-color:${color}">
          <div class="person-avatar" style="color:${color};border-color:${color}55">${p.split(' ').map(x=>x[0]).join('').slice(0,2)}</div>
          <h3>${p}</h3><p>${publisher?'Publisher profile':'Independent development studio'} · ${count} featured games</p>
          <div class="person-meta"><span class="person-pill">${publisher?'Publishing':'Development'}</span><span class="person-pill">${count} games</span></div>
          <span class="person-arrow">Explore →</span>
        </a>`}).join('')}
      </div>
    </div>`;
  view.querySelectorAll('.hybrid-person-card').forEach(card=>card.addEventListener('click',()=>{
    try{localStorage.setItem('playbaseCatalogSelection',JSON.stringify({type:card.dataset.personType,value:card.dataset.personName}));}catch(e){}
  }));
  armReveals();
}
