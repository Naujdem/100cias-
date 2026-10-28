import { useEffect, useRef, useState } from 'react'
import type { Bloque } from '../data/schema.ts'
import { guardar, leer } from '../lib/almacen.ts'
import { usePantallaCompleta } from '../lib/usePantallaCompleta.ts'
import DetalleBloque from './DetalleBloque.tsx'
import { VISTAS, VISTA_INICIAL } from './linea/vistas.ts'

const CLAVE_VISTA = 'cien:vista-linea'

function IconoPantalla({ completa }: { completa: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {completa ? (
        <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />
      ) : (
        <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
      )}
    </svg>
  )
}

export default function LineaTiempo({ bloques }: { bloques: Bloque[] }) {
  const [abierto, setAbierto] = useState<string | null>(null)
  const [vistaId, setVistaId] = useState(() => {
    const v = leer<string>(CLAVE_VISTA, VISTA_INICIAL)
    return VISTAS.some((x) => x.id === v) ? v : VISTA_INICIAL
  })
  const carril = useRef<HTMLDivElement>(null)
  const raiz = useRef<HTMLDivElement>(null)
  const pantalla = usePantallaCompleta(raiz)
  const ordenados = [...bloques].sort((a, b) => a.anio - b.anio)
  const vista = VISTAS.find((v) => v.id === vistaId) ?? VISTAS[0]

  // Si el bloque abierto se desactiva, se cierra el detalle.
  useEffect(() => {
    if (abierto && !bloques.some((b) => b.id === abierto)) setAbierto(null)
  }, [bloques, abierto])

  // Mientras hay recuadro o pantalla completa, la página de fondo no se desplaza.
  useEffect(() => {
    if (!abierto && !pantalla.activa) return
    const previo = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previo
    }
  }, [abierto, pantalla.activa])

  const indice = ordenados.findIndex((b) => b.id === abierto)

  const nodo = (id: string | null) => (id ? raiz.current?.querySelector<HTMLElement>(`[data-hito="${id}"]`) : null)
  const llevarA = (el: HTMLElement | null | undefined) => {
    if (!el) return
    el.focus({ preventScroll: true })
    el.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
  }
  const cerrar = () => {
    const id = abierto
    setAbierto(null)
    requestAnimationFrame(() => llevarA(nodo(id)))
  }

  // Al pasar de un hito a otro con el recuadro abierto, la línea de fondo sigue al hito actual.
  useEffect(() => {
    if (abierto) nodo(abierto)?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [abierto])

  // Teclado en la línea de tiempo (recuadro cerrado): ← → Inicio Fin mueven el foco entre hitos,
  // Enter o Espacio abren el hito enfocado y F activa la pantalla completa.
  useEffect(() => {
    if (abierto) return
    const alTeclear = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      const t = e.target as HTMLElement | null
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return
      const dentro = !!raiz.current?.contains(document.activeElement)
      if (!pantalla.activa && !dentro) return

      if (e.key.toLowerCase() === 'f') {
        e.preventDefault()
        if (pantalla.activa) pantalla.salir()
        else pantalla.entrar()
        return
      }
      if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) return
      const nodos = [...(raiz.current?.querySelectorAll<HTMLElement>('[data-hito]') ?? [])]
      if (!nodos.length) return
      e.preventDefault()
      const actual = nodos.indexOf(document.activeElement as HTMLElement)
      let i = actual
      if (e.key === 'ArrowRight') i = actual < 0 ? 0 : Math.min(nodos.length - 1, actual + 1)
      else if (e.key === 'ArrowLeft') i = actual < 0 ? 0 : Math.max(0, actual - 1)
      else if (e.key === 'Home') i = 0
      else i = nodos.length - 1
      llevarA(nodos[i])
    }
    window.addEventListener('keydown', alTeclear)
    return () => window.removeEventListener('keydown', alTeclear)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [abierto, pantalla.activa])

  const mover = (dir: 1 | -1) => carril.current?.scrollBy({ left: dir * 280, behavior: 'smooth' })
  const elegirVista = (id: string) => {
    setVistaId(id)
    guardar(CLAVE_VISTA, id)
  }
  const seleccionado = ordenados.find((b) => b.id === abierto)
  const Vista = vista.Componente

  return (
    <div
      ref={raiz}
      className={pantalla.activa ? 'fixed inset-0 z-40 overflow-auto bg-[var(--fondo)] p-4 sm:p-6' : undefined}
    >
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
          <p className="hidden text-sm text-[var(--suave)] lg:block">← → moverse · Enter abrir · F pantalla completa</p>
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
          <button
            type="button"
            onClick={pantalla.activa ? pantalla.salir : pantalla.entrar}
            aria-pressed={pantalla.activa}
            aria-label={pantalla.activa ? 'Salir de pantalla completa' : 'Pantalla completa'}
            title={pantalla.activa ? 'Salir de pantalla completa' : 'Pantalla completa'}
            className="flex h-11 items-center gap-2 rounded-full border border-[var(--linea)] bg-[var(--tarjeta)] px-4 text-sm font-medium"
          >
            <IconoPantalla completa={pantalla.activa} />
            <span className="hidden sm:inline">{pantalla.activa ? 'Salir' : 'Pantalla completa'}</span>
          </button>
        </div>
      </div>

      <Vista
        bloques={ordenados}
        abierto={abierto}
        onSeleccionar={(id) => setAbierto(abierto === id ? null : id)}
        carril={carril}
        completa={pantalla.activa}
      />

      {seleccionado && (
        <DetalleBloque
          key={seleccionado.id}
          bloque={seleccionado}
          onCerrar={cerrar}
          posicion={{ actual: indice + 1, total: ordenados.length }}
          onAnterior={indice > 0 ? () => setAbierto(ordenados[indice - 1].id) : undefined}
          onSiguiente={indice < ordenados.length - 1 ? () => setAbierto(ordenados[indice + 1].id) : undefined}
        />
      )}
    </div>
  )
}
