import type { ReactNode } from 'react'
// Escenas vivas del área 6, tema 5 (Sistema inmune).

const suave = 'transform 1.1s cubic-bezier(.45,.05,.25,1), opacity 0.7s ease, fill 0.8s ease, stroke 0.8s ease'
const TINTA = '#3a3a3a'
const AZUL = '#2f6fc1'
const ROJO = '#c43c3c'
const VERDE = '#3f9a5a'
const MORADO = '#7a4a9a'
const FONDO = '#f3f0ea'

function T({ x, y, t, c = TINTA, s = 12, peso = 800 }: { x: number; y: number; t: string; c?: string; s?: number; peso?: number }) {
  return <text x={x} y={y} textAnchor="middle" fontSize={s} fontWeight={peso} fill={c} stroke="#fff" strokeWidth="3" paintOrder="stroke">{t}</text>
}
function Ver({ si, children }: { si: boolean; children: ReactNode }) {
  return <g style={{ transition: suave, opacity: si ? 1 : 0 }}>{children}</g>
}
const idx = (lista: string[], fase: string) => Math.max(0, lista.indexOf(fase))

function Bacteria({ x, y, c = VERDE }: { x: number; y: number; c?: string }) {
  return <rect x={x - 9} y={y - 5} width="18" height="10" rx="5" fill={c} stroke="#2a6a3a" strokeWidth="1.5" />
}

/* ── 1. Tres líneas de defensa ──────────────────────────────────────────── */

const LINEAS = ['microbios', 'barreras', 'innata', 'adaptativa']

export function EscenaInmLineas({ fase }: { fase: string }) {
  const i = idx(LINEAS, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Líneas de defensa: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={FONDO} />
      <circle cx="200" cy="160" r="120" fill="none" stroke="#c9a070" strokeWidth={i >= 1 ? 12 : 2} style={{ transition: suave }} />
      <circle cx="200" cy="160" r="80" fill="none" stroke={ROJO} strokeWidth="6" strokeDasharray="10 6" style={{ transition: suave, opacity: i >= 2 ? 1 : 0 }} />
      <circle cx="200" cy="160" r="42" fill="none" stroke={MORADO} strokeWidth="6" style={{ transition: suave, opacity: i >= 3 ? 1 : 0 }} />
      <text x="200" y="172" textAnchor="middle" fontSize="30">🧍</text>
      {[[40, 50], [360, 70], [30, 250], [370, 260], [120, 30]].map(([x, y], k) => (
        <g key={k} style={{ transition: suave, transform: `translate(${i >= 1 ? 0 : (200 - x) * 0.35}px, ${i >= 1 ? 0 : (160 - y) * 0.35}px)` }}>
          <Bacteria x={x} y={y} />
        </g>
      ))}
      <Ver si={i === 0}><T x={200} y={22} t="Bacterias, virus, hongos y parásitos buscan entrar" c={VERDE} s={12} /></Ver>
      <Ver si={i === 1}><T x={200} y={22} t="1.ª línea: barreras (piel, moco, ácido)" c="#8a6030" s={13} /></Ver>
      <Ver si={i === 2}><T x={200} y={22} t="2.ª línea: defensa innata (inflamación, fagocitos)" c={ROJO} s={13} /></Ver>
      <Ver si={i === 3}><T x={200} y={22} t="3.ª línea: defensa adaptativa (anticuerpos, memoria)" c={MORADO} s={13} /></Ver>
    </svg>
  )
}

/* ── 2. Una herida: inflamación y fagocitosis ───────────────────────────── */

const HERIDA = ['herida', 'inflamacion', 'llegan', 'fagocitosis']

