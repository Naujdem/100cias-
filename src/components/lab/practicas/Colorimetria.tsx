import { useState } from 'react'
import MesaViva from '../MesaViva.tsx'
import type { Pieza, Uso } from '../MesaViva.tsx'
import { Caneca } from '../dibujos.tsx'

// Práctica extra 5 (PLAN-LABORATORIOS.md): colorimetría, Química área 4, desde 9°.
// Solución madre de CuSO₄ 0,10 M y piseta, de a 2 mL, a cinco tubos (10 mL cada uno): escala de patrones.
// La muestra desconocida se suelta sobre un patrón para comparar el color sobre fondo blanco. En 11° cada tubo
// va al colorímetro: absorbancia A = ε·l·c (ε·l = 12 M⁻¹, valores escolares, con un poco de ruido), gráfica y recta.
// El estudiante escribe su estimación y la comprueba.

const f = (x: number, d = 2) => x.toLocaleString('es-CO', { minimumFractionDigits: d, maximumFractionDigits: d })
const MADRE = 0.1
const EPS = 12
const azul = (c: number) => `rgba(30, 110, 210, ${Math.min(0.95, 0.06 + c * 8.5)})`
interface Tubo { madre: number; agua: number }

export default function Colorimetria({ grado }: { grado: number }) {
  const [tubos, setTubos] = useState<Tubo[]>(() => Array.from({ length: 5 }, () => ({ madre: 0, agua: 0 })))
  const [x] = useState(() => Math.round((0.025 + Math.random() * 0.065) * 1000) / 1000)
  const [lecturas, setLecturas] = useState<{ id: string; c: number | null; A: number }[]>([])
  const [msg, setMsg] = useState<{ t: string; aviso?: boolean } | null>(null)
  const [est, setEst] = useState('')
  const [rev, setRev] = useState<string | null>(null)

  const conc = (t: Tubo) => (t.madre + t.agua ? (MADRE * t.madre) / (t.madre + t.agua) : 0)
  const ruido = () => 1 + (Math.random() - 0.5) * 0.04
  const once = grado >= 11

  const piezas: Pieza[] = [
    { id: 'madre', nombre: 'Solución madre CuSO₄ 0,10 M (pipeta de a 2 mL)', x: 80, y: 340, ancho: 60, alto: 100, tomable: true, color: azul(MADRE),
      dibujo: <g><path d="M-22 -30 h44 v62 q0 8 -8 8 h-28 q-8 0 -8 -8 z" fill={azul(MADRE)} stroke="#2b2b2b" strokeWidth="2" /><rect x="-10" y="-42" width="20" height="12" fill="#555" /><text y="12" textAnchor="middle" fontSize="9" fill="#fff" fontWeight="700">0,10 M</text></g> },
    { id: 'piseta', nombre: 'Piseta con agua destilada (de a 2 mL)', x: 170, y: 340, ancho: 60, alto: 100, tomable: true, color: '#dff0fb',
      dibujo: <g><path d="M-18 -20 h36 v50 q0 8 -8 8 h-20 q-8 0 -8 -8 z" fill="#eef7fd" stroke="#2b2b2b" strokeWidth="2" /><path d="M0 -20 v-14 l22 -8" fill="none" stroke="#2b2b2b" strokeWidth="3" /></g> },
    { id: 'gradilla', nombre: 'Gradilla', x: 500, y: 400, ancho: 330, alto: 16, dibujo: <rect x="-160" y="-6" width="320" height="12" rx="3" fill="#b98a4c" stroke="#2b2b2b" /> },
    ...tubos.map((t, k) => {
      const v = t.madre + t.agua
      return {
        id: `t${k}`, nombre: `Tubo ${k + 1} · ${v} mL${v ? ` (${t.madre} de madre + ${t.agua} de agua) · ${f(conc(t), 3)} M` : ''}`, x: 360 + k * 70, y: 340, ancho: 50, alto: 110, tomable: v === 10 && once,
        dibujo: <g>
          <path d="M-12 -46 V38 a12 12 0 0 0 24 0 V-46" fill="rgba(255,255,255,0.7)" stroke="#2b2b2b" strokeWidth="2" />
          {v > 0 && <path d={`M-11 ${46 - v * 8.4} V38 a11 11 0 0 0 22 0 V${46 - v * 8.4} Z`} fill={azul(conc(t))} />}
          <line x1="-12" y1="-38" x2="-6" y2="-38" stroke="#c0392b" strokeWidth="2" />
          <text y="66" textAnchor="middle" fontSize="11" fontWeight="800">{k + 1}</text>
        </g>,
      }
    }),
    { id: 'x', nombre: 'Muestra desconocida X (suéltala junto a un tubo para comparar)', x: 740, y: 330, ancho: 50, alto: 110, tomable: true,
      dibujo: <g><path d="M-12 -46 V38 a12 12 0 0 0 24 0 V-46" fill="rgba(255,255,255,0.7)" stroke="#2b2b2b" strokeWidth="2" /><path d="M-11 -38 V38 a11 11 0 0 0 22 0 V-38 Z" fill={azul(x)} /><text y="66" textAnchor="middle" fontSize="13" fontWeight="800">X</text></g> },
    ...(once ? [{ id: 'colorimetro', nombre: 'Colorímetro (suelta un tubo lleno)', x: 880, y: 330, ancho: 120, alto: 90,
      dibujo: <g><rect x="-56" y="-36" width="112" height="72" rx="8" fill="#4a5a68" stroke="#2b2b2b" strokeWidth="2" /><rect x="-44" y="-24" width="64" height="24" fill="#cfe8c4" /><text x="-12" y="-6" textAnchor="middle" fontSize="13" fontFamily="monospace">{lecturas.length ? f(lecturas[lecturas.length - 1].A, 3) : '0,000'}</text><circle cx="38" cy="-14" r="10" fill="#222" /><text y="24" textAnchor="middle" fontSize="10" fill="#fff">A (abs.)</text></g> }] : []),
    { id: 'caneca', nombre: 'Vaciar los tubos (toca)', x: 950, y: 410 - 30, ancho: 40, alto: 60,
      alTocar: () => { setTubos(Array.from({ length: 5 }, () => ({ madre: 0, agua: 0 }))); setLecturas([]); setMsg({ t: 'Tubos vacíos y lavados. El cobre va al frasco de residuos de metales, no al desagüe.' }) },
      dibujo: <g transform="scale(0.7)"><Caneca /></g> },
  ]

  const tids = tubos.map((_, k) => `t${k}`)
  const destinos = (de: string) => {
    if (de === 'madre' || de === 'piseta') return tids.filter((_, k) => tubos[k].madre + tubos[k].agua < 10)
    if (de === 'x') return [...tids.filter((_, k) => tubos[k].madre + tubos[k].agua === 10), ...(once ? ['colorimetro'] : [])]
    if (de.startsWith('t')) return ['colorimetro']
    return []
  }
  const soltar = (de: string, en: string): Uso | string => {
    if (de === 'madre' || de === 'piseta') {
      const k = Number(en.slice(1))
      const t = tubos[k]
      if (!en.startsWith('t')) return 'Va a uno de los tubos.'
      if (t.madre + t.agua >= 10) return 'El tubo ya llegó a la marca de 10 mL.'
      return { anim: 'gotas', gotas: 3, hecho: () => {
        const n = { madre: t.madre + (de === 'madre' ? 2 : 0), agua: t.agua + (de === 'piseta' ? 2 : 0) }
        setTubos((ts) => ts.map((y, j) => (j === k ? n : y)))
        if (n.madre + n.agua === 10) setMsg({ t: `Tubo ${k + 1} listo: ${n.madre} mL de madre + ${n.agua} mL de agua = ${f(conc(n), 3)} M.` })
      } }
    }
    if (de === 'x') {
      if (en === 'colorimetro') return { anim: 'poner', hecho: () => { const A = EPS * x * ruido(); setLecturas((l) => [...l.filter((y) => y.id !== 'X'), { id: 'X', c: null, A }]); setMsg({ t: `Muestra X: A = ${f(A, 3)}.` }) } }
      const c = conc(tubos[Number(en.slice(1))])
      const d = x - c
      return { anim: 'poner', hecho: () => setMsg({ t: `Sobre el fondo blanco, X se ve ${Math.abs(d) < 0.006 ? 'casi igual que' : d > 0 ? 'más oscura que' : 'más clara que'} el tubo ${Number(en.slice(1)) + 1}.` }) }
    }
    if (de.startsWith('t')) {
      const k = Number(de.slice(1))
      const c = conc(tubos[k])
      return { anim: 'poner', hecho: () => { const A = EPS * c * ruido(); setLecturas((l) => [...l.filter((y) => y.id !== de), { id: de, c, A }]); setMsg({ t: `Tubo ${k + 1} (${f(c, 3)} M): A = ${f(A, 3)}.` }) } }
    }
    return 'No se puede.'
  }

  const llenos = tubos.filter((t) => t.madre + t.agua === 10)
  const distintos = new Set(llenos.map((t) => t.madre)).size
  const comprobar = () => {
    const v = Number(est.replace(',', '.'))
    if (!v) return setRev('Escribe un número, por ejemplo 0,05.')
    const tol = once ? 0.005 : 0.01
    const ok = Math.abs(v - x) <= tol
    setRev(`${ok ? '✔ ¡Bien!' : '✘ No.'} La muestra X tenía ${f(x, 3)} M; dijiste ${f(v, 3)} M (error ${f((Math.abs(v - x) / x) * 100, 0)} %).${distintos < 4 ? ' Ojo: tu escala tiene pocos patrones distintos; con cinco concentraciones diferentes se estima mejor.' : ''}`)
  }

  const pats = lecturas.filter((l) => l.c !== null) as { id: string; c: number; A: number }[]
  const pend = pats.length >= 2 ? pats.reduce((a, p) => a + p.c * p.A, 0) / pats.reduce((a, p) => a + p.c * p.c, 0) : 0
  const Ax = lecturas.find((l) => l.id === 'X')?.A

  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-2xl border border-[var(--linea)] bg-[var(--tarjeta)] p-4 text-sm">
        <b>¿Qué concentración tiene la muestra X?</b> Arma una escala de patrones: en cada tubo pon solución madre de sulfato de cobre (0,10 M) y agua, de a 2 mL, hasta la marca de 10 mL, con una proporción distinta en cada uno. Luego compara el color de X con tus patrones{once ? ' o mide la absorbancia en el colorímetro' : ''} y escribe tu estimación.
      </p>
      <MesaViva desde={170} piezas={piezas} destinos={destinos} soltar={soltar} />
      {msg && <p className={`-mt-2 text-sm ${msg.aviso ? 'font-semibold text-[#b5462c]' : ''}`}>{msg.aviso ? '⚠ ' : '› '}{msg.t}</p>}
      {once && pats.length > 0 && <Grafica pats={pats} pend={pend} Ax={Ax} />}
      {once && pend > 0 && Ax !== undefined && <p className="-mt-2 text-center text-xs text-[var(--suave)]">Pendiente de la recta: {f(pend, 1)} M⁻¹. Despeja: c = A ÷ pendiente.</p>}
      <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
        <label>Concentración de X: <input value={est} onChange={(e) => setEst(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && comprobar()} className="w-24 rounded border border-[var(--linea)] px-2 py-1" placeholder="0,05" /> M</label>
        <button type="button" onClick={comprobar} className="min-h-10 rounded-full bg-[var(--acento)] px-5 font-semibold text-white">Comprobar</button>
      </div>
      {rev && <p className={`rounded-lg p-2 text-sm ${rev.startsWith('✔') ? 'bg-[#eaf5ee]' : 'bg-[#fbeee9]'}`}>{rev}</p>}
      {rev?.startsWith('✔') && (
        <p className="rounded-lg bg-[var(--tarjeta)] p-2 text-sm"><b>¿Por qué funciona?</b> Cuanto más concentrada está una solución coloreada, más luz absorbe y más intenso se ve su color. Al diluir la solución madre (C₁·V₁ = C₂·V₂) se obtienen patrones de concentración conocida, y la muestra se ubica entre los dos que más se le parecen.
          {once ? ' El colorímetro mide la absorbancia A, y la ley de Beer-Lambert dice que A = ε·l·c: es directamente proporcional a la concentración. Con los patrones se traza la recta (curva de calibración) y con la A de la muestra se despeja c. Así se mide el cloro del agua o la glucosa en la sangre.' : ''}
        </p>
      )}
      <p className="text-xs text-[var(--suave)]">Valores escolares aproximados. El sulfato de cobre es tóxico para los peces: sus residuos no van al desagüe.</p>
    </div>
  )
}

