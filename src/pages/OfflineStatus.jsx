import React, { useEffect, useState } from 'react';

export default function OfflineStatus() {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className={`text-white p-2 text-center ${online ? 'bg-green-500' : 'bg-red-500'}`}>
      {online ? 'Online' : 'Offline'}
    </div>
  );
}
