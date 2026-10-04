import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { getToken, clearToken } from "../api/books";
import logo from "../assets/logo.png";
import "../styles/Dashboard.css";
import NewNotebookModal from "../components/Dashboard/NewNotebookModal";
import NotebookCard from "../components/Dashboard/NotebookCard";
import { Search, Plus, Trash } from "../components/UI/Icons";

const API = "http://127.0.0.1:8000";
const MAX_MB = 2;
const TYPES = ["image/jpeg", "image/png", "image/webp"];
const COLORS = ["#4f46e5", "#0ea5e9", "#14b8a6", "#f59e0b", "#ef4444", "#a855f7"];
const EMPTY = { title: "", description: "", isPrivate: false, password: "", color: COLORS[0] };

const greet = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
};



export default function Dashboard() {
  const nav = useNavigate();
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("new");

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    if (!getToken()) return nav("/login");
    Promise.all([api.get("/auth/me"), api.get("/books")])
      .then(([u, b]) => {
        setUser(u.data);
        setBooks(b.data);
      })
      .catch(() => setError("Could not load your notebooks. Check that the backend is running."))
      .finally(() => setLoading(false));
  }, [nav]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && closeDrawer();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line
  }, [open]);

  const shown = useMemo(() => {
    let list = books.filter((b) => b.title.toLowerCase().includes(q.trim().toLowerCase()));
    if (filter === "private") list = list.filter((b) => b.is_locked);
    if (filter === "open") list = list.filter((b) => !b.is_locked);
    if (sort === "az") list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [books, q, filter, sort]);

  const privateCount = books.filter((b) => b.is_locked).length;
  const firstName = user?.name?.split(" ")[0] || "";

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const closeDrawer = () => {
    if (preview) URL.revokeObjectURL(preview);
    setOpen(false);
    setForm(EMPTY);
    setFile(null);
    setPreview("");
    setFormError("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const pickFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!TYPES.includes(f.type)) {
      setFormError("Cover must be a JPG, PNG or WebP image.");
      e.target.value = "";
      return;
    }
    if (f.size > MAX_MB * 1024 * 1024) {
      setFormError(`Cover image must be ${MAX_MB} MB or smaller.`);
      e.target.value = "";
      return;
    }
    if (preview) URL.revokeObjectURL(preview);
    setFormError("");
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const removeFile = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const submit = async (e) => {
    e.preventDefault();
    const title = form.title.trim();
    if (!title) return setFormError("Book name is required.");
    if (form.isPrivate && form.password.length < 6)
      return setFormError("A private book needs a password of at least 6 characters.");

    const fd = new FormData();
    fd.append("title", title);
    fd.append("description", form.description.trim());
    fd.append("is_private", form.isPrivate ? "true" : "false");
    fd.append("cover_color", form.color);
    if (form.isPrivate) fd.append("password", form.password);
    if (file) fd.append("cover", file);

    setSaving(true);
    setFormError("");
    try {
      const { data } = await api.post("/books", fd);
      setBooks((b) => [data, ...b]);
      closeDrawer();
      setToast(`"${data.title}" created`);
    } catch (err) {
      const d = err.response?.data?.detail;
      setFormError(typeof d === "string" ? d : "Could not create the book.");
    } finally {
      setSaving(false);
    }
  };

  const deleteBook = async (book) => {
    if (!window.confirm(`Delete "${book.title}"? It will move to Trash.`)) return;
    try {
      await api.delete(`/books/${book.id}`);
      setBooks((b) => b.filter((x) => x.id !== book.id));
      setToast(`"${book.title}" moved to Trash`);
    } catch {
      setError("Could not delete the book.");
    }
  };

  const logout = () => {
    clearToken();
    nav("/login");
  };

  return (
    <div className="db">
      <header className="db-top">
        <img src={logo} alt="InkLock" className="db-logo" />
        <div className="db-user">
          <span className="db-avatar" aria-hidden="true">{firstName.charAt(0).toUpperCase()}</span>
          <span className="db-name">{user?.name}</span>
          <button className="db-btn ghost" onClick={logout}>Log out</button>
        </div>
      </header>

      <main className="db-main">
        <section className="db-hero">
          <h1>{greet()}{firstName ? `, ${firstName}` : ""}.</h1>
          <p>
            {loading
              ? "Opening your shelf..."
              : books.length === 0
              ? "Your shelf is empty. Start your first notebook."
              : `You have ${books.length} notebook${books.length > 1 ? "s" : ""}, ${privateCount} of them private.`}
          </p>
        </section>

        <div className="db-tools">
          <label className="db-search">
            <Search />
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search notebooks" />
          </label>
          <div className="db-seg" role="group" aria-label="Filter notebooks">
            {[["all", "All"], ["open", "Open"], ["private", "Private"]].map(([k, l]) => (
              <button key={k} aria-pressed={filter === k} onClick={() => setFilter(k)}>{l}</button>
            ))}
          </div>
          <select className="db-sort" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort notebooks">
            <option value="new">Newest first</option>
            <option value="az">A to Z</option>
          </select>
          <button className="db-btn" onClick={() => setOpen(true)}><Plus /> New notebook</button>
        </div>

        {error && <p className="db-error">{error}</p>}

        {loading ? (
          <div className="db-grid">
            {[0, 1, 2, 3].map((i) => <div className="db-skel" key={i} />)}
          </div>
        ) : books.length === 0 && !error ? (
          <div className="db-empty">
            <NotebookCard title="Ideas" color="#4f46e5" />
            <h2>Nothing on the shelf yet</h2>
            <p>Create a notebook for study, work or journaling. Make it private to lock it with its own password.</p>
            <button className="db-btn" onClick={() => setOpen(true)}><Plus /> Create your first notebook</button>
          </div>
        ) : (
          <div className="db-grid">
            <button className="bk-new" onClick={() => setOpen(true)}>
              <span><Plus /></span>
              New notebook
            </button>
            {shown.map((b) => (
              <article className="bk" key={b.id}>
                <button className="bk-open" onClick={() => nav(`/book/${b.id}`)} aria-label={`Open ${b.title}`}>
                  <NotebookCard
                    title={b.title}
                    color={b.cover_color}
                    image={b.cover_image ? `${API}${b.cover_image}` : ""}
                    locked={b.is_locked}
                  />
                </button>
                <div className="bk-meta">
                  <div>
                    <h3>{b.title}</h3>
                    <p>{b.is_locked ? "Password protected" : b.description || "No description"}</p>
                  </div>
                  <button className="bk-del" onClick={() => deleteBook(b)} aria-label={`Delete ${b.title}`}><Trash /></button>
                </div>
              </article>
            ))}
            {shown.length === 0 && <p className="db-none">No notebooks match your search or filter.</p>}
          </div>
        )}
      </main>

      {toast && <div className="db-toast" role="status">{toast}</div>}

      {open && (
        <NewNotebookModal
          form={form}
          set={set}
          file={file}
          fileRef={fileRef}
          onPick={pickFile}
          onRemove={removeFile}
          onSubmit={submit}
          onClose={closeDrawer}
          error={formError}
          saving={saving}
          previewNode={<NotebookCard title={form.title} color={form.color} image={preview} locked={form.isPrivate} />}
        />
      )}
    </div>
  );
}
