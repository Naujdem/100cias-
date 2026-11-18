import { useEffect, useState } from 'react'

// Explora: árbol de clasificación de la materia. Se toca una caja (o se usan las teclas 1–7) y abajo sale qué es y ejemplos.

const NODOS = [
  { id: 'materia', n: 'Materia', x: 300, y: 30, t: 'Todo lo que tiene masa y ocupa espacio.', ej: 'el agua, el aire, una piedra, tú' },
  { id: 'pura', n: 'Sustancia pura', x: 150, y: 110, t: 'Una sola sustancia, con composición fija. No se separa por métodos físicos.', ej: 'agua destilada, oro, sal, oxígeno' },
  { id: 'mezcla', n: 'Mezcla', x: 450, y: 110, t: 'Dos o más sustancias juntas, sin unirse químicamente. Se separan por métodos físicos.', ej: 'tinto, ensalada, aire, sancocho' },
  { id: 'elemento', n: 'Elemento', x: 75, y: 190, t: 'Formado por una sola clase de átomos. Están en la tabla periódica.', ej: 'oro (Au), hierro (Fe), oxígeno (O₂), carbono (C)' },
  { id: 'compuesto', n: 'Compuesto', x: 225, y: 190, t: 'Dos o más elementos unidos químicamente en proporción fija. Se separa solo con una reacción.', ej: 'agua (H₂O), sal (NaCl), azúcar, CO₂' },
  { id: 'homo', n: 'Homogénea', x: 375, y: 190, t: 'No se distinguen sus partes: se ve de un solo aspecto. También se llama solución.', ej: 'agua con sal, tinto colado, aire, gaseosa sin burbujas' },
  { id: 'hetero', n: 'Heterogénea', x: 525, y: 190, t: 'Se distinguen sus partes a simple vista.', ej: 'agua con aceite, arena con piedras, ensalada, sancocho' },
]
const LINEAS = [['materia', 'pura'], ['materia', 'mezcla'], ['pura', 'elemento'], ['pura', 'compuesto'], ['mezcla', 'homo'], ['mezcla', 'hetero']]

export default function ArbolMateria() {
  const [sel, setSel] = useState('materia')
  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      const k = Number(e.key)
      if (k >= 1 && k <= NODOS.length) setSel(NODOS[k - 1].id)
    }
    window.addEventListener('keydown', tecla)
    return () => window.removeEventListener('keydown', tecla)
  }, [])
  const act = NODOS.find((n) => n.id === sel) ?? NODOS[0]
  const pos = (id: string) => NODOS.find((n) => n.id === id)!
  return (
    <div data-diagrama className="flex flex-col items-center gap-3">
      <svg viewBox="0 0 600 230" role="img" aria-label="Árbol de clasificación de la materia" className="w-full max-w-3xl">
        {LINEAS.map(([a, b]) => <line key={b} x1={pos(a).x} y1={pos(a).y + 16} x2={pos(b).x} y2={pos(b).y - 16} stroke="#999" strokeWidth="2" />)}
        {NODOS.map((n, k) => (
          <g key={n.id} onClick={() => setSel(n.id)} style={{ cursor: 'pointer' }} role="button" aria-label={n.n}>
            <rect x={n.x - 68} y={n.y - 16} width="136" height="32" rx="10" fill={sel === n.id ? 'var(--acento, #2f6db3)' : '#fff'} stroke="#555" strokeWidth="2" />
            <text x={n.x} y={n.y + 5} textAnchor="middle" fontSize="14" fontWeight="800" fill={sel === n.id ? '#fff' : '#333'}>{k + 1}. {n.n}</text>
          </g>
        ))}
      </svg>
      <div aria-live="polite" className="w-full max-w-2xl rounded-2xl border-2 p-4">
        <div className="text-lg font-black">{act.n}</div>
        <p>{act.t}</p>
        <p className="mt-1 text-sm"><b>Ejemplos:</b> {act.ej}</p>
      </div>
      <p className="text-center text-sm opacity-80">Toca una caja o usa las teclas 1 a 7.</p>
    </div>
  )
}
