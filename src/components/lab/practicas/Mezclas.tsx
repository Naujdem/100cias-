import { useEffect, useState } from 'react'

// Laboratorio de Química 3 (PLAN-LABORATORIOS.md): mezclas y técnicas de separación.
// Parte 1: retos de separar una mezcla aplicando técnicas en el orden que el estudiante quiera
// (imán, tamiz, agregar agua, filtrar, decantar, evaporar, destilar). El resultado depende del orden.
// Parte 2: cromatografía de tintas de marcador (agua o alcohol). Modelo cualitativo.

const BOTON = (on: boolean) => `rounded-full border px-3 py-1 text-sm font-semibold ${on ? 'border-[var(--acento)] bg-[var(--acento)] text-white' : 'border-[var(--linea)] bg-white'}`

type Comp = 'hierro' | 'piedras' | 'arena' | 'sal' | 'agua' | 'aceite' | 'alcohol'
const NOM: Record<Comp, string> = { hierro: 'limaduras de hierro', piedras: 'piedritas', arena: 'arena', sal: 'sal', agua: 'agua', aceite: 'aceite', alcohol: 'alcohol' }
const COL: Record<Comp, string> = { hierro: '#4a4f57', piedras: '#9b8b78', arena: '#d9b97a', sal: '#ffffff', agua: '#8ec5e8', aceite: '#f2d24b', alcohol: '#e9c6dd' }
const LIQ: Comp[] = ['agua', 'aceite', 'alcohol']
const INSOL: Comp[] = ['hierro', 'piedras', 'arena']

interface Reto { n: string; mezcla: Comp[]; meta: Comp[]; desde: number }
const RETOS: Reto[] = [
  { n: 'Hierro, piedritas, arena y sal', mezcla: ['hierro', 'piedras', 'arena', 'sal'], meta: ['hierro', 'piedras', 'arena', 'sal'], desde: 6 },
  { n: 'Agua y aceite', mezcla: ['agua', 'aceite'], meta: ['agua', 'aceite'], desde: 6 },
  { n: 'Agua de mar: recupera el agua y la sal', mezcla: ['agua', 'sal'], meta: ['agua', 'sal'], desde: 6 },
  { n: 'Agua y alcohol', mezcla: ['agua', 'alcohol'], meta: ['agua', 'alcohol'], desde: 9 },
]

interface Salida { comps: Comp[]; como: string; turbio?: boolean }
interface Estado { vaso: Comp[]; turbio: boolean; salidas: Salida[]; perdido: Comp[]; log: string[] }
const inicio = (r: Reto): Estado => ({ vaso: [...r.mezcla], turbio: false, salidas: [], perdido: [], log: [] })

const TECNICAS = ['Imán', 'Tamiz', 'Agregar agua', 'Filtrar', 'Decantar', 'Evaporar', 'Destilar'] as const

