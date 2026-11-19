// Dibujos de objetos para la mesa viva (MesaViva.tsx). Todos centrados en (0, 0), estilo plano.
// Se reutilizan entre prácticas; cada uno recibe solo lo que cambia (color, contenido, lectura).

const T = { stroke: '#2b2b2b', strokeWidth: 2.5, strokeLinejoin: 'round' as const }

/** frasco gotero (alto ≈ 90) */
export function Gotero({ color, etiqueta, oscuro = false }: { color: string; etiqueta: string; oscuro?: boolean }) {
  return (
    <g>
      <rect x="-5" y="-46" width="10" height="16" rx="5" fill="#333" />
      <rect x="-9" y="-32" width="18" height="10" fill="#555" {...T} />
      <path d="M-22 -22 H22 V38 Q22 44 16 44 H-16 Q-22 44 -22 38 Z" fill={oscuro ? '#6b4a2b' : 'rgba(255,255,255,0.7)'} {...T} />
      <rect x="-20" y="-2" width="40" height="44" rx="4" fill={color} opacity={oscuro ? 0.5 : 0.85} />
      <rect x="-17" y="4" width="34" height="18" fill="#fff" stroke="#999" strokeWidth="1" />
      <text y="17" textAnchor="middle" fontSize="9" fontWeight="800" fill="#222">{etiqueta}</text>
    </g>
  )
}

/** piseta de agua (alto ≈ 100) */
export function Piseta() {
  return (
    <g>
      <path d="M2 -40 L30 -54" fill="none" stroke="#2b2b2b" strokeWidth="3" strokeLinecap="round" />
      <rect x="-8" y="-46" width="16" height="10" fill="#e6e6e6" {...T} />
      <path d="M-22 -36 H22 L26 40 Q26 48 18 48 H-18 Q-26 48 -26 40 Z" fill="rgba(255,255,255,0.75)" {...T} />
      <rect x="-23" y="-6" width="47" height="52" rx="6" fill="#a9d3f5" opacity="0.8" />
      <text y="22" textAnchor="middle" fontSize="10" fontWeight="800" fill="#1d4e74">AGUA</text>
    </g>
  )
}

/** portaobjetos visto en perspectiva (ancho ≈ 120) con mancha de muestra, tinte y cubreobjetos */
export function Portaobjetos({ muestra, tinte, charco, cubre = true }: { muestra?: string; tinte?: string; charco?: string; cubre?: boolean }) {
  return (
    <g>
      <path d="M-62 4 L-50 -12 H62 L50 4 Z" fill="rgba(220,240,250,0.85)" {...T} />
      <path d="M-62 4 V9 H50 L62 -7 V-12" fill="none" {...T} />
      {charco && <ellipse cx="2" cy="-4" rx="34" ry="8" fill={charco} opacity="0.45" />}
      {muestra && <ellipse cx="2" cy="-4" rx="18" ry="5" fill={muestra} />}
      {tinte && <ellipse cx="2" cy="-4" rx="18" ry="5" fill={tinte} />}
      {cubre && muestra && <path d="M-24 2 L-16 -10 H26 L18 2 Z" fill="rgba(255,255,255,0.35)" stroke="#7a8a95" strokeWidth="1.5" />}
    </g>
  )
}

/** temporizador: muestra los segundos que faltan; con alarma parpadea */
export function Reloj({ s, alarma = false, aviso = '¡Lava!' }: { s: number; alarma?: boolean; aviso?: string }) {
  const a = ((s % 60) / 60) * 2 * Math.PI
  return (
    <g>
      <circle r="34" fill={alarma ? '#ffd27a' : '#fff'} {...T}>{alarma && <animate attributeName="fill" values="#ffd27a;#fff;#ffd27a" dur="0.8s" repeatCount="indefinite" />}</circle>
      <circle r="34" fill="none" stroke="#e67e22" strokeWidth="4" />
      {Array.from({ length: 12 }, (_, k) => <line key={k} x1={28 * Math.sin((k * Math.PI) / 6)} y1={-28 * Math.cos((k * Math.PI) / 6)} x2={32 * Math.sin((k * Math.PI) / 6)} y2={-32 * Math.cos((k * Math.PI) / 6)} stroke="#333" strokeWidth="2" />)}
      <line x1="0" y1="0" x2={24 * Math.sin(a)} y2={-24 * Math.cos(a)} stroke="#c0392b" strokeWidth="3" strokeLinecap="round" style={{ transition: 'all 0.5s' }} />
      <circle r="3" fill="#333" />
      <text y="52" textAnchor="middle" fontSize="13" fontWeight="800" fill={alarma ? '#c0392b' : '#3a2f22'}>{alarma ? aviso : `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`}</text>
    </g>
  )
}

