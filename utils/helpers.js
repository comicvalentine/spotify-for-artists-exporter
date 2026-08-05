(() => {
  const namespace = globalThis.SFAExporter ??= {};

  function parseNumber(value) {
    const number = Number(String(value).replaceAll(",", ""));
    return Number.isFinite(number) ? number : null;
  }

  function normalizeDate(value) {
    const match = value.match(/^([A-Za-z]+)\s+(\d{1,2})(?:,)?\s+(\d{4})/);
    return match ? `${match[1]} ${match[2]}, ${match[3]}` : value.trim();
  }

  function escapeCsv(value) {
    const text = value == null ? "" : String(value);
    return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
  }

  function rowsToCsv(rows) {
    if (!rows.length) return "";
    const headers = [...new Set(rows.flatMap(Object.keys))];
    return [headers, ...rows.map((row) => headers.map((key) => row[key]))]
      .map((row) => row.map(escapeCsv).join(","))
      .join("\r\n");
  }

  function safeFilename(value) {
    return value.replace(/[^a-z0-9._-]+/gi, "-").replace(/^-|-$/g, "").toLowerCase();
  }

  Object.assign(namespace, { parseNumber, normalizeDate, rowsToCsv, safeFilename });
})();
