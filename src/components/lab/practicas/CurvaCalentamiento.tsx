import { useEffect, useState } from 'react'
import MesaViva from '../MesaViva.tsx'
import type { Pieza, Uso } from '../MesaViva.tsx'
import { Caneca } from '../dibujos.tsx'

// Práctica extra 8 (PLAN-LABORATORIOS.md): curva de calentamiento del agua, Química área 1, desde 6° (DBA 6°-2).
// Cubos de hielo de 50 g (a −10 °C) al vaso, termómetro al vaso, estufa que se toca (8 kJ por minuto), varilla.
// Tiempo acelerado 1 s = 15 s. La libreta se toca para anotar la lectura (el estudiante decide cuándo).
// Sin revolver, mientras se derrite el hielo el termómetro marca de más. Ebullición según la ciudad (9°: altitud).
// En 11°: calor latente de fusión = potencia × duración de la meseta ÷ masa.

const f = (x: number, d = 1) => x.toLocaleString('es-CO', { minimumFractionDigits: d, maximumFractionDigits: d })
const P = 8000 // J por minuto
const C_HIELO = 2.1, C_AGUA = 4.18, L_F = 334, L_V = 2257
const CIUDADES = [{ n: 'Nivel del mar', eb: 100 }, { n: 'Neiva', eb: 98.5 }, { n: 'Bogotá', eb: 92 }]

