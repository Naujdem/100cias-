import { useState } from 'react'
import MesaViva from '../MesaViva.tsx'
import type { Pieza, Uso } from '../MesaViva.tsx'
import { Caneca } from '../dibujos.tsx'

// Práctica extra 6 (PLAN-LABORATORIOS.md): antiácidos y soluciones amortiguadoras, Química área 4, desde 9°.
// Parte 1: «ácido estomacal» (HCl diluido, 100 mL = 10 mmol de H⁺) a cada vaso, gotas de repollo morado y dosis de
// antiácido (una clase por vaso); se cuentan las dosis hasta que el indicador pasa a morado (pH ≥ 6).
// Parte 2 (11°): gotas de HCl 1 M (0,05 mmol) a agua destilada y a un amortiguador de fosfatos pH 7,2 con
// indicador universal; Henderson-Hasselbalch. Valores escolares aproximados.

const f = (x: number, d = 1) => x.toLocaleString('es-CO', { minimumFractionDigits: d, maximumFractionDigits: d })
const REPOLLO: [number, string, string][] = [[2, '#d6204a', 'rojo'], [4, '#e04f8a', 'rosado'], [6, '#a8509c', 'morado rojizo'], [7.4, '#7a4fa0', 'morado'], [8.8, '#3f63c4', 'azul'], [10.5, '#2a9a8a', 'verde azulado'], [14, '#3fb54a', 'verde']]
const repollo = (pH: number) => REPOLLO.find(([m]) => pH <= m) ?? REPOLLO[REPOLLO.length - 1]
const UNIV = ['#d42a2a', '#e8502a', '#f0862c', '#f5b22e', '#f2d83a', '#c9d93a', '#8fca3c', '#4fb04a', '#2f9a7a', '#2a7fb0', '#2a5cb5', '#3a3fa8', '#5a2f9a', '#6a2580']
const univ = (pH: number) => UNIV[Math.max(0, Math.min(13, Math.round(pH) - 1))]

type Anti = 'magnesia' | 'bicarbonato' | 'calcio' | 'frutas' | 'agua'
const ANTI: Record<Anti, { n: string; mmol: number; tope: number; gas: boolean; c: string }> = {
  magnesia: { n: 'Leche de magnesia (1 mL)', mmol: 2.0, tope: 9.5, gas: false, c: '#f4f4f0' },
  bicarbonato: { n: 'Bicarbonato de sodio (½ cucharadita)', mmol: 1.2, tope: 8.3, gas: true, c: '#ffffff' },
  calcio: { n: 'Tableta de carbonato de calcio (¼)', mmol: 1.6, tope: 8.5, gas: true, c: '#f3ead6' },
  frutas: { n: 'Sal de frutas (½ sobre)', mmol: 0.6, tope: 6.2, gas: true, c: '#fff6d8' },
  agua: { n: 'Agua (10 mL, control)', mmol: 0, tope: 7, gas: false, c: '#a9d3f5' },
}
interface Vaso { acido: boolean; ind: boolean; anti: Anti | null; dosis: number; mL: number }
const vacio = (): Vaso => ({ acido: false, ind: false, anti: null, dosis: 0, mL: 0 })
const pHvaso = (v: Vaso) => {
  if (!v.acido) return 7
  const neto = 10 - (v.anti ? ANTI[v.anti].mmol * v.dosis : 0)
  if (neto > 0.001) return Math.max(1, -Math.log10(neto / v.mL))
  const tope = ANTI[v.anti!].tope
  return tope - (tope - 7) * Math.exp(-(-neto) * 1.5)
}

export default function Antiacidos({ grado }: { grado: number }) {
  const [parte, setParte] = useState<1 | 2>(1)
  return (
    <div className="flex flex-col gap-3">
      {grado >= 11 && (
        <div className="flex justify-center gap-2 text-sm">
          {([1, 2] as const).map((p) => <button key={p} type="button" onClick={() => setParte(p)} className={`min-h-10 rounded-full border px-4 ${parte === p ? 'border-[var(--acento)] font-semibold' : 'border-[var(--linea)]'}`}>{p === 1 ? '1. Antiácidos' : '2. Amortiguadores'}</button>)}
        </div>
      )}
      {parte === 1 ? <ParteAntiacidos grado={grado} /> : <ParteBuffer />}
    </div>
  )
}

