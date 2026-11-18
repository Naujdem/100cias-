import { useEffect, useState } from 'react'

// Laboratorio de Química 1 (PLAN-LABORATORIOS.md): medición, precisión y exactitud.
// Parte 1: leer el menisco (ojo al nivel, fondo del menisco, paralaje) en probeta de 100 mL, probeta de 10 mL
// y bureta (desde 9°, escala que crece hacia abajo). Parte 2: medir 25 mL cinco veces con cuatro instrumentos,
// pesar (agua: 1 g = 1 mL) y ver en la diana cuál es exacto y cuál preciso. Datos de modelo, no medidos.

const f = (x: number, d = 1) => x.toLocaleString('es-CO', { minimumFractionDigits: d, maximumFractionDigits: d })

// ---------- Parte 1: el menisco ----------
interface Inst { n: string; div: number; min: number; max: number; etiqueta: number; abajo?: boolean; desde: number }
const INSTS: Inst[] = [
  { n: 'Probeta de 100 mL', div: 1, min: 20, max: 90, etiqueta: 5, desde: 6 },
  { n: 'Probeta de 10 mL', div: 0.2, min: 2, max: 9, etiqueta: 1, desde: 6 },
  { n: 'Bureta de 50 mL', div: 0.1, min: 3, max: 45, etiqueta: 1, abajo: true, desde: 9 },
]
const OJOS = ['abajo', 'al nivel', 'arriba'] as const
const nuevoValor = (I: Inst) => {
  const paso = I.div / 2
  const n = Math.round((I.min + Math.random() * (I.max - I.min)) / paso)
  return +(n * paso).toFixed(2)
}

