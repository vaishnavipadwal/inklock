const STATUS = {
  unsaved: "Unsaved changes",
  saving: "Saving...",
  saved: "All changes saved",
  failed: "Could not save",
};

function Seg({ label, value, options, onChange }) {
  return (
    <div className="seg">
      <span>{label}</span>
      <div role="group" aria-label={label}>
        {options.map(([v, l]) => (
          <button key={v} type="button" aria-pressed={value === v} onClick={() => onChange(v)}>{l}</button>
        ))}
      </div>
    </div>
  );
}

export default function EditorToolbar({ prefs, onPref, status }) {
  return (
    <div className="ed-bar">
      <Seg label="Paper" value={prefs.paper} onChange={(v) => onPref("paper", v)}
        options={[["ruled", "Ruled"], ["grid", "Grid"], ["dotted", "Dotted"], ["plain", "Plain"]]} />
      <div className="seg">
        <span>Font</span>
        <select value={prefs.font} onChange={(e) => onPref("font", e.target.value)} className="ed-select">
          <optgroup label="Handwritten">
            <option value="patrick">Patrick Hand (Plain/Simple)</option>
            <option value="kalam">Kalam (Marathi/EN)</option>
            <option value="tillana">Tillana (Marathi/EN)</option>
            <option value="caveat">Caveat (EN)</option>
            <option value="pacifico">Pacifico</option>
            <option value="indieflower">Indie Flower</option>
            <option value="shadows">Shadows Into Light</option>
            <option value="dancing">Dancing Script</option>
            <option value="amatic">Amatic SC</option>
            <option value="apple">Homemade Apple</option>
            <option value="architects">Architects Daughter</option>
          </optgroup>
          <optgroup label="Typed">
            <option value="nunito">Nunito (Plain/Simple)</option>
            <option value="manrope">Manrope (EN)</option>
            <option value="mukta">Mukta (Marathi/EN)</option>
            <option value="poppins">Poppins (Marathi/EN)</option>
            <option value="fraunces">Fraunces</option>
            <option value="inter">Inter</option>
            <option value="roboto">Roboto</option>
            <option value="opensans">Open Sans</option>
            <option value="merriweather">Merriweather</option>
            <option value="playfair">Playfair Display</option>
            <option value="lora">Lora</option>
          </optgroup>
        </select>
      </div>
      <div className="seg">
        <span>Size</span>
        <select value={prefs.size || "normal"} onChange={(e) => onPref("size", e.target.value)} className="ed-select">
          <option value="small">Small</option>
          <option value="normal">Normal</option>
          <option value="large">Large</option>
          <option value="xlarge">Extra Large</option>
        </select>
      </div>
      <Seg label="Ink" value={prefs.ink} onChange={(v) => onPref("ink", v)}
        options={[["blue", "Blue"], ["black", "Black"]]} />
      <span className="ed-status" data-s={status} role="status">{STATUS[status] || ""}</span>
    </div>
  );
}