function Frasco({ c, t }: { c: string; t: string }) {
  return <g><rect x="-18" y="-30" width="36" height="60" rx="6" fill={c} stroke="#2b2b2b" strokeWidth="2" /><rect x="-10" y="-40" width="20" height="10" fill="#555" /><text y="44" textAnchor="middle" fontSize="9" fontWeight="700">{t}</text></g>
}
function Gotero({ c, t }: { c: string; t: string }) {
  return <g><rect x="-10" y="-14" width="20" height="40" rx="4" fill={c} stroke="#2b2b2b" strokeWidth="2" /><path d="M-6 -14 v-14 h12 v14" fill="#333" /><text y="40" textAnchor="middle" fontSize="9" fontWeight="700">{t}</text></g>
}
function VasoDib({ mL, color, gas, n }: { mL: number; color: string | null; gas?: boolean; n: string }) {
  const h = Math.min(70, mL * 0.5)
  return (
    <g>
      <path d="M-30 -40 V40 Q-30 46 -24 46 H24 Q30 46 30 40 V-40" fill="rgba(255,255,255,0.6)" stroke="#2b2b2b" strokeWidth="2" />
      {mL > 0 && <rect x="-28" y={44 - h} width="56" height={h} fill={color ?? '#eef3f6'} style={{ transition: 'fill 0.8s' }} />}
      {gas && [-12, 0, 12].map((x, k) => <circle key={x} cx={x} r="2.5" fill="#fff"><animate attributeName="cy" values={`40;${44 - h}`} dur={`${0.8 + k * 0.3}s`} repeatCount="indefinite" /></circle>)}
      <text y="64" textAnchor="middle" fontSize="11" fontWeight="800">{n}</text>
    </g>
  )
}

