// UI wiring: navbar scroll, dropdowns, search, mobile menu, scroll reveal, count-up

/* ================= Navbar scroll + dropdown/search wiring ================= */
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => navbar.classList.toggle("scrolled", window.scrollY > 8), { passive:true });

const searchBtn = document.getElementById("searchBtn");
const searchOverlay = document.getElementById("searchOverlay");
const searchInput = document.getElementById("searchInput");
const acList = document.getElementById("acList");
function openSearch(){ searchOverlay.classList.add("open"); setTimeout(()=>searchInput.focus(), 50); }
function closeSearch(){ searchOverlay.classList.remove("open"); searchInput.value=""; acList.classList.remove("open"); }
searchBtn.addEventListener("click", openSearch);
searchOverlay.addEventListener("click", (e)=>{ if(e.target===searchOverlay) closeSearch(); });
document.addEventListener("keydown", (e)=>{
  if (e.key === "/" && document.activeElement !== searchInput) { e.preventDefault(); openSearch(); }
  if (e.key === "Escape") closeSearch();
});
searchInput.addEventListener("input", () => {
  const q = searchInput.value.trim().toLowerCase();
  if(!q){ acList.classList.remove("open"); return; }
  const matches = GAMES.filter(g=>g.name.toLowerCase().includes(q)).slice(0,6);
  acList.innerHTML = matches.length ? matches.map(g=>`
    <a class="ac-row" href="#/game/${g.id}" onclick="closeSearch()">
      <div class="ac-thumb" aria-hidden="true" style="background:${gameBg(g)}, linear-gradient(135deg, ${gc(g.genres[0])}, ${gc(g.genres[0])}55)"></div>
      <span class="ac-name">${g.name}</span><span class="ac-genre">${g.genres[0]}</span>
    </a>`).join("") : `<div class="ac-empty">No games match "${q}".</div>`;
  acList.classList.add("open");
});
searchInput.addEventListener("keydown",(e)=>{ if(e.key==="Enter"){ const first=acList.querySelector(".ac-row"); if(first){ e.preventDefault(); first.click(); location.hash=first.getAttribute("href").slice(1); } } });
document.getElementById("mixerCta").addEventListener("click", ()=> location.hash="/mixer");

/* ================= Mobile navigation ================= */
const mobileMenu=document.getElementById('mobileMenu'),mobileBackdrop=document.getElementById('mobileBackdrop'),burger=document.querySelector('.burger'),mobileClose=document.getElementById('mobileClose');
function openMobile(){burger?.setAttribute('aria-expanded','true');mobileMenu.classList.add('open');mobileBackdrop.classList.add('open');document.body.classList.add('menu-open');}
function closeMobile(){burger?.setAttribute('aria-expanded','false');mobileMenu.classList.remove('open');mobileBackdrop.classList.remove('open');document.body.classList.remove('menu-open');}
burger?.addEventListener('click',openMobile);mobileClose?.addEventListener('click',closeMobile);mobileBackdrop?.addEventListener('click',closeMobile);
document.querySelectorAll('.mobile-parent').forEach(btn=>btn.addEventListener('click',()=>{const sub=document.getElementById(btn.dataset.mobileSub);if(!sub)return;sub.classList.toggle('open');btn.setAttribute('aria-expanded',sub.classList.contains('open')?'true':'false');const sign=btn.querySelector(':scope > span:last-child');if(sign)sign.textContent=sub.classList.contains('open')?'−':'+';}));
document.querySelectorAll('.mobile-menu a').forEach(a=>a.addEventListener('click',closeMobile));document.getElementById('mobileSearch')?.addEventListener('click',()=>{closeMobile();openSearch();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMobile();});

/* ================= Scroll reveal ================= */
const revealObserver = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("in"); revealObserver.unobserve(e.target); } });
}, { threshold: 0, rootMargin: "0px 0px 80px 0px" });
function armReveals(){ document.querySelectorAll(".reveal:not(.in)").forEach(el=>revealObserver.observe(el)); }

/* Count-up */
function countUp(el, target, suffix=""){
  const dur=1100, start=performance.now(), from=0;
  function step(t){
    const p=Math.min(1,(t-start)/dur);
    const eased = 1-Math.pow(1-p,3);
    el.textContent = fmt(from+(target-from)*eased) + suffix;
    if(p<1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
