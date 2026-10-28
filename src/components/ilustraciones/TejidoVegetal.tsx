// Ilustración esquemática (no a escala): tejido vegetal visto al microscopio.
// `resaltar` atenúa todo menos una parte: 'pared' | 'vacuola' | 'nucleo' | 'cloroplastos'.
export type ParteVegetal = 'pared' | 'vacuola' | 'nucleo' | 'cloroplastos'

const FILAS = 4
const COLS = 5
const CW = 76
const CH = 64

export default function TejidoVegetal({ resaltar = null }: { resaltar?: ParteVegetal | null }) {
  const op = (k: ParteVegetal) => (resaltar && resaltar !== k ? 0.22 : 1)
  const celdas = Array.from({ length: FILAS * COLS }, (_, i) => ({ f: Math.floor(i / COLS), c: i % COLS }))
  const x0 = (400 - COLS * CW) / 2
  const y0 = (300 - FILAS * CH) / 2
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label="Tejido vegetal: células con pared gruesa, vacuola, núcleo y cloroplastos" className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#e9efd9" />
      {celdas.map(({ f, c }) => {
        const x = x0 + c * CW
        const y = y0 + f * CH
        const lado = (f + c) % 2 ? 1 : -1
        return (
          <g key={`${f}-${c}`}>
            <rect x={x} y={y} width={CW} height={CH} fill="#f1f7df" />
            <g opacity={op('vacuola')}>
              <rect x={x + 12} y={y + 12} width={CW - 24} height={CH - 24} rx="10" fill="#cfe8f2" stroke="#7fb4c8" strokeWidth="1" />
            </g>
            <g opacity={op('nucleo')}>
              <circle cx={x + (lado > 0 ? CW - 17 : 17)} cy={y + 17} r="7" fill="#c9a0dc" stroke="#7a4a8a" strokeWidth="1.5" />
            </g>
            <g opacity={op('cloroplastos')}>
              {[[10, CH - 9], [CW - 14, CH - 10], [CW / 2, 8]].map(([dx, dy], k) => (
                <ellipse key={k} cx={x + dx} cy={y + dy} rx="5" ry="3" fill="#4f9a3a" stroke="#2f6a22" strokeWidth="0.8" />
              ))}
            </g>
            <g opacity={op('pared')}>
              <rect x={x} y={y} width={CW} height={CH} fill="none" stroke="#6b8a2f" strokeWidth="5" />
            </g>
          </g>
        )
      })}
    </svg>
  )
}
