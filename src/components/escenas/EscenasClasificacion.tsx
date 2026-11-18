// Escenas vivas de Química, área 1, tema 5 (Clasificación de la materia).

const suave = 'transform 1.1s cubic-bezier(.45,.05,.25,1), opacity 0.7s ease, fill 0.8s ease'
const TINTA = '#3a3a3a'
const ROJO = '#c43c3c'
const AZUL = '#2f6db3'

function T({ x, y, t, c = TINTA, s = 11, peso = 800 }: { x: number; y: number; t: string; c?: string; s?: number; peso?: number }) {
  return <text x={x} y={y} textAnchor="middle" fontSize={s} fontWeight={peso} fill={c} stroke="#fff" strokeWidth="3" paintOrder="stroke">{t}</text>
}

/* ── Elemento, compuesto y mezcla vistos por dentro ───────────────────── */

const FASES = ['elemento', 'compuesto', 'mezcla']
// 9 lugares en la caja; en cada fase cambia lo que hay en cada lugar
const LUGARES: [number, number][] = [[110, 110], [200, 95], [290, 115], [130, 175], [215, 165], [295, 185], [105, 240], [200, 235], [290, 245]]

function Particula({ tipo }: { tipo: 'au' | 'agua' | 'o2' }) {
  if (tipo === 'au') return <circle r="16" fill="#e1b12c" stroke="#9a7a10" strokeWidth="2" />
  if (tipo === 'o2') return <g><circle cx="-9" r="11" fill={ROJO} /><circle cx="9" r="11" fill={ROJO} /></g>
  return <g><circle cx="-12" cy="9" r="8" fill="#f4f4f4" stroke="#888" /><circle cx="12" cy="9" r="8" fill="#f4f4f4" stroke="#888" /><circle r="12" fill={ROJO} /></g>
}

export function EscenaParticulasClasificacion({ fase }: { fase: string }) {
  const i = Math.max(0, FASES.indexOf(fase))
  const tipos: ('au' | 'agua' | 'o2')[][] = [
    Array(9).fill('au'),
    Array(9).fill('agua'),
    ['agua', 'o2', 'agua', 'au', 'agua', 'o2', 'agua', 'au', 'o2'],
  ]
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Partículas de un ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#f4f6fa" />
      <rect x="70" y="65" width="260" height="215" rx="12" fill="#fff" stroke="#aaa" strokeWidth="2" />
      {LUGARES.map(([x, y], k) => (
        <g key={`${i}-${k}`} style={{ transform: `translate(${x}px, ${y}px)`, transition: suave }}>
          <Particula tipo={tipos[i][k]} />
        </g>
      ))}
      <T x={200} y={30} t={['Elemento: una sola clase de átomos (oro)', 'Compuesto: átomos distintos unidos (agua)', 'Mezcla: varias sustancias revueltas'][i]} s={13} />
      <T x={200} y={52} t={['no se puede descomponer en algo más simple', 'H₂O: siempre 2 de hidrógeno y 1 de oxígeno', 'cada sustancia conserva sus propiedades'][i]} c={i === 2 ? AZUL : ROJO} s={11} peso={600} />
    </svg>
  )
}