export default function CurvaCalentamiento({ grado }: { grado: number }) {
  const [m, setM] = useState(0)
  const [termo, setTermo] = useState(false)
  const [estufa, setEstufa] = useState(false)
  const [Q, setQ] = useState(0) // energía recibida (J)
  const [t, setT] = useState(0) // segundos de experimento
  const [revuelto, setRevuelto] = useState(-999)
  const [datos, setDatos] = useState<{ t: number; T: number }[]>([])
  const [ciudad, setCiudad] = useState(1)
  const [msg, setMsg] = useState<{ t: string; aviso?: boolean } | null>(null)
  const eb = CIUDADES[ciudad].eb

  // estado físico a partir de la energía
  const e1 = m * C_HIELO * 10, e2 = e1 + m * L_F, e3 = e2 + m * C_AGUA * eb, e4 = e3 + m * L_V
  const T = !m ? 22 : Q < e1 ? -10 + Q / (m * C_HIELO) : Q < e2 ? 0 : Q < e3 ? (Q - e2) / (m * C_AGUA) : eb
  const hielo = !m ? 0 : Q < e1 ? 1 : Q < e2 ? 1 - (Q - e1) / (m * L_F) : 0
  const vapor = Q > e3 ? Math.min(1, (Q - e3) / (e4 - e3)) : 0
  const sinRevolver = hielo > 0 && hielo < 1 && t - revuelto > 8
  const lectura = sinRevolver ? T + 3 + (t % 3) : T

  useEffect(() => {
    if (!estufa || !m) return
    const id = window.setTimeout(() => { setT((x) => x + 15); setQ((q) => Math.min(e4, q + P / 4)) }, 1000)
    return () => window.clearTimeout(id)
  })

  const piezas: Pieza[] = [
    { id: 'hielo', nombre: 'Cubeta de hielo (cubos de 50 g, a −10 °C)', x: 80, y: 360, ancho: 90, alto: 50, tomable: m < 200 && Q === 0,
      dibujo: <g><rect x="-40" y="-14" width="80" height="28" rx="4" fill="#cfe6f5" stroke="#2b2b2b" strokeWidth="2" />{[-28, -10, 8, 26].map((x, k) => k < (200 - m) / 50 && <rect key={x} x={x - 7} y="-8" width="14" height="14" rx="2" fill="#f2fbff" stroke="#9cc" />)}</g> },
    { id: 'termo', nombre: termo ? `Termómetro en el vaso: ${f(lectura)} °C` : 'Termómetro', x: 190, y: 300, ancho: 30, alto: 120, tomable: !termo,
      dibujo: <g opacity={termo ? 0.25 : 1}><rect x="-4" y="-50" width="8" height="96" rx="4" fill="#fff" stroke="#2b2b2b" /><circle cy="48" r="7" fill="#c0392b" /><rect x="-2" y="0" width="4" height="46" fill="#c0392b" /></g> },
    { id: 'varilla', nombre: 'Varilla (revolver)', x: 280, y: 400, ancho: 100, alto: 16, tomable: true, dibujo: <rect x="-46" y="-3" width="92" height="6" rx="3" fill="#dfe9ef" stroke="#2b2b2b" /> },
    { id: 'vaso', nombre: `Vaso de precipitados · ${m} g de agua${m ? ` (${f(hielo * 100, 0)} % hielo${vapor ? `, ${f(vapor * 100, 0)} % ya evaporado` : ''})` : ''}`, x: 480, y: 300, ancho: 100, alto: 110,
      dibujo: <g>
        <path d="M-40 -50 V44 Q-40 50 -34 50 H34 Q40 50 40 44 V-50" fill="rgba(255,255,255,0.6)" stroke="#2b2b2b" strokeWidth="2" />
        {m > 0 && <rect x="-38" y={48 - (m / 200) * 60 * (1 - vapor * 0.9)} width="76" height={(m / 200) * 60 * (1 - vapor * 0.9)} fill="#a9d3f5" opacity={hielo > 0.98 ? 0.15 : 0.7} />}
        {Array.from({ length: Math.ceil((m / 50) * hielo) }, (_, k) => <rect key={k} x={-30 + k * 16} y={20 - (k % 2) * 10} width={14 * Math.max(0.4, hielo)} height={14 * Math.max(0.4, hielo)} rx="2" fill="#f2fbff" stroke="#9cc" />)}
        {T >= eb - 0.01 && m > 0 && [-20, 0, 20].map((x, k) => <circle key={x} cx={x} r="3" fill="#fff"><animate attributeName="cy" values="45;0" dur={`${0.6 + k * 0.2}s`} repeatCount="indefinite" /></circle>)}
        {T > 60 && [-16, 12].map((x) => <path key={x} d={`M${x} -56 q5 -8 0 -16`} fill="none" stroke="#bbb" strokeWidth="2" />)}
        {termo && <g><rect x="24" y="-80" width="7" height="110" rx="3" fill="#fff" stroke="#2b2b2b" /><rect x="25.5" y={20 - Math.max(0, Math.min(100, lectura + 10)) * 0.9} width="4" height={Math.max(0, Math.min(100, lectura + 10)) * 0.9 + 10} fill="#c0392b" /></g>}
      </g> },
    { id: 'estufa', nombre: estufa ? 'Estufa encendida (toca: apagar)' : 'Estufa (toca: encender)', x: 480, y: 385, ancho: 140, alto: 22,
      alTocar: () => { if (!m) return setMsg({ t: 'Primero el hielo en el vaso.', aviso: true }); if (!termo && !estufa) setMsg({ t: 'Pon el termómetro, o no podrás medir.', aviso: true }); setEstufa((v) => !v) },
      dibujo: <g><rect x="-66" y="-6" width="132" height="18" rx="4" fill="#5d6d7e" stroke="#2b2b2b" strokeWidth="2" /><circle cx="54" cy="3" r="5" fill={estufa ? '#e74c3c' : '#999'} /></g> },
    { id: 'crono', nombre: `Cronómetro: ${Math.floor(t / 60)} min ${t % 60} s`, x: 700, y: 260, ancho: 100, alto: 50,
      dibujo: <g><rect x="-44" y="-20" width="88" height="40" rx="8" fill="#222" /><text y="7" textAnchor="middle" fontSize="18" fontFamily="monospace" fill="#7dff8a">{`${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`}</text></g> },
    { id: 'libreta', nombre: `Libreta (toca: anotar la lectura) · ${datos.length} datos`, x: 700, y: 360, ancho: 100, alto: 80,
      alTocar: () => {
        if (!termo) return setMsg({ t: 'No hay termómetro en el vaso.', aviso: true })
        const ya = datos.find((d) => d.t === t)
        if (ya) return setMsg({ t: 'Ese minuto ya está anotado: espera la siguiente lectura.' })
        setDatos((d) => [...d, { t, T: Math.round(lectura * 10) / 10 }])
        setMsg({ t: `Anotado: ${f(t / 60, 2)} min → ${f(lectura)} °C.` })
      },
      dibujo: <g><rect x="-36" y="-34" width="72" height="68" rx="4" fill="#fffef4" stroke="#2b2b2b" strokeWidth="2" />{[-18, -6, 6, 18].map((y) => <line key={y} x1="-28" x2="28" y1={y} y2={y} stroke="#cfdbe6" />)}<text y="-20" textAnchor="middle" fontSize="10" fontWeight="700">t · T</text></g> },
    { id: 'caneca', nombre: 'Empezar de nuevo (toca)', x: 940, y: 370, ancho: 50, alto: 70,
      alTocar: () => { setM(0); setTermo(false); setEstufa(false); setQ(0); setT(0); setDatos([]); setRevuelto(-999); setMsg({ t: 'Vaso vacío.' }) }, dibujo: <g transform="scale(0.8)"><Caneca /></g> },
  ]
  const soltar = (de: string, en: string): Uso | string => {
    if (en !== 'vaso') return 'Va al vaso.'
    if (de === 'hielo') return { anim: 'poner', hecho: () => setM((x) => x + 50) }
    if (de === 'termo') return { anim: 'poner', hecho: () => { setTermo(true); setMsg({ t: 'El bulbo queda dentro del hielo, sin tocar el fondo.' }) } }
    if (de === 'varilla') return !m ? 'No hay nada que revolver.' : { anim: 'frotar', hecho: () => setRevuelto(t) }
    return 'No se puede.'
  }
  const destinos = () => ['vaso']

  // meseta de fusión medida por el estudiante
  const fus = datos.filter((d) => Math.abs(d.T) <= 0.5)
  const dur = fus.length >= 2 ? (fus[fus.length - 1].t - fus[0].t) / 60 : 0
  const curva = datos.length >= 6
  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-2xl border border-[var(--linea)] bg-[var(--tarjeta)] p-4 text-sm"><b>¿Cómo cambia la temperatura del hielo al calentarlo?</b> Pon el hielo y el termómetro en el vaso, enciende la estufa y anota la temperatura en la libreta cada minuto (tócala). Revuelve de vez en cuando. Sigue hasta que el agua hierva un rato.</p>
      {grado >= 9 && (
        <div className="flex flex-wrap justify-center gap-2 text-sm">
          <span className="self-center">¿Dónde se hace?</span>
          {CIUDADES.map((c, k) => <button key={c.n} type="button" disabled={Q > 0} onClick={() => setCiudad(k)} className={`min-h-9 rounded-full border px-3 ${ciudad === k ? 'border-[var(--acento)] font-semibold' : 'border-[var(--linea)]'} disabled:opacity-50`}>{c.n}</button>)}
        </div>
      )}
      <MesaViva desde={180} piezas={piezas} destinos={destinos} soltar={soltar} />
      {msg && <p className={`-mt-2 text-sm ${msg.aviso ? 'font-semibold text-[#b5462c]' : ''}`}>{msg.aviso ? '⚠ ' : '› '}{msg.t}</p>}
      {sinRevolver && termo && <p className="-mt-2 text-xs text-[#b5462c]">El agua cerca del termómetro está más caliente que la del hielo: revuelve para que la lectura sea pareja.</p>}
      <p className="-mt-2 text-xs text-[var(--suave)]">Tiempo acelerado: 1 s = 15 s. Estufa de potencia fija.</p>
      {datos.length > 0 && <Grafica datos={datos} eb={eb} etiquetas={grado >= 9} />}
      {curva && (
        <p className="rounded-lg bg-[var(--tarjeta)] p-2 text-sm"><b>¿Qué muestra la curva?</b> Mientras el hielo se derrite, la temperatura se queda en 0 °C aunque la estufa siga dando calor: esa energía se usa para separar las partículas, no para calentarlas. Lo mismo pasa al hervir: la temperatura se queda fija en el punto de ebullición. Esos tramos planos son las <b>mesetas</b>.
          {grado >= 9 ? ` En ${CIUDADES[ciudad].n} el agua hierve a unos ${f(eb)} °C: a más altura hay menos presión del aire y el agua hierve antes.` : ''}
          {grado >= 11 && dur > 0 ? ` Calor latente de fusión con tus datos: la meseta duró ${f(dur, 2)} min; L = P·t ÷ m = ${f(P / 1000)} kJ/min × ${f(dur, 2)} min ÷ ${m} g = ${f((P * dur) / m, 0)} J/g (valor de tabla: 334 J/g).` : ''}
        </p>
      )}
    </div>
  )
}

