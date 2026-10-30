// Diez ilustraciones esquemáticas (no a escala), una por nivel de organización.
// Mismo estilo que las de los postulados: fondo crema, trazo oscuro, colores suaves.

const TINTA = '#4a3416'
const FONDO = '#f4efe4'

function Fondo({ color = FONDO }: { color?: string }) {
  return <rect x="-1500" y="-1500" width="3400" height="3300" fill={color} />
}

const rad = (g: number) => (g * Math.PI) / 180

/** Nivel 1 · Átomo de carbono */
export function NivelAtomo() {
  const cx = 200
  const cy = 135
  const electrones = [
    ...[40, 220].map((a) => ({ r: 55, a })),
    ...[45, 135, 225, 315].map((a) => ({ r: 100, a })),
  ]
  const nucleo = [
    [-9, -4], [0, -10], [9, -4], [-9, 6], [0, 0], [9, 6], [-4, 12], [5, 14], [-14, 1], [14, 1], [0, 8], [-5, -14],
  ]
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label="Un átomo de carbono: un núcleo pequeño y seis electrones en dos capas" className="h-full w-full">
      <Fondo />
      <circle cx={cx} cy={cy} r="55" fill="none" stroke="#9a8a6a" strokeWidth="2" strokeDasharray="5 4" />
      <circle cx={cx} cy={cy} r="100" fill="none" stroke="#9a8a6a" strokeWidth="2" strokeDasharray="5 4" />
      {nucleo.map(([x, y], i) => (
        <circle key={i} cx={cx + x} cy={cy + y} r="7" fill={i % 2 ? '#c9c4b8' : '#e07a6a'} stroke="#7a4a3a" strokeWidth="1.5" />
      ))}
      {electrones.map((e, i) => (
        <circle key={i} cx={cx + e.r * Math.cos(rad(e.a))} cy={cy + e.r * Math.sin(rad(e.a))} r="7" fill="#6fa8e0" stroke="#2f5f93" strokeWidth="2" />
      ))}
      <g stroke={TINTA} strokeWidth="1.5" fill="none">
        <line x1="214" y1="135" x2="306" y2="140" />
        <line x1={cx + 100 * Math.cos(rad(45))} y1={cy + 100 * Math.sin(rad(45))} x2="318" y2="228" />
      </g>
      <g fill={TINTA} fontSize="12" fontWeight="600">
        <text x="310" y="136">núcleo</text>
        <text x="310" y="150" fontWeight="400" fontSize="11">protones y</text>
        <text x="310" y="163" fontWeight="400" fontSize="11">neutrones</text>
        <text x="320" y="232">electrones</text>
      </g>
      <text x="200" y="272" textAnchor="middle" fontSize="13" fontWeight="700" fill={TINTA}>Átomo de carbono</text>
      <text x="200" y="290" textAnchor="middle" fontSize="11" fill={TINTA}>El núcleo es diminuto frente a todo el átomo (no está a escala)</text>
    </svg>
  )
}

/** Nivel 2 · Moléculas: agua y glucosa */
export function NivelMoleculas() {
  const anillo = Array.from({ length: 6 }, (_, i) => [300 + 52 * Math.cos(rad(i * 60 - 90)), 125 + 52 * Math.sin(rad(i * 60 - 90))])
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label="Dos moléculas: el agua, con un oxígeno y dos hidrógenos, y la glucosa, con un anillo de carbonos" className="h-full w-full">
      <Fondo />
      {/* agua */}
      <g stroke="#7a6a4a" strokeWidth="5" strokeLinecap="round">
        <line x1="100" y1="115" x2="52" y2="152" />
        <line x1="100" y1="115" x2="148" y2="152" />
      </g>
      <circle cx="100" cy="115" r="28" fill="#e8806f" stroke="#a8453a" strokeWidth="3" />
      <circle cx="52" cy="152" r="17" fill="#f1ece0" stroke="#7a6a4a" strokeWidth="3" />
      <circle cx="148" cy="152" r="17" fill="#f1ece0" stroke="#7a6a4a" strokeWidth="3" />
      <g textAnchor="middle" fontSize="14" fontWeight="700" fill={TINTA}>
        <text x="100" y="120">O</text>
        <text x="52" y="157">H</text>
        <text x="148" y="157">H</text>
      </g>
      <text x="100" y="215" textAnchor="middle" fontSize="13" fontWeight="700" fill={TINTA}>Agua</text>
      <text x="100" y="232" textAnchor="middle" fontSize="12" fill={TINTA}>H₂O · 3 átomos</text>

      {/* glucosa */}
      <polygon points={anillo.map((p) => p.join(',')).join(' ')} fill="#fbeedd" stroke="#7a6a4a" strokeWidth="4" strokeLinejoin="round" />
      {anillo.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="13" fill={i === 4 ? '#e8806f' : '#cfcabd'} stroke={i === 4 ? '#a8453a' : '#6b6558'} strokeWidth="2.5" />
          <text x={x} y={y + 4.5} textAnchor="middle" fontSize="12" fontWeight="700" fill={TINTA}>{i === 4 ? 'O' : 'C'}</text>
        </g>
      ))}
      <text x="300" y="215" textAnchor="middle" fontSize="13" fontWeight="700" fill={TINTA}>Glucosa</text>
      <text x="300" y="232" textAnchor="middle" fontSize="12" fill={TINTA}>C₆H₁₂O₆ · 24 átomos</text>
      <text x="300" y="248" textAnchor="middle" fontSize="11" fill={TINTA}>(se muestra solo el anillo)</text>
      <text x="200" y="285" textAnchor="middle" fontSize="12" fontStyle="italic" fill={TINTA}>Átomos unidos forman moléculas</text>
    </svg>
  )
}

