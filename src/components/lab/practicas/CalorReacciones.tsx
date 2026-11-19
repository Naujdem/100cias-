import { useEffect, useState } from 'react'
import MesaViva from '../MesaViva.tsx'
import type { Pieza, Uso } from '../MesaViva.tsx'
import { Caneca } from '../dibujos.tsx'

// Práctica extra 9 (PLAN-LABORATORIOS.md): reacciones que calientan o enfrían, Química área 3, desde 6°.
// Vasos de icopor (calorímetro casero): 50 mL de agua o vinagre, un termómetro que se mueve de vaso en vaso, sustancias
// de a 5 g y varilla. Se disuelven con el tiempo (más rápido si se revuelve); 1 s = 10 s. ΔT por cada 5 g en 50 mL,
// calculado con entalpías de disolución aproximadas. Se pierde un poco de calor hacia el ambiente.
// La tabla anota T inicial (si el termómetro estaba antes) y la temperatura extrema. En 11°: q y ΔH por mol.

const f = (x: number, d = 1) => x.toLocaleString('es-CO', { minimumFractionDigits: d, maximumFractionDigits: d })
const AMB = 22

type Sus = 'cacl2' | 'urea' | 'nh4no3' | 'sal' | 'cao' | 'bicarb'
const SUS: Record<Sus, { n: string; corto: string; dT: number; dTvin?: number; M: number; uso: string; desde: number; c: string }> = {
  cacl2: { n: 'Cloruro de calcio', corto: 'CaCl₂', dT: 17, M: 111, uso: 'compresas calientes y para secar humedad', desde: 6, c: '#ffffff' },
  urea: { n: 'Urea (abono)', corto: 'Urea', dT: -6, M: 60, uso: 'abono de los cultivos y algunas compresas frías', desde: 6, c: '#f7f7f2' },
  nh4no3: { n: 'Nitrato de amonio', corto: 'NH₄NO₃', dT: -7.5, M: 80, uso: 'compresas frías instantáneas', desde: 9, c: '#fbfbfb' },
  sal: { n: 'Sal de cocina', corto: 'NaCl', dT: -1.5, M: 58.5, uso: 'cocina', desde: 6, c: '#ffffff' },
  cao: { n: 'Cal viva (óxido de calcio)', corto: 'CaO', dT: 26, M: 56, uso: 'construcción y para calentar comida enlatada', desde: 6, c: '#efeee6' },
  bicarb: { n: 'Bicarbonato de sodio', corto: 'NaHCO₃', dT: -4.5, dTvin: -6, M: 84, uso: 'cocina y antiácido', desde: 6, c: '#ffffff' },
}
interface Vaso { liq: 'agua' | 'vinagre' | null; adds: Sus[]; pend: number; T: number; Ti: number | null; ext: number | null; gas: boolean }
const nuevo = (): Vaso => ({ liq: null, adds: [], pend: 0, T: AMB, Ti: null, ext: null, gas: false })

