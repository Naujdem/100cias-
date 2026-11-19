import { useEffect, useState } from 'react'
import MesaViva from '../MesaViva.tsx'
import type { Pieza, Uso } from '../MesaViva.tsx'
import { Caneca } from '../dibujos.tsx'

// Práctica extra 3 (PLAN-LABORATORIOS.md): corrosión de clavos, Química área 3, desde 6°.
// Cinco frascos vacíos: se les echa agua, sal, vinagre, aceite o sílica gel (secante) en la combinación que se quiera,
// luego un clavo en cada uno (hierro; galvanizado y pintado desde 9°). El calendario se toca para que corran los días:
// tiempo acelerado 1 s = 6 h (aviso). Cada clavo se oxida desde el día en que entró, según su medio.
// La lupa sobre un frasco anota la observación en la tabla. Tasas aproximadas (fracción de óxido por día).

const f = (x: number, d = 1) => x.toLocaleString('es-CO', { minimumFractionDigits: d, maximumFractionDigits: d })

type Cosa = 'agua' | 'sal' | 'vinagre' | 'aceite' | 'silica'
type Clavo = 'hierro' | 'galvanizado' | 'pintado'
interface Frasco { cosas: Cosa[]; clavo: Clavo | null; desde: number }

const COSA: Record<Cosa, { n: string; c: string }> = {
  agua: { n: 'Agua de la llave', c: '#a9d3f5' },
  sal: { n: 'Sal', c: '#ffffff' },
  vinagre: { n: 'Vinagre', c: '#efe7c4' },
  aceite: { n: 'Aceite', c: '#e9c94a' },
  silica: { n: 'Sílica gel (seca el aire)', c: '#9fd3ff' },
}
const CLAVO: Record<Clavo, { n: string; c: string; desde: number }> = {
  hierro: { n: 'Clavos de hierro', c: '#6b6b6b', desde: 6 },
  galvanizado: { n: 'Clavos galvanizados (con zinc)', c: '#b8c2ca', desde: 9 },
  pintado: { n: 'Clavos pintados', c: '#2e6b4f', desde: 9 },
}

function medio(c: Cosa[]) {
  const t = new Set(c)
  if (t.has('silica') && !t.has('agua') && !t.has('vinagre')) return { n: 'aire seco', r: 0 }
  if (t.has('aceite') && !t.has('agua') && !t.has('vinagre')) return { n: 'aceite', r: 0.004 }
  if (t.has('aceite')) return { n: 'líquido tapado con aceite', r: 0.02 }
  if (t.has('vinagre')) return { n: t.has('sal') ? 'vinagre con sal' : 'vinagre', r: t.has('sal') ? 0.2 : 0.14 }
  if (t.has('agua')) return { n: t.has('sal') ? 'agua con sal' : 'agua', r: t.has('sal') ? 0.16 : 0.08 }
  return { n: 'aire húmedo', r: 0.025 }
}
const factor = (cl: Clavo, ácido: boolean) => (cl === 'hierro' ? 1 : cl === 'galvanizado' ? (ácido ? 0.5 : 0.08) : 0.05)
const DIAS = 7

