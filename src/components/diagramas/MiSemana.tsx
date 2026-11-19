import { useEffect, useState } from 'react'

// Mis hábitos: cinco barras (1–5 eligen, A/D cambian) y un muñeco que muestra energía, ánimo y atención.
// Las metas son recomendaciones generales para adolescentes (OMS y Ministerio de Salud); no es una evaluación personal.

const HABITOS = [
  { id: 'sueno', ic: '😴', n: 'Horas de sueño', min: 4, max: 12, paso: 1, meta: [8, 10], u: 'h' },
  { id: 'mover', ic: '🏃', n: 'Minutos de actividad física al día', min: 0, max: 120, paso: 10, meta: [60, 120], u: 'min' },
  { id: 'agua', ic: '💧', n: 'Vasos de agua al día', min: 0, max: 10, paso: 1, meta: [6, 10], u: 'vasos' },
  { id: 'fruta', ic: '🍎', n: 'Porciones de frutas y verduras', min: 0, max: 7, paso: 1, meta: [5, 7], u: '' },
  { id: 'pantalla', ic: '📱', n: 'Horas de pantalla por diversión', min: 0, max: 10, paso: 1, meta: [0, 2], u: 'h' },
] as const

export default function MiSemana() {
  const [v, setV] = useState<Record<string, number>>({ sueno: 7, mover: 30, agua: 4, fruta: 2, pantalla: 5 })
  const [sel, setSel] = useState(0)
  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      const t = e.key.toLowerCase()
      if (['1', '2', '3', '4', '5'].includes(t)) setSel(Number(t) - 1)
      const h = HABITOS[sel]
      if (t === 'd') setV((o) => ({ ...o, [h.id]: Math.min(h.max, o[h.id] + h.paso) }))
      if (t === 'a') setV((o) => ({ ...o, [h.id]: Math.max(h.min, o[h.id] - h.paso) }))
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  })

  const ok = (h: (typeof HABITOS)[number]) => v[h.id] >= h.meta[0] && v[h.id] <= h.meta[1]
  const puntos = HABITOS.filter(ok).length
  const cara = puntos >= 5 ? '😄' : puntos >= 3 ? '🙂' : puntos >= 2 ? '😐' : '😩'
  const consejo = HABITOS.find((h) => !ok(h))

  return (
    <div data-diagrama className="flex flex-col items-center gap-3">
      <div className="flex w-full max-w-3xl flex-wrap items-center justify-center gap-6">
        <div className="flex flex-col gap-2">
          {HABITOS.map((h, k) => (
            <button key={h.id} onClick={() => setSel(k)} className={`flex w-96 items-center gap-2 rounded-xl border-2 px-3 py-2 text-left ${sel === k ? 'border-[#2f6fc1] bg-[#eef4fb]' : 'border-gray-300 bg-white'}`}>
              <span className="rounded bg-gray-700 px-1.5 text-sm font-bold text-white">{k + 1}</span>
              <span className="text-xl">{h.ic}</span>
              <span className="flex-1 text-sm font-semibold">{h.n}</span>
              <span className={`font-black ${ok(h) ? 'text-[#3f9a5a]' : 'text-[#c43c3c]'}`}>{v[h.id]} {h.u}</span>
            </button>
          ))}
        </div>
        <div className="flex flex-col items-center">
          <div className="text-8xl">{cara}</div>
          <div className="mt-2 text-lg font-black">{puntos} de 5 hábitos en la meta</div>
          <div className="mt-1 text-sm text-gray-600">Energía, ánimo y atención en clase</div>
          <div className="mt-2 h-4 w-48 rounded-full bg-gray-200"><div className="h-4 rounded-full bg-[#3f9a5a]" style={{ width: `${puntos * 20}%`, transition: 'width 0.5s ease' }} /></div>
        </div>
      </div>
      <p aria-live="polite" className="max-w-3xl text-center text-lg">
        {consejo ? `${consejo.ic} ${consejo.n}: la recomendación para adolescentes es de ${consejo.meta[0]} a ${consejo.meta[1]} ${consejo.u}.` : '¡Todos los hábitos en la meta! Así el cuerpo funciona mejor.'}
      </p>
      <p className="max-w-3xl text-center text-sm text-gray-600">1–5: elegir el hábito · A/D: menos o más. Son recomendaciones generales, no una evaluación médica; cada persona es distinta.</p>
    </div>
  )
}
