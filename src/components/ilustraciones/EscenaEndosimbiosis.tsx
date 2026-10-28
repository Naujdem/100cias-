// Ilustración esquemática (no a escala): pasos de la hipótesis endosimbiótica para la mitocondria.
export const PASOS_ENDO = ['Dos células distintas', 'La rodea', 'Queda dentro, viva', 'Se multiplica con la célula', 'Hoy: mitocondrias'] as const

function Bacteria({ x, y, giro = 0 }: { x: number; y: number; giro?: number }) {
  return <rect x={x - 20} y={y - 9} width="40" height="18" rx="9" fill="#a9d79a" stroke="#3f7a3a" strokeWidth="2" transform={`rotate(${giro} ${x} ${y})`} />
}

function Mito({ x, y, giro = 0 }: { x: number; y: number; giro?: number }) {
  return (
    <g transform={`rotate(${giro} ${x} ${y})`}>
      <rect x={x - 22} y={y - 11} width="44" height="22" rx="11" fill="#f2b27a" stroke="#a5531a" strokeWidth="2" />
      <path d={`M${x - 12} ${y - 9} v10 M${x - 4} ${y + 9} v-10 M${x + 4} ${y - 9} v10 M${x + 12} ${y + 9} v-10`} stroke="#a5531a" strokeWidth="1.6" fill="none" />
    </g>
  )
}

export default function EscenaEndosimbiosis({ paso }: { paso: 0 | 1 | 2 | 3 | 4 }) {
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Endosimbiosis: ${PASOS_ENDO[paso]}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#eef1f6" />
      {/* célula hospedera */}
      {paso === 1 ? (
        <path d="M110 150 Q150 130 150 110 Q190 40 300 50 Q390 70 385 150 Q385 245 300 255 Q190 262 150 195 Q150 170 110 150 Z" fill="#f3e1d8" stroke="#b05a5a" strokeWidth="4" />
      ) : (
        <ellipse cx={paso === 0 ? 250 : 200} cy="150" rx={paso === 0 ? 135 : 170} ry="108" fill="#f3e1d8" stroke="#b05a5a" strokeWidth="4" />
      )}
      <circle cx={paso === 0 ? 270 : 250} cy="118" r="36" fill="#ead3f2" stroke="#7a4a8a" strokeWidth="3" />

      {paso === 0 && (
        <>
          <Bacteria x={55} y={160} giro={-10} />
          {[[40, 120], [75, 200], [30, 200], [90, 125]].map(([x, y], i) => (
            <text key={i} x={x} y={y} fontSize="11" fill="#2b5aa0">O₂</text>
          ))}
          <text x="14" y="248" fontSize="12" fill="#3f7a3a">bacteria que usa oxígeno</text>
          <text x="200" y="240" fontSize="12" fill="#4a3416">célula hospedera, sin mitocondrias</text>
        </>
      )}
      {paso === 1 && (
        <>
          <Bacteria x={136} y={152} />
          <text x="230" y="230" fontSize="12" fill="#4a3416">la membrana rodea a la bacteria</text>
        </>
      )}
      {paso === 2 && (
        <>
          <ellipse cx="170" cy="195" rx="30" ry="18" fill="none" stroke="#b05a5a" strokeWidth="2" strokeDasharray="4 3" />
          <Bacteria x={170} y={195} />
          <text x="130" y="284" fontSize="12" fill="#4a3416">no la digiere: convive</text>
        </>
      )}
      {paso === 3 && (
        <>
          <Bacteria x={150} y={200} giro={15} />
          <Bacteria x={210} y={215} giro={-10} />
          <Bacteria x={270} y={190} giro={25} />
          <text x="70" y="284" fontSize="12" fill="#4a3416">ella da energía y la célula le da protección</text>
        </>
      )}
      {paso === 4 && (
        <>
          <Mito x={150} y={200} giro={15} />
          <Mito x={215} y={215} giro={-10} />
          <Mito x={280} y={190} giro={25} />
          <Mito x={140} y={130} giro={60} />
          <text x="70" y="284" fontSize="12" fill="#4a3416">mitocondrias: doble membrana y ADN propio</text>
        </>
      )}
    </svg>
  )
}
