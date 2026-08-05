const button = document.querySelector("#export");
const status = document.querySelector("#status");

function setStatus(message, error = false) {
  status.textContent = message;
  status.classList.toggle("error", error);
}

function selectSources(data, mode) {
  if (mode === "all") return data;
  const wanted = /active|programmed/i;
  return Object.fromEntries(Object.entries(data).map(([metric, rows]) => [
    metric,
    rows.map((row) => Object.fromEntries(
      Object.entries(row).filter(([key]) => key === "date" || wanted.test(key))
    )).filter((row) => Object.keys(row).length > 1)
  ]));
}

button.addEventListener("click", async () => {
  const metrics = [...document.querySelectorAll('input[name="metric"]:checked')].map(({ value }) => value);
  if (!metrics.length) return setStatus("Select at least one metric.", true);

  button.disabled = true;
  setStatus("Reading visible charts…");
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id || !tab.url?.startsWith("https://artists.spotify.com/")) {
      throw new Error("Open a Spotify for Artists analytics page first.");
    }
    const response = await chrome.tabs.sendMessage(tab.id, { type: "SFA_EXTRACT", metrics });
    if (!response?.ok) throw new Error(response?.error || "Could not read this page.");
    const data = selectSources(response.data, document.querySelector("#sources").value);
    if (!Object.values(data).some((rows) => rows.length)) {
      throw new Error("No matching visible chart data was found. Open a chart and try again.");
    }

    const format = document.querySelector("#format").value;
    const payload = { exportedAt: new Date().toISOString(), page: { title: response.title, url: response.url }, data };
    const blob = globalThis.SFAExportFormats[format](payload);
    const url = URL.createObjectURL(blob);
    const date = new Date().toISOString().slice(0, 10);
    await chrome.downloads.download({ url, filename: `spotify-for-artists-${date}.${format}`, saveAs: false });
    setTimeout(() => URL.revokeObjectURL(url), 30_000);
    setStatus("Download started.");
  } catch (error) {
    setStatus(error instanceof Error ? error.message : String(error), true);
  } finally {
    button.disabled = false;
  }
});
