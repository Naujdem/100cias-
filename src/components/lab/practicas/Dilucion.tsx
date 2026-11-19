import { useCallback, useEffect, useState } from 'react'
import MesaViva from '../MesaViva.tsx'
import type { Pieza, Uso } from '../MesaViva.tsx'
import { Caneca, Piseta } from '../dibujos.tsx'

// Laboratorio de Química 9 (PLAN-LABORATORIOS.md): dilución y solubilidad, en mesa viva.
// 1. Dilución: de la solución madre 0,5 M de CuSO₄ se preparan 100 mL de 0,1 M (11°: 0,05 M) con pipetas aforadas
//    de 5, 10 y 25 mL, matraz aforado, jarra, piseta, gotero y tapón (C₁·V₁ = C₂·V₂).
// 2. Solubilidad: 100 g de agua en la estufa (perilla que se toca); espátula de 10 g y de 2 g con KNO₃ o NaCl,
//    varilla, termómetro. La temperatura cambia en tiempo real; al enfriar salen cristales. Se anota tocando el
//    vaso cuando está saturada. Solubilidades de tabla aproximadas (g por 100 g de agua).

const f = (x: number, d = 1) => x.toLocaleString('es-CO', { minimumFractionDigits: d, maximumFractionDigits: d })
const BOTON = (on: boolean) => `rounded-full border px-4 py-1.5 text-sm font-semibold ${on ? 'border-[var(--acento)] bg-[var(--acento)] text-white' : 'border-[var(--linea)] bg-white'}`
const Msg = ({ m }: { m: { t: string; aviso?: boolean } | null }) => (m ? <p className={`-mt-2 text-sm ${m.aviso ? 'font-semibold text-[#b5462c]' : ''}`}>{m.aviso ? '⚠ ' : '› '}{m.t}</p> : null)
const azul = (M: number) => `rgba(30, 110, 210, ${Math.min(0.92, 0.06 + M * 1.3)})`

// ---------- 1. Dilución ----------
const MADRE = 0.5
const PIPETAS = [5, 10, 25]
const TOL = 0.15

