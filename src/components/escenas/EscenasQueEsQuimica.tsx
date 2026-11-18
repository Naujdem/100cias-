import type { ReactNode } from 'react'
// Escenas vivas de Química, área 1, tema 1 (¿Qué es la química?).

const suave = 'transform 1.1s cubic-bezier(.45,.05,.25,1), opacity 0.7s ease, fill 0.8s ease'
const TINTA = '#3a3a3a'
const AZUL = '#2f6db3'
const ROJO = '#c43c3c'
const CAFE = '#6b4226'

function T({ x, y, t, c = TINTA, s = 11, peso = 800 }: { x: number; y: number; t: string; c?: string; s?: number; peso?: number }) {
  return <text x={x} y={y} textAnchor="middle" fontSize={s} fontWeight={peso} fill={c} stroke="#fff" strokeWidth="3" paintOrder="stroke">{t}</text>
}
function Ver({ si, children }: { si: boolean; children: ReactNode }) {
  return <g style={{ transition: suave, opacity: si ? 1 : 0 }}>{children}</g>
}

/* ── Zoom a la materia: de la taza a los átomos ───────────────────────── */

const ZOOM = ['taza', 'gota', 'moleculas', 'atomos']

/** molécula de agua: O rojo con dos H blancos */
function Agua({ x, y, r = 0, k = 1 }: { x: number; y: number; r?: number; k?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${k})`}>
      <circle cx="-11" cy="9" r="7" fill="#f4f4f4" stroke="#888" />
      <circle cx="11" cy="9" r="7" fill="#f4f4f4" stroke="#888" />
      <circle cx="0" cy="0" r="11" fill={ROJO} />
    </g>
  )
}

export function EscenaMateriaZoom({ fase }: { fase: string }) {
  const i = Math.max(0, ZOOM.indexOf(fase))
  const moles: [number, number, number][] = [[80, 120, 10], [150, 90, -30], [230, 130, 60], [310, 95, 15], [110, 200, -50], [190, 180, 25], [270, 215, -10], [340, 180, 80], [60, 250, 40], [230, 260, -70]]
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`La materia de cerca: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={i <= 1 ? '#f6efe4' : '#eef3f8'} style={{ transition: suave }} />
      {/* la taza */}
      <Ver si={i === 0}>
        <path d="M 130 120 H 270 L 255 240 Q 200 255 145 240 Z" fill="#fff" stroke="#bbb" strokeWidth="3" />
        <path d="M 270 140 q 35 5 25 40 q -8 25 -35 25" fill="none" stroke="#bbb" strokeWidth="8" />
        <ellipse cx="200" cy="122" rx="68" ry="10" fill="#c8964b" />
        <path d="M 180 105 q -10 -20 5 -35 M 215 105 q 10 -20 -5 -35" stroke="#ccc" strokeWidth="3" fill="none" />
        <circle cx="200" cy="122" r="22" fill="none" stroke={AZUL} strokeWidth="3" strokeDasharray="5 4" />
      </Ver>
      {/* una gota grande */}
      <Ver si={i === 1}>
        <path d="M 200 50 C 260 140 290 180 290 210 A 90 90 0 0 1 110 210 C 110 180 140 140 200 50 Z" fill="#d9a85c" opacity="0.85" />
        {[[170, 190], [230, 220], [200, 160], [250, 180], [160, 235]].map(([x, y], k) => <circle key={k} cx={x} cy={y} r="3" fill={CAFE} opacity="0.6" />)}
        <circle cx="200" cy="200" r="30" fill="none" stroke={AZUL} strokeWidth="3" strokeDasharray="5 4" />
      </Ver>
      {/* moléculas de agua y de azúcar moviéndose */}
      <Ver si={i === 2}>
        {moles.map(([x, y, r], k) => <Agua key={k} x={x} y={y} r={r} />)}
        <g transform="translate(300 255)">
          <polygon points="-18,-10 0,-20 18,-10 18,10 0,20 -18,10" fill="#e8c27a" stroke={CAFE} strokeWidth="2" />
          <T x={0} y={36} t="azúcar" c={CAFE} s={10} />
        </g>
      </Ver>
      {/* una molécula separada en átomos */}
      <Ver si={i === 3}>
        <Agua x={200} y={150} k={4} />
        <T x={200} y={150} t="O" c="#fff" s={22} />
        <T x={156} y={198} t="H" s={18} />
        <T x={244} y={198} t="H" s={18} />
        <T x={200} y={260} t="2 átomos de hidrógeno + 1 de oxígeno = H₂O" c={AZUL} s={12} />
      </Ver>
      <T x={200} y={32} t={['Una taza de agua de panela', 'Una gota, mucho más de cerca', 'Moléculas que nunca se quedan quietas', 'Cada molécula está hecha de átomos'][i]} s={13} />
    </svg>
  )
}

