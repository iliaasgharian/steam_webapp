// Init — runs after the dynamically loaded app scripts are ready.

/* ================= Init ================= */
try {
  route();
} finally {
  // These scripts are injected after React hydrates, often after window.load
  // has already fired. Do not wait for another window.load event here.
  window.setTimeout(() => {
    document.getElementById("loader")?.classList.add("hide");
  }, 450);
}
