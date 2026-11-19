import { useEffect, useState } from 'react'
import MesaViva from '../MesaViva.tsx'
import type { Pieza, Uso } from '../MesaViva.tsx'

// Práctica extra 11 (PLAN-LABORATORIOS.md): selección natural con picos, Biología área 4, desde 6° (DBA 9°-6).
// 1) Medir: en rondas de 15 s reales, el estudiante toma un «pico» (pinza, cuchara o pitillo) y lo suelta en la comida
//    (semillas pequeñas, semillas grandes duras, néctar de las flores); cada toque gana lo que ese pico logra coger.
// 2) Elegir el ambiente y ver 6 generaciones: cada tipo deja descendencia según lo que come en ese ambiente
//    (con lo medido por el estudiante); la población total se mantiene en 12 aves.

const f = (x: number, d = 0) => x.toLocaleString('es-CO', { minimumFractionDigits: d, maximumFractionDigits: d })
type Pico = 'pinza' | 'cuchara' | 'pitillo'
type Comida = 'pequena' | 'grande' | 'nectar'
const PICO: Record<Pico, { n: string; c: string }> = { pinza: { n: 'Pico de pinza', c: '#c0392b' }, cuchara: { n: 'Pico de cuchara', c: '#3f6fb8' }, pitillo: { n: 'Pico de pitillo', c: '#4f8a3c' } }
const COMIDA: Record<Comida, { n: string }> = { pequena: { n: 'Semillas pequeñas' }, grande: { n: 'Semillas grandes y duras' }, nectar: { n: 'Néctar de las flores' } }
// lo que coge cada pico de cada comida en un toque (con algo de azar)
const COGE: Record<Pico, Record<Comida, [number, string]>> = {
  pinza: { pequena: [1, 'pellizca una semillita'], grande: [2, 'agarra y parte la semilla dura'], nectar: [0, 'no puede sorber'] },
  cuchara: { pequena: [3, 'saca un puñado de semillitas'], grande: [0.5, 'la semilla grande se le resbala'], nectar: [0, 'el néctar se le derrama'] },
  pitillo: { pequena: [0.3, 'casi no puede con las semillas'], grande: [0, 'no puede con la semilla dura'], nectar: [3, 'sorbe el néctar del fondo de la flor'] },
}
const AMB: Record<string, { n: string; ab: Record<Comida, number>; t: string }> = {
  lluvioso: { n: 'Época de lluvias', ab: { pequena: 1, grande: 0.3, nectar: 1 }, t: 'muchas flores y semillas pequeñas' },
  sequia: { n: 'Sequía', ab: { pequena: 0.25, grande: 1, nectar: 0.1 }, t: 'casi solo quedan semillas grandes y duras' },
  flores: { n: 'Llegan flores nuevas', ab: { pequena: 0.4, grande: 0.3, nectar: 1.4 }, t: 'muchísimas flores' },
}
const PICOS = Object.keys(PICO) as Pico[]
const RONDA = 15