/** Nivel 3 · Macromolécula: cadena de aminoácidos que se pliega */
export function NivelMacromoleculas() {
  const colores = ['#e8806f', '#6fa8e0', '#8fc97a']
  const recta = Array.from({ length: 12 }, (_, i) => ({ x: 24 + i * 14, y: 120 }))
  const plegada = Array.from({ length: 12 }, (_, t) => {
    const r = 56 - t * 3.4
    return { x: 320 + r * Math.cos(t * 1.0), y: 120 + r * 0.9 * Math.sin(t * 1.0) }
  })
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label="Una cadena de piezas pequeñas, los aminoácidos, que se pliega y forma una proteína" className="h-full w-full">
      <Fondo />
      <polyline points={recta.map((p) => `${p.x},${p.y}`).join(' ')} fill="none" stroke="#7a6a4a" strokeWidth="3" />
      {recta.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="8" fill={colores[i % 3]} stroke={TINTA} strokeWidth="1.5" />
      ))}
      <line x1="196" y1="120" x2="232" y2="120" stroke={TINTA} strokeWidth="4" strokeLinecap="round" />
      <polygon points="230,111 246,120 230,129" fill={TINTA} />
      <text x="214" y="104" textAnchor="middle" fontSize="11" fontWeight="600" fill={TINTA}>se pliega</text>
      <polyline points={plegada.map((p) => `${p.x},${p.y}`).join(' ')} fill="none" stroke="#7a6a4a" strokeWidth="3" />
      {plegada.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="8" fill={colores[i % 3]} stroke={TINTA} strokeWidth="1.5" />
      ))}
      <text x="96" y="165" textAnchor="middle" fontSize="12" fontWeight="700" fill={TINTA}>Cadena de aminoácidos</text>
      <text x="96" y="181" textAnchor="middle" fontSize="11" fill={TINTA}>cada bolita es una pieza</text>
      <text x="320" y="205" textAnchor="middle" fontSize="12" fontWeight="700" fill={TINTA}>Proteína plegada</text>
      <text x="320" y="221" textAnchor="middle" fontSize="11" fill={TINTA}>su forma decide su oficio</text>
      <text x="200" y="272" textAnchor="middle" fontSize="12" fontStyle="italic" fill={TINTA}>Las macromoléculas son cadenas muy largas de piezas pequeñas</text>
      <text x="200" y="288" textAnchor="middle" fontSize="11" fill={TINTA}>(una proteína real tiene cientos de piezas; aquí hay 12)</text>
    </svg>
  )
}

