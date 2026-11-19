import { useEffect, useRef, useState } from 'react'

// Tiempo de reacción: espera a que el recuadro se ponga verde y oprime Espacio (o toca). Cinco intentos y promedio.
// Si se oprime antes de tiempo, el intento no cuenta. Sirve para comparar con el reflejo (más rápido porque no pasa
// por el cerebro) y para hablar de lo que vuelve lenta la reacción (cansancio, distracción, alcohol al manejar).

type Estado = 'listo' | 'espera' | 'ya' | 'temprano'

export default function TiempoReaccion() {
  const [estado, setEstado] = useState<Estado>('listo')
  const [tiempos, setTiempos] = useState<number[]>([])
  const inicio = useRef(0)
  const reloj = useRef<number | undefined>(undefined)

  const accion = () => {
    if (estado === 'listo' || estado === 'temprano') {
      if (tiempos.length >= 5) setTiempos([])
      setEstado('espera')
      reloj.current = window.setTimeout(() => { inicio.current = performance.now(); setEstado('ya') }, 1500 + Math.random() * 2500)
    } else if (estado === 'espera') {
      window.clearTimeout(reloj.current)
      setEstado('temprano')
    } else if (estado === 'ya') {
      setTiempos((t) => [...t, Math.round(performance.now() - inicio.current)])
      setEstado('listo')
    }
  }

  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); accion() }
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  })
  useEffect(() => () => window.clearTimeout(reloj.current), [])

  const prom = tiempos.length ? Math.round(tiempos.reduce((a, b) => a + b, 0) / tiempos.length) : 0
  const color = estado === 'ya' ? '#3f9a5a' : estado === 'espera' ? '#c43c3c' : estado === 'temprano' ? '#e0a020' : '#2f6fc1'
  const texto =
    estado === 'ya' ? '¡AHORA!' : estado === 'espera' ? 'Espera el verde…' : estado === 'temprano' ? 'Muy pronto: no cuenta. Otra vez' : tiempos.length >= 5 ? 'Terminaste. Otra ronda' : 'Oprime Espacio para empezar'

  return (
    <div data-diagrama className="flex flex-col items-center gap-3">
      <button onClick={accion} aria-live="polite" className="h-56 w-full max-w-2xl rounded-3xl text-3xl font-black text-white shadow" style={{ background: color, transition: 'background 0.1s' }}>
        {texto}
      </button>
      <div className="flex flex-wrap items-end justify-center gap-2">
        {Array.from({ length: 5 }, (_, k) => (
          <div key={k} className="w-20 rounded-xl border-2 border-gray-300 bg-white p-2 text-center">
            <div className="text-xs text-gray-500">Intento {k + 1}</div>
            <div className="text-xl font-black">{tiempos[k] ? `${tiempos[k]} ms` : '—'}</div>
          </div>
        ))}
        <div className="w-28 rounded-xl border-2 border-[#3f9a5a] bg-[#eef7f0] p-2 text-center">
          <div className="text-xs text-gray-500">Promedio</div>
          <div className="text-xl font-black">{prom ? `${prom} ms` : '—'}</div>
        </div>
      </div>
      <p className="max-w-3xl text-center text-lg">
        {prom
          ? `Tu ojo vio, el cerebro decidió y el dedo se movió en unos ${prom} ms (${(prom / 1000).toFixed(2).replace('.', ',')} s). Un reflejo, que no pasa por el cerebro, tarda unos 50 ms.`
          : 'Ojo → nervio → cerebro → médula → nervio → músculo del dedo.'}
      </p>
      <p className="max-w-3xl text-center text-sm text-gray-600">Espacio o Enter (o tocar el recuadro). Una persona suele tardar entre 200 y 300 ms. El cansancio, el celular y el alcohol vuelven lenta la reacción: a 60 km/h, 0,3 s más son 5 metros más antes de frenar.</p>
    </div>
  )
}
