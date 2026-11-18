import { useEffect, useState } from 'react'

// Laboratorio de Química 2 (PLAN-LABORATORIOS.md): densidades.
// Parte 1: sólidos regulares (regla: largo × ancho × alto) e irregulares (desplazamiento en probeta); balanza;
// d = m/V e identificar el material. Errores: regla con un objeto irregular, objeto que flota sin hundirlo.
// Parte 2: torre de densidades; si un líquido cae a través de otro con el que se mezcla, se mezclan.
// Valores de modelo (densidades de tabla aproximadas: verificar).

const f = (x: number, d = 1) => x.toLocaleString('es-CO', { minimumFractionDigits: d, maximumFractionDigits: d })
const BOTON = (on: boolean) => `rounded-full border px-3 py-1 text-sm font-semibold ${on ? 'border-[var(--acento)] bg-[var(--acento)] text-white' : 'border-[var(--linea)] bg-white'}`

// ---------- Parte 1 ----------
interface Obj { n: string; m: number; v: number; lados?: [number, number, number]; color: string; material: string }
const OBJS: Obj[] = [
  { n: 'Cubo de madera', m: 32, v: 64, lados: [4, 4, 4], color: '#c8a26b', material: 'Madera de pino' },
  { n: 'Bloque de aluminio', m: 81, v: 30, lados: [5, 3, 2], color: '#b9c2c9', material: 'Aluminio' },
  { n: 'Bloque de plastilina', m: 36, v: 24, lados: [6, 2, 2], color: '#6fae5b', material: 'Plastilina' },
  { n: 'Piedra', m: 31.2, v: 12, color: '#8a8a8a', material: 'Piedra (granito)' },
  { n: 'Tuerca', m: 27.7, v: 3.5, color: '#6c7a89', material: 'Hierro o acero' },
  { n: 'Trozo de vela', m: 13.5, v: 15, color: '#f3ead2', material: 'Parafina (vela)' },
]
const TABLA: [string, number][] = [['Madera de pino', 0.5], ['Parafina (vela)', 0.9], ['Agua', 1], ['Plastilina', 1.5], ['Piedra (granito)', 2.6], ['Aluminio', 2.7], ['Hierro o acero', 7.9], ['Cobre', 8.9]]
const AGUA0 = 50

interface Hoja { m?: number; v?: number; metodo?: 'regla' | 'probeta'; hundido?: boolean; elegido?: string }

