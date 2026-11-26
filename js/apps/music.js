// ===== MUSIC APP LOGIC =====
(function() {
  // I-check kung nasa Music App screen na tayo
  const musicScreen = document.getElementById("music");
  if (!musicScreen || musicScreen.innerHTML.trim() === "") return;

  const bgMusic = document.getElementById("bgMusic");
  if (!bgMusic) return;

  // App Controls
  const appPlayPause = document.getElementById("appPlayPauseBtn");
  const prevTrack = document.getElementById("prevTrack");
  const nextTrack = document.getElementById("nextTrack");
  const progressFill = document.getElementById("progressFill");
  const progressBar = document.getElementById("progressBar");
  const currentTimeEl = document.getElementById("currentTime");
  const totalTimeEl = document.getElementById("totalTime");
  const musicTitle = document.getElementById("musicTitle");
  const musicArtist = document.getElementById("musicArtist");
  const playlistEl = document.getElementById("playlist");

  // Mini Widget Control
  const miniPlayBtn = document.getElementById("miniPlayBtn");

  // Playlist Data
  const playlist = [
    { title: "Empire State of Mind", artist: "Jay-Z ft. Alicia Keys", src: "assets/empire.mp3" },
    { title: "Hall of Fame", artist: "The Script", src: "assets/champion.mp3" }
  ];

  let currentTrackIndex = 0;
  let isPlaying = false;

  function updateAllPlayButtons(text) {
    if (appPlayPause) appPlayPause.textContent = text;
    if (miniPlayBtn) miniPlayBtn.textContent = text;
  }

  function loadTrack(index) {
    const track = playlist[index];
    bgMusic.src = track.src;
    if (musicTitle) musicTitle.textContent = track.title;
    if (musicArtist) musicArtist.textContent = track.artist;
    
    if (playlistEl) {
      document.querySelectorAll("#playlist li").forEach((li, i) => {
        if (i === index) li.classList.add("active");
        else li.classList.remove("active");
      });
    }

    if (progressFill) progressFill.style.width = "0%";
    if (currentTimeEl) currentTimeEl.textContent = "0:00";
  }

  function togglePlay() {
    if (bgMusic.paused) {
      bgMusic.play().catch(e => console.log("Audio play error:", e));
      isPlaying = true;
      updateAllPlayButtons("⏸");
      if (typeof playTone === 'function') { playTone(800, 0.05); buzz(10); }
    } else {
      bgMusic.pause();
      isPlaying = false;
      updateAllPlayButtons("▶");
      if (typeof playTone === 'function') { playTone(600, 0.05); buzz(10); }
    }
  }

  function next() {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(currentTrackIndex);
    isPlaying = true;
    bgMusic.play();
    updateAllPlayButtons("⏸");
    if (typeof playTone === 'function') { playTone(900, 0.05); buzz(10); }
  }

  function prev() {
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrackIndex);
    isPlaying = true;
    bgMusic.play();
    updateAllPlayButtons("⏸");
    if (typeof playTone === 'function') { playTone(900, 0.05); buzz(10); }
  }

  function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  }

  if (appPlayPause) appPlayPause.addEventListener("click", togglePlay);
  if (nextTrack) nextTrack.addEventListener("click", next);
  if (prevTrack) prevTrack.addEventListener("click", prev);

  if (miniPlayBtn) {
    miniPlayBtn.addEventListener("click", (e) => {
      e.stopPropagation(); 
      togglePlay();
    });
  }

  bgMusic.addEventListener("loadedmetadata", () => {
    if (totalTimeEl) totalTimeEl.textContent = formatTime(bgMusic.duration);
  });

  bgMusic.addEventListener("timeupdate", () => {
    if (bgMusic.duration) {
      const progress = (bgMusic.currentTime / bgMusic.duration) * 100;
      if (progressFill) progressFill.style.width = progress + "%";
      if (currentTimeEl) currentTimeEl.textContent = formatTime(bgMusic.currentTime);
    }
  });

  bgMusic.addEventListener("ended", next);

  if (progressBar) {
    progressBar.addEventListener("click", (e) => {
      const width = progressBar.clientWidth;
      const clickX = e.offsetX;
      const duration = bgMusic.duration;
      bgMusic.currentTime = (clickX / width) * duration;
    });
  }

  if (playlistEl) {
    playlistEl.innerHTML = "";
    playlist.forEach((track, i) => {
      const li = document.createElement("li");
      li.innerHTML = `<span>${track.title}</span><span>${track.artist}</span>`;
      li.addEventListener("click", () => {
        currentTrackIndex = i;
        loadTrack(i);
        isPlaying = true;
        bgMusic.play();
        updateAllPlayButtons("⏸");
      });
      playlistEl.appendChild(li);
    });
  }

  // Load first track
  loadTrack(0);
})();
