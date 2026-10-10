// Game Mixer — pick two games, get a blended concept + the closest real games.
// Phase 1: runs fully in the browser on the sample data (tags/genres).
// Later: replace mixGames() with a call to POST /api/mix (pgvector + LLM) — the UI can stay the same.

/* ================= GAME MIXER ================= */
const MIX_POOL = (() => { const seen = new Set(); return [...GAMES, ...FREE_GAMES, ...UPCOMING].filter(g => !seen.has(g.id) && seen.add(g.id)); })();
const MIX_SKIP_TRAITS = /singleplayer|multiplayer|controller|achievements|steam deck/i;

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

function renderMixer(){
  const opts = sel => MIX_POOL.map(g => `<option value="${g.id}" ${g.id===sel?'selected':''}>${g.name}</option>`).join('');
  let a = GAMES[4].id, b = GAMES[2].id, variant = 0, last = null;
  // restore a pick that was waiting for login
  try{ const p = JSON.parse(localStorage.getItem('playbase-mix-pending')||'null'); if(p && localStorage.getItem('playbase-user')){ a = p.a; b = p.b; localStorage.removeItem('playbase-mix-pending'); localStorage.removeItem('playbase-mix-intent'); } }catch(e){}

  view.innerHTML = `
    <div class="page page-hero reveal">
      <span class="k">EXPERIMENTAL</span><h1>Game Mixer</h1>
      <p>Pick two games you love, and Playbase blends them into a new concept — then shows the closest games that already exist.</p>
    </div>
    <div class="page section-tight reveal">
      <div class="mx-stage">
        <div class="mx-slot"><div class="mx-cover" id="mxCoverA"></div><label for="mxSelA">First game</label><select id="mxSelA">${opts(a)}</select></div>
        <div class="mx-op">+</div>
        <div class="mx-slot"><div class="mx-cover" id="mxCoverB"></div><label for="mxSelB">Second game</label><select id="mxSelB">${opts(b)}</select></div>
      </div>
      <div class="mx-actions">
        <button class="btn-primary" id="mxAgain" type="button">✣ Mix again</button>
        <button class="btn-ghost" id="mxShuffle" type="button">🎲 Surprise me</button>
      </div>
      <div id="mxResult" aria-live="polite"></div>
    </div>`;

  const byId = id => MIX_POOL.find(g => g.id === id);
  const cover = (el, g) => { el.style.background = `url(${gameImg(g)}) center/cover no-repeat, linear-gradient(135deg, ${gc(g.genres[0])}, ${gc(g.genres[0])}55)`; };
  const chips = (arr, cls) => arr.slice(0, 6).map(t => `<span class="mx-chip ${cls}">${t}</span>`).join('');

  function update(){
    a = document.getElementById('mxSelA').value; b = document.getElementById('mxSelB').value;
    const A = byId(a), B = byId(b), out = document.getElementById('mxResult');
    cover(document.getElementById('mxCoverA'), A); cover(document.getElementById('mxCoverB'), B);
    if(a === b){ last = null; out.innerHTML = `<p class="mx-note">Pick two different games to mix.</p>`; return; }
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
    let user = null; try{ user = JSON.parse(localStorage.getItem('playbase-user')||'null') }catch(e){}
    if(!user){ localStorage.setItem('playbase-mix-intent','1'); localStorage.setItem('playbase-mix-pending', JSON.stringify({a, b})); location.hash = '#/login'; return; }
    let mixes = []; try{ mixes = JSON.parse(localStorage.getItem('playbase-mixes')||'[]') }catch(e){}
    const A = byId(a), B = byId(b);
    mixes.push({ id: String(Date.now()), gameA: A.name, gameB: B.name, title: `${A.name} × ${B.name}`, result: `${last.name} — ${last.pitch}`, createdAt: new Date().toISOString() });
    localStorage.setItem('playbase-mixes', JSON.stringify(mixes));
    fb.textContent = 'Mix saved to your account history.'; btn.textContent = '✓ Saved to account'; btn.classList.add('is-saved');
  }

  document.getElementById('mxSelA').onchange = document.getElementById('mxSelB').onchange = () => { variant = 0; update(); };
  document.getElementById('mxAgain').onclick = () => { variant++; update(); };
  document.getElementById('mxShuffle').onclick = () => {
    const pick = () => MIX_POOL[Math.floor(Math.random() * MIX_POOL.length)].id; let x = pick(), y = pick(); while(y === x) y = pick();
    document.getElementById('mxSelA').value = x; document.getElementById('mxSelB').value = y; variant = 0; update();
  };
  update();
}
