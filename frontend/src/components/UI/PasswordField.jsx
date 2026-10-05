import { useState } from "react";
import "./PasswordField.css";

const LEVELS = ["Too short", "Weak", "Okay", "Good", "Strong"];

function strength(p) {
  if (p.length < 6) return 0;
  let s = 1;
  if (p.length >= 10) s++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
  if (/\d/.test(p) || /[^A-Za-z0-9]/.test(p)) s++;
  return Math.min(s, 4);
}

export default function PasswordField({
  id, label, value, onChange, placeholder, hint,
  required = false, meter = false, autoFocus = false, autoComplete = "new-password",
}) {
  const [show, setShow] = useState(false);
  const level = strength(value);
  return (
    <div className="pf">
      <label htmlFor={id}>
        {label}
        {required && <b>required</b>}
      </label>
      <div className="pf-box">
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
        />
        <button type="button" onClick={() => setShow(!show)}>{show ? "Hide" : "Show"}</button>
      </div>
      {meter && (
        <div className="pf-meter" data-level={level} aria-hidden="true">
          <i /><i /><i /><i />
        </div>
      )}
      {(hint || (meter && value)) && (
        <p className="pf-hint">{meter && value ? `${LEVELS[level]}. ` : ""}{hint}</p>
      )}
    </div>
  );
}
