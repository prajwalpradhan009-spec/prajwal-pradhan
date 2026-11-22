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
syncHeaderOffset();
window.addEventListener('resize', syncHeaderOffset, { passive: true });

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
function animateCounts() {
  document.querySelectorAll('.active-page [data-count], [data-count]').forEach(counter => {
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
    if (entry.target.classList.contains('stats')) animateCounts();
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12 });

function observeActiveReveals(container) {
  const target = container || document.querySelector('.active-page') || document;
  target.querySelectorAll('.reveal, .stats').forEach(el => {
    revealObserver.observe(el);
  });
}

/* ------------------------------------------------- Multi-Page Router */
const PAGES = {
  home: {
    id: 'page-home',
    path: '/',
    title: 'Prajwal Pradhan | Full-Stack Developer',
    aliases: ['home', 'home.html', 'index', 'index.html']
  },
  about: {
    id: 'page-about',
    path: '/about',
    title: 'About | Prajwal Pradhan',
    aliases: ['about', 'about.html']
  },
  learning: {
    id: 'page-learning',
    path: '/learning',
    title: 'Learning | Prajwal Pradhan',
    aliases: ['learning', 'learning.html', 'education', 'education.html', '/education']
  },
  skills: {
    id: 'page-skills',
    path: '/skills',
    title: 'Skills & Tech Stack | Prajwal Pradhan',
    aliases: ['skills', 'skills.html']
  },
  projects: {
    id: 'page-projects',
    path: '/projects',
    title: 'Featured Projects | Prajwal Pradhan',
    aliases: ['projects', 'projects.html']
  },
  github: {
    id: 'page-github',
    path: '/github',
    title: 'GitHub Activity | Prajwal Pradhan',
    aliases: ['github', 'github.html']
  },
  services: {
    id: 'page-services',
    path: '/services',
    title: 'Services & Capabilities | Prajwal Pradhan',
    aliases: ['services', 'services.html']
  },
  contact: {
    id: 'page-contact',
    path: '/contact',
    title: 'Contact | Prajwal Pradhan',
    aliases: ['contact', 'contact.html']
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
        const cleanAlias = alias.replace(/^\/+/, '').replace(/\/+$/, '');
        if (clean === cleanAlias) return key;
      }
    }
  }
  return null;
}

let currentPage = null;
let isTransitioning = false;

function updateActiveNav(pageKey) {
  const allNavLinks = document.querySelectorAll('.nav-links a[data-nav], .nav-links a:not(.resume-link)');
  allNavLinks.forEach(link => {
    const linkNav = link.dataset.nav || resolvePageKey(link.getAttribute('href'));
    const isActive = linkNav === pageKey;
    link.classList.toggle('active', isActive);
  });
}

function activatePageHooks(pageKey, targetView) {
  // Staggered reveals for newly active page
  const view = targetView || document.getElementById(PAGES[pageKey]?.id);
  if (view) {
    view.querySelectorAll('.reveal, .stats').forEach(el => {
      el.classList.remove('visible');
      revealObserver.observe(el);
    });
  }

  if (pageKey === 'about') {
    animateCounts();
  } else if (pageKey === 'skills') {
    if (typeof window.syncSkills === 'function') window.syncSkills();
  } else if (pageKey === 'github') {
    if (typeof window.loadGitHubDashboard === 'function') window.loadGitHubDashboard();
  }

  lucide.createIcons();
}

function navigateTo(pageKey, updateHistory = true) {
  const targetConf = PAGES[pageKey] || PAGES.home;
  const targetId = targetConf.id;
  const targetView = document.getElementById(targetId);
  if (!targetView) return;

  if (currentPage === pageKey) {
    window.scrollTo({ top: 0, behavior: reduceMotionQuery.matches ? 'auto' : 'smooth' });
    return;
  }

  if (isTransitioning) return;

  const currentView = currentPage ? document.getElementById(PAGES[currentPage]?.id) : null;
  currentPage = pageKey;
  document.title = targetConf.title;
  updateActiveNav(pageKey);

  if (updateHistory) {
    const isFile = window.location.protocol === 'file:';
    const targetUrl = isFile ? `#${pageKey}` : targetConf.path;
    try {
      history.pushState({ page: pageKey }, targetConf.title, targetUrl);
    } catch {
      window.location.hash = pageKey;
    }
  }

  if (!currentView || reduceMotionQuery.matches) {
    document.querySelectorAll('.page-view').forEach(v => {
      v.classList.remove('active-page', 'page-exit');
    });
    targetView.classList.add('active-page');
    window.scrollTo(0, 0);
    activatePageHooks(pageKey, targetView);
    return;
  }

  isTransitioning = true;
  currentView.classList.add('page-exit');

  setTimeout(() => {
    currentView.classList.remove('active-page', 'page-exit');
    targetView.classList.add('active-page');
    window.scrollTo({ top: 0, behavior: 'instant' });
    activatePageHooks(pageKey, targetView);
    setTimeout(() => {
      isTransitioning = false;
    }, 80);
  }, 220);
}

// Global page jump hook
window.navigateToPage = function(key) {
  const resolved = resolvePageKey(key);
  if (resolved) navigateTo(resolved);
};

// Mobile menu toggle
menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', isOpen);
  menuToggle.innerHTML = `<i data-lucide="${isOpen ? 'x' : 'menu'}"></i>`;
  lucide.createIcons();
});

// Click interceptor for navigation
document.addEventListener('click', event => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

  const anchor = event.target.closest('a');
  if (!anchor) return;

  const href = anchor.getAttribute('href');
  if (!href) return;

  if (href.startsWith('mailto:') || href.startsWith('tel:') || anchor.hasAttribute('download') || anchor.target === '_blank') return;
  if (anchor.classList.contains('resume-link') || href.includes('prajwal-pradhan')) return;

  const pageKey = anchor.dataset.nav || resolvePageKey(href);
  if (pageKey && PAGES[pageKey]) {
    event.preventDefault();
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.innerHTML = '<i data-lucide="menu"></i>';
    lucide.createIcons();

    navigateTo(pageKey);
  }
});

// Browser back and forward button navigation
window.addEventListener('popstate', event => {
  const pageKey = event.state?.page || resolvePageKey(window.location.pathname) || resolvePageKey(window.location.hash) || 'home';
  navigateTo(pageKey, false);
});

// Initial page resolution
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
currentPage = initialPage;
document.title = PAGES[initialPage].title;

document.querySelectorAll('.page-view').forEach(v => {
  v.classList.remove('active-page', 'page-exit');
});

const initialView = document.getElementById(PAGES[initialPage].id);
if (initialView) {
  initialView.classList.add('active-page');
} else {
  const fallbackHome = document.getElementById('page-home');
  if (fallbackHome) fallbackHome.classList.add('active-page');
}

updateActiveNav(initialPage);
activatePageHooks(initialPage, initialView);

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
