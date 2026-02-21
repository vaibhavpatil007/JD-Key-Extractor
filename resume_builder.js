// =============================================
//  Resume Builder — Main Logic
// =============================================

// DOM References
const kwDisplay = document.getElementById("kwDisplay");
const kwBadge = document.getElementById("kwBadge");
const downloadTexBtn = document.getElementById("downloadTexBtn");
const previewPdfBtn = document.getElementById("previewPdfBtn");
const copyLatexBtn = document.getElementById("copyLatexBtn");
const buildBtn = document.getElementById("buildBtn");
const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");
const fileLoaded = document.getElementById("fileLoaded");
const fileNameEl = document.getElementById("fileName");
const clearFileBtn = document.getElementById("clearFileBtn");
const outputEmpty = document.getElementById("outputEmpty");
const latexOutput = document.getElementById("latexOutput");
const latexCode = document.getElementById("latexCode");
const pdfModal = document.getElementById("pdfModal");
const resumePreview = document.getElementById("resumePreview");
const printBtn = document.getElementById("printBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const toast = document.getElementById("toast");

// Personal Info inputs
const inFullName = document.getElementById("inFullName");
const inLocation = document.getElementById("inLocation");
const inEmail = document.getElementById("inEmail");
const inPhone = document.getElementById("inPhone");
const inLinkedIn = document.getElementById("inLinkedIn");
const inGithub = document.getElementById("inGithub");
const inSummary = document.getElementById("inSummary");

// State
let loadedKeywords = {};   // { catKey: [kw, ...] }
let generatedLatex = "";

// =============================================
//  1. Load Keywords from chrome.storage.local
// =============================================
function loadKeywords() {
  if (typeof chrome !== "undefined" && chrome.storage) {
    chrome.storage.local.get(["extractedKeywords"], (result) => {
      if (result.extractedKeywords && Object.keys(result.extractedKeywords).length > 0) {
        loadedKeywords = result.extractedKeywords;
      } else {
        loadedKeywords = {};
      }
      renderKeywords(loadedKeywords);
    });
  } else {
    // Dev fallback — show demo keywords
    loadedKeywords = {
      lang: ["Python", "JavaScript"],
      frame: ["Django", "React", "Flask"],
      db: ["PostgreSQL", "MongoDB", "Redis"],
      cloud: ["AWS", "Docker"],
      devops: ["Git", "CI/CD", "Kubernetes"],
      ml: ["Machine Learning"]
    };
    renderKeywords(loadedKeywords);
  }
}

function renderKeywords(grouped) {
  const total = Object.values(grouped).flat().length;
  kwBadge.textContent = total;

  if (total === 0) {
    kwDisplay.innerHTML = `
      <div class="kw-empty">
        <span class="kw-empty-icon">🔍</span>
        <p>No keywords loaded.<br/>Go back to the popup and extract keywords first.</p>
      </div>`;
    return;
  }

  let html = "";
  for (const [catKey, keywords] of Object.entries(grouped)) {
    const cat = KEYWORD_CATEGORIES[catKey];
    if (!cat || keywords.length === 0) continue;
    html += `<div class="kw-cat-section">
      <span class="kw-cat-label ${cat.labelClass}">${cat.label}</span>
      <div>`;
    keywords.forEach(kw => {
      html += `<span class="kw-tag ${cat.tagClass}">${kw}</span>`;
    });
    html += `</div></div>`;
  }
  kwDisplay.innerHTML = html;
}

// =============================================
//  2. File Upload
// =============================================
dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("drag-over");
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("drag-over");
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("drag-over");
  const file = e.dataTransfer.files[0];
  if (file) handleFile(file);
});

dropZone.addEventListener("click", (e) => {
  if (e.target === clearFileBtn || e.target.closest(".file-loaded")) return;
  fileInput.click();
});

fileInput.addEventListener("change", () => {
  if (fileInput.files[0]) handleFile(fileInput.files[0]);
});

clearFileBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  fileNameEl.textContent = "—";
  fileLoaded.classList.add("hidden");
  dropZone.querySelector(".drop-content").classList.remove("hidden");
  fileInput.value = "";
});

