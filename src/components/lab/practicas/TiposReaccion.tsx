import { useCallback, useEffect, useState } from 'react'
import MesaViva from '../MesaViva.tsx'
import type { Pieza, Uso } from '../MesaViva.tsx'
import { Caneca } from '../dibujos.tsx'

// Laboratorio de Química 6 (PLAN-LABORATORIOS.md): tipos de reacción, en mesa viva.
// 1. Sustitución simple: hierro (lijado o no), zinc y cobre en sulfato de cobre; el tiempo corre (1 s = 1 min).
// 2. Doble sustitución: goteros a los tubos de la gradilla; precipitados de colores o nada.
// 3. Descomposición: electrólisis del agua (agua, electrolito, batería); gases 2:1 que se prueban con fósforo
//    y astilla. Modelo cualitativo; colores aproximados.

const f = (x: number, d = 1) => x.toLocaleString('es-CO', { minimumFractionDigits: d, maximumFractionDigits: d })
const BOTON = (on: boolean) => `rounded-full border px-4 py-1.5 text-sm font-semibold ${on ? 'border-[var(--acento)] bg-[var(--acento)] text-white' : 'border-[var(--linea)] bg-white'}`
const Msg = ({ m }: { m: { t: string; aviso?: boolean } | null }) => (m ? <p className={`-mt-2 text-sm ${m.aviso ? 'font-semibold text-[#b5462c]' : ''}`}>{m.aviso ? '⚠ ' : '› '}{m.t}</p> : null)

// ---------- 1. Sustitución simple ----------
const METALES = [
  { id: 'fe', n: 'Clavo de hierro', color: '#7b8189', capa: '#b5562c', final: 'verde pálido', eq: 'Fe + CuSO₄ → FeSO₄ + Cu' },
  { id: 'zn', n: 'Lámina de zinc', color: '#b9c2c9', capa: '#3d2b22', final: 'casi incolora', eq: 'Zn + CuSO₄ → ZnSO₄ + Cu' },
  { id: 'cu', n: 'Alambre de cobre', color: '#c56a32', capa: '#c56a32', final: 'azul (no cambia)', eq: 'Cu + CuSO₄ → no hay reacción' },
]
interface Vaso { metal: number | null; t: number; lijado: boolean }

