import { useState } from 'react'
import VisorZoom from '../VisorZoom.tsx'
import PantallaCompleta from '../PantallaCompleta.tsx'
import EscenaEndosimbiosis, { PASOS_ENDO } from '../ilustraciones/EscenaEndosimbiosis.tsx'

type Modo = 'pasos' | 'pruebas'

const TEXTOS = [
  'Hace unos 2.000 millones de años, según esta hipótesis, existían células grandes y bacterias que usaban oxígeno para obtener mucha energía de los alimentos.',
  'Una célula grande rodeó a una bacteria con su membrana, como cuando las células atrapan partículas.',
  'En lugar de digerirla, la célula la mantuvo viva dentro. Los dos salieron ganando: la bacteria estaba protegida y la célula conseguía energía.',
  'Cuando la célula se dividía, las bacterias de adentro también se dividían, y pasaban a las células hijas.',
  'Con el tiempo, estas bacterias dejaron de vivir por su cuenta y se convirtieron en las mitocondrias. En las plantas pasó algo parecido con otras bacterias, que dieron origen a los cloroplastos.',
]

const FILAS: { rasgo: string; bacteria: boolean; mito: boolean; resto: boolean; explica: string }[] = [
  { rasgo: 'ADN circular', bacteria: true, mito: true, resto: false, explica: 'El ADN de las bacterias es una sola molécula circular. El de las mitocondrias también, mientras que el del núcleo de la célula está en cromosomas lineales.' },
  { rasgo: 'Ribosomas pequeños (70S)', bacteria: true, mito: true, resto: false, explica: 'Los ribosomas de las mitocondrias se parecen a los de las bacterias, y no a los más grandes (80S) del citoplasma de la célula.' },
  { rasgo: 'Se dividen en dos (fisión binaria)', bacteria: true, mito: true, resto: false, explica: 'Las mitocondrias se multiplican estrangulándose en dos, como las bacterias, y no por mitosis.' },
  { rasgo: 'Tamaño de unos pocos µm', bacteria: true, mito: true, resto: false, explica: 'Una mitocondria mide de 1 a 5 µm, como una bacteria. Una célula entera es mucho más grande.' },
]

export default function Endosimbiosis() {
  const [modo, setModo] = useState<Modo>('pasos')
  return (
    <div>
      <div role="group" aria-label="Actividad" className="mb-3 flex flex-wrap gap-2">
        {([['pasos', 'Paso a paso'], ['pruebas', 'Pruebas']] as [Modo, string][]).map(([id, texto]) => (
          <button
            key={id}
            type="button"
            aria-pressed={modo === id}
            onClick={() => setModo(id)}
            className="min-h-10 rounded-full border border-[var(--acento)] px-3 text-sm font-semibold text-[var(--acento)] aria-pressed:bg-[var(--acento)] aria-pressed:text-white"
          >
            {texto}
          </button>
        ))}
      </div>
      {modo === 'pasos' ? <Pasos /> : <Pruebas />}
    </div>
  )
}

function Pasos() {
  const [p, setP] = useState<0 | 1 | 2 | 3 | 4>(0)
  return (
    <PantallaCompleta>
      <VisorZoom etiqueta="Origen de las mitocondrias por endosimbiosis" alto="aspect-[4/3]">
        <EscenaEndosimbiosis paso={p} />
      </VisorZoom>
      <div className="mt-3">
        <label htmlFor="paso-endo" className="flex items-center justify-between text-sm font-semibold">
          <span>Paso {p + 1} de 5</span>
          <span className="font-normal text-[var(--suave)]">{PASOS_ENDO[p]}</span>
        </label>
        <input
          id="paso-endo"
          type="range"
          min="0"
          max="4"
          step="1"
          value={p}
          onChange={(e) => setP(Number(e.target.value) as 0 | 1 | 2 | 3 | 4)}
          onPointerUp={(e) => e.currentTarget.closest<HTMLElement>('[role=dialog]')?.focus()}
          className="mt-1 h-8 w-full accent-[var(--acento)]"
        />
      </div>
      <div aria-live="polite" className="mt-2 min-h-[4.5rem] rounded-xl bg-[var(--fondo)] p-3 text-sm">
        <p>{TEXTOS[p]}</p>
      </div>
      <p className="mt-2 text-xs text-[var(--suave)]">Ilustración esquemática de una hipótesis; no está a escala ni muestra el proceso real.</p>
    </PantallaCompleta>
  )
}

function Pruebas() {
  const [sel, setSel] = useState<number | null>(null)
  const f = sel === null ? null : FILAS[sel]
  const marca = (v: boolean) => (v ? '✔' : '✘')
  return (
    <div>
      <p className="text-sm">Compara una bacteria, una mitocondria y el resto de la célula. Toca un rasgo para ver por qué es una pista.</p>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-sm">
          <caption className="sr-only">Rasgos de bacterias, mitocondrias y el resto de la célula</caption>
          <thead>
            <tr className="text-left">
              <th className="p-2">Rasgo</th>
              <th className="p-2">Bacteria</th>
              <th className="p-2">Mitocondria</th>
              <th className="p-2">Resto de la célula</th>
            </tr>
          </thead>
          <tbody>
            {FILAS.map((r, i) => (
              <tr key={r.rasgo} className="border-t border-[var(--linea)]">
                <th scope="row" className="p-0 text-left font-semibold">
                  <button
                    type="button"
                    aria-pressed={sel === i}
                    onClick={() => setSel(sel === i ? null : i)}
                    className="min-h-11 w-full rounded-lg px-2 text-left aria-pressed:bg-[var(--acento-suave)]/40"
                  >
                    {r.rasgo}
                  </button>
                </th>
                <td className="p-2" aria-label={r.bacteria ? 'sí' : 'no'}>{marca(r.bacteria)}</td>
                <td className="p-2" aria-label={r.mito ? 'sí' : 'no'}>{marca(r.mito)}</td>
                <td className="p-2" aria-label={r.resto ? 'sí' : 'no'}>{marca(r.resto)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div aria-live="polite" className="mt-2 min-h-[4.5rem] rounded-xl bg-[var(--fondo)] p-3 text-sm">
        {f ? <p>{f.explica}</p> : <p className="text-[var(--suave)]">Las mitocondrias se parecen a las bacterias y no al resto de la célula. Esa es la pista que apoya la hipótesis.</p>}
      </div>
      <p className="mt-2 text-xs text-[var(--suave)]">Los cloroplastos comparten estos rasgos con las cianobacterias. El tamaño de las mitocondrias es aproximado.</p>
    </div>
  )
}
