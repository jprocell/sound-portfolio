const players = document.querySelectorAll("audio");

players.forEach(player => {
  player.addEventListener("play", () => {
    players.forEach(p => {
      if (p !== player) {
        p.pause();
      }
    });
  });
});

document.addEventListener("contextmenu", (e) => {
  if (e.target.closest("audio")) {
    e.preventDefault();
  }
});