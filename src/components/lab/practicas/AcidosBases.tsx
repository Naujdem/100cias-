import { useEffect, useState } from 'react'
import MesaViva from '../MesaViva.tsx'
import type { Pieza, Uso } from '../MesaViva.tsx'
import { Caneca } from '../dibujos.tsx'

// Laboratorio de Química 10 (PLAN-LABORATORIOS.md): ácidos, bases y pH, en mesa viva.
// Se prepara el indicador de repollo morado (hojas a la olla, estufa que se toca, 1 s = 1 min, colador al frasco
// y olla al frasco); el gotero de indicador va a ocho tubos con sustancias de la casa. Desde 9°, tiras de papel
// indicador universal; en 11°, pH-metro y [H⁺]. Se clasifica cada sustancia. pH y colores aproximados.

const f = (x: number, d = 1) => x.toLocaleString('es-CO', { minimumFractionDigits: d, maximumFractionDigits: d })
const SUST = [
  { n: 'Jugo de limón', pH: 2.2, base: '#fbf3c4' },
  { n: 'Vinagre', pH: 2.9, base: '#f6f0dc' },
  { n: 'Gaseosa', pH: 3.4, base: '#e9e2cf' },
  { n: 'Leche', pH: 6.6, base: '#fbfbf5' },
  { n: 'Agua destilada', pH: 7.0, base: '#eef6fb' },
  { n: 'Bicarbonato en agua', pH: 8.3, base: '#f4f6f6' },
  { n: 'Jabón de ropa en agua', pH: 10.2, base: '#eef3f6' },
  { n: 'Limpiador con amoníaco', pH: 11.6, base: '#eaf3f0' },
]
/** color del indicador de repollo según el pH */
const REPOLLO: [number, string, string][] = [[2, '#d6204a', 'rojo'], [4, '#e04f8a', 'rosado'], [6, '#a8509c', 'morado rojizo'], [7.4, '#7a4fa0', 'morado'], [8.8, '#3f63c4', 'azul'], [10.5, '#2a9a8a', 'verde azulado'], [12.2, '#3fb54a', 'verde'], [14, '#d9c43a', 'amarillo']]
const repollo = (pH: number) => REPOLLO.find(([max]) => pH <= max) ?? REPOLLO[REPOLLO.length - 1]
const UNIV = ['#d42a2a', '#e8502a', '#f0862c', '#f5b22e', '#f2d83a', '#c9d93a', '#8fca3c', '#4fb04a', '#2f9a7a', '#2a7fb0', '#2a5cb5', '#3a3fa8', '#5a2f9a', '#6a2580']
const univ = (pH: number) => UNIV[Math.max(0, Math.min(13, Math.round(pH) - 1))]
const CLASES = ['Ácida', 'Neutra', 'Básica']
const clase = (pH: number) => (pH < 6.5 ? 0 : pH <= 7.5 ? 1 : 2)

interface Tubo { ind: boolean; tira: boolean; metro: boolean }