function Dilucion({ grado }: { grado: number }) {
  const meta = grado >= 11 ? 0.05 : 0.1
  const [pip, setPip] = useState<(number | null)[]>([null, null, null]) // mL de solución madre cargados en cada pipeta
  const [madre, setMadre] = useState(0) // mL de solución madre en el matraz
  const [agua, setAgua] = useState(0)
  const [tapa, setTapa] = useState(false)
  const [inv, setInv] = useState(0)
  const [pasado, setPasado] = useState(false)
  const [res, setRes] = useState<{ ok: boolean; lineas: string[] } | null>(null)
  const [msg, setMsg] = useState<{ t: string; aviso?: boolean } | null>(null)
  const [gira, setGira] = useState(false)
  const V = madre + agua
  const M = V > 0 ? (MADRE * madre) / V : 0
  const alTomar = useCallback((id: string | null) => { if (id === 'tapa') setTapa(false) }, [])
  const nivel = V <= 92 ? 85 - (V / 92) * 45 : 40 - (V - 92) * 6.875
  const cerca = V > 96 && V < 104
  const echarAgua = (mL: number) => {
    const n = Math.round((agua + mL) * 100) / 100
    setAgua(n); setInv(0); setRes(null)
    if (madre + n > 100 + TOL && !pasado) { setPasado(true); setMsg({ t: 'Te pasaste del aforo: la solución quedó más diluida de lo que querías.', aviso: true }) }
    else if (Math.abs(madre + n - 100) <= TOL) setMsg({ t: '¡Aforado! El fondo del menisco toca la línea.' })
    else if (madre + n > 96) setMsg({ t: 'Ya vas cerca del aforo: sigue con el gotero.' })
  }
  const piezas: Pieza[] = [
    { id: 'madre', nombre: `Solución madre ${f(MADRE, 1)} M de CuSO₄`, x: 80, y: 310, ancho: 80, alto: 100, dibujo: <g><rect x="-30" y="-38" width="60" height="88" rx="8" fill="rgba(255,255,255,0.7)" stroke="#2b2b2b" strokeWidth="2" /><rect x="-28" y="-6" width="56" height="54" rx="6" fill={azul(MADRE)} /><rect x="-12" y="-50" width="24" height="12" fill="#5a4a3a" /><text y="-16" textAnchor="middle" fontSize="10" fontWeight="800">0,5 M</text></g> },
    ...PIPETAS.map((v, k) => ({
      id: `p${k}`, nombre: `Pipeta aforada de ${v} mL${pip[k] ? ' (llena)' : ''}`, x: 170 + k * 50, y: 300, ancho: 30, alto: 120, tomable: true, color: azul(MADRE),
      dibujo: <g><circle cy="-52" r="7" fill="#c0392b" /><rect x="-2.5" y="-45" width="5" height="30" fill={pip[k] ? azul(MADRE) : '#f6f9fc'} stroke="#2b2b2b" strokeWidth="1" /><ellipse cy={-15 + 4 + k * 2} rx={5 + k * 2} ry={10 + k * 3} fill={pip[k] ? azul(MADRE) : '#f6f9fc'} stroke="#2b2b2b" strokeWidth="1.2" /><rect x="-1.5" y={k * 5 + 8} width="3" height={50 - k * 5} fill={pip[k] ? azul(MADRE) : '#f6f9fc'} stroke="#2b2b2b" strokeWidth="0.8" /><line x1="-5" x2="5" y1="-35" y2="-35" stroke="#c43c3c" strokeWidth="1.5" /><text y="70" textAnchor="middle" fontSize="10" fontWeight="800">{v}</text></g>,
    })),
    { id: 'jarra', nombre: 'Agua destilada (≈25 mL)', x: 360, y: 330, ancho: 60, alto: 70, tomable: true, color: '#a9d3f5', dibujo: <g><path d="M-22 -30 H22 V28 Q22 34 16 34 H-16 Q-22 34 -22 28 Z" fill="rgba(255,255,255,0.7)" stroke="#2b2b2b" strokeWidth="2" /><rect x="-20" y="-6" width="40" height="38" rx="4" fill="#a9d3f5" /></g> },
    { id: 'piseta', nombre: 'Piseta (≈5 mL)', x: 440, y: 312, ancho: 60, alto: 100, tomable: true, color: '#a9d3f5', dibujo: <Piseta /> },
    { id: 'gotero', nombre: 'Gotero (2 gotas ≈ 0,2 mL)', x: 520, y: 352, ancho: 56, alto: 18, tomable: true, color: '#a9d3f5', dibujo: <g transform="rotate(-90)"><rect x="-6" y="-26" width="12" height="12" rx="5" fill="#333" /><path d="M-5 -14 H5 V14 L1 24 H-1 L-5 14 Z" fill="#dff0fb" stroke="#2b2b2b" strokeWidth="1.5" /></g> },
    { id: 'tapa', nombre: tapa ? 'Tapón (tómalo para quitarlo)' : 'Tapón', ...(tapa ? { x: 700, y: 182 } : { x: 600, y: 352 }), ancho: 30, alto: 18, tomable: true, dibujo: <path d="M-9 -7 H9 L7 7 H-7 Z" fill="#5a4a3a" /> },
    {
      id: 'matraz', nombre: tapa ? 'Matraz aforado de 100 mL (toca: invertir)' : 'Matraz aforado de 100 mL', x: 700, y: 275, ancho: 110, alto: 180,
      alTocar: () => { if (!tapa) return setMsg({ t: 'Pon primero el tapón.', aviso: true }); if (V <= 0) return; setGira(true); window.setTimeout(() => setGira(false), 700); setInv((n) => n + 1); setMsg({ t: `Inversión ${inv + 1}.` }) },
      dibujo: <g>
        <g style={{ transformBox: 'fill-box', transformOrigin: 'center', transform: `rotate(${gira ? 180 : 0}deg)`, transition: 'transform 350ms' }}>
          <clipPath id="dil-m"><path d="M-7 -85 V40 Q-48 47 -48 70 Q-48 85 0 85 Q48 85 48 70 Q48 47 7 40 V-85 Z" /></clipPath>
          {V > 0 && <rect x="-50" y={Math.max(-85, nivel)} width="100" height="200" fill={azul(M)} clipPath="url(#dil-m)" />}
          <path d="M-7 -85 V40 Q-48 47 -48 70 Q-48 85 0 85 Q48 85 48 70 Q48 47 7 40 V-85" fill="none" stroke="#3a3a3a" strokeWidth="3" />
          <line x1="-11" x2="11" y1="-15" y2="-15" stroke="#c43c3c" strokeWidth="2" />
        </g>
        {cerca && !gira && <g><circle cx="70" cy="-15" r="30" fill="#fff" stroke="#3a3a3a" strokeWidth="2" /><clipPath id="dil-l"><circle cx="70" cy="-15" r="29" /></clipPath><g clipPath="url(#dil-l)"><path d={`M50 ${-15 - (V - 100) * 25} Q70 ${-9 - (V - 100) * 25} 90 ${-15 - (V - 100) * 25} V30 H50 Z`} fill={azul(M)} /><line x1="40" x2="100" y1="-15" y2="-15" stroke="#c43c3c" strokeWidth="2" /></g></g>}
      </g>,
    },
    { id: 'caneca', nombre: 'Residuos (toca: empezar de nuevo)', x: 950, y: 324, ancho: 54, alto: 76, alTocar: () => { setPip([null, null, null]); setMadre(0); setAgua(0); setTapa(false); setInv(0); setPasado(false); setRes(null); setMsg({ t: 'Lo usado va al frasco de residuos (el cobre no va al desagüe).' }) }, dibujo: <Caneca /> },
  ]
  const destinos = (de: string) => (de.startsWith('p') ? (pip[+de.slice(1)] ? ['matraz'] : ['madre']) : ['matraz'])
  const soltar = (de: string, en: string): Uso | string => {
    setRes(null)
    if (de.startsWith('p')) {
      const k = +de.slice(1)
      if (en === 'madre') return pip[k] ? 'La pipeta ya está llena: vacíala en el matraz.' : { anim: 'poner', hecho: () => { setPip((x) => x.map((v, j) => (j === k ? PIPETAS[k] : v))); setMsg({ t: `Llenas la pipeta con la pera hasta la marca: ${PIPETAS[k]} mL de solución madre.` }) } }
      if (en !== 'matraz') return 'La pipeta se llena en la solución madre y se vacía en el matraz.'
      if (!pip[k]) return 'La pipeta está vacía: llénala en la solución madre.'
      if (tapa) return 'Quita el tapón primero.'
      return { anim: 'gotas', gotas: 5, hecho: () => { setMadre((m) => m + PIPETAS[k]); setPip((x) => x.map((v, j) => (j === k ? null : v))); setInv(0); setMsg({ t: `Vacías ${PIPETAS[k]} mL de solución madre en el matraz.` }) } }
    }
    if (en !== 'matraz') return 'Eso va en el matraz.'
    if (de === 'tapa') return { anim: 'poner', hecho: () => setTapa(true) }
    if (tapa) return 'Quita el tapón primero.'
    const mL = de === 'jarra' ? 25 : de === 'piseta' ? 5 : 0.2
    return de === 'gotero' ? { anim: 'gotas', gotas: 2, hecho: () => echarAgua(mL) } : { anim: 'verter', hecho: () => echarAgua(mL) }
  }
  const comprobar = () => {
    const l: string[] = []
    const necesita = (meta * 100) / MADRE
    let ok = Math.abs(M - meta) / meta <= 0.02
    if (Math.abs(madre - necesita) > 0.01) l.push(`Usaste ${f(madre, 0)} mL de solución madre y se necesitaban ${f(necesita, 0)} mL: C₁·V₁ = C₂·V₂ → V₁ = ${f(meta, 2)} × 100 ÷ ${f(MADRE, 1)} = ${f(necesita, 0)} mL.`)
    if (pasado) { ok = false; l.push('Te pasaste del aforo.') } else if (V < 100 - TOL) { ok = false; l.push(`Falta agua: hay ${f(V, 1)} mL.`) }
    if (inv < 5) { if (grado >= 11) ok = false; l.push(`Mezcla mejor: tapa e invierte el matraz al menos 5 veces (llevas ${inv}).`) }
    if (!l.length) l.push('Volumen de solución madre correcto, aforo exacto y solución homogénea.')
    setRes({ ok, lineas: [`Tu solución es ${f(M, 3)} M (se buscaba ${f(meta, 3)} M).`, ...l] })
  }
  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-2xl bg-[var(--tarjeta)] p-4 text-sm">Diluir es agregar solvente: la cantidad de soluto no cambia, pero queda repartida en más volumen. A partir de la solución madre <b>0,5 M</b> prepara <b>100 mL de solución {f(meta, meta < 0.1 ? 2 : 1)} M</b>. Calcula cuánta solución madre necesitas, tómala con las pipetas, pásala al matraz y completa con agua hasta el aforo.{grado < 11 ? ' Pista: C₁·V₁ = C₂·V₂.' : ''}</p>
      <MesaViva desde={160} piezas={piezas} destinos={destinos} soltar={soltar} alTomar={alTomar} />
      <Msg m={msg} />
      <p className="text-sm">En el matraz: {f(madre, 0)} mL de solución madre + {f(agua, 1)} mL de agua = <b>{f(V, 1)} mL</b>.</p>
      <button type="button" onClick={comprobar} className="self-start min-h-10 rounded-full bg-[var(--acento)] px-5 text-sm font-semibold text-white">Comprobar</button>
      {res && <div className={`rounded-xl p-3 text-sm ${res.ok ? 'bg-[#eaf5ee]' : 'bg-[#fbeee9]'}`}>{res.lineas.map((x, k) => <p key={k} className={k === 0 ? 'font-semibold' : 'mt-1'}>{k === 0 ? (res.ok ? '✔ ' : '✘ ') : ''}{x}</p>)}</div>}
    </div>
  )
}

