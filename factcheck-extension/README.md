# FactCheck

A Chrome extension (Manifest V3) that fact-checks the visible content of the
current webpage on demand, using the Claude API with web search enabled.

## How it works

1. Click the FactCheck icon while on any webpage.
2. The content script extracts the page's readable text (prefers `<article>`
   / `<main>`, falls back to the largest text block on the page).
3. The background service worker sends that text to the Anthropic Messages
   API (`claude-sonnet-4-6`, with the `web_search_20250305` tool enabled) and
   asks it to identify factual claims, verify each one against live web
   search results, and return a verdict.
4. Results render in the Chrome side panel: one card per claim, with a
   color-coded verdict badge (True / False / Misleading / Unverified), a
   short explanation, and links to the sources used.

## File structure

```
factcheck-extension/
├── manifest.json      # MV3 manifest — permissions, side panel, options page
├── background.js      # Service worker: extraction trigger, API call, state
├── content.js          # Injected on demand to extract readable page text
├── sidepanel.html/css/js  # Side panel UI (results list, states)
├── options.html/css/js    # Options page for the Anthropic API key
└── icons/              # Toolbar/extension icons
```

## Install (load unpacked)

1. Open `chrome://extensions` in Chrome.
2. Turn on **Developer mode** (top-right toggle).
3. Click **Load unpacked** and select the `factcheck-extension/` folder.
4. Click the FactCheck icon in the toolbar once to pin it, then click it
   again — it'll prompt you to set an API key on first use if none is set.
5. Open the extension's **options page** (right-click the icon → Options, or
   `chrome://extensions` → FactCheck → Details → Extension options) and
   paste in an Anthropic API key from
   [console.anthropic.com](https://console.anthropic.com/settings/keys).
6. Navigate to any article/webpage and click the FactCheck icon. Results
   appear in the side panel.

## API key handling

- The key is stored only in `chrome.storage.local`, scoped to your browser
  profile. It is never hardcoded or bundled with the extension.
- It's sent directly from your browser to `api.anthropic.com` when you run a
  check — never to any third-party server.
- Clearing the key on the options page or uninstalling the extension removes
  it permanently.

## Notes / limitations

- Browser-internal pages (`chrome://`, the Chrome Web Store, etc.) can't be
  scanned — extensions aren't allowed to inject scripts into them.
- The text-extraction heuristic is intentionally simple (semantic tags first,
  then a largest-text-block fallback); it won't be perfect on every page
  layout.
- Each check makes one Anthropic API call with server-side web search (up to
  8 searches), which consumes your API credits.
