import { useEffect, useRef, useState } from 'react'

// Laboratorio de Biología 7 (PLAN-LABORATORIOS.md): fotosíntesis.
// A) Elodea en agua: burbujas de O₂ por minuto según distancia de la lámpara, color de la luz y CO₂ (bicarbonato).
// B) Cromatografía de pigmentos de hojas en papel: nivel del solvente, aplicaciones y tiempo; Rf en 11°.

const DIST = [10, 20, 30, 50, 80]
const COLORES = [
  { id: 'blanca', n: 'Blanca', k: 1, c: '#fff7c2' },
  { id: 'roja', n: 'Roja', k: 0.85, c: '#ff8a7a' },
  { id: 'azul', n: 'Azul', k: 0.75, c: '#8ab4ff' },
  { id: 'verde', n: 'Verde', k: 0.15, c: '#9be58f' },
]

/** burbujas por minuto */
function tasa(d: number | null, color: number, co2: boolean) {
  if (d === null) return 0
  const luz = 100 / (d * d) // intensidad relativa (∝ 1/d²)
  const sat = luz / (luz + 0.12) // la fotosíntesis se satura con mucha luz
  return Math.round(42 * sat * COLORES[color].k * (co2 ? 1 : 0.35))
}

interface Medida { d: number | null; color: string; co2: boolean; b: number }

