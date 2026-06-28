/* Creative Discovery — Mini Player */

const CD = window.CD || {};
window.CD = CD;

CD.state = {
  playing: false,
  title: '',
  guest: '',
  ep: '',
  progress: 0,
  duration: 0,
  _raf: null,
};

CD.playEpisode = function ({ title, guest, ep }) {
  const player = document.querySelector('.mini-player');
  if (!player) return;

  player.removeAttribute('hidden');

  CD.state.title = title;
  CD.state.guest = guest;
  CD.state.ep = ep;
  CD.state.progress = 0;

  player.querySelector('.mp-title').textContent = ep + ' · ' + title;
  player.querySelector('.mp-guest').textContent = guest;

  const fill = player.querySelector('.mp-fill');
  fill.style.width = '0%';

  CD.state.playing = true;
  updatePlayIcon(player);
  startSimulatedProgress(player);
};

CD.togglePlay = function () {
  const player = document.querySelector('.mini-player');
  if (!player || player.hidden) return;

  CD.state.playing = !CD.state.playing;
  updatePlayIcon(player);

  if (CD.state.playing) {
    startSimulatedProgress(player);
  } else {
    cancelAnimationFrame(CD.state._raf);
  }
};

function updatePlayIcon(player) {
  const icon = player.querySelector('.mp-play i');
  if (!icon) return;
  icon.className = CD.state.playing ? 'ti ti-player-pause' : 'ti ti-player-play';
}

function startSimulatedProgress(player) {
  cancelAnimationFrame(CD.state._raf);
  const fill = player.querySelector('.mp-fill');
  const timeEl = player.querySelector('.mp-time');

  function tick() {
    if (!CD.state.playing) return;
    CD.state.progress += 0.015;
    if (CD.state.progress > 100) CD.state.progress = 0;
    fill.style.width = CD.state.progress + '%';

    const totalSec = Math.round((CD.state.progress / 100) * 2700);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    timeEl.textContent = m + ':' + String(s).padStart(2, '0') + ' / 45:00';

    CD.state._raf = requestAnimationFrame(tick);
  }
  CD.state._raf = requestAnimationFrame(tick);
}
