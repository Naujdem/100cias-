// Escenas vivas del área 4 (evolución): tema 1 (historia) y tema 2 (evidencias).
import { Extremidad, ESPECIES, HUESOS, type Especie } from '../diagramas/ExtremidadesHomologas.tsx'

const suave = 'transform 1.1s cubic-bezier(.45,.05,.25,1), opacity 0.7s ease'
const ver = (si: boolean, mover = 'none', quieto = 'none') => ({ transition: suave, opacity: si ? 1 : 0, transform: si ? mover : quieto })
const fondo = (color: string) => <rect x="-1500" y="-1500" width="3400" height="3300" fill={color} style={{ transition: 'fill 0.8s' }} />
const idx = (orden: string[], fase: string) => Math.max(0, orden.indexOf(fase))

const TINTA = '#3a3a3a'
const VERDE = '#4f8a3c'
const MARRON = '#8a5a34'
const AZUL = '#3f6fb8'
const ROJO = '#c43c3c'
const ARENA = '#e8d6b0'

function T({ x, y, t, c = TINTA, s = 12, peso = 800 }: { x: number; y: number; t: string; c?: string; s?: number; peso?: number }) {
  return <text x={x} y={y} textAnchor="middle" fontSize={s} fontWeight={peso} fill={c}>{t}</text>
}
const Flecha = ({ id }: { id: string }) => (
  <defs>
    <marker id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#888" /></marker>
  </defs>
)

/* ── Linneo: ordenar en grupos y nombrar ─────────────────────────────── */

const LINNEO = ['desorden', 'grupos', 'nombre', 'fijo']
const SERES = [
  { e: '🐆', g: 0 }, { e: '🐈', g: 0 }, { e: '🐻', g: 1 }, { e: '🦊', g: 1 },
  { e: '🌻', g: 2 }, { e: '🌼', g: 2 }, { e: '🦜', g: 3 }, { e: '🐦', g: 3 },
]
const REVUELTO = [[60, 70], [300, 210], [180, 120], [340, 80], [110, 220], [240, 60], [60, 160], [280, 140]]
const CAJAS = [{ x: 20, t: 'Felinos' }, { x: 115, t: 'Úrsidos y cánidos' }, { x: 210, t: 'Plantas con flor' }, { x: 305, t: 'Aves' }]

export function EscenaLinneo({ fase }: { fase: string }) {
  const i = idx(LINNEO, fase)
  const orden = i >= 1
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Linneo: ${fase}`} className="h-full w-full">
      {fondo('#f4f1ea')}
      {CAJAS.map((c) => (
        <g key={c.t} style={ver(orden && i < 2)}>
          <rect x={c.x} y="40" width="80" height="150" rx="10" fill="#fff" stroke="#d8cfbd" strokeWidth="2" />
          <T x={c.x + 40} y={30} t={c.t} s={9} />
        </g>
      ))}
      {SERES.map((s, k) => {
        const [rx, ry] = REVUELTO[k]
        const ox = CAJAS[s.g].x + 40
        const oy = 85 + (k % 2) * 60
        const x = orden ? ox : rx
        const y = orden ? oy : ry
        return (
          <g key={k} style={{ transition: suave, transform: `translate(${x}px, ${y}px)`, opacity: i >= 2 && k !== 2 ? 0.15 : 1 }}>
            <text textAnchor="middle" dominantBaseline="middle" fontSize="32">{s.e}</text>
          </g>
        )
      })}
      <g style={ver(i === 0)}><T x={200} y={280} t="¿Cómo ordenar miles de especies?" s={14} /></g>

      {/* el nombre de dos palabras */}
      <g style={ver(i === 2, 'none', 'translate(0, 20px)')}>
        <rect x="70" y="200" width="260" height="70" rx="12" fill="#fff" stroke="#d8cfbd" strokeWidth="2" />
        <text x="200" y="232" textAnchor="middle" fontSize="20" fontStyle="italic" fontWeight="700" fill={MARRON}>Tremarctos ornatus</text>
        <T x={145} y={256} t="género" s={11} c={AZUL} />
        <T x={265} y={256} t="especie" s={11} c={VERDE} />
      </g>

      {/* fijismo */}
      <g style={ver(i === 3, 'none', 'scale(0.9)')}>
        <rect x="60" y="205" width="280" height="70" rx="12" fill="#fff" stroke="#d8cfbd" strokeWidth="2" />
        <T x={110} y={250} t="🔒" s={28} />
        <T x={225} y={235} t="Fijismo" s={18} c={ROJO} />
        <T x={225} y={258} t="cada especie es como fue creada" s={11} peso={600} />
      </g>
    </svg>
  )
}

/* ── Lamarck: la jirafa que se estira ────────────────────────────────── */

const LAMARCK = ['corto', 'estira', 'hereda', 'hoy']

function Jirafa({ x, cuello, k = 1, gris = false }: { x: number; cuello: number; k?: number; gris?: boolean }) {
  const piel = gris ? '#cfc8bb' : '#e2b25a'
  const mancha = gris ? '#b0a796' : '#a8672f'
  return (
    <g transform={`translate(${x} 250) scale(${k})`}>
      <line x1="-18" y1="0" x2="-18" y2="-40" stroke={piel} strokeWidth="6" />
      <line x1="18" y1="0" x2="18" y2="-40" stroke={piel} strokeWidth="6" />
      <ellipse cx="0" cy="-50" rx="30" ry="16" fill={piel} />
      <circle cx="-8" cy="-52" r="4" fill={mancha} /><circle cx="8" cy="-48" r="4" fill={mancha} />
      <rect x="16" y={-55 - cuello} width="10" height={cuello} rx="4" fill={piel} style={{ transition: suave }} />
      <g style={{ transition: suave, transform: `translateY(${-cuello}px)` }}>
        <ellipse cx="30" cy="-58" rx="13" ry="7" fill={piel} />
        <circle cx="33" cy="-60" r="1.6" fill={TINTA} />
        <line x1="22" y1="-64" x2="22" y2="-72" stroke={mancha} strokeWidth="2" />
      </g>
    </g>
  )
}

export function EscenaLamarck({ fase }: { fase: string }) {
  const i = idx(LAMARCK, fase)
  const cuelloMadre = i === 0 ? 30 : 70
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Lamarck y la jirafa: ${fase}`} className="h-full w-full">
      {fondo(i === 3 ? '#eef1f4' : '#f4f1ea')}
      <rect x="-10" y="250" width="420" height="60" fill="#d9cfa0" />
      {/* árbol */}
      <line x1="200" y1="250" x2="200" y2="90" stroke={MARRON} strokeWidth="10" />
      <ellipse cx="200" cy="70" rx="70" ry="30" fill={VERDE} />
      <Jirafa x={105} cuello={cuelloMadre} gris={i === 3} />
      <g style={ver(i === 1)}><T x={70} y={110} t="↑ se estira" c={MARRON} s={13} /></g>
      <g style={ver(i >= 2, 'none', 'translate(0, 20px)')}>
        <Jirafa x={290} cuello={i === 3 ? 30 : 70} k={0.7} gris={i === 3} />
        <path d="M 160 230 q 60 -30 100 0" fill="none" stroke="#888" strokeWidth="2" strokeDasharray="4 3" markerEnd="url(#la-fl)" />
        <T x={210} y={232} t={i === 3 ? 'no se hereda' : 'se hereda'} c={i === 3 ? ROJO : MARRON} s={12} />
      </g>
      <g style={ver(i === 3)}>
        <rect x="40" y="262" width="320" height="30" rx="8" fill="#fff" stroke="#c9d2dc" />
        <T x={200} y={282} t="Lo adquirido en vida no cambia los genes" c={AZUL} s={12} />
      </g>
      <Flecha id="la-fl" />
    </svg>
  )
}

/* ── Cuvier: capas, fósiles, mamut ───────────────────────────────────── */

const CUVIER = ['capas', 'fosiles', 'mamut', 'catastrofe']
const CAPAS = ['#d8c59c', '#c9ae80', '#b8986a', '#a6845a']
const FOSILES = ['🐚', '🦴', '🦣', '🐘']

