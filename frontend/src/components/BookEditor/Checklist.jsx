import React from "react";

export default function Checklist({ content, onChange }) {
  const lines = content ? content.split("\n") : [""];
  const parse = (l) => {
    const m = l.match(/^\[( |x)\] ?(.*)$/);
    return m ? { done: m[1] === "x", text: m[2] } : { done: false, text: l };
  };
  const items = lines.map(parse);
  const write = (arr) => onChange(arr.map((i) => `[${i.done ? "x" : " "}] ${i.text}`).join("\n"));
  const edit = (idx, patch) => write(items.map((it, i) => (i === idx ? { ...it, ...patch } : it)));

  return (
    <div className="ws-check">
      {items.map((it, i) => (
        <div key={i} className="ws-check-row">
          <input type="checkbox" checked={it.done} onChange={(e) => edit(i, { done: e.target.checked })} />
          <input
            className={it.done ? "done" : ""}
            value={it.text}
            placeholder="List item"
            onChange={(e) => edit(i, { text: e.target.value })}
          />
          <button onClick={() => write(items.filter((_, j) => j !== i))} aria-label="Remove item">×</button>
        </div>
      ))}
      <button className="ws-link" onClick={() => write([...items, { done: false, text: "" }])}>+ Add item</button>
    </div>
  );
}
