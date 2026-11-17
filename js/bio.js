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


// My Gear: one panel per tab. Without JS every panel simply stays visible.
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".gear").forEach(gear => {
    const tabs = [...gear.querySelectorAll('[role="tab"]')];
    const select = tab => {
      tabs.forEach(t => {
        const on = t === tab;
        t.setAttribute("aria-selected", on);
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
      });
    };
    tabs.forEach((t, i) => {
      t.addEventListener("click", () => select(t));
      t.addEventListener("keydown", e => {
        const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (!d) return;
        const n = tabs[(i + d + tabs.length) % tabs.length];
        n.focus(); select(n); e.preventDefault();
      });
    });
    select(tabs.find(t => t.getAttribute("aria-selected") === "true") || tabs[0]);
  });
});
