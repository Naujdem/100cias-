// Ilustración esquemática (no a escala): etapas simplificadas de la división de una célula animal.
// Se dibujan dos pares de cromosomas (uno largo azul y uno corto naranja) por claridad; las personas tenemos 46.
export const ETAPAS = ['Preparación', 'Cromosomas visibles', 'Alineados', 'Se separan', 'Dos células'] as const

const AZUL = '#3b6fb6'
const NARANJA = '#d9822b'

function Cromosoma({ x, y, giro = 0, largo = 34, color, doble = true }: { x: number; y: number; giro?: number; largo?: number; color: string; doble?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${giro})`} stroke={color} strokeWidth="6" strokeLinecap="round">
      {doble ? (
        <>
          <line x1="-5" y1={-largo / 2} x2="0" y2="0" />
          <line x1="5" y1={-largo / 2} x2="0" y2="0" />
          <line x1="-5" y1={largo / 2} x2="0" y2="0" />
          <line x1="5" y1={largo / 2} x2="0" y2="0" />
        </>
      ) : (
        <line x1="0" y1={-largo / 2} x2="0" y2={largo / 2} />
      )}
    </g>
  )
}

function Hebras({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g fill="none" strokeWidth="2.5" strokeLinecap="round">
      <path d={`M${cx - r * 0.5} ${cy - r * 0.2} q${r * 0.3} -${r * 0.5} ${r * 0.6} -${r * 0.1} t${r * 0.4} ${r * 0.4}`} stroke={AZUL} />
      <path d={`M${cx - r * 0.4} ${cy + r * 0.3} q${r * 0.4} ${r * 0.4} ${r * 0.5} -${r * 0.1} t${r * 0.3} -${r * 0.4}`} stroke={AZUL} />
      <path d={`M${cx - r * 0.1} ${cy - r * 0.5} q${r * 0.3} ${r * 0.2} ${r * 0.1} ${r * 0.5}`} stroke={NARANJA} />
      <path d={`M${cx + r * 0.1} ${cy + r * 0.45} q${r * 0.3} -${r * 0.1} ${r * 0.35} -${r * 0.4}`} stroke={NARANJA} />
    </g>
  )
}

export default function CelulaDividiendo({ etapa }: { etapa: 0 | 1 | 2 | 3 | 4 }) {
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`División celular: ${ETAPAS[etapa]}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#f3e7ef" />

      {etapa <= 2 && <circle cx="200" cy="150" r="108" fill="#f8d9d4" stroke="#b05a5a" strokeWidth="4" />}
      {etapa === 3 && <ellipse cx="200" cy="150" rx="142" ry="92" fill="#f8d9d4" stroke="#b05a5a" strokeWidth="4" />}
      {etapa === 4 && (
        <>
          <circle cx="132" cy="150" r="78" fill="#f8d9d4" stroke="#b05a5a" strokeWidth="4" />
          <circle cx="268" cy="150" r="78" fill="#f8d9d4" stroke="#b05a5a" strokeWidth="4" />
        </>
      )}

      {etapa === 0 && (
        <>
          <circle cx="200" cy="150" r="56" fill="#ead3f2" stroke="#7a4a8a" strokeWidth="3" />
          <Hebras cx={200} cy={150} r={50} />
        </>
      )}
      {etapa === 1 && (
        <>
          <circle cx="200" cy="150" r="60" fill="none" stroke="#7a4a8a" strokeWidth="2" strokeDasharray="5 5" />
          <Cromosoma x={178} y={138} giro={30} color={AZUL} />
          <Cromosoma x={224} y={166} giro={-35} color={AZUL} />
          <Cromosoma x={214} y={124} giro={70} largo={22} color={NARANJA} />
          <Cromosoma x={184} y={176} giro={100} largo={22} color={NARANJA} />
        </>
      )}
      {etapa === 2 && (
        <>
          <g stroke="#8b7a96" strokeWidth="1.2" opacity="0.7">
            {[100, 130, 170, 200].map((y) => (
              <g key={y}>
                <line x1="104" y1="150" x2="200" y2={y} />
                <line x1="296" y1="150" x2="200" y2={y} />
              </g>
            ))}
          </g>
          <Cromosoma x={200} y={100} giro={90} color={AZUL} />
          <Cromosoma x={200} y={132} giro={90} largo={22} color={NARANJA} />
          <Cromosoma x={200} y={168} giro={90} color={AZUL} />
          <Cromosoma x={200} y={200} giro={90} largo={22} color={NARANJA} />
        </>
      )}
      {etapa === 3 && (
        <>
          <g stroke="#8b7a96" strokeWidth="1.2" opacity="0.7">
            {[100, 130, 170, 200].map((y) => (
              <g key={y}>
                <line x1="62" y1="150" x2="150" y2={y} />
                <line x1="338" y1="150" x2="250" y2={y} />
              </g>
            ))}
          </g>
          {[[100, AZUL, 34], [130, NARANJA, 22], [170, AZUL, 34], [200, NARANJA, 22]].map(([y, c, l]) => (
            <g key={y as number}>
              <Cromosoma x={150} y={y as number} giro={90} largo={l as number} color={c as string} doble={false} />
              <Cromosoma x={250} y={y as number} giro={90} largo={l as number} color={c as string} doble={false} />
            </g>
          ))}
        </>
      )}
      {etapa === 4 && (
        <>
          <circle cx="132" cy="150" r="38" fill="#ead3f2" stroke="#7a4a8a" strokeWidth="3" />
          <circle cx="268" cy="150" r="38" fill="#ead3f2" stroke="#7a4a8a" strokeWidth="3" />
          <Hebras cx={132} cy={150} r={34} />
          <Hebras cx={268} cy={150} r={34} />
        </>
      )}
    </svg>
  )
}
