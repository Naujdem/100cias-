import type { ReactNode } from 'react'
// Escenas vivas del área 5, tema 7 (Residuos y consumo).

const suave = 'transform 1.1s cubic-bezier(.45,.05,.25,1), opacity 0.7s ease, fill 0.8s ease'
const TINTA = '#3a3a3a'
const ROJO = '#c43c3c'

function T({ x, y, t, c = TINTA, s = 11, peso = 800 }: { x: number; y: number; t: string; c?: string; s?: number; peso?: number }) {
  return <text x={x} y={y} textAnchor="middle" fontSize={s} fontWeight={peso} fill={c} stroke="#fff" strokeWidth="3" paintOrder="stroke">{t}</text>
}
function Ver({ si, children }: { si: boolean; children: ReactNode }) {
  return <g style={{ transition: suave, opacity: si ? 1 : 0 }}>{children}</g>
}

/* ── El viaje de la basura ────────────────────────────────────────────── */

const VIAJE = ['casa', 'carro', 'relleno', 'efectos']

export function EscenaViajeBasura({ fase }: { fase: string }) {
  const i = Math.max(0, VIAJE.indexOf(fase))
  const bolsa = [[90, 205], [200, 190], [300, 175], [300, 175]][i]
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`El viaje de la basura: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#e9eef0" />
      <rect x="-10" y="220" width="420" height="90" fill="#8a7a5a" />
      <Ver si={i === 0}><text x="70" y="215" textAnchor="middle" fontSize="60">🏠</text></Ver>
      <Ver si={i === 1}><text x="190" y="218" textAnchor="middle" fontSize="60">🚛</text><path d="M 40 205 H 140" stroke="#999" strokeWidth="3" strokeDasharray="6 5" /></Ver>
      {/* relleno: capas */}
      <Ver si={i >= 2}>
        {[0, 1, 2, 3].map((k) => <rect key={k} x="220" y={230 + k * 18} width="170" height="10" fill={k % 2 ? '#7a6a4a' : '#5a5a5a'} />)}
        <rect x="220" y="222" width="170" height="8" fill="#9a8a6a" />
        <T x={305} y={212} t="relleno sanitario" s={11} />
      </Ver>
      <Ver si={i === 3}>
        <path d="M 230 300 C 200 300 170 290 120 300" stroke="#3a2a1a" strokeWidth="6" fill="none" />
        <T x={150} y={288} t="lixiviados" c={ROJO} />
        {[250, 300, 350].map((x) => <g key={x}><circle cx={x} cy={170} r="10" fill="#bbb" opacity="0.7" /><circle cx={x + 6} cy={145} r="13" fill="#bbb" opacity="0.5" /></g>)}
        <T x={305} y={120} t="metano (CH₄)" c={ROJO} />
      </Ver>
      <text x={bolsa[0]} y={bolsa[1]} textAnchor="middle" fontSize="28" style={{ transition: suave, opacity: i <= 1 ? 1 : 0 }}>🛍️</text>
      <T x={200} y={40} t={['Todo mezclado en una sola bolsa', 'El carro se la lleva... pero no desaparece', 'Se entierra por capas en el relleno', 'Al pudrirse: líquido tóxico y gas de invernadero'][i]} c={i === 3 ? ROJO : TINTA} s={12} />
    </svg>
  )
}

/* ── Compostaje ──────────────────────────────────────────────────────── */

const COMP = ['capas', 'calor', 'voltear', 'abono']

export function EscenaCompostaje({ fase }: { fase: string }) {
  const i = Math.max(0, COMP.indexOf(fase))
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Compostaje: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#eef2e6" />
      <rect x="-10" y="250" width="420" height="60" fill="#7a5a3a" />
      {/* cajón */}
      <rect x="110" y="110" width="180" height="140" fill="none" stroke="#8a6a3a" strokeWidth="8" />
      {/* capas o abono */}
      <g style={{ transition: suave, opacity: i < 3 ? 1 : 0 }}>
        {[0, 1, 2, 3, 4, 5].map((k) => <rect key={k} x="116" y={130 + k * 20} width="168" height="20" fill={k % 2 ? '#a07a3a' : '#7aa84a'} />)}
        <text x="140" y="148" fontSize="14">🍌</text><text x="230" y="188" fontSize="14">🍂</text><text x="180" y="228" fontSize="14">🥕</text>
      </g>
      <rect x="116" y="150" width="168" height="96" fill="#3a2a1a" style={{ transition: suave, opacity: i === 3 ? 1 : 0 }} />
      <Ver si={i === 0}><T x={340} y={150} t="verde y húmedo" c="#3f8a3a" /><T x={340} y={170} t="café y seco" c="#8a6a3a" /></Ver>
      <Ver si={i === 1}>
        {[150, 200, 250].map((x) => <path key={x} d={`M ${x} 105 q 8 -12 0 -24 q -8 -12 0 -24`} stroke={ROJO} strokeWidth="3" fill="none" />)}
        <T x={200} y={40} t="la pila llega a 50–60 °C" c={ROJO} s={13} />
        <text x="320" y="200" fontSize="18">🦠</text><text x="70" y="200" fontSize="18">🍄</text>
      </Ver>
      <Ver si={i === 2}><text x="330" y="160" fontSize="36">🔄</text><text x="60" y="160" fontSize="30">💧</text><T x={200} y={40} t="aire y humedad, como esponja exprimida" s={12} /></Ver>
      <Ver si={i === 3}><text x="200" y="210" textAnchor="middle" fontSize="22">🪱</text><text x="340" y="240" textAnchor="middle" fontSize="34">🌱</text><T x={200} y={40} t="2 a 3 meses: abono que huele a bosque" c="#3f8a3a" s={12} /></Ver>
      <Ver si={i === 0}><T x={200} y={40} t="capas alternadas en el cajón" s={12} /></Ver>
    </svg>
  )
}
