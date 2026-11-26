// ===== CONTACT APP LOGIC =====
(async function() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  // Kunin ang data sa data.json para sa email, phone, at location
  try {
    const res = await fetch("data.json");
    if (res.ok) {
      const data = await res.json();
      document.getElementById("dynEmail").textContent = data.contact.email;
      document.getElementById("dynPhone").textContent = data.contact.phone;
      document.getElementById("dynLocation").textContent = data.contact.location;
    }
  } catch (e) { console.log("Contact data error", e); }

  // Form submit
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formStatus = document.getElementById("formStatus");
    if (formStatus) {
      formStatus.style.display = "block";
      formStatus.textContent = "Sending message...";
      formStatus.style.color = "#fdcb6e";
    }
    
    setTimeout(() => {
      if (formStatus) {
        formStatus.textContent = "Message sent successfully! ✅";
        formStatus.style.color = "#00b894";
      }
      form.reset();
      if (typeof playTone === 'function') { playTone(1200, 0.1); buzz(20); }
      setTimeout(() => { if (formStatus) formStatus.style.display = "none"; }, 3000);
    }, 1500);
  });
})();
