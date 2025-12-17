const filterButtons = document.querySelectorAll("#filter-bar button");
const audioItems = document.querySelectorAll(".audio-item");

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    const category = button.dataset.category;

    // Update active button
    filterButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    // Show/hide items
    audioItems.forEach(item => {
      if (category === "all" || item.dataset.category === category) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  });
});