import { useEffect, useState } from 'react'

// Un río que baja por cinco tramos: nacimiento, finca cafetera, pueblo, cultivos y mina. En cada tramo (salvo el
// nacimiento) se puede activar una solución con las teclas 1–4. Se ve el oxígeno disuelto, el color del agua y quién
// vive en cada tramo. Modelo cualitativo: los números solo sirven para comparar.

const TRAMOS = [
  { n: 'Nacimiento', ic: '🌳', fuente: '', sol: '', o2: 0, barro: 0, toxico: false },
  { n: 'Finca cafetera', ic: '☕', fuente: 'aguas mieles del café', sol: 'Tratar las mieles', o2: -3, barro: 0.1, toxico: false },
  { n: 'Pueblo', ic: '🏘️', fuente: 'aguas negras', sol: 'Planta de tratamiento (PTAR)', o2: -3.5, barro: 0.2, toxico: false },
  { n: 'Cultivos', ic: '🌽', fuente: 'abonos y pesticidas', sol: 'Árboles en la orilla y menos químicos', o2: -1, barro: 0.2, toxico: true },
  { n: 'Mina', ic: '⛏️', fuente: 'barro y mercurio', sol: 'Sin minería en el río', o2: -0.5, barro: 0.6, toxico: true },
]
const RECUPERA = 1.2 // el río recupera algo de oxígeno en cada tramo (se airea)

export default function RioContaminado() {
  const [sol, setSol] = useState([false, false, false, false])
  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      const n = Number(e.key) - 1
      if (n >= 0 && n < 4) setSol((s) => s.map((v, k) => (k === n ? !v : v)))
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [])

  // calcular cada tramo río abajo
  let o2 = 9
  let barro = 0
  let toxico = false
  const estado = TRAMOS.map((t, k) => {
    const resuelto = k > 0 && sol[k - 1]
    if (k > 0) o2 = Math.min(9, o2 + RECUPERA)
    o2 = Math.max(0.5, o2 + (resuelto ? t.o2 * 0.1 : t.o2))
    barro = Math.min(1, barro * 0.7 + (resuelto ? t.barro * 0.1 : t.barro))
    toxico = toxico || (t.toxico && !resuelto)
    const quien = toxico && o2 < 5 ? '🪱' : o2 >= 7 && !toxico ? '🪰' : o2 >= 4.5 ? '🐟' : '🪱'
    return { ...t, resuelto, o2, barro, toxico, quien }
  })
  const fin = estado[estado.length - 1]
  const tt = 'all 0.7s ease'

  return (
    <div data-diagrama className="flex flex-col items-center gap-3">
      <svg viewBox="0 0 600 300" role="img" aria-label="Río que baja por cinco tramos" className="mx-auto w-full max-w-3xl">
        <rect x="0" y="0" width="600" height="300" fill="#eef3ea" />
        {estado.map((t, k) => {
          const x = k * 120
          const azul = `rgb(${Math.round(90 + 100 * t.barro + (9 - t.o2) * 6)}, ${Math.round(160 - 30 * t.barro)}, ${Math.round(214 - 140 * t.barro - (9 - t.o2) * 6)})`
          return (
            <g key={t.n}>
              <rect x={x} y="120" width="120" height="70" fill={azul} style={{ transition: tt }} />
              <text x={x + 60} y="60" textAnchor="middle" fontSize="30">{t.ic}</text>
              <text x={x + 60} y="90" textAnchor="middle" fontSize="12" fontWeight="800" fill="#3a3a3a">{t.n}</text>
              {k > 0 && <text x={x + 60} y="108" textAnchor="middle" fontSize="10" fill={t.resuelto ? '#3f9a5a' : '#c43c3c'}>{t.resuelto ? '✓ tratado' : `↓ ${t.fuente}`}</text>}
              <text x={x + 60} y="166" textAnchor="middle" fontSize="26">{t.quien}</text>
              {/* barra de oxígeno */}
              <rect x={x + 40} y={290 - t.o2 * 9} width="40" height={t.o2 * 9} rx="4" fill={t.o2 >= 6 ? '#3f9a5a' : t.o2 >= 4 ? '#e0a800' : '#c43c3c'} style={{ transition: tt }} />
              <text x={x + 60} y={284 - t.o2 * 9} textAnchor="middle" fontSize="11" fontWeight="800" fill="#3a3a3a" style={{ transition: tt }}>{t.o2.toFixed(1).replace('.', ',')}</text>
            </g>
          )
        })}
        <text x="6" y="210" fontSize="10" fill="#666">oxígeno disuelto (mg/L)</text>
      </svg>
      <p aria-live="polite" className="max-w-3xl text-center text-lg">
        Al final del río: {fin.o2 >= 6 && !fin.toxico ? <><strong>agua sana</strong>, con efímeras y peces.</> : fin.o2 >= 4 ? <>el agua está <strong>regular</strong>: sobreviven algunos peces.</> : <>el agua está <strong>muy contaminada</strong>: solo lombrices resistentes.</>}
        {' '}🪰 efímeras = agua limpia · 🐟 peces · 🪱 lombrices = agua contaminada
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {TRAMOS.slice(1).map((t, n) => (
          <button key={t.n} onClick={() => setSol((s) => s.map((v, k) => (k === n ? !v : v)))} className={`rounded-xl border-2 px-3 py-1.5 font-bold ${sol[n] ? 'border-[#3f9a5a] bg-[#eef7f0]' : 'border-gray-300 bg-white'}`}>
            <span className="mr-1 rounded bg-gray-700 px-1.5 text-white">{n + 1}</span>{t.ic} {t.sol}
          </button>
        ))}
      </div>
    </div>
  )
}