function Sustitucion({ grado }: { grado: number }) {
  const [vasos, setVasos] = useState<Vaso[]>([0, 1, 2].map(() => ({ metal: null, t: 0, lijado: false })))
  const [lijado, setLijado] = useState(false)
  const [msg, setMsg] = useState<{ t: string; aviso?: boolean } | null>(null)
  useEffect(() => {
    if (!vasos.some((v) => v.metal !== null && v.t < 15)) return
    const id = window.setTimeout(() => setVasos((vs) => vs.map((v) => (v.metal !== null && v.t < 15 ? { ...v, t: v.t + 1 } : v))), 1000)
    return () => window.clearTimeout(id)
  }, [vasos])
  const avance = (v: Vaso) => (v.metal === null ? 0 : Math.min(1, (v.t / 10) * [v.lijado ? 1 : 0.25, 1.6, 0][v.metal]))
  const dentroDe = (m: number) => vasos.findIndex((v) => v.metal === m)
  const alTomar = useCallback((id: string | null) => {
    if (id?.startsWith('m')) { const m = +id.slice(1); setVasos((vs) => vs.map((v) => (v.metal === m ? { ...v, metal: null } : v))) }
  }, [])
  const azul = (p: number, m: number | null) => `rgba(${30 + (m === 0 ? 120 : 200) * p}, ${110 + 90 * p}, ${210 - (m === 0 ? 120 : 80) * p}, ${0.75 - 0.5 * p})`
  const piezas: Pieza[] = [
    { id: 'lija', nombre: 'Lija', x: 90, y: 352, ancho: 60, alto: 20, tomable: true, dibujo: <rect x="-26" y="-6" width="52" height="12" rx="2" fill="#c9a36b" stroke="#7a5a2a" /> },
    ...METALES.map((m, k) => {
      const v = dentroDe(k)
      const pos = v >= 0 ? { x: 420 + v * 170, y: 290 } : { x: 170 + k * 70, y: 340 }
      const p = v >= 0 ? avance(vasos[v]) : 0
      const sucio = k === 0 && !lijado
      return {
        id: `m${k}`, nombre: `${m.n}${k === 0 ? (lijado ? ' (lijado)' : ' (oxidado)') : ''}`, ...pos, ancho: 30, alto: 90, tomable: true,
        dibujo: <g transform={v >= 0 ? undefined : 'rotate(-12)'}><rect x={k === 1 ? -8 : -3} y="-42" width={k === 1 ? 16 : 6} height="84" fill={sucio ? '#8a5a3a' : m.color} stroke="#333" strokeWidth="1" />{k === 0 && <rect x="-7" y="-46" width="14" height="5" fill={m.color} stroke="#333" />}{p > 0 && k !== 2 && <rect x={k === 1 ? -9 : -4} y="0" width={k === 1 ? 18 : 8} height="42" fill={m.capa} opacity={Math.min(1, p * 1.3)} />}</g>,
      }
    }),
    ...vasos.map((v, k) => {
      const p = avance(v)
      return {
        id: `v${k}`, nombre: `Vaso ${k + 1} con sulfato de cobre${v.metal !== null ? ` · ${v.t} min` : ''}`, x: 420 + k * 170, y: 310, ancho: 100, alto: 100,
        dibujo: <g><path d="M-44 -45 V48 H44 V-45" fill="rgba(255,255,255,0.5)" stroke="#2b2b2b" strokeWidth="2.5" /><rect x="-42" y="-10" width="84" height="57" fill={azul(p, v.metal)} />{v.metal !== null && v.metal !== 2 && p > 0.3 && <ellipse cy="44" rx={10 + 20 * p} ry="3" fill={METALES[v.metal].capa} opacity="0.7" />}<text y="64" textAnchor="middle" fontSize="11" fontWeight="700">Vaso {k + 1}</text></g>,
      }
    }),
    { id: 'caneca', nombre: 'Residuos (toca: empezar de nuevo)', x: 950, y: 324, ancho: 54, alto: 76, alTocar: () => { setVasos([0, 1, 2].map(() => ({ metal: null, t: 0, lijado: false }))); setLijado(false); setMsg(null) }, dibujo: <Caneca /> },
  ]
  const destinos = (de: string) => (de === 'lija' ? ['m0'] : ['v0', 'v1', 'v2'])
  const soltar = (de: string, en: string): Uso | string => {
    if (de === 'lija') return en === 'm0' ? (lijado ? 'Ya está brillante.' : { anim: 'frotar', hecho: () => { setLijado(true); setMsg({ t: 'Lijas el clavo: se le quita el óxido y la grasa, y queda el hierro brillante.' }) } }) : 'La lija es para limpiar el clavo.'
    if (!en.startsWith('v')) return 'El metal va dentro de un vaso con sulfato de cobre.'
    const k = +en.slice(1), m = +de.slice(1)
    if (vasos[k].metal !== null) return 'Ese vaso ya tiene un metal: usa otro.'
    if (vasos[k].t > 0) return 'Ese vaso ya se usó: empieza de nuevo en la caneca.'
    return { anim: 'poner', hecho: () => { setVasos((vs) => vs.map((v, j) => (j === k ? { metal: m, t: 0, lijado: m === 0 && lijado } : v))); setMsg(m === 0 && !lijado ? { t: 'El clavo está oxidado: la capa de óxido no deja que el hierro toque la solución.', aviso: true } : { t: 'El tiempo corre (1 s = 1 min). Observa el metal y el color del líquido.' }) } }
  }
  const listos = vasos.filter((v) => v.metal !== null || v.t > 0)
  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-2xl bg-[var(--tarjeta)] p-4 text-sm">En la <b>sustitución simple</b> un elemento toma el lugar de otro en un compuesto. Mete cada metal en un vaso con sulfato de cobre (azul) y observa durante 10 minutos. ¿Cuáles metales reaccionan? Antes, revisa el clavo.</p>
      <MesaViva desde={180} piezas={piezas} destinos={destinos} soltar={soltar} alTomar={alTomar} />
      <Msg m={msg} />
      {listos.length > 0 && (
        <div className="rounded-xl bg-[var(--tarjeta)] p-3 text-sm">
          {vasos.map((v, k) => v.metal !== null && (
            <p key={k}>Vaso {k + 1} · {METALES[v.metal].n} · {v.t} min: {avance(v) < 0.05 ? 'no se ve cambio.' : `se cubre de una capa ${v.metal === 0 ? 'rojiza (cobre)' : 'oscura y esponjosa (cobre)'}; el líquido se pone ${avance(v) > 0.8 ? METALES[v.metal].final : 'menos azul'}.`}{v.metal === 0 && !v.lijado ? ' (clavo sin lijar: muy lento)' : ''}</p>
          ))}
          {vasos.some((v) => v.metal !== null && v.t >= 10) && (
            <p className="mt-2 rounded-lg bg-[#eaf5ee] p-2"><b>Conclusión:</b> el hierro y el zinc son más <b>activos</b> que el cobre: lo sacan de la solución y quedan disueltos en su lugar. El cobre no puede sacarse a sí mismo. Orden de actividad: Zn &gt; Fe &gt; Cu.
              {grado >= 9 && <><br />{METALES.map((m) => m.eq).join(' · ')}</>}
              {grado >= 11 && <><br />Es una reacción redox: Fe → Fe²⁺ + 2e⁻ (oxidación) y Cu²⁺ + 2e⁻ → Cu (reducción).</>}</p>
          )}
        </div>
      )}
    </div>
  )
}

