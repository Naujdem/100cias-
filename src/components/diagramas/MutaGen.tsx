import { useState } from 'react'
import { AMINOACIDOS, traducir } from '../../lib/codigoGenetico.ts'
import { COLOR_BASE } from '../escenas/EscenasAdn.tsx'

// Muta el gen: un ARNm corto con su proteína. El estudiante cambia, quita o agrega bases y ve cómo cambia la
// proteína y qué tipo de mutación hizo (silenciosa, de cambio de sentido, sin sentido o corrimiento del marco).

const ORIGINAL = 'AUGGAGCUCGGAUGGAAAUAA'
const CICLO: Record<string, string> = { A: 'U', U: 'G', G: 'C', C: 'A' }
type Accion = 'cambiar' | 'quitar' | 'agregar'

function proteina(sec: string) {
  const aa: string[] = []
  for (let k = 0; k + 3 <= sec.length; k += 3) {
    const l = traducir(sec.slice(k, k + 3))
    aa.push(l)
    if (l === '*') break
  }
  return aa
}

function tipo(sec: string, orig: string[], nueva: string[]) {
  if (sec === ORIGINAL) return { t: 'Sin mutaciones', s: 'Este es el gen original.' }
  const dif = sec.length - ORIGINAL.length
  if (dif !== 0) {
    if (dif % 3 === 0) return { t: dif > 0 ? 'Inserción de un codón' : 'Deleción de un codón', s: 'Se agregó o quitó un aminoácido, pero el resto se lee bien.' }
    return { t: 'Corrimiento del marco de lectura', s: 'Desde ahí todos los codones cambian: la proteína queda muy distinta.' }
  }
  const corta = nueva.indexOf('*') >= 0 && nueva.indexOf('*') < orig.indexOf('*')
  if (corta) return { t: 'Sin sentido', s: 'Apareció un codón de parada antes de tiempo: la proteína queda cortada.' }
  if (orig.join('') === nueva.join('')) return { t: 'Silenciosa', s: 'Cambió una base, pero el codón dice el mismo aminoácido.' }
  return { t: 'De cambio de sentido', s: 'Cambió un aminoácido de la proteína.' }
}

export default function MutaGen() {
  const [sec, setSec] = useState(ORIGINAL)
  const [accion, setAccion] = useState<Accion>('cambiar')
  const orig = proteina(ORIGINAL)
  const nueva = proteina(sec)
  const res = tipo(sec, orig, nueva)

  const tocar = (k: number) => {
    if (accion === 'cambiar') setSec((s) => s.slice(0, k) + CICLO[s[k]] + s.slice(k + 1))
    if (accion === 'quitar' && sec.length > 6) setSec((s) => s.slice(0, k) + s.slice(k + 1))
    if (accion === 'agregar' && sec.length < 30) setSec((s) => s.slice(0, k) + 'A' + s.slice(k))
  }

  const Cadena = ({ aa, otra }: { aa: string[]; otra?: string[] }) => (
    <div className="flex flex-wrap justify-center gap-1">
      {aa.map((l, k) => (
        <span key={k} className="flex h-11 min-w-11 items-center justify-center rounded-full px-1 text-sm font-black text-white"
          style={{ background: l === '*' ? '#c43c3c' : otra && otra[k] !== l ? '#e0a020' : '#5f87c2', outline: otra && otra[k] !== l ? '3px solid #c43c3c' : 'none' }}>
          {AMINOACIDOS[l]?.abrev ?? '?'}
        </span>
      ))}
    </div>
  )

  return (
    <div data-diagrama className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap justify-center gap-2" role="radiogroup" aria-label="Qué hacer al tocar una base">
        {([['cambiar', '🔄 Cambiar una base'], ['quitar', '➖ Quitar una base'], ['agregar', '➕ Agregar una A']] as [Accion, string][]).map(([a, t]) => (
          <button key={a} type="button" role="radio" aria-checked={accion === a} onClick={() => setAccion(a)}
            className="min-h-11 rounded-full border border-[var(--acento)] px-4 text-sm font-semibold text-[var(--acento)] aria-checked:bg-[var(--acento)] aria-checked:text-[var(--sobre-acento)]">{t}</button>
        ))}
        <button type="button" onClick={() => setSec(ORIGINAL)} className="min-h-11 rounded-full border px-4 text-sm font-semibold">↺ Original</button>
      </div>
      <div className="flex flex-wrap justify-center gap-y-2">
        {sec.split('').map((b, k) => (
          <button key={k} type="button" onClick={() => tocar(k)} aria-label={`Base ${k + 1}: ${b}`}
            className={`h-11 w-9 text-lg font-black text-white ${k % 3 === 2 ? 'mr-3' : 'mr-0.5'} rounded-md`}
            style={{ background: COLOR_BASE[b] }}>{b}</button>
        ))}
      </div>
      <div className="w-full max-w-2xl space-y-2">
        <p className="text-center text-sm font-bold opacity-70">Proteína original</p>
        <Cadena aa={orig} />
        <p className="text-center text-sm font-bold opacity-70">Proteína con tu mutación</p>
        <Cadena aa={nueva} otra={orig} />
      </div>
      <p aria-live="polite" className="text-center text-lg"><strong>{res.t}.</strong> {res.s}</p>
    </div>
  )
}
