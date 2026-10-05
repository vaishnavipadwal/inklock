import { useEffect, useRef, useState } from "react";
import api, { API_URL } from "../api/books";

export const COLORS = ["#4f46e5", "#0ea5e9", "#14b8a6", "#f59e0b", "#ef4444", "#a855f7"];
const MAX_MB = 2;
const EMPTY = {
  title: "", description: "", isPrivate: false, password: "", color: COLORS[0],
  sectionPassword: "", sectionConfirm: "",
};

export default function useNotebookForm({ section, onCreated, onUpdated }) {
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const close = () => {
    if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    setOpen(false);
    setForm(EMPTY);
    setEditId(null);
    setFile(null);
    setPreview("");
    setError("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const openModal = (isPrivate = false, book = null) => {
    if (book) {
      setEditId(book.id);
      setForm({
        ...EMPTY,
        title: book.title,
        description: book.description || "",
        isPrivate: book.is_locked,
        color: book.cover_color,
      });
      setPreview(book.cover_image ? `${API_URL}${book.cover_image}` : "");
    } else {
      setEditId(null);
      setForm({ ...EMPTY, isPrivate });
    }
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line
  }, [open, preview]);

  const pickFile = (f) => {
    if (!f) return;
    if (f.type && !["image/jpeg", "image/png", "image/webp"].includes(f.type)) {
      setError("Cover must be a JPG, PNG or WebP image.");
      return;
    }
    if (f.size > MAX_MB * 1024 * 1024) {
      setError(`Cover image must be ${MAX_MB} MB or smaller.`);
      return;
    }
    if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    setError("");
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const removeFile = () => {
    if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const submit = async (e) => {
    e.preventDefault();
    const title = form.title.trim();
    if (!title) return setError("Notebook name is required.");

    const needsSetup = form.isPrivate && !section.hasPassword;
    const isNewPrivate = form.isPrivate && (!editId || !form.isPrivate);

    if (form.isPrivate) {
      if (needsSetup) {
        if (form.sectionPassword.length < 6)
          return setError("The private section password needs at least 6 characters.");
        if (form.sectionPassword !== form.sectionConfirm)
          return setError("The private section passwords do not match.");
        if (form.sectionPassword === form.password)
          return setError("Use a different password for the notebook and the private section.");
      }
      
      if (isNewPrivate || form.password) {
         if (form.password.length < 6)
           return setError("A private notebook needs a password of at least 6 characters.");
      }
    }

    setSaving(true);
    setError("");
    try {
      if (needsSetup) {
        const err = await section.setup(form.sectionPassword);
        if (err) {
          setError(err);
          setSaving(false);
          return;
        }
      }
      const fd = new FormData();
      fd.append("title", title);
      fd.append("description", form.description.trim());
      fd.append("is_private", form.isPrivate ? "true" : "false");
      fd.append("cover_color", form.color);
      
      if (form.isPrivate && form.password) fd.append("password", form.password);
      
      if (file) {
        fd.append("cover", file);
      } else if (editId && !preview) {
        fd.append("remove_cover", "true");
      }

      if (editId) {
        const { data } = await api.put(`/books/${editId}`, fd);
        close();
        if (onUpdated) onUpdated(data);
      } else {
        const { data } = await api.post("/books", fd);
        close();
        onCreated(data);
      }
    } catch (err) {
      const d = err.response?.data?.detail;
      setError(typeof d === "string" ? d : "Could not save the notebook.");
    } finally {
      setSaving(false);
    }
  };

  return { open, openModal, close, form, set, file, fileRef, preview, pickFile, removeFile, submit, error, saving, isEdit: !!editId };
}
