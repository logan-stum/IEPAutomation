import React from 'react';

export default function LogList({ logs }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-2">
      {logs.map(log => (
        <div key={log.id} className="flex justify-between items-center border-b last:border-b-0 pb-2">
          <div>
            <p className="font-medium">{log.studentName}</p>
            <p className="text-gray-500 text-sm">
              {log.accommodationName} — {new Date(log.timestamp).toLocaleString()}
            </p>
          </div>
          {log.completed && <span className="text-green-600 font-bold">✓</span>}
        </div>
      ))}
    </div>
  );
}
