// Bio page: the nav is fixed on wide screens and the Audio section is a dark slab.
// Each nav item switches to light colours the moment it crosses the slab, so a nav that straddles
// the slab edge never shows dark text on dark or light text on light.
document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".nav-bar");
  const slab = document.getElementById("audio");
  if (!nav || !slab) return;
  const items = [...nav.querySelectorAll("li")];

  const update = () => {
    const fixed = getComputedStyle(nav).position === "fixed";
    const s = slab.getBoundingClientRect();
    items.forEach(li => {
      const r = li.getBoundingClientRect();
      // use the item's vertical centre so the colour flips as its text crosses the edge
      const mid = (r.top + r.bottom) / 2;
      li.classList.toggle("on-dark", fixed && mid > s.top && mid < s.bottom);
    });
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
