// src/hooks/useLogs.js
import { useEffect, useState } from "react";
import { getAllLogs, addLog as dbAddLog, updateLog as dbUpdateLog, deleteLog as dbDeleteLog } from "../db/logs";
import { useRefresh } from "../context/RefreshContext";

export default function useLogs() {
  const { refreshKey } = useRefresh();
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    getAllLogs().then(setLogs);
  }, [refreshKey]);

  const addLog = async (log) => {
    await dbAddLog(log);
  };

  const updateLog = async (id, data) => {
    await dbUpdateLog(id, data);
  };

  const deleteLog = async (id) => {
    await dbDeleteLog(id);
  };

  return { logs, addLog, updateLog, deleteLog };
}
