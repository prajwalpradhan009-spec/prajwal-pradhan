lucide.createIcons();

const termBody = document.getElementById('termBody');
if (termBody) {
  const codeLines = [
    'import { AI_Agent } from "./jarvis";',
    'const agent = new AI_Agent();',
    'agent.configure({ voice: true, tasks: "auto" });',
    'agent.watch("everyday work");',
    '',
    '// listening...',
    'agent.on("idea", async (msg) => {',
    '  await agent.build(msg);',
    '  const reply = agent.answer(msg);',
    '  console.log(reply);',
    '});',
    '',
    'agent.run();',
  ];
  let lineIndex = 0;
  let charIndex = 0;
  const caret = termBody.querySelector('.term-caret');
  function typeCode() {
    if (document.hidden) { setTimeout(typeCode, 80); return; }
    const full = codeLines[lineIndex];
    if (charIndex < full.length) {
      caret.before(document.createTextNode(full[charIndex]));
      charIndex++;
      setTimeout(typeCode, 26);
      return;
    }
    termBody.append(document.createTextNode('\n'));
    lineIndex++;
    charIndex = 0;
    if (lineIndex >= codeLines.length) {
      setTimeout(() => { termBody.replaceChildren(caret); lineIndex = 0; typeCode(); }, 3200);
    } else {
      setTimeout(typeCode, 180);
    }
  }
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    setTimeout(typeCode, 400);
  } else {
    caret.before(document.createTextNode(codeLines.join('\n')));
  }
}

const themeToggle = document.querySelector('.theme-toggle');
const isLocal = window.location.protocol === 'file:' || ['localhost', '127.0.0.1'].includes(window.location.hostname);
const apiBase = window.PORTFOLIO_API_URL || (isLocal ? 'http://127.0.0.1:3000/api' : `${window.location.origin}/api`);
const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme === 'dark') document.documentElement.dataset.theme = 'dark';
function updateThemeToggle() {
  const isDark = document.documentElement.dataset.theme === 'dark';
  themeToggle.setAttribute('aria-pressed', isDark);
  themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  themeToggle.innerHTML = `<i data-lucide="${isDark ? 'sun' : 'moon'}"></i><span>${isDark ? 'Light' : 'Dark'}</span>`;
  lucide.createIcons();
}
updateThemeToggle();
themeToggle.addEventListener('click', () => {
  const isDark = document.documentElement.dataset.theme === 'dark';
  document.documentElement.dataset.theme = isDark ? 'light' : 'dark';
  localStorage.setItem('portfolio-theme', isDark ? 'light' : 'dark');
  updateThemeToggle();
});

const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const trackScrollProgress = window.matchMedia('(min-width: 851px) and (hover: hover) and (pointer: fine)');

let scrollFrameQueued = false;
let lastScrollProgress = -1;
let lastHeaderScrolled = null;
let scrollIdleTimer = null;

function applyScrollState() {
  scrollFrameQueued = false;
  const y = window.scrollY;

  const isScrolled = y > 20;
  if (isScrolled !== lastHeaderScrolled) {
    header.classList.toggle('scrolled', isScrolled);
    lastHeaderScrolled = isScrolled;
  }

  if (!trackScrollProgress.matches) return;

  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? Math.min(100, (y / maxScroll) * 100) : 0;
  const roundedProgress = Math.round(progress * 10) / 10;
  if (roundedProgress !== lastScrollProgress) {
    document.documentElement.style.setProperty('--scroll-progress', String(roundedProgress / 100));
    lastScrollProgress = roundedProgress;
  }
}

function markScrolling() {
  document.documentElement.classList.add('is-scrolling');
  clearTimeout(scrollIdleTimer);
  scrollIdleTimer = setTimeout(() => {
    document.documentElement.classList.remove('is-scrolling');
  }, 180);
}

window.addEventListener('scroll', () => {
  markScrolling();
  if (scrollFrameQueued) return;
  scrollFrameQueued = true;
  requestAnimationFrame(applyScrollState);
}, { passive: true });

window.addEventListener('touchstart', markScrolling, { passive: true });
window.addEventListener('wheel', markScrolling, { passive: true });

/* ------------------------------------------------- header height sync */
const scrollRoot = document.documentElement;
function syncHeaderOffset() {
  if (!header) return 76;
  const height = Math.ceil(header.getBoundingClientRect().height);
  if (height <= 0) return 76;
  scrollRoot.style.setProperty('--header-offset', `${height}px`);
  return height;
}
let currentHeaderOffset = syncHeaderOffset();
window.addEventListener('resize', () => {
  currentHeaderOffset = syncHeaderOffset();
}, { passive: true });

