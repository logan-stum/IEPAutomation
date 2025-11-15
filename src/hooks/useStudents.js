// src/hooks/useStudents.js
import { useEffect, useState } from "react";
import { getAllStudents } from "../db/students";
import { useRefresh } from "../context/RefreshContext";

export default function useStudents() {
  const [students, setStudents] = useState([]);
  const { refreshKey } = useRefresh();

  useEffect(() => {
    getAllStudents().then(setStudents);
  }, [refreshKey]);

  return students;
}
