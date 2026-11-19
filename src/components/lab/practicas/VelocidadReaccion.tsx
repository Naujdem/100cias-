import { useEffect, useState } from 'react'
import MesaViva from '../MesaViva.tsx'
import type { Pieza, Uso } from '../MesaViva.tsx'
import { Caneca } from '../dibujos.tsx'

// Laboratorio de Química 13 (PLAN-LABORATORIOS.md): velocidad de reacción con pastillas efervescentes, en mesa viva.
// Tres vasos que se llenan de a 50 mL con agua fría, al clima, caliente o vinagre (temperatura y acidez de la mezcla);
// pastilla entera al vaso o primero al mortero (tocarlo tritura) y el polvo al vaso; el tiempo corre de verdad y
// los tres vasos pueden ir a la vez; termómetro al vaso para medir; tocar el vaso cuando ya no burbujea anota el tiempo.
// Modelo: t = 40 s × 2^(−(T−20)/10) × (0,3 si triturada) ÷ (1 + 3 × fracción de vinagre). Tiempos aproximados.

const f = (x: number, d = 0) => x.toLocaleString('es-CO', { minimumFractionDigits: d, maximumFractionDigits: d })
const JARRAS = [
  { id: 'fria', n: 'Agua fría', T: 5, color: '#cfe8fb' },
  { id: 'clima', n: 'Agua al clima', T: 22, color: '#dcecf7' },
  { id: 'caliente', n: 'Agua caliente', T: 60, color: '#f4dede' },
  { id: 'vinagre', n: 'Vinagre', T: 22, color: '#f6f0dc' },
]
interface Vaso { vol: number; calor: number; vin: number; forma: 'entera' | 'polvo' | null; t0: number; T: number; tot: number; medido: boolean; anot: number | null }
const V0: Vaso = { vol: 0, calor: 0, vin: 0, forma: null, t0: 0, T: 0, tot: 0, medido: false, anot: null }
const LETRA = ['A', 'B', 'C']
interface Fila { letra: string; liquido: string; T: number; forma: string; t: number; nota?: string }

