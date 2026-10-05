import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../../utils/cropImage";
import "../../styles/NewNotebookModal.css";

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
  isEdit,
  previewNode
}) {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [cropping, setCropping] = useState(false);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageSrc(reader.result);
        setCropping(true);
      });
      reader.readAsDataURL(selectedFile);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleCropSave = async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      onPick(croppedImage);
      setCropping(false);
      setImageSrc(null);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCropCancel = () => {
    setCropping(false);
    setImageSrc(null);
  };

  return (
    <div className="md-bg" onClick={cropping ? handleCropCancel : onClose}>
      <div 
        className="md" 
        role="dialog" 
        aria-modal="true" 
        style={{ '--c': form.color || COLORS[0] }}
        onClick={(e) => e.stopPropagation()}
      >
        
        {cropping ? (
          <div className="dr-cropper-container" style={{ width: '100%', flex: 1 }}>
            <div className="md-head">
              <h2>Adjust Cover</h2>
              <button className="md-x" onClick={handleCropCancel} aria-label="Cancel crop">×</button>
            </div>
            <div className="dr-cropper-wrap">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={3 / 4}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            <div className="dr-cropper-controls">
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => {
                  setZoom(e.target.value);
                }}
                className="dr-zoom-range"
              />
            </div>
            <div className="md-foot">
              <button type="button" className="db-btn ghost" onClick={handleCropCancel}>Cancel</button>
              <button type="button" className="db-btn" onClick={handleCropSave}>Save Crop</button>
            </div>
          </div>
        ) : (
          <>
            <div className="md-stage">
              {previewNode}
            </div>

            <form onSubmit={onSubmit} className="md-form">
              <div className="md-head">
                <h2>{isEdit ? "Edit notebook" : "New notebook"}</h2>
                <p>Name it, give it a look, and decide who can open it.</p>
                <button type="button" className="md-x" onClick={onClose} aria-label="Close">×</button>
              </div>

              <div className="md-scroll">
                <div className="md-field">
                  <div className="md-lab">
                    <label>Name</label>
                    <b>required</b>
                    <span>{form.title.length}/150</span>
                  </div>
                  <input 
                    value={form.title} 
                    onChange={(e) => set("title", e.target.value)} 
                    maxLength={150} 
                    placeholder="For example, Physics" 
                    autoFocus 
                  />
                </div>

                <div className="md-field">
                  <div className="md-lab">
                    <label>Cover</label>
                    <i>optional</i>
                  </div>
                  <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} hidden />
                  
                  {file ? (
                    <div className="md-file">
                      <div className="md-file-ic">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                      </div>
                      <div className="md-file-name">
                        {file.name}
                        <small>{(file.size / 1024 / 1024).toFixed(1)} MB</small>
                      </div>
                      <button type="button" onClick={() => fileRef.current?.click()}>Change</button>
                      <button type="button" onClick={onRemove}>Remove</button>
                    </div>
                  ) : (
                    <>
                      <div className="md-drop" onClick={() => fileRef.current?.click()}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        <b>Drop an image <span>or click to browse</span></b>
                        <small>JPG, PNG or WebP, up to {MAX_MB} MB</small>
                      </div>
                      <div className="md-colors">
                        <span>Or pick a color</span>
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
                    </>
                  )}
                </div>

                <div className="md-field">
                  <div className="md-lab">
                    <label>Description</label>
                    <i>optional</i>
                    <span>{form.description.length}/300</span>
                  </div>
                  <textarea 
                    rows={3} 
                    value={form.description} 
                    onChange={(e) => set("description", e.target.value.substring(0, 300))} 
                    placeholder="What is this notebook for?" 
                  />
                </div>

                <div className={`md-priv ${form.isPrivate ? 'on' : ''}`}>
                  <div className="md-priv-row">
                    <div className="md-priv-ic">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    </div>
                    <div className="md-priv-text">
                      <b>Make this notebook private</b>
                      <small>Moves to the Private tab and asks for its own password.</small>
                    </div>
                    <button type="button" className="md-switch" role="switch" aria-checked={form.isPrivate} onClick={() => set("isPrivate", !form.isPrivate)}>
                      <span />
                    </button>
                  </div>
                  
                  {form.isPrivate && (
                    <div className="md-pw">
                      <div className="md-lab">
                        <label>Notebook password</label>
                        <b>required</b>
                      </div>
                      <div className="md-pw-box">
                        <input 
                          type="password" 
                          value={form.password} 
                          onChange={(e) => set("password", e.target.value)}
                          placeholder="At least 6 characters" 
                          autoComplete="new-password" 
                        />
                      </div>
                      <p className="md-hint">This password cannot be recovered, so remember it.</p>
                    </div>
                  )}
                </div>

                {error && <p className="db-error" style={{color: '#ef4444', margin: 0}}>{error}</p>}
              </div>

              <div className="md-foot">
                <button type="button" className="db-btn ghost" onClick={onClose}>Cancel</button>
                <button type="submit" className="db-btn" disabled={saving}>
                  {saving ? "Saving..." : (isEdit ? "Save notebook" : "Create notebook")}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
