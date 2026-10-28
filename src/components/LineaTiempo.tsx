import { useEffect, useRef, useState } from 'react'
import type { Bloque } from '../data/schema.ts'
import { guardar, leer } from '../lib/almacen.ts'
import DetalleBloque from './DetalleBloque.tsx'
import { VISTAS, VISTA_INICIAL } from './linea/vistas.ts'

const CLAVE_VISTA = 'cien:vista-linea'

export default function LineaTiempo({ bloques }: { bloques: Bloque[] }) {
  const [abierto, setAbierto] = useState<string | null>(null)
  const [vistaId, setVistaId] = useState(() => {
    const v = leer<string>(CLAVE_VISTA, VISTA_INICIAL)
    return VISTAS.some((x) => x.id === v) ? v : VISTA_INICIAL
  })
  const carril = useRef<HTMLDivElement>(null)
  const ordenados = [...bloques].sort((a, b) => a.anio - b.anio)
  const vista = VISTAS.find((v) => v.id === vistaId) ?? VISTAS[0]

  // Si el bloque abierto se desactiva, se cierra el detalle.
  useEffect(() => {
    if (abierto && !bloques.some((b) => b.id === abierto)) setAbierto(null)
  }, [bloques, abierto])

  const mover = (dir: 1 | -1) => carril.current?.scrollBy({ left: dir * 280, behavior: 'smooth' })
  const elegirVista = (id: string) => {
    setVistaId(id)
    guardar(CLAVE_VISTA, id)
  }
  const seleccionado = ordenados.find((b) => b.id === abierto)
  const Vista = vista.Componente

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div role="group" aria-label="Ver como" className="inline-flex rounded-full border border-[var(--linea)] bg-[var(--tarjeta)] p-1">
          {VISTAS.map((v) => (
            <button
              key={v.id}
              type="button"
              aria-pressed={v.id === vista.id}
              title={v.descripcion}
              onClick={() => elegirVista(v.id)}
              className={`min-h-10 rounded-full px-4 text-sm font-medium ${
                v.id === vista.id ? 'bg-[var(--acento)] text-[var(--fondo)]' : 'text-[var(--suave)]'
              }`}
            >
              {v.nombre}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <p className="hidden text-sm text-[var(--suave)] sm:block">Toca un hito para ver más.</p>
          <button
            type="button"
            onClick={() => mover(-1)}
            aria-label="Desplazar a la izquierda"
            className="h-11 w-11 rounded-full border border-[var(--linea)] bg-[var(--tarjeta)]"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => mover(1)}
            aria-label="Desplazar a la derecha"
            className="h-11 w-11 rounded-full border border-[var(--linea)] bg-[var(--tarjeta)]"
          >
            ›
          </button>
        </div>
      </div>

      <Vista
        bloques={ordenados}
        abierto={abierto}
        onSeleccionar={(id) => setAbierto(abierto === id ? null : id)}
        carril={carril}
      />

      {seleccionado && <DetalleBloque key={seleccionado.id} bloque={seleccionado} onCerrar={() => setAbierto(null)} />}
    </div>
  )
}
