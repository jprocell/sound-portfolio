// Only run on desktop
if (window.innerWidth > 768) {
  // Create or get waveform container
  const waveformContainer = document.getElementById("mini-waveform") || (() => {
    const div = document.createElement("div");
    div.id = "mini-waveform";
    document.body.appendChild(div);
    return div;
  })();

  const barsCount = 20;
  const bars = [];
  for (let i = 0; i < barsCount; i++) {
    const bar = document.createElement("div");
    bar.classList.add("wave-bar");
    waveformContainer.appendChild(bar);
    bars.push(bar);
  }

  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 64;
  const dataArray = new Uint8Array(analyser.frequencyBinCount);

  let currentSource = null;
  const connectedPlayers = new WeakSet();

  function attachPlayer(player) {
    // Only attach once per audio element
    if (connectedPlayers.has(player)) return;

    // Resume AudioContext if not running
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    try {
      const source = audioCtx.createMediaElementSource(player);
      source.connect(analyser);
      analyser.connect(audioCtx.destination);
      connectedPlayers.add(player);
    } catch (err) {
      console.warn("Waveform attach failed:", err);
    }
  }

const playingAudios = new Set();

// Instead of toggling display, toggle 'show' class
document.addEventListener(
  "play",
  (e) => {
    const player = e.target.closest("audio");
    if (!player) return;
    playingAudios.add(player);

    // Add 'show' class to fade in and slide up
    waveformContainer.classList.add("show");

    attachPlayer(player);
  },
  true
);

document.addEventListener(
  "pause",
  (e) => {
    const player = e.target.closest("audio");
    if (!player) return;
    playingAudios.delete(player);

    // Remove 'show' class if no audios playing
    if (playingAudios.size === 0) {
      waveformContainer.classList.remove("show");
    }
  },
  true
);

document.addEventListener(
  "ended",
  (e) => {
    const player = e.target.closest("audio");
    if (!player) return;
    playingAudios.delete(player);

    if (playingAudios.size === 0) {
      waveformContainer.classList.remove("show");
    }
  },
  true
);


  function animate() {
    requestAnimationFrame(animate);
    analyser.getByteFrequencyData(dataArray);

    bars.forEach((bar, i) => {
      const logIndex = Math.floor(Math.pow(i / barsCount, 2) * (dataArray.length - 1));
      const value = dataArray[logIndex] / 255;
      bar.style.height = `${Math.max(value, 0.05) * 100}%`;
    });
  }

  animate();
}
