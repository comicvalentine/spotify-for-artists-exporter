globalThis.SFAExportFormats ??= {};
globalThis.SFAExportFormats.json = (payload) =>
  new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
