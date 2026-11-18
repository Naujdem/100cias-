import { useEffect, useState } from 'react'

// Explora (Química área 4, tema 4): laboratorio de soluciones en 100 g de agua. Q cambia el soluto, W/S echa o
// saca 5 g, A/D enfría o calienta 10 °C, C deja caer un cristalito (rompe la sobresaturación), R vacía el vaso.
// Si una solución saturada sin nada en el fondo se enfría, queda sobresaturada.

const SOLUTOS = [
  { nombre: 'Sal (NaCl)', color: '#f4f4f4', liq: '#d7eaf7', curva: [[0, 35.7], [20, 36], [40, 36.6], [60, 37.3], [80, 38.4], [100, 39.2]] },
  { nombre: 'Azúcar', color: '#fff8e8', liq: '#ecf2e0', curva: [[0, 179], [20, 204], [40, 238], [60, 287], [80, 362], [100, 487]] },
  { nombre: 'Nitrato de potasio (KNO₃)', color: '#ffffff', liq: '#e4e4f4', curva: [[0, 13.3], [20, 31.6], [40, 63.9], [60, 110], [80, 169], [100, 246]] },
]
const solubilidad = (c: number[][], t: number) => {
  for (let j = 1; j < c.length; j++) {
    if (t <= c[j][0]) { const [t0, g0] = c[j - 1], [t1, g1] = c[j]; return g0 + ((g1 - g0) * (t - t0)) / (t1 - t0) }
  }
  return c[c.length - 1][1]
}
const f = (x: number) => x.toLocaleString('es-CO', { maximumFractionDigits: 1 })
const GW = 240, GH = 150, GMAX = 500