/** Nivel 4 · Orgánulo: mitocondria */
export function NivelOrganulo() {
  const cx = 200
  const cy = 140
  const rx = 125
  const ry = 62
  const medio = (x: number) => ry * Math.sqrt(Math.max(0, 1 - ((x - cx) / rx) ** 2))
  const arriba = [105, 150, 195, 240, 285]
  const abajo = [128, 173, 218, 263]
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label="Una mitocondria: membrana externa, membrana interna plegada en crestas y matriz" className="h-full w-full">
      <Fondo />
      <ellipse cx={cx} cy={cy} rx="145" ry="82" fill="#f6d6b0" stroke="#b3661f" strokeWidth="5" />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#fbeedd" stroke="#d9822b" strokeWidth="3" />
      {arriba.map((x) => (
        <line key={`a${x}`} x1={x} y1={cy - medio(x)} x2={x} y2={cy + 6} stroke="#d9822b" strokeWidth="5" strokeLinecap="round" />
      ))}
      {abajo.map((x) => (
        <line key={`b${x}`} x1={x} y1={cy + medio(x)} x2={x} y2={cy - 6} stroke="#d9822b" strokeWidth="5" strokeLinecap="round" />
      ))}
      <g stroke={TINTA} strokeWidth="1.5" fill="none">
        <line x1="75" y1="68" x2="100" y2="92" />
        <line x1="330" y1="66" x2="296" y2="98" />
        <line x1="200" y1="258" x2="200" y2="168" />
      </g>
      <g fill={TINTA} fontSize="12" fontWeight="600">
        <text x="14" y="62">membrana externa</text>
        <text x="392" y="44" textAnchor="end">membrana interna</text>
        <text x="392" y="58" textAnchor="end" fontWeight="400" fontSize="11">con crestas (pliegues)</text>
        <text x="200" y="274" textAnchor="middle">matriz</text>
      </g>
      <text x="200" y="26" textAnchor="middle" fontSize="13" fontWeight="700" fill={TINTA}>Mitocondria</text>
      <text x="200" y="291" textAnchor="middle" fontSize="11" fill={TINTA}>Aquí se libera la energía de los alimentos</text>
    </svg>
  )
}

/** Nivel 5 · Célula con varios orgánulos */
export function NivelCelula() {
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label="Una célula con membrana, núcleo, mitocondrias, retículo y citoplasma" className="h-full w-full">
      <Fondo color="#f3e7ef" />
      <circle cx="150" cy="150" r="122" fill="#f8d9d4" stroke="#b05a5a" strokeWidth="6" />
      <circle cx="132" cy="125" r="40" fill="#ead3f2" stroke="#7a4a8a" strokeWidth="3.5" />
      <circle cx="124" cy="119" r="11" fill="#c9a0dc" stroke="#7a4a8a" strokeWidth="2" />
      <path d="M92 190 q12 -14 24 0 t24 0 t24 0 M96 205 q12 -14 24 0 t24 0 t24 0" fill="none" stroke="#3b6fb6" strokeWidth="3.5" strokeLinecap="round" />
      {[[205, 120, -20], [200, 175, 25], [90, 85, 40]].map(([x, y, a]) => (
        <g key={`${x}-${y}`} transform={`rotate(${a} ${x} ${y})`}>
          <ellipse cx={x} cy={y} rx="20" ry="11" fill="#f6d6b0" stroke="#b3661f" strokeWidth="2.5" />
          <path d={`M${x - 11} ${y} q4 -7 7 0 t7 0 t7 0`} fill="none" stroke="#d9822b" strokeWidth="2" />
        </g>
      ))}
      {[[70, 150], [185, 225], [225, 70]].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="5" fill="#fff5cc" stroke="#a8903a" strokeWidth="1.5" />
      ))}
      <g stroke={TINTA} strokeWidth="1.5" fill="none">
        <line x1="268" y1="52" x2="244" y2="62" />
        <line x1="268" y1="104" x2="164" y2="112" />
        <line x1="268" y1="156" x2="222" y2="124" />
        <line x1="268" y1="208" x2="150" y2="205" />
        <line x1="268" y1="258" x2="196" y2="215" />
      </g>
      <g fill={TINTA} fontSize="12" fontWeight="600">
        <text x="272" y="52">membrana</text>
        <text x="272" y="108">núcleo</text>
        <text x="272" y="160">mitocondria</text>
        <text x="272" y="212">retículo</text>
        <text x="272" y="262">citoplasma</text>
      </g>
      <text x="326" y="284" textAnchor="middle" fontSize="11" fill={TINTA}>Primer nivel con vida</text>
    </svg>
  )
}