function Menisco({ grado }: { grado: number }) {
  const insts = INSTS.filter((i) => grado >= i.desde)
  const [ii, setIi] = useState(0)
  const I = insts[ii]
  const paso = I.div / 2
  const dec = I.div < 0.2 ? 2 : 1
  const [real, setReal] = useState(() => nuevoValor(I))
  const [ojo, setOjo] = useState(2)
  const [lec, setLec] = useState(() => Math.round(nuevoValor(I) / paso) * paso)
  const [res, setRes] = useState<string[] | null>(null)
  const [puntos, setPuntos] = useState({ bien: 0, total: 0 })

  const nueva = (k = ii) => {
    const J = insts[k]
    setIi(k); setReal(nuevoValor(J)); setLec(nuevoValor(J)); setOjo(Math.random() < 0.5 ? 0 : 2); setRes(null)
  }
  const anotar = () => {
    if (res) return
    const tol = paso / 2 + 1e-6
    const dir = I.abajo ? -1 : 1
    const msg: string[] = []
    const bien = Math.abs(lec - real) <= tol && ojo === 1
    if (Math.abs(lec - real) <= tol) msg.push(`✔ Lectura correcta: ${f(real, dec)} mL.`)
    else msg.push(`✘ El volumen es ${f(real, dec)} mL y anotaste ${f(lec, dec)} mL.`)
    if (ojo !== 1) msg.push(`Tenías el ojo ${OJOS[ojo]} del menisco: es el error de paralaje. Con el ojo ${OJOS[ojo]} la lectura sale ${(ojo - 1) * dir > 0 ? 'más alta' : 'más baja'} de lo real. Pon el ojo al nivel del líquido.`)
    if (Math.abs(lec - (real + dir * I.div)) <= tol && Math.abs(lec - real) > tol) msg.push('Parece que leíste el borde del menisco (donde el agua sube por el vidrio). Se lee en el fondo de la curva.')
    if (grado >= 9 && bien) msg.push(`Se anota ${f(real, dec)} ± ${f(paso, dec)} mL: la incertidumbre es la mitad de la división más pequeña (${f(I.div, dec)} mL).`)
    setRes(msg)
    setPuntos((p) => ({ bien: p.bien + (bien ? 1 : 0), total: p.total + 1 }))
  }

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return
      const k = e.key.toLowerCase()
      const n = parseInt(k, 10)
      if (n >= 1 && n <= insts.length) nueva(n - 1)
      else if (k === 'w' || k === 'arrowup') setOjo((o) => Math.min(2, o + 1))
      else if (k === 's' || k === 'arrowdown') setOjo((o) => Math.max(0, o - 1))
      else if (k === 'arrowright' || k === 'd') setLec((v) => +(v + paso).toFixed(2))
      else if (k === 'arrowleft' || k === 'a') setLec((v) => +Math.max(0, v - paso).toFixed(2))
      else if (k === 'enter') anotar()
      else if (k === 'n') nueva()
      else return
      e.preventDefault()
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  })

  // Dibujo ampliado: 26 px por división alrededor del nivel
  const PX = 26
  const c = Math.round(real / I.div) * I.div
  const y = (v: number) => 160 + ((I.abajo ? 1 : -1) * (v - c) * PX) / I.div
  const yNivel = y(real)
  const borde = PX // el agua sube una división por el vidrio
  const marcas: number[] = []
  for (let k = -7; k <= 7; k++) marcas.push(+(c + k * I.div).toFixed(2))
  const yOjo = yNivel + (1 - ojo) * 70
  const esEtiqueta = (v: number) => Math.abs(v / I.etiqueta - Math.round(v / I.etiqueta)) < 1e-6
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <svg viewBox="0 0 520 320" className="w-full rounded-2xl border border-[var(--linea)] bg-[#f4f1ea]" role="img" aria-label={`Menisco en ${I.n}`}>
        <clipPath id="ventana"><rect x="40" y="20" width="300" height="280" rx="14" /></clipPath>
        <g clipPath="url(#ventana)">
          <rect x="40" y="20" width="300" height="280" fill="#fff" />
          <path d={`M110 ${yNivel - borde} Q120 ${yNivel} 190 ${yNivel} Q260 ${yNivel} 270 ${yNivel - borde} V320 H110 Z`} fill="#8ec5e8" opacity="0.75" />
          <path d={`M110 ${yNivel - borde} Q120 ${yNivel} 190 ${yNivel} Q260 ${yNivel} 270 ${yNivel - borde}`} fill="none" stroke="#2f6d99" strokeWidth="2" />
          <line x1="110" y1="0" x2="110" y2="320" stroke="#9aa5ad" strokeWidth="3" />
          <line x1="270" y1="0" x2="270" y2="320" stroke="#9aa5ad" strokeWidth="3" />
          {marcas.map((v) => {
            const larga = esEtiqueta(v)
            return (
              <g key={v}>
                <line x1="110" y1={y(v)} x2={larga ? 175 : 145} y2={y(v)} stroke="#333" strokeWidth={larga ? 2 : 1.2} />
                {larga && <text x="100" y={y(v) + 5} textAnchor="end" fontSize="15" fontWeight="700" fill="#333">{f(v, I.etiqueta < 1 ? 1 : 0)}</text>}
              </g>
            )
          })}
        </g>
        <rect x="40" y="20" width="300" height="280" rx="14" fill="none" stroke="#666" strokeWidth="2" />
        {/* ojo y línea de vista */}
        <line x1="470" y1={yOjo} x2="190" y2={yNivel} stroke="#c0392b" strokeWidth="1.5" strokeDasharray="6 5" opacity="0.8" />
        <g transform={`translate(470 ${yOjo})`}>
          <ellipse rx="22" ry="12" fill="#fff" stroke="#333" strokeWidth="2" />
          <circle r="7" fill="#5a3e2b" /><circle r="3" fill="#111" />
        </g>
        <text x="470" y="312" textAnchor="middle" fontSize="12" fill="#555">ojo {OJOS[ojo]}</text>
        <text x="190" y="14" textAnchor="middle" fontSize="12" fill="#555">{I.n} · cada rayita = {f(I.div, dec)} mL{I.abajo ? ' · la escala crece hacia abajo' : ''}</text>
        {res && <line x1="40" x2="340" y1={yNivel} y2={yNivel} stroke="#27ae60" strokeWidth="2" />}
      </svg>
      <div className="flex flex-col gap-3 text-sm">
        <div className="flex flex-wrap gap-2">
          {insts.map((J, k) => (
            <button key={J.n} type="button" onClick={() => nueva(k)} className={`rounded-full border px-3 py-1 font-semibold ${k === ii ? 'border-[var(--acento)] bg-[var(--acento)] text-white' : 'border-[var(--linea)] bg-white'}`}>{k + 1} · {J.n}</button>
          ))}
        </div>
        <p>Ojo: <button type="button" onClick={() => setOjo((o) => Math.max(0, o - 1))} className="rounded-full border border-[var(--linea)] px-3">bajar (S)</button> <button type="button" onClick={() => setOjo((o) => Math.min(2, o + 1))} className="rounded-full border border-[var(--linea)] px-3">subir (W)</button></p>
        <div className="flex items-center gap-2">
          <span>Tu lectura:</span>
          <button type="button" onClick={() => setLec((v) => +Math.max(0, v - paso).toFixed(2))} className="h-9 w-9 rounded-full border border-[var(--linea)] text-lg">−</button>
          <b className="min-w-20 text-center text-lg">{f(lec, dec)} mL</b>
          <button type="button" onClick={() => setLec((v) => +(v + paso).toFixed(2))} className="h-9 w-9 rounded-full border border-[var(--linea)] text-lg">+</button>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={anotar} disabled={!!res} className="min-h-10 rounded-full bg-[var(--acento)] px-5 font-semibold text-white disabled:opacity-50">Anotar (Enter)</button>
          <button type="button" onClick={() => nueva()} className="min-h-10 rounded-full border border-[var(--linea)] px-4 font-semibold">Otra (N)</button>
        </div>
        {res && <div className="rounded-xl bg-[var(--tarjeta)] p-3">{res.map((m) => <p key={m} className="mt-1 first:mt-0">{m}</p>)}</div>}
        <p className="text-[var(--suave)]">Lecturas bien hechas (valor y ojo al nivel): {puntos.bien} de {puntos.total}</p>
        <p className="text-xs text-[var(--suave)]">Teclas: 1–{insts.length} instrumento · W/S ojo · ←/→ lectura · Enter anotar · N otra.</p>
      </div>
    </div>
  )
}

