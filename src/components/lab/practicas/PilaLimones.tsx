import { useState } from 'react'
import MesaViva from '../MesaViva.tsx'
import type { Pieza, Uso } from '../MesaViva.tsx'
import { Caneca } from '../dibujos.tsx'

// Práctica extra 2 (PLAN-LABORATORIOS.md): pila de limones, Química área 3, desde 6°.
// Limones a la bandeja (hasta 4); en cada limón se clavan dos electrodos (el primero queda a la izquierda);
// cada cable se suelta en un limón para unirlo con el anterior (derecho del anterior con izquierdo de este);
// el voltímetro o el LED se sueltan en la pinza de un extremo: en la derecha, la punta roja o la pata larga van
// al electrodo derecho. Voltaje de cada limón ≈ 0,85 × (E° derecho − E° izquierdo). Hierro desde 9°, magnesio en 11°.
// El LED rojo necesita ≈ 2,4 V con la poca corriente de los limones.

const f = (x: number, d = 2) => x.toLocaleString('es-CO', { minimumFractionDigits: d, maximumFractionDigits: d })

type Metal = 'zinc' | 'cobre' | 'hierro' | 'magnesio'
const METAL: Record<Metal, { n: string; E: number; c: string; desde: number }> = {
  zinc: { n: 'Clavo galvanizado (zinc)', E: -0.76, c: '#a9b4bd', desde: 6 },
  cobre: { n: 'Alambre de cobre', E: 0.34, c: '#c8742f', desde: 6 },
  hierro: { n: 'Clavo de hierro sin galvanizar', E: -0.44, c: '#5d5348', desde: 9 },
  magnesio: { n: 'Cinta de magnesio', E: -2.37, c: '#dfe3e6', desde: 11 },
}
const SIMB: Record<Metal, string> = { zinc: 'Zn', cobre: 'Cu', hierro: 'Fe', magnesio: 'Mg' }
const MAX = 4
const LED_V = 2.4

