(() => {
  const namespace = globalThis.SFAExporter ??= {};

  function labels(root = document) {
    return [...root.querySelectorAll("rect[aria-label]")]
      .map((element) => element.getAttribute("aria-label")?.trim())
      .filter(Boolean);
  }

  function parseTotal(label, metric) {
    const match = label.match(new RegExp(`^(.+?),\\s*([\\d,]+)\\s+${metric}$`, "i"));
    if (!match) return null;
    return { date: match[1].trim(), value: namespace.parseNumber(match[2]) };
  }

  function parseSources(label, metric) {
    const dateMatch = label.match(/^([A-Za-z]+)\s+(\d{1,2})(?:,)?\s+(\d{4})/);
    if (!dateMatch) return null;
    const date = namespace.normalizeDate(dateMatch[0]);
    const rest = label.slice(dateMatch[0].length).trim().replace(/^,\s*/, "");
    const pattern = new RegExp(`(?:^|,\\s*)(.+?)\\s+([\\d,]+)\\s+${metric}(?=,|$)`, "gi");
    const sources = {};
    for (const match of rest.matchAll(pattern)) {
      sources[match[1].trim()] = namespace.parseNumber(match[2]);
    }
    return Object.keys(sources).length ? { date, ...sources } : null;
  }

  function extractMetric(metric, root = document) {
    const allLabels = labels(root);
    const sourced = allLabels.map((label) => parseSources(label, metric)).filter(Boolean);
    if (sourced.length) return sourced;
    return allLabels.map((label) => parseTotal(label, metric)).filter(Boolean)
      .map(({ date, value }) => ({ date, [metric]: value }));
  }

  Object.assign(namespace, { labels, parseTotal, parseSources, extractMetric });
})();
