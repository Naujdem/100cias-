import { useCallback, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import MesaViva from '../MesaViva.tsx'
import type { Pieza, Uso } from '../MesaViva.tsx'
import { Caneca } from '../dibujos.tsx'

// Laboratorio de Química 3 (PLAN-LABORATORIOS.md): mezclas y técnicas de separación.
// En mesa viva. Parte 1: retos de separar una mezcla pasándola a mano por los aparatos en el orden que el
// estudiante quiera (imán y agua al vaso; el vaso al tamiz, filtro, embudo de decantación, estufa o destilador). El resultado depende del orden.
// Parte 2: cromatografía: punto de marcador en la tira y tira al vaso de agua o alcohol; el tiempo corre solo.
// Modelo cualitativo.

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

const BLANCO = { fill: 'rgba(255,255,255,0.7)', stroke: '#2b2b2b', strokeWidth: 2 }
const APARATOS: { id: string; t: number; n: string; x: number; y: number; ancho: number; alto: number; dib: ReactNode }[] = [
  { id: 'tamiz', t: 1, n: 'Tamiz', x: 400, y: 340, ancho: 80, alto: 40, dib: <g><ellipse rx="34" ry="9" fill="#d9d9d9" stroke="#2b2b2b" strokeWidth="2" /><path d="M-30 0 Q0 26 30 0" fill="none" stroke="#2b2b2b" strokeWidth="2" strokeDasharray="3 2" /><path d="M34 -2 H52" stroke="#8a6a45" strokeWidth="5" /></g> },
  { id: 'filtro', t: 3, n: 'Embudo con papel filtro', x: 490, y: 300, ancho: 70, alto: 120, dib: <g><path d="M-26 -50 H26 L5 -18 V0 H-5 V-18 Z" {...BLANCO} /><path d="M-20 -48 L0 -22 L20 -48" fill="#fff" stroke="#bbb" /><rect x="-6" y="0" width="12" height="4" fill="#555" /><path d="M-18 14 V58 H18 V14" {...BLANCO} /></g> },
  { id: 'decantacion', t: 4, n: 'Embudo de decantación', x: 590, y: 270, ancho: 70, alto: 180, dib: <g><line x1="-34" x2="-34" y1="-88" y2="88" stroke="#555" strokeWidth="4" /><line x1="-34" x2="-14" y1="-40" y2="-40" stroke="#555" strokeWidth="3" /><path d="M-4 -86 H4 V-76 Q24 -60 18 -20 L4 0 V20 H-4 V0 L-18 -20 Q-24 -60 -4 -76 Z" {...BLANCO} /><rect x="-9" y="-4" width="18" height="6" fill="#c0392b" /><path d="M-18 46 V88 H18 V46" {...BLANCO} /></g> },
  { id: 'estufa', t: 5, n: 'Cápsula sobre la estufa (evaporar)', x: 700, y: 325, ancho: 90, alto: 70, dib: <g><rect x="-38" y="6" width="76" height="28" rx="4" fill="#5d6d7e" stroke="#2b2b2b" strokeWidth="2" /><circle cx="22" cy="20" r="5" fill="#e74c3c" /><path d="M-26 6 Q0 -2 26 6" fill="none" stroke="#e67e22" strokeWidth="3" /><path d="M-30 -2 Q0 22 30 -2 Z" fill="#f4f4f4" stroke="#2b2b2b" strokeWidth="2" /></g> },
  { id: 'destilador', t: 6, n: 'Destilador (balón y refrigerante)', x: 840, y: 300, ancho: 150, alto: 120, dib: <g><circle cx="-44" cy="20" r="22" {...BLANCO} /><rect x="-48" y="-26" width="8" height="26" {...BLANCO} /><path d="M-40 -18 L46 18" stroke="#2b2b2b" strokeWidth="9" /><path d="M-40 -18 L46 18" stroke="#cfe6f5" strokeWidth="5" /><path d="M42 30 V58 H66 V30" {...BLANCO} /><path d="M-60 46 H-28 L-34 58 H-54 Z" fill="#5d6d7e" /><path d="M-44 42 q-4 -6 0 -10 q4 6 0 10" fill="#f39c12" /></g> },
]

function Separacion({ grado }: { grado: number }) {
  const retos = RETOS.filter((r) => grado >= r.desde)
  const [ri, setRi] = useState(0)
  const R = retos[ri]
  const [e, setE] = useState<Estado>(() => inicio(R))
  const [ver, setVer] = useState(false)
  const cambiar = (k: number) => { setRi(k); setE(inicio(retos[k])); setVer(false) }
  const todas: Salida[] = [...e.salidas, ...(e.vaso.length ? [{ comps: e.vaso, como: 'lo que quedó en el vaso', turbio: e.turbio }] : [])]
  const pura = (s: Salida) => s.comps.length === 1 && !s.turbio
  const liq = e.vaso.filter((c) => LIQ.includes(c))
  const capas = liq.includes('agua') && liq.includes('alcohol') ? (['agua'] as Comp[]) : liq // agua y alcohol: una sola fase
  const vasoDib = (
    <g transform="translate(-100 -131)">
      {capas.map((c, k) => {
        const h = capas.length === 1 ? 100 : 50
        const yy = 200 - h * (k + 1) // el agua abajo, el aceite arriba
        const color = c === 'agua' && liq.includes('alcohol') ? '#c4c9ea' : COL[c]
        return <rect key={c} x="42" y={yy} width="116" height={h} fill={color} opacity={e.turbio ? 1 : 0.7} />
      })}
      {e.turbio && <rect x="42" y={100} width="116" height={100} fill="#c8a970" opacity="0.35" />}
      <Puntos comps={e.vaso} x={42} y={150} w={116} h={50} />
      <path d="M40 60 V202 H160 V60" fill="none" stroke="#555" strokeWidth="3" />
    </g>
  )
  const piezas: Pieza[] = [
    { id: 'vaso', nombre: e.vaso.length ? `Vaso: ${e.vaso.map((c) => NOM[c]).join(' + ')}` : 'Vaso vacío', x: 110, y: 289, ancho: 130, alto: 150, tomable: e.vaso.length > 0, color: liq.length ? COL[liq[0]] : '#c9b28a', dibujo: vasoDib },
    { id: 'iman', nombre: 'Imán', x: 235, y: 345, ancho: 50, alto: 30, tomable: true, dibujo: <g><path d="M-16 10 V-4 A16 16 0 0 1 16 -4 V10" fill="none" stroke="#c0392b" strokeWidth="9" /><rect x="-20" y="6" width="8" height="8" fill="#ddd" /><rect x="12" y="6" width="8" height="8" fill="#ddd" /></g> },
    { id: 'agua', nombre: 'Agua', x: 310, y: 330, ancho: 60, alto: 70, tomable: true, color: COL.agua, dibujo: <g><path d="M-22 -30 H22 V28 Q22 34 16 34 H-16 Q-22 34 -22 28 Z" fill="rgba(255,255,255,0.7)" stroke="#2b2b2b" strokeWidth="2" /><rect x="-20" y="-6" width="40" height="38" rx="4" fill={COL.agua} opacity="0.8" /></g> },
    ...APARATOS.map((A) => ({ id: A.id, nombre: A.n, x: A.x, y: A.y, ancho: A.ancho, alto: A.alto, dibujo: A.dib })),
    { id: 'caneca', nombre: 'Residuos (toca: empezar de nuevo)', x: 955, y: 324, ancho: 54, alto: 76, alTocar: () => { setE(inicio(R)); setVer(false) }, dibujo: <Caneca /> },
  ]
  const destinos = (de: string) => (de === 'vaso' ? APARATOS.map((A) => A.id) : ['vaso'])
  const soltar = (de: string, en: string): Uso | string => {
    if (ver) setVer(false)
    if (de === 'vaso') {
      const A = APARATOS.find((x) => x.id === en)
      if (!A) return 'Pasa la mezcla por uno de los aparatos.'
      return { anim: 'verter', hecho: () => setE((x) => aplicar(x, A.t, grado)) }
    }
    if (en !== 'vaso') return 'Eso se usa en el vaso con la mezcla.'
    if (de === 'iman') return { anim: 'frotar', hecho: () => setE((x) => aplicar(x, 0, grado)) }
    if (de === 'agua') return { anim: 'verter', hecho: () => setE((x) => aplicar(x, 2, grado)) }
    return 'No se puede.'
  }
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {retos.map((r, k) => <button key={r.n} type="button" onClick={() => cambiar(k)} className={BOTON(k === ri)}>{r.n}</button>)}
      </div>
      <p className="rounded-2xl bg-[var(--tarjeta)] p-4 text-sm">Meta: recuperar <b>{R.meta.map((c) => NOM[c]).join(', ')}</b>, cada cosa pura. Pasa el imán por el vaso o échale agua, y toma el vaso para verter la mezcla en el aparato que quieras: tamiz, embudo con filtro, embudo de decantación, estufa o destilador. El orden importa.</p>
      <MesaViva desde={90} piezas={piezas} destinos={destinos} soltar={soltar} />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl bg-[var(--tarjeta)] p-3 text-sm">
          <p className="font-semibold">Lo que has separado</p>
          {e.salidas.length ? <div className="mt-1 flex flex-wrap gap-2">{e.salidas.map((x, k) => <span key={k} className="rounded-full border border-[var(--linea)] bg-white px-2 py-0.5">{x.comps.map((c) => NOM[c]).join(' + ')}{x.turbio ? ' (turbio)' : ''} <span className="text-[var(--suave)]">· {x.como}</span></span>)}</div> : <p className="text-[var(--suave)]">Nada todavía.</p>}
          {e.perdido.length > 0 && <p className="mt-1 text-[#b5462c]">Al aire: {e.perdido.map((c) => NOM[c]).join(', ')}</p>}
        </div>
        <ol className="list-decimal rounded-xl bg-[var(--tarjeta)] p-3 pl-7 text-sm">
          {e.log.length ? e.log.map((m, k) => <li key={k} className={m.startsWith('✘') ? 'text-[#b5462c]' : ''}>{m}</li>) : <li className="list-none text-[var(--suave)]">Todavía no has hecho nada.</li>}
        </ol>
      </div>
      <button type="button" onClick={() => setVer(true)} className="self-start min-h-10 rounded-full bg-[var(--acento)] px-5 text-sm font-semibold text-white">Comprobar</button>
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
  const [ti, setTi] = useState<number | null>(null) // tinta puesta en la tira
  const [en, setEn] = useState<'agua' | 'alcohol' | null>(null) // vaso donde está la tira
  const [t, setT] = useState(0)
  useEffect(() => {
    if (!en || t >= 10) return
    const id = window.setTimeout(() => setT((x) => x + 1), 1000) // 1 s = 1 min
    return () => window.clearTimeout(id)
  }, [en, t])
  const T = ti !== null ? TINTAS[ti] : null
  const alcohol = en === 'alcohol'
  const corre = T && (!T.permanente || alcohol)
  const frente = Math.min(1, t / 10)
  const Y0 = 200, Y1 = 40
  const yFrente = Y0 - (Y0 - Y1) * frente
  // la tira vieja (x 60–100, y 20–225) centrada en (80, 122)
  const tira = (
    <g transform="translate(-80 -122)">
      <rect x="60" y="20" width="40" height="205" fill="#fff" stroke="#999" />
      {en && <rect x="60" y={yFrente} width="40" height={225 - yFrente} fill={alcohol ? '#efe9f7' : '#e3f1fb'} opacity="0.9" style={{ transition: 'all 0.6s' }} />}
      {t > 0 && <line x1="58" x2="102" y1={yFrente} y2={yFrente} stroke="#2f6d99" strokeDasharray="3 3" />}
      {T && (t > 0 && corre ? T.bandas.map((b) => <ellipse key={b.c} cx="80" cy={Y0 - (Y0 - Y1) * frente * b.rf} rx="10" ry={4 + 6 * frente} fill={b.c} opacity="0.85" style={{ transition: 'all 0.6s' }} />) : <circle cx="80" cy={Y0} r="6" fill="#222" />)}
      <line x1="56" x2="104" y1={Y0} y2={Y0} stroke="#888" strokeDasharray="2 2" />
    </g>
  )
  const COLM = ['#222', '#6b3d1f', '#1e7d3a', '#6a2c91', '#111']
  const posVaso = { agua: 560, alcohol: 720 }
  const piezas: Pieza[] = [
    ...TINTAS.map((x, k) => ({ id: `m${k}`, nombre: x.n, x: 60 + k * 48, y: 330, ancho: 30, alto: 70, tomable: true, dibujo: <g><rect x="-8" y="-30" width="16" height="52" rx="4" fill={COLM[k]} /><rect x="-7" y="-36" width="14" height="8" fill="#ddd" /><path d="M-4 22 L0 32 L4 22 Z" fill={COLM[k]} />{x.permanente && <text y="0" textAnchor="middle" fontSize="7" fill="#fff" transform="rotate(-90)">PERM.</text>}</g> })),
    { id: 'tira', nombre: en ? 'Tira (tómala para sacarla)' : ti !== null ? `Tira con ${TINTAS[ti].n.toLowerCase()}` : 'Tira de papel filtro', ...(en ? { x: posVaso[en], y: 242 } : { x: 380, y: 290 }), ancho: 46, alto: 210, tomable: true, dibujo: tira },
    ...(['agua', 'alcohol'] as const).map((sv) => ({ id: sv, nombre: `Vaso con ${sv}`, x: posVaso[sv], y: 340, ancho: 110, alto: 50, dibujo: <g><path d="M-50 -24 V20 H50 V-24" fill="rgba(255,255,255,0.6)" stroke="#2b2b2b" strokeWidth="2.5" /><rect x="-48" y="-2" width="96" height="21" fill={sv === 'alcohol' ? '#e9e3f2' : '#cfe6f5'} /><text y="36" textAnchor="middle" fontSize="11" fontWeight="700">{sv}</text></g> })),
    { id: 'caneca', nombre: 'Residuos (toca: tira nueva)', x: 930, y: 324, ancho: 54, alto: 76, alTocar: () => { setTi(null); setEn(null); setT(0) }, dibujo: <Caneca /> },
  ]
  const alTomar = useCallback((id: string | null) => { if (id === 'tira') setEn((x) => { if (x) setT(0); return null }) }, [])
  const destinos = (de: string) => (de === 'tira' ? ['agua', 'alcohol'] : ['tira'])
  const soltar = (de: string, a: string): Uso | string => {
    if (de.startsWith('m')) {
      if (a !== 'tira') return 'El punto de tinta se pone en la tira, sobre la línea de lápiz.'
      if (en) return 'Saca primero la tira del vaso.'
      if (t > 0) return 'Esa tira ya se usó: bota la tira en residuos y toma una nueva.'
      return { anim: 'frotar', hecho: () => setTi(+de.slice(1)) }
    }
    if (a !== 'agua' && a !== 'alcohol') return 'La tira se mete en un vaso con solvente.'
    if (ti === null) return 'Primero pon un punto de tinta en la tira con un marcador.'
    if (t > 0) return 'Esa tira ya se usó: bota la tira en residuos y toma una nueva.'
    return { anim: 'poner', hecho: () => { setEn(a); setT(0) } }
  }
  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-2xl bg-[var(--tarjeta)] p-4 text-sm">Pon un punto de tinta en la tira de papel filtro con un marcador y mete la punta en el vaso con agua o con alcohol (la tinta no debe tocar el líquido). El solvente sube y arrastra cada colorante a distinta velocidad: los que se pegan menos al papel llegan más lejos. Así se ve que una tinta es una <b>mezcla</b>. El tiempo corre acelerado: 1 s = 1 min.</p>
      <MesaViva desde={110} piezas={piezas} destinos={destinos} soltar={soltar} alTomar={alTomar} />
      {en && <p className="-mt-2 text-sm">⏱ {t} de 10 min en {en}.</p>}
      {t >= 10 && T && <div className="rounded-xl bg-[var(--tarjeta)] p-3 text-sm">
        {corre ? <p>La tinta tenía <b>{T.bandas.length} colorantes</b>. {grado >= 11 ? `Rf = distancia del color ÷ distancia del solvente; el más alto aquí es ${T.bandas[0].rf.toLocaleString('es-CO')}.` : 'El que sube más es el que menos se pega al papel.'}</p>
          : <p>✘ La tinta permanente no se disuelve en agua: no se movió. Prueba con alcohol.</p>}
      </div>}
      <p className="text-xs text-[var(--suave)]">Los colores de cada marcador cambian según la marca: son de ejemplo.</p>
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
