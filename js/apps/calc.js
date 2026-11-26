// Calculator App Logic (Kinakarga ito ng index.html kapag binuksan ang Calculator)
document.addEventListener("DOMContentLoaded", () => {
  const calcDisplay = document.getElementById("calcDisplay");
  if (!calcDisplay) return; // Kung wala ang calculator sa screen, wag ituloy

  let calcCurrent = "0", calcPrevious = null, calcOperator = null, calcShouldReset = false;

  document.querySelectorAll(".calc-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const val = btn.dataset.val;
      if (typeof playTone === 'function') { playTone(600, 0.04); buzz(8); }

      if (val === "C") { calcCurrent = "0"; calcPrevious = null; calcOperator = null; calcShouldReset = false; } 
      else if (val === "DEL") { calcCurrent = calcCurrent.toString().slice(0, -1) || "0"; }
      else if (val === "%") { calcCurrent = (parseFloat(calcCurrent) / 100).toString(); }
      else if (["+", "-", "*", "/"].includes(val)) {
        calcPrevious = parseFloat(calcCurrent); calcOperator = val; calcShouldReset = true;
      }
      else if (val === "=") {
        if (calcOperator && calcPrevious !== null) {
          let result = 0;
          const curr = parseFloat(calcCurrent);
          if (calcOperator === "+") result = calcPrevious + curr;
          if (calcOperator === "-") result = calcPrevious - curr;
          if (calcOperator === "*") result = calcPrevious * curr;
          if (calcOperator === "/") result = calcPrevious / curr;
          calcCurrent = result.toString(); calcOperator = null; calcPrevious = null; calcShouldReset = true;
        }
      }
      else {
        if (calcShouldReset) { calcCurrent = val; calcShouldReset = false; } 
        else { if (calcCurrent === "0" && val !== ".") calcCurrent = val; else calcCurrent += val; }
      }
      calcDisplay.textContent = calcCurrent;
    });
  });
});
// ===== CALCULATOR APP LOGIC =====
// Kinakarga ito ng index.html kapag binuksan ang Calculator
(function() {
  const calcDisplay = document.getElementById("calcDisplay");
  if (!calcDisplay) return; // Kung wala ang calculator, wag ituloy

  let calcCurrent = "0";
  let calcPrevious = null;
  let calcOperator = null;
  let calcShouldReset = false;

  document.querySelectorAll(".calc-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const val = btn.dataset.val;
      if (typeof playTone === 'function') { playTone(600, 0.04); buzz(8); }

      if (val === "C") {
        calcCurrent = "0";
        calcPrevious = null;
        calcOperator = null;
        calcShouldReset = false;
      } 
      else if (val === "DEL") {
        calcCurrent = calcCurrent.toString().slice(0, -1) || "0";
      }
      else if (val === "%") {
        calcCurrent = (parseFloat(calcCurrent) / 100).toString();
      }
      else if (["+", "-", "*", "/"].includes(val)) {
        calcPrevious = parseFloat(calcCurrent);
        calcOperator = val;
        calcShouldReset = true;
      }
      else if (val === "=") {
        if (calcOperator && calcPrevious !== null) {
          let result = 0;
          const curr = parseFloat(calcCurrent);
          if (calcOperator === "+") result = calcPrevious + curr;
          if (calcOperator === "-") result = calcPrevious - curr;
          if (calcOperator === "*") result = calcPrevious * curr;
          if (calcOperator === "/") result = calcPrevious / curr;
          calcCurrent = result.toString();
          calcOperator = null;
          calcPrevious = null;
          calcShouldReset = true;
        }
      }
      else {
        if (calcShouldReset) {
          calcCurrent = val;
          calcShouldReset = false;
        } else {
          if (calcCurrent === "0" && val !== ".") calcCurrent = val;
          else calcCurrent += val;
        }
      }
      calcDisplay.textContent = calcCurrent;
    });
  });
})();
