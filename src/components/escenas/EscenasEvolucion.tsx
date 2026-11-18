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
