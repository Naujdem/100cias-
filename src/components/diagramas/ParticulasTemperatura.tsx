import { useEffect, useState } from 'react'

// Explora: un control de temperatura (−20 a 120 °C) mueve las partículas del agua.
// Sólido: red ordenada que solo vibra. Líquido: juntas abajo, se deslizan. Gas: separadas y rápidas por toda la caja.

const N = 16
const W = 300
const H = 220

function azar(sem: number) {
  const x = Math.sin(sem * 127.1) * 43758.5453
  return x - Math.floor(x)
}

function estado(t: number) {
  if (t < 0) return { id: 'solido', nombre: 'Sólido (hielo)', texto: 'Las partículas están muy juntas, ordenadas, y solo vibran en su sitio. Forma y volumen fijos.' }
  if (t < 100) return { id: 'liquido', nombre: 'Líquido (agua)', texto: 'Siguen juntas, pero se deslizan unas sobre otras. Volumen fijo; toma la forma del recipiente.' }
  return { id: 'gas', nombre: 'Gas (vapor)', texto: 'Muy separadas y rápidas; ocupan todo el recipiente. Ni forma ni volumen fijos.' }
}

export default function ParticulasTemperatura() {
  const [t, setT] = useState(-10)
  const [tic, setTic] = useState(0)
  const e = estado(t)
  useEffect(() => {
    const id = window.setInterval(() => setTic((v) => v + 1), e.id === 'gas' ? 250 : 400)
    return () => window.clearInterval(id)
  }, [e.id])
  // la agitación crece con la temperatura
  const agita = 2 + Math.max(0, t + 20) * 0.08
  const puntos = Array.from({ length: N }, (_, k) => {
    const j = (a: number) => (azar(k * 7 + tic * 13 + a) - 0.5) * 2
    if (e.id === 'solido') {
      const x = 105 + (k % 4) * 30, y = 110 + Math.floor(k / 4) * 30
      return [x + j(1) * agita * 0.5, y + j(2) * agita * 0.5]
    }
    if (e.id === 'liquido') {
      const x = 40 + azar(k * 3 + Math.floor(tic / 3) * 5) * (W - 80), y = 150 + azar(k * 5 + Math.floor(tic / 3) * 11) * 55
      return [x + j(1) * agita, y + j(2) * agita * 0.5]
    }
    return [20 + azar(k * 3 + tic * 17) * (W - 40), 20 + azar(k * 5 + tic * 23) * (H - 40)]
  })
  return (
    <div data-diagrama className="flex flex-col items-center gap-3">
      <div className="flex w-full max-w-xl items-center gap-3">
        <span className="text-sm font-bold">−20 °C</span>
        <input type="range" min={-20} max={120} step={5} value={t} onChange={(ev) => setT(Number(ev.target.value))}
          aria-label="Temperatura en grados Celsius" className="h-3 w-full accent-[var(--acento)]" />
        <span className="text-sm font-bold">120 °C</span>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {[[-10, 'Congelador'], [25, 'Ambiente'], [80, 'Olla caliente'], [110, 'Vapor']].map(([v, n]) => (
          <button key={n} type="button" onClick={() => setT(Number(v))} className="min-h-10 rounded-full border px-3 text-sm font-semibold">{n}</button>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Partículas del agua a ${t} °C: ${e.nombre}`} className="w-full max-w-md rounded-2xl border-2 bg-white">
          {e.id === 'liquido' && <rect x="0" y="135" width={W} height={H - 135} fill="#d8ebfa" />}
          {puntos.map(([x, y], k) => (
            <g key={k} style={{ transform: `translate(${x}px, ${y}px)`, transition: `transform ${e.id === 'gas' ? 0.25 : 0.4}s linear` }}>
              <circle r="9" fill={e.id === 'solido' ? '#7fb3e0' : e.id === 'liquido' ? '#2f6db3' : '#c43c3c'} opacity="0.9" />
            </g>
          ))}
        </svg>
        <div className="flex max-w-xs flex-col gap-2">
          <div className="rounded-2xl border-2 p-3 text-center"><span className="text-sm opacity-70">Temperatura</span><div className="text-3xl font-black">{t} °C</div></div>
          <div className="rounded-2xl border-2 p-3"><div className="font-black">{e.nombre}</div><p className="text-sm">{e.texto}</p></div>
        </div>
      </div>
      <p aria-live="polite" className="text-center text-sm opacity-80">Usa las flechas del teclado sobre el control. A más temperatura, las partículas se mueven más rápido. (Agua al nivel del mar.)</p>
    </div>
  )
}