function ParteAntiacidos({ grado }: { grado: number }) {
  const [vasos, setVasos] = useState<Vaso[]>(() => Array.from({ length: 5 }, vacio))
  const [gas, setGas] = useState<number | null>(null)
  const [msg, setMsg] = useState<{ t: string; aviso?: boolean } | null>(null)
  const [logro, setLogro] = useState<Partial<Record<Anti, number>>>({})
  const xs = [380, 490, 600, 710, 820]
  const antis = Object.keys(ANTI) as Anti[]
  const piezas: Pieza[] = [
    { id: 'acido', nombre: '«Ácido estomacal»: HCl diluido (100 mL por vaso)', x: 70, y: 260, ancho: 50, alto: 90, tomable: true, color: '#f1f6f8', dibujo: <Frasco c="#f1f6f8" t="HCl 0,1 M" /> },
    { id: 'ind', nombre: 'Gotero con indicador de repollo morado', x: 150, y: 260, ancho: 40, alto: 80, tomable: true, color: '#6a2c91', dibujo: <Gotero c="#6a2c91" t="Repollo" /> },
    ...antis.map((a, k) => ({ id: a, nombre: ANTI[a].n, x: [45, 115, 185, 255, 235][k], y: k < 4 ? 370 : 260, ancho: 60, alto: 70, tomable: true, color: ANTI[a].c,
      dibujo: <Frasco c={ANTI[a].c} t={{ magnesia: 'Magnesia', bicarbonato: 'Bicarbonato', calcio: 'CaCO₃', frutas: 'Sal de frutas', agua: 'Agua' }[a]} /> })),
    ...vasos.map((v, k) => {
      const pH = pHvaso(v)
      return {
        id: `v${k}`, nombre: `Vaso ${k + 1}${v.acido ? ` · ${v.mL} mL` : ' · vacío'}${v.anti ? ` · ${v.dosis} dosis de ${ANTI[v.anti].n.split(' (')[0].toLowerCase()}` : ''}${v.ind ? ` · ${repollo(pH)[2]}${grado >= 11 ? ` (pH ≈ ${f(pH)})` : ''}` : ''}`,
        x: xs[k], y: 330, ancho: 80, alto: 110,
        dibujo: <VasoDib mL={v.mL} color={v.ind ? repollo(pH)[1] : null} gas={gas === k} n={String(k + 1)} />,
      }
    }),
    { id: 'caneca', nombre: 'Vaciar los vasos (toca)', x: 940, y: 370, ancho: 50, alto: 70, alTocar: () => { setVasos(Array.from({ length: 5 }, vacio)); setLogro({}); setMsg({ t: 'Vasos vacíos.' }) }, dibujo: <g transform="scale(0.8)"><Caneca /></g> },
  ]
  const vids = vasos.map((_, k) => `v${k}`)
  const destinos = (de: string) => (de === 'acido' ? vids.filter((_, k) => !vasos[k].acido) : vids)
  const soltar = (de: string, en: string): Uso | string => {
    const k = Number(en.slice(1))
    const v = vasos[k]
    const set = (n: Vaso) => setVasos((vs) => vs.map((x, j) => (j === k ? n : x)))
    if (de === 'acido') return v.acido ? 'Ya tiene su ácido.' : { anim: 'verter', hecho: () => set({ ...v, acido: true, mL: 100 }) }
    if (de === 'ind') return !v.acido ? 'Primero el ácido.' : v.ind ? 'Ya tiene indicador.' : { anim: 'gotas', gotas: 4, hecho: () => { set({ ...v, ind: true }); setMsg({ t: `Vaso ${k + 1}: el repollo se pone ${repollo(pHvaso(v))[2]} en el ácido.` }) } }
    const a = de as Anti
    if (!v.acido || !v.ind) return 'Primero ácido e indicador en el vaso.'
    if (v.anti && v.anti !== a) return 'Un antiácido por vaso, para poder comparar.'
    return { anim: a === 'magnesia' || a === 'agua' ? 'verter' : 'polvo', hecho: () => {
      const n = { ...v, anti: a, dosis: v.dosis + 1, mL: v.mL + (a === 'agua' ? 10 : a === 'magnesia' ? 1 : 0) }
      set(n)
      const pH = pHvaso(n)
      if (ANTI[a].gas) { setGas(k); window.setTimeout(() => setGas(null), 2200) }
      if (pH >= 6 && !logro[a]) setLogro((l) => ({ ...l, [a]: n.dosis }))
      setMsg({ t: `${n.dosis} dosis: el indicador está ${repollo(pH)[2]}.${ANTI[a].gas && n.dosis === 1 ? ' ¡Burbujas! Es CO₂: por eso algunos antiácidos dan gases.' : ''}${a === 'agua' && n.dosis >= 3 ? ' El agua diluye, pero no neutraliza: casi no cambia el color.' : ''}${a === 'frutas' && n.dosis >= 6 && pH < 6 ? ' La sal de frutas también trae ácido cítrico: neutraliza poco por dosis.' : ''}` })
    } }
  }
  const tabla = (Object.keys(logro) as Anti[]).sort((a, b) => logro[a]! - logro[b]!)
  return (
    <>
      <p className="rounded-2xl border border-[var(--linea)] bg-[var(--tarjeta)] p-4 text-sm"><b>¿Qué antiácido neutraliza más?</b> El jugo del estómago es ácido clorhídrico. Pon «ácido estomacal» en cada vaso, unas gotas de repollo morado (se pone rojo) y agrega un antiácido distinto en cada vaso, dosis por dosis, hasta que el indicador pase a morado. El vaso con agua es el control.</p>
      <MesaViva desde={180} piezas={piezas} destinos={destinos} soltar={soltar} />
      {msg && <p className={`-mt-2 text-sm ${msg.aviso ? 'font-semibold text-[#b5462c]' : ''}`}>› {msg.t}</p>}
      {tabla.length > 0 && <p className="text-center text-sm"><b>Dosis hasta morado:</b> {tabla.map((a) => `${ANTI[a].n.split(' (')[0]}: ${logro[a]}`).join(' · ')}</p>}
      {tabla.length >= 3 && (
        <p className="rounded-lg bg-[#eaf5ee] p-2 text-sm"><b>¿Qué pasó?</b> Los antiácidos son bases (o sales básicas) que neutralizan el ácido clorhídrico: ácido + base → sal + agua. Los carbonatos y el bicarbonato además sueltan CO₂ (las burbujas y los «gases»). Cuantas menos dosis necesita, más neutraliza cada una; pero pasarse vuelve básico el estómago y el cuerpo responde fabricando más ácido.
          {' '}Mg(OH)₂ + 2HCl → MgCl₂ + 2H₂O · NaHCO₃ + HCl → NaCl + H₂O + CO₂ · CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂.{grado >= 11 ? ' Ve a la parte 2: ¿por qué la sangre no cambia de pH con lo que comemos?' : ''}
        </p>
      )}
      <p className="text-xs text-[var(--suave)]">Dosis y valores escolares aproximados. Los antiácidos son medicamentos: no se toman sin indicación.</p>
    </>
  )
}

