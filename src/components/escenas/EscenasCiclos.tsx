import type { ReactNode } from 'react'
// Escenas vivas del área 5, tema 1 (Ciclos biogeoquímicos). El mismo paisaje para los cuatro ciclos: en cada fase
// aparece su flecha (animada); las de fases anteriores quedan tenues para ver el ciclo completo al final.

const suave = 'opacity 0.8s ease, fill 0.8s ease'
const TINTA = '#3a3a3a'
const AZUL = '#2f7fc1'

interface Flecha { d: string; t?: string; x?: number; y?: number; c?: string }
interface Fase { flechas: Flecha[]; extra?: ReactNode }

function Texto({ x, y, t, c = TINTA, s = 11, peso = 800 }: { x: number; y: number; t: string; c?: string; s?: number; peso?: number }) {
  return (
    <text x={x} y={y} textAnchor="middle" fontSize={s} fontWeight={peso} fill={c} stroke="#fff" strokeWidth="3" paintOrder="stroke">{t}</text>
  )
}

function Paisaje({ nube = 1, carbon = false }: { nube?: number; carbon?: boolean }) {
  return (
    <g>
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#e7f1f8" />
      <circle cx="45" cy="45" r="20" fill="#f4c542" />
      <g style={{ transition: 'opacity 0.8s', opacity: 0.55 + 0.45 * nube }}>
        <ellipse cx="235" cy="62" rx="40" ry="18" fill={nube > 0.5 ? '#c9d3dc' : '#fff'} style={{ transition: suave }} />
        <ellipse cx="262" cy="52" rx="28" ry="16" fill={nube > 0.5 ? '#c9d3dc' : '#fff'} style={{ transition: suave }} />
        <ellipse cx="210" cy="56" rx="24" ry="13" fill={nube > 0.5 ? '#c9d3dc' : '#fff'} style={{ transition: suave }} />
      </g>
      <polygon points="-10,245 65,140 145,245" fill="#9a8f84" />
      <polygon points="50,162 65,140 80,162" fill="#fff" />
      <rect x="-10" y="240" width="305" height="70" fill="#8a6a48" />
      <rect x="-10" y="282" width="305" height="30" fill={carbon ? '#2e2e2e' : '#7a5a3a'} style={{ transition: suave }} />
      <path d="M 290 228 H 410 V 310 H 290 Z" fill="#5aa0d6" />
      <path d="M 290 228 q 15 -6 30 0 t 30 0 t 30 0 t 30 0" fill="none" stroke="#fff" strokeWidth="2" />
      <path d="M 92 205 C 140 228 220 238 292 236" fill="none" stroke="#6fb2e0" strokeWidth="6" strokeLinecap="round" />
      <g transform="translate(175 242)">
        <rect x="-5" y="-48" width="10" height="48" fill="#7a5a3a" />
        <circle cy="-62" r="24" fill="#4f8f4f" /><circle cx="-15" cy="-50" r="15" fill="#4f8f4f" /><circle cx="15" cy="-50" r="15" fill="#4f8f4f" />
      </g>
      <text x="245" y="240" textAnchor="middle" fontSize="28">🐄</text>
    </g>
  )
}

function Flechas({ fases, i }: { fases: Fase[]; i: number }) {
  return (
    <g>
      <defs>
        {[...new Set(fases.flatMap((f) => f.flechas.map((fl) => fl.c ?? AZUL)))].map((c) => (
          <marker key={c} id={`ci-${c.slice(1)}`} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill={c} /></marker>
        ))}
      </defs>
      {fases.map((f, k) => (
        <g key={k} style={{ transition: suave, opacity: k === i ? 1 : k < i ? 0.3 : 0 }}>
          {f.extra}
          {f.flechas.map((fl, j) => (
            <g key={j}>
              <path d={fl.d} fill="none" stroke={fl.c ?? AZUL} strokeWidth="4" strokeLinecap="round" strokeDasharray="10 6" markerEnd={`url(#ci-${(fl.c ?? AZUL).slice(1)})`}>
                {k === i && <animate attributeName="stroke-dashoffset" from="32" to="0" dur="0.9s" repeatCount="indefinite" />}
              </path>
              {fl.t && k === i && <Texto x={fl.x ?? 0} y={fl.y ?? 0} t={fl.t} c={fl.c ?? AZUL} />}
            </g>
          ))}
        </g>
      ))}
    </g>
  )
}