export default function PilaLimones({ grado }: { grado: number }) {
  const [limones, setLimones] = useState<Metal[][]>([])
  const [cables, setCables] = useState(0) // cables k = 1..n-1 unen el limón k-1 con el k
  const [aparato, setAparato] = useState<{ tipo: 'volt' | 'led'; lado: 'izq' | 'der' } | null>(null)
  const [msg, setMsg] = useState<{ t: string; aviso?: boolean } | null>(null)
  const [vistos, setVistos] = useState<{ n: number; V: number; led: boolean }[]>([])

  const n = limones.length
  const falla = (() => {
    if (!n) return 'No hay limones.'
    const k = limones.findIndex((l) => l.length < 2)
    if (k >= 0) return `Al limón ${k + 1} le falta un electrodo.`
    if (cables < n - 1) return `Falta unir el limón ${cables + 1} con el ${cables + 2}: el circuito está abierto.`
    return null
  })()
  const celdas = limones.map((l) => (l.length === 2 ? 0.85 * (METAL[l[1]].E - METAL[l[0]].E) : 0))
  const V = falla ? 0 : celdas.reduce((a, b) => a + b, 0)
  const lectura = aparato ? (aparato.lado === 'der' ? V : -V) : 0
  const ledOn = aparato?.tipo === 'led' && !falla && lectura >= LED_V
  const brillo = ledOn ? Math.min(1, 0.35 + (lectura - LED_V) / 2) : 0

  const conectar = (tipo: 'volt' | 'led', lado: 'izq' | 'der') => {
    setAparato({ tipo, lado })
    const L = lado === 'der' ? V : -V
    if (falla) { setMsg({ t: `${tipo === 'volt' ? 'El voltímetro marca 0,00 V' : 'El LED no enciende'}. ${falla}`, aviso: true }); return }
    if (limones.some((l) => l[0] === l[1])) setMsg({ t: 'Un limón tiene los dos electrodos del mismo metal: ese limón no da voltaje. Se necesitan dos metales distintos.', aviso: true })
    else if (tipo === 'volt') setMsg(L < 0 ? { t: `Marca ${f(L)} V: el número salió negativo porque la punta roja quedó en el polo negativo. Pásala a la otra pinza.`, aviso: true } : { t: `El voltímetro marca ${f(L)} V con ${n} limón${n > 1 ? 'es' : ''}.` })
    else if (L >= LED_V) setMsg({ t: `¡El LED enciende! Le llegan ${f(L)} V.` })
    else if (-L >= LED_V) setMsg({ t: 'El LED no enciende: está al revés. La pata larga (+) va al polo positivo: pásalo a la otra pinza.', aviso: true })
    else setMsg({ t: `No le alcanza: un LED rojo necesita unos ${f(LED_V, 1)} V y aquí hay ${f(Math.abs(L))} V. Suma limones en serie.`, aviso: true })
    if (!falla) setVistos((v) => [...v.filter((x) => !(x.n === n && Math.abs(x.V - Math.abs(L)) < 0.01 && x.led === (tipo === 'led'))), { n, V: Math.abs(L), led: tipo === 'led' && L >= LED_V }])
  }

  const x0 = 330
  const dx = 120
  const xl = (k: number) => x0 + k * dx
  const metales = (Object.keys(METAL) as Metal[]).filter((m) => grado >= METAL[m].desde)

  const piezas: Pieza[] = [
    { id: 'canasta', nombre: `Limones (lleva uno a la bandeja; van ${n} de ${MAX})`, x: 90, y: 360, ancho: 110, alto: 70, tomable: n < MAX, color: '#f3e04a',
      dibujo: <g><path d="M-50 0 h100 l-10 32 h-80 z" fill="#b98a4c" stroke="#2b2b2b" strokeWidth="2" />{[-30, -8, 14, 34].map((x, k) => <ellipse key={k} cx={x} cy={-6 + (k % 2) * 4} rx="16" ry="12" fill="#f3e04a" stroke="#8a7a1c" />)}</g> },
    ...metales.map((m, k) => ({ id: m, nombre: METAL[m].n, x: 70 + k * 55, y: 270, ancho: 40, alto: 70, tomable: true,
      dibujo: <g><rect x="-4" y="-30" width="8" height="56" rx="2" fill={METAL[m].c} stroke="#2b2b2b" /><text y="44" textAnchor="middle" fontSize="11" fontWeight="700">{SIMB[m]}</text></g> })),
    { id: 'cable', nombre: 'Cable con caimanes (une un limón con el anterior)', x: 290, y: 255, ancho: 60, alto: 40, tomable: true,
      dibujo: <g><path d="M-24 6 q24 -26 48 0" fill="none" stroke="#c0392b" strokeWidth="4" /><rect x="-30" y="4" width="12" height="8" fill="#888" /><rect x="18" y="4" width="12" height="8" fill="#888" /></g> },
    { id: 'bandeja', nombre: 'Bandeja', x: x0 + 1.5 * dx, y: 395, ancho: 4 * dx, alto: 20,
      dibujo: <rect x={-2 * dx} y="-6" width={4 * dx} height="14" rx="5" fill="#d9dde0" stroke="#2b2b2b" /> },
    ...limones.map((l, k) => ({
      id: `l${k}`, nombre: `Limón ${k + 1}${l.length ? ` · ${l.map((m) => SIMB[m]).join(' | ')}` : ' · sin electrodos'}`, x: xl(k), y: 350, ancho: 100, alto: 80,
      dibujo: <g>
        <ellipse cx="0" cy="10" rx="46" ry="34" fill="#f3e04a" stroke="#8a7a1c" strokeWidth="2" />
        <ellipse cx="-30" cy="0" rx="8" ry="5" fill="#fff8b0" opacity="0.6" />
        {l.map((m, j) => <g key={j}><rect x={j ? 14 : -22} y="-42" width="8" height="52" rx="2" fill={METAL[m].c} stroke="#2b2b2b" /><text x={j ? 18 : -18} y="-48" textAnchor="middle" fontSize="11" fontWeight="700">{SIMB[m]}</text></g>)}
        {k > 0 && k <= cables && <path d={`M${-dx + 18} -40 C${-dx + 40} -95 ${-40} -95 ${-18} -40`} fill="none" stroke="#c0392b" strokeWidth="3" />}
      </g>,
    })),
    ...(n ? [
      { id: 'izq', nombre: 'Pinza del extremo izquierdo', x: xl(0) - 75, y: 300, ancho: 44, alto: 40, dibujo: <g><path d="M30 -10 Q10 -10 0 6" fill="none" stroke="#222" strokeWidth="3" /><rect x="-14" y="4" width="20" height="12" rx="3" fill="#222" /></g> },
      { id: 'der', nombre: 'Pinza del extremo derecho', x: xl(n - 1) + 75, y: 300, ancho: 44, alto: 40, dibujo: <g><path d="M-30 -10 Q-10 -10 0 6" fill="none" stroke="#c0392b" strokeWidth="3" /><rect x="-6" y="4" width="20" height="12" rx="3" fill="#c0392b" /></g> },
    ] : []),
    { id: 'volt', nombre: aparato?.tipo === 'volt' ? `Voltímetro: ${f(lectura)} V` : 'Voltímetro (suéltalo en una pinza; la punta roja va a esa pinza)', x: 885, y: 230, ancho: 110, alto: 90, tomable: true,
      dibujo: <g><rect x="-44" y="-36" width="88" height="72" rx="8" fill="#f1c40f" stroke="#2b2b2b" strokeWidth="2" /><rect x="-34" y="-26" width="68" height="26" fill="#d6e8cf" stroke="#2b2b2b" /><text y="-7" textAnchor="middle" fontSize="16" fontFamily="monospace">{aparato?.tipo === 'volt' ? f(lectura) : '0,00'}</text><text y="20" textAnchor="middle" fontSize="11" fontWeight="700">V</text><circle cx="-18" cy="26" r="4" fill="#222" /><circle cx="18" cy="26" r="4" fill="#c0392b" /></g> },
    { id: 'led', nombre: ledOn ? 'LED encendido' : 'LED rojo (la pata larga es +; suéltalo en una pinza)', x: 770, y: 215, ancho: 60, alto: 70, tomable: true,
      dibujo: <g>{ledOn && <circle cx="0" cy="-14" r="30" fill="#ff4d4d" opacity={brillo * 0.45} />}<path d="M-10 0 v-18 a10 10 0 0 1 20 0 v18 z" fill={ledOn ? '#ff3b3b' : '#a83232'} opacity={ledOn ? 0.6 + brillo * 0.4 : 0.85} stroke="#2b2b2b" /><line x1="-5" y1="0" x2="-5" y2="22" stroke="#888" strokeWidth="2" /><line x1="5" y1="0" x2="5" y2="34" stroke="#888" strokeWidth="2" /><text x="16" y="34" fontSize="9">+</text></g> },
    { id: 'caneca', nombre: 'Desarmar todo (toca)', x: 950, y: 370, ancho: 50, alto: 76,
      alTocar: () => { setLimones([]); setCables(0); setAparato(null); setMsg({ t: 'Mesa limpia. Los limones usados no se comen: absorbieron metal.' }) }, dibujo: <g transform="scale(0.85)"><Caneca /></g> },
  ]

  const lims = limones.map((_, k) => `l${k}`)
  const destinos = (de: string) => {
    if (de === 'canasta') return ['bandeja', ...lims]
    if (de in METAL) return lims.filter((_, k) => limones[k].length < 2)
    if (de === 'cable') return lims.slice(cables + 1, cables + 2)
    if (de === 'volt' || de === 'led') return n ? ['izq', 'der'] : []
    return []
  }
  const soltar = (de: string, en: string): Uso | string => {
    if (de === 'canasta') {
      if (n >= MAX) return `Con ${MAX} limones basta para esta práctica.`
      return { anim: 'poner', hecho: () => { setLimones((l) => [...l, []]); setMsg({ t: `Limón ${n + 1} en la bandeja. Ruédalo un poco antes para que suelte jugo por dentro.` }) } }
    }
    if (de in METAL) {
      const k = Number(en.slice(1))
      if (!en.startsWith('l')) return 'El electrodo se clava en un limón.'
      if (limones[k].length >= 2) return 'Ese limón ya tiene sus dos electrodos.'
      return { anim: 'poner', hecho: () => {
        setLimones((ls) => ls.map((l, j) => (j === k ? [...l, de as Metal] : l)))
        setMsg({ t: limones[k].length === 0 ? `${SIMB[de as Metal]} clavado a la izquierda del limón ${k + 1}. Ahora el otro electrodo, separado unos 2 cm.` : `Limón ${k + 1} listo: ${SIMB[limones[k][0]]} a la izquierda y ${SIMB[de as Metal]} a la derecha.` })
      } }
    }
    if (de === 'cable') {
      const k = Number(en.slice(1))
      if (k === 0) return 'El cable une un limón con el anterior: suéltalo en el segundo limón.'
      if (k !== cables + 1) return `Une primero el limón ${cables + 1} con el ${cables + 2}.`
      if (limones[k - 1].length < 2 || limones[k].length < 2) return 'Primero clava los dos electrodos en los dos limones.'
      return { anim: 'poner', hecho: () => { setCables(k); setMsg({ t: `Cable del electrodo derecho del limón ${k} al izquierdo del limón ${k + 1}: quedan en serie.` }) } }
    }
    if (de === 'volt' || de === 'led') {
      if (en !== 'izq' && en !== 'der') return 'Suéltalo en una de las pinzas de los extremos.'
      return { anim: 'poner', hecho: () => conectar(de, en) }
    }
    return 'No se puede.'
  }

  const logrado = vistos.some((v) => v.led)
  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-2xl border border-[var(--linea)] bg-[var(--tarjeta)] p-4 text-sm">
        <b>Reto: enciende el LED con limones.</b> Pon limones en la bandeja, clava en cada uno dos metales distintos, une los limones con cables y lleva el voltímetro o el LED a una de las pinzas de los extremos. En la pinza derecha, la punta roja del voltímetro o la pata larga del LED quedan en el electrodo derecho del último limón.
      </p>
      <MesaViva desde={170} piezas={piezas} destinos={destinos} soltar={soltar} />
      {msg && <p className={`-mt-2 text-sm ${msg.aviso ? 'font-semibold text-[#b5462c]' : ''}`}>{msg.aviso ? '⚠ ' : '› '}{msg.t}</p>}
      {vistos.length > 0 && (
        <table className="mx-auto text-sm">
          <thead><tr className="text-left"><th className="px-3">Limones</th><th className="px-3">Voltaje</th><th className="px-3">LED</th></tr></thead>
          <tbody>{[...vistos].sort((a, b) => a.n - b.n).map((v, k) => <tr key={k}><td className="px-3">{v.n}</td><td className="px-3">{f(v.V)} V</td><td className="px-3">{v.led ? '💡 enciende' : '—'}</td></tr>)}</tbody>
        </table>
      )}
      {logrado && (
        <p className="rounded-lg bg-[#eaf5ee] p-2 text-sm">
          <b>¿Qué pasó?</b> Cada limón es una pila: el zinc suelta electrones (se gasta poco a poco) y estos viajan por el cable hasta el cobre, donde el ácido del limón los recibe y forma hidrógeno. El jugo del limón deja pasar los iones por dentro y cierra el circuito. Un limón da menos de 1 V; en serie los voltajes se suman, por eso hacen falta tres o cuatro para el LED.
          {grado >= 9 ? ' El zinc se oxida (Zn → Zn²⁺ + 2e⁻) en el polo negativo, el ánodo; en el cobre, el cátodo, se reduce el H⁺ (2H⁺ + 2e⁻ → H₂). Es una reacción redox que convierte energía química en eléctrica.' : ''}
          {grado >= 11 ? ' El voltaje depende de la distancia entre los dos metales en la serie de potenciales: E = E°(cátodo) − E°(ánodo); Zn–Cu ≈ 1,10 V en condiciones estándar, menos en el limón. Con magnesio sube y con hierro baja.' : ''}
        </p>
      )}
      <p className="text-xs text-[var(--suave)]">Los voltajes de la simulación son aproximados. El limón da muy poca corriente: alcanza para un LED o una calculadora pequeña, no para cargar un celular. También sirven papas.</p>
    </div>
  )
}
