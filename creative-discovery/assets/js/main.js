/* Creative Discovery — Main JS */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Failsafe — the hero title is hidden by CSS until the entrance animation runs.
// If GSAP fails to load (blocked CDN, offline) or reduced motion is on, reveal it
// immediately so the headline is never permanently invisible.
function revealHeroTitle() {
  document.querySelectorAll('.hero-title[data-splitting]').forEach((t) => {
    t.style.visibility = 'visible';
  });
}
if (reduceMotion || !window.gsap) revealHeroTitle();
// Hard backstop: whatever happens, never leave the hero hidden after 1.5s.
setTimeout(revealHeroTitle, 1500);

// Smooth scroll (Lenis) — skip if reduced motion.
// When GSAP is present it drives Lenis via gsap.ticker (below).
// The manual RAF loop runs only as a fallback when GSAP is absent,
// preventing Lenis from being ticked twice per frame (which causes
// the scroll lock / lag on first load).
let lenis;
if (!reduceMotion && window.Lenis) {
  lenis = new Lenis({ duration: 1.1, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  if (!window.gsap) {
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  }
}

// Splitting.js — run BEFORE GSAP so .word/.char elements exist for animation
if (window.Splitting) {
  Splitting();
  const gradChars = [];
  document.querySelectorAll('.hero-title .word').forEach((w) => {
    if (w.textContent === 'inside' || w.textContent === "Cambodia's") {
      w.querySelectorAll('.char').forEach((c) => gradChars.push(c));
    }
  });
  gradChars.forEach((c, i) => {
    const pct = gradChars.length > 1 ? (i / (gradChars.length - 1)) * 100 : 0;
    c.style.background = 'var(--grad)';
    c.style.backgroundSize = (gradChars.length * 100) + '% 100%';
    c.style.backgroundPosition = pct + '% center';
    c.style.webkitBackgroundClip = 'text';
    c.style.backgroundClip = 'text';
    c.style.webkitTextFillColor = 'transparent';
  });
}

// GSAP + ScrollTrigger
if (!reduceMotion && window.gsap) {
  gsap.registerPlugin(ScrollTrigger);

  // Don't auto-refresh on window 'load'. Above-the-fold entrance staggers begin
  // immediately, and a refresh firing mid-animation reverts them and leaves the
  // first row frozen at staggered offsets (the "staircase" misalignment).
  ScrollTrigger.config({ autoRefreshEvents: 'visibilitychange,DOMContentLoaded,resize' });

  if (lenis) {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // Generic reveals — fire once only.
  // NOTE: use fromTo (not from) with explicit end values + clearProps. `from`
  // records the element's *current* position as the destination; if web fonts
  // finish loading mid-animation the text reflows and corrupts the in-flight
  // tween, freezing it partway (the staggered "staircase" misalignment).
  gsap.utils.toArray('.reveal').forEach((el) => {
    gsap.fromTo(el,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', clearProps: 'transform',
        scrollTrigger: { trigger: el, start: 'top 78%', once: true } });
  });

  // Homepage hero word reveal
  const heroWords = document.querySelector('.hero-title .word');
  if (heroWords) {
    gsap.from('.hero-title .word', {
      y: 80, opacity: 0, duration: 1, stagger: 0.1, ease: 'power3.out', delay: 0.2,
      onStart: () => {
        const title = document.querySelector('.hero-title');
        if (title) title.style.visibility = 'visible';
      },
    });
    gsap.from('.hero .eyebrow', { opacity: 0, duration: 0.6, delay: 0.1 });
    gsap.from('.hero-sub', { y: 20, opacity: 0, duration: 0.8, delay: 0.6 });
  }

  // Hero platform row + latest card
  if (document.querySelector('.hero .platform-row')) {
    gsap.fromTo('.hero .platform-row, .hero .latest-card',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power2.out', delay: 0.8, clearProps: 'transform' });
  }

  // Topic tiles — once
  if (document.querySelector('.topic-grid')) {
    gsap.fromTo('.topic-tile',
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: 'power3.out', clearProps: 'transform',
        scrollTrigger: { trigger: '.topic-grid', start: 'top 78%', once: true } });
  }

  // Episode cards — once
  if (document.querySelector('.episode-grid')) {
    gsap.fromTo('.episode-card',
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out', clearProps: 'transform',
        scrollTrigger: { trigger: '.episode-grid', start: 'top 80%', once: true } });
  }

  // Guest tiles — once
  if (document.querySelector('.guest-grid')) {
    gsap.fromTo('.guest-tile, .guest-tile-lg',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.06, ease: 'power2.out', clearProps: 'transform',
        scrollTrigger: { trigger: '.guest-grid', start: 'top 80%', once: true } }
    );
  }

  // Episode detail hero
  if (document.querySelector('.ep-hero')) {
    gsap.fromTo('.ep-hero > .container > *',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out', clearProps: 'transform' });
  }

  // Show note rows — once
  if (document.querySelector('.shownotes')) {
    gsap.fromTo('.shownote-row',
      { x: -20, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: 'power2.out', clearProps: 'transform',
        scrollTrigger: { trigger: '.shownotes', start: 'top 80%', once: true } });
  }

  // Stat cards — once
  if (document.querySelector('.stat-grid')) {
    gsap.fromTo('.stat-card',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out', clearProps: 'transform',
        scrollTrigger: { trigger: '.stat-grid', start: 'top 80%', once: true } });
  }

  // Sponsor cards — once
  if (document.querySelector('.sponsor-grid')) {
    gsap.fromTo('.sponsor-card',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out', clearProps: 'transform',
        scrollTrigger: { trigger: '.sponsor-grid', start: 'top 80%', once: true } });
  }

  // Value cards — once
  if (document.querySelector('.values-grid')) {
    gsap.fromTo('.value-card',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out', clearProps: 'transform',
        scrollTrigger: { trigger: '.values-grid', start: 'top 80%', once: true } });
  }

  // Resource sections — once
  if (document.querySelector('.resource-section')) {
    gsap.fromTo('.resource-section',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: 'power3.out', clearProps: 'transform',
        scrollTrigger: { trigger: '.resource-section', start: 'top 80%', once: true } });
  }

}


// Nav scroll state
const nav = document.querySelector('.nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });
}

// Mobile menu toggle
const menuBtn = document.querySelector('.nav-toggle');
const overlay = document.querySelector('.nav-overlay');
if (menuBtn && overlay) {
  menuBtn.addEventListener('click', () => {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
  const closeBtn = overlay.querySelector('.nav-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
  overlay.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// Cursor-following spotlight on cards — sets --mx/--my for the glow layer.
// Skipped on touch / coarse pointers where hover doesn't apply.
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const spotlightCards = document.querySelectorAll(
    '.topic-tile, .episode-card, .sponsor-card, .value-card, .stat-card, .guest-box, .latest-card, .host-strip'
  );
  spotlightCards.forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
      card.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%');
    });
  });
}

// Mini-player body padding — prevent content overlap
const miniPlayer = document.querySelector('.mini-player');
if (miniPlayer) {
  const observer = new MutationObserver(() => {
    if (!miniPlayer.hidden) {
      document.body.style.paddingBottom = miniPlayer.offsetHeight + 'px';
    } else {
      document.body.style.paddingBottom = '';
    }
  });
  observer.observe(miniPlayer, { attributes: true, attributeFilter: ['hidden'] });
}
