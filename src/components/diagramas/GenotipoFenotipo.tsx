import { useState } from 'react'
import { Semilla, AMARILLA, VERDE } from '../ilustraciones/Semilla.tsx'

// Genotipo y fenotipo: arriba tres semillas por fuera (fenotipo); abajo, al «mirar por dentro», su par de cromosomas
// con los alelos (genotipo). Muestra que AA y Aa se ven iguales.

const CASOS = [
  { g: 'AA', alelos: ['A', 'A'] },
  { g: 'Aa', alelos: ['A', 'a'] },
  { g: 'aa', alelos: ['a', 'a'] },
]

function Cromosoma({ x, y, alelo }: { x: number; y: number; alelo: string }) {
  const dom = alelo === 'A'
  return (
    <g>
      <rect x={x - 11} y={y - 44} width={22} height={88} rx={11} fill="#d9cfe8" stroke="#6b5a8a" strokeWidth={2} />
      <path d={`M ${x - 11} ${y} h 22`} stroke="#6b5a8a" strokeWidth={2} />
      <rect x={x - 11} y={y - 30} width={22} height={18} fill={dom ? AMARILLA : VERDE} stroke="#6b5a8a" strokeWidth={1.5} />
      <text x={x} y={y - 16} textAnchor="middle" fontSize="15" fontWeight="900" fill="#2a2a2a">{alelo}</text>
    </g>
  )
}

export default function GenotipoFenotipo() {
  const [dentro, setDentro] = useState(false)
  return (
    <div data-diagrama>
      <div className="mb-3 flex justify-center">
        <button
          type="button"
          aria-pressed={dentro}
          onClick={() => setDentro((d) => !d)}
          className="min-h-11 rounded-full border border-[var(--acento)] px-5 text-base font-semibold text-[var(--acento)] aria-pressed:bg-[var(--acento)] aria-pressed:text-[var(--sobre-acento)]"
        >
          {dentro ? '🙈 Ver solo por fuera' : '🔍 Mirar por dentro'}
        </button>
      </div>
      <svg viewBox="0 0 640 330" role="img" aria-label="Tres semillas: por fuera dos amarillas y una verde; por dentro AA, Aa y aa" className="mx-auto w-full max-w-3xl">
        <style>{`.gf-t { transition: opacity .5s ease, transform .5s ease }`}</style>
        {/* rótulos de las filas */}
        <rect x="0" y="186" width="640" height="140" rx="16" fill="#efe9f6" />
        <rect x="0" y="10" width="640" height="146" rx="16" fill="#f4eedf" />
        <text x="14" y="210" fontSize="15" fontWeight="900" fill="#5a4a7a">GENOTIPO</text>
        <text x="14" y="228" fontSize="12" fill="#5a4a7a">lo que tiene</text>
        <text x="14" y="34" fontSize="15" fontWeight="900" fill="#7a5a2a">FENOTIPO</text>
        <text x="14" y="52" fontSize="12" fill="#7a5a2a">lo que se ve</text>
        {CASOS.map((c, k) => {
          const cx = 210 + k * 170
          return (
            <g key={c.g}>
              {/* por dentro */}
              <g className="gf-t" opacity={dentro ? 1 : 0} style={{ transform: dentro ? 'none' : 'translateY(-10px)' }}>
                <Cromosoma x={cx - 18} y={250} alelo={c.alelos[0]} />
                <Cromosoma x={cx + 18} y={250} alelo={c.alelos[1]} />
                <text x={cx} y={316} textAnchor="middle" fontSize="16" fontWeight="900" fill="#2a2a2a">{c.g}</text>
              </g>
              <text x={cx} y={266} textAnchor="middle" fontSize="44" fontWeight="900" fill="#b3a6c9" className="gf-t" opacity={dentro ? 0 : 1}>?</text>
              {/* flecha */}
              <path d={`M ${cx} 182 V 164`} stroke="#8a7a6a" strokeWidth={3} markerEnd="url(#gf-punta)" />
              {/* por fuera */}
              <Semilla x={cx} y={78} r={38} amarilla={c.g !== 'aa'} />
              <text x={cx} y={142} textAnchor="middle" fontSize="16" fontWeight="800" fill="#2a2a2a">{c.g === 'aa' ? 'verde' : 'amarilla'}</text>
            </g>
          )
        })}
        <defs>
          <marker id="gf-punta" markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="12" refX="6" refY="6" orient="auto">
            <path d="M0 0 L12 6 L0 12 Z" fill="#8a7a6a" />
          </marker>
        </defs>
      </svg>
      <p aria-live="polite" className="mt-2 text-center text-lg">
        {dentro
          ? 'Las dos primeras se ven iguales, pero por dentro son distintas: AA y Aa. Basta un A para que la semilla sea amarilla.'
          : 'Por fuera vemos dos semillas amarillas y una verde. ¿Las dos amarillas tendrán los mismos alelos?'}
      </p>
    </div>
  )
}
