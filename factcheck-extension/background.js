// Service worker: owns the whole check lifecycle (extract -> call Claude ->
// push results to the side panel). The side panel never talks to the
// Anthropic API directly; it only renders whatever state lives here.

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";
const MODEL = "claude-sonnet-4-6";
const MAX_WEB_SEARCHES = 8;
const VALID_VERDICTS = new Set(["True", "False", "Misleading", "Unverified"]);

// Error whose .message is safe (and useful) to show directly in the UI.
class UserFacingError extends Error {}

// In-memory only — resets when the service worker is recycled, which is
// fine: the side panel re-requests state on load and a fresh click on the
// icon always starts a new check anyway.
const state = {
  tabId: null,
  status: "idle", // idle | loading | done | empty | error
  payload: null
};

function broadcast() {
  chrome.runtime
    .sendMessage({ type: "factcheck:update", ...state })
    .catch(() => {
      // No receiver (side panel not open) — state is still cached above
      // and will be sent as the response to the next "panelReady" ping.
    });
}

chrome.action.onClicked.addListener(async (tab) => {
  try {
    await chrome.sidePanel.open({ tabId: tab.id });
  } catch (err) {
    // Some tab types (e.g. chrome:// pages) can still open the panel even
    // though scripting will fail later — runCheck() surfaces that error.
  }
  runCheck(tab);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === "panelReady") {
    sendResponse({ type: "factcheck:update", ...state });
    return; // synchronous response
  }
  if (message?.type === "recheck") {
    if (state.tabId == null) {
      sendResponse({ ok: false });
      return;
    }
    chrome.tabs
      .get(state.tabId)
      .then((tab) => runCheck(tab))
      .catch(() => {
        state.status = "error";
        state.payload = { message: "The original tab is no longer open." };
        broadcast();
      });
    sendResponse({ ok: true });
    return;
  }
});

async function runCheck(tab) {
  state.tabId = tab.id;
  state.status = "loading";
  state.payload = { url: tab.url, title: tab.title };
  broadcast();

  try {
    if (!tab.url || !/^https?:\/\//i.test(tab.url)) {
      throw new UserFacingError(
        "This page can't be scanned — browser-internal pages (chrome://, the extensions gallery, PDFs opened outside a tab, etc.) aren't accessible to extensions. Try it on a regular website."
      );
    }

    const { apiKey } = await chrome.storage.local.get("apiKey");
    if (!apiKey) {
      throw new UserFacingError(
        "No Anthropic API key is set yet. Open the extension's options page and paste in your key."
      );
    }

    let injectionResults;
    try {
      injectionResults = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"]
      });
    } catch (err) {
      throw new UserFacingError(
        "Couldn't read this page's content (it may be protected by the browser). Try a different page."
      );
    }

    const extracted = injectionResults?.[0]?.result;
    if (!extracted || !extracted.text || extracted.text.trim().length < 40) {
      state.status = "empty";
      state.payload = { url: tab.url, title: tab.title, claims: [] };
      broadcast();
      return;
    }

    const claims = await fetchFactCheck(apiKey, extracted);
    state.status = claims.length === 0 ? "empty" : "done";
    state.payload = { url: extracted.url, title: extracted.title, claims };
    broadcast();
  } catch (err) {
    state.status = "error";
    state.payload = {
      message:
        err instanceof UserFacingError
          ? err.message
          : `Something went wrong: ${err.message || String(err)}`
    };
    broadcast();
  }
}

function buildPrompt({ title, url, text }) {
  return `You are a careful fact-checking assistant. Below is the visible text extracted from a webpage (title: "${title}", url: ${url}).

Steps:
1. Identify the distinct, checkable factual claims made in the text. Skip opinions, jokes, and marketing fluff. Focus on the most significant claims; return at most 8.
2. For each claim, use the web_search tool to verify it against current, reliable sources.
3. Decide a verdict for each claim — exactly one of "True", "False", "Misleading", or "Unverified" (use "Unverified" when sources are inconclusive or you found nothing directly relevant).

Respond with ONLY a raw JSON array — no markdown code fences, no preamble, no trailing commentary — in exactly this shape:
[
  {
    "claim": "short quote or paraphrase of the claim, under 25 words",
    "verdict": "True",
    "explanation": "1-2 sentence explanation of the verdict",
    "sources": [{ "title": "source title", "url": "https://..." }]
  }
]

If the text contains no clear checkable factual claims, respond with exactly: []

Page text:
"""
${text}
"""`;
}

async function fetchFactCheck(apiKey, extracted) {
  const res = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": ANTHROPIC_VERSION,
      // Anthropic blocks browser-origin requests by default (to stop keys
      // from leaking out of public web apps). This extension only ever
      // sends the user's own key, stored locally, from their own browser —
      // this header is the documented opt-in for exactly that case.
      "anthropic-dangerous-direct-browser-access": "true"
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 4096,
      tools: [
        { type: "web_search_20250305", name: "web_search", max_uses: MAX_WEB_SEARCHES }
      ],
      messages: [{ role: "user", content: buildPrompt(extracted) }]
    })
  });

  if (!res.ok) {
    let message = `Anthropic API error (${res.status}).`;
    try {
      const errJson = await res.json();
      if (errJson?.error?.message) message = errJson.error.message;
    } catch {
      // ignore — fall back to generic message below
    }
    if (res.status === 401) {
      message = "Invalid API key. Check the key saved in the extension's options page.";
    } else if (res.status === 429) {
      message = "Rate limited by the Anthropic API. Wait a moment and try again.";
    }
    throw new UserFacingError(message);
  }

  const data = await res.json();
  const text = (data.content || [])
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n")
    .trim();

  return parseClaims(text);
}

function parseClaims(rawText) {
  let jsonText = rawText.trim();
  // Defensive: strip ```json fences if the model adds them anyway.
  const fenceMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenceMatch) jsonText = fenceMatch[1].trim();

  let parsed;
  try {
    parsed = JSON.parse(jsonText);
  } catch (err) {
    throw new UserFacingError(
      "Claude's response couldn't be parsed as JSON. Try running the check again."
    );
  }

  if (!Array.isArray(parsed)) {
    throw new UserFacingError("Unexpected response format from Claude.");
  }

  return parsed
    .filter((item) => item && typeof item.claim === "string")
    .map((item) => ({
      claim: item.claim.trim(),
      verdict: VALID_VERDICTS.has(item.verdict) ? item.verdict : "Unverified",
      explanation:
        typeof item.explanation === "string" ? item.explanation.trim() : "",
      sources: Array.isArray(item.sources)
        ? item.sources
            .filter((s) => s && typeof s.url === "string")
            .map((s) => ({
              title: typeof s.title === "string" && s.title.trim() ? s.title.trim() : s.url,
              url: s.url
            }))
        : []
    }));
}