function Ciclo({ ids, fases, fase, nombre, nube, carbon, encima }: { ids: string[]; fases: Fase[]; fase: string; nombre: string; nube?: (i: number) => number; carbon?: (i: number) => boolean; encima?: (i: number) => ReactNode }) {
  const i = Math.max(0, ids.indexOf(fase))
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`${nombre}: ${fase}`} className="h-full w-full">
      <Paisaje nube={nube ? nube(i) : 0} carbon={carbon ? carbon(i) : false} />
      <Flechas fases={fases} i={i} />
      {encima?.(i)}
    </svg>
  )
}

const lluvia = (x0: number) => Array.from({ length: 6 }, (_, k) => <line key={k} x1={x0 + k * 16} y1={85 + (k % 2) * 8} x2={x0 - 6 + k * 16} y2={105 + (k % 2) * 8} stroke={AZUL} strokeWidth="2.5" strokeLinecap="round" />)

/* ── Ciclo del agua ───────────────────────────────────────────────────── */

const AGUA = ['evaporacion', 'transpiracion', 'condensacion', 'precipitacion', 'escorrentia']
const FASES_AGUA: Fase[] = [
  { flechas: [{ d: 'M 350 215 C 350 160 320 110 285 80', t: 'vapor', x: 360, y: 150 }] },
  { flechas: [{ d: 'M 180 160 C 185 130 200 105 215 82', t: 'vapor de las hojas', x: 140, y: 120, c: '#3f9a5a' }] },
  { flechas: [], extra: <g><Texto x={235} y={30} t="el vapor se enfría → gotas" c={AZUL} /></g> },
  { flechas: [], extra: <g>{lluvia(80)}{lluvia(190)}<Texto x={135} y={130} t="lluvia" c={AZUL} /></g> },
  {
    flechas: [
      { d: 'M 150 230 C 200 236 250 238 300 238', t: 'escorrentía', x: 230, y: 222 },
      { d: 'M 120 248 V 276', t: 'infiltración', x: 120, y: 296 },
    ],
  },
]

export function EscenaCicloAgua({ fase }: { fase: string }) {
  return <Ciclo ids={AGUA} fases={FASES_AGUA} fase={fase} nombre="Ciclo del agua" nube={(i) => (i >= 2 ? 1 : 0.3)} />
}

/* ── Ciclo del carbono ────────────────────────────────────────────────── */

const VERDE = '#3f9a5a'
const GRIS = '#6a6a6a'
const CARBONO = ['fotosintesis', 'alimentacion', 'respiracion', 'descomposicion', 'oceano', 'combustion']
const FASES_CARBONO: Fase[] = [
  { flechas: [{ d: 'M 150 108 C 160 125 165 140 168 160', t: 'CO₂ → azúcares', x: 110, y: 140, c: VERDE }] },
  { flechas: [{ d: 'M 195 200 C 210 205 222 210 232 214', t: 'comer', x: 215, y: 192, c: VERDE }] },
  {
    flechas: [
      { d: 'M 255 205 C 255 170 240 140 215 115', t: 'CO₂', x: 262, y: 160, c: GRIS },
      { d: 'M 190 162 C 195 145 198 130 202 115', c: GRIS },
    ],
  },
  { flechas: [{ d: 'M 110 255 C 105 220 120 150 150 112', t: 'hongos y bacterias', x: 75, y: 200, c: GRIS }], extra: <text x="110" y="268" textAnchor="middle" fontSize="18">🍄</text> },
  {
    flechas: [
      { d: 'M 230 110 C 280 120 320 160 335 215', t: 'se disuelve', x: 330, y: 150 },
      { d: 'M 380 280 V 296', c: '#b0a090' },
    ],
    extra: <Texto x={350} y={272} t="conchas → rocas" c="#8a7a6a" s={10} />,
  },
  {
    flechas: [{ d: 'M 30 215 C 40 170 90 130 140 112', t: 'humo con CO₂', x: 45, y: 150, c: '#c43c3c' }],
    extra: <g><text x="30" y="238" textAnchor="middle" fontSize="26">🏭</text><Texto x={140} y={296} t="carbón y petróleo: carbono de hace millones de años" c="#fff" s={9} /></g>,
  },
]

