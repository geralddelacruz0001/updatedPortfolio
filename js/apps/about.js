// ===== ABOUT APP LOGIC =====
(async function() {
  const dynName = document.getElementById("dynName");
  if (!dynName) return;
  
  try {
    const res = await fetch("data.json");
    if (res.ok) {
      const data = await res.json();
      
      // I-update ang Profile Info
      document.getElementById("dynName").textContent = data.profile.name;
      document.getElementById("dynRole").textContent = data.profile.role;
      document.getElementById("dynAbout").textContent = data.profile.about;

      // I-generate ang Experience (kung meron)
      const expContainer = document.getElementById("dynExperience");
      if (expContainer) {
        if (data.experience && data.experience.length > 0) {
          expContainer.innerHTML = "";
          data.experience.forEach(exp => {
            const div = document.createElement("div");
            div.className = "exp-item";
            div.innerHTML = `
              <div class="exp-title">${exp.title}</div>
              <div class="exp-company">${exp.company}</div>
              <div class="exp-date">${exp.date}</div>
              <div class="exp-desc">${exp.desc}</div>
            `;
            expContainer.appendChild(div);
          });
        } else {
          expContainer.innerHTML = '<p style="font-size:12px; color:var(--text-dim);">No experience yet.</p>';
        }
      }
    }
  } catch (e) { console.log("About data error", e); }
})();
