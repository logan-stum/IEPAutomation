import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const links = [
    { name: 'Dashboard', path: '/' },
    { name: 'Students', path: '/students' },
    { name: 'Logs', path: '/logs' },
    { name: 'Manage Accommodations', path: '/manage-accommodations' },
    { name: 'Settings', path: '/settings' },
  ];

  return (
    <div className="w-64 bg-white border-r shadow-md flex flex-col">
      <div className="text-2xl font-bold p-6 border-b">IEP App</div>
      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `block px-4 py-2 rounded hover:bg-gray-100 ${
                isActive ? 'bg-gray-200 font-bold' : ''
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t text-sm text-gray-500">© 2025 IEP App</div>
    </div>
  );
}
