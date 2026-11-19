import { useCallback, useEffect, useState } from 'react'
import MesaViva from '../MesaViva.tsx'
import type { Pieza, Uso } from '../MesaViva.tsx'

// Laboratorio de Química 8 (PLAN-LABORATORIOS.md): gases, en mesa viva.
// 1. Boyle: jeringa con 30 mL de aire; se tapa la punta, se ponen o quitan pesas de 1 kg sobre el émbolo y se toca
//    la jeringa para anotar. Émbolo de 2 cm²: cada kilo suma ≈ 0,48 atm. Sin tapa, el aire se sale.
// 2. Charles: botella (400 mL) con globo (100 mL a 20 °C) a baños de hielo, ambiente o caliente; la temperatura
//    del aire se acerca a la del baño en tiempo real; termómetro y cinta métrica. Modelo de gas ideal.

const f = (x: number, d = 1) => x.toLocaleString('es-CO', { minimumFractionDigits: d, maximumFractionDigits: d })
const BOTON = (on: boolean) => `rounded-full border px-4 py-1.5 text-sm font-semibold ${on ? 'border-[var(--acento)] bg-[var(--acento)] text-white' : 'border-[var(--linea)] bg-white'}`
const Msg = ({ m }: { m: { t: string; aviso?: boolean } | null }) => (m ? <p className={`-mt-2 text-sm ${m.aviso ? 'font-semibold text-[#b5462c]' : ''}`}>{m.aviso ? '⚠ ' : '› '}{m.t}</p> : null)

function Grafica({ puntos, x, y, xMin = 0, yMin = 0, extra }: { puntos: [number, number][]; x: string; y: string; xMin?: number; yMin?: number; extra?: [number, number][] }) {
  const todos = [...puntos, ...(extra ?? [])]
  const xMax = Math.max(...todos.map((p) => p[0])) * 1.1
  const yMax = Math.max(...todos.map((p) => p[1])) * 1.1
  const X = (v: number) => 40 + ((v - xMin) / (xMax - xMin)) * 250
  const Y = (v: number) => 170 - ((v - yMin) / (yMax - yMin)) * 150
  return (
    <svg viewBox="0 0 300 200" className="w-full max-w-sm" role="img" aria-label={`Gráfica de ${y} contra ${x}`}>
      <line x1="40" y1="170" x2="295" y2="170" stroke="#555" /><line x1="40" y1="15" x2="40" y2="170" stroke="#555" />
      {extra && extra.length > 1 && <polyline points={extra.map(([a, b]) => `${X(a)},${Y(b)}`).join(' ')} fill="none" stroke="#999" strokeDasharray="4 4" />}
      {puntos.map(([a, b], k) => <circle key={k} cx={X(a)} cy={Y(b)} r="4" fill="#2e86c1" />)}
      <text x="168" y="195" textAnchor="middle" fontSize="11">{x}</text>
      <text x="12" y="95" textAnchor="middle" fontSize="11" transform="rotate(-90 12 95)">{y}</text>
      <text x="40" y="182" textAnchor="middle" fontSize="9">{f(xMin, 0)}</text>
    </svg>
  )
}

