// Game Mixer — pick two games, get a blended concept + the closest real games.
// Phase 1: runs fully in the browser on the sample data (tags/genres).
// Later: replace mixGames() with a call to POST /api/mix (pgvector + LLM) — the UI can stay the same.

/* ================= GAME MIXER ================= */
const MIX_POOL = (() => { const seen = new Set(); return [...GAMES, ...FREE_GAMES, ...UPCOMING].filter(g => !seen.has(g.id) && seen.add(g.id)); })();
const MIX_SKIP_TRAITS = /singleplayer|multiplayer|controller|achievements|steam deck/i;

// Selected games survive going to the picker page and back.
let mixPicks = (() => { try{ return JSON.parse(sessionStorage.getItem('playbase-mix-picks') || '{}') }catch(e){ return {} } })();
const mixSave = () => { try{ sessionStorage.setItem('playbase-mix-picks', JSON.stringify(mixPicks)) }catch(e){} };
const mixById = id => MIX_POOL.find(g => g.id === id);

function mixTags(g){ return tagsForGame(g); }
function mixTraits(g, other){            // "flavor" tags: not a genre, not a feature, not shared with the other game
  const t = mixTags(g).filter(x => !(g.genres||[]).includes(x) && !MIX_SKIP_TRAITS.test(x) && !other.includes(x));
  return t.length ? t : (g.genres||[]);
}
function mixArticle(w){ return /^[aeiou]/i.test(w) ? 'An' : 'A'; }
function mixName(a, b, v){               // "Hollowmark" + "Ironsprawl" -> "Hollowsprawl"
  a = a.split(' ')[0]; b = b.split(' ').pop();
  const cut = [0.55, 0.45, 0.65][v % 3];
  const left = a.slice(0, Math.ceil(a.length * cut)); let right = b.slice(Math.floor(b.length * (1 - cut)));
  if (left.slice(-1).toLowerCase() === right[0].toLowerCase()) right = right.slice(1);   // no doubled letter at the seam
  return left + right;
}

// Core logic. Returns { name, pitch, shared, onlyA, onlyB, similar:[{g, pct, reasons, both}], hasBoth }
function mixGames(A, B, variant = 0){
  const ta = mixTags(A), tb = mixTags(B);
  const shared = ta.filter(t => tb.includes(t));
  const onlyA = ta.filter(t => !tb.includes(t)), onlyB = tb.filter(t => !ta.includes(t));
  const gA = (A.genres||[])[0] || 'Game', gB = (B.genres||[])[0] || 'Game';
  const trA = mixTraits(A, tb)[0], trB = mixTraits(B, ta)[0];
  const genres = gA === gB ? `${gA}` : `${gA} / ${gB}`;
  const pitches = [
    `${gA === gB ? mixArticle(gA) + ' sharper ' + gA : mixArticle(gA) + ' ' + genres + ' hybrid'}: ${trA} at its core, ${trB} in the details.`,
    `Take the ${trA.toLowerCase()} spirit of ${A.name} and drop it into the ${gB} world of ${B.name}.`,
    `${B.name}'s ${trB.toLowerCase()} ${gB} loop, rebuilt with ${A.name}'s ${gA} edge.`
  ];
  // closest real games: share tags with BOTH picks first, then by similarity
  const similar = MIX_POOL.filter(g => g.id !== A.id && g.id !== B.id).map(g => {
    const tg = mixTags(g), inA = tg.filter(t => ta.includes(t)), inB = tg.filter(t => tb.includes(t));
    const sim = (inA.length / ta.length + inB.length / tb.length) / 2;
    return { g, pct: Math.round(sim * 100), both: inA.length > 0 && inB.length > 0, reasons: [...new Set([...inA, ...inB])].slice(0, 3) };
  }).filter(x => x.pct > 0).sort((x, y) => (y.both - x.both) || (y.pct - x.pct)).slice(0, 3);
  return { name: mixName(A.name, B.name, variant), pitch: pitches[variant % 3], shared, onlyA, onlyB, similar, hasBoth: similar.some(s => s.both) };
}

// Minimal tile for the picker: image + name only (no link to the game, no hover panel, no wishlist).
function mixPickTile(g, current){
  const art = `url(${gameImg(g)}) center/cover no-repeat, linear-gradient(135deg, ${gc(g.genres[0])}, ${gc(g.genres[0])}55)`;
  return `<a class="mix-pick-tile${current ? ' is-current' : ''}" href="#/mixer" data-pick-id="${g.id}"><div class="mix-pick-art" style="background:${art}"></div><div class="mix-pick-name">${g.name}</div></a>`;
}

