const form = document.querySelector("#converter-form");
const input = document.querySelector("#temperature");
const unitSelect = document.querySelector("#unit");
const errorMessage = document.querySelector("#error-message");

const resultElements = {
  C: document.querySelector("#result-c .result-value"),
  F: document.querySelector("#result-f .result-value"),
  K: document.querySelector("#result-k .result-value")
};

function formatTemperature(value, unit) {
  const digits = Math.abs(value) < 0.0000001 ? 0 : 2;
  const number = value.toLocaleString(undefined, {
    minimumFractionDigits: digits,
    maximumFractionDigits: 2
  });
  const suffix = unit === "K" ? " K" : ` °${unit}`;
  return `${number}<span>${suffix}</span>`;
}

function convertToCelsius(value, unit) {
  if (unit === "C") return value;
  if (unit === "F") return (value - 32) * 5 / 9;
  return value - 273.15;
}

function showError(message) {
  errorMessage.textContent = message;
}

function clearResults() {
  Object.values(resultElements).forEach((element) => {
    element.innerHTML = `—<span> ${element === resultElements.K ? "K" : element === resultElements.C ? "°C" : "°F"}</span>`;
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  showError("");

  const rawValue = input.value.trim();
  if (rawValue === "") {
    showError("Please enter a temperature value.");
    input.focus();
    clearResults();
    return;
  }

  const value = Number(rawValue);
  if (!Number.isFinite(value)) {
    showError("Please enter a valid numeric temperature.");
    input.focus();
    clearResults();
    return;
  }

  const inputUnit = unitSelect.value;
  const celsius = convertToCelsius(value, inputUnit);
  const kelvin = celsius + 273.15;

  // Absolute zero is 0 K, equivalent to -273.15 °C or -459.67 °F.
  if (kelvin < -1e-10) {
    showError("That temperature is below absolute zero. Please enter a physically possible temperature.");
    clearResults();
    return;
  }

  const safeKelvin = Math.max(0, kelvin);
  const safeCelsius = safeKelvin - 273.15;
  const fahrenheit = safeCelsius * 9 / 5 + 32;

  resultElements.C.innerHTML = formatTemperature(safeCelsius, "C");
  resultElements.F.innerHTML = formatTemperature(fahrenheit, "F");
  resultElements.K.innerHTML = formatTemperature(safeKelvin, "K");
});

input.addEventListener("input", () => {
  if (errorMessage.textContent) showError("");
});

const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();