/* ------------------------------------------------- typewriter effect */
const phrases = ['Full-Stack Development', 'Python Development', 'Creative Problem Solving', 'Building for the web'];
const typedText = document.querySelector('#typed-text');
if (typedText) {
  let phraseIndex = 0;
  let characterIndex = phrases[0].length;
  let deleting = true;
  function typeLoop() {
    const phrase = phrases[phraseIndex];
    typedText.textContent = phrase.slice(0, characterIndex);
    if (deleting) characterIndex -= 1; else characterIndex += 1;
    if (characterIndex === 0) { deleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; }
    if (characterIndex === phrases[phraseIndex].length) { deleting = true; }
    setTimeout(typeLoop, deleting ? 55 : 105);
  }
  setTimeout(typeLoop, 1800);
}

/* ------------------------------------------------- stats counter animation */
let hasAnimatedStats = false;
function animateCounts() {
  document.querySelectorAll('[data-count]').forEach(counter => {
    const target = Number(counter.dataset.count);
    if (isNaN(target)) return;
    let value = 0;
    counter.textContent = '0';
    const tick = () => {
      value += Math.ceil(target / 18) || 1;
      if (value >= target) {
        counter.textContent = target;
      } else {
        counter.textContent = value;
      }
      if (value < target) {
        requestAnimationFrame(tick);
      }
    };
    requestAnimationFrame(tick);
  });
}

/* ------------------------------------------------- reveal observer */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    if (entry.target.classList.contains('stats') && !hasAnimatedStats) {
      hasAnimatedStats = true;
      animateCounts();
    }
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal, .stats').forEach(el => revealObserver.observe(el));

/* ------------------------------------------------- Navigation & Section Definitions */
const PAGES = {
  home: {
    id: 'home',
    path: '/',
    title: 'Prajwal Pradhan | Full-Stack Developer',
    aliases: ['home', 'home.html', 'index', 'index.html']
  },
  about: {
    id: 'about',
    path: '/about',
    title: 'About | Prajwal Pradhan',
    aliases: ['about', 'about.html', 'stats']
  },
  learning: {
    id: 'learning',
    path: '/learning',
    title: 'Learning | Prajwal Pradhan',
    aliases: ['learning', 'learning.html', 'education', 'education.html', '/education']
  },
  skills: {
    id: 'skills',
    path: '/skills',
    title: 'Skills & Tech Stack | Prajwal Pradhan',
    aliases: ['skills', 'skills.html']
  },
  projects: {
    id: 'projects',
    path: '/projects',
    title: 'Featured Projects | Prajwal Pradhan',
    aliases: ['projects', 'projects.html']
  },
  github: {
    id: 'github',
    path: '/github',
    title: 'GitHub Activity | Prajwal Pradhan',
    aliases: ['github', 'github.html']
  },
  services: {
    id: 'services',
    path: '/services',
    title: 'Services & Capabilities | Prajwal Pradhan',
    aliases: ['services', 'services.html']
  },
  contact: {
    id: 'contact',
    path: '/contact',
    title: 'Contact | Prajwal Pradhan',
    aliases: ['contact', 'contact.html']
  },
  profile: {
    id: 'profile',
    path: '/profile',
    title: 'Profile | Prajwal Pradhan',
    aliases: ['profile', 'profile.html', 'prajwal-pradhan', 'prajwal-pradhan.html', '/prajwal-pradhan']
  }
};

