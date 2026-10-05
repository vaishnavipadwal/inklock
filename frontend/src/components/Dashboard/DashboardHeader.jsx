import logo from "../../assets/logo.png";

export default function DashboardHeader({ user, onLogout }) {
  const initial = (user?.name || "?").trim().charAt(0).toUpperCase();
  return (
    <header className="db-top">
      <img src={logo} alt="InkLock" className="db-logo" />
      <div className="db-user-menu">
        <div className="db-user-pill">
          <span className="db-avatar" aria-hidden="true">{initial}</span>
          <span className="db-name">{user?.name}</span>
        </div>
        <button className="db-logout" onClick={onLogout} aria-label="Log out" title="Log out">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
        </button>
      </div>
    </header>
  );
}
