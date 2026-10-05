import { useRef } from "react";

// Stored as lines: "[ ] text" or "[x] text"
const parse = (content) =>
  (content ? content.split("\n") : [""]).map((l) => {
    const m = l.match(/^\[( |x)\] ?(.*)$/);
    return m ? { done: m[1] === "x", text: m[2] } : { done: false, text: l };
  });

export default function Checklist({ content, onChange }) {
  const wrap = useRef(null);
  const items = parse(content);

  const write = (arr) => onChange(arr.map((i) => `[${i.done ? "x" : " "}] ${i.text}`).join("\n"));
  const edit = (idx, patch) => write(items.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  const focus = (idx) =>
    requestAnimationFrame(() => wrap.current?.querySelectorAll('input[type="text"]')[idx]?.focus());

  const onKey = (e, idx) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const next = [...items];
      next.splice(idx + 1, 0, { done: false, text: "" });
      write(next);
      focus(idx + 1);
    } else if (e.key === "Backspace" && items[idx].text === "" && items.length > 1) {
      e.preventDefault();
      write(items.filter((_, i) => i !== idx));
      focus(Math.max(0, idx - 1));
    }
  };

  return (
    <div ref={wrap} className="cl">
      {items.map((it, i) => (
        <div className="cl-row" key={i}>
          <input type="checkbox" checked={it.done} aria-label="Done"
            onChange={(e) => edit(i, { done: e.target.checked })} />
          <input type="text" className={it.done ? "done" : ""} value={it.text}
            placeholder={i === 0 ? "List item" : ""}
            onChange={(e) => edit(i, { text: e.target.value })}
            onKeyDown={(e) => onKey(e, i)} />
          <button type="button" className="cl-del" aria-label="Remove item"
            onClick={() => write(items.filter((_, j) => j !== i))}>×</button>
        </div>
      ))}
      <button type="button" className="cl-add"
        onClick={() => { write([...items, { done: false, text: "" }]); focus(items.length); }}>
        + Add item
      </button>
    </div>
  );
}
