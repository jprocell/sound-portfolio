document.addEventListener("DOMContentLoaded", () => {
  const projectCards = document.querySelectorAll(".project-card");
  const modal = document.getElementById("project-modal");
  const modalBody = modal.querySelector(".modal-body");
  const closeBtn = modal.querySelector(".modal-close");

  projectCards.forEach(card => {
    card.addEventListener("click", async () => {
      const projectKey = card.getAttribute("data-project");

      try {
        // Fetch project JSON
        const response = await fetch(`/json/${projectKey}.json`);
        if (!response.ok) throw new Error("Project JSON not found");

        const project = await response.json();

        // Support both "video" and "videos"
        const videos = project.videos || project.video || [];

        // Build modal content
        modalBody.innerHTML = `
        <h2>${project.title}</h2>
        <p>${project.description}</p>

        ${project.audio
            .map(
            sample => `
            <div class="modal-audio">
                <p class="label">${sample.label}</p>
                ${sample.desc ? `<p class="desc">${sample.desc}</p>` : ""}
                <audio
                controls
                controlslist="nodownload noplaybackrate"
                preload="none"
                data-src="${sample.src}">
                Your browser does not support the audio element.
                </audio>
            </div>
            `
            )
            .join("")}

        ${
            videos.length
            ? `
                <div class="modal-videos">
                ${videos
                    .map(
                    video => `
                        <div class="modal-video-box">
                        ${video.label ? `<p class="label">${video.label}</p>` : ""}
                        ${video.caption ? `<p class="desc">${video.caption}</p>` : ""}
                        <iframe
                            src="https://www.youtube.com/embed/${video.id}"
                            title="${video.caption || video.label || project.title}"
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen
                            loading="lazy">
                        </iframe>
                        </div>
                    `
                    )
                    .join("")}
                </div>
            `
            : ""
        }
        `;


        // Lazy-load audio sources AFTER DOM insertion
        const audioElements = modalBody.querySelectorAll("audio");
        audioElements.forEach(audio => {
          const src = audio.dataset.src;
          if (!src) return;

          const source = document.createElement("source");
          source.src = src;
          source.type = "audio/wav";
          audio.appendChild(source);
          audio.load();
        });

        // Show modal (animated)
        modal.classList.remove("hidden");
        setTimeout(() => modal.classList.add("show"), 20);

        // Disable background scroll
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
      document.body.style.overflow = "";
    }, 300); // must match CSS transition duration
  });
});
