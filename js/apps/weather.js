// ===== WEATHER APP LOGIC =====
(function() {
  function getWeatherIcon(code) {
    if (code === 0) return "☀️";
    if (code >= 1 && code <= 3) return "⛅";
    if (code >= 45 && code <= 48) return "🌫️";
    if (code >= 51 && code <= 67) return "🌧️";
    if (code >= 71 && code <= 77) return "❄️";
    if (code >= 80 && code <= 82) return "🌦️";
    if (code >= 95) return "⛈️";
    return "⛅";
  }

  async function fetchWeather() {
    try {
      const lat = 14.5995;
      const lon = 120.9842;
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=Asia%2FManila`);
      const data = await res.json();
      
      const temp = Math.round(data.current_weather.temperature);
      const code = data.current_weather.weathercode;
      const icon = getWeatherIcon(code);
      
      // I-update ang Home Widget
      const wTemp = document.getElementById("wTemp");
      const wIcon = document.getElementById("wIcon");
      const wDesc = document.getElementById("wDesc");
      if (wTemp) wTemp.textContent = `${temp}°C`;
      if (wIcon) wIcon.textContent = icon;
      if (wDesc) wDesc.textContent = code === 0 ? "Clear" : "Partly Cloudy";

      // I-update ang Weather Modal
      const wmTemp = document.getElementById("wmTemp");
      const wmIcon = document.getElementById("wmIcon");
      const wmDesc = document.getElementById("wmDesc");
      if (wmTemp) wmTemp.textContent = `${temp}°C`;
      if (wmIcon) wmIcon.textContent = icon;
      if (wmDesc) wmDesc.textContent = code === 0 ? "Clear Sky" : "Cloudy";

      // I-generate ang 7-day forecast
      const forecastContainer = document.getElementById("weatherForecast");
      if (data.daily && forecastContainer) {
        forecastContainer.innerHTML = ""; 
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        
        for (let i = 0; i < data.daily.time.length; i++) {
          const date = new Date(data.daily.time[i]);
          const dayName = days[date.getDay()];
          const maxTemp = Math.round(data.daily.temperature_2m_max[i]);
          const minTemp = Math.round(data.daily.temperature_2m_min[i]);
          const dayCode = data.daily.weathercode[i];
          const dayIcon = getWeatherIcon(dayCode);

          const row = document.createElement("div");
          row.className = "wm-day";
          row.innerHTML = `
            <span class="wm-day-name">${dayName}</span>
            <span class="wm-day-icon">${dayIcon}</span>
            <span class="wm-day-temp">${minTemp}° / ${maxTemp}°</span>
          `;
          forecastContainer.appendChild(row);
        }
      }
    } catch (error) {
      console.log("Weather Error", error);
      const wDesc = document.getElementById("wDesc");
      if(wDesc) wDesc.textContent = "Offline";
    }
  }
  
  fetchWeather();
  setInterval(fetchWeather, 1800000);

  // I-attach ang close button
  const closeWeatherModal = document.getElementById("closeWeatherModal");
  if (closeWeatherModal) {
    closeWeatherModal.addEventListener("click", () => {
      const modal = document.getElementById("weatherModal");
      if (modal) modal.classList.remove("show");
      if (typeof playTone === 'function') { playTone(500, 0.05); }
    });
  }
})();
