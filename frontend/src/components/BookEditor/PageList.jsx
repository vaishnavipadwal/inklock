import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

function PageMenu({ onPrint, onDelete }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  
  useEffect(() => {
    if (!open) return;
    const click = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("pointerdown", click);
    return () => document.removeEventListener("pointerdown", click);
  }, [open]);

  return (
    <div ref={ref} className="ed-toc-menu-wrap">
      <button type="button" className="ed-toc-dots" onClick={(e) => { e.stopPropagation(); setOpen(!open); }} aria-expanded={open}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="5" r="2.5" />
          <circle cx="12" cy="12" r="2.5" />
          <circle cx="12" cy="19" r="2.5" />
        </svg>
      </button>
      {open && (
        <div className="ed-toc-menu">
          <button type="button" onClick={(e) => { e.stopPropagation(); setOpen(false); onPrint(); }}>Print</button>
          <button type="button" onClick={(e) => { e.stopPropagation(); setOpen(false); onDelete(); }} className="danger">Delete</button>
        </div>
      )}
    </div>
  );
}

// Sidebar styled like a table of contents
export default function PageList({ book, pages, activeId, onOpen, onAdd, onRename, onPrint, onDelete, onPrintRange }) {
  const [editingId, setEditingId] = useState(null);
  const [editVal, setEditVal] = useState("");
  const [showPrintForm, setShowPrintForm] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingId]);

  const commit = () => {
    if (editingId) {
      onRename(editingId, editVal);
      setEditingId(null);
    }
  };

  return (
    <aside className="ed-side">
      <Link to="/dashboard" className="ed-back">← All notebooks</Link>

      <div className="ed-book" style={{ "--c": book?.cover_color || "#4f46e5", position: 'relative' }}>
        <span className="ed-book-cover" aria-hidden="true" />
        <div style={{ flex: 1 }} className="ed-book-info" onClick={() => setMobileExpanded(!mobileExpanded)}>
          <h2>{book?.title || "Notebook"}</h2>
          <p>{pages.length} {pages.length === 1 ? "page" : "pages"}</p>
        </div>
        <button type="button" className="ed-mobile-toggle" onClick={() => setMobileExpanded(!mobileExpanded)} aria-expanded={mobileExpanded}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
        <button type="button" onClick={() => setShowPrintForm(!showPrintForm)} className="ed-book-print" aria-label="Print Range">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6z" /><path d="M6 9H4a2 2 0 00-2 2v5a2 2 0 002 2h2" /></svg>
        </button>
      </div>

      <div className={`ed-side-content ${mobileExpanded ? "open" : ""}`}>
        {showPrintForm && (
          <form className="ed-print-form" onSubmit={(e) => {
            e.preventDefault();
            onPrintRange(parseInt(e.target.from.value), parseInt(e.target.to.value));
            setShowPrintForm(false);
          }}>
            <div>
              <label>From</label>
              <input type="number" name="from" min="1" defaultValue="1" required />
            </div>
            <div>
              <label>To</label>
              <input type="number" name="to" min="1" defaultValue={pages.length || 1} required />
            </div>
            <button type="submit">Print PDF</button>
          </form>
        )}

        <p className="ed-toc-title">Pages</p>
        <nav className="ed-toc" aria-label="Pages">
          {pages.map((p) => (
            <div key={p.id} className="ed-toc-item">
              {editingId === p.id ? (
                <input
                  ref={inputRef}
                  type="text"
                  value={editVal}
                  onChange={(e) => setEditVal(e.target.value)}
                  onBlur={commit}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commit();
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  className="ed-toc-input"
                />
              ) : (
                <div style={{display:'flex', flex:1, position:'relative'}}>
                  <button 
                    type="button" 
                    onClick={() => { onOpen(p.id); setMobileExpanded(false); }}
                    onDoubleClick={() => {
                      setEditingId(p.id);
                      setEditVal(p.title || "");
                    }}
                    aria-current={p.id === activeId ? "page" : undefined}
                    style={{ paddingRight: "30px" }}
                  >
                    <span className="t">{p.title || "Untitled"}</span>
                    <span className="n">{p.page_number}</span>
                  </button>
                  <PageMenu onPrint={() => onPrint(p.id)} onDelete={() => onDelete(p.id)} />
                </div>
              )}
            </div>
          ))}
        </nav>

        <button type="button" className="ed-new" onClick={() => { onAdd(); setMobileExpanded(false); }}>+ New page</button>
      </div>
    </aside>
  );
}
