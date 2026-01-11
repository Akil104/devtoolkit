function getInput() {
  return document.getElementById("textInput").value;
}

function setOutput(text) {
  document.getElementById("textOutput").textContent = text;
}

function toUpperCaseText() {
  setOutput(getInput().toUpperCase());
}

function toLowerCaseText() {
  setOutput(getInput().toLowerCase());
}

function capitalizeText() {
  const result = getInput()
    .toLowerCase()
    .split(" ")
    .map(word =>
      word ? word.charAt(0).toUpperCase() + word.slice(1) : ""
    )
    .join(" ");

  setOutput(result);
}

function clearText() {
  document.getElementById("textInput").value = "";
  setOutput("");
}

function wordCount() {
  const text = getInput();
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const characters = text.length;

  setOutput(`Words: ${words}\nCharacters: ${characters}`);
}

function removeExtraSpaces() {
  setOutput(getInput().replace(/\s+/g, " ").trim());
}

function removeLineBreaks() {
  setOutput(getInput().replace(/(\r\n|\n|\r)/gm, " "));
}

function generateSlug() {
  setOutput(
    getInput()
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
  );
}
