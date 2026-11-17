// Escenas vivas del tema 3 del área 2 (Replicación del ADN): para qué se copia, la horquilla, los tres modelos,
// las enzimas de la horquilla y los errores y su corrección.
import type { ReactNode } from 'react'
import { COLOR_BASE, CromosomaX } from './EscenasAdn.tsx'

const suave = 'transform 1.1s cubic-bezier(.45,.05,.25,1), opacity 0.7s ease'
const ver = (si: boolean, mover = 'none', quieto = 'none') => ({ transition: suave, opacity: si ? 1 : 0, transform: si ? mover : quieto })
const fondo = (color: string) => <rect x="-1500" y="-1500" width="3400" height="3300" fill={color} style={{ transition: 'fill 0.8s' }} />

const VIEJA = '#3f6fb8'
const VIEJA2 = '#6f93cf'
const NUEVA = '#e08a2e'
const ROJO = '#c43c3c'
const MOR = '#8a5aa8'
const TINTA = '#3a3a3a'
const PAREJA: Record<string, string> = { A: 'T', T: 'A', G: 'C', C: 'G' }

function Texto({ x, y, t, c = TINTA, s = 12, peso = 800 }: { x: number; y: number; t: string; c?: string; s?: number; peso?: number }) {
  return <text x={x} y={y} textAnchor="middle" fontSize={s} fontWeight={peso} fill={c}>{t}</text>
}
function Letra({ x, y, w, h, b, op = 1 }: { x: number; y: number; w: number; h: number; b: string; op?: number }) {
  return (
    <g style={{ transition: 'opacity 0.6s', opacity: op }}>
      <rect x={x} y={y} width={w} height={h} rx="3" fill={COLOR_BASE[b]} />
      <text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle" fontSize="10" fontWeight="900" fill="#fff">{b}</text>
    </g>
  )
}

/* ── ¿Para qué se copia? ──────────────────────────────────────────────── */

const PARAQUE = ['antes', 'fase-s', 'division']

function Celula({ x, y, r = 80, children }: { x: number; y: number; r?: number; children?: ReactNode }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="#fbeef3" stroke="#d99ab4" strokeWidth="3" />
      <circle cx={x} cy={y} r={r * 0.55} fill="#e7def2" stroke={MOR} strokeWidth="2" strokeDasharray="5 3" />
      {children}
    </g>
  )
}
function CromI({ x, y, k = 1, color = MOR }: { x: number; y: number; k?: number; color?: string }) {
  return <rect x={x - 6 * k} y={y - 30 * k} width={12 * k} height={60 * k} rx={6 * k} fill={color} />
}