function Solidos({ grado }: { grado: number }) {
  const [oi, setOi] = useState(0)
  const [hojas, setHojas] = useState<Hoja[]>(OBJS.map(() => ({})))
  const [alfiler, setAlfiler] = useState(false)
  const [aviso, setAviso] = useState('')
  const [ver, setVer] = useState(false)
  const O = OBJS[oi]
  const H = hojas[oi]
  const poner = (p: Partial<Hoja>) => setHojas((hs) => hs.map((h, k) => (k === oi ? { ...h, ...p } : h)))
  const flota = O.m / O.v < 1
  const pesar = () => { poner({ m: O.m }); setAviso('') }
  const regla = () => {
    if (!O.lados) { setAviso('✘ La regla no sirve: este objeto no tiene lados rectos para medir largo, ancho y alto. Usa la probeta (desplazamiento de agua).'); return }
    poner({ v: O.v, metodo: 'regla' }); setAviso('')
  }
  const probeta = () => {
    const dentro = flota && !alfiler ? O.m : O.v // si flota, solo desplaza su propia masa de agua
    poner({ v: +(Math.round(dentro * 2) / 2).toFixed(1), metodo: 'probeta', hundido: !flota || alfiler })
    setAviso(flota && !alfiler ? '⚠ El objeto flota: solo una parte queda bajo el agua.' : '')
  }
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()
      const n = parseInt(k, 10)
      if (n >= 1 && n <= OBJS.length) { setOi(n - 1); setAviso('') }
      else if (k === 'b') pesar()
      else if (k === 'r') regla()
      else if (k === 'p') probeta()
      else if (k === 'h') setAlfiler((a) => !a)
      else return
      e.preventDefault()
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  })
  const d = H.m !== undefined && H.v ? H.m / H.v : undefined
  const nivel = H.metodo === 'probeta' && H.v ? AGUA0 + H.v : AGUA0
  const yN = (ml: number) => 230 - ml * 1.7
  const dentroProbeta = H.metodo === 'probeta'
  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-2xl bg-[var(--tarjeta)] p-4 text-sm">
        <b>Densidad = masa ÷ volumen</b>: cuánta materia hay en cada cm³. La masa se mide en la balanza. El volumen, si el objeto tiene forma regular, con la regla (largo × ancho × alto); si es irregular, en una probeta con agua: lo que sube el agua es su volumen (1 mL = 1 cm³).
      </p>
      <div className="flex flex-wrap gap-2">
        {OBJS.map((o, k) => <button key={o.n} type="button" onClick={() => { setOi(k); setAviso('') }} className={BOTON(k === oi)}>{k + 1} · {o.n}{hojas[k].elegido ? ' ✓' : ''}</button>)}
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <svg viewBox="0 0 560 260" className="w-full rounded-2xl border border-[var(--linea)] bg-[#f4f1ea]" role="img" aria-label="Balanza, regla y probeta">
          <rect x="0" y="240" width="560" height="20" fill="#b98d5e" />
          {/* balanza */}
          <rect x="30" y="200" width="150" height="40" rx="6" fill="#dfe3e6" stroke="#555" strokeWidth="2" />
          <rect x="45" y="190" width="120" height="10" rx="3" fill="#aab3ba" />
          <rect x="70" y="212" width="70" height="20" rx="3" fill="#1f2d24" />
          <text x="105" y="227" textAnchor="middle" fontSize="13" fontFamily="monospace" fill="#7dff9a">{H.m !== undefined ? `${f(H.m, 1)} g` : '0,0 g'}</text>
          {!dentroProbeta && <g>
            {O.lados ? <rect x={105 - O.lados[0] * 6} y={190 - O.lados[2] * 6} width={O.lados[0] * 12} height={O.lados[2] * 6} fill={O.color} stroke="#555" />
              : <path d={oi === 4 ? 'M90 190 l5 -14 h20 l5 14 z' : oi === 3 ? 'M80 190 q-4 -22 20 -26 q24 -2 30 16 q4 10 -6 10 z' : 'M92 190 v-26 h26 v26 z'} fill={O.color} stroke="#555" />}
          </g>}
          {/* regla */}
          {H.metodo === 'regla' && O.lados && <g>
            <rect x="205" y="60" width="140" height="18" fill="#f7e27a" stroke="#8a7a2a" />
            {Array.from({ length: 15 }, (_, k) => <line key={k} x1={210 + k * 9} y1="60" x2={210 + k * 9} y2={k % 5 ? 66 : 70} stroke="#333" />)}
            <text x="275" y="100" textAnchor="middle" fontSize="13" fill="#333">{O.lados.join(' cm × ')} cm</text>
          </g>}
          {/* probeta */}
          <path d="M420 30 V230 H470 V30" fill="rgba(255,255,255,0.6)" stroke="#555" strokeWidth="2.5" />
          <rect x="422" y={yN(nivel)} width="46" height={230 - yN(nivel)} fill="#8ec5e8" opacity="0.7" style={{ transition: 'all 0.6s' }} />
          {[50, 60, 70, 80, 90, 100, 110].map((v) => <g key={v}><line x1="420" x2="432" y1={yN(v)} y2={yN(v)} stroke="#333" /><text x="414" y={yN(v) + 4} textAnchor="end" fontSize="11" fill="#333">{v}</text></g>)}
          {dentroProbeta && <g>
            {H.hundido ? <circle cx="445" cy="215" r="10" fill={O.color} stroke="#555" /> : <rect x="433" y={yN(nivel) - 8} width="24" height="17" fill={O.color} stroke="#555" />}
            {alfiler && flota && <line x1="445" y1="10" x2="445" y2="208" stroke="#333" strokeWidth="1.5" />}
          </g>}
          <text x="445" y="252" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="700">{f(nivel, 1)} mL</text>
        </svg>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={pesar} className={BOTON(false)}>Balanza (B)</button>
            <button type="button" onClick={regla} className={BOTON(false)}>Regla (R)</button>
            <button type="button" onClick={probeta} className={BOTON(false)}>Probeta (P)</button>
          </div>
          <label className="flex items-center gap-2"><input type="checkbox" checked={alfiler} onChange={() => setAlfiler((a) => !a)} /> Hundir con un alfiler (H)</label>
          {aviso && <p className="rounded-lg bg-[#fdecea] p-2">{aviso}</p>}
          <div className="rounded-xl bg-[var(--tarjeta)] p-3">
            <p>Masa: <b>{H.m !== undefined ? `${f(H.m)} g` : '—'}</b></p>
            <p>Volumen: <b>{H.v ? `${f(H.v)} cm³` : '—'}</b>{H.metodo === 'regla' && O.lados ? ` (${O.lados.join(' × ')})` : H.metodo === 'probeta' ? ` (${f(nivel)} − ${AGUA0} mL)` : ''}</p>
            {grado < 11 ? <p>Densidad: <b>{d ? `${f(d, 2)} g/cm³` : '—'}</b></p> : <p className="text-[var(--suave)]">En 11° calculas tú la densidad.</p>}
          </div>
          {d && <div>
            <p className="font-semibold">¿De qué material es?</p>
            <div className="mt-1 flex flex-wrap gap-1">
              {TABLA.filter(([t]) => t !== 'Agua').map(([t, dt]) => <button key={t} type="button" onClick={() => poner({ elegido: t })} className={`rounded-full border px-2 py-0.5 text-xs ${H.elegido === t ? 'border-[var(--acento)] bg-[var(--acento)] text-white' : 'border-[var(--linea)] bg-white'}`}>{t} ({f(dt, 1)})</button>)}
            </div>
          </div>}
          <p className="text-xs text-[var(--suave)]">Teclas: 1–6 objeto · B balanza · R regla · P probeta · H alfiler.</p>
        </div>
      </div>
      <button type="button" disabled={!hojas.some((h) => h.elegido)} onClick={() => setVer(true)} className="self-start min-h-10 rounded-full bg-[var(--acento)] px-5 text-sm font-semibold text-white disabled:opacity-50">Comprobar</button>
      {ver && (
        <div className="rounded-xl bg-[var(--tarjeta)] p-3 text-sm">
          {OBJS.map((o, k) => {
            const h = hojas[k]
            if (!h.elegido) return <p key={o.n} className="text-[var(--suave)]">{o.n}: sin identificar.</p>
            const dm = h.m && h.v ? h.m / h.v : 0
            const bien = h.elegido === o.material
            return (
              <p key={o.n} className={`mt-1 ${bien ? 'text-[#1e8449]' : 'text-[#b5462c]'}`}>
                {bien ? '✔' : '✘'} {o.n}: {f(dm, 2)} g/cm³ → {o.material} ({f(o.m / o.v, 2)} g/cm³).
                {!bien && h.metodo === 'probeta' && !h.hundido ? ' Flotaba y no lo hundiste: el volumen salió menor y la densidad, como la del agua.' : ''}
                {' '}{o.m / o.v < 1 ? 'Flota en el agua (menos de 1 g/cm³).' : 'Se hunde en el agua.'}
              </p>
            )
          })}
          <p className="mt-2 rounded-lg bg-[#eaf5ee] p-2"><b>Conclusión:</b> la densidad no depende del tamaño: un clavo y una viga de hierro tienen la misma. Por eso sirve para reconocer materiales. Lo que tiene menos densidad que el agua flota.{grado >= 9 ? ' En el desplazamiento hay que hundir del todo lo que flota (Arquímedes: lo que flota desplaza solo su propio peso de agua).' : ''}</p>
        </div>
      )}
    </div>
  )
}