// ---------- Parte 2: precisión y exactitud ----------
// Errores fijos con promedio 0 para que cada instrumento caiga siempre en su cuadrante.
const Z = [0.9, -1.2, 0.35, -0.55, 0.5]
interface Med { n: string; sesgo: number; sd: number; color: string; clave: number; nota: string }
const CLASES = ['Exacto y preciso', 'Preciso pero no exacto', 'Exacto pero no preciso', 'Ni exacto ni preciso']
const MEDS: Med[] = [
  { n: 'Pipeta aforada de 25 mL', sesgo: 0, sd: 0.04, color: '#2e86c1', clave: 0, nota: 'Tiene una sola marca hecha para 25 mL: es el instrumento para medir un volumen exacto.' },
  { n: 'Probeta con la marca corrida', sesgo: -1.6, sd: 0.15, color: '#8e44ad', clave: 1, nota: 'Siempre da casi lo mismo, pero lejos de 25: tiene un error sistemático (está mal calibrada). Se corrige calibrando.' },
  { n: 'Vaso de precipitados', sesgo: 0, sd: 1.4, color: '#e67e22', clave: 2, nota: 'Sus marcas son aproximadas: las medidas se riegan, aunque en promedio caigan cerca. Sirve para contener y mezclar, no para medir.' },
  { n: 'Taza de la cocina', sesgo: 2.6, sd: 1.5, color: '#c0392b', clave: 3, nota: 'No es un instrumento de medida: se riega y además se pasa.' },
]
const medida = (m: Med, k: number) => +(25 + m.sesgo + m.sd * Z[k]).toFixed(2)

