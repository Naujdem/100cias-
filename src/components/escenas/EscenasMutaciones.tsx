// Escenas vivas del tema 7 del área 2 (Mutaciones y variación).
import { COLOR_BASE } from './EscenasAdn.tsx'

const suave = 'transform 1.1s cubic-bezier(.45,.05,.25,1), opacity 0.7s ease'
const ver = (si: boolean, mover = 'none', quieto = 'none') => ({ transition: suave, opacity: si ? 1 : 0, transform: si ? mover : quieto })
const fondo = (color: string) => <rect x="-1500" y="-1500" width="3400" height="3300" fill={color} style={{ transition: 'fill 0.8s' }} />

const AZUL = '#3f6fb8'
const ROJO = '#c43c3c'
const VERDE = '#3f9a5a'
const MOR = '#8a5aa8'
const TINTA = '#3a3a3a'

function Texto({ x, y, t, c = TINTA, s = 12, peso = 800 }: { x: number; y: number; t: string; c?: string; s?: number; peso?: number }) {
  return <text x={x} y={y} textAnchor="middle" fontSize={s} fontWeight={peso} fill={c}>{t}</text>
}
function Letra({ x, y, b, w = 22, h = 24, marca = false }: { x: number; y: number; b: string; w?: number; h?: number; marca?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="4" fill={COLOR_BASE[b] ?? '#999'} />
      <text x={x + w / 2} y={y + h / 2 + 4.5} textAnchor="middle" fontSize="12" fontWeight="900" fill="#fff">{b}</text>
      {marca && <rect x={x - 3} y={y - 3} width={w + 6} height={h + 6} rx="6" fill="none" stroke={ROJO} strokeWidth="3" />}
    </g>
  )
}
function Fila({ x, y, sec, marca = -1 }: { x: number; y: number; sec: string; marca?: number }) {
  return <g>{sec.split('').map((b, k) => <Letra key={k} x={x + k * 26} y={y} b={b} marca={k === marca} />)}</g>
}

/* ── ¿Qué es una mutación? ────────────────────────────────────────────── */

const QUE = ['secuencia', 'cambio', 'causas', 'somatica', 'germinal']