function Grafica({ pats, pend, Ax }: { pats: { c: number; A: number }[]; pend: number; Ax?: number }) {
  const X = (c: number) => 40 + c * 2400
  const Y = (A: number) => 150 - A * 105
  return (
    <svg viewBox="0 0 320 175" className="mx-auto w-full max-w-sm" role="img" aria-label="Curva de calibración">
      <line x1="40" y1="150" x2="300" y2="150" stroke="#333" /><line x1="40" y1="15" x2="40" y2="150" stroke="#333" />
      {[0.02, 0.04, 0.06, 0.08, 0.1].map((c) => <text key={c} x={X(c)} y="162" fontSize="8" textAnchor="middle">{f(c)}</text>)}
      {pend > 0 && <line x1={X(0)} y1={Y(0)} x2={X(0.105)} y2={Y(pend * 0.105)} stroke="#3f6fb8" strokeWidth="1.5" />}
      {pats.map((p, k) => <circle key={k} cx={X(p.c)} cy={Y(p.A)} r="4" fill="#3f6fb8" />)}
      {Ax !== undefined && <><line x1="40" y1={Y(Ax)} x2="300" y2={Y(Ax)} stroke="#c43c3c" strokeDasharray="4 3" /><text x="296" y={Y(Ax) - 4} fontSize="9" textAnchor="end" fill="#c43c3c">A de X = {f(Ax, 3)}</text></>}
      <text x="170" y="174" textAnchor="middle" fontSize="10">Concentración (M)</text>
      <text x="12" y="85" fontSize="10" transform="rotate(-90 12 85)" textAnchor="middle">Absorbancia</text>
    </svg>
  )
}
