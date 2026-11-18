import { useEffect, useState } from 'react'

// Separar en la fuente: aparece un residuo y se echa en la caneca con las teclas 1–4 o tocándola
// (blanca, negra, verde o punto de peligrosos). Al final se ve el puntaje y qué se separó mal. R vuelve a empezar.

type Caneca = 'blanca' | 'negra' | 'verde' | 'peligroso'
const CANECAS: { id: Caneca; n: string; fondo: string; texto: string; ic: string }[] = [
  { id: 'blanca', n: 'Blanca', fondo: '#f4f4f4', texto: '#3a3a3a', ic: '⚪' },
  { id: 'negra', n: 'Negra', fondo: '#2e2e2e', texto: '#fff', ic: '⚫' },
  { id: 'verde', n: 'Verde', fondo: '#3f9a5a', texto: '#fff', ic: '🟢' },
  { id: 'peligroso', n: 'Punto especial', fondo: '#e0a800', texto: '#3a3a3a', ic: '☢️' },
]
const RESIDUOS: { ic: string; n: string; va: Caneca; por: string }[] = [
  { ic: '🍾', n: 'Botella de vidrio limpia', va: 'blanca', por: 'Vidrio limpio: aprovechable.' },
  { ic: '🍌', n: 'Cáscara de banano', va: 'verde', por: 'Orgánico: va al compost.' },
  { ic: '🧻', n: 'Papel higiénico usado', va: 'negra', por: 'No se puede aprovechar.' },
  { ic: '🔋', n: 'Pila usada', va: 'peligroso', por: 'Tiene metales tóxicos.' },
  { ic: '🥫', n: 'Lata de atún lavada', va: 'blanca', por: 'Metal limpio: aprovechable.' },
  { ic: '🍕', n: 'Caja de pizza con grasa', va: 'negra', por: 'Cartón sucio: ya no se recicla.' },
  { ic: '☕', n: 'Borra de café', va: 'verde', por: 'Excelente para el compost.' },
  { ic: '💊', n: 'Medicamentos vencidos', va: 'peligroso', por: 'Van a puntos posconsumo.' },
  { ic: '📦', n: 'Caja de cartón seca', va: 'blanca', por: 'Cartón limpio y seco: aprovechable.' },
  { ic: '🧴', n: 'Envase de champú enjuagado', va: 'blanca', por: 'Plástico limpio.' },
  { ic: '🧽', n: 'Servilleta con comida', va: 'negra', por: 'Papel sucio: no aprovechable.' },
  { ic: '🥚', n: 'Cáscaras de huevo', va: 'verde', por: 'Orgánico: aporta calcio al compost.' },
  { ic: '💡', n: 'Bombillo ahorrador', va: 'peligroso', por: 'Tiene mercurio.' },
  { ic: '📰', n: 'Periódico seco', va: 'blanca', por: 'Papel limpio: aprovechable.' },
  { ic: '🍂', n: 'Hojas del jardín', va: 'verde', por: 'Material café para el compost.' },
]

export default function Canecas() {
  const [k, setK] = useState(0)
  const [errores, setErrores] = useState<number[]>([])
  const [ultimo, setUltimo] = useState<{ bien: boolean; por: string; va: Caneca } | null>(null)
  const fin = k >= RESIDUOS.length

  const echar = (c: Caneca) => {
    if (fin) return
    const r = RESIDUOS[k]
    const bien = c === r.va
    if (!bien) setErrores((e) => [...e, k])
    setUltimo({ bien, por: r.por, va: r.va })
    setK((v) => v + 1)
  }
  const reiniciar = () => { setK(0); setErrores([]); setUltimo(null) }

  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      const t = e.key.toLowerCase()
      const n = Number(t) - 1
      if (n >= 0 && n < 4) document.getElementById(`caneca-${n}`)?.click()
      if (t === 'r') document.getElementById('caneca-reiniciar')?.click()
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [])

  const r = RESIDUOS[Math.min(k, RESIDUOS.length - 1)]
  return (
    <div data-diagrama className="flex flex-col items-center gap-3">
      <div className="flex h-36 w-full max-w-3xl flex-col items-center justify-center rounded-2xl bg-[#eef3ea]">
        {fin ? (
          <>
            <div className="text-4xl font-black">{RESIDUOS.length - errores.length} / {RESIDUOS.length}</div>
            <div className="text-lg">{errores.length === 0 ? '¡Separaste todo bien!' : <>Revisa: {errores.map((e) => RESIDUOS[e].ic).join(' ')}</>}</div>
          </>
        ) : (
          <>
            <div className="text-6xl">{r.ic}</div>
            <div className="text-xl font-bold">{r.n}</div>
            <div className="text-sm text-gray-600">{k + 1} de {RESIDUOS.length}</div>
          </>
        )}
      </div>
      <p aria-live="polite" className="min-h-[1.75rem] text-center text-lg">
        {ultimo && (ultimo.bien ? <>✅ Bien. {ultimo.por}</> : <>❌ Iba en la <strong>{CANECAS.find((c) => c.id === ultimo.va)!.n.toLowerCase()}</strong>. {ultimo.por}</>)}
      </p>
      <div className="grid w-full max-w-3xl grid-cols-4 gap-2">
        {CANECAS.map((c, n) => (
          <button id={`caneca-${n}`} key={c.id} onClick={() => echar(c.id)} disabled={fin} style={{ background: c.fondo, color: c.texto }}
            className="flex flex-col items-center rounded-b-3xl rounded-t-lg border-4 border-gray-400 px-2 pb-4 pt-2 font-bold disabled:opacity-50">
            <span className="mb-1 rounded bg-gray-700 px-1.5 text-white">{n + 1}</span>
            <span className="text-2xl">{c.ic}</span>{c.n}
          </button>
        ))}
      </div>
      <button id="caneca-reiniciar" onClick={reiniciar} className="rounded-xl border-2 border-gray-300 bg-white px-4 py-1.5 font-bold text-gray-600">R · Empezar otra vez</button>
    </div>
  )
}
