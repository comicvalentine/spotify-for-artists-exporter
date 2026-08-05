(() => {
  globalThis.SFAExporter.extractFollowers = (root = document) =>
    globalThis.SFAExporter.extractMetric("followers", root);
})();
