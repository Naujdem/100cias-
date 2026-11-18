import { useCallback, useEffect, useState } from 'react'

// Explora (Química área 2, tema 8): simulador de vida media. 100 núcleos radiactivos; en cada vida media
// cada núcleo tiene 50 % de probabilidad de desintegrarse. Teclas 1–3 cambian el isótopo, espacio avanza
// una vida media, R reinicia.

const ISOTOPOS = [
  { nombre: 'Carbono-14', hijo: 'N-14', t: 5730, unidad: 'años', uso: 'datación de restos de seres vivos' },
  { nombre: 'Yodo-131', hijo: 'Xe-131', t: 8, unidad: 'días', uso: 'tratamiento de la tiroides' },
  { nombre: 'Uranio-238', hijo: 'Th-234', t: 4500, unidad: 'millones de años', uso: 'edad de las rocas' },
]
const N = 100

export default function VidaMedia() {
  const [iso, setIso] = useState(0)
  const [vivos, setVivos] = useState<boolean[]>(() => Array(N).fill(true))
  const [hist, setHist] = useState<number[]>([N])

  const reiniciar = useCallback(() => { setVivos(Array(N).fill(true)); setHist([N]) }, [])
  const avanzar = useCallback(() => {
    if (hist.length > 10) return
    const nuevo = vivos.map((x) => x && Math.random() >= 0.5)
    setVivos(nuevo)
    setHist([...hist, nuevo.filter(Boolean).length])
  }, [vivos, hist])

  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      const n = Number(e.key)
      if (n >= 1 && n <= 3) { setIso(n - 1); reiniciar() }
      if (e.key === ' ') { e.preventDefault(); avanzar() }
      if (e.key.toLowerCase() === 'r') reiniciar()
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [avanzar, reiniciar])

  const I = ISOTOPOS[iso]
  const pasos = hist.length - 1
  const quedan = vivos.filter(Boolean).length
  const tiempo = (pasos * I.t).toLocaleString('es-CO')

  return (
    <div data-diagrama className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap justify-center gap-2">
        {ISOTOPOS.map((x, k) => (
          <button key={x.nombre} onClick={() => { setIso(k); reiniciar() }} className={`rounded-full border px-3 py-1 text-sm font-semibold ${iso === k ? 'bg-[var(--acento)] text-white' : 'bg-white'}`}>{k + 1} · {x.nombre}</button>
        ))}
      </div>
      <div className="grid w-full max-w-4xl items-center gap-4 md:grid-cols-2">
        <div className="mx-auto grid w-full max-w-xs grid-cols-10 gap-1">
          {vivos.map((v, k) => (
            <div key={k} className="aspect-square rounded-full transition-colors duration-700" style={{ background: v ? '#d9a520' : '#c9d2dc' }} title={v ? I.nombre : I.hijo} />
          ))}
        </div>
        <svg viewBox="0 0 260 180" role="img" aria-label="Núcleos que quedan en cada vida media" className="w-full">
          <rect width="260" height="180" rx="10" fill="#f4f1ea" />
          <line x1="30" y1="150" x2="250" y2="150" stroke="#888" /><line x1="30" y1="20" x2="30" y2="150" stroke="#888" />
          {/* curva esperada: 100, 50, 25… */}
          <polyline fill="none" stroke="#9bb0c6" strokeDasharray="4 3" strokeWidth="2"
            points={Array.from({ length: 11 }, (_, k) => `${30 + k * 22},${150 - (N / 2 ** k) * 1.3}`).join(' ')} />
          <polyline fill="none" stroke="#c43c3c" strokeWidth="2.5" points={hist.map((h, k) => `${30 + k * 22},${150 - h * 1.3}`).join(' ')} />
          {hist.map((h, k) => <circle key={k} cx={30 + k * 22} cy={150 - h * 1.3} r="3" fill="#c43c3c" />)}
          <text x="140" y="172" textAnchor="middle" fontSize="10" fontWeight="700">vidas medias</text>
          <text x="20" y="25" textAnchor="end" fontSize="9">100</text><text x="20" y="153" textAnchor="end" fontSize="9">0</text>
          <text x="245" y="35" textAnchor="end" fontSize="9" fill="#c43c3c">tu simulación</text>
          <text x="245" y="48" textAnchor="end" fontSize="9" fill="#6b85a6">lo esperado (la mitad cada vez)</text>
        </svg>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={avanzar} className="rounded-full bg-[var(--acento)] px-4 py-1 text-sm font-semibold text-white">Pasa una vida media (espacio)</button>
        <button onClick={reiniciar} className="rounded-full border bg-white px-4 py-1 text-sm font-semibold">Reiniciar (R)</button>
      </div>
      <div className="rounded-xl border-2 border-[var(--acento)] bg-white px-4 py-2 text-center text-sm">
        <p><b>{I.nombre}</b> → {I.hijo} · vida media: {I.t.toLocaleString('es-CO')} {I.unidad} · se usa en {I.uso}</p>
        <p>Han pasado {pasos} vidas medias ({tiempo} {I.unidad}) · quedan <b>{quedan}</b> de {N} núcleos</p>
      </div>
      <p className="max-w-xl text-center text-xs opacity-70">Nadie puede saber cuándo se desintegrará un núcleo en particular (es al azar), pero en grupo, cada vida media se va más o menos la mitad.</p>
    </div>
  )
}
