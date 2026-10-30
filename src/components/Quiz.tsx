import { useMemo, useState } from 'react'
import type { Bloque, Pregunta } from '../data/schema.ts'
import { guardarQuiz, registrarRespuesta, usarProgreso } from '../lib/progreso.ts'

interface Item {
  p: Pregunta
  /** orden mezclado: orden[i] = índice original de la opción mostrada en la posición i */
  orden: number[]
}

function mezclar<T>(a: T[]): T[] {
  const r = [...a]
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[r[i], r[j]] = [r[j], r[i]]
  }
  return r
}

export default function Quiz({ bloques, temaId, onIr }: { bloques: Bloque[]; temaId: string; onIr: (id: string) => void }) {
  const progreso = usarProgreso()
  const mejor = progreso.quiz[temaId]
  const [ronda, setRonda] = useState(0)
  const [i, setI] = useState(0)
  const [elegida, setElegida] = useState<number | null>(null)
  const [aciertos, setAciertos] = useState(0)
  const [falladas, setFalladas] = useState<string[]>([])

  // Solo entran las preguntas de los bloques activos.
  const clave = bloques.map((b) => b.id).join('|')
  const items: Item[] = useMemo(
    () =>
      mezclar(bloques.flatMap((b) => b.preguntas)).map((p) => ({
        p,
        orden: mezclar(p.opciones.map((_, k) => k)),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [clave, ronda],
  )

  const reiniciar = () => {
    setRonda((r) => r + 1)
    setI(0)
    setElegida(null)
    setAciertos(0)
    setFalladas([])
  }

  if (items.length === 0) return <p className="text-sm text-[var(--suave)]">No hay preguntas para el contenido activo.</p>

  if (i >= items.length) {
    const porRepasar = bloques.filter((b) => b.preguntas.some((q) => falladas.includes(q.id)))
    return (
      <div className="rounded-2xl border border-[var(--linea)] bg-[var(--tarjeta)] p-5 text-center">
        <p className="text-lg font-semibold">
          {aciertos} de {items.length} correctas
        </p>
        {mejor && <p className="mt-1 text-sm text-[var(--suave)]">Tu mejor resultado: {mejor.mejor} de {mejor.total}</p>}
        {porRepasar.length > 0 && (
          <div className="mt-3 text-sm">
            <p className="font-semibold">Repasa:</p>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              {porRepasar.map((b) => (
                <button key={b.id} type="button" onClick={() => onIr(b.id)} className="min-h-11 rounded-full border border-[var(--acento)] px-4 font-semibold text-[var(--acento)]">
                  {b.titulo}
                </button>
              ))}
            </div>
          </div>
        )}
        <button
          onClick={reiniciar}
          className="mt-3 min-h-11 rounded-xl bg-[var(--acento)] px-5 font-semibold text-[var(--fondo)]"
        >
          Intentar de nuevo
        </button>
      </div>
    )
  }

  const { p, orden } = items[i]
  const respondida = elegida !== null
  const acerto = respondida && orden[elegida] === p.correcta

  const elegir = (pos: number) => {
    if (respondida) return
    setElegida(pos)
    const ok = orden[pos] === p.correcta
    registrarRespuesta(p.id, ok)
    if (ok) setAciertos((a) => a + 1)
    else setFalladas((f) => [...f, p.id])
  }

  return (
    <div className="rounded-2xl border border-[var(--linea)] bg-[var(--tarjeta)] p-5">
      <p className="text-xs text-[var(--suave)]">
        Pregunta {i + 1} de {items.length}
      </p>
      <p className="mt-1 text-base font-semibold">{p.enunciado}</p>
      <div className="mt-3 space-y-2">
        {orden.map((idxOriginal, pos) => {
          const esCorrecta = idxOriginal === p.correcta
          const esElegida = elegida === pos
          let estilo = 'border-[var(--linea)] hover:border-[var(--acento)]'
          if (respondida && esCorrecta) estilo = 'border-emerald-600 bg-emerald-50 dark:bg-emerald-900/30'
          else if (respondida && esElegida) estilo = 'border-rose-600 bg-rose-50 dark:bg-rose-900/30'
          return (
            <button
              key={idxOriginal}
              type="button"
              disabled={respondida}
              onClick={() => elegir(pos)}
              className={`block min-h-11 w-full rounded-xl border px-4 py-2 text-left text-sm ${estilo}`}
            >
              {p.opciones[idxOriginal]}
            </button>
          )
        })}
      </div>

      {respondida && (
        <div role="status" className="mt-4 space-y-3 text-sm">
          <p className="font-semibold">{acerto ? 'Correcto' : 'No es esa'}</p>
          <p>{p.explicacion}</p>
          <button
            onClick={() => {
              if (i + 1 === items.length) guardarQuiz(temaId, aciertos, items.length)
              setI(i + 1)
              setElegida(null)
            }}
            className="min-h-11 rounded-xl bg-[var(--acento)] px-5 font-semibold text-[var(--fondo)]"
          >
            {i + 1 === items.length ? 'Ver resultado' : 'Siguiente'}
          </button>
        </div>
      )}
    </div>
  )
}
