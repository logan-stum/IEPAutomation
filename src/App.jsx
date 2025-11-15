import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Logs from "./pages/Logs";
import ManageAccommodations from "./pages/ManageAccommodations";
import Settings from "./pages/Settings";
import Sidebar from "./components/Sidebar";
import OfflineStatus from "./pages/OfflineStatus";
import { RefreshProvider } from "./context/RefreshContext";

export default function App() {
  return (
    <RefreshProvider>
      <Router>
        <div className="flex h-screen bg-gray-100">
          {/* Sidebar */}
          <Sidebar />

          {/* Main content */}
          <div className="flex-1 flex flex-col">
            {/* Offline status */}
            <OfflineStatus />

            {/* Page content */}
            <main className="flex-1 overflow-y-auto p-6">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/students" element={<Students />} />
                <Route path="/logs" element={<Logs />} />
                <Route
                  path="/manage-accommodations"
                  element={<ManageAccommodations />}
                />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </RefreshProvider>
  );
}
