import { useId, useState } from 'react'
import type { Bloque } from '../data/schema.ts'
import { NivelInsignia, BorradorInsignia } from './Insignia.tsx'
import { cambiarAjuste, usarAjustes } from '../lib/ajustes.ts'

interface Props {
  bloques: Bloque[]
  activos: Set<string>
  onAlternar: (id: string) => void
}

export default function SelectorContenido({ bloques, activos, onAlternar }: Props) {
  // Plegado al empezar: el contenido es lo primero que se ve y esta lista es un ajuste del docente.
  const [abierto, setAbierto] = useState(false)
  const id = useId()
  const ajustes = usarAjustes()
  return (
    <div>
      <button
        type="button"
        aria-expanded={abierto}
        aria-controls={id}
        onClick={() => setAbierto((v) => !v)}
        className="flex min-h-11 w-full items-center justify-between gap-3 rounded-xl border border-[var(--linea)] bg-[var(--tarjeta)] px-4 text-left text-sm font-semibold"
      >
        <span>
          Personalizar contenido
          <span className="ml-2 font-normal text-[var(--suave)]">
            {activos.size} de {bloques.length} mostrados
          </span>
        </span>
        <span aria-hidden="true">{abierto ? '▴' : '▾'}</span>
      </button>
      <div id={id} hidden={!abierto} className="mt-2">
        <fieldset className="mb-3 rounded-2xl border border-[var(--linea)] bg-[var(--tarjeta)] p-4">
          <legend className="px-2 text-sm font-semibold">Ayudas</legend>
          <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm">
            <input type="checkbox" className="h-5 w-5 accent-[var(--acento)]" checked={ajustes.docente} onChange={(e) => cambiarAjuste('docente', e.target.checked)} />
            <span>
              <span className="font-medium">Modo docente</span> · añade la pestaña «Para el docente» en cada ficha
            </span>
          </label>
          <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm">
            <input type="checkbox" className="h-5 w-5 accent-[var(--acento)]" checked={ajustes.analogias} onChange={(e) => cambiarAjuste('analogias', e.target.checked)} />
            <span>
              <span className="font-medium">Analogías</span> · compara con algo cotidiano (por ejemplo, la célula como ciudad)
            </span>
          </label>
        </fieldset>
        <Lista bloques={bloques} activos={activos} onAlternar={onAlternar} />
      </div>
    </div>
  )
}

function Lista({ bloques, activos, onAlternar }: Props) {
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