function aplicar(e: Estado, t: number, grado: number): Estado {
  const v = e.vaso
  const tiene = (c: Comp) => v.includes(c)
  const liquido = v.some((c) => LIQ.includes(c))
  const quitar = (cs: Comp[]) => v.filter((c) => !cs.includes(c))
  const sal = (comps: Comp[], como: string, turbio = false): Salida => ({ comps, como, turbio })
  const nuevo = (p: Partial<Estado>, msg: string): Estado => ({ ...e, ...p, log: [...e.log, msg] })
  if (!v.length) return nuevo({}, 'El vaso está vacío.')
  switch (t) {
    case 0:
      return tiene('hierro') ? nuevo({ vaso: quitar(['hierro']), salidas: [...e.salidas, sal(['hierro'], 'imán')] }, 'Imán: se pegan las limaduras de hierro (es magnético).') : nuevo({}, 'Imán: no se pega nada.')
    case 1:
      return tiene('piedras') ? nuevo({ vaso: quitar(['piedras']), salidas: [...e.salidas, sal(['piedras'], 'tamiz')] }, 'Tamiz: las piedritas quedan arriba; lo fino pasa (separación por tamaño).') : nuevo({}, 'Tamiz: todo pasa por la malla.')
    case 2:
      if (tiene('agua')) return nuevo({}, 'Ya hay agua.')
      return nuevo({ vaso: [...v, 'agua'] }, `Agregar agua${tiene('sal') ? ': la sal se disuelve, la arena no.' : '.'}`)
    case 3: {
      if (!liquido) return nuevo({}, '✘ Filtrar: no hay ningún líquido. Para separar la sal de la arena, primero disuélvela en agua.')
      const papel = v.filter((c) => INSOL.includes(c))
      const notas = tiene('aceite') && tiene('agua') ? ' El agua y el aceite pasan juntos por el papel: el filtro no los separa.' : ''
      if (!papel.length) return nuevo({ turbio: false }, `Filtrar: no queda nada en el papel.${notas}`)
      return nuevo({ vaso: quitar(papel), turbio: false, salidas: [...e.salidas, sal(papel, 'filtro (déjalo secar)')] }, `Filtrar: en el papel queda ${papel.map((c) => NOM[c]).join(', ')}; pasa el líquido${tiene('sal') ? ' con la sal disuelta' : ''}.${notas}`)
    }
    case 4: {
      if (tiene('aceite') && tiene('agua')) return nuevo({ vaso: quitar(['aceite']), salidas: [...e.salidas, sal(['aceite'], 'embudo de decantación')] }, 'Decantar con embudo de decantación: el agua (más densa) sale por abajo y se cierra la llave cuando llega el aceite.')
      if (tiene('alcohol') && tiene('agua')) return nuevo({}, '✘ Decantar: el agua y el alcohol se mezclan del todo, no forman capas.')
      const fondo = v.filter((c) => INSOL.includes(c))
      if (liquido && fondo.length) return nuevo({ vaso: quitar(fondo), turbio: fondo.includes('arena'), salidas: [...e.salidas, sal(fondo, 'decantación (fondo)')] }, `Decantar: se deja asentar y se vierte el líquido a otro vaso. En el fondo queda ${fondo.map((c) => NOM[c]).join(', ')}.${fondo.includes('arena') ? ' Algo de arena fina pasó: el líquido quedó turbio.' : ''}`)
      return nuevo({}, 'Decantar: no hay nada que se asiente o forme capas.')
    }
    case 5: {
      if (!liquido) return nuevo({}, 'Evaporar: no hay líquido.')
      const se = v.filter((c) => c === 'agua' || c === 'alcohol')
      const queda = quitar(se)
      const st: Partial<Estado> = { vaso: [], turbio: false, perdido: [...e.perdido, ...se] }
      if (!queda.length) return nuevo(st, `Evaporar: ${se.map((c) => NOM[c]).join(' y ')} se va${se.length > 1 ? 'n' : ''} al aire. No queda nada.`)
      const turb = e.turbio && !queda.includes('arena') ? (['arena'] as Comp[]) : []
      return nuevo({ ...st, salidas: [...e.salidas, sal([...queda, ...turb], 'evaporación')] }, `Evaporar: ${se.map((c) => NOM[c]).join(' y ')} se va al aire y queda ${[...queda, ...turb].map((c) => NOM[c]).join(', ')}.${queda.includes('aceite') ? ' El aceite no se evapora con este calor.' : ''}`)
    }
    case 6: {
      if (!liquido) return nuevo({}, 'Destilar: no hay líquido.')
      if (tiene('alcohol')) return nuevo({ vaso: quitar(['alcohol']), salidas: [...e.salidas, sal(['alcohol'], grado >= 11 ? 'destilación (≈ 95 %, con algo de agua)' : 'destilación')] }, `Destilar: el alcohol hierve primero (78 °C) y se condensa en el refrigerante; el agua (100 °C) queda.${grado >= 11 ? ' En la práctica sale con un poco de agua (mezcla azeotrópica, ≈ 95 %).' : ''}`)
      if (tiene('agua')) {
        const queda = quitar(['agua'])
        const turb = e.turbio && !queda.includes('arena') ? (['arena'] as Comp[]) : []
        const resto = [...queda, ...turb]
        return nuevo({ vaso: [], turbio: false, salidas: [...e.salidas, sal(['agua'], 'destilación'), ...(resto.length ? [sal(resto, 'residuo del balón')] : [])] }, `Destilar: el agua hierve, el vapor se enfría en el refrigerante y cae pura${resto.length ? `; en el balón queda ${resto.map((c) => NOM[c]).join(', ')}` : ''}.`)
      }
      return nuevo({}, 'Destilar: el aceite necesita mucha más temperatura.')
    }
  }
  return e
}

