// Escenas vivas del área 3 (Relaciones ecosistémicas), tema 1: qué es la ecología, niveles ecológicos (zoom
// desde un frailejón hasta la biosfera) y hábitat y nicho.
import type { ReactNode } from 'react'

const suave = 'transform 1.1s cubic-bezier(.45,.05,.25,1), opacity 0.7s ease'
const ver = (si: boolean, mover = 'none', quieto = 'none') => ({ transition: suave, opacity: si ? 1 : 0, transform: si ? mover : quieto })
const fondo = (color: string) => <rect x="-1500" y="-1500" width="3400" height="3300" fill={color} style={{ transition: 'fill 0.8s' }} />

const VERDE = '#3f9a5a'
const AZUL = '#3f6fb8'
const MOR = '#8a5aa8'
const TIERRA = '#8a6a42'
const TINTA = '#3a3a3a'
const ROJO = '#c43c3c'

function Texto({ x, y, t, c = TINTA, s = 12, peso = 800 }: { x: number; y: number; t: string; c?: string; s?: number; peso?: number }) {
  return <text x={x} y={y} textAnchor="middle" fontSize={s} fontWeight={peso} fill={c}>{t}</text>
}

/* ── seres del páramo ─────────────────────────────────────────────────── */

export function Frailejon({ x, y, k = 1 }: { x: number; y: number; k?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <rect x="-7" y="-60" width="14" height="60" rx="5" fill="#7a6248" />
      {[-50, -38, -26, -14].map((d) => <path key={d} d={`M -9 ${d} q 9 8 18 0`} fill="none" stroke="#a08a6a" strokeWidth="3" />)}
      {[-60, -35, -10, 15, 40, 65, 90, 115, 140, 165, 190, 215].map((a) => (
        <ellipse key={a} cx="0" cy="-60" rx="5" ry="16" fill="#a9b89a" stroke="#8a9a7a" strokeWidth="1" transform={`rotate(${a} 0 -60) translate(0 -12)`} />
      ))}
      <path d="M 0 -72 q 4 -14 0 -26 M 6 -70 q 10 -10 10 -22" stroke="#7a8a5a" strokeWidth="2" fill="none" />
      <circle cx="0" cy="-99" r="5" fill="#f2c94c" /><circle cx="16" cy="-93" r="5" fill="#f2c94c" />
    </g>
  )
}
function Colibri({ x, y, k = 1 }: { x: number; y: number; k?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <ellipse cx="0" cy="0" rx="10" ry="6" fill="#2e8a6a" />
      <circle cx="9" cy="-3" r="4.5" fill="#2e8a6a" />
      <path d="M 13 -3 L 26 -1" stroke={TINTA} strokeWidth="1.6" />
      <ellipse cx="-2" cy="-8" rx="9" ry="3" fill="#7fc3a8" transform="rotate(-30 -2 -8)" />
      <path d="M -10 0 l -8 4 l 2 -6 z" fill="#2e8a6a" />
    </g>
  )
}
function Venado({ x, y, k = 1 }: { x: number; y: number; k?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`} fill="#a8794a">
      <ellipse cx="0" cy="0" rx="20" ry="10" />
      {[-14, -6, 8, 15].map((lx) => <rect key={lx} x={lx - 1.5} y="6" width="3" height="16" />)}
      <path d="M 16 -4 l 8 -16 l 6 2 l -6 14 z" />
      <circle cx="28" cy="-20" r="5" />
      <path d="M 26 -24 l -2 -8 M 30 -24 l 3 -8" stroke="#6a4a2a" strokeWidth="1.5" />
    </g>
  )
}
function Oso({ x, y, k = 1 }: { x: number; y: number; k?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <ellipse cx="0" cy="0" rx="24" ry="15" fill="#2a2a2a" />
      {[-16, -6, 8, 17].map((lx) => <rect key={lx} x={lx - 3} y="8" width="7" height="12" rx="3" fill="#2a2a2a" />)}
      <circle cx="24" cy="-10" r="10" fill="#2a2a2a" />
      <circle cx="20" cy="-19" r="3.5" fill="#2a2a2a" /><circle cx="29" cy="-19" r="3.5" fill="#2a2a2a" />
      <ellipse cx="27" cy="-9" rx="5" ry="3.5" fill="#e8d4a8" />
      <circle cx="24" cy="-12" r="2.4" fill="none" stroke="#e8d4a8" strokeWidth="1.3" />
    </g>
  )
}
function Rana({ x, y, k = 1 }: { x: number; y: number; k?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`} fill="#5aa04a">
      <ellipse cx="0" cy="0" rx="14" ry="9" />
      <circle cx="-6" cy="-8" r="4" /><circle cx="6" cy="-8" r="4" />
      <circle cx="-6" cy="-9" r="1.6" fill={TINTA} /><circle cx="6" cy="-9" r="1.6" fill={TINTA} />
      <path d="M -12 4 q -10 4 -12 10 M 12 4 q 10 4 12 10" stroke="#5aa04a" strokeWidth="3" fill="none" />
    </g>
  )
}
function Suelo({ color = '#c9cf9a' }: { color?: string }) {
  return <path d="M -10 210 Q 100 190 200 205 T 410 200 V 310 H -10 Z" fill={color} />
}

