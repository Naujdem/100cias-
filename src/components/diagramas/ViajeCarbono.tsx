import { useEffect, useState } from 'react'

// Explora del ciclo del carbono: el estudiante es un átomo de carbono y elige por dónde seguir (teclas 1–3 o tocando).
// Abajo queda la ruta recorrida. R vuelve a empezar. Tiempos de permanencia aproximados, para comparar.

type Id = 'aire' | 'planta' | 'animal' | 'suelo' | 'oceano' | 'fosil'
const LUGARES: Record<Id, { n: string; ic: string; x: number; y: number; tiempo: string }> = {
  aire: { n: 'Atmósfera', ic: '🌫️', x: 300, y: 50, tiempo: 'unos pocos años' },
  planta: { n: 'Planta', ic: '🌳', x: 120, y: 170, tiempo: 'de meses a siglos' },
  animal: { n: 'Animal', ic: '🐄', x: 300, y: 200, tiempo: 'de días a años' },
  suelo: { n: 'Suelo', ic: '🍄', x: 160, y: 300, tiempo: 'décadas' },
  oceano: { n: 'Océano', ic: '🌊', x: 490, y: 180, tiempo: 'cientos de años' },
  fosil: { n: 'Rocas y combustibles fósiles', ic: '🪨', x: 430, y: 310, tiempo: 'millones de años' },
}
const CAMINOS: Record<Id, { a: Id; por: string }[]> = {
  aire: [{ a: 'planta', por: 'Fotosíntesis' }, { a: 'oceano', por: 'Me disuelvo en el mar' }],
  planta: [{ a: 'aire', por: 'Respiración de la planta' }, { a: 'animal', por: 'Un animal me come' }, { a: 'suelo', por: 'Caigo con una hoja' }],
  animal: [{ a: 'aire', por: 'Respiración' }, { a: 'suelo', por: 'Excremento o muerte' }],
  suelo: [{ a: 'aire', por: 'Descomposición' }, { a: 'fosil', por: 'Quedo enterrado mucho tiempo' }],
  oceano: [{ a: 'aire', por: 'Vuelvo al aire' }, { a: 'fosil', por: 'Formo una concha y luego roca' }],
  fosil: [{ a: 'aire', por: 'Combustión: alguien quema carbón o petróleo' }],
}

export default function ViajeCarbono() {
  const [ruta, setRuta] = useState<Id[]>(['aire'])
  const aqui = ruta[ruta.length - 1]
  const opciones = CAMINOS[aqui]

  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      const t = e.key.toLowerCase()
      if (t === 'r') setRuta(['aire'])
      const n = Number(t) - 1
      if (n >= 0 && n < 3) setRuta((r) => { const op = CAMINOS[r[r.length - 1]][n]; return op ? [...r, op.a] : r })
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [])

  const L = LUGARES[aqui]
  return (
    <div data-diagrama className="flex flex-col items-center gap-3">
      <svg viewBox="0 0 600 360" role="img" aria-label={`Viaje de un átomo de carbono: ahora en ${L.n}`} className="mx-auto w-full max-w-3xl">
        {(Object.keys(CAMINOS) as Id[]).flatMap((de) => CAMINOS[de].map(({ a }) => {
          const p = LUGARES[de]
          const q = LUGARES[a]
          const activo = de === aqui
          return <line key={de + a} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke={activo ? '#3f9a5a' : '#ddd'} strokeWidth={activo ? 3 : 2} strokeDasharray={activo ? '8 5' : undefined} />
        }))}
        {(Object.keys(LUGARES) as Id[]).map((id) => {
          const l = LUGARES[id]
          const visitas = ruta.filter((r) => r === id).length
          return (
            <g key={id}>
              <circle cx={l.x} cy={l.y} r="34" fill={id === aqui ? '#fff6d6' : '#fff'} stroke={id === aqui ? '#e0a800' : '#999'} strokeWidth="3" />
              <text x={l.x} y={l.y + 10} textAnchor="middle" fontSize="28">{l.ic}</text>
              <text x={l.x} y={l.y + 52} textAnchor="middle" fontSize="13" fontWeight="800" fill="#3a3a3a">{l.n}</text>
              {visitas > 0 && <text x={l.x + 30} y={l.y - 24} textAnchor="middle" fontSize="12" fontWeight="800" fill="#8a5aa8">×{visitas}</text>}
            </g>
          )
        })}
        <g style={{ transition: 'transform 0.8s cubic-bezier(.45,.05,.25,1)', transform: `translate(${L.x + 26}px, ${L.y + 22}px)` }}>
          <circle r="12" fill="#3a3a3a" stroke="#fff" strokeWidth="2" />
          <text y="4" textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff">C</text>
        </g>
      </svg>
      <p aria-live="polite" className="text-center text-lg">
        Estás en <strong>{L.n}</strong>. Aquí un átomo puede quedarse <strong>{L.tiempo}</strong>. ¿Por dónde sigues?
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {opciones.map((op, k) => (
          <button key={op.a} onClick={() => setRuta((r) => [...r, op.a])} className="rounded-xl border-2 border-[#3f9a5a] bg-white px-4 py-2 font-bold text-[#2e6e42] hover:bg-[#eef7f0]">
            <span className="mr-2 rounded bg-[#3f9a5a] px-1.5 text-white">{k + 1}</span>{op.por} → {LUGARES[op.a].ic}
          </button>
        ))}
        <button onClick={() => setRuta(['aire'])} className="rounded-xl border-2 border-gray-300 bg-white px-4 py-2 font-bold text-gray-600">R · Empezar otra vez</button>
      </div>
      <p className="max-w-3xl text-center text-sm text-gray-600">
        Tu viaje ({ruta.length - 1} {ruta.length === 2 ? 'paso' : 'pasos'}): {ruta.map((r) => LUGARES[r].ic).join(' → ')}
      </p>
    </div>
  )
}