/** microscopio (alto ≈ 150) */
export function MicroscopioMini({ lamina = false }: { lamina?: boolean }) {
  return (
    <g>
      <path d="M-40 70 H40 L34 58 H-34 Z" fill="#3d4f63" {...T} />
      <path d="M14 58 V-10 Q14 -30 -4 -40" fill="none" stroke="#3d4f63" strokeWidth="12" strokeLinecap="round" />
      <rect x="-34" y="8" width="56" height="7" fill="#2b3a4a" />
      <rect x="-20" y="-58" width="16" height="44" rx="3" fill="#5d7287" {...T} transform="rotate(-20 -12 -36)" />
      <rect x="-14" y="-12" width="10" height="16" fill="#8aa0b4" {...T} />
      <circle cx="22" cy="30" r="9" fill="#5d7287" {...T} />
      <circle cx="-12" cy="36" r="6" fill="#f7e27a" stroke="#8a7a2a" strokeWidth="1.5" />
      {lamina && <rect x="-36" y="4" width="48" height="4" fill="rgba(200,230,245,0.9)" stroke="#567" strokeWidth="1" />}
    </g>
  )
}

/** caneca de residuos */
export function Caneca() {
  return (
    <g>
      <rect x="-26" y="-36" width="52" height="8" rx="3" fill="#c0392b" {...T} />
      <path d="M-22 -28 L-18 36 H18 L22 -28 Z" fill="#e74c3c" {...T} />
      <text y="8" textAnchor="middle" fontSize="9" fontWeight="800" fill="#fff">RESIDUOS</text>
    </g>
  )
}

/** trozo de cebolla con su telita */
export function Cebolla() {
  return (
    <g>
      <path d="M-30 20 Q-34 -20 0 -26 Q34 -20 30 20 Z" fill="#f3e3c8" {...T} />
      <path d="M-22 16 Q-24 -12 0 -18 Q24 -12 22 16" fill="none" stroke="#c9a27a" strokeWidth="1.5" />
      <path d="M-12 12 Q-12 -4 0 -8 Q12 -4 12 12" fill="none" stroke="#c9a27a" strokeWidth="1.5" />
    </g>
  )
}

/** palillo para raspar la mejilla */
export function Palillo() {
  return (
    <g>
      <rect x="-4" y="-40" width="8" height="80" rx="4" fill="#e2c28f" {...T} transform="rotate(25)" />
    </g>
  )
}

/** rodaja de papa */
export function Papa() {
  return (
    <g>
      <ellipse rx="30" ry="18" fill="#c99a5b" {...T} />
      <ellipse rx="24" ry="13" fill="#f4e2a8" />
    </g>
  )
}

/** pinza de punta fina; con «telita» lleva la epidermis de cebolla en la punta */
export function Pinza({ telita = false }: { telita?: boolean }) {
  return (
    <g transform="rotate(-30)">
      <path d="M-3 -44 L-6 40 M3 -44 L6 40" stroke="#8a96a0" strokeWidth="5" strokeLinecap="round" />
      <path d="M-3 -44 L-6 40 M3 -44 L6 40" stroke="#2b2b2b" strokeWidth="1" fill="none" />
      {telita && <path d="M-10 36 Q0 30 10 36 Q8 48 0 50 Q-8 48 -10 36 Z" fill="rgba(244,230,196,0.9)" stroke="#b07b2c" strokeWidth="1" />}
    </g>
  )
}

