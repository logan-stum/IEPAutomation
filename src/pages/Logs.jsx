import React, { useState } from "react";
import useLogs from "../hooks/useLogs";
import useStudents from "../hooks/useStudents";
import { useRefresh } from "../context/RefreshContext";

export default function Logs() {
  const { refreshKey, triggerRefresh } = useRefresh();
  const students = useStudents() || []; // default to empty array
  const { logs = [], addLog, updateLog, deleteLog } = useLogs() || {};

  const [form, setForm] = useState({ id: null, studentId: "", message: "" });
  const [quickMessage, setQuickMessage] = useState("");

  // Students overdue for updates
  const overdueStudents = (students || []).filter((s) => {
    if (!s.updatedAt) return true;
    return Date.now() - s.updatedAt > 1000 * 60 * 60 * 24 * 30;
  });

async function handleSubmit(e) {
  e.preventDefault();
  if (!form.studentId || !form.message) return;

  if (form.id) {
    await updateLog(form.id, {
      studentId: form.studentId,
      message: form.message,
      updatedAt: Date.now(),
    });
  } else {
    await addLog({
      studentId: form.studentId,
      message: form.message,
      createdAt: Date.now(),
    });
  }

  setForm({ id: null, studentId: "", message: "" });
  triggerRefresh(); // <-- this ensures the UI updates
}

  function startEdit(log) {
    setForm({
      id: log.id,
      studentId: log.studentId,
      message: log.message,
    });
  }

  async function handleQuickLog(studentId) {
  if (!quickMessage.trim()) return;

  await addLog({
    studentId,
    message: quickMessage,
    createdAt: Date.now(),
  });

  setQuickMessage("");
  triggerRefresh();
}


  return (
    <div className="space-y-8">
      {/* Overdue Students */}
      <div className="bg-red-50 p-4 rounded-xl border border-red-200 shadow">
        <h2 className="text-lg font-semibold text-red-700">
          ⚠ Overdue Students
        </h2>
        {overdueStudents.length === 0 ? (
          <p className="text-sm text-red-600 mt-2">No overdue students.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {overdueStudents.map((s) => (
              <li
                key={s.id}
                className="p-3 bg-white rounded-lg shadow-sm border flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{s.name}</p>
                  <p className="text-xs text-gray-500">
                    Last updated:{" "}
                    {s.updatedAt
                      ? new Date(s.updatedAt).toLocaleDateString()
                      : "Never"}
                  </p>
                </div>
                <button
                  className="text-blue-600 hover:underline text-sm"
                  onClick={() =>
                    setForm({ id: null, studentId: s.id, message: "" })
                  }
                >
                  Add Log
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add/Edit Log Form */}
      <div className="bg-white p-6 rounded-xl shadow border">
        <h2 className="text-xl font-semibold mb-4">
          {form.id ? "Edit Log" : "Add Log"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Student
            </label>
            <select
              className="mt-1 w-full border-gray-300 rounded-lg"
              value={form.studentId}
              onChange={(e) =>
                setForm({ ...form, studentId: e.target.value })
              }
            >
              <option value="">Select student...</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Log Message</label>
            <textarea
              className="mt-1 w-full border rounded-lg p-2 h-24"
              value={form.message}
              onChange={(e) =>
                setForm({ ...form, message: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {form.id ? "Save Changes" : "Add Log"}
          </button>
        </form>
      </div>

      {/* Quick Log */}
      <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 shadow">
        <h2 className="text-lg font-semibold text-blue-700">⚡ Quick Log</h2>

        <input
          placeholder="Enter quick message..."
          className="border rounded-lg p-2 w-full mt-3"
          value={quickMessage}
          onChange={(e) => setQuickMessage(e.target.value)}
        />

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {students.map((s) => (
            <button
              key={s.id}
              className="bg-white px-3 py-2 rounded-lg shadow border hover:bg-blue-100"
              onClick={() => handleQuickLog(s.id)}
            >
              Quick Log for {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Logs List */}
      <div className="bg-white p-6 rounded-xl shadow border">
        <h2 className="text-xl font-semibold mb-4">All Logs</h2>
        <div className="space-y-3">
          {(logs || []).map((log) => {
            const student = students.find((s) => s.id === log.studentId);
            return (
              <div
                key={log.id}
                className="p-4 bg-gray-50 rounded-lg border shadow-sm flex justify-between"
              >
                <div>
                  <p className="font-medium">{student?.name || "Unknown Student"}</p>
                  <p className="text-gray-700">{log.message}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(log.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="space-x-3">
                  <button
                    onClick={() => startEdit(log)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={async () => {
                      await deleteLog(log.id);
                      triggerRefresh();
                    }}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
