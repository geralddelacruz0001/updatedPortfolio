// ===== NOTES APP LOGIC =====
(function() {
  const noteArea = document.getElementById("noteArea");
  if (!noteArea) return;

  const saveNoteBtn = document.getElementById("saveNoteBtn");
  const noteStatus = document.getElementById("noteStatus");

  // Load saved note
  const savedNote = localStorage.getItem("myPortfolioNote");
  if (savedNote) noteArea.value = savedNote;

  if (saveNoteBtn) {
    saveNoteBtn.addEventListener("click", () => {
      localStorage.setItem("myPortfolioNote", noteArea.value);
      if(noteStatus) {
        noteStatus.classList.add("show");
        setTimeout(() => noteStatus.classList.remove("show"), 2000);
      }
      if (typeof playTone === 'function') { playTone(1000, 0.08); buzz(15); }
    });
  }
})();