/* ── La química del café: del grano a la taza ─────────────────────────── */

const CAFE_F = ['cereza', 'fermentacion', 'secado', 'tostion', 'taza']

export function EscenaCafeQuimica({ fase }: { fase: string }) {
  const i = Math.max(0, CAFE_F.indexOf(fase))
  const grano = ['#c0392b', '#d8c9a3', '#cdbb8a', '#4a2a17', '#4a2a17'][i]
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`La química del café: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#eef2e6" />
      <rect x="-10" y="250" width="420" height="60" fill="#a88c62" />
      {/* tanque de fermentación */}
      <Ver si={i === 1}>
        <rect x="120" y="120" width="160" height="130" rx="6" fill="#9fb7c4" stroke="#6d8794" strokeWidth="3" />
        {[[150, 150], [200, 135], [250, 160], [175, 180], [235, 195]].map(([x, y], k) => <circle key={k} cx={x} cy={y} r="5" fill="#fff" opacity="0.8" />)}
        <T x={200} y={110} t="microbios + azúcares del mucílago → ácidos y CO₂" s={11} c={AZUL} />
      </Ver>
      {/* patio de secado con sol */}
      <Ver si={i === 2}>
        <text x="330" y="90" textAnchor="middle" fontSize="44">☀️</text>
        <rect x="70" y="235" width="260" height="15" fill="#c9b48a" />
        {[110, 150, 190, 230, 270].map((x) => <path key={x} d={`M ${x} 210 q 5 -15 0 -30`} stroke="#9ab" strokeWidth="3" fill="none" />)}
        <T x={200} y={160} t="el agua se evapora" c={AZUL} />
      </Ver>
      {/* tostadora */}
      <Ver si={i === 3}>
        <text x="200" y="245" textAnchor="middle" fontSize="40">🔥</text>
        <T x={200} y={110} t="el calor crea cientos de sustancias nuevas" c={ROJO} />
      </Ver>
      {/* la taza */}
      <Ver si={i === 4}>
        <path d="M 150 170 H 250 L 240 245 Q 200 255 160 245 Z" fill="#fff" stroke="#bbb" strokeWidth="3" />
        <ellipse cx="200" cy="172" rx="48" ry="8" fill={CAFE} />
        <T x={200} y={130} t="el agua caliente disuelve aroma, sabor y cafeína" c={CAFE} />
      </Ver>
      {/* los granos que van cambiando */}
      <g style={{ transition: suave, transform: `translate(0px, ${[0, 20, 40, 60, 0][i]}px)`, opacity: i === 4 ? 0 : 1 }}>
        {[160, 200, 240].map((x) => <ellipse key={x} cx={x} cy={170} rx="15" ry="11" fill={grano} stroke="#3a2a1a" strokeWidth="1.5" style={{ transition: suave }} />)}
      </g>
      <T x={200} y={36} t={['Cosecha: la cereza roja y madura', 'Fermentación: los microbios trabajan', 'Secado: el grano pierde agua', 'Tostión: el grano cambia de color y de olor', 'La taza: el agua extrae el sabor'][i]} s={13} />
    </svg>
  )
}
