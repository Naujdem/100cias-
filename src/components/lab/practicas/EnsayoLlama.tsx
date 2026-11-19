import { useCallback, useEffect, useState } from 'react'
import MesaViva from '../MesaViva.tsx'
import type { Pieza, Uso } from '../MesaViva.tsx'

// Laboratorio de Química 5 (PLAN-LABORATORIOS.md): ensayo a la llama, en mesa viva.
// Se enciende el mechero tocándolo; el asa se limpia en el HCl, se carga con una sal y se mete en la llama:
// el color dura unos segundos de verdad y luego la sal se quema. Si no se limpia el asa entre muestras, quedan
// restos y el color sale mezclado (el sodio tapa a casi todos). Hay que identificar una muestra desconocida.
// Desde 9°, espectroscopio de mano (líneas aproximadas); en 11°, vidrio de cobalto y una mezcla Na + K.

interface Sal { id: string; n: string; el: string; color: string; nombreColor: string; lineas: number[] }
const SALES: Sal[] = [
  { id: 'li', n: 'Cloruro de litio', el: 'Litio', color: '#d6204a', nombreColor: 'rojo carmín', lineas: [610, 671] },
  { id: 'na', n: 'Cloruro de sodio', el: 'Sodio', color: '#ffb300', nombreColor: 'amarillo intenso', lineas: [589] },
  { id: 'k', n: 'Cloruro de potasio', el: 'Potasio', color: '#b57edc', nombreColor: 'violeta pálido (lila)', lineas: [405, 766] },
  { id: 'ca', n: 'Cloruro de calcio', el: 'Calcio', color: '#ff6a2b', nombreColor: 'rojo anaranjado', lineas: [554, 622] },
  { id: 'sr', n: 'Cloruro de estroncio', el: 'Estroncio', color: '#e8102e', nombreColor: 'rojo intenso', lineas: [606, 650, 662] },
  { id: 'cu', n: 'Cloruro de cobre', el: 'Cobre', color: '#2fd17a', nombreColor: 'verde azulado', lineas: [510, 515, 522] },
]
const S = (id: string) => SALES.find((s) => s.id === id)!
const DURA = 6 // segundos que dura el color en la llama

/** color de la llama con estas sales (el sodio domina; con cobalto, el amarillo del sodio se filtra) */
function llama(els: string[], cobalto: boolean): { color: string; texto: string } {
  let v = [...new Set(els)]
  if (cobalto) v = v.filter((x) => x !== 'na')
  if (!v.length) return { color: cobalto ? '#5b6cff' : '#7fb3ff', texto: cobalto ? 'casi nada (el vidrio azul filtra el amarillo)' : 'azul, sin color' }
  if (v.includes('na')) return { color: S('na').color, texto: v.length > 1 ? 'amarillo intenso (el sodio tapa los demás colores)' : S('na').nombreColor }
  if (v.length === 1) return { color: S(v[0]).color, texto: S(v[0]).nombreColor }
  return { color: S(v[0]).color, texto: `mezclado: ${v.map((x) => S(x).nombreColor).join(' + ')}` }
}

function Espectro({ els }: { els: string[] }) {
  const x = (nm: number) => ((nm - 400) / 380) * 360 + 10
  const lineas = [...new Set(els)].flatMap((id) => S(id).lineas.map((nm) => ({ nm, c: S(id).color })))
  return (
    <svg viewBox="0 0 380 70" className="w-full max-w-md rounded-lg bg-[#111]" role="img" aria-label="Espectro de emisión">
      <defs><linearGradient id="arcoiris"><stop offset="0" stopColor="#7a00ff" /><stop offset="0.2" stopColor="#2040ff" /><stop offset="0.35" stopColor="#00c0ff" /><stop offset="0.45" stopColor="#00d040" /><stop offset="0.55" stopColor="#c8e000" /><stop offset="0.65" stopColor="#ffb000" /><stop offset="0.8" stopColor="#ff3000" /><stop offset="1" stopColor="#900000" /></linearGradient></defs>
      <rect x="10" y="44" width="360" height="6" fill="url(#arcoiris)" opacity="0.5" />
      {lineas.map((l, k) => <rect key={k} x={x(l.nm) - 1.5} y="8" width="3" height="34" fill={l.c} />)}
      {[400, 500, 600, 700].map((nm) => <text key={nm} x={x(nm)} y="64" textAnchor="middle" fontSize="9" fill="#ccc">{nm} nm</text>)}
    </svg>
  )
}

