import { useCallback, useEffect, useState } from 'react'

// Explora (Química área 2, tema 1): el experimento de Rutherford. El estudiante dispara partículas alfa
// contra la lámina de oro y compara lo que predecía el modelo de Thomson con lo que pasó de verdad.

type Modelo = 'thomson' | 'rutherford'
type Tiro = { id: number; y: number; tipo: 'recto' | 'desvio' | 'rebote'; ang: number }

const FOCO = 150
let siguiente = 0

function tirar(modelo: Modelo): Tiro {
  const y = 60 + Math.random() * 180
  const id = siguiente++
  if (modelo === 'thomson') return { id, y, tipo: 'recto', ang: (Math.random() - 0.5) * 0.03 }
  const r = Math.random()
  // Proporciones exageradas para que se vean en pocos tiros: en el experimento real rebotaba ~1 de cada 8000.
  if (r < 0.03) return { id, y, tipo: 'rebote', ang: Math.PI - 0.3 + Math.random() * 0.6 }
  if (r < 0.13) return { id, y, tipo: 'desvio', ang: (Math.random() < 0.5 ? -1 : 1) * (0.3 + Math.random() * 0.8) }
  return { id, y, tipo: 'recto', ang: (Math.random() - 0.5) * 0.04 }
}

function camino(t: Tiro) {
  const xl = 300
  const fx = xl + Math.cos(t.ang) * 260
  const fy = t.y + Math.sin(t.ang) * 260
  return `M 40 ${t.y} L ${xl} ${t.y} L ${fx} ${fy}`
}

const COLOR = { recto: '#c43c3c', desvio: '#3f6fb8', rebote: '#d9a520' }

