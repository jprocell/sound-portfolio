// Home page: live Austin clock + show the art credit only once the image has loaded.
document.addEventListener("DOMContentLoaded", () => {
  const clock = document.getElementById("clock");
  if (clock) {
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Chicago",
      hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
    });
    const tick = () => { clock.textContent = `austin, tx ${fmt.format(new Date())}`; };
    tick();
    setInterval(tick, 1000);
  }

  const img = document.querySelector(".plate img");
  const credit = document.getElementById("art-credit");
  if (img && credit) {
    const reveal = () => credit.classList.add("show");
    if (img.complete && img.naturalWidth) reveal();
    else img.addEventListener("load", reveal);
    img.addEventListener("error", () => { img.remove(); });
  }
});
