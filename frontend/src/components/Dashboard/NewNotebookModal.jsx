import React from "react";
import "./NewNotebookModal.css";

const COLORS = ["#4f46e5", "#0ea5e9", "#14b8a6", "#f59e0b", "#ef4444", "#a855f7"];
const MAX_MB = 2;

export default function NewNotebookModal({
  form,
  set,
  file,
  fileRef,
  onPick,
  onRemove,
  onSubmit,
  onClose,
  error,
  saving,
  previewNode
}) {
  return (
    <>
      <div className="dr-bg" onClick={onClose} />
      <aside className="dr" role="dialog" aria-modal="true" aria-label="New notebook">
        <div className="dr-head">
          <h2>New notebook</h2>
          <button onClick={onClose} aria-label="Close">×</button>
        </div>

        <form onSubmit={onSubmit} className="dr-body">
          <div className="dr-preview">
            {previewNode}
          </div>

          <label>
            Name <em>required</em>
            <input 
              value={form.title} 
              onChange={(e) => set("title", e.target.value)} 
              maxLength={150} 
              placeholder="For example, Physics" 
              autoFocus 
            />
          </label>

          <div className="dr-field">
            <span>Cover <em>optional</em></span>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={onPick} hidden />
            <div className="dr-cover">
              <button type="button" className="db-btn ghost" onClick={() => fileRef.current?.click()}>
                {file ? "Change image" : "Upload image"}
              </button>
              {file && <button type="button" className="db-btn ghost" onClick={onRemove}>Remove</button>}
              {!file && (
                <div className="dr-colors">
                  {COLORS.map((c) => (
                    <button 
                      type="button" 
                      key={c} 
                      aria-label={`Cover color ${c}`} 
                      aria-pressed={form.color === c}
                      style={{ background: c }} 
                      onClick={() => set("color", c)} 
                    />
                  ))}
                </div>
              )}
            </div>
            <small>JPG, PNG or WebP, up to {MAX_MB} MB.</small>
          </div>

          <label>
            Description <em>optional</em>
            <textarea 
              rows={3} 
              value={form.description} 
              onChange={(e) => set("description", e.target.value)} 
              placeholder="What is this notebook for?" 
            />
          </label>

          <label className="dr-check">
            <input 
              type="checkbox" 
              checked={form.isPrivate} 
              onChange={(e) => set("isPrivate", e.target.checked)} 
            />
            <span>Make this notebook private<small>It will ask for a password every time you open it.</small></span>
          </label>

          {form.isPrivate && (
            <label>
              Notebook password <em>required</em>
              <input 
                type="password" 
                value={form.password} 
                onChange={(e) => set("password", e.target.value)}
                placeholder="At least 6 characters" 
                autoComplete="new-password" 
              />
              <small>This password cannot be recovered, so remember it.</small>
            </label>
          )}

          {error && <p className="db-error">{error}</p>}

          <div className="dr-actions">
            <button type="button" className="db-btn ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="db-btn" disabled={saving}>
              {saving ? "Creating..." : "Create notebook"}
            </button>
          </div>
        </form>
      </aside>
    </>
  );
}
