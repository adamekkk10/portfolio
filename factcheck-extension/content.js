// Injected on demand (via chrome.scripting.executeScript) to pull the
// readable text out of the current page. The completion value of this
// IIFE is returned to the background script as the injection result.
(() => {
  const MAX_CHARS = 15000;

  // Elements that never carry the "real" content of a page.
  const NOISE_SELECTOR = [
    "nav", "header", "footer", "aside",
    "script", "style", "noscript", "template", "svg",
    "form", "iframe", "button",
    "[role='navigation']", "[role='banner']", "[role='contentinfo']",
    "[aria-hidden='true']"
  ].join(",");

  function textLength(el) {
    return (el.innerText || "").trim().length;
  }

  // Prefer explicit semantic containers first — cheap and usually correct.
  function findSemanticContainer() {
    const candidates = [
      ...document.querySelectorAll("article"),
      ...document.querySelectorAll("main"),
      ...document.querySelectorAll("[role='main']")
    ];
    if (candidates.length === 0) return null;
    // Pick whichever has the most visible text.
    return candidates.reduce((best, el) =>
      textLength(el) > textLength(best) ? el : best
    );
  }

  // Fallback: score every block-level element by its own (non-nested-noise)
  // text length and pick the largest — a simplified "largest text block"
  // readability heuristic.
  function findLargestTextBlock() {
    const blocks = document.querySelectorAll(
      "div, section, td, li, p, article, main"
    );
    let best = null;
    let bestScore = 0;
    for (const el of blocks) {
      if (el.closest(NOISE_SELECTOR)) continue;
      const clone = el.cloneNode(true);
      clone.querySelectorAll(NOISE_SELECTOR).forEach((n) => n.remove());
      const score = (clone.innerText || "").trim().length;
      if (score > bestScore) {
        bestScore = score;
        best = el;
      }
    }
    return best;
  }

  function extractText() {
    if (!document.body) return "";

    let container = findSemanticContainer();
    if (!container || textLength(container) < 200) {
      const fallback = findLargestTextBlock();
      if (fallback && textLength(fallback) > textLength(container || document.createElement("div"))) {
        container = fallback;
      }
    }
    if (!container) container = document.body;

    const clone = container.cloneNode(true);
    clone.querySelectorAll(NOISE_SELECTOR).forEach((n) => n.remove());

    let text = (clone.innerText || clone.textContent || "")
      .replace(/[ \t]+/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    if (text.length > MAX_CHARS) {
      text = text.slice(0, MAX_CHARS);
    }

    return {
      url: location.href,
      title: document.title,
      text
    };
  }

  return extractText();
})();