// ---------- 1. Boyle ----------
const V0 = 30
const ATM_KG = 0.48
function Boyle({ grado }: { grado: number }) {
  const [tapa, setTapa] = useState(false)
  const [pesas, setPesas] = useState(0)
  const [escapo, setEscapo] = useState(false)
  const [datos, setDatos] = useState<[number, number][]>([])
  const [msg, setMsg] = useState<{ t: string; aviso?: boolean } | null>(null)
  const P = 1 + pesas * ATM_KG
  const V = escapo ? 2 : tapa ? V0 / P : pesas > 0 ? 2 : V0
  const alTomar = useCallback((id: string | null) => { if (id?.startsWith('p')) setPesas((n) => (+id.slice(1) < n ? +id.slice(1) : n)) }, [])
  // la jeringa: 1 mL = 5 px; el émbolo baja con el volumen
  const yEmb = -100 + (V0 - V) * 5
  const piezas: Pieza[] = [
    { id: 'tapa', nombre: tapa ? 'Tapón (puesto)' : 'Tapón de goma', ...(tapa ? { x: 500, y: 350 } : { x: 300, y: 395 }), ancho: 30, alto: 16, tomable: !tapa, dibujo: <rect x="-10" y="-6" width="20" height="12" rx="3" fill="#333" /> },
    {
      id: 'jeringa', nombre: 'Jeringa con aire (toca: anotar presión y volumen)', x: 500, y: 250, ancho: 80, alto: 200,
      alTocar: () => {
        if (!tapa || escapo) return setMsg({ t: 'Sin el tapón el aire se escapa por la punta: no hay nada que medir.', aviso: true })
        setDatos((d) => [...d.filter(([p]) => Math.abs(p - P) > 0.01), [P, V] as [number, number]].sort((a, b) => a[0] - b[0]))
        setMsg({ t: `Anotas: ${f(P, 2)} atm → ${f(V)} mL.` })
      },
      dibujo: <g>
        <rect x="-20" y="-100" width="40" height="190" fill="rgba(255,255,255,0.6)" stroke="#2b2b2b" strokeWidth="2.5" />
        <rect x="-19" y={yEmb + 6} width="38" height={90 - yEmb - 6} fill="#e8f4fb" />
        <path d="M-6 90 H6 V100 H-6 Z" fill="#ddd" stroke="#2b2b2b" strokeWidth="1.5" />
        {[5, 10, 15, 20, 25, 30].map((v) => <g key={v}><line x1="10" x2="20" y1={90 - v * 5 + 0} y2={90 - v * 5} stroke="#2b2b2b" /><text x="24" y={94 - v * 5} fontSize="9">{v}</text></g>)}
        <rect x="-18" y={yEmb} width="36" height="8" fill="#555" />
        <rect x="-3" y={yEmb - 40} width="6" height="40" fill="#777" />
        <rect x="-26" y={yEmb - 46} width="52" height="6" fill="#555" />
        {Array.from({ length: pesas }, (_, k) => <rect key={k} x="-24" y={yEmb - 58 - k * 12} width="48" height="11" rx="2" fill="#8e44ad" stroke="#2b2b2b" />)}
      </g>,
    },
    ...Array.from({ length: 5 }, (_, k) => {
      const puesta = k < pesas
      return { id: `p${k}`, nombre: puesta ? `Pesa ${k + 1} (tómala para quitarla)` : 'Pesa de 1 kg', ...(puesta ? { x: 500, y: 250 + yEmb - 52 - k * 12 } : { x: 120 + k * 56, y: 352 }), ancho: 50, alto: 14, tomable: puesta ? k === pesas - 1 : true, dibujo: puesta ? <g /> : <g><rect x="-24" y="-6" width="48" height="12" rx="2" fill="#8e44ad" stroke="#2b2b2b" /><text y="4" textAnchor="middle" fontSize="8" fill="#fff" fontWeight="800">1 kg</text></g> }
    }),
    { id: 'manometro', nombre: 'Presión sobre el aire', x: 700, y: 300, ancho: 90, alto: 90, dibujo: <g><circle r="38" fill="#fff" stroke="#2b2b2b" strokeWidth="3" /><line x1="0" y1="0" x2={30 * Math.cos(Math.PI * (0.75 + (P - 1) * 0.35))} y2={30 * Math.sin(Math.PI * (0.75 + (P - 1) * 0.35))} stroke="#c0392b" strokeWidth="3" style={{ transition: 'all 0.6s' }} /><text y="24" textAnchor="middle" fontSize="12" fontWeight="800">{f(P, 2)} atm</text></g> },
  ]
  const soltar = (de: string, en: string): Uso | string => {
    if (en !== 'jeringa') return 'Eso va en la jeringa.'
    if (de === 'tapa') return { anim: 'poner', hecho: () => { setTapa(true); setEscapo(false); setMsg({ t: 'Tapaste la punta: el aire queda encerrado.' }) } }
    if (pesas >= 5) return 'Ya no caben más pesas.'
    return { anim: 'poner', hecho: () => { setPesas((n) => n + 1); if (!tapa) { setEscapo(true); setMsg({ t: 'Sin tapón, el émbolo bajó hasta el fondo: el aire se salió por la punta.', aviso: true }) } } }
  }
  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-2xl bg-[var(--tarjeta)] p-4 text-sm">Una jeringa con 30 mL de aire. Tapa la punta y pon pesas sobre el émbolo, de una en una: más pesas, más presión. Toca la jeringa para anotar la presión y el volumen cada vez. ¿Qué le pasa al volumen del aire cuando la presión aumenta?</p>
      <MesaViva desde={60} piezas={piezas} destinos={() => ['jeringa']} soltar={soltar} alTomar={alTomar} />
      <Msg m={msg} />
      {datos.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          <table className="rounded-xl bg-[var(--tarjeta)] p-3 text-sm"><thead><tr className="text-left"><th className="p-1">P (atm)</th><th className="p-1">V (mL)</th>{grado >= 9 && <th className="p-1">P × V</th>}</tr></thead>
            <tbody>{datos.map(([p, v]) => <tr key={p} className="border-t border-[var(--linea)]"><td className="p-1">{f(p, 2)}</td><td className="p-1">{f(v)}</td>{grado >= 9 && <td className="p-1">{f(p * v)}</td>}</tr>)}</tbody></table>
          {datos.length >= 2 && <Grafica puntos={datos} x="Presión (atm)" y="Volumen (mL)" />}
        </div>
      )}
      {datos.length >= 4 && <p className="rounded-lg bg-[#eaf5ee] p-2 text-sm"><b>Ley de Boyle:</b> a temperatura constante, si la presión sube el volumen del gas baja: al doble de presión, la mitad de volumen. Las partículas del aire quedan más apretadas.{grado >= 9 ? ' Por eso P × V da casi lo mismo en todas las filas: P₁·V₁ = P₂·V₂.' : ''}{grado >= 11 ? ' La gráfica es una hipérbola; si graficas V contra 1/P, sale una recta.' : ''}</p>}
    </div>
  )
}