/* ── ¿Qué es la ecología? ─────────────────────────────────────────────── */

const QUE = ['organismo', 'otros', 'entorno', 'ecologia']

export function EscenaEcologiaQue({ fase }: { fase: string }) {
  const i = Math.max(0, QUE.indexOf(fase))
  const flecha = (x1: number, y1: number, x2: number, y2: number, c: string) => <path d={`M ${x1} ${y1} L ${x2} ${y2}`} stroke={c} strokeWidth="2.5" strokeDasharray="5 4" />
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Qué es la ecología: ${fase}`} className="h-full w-full">
      {fondo('#eef4ee')}
      <ellipse cx="200" cy="230" rx="150" ry="30" fill="#9cc4e0" />
      <Rana x={200} y={200} k={2} />
      <g style={ver(i === 0)}><Texto x={200} y={40} t="Una rana en una laguna" s={13} /></g>
      <g style={ver(i >= 1 && i <= 2)}>
        {flecha(180, 180, 90, 90, VERDE)}{flecha(220, 180, 310, 90, VERDE)}{flecha(200, 230, 200, 270, VERDE)}
        <circle cx="80" cy="80" r="6" fill={TINTA} /><path d="M 74 76 l -8 -6 M 86 76 l 8 -6" stroke={TINTA} strokeWidth="1.5" />
        <Texto x={80} y={64} t="come insectos" c={VERDE} s={10} />
        <path d="M 300 50 q 10 -20 20 0 v 40 h -20 z" fill="#e8e8e8" stroke="#aaa" /><path d="M 320 52 l 18 6" stroke="#e0a020" strokeWidth="3" />
        <Texto x={320} y={110} t="la garza se la come" c={VERDE} s={10} />
        <Texto x={200} y={290} t="plantas donde vive y se esconde" c={VERDE} s={10} />
      </g>
      <g style={ver(i === 2)}>
        <circle cx="350" cy="190" r="16" fill="#f2c94c" />
        <Texto x={350} y={222} t="luz y calor" c="#b07a00" s={10} />
        <Texto x={60} y={200} t="agua" c={AZUL} s={11} />
        <Texto x={200} y={30} t="…y con lo que no está vivo: agua, luz, temperatura" s={12} />
      </g>
      <g style={ver(i === 1)}><Texto x={200} y={30} t="Se relaciona con otros seres vivos…" s={12} /></g>
      <g style={ver(i === 3)}>
        <rect x="70" y="40" width="260" height="90" rx="14" fill="#fff" stroke={VERDE} strokeWidth="2.5" />
        <Texto x={200} y={70} t="Ecología" c={VERDE} s={18} />
        <Texto x={200} y={92} t="estudia las relaciones de los seres vivos" s={11} peso={600} />
        <Texto x={200} y={108} t="entre sí y con su entorno" s={11} peso={600} />
        <Texto x={200} y={124} t="(del griego oikos, «casa»)" s={9} peso={600} />
      </g>
    </svg>
  )
}

/* ── Niveles ecológicos: del frailejón a la biosfera ──────────────────── */

const NIV = ['individuo', 'poblacion', 'comunidad', 'ecosistema', 'bioma', 'biosfera']
const NOMBRE = ['Individuo', 'Población', 'Comunidad', 'Ecosistema', 'Bioma', 'Biosfera']
const DEF = [
  'un solo ser vivo: un frailejón',
  'todos los frailejones de la misma especie en el lugar',
  'todas las poblaciones que viven juntas',
  'la comunidad más lo que no está vivo: agua, suelo, clima',
  'ecosistemas parecidos en una gran región: los páramos',
  'todas las partes de la Tierra donde hay vida',
]

function Nivel({ k, i, children }: { k: number; i: number; children: ReactNode }) {
  const t = i === k ? 'none' : i > k ? 'scale(0.25)' : 'scale(3)'
  return <g style={{ transition: suave, opacity: i === k ? 1 : 0, transform: t, transformOrigin: '200px 170px' }}>{children}</g>
}
const FRAILES: [number, number, number][] = [[200, 230, 0.8], [130, 215, 0.55], [270, 218, 0.6], [80, 225, 0.5], [330, 228, 0.55], [160, 250, 0.45], [240, 255, 0.5], [60, 260, 0.4], [350, 262, 0.45]]

export function EscenaNivelesEcologicos({ fase }: { fase: string }) {
  const i = Math.max(0, NIV.indexOf(fase))
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Niveles ecológicos: ${NOMBRE[i]}`} className="h-full w-full">
      {fondo(i === 5 ? '#0f1a2e' : i === 4 ? '#dfe9f2' : '#e9eef2')}
      <Nivel k={0} i={i}><Suelo /><Frailejon x={200} y={250} k={1.9} /></Nivel>
      <Nivel k={1} i={i}><Suelo />{FRAILES.map(([x, y, k], j) => <Frailejon key={j} x={x} y={y} k={k} />)}</Nivel>
      <Nivel k={2} i={i}>
        <Suelo />{FRAILES.slice(0, 5).map(([x, y, k], j) => <Frailejon key={j} x={x} y={y} k={k} />)}
        <Oso x={300} y={262} k={0.9} /><Venado x={100} y={262} k={0.9} /><Colibri x={230} y={130} k={1.3} /><Rana x={180} y={278} k={0.8} />
        {[40, 150, 260, 370].map((x) => <path key={x} d={`M ${x} 210 l -6 -18 M ${x} 210 l 0 -20 M ${x} 210 l 6 -18`} stroke="#b5a85a" strokeWidth="2" />)}
      </Nivel>
      <Nivel k={3} i={i}>
        <circle cx="340" cy="60" r="22" fill="#f2c94c" />
        <path d="M 30 90 q 30 -20 60 0 q 30 -20 60 0" fill="none" stroke="#fff" strokeWidth="10" strokeLinecap="round" opacity="0.9" />
        <Suelo />
        <ellipse cx="290" cy="250" rx="70" ry="16" fill="#7fb0d8" />
        {FRAILES.slice(0, 4).map(([x, y, k], j) => <Frailejon key={j} x={x - 30} y={y} k={k} />)}
        <Venado x={100} y={262} k={0.8} /><Colibri x={210} y={130} k={1.1} />
        <rect x="-10" y="285" width="420" height="20" fill={TIERRA} />
        <Texto x={290} y={238} t="agua" c={AZUL} s={10} /><Texto x={340} y={96} t="luz" c="#b07a00" s={10} /><Texto x={60} y={80} t="niebla, frío" c="#7a8a9a" s={10} /><Texto x={200} y={298} t="suelo" c="#fff" s={10} />
      </Nivel>
      <Nivel k={4} i={i}>
        <path d="M -10 260 L 80 120 L 140 180 L 210 70 L 290 170 L 340 110 L 410 260 Z" fill="#5f8a5a" />
        <path d="M 52 163 L 80 120 L 108 150 Z M 180 116 L 210 70 L 245 120 Z M 320 140 L 340 110 L 360 150 Z" fill="#a9b89a" />
        <path d="M 196 92 L 210 70 L 224 92 Z" fill="#fff" />
        <Texto x={210} y={140} t="páramo" c="#4a5a3a" s={10} /><Texto x={120} y={230} t="bosque andino" c="#e8f0e0" s={10} />
      </Nivel>
      <Nivel k={5} i={i}>
        <circle cx="200" cy="160" r="96" fill="#2f6fb0" />
        <path d="M 150 100 q 30 -20 50 10 q -10 30 10 50 q -30 30 -40 60 q -20 -40 -30 -60 q -10 -30 10 -60 z" fill="#5f9a4a" />
        <path d="M 230 90 q 30 0 40 30 q -20 10 -30 30 q -20 -30 -10 -60 z" fill="#5f9a4a" />
        <circle cx="200" cy="160" r="104" fill="none" stroke="#8fc3f0" strokeWidth="5" opacity="0.6" />
      </Nivel>
      <rect x="10" y="10" width="250" height="44" rx="10" fill="#fff" opacity="0.9" />
      <text x="20" y="29" fontSize="14" fontWeight="900" fill={VERDE}>{NOMBRE[i]}</text>
      <text x="20" y="46" fontSize="10" fontWeight="600" fill={TINTA}>{DEF[i]}</text>
      {NIV.map((_, k) => <circle key={k} cx={320 + k * 13} cy={22} r={k === i ? 5 : 3.5} fill={k <= i ? VERDE : '#b8c4b8'} />)}
    </svg>
  )
}

