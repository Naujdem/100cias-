import { useEffect, useState } from 'react'

// PCR: cada ciclo duplica las copias. Se avanza con el botón o con la flecha derecha; se ven los puntos (hasta
// donde caben) y el número total, para comparar con lo que hace falta para un examen.

const MAX = 35

export default function PcrCiclos() {
  const [n, setN] = useState(0)
  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if (e.key === '+' || e.key === 'Enter') setN((v) => Math.min(MAX, v + 1))
      if (e.key === '-') setN((v) => Math.max(0, v - 1))
    }
    window.addEventListener('keydown', tecla)
    return () => window.removeEventListener('keydown', tecla)
  }, [])
  const copias = 2 ** n
  const puntos = Math.min(copias, 256)
  const minutos = n * 3
  return (
    <div data-diagrama className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button type="button" onClick={() => setN((v) => Math.max(0, v - 1))} className="min-h-12 min-w-12 rounded-full border text-2xl font-black">−</button>
        <span className="min-w-40 text-center text-2xl font-black">Ciclo {n}</span>
        <button type="button" onClick={() => setN((v) => Math.min(MAX, v + 1))} className="min-h-12 rounded-full bg-[var(--acento)] px-5 text-lg font-bold text-[var(--sobre-acento)]">+ 1 ciclo</button>
        <button type="button" onClick={() => setN(30)} className="min-h-12 rounded-full border px-4 text-sm font-semibold">Ir a 30</button>
        <button type="button" onClick={() => setN(0)} className="min-h-12 rounded-full border px-4 text-sm font-semibold">↺</button>
      </div>
      <div className="grid max-w-xl gap-1" style={{ gridTemplateColumns: 'repeat(16, minmax(0, 1fr))' }} aria-hidden>
        {Array.from({ length: puntos }, (_, k) => <span key={k} className="h-3 w-5 rounded-sm" style={{ background: k === 0 ? '#3f6fb8' : '#e08a2e' }} />)}
      </div>
      <p aria-live="polite" className="text-center text-lg">
        <strong>{copias.toLocaleString('es-CO')}</strong> {copias === 1 ? 'copia' : 'copias'} del tramo de ADN
        {copias > 256 && ' (se dibujan solo 256)'} · unos {minutos} minutos
      </p>
      <p className="text-center text-sm opacity-80">Con unos 30 ciclos (1 a 2 horas) hay ADN de sobra para analizarlo.</p>
    </div>
  )
}
