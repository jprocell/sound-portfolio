// Reveals module when cursor hovers over
document.addEventListener("DOMContentLoaded", () => {
  const projects = document.querySelectorAll(".project-item");

  projects.forEach(project => {
    // Toggle active class on click (mobile)
    project.addEventListener("click", () => {
      project.classList.toggle("active");
    });
  });
});