/* ── Hábitat y nicho ──────────────────────────────────────────────────── */

const HN = ['habitat', 'nicho-colibri', 'nicho-carpintero', 'direccion', 'competencia']

function Arbol({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x - 10} y={y - 120} width="20" height="120" fill="#7a5a3a" />
      <circle cx={x} cy={y - 140} r="50" fill="#5f9a5a" />
      <circle cx={x - 30} cy={y - 115} r="30" fill="#6aa864" /><circle cx={x + 32} cy={y - 118} r="32" fill="#6aa864" />
    </g>
  )
}
function Carpintero({ x, y, k = 1 }: { x: number; y: number; k?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <ellipse cx="0" cy="0" rx="7" ry="14" fill="#2a2a2a" />
      <circle cx="0" cy="-15" r="7" fill="#2a2a2a" />
      <path d="M -3 -22 q 3 -6 6 0 z" fill="#c43c3c" />
      <path d="M -6 -15 L -16 -14" stroke="#c9a14a" strokeWidth="2.5" />
      <path d="M 0 14 l 4 10" stroke="#2a2a2a" strokeWidth="3" />
    </g>
  )
}

export function EscenaHabitatNicho({ fase }: { fase: string }) {
  const i = Math.max(0, HN.indexOf(fase))
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Hábitat y nicho: ${fase}`} className="h-full w-full">
      {fondo('#eef4ee')}
      <rect x="-10" y="250" width="420" height="60" fill="#9ab07a" />
      <Arbol x={110} y={260} /><Arbol x={290} y={260} />
      {[[190, 250], [205, 246], [220, 250]].map(([x, y], k) => <g key={k}><path d={`M ${x} 260 V ${y - 20}`} stroke={VERDE} strokeWidth="3" /><circle cx={x} cy={y - 26} r="8" fill="#e0607a" /></g>)}
      <g style={{ transition: suave, opacity: i === 2 ? 0.35 : 1 }}><Colibri x={196} y={208} k={1.4} /></g>
      <g style={{ transition: suave, opacity: i === 1 ? 0.35 : 1 }}><Carpintero x={124} y={186} k={1.3} /></g>
      <g style={ver(i === 4)}><Colibri x={226} y={200} k={1.4} /><Texto x={290} y={286} t="otra especie de colibrí" c={MOR} s={10} /></g>
      <rect x="10" y="10" width="380" height="60" rx="12" fill="#fff" opacity="0.92" />
      <g style={ver(i === 0)}><Texto x={200} y={36} t="Hábitat: el lugar donde vive un ser vivo" c={VERDE} s={13} /><Texto x={200} y={56} t="Colibrí y carpintero viven en el mismo bosque" s={11} peso={600} /></g>
      <g style={ver(i === 1)}><Texto x={200} y={36} t="Nicho del colibrí: chupa néctar y poliniza" c="#2e8a6a" s={13} /><Texto x={200} y={56} t="Su papel en el ecosistema" s={11} peso={600} /></g>
      <g style={ver(i === 2)}><Texto x={200} y={36} t="Nicho del carpintero: come insectos de la corteza" c={TINTA} s={12} /><Texto x={200} y={56} t="y hace huecos que usan otros animales" s={11} peso={600} /></g>
      <g style={ver(i === 3)}><Texto x={200} y={36} t="El hábitat es la «dirección»;" s={13} /><Texto x={200} y={56} t="el nicho es la «profesión»" c={MOR} s={13} /></g>
      <g style={ver(i === 4)}><Texto x={200} y={36} t="Dos especies con el mismo nicho compiten:" s={12} /><Texto x={200} y={56} t="una gana o se reparten el recurso" c={MOR} s={12} /></g>
    </svg>
  )
}

/* ── Tema 2 · Factores bióticos y abióticos ───────────────────────────── */

const FAC = ['paisaje', 'bioticos', 'abioticos', 'juntos']

function Marca({ x, y, t, c }: { x: number; y: number; t: string; c: string }) {
  return (
    <g>
      <rect x={x - t.length * 3.3 - 8} y={y - 12} width={t.length * 6.6 + 16} height="20" rx="10" fill={c} />
      <Texto x={x} y={y + 2} t={t} c="#fff" s={10} />
    </g>
  )
}

export function EscenaFactores({ fase }: { fase: string }) {
  const i = Math.max(0, FAC.indexOf(fase))
  const bio = i === 1 || i === 3
  const abio = i === 2 || i === 3
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Factores bióticos y abióticos: ${fase}`} className="h-full w-full">
      {fondo('#e9eef2')}
      <circle cx="340" cy="56" r="22" fill="#f2c94c" />
      <Suelo />
      <ellipse cx="290" cy="250" rx="70" ry="16" fill="#7fb0d8" />
      <rect x="-10" y="282" width="420" height="22" fill={TIERRA} />
      <Frailejon x={90} y={245} k={0.8} /><Frailejon x={150} y={238} k={0.6} />
      <Venado x={210} y={252} k={0.8} /><Colibri x={150} y={110} k={1.2} />
      <g style={ver(i === 0)}><Texto x={170} y={40} t="Un páramo: ¿qué hay en él?" s={13} /></g>
      <g style={ver(bio)}>
        <Marca x={90} y={140} t="planta" c={VERDE} /><Marca x={210} y={214} t="animal" c={VERDE} /><Marca x={150} y={84} t="ave" c={VERDE} />
        <Marca x={60} y={276} t="hongos y bacterias" c={VERDE} />
      </g>
      <g style={ver(abio)}>
        <Marca x={340} y={96} t="luz" c={AZUL} /><Marca x={290} y={250} t="agua" c={AZUL} /><Marca x={330} y={294} t="suelo" c={AZUL} />
        <Marca x={250} y={60} t="temperatura" c={AZUL} /><Marca x={250} y={150} t="aire" c={AZUL} />
      </g>
      <rect x="10" y="10" width="190" height="40" rx="10" fill="#fff" opacity="0.9" style={{ transition: 'opacity 0.6s', opacity: i === 0 ? 0 : 0.9 }} />
      <g style={ver(i === 1)}><text x="20" y="35" fontSize="12" fontWeight="900" fill={VERDE}>Bióticos: los seres vivos</text></g>
      <g style={ver(i === 2)}><text x="20" y="35" fontSize="12" fontWeight="900" fill={AZUL}>Abióticos: lo que no está vivo</text></g>
      <g style={ver(i === 3)}><text x="20" y="35" fontSize="12" fontWeight="900" fill={TINTA}>Todos se afectan entre sí</text></g>
    </svg>
  )
}

