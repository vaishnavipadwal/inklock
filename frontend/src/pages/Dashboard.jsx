import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api, { clearToken, getToken, sectionToken } from "../api/books";
import usePrivateSection from "../hooks/usePrivateSection";
import useBooks from "../hooks/useBooks";
import useNotebookForm from "../hooks/useNotebookForm";
import DashboardHeader from "../components/Dashboard/DashboardHeader";
import Toolbar from "../components/Dashboard/Toolbar";
import PrivateGate from "../components/Dashboard/PrivateGate";
import NotebookCard, { NotebookCover } from "../components/Dashboard/NotebookCard";
import NewNotebookModal from "../components/Dashboard/NewNotebookModal";
import "../styles/Dashboard.css";

const greet = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
};

const Skeleton = () => (
  <div className="db-grid">
    {[0, 1, 2, 3].map((i) => <div className="db-skel" key={i} />)}
  </div>
);

export default function Dashboard() {
  const nav = useNavigate();
  const loc = useLocation();
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState(loc.state?.tab === "private" ? "private" : "open");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("new");
  const [toast, setToast] = useState("");

  const section = usePrivateSection();
  const openBooks = useBooks("open", true);
  const privBooks = useBooks("private", tab === "private" && section.unlocked, section.lock);
  const active = tab === "open" ? openBooks : privBooks;

  useEffect(() => {
    if (!getToken()) {
      nav("/login");
      return;
    }
    api.get("/auth/me").then(({ data }) => setUser(data)).catch(() => {});
  }, [nav]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const onCreated = (book) => {
    section.refresh();
    if (!book.is_locked) {
      openBooks.setBooks((b) => [book, ...b]);
      setToast(`"${book.title}" created`);
    } else if (sectionToken.get()) {
      if (tab === "private") privBooks.reload();
      else setTab("private");
      setToast(`"${book.title}" added to Private`);
    } else {
      setToast(`"${book.title}" created. Unlock the Private tab to see it.`);
    }
  };

  const onUpdated = (book) => {
    openBooks.reload();
    if (section.unlocked) privBooks.reload();
    setToast(`"${book.title}" updated`);
  };

  const nb = useNotebookForm({ section, onCreated, onUpdated });

  const shown = useMemo(() => {
    let list = active.books.filter((b) => b.title.toLowerCase().includes(query.trim().toLowerCase()));
    if (sort === "az") list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [active.books, query, sort]);

  const remove = async (book) => {
    if (!window.confirm(`Delete "${book.title}"? It will move to Trash.`)) return;
    try {
      await api.delete(`/books/${book.id}`);
      (book.is_locked ? privBooks : openBooks).setBooks((b) => b.filter((x) => x.id !== book.id));
      if (book.is_locked) section.refresh();
      setToast(`"${book.title}" moved to Trash`);
    } catch {
      setToast("Could not delete the notebook.");
    }
  };

  const logout = () => {
    clearToken();
    nav("/login");
  };

  const isPrivateTab = tab === "private";
  const total = openBooks.books.length + section.privateCount;

  const renderBody = () => {
    if (isPrivateTab && !section.ready) return <Skeleton />;
    if (isPrivateTab && !section.unlocked)
      return (
        <PrivateGate
          hasPassword={section.hasPassword}
          count={section.privateCount}
          onUnlock={section.unlock}
          onSetup={section.setup}
          onCreate={() => nb.openModal(true)}
        />
      );
    if (active.loading) return <Skeleton />;
    if (active.books.length === 0 && !active.error)
      return (
        <div className="db-empty">
          <NotebookCover title={isPrivateTab ? "Secrets" : "Ideas"} color="#4f46e5" locked={isPrivateTab} />
          <h2>{isPrivateTab ? "No private notebooks yet" : "No open notebooks yet"}</h2>
          <p>
            {isPrivateTab
              ? "Private notebooks live here, behind your section password and their own passwords."
              : "Create a notebook for study, work or journaling."}
          </p>
          <button className="db-btn" onClick={() => nb.openModal(isPrivateTab)}>
            {isPrivateTab ? "Create a private notebook" : "Create a notebook"}
          </button>
        </div>
      );
    return (
      <div className="db-grid">
        <button className="bk-new" onClick={() => nb.openModal(isPrivateTab)}>
          <span>+</span>
          New {isPrivateTab ? "private " : ""}notebook
        </button>
        {shown.map((b) => (
          <NotebookCard key={b.id} book={b} onOpen={(x) => nav(`/book/${x.id}`)} onEdit={(x) => nb.openModal(x.is_locked, x)} onDelete={remove} />
        ))}
        {shown.length === 0 && <p className="db-none">No notebooks match your search.</p>}
      </div>
    );
  };

  return (
    <div className="db">
      <DashboardHeader user={user} onLogout={logout} />

      <main className="db-main">
        <section className="db-hero">
          <h1>{greet()}{user?.name ? `, ${user.name.split(" ")[0]}` : ""}.</h1>
          <p>
            {!section.ready || openBooks.loading
              ? "Opening your shelf..."
              : total === 0
              ? "Your shelf is empty. Start your first notebook."
              : `You have ${total} notebook${total > 1 ? "s" : ""}, ${section.privateCount} of them private.`}
          </p>
        </section>

        <Toolbar
          query={query} onQuery={setQuery}
          tab={tab} onTab={setTab}
          counts={{ open: openBooks.books.length, private: section.privateCount }}
          sectionLocked={!section.unlocked}
          sort={sort} onSort={setSort}
          onNew={() => nb.openModal(isPrivateTab)}
          canLock={isPrivateTab && section.unlocked}
          onLock={section.lock}
        />

        {active.error && !(isPrivateTab && !section.unlocked) && <p className="db-error">{active.error}</p>}
        {renderBody()}
      </main>

      {toast && <div className="db-toast" role="status">{toast}</div>}

      {nb.open && (
        <NewNotebookModal
          form={nb.form} set={nb.set}
          file={nb.file} fileRef={nb.fileRef}
          onPick={nb.pickFile} onRemove={nb.removeFile}
          onSubmit={nb.submit} onClose={nb.close}
          error={nb.error} saving={nb.saving} isEdit={nb.isEdit}
          needsSectionSetup={nb.form.isPrivate && !section.hasPassword}
          previewNode={
            <NotebookCover title={nb.form.title} color={nb.form.color} image={nb.preview} locked={nb.form.isPrivate} />
          }
        />
      )}
    </div>
  );
}