function ParteBuffer() {
  const [g, setG] = useState<[number, number]>([0, 0]) // gotas de HCl en agua y en buffer
  const [ind, setInd] = useState<[boolean, boolean]>([false, false])
  const [msg, setMsg] = useState<string | null>(null)
  const H = 0.05
  const pHagua = (n: number) => (n ? -Math.log10((n * H) / (50 + n * 0.05)) : 7)
  const pHbuf = (n: number) => {
    const B = 0.5 - n * H
    const A = 0.5 + n * H
    if (B > 0.001) return 7.2 + Math.log10(B / A)
    return -Math.log10((-B + 0.001) / (50 + n * 0.05))
  }
  const pH = [pHagua(g[0]), pHbuf(g[1])]
  const piezas: Pieza[] = [
    { id: 'hcl', nombre: 'Gotero de HCl 1 M (1 gota)', x: 120, y: 290, ancho: 40, alto: 80, tomable: true, color: '#f1f6f8', dibujo: <Gotero c="#f1f6f8" t="HCl 1 M" /> },
    { id: 'univ', nombre: 'Indicador universal', x: 200, y: 290, ancho: 40, alto: 80, tomable: true, color: '#7fb04a', dibujo: <Gotero c="#8fca3c" t="Universal" /> },
    ...[0, 1].map((k) => ({ id: `b${k}`, nombre: `${k ? 'Amortiguador de fosfatos' : 'Agua destilada'} (50 mL) · ${g[k]} gotas de HCl${ind[k] ? ` · pH ≈ ${f(pH[k])}` : ''}`, x: 470 + k * 200, y: 330, ancho: 90, alto: 110,
      dibujo: <VasoDib mL={100} color={ind[k] ? univ(pH[k]) : null} n={k ? 'Amortiguador' : 'Agua'} /> })),
  ]
  const soltar = (de: string, en: string): Uso | string => {
    const k = Number(en.slice(1))
    if (de === 'univ') return ind[k] ? 'Ya tiene indicador.' : { anim: 'gotas', gotas: 3, hecho: () => setInd((i) => (k ? [i[0], true] : [true, i[1]])) }
    if (!ind[k]) return 'Primero el indicador, para ver el pH.'
    return { anim: 'gotas', gotas: 1, hecho: () => {
      const n: [number, number] = k ? [g[0], g[1] + 1] : [g[0] + 1, g[1]]
      setG(n)
      const nuevo = k ? pHbuf(n[1]) : pHagua(n[0])
      setMsg(`${k ? 'Amortiguador' : 'Agua'}: ${n[k]} gota${n[k] > 1 ? 's' : ''} → pH ${f(nuevo)}.${k && n[1] === 11 ? ' ¡Se agotó el amortiguador! Ya no le queda base que reciba el ácido.' : ''}`)
    } }
  }
  return (
    <>
      <p className="rounded-2xl border border-[var(--linea)] bg-[var(--tarjeta)] p-4 text-sm"><b>¿Qué resiste mejor el ácido?</b> Pon indicador universal en el agua y en el amortiguador (los dos empiezan cerca de pH 7) y agrega gotas de ácido clorhídrico 1 M a cada uno. Cuenta cuántas gotas aguanta cada uno antes de cambiar de color.</p>
      <MesaViva desde={180} piezas={piezas} destinos={(de) => (de === 'hcl' || de === 'univ' ? ['b0', 'b1'] : [])} soltar={soltar} />
      {msg && <p className="-mt-2 text-sm">› {msg}</p>}
      {g[0] >= 1 && g[1] >= 5 && (
        <p className="rounded-lg bg-[#eaf5ee] p-2 text-sm"><b>¿Qué pasó?</b> Una sola gota baja el agua a pH ≈ 3, pero el amortiguador casi no se mueve: tiene una base (HPO₄²⁻) que atrapa el H⁺ y lo convierte en su ácido débil (H₂PO₄⁻). Su pH sigue la ecuación de Henderson-Hasselbalch: pH = pKa + log([base]/[ácido]), con pKa ≈ 7,2. Cuando se acaba la base, el amortiguador «se agota» y el pH cae de golpe. La sangre usa el amortiguador de bicarbonato para quedarse en pH 7,35–7,45.</p>
      )}
    </>
  )
}
