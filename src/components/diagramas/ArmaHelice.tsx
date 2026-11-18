import { useCallback, useEffect, useState } from 'react'
import { COLOR_BASE } from '../escenas/EscenasAdn.tsx'

// Arma la doble hélice: hay una cadena de ADN y el estudiante pone, una por una, las bases de la cadena
// complementaria (botones o teclas A, T, G, C). Al completarla, puede «enrollar» la escalera en hélice.

const PAREJA_ADN: Record<string, string> = { A: 'T', T: 'A', G: 'C', C: 'G' }
const PAREJA_ARN: Record<string, string> = { A: 'U', T: 'A', G: 'C', C: 'G' }
const LETRAS = ['A', 'T', 'G', 'C']
const N = 8

function nuevaCadena() {
  return Array.from({ length: N }, () => LETRAS[Math.floor(Math.random() * 4)])
}

/** Con `arn`, el estudiante hace de ARN polimerasa: arma el ARN (A, U, G, C) frente a la hebra molde de ADN. */
export default function ArmaHelice({ arn = false }: { arn?: boolean }) {
  const PAREJA = arn ? PAREJA_ARN : PAREJA_ADN
  const BOTONES = arn ? ['A', 'U', 'G', 'C'] : LETRAS
  const [molde, setMolde] = useState<string[]>(['A', 'G', 'T', 'C', 'C', 'A', 'G', 'T'])
  const [puestas, setPuestas] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [enrollada, setEnrollada] = useState(false)
  const listo = puestas.length === N

  const poner = useCallback((b: string) => {
    if (listo) return
    const toca = PAREJA[molde[puestas.length]]
    if (b === toca) {
      setPuestas((p) => [...p, b])
      setError(null)
    } else {
      setError(`${b} no va con ${molde[puestas.length]}. Recuerda: ${arn ? 'frente a A va U, frente a T va A, G con C' : 'A con T y G con C'}.`)
    }
  }, [listo, molde, puestas.length, PAREJA, arn])

  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      const k = e.key.toUpperCase()
      if (BOTONES.includes(k) && !e.ctrlKey && !e.metaKey && !e.altKey) poner(k)
    }
    window.addEventListener('keydown', tecla)
    return () => window.removeEventListener('keydown', tecla)
  }, [poner, BOTONES])

  const otra = () => { setMolde(nuevaCadena()); setPuestas([]); setError(null); setEnrollada(false) }

  return (
    <div data-diagrama>
      <svg viewBox="0 0 640 300" role="img" aria-label="Escalera de ADN para completar con las bases complementarias" className="mx-auto w-full max-w-3xl">
        <style>{`.ah-t { transition: transform .9s cubic-bezier(.45,.05,.25,1), opacity .5s }`}</style>
        {molde.map((b, k) => {
          const x = 70 + k * 72
          const fase = (k / N) * 2 * Math.PI * 1.5
          const dy = enrollada ? 34 * Math.sin(fase) : 0
          const esc = enrollada ? Math.max(0.35, Math.abs(Math.cos(fase))) : 1
          const puesta = puestas[k]
          const actual = k === puestas.length && !listo
          return (
            <g key={k} className="ah-t" style={{ transform: `translate(${x}px, ${150 + dy}px) scale(1, ${esc})` }}>
              <rect x="-26" y="-118" width="52" height="14" rx="7" fill="#3f6fb8" />
              <rect x="-20" y="-104" width="40" height="92" rx="6" fill={COLOR_BASE[b]} />
              <text x="0" y="-50" textAnchor="middle" fontSize="26" fontWeight="900" fill="#fff">{b}</text>
              <line x1="-8" x2="-8" y1="-12" y2="12" stroke="#666" strokeWidth="2" strokeDasharray="3 2" opacity={puesta ? 1 : 0.25} />
              <line x1="8" x2="8" y1="-12" y2="12" stroke="#666" strokeWidth="2" strokeDasharray="3 2" opacity={puesta ? 1 : 0.25} />
              {(b === 'G' || b === 'C') && <line x1="0" x2="0" y1="-12" y2="12" stroke="#666" strokeWidth="2" strokeDasharray="3 2" opacity={puesta ? 1 : 0.25} />}
              {puesta
                ? <><rect x="-20" y="12" width="40" height="92" rx="6" fill={COLOR_BASE[puesta]} /><text x="0" y="70" textAnchor="middle" fontSize="26" fontWeight="900" fill="#fff">{puesta}</text></>
                : <rect x="-20" y="12" width="40" height="92" rx="6" fill="none" stroke={actual ? '#c43c3c' : '#bbb'} strokeWidth={actual ? 3 : 2} strokeDasharray="6 4" />}
              <rect x="-26" y="104" width="52" height="14" rx="7" fill={arn ? '#d76aa6' : '#8fb2e2'} opacity={puesta ? 1 : 0.3} />
            </g>
          )
        })}
      </svg>
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {BOTONES.map((b) => (
          <button key={b} type="button" onClick={() => poner(b)} disabled={listo}
            className="min-h-12 min-w-14 rounded-xl text-2xl font-black text-white disabled:opacity-40"
            style={{ background: COLOR_BASE[b] }}>{b}</button>
        ))}
        {!arn && <button type="button" onClick={() => setEnrollada((e) => !e)} disabled={!listo}
          className="min-h-12 rounded-full border border-[var(--acento)] px-5 text-base font-semibold text-[var(--acento)] disabled:opacity-40">
          {enrollada ? '📏 Estirar' : '🌀 Enrollar'}
        </button>}
        <button type="button" onClick={otra} className="min-h-12 rounded-full border px-5 text-base font-semibold">🔄 Otra cadena</button>
      </div>
      <p aria-live="polite" className="mt-2 text-center text-lg">
        {error ?? (listo
          ? (arn ? '¡ARN listo! Es una copia del gen con U en vez de T. Ahora sale del núcleo hacia los ribosomas.' : '¡Completa! Cada A quedó con una T y cada G con una C. Toca «Enrollar» para verla como hélice.')
          : `${arn ? 'Eres la ARN polimerasa: pon' : 'Pon'} la pareja de ${molde[puestas.length]} (botón o tecla). Llevas ${puestas.length} de ${N}.`)}
      </p>
    </div>
  )
}
