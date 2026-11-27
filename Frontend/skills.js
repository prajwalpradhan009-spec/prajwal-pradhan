(() => {
  const graph = document.querySelector('[data-sk-graph]');
  if (!graph) return;

  window.syncSkills = () => graph.classList.add('is-ready');
  const observer = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) {
      window.syncSkills();
      observer.disconnect();
    }
  });
  observer.observe(graph);
})();