function Elodea({ grado }: { grado: number }) {
  const [d, setD] = useState<number | null>(30)
  const [color, setColor] = useState(0)
  const [co2, setCo2] = useState(true)
  const [medidas, setMedidas] = useState<Medida[]>([])
  const [contando, setContando] = useState(false)
  const r = tasa(d, color, co2)
  const [burbujas, setBurbujas] = useState<number[]>([])
  const id = useRef(0)
  useEffect(() => {
    if (!r) return
    const iv = setInterval(() => {
      id.current += 1
      const n = id.current
      setBurbujas((b) => [...b.slice(-14), n])
    }, 60000 / r / 6) // el video va 6 veces más rápido
    return () => clearInterval(iv)
  }, [r])
  const medir = () => {
    setContando(true)
    setTimeout(() => {
      setContando(false)
      setMedidas((m) => [...m, { d, color: COLORES[color].n, co2, b: r }])
    }, 1500)
  }
  const btn = (on: boolean) => `min-h-9 rounded-full border px-3 text-xs font-semibold ${on ? 'border-[var(--acento)] bg-[var(--acento)] text-white' : 'border-[var(--linea)] bg-white'}`
  const lx = d === null ? 0 : 20 + (1 - d / 80) * 110
  const pts = medidas.filter((m) => m.d !== null && m.color === 'Blanca' && m.co2)
  const X = (x: number) => 30 + (x / 80) * 250
  const Y = (y: number) => 150 - y * 3.2
  return (
    <div className="grid items-start gap-4 md:grid-cols-[320px_1fr]">
      <svg viewBox="0 0 320 260" className="w-full rounded-2xl border border-[var(--linea)] bg-[#2a2a30]" role="img" aria-label="Elodea en un tubo iluminado">
        <style>{'@keyframes fs-sube{from{transform:translateY(0);opacity:1}to{transform:translateY(-120px);opacity:0}}'}</style>
        {d !== null && (
          <g>
            <polygon points={`${lx + 20},120 220,60 220,220`} fill={COLORES[color].c} opacity={Math.min(0.5, 6 / d)} />
            <rect x={lx - 10} y="100" width="30" height="40" rx="6" fill="#ddd" />
            <circle cx={lx + 20} cy="120" r="10" fill={COLORES[color].c} />
          </g>
        )}
        <rect x="200" y="40" width="70" height="200" fill="rgba(170,210,240,0.35)" stroke="#ccc" strokeWidth="2" />
        <path d="M235 230 Q228 190 236 150 M236 190 l-14 -10 M236 175 l14 -9 M236 205 l-14 -8 M236 165 l12 -12" stroke="#3f8f2f" strokeWidth="4" fill="none" strokeLinecap="round" />
        {burbujas.map((b) => (
          <circle key={b} cx={236 + ((b * 7) % 5) - 2} cy="148" r="3.5" fill="#e8f6ff" style={{ animation: 'fs-sube 2s linear forwards' }} />
        ))}
        <text x="235" y="255" textAnchor="middle" fontSize="11" fill="#fff">{co2 ? 'agua + bicarbonato' : 'agua sola'}</text>
        <text x="10" y="20" fontSize="12" fill="#fff" fontWeight="700">{d === null ? 'Lámpara apagada' : `Lámpara a ${d} cm`}</text>
      </svg>
      <div className="flex flex-col gap-3">
        <div className="rounded-2xl border border-[var(--linea)] bg-[var(--tarjeta)] p-4 text-sm">
          <p>Una rama de elodea cortada bajo el agua suelta burbujas de <b>oxígeno</b> mientras hace fotosíntesis. Cuenta cuántas salen por minuto.</p>
          <p className="mt-2 font-semibold">Distancia de la lámpara</p>
          <div className="mt-1 flex flex-wrap gap-1">
            {DIST.map((x) => <button key={x} type="button" onClick={() => setD(x)} className={btn(d === x)}>{x} cm</button>)}
            <button type="button" onClick={() => setD(null)} className={btn(d === null)}>Apagada</button>
          </div>
          {grado >= 9 && (
            <>
              <p className="mt-2 font-semibold">Color de la luz (papel celofán)</p>
              <div className="mt-1 flex flex-wrap gap-1">{COLORES.map((x, k) => <button key={x.id} type="button" onClick={() => setColor(k)} className={btn(color === k)}>{x.n}</button>)}</div>
            </>
          )}
          <p className="mt-2 font-semibold">CO₂ disuelto</p>
          <div className="mt-1 flex gap-1">
            <button type="button" onClick={() => setCo2(true)} className={btn(co2)}>Con bicarbonato</button>
            <button type="button" onClick={() => setCo2(false)} className={btn(!co2)}>Agua sola</button>
          </div>
          <button type="button" disabled={contando} onClick={medir} className="mt-3 min-h-10 rounded-full bg-[var(--acento)] px-5 font-semibold text-white disabled:opacity-60">{contando ? 'Contando…' : 'Contar burbujas durante 1 minuto'}</button>
        </div>
        {medidas.length > 0 && (
          <div className="grid gap-3 lg:grid-cols-2">
            <table className="rounded-xl bg-[var(--tarjeta)] text-xs">
              <thead><tr className="border-b text-left"><th className="p-1.5">Lámpara</th><th className="p-1.5">Luz</th><th className="p-1.5">CO₂</th><th className="p-1.5">Burbujas/min</th></tr></thead>
              <tbody>{medidas.slice(-8).map((m, k) => <tr key={k} className="border-b last:border-0"><td className="p-1.5">{m.d === null ? 'apagada' : `${m.d} cm`}</td><td className="p-1.5">{m.color}</td><td className="p-1.5">{m.co2 ? 'sí' : 'no'}</td><td className="p-1.5 font-bold">{m.b}</td></tr>)}</tbody>
            </table>
            <svg viewBox="0 0 300 175" className="w-full rounded-xl bg-white" role="img" aria-label="Gráfica burbujas contra distancia">
              <line x1="30" y1="150" x2="285" y2="150" stroke="#333" />
              <line x1="30" y1="10" x2="30" y2="150" stroke="#333" />
              {[0, 20, 40, 60, 80].map((x) => <text key={x} x={X(x)} y="164" textAnchor="middle" fontSize="9">{x}</text>)}
              <text x="285" y="145" textAnchor="end" fontSize="9">cm</text>
              <text x="34" y="12" fontSize="9">burbujas/min (luz blanca, con CO₂)</text>
              {[...pts].sort((a, b) => a.d! - b.d!).map((e, k, arr) => k > 0 && <line key={`l${k}`} x1={X(arr[k - 1].d!)} y1={Y(arr[k - 1].b)} x2={X(e.d!)} y2={Y(e.b)} stroke="var(--acento)" strokeWidth="2" />)}
              {pts.map((e, k) => <circle key={k} cx={X(e.d!)} cy={Y(e.b)} r="4" fill="var(--acento)" />)}
            </svg>
          </div>
        )}
        {medidas.length >= 3 && (
          <p className="rounded-xl bg-[#eaf5ee] p-3 text-sm">
            Más cerca la lámpara, más luz y más oxígeno, hasta que la planta ya no puede ir más rápido (se satura). Sin luz no hay burbujas. Sin bicarbonato falta CO₂, la materia prima del azúcar.{grado >= 9 ? ' La luz verde casi no sirve: la clorofila la refleja, por eso vemos verdes las hojas.' : ''}
          </p>
        )}
      </div>
    </div>
  )
}

