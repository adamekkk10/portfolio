const apiKeyInput = document.getElementById("apiKey");
const saveBtn = document.getElementById("saveBtn");
const clearBtn = document.getElementById("clearBtn");
const statusEl = document.getElementById("status");

// Pre-fill with the currently saved key so the user can see (and edit) it.
chrome.storage.local.get("apiKey", ({ apiKey }) => {
  if (apiKey) apiKeyInput.value = apiKey;
});

function flashStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.classList.toggle("error", isError);
  setTimeout(() => {
    statusEl.textContent = "";
    statusEl.classList.remove("error");
  }, 2500);
}

saveBtn.addEventListener("click", async () => {
  const key = apiKeyInput.value.trim();
  if (!key) {
    flashStatus("Enter a key before saving.", true);
    return;
  }
  if (!key.startsWith("sk-ant-")) {
    flashStatus("That doesn't look like an Anthropic API key (expected sk-ant-...).", true);
    return;
  }
  await chrome.storage.local.set({ apiKey: key });
  flashStatus("Saved.");
});

clearBtn.addEventListener("click", async () => {
  await chrome.storage.local.remove("apiKey");
  apiKeyInput.value = "";
  flashStatus("Cleared.");
});
