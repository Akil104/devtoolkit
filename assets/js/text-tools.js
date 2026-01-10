function toUpperCaseText(){
  const input=document.getElementById("textInput").value;
   document.getElementById("textOutput").textContent=input.toUpperCase();
}
function toLowerCaseText(){
    const input=document.getElementById("textInput").value;
    document.getElementById("textOutput").textContent=input.toLowerCase();
}
function capitalizeText() {
  const input = document.getElementById("textInput").value;

  const result = input
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  document.getElementById("textOutput").textContent = result;
}

function clearText(){
    document.getElementById("textInput").value="";
    document.getElementById("textOutput").textContent="";
}
function wordCount() {
  const text = document.getElementById("textInput").value;

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const characters = text.length;
  

  document.getElementById("textOutput").textContent =
    `Words: ${words}\nCharacters: ${characters}`;
}
function removeExtraSpaces() {
  const text = document.getElementById("textInput").value;
  document.getElementById("textOutput").textContent =
    text.replace(/\s+/g, " ").trim();
}
function removeLineBreaks() {
  const text = document.getElementById("textInput").value;
  document.getElementById("textOutput").textContent =
    text.replace(/(\r\n|\n|\r)/gm, " ");
}
function generateSlug() {
  const text = document.getElementById("textInput").value;
  document.getElementById("textOutput").textContent =
    text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
}