// ---------- 2. Charles ----------
const BANOS = [
  { id: 'hielo', n: 'Agua con hielo', T: 0, color: '#d6ecfa' },
  { id: 'ambiente', n: 'Agua al ambiente', T: 20, color: '#cfe6f5' },
  { id: 'caliente', n: 'Agua caliente', T: 70, color: '#f5d0c0' },
]
const VTOT = 500 // mL de aire a 20 °C (400 en la botella + 100 en el globo)
const volGlobo = (T: number) => (VTOT * (T + 273)) / 293 - 400
const contorno = (v: number) => 2 * Math.PI * Math.cbrt((3 * v) / (4 * Math.PI))

function Charles({ grado }: { grado: number }) {
  const [en, setEn] = useState<number | null>(null)
  const [T, setT] = useState(20)
  const [termo, setTermo] = useState(false)
  const [datos, setDatos] = useState<[number, number][]>([])
  const [msg, setMsg] = useState<{ t: string; aviso?: boolean } | null>(null)
  useEffect(() => {
    if (en === null) return
    const Tb = BANOS[en].T
    if (Math.abs(T - Tb) < 0.2) return
    const id = window.setTimeout(() => setT((x) => +(x + (Tb - x) * 0.25).toFixed(2)), 1000)
    return () => window.clearTimeout(id)
  }, [en, T])
  const alTomar = useCallback((id: string | null) => { if (id === 'botella') { setEn(null); setTermo(false) } }, [])
  const vg = volGlobo(T)
  const r = Math.cbrt((3 * vg) / (4 * Math.PI)) * 6
  const pos = en !== null ? { x: 380 + en * 200, y: 250 } : { x: 160, y: 290 }
  const piezas: Pieza[] = [
    ...BANOS.map((b, k) => ({ id: b.id, nombre: `${b.n} (${b.T} °C)`, x: 380 + k * 200, y: 320, ancho: 150, alto: 80, dibujo: <g><path d="M-70 -36 V38 H70 V-36" fill="rgba(255,255,255,0.5)" stroke="#2b2b2b" strokeWidth="2.5" /><rect x="-68" y="-14" width="136" height="51" fill={b.color} />{b.id === 'hielo' && [-40, -10, 25].map((x) => <rect key={x} x={x} y="-20" width="16" height="14" rx="3" fill="#fff" stroke="#9cc" />)}{b.id === 'caliente' && [-30, 0, 30].map((x) => <path key={x} d={`M${x} -40 q6 -8 0 -16 q-6 -8 0 -16`} fill="none" stroke="#bbb" strokeWidth="2" />)}<text y="56" textAnchor="middle" fontSize="11" fontWeight="700">{b.n}</text></g> })),
    {
      id: 'botella', nombre: en !== null ? 'Botella con globo (tómala para sacarla)' : 'Botella con globo', ...pos, ancho: 70, alto: 150, tomable: true,
      dibujo: <g><ellipse cy={-60 - r} rx={r * 0.9} ry={r} fill="#e0607e" opacity="0.9" style={{ transition: 'all 0.9s' }} /><path d="M-24 50 V-10 Q-24 -30 -8 -38 V-60 H8 V-38 Q24 -30 24 -10 V50 Z" fill="rgba(255,255,255,0.6)" stroke="#555" strokeWidth="2.5" /></g>,
    },
    { id: 'termometro', nombre: termo ? `Termómetro: ${f(T)} °C` : 'Termómetro', ...(termo && en !== null ? { x: pos.x + 45, y: 260 } : { x: 260, y: 395 }), ancho: 90, alto: 20, tomable: true, dibujo: termo && en !== null ? <g><rect x="-3" y="-60" width="6" height="110" rx="3" fill="#fff" stroke="#2b2b2b" /><rect x="-1.5" y={40 - (T + 10) * 1.1} width="3" height={(T + 10) * 1.1} fill="#c0392b" /><circle cy="50" r="6" fill="#c0392b" /><text x="10" y="-50" fontSize="12" fontWeight="800">{f(T)} °C</text></g> : <g transform="rotate(-90)"><rect x="-3" y="-40" width="6" height="80" rx="3" fill="#fff" stroke="#2b2b2b" /><circle cy="40" r="6" fill="#c0392b" /></g> },
    { id: 'cinta', nombre: 'Cinta métrica (mide el globo)', x: 340, y: 395, ancho: 50, alto: 30, tomable: true, dibujo: <g><circle r="13" fill="#f2c94c" stroke="#2b2b2b" strokeWidth="2" /><circle r="4" fill="#555" /><path d="M13 4 H30" stroke="#f2c94c" strokeWidth="5" /></g> },
  ]
  const destinos = (de: string) => (de === 'botella' ? BANOS.map((b) => b.id) : ['botella'])
  const soltar = (de: string, a: string): Uso | string => {
    if (de === 'botella') { const k = BANOS.findIndex((b) => b.id === a); return k < 0 ? 'La botella va en uno de los baños.' : { anim: 'poner', hecho: () => { setEn(k); setMsg({ t: 'El aire se va poniendo a la temperatura del baño: espera y mira el globo.' }) } } }
    if (a !== 'botella') return 'Se usa en la botella.'
    if (de === 'termometro') return en === null ? 'Pon primero la botella en un baño.' : { anim: 'poner', hecho: () => setTermo(true) }
    if (de === 'cinta') {
      if (!termo) return 'Pon el termómetro para saber a qué temperatura mides.'
      return { anim: 'frotar', hecho: () => { const C = contorno(vg); setDatos((d) => [...d.filter(([t]) => Math.abs(t - T) > 1), [Math.round(T * 10) / 10, Math.round(vg)] as [number, number]].sort((x, y) => x[0] - y[0])); setMsg({ t: `A ${f(T)} °C el globo mide ${f(C)} cm de contorno → ≈ ${f(vg, 0)} mL de aire en el globo (${f(vg + 400, 0)} mL en total).${en !== null && Math.abs(T - BANOS[en].T) > 2 ? ' Ojo: el aire todavía no llega a la temperatura del baño.' : ''}`, aviso: en !== null && Math.abs(T - BANOS[en].T) > 2 }) } }
    }
    return 'No se puede.'
  }
  const ext: [number, number][] | undefined = grado >= 11 && datos.length >= 2 ? [[-273, -400], [80, volGlobo(80)]] : undefined
  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-2xl bg-[var(--tarjeta)] p-4 text-sm">Una botella con un globo en la boca: el aire de adentro no puede salir. Llévala a cada baño, espera a que el aire tome la temperatura del agua (el termómetro lo dice) y mide el globo con la cinta. ¿Qué le pasa al volumen del aire cuando se calienta?</p>
      <MesaViva desde={100} piezas={piezas} destinos={destinos} soltar={soltar} alTomar={alTomar} />
      <Msg m={msg} />
      {datos.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          <table className="rounded-xl bg-[var(--tarjeta)] p-3 text-sm"><thead><tr className="text-left"><th className="p-1">T (°C)</th>{grado >= 9 && <th className="p-1">T (K)</th>}<th className="p-1">V total (mL)</th>{grado >= 9 && <th className="p-1">V ÷ T(K)</th>}</tr></thead>
            <tbody>{datos.map(([t, v]) => <tr key={t} className="border-t border-[var(--linea)]"><td className="p-1">{f(t)}</td>{grado >= 9 && <td className="p-1">{f(t + 273, 0)}</td>}<td className="p-1">{f(v + 400, 0)}</td>{grado >= 9 && <td className="p-1">{f((v + 400) / (t + 273), 2)}</td>}</tr>)}</tbody></table>
          {datos.length >= 2 && <Grafica puntos={datos.map(([t, v]) => [t, v + 400])} x="Temperatura (°C)" y="Volumen (mL)" xMin={grado >= 11 ? -280 : 0} extra={ext?.map(([a, b]) => [a, b + 400])} />}
        </div>
      )}
      {datos.length >= 3 && <p className="rounded-lg bg-[#eaf5ee] p-2 text-sm"><b>Ley de Charles:</b> a presión constante, el gas se expande al calentarse y se contrae al enfriarse: las partículas se mueven más rápido y empujan más.{grado >= 9 ? ' El volumen es proporcional a la temperatura en kelvin: V₁/T₁ = V₂/T₂ (la columna V ÷ T da casi igual).' : ''}{grado >= 11 ? ' Si prolongas la recta hacia atrás, el volumen llegaría a cero cerca de −273 °C: el cero absoluto.' : ''}</p>}
    </div>
  )
}

export default function Gases({ grado }: { grado: number }) {
  const [parte, setParte] = useState(0)
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {['1. Presión y volumen (Boyle)', '2. Temperatura y volumen (Charles)'].map((t, k) => <button key={t} type="button" onClick={() => setParte(k)} className={BOTON(parte === k)}>{t}</button>)}
      </div>
      {parte === 0 ? <Boyle grado={grado} /> : <Charles grado={grado} />}
      <p className="text-xs text-[var(--suave)]">Versión casera: jeringa grande sin aguja con la punta tapada y libros encima del émbolo; botella con globo en ollas con agua y hielo, al ambiente y caliente (la caliente la maneja un adulto). Datos de modelo.</p>
    </div>
  )
}
