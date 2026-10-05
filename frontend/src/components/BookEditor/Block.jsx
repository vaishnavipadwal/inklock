import { useLayoutEffect, useRef } from "react";
import Checklist from "./Checklist";
import api from "../../api/books";

function RichTextarea({ value, onChange, placeholder, spellCheck = true, label }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || "";
    }
  }, [value]);

  return (
    <div
      ref={ref}
      className="rich-textarea"
      contentEditable
      suppressContentEditableWarning
      spellCheck={spellCheck}
      aria-label={label}
      onInput={(e) => onChange(e.currentTarget.innerHTML)}
      onBlur={(e) => onChange(e.currentTarget.innerHTML)}
      data-placeholder={placeholder}
    />
  );
}

export default function Block({ block, first, last, onChange, onDelete, onMove }) {
  const t = block.block_type;
  const set = (content) => onChange({ ...block, content });

  let imgData = { url: "", align: "center", width: "100%" };
  if (t === "image" && block.content) {
    try {
      imgData = JSON.parse(block.content);
    } catch {
      imgData.url = block.content;
    }
  }
  const updateImg = (updates) => {
    set(JSON.stringify({ ...imgData, ...updates }));
  };

  const imgContainerRef = useRef(null);
  const imgWrapRef = useRef(null);

  useLayoutEffect(() => {
    if (t !== "image" || !imgContainerRef.current || !imgWrapRef.current) return;
    const display = imgContainerRef.current;
    const wrap = imgWrapRef.current;
    const observer = new ResizeObserver(() => {
      wrap.style.paddingBottom = "0px";
      const h = wrap.offsetHeight;
      const L = 34;
      const remainder = h % L;
      if (remainder !== 0) {
        wrap.style.paddingBottom = `${L - remainder}px`;
      }
    });
    observer.observe(display);
    return () => observer.disconnect();
  }, [t]);
  
  const handleDrag = (e, corner) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = imgContainerRef.current.offsetWidth;
    document.body.style.userSelect = "none";
    
    const onMove = (me) => {
      let delta = me.clientX - startX;
      if (corner === "sw" || corner === "nw") delta = -delta;
      if (imgData.align === "center") delta *= 2;
      imgContainerRef.current.style.width = `${Math.max(50, startWidth + delta)}px`;
    };
    const onUp = () => {
      document.body.style.userSelect = "";
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      updateImg({ width: imgContainerRef.current.style.width });
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  return (
    <div className={`blk blk-${t}`}>
      <div className="blk-tools" role="toolbar" aria-label="Block options">
        <div className="blk-drag-handle">⋮⋮</div>
        <div className="blk-tools-menu">
          <select value={t} aria-label="Block type"
            onChange={(e) => onChange({ ...block, block_type: e.target.value })}>
            <option value="text">Text</option>
            <option value="checklist">Checklist</option>
            <option value="code">Code</option>
            <option value="image">Image</option>
          </select>
          <button type="button" disabled={first} onClick={() => onMove(-1)} title="Move block up">↑</button>
          <button type="button" disabled={last} onClick={() => onMove(1)} title="Move block down">↓</button>
          <button type="button" onClick={onDelete} title="Delete block" className="danger">✕</button>
        </div>
      </div>

      {t === "checklist" ? (
        <Checklist content={block.content} onChange={set} />
      ) : t === "image" ? (
        <div className="blk-image-wrap" style={{ textAlign: imgData.align }} ref={imgWrapRef}>
          {imgData.url ? (
            <div className="blk-image-display" style={{ width: imgData.width }} ref={imgContainerRef}>
              <img src={imgData.url} alt="Uploaded" />
              
              <div className="img-handle nw" onMouseDown={(e) => handleDrag(e, "nw")} />
              <div className="img-handle ne" onMouseDown={(e) => handleDrag(e, "ne")} />
              <div className="img-handle sw" onMouseDown={(e) => handleDrag(e, "sw")} />
              <div className="img-handle se" onMouseDown={(e) => handleDrag(e, "se")} />

              <div className="blk-image-controls" aria-label="Image Controls">
                <button type="button" onClick={() => updateImg({ align: "left" })}>Left</button>
                <button type="button" onClick={() => updateImg({ align: "center" })}>Center</button>
                <button type="button" onClick={() => updateImg({ align: "right" })}>Right</button>
              </div>
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
                  if (res.data.url) updateImg({ url: res.data.url });
                } catch (err) {
                  alert("Failed to upload image.");
                }
              }} />
            </label>
          )}
        </div>
      ) : (
        <RichTextarea
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