// ---------- 2. Solubilidad y temperatura ----------
const SALES = {
  kno3: { n: 'Nitrato de potasio (salitre)', f: 'KNO₃', tabla: [[0, 13], [20, 32], [40, 64], [60, 110], [80, 169]] as [number, number][] },
  nacl: { n: 'Cloruro de sodio (sal)', f: 'NaCl', tabla: [[0, 35.7], [20, 36], [40, 36.6], [60, 37.3], [80, 38.4]] as [number, number][] },
}
type SalId = keyof typeof SALES
const solub = (s: SalId, T: number) => {
  const t = SALES[s].tabla
  for (let k = 1; k < t.length; k++) if (T <= t[k][0]) { const [a, sa] = t[k - 1], [b, sb] = t[k]; return sa + ((T - a) / (b - a)) * (sb - sa) }
  return t[t.length - 1][1]
}
const NIVELES = [20, 40, 60, 80]

function Solubilidad({ grado }: { grado: number }) {
  const [sal, setSal] = useState<SalId | null>(null)
  const [total, setTotal] = useState(0) // g echados
  const [disuelto, setDisuelto] = useState(0)
  const [T, setT] = useState(20)
  const [nivel, setNivel] = useState(-1) // -1 apagada
  const [carga, setCarga] = useState<{ esp: SalId | null; micro: SalId | null }>({ esp: null, micro: null })
  const [datos, setDatos] = useState<{ s: SalId; T: number; g: number }[]>([])
  const [msg, setMsg] = useState<{ t: string; aviso?: boolean } | null>(null)
  const objetivo = nivel < 0 ? 20 : NIVELES[nivel]
  useEffect(() => {
    if (Math.abs(T - objetivo) < 0.3) return
    const id = window.setTimeout(() => setT((x) => +(x + (objetivo - x) * 0.2).toFixed(1)), 1000)
    return () => window.clearTimeout(id)
  }, [T, objetivo])
  // al enfriarse, lo que ya no cabe vuelve a ser sólido (cristales)
  useEffect(() => { if (sal && disuelto > solub(sal, T) + 0.5) { setDisuelto(Math.round(solub(sal, T) * 10) / 10); setMsg({ t: 'Al enfriarse, aparecen cristales: el agua ya no puede tener disuelto tanto soluto.' }) } }, [T, sal, disuelto])
  const solido = total - disuelto
  const piezas: Pieza[] = [
    ...(['kno3', 'nacl'] as SalId[]).map((s, k) => ({ id: s, nombre: SALES[s].n, x: 70 + k * 80, y: 318, ancho: 64, alto: 84, dibujo: <g><rect x="-26" y="-36" width="52" height="76" rx="8" fill="#fff" stroke="#2b2b2b" strokeWidth="2" /><rect x="-12" y="-46" width="24" height="10" fill="#5a4a3a" /><rect x="-26" y="4" width="52" height="34" rx="6" fill="#f4f4f4" /><text y="-12" textAnchor="middle" fontSize="11" fontWeight="800">{SALES[s].f}</text></g> })),
    ...(['esp', 'micro'] as const).map((e, k) => ({ id: e, nombre: e === 'esp' ? 'Espátula (≈10 g)' : 'Microespátula (≈2 g)', x: 260 + k * 90, y: 395, ancho: 80, alto: 22, tomable: true, color: '#f4f4f4', dibujo: <g><rect x="-34" y="-3" width="46" height="6" rx="2" fill="#8a6a45" /><path d={e === 'esp' ? 'M12 -4 H32 Q42 0 32 4 H12 Z' : 'M12 -2 H34 Q36 0 34 2 H12 Z'} fill="#b8c2cc" stroke="#555" />{carga[e] && <ellipse cx="27" cy="-4" rx={e === 'esp' ? 8 : 4} ry="4" fill="#f4f4f4" stroke="#999" />}</g> })),
    { id: 'varilla', nombre: 'Varilla de vidrio', x: 450, y: 398, ancho: 96, alto: 16, tomable: true, dibujo: <rect x="-45" y="-2.5" width="90" height="5" rx="2.5" fill="#dfeaf3" stroke="#6b7a88" strokeWidth="1.2" /> },
    {
      id: 'vaso', nombre: `Vaso con 100 g de agua (toca: anotar)`, x: 640, y: 270, ancho: 110, alto: 110,
      alTocar: () => {
        if (!sal) return setMsg({ t: 'Todavía no has echado nada.', aviso: true })
        if (solido < 0.5) return setMsg({ t: 'No está saturada: todo se disolvió. Echa más hasta que quede sólido aunque agites.', aviso: true })
        if (Math.abs(T - objetivo) > 1.5) return setMsg({ t: 'Espera a que la temperatura se estabilice.', aviso: true })
        const t = Math.round(T)
        setDatos((d) => [...d.filter((x) => !(x.s === sal && Math.abs(x.T - t) < 3)), { s: sal, T: t, g: Math.round(disuelto) }])
        setMsg({ t: `Anotas: a ${t} °C se disuelven ≈ ${f(disuelto, 0)} g de ${SALES[sal].f} en 100 g de agua.` })
      },
      dibujo: <g><path d="M-48 -50 V50 H48 V-50" fill="rgba(255,255,255,0.5)" stroke="#2b2b2b" strokeWidth="2.5" /><rect x="-46" y="-10" width="92" height="59" fill="#d8ecf8" />{solido > 0.5 && <path d={`M-40 49 Q0 ${49 - Math.min(30, 4 + Math.sqrt(solido) * 3)} 40 49 Z`} fill="#fafafa" stroke="#aaa" />}{solido > 0.5 && T < objetivo + 1 && disuelto > 0 && [-20, 5, 22].map((x) => <path key={x} d={`M${x} 40 l4 -6 l4 6 z`} fill="#fff" stroke="#aaa" />)}<text y="70" textAnchor="middle" fontSize="11" fontWeight="700">{sal ? SALES[sal].f : 'agua'}</text></g>,
    },
    { id: 'estufa', nombre: nivel < 0 ? 'Estufa apagada (toca: subir)' : `Estufa a ${NIVELES[nivel]} °C (toca: cambiar)`, x: 640, y: 345, ancho: 150, alto: 30, alTocar: () => setNivel((n) => (n >= NIVELES.length - 1 ? -1 : n + 1)), dibujo: <g><rect x="-70" y="-12" width="140" height="28" rx="4" fill="#5d6d7e" stroke="#2b2b2b" strokeWidth="2" /><circle cx="52" cy="2" r="8" fill={nivel < 0 ? '#999' : '#e74c3c'} />{nivel >= 0 && <path d="M-50 -12 Q0 -20 40 -12" fill="none" stroke="#e67e22" strokeWidth={2 + nivel} />}<text x="-20" y="7" textAnchor="middle" fontSize="10" fill="#fff" fontWeight="700">{nivel < 0 ? 'apagada' : `${NIVELES[nivel]} °C`}</text></g> },
    { id: 'termo', nombre: `Termómetro: ${f(T, 0)} °C`, x: 720, y: 240, ancho: 30, alto: 100, dibujo: <g><rect x="-3" y="-50" width="6" height="90" rx="3" fill="#fff" stroke="#2b2b2b" /><rect x="-1.5" y={36 - T * 0.85} width="3" height={T * 0.85} fill="#c0392b" /><circle cy="42" r="6" fill="#c0392b" /><text x="10" y="-40" fontSize="12" fontWeight="800">{f(T, 0)} °C</text></g> },
    { id: 'caneca', nombre: 'Residuos (toca: vaso nuevo con agua)', x: 950, y: 324, ancho: 54, alto: 76, alTocar: () => { setSal(null); setTotal(0); setDisuelto(0); setMsg({ t: 'Vaso nuevo con 100 g de agua.' }) }, dibujo: <Caneca /> },
  ]
  const destinos = (de: string) => (de === 'esp' || de === 'micro' ? (carga[de] ? ['vaso'] : ['kno3', 'nacl']) : ['vaso'])
  const soltar = (de: string, en: string): Uso | string => {
    if (de === 'esp' || de === 'micro') {
      const c = carga[de]
      if (en === 'kno3' || en === 'nacl') return c ? 'La espátula ya está cargada: échala al vaso.' : { anim: 'poner', hecho: () => setCarga((x) => ({ ...x, [de]: en })) }
      if (en !== 'vaso') return 'El sólido va al vaso.'
      if (!c) return 'La espátula está vacía: cárgala en un frasco.'
      if (sal && sal !== c) return 'El vaso ya tiene otra sal: vacíalo en la caneca para no revolverlas.'
      return { anim: 'polvo', hecho: () => { setSal(c); setTotal((t) => t + (de === 'esp' ? 10 : 2)); setCarga((x) => ({ ...x, [de]: null })) } }
    }
    if (de === 'varilla') {
      if (!sal || solido < 0.01) return 'No hay sólido por disolver.'
      return {
        anim: 'frotar',
        hecho: () => {
          const max = solub(sal, T)
          const d = Math.min(total, max)
          setDisuelto(d)
          setMsg(total > max + 0.5 ? { t: `Queda sólido sin disolver aunque agites: la solución está saturada a ${f(T, 0)} °C. Toca el vaso para anotar.` } : { t: 'Todo se disolvió: la solución no está saturada.' })
        },
      }
    }
    return 'No se puede.'
  }
  const curva = (s: SalId) => datos.filter((d) => d.s === s).sort((a, b) => a.T - b.T)
  const X = (t: number) => 40 + t * 3.1, Y = (g: number) => 170 - g * 0.85
  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-2xl bg-[var(--tarjeta)] p-4 text-sm">¿Cuánto soluto cabe en 100 g de agua? Echa sal con la espátula y agita con la varilla hasta que quede sólido sin disolver: la solución está <b>saturada</b>. Toca el vaso para anotar. Luego sube la temperatura con la estufa (tócala), agita otra vez y repite. Compara el salitre con la sal de cocina. Si bajas la temperatura, mira qué pasa.</p>
      <MesaViva desde={150} piezas={piezas} destinos={destinos} soltar={soltar} />
      <Msg m={msg} />
      <p className="text-sm">Echado: <b>{f(total, 0)} g</b> · disuelto: <b>{f(disuelto, 0)} g</b> · sin disolver: <b>{f(Math.max(0, solido), 0)} g</b> · {f(T, 0)} °C</p>
      {datos.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          <svg viewBox="0 0 300 200" className="w-full max-w-sm" role="img" aria-label="Curva de solubilidad">
            <line x1="40" y1="170" x2="295" y2="170" stroke="#555" /><line x1="40" y1="15" x2="40" y2="170" stroke="#555" />
            {[0, 20, 40, 60, 80].map((t) => <text key={t} x={X(t)} y="183" textAnchor="middle" fontSize="9">{t}</text>)}
            {[0, 50, 100, 150].map((g) => <text key={g} x="34" y={Y(g) + 3} textAnchor="end" fontSize="9">{g}</text>)}
            {(['kno3', 'nacl'] as SalId[]).map((s, k) => <g key={s}><polyline points={curva(s).map((d) => `${X(d.T)},${Y(d.g)}`).join(' ')} fill="none" stroke={k ? '#e67e22' : '#2e86c1'} strokeWidth="2" />{curva(s).map((d) => <circle key={d.T} cx={X(d.T)} cy={Y(d.g)} r="4" fill={k ? '#e67e22' : '#2e86c1'} />)}</g>)}
            <text x="168" y="197" textAnchor="middle" fontSize="10">Temperatura (°C)</text>
            <text x="200" y="25" fontSize="10" fill="#2e86c1">KNO₃</text><text x="200" y="38" fontSize="10" fill="#e67e22">NaCl</text>
          </svg>
          <div className="rounded-xl bg-[var(--tarjeta)] p-3 text-sm">{datos.map((d, k) => <p key={k}>{SALES[d.s].f} a {d.T} °C: {d.g} g / 100 g de agua</p>)}</div>
        </div>
      )}
      {datos.length >= 4 && <p className="rounded-lg bg-[#eaf5ee] p-2 text-sm"><b>Conclusión:</b> la <b>solubilidad</b> es la máxima cantidad de soluto que se disuelve en 100 g de agua a una temperatura. En la mayoría de los sólidos aumenta con la temperatura: el salitre casi se quintuplica de 20 °C a 80 °C, mientras que la sal de cocina casi no cambia. Al enfriar una solución saturada, lo que sobra se cristaliza.{grado >= 9 ? ' Por debajo de la curva la solución está insaturada; sobre la curva, saturada; si se enfría con cuidado sin que cristalice, queda sobresaturada.' : ''}</p>}
    </div>
  )
}

export default function DilucionSolubilidad({ grado }: { grado: number }) {
  const [parte, setParte] = useState(0)
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {['1. Dilución', '2. Solubilidad y temperatura'].map((t, k) => <button key={t} type="button" onClick={() => setParte(k)} className={BOTON(parte === k)}>{t}</button>)}
      </div>
      {parte === 0 ? <Dilucion grado={grado} /> : <Solubilidad grado={grado} />}
      <p className="text-xs text-[var(--suave)]">Versión casera: dilución con jugo concentrado o colorante y jeringas; solubilidad con azúcar o sal en un vaso de agua tibia y caliente (la caliente la maneja un adulto). Solubilidades aproximadas de tabla.</p>
    </div>
  )
}
