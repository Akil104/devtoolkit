/* -----------------------------
   IMAGE TOOLS – SHARED JS
------------------------------ */

/* ---------- GLOBAL STATE ---------- */
let originalImage = null;
let canvas = document.createElement("canvas");
let ctx = canvas.getContext("2d");

let formatImage = null;
let formatCanvas = document.createElement("canvas");
let formatCtx = formatCanvas.getContext("2d");

let selectedFormat = null;

/* ---------- UI HELPERS ---------- */
function setStatus(text = "") {
  const el = document.getElementById("statusText");
  if (el) el.textContent = text;
}

function disable(id, state = true) {
  const btn = document.getElementById(id);
  if (btn) btn.disabled = state;
}

/* ---------- LOAD IMAGE ---------- */
function loadImage(fileInput, previewId = "preview") {
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      originalImage = img;
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      document.getElementById(previewId).src = canvas.toDataURL();
      setStatus("");
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
}

/* ---------- IMAGE COMPRESS ---------- */
let compressedBlob = null;

function startCompress(quality = 0.7, previewId = "preview") {
  if (!originalImage) {
    alert("Upload an image first");
    return;
  }

  disable("compressBtn", true);
  disable("downloadBtn", true);
  setStatus("Compressing image… ⏳");

  canvas.width = originalImage.width;
  canvas.height = originalImage.height;
  ctx.drawImage(originalImage, 0, 0);

  canvas.toBlob(
    blob => {
      compressedBlob = blob;

      const url = URL.createObjectURL(blob);
      document.getElementById(previewId).src = url;

      setStatus("Compression complete ✅");
      disable("compressBtn", false);
      disable("downloadBtn", false);
    },
    "image/jpeg",
    quality
  );
}

function downloadCompressedImage(filename = "compressed.jpg") {
  if (!compressedBlob) {
    alert("Compress the image first");
    return;
  }

  const link = document.createElement("a");
  link.download = filename;
  link.href = URL.createObjectURL(compressedBlob);
  link.click();
}


/* ---------- IMAGE FILTERS / ADJUST ---------- */
function applyFilter(filter, previewId = "preview") {
  canvas.width = originalImage.width;
  canvas.height = originalImage.height;
  ctx.filter = filter;
  ctx.drawImage(originalImage, 0, 0);
  ctx.filter = "none";
  document.getElementById(previewId).src = canvas.toDataURL();
}

function startAdjust(filter, previewId = "preview") {
  if (!originalImage) {
    alert("Upload an image first");
    return;
  }

  disable("adjustBtn", true);
  setStatus("Adjusting image… ⏳");

  setTimeout(() => {
    applyFilter(filter, previewId);
    setStatus("Adjustment applied ✅");
    disable("adjustBtn", false);
  }, 600);
}

/* ---------- IMAGE BLUR ---------- */
function blurImage(amount = 5, previewId = "preview") {
  applyFilter(`blur(${amount}px)`, previewId);
}

function startBlur(amount = 5, previewId = "preview") {
  if (!originalImage) {
    alert("Upload an image first");
    return;
  }

  disable("blurBtn", true);
  setStatus("Applying blur… ⏳");

  setTimeout(() => {
    blurImage(amount, previewId);
    setStatus("Blur applied ✅");
    disable("blurBtn", false);
  }, 600);
}

/* ---------- IMAGE TO BASE64 (NO LOADING) ---------- */
function imageToBase64(outputId) {
  if (!originalImage) return;
  document.getElementById(outputId).textContent = canvas.toDataURL();
}

/* ---------- BASE64 TO IMAGE (NO LOADING) ---------- */
function base64ToImage(textareaId, previewId) {
  const base64 = document.getElementById(textareaId).value.trim();
  if (!base64) return;
  document.getElementById(previewId).src = base64;
}

/* ---------- DOWNLOAD ---------- */
function downloadImage(filename = "image.png") {
  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

/* ---------- RESET ---------- */
function resetImage(previewId = "preview") {
  if (!originalImage) return;
  canvas.width = originalImage.width;
  canvas.height = originalImage.height;
  ctx.drawImage(originalImage, 0, 0);
  document.getElementById(previewId).src = canvas.toDataURL();
  setStatus("");
}

/* ---------- FORMAT CONVERTER ---------- */
function loadFormatImage(fileInput, previewId = "preview") {
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      formatImage = img;
      formatCanvas.width = img.width;
      formatCanvas.height = img.height;
      formatCtx.drawImage(img, 0, 0);
      document.getElementById(previewId).src = formatCanvas.toDataURL();
      setStatus("");
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
}

function convertImageFormat(format, previewId = "preview") {
  let mimeType = "image/png";
  if (format === "jpg") mimeType = "image/jpeg";
  if (format === "webp") mimeType = "image/webp";

  const dataUrl = formatCanvas.toDataURL(mimeType, 0.92);
  document.getElementById(previewId).src = dataUrl;
}

function startFormatConvert(previewId = "preview") {
  const select = document.getElementById("formatSelect");
  if (!select || !formatImage) {
    alert("Upload an image and select a format");
    return;
  }

  selectedFormat = select.value;
  if (!selectedFormat) {
    alert("Select a format");
    return;
  }

  disable("convertBtn", true);
  disable("downloadBtn", true);
  setStatus("Converting image… ⏳");

  setTimeout(() => {
    convertImageFormat(selectedFormat, previewId);
    setStatus("Conversion complete ✅");
    disable("convertBtn", false);
    disable("downloadBtn", false);
  }, 700);
}

function downloadConvertedImage() {
  if (!selectedFormat) return;

  let mimeType = "image/png";
  if (selectedFormat === "jpg") mimeType = "image/jpeg";
  if (selectedFormat === "webp") mimeType = "image/webp";

  const link = document.createElement("a");
  link.download = `converted-image.${selectedFormat}`;
  link.href = formatCanvas.toDataURL(mimeType, 0.92);
  link.click();
}

function resetFormatConverter(previewId = "preview") {
  formatImage = null;
  document.getElementById(previewId).src = "";
  setStatus("");
}
