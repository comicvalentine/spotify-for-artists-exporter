(() => {
  const exporter = globalThis.SFAExporter;
  const extractors = {
    listeners: exporter.extractListeners,
    streams: exporter.extractStreams,
    followers: exporter.extractFollowers
  };

  chrome.runtime.onMessage.addListener((message, _sender, respond) => {
    if (message?.type !== "SFA_EXTRACT") return false;
    try {
      const result = Object.fromEntries(
        message.metrics.map((metric) => [metric, extractors[metric]?.() ?? []])
      );
      respond({ ok: true, data: result, title: document.title, url: location.href });
    } catch (error) {
      respond({ ok: false, error: error instanceof Error ? error.message : String(error) });
    }
    return false;
  });
})();