export default function CalorReacciones({ grado }: { grado: number }) {
  const [vasos, setVasos] = useState<Vaso[]>(() => Array.from({ length: 4 }, nuevo))
  const [termo, setTermo] = useState<number | null>(null)
  const [agit, setAgit] = useState<number[]>([0, 0, 0, 0])
  const [msg, setMsg] = useState<{ t: string; aviso?: boolean } | null>(null)

  const activo = vasos.some((v) => v.pend > 0.001 || Math.abs(v.T - AMB) > 0.3)
  useEffect(() => {
    if (!activo) return
    const id = window.setTimeout(() => {
      setVasos((vs) => vs.map((v, k) => {
        if (!v.liq) return v
        const d = Math.min(v.pend, v.adds.length ? (agit[k] > 0 ? 0.35 : 0.08) : 0)
        const rate = v.adds.length ? v.adds.reduce((a, s) => a + (v.liq === 'vinagre' && SUS[s].dTvin ? SUS[s].dTvin! : SUS[s].dT), 0) / v.adds.length : 0
        const T = v.T + rate * d + (AMB - v.T) * 0.015
        const nv = { ...v, pend: v.pend - d, T, gas: v.liq === 'vinagre' && v.adds.includes('bicarb') && v.pend - d > 0.02 }
        if (termo === k && v.adds.length) nv.ext = v.ext === null ? T : Math.abs(T - AMB) > Math.abs(v.ext - AMB) ? T : v.ext
        return nv
      }))
      setAgit((a) => a.map((x) => Math.max(0, x - 1)))
    }, 1000)
    return () => window.clearTimeout(id)
  })

  const xs = [420, 540, 660, 780]
  const sus = (Object.keys(SUS) as Sus[]).filter((s) => grado >= SUS[s].desde)
  const color = (T: number) => (T > AMB + 3 ? `rgba(220,80,40,${Math.min(0.5, (T - AMB) / 40)})` : T < AMB - 2 ? `rgba(60,120,220,${Math.min(0.5, (AMB - T) / 15)})` : 'transparent')
  const piezas: Pieza[] = [
    { id: 'agua', nombre: 'Jarra de agua (50 mL, a 22 °C)', x: 60, y: 250, ancho: 50, alto: 80, tomable: true, color: '#a9d3f5', dibujo: <g><path d="M-18 -26 h32 l6 8 v44 h-38 z" fill="#a9d3f5" stroke="#2b2b2b" strokeWidth="2" /><text y="40" textAnchor="middle" fontSize="9" fontWeight="700">Agua</text></g> },
    { id: 'vinagre', nombre: 'Vinagre (50 mL)', x: 125, y: 250, ancho: 50, alto: 80, tomable: true, color: '#efe7c4', dibujo: <g><path d="M-18 -26 h32 l6 8 v44 h-38 z" fill="#efe7c4" stroke="#2b2b2b" strokeWidth="2" /><text y="40" textAnchor="middle" fontSize="9" fontWeight="700">Vinagre</text></g> },
    ...sus.map((s, k) => ({ id: s, nombre: `${SUS[s].n} (de a 5 g)`, x: 45 + (k % 4) * 65, y: k < 4 ? 365 : 250, ancho: 50, alto: 70, tomable: true, color: SUS[s].c,
      dibujo: <g><rect x="-17" y="-24" width="34" height="48" rx="5" fill={SUS[s].c} stroke="#2b2b2b" strokeWidth="2" /><rect x="-17" y="-30" width="34" height="8" fill="#888" /><text y="38" textAnchor="middle" fontSize="9" fontWeight="700">{SUS[s].corto}</text></g> })).map((p, k) => (k >= 4 ? { ...p, x: 190 + (k - 4) * 65 } : p)),
    { id: 'termo', nombre: termo === null ? 'Termómetro' : `Termómetro (en el vaso ${termo + 1}; llévalo a otro vaso)`, x: 330, y: 300, ancho: 30, alto: 120, tomable: true,
      dibujo: <g opacity={termo === null ? 1 : 0.25}><rect x="-4" y="-50" width="8" height="96" rx="4" fill="#fff" stroke="#2b2b2b" /><circle cy="48" r="7" fill="#c0392b" /></g> },
    { id: 'varilla', nombre: 'Varilla (revolver)', x: 330, y: 410, ancho: 90, alto: 16, tomable: true, dibujo: <rect x="-42" y="-3" width="84" height="6" rx="3" fill="#dfe9ef" stroke="#2b2b2b" /> },
    ...vasos.map((v, k) => ({
      id: `v${k}`, nombre: `Vaso ${k + 1}${v.liq ? ` · ${v.liq}${v.adds.length ? ` + ${v.adds.length * 5} g de ${[...new Set(v.adds)].map((s) => SUS[s].corto).join(' y ')}` : ''}` : ' · vacío'}${termo === k ? ` · ${f(v.T)} °C` : ''}`,
      x: xs[k], y: 330, ancho: 90, alto: 110,
      dibujo: <g>
        <circle cy="0" r="44" fill={color(v.T)} />
        <path d="M-34 -40 L-26 44 H26 L34 -40 Z" fill="#fbfbf8" stroke="#2b2b2b" strokeWidth="2" />
        {v.liq && <path d="M-31 -10 L-27 40 H27 L31 -10 Z" fill={v.liq === 'agua' ? '#a9d3f5' : '#efe7c4'} opacity="0.8" />}
        {v.pend > 0.02 && <ellipse cx="0" cy="38" rx={6 + v.pend * 18} ry="3" fill="#fff" stroke="#bbb" />}
        {v.gas && [-10, 8].map((x) => <circle key={x} cx={x} r="2.5" fill="#fff"><animate attributeName="cy" values="36;-8" dur="1s" repeatCount="indefinite" /></circle>)}
        {termo === k && <g><rect x="18" y="-80" width="7" height="110" rx="3" fill="#fff" stroke="#2b2b2b" /><rect x="19.5" y={20 - Math.max(0, Math.min(60, v.T)) * 1.4} width="4" height={Math.max(0, Math.min(60, v.T)) * 1.4 + 10} fill="#c0392b" /><text x="22" y="-86" textAnchor="middle" fontSize="11" fontFamily="monospace">{f(v.T)}</text></g>}
        <text y="64" textAnchor="middle" fontSize="11" fontWeight="800">{k + 1}</text>
      </g>,
    })),
    { id: 'caneca', nombre: 'Vaciar los vasos (toca)', x: 935, y: 370, ancho: 50, alto: 70, alTocar: () => { setVasos(Array.from({ length: 4 }, nuevo)); setTermo(null); setMsg({ t: 'Vasos vacíos. Las soluciones van al desagüe con bastante agua; la cal, a la caneca.' }) }, dibujo: <g transform="scale(0.8)"><Caneca /></g> },
  ]
  const vids = vasos.map((_, k) => `v${k}`)
  const destinos = () => vids
  const soltar = (de: string, en: string): Uso | string => {
    const k = Number(en.slice(1))
    const v = vasos[k]
    const set = (n: Partial<Vaso>) => setVasos((vs) => vs.map((x, j) => (j === k ? { ...x, ...n } : x)))
    if (de === 'agua' || de === 'vinagre') return v.liq ? 'Ese vaso ya tiene líquido.' : { anim: 'verter', hecho: () => set({ liq: de, T: AMB }) }
    if (de === 'termo') return { anim: 'poner', hecho: () => {
      setTermo(k)
      if (v.liq && !v.adds.length) set({ Ti: v.T })
      setMsg(v.adds.length ? { t: `Llegaste tarde al vaso ${k + 1}: ya no puedes saber su temperatura inicial. Mídela siempre antes de echar la sustancia.`, aviso: true } : { t: `Temperatura inicial del vaso ${k + 1}: ${f(v.T)} °C.` })
    } }
    if (de === 'varilla') return !v.liq ? 'El vaso está vacío.' : { anim: 'frotar', hecho: () => setAgit((a) => a.map((x, j) => (j === k ? 3 : x))) }
    const s = de as Sus
    if (!v.liq) return 'Primero el líquido.'
    if (v.adds.length && v.adds[0] !== s) return 'Una sustancia por vaso, para saber cuál causó el cambio.'
    if (v.adds.length >= 3) return 'Con 15 g basta.'
    return { anim: 'polvo', hecho: () => {
      set({ adds: [...v.adds, s], pend: v.pend + 1 })
      if (s === 'cao') setMsg({ t: 'La cal viva reacciona con el agua: CaO + H₂O → Ca(OH)₂. ¡Se calienta mucho! En la vida real, guantes y gafas.', aviso: true })
      else if (termo !== k) setMsg({ t: 'Sin termómetro en este vaso no podrás medir el cambio.', aviso: true })
      else setMsg({ t: `${SUS[s].n} al vaso ${k + 1}. Revuelve y mira el termómetro.` })
    } }
  }

  const filas = vasos.map((v, k) => ({ v, k })).filter(({ v }) => v.adds.length && v.ext !== null)
  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-2xl border border-[var(--linea)] bg-[var(--tarjeta)] p-4 text-sm"><b>¿Calienta o enfría?</b> En cada vaso de icopor pon agua (o vinagre), lleva el termómetro y anota la temperatura inicial, echa una sustancia, revuelve y mira cuánto sube o baja. Mueve el termómetro de vaso en vaso.</p>
      <MesaViva desde={180} piezas={piezas} destinos={destinos} soltar={soltar} />
      {msg && <p className={`-mt-2 text-sm ${msg.aviso ? 'font-semibold text-[#b5462c]' : ''}`}>{msg.aviso ? '⚠ ' : '› '}{msg.t}</p>}
      <p className="-mt-2 text-xs text-[var(--suave)]">Tiempo acelerado: 1 s = 10 s. Los cambios de temperatura son aproximados.</p>
      {filas.length > 0 && (
        <table className="mx-auto text-sm">
          <thead><tr className="text-left"><th className="px-2">Vaso</th><th className="px-2">Sustancia</th><th className="px-2">T inicial</th><th className="px-2">T extrema</th><th className="px-2">ΔT</th><th className="px-2">¿Qué es?</th>{grado >= 11 && <th className="px-2">ΔH (kJ/mol)</th>}</tr></thead>
          <tbody>{filas.map(({ v, k }) => {
            const dT = v.Ti !== null ? v.ext! - v.Ti : null
            const s = v.adds[0]
            const n = (v.adds.length * 5) / SUS[s].M
            return <tr key={k}><td className="px-2">{k + 1}</td><td className="px-2">{v.adds.length * 5} g {SUS[s].corto}{v.liq === 'vinagre' ? ' + vinagre' : ''}</td><td className="px-2">{v.Ti !== null ? `${f(v.Ti)} °C` : '¿?'}</td><td className="px-2">{f(v.ext!)} °C</td><td className="px-2">{dT !== null ? `${dT > 0 ? '+' : ''}${f(dT)}` : '—'}</td>
              <td className="px-2">{dT === null ? '—' : Math.abs(dT) < 2 ? 'casi nada' : dT > 0 ? '🔥 exotérmica' : '❄️ endotérmica'}</td>{grado >= 11 && <td className="px-2">{dT !== null ? f((-(50 * 4.18 * dT) / 1000) / n) : '—'}</td>}</tr>
          })}</tbody>
        </table>
      )}
      {filas.length >= 3 && (
        <p className="rounded-lg bg-[var(--tarjeta)] p-2 text-sm"><b>¿Qué pasó?</b> Algunas sustancias <b>liberan</b> energía al disolverse o reaccionar y el agua se calienta: son <b>exotérmicas</b> (cloruro de calcio, cal viva). Otras <b>absorben</b> energía del agua y la enfrían: son <b>endotérmicas</b> (urea, bicarbonato{grado >= 9 ? ', nitrato de amonio' : ''}). Así funcionan las compresas instantáneas: al romper la bolsita interna, el sólido se disuelve en el agua y la compresa se calienta o se enfría.
          {grado >= 9 ? ' Al disolverse, romper el sólido cuesta energía y rodear las partículas con agua la libera; según cuál gane, el proceso calienta o enfría.' : ''}
          {grado >= 11 ? ' Con el calorímetro: q = m·c·ΔT (50 g × 4,18 J/g·°C × ΔT) y ΔH = −q ÷ n. El icopor pierde algo de calor, por eso el valor medido sale un poco menor que el de tabla.' : ''}
        </p>
      )}
    </div>
  )
}
