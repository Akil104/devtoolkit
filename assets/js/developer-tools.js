// ---------- HELPERS ----------
const jsonInput = document.getElementById("jsonInput");
const textInput = document.getElementById("textInput");
const output = document.getElementById("output");

// ---------- JSON TOOLS ----------
function formatJSON() {
  if (!jsonInput || !output) return;

  try {
    output.textContent = JSON.stringify(
      JSON.parse(jsonInput.value),
      null,
      2
    );
  } catch {
    output.textContent = "Invalid JSON ❌";
  }
}

function minifyJSON() {
  if (!jsonInput || !output) return;

  try {
    output.textContent = JSON.stringify(JSON.parse(jsonInput.value));
  } catch {
    output.textContent = "Invalid JSON ❌";
  }
}

function validateJSON() {
  if (!jsonInput || !output) return;

  try {
    JSON.parse(jsonInput.value);
    output.textContent = "Valid JSON ✅";
  } catch (e) {
    output.textContent = "Invalid JSON ❌\n" + e.message;
  }
}

// ---------- BASE64 TOOLS ----------
function encodeBase64() {
  if (!textInput || !output) return;

  try {
    output.textContent = btoa(
      unescape(encodeURIComponent(textInput.value))
    );
  } catch {
    output.textContent = "Encoding failed ❌";
  }
}

function decodeBase64() {
  if (!textInput || !output) return;

  try {
    output.textContent = decodeURIComponent(
      escape(atob(textInput.value))
    );
  } catch {
    output.textContent = "Invalid Base64 ❌";
  }
}

// ---------- UUID ----------
function generateUUID() {
  if (!textInput) return;
  textInput.value = crypto.randomUUID();
}


// ---------- CLEAR ----------
function clearOutput() {
  if (jsonInput) jsonInput.value = "";
  if (textInput) textInput.value = "";
  if (output) output.textContent = "";
}
