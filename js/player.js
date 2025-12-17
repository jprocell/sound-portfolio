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