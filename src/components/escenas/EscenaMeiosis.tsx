// Escena viva de la meiosis: el mismo dibujo se transforma fase a fase.
// Dos pares de cromosomas (largo y corto); tono oscuro = de la madre, claro = del padre.
// Cada cromátida es un elemento propio que viaja de una posición a otra con transiciones CSS.
import { COLORES } from '../ilustraciones/CelulaMeiosis.tsx'

const ORDEN = ['interfase', 'profase-i', 'entrecruzamiento', 'metafase-i', 'anafase-i', 'telofase-i', 'metafase-ii', 'anafase-ii', 'gametos']
const LARGO = [36, 22]
const CX = [105, 295]
const NUCLEO = '#7a4a8a'
const suave = 'transform 0.9s ease, opacity 0.6s ease, stroke 0.8s ease'
const MEMBRANA = { fill: '#f8d9d4', stroke: '#b05a5a', strokeWidth: 4 }

/** centro y giro del cromosoma (par p, homólogo h) en cada fase; el homólogo h termina en la célula h */
function centro(f: string, p: number, h: number): [number, number, number] {
  const s = h
  switch (f) {
    case 'profase-i':
    case 'entrecruzamiento': {
      const [px, py, g] = p === 0 ? [175, 135, 25] : [228, 170, -40]
      const d = h === 0 ? -7 : 7
      const r = (g * Math.PI) / 180
      return [px + d * Math.cos(r), py + d * Math.sin(r), g]
    }
    case 'metafase-i':
      return [h === 0 ? 186 : 214, p === 0 ? 108 : 190, 0]
    case 'anafase-i':
      return [h === 0 ? 130 : 270, p === 0 ? 110 : 190, 0]
    case 'telofase-i':
      return [CX[s] + (p === 0 ? -16 : 18), p === 0 ? 150 : 152, p === 0 ? 20 : -25]
    case 'metafase-ii':
      return [CX[s] + (p === 0 ? -22 : 22), 150, 0]
    default:
      return [200, 150, 0]
  }
}

/** posición de cada cromátida: juntas hasta la anafase II, después cada una por su lado */
function posicion(f: string, p: number, h: number, c: number): [number, number, number] {
  const s = h
  const x = CX[s] + (p === 0 ? -18 : 18)
  if (f === 'anafase-ii') return [x, c === 0 ? 98 : 202, 0]
  if (f === 'gametos') return [CX[s] + (p === 0 ? -10 : 10), c === 0 ? 80 : 220, 0]
  return centro(f, p, h)
}