// ---------- 2. Doble sustitución ----------
const GOTEROS = [
  { id: 'cuso4', n: 'Sulfato de cobre', f: 'CuSO₄', color: '#5aa0e6' },
  { id: 'fecl3', n: 'Cloruro de hierro (III)', f: 'FeCl₃', color: '#e8a83a' },
  { id: 'cacl2', n: 'Cloruro de calcio', f: 'CaCl₂', color: '#eef6fb' },
  { id: 'nacl', n: 'Cloruro de sodio', f: 'NaCl', color: '#eef6fb' },
  { id: 'naoh', n: 'Hidróxido de sodio', f: 'NaOH', color: '#eef6fb' },
  { id: 'na2co3', n: 'Carbonato de sodio', f: 'Na₂CO₃', color: '#eef6fb' },
  { id: 'agno3', n: 'Nitrato de plata', f: 'AgNO₃', color: '#eef6fb' },
]
const PRECIP: Record<string, { color: string; n: string; eq: string }> = {
  'cuso4+naoh': { color: '#3b7fd9', n: 'azul gelatinoso: hidróxido de cobre', eq: 'CuSO₄ + 2 NaOH → Cu(OH)₂↓ + Na₂SO₄' },
  'fecl3+naoh': { color: '#9a4a1e', n: 'pardo rojizo: hidróxido de hierro (III)', eq: 'FeCl₃ + 3 NaOH → Fe(OH)₃↓ + 3 NaCl' },
  'cacl2+na2co3': { color: '#ffffff', n: 'blanco: carbonato de calcio (como la tiza)', eq: 'CaCl₂ + Na₂CO₃ → CaCO₃↓ + 2 NaCl' },
  'agno3+nacl': { color: '#f4f4f4', n: 'blanco cuajado: cloruro de plata', eq: 'NaCl + AgNO₃ → AgCl↓ + NaNO₃' },
  'agno3+cacl2': { color: '#f4f4f4', n: 'blanco cuajado: cloruro de plata', eq: 'CaCl₂ + 2 AgNO₃ → 2 AgCl↓ + Ca(NO₃)₂' },
  'agno3+fecl3': { color: '#efe4c8', n: 'blanco amarillento: cloruro de plata', eq: 'FeCl₃ + 3 AgNO₃ → 3 AgCl↓ + Fe(NO₃)₃' },
  'cuso4+na2co3': { color: '#5fae9a', n: 'verde azulado: carbonato de cobre', eq: 'CuSO₄ + Na₂CO₃ → CuCO₃↓ + Na₂SO₄' },
  'fecl3+na2co3': { color: '#9a4a1e', n: 'pardo rojizo, con burbujas', eq: '2 FeCl₃ + 3 Na₂CO₃ + 3 H₂O → 2 Fe(OH)₃↓ + 6 NaCl + 3 CO₂↑' },
}
const clave = (a: string[]) => [...a].sort().join('+')

