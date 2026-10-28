import { useCallback, useRef, useState } from 'react'
import type { PointerEvent, ReactNode, WheelEvent, KeyboardEvent } from 'react'

interface Vista {
  k: number
  x: number
  y: number
}

const K_MAX = 8
const limitar = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

/**
 * Visor que permite acercar y mover cualquier contenido (imagen o SVG).
 * Botones +/−/restablecer, doble toque o doble clic, pellizco en pantallas táctiles,
 * Ctrl + rueda en computador, arrastre para moverse y teclas + − 0 y flechas.
 */
export default function VisorZoom({
  children,
  alto = 'h-[min(70dvh,34rem)]',
  etiqueta,
}: {
  children: ReactNode
  /** clase de Tailwind con el alto del visor */
  alto?: string
  etiqueta: string
}) {
  const caja = useRef<HTMLDivElement>(null)
  const [v, setV] = useState<Vista>({ k: 1, x: 0, y: 0 })
  const punteros = useRef(new Map<number, { x: number; y: number }>())
  const gesto = useRef({ dist: 0, movido: 0 })

  const ajustar = useCallback((n: Vista): Vista => {
    const r = caja.current?.getBoundingClientRect()
    const w = r?.width ?? 0
    const h = r?.height ?? 0
    const k = limitar(n.k, 1, K_MAX)
    return { k, x: limitar(n.x, w - w * k, 0), y: limitar(n.y, h - h * k, 0) }
  }, [])

  /** Cambia el zoom manteniendo fijo el punto (cx, cy) relativo a la caja. */
  const zoomEn = useCallback(
    (factor: number, cx?: number, cy?: number) => {
      const r = caja.current?.getBoundingClientRect()
      const px = cx ?? (r?.width ?? 0) / 2
      const py = cy ?? (r?.height ?? 0) / 2
      setV((a) => {
        const k = limitar(a.k * factor, 1, K_MAX)
        const f = k / a.k
        return ajustar({ k, x: px - (px - a.x) * f, y: py - (py - a.y) * f })
      })
    },
    [ajustar],
  )

  const relativo = (e: { clientX: number; clientY: number }) => {
    const r = caja.current!.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top }
  }

  const alPresionar = (e: PointerEvent<HTMLDivElement>) => {
    gesto.current.movido = 0
    if ((e.target as HTMLElement).closest('[data-control]')) return
    punteros.current.set(e.pointerId, relativo(e))
    if (punteros.current.size === 2) {
      const [a, b] = [...punteros.current.values()]
      gesto.current.dist = Math.hypot(a.x - b.x, a.y - b.y)
    }
  }

  const alMover = (e: PointerEvent<HTMLDivElement>) => {
    const previo = punteros.current.get(e.pointerId)
    if (!previo) return
    const actual = relativo(e)
    punteros.current.set(e.pointerId, actual)

    if (punteros.current.size === 2) {
      const [a, b] = [...punteros.current.values()]
      const dist = Math.hypot(a.x - b.x, a.y - b.y)
      if (gesto.current.dist > 0) zoomEn(dist / gesto.current.dist, (a.x + b.x) / 2, (a.y + b.y) / 2)
      gesto.current.dist = dist
      gesto.current.movido = 99
      return
    }
    const dx = actual.x - previo.x
    const dy = actual.y - previo.y
    gesto.current.movido += Math.abs(dx) + Math.abs(dy)
    // Solo se captura el puntero al arrastrar de verdad; así los toques simples llegan a los puntos tocables.
    if (gesto.current.movido > 6 && !caja.current?.hasPointerCapture?.(e.pointerId)) caja.current?.setPointerCapture?.(e.pointerId)
    if (v.k > 1) setV((a) => ajustar({ ...a, x: a.x + dx, y: a.y + dy }))
  }

  const alSoltar = (e: PointerEvent<HTMLDivElement>) => {
    punteros.current.delete(e.pointerId)
    gesto.current.dist = 0
  }

  const alRodar = (e: WheelEvent<HTMLDivElement>) => {
    if (!e.ctrlKey && !e.metaKey) return // sin Ctrl, la rueda sigue desplazando la página
    e.preventDefault()
    const p = relativo(e)
    zoomEn(e.deltaY < 0 ? 1.2 : 1 / 1.2, p.x, p.y)
  }

  const alTeclear = (e: KeyboardEvent<HTMLDivElement>) => {
    const paso = 40
    if (e.key === '+' || e.key === '=') zoomEn(1.3)
    else if (e.key === '-') zoomEn(1 / 1.3)
    else if (e.key === '0') setV({ k: 1, x: 0, y: 0 })
    else if (v.k > 1 && e.key.startsWith('Arrow')) {
      e.preventDefault()
      const d = { ArrowLeft: [paso, 0], ArrowRight: [-paso, 0], ArrowUp: [0, paso], ArrowDown: [0, -paso] }[e.key]
      if (d) setV((a) => ajustar({ ...a, x: a.x + d[0], y: a.y + d[1] }))
    } else return
    e.stopPropagation()
  }

  const alDobleClic = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('[data-control]')) return
    if (v.k > 1) setV({ k: 1, x: 0, y: 0 })
    else {
      const p = relativo(e)
      zoomEn(2.5, p.x, p.y)
    }
  }

  const boton =
    'flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-lg font-bold text-[#2b1d08] shadow ring-1 ring-black/10 disabled:opacity-40'

  return (
    <div
      ref={caja}
      role="group"
      aria-label={`${etiqueta}. Visor con zoom: teclas más, menos y cero; flechas para mover`}
      tabIndex={0}
      onPointerDown={alPresionar}
      onPointerMove={alMover}
      onPointerUp={alSoltar}
      onPointerCancel={alSoltar}
      onWheel={alRodar}
      onKeyDown={alTeclear}
      onDoubleClick={alDobleClic}
      // si se arrastró, el clic que sigue no debe activar lo que haya debajo (puntos tocables)
      onClickCapture={(e) => {
        if ((e.target as HTMLElement).closest('[data-control]')) return
        if (gesto.current.movido > 6) {
          e.stopPropagation()
          e.preventDefault()
        }
      }}
      className={`relative w-full select-none overflow-hidden rounded-xl bg-[#efe3cc] ${alto} ${
        v.k > 1 ? 'cursor-grab' : 'cursor-zoom-in'
      }`}
      style={{ touchAction: v.k > 1 ? 'none' : 'pan-y' }}
    >
      <div
        className="h-full w-full origin-top-left"
        style={{ transform: `translate(${v.x}px, ${v.y}px) scale(${v.k})`, willChange: 'transform' }}
      >
        {children}
      </div>

      <div data-control className="absolute right-2 top-2 flex flex-col gap-2">
        <button type="button" className={boton} onClick={() => zoomEn(1.5)} aria-label="Acercar" disabled={v.k >= K_MAX}>
          +
        </button>
        <button type="button" className={boton} onClick={() => zoomEn(1 / 1.5)} aria-label="Alejar" disabled={v.k <= 1}>
          −
        </button>
        <button
          type="button"
          className={`${boton} text-xs`}
          onClick={() => setV({ k: 1, x: 0, y: 0 })}
          aria-label="Restablecer zoom"
          disabled={v.k === 1}
        >
          1×
        </button>
      </div>
      <p data-control className="pointer-events-none absolute bottom-2 left-2 rounded bg-black/55 px-2 py-0.5 text-xs text-white" aria-hidden="true">
        {v.k > 1 ? `${v.k.toFixed(1)}×` : 'Toca dos veces o usa + para acercar'}
      </p>
    </div>
  )
}