/* ── Tema 2 · Pisos térmicos ──────────────────────────────────────────── */

export const PISOS = [
  { id: 'calido', nombre: 'Cálido', desde: 0, hasta: 1000, t: 'más de 24 °C', ej: 'cacao, plátano, arroz', c: '#e8b25a' },
  { id: 'templado', nombre: 'Templado', desde: 1000, hasta: 2000, t: '18 a 24 °C', ej: 'café, caña', c: '#a8c46a' },
  { id: 'frio', nombre: 'Frío', desde: 2000, hasta: 3000, t: '12 a 18 °C', ej: 'papa, fresa, bosque de niebla', c: '#6aa888' },
  { id: 'paramo', nombre: 'Páramo', desde: 3000, hasta: 4700, t: '2 a 12 °C', ej: 'frailejones, lagunas', c: '#a9b89a' },
  { id: 'nival', nombre: 'Nival', desde: 4700, hasta: 5800, t: 'menos de 2 °C', ej: 'nieve y glaciares', c: '#eef2f6' },
]
const PIS = ['subir', ...PISOS.map((p) => p.id)]

export function EscenaPisos({ fase }: { fase: string }) {
  const i = Math.max(0, PIS.indexOf(fase))
  const yDe = (m: number) => 270 - (m / 5800) * 230
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Pisos térmicos: ${fase}`} className="h-full w-full">
      {fondo('#eef3f8')}
      <defs><clipPath id="pt-monte"><path d="M 60 270 L 220 40 L 310 150 L 390 270 Z" /></clipPath></defs>
      <g clipPath="url(#pt-monte)">
        {PISOS.map((p, k) => (
          <rect key={p.id} x="0" y={yDe(p.hasta)} width="400" height={yDe(p.desde) - yDe(p.hasta)} fill={p.c}
            style={{ transition: 'opacity 0.6s', opacity: i === 0 || i === k + 1 ? 1 : 0.45 }} />
        ))}
      </g>
      <path d="M 60 270 L 220 40 L 310 150 L 390 270" fill="none" stroke="#6a7a6a" strokeWidth="2" />
      {[0, 1000, 2000, 3000, 4000, 5000].map((m) => <g key={m}><line x1="44" x2="52" y1={yDe(m)} y2={yDe(m)} stroke="#888" /><text x="40" y={yDe(m) + 4} textAnchor="end" fontSize="9" fill={TINTA}>{m}</text></g>)}
      <text x="40" y="26" textAnchor="end" fontSize="9" fontWeight="700" fill={TINTA}>m</text>
      <g style={ver(i === 0)}><Texto x={300} y={60} t="Al subir una montaña," s={12} /><Texto x={300} y={76} t="la temperatura baja" s={12} /><Texto x={300} y={92} t="≈ 0,6 °C cada 100 m" c={ROJO} s={11} /></g>
      {PISOS.map((p, k) => (
        <g key={p.id} style={ver(i === k + 1)}>
          <line x1="56" x2="250" y1={(yDe(p.desde) + yDe(p.hasta)) / 2} y2={(yDe(p.desde) + yDe(p.hasta)) / 2} stroke={TINTA} strokeDasharray="4 3" />
          <rect x="236" y="34" width="156" height="70" rx="10" fill="#fff" opacity="0.95" />
          <Texto x={314} y={54} t={`Piso ${p.nombre.toLowerCase()}`} s={13} />
          <Texto x={314} y={70} t={`${p.desde}–${p.hasta} m · ${p.t}`} s={9} peso={600} />
          <Texto x={314} y={90} t={p.ej} c={VERDE} s={10} />
        </g>
      ))}
    </svg>
  )
}

/* ── Tema 2 · Ecosistemas de Colombia (mapa esquemático) ──────────────── */

const ECOS = [
  { id: 'paramo', nombre: 'Páramo', x: 150, y: 140, c: '#a9b89a', texto: 'Alta montaña andina: frío, niebla y frailejones. Fábrica de agua.' },
  { id: 'selva', nombre: 'Selva húmeda', x: 200, y: 220, c: '#2f7a46', texto: 'Amazonía y Chocó: lluvia todo el año y la mayor diversidad.' },
  { id: 'bosque-seco', nombre: 'Bosque seco', x: 135, y: 170, c: '#c9a46a', texto: 'Valles cálidos como el del Magdalena. La Tatacoa (Huila) es bosque seco muy degradado.' },
  { id: 'sabana', nombre: 'Sabana', x: 240, y: 150, c: '#d9c86a', texto: 'Llanos de la Orinoquía: pastos, temporada de lluvias y de sequía.' },
  { id: 'manglar', nombre: 'Manglar', x: 82, y: 150, c: '#5a8a6a', texto: 'Costas del Pacífico y del Caribe: árboles que viven en agua salada.' },
  { id: 'desierto', nombre: 'Desierto', x: 190, y: 40, c: '#e8c48a', texto: 'La Guajira: muy poca lluvia, cactus y arbustos espinosos.' },
  { id: 'arrecife', nombre: 'Arrecife de coral', x: 100, y: 50, c: '#e07a8a', texto: 'San Andrés y las islas del Rosario: corales en aguas cálidas y claras.' },
]
const ECO = ['mapa', ...ECOS.map((e) => e.id)]

export function EscenaEcosistemasColombia({ fase }: { fase: string }) {
  const i = Math.max(0, ECO.indexOf(fase))
  const sel = i > 0 ? ECOS[i - 1] : null
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Ecosistemas de Colombia: ${sel?.nombre ?? 'mapa'}`} className="h-full w-full">
      {fondo('#e6f0f6')}
      <path d="M 120 40 L 200 20 L 230 60 L 220 100 L 280 110 L 300 150 L 290 190 L 250 200 L 240 270 L 210 280 L 190 230 L 150 220 L 120 200 L 100 170 L 70 160 L 80 120 L 100 90 Z" fill="#f4efe2" stroke="#9a8a6a" strokeWidth="2.5" />
      <path d="M 120 190 L 140 150 L 150 110 L 170 70" stroke="#b5a07a" strokeWidth="10" strokeLinecap="round" opacity="0.5" />
      <Texto x={70} y={290} t="mapa esquemático, no a escala" s={8} peso={600} />
      {ECOS.map((e, k) => (
        <g key={e.id}>
          <circle cx={e.x} cy={e.y} r={sel?.id === e.id ? 16 : 10} fill={e.c} stroke="#fff" strokeWidth="2.5" style={{ transition: 'r 0.4s', opacity: !sel || sel.id === e.id ? 1 : 0.35 }} />
          <text x={e.x} y={e.y + 4} textAnchor="middle" fontSize="9" fontWeight="900" fill="#fff" style={{ opacity: !sel || sel.id === e.id ? 1 : 0.35 }}>{k + 1}</text>
        </g>
      ))}
      <g style={ver(i === 0)}>
        <rect x="290" y="20" width="104" height="170" rx="10" fill="#fff" opacity="0.92" />
        {ECOS.map((e, k) => <text key={e.id} x="300" y={40 + k * 21} fontSize="10" fontWeight="700" fill={TINTA}>{k + 1}. {e.nombre}</text>)}
      </g>
      {sel && (
        <g>
          <rect x="250" y="210" width="144" height="80" rx="10" fill="#fff" opacity="0.95" />
          <text x="260" y="230" fontSize="13" fontWeight="900" fill={sel.c === '#eef2f6' ? TINTA : sel.c}>{sel.nombre}</text>
          <foreignObject x="258" y="236" width="132" height="54">
            <div style={{ fontSize: 9, lineHeight: 1.25, fontWeight: 600, color: TINTA }}>{sel.texto}</div>
          </foreignObject>
        </g>
      )}
    </svg>
  )
}

