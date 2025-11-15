// src/utils/exportCsv.js
export default function exportCsv(filename = 'export.csv', rows = [], headers = []) {
  // rows: array of objects
  const keys = headers.length ? headers : (rows[0] ? Object.keys(rows[0]) : []);
  const csv = [
    keys.join(','),
    ...rows.map(r =>
      keys.map(k => {
        const v = r[k] === undefined || r[k] === null ? '' : String(r[k]);
        // escape quotes
        return `"${v.replace(/"/g, '""')}"`;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
