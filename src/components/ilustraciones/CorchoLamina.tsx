// Ilustración esquemática: un corcho y una lámina finísima cortada con navaja.
export default function CorchoLamina() {
  return (
    <svg viewBox="0 0 240 180" role="img" aria-label="Un corcho y una lámina muy fina cortada de él" className="h-full w-full">
      <rect width="240" height="180" fill="#efe3cc" />
      {/* sombra */}
      <ellipse cx="85" cy="138" rx="46" ry="9" fill="#000" opacity="0.1" />
      <ellipse cx="185" cy="122" rx="40" ry="7" fill="#000" opacity="0.1" />

      {/* corcho */}
      <path d="M47 55 V124 C47 136 123 136 123 124 V55 Z" fill="#d9b77f" stroke="#8a6a3b" strokeWidth="2" />
      <ellipse cx="85" cy="55" rx="38" ry="12" fill="#e8cd98" stroke="#8a6a3b" strokeWidth="2" />
      {[
        [60, 78], [75, 92], [96, 84], [108, 104], [68, 112], [90, 118], [54, 98], [112, 72], [82, 70],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="1.8" fill="#a27d45" />
      ))}
      {[
        [78, 55], [94, 52], [68, 57], [100, 58],
      ].map(([x, y]) => (
        <circle key={`t${x}`} cx={x} cy={y} r="1.3" fill="#b89458" />
      ))}

      {/* lámina cortada */}
      <path d="M149 96 V102 C149 110 221 110 221 102 V96 Z" fill="#c9a266" stroke="#8a6a3b" strokeWidth="1.6" />
      <ellipse cx="185" cy="96" rx="36" ry="11" fill="#f3e3bb" stroke="#8a6a3b" strokeWidth="1.6" />
      {[
        [170, 94], [182, 98], [196, 93], [205, 98], [160, 97], [188, 91],
      ].map(([x, y]) => (
        <circle key={`l${x}`} cx={x} cy={y} r="1.1" fill="#a27d45" />
      ))}

      {/* navaja */}
      <g transform="rotate(-18 120 40)">
        <path d="M104 40 H148 L154 45 L148 50 H104 Z" fill="#cfd8dc" stroke="#607d8b" strokeWidth="1.5" />
        <rect x="148" y="38" width="46" height="14" rx="5" fill="#4a3416" />
      </g>
      <path d="M118 64 C130 78 140 82 150 88" fill="none" stroke="#0f766e" strokeWidth="2" strokeDasharray="4 4" />
      <path d="M150 88 l-9 -1 l5 -7" fill="none" stroke="#0f766e" strokeWidth="2" />
    </svg>
  )
}
