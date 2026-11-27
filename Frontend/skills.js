(() => {
  const section = document.querySelector('[data-sk-section]');
  if (!section || !('IntersectionObserver' in window)) return;

  const heading = section.querySelector('.sk-heading');
  const marquees = section.querySelector('.sk-marquees');
  const playback = section.querySelector('.sk-playback');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let visible = false;
  let paused = false;

  // One trailing gap per group makes half the track exactly one repeat.
  for (const group of marquees.querySelectorAll('.sk-group')) {
    const copy = group.cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');
    copy.removeAttribute('aria-label');
    copy.querySelectorAll('[tabindex]').forEach(card => card.removeAttribute('tabindex'));
    group.after(copy);
  }

  function syncPlayback() {
    section.toggleAttribute('data-running', visible && !document.hidden && !paused && !reducedMotion.matches);
    section.toggleAttribute('data-paused', paused);
    playback.hidden = reducedMotion.matches;
    playback.querySelector('span').textContent = paused ? 'Play motion' : 'Pause motion';
  }

  // A keyboard user can tab to any original card, including one past the mask.
  // Seek only if clipped, then let the same CSS animation resume on blur.
  marquees.addEventListener('focusin', event => {
    if (reducedMotion.matches || !event.target.matches('.sk-tech')) return;
    const card = event.target;
    const group = card.parentElement;
    const row = card.closest('.sk-row');
    const bounds = row.getBoundingClientRect();
    const cardBounds = card.getBoundingClientRect();
    const inset = 8;
    if (cardBounds.left >= bounds.left + inset && cardBounds.right <= bounds.right - inset) return;

    const animation = group.parentElement.getAnimations().find(item => item.animationName === 'sk-marquee');
    if (!animation) return;
    const width = group.getBoundingClientRect().width;
    const center = card.offsetLeft + card.offsetWidth / 2 - row.clientWidth / 2;
    const offset = Math.min(Math.max(center, 0.01), width - 0.01) / width;
    const progress = row.hasAttribute('data-reverse') ? 1 - offset : offset;
    animation.currentTime = progress * animation.effect.getTiming().duration;
  });

  playback.addEventListener('click', () => {
    paused = !paused;
    syncPlayback();
  });

  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.target === marquees) visible = entry.isIntersecting;
      if (entry.target === heading && entry.isIntersecting) {
        heading.classList.add('is-visible');
        observer.unobserve(heading);
      }
    }
    syncPlayback();
  });
  observer.observe(heading);
  observer.observe(marquees);
  document.addEventListener('visibilitychange', syncPlayback);
  reducedMotion.addEventListener('change', syncPlayback);
  window.syncSkills = syncPlayback;
  section.setAttribute('data-ready', '');
  syncPlayback();
})();