// ---------- cromatografía ----------

const PIGMENTOS = [
  { n: 'Carotenos', rf: 0.94, c: '#f08a1c' },
  { n: 'Xantofilas', rf: 0.72, c: '#e8c51e' },
  { n: 'Clorofila a', rf: 0.5, c: '#1f8a5a' },
  { n: 'Clorofila b', rf: 0.34, c: '#7fae2a' },
]
const LARGO = 100 // mm de papel útil, desde la línea de origen

function Cromatografia({ grado }: { grado: number }) {
  const [alto, setAlto] = useState(false) // solvente por encima de la mancha
  const [apl, setApl] = useState(1)
  const [min, setMin] = useState(0)
  const [rf, setRf] = useState('')
  const [rev, setRev] = useState(false)
  const frente = Math.min(LARGO, min * 7)
  const intens = Math.min(1, apl / 4)
  const pasado = min * 7 > LARGO + 10
  const Y = (mm: number) => 220 - mm * 1.8
  const btn = 'min-h-9 rounded-full border border-[var(--linea)] bg-white px-3 text-xs font-semibold'
  const num = parseFloat(rf.replace(',', '.'))
  const obs: string[] = []
  if (min > 0) {
    if (alto) obs.push('El alcohol tapó la mancha: los pigmentos se disolvieron en el vaso y en el papel no se separó nada. El solvente debe quedar por debajo de la línea.')
    else {
      if (apl < 3) obs.push('Las bandas salen pálidas: aplica el extracto varias veces en el mismo punto, dejando secar entre una y otra.')
      if (frente < 60) obs.push('El solvente todavía no ha subido lo suficiente: espera más para que las bandas se separen.')
      if (pasado) obs.push('Dejaste el papel demasiado tiempo: el solvente llegó al borde y las bandas de arriba se juntan.')
      if (!obs.length) obs.push('¡Buena separación! De arriba hacia abajo: carotenos (naranja), xantofilas (amarillo), clorofila a (verde azulado) y clorofila b (verde amarillento).')
    }
  }
  return (
    <div className="grid items-start gap-4 md:grid-cols-[220px_1fr]">
      <svg viewBox="0 0 200 260" className="w-full max-w-[220px] rounded-2xl border border-[var(--linea)] bg-[#f4f1ea]" role="img" aria-label="Tira de papel en un vaso con alcohol">
        <path d="M30 60 V245 H170 V60" fill="none" stroke="#3a3a3a" strokeWidth="3" />
        <rect x="32" y={alto ? 200 : 228} width="136" height={alto ? 45 : 17} fill="rgba(170,210,240,0.5)" />
        <line x1="100" y1="20" x2="100" y2="40" stroke="#555" strokeWidth="2" />
        <rect x="70" y="18" width="60" height="6" fill="#8a6a3a" />
        <rect x="88" y="24" width="24" height="216" fill="#fdfcf6" stroke="#bbb" />
        <line x1="88" x2="112" y1={Y(0)} y2={Y(0)} stroke="#999" strokeDasharray="2 2" />
        {!alto && frente > 0 && <rect x="88" y={Y(frente)} width="24" height={frente * 1.8} fill="rgba(170,210,240,0.25)" />}
        {!alto && frente > 0 && <line x1="88" x2="112" y1={Y(frente)} y2={Y(frente)} stroke="#6aa0c8" strokeWidth="1.5" />}
        {(alto && min > 0) ? null : min === 0 ? (
          <circle cx="100" cy={Y(0)} r="4" fill="#1f6a3a" opacity={0.3 + intens * 0.7} />
        ) : (
          PIGMENTOS.map((p) => {
            const y = frente * p.rf * (pasado && p.rf > 0.6 ? 1.04 : 1)
            return <rect key={p.n} x="89" y={Y(y) - 3} width="22" height={pasado && p.rf > 0.6 ? 4 : 6} rx="2" fill={p.c} opacity={0.25 + intens * 0.75} style={{ transition: 'all 1s' }} />
          })
        )}
        {alto && min > 0 && <rect x="32" y="200" width="136" height="45" fill="rgba(31,138,90,0.35)" />}
        {grado >= 11 && (
          <g fontSize="7" fill="#555">
            {[0, 20, 40, 60, 80, 100].map((mm) => (
              <g key={mm}><line x1="114" x2="120" y1={Y(mm)} y2={Y(mm)} stroke="#555" /><text x="122" y={Y(mm) + 3}>{mm}</text></g>
            ))}
            <text x="122" y={Y(104)}>mm</text>
          </g>
        )}
      </svg>
      <div className="flex flex-col gap-3">
        <div className="rounded-2xl border border-[var(--linea)] bg-[var(--tarjeta)] p-4 text-sm">
          <p>Hojas verdes molidas en el mortero con alcohol dan un extracto verde. Una gota en el papel y el alcohol que sube por él separan los <b>pigmentos</b>: cada uno avanza distinto según cuánto se disuelve y cuánto se pega al papel.</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="font-semibold">1. Aplicaciones del extracto: {apl}</span>
            <button type="button" disabled={min > 0} onClick={() => setApl((a) => Math.min(6, a + 1))} className={btn}>Aplicar otra gota y secar</button>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="font-semibold">2. Alcohol en el vaso:</span>
            <button type="button" disabled={min > 0} onClick={() => setAlto(false)} className={`${btn} ${!alto ? '!border-[var(--acento)]' : ''}`}>Por debajo de la mancha</button>
            <button type="button" disabled={min > 0} onClick={() => setAlto(true)} className={`${btn} ${alto ? '!border-[var(--acento)]' : ''}`}>Por encima</button>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="font-semibold">3. Esperar: {min} min</span>
            <button type="button" onClick={() => setMin((m) => m + 2)} className={btn}>+2 min</button>
            <button type="button" onClick={() => { setMin(0); setApl(1); setRev(false); setRf('') }} className={btn}>Nueva tira</button>
          </div>
        </div>
        {obs.length > 0 && <ul className="list-disc rounded-xl bg-[var(--tarjeta)] p-3 pl-8 text-sm">{obs.map((o) => <li key={o}>{o}</li>)}</ul>}
        {grado >= 11 && !alto && frente >= 60 && !pasado && (
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <label className="font-semibold">Rf de la clorofila a = distancia de la banda ÷ distancia del frente: <input value={rf} onChange={(e) => setRf(e.target.value)} className="w-20 rounded-lg border border-[var(--linea)] bg-white px-2 py-1 text-right" /></label>
            <button type="button" onClick={() => setRev(true)} className={btn}>Comprobar</button>
            {rev && <span className={Math.abs(num - 0.5) <= 0.05 ? 'font-bold text-[#2e7d5a]' : 'font-bold text-[#b5462c]'}>{Math.abs(num - 0.5) <= 0.05 ? '¡Correcto!' : 'Revisa:'} la banda está a {Math.round(frente * 0.5)} mm y el frente a {Math.round(frente)} mm → Rf ≈ 0,50.</span>}
          </div>
        )}
        <p className="text-xs text-[var(--suave)]">⚠ El alcohol es inflamable: lejos de llamas. Versión casera: hojas de espinaca, alcohol antiséptico, filtro de café y un vaso; también sirve una tiza blanca. Los Rf son aproximados y cambian con el solvente.</p>
      </div>
    </div>
  )
}

export default function Fotosintesis({ grado }: { grado: number }) {
  const [modo, setModo] = useState<'elodea' | 'pigmentos'>('elodea')
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {(['elodea', 'pigmentos'] as const).map((x) => (
          <button key={x} type="button" onClick={() => setModo(x)} className={`min-h-10 rounded-full border px-4 text-sm font-semibold ${modo === x ? 'border-[var(--acento)] bg-[var(--acento)] text-white' : 'border-[var(--linea)] bg-[var(--tarjeta)]'}`}>
            {x === 'elodea' ? '1. Burbujas de oxígeno' : '2. Pigmentos de las hojas'}
          </button>
        ))}
      </div>
      {modo === 'elodea' ? <Elodea grado={grado} /> : <Cromatografia grado={grado} />}
    </div>
  )
}
