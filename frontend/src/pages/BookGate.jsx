import { Link, useParams } from "react-router-dom";
import useBookAccess from "../hooks/useBookAccess";
import UnlockScreen from "../components/BookEditor/UnlockScreen";
import BookEditor from "./BookEditor";

export default function BookGate() {
  const { bookId } = useParams();
  const { state, book, error, busy, unlock } = useBookAccess(bookId);

  if (state === "open") return <BookEditor />;
  if (state === "locked")
    return <UnlockScreen book={book} error={error} busy={busy} onUnlock={unlock} />;

  return (
    <div className="ug">
      <div className="ug-card">
        {state === "error" ? (
          <>
            <p className="ug-error" role="alert">{error}</p>
            <Link to="/dashboard" className="ug-btn ghost">Back to notebooks</Link>
          </>
        ) : (
          <p className="ug-sub">Opening notebook...</p>
        )}
      </div>
    </div>
  );
}
