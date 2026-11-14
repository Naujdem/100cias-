import { useSyncExternalStore } from 'react'

// Tema claro u oscuro. «sistema» sigue la configuración del dispositivo.
// index.html aplica la clase antes de cargar la app para que no parpadee.

export type Apariencia = 'sistema' | 'claro' | 'oscuro'

const CLAVE = 'cien:apariencia'
const medio = window.matchMedia('(prefers-color-scheme: dark)')

function leerGuardada(): Apariencia {
  try {
    const v = localStorage.getItem(CLAVE)
    return v === 'claro' || v === 'oscuro' ? v : 'sistema'
  } catch {
    return 'sistema'
  }
}

let actual: Apariencia = leerGuardada()
const oyentes = new Set<() => void>()

function aplicar() {
  const oscuro = actual === 'oscuro' || (actual === 'sistema' && medio.matches)
  document.documentElement.classList.toggle('oscuro', oscuro)
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', oscuro ? '#0f1514' : '#0f766e')
}

aplicar()
medio.addEventListener('change', () => actual === 'sistema' && aplicar())

export function cambiarApariencia(a: Apariencia) {
  actual = a
  try {
    if (a === 'sistema') localStorage.removeItem(CLAVE)
    else localStorage.setItem(CLAVE, a)
  } catch {
    /* sin almacenamiento: solo dura esta visita */
  }
  aplicar()
  oyentes.forEach((o) => o())
}

export const usarApariencia = (): Apariencia =>
  useSyncExternalStore(
    (o) => {
      oyentes.add(o)
      return () => oyentes.delete(o)
    },
    () => actual,
  )
