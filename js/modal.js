document.addEventListener("DOMContentLoaded", () => {
  const projectCards = document.querySelectorAll(".project-card");
  const modal = document.getElementById("project-modal");
  const modalBody = modal.querySelector(".modal-body");
  const closeBtn = modal.querySelector(".modal-close");

  const projectData = {
    foley: {
      title: "Foley Project",
      description: "Simulating nature soundscapes with crickets, frogs, and bottle rockets.",
      audio: [
        { label: "Summer Evening", src: "audio-samples/sound-design/foley/summer-evening.wav" },
        { label: "Thunderstorm", src: "audio-samples/sound-design/foley/thunderstorm.wav" }
      ]
    },
    sampling: {
      title: "Sampling Project",
      description: "Synthesis II class assignment using a cow sample to create multiple instruments.",
      audio: [
        { label: "Mix", src: "audio-samples/synthesis/sampling/depeche-beat-mix.wav" },
        { label: "Bass", src: "audio-samples/synthesis/sampling/depeche-beat-bass.wav" }
      ]
    },
    collision: {
      title: "Collision Project",
      description: "Early sound design assignment with Ableton's Collision instrument.",
      audio: [
        { label: "Bass", src: "audio-samples/sound-design/collision/bass.wav" },
        { label: "Lead", src: "audio-samples/sound-design/collision/lead.wav" }
      ]
    }
  };

  projectCards.forEach(card => {
    card.addEventListener("click", () => {
      const projectKey = card.getAttribute("data-project");
      const project = projectData[projectKey];

      modalBody.innerHTML = `
        <h2>${project.title}</h2>
        <p>${project.description}</p>
        ${project.audio
          .map(
            sample => `
          <div class="modal-audio">
            <p>${sample.label}</p>
            <audio controls controlslist="nodownload noplaybackrate" preload="metadata">
              <source src="${sample.src}" type="audio/wav">
            </audio>
          </div>
        `
          )
          .join("")}
      `;

      modal.classList.remove("hidden");

      // Disable body scroll
      document.body.style.overflow = "hidden";
    });
  });

  // Close modal
  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
    modalBody.innerHTML = "";

    // Restore body scroll
    document.body.style.overflow = "";
  });
});