export function EscenaParaQueCopiar({ fase }: { fase: string }) {
  const i = Math.max(0, PARAQUE.indexOf(fase))
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Para qué se copia el ADN: ${fase}`} className="h-full w-full">
      {fondo('#f6f2f4')}
      <g style={ver(i <= 1)}>
        <Celula x={200} y={140} r={100}>
          <g style={{ transition: 'opacity 0.6s', opacity: i === 0 ? 1 : 0 }}><CromI x={200} y={140} k={1.2} /></g>
          <g style={{ transition: 'opacity 0.6s', opacity: i === 1 ? 1 : 0 }}><CromosomaX x={200} y={140} k={0.6} /></g>
        </Celula>
        <g style={ver(i === 0)}><Texto x={200} y={268} t="Un cromosoma: una molécula de ADN" s={12} /></g>
        <g style={ver(i === 1)}>
          <Texto x={200} y={22} t="Fase S de la interfase: el ADN se copia" c={MOR} s={13} />
          <Texto x={200} y={268} t="Ahora son dos copias idénticas, unidas" s={12} />
          <Texto x={200} y={284} t="(dos cromátidas hermanas)" s={11} peso={600} />
        </g>
      </g>
      <g style={ver(i === 2, 'none', 'scale(0.8)')}>
        <Celula x={105} y={140} r={78}><CromI x={105} y={140} /></Celula>
        <Celula x={295} y={140} r={78}><CromI x={295} y={140} /></Celula>
        <Texto x={200} y={260} t="Al dividirse, cada célula hija recibe una copia completa" s={12} />
      </g>
    </svg>
  )
}

/* ── La horquilla de replicación ──────────────────────────────────────── */

const HORQ = ['adn', 'abre', 'molde', 'copia', 'dos']
const SEC = 'ATGCGTACCA'.split('')

export function EscenaHorquilla({ fase }: { fase: string }) {
  const i = Math.max(0, HORQ.indexOf(fase))
  const corte = i === 0 ? 10 : i === 4 ? 0 : 4 // las bases desde «corte» en adelante están abiertas
  const copiadas = i >= 3
  const W = 34
  const x0 = 30
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`La horquilla de replicación: ${fase}`} className="h-full w-full">
      {fondo('#f3f2ee')}
      {SEC.map((b, k) => {
        const abierta = k >= corte
        const x = x0 + k * W
        const sube = abierta ? -46 : 0
        const baja = abierta ? 46 : 0
        const nueva = abierta && copiadas
        return (
          <g key={k}>
            {/* hebra vieja de arriba y su base */}
            <g style={{ transition: suave, transform: `translate(0, ${sube}px)` }}>
              <rect x={x} y={118} width={W} height="8" fill={VIEJA} />
              <Letra x={x + 6} y={127} w={W - 12} h={20} b={b} />
              {/* base nueva y su hebra, frente a la vieja de arriba */}
              <Letra x={x + 6} y={149} w={W - 12} h={20} b={PAREJA[b]} op={nueva ? 1 : 0} />
              <rect x={x} y={170} width={W} height="8" fill={NUEVA} style={{ transition: 'opacity 0.6s', opacity: nueva ? 1 : 0 }} />
            </g>
            {/* hebra vieja de abajo y su base */}
            <g style={{ transition: suave, transform: `translate(0, ${baja}px)` }}>
              <rect x={x} y={174} width={W} height="8" fill={VIEJA2} />
              <Letra x={x + 6} y={153} w={W - 12} h={20} b={PAREJA[b]} />
              <Letra x={x + 6} y={131} w={W - 12} h={20} b={b} op={nueva ? 1 : 0} />
              <rect x={x} y={122} width={W} height="8" fill={NUEVA} style={{ transition: 'opacity 0.6s', opacity: nueva ? 1 : 0 }} />
            </g>
          </g>
        )
      })}
      {/* helicasa en la horquilla */}
      <g style={ver(i >= 1 && i <= 3)}>
        <ellipse cx={x0 + 4 * W - 4} cy={150} rx="16" ry="24" fill="#5aa36a" opacity="0.9" />
        <Texto x={x0 + 4 * W - 4} y={154} t="✂" c="#fff" s={14} />
        <Texto x={x0 + 4 * W - 4} y={262} t="helicasa: abre el ADN" c="#3f7a4a" s={11} />
      </g>
      {/* nucleótidos sueltos */}
      <g style={ver(i === 2)}>
        {[[200, 30], [260, 40], [330, 28], [380, 36], [290, 284], [335, 274], [380, 286]].map(([x, y], k) => (
          <Letra key={k} x={x - 10} y={y - 9} w={20} h={18} b={'ATGC'[k % 4]} />
        ))}
        <Texto x={110} y={40} t="nucleótidos sueltos" s={11} />
      </g>
      {/* polimerasas */}
      <g style={ver(i === 3)}>
        <circle cx={x0 + 6 * W} cy={108} r="15" fill={NUEVA} opacity="0.85" />
        <circle cx={x0 + 6 * W} cy={192} r="15" fill={NUEVA} opacity="0.85" />
        <Texto x={200} y={24} t="ADN polimerasa: pone la base que va" c="#a45a10" s={11} />
        <Texto x={200} y={40} t="frente a cada una (A con T, G con C)" c="#a45a10" s={11} />
      </g>
      <g style={ver(i === 0)}><Texto x={200} y={60} t="Una molécula de ADN" s={13} /></g>
      <g style={ver(i === 4)}>
        <Texto x={200} y={32} t="Dos moléculas iguales" s={13} />
        <Texto x={200} y={278} t="Cada una: una hebra vieja (azul) y una nueva (naranja)" s={11} />
      </g>
    </svg>
  )
}

/* ── Tres modelos posibles ────────────────────────────────────────────── */

const MODELOS = ['original', 'conservativa', 'semiconservativa', 'dispersiva', 'resultado']

/** Una molécula como dos barras; cada barra es una lista de colores (trozos). */
function Molecula({ x, y, a, b }: { x: number; y: number; a: string[]; b: string[] }) {
  const h = 60 / a.length
  return (
    <g>
      {a.map((c, k) => <rect key={`a${k}`} x={x - 11} y={y + k * h} width="9" height={h + 0.5} fill={c} />)}
      {b.map((c, k) => <rect key={`b${k}`} x={x + 2} y={y + k * h} width="9" height={h + 0.5} fill={c} />)}
    </g>
  )
}

export function EscenaModelos({ fase }: { fase: string }) {
  const i = Math.max(0, MODELOS.indexOf(fase))
  const V = VIEJA
  const N = NUEVA
  const cols = [
    { x: 75, t: 'conservativa', hijas: [[[V], [V]], [[N], [N]]] as string[][][], ok: false },
    { x: 200, t: 'semiconservativa', hijas: [[[V], [N]], [[N], [V]]] as string[][][], ok: true },
    { x: 325, t: 'dispersiva', hijas: [[[V, N, V, N], [N, V, N, V]], [[N, V, N, V], [V, N, V, N]]] as string[][][], ok: false },
  ]
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Modelos de replicación: ${fase}`} className="h-full w-full">
      {fondo('#f3f2ee')}
      <g style={ver(i === 0)}>
        <Molecula x={200} y={100} a={[V]} b={[V]} />
        <Texto x={200} y={190} t="¿Cómo se reparten la molécula vieja y la nueva?" s={12} />
        <Texto x={200} y={210} t="En los años 50 había tres ideas" s={11} peso={600} />
      </g>
      {cols.map((c, k) => (
        <g key={c.t} style={{ transition: suave, opacity: i >= k + 1 ? (i === 4 && !c.ok ? 0.35 : 1) : 0 }}>
          <Texto x={c.x} y={30} t={c.t} c={c.ok && i === 4 ? NUEVA : TINTA} s={12} />
          <Molecula x={c.x} y={46} a={[V]} b={[V]} />
          <path d={`M ${c.x} 112 v 18 M ${c.x - 4} 124 l 4 6 l 4 -6`} stroke="#888" strokeWidth="2" fill="none" />
          <Molecula x={c.x - 22} y={140} a={c.hijas[0][0]} b={c.hijas[0][1]} />
          <Molecula x={c.x + 22} y={140} a={c.hijas[1][0]} b={c.hijas[1][1]} />
        </g>
      ))}
      <g style={ver(i === 4)}>
        <path d="M 160 232 l 14 14 l 26 -30" stroke="#3f9a5a" strokeWidth="6" fill="none" strokeLinecap="round" />
        <Texto x={200} y={274} t="Meselson y Stahl (1958): es semiconservativa" s={12} />
      </g>
      <g fontSize="10" fontWeight="700">
        <rect x="20" y="276" width="10" height="10" fill={V} /><text x="34" y="285" fill={TINTA}>vieja</text>
        <rect x="330" y="276" width="10" height="10" fill={N} /><text x="344" y="285" fill={TINTA}>nueva</text>
      </g>
    </svg>
  )
}

