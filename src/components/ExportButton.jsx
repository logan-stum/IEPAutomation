// src/components/ExportButton.jsx
import React from 'react';
import exportCsv from '../utils/exportCsv';

export default function ExportButton({ rows, filename = 'export.csv', headers = [] }) {
  return (
    <button
      className="px-3 py-1 bg-gray-200 rounded"
      onClick={() => exportCsv(filename, rows, headers)}
    >
      Export CSV
    </button>
  );
}
