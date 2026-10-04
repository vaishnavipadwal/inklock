import React from "react";
import Checklist from "./Checklist";

export default function Block({ block, first, last, onChange, onDelete, onMove }) {
  const t = block.block_type;
  const set = (content) => onChange({ ...block, content });
  return (
    <div className="ws-block">
      <div className="ws-block-bar">
        <select value={t} onChange={(e) => onChange({ ...block, block_type: e.target.value })}>
          <option value="text">Text</option>
          <option value="checklist">Checklist</option>
          <option value="code">Code</option>
        </select>
        <span className="grow" />
        <button disabled={first} onClick={() => onMove(-1)} aria-label="Move up">↑</button>
        <button disabled={last} onClick={() => onMove(1)} aria-label="Move down">↓</button>
        <button onClick={onDelete} aria-label="Delete block">Delete</button>
      </div>
      {t === "checklist" ? (
        <Checklist content={block.content} onChange={set} />
      ) : (
        <textarea
          className={t === "code" ? "code" : ""}
          value={block.content}
          rows={Math.max(3, block.content.split("\n").length)}
          placeholder={t === "code" ? "Paste or type code" : "Start writing"}
          spellCheck={t !== "code"}
          onChange={(e) => set(e.target.value)}
        />
      )}
    </div>
  );
}