export function EscenaInmFagocito({ fase }: { fase: string }) {
  const i = idx(HERIDA, fase)
  const comidas = i >= 3
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Defensa innata: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={FONDO} />
      {/* piel con corte */}
      <path d="M 0 70 H 180 L 195 110 L 210 70 H 400 V 95 H 0 Z" fill="#e9b98f" />
      <rect x="0" y="95" width="400" height="205" fill={i >= 1 ? '#f6d2c4' : '#f6e3d3'} style={{ transition: suave }} />
      <T x={200} y={50} t="🌵 una espina rompe la piel" s={12} />
      {/* capilar */}
      <path d="M 20 250 H 380" stroke={ROJO} strokeWidth={i >= 1 ? 30 : 18} strokeLinecap="round" style={{ transition: suave }} />
      {[[180, 130], [210, 140], [195, 160], [225, 120]].map(([x, y], k) => (
        <g key={k} style={{ transition: suave, opacity: comidas ? 0 : 1 }}><Bacteria x={x} y={y} /></g>
      ))}
      <Ver si={i >= 1}>
        <T x={330} y={150} t="rojo, calor," c={ROJO} s={11} /><T x={330} y={166} t="hinchazón, dolor" c={ROJO} s={11} />
        <T x={90} y={225} t="el vaso se abre" c={ROJO} s={10} peso={700} />
      </Ver>
      {/* fagocitos */}
      {[[150, 250, 165, 150], [250, 250, 225, 140]].map(([x0, y0, x1, y1], k) => (
        <g key={k} style={{ transition: 'transform 1.4s ease, opacity 0.7s ease', opacity: i >= 2 ? 1 : 0, transform: `translate(${i >= 2 ? x1 - x0 : 0}px, ${i >= 2 ? y1 - y0 : 0}px)` }}>
          <path d={`M ${x0 - 22} ${y0} C ${x0 - 22} ${y0 - 26} ${x0 + 24} ${y0 - 24} ${x0 + 22} ${y0} C ${x0 + 26} ${y0 + 20} ${x0 - 18} ${y0 + 26} ${x0 - 22} ${y0} Z`} fill="#eef0ff" stroke={AZUL} strokeWidth="2.5" />
          <circle cx={x0 - 4} cy={y0} r="6" fill={MORADO} />
          {comidas && <rect x={x0 + 4} y={y0 - 6} width="12" height="7" rx="3" fill={VERDE} opacity="0.6" />}
        </g>
      ))}
      <Ver si={i === 2}><T x={200} y={290} t="los glóbulos blancos salen del vaso y van al sitio" c={AZUL} s={11} /></Ver>
      <Ver si={i === 3}><T x={200} y={290} t="fagocitosis: se «comen» a las bacterias" c={AZUL} s={11} /></Ver>
    </svg>
  )
}

/* ── 3. Defensa adaptativa: antígenos y anticuerpos ─────────────────────── */

const ADAP = ['antigeno', 'linfocito', 'anticuerpos', 'memoria']

function Anticuerpo({ x, y, rot = 0, c = MORADO }: { x: number; y: number; rot?: number; c?: string }) {
  return <path d="M 0 12 V 0 L -8 -10 M 0 0 L 8 -10" transform={`translate(${x} ${y}) rotate(${rot})`} stroke={c} strokeWidth="3.5" fill="none" strokeLinecap="round" />
}

