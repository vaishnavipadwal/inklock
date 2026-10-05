import { useCallback, useEffect, useRef, useState } from "react";
import api from "../api/books";

let uid = 0;
const withKey = (b) => ({ ...b, key: ++uid });
const blank = (type = "text") => withKey({ block_type: type, content: "" });
const fromApi = (blocks) => (blocks.length ? blocks.map(withKey) : [blank()]);

// status: "" | "unsaved" | "saving" | "saved" | "failed"
export default function useBookEditor(bookId) {
  const [book, setBook] = useState(null);
  const [pages, setPages] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [title, setTitle] = useState("");
  const [blocks, setBlocks] = useState([]);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const latest = useRef({});
  latest.current = { activeId, title, blocks };
  const timer = useRef(null);

  const save = useCallback(async () => {
    const { activeId: id, title: t, blocks: bl } = latest.current;
    if (!id) return;
    setStatus("saving");
    try {
      await api.put(`/books/${bookId}/pages/${id}`, {
        title: t,
        blocks: bl.map((b, i) => ({ block_type: b.block_type, content: b.content, position: i })),
      });
      setPages((p) => p.map((x) => (x.id === id ? { ...x, title: t } : x)));
      if (!timer.current) setStatus("saved");
    } catch {
      setStatus("failed");
    }
  }, [bookId]);

  const touch = useCallback(() => {
    setStatus("unsaved");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      timer.current = null;
      save();
    }, 800);
  }, [save]);

  const flush = useCallback(async () => {
    if (!timer.current) return;
    clearTimeout(timer.current);
    timer.current = null;
    await save();
  }, [save]);

  const loadPage = useCallback(
    async (id) => {
      const { data } = await api.get(`/books/${bookId}/pages/${id}`);
      setActiveId(data.id);
      setTitle(data.title);
      setBlocks(fromApi(data.blocks));
      setStatus("");
    },
    [bookId]
  );

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const [b, list] = await Promise.all([
          api.get(`/books/${bookId}`),
          api.get(`/books/${bookId}/pages`),
        ]);
        if (!live) return;
        setBook(b.data);
        setPages(list.data);
        if (list.data.length) await loadPage(list.data[0].id);
      } catch {
        if (live) setError("Could not load this notebook. Check that the backend is running.");
      } finally {
        if (live) setLoading(false);
      }
    })();
    return () => {
      live = false;
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
        save(); // do not lose the last edits when leaving
      }
    };
  }, [bookId, loadPage, save]);

  const openPage = useCallback(
    async (id) => {
      if (id === latest.current.activeId) return;
      await flush();
      try {
        await loadPage(id);
      } catch {
        setError("Could not open that page.");
      }
    },
    [flush, loadPage]
  );

  const addPage = useCallback(async () => {
    if (latest.current.activeId) {
      const currTitle = latest.current.title;
      const currBlocks = latest.current.blocks || [];
      const isBlank = (!currTitle || currTitle.trim() === "") && 
        (currBlocks.length === 0 || (currBlocks.length === 1 && currBlocks[0].block_type === "text" && (!currBlocks[0].content || currBlocks[0].content.trim() === "")));
      
      if (isBlank) {
        alert("Please write something on the current blank page before creating a new one.");
        return;
      }
    }

    await flush();
    try {
      const { data } = await api.post(`/books/${bookId}/pages`, { title: "" });
      setPages((p) => [...p, data]);
      setActiveId(data.id);
      setTitle(data.title);
      setBlocks([blank()]);
      setStatus("");
    } catch {
      setError("Could not add a page.");
    }
  }, [bookId, flush]);

  const deletePage = useCallback(async (targetId) => {
    const id = (typeof targetId === 'number' || typeof targetId === 'string') ? targetId : latest.current.activeId;
    if (!id) return;
    clearTimeout(timer.current);
    timer.current = null;
    try {
      await api.delete(`/books/${bookId}/pages/${id}`);
      const rest = pages.filter((p) => p.id !== id).map((p, i) => ({ ...p, page_number: i + 1 }));
      setPages(rest);
      if (id === latest.current.activeId) {
        if (rest.length) await loadPage(rest[0].id);
        else {
          setActiveId(null);
          setTitle("");
          setBlocks([]);
          setStatus("");
        }
      }
    } catch {
      setError("Could not delete the page.");
    }
  }, [bookId, pages, loadPage]);

  const renamePage = useCallback(async (id, newTitle) => {
    try {
      await api.put(`/books/${bookId}/pages/${id}`, { title: newTitle });
      setPages((p) => p.map((x) => (x.id === id ? { ...x, title: newTitle } : x)));
      if (id === latest.current.activeId) setTitle(newTitle);
    } catch {
      setError("Could not rename page.");
    }
  }, [bookId]);

  const editTitle = (v) => { setTitle(v); touch(); };
  const updateBlock = (key, nb) => { setBlocks((bl) => bl.map((b) => (b.key === key ? nb : b))); touch(); };
  const removeBlock = (key) => {
    setBlocks((bl) => {
      const r = bl.filter((b) => b.key !== key);
      return r.length ? r : [blank()];
    });
    touch();
  };
  const moveBlock = (i, d) => {
    setBlocks((bl) => {
      const j = i + d;
      if (j < 0 || j >= bl.length) return bl;
      const a = [...bl];
      [a[i], a[j]] = [a[j], a[i]];
      return a;
    });
    touch();
  };
  const addBlock = (type) => { setBlocks((bl) => [...bl, blank(type)]); touch(); };

  return {
    book, pages, activeId, title, blocks, status, error, loading,
    openPage, addPage, deletePage, renamePage, editTitle, updateBlock, removeBlock, moveBlock, addBlock,
  };
}
