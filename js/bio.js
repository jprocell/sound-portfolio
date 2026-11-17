// Bio page: the nav is fixed on wide screens and the Audio section is a dark slab.
// While the nav overlaps the slab, swap it to light colours so it stays readable.
document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".nav-bar");
  const slab = document.getElementById("audio");
  if (!nav || !slab) return;

  const update = () => {
    if (getComputedStyle(nav).position !== "fixed") { nav.classList.remove("on-dark"); return; }
    const n = nav.getBoundingClientRect();
    const s = slab.getBoundingClientRect();
    const overlaps = n.bottom > s.top && n.top < s.bottom;
    nav.classList.toggle("on-dark", overlaps);
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
});
