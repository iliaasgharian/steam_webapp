// Contact page

/* ================= CONTACT ================= */
function renderContact(){
  view.innerHTML = `
    <div class="page page-hero reveal">
      <span class="k">GET IN TOUCH</span><h1>Contact</h1>
      <p>Questions, feedback, or spotted an incorrect data point? This is a placeholder form for the prototype.</p>
    </div>
    <div class="page section-tight reveal">
      <div class="contact-grid">
        <div>
          <div class="field"><label>Name</label><input type="text" placeholder="Your name"></div>
          <div class="field"><label>Email</label><input type="email" placeholder="you@example.com"></div>
          <div class="field"><label>Message</label><textarea rows="5" placeholder="How can we help?"></textarea></div>
          <button class="btn-primary" type="button">Send message</button>
        </div>
        <div>
          <div class="contact-info-row"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg><div><b>Email</b><span>hello@playbase.example (placeholder)</span></div></div>
          <div class="contact-info-row"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="M7 15l4-6 3 4 5-8"/></svg><div><b>Data corrections</b><span>Flag an outdated field on any game page</span></div></div>
          <div class="contact-info-row"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg><div><b>Response time</b><span>This is a student prototype — no live inbox yet</span></div></div>
        </div>
      </div>
    </div>
  `;
}
