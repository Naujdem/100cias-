import { useEffect, useState } from 'react'

// Explora (Química área 3, tema 7): convertidor gramos ↔ moles ↔ partículas con el camino visual.
// A/D cambia la sustancia, teclas 1–3 eligen de qué unidad se parte, W/S cambian la cantidad.

const NA = 6.022e23
const SUST = [
  { nombre: 'Agua', f: 'H₂O', M: 18, p: 'moléculas' },
  { nombre: 'Dióxido de carbono', f: 'CO₂', M: 44, p: 'moléculas' },
  { nombre: 'Sal de cocina', f: 'NaCl', M: 58.5, p: 'unidades NaCl' },
  { nombre: 'Glucosa', f: 'C₆H₁₂O₆', M: 180, p: 'moléculas' },
  { nombre: 'Hierro', f: 'Fe', M: 56, p: 'átomos' },
  { nombre: 'Oro', f: 'Au', M: 197, p: 'átomos' },
  { nombre: 'Cal agrícola', f: 'CaCO₃', M: 100, p: 'unidades CaCO₃' },
  { nombre: 'Oxígeno', f: 'O₂', M: 32, p: 'moléculas' },
]
const VALORES = [
  [1, 5, 10, 18, 36, 50, 100, 250, 1000], // gramos
  [0.01, 0.1, 0.5, 1, 2, 3, 5, 10], // moles
  [1e20, 1e22, 3.011e23, 6.022e23, 1.2044e24, 3.011e24], // partículas
]
const UNIDAD = ['gramos', 'moles', 'partículas']
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹'

function bonito(x: number) {
  if (x === 0) return '0'
  if (Math.abs(x) >= 1e5 || Math.abs(x) < 0.001) {
    const e = Math.floor(Math.log10(Math.abs(x)))
    const m = x / 10 ** e
    const exp = String(e).split('').map((d) => (d === '-' ? '⁻' : SUP[+d])).join('')
    return `${m.toLocaleString('es-CO', { maximumFractionDigits: 3 })} × 10${exp}`
  }
  return x.toLocaleString('es-CO', { maximumFractionDigits: 3 })
}

export default function ConvertidorMol() {
  const [s, setS] = useState(0)
  const [u, setU] = useState(0)
  const [k, setK] = useState(3)
  useEffect(() => {
    const alTeclear = (ev: KeyboardEvent) => {
      const t = ev.key.toLowerCase()
      const n = Number(ev.key)
      if (n >= 1 && n <= 3) { setU(n - 1); setK(3) }
      if (t === 'a') setS((v) => (v + SUST.length - 1) % SUST.length)
      if (t === 'd') setS((v) => (v + 1) % SUST.length)
      if (t === 'w') setK((v) => Math.min(VALORES[u].length - 1, v + 1))
      if (t === 's') setK((v) => Math.max(0, v - 1))
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [u])
  const S = SUST[s]
  const lista = VALORES[u]
  const v = lista[Math.min(k, lista.length - 1)]
  const mol = u === 0 ? v / S.M : u === 1 ? v : v / NA
  const g = mol * S.M, part = mol * NA
  const vals = [g, mol, part]
  const pasos = u === 0
    ? [`${bonito(g)} g ÷ ${bonito(S.M)} g/mol = ${bonito(mol)} mol`, `${bonito(mol)} mol × 6,022 × 10²³ = ${bonito(part)} ${S.p}`]
    : u === 1
      ? [`${bonito(mol)} mol × ${bonito(S.M)} g/mol = ${bonito(g)} g`, `${bonito(mol)} mol × 6,022 × 10²³ = ${bonito(part)} ${S.p}`]
      : [`${bonito(part)} ÷ 6,022 × 10²³ = ${bonito(mol)} mol`, `${bonito(mol)} mol × ${bonito(S.M)} g/mol = ${bonito(g)} g`]
  const color = ['#3f6fb8', '#4f8a3c', '#c43c3c']
  return (
    <div data-diagrama className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap justify-center gap-1">
        {SUST.map((x, j) => <button key={x.f} onClick={() => setS(j)} className={`rounded-full border px-3 py-1 text-sm font-semibold ${s === j ? 'bg-[var(--acento)] text-white' : 'bg-white'}`}>{x.f}</button>)}
      </div>
      <p className="text-sm">{S.nombre} · masa molar <b>{bonito(S.M)} g/mol</b></p>
      <div className="flex flex-wrap items-stretch justify-center gap-2">
        {UNIDAD.map((n, j) => (
          <div key={n} className="flex items-center gap-2">
            {j > 0 && <div className="text-center text-xs font-bold" style={{ color: color[j] }}>{j === 1 ? '÷ M  /  × M' : '× Nₐ  /  ÷ Nₐ'}<br /><span className="text-xl">⇄</span></div>}
            <button onClick={() => { setU(j); setK(3) }} className="w-44 rounded-xl border-2 bg-white px-2 py-3 text-center" style={{ borderColor: u === j ? color[j] : '#ddd', boxShadow: u === j ? `0 0 0 3px ${color[j]}33` : 'none' }}>
              <p className="text-xs font-bold" style={{ color: color[j] }}>{j + 1} · {n.toUpperCase()}{u === j ? ' (partes de aquí)' : ''}</p>
              <p className="text-xl font-black">{bonito(vals[j])}</p>
              <p className="text-xs opacity-70">{j === 0 ? 'g' : j === 1 ? 'mol' : S.p}</p>
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <button onClick={() => setK((x) => Math.max(0, x - 1))} className="rounded-full border bg-white px-4 py-1 text-sm font-semibold">Menos (S)</button>
        <button onClick={() => setK((x) => Math.min(lista.length - 1, x + 1))} className="rounded-full border bg-white px-4 py-1 text-sm font-semibold">Más (W)</button>
      </div>
      <div className="rounded-xl border-2 border-[var(--acento)] bg-white px-4 py-2 text-center">
        {pasos.map((p) => <p key={p} className="font-semibold">{p}</p>)}
      </div>
      <p className="max-w-xl text-center text-xs opacity-70">A/D sustancia · 1–3 elige de qué unidad partes · W/S cambia la cantidad. Siempre se pasa por los moles: son el puente entre lo que se pesa y lo que se cuenta.</p>
    </div>
  )
}
