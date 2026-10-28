import { createContext, useContext, useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { usePantallaCompleta } from '../lib/usePantallaCompleta.ts'

interface Ctx {
  activa: boolean
  alternar: () => void
}

const Contexto = createContext<Ctx | null>(null)

/** Permite a un VisorZoom saber si está dentro de una pantalla completa y mostrar su botón. */
export function usePantallaDelContenedor(): Ctx | null {
  return useContext(Contexto)
}

/**
 * Envuelve un diagrama (visor + controles + textos) para poder verlo a pantalla completa.
 * La tecla F la activa y la desactiva. En pantalla completa, el contenido se acomoda
 * en columna y el visor ocupa el espacio que sobra.
 */
export default function PantallaCompleta({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const p = usePantallaCompleta(ref)
  const alternar = p.activa ? p.salir : p.entrar

  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== 'f' || e.ctrlKey || e.metaKey || e.altKey) return
      const t = e.target as HTMLElement | null
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) && (t as HTMLInputElement).type !== 'range') return
      e.preventDefault()
      alternar()
    }
    window.addEventListener('keydown', alTeclear)
    return () => window.removeEventListener('keydown', alTeclear)
  }, [alternar])

  return (
    <Contexto.Provider value={{ activa: p.activa, alternar }}>
      <div
        ref={ref}
        data-fs={p.activa}
        className={p.activa ? 'fixed inset-0 z-[60] flex flex-col gap-3 overflow-auto bg-[var(--tarjeta)] p-3 sm:p-5' : className}
      >
        {children}
      </div>
    </Contexto.Provider>
  )
}
