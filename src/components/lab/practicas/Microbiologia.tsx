import { useEffect, useMemo, useState } from 'react'
import MesaViva from '../MesaViva.tsx'
import type { Pieza, Uso } from '../MesaViva.tsx'
import { Caneca } from '../dibujos.tsx'

// Laboratorio de Biología (PLAN-LABORATORIOS.md): microbiología, en mesa viva («como Tinciones»).
// 1) ¿Dónde hay más microbios? La técnica aséptica se hace con los objetos (alcohol a la mesa, guantes,
//    tapabocas, mechero), un hisopo nuevo por caja (tomar de la caja de hisopos, frotar la fuente, sembrar,
//    botar), la caja del aire se abre 10 min, cinta para sellar, voltear y a la incubadora. Los días corren
//    (acelerado: 1 s = 2 h) y se cuentan las colonias tocándolas.
// 2) ¿Qué los detiene? Césped con el hisopo, discos de cada sustancia, incubadora y regla.

const FUENTES = [
  { id: 'sucias', n: 'Manos sin lavar', b: 42, h: 2 },
  { id: 'limpias', n: 'Manos lavadas con jabón', b: 7, h: 0 },
  { id: 'celular', n: 'Pantalla del celular', b: 24, h: 1 },
  { id: 'moneda', n: 'Moneda', b: 11, h: 1 },
  { id: 'aire', n: 'Aire (caja abierta 10 min)', b: 5, h: 2 },
  { id: 'control', n: 'Control (sin abrir)', b: 0, h: 0 },
]

