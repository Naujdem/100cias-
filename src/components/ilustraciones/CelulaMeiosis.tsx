// Ilustración esquemática (no a escala) de la meiosis en una célula animal con dos pares de cromosomas.
// Par largo azul y par corto naranja; el tono oscuro viene de la madre y el claro del padre.
// `cruce` muestra el entrecruzamiento (un brazo cambia de color); `voltea[p]` cambia qué homólogo del par p va a la izquierda en la metafase I.

export const ETAPAS_MEIOSIS = [
  'Interfase',
  'Profase I',
  'Metafase I',
  'Anafase I',
  'Telofase I',
  'Metafase II',
  'Anafase II',
  'Cuatro gametos',
] as const
export type EtapaMeiosis = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7

export const COLORES = [
  ['#2f5f9e', '#8fb4e3'], // par 0 (largo): madre, padre
  ['#c46a12', '#f2b56b'], // par 1 (corto): madre, padre
]
const LARGO = [36, 22]
const MEMBRANA = { fill: '#f8d9d4', stroke: '#b05a5a', strokeWidth: 4 }

/** Colores [arriba, abajo] de la cromátida c del homólogo h del par p. */
function colorCromatida(p: number, h: number, c: number, cruce: boolean): [string, string] {
  const propio = COLORES[p][h]
  // el entrecruzamiento ocurre entre cromátidas no hermanas vecinas: la 1 de la madre y la 0 del padre
  const cambia = cruce && ((h === 0 && c === 1) || (h === 1 && c === 0))
  return [propio, cambia ? COLORES[p][1 - h] : propio]
}

/** Cromosoma duplicado (en X). La cromátida 0 queda a la izquierda (arriba si giro = 90). */
function Duplicado({ x, y, p, h, cruce, giro = 0 }: { x: number; y: number; p: number; h: number; cruce: boolean; giro?: number }) {
  const l = LARGO[p] / 2
  return (
    <g transform={`translate(${x} ${y}) rotate(${giro})`} strokeWidth="6" strokeLinecap="round">
      {[0, 1].map((c) => {
        const [arriba, abajo] = colorCromatida(p, h, c, cruce)
        const dx = c === 0 ? -5 : 5
        return (
          <g key={c}>
            <line x1={dx} y1={-l} x2="0" y2="0" stroke={arriba} />
            <line x1={dx} y1={l} x2="0" y2="0" stroke={abajo} />
          </g>
        )
      })}
    </g>
  )
}

/** Cromátida suelta (cromosoma simple), vertical. */
function Simple({ x, y, p, h, c, cruce }: { x: number; y: number; p: number; h: number; c: number; cruce: boolean }) {
  const l = LARGO[p] / 2
  const [arriba, abajo] = colorCromatida(p, h, c, cruce)
  return (
    <g strokeWidth="6" strokeLinecap="round">
      <line x1={x} y1={y - l} x2={x} y2={y} stroke={arriba} />
      <line x1={x} y1={y} x2={x} y2={y + l} stroke={abajo} />
    </g>
  )
}

