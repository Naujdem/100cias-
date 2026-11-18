import { useEffect, useState } from 'react'
import { COLOR_ATOMO, VALENCIA } from '../escenas/Molecula.tsx'

// Explora (Química orgánica, tema 1): armador de moléculas en una cuadrícula de 5 × 3.
// Teclado: flechas mueven el cursor; 1 C, 2 H, 3 O, 4 N ponen un átomo; 0 o Supr lo borran;
// D cambia el enlace hacia la derecha y X el de abajo (nada → sencillo → doble → triple); N pasa al siguiente reto.
// Cada átomo dice cuántos enlaces tiene y avisa si no cumple su valencia (C 4, N 3, O 2, H 1).

const COLS = 5, FILAS = 3, PASO = 72, X0 = 50, Y0 = 50
const ELEM = ['C', 'H', 'O', 'N']
const RETOS = [
  { nombre: 'Metano', f: 'CH₄', cuenta: { C: 1, H: 4 } },
  { nombre: 'Etano', f: 'C₂H₆', cuenta: { C: 2, H: 6 } },
  { nombre: 'Eteno', f: 'C₂H₄', cuenta: { C: 2, H: 4 } },
  { nombre: 'Etino', f: 'C₂H₂', cuenta: { C: 2, H: 2 } },
  { nombre: 'Metanol', f: 'CH₄O', cuenta: { C: 1, H: 4, O: 1 } },
  { nombre: 'Etanol', f: 'C₂H₆O', cuenta: { C: 2, H: 6, O: 1 } },
  { nombre: 'Metilamina', f: 'CH₅N', cuenta: { C: 1, H: 5, N: 1 } },
  { nombre: 'Dióxido de carbono', f: 'CO₂', cuenta: { C: 1, O: 2 } },
] as { nombre: string; f: string; cuenta: Record<string, number> }[]

const pos = (k: number) => [X0 + (k % COLS) * PASO, Y0 + Math.floor(k / COLS) * PASO]
const clave = (a: number, b: number) => `${Math.min(a, b)}-${Math.max(a, b)}`

