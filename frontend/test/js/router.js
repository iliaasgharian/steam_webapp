// Hash router — maps #/path to a page render function

/* ================= Router ================= */
const view = document.getElementById("view");
function currentPath(){
  const h = (location.hash || "#/").slice(1);
  return h.split("#")[0] || "/";
}
function setActiveNav(path){
  document.querySelectorAll(".nav-link[data-path]").forEach(a=>{
    a.classList.toggle("active", a.dataset.path === path || (a.dataset.path!=="/" && path.startsWith(a.dataset.path)));
  });
}
function route(){
  closeSearch();
  const path = currentPath();
  const parts = path.split("/").filter(Boolean);
  setActiveNav("/" + (parts[0]||""));
  if (parts[0] === "game" && parts[1]) renderDetail(parts[1]);
  else if (["popular","top-week","top-month","wishlisted","free-games","bundles","upcoming"].includes(parts[0])) renderCollection(parts[0]);
  else if (parts[0] === "developers") renderPeoplePage("Developers", DEVELOPERS, "STUDIOS");
  else if (parts[0] === "publishers") renderPeoplePage("Publishers", PUBLISHERS, "PUBLISHERS");
  else if (parts[0] === "tags") renderTagsPage();
  else if (parts[0] === "browse") renderBrowse();
  else if (parts[0] === "genres") renderGenres();
  else if (parts[0] === "trending") renderTrending();
  else if (parts[0] === "deals") renderDeals();
  else if (parts[0] === "analytics") renderAnalytics();
  else if (parts[0] === "mixer") renderMixer();
  else if (parts[0] === "about") renderAbout();
  else if (parts[0] === "contact") renderContact();
  else renderHome();
  window.scrollTo({top:0, behavior:"auto"});
  armReveals();
}
window.addEventListener("hashchange", route);
window.closeSearch = closeSearch;
