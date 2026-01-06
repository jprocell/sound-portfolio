// Only run on desktop
if (window.innerWidth > 768) {
  const waveformContainer = document.createElement("div");
  waveformContainer.id = "mini-waveform";
  document.body.appendChild(waveformContainer);

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

  let source = null;
  let currentPlayer = null;

  // Function to attach analyser to a new audio element
  function attachPlayer(player) {
    if (currentPlayer === player) return; // already attached
    if (source) source.disconnect();       // disconnect previous

    source = audioCtx.createMediaElementSource(player);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    currentPlayer = player;
  }

  // Listen for any play event on the document (captures dynamically added audio too)
  document.addEventListener("play", (e) => {
    const player = e.target.closest("audio");
    if (!player) return;
    attachPlayer(player);
  }, true); // capture phase to catch before other handlers

  function animate() {
    requestAnimationFrame(animate);
    analyser.getByteFrequencyData(dataArray);

    const minFreq = 0;
    const maxFreq = dataArray.length - 1;

    bars.forEach((bar, i) => {
      // Logarithmic mapping
      const logIndex = Math.floor(
        Math.pow(i / barsCount, 2) * (maxFreq - minFreq) + minFreq
      );
      const value = dataArray[logIndex] / 255; // normalize
      bar.style.height = `${Math.max(value, 0.05) * 100}%`; // min 5% height
    });
  }

  animate();
}
