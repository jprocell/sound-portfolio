// Works page: category filter. Rows open the project modal (see modal.js); Enter/Space also open a focused row.
document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll("#filter-bar button");
  const projects = document.querySelectorAll(".project-card");

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      filterButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      const category = button.dataset.category;
      projects.forEach(project => {
        const show = category === "all" || project.dataset.category.split(/\s+/).includes(category);
        project.style.display = show ? "" : "none";
      });
    });
  });

  projects.forEach(project => {
    project.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); project.click(); }
    });
  });
});
