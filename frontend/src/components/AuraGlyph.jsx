import '../aura.css';

export default function AuraGlyph({ aura, className = '' }) {
  return (
    <svg className={`aura-glyph ${className}`} data-aura={aura} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <circle className="aura-glyph__halo" cx="16" cy="16" r="12" />
      <path className="aura-glyph__arc" d="M5.5 16a10.5 10.5 0 0 1 18.3-7" />
      <path className="aura-glyph__core" d="M12 21.5 16 11l4 10.5M13.8 17.5h4.4" />
      {aura === 'menyala' ? <path className="aura-glyph__spark" d="m24 6 .8 1.7L26.5 8.5l-1.7.8L24 11l-.8-1.7-1.7-.8 1.7-.8L24 6Z" /> : null}
      {aura === 'redup' ? <path className="aura-glyph__fade" d="M8 24.5h16" /> : null}
    </svg>
  );
}