export function EscenaInmAnticuerpos({ fase }: { fase: string }) {
  const i = idx(ADAP, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Defensa adaptativa: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={FONDO} />
      {/* virus con antígenos */}
      <g transform="translate(110 140)">
        <circle r="34" fill="#f2c26a" stroke="#b08020" strokeWidth="2" />
        {Array.from({ length: 8 }, (_, k) => {
          const a = (k / 8) * Math.PI * 2
          return <g key={k} transform={`translate(${Math.cos(a) * 40} ${Math.sin(a) * 40}) rotate(${(a * 180) / Math.PI + 90})`}><path d="M -6 0 L 0 -8 L 6 0 Z" fill={ROJO} /></g>
        })}
        <Ver si={i >= 2}>
          {Array.from({ length: 8 }, (_, k) => {
            const a = (k / 8) * Math.PI * 2
            return <Anticuerpo key={k} x={Math.cos(a) * 56} y={Math.sin(a) * 56} rot={(a * 180) / Math.PI + 90} />
          })}
        </Ver>
      </g>
      <Ver si={i === 0}><T x={110} y={210} t="antígenos: la «cara» del microbio" c={ROJO} s={11} /></Ver>
      {/* linfocito B */}
      <Ver si={i >= 1}>
        <circle cx="290" cy="130" r="38" fill="#eef0ff" stroke={MORADO} strokeWidth="3" />
        <circle cx="290" cy="130" r="22" fill={MORADO} opacity="0.8" />
        <T x={290} y={190} t="linfocito B" c={MORADO} s={12} />
      </Ver>
      <Ver si={i === 1}><T x={200} y={26} t="Un linfocito reconoce ese antígeno y se multiplica" c={MORADO} s={12} /></Ver>
      <Ver si={i === 2}>
        {[[250, 80], [330, 90], [250, 190], [340, 175]].map(([x, y], k) => <Anticuerpo key={k} x={x} y={y} rot={k * 40} />)}
        <T x={200} y={26} t="Fabrica anticuerpos que encajan como llave y cerradura" c={MORADO} s={12} />
        <T x={200} y={270} t="los microbios marcados se neutralizan y se destruyen" s={11} peso={600} />
      </Ver>
      <Ver si={i === 3}>
        <circle cx="350" cy="240" r="20" fill="#eef0ff" stroke={MORADO} strokeWidth="3" strokeDasharray="4 3" />
        <T x={350} y={276} t="memoria" c={MORADO} s={11} />
        <T x={200} y={26} t="Quedan linfocitos de memoria: la próxima vez, más rápido" c={MORADO} s={12} />
      </Ver>
    </svg>
  )
}

/* ── 4. La vacuna: primera y segunda respuesta ──────────────────────────── */

const VAC = ['sin', 'vacuna', 'segunda']
const yA = (v: number) => 240 - v * 1.6

export function EscenaInmVacuna({ fase }: { fase: string }) {
  const i = idx(VAC, fase)
  const umbral = 70
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`La vacuna: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={FONDO} />
      <rect x="50" y="60" width="330" height="180" fill="#fff" stroke="#bbb" />
      <line x1="50" y1={yA(umbral)} x2="380" y2={yA(umbral)} stroke={VERDE} strokeDasharray="6 4" strokeWidth="2" />
      <T x={330} y={yA(umbral) - 6} t="protege" c={VERDE} s={10} />
      <T x={20} y={150} t="anti-" s={10} peso={600} /><T x={20} y={163} t="cuerpos" s={10} peso={600} />
      <T x={215} y={262} t="días →" s={11} peso={600} />
      {/* sin vacuna: lenta y baja al principio; enfermedad */}
      <Ver si={i === 0}>
        <path d={`M 60 ${yA(0)} C 120 ${yA(0)} 140 ${yA(75)} 190 ${yA(80)} S 260 ${yA(30)} 370 ${yA(25)}`} fill="none" stroke={ROJO} strokeWidth="4" />
        <rect x="60" y="62" width="100" height="176" fill={ROJO} opacity="0.08" />
        <T x={110} y={80} t="🤒 enfermo" c={ROJO} s={11} />
        <T x={200} y={30} t="Sin vacuna: la primera respuesta tarda; mientras, te enfermas" c={ROJO} s={11} />
      </Ver>
      <Ver si={i >= 1}>
        <path d={`M 60 ${yA(0)} C 110 ${yA(0)} 120 ${yA(45)} 160 ${yA(45)} S 200 ${yA(25)} 230 ${yA(22)}`} fill="none" stroke={AZUL} strokeWidth="4" />
        <text x="70" y="90" fontSize="22">💉</text>
        <T x={130} y={yA(50) - 8} t="vacuna: microbio muerto o una parte" c={AZUL} s={10} />
      </Ver>
      <Ver si={i >= 2}>
        <path d={`M 230 ${yA(22)} C 245 ${yA(22)} 250 ${yA(105)} 275 ${yA(105)} S 330 ${yA(80)} 370 ${yA(78)}`} fill="none" stroke={MORADO} strokeWidth="5" />
        <text x="236" y="90" fontSize="20">🦠</text>
        <T x={300} y={yA(105) - 10} t="segunda vez: rápida y fuerte" c={MORADO} s={11} />
        <T x={200} y={30} t="La memoria responde antes de que te enfermes" c={MORADO} s={12} />
      </Ver>
    </svg>
  )
}