export default function ArmadorMoleculas() {
  const [celdas, setCeldas] = useState<(string | null)[]>(() => Array(COLS * FILAS).fill(null))
  const [enl, setEnl] = useState<Record<string, number>>({})
  const [cur, setCur] = useState(7)
  const [elem, setElem] = useState('C')
  const [reto, setReto] = useState(0)

  const poner = (k: number, e: string | null) => {
    setCeldas((c) => c.map((v, j) => (j === k ? e : v)))
    if (!e) setEnl((m) => Object.fromEntries(Object.entries(m).filter(([kk]) => !kk.split('-').map(Number).includes(k))))
  }
  const ciclar = (a: number, b: number) => setEnl((m) => ({ ...m, [clave(a, b)]: ((m[clave(a, b)] ?? 0) + 1) % 4 }))
  const reiniciar = () => { setCeldas(Array(COLS * FILAS).fill(null)); setEnl({}) }

  useEffect(() => {
    const alTeclear = (ev: KeyboardEvent) => {
      const k = ev.key
      if (k === 'ArrowRight') setCur((c) => (c % COLS < COLS - 1 ? c + 1 : c))
      else if (k === 'ArrowLeft') setCur((c) => (c % COLS > 0 ? c - 1 : c))
      else if (k === 'ArrowDown') setCur((c) => (c + COLS < COLS * FILAS ? c + COLS : c))
      else if (k === 'ArrowUp') setCur((c) => (c - COLS >= 0 ? c - COLS : c))
      else if (['1', '2', '3', '4'].includes(k)) { const e = ELEM[Number(k) - 1]; setElem(e); setCeldas((c) => c.map((v, j) => (j === cur ? e : v))) }
      else if (k === '0' || k === 'Delete' || k === 'Backspace') poner(cur, null)
      else if (k.toLowerCase() === 'd' && cur % COLS < COLS - 1) ciclar(cur, cur + 1)
      else if (k.toLowerCase() === 'x' && cur + COLS < COLS * FILAS) ciclar(cur, cur + COLS)
      else if (k.toLowerCase() === 'n') { setReto((r) => (r + 1) % RETOS.length); reiniciar() }
      else if (k.toLowerCase() === 'r') reiniciar()
      else return
      ev.preventDefault()
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  })

  // enlaces válidos: solo entre dos celdas ocupadas
  const enlaces = Object.entries(enl).filter(([kk, o]) => o > 0 && kk.split('-').every((j) => celdas[Number(j)])).map(([kk, o]) => [...kk.split('-').map(Number), o] as [number, number, number])
  const usados = (k: number) => enlaces.filter(([a, b]) => a === k || b === k).reduce((s, e) => s + e[2], 0)
  const ocupadas = celdas.map((c, k) => (c ? k : -1)).filter((k) => k >= 0)
  const malos = ocupadas.filter((k) => usados(k) !== VALENCIA[celdas[k]!])
  // ¿todo conectado?
  const vistos = new Set<number>()
  const pila = ocupadas.slice(0, 1)
  while (pila.length) { const a = pila.pop()!; if (vistos.has(a)) continue; vistos.add(a); enlaces.forEach(([x, y]) => { if (x === a) pila.push(y); if (y === a) pila.push(x) }) }
  const cuenta: Record<string, number> = {}
  ocupadas.forEach((k) => { cuenta[celdas[k]!] = (cuenta[celdas[k]!] ?? 0) + 1 })
  const R = RETOS[reto]
  const igual = Object.keys({ ...cuenta, ...R.cuenta }).every((e) => (cuenta[e] ?? 0) === (R.cuenta[e] ?? 0))
  const logrado = ocupadas.length > 0 && malos.length === 0 && vistos.size === ocupadas.length && igual
  const formula = ['C', 'H', 'O', 'N'].filter((e) => cuenta[e]).map((e) => e + (cuenta[e] > 1 ? String(cuenta[e]).replace(/\d/g, (d) => '₀₁₂₃₄₅₆₇₈₉'[Number(d)]) : '')).join('')

  return (
    <div data-diagrama className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
        <span className="font-semibold">Reto:</span>
        <button onClick={() => { setReto((r) => (r + 1) % RETOS.length); reiniciar() }} className="rounded-full border bg-white px-3 py-1 font-bold">{R.nombre} · {R.f} (N)</button>
        <span className="ml-2 font-semibold">Átomo:</span>
        {ELEM.map((e, j) => <button key={e} onClick={() => setElem(e)} className={`rounded-full border px-3 py-1 font-bold ${elem === e ? 'bg-[var(--acento)] text-white' : 'bg-white'}`}>{j + 1} · {e}</button>)}
      </div>
      <svg viewBox="0 0 390 200" className="w-full max-w-xl rounded-xl bg-white" role="img" aria-label="Cuadrícula para armar moléculas">
        {Array.from({ length: COLS * FILAS }, (_, k) => {
          const [x, y] = pos(k)
          return (
            <g key={k}>
              {k % COLS < COLS - 1 && <rect x={x + 14} y={y - 8} width={PASO - 28} height="16" fill="transparent" className="cursor-pointer" onClick={() => ciclar(k, k + 1)} />}
              {k + COLS < COLS * FILAS && <rect x={x - 8} y={y + 14} width="16" height={PASO - 28} fill="transparent" className="cursor-pointer" onClick={() => ciclar(k, k + COLS)} />}
              <circle cx={x} cy={y} r="18" fill={k === cur ? '#fdf1c7' : '#f4f1ea'} stroke={k === cur ? '#d9a400' : '#ddd'} strokeWidth="2" className="cursor-pointer" onClick={() => { setCur(k); poner(k, celdas[k] === elem ? null : elem) }} />
            </g>
          )
        })}
        {enlaces.map(([a, b, o]) => {
          const [x1, y1] = pos(a), [x2, y2] = pos(b)
          const hor = y1 === y2
          return [-1, 0, 1].slice(o === 2 ? 0 : 0, 3).filter((d) => (o === 1 ? d === 0 : o === 2 ? d !== 0 : true)).map((d) => (
            <line key={`${a}-${b}-${d}`} x1={x1 + (hor ? 0 : d * 5)} y1={y1 + (hor ? d * 5 : 0)} x2={x2 + (hor ? 0 : d * 5)} y2={y2 + (hor ? d * 5 : 0)} stroke="#3a3a3a" strokeWidth="3" pointerEvents="none" />
          ))
        })}
        {ocupadas.map((k) => {
          const [x, y] = pos(k), e = celdas[k]!, ok = !malos.includes(k)
          return (
            <g key={k} pointerEvents="none">
              <circle cx={x} cy={y} r={e === 'H' ? 11 : 15} fill={COLOR_ATOMO[e]} stroke={ok ? '#4f8a3c' : '#c43c3c'} strokeWidth="3" />
              <text x={x} y={y + 4} textAnchor="middle" fontSize="12" fontWeight="800" fill={e === 'H' ? '#3a3a3a' : '#fff'}>{e}</text>
              <text x={x + 17} y={y - 13} fontSize="9" fontWeight="800" fill={ok ? '#4f8a3c' : '#c43c3c'}>{usados(k)}/{VALENCIA[e]}</text>
            </g>
          )
        })}
      </svg>
      <p className={`text-sm font-bold ${logrado ? 'text-green-700' : ''}`}>
        {logrado ? `¡Listo! Armaste ${R.nombre} (${R.f}): cada átomo cumple su valencia.`
          : ocupadas.length === 0 ? 'Pon un átomo con 1–4 o tocando un círculo.'
          : malos.length ? `Revisa ${malos.length} átomo(s) en rojo: C hace 4 enlaces, N 3, O 2 y H 1.`
          : vistos.size !== ocupadas.length ? 'Hay átomos sueltos: une todo en una sola molécula.'
          : `Tienes ${formula}; el reto pide ${R.f}.`}
      </p>
      <div className="flex gap-2">
        <button onClick={reiniciar} className="rounded-full border bg-white px-4 py-1 text-sm font-semibold">Borrar todo (R)</button>
      </div>
      <p className="max-w-xl text-center text-xs opacity-70">Flechas: mover · 1–4: poner C, H, O o N · 0: borrar · D: enlace a la derecha · X: enlace hacia abajo (nada → sencillo → doble → triple). También se puede tocar un círculo para poner el átomo elegido y tocar el espacio entre dos átomos para cambiar el enlace.</p>
    </div>
  )
}