export function EscenaCuvier({ fase }: { fase: string }) {
  const i = idx(CUVIER, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Cuvier: ${fase}`} className="h-full w-full">
      {fondo('#f4f1ea')}
      <g style={{ transition: suave, transform: i >= 2 ? 'translate(-90px, 0) scale(0.75)' : 'none', transformOrigin: '200px 150px' }}>
        {CAPAS.map((c, k) => (
          <g key={k}>
            <rect x="80" y={70 + k * 50} width="240" height="50" fill={c} />
            <text x="330" y={100 + k * 50} fontSize="10" fontWeight="700" fill={TINTA}>{k === 0 ? 'más reciente' : k === 3 ? 'más antigua' : ''}</text>
            <g style={ver(i >= 1)}>
              <text x={130 + k * 50} y={102 + k * 50} textAnchor="middle" fontSize="24" style={{ opacity: i === 3 && k === 1 ? 0.2 : 1, transition: suave }}>{FOSILES[3 - k]}</text>
            </g>
          </g>
        ))}
        {/* línea de catástrofe */}
        <g style={ver(i === 3)}>
          <path d="M 80 170 l 30 -6 l 30 8 l 30 -8 l 30 8 l 30 -6 l 30 8 l 30 -6 l 30 4" fill="none" stroke={ROJO} strokeWidth="4" />
          <T x={200} y={60} t="⚡ catástrofe" c={ROJO} s={14} />
        </g>
      </g>
      {/* comparación de dientes */}
      <g style={ver(i === 2, 'none', 'translate(30px, 0)')}>
        <rect x="250" y="60" width="140" height="190" rx="12" fill="#fff" stroke="#d8cfbd" strokeWidth="2" />
        <T x={320} y={84} t="Molares" s={13} />
        <g transform="translate(320 125)">
          <rect x="-40" y="-18" width="80" height="36" rx="8" fill="#efe6d4" stroke="#a6845a" />
          {[-30, -18, -6, 6, 18, 30].map((x) => <line key={x} x1={x} y1="-14" x2={x} y2="14" stroke="#a6845a" strokeWidth="3" />)}
        </g>
        <T x={320} y={160} t="mamut (fósil)" s={10} peso={600} />
        <g transform="translate(320 195)">
          <rect x="-40" y="-18" width="80" height="36" rx="8" fill="#efe6d4" stroke="#a6845a" />
          {[-24, -4, 16].map((x) => <path key={x} d={`M ${x} -12 l 8 12 l -8 12`} fill="none" stroke="#a6845a" strokeWidth="3" />)}
        </g>
        <T x={320} y={230} t="elefante (vivo)" s={10} peso={600} />
        <T x={320} y={246} t="≠ otra especie" c={ROJO} s={11} />
      </g>
    </svg>
  )
}

/* ── Lyell: un río que deposita capas ────────────────────────────────── */

const LYELL = ['rio', 'capas', 'erosion', 'tiempo']

export function EscenaLyell({ fase }: { fase: string }) {
  const i = idx(LYELL, fase)
  const n = i === 0 ? 2 : 9
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Lyell: ${fase}`} className="h-full w-full">
      {fondo(i === 2 ? '#f6ece2' : '#eaf1f4')}
      {/* capas apiladas */}
      {Array.from({ length: 9 }, (_, k) => (
        <rect key={k} x="40" y={250 - (k + 1) * 16} width="320" height="16"
          fill={k % 2 ? ARENA : '#d9bf8f'} stroke="#c6a875" strokeWidth="0.5"
          style={{ transition: suave, opacity: k < n ? 1 : 0 }} />
      ))}
      {/* agua del río */}
      <g style={ver(i <= 1)}>
        <rect x="40" y={250 - n * 16 - 30} width="320" height="30" fill="#9cc6e4" opacity="0.7" style={{ transition: suave }} />
        <T x={200} y={250 - n * 16 - 10} t="río → arena y barro" c={AZUL} s={11} />
      </g>
      {/* erosión: cárcavas talladas */}
      <g style={ver(i === 2)}>
        <path d="M 110 106 l 15 70 l 15 -70 z M 220 106 l 20 100 l 20 -100 z M 300 106 l 10 50 l 10 -50 z" fill={i === 2 ? '#f6ece2' : '#eaf1f4'} />
        {[120, 180, 260].map((x) => <T key={x} x={x} y={80} t="💧" s={16} />)}
        <T x={200} y={280} t="como en las cárcavas de la Tatacoa" s={11} peso={600} />
      </g>
      {/* reloj del tiempo */}
      <g style={ver(i === 3, 'none', 'scale(0.9)')}>
        <rect x="90" y="30" width="220" height="60" rx="12" fill="#fff" stroke="#c9d2dc" strokeWidth="2" />
        <T x={200} y={56} t="≈ 4600 millones de años" c={AZUL} s={16} />
        <T x={200} y={76} t="cambios pequeños + mucho tiempo" s={11} peso={600} />
      </g>
      <g style={ver(i === 1)}><T x={200} y={280} t="1 capa ≈ 1 creciente · miles de capas ≈ miles de años" s={11} peso={600} /></g>
    </svg>
  )
}

/* ── El viaje del Beagle y los picos ─────────────────────────────────── */

const BEAGLE = ['salida', 'sudamerica', 'galapagos', 'picos', 'regreso']
const RUTA: [number, number][] = [[215, 60], [190, 150], [150, 230], [110, 180], [80, 140], [215, 60]]
const PICOS = [
  { t: 'semillas duras', d: 'M 0 -8 Q 22 0 0 8 Z', c: MARRON },
  { t: 'insectos', d: 'M 0 -4 L 26 0 L 0 4 Z', c: TINTA },
  { t: 'cactus', d: 'M 0 -5 Q 26 2 0 5 Z', c: VERDE },
]

function Pinzon({ x, y, pico }: { x: number; y: number; pico: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M -30 6 L -44 14 L -40 2 Z" fill="#6b5a48" />
      <ellipse cx="-12" cy="4" rx="22" ry="14" fill="#7a6650" />
      <circle cx="8" cy="-6" r="11" fill="#7a6650" />
      <circle cx="11" cy="-8" r="2" fill="#fff" />
      <path d={pico} transform="translate(17 -4)" fill="#d9b26a" stroke="#a8822f" />
    </g>
  )
}

export function EscenaBeagle({ fase }: { fase: string }) {
  const i = idx(BEAGLE, fase)
  const paso = [0, 2, 4, 4, 5][i]
  const [bx, by] = RUTA[paso]
  const mapa = i !== 3
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Viaje del Beagle: ${fase}`} className="h-full w-full">
      {fondo('#e3eef6')}
      <g style={ver(mapa)}>
        {/* continentes esquemáticos */}
        <path d="M 200 40 q 30 -10 45 10 q 5 20 -20 30 q -25 0 -25 -40 z" fill="#cfdcb8" />
        <path d="M 110 110 q 50 -10 80 30 q 10 40 -25 70 q -15 40 -30 50 q -10 -40 -20 -70 q -15 -40 -5 -80 z" fill="#cfdcb8" />
        <T x={225} y={35} t="Inglaterra" s={9} />
        <T x={160} y={175} t="Sudamérica" s={9} />
        <circle cx="80" cy="140" r="6" fill="#b9a27e" /><circle cx="70" cy="148" r="4" fill="#b9a27e" />
        <T x={70} y={128} t="Galápagos" s={9} />
        <polyline points={RUTA.slice(0, paso + 1).map((p) => p.join(',')).join(' ')} fill="none" stroke="#5a7fa8" strokeWidth="2" strokeDasharray="5 4" />
        <g style={{ transition: suave, transform: `translate(${bx}px, ${by}px)` }}>
          <text textAnchor="middle" dominantBaseline="middle" fontSize="20">⛵</text>
        </g>
        <g style={ver(i === 1)}><T x={320} y={200} t="🦥 fósiles gigantes" s={13} /></g>
        <g style={ver(i === 2)}><T x={320} y={200} t="🐢 una tortuga por isla" s={13} /></g>
        <g style={ver(i === 4)}><T x={320} y={200} t="1836 · ¿por qué?" s={14} c={ROJO} /></g>
        <T x={320} y={60} t={['1831', '1832–1835', '1835', '1835', '1836'][i]} s={18} c={AZUL} />
      </g>
      {/* los picos */}
      <g style={ver(i === 3, 'none', 'scale(0.9)')}>
        {PICOS.map((p, k) => (
          <g key={p.t}>
            <rect x={20 + k * 125} y="70" width="110" height="150" rx="12" fill="#fff" stroke="#c9d2dc" strokeWidth="2" />
            <Pinzon x={85 + k * 125} y={140} pico={p.d} />
            <T x={75 + k * 125} y={200} t={p.t} c={p.c} s={11} />
          </g>
        ))}
        <T x={200} y={50} t="Un pico para cada alimento" s={15} />
      </g>
    </svg>
  )
}

/* ── La selección natural con escarabajos ────────────────────────────── */

const SELECCION = ['variacion', 'muchos', 'seleccion', 'herencia', 'cambio']
// color de cada escarabajo en cada fase: v = verde, m = marrón, '' = no está
const POBL: string[][] = [
  ['v', 'm', 'v', 'v', 'm', 'v', 'v', 'm', '', '', '', ''],
  ['v', 'm', 'v', 'v', 'm', 'v', 'v', 'm', 'v', 'm', 'v', 'v'],
  ['', 'm', '', 'v', 'm', '', '', 'm', '', 'm', '', ''],
  ['m', 'm', 'v', 'v', 'm', 'm', 'm', 'm', 'm', 'm', 'v', 'm'],
  ['m', 'm', 'm', 'm', 'm', 'm', 'm', 'v', 'm', 'm', 'm', 'm'],
]

function Escarabajo({ x, y, c }: { x: number; y: number; c: string }) {
  const color = c === 'v' ? '#5fb04a' : '#6e4a2c'
  return (
    <g transform={`translate(${x} ${y})`} style={{ transition: suave, opacity: c ? 1 : 0 }}>
      {[-6, 0, 6].map((d) => <line key={d} x1="-13" y1={d} x2="13" y2={d} stroke="#2e2e2e" strokeWidth="1.5" />)}
      <circle cx="0" cy="-12" r="5" fill="#2e2e2e" />
      <ellipse rx="10" ry="13" fill={color} />
      <line x1="0" y1="-10" x2="0" y2="12" stroke="#2e2e2e" strokeWidth="1" />
    </g>
  )
}

export function EscenaSeleccion({ fase }: { fase: string }) {
  const i = idx(SELECCION, fase)
  const fila = POBL[i]
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Selección natural: ${fase}`} className="h-full w-full">
      {fondo('#f4f1ea')}
      <rect x="20" y="40" width="360" height="200" rx="16" fill="#6b5236" />
      {fila.map((c, k) => (
        <Escarabajo key={k} x={60 + (k % 6) * 56} y={95 + Math.floor(k / 6) * 90} c={c} />
      ))}
      <g style={ver(i === 2, 'none', 'translate(-40px, -20px)')}>
        <T x={330} y={36} t="🐦" s={34} />
        <T x={200} y={268} t="Las aves ven fácil a los verdes sobre la tierra oscura" s={11} peso={600} />
      </g>
      <g style={ver(i !== 2)}>
        <T x={200} y={268} t={['Variación: no todos son iguales', 'Nacen más de los que caben', '', 'Los hijos se parecen a sus padres', 'Tras muchas generaciones: casi todos marrones'][i]} s={12} peso={700} />
      </g>
      <g>
        <text x="30" y="290" fontSize="11" fontWeight="700" fill="#5fb04a">verdes: {fila.filter((c) => c === 'v').length}</text>
        <text x="370" y="290" textAnchor="end" fontSize="11" fontWeight="700" fill="#6e4a2c">marrones: {fila.filter((c) => c === 'm').length}</text>
      </g>
    </svg>
  )
}

