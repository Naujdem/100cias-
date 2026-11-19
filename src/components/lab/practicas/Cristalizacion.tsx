import { useEffect, useState } from 'react'
import MesaViva from '../MesaViva.tsx'
import type { Pieza, Uso } from '../MesaViva.tsx'
import { Caneca } from '../dibujos.tsx'

// Práctica extra 4 (PLAN-LABORATORIOS.md): cristalización, Química área 4, desde 6°.
// Agua (100 mL) al vaso, estufa que se toca, soluto de a 10 g, varilla que disuelve hasta la solubilidad a esa
// temperatura (lo que sobra queda en el fondo); el vaso se vierte al frasco (sin el sólido del fondo); el lápiz con
// hilo al frasco (semilla); el frasco a la nevera (rápido), a la mesa (lento) o al plato (evaporación). 1 s = 1 h, 24 h.
// Solubilidades aproximadas en g por 100 mL de agua. Curva de solubilidad desde 9°; masa cristalizada en 11°.

const f = (x: number, d = 0) => x.toLocaleString('es-CO', { minimumFractionDigits: d, maximumFractionDigits: d })

type Sust = 'sal' | 'azucar' | 'alumbre'
const SUST: Record<Sust, { n: string; curva: [number, number][]; forma: string; c: string }> = {
  sal: { n: 'Sal (NaCl)', curva: [[0, 35.7], [20, 36], [50, 37], [80, 38], [100, 39.2]], forma: 'cubos', c: '#ffffff' },
  azucar: { n: 'Azúcar', curva: [[0, 179], [20, 204], [50, 260], [80, 362], [100, 487]], forma: 'prismas alargados', c: '#fffaf0' },
  alumbre: { n: 'Alumbre', curva: [[0, 6], [20, 12], [40, 24], [60, 57], [80, 130], [100, 150]], forma: 'octaedros (dos pirámides unidas)', c: '#eef6ff' },
}
const sol = (s: Sust, T: number) => {
  const c = SUST[s].curva
  for (let i = 1; i < c.length; i++) if (T <= c[i][0]) return c[i - 1][1] + ((T - c[i - 1][0]) / (c[i][0] - c[i - 1][0])) * (c[i][1] - c[i - 1][1])
  return c[c.length - 1][1]
}
type Lugar = 'nevera' | 'mesa' | 'plato'
const DESTINO: Record<Lugar, { n: string; T: number; k: number }> = {
  nevera: { n: 'en la nevera', T: 5, k: 0.6 },
  mesa: { n: 'en la mesa, tapado', T: 22, k: 0.15 },
  plato: { n: 'en un plato, al aire', T: 22, k: 0.15 },
}
interface Frasco { s: Sust; dis: number; T: number; agua: number; hilo: boolean; lugar: Lugar | null; h: number; frio: number }
const HORAS = 24

function Cristal({ forma, x, y, r }: { forma: Sust; x: number; y: number; r: number }) {
  if (forma === 'sal') return <rect x={x - r} y={y - r} width={r * 2} height={r * 2} fill="#fff" stroke="#8aa" strokeWidth="1" />
  if (forma === 'azucar') return <rect x={x - r * 0.6} y={y - r * 1.4} width={r * 1.2} height={r * 2.8} fill="#fffaf0" stroke="#b9a" strokeWidth="1" transform={`rotate(20 ${x} ${y})`} />
  return <path d={`M${x} ${y - r * 1.3} L${x + r} ${y} L${x} ${y + r * 1.3} L${x - r} ${y} Z M${x - r} ${y} H${x + r}`} fill="#eef6ff" stroke="#7a9cc0" strokeWidth="1" />
}

