// ===== PROJECTS APP LOGIC =====
(async function() {
  const container = document.getElementById("dynamicProjects");
  if (!container) return;

  try {
    const res = await fetch("data.json");
    if (res.ok) {
      const data = await res.json();
      container.innerHTML = "";
      
      if (!data.projects || data.projects.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:var(--text-dim);">No projects yet.</p>';
        return;
      }

      data.projects.forEach(p => {
        const card = document.createElement("div");
        card.className = "project-card";
        card.innerHTML = `
          <img src="${p.img}" alt="${p.title}" />
          <h3>${p.title}</h3>
          <p>${p.desc}</p>
        `;
        card.addEventListener("click", () => {
          if (typeof window.openProject === 'function') {
            window.openProject(p.img, p.title, p.desc);
          }
        });
        container.appendChild(card);
      });
    }
  } catch (e) {
    console.log("Projects error", e);
    container.innerHTML = '<p style="text-align:center; color:var(--text-dim);">Error loading projects.</p>';
  }
})();
