// src/context/RefreshContext.jsx
import React, { createContext, useState, useCallback } from "react";

export const RefreshContext = createContext();

export const RefreshProvider = ({ children }) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return (
    <RefreshContext.Provider value={{ refreshKey, triggerRefresh }}>
      {children}
    </RefreshContext.Provider>
  );
};

// Hook for convenience
export const useRefresh = () => React.useContext(RefreshContext);
