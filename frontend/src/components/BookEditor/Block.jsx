import { useLayoutEffect, useRef } from "react";
import Checklist from "./Checklist";
import api from "../../api/books";

// A textarea that grows with its text, so every block is a whole number of ruled lines
function AutoTextarea({ value, onChange, placeholder, spellCheck = true, label }) {
  const ref = useRef(null);
  const fit = () => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };
  useLayoutEffect(fit, [value]);
  useLayoutEffect(() => {
    window.addEventListener("resize", fit);
    document.fonts?.ready.then(fit);
    return () => window.removeEventListener("resize", fit);
  }, []);
  return (
    <textarea ref={ref} rows={1} value={value} placeholder={placeholder}
      spellCheck={spellCheck} aria-label={label} onChange={(e) => onChange(e.target.value)} />
  );
}

export default function Block({ block, first, last, onChange, onDelete, onMove }) {
  const t = block.block_type;
  const set = (content) => onChange({ ...block, content });

  return (
    <div className={`blk blk-${t}`}>
      <div className="blk-tools" role="toolbar" aria-label="Block options">
        <select value={t} aria-label="Block type"
          onChange={(e) => onChange({ ...block, block_type: e.target.value })}>
          <option value="text">Text</option>
          <option value="checklist">Checklist</option>
          <option value="code">Code</option>
          <option value="image">Image</option>
        </select>
        <button type="button" disabled={first} onClick={() => onMove(-1)} aria-label="Move block up">↑</button>
        <button type="button" disabled={last} onClick={() => onMove(1)} aria-label="Move block down">↓</button>
        <button type="button" onClick={onDelete} aria-label="Delete block">Delete</button>
      </div>

      {t === "checklist" ? (
        <Checklist content={block.content} onChange={set} />
      ) : t === "image" ? (
        <div className="blk-image-wrap">
          {block.content ? (
            <div className="blk-image-display">
              <img src={block.content} alt="Uploaded" />
              <button type="button" onClick={() => set("")} className="blk-image-remove" aria-label="Remove image">✕</button>
            </div>
          ) : (
            <label className="blk-image-upload">
              <span>Click to upload an image</span>
              <input type="file" accept="image/*" style={{display: "none"}} onChange={async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const fd = new FormData();
                fd.append("file", file);
                try {
                  const res = await api.post("/books/upload_image", fd);
                  if (res.data.url) set(res.data.url);
                } catch (err) {
                  alert("Failed to upload image.");
                }
              }} />
            </label>
          )}
        </div>
      ) : (
        <AutoTextarea
          value={block.content}
          onChange={set}
          label={t === "code" ? "Code" : "Notes"}
          spellCheck={t !== "code"}
          placeholder={t === "code" ? "Paste or type code" : first ? "Start writing here..." : ""}
        />
      )}
    </div>
  );
}
