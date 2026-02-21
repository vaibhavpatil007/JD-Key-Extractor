// =============================================
//  State
// =============================================
let lastFoundKeywords = {};

// =============================================
//  DOM references
// =============================================
const extractBtn = document.getElementById("extractBtn");
const copyBtn = document.getElementById("copyBtn");
const clearBtn = document.getElementById("clearBtn");
const optimizeBtn = document.getElementById("optimizeBtn");
const buildResumeBtn = document.getElementById("buildResumeBtn");
const buildResumeRow = document.getElementById("buildResumeRow");
const resultDiv = document.getElementById("result");
const statsBar = document.getElementById("statsBar");
const emptyState = document.getElementById("emptyState");
const loadingState = document.getElementById("loadingState");
const actionRow = document.getElementById("actionRow");
const toast = document.getElementById("toast");
const keywordCount = document.getElementById("keywordCount");
const categoryCount = document.getElementById("categoryCount");
const matchScore = document.getElementById("matchScore");

// =============================================
//  Extract
// =============================================
extractBtn.addEventListener("click", async () => {
    showLoading(true);

    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    try {
        const results = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => document.body.innerText
        });

        showLoading(false);

        if (!results || !results[0]) {
            showError("Couldn't read page content. Try refreshing the tab.");
            return;
        }

        const jdText = results[0].result.toLowerCase();
        const found = {};

        // Match per category
        for (const [catKey, cat] of Object.entries(KEYWORD_CATEGORIES)) {
            const matched = cat.keywords.filter(kw => jdText.includes(kw.toLowerCase()));
            if (matched.length > 0) found[catKey] = matched;
        }

        lastFoundKeywords = found;

        // Save to chrome.storage.local so the builder page can read them
        if (chrome.storage && chrome.storage.local) {
            chrome.storage.local.set({ extractedKeywords: found });
        } else {
            showError("Storage permission not active. Please reload the extension at chrome://extensions/");
        }

        displayKeywords(found);
    } catch (err) {
        showLoading(false);
        showError("Injection failed: " + err.message);
    }
});

// =============================================
//  Display
// =============================================
function displayKeywords(grouped) {
    const totalFound = Object.values(grouped).flat().length;
    const totalAll = TECH_KEYWORDS.length;
    const numCats = Object.keys(grouped).length;

    // Stats
    keywordCount.textContent = totalFound;
    categoryCount.textContent = numCats;
    matchScore.textContent = totalAll > 0
        ? Math.round((totalFound / totalAll) * 100) + "%"
        : "0%";

    if (totalFound === 0) {
        resultDiv.innerHTML = `<p class="no-result">😕 No matching keywords found on this page.</p>`;
        resultDiv.classList.remove("hidden");
        statsBar.classList.add("hidden");
        actionRow.classList.add("hidden");
        buildResumeRow.classList.add("hidden");
        emptyState.classList.add("hidden");
        return;
    }

    // Build grouped HTML
    let html = "";
    for (const [catKey, keywords] of Object.entries(grouped)) {
        const cat = KEYWORD_CATEGORIES[catKey];
        html += `<div class="cat-section">
      <span class="cat-label ${cat.labelClass}">${cat.label}</span>
      <div>`;
        keywords.forEach((kw, i) => {
            html += `<span class="tag ${cat.tagClass}" style="animation-delay:${i * 40}ms">${kw}</span>`;
        });
        html += `</div></div>`;
    }

    resultDiv.innerHTML = html;
    resultDiv.classList.remove("hidden");
    statsBar.classList.remove("hidden");
    actionRow.classList.remove("hidden");
    buildResumeRow.classList.remove("hidden");
    emptyState.classList.add("hidden");
}

// =============================================
//  Copy
// =============================================
copyBtn.addEventListener("click", () => {
    const allKeywords = Object.values(lastFoundKeywords).flat();
    if (allKeywords.length === 0) return;

    navigator.clipboard.writeText(allKeywords.join(", ")).then(() => {
        showToast("✅ Copied to clipboard!");
        copyBtn.querySelector("span:last-child").textContent = "Copied!";
        setTimeout(() => {
            copyBtn.querySelector("span:last-child").textContent = "Copy All";
        }, 2000);
    });
});

// =============================================
//  Clear
// =============================================
clearBtn.addEventListener("click", () => {
    lastFoundKeywords = {};
    resultDiv.innerHTML = "";
    resultDiv.classList.add("hidden");
    statsBar.classList.add("hidden");
    actionRow.classList.add("hidden");
    buildResumeRow.classList.add("hidden");
    emptyState.classList.remove("hidden");
    if (chrome.storage && chrome.storage.local) {
        chrome.storage.local.remove("extractedKeywords");
    }
});

// =============================================
//  Build Resume — Open Builder Tab
// =============================================
buildResumeBtn.addEventListener("click", () => {
    const builderUrl = chrome.runtime.getURL("resume_builder.html");
    chrome.tabs.create({ url: builderUrl });
});

// =============================================
//  Optimize / CTA
// =============================================
optimizeBtn.addEventListener("click", () => {
    chrome.tabs.create({ url: "https://www.overleaf.com/" });
});

// =============================================
//  Helpers
// =============================================
function showLoading(show) {
    if (show) {
        loadingState.classList.remove("hidden");
        emptyState.classList.add("hidden");
        resultDiv.classList.add("hidden");
        statsBar.classList.add("hidden");
        actionRow.classList.add("hidden");
        buildResumeRow.classList.add("hidden");
        extractBtn.disabled = true;
        extractBtn.querySelector(".btn-label").textContent = "Scanning…";
    } else {
        loadingState.classList.add("hidden");
        extractBtn.disabled = false;
        extractBtn.querySelector(".btn-label").textContent = "Extract Keywords";
    }
}

function showError(msg) {
    resultDiv.innerHTML = `<p class="no-result">⚠️ ${msg}</p>`;
    resultDiv.classList.remove("hidden");
    emptyState.classList.add("hidden");
}

let toastTimer;
function showToast(msg) {
    toast.textContent = msg;
    toast.classList.remove("hidden");
    requestAnimationFrame(() => toast.classList.add("show"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.classList.add("hidden"), 300);
    }, 2200);
}
