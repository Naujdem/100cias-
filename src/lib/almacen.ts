// localStorage con try/catch: puede fallar o venir vacío (modo privado, datos bloqueados).
export function leer<T>(clave: string, defecto: T): T {
  try {
    const v = localStorage.getItem(clave)
    return v ? (JSON.parse(v) as T) : defecto
  } catch {
    return defecto
  }
}

export function guardar(clave: string, valor: unknown): void {
  try {
    localStorage.setItem(clave, JSON.stringify(valor))
  } catch {
    /* sin almacenamiento: la app sigue funcionando */
  }
}
