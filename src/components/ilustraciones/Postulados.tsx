// Tres ilustraciones esquemáticas (no a escala), una por postulado de la teoría celular.
// Colores y trazos iguales a los de las demás ilustraciones de la app.

const TINTA = '#4a3416'

/** 1.º Todos los seres vivos están formados por una o más células. */
export function PostuladoSeres() {
  const columnas = [70, 200, 330]
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label="Una planta y un pez, hechos de muchas células, y una bacteria, hecha de una sola" className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#f4efe4" />
      <defs>
        {columnas.map((cx, i) => (
          <clipPath key={cx} id={`clip-post-seres-${i}`}>
            <circle cx={cx} cy="205" r="48" />
          </clipPath>
        ))}
      </defs>

      {/* planta */}
      <ellipse cx="70" cy="122" rx="30" ry="5" fill="#b59a6a" />
      <path d="M70 120 C70 100 70 80 70 56" fill="none" stroke="#3f7a2f" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="54" cy="82" rx="16" ry="8" transform="rotate(-30 54 82)" fill="#7fbf5f" stroke="#3f7a2f" strokeWidth="2.5" />
      <ellipse cx="86" cy="68" rx="16" ry="8" transform="rotate(30 86 68)" fill="#7fbf5f" stroke="#3f7a2f" strokeWidth="2.5" />
      <circle cx="70" cy="50" r="7" fill="#7fbf5f" stroke="#3f7a2f" strokeWidth="2.5" />

      {/* pez */}
      <ellipse cx="196" cy="84" rx="40" ry="22" fill="#f0b36a" stroke="#b3661f" strokeWidth="3" />
      <polygon points="232,84 262,64 262,104" fill="#f0b36a" stroke="#b3661f" strokeWidth="3" strokeLinejoin="round" />
      <circle cx="178" cy="78" r="4" fill="#2b2b2b" />
      <path d="M190 66 q8 -12 22 -6" fill="none" stroke="#b3661f" strokeWidth="3" strokeLinecap="round" />

      {/* bacteria */}
      <g transform="rotate(-18 330 86)">
        <rect x="298" y="70" width="64" height="32" rx="16" fill="#cfe8c4" stroke="#4f8a43" strokeWidth="3" />
        <path d="M312 86 q6 -10 12 0 t12 0 t12 0" fill="none" stroke="#6b3f8a" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M362 86 q8 -8 16 0 t14 0" fill="none" stroke="#4f8a43" strokeWidth="2.5" strokeLinecap="round" />
      </g>

      {/* líneas hacia las lupas */}
      {columnas.map((cx) => (
        <g key={cx} stroke={TINTA} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.6">
          <line x1={cx - 12} y1="130" x2={cx - 36} y2="168" />
          <line x1={cx + 12} y1="130" x2={cx + 36} y2="168" />
        </g>
      ))}

      {/* lupa de la planta: células con pared */}
      <g clipPath="url(#clip-post-seres-0)">
        <rect x="20" y="155" width="100" height="100" fill="#fffdf5" />
        {Array.from({ length: 6 }, (_, f) =>
          Array.from({ length: 6 }, (_, c) => (
            <g key={`${f}-${c}`}>
              <rect x={22 + c * 18} y={157 + f * 17} width="17" height="16" fill="#d5ebbf" stroke="#4f8a43" strokeWidth="2" />
              <circle cx={30.5 + c * 18} cy={165 + f * 17} r="3" fill="#8fb56a" />
            </g>
          )),
        )}
      </g>

      {/* lupa del pez: células sin pared */}
      <g clipPath="url(#clip-post-seres-1)">
        <rect x="150" y="155" width="100" height="100" fill="#fffdf5" />
        {Array.from({ length: 6 }, (_, f) =>
          Array.from({ length: 6 }, (_, c) => (
            <g key={`${f}-${c}`}>
              <circle cx={156 + c * 20 + (f % 2 ? 10 : 0)} cy={162 + f * 18} r="10" fill="#f8d9d4" stroke="#b05a5a" strokeWidth="2" />
              <circle cx={156 + c * 20 + (f % 2 ? 10 : 0)} cy={162 + f * 18} r="3.5" fill="#c9a0dc" />
            </g>
          )),
        )}
      </g>

      {/* lupa de la bacteria: una sola célula */}
      <g clipPath="url(#clip-post-seres-2)">
        <rect x="280" y="155" width="100" height="100" fill="#fffdf5" />
        <rect x="296" y="188" width="68" height="34" rx="17" fill="#cfe8c4" stroke="#4f8a43" strokeWidth="3" />
        <path d="M310 205 q6 -10 12 0 t12 0 t12 0" fill="none" stroke="#6b3f8a" strokeWidth="2.5" strokeLinecap="round" />
      </g>
      {columnas.map((cx) => (
        <circle key={cx} cx={cx} cy="205" r="48" fill="none" stroke={TINTA} strokeWidth="4" />
      ))}

      {/* rótulos */}
      {[
        [70, 'Planta', 'muchas células'],
        [200, 'Pez', 'muchas células'],
        [330, 'Bacteria', 'una sola célula'],
      ].map(([cx, nombre, texto]) => (
        <g key={nombre as string} textAnchor="middle" fill={TINTA} fontSize="12">
          <text x={cx as number} y="274" fontWeight="700">{nombre}</text>
          <text x={cx as number} y="290">{texto}</text>
        </g>
      ))}
    </svg>
  )
}