/** Nivel 6 · Tejido muscular */
export function NivelTejido() {
  const filas = 5
  const columnas = 5
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label="Un tejido: muchas células parecidas, alargadas y unidas, que hacen la misma función" className="h-full w-full">
      <Fondo />
      {Array.from({ length: filas }, (_, f) =>
        Array.from({ length: columnas }, (_, c) => {
          const x = 24 + c * 66 + (f % 2 ? 33 : 0)
          const y = 34 + f * 38
          const marcada = f === 4 && c === 2
          return (
            <g key={`${f}-${c}`}>
              <rect x={x} y={y} width="62" height="34" rx="14" fill={marcada ? '#f4a9a0' : '#f8d9d4'} stroke={marcada ? '#a8453a' : '#b05a5a'} strokeWidth={marcada ? 4 : 2.5} />
              <ellipse cx={x + 31} cy={y + 17} rx="9" ry="6" fill="#c9a0dc" stroke="#7a4a8a" strokeWidth="1.5" />
            </g>
          )
        }),
      )}
      <g stroke={TINTA} strokeWidth="1.5" fill="none">
        <line x1="187" y1="229" x2="187" y2="212" />
      </g>
      <text x="187" y="243" textAnchor="middle" fontSize="12" fontWeight="600" fill={TINTA}>una célula (con su núcleo)</text>
      <text x="200" y="264" textAnchor="middle" fontSize="13" fontWeight="700" fill={TINTA}>Tejido muscular</text>
      <text x="200" y="282" textAnchor="middle" fontSize="11" fill={TINTA}>Células parecidas, juntas, con la misma función: contraerse</text>
    </svg>
  )
}

/** Nivel 7 · Órgano: corazón */
export function NivelOrgano() {
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label="Un corazón con una lista de los tejidos que lo forman" className="h-full w-full">
      <Fondo />
      <path d="M130 245 C40 180 22 125 58 98 C90 75 122 92 130 118 C138 92 170 75 202 98 C238 125 220 180 130 245 Z" fill="#e8806f" stroke="#a8453a" strokeWidth="5" strokeLinejoin="round" />
      <path d="M130 118 C128 160 132 200 130 232" fill="none" stroke="#a8453a" strokeWidth="3" opacity="0.6" />
      <path d="M100 96 C96 70 110 50 128 40 M150 98 C158 72 176 56 196 52" fill="none" stroke="#a8453a" strokeWidth="9" strokeLinecap="round" />
      <path d="M100 96 C96 70 110 50 128 40" fill="none" stroke="#6fa8e0" strokeWidth="5" strokeLinecap="round" />
      <path d="M150 98 C158 72 176 56 196 52" fill="none" stroke="#e8806f" strokeWidth="5" strokeLinecap="round" />
      <text x="130" y="272" textAnchor="middle" fontSize="13" fontWeight="700" fill={TINTA}>Corazón</text>
      <text x="130" y="289" textAnchor="middle" fontSize="11" fill={TINTA}>(esquema, sin detalles)</text>

      <text x="240" y="82" fontSize="12" fontWeight="700" fill={TINTA}>Varios tejidos juntos:</text>
      {[
        ['#f8d9d4', '#b05a5a', 'Muscular: se contrae'],
        ['#e9f0e1', '#4f8a43', 'Conectivo: sostiene'],
        ['#ead3f2', '#7a4a8a', 'Nervioso: da el ritmo'],
        ['#dce9f7', '#3b6fb6', 'Epitelial: reviste'],
      ].map(([fondo, borde, texto], i) => (
        <g key={texto}>
          <rect x="240" y={96 + i * 36} width="18" height="18" rx="4" fill={fondo} stroke={borde} strokeWidth="2.5" />
          <text x="266" y={110 + i * 36} fontSize="12" fill={TINTA}>{texto}</text>
        </g>
      ))}
    </svg>
  )
}

