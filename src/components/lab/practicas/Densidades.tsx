import { useCallback, useState } from 'react'
import MesaViva from '../MesaViva.tsx'
import type { Pieza, Uso } from '../MesaViva.tsx'
import { Balanza, Caneca } from '../dibujos.tsx'

// Laboratorio de Química 2 (PLAN-LABORATORIOS.md): densidades.
// En mesa viva. Parte 1: cada objeto se lleva a la balanza, a la regla (regulares) o a la probeta (desplazamiento);
// d = m/V e identificar el material. Errores: regla con un objeto irregular, objeto que flota sin hundirlo con el alfiler.
// Parte 2: torre de densidades, vertiendo cada frasco en el vaso; si un líquido cae a través de otro con el que se mezcla, se mezclan.
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

function DibObj({ o, k }: { o: Obj; k: number }) {
  if (o.lados) return <rect x={-o.lados[0] * 4} y={-o.lados[2] * 4} width={o.lados[0] * 8} height={o.lados[2] * 8} fill={o.color} stroke="#555" strokeWidth="1.5" />
  const d = k === 4 ? 'M-12 8 l5 -16 h14 l5 16 z' : k === 3 ? 'M-16 10 q-4 -20 14 -22 q18 -2 18 14 q2 8 -6 8 z' : 'M-12 10 v-20 h24 v20 z'
  return <g><path d={d} fill={o.color} stroke="#555" strokeWidth="1.5" />{k === 4 && <circle cy="1" r="4" fill="#f4f1ea" stroke="#555" />}</g>
}

