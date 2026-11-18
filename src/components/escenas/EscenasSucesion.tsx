import type { ReactNode } from 'react'
// Escenas vivas del área 3, tema 6 (Sucesión ecológica).

const suave = 'transform 1.1s cubic-bezier(.45,.05,.25,1), opacity 0.7s ease'
const ver = (si: boolean, mover = 'none', quieto = 'none') => ({ transition: suave, opacity: si ? 1 : 0, transform: si ? mover : quieto })
const fondo = (color: string) => <rect x="-1500" y="-1500" width="3400" height="3300" fill={color} style={{ transition: 'fill 0.8s' }} />

const VERDE = '#3f9a5a'
const MOR = '#8a5aa8'
const ROJO = '#c43c3c'
const TINTA = '#3a3a3a'

function Texto({ x, y, t, c = TINTA, s = 12, peso = 800 }: { x: number; y: number; t: string; c?: string; s?: number; peso?: number }) {
  return <text x={x} y={y} textAnchor="middle" fontSize={s} fontWeight={peso} fill={c}>{t}</text>
}
function Arbol({ x, y, k = 1, c = '#4f8f4f' }: { x: number; y: number; k?: number; c?: string }) {
  return <g transform={`translate(${x} ${y}) scale(${k})`}><rect x="-5" y="-50" width="10" height="50" fill="#7a5a3a" /><circle cy="-64" r="26" fill={c} /><circle cx="-16" cy="-52" r="16" fill={c} /><circle cx="16" cy="-52" r="16" fill={c} /></g>
}
function Arbusto({ x, y }: { x: number; y: number }) {
  return <g><circle cx={x - 10} cy={y - 12} r="12" fill="#7aa864" /><circle cx={x + 8} cy={y - 14} r="14" fill="#6a9a5a" /><circle cx={x} cy={y - 22} r="11" fill="#7aa864" /></g>
}
function Hierba({ x, y }: { x: number; y: number }) {
  return <path d={`M ${x} ${y} l -5 -16 M ${x} ${y} l 0 -20 M ${x} ${y} l 5 -16`} stroke="#8ab84a" strokeWidth="2.5" />
}
function Capa({ si, children }: { si: boolean; children: ReactNode }) {
  return <g style={{ transition: suave, opacity: si ? 1 : 0, transform: si ? 'none' : 'translate(0, 10px)' }}>{children}</g>
}

/* ── Sucesión primaria ────────────────────────────────────────────────── */

const PRI = ['roca', 'liquenes', 'musgos', 'hierbas', 'arbustos', 'bosque']
const AÑOS = ['año 0', 'primeros años', 'decenas de años', 'decenas de años', 'cien años o más', 'cientos de años']

