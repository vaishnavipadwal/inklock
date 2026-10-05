import Block from "./Block";

const today = () =>
  new Date().toLocaleDateString(undefined, {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

// One notebook page: date, title, blocks, page number. Everything snaps to the ruled lines.
export default function Paper({
  prefs, pageNumber, title, onTitle, blocks, onBlockChange, onBlockDelete, onBlockMove, onAddBlock, onNext
}) {
  return (
    <article className="paper" data-paper={prefs.paper} data-font={prefs.font} data-size={prefs.size || "normal"} data-ink={prefs.ink}>
      <div className="paper-body">
        <div className="paper-date">{today()}</div>
        <input className="paper-title" value={title} maxLength={150}
          onChange={(e) => onTitle(e.target.value)} placeholder="Page title" aria-label="Page title" />

        {blocks.map((b, i) => (
          <Block key={b.key} block={b} first={i === 0} last={i === blocks.length - 1}
            onChange={(nb) => onBlockChange(b.key, nb)}
            onDelete={() => onBlockDelete(b.key)}
            onMove={(d) => onBlockMove(i, d)} />
        ))}

        <div className="paper-add">
          <span>Add</span>
          <button type="button" onClick={() => onAddBlock("text")}>Text</button>
          <button type="button" onClick={() => onAddBlock("checklist")}>Checklist</button>
          <button type="button" onClick={() => onAddBlock("code")}>Code</button>
          <button type="button" onClick={() => onAddBlock("image")}>Image</button>
        </div>

        <div className="paper-foot">
          <span>- {pageNumber} -</span>
          <button type="button" className="ed-next-page" onClick={onNext} aria-label="Next Page" title="Next Page">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    </article>
  );
}
