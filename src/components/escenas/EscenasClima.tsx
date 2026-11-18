import type { ReactNode } from 'react'
// Escenas vivas del área 5, tema 4 (Clima y cambio climático).

const suave = 'transform 1.1s cubic-bezier(.45,.05,.25,1), opacity 0.7s ease, fill 0.8s ease'
const TINTA = '#3a3a3a'
const ROJO = '#c43c3c'
const AZUL = '#2f7fc1'
const fondo = (c: string) => <rect x="-1500" y="-1500" width="3400" height="3300" fill={c} style={{ transition: 'fill 0.8s' }} />

function T({ x, y, t, c = TINTA, s = 11, peso = 800 }: { x: number; y: number; t: string; c?: string; s?: number; peso?: number }) {
  return <text x={x} y={y} textAnchor="middle" fontSize={s} fontWeight={peso} fill={c} stroke="#fff" strokeWidth="3" paintOrder="stroke">{t}</text>
}
function Ver({ si, children }: { si: boolean; children: ReactNode }) {
  return <g style={{ transition: suave, opacity: si ? 1 : 0 }}>{children}</g>
}

/* ── Efecto invernadero ───────────────────────────────────────────────── */

const INV = ['luz', 'calienta', 'infrarrojo', 'retienen', 'mas-gases']
const ondas = (x: number, y0: number, y1: number) => {
  let d = `M ${x} ${y0}`
  for (let y = y0; y > y1; y -= 16) d += ` q 8 -4 0 -8 q -8 -4 0 -8`
  return d
}

export function EscenaInvernadero({ fase }: { fase: string }) {
  const i = Math.max(0, INV.indexOf(fase))
  const gases = i >= 3 ? (i === 4 ? 26 : 12) : 0
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Efecto invernadero: ${fase}`} className="h-full w-full">
      {fondo('#0f2238')}
      <circle cx="40" cy="30" r="26" fill="#f4c542" />
      {/* atmósfera */}
      <path d="M -10 120 Q 200 70 410 120" fill="none" stroke="#9fc6ea" strokeWidth={6 + gases} opacity={0.35 + gases / 60} style={{ transition: 'all 1s ease' }} />
      <Ver si={i >= 3}>
        {Array.from({ length: i === 4 ? 16 : 7 }, (_, k) => <circle key={k} cx={20 + k * (i === 4 ? 24 : 55)} cy={106 - Math.sin((k / 15) * Math.PI) * 18} r="4" fill="#d7e8f6" />)}
        <T x={330} y={70} t={i === 4 ? 'más CO₂ y metano' : 'CO₂, metano, vapor'} c="#d7e8f6" s={10} />
      </Ver>
      {/* Tierra */}
      <path d="M -10 230 Q 200 200 410 230 V 310 H -10 Z" fill={i >= 1 ? (i === 4 ? '#c8783a' : '#8a9a4a') : '#5a7a4a'} style={{ transition: suave }} />
      {/* luz que llega */}
      <g style={{ transition: suave, opacity: i === 0 || i === 1 ? 1 : 0.3 }}>
        {[90, 160, 230].map((x) => <path key={x} d={`M ${x - 40} 45 L ${x} 205`} stroke="#f4c542" strokeWidth="4" markerEnd="url(#inv-a)" />)}
      </g>
      <defs><marker id="inv-a" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#f4c542" /></marker></defs>
      {/* infrarrojo que sale */}
      <Ver si={i >= 2}>
        {[110, 200, 290].map((x, k) => (
          <g key={x}>
            <path d={ondas(x, 205, i >= 3 && k !== 1 ? 125 : 20)} fill="none" stroke={ROJO} strokeWidth="3" />
            {i >= 3 && k !== 1 && <path d={ondas(x + 22, 205, 128)} fill="none" stroke={ROJO} strokeWidth="2" opacity="0.7" transform={`rotate(180 ${x + 22} 166)`} />}
          </g>
        ))}
      </Ver>
      <Ver si={i === 4}><path d={ondas(222, 205, 128)} fill="none" stroke={ROJO} strokeWidth="2" opacity="0.7" transform="rotate(180 222 166)" /></Ver>
      <T x={200} y={290} t={['La luz del Sol atraviesa el aire', 'el suelo y el mar se calientan', 'la Tierra suelta calor (infrarrojo)', 'los gases devuelven parte del calor: 15 °C', 'más gases: menos calor sale, la Tierra se calienta'][i]} c={i === 4 ? ROJO : TINTA} s={11} />
    </svg>
  )
}

/* ── Glaciares de Colombia ────────────────────────────────────────────── */

const GLA = ['1850', 'hoy', 'futuro']

export function EscenaGlaciares({ fase }: { fase: string }) {
  const i = Math.max(0, GLA.indexOf(fase))
  const nieve = [1, 0.35, 0.08][i]
  // la nieve baja hasta y = 60 + 120 * nieve
  const borde = 60 + 120 * nieve
  const ancho = (y: number) => ((y - 40) / 200) * 170
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Nevado: ${fase}`} className="h-full w-full">
      {fondo('#dcebf5')}
      <polygon points="30,240 200,40 370,240" fill="#7a746c" />
      <polygon points={`${200 - ancho(borde)},${borde} 200,40 ${200 + ancho(borde)},${borde}`} fill="#fff" style={{ transition: 'all 1.2s ease' }} />
      <rect x="-10" y="240" width="420" height="70" fill="#6a9a4a" />
      <T x={200} y={268} t={['1850 · unos 14 nevados en Colombia', 'hoy · quedan 6, con cerca del 90 % menos hielo', 'en unas décadas · podrían quedar casi sin hielo'][i]} c={i === 0 ? AZUL : ROJO} s={12} />
      <T x={330} y={70} t={['', '−90 %', '?'][i]} c={ROJO} s={22} />
    </svg>
  )
}