/* ── La síntesis moderna: Mendel + Darwin ────────────────────────────── */

const SINTESIS = ['piezas', 'union', 'frecuencias', 'mutacion']
const FREC = [0.2, 0.35, 0.55, 0.75]

export function EscenaSintesis({ fase }: { fase: string }) {
  const i = idx(SINTESIS, fase)
  const juntas = i >= 1
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Síntesis moderna: ${fase}`} className="h-full w-full">
      {fondo('#f2f0f6')}
      {/* las dos piezas de rompecabezas */}
      <g style={{ transition: suave, transform: i >= 2 ? 'translate(0, -70px) scale(0.6)' : 'none', transformOrigin: '200px 120px' }}>
        <g style={{ transition: suave, transform: juntas ? 'translate(0,0)' : 'translate(-40px, 0)' }}>
          <path d="M 70 70 h 120 v 30 a 15 15 0 0 1 0 30 v 30 h -120 z" fill="#c9daf2" stroke={AZUL} strokeWidth="2" />
          <T x={125} y={112} t="Darwin" c={AZUL} s={14} />
          <T x={125} y={130} t="selección" s={10} peso={600} />
        </g>
        <g style={{ transition: suave, transform: juntas ? 'translate(0,0)' : 'translate(40px, 0)' }}>
          <path d="M 190 70 h 120 v 90 h -120 v -30 a 15 15 0 0 0 0 -30 z" fill="#d6ecd0" stroke={VERDE} strokeWidth="2" />
          <T x={255} y={112} t="Mendel" c={VERDE} s={14} />
          <T x={255} y={130} t="herencia" s={10} peso={600} />
        </g>
      </g>
      <g style={ver(i === 1)}><T x={200} y={210} t="Una sola teoría (1918–1950)" s={15} /></g>
      {/* barra de frecuencias */}
      <g style={ver(i === 2)}>
        {FREC.map((f, k) => (
          <g key={k} transform={`translate(${60 + k * 75} 140)`}>
            <rect width="40" height="110" fill="#e5e1ec" rx="4" />
            <rect y={110 - f * 110} width="40" height={f * 110} fill={VERDE} rx="4" />
            <T x={20} y={128} t={`gen. ${k + 1}`} s={10} peso={600} />
          </g>
        ))}
        <T x={200} y={290} t="el alelo favorable se vuelve más común" s={11} peso={600} />
      </g>
      {/* mutación */}
      <g style={ver(i === 3, 'none', 'translate(0, 20px)')}>
        <text x="200" y="190" textAnchor="middle" fontSize="22" fontFamily="monospace" fontWeight="800" fill={TINTA}>
          A T G <tspan fill={ROJO}>C</tspan> A G
        </text>
        <T x={200} y={220} t="una mutación crea un alelo nuevo" c={ROJO} s={12} />
        <T x={200} y={250} t="mutación → variación → selección" s={13} />
      </g>
    </svg>
  )
}

/* ── Gradualismo y equilibrio puntuado ───────────────────────────────── */

const RITMOS = ['gradual', 'puntuado', 'ambos']

export function EscenaRitmos({ fase }: { fase: string }) {
  const i = idx(RITMOS, fase)
  const ejes = (
    <>
      <line x1="60" y1="250" x2="360" y2="250" stroke="#888" strokeWidth="2" markerEnd="url(#ri-fl)" />
      <line x1="60" y1="250" x2="60" y2="40" stroke="#888" strokeWidth="2" markerEnd="url(#ri-fl)" />
      <T x={210} y={275} t="tiempo (millones de años)" s={11} peso={600} />
      <text x="40" y="150" fontSize="11" fontWeight="600" fill={TINTA} textAnchor="middle" transform="rotate(-90 40 150)">forma</text>
    </>
  )
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Ritmos de la evolución: ${fase}`} className="h-full w-full">
      {fondo('#f4f1ea')}
      {ejes}
      <path d="M 70 230 L 340 70" fill="none" stroke={AZUL} strokeWidth="4" style={{ transition: suave, opacity: i === 0 || i === 2 ? 1 : 0.1 }} />
      <path d="M 70 230 H 140 V 180 H 220 V 120 H 290 V 70 H 340" fill="none" stroke={ROJO} strokeWidth="4" style={{ transition: suave, opacity: i >= 1 ? 1 : 0 }} />
      <g style={ver(i === 0)}><T x={250} y={60} t="cambio lento y constante" c={AZUL} s={12} /></g>
      <g style={ver(i === 1)}>
        <T x={180} y={200} t="quieto" s={10} peso={600} />
        <T x={235} y={150} t="salto" c={ROJO} s={10} />
        <T x={250} y={60} t="quietud larga + saltos cortos" c={ROJO} s={12} />
      </g>
      <g style={ver(i === 2)}><T x={210} y={30} t="Gradual (azul) y puntuado (rojo)" s={13} /></g>
      <Flecha id="ri-fl" />
    </svg>
  )
}

/* ═══ Tema 2 · Evidencias de la evolución ═══════════════════════════════ */

/* ── cómo se forma un fósil ──────────────────────────────────────────── */

const FOSIL = ['muere', 'sedimento', 'mineral', 'capas', 'aparece']

function Pez({ hueso = false }: { hueso?: boolean }) {
  return (
    <g>
      <path d="M -40 0 Q -10 -22 25 0 Q -10 22 -40 0 Z M 25 0 l 16 -12 v 24 z" fill={hueso ? 'none' : '#7aa7c9'} stroke={hueso ? '#efe6d4' : '#4f7fa3'} strokeWidth="2" style={{ transition: suave }} />
      {hueso && <><line x1="-38" y1="0" x2="28" y2="0" stroke="#efe6d4" strokeWidth="2.5" />
        {[-26, -16, -6, 4, 14].map((x) => <line key={x} x1={x} y1="-12" x2={x} y2="12" stroke="#efe6d4" strokeWidth="1.6" />)}
        <circle cx="-30" cy="-3" r="3" fill="#efe6d4" /></>}
    </g>
  )
}

