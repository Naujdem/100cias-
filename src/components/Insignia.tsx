import type { Nivel } from '../data/schema.ts'

const ETIQUETA: Record<Nivel, string> = {
  basico: 'Básico',
  intermedio: 'Intermedio',
  avanzado: 'Avanzado',
}

export function NivelInsignia({ nivel }: { nivel: Nivel }) {
  return (
    <span className="rounded-full border border-[var(--linea)] px-2 py-0.5 text-xs text-[var(--suave)]">
      {ETIQUETA[nivel]}
    </span>
  )
}

export function BorradorInsignia() {
  return (
    <span
      className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-900 dark:bg-amber-900/40 dark:text-amber-200"
      title="Contenido pendiente de verificar contra una fuente"
    >
      Borrador
    </span>
  )
}
