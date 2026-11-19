import { useEffect, useState } from 'react'
import MesaViva from '../MesaViva.tsx'
import type { Pieza, Uso } from '../MesaViva.tsx'
import MicroscopioPanel from '../MicroscopioPanel.tsx'
import { desenfoque } from './Microscopio.tsx'
import type { Est } from './Microscopio.tsx'
import { Balanza, Caneca, Cubreobjetos, Elodea, Gotero, MicroscopioMini, PapelAbsorbente, Portaobjetos, Reloj, TirasPapa, Vaso } from '../dibujos.tsx'

// Laboratorio de Biología (PLAN-LABORATORIOS.md): ósmosis, en mesa viva («como Tinciones»).
// A) Elodea: hoja + gota del medio + cubreobjetos; el medio se cambia por el borde (gota y papel absorbente).
//    Se observa en el MicroscopioPanel; el tiempo corre acelerado (×6) y la plasmólisis avanza sola.
// B) Papa: pesar cada tira, ponerla en su vaso, esperar 30 min (acelerado: 1 s = 1 min), sacarla, secarla
//    con papel y pesarla. Tabla, gráfica y punto isotónico.

const MEDIOS = [
  { id: 'm0', c: 0, t: 'Agua destilada', e: 'AGUA' },
  { id: 'm09', c: 0.9, t: 'Sal 0,9 %', e: '0,9 %' },
  { id: 'm3', c: 3, t: 'Sal 3 %', e: '3 %' },
  { id: 'm10', c: 10, t: 'Sal 10 %', e: '10 %' },
]
const nombreMedio = (c: number) => MEDIOS.find((m) => m.c === c)?.t ?? ''

/** tamaño al que tiende el protoplasto en cada medio (1 = pegado a la pared) */
const meta = (c: number) => (c <= 0.9 ? 1 : Math.max(0.45, 1 - 0.065 * (c - 0.9)))

/** células de elodea (300 × 300, vistas a 40x) */
function celdasElodea(s: number) {
  const celdas = []
  for (let f = 0; f < 3; f++)
    for (let k = 0; k < 3; k++) {
      const x = 20 + k * 90 - (f % 2) * 30
      const y = 30 + f * 80
      const w = 84
      const h = 74
      const pw = w * s - 6
      const ph = h * (0.55 + 0.45 * s) - 6
      const px = x + (w - pw) / 2
      const py = y + (h - ph) / 2
      const n = 12
      celdas.push(
        <g key={`${f}-${k}`}>
          <rect x={x} y={y} width={w} height={h} fill="#eef6e4" stroke="#6e8f45" strokeWidth="4" />
          <rect x={px} y={py} width={pw} height={ph} rx={s < 0.98 ? 16 : 2} fill="#dcefc4" stroke="#7aa84a" strokeWidth="1" />
          {Array.from({ length: n }, (_, j) => {
            const per = 2 * (pw + ph)
            let d = (j / n) * per
            let cx = px, cy = py
            if (d < pw) cx = px + d
            else if ((d -= pw) < ph) { cx = px + pw; cy = py + d }
            else if ((d -= ph) < pw) { cx = px + pw - d; cy = py + ph }
            else { d -= pw; cy = py + ph - d }
            return <ellipse key={j} cx={cx + (cx < px + pw / 2 ? 5 : -5)} cy={cy + (cy < py + ph / 2 ? 5 : -5)} rx="4.5" ry="3" fill="#3f8f2f" />
          })}
        </g>,
      )
    }
  return <g>{celdas}</g>
}

interface SE { hoja: boolean; c: number | null; cubre: boolean; pendiente: number | null; s: number; min: number; ver: boolean }
const VACIA: SE = { hoja: false, c: null, cubre: false, pendiente: null, s: 1, min: 0, ver: false }