function handleFile(file) {
  const allowed = [".txt", ".tex", ".pdf"];
  const ext = ("." + file.name.split(".").pop()).toLowerCase();
  if (!allowed.includes(ext)) {
    showToast("⚠️ Please upload a .txt, .tex, or .pdf file");
    return;
  }

  if (ext === ".pdf") {
    handlePdf(file);
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    updateFileLoadedUI(file.name);
    parseResumeText(e.target.result);
  };
  reader.readAsText(file);
}

function updateFileLoadedUI(name) {
  fileNameEl.textContent = name;
  fileLoaded.classList.remove("hidden");
  dropZone.querySelector(".drop-content").classList.add("hidden");
}

async function handlePdf(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();

    // Set worker src to local lib folder
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'lib/pdf.worker.min.js';

    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(" ");
      fullText += pageText + "\n";
    }

    updateFileLoadedUI(file.name);
    parseResumeText(fullText);
  } catch (err) {
    console.error("PDF extraction error:", err);
    showToast("⚠️ Error reading PDF file.");
  }
}

function parseResumeText(text) {
  // Try to extract email
  const emailMatch = text.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) inEmail.value = emailMatch[0];

  // Try to extract phone (Indian format)
  const phoneMatch = text.match(/(\+91[\s-]?)?[6-9]\d{9}/);
  if (phoneMatch) inPhone.value = phoneMatch[0];

  // Try to extract LinkedIn
  const liMatch = text.match(/https?:\/\/(?:www\.)?linkedin\.com\/in\/[^\s}]+/);
  if (liMatch) inLinkedIn.value = liMatch[0].replace(/[,;}\s]+$/, "");

  // Try to extract GitHub
  const ghMatch = text.match(/https?:\/\/(?:www\.)?github\.com\/[^\s}]+/);
  if (ghMatch) inGithub.value = ghMatch[0].replace(/[,;}\s]+$/, "");

  showToast("✅ Resume parsed! Personal info updated.");
}

// =============================================
//  3. Build / Generate LaTeX
// =============================================
buildBtn.addEventListener("click", () => {
  const personal = {
    fullName: inFullName.value.trim() || "Your Name",
    location: inLocation.value.trim() || "City",
    email: inEmail.value.trim() || "email@example.com",
    phone: inPhone.value.trim() || "+91 XXXXXXXXXX",
    linkedinUrl: inLinkedIn.value.trim() || "https://linkedin.com/in/yourprofile",
    githubUrl: inGithub.value.trim() || "https://github.com/yourusername",
    summary: inSummary.value.trim() || "Your professional summary."
  };

  const skillsLatex = buildSkillsLatex(loadedKeywords);
  generatedLatex = buildFullLatex(personal, skillsLatex);

  // Show output
  latexCode.textContent = generatedLatex;
  outputEmpty.classList.add("hidden");
  latexOutput.classList.remove("hidden");

  // Enable action buttons
  downloadTexBtn.disabled = false;
  previewPdfBtn.disabled = false;
  copyLatexBtn.disabled = false;

  showToast("✅ LaTeX generated successfully!");
});

function buildSkillsLatex(grouped) {
  // Category display names for skills section
  const CATEGORY_LABELS = {
    lang: "Programming Languages",
    frame: "Frameworks & Libraries",
    db: "Databases",
    cloud: "Cloud Technologies",
    devops: "DevOps & Tools",
    ml: "AI / ML",
    other: "Other"
  };

  let lines = [];

  for (const [catKey, keywords] of Object.entries(grouped)) {
    if (!keywords || keywords.length === 0) continue;
    const label = CATEGORY_LABELS[catKey] || catKey;
    const escaped = keywords.map(escapeLatex).join(", ");
    lines.push(
      `        \\begin{onecolentry}\n` +
      `            \\textbf{${label}:} ${escaped}\n` +
      `        \\end{onecolentry}`
    );
  }

  return lines.join("\n");
}

