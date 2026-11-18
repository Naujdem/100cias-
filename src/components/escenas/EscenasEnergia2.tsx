// Escena viva del área 5, tema 6 (Recursos naturales y energía): de la represa al bombillo.

const suave = 'opacity 0.7s ease, fill 0.8s ease'
const TINTA = '#3a3a3a'
const AZUL = '#2f7fc1'

function T({ x, y, t, c = TINTA, s = 11, peso = 800 }: { x: number; y: number; t: string; c?: string; s?: number; peso?: number }) {
  return <text x={x} y={y} textAnchor="middle" fontSize={s} fontWeight={peso} fill={c} stroke="#fff" strokeWidth="3" paintOrder="stroke">{t}</text>
}

const HID = ['embalse', 'caida', 'turbina', 'red']

export function EscenaHidroelectrica({ fase }: { fase: string }) {
  const i = Math.max(0, HID.indexOf(fase))
  const fuerte = (k: number) => ({ transition: suave, opacity: i === k ? 1 : i > k ? 0.55 : 0.2 })
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Hidroeléctrica: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#e7f0f6" />
      <rect x="-10" y="250" width="420" height="60" fill="#8a7a5a" />
      {/* embalse y represa */}
      <g style={fuerte(0)}>
        <path d="M -10 120 H 120 V 250 H -10 Z" fill="#5aa0d6" />
        <polygon points="120,100 150,100 170,250 120,250" fill="#9a958e" />
        <T x={55} y={110} t="embalse" c={AZUL} />
      </g>
      {/* tubo de caída */}
      <g style={fuerte(1)}>
        <path d="M 120 200 L 200 240" stroke="#555" strokeWidth="14" />
        <path d="M 120 200 L 200 240" stroke={AZUL} strokeWidth="6" strokeDasharray="8 6">
          {i === 1 && <animate attributeName="stroke-dashoffset" from="28" to="0" dur="0.6s" repeatCount="indefinite" />}
        </path>
        <T x={150} y={190} t="caída" c={AZUL} />
      </g>
      {/* turbina y generador */}
      <g style={fuerte(2)}>
        <rect x="195" y="205" width="60" height="45" rx="6" fill="#ccc" stroke="#777" strokeWidth="2" />
        <g transform="translate(225 228)">
          <g>
            {[0, 60, 120].map((a) => <rect key={a} x="-3" y="-16" width="6" height="32" fill="#555" transform={`rotate(${a})`} />)}
            {i >= 2 && <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="1s" repeatCount="indefinite" />}
          </g>
        </g>
        <T x={225} y={196} t="turbina + generador" s={10} />
        <path d="M 255 240 H 290 V 250" stroke={AZUL} strokeWidth="5" fill="none" />
      </g>
      {/* red */}
      <g style={fuerte(3)}>
        {[290, 350].map((x) => <path key={x} d={`M ${x - 12} 250 L ${x} 150 L ${x + 12} 250 M ${x - 16} 165 H ${x + 16}`} stroke="#666" strokeWidth="3" fill="none" />)}
        <path d="M 255 210 Q 275 175 290 165 Q 320 175 350 165 Q 370 170 385 190" stroke="#e0a800" strokeWidth="2.5" fill="none" />
        <text x="385" y="225" textAnchor="middle" fontSize="26">🏠</text>
        <text x="385" y="198" textAnchor="middle" fontSize="16">💡</text>
      </g>
      <T x={200} y={40} t={['La represa detiene el río y forma un embalse', 'El agua baja con fuerza por un tubo', 'El agua gira la turbina y el generador produce electricidad', 'Las torres llevan la electricidad a las casas'][i]} s={12} />
    </svg>
  )
}
