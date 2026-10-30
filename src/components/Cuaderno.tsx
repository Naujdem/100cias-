import { useEffect, useState } from 'react'
import type { Cuaderno as DatosCuaderno } from '../data/schema.ts'
import { guardar, leer } from '../lib/almacen.ts'
import { useFlechas } from '../lib/flechasDiagrama.ts'

type Nivel = 'facil' | 'media' | 'avanzada'

const NIVELES: { id: Nivel; texto: string; ayuda: string }[] = [
  { id: 'facil', texto: 'Fácil', ayuda: 'Lo más importante' },
  { id: 'media', texto: 'Media', ayuda: 'Con detalles' },
  { id: 'avanzada', texto: 'Avanzada', ayuda: 'Con más detalles' },
]

const CLAVE = 'cien:nivel-cuaderno'

/**
 * Pestaña opcional «Para el cuaderno»: frases cortas para dictar o decir en clase, en tres niveles
 * que se suman. El nivel elegido se recuerda. ← → cambian de nivel.
 */
export default function Cuaderno({ cuaderno, titulo }: { cuaderno: DatosCuaderno; titulo: string }) {
  const [nivel, setNivel] = useState<Nivel>(() => {
    const v = leer<string>(CLAVE, 'media')
    return NIVELES.some((n) => n.id === v) ? (v as Nivel) : 'media'
  })
  const [copiado, setCopiado] = useState(false)
  const i = NIVELES.findIndex((n) => n.id === nivel)

  const elegir = (n: Nivel) => {
    setNivel(n)
    guardar(CLAVE, n)
  }

  useFlechas((dir) => {
    elegir(NIVELES[Math.max(0, Math.min(NIVELES.length - 1, i + dir))].id)
    return true
  })

  useEffect(() => {
    if (!copiado) return
    const t = setTimeout(() => setCopiado(false), 2000)
    return () => clearTimeout(t)
  }, [copiado])

  const lineas = [...cuaderno.facil, ...(i >= 1 ? cuaderno.media : []), ...(i >= 2 ? cuaderno.avanzada : [])]

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(`${titulo}\n${lineas.map((l) => `- ${l}`).join('\n')}`)
      setCopiado(true)
    } catch {
      /* sin permiso para copiar: no pasa nada */
    }
  }

  return (
    <div>
      <p className="text-[var(--suave)]">Frases cortas para dictar o decir en clase. Cada nivel suma al anterior.</p>
      <div role="group" aria-label="Nivel de lectura" className="mt-3 flex flex-wrap items-center gap-2">
        {NIVELES.map((n) => (
          <button
            key={n.id}
            type="button"
            aria-pressed={nivel === n.id}
            onClick={() => elegir(n.id)}
            className="min-h-10 rounded-full border border-[var(--acento)] px-3 text-sm font-semibold text-[var(--acento)] aria-pressed:bg-[var(--acento)] aria-pressed:text-white"
          >
            {n.texto}
          </button>
        ))}
        <span className="text-xs text-[var(--suave)]">{NIVELES[i].ayuda}</span>
      </div>

      <ul aria-live="polite" className="mt-4 ml-5 list-disc space-y-2 text-base leading-snug">
        {lineas.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="button" onClick={copiar} className="min-h-10 rounded-lg border border-[var(--linea)] px-4 text-sm font-semibold">
          Copiar texto
        </button>
        <span aria-live="polite" className="text-xs text-[var(--suave)]">
          {copiado ? 'Copiado' : '← → cambian el nivel'}
        </span>
      </div>
    </div>
  )
}
