import { useEffect, useMemo, useState } from 'react'
import type { Bloque } from '../data/schema.ts'
import { registrarRespuesta } from '../lib/progreso.ts'

/** Pestaña «Comprueba»: las preguntas de esta ficha, con respuesta inmediata. Las teclas 1–4 eligen una opción. */
export default function Comprueba({ bloque }: { bloque: Bloque }) {
  const [elegidas, setElegidas] = useState<Record<string, number>>({})
  const qs = bloque.preguntas
  const [intento, setIntento] = useState(0)
  // orden mezclado de las opciones (orden[q.id][i] = índice original mostrado en la posición i),
  // para que la respuesta correcta no quede casi siempre de primera
  const orden = useMemo(
    () => Object.fromEntries(qs.map((q) => [q.id, mezclar(q.opciones.map((_, k) => k))])),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [bloque.id, intento],
  )
  const aciertos = qs.filter((q) => elegidas[q.id] === q.correcta).length
  const respondidas = qs.filter((q) => elegidas[q.id] !== undefined).length

  const elegir = (id: string, k: number, correcta: number) => {
    if (elegidas[id] !== undefined) return
    setElegidas((e) => ({ ...e, [id]: k }))
    registrarRespuesta(id, k === correcta)
  }

  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || !/^[1-9]$/.test(e.key)) return
      const t = e.target as HTMLElement | null
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return
      const q = qs.find((x) => elegidas[x.id] === undefined)
      const i = Number(e.key) - 1
      if (!q || i >= q.opciones.length) return
      e.preventDefault()
      elegir(q.id, orden[q.id]?.[i] ?? i, q.correcta)
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elegidas, bloque.id, orden])

  if (qs.length === 0) return <p className="text-[var(--suave)]">Esta ficha no tiene preguntas todavía.</p>

  return (
    <div className="space-y-5">
      <p className="text-[var(--suave)]">
        Responde sin mirar la ficha. Con las teclas 1 a 4 eliges la opción de la primera pregunta sin responder.
      </p>
      {qs.map((q, n) => {
        const e = elegidas[q.id]
        const listo = e !== undefined
        return (
          <fieldset key={q.id} className="rounded-xl border border-[var(--linea)] p-3">
            <legend className="px-1 text-xs text-[var(--suave)]">
              Pregunta {n + 1} de {qs.length}
            </legend>
            <p className="font-semibold">{q.enunciado}</p>
            <div className="mt-2 space-y-2">
              {(orden[q.id] ?? q.opciones.map((_, k) => k)).map((k, i) => {
                const o = q.opciones[k]
                let estilo = 'border-[var(--linea)] enabled:hover:border-[var(--acento)]'
                if (listo && k === q.correcta) estilo = 'border-emerald-600 bg-emerald-50 dark:bg-emerald-900/30'
                else if (listo && k === e) estilo = 'border-rose-600 bg-rose-50 dark:bg-rose-900/30'
                return (
                  <button
                    key={k}
                    type="button"
                    disabled={listo}
                    onClick={() => elegir(q.id, k, q.correcta)}
                    className={`block min-h-11 w-full rounded-xl border px-4 py-2 text-left ${estilo}`}
                  >
                    <span className="mr-2 font-semibold text-[var(--suave)]">{i + 1}.</span>
                    {o}
                  </button>
                )
              })}
            </div>
            {listo && (
              <div role="status" className="mt-2">
                <p className="font-semibold">{e === q.correcta ? 'Correcto' : 'No es esa'}</p>
                <p>{q.explicacion}</p>
              </div>
            )}
          </fieldset>
        )
      })}
      {respondidas === qs.length && (
        <div role="status" className="flex flex-wrap items-center gap-3">
          <p className="font-semibold">
            {aciertos} de {qs.length} correctas
          </p>
          <button
            type="button"
            onClick={() => {
              setElegidas({})
              setIntento((n) => n + 1)
            }}
            className="min-h-11 rounded-full border border-[var(--acento)] px-4 font-semibold text-[var(--acento)]"
          >
            Intentar de nuevo
          </button>
        </div>
      )}
    </div>
  )
}

function mezclar<T>(a: T[]): T[] {
  const b = [...a]
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[b[i], b[j]] = [b[j], b[i]]
  }
  return b
}
