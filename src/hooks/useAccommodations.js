import { useEffect, useState } from "react";
import { getAllAccommodations } from "../db/accommodations";
import { useRefresh } from "../context/RefreshContext";

export default function useAccommodations() {
  const [accommodations, setAccommodations] = useState([]);
  const { refreshKey } = useRefresh();

  useEffect(() => {
    let mounted = true;
    getAllAccommodations().then(data => {
      if (mounted) setAccommodations(data);
    });
    return () => (mounted = false);
  }, [refreshKey]);

  return accommodations;
}