export default function LabSoluciones() {
  const [si, setSi] = useState(0)
  const [t, setT] = useState(20)
  const [disuelto, setDisuelto] = useState(0)
  const [fondo, setFondo] = useState(0)
  const S = SOLUTOS[si]
  const sol = solubilidad(S.curva, t)
  const sobre = disuelto > sol + 0.01

  // echar o sacar soluto
  const echar = (g: number) => {
    if (g > 0) {
      // en una sobresaturada, el grano nuevo funciona como semilla y cristaliza el exceso
      const total = disuelto + fondo + g
      const d = Math.min(total, sol)
      setDisuelto(d); setFondo(total - d)
    } else {
      // se saca primero lo que hay en el fondo
      const quita = Math.min(fondo, -g)
      setFondo(fondo - quita); setDisuelto(Math.max(0, disuelto - (-g - quita)))
    }
  }
  // cambiar la temperatura
  const temperatura = (dt: number) => {
    const nt = Math.min(100, Math.max(0, t + dt))
    const ns = solubilidad(S.curva, nt)
    if (fondo > 0) {
      const total = disuelto + fondo
      const d = Math.min(total, ns)
      setDisuelto(d); setFondo(total - d)
    }
    setT(nt)
  }
  const sembrar = () => { if (sobre) { setFondo(disuelto - sol); setDisuelto(sol) } }
  const vaciar = () => { setDisuelto(0); setFondo(0) }

  useEffect(() => {
    const alTeclear = (ev: KeyboardEvent) => {
      const k = ev.key.toLowerCase()
      if (k === 'q') { setSi((v) => (v + 1) % SOLUTOS.length); vaciar() }
      if (k === 'w') echar(5)
      if (k === 's') echar(-5)
      if (k === 'd') temperatura(10)
      if (k === 'a') temperatura(-10)
      if (k === 'c') sembrar()
      if (k === 'r') vaciar()
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  })

  const estado = sobre ? 'SOBRESATURADA' : fondo > 0 || Math.abs(disuelto - sol) < 0.01 ? 'SATURADA' : disuelto === 0 ? 'solo agua' : 'INSATURADA'
  const colorEstado = sobre ? '#c43c3c' : estado === 'SATURADA' ? '#4f8a3c' : '#3f6fb8'
  const linea = Array.from({ length: 21 }, (_, j) => { const tt = j * 5; return `${(tt / 100) * GW},${GH - (Math.min(GMAX, solubilidad(S.curva, tt)) / GMAX) * GH}` }).join(' ')
  const escalaFondo = Math.min(40, Math.sqrt(fondo) * 4)
  const calor = t / 100

  return (
    <div data-diagrama className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap justify-center gap-1">
        {SOLUTOS.map((x, j) => <button key={x.nombre} onClick={() => { setSi(j); vaciar() }} className={`rounded-full border px-3 py-1 text-sm font-semibold ${si === j ? 'bg-[var(--acento)] text-white' : 'bg-white'}`}>{x.nombre}</button>)}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <svg viewBox="0 0 200 230" className="w-48" role="img" aria-label={`Vaso con ${f(disuelto)} g disueltos y ${f(fondo)} g en el fondo a ${t} °C`}>
          <rect x="40" y="60" width="120" height="130" fill={disuelto > 0 ? S.liq : '#e8f3fb'} />
          {sobre && <rect x="40" y="60" width="120" height="130" fill="#c43c3c" opacity="0.08"><animate attributeName="opacity" values="0.03;0.12;0.03" dur="1.4s" repeatCount="indefinite" /></rect>}
          {fondo > 0 && <path d={`M44 190 q56 ${-escalaFondo * 1.6} 112 0 Z`} fill={S.color} stroke="#bbb" />}
          <path d="M40 40 V190 H160 V40" fill="none" stroke="#3a3a3a" strokeWidth="3" />
          <line x1="40" y1="60" x2="160" y2="60" stroke="#3f6fb8" strokeDasharray="4 3" />
          <text x="100" y="54" textAnchor="middle" fontSize="10" fontWeight="700">100 g de agua</text>
          {[-24, 0, 24].map((d) => <path key={d} d={`M${100 + d} 222 q-6 -9 0 -16 q6 -7 0 -14`} fill={calor > 0.2 ? '#f6a33c' : '#cbd6e2'} opacity={0.3 + calor * 0.7} />)}
          <text x="100" y="22" textAnchor="middle" fontSize="16" fontWeight="900" fill={t > 50 ? '#c43c3c' : '#3f6fb8'}>{t} °C</text>
        </svg>
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl border bg-white px-2 py-1"><p className="text-xs font-bold opacity-70">DISUELTO</p><p className="font-black">{f(disuelto)} g</p></div>
            <div className="rounded-xl border bg-white px-2 py-1"><p className="text-xs font-bold opacity-70">EN EL FONDO</p><p className="font-black">{f(fondo)} g</p></div>
            <div className="rounded-xl border bg-white px-2 py-1"><p className="text-xs font-bold opacity-70">CABEN</p><p className="font-black">{f(sol)} g</p></div>
          </div>
          <svg viewBox={`-34 -8 ${GW + 44} ${GH + 30}`} className="w-72 rounded-xl bg-white" role="img" aria-label="Curva de solubilidad">
            <line x1="0" y1={GH} x2={GW} y2={GH} stroke="#3a3a3a" /><line x1="0" y1="0" x2="0" y2={GH} stroke="#3a3a3a" />
            {[0, 50, 100].map((x) => <text key={x} x={(x / 100) * GW} y={GH + 13} textAnchor="middle" fontSize="9">{x} °C</text>)}
            {[0, 250, 500].map((g) => <text key={g} x="-4" y={GH - (g / GMAX) * GH + 3} textAnchor="end" fontSize="9">{g} g</text>)}
            <polyline points={linea} fill="none" stroke="#3f6fb8" strokeWidth="2.5" />
            <circle cx={(t / 100) * GW} cy={GH - (Math.min(GMAX, disuelto) / GMAX) * GH} r="6" fill={colorEstado} />
          </svg>
          <p className="text-center text-lg font-black" style={{ color: colorEstado }}>{estado}</p>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <button onClick={() => echar(-5)} className="rounded-full border bg-white px-3 py-1 text-sm font-semibold">− 5 g (S)</button>
        <button onClick={() => echar(5)} className="rounded-full border bg-white px-3 py-1 text-sm font-semibold">+ 5 g (W)</button>
        <button onClick={() => temperatura(-10)} className="rounded-full border bg-white px-3 py-1 text-sm font-semibold">Enfriar (A)</button>
        <button onClick={() => temperatura(10)} className="rounded-full border bg-white px-3 py-1 text-sm font-semibold">Calentar (D)</button>
        <button onClick={sembrar} disabled={!sobre} className="rounded-full border bg-white px-3 py-1 text-sm font-semibold disabled:opacity-40">Cristalito (C)</button>
        <button onClick={vaciar} className="rounded-full border bg-white px-3 py-1 text-sm font-semibold">Vaciar (R)</button>
      </div>
      <p className="max-w-xl text-center text-xs opacity-70">Q soluto · W/S echa o saca 5 g · A/D enfría o calienta · C cristalito · R vacía. Truco: calienta, disuelve todo lo que quepa y enfría sin dejar nada en el fondo: queda sobresaturada. Valores de solubilidad aproximados.</p>
    </div>
  )
}
