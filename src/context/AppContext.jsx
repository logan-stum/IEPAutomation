import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export function AppContextProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const value = { theme, setTheme };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