/** aguja de disección con mango */
export function Aguja() {
  return (
    <g transform="rotate(30)">
      <rect x="-5" y="-40" width="10" height="44" rx="4" fill="#e2c28f" {...T} />
      <path d="M0 4 L0 40" stroke="#555" strokeWidth="2.5" strokeLinecap="round" />
    </g>
  )
}

/** papel absorbente doblado */
export function PapelAbsorbente() {
  return (
    <g>
      <path d="M-30 14 L-22 -16 H30 L22 14 Z" fill="#fff" {...T} />
      <path d="M-26 0 H26" stroke="#ccc" strokeWidth="1.5" />
    </g>
  )
}

/** cubreobjetos (ancho ≈ 50), inclinado «angulo» grados */
export function Cubreobjetos({ angulo = 0 }: { angulo?: number }) {
  return <path d="M-24 6 L-14 -8 H26 L16 6 Z" fill="rgba(220,240,250,0.9)" stroke="#567" strokeWidth="1.5" transform={`rotate(${-angulo})`} />
}

/** vaso de precipitado (alto ≈ 90) con líquido, etiqueta y, si se pide, una tira de papa adentro */
export function Vaso({ color = '#a9d3f5', etiqueta, tira, minutos }: { color?: string; etiqueta?: string; tira?: { largo: number; blanda: boolean }; minutos?: number }) {
  return (
    <g>
      <rect x="-30" y="-6" width="60" height="48" fill={color} opacity="0.7" />
      {tira && <path d={`M-2 ${40 - tira.largo} q${tira.blanda ? 9 : 0} ${tira.largo / 2} 0 ${tira.largo}`} stroke="#e9d9a0" strokeWidth="9" fill="none" strokeLinecap="round" />}
      <path d="M-34 -40 V42 Q-34 46 -30 46 H30 Q34 46 34 42 V-40" fill="none" {...T} />
      {etiqueta && <text y="-46" textAnchor="middle" fontSize="12" fontWeight="800" fill="#3a2f22">{etiqueta}</text>}
      {minutos !== undefined && <text y="62" textAnchor="middle" fontSize="11" fontWeight="700" fill="#3a2f22">{minutos} min</text>}
    </g>
  )
}

/** balanza digital (ancho ≈ 90) con su lectura */
export function Balanza({ lectura, encima }: { lectura: string; encima?: boolean }) {
  return (
    <g>
      {encima && <path d="M-22 -16 q22 -6 44 0" stroke="#e9d9a0" strokeWidth="8" fill="none" strokeLinecap="round" />}
      <rect x="-34" y="-12" width="68" height="6" rx="2" fill="#9aa5ad" {...T} />
      <path d="M-44 -4 H44 L40 30 H-40 Z" fill="#dfe4e8" {...T} />
      <rect x="-26" y="6" width="52" height="16" rx="2" fill="#203028" />
      <text y="19" textAnchor="middle" fontSize="11" fontWeight="700" fill="#7dff9a" fontFamily="monospace">{lectura}</text>
    </g>
  )
}

/** tiras de papa cortadas (las que faltan por usar) */
export function TirasPapa({ n }: { n: number }) {
  return (
    <g>
      <rect x="-34" y="10" width="68" height="10" rx="3" fill="#c8b48a" {...T} />
      {Array.from({ length: n }, (_, k) => <rect key={k} x={-28 + k * 12} y="-26" width="8" height="34" rx="3" fill="#f2e3b0" stroke="#b09050" strokeWidth="1.5" />)}
    </g>
  )
}

/** frasco con ramitas de elodea */
export function Elodea() {
  return (
    <g>
      <rect x="-24" y="-20" width="48" height="58" rx="6" fill="rgba(169,211,245,0.6)" {...T} />
      {[-10, 0, 10].map((x) => (
        <g key={x}>
          <path d={`M${x} 36 Q${x - 4} 10 ${x + 2} -28`} stroke="#3f7f2f" strokeWidth="2" fill="none" />
          {[-20, -8, 4, 16, 28].map((y) => <ellipse key={y} cx={x + (y % 8 ? 4 : -4)} cy={y} rx="5" ry="2" fill="#4f9f3a" transform={`rotate(${y % 8 ? 30 : -30} ${x} ${y})`} />)}
        </g>
      ))}
    </g>
  )
}
