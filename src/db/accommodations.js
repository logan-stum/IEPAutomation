// src/db/accommodations.js
import { getDb } from './index';
import { addLog } from './logs';

export async function getAllAccommodations() {
  const db = await getDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('accommodations', 'readonly');
    const store = tx.objectStore('accommodations');
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function addAccommodation(acc) {
  const now = Date.now();
  const payload = { ...acc, createdOn: now, modifiedOn: now, isActive: true };
  const db = await getDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('accommodations', 'readwrite');
    const store = tx.objectStore('accommodations');
    const req = store.add(payload);
    req.onsuccess = async () => {
      try {
        await addLog({
          id: `log-${Date.now().toString()}`,
          type: 'accommodation:add',
          accommodationId: payload.id,
          message: `Added accommodation ${payload.name}`,
          timestamp: Date.now()
        });
      } catch (e) { console.warn(e); }
      resolve(req.result);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function updateAccommodation(acc) {
  const payload = { ...acc, modifiedOn: Date.now() };
  const db = await getDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('accommodations', 'readwrite');
    const store = tx.objectStore('accommodations');
    const req = store.put(payload);
    req.onsuccess = async () => {
      try {
        await addLog({
          id: `log-${Date.now().toString()}`,
          type: 'accommodation:update',
          accommodationId: payload.id,
          message: `Updated accommodation ${payload.name}`,
          timestamp: Date.now()
        });
      } catch (e) { console.warn(e); }
      resolve(req.result);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function deleteAccommodation(id) {
  const db = await getDb();
  // read for message
  const existing = await new Promise((resolve) => {
    const tx = db.transaction('accommodations', 'readonly');
    const r = tx.objectStore('accommodations').get(id);
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => resolve(null);
  });

  return new Promise((resolve, reject) => {
    const tx = db.transaction('accommodations', 'readwrite');
    const store = tx.objectStore('accommodations');
    const req = store.delete(id);
    req.onsuccess = async () => {
      try {
        await addLog({
          id: `log-${Date.now().toString()}`,
          type: 'accommodation:delete',
          accommodationId: id,
          message: `Deleted accommodation ${existing?.name || id}`,
          timestamp: Date.now()
        });
      } catch (e) { console.warn(e); }
      resolve();
    };
    req.onerror = () => reject(req.error);
  });
}
