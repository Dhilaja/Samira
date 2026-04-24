/* ================================================
   SAMIRA PORTFOLIO — UPGRADED JAVASCRIPT
   Dark Mode · Ripple · Magnetic · Animations
   ================================================ */

'use strict';

// ===== 1. DARK MODE SYSTEM =====
const html        = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

const STORAGE_KEY = 'samira-theme';

function getPreferredTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme, animate = false) {
  if (animate) {
    document.body.classList.add('theme-transitioning');
    setTimeout(() => document.body.classList.remove('theme-transitioning'), 500);
  }
  html.setAttribute('data-theme', theme);
  localStorage.setItem(STORAGE_KEY, theme);
}

// Init theme immediately (before paint) to avoid flash
applyTheme(getPreferredTheme(), false);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';

  // Tiny pulse on the toggle thumb
  const thumb = themeToggle.querySelector('.toggle-thumb');
  thumb.style.transform = current === 'dark'
    ? 'translateX(24px) scale(1.2)'
    : 'translateX(0) scale(1.2)';
  setTimeout(() => { thumb.style.transform = ''; }, 200);

  applyTheme(next, true);
});

// Respect OS preference changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    applyTheme(e.matches ? 'dark' : 'light', true);
  }
});


// ===== 2. NAVBAR: Scroll effect & hamburger =====
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

let lastScroll = 0;

window.addEventListener('scroll', () => {
  const current = window.scrollY;
  navbar.classList.toggle('scrolled', current > 40);

  // Hide navbar on rapid scroll down, show on scroll up
  if (current > lastScroll + 8 && current > 120) {
    navbar.style.transform = 'translateY(-100%)';
  } else if (current < lastScroll - 4 || current < 80) {
    navbar.style.transform = 'translateY(0)';
  }
  lastScroll = Math.max(0, current);
}, { passive: true });

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  navLinks.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
  });
});


// ===== 3. ADVANCED FADE-IN on Scroll (Staggered + Cubic Bezier) =====
const fadeEls = document.querySelectorAll('.fade-in');

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const el     = entry.target;
    const parent = el.parentElement;

    // Stagger siblings that are also fade-in elements
    const siblings = [...parent.querySelectorAll(':scope > .fade-in, :scope > * > .fade-in')];
    const allFade  = [...parent.querySelectorAll('.fade-in')];
    let idx = allFade.indexOf(el);
    if (idx < 0) idx = 0;

    // Clamp delay so it doesn't get too long
    const delay = Math.min(idx * 0.1, 0.55);
    el.style.transitionDelay    = `${delay}s`;
    el.style.transitionDuration = '0.8s';
    el.style.transitionTimingFunction = 'cubic-bezier(0.22, 1, 0.36, 1)';

    el.classList.add('visible');
    fadeObserver.unobserve(el);
  });
}, {
  threshold:   0.10,
  rootMargin:  '0px 0px -50px 0px'
});

fadeEls.forEach(el => fadeObserver.observe(el));


// ===== 4. SKILL BARS Animation =====
const skillBars = document.querySelectorAll('.skill-bar-fill');

const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const bar = entry.target;
    const targetWidth = bar.getAttribute('data-width');

    // Short delay for dramatic effect
    setTimeout(() => {
      bar.style.width = targetWidth;
      bar.classList.add('animated');
    }, 200);

    barObserver.unobserve(bar);
  });
}, { threshold: 0.5 });

skillBars.forEach(bar => barObserver.observe(bar));


// ===== 5. ACTIVE NAV LINK HIGHLIGHT =====
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navItems.forEach(a => {
        const isActive = a.getAttribute('href') === `#${id}`;
        a.style.color = isActive ? 'var(--pink-500)' : '';
        if (isActive) {
          a.style.setProperty('--after-width', '100%');
        }
      });
    }
  });
}, { threshold: 0.45 });

sections.forEach(s => activeObserver.observe(s));


// ===== 6. BUTTON RIPPLE EFFECT =====
function createRipple(event) {
  const btn  = event.currentTarget;
  const rect = btn.getBoundingClientRect();
  const x    = event.clientX - rect.left;
  const y    = event.clientY - rect.top;

  const ripple = document.createElement('span');
  ripple.classList.add('ripple-circle');
  ripple.style.left = `${x}px`;
  ripple.style.top  = `${y}px`;

  // Remove old ripples
  const old = btn.querySelector('.ripple-circle');
  if (old) old.remove();

  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 700);
}

document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', createRipple);
});


// ===== 7. MAGNETIC BUTTON EFFECT =====
const magneticBtns = document.querySelectorAll('.magnetic-btn');

magneticBtns.forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect    = btn.getBoundingClientRect();
    const centerX = rect.left + rect.width  / 2;
    const centerY = rect.top  + rect.height / 2;
    const dx      = (e.clientX - centerX) * 0.25;
    const dy      = (e.clientY - centerY) * 0.25;

    btn.style.transform = `translate(${dx}px, ${dy}px)`;
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transition = 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)';
    btn.style.transform  = 'translate(0, 0)';
    setTimeout(() => { btn.style.transition = ''; }, 450);
  });

  btn.addEventListener('mouseenter', () => {
    btn.style.transition = 'transform 0.15s ease';
  });
});