export function EscenaFosil({ fase }: { fase: string }) {
  const i = idx(FOSIL, fase)
  const capas = [0, 1, 1, 4, 4][i]
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Formación de un fósil: ${fase}`} className="h-full w-full">
      {fondo('#e3eef6')}
      <rect x="0" y="80" width="400" height="220" fill="#b9d4e6" style={{ transition: suave, opacity: i <= 2 ? 1 : 0 }} />
      <rect x="0" y="230" width="400" height="70" fill="#c9ae80" />
      {Array.from({ length: 4 }, (_, k) => (
        <rect key={k} x="0" y={230 - (k + 1) * 32} width="400" height="32" fill={['#d8c59c', '#c2a575', '#d4bd92', '#b8986a'][k]}
          style={{ transition: suave, opacity: k < capas ? 1 : 0 }} />
      ))}
      {/* erosión: la roca se desgasta y el fósil aflora */}
      <path d="M 0 98 L 120 98 Q 200 210 280 98 L 400 98 L 400 0 L 0 0 Z" fill="#f2e6cf" style={{ transition: suave, opacity: i === 4 ? 1 : 0 }} />
      <g style={{ transition: suave, transform: i === 0 ? 'translate(200px, 150px)' : 'translate(200px, 216px)' }}>
        <Pez hueso={i >= 2} />
      </g>
      <g style={ver(i === 2)}><T x={200} y={60} t="El agua con minerales reemplaza el hueso por roca" s={12} c={AZUL} /></g>
      <g style={ver(i === 3)}><T x={200} y={60} t="Más capas encima: más antiguo cuanto más abajo" s={12} /></g>
      <g style={ver(i === 4)}><T x={200} y={40} t="🔍 La erosión deja ver el fósil" s={14} c={MARRON} /></g>
    </svg>
  )
}

/* ── anatomía comparada: la misma extremidad que se transforma ─────────── */

const ANATOMIA: Especie[] = ['humano', 'murcielago', 'ballena', 'ave']

export function EscenaAnatomia({ fase }: { fase: string }) {
  const esp = (ANATOMIA.includes(fase as Especie) ? fase : 'humano') as Especie
  const e = ESPECIES.find((x) => x.id === esp)!
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Extremidad homóloga: ${e.n}`} className="h-full w-full">
      {fondo('#f4f1ea')}
      <g transform="translate(40 140) scale(0.62)"><Extremidad especie={esp} /></g>
      <T x={200} y={40} t={`${e.ic} ${e.n}`} s={16} />
      <T x={200} y={60} t={`sirve para ${e.uso}`} s={12} peso={600} />
      {HUESOS.map((h, k) => (
        <g key={h.id}>
          <rect x={22 + k * 92} y="250" width="12" height="12" rx="3" fill={h.c} />
          <text x={38 + k * 92} y="260" fontSize="10" fontWeight="700" fill={TINTA}>{h.n}</text>
        </g>
      ))}
    </svg>
  )
}

/* ── embriones de vertebrados ────────────────────────────────────────── */

const EMBRIONES = ['temprano', 'medio', 'adulto']
const VERTEBRADOS = [
  { n: 'Pez', adulto: '🐟' },
  { n: 'Pollo', adulto: '🐔' },
  { n: 'Cerdo', adulto: '🐖' },
  { n: 'Humano', adulto: '🧍' },
]

function Embrion({ k, i }: { k: number; i: number }) {
  // en la fase temprana todos son casi iguales; luego divergen
  const estira = i === 0 ? 1 : [1.25, 1.1, 1.05, 0.95][k]
  const cabeza = i === 0 ? 14 : [12, 15, 16, 20][k]
  return (
    <g style={{ transition: suave, opacity: i === 2 ? 0 : 1 }}>
      <path d={`M 0 ${-30 * estira} Q 22 -10 14 18 Q 4 38 -10 40 Q -2 26 -8 14 Q -18 -4 0 ${-30 * estira} Z`} fill="#f3c9b6" stroke="#d99a86" strokeWidth="1.5" style={{ transition: suave }} />
      <circle cx="2" cy={-24 * estira} r={cabeza} fill="#f3c9b6" stroke="#d99a86" strokeWidth="1.5" style={{ transition: suave }} />
      <circle cx="6" cy={-26 * estira} r="2.5" fill="#6b4a3a" />
      {/* arcos faríngeos */}
      {[0, 1, 2].map((a) => <path key={a} d={`M -6 ${-8 + a * 6} q 6 2 10 0`} fill="none" stroke="#c97b66" strokeWidth="1.5" />)}
      {/* cola */}
      <path d="M -10 40 q -10 6 -14 -2" fill="none" stroke="#d99a86" strokeWidth="3" style={{ transition: suave, opacity: i === 0 || k === 0 ? 1 : 0.4 }} />
    </g>
  )
}

export function EscenaEmbriones({ fase }: { fase: string }) {
  const i = idx(EMBRIONES, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Embriones de vertebrados: ${fase}`} className="h-full w-full">
      {fondo('#f6f0ee')}
      {VERTEBRADOS.map((v, k) => (
        <g key={v.n} transform={`translate(${60 + k * 93} 140)`}>
          <Embrion k={k} i={i} />
          <text textAnchor="middle" fontSize="54" dominantBaseline="middle" style={{ transition: suave, opacity: i === 2 ? 1 : 0 }}>{v.adulto}</text>
          <T x={0} y={95} t={v.n} s={13} />
        </g>
      ))}
      <g style={ver(i === 0)}><T x={200} y={40} t="Al principio: arcos en el cuello y cola" s={13} /></g>
      <g style={ver(i === 1)}><T x={200} y={40} t="Luego cada uno toma su propia forma" s={13} /></g>
      <g style={ver(i === 2)}><T x={200} y={40} t="Adultos muy distintos, origen común" s={13} c={AZUL} /></g>
    </svg>
  )
}

/* ── biogeografía: colonizar islas ───────────────────────────────────── */

const ISLAS = ['continente', 'llegada', 'diversifica']
const ISLAS_POS = [[250, 90], [320, 160], [260, 230]]
const AVES_ISLA = ['#c9702f', '#5fb04a', '#3f6fb8']

function Ave({ x, y, c, k = 1 }: { x: number; y: number; c: string; k?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <ellipse rx="10" ry="7" fill={c} />
      <circle cx="9" cy="-5" r="5" fill={c} />
      <path d="M 13 -6 l 6 1 l -6 2 z" fill="#d9b26a" />
    </g>
  )
}

export function EscenaIslas({ fase }: { fase: string }) {
  const i = idx(ISLAS, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Biogeografía de islas: ${fase}`} className="h-full w-full">
      {fondo('#cfe3f1')}
      <path d="M -10 20 Q 90 60 110 150 Q 100 240 -10 290 Z" fill="#cfdcb8" />
      <T x={55} y={150} t="Continente" s={12} />
      {ISLAS_POS.map(([x, y], k) => <ellipse key={k} cx={x} cy={y} rx="34" ry="20" fill="#d9cfa0" />)}
      <Ave x={60} y={180} c="#8a8a8a" k={1.4} />
      {ISLAS_POS.map(([x, y], k) => (
        <g key={k}>
          <g style={{ transition: suave, opacity: i >= 1 ? 1 : 0, transform: i >= 1 ? `translate(${x}px, ${y - 4}px)` : 'translate(70px, 180px)' }}>
            <Ave x={0} y={0} c={i === 2 ? AVES_ISLA[k] : '#8a8a8a'} k={1.2} />
          </g>
          <path d={`M 80 175 Q ${(x + 80) / 2} ${y - 60} ${x - 30} ${y}`} fill="none" stroke="#888" strokeWidth="1.5" strokeDasharray="4 4" style={{ transition: suave, opacity: i === 1 ? 1 : 0 }} />
        </g>
      ))}
      <g style={ver(i === 2)}><T x={290} y={30} t="Una especie distinta en cada isla" s={12} c={MARRON} /></g>
      <g style={ver(i === 0)}><T x={290} y={30} t="Las islas nacen sin aves" s={12} /></g>
      <g style={ver(i === 1)}><T x={290} y={30} t="Llegan unas pocas del continente" s={12} /></g>
    </svg>
  )
}

/* ── evidencia molecular: comparar secuencias ─────────────────────────── */

