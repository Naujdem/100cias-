import type { Bloque } from '../data/schema.ts'
import { NivelInsignia, BorradorInsignia } from './Insignia.tsx'

interface Props {
  bloques: Bloque[]
  activos: Set<string>
  onAlternar: (id: string) => void
}

export default function SelectorContenido({ bloques, activos, onAlternar }: Props) {
  return (
    <fieldset className="rounded-2xl border border-[var(--linea)] bg-[var(--tarjeta)] p-4">
      <legend className="px-2 text-sm font-semibold">Qué mostrar</legend>
      <ul className="space-y-1">
        {[...bloques]
          .sort((a, b) => a.anio - b.anio)
          .map((b) => {
            const marcado = activos.has(b.id)
            const bloqueado = !!b.nucleo
            return (
              <li key={b.id}>
                <label
                  className={`flex min-h-11 items-start gap-3 rounded-lg px-2 py-2 ${
                    bloqueado ? 'opacity-80' : 'cursor-pointer hover:bg-[var(--fondo)]'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="mt-1 h-5 w-5 shrink-0 accent-[var(--acento)]"
                    checked={marcado}
                    disabled={bloqueado}
                    onChange={() => onAlternar(b.id)}
                  />
                  <span className="min-w-0">
                    <span className="block text-sm font-medium">{b.titulo}</span>
                    <span className="mt-1 flex flex-wrap items-center gap-2">
                      <NivelInsignia nivel={b.nivel} />
                      {bloqueado && (
                        <span className="text-xs text-[var(--suave)]">Esencial, siempre activo</span>
                      )}
                      {!b.revisado && <BorradorInsignia />}
                    </span>
                  </span>
                </label>
              </li>
            )
          })}
      </ul>
    </fieldset>
  )
}