function resolvePageKey(input) {
  if (!input) return 'home';
  const clean = String(input).trim().toLowerCase().replace(/^\/+/, '').replace(/\/+$/, '').replace(/^#/, '');
  if (!clean || clean === 'home' || clean === 'index' || clean === 'index.html') return 'home';

  for (const [key, conf] of Object.entries(PAGES)) {
    if (key === clean) return key;
    if (conf.aliases) {
      for (const alias of conf.aliases) {
        const cleanAlias = alias.replace(/^\/+/, '').replace(/\/+$/, '').replace(/^#/, '');
        if (clean === cleanAlias) return key;
      }
    }
  }
  return null;
}

let currentPage = null;
let isProgrammaticScrolling = false;
let scrollLockTimer = null;
let scrollToken = 0;

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

function animateScrollTo(targetY, onComplete) {
  const startY = window.scrollY;
  const distance = targetY - startY;
  if (Math.abs(distance) < 2) {
    if (onComplete) onComplete();
    return;
  }

  isProgrammaticScrolling = true;
  scrollRoot.classList.add('is-programmatic-scroll');
  const token = ++scrollToken;
  const duration = Math.min(850, Math.max(340, Math.abs(distance) * 0.45));
  const startTime = performance.now();

  const step = now => {
    if (token !== scrollToken) return;
    const progress = Math.min((now - startTime) / duration, 1);
    window.scrollTo(0, startY + distance * easeInOutCubic(progress));
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      scrollRoot.classList.remove('is-programmatic-scroll');
      clearTimeout(scrollLockTimer);
      scrollLockTimer = setTimeout(() => {
        isProgrammaticScrolling = false;
      }, 100);
      if (onComplete) onComplete();
    }
  };
  requestAnimationFrame(step);
}

function updateActiveNav(pageKey) {
  const allNavLinks = document.querySelectorAll('.nav-links a[data-nav], .nav-links a:not(.resume-link)');
  allNavLinks.forEach(link => {
    const href = link.getAttribute('href') || '';
    const linkNav = link.dataset.nav || resolvePageKey(href);
    const isActive = linkNav === pageKey;
    link.classList.toggle('active', isActive);
  });
}

function activateSectionFeatures(pageKey) {
  if (pageKey === 'about') {
    animateCounts();
  } else if (pageKey === 'skills') {
    if (typeof window.syncSkills === 'function') window.syncSkills();
  } else if (pageKey === 'github') {
    if (typeof window.loadGitHubDashboard === 'function') window.loadGitHubDashboard();
  }
}

function setCurrentActiveSection(pageKey, updateUrl = true) {
  if (currentPage === pageKey) return;
  currentPage = pageKey;
  const pageConf = PAGES[pageKey] || PAGES.home;

  document.title = pageConf.title;
  updateActiveNav(pageKey);

  // Mark currently active section with .section-in-view to intensify bold & glowing color
  const allSections = document.querySelectorAll('#home, #about, #learning, #skills, #projects, #github, #services, #contact, #profile');
  allSections.forEach(section => {
    const isTarget = section.id === pageConf.id;
    section.classList.toggle('section-in-view', isTarget);
  });

  activateSectionFeatures(pageKey);

  if (updateUrl && !isProgrammaticScrolling) {
    const isFile = window.location.protocol === 'file:';
    const targetUrl = isFile ? `#${pageKey}` : pageConf.path;
    try {
      history.replaceState({ page: pageKey }, pageConf.title, targetUrl);
    } catch {
      window.location.hash = pageKey;
    }
  }
}

function scrollToPage(pageKey, pushHistory = true) {
  const pageConf = PAGES[pageKey] || PAGES.home;
  const targetEl = document.getElementById(pageConf.id);
  if (!targetEl) return;

  currentHeaderOffset = syncHeaderOffset();
  const targetY = pageKey === 'home'
    ? 0
    : Math.max(0, Math.round(targetEl.getBoundingClientRect().top + window.scrollY - (currentHeaderOffset + 18)));

  setCurrentActiveSection(pageKey, false);

  if (pushHistory) {
    const isFile = window.location.protocol === 'file:';
    const targetUrl = isFile ? `#${pageKey}` : pageConf.path;
    try {
      history.pushState({ page: pageKey }, pageConf.title, targetUrl);
    } catch {
      window.location.hash = pageKey;
    }
  }

  if (reduceMotionQuery.matches) {
    window.scrollTo(0, targetY);
  } else {
    animateScrollTo(targetY);
  }
}

window.navigateToPage = function(key) {
  const resolved = resolvePageKey(key);
  if (resolved) scrollToPage(resolved);
};

/* ------------------------------------------------- Scroll Spy (Intersection Observer) */
const SECTION_KEYS = ['home', 'about', 'learning', 'skills', 'projects', 'github', 'services', 'contact', 'profile'];
const observedSections = SECTION_KEYS.map(id => document.getElementById(id)).filter(Boolean);

if (observedSections.length) {
  const scrollSpyObserver = new IntersectionObserver(
    entries => {
      if (isProgrammaticScrolling) return;
      const visibleEntries = entries.filter(e => e.isIntersecting);
      if (visibleEntries.length > 0) {
        visibleEntries.sort((a, b) => Math.abs(a.boundingClientRect.top - 80) - Math.abs(b.boundingClientRect.top - 80));
        const activeKey = visibleEntries[0].target.id;
        if (activeKey) {
          setCurrentActiveSection(activeKey, true);
        }
      }
    },
    {
      rootMargin: '-20% 0px -40% 0px',
      threshold: [0, 0.15, 0.4, 0.7]
    }
  );

  observedSections.forEach(section => scrollSpyObserver.observe(section));
}

// User scroll intervention interrupts programmatic scroll
for (const type of ['wheel', 'touchstart', 'pointerdown']) {
  window.addEventListener(type, () => {
    if (scrollRoot.classList.contains('is-programmatic-scroll')) {
      scrollToken++;
      scrollRoot.classList.remove('is-programmatic-scroll');
      isProgrammaticScrolling = false;
    }
  }, { passive: true });
}

/* ------------------------------------------------- 3D Card Zoom & Entrance Observer */
const cardEntranceObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('card-in-view');
      } else {
        // Smoothly return cards to original appearance when scrolling away
        entry.target.classList.remove('card-in-view');
      }
    });
  },
  {
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.12
  }
);
document.querySelectorAll('.card-3d-entrance').forEach(el => cardEntranceObserver.observe(el));

