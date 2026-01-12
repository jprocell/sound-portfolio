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
        const response = await fetch(`json/${projectKey}.json`);
        if (!response.ok) throw new Error("Project JSON not found");

        const project = await response.json();

        // Support both "video" and "videos", and SoundCloud integration
        const videos = project.videos || project.video || [];
        const soundcloud = project.soundcloud || [];

        // Build modal content
        modalBody.innerHTML = `
          <h2>${project.title}</h2>
          <p class="project-description">${project.description}</p>

          ${project.audio
            ?.map(
              sample => `
              <div class="modal-audio">
                <p class="label">${sample.label}</p>
                ${sample.desc ? `<p class="desc">${sample.desc}</p>` : ""}
                <audio
                  controls
                  controlslist="nodownload noplaybackrate"
                  preload="metadata">
                  <source src="${sample.src}" type="audio/wav">
                  Your browser does not support the audio element.
                </audio>
              </div>
            `
            )
            .join("") || ""}

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

          ${
            soundcloud.length
              ? ` 
            <div class="modal-soundcloud">
              ${soundcloud
                .map(
                  sc => `
                <div class="modal-soundcloud-box">
                  ${sc.label ? `<p class="label">${sc.label}</p>` : ""}
                  ${sc.caption ? `<p class="desc">${sc.caption}</p>` : ""}
                  <iframe
                    width="100%"
                    height="300"
                    scrolling="no"
                    frameborder="no"
                    allow="autoplay"
                    src="https://w.soundcloud.com/player/?url=${encodeURIComponent(sc.url)}&color=%234FC3F7&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&visual=true">
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

        // Get all audio elements inside modal
        const audioElements = modalBody.querySelectorAll("audio");

        // Only allow one audio to play at a time
        audioElements.forEach(audio => {
          audio.addEventListener("play", () => {
            audioElements.forEach(a => {
              if (a !== audio) a.pause();
            });
          });

          // Disable right-click on audio
          audio.addEventListener("contextmenu", e => e.preventDefault());
        });

        // Show modal with animation
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
