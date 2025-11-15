// src/utils/importCsv.js
export function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length === 0) return [];
  const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim());
  const rows = lines.slice(1).map(line => {
    // naive split by comma, better libraries exist but this is simple
    const cols = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
    const obj = {};
    cols.forEach((c, i) => {
      let v = c.trim();
      if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1).replace(/""/g, '"');
      obj[headers[i]] = v;
    });
    return obj;
  });
  return rows;
}
