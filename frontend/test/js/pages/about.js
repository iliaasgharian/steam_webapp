// About page

function renderAbout(){
  view.innerHTML = `
    <section class="page about-me-page reveal">
      <div class="about-me-grid">
        <div class="about-photo-placeholder"><div class="about-photo-icon">+</div><span>Your photo</span><small>Replace this placeholder with your picture later.</small></div>
        <div class="about-me-copy">
          <span class="k">ABOUT ME</span>
          <h1>Hi, I'm the creator of Playbase.</h1>
          <p>I'm a developer and gaming enthusiast building Playbase as a place where discovering Steam games feels simple, visual and useful.</p>
          <p>I enjoy turning ideas into real interfaces, experimenting with data and learning more about web development while building something I would genuinely use myself.</p>
          <p>Playbase is my personal project: a mix of gaming, design, data and programming. I'm continuing to improve it step by step and add features that make finding the next game to play more enjoyable.</p>
        </div>
      </div>
    </section>
  `;
}