/* ── Las enzimas de la horquilla (11°) ────────────────────────────────── */

const ENZ = ['helicasa', 'primasa', 'adelantada', 'rezagada', 'ligasa']

export function EscenaEnzimas({ fase }: { fase: string }) {
  const i = Math.max(0, ENZ.indexOf(fase))
  const okazaki = [[44, 104], [112, 172], [180, 236]]
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Enzimas de la replicación: ${fase}`} className="h-full w-full">
      {fondo('#f3f2ee')}
      {/* ADN sin abrir a la derecha y la horquilla */}
      <rect x="262" y="138" width="130" height="7" fill={VIEJA} /><rect x="262" y="155" width="130" height="7" fill={VIEJA2} />
      {Array.from({ length: 8 }, (_, k) => <rect key={k} x={268 + k * 16} y={145} width="6" height="10" fill="#bbb" />)}
      <path d="M 262 141 Q 240 141 220 80 L 20 80" fill="none" stroke={VIEJA} strokeWidth="7" />
      <path d="M 262 158 Q 240 158 220 220 L 20 220" fill="none" stroke={VIEJA2} strokeWidth="7" />
      <Texto x={30} y={68} t="3′" c={VIEJA} s={11} /><Texto x={30} y={244} t="5′" c={VIEJA2} s={11} />
      <ellipse cx="256" cy="150" rx="14" ry="22" fill="#5aa36a" />
      <g style={ver(i === 0)}>
        <Texto x={256} y={110} t="helicasa" c="#3f7a4a" s={12} />
        <Texto x={200} y={274} t="La helicasa avanza → y rompe los puentes entre bases" s={11} />
      </g>
      {/* cebadores (ARN) */}
      <g style={ver(i >= 1)}>
        <rect x="40" y="90" width="16" height="7" fill={ROJO} />
        {okazaki.map(([, b]) => <rect key={b} x={b - 16} y={203} width="16" height="7" fill={ROJO} />)}
      </g>
      <g style={ver(i === 1)}>
        <Texto x={120} y={130} t="primasa: pone cebadores de ARN (rojo)" c={ROJO} s={11} />
        <Texto x={120} y={146} t="donde la polimerasa puede empezar" c={ROJO} s={11} />
      </g>
      {/* hebra adelantada: continua */}
      <g style={ver(i >= 2)}>
        <rect x="56" y="90" width="150" height="7" fill={NUEVA} />
        <path d="M 200 86 l 10 7.5 l -10 7.5" fill={NUEVA} />
        <circle cx="212" cy="94" r="11" fill={NUEVA} opacity="0.8" />
      </g>
      <g style={ver(i === 2)}>
        <Texto x={130} y={124} t="Hebra adelantada: se copia seguida," c="#a45a10" s={11} />
        <Texto x={130} y={140} t="hacia la horquilla (5′ → 3′)" c="#a45a10" s={11} />
      </g>
      {/* hebra rezagada: fragmentos de Okazaki */}
      <g style={ver(i >= 3)}>
        {okazaki.map(([a, b]) => <g key={a}><rect x={a} y={203} width={b - a - 16} height="7" fill={NUEVA} /><path d={`M ${a + 2} 199 l -8 7.5 l 8 7.5`} fill={NUEVA} /></g>)}
      </g>
      <g style={ver(i === 3)}>
        <Texto x={140} y={176} t="Hebra rezagada: a trozos, alejándose" c="#a45a10" s={11} />
        <Texto x={140} y={190} t="(fragmentos de Okazaki)" c="#a45a10" s={11} />
      </g>
      {/* ligasa */}
      <g style={ver(i === 4)}>
        {okazaki.slice(1).map(([a]) => <g key={a}><rect x={a - 8} y={203} width="10" height="7" fill={NUEVA} /><circle cx={a - 3} cy={225} r="7" fill={MOR} /></g>)}
        <Texto x={140} y={256} t="Los cebadores se cambian por ADN" s={11} />
        <Texto x={140} y={272} t="y la ligasa (morado) une los trozos" c={MOR} s={11} />
      </g>
    </svg>
  )
}

/* ── Errores y corrección ─────────────────────────────────────────────── */

const ERR = ['copia', 'error', 'revisa', 'corrige', 'mutacion']
const MOLDE = 'TACGGATC'.split('')

export function EscenaErrores({ fase }: { fase: string }) {
  const i = Math.max(0, ERR.indexOf(fase))
  const malo = 4 // posición del error
  const W = 36
  const x0 = 56
  const puesta = (k: number) => {
    if (k < malo) return PAREJA[MOLDE[k]]
    if (k === malo) return i === 1 || i === 4 ? 'T' : i === 3 ? PAREJA[MOLDE[k]] : null
    return null
  }
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Errores y corrección: ${fase}`} className="h-full w-full">
      {fondo(i === 4 ? '#f6eeee' : '#f3f2ee')}
      <g style={ver(i <= 3)}>
        <rect x={x0} y={196} width={W * 8} height="8" fill={VIEJA} />
        {MOLDE.map((b, k) => <Letra key={k} x={x0 + k * W + 6} y={174} w={W - 12} h={20} b={b} />)}
        {MOLDE.map((_, k) => {
          const p = puesta(k)
          const mal = k === malo && p === 'T'
          return p ? (
            <g key={k}>
              <Letra x={x0 + k * W + 6} y={mal ? 140 : 152} w={W - 12} h={20} b={p} />
              {mal && <rect x={x0 + k * W + 2} y={136} width={W - 4} height="28" rx="5" fill="none" stroke={ROJO} strokeWidth="3" />}
            </g>
          ) : null
        })}
        <rect x={x0} y={144} width={W * (i === 3 ? malo + 1 : malo)} height="8" fill={NUEVA} style={{ transition: 'width 0.6s' }} />
        {/* polimerasa */}
        <g style={{ transition: suave, transform: `translate(${(i === 2 ? malo - 1 : i === 3 ? malo + 1 : malo) * W}px, 0)` }}>
          <circle cx={x0 + 6} cy={150} r="20" fill={NUEVA} opacity="0.75" />
        </g>
        <g style={ver(i === 0)}><Texto x={200} y={60} t="La polimerasa copia muy rápido:" s={12} /><Texto x={200} y={78} t="cientos o miles de bases por segundo" s={12} /></g>
        <g style={ver(i === 1)}><Texto x={200} y={60} t="¡Una T frente a una G!" c={ROJO} s={14} /><Texto x={200} y={78} t="No encaja: el par queda torcido" s={11} peso={600} /></g>
        <g style={ver(i === 2)}><Texto x={200} y={60} t="La polimerasa se devuelve y la quita" s={12} /><Texto x={200} y={78} t="(corrección de pruebas)" s={11} peso={600} /></g>
        <g style={ver(i === 3)}><Texto x={200} y={60} t="Pone la base correcta: C frente a G" c="#3f7a4a" s={12} /></g>
      </g>
      <g style={ver(i === 4)}>
        <Texto x={200} y={34} t="Si el error se escapa, en la siguiente copia…" s={12} />
        {[{ x: 120, par: ['G', 'C'], t: 'como el original' }, { x: 280, par: ['A', 'T'], t: 'par cambiado: mutación' }].map((m, k) => (
          <g key={k}>
            <rect x={m.x - 40} y={80} width="8" height="140" fill={VIEJA} /><rect x={m.x + 32} y={80} width="8" height="140" fill={NUEVA} />
            {[0, 1, 2, 3, 4].map((j) => {
              const b = j === 2 ? m.par[0] : 'ATGCA'[j]
              return <g key={j}><Letra x={m.x - 32} y={88 + j * 26} w={30} h={18} b={b} /><Letra x={m.x + 2} y={88 + j * 26} w={30} h={18} b={PAREJA[b]} /></g>
            })}
            {k === 1 && <rect x={m.x - 36} y={136} width="72" height="26" rx="5" fill="none" stroke={ROJO} strokeWidth="3" />}
            <Texto x={m.x} y={244} t={m.t} c={k ? ROJO : TINTA} s={11} />
          </g>
        ))}
        <Texto x={200} y={278} t="Las mutaciones se estudian en el tema 7" s={10} peso={600} />
      </g>
    </svg>
  )
}