export function EscenaSucesionPrimaria({ fase }: { fase: string }) {
  const i = Math.max(0, PRI.indexOf(fase))
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Sucesión primaria: ${fase}`} className="h-full w-full">
      {fondo('#e9eef2')}
      <path d="M -10 250 Q 60 220 120 240 T 240 232 T 410 240 V 310 H -10 Z" fill="#8a8a8a" />
      <rect x="-10" y="262" width="420" height="50" fill={i >= 2 ? '#7a5a3a' : '#8a8a8a'} style={{ transition: 'fill 1s' }} />
      <Capa si={i >= 1}>{[[60, 244], [140, 238], [220, 236], [300, 240], [360, 244]].map(([x, y], k) => <ellipse key={k} cx={x} cy={y} rx="16" ry="5" fill="#d9c86a" />)}</Capa>
      <Capa si={i >= 2}>{[[90, 246], [180, 240], [270, 240], [330, 246]].map(([x, y], k) => <ellipse key={k} cx={x} cy={y} rx="22" ry="7" fill="#6a9a4a" />)}</Capa>
      <Capa si={i >= 3}>{[40, 70, 110, 160, 200, 250, 290, 340, 375].map((x) => <Hierba key={x} x={x} y={248} />)}</Capa>
      <Capa si={i >= 4}><Arbusto x={80} y={250} /><Arbusto x={200} y={246} /><Arbusto x={320} y={250} /></Capa>
      <Capa si={i >= 5}><Arbol x={130} y={252} k={1.3} /><Arbol x={260} y={250} k={1.5} /><Arbol x={360} y={254} k={1.1} c="#5f9a5a" /></Capa>
      <rect x="10" y="10" width="380" height="50" rx="10" fill="#fff" opacity="0.92" />
      <Texto x={200} y={32} t={['Roca desnuda: lava enfriada o terreno que deja un glaciar', 'Líquenes: los pioneros, rompen la roca poco a poco', 'Musgos: con los restos de los líquenes se forma suelo', 'Hierbas: el suelo ya es más profundo', 'Arbustos: más sombra, más humedad', 'Bosque: la comunidad madura (clímax)'][i]} s={11} />
      <Texto x={200} y={50} t={AÑOS[i]} c={MOR} s={10} />
    </svg>
  )
}

/* ── Sucesión secundaria ──────────────────────────────────────────────── */

const SEC = ['perturbacion', 'pastos', 'rastrojo', 'bosque-joven', 'bosque']

export function EscenaSucesionSecundaria({ fase }: { fase: string }) {
  const i = Math.max(0, SEC.indexOf(fase))
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Sucesión secundaria: ${fase}`} className="h-full w-full">
      {fondo('#eef2e8')}
      <rect x="-10" y="250" width="420" height="60" fill="#7a5a3a" />
      <Capa si={i === 0}>
        {[80, 200, 320].map((x) => <g key={x}><rect x={x - 5} y="200" width="10" height="50" fill="#3a2a1a" /><path d={`M ${x - 14} 250 q 14 -40 28 0`} fill="#e08a2e" opacity="0.6" /></g>)}
        <Texto x={200} y={290} t="el suelo sigue ahí, con semillas y raíces" c="#fff" s={10} />
      </Capa>
      <Capa si={i >= 1}>{Array.from({ length: 16 }, (_, k) => <Hierba key={k} x={20 + k * 24} y={250} />)}</Capa>
      <Capa si={i >= 2}><Arbusto x={60} y={252} /><Arbusto x={150} y={250} /><Arbusto x={250} y={252} /><Arbusto x={340} y={250} /></Capa>
      <Capa si={i >= 3}><Arbol x={110} y={252} k={0.9} c="#7ab064" /><Arbol x={290} y={252} k={1} c="#7ab064" /></Capa>
      <Capa si={i >= 4}><Arbol x={200} y={254} k={1.5} /><Arbol x={50} y={254} k={1.2} /><Arbol x={360} y={254} k={1.3} /></Capa>
      <rect x="10" y="10" width="380" height="50" rx="10" fill="#fff" opacity="0.92" />
      <Texto x={200} y={32} t={['Un incendio, una tala o un potrero abandonado', 'Pastos y hierbas brotan en pocos meses', 'Rastrojo: arbustos y plantas pioneras', 'Bosque joven: árboles que crecen rápido', 'Bosque secundario: en décadas se parece al original'][i]} s={11} />
      <Texto x={200} y={50} t={['', 'meses', 'pocos años', '10 a 20 años', 'décadas'][i]} c={MOR} s={10} />
    </svg>
  )
}

/* ── Perturbaciones y restauración ────────────────────────────────────── */

const PER = ['naturales', 'humanas', 'restaurar']

export function EscenaPerturbaciones({ fase }: { fase: string }) {
  const i = Math.max(0, PER.indexOf(fase))
  const tarjeta = (x: number, ic: string, t: string) => (
    <g key={t}>
      <rect x={x - 54} y="90" width="108" height="110" rx="12" fill="#fff" stroke="#ddd" strokeWidth="2" />
      <text x={x} y="140" textAnchor="middle" fontSize="32">{ic}</text>
      <Texto x={x} y={176} t={t} s={10} />
    </g>
  )
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Perturbaciones: ${fase}`} className="h-full w-full">
      {fondo(i === 2 ? '#eef4ee' : '#f6f1ec')}
      <Texto x={200} y={46} t={['Perturbaciones naturales', 'Perturbaciones causadas por las personas', 'Restauración ecológica: ayudar a la sucesión'][i]} c={i === 1 ? ROJO : i === 2 ? VERDE : TINTA} s={13} />
      <g style={ver(i === 0)}>{tarjeta(80, '🌋', 'erupción')}{tarjeta(200, '⛰️', 'deslizamiento')}{tarjeta(320, '🌊', 'inundación')}</g>
      <g style={ver(i === 1)}>{tarjeta(80, '🪓', 'tala')}{tarjeta(200, '🔥', 'quema')}{tarjeta(320, '⛏️', 'minería')}</g>
      <g style={ver(i === 2)}>{tarjeta(80, '🚧', 'cercar y proteger')}{tarjeta(200, '🌱', 'sembrar nativas')}{tarjeta(320, '💧', 'cuidar el agua')}</g>
      <g style={ver(i === 1)}><Texto x={200} y={240} t="Son más frecuentes y a veces dañan tanto el suelo" s={11} /><Texto x={200} y={256} t="que la recuperación tarda muchísimo" s={11} /></g>
      <g style={ver(i === 2)}><Texto x={200} y={244} t="Con especies nativas el bosque se recupera más rápido" s={11} /></g>
    </svg>
  )
}