function buildFullLatex(p, skillsLatex) {
  return LATEX_TEMPLATE
    .replace(/%%FULLNAME%%/g, escapeLatex(p.fullName))
    .replace(/%%LOCATION%%/g, escapeLatex(p.location))
    .replace(/%%EMAIL%%/g, p.email)
    .replace(/%%PHONE%%/g, escapeLatex(p.phone))
    .replace(/%%LINKEDIN_URL%%/g, p.linkedinUrl)
    .replace(/%%GITHUB_URL%%/g, p.githubUrl)
    .replace(/%%SUMMARY%%/g, escapeLatex(p.summary))
    .replace(/%%SKILLS%%/g, skillsLatex || "        \\begin{onecolentry}\n            No keywords extracted.\n        \\end{onecolentry}")
    .replace(/%%EXPERIENCE%%/g, STATIC_EXPERIENCE)
    .replace(/%%EDUCATION%%/g, STATIC_EDUCATION)
    .replace(/%%PROJECTS%%/g, STATIC_PROJECTS);
}

function escapeLatex(str) {
  return str
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/&/g, "\\&")
    .replace(/%/g, "\\%")
    .replace(/\$/g, "\\$")
    .replace(/#/g, "\\#")
    .replace(/_/g, "\\_")
    .replace(/\{/g, "\\{")
    .replace(/\}/g, "\\}")
    .replace(/~/g, "\\textasciitilde{}")
    .replace(/\^/g, "\\textasciicircum{}");
}

