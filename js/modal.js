document.addEventListener("DOMContentLoaded", () => {
  const projectCards = document.querySelectorAll(".project-card");
  const modal = document.getElementById("project-modal");
  const modalBody = modal.querySelector(".modal-body");
  const closeBtn = modal.querySelector(".modal-close");

  let activeAudioRow = null;
  let activeAudio = null;

  // Wrap any phrase listed in the project's "highlight" JSON field (a string or an array of strings) so CSS can style it.
  const withHighlights = (text, highlight) => {
    let out = text;
    [].concat(highlight || []).forEach(phrase => {
      if (phrase && out.includes(phrase)) out = out.replace(phrase, `<strong class="hl">${phrase}</strong>`);
    });
    return out;
  };

  // Shrink the title just enough that its longest word fits on one line instead of breaking mid-word.
  const fitTitle = () => {
    const h2 = modalBody.querySelector("h2");
    if (!h2) return;
    h2.style.fontSize = "";
    let size = parseFloat(getComputedStyle(h2).fontSize);
    while (h2.scrollWidth > h2.clientWidth + 1 && size > 28) {
      size *= 0.94;
      h2.style.fontSize = `${size}px`;
    }
  };
  window.addEventListener("resize", () => { if (!modal.classList.contains("hidden")) fitTitle(); });

  const formatTime = s => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  projectCards.forEach(card => {
    card.addEventListener("click", async () => {
      const projectKey = card.dataset.project;

      try {
        const response = await fetch(`./json/${projectKey}.json`);
        if (!response.ok) throw new Error("Project JSON not found");
        const project = await response.json();

        const videos = project.videos || project.video || [];
        const soundcloud = project.soundcloud || [];

        // Build modal content
        // Small mono line above the title, taken from the row that was clicked
        const cell = sel => card.querySelector(sel)?.textContent.trim() || "";
        const meta = [cell(".p-num"), cell(".p-cat"), cell(".p-year")].filter(Boolean).join(" / ");

        modalBody.innerHTML = `
          <p class="modal-meta">${meta}</p>
          <h2>${project.title}</h2>
          <div class="modal-cols">
          <div class="modal-head">
            <p class="project-description">${withHighlights(project.description, project.highlight)}</p>
          </div>
          <div class="modal-samples">

          ${project.audio?.map(sample => {
            const audioSrc = `./${sample.src}`; 
            return `
              <div class="modal-audio" data-src="${audioSrc}">
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
                  <audio preload="metadata">
                    <source src="${audioSrc}">
                    Your browser does not support the audio element.
                  </audio>
                </div>
              </div>
            `;
          }).join("") || ""}

          ${videos.length ? `<div class="modal-videos">
            ${videos.map(video => `
              <div class="modal-video-box">
                ${video.label ? `<p class="label">${video.label}</p>` : ""}
                ${video.caption ? `<p class="desc">${video.caption}</p>` : ""}
                <iframe
                  src="https://www.youtube.com/embed/${video.id}"
                  title="${video.caption || video.label || project.title}"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                  loading="lazy"></iframe>
              </div>
            `).join("")}
          </div>` : ""}

          ${soundcloud.length ? `<div class="modal-soundcloud">
            ${soundcloud.map(sc => `
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
            `).join("")}
          </div>` : ""}

          ${(project.sections || []).map(sec => `
            <div class="modal-section">
              ${sec.label ? `<p class="label">${sec.label}</p>` : ""}
              ${sec.desc ? `<p class="desc">${sec.desc}</p>` : ""}
              ${sec.table ? `<table class="modal-table">
                <thead><tr>${sec.table.head.map(h => `<th>${h}</th>`).join("")}</tr></thead>
                <tbody>${sec.table.rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody>
              </table>` : ""}
              ${sec.images?.length ? `<div class="modal-images${sec.images.length > 1 ? " multi" : ""}">
                ${sec.images.map(img => `
                  <figure>
                    <img${img.narrow ? ' class="narrow"' : ""} src="${img.src}" alt="${img.alt || ""}" loading="lazy">
                    ${img.caption ? `<figcaption>${img.caption}</figcaption>` : ""}
                  </figure>
                `).join("")}
              </div>` : ""}
            </div>
          `).join("")}
          </div>
          </div>
        `;
        
          // Add this after the audio/video/soundcloud sections
          if (project.type === "text") {
            const textDiv = document.createElement("div");
            textDiv.className = "modal-text-box";
            textDiv.innerHTML = `
              ${project.content.body ? `<p class="label">${project.content.body}</p>` : ""}
              ${project.content.link ? `<a href="${project.content.link.url}" target="_blank" rel="noopener" class="modal-external-link">${project.content.link.label}</a>` : ""}
            `;
            (modalBody.querySelector(".modal-samples") || modalBody).appendChild(textDiv);
          }

        // Initialize audio players
        const audioRows = modalBody.querySelectorAll(".modal-audio");

        audioRows.forEach(row => {
          const playBtn = row.querySelector(".play-btn");
          const fill = row.querySelector(".progress-fill");
          const cur = row.querySelector(".current");
          const dur = row.querySelector(".duration");
          const progressBar = row.querySelector(".progress-bar");
          const audio = row.querySelector("audio");

          // Show total duration immediately
          audio.addEventListener("loadedmetadata", () => {
            dur.textContent = formatTime(audio.duration);
          });

          playBtn.addEventListener("click", () => {
            // Stop previous audio if exists
            if (activeAudioRow && activeAudioRow !== row) {
              activeAudio.pause();
              const prevBtn = activeAudioRow.querySelector(".play-btn");
              const prevFill = activeAudioRow.querySelector(".progress-fill");
              const prevCur = activeAudioRow.querySelector(".current");
              if (prevBtn) prevBtn.textContent = "▶";
              if (prevFill) prevFill.style.width = "0%";
              if (prevCur) prevCur.textContent = "0:00";
            }

            if (audio.paused) {
              audio.play();
              playBtn.textContent = "❚❚";
              activeAudio = audio;
              activeAudioRow = row;


            } else {
              audio.pause();
              playBtn.textContent = "▶";
            }
          });

          audio.addEventListener("timeupdate", () => {
            const pct = audio.currentTime / audio.duration || 0;
            fill.style.width = `${pct * 100}%`;
            cur.textContent = formatTime(audio.currentTime);
          });

          audio.addEventListener("ended", () => {
            playBtn.textContent = "▶";
            fill.style.width = "0%";
            cur.textContent = "0:00";
            activeAudio = null;
            activeAudioRow = null;
          });

          // Scrub
          progressBar.addEventListener("click", e => {
            const rect = progressBar.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            audio.currentTime = pct * audio.duration;
          });

          // Disable right-click
          audio.addEventListener("contextmenu", e => e.preventDefault());
        });

        // Show modal
        modal.classList.remove("hidden");
        fitTitle();
        document.fonts?.ready.then(fitTitle);
        setTimeout(() => modal.classList.add("show"), 20);
        document.body.style.overflow = "hidden";

      } catch (err) {
        console.error("Error loading project JSON:", err);
      }
    });
  });

  // Close modal
  closeBtn.addEventListener("click", () => {
    if (activeAudio) {
      activeAudio.pause();
      activeAudio.currentTime = 0;
    }
    activeAudio = null;
    activeAudioRow = null;

    modal.classList.remove("show");
    setTimeout(() => {
      modal.classList.add("hidden");
      modalBody.innerHTML = "";
      document.body.style.overflow = "";
    }, 300);
  });
});
