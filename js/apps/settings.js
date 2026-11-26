// ===== SETTINGS APP LOGIC =====
(function() {
  const settingsScreen = document.getElementById("settings");
  if (!settingsScreen) return;

  const screenWrapEl = document.getElementById("screenWrap");
  const themeBtn = document.getElementById("settingsThemeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const shareBtn = document.getElementById("shareBtn");

  document.querySelectorAll(".wp-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const bg = btn.dataset.bg;
      if (bg === "gradient") {
        screenWrapEl.style.background = "";
        screenWrapEl.style.backgroundImage = "";
      } else {
        screenWrapEl.style.background = bg;
      }
      if (typeof playTone === 'function') { playTone(800, 0.05); }
      if (typeof buzz === 'function') { buzz(10); }
    });
  });

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      document.body.classList.toggle("light");
      const isLight = document.body.classList.contains("light");
      if (themeIcon) themeIcon.textContent = isLight ? "☀️" : "🌙";
      if (typeof playTone === 'function') { playTone(700, 0.05); }
      if (navigator.vibrate) navigator.vibrate(30);
    });
  }

  if (shareBtn) {
    shareBtn.addEventListener("click", async () => {
      const shareData = {
        title: "Gerald's Portfolio",
        text: "Check out my mobile-style portfolio!",
        url: window.location.href
      };
      try {
        if (navigator.share) {
          await navigator.share(shareData);
          if (typeof playTone === 'function') { playTone(1000, 0.08); }
        } else {
          await navigator.clipboard.writeText(window.location.href);
          alert("Link copied to clipboard! 🔗");
          if (typeof playTone === 'function') { playTone(800, 0.05); }
        }
      } catch (err) { console.log("Share failed:", err); }
    });
  }
})();
