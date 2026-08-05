# Spotify for Artists Data Exporter

A Chrome extension that exports data from visible Spotify for Artists analytics charts as JSON, CSV, or XLSX.

## Install the draft

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked** and select this directory.
4. Open a Spotify for Artists analytics page and make the desired chart visible.
5. Open the extension, select metrics, an optional source filter, and a format, then click **Export**.

The extension reads accessible labels from the rendered page. It does not call Spotify private APIs, and it can only export data currently present in the DOM.
