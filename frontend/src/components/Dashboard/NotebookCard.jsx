import { API_URL } from "../../api/books";

const LockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
);

// The notebook drawing only (used in cards, the popup preview and empty states)
export function NotebookCover({ title, color, image, locked }) {
  return (
    <div className="nb" style={{ "--c": color }}>
      <span className="nb-pages" />
      <div
        className={image ? "nb-cover has-img" : "nb-cover"}
        style={image ? { backgroundImage: `url("${image}")` } : undefined}
      >
        <span className="nb-spine" />
        <span className="nb-band" />
        {locked && <span className="nb-lock"><LockIcon /> Private</span>}
        {!image && <span className="nb-initial">{(title || "?").trim().charAt(0).toUpperCase()}</span>}
        <span className="nb-title">{title || "Untitled"}</span>
      </div>
    </div>
  );
}

export default function NotebookCard({ book, onOpen, onEdit, onDelete }) {
  return (
    <article className="bk">
      <button className="bk-open" onClick={() => onOpen(book)} aria-label={`Open ${book.title}`}>
        <NotebookCover
          title={book.title}
          color={book.cover_color}
          image={book.cover_image ? `${API_URL}${book.cover_image}` : ""}
          locked={book.is_locked}
        />
      </button>
      <div className="bk-meta">
        <div>
          <h3>{book.title}</h3>
          <p>{book.is_locked ? "Password protected" : book.description || "No description"}</p>
        </div>
        <div className="bk-actions">
          {onEdit && (
            <button className="bk-action bk-edit-btn" onClick={() => onEdit(book)} aria-label={`Edit ${book.title}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
            </button>
          )}
          <button className="bk-action bk-del-btn" onClick={() => onDelete(book)} aria-label={`Delete ${book.title}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}