/* ── El Niño y La Niña ───────────────────────────────────────────────── */

const ENOS = ['normal', 'nino', 'nina']

export function EscenaEnos({ fase }: { fase: string }) {
  const i = Math.max(0, ENOS.indexOf(fase))
  const mar = ['#5aa0d6', '#e07a4a', '#3a6ab8'][i]
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`El Niño y La Niña: ${fase}`} className="h-full w-full">
      {fondo(['#e7f0f6', '#f6ecd8', '#dde6ef'][i])}
      {/* océano Pacífico a la izquierda, Colombia a la derecha */}
      <rect x="-10" y="60" width="210" height="240" fill={mar} style={{ transition: suave }} />
      <T x={95} y={180} t={['Pacífico normal', 'Pacífico más caliente', 'Pacífico más frío'][i]} c="#fff" s={12} />
      <path d="M 200 60 C 260 70 320 60 380 90 L 390 300 L 230 300 C 220 220 210 140 200 60 Z" fill="#8ab06a" />
      <T x={300} y={120} t="Colombia" s={13} />
      <Ver si={i === 0}><text x="300" y="180" textAnchor="middle" fontSize="34">🌦️</text><T x={300} y={230} t="lluvias normales" /></Ver>
      <Ver si={i === 1}><text x="275" y="180" textAnchor="middle" fontSize="30">☀️</text><text x="330" y="185" textAnchor="middle" fontSize="26">🔥</text><T x={300} y={230} t="sequía, incendios, ríos bajos" c={ROJO} /></Ver>
      <Ver si={i === 2}><text x="275" y="180" textAnchor="middle" fontSize="30">🌧️</text><text x="330" y="185" textAnchor="middle" fontSize="26">🌊</text><T x={300} y={230} t="lluvias fuertes, inundaciones" c={AZUL} /></Ver>
      <T x={200} y={36} t={['condiciones normales', 'El Niño', 'La Niña'][i]} c={[TINTA, ROJO, AZUL][i]} s={16} />
    </svg>
  )
}