function ElodeaLab({ grado }: { grado: number }) {
  const [e, setE] = useState<SE>(VACIA)
  const [est, setEst] = useState<Est | null>(null)
  const corre = e.hoja && e.c !== null
  useEffect(() => {
    if (!corre) return
    // acelerado ×6: cada segundo real son 0,1 min
    const id = window.setInterval(() => setE((x) => (x.c === null ? x : { ...x, min: x.min + 0.1, s: x.s + (meta(x.c) - x.s) * (0.1 / 6) })), 1000)
    return () => window.clearInterval(id)
  }, [corre])
  const cambiar = (p: Partial<SE>) => setE((x) => ({ ...x, ...p }))
  const piezas: Pieza[] = [
    { id: 'elodea', nombre: 'Elodea', x: 70, y: 330, ancho: 60, alto: 80, tomable: true, dibujo: <Elodea /> },
    ...MEDIOS.map((m, k) => ({ id: m.id, nombre: `Gotero: ${m.t}`, x: 150 + k * 70, y: 312, ancho: 50, alto: 96, tomable: true, color: '#a9d3f5', dibujo: <Gotero color={`rgba(169,211,245,${0.5 + m.c / 25})`} etiqueta={m.e} /> })),
    { id: 'cubre', nombre: 'Cubreobjetos', x: 450, y: 350, ancho: 60, alto: 30, tomable: true, dibujo: <Cubreobjetos /> },
    { id: 'papel', nombre: 'Papel absorbente', x: 530, y: 350, ancho: 70, alto: 40, tomable: true, dibujo: <PapelAbsorbente /> },
    { id: 'lamina', nombre: 'Portaobjetos', x: 650, y: 345, ancho: 130, alto: 30, tomable: true, dibujo: <Portaobjetos muestra={e.hoja ? '#7fbf5a' : undefined} charco={e.c !== null ? '#a9d3f5' : undefined} cubre={e.cubre} /> },
    { id: 'micro', nombre: 'Microscopio', x: 860, y: 290, ancho: 90, alto: 140, dibujo: <MicroscopioMini lamina={e.ver} /> },
    { id: 'caneca', nombre: 'Residuos', x: 955, y: 325, ancho: 54, alto: 76, dibujo: <Caneca /> },
  ]
  const destinos = (de: string) => (de === 'lamina' ? ['micro', 'caneca'] : e.ver ? ['lamina', 'micro'] : ['lamina'])
  const soltar = (de: string, en: string): Uso | string => {
    if (de === 'lamina') {
      if (en === 'micro') return e.hoja && e.cubre ? { anim: 'poner', hecho: () => cambiar({ ver: true }) } : 'Primero arma la lámina: hoja, gota del medio y cubreobjetos.'
      if (en === 'caneca') return { anim: 'poner', hecho: () => { setE(VACIA); setEst(null) } }
      return 'Lleva la lámina al microscopio o a la caneca.'
    }
    if (en !== 'lamina' && !(en === 'micro' && e.ver)) return 'Eso se usa sobre la lámina.'
    const medio = MEDIOS.find((m) => m.id === de)
    if (de === 'elodea') {
      if (e.hoja) return 'Ya tiene una hoja.'
      if (e.cubre) return 'Ya está cubierta.'
      return { anim: 'poner', hecho: () => cambiar({ hoja: true }) }
    }
    if (medio) {
      if (!e.cubre) {
        if (e.c !== null) return 'Ya tiene una gota. Para cambiar el medio, cubre la hoja y pon la gota nueva en el borde del cubreobjetos.'
        return { anim: 'gotas', gotas: 1, hecho: () => cambiar({ c: medio.c, min: 0 }) }
      }
      return { anim: 'gotas', gotas: 2, hecho: () => cambiar({ pendiente: medio.c }) }
    }
    if (de === 'cubre') {
      if (e.cubre) return 'Ya tiene cubreobjetos.'
      if (!e.hoja || e.c === null) return 'Primero la hoja y una gota del medio: el cubreobjetos va encima.'
      return { anim: 'poner', hecho: () => cambiar({ cubre: true }) }
    }
    if (de === 'papel') {
      if (!e.cubre) return 'El papel se acerca al borde del cubreobjetos, en el lado contrario a la gota nueva.'
      if (e.pendiente === null) return 'No hay gota nueva en el borde: primero pon el otro medio con su gotero.'
      return { anim: 'frotar', hecho: () => cambiar({ c: e.pendiente, pendiente: null, min: 0 }) }
    }
    return 'No se puede.'
  }
  const listo = e.ver && !!est && est.obj >= 2 && !est.rota && desenfoque(est) < 1.2
  const estado = e.s > 0.97 ? 'turgentes: el protoplasto llena la célula y empuja la pared' : e.s > 0.8 ? 'empezando la plasmólisis: la membrana se despega de la pared' : 'plasmolizadas: el protoplasto se encogió y se separó de la pared'
  return (
    <div className="flex flex-col gap-3">
      <p className="rounded-2xl bg-[var(--tarjeta)] p-4 text-sm">
        Pon una hoja de elodea en la lámina con una gota del medio y cúbrela. Llévala al microscopio y enfoca con 40x. Para <b>cambiar el medio</b> sin mover la lámina: pon la gota nueva en un borde del cubreobjetos y acerca el papel absorbente al borde contrario para que la arrastre.
      </p>
      <MesaViva desde={190} piezas={piezas} destinos={destinos} soltar={soltar} />
      {e.c !== null && e.hoja && (
        <p className="text-sm">Medio: <b>{nombreMedio(e.c)}</b> · <b>{e.min.toFixed(1).replace('.', ',')} min</b> en este medio <span className="text-[var(--suave)]">(acelerado: 1 s = 6 s)</span>{e.pendiente !== null ? <b className="ml-2 text-[#b5462c]">Gota de {nombreMedio(e.pendiente).toLowerCase()} en el borde: pásala con el papel.</b> : null}</p>
      )}
      {e.ver && <MicroscopioPanel grado={grado} muestra={celdasElodea(e.s)} velo={{ color: '#dcebfa', opacidad: Math.min(0.4, (e.c ?? 0) / 20) }} onEstado={setEst} />}
      {e.ver && !listo && <p className="text-sm font-semibold">Enfoca la hoja con el objetivo de 40x (400x).</p>}
      {listo && e.c !== null && (
        <div className="rounded-xl border-2 border-[var(--acento)] p-3 text-sm">
          <p>Las células están <b>{estado}</b>.</p>
          <p className="mt-1 text-[var(--suave)]">
            {e.c === 0 ? 'Agua destilada: medio hipotónico, el agua entra a la célula. La pared evita que la célula vegetal reviente.' : e.c <= 0.9 ? 'Para una célula vegetal, este medio todavía tiene menos sal que su interior: casi no cambia.' : 'Medio hipertónico: el agua sale de la vacuola por ósmosis y el protoplasto se encoge. ¿Qué pasa si cambias por agua destilada?'}
          </p>
        </div>
      )}
    </div>
  )
}

