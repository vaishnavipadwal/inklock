import { useState } from "react";

const KEY = "inklock_paper_prefs";
const DEFAULTS = { paper: "ruled", font: "kalam", size: "normal", ink: "blue" };

// Remembers paper, writing style and ink color in this browser
export default function useNotebookPrefs() {
  const [prefs, setPrefs] = useState(() => {
    try {
      return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY)) };
    } catch {
      return DEFAULTS;
    }
  });

  const setPref = (k, v) =>
    setPrefs((p) => {
      const next = { ...p, [k]: v };
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* storage unavailable, the choice still works for this session */
      }
      return next;
    });

  return [prefs, setPref];
}
