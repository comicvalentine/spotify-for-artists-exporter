(() => {
  globalThis.SFAExporter.extractListeners = (root = document) =>
    globalThis.SFAExporter.extractMetric("listeners", root);
})();