/* ---- Picker page: #/mixer/pick/a  or  #/mixer/pick/b  — same filters as "All games" ---- */
function renderMixerPicker(slot){
  if (slot !== 'a' && slot !== 'b'){ location.hash = '#/mixer'; return; }
  const otherG = mixById(mixPicks[slot === 'a' ? 'b' : 'a']);
  const data = MIX_POOL.filter(g => !otherG || g.id !== otherG.id);
  renderCatalog({
    data, tile: g => mixPickTile(g, mixPicks[slot] === g.id),
    kicker: `GAME MIXER · STEP ${slot === 'a' ? 1 : 2} OF 2`,
    title: slot === 'a' ? 'Choose the first game' : 'Choose the second game',
    desc: otherG ? `Pick a game to blend with ${otherG.name}. Use the filters to narrow the list.` : 'Click a game to add it to the mixer. Use the filters to narrow the list.',
    genres: [...new Set(data.flatMap(g => g.genres || []))],
    genreCount: gn => data.filter(x => (x.genres || []).includes(gn)).length,
    sorts: [['relevance','Sort: Relevance'],['players','Sort: Players online'],['score','Sort: Review score'],['date-new','Sort: Release date (newest)']],
    totalText: n => `${n} of ${data.length} games`
  });
  const hero = view.querySelector('.page-hero');
  if (hero) hero.insertAdjacentHTML('afterbegin', '<a class="mx-back" href="#/mixer">← Back to Game Mixer</a>');
  document.getElementById('browseGrid').addEventListener('click', e => {
    const a = e.target.closest('[data-pick-id]'); if (!a) return;
    e.preventDefault(); mixPicks[slot] = a.dataset.pickId; mixSave(); location.hash = '#/mixer';
  });
}

