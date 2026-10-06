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
      <div class="mixer-save-row">
        <button class="btn-primary mixer-save-button" id="saveCompletedMix" type="button">✣ Save this mix to my account</button>
        <p id="mixerSaveFeedback" class="mixer-save-feedback" role="status"></p>
      </div>
      <div class="notify-row">
        <input type="text" placeholder="you@example.com — get notified at launch">
        <button class="btn-primary" type="button">Notify me</button>
      </div>
    </div>
  `;
  const saveButton=document.getElementById('saveCompletedMix');
  if(saveButton) saveButton.onclick=()=>{
    let user=null;try{user=JSON.parse(localStorage.getItem('playbase-user')||'null')}catch(e){}
    if(!user){localStorage.setItem('playbase-mix-intent','1');location.hash='#/login';return;}
    let mixes=[];try{mixes=JSON.parse(localStorage.getItem('playbase-mixes')||'[]')}catch(e){}
    const a=GAMES[4].name,b=GAMES[2].name;
    mixes.push({id:String(Date.now()),gameA:a,gameB:b,title:`${a} × ${b}`,result:'A tactical metroidvania with base-building between runs',createdAt:new Date().toISOString()});
    localStorage.setItem('playbase-mixes',JSON.stringify(mixes));
    const feedback=document.getElementById('mixerSaveFeedback');
    if(feedback)feedback.textContent='Mix saved to your account history.';
    saveButton.textContent='✓ Saved to account';saveButton.classList.add('is-saved');
  };
}
