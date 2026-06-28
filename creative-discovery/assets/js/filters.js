/* Creative Discovery — Topic Filters */

document.addEventListener('DOMContentLoaded', () => {
  const chips = document.querySelectorAll('.filter-chip');
  const cards = document.querySelectorAll('.episode-card[data-topic]');
  if (!chips.length || !cards.length) return;

  const params = new URLSearchParams(window.location.search);
  const initial = params.get('topic');
  if (initial) {
    applyFilter(initial);
    setActiveChip(initial);
  }

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const topic = chip.dataset.topic || 'all';
      applyFilter(topic);
      setActiveChip(topic);

      const url = new URL(window.location);
      if (topic === 'all') {
        url.searchParams.delete('topic');
      } else {
        url.searchParams.set('topic', topic);
      }
      window.history.replaceState({}, '', url);
    });
  });

  function applyFilter(topic) {
    cards.forEach((card) => {
      if (topic === 'all' || card.dataset.topic === topic) {
        card.style.display = '';
        card.classList.remove('hidden');
      } else {
        card.style.display = 'none';
        card.classList.add('hidden');
      }
    });
  }

  function setActiveChip(topic) {
    chips.forEach((c) => {
      c.classList.toggle('active', (c.dataset.topic || 'all') === topic);
    });
  }
});
