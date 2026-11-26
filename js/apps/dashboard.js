// ===== DASHBOARD APP LOGIC (Live Data) =====
(async function() {
  const container = document.querySelector(".dash-container");
  if (!container) return;

  // 1. Kunin ang Data sa data.json
  let portfolioData = null;
  try {
    const res = await fetch("data.json");
    if (res.ok) portfolioData = await res.json();
  } catch (e) { console.log("Dashboard error loading data.json", e); }

  // 2. Kunin ang Game Wins sa localStorage
  let gameHistory = JSON.parse(localStorage.getItem("tttHistory")) || [];
  let gameWins = gameHistory.filter(h => h.result === "win").length;

  // 3. Kunin ang Notes length sa localStorage
  let savedNote = localStorage.getItem("myPortfolioNote") || "";
  let noteChars = savedNote.length;

  // ===== I-UPDATE ANG METRIC CARDS =====
  if (portfolioData) {
    const projectCount = portfolioData.projects ? portfolioData.projects.length : 0;
    const skillCount = portfolioData.skills ? portfolioData.skills.length : 0;

    const elProject = document.getElementById("dashProjectCount");
    const elSkill = document.getElementById("dashSkillCount");
    if (elProject) elProject.textContent = projectCount;
    if (elSkill) elSkill.textContent = skillCount;
  }

  const elGame = document.getElementById("dashGameWins");
  const elNote = document.getElementById("dashNoteChars");
  if (elGame) elGame.textContent = gameWins;
  if (elNote) elNote.textContent = noteChars;

  // ===== I-UPDATE ANG AVERAGE SKILL (Chart Tooltip) =====
  if (portfolioData && portfolioData.skills && portfolioData.skills.length > 0) {
    let totalLevel = portfolioData.skills.reduce((sum, s) => sum + s.level, 0);
    let avgLevel = Math.round(totalLevel / portfolioData.skills.length);
    
    const elAvg = document.getElementById("dashAvgSkill");
    if (elAvg) elAvg.textContent = `${avgLevel}%`;

    // Readiness badge
    let readiness = "Good";
    if (avgLevel >= 85) readiness = "Excellent";
    else if (avgLevel < 70) readiness = "Needs Work";
    const elReadiness = document.getElementById("dashReadiness");
    if (elReadiness) elReadiness.textContent = readiness;
  }

  // ===== I-UPDATE ANG TOP SKILLS (System Resources) =====
  const skillsContainer = document.getElementById("dashTopSkills");
  if (skillsContainer && portfolioData && portfolioData.skills) {
    skillsContainer.innerHTML = "";
    
    // Kunin lang ang Top 3 skills
    const topSkills = portfolioData.skills.slice(0, 3);
    
    topSkills.forEach(skill => {
      const row = document.createElement("div");
      row.className = "dash-skill-row";
      row.innerHTML = `
        <div class="dash-skill-header">
          <span>${skill.name}</span>
          <span>${skill.level}%</span>
        </div>
        <div class="dash-skill-bar-bg">
          <div class="dash-skill-bar-fill" style="width: 0%;" data-width="${skill.level}%"></div>
        </div>
      `;
      skillsContainer.appendChild(row);
    });

    // I-animate ang bars pagkatapos ng 100ms
    setTimeout(() => {
      document.querySelectorAll(".dash-skill-bar-fill").forEach(bar => {
        bar.style.width = bar.dataset.width;
      });
    }, 100);
  }

  // ===== I-UPDATE ANG RECENT PROJECTS (Recent Alerts & Activity) =====
  const projectsContainer = document.getElementById("dashRecentProjects");
  if (projectsContainer && portfolioData && portfolioData.projects) {
    projectsContainer.innerHTML = `
      <div class="dash-tr dash-th">
        <span>PROJECT</span><span>DETAILS</span>
      </div>
    `;
    
    // Kunin lang ang pinakabagong 2 projects
    const recentProjects = portfolioData.projects.slice(0, 2);
    
    recentProjects.forEach(p => {
      const row = document.createElement("div");
      row.className = "dash-tr";
      row.innerHTML = `
        <img src="${p.img}" alt="${p.title}" class="dash-project-img" onerror="this.src='icons/icon-192.png'" />
        <div class="dash-project-info">
          <span class="dash-project-title">${p.title}</span>
          <span class="dash-project-desc">${p.desc}</span>
        </div>
      `;
      projectsContainer.appendChild(row);
    });
  }
})();
