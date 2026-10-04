import React from "react";
import { Lock } from "../UI/Icons";

export default function NotebookCard({ title, color, image, locked }) {
  return (
    <div className="nb" style={{ "--c": color }}>
      <span className="nb-pages" />
      <div
        className={image ? "nb-cover has-img" : "nb-cover"}
        style={image ? { backgroundImage: `url("${image}")` } : undefined}
      >
        <span className="nb-spine" />
        <span className="nb-band" />
        {locked && <span className="nb-lock"><Lock /> Private</span>}
        {!image && <span className="nb-initial">{(title || "?").trim().charAt(0).toUpperCase()}</span>}
        <span className="nb-title">{title || "Untitled"}</span>
      </div>
    </div>
  );
}
