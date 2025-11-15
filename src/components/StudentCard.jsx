import React from "react";
import { removeAccommodationFromStudent } from "../db/students";
import { useRefresh } from "../context/RefreshContext";

export default function StudentCard({ student }) {
  const { triggerRefresh } = useRefresh();

  const handleRemoveAcc = async (accId) => {
    if (!window.confirm("Remove this accommodation from the student?")) return;
    try {
      await removeAccommodationFromStudent(student.id, accId);
      triggerRefresh(); // refresh the students list
    } catch (err) {
      console.error("Failed to remove accommodation:", err);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow space-y-2">
      <p className="font-bold">{student.name}</p>
      <p className="text-sm text-gray-500">Grade: {student.grade}</p>

      {student.accommodations?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {student.accommodations.map(acc => (
            <div key={acc.id} className="px-2 py-1 bg-blue-100 rounded flex items-center gap-1">
              <span>{acc.name}</span>
              <button
                className="text-red-600 hover:text-red-800 text-xs"
                onClick={() => handleRemoveAcc(acc.id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
