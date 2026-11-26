// ===== GALLERY APP LOGIC =====
(async function() {
  const container = document.getElementById("dynamicGallery");
  if (!container) return;

  try {
    const res = await fetch("data.json");
    if (res.ok) {
      const data = await res.json();
      container.innerHTML = "";

      if (!data.gallery || data.gallery.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:var(--text-dim);">No images yet.</p>';
        return;
      }

      data.gallery.forEach(imgSrc => {
        const img = document.createElement("img");
        img.src = imgSrc;
        img.alt = "Gallery Image";
        img.addEventListener("click", () => {
          if (typeof window.openLightbox === 'function') {
            window.openLightbox(imgSrc);
          }
        });
        container.appendChild(img);
      });
    }
  } catch (e) {
    console.log("Gallery error", e);
    container.innerHTML = '<p style="text-align:center; color:var(--text-dim);">Error loading gallery.</p>';
  }
})();