function Puntos({ comps, x, y, w, h }: { comps: Comp[]; x: number; y: number; w: number; h: number }) {
  const solidos = comps.filter((c) => !LIQ.includes(c) && !(c === 'sal' && comps.includes('agua')))
  return <>{solidos.flatMap((c, j) => Array.from({ length: 9 }, (_, k) => <circle key={`${c}${k}`} cx={x + 6 + ((k * 37 + j * 11) % (w - 12))} cy={y + h - 5 - ((k * 7 + j * 5) % Math.max(6, h / 3))} r={c === 'piedras' ? 4.5 : 2.4} fill={COL[c]} stroke="#555" strokeWidth="0.5" />))}</>
}

function Separacion({ grado }: { grado: number }) {
  const retos = RETOS.filter((r) => grado >= r.desde)
  const [ri, setRi] = useState(0)
  const R = retos[ri]
  const [e, setE] = useState<Estado>(() => inicio(R))
  const [ver, setVer] = useState(false)
  const cambiar = (k: number) => { setRi(k); setE(inicio(retos[k])); setVer(false) }
  const usar = (t: number) => { if (!ver) setE((x) => aplicar(x, t, grado)) }
  useEffect(() => {
    const h = (ev: KeyboardEvent) => {
      const k = ev.key.toLowerCase()
      const n = parseInt(k, 10)
      if (n >= 1 && n <= 7) usar(n - 1)
      else if (k === 'q') cambiar((ri + 1) % retos.length)
      else if (k === 'r') { setE(inicio(R)); setVer(false) }
      else if (k === 'enter') setVer(true)
      else return
      ev.preventDefault()
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  })
  const todas: Salida[] = [...e.salidas, ...(e.vaso.length ? [{ comps: e.vaso, como: 'lo que quedó en el vaso', turbio: e.turbio }] : [])]
  const pura = (s: Salida) => s.comps.length === 1 && !s.turbio
  const liq = e.vaso.filter((c) => LIQ.includes(c))
  const capas = liq.includes('agua') && liq.includes('alcohol') ? (['agua'] as Comp[]) : liq // agua y alcohol: una sola fase
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {retos.map((r, k) => <button key={r.n} type="button" onClick={() => cambiar(k)} className={BOTON(k === ri)}>{r.n}</button>)}
      </div>
      <p className="rounded-2xl bg-[var(--tarjeta)] p-4 text-sm">Meta: recuperar <b>{R.meta.map((c) => NOM[c]).join(', ')}</b>, cada cosa pura. Escoge las técnicas en el orden que creas (teclas 1–7); el orden importa. Enter comprueba, R empieza de nuevo, Q cambia de reto.</p>
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <svg viewBox="0 0 560 220" className="w-full rounded-2xl border border-[var(--linea)] bg-[#f4f1ea]" role="img" aria-label="Vaso con la mezcla y lo que se ha separado">
          <rect x="0" y="205" width="560" height="15" fill="#b98d5e" />
          {/* vaso principal */}
          {capas.map((c, k) => {
            const h = capas.length === 1 ? 100 : 50
            const yy = 200 - h * (k + 1) // el agua abajo, el aceite arriba
            const color = c === 'agua' && liq.includes('alcohol') ? '#c4c9ea' : COL[c]
            return <rect key={c} x="42" y={yy} width="116" height={h} fill={color} opacity={e.turbio ? 1 : 0.7} />
          })}
          {e.turbio && <rect x="42" y={100} width="116" height={100} fill="#c8a970" opacity="0.35" />}
          <Puntos comps={e.vaso} x={42} y={150} w={116} h={50} />
          <path d="M40 60 V202 H160 V60" fill="none" stroke="#555" strokeWidth="3" />
          <text x="100" y="50" textAnchor="middle" fontSize="12" fill="#333">{e.vaso.length ? e.vaso.map((c) => NOM[c]).join(' + ') : 'vacío'}</text>
          {/* lo separado: vidrios de reloj */}
          {e.salidas.map((s, k) => {
            const x = 200 + (k % 4) * 90
            const y = k < 4 ? 70 : 150
            return (
              <g key={k}>
                <path d={`M${x} ${y} q40 22 80 0`} fill={s.comps.some((c) => LIQ.includes(c)) ? COL[s.comps.find((c) => LIQ.includes(c))!] : 'none'} stroke="#555" strokeWidth="2" />
                <Puntos comps={s.comps} x={x + 8} y={y - 4} w={64} h={14} />
                <text x={x + 40} y={y + 28} textAnchor="middle" fontSize="10" fill="#333">{s.comps.map((c) => NOM[c]).join(' + ')}</text>
              </g>
            )
          })}
          {e.perdido.length > 0 && <text x="200" y="200" fontSize="11" fill="#b5462c">Al aire: {e.perdido.map((c) => NOM[c]).join(', ')}</text>}
        </svg>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex flex-wrap gap-2">
            {TECNICAS.map((t, k) => <button key={t} type="button" onClick={() => usar(k)} className={BOTON(false)}>{k + 1} · {t}</button>)}
          </div>
          <ol className="list-decimal rounded-xl bg-[var(--tarjeta)] p-3 pl-7">
            {e.log.length ? e.log.map((m, k) => <li key={k} className={m.startsWith('✘') ? 'text-[#b5462c]' : ''}>{m}</li>) : <li className="list-none text-[var(--suave)]">Todavía no has hecho nada.</li>}
          </ol>
          <div className="flex gap-2">
            <button type="button" onClick={() => setVer(true)} className="min-h-10 rounded-full bg-[var(--acento)] px-5 font-semibold text-white">Comprobar</button>
            <button type="button" onClick={() => { setE(inicio(R)); setVer(false) }} className="min-h-10 rounded-full border border-[var(--linea)] px-4 font-semibold">Empezar de nuevo</button>
          </div>
        </div>
      </div>
      {ver && (
        <div className="rounded-xl bg-[var(--tarjeta)] p-3 text-sm">
          {R.meta.map((c) => {
            const s = todas.find((x) => x.comps.includes(c))
            const ok = s && pura(s)
            return <p key={c} className={ok ? 'text-[#1e8449]' : 'text-[#b5462c]'}>{ok ? '✔' : '✘'} {NOM[c]}: {ok ? `pura (${s!.como}).` : e.perdido.includes(c) ? 'se perdió al evaporar.' : s ? `quedó revuelta con ${s.comps.filter((x) => x !== c).map((x) => NOM[x]).join(', ') || 'arena fina'} (${s.como}).` : 'no la recuperaste.'}</p>
          })}
          <p className="mt-2 rounded-lg bg-[#eaf5ee] p-2"><b>Cada técnica aprovecha una diferencia:</b> el imán, el magnetismo; el tamiz, el tamaño; disolver y filtrar, la solubilidad; decantar, la densidad; evaporar y destilar, el punto de ebullición. Para la mezcla 1 un buen orden es imán, tamiz, agregar agua, filtrar y evaporar.{grado >= 9 ? ' Si quieres el agua y la sal, destila en vez de evaporar.' : ''}</p>
        </div>
      )}
    </div>
  )
}

