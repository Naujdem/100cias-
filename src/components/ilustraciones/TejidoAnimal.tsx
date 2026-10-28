// Ilustración esquemática (no a escala): tejido animal (epitelio) visto al microscopio.
// `resaltar` atenúa todo menos una parte: 'membrana' | 'nucleo' | 'citoplasma'.
export type ParteAnimal = 'membrana' | 'nucleo' | 'citoplasma'

const R = 36

export default function TejidoAnimal({ resaltar = null }: { resaltar?: ParteAnimal | null }) {
  const op = (k: ParteAnimal) => (resaltar && resaltar !== k ? 0.22 : 1)
  // empaquetado hexagonal
  const celdas: { x: number; y: number }[] = []
  for (let f = -1; f < 5; f++) {
    for (let c = -1; c < 7; c++) {
      celdas.push({ x: 30 + c * R * 1.8 + (f % 2 ? R * 0.9 : 0), y: 24 + f * R * 1.56 })
    }
  }
  const hex = (x: number, y: number) =>
    Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 3) * i + Math.PI / 6
      const r = R * (0.98 + ((x * 7 + y * 3 + i * 5) % 5) / 100)
      return `${x + Math.cos(a) * r},${y + Math.sin(a) * r}`
    }).join(' ')
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label="Tejido animal: células sin pared, con membrana y núcleo" className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#f6e3e3" />
      {celdas.map(({ x, y }, i) => (
        <g key={i}>
          <polygon points={hex(x, y)} fill="#f8d9d4" opacity={op('citoplasma')} />
          <polygon points={hex(x, y)} fill="none" stroke="#b05a5a" strokeWidth="2" strokeLinejoin="round" opacity={op('membrana')} />
          <circle cx={x + ((i * 7) % 5) - 2} cy={y + ((i * 3) % 5) - 2} r="9" fill="#c9a0dc" stroke="#7a4a8a" strokeWidth="1.5" opacity={op('nucleo')} />
        </g>
      ))}
    </svg>
  )
}