function Diana({ datos }: { datos: { m: Med; v: number[] }[] }) {
  return (
    <svg viewBox="0 0 240 240" className="w-full max-w-[280px]" role="img" aria-label="Diana de las medidas">
      {[100, 75, 50, 25].map((r, k) => <circle key={r} cx="120" cy="120" r={r} fill={k % 2 ? '#fff' : '#f0e6d6'} stroke="#bbb" />)}
      <circle cx="120" cy="120" r="4" fill="#333" />
      {datos.flatMap(({ m, v }, j) => v.map((x, k) => {
        // distancia = error (25 px por mL); con sesgo, los puntos se agrupan hacia un lado
        const a = m.sesgo ? (j * Math.PI) / 2 + Math.PI / 4 + (k - 2) * 0.12 : j + (k * 2 * Math.PI) / 5
        const r = Math.min(110, Math.abs(x - 25) * 25)
        return <circle key={`${j}-${k}`} cx={120 + r * Math.cos(a)} cy={120 + r * Math.sin(a)} r="5" fill={m.color} stroke="#fff" />
      }))}
      <text x="120" y="236" textAnchor="middle" fontSize="11" fill="#555">centro = 25,00 mL · cada anillo = 1 mL</text>
    </svg>
  )
}

function PrecisionExactitud({ grado }: { grado: number }) {
  const [n, setN] = useState<number[]>(MEDS.map(() => 0))
  const [elec, setElec] = useState<(number | null)[]>(MEDS.map(() => null))
  const [ver, setVer] = useState(false)
  const datos = MEDS.map((m, j) => ({ m, v: Array.from({ length: n[j] }, (_, k) => medida(m, k)) }))
  const listos = n.every((x) => x === 5)
  const medir = (j: number) => setN((x) => x.map((c, i) => (i === j ? Math.min(5, c + 1) : c)))
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const k = parseInt(e.key, 10)
      if (k >= 1 && k <= 4) { medir(k - 1); e.preventDefault() }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  })
  const prom = (v: number[]) => v.reduce((a, b) => a + b, 0) / v.length
  const desv = (v: number[]) => { const p = prom(v); return Math.sqrt(v.reduce((a, b) => a + (b - p) ** 2, 0) / (v.length - 1)) }
  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-2xl bg-[var(--tarjeta)] p-4 text-sm">
        Mide <b>25 mL de agua</b> cinco veces con cada instrumento y pésalos en la balanza (1 g de agua ocupa 1 mL). <b>Exacto</b>: el promedio cae cerca del valor real. <b>Preciso</b>: las medidas quedan cerca unas de otras. Teclas 1–4 miden con cada uno.
      </p>
      <div className="grid gap-4 md:grid-cols-[1fr_280px]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left"><th className="p-1">Instrumento</th>{[1, 2, 3, 4, 5].map((k) => <th key={k} className="p-1">{k}</th>)}{grado >= 9 && <th className="p-1">Promedio</th>}{grado >= 9 && <th className="p-1">Error %</th>}{grado >= 11 && <th className="p-1">Desv.</th>}<th /></tr></thead>
            <tbody>
              {datos.map(({ m, v }, j) => (
                <tr key={m.n} className="border-t border-[var(--linea)]">
                  <td className="p-1 font-semibold" style={{ color: m.color }}>{j + 1} · {m.n}</td>
                  {[0, 1, 2, 3, 4].map((k) => <td key={k} className="p-1">{v[k] !== undefined ? f(v[k], 2) : '—'}</td>)}
                  {grado >= 9 && <td className="p-1">{v.length ? f(prom(v), 2) : '—'}</td>}
                  {grado >= 9 && <td className="p-1">{v.length ? f((Math.abs(prom(v) - 25) / 25) * 100, 1) : '—'}</td>}
                  {grado >= 11 && <td className="p-1">{v.length > 1 ? f(desv(v), 2) : '—'}</td>}
                  <td className="p-1"><button type="button" disabled={v.length >= 5} onClick={() => medir(j)} className="rounded-full border border-[var(--linea)] px-3 text-xs font-semibold disabled:opacity-40">Medir y pesar</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-1 text-xs text-[var(--suave)]">Valores en gramos = mL. Datos de modelo.{grado >= 9 ? ' Error % = |promedio − 25| ÷ 25 × 100.' : ''}{grado >= 11 ? ' Desv. = desviación estándar: mide la precisión.' : ''}</p>
        </div>
        <Diana datos={datos} />
      </div>
      {listos && (
        <div className="rounded-xl bg-[var(--tarjeta)] p-3 text-sm">
          <p className="font-semibold">¿Cómo es cada instrumento? Mira la diana{grado >= 9 ? ' y la tabla' : ''}.</p>
          {MEDS.map((m, j) => (
            <div key={m.n} className="mt-2">
              <span className="font-semibold" style={{ color: m.color }}>{m.n}: </span>
              {CLASES.map((c, k) => (
                <button key={c} type="button" onClick={() => setElec((e) => e.map((x, i) => (i === j ? k : x)))} className={`mr-1 mt-1 rounded-full border px-2 py-0.5 text-xs ${elec[j] === k ? 'border-[var(--acento)] bg-[var(--acento)] text-white' : 'border-[var(--linea)] bg-white'}`}>{c}</button>
              ))}
              {ver && <p className={`mt-1 ${elec[j] === m.clave ? 'text-[#1e8449]' : 'text-[#b5462c]'}`}>{elec[j] === m.clave ? '✔' : `✘ Es «${CLASES[m.clave].toLowerCase()}».`} {m.nota}</p>}
            </div>
          ))}
          <button type="button" disabled={elec.some((e) => e === null)} onClick={() => setVer(true)} className="mt-3 min-h-10 rounded-full bg-[var(--acento)] px-5 font-semibold text-white disabled:opacity-50">Comprobar</button>
          {ver && <p className="mt-2 rounded-lg bg-[#eaf5ee] p-2"><b>Conclusión:</b> para medir un volumen con cuidado se usa pipeta, bureta o matraz aforado; la probeta sirve para medidas rápidas y el vaso de precipitados solo para contener. Repetir la medida muestra la precisión; compararla con un valor conocido, la exactitud.{grado >= 11 ? ' Los errores al azar se reducen promediando; los sistemáticos, no: hay que calibrar.' : ''}</p>}
        </div>
      )}
      <button type="button" onClick={() => { setN(MEDS.map(() => 0)); setElec(MEDS.map(() => null)); setVer(false) }} className="self-start rounded-full border border-[var(--linea)] px-4 py-1 text-sm font-semibold">Empezar de nuevo</button>
    </div>
  )
}

export default function Medicion({ grado }: { grado: number }) {
  const [parte, setParte] = useState(0)
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {['1. Leer el menisco', '2. Precisión y exactitud'].map((t, k) => (
          <button key={t} type="button" onClick={() => setParte(k)} className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${parte === k ? 'border-[var(--acento)] bg-[var(--acento)] text-white' : 'border-[var(--linea)] bg-white'}`}>{t}</button>
        ))}
      </div>
      {parte === 0 ? (
        <>
          <p className="rounded-2xl bg-[var(--tarjeta)] p-4 text-sm">El agua se pega al vidrio y forma una curva: el <b>menisco</b>. Se lee en el <b>fondo de la curva</b>, con el <b>ojo a la altura del líquido</b>. Sube o baja el ojo, escoge el valor y anótalo.</p>
          <Menisco key={grado} grado={grado} />
        </>
      ) : <PrecisionExactitud grado={grado} />}
      <p className="text-xs text-[var(--suave)]">Versión casera: jeringas sin aguja, vasos medidores de cocina y una gramera; mide 25 mL varias veces y pésalos.</p>
    </div>
  )
}
