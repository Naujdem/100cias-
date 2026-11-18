import { useCallback, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

// Mesa de laboratorio: el motor común de los laboratorios virtuales (PLAN-LABORATORIOS.md, fase 0.1).
// Cada práctica solo da configuración: instrumentos (con su dibujo), qué pasa al pasar algo de uno a otro,
// acciones propias de cada instrumento, pistas y cómo se comprueba. Se maneja sin arrastrar: tocar el
// instrumento de origen y luego el destino; con teclado, ←/→ recorren la mesa, Enter elige, Esc cancela
// y los números 1–9 hacen las acciones.

export interface Hecho<E> {
  e: E
  msg?: string
  aviso?: boolean
}

export interface Boton<E> {
  etiqueta: string
  aplicar: (e: E) => Hecho<E>
}

export interface Instrumento<E> {
  id: string
  nombre: string
  /** centro horizontal en la mesa (viewBox de 1000 de ancho) */
  x: number
  ancho: number
  dibujo: (e: E) => ReactNode
  /** acciones del propio instrumento (tarar, agitar, vaciar…) */
  propias?: (e: E) => Boton<E>[]
}

export interface Nivel {
  grado: number
  calculadora: boolean
  pistas: boolean
}

export interface Resultado {
  ok: boolean
  titulo: string
  lineas: string[]
  datos: [string, string][]
}

export interface Practica<E> {
  id: string
  titulo: string
  resumen: string
  objetivo: (n: Nivel) => string
  desdeGrado: number
  seguridad?: string
  inicial: (n: Nivel) => E
  instrumentos: Instrumento<E>[]
  /** botones para pasar de un instrumento a otro, o el motivo por el que no se puede */
  pasar: (e: E, desde: string, hacia: string, n: Nivel) => Boton<E>[] | string
  pistas: (e: E, n: Nivel) => { texto: string; hecho: boolean }[]
  Calculadora?: (p: { n: Nivel }) => ReactNode
  comprobar: (e: E, n: Nivel) => Resultado
}

export default function Mesa<E>({ P, nivel }: { P: Practica<E>; nivel: Nivel }) {
  const [hist, setHist] = useState<E[]>(() => [P.inicial(nivel)])
  const e = hist[hist.length - 1]
  const [foco, setFoco] = useState(0)
  const [origen, setOrigen] = useState<string | null>(null)
  const [destino, setDestino] = useState<string | null>(null)
  const [log, setLog] = useState<{ t: string; aviso?: boolean }[]>([])
  const [res, setRes] = useState<Resultado | null>(null)
  const [conclusion, setConclusion] = useState('')

  const reiniciar = useCallback(() => {
    setHist([P.inicial(nivel)])
    setOrigen(null)
    setDestino(null)
    setLog([])
    setRes(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [P, nivel.grado])
  useEffect(reiniciar, [reiniciar])

  const hacer = useCallback(
    (b: Boton<E>) => {
      const h = b.aplicar(e)
      if (h.e !== e) setHist((x) => [...x, h.e])
      if (h.msg) setLog((l) => [{ t: h.msg!, aviso: h.aviso }, ...l].slice(0, 6))
      setRes(null)
    },
    [e],
  )

  const elegir = useCallback(
    (id: string) => {
      setFoco(P.instrumentos.findIndex((i) => i.id === id))
      if (!origen || origen === id) {
        setOrigen(origen === id ? null : id)
        setDestino(null)
      } else setDestino(id)
    },
    [origen, P],
  )

  const inst = (id: string | null) => P.instrumentos.find((i) => i.id === id)
  const O = inst(origen)
  const D = inst(destino)
  const pase = O && D ? P.pasar(e, O.id, D.id, nivel) : null
  const botones: Boton<E>[] = typeof pase === 'object' && pase ? pase : !D && O?.propias ? O.propias(e) : []

  useEffect(() => {
    const tecla = (ev: KeyboardEvent) => {
      const t = ev.target as HTMLElement
      if (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA') return
      const n = P.instrumentos.length
      if (ev.key === 'ArrowRight') setFoco((f) => (f + 1) % n)
      else if (ev.key === 'ArrowLeft') setFoco((f) => (f + n - 1) % n)
      else if (ev.key === 'Enter') elegir(P.instrumentos[foco].id)
      else if (ev.key === 'Escape') {
        setOrigen(null)
        setDestino(null)
      } else if (/^[1-9]$/.test(ev.key) && botones[+ev.key - 1]) hacer(botones[+ev.key - 1])
      else return
      ev.preventDefault()
    }
    document.addEventListener('keydown', tecla)
    return () => document.removeEventListener('keydown', tecla)
  }, [P, foco, elegir, botones, hacer])

  const pistas = P.pistas(e, nivel)
  const btn = 'min-h-10 rounded-full border border-[var(--linea)] bg-[var(--tarjeta)] px-4 text-sm font-semibold hover:border-[var(--acento)]'

  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-2xl bg-[var(--tarjeta)] p-4 text-[var(--tinta)]">
        <b>Objetivo:</b> {P.objetivo(nivel)}
      </p>

      <svg viewBox="0 0 1000 380" className="w-full rounded-2xl border border-[var(--linea)] bg-[#f4f1ea]" role="group" aria-label="Mesa de laboratorio">
        <rect x="0" y="330" width="1000" height="50" fill="#b98d5e" />
        <rect x="0" y="330" width="1000" height="6" fill="#9c7448" />
        {P.instrumentos.map((i, k) => {
          const esO = origen === i.id
          const esD = destino === i.id
          return (
            <g key={i.id} onClick={() => elegir(i.id)} className="cursor-pointer" role="button" aria-label={i.nombre}>
              <rect x={i.x - i.ancho / 2} y="40" width={i.ancho} height="330" fill="transparent" />
              {(foco === k || esO || esD) && (
                <rect
                  x={i.x - i.ancho / 2}
                  y="44"
                  width={i.ancho}
                  height="326"
                  rx="14"
                  fill={esO ? 'rgba(46,125,90,0.08)' : esD ? 'rgba(200,120,30,0.08)' : 'none'}
                  stroke={esO ? '#2e7d5a' : esD ? '#c8781e' : 'var(--acento)'}
                  strokeWidth="3"
                  strokeDasharray={foco === k && !esO && !esD ? '8 6' : undefined}
                />
              )}
              {i.dibujo(e)}
              <text x={i.x} y="366" textAnchor="middle" fontSize="15" fontWeight="700" fill="#3b2a18">
                {i.nombre}
              </text>
              {esO && <text x={i.x} y="64" textAnchor="middle" fontSize="13" fontWeight="800" fill="#2e7d5a">ORIGEN</text>}
              {esD && <text x={i.x} y="64" textAnchor="middle" fontSize="13" fontWeight="800" fill="#c8781e">DESTINO</text>}
            </g>
          )
        })}
      </svg>

      <div className="rounded-2xl border border-[var(--linea)] bg-[var(--tarjeta)] p-4">
        <p className="text-sm font-semibold">
          {!O
            ? 'Toca un instrumento (o usa ←/→ y Enter) para empezar.'
            : !D
              ? `${O.nombre}: toca otro instrumento para pasar algo a él${botones.length ? ', o usa sus acciones' : ''}.`
              : typeof pase === 'string'
                ? pase
                : `${O.nombre} → ${D.nombre}`}
        </p>
        {botones.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {botones.map((b, k) => (
              <button key={b.etiqueta} type="button" onClick={() => hacer(b)} className={btn}>
                <span className="mr-1 opacity-50">{k + 1}</span> {b.etiqueta}
              </button>
            ))}
          </div>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          {O && (
            <button type="button" className={btn} onClick={() => { setOrigen(null); setDestino(null) }}>
              Soltar (Esc)
            </button>
          )}
          <button type="button" className={btn} disabled={hist.length < 2} onClick={() => setHist((h) => (h.length > 1 ? h.slice(0, -1) : h))}>
            Deshacer
          </button>
          <button type="button" className={btn} onClick={reiniciar}>
            Empezar de nuevo
          </button>
          <button type="button" className={`${btn} !border-[var(--acento)] !bg-[var(--acento)] !text-white`} onClick={() => setRes(P.comprobar(e, nivel))}>
            Comprobar
          </button>
        </div>
        {log.length > 0 && (
          <ul className="mt-3 space-y-1 text-sm">
            {log.map((l, k) => (
              <li key={k} className={`${k ? 'opacity-50' : ''} ${l.aviso ? 'font-semibold text-[#b5462c]' : ''}`}>
                {l.aviso ? '⚠ ' : '• '}
                {l.t}
              </li>
            ))}
          </ul>
        )}
      </div>

      {res && (
        <div className={`rounded-2xl border-2 p-4 ${res.ok ? 'border-[#2e7d5a] bg-[#eaf5ee]' : 'border-[#b5462c] bg-[#fbeee9]'}`}>
          <h3 className="text-lg font-bold">{res.titulo}</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            {res.lineas.map((l) => <li key={l}>{l}</li>)}
          </ul>
          <h4 className="mt-4 font-semibold">Mini informe</h4>
          <table className="mt-1 w-full max-w-lg text-sm">
            <tbody>
              {res.datos.map(([a, b]) => (
                <tr key={a} className="border-b border-black/10">
                  <td className="py-1 pr-3">{a}</td>
                  <td className="py-1 font-bold">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <label className="mt-3 block text-sm font-semibold">
            Conclusión (¿qué salió bien, qué error hubo y cómo lo evitarías?)
            <textarea value={conclusion} onChange={(ev) => setConclusion(ev.target.value)} rows={3} className="mt-1 w-full rounded-xl border border-[var(--linea)] bg-white p-2 font-normal" />
          </label>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {nivel.pistas && (
          <div className="rounded-2xl bg-[var(--tarjeta)] p-4">
            <h3 className="font-semibold">Pasos</h3>
            <ol className="mt-2 space-y-1 text-sm">
              {pistas.map((p, k) => (
                <li key={k} className={p.hecho ? 'text-[#2e7d5a]' : ''}>
                  {p.hecho ? '✔' : `${k + 1}.`} {p.texto}
                </li>
              ))}
            </ol>
          </div>
        )}
        {nivel.calculadora && P.Calculadora && <P.Calculadora n={nivel} />}
      </div>
      {P.seguridad && <p className="text-sm text-[var(--suave)]">⚠ {P.seguridad}</p>}
    </div>
  )
}