export default function AcidosBases({ grado }: { grado: number }) {
  const [hojas, setHojas] = useState(false)
  const [estufa, setEstufa] = useState(false)
  const [min, setMin] = useState(0) // minutos hirviendo
  const [colador, setColador] = useState(false)
  const [indicador, setIndicador] = useState(0) // intensidad del indicador (0 = no hay)
  const [tubos, setTubos] = useState<Tubo[]>(SUST.map(() => ({ ind: false, tira: false, metro: false })))
  const [elec, setElec] = useState<(number | null)[]>(SUST.map(() => null))
  const [ver, setVer] = useState(false)
  const [msg, setMsg] = useState<{ t: string; aviso?: boolean } | null>(null)
  const hirviendo = estufa && hojas && indicador === 0 && min < 20
  useEffect(() => {
    if (!hirviendo) return
    const id = window.setTimeout(() => setMin((m) => m + 1), 1000)
    return () => window.clearTimeout(id)
  }, [hirviendo, min])
  const fuerza = Math.min(1, min / 10)
  const cambiar = (k: number, p: Partial<Tubo>) => setTubos((ts) => ts.map((t, j) => (j === k ? { ...t, ...p } : t)))
  const colorTubo = (k: number) => {
    const t = tubos[k]
    if (!t.ind) return SUST[k].base
    return repollo(SUST[k].pH)[1]
  }
  const piezas: Pieza[] = [
    { id: 'repollo', nombre: 'Hojas de repollo morado picadas', x: 60, y: 345, ancho: 70, alto: 40, tomable: !hojas, color: '#6a2c91', dibujo: hojas ? <g /> : <g>{[-18, 0, 18].map((x, k) => <path key={x} d={`M${x - 14} 10 Q${x} ${-20 + k * 4} ${x + 14} 10 Z`} fill="#6a2c91" stroke="#3d1554" />)}</g> },
    {
      id: 'olla', nombre: indicador ? 'Olla (ya se filtró)' : hojas ? `Olla con agua y repollo · ${min} min` : 'Olla con agua', x: 180, y: 300, ancho: 110, alto: 70, tomable: hojas && min > 0 && indicador === 0, color: `rgba(106,44,145,${0.3 + 0.6 * fuerza})`,
      dibujo: <g><path d="M-48 -22 V24 Q-48 32 -40 32 H40 Q48 32 48 24 V-22" fill="#9aa5ad" stroke="#2b2b2b" strokeWidth="2.5" /><rect x="-46" y="-14" width="92" height="12" fill={hojas ? `rgba(106,44,145,${0.15 + 0.75 * fuerza})` : '#cfe6f5'} />{hirviendo && [-24, 0, 24].map((x) => <path key={x} d={`M${x} -28 q5 -8 0 -16 q-5 -8 0 -16`} fill="none" stroke="#bbb" strokeWidth="2" />)}{hojas && !indicador && [-20, 4, 22].map((x) => <path key={x} d={`M${x - 8} -6 Q${x} -16 ${x + 8} -6 Z`} fill="#6a2c91" />)}<path d="M-60 -18 H-48 M48 -18 H60" stroke="#2b2b2b" strokeWidth="4" /></g>,
    },
    { id: 'estufa', nombre: estufa ? 'Estufa encendida (toca: apagar)' : 'Estufa (toca: encender)', x: 180, y: 348, ancho: 140, alto: 24, alTocar: () => setEstufa((v) => !v), dibujo: <g><rect x="-66" y="-8" width="132" height="22" rx="4" fill="#5d6d7e" stroke="#2b2b2b" strokeWidth="2" /><circle cx="54" cy="3" r="6" fill={estufa ? '#e74c3c' : '#999'} />{estufa && <path d="M-40 -8 Q0 -16 40 -8" fill="none" stroke="#e67e22" strokeWidth="3" />}</g> },
    { id: 'colador', nombre: colador ? 'Colador (puesto sobre el frasco)' : 'Colador', ...(colador ? { x: 320, y: 262 } : { x: 300, y: 395 }), ancho: 60, alto: 24, tomable: !colador, dibujo: <g><path d="M-24 -6 Q0 18 24 -6 Z" fill="#d9d9d9" stroke="#2b2b2b" strokeWidth="1.5" strokeDasharray="3 2" /><path d="M24 -6 H40" stroke="#555" strokeWidth="4" /></g> },
    { id: 'frasco', nombre: indicador ? 'Frasco con indicador de repollo' : 'Frasco vacío', x: 320, y: 315, ancho: 60, alto: 80, dibujo: <g><rect x="-24" y="-34" width="48" height="76" rx="8" fill="rgba(255,255,255,0.7)" stroke="#2b2b2b" strokeWidth="2" />{indicador > 0 && <rect x="-22" y="-4" width="44" height="44" rx="6" fill={`rgba(106,44,145,${0.25 + 0.7 * indicador})`} />}</g> },
    { id: 'gotero', nombre: 'Gotero de indicador', x: 400, y: 395, ancho: 56, alto: 18, tomable: true, color: '#7a4fa0', dibujo: <g transform="rotate(-90)"><rect x="-6" y="-26" width="12" height="12" rx="5" fill="#333" /><path d="M-5 -14 H5 V14 L1 24 H-1 L-5 14 Z" fill={indicador ? '#c9b0dc' : '#dff0fb'} stroke="#2b2b2b" strokeWidth="1.5" /></g> },
    ...(grado >= 9 ? [{ id: 'tira', nombre: 'Tiras de papel indicador universal', x: 470, y: 395, ancho: 50, alto: 24, tomable: true, dibujo: <g>{UNIV.filter((_, k) => k % 2 === 0).map((c, k) => <rect key={k} x={-21 + k * 6} y="-8" width="5" height="16" fill={c} />)}</g> }] : []),
    ...(grado >= 11 ? [{ id: 'metro', nombre: 'pH-metro', x: 540, y: 392, ancho: 50, alto: 30, tomable: true, dibujo: <g><rect x="-18" y="-14" width="36" height="24" rx="4" fill="#34495e" /><rect x="-12" y="-9" width="24" height="10" fill="#1f2d24" /><text y="-1" textAnchor="middle" fontSize="7" fill="#7dff9a" fontFamily="monospace">pH</text></g> }] : []),
    ...SUST.map((s, k) => {
      const t = tubos[k]
      return {
        id: `t${k}`, nombre: `${k + 1}. ${s.n}`, x: 470 + k * 58, y: 280, ancho: 44, alto: 120,
        dibujo: <g><path d="M-14 -55 V45 A14 14 0 0 0 14 45 V-55" fill="rgba(255,255,255,0.6)" stroke="#2b2b2b" strokeWidth="2" /><path d="M-13 0 V45 A13 13 0 0 0 13 45 V0 Z" fill={colorTubo(k)} opacity={t.ind ? 0.6 + 0.35 * indicador : 0.9} style={{ transition: 'fill 0.8s' }} />{t.tira && <rect x="6" y="-60" width="6" height="40" fill={univ(s.pH)} stroke="#999" strokeWidth="0.5" />}<text y="72" textAnchor="middle" fontSize="11" fontWeight="700">{k + 1}</text></g>,
      }
    }),
    { id: 'gradilla', nombre: 'Gradilla', x: 673, y: 345, ancho: 0, alto: 0, dibujo: <rect x="-225" y="-6" width="450" height="18" rx="3" fill="#8a6a45" /> },
    { id: 'caneca', nombre: 'Residuos (toca: lavar los tubos)', x: 955, y: 324, ancho: 50, alto: 76, alTocar: () => { setTubos(SUST.map(() => ({ ind: false, tira: false, metro: false }))); setElec(SUST.map(() => null)); setVer(false); setMsg({ t: 'Tubos lavados y llenos de nuevo con cada sustancia.' }) }, dibujo: <g transform="scale(0.85)"><Caneca /></g> },
  ]
  const tubosIds = SUST.map((_, k) => `t${k}`)
  const destinos = (de: string) => (de === 'repollo' ? ['olla'] : de === 'colador' || de === 'olla' ? ['frasco'] : tubosIds)
  const soltar = (de: string, en: string): Uso | string => {
    if (de === 'repollo') return en === 'olla' ? { anim: 'polvo', hecho: () => { setHojas(true); setMsg({ t: 'Echas el repollo al agua. Enciende la estufa y deja hervir unos 10 minutos (1 s = 1 min).' }) } } : 'El repollo va a la olla con agua.'
    if (de === 'colador') return en === 'frasco' ? { anim: 'poner', hecho: () => setColador(true) } : 'El colador va sobre el frasco.'
    if (de === 'olla') {
      if (en !== 'frasco') return 'El líquido se pasa al frasco.'
      return {
        anim: 'verter',
        hecho: () => {
          setIndicador(Math.max(0.15, fuerza)); setEstufa(false)
          const avisos = [!colador && 'Sin colador pasaron pedazos de repollo al frasco.', min < 8 && 'Hirvió poco tiempo: el indicador quedó pálido y los colores se verán débiles.'].filter(Boolean)
          setMsg(avisos.length ? { t: avisos.join(' '), aviso: true } : { t: 'Listo el indicador: un líquido morado. Ahora, unas gotas en cada tubo.' })
        },
      }
    }
    const k = +en.slice(1)
    if (!en.startsWith('t')) return 'Eso va en un tubo.'
    if (de === 'gotero') {
      if (!indicador) return 'Todavía no hay indicador: prepáralo con el repollo.'
      if (tubos[k].ind) return 'Ese tubo ya tiene indicador.'
      return { anim: 'gotas', gotas: 3, hecho: () => { cambiar(k, { ind: true }); setMsg({ t: `${SUST[k].n}: el indicador se pone ${repollo(SUST[k].pH)[2]}.` }) } }
    }
    if (de === 'tira') return tubos[k].tira ? 'Ya mediste ese tubo con la tira.' : { anim: 'poner', hecho: () => { cambiar(k, { tira: true }); setMsg({ t: `${SUST[k].n}: la tira se pone de un color que en la escala corresponde a pH ≈ ${Math.round(SUST[k].pH)}.` }) } }
    if (de === 'metro') return { anim: 'poner', hecho: () => { cambiar(k, { metro: true }); setMsg({ t: `${SUST[k].n}: pH = ${f(SUST[k].pH)} → [H⁺] = 10^−${f(SUST[k].pH)} ≈ ${(10 ** -SUST[k].pH).toExponential(1).replace('.', ',')} mol/L.` }) } }
    return 'No se puede.'
  }
  const observados = tubos.filter((t) => t.ind || t.tira || t.metro).length
  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-2xl bg-[var(--tarjeta)] p-4 text-sm">El repollo morado tiene un pigmento que cambia de color según la sustancia sea <b>ácida</b>, <b>neutra</b> o <b>básica</b>: es un <b>indicador</b>. Prepáralo (repollo a la olla, hervir, colar al frasco) y echa unas gotas en cada tubo.{grado >= 9 ? ' Mide también con la tira de papel universal.' : ''}{grado >= 11 ? ' Y con el pH-metro.' : ''}</p>
      <MesaViva desde={150} piezas={piezas} destinos={destinos} soltar={soltar} />
      {msg && <p className={`-mt-2 text-sm ${msg.aviso ? 'font-semibold text-[#b5462c]' : ''}`}>{msg.aviso ? '⚠ ' : '› '}{msg.t}</p>}
      <div className="flex flex-wrap items-center gap-1 text-xs">
        <span className="mr-1 font-semibold">Repollo:</span>
        {REPOLLO.map(([max, c, n], k) => <span key={n} className="flex items-center gap-1 rounded-full border border-[var(--linea)] bg-white px-2 py-0.5"><span className="inline-block h-3 w-3 rounded-full" style={{ background: c }} />{n}{grado >= 9 ? ` (≈ ${k === 0 ? '0' : f(REPOLLO[k - 1][0], 0)}–${f(max, 0)})` : ''}</span>)}
      </div>
      {observados > 0 && (
        <div className="overflow-x-auto rounded-xl bg-[var(--tarjeta)] p-3 text-sm">
          <table className="w-full">
            <thead><tr className="text-left"><th className="p-1">Sustancia</th><th className="p-1">Repollo</th>{grado >= 9 && <th className="p-1">Tira</th>}{grado >= 11 && <th className="p-1">pH-metro</th>}<th className="p-1">¿Qué es?</th></tr></thead>
            <tbody>{SUST.map((s, k) => {
              const t = tubos[k]
              if (!(t.ind || t.tira || t.metro)) return null
              return (
                <tr key={k} className="border-t border-[var(--linea)]">
                  <td className="p-1">{k + 1}. {s.n}</td>
                  <td className="p-1">{t.ind ? <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded-full" style={{ background: repollo(s.pH)[1] }} />{repollo(s.pH)[2]}</span> : '—'}</td>
                  {grado >= 9 && <td className="p-1">{t.tira ? `≈ ${Math.round(s.pH)}` : '—'}</td>}
                  {grado >= 11 && <td className="p-1">{t.metro ? f(s.pH) : '—'}</td>}
                  <td className="p-1">{CLASES.map((c, j) => <button key={c} type="button" onClick={() => { setElec((e) => e.map((x, i) => (i === k ? j : x))); setVer(false) }} className={`mr-1 rounded-full border px-2 py-0.5 text-xs ${elec[k] === j ? 'border-[var(--acento)] bg-[var(--acento)] text-white' : 'border-[var(--linea)] bg-white'}`}>{c}</button>)}
                    {ver && elec[k] !== null && <span className={elec[k] === clase(s.pH) ? 'text-[#1e8449]' : 'text-[#b5462c]'}>{elec[k] === clase(s.pH) ? ' ✔' : ` ✘ ${CLASES[clase(s.pH)].toLowerCase()}`}</span>}</td>
                </tr>
              )
            })}</tbody>
          </table>
          <button type="button" disabled={!elec.some((e) => e !== null)} onClick={() => setVer(true)} className="mt-2 min-h-10 rounded-full bg-[var(--acento)] px-5 font-semibold text-white disabled:opacity-50">Comprobar</button>
        </div>
      )}
      {ver && <p className="rounded-lg bg-[#eaf5ee] p-2 text-sm"><b>Conclusión:</b> los <b>ácidos</b> (limón, vinagre, gaseosa) ponen el repollo rojo o rosado; las <b>bases</b> (bicarbonato, jabón, amoníaco) lo ponen azul, verde o amarillo; lo <b>neutro</b> (agua) lo deja morado. La escala de <b>pH</b> va de 0 a 14: menos de 7 es ácido, 7 es neutro y más de 7 es básico.{grado >= 9 ? ' Los ácidos sueltan iones H⁺ en el agua y las bases, iones OH⁻ (Arrhenius).' : ''}{grado >= 11 ? ' pH = −log[H⁺]: cada unidad de pH es diez veces más o menos ácido; el limón tiene unas 100 000 veces más H⁺ que la leche.' : ''}</p>}
      <p className="text-xs text-[var(--suave)]">Seguridad: el limpiador con amoníaco irrita (no lo huelas directo ni lo mezcles con cloro). Versión casera: repollo morado hervido en agua (con un adulto) y vasos transparentes con lo que haya en la cocina. pH y colores aproximados.</p>
    </div>
  )
}
