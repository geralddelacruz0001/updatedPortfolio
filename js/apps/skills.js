// ===== SKILLS APP LOGIC =====
(async function() {
  const container = document.getElementById("dynamicSkills");
  if (!container) return;

  try {
    const res = await fetch("data.json");
    if (res.ok) {
      const data = await res.json();
      container.innerHTML = "";
      
      if (!data.skills || data.skills.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:var(--text-dim);">No skills yet.</p>';
        return;
      }

      data.skills.forEach(s => {
        const skillItem = document.createElement("div");
        skillItem.className = "skill-item";
        skillItem.innerHTML = `
          <div class="skill-header">
            <div class="skill-info">
              <i class="${s.icon || 'devicon-devicon-plain'} skill-icon"></i>
              <span>${s.name}</span>
            </div>
            <span class="skill-level">${s.level}%</span>
          </div>
          <div class="skill-bar-bg">
            <div class="skill-bar-fill" style="width: ${s.level}%;"></div>
          </div>
        `;
        container.appendChild(skillItem);
      });
    }
  } catch (e) {
    console.log("Skills error", e);
    container.innerHTML = '<p style="text-align:center; color:var(--text-dim);">Error loading skills.</p>';
  }
})();
