import { useEffect, useState } from "react";

export default function FloatingToolbar() {
  const [style, setStyle] = useState({ top: -9999, left: 0, opacity: 0 });
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState({});

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (!selection || !selection.rangeCount || selection.isCollapsed) {
        setVisible(false);
        return;
      }
      
      const range = selection.getRangeAt(0);
      const container = range.commonAncestorContainer;
      const el = container.nodeType === 3 ? container.parentNode : container;
      if (!el.closest('[contenteditable="true"]')) {
        setVisible(false);
        return;
      }

      const rect = range.getBoundingClientRect();
      setStyle({
        top: rect.top - 44,
        left: rect.left + rect.width / 2,
        opacity: 1
      });
      setVisible(true);

      // Check active formats
      setActive({
        bold: document.queryCommandState("bold"),
        italic: document.queryCommandState("italic"),
        underline: document.queryCommandState("underline"),
        strikeThrough: document.queryCommandState("strikeThrough")
      });
    };

    document.addEventListener("selectionchange", handleSelection);
    return () => document.removeEventListener("selectionchange", handleSelection);
  }, []);

  const format = (command) => {
    document.execCommand(command, false, null);
    setActive((prev) => ({ ...prev, [command]: document.queryCommandState(command) }));
  };

  if (!visible) return null;

  return (
    <div className="floating-toolbar" style={{
      position: "fixed",
      top: style.top,
      left: style.left,
      transform: "translateX(-50%)",
      background: "#1d2036",
      color: "white",
      padding: "6px",
      borderRadius: "10px",
      display: "flex",
      gap: "6px",
      zIndex: 9999,
      boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
      pointerEvents: "auto",
      userSelect: "none"
    }}>
      <button className={active.bold ? "active" : ""} onMouseDown={(e) => { e.preventDefault(); format("bold"); }}>B</button>
      <button className={active.italic ? "active" : ""} onMouseDown={(e) => { e.preventDefault(); format("italic"); }}>I</button>
      <button className={active.underline ? "active" : ""} onMouseDown={(e) => { e.preventDefault(); format("underline"); }}>U</button>
      <button className={active.strikeThrough ? "active" : ""} onMouseDown={(e) => { e.preventDefault(); format("strikeThrough"); }}>S</button>
    </div>
  );
}
