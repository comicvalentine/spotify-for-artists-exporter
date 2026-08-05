globalThis.SFAExportFormats ??= {};
globalThis.SFAExportFormats.csv = (payload) => {
  const rows = Object.entries(payload.data).flatMap(([metric, values]) =>
    values.map((row) => ({ metric, ...row }))
  );
  return new Blob(["\uFEFF", globalThis.SFAPopupUtils.rowsToCsv(rows)], {
    type: "text/csv;charset=utf-8"
  });
};
