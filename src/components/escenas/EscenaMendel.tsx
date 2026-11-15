import { Semilla } from '../ilustraciones/Semilla.tsx'

// Escena viva del experimento de Mendel con el color de la semilla: P → F1 → F2 y, al final, los alelos.
// Fases: p, polinizar, f1, autofecundar, f2, alelos.

const ORDEN = ['p', 'polinizar', 'f1', 'autofecundar', 'f2', 'alelos']
const F2 = ['AA', 'Aa', 'Aa', 'aa', 'AA', 'Aa', 'Aa', 'aa']
const trans = { transition: 'opacity 0.6s ease' }

function Rotulo({ x, y, texto, ver }: { x: number; y: number; texto: string; ver: boolean }) {
  return (
    <text x={x} y={y} textAnchor="middle" fontSize="12" fontWeight="800" fill="#4a3416" opacity={ver ? 1 : 0} style={trans}>
      {texto}
    </text>
  )
}

export default function EscenaMendel({ fase }: { fase: string }) {
  const i = Math.max(0, ORDEN.indexOf(fase))
  const letras = fase === 'alelos'
  const fila = (ver: boolean) => ({ opacity: ver ? 1 : 0, ...trans })
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label="Experimento de Mendel con semillas amarillas y verdes" className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#fbf6e9" />
      {/* nombres de las generaciones */}
      {[
        ['P', 58],
        ['F1', 148],
        ['F2', 238],
      ].map(([t, y], k) => (
        <g key={t} style={fila(k === 0 || (k === 1 && i >= 2) || (k === 2 && i >= 4))}>
          <rect x="8" y={(y as number) - 16} width="36" height="28" rx="14" fill="#3a4450" />
          <text x="26" y={(y as number) + 3} textAnchor="middle" fontSize="13" fontWeight="800" fill="#fff">{t}</text>
        </g>
      ))}

      {/* P: líneas puras */}
      <g>
        <Semilla x={130} y={52} r={20} amarilla />
        <text x="200" y="60" textAnchor="middle" fontSize="26" fontWeight="800" fill="#4a3416">×</text>
        <Semilla x={270} y={52} r={20} amarilla={false} />
        <Rotulo x={130} y={90} texto={letras ? 'AA' : 'amarilla pura'} ver />
        <Rotulo x={270} y={90} texto={letras ? 'aa' : 'verde pura'} ver />
      </g>

      {/* polinización a mano */}
      <g style={fila(i === 1)}>
        <path d="M 150 30 Q 200 -5 250 30" fill="none" stroke="#b05a5a" strokeWidth="2.5" strokeDasharray="5 5" />
        <text x="200" y="22" textAnchor="middle" fontSize="18">🖌️</text>
        <text x="200" y="128" textAnchor="middle" fontSize="12" fill="#4a3416">Mendel quita los estambres y lleva el polen con un pincel</text>
      </g>

      {/* F1: todas amarillas */}
      <g style={fila(i >= 2)}>
        {[0, 1, 2, 3, 4].map((k) => (
          <Semilla key={k} x={110 + k * 45} y={142} r={15} amarilla />
        ))}
        <Rotulo x={200} y={178} texto={letras ? 'todas Aa' : 'todas amarillas'} ver={i >= 2 && i !== 3} />
      </g>

      {/* autofecundación */}
      <g style={fila(i === 3)}>
        <circle cx="200" cy="142" r="26" fill="none" stroke="#b05a5a" strokeWidth="2.5" strokeDasharray="6 4" />
        <path d="M 222 126 l 6 -8 l 2 10 z" fill="#b05a5a" />
        <text x="200" y="182" textAnchor="middle" fontSize="12" fill="#4a3416">Cada planta de la F1 se poliniza a sí misma</text>
      </g>

      {/* F2: 3 amarillas por cada verde */}
      <g style={fila(i >= 4)}>
        {F2.map((g, k) => (
          <g key={k}>
            <Semilla x={60 + k * 42} y={232} r={15} amarilla={g !== 'aa'} />
            <text x={60 + k * 42} y={266} textAnchor="middle" fontSize="12" fontWeight="800" fill="#4a3416" opacity={letras ? 1 : 0} style={trans}>
              {g}
            </text>
          </g>
        ))}
        <text x="200" y="290" textAnchor="middle" fontSize="12" fontWeight="800" fill="#4a3416" opacity={letras ? 0 : 1} style={trans}>
          6022 amarillas : 2001 verdes ≈ 3 : 1
        </text>
      </g>
    </svg>
  )
}