function DobleSustitucion({ grado }: { grado: number }) {
  const [tubos, setTubos] = useState<string[][]>([[], [], [], []])
  const [obs, setObs] = useState<{ par: string; texto: string }[]>([])
  const [msg, setMsg] = useState<{ t: string; aviso?: boolean } | null>(null)
  const G = (id: string) => GOTEROS.find((g) => g.id === id)!
  const piezas: Pieza[] = [
    ...GOTEROS.map((g, k) => ({ id: g.id, nombre: `${g.n}${grado >= 9 ? ` (${g.f})` : ''}`, x: 60 + k * 62, y: 330, ancho: 44, alto: 70, tomable: true, color: g.color, dibujo: <g><rect x="-14" y="-10" width="28" height="44" rx="4" fill={g.color} stroke="#2b2b2b" strokeWidth="2" /><rect x="-5" y="-30" width="10" height="20" rx="4" fill="#333" /><text y="16" textAnchor="middle" fontSize="8" fontWeight="800">{g.f}</text></g> })),
    { id: 'gradilla', nombre: 'Gradilla', x: 700, y: 345, ancho: 0, alto: 0, dibujo: <rect x="-150" y="-6" width="300" height="20" rx="3" fill="#8a6a45" /> },
    ...tubos.map((t, k) => {
      const P = t.length === 2 ? PRECIP[clave(t)] : undefined
      const liq = t.length ? G(t[0]).color : 'none'
      return {
        id: `t${k}`, nombre: `Tubo ${k + 1}${t.length ? `: ${t.map((x) => G(x).f).join(' + ')}` : ''}`, x: 600 + k * 66, y: 280, ancho: 40, alto: 120,
        dibujo: <g><path d="M-12 -55 V45 A12 12 0 0 0 12 45 V-55" fill="rgba(255,255,255,0.6)" stroke="#2b2b2b" strokeWidth="2" />{t.length > 0 && <path d={`M-11 ${t.length === 2 ? 0 : 22} V45 A11 11 0 0 0 11 45 V${t.length === 2 ? 0 : 22} Z`} fill={t.length === 2 && t.includes('cuso4') ? '#9cc7ef' : liq} opacity="0.85" />}{P && <path d="M-11 34 V45 A11 11 0 0 0 11 45 V34 Z" fill={P.color} stroke="#999" strokeWidth="0.5" />}{P && Array.from({ length: 6 }, (_, j) => <circle key={j} cx={-6 + ((j * 5) % 12)} cy={10 + j * 4} r="2.2" fill={P.color} stroke="#999" strokeWidth="0.3" />)}<text y="76" textAnchor="middle" fontSize="11" fontWeight="700">{k + 1}</text></g>,
      }
    }),
    { id: 'caneca', nombre: 'Residuos (toca: lavar los tubos)', x: 950, y: 324, ancho: 54, alto: 76, alTocar: () => { setTubos([[], [], [], []]); setMsg({ t: 'Lavas los tubos. (Los restos con plata o cobre van al frasco de residuos, no al desagüe.)' }) }, dibujo: <Caneca /> },
  ]
  const soltar = (de: string, en: string): Uso | string => {
    if (!en.startsWith('t')) return 'Las gotas van en un tubo de la gradilla.'
    const k = +en.slice(1)
    const t = tubos[k]
    if (t.includes(de)) return 'Ese reactivo ya está en el tubo.'
    if (t.length >= 2) return 'El tubo ya tiene dos reactivos: lávalo (caneca) o usa otro.'
    return {
      anim: 'gotas', gotas: 4,
      hecho: () => {
        const n = [...t, de]
        setTubos((ts) => ts.map((x, j) => (j === k ? n : x)))
        if (n.length < 2) return setMsg({ t: `Tubo ${k + 1}: ${G(de).n}. Agrega otro reactivo.` })
        const P = PRECIP[clave(n)]
        const texto = P ? `se forma un sólido ${P.n}` : 'no pasa nada visible: los iones siguen disueltos'
        setObs((o) => [...o.filter((x) => x.par !== clave(n)), { par: clave(n), texto }])
        setMsg({ t: `Tubo ${k + 1}: ${texto}.`, aviso: false })
      },
    }
  }
  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-2xl bg-[var(--tarjeta)] p-4 text-sm">En la <b>doble sustitución</b> dos compuestos intercambian sus partes. Echa gotas de dos soluciones en cada tubo. Si uno de los productos no se disuelve, aparece un sólido: un <b>precipitado</b>. ¿Qué parejas forman precipitado y de qué color?</p>
      <MesaViva desde={190} piezas={piezas} destinos={() => ['t0', 't1', 't2', 't3']} soltar={soltar} />
      <Msg m={msg} />
      {obs.length > 0 && (
        <div className="rounded-xl bg-[var(--tarjeta)] p-3 text-sm">
          <p className="font-semibold">Tus observaciones</p>
          {obs.map((o) => <p key={o.par} className="mt-1">{o.par.split('+').map((x) => G(x).f).join(' + ')}: {o.texto}.{grado >= 9 && PRECIP[o.par] ? <span className="text-[var(--suave)]"> {PRECIP[o.par].eq}</span> : ''}</p>)}
          {obs.length >= 3 && <p className="mt-2 rounded-lg bg-[#eaf5ee] p-2"><b>Conclusión:</b> no todas las parejas reaccionan de forma visible. Hay precipitado cuando el intercambio forma un compuesto que no se disuelve en agua (hidróxidos de cobre y hierro, carbonato de calcio, cloruro de plata).{grado >= 11 ? ' En forma iónica solo cuentan los iones que forman el sólido, por ejemplo Ag⁺ + Cl⁻ → AgCl↓; los demás son iones espectadores.' : ''}</p>}
        </div>
      )}
    </div>
  )
}