/** generador pseudoaleatorio con semilla, para que cada caja salga igual cada vez */
function azar(semilla: number) {
  let s = semilla
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

interface Colonia { x: number; y: number; hongo: boolean; color: string; corrida: boolean }

function colonias(k: number, nb: number, nh: number, corridas: boolean): Colonia[] {
  const r = azar(k * 977 + 13)
  const out: Colonia[] = []
  const col = ['#f4ecd2', '#f2e2a0', '#fbfbf5', '#f0c86a', '#e9d8c0']
  for (let i = 0; i < nb + nh; i++) {
    const a = r() * Math.PI * 2
    const d = Math.sqrt(r()) * 40
    out.push({ x: 50 + Math.cos(a) * d, y: 50 + Math.sin(a) * d, hongo: i >= nb, color: col[Math.floor(r() * col.length)], corrida: corridas && r() < 0.3 })
  }
  return out
}

function Caja({ cols, dia, temp, onTocar, marcadas, tam = 150 }: { cols: Colonia[]; dia: number; temp: number; onTocar?: (i: number) => void; marcadas?: Set<number>; tam?: number }) {
  const v = temp >= 37 ? 1.5 : 1
  const rb = Math.max(0, Math.min(3.2, ((dia - 0.6) / 2.4) * 3.2 * v))
  const rh = Math.max(0, Math.min(9, ((dia - 1.8) / 2.5) * 9 * v))
  return (
    <svg viewBox="0 0 100 100" width={tam} height={tam} role="img" aria-label="Caja de Petri">
      <circle cx="50" cy="50" r="47" fill="#f3e3b3" stroke="#9aa" strokeWidth="2" />
      <circle cx="50" cy="50" r="44" fill="none" stroke="#fff" strokeOpacity="0.6" />
      {cols.map((c, i) => {
        const r = c.hongo ? rh : rb * (0.7 + (i % 3) * 0.2)
        if (r <= 0.2) return null
        return (
          <g key={i} onClick={() => onTocar?.(i)} className={onTocar ? 'cursor-pointer' : ''}>
            {c.hongo ? (
              <g>
                <circle cx={c.x} cy={c.y} r={r} fill="#e9eee6" opacity="0.9" />
                <circle cx={c.x} cy={c.y} r={r * 0.45} fill="#5c7a4a" opacity="0.8" />
              </g>
            ) : c.corrida ? (
              <ellipse cx={c.x} cy={c.y + r} rx={r} ry={r * 2.4} fill={c.color} stroke="#c8b27a" strokeWidth="0.4" />
            ) : (
              <circle cx={c.x} cy={c.y} r={r} fill={c.color} stroke="#c8b27a" strokeWidth="0.4" />
            )}
            {marcadas?.has(i) && <circle cx={c.x} cy={c.y} r={Math.max(2, r * 0.5)} fill="#d0573a" />}
          </g>
        )
      })}
    </svg>
  )
}

const NOMBRE_CORTO = ['Manos sucias', 'Manos lavadas', 'Celular', 'Moneda', 'Aire', 'Control']

/** caja de Petri vista desde arriba en la mesa (r ≈ 26) */
function CajaMini({ n, sembrada, sellada, abierta, k }: { n: string; sembrada: boolean; sellada: boolean; abierta: boolean; k: number }) {
  return (
    <g>
      <circle r="24" fill="#f3e3b3" stroke="#7a8794" strokeWidth="2" />
      {sembrada && <path d={`M-12 ${-6 + (k % 3) * 3} q6 -6 12 0 t12 0`} stroke="#c8b27a" strokeWidth="2" fill="none" />}
      {sellada && <circle r="26" fill="none" stroke="#e6b33a" strokeWidth="3" />}
      {abierta && <ellipse cx="18" cy="-22" rx="22" ry="6" fill="rgba(220,240,250,0.8)" stroke="#7a8794" />}
      <text y="40" textAnchor="middle" fontSize="9" fontWeight="700" fill="#3a2f22">{n}</text>
    </g>
  )
}

const Objeto = ({ c, t, w = 44, h = 36 }: { c: string; t: string; w?: number; h?: number }) => (
  <g><rect x={-w / 2} y={-h / 2} width={w} height={h} rx="6" fill={c} stroke="#2b2b2b" strokeWidth="2" /><text y="4" textAnchor="middle" fontSize="8" fontWeight="800">{t}</text></g>
)

type Hisopo = 'nuevo' | { f: number; usado: boolean }
interface Cj { sembrada: boolean; sellada: boolean; abierta: number | null; aireMin: number; tocada: boolean }

function Donde({ grado }: { grado: number }) {
  const [hecho, setHecho] = useState<Set<string>>(new Set())
  const [hisopo, setHisopo] = useState<Hisopo>('nuevo')
  const [reuso, setReuso] = useState(false)
  const [cj, setCj] = useState<Cj[]>(FUENTES.map(() => ({ sembrada: false, sellada: false, abierta: null, aireMin: 0, tocada: false })))
  const [volteadas, setVolteadas] = useState(false)
  const [incubando, setIncubando] = useState(false)
  const [temp, setTemp] = useState(25)
  const [horas, setHoras] = useState(0)
  const [contando, setContando] = useState<number | null>(null)
  const [marcadas, setMarcadas] = useState<Set<number>>(new Set())
  const [conteos, setConteos] = useState<Record<number, number>>({})
  const abiertaAire = cj[4].abierta !== null
  useEffect(() => {
    const id = window.setInterval(() => {
      if (abiertaAire) setCj((x) => x.map((c, k) => (k === 4 ? { ...c, aireMin: c.aireMin + 1 } : c)))
      if (incubando) setHoras((h) => Math.min(120, h + 2))
    }, 1000)
    return () => window.clearInterval(id)
  }, [abiertaAire, incubando])
  const dia = Math.floor(horas / 24)
  const fallasLista = [
    ...(!hecho.has('mesa') ? ['no limpiaste la mesa con alcohol'] : []),
    ...(!hecho.has('guantes') ? ['no te lavaste las manos ni usaste guantes'] : []),
    ...(!hecho.has('mechero') ? ['no encendiste el mechero'] : []),
    ...(!hecho.has('tapabocas') ? ['hablaste sobre las cajas sin tapabocas'] : []),
    ...(reuso ? ['usaste el mismo hisopo en varias cajas'] : []),
    ...(cj[5].tocada ? ['abriste la caja de control'] : []),
  ]
  const fallas = fallasLista.length
  const corridas = !volteadas
  const nAire = cj[4].sembrada ? Math.round(Math.min(1, cj[4].aireMin / 10) * 5) : 0
  const cajas = useMemo(
    () => FUENTES.map((f, k) => {
      const sembrada = cj[k].sembrada || k === 5
      const nb = !sembrada ? 0 : (k === 4 ? nAire : f.b) + fallas * 2 + (k === 5 ? fallas : 0) + (!cj[k].sellada ? 2 : 0)
      return colonias(k + 1, nb, (k === 4 ? (nAire ? f.h : 0) : f.h) + (fallas > 2 ? 1 : 0), corridas)
    }),
    [fallas, corridas, cj, nAire],
  )
  const real = (k: number) => cajas[k].filter((c) => !c.hongo).length
  const marcar = (id: string) => setHecho((h) => new Set(h).add(id))
  const piezas: Pieza[] = [
    { id: 'alcohol', nombre: 'Alcohol en atomizador', x: 50, y: 250, ancho: 44, alto: 60, tomable: true, color: '#e1f0fa', dibujo: <Objeto c="#e1f0fa" t="ALCOHOL" w={34} h={50} /> },
    { id: 'superficie', nombre: hecho.has('mesa') ? 'Mesa limpia' : 'Mesa de trabajo (límpiala)', x: 500, y: 410, ancho: 600, alto: 24, dibujo: <rect x="-300" y="-10" width="600" height="20" rx="4" fill={hecho.has('mesa') ? 'rgba(46,125,90,0.15)' : 'rgba(150,120,80,0.15)'} stroke="#8a6a3a" strokeDasharray="4 4" /> },
    { id: 'guantes', nombre: hecho.has('guantes') ? 'Manos lavadas, con guantes' : 'Lavarse las manos y ponerse guantes (toca)', x: 115, y: 250, ancho: 50, alto: 50, alTocar: () => marcar('guantes'), dibujo: <Objeto c={hecho.has('guantes') ? '#bfe3cf' : '#e8eef2'} t={hecho.has('guantes') ? '✔ GUANTES' : 'GUANTES'} /> },
    { id: 'tapabocas', nombre: hecho.has('tapabocas') ? 'Con tapabocas' : 'Ponerse el tapabocas (toca)', x: 175, y: 250, ancho: 50, alto: 50, alTocar: () => marcar('tapabocas'), dibujo: <Objeto c={hecho.has('tapabocas') ? '#bfe3cf' : '#dbe9f6'} t={hecho.has('tapabocas') ? '✔ TAPAB.' : 'TAPABOCAS'} /> },
    { id: 'mechero', nombre: hecho.has('mechero') ? 'Mechero encendido' : 'Mechero (toca para encender)', x: 245, y: 250, ancho: 44, alto: 60, alTocar: () => marcar('mechero'), dibujo: <g><rect x="-10" y="0" width="20" height="26" fill="#777" stroke="#2b2b2b" strokeWidth="2" />{hecho.has('mechero') && <path d="M0 0 Q-10 -18 0 -34 Q10 -18 0 0" fill="#5aa0ff" opacity="0.85" />}</g> },
    ...FUENTES.slice(0, 4).map((f, k) => ({ id: `f${k}`, nombre: f.n, x: 330 + k * 70, y: 250, ancho: 56, alto: 50, dibujo: <Objeto c={['#e8b48a', '#f2d5c0', '#333a44', '#d4b04a'][k]} t={['MANO', 'MANO ✔', 'CELULAR', 'MONEDA'][k]} /> })),
    { id: 'hisopos', nombre: hisopo === 'nuevo' ? 'Hisopo estéril (nuevo)' : `Hisopo con muestra de ${FUENTES[hisopo.f].n.toLowerCase()}${hisopo.usado ? ' (ya usado)' : ''}`, x: 620, y: 250, ancho: 50, alto: 60, tomable: true, dibujo: <g><rect x="-2" y="-24" width="4" height="44" fill="#ddd" stroke="#2b2b2b" strokeWidth="1" /><ellipse cy="-26" rx="5" ry="8" fill={hisopo === 'nuevo' ? '#fff' : '#d8c08a'} stroke="#2b2b2b" strokeWidth="1" /></g> },
    ...FUENTES.map((_, k) => ({ id: `c${k}`, nombre: `Caja: ${FUENTES[k].n}${k === 4 ? (abiertaAire ? ` (abierta ${cj[4].aireMin} min — toca para tapar)` : ' (toca para destapar)') : ''}`, x: 240 + k * 75, y: 340, ancho: 56, alto: 60, alTocar: k === 4 ? () => setCj((x) => x.map((c, j) => (j === 4 ? (c.abierta === null ? { ...c, abierta: 1, sembrada: true } : { ...c, abierta: null }) : c))) : k === 5 ? () => setCj((x) => x.map((c, j) => (j === 5 ? { ...c, tocada: true } : c))) : undefined, dibujo: <CajaMini n={NOMBRE_CORTO[k]} sembrada={cj[k].sembrada} sellada={cj[k].sellada} abierta={cj[k].abierta !== null} k={k} /> })),
    { id: 'cinta', nombre: 'Cinta (sellar y rotular)', x: 720, y: 250, ancho: 50, alto: 50, tomable: true, dibujo: <g><circle r="16" fill="#e6b33a" stroke="#2b2b2b" strokeWidth="2" /><circle r="7" fill="#fff" stroke="#2b2b2b" /></g> },
    { id: 'voltear', nombre: volteadas ? 'Cajas boca abajo' : 'Voltear las cajas (boca abajo)', x: 790, y: 250, ancho: 50, alto: 50, tomable: !incubando, dibujo: <g><rect x="-16" y="-14" width="32" height="28" rx="12" fill="#e8b48a" stroke="#2b2b2b" strokeWidth="2" /><path d="M-14 -20 a14 10 0 0 1 28 0 l-4 -4 m4 4 l-6 2" fill="none" stroke="#2b2b2b" strokeWidth="2" /></g> },
    { id: 'incubadora', nombre: `Incubadora ${temp} °C${incubando ? ` · día ${dia}` : ''} (toca: cambiar temperatura)`, x: 870, y: 330, ancho: 110, alto: 120, alTocar: () => !incubando && setTemp((t) => (t === 25 ? 37 : 25)), dibujo: <g><rect x="-50" y="-56" width="100" height="112" rx="8" fill="#dfe4e8" stroke="#2b2b2b" strokeWidth="2.5" /><rect x="-40" y="-44" width="80" height="70" fill={incubando ? '#ffe3a0' : '#c9d3dc'} stroke="#2b2b2b" /><text y="44" textAnchor="middle" fontSize="12" fontWeight="800">{temp} °C</text></g> },
    { id: 'bandeja', nombre: incubando ? 'Bandeja en la incubadora' : 'Bandeja de cajas (llévala a la incubadora)', x: 560, y: 410, ancho: 90, alto: 24, tomable: !incubando, dibujo: <rect x="-40" y="-8" width="80" height="16" rx="4" fill="#c8b48a" stroke="#2b2b2b" strokeWidth="2" /> },
    { id: 'caneca', nombre: 'Residuos (hisopos usados)', x: 960, y: 250, ancho: 54, alto: 76, dibujo: <Caneca /> },
  ]
  const cajasIds = FUENTES.map((_, k) => `c${k}`)
  const destinos = (de: string) => {
    if (de === 'alcohol') return ['superficie']
    if (de === 'hisopos') return hisopo === 'nuevo' ? FUENTES.slice(0, 4).map((_, k) => `f${k}`) : [...(hisopo.usado ? [] : cajasIds), 'caneca']
    if (de === 'cinta' || de === 'voltear') return cajasIds
    if (de === 'bandeja') return ['incubadora']
    return []
  }
  const soltar = (de: string, en: string): Uso | string => {
    if (de === 'alcohol') return en === 'superficie' ? { anim: 'gotas', gotas: 4, hecho: () => marcar('mesa') } : 'El alcohol se rocía sobre la mesa de trabajo.'
    if (de === 'hisopos') {
      if (en === 'caneca') return hisopo === 'nuevo' ? 'Ese hisopo está limpio.' : { anim: 'poner', hecho: () => setHisopo('nuevo') }
      if (en.startsWith('f')) {
        const f = parseInt(en.slice(1), 10)
        if (hisopo !== 'nuevo' && hisopo.usado) { setReuso(true); return { anim: 'frotar', hecho: () => setHisopo({ f, usado: false }) } }
        return { anim: 'frotar', hecho: () => setHisopo({ f, usado: false }) }
      }
      if (en.startsWith('c')) {
        const k = parseInt(en.slice(1), 10)
        if (hisopo === 'nuevo') return 'El hisopo está limpio: primero frota una de las fuentes.'
        if (k === 5) return 'La caja de control no se abre: así se sabe si la técnica funcionó.'
        if (k === 4) return 'La caja del aire no se siembra con hisopo: se destapa 10 minutos (tócala).'
        if (hisopo.f !== k) return `Esa caja está rotulada «${FUENTES[k].n}»: siembra la muestra en la caja de su fuente.`
        if (cj[k].sembrada) return 'Esa caja ya está sembrada.'
        return { anim: 'frotar', hecho: () => { setCj((x) => x.map((c, j) => (j === k ? { ...c, sembrada: true } : c))); setHisopo({ f: hisopo.f, usado: true }) } }
      }
      return 'Frota una fuente con el hisopo y siémbrala en su caja.'
    }
    if (de === 'cinta') {
      const k = parseInt(en.slice(1), 10)
      if (Number.isNaN(k)) return 'La cinta va en el borde de las cajas.'
      if (cj[k].sellada) return 'Ya está sellada.'
      if (k === 4 && abiertaAire) return 'Primero tapa la caja del aire.'
      return { anim: 'frotar', hecho: () => setCj((x) => x.map((c, j) => (j === k ? { ...c, sellada: true } : c))) }
    }
    if (de === 'voltear') return { anim: 'poner', hecho: () => setVolteadas(true) }
    if (de === 'bandeja') {
      if (abiertaAire) return 'Tapa primero la caja del aire.'
      if (!cj.slice(0, 5).some((c) => c.sembrada)) return 'Todavía no has sembrado ninguna caja.'
      return { anim: 'poner', hecho: () => setIncubando(true) }
    }
    return 'No se puede.'
  }
  const reiniciar = () => { setHecho(new Set()); setHisopo('nuevo'); setReuso(false); setCj(FUENTES.map(() => ({ sembrada: false, sellada: false, abierta: null, aireMin: 0, tocada: false }))); setVolteadas(false); setIncubando(false); setHoras(0); setConteos({}); setContando(null) }
  const btn = 'min-h-10 rounded-full border border-[var(--linea)] bg-white px-3 text-sm font-semibold hover:border-[var(--acento)]'
  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-2xl bg-[var(--tarjeta)] p-4 text-sm">
        Vas a sembrar 6 cajas de Petri con agar nutritivo, con <b>técnica aséptica</b>: limpia la mesa con alcohol, lávate y ponte guantes y tapabocas, enciende el mechero. Para cada fuente toma un <b>hisopo nuevo</b>, frótalo en la fuente, siémbralo en su caja y bótalo. La caja del aire se deja destapada 10 min (acelerado: 1 s = 1 min) y la de control no se abre. Sella con cinta, voltea las cajas y lleva la bandeja a la incubadora (1 s = 2 h).
      </p>
      <MesaViva desde={190} piezas={piezas} destinos={destinos} soltar={soltar} />
      {temp === 37 && <p className="text-sm font-semibold text-[#b5462c]">⚠ A 37 °C (la temperatura del cuerpo) crecen más rápido los microbios que pueden enfermarnos: en el colegio se incuba a temperatura ambiente.</p>}
      {incubando && (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold">Día {dia}{horas < 120 ? ` · ${horas % 24} h` : ' (fin)'}</span>
            <button type="button" onClick={reiniciar} className={btn}>Volver a sembrar</button>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {FUENTES.map((f, k) => (
              <div key={f.id} className="flex flex-col items-center rounded-xl bg-[var(--tarjeta)] p-2 text-center text-xs">
                <Caja cols={cajas[k]} dia={horas / 24} temp={temp} />
                <b>{f.n}</b>
                {dia >= 2 && (
                  conteos[k] !== undefined
                    ? <span>Contaste {conteos[k]} · hay {real(k)} colonias de bacterias</span>
                    : <button type="button" onClick={() => { setContando(k); setMarcadas(new Set()) }} className="mt-1 rounded-full border border-[var(--linea)] px-3 py-0.5 font-semibold">Contar colonias</button>
                )}
              </div>
            ))}
          </div>
          {contando !== null && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setContando(null)}>
              <div className="rounded-2xl bg-[var(--tarjeta)] p-4 text-center" onClick={(e) => e.stopPropagation()}>
                <p className="font-semibold">{FUENTES[contando].n}: toca cada colonia de bacterias (las redondas) para marcarla</p>
                <div className="mt-2 flex justify-center"><Caja cols={cajas[contando]} dia={horas / 24} temp={temp} tam={360} marcadas={marcadas} onTocar={(i) => !cajas[contando][i].hongo && setMarcadas((m) => { const n = new Set(m); if (n.has(i)) n.delete(i); else n.add(i); return n })} /></div>
                <p className="mt-2 text-sm">Marcadas: <b>{marcadas.size}</b></p>
                <button type="button" onClick={() => { setConteos((c) => ({ ...c, [contando]: marcadas.size })); setContando(null) }} className="mt-2 min-h-10 rounded-full bg-[var(--acento)] px-5 text-sm font-semibold text-white">Anotar el conteo</button>
              </div>
            </div>
          )}
          {dia >= 3 && (
            <div className="rounded-xl bg-[var(--tarjeta)] p-3 text-sm">
              {real(5) > 0 ? (
                <p className="font-semibold text-[#b5462c]">⚠ La caja de control tiene colonias: hubo contaminación ({fallasLista.join('; ')}). Así no se puede saber qué colonias venían de cada fuente.</p>
              ) : (
                <p><b>El control quedó limpio:</b> la técnica funcionó y lo que creció viene de cada fuente.</p>
              )}
              {corridas && <p className="mt-1">Incubaste boca arriba: gotas de agua cayeron de la tapa y algunas colonias se corrieron.</p>}
              {cj.slice(0, 5).some((c) => c.sembrada && !c.sellada) && <p className="mt-1">Algunas cajas no se sellaron: les entró algo del ambiente.</p>}
              {cj[4].sembrada && cj[4].aireMin < 8 && <p className="mt-1">La caja del aire estuvo abierta solo {cj[4].aireMin} min: le cayó muy poco.</p>}
              <p className="mt-1">Las colonias redondas y brillantes son de <b>bacterias</b> (cada una salió de una sola célula); las algodonosas son de <b>hongos</b>. Las manos sin lavar tienen muchas más que las lavadas: por eso el jabón importa.{grado >= 9 ? ' Cada colonia es una UFC (unidad formadora de colonia): sirve para estimar cuántos microbios había.' : ''}</p>
            </div>
          )}
        </>
      )}
      <p className="text-xs text-[var(--suave)]">⚠ Las cajas incubadas no se abren: lo que crece puede incluir microbios dañinos. Al terminar, se desechan selladas después de tratarlas con cloro (o en autoclave).</p>
    </div>
  )
}

