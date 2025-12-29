// filtering.js

document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll("#filter-bar button");
  const projects = document.querySelectorAll(".project-item");

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove("active"));
      // Add active class to clicked button
      button.classList.add("active");

      const category = button.getAttribute("data-category");

      // Show/hide projects based on category
      projects.forEach(project => {
        if (category === "all" || project.getAttribute("data-category") === category) {
          project.style.display = "flex";  // show matching project
        } else {
          project.style.display = "none";  // hide non-matching
        }
      });
    });
  });
});