function Grafica({ datos, eb, etiquetas }: { datos: { t: number; T: number }[]; eb: number; etiquetas: boolean }) {
  const tmax = Math.max(20, ...datos.map((d) => d.t / 60))
  const X = (t: number) => 40 + (t / 60 / tmax) * 260
  const Y = (T: number) => 150 - ((T + 15) / 120) * 135
  return (
    <svg viewBox="0 0 320 175" className="mx-auto w-full max-w-md" role="img" aria-label="Curva de calentamiento">
      <line x1="40" y1="150" x2="305" y2="150" stroke="#333" /><line x1="40" y1="10" x2="40" y2="150" stroke="#333" />
      {[0, 50, 100].map((T) => <g key={T}><line x1="36" x2="305" y1={Y(T)} y2={Y(T)} stroke="#e3e8ee" /><text x="34" y={Y(T) + 3} fontSize="8" textAnchor="end">{T}</text></g>)}
      <polyline points={datos.map((d) => `${X(d.t)},${Y(d.T)}`).join(' ')} fill="none" stroke="#3f6fb8" strokeWidth="2" />
      {datos.map((d, k) => <circle key={k} cx={X(d.t)} cy={Y(d.T)} r="2.5" fill="#3f6fb8" />)}
      {etiquetas && <><text x="300" y={Y(0) - 3} fontSize="8" textAnchor="end" fill="#4f8a3c">fusión (0 °C)</text><text x="300" y={Y(eb) - 3} fontSize="8" textAnchor="end" fill="#c43c3c">ebullición ({f(eb)} °C)</text></>}
      <text x="170" y="172" textAnchor="middle" fontSize="10">Tiempo (min)</text>
      <text x="12" y="85" fontSize="10" transform="rotate(-90 12 85)" textAnchor="middle">Temperatura (°C)</text>
    </svg>
  )
}
