import { useEffect, useRef, useState } from 'react'

// Armar la mezcla eléctrica de un país: cada fuente tiene bloques de capacidad (0–10). La demanda es de 10 bloques.
// Teclas: 1–4 eligen la fuente, A/D quitan o ponen un bloque, N activa un año de El Niño. Modelo muy simplificado:
// con El Niño la hidráulica rinde al 60 %; solar y eólica no producen de noche o sin viento, por eso más de 4 bloques
// de ellas sin respaldo deja riesgo de apagón en esas horas.

const FUENTES = [
  { id: 'hidro', n: 'Hidráulica', ic: '💧', co2: 0.1, c: '#2f7fc1' },
  { id: 'termica', n: 'Térmica (gas y carbón)', ic: '🏭', co2: 1, c: '#6a6a6a' },
  { id: 'solar', n: 'Solar', ic: '☀️', co2: 0, c: '#e0a800' },
  { id: 'eolica', n: 'Eólica', ic: '🌬️', co2: 0, c: '#3f9a8a' },
] as const
const DEMANDA = 10

export default function MezclaElectrica() {
  const [b, setB] = useState([6, 3, 1, 0])
  const [sel, setSel] = useState(0)
  const [nino, setNino] = useState(false)
  const selRef = useRef(0)
  selRef.current = sel
  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      const t = e.key.toLowerCase()
      const n = Number(t) - 1
      if (n >= 0 && n < 4) setSel(n)
      if (t === 'n') setNino((v) => !v)
      if (t === 'a' || t === 'd') setB((x) => x.map((v, k) => (k === selRef.current ? Math.max(0, Math.min(10, v + (t === 'd' ? 1 : -1))) : v)))
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [])

  const produce = b.map((v, k) => (k === 0 && nino ? v * 0.6 : v))
  const total = produce.reduce((a, v) => a + v, 0)
  const variable = b[2] + b[3]
  const respaldo = produce[0] + produce[1]
  const co2 = b.reduce((a, v, k) => a + v * FUENTES[k].co2, 0)
  const falta = total < DEMANDA - 0.01
  const noche = variable > 4 && respaldo < DEMANDA - 0.01
  const cambiar = (k: number, d: number) => setB((x) => x.map((v, j) => (j === k ? Math.max(0, Math.min(10, v + d)) : v)))

  let x = 40
  return (
    <div data-diagrama className="flex flex-col items-center gap-3">
      <svg viewBox="0 0 600 200" role="img" aria-label={`Mezcla eléctrica: produce ${total.toFixed(1)} de ${DEMANDA}`} className="mx-auto w-full max-w-3xl">
        <rect x="0" y="0" width="600" height="200" fill={nino ? '#f6ecd8' : '#eef3f6'} style={{ transition: 'fill 0.6s' }} />
        <text x="40" y="40" fontSize="14" fontWeight="800" fill="#3a3a3a">Energía producida {nino ? '(año de El Niño)' : '(año normal)'}</text>
        {produce.map((v, k) => {
          const w = v * 36
          const g = <g key={k}><rect x={x} y="60" width={w} height="50" fill={FUENTES[k].c} style={{ transition: 'all 0.5s' }} />{v >= 1 && <text x={x + w / 2} y="92" textAnchor="middle" fontSize="18">{FUENTES[k].ic}</text>}</g>
          x += w
          return g
        })}
        <line x1={40 + DEMANDA * 36} y1="50" x2={40 + DEMANDA * 36} y2="125" stroke="#c43c3c" strokeWidth="3" strokeDasharray="6 4" />
        <text x={40 + DEMANDA * 36} y="142" textAnchor="middle" fontSize="12" fontWeight="800" fill="#c43c3c">lo que necesita el país</text>
        <text x="40" y="180" fontSize="14" fontWeight="800" fill="#3a3a3a">CO₂: </text>
        <rect x="80" y="167" width={Math.max(2, co2 * 30)} height="16" rx="4" fill={co2 > 4.5 ? "#c43c3c" : co2 > 3 ? '#e08a2e' : '#3f9a5a'} style={{ transition: 'all 0.5s' }} />
      </svg>
      <p aria-live="polite" className="max-w-3xl text-center text-lg">
        {falta ? <>⚠️ <strong>No alcanza:</strong> habría racionamiento o apagones.</>
          : noche ? <>🌙 Alcanza de día, pero <strong>en la noche o sin viento faltaría energía</strong>: hace falta respaldo o baterías.</>
          : co2 > 4.5 ? <>✅ Alcanza, pero <strong>emite mucho CO₂</strong>.</>
          : <>✅ <strong>Alcanza</strong> y emite poco. {nino ? '¡Aguanta El Niño!' : 'Prueba con El Niño (N).'}</>}
      </p>
      <div className="grid w-full max-w-3xl grid-cols-2 gap-2 md:grid-cols-4">
        {FUENTES.map((f, k) => (
          <div key={f.id} onClick={() => setSel(k)} className={`rounded-xl border-2 bg-white p-2 text-center ${k === sel ? 'border-[#e0a800]' : 'border-gray-200'}`}>
            <div className="font-bold"><span className="mr-1 rounded bg-gray-700 px-1.5 text-white">{k + 1}</span>{f.ic} {f.n}</div>
            <div className="mt-1 flex items-center justify-center gap-2">
              <button onClick={() => cambiar(k, -1)} className="rounded-lg border px-3 text-xl font-black" aria-label={`Quitar ${f.n}`}>−</button>
              <span className="w-6 text-xl font-black">{b[k]}</span>
              <button onClick={() => cambiar(k, 1)} className="rounded-lg border px-3 text-xl font-black" aria-label={`Poner ${f.n}`}>+</button>
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => setNino((v) => !v)} className={`rounded-xl border-2 px-3 py-1.5 font-bold ${nino ? 'border-[#c43c3c] bg-[#fbeaea]' : 'border-gray-300 bg-white'}`}>
        <span className="mr-1 rounded bg-gray-700 px-1.5 text-white">N</span>{nino ? '☀️ Año de El Niño' : '🌦️ Año normal'}
      </button>
      <p className="text-sm text-gray-600">1–4 eligen la fuente; A y D quitan o ponen un bloque.</p>
    </div>
  )
}
