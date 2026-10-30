import type { EstadoBloque } from '../lib/progreso.ts'

/** Marca pequeña que dice si el estudiante ya abrió o ya comprobó una ficha. No muestra nada si es nueva. */
export default function InsigniaProgreso({ estado }: { estado?: EstadoBloque }) {
  if (!estado || estado === 'nuevo') return null
  const ok = estado === 'comprobado'
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${
        ok ? 'border-emerald-600 text-emerald-700 dark:text-emerald-300' : 'border-[var(--linea)] text-[var(--suave)]'
      }`}
    >
      <span aria-hidden="true">✓</span>
      {ok ? 'Comprobado' : 'Visto'}
    </span>
  )
}
