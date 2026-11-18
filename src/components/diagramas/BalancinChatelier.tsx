import { useEffect, useRef, useState } from 'react'

// Explora (Química área 4, tema 7): balancín de Le Chatelier con N₂O₄ (incoloro) ⇌ 2 NO₂ (marrón), reacción
// endotérmica en el sentido directo. 1 agrega N₂O₄, 2 agrega NO₂, 3 retira la mitad del NO₂, W/S calienta o enfría,
// A/D cambia el volumen (presión), R reinicia. Después de cada cambio el sistema vuelve al equilibrio poco a poco.

const K298 = 4.6e-3, DH = 57000, R = 8.314
const Kc = (T: number) => K298 * Math.exp((-DH / R) * (1 / T - 1 / 298))
const VOLS = [0.5, 1, 2, 4]
const f = (x: number, d = 3) => x.toLocaleString('es-CO', { maximumFractionDigits: d })

function extensionEq(a: number, b: number, k: number, V: number) {
  // (b + 2x)² = k·V·(a − x)
  const kv = k * V
  const B = 4 * b + kv, C = b * b - kv * a
  return (-B + Math.sqrt(B * B - 16 * C)) / 8
}

export default function BalancinChatelier() {
  const [T, setT] = useState(298)
  const [vi, setVi] = useState(1)
  const [, setCuadro] = useState(0)
  const est = useRef({ a: 0.1, b: 0 })
  const [aviso, setAviso] = useState('')
  const V = VOLS[vi]
  const conf = useRef({ T, V })
  conf.current = { T, V }

  useEffect(() => {
    let raf = 0
    const paso = () => {
      const { a, b } = est.current
      const x = extensionEq(a, b, Kc(conf.current.T), conf.current.V)
      const dx = x * 0.04
      if (Math.abs(x) > 1e-6) est.current = { a: a - dx, b: b + 2 * dx }
      setCuadro((c) => c + 1)
      raf = requestAnimationFrame(paso)
    }
    raf = requestAnimationFrame(paso)
    return () => cancelAnimationFrame(raf)
  }, [])

  const accion = (k: string) => {
    const e = est.current
    if (k === '1') { est.current = { ...e, a: e.a + 0.05 }; setAviso('Agregaste N₂O₄: se corre hacia el NO₂ →') }
    if (k === '2') { est.current = { ...e, b: e.b + 0.05 }; setAviso('Agregaste NO₂: se corre hacia el N₂O₄ ←') }
    if (k === '3') { est.current = { ...e, b: e.b / 2 }; setAviso('Retiraste NO₂: se corre hacia el NO₂ →') }
    if (k === 'w') { setT((v) => Math.min(373, v + 15)); setAviso('Calentaste: la reacción absorbe calor → más NO₂') }
    if (k === 's') { setT((v) => Math.max(268, v - 15)); setAviso('Enfriaste: se favorece la que libera calor ← más N₂O₄') }
    if (k === 'a') { setVi((v) => Math.max(0, v - 1)); setAviso('Comprimiste (más presión): se corre hacia menos moléculas de gas ← N₂O₄') }
    if (k === 'd') { setVi((v) => Math.min(VOLS.length - 1, v + 1)); setAviso('Expandiste (menos presión): se corre hacia más moléculas de gas → NO₂') }
    if (k === 'r') { est.current = { a: 0.1, b: 0 }; setT(298); setVi(1); setAviso('') }
  }
  useEffect(() => {
    const alTeclear = (ev: KeyboardEvent) => accion(ev.key.toLowerCase())
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  })

  const { a, b } = est.current
  const k = Kc(T)
  const cA = a / V, cB = b / V
  const Q = cA > 0 ? (cB * cB) / cA : Infinity
  const falta = extensionEq(a, b, k, V)
  const moviendo = Math.abs(falta) > 0.0005
  const giro = Math.max(-18, Math.min(18, (b / (a + b + 1e-9) - 0.5) * 36))
  const marron = Math.min(0.85, cB * 6)
  const nA = Math.round(a * 120), nB = Math.round(b * 120)
  const caja = 150 * Math.sqrt(V)

  return (
    <div data-diagrama className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap items-center justify-center gap-4">
        <svg viewBox="0 0 320 320" className="w-72" role="img" aria-label={`Recipiente con ${f(a)} mol de N₂O₄ y ${f(b)} mol de NO₂`}>
          <rect x={160 - caja / 2} y={300 - caja} width={caja} height={caja} fill={`rgba(150, 70, 20, ${marron})`} stroke="#3a3a3a" strokeWidth="3" style={{ transition: 'all 0.6s' }} />
          {Array.from({ length: Math.min(nA, 40) }, (_, j) => {
            const x = 160 - caja / 2 + 10 + ((j * 47) % (caja - 20)), y = 300 - caja + 10 + ((j * 29) % (caja - 20))
            return <g key={`a${j}`}><circle cx={x} cy={y} r="4" fill="#3f6fb8" /><circle cx={x + 7} cy={y} r="4" fill="#3f6fb8" /></g>
          })}
          {Array.from({ length: Math.min(nB, 60) }, (_, j) => (
            <circle key={`b${j}`} cx={160 - caja / 2 + 8 + ((j * 61) % (caja - 16))} cy={300 - caja + 8 + ((j * 37) % (caja - 16))} r="4" fill="#c43c3c" />
          ))}
          <text x="160" y={290 - caja} textAnchor="middle" fontSize="13" fontWeight="800">{T} K · {V} L</text>
        </svg>
        <div className="flex flex-col items-center gap-2">
          <svg viewBox="0 0 260 130" className="w-64" role="img" aria-label="Balancín del equilibrio">
            <path d="M130 90 l-16 34 h32 z" fill="#8a6a44" />
            <g style={{ transition: 'transform 0.4s', transformOrigin: '130px 90px', transform: `rotate(${giro}deg)` }}>
              <rect x="20" y="84" width="220" height="8" rx="3" fill="#6b4f2a" />
              <rect x="25" y="52" width="70" height="32" rx="6" fill="#3f6fb8" /><text x="60" y="73" textAnchor="middle" fontSize="12" fontWeight="800" fill="#fff">N₂O₄</text>
              <rect x="165" y="52" width="70" height="32" rx="6" fill="#c43c3c" /><text x="200" y="73" textAnchor="middle" fontSize="12" fontWeight="800" fill="#fff">2 NO₂</text>
            </g>
            <text x="130" y="20" textAnchor="middle" fontSize="13" fontWeight="900" fill={moviendo ? '#c43c3c' : '#4f8a3c'}>
              {moviendo ? (falta > 0 ? 'reaccionando → se forma NO₂' : 'reaccionando ← se forma N₂O₄') : 'en equilibrio'}
            </text>
          </svg>
          <table className="rounded-xl bg-white text-sm">
            <tbody>
              <tr><td className="px-2 font-semibold">[N₂O₄]</td><td className="px-2 text-right font-black">{f(cA)} M</td></tr>
              <tr><td className="px-2 font-semibold">[NO₂]</td><td className="px-2 text-right font-black">{f(cB)} M</td></tr>
              <tr><td className="px-2 font-semibold">Kc a {T} K</td><td className="px-2 text-right font-black">{f(k, 4)}</td></tr>
              <tr><td className="px-2 font-semibold">Q = [NO₂]² / [N₂O₄]</td><td className="px-2 text-right font-black">{Number.isFinite(Q) ? f(Q, 4) : '∞'}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      {aviso && <p className="rounded-xl border-2 border-[var(--acento)] bg-white px-4 py-2 text-center font-semibold">{aviso}</p>}
      <div className="flex flex-wrap justify-center gap-2">
        {[['1', '+ N₂O₄ (1)'], ['2', '+ NO₂ (2)'], ['3', 'Retirar NO₂ (3)'], ['s', 'Enfriar (S)'], ['w', 'Calentar (W)'], ['a', 'Comprimir (A)'], ['d', 'Expandir (D)'], ['r', 'Reiniciar (R)']].map(([k2, t]) => (
          <button key={k2} onClick={() => accion(k2)} className="rounded-full border bg-white px-3 py-1 text-sm font-semibold">{t}</button>
        ))}
      </div>
      <p className="max-w-xl text-center text-xs opacity-70">N₂O₄ (incoloro, azul en el dibujo) ⇌ 2 NO₂ (marrón, rojo en el dibujo), absorbe calor hacia la derecha. El color del recipiente muestra cuánto NO₂ hay. Cuando Q = Kc, el sistema está en equilibrio. Valores aproximados.</p>
    </div>
  )
}
