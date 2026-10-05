import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { bookToken, getToken } from "../api/books";

// state: "checking" | "locked" | "open" | "error"
export default function useBookAccess(bookId) {
  const nav = useNavigate();
  const [state, setState] = useState("checking");
  const [book, setBook] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      nav("/login");
      return;
    }
    setState("checking");
    api
      .get("/books")
      .then(({ data }) => {
        const found = data.find((b) => String(b.id) === bookId);
        if (!found) return nav("/dashboard");
        setBook(found);
        setState(!found.is_locked || bookToken.get(bookId) ? "open" : "locked");
      })
      .catch(() => {
        setError("Could not load this notebook. Check that the backend is running.");
        setState("error");
      });
  }, [bookId, nav]);

  // Returns true when unlocked, false when the password was wrong
  const unlock = useCallback(
    async (password) => {
      if (!password) {
        setError("Enter the notebook password.");
        return false;
      }
      setBusy(true);
      setError("");
      try {
        const { data } = await api.post(`/books/${bookId}/unlock`, { password });
        bookToken.set(bookId, data.book_token);
        setState("open");
        return true;
      } catch (err) {
        const d = err.response?.data?.detail;
        setError(typeof d === "string" ? d : "Could not unlock the notebook.");
        return false;
      } finally {
        setBusy(false);
      }
    },
    [bookId]
  );

  return { state, book, error, busy, unlock };
}