/* ── Tema 2 · Rango de tolerancia (9°–11°) ────────────────────────────── */

const TOL = ['curva', 'optimo', 'estres', 'limite']

export function EscenaTolerancia({ fase }: { fase: string }) {
  const i = Math.max(0, TOL.indexOf(fase))
  const pts = Array.from({ length: 61 }, (_, k) => {
    const x = 40 + k * 5.33
    const y = 240 - 170 * Math.exp(-(((k - 30) / 11) ** 2))
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Rango de tolerancia: ${fase}`} className="h-full w-full">
      {fondo('#f3f2ee')}
      <rect x="40" y="60" width="72" height="180" fill="#f3c9c9" style={{ transition: 'opacity 0.6s', opacity: i >= 3 ? 0.9 : 0.2 }} />
      <rect x="288" y="60" width="72" height="180" fill="#f3c9c9" style={{ transition: 'opacity 0.6s', opacity: i >= 3 ? 0.9 : 0.2 }} />
      <rect x="112" y="60" width="56" height="180" fill="#f6e3b0" style={{ transition: 'opacity 0.6s', opacity: i >= 2 ? 0.9 : 0.2 }} />
      <rect x="232" y="60" width="56" height="180" fill="#f6e3b0" style={{ transition: 'opacity 0.6s', opacity: i >= 2 ? 0.9 : 0.2 }} />
      <rect x="168" y="60" width="64" height="180" fill="#cfe8c9" style={{ transition: 'opacity 0.6s', opacity: i >= 1 ? 0.9 : 0.2 }} />
      <polyline points={pts} fill="none" stroke={VERDE} strokeWidth="4" />
      <line x1="40" y1="240" x2="360" y2="240" stroke={TINTA} strokeWidth="2" />
      <line x1="40" y1="240" x2="40" y2="50" stroke={TINTA} strokeWidth="2" />
      <Texto x={200} y={262} t="temperatura (u otro factor) →" s={10} peso={600} />
      <text x="30" y="150" fontSize="10" fontWeight="600" fill={TINTA} transform="rotate(-90 30 150)" textAnchor="middle">cuántos individuos</text>
      <Texto x={200} y={30} t={['Cada especie tolera un rango de condiciones', 'Zona óptima: viven y se reproducen mejor', 'Zonas de estrés: sobreviven con dificultad', 'Fuera del rango: no sobreviven'][i]} s={12} />
      <g style={ver(i === 1)}><Texto x={200} y={80} t="óptimo" c={VERDE} s={12} /></g>
      <g style={ver(i === 2)}><Texto x={140} y={80} t="estrés" c="#b07a00" s={11} /><Texto x={260} y={80} t="estrés" c="#b07a00" s={11} /></g>
      <g style={ver(i === 3)}><Texto x={76} y={80} t="límite" c={ROJO} s={11} /><Texto x={324} y={80} t="límite" c={ROJO} s={11} /><Texto x={200} y={286} t="El factor que más se aleja del óptimo es el factor limitante" c={MOR} s={11} /></g>
    </svg>
  )
}
