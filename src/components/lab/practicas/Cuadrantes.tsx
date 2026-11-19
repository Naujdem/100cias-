import { useState } from 'react'
import MesaViva from '../MesaViva.tsx'
import type { Pieza, Uso } from '../MesaViva.tsx'

// Práctica extra 12 (PLAN-LABORATORIOS.md): muestreo con cuadrantes, Biología área 3, desde 6°.
// Potrero de 10 m × 5 m dividido en 50 parcelas de 1 m². El marco (1 m²) se suelta en una parcela: la elegida por el
// estudiante o la que sale al tocar el dado (al azar). La parcela se amplía abajo y se cuenta tocando cada planta;
// «Anotar» guarda lo contado. Con 5 o más cuadrantes: densidad, población estimada frente a la real y frecuencia;
// abundancia relativa desde 9°; índice de Simpson en 11°. Aviso si los cuadrantes se eligieron todos en una zona.

const f = (x: number, d = 1) => x.toLocaleString('es-CO', { minimumFractionDigits: d, maximumFractionDigits: d })
type Esp = 'trebol' | 'diente' | 'dormidera' | 'cadillo' | 'helecho'
const ESP: Record<Esp, { n: string; c: string }> = {
  trebol: { n: 'Trébol', c: '#2e8b57' },
  diente: { n: 'Diente de león', c: '#f2c230' },
  dormidera: { n: 'Dormidera', c: '#d16ba5' },
  cadillo: { n: 'Cadillo', c: '#8a5a2b' },
  helecho: { n: 'Helecho', c: '#1f5f3a' },
}
const ESPS = Object.keys(ESP) as Esp[]
const COLS = 10, FILAS = 5
interface Planta { e: Esp; x: number; y: number }

function generar(): Planta[][] {
  const poisson = (l: number) => { let k = 0, p = Math.exp(-l), s = p; const u = Math.random(); while (u > s && k < 30) { k++; p *= l / k; s += p } return k }
  return Array.from({ length: COLS * FILAS }, (_, i) => {
    const c = i % COLS, r = Math.floor(i / COLS)
    const media: Record<Esp, number> = {
      trebol: r >= 3 ? 6 : 1, // zona húmeda abajo: agrupado
      diente: 1.5, // al azar
      dormidera: c <= 1 || c >= 8 ? 3 : 0.3, // bordes
      cadillo: 0.8,
      helecho: c >= 7 && r <= 1 ? 4 : 0, // rincón con sombra
    }
    return ESPS.flatMap((e) => Array.from({ length: poisson(media[e]) }, () => ({ e, x: 0.08 + Math.random() * 0.84, y: 0.08 + Math.random() * 0.84 })))
  })
}

