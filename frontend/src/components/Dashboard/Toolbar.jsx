const Lock = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
);

export default function Toolbar({
  query, onQuery, tab, onTab, counts, sectionLocked,
  sort, onSort, onNew, canLock, onLock,
}) {
  const searchOff = tab === "private" && sectionLocked;
  return (
    <div className="db-tools">
      <label className="db-search">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
        </svg>
        <input type="search" value={query} onChange={(e) => onQuery(e.target.value)}
          placeholder="Search notebooks" disabled={searchOff} />
      </label>

      <div className="db-seg" role="group" aria-label="Notebook type">
        <button aria-pressed={tab === "open"} onClick={() => onTab("open")}>
          Open <b>{counts.open}</b>
        </button>
        <button aria-pressed={tab === "private"} onClick={() => onTab("private")}>
          {sectionLocked && <Lock />} Private <b>{counts.private}</b>
        </button>
      </div>

      <select className="db-sort" value={sort} onChange={(e) => onSort(e.target.value)} aria-label="Sort notebooks">
        <option value="new">Newest first</option>
        <option value="az">A to Z</option>
      </select>

      {canLock && <button className="db-btn ghost" onClick={onLock}>Lock private section</button>}
      <button className="db-btn" onClick={onNew}>+ New notebook</button>
    </div>
  );
}
