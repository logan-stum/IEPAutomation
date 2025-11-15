// src/hooks/useSearch.js
import { useMemo } from 'react';

export default function useSearch(items = [], query = '', keys = []) {
  return useMemo(() => {
    if (!query || query.trim() === '') return items;
    const q = query.toLowerCase();
    return items.filter(item =>
      keys.some(k => {
        const v = item[k];
        if (v == null) return false;
        return String(v).toLowerCase().includes(q);
      })
    );
  }, [items, query, keys]);
}
