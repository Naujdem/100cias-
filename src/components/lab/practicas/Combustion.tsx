import { useEffect, useState } from 'react'
import MesaViva from '../MesaViva.tsx'
import type { Pieza, Uso } from '../MesaViva.tsx'

// Laboratorio de Química 15 (PLAN-LABORATORIOS.md): combustión completa e incompleta, en mesa viva.
// Mechero: llave de gas que se toca (si se deja abierta sin encender, se acumula gas: aviso), fósforo al mechero,
// anillo de aire que se toca (cerrado → llama amarilla, abierto → azul). Sobre la llama: cápsula de porcelana (hollín),
// vaso frío (gotitas de agua) y vaso con agua de cal (se enturbia con el CO₂). Vela con fósforo y dos frascos que la
// tapan: se apaga en tiempo real (pequeño ≈ 5 s, grande ≈ 12 s). Se anotan las observaciones y se clasifica cada llama.

type Aire = 0 | 1 | 2
const AIRE = ['cerrado', 'a medias', 'abierto']
interface Obs { hollin: boolean | null; agua: boolean | null; cal: boolean | null }
const OBS0: Obs = { hollin: null, agua: null, cal: null }

export default function Combustion({ grado }: { grado: number }) {
  const [gas, setGas] = useState(false)
  const [gasSeg, setGasSeg] = useState(0)
  const [llama, setLlama] = useState(false)
  const [aire, setAire] = useState<Aire>(0)
  const [hollin, setHollin] = useState(0)
  const [gotas, setGotas] = useState(0)
  const [turbio, setTurbio] = useState(false)
  const [obs, setObs] = useState<Record<'amarilla' | 'azul', Obs>>({ amarilla: { ...OBS0 }, azul: { ...OBS0 } })
  const [vela, setVela] = useState(false)
  const [frasco, setFrasco] = useState<{ cual: 'p' | 'g'; t0: number } | null>(null)
  const [tiempos, setTiempos] = useState<{ p?: number; g?: number }>({})
  const [ahora, setAhora] = useState(Date.now())
  const [clase, setClase] = useState<Record<string, string>>({})
  const [msg, setMsg] = useState<{ t: string; aviso?: boolean } | null>(null)

  const tipo: 'amarilla' | 'azul' | null = !llama ? null : aire === 2 ? 'azul' : aire === 0 ? 'amarilla' : null
  // gas sin encender, gotas que se secan, vela tapada que se apaga: todo en tiempo real
  useEffect(() => {
    if (!(gas && !llama) && gotas <= 0 && !frasco) return
    const id = window.setTimeout(() => {
      setAhora(Date.now())
      if (gas && !llama) setGasSeg((s) => s + 1)
      if (gotas > 0) setGotas((g) => Math.max(0, g - 0.2))
      if (frasco && vela) {
        const dur = frasco.cual === 'p' ? 5 : 12
        const s = (Date.now() - frasco.t0) / 1000
        if (s >= dur) { setVela(false); setTiempos((t) => ({ ...t, [frasco.cual]: s })); setMsg({ t: `La vela se apagó a los ${s.toFixed(0)} s: se acabó el oxígeno del frasco ${frasco.cual === 'p' ? 'pequeño' : 'grande'}.` }) }
      }
    }, 1000)
    return () => window.clearTimeout(id)
  })
  useEffect(() => { if (gasSeg === 4) setMsg({ t: 'Llevas varios segundos con el gas abierto y sin llama: se está acumulando gas. ¡Peligro! Enciende primero el fósforo o cierra la llave.', aviso: true }) }, [gasSeg])

  const anotar = (campo: keyof Obs, valor: boolean) => { if (tipo) setObs((o) => ({ ...o, [tipo]: { ...o[tipo], [campo]: valor } })) }
  const sobreLlama = () => {
    if (!llama) return 'El mechero está apagado.'
    if (!tipo) return 'Con el aire a medias la llama es intermedia: para comparar, usa el aire cerrado o abierto.'
    return null
  }
  const colorLlama = aire === 0 ? '#f5b62e' : aire === 1 ? '#f0c060' : '#4a8fe8'
  const vSeg = frasco && vela ? (ahora - frasco.t0) / 1000 : 0
  const piezas: Pieza[] = [
    {
      id: 'mechero', nombre: llama ? `Mechero encendido · llama ${tipo ?? 'intermedia'}` : gas ? 'Mechero: sale gas sin encender' : 'Mechero Bunsen', x: 300, y: 330, ancho: 60, alto: 120,
      dibujo: <g>
        <rect x="-26" y="40" width="52" height="10" rx="3" fill="#555" /><rect x="-7" y="-40" width="14" height="82" fill="#8a8f94" stroke="#2b2b2b" />
        {llama && (aire === 2
          ? <g><path d="M-9 -40 Q-12 -80 0 -110 Q12 -80 9 -40 Z" fill="#9fc3f5" opacity="0.7" /><path d="M-5 -40 Q-6 -58 0 -70 Q6 -58 5 -40 Z" fill="#2f6fd6" /></g>
          : <path d="M-11 -40 Q-18 -95 0 -135 Q18 -95 11 -40 Z" fill={colorLlama} opacity="0.9"><animate attributeName="d" values="M-11 -40 Q-18 -95 0 -135 Q18 -95 11 -40 Z;M-11 -40 Q-14 -95 4 -130 Q20 -95 11 -40 Z;M-11 -40 Q-18 -95 0 -135 Q18 -95 11 -40 Z" dur="0.8s" repeatCount="indefinite" /></path>)}
        {gas && !llama && [0, 1, 2].map((k) => <circle key={k} cx={-6 + k * 6} cy={-48 - k * 8} r={3 + k} fill="#cfd8dc" opacity="0.5" />)}
      </g>,
    },
    { id: 'aire', nombre: `Anillo de aire: ${AIRE[aire]} (toca: girarlo)`, x: 300, y: 350, ancho: 40, alto: 18, alTocar: () => { setAire((a) => ((a + 1) % 3) as Aire); if (llama) setMsg({ t: aire === 1 ? 'Aire abierto: llama azul, casi invisible, que no humea. Combustión completa.' : aire === 2 ? 'Aire cerrado: llama amarilla, luminosa, que humea. Combustión incompleta.' : 'Aire a medias: llama intermedia.' }) }, dibujo: <g><rect x="-11" y="-6" width="22" height="12" fill="#6d7378" stroke="#2b2b2b" /><rect x="-4" y="-3" width={2 + aire * 3} height="6" fill="#111" /></g> },
    { id: 'llave', nombre: gas ? 'Llave de gas abierta (toca: cerrar)' : 'Llave de gas (toca: abrir)', x: 200, y: 380, ancho: 50, alto: 26, alTocar: () => { if (gas) { setGas(false); setLlama(false); setGasSeg(0); setMsg({ t: 'Gas cerrado: el mechero se apaga.' }) } else { setGas(true); setGasSeg(0) } }, dibujo: <g><path d="M30 0 H80" stroke="#c0392b" strokeWidth="5" /><rect x="-16" y="-8" width="32" height="16" rx="3" fill="#888" stroke="#2b2b2b" /><rect x="-3" y="-16" width="6" height="14" fill={gas ? '#27ae60' : '#c0392b'} transform={gas ? 'rotate(90 0 -8)' : undefined} /></g> },
    { id: 'fosforo', nombre: 'Fósforos', x: 110, y: 395, ancho: 50, alto: 24, tomable: true, color: '#f39c12', dibujo: <g><rect x="-20" y="-9" width="40" height="18" rx="2" fill="#c0392b" stroke="#2b2b2b" /><rect x="-14" y="-5" width="28" height="10" fill="#f6e2b3" /></g> },
    { id: 'capsula', nombre: hollin > 0.5 ? 'Cápsula de porcelana con hollín' : 'Cápsula de porcelana (sostenla sobre la llama)', x: 450, y: 395, ancho: 60, alto: 24, tomable: true, dibujo: <g><path d="M-26 -6 Q0 18 26 -6 Z" fill="#fafafa" stroke="#2b2b2b" strokeWidth="1.5" /><ellipse cx="0" cy="2" rx={Math.min(18, hollin * 4)} ry={Math.min(5, hollin * 1.2)} fill="#222" opacity={Math.min(0.9, hollin / 3)} /></g> },
    { id: 'vfrio', nombre: 'Vaso frío y seco (bocabajo sobre la llama)', x: 530, y: 380, ancho: 50, alto: 60, tomable: true, dibujo: <g><path d="M-18 24 V-24 H18 V24" fill="rgba(220,236,247,0.7)" stroke="#2b2b2b" strokeWidth="2" transform="rotate(180)" />{gotas > 0 && [-10, -2, 6, 12, -6, 2].map((x, k) => <circle key={k} cx={x} cy={-14 + (k % 3) * 8} r="1.8" fill="#7fb3d5" opacity={Math.min(1, gotas)} />)}</g> },
    { id: 'vcal', nombre: turbio ? 'Vaso con agua de cal: turbio' : 'Vaso mojado con agua de cal (bocabajo sobre la llama)', x: 610, y: 380, ancho: 50, alto: 60, tomable: true, dibujo: <g><path d="M-18 -24 V24 H18 V-24" fill={turbio ? 'rgba(240,240,240,0.95)' : 'rgba(230,245,250,0.7)'} stroke="#2b2b2b" strokeWidth="2" /><text y="4" textAnchor="middle" fontSize="7">cal</text></g> },
    {
      id: 'vela', nombre: vela ? (frasco ? `Vela tapada · ${vSeg.toFixed(0)} s (toca: destapar)` : 'Vela encendida') : 'Vela', x: 790, y: 355, ancho: 70, alto: 110, alTocar: frasco ? () => { setFrasco(null); setMsg({ t: 'Frasco fuera.' }) } : undefined,
      dibujo: <g>
        <rect x="-9" y="-10" width="18" height="60" rx="2" fill="#fbf3e4" stroke="#2b2b2b" /><path d="M0 -10 V-18" stroke="#333" strokeWidth="1.5" />
        {vela && <path d="M-5 -18 Q-6 -34 0 -44 Q6 -34 5 -18 Z" fill="#f5b62e" opacity={frasco ? Math.max(0.25, 1 - vSeg / (frasco.cual === 'p' ? 5 : 12)) : 1} />}
        {frasco && <path d={frasco.cual === 'p' ? 'M-24 52 V-40 Q-24 -52 0 -52 Q24 -52 24 -40 V52' : 'M-34 52 V-60 Q-34 -76 0 -76 Q34 -76 34 -60 V52'} fill="rgba(220,236,247,0.35)" stroke="#2b2b2b" strokeWidth="2" />}
      </g>,
    },
    ...(['p', 'g'] as const).filter((c) => c === 'p' || grado >= 9).map((c) => ({ id: `frasco-${c}`, nombre: `Frasco ${c === 'p' ? 'pequeño' : 'grande'} (tapa la vela)`, x: c === 'p' ? 890 : 955, y: 380, ancho: 50, alto: 70, tomable: !frasco, dibujo: <path d={c === 'p' ? 'M-16 26 V-20 Q-16 -28 0 -28 Q16 -28 16 -20 V26' : 'M-22 30 V-30 Q-22 -40 0 -40 Q22 -40 22 -30 V30'} fill="rgba(220,236,247,0.5)" stroke="#2b2b2b" strokeWidth="2" /> })),
  ]

  const destinos = (de: string) => (de === 'fosforo' ? ['mechero', 'vela'] : de.startsWith('frasco') ? ['vela'] : ['mechero'])
  const soltar = (de: string, en: string): Uso | string => {
    if (de === 'fosforo') {
      if (en === 'vela') return vela ? 'La vela ya está encendida.' : frasco ? 'Quita primero el frasco.' : { anim: 'poner', hecho: () => { setVela(true); setMsg({ t: 'Vela encendida.' }) } }
      if (!gas) return { anim: 'poner', hecho: () => setMsg({ t: 'El fósforo arde sobre el mechero, pero no sale gas: abre la llave.', aviso: true }) }
      if (llama) return 'El mechero ya está encendido.'
      return { anim: 'poner', hecho: () => {
        setLlama(true)
        setMsg(gasSeg >= 4 ? { t: '¡Fuuum! Se encendió con una llamarada por el gas acumulado. Primero se acerca el fósforo y luego se abre la llave.', aviso: true } : { t: aire === 0 ? 'Encendido con el aire cerrado: llama amarilla. Gira el anillo para ver el cambio.' : 'Mechero encendido.' })
        setGasSeg(0)
      } }
    }
    if (de.startsWith('frasco')) {
      if (!vela) return 'Enciende la vela primero.'
      return { anim: 'poner', hecho: () => { setFrasco({ cual: de.endsWith('p') ? 'p' : 'g', t0: Date.now() }); setAhora(Date.now()); setMsg({ t: 'Vela tapada: el tiempo corre.' }) } }
    }
    const no = sobreLlama()
    if (no) return no
    if (de === 'capsula') return { anim: 'poner', hecho: () => { const h = tipo === 'amarilla'; if (h) setHollin((x) => x + 1); anotar('hollin', h); setMsg({ t: h ? 'La cápsula sale con una mancha negra de hollín (carbono sin quemar).' : 'La cápsula sale limpia: no hay hollín.' }) } }
    if (de === 'vfrio') return { anim: 'poner', hecho: () => { setGotas(1.5); anotar('agua', true); setMsg({ t: 'El vaso se empaña con gotitas: la combustión produce vapor de agua.' }) } }
    if (de === 'vcal') return { anim: 'poner', hecho: () => { setTurbio(true); anotar('cal', true); setMsg({ t: 'El agua de cal se pone blanca y turbia: hay dióxido de carbono (CO₂).' }) } }
    return 'No se puede.'
  }

  const sn = (v: boolean | null) => (v === null ? '—' : v ? 'sí' : 'no')
  const CORR: Record<string, string> = { amarilla: 'incompleta', azul: 'completa' }
  const listo = (['amarilla', 'azul'] as const).every((k) => obs[k].hollin !== null)
  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-2xl bg-[var(--tarjeta)] p-4 text-sm">En la <b>combustión</b> un combustible reacciona con el <b>oxígeno</b> y libera energía (luz y calor). Enciende el mechero (primero el fósforo, luego el gas), gira el anillo de aire para cambiar la llama y sostén sobre ella la cápsula, el vaso frío y el vaso con agua de cal. Luego tapa la vela con un frasco y mide cuánto dura.</p>
      <MesaViva desde={120} piezas={piezas} destinos={destinos} soltar={soltar} />
      {msg && <p className={`-mt-2 text-sm ${msg.aviso ? 'font-semibold text-[#b5462c]' : ''}`}>{msg.aviso ? '⚠ ' : '› '}{msg.t}</p>}
      <div className="overflow-x-auto rounded-xl bg-[var(--tarjeta)] p-3 text-sm">
        <table className="w-full">
          <thead><tr className="text-left"><th className="p-1">Llama</th><th className="p-1">Hollín</th><th className="p-1">Agua</th><th className="p-1">CO₂ (cal)</th><th className="p-1">¿Combustión…?</th></tr></thead>
          <tbody>{(['amarilla', 'azul'] as const).map((k) => (
            <tr key={k} className="border-t border-[var(--linea)]">
              <td className="p-1">{k === 'amarilla' ? 'Amarilla (aire cerrado)' : 'Azul (aire abierto)'}</td>
              <td className="p-1">{sn(obs[k].hollin)}</td><td className="p-1">{sn(obs[k].agua)}</td><td className="p-1">{sn(obs[k].cal)}</td>
              <td className="p-1">{['completa', 'incompleta'].map((c) => <button key={c} type="button" disabled={!listo} onClick={() => setClase((x) => ({ ...x, [k]: c }))} className={`mr-1 rounded-full border px-2 py-0.5 text-xs disabled:opacity-40 ${clase[k] === c ? 'border-[var(--acento)] bg-[var(--acento)] text-white' : 'border-[var(--linea)] bg-white'}`}>{c}</button>)}
                {clase[k] && <span className={clase[k] === CORR[k] ? 'text-[#1e8449]' : 'text-[#b5462c]'}>{clase[k] === CORR[k] ? ' ✔' : ' ✘'}</span>}</td>
            </tr>
          ))}</tbody>
        </table>
        {(tiempos.p || tiempos.g) && <p className="mt-2">Vela tapada: {tiempos.p ? `frasco pequeño ${tiempos.p.toFixed(0)} s` : ''}{tiempos.p && tiempos.g ? ' · ' : ''}{tiempos.g ? `frasco grande ${tiempos.g.toFixed(0)} s` : ''}</p>}
      </div>
      {clase.amarilla && clase.azul && <p className="rounded-lg bg-[#eaf5ee] p-2 text-sm"><b>Conclusión:</b> con suficiente oxígeno (llama azul) la combustión es <b>completa</b>: da dióxido de carbono y agua, calienta más y no deja hollín. Con poco oxígeno (llama amarilla) es <b>incompleta</b>: queda carbono sin quemar (hollín, que brilla y da el color amarillo) y se forma monóxido de carbono (CO), un gas invisible y venenoso. La vela se apaga al acabarse el oxígeno del frasco: sin comburente no hay fuego (triángulo del fuego).{grado >= 9 ? ' Completa: CH₄ + 2 O₂ → CO₂ + 2 H₂O. Incompleta: 2 CH₄ + 3 O₂ → 2 CO + 4 H₂O, o CH₄ + O₂ → C + 2 H₂O.' : ''}{grado >= 11 ? ' La combustión es exotérmica: el metano libera ≈ 890 kJ/mol. La incompleta libera menos energía por cada mol de combustible; por eso el gas de cocina debe dar llama azul y las estufas necesitan ventilación (riesgo de intoxicación con CO).' : ''}</p>}
      <p className="text-xs text-[var(--suave)]">Seguridad: cabello recogido, nada inflamable cerca, primero el fósforo y luego el gas; la cápsula y los vasos se calientan: tómalos con pinza. Versión casera: vela, un plato de cerámica (hollín), un vaso frío (agua) y frascos de distinto tamaño para taparla (con un adulto).</p>
    </div>
  )
}
