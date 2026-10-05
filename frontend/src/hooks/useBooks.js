import { useCallback, useEffect, useRef, useState } from "react";
import api from "../api/books";

// kind: "open" | "private". When enabled is false nothing is fetched and the list is cleared.
export default function useBooks(kind, enabled = true, onLocked) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState("");
  const [version, setVersion] = useState(0);
  const lockedRef = useRef(onLocked);
  lockedRef.current = onLocked;

  useEffect(() => {
    if (!enabled) {
      setBooks([]);
      setLoading(false);
      return;
    }
    let live = true;
    setLoading(true);
    setError("");
    api
      .get("/books", { params: { kind } })
      .then(({ data }) => live && setBooks(data))
      .catch((err) => {
        if (!live) return;
        if (err.response?.status === 403) lockedRef.current?.();
        else setError("Could not load your notebooks. Check that the backend is running.");
      })
      .finally(() => live && setLoading(false));
    return () => {
      live = false;
    };
  }, [kind, enabled, version]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);
  return { books, setBooks, loading, error, reload };
}
