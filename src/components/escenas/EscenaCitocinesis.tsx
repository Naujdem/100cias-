import type { CSSProperties } from 'react'

// Escena viva de la citocinesis: primero la célula animal (anillo que estrangula),
// después la vegetal (vesículas que forman la placa y luego la pared nueva).
const NUCLEO = '#7a4a8a'
const suave = 'transform 1s ease, opacity 0.7s ease'

/** contorno de la célula animal con la cintura cerrada a «w» (80 = sin surco) */
const contorno = (w: number) =>
  `path("M 60 150 C 60 64, 180 66, 200 ${150 - w} C 220 66, 340 64, 340 150 C 340 236, 220 234, 200 ${150 + w} C 180 234, 60 236, 60 150 Z")`

const VESICULAS: [number, number, number][] = [
  [150, 96, 96], [250, 110, 120], [160, 196, 150], [244, 204, 180], [176, 130, 210], [226, 168, 136], [150, 150, 112], [252, 150, 194],
]

export default function EscenaCitocinesis({ fase }: { fase: string }) {
  const f = fase
  const vegetal = f.startsWith('vegetal')
  const w = f === 'surco' ? 34 : f === 'separadas' ? 2 : 80
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Citocinesis: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={vegetal ? '#eef5e6' : '#f3e7ef'} style={{ transition: 'fill 0.8s' }} />

      {/* ── animal ── */}
      <g style={{ transition: suave, opacity: vegetal ? 0 : 1 }}>
        <path fill="#f8d9d4" stroke="#b05a5a" strokeWidth="4" style={{ d: contorno(w), transition: 'd 1.1s ease, opacity 0.6s', opacity: f === 'separadas' ? 0 : 1 } as CSSProperties} />
        {/* las dos hijas ya separadas */}
        {[[128, -1], [272, 1]].map(([cx, s]) => (
          <circle key={cx} cx={cx} cy="150" r="78" fill="#f8d9d4" stroke="#b05a5a" strokeWidth="4"
            style={{ transition: suave, opacity: f === 'separadas' ? 1 : 0, transform: f === 'separadas' ? `translate(${s * 10}px, 0)` : 'none' }} />
        ))}
        {/* anillo contráctil */}
        <ellipse cx="200" cy="150" rx="7" ry="80" fill="none" stroke="#c43c3c" strokeWidth="5" strokeDasharray="3 5"
          style={{ transition: 'transform 1.1s ease, opacity 0.6s', transformOrigin: '200px 150px', transform: `scaleY(${Math.max(w, 6) / 80})`, opacity: f === 'surco' ? 1 : 0 }} />
        {[[124, -1], [276, 1]].map(([x, s]) => (
          <circle key={x} cx={x} cy="150" r="30" fill="#ead3f2" stroke={NUCLEO} strokeWidth="3"
            style={{ transition: suave, transform: f === 'separadas' ? `translate(${s * 14}px, 0)` : 'none' }} />
        ))}
      </g>

      {/* ── vegetal ── */}
      <g style={{ transition: suave, opacity: vegetal ? 1 : 0 }}>
        <rect x="40" y="60" width="320" height="180" rx="14" fill="#e3f1d6" stroke="#6fa05a" strokeWidth="11" />
        <rect x="49" y="69" width="302" height="162" rx="9" fill="none" stroke="#b08a4a" strokeWidth="2" />
        {[110, 290].map((x) => <circle key={x} cx={x} cy="150" r="30" fill="#ead3f2" stroke={NUCLEO} strokeWidth="3" />)}
        {/* vesículas del Golgi que viajan al centro */}
        {VESICULAS.map(([x, y, yc], k) => (
          <circle key={k} cx={x} cy={y} r="7" fill="#fbe19a" stroke="#c9a23a" strokeWidth="2"
            style={{ transition: suave, transform: f === 'vegetal-placa' ? `translate(${200 - x}px, ${yc - y}px)` : 'none', opacity: f === 'vegetal-pared' ? 0 : 1 }} />
        ))}
        {/* placa → pared nueva */}
        <rect x="195" y="66" width="10" height="168" rx="3" fill="#6fa05a" stroke="#b08a4a" strokeWidth="1.5"
          style={{ transition: 'transform 1.1s ease, opacity 0.6s', transformOrigin: '200px 150px', transform: f === 'vegetal-pared' ? 'scaleY(1)' : 'scaleY(0.5)', opacity: f === 'vegetal-pared' ? 1 : 0 }} />
      </g>
    </svg>
  )
}
