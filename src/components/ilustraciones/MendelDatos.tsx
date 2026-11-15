import { useEffect, useState } from 'react'
import { Semilla } from './Semilla.tsx'

// Dibujos animados para las tarjetas de «Un monje que contaba semillas» (área 2, herencia mendeliana).
// Se montan cuando la tarjeta aparece, así que la animación arranca en ese momento.

function useCuenta(desde: number, hasta: number, ms: number) {
  const [n, setN] = useState(desde)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setN(hasta)
      return
    }
    const t0 = performance.now()
    let id = 0
    const paso = (t: number) => {
      const p = Math.min(1, (t - t0) / ms)
      setN(Math.round(desde + (hasta - desde) * (1 - (1 - p) ** 3)))
      if (p < 1) id = requestAnimationFrame(paso)
    }
    id = requestAnimationFrame(paso)
    return () => cancelAnimationFrame(id)
  }, [desde, hasta, ms])
  return n
}

const CSS = `
.md-aguja { transform-origin: 100px 92px; animation: md-gira 3.2s cubic-bezier(.5,0,.3,1) both }
.md-corta { transform-origin: 100px 92px; animation: md-gira-lento 3.2s cubic-bezier(.5,0,.3,1) both }
@keyframes md-gira { from { transform: rotate(0) } to { transform: rotate(2880deg) } }
@keyframes md-gira-lento { from { transform: rotate(0) } to { transform: rotate(240deg) } }
.md-semilla { transform-box: fill-box; transform-origin: center; animation: md-cae 1.6s ease-in infinite }
@keyframes md-cae { 0% { transform: translateY(-60px); opacity: 0 } 20% { opacity: 1 } 70% { transform: translateY(0); opacity: 1 } 100% { transform: translateY(0); opacity: 0 } }
@media (prefers-reduced-motion: reduce) { .md-aguja, .md-corta, .md-semilla { animation: none } }
`

/** Reloj que da ocho vueltas mientras los años pasan de 1856 a 1863. */
export function RelojAnios() {
  const anio = useCuenta(1856, 1863, 3200)
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label="Reloj: de 1856 a 1863" className="h-full w-full">
      <style>{CSS}</style>
      <rect width="200" height="200" fill="#f3ead6" />
      <circle cx="100" cy="92" r="64" fill="#fffaf0" stroke="#3a4450" strokeWidth="6" />
      {Array.from({ length: 12 }, (_, k) => {
        const a = (k / 12) * Math.PI * 2
        return <line key={k} x1={100 + 52 * Math.sin(a)} y1={92 - 52 * Math.cos(a)} x2={100 + 58 * Math.sin(a)} y2={92 - 58 * Math.cos(a)} stroke="#3a4450" strokeWidth={k % 3 ? 2 : 4} strokeLinecap="round" />
      })}
      <line className="md-corta" x1="100" y1="92" x2="100" y2="62" stroke="#3a4450" strokeWidth="6" strokeLinecap="round" />
      <line className="md-aguja" x1="100" y1="92" x2="100" y2="44" stroke="#0f6b5c" strokeWidth="4" strokeLinecap="round" />
      <circle cx="100" cy="92" r="6" fill="#0f6b5c" />
      <rect x="52" y="164" width="96" height="28" rx="14" fill="#0f6b5c" />
      <text x="100" y="184" textAnchor="middle" fontSize="18" fontWeight="800" fill="#fff">{anio}</text>
    </svg>
  )
}

/** Vaina con semillas que caen y un contador que sube hasta unas 28 000 plantas. */
export function ContadorPlantas() {
  const n = useCuenta(0, 28000, 3000)
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label="Unas 28 000 plantas" className="h-full w-full">
      <style>{CSS}</style>
      <rect width="200" height="200" fill="#eef2e6" />
      {[50, 78, 106, 134].map((x, k) => (
        <g key={x} className="md-semilla" style={{ animationDelay: `${k * 0.35}s` }}>
          <Semilla x={x + 8} y={86} r={12} amarilla={k !== 2} />
        </g>
      ))}
      <path d="M 26 92 Q 100 132 174 92 Q 100 116 26 92 Z" fill="#a8cf6b" stroke="#5c8a2e" strokeWidth="3" />
      <path d="M 174 92 q 10 -8 8 -20" fill="none" stroke="#5c8a2e" strokeWidth="3" strokeLinecap="round" />
      <text x="100" y="170" textAnchor="middle" fontSize="30" fontWeight="900" fill="#0f6b5c">{n.toLocaleString('es-CO')}</text>
    </svg>
  )
}
