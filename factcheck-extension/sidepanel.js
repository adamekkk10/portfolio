// Renders whatever state the background service worker is holding. This
// script never calls the Anthropic API itself — it only reflects state.

const app = document.getElementById("app");
const recheckBtn = document.getElementById("recheckBtn");

const templates = {
  loading: document.getElementById("tpl-loading"),
  error: document.getElementById("tpl-error"),
  noClaims: document.getElementById("tpl-no-claims"),
  claim: document.getElementById("tpl-claim")
};

function clearApp() {
  app.innerHTML = "";
}

function pageMetaLine(payload) {
  if (!payload?.title && !payload?.url) return "";
  return payload.title || payload.url;
}

function render(state) {
  clearApp();
  recheckBtn.hidden = state.status === "idle" || !state.tabId;

  if (state.status === "loading") {
    const node = templates.loading.content.cloneNode(true);
    node.querySelector(".page-meta").textContent = pageMetaLine(state.payload);
    app.appendChild(node);
    return;
  }

  if (state.status === "error") {
    const node = templates.error.content.cloneNode(true);
    node.querySelector(".error-message").textContent =
      state.payload?.message || "Something went wrong.";
    app.appendChild(node);
    document
      .getElementById("openOptionsBtn")
      .addEventListener("click", () => chrome.runtime.openOptionsPage());
    return;
  }

  if (state.status === "empty") {
    const node = templates.noClaims.content.cloneNode(true);
    node.querySelector(".page-meta").textContent = pageMetaLine(state.payload);
    app.appendChild(node);
    return;
  }

  if (state.status === "done") {
    const { title, url, claims } = state.payload;

    const meta = document.createElement("p");
    meta.className = "page-title";
    meta.textContent = title || url || "";
    app.appendChild(meta);

    claims.forEach((claim) => app.appendChild(renderClaim(claim)));
    return;
  }

  // idle
  const empty = document.createElement("div");
  empty.className = "state-view";
  empty.innerHTML = "<p>Click the FactCheck icon on any webpage to check its claims.</p>";
  app.appendChild(empty);
}

function verdictClass(verdict) {
  switch (verdict) {
    case "True":
      return "true";
    case "False":
      return "false";
    case "Misleading":
      return "misleading";
    default:
      return "unverified";
  }
}

function renderClaim(claim) {
  const node = templates.claim.content.cloneNode(true);

  const badge = node.querySelector(".badge");
  badge.textContent = claim.verdict;
  badge.classList.add(verdictClass(claim.verdict));

  node.querySelector(".claim-text").textContent = `"${claim.claim}"`;
  node.querySelector(".claim-explanation").textContent = claim.explanation || "";

  const sourcesEl = node.querySelector(".claim-sources");
  (claim.sources || []).slice(0, 3).forEach((source) => {
    const a = document.createElement("a");
    a.href = source.url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.textContent = source.title || source.url;
    sourcesEl.appendChild(a);
  });

  return node;
}

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type === "factcheck:update") render(message);
});

recheckBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "recheck" });
});

// Ask the background worker for whatever state it's currently holding —
// covers both "check already finished before the panel opened" and
// "check is still running."
chrome.runtime.sendMessage({ type: "panelReady" }, (response) => {
  if (response) render(response);
});