/* ------------------------------------------------- Interactive 3D Card Cursor Tilt */
function init3DCardTilt() {
  if (reduceMotionQuery.matches) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const tiltTargets = document.querySelectorAll(
    '.card-3d, .sk-card, .project-showcase, .service, .timeline-item, .profile-card-3d, .code-window'
  );

  tiltTargets.forEach(card => {
    let bounds;
    let mouseX = 0;
    let mouseY = 0;
    let isHovering = false;
    let rafId = null;

    function updateTransform() {
      if (!isHovering) return;
      const x = (mouseX - bounds.left) / bounds.width - 0.5;
      const y = (mouseY - bounds.top) / bounds.height - 0.5;
      const rotX = (-y * 12).toFixed(2);
      const rotY = (x * 12).toFixed(2);

      card.style.transform = `perspective(1200px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(12px) scale3d(1.02, 1.02, 1.02)`;
      rafId = null;
    }

    card.addEventListener('pointerenter', () => {
      isHovering = true;
      bounds = card.getBoundingClientRect();
      card.style.transition = 'none';
      card.style.willChange = 'transform, box-shadow';
    });

    card.addEventListener('pointermove', e => {
      if (!isHovering) return;
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!rafId) {
        rafId = requestAnimationFrame(updateTransform);
      }
    });

    card.addEventListener('pointerleave', () => {
      isHovering = false;
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      card.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.5s ease';
      card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale3d(1, 1, 1)';
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init3DCardTilt);
} else {
  init3DCardTilt();
}

/* ------------------------------------------------- Mobile Menu & Anchor Click Routing */
menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', isOpen);
  menuToggle.innerHTML = `<i data-lucide="${isOpen ? 'x' : 'menu'}"></i>`;
  lucide.createIcons();
});

document.addEventListener('click', event => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

  const anchor = event.target.closest('a');
  if (!anchor) return;

  const href = anchor.getAttribute('href');
  if (!href) return;

  if (href.startsWith('mailto:') || href.startsWith('tel:') || anchor.hasAttribute('download') || anchor.target === '_blank') return;
  if (anchor.classList.contains('resume-link')) return;

  const rawKey = anchor.dataset.nav || (href.startsWith('#') ? href.slice(1) : href);
  const pageKey = resolvePageKey(rawKey);

  if (pageKey && PAGES[pageKey]) {
    event.preventDefault();
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.innerHTML = '<i data-lucide="menu"></i>';
    lucide.createIcons();

    scrollToPage(pageKey, true);
  }
});

window.addEventListener('popstate', event => {
  const pageKey = event.state?.page || resolvePageKey(window.location.pathname) || resolvePageKey(window.location.hash) || 'home';
  scrollToPage(pageKey, false);
});

/* ------------------------------------------------- Initial Section Resolution */
function getInitialPage() {
  if (window.location.hash) {
    const pageFromHash = resolvePageKey(window.location.hash);
    if (pageFromHash) return pageFromHash;
  }
  const pageFromPath = resolvePageKey(window.location.pathname);
  if (pageFromPath) return pageFromPath;
  return 'home';
}

const initialPage = getInitialPage();
setCurrentActiveSection(initialPage, false);

if (initialPage !== 'home') {
  setTimeout(() => {
    scrollToPage(initialPage, false);
  }, 120);
}

/* ------------------------------------------------- Contact Form Handling */
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', event => {
    event.preventDefault();
    const form = event.target;
    const message = form.querySelector('.form-message') || document.querySelector('.form-message');
    const submitButton = form.querySelector('button[type="submit"]');
    const payload = {
      name: form.elements[0].value.trim(),
      email: form.elements[1].value.trim(),
      message: form.elements[2].value.trim()
    };
    submitButton.disabled = true;
    form.classList.remove('is-sent');
    form.classList.add('is-sending');
    if (message) message.textContent = 'Sending...';
    fetch(`${apiBase}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(response => {
      if (!response.ok) throw new Error('Unable to send');
    }).then(() => {
      if (message) message.textContent = 'Successful! Your message has been sent.';
      form.classList.add('is-sent');
      form.reset();
    }).catch(() => {
      if (message) message.textContent = 'Unable to send your message. Please try again later.';
    }).finally(() => {
      form.classList.remove('is-sending');
      submitButton.disabled = false;
    });
  });
}
