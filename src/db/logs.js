// src/db/logs.js
import { getDb } from "./index";

export async function getAllLogs() {
  const db = await getDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("logs", "readonly");
    const store = tx.objectStore("logs");
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function addLog(log) {
  const db = await getDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("logs", "readwrite");
    const store = tx.objectStore("logs");
    const req = store.add({ ...log, id: log.id || Date.now().toString() });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function updateLog(id, data) {
  const db = await getDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("logs", "readwrite");
    const store = tx.objectStore("logs");
    const req = store.get(id);
    req.onsuccess = () => {
      const log = req.result;
      Object.assign(log, data);
      const updateReq = store.put(log);
      updateReq.onsuccess = () => resolve(updateReq.result);
      updateReq.onerror = () => reject(updateReq.error);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function deleteLog(id) {
  const db = await getDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("logs", "readwrite");
    const store = tx.objectStore("logs");
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}
