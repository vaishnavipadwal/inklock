import { useState } from "react";
import PasswordField from "../UI/PasswordField";

const LockIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
);

// Three states:
//  1. no section password and no private notebooks -> invite to create one
//  2. no section password but private notebooks exist -> set the password
//  3. section password exists -> unlock
export default function PrivateGate({ hasPassword, count, onUnlock, onSetup, onCreate }) {
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const setupMode = !hasPassword && count > 0;

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (setupMode) {
      if (pw.length < 6) return setError("Use at least 6 characters.");
      if (pw !== pw2) return setError("The passwords do not match.");
    }
    setBusy(true);
    const err = await (setupMode ? onSetup(pw) : onUnlock(pw));
    setBusy(false);
    if (err) {
      setError(err);
      setPw("");
      setPw2("");
    }
  };

  if (!hasPassword && count === 0) {
    return (
      <div className="pg">
        <span className="pg-icon"><LockIcon /></span>
        <h2>Your private section is empty</h2>
        <p>Create your first private notebook and you will set the section password at the same time. After that, this tab asks for it each session.</p>
        <button className="db-btn" onClick={onCreate}>Create a private notebook</button>
      </div>
    );
  }

  return (
    <form className="pg" onSubmit={submit}>
      <span className="pg-icon"><LockIcon /></span>
      <h2>{setupMode ? "Create your private section password" : "Private section is locked"}</h2>
      <p>
        {setupMode
          ? `You already have ${count} private notebook${count > 1 ? "s" : ""}. Set one password that opens this tab. Each notebook keeps its own password too.`
          : "Enter your private section password to see your private notebooks. Each one still asks for its own password."}
      </p>
      <PasswordField
        id="pg-pass" label={setupMode ? "New section password" : "Private section password"}
        value={pw} onChange={setPw} meter={setupMode} autoFocus
        autoComplete={setupMode ? "new-password" : "off"}
        hint={setupMode ? "It cannot be recovered, so remember it." : undefined}
      />
      {setupMode && <PasswordField id="pg-pass2" label="Repeat password" value={pw2} onChange={setPw2} />}
      {error && <p className="db-error" role="alert">{error}</p>}
      <button className="db-btn" type="submit" disabled={busy || !pw}>
        {busy ? "Checking..." : setupMode ? "Set password and open" : "Unlock private section"}
      </button>
    </form>
  );
}
