import { useState } from "react";
import { Link } from "react-router-dom";
import "./UnlockScreen.css";

export default function UnlockScreen({ book, error, busy, onUnlock }) {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const ok = await onUnlock(password);
    if (!ok) setPassword("");
  };

  return (
    <div className="ug">
      <form className="ug-card" onSubmit={submit} style={{ "--c": book?.cover_color || "#4f46e5" }}>
        <span className="ug-icon" aria-hidden="true">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="11" width="16" height="10" rx="2" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
          </svg>
        </span>
        <h1>{book?.title}</h1>
        <p className="ug-sub">This notebook is private. Enter its password to open it.</p>

        <div className="ug-box">
          <input
            type={show ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Notebook password"
            autoComplete="off"
            autoFocus
            aria-label="Notebook password"
          />
          <button type="button" onClick={() => setShow(!show)}>{show ? "Hide" : "Show"}</button>
        </div>

        {error && <p className="ug-error" role="alert">{error}</p>}

        <div className="ug-actions">
          <Link to="/dashboard" className="ug-btn ghost">Back</Link>
          <button type="submit" className="ug-btn" disabled={busy}>
            {busy ? "Checking..." : "Unlock notebook"}
          </button>
        </div>
      </form>
    </div>
  );
}
