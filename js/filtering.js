// Works page: category filter + cover preview that follows the cursor on row hover.
document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll("#filter-bar button");
  const projects = document.querySelectorAll(".project-card");
  const preview = document.getElementById("cover-preview");

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      filterButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      const category = button.dataset.category;
      projects.forEach(project => {
        const show = category === "all" || project.dataset.category === category;
        project.style.display = show ? "" : "none";
      });
    });
  });

  if (!preview) return;

  projects.forEach(project => {
    project.addEventListener("mouseenter", () => {
      preview.src = project.dataset.img;
      preview.hidden = false;
    });
    project.addEventListener("mousemove", e => {
      const w = preview.offsetWidth;
      const h = preview.offsetHeight;
      const x = Math.min(e.clientX + 24, window.innerWidth - w - 16);
      const y = Math.min(Math.max(e.clientY - h / 2, 16), window.innerHeight - h - 16);
      preview.style.left = `${x}px`;
      preview.style.top = `${y}px`;
    });
    project.addEventListener("mouseleave", () => { preview.hidden = true; });
    // Keyboard: Enter/Space opens the project like a click
    project.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); project.click(); }
    });
  });
});