/** Nivel 8 · Sistema circulatorio */
export function NivelSistema() {
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label="El sistema circulatorio: el corazón en el centro y vasos que llevan la sangre hacia afuera y de regreso" className="h-full w-full">
      <Fondo />
      <path d="M200 120 C120 40 50 70 50 140" fill="none" stroke="#d9564a" strokeWidth="6" strokeLinecap="round" />
      <path d="M200 120 C280 40 350 70 350 140" fill="none" stroke="#d9564a" strokeWidth="6" strokeLinecap="round" />
      <path d="M50 140 C50 230 130 262 200 190" fill="none" stroke="#3b6fb6" strokeWidth="6" strokeLinecap="round" />
      <path d="M350 140 C350 230 270 262 200 190" fill="none" stroke="#3b6fb6" strokeWidth="6" strokeLinecap="round" />
      <polygon points="46,96 68,96 56,118" fill="#d9564a" />
      <polygon points="332,96 354,96 344,118" fill="#d9564a" />
      <polygon points="88,216 88,236 112,228" fill="#3b6fb6" />
      <polygon points="312,216 312,236 288,228" fill="#3b6fb6" />
      {[[50, 140], [350, 140]].map(([x, y]) => (
        <g key={x}>
          <circle cx={x} cy={y} r="22" fill="#f8d9d4" stroke="#b05a5a" strokeWidth="3" />
          <circle cx={x - 6} cy={y - 4} r="4" fill="#d9564a" />
          <circle cx={x + 7} cy={y + 3} r="4" fill="#d9564a" />
          <circle cx={x - 2} cy={y + 9} r="4" fill="#d9564a" />
        </g>
      ))}
      <path d="M200 205 C150 170 140 130 162 118 C182 108 198 118 200 130 C202 118 218 108 238 118 C260 130 250 170 200 205 Z" fill="#e8806f" stroke="#a8453a" strokeWidth="4" strokeLinejoin="round" />
      <g fill={TINTA} fontSize="12" fontWeight="600" textAnchor="middle">
        <text x="200" y="228">Corazón</text>
        <text x="200" y="50" fill="#a8453a">arterias (salen del corazón)</text>
        <text x="200" y="262" fill="#2f5f93">venas (regresan al corazón)</text>
        <text x="50" y="186">cuerpo</text>
        <text x="350" y="186">cuerpo</text>
      </g>
      <text x="200" y="288" textAnchor="middle" fontSize="11" fill={TINTA}>Corazón + vasos + sangre = sistema circulatorio (esquema simplificado)</text>
    </svg>
  )
}

/** Nivel 9 · Organismo: una persona (pluricelular) y una bacteria (unicelular) */
export function NivelOrganismo() {
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label="Una persona, organismo de muchas células, y una bacteria, organismo de una sola célula" className="h-full w-full">
      <Fondo />
      <g stroke="#b3661f" strokeWidth="11" strokeLinecap="round" fill="none">
        <line x1="125" y1="112" x2="125" y2="170" />
        <line x1="125" y1="118" x2="88" y2="152" />
        <line x1="125" y1="118" x2="162" y2="152" />
        <line x1="125" y1="170" x2="106" y2="228" />
        <line x1="125" y1="170" x2="144" y2="228" />
      </g>
      <circle cx="125" cy="78" r="26" fill="#f0b36a" stroke="#b3661f" strokeWidth="4" />
      <text x="125" y="258" textAnchor="middle" fontSize="13" fontWeight="700" fill={TINTA}>Persona</text>
      <text x="125" y="275" textAnchor="middle" fontSize="11" fill={TINTA}>muchas células, tejidos,</text>
      <text x="125" y="289" textAnchor="middle" fontSize="11" fill={TINTA}>órganos y sistemas</text>

      <g transform="rotate(-15 305 130)">
        <rect x="258" y="108" width="94" height="44" rx="22" fill="#cfe8c4" stroke="#4f8a43" strokeWidth="4" />
        <path d="M276 130 q8 -12 16 0 t16 0 t16 0" fill="none" stroke="#6b3f8a" strokeWidth="3" strokeLinecap="round" />
        <path d="M352 130 q10 -10 20 0" fill="none" stroke="#4f8a43" strokeWidth="3" strokeLinecap="round" />
      </g>
      <text x="305" y="258" textAnchor="middle" fontSize="13" fontWeight="700" fill={TINTA}>Bacteria</text>
      <text x="305" y="275" textAnchor="middle" fontSize="11" fill={TINTA}>una sola célula:</text>
      <text x="305" y="289" textAnchor="middle" fontSize="11" fill={TINTA}>célula y organismo a la vez</text>

      <text x="200" y="26" textAnchor="middle" fontSize="12" fontStyle="italic" fill={TINTA}>Los dos son organismos completos (tamaños no a escala)</text>
    </svg>
  )
}

