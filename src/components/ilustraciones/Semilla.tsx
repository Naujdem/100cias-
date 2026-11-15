// Semilla de arveja para los temas de Mendel: amarilla o verde, lisa o rugosa.

export const AMARILLA = '#f2c52e'
export const VERDE = '#7cb342'

export function Semilla({ x, y, r = 14, amarilla = true, rugosa = false }: { x: number; y: number; r?: number; amarilla?: boolean; rugosa?: boolean }) {
  const fill = amarilla ? AMARILLA : VERDE
  const borde = amarilla ? '#a07c10' : '#4a7a1e'
  if (!rugosa)
    return (
      <g>
        <circle cx={x} cy={y} r={r} fill={fill} stroke={borde} strokeWidth={2} />
        <circle cx={x - r * 0.35} cy={y - r * 0.35} r={r * 0.25} fill="#fff" opacity={0.45} />
      </g>
    )
  // rugosa: contorno ondulado y arrugas
  const n = 9
  const puntos = Array.from({ length: n * 2 }, (_, i) => {
    const a = (i / (n * 2)) * Math.PI * 2
    const rr = i % 2 ? r * 0.82 : r
    return `${(x + rr * Math.cos(a)).toFixed(1)},${(y + rr * Math.sin(a)).toFixed(1)}`
  }).join(' ')
  return (
    <g>
      <polygon points={puntos} fill={fill} stroke={borde} strokeWidth={2} strokeLinejoin="round" />
      <path d={`M ${x - r * 0.5} ${y - r * 0.2} q ${r * 0.25} ${r * 0.3} ${r * 0.5} 0 M ${x - r * 0.1} ${y + r * 0.35} q ${r * 0.25} ${r * 0.25} ${r * 0.5} 0`} fill="none" stroke={borde} strokeWidth={1.5} />
    </g>
  )
}

/** Dibuja la semilla que corresponde a un genotipo (A = amarilla, a = verde; B = lisa, b = rugosa). */
export function SemillaDe({ genotipo, x, y, r }: { genotipo: string; x: number; y: number; r?: number }) {
  const amarilla = genotipo.includes('A')
  const rugosa = /[Bb]/.test(genotipo) && !genotipo.includes('B')
  return <Semilla x={x} y={y} r={r} amarilla={amarilla} rugosa={rugosa} />
}