// =============================================
//  4. Download .tex
// =============================================
downloadTexBtn.addEventListener("click", () => {
  if (!generatedLatex) return;
  const name = (inFullName.value.trim() || "resume").replace(/\s+/g, "_");
  const blob = new Blob([generatedLatex], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${name}_resume.tex`;
  a.click();
  URL.revokeObjectURL(url);
  showToast("📥 .tex file downloaded!");
});

// =============================================
//  5. Copy LaTeX
// =============================================
copyLatexBtn.addEventListener("click", () => {
  if (!generatedLatex) return;
  navigator.clipboard.writeText(generatedLatex).then(() => {
    copyLatexBtn.textContent = "Copied!";
    setTimeout(() => { copyLatexBtn.textContent = "Copy"; }, 2000);
    showToast("📋 LaTeX copied to clipboard!");
  });
});

// =============================================
//  6. HTML Preview / PDF
// =============================================
previewPdfBtn.addEventListener("click", () => {
  if (!generatedLatex) return;
  buildHtmlPreview();
  pdfModal.classList.remove("hidden");
});

closeModalBtn.addEventListener("click", () => {
  pdfModal.classList.add("hidden");
});

pdfModal.querySelector(".modal-backdrop").addEventListener("click", () => {
  pdfModal.classList.add("hidden");
});

printBtn.addEventListener("click", () => {
  window.print();
});

function buildHtmlPreview() {
  const p = {
    fullName: inFullName.value.trim() || "Your Name",
    location: inLocation.value.trim() || "City",
    email: inEmail.value.trim() || "email@example.com",
    phone: inPhone.value.trim() || "+91 XXXXXXXXXX",
    linkedinUrl: inLinkedIn.value.trim() || "#",
    githubUrl: inGithub.value.trim() || "#",
    summary: inSummary.value.trim() || ""
  };

  const CATEGORY_LABELS = {
    lang: "Programming Languages",
    frame: "Frameworks & Libraries",
    db: "Databases",
    cloud: "Cloud Technologies",
    devops: "DevOps & Tools",
    ml: "AI / ML",
    other: "Other"
  };

  // Skills rows
  let skillsHtml = "";
  for (const [catKey, keywords] of Object.entries(loadedKeywords)) {
    if (!keywords || keywords.length === 0) continue;
    const label = CATEGORY_LABELS[catKey] || catKey;
    skillsHtml += `<p class="rp-skill-row"><strong>${label}:</strong> ${keywords.join(", ")}</p>`;
  }
  if (!skillsHtml) skillsHtml = "<p class='rp-skill-row'>No keywords extracted.</p>";

  resumePreview.innerHTML = `
    <div class="rp-header">
      <div class="rp-name">${p.fullName}</div>
      <div class="rp-contact">
        <span>${p.location}</span>
        <span class="sep">|</span>
        <a href="mailto:${p.email}">${p.email}</a>
        <span class="sep">|</span>
        <span>${p.phone}</span>
        <span class="sep">|</span>
        <a href="${p.linkedinUrl}" target="_blank">LinkedIn</a>
        <span class="sep">|</span>
        <a href="${p.githubUrl}" target="_blank">GitHub</a>
      </div>
    </div>

    <div class="rp-section">Professional Summary</div>
    <p class="rp-summary">${p.summary}</p>

    <div class="rp-section">Technical Skills</div>
    ${skillsHtml}

    <div class="rp-section">Experience</div>

    <div class="rp-exp-block">
      <div class="rp-exp-header">
        <span class="rp-exp-title">Project Associate – Backend Developer</span>
        <span class="rp-exp-date">Oct 2024 – Present</span>
      </div>
      <div class="rp-exp-sub">xyz — Hyderabad, India</div>
      <ul class="rp-list">
        <li>Maintained and enhanced a Form-as-a-Service (SaaS) platform using Django and DRF.</li>
        <li>Designed secure communication using AES-based encryption and decryption.</li>
        <li>Developed RBAC and token-based authentication mechanisms.</li>
        <li>Performed API penetration testing using Burp Suite and remediated vulnerabilities.</li>
        <li>Integrated async email notifications using Celery and background workers.</li>
        <li>Managed the Jenkins CI/CD pipeline for automated builds and deployments.</li>
      </ul>
    </div>

    <div class="rp-exp-block">
      <div class="rp-exp-header">
        <span class="rp-exp-title">Software Engineer</span>
        <span class="rp-exp-date">March 2024 – June 2024</span>
      </div>
      <div class="rp-exp-sub">Nimble Intelligent Solutions — Nashik, India</div>
      <ul class="rp-list">
        <li>Developed high-quality Python REST APIs integrated with business workflows.</li>
        <li>Built Flask-based services to support AI application features.</li>
        <li>Designed and trained ML models for computer vision and face recognition.</li>
        <li>Implemented D3.js-based interactive data visualizations.</li>
      </ul>
    </div>

    <div class="rp-exp-block">
      <div class="rp-exp-header">
        <span class="rp-exp-title">AIML Trainee</span>
        <span class="rp-exp-date">July 2023 – Feb 2024</span>
      </div>
      <div class="rp-exp-sub">PDRL — Nashik, India</div>
      <ul class="rp-list">
        <li>Scraped and curated satellite and drone imagery for computer vision datasets.</li>
        <li>Performed image annotation and labeling for drone and satellite data pipelines.</li>
        <li>Implemented object detection models using pre-trained YOLO architectures.</li>
      </ul>
    </div>

    <div class="rp-section">Education</div>
    <div class="rp-edu-row">
      <div>
        <strong>Sandip University</strong> — B.Tech, Computer Science and Engineering
      </div>
      <div style="color:#6b7280;font-size:12px;">May 2019 – May 2023 | GPA: 8.4</div>
    </div>

    <div class="rp-section">Projects</div>

    <div class="rp-proj-block">
      <strong>SaaS – Form as a Service</strong>
      <ul class="rp-list">
        <li>Web app for managing event-linked forms with automation features.</li>
        <li>Tech Stack: Django DRF, React, MySQL</li>
      </ul>
    </div>
    <div class="rp-proj-block">
      <strong>WebShare</strong>
      <ul class="rp-list">
        <li>Fast, secure, lightweight file-sharing for local networks — no internet required.</li>
        <li>Tech Stack: Django DRF, React, MongoDB</li>
      </ul>
    </div>
    <div class="rp-proj-block">
      <strong>BotBuilder</strong>
      <ul class="rp-list">
        <li>Full-stack AI agent platform using RAG for accurate, context-aware chatbot responses.</li>
        <li>Tech Stack: Django DRF, TypeScript, MongoDB</li>
      </ul>
    </div>
  `;
}

// =============================================
//  7. Toast
// =============================================
let _toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.remove("hidden");
  requestAnimationFrame(() => toast.classList.add("show"));
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.classList.add("hidden"), 300);
  }, 2400);
}

// =============================================
//  Init
// =============================================
loadKeywords();