export function EscenaQueEsMutacion({ fase }: { fase: string }) {
  const i = Math.max(0, QUE.indexOf(fase))
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Qué es una mutación: ${fase}`} className="h-full w-full">
      {fondo('#f3f2ee')}
      <g style={ver(i <= 2)}>
        <Texto x={200} y={36} t={['Un tramo de ADN', 'Una base cambió: es una mutación', '¿Por qué cambia el ADN?'][Math.min(i, 2)]} s={13} />
        <Fila x={70} y={60} sec={i >= 1 ? 'ATGCATTAGC' : 'ATGCAGTAGC'} marca={i >= 1 ? 5 : -1} />
      </g>
      <g style={ver(i === 2)}>
        {[['🔁', 'Errores de copia', 'que se escapan'], ['☀️', 'Radiación', 'luz UV, rayos X'], ['🚬', 'Sustancias', 'humo de tabaco'], ['🦠', 'Algunos virus', '']].map(([ic, t, s], k) => (
          <g key={t}>
            <rect x={16 + k * 94} y="116" width="86" height="104" rx="12" fill="#fff" stroke="#ddd" strokeWidth="2" />
            <text x={59 + k * 94} y="156" textAnchor="middle" fontSize="26">{ic}</text>
            <Texto x={59 + k * 94} y={184} t={t} s={10} />
            <Texto x={59 + k * 94} y={200} t={s} s={9} peso={600} />
          </g>
        ))}
        <Texto x={200} y={252} t="Los agentes que causan mutaciones se llaman mutágenos" s={11} />
      </g>
      {/* somática y germinal */}
      <g style={ver(i >= 3)}>
        <path d="M 150 270 v -50 q 0 -24 50 -24 q 50 0 50 24 v 50 z" fill="#5f87c2" />
        <circle cx="200" cy="168" r="26" fill="#e8c3a0" />
        <g style={ver(i === 3)}>
          <circle cx="232" cy="230" r="7" fill="#7a4a2a" />
          <circle cx="232" cy="230" r="16" fill="none" stroke={ROJO} strokeWidth="2.5" strokeDasharray="4 3" />
          <Texto x={200} y={56} t="Mutación somática: en una célula del cuerpo" s={12} />
          <Texto x={200} y={74} t="(como la piel). Solo afecta a esa persona;" s={11} peso={600} />
          <Texto x={200} y={90} t="no pasa a los hijos." s={11} peso={600} />
        </g>
        <g style={ver(i === 4)}>
          <circle cx="200" cy="246" r="8" fill="#f4e2c0" stroke={ROJO} strokeWidth="2.5" />
          <path d="M 212 246 H 300" stroke="#888" strokeWidth="2.5" strokeDasharray="5 4" />
          <circle cx="324" cy="230" r="11" fill="#e8c3a0" /><path d="M 310 270 v -20 q 0 -10 14 -10 q 14 0 14 10 v 20 z" fill="#c46aa0" />
          <Texto x={200} y={56} t="Mutación germinal: en un óvulo o espermatozoide." s={12} />
          <Texto x={200} y={74} t="Pasa a los hijos, y estará en todas sus células." s={11} peso={600} />
        </g>
      </g>
    </svg>
  )
}

/* ── Mutaciones puntuales (con palabras) ──────────────────────────────── */

const PUN = ['original', 'sustitucion', 'delecion', 'insercion']

function Palabras({ y, txt, mal = [] as number[] }: { y: number; txt: string; mal?: number[] }) {
  return (
    <g>
      {txt.split(' ').map((w, k) => (
        <g key={k}>
          <rect x={30 + k * 86} y={y} width="78" height="40" rx="8" fill={mal.includes(k) ? '#f8dada' : '#fff'} stroke={mal.includes(k) ? ROJO : '#ccc'} strokeWidth="2" />
          <text x={69 + k * 86} y={y + 27} textAnchor="middle" fontSize="18" fontWeight="900" fontFamily="monospace" fill={TINTA}>{w}</text>
        </g>
      ))}
    </g>
  )
}

export function EscenaPuntuales({ fase }: { fase: string }) {
  const i = Math.max(0, PUN.indexOf(fase))
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Mutaciones puntuales: ${fase}`} className="h-full w-full">
      {fondo('#f6f3ec')}
      <Texto x={200} y={30} t="Imagina que el gen se lee en palabras de tres letras" s={12} />
      <Palabras y={50} txt="SOL PAN MAR LUZ" />
      <Texto x={200} y={112} t="original" s={10} peso={600} />
      <g style={ver(i === 1)}>
        <Palabras y={140} txt="SOL PAZ MAR LUZ" mal={[1]} />
        <Texto x={200} y={210} t="Sustitución: cambia una letra." c={ROJO} s={12} />
        <Texto x={200} y={228} t="Cambia una palabra (un aminoácido), o ninguna" s={11} peso={600} />
      </g>
      <g style={ver(i === 2)}>
        <Palabras y={140} txt="SOL ANM ARL UZ·" mal={[1, 2, 3]} />
        <Texto x={200} y={210} t="Deleción: se pierde una letra (la P)." c={ROJO} s={12} />
        <Texto x={200} y={228} t="Todo lo que sigue se lee corrido: ¡no tiene sentido!" s={11} peso={600} />
      </g>
      <g style={ver(i === 3)}>
        <Palabras y={140} txt="SOL PAA NMA RLU" mal={[1, 2, 3]} />
        <Texto x={200} y={210} t="Inserción: entra una letra de más (una A)." c={ROJO} s={12} />
        <Texto x={200} y={228} t="También corre el marco de lectura" s={11} peso={600} />
      </g>
      <g style={ver(i >= 2)}><Texto x={200} y={270} t="Por eso quitar o agregar una base suele ser más grave" c={MOR} s={11} /></g>
    </svg>
  )
}

/* ── Anemia falciforme ────────────────────────────────────────────────── */

const FAL = ['codon', 'aminoacido', 'hemoglobina', 'globulo', 'malaria']