// ---------- Parte 2: cromatografía de tintas ----------
interface Tinta { n: string; bandas: { c: string; rf: number }[]; permanente?: boolean }
const TINTAS: Tinta[] = [
  { n: 'Marcador negro', bandas: [{ c: '#f2c230', rf: 0.85 }, { c: '#d9406a', rf: 0.6 }, { c: '#3a63c4', rf: 0.35 }] },
  { n: 'Marcador café', bandas: [{ c: '#f08a24', rf: 0.75 }, { c: '#7a3c8c', rf: 0.4 }] },
  { n: 'Marcador verde', bandas: [{ c: '#f2d230', rf: 0.8 }, { c: '#2a7fc0', rf: 0.45 }] },
  { n: 'Marcador morado', bandas: [{ c: '#e0457a', rf: 0.7 }, { c: '#3a4fc4', rf: 0.5 }] },
  { n: 'Marcador permanente negro', bandas: [{ c: '#6a3fa0', rf: 0.7 }, { c: '#2b2b5c', rf: 0.5 }], permanente: true },
]

function Cromatografia({ grado }: { grado: number }) {
  const [ti, setTi] = useState(0)
  const [alcohol, setAlcohol] = useState(false)
  const [t, setT] = useState(0)
  const T = TINTAS[ti]
  const corre = !T.permanente || alcohol
  const frente = Math.min(1, t / 10) // fracción recorrida por el solvente
  const Y0 = 200, Y1 = 40
  const yFrente = Y0 - (Y0 - Y1) * frente
  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-2xl bg-[var(--tarjeta)] p-4 text-sm">Un punto de tinta sobre papel filtro, con la punta en el solvente. El solvente sube y arrastra cada colorante a distinta velocidad: los que se pegan menos al papel llegan más lejos. Así se ve que una tinta es una <b>mezcla</b>.</p>
      <div className="flex flex-wrap gap-2">
        {TINTAS.map((x, k) => <button key={x.n} type="button" onClick={() => { setTi(k); setT(0) }} className={BOTON(k === ti)}>{x.n}</button>)}
      </div>
      <div className="grid gap-4 md:grid-cols-[220px_1fr]">
        <svg viewBox="0 0 160 240" className="w-full rounded-2xl border border-[var(--linea)] bg-[#f4f1ea]" role="img" aria-label="Tira de papel en el solvente">
          <rect x="30" y="212" width="100" height="24" fill={alcohol ? '#e9e3f2' : '#cfe6f5'} />
          <rect x="60" y="20" width="40" height="205" fill="#fff" stroke="#999" />
          <rect x="60" y={yFrente} width="40" height={225 - yFrente} fill={alcohol ? '#efe9f7' : '#e3f1fb'} opacity="0.9" style={{ transition: 'all 0.6s' }} />
          {t > 0 && <line x1="58" x2="102" y1={yFrente} y2={yFrente} stroke="#2f6d99" strokeDasharray="3 3" />}
          {corre ? T.bandas.map((b) => <ellipse key={b.c} cx="80" cy={Y0 - (Y0 - Y1) * frente * b.rf} rx="10" ry={4 + 6 * frente} fill={b.c} opacity="0.85" style={{ transition: 'all 0.6s' }} />)
            : <circle cx="80" cy={Y0} r="6" fill="#222" />}
          {t === 0 && <circle cx="80" cy={Y0} r="6" fill="#222" />}
          <line x1="56" x2="104" y1={Y0} y2={Y0} stroke="#888" strokeDasharray="2 2" />
        </svg>
        <div className="flex flex-col gap-2 text-sm">
          <p>Solvente: <button type="button" disabled={t > 0} onClick={() => setAlcohol(false)} className={BOTON(!alcohol)}>agua</button> <button type="button" disabled={t > 0} onClick={() => setAlcohol(true)} className={BOTON(alcohol)}>alcohol</button></p>
          <div className="flex gap-2">
            <button type="button" disabled={t >= 10} onClick={() => setT((x) => x + 2)} className="min-h-10 rounded-full bg-[var(--acento)] px-5 font-semibold text-white disabled:opacity-50">Esperar 2 min</button>
            <button type="button" onClick={() => setT(0)} className="min-h-10 rounded-full border border-[var(--linea)] px-4 font-semibold">Nueva tira</button>
          </div>
          {t >= 10 && <div className="rounded-xl bg-[var(--tarjeta)] p-3">
            {corre ? <p>La tinta tenía <b>{T.bandas.length} colorantes</b>. {grado >= 11 ? `Rf = distancia del color ÷ distancia del solvente; el más alto aquí es ${T.bandas[0].rf.toLocaleString('es-CO')}.` : 'El que sube más es el que menos se pega al papel.'}</p>
              : <p>✘ La tinta permanente no se disuelve en agua: no se movió. Prueba con alcohol.</p>}
          </div>}
          <p className="text-xs text-[var(--suave)]">Los colores de cada marcador cambian según la marca: son de ejemplo.</p>
        </div>
      </div>
    </div>
  )
}

export default function Mezclas({ grado }: { grado: number }) {
  const [parte, setParte] = useState(0)
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {['1. Separa la mezcla', '2. Cromatografía de tintas'].map((t, k) => <button key={t} type="button" onClick={() => setParte(k)} className={BOTON(parte === k)}>{t}</button>)}
      </div>
      {parte === 0 ? <Separacion key={grado} grado={grado} /> : <Cromatografia grado={grado} />}
      <p className="text-xs text-[var(--suave)]">Versión casera: imán, colador, filtro de café, un frasco para decantar, una olla para evaporar y tiras de filtro de café con marcadores. La destilación se puede armar con una olla y una tapa fría (siempre con un adulto).</p>
    </div>
  )
}