// ---------- Parte 2: torre de densidades ----------
interface Liq { n: string; d: number; color: string; acuoso: boolean }
const LIQS: Liq[] = [
  { n: 'Miel', d: 1.42, color: '#d99a1e', acuoso: true },
  { n: 'Jabón lavaloza', d: 1.06, color: '#5bbf6a', acuoso: true },
  { n: 'Agua con colorante', d: 1.0, color: '#3d8fd1', acuoso: true },
  { n: 'Aceite', d: 0.92, color: '#f2d24b', acuoso: false },
  { n: 'Alcohol con colorante', d: 0.79, color: '#c0508a', acuoso: true },
]
const SOLIDOS = [
  { n: 'Tuerca', d: 7.9, color: '#6c7a89' },
  { n: 'Uva', d: 1.1, color: '#6b2f6b' },
  { n: 'Cuenta de plástico', d: 0.95, color: '#e8463a' },
  { n: 'Corcho', d: 0.24, color: '#b07a45' },
]
interface Capa { nombres: string[]; d: number; v: number; color: string; acuoso: boolean }

const mezclarColor = (a: string, b: string, wa: number) => {
  const h = (s: string, i: number) => parseInt(s.slice(1 + i * 2, 3 + i * 2), 16)
  return '#' + [0, 1, 2].map((i) => Math.round(h(a, i) * wa + h(b, i) * (1 - wa)).toString(16).padStart(2, '0')).join('')
}

