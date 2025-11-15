import React, { createContext } from 'react';
import { getDb } from '../db/index.js';

export const DBContext = createContext();

export function DBContextProvider({ children }) {
  const value = { db: getDb() };
  return <DBContext.Provider value={value}>{children}</DBContext.Provider>;
}