export default function LaminaOro() {
  const [modelo, setModelo] = useState<Modelo>('thomson')
  const [tiros, setTiros] = useState<Tiro[]>([])
  const [cuenta, setCuenta] = useState({ recto: 0, desvio: 0, rebote: 0 })
  const [zoom, setZoom] = useState(false)

  const disparar = useCallback((n: number) => {
    const nuevos = Array.from({ length: n }, () => tirar(modelo))
    setTiros((v) => [...v, ...nuevos].slice(-60))
    setCuenta((c) => {
      const s = { ...c }
      nuevos.forEach((t) => { s[t.tipo]++ })
      return s
    })
  }, [modelo])

  const cambiar = useCallback((m: Modelo) => {
    setModelo(m)
    setTiros([])
    setCuenta({ recto: 0, desvio: 0, rebote: 0 })
  }, [])

  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      const t = e.key.toLowerCase()
      if (t === ' ' || t === 'f') { e.preventDefault(); disparar(1) }
      if (t === 'd') disparar(10)
      if (t === 't') cambiar('thomson')
      if (t === 'r') cambiar('rutherford')
      if (t === 'z') setZoom((z) => !z)
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [disparar, cambiar])

  const total = cuenta.recto + cuenta.desvio + cuenta.rebote
  const boton = (activo: boolean) =>
    `rounded-full border px-3 py-1 text-sm font-semibold ${activo ? 'bg-[var(--acento)] text-white' : 'bg-white'}`

  return (
    <div data-diagrama className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap justify-center gap-2">
        <button onClick={() => cambiar('thomson')} className={boton(modelo === 'thomson')}>Lo que esperaba Thomson (T)</button>
        <button onClick={() => cambiar('rutherford')} className={boton(modelo === 'rutherford')}>Lo que pasó de verdad (R)</button>
        <button onClick={() => setZoom((z) => !z)} className={boton(zoom)}>🔍 Ver un átomo de cerca (Z)</button>
      </div>
      <svg viewBox="0 0 600 300" role="img" aria-label={`Lámina de oro, modelo de ${modelo}`} className="mx-auto w-full max-w-3xl">
        <style>{'@keyframes lo-traza{from{stroke-dashoffset:600}to{stroke-dashoffset:0}} .lo-t{stroke-dasharray:600;animation:lo-traza .9s ease-out forwards}'}</style>
        <rect width="600" height="300" rx="14" fill="#f5f1e6" />
        {!zoom && (
          <g>
            <rect x="10" y="130" width="34" height="40" rx="4" fill="#666" />
            <text x="27" y="190" textAnchor="middle" fontSize="10" fontWeight="700">fuente α</text>
            <circle cx="300" cy={FOCO} r="135" fill="none" stroke="#bfe3c4" strokeWidth="10" opacity="0.6" />
            <text x="440" y="24" textAnchor="middle" fontSize="10" fontWeight="700" fill="#4f8a3c">pantalla que brilla donde llega la partícula</text>
            <rect x="296" y="50" width="8" height="200" fill="#d9a520" />
            <text x="300" y="268" textAnchor="middle" fontSize="11" fontWeight="700">lámina de oro</text>
            {tiros.map((t) => <path key={t.id} d={camino(t)} className="lo-t" fill="none" stroke={COLOR[t.tipo]} strokeWidth={t.tipo === 'recto' ? 1.2 : 2.4} opacity={t.tipo === 'recto' ? 0.55 : 0.95} />)}
          </g>
        )}
        {zoom && modelo === 'thomson' && (
          <g>
            <circle cx="300" cy="150" r="100" fill="#f2c6cf" stroke="#c48a96" strokeWidth="3" />
            {[[-40, -30], [30, -50], [50, 10], [-10, 20], [-60, 40], [20, 60]].map(([x, y], k) => <circle key={k} cx={300 + x} cy={150 + y} r="9" fill="#3f6fb8" />)}
            <path d="M 60 120 L 540 122" stroke="#c43c3c" strokeWidth="3" fill="none" />
            <text x="300" y="280" textAnchor="middle" fontSize="13" fontWeight="700">La carga positiva está repartida: nada es tan fuerte como para desviar la alfa.</text>
          </g>
        )}
        {zoom && modelo === 'rutherford' && (
          <g>
            <circle cx="300" cy="150" r="110" fill="none" stroke="#ccc" strokeDasharray="4 6" />
            <circle cx="300" cy="150" r="5" fill="#c43c3c" />
            <path d="M 60 80 L 540 80" stroke="#c43c3c" strokeWidth="2" fill="none" opacity="0.6" />
            <path d="M 60 140 Q 290 142 360 60" stroke="#3f6fb8" strokeWidth="2.5" fill="none" />
            <path d="M 60 150 L 292 150 L 60 175" stroke="#d9a520" strokeWidth="2.5" fill="none" />
            <path d="M 60 220 L 540 220" stroke="#c43c3c" strokeWidth="2" fill="none" opacity="0.6" />
            <text x="300" y="280" textAnchor="middle" fontSize="13" fontWeight="700">Toda la carga positiva en un punto diminuto: solo las alfa que pasan cerca se desvían.</text>
          </g>
        )}
      </svg>
      {!zoom && (
        <>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button onClick={() => disparar(1)} className="rounded-full bg-[var(--acento)] px-4 py-1 text-sm font-semibold text-white">Disparar 1 (espacio)</button>
            <button onClick={() => disparar(10)} className="rounded-full border bg-white px-4 py-1 text-sm font-semibold">Disparar 10 (D)</button>
          </div>
          <p className="text-sm">
            <span style={{ color: COLOR.recto }}>● Pasan derecho: {cuenta.recto}</span> ·{' '}
            <span style={{ color: COLOR.desvio }}>● Se desvían: {cuenta.desvio}</span> ·{' '}
            <span style={{ color: '#a8822f' }}>● Rebotan: {cuenta.rebote}</span>
            {total > 0 && <> · de {total}</>}
          </p>
        </>
      )}
      <p className="max-w-xl text-center text-xs opacity-70">
        {modelo === 'thomson'
          ? 'Con el budín con pasas, todas las alfa deberían pasar casi derecho. Cambia a «Lo que pasó de verdad» (R).'
          : 'Rutherford: «fue como disparar una bala de cañón a un papel y que rebotara». Aquí se exageran los rebotes para verlos; en el experimento real era casi 1 de cada 8000.'}
      </p>
    </div>
  )
}