const MOLECULAR = ['secuencias', 'comparar', 'arbol']
const BASE = 'ATGCCGTAAGCT'
const SEQ = [
  { n: 'Humano', s: BASE },
  { n: 'Chimpancé', s: 'ATGCCGTAAGCC' },
  { n: 'Ratón', s: 'ATGACGTTAGCC' },
  { n: 'Pez', s: 'TTGACCTTAGAC' },
]

export function EscenaMolecular({ fase }: { fase: string }) {
  const i = idx(MOLECULAR, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Evidencia molecular: ${fase}`} className="h-full w-full">
      {fondo('#f2f0f6')}
      <g style={{ transition: suave, transform: i === 2 ? 'translate(-120px, 0) scale(0.7)' : 'none', transformOrigin: '0 150px' }}>
        {SEQ.map((q, k) => {
          const dif = [...q.s].filter((b, j) => b !== BASE[j]).length
          return (
            <g key={q.n} transform={`translate(20 ${70 + k * 50})`}>
              <text x="0" y="0" fontSize="12" fontWeight="800" fill={TINTA}>{q.n}</text>
              {[...q.s].map((b, j) => {
                const distinta = b !== BASE[j]
                return <text key={j} x={95 + j * 18} y="0" fontSize="15" fontFamily="monospace" fontWeight="800"
                  fill={i >= 1 && distinta ? ROJO : TINTA} style={{ transition: 'fill 0.6s' }}>{b}</text>
              })}
              <text x="320" y="0" fontSize="11" fontWeight="700" fill={ROJO} style={{ transition: suave, opacity: i >= 1 && k > 0 ? 1 : 0 }}>{dif} diferencias</text>
            </g>
          )
        })}
      </g>
      {/* árbol de parentesco */}
      <g style={ver(i === 2, 'none', 'translate(30px, 0)')}>
        <path d="M 280 100 V 140 M 280 100 H 300 M 280 140 H 300 M 260 120 V 185 M 260 120 H 280 M 260 185 H 300 M 240 152 V 230 M 240 152 H 260 M 240 230 H 300 M 220 191 H 240" fill="none" stroke={MARRON} strokeWidth="3" />
        {['Humano', 'Chimpancé', 'Ratón', 'Pez'].map((n, k) => (
          <text key={n} x="306" y={[104, 144, 189, 234][k]} fontSize="11" fontWeight="800" fill={TINTA}>{n}</text>
        ))}
      </g>
      <T x={200} y={30} t={['El mismo gen en cuatro animales', 'Menos diferencias = parientes más cercanos', 'Las diferencias dibujan el árbol de parentesco'][i]} s={13} />
      <T x={200} y={290} t="secuencias de ejemplo, simplificadas" s={9} peso={600} />
    </svg>
  )
}

/* ═══ Tema 3 · Selección natural ═════════════════════════════════════════ */

/* ── la polilla moteada y el hollín ──────────────────────────────────── */

const POLILLAS = ['antes', 'hollin', 'despues', 'limpio']
const POL_POS = Array.from({ length: 12 }, (_, k) => [130 + (k % 4) * 50 + (Math.floor(k / 4) % 2) * 20, 70 + Math.floor(k / 4) * 60])
// cuántas oscuras hay en cada fase (de 12)
const POL_OSC = [1, 1, 10, 3]

function MiniPolilla({ x, y, oscura }: { x: number; y: number; oscura: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M 0 0 L -14 -7 Q -17 5 -5 7 Z M 0 0 L 14 -7 Q 17 5 5 7 Z" fill={oscura ? '#3b3631' : '#e9e4d8'} stroke="#8a8478" strokeWidth="0.6" style={{ transition: 'fill 0.9s' }} />
      <ellipse rx="2" ry="6" fill="#5a4a3c" />
    </g>
  )
}

export function EscenaPolillas({ fase }: { fase: string }) {
  const i = idx(POLILLAS, fase)
  const tronco = i === 1 || i === 2 ? '#35302b' : '#d9d3c4'
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Polilla moteada: ${fase}`} className="h-full w-full">
      {fondo(i === 1 || i === 2 ? '#c9c4bc' : '#e9efe4')}
      <g style={ver(i === 1 || i === 2)}>
        <rect x="320" y="150" width="40" height="110" fill="#6b625a" />
        <rect x="335" y="110" width="12" height="40" fill="#6b625a" />
        <circle cx="345" cy="90" r="16" fill="#8f8a84" opacity="0.7" /><circle cx="360" cy="65" r="20" fill="#8f8a84" opacity="0.5" />
      </g>
      <rect x="100" y="20" width="200" height="260" fill={tronco} style={{ transition: 'fill 1s' }} />
      {POL_POS.map(([x, y], k) => <MiniPolilla key={k} x={x} y={y} oscura={k < POL_OSC[i]} />)}
      <T x={200} y={295} t={['Antes de 1850: casi todas claras', 'Las fábricas ennegrecen los troncos', 'Hacia 1900: casi todas oscuras', 'Aire limpio: vuelven las claras'][i]} s={12} />
      <T x={50} y={40} t={['≈ 1800', '≈ 1850', '≈ 1900', '≈ 1970'][i]} s={16} c={AZUL} />
    </svg>
  )
}

/* ── selección artificial: del teosinte al maíz ──────────────────────── */

const MAIZ = ['teosinte', 'escoger', 'generaciones', 'variedades']

function Mazorca({ x, y, k, c = '#e8c547' }: { x: number; y: number; k: number; c?: string }) {
  // k = 0 teosinte (pequeño, pocos granos) … 1 maíz actual
  const largo = 30 + 90 * k
  const ancho = 10 + 22 * k
  const filas = Math.round(2 + 6 * k)
  return (
    <g transform={`translate(${x} ${y})`} style={{ transition: suave }}>
      <path d={`M 0 ${largo / 2 + 10} q -${ancho} -10 -${ancho * 0.6} -${largo} M 0 ${largo / 2 + 10} q ${ancho} -10 ${ancho * 0.6} -${largo}`} fill="none" stroke="#8fb06a" strokeWidth="3" />
      <ellipse rx={ancho / 2} ry={largo / 2} fill={c} stroke="#b8902a" strokeWidth="1.2" />
      {Array.from({ length: filas }, (_, f) => (
        <line key={f} x1={-ancho / 2 + ((f + 1) * ancho) / (filas + 1)} y1={-largo / 2 + 6} x2={-ancho / 2 + ((f + 1) * ancho) / (filas + 1)} y2={largo / 2 - 6} stroke="#b8902a" strokeWidth="0.8" />
      ))}
    </g>
  )
}

export function EscenaMaiz({ fase }: { fase: string }) {
  const i = idx(MAIZ, fase)
  const k = [0, 0.15, 0.85, 0.85][i]
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Del teosinte al maíz: ${fase}`} className="h-full w-full">
      {fondo('#f4f1ea')}
      <g style={ver(i <= 2)}>
        <Mazorca x={200} y={150} k={k} />
        <g style={ver(i === 1)}>
          <Mazorca x={90} y={150} k={0} />
          <Mazorca x={310} y={150} k={0.05} />
          <T x={200} y={70} t="✋ se siembran las semillas de la mejor" s={12} />
        </g>
        <T x={200} y={270} t={['Teosinte: unos pocos granos duros', 'Los agricultores escogen las plantas con más grano', 'Miles de años después: mazorcas grandes', ''][i]} s={12} />
        <g style={ver(i === 2)}><T x={200} y={40} t="≈ 9000 años de selección en México" s={13} c={AZUL} /></g>
      </g>
      <g style={ver(i === 3, 'none', 'translate(0, 20px)')}>
        {['#e8c547', '#f2efe2', '#7a3b8c', '#c43c3c', '#d98a2f'].map((c, n) => <Mazorca key={c} x={60 + n * 70} y={140} k={0.65} c={c} />)}
        <T x={200} y={250} t="Variedades criollas: cada comunidad seleccionó las suyas" s={12} />
      </g>
    </svg>
  )
}

/* ── resistencia a los antibióticos ──────────────────────────────────── */

const RESIST = ['infeccion', 'antibiotico', 'sobreviven', 'regresan']
const BAC_POS = Array.from({ length: 20 }, (_, k) => [90 + (k % 5) * 55 + ((k * 17) % 11), 70 + Math.floor(k / 5) * 45 + ((k * 29) % 9)])
const RESISTENTES = new Set([3, 11])

export function EscenaResistencia({ fase }: { fase: string }) {
  const i = idx(RESIST, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Resistencia a antibióticos: ${fase}`} className="h-full w-full">
      {fondo(i === 1 ? '#eef2f8' : '#f4f1ea')}
      <circle cx="200" cy="140" r="125" fill="#fff" stroke="#c9d2dc" strokeWidth="3" />
      {BAC_POS.map(([x, y], k) => {
        const res = RESISTENTES.has(k)
        const viva = i === 0 || res || i === 3
        const color = i === 3 ? '#c43c3c' : res ? '#c43c3c' : '#4f8a3c'
        return (
          <g key={k} transform={`translate(${x} ${y}) rotate(${(k * 40) % 180})`} style={{ transition: suave, opacity: viva ? 1 : 0.12 }}>
            <rect x="-11" y="-5" width="22" height="10" rx="5" fill={color} style={{ transition: 'fill 0.8s' }} />
          </g>
        )
      })}
      <g style={ver(i === 1)}>{[[120, 50], [280, 60], [200, 240]].map(([x, y]) => <T key={x} x={x} y={y} t="💊" s={20} />)}</g>
      <T x={200} y={292} t={['Una infección: casi todas sensibles, unas pocas resistentes', 'El antibiótico mata a las sensibles', 'Sobreviven las que ya eran resistentes', 'Se multiplican: ahora la infección es resistente'][i]} s={11} />
    </svg>
  )
}

