(() => {
  const phaseFilters = document.querySelectorAll('[data-phase]');
  const trackFilters = document.querySelectorAll('.track-filter');
  const courses = Array.from(document.querySelectorAll('.course'));
  let activePhases = new Set();
  let activeTrack = 'all';

  function applyFilters() {
    courses.forEach((course) => {
      const track = course.dataset.track;
      const passesTrack = activeTrack === 'all' || track === activeTrack;

      const passesPhase =
        activePhases.size === 0 ||
        Array.from(activePhases).every((phase) => {
          const key = 'score' + phase.charAt(0).toUpperCase() + phase.slice(1);
          const score = Number(course.dataset[key]) || 0;
          return score > 3;
        });

      const show = passesTrack && passesPhase;
      course.classList.toggle('dim', !show);
    });
  }

  phaseFilters.forEach((el) => {
    el.addEventListener('click', () => {
      const phase = el.dataset.phase;
      if (activePhases.has(phase)) {
        activePhases.delete(phase);
        el.classList.remove('active');
      } else {
        activePhases.add(phase);
        el.classList.add('active');
      }
      applyFilters();
    });
  });

  trackFilters.forEach((btn) => {
    btn.addEventListener('click', () => {
      trackFilters.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeTrack = btn.dataset.track || 'all';
      applyFilters();
    });
  });
})();