/* ---- Mixer page ---- */
function renderMixer(animate = true){
  // `animate` is false when the page re-renders itself (Clear / Surprise me): no fade-in, so nothing is left hidden.
  const rv = animate === false ? '' : ' reveal';
  let mixed = false;   // the blend only appears after the person presses the Mix button
  // restore a pair that was waiting for login (it was already mixed, so show the result again)
  try{ const p = JSON.parse(localStorage.getItem('playbase-mix-pending') || 'null'); if(p && localStorage.getItem('playbase-user')){ mixPicks = { a: p.a, b: p.b }; mixSave(); localStorage.removeItem('playbase-mix-pending'); localStorage.removeItem('playbase-mix-intent'); mixed = true; } }catch(e){}
  ['a','b'].forEach(k => { if(!mixById(mixPicks[k])) delete mixPicks[k]; });
  let variant = 0, last = null;
  const cover = g => `style="background:url(${gameImg(g)}) center/cover no-repeat, linear-gradient(135deg, ${gc(g.genres[0])}, ${gc(g.genres[0])}55)"`;
  const slotHTML = (k, label) => { const g = mixById(mixPicks[k]);
    return `<a class="mx-slot ${g ? 'filled' : 'empty'}" href="#/mixer/pick/${k}" aria-label="${g ? 'Change' : 'Choose'} the ${label} game">
      <div class="mx-cover" ${g ? cover(g) : ''}>${g ? '' : '<span class="mx-plus">+</span>'}</div>
      <span class="mx-label">${label} game</span><b class="mx-name">${g ? g.name : 'Choose a game'}</b><span class="mx-change">${g ? 'Change' : 'Browse all games →'}</span></a>`; };
  const both = mixPicks.a && mixPicks.b;

  view.innerHTML = `
    <div class="page page-hero${rv}">
      <span class="k">EXPERIMENTAL</span><h1>Game Mixer</h1>
      <p>Pick two games you love, and Playbase blends them into a new concept — then shows the closest games that already exist.</p>
    </div>
    <div class="page section-tight${rv}">
      <div class="mx-stage">${slotHTML('a','First')}<div class="mx-op">+</div>${slotHTML('b','Second')}</div>
      <div class="mx-actions">
        <button class="btn-primary" id="mxMix" type="button" ${both ? '' : 'disabled'}>✣ Mix</button>
        <button class="btn-ghost" id="mxShuffle" type="button">🎲 Surprise me</button>
        <button class="btn-ghost" id="mxReset" type="button" ${(mixPicks.a || mixPicks.b) ? '' : 'hidden'}>Clear</button>
      </div>
      <div id="mxResult" aria-live="polite"></div>
    </div>`;

  const chips = (arr, cls) => arr.slice(0, 6).map(t => `<span class="mx-chip ${cls}">${t}</span>`).join('');
  function update(){
    const out = document.getElementById('mxResult');
    const mixBtn = document.getElementById('mxMix');
    if(!both){ last = null; out.innerHTML = `<p class="mx-note">${mixPicks.a || mixPicks.b ? `Now choose the ${mixPicks.a ? 'second' : 'first'} game.` : 'Choose two games to see the mix.'}</p>`; return; }
    if(!mixed){ last = null; mixBtn.textContent = '✣ Mix'; out.innerHTML = `<p class="mx-note">Both games are ready — press <b>Mix</b> to blend them.</p>`; return; }
    mixBtn.textContent = '✣ Mix again';
    const A = mixById(mixPicks.a), B = mixById(mixPicks.b);
    const r = last = mixGames(A, B, variant);
    out.innerHTML = `
      <div class="mx-result">
        <div class="mx-result-main">
          <span class="mx-eq">${A.name} × ${B.name}</span>
          <h2>${r.name}</h2>
          <p class="mx-pitch">${r.pitch}</p>
          <div class="mx-dna">
            ${r.shared.length ? `<div><b>Shared DNA</b>${chips(r.shared,'both')}</div>` : ''}
            <div><b>From ${A.name}</b>${chips(r.onlyA,'a')}</div>
            <div><b>From ${B.name}</b>${chips(r.onlyB,'b')}</div>
          </div>
          <div class="mixer-save-row">
            <button class="btn-primary mixer-save-button" id="saveCompletedMix" type="button">✣ Save this mix to my account</button>
            <p id="mixerSaveFeedback" class="mixer-save-feedback" role="status"></p>
          </div>
        </div>
      </div>
      <h3 class="mx-sub">${r.hasBoth ? 'Games that already blend both' : 'Closest existing games'}</h3>
      <p class="mx-subnote">${r.hasBoth ? 'Ranked by how many tags they share with each of your picks.' : 'No game in the catalog combines both yet — this concept is still open. These are the closest.'}</p>
      <div class="grid mx-similar">${r.similar.map(s => `<div class="mx-match"><div class="mx-match-top"><span class="mx-pct">${s.pct}% match</span><span class="mx-why">${s.reasons.join(' · ')}</span></div>${gameTile(s.g)}</div>`).join('')}</div>`;
    document.getElementById('saveCompletedMix').onclick = saveMix;
  }
  function saveMix(){
    const btn = document.getElementById('saveCompletedMix'), fb = document.getElementById('mixerSaveFeedback');
    let user = null; try{ user = JSON.parse(localStorage.getItem('playbase-user') || 'null') }catch(e){}
    if(!user){ localStorage.setItem('playbase-mix-intent','1'); localStorage.setItem('playbase-mix-pending', JSON.stringify({ a: mixPicks.a, b: mixPicks.b })); location.hash = '#/login'; return; }
    let mixes = []; try{ mixes = JSON.parse(localStorage.getItem('playbase-mixes') || '[]') }catch(e){}
    const A = mixById(mixPicks.a), B = mixById(mixPicks.b);
    mixes.push({ id: String(Date.now()), gameA: A.name, gameB: B.name, title: `${A.name} × ${B.name}`, result: `${last.name} — ${last.pitch}`, createdAt: new Date().toISOString() });
    localStorage.setItem('playbase-mixes', JSON.stringify(mixes));
    fb.textContent = 'Mix saved to your account history.'; btn.textContent = '✓ Saved to account'; btn.classList.add('is-saved');
  }
  document.getElementById('mxMix').onclick = () => { if(!both) return; if(mixed) variant++; mixed = true; update(); };
  document.getElementById('mxShuffle').onclick = () => {
    const ids = MIX_POOL.map(g => g.id); const x = ids[Math.floor(Math.random() * ids.length)];
    const rest = ids.filter(i => i !== x); mixPicks = { a: x, b: rest[Math.floor(Math.random() * rest.length)] }; mixSave(); renderMixer(false);
  };
  document.getElementById('mxReset').onclick = () => { mixPicks = {}; mixSave(); renderMixer(false); };
  update();
  if (typeof armReveals === 'function') armReveals();
}