export default function VelocidadReaccion({ grado }: { grado: number }) {
  const [vasos, setVasos] = useState<Vaso[]>([V0, V0, V0])
  const [mortero, setMortero] = useState<'vacio' | 'pastilla' | 'polvo'>('vacio')
  const [ahora, setAhora] = useState(Date.now())
  const [filas, setFilas] = useState<Fila[]>([])
  const [msg, setMsg] = useState<{ t: string; aviso?: boolean } | null>(null)
  const corriendo = vasos.some((v) => v.forma && v.anot === null)
  useEffect(() => {
    if (!corriendo) return
    const id = window.setInterval(() => setAhora(Date.now()), 250)
    return () => window.clearInterval(id)
  }, [corriendo])
  const cambiar = (k: number, p: Partial<Vaso>) => setVasos((vs) => vs.map((v, j) => (j === k ? { ...v, ...p } : v)))
  const temp = (v: Vaso) => (v.vol ? v.calor / v.vol : 0)
  const seg = (v: Vaso) => (v.forma ? (ahora - v.t0) / 1000 : 0)
  const prog = (v: Vaso) => (v.forma ? Math.min(1, seg(v) / v.tot) : 0)
  const liquido = (v: Vaso) => (v.vin === 0 ? 'agua' : v.vin === v.vol ? 'vinagre' : `vinagre ${f((v.vin / v.vol) * 100)} %`)

  const anotar = (k: number) => {
    const v = vasos[k]
    if (!v.forma) return setMsg({ t: v.vol ? `Vaso ${LETRA[k]}: ${v.vol} mL de ${liquido(v)}. Echa una pastilla.` : `Vaso ${LETRA[k]} vacío: llénalo con una jarra.` })
    if (v.anot !== null) return setMsg({ t: `Vaso ${LETRA[k]} ya anotado. Bótalo en residuos para otro ensayo.` })
    const t = seg(v)
    const nota = t < v.tot * 0.95 ? 'anotado antes de terminar' : t > v.tot + 6 ? 'anotado tarde' : undefined
    cambiar(k, { anot: t })
    setFilas((fs) => [...fs, { letra: LETRA[k], liquido: liquido(v), T: v.T, forma: v.forma === 'polvo' ? 'triturada' : 'entera', t, nota: [nota, !v.medido && 'sin medir la temperatura'].filter(Boolean).join('; ') || undefined }])
    setMsg(nota ? { t: `Vaso ${LETRA[k]}: ${f(t)} s, pero ${nota === 'anotado tarde' ? 'las burbujas ya habían parado hace rato' : 'todavía burbujeaba'}. Mira bien cuándo para.`, aviso: true } : { t: `Vaso ${LETRA[k]}: la pastilla se disolvió en ${f(t)} s.` })
  }

  const piezas: Pieza[] = [
    ...JARRAS.map((j, k) => ({ id: j.id, nombre: `${j.n} (de a 50 mL)`, x: 70 + k * 85, y: 360, ancho: 60, alto: 80, tomable: true, color: j.color, dibujo: <g><path d="M-22 -30 H18 L24 -38 V-30 V32 Q24 38 18 38 H-22 Q-28 38 -28 32 V-30" fill={j.color} stroke="#2b2b2b" strokeWidth="2" /><path d="M24 -18 Q38 -10 24 14" fill="none" stroke="#2b2b2b" strokeWidth="3" /><text x="-2" y="8" textAnchor="middle" fontSize="8" fontWeight="700">{j.id === 'vinagre' ? 'Vinagre' : `${j.T} °C`}</text>{j.id === 'caliente' && [-12, 0, 12].map((x) => <path key={x} d={`M${x} -44 q4 -6 0 -12`} fill="none" stroke="#bbb" strokeWidth="2" />)}</g> })),
    { id: 'termo', nombre: 'Termómetro', x: 410, y: 400, ancho: 90, alto: 16, tomable: true, dibujo: <g><rect x="-40" y="-3" width="76" height="6" rx="3" fill="#fff" stroke="#2b2b2b" /><circle cx="40" cy="0" r="6" fill="#c0392b" /><rect x="-10" y="-1.5" width="48" height="3" fill="#c0392b" /></g> },
    ...vasos.map((v, k) => {
      const p = prog(v)
      const activo = v.forma && v.anot === null && p < 1
      const tasa = activo ? Math.min(1, 12 / v.tot) : 0
      const nivel = Math.min(70, v.vol * 0.7)
      const mez = v.vin / (v.vol || 1)
      return {
        id: `v${k}`, nombre: `Vaso ${LETRA[k]}${v.vol ? `: ${v.vol} mL de ${liquido(v)}` : ''}${v.forma && v.anot === null ? ' (toca cuando ya no burbujee)' : ''}`, x: 500 + k * 120, y: 330, ancho: 80, alto: 110, tomable: !(v.forma && v.anot === null), alTocar: () => anotar(k),
        dibujo: <g>
          <path d="M-34 -48 V40 Q-34 48 -26 48 H26 Q34 48 34 40 V-48" fill="rgba(255,255,255,0.6)" stroke="#2b2b2b" strokeWidth="2" />
          {v.vol > 0 && <rect x="-32" y={46 - nivel} width="64" height={nivel} fill={mez > 0 ? `rgba(240,225,180,${0.5 + 0.4 * mez})` : temp(v) > 40 ? '#f4dede' : temp(v) < 12 ? '#cfe8fb' : '#dcecf7'} />}
          {v.forma === 'entera' && p < 1 && <ellipse cx="0" cy="42" rx={22 * (1 - p) + 2} ry={5 * (1 - p) + 1} fill="#fafafa" stroke="#999" />}
          {v.forma === 'polvo' && p < 1 && <ellipse cx="0" cy="44" rx="26" ry="3" fill="#fafafa" opacity={1 - p} />}
          {activo && Array.from({ length: 3 + Math.round(tasa * 14) }, (_, b) => {
            const x = -26 + ((b * 37) % 52)
            return <circle key={b} cx={x} cy="40" r={1.5 + (b % 3)} fill="none" stroke="#fff" strokeWidth="1.2"><animate attributeName="cy" from="40" to={46 - nivel} dur={`${1.4 - tasa}s`} begin={`${(b * 0.13) % 1}s`} repeatCount="indefinite" /></circle>
          })}
          {activo && tasa > 0.3 && <ellipse cx="0" cy={46 - nivel} rx="30" ry={3 + tasa * 4} fill="#fff" opacity="0.8" />}
          <text y="66" textAnchor="middle" fontSize="12" fontWeight="700">{LETRA[k]}</text>
          {v.forma && <text y="-56" textAnchor="middle" fontSize="11" fontFamily="monospace">{f(v.anot ?? Math.min(seg(v), 999))} s</text>}
        </g>,
      }
    }),
    { id: 'pastilla', nombre: 'Pastillas efervescentes (toma una)', x: 820, y: 405, ancho: 60, alto: 20, tomable: true, color: '#fafafa', dibujo: <g><rect x="-26" y="-8" width="52" height="16" rx="3" fill="#e6eef5" stroke="#2b2b2b" /><circle cx="-10" cy="0" r="6" fill="#fafafa" stroke="#999" /><circle cx="8" cy="0" r="6" fill="#fafafa" stroke="#999" /></g> },
    { id: 'mortero', nombre: mortero === 'vacio' ? 'Mortero' : mortero === 'pastilla' ? 'Mortero con pastilla (toca: triturar)' : 'Mortero con pastilla en polvo', x: 900, y: 395, ancho: 60, alto: 40, tomable: mortero === 'polvo', color: '#fafafa', alTocar: mortero === 'pastilla' ? () => { setMortero('polvo'); setMsg({ t: 'Pastilla triturada: más superficie en contacto con el agua.' }) } : undefined, dibujo: <g><path d="M-26 -8 Q-26 18 0 18 Q26 18 26 -8 Z" fill="#d9d4cc" stroke="#2b2b2b" strokeWidth="2" />{mortero === 'pastilla' && <ellipse cx="0" cy="-6" rx="10" ry="3" fill="#fafafa" stroke="#999" />}{mortero === 'polvo' && <ellipse cx="0" cy="-6" rx="18" ry="3" fill="#fafafa" />}<path d="M10 -10 L26 -30" stroke="#8a7f70" strokeWidth="6" strokeLinecap="round" /></g> },
    { id: 'caneca', nombre: 'Residuos (bota un vaso para otro ensayo)', x: 965, y: 320, ancho: 50, alto: 76, dibujo: <g transform="scale(0.85)"><Caneca /></g> },
  ]

  const vasosIds = ['v0', 'v1', 'v2']
  const destinos = (de: string) => (de === 'pastilla' ? [...vasosIds, 'mortero'] : de.startsWith('v') ? ['caneca'] : vasosIds)
  const echarPastilla = (k: number, forma: 'entera' | 'polvo') => {
    const v = vasos[k]
    const T = temp(v)
    const tot = (40 * 2 ** (-(T - 20) / 10) * (forma === 'polvo' ? 0.3 : 1)) / (1 + 3 * (v.vin / v.vol))
    const ahora0 = Date.now()
    setAhora(ahora0)
    cambiar(k, { forma, t0: ahora0, T, tot })
    setMsg({ t: `Vaso ${LETRA[k]}: ¡a burbujear! El tiempo ya corre. Toca el vaso cuando paren las burbujas.` })
  }
  const soltar = (de: string, en: string): Uso | string => {
    const jarra = JARRAS.find((j) => j.id === de)
    if (de.startsWith('v')) return en === 'caneca' ? { anim: 'verter', hecho: () => cambiar(+de.slice(1), V0) } : 'El vaso se bota en residuos.'
    if (de === 'pastilla' && en === 'mortero') return mortero === 'vacio' ? { anim: 'poner', hecho: () => setMortero('pastilla') } : 'Ya hay una pastilla en el mortero.'
    const k = +en.slice(1)
    const v = vasos[k]
    if (jarra) {
      if (v.forma) return 'Ese vaso ya tiene la pastilla: bótalo para otro ensayo.'
      if (v.vol >= 100) return 'El vaso ya tiene 100 mL.'
      return { anim: 'verter', hecho: () => cambiar(k, { vol: v.vol + 50, calor: v.calor + 50 * jarra.T, vin: v.vin + (jarra.id === 'vinagre' ? 50 : 0), medido: false }) }
    }
    if (de === 'termo') return v.vol ? { anim: 'poner', hecho: () => { cambiar(k, { medido: true }); setMsg({ t: `Vaso ${LETRA[k]}: ${f(temp(v))} °C.` }) } } : 'El vaso está vacío.'
    if (de === 'pastilla' || de === 'mortero') {
      if (v.vol < 50) return 'Primero pon al menos 50 mL de líquido.'
      if (v.forma) return 'Ese vaso ya tiene una pastilla.'
      return { anim: de === 'pastilla' ? 'poner' : 'polvo', hecho: () => { echarPastilla(k, de === 'pastilla' ? 'entera' : 'polvo'); if (de === 'mortero') setMortero('vacio') } }
    }
    return 'No se puede.'
  }

  const graf = filas.filter((x) => x.forma === 'entera' && x.liquido === 'agua')
  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-2xl bg-[var(--tarjeta)] p-4 text-sm">Una pastilla efervescente reacciona en el agua y suelta gas (CO₂). ¿Qué la hace reaccionar <b>más rápido</b>? Llena los vasos con las jarras, echa la pastilla entera o triturada en el mortero y toca el vaso cuando paren las burbujas. Cambia <b>una sola cosa</b> a la vez: la temperatura, el tamaño de las partículas o la concentración de ácido (vinagre). Los tres vasos pueden ir al mismo tiempo.</p>
      <MesaViva desde={170} piezas={piezas} destinos={destinos} soltar={soltar} />
      {msg && <p className={`-mt-2 text-sm ${msg.aviso ? 'font-semibold text-[#b5462c]' : ''}`}>{msg.aviso ? '⚠ ' : '› '}{msg.t}</p>}
      {filas.length > 0 && (
        <div className="overflow-x-auto rounded-xl bg-[var(--tarjeta)] p-3 text-sm">
          <table className="w-full">
            <thead><tr className="text-left"><th className="p-1">Vaso</th><th className="p-1">Líquido</th><th className="p-1">T (°C)</th><th className="p-1">Pastilla</th><th className="p-1">Tiempo (s)</th>{grado >= 9 && <th className="p-1">Velocidad (1/t)</th>}</tr></thead>
            <tbody>{filas.map((x, k) => (
              <tr key={k} className="border-t border-[var(--linea)]">
                <td className="p-1">{x.letra}</td><td className="p-1">{x.liquido}</td><td className="p-1">{f(x.T)}</td><td className="p-1">{x.forma}</td>
                <td className="p-1">{f(x.t)}{x.nota && <span className="block text-xs text-[#b5462c]">⚠ {x.nota}</span>}</td>
                {grado >= 9 && <td className="p-1">{f(1 / x.t, 3)}</td>}
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
      {grado >= 9 && graf.length > 1 && (
        <svg viewBox="0 0 320 170" className="w-full max-w-md rounded-xl bg-white" role="img" aria-label="Tiempo según la temperatura">
          <path d="M30 10 V150 H310" fill="none" stroke="#2b2b2b" />
          <text x="170" y="166" fontSize="8" textAnchor="middle">Temperatura (°C) · pastilla entera en agua</text><text x="10" y="80" fontSize="8" transform="rotate(-90 10 80)">Tiempo (s)</text>
          {[0, 50, 100].map((t) => <text key={t} x="26" y={153 - t * 1.3} fontSize="8" textAnchor="end">{t}</text>)}
          {[0, 20, 40, 60].map((T) => <text key={T} x={30 + T * 4.5} y="160" fontSize="8" textAnchor="middle">{T}</text>)}
          {graf.map((x, k) => <circle key={k} cx={30 + x.T * 4.5} cy={150 - Math.min(110, x.t) * 1.3} r="3.5" fill="#2e86c1" />)}
        </svg>
      )}
      {filas.length >= 2 && <p className="rounded-lg bg-[#eaf5ee] p-2 text-sm"><b>Conclusión:</b> la reacción va más rápido con <b>más temperatura</b> (las partículas se mueven más y chocan más y con más fuerza), con la pastilla <b>triturada</b> (más superficie de contacto) y con <b>más concentración</b> de ácido (más partículas que pueden chocar). Es la <b>teoría de las colisiones</b>: solo reaccionan los choques con suficiente energía y bien orientados.{grado >= 9 ? ' La velocidad se puede comparar con 1/t: a menor tiempo, mayor velocidad.' : ''}{grado >= 11 ? ' Regla práctica: cada 10 °C más, la velocidad casi se duplica, porque muchas más moléculas superan la energía de activación (Eₐ). Un catalizador baja la Eₐ sin gastarse.' : ''}</p>}
      <p className="text-xs text-[var(--suave)]">Seguridad: el agua caliente la sirve un adulto. Versión casera: vasos de vidrio, pastillas efervescentes de farmacia, una cuchara para triturar y el cronómetro del celular. Tiempos aproximados: dependen de la marca.</p>
    </div>
  )
}
