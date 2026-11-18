import { useState } from 'react'
import type { ReactNode } from 'react'

// Laboratorio de Biología 11 (opcional; PLAN-LABORATORIOS.md, área 5 y PRAE): calidad del agua y del suelo.
// Muestras × pruebas sencillas (de kit o caseras) y bioindicadores; el estudiante clasifica cada muestra.
// Valores de ejemplo para practicar la lectura: no son mediciones de un lugar real.

type Nota = 'buena' | 'regular' | 'mala'
const NOTAS: Nota[] = ['buena', 'regular', 'mala']
const COLOR_NOTA: Record<Nota, string> = { buena: '#2e7d5a', regular: '#c8781e', mala: '#b5462c' }

// ---------- agua ----------

interface Agua { id: string; n: string; ph: number; turb: number; temp: number; od: number; olor: string; bichos: string[]; nota: Nota }
const AGUAS: Agua[] = [
  { id: 'arriba', n: 'Quebrada arriba (bosque)', ph: 7.2, turb: 5, temp: 17, od: 8, olor: 'sin olor', bichos: ['efimeróptero', 'plecóptero', 'tricóptero', 'cangrejo'], nota: 'buena' },
  { id: 'abajo', n: 'Quebrada abajo del caserío', ph: 6.4, turb: 45, temp: 22, od: 3, olor: 'a alcantarilla', bichos: ['larva roja de mosquito', 'sanguijuela', 'gusano tubifex'], nota: 'mala' },
  { id: 'potrero', n: 'Quebrada junto al potrero', ph: 7.6, turb: 25, temp: 21, od: 6, olor: 'a tierra', bichos: ['tricóptero', 'caracol', 'larva roja de mosquito'], nota: 'regular' },
  { id: 'charca', n: 'Charca quieta', ph: 8.4, turb: 30, temp: 26, od: 4, olor: 'a podrido leve', bichos: ['caracol', 'larva de zancudo', 'sanguijuela'], nota: 'regular' },
]
const SENSIBLES = ['efimeróptero', 'plecóptero', 'tricóptero', 'cangrejo']
const TOLERANTES = ['larva roja de mosquito', 'sanguijuela', 'gusano tubifex', 'larva de zancudo']

const PRUEBAS_AGUA: { id: string; n: string; como: string }[] = [
  { id: 'ph', n: 'pH', como: 'Tira indicadora (o repollo morado)' },
  { id: 'turb', n: 'Turbidez', como: 'Botella con una cruz pintada al fondo' },
  { id: 'temp', n: 'Temperatura', como: 'Termómetro en el agua, a la sombra' },
  { id: 'od', n: 'Oxígeno disuelto', como: 'Kit de gotas: cambia de color' },
  { id: 'olor', n: 'Olor y color', como: 'Oler abanicando, mirar contra la luz' },
  { id: 'bichos', n: 'Macroinvertebrados', como: 'Red en las piedras del fondo, bandeja blanca' },
]

const colorPh = (ph: number) => {
  const t = Math.max(0, Math.min(1, (ph - 4) / 6))
  const a = [220, 60, 60], b = [230, 200, 60], c = [60, 140, 210]
  const m = t < 0.5 ? a.map((x, k) => x + (b[k] - x) * t * 2) : b.map((x, k) => x + (c[k] - x) * (t - 0.5) * 2)
  return `rgb(${m.map(Math.round).join(',')})`
}

function resultadoAgua(a: Agua, p: string): ReactNode {
  if (p === 'ph') return (
    <span className="flex items-center gap-2"><svg width="16" height="40"><rect width="16" height="40" rx="3" fill="#eee" /><rect y="10" width="16" height="14" fill={colorPh(a.ph)} /></svg> pH ≈ {a.ph.toLocaleString('es-CO')}</span>
  )
  if (p === 'turb') return (
    <span className="flex items-center gap-2">
      <svg width="40" height="40"><rect width="40" height="40" fill={`rgba(150,120,70,${a.turb / 60})`} /><path d="M14 20 h12 M20 14 v12" stroke="#222" strokeWidth="3" opacity={Math.max(0.05, 1 - a.turb / 50)} /></svg>
      {a.turb < 10 ? 'La cruz se ve nítida' : a.turb < 35 ? 'La cruz se ve borrosa' : 'La cruz casi no se ve'}
    </span>
  )
  if (p === 'temp') return `${a.temp} °C`
  if (p === 'od') return (
    <span className="flex items-center gap-2"><span className="inline-block h-6 w-6 rounded" style={{ background: `rgba(200, 120, 40, ${a.od / 9})` }} /> ≈ {a.od} mg/L</span>
  )
  if (p === 'olor') return a.olor
  return (
    <span className="flex flex-wrap gap-1">
      {a.bichos.map((b) => <span key={b} className={`rounded-full px-2 py-0.5 text-xs font-semibold ${SENSIBLES.includes(b) ? 'bg-[#eaf5ee] text-[#2e7d5a]' : TOLERANTES.includes(b) ? 'bg-[#fbeee9] text-[#b5462c]' : 'bg-[var(--fondo)]'}`}>{b}</span>)}
    </span>
  )
}