/* ── tipos de selección: curvas de distribución ──────────────────────── */

const TIPOS = ['inicio', 'direccional', 'estabilizadora', 'disruptiva']

function curva(media: number, ancho: number, alto: number, media2?: number) {
  const pts: string[] = []
  for (let x = 40; x <= 360; x += 8) {
    let y = alto * Math.exp(-((x - media) ** 2) / (2 * ancho ** 2))
    if (media2 !== undefined) y = alto * Math.exp(-((x - media2) ** 2) / (2 * ancho ** 2)) + y
    pts.push(`${x},${230 - y}`)
  }
  return `M ${pts.join(' L ')}`
}

export function EscenaTiposSeleccion({ fase }: { fase: string }) {
  const i = idx(TIPOS, fase)
  const nueva = [curva(200, 45, 140), curva(260, 45, 140), curva(200, 22, 170), curva(120, 28, 110, 280)][i]
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Tipos de selección: ${fase}`} className="h-full w-full">
      {fondo('#f4f1ea')}
      <line x1="40" y1="230" x2="365" y2="230" stroke="#888" strokeWidth="2" />
      <T x={200} y={250} t="tamaño del pico (pequeño → grande)" s={10} peso={600} />
      <path d={curva(200, 45, 140)} fill="none" stroke="#aaa" strokeWidth="2" strokeDasharray="5 4" />
      <path d={nueva} fill="none" stroke={ROJO} strokeWidth="3.5" />
      <g style={ver(i === 1)}><T x={300} y={60} t="→ se favorece un extremo" c={ROJO} s={12} /></g>
      <g style={ver(i === 2)}><T x={200} y={45} t="→ ← se favorece el promedio" c={ROJO} s={12} /></g>
      <g style={ver(i === 3)}><T x={200} y={60} t="← → se favorecen los dos extremos" c={ROJO} s={12} /></g>
      <T x={200} y={280} t={['Población inicial (línea gris)', 'Direccional: semillas duras, picos más grandes', 'Estabilizadora: los picos medianos sobreviven más', 'Disruptiva: dos tipos de semilla, dos tipos de pico'][i]} s={11} />
    </svg>
  )
}

/* ═══ Tema 4 · Adaptaciones ══════════════════════════════════════════════ */

/* ── qué es una adaptación: el mismo grupo en dos ambientes ───────────── */

const ADAPTA = ['pregunta', 'paramo', 'selva', 'idea']

export function EscenaAdaptacion({ fase }: { fase: string }) {
  const i = idx(ADAPTA, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Qué es una adaptación: ${fase}`} className="h-full w-full">
      {fondo('#f4f1ea')}
      {/* páramo */}
      <g style={{ transition: suave, opacity: i === 2 ? 0.25 : 1 }}>
        <rect x="20" y="40" width="170" height="200" rx="14" fill="#dfe8ef" />
        <T x={105} y={62} t="Páramo · 3500 m" s={11} />
        <T x={105} y={84} t="❄️ frío de noche" s={10} peso={600} />
        <ellipse cx="105" cy="170" rx="44" ry="30" fill="#4a3528" />
        <circle cx="140" cy="148" r="20" fill="#4a3528" />
        <path d="M 150 140 a 8 8 0 1 1 6 12" fill="none" stroke="#e8d5a0" strokeWidth="4" />
        <T x={105} y={225} t="pelaje grueso y largo" s={10} c={AZUL} />
      </g>
      {/* selva */}
      <g style={{ transition: suave, opacity: i === 1 ? 0.25 : 1 }}>
        <rect x="210" y="40" width="170" height="200" rx="14" fill="#e3efdc" />
        <T x={295} y={62} t="Selva · 200 m" s={11} />
        <T x={295} y={84} t="☀️ calor y humedad" s={10} peso={600} />
        <ellipse cx="295" cy="170" rx="38" ry="22" fill="#8a6a40" />
        <circle cx="326" cy="156" r="14" fill="#8a6a40" />
        <path d="M 330 146 l 6 -12 l 4 12 z" fill="#8a6a40" />
        <T x={295} y={225} t="pelaje corto, orejas que disipan calor" s={9} c={VERDE} />
      </g>
      <g style={ver(i === 0)}><T x={200} y={275} t="¿Por qué los animales de cada lugar son tan distintos?" s={13} /></g>
      <g style={ver(i === 3)}>
        <rect x="40" y="252" width="320" height="40" rx="10" fill="#fff" stroke="#d8cfbd" />
        <T x={200} y={270} t="Adaptación: rasgo heredado que ayuda" s={12} />
        <T x={200} y={286} t="a sobrevivir y reproducirse en un ambiente" s={11} peso={600} />
      </g>
    </svg>
  )
}

/* ── el frailejón, un experto del frío ───────────────────────────────── */

const FRAILEJON = ['planta', 'roseta', 'pelos', 'abrigo', 'agua']

export function EscenaFrailejon({ fase }: { fase: string }) {
  const i = idx(FRAILEJON, fase)
  const zoom = ['none', 'translate(0px, 80px) scale(1.5)', 'translate(-180px, 100px) scale(2.4)', 'translate(-80px, -140px) scale(1.8)', 'none'][i]
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Adaptaciones del frailejón: ${fase}`} className="h-full w-full">
      {fondo(i === 4 ? '#e6eef4' : '#eef1ea')}
      <g style={{ transition: suave, transform: zoom, transformOrigin: '200px 150px' }}>
        <rect x="-50" y="270" width="500" height="60" fill="#9fae7a" />
        {/* tallo cubierto de hojas secas */}
        <rect x="186" y="120" width="28" height="150" fill="#8a7458" />
        {Array.from({ length: 12 }, (_, k) => (
          <path key={k} d={`M ${k % 2 ? 186 : 214} ${130 + k * 12} l ${k % 2 ? -12 : 12} 10`} stroke="#a89070" strokeWidth="5" strokeLinecap="round" />
        ))}
        {/* roseta de hojas afelpadas */}
        {Array.from({ length: 11 }, (_, k) => {
          const a = -170 + k * 16
          return <ellipse key={k} cx="200" cy="112" rx="7" ry="34" fill="#c9d6b0" stroke="#aebd92"
            transform={`rotate(${a + 90} 200 112) translate(0 -30)`} />
        })}
        <circle cx="200" cy="112" r="10" fill="#b5c49a" />
        {/* pelitos */}
        <g style={{ transition: suave, opacity: i === 2 ? 1 : 0 }}>
          {Array.from({ length: 14 }, (_, k) => <line key={k} x1={262 + (k % 7) * 3} y1={92 + Math.floor(k / 7) * 6} x2={264 + (k % 7) * 3} y2={88 + Math.floor(k / 7) * 6} stroke="#fff" strokeWidth="0.8" />)}
        </g>
        {/* agua guardada */}
        <g style={{ transition: suave, opacity: i === 4 ? 1 : 0 }}>
          <rect x="192" y="140" width="16" height="110" rx="6" fill="#7fb4dc" opacity="0.8" />
          {[110, 160, 290, 320].map((x) => <T key={x} x={x} y={60} t="💧" s={14} />)}
        </g>
      </g>
      <rect x="20" y="250" width="360" height="42" rx="10" fill="#ffffffdd" />
      <T x={200} y={268} t={['Frailejón: vive a más de 3000 m, con heladas casi cada noche', 'Hojas en roseta: de noche se cierran y protegen el centro', 'Pelos blancos: como una cobija y un filtro contra el sol', 'Hojas secas pegadas al tallo: abrigo para el tallo', 'Guarda agua en su tallo y capta la de la niebla'][i]} s={11} />
      <T x={200} y={284} t={['', 'adaptación morfológica', 'adaptación morfológica', 'adaptación morfológica', 'agua para el páramo y los ríos'][i]} s={10} peso={600} c={AZUL} />
    </svg>
  )
}

/* ── fisiológicas: el cactus que respira de noche ────────────────────── */

const CACTUS = ['dia', 'noche']

export function EscenaCactus({ fase }: { fase: string }) {
  const i = idx(CACTUS, fase)
  const noche = i === 1
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Cactus de la Tatacoa: ${fase}`} className="h-full w-full">
      {fondo(noche ? '#2c3550' : '#f6e8c8')}
      <circle cx={noche ? 330 : 70} cy="60" r="26" fill={noche ? '#e9e6d6' : '#f2b632'} style={{ transition: suave }} />
      <rect x="-10" y="250" width="420" height="60" fill={noche ? '#5a4a3c' : '#d9a86a'} style={{ transition: 'fill 0.8s' }} />
      <rect x="180" y="110" width="40" height="145" rx="20" fill="#5f9a4f" />
      <rect x="130" y="150" width="30" height="60" rx="15" fill="#5f9a4f" />
      <rect x="140" y="190" width="45" height="20" rx="10" fill="#5f9a4f" />
      {/* estomas */}
      {[[200, 140], [200, 180], [200, 220], [145, 170]].map(([x, y], k) => (
        <g key={k} transform={`translate(${x} ${y})`}>
          <ellipse rx="7" ry="4" fill="#3f6d33" />
          <ellipse rx={noche ? 3 : 0.5} ry="2.5" fill="#1d2b17" style={{ transition: suave }} />
        </g>
      ))}
      <g style={ver(noche)}>
        <T x={290} y={160} t="CO₂ →" s={14} c="#e9e6d6" />
        <T x={300} y={185} t="estomas abiertos" s={11} c="#e9e6d6" />
      </g>
      <g style={ver(!noche)}>
        <T x={300} y={160} t="estomas cerrados" s={12} />
        <T x={300} y={180} t="no pierde agua" s={11} peso={600} />
      </g>
      <T x={200} y={285} t={noche ? 'De noche, fresco: abre los estomas y guarda el CO₂' : 'De día, calor: cierra los estomas y usa el CO₂ guardado'} s={11} c={noche ? '#fff' : TINTA} />
    </svg>
  )
}