function Hebras({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const c = [COLORES[0][0], COLORES[0][1], COLORES[1][0], COLORES[1][1]]
  return (
    <g fill="none" strokeWidth="2.5" strokeLinecap="round">
      <path d={`M${cx - r * 0.5} ${cy - r * 0.2} q${r * 0.3} -${r * 0.5} ${r * 0.6} -${r * 0.1}`} stroke={c[0]} />
      <path d={`M${cx - r * 0.4} ${cy + r * 0.3} q${r * 0.4} ${r * 0.4} ${r * 0.5} -${r * 0.1}`} stroke={c[1]} />
      <path d={`M${cx} ${cy - r * 0.5} q${r * 0.3} ${r * 0.2} ${r * 0.1} ${r * 0.5}`} stroke={c[2]} />
      <path d={`M${cx + r * 0.1} ${cy + r * 0.45} q${r * 0.3} -${r * 0.1} ${r * 0.35} -${r * 0.4}`} stroke={c[3]} />
    </g>
  )
}

function Huso({ desde, hasta }: { desde: [number, number][]; hasta: [number, number][] }) {
  return (
    <g stroke="#8b7a96" strokeWidth="1.2" opacity="0.7">
      {desde.flatMap(([x1, y1], i) => hasta.map(([x2, y2], k) => <line key={`${i}-${k}`} x1={x1} y1={y1} x2={x2} y2={y2} />))}
    </g>
  )
}

/** Qué homólogo de cada par va a la célula de la izquierda (0 = madre). */
export const izquierda = (voltea: [boolean, boolean], p: number) => (voltea[p] ? 1 : 0)

export default function CelulaMeiosis({ etapa, cruce = false, voltea = [false, false] }: { etapa: EtapaMeiosis; cruce?: boolean; voltea?: [boolean, boolean] }) {
  // homólogo que va a cada lado tras la meiosis I
  const lado = (p: number, s: 0 | 1) => (s === 0 ? izquierda(voltea, p) : 1 - izquierda(voltea, p))
  const CX = [105, 295]
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Meiosis: ${ETAPAS_MEIOSIS[etapa]}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#f3e7ef" />

      {etapa <= 2 && <circle cx="200" cy="150" r="112" {...MEMBRANA} />}
      {etapa === 3 && <ellipse cx="200" cy="150" rx="150" ry="95" {...MEMBRANA} />}
      {(etapa === 4 || etapa === 5) && CX.map((cx) => <circle key={cx} cx={cx} cy="150" r="86" {...MEMBRANA} />)}
      {etapa === 6 && CX.map((cx) => <ellipse key={cx} cx={cx} cy="150" rx="74" ry="112" {...MEMBRANA} />)}
      {etapa === 7 && CX.flatMap((cx) => [80, 220].map((cy) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="58" {...MEMBRANA} />))}

      {etapa === 0 && (
        <>
          <circle cx="200" cy="150" r="58" fill="#ead3f2" stroke="#7a4a8a" strokeWidth="3" />
          <Hebras cx={200} cy={150} r={52} />
        </>
      )}

      {etapa === 1 && (
        <>
          <circle cx="200" cy="150" r="68" fill="none" stroke="#7a4a8a" strokeWidth="2" strokeDasharray="5 5" />
          {/* los homólogos se aparean: cada par queda junto */}
          <g transform="translate(175 135) rotate(25)">
            <Duplicado x={-7} y={0} p={0} h={0} cruce={cruce} />
            <Duplicado x={7} y={0} p={0} h={1} cruce={cruce} />
          </g>
          <g transform="translate(228 170) rotate(-40)">
            <Duplicado x={-7} y={0} p={1} h={0} cruce={cruce} />
            <Duplicado x={7} y={0} p={1} h={1} cruce={cruce} />
          </g>
        </>
      )}

      {etapa === 2 && (
        <>
          <Huso desde={[[96, 150], [304, 150]]} hasta={[[200, 110], [200, 190]]} />
          {[0, 1].map((p) => (
            <g key={p}>
              <Duplicado x={186} y={p === 0 ? 108 : 190} p={p} h={lado(p, 0)} cruce={cruce} />
              <Duplicado x={214} y={p === 0 ? 108 : 190} p={p} h={lado(p, 1)} cruce={cruce} />
            </g>
          ))}
        </>
      )}

      {etapa === 3 && (
        <>
          <Huso desde={[[58, 150]]} hasta={[[130, 110], [130, 190]]} />
          <Huso desde={[[342, 150]]} hasta={[[270, 110], [270, 190]]} />
          {[0, 1].map((p) => (
            <g key={p}>
              <Duplicado x={130} y={p === 0 ? 110 : 190} p={p} h={lado(p, 0)} cruce={cruce} />
              <Duplicado x={270} y={p === 0 ? 110 : 190} p={p} h={lado(p, 1)} cruce={cruce} />
            </g>
          ))}
        </>
      )}

      {etapa === 4 &&
        ([0, 1] as const).map((s) => (
          <g key={s}>
            <circle cx={CX[s]} cy="150" r="44" fill="#ead3f2" stroke="#7a4a8a" strokeWidth="2" strokeDasharray="4 4" />
            <Duplicado x={CX[s] - 16} y={150} p={0} h={lado(0, s)} cruce={cruce} giro={20} />
            <Duplicado x={CX[s] + 18} y={152} p={1} h={lado(1, s)} cruce={cruce} giro={-25} />
          </g>
        ))}

      {etapa === 5 &&
        ([0, 1] as const).map((s) => (
          <g key={s}>
            <Huso desde={[[CX[s], 72], [CX[s], 228]]} hasta={[[CX[s] - 22, 150], [CX[s] + 22, 150]]} />
            <Duplicado x={CX[s] - 22} y={150} p={0} h={lado(0, s)} cruce={cruce} giro={90} />
            <Duplicado x={CX[s] + 22} y={150} p={1} h={lado(1, s)} cruce={cruce} giro={90} />
          </g>
        ))}

      {etapa === 6 &&
        ([0, 1] as const).map((s) => (
          <g key={s}>
            <Huso desde={[[CX[s], 44]]} hasta={[[CX[s] - 18, 98], [CX[s] + 18, 98]]} />
            <Huso desde={[[CX[s], 256]]} hasta={[[CX[s] - 18, 202], [CX[s] + 18, 202]]} />
            {/* giro 90: la cromátida 0 sube y la 1 baja */}
            {[0, 1].map((p) => (
              <g key={p}>
                <Simple x={CX[s] + (p === 0 ? -18 : 18)} y={98} p={p} h={lado(p, s)} c={0} cruce={cruce} />
                <Simple x={CX[s] + (p === 0 ? -18 : 18)} y={202} p={p} h={lado(p, s)} c={1} cruce={cruce} />
              </g>
            ))}
          </g>
        ))}

      {etapa === 7 &&
        ([0, 1] as const).flatMap((s) =>
          [0, 1].map((c) => (
            <g key={`${s}-${c}`}>
              <circle cx={CX[s]} cy={c === 0 ? 80 : 220} r="30" fill="#ead3f2" stroke="#7a4a8a" strokeWidth="2" />
              <Simple x={CX[s] - 10} y={c === 0 ? 80 : 220} p={0} h={lado(0, s)} c={c} cruce={cruce} />
              <Simple x={CX[s] + 10} y={c === 0 ? 80 : 220} p={1} h={lado(1, s)} c={c} cruce={cruce} />
            </g>
          )),
        )}
    </svg>
  )
}
