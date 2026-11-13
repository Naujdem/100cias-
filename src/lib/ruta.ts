import { useEffect, useMemo, useSyncExternalStore } from 'react'

// Navegación con el «hash» de la dirección (#/m/biologia…): funciona sin servidor, sin conexión
// y con el botón Atrás del navegador o del celular.

export type Ruta =
  | { v: 'inicio' }
  | { v: 'materia'; materia: string }
  | { v: 'unidad'; materia: string; unidad: string }
  | { v: 'tema'; tema: string }
  | { v: 'jugar' }
  | { v: 'quices'; tema?: string }

export const enlace = {
  inicio: '#/',
  materia: (m: string) => `#/m/${m}`,
  unidad: (m: string, u: string) => `#/m/${m}/${u}`,
  tema: (t: string) => `#/t/${t}`,
  jugar: '#/jugar',
  quices: (t?: string) => (t ? `#/quices/${t}` : '#/quices'),
}

export function analizar(hash: string): Ruta {
  const [a, b, c] = hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent)
  if (a === 'm' && b && c) return { v: 'unidad', materia: b, unidad: c }
  if (a === 'm' && b) return { v: 'materia', materia: b }
  if (a === 't' && b) return { v: 'tema', tema: b }
  if (a === 'jugar') return { v: 'jugar' }
  if (a === 'quices') return { v: 'quices', tema: b }
  return { v: 'inicio' }
}

const suscribir = (f: () => void) => {
  window.addEventListener('hashchange', f)
  return () => window.removeEventListener('hashchange', f)
}

/** La pantalla actual. Al cambiar, la página vuelve arriba. */
export function usarRuta(): Ruta {
  const hash = useSyncExternalStore(suscribir, () => window.location.hash)
  useEffect(() => {
    window.scrollTo(0, 0) // entre llaves: en navegadores nuevos devuelve una promesa y el efecto no debe devolverla
  }, [hash])
  return useMemo(() => analizar(hash), [hash])
}

export function irA(destino: string): void {
  window.location.hash = destino
}
