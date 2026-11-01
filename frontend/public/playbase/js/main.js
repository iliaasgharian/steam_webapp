// Init — hides the loader and runs the first route. Must load last.

/* ================= Init ================= */
window.addEventListener("load",()=>setTimeout(()=>document.getElementById("loader")?.classList.add("hide"),450));
route();
