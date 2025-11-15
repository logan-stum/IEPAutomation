import React from 'react';

export default function AccommodationBadge({ accommodation }) {
  return (
    <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
      {accommodation.name}
    </span>
  );
}
