// Prevents right clicking and downloading audio files
document.addEventListener("DOMContentLoaded", () => {
  const audioPlayers = document.querySelectorAll(".audio-player");
  audioPlayers.forEach(player => {
    player.addEventListener("contextmenu", e => e.preventDefault());
  });
});