function Solidos({ grado }: { grado: number }) {
  const [oi, setOi] = useState(0)
  const [hojas, setHojas] = useState<Hoja[]>(OBJS.map(() => ({})))
  const [enProbeta, setEnProbeta] = useState<number | null>(null)
  const [alfiler, setAlfiler] = useState(false)
  const [pesado, setPesado] = useState<number | null>(null)
  const [medido, setMedido] = useState<number | null>(null)
  const [aviso, setAviso] = useState('')
  const [ver, setVer] = useState(false)
  const O = OBJS[oi]
  const H = hojas[oi]
  const poner = (k: number, p: Partial<Hoja>) => setHojas((hs) => hs.map((h, j) => (j === k ? { ...h, ...p } : h)))
  const flotaK = (k: number) => OBJS[k].m / OBJS[k].v < 1
  const hundidoP = enProbeta !== null && (!flotaK(enProbeta) || alfiler)
  const desplaza = enProbeta === null ? 0 : hundidoP ? OBJS[enProbeta].v : OBJS[enProbeta].m
  const nivel = AGUA0 + +(Math.round(desplaza * 2) / 2).toFixed(1)
  const yN = (ml: number) => 230 - ml * 1.7
  // la probeta vieja (x 420–470, y 30–230) centrada en (445, 130) y puesta con el fondo en la mesa
  const PX = 790, PY = 260
  const enMesa = (x: number, y: number) => ({ x: x - 445 + PX, y: y - 130 + PY })
  const alTomar = useCallback((id: string | null) => {
    if (id?.startsWith('o')) setEnProbeta((p) => (p === +id.slice(1) ? null : p))
    if (id === 'alfiler') setAlfiler(false)
  }, [])
  const piezas: Pieza[] = [
    ...OBJS.map((o, k) => {
      const dentro = enProbeta === k
      const pos = dentro ? enMesa(445, hundidoP ? 215 : yN(nivel) - 2) : { x: 50 + k * 58, y: 350 - (o.lados ? o.lados[2] * 4 : 10) }
      return { id: `o${k}`, nombre: `${o.n}${hojas[k].elegido ? ' ✓' : ''}`, ...pos, ancho: 50, alto: 40, tomable: true, dibujo: <g transform={dentro ? 'scale(0.75)' : undefined}><DibObj o={o} k={k} /></g> }
    }),
    { id: 'balanza', nombre: 'Balanza', x: 450, y: 315, ancho: 140, alto: 90, dibujo: <g transform="scale(1.5)"><Balanza lectura={pesado !== null ? `${f(OBJS[pesado].m, 1)} g` : '0,0 g'} /></g> },
    { id: 'regla', nombre: 'Regla', x: 610, y: 350, ancho: 170, alto: 24, dibujo: <g><rect x="-80" y="-9" width="160" height="18" fill="#f7e27a" stroke="#8a7a2a" />{Array.from({ length: 17 }, (_, k) => <line key={k} x1={-76 + k * 9.5} y1="-9" x2={-76 + k * 9.5} y2={k % 5 ? -3 : 1} stroke="#333" />)}{medido !== null && OBJS[medido].lados && <text y="-16" textAnchor="middle" fontSize="13" fontWeight="700" fill="#333">{OBJS[medido].lados!.join(' cm × ')} cm</text>}</g> },
    {
      id: 'probeta', nombre: `Probeta con ${AGUA0} mL de agua`, x: PX, y: PY, ancho: 80, alto: 210,
      dibujo: <g transform="translate(-445 -130)">
        <path d="M420 30 V230 H470 V30" fill="rgba(255,255,255,0.6)" stroke="#555" strokeWidth="2.5" />
        <rect x="422" y={yN(nivel)} width="46" height={230 - yN(nivel)} fill="#8ec5e8" opacity="0.7" style={{ transition: 'all 0.6s' }} />
        {[50, 60, 70, 80, 90, 100, 110].map((v) => <g key={v}><line x1="420" x2="432" y1={yN(v)} y2={yN(v)} stroke="#333" /><text x="414" y={yN(v) + 4} textAnchor="end" fontSize="11" fill="#333">{v}</text></g>)}
        {alfiler && <line x1="445" y1="10" x2="445" y2="208" stroke="#333" strokeWidth="1.5" />}
        <rect x="420" y="230" width="50" height="5" fill="#555" />
      </g>,
    },
    { id: 'alfiler', nombre: alfiler ? 'Alfiler (tómalo para sacarlo)' : 'Alfiler (para hundir)', ...(alfiler ? { x: PX, y: PY - 110 } : { x: 920, y: 352 }), ancho: 50, alto: 16, tomable: true, dibujo: alfiler ? <circle r="4" fill="#c0392b" /> : <g><line x1="-20" x2="18" stroke="#333" strokeWidth="1.8" /><circle cx="-20" r="4" fill="#c0392b" /></g> },
  ]
  const destinos = (de: string) => (de === 'alfiler' ? ['probeta'] : ['balanza', 'regla', 'probeta'])
  const soltar = (de: string, en: string): Uso | string => {
    setAviso('')
    if (de === 'alfiler') {
      if (enProbeta === null) return 'No hay nada en la probeta que hundir.'
      if (!flotaK(enProbeta)) return 'Ese objeto ya se hunde solo: no hace falta el alfiler.'
      const k = enProbeta
      return { anim: 'poner', hecho: () => { setAlfiler(true); poner(k, { v: OBJS[k].v, metodo: 'probeta', hundido: true }) } }
    }
    const k = +de.slice(1)
    setOi(k)
    if (en === 'balanza') {
      if (enProbeta === k) return 'Está mojado dentro de la probeta: pésalo antes de meterlo al agua.'
      return { anim: 'poner', hecho: () => { setPesado(k); poner(k, { m: OBJS[k].m }) } }
    }
    if (en === 'regla') {
      if (!OBJS[k].lados) return 'La regla no sirve: este objeto no tiene lados rectos para medir largo, ancho y alto. Usa la probeta (desplazamiento de agua).'
      return { anim: 'poner', hecho: () => { setMedido(k); poner(k, { v: OBJS[k].v, metodo: 'regla' }) } }
    }
    if (en === 'probeta') {
      if (enProbeta !== null && enProbeta !== k) return `Primero saca ${OBJS[enProbeta].n.toLowerCase()} de la probeta (tómalo y suéltalo en la mesa).`
      return {
        anim: 'poner',
        hecho: () => {
          setEnProbeta(k)
          const flota = flotaK(k)
          poner(k, { v: +(Math.round((flota ? OBJS[k].m : OBJS[k].v) * 2) / 2).toFixed(1), metodo: 'probeta', hundido: !flota })
          if (flota) setAviso('⚠ El objeto flota: solo una parte queda bajo el agua. Húndelo con el alfiler.')
        },
      }
    }
    return 'Llévalo a la balanza, a la regla o a la probeta.'
  }
  const d = H.m !== undefined && H.v ? H.m / H.v : undefined
  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-2xl bg-[var(--tarjeta)] p-4 text-sm">
        <b>Densidad = masa ÷ volumen</b>: cuánta materia hay en cada cm³. Lleva cada objeto a la <b>balanza</b> para su masa. Para el volumen: si tiene forma regular, a la <b>regla</b> (largo × ancho × alto); si es irregular, a la <b>probeta</b> con agua: lo que sube el agua es su volumen (1 mL = 1 cm³).
      </p>
      <MesaViva desde={110} piezas={piezas} destinos={destinos} soltar={soltar} alTomar={alTomar} />
      {aviso && <p className="-mt-2 rounded-lg bg-[#fdecea] p-2 text-sm">{aviso}</p>}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-[var(--tarjeta)] p-3 text-sm">
          <p className="font-semibold">Hoja de datos: {O.n}</p>
          <p>Masa: <b>{H.m !== undefined ? `${f(H.m)} g` : '—'}</b></p>
          <p>Volumen: <b>{H.v ? `${f(H.v)} cm³` : '—'}</b>{H.metodo === 'regla' && O.lados ? ` (${O.lados.join(' × ')})` : H.metodo === 'probeta' ? ` (${f(AGUA0 + H.v!)} − ${AGUA0} mL)` : ''}</p>
          {grado < 11 ? <p>Densidad: <b>{d ? `${f(d, 2)} g/cm³` : '—'}</b></p> : <p className="text-[var(--suave)]">En 11° calculas tú la densidad.</p>}
        </div>
        {d && <div className="text-sm">
          <p className="font-semibold">¿De qué material es {O.n.toLowerCase()}?</p>
          <div className="mt-1 flex flex-wrap gap-1">
            {TABLA.filter(([t]) => t !== 'Agua').map(([t, dt]) => <button key={t} type="button" onClick={() => poner(oi, { elegido: t })} className={`rounded-full border px-2 py-0.5 text-xs ${H.elegido === t ? 'border-[var(--acento)] bg-[var(--acento)] text-white' : 'border-[var(--linea)] bg-white'}`}>{t} ({f(dt, 1)})</button>)}
          </div>
        </div>}
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
  const piezas: Pieza[] = [
    ...LIQS.map((L, k) => ({
      id: `l${k}`, nombre: usados.has(k) ? `${L.n} (ya lo echaste)` : L.n, x: 60 + k * 75, y: 318, ancho: 56, alto: 84, tomable: !usados.has(k), color: L.color,
      dibujo: <g opacity={usados.has(k) ? 0.4 : 1}><rect x="-8" y="-42" width="16" height="12" fill="#555" /><path d="M-8 -30 Q-22 -26 -22 -12 V40 H22 V-12 Q22 -26 8 -30 Z" fill="rgba(255,255,255,0.7)" stroke="#2b2b2b" strokeWidth="2" />{!usados.has(k) && <rect x="-20" y="-6" width="40" height="44" fill={L.color} opacity="0.85" />}<text y="54" textAnchor="middle" fontSize="9" fontWeight="700">{L.n.split(' ')[0]}{grado >= 9 ? ` ${f(L.d, 2)}` : ''}</text></g>,
    })),
    ...SOLIDOS.map((S, k) => ({ id: `s${k}`, nombre: `${S.n}${grado >= 9 ? ` (${f(S.d, 2)} g/cm³)` : ''}`, x: 470 + k * 48, y: 392, ancho: 36, alto: 30, tomable: !sol.includes(k), dibujo: sol.includes(k) ? <g /> : <circle r="9" fill={S.color} stroke="#222" /> })),
    {
      id: 'vaso', nombre: 'Vaso alto', x: 700, y: 251, ancho: 120, alto: 225,
      dibujo: <g transform="translate(-110 -129)">
        {rects.map(({ c, y: yy, h }, k) => <rect key={k} x="62" y={yy} width="96" height={h} fill={c.color} opacity="0.85" style={{ transition: 'all 0.6s' }} />)}
        {rects.map(({ c, y: yy, h }, k) => <text key={`t${k}`} x="166" y={yy + h / 2 + 4} fontSize="10" fill="#333">{c.nombres.length > 1 ? 'mezcla' : c.nombres[0].split(' ')[0]}{grado >= 9 ? ` ${f(c.d, 2)}` : ''}</text>)}
        {sol.map((k, j) => { const S = SOLIDOS[k]; const yy = ySolido(S.d); return <circle key={k} cx={80 + j * 20} cy={yy - 7} r="7" fill={S.color} stroke="#222" style={{ transition: 'all 0.8s' }} /> })}
        <path d="M60 20 V238 H160 V20" fill="none" stroke="#555" strokeWidth="3" />
      </g>,
    },
    { id: 'caneca', nombre: 'Residuos (toca: vaciar el vaso)', x: 930, y: 324, ancho: 54, alto: 76, alTocar: reiniciar, dibujo: <Caneca /> },
  ]
  const soltar = (de: string, en: string): Uso | string => {
    if (en !== 'vaso') return 'Eso va en el vaso alto.'
    const k = +de.slice(1)
    if (de.startsWith('l')) {
      if (sol.length) return 'Ya soltaste objetos: vacía el vaso para volver a verter.'
      return { anim: 'verter', hecho: () => { const r = verter(capas, LIQS[k]); setCapas(r.capas); setNota(r.nota); setUsados((u) => new Set(u).add(k)) } }
    }
    if (!capas.length) return 'Primero vierte líquidos en el vaso.'
    return { anim: 'poner', hecho: () => setSol((x) => [...x, k]) }
  }
  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-2xl bg-[var(--tarjeta)] p-4 text-sm">Toma cada frasco y viértelo en el vaso alto, en el orden que quieras. Lo más denso se va al fondo. Ojo: la miel, el jabón, el agua y el alcohol se pueden mezclar entre sí; el aceite no se mezcla con ninguno. Luego suelta los objetos en el vaso y mira dónde se quedan.</p>
      <MesaViva desde={90} piezas={piezas} destinos={() => ['vaso']} soltar={soltar} />
      {nota && <p className={`-mt-2 rounded-lg p-2 text-sm ${nota.startsWith('✘') ? 'bg-[#fdecea]' : 'bg-[var(--tarjeta)]'}`}>{nota}</p>}
      {capasBien && <p className="rounded-lg bg-[#eaf5ee] p-2 text-sm">✔ ¡Cinco capas! De abajo arriba: miel, jabón, agua, aceite y alcohol. El aceite separa el agua del alcohol.</p>}
      {sol.length > 0 && <p className="rounded-lg bg-[var(--tarjeta)] p-2 text-sm">Cada objeto se queda flotando sobre el primer líquido más denso que él: la tuerca al fondo, la uva entre el jabón y la miel{grado >= 9 ? ' (si hay miel)' : ''}, la cuenta sobre el agua y bajo el aceite, el corcho arriba.</p>}
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
