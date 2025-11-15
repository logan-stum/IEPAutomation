// src/pages/Dashboard.jsx
import React, { useMemo } from 'react';
import useStudents from '../hooks/useStudents';
import useAccommodations from '../hooks/useAccommodations';
import useLogs from '../hooks/useLogs';
import StudentCard from '../components/StudentCard';
import LogList from '../components/LogList';

function parseLogTime(log) {
  // Accept many timestamp field shapes and return a Number
  if (!log) return 0;
  if (log.timestamp) return Number(log.timestamp);
  if (log.createdAt) return Number(log.createdAt);
  if (log.date) {
    // date could be ISO string or YYYY-MM-DD
    const n = Date.parse(log.date);
    return Number.isNaN(n) ? 0 : n;
  }
  return 0;
}

export default function Dashboard() {
  const students = useStudents() || [];
  const accommodations = useAccommodations() || [];
  const { logs = [] } = useLogs(); // <-- fix here

  // counts
  const studentCount = students.length;
  const accommodationCount = accommodations.length;

  const logsTodayCount = useMemo(() => {
    const today = new Date().toDateString();
    return logs.filter(l => {
      const t = parseLogTime(l);
      if (!t) return false;
      return new Date(t).toDateString() === today;
    }).length;
  }, [logs]);
  
  const recentLogs = useMemo(() => {
    return [...logs].sort((a, b) => parseLogTime(b) - parseLogTime(a)).slice(0, 8);
  }, [logs]);


  // overdue students: last modified/updated more than 30 days ago or never updated
  const overdueStudents = useMemo(() => {
    const THIRTY_DAYS_MS = 1000 * 60 * 60 * 24 * 30;
    const now = Date.now();
    return students.filter(s => {
      const maybe = s.modifiedOn ?? s.updatedAt ?? s.lastUpdated ?? s.modified ?? null;
      if (!maybe) return true; // never updated -> overdue
      const t = Number(maybe);
      if (Number.isNaN(t)) return true;
      return now - t > THIRTY_DAYS_MS;
    });
  }, [students]);

  // a handful of students for the quick view
  const quickStudents = students.slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="text-sm text-gray-500">Overview & quick actions</div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow flex flex-col">
          <div className="text-sm text-gray-500">Students</div>
          <div className="mt-4 text-3xl font-semibold">{studentCount}</div>
          <div className="mt-2 text-xs text-gray-400">Total students in the system</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow flex flex-col">
          <div className="text-sm text-gray-500">Accommodations</div>
          <div className="mt-4 text-3xl font-semibold">{accommodationCount}</div>
          <div className="mt-2 text-xs text-gray-400">Available accommodation types</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow flex flex-col">
          <div className="text-sm text-gray-500">Logs (today)</div>
          <div className="mt-4 text-3xl font-semibold">{logsTodayCount}</div>
          <div className="mt-2 text-xs text-gray-400">Accommodation deliveries logged today</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: Recent Activity */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Activity</h2>
            <div className="text-sm text-gray-500">Latest logs</div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            {recentLogs.length === 0 ? (
              <p className="text-gray-500">No recent activity.</p>
            ) : (
              // reuse LogList but pass sliced logs
              <LogList logs={recentLogs} />
            )}
          </div>
        </div>

        {/* RIGHT: Overdue Students */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Overdue Students</h2>
            <div className="text-sm text-gray-500">Not updated in 30+ days</div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            {overdueStudents.length === 0 ? (
              <p className="text-gray-500">No students need attention.</p>
            ) : (
              <ul className="space-y-3">
                {overdueStudents.slice(0, 8).map(s => (
                  <li key={s.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium">{s.name}</div>
                      <div className="text-xs text-gray-500">
                        Last updated:{" "}
                        { (s.modifiedOn || s.updatedAt || s.lastUpdated || s.modified)
                          ? new Date(s.modifiedOn ?? s.updatedAt ?? s.lastUpdated ?? s.modified).toLocaleDateString()
                          : 'Never' }
                      </div>
                    </div>
                    <div className="text-sm">
                      <button
                        className="text-blue-600 hover:underline"
                        onClick={() => {
                          // navigate to student detail. Try to use location change
                          // If you use react-router, replace with navigate(`/students/${s.id}`)
                          window.location.href = `/students/${s.id}`;
                        }}
                      >
                        View
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Quick students grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Students (Quick View)</h2>
          <div className="text-sm text-gray-500">Click a student to view detail</div>
        </div>

        {quickStudents.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow text-gray-500">No students yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {quickStudents.map(s => (
              <div key={s.id} className="cursor-pointer" onClick={() => (window.location.href = `/students/${s.id}`)}>
                <StudentCard student={s} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
