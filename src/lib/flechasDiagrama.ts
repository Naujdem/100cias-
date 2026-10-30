import { useEffect, useRef } from 'react'

// Teclas ← → dentro de una pestaña con controles (Diagrama, Para el cuaderno).
// El recuadro de la ficha envía la flecha con `enviarFlecha`. Quien la recibe puede quedársela:
//  1. un componente con `useFlechas` (p. ej. «elige el caso anterior o siguiente»);
//  2. si nadie la usa, el primer deslizador visible del diagrama avanza un paso (`moverDeslizador`);
//  3. si tampoco hay deslizador, la flecha cambia de hito, como siempre.

const EVENTO = 'cien:flecha'

/** El componente se queda con ← → mientras está en pantalla. `alUsar` devuelve true si usó la flecha. */
export function useFlechas(alUsar: (dir: -1 | 1) => boolean): void {
  const ref = useRef(alUsar)
  ref.current = alUsar
  useEffect(() => {
    const alRecibir = (e: Event) => {
      if (ref.current((e as CustomEvent<-1 | 1>).detail)) e.preventDefault()
    }
    document.addEventListener(EVENTO, alRecibir)
    return () => document.removeEventListener(EVENTO, alRecibir)
  }, [])
}

/** Ofrece la flecha a los componentes que la pidieron. Devuelve true si alguno la usó. */
export function enviarFlecha(dir: -1 | 1): boolean {
  return !document.dispatchEvent(new CustomEvent(EVENTO, { detail: dir, cancelable: true }))
}

/** Mueve un paso el primer deslizador visible de `panel`. Devuelve true si había uno (aunque ya esté en el extremo). */
export function moverDeslizador(panel: ParentNode, dir: -1 | 1): boolean {
  const r = [...panel.querySelectorAll<HTMLInputElement>('input[type="range"]')].find((i) => !i.disabled && i.offsetParent !== null)
  if (!r) return false
  const antes = r.value
  try {
    if (dir > 0) r.stepUp()
    else r.stepDown()
  } catch {
    return true
  }
  // stepUp/stepDown no avisan a React: se emite el evento «input» para que actualice su estado
  if (r.value !== antes) r.dispatchEvent(new Event('input', { bubbles: true }))
  return true
}
