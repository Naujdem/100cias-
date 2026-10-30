import { useState } from 'react'
import PantallaCompleta from '../PantallaCompleta.tsx'
import { useFlechas } from '../../lib/flechasDiagrama.ts'

// «¿Cuenta como célula?»: casos típicos y casos límite de la teoría celular.

type V = 'si' | 'no' | 'parcial'

const CRITERIOS = ['Tiene membrana propia', 'Guarda material genético', 'Hace su propio metabolismo', 'Se forma o se multiplica por división']

interface Caso {
  id: string
  nombre: string
  v: [V, V, V, V]
  cuenta: boolean
  nota: string
}

const CASOS: Caso[] = [
  { id: 'bacteria', nombre: 'Una bacteria', v: ['si', 'si', 'si', 'si'], cuenta: true, nota: 'Es una célula completa: una sola célula que hace todo por sí sola.' },
  { id: 'neurona', nombre: 'Una neurona adulta', v: ['si', 'si', 'si', 'parcial'], cuenta: true, nota: 'Casi no se divide, pero sigue siendo célula: viene de otra célula y tiene membrana, material genético y metabolismo.' },
  { id: 'globulo', nombre: 'Un glóbulo rojo maduro (de mamífero)', v: ['si', 'no', 'parcial', 'no'], cuenta: true, nota: 'Pierde el núcleo al madurar y no se divide, pero sigue siendo una célula: viene de otra y tiene membrana y metabolismo.' },
  { id: 'musculo', nombre: 'Una fibra del músculo esquelético', v: ['si', 'si', 'si', 'parcial'], cuenta: true, nota: 'Es una sola célula larga con muchos núcleos (un sincitio). Tener un solo núcleo por célula no es una regla.' },
  { id: 'yema', nombre: 'La yema de un huevo sin fecundar', v: ['si', 'si', 'si', 'parcial'], cuenta: true, nota: 'Se suele citar como una de las células más grandes: una sola célula enorme. La clara no es parte de ella.' },
  { id: 'virus', nombre: 'Un virus', v: ['no', 'si', 'no', 'no'], cuenta: false, nota: 'Tiene material genético, pero no estructura celular ni metabolismo propio, y solo se reproduce usando una célula hospedera. Es un caso límite: se discute si están vivos.' },
  { id: 'corcho', nombre: 'Lo que vio Hooke en el corcho', v: ['no', 'no', 'no', 'no'], cuenta: false, nota: 'Eran paredes de células que ya murieron: ya no eran células vivas.' },
  { id: 'mito', nombre: 'Una mitocondria', v: ['si', 'si', 'si', 'parcial'], cuenta: false, nota: 'Tiene doble membrana, ADN propio y se divide, pero depende de la célula que la contiene: es un orgánulo. Probablemente fue una bacteria, como cuenta la hipótesis endosimbiótica.' },
]

const SIMBOLO: Record<V, string> = { si: '✔', no: '✘', parcial: '≈' }
const PALABRA: Record<V, string> = { si: 'sí', no: 'no', parcial: 'en parte' }

export default function CuentaComoCelula() {
  const [sel, setSel] = useState<string>(CASOS[0].id)
  const [apuestas, setApuestas] = useState<Record<string, boolean>>({})
  const caso = CASOS.find((c) => c.id === sel)!
  const apuesta = apuestas[sel]
  const respondidos = CASOS.filter((c) => c.id in apuestas)
  const aciertos = respondidos.filter((c) => apuestas[c.id] === c.cuenta).length

  // ← → pasan al caso anterior o siguiente
  useFlechas((dir) => {
    const i = CASOS.findIndex((c) => c.id === sel)
    setSel(CASOS[Math.max(0, Math.min(CASOS.length - 1, i + dir))].id)
    return true
  })

  return (
    <PantallaCompleta conBoton>
      <p className="text-sm">Elige un caso, di si cuenta como célula y mira por qué. La teoría celular tiene casos que parecen raros.</p>

      <div role="group" aria-label="Casos" className="mt-3 flex flex-wrap gap-2">
        {CASOS.map((c) => (
          <button
            key={c.id}
            type="button"
            aria-pressed={sel === c.id}
            onClick={() => setSel(c.id)}
            className="min-h-10 rounded-lg border border-[var(--linea)] px-3 text-sm font-semibold aria-pressed:border-[var(--acento)] aria-pressed:bg-[var(--acento-suave)]/40"
          >
            {c.nombre}
            {c.id in apuestas ? (apuestas[c.id] === c.cuenta ? ' ✔' : ' ✘') : ''}
          </button>
        ))}
      </div>

      <div className="mt-3 rounded-xl border border-[var(--linea)] p-3">
        <p className="font-semibold">{caso.nombre}</p>
        {apuesta === undefined ? (
          <>
            <p className="mt-1 text-sm">¿Cuenta como una célula?</p>
            <div className="mt-2 flex gap-2">
              <button type="button" onClick={() => setApuestas({ ...apuestas, [sel]: true })} className="min-h-10 rounded-lg bg-[var(--acento)] px-4 text-sm font-semibold text-white">
                Sí
              </button>
              <button type="button" onClick={() => setApuestas({ ...apuestas, [sel]: false })} className="min-h-10 rounded-lg border border-[var(--acento)] px-4 text-sm font-semibold text-[var(--acento)]">
                No
              </button>
            </div>
          </>
        ) : (
          <div aria-live="polite">
            <p className="mt-1 text-sm font-semibold">
              {apuesta === caso.cuenta ? 'Acertaste. ' : 'Casi. '}
              {caso.cuenta ? 'Sí cuenta como célula.' : 'No cuenta como célula.'}
            </p>
            <ul className="mt-2 space-y-1 text-sm">
              {CRITERIOS.map((c, i) => (
                <li key={c}>
                  <span aria-hidden="true" className="inline-block w-5 font-bold">{SIMBOLO[caso.v[i]]}</span>
                  <span className="sr-only">{PALABRA[caso.v[i]]}: </span>
                  {c}
                </li>
              ))}
            </ul>
            <p className="mt-2 text-sm">{caso.nota}</p>
            <button type="button" onClick={() => { const r = { ...apuestas }; delete r[sel]; setApuestas(r) }} className="mt-2 text-xs font-semibold text-[var(--acento)] underline">
              Volver a intentar
            </button>
          </div>
        )}
      </div>

      <p className="mt-2 text-sm text-[var(--suave)]" aria-live="polite">
        {respondidos.length === 0 ? 'Aún no has respondido ninguno.' : `Aciertos: ${aciertos} de ${respondidos.length} respondidos.`}
      </p>
      <p className="mt-1 text-xs text-[var(--suave)]">Los criterios son una guía didáctica, no una definición oficial. ≈ significa «en parte».</p>
    </PantallaCompleta>
  )
}
