(() => {
  globalThis.SFAExporter.extractStreams = (root = document) =>
    globalThis.SFAExporter.extractMetric("streams", root);
})();