/** 2.º La célula es la unidad básica de la estructura y función de los seres vivos. */
export function PostuladoUnidad() {
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label="Una célula con membrana, citoplasma y núcleo, y dos recuadros: estructura y función" className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#f3e7ef" />

      <circle cx="125" cy="155" r="95" fill="#f8d9d4" stroke="#b05a5a" strokeWidth="5" />
      <circle cx="145" cy="140" r="30" fill="#ead3f2" stroke="#7a4a8a" strokeWidth="3" />
      {[[80, 190], [100, 225], [170, 200], [60, 140], [175, 105]].map(([x, y]) => (
        <ellipse key={`${x}-${y}`} cx={x} cy={y} rx="9" ry="5" fill="#e9b872" stroke="#a8742c" strokeWidth="1.5" />
      ))}

      {/* rótulos con línea hacia cada parte */}
      <g stroke={TINTA} strokeWidth="1.5" fill="none">
        <line x1="42" y1="40" x2="58" y2="92" />
        <line x1="148" y1="38" x2="146" y2="110" />
        <line x1="50" y1="274" x2="140" y2="232" />
      </g>
      <g fill={TINTA} fontSize="12" fontWeight="600">
        <text x="14" y="34">membrana</text>
        <text x="124" y="32">núcleo</text>
        <text x="8" y="288">citoplasma</text>
      </g>

      {/* estructura y función */}
      <g>
        <rect x="236" y="48" width="152" height="92" rx="12" fill="#e9f0e1" stroke="#4f8a43" strokeWidth="3" />
        <text x="312" y="74" textAnchor="middle" fontSize="14" fontWeight="700" fill={TINTA}>ESTRUCTURA</text>
        <text x="312" y="98" textAnchor="middle" fontSize="12" fill={TINTA}>Es la pieza con la que</text>
        <text x="312" y="115" textAnchor="middle" fontSize="12" fill={TINTA}>se arma un ser vivo</text>
      </g>
      <g>
        <rect x="236" y="160" width="152" height="92" rx="12" fill="#fbeedd" stroke="#b3661f" strokeWidth="3" />
        <text x="312" y="186" textAnchor="middle" fontSize="14" fontWeight="700" fill={TINTA}>FUNCIÓN</text>
        <text x="312" y="210" textAnchor="middle" fontSize="12" fill={TINTA}>Ahí ocurren los procesos</text>
        <text x="312" y="227" textAnchor="middle" fontSize="12" fill={TINTA}>de la vida (metabolismo)</text>
      </g>
      <line x1="198" y1="94" x2="236" y2="94" stroke={TINTA} strokeWidth="3" strokeLinecap="round" />
      <line x1="205" y1="206" x2="236" y2="206" stroke={TINTA} strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

/** 3.º Toda célula proviene de otra célula. */
export function PostuladoOrigen() {
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label="Una célula madre se divide en dos células hijas" className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#f3e7ef" />

      {/* célula madre */}
      <circle cx="90" cy="148" r="62" fill="#f8d9d4" stroke="#b05a5a" strokeWidth="5" />
      <circle cx="90" cy="148" r="24" fill="#ead3f2" stroke="#7a4a8a" strokeWidth="3" />
      <path d="M78 146 q6 -10 12 0 t12 0" fill="none" stroke="#3b6fb6" strokeWidth="3" strokeLinecap="round" />
      <path d="M80 158 q5 6 10 0 t10 0" fill="none" stroke="#d9822b" strokeWidth="3" strokeLinecap="round" />

      {/* flecha */}
      <text x="200" y="128" textAnchor="middle" fontSize="13" fontWeight="600" fill={TINTA}>se divide</text>
      <line x1="160" y1="148" x2="222" y2="148" stroke={TINTA} strokeWidth="5" strokeLinecap="round" />
      <polygon points="220,134 244,148 220,162" fill={TINTA} />

      {/* células hijas */}
      {[96, 200].map((cy) => (
        <g key={cy}>
          <circle cx="314" cy={cy} r="44" fill="#f8d9d4" stroke="#b05a5a" strokeWidth="5" />
          <circle cx="314" cy={cy} r="17" fill="#ead3f2" stroke="#7a4a8a" strokeWidth="3" />
          <path d={`M306 ${cy - 2} q4 -7 8 0 t8 0`} fill="none" stroke="#3b6fb6" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      ))}

      <g textAnchor="middle" fill={TINTA} fontSize="12" fontWeight="600">
        <text x="90" y="236">célula madre</text>
        <text x="314" y="266">dos células hijas</text>
      </g>
      <text x="200" y="292" textAnchor="middle" fontSize="12" fontStyle="italic" fill={TINTA}>«omnis cellula e cellula»</text>
    </svg>
  )
}