export default function EnsayoLlama({ grado }: { grado: number }) {
  const [encendido, setEncendido] = useState(false)
  const [asa, setAsa] = useState<string[]>([]) // sales en el asa ahora
  const [resto, setResto] = useState<string[]>(['na']) // restos que quedan pegados (el asa nueva viene con sudor: sodio)
  const [enLlama, setEnLlama] = useState(false)
  const [t, setT] = useState(0)
  const [cobalto, setCobalto] = useState(false)
  const [espectro, setEspectro] = useState(false)
  const [obs, setObs] = useState<{ muestra: string; texto: string; limpio: boolean }[]>([])
  const [desc] = useState(() => (grado >= 11 && Math.random() < 0.4 ? ['na', 'k'] : [SALES[Math.floor(Math.random() * SALES.length)].id]))
  const [eleccion, setEleccion] = useState<string | null>(null)
  const [msg, setMsg] = useState<{ t: string; aviso?: boolean } | null>(null)
  const muestraActual = asa.length ? asa : []
  const quema = enLlama && encendido && t < DURA
  const visto = quema ? llama([...muestraActual, ...resto], cobalto) : null

  useEffect(() => {
    if (!enLlama || !encendido || t >= DURA) return
    const id = window.setTimeout(() => setT((x) => x + 1), 1000)
    return () => window.clearTimeout(id)
  }, [enLlama, encendido, t])
  // al terminar de quemarse, la sal deja restos en el asa
  useEffect(() => {
    if (t >= DURA && asa.length) { setResto((r) => [...new Set([...r, ...asa])]); setAsa([]) }
  }, [t, asa])

  const alTomar = useCallback((id: string | null) => { if (id === 'asa') setEnLlama(false) }, [])
  const etiqueta = (ids: string[]) => (ids === desc ? 'Desconocida' : ids.map((x) => S(x).el).join(' + '))

  const piezas: Pieza[] = [
    {
      id: 'asa', nombre: enLlama ? 'Asa en la llama (tómala para sacarla)' : 'Asa de alambre', ...(enLlama ? { x: 790, y: 190 } : { x: 80, y: 352 }), ancho: 110, alto: 20, tomable: true,
      dibujo: <g><rect x="-55" y="-4" width="50" height="8" rx="3" fill="#8a6a45" /><line x1="-5" x2="45" stroke="#9aa5ad" strokeWidth="2" /><circle cx="50" r="5" fill="none" stroke="#9aa5ad" strokeWidth="2" />{asa.length > 0 && <circle cx="50" r="3.5" fill="#f5f5f5" stroke="#bbb" />}</g>,
    },
    { id: 'hcl', nombre: 'Ácido clorhídrico diluido (limpia el asa)', x: 200, y: 330, ancho: 60, alto: 60, dibujo: <g><path d="M-22 -24 V26 H22 V-24" fill="rgba(255,255,255,0.6)" stroke="#2b2b2b" strokeWidth="2.5" /><rect x="-20" y="2" width="40" height="23" fill="#e8f4d9" /><text y="42" textAnchor="middle" fontSize="9" fontWeight="800">HCl</text></g> },
    ...[...SALES.map((s) => ({ id: s.id, ids: [s.id], n: s.n, et: s.id.toUpperCase() })), { id: 'x', ids: desc, n: 'Muestra desconocida', et: '?' }].map((m, k) => ({
      id: `s-${m.id}`, nombre: m.n, x: 290 + k * 62, y: 392, ancho: 54, alto: 26,
      dibujo: <g><path d="M-24 4 Q0 -6 24 4 Z" fill="#e8f2fa" stroke="#6b7a88" strokeWidth="1.5" /><ellipse cy="-1" rx="10" ry="3.5" fill={m.id === 'cu' ? '#5fae9a' : '#fafafa'} stroke="#bbb" /><text y="18" textAnchor="middle" fontSize="9" fontWeight="800">{m.et}</text></g>,
    })),
    {
      id: 'mechero', nombre: encendido ? 'Mechero (toca: apagar)' : 'Mechero (toca: encender)', x: 790, y: 300, ancho: 70, alto: 120, alTocar: () => { setEncendido((v) => !v); setMsg(null) },
      dibujo: <g><rect x="-30" y="48" width="60" height="12" rx="3" fill="#5d6d7e" /><rect x="-9" y="-50" width="18" height="98" fill="#9aa5ad" stroke="#2b2b2b" strokeWidth="1.5" /><rect x="-13" y="20" width="26" height="8" fill="#5d6d7e" />
        {encendido && <g style={{ mixBlendMode: 'multiply' }}><path d="M-12 -52 Q-16 -100 0 -130 Q16 -100 12 -52 Z" fill={visto?.color ?? '#7fb3ff'} opacity={visto ? 0.85 : 0.45} style={{ transition: 'fill 0.4s' }}><animate attributeName="d" values="M-12 -52 Q-16 -100 0 -130 Q16 -100 12 -52 Z;M-12 -52 Q-14 -104 0 -136 Q14 -104 12 -52 Z;M-12 -52 Q-16 -100 0 -130 Q16 -100 12 -52 Z" dur="0.6s" repeatCount="indefinite" /></path><path d="M-6 -52 Q-7 -72 0 -86 Q7 -72 6 -52 Z" fill="#3a5dff" opacity="0.6" /></g>}
      </g>,
    },
    { id: 'cobalto', nombre: cobalto ? 'Vidrio de cobalto (toca: quitarlo)' : 'Vidrio de cobalto (toca: mirar a través)', x: 900, y: 330, ancho: 50, alto: 60, alTocar: () => setCobalto((v) => !v), dibujo: <rect x="-18" y="-26" width="36" height="52" rx="3" fill={cobalto ? '#1d3fd0' : '#3c5ae0'} opacity={cobalto ? 0.95 : 0.6} stroke="#2b2b2b" strokeWidth="2" /> },
    ...(grado >= 9 ? [{ id: 'espectro', nombre: espectro ? 'Espectroscopio (toca: guardar)' : 'Espectroscopio (toca: mirar la llama)', x: 640, y: 340, ancho: 70, alto: 36, alTocar: () => setEspectro((v) => !v), dibujo: <g><rect x="-30" y="-10" width="60" height="20" rx="6" fill="#34495e" stroke="#2b2b2b" strokeWidth="1.5" /><circle cx="-30" r="7" fill="#85929e" /></g> }] : []),
  ].filter((p) => p.id !== 'cobalto' || grado >= 11)

  const destinos = () => ['hcl', 'mechero', ...SALES.map((s) => `s-${s.id}`), 's-x']
  const soltar = (de: string, en: string): Uso | string => {
    if (de !== 'asa') return 'No se puede.'
    if (en === 'hcl') return { anim: 'frotar', hecho: () => { setAsa([]); setResto([]); setT(0); setMsg({ t: 'Limpias el asa en el ácido: ya no quedan restos de otras sales.' }) } }
    if (en.startsWith('s-')) {
      if (asa.length) return 'El asa ya tiene una muestra: quémala en la llama o límpiala primero.'
      const ids = en === 's-x' ? desc : [en.slice(2)]
      return { anim: 'poner', hecho: () => { setAsa(ids); setT(0); setMsg(resto.length ? { t: 'Tomaste la muestra con el asa sin limpiar: tiene restos de antes.', aviso: true } : { t: 'Muestra en el asa. Llévala a la llama.' }) } }
    }
    if (en === 'mechero') {
      if (!encendido) return 'El mechero está apagado: tócalo para encenderlo.'
      return {
        anim: 'poner',
        hecho: () => {
          setEnLlama(true); setT(0)
          if (asa.length) {
            const v = llama([...asa, ...resto], cobalto)
            setObs((o) => [...o, { muestra: etiqueta(asa), texto: v.texto + (cobalto ? ' (con cobalto)' : ''), limpio: !resto.length }])
          }
        },
      }
    }
    return 'El asa se usa en el ácido, en una sal o en la llama.'
  }

  const bien = eleccion !== null && (desc.length > 1 ? eleccion === 'na+k' : eleccion === desc[0])
  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-2xl bg-[var(--tarjeta)] p-4 text-sm">
        Cada metal le da a la llama un color propio. Enciende el mechero, <b>limpia el asa</b> en el ácido, toma un poco de sal y métela en la llama: el color dura unos segundos. Prueba las sales conocidas y luego descubre de qué es la <b>muestra desconocida (?)</b>. Limpia el asa entre una muestra y otra.
      </p>
      <MesaViva desde={110} piezas={piezas} destinos={destinos} soltar={soltar} alTomar={alTomar} />
      {msg && <p className={`-mt-2 text-sm ${msg.aviso ? 'font-semibold text-[#b5462c]' : ''}`}>{msg.aviso ? '⚠ ' : '› '}{msg.t}</p>}
      {quema && <p className="-mt-2 text-sm">🔥 La llama se ve <b>{visto!.texto}</b> · {DURA - t} s</p>}
      {espectro && grado >= 9 && (
        <div className="rounded-xl bg-[var(--tarjeta)] p-3 text-sm">
          <p className="font-semibold">Espectroscopio</p>
          <Espectro els={quema ? [...muestraActual, ...resto] : []} />
          <p className="mt-1 text-xs text-[var(--suave)]">{quema ? 'Cada elemento da líneas brillantes en lugares fijos: es su «huella». Posiciones aproximadas.' : 'Mira la llama mientras hay una sal ardiendo.'}</p>
        </div>
      )}
      {obs.length > 0 && (
        <div className="rounded-xl bg-[var(--tarjeta)] p-3 text-sm">
          <p className="font-semibold">Tus observaciones</p>
          <table className="mt-1 w-full"><tbody>{obs.map((o, k) => <tr key={k} className="border-t border-[var(--linea)]"><td className="p-1">{o.muestra}</td><td className="p-1">{o.texto}</td><td className="p-1 text-xs">{o.limpio ? '' : <span className="text-[#b5462c]">asa sin limpiar</span>}</td></tr>)}</tbody></table>
        </div>
      )}
      {obs.some((o) => o.muestra === 'Desconocida') && (
        <div className="rounded-xl bg-[var(--tarjeta)] p-3 text-sm">
          <p className="font-semibold">¿Qué metal tiene la muestra desconocida?</p>
          <div className="mt-1 flex flex-wrap gap-1">
            {[...SALES.map((s) => ({ v: s.id, t: s.el })), ...(grado >= 11 ? [{ v: 'na+k', t: 'Sodio + potasio' }] : [])].map((o) => <button key={o.v} type="button" onClick={() => setEleccion(o.v)} className={`rounded-full border px-3 py-1 text-xs font-semibold ${eleccion === o.v ? 'border-[var(--acento)] bg-[var(--acento)] text-white' : 'border-[var(--linea)] bg-white'}`}>{o.t}</button>)}
          </div>
          {eleccion && <p className={`mt-2 ${bien ? 'text-[#1e8449]' : 'text-[#b5462c]'}`}>{bien ? '✔ ¡Correcto!' : '✘ No es esa.'} {bien ? '' : desc.length > 1 ? 'Pista: el amarillo puede estar tapando otro color; mírala con el vidrio de cobalto.' : 'Limpia bien el asa y compárala con las sales conocidas.'}</p>}
        </div>
      )}
      <div className="rounded-xl bg-[#eaf5ee] p-3 text-sm">
        <b>¿Por qué?</b> El calor de la llama le da energía a los electrones del metal y los hace saltar a niveles más altos. Al volver a su nivel, sueltan esa energía como luz de un color fijo, distinto para cada elemento. Así funcionan los fuegos artificiales.
        {grado >= 9 && ' Con el espectroscopio se ven líneas sueltas, no un arcoíris: los electrones solo pueden estar en ciertos niveles de energía (modelo de Bohr).'}
        {grado >= 11 && ' La energía de cada línea es E = h·c / λ: el violeta del potasio (405 nm) viene de un salto de más energía que el rojo del litio (671 nm).'}
      </div>
      <p className="text-xs text-[var(--suave)]">Versión casera: con un adulto, un poco de sal de cocina (sodio) o sal light (potasio) espolvoreada sobre la llama de la estufa. El asa nueva trae sodio del sudor de las manos: por eso hay que limpiarla. Colores y líneas aproximados.</p>
    </div>
  )
}
