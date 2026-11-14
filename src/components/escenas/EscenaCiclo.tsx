// Escena viva del ciclo celular: un reloj (G1, S, G2, M) cuya aguja avanza mientras la célula
// de la izquierda crece, copia su ADN y se divide. G0 = la célula sale del ciclo.
const AZUL = '#3b6fb6'
const NARANJA = '#d9822b'
const NUCLEO = '#7a4a8a'
const suave = 'transform 1s ease, opacity 0.7s ease'

// tramos del reloj en grados (empieza arriba, sentido horario): G1 40 %, S 30 %, G2 20 %, M 10 %
const TRAMOS: Record<string, [number, number, string, string]> = {
  g1: [0, 144, 'G1', '#9fd3b5'],
  s: [144, 252, 'S', '#f2c77a'],
  g2: [252, 324, 'G2', '#a9c6ec'],
  m: [324, 360, 'M', '#e8806f'],
}
const RX = 300
const RY = 150
const R = 82

const punto = (a: number, r: number) => {
  const t = ((a - 90) * Math.PI) / 180
  return [RX + r * Math.cos(t), RY + r * Math.sin(t)]
}
function arco(a0: number, a1: number) {
  const [x0, y0] = punto(a0, R)
  const [x1, y1] = punto(a1, R)
  return `M ${x0} ${y0} A ${R} ${R} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1}`
}

export default function EscenaCiclo({ fase }: { fase: string }) {
  const f = fase
  const t = TRAMOS[f]
  const aguja = t ? (t[0] + t[1]) / 2 : f === 'g0' ? 72 : 0
  const escala = f === 'g1' ? 0.82 : f === 'g0' ? 0.9 : f === 's' ? 0.95 : f === 'g2' ? 1.08 : 1
  const copiado = f === 's' || f === 'g2'
  const dividida = f === 'm'
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Ciclo celular: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#f3efe6" />

      {/* reloj */}
      <circle cx={RX} cy={RY} r={R} fill="none" stroke="#e5dccb" strokeWidth="22" />
      {Object.entries(TRAMOS).map(([id, [a0, a1, nombre, color]]) => {
        const [lx, ly] = punto((a0 + a1) / 2, R)
        const activo = id === f
        return (
          <g key={id}>
            <path d={arco(a0 + 1.5, a1 - 1.5)} fill="none" stroke={color} strokeWidth={activo ? 26 : 20} style={{ transition: 'stroke-width 0.5s', opacity: f === 'g0' ? 0.45 : 1 }} />
            <text x={lx} y={ly + 5} textAnchor="middle" fontSize="14" fontWeight="800" fill="#2b2b2b">{nombre}</text>
          </g>
        )
      })}
      <g style={{ transition: 'transform 1.1s cubic-bezier(.45,.05,.25,1)', transformOrigin: `${RX}px ${RY}px`, transform: `rotate(${aguja}deg)` }}>
        <line x1={RX} y1={RY} x2={RX} y2={RY - R + 18} stroke="#2b2b2b" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx={RX} cy={RY} r="5" fill="#2b2b2b" />
      </g>
      {/* G0: una salida del ciclo */}
      <g style={{ transition: suave, opacity: f === 'g0' ? 1 : 0 }}>
        <path d={`M ${punto(72, R + 14).join(' ')} Q 372 40 352 22`} fill="none" stroke="#6b6257" strokeWidth="2.5" strokeDasharray="5 4" />
        <text x="352" y="16" textAnchor="middle" fontSize="14" fontWeight="800" fill="#2b2b2b">G0</text>
      </g>

      {/* célula madre */}
      <g style={{ transition: suave, transformOrigin: '110px 150px', transform: `scale(${escala})`, opacity: dividida ? 0 : 1 }}>
        <circle cx="110" cy="150" r="86" fill={f === 'g0' ? '#e9e2dc' : '#f8d9d4'} stroke="#b05a5a" strokeWidth="4" style={{ transition: 'fill 0.7s' }} />
        <circle cx="104" cy="146" r="38" fill="#ead3f2" stroke={NUCLEO} strokeWidth="3" />
        <g fill="none" strokeWidth="2.5" strokeLinecap="round">
          <path d="M86 140 q12 -16 24 -4 t16 14" stroke={AZUL} />
          <path d="M92 158 q12 10 20 -4" stroke={NARANJA} />
          {/* la copia del ADN aparece en S */}
          <g style={{ transition: suave, opacity: copiado ? 1 : 0 }}>
            <path d="M88 134 q12 -16 24 -4 t16 14" stroke={AZUL} opacity="0.7" />
            <path d="M94 164 q12 10 20 -4" stroke={NARANJA} opacity="0.7" />
          </g>
        </g>
        {/* orgánulos: se duplican en G2 */}
        {[[60, 100], [150, 210], [70, 200]].map(([x, y], k) => (
          <ellipse key={k} cx={x} cy={y} rx="14" ry="8" fill="#f2b84b" stroke="#a8641e" strokeWidth="2" transform={`rotate(${k * 50 - 20} ${x} ${y})`} />
        ))}
        {[[155, 95], [40, 150]].map(([x, y], k) => (
          <ellipse key={k} cx={x} cy={y} rx="14" ry="8" fill="#f2b84b" stroke="#a8641e" strokeWidth="2" transform={`rotate(${k * 40 + 30} ${x} ${y})`} style={{ transition: suave, opacity: f === 'g2' ? 1 : 0 }} />
        ))}
      </g>

      {/* fase M: dos hijas */}
      {[62, 162].map((x, k) => (
        <g key={x} style={{ transition: suave, transformOrigin: '110px 150px', transform: dividida ? 'none' : `translate(${k === 0 ? 48 : -52}px, 0) scale(0.6)`, opacity: dividida ? 1 : 0 }}>
          <circle cx={x} cy="150" r="48" fill="#f8d9d4" stroke="#b05a5a" strokeWidth="4" />
          <circle cx={x - 2} cy="148" r="20" fill="#ead3f2" stroke={NUCLEO} strokeWidth="2.5" />
          <path d={`M${x - 10} 146 q6 -9 12 -2 t8 8`} fill="none" stroke={AZUL} strokeWidth="2" strokeLinecap="round" />
        </g>
      ))}
    </svg>
  )
}