// ===== 8. HERO IMAGE PARALLAX (subtle) =====
const heroImg = document.querySelector('.hero-img-container');
if (heroImg) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight * 1.2) {
      heroImg.style.transform = `translateY(${scrolled * 0.07}px)`;
    }
  }, { passive: true });
}


// ===== 9. KKN GALLERY — LIGHTBOX (simple) =====
const kknImages = document.querySelectorAll('.kkn-img-wrap img');

kknImages.forEach(img => {
  img.style.cursor = 'zoom-in';

  img.addEventListener('click', () => {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed; inset: 0; z-index: 9999;
      background: rgba(15, 10, 25, 0.90);
      backdrop-filter: blur(10px);
      display: flex; align-items: center; justify-content: center;
      cursor: zoom-out;
      animation: fadeInOverlay 0.3s ease forwards;
    `;

    const imgEl = document.createElement('img');
    imgEl.src = img.src;
    imgEl.alt = img.alt;
    imgEl.style.cssText = `
      max-width: 90vw; max-height: 88vh;
      border-radius: 16px;
      box-shadow: 0 30px 80px rgba(0,0,0,0.6);
      object-fit: contain;
      animation: scaleIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    `;

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = `
      position: fixed; top: 24px; right: 30px;
      background: rgba(255,255,255,0.12); border: none;
      color: #fff; font-size: 2rem; width: 44px; height: 44px;
      border-radius: 50%; cursor: pointer; z-index: 10000;
      display: flex; align-items: center; justify-content: center;
      backdrop-filter: blur(8px);
      transition: background 0.2s ease;
    `;
    closeBtn.onmouseenter = () => closeBtn.style.background = 'rgba(232,73,107,0.5)';
    closeBtn.onmouseleave = () => closeBtn.style.background = 'rgba(255,255,255,0.12)';

    // Add CSS keyframes for overlay animations
    if (!document.getElementById('lightbox-styles')) {
      const style = document.createElement('style');
      style.id = 'lightbox-styles';
      style.textContent = `
        @keyframes fadeInOverlay { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.85); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `;
      document.head.appendChild(style);
    }

    const close = () => {
      overlay.style.animation = 'fadeInOverlay 0.2s ease reverse forwards';
      setTimeout(() => overlay.remove(), 200);
    };

    overlay.addEventListener('click', close);
    closeBtn.addEventListener('click', (e) => { e.stopPropagation(); close(); });
    document.addEventListener('keydown', function onKey(e) {
      if (e.key === 'Escape') { close(); document.removeEventListener('keydown', onKey); }
    });

    overlay.appendChild(imgEl);
    overlay.appendChild(closeBtn);
    document.body.appendChild(overlay);
  });
});


// ===== 10. SMOOTH SCROLL for all anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navbarHeight = navbar.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - navbarHeight - 10;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});


// ===== 11. SECTION ENTRANCE — Tilt on hover for cards =====
const tiltCards = document.querySelectorAll('.skill-card, .detail-card, .edu-card');

tiltCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect   = card.getBoundingClientRect();
    const x      = (e.clientX - rect.left) / rect.width  - 0.5;
    const y      = (e.clientY - rect.top)  / rect.height - 0.5;
    const tiltX  = y * -7;
    const tiltY  = x *  7;

    card.style.transition = 'transform 0.1s ease';
    card.style.transform  = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
    card.style.transform  = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
  });
});


// ===== 12. HERO name — letter animation on load =====
window.addEventListener('load', () => {
  const heroName = document.querySelector('.hero-name');
  if (!heroName) return;

  // Animate hero text in with a slight delay
  setTimeout(() => {
    heroName.style.opacity = '1';
    heroName.style.transform = 'translateY(0)';
  }, 100);

  // Animate hero sub-elements in sequence
  const heroEls = document.querySelectorAll('.hero-greeting, .hero-name, .hero-title, .hero-sub, .hero-buttons, .hero-socials');
  heroEls.forEach((el, i) => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = `opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.1 + 0.1}s,
                           transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.1 + 0.1}s`;
    setTimeout(() => {
      el.style.opacity   = '1';
      el.style.transform = 'translateY(0)';
    }, 80 + i * 100);
  });

  // Animate hero image in
  const imgWrap = document.querySelector('.hero-image-wrap');
  if (imgWrap) {
    imgWrap.style.opacity   = '0';
    imgWrap.style.transform = 'translateY(40px) scale(0.96)';
    imgWrap.style.transition = 'opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.4s, transform 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.4s';
    setTimeout(() => {
      imgWrap.style.opacity   = '1';
      imgWrap.style.transform = 'translateY(0) scale(1)';
    }, 400);
  }
});