/** Vierte un líquido sobre las capas (de abajo hacia arriba). Cae hasta encontrar algo más denso;
 * si atraviesa o se posa sobre una capa con la que se mezcla (dos líquidos con agua), se mezclan. */
function verter(capas: Capa[], L: Liq): { capas: Capa[]; nota: string } {
  const V = 20
  let i = capas.length // posición final (índice donde se inserta)
  while (i > 0 && capas[i - 1].d < L.d) i--
  const atraviesa = capas.slice(i)
  // al atravesar otro líquido acuoso se mezcla; al posarse encima, solo el alcohol se mezcla con el agua
  const abajo = i > 0 ? capas[i - 1] : undefined
  const conQueSeMezcla = L.acuoso ? atraviesa.find((c) => c.acuoso) ?? (L.d < 0.9 && abajo?.acuoso ? abajo : undefined) : undefined
  if (!conQueSeMezcla) {
    const nueva: Capa = { nombres: [L.n], d: L.d, v: V, color: L.color, acuoso: L.acuoso }
    return { capas: [...capas.slice(0, i), nueva, ...capas.slice(i)], nota: atraviesa.length ? `${L.n}: es más denso, bajó atravesando ${atraviesa.map((c) => c.nombres.join('+').toLowerCase()).join(' y ')}.` : '' }
  }
  const j = capas.indexOf(conQueSeMezcla)
  const c = conQueSeMezcla
  const v = c.v + V
  const mezcla: Capa = { nombres: [...c.nombres, L.n], d: +((c.d * c.v + L.d * V) / v).toFixed(3), v, color: mezclarColor(c.color, L.color, c.v / v), acuoso: true }
  // la mezcla vuelve a acomodarse según su nueva densidad
  const resto = capas.filter((_, k) => k !== j)
  let p = 0
  while (p < resto.length && resto[p].d >= mezcla.d) p++
  return { capas: [...resto.slice(0, p), mezcla, ...resto.slice(p)], nota: `✘ ${L.n} y ${c.nombres.join(' + ').toLowerCase()} se mezclaron en vez de formar capas: los dos se disuelven en agua. Vierte del más denso al menos denso y separa el alcohol del agua con aceite.` }
}