export function EscenaFalciforme({ fase }: { fase: string }) {
  const i = Math.max(0, FAL.indexOf(fase))
  const mut = i >= 1
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Anemia falciforme: ${fase}`} className="h-full w-full">
      {fondo('#f8f0f0')}
      <g style={ver(i <= 1)}>
        <Texto x={110} y={40} t="Normal" s={13} /><Texto x={290} y={40} t="Con la mutación" c={ROJO} s={13} />
        <Fila x={71} y={60} sec="GAG" /><Fila x={251} y={60} sec="GTG" marca={1} />
        <Texto x={200} y={110} t="Una sola base del gen de la hemoglobina" s={11} peso={600} />
        <g style={ver(mut)}>
          <circle cx="110" cy="160" r="26" fill="#c46a3a" /><Texto x={110} y={165} t="Glu" c="#fff" s={12} />
          <circle cx="290" cy="160" r="26" fill="#5f87c2" /><Texto x={290} y={165} t="Val" c="#fff" s={12} />
          <Texto x={200} y={220} t="Cambia un aminoácido entre 146" s={12} />
        </g>
      </g>
      <g style={ver(i === 2)}>
        <Texto x={200} y={40} t="Las hemoglobinas cambiadas se pegan en fibras" s={12} />
        {[0, 1, 2, 3, 4].map((k) => <g key={k}><circle cx={90 + k * 52} cy={140} r="22" fill="#b02a32" /><circle cx={90 + k * 52} cy={140} r="8" fill="#5f87c2" /></g>)}
        <path d="M 90 140 H 298" stroke="#5f87c2" strokeWidth="4" strokeDasharray="6 4" />
      </g>
      <g style={ver(i === 3)}>
        <ellipse cx="120" cy="140" rx="54" ry="40" fill={ROJO} /><ellipse cx="120" cy="140" rx="22" ry="16" fill="#b02a32" />
        <path d="M 230 110 q 60 -20 110 30 q -40 -10 -90 30 q -10 -30 -20 -60 z" fill={ROJO} />
        <Texto x={120} y={210} t="glóbulo normal" s={11} /><Texto x={290} y={210} t="glóbulo en forma de hoz" c={ROJO} s={11} />
        <Texto x={200} y={248} t="Se atascan en los vasos y se rompen fácil: anemia y dolor" s={11} peso={600} />
      </g>
      <g style={ver(i === 4)}>
        <Texto x={200} y={60} t="Pero tener un solo alelo con la mutación" s={12} />
        <Texto x={200} y={78} t="protege contra la malaria" s={12} />
        <text x="200" y="160" textAnchor="middle" fontSize="54">🦟</text>
        <Texto x={200} y={220} t="Por eso es más común donde hay malaria:" s={11} peso={600} />
        <Texto x={200} y={236} t="una mutación puede ser dañina o útil según el ambiente" c={MOR} s={11} />
      </g>
    </svg>
  )
}

/* ── Cambios en el número de cromosomas ───────────────────────────────── */

const NUM = ['normal', 'no-disyuncion', 'gametos', 'trisomia']

function Crom({ x, y, c = MOR, h = 46 }: { x: number; y: number; c?: string; h?: number }) {
  return <rect x={x - 5} y={y - h / 2} width="10" height={h} rx="5" fill={c} />
}

export function EscenaNoDisyuncion({ fase }: { fase: string }) {
  const i = Math.max(0, NUM.indexOf(fase))
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`No disyunción: ${fase}`} className="h-full w-full">
      {fondo('#f3f1f6')}
      <g style={ver(i <= 2)}>
        <Texto x={200} y={30} t={['En la meiosis, cada par se separa', 'A veces un par no se separa', 'Óvulos con un cromosoma de más o de menos'][Math.min(i, 2)]} s={13} />
        <circle cx="200" cy="96" r="44" fill="#fbeef3" stroke="#d99ab4" strokeWidth="3" />
        <Crom x={190} y={96} c={AZUL} /><Crom x={210} y={96} c="#c46aa0" />
        <path d="M 170 140 L 110 176 M 230 140 L 290 176" stroke="#888" strokeWidth="2.5" />
        <circle cx="100" cy="210" r="34" fill="#fbeef3" stroke="#d99ab4" strokeWidth="3" />
        <circle cx="300" cy="210" r="34" fill="#fbeef3" stroke="#d99ab4" strokeWidth="3" />
        <g style={{ transition: suave, transform: i >= 1 ? 'translate(200px, 0)' : 'none' }}><Crom x={100} y={210} c={AZUL} h={36} /></g>
        <g style={{ transition: suave, transform: i >= 1 ? 'translate(0, 0)' : 'none' }}><Crom x={i >= 1 ? 314 : 300} y={210} c="#c46aa0" h={36} /></g>
        <g style={ver(i === 2)}>
          <Texto x={100} y={268} t="sin ese cromosoma" s={11} /><Texto x={300} y={268} t="con dos copias" c={ROJO} s={11} />
        </g>
      </g>
      <g style={ver(i === 3)}>
        <Texto x={200} y={30} t="Si ese óvulo es fecundado: tres copias (trisomía)" s={12} />
        {Array.from({ length: 22 }, (_, k) => {
          const x = 36 + (k % 11) * 33
          const y = 82 + Math.floor(k / 11) * 80
          const tres = k === 20
          return (
            <g key={k}>
              <Crom x={x - 6} y={y} h={44 - k} /><Crom x={x + 6} y={y} h={44 - k} />
              {tres && <><Crom x={x + 18} y={y} h={44 - k} c={ROJO} /><rect x={x - 13} y={y - 28} width="38" height="56" rx="6" fill="none" stroke={ROJO} strokeWidth="2.5" /></>}
              <text x={x} y={y + 38} textAnchor="middle" fontSize="9" fontWeight="700" fill={TINTA}>{k + 1}</text>
            </g>
          )
        })}
        <Texto x={200} y={256} t="Tres cromosomas 21: síndrome de Down" c={ROJO} s={12} />
        <Texto x={200} y={274} t="47 cromosomas en vez de 46" s={11} peso={600} />
      </g>
    </svg>
  )
}

/* ── Cambios en la estructura de los cromosomas (11°) ─────────────────── */

const EST = ['original', 'delecion', 'duplicacion', 'inversion', 'translocacion']
const SEG = ['A', 'B', 'C', 'D', 'E', 'F']
const SEG_C: Record<string, string> = { A: '#3f6fb8', B: '#3f9a5a', C: '#e0a020', D: '#c43c3c', E: '#8a5aa8', F: '#4aa0a0', W: '#6a7a8a', X: '#9a6a42', Y: '#c9a14a' }

function Segmentos({ y, seg, x0 = 80 }: { y: number; seg: string[]; x0?: number }) {
  return (
    <g>
      {seg.map((s, k) => (
        <g key={k}>
          <rect x={x0 + k * 40} y={y} width="38" height="28" rx={k === 0 ? 10 : k === seg.length - 1 ? 10 : 2} fill={SEG_C[s]} />
          <text x={x0 + k * 40 + 19} y={y + 19} textAnchor="middle" fontSize="13" fontWeight="900" fill="#fff">{s}</text>
        </g>
      ))}
    </g>
  )
}

export function EscenaCromosomicas({ fase }: { fase: string }) {
  const i = Math.max(0, EST.indexOf(fase))
  const casos: Record<number, { seg: string[]; t: string; s: string }> = {
    1: { seg: ['A', 'B', 'D', 'E', 'F'], t: 'Deleción', s: 'se pierde un trozo (C)' },
    2: { seg: ['A', 'B', 'C', 'C', 'D', 'E', 'F'], t: 'Duplicación', s: 'un trozo se repite (C)' },
    3: { seg: ['A', 'B', 'E', 'D', 'C', 'F'], t: 'Inversión', s: 'un trozo se da la vuelta (C-D-E)' },
    4: { seg: ['A', 'B', 'C', 'X', 'Y'], t: 'Translocación', s: 'dos cromosomas intercambian trozos' },
  }
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Mutaciones cromosómicas: ${fase}`} className="h-full w-full">
      {fondo('#f3f2ee')}
      <Texto x={200} y={36} t="Un cromosoma con sus trozos en orden" s={12} />
      <Segmentos y={56} seg={SEG} />
      <g style={ver(i === 4)}>
        <Segmentos y={96} seg={['W', 'X', 'Y']} x0={140} />
        <Texto x={200} y={140} t="y otro cromosoma (W-X-Y)" s={10} peso={600} />
      </g>
      {[1, 2, 3, 4].map((k) => (
        <g key={k} style={ver(i === k, 'none', 'translate(0, 20px)')}>
          <Segmentos y={k === 4 ? 160 : 170} seg={casos[k].seg} x0={200 - casos[k].seg.length * 20} />
          {k === 4 && <Segmentos y={194} seg={['W', 'D', 'E', 'F']} x0={120} />}
          <Texto x={200} y={k === 4 ? 246 : 230} t={casos[k].t} c={ROJO} s={14} />
          <Texto x={200} y={k === 4 ? 264 : 250} t={casos[k].s} s={11} peso={600} />
        </g>
      ))}
      <g style={ver(i === 0)}><Texto x={200} y={190} t="A veces un trozo se pierde, se repite," s={12} /><Texto x={200} y={208} t="se voltea o se cambia de lugar" s={12} /></g>
    </svg>
  )
}