export default function Corrosion({ grado }: { grado: number }) {
  const [frascos, setFrascos] = useState<Frasco[]>(() => Array.from({ length: 5 }, () => ({ cosas: [], clavo: null, desde: 0 })))
  const [dia, setDia] = useState(0) // en cuartos de día (1 s = 6 h)
  const [corre, setCorre] = useState(false)
  const [notas, setNotas] = useState<Record<number, string>>({})
  const [msg, setMsg] = useState<{ t: string; aviso?: boolean } | null>(null)

  useEffect(() => {
    if (!corre) return
    if (dia >= DIAS * 4) { setCorre(false); setMsg({ t: `Pasó una semana. Revisa cada frasco con la lupa.` }); return }
    const id = window.setTimeout(() => setDia((d) => d + 1), 1000)
    return () => window.clearTimeout(id)
  }, [corre, dia])

  const oxido = (fr: Frasco) => {
    if (!fr.clavo) return 0
    const m = medio(fr.cosas)
    return Math.min(1, ((dia - fr.desde) / 4) * m.r * factor(fr.clavo, fr.cosas.includes('vinagre')))
  }
  const observar = (fr: Frasco) => {
    const o = oxido(fr)
    const m = medio(fr.cosas)
    const vin = fr.cosas.includes('vinagre')
    if (!fr.clavo) return 'sin clavo'
    if (o < 0.03) return `${m.n}: el clavo sigue brillante`
    const grado_ = o < 0.25 ? 'poco óxido' : o < 0.6 ? 'bastante óxido' : 'muy oxidado, con óxido suelto en el fondo'
    return `${m.n}: ${grado_}${vin ? ' (el vinagre además lo disuelve y el líquido se pone amarillento)' : ''}${fr.clavo === 'galvanizado' && o >= 0.03 ? '; manchas blancas de óxido de zinc' : ''}`
  }

  const clavos = (Object.keys(CLAVO) as Clavo[]).filter((c) => grado >= CLAVO[c].desde)
  const xs = [380, 480, 580, 680, 780]
  const piezas: Pieza[] = [
    ...(Object.keys(COSA) as Cosa[]).map((c, k) => ({
      id: c, nombre: COSA[c].n, x: 60 + (k % 3) * 70, y: k < 3 ? 250 : 360, ancho: 50, alto: 80, tomable: true, color: COSA[c].c,
      dibujo: c === 'sal' || c === 'silica'
        ? <g><rect x="-16" y="-24" width="32" height="48" rx="6" fill={COSA[c].c} stroke="#2b2b2b" strokeWidth="2" /><rect x="-16" y="-30" width="32" height="8" fill="#888" /><text y="38" textAnchor="middle" fontSize="9" fontWeight="700">{c === 'sal' ? 'Sal' : 'Sílica'}</text></g>
        : <g><path d="M-8 -36 h16 v10 l8 8 v46 h-32 v-46 l8 -8 z" fill={COSA[c].c} stroke="#2b2b2b" strokeWidth="2" /><text y="40" textAnchor="middle" fontSize="9" fontWeight="700">{c === 'agua' ? 'Agua' : c === 'vinagre' ? 'Vinagre' : 'Aceite'}</text></g>,
    })),
    ...clavos.map((c, k) => ({
      id: c, nombre: CLAVO[c].n, x: 280, y: 230 + k * 55, ancho: 60, alto: 40, tomable: true,
      dibujo: <g><rect x="-22" y="-2" width="40" height="5" fill={CLAVO[c].c} stroke="#2b2b2b" strokeWidth="1" /><rect x="-26" y="-6" width="5" height="13" fill={CLAVO[c].c} stroke="#2b2b2b" strokeWidth="1" /><path d="M18 -2 l8 2.5 l-8 2.5 z" fill={CLAVO[c].c} /></g>,
    })),
    ...frascos.map((fr, k) => {
      const o = oxido(fr)
      const liq = fr.cosas.filter((c) => c !== 'sal' && c !== 'silica' && c !== 'aceite')
      const col = liq.includes('vinagre') ? (o > 0.2 ? '#e8c87a' : COSA.vinagre.c) : liq.includes('agua') ? (o > 0.3 ? '#d9b98a' : COSA.agua.c) : null
      const aceite = fr.cosas.includes('aceite')
      return {
        id: `f${k}`, nombre: `Frasco ${k + 1}${fr.cosas.length ? ` · ${[...new Set(fr.cosas)].map((c) => COSA[c].n.split(' ')[0].toLowerCase()).join(' + ')}` : ' · vacío'}${fr.clavo ? ` · clavo ${fr.clavo}` : ''}${notas[k] ? ' · observado' : ''}`,
        x: xs[k], y: 330, ancho: 80, alto: 120,
        dibujo: <g>
          <rect x="-32" y="-50" width="64" height="100" rx="8" fill="rgba(235,245,250,0.6)" stroke="#2b2b2b" strokeWidth="2" />
          <rect x="-28" y="-58" width="56" height="10" rx="3" fill="#7a8a96" />
          {col && <rect x="-30" y={aceite ? -6 : -14} width="60" height={aceite ? 54 : 62} fill={col} opacity="0.75" />}
          {aceite && <rect x="-30" y={col ? -22 : -14} width="60" height={col ? 16 : 62} fill={COSA.aceite.c} opacity="0.8" />}
          {fr.cosas.includes('sal') && <g fill="#fff">{[-14, -2, 10].map((x) => <rect key={x} x={x} y="42" width="4" height="4" />)}</g>}
          {fr.cosas.includes('silica') && <g fill="#9fd3ff" stroke="#5d8fb3">{[-18, -6, 6, 18].map((x) => <circle key={x} cx={x} cy="44" r="4" />)}</g>}
          {fr.clavo && <g transform="rotate(80 0 10)">
            <rect x="-30" y="7" width="54" height="6" fill={CLAVO[fr.clavo].c} stroke="#2b2b2b" strokeWidth="1" />
            <rect x="-30" y="7" width="54" height="6" fill={fr.clavo === 'galvanizado' ? '#f2f2ee' : '#b4541e'} opacity={Math.min(0.95, o * 1.4)} />
            <rect x="-34" y="3" width="5" height="14" fill={CLAVO[fr.clavo].c} />
          </g>}
          {o > 0.5 && fr.clavo !== 'galvanizado' && <ellipse cx="0" cy="46" rx="18" ry="3" fill="#a5481c" opacity={o} />}
          {fr.clavo && fr.cosas.includes('vinagre') && corre && [-8, 6].map((x) => <circle key={x} cx={x} r="2" fill="#fff"><animate attributeName="cy" values="40;-10" dur="1.6s" repeatCount="indefinite" /></circle>)}
          <text y="68" textAnchor="middle" fontSize="12" fontWeight="800">{k + 1}</text>
        </g>,
      }
    }),
    { id: 'calendario', nombre: corre ? `Día ${f(dia / 4)} (toca: pausar)` : dia >= DIAS * 4 ? 'Semana cumplida' : `Día ${f(dia / 4)} (toca: que corran los días)`, x: 930, y: 230, ancho: 90, alto: 90,
      alTocar: () => {
        if (dia >= DIAS * 4) return setMsg({ t: 'Ya pasó la semana. Para repetir, desarma todo en la caneca.' })
        if (!corre && !frascos.some((fr) => fr.clavo)) return setMsg({ t: 'Primero pon al menos un clavo en un frasco.', aviso: true })
        setCorre((v) => !v)
        if (!corre) setMsg({ t: 'Corren los días: tiempo acelerado, 1 s = 6 horas.' })
      },
      dibujo: <g><rect x="-36" y="-34" width="72" height="70" rx="6" fill="#fff" stroke="#2b2b2b" strokeWidth="2" /><rect x="-36" y="-34" width="72" height="18" rx="6" fill={corre ? '#2e7d5a' : '#c0392b'} /><text y="-21" textAnchor="middle" fontSize="10" fill="#fff" fontWeight="700">{corre ? '▶ corre' : 'DÍA'}</text><text y="18" textAnchor="middle" fontSize="26" fontWeight="800">{Math.floor(dia / 4)}</text></g> },
    { id: 'lupa', nombre: 'Lupa (suéltala en un frasco para anotar)', x: 850, y: 390, ancho: 60, alto: 60, tomable: true,
      dibujo: <g><circle cx="-6" cy="-6" r="16" fill="rgba(200,230,250,0.6)" stroke="#2b2b2b" strokeWidth="4" /><line x1="6" y1="6" x2="22" y2="22" stroke="#7a4a1c" strokeWidth="6" strokeLinecap="round" /></g> },
    { id: 'caneca', nombre: 'Desarmar todo (toca)', x: 950, y: 365, ancho: 40, alto: 60,
      alTocar: () => { setFrascos(Array.from({ length: 5 }, () => ({ cosas: [], clavo: null, desde: 0 }))); setDia(0); setCorre(false); setNotas({}); setMsg({ t: 'Frascos lavados y clavos al reciclaje de metal.' }) },
      dibujo: <g transform="scale(0.7)"><Caneca /></g> },
  ]

  const fids = frascos.map((_, k) => `f${k}`)
  const destinos = (de: string) => {
    if (de in COSA) return fids.filter((_, k) => !frascos[k].clavo)
    if (de in CLAVO) return fids.filter((_, k) => !frascos[k].clavo)
    if (de === 'lupa') return fids.filter((_, k) => frascos[k].clavo)
    return []
  }
  const soltar = (de: string, en: string): Uso | string => {
    const k = Number(en.slice(1))
    if (!en.startsWith('f')) return 'Va a uno de los frascos.'
    const fr = frascos[k]
    if (de in COSA) {
      const c = de as Cosa
      if (fr.clavo) return 'Ese frasco ya tiene su clavo: prepara el medio antes de meterlo.'
      if (fr.cosas.includes(c)) return `Ya tiene ${COSA[c].n.toLowerCase()}.`
      const polvo = c === 'sal' || c === 'silica'
      return { anim: polvo ? 'polvo' : 'verter', hecho: () => {
        setFrascos((fs) => fs.map((x, j) => (j === k ? { ...x, cosas: [...x.cosas, c] } : x)))
        if (c === 'sal' && !fr.cosas.includes('agua') && !fr.cosas.includes('vinagre')) setMsg({ t: 'La sal sola, seca, no hace mucho: necesita agua para disolverse.', aviso: true })
        else if (c === 'aceite' && fr.cosas.includes('agua')) setMsg({ t: 'El aceite flota y tapa el agua: el aire ya no entra al agua.' })
        else setMsg({ t: `${COSA[c].n} al frasco ${k + 1}.` })
      } }
    }
    if (de in CLAVO) {
      if (fr.clavo) return 'Un clavo por frasco, para poder comparar.'
      return { anim: 'poner', hecho: () => {
        setFrascos((fs) => fs.map((x, j) => (j === k ? { ...x, clavo: de as Clavo, desde: dia } : x)))
        setMsg({ t: `Clavo al frasco ${k + 1}: ${medio(fr.cosas).n}.${dia > 0 ? ` Entró el día ${f(dia / 4)}: lleva menos tiempo que los otros.` : ''}` })
      } }
    }
    if (de === 'lupa') {
      if (!fr.clavo) return 'Ese frasco no tiene clavo.'
      return { anim: 'poner', hecho: () => { const t = observar(fr); setNotas((n) => ({ ...n, [k]: `Día ${f(dia / 4)} · ${t}` })); setMsg({ t: `Frasco ${k + 1}: ${t}.` }) } }
    }
    return 'No se puede.'
  }

  const conClavo = frascos.map((fr, k) => ({ fr, k })).filter((x) => x.fr.clavo)
  const fin = dia >= DIAS * 4 && Object.keys(notas).length >= conClavo.length && conClavo.length > 0
  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-2xl border border-[var(--linea)] bg-[var(--tarjeta)] p-4 text-sm">
        <b>¿Qué oxida más rápido un clavo?</b> Prepara cada frasco con lo que quieras (agua, sal, vinagre, aceite o sílica gel, que seca el aire), mete un clavo en cada uno y toca el calendario para que pase una semana. Con la lupa anota cómo va cada clavo. Para comparar bien, cambia una sola cosa a la vez{grado >= 9 ? ' y prueba también los clavos galvanizados y pintados' : ''}.
      </p>
      <MesaViva desde={170} piezas={piezas} destinos={destinos} soltar={soltar} />
      {msg && <p className={`-mt-2 text-sm ${msg.aviso ? 'font-semibold text-[#b5462c]' : ''}`}>{msg.aviso ? '⚠ ' : '› '}{msg.t}</p>}
      {Object.keys(notas).length > 0 && (
        <ul className="mx-auto max-w-2xl text-sm">
          {Object.entries(notas).sort().map(([k, t]) => <li key={k}><b>Frasco {Number(k) + 1}:</b> {t}</li>)}
        </ul>
      )}
      {fin && (
        <p className="rounded-lg bg-[#eaf5ee] p-2 text-sm">
          <b>¿Qué pasó?</b> El hierro se oxida cuando tiene a la vez <b>agua y oxígeno</b>: en aire seco o bajo aceite casi no cambia. La sal y el vinagre lo aceleran porque el agua con iones conduce mejor la corriente diminuta de la corrosión; por eso los carros y los techos se dañan más cerca del mar.
          {grado >= 9 ? ' Es una reacción redox: el hierro se oxida (Fe → Fe²⁺ + 2e⁻) y el oxígeno del agua se reduce; al final queda óxido de hierro hidratado: 4Fe + 3O₂ + 6H₂O → 4Fe(OH)₃. La pintura y el aceite protegen porque no dejan llegar el agua y el aire.' : ''}
          {grado >= 11 ? ' El galvanizado protege aunque se raye: el zinc es más activo que el hierro (E° −0,76 V contra −0,44 V) y se oxida primero, como «ánodo de sacrificio». Es la protección catódica de barcos y tuberías. En vinagre el zinc también se gasta rápido.' : ''}
        </p>
      )}
      <p className="text-xs text-[var(--suave)]">Tiempo acelerado: 1 s = 6 h. En la vida real esta práctica se arma en clase y se revisa durante una semana. Velocidades aproximadas.</p>
    </div>
  )
}
