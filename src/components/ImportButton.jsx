// src/components/ImportButton.jsx
import React from 'react';
import { parseCsv } from '../utils/importCsv';

export default function ImportButton({ onImport }) {
  const handleFile = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const text = await f.text();
    const rows = parseCsv(text);
    onImport(rows);
  };

  return (
    <label className="px-3 py-1 bg-gray-200 rounded cursor-pointer">
      Import CSV
      <input type="file" accept=".csv" className="hidden" onChange={handleFile} />
    </label>
  );
}
