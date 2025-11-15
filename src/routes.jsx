import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import StudentDetail from './pages/StudentDetails';
import Logs from './pages/Logs';
import ManageAccommodations from './pages/ManageAccommodations';
import Settings from './pages/Settings';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/students" element={<Students />} />
      <Route path="/students/:id" element={<StudentDetail />} />
      <Route path="/logs" element={<Logs />} />
      <Route path="/manage-accommodations" element={<ManageAccommodations />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}
