document.addEventListener("DOMContentLoaded", () => {
  const projectCards = document.querySelectorAll(".project-card");
  const modal = document.getElementById("project-modal");
  const modalBody = modal.querySelector(".modal-body");
  const closeBtn = modal.querySelector(".modal-close");

  // Shared hidden audio element
  const sharedAudio = document.createElement("audio");
  document.body.appendChild(sharedAudio);

  let activeRow = null;

  // GitHub Pages base URL for your repo
  const baseURL = "https://jprocell.github.io/sound-portfolio/";

  const formatTime = s => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  projectCards.forEach(card => {
    card.addEventListener("click", async () => {
      const projectKey = card.dataset.project;

      try {
        // Fetch JSON from GitHub Pages
        const res = await fetch(`${baseURL}json/${projectKey}.json`);
        if (!res.ok) throw new Error("Project JSON not found");
        const project = await res.json();

        const videos = project.videos || project.video || [];
        const soundcloud = project.soundcloud || [];

        // Build modal content with custom audio players
        modalBody.innerHTML = `
          <h2>${project.title}</h2>
          <p class="project-description">${project.description}</p>

          ${project.audio
            ?.map(
              sample => `
              <div class="modal-audio" data-src="${baseURL}${sample.src}">
                <p class="label">${sample.label}</p>
                ${sample.desc ? `<p class="desc">${sample.desc}</p>` : ""}
                <div class="player-controls">
                  <button class="play-btn">▶</button>
                  <div class="transport">
                    <div class="progress-bar">
                      <div class="progress-fill"></div>
                    </div>
                    <div class="time">
                      <span class="current">0:00</span> /
                      <span class="duration">0:00</span>
                    </div>
                  </div>
                </div>
              </div>
            `
            )
            .join("") || ""}

          ${
            videos.length
              ? `<div class="modal-videos">
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
                </div>`
              : ""
          }

          ${
            soundcloud.length
              ? `<div class="modal-soundcloud">
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
                        src="https://w.soundcloud.com/player/?url=${encodeURIComponent(
                          sc.url
                        )}&color=%234FC3F7&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&visual=true">
                      </iframe>
                    </div>
                  `
                    )
                    .join("")}
                </div>`
              : ""
          }
        `;

        // Initialize audio player functionality
        const audioRows = modalBody.querySelectorAll(".modal-audio");

        audioRows.forEach(row => {
          const src = row.dataset.src;
          const playBtn = row.querySelector(".play-btn");
          const fill = row.querySelector(".progress-fill");
          const cur = row.querySelector(".current");
          const dur = row.querySelector(".duration");
          const progressBar = row.querySelector(".progress-bar");

          // Preload audio to get duration immediately
          const tempAudio = new Audio(src);
          tempAudio.addEventListener("loadedmetadata", () => {
            dur.textContent = formatTime(tempAudio.duration);
          });

          playBtn.addEventListener("click", () => {
            if (activeRow === row) {
              // Toggle pause/play
              if (sharedAudio.paused) {
                sharedAudio.play();
                playBtn.textContent = "❚❚";
              } else {
                sharedAudio.pause();
                playBtn.textContent = "▶";
              }
            } else {
              // Switch to new audio
              sharedAudio.pause();
              sharedAudio.src = src;
              sharedAudio.currentTime = 0;
              sharedAudio.play();
              activeRow = row;

              // Reset all rows
              audioRows.forEach(r => {
                const p = r.querySelector(".play-btn");
                const f = r.querySelector(".progress-fill");
                const c = r.querySelector(".current");
                const d = r.querySelector(".duration");
                if (r === row) {
                  if (p) p.textContent = "❚❚";
                } else {
                  if (p) p.textContent = "▶";
                  if (f) f.style.width = "0%";
                  if (c) c.textContent = "0:00";
                  // Load duration for all rows immediately
                  const temp = new Audio(r.dataset.src);
                  temp.addEventListener("loadedmetadata", () => {
                    if (d) d.textContent = formatTime(temp.duration);
                  });
                }
              });
            }
          });

          // Scrub progress bar
          progressBar.addEventListener("click", e => {
            if (!sharedAudio.duration) return;
            const rect = progressBar.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            sharedAudio.currentTime = pct * sharedAudio.duration;
          });
        });

        // Shared audio events
        sharedAudio.ontimeupdate = () => {
          if (!activeRow) return;
          const f = activeRow.querySelector(".progress-fill");
          const c = activeRow.querySelector(".current");
          if (f) f.style.width = `${(sharedAudio.currentTime / sharedAudio.duration) * 100}%`;
          if (c) c.textContent = formatTime(sharedAudio.currentTime);
        };

        sharedAudio.onended = () => {
          if (!activeRow) return;
          const p = activeRow.querySelector(".play-btn");
          const f = activeRow.querySelector(".progress-fill");
          const c = activeRow.querySelector(".current");
          if (f) f.style.width = "0%";
          if (c) c.textContent = "0:00";
          if (p) p.textContent = "▶";
          activeRow = null;
        };

        // Show modal
        modal.classList.remove("hidden");
        setTimeout(() => modal.classList.add("show"), 20);
        document.body.style.overflow = "hidden";
      } catch (err) {
        console.error("Error loading project JSON:", err);
      }
    });
  });

  // Close modal
  closeBtn.addEventListener("click", () => {
    sharedAudio.pause();
    sharedAudio.currentTime = 0;
    activeRow = null;

    modal.classList.remove("show");
    setTimeout(() => {
      modal.classList.add("hidden");
      modalBody.innerHTML = "";
      document.body.style.overflow = "";
    }, 300);
  });
});