function Torre({ grado }: { grado: number }) {
  const [capas, setCapas] = useState<Capa[]>([])
  const [usados, setUsados] = useState<Set<number>>(new Set())
  const [sol, setSol] = useState<number[]>([])
  const [nota, setNota] = useState('')
  const reiniciar = () => { setCapas([]); setUsados(new Set()); setSol([]); setNota('') }
  const echar = (k: number) => {
    if (usados.has(k) || sol.length) return
    const r = verter(capas, LIQS[k])
    setCapas(r.capas); setNota(r.nota); setUsados((u) => new Set(u).add(k))
  }
  const soltar = (k: number) => { if (capas.length && !sol.includes(k)) setSol((s) => [...s, k]) }
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()
      const n = parseInt(k, 10)
      if (n >= 1 && n <= 5) echar(n - 1)
      else if (n >= 6 && n <= 9) soltar(n - 6)
      else if (k === 'r') reiniciar()
      else return
      e.preventDefault()
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  })
  // dibujo: capas de abajo (índice 0) hacia arriba
  const ALTO = 2.2 // px por mL
  let y = 236
  const rects = capas.map((c) => { const h = c.v * ALTO; y -= h; return { c, y, h } })
  /** altura donde queda un sólido: encima de la última capa más densa que él */
  const ySolido = (d: number) => {
    let yy = 236
    for (const r of rects) if (r.c.d > d) yy = r.y
    return yy
  }
  const capasBien = capas.length === 5 && capas.every((c) => c.nombres.length === 1)
  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-2xl bg-[var(--tarjeta)] p-4 text-sm">Vierte los líquidos en el orden que quieras (teclas 1–5). Lo más denso se va al fondo. Ojo: la miel, el jabón, el agua y el alcohol se pueden mezclar entre sí; el aceite no se mezcla con ninguno. Luego suelta objetos (6–9) y mira dónde se quedan.</p>
      <div className="grid gap-4 md:grid-cols-[260px_1fr]">
        <svg viewBox="0 0 220 260" className="w-full rounded-2xl border border-[var(--linea)] bg-[#f4f1ea]" role="img" aria-label="Torre de densidades">
          {rects.map(({ c, y: yy, h }, k) => <rect key={k} x="62" y={yy} width="96" height={h} fill={c.color} opacity="0.85" style={{ transition: 'all 0.6s' }} />)}
          {rects.map(({ c, y: yy, h }, k) => <text key={`t${k}`} x="166" y={yy + h / 2 + 4} fontSize="10" fill="#333">{c.nombres.length > 1 ? 'mezcla' : c.nombres[0].split(' ')[0]}{grado >= 9 ? ` ${f(c.d, 2)}` : ''}</text>)}
          {sol.map((k, j) => { const S = SOLIDOS[k]; const yy = ySolido(S.d); return <circle key={k} cx={80 + j * 20} cy={yy - 7} r="7" fill={S.color} stroke="#222" style={{ transition: 'all 0.8s' }} /> })}
          <path d="M60 20 V238 H160 V20" fill="none" stroke="#555" strokeWidth="3" />
        </svg>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex flex-wrap gap-2">
            {LIQS.map((L, k) => <button key={L.n} type="button" disabled={usados.has(k) || sol.length > 0} onClick={() => echar(k)} className="rounded-full border border-[var(--linea)] bg-white px-3 py-1 font-semibold disabled:opacity-40"><span className="mr-1 inline-block h-3 w-3 rounded-full align-middle" style={{ background: L.color }} />{k + 1} · {L.n}</button>)}
          </div>
          <div className="flex flex-wrap gap-2">
            {SOLIDOS.map((S, k) => <button key={S.n} type="button" disabled={!capas.length || sol.includes(k)} onClick={() => soltar(k)} className="rounded-full border border-[var(--linea)] bg-white px-3 py-1 font-semibold disabled:opacity-40">{k + 6} · {S.n}{grado >= 9 ? ` (${f(S.d, 2)})` : ''}</button>)}
          </div>
          {nota && <p className={`rounded-lg p-2 ${nota.startsWith('✘') ? 'bg-[#fdecea]' : 'bg-[var(--tarjeta)]'}`}>{nota}</p>}
          {capasBien && <p className="rounded-lg bg-[#eaf5ee] p-2">✔ ¡Cinco capas! De abajo arriba: miel, jabón, agua, aceite y alcohol. El aceite separa el agua del alcohol.</p>}
          {sol.length > 0 && <p className="rounded-lg bg-[var(--tarjeta)] p-2">Cada objeto se queda flotando sobre el primer líquido más denso que él: la tuerca al fondo, la uva entre el jabón y la miel{grado >= 9 ? ' (si hay miel)' : ''}, la cuenta sobre el agua y bajo el aceite, el corcho arriba.</p>}
          <button type="button" onClick={reiniciar} className="self-start rounded-full border border-[var(--linea)] px-4 py-1 font-semibold">Vaciar (R)</button>
        </div>
      </div>
    </div>
  )
}

export default function Densidades({ grado }: { grado: number }) {
  const [parte, setParte] = useState(0)
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {['1. Densidad de sólidos', '2. Torre de densidades'].map((t, k) => <button key={t} type="button" onClick={() => setParte(k)} className={BOTON(parte === k)}>{t}</button>)}
      </div>
      {parte === 0 ? <Solidos grado={grado} /> : <Torre grado={grado} />}
      <p className="text-xs text-[var(--suave)]">Versión casera: gramera de cocina, jeringa o vaso medidor, regla, y para la torre un vaso alto con miel, lavaloza, agua, aceite y alcohol (este último lo maneja un adulto, lejos del fuego). Densidades aproximadas.</p>
    </div>
  )
}