export default function Cuadrantes({ grado }: { grado: number }) {
  const [potrero] = useState(generar)
  const [dado, setDado] = useState<number | null>(null)
  const [abierta, setAbierta] = useState<number | null>(null)
  const [tocadas, setTocadas] = useState<Set<number>>(new Set())
  const [datos, setDatos] = useState<{ p: number; azar: boolean; n: Record<Esp, number> }[]>([])
  const [msg, setMsg] = useState<string | null>(null)

  const nombre = (i: number) => `${'ABCDE'[Math.floor(i / COLS)]}${(i % COLS) + 1}`
  const x0 = 270, w = 66, y0 = 215, h = 40
  const piezas: Pieza[] = [
    { id: 'marco', nombre: 'Marco de 1 m × 1 m (suéltalo en una parcela)', x: 110, y: 300, ancho: 90, alto: 90, tomable: abierta === null,
      dibujo: <g><rect x="-36" y="-36" width="72" height="72" fill="none" stroke="#c0392b" strokeWidth="6" /><line x1="-36" y1="0" x2="36" y2="0" stroke="#c0392b" strokeDasharray="3 3" /><line x1="0" y1="-36" x2="0" y2="36" stroke="#c0392b" strokeDasharray="3 3" /></g> },
    { id: 'dado', nombre: dado !== null ? `Dado: salió la parcela ${nombre(dado)}` : 'Dado (toca: elige una parcela al azar)', x: 110, y: 405, ancho: 50, alto: 40,
      alTocar: () => { const libres = potrero.map((_, i) => i).filter((i) => !datos.some((d) => d.p === i)); const k = libres[Math.floor(Math.random() * libres.length)]; setDado(k); setMsg(`Salió la parcela ${nombre(k)}: lleva el marco ahí.`) },
      dibujo: <g><rect x="-16" y="-16" width="32" height="32" rx="6" fill="#fff" stroke="#2b2b2b" strokeWidth="2" />{[[-7, -7], [7, 7], [0, 0]].map(([a, b], k) => <circle key={k} cx={a} cy={b} r="3" fill="#2b2b2b" />)}</g> },
    ...potrero.map((pl, i) => {
      const c = i % COLS, r = Math.floor(i / COLS)
      const hecho = datos.some((d) => d.p === i)
      return {
        id: `p${i}`, nombre: `Parcela ${nombre(i)}${hecho ? ' (muestreada)' : ''}`, x: x0 + c * w + w / 2, y: y0 + r * h + h / 2, ancho: w, alto: h,
        dibujo: <g>
          <rect x={-w / 2} y={-h / 2} width={w} height={h} fill={r >= 3 ? '#9ccb6e' : '#b6d77f'} stroke={dado === i ? '#c0392b' : '#8aa860'} strokeWidth={dado === i ? 3 : 0.6} />
          {pl.map((p, k) => <circle key={k} cx={-w / 2 + p.x * w} cy={-h / 2 + p.y * h} r="1.8" fill={ESP[p.e].c} />)}
          {hecho && <rect x={-w / 2 + 2} y={-h / 2 + 2} width={w - 4} height={h - 4} fill="none" stroke="#c0392b" strokeWidth="2" />}
          {c === 0 && <text x={-w / 2 - 8} y="4" fontSize="10" textAnchor="middle">{'ABCDE'[r]}</text>}
          {r === 0 && <text y={-h / 2 - 4} fontSize="9" textAnchor="middle">{c + 1}</text>}
        </g>,
      }
    }),
  ]
  const soltar = (de: string, en: string): Uso | string => {
    if (de !== 'marco' || !en.startsWith('p')) return 'El marco va sobre una parcela.'
    const i = Number(en.slice(1))
    if (datos.some((d) => d.p === i)) return 'Esa parcela ya la muestreaste.'
    return { anim: 'poner', hecho: () => { setAbierta(i); setTocadas(new Set()); setMsg(`Marco en ${nombre(i)}. Toca cada planta que veas dentro del marco para contarla.`) } }
  }
  const destinos = (de: string) => (de === 'marco' ? potrero.map((_, i) => `p${i}`).filter((_, i) => !datos.some((d) => d.p === i)) : [])

  const anotar = () => {
    if (abierta === null) return
    const pl = potrero[abierta]
    const n = Object.fromEntries(ESPS.map((e) => [e, pl.filter((p, k) => p.e === e && tocadas.has(k)).length])) as Record<Esp, number>
    const faltan = pl.length - tocadas.size
    setDatos((d) => [...d, { p: abierta, azar: dado === abierta, n }])
    setMsg(faltan ? `Anotado, pero se te pasaron ${faltan} planta${faltan > 1 ? 's' : ''}: cuenta con calma, en orden, de una esquina a la otra.` : `Parcela ${nombre(abierta)} anotada sin errores.`)
    setAbierta(null); setDado(null)
  }

  const nC = datos.length
  const tot = (e: Esp) => datos.reduce((a, d) => a + d.n[e], 0)
  const real = (e: Esp) => potrero.flat().filter((p) => p.e === e).length
  const N = ESPS.reduce((a, e) => a + tot(e), 0)
  const simpson = N > 1 ? 1 - ESPS.reduce((a, e) => a + tot(e) * (tot(e) - 1), 0) / (N * (N - 1)) : 0
  const elegidos = datos.filter((d) => !d.azar)
  const sesgo = elegidos.length >= 4 && (new Set(elegidos.map((d) => Math.floor(d.p / COLS) >= 3)).size === 1 || elegidos.every((d) => d.p % COLS >= 5) || elegidos.every((d) => d.p % COLS < 5))
  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-2xl border border-[var(--linea)] bg-[var(--tarjeta)] p-4 text-sm"><b>¿Cuántas plantas de cada clase hay en el potrero?</b> Contarlas todas tomaría días; por eso se cuentan unas cuantas parcelas de 1 m² y se calcula. Lleva el marco a una parcela (elígela tú o usa el dado para que sea al azar), toca cada planta que veas dentro para contarla y anota. Haz por lo menos 5 cuadrantes.</p>
      <MesaViva desde={180} piezas={piezas} destinos={destinos} soltar={soltar} />
      {msg && <p className="-mt-2 text-sm">› {msg}</p>}
      {abierta !== null && (
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-2">
          <svg viewBox="0 0 300 300" className="w-full max-w-sm rounded border-4 border-[#c0392b] bg-[#b6d77f]" role="img" aria-label={`Parcela ${nombre(abierta)} ampliada`}>
            {potrero[abierta].map((p, k) => {
              const x = p.x * 300, y = p.y * 300, ok = tocadas.has(k)
              return (
                <g key={k} onClick={() => setTocadas((t) => new Set(t).add(k))} style={{ cursor: 'pointer' }}>
                  {p.e === 'trebol' && [0, 120, 240].map((a) => <circle key={a} cx={x + 6 * Math.cos((a * Math.PI) / 180)} cy={y + 6 * Math.sin((a * Math.PI) / 180)} r="6" fill={ESP.trebol.c} />)}
                  {p.e === 'diente' && <><path d={`M${x - 10} ${y + 8} q10 -14 20 0`} fill="#3d7a2c" /><circle cx={x} cy={y - 6} r="7" fill={ESP.diente.c} /></>}
                  {p.e === 'dormidera' && <><line x1={x - 12} y1={y} x2={x + 12} y2={y} stroke="#3d7a2c" strokeWidth="3" /><circle cx={x} cy={y - 6} r="6" fill={ESP.dormidera.c} /></>}
                  {p.e === 'cadillo' && <><line x1={x} y1={y + 12} x2={x} y2={y - 8} stroke="#5d7a2c" strokeWidth="3" /><circle cx={x} cy={y - 10} r="5" fill={ESP.cadillo.c} /></>}
                  {p.e === 'helecho' && <path d={`M${x} ${y + 12} q-4 -16 0 -26 M${x} ${y} l-9 -5 M${x} ${y} l9 -5 M${x} ${y - 8} l-7 -4 M${x} ${y - 8} l7 -4`} stroke={ESP.helecho.c} strokeWidth="3" fill="none" />}
                  <circle cx={x} cy={y} r="14" fill={ok ? 'rgba(255,255,255,0.55)' : 'transparent'} stroke={ok ? '#c0392b' : 'none'} strokeWidth="2" />
                  {ok && <text x={x + 12} y={y - 10} fontSize="12" fill="#c0392b" fontWeight="800">✓</text>}
                </g>
              )
            })}
          </svg>
          <p className="text-sm">Contadas: {ESPS.map((e) => <span key={e} className="mx-1" style={{ color: ESP[e].c }}>{ESP[e].n} {potrero[abierta].filter((p, k) => p.e === e && tocadas.has(k)).length}</span>)}</p>
          <button type="button" onClick={anotar} className="min-h-10 rounded-full bg-[var(--acento)] px-5 text-sm font-semibold text-white">Anotar y levantar el marco</button>
        </div>
      )}
      {nC > 0 && (
        <table className="mx-auto text-sm">
          <thead><tr className="text-left"><th className="px-2">Especie</th><th className="px-2">Contadas</th><th className="px-2">Densidad (por m²)</th>{nC >= 5 && <><th className="px-2">Estimado en 50 m²</th><th className="px-2">Real</th><th className="px-2">Frecuencia</th></>}{grado >= 9 && nC >= 5 && <th className="px-2">Abund. relativa</th>}</tr></thead>
          <tbody>{ESPS.map((e) => <tr key={e}><td className="px-2" style={{ color: ESP[e].c }}>{ESP[e].n}</td><td className="px-2">{tot(e)}</td><td className="px-2">{f(tot(e) / nC)}</td>
            {nC >= 5 && <><td className="px-2">{f((tot(e) / nC) * 50, 0)}</td><td className="px-2">{real(e)}</td><td className="px-2">{f((datos.filter((d) => d.n[e] > 0).length / nC) * 100, 0)} %</td></>}
            {grado >= 9 && nC >= 5 && <td className="px-2">{N ? f((tot(e) / N) * 100, 0) : 0} %</td>}</tr>)}</tbody>
        </table>
      )}
      {sesgo && <p className="text-sm font-semibold text-[#b5462c]">⚠ Elegiste tus cuadrantes todos en la misma zona del potrero: la muestra está sesgada. Usa el dado para que cada parcela tenga la misma oportunidad.</p>}
      {nC >= 5 && (
        <p className="rounded-lg bg-[var(--tarjeta)] p-2 text-sm"><b>¿Qué muestra el muestreo?</b> Densidad = individuos ÷ área muestreada; multiplicada por el área total da la población estimada. Mientras más cuadrantes y más al azar, más se parece a la real. Mira también cómo se reparten: el trébol se agrupa en la zona húmeda de abajo, la dormidera en los bordes, el helecho en el rincón con sombra y el diente de león aparece en cualquier parte.
          {grado >= 9 ? ' La frecuencia dice en qué porcentaje de cuadrantes apareció cada especie y la abundancia relativa, qué parte del total es; una especie puede ser abundante pero poco frecuente si vive agrupada.' : ''}
          {grado >= 11 ? ` Índice de diversidad de Simpson con tus datos: D = 1 − Σ n(n − 1) ÷ N(N − 1) = ${f(simpson, 2)} (de 0, una sola especie, a cerca de 1, muy diverso).` : ''}
        </p>
      )}
    </div>
  )
}