/* ── de conducta: aves migratorias ───────────────────────────────────── */

const MIGRA = ['verano', 'otono', 'colombia', 'regreso']

export function EscenaMigracion({ fase }: { fase: string }) {
  const i = idx(MIGRA, fase)
  const pos = [[150, 70], [190, 150], [240, 225], [150, 70]][i]
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Migración: ${fase}`} className="h-full w-full">
      {fondo('#e3eef6')}
      <path d="M 40 20 Q 160 10 260 40 Q 240 110 200 130 Q 180 160 210 185 L 230 200 Q 280 230 270 290 L 210 290 Q 200 240 180 210 Q 120 160 90 110 Q 50 70 40 20 Z" fill="#cfdcb8" />
      <T x={150} y={55} t="Norteamérica" s={10} />
      <T x={245} y={260} t="Colombia" s={10} />
      <path d="M 150 70 Q 230 140 240 225" fill="none" stroke="#888" strokeWidth="2" strokeDasharray="5 5" />
      <g style={{ transition: 'transform 1.6s cubic-bezier(.45,.05,.25,1)', transform: `translate(${pos[0]}px, ${pos[1]}px)` }}>
        <text textAnchor="middle" dominantBaseline="middle" fontSize="24">🐦</text>
      </g>
      <T x={330} y={40} t={['Junio', 'Septiembre', 'Diciembre', 'Abril'][i]} s={18} c={AZUL} />
      <rect x="20" y="250" width="170" height="44" rx="10" fill="#fff" />
      <T x={105} y={268} t={['Cría en el norte', 'Se acorta el día: parte', 'Pasa el invierno aquí', 'Vuelve a criar'][i]} s={11} />
      <T x={105} y={284} t={['comida abundante', 'el frío se acerca', 'hay insectos y frutos', 'la primavera regresa'][i]} s={10} peso={600} />
    </svg>
  )
}

/* ── camuflaje, advertencia y mimetismo ──────────────────────────────── */

const MIMETISMO = ['camuflaje', 'advertencia', 'imitadora', 'aprende']

function Serpiente({ x, y, falsa }: { x: number; y: number; falsa: boolean }) {
  // coral verdadera: rojo-amarillo-negro-amarillo-rojo; falsa: orden de anillos distinto
  const anillos = falsa ? ['#c43c3c', '#2b2b2b', '#e8d14a', '#2b2b2b', '#c43c3c', '#2b2b2b', '#e8d14a', '#2b2b2b'] : ['#c43c3c', '#e8d14a', '#2b2b2b', '#e8d14a', '#c43c3c', '#e8d14a', '#2b2b2b', '#e8d14a']
  return (
    <g transform={`translate(${x} ${y})`}>
      {anillos.map((c, k) => <rect key={k} x={k * 16} y="0" width="16" height="14" fill={c} />)}
      <ellipse cx="-4" cy="7" rx="10" ry="8" fill="#2b2b2b" />
    </g>
  )
}

export function EscenaMimetismo({ fase }: { fase: string }) {
  const i = idx(MIMETISMO, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Camuflaje y mimetismo: ${fase}`} className="h-full w-full">
      {fondo('#eef1ea')}
      {/* camuflaje: insecto hoja entre hojas */}
      <g style={ver(i === 0)}>
        {Array.from({ length: 9 }, (_, k) => (
          <ellipse key={k} cx={90 + (k % 3) * 110} cy={80 + Math.floor(k / 3) * 60} rx="34" ry="18" fill="#6aa04f" transform={`rotate(${(k * 23) % 60 - 30} ${90 + (k % 3) * 110} ${80 + Math.floor(k / 3) * 60})`} />
        ))}
        <ellipse cx="200" cy="140" rx="30" ry="16" fill="#71a656" stroke="#5a8c41" />
        <line x1="172" y1="140" x2="228" y2="140" stroke="#5a8c41" strokeWidth="1.5" />
        <T x={200} y={270} t="¿Ves el insecto hoja? Está en el centro" s={12} />
      </g>
      {/* advertencia: rana dorada */}
      <g style={ver(i === 1)}>
        <ellipse cx="200" cy="150" rx="50" ry="34" fill="#f2c31b" />
        <circle cx="175" cy="125" r="11" fill="#f2c31b" /><circle cx="225" cy="125" r="11" fill="#f2c31b" />
        <circle cx="175" cy="125" r="5" fill="#2b2b2b" /><circle cx="225" cy="125" r="5" fill="#2b2b2b" />
        <T x={200} y={230} t="Rana dorada: colores vivos = «soy venenosa»" s={12} />
        <T x={200} y={250} t="Pacífico colombiano (Cauca)" s={10} peso={600} />
      </g>
      {/* coral y falsa coral */}
      <g style={ver(i >= 2)}>
        <Serpiente x={90} y={90} falsa={false} />
        <T x={160} y={80} t="Coral verdadera (venenosa)" s={11} c={ROJO} />
        <Serpiente x={90} y={170} falsa />
        <T x={160} y={160} t="Falsa coral (inofensiva)" s={11} c={VERDE} />
      </g>
      <g style={ver(i === 2)}><T x={200} y={260} t="La inofensiva imita los colores de la peligrosa" s={12} /></g>
      <g style={ver(i === 3)}>
        <T x={330} y={130} t="🦅" s={36} />
        <T x={200} y={250} t="El depredador que aprendió a evitar la coral" s={12} />
        <T x={200} y={268} t="también evita a la imitadora" s={12} />
      </g>
    </svg>
  )
}

/* ═══ Tema 5 · Mecanismos de cambio en poblaciones ══════════════════════ */

/** canica de un alelo: A (azul) o a (naranja) */
function Canica({ x, y, a, visible = true }: { x: number; y: number; a: boolean; visible?: boolean }) {
  return (
    <g style={{ transition: suave, opacity: visible ? 1 : 0, transform: `translate(${x}px, ${y}px)` }}>
      <circle r="9" fill={a ? AZUL : '#e08a3c'} stroke="#fff" strokeWidth="1.5" />
      <text y="4" textAnchor="middle" fontSize="10" fontWeight="900" fill="#fff">{a ? 'A' : 'a'}</text>
    </g>
  )
}

/* ── el acervo genético como un frasco de canicas ────────────────────── */