export default function Cristalizacion({ grado }: { grado: number }) {
  const [agua, setAgua] = useState(0)
  const [T, setT] = useState(22)
  const [estufa, setEstufa] = useState(false)
  const [s, setS] = useState<Sust | null>(null)
  const [masa, setMasa] = useState(0)
  const [dis, setDis] = useState(0)
  const [fr, setFr] = useState<Frasco | null>(null)
  const [msg, setMsg] = useState<{ t: string; aviso?: boolean } | null>(null)

  useEffect(() => {
    const cambia = estufa ? T < 85 : T > 22.5
    if (!cambia || !agua) return
    const id = window.setTimeout(() => setT((t) => (estufa ? Math.min(85, t + 7) : Math.max(22, t - 4))), 1000)
    return () => window.clearTimeout(id)
  })
  useEffect(() => {
    if (!fr?.lugar || fr.h >= HORAS) return
    const id = window.setTimeout(() => setFr((x) => {
      if (!x?.lugar) return x
      const d = DESTINO[x.lugar]
      const T2 = x.T + (d.T - x.T) * d.k
      const agua2 = x.lugar === 'plato' ? Math.max(5, x.agua * 0.88) : x.agua * 0.997
      const sobra = x.dis - (sol(x.s, T2) * agua2) / 100
      return { ...x, T: T2, agua: agua2, h: x.h + 1, frio: x.T - T2 > 3 && sobra > 0 ? x.frio + 1 : x.frio }
    }), 1000)
    return () => window.clearTimeout(id)
  }, [fr])

  const nivelSat = s ? (sol(s, T) * agua) / 100 : 0
  const cristal = fr ? Math.max(0, fr.dis - (sol(fr.s, fr.T) * fr.agua) / 100) : 0
  // rápido (enfriado de golpe) → muchos y pequeños; lento → pocos y grandes; con hilo → uno grande en el hilo
  const rapido = fr?.lugar === 'nevera'
  const n = !fr || cristal < 0.5 ? 0 : fr.hilo && !rapido ? 1 : rapido ? 14 : 5
  const tam = n ? Math.min(16, Math.max(2, Math.cbrt(cristal / n) * (fr!.hilo && !rapido ? 3.4 : 2.6))) : 0

  const reset = () => { setAgua(0); setT(22); setEstufa(false); setS(null); setMasa(0); setDis(0); setFr(null) }
  const fondo = masa - dis
  const piezas: Pieza[] = [
    { id: 'agua', nombre: 'Jarra de agua (100 mL)', x: 70, y: 350, ancho: 60, alto: 80, tomable: true, color: '#a9d3f5',
      dibujo: <g><path d="M-22 -30 h40 l6 8 v52 h-46 z" fill="#a9d3f5" stroke="#2b2b2b" strokeWidth="2" /><path d="M18 -18 q14 0 14 14 q0 12 -14 12" fill="none" stroke="#2b2b2b" strokeWidth="3" /></g> },
    ...(Object.keys(SUST) as Sust[]).map((k, i) => ({ id: k, nombre: `${SUST[k].n} (de a 10 g)`, x: 140 + i * 60, y: 360, ancho: 50, alto: 70, tomable: true, color: SUST[k].c,
      dibujo: <g><rect x="-18" y="-24" width="36" height="48" rx="5" fill={SUST[k].c} stroke="#2b2b2b" strokeWidth="2" /><rect x="-18" y="-30" width="36" height="8" fill="#888" /><text y="38" textAnchor="middle" fontSize="9" fontWeight="700">{k === 'azucar' ? 'Azúcar' : k === 'sal' ? 'Sal' : 'Alumbre'}</text></g> })),
    { id: 'varilla', nombre: 'Varilla (agitar)', x: 170, y: 270, ancho: 100, alto: 16, tomable: true, dibujo: <rect x="-46" y="-3" width="92" height="6" rx="3" fill="#dfe9ef" stroke="#2b2b2b" /> },
    {
      id: 'vaso', nombre: `Vaso · ${f(T)} °C${agua ? ' · 100 mL de agua' : ''}${s ? ` · ${f(dis)} g disueltos${fondo > 0 ? `, ${f(fondo)} g en el fondo` : ''}` : ''}`, x: 420, y: 300, ancho: 90, alto: 100, tomable: agua > 0,
      dibujo: <g>
        <path d="M-34 -44 V40 Q-34 46 -28 46 H28 Q34 46 34 40 V-44" fill="rgba(255,255,255,0.6)" stroke="#2b2b2b" strokeWidth="2" />
        {agua > 0 && <rect x="-32" y="-10" width="64" height="54" fill="#a9d3f5" opacity="0.7" />}
        {fondo > 0 && <ellipse cx="0" cy="40" rx={Math.min(28, 8 + fondo)} ry="4" fill="#fff" stroke="#bbb" />}
        {T > 40 && agua > 0 && [-16, 0, 16].map((x) => <path key={x} d={`M${x} -20 q4 -6 0 -12`} fill="none" stroke="#bbb" strokeWidth="1.5" />)}
        <text y="64" textAnchor="middle" fontSize="11" fontFamily="monospace">{f(T)} °C</text>
      </g>,
    },
    { id: 'estufa', nombre: estufa ? 'Estufa encendida (toca: apagar)' : 'Estufa (toca: encender)', x: 420, y: 385, ancho: 120, alto: 22, alTocar: () => setEstufa((v) => !v),
      dibujo: <g><rect x="-56" y="-6" width="112" height="18" rx="4" fill="#5d6d7e" stroke="#2b2b2b" strokeWidth="2" /><circle cx="44" cy="3" r="5" fill={estufa ? '#e74c3c' : '#999'} /></g> },
    { id: 'lapiz', nombre: 'Lápiz con hilo (semilla)', x: 560, y: 250, ancho: 90, alto: 30, tomable: !fr?.hilo,
      dibujo: <g opacity={fr?.hilo ? 0.3 : 1}><rect x="-40" y="-4" width="80" height="8" fill="#f2c14e" stroke="#2b2b2b" /><path d="M40 -4 l10 4 l-10 4 z" fill="#d9a066" /><line x1="0" y1="4" x2="0" y2="22" stroke="#555" /></g> },
    { id: 'mesa', nombre: 'Rincón de la mesa (enfría lento, tapado)', x: 690, y: 405, ancho: 120, alto: 20, dibujo: <rect x="-56" y="-6" width="112" height="12" rx="4" fill="#d6c3a5" stroke="#2b2b2b" /> },
    { id: 'plato', nombre: 'Plato junto a la ventana (evaporación)', x: 770, y: 250, ancho: 80, alto: 30, dibujo: <ellipse cx="0" cy="0" rx="34" ry="8" fill="#fff" stroke="#2b2b2b" strokeWidth="2" /> },
    { id: 'nevera', nombre: 'Nevera (enfría rápido)', x: 880, y: 300, ancho: 120, alto: 180, dibujo: <g><rect x="-56" y="-86" width="112" height="176" rx="8" fill="#eaf2f7" stroke="#2b2b2b" strokeWidth="2" /><line x1="-56" y1="-30" x2="56" y2="-30" stroke="#2b2b2b" /><rect x="40" y="-70" width="6" height="26" fill="#999" /><text y="-50" textAnchor="middle" fontSize="11">5 °C</text></g> },
    {
      id: 'frasco', nombre: fr ? `Frasco: ${SUST[fr.s].n}${fr.lugar ? ` · ${DESTINO[fr.lugar].n} · ${fr.h} h · ${f(fr.T)} °C` : ' (llévalo a la nevera, la mesa o el plato)'}${cristal >= 0.5 ? ` · ${f(cristal, 1)} g de cristales` : ''}` : 'Frasco limpio',
      x: fr?.lugar === 'nevera' ? 880 : fr?.lugar === 'plato' ? 770 : fr?.lugar === 'mesa' ? 690 : 600, y: fr?.lugar === 'nevera' ? 300 : fr?.lugar === 'plato' ? 220 : 350, ancho: 80, alto: 100, tomable: !!fr && !fr.lugar,
      dibujo: <g>
        {fr?.lugar === 'plato'
          ? <g><ellipse cx="0" cy="30" rx="44" ry="10" fill="#fff" stroke="#2b2b2b" strokeWidth="2" /><ellipse cx="0" cy="28" rx={36 * Math.sqrt(fr.agua / 100)} ry="6" fill="#a9d3f5" opacity="0.7" /></g>
          : <g><path d="M-26 -40 V40 Q-26 46 -20 46 H20 Q26 46 26 40 V-40" fill="rgba(255,255,255,0.6)" stroke="#2b2b2b" strokeWidth="2" />{fr && <rect x="-24" y="-6" width="48" height="50" fill="#a9d3f5" opacity="0.6" />}</g>}
        {fr?.hilo && fr.lugar !== 'plato' && <g><rect x="-40" y="-48" width="80" height="7" fill="#f2c14e" stroke="#2b2b2b" /><line x1="0" y1="-41" x2="0" y2="20" stroke="#555" /></g>}
        {fr && Array.from({ length: n }, (_, i) => {
          const enHilo = fr.hilo && !rapido
          const x = enHilo ? 0 : fr.lugar === 'plato' ? -30 + (i * 13) % 60 : -18 + (i * 9) % 36
          const y = enHilo ? 10 : fr.lugar === 'plato' ? 27 - (i % 2) * 3 : 40 - (i % 3) * 3
          return <Cristal key={i} forma={fr.s} x={x} y={y} r={tam} />
        })}
      </g>,
    },
    { id: 'caneca', nombre: 'Empezar de nuevo (toca)', x: 960, y: 420 - 30, ancho: 40, alto: 60, alTocar: () => { reset(); setMsg({ t: 'Todo lavado. Empieza otra vez.' }) }, dibujo: <g transform="scale(0.7)"><Caneca /></g> },
  ]

  const destinos = (de: string) => {
    if (de === 'agua' || de in SUST || de === 'varilla') return ['vaso']
    if (de === 'vaso') return ['frasco']
    if (de === 'lapiz') return fr && fr.lugar !== 'plato' ? ['frasco'] : []
    if (de === 'frasco') return ['nevera', 'mesa', 'plato']
    return []
  }
  const soltar = (de: string, en: string): Uso | string => {
    if (de === 'agua') return agua ? 'El vaso ya tiene sus 100 mL.' : fr ? 'Primero empieza de nuevo.' : { anim: 'verter', hecho: () => setAgua(100) }
    if (de in SUST) {
      if (!agua) return 'Primero el agua.'
      if (s && s !== de) return 'Una sola sustancia por vaso: no se mezclan.'
      return { anim: 'polvo', hecho: () => { setS(de as Sust); setMasa((m) => m + 10); setMsg({ t: `+10 g de ${SUST[de as Sust].n.toLowerCase()} (van ${masa + 10} g). Agita para disolver.` }) } }
    }
    if (de === 'varilla') {
      if (!s) return 'No hay nada que disolver.'
      return { anim: 'frotar', hecho: () => {
        const d = Math.max(dis, Math.min(masa, nivelSat))
        setDis(d)
        setMsg(masa > nivelSat ? { t: `A ${f(T)} °C solo se disuelven unos ${f(nivelSat)} g: quedan ${f(masa - d)} g en el fondo. ¡La solución está saturada!` } : { t: `Se disolvió todo (${f(d)} g). A ${f(T)} °C caben unos ${f(nivelSat)} g: aún no está saturada.` })
      } }
    }
    if (de === 'vaso') {
      if (en !== 'frasco') return 'Viértelo al frasco.'
      if (fr) return 'El frasco ya está lleno.'
      if (!s || !dis) return 'El vaso no tiene nada disuelto.'
      return { anim: 'verter', hecho: () => {
        setFr({ s, dis, T, agua: 100, hilo: false, lugar: null, h: 0, frio: 0 })
        setEstufa(false); setAgua(0); setMasa(0); setDis(0); setS(null); setT(22)
        setMsg(dis < nivelSat - 1 ? { t: 'Pasaste una solución que no estaba saturada: puede que no salgan cristales.', aviso: true } : { t: 'Solución saturada en el frasco; el sólido del fondo se quedó en el vaso. Ahora el hilo, si quieres, y elige dónde dejarla.' })
      } }
    }
    if (de === 'lapiz') return fr ? { anim: 'poner', hecho: () => { setFr({ ...fr, hilo: true }); setMsg({ t: 'El hilo cuelga dentro sin tocar el fondo ni las paredes: los cristales crecerán sobre él.' }) } } : 'Primero llena el frasco.'
    if (de === 'frasco') {
      if (!fr) return 'El frasco está vacío.'
      const l = en as Lugar
      return { anim: 'poner', hecho: () => { setFr({ ...fr, lugar: l, hilo: l === 'plato' ? false : fr.hilo }); setMsg({ t: `Frasco ${DESTINO[l].n}. Corre el tiempo: 1 s = 1 h, durante un día.` }) } }
    }
    return 'No se puede.'
  }

  const fin = fr && fr.h >= HORAS
  const res = fin && (() => {
    if (cristal < 0.5) {
      if (fr.s === 'sal' && fr.lugar !== 'plato') return 'Casi no salieron cristales: la solubilidad de la sal casi no cambia con la temperatura, así que enfriar no basta. Con la sal funciona evaporar el agua (el plato).'
      return 'No salieron cristales: la solución no estaba saturada a esa temperatura. Hace falta más soluto o enfriar más.'
    }
    const tipo = fr.hilo && !rapido ? 'Un cristal grande creció en el hilo' : rapido ? 'Salieron muchos cristales pequeños' : 'Salieron pocos cristales medianos'
    return `${tipo}: ${f(cristal, 1)} g de ${SUST[fr.s].forma}. ${rapido ? 'Al enfriar de golpe se forman muchos núcleos a la vez y ninguno alcanza a crecer.' : 'Al enfriar o evaporar despacio, las partículas tienen tiempo de acomodarse en pocos cristales grandes y ordenados.'}`
  })()

  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-2xl border border-[var(--linea)] bg-[var(--tarjeta)] p-4 text-sm">
        <b>Haz crecer cristales.</b> Echa agua al vaso, caliéntala, agrega sal, azúcar o alumbre de a 10 g y agita hasta que ya no se disuelva más: la solución queda <b>saturada</b>. Viértela al frasco, cuelga el hilo si quieres y déjala en la nevera, en la mesa o en un plato. Compara el tamaño y la forma de los cristales.
      </p>
      <MesaViva desde={170} piezas={piezas} destinos={destinos} soltar={soltar} />
      {msg && <p className={`-mt-2 text-sm ${msg.aviso ? 'font-semibold text-[#b5462c]' : ''}`}>{msg.aviso ? '⚠ ' : '› '}{msg.t}</p>}
      {grado >= 9 && s && <Curva s={s} T={T} g={masa} />}
      {res && <p className={`rounded-lg p-2 text-sm ${cristal >= 0.5 ? 'bg-[#eaf5ee]' : 'bg-[#fbeee9]'}`}><b>Resultado:</b> {res}
        {grado >= 11 && cristal >= 0.5 ? ` Cálculo: disueltos ${f(fr.dis)} g; a ${f(fr.T)} °C caben ${f((sol(fr.s, fr.T) * fr.agua) / 100)} g en ${f(fr.agua)} mL; cristalizan ${f(fr.dis)} − ${f((sol(fr.s, fr.T) * fr.agua) / 100)} = ${f(cristal, 1)} g.` : ''}</p>}
      {res && <p className="rounded-lg bg-[var(--tarjeta)] p-2 text-sm"><b>¿Por qué?</b> Un cristal es un sólido con sus partículas ordenadas en un patrón que se repite; por eso cada sustancia tiene su forma: la sal, cubos; el alumbre, octaedros; el azúcar, prismas. En agua caliente cabe más soluto; al enfriar o evaporar ya no cabe todo y lo que sobra se ordena como cristal.{grado >= 9 ? ' La curva de solubilidad muestra cuánto cabe a cada temperatura: si es empinada (alumbre, azúcar) sirve enfriar; si es plana (sal), hay que evaporar.' : ''}</p>}
      <p className="text-xs text-[var(--suave)]">Tiempo acelerado: 1 s = 1 h. En la vida real los cristales de alumbre y azúcar se dejan crecer varios días. Solubilidades aproximadas. El alumbre no se come.</p>
    </div>
  )
}