export default function EscenaMeiosis({ fase }: { fase: string }) {
  const f = fase
  const i = ORDEN.indexOf(f)
  const cruce = i >= ORDEN.indexOf('entrecruzamiento')
  const visibles = f !== 'interfase'
  const en = (...ids: string[]) => (ids.includes(f) ? 1 : 0)

  // huso: de los polos a los cromosomas, según la fase
  const fibras: [number, number, number, number][] = []
  const a = (x1: number, y1: number, x2: number, y2: number) => fibras.push([x1, y1, x2, y2])
  if (f === 'metafase-i') for (const y of [108, 190]) { a(96, 150, 186, y); a(304, 150, 214, y) }
  if (f === 'anafase-i') for (const y of [110, 190]) { a(58, 150, 130, y); a(342, 150, 270, y) }
  if (f === 'metafase-ii') for (const cx of CX) for (const d of [-22, 22]) { a(cx, 72, cx + d, 150); a(cx, 228, cx + d, 150) }
  if (f === 'anafase-ii') for (const cx of CX) for (const d of [-18, 18]) { a(cx, 44, cx + d, 98); a(cx, 256, cx + d, 202) }

  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Meiosis: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#f3e7ef" />

      {/* membranas: una célula → dos → cuatro */}
      <circle cx="200" cy="150" r="112" {...MEMBRANA}
        style={{ transition: suave, transformOrigin: '200px 150px', transform: f === 'anafase-i' ? 'scale(1.34, 0.85)' : 'none', opacity: i <= ORDEN.indexOf('anafase-i') ? 1 : 0 }} />
      {CX.map((cx) => (
        <circle key={cx} cx={cx} cy="150" r="86" {...MEMBRANA}
          style={{ transition: suave, transformOrigin: `${cx}px 150px`, transform: f === 'anafase-ii' ? 'scale(0.86, 1.3)' : 'none', opacity: en('telofase-i', 'metafase-ii', 'anafase-ii') }} />
      ))}
      {CX.flatMap((cx) => [80, 220].map((cy) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="58" {...MEMBRANA} style={{ transition: suave, opacity: en('gametos') }} />
      )))}

      {/* núcleos */}
      <circle cx="200" cy="150" r={f === 'interfase' ? 58 : 68} fill={f === 'interfase' ? '#ead3f2' : 'none'} stroke={NUCLEO} strokeWidth="2.5"
        strokeDasharray={f === 'interfase' ? undefined : '5 5'} style={{ transition: suave, opacity: en('interfase', 'profase-i', 'entrecruzamiento') }} />
      <g fill="none" strokeWidth="2.5" strokeLinecap="round" style={{ transition: suave, opacity: en('interfase') }}>
        <path d="M174 146 q16 -26 32 -6" stroke={COLORES[0][0]} />
        <path d="M179 166 q21 21 26 -5" stroke={COLORES[0][1]} />
        <path d="M200 124 q16 10 5 26" stroke={COLORES[1][0]} />
        <path d="M205 173 q16 -5 18 -21" stroke={COLORES[1][1]} />
      </g>
      {CX.map((cx) => (
        <circle key={cx} cx={cx} cy="150" r="44" fill="none" stroke={NUCLEO} strokeWidth="2" strokeDasharray="4 4" style={{ transition: suave, opacity: en('telofase-i') }} />
      ))}
      {CX.flatMap((cx) => [80, 220].map((cy) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="30" fill="#ead3f2" fillOpacity="0.6" stroke={NUCLEO} strokeWidth="2" style={{ transition: suave, opacity: en('gametos') }} />
      )))}

      {/* huso */}
      <g key={f} stroke="#8b7a96" strokeWidth="1.2" opacity="0.75" className="animate-[aparecer_0.6s_ease-out]">
        {fibras.map(([x1, y1, x2, y2], k) => <line key={k} x1={x1} y1={y1} x2={x2} y2={y2} />)}
        {fibras.length > 0 && [...new Set(fibras.map(([x, y]) => `${x},${y}`))].map((pt) => {
          const [x, y] = pt.split(',').map(Number)
          return <circle key={pt} cx={x} cy={y} r="4.5" fill="#8b7a96" stroke="none" />
        })}
      </g>

      {/* brillo donde ocurre el entrecruzamiento */}
      {[[0, 175, 135], [1, 228, 170]].map(([p, x, y]) => (
        <circle key={p} cx={x} cy={y} r="22" fill="#fff6a8" style={{ transition: suave, opacity: f === 'entrecruzamiento' ? 0.75 : 0 }} />
      ))}

      {/* 8 cromátidas: par p, homólogo h (0 madre, 1 padre), cromátida c */}
      {[0, 1].flatMap((p) =>
        [0, 1].flatMap((h) =>
          [0, 1].map((c) => {
            const [x, y, g] = posicion(f, p, h, c)
            const l = LARGO[p] / 2
            const dx = c === 0 ? -5 : 5
            const propio = COLORES[p][h]
            // se intercambia un brazo entre cromátidas no hermanas vecinas
            const cambia = cruce && ((h === 0 && c === 1) || (h === 1 && c === 0))
            const abajo = cambia ? COLORES[p][1 - h] : propio
            return (
              <g key={`${p}${h}${c}`} strokeWidth="6" strokeLinecap="round"
                style={{ transition: suave, transform: `translate(${x}px, ${y}px) rotate(${g}deg)`, opacity: visibles ? 1 : 0 }}>
                <line x1={dx} y1={-l} x2="0" y2="0" stroke={propio} />
                <line x1={dx} y1={l} x2="0" y2="0" style={{ stroke: abajo, transition: suave }} />
              </g>
            )
          }),
        ),
      )}
    </svg>
  )
}
