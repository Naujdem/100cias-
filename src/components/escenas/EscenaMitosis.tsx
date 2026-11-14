// Escena viva de la mitosis: el mismo dibujo se transforma de una fase a la siguiente.
// Esquemático (no a escala): dos pares de cromosomas (azul largo, naranja corto); las personas tenemos 46.

const AZUL = '#3b6fb6'
const NARANJA = '#d9822b'
const HUSO = '#8b7a96'
const NUCLEO = '#7a4a8a'

// posición en profase/prometafase: x, y, giro, color, largo
const CROMOS: [number, number, number, string, number][] = [
  [176, 124, 40, AZUL, 34],
  [226, 172, -30, AZUL, 34],
  [220, 116, 75, NARANJA, 22],
  [180, 180, 105, NARANJA, 22],
]
const FILA = [96, 128, 172, 204] // altura de cada cromosoma en la metafase

const suave = 'transform 0.9s ease, opacity 0.6s ease'

export default function EscenaMitosis({ fase }: { fase: string }) {
  const f = fase
  const visibles = f !== 'interfase' && f !== 'telofase'
  const conHuso = f === 'prometafase' || f === 'metafase' || f === 'anafase'

  const posicion = (k: number, lado: -1 | 1) => {
    const [x, y, giro] = CROMOS[k]
    if (f === 'interfase') return `translate(200px, 150px)`
    if (f === 'profase' || f === 'prometafase') return `translate(${x}px, ${y}px) rotate(${giro}deg)`
    if (f === 'metafase') return `translate(200px, ${FILA[k]}px) rotate(90deg)`
    if (f === 'anafase') return `translate(${200 + lado * 58}px, ${FILA[k]}px) rotate(90deg)`
    return `translate(${200 + lado * 88}px, ${150 + (FILA[k] - 150) * 0.35}px) rotate(90deg)`
  }
  // a dónde apunta cada fibra del huso
  const destinos = f === 'prometafase' ? CROMOS.map(([x, y]) => [x, y]) : FILA.map((y) => [200, y])

  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Mitosis: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#f3e7ef" />

      {/* célula: se estira en la anafase y se parte en la telofase */}
      <circle
        cx="200" cy="150" r="110" fill="#f8d9d4" stroke="#b05a5a" strokeWidth="4"
        style={{ transition: suave, transformOrigin: '200px 150px', transform: f === 'anafase' ? 'scale(1.25, 0.88)' : 'none', opacity: f === 'telofase' ? 0 : 1 }}
      />
      <g style={{ transition: suave, opacity: f === 'telofase' ? 1 : 0 }}>
        <circle cx="128" cy="150" r="80" fill="#f8d9d4" stroke="#b05a5a" strokeWidth="4" />
        <circle cx="272" cy="150" r="80" fill="#f8d9d4" stroke="#b05a5a" strokeWidth="4" />
        <rect x="188" y="96" width="24" height="108" fill="#f8d9d4" />
      </g>

      {/* núcleo de la célula madre */}
      <circle
        cx="200" cy="150" r="58" fill="#ead3f2" stroke={NUCLEO} strokeWidth="3"
        strokeDasharray={f === 'profase' ? '6 6' : undefined}
        style={{ transition: suave, opacity: f === 'interfase' ? 1 : f === 'profase' ? 0.5 : 0 }}
      />
      {/* restos de la envoltura en la prometafase */}
      <g fill="none" stroke={NUCLEO} strokeWidth="2.5" strokeLinecap="round" style={{ transition: suave, opacity: f === 'prometafase' ? 1 : 0 }}>
        <path d="M150 112 a62 62 0 0 1 22 -20" />
        <path d="M246 104 a62 62 0 0 1 14 22" />
        <path d="M254 196 a62 62 0 0 1 -20 16" />
        <path d="M146 182 a62 62 0 0 1 -6 -22" />
      </g>
      {/* ADN suelto */}
      <g fill="none" strokeWidth="2.5" strokeLinecap="round" style={{ transition: suave, opacity: f === 'interfase' ? 1 : 0 }}>
        <path d="M172 140 q18 -28 36 -6 t24 24" stroke={AZUL} />
        <path d="M178 168 q24 24 30 -6 t18 -24" stroke={AZUL} />
        <path d="M196 122 q18 12 6 30" stroke={NARANJA} />
        <path d="M214 176 q-12 10 -24 0" stroke={NARANJA} />
      </g>

      {/* huso */}
      <g stroke={HUSO} strokeWidth="1.2" style={{ transition: suave, opacity: conHuso ? 0.85 : 0, transformOrigin: '200px 150px', transform: f === 'anafase' ? 'scaleX(1.3)' : 'none' }}>
        {destinos.map(([x, y], k) => (
          <g key={k}>
            <line x1="92" y1="150" x2={x} y2={y} />
            <line x1="308" y1="150" x2={x} y2={y} />
          </g>
        ))}
        <circle cx="92" cy="150" r="5" fill={HUSO} />
        <circle cx="308" cy="150" r="5" fill={HUSO} />
      </g>

      {/* cromosomas: cada uno son dos cromátidas que se separan en la anafase */}
      {CROMOS.map(([, , , color, largo], k) =>
        ([-1, 1] as const).map((lado) => (
          <g key={`${k}${lado}`} style={{ transition: suave, transform: posicion(k, lado), opacity: visibles ? 1 : 0 }}>
            <line x1={lado * 4} y1={-largo / 2} x2={lado} y2="0" stroke={color} strokeWidth="6" strokeLinecap="round" />
            <line x1={lado} y1="0" x2={lado * 4} y2={largo / 2} stroke={color} strokeWidth="6" strokeLinecap="round" />
          </g>
        )),
      )}
      {/* cinetocoros */}
      {f === 'prometafase' && CROMOS.map(([x, y], k) => <circle key={k} cx={x} cy={y} r="3.5" fill="#2b2b2b" />)}

      {/* núcleos de las hijas */}
      <g style={{ transition: suave, opacity: f === 'telofase' ? 1 : 0 }}>
        {[112, 288].map((x) => (
          <g key={x}>
            <circle cx={x} cy="150" r="36" fill="#ead3f2" stroke={NUCLEO} strokeWidth="3" />
            <path d={`M${x - 16} 144 q10 -16 20 -2 t12 12`} fill="none" stroke={AZUL} strokeWidth="2.5" strokeLinecap="round" />
            <path d={`M${x - 10} 160 q10 8 18 -4`} fill="none" stroke={NARANJA} strokeWidth="2.5" strokeLinecap="round" />
          </g>
        ))}
      </g>
    </svg>
  )
}