/* ── De dónde sale la variación ───────────────────────────────────────── */

const VAR = ['familia', 'mutacion', 'recombinacion', 'fecundacion', 'evolucion']

export function EscenaVariacion({ fase }: { fase: string }) {
  const i = Math.max(0, VAR.indexOf(fase))
  const caras = ['#e8c3a0', '#d9a77a', '#c48a5a', '#e3b58e']
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Variación: ${fase}`} className="h-full w-full">
      {fondo('#f4f1ea')}
      <g style={ver(i === 0)}>
        <Texto x={200} y={36} t="Hermanos de los mismos padres, todos distintos" s={12} />
        {caras.map((c, k) => (
          <g key={k}>
            <circle cx={80 + k * 80} cy={130} r="26" fill={c} />
            <path d={`M ${60 + k * 80} 112 q 20 ${-14 - k * 4} 40 0`} fill={['#3a2a1a', '#7a4a2a', '#2a1a0a', '#a0703a'][k]} />
            <rect x={60 + k * 80} y={160} width="40" height="60" rx="10" fill={['#5f87c2', '#c46aa0', '#3f9a5a', '#e0a020'][k]} />
          </g>
        ))}
        <Texto x={200} y={258} t="¿De dónde sale tanta variedad?" c={MOR} s={13} />
      </g>
      <g style={ver(i === 1)}>
        <text x="200" y="120" textAnchor="middle" fontSize="44">🧬</text>
        <Texto x={200} y={170} t="1. Mutaciones" c={ROJO} s={15} />
        <Texto x={200} y={192} t="Crean alelos nuevos que antes no existían" s={12} />
      </g>
      <g style={ver(i === 2)}>
        <rect x="150" y="70" width="16" height="110" rx="8" fill={AZUL} /><rect x="234" y="70" width="16" height="110" rx="8" fill="#c46aa0" />
        <rect x="150" y="70" width="16" height="40" rx="8" fill="#c46aa0" /><rect x="234" y="70" width="16" height="40" rx="8" fill={AZUL} />
        <path d="M 170 90 C 200 70, 200 110, 230 90" stroke="#888" strokeWidth="2" fill="none" strokeDasharray="4 3" />
        <Texto x={200} y={210} t="2. Recombinación en la meiosis" c={AZUL} s={15} />
        <Texto x={200} y={232} t="Los cromosomas intercambian trozos" s={12} />
      </g>
      <g style={ver(i === 3)}>
        <circle cx="150" cy="130" r="40" fill="#f4e2c0" stroke="#d9b48f" strokeWidth="3" />
        <path d="M 250 130 q 20 -10 40 0" stroke="#5f87c2" strokeWidth="4" fill="none" /><circle cx="244" cy="130" r="9" fill="#5f87c2" />
        <Texto x={200} y={210} t="3. Fecundación" c={VERDE} s={15} />
        <Texto x={200} y={232} t="Cualquier óvulo con cualquier espermatozoide" s={12} />
      </g>
      <g style={ver(i === 4)}>
        <Texto x={200} y={110} t="La variación es la materia prima" s={14} />
        <Texto x={200} y={132} t="de la evolución" s={14} />
        <Texto x={200} y={180} t="La selección natural actúa sobre ella:" s={12} peso={600} />
        <Texto x={200} y={198} t="se vuelven comunes los rasgos que ayudan a sobrevivir" s={12} peso={600} />
      </g>
    </svg>
  )
}
