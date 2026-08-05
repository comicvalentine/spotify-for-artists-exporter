globalThis.SFAPopupUtils = {
  rowsToCsv(rows) {
    if (!rows.length) return "";
    const headers = [...new Set(rows.flatMap(Object.keys))];
    const escape = (value) => {
      const text = value == null ? "" : String(value);
      return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
    };
    return [headers, ...rows.map((row) => headers.map((key) => row[key]))]
      .map((row) => row.map(escape).join(",")).join("\r\n");
  },
  safeFilename(value) {
    return value.replace(/[^a-z0-9._-]+/gi, "-").replace(/^-|-$/g, "").toLowerCase();
  }
};
