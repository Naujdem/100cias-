import { useState } from 'react'

// Red trófica de un bosque andino: se toca una especie para quitarla y se ve qué otras pierden alimento y cuáles
// tienen menos depredadores. Las flechas van de quien es comido a quien come.

const SERES = [
  { id: 'plantas', n: 'Plantas', ic: '🌿', x: 380, y: 305 },
  { id: 'frutos', n: 'Frutos', ic: '🍒', x: 130, y: 305 },
  { id: 'insectos', n: 'Insectos', ic: '🐛', x: 470, y: 240 },
  { id: 'raton', n: 'Ratón', ic: '🐁', x: 250, y: 230 },
  { id: 'aves', n: 'Aves', ic: '🐦', x: 70, y: 150 },
  { id: 'rana', n: 'Rana', ic: '🐸', x: 540, y: 150 },
  { id: 'serpiente', n: 'Serpiente', ic: '🐍', x: 390, y: 120 },
  { id: 'zorro', n: 'Zorro', ic: '🦊', x: 160, y: 60 },
  { id: 'aguila', n: 'Águila', ic: '🦅', x: 300, y: 30 },
]
/** [presa, depredador] */
const COME: [string, string][] = [
  ['plantas', 'insectos'], ['plantas', 'raton'], ['frutos', 'aves'], ['frutos', 'raton'], ['frutos', 'zorro'],
  ['insectos', 'aves'], ['insectos', 'rana'], ['raton', 'serpiente'], ['raton', 'zorro'], ['raton', 'aguila'],
  ['rana', 'serpiente'], ['aves', 'zorro'], ['serpiente', 'aguila'], ['aves', 'aguila'],
]
const nombre = (id: string) => SERES.find((s) => s.id === id)!.n

export default function RedTrofica() {
  const [fuera, setFuera] = useState<string | null>(null)
  const sinComida = fuera ? COME.filter(([p]) => p === fuera).map(([, d]) => d) : []
  const sinDepredador = fuera ? COME.filter(([, d]) => d === fuera).map(([p]) => p) : []
  return (
    <div data-diagrama className="flex flex-col items-center gap-2">
      <svg viewBox="0 0 600 360" role="img" aria-label="Red trófica de un bosque andino" className="mx-auto w-full max-w-3xl">
        <defs><marker id="rt-fl" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#999" /></marker></defs>
        {COME.map(([p, d]) => {
          const a = SERES.find((s) => s.id === p)!
          const b = SERES.find((s) => s.id === d)!
          const dx = b.x - a.x
          const dy = b.y - a.y
          const l = Math.hypot(dx, dy)
          const roto = fuera === p || fuera === d
          return <line key={p + d} x1={a.x + (dx / l) * 28} y1={a.y + (dy / l) * 28} x2={b.x - (dx / l) * 30} y2={b.y - (dy / l) * 30}
            stroke={roto ? '#e3b0b0' : '#999'} strokeWidth="2.5" strokeDasharray={roto ? '5 5' : undefined} markerEnd="url(#rt-fl)" />
        })}
        {SERES.map((s) => {
          const quitado = fuera === s.id
          const hambre = sinComida.includes(s.id)
          const crece = sinDepredador.includes(s.id)
          return (
            <g key={s.id} onClick={() => setFuera(quitado ? null : s.id)} style={{ cursor: 'pointer' }} role="button" aria-label={`${quitado ? 'Devolver' : 'Quitar'} ${s.n}`}>
              <circle cx={s.x} cy={s.y} r="26" fill={quitado ? '#eee' : hambre ? '#f8dada' : crece ? '#dff0d8' : '#fff'} stroke={quitado ? '#bbb' : hambre ? '#c43c3c' : crece ? '#3f9a5a' : '#888'} strokeWidth="3" />
              <text x={s.x} y={s.y + 9} textAnchor="middle" fontSize="24" opacity={quitado ? 0.3 : 1}>{s.ic}</text>
              <text x={s.x} y={s.y + 44} textAnchor="middle" fontSize="13" fontWeight="800" fill="#3a3a3a">{s.n}</text>
            </g>
          )
        })}
      </svg>
      <p aria-live="polite" className="max-w-2xl text-center text-lg">
        {fuera
          ? <>Sin <strong>{nombre(fuera)}</strong>: {sinComida.length ? <>pierden alimento <strong className="text-[#c43c3c]">{sinComida.map(nombre).join(', ')}</strong></> : 'nadie pierde alimento'}{sinDepredador.length ? <>; tienen menos depredadores <strong className="text-[#3f9a5a]">{sinDepredador.map(nombre).join(', ')}</strong></> : ''}.</>
          : 'Toca una especie para quitarla de la red y ver qué pasa con las demás.'}
      </p>
    </div>
  )
}