// ---------- suelo ----------

interface Suelo { id: string; n: string; arena: number; limo: number; arcilla: number; ph: number; mo: number; infil: number; lombrices: number; nota: Nota }
const SUELOS: Suelo[] = [
  { id: 'bosque', n: 'Bosque', arena: 35, limo: 40, arcilla: 25, ph: 6.3, mo: 0.9, infil: 40, lombrices: 9, nota: 'buena' },
  { id: 'cultivo', n: 'Cultivo con abono orgánico', arena: 40, limo: 35, arcilla: 25, ph: 6.6, mo: 0.6, infil: 70, lombrices: 6, nota: 'buena' },
  { id: 'potrero', n: 'Potrero pisoteado', arena: 25, limo: 30, arcilla: 45, ph: 5.4, mo: 0.3, infil: 300, lombrices: 1, nota: 'regular' },
  { id: 'camino', n: 'Orilla del camino (erosionada)', arena: 70, limo: 20, arcilla: 10, ph: 5.0, mo: 0.08, infil: 15, lombrices: 0, nota: 'mala' },
]
const PRUEBAS_SUELO: { id: string; n: string; como: string }[] = [
  { id: 'textura', n: 'Textura', como: 'Frasco con suelo y agua: agitar y dejar asentar un día' },
  { id: 'ph', n: 'pH', como: 'Suelo + agua destilada, tira indicadora' },
  { id: 'mo', n: 'Materia orgánica', como: 'Agua oxigenada sobre el suelo: más espuma, más materia orgánica' },
  { id: 'infil', n: 'Infiltración', como: 'Tubo enterrado: cuánto tarda en entrar 1/2 litro de agua' },
  { id: 'vida', n: 'Seres vivos', como: 'Contar lombrices en un bloque de 20 × 20 cm' },
]

function resultadoSuelo(s: Suelo, p: string): ReactNode {
  if (p === 'textura') return (
    <span className="flex items-center gap-2">
      <svg width="34" height="54"><rect x="1" y="1" width="32" height="52" rx="4" fill="#eef7ff" stroke="#999" />
        <rect x="2" y={52 - s.arena * 0.4} width="30" height={s.arena * 0.4} fill="#d8b878" />
        <rect x="2" y={52 - (s.arena + s.limo) * 0.4} width="30" height={s.limo * 0.4} fill="#a9875a" />
        <rect x="2" y={52 - 40} width="30" height={s.arcilla * 0.4} fill="#7a5a3a" />
      </svg>
      <span className="text-xs">arena {s.arena} % (abajo) · limo {s.limo} % · arcilla {s.arcilla} % (arriba)</span>
    </span>
  )
  if (p === 'ph') return <span className="flex items-center gap-2"><svg width="16" height="40"><rect width="16" height="40" rx="3" fill="#eee" /><rect y="10" width="16" height="14" fill={colorPh(s.ph)} /></svg> pH ≈ {s.ph.toLocaleString('es-CO')}</span>
  if (p === 'mo') return <span className="flex items-center gap-2"><svg width="30" height="40"><rect y={40 - s.mo * 36} width="30" height={s.mo * 36} fill="#f5f5f0" stroke="#ccc" /></svg>{s.mo > 0.7 ? 'mucha espuma' : s.mo > 0.4 ? 'espuma media' : s.mo > 0.15 ? 'poca espuma' : 'casi nada'}</span>
  if (p === 'infil') return s.infil >= 240 ? `${Math.round(s.infil / 60)} min (encharca)` : `${s.infil} s`
  return `${s.lombrices} lombrices`
}