const ACERVO = ['poblacion', 'frasco', 'frecuencia', 'cambio']
const ALELOS_1 = [1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0] // 12 A de 20
const ALELOS_2 = [1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1] // 17 A de 20

export function EscenaAcervo({ fase }: { fase: string }) {
  const i = idx(ACERVO, fase)
  const alelos = i === 3 ? ALELOS_2 : ALELOS_1
  const enFrasco = i >= 1
  const nA = alelos.filter(Boolean).length
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Acervo genético: ${fase}`} className="h-full w-full">
      {fondo('#f4f1ea')}
      {/* individuos con sus dos alelos */}
      {Array.from({ length: 10 }, (_, k) => (
        <g key={k} style={ver(!enFrasco)}>
          <circle cx={50 + (k % 5) * 75} cy={90 + Math.floor(k / 5) * 90} r="26" fill="#efe6d4" stroke="#c9b48a" strokeWidth="2" />
          <T x={50 + (k % 5) * 75} y={140 + Math.floor(k / 5) * 90} t={`${alelos[2 * k] ? 'A' : 'a'}${alelos[2 * k + 1] ? 'A' : 'a'}`} s={11} />
        </g>
      ))}
      <g style={ver(enFrasco)}>
        <path d="M 120 60 h 160 v 20 q 20 10 20 40 v 120 q 0 20 -20 20 h -160 q -20 0 -20 -20 v -120 q 0 -30 20 -40 z" fill="#e8f1f8" stroke="#9db7cc" strokeWidth="3" />
      </g>
      {alelos.map((a, k) => {
        const ind = Math.floor(k / 2)
        const x = enFrasco ? 135 + (k % 7) * 22 : 40 + (ind % 5) * 75 + (k % 2) * 20
        const y = enFrasco ? 130 + Math.floor(k / 7) * 26 : 90 + Math.floor(ind / 5) * 90
        return <Canica key={k} x={x} y={y} a={!!a} />
      })}
      <g style={ver(i >= 2)}>
        <rect x="70" y="250" width="260" height="40" rx="10" fill="#fff" stroke="#d8cfbd" />
        <T x={200} y={268} t={`A: ${nA} de 20 = ${nA * 5} %   ·   a: ${20 - nA} de 20 = ${(20 - nA) * 5} %`} s={12} />
        <T x={200} y={284} t={i === 3 ? 'generaciones después: cambió la frecuencia = evolución' : 'frecuencias alélicas'} s={10} peso={600} c={i === 3 ? ROJO : AZUL} />
      </g>
      <g style={ver(i === 0)}><T x={200} y={40} t="Una población: cada individuo lleva dos alelos" s={13} /></g>
      <g style={ver(i === 1)}><T x={200} y={40} t="Todos los alelos juntos: el acervo genético" s={13} /></g>
    </svg>
  )
}

/* ── deriva: cuello de botella y efecto fundador ──────────────────────── */

const DERIVA = ['grande', 'catastrofe', 'pocos', 'recupera']
const D_POBL = Array.from({ length: 24 }, (_, k) => k % 3 !== 0) // 16 A, 8 a
const SOBREVIVEN = new Set([1, 4, 7, 10]) // por azar: 4 sobrevivientes, todos A

export function EscenaDeriva({ fase }: { fase: string }) {
  const i = idx(DERIVA, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Deriva génica: ${fase}`} className="h-full w-full">
      {fondo(i === 1 ? '#f6ecec' : '#f4f1ea')}
      {D_POBL.map((a, k) => {
        const vive = i === 0 || SOBREVIVEN.has(k) || i === 3
        const alelo = i === 3 ? true : a
        return <Canica key={k} x={60 + (k % 8) * 40} y={80 + Math.floor(k / 8) * 50} a={alelo} visible={vive} />
      })}
      <g style={ver(i === 1)}><T x={200} y={50} t="🔥 Un incendio mata a la mayoría, al azar" s={14} c={ROJO} /></g>
      <g style={ver(i === 2)}><T x={200} y={50} t="Por azar, los sobrevivientes solo tienen A" s={13} /></g>
      <g style={ver(i === 3)}><T x={200} y={50} t="La población crece de nuevo… sin el alelo a" s={13} c={AZUL} /></g>
      <T x={200} y={260} t={['Población grande: 2 de cada 3 alelos son A', 'No sobrevivieron los «mejores», sino los afortunados', 'Cuello de botella: poca variación', 'La variación perdida no vuelve sola'][i]} s={12} peso={700} />
    </svg>
  )
}

/* ── flujo génico: un corredor une dos poblaciones ───────────────────── */

const FLUJO = ['separadas', 'corredor', 'mezcla']

export function EscenaFlujo({ fase }: { fase: string }) {
  const i = idx(FLUJO, fase)
  const izq = [1, 1, 1, 1, 1, 1, 0, 1, 1]
  const der = [0, 0, 0, 0, 1, 0, 0, 0, 0]
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Flujo génico: ${fase}`} className="h-full w-full">
      {fondo('#eef1ea')}
      <ellipse cx="90" cy="140" rx="75" ry="85" fill="#9fc28a" />
      <ellipse cx="310" cy="140" rx="75" ry="85" fill="#9fc28a" />
      <rect x="165" y="40" width="70" height="200" fill="#d9cfa0" />
      <T x={200} y={35} t="potreros" s={10} peso={600} />
      <rect x="160" y="120" width="80" height="40" fill="#9fc28a" style={{ transition: suave, opacity: i >= 1 ? 1 : 0 }} />
      <g style={ver(i >= 1)}><T x={200} y={178} t="corredor de bosque" s={10} c={VERDE} /></g>
      {izq.map((a, k) => <Canica key={`i${k}`} x={i === 2 && k === 0 ? 270 : 60 + (k % 3) * 30} y={i === 2 && k === 0 ? 170 : 110 + Math.floor(k / 3) * 30} a={!!a} />)}
      {der.map((a, k) => <Canica key={`d${k}`} x={i === 2 && k === 0 ? 90 : 280 + (k % 3) * 30} y={i === 2 && k === 0 ? 200 : 110 + Math.floor(k / 3) * 30} a={!!a} />)}
      <T x={200} y={270} t={['Aisladas: cada población se vuelve distinta', 'Un corredor permite el paso de individuos', 'Los migrantes llevan alelos: las poblaciones se parecen más'][i]} s={12} />
    </svg>
  )
}

/* ── selección sexual: el gallito de roca ────────────────────────────── */

const SEXUAL = ['machos', 'eligen', 'costo']

function Gallito({ x, y, macho, brillo = 1 }: { x: number; y: number; macho: boolean; brillo?: number }) {
  const c = macho ? '#f05a1a' : '#9a6a4a'
  return (
    <g transform={`translate(${x} ${y}) scale(${macho ? 1 : 0.9})`} style={{ opacity: brillo, transition: suave }}>
      <ellipse cx="0" cy="10" rx="20" ry="16" fill={c} />
      {macho && <ellipse cx="-4" cy="14" rx="12" ry="8" fill="#2b2b2b" />}
      <circle cx="10" cy="-10" r="12" fill={c} />
      {macho && <path d="M -2 -14 q 14 -20 26 4 q -12 -4 -26 -4 z" fill={c} />}
      <circle cx="15" cy="-10" r="2" fill="#fff" />
    </g>
  )
}

export function EscenaSexual({ fase }: { fase: string }) {
  const i = idx(SEXUAL, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Selección sexual: ${fase}`} className="h-full w-full">
      {fondo('#eef1ea')}
      <line x1="30" y1="160" x2="370" y2="160" stroke="#8a6a40" strokeWidth="6" />
      {[0, 1, 2].map((k) => <Gallito key={k} x={90 + k * 110} y={130} macho brillo={i === 1 ? (k === 1 ? 1 : 0.35) : 1} />)}
      <g style={ver(i >= 1)}><Gallito x={200} y={230} macho={false} /></g>
      <g style={ver(i === 1)}><path d="M 200 205 L 200 175" stroke="#888" strokeWidth="2" markerEnd="url(#sx-fl)" /></g>
      <g style={ver(i === 2)}><T x={330} y={60} t="🦅" s={32} /></g>
      <T x={200} y={40} t={['Los machos de gallito de roca se reúnen y se exhiben', 'La hembra elige al más vistoso: él deja más hijos', 'Pero el color también llama a los depredadores'][i]} s={12} />
      <T x={200} y={285} t={['Ave nacional del Perú; vive también en los Andes de Colombia', 'Selección sexual: éxito al conseguir pareja', 'Un equilibrio entre atraer pareja y sobrevivir'][i]} s={10} peso={600} />
      <Flecha id="sx-fl" />
    </svg>
  )
}
