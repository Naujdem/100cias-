import { useCallback, useEffect, useState } from 'react'
import type { RefObject } from 'react'

/**
 * Pantalla completa de un elemento. Usa la API nativa cuando existe y, si no
 * (p. ej. iPhone), cae a una capa que ocupa toda la ventana.
 */
export function usePantallaCompleta(ref: RefObject<HTMLElement | null>) {
  const [activa, setActiva] = useState(false)

  const entrar = useCallback(() => {
    setActiva(true)
    try {
      void ref.current?.requestFullscreen?.()?.catch(() => {})
    } catch {
      /* se queda en el modo de respaldo */
    }
  }, [ref])

  const salir = useCallback(() => {
    setActiva(false)
    try {
      if (document.fullscreenElement) void document.exitFullscreen().catch(() => {})
    } catch {
      /* nada */
    }
  }, [])

  // Si el navegador sale de pantalla completa por su cuenta (tecla Esc), se sincroniza.
  useEffect(() => {
    const alCambiar = () => {
      if (!document.fullscreenElement) setActiva(false)
    }
    document.addEventListener('fullscreenchange', alCambiar)
    return () => document.removeEventListener('fullscreenchange', alCambiar)
  }, [])

  // Esc en el modo de respaldo.
  useEffect(() => {
    if (!activa) return
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === 'Escape') salir()
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [activa, salir])

  return { activa, entrar, salir }
}