function Tabla<T extends { id: string; n: string; nota: Nota }>({ muestras, pruebas, res, explicar }: { muestras: T[]; pruebas: { id: string; n: string; como: string }[]; res: (m: T, p: string) => ReactNode; explicar: (m: T) => string }) {
  const [hechas, setHechas] = useState<Set<string>>(new Set())
  const [notas, setNotas] = useState<Record<string, Nota>>({})
  const [rev, setRev] = useState(false)
  const hacer = (k: string) => setHechas((h) => new Set(h).add(k))
  const todas = (p: string) => muestras.forEach((m) => hacer(`${m.id}:${p}`))
  const aciertos = muestras.filter((m) => notas[m.id] === m.nota).length
  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] rounded-xl bg-[var(--tarjeta)] text-sm">
          <thead>
            <tr className="border-b text-left align-bottom">
              <th className="p-2">Muestra</th>
              {pruebas.map((p) => (
                <th key={p.id} className="p-2">
                  <span className="block">{p.n}</span>
                  <span className="block text-xs font-normal text-[var(--suave)]">{p.como}</span>
                  <button type="button" onClick={() => todas(p.id)} className="mt-1 rounded-full border border-[var(--linea)] px-2 py-0.5 text-xs font-semibold">Medir</button>
                </th>
              ))}
              <th className="p-2">Calidad</th>
            </tr>
          </thead>
          <tbody>
            {muestras.map((m) => (
              <tr key={m.id} className="border-b align-top last:border-0">
                <td className="p-2 font-semibold">{m.n}</td>
                {pruebas.map((p) => <td key={p.id} className="p-2">{hechas.has(`${m.id}:${p.id}`) ? res(m, p.id) : <button type="button" onClick={() => hacer(`${m.id}:${p.id}`)} className="text-xs text-[var(--suave)] underline">medir</button>}</td>)}
                <td className="p-2">
                  <div className="flex flex-col gap-1">
                    {NOTAS.map((n) => (
                      <button key={n} type="button" onClick={() => { setNotas((x) => ({ ...x, [m.id]: n })); setRev(false) }} className="rounded-full border px-2 py-0.5 text-xs font-semibold" style={notas[m.id] === n ? { background: COLOR_NOTA[n], color: '#fff', borderColor: COLOR_NOTA[n] } : {}}>
                        {n}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => setRev(true)} className="min-h-10 rounded-full bg-[var(--acento)] px-5 text-sm font-semibold text-white">Comprobar la clasificación</button>
        {rev && <span className="text-sm font-semibold">{aciertos} de {muestras.length}</span>}
      </div>
      {rev && (
        <ul className="list-disc space-y-1 rounded-2xl bg-[var(--tarjeta)] p-4 pl-8 text-sm">
          {muestras.map((m) => (
            <li key={m.id}><b style={{ color: COLOR_NOTA[m.nota] }}>{m.n}: {m.nota}.</b> {explicar(m)}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

const explicarAgua = (a: Agua) =>
  a.nota === 'buena'
    ? 'Agua clara y fría, con mucho oxígeno y con bichos sensibles (efimerópteros, plecópteros, tricópteros), que solo viven en agua limpia.'
    : a.nota === 'mala'
      ? 'Turbia, con mal olor y poco oxígeno: la materia orgánica de las aguas negras se descompone y gasta el oxígeno. Solo sobreviven bichos tolerantes (larvas rojas, sanguijuelas, tubifex).'
      : a.id === 'charca'
        ? 'El agua quieta se calienta y tiene menos oxígeno; el pH alto suele venir de las algas. No está contaminada, pero no es agua de quebrada limpia.'
        : 'Turbia por la tierra que arrastra la lluvia desde el potrero sin árboles; todavía tiene oxígeno y algunos tricópteros.'

const explicarSuelo = (s: Suelo) =>
  s.nota === 'buena'
    ? 'Textura franca (mezcla de arena, limo y arcilla), mucha materia orgánica, buena infiltración y lombrices: suelo vivo.'
    : s.id === 'potrero'
      ? 'El pisoteo del ganado lo compacta: el agua no entra y se encharca, hay poca vida y el pH es ácido.'
      : 'Casi solo arena: perdió la capa fértil con la erosión. El agua pasa de largo, casi sin materia orgánica ni lombrices.'

export default function Ambiente({ grado }: { grado: number }) {
  const [modo, setModo] = useState<'agua' | 'suelo'>('agua')
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {(['agua', 'suelo'] as const).map((x) => (
          <button key={x} type="button" onClick={() => setModo(x)} className={`min-h-10 rounded-full border px-4 text-sm font-semibold ${modo === x ? 'border-[var(--acento)] bg-[var(--acento)] text-white' : 'border-[var(--linea)] bg-[var(--tarjeta)]'}`}>
            {x === 'agua' ? '1. Calidad del agua' : '2. Calidad del suelo'}
          </button>
        ))}
      </div>
      <p className="rounded-2xl bg-[var(--tarjeta)] p-4 text-sm">
        {modo === 'agua'
          ? 'Muestras de agua de la vereda. Mide cada una (toca «medir» o «Medir» en la columna) y clasifica su calidad. Los macroinvertebrados son bioindicadores: unos solo viven en agua limpia y otros aguantan la contaminación.'
          : 'Muestras de suelo de distintos usos. Mide cada una y clasifica su calidad pensando en si sostiene vida y cultivos y si deja entrar el agua.'}
        {grado >= 9 && modo === 'agua' && ' En Colombia se usa el índice BMWP/Col, que da puntos a cada familia de macroinvertebrados según su sensibilidad.'}
      </p>
      {modo === 'agua'
        ? <Tabla key="a" muestras={AGUAS} pruebas={PRUEBAS_AGUA} res={resultadoAgua} explicar={explicarAgua} />
        : <Tabla key="s" muestras={SUELOS} pruebas={PRUEBAS_SUELO} res={resultadoSuelo} explicar={explicarSuelo} />}
      <p className="text-xs text-[var(--suave)]">
        Valores de ejemplo para practicar la lectura. Para el PRAE, se pueden tomar muestras reales de la quebrada y los suelos del colegio con estas mismas pruebas. ⚠ Al muestrear agua: guantes, nunca en zonas hondas o con creciente, y siempre acompañados; los bichos se devuelven vivos al agua.
      </p>
    </div>
  )
}
