import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api, { getToken } from "../api/books";
import "../styles/Workspace.css";

let uid = 0;
const withKey = (b) => ({ ...b, key: ++uid });
const newBlock = (type = "text") => withKey({ block_type: type, content: "" });

import Block from "../components/BookEditor/Block";

export default function BookEditor() {
  const { bookId } = useParams();
  const nav = useNavigate();
  const [bookTitle, setBookTitle] = useState("");
  const [pages, setPages] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [title, setTitle] = useState("");
  const [blocks, setBlocks] = useState([]);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const latest = useRef({});
  latest.current = { activeId, title, blocks };
  const timer = useRef(null);

  const save = async () => {
    const { activeId: id, title: t, blocks: bl } = latest.current;
    if (!id) return;
    setStatus("Saving...");
    try {
      await api.put(`/books/${bookId}/pages/${id}`, {
        title: t,
        blocks: bl.map((b, i) => ({ block_type: b.block_type, content: b.content, position: i })),
      });
      setPages((p) => p.map((x) => (x.id === id ? { ...x, title: t } : x)));
      setStatus("Saved");
    } catch {
      setStatus("Save failed");
    }
  };

  const touch = () => {
    setStatus("Unsaved changes");
    clearTimeout(timer.current);
    timer.current = setTimeout(save, 800);
  };

  // Save pending changes before leaving the page or switching
  const flush = async () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
      await save();
    }
  };

  const openPage = async (id) => {
    await flush();
    try {
      const { data } = await api.get(`/books/${bookId}/pages/${id}`);
      setActiveId(data.id);
      setTitle(data.title);
      setBlocks(data.blocks.length ? data.blocks.map(withKey) : [newBlock()]);
      setStatus("");
    } catch {
      setError("Could not open that page.");
    }
  };

  useEffect(() => {
    if (!getToken()) {
      nav("/login");
      return;
    }
    (async () => {
      try {
        const [books, list] = await Promise.all([api.get("/books"), api.get(`/books/${bookId}/pages`)]);
        const book = books.data.find((b) => String(b.id) === bookId);
        if (!book) return nav("/dashboard");
        setBookTitle(book.title);
        setPages(list.data);
        if (list.data.length) {
          const { data } = await api.get(`/books/${bookId}/pages/${list.data[0].id}`);
          setActiveId(data.id);
          setTitle(data.title);
          setBlocks(data.blocks.length ? data.blocks.map(withKey) : [newBlock()]);
        }
      } catch {
        setError("Could not load this book.");
      }
    })();
    return () => clearTimeout(timer.current);
    // eslint-disable-next-line
  }, [bookId]);

  const addPage = async () => {
    await flush();
    try {
      const { data } = await api.post(`/books/${bookId}/pages`, { title: "Untitled" });
      setPages((p) => [...p, data]);
      setActiveId(data.id);
      setTitle(data.title);
      setBlocks([newBlock()]);
      setStatus("");
    } catch {
      setError("Could not add a page.");
    }
  };

  const deletePage = async () => {
    if (!window.confirm("Delete this page? It will move to Trash.")) return;
    clearTimeout(timer.current);
    timer.current = null;
    try {
      await api.delete(`/books/${bookId}/pages/${activeId}`);
      const rest = pages.filter((p) => p.id !== activeId);
      setPages(rest);
      if (rest.length) openPage(rest[0].id);
      else {
        setActiveId(null);
        setTitle("");
        setBlocks([]);
      }
    } catch {
      setError("Could not delete the page.");
    }
  };

  const updateBlock = (key, nb) => {
    setBlocks((bl) => bl.map((b) => (b.key === key ? nb : b)));
    touch();
  };
  const removeBlock = (key) => {
    setBlocks((bl) => bl.filter((b) => b.key !== key));
    touch();
  };
  const moveBlock = (idx, dir) => {
    setBlocks((bl) => {
      const a = [...bl];
      [a[idx], a[idx + dir]] = [a[idx + dir], a[idx]];
      return a;
    });
    touch();
  };
  const addBlock = (type) => {
    setBlocks((bl) => [...bl, newBlock(type)]);
    touch();
  };

  return (
    <div className="ws ed">
      <aside className="ed-side">
        <Link to="/dashboard" className="ws-link">← All books</Link>
        <h2>{bookTitle}</h2>
        <nav>
          {pages.map((p) => (
            <button
              key={p.id}
              className={p.id === activeId ? "ed-page on" : "ed-page"}
              onClick={() => openPage(p.id)}
            >
              <span>{p.page_number}</span>
              {p.title || "Untitled"}
            </button>
          ))}
        </nav>
        <button className="ws-btn ghost" onClick={addPage}>+ New page</button>
      </aside>

      <section className="ed-main">
        {error && <p className="ws-error">{error}</p>}
        {!activeId ? (
          <div className="ws-muted">
            <p>This book has no pages yet.</p>
            <button className="ws-btn" onClick={addPage}>Add the first page</button>
          </div>
        ) : (
          <>
            <div className="ed-head">
              <input
                className="ed-title"
                value={title}
                maxLength={150}
                placeholder="Page title"
                onChange={(e) => {
                  setTitle(e.target.value);
                  touch();
                }}
              />
              <span className="ed-status">{status}</span>
              <button className="ws-btn ghost" onClick={deletePage}>Delete page</button>
            </div>

            {blocks.map((b, i) => (
              <Block
                key={b.key}
                block={b}
                first={i === 0}
                last={i === blocks.length - 1}
                onChange={(nb) => updateBlock(b.key, nb)}
                onDelete={() => removeBlock(b.key)}
                onMove={(d) => moveBlock(i, d)}
              />
            ))}

            <div className="ed-add">
              <span className="ws-muted">Add block:</span>
              <button className="ws-btn ghost" onClick={() => addBlock("text")}>Text</button>
              <button className="ws-btn ghost" onClick={() => addBlock("checklist")}>Checklist</button>
              <button className="ws-btn ghost" onClick={() => addBlock("code")}>Code</button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
