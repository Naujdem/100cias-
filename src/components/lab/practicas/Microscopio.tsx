import { useCallback, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import MicroscopioPanel from '../MicroscopioPanel.tsx'

// Laboratorio de Biología 1 (PLAN-LABORATORIOS.md): el microscopio. Partes (explorar y «toca el…»),
// enfoque virtual (objetivos, macro y micrométrico, luz; se puede romper la lámina) y reto a 400x.

// ---------- partes ----------

interface Parte {
  id: string
  nombre: string
  fn: string
  basico?: boolean
  dibujo: (c: string) => ReactNode
}

const GRIS = '#c9cfd6'
const OSCURO = '#4a5560'

const PARTES: Parte[] = [
  { id: 'base', nombre: 'Base', fn: 'Sostiene todo el microscopio. Se carga con una mano debajo de la base y otra en el brazo.', basico: true, dibujo: (c) => <rect x="60" y="356" width="190" height="26" rx="10" fill={c} stroke={OSCURO} strokeWidth="2" /> },
  { id: 'brazo', nombre: 'Brazo', fn: 'Une la base con el tubo; de aquí se agarra para cargarlo.', basico: true, dibujo: (c) => <path d="M88 356 C70 290 72 200 140 120 L158 136 C102 200 104 290 116 356 Z" fill={c} stroke={OSCURO} strokeWidth="2" /> },
  { id: 'ocular', nombre: 'Ocular', fn: 'Lente por donde se mira. Casi siempre aumenta 10 veces (10x).', basico: true, dibujo: (c) => <rect x="161" y="14" width="22" height="36" rx="3" fill={c} stroke={OSCURO} strokeWidth="2" /> },
  { id: 'tubo', nombre: 'Tubo', fn: 'Lleva la imagen del objetivo al ocular.', dibujo: (c) => <rect x="156" y="50" width="32" height="112" fill={c} stroke={OSCURO} strokeWidth="2" /> },
  { id: 'revolver', nombre: 'Revólver', fn: 'Pieza que gira para cambiar de objetivo.', dibujo: (c) => <path d="M146 162 H198 L204 180 H140 Z" fill={c} stroke={OSCURO} strokeWidth="2" /> },
  {
    id: 'objetivos', nombre: 'Objetivos', fn: 'Lentes cerca de la muestra: 4x, 10x, 40x (y 100x de inmersión). Son los que más aumentan.', basico: true,
    dibujo: (c) => (
      <g fill={c} stroke={OSCURO} strokeWidth="2">
        <rect x="146" y="180" width="12" height="22" transform="rotate(14 152 180)" />
        <rect x="165" y="180" width="14" height="34" />
        <rect x="186" y="180" width="12" height="26" transform="rotate(-14 192 180)" />
      </g>
    ),
  },
  { id: 'platina', nombre: 'Platina', fn: 'Mesa donde va la lámina, con un hueco para que pase la luz.', basico: true, dibujo: (c) => <rect x="118" y="232" width="128" height="10" fill={c} stroke={OSCURO} strokeWidth="2" /> },
  { id: 'pinzas', nombre: 'Pinzas', fn: 'Sujetan la lámina sobre la platina.', dibujo: (c) => <path d="M126 230 L156 226 M238 230 L208 226" stroke={c === GRIS ? OSCURO : c} strokeWidth="4" strokeLinecap="round" /> },
  { id: 'condensador', nombre: 'Condensador y diafragma', fn: 'Concentran la luz y regulan cuánta pasa por la muestra.', dibujo: (c) => <rect x="160" y="244" width="26" height="18" fill={c} stroke={OSCURO} strokeWidth="2" /> },
  { id: 'luz', nombre: 'Fuente de luz', fn: 'Lámpara (o espejo) que ilumina la muestra desde abajo.', basico: true, dibujo: (c) => <circle cx="173" cy="340" r="12" fill={c === GRIS ? '#f6d65a' : c} stroke={OSCURO} strokeWidth="2" /> },
  { id: 'macro', nombre: 'Tornillo macrométrico', fn: 'Sube y baja la platina de a mucho: enfoque grueso. Solo con objetivos de 4x y 10x.', basico: true, dibujo: (c) => <circle cx="100" cy="262" r="17" fill={c} stroke={OSCURO} strokeWidth="2" /> },
  { id: 'micro', nombre: 'Tornillo micrométrico', fn: 'Mueve la platina de a poquito: enfoque fino. El único que se usa con 40x y 100x.', basico: true, dibujo: (c) => <circle cx="100" cy="300" r="10" fill={c} stroke={OSCURO} strokeWidth="2" /> },
]

function DibujoMicroscopio({ partes, marcada, color, onTocar }: { partes: Parte[]; marcada?: string; color?: string; onTocar: (id: string) => void }) {
  return (
    <svg viewBox="40 0 240 390" className="w-full max-w-[300px]" role="img" aria-label="Microscopio">
      {PARTES.map((p) => {
        const activa = partes.some((x) => x.id === p.id)
        return (
          <g key={p.id} onClick={() => activa && onTocar(p.id)} className={activa ? 'cursor-pointer' : ''} opacity={activa ? 1 : 0.85}>
            {p.dibujo(marcada === p.id ? (color ?? '#f2a03d') : GRIS)}
          </g>
        )
      })}
    </svg>
  )
}

function Partes({ grado }: { grado: number }) {
  const partes = PARTES.filter((p) => grado >= 9 || p.basico)
  const [modo, setModo] = useState<'ver' | 'toca'>('ver')
  const [sel, setSel] = useState(partes[0].id)
  const [orden, setOrden] = useState(() => [...partes].sort(() => Math.random() - 0.5))
  const [i, setI] = useState(0)
  const [p, setP] = useState(0)
  const [resp, setResp] = useState<string | null>(null)
  const P = PARTES.find((x) => x.id === sel)!
  const q = orden[i]
  const tocar = (id: string) => {
    if (modo === 'ver') return setSel(id)
    if (resp || !q) return
    setResp(id)
    if (id === q.id) setP((x) => x + 1)
  }
  return (
    <div className="grid items-start gap-4 md:grid-cols-[300px_1fr]">
      <DibujoMicroscopio partes={partes} marcada={modo === 'ver' ? sel : (resp ?? undefined)} color={modo === 'toca' && resp ? (resp === q?.id ? '#2e9d6a' : '#d0573a') : undefined} onTocar={tocar} />
      <div className="rounded-2xl border border-[var(--linea)] bg-[var(--tarjeta)] p-4">
        <div className="flex gap-2">
          {(['ver', 'toca'] as const).map((m) => (
            <button key={m} type="button" onClick={() => { setModo(m); setI(0); setP(0); setResp(null); setOrden([...partes].sort(() => Math.random() - 0.5)) }} className={`min-h-10 rounded-full border px-4 text-sm font-semibold ${modo === m ? 'border-[var(--acento)] bg-[var(--acento)] text-white' : 'border-[var(--linea)]'}`}>
              {m === 'ver' ? 'Conoce las partes' : 'Toca la parte'}
            </button>
          ))}
        </div>
        {modo === 'ver' ? (
          <>
            <h3 className="mt-4 text-xl font-bold">{P.nombre}</h3>
            <p className="mt-1">{P.fn}</p>
            <div className="mt-3 flex flex-wrap gap-1">
              {partes.map((x) => (
                <button key={x.id} type="button" onClick={() => setSel(x.id)} className={`rounded-full border px-3 py-1 text-xs font-semibold ${sel === x.id ? 'border-[var(--acento)]' : 'border-[var(--linea)]'}`}>
                  {x.nombre}
                </button>
              ))}
            </div>
          </>
        ) : q ? (
          <>
            <p className="mt-4 text-sm text-[var(--suave)]">{i + 1} de {orden.length}</p>
            <h3 className="text-xl font-bold">Toca: {q.nombre}</h3>
            {resp && (
              <>
                <p className="mt-2 text-sm"><b>{resp === q.id ? '¡Sí!' : `Esa es: ${PARTES.find((x) => x.id === resp)!.nombre}.`}</b> {q.fn}</p>
                <button type="button" onClick={() => { setI(i + 1); setResp(null) }} className="mt-3 min-h-10 rounded-full bg-[var(--acento)] px-5 text-sm font-semibold text-white">Siguiente</button>
              </>
            )}
          </>
        ) : (
          <h3 className="mt-4 text-xl font-bold">Acertaste {p} de {orden.length}{p === orden.length ? ' 🔬' : ''}</h3>
        )}
      </div>
    </div>
  )
}

// ---------- enfoque ----------

interface Obj {
  x: number
  ideal: number // altura de la platina en que enfoca
  tope: number // por encima, el objetivo toca la lámina
  k: number // qué tan rápido se desenfoca (profundidad de campo)
  luz: number // luz que necesita
}
export const OBJETIVOS: Obj[] = [
  { x: 4, ideal: 40, tope: 92, k: 0.35, luz: 0.35 },
  { x: 10, ideal: 55, tope: 80, k: 0.8, luz: 0.5 },
  { x: 40, ideal: 62, tope: 66, k: 2.2, luz: 0.75 },
  { x: 100, ideal: 64, tope: 64.6, k: 4, luz: 0.95 },
]

export interface Est {
  obj: number
  z: number
  luz: number
  aceite: boolean
  rota: boolean
  roturas: number
  usoMacroAlto: boolean // usó el macrométrico con 40x o 100x
  enfocados: number[] // objetivos en que se logró enfocar, en orden
}
const INICIO: Est = { obj: 0, z: 20, luz: 0.3, aceite: false, rota: false, roturas: 0, usoMacroAlto: false, enfocados: [] }

export const desenfoque = (e: Est) => {
  const o = OBJETIVOS[e.obj]
  let b = Math.abs(e.z - o.ideal) * o.k
  if (o.x === 100 && !e.aceite) b = Math.max(b, 5)
  return Math.min(14, b)
}

export function useEnfoque(grado: number) {
  const [e, setE] = useState<Est>(INICIO)
  const [msg, setMsg] = useState<{ t: string; aviso?: boolean } | null>(null)
  const maxObj = grado >= 11 ? 3 : 2

  const mover = useCallback((dz: number, macro: boolean) => {
    setE((x) => {
      if (x.rota) return x
      const o = OBJETIVOS[x.obj]
      const z = Math.max(0, Math.min(100, x.z + dz))
      const n: Est = { ...x, z, usoMacroAlto: x.usoMacroAlto || (macro && o.x >= 40) }
      if (z > o.tope) {
        setMsg({ t: `¡Crac! El objetivo de ${o.x}x tocó la lámina y la rompió.${macro && o.x >= 40 ? ' Con 40x y 100x solo se usa el micrométrico.' : ''}`, aviso: true })
        return { ...n, rota: true, roturas: x.roturas + 1 }
      }
      if (macro && o.x >= 40) setMsg({ t: `Cuidado: con ${o.x}x el macrométrico es peligroso; usa el micrométrico.`, aviso: true })
      else setMsg(null)
      if (Math.abs(z - o.ideal) * o.k < 1 && !n.enfocados.includes(x.obj)) n.enfocados = [...n.enfocados, x.obj]
      return n
    })
  }, [])

  const objetivo = useCallback((k: number) => {
    if (k > maxObj) return
    setE((x) => {
      if (x.rota) return x
      const o = OBJETIVOS[k]
      if (x.z > o.tope) {
        setMsg({ t: `Al girar el revólver, el objetivo de ${o.x}x chocó con la lámina. Antes de cambiar, baja un poco la platina o enfoca primero con el objetivo menor.`, aviso: true })
        return { ...x, obj: k, rota: true, roturas: x.roturas + 1 }
      }
      setMsg(o.x === 100 && !x.aceite ? { t: 'El objetivo de 100x es de inmersión: necesita una gota de aceite sobre la lámina.', aviso: true } : null)
      return { ...x, obj: k }
    })
  }, [maxObj])

  const luz = useCallback((d: number) => setE((x) => ({ ...x, luz: Math.max(0, Math.min(1, Math.round((x.luz + d) * 100) / 100)) })), [])
  const cambiarLamina = useCallback(() => {
    setE((x) => ({ ...x, rota: false, obj: 0, z: 20, aceite: false }))
    setMsg({ t: 'Pones una lámina nueva y vuelves al objetivo de 4x, con la platina abajo.' })
  }, [])
  const aceite = useCallback(() => setE((x) => ({ ...x, aceite: true })), [])

  useEffect(() => {
    const t = (ev: KeyboardEvent) => {
      if ((ev.target as HTMLElement).tagName === 'INPUT') return
      const k = ev.key.toLowerCase()
      if (ev.key === 'ArrowUp') mover(4, true)
      else if (ev.key === 'ArrowDown') mover(-4, true)
      else if (k === 'w') mover(0.4, false)
      else if (k === 's') mover(-0.4, false)
      else if (k === 'l') luz(0.05)
      else if (k === 'k') luz(-0.05)
      else if (/^[1-4]$/.test(k)) objetivo(+k - 1)
      else return
      ev.preventDefault()
    }
    document.addEventListener('keydown', t)
    return () => document.removeEventListener('keydown', t)
  }, [mover, luz, objetivo])

  return { e, setE, msg, setMsg, mover, objetivo, luz, cambiarLamina, aceite, maxObj }
}

/** células de cebolla a 40x (300 × 300): la muestra que se ve al microscopio en esta práctica */
const CEBOLLA = (
  <g>
    {Array.from({ length: 7 }, (_, f) =>
      Array.from({ length: 5 }, (_, c) => {
        const x = c * 64 - (f % 2) * 32
        const y = f * 46
        return (
          <g key={`${f}-${c}`}>
            <rect x={x} y={y} width="64" height="46" fill="#fbf1d9" stroke="#b07b2c" strokeWidth="3" />
            <ellipse cx={x + 22} cy={y + 20} rx="6" ry="5" fill="#8a5a1e" />
          </g>
        )
      }),
    )}
  </g>
)

// «Aprende a enfocar» y el reto usan el mismo microscopio que las prácticas (MicroscopioPanel).
function Enfoque({ grado, reto }: { grado: number; reto: boolean }) {
  const [e, setE] = useState<Est | null>(null)
  const [clave, setClave] = useState(0)
  const [aumento, setAumento] = useState('')
  const [res, setRes] = useState<{ ok: boolean; lineas: string[] } | null>(null)
  const ayudas = grado < 11
  const maxObj = grado >= 11 ? 3 : 2
  const btn = 'min-h-10 rounded-full border border-[var(--linea)] bg-[var(--tarjeta)] px-3 text-sm font-semibold hover:border-[var(--acento)]'

  const comprobar = () => {
    if (!e) return
    const o = OBJETIVOS[e.obj]
    const b = desenfoque(e)
    const lineas: string[] = []
    let ok = true
    if (e.rota) { ok = false; lineas.push('La lámina está rota: cambia la lámina y vuelve a empezar desde 4x.') }
    if (o.x !== 40) { ok = false; lineas.push(`Estás en ${o.x}x: el reto es ver las células con el objetivo de 40x.`) }
    else if (b >= 1) { ok = false; lineas.push('La imagen todavía está borrosa: ajusta con el micrométrico (W/S).') }
    if (Math.abs(e.luz - o.luz) > 0.15) { ok = false; lineas.push(e.luz < o.luz ? 'Falta luz: abre el diafragma (L).' : 'Hay demasiada luz y la imagen se ve lavada: cierra un poco el diafragma (K).') }
    if (parseInt(aumento, 10) !== 400) { ok = false; lineas.push('El aumento total es ocular × objetivo: 10x × 40x = 400x.') }
    if (e.enfocados[0] !== 0) lineas.push('Recuerda: siempre se empieza enfocando con el objetivo menor (4x).')
    if (e.usoMacroAlto) lineas.push('Usaste el macrométrico con un objetivo grande: así se rompen láminas y objetivos.')
    if (e.roturas) lineas.push(`Rompiste ${e.roturas} lámina${e.roturas > 1 ? 's' : ''}.`)
    if (ok && !e.roturas && !e.usoMacroAlto && e.enfocados[0] === 0) lineas.push('Procedimiento perfecto: 4x → 10x → 40x, macrométrico solo al inicio y micrométrico al final.')
    setRes({ ok, lineas })
  }

  return (
    <div className="flex flex-col gap-3">
      {reto && (
        <p className="rounded-xl bg-[var(--fondo)] p-3 text-sm">
          <b>Reto:</b> observa las células de cebolla con el objetivo de <b>40x</b>, bien enfocadas y con la luz justa, sin romper la lámina. Luego escribe el aumento total y pulsa «Comprobar».
        </p>
      )}
      <MicroscopioPanel key={clave} grado={grado} maxObj={maxObj} muestra={CEBOLLA} onEstado={setE} />
      {reto && (
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-sm font-semibold">Aumento total (10x × objetivo): <input value={aumento} onChange={(x) => setAumento(x.target.value.replace(/\D/g, ''))} className="w-24 rounded-lg border border-[var(--linea)] bg-white px-2 py-1" /></label>
          <button type="button" className={btn} onClick={comprobar}>Comprobar</button>
          {res && (
            <div className={`w-full rounded-xl border-2 p-3 text-sm ${res.ok ? 'border-[#2e7d5a] bg-[#eaf5ee]' : 'border-[#b5462c] bg-[#fbeee9]'}`}>
              <ul className="list-disc pl-5">{res.lineas.map((l) => <li key={l}>{l}</li>)}</ul>
            </div>
          )}
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        <button type="button" className={btn} onClick={() => { setClave((k) => k + 1); setRes(null); setAumento('') }}>Empezar de nuevo</button>
      </div>
      {ayudas && <p className="text-xs text-[var(--suave)]">Pistas activas (grados menores de 11°): el enfoque te indica si está enfocado, casi o borroso.</p>}
    </div>
  )
}

export default function Microscopio({ grado }: { grado: number }) {
  const [modo, setModo] = useState<'partes' | 'enfoca' | 'reto'>('partes')
  const t = { partes: '1. Las partes', enfoca: '2. Aprende a enfocar', reto: '3. Reto: 400x' }
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {(Object.keys(t) as (keyof typeof t)[]).map((m) => (
          <button key={m} type="button" onClick={() => setModo(m)} className={`min-h-10 rounded-full border px-4 text-sm font-semibold ${modo === m ? 'border-[var(--acento)] bg-[var(--acento)] text-white' : 'border-[var(--linea)] bg-[var(--tarjeta)]'}`}>
            {t[m]}
          </button>
        ))}
      </div>
      {modo === 'partes' && <Partes grado={grado} />}
      {modo === 'enfoca' && <Enfoque key="e" grado={grado} reto={false} />}
      {modo === 'reto' && <Enfoque key="r" grado={grado} reto />}
      {modo !== 'partes' && (
        <p className="text-sm text-[var(--suave)]">
          Pasos: 1) empieza con 4x y la platina abajo; 2) sube con el macrométrico hasta ver la imagen; 3) afina con el micrométrico; 4) cambia a 10x y luego a 40x, y ahí usa solo el micrométrico; 5) ajusta la luz con el diafragma.
        </p>
      )}
    </div>
  )
}
