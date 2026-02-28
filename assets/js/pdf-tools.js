/* ===============================
   PDF TOOLS – SHARED JS
================================= */

let selectedFiles = [];
let processedPdfBytes = null;

/* ===============================
   UTILITIES
================================= */

function setStatus(message, type = "loading") {
  const status = document.getElementById("status");
  if (!status) return;

  status.textContent = message;
  status.className = "tool-status " + type;
}

function disableButton(id, state = true) {
  const btn = document.getElementById(id);
  if (btn) btn.disabled = state;
}

function downloadPdf(filename = "output.pdf") {
  if (!processedPdfBytes) {
    alert("Process the PDF first.");
    return;
  }

  const blob = new Blob([processedPdfBytes], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

/* ===============================
   FILE SELECTION
================================= */

function handlePdfSelection(input) {
  const newFiles = Array.from(input.files);

  // Append instead of replace
  selectedFiles = [...selectedFiles, ...newFiles];

  const list = document.getElementById("fileList");
  if (!list) return;

  list.innerHTML = "";

  selectedFiles.forEach((file, index) => {
    const li = document.createElement("li");
    li.textContent = file.name;
    list.appendChild(li);
  });

  // Reset input so same file can be selected again
  input.value = "";
}
/* ===============================
   MERGE PDF
================================= */

async function mergePDFs() {
  if (selectedFiles.length < 2) {
    alert("Select at least 2 PDFs.");
    return;
  }

  disableButton("mergeBtn", true);
  setStatus("Merging PDFs… ⏳");

  try {
    const { PDFDocument } = PDFLib;

    const mergedPdf = await PDFDocument.create();

    for (const file of selectedFiles) {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);

      const pages = await mergedPdf.copyPages(
        pdf,
        pdf.getPageIndices()
      );

      pages.forEach(page => mergedPdf.addPage(page));
    }

    processedPdfBytes = await mergedPdf.save();

    setStatus("Merge complete ✅", "success");
    disableButton("downloadBtn", false);
  } catch (error) {
    setStatus("Merge failed ❌", "error");
    console.error(error);
  }

  disableButton("mergeBtn", false);
}

/* ===============================
   LOCK PDF (Add Password)
================================= */

async function lockPDF() {
  if (selectedFiles.length !== 1) {
    alert("Select one PDF file.");
    return;
  }

  const password = document.getElementById("password").value;
  if (!password) {
    alert("Enter a password.");
    return;
  }

  disableButton("lockBtn", true);
  setStatus("Locking PDF… ⏳");

  try {
    const { PDFDocument } = PDFLib;

    const bytes = await selectedFiles[0].arrayBuffer();
    const pdfDoc = await PDFDocument.load(bytes);

    processedPdfBytes = await pdfDoc.save({
      userPassword: password,
      ownerPassword: password,
      permissions: {
        printing: "lowResolution",
        modifying: false,
        copying: false
      }
    });

    setStatus("PDF Locked ✅", "success");
    disableButton("downloadBtn", false);
  } catch (error) {
    setStatus("Lock failed ❌", "error");
    console.error(error);
  }

  disableButton("lockBtn", false);
}

/* ===============================
   UNLOCK PDF
================================= */

async function unlockPDF() {
  if (selectedFiles.length !== 1) {
    alert("Select one PDF file.");
    return;
  }

  const password = document.getElementById("password").value;

  disableButton("unlockBtn", true);
  setStatus("Unlocking PDF… ⏳");

  try {
    const { PDFDocument } = PDFLib;

    const bytes = await selectedFiles[0].arrayBuffer();

    const pdfDoc = await PDFDocument.load(bytes, {
      password: password || undefined
    });

    processedPdfBytes = await pdfDoc.save();

    setStatus("PDF Unlocked ✅", "success");
    disableButton("downloadBtn", false);
  } catch (error) {
    setStatus("Incorrect password ❌", "error");
    console.error(error);
  }

  disableButton("unlockBtn", false);
}

/* ===============================
   COMPRESS PDF (Basic)
================================= */

async function compressPDF() {
  if (selectedFiles.length !== 1) {
    alert("Select one PDF file.");
    return;
  }

  disableButton("compressBtn", true);
  setStatus("Compressing PDF… ⏳");

  try {
    const { PDFDocument } = PDFLib;

    const bytes = await selectedFiles[0].arrayBuffer();
    const pdfDoc = await PDFDocument.load(bytes);

    processedPdfBytes = await pdfDoc.save({
      useObjectStreams: true
    });

    setStatus("Compression complete ✅", "success");
    disableButton("downloadBtn", false);
  } catch (error) {
    setStatus("Compression failed ❌", "error");
    console.error(error);
  }

  disableButton("compressBtn", false);
}