export default function SeleccionPicos({ grado }: { grado: number }) {
  const [medido, setMedido] = useState<Record<Pico, Record<Comida, number>>>(() => Object.fromEntries(PICOS.map((p) => [p, { pequena: 0, grande: 0, nectar: 0 }])) as Record<Pico, Record<Comida, number>>)
  const [ronda, setRonda] = useState<{ p: Pico; s: number } | null>(null)
  const [hechos, setHechos] = useState<Pico[]>([])
  const [amb, setAmb] = useState<string | null>(null)
  const [gens, setGens] = useState<Record<Pico, number>[]>([])
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => {
    if (!ronda) return
    if (ronda.s <= 0) { setHechos((h) => [...new Set([...h, ronda.p])]); setMsg(`Se acabó el tiempo del ${PICO[ronda.p].n.toLowerCase()}: comió ${f(total(ronda.p), 1)} unidades.`); setRonda(null); return }
    const id = window.setTimeout(() => setRonda((r) => (r ? { ...r, s: r.s - 1 } : r)), 1000)
    return () => window.clearTimeout(id)
  }, [ronda])
  useEffect(() => {
    if (!amb || gens.length === 0 || gens.length > 6) return
    const id = window.setTimeout(() => setGens((g) => [...g, siguiente(g[g.length - 1])]), 1200)
    return () => window.clearTimeout(id)
  }, [gens, amb])

  const total = (p: Pico) => medido[p].pequena + medido[p].grande + medido[p].nectar
  const aptitud = (p: Pico) => (Object.keys(COMIDA) as Comida[]).reduce((a, c) => a + medido[p][c] * AMB[amb!].ab[c], 0)
  const siguiente = (pop: Record<Pico, number>) => {
    const peso = PICOS.map((p) => pop[p] * (aptitud(p) + 0.01))
    const suma = peso.reduce((a, b) => a + b, 0)
    const crudo = peso.map((w) => (w / suma) * 12)
    const ent = crudo.map(Math.floor)
    let resto = 12 - ent.reduce((a, b) => a + b, 0)
    crudo.map((x, i) => [x - ent[i], i]).sort((a, b) => b[0] - a[0]).forEach(([, i]) => { if (resto > 0) { ent[i]++; resto-- } })
    return Object.fromEntries(PICOS.map((p, i) => [p, ent[i]])) as Record<Pico, number>
  }

  const piezas: Pieza[] = [
    ...PICOS.map((p, k) => ({ id: p, nombre: `${PICO[p].n}${hechos.includes(p) ? ' (ya comió)' : ronda ? '' : ' (tómalo: empieza su ronda de 15 s)'}`, x: 90, y: 230 + k * 75, ancho: 120, alto: 50, tomable: !ronda || ronda.p === p,
      dibujo: <g>
        <circle cx="-34" cy="0" r="16" fill={PICO[p].c} stroke="#2b2b2b" strokeWidth="2" /><circle cx="-38" cy="-4" r="3" fill="#fff" />
        {p === 'pinza' && <path d="M-18 -4 L30 -2 M-18 4 L30 2" stroke="#555" strokeWidth="4" strokeLinecap="round" />}
        {p === 'cuchara' && <g><rect x="-18" y="-3" width="30" height="6" fill="#999" /><ellipse cx="24" cy="0" rx="12" ry="8" fill="#bbb" stroke="#555" /></g>}
        {p === 'pitillo' && <rect x="-18" y="-3" width="56" height="6" rx="3" fill="#f2f2f2" stroke="#555" />}
      </g> })),
    { id: 'pequena', nombre: COMIDA.pequena.n, x: 420, y: 340, ancho: 160, alto: 80, dibujo: <g><ellipse cx="0" cy="20" rx="74" ry="16" fill="#d9c49a" />{Array.from({ length: 40 }, (_, i) => <ellipse key={i} cx={-60 + (i * 37) % 120} cy={14 + (i * 7) % 14} rx="3" ry="1.6" fill="#fff6dc" stroke="#b9a" strokeWidth="0.5" />)}</g> },
    { id: 'grande', nombre: COMIDA.grande.n, x: 610, y: 340, ancho: 150, alto: 80, dibujo: <g><ellipse cx="0" cy="20" rx="68" ry="16" fill="#d9c49a" />{Array.from({ length: 10 }, (_, i) => <ellipse key={i} cx={-50 + i * 11} cy={14 + (i % 2) * 8} rx="7" ry="5" fill="#6b3b22" stroke="#3a1d10" />)}</g> },
    { id: 'nectar', nombre: COMIDA.nectar.n, x: 800, y: 320, ancho: 150, alto: 110, dibujo: <g>{[-44, 0, 44].map((x) => <g key={x}><line x1={x} y1="50" x2={x} y2="0" stroke="#3d6b2c" strokeWidth="3" /><path d={`M${x - 8} 0 L${x - 4} -40 H${x + 4} L${x + 8} 0 Z`} fill="#e0457b" /><circle cx={x} cy="-36" r="3" fill="#f7c948" /></g>)}</g> },
    { id: 'reloj', nombre: ronda ? `Quedan ${ronda.s} s` : 'Reloj de la ronda', x: 610, y: 230, ancho: 90, alto: 50, dibujo: <g><rect x="-40" y="-20" width="80" height="40" rx="8" fill="#222" /><text y="7" textAnchor="middle" fontSize="18" fontFamily="monospace" fill={ronda && ronda.s <= 5 ? '#ff6b6b' : '#7dff8a'}>{ronda ? `0:${String(ronda.s).padStart(2, '0')}` : '0:15'}</text></g> },
  ]
  const alTomar = (id: string | null) => {
    if (!id || !(id in PICO) || ronda) return
    if (hechos.includes(id as Pico)) { setMsg('Ese pico ya hizo su ronda. Puedes repetirla: se suma a lo anterior.'); }
    setRonda({ p: id as Pico, s: RONDA })
    setMsg(`¡Empieza! Lleva el ${PICO[id as Pico].n.toLowerCase()} a la comida una y otra vez durante 15 s.`)
  }
  const soltar = (de: string, en: string): Uso | string => {
    const p = de as Pico, c = en as Comida
    if (!ronda || ronda.p !== p) return 'Se acabó la ronda de este pico.'
    const [n, t] = COGE[p][c]
    const g = n === 0 ? 0 : Math.max(0, n + (Math.random() - 0.5) * n * 0.6)
    return { anim: 'poner', hecho: () => { setMedido((m) => ({ ...m, [p]: { ...m[p], [c]: m[p][c] + g } })); setMsg(`${PICO[p].n}: ${t} (+${f(g, 1)}).`) } }
  }
  const destinos = (de: string) => (de in PICO ? ['pequena', 'grande', 'nectar'] : [])

  const todos = PICOS.every((p) => hechos.includes(p))
  const ultimo = gens[gens.length - 1]
  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-2xl border border-[var(--linea)] bg-[var(--tarjeta)] p-4 text-sm"><b>¿Qué pico sobrevive?</b> Primero mide: toma cada pico y, durante 15 segundos, llévalo a la comida una y otra vez (semillas pequeñas, semillas grandes o flores). Después elige cómo cambia el ambiente y mira qué pasa con la población durante seis generaciones.</p>
      <MesaViva desde={190} piezas={piezas} destinos={destinos} soltar={soltar} alTomar={alTomar} />
      {msg && <p className="-mt-2 text-sm">› {msg}</p>}
      {hechos.length > 0 && (
        <table className="mx-auto text-sm">
          <thead><tr><th className="px-2 text-left">Pico</th>{(Object.keys(COMIDA) as Comida[]).map((c) => <th key={c} className="px-2">{COMIDA[c].n.split(' ')[0]} {c === 'pequena' ? 'peq.' : c === 'grande' ? 'gr.' : ''}</th>)}<th className="px-2">Total</th></tr></thead>
          <tbody>{PICOS.filter((p) => hechos.includes(p)).map((p) => <tr key={p}><td className="px-2" style={{ color: PICO[p].c }}>{PICO[p].n}</td>{(Object.keys(COMIDA) as Comida[]).map((c) => <td key={c} className="px-2 text-center">{f(medido[p][c], 1)}</td>)}<td className="px-2 text-center font-semibold">{f(total(p), 1)}</td></tr>)}</tbody>
        </table>
      )}
      {todos && (
        <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
          <span>Cambia el ambiente:</span>
          {Object.entries(AMB).map(([k, a]) => <button key={k} type="button" onClick={() => { setAmb(k); setGens([{ pinza: 4, cuchara: 4, pitillo: 4 }]) }} className={`min-h-10 rounded-full border px-4 ${amb === k ? 'border-[var(--acento)] font-semibold' : 'border-[var(--linea)]'}`}>{a.n}</button>)}
        </div>
      )}
      {amb && gens.length > 0 && (
        <div className="mx-auto w-full max-w-xl">
          <p className="mb-1 text-center text-sm">{AMB[amb].n}: {AMB[amb].t}.</p>
          <div className="flex items-end justify-center gap-3">
            {gens.map((g, i) => (
              <div key={i} className="flex flex-col items-center text-xs">
                <div className="flex h-36 w-10 flex-col-reverse overflow-hidden rounded border border-[var(--linea)]">
                  {PICOS.map((p) => <div key={p} style={{ height: `${(g[p] / 12) * 100}%`, background: PICO[p].c, transition: 'height 0.8s' }} title={`${PICO[p].n}: ${g[p]}`} />)}
                </div>
                <span>G{i}</span>
              </div>
            ))}
          </div>
          <p className="mt-1 text-center text-xs">{PICOS.map((p) => <span key={p} className="mx-2" style={{ color: PICO[p].c }}>■ {PICO[p].n.replace('Pico de ', '')}: {ultimo[p]}</span>)}</p>
        </div>
      )}
      {gens.length >= 7 && (
        <p className="rounded-lg bg-[#eaf5ee] p-2 text-sm"><b>¿Qué pasó?</b> Las aves con el pico que mejor sirve para la comida que hay comieron más, sobrevivieron y tuvieron más crías, que heredaron ese pico. Generación tras generación ese pico se volvió más común: eso es la <b>selección natural</b>. Si cambias el ambiente, gana otro pico: no hay un pico «mejor» en general, sino uno que encaja mejor con su ambiente.
          {grado >= 9 ? ' Para que haya selección natural se necesitan tres cosas: variación entre los individuos, que esa variación se herede y que unos dejen más descendencia que otros. Darwin lo notó en los pinzones de Galápagos, y Peter y Rosemary Grant lo midieron: después de una sequía en 1977 sobrevivieron más los pinzones de pico grueso, que podían partir semillas duras.' : ''}
          {grado >= 11 ? ' Lo que cambia es la frecuencia de los alelos en la población, no el individuo: ningún ave cambió su pico por necesitarlo. Cuando el ambiente favorece un extremo, la selección es direccional.' : ''}
        </p>
      )}
    </div>
  )
}