// ---------- 3. Descomposición: electrólisis del agua ----------
function Electrolisis({ grado }: { grado: number }) {
  const [agua, setAgua] = useState(false)
  const [sal, setSal] = useState(false)
  const [con, setCon] = useState(false)
  const [h, setH] = useState(0) // mL de gas en el tubo del polo negativo
  const [msg, setMsg] = useState<{ t: string; aviso?: boolean } | null>(null)
  const [pruebas, setPruebas] = useState<string[]>([])
  const corre = con && agua && sal && h < 20
  useEffect(() => {
    if (!corre) return
    const id = window.setTimeout(() => setH((x) => Math.min(20, +(x + 0.5).toFixed(1))), 1000)
    return () => window.clearTimeout(id)
  }, [corre, h])
  const o = h / 2
  const tubo = (x: number, gas: number, polo: string) => (
    <g>
      <path d={`M${x - 14} -110 V40 H${x + 14} V-110 A14 14 0 0 0 ${x - 14} -110`} fill={agua ? '#cfe6f5' : 'rgba(255,255,255,0.5)'} stroke="#2b2b2b" strokeWidth="2" />
      {gas > 0 && <path d={`M${x - 13} -110 A13 13 0 0 1 ${x + 13} -110 V${-110 + gas * 6} H${x - 13} Z`} fill="#fff" />}
      {[5, 10, 15, 20].map((v) => <line key={v} x1={x + 6} x2={x + 14} y1={-110 + v * 6} y2={-110 + v * 6} stroke="#555" />)}
      {corre && Array.from({ length: 4 }, (_, j) => <circle key={j} cx={x - 6 + j * 4} cy="30" r="2" fill="#fff" stroke="#9cc"><animate attributeName="cy" from="36" to={-104 + gas * 6} dur={`${0.8 + j * 0.2}s`} repeatCount="indefinite" /></circle>)}
      <rect x={x - 3} y="30" width="6" height="30" fill="#555" />
      <text x={x} y="78" textAnchor="middle" fontSize="12" fontWeight="800" fill={polo === '−' ? '#2e86c1' : '#c0392b'}>{polo}{grado >= 11 ? (polo === '−' ? ' cátodo' : ' ánodo') : ''}</text>
    </g>
  )
  const piezas: Pieza[] = [
    { id: 'agua', nombre: 'Agua', x: 80, y: 330, ancho: 60, alto: 70, tomable: true, color: '#cfe6f5', dibujo: <g><path d="M-22 -30 H22 V28 Q22 34 16 34 H-16 Q-22 34 -22 28 Z" fill="rgba(255,255,255,0.7)" stroke="#2b2b2b" strokeWidth="2" /><rect x="-20" y="-6" width="40" height="38" rx="4" fill="#a9d3f5" /></g> },
    { id: 'sal', nombre: 'Bicarbonato (electrolito)', x: 170, y: 335, ancho: 50, alto: 56, tomable: true, color: '#fafafa', dibujo: <g><rect x="-20" y="-24" width="40" height="50" rx="4" fill="#fff" stroke="#2b2b2b" strokeWidth="2" /><text y="4" textAnchor="middle" fontSize="7" fontWeight="800">BICARB.</text></g> },
    { id: 'fosforo', nombre: 'Fósforo encendido', x: 260, y: 352, ancho: 60, alto: 20, tomable: true, dibujo: <g><rect x="-24" y="-2" width="44" height="4" fill="#e7c88f" /><circle cx="22" r="4" fill="#c0392b" /><path d="M24 0 q8 -6 4 -14 q-2 6 -6 6 z" fill="#f39c12" /></g> },
    { id: 'astilla', nombre: 'Astilla con brasa (sin llama)', x: 340, y: 352, ancho: 70, alto: 20, tomable: true, dibujo: <g><rect x="-30" y="-2.5" width="56" height="5" fill="#c8a06a" /><circle cx="27" r="3.5" fill="#e74c3c"><animate attributeName="opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite" /></circle></g> },
    { id: 'aparato', nombre: agua ? (sal ? 'Aparato de electrólisis (listo)' : 'Aparato de electrólisis: falta el electrolito') : 'Aparato de electrólisis (sin agua)', x: 600, y: 300, ancho: 180, alto: 50, dibujo: <g><path d="M-80 -10 V50 H80 V-10" fill={agua ? '#cfe6f5' : 'rgba(255,255,255,0.4)'} stroke="#2b2b2b" strokeWidth="2.5" />{sal && <text y="40" textAnchor="middle" fontSize="9">+ bicarbonato</text>}</g> },
    { id: 'tH', nombre: `Tubo del polo − (${f(h)} mL)`, x: 560, y: 240, ancho: 34, alto: 150, dibujo: tubo(0, h, '−') },
    { id: 'tO', nombre: `Tubo del polo + (${f(o)} mL)`, x: 640, y: 240, ancho: 34, alto: 150, dibujo: tubo(0, o, '+') },
    { id: 'bateria', nombre: con ? 'Batería conectada (toca: desconectar)' : 'Batería de 9 V (toca: conectar)', x: 820, y: 330, ancho: 70, alto: 70, alTocar: () => { setCon((v) => !v); if (!con && agua && !sal) setMsg({ t: 'Conectada, pero no pasa casi nada: el agua pura conduce muy mal la electricidad. Échale un electrolito.', aviso: true }) },
      dibujo: <g><rect x="-26" y="-30" width="52" height="64" rx="5" fill="#2b2b2b" /><rect x="-26" y="-30" width="52" height="22" rx="5" fill="#e67e22" /><text y="10" textAnchor="middle" fontSize="12" fontWeight="800" fill="#fff">9 V</text>{con && <><path d="M-12 -30 C-60 -80 -180 -80 -220 -40" fill="none" stroke="#2e86c1" strokeWidth="2.5" /><path d="M12 -30 C-20 -90 -120 -90 -180 -40" fill="none" stroke="#c0392b" strokeWidth="2.5" /></>}</g> },
    { id: 'caneca', nombre: 'Residuos (toca: empezar de nuevo)', x: 950, y: 324, ancho: 54, alto: 76, alTocar: () => { setAgua(false); setSal(false); setCon(false); setH(0); setPruebas([]); setMsg(null) }, dibujo: <Caneca /> },
  ]
  const destinos = (de: string) => (de === 'agua' || de === 'sal' ? ['aparato'] : ['tH', 'tO'])
  const soltar = (de: string, en: string): Uso | string => {
    if (de === 'agua') return agua ? 'Ya tiene agua.' : { anim: 'verter', hecho: () => setAgua(true) }
    if (de === 'sal') return !agua ? 'Primero el agua.' : sal ? 'Ya tiene electrolito.' : { anim: 'polvo', hecho: () => { setSal(true); setMsg({ t: 'El bicarbonato se disuelve y deja iones que llevan la corriente. Conecta la batería.' }) } }
    const gas = en === 'tH' ? h : o
    if (gas < 2) return 'Todavía no hay gas suficiente para probar.'
    const t = de === 'fosforo'
      ? (en === 'tH' ? '¡Pop! El gas explota con un ruidito: es hidrógeno (H₂).' : 'La llama del fósforo se pone más viva: hay oxígeno.')
      : (en === 'tO' ? 'La brasa de la astilla se reaviva y prende en llama: es oxígeno (O₂).' : 'La brasa no se reaviva; el gas arde con un pop: es hidrógeno.')
    return { anim: 'poner', hecho: () => { setMsg({ t }); setPruebas((p) => [...new Set([...p, `${de}-${en}`])]) } }
  }
  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-2xl bg-[var(--tarjeta)] p-4 text-sm">En la <b>descomposición</b> un compuesto se rompe en sustancias más simples. La corriente eléctrica descompone el agua en dos gases. Llena el aparato con agua, échale el electrolito y conecta la batería. Mide cuánto gas sale en cada tubo y pruébalos con el fósforo y la astilla. El tiempo corre acelerado.</p>
      <MesaViva desde={90} piezas={piezas} destinos={destinos} soltar={soltar} />
      <Msg m={msg} />
      {h > 0 && <p className="text-sm">Polo −: <b>{f(h)} mL</b> · Polo +: <b>{f(o)} mL</b>{h >= 4 ? ` · relación ${f(h / o, 0)} : 1` : ''}</p>}
      {pruebas.length >= 2 && (
        <p className="rounded-lg bg-[#eaf5ee] p-2 text-sm"><b>Conclusión:</b> el agua se descompone en hidrógeno (en el polo −) y oxígeno (en el polo +), y siempre sale el doble de hidrógeno: el agua tiene dos átomos de hidrógeno por cada uno de oxígeno.
          {grado >= 9 && <><br />2 H₂O → 2 H₂ + O₂</>}
          {grado >= 11 && <><br />Cátodo (reducción): 4 H₂O + 4e⁻ → 2 H₂ + 4 OH⁻ · Ánodo (oxidación): 2 H₂O → O₂ + 4 H⁺ + 4e⁻</>}</p>
      )}
    </div>
  )
}

export default function TiposReaccion({ grado }: { grado: number }) {
  const [parte, setParte] = useState(0)
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {['1. Sustitución simple', '2. Doble sustitución (precipitados)', '3. Descomposición (electrólisis)'].map((t, k) => <button key={t} type="button" onClick={() => setParte(k)} className={BOTON(parte === k)}>{t}</button>)}
      </div>
      {parte === 0 ? <Sustitucion grado={grado} /> : parte === 1 ? <DobleSustitucion grado={grado} /> : <Electrolisis grado={grado} />}
      <p className="text-xs text-[var(--suave)]">Seguridad: el hidróxido de sodio y el nitrato de plata son corrosivos (guantes y gafas); los restos con cobre o plata van al frasco de residuos. Versión casera: clavo en vinagre con sal y un poco de sulfato de cobre de agropecuaria; electrólisis con una batería de 9 V, dos lápices sin madera y agua con bicarbonato. Colores aproximados.</p>
    </div>
  )
}