// ---------- papa ----------

const CONC = [0, 1, 2, 5, 10]
/** cambio de masa (%) de una tira de papa en sal al c %, en 30 min; punto isotónico ≈ 0,9 % */
const cambio = (c: number) => (15 * (0.9 - c)) / (0.9 + c)
const RUIDO = [0.6, -0.4, 0.3, -0.5, 0.4]
const MASA0 = [5.12, 4.98, 5.07, 5.21, 4.93]
const f = (x: number, d = 2) => x.toLocaleString('es-CO', { minimumFractionDigits: d, maximumFractionDigits: d })

/** una tira: masa inicial, en qué vaso está, minutos dentro, y su pesada final */
interface Tira { m0: number; vaso: number | null; t: number; fuera: boolean; mojada: boolean; final: number | null }
type EnBalanza = null | { k: number; fase: 'inicial' | 'final' }

function masaFinal(x: Tira) {
  const v = x.vaso ?? 0
  const pct = cambio(CONC[v]) * Math.min(1.3, x.t / 30) + RUIDO[v] * Math.min(1, x.t / 30)
  return x.m0 * (1 + pct / 100) + (x.mojada ? 0.18 : 0)
}

function Papa({ grado }: { grado: number }) {
  const [tiras, setTiras] = useState<Tira[]>([])
  const [bal, setBal] = useState<EnBalanza>(null)
  const [enPapel, setEnPapel] = useState<number | null>(null)
  const [cuenta, setCuenta] = useState(0)
  const [alarma, setAlarma] = useState(false)
  const [resp, setResp] = useState('')
  const [rev, setRev] = useState(false)
  const remojando = tiras.some((x) => x.vaso !== null && !x.fuera)
  useEffect(() => {
    // acelerado: cada segundo real es 1 minuto
    const id = window.setInterval(() => {
      if (remojando) setTiras((ts) => ts.map((x) => (x.vaso !== null && !x.fuera ? { ...x, t: x.t + 1 } : x)))
      setCuenta((c) => { if (c === 1) setAlarma(true); return Math.max(0, c - 1) })
    }, 1000)
    return () => window.clearInterval(id)
  }, [remojando])
  const enVaso = (v: number) => tiras.findIndex((x) => x.vaso === v)
  const quedan = MASA0.length - tiras.length
  const lectura = bal ? `${f(bal.fase === 'inicial' ? tiras[bal.k].m0 : tiras[bal.k].final ?? 0)} g` : '0,00 g'
  const ponerFinal = (k: number, mojada: boolean) =>
    setTiras((ts) => ts.map((x, i) => (i === k ? { ...x, fuera: true, mojada, final: masaFinal({ ...x, mojada }) } : x)))
  const piezas: Pieza[] = [
    { id: 'tiras', nombre: `Tiras de papa (${quedan})`, x: 60, y: 340, ancho: 76, alto: 60, tomable: quedan > 0, dibujo: <TirasPapa n={quedan} /> },
    { id: 'balanza', nombre: 'Balanza', x: 165, y: 350, ancho: 92, alto: 40, dibujo: <Balanza lectura={lectura} /> },
    ...(bal ? [{ id: 'tira-bal', nombre: 'Tira sobre la balanza', x: 165, y: 330, ancho: 60, alto: 20, tomable: true, dibujo: <path d="M-22 0 q22 -6 44 0" stroke="#e9d9a0" strokeWidth="8" fill="none" strokeLinecap="round" /> }] : []),
    ...CONC.map((c, v) => {
      const k = enVaso(v)
      const x = k >= 0 ? tiras[k] : null
      const dentro = !!x && !x.fuera
      const pct = x ? cambio(c) * Math.min(1.3, x.t / 30) : 0
      return {
        id: `vaso${v}`, nombre: `Vaso con sal al ${c} %`, x: 285 + v * 95, y: 330, ancho: 76, alto: 100, tomable: dentro,
        dibujo: <Vaso color={`rgba(169,211,245,${0.5 + c / 25})`} etiqueta={`${c} %`} tira={dentro ? { largo: 34 * (1 + pct / 200), blanda: pct < -4 } : undefined} minutos={x ? x.t : undefined} />,
      }
    }),
    { id: 'papel', nombre: 'Papel absorbente', x: 790, y: 355, ancho: 70, alto: 40, tomable: enPapel !== null, dibujo: <g><PapelAbsorbente />{enPapel !== null && <path d="M-20 -2 q20 -6 40 0" stroke="#e9d9a0" strokeWidth="8" fill="none" strokeLinecap="round" />}</g> },
    { id: 'reloj', nombre: 'Temporizador (toca: +5 min)', x: 880, y: 300, ancho: 72, alto: 72, alTocar: () => { setAlarma(false); setCuenta((c) => c + 5) }, dibujo: <Reloj s={cuenta * 60} alarma={alarma} aviso="¡Sácalas!" /> },
    { id: 'caneca', nombre: 'Residuos', x: 960, y: 325, ancho: 54, alto: 76, dibujo: <Caneca /> },
  ]
  const destinos = (de: string) => {
    if (de === 'tiras' || de === 'papel') return ['balanza']
    if (de === 'tira-bal') return bal?.fase === 'inicial' ? CONC.map((_, v) => `vaso${v}`) : ['caneca']
    if (de.startsWith('vaso')) return ['papel', 'balanza']
    return []
  }
  const soltar = (de: string, en: string): Uso | string => {
    if (de === 'tiras') {
      if (en !== 'balanza') return 'Cada tira se pesa primero en la balanza.'
      if (bal) return 'La balanza está ocupada: primero quita la tira que tiene.'
      return { anim: 'poner', hecho: () => { setTiras((ts) => [...ts, { m0: MASA0[ts.length], vaso: null, t: 0, fuera: false, mojada: false, final: null }]); setBal({ k: tiras.length, fase: 'inicial' }) } }
    }
    if (de === 'tira-bal' && bal) {
      if (bal.fase === 'final') return en === 'caneca' ? { anim: 'poner', hecho: () => setBal(null) } : 'Ya la pesaste: bótala en la caneca.'
      const v = parseInt(en.replace('vaso', ''), 10)
      if (Number.isNaN(v)) return 'Ponla en uno de los vasos.'
      if (enVaso(v) >= 0) return 'Ese vaso ya tiene su tira: una por vaso.'
      const k = bal.k
      return { anim: 'poner', hecho: () => { setTiras((ts) => ts.map((x, i) => (i === k ? { ...x, vaso: v } : x))); setBal(null) } }
    }
    if (de.startsWith('vaso')) {
      const k = enVaso(parseInt(de.replace('vaso', ''), 10))
      if (en === 'papel') {
        if (enPapel !== null) return 'Ya hay una tira en el papel: pésala primero.'
        return { anim: 'verter', hecho: () => { setTiras((ts) => ts.map((x, i) => (i === k ? { ...x, fuera: true } : x))); setEnPapel(k) } }
      }
      if (en === 'balanza') {
        if (bal) return 'La balanza está ocupada.'
        return { anim: 'verter', hecho: () => { ponerFinal(k, true); setBal({ k, fase: 'final' }) } }
      }
    }
    if (de === 'papel' && enPapel !== null) {
      if (bal) return 'La balanza está ocupada.'
      const k = enPapel
      return { anim: 'poner', hecho: () => { ponerFinal(k, false); setEnPapel(null); setBal({ k, fase: 'final' }) } }
    }
    return 'No se puede.'
  }
  // tabla por vaso
  const fila = CONC.map((_, v) => tiras.find((x) => x.vaso === v) ?? null)
  const pct = fila.map((x) => (x && x.final !== null ? ((x.final - x.m0) / x.m0) * 100 : 0))
  const todas = fila.every((x) => x && x.final !== null)
  const ayudas = grado < 11
  const num = parseFloat(resp.replace(',', '.'))
  const X = (c: number) => 40 + (c / 10) * 240
  const Y = (p: number) => 100 - p * 4.5
  const avisos = [
    ...(fila.some((x) => x?.mojada) ? ['Algunas tiras se pesaron sin secar: el agua pegada suma masa. Se secan con papel antes de pesarlas.'] : []),
    ...(fila.some((x) => x && x.final !== null && x.t < 25) ? ['Sacaste alguna tira antes de los 30 min: el cambio quedó más pequeño que en las demás.'] : []),
  ]
  return (
    <div className="flex flex-col gap-3">
      <p className="rounded-2xl bg-[var(--tarjeta)] p-4 text-sm">
        Pesa cada tira de papa en la balanza y ponla en un vaso (agua con distinta cantidad de sal). Deja que pasen <b>30 minutos</b> (acelerado: 1 s = 1 min; usa el temporizador). Luego sácala al papel absorbente para secarla y pésala de nuevo. <b>¿En qué concentración la papa no gana ni pierde agua?</b>
      </p>
      <MesaViva desde={190} piezas={piezas} destinos={destinos} soltar={soltar} />
      <div className="overflow-x-auto">
        <table className="w-full max-w-2xl rounded-xl bg-[var(--tarjeta)] text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="p-2">Sal</th><th className="p-2">Masa inicial</th><th className="p-2">Tiempo</th><th className="p-2">Masa final</th>{(ayudas || rev) && <th className="p-2">Cambio</th>}<th className="p-2">Al tacto</th>
            </tr>
          </thead>
          <tbody>
            {CONC.map((c, v) => {
              const x = fila[v]
              const listo = !!x && x.final !== null
              return (
                <tr key={c} className="border-b last:border-0">
                  <td className="p-2 font-semibold">{c} %</td>
                  <td className="p-2">{x ? `${f(x.m0)} g` : ''}</td>
                  <td className="p-2">{x ? `${x.t} min` : ''}</td>
                  <td className="p-2">{listo ? `${f(x.final ?? 0)} g` : ''}</td>
                  {(ayudas || rev) && <td className="p-2 font-bold">{listo ? `${pct[v] >= 0 ? '+' : ''}${f(pct[v], 1)} %` : ''}</td>}
                  <td className="p-2">{listo ? (pct[v] > 3 ? 'dura, crujiente' : pct[v] < -3 ? 'blanda, se dobla' : 'casi igual') : ''}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {ayudas && <p className="mt-1 text-xs text-[var(--suave)]">Cambio (%) = (masa final − masa inicial) ÷ masa inicial × 100</p>}
      </div>
      {todas && avisos.length > 0 && <ul className="list-disc rounded-xl border-2 border-[#b5462c] bg-[#fbeee9] p-3 pl-8 text-sm">{avisos.map((a) => <li key={a}>{a}</li>)}</ul>}
      {todas && (
        <div className="grid items-start gap-4 md:grid-cols-[320px_1fr]">
          <svg viewBox="0 0 300 200" className="w-full rounded-xl bg-white" role="img" aria-label="Gráfica de cambio de masa">
            <line x1="40" y1={Y(0)} x2="285" y2={Y(0)} stroke="#333" />
            <line x1="40" y1="20" x2="40" y2="180" stroke="#333" />
            {[-15, -10, -5, 5, 10, 15].map((p) => <text key={p} x="34" y={Y(p) + 4} textAnchor="end" fontSize="9">{p}</text>)}
            {CONC.map((c) => <text key={c} x={X(c)} y="195" textAnchor="middle" fontSize="9">{c}</text>)}
            <text x="285" y={Y(0) - 4} textAnchor="end" fontSize="9">% sal</text>
            <text x="44" y="16" fontSize="9">% cambio de masa</text>
            {(ayudas || rev) && <polyline points={CONC.map((c, k) => `${X(c)},${Y(pct[k])}`).join(' ')} fill="none" stroke="var(--acento)" strokeWidth="2" />}
            {CONC.map((c, k) => <circle key={c} cx={X(c)} cy={Y(pct[k])} r="4" fill="var(--acento)" />)}
            {rev && <line x1={X(0.9)} x2={X(0.9)} y1="20" y2="180" stroke="#2e7d5a" strokeDasharray="4 3" />}
          </svg>
          <div className="flex flex-col gap-2 text-sm">
            <label className="font-semibold">
              ¿En qué % de sal la papa no cambiaría su masa? (lee dónde la línea cruza el 0)
              <span className="mt-1 flex items-center gap-1"><input value={resp} onChange={(e) => setResp(e.target.value)} className="w-20 rounded-lg border border-[var(--linea)] bg-white px-2 py-1 text-right" /> %</span>
            </label>
            <button type="button" onClick={() => setRev(true)} className="w-fit min-h-10 rounded-full bg-[var(--acento)] px-5 font-semibold text-white">Comprobar</button>
            {rev && (
              <div className={`rounded-xl border-2 p-3 ${Math.abs(num - 0.9) <= 0.5 ? 'border-[#2e7d5a] bg-[#eaf5ee]' : 'border-[#b5462c] bg-[#fbeee9]'}`}>
                <p><b>{Math.abs(num - 0.9) <= 0.5 ? '¡Bien leído!' : 'No exactamente.'}</b> La línea cruza el cero cerca de 0,9 % de sal: ahí el medio es <b>isotónico</b> con las células de la papa.</p>
                <p className="mt-1">Por debajo (hipotónico) el agua entra y la papa gana masa y se pone dura; por encima (hipertónico) el agua sale, pierde masa y se ablanda.{grado >= 9 ? ' Por eso el suero que va a la sangre tiene 0,9 % de sal: no hincha ni encoge los glóbulos rojos.' : ''}</p>
              </div>
            )}
          </div>
        </div>
      )}
      <p className="text-xs text-[var(--suave)]">Versión casera: tiras de papa, vasos, sal de cocina y balanza de cocina; también se puede medir el largo con una regla.</p>
    </div>
  )
}

export default function Osmosis({ grado }: { grado: number }) {
  const [modo, setModo] = useState<'elodea' | 'papa'>('elodea')
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {(['elodea', 'papa'] as const).map((m) => (
          <button key={m} type="button" onClick={() => setModo(m)} className={`min-h-10 rounded-full border px-4 text-sm font-semibold ${modo === m ? 'border-[var(--acento)] bg-[var(--acento)] text-white' : 'border-[var(--linea)] bg-[var(--tarjeta)]'}`}>
            {m === 'elodea' ? '1. Plasmólisis en elodea' : '2. Papa en agua con sal'}
          </button>
        ))}
      </div>
      {modo === 'elodea' ? <ElodeaLab grado={grado} /> : <Papa grado={grado} />}
    </div>
  )
}
