# Codex Instructions

## Project
Spotify for Artists Data Exporter

### Goal
Build a Chrome extension that exports Spotify for Artists analytics data into machine-readable formats (JSON, CSV, XLSX).

The extension should reuse and gradually replace the existing browser-console script (`SFA_script.js`).

---

## Current status

- `SFA_script.js` successfully extracts several charts by querying the DOM.
- The extraction logic currently runs manually in the browser console.
- The next step is wrapping this logic into a Chrome Extension.

---

## Expected user flow

1. Open any Spotify for Artists analytics page.
2. Select which metrics to export.
3. (Optional) Select stream sources (Active, Programmed, etc.).
4. Choose output format:
   - JSON
   - CSV
   - XLSX
5. Click **Export**.
6. Download starts immediately.

---

## Design principles

- Do not rely on Spotify private APIs unless absolutely necessary.
- Prefer DOM parsing over network interception.
- Keep extraction logic independent from UI.
- Write reusable functions.
- Avoid duplicate DOM queries.
- Reuse existing SFA_script.js whenever possible.


---

## Proposed Architecture

```text
spotify-exporter/
├── manifest.json
├── content.js               # Injected into Spotify for Artists
├── popup/
│   ├── popup.html
│   └── popup.js
├── extractors/
│   ├── audience.js
│   ├── listeners.js
│   └── streams.js
├── export/
│   ├── json.js
│   ├── csv.js
│   └── xlsx.js
└── utils/
    └── helpers.js
```
---

## Coding style

- Use modern JavaScript (ES2022).
- Prefer small pure functions.
- Avoid global variables.
- Add comments only when the logic is non-obvious.
