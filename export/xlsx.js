globalThis.SFAExportFormats ??= {};

(() => {
  const encoder = new TextEncoder();
  const xmlEscape = (value) => String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;"
  })[char]);

  function crc32(bytes) {
    let crc = -1;
    for (const byte of bytes) {
      crc ^= byte;
      for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
    return (crc ^ -1) >>> 0;
  }

  const u16 = (value) => new Uint8Array([value & 255, (value >>> 8) & 255]);
  const u32 = (value) => new Uint8Array([value & 255, (value >>> 8) & 255, (value >>> 16) & 255, (value >>> 24) & 255]);
  const join = (parts) => {
    const output = new Uint8Array(parts.reduce((sum, part) => sum + part.length, 0));
    let offset = 0;
    for (const part of parts) { output.set(part, offset); offset += part.length; }
    return output;
  };

  function zip(files) {
    const local = [];
    const central = [];
    let offset = 0;
    for (const [name, content] of Object.entries(files)) {
      const nameBytes = encoder.encode(name);
      const data = encoder.encode(content);
      const checksum = crc32(data);
      const header = join([u32(0x04034b50), u16(20), u16(0), u16(0), u16(0), u16(0), u32(checksum), u32(data.length), u32(data.length), u16(nameBytes.length), u16(0), nameBytes]);
      local.push(header, data);
      central.push(join([u32(0x02014b50), u16(20), u16(20), u16(0), u16(0), u16(0), u16(0), u32(checksum), u32(data.length), u32(data.length), u16(nameBytes.length), u16(0), u16(0), u16(0), u16(0), u32(0), u32(offset), nameBytes]));
      offset += header.length + data.length;
    }
    const centralSize = central.reduce((sum, part) => sum + part.length, 0);
    return join([...local, ...central, u32(0x06054b50), u16(0), u16(0), u16(central.length), u16(central.length), u32(centralSize), u32(offset), u16(0)]);
  }

  function worksheet(rows) {
    const headers = [...new Set(rows.flatMap(Object.keys))];
    const table = [headers, ...rows.map((row) => headers.map((header) => row[header]))];
    const body = table.map((row, rowIndex) => `<row r="${rowIndex + 1}">${row.map((value, columnIndex) => {
      const ref = `${String.fromCharCode(65 + columnIndex)}${rowIndex + 1}`;
      return typeof value === "number"
        ? `<c r="${ref}"><v>${value}</v></c>`
        : `<c r="${ref}" t="inlineStr"><is><t>${xmlEscape(value ?? "")}</t></is></c>`;
    }).join("")}</row>`).join("");
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${body}</sheetData></worksheet>`;
  }

  globalThis.SFAExportFormats.xlsx = (payload) => {
    const entries = Object.entries(payload.data).filter(([, rows]) => rows.length);
    const sheets = entries.length ? entries : [["data", []]];
    const files = {
      "[Content_Types].xml": `<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>${sheets.map((_, index) => `<Override PartName="/xl/worksheets/sheet${index + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join("")}</Types>`,
      "_rels/.rels": `<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`,
      "xl/workbook.xml": `<?xml version="1.0" encoding="UTF-8"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>${sheets.map(([name], index) => `<sheet name="${xmlEscape(name)}" sheetId="${index + 1}" r:id="rId${index + 1}"/>`).join("")}</sheets></workbook>`,
      "xl/_rels/workbook.xml.rels": `<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${sheets.map((_, index) => `<Relationship Id="rId${index + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${index + 1}.xml"/>`).join("")}</Relationships>`
    };
    sheets.forEach(([, rows], index) => { files[`xl/worksheets/sheet${index + 1}.xml`] = worksheet(rows); });
    return new Blob([zip(files)], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  };
})();