const DISCOS = [
  { n: 'Agua (control)', halo: 6 },
  { n: 'Jabón antibacterial', halo: 15 },
  { n: 'Ajo machacado', halo: 12 },
  { n: 'Alcohol', halo: 9 },
  { n: 'Enjuague bucal', halo: 13 },
  { n: 'Antibiótico (disco comercial)', halo: 24, avanzado: true },
]

function Detiene({ grado }: { grado: number }) {
  const lista = DISCOS.filter((d) => !d.avanzado || grado >= 11)
  const [cesped, setCesped] = useState(false)
  const [puestos, setPuestos] = useState<number[]>([])
  const [incubando, setIncubando] = useState(false)
  const [horas, setHoras] = useState(0)
  const [medidos, setMedidos] = useState(false)
  const [aviso, setAviso] = useState('')
  useEffect(() => {
    if (!incubando) return
    const id = window.setInterval(() => setHoras((h) => Math.min(48, h + 2)), 1000)
    return () => window.clearInterval(id)
  }, [incubando])
  const dia = horas / 24
  const crece = cesped ? dia : 0
  const posicion = (k: number) => { const a = (k / lista.length) * Math.PI * 2 - Math.PI / 2; return [Math.cos(a) * 30, Math.sin(a) * 30] }
  const caja = (
    <g>
      <circle r="52" fill="#f3e3b3" stroke="#7a8794" strokeWidth="2.5" />
      {crece > 0 && <circle r="50" fill={`rgba(236, 222, 170, ${Math.min(1, crece / 2)})`} />}
      {crece > 0 && Array.from({ length: 90 }, (_, k) => <circle key={k} cx={Math.cos(k * 2.4) * Math.sqrt(k) * 5.1} cy={Math.sin(k * 2.4) * Math.sqrt(k) * 5.1} r={Math.min(1, crece * 0.5)} fill="#e8cf8a" />)}
      {cesped && crece === 0 && <path d="M-34 -10 q8 -8 16 0 t16 0 t16 0 t16 0 M-34 10 q8 -8 16 0 t16 0 t16 0 t16 0" stroke="#d8c08a" strokeWidth="2" fill="none" />}
      {puestos.map((k) => {
        const [x, y] = posicion(k)
        return (
          <g key={k}>
            {crece > 0 && <circle cx={x} cy={y} r={(lista[k].halo / 2) * 0.8 * Math.min(1, crece / 2)} fill="#f6f1df" />}
            <circle cx={x} cy={y} r="3" fill="#fff" stroke="#999" />
            <text x={x} y={y + 1.5} textAnchor="middle" fontSize="4" fontWeight="800">{k + 1}</text>
          </g>
        )
      })}
    </g>
  )
  const piezas: Pieza[] = [
    { id: 'cultivo', nombre: 'Hisopo con el cultivo de bacterias', x: 60, y: 330, ancho: 50, alto: 80, tomable: true, dibujo: <g><rect x="-12" y="-6" width="24" height="44" rx="4" fill="#f2e3b0" stroke="#2b2b2b" strokeWidth="2" /><rect x="-2" y="-40" width="4" height="40" fill="#ddd" stroke="#2b2b2b" strokeWidth="1" /><ellipse cy="-42" rx="5" ry="8" fill="#d8c08a" stroke="#2b2b2b" strokeWidth="1" /></g> },
    ...lista.map((d, k) => ({ id: `d${k}`, nombre: `Disco con ${d.n.toLowerCase()}`, x: 130 + k * 62, y: 335, ancho: 50, alto: 60, tomable: true, dibujo: <g><Objeto c="#f4f4ec" t={`${k + 1}`} w={34} h={40} /><text y="34" textAnchor="middle" fontSize="8" fontWeight="700">{d.n.split(' (')[0].split(' ')[0]}</text></g> })),
    { id: 'caja', nombre: incubando ? 'Caja en la incubadora' : 'Caja de Petri con agar', x: incubando ? 860 : 620, y: 330, ancho: 110, alto: 110, tomable: !incubando, dibujo: caja },
    { id: 'incubadora', nombre: incubando ? `Incubadora · ${Math.floor(horas / 24)} d ${horas % 24} h` : 'Incubadora', x: 860, y: 330, ancho: 130, alto: 140, dibujo: <g><rect x="-62" y="-66" width="124" height="132" rx="8" fill="#dfe4e8" stroke="#2b2b2b" strokeWidth="2.5" opacity={incubando ? 0.35 : 1} /><text y="80" textAnchor="middle" fontSize="11" fontWeight="800">Incubadora</text></g> },
    { id: 'regla', nombre: 'Regla (mide los halos)', x: 720, y: 250, ancho: 120, alto: 24, tomable: true, dibujo: <g><rect x="-55" y="-8" width="110" height="16" fill="#f2e6c4" stroke="#8a6a3a" />{Array.from({ length: 11 }, (_, k) => <line key={k} x1={-50 + k * 10} x2={-50 + k * 10} y1="-8" y2="-2" stroke="#8a6a3a" />)}</g> },
    { id: 'caneca', nombre: 'Residuos (toca: empezar de nuevo)', x: 960, y: 230, ancho: 54, alto: 76, alTocar: () => { setCesped(false); setPuestos([]); setIncubando(false); setHoras(0); setMedidos(false); setAviso('') }, dibujo: <Caneca /> },
  ]
  const destinos = (de: string) => (de === 'caja' ? ['incubadora'] : de === 'regla' ? ['caja'] : ['caja'])
  const soltar = (de: string, en: string): Uso | string => {
    if (de === 'caja') return en === 'incubadora' ? (puestos.length ? { anim: 'poner', hecho: () => setIncubando(true) } : 'Primero pon los discos.') : 'La caja va a la incubadora.'
    if (en !== 'caja') return 'Eso va en la caja.'
    if (de === 'regla') {
      if (dia < 2) return 'Todavía no: espera 2 días de incubación para que se vea el césped.'
      return { anim: 'poner', hecho: () => setMedidos(true) }
    }
    if (incubando) return 'La caja ya está incubando: no se abre.'
    if (de === 'cultivo') return cesped ? 'Ya tiene el césped.' : { anim: 'frotar', hecho: () => setCesped(true) }
    const k = parseInt(de.slice(1), 10)
    if (puestos.includes(k)) return 'Ese disco ya está puesto.'
    if (!cesped) setAviso('Pusiste discos antes de extender las bacterias: el césped debe ir primero, en toda la caja.')
    return { anim: 'poner', hecho: () => setPuestos((p) => [...p, k]) }
  }
  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-2xl bg-[var(--tarjeta)] p-4 text-sm">
        Con el hisopo extiende una capa pareja de bacterias sobre el agar (un «césped») y pon encima los discos de papel de 6 mm empapados en cada sustancia. Lleva la caja a la incubadora (acelerado: 1 s = 2 h) y, a los 2 días, mide los halos con la regla. Donde la sustancia frena a las bacterias queda un <b>halo</b> transparente: más grande el halo, más efectiva.
      </p>
      <MesaViva desde={190} piezas={piezas} destinos={destinos} soltar={soltar} />
      {aviso && <p className="text-sm font-semibold text-[#b5462c]">⚠ {aviso}</p>}
      {incubando && !cesped && dia >= 1 && <p className="text-sm font-semibold text-[#b5462c]">⚠ No extendiste las bacterias: no creció césped y no hay halos que comparar.</p>}
      <ol className="list-decimal space-y-1 pl-5 text-sm">
        {lista.map((d, k) => <li key={d.n}>{d.n}{!puestos.includes(k) ? <span className="text-[var(--suave)]"> (sin poner)</span> : medidos && cesped ? <b> — halo de {d.halo} mm{d.halo <= 6 ? ' (no hay halo)' : ''}</b> : ''}</li>)}
      </ol>
      {medidos && cesped && (
        <p className="rounded-xl bg-[#eaf5ee] p-3 text-sm">
          El agua no frena nada: es el control. El alcohol se evapora rápido y deja un halo pequeño.{grado >= 11 ? ' El antibiótico deja el halo más grande: así se mide en los hospitales si una bacteria es sensible o resistente. Usar antibióticos sin necesidad selecciona bacterias resistentes.' : ' El jabón y el enjuague bucal sí frenan a las bacterias.'} Valores de ejemplo: en una práctica real cambian según la bacteria y la concentración.
        </p>
      )}
    </div>
  )
}

export default function Microbiologia({ grado }: { grado: number }) {
  const [modo, setModo] = useState<'donde' | 'detiene'>('donde')
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {(['donde', 'detiene'] as const).map((x) => (
          <button key={x} type="button" onClick={() => setModo(x)} className={`min-h-10 rounded-full border px-4 text-sm font-semibold ${modo === x ? 'border-[var(--acento)] bg-[var(--acento)] text-white' : 'border-[var(--linea)] bg-[var(--tarjeta)]'}`}>
            {x === 'donde' ? '1. ¿Dónde hay más microbios?' : '2. ¿Qué los detiene?'}
          </button>
        ))}
      </div>
      {modo === 'donde' ? <Donde grado={grado} /> : <Detiene grado={grado} />}
    </div>
  )
}
