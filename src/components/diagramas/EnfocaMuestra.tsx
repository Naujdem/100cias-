import { useState } from 'react'
import PantallaCompleta from '../PantallaCompleta.tsx'
import { Cebolla } from '../escenas/EscenasMicroscopio.tsx'
import { useFlechas } from '../../lib/flechasDiagrama.ts'

// Simulador: enfocar una muestra de piel de cebolla con los tornillos macro y micrométrico.
// Regla del laboratorio: con el objetivo de 40× solo se usa el micrométrico.

const OBJETIVOS = [4, 10, 40] as const
const ESCALA: Record<number, number> = { 4: 0.45, 10: 1, 40: 3.6 }
const FOCO = 63 // posición en la que la muestra queda nítida

export default function EnfocaMuestra() {
  const [obj, setObj] = useState<(typeof OBJETIVOS)[number]>(4)
  const [macro, setMacro] = useState(20)
  const [micro, setMicro] = useState(0)
  const [aviso, setAviso] = useState('')
  const pos = macro + micro / 10
  const sensible = obj === 4 ? 0.35 : obj === 10 ? 0.7 : 1.6
  const borroso = Math.min(10, Math.abs(pos - FOCO) * sensible)
  const nitido = borroso < 0.6

  const moverMacro = (v: number) => {
    if (obj === 40) {
      setAviso('¡Cuidado! Con el objetivo de 40× no se usa el macrométrico: el objetivo puede chocar con la lámina y romperla. Usa el micrométrico.')
      return
    }
    setAviso('')
    setMacro(v)
  }
  const moverMicro = (d: number) => {
    setAviso('')
    setMicro((m) => Math.max(-50, Math.min(50, m + d)))
  }
  useFlechas((dir) => {
    moverMicro(dir * 2)
    return true
  })

  return (
    <PantallaCompleta>
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="mx-auto aspect-square w-full max-w-[22rem] overflow-hidden rounded-full border-[6px] border-[#3a4450] bg-[#fffbea]">
          <svg viewBox="72 22 256 256" role="img" aria-label={nitido ? 'Muestra enfocada' : 'Muestra borrosa'} className="h-full w-full">
            <defs><filter id="enf"><feGaussianBlur stdDeviation={borroso} /></filter></defs>
            <g filter="url(#enf)"><Cebolla escala={ESCALA[obj]} /></g>
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold">Objetivo</p>
          <div role="group" aria-label="Objetivo" className="mt-1 flex gap-2">
            {OBJETIVOS.map((o) => (
              <button key={o} type="button" aria-pressed={obj === o} onClick={() => { setObj(o); setAviso(o === 40 && !nitido ? 'Truco: enfoca primero con 4× o 10×; al pasar a 40× solo ajusta con el micrométrico.' : '') }}
                className="min-h-11 rounded-full border border-[var(--acento)] px-4 font-bold text-[var(--acento)] aria-pressed:bg-[var(--acento)] aria-pressed:text-[var(--sobre-acento)]">
                {o}×
              </button>
            ))}
          </div>
          <label className="mt-4 block text-sm font-semibold" htmlFor="macro">Tornillo macrométrico (grueso)</label>
          <input id="macro" type="range" min="0" max="100" step="1" value={macro} onChange={(e) => moverMacro(Number(e.target.value))} className="w-full" />
          <p className="mt-3 text-sm font-semibold">Tornillo micrométrico (fino) · también con ← →</p>
          <div className="mt-1 flex gap-2">
            <button type="button" onClick={() => moverMicro(-2)} className="min-h-11 flex-1 rounded-xl border-2 border-[var(--linea)] font-bold">↺ bajar</button>
            <button type="button" onClick={() => moverMicro(2)} className="min-h-11 flex-1 rounded-xl border-2 border-[var(--linea)] font-bold">subir ↻</button>
          </div>
          <div aria-live="polite" className="mt-3 rounded-xl bg-[var(--fondo)] p-3 text-sm">
            {aviso ? <p className="font-semibold text-red-800 dark:text-red-300">{aviso}</p> : nitido ? (
              <p className="font-semibold text-green-800 dark:text-green-300">¡Enfocado! Aumento total: 10 × {obj} = {10 * obj}×.{obj < 40 ? ' Prueba con un objetivo mayor.' : ''}</p>
            ) : (
              <p>Gira los tornillos hasta que las células se vean nítidas. Empieza con 4× y el macrométrico; termina con el micrométrico.</p>
            )}
          </div>
        </div>
      </div>
    </PantallaCompleta>
  )
}