export function EscenaCicloCarbono({ fase }: { fase: string }) {
  return (
    <Ciclo ids={CARBONO} fases={FASES_CARBONO} fase={fase} nombre="Ciclo del carbono" nube={() => 0} carbon={(i) => i === 5}
      encima={() => <g><circle cx="190" cy="100" r="20" fill="#fff" stroke={GRIS} strokeWidth="2" /><Texto x={190} y={104} t="CO₂" c={GRIS} s={12} /></g>} />
  )
}

/* ── Ciclo del nitrógeno ──────────────────────────────────────────────── */

const MOR = '#8a5aa8'
const NITROGENO = ['fijacion', 'asimilacion', 'amonificacion', 'nitrificacion', 'desnitrificacion']
const FASES_NITROGENO: Fase[] = [
  {
    flechas: [{ d: 'M 110 108 C 105 150 100 200 98 248', t: 'bacterias fijadoras', x: 60, y: 175, c: MOR }],
    extra: <g><text x="98" y="240" textAnchor="middle" fontSize="20">🫘</text>{[90, 98, 106].map((x) => <circle key={x} cx={x} cy={258} r="4" fill="#e8c8a0" stroke={MOR} />)}<text x="232" y="98" fontSize="18">⚡</text></g>,
  },
  { flechas: [{ d: 'M 160 262 C 168 240 172 225 175 205', t: 'raíces', x: 140, y: 230, c: VERDE }, { d: 'M 195 200 C 210 205 222 210 232 214', c: VERDE }] },
  { flechas: [{ d: 'M 250 248 C 245 262 230 268 215 268', t: 'amonio', x: 250, y: 280, c: '#a06a2a' }], extra: <text x="200" y="274" textAnchor="middle" fontSize="16">🍄</text> },
  { flechas: [{ d: 'M 190 268 H 150', t: 'amonio → nitratos', x: 170, y: 296, c: MOR }] },
  { flechas: [{ d: 'M 60 262 C 40 220 70 140 140 110', t: 'N₂ de vuelta al aire', x: 55, y: 140, c: MOR }] },
]

export function EscenaCicloNitrogeno({ fase }: { fase: string }) {
  return (
    <Ciclo ids={NITROGENO} fases={FASES_NITROGENO} fase={fase} nombre="Ciclo del nitrógeno" nube={() => 0.6}
      encima={() => <g><rect x="140" y="90" width="76" height="26" rx="13" fill="#fff" stroke={MOR} strokeWidth="2" /><Texto x={178} y={107} t="N₂ (78 %)" c={MOR} s={11} /></g>} />
  )
}

/* ── Ciclo del fósforo ────────────────────────────────────────────────── */

const CAFE = '#a06a2a'
const FOSFORO = ['rocas', 'plantas', 'animales', 'descomposicion', 'sedimentos']
const FASES_FOSFORO: Fase[] = [
  { flechas: [{ d: 'M 100 215 C 115 240 135 255 150 262', t: 'fosfatos', x: 150, y: 285, c: CAFE }], extra: <g>{lluvia(40)}</g> },
  { flechas: [{ d: 'M 160 262 C 168 240 172 225 175 205', t: 'raíces', x: 140, y: 230, c: VERDE }] },
  { flechas: [{ d: 'M 195 200 C 210 205 222 210 232 214', t: 'ADN, ATP, huesos', x: 240, y: 192, c: VERDE }] },
  { flechas: [{ d: 'M 250 248 C 245 262 230 268 200 266', t: 'restos', x: 250, y: 282, c: CAFE }], extra: <text x="190" y="272" textAnchor="middle" fontSize="16">🍄</text> },
  {
    flechas: [{ d: 'M 300 238 C 330 255 355 270 370 290', c: CAFE }, { d: 'M 330 296 C 250 300 90 292 75 215', t: 'millones de años', x: 200, y: 296, c: '#8a7a6a' }],
    extra: <g>{[0, 1, 2].map((k) => <rect key={k} x="295" y={284 + k * 6} width="110" height="4" fill="#c8b89a" />)}</g>,
  },
]

export function EscenaCicloFosforo({ fase }: { fase: string }) {
  return (
    <Ciclo ids={FOSFORO} fases={FASES_FOSFORO} fase={fase} nombre="Ciclo del fósforo" nube={() => 0.3}
      encima={() => <g><rect x="140" y="92" width="120" height="26" rx="13" fill="#fff" stroke="#c43c3c" strokeWidth="2" /><Texto x={200} y={109} t="no pasa por el aire" c="#c43c3c" s={11} /></g>} />
  )
}