/** Nivel 10 · Más allá del organismo */
export function NivelMasAlla() {
  const cx = [52, 150, 250, 348]
  const cy = 118
  const r = 44
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label="Cuatro niveles más allá del organismo: población, comunidad, ecosistema y biosfera" className="h-full w-full">
      <Fondo />
      <defs>
        {cx.map((x, i) => (
          <clipPath key={x} id={`clip-nivel-mas-${i}`}>
            <circle cx={x} cy={cy} r={r} />
          </clipPath>
        ))}
      </defs>

      {/* población: individuos iguales */}
      <g clipPath="url(#clip-nivel-mas-0)">
        <rect x={cx[0] - r} y={cy - r} width={2 * r} height={2 * r} fill="#fffdf5" />
        {[[-18, -14], [14, -20], [-6, 4], [20, 10], [-20, 22]].map(([x, y]) => (
          <ellipse key={`${x}-${y}`} cx={cx[0] + x} cy={cy + y} rx="11" ry="6" fill="#f0b36a" stroke="#b3661f" strokeWidth="2" />
        ))}
      </g>

      {/* comunidad: especies distintas */}
      <g clipPath="url(#clip-nivel-mas-1)">
        <rect x={cx[1] - r} y={cy - r} width={2 * r} height={2 * r} fill="#fffdf5" />
        {[[-18, -16, '#f0b36a', '#b3661f'], [14, -18, '#7fbf5f', '#3f7a2f'], [-4, 4, '#6fa8e0', '#2f5f93'], [20, 14, '#c9a0dc', '#7a4a8a'], [-20, 20, '#e8806f', '#a8453a']].map(([x, y, f, s]) => (
          <circle key={`${x}-${y}`} cx={cx[1] + (x as number)} cy={cy + (y as number)} r="9" fill={f as string} stroke={s as string} strokeWidth="2" />
        ))}
      </g>

      {/* ecosistema: seres vivos + ambiente */}
      <g clipPath="url(#clip-nivel-mas-2)">
        <rect x={cx[2] - r} y={cy - r} width={2 * r} height={2 * r} fill="#dcecf7" />
        <circle cx={cx[2] + 22} cy={cy - 24} r="9" fill="#f6d65a" stroke="#b39a20" strokeWidth="2" />
        <ellipse cx={cx[2]} cy={cy + 40} rx="52" ry="30" fill="#8fc97a" stroke="#3f7a2f" strokeWidth="2" />
        <rect x={cx[2] - 22} y={cy + 4} width="44" height="14" fill="#7fb8e8" />
        <line x1={cx[2] - 24} y1={cy + 6} x2={cx[2] - 24} y2={cy - 12} stroke="#7a4a2a" strokeWidth="3" />
        <circle cx={cx[2] - 24} cy={cy - 18} r="10" fill="#5fa84a" stroke="#3f7a2f" strokeWidth="2" />
      </g>

      {/* biosfera: planeta */}
      <g clipPath="url(#clip-nivel-mas-3)">
        <rect x={cx[3] - r} y={cy - r} width={2 * r} height={2 * r} fill="#6fa8e0" />
        <path d={`M${cx[3] - 28} ${cy - 18} q14 -14 26 -2 q4 14 -10 24 q-14 -2 -16 -22 Z`} fill="#8fc97a" stroke="#3f7a2f" strokeWidth="1.5" />
        <path d={`M${cx[3] + 6} ${cy + 4} q18 -8 26 8 q-2 18 -18 20 q-12 -10 -8 -28 Z`} fill="#8fc97a" stroke="#3f7a2f" strokeWidth="1.5" />
      </g>

      {cx.map((x) => (
        <circle key={x} cx={x} cy={cy} r={r} fill="none" stroke={TINTA} strokeWidth="3" />
      ))}
      {[101, 200, 299].map((x) => (
        <text key={x} x={x} y={cy + 6} textAnchor="middle" fontSize="20" fontWeight="700" fill={TINTA}>›</text>
      ))}

      {[
        ['Población', 'una especie', 'en un lugar'],
        ['Comunidad', 'varias especies', 'juntas'],
        ['Ecosistema', 'seres vivos', '+ ambiente'],
        ['Biosfera', 'todos los', 'ecosistemas'],
      ].map(([nombre, a, b], i) => (
        <g key={nombre} textAnchor="middle" fill={TINTA}>
          <text x={cx[i]} y="198" fontSize="12" fontWeight="700">{nombre}</text>
          <text x={cx[i]} y="213" fontSize="10.5">{a}</text>
          <text x={cx[i]} y="226" fontSize="10.5">{b}</text>
        </g>
      ))}
      <text x="200" y="262" textAnchor="middle" fontSize="12" fontStyle="italic" fill={TINTA}>Cada paso incluye al anterior (esquema, no a escala)</text>
    </svg>
  )
}