function Curva({ s, T, g }: { s: Sust; T: number; g: number }) {
  const max = s === 'azucar' ? 500 : s === 'alumbre' ? 160 : 50
  const X = (t: number) => 40 + t * 2.6
  const Y = (v: number) => 150 - (v / max) * 130
  const pts = Array.from({ length: 21 }, (_, i) => `${X(i * 5)},${Y(sol(s, i * 5))}`).join(' ')
  return (
    <svg viewBox="0 0 320 175" className="mx-auto w-full max-w-sm" role="img" aria-label="Curva de solubilidad">
      <line x1="40" y1="150" x2="300" y2="150" stroke="#333" /><line x1="40" y1="20" x2="40" y2="150" stroke="#333" />
      <polyline points={pts} fill="none" stroke="#3f6fb8" strokeWidth="2.5" />
      <circle cx={X(T)} cy={Y(Math.min(g, max))} r="5" fill={g > sol(s, T) ? '#c43c3c' : '#4f8a3c'} />
      <text x="170" y="170" textAnchor="middle" fontSize="10">Temperatura (°C)</text>
      <text x="12" y="85" fontSize="10" transform="rotate(-90 12 85)" textAnchor="middle">g / 100 mL</text>
      <text x="300" y="18" textAnchor="end" fontSize="10" fontWeight="700">Curva de solubilidad: {SUST[s].n}</text>
      <text x="44" y="30" fontSize="9">{g > sol(s, T) ? 'punto rojo: sobra soluto (saturada)' : 'punto verde: cabe más'}</text>
    </svg>
  )
}
