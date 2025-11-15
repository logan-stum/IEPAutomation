import { getDb } from '../db/index.js';

export default async function useIndexedDB() {
  return await getDb();
}
