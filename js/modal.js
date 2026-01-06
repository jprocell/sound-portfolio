document.addEventListener("DOMContentLoaded", () => {
  const projectCards = document.querySelectorAll(".project-card");
  const modal = document.getElementById("project-modal");
  const modalBody = modal.querySelector(".modal-body");
  const closeBtn = modal.querySelector(".modal-close");

  projectCards.forEach(card => {
    card.addEventListener("click", async () => {
      const projectKey = card.getAttribute("data-project");

      try {
        // Fetch the JSON for the clicked project
        const response = await fetch(`../json/${projectKey}.json`);
        if (!response.ok) throw new Error("Project JSON not found");

        const project = await response.json();

        // Build modal content with placeholder audio elements
        modalBody.innerHTML = `
          <h2>${project.title}</h2>
          <p>${project.description}</p>
          ${project.audio
            .map(
              (sample, index) => `
            <div class="modal-audio">
              <p class="label">${sample.label}</p>
              ${sample.desc ? `<p class="desc">${sample.desc}</p>` : ""}
              <audio controls controlslist="nodownload noplaybackrate" preload="none" data-src="${sample.src}">
                Your browser does not support the audio element.
              </audio>
            </div>
          `
            )
            .join("")}
        `;

        // Lazy-load audio sources after inserting HTML
        const audioElements = modalBody.querySelectorAll("audio");
        audioElements.forEach(audio => {
          const src = audio.dataset.src;
          const sourceEl = document.createElement("source");
          sourceEl.src = src;
          sourceEl.type = "audio/wav";
          audio.appendChild(sourceEl);
          audio.load(); // load the audio only now
        });

        // Show modal with animation
        modal.classList.remove("hidden");
        setTimeout(() => modal.classList.add("show"), 20);

        // Disable page scroll
        document.body.style.overflow = "hidden";

      } catch (err) {
        console.error("Error loading project JSON:", err);
      }
    });
  });

  // Close modal
  closeBtn.addEventListener("click", () => {
    modal.classList.remove("show");

    setTimeout(() => {
      modal.classList.add("hidden");
      modalBody.innerHTML = "";
      document.body.style.overflow = ""; // restore scroll
    }, 300);
  });
});
