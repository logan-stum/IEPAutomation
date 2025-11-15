// src/hooks/useRefresh.js
import { useContext } from 'react';
import { RefreshContext } from '../context/RefreshContext';

export default function useRefresh() {
  const ctx = useContext(RefreshContext);
  if (!ctx) throw new Error("useRefresh must be used inside a RefreshProvider");
  return ctx;
}
