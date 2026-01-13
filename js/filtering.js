document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll("#filter-bar button");
  const projects = document.querySelectorAll(".project-card"); // changed from .project-item

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      filterButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      const category = button.dataset.category;

      projects.forEach(project => {
        if (category === "all" || project.dataset.category === category) {
          project.style.display = "block";  // show matching
        } else {
          project.style.display = "none";   // hide non-matching
        }
      });
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".bio-tab");
  const panels = document.querySelectorAll(".bio-panel");

  if (!tabs.length || !panels.length) return;

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      panels.forEach(p => p.classList.remove("active"));

      tab.classList.add("active");

      const panel = tab.dataset.panel;
      document
        .querySelector(`.bio-panel[data-panel="${panel}"]`)
        .classList.add("active");
    });
  });
});
