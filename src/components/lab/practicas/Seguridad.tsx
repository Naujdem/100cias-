import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

// Práctica cero (PLAN-LABORATORIOS.md, fase 0.2): minijuego de seguridad en cuatro rondas.
// 1 Vístete (equipo de protección), 2 Pictogramas GHS, 3 ¿Bien o mal?, 4 ¿A dónde va el residuo?
// Fuentes: guía de seguridad en clase práctica y sección de seguridad del manual de Bioquímica (GHS, residuos).

// ---------- pictogramas GHS (rombo rojo, símbolo negro) ----------

const LLAMA = 'M50 26 C40 40 37 49 41 57 C35 55 33 50 34 45 C27 53 29 71 50 73 C71 71 73 55 62 45 C62 51 60 55 56 57 C60 47 58 37 50 26 Z'

const SIMBOLO: Record<string, ReactNode> = {
  explosivo: (
    <g stroke="#111" strokeWidth="3.5" strokeLinecap="round">
      <circle cx="50" cy="60" r="10" fill="#111" stroke="none" />
      {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((a) => {
        const r = (a * Math.PI) / 180
        return <line key={a} x1={50 + Math.cos(r) * 15} y1={60 + Math.sin(r) * 15} x2={50 + Math.cos(r) * 24} y2={60 + Math.sin(r) * 24} />
      })}
    </g>
  ),
  inflamable: (
    <g>
      <path d={LLAMA} fill="#111" />
      <rect x="32" y="76" width="36" height="4" fill="#111" />
    </g>
  ),
  oxidante: (
    <g>
      <path d={LLAMA} fill="#111" transform="translate(20 4) scale(0.6)" />
      <circle cx="50" cy="62" r="10" fill="none" stroke="#111" strokeWidth="4" />
      <rect x="32" y="76" width="36" height="4" fill="#111" />
    </g>
  ),
  gas: <rect x="28" y="50" width="44" height="16" rx="8" fill="#111" transform="rotate(-20 50 58)" />,
  corrosivo: (
    <g fill="#111">
      <rect x="30" y="28" width="7" height="18" transform="rotate(-35 33 37)" />
      <rect x="60" y="28" width="7" height="18" transform="rotate(35 63 37)" />
      <circle cx="40" cy="52" r="2.5" />
      <circle cx="61" cy="52" r="2.5" />
      <path d="M26 66 h20 v6 h-6 l-3 -3 -3 3 h-8 z" />
      <path d="M54 64 q8 -2 20 2 v8 h-20 z" />
    </g>
  ),
  toxico: (
    <g>
      <g stroke="#111" strokeWidth="4" strokeLinecap="round">
        <line x1="34" y1="58" x2="66" y2="74" />
        <line x1="66" y1="58" x2="34" y2="74" />
      </g>
      <circle cx="50" cy="44" r="13" fill="#111" />
      <rect x="44" y="52" width="12" height="9" fill="#111" />
      <circle cx="45" cy="43" r="3.5" fill="#fff" />
      <circle cx="55" cy="43" r="3.5" fill="#fff" />
    </g>
  ),
  irritante: (
    <g fill="#111">
      <rect x="46" y="28" width="8" height="28" rx="3" />
      <circle cx="50" cy="66" r="5" />
    </g>
  ),
  salud: (
    <g>
      <circle cx="50" cy="32" r="7" fill="#111" />
      <path d="M36 74 L38 46 Q50 38 62 46 L64 74 Z" fill="#111" />
      <path d="M50 49 l2.5 6 6.5 .5 -5 4 1.5 6.5 -5.5 -3.5 -5.5 3.5 1.5 -6.5 -5 -4 6.5 -.5 z" fill="#fff" />
    </g>
  ),
  ambiente: (
    <g stroke="#111" strokeWidth="3" strokeLinecap="round" fill="none">
      <line x1="38" y1="70" x2="38" y2="34" />
      <line x1="38" y1="44" x2="28" y2="36" />
      <line x1="38" y1="50" x2="47" y2="42" />
      <ellipse cx="60" cy="68" rx="9" ry="5" fill="#111" />
      <path d="M69 68 l7 -5 v10 z" fill="#111" />
      <line x1="26" y1="76" x2="76" y2="76" />
    </g>
  ),
}

function Pictograma({ id, tam = 130 }: { id: string; tam?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={tam} height={tam} role="img" aria-label="Pictograma de peligro">
      <path d="M50 4 L96 50 L50 96 L4 50 Z" fill="#fff" stroke="#d31f1f" strokeWidth="7" strokeLinejoin="round" />
      {SIMBOLO[id]}
    </svg>
  )
}

interface Picto {
  id: string
  nombre: string
  ejemplo: string
  basico?: boolean
}
const PICTOS: Picto[] = [
  { id: 'inflamable', nombre: 'Inflamable', ejemplo: 'alcohol, acetona, gasolina', basico: true },
  { id: 'toxico', nombre: 'Tóxico (puede matar)', ejemplo: 'cianuros, metanol', basico: true },
  { id: 'corrosivo', nombre: 'Corrosivo', ejemplo: 'ácido clorhídrico, soda cáustica', basico: true },
  { id: 'irritante', nombre: 'Irritante o nocivo', ejemplo: 'sulfato de cobre, lejía diluida', basico: true },
  { id: 'ambiente', nombre: 'Peligroso para el medio ambiente', ejemplo: 'sales de cobre y de mercurio', basico: true },
  { id: 'explosivo', nombre: 'Explosivo', ejemplo: 'pólvora, nitroglicerina' },
  { id: 'oxidante', nombre: 'Oxidante (aviva el fuego)', ejemplo: 'agua oxigenada concentrada, permanganato' },
  { id: 'gas', nombre: 'Gas a presión', ejemplo: 'cilindros de oxígeno o de gas' },
  { id: 'salud', nombre: 'Peligro grave para la salud', ejemplo: 'benceno, formol (cáncer, daño a órganos)' },
]

// ---------- rondas ----------

const ROPA = [
  { t: 'Bata de manga larga', ok: true },
  { t: 'Gafas de seguridad', ok: true },
  { t: 'Guantes', ok: true },
  { t: 'Zapatos cerrados', ok: true },
  { t: 'Cabello recogido', ok: true },
  { t: 'Sandalias', ok: false },
  { t: 'Pantaloneta', ok: false },
  { t: 'Audífonos puestos', ok: false },
  { t: 'Manillas y anillos colgando', ok: false },
]

const SITUACIONES = [
  { t: 'Huelo un reactivo acercando la nariz al frasco.', ok: false, x: 'Se abanica el vapor con la mano hacia la nariz, desde lejos.' },
  { t: 'Para diluir un ácido, echo el ácido sobre el agua, poco a poco.', ok: true, x: 'Siempre ácido sobre agua: al revés, el calor puede hacer saltar el ácido.' },
  { t: 'Me como un pan mientras espero que hierva el agua.', ok: false, x: 'En el laboratorio no se come ni se bebe: los alimentos se pueden contaminar.' },
  { t: 'Caliento un tubo de ensayo apuntando hacia mi compañero.', ok: false, x: 'La boca del tubo apunta hacia donde no haya nadie: el líquido puede saltar.' },
  { t: 'Chupo la pipeta para subir el líquido.', ok: false, x: 'Nunca se pipetea con la boca: se usa una pera o pipeteador.' },
  { t: 'Me lavo las manos al terminar la práctica.', ok: true, x: 'Aunque se hayan usado guantes.' },
  { t: 'Le pongo etiqueta a cada frasco que preparo.', ok: true, x: 'Un frasco sin etiqueta es un peligro para el siguiente que lo use.' },
  { t: 'Se me regó un poco de ácido y no le digo al profesor para que no me regañe.', ok: false, x: 'Todo derrame o accidente se avisa de inmediato, por pequeño que sea.' },
  { t: 'Devuelvo al frasco el reactivo que me sobró.', ok: false, x: 'Lo que sale del frasco no vuelve: se puede contaminar todo el reactivo.' },
  { t: 'Antes de empezar, leo la guía y las etiquetas de los reactivos.', ok: true, x: 'Las etiquetas traen los pictogramas y cómo manejar cada sustancia.' },
  { t: 'Si me cae un químico en los ojos, me los lavo con abundante agua por 15 minutos y aviso.', ok: true, x: 'Para eso está el lavaojos: no se frota.' },
]

const DESTINOS = ['Desagüe con bastante agua', 'Frasco de residuos de metales', 'Frasco de solventes orgánicos', 'Caja de vidrio roto', 'Caneca de basura común']
const RESIDUOS = [
  { t: 'Solución de sulfato de cobre', d: 1, x: 'El cobre es tóxico para la vida del agua: va al frasco de metales.' },
  { t: 'Un tubo de ensayo roto', d: 3, x: 'El vidrio roto va en su caja, para que nadie se corte.' },
  { t: 'Restos de alcohol o acetona', d: 2, x: 'Los solventes orgánicos se recogen aparte: son inflamables y contaminan.' },
  { t: 'Agua con sal de cocina', d: 0, x: 'La sal común en poca cantidad se puede botar con bastante agua.' },
  { t: 'Papel de filtro con un poco de arena', d: 4, x: 'Sin sustancias peligrosas, va a la basura común.' },
  { t: 'Vinagre neutralizado con bicarbonato', d: 0, x: 'Ya neutralizado, se bota con bastante agua.' },
]

const mezclar = <T,>(a: T[]) => a.map((x) => [Math.random(), x] as const).sort((p, q) => p[0] - q[0]).map((p) => p[1])

export default function Seguridad({ grado }: { grado: number }) {
  const [ronda, setRonda] = useState(0)
  const [puntos, setPuntos] = useState<number[]>([0, 0, 0, 0])
  const sumar = (r: number, p: number) => setPuntos((x) => x.map((v, k) => (k === r ? p : v)))
  const totales = [ROPA.filter((r) => r.ok).length, grado < 9 ? 5 : PICTOS.length, SITUACIONES.length, RESIDUOS.length]
  const nombres = ['1. Vístete', '2. Pictogramas', '3. ¿Bien o mal?', '4. Residuos']

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {nombres.map((n, k) => (
          <button key={n} type="button" onClick={() => setRonda(k)} className={`min-h-10 rounded-full border px-4 text-sm font-semibold ${ronda === k ? 'border-[var(--acento)] bg-[var(--acento)] text-white' : 'border-[var(--linea)] bg-[var(--tarjeta)]'}`}>
            {n}
          </button>
        ))}
        <button type="button" onClick={() => setRonda(4)} className={`min-h-10 rounded-full border px-4 text-sm font-semibold ${ronda === 4 ? 'border-[var(--acento)] bg-[var(--acento)] text-white' : 'border-[var(--linea)] bg-[var(--tarjeta)]'}`}>
          Resultado
        </button>
      </div>
      <div className="rounded-2xl border border-[var(--linea)] bg-[var(--tarjeta)] p-5">
        {ronda === 0 && <Ropa onFin={(p) => { sumar(0, p); setRonda(1) }} />}
        {ronda === 1 && <Pictogramas key="p" grado={grado} onFin={(p) => { sumar(1, p); setRonda(2) }} />}
        {ronda === 2 && <BienMal key="b" onFin={(p) => { sumar(2, p); setRonda(3) }} />}
        {ronda === 3 && <Residuos key="r" onFin={(p) => { sumar(3, p); setRonda(4) }} />}
        {ronda === 4 && (
          <div>
            <h3 className="text-xl font-bold">
              {puntos.reduce((a, b) => a + b, 0) === totales.reduce((a, b) => a + b, 0) ? '¡Listo para el laboratorio! 🥽' : 'Resultado'}
            </h3>
            <ul className="mt-2 space-y-1">
              {nombres.map((n, k) => (
                <li key={n}>
                  {n}: <b>{puntos[k]} / {totales[k]}</b>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-[var(--suave)]">Cada colegio tiene su propio protocolo de residuos y emergencias: consúltalo con tu docente.</p>
          </div>
        )}
      </div>
    </div>
  )
}

/** botones con teclas 1–n */
function useTeclas(n: number, f: (k: number) => void, activo = true) {
  useEffect(() => {
    if (!activo) return
    const t = (ev: KeyboardEvent) => {
      const k = parseInt(ev.key, 10) - 1
      if (k >= 0 && k < n) f(k)
    }
    document.addEventListener('keydown', t)
    return () => document.removeEventListener('keydown', t)
  }, [n, f, activo])
}

function Ropa({ onFin }: { onFin: (p: number) => void }) {
  const [sel, setSel] = useState<Set<number>>(new Set())
  const [revisado, setRevisado] = useState(false)
  const tiene = (t: string) => sel.has(ROPA.findIndex((r) => r.t === t))
  const p = ROPA.filter((r, k) => r.ok === sel.has(k) && r.ok).length - ROPA.filter((r, k) => !r.ok && sel.has(k)).length
  return (
    <div className="grid items-start gap-4 md:grid-cols-[220px_1fr]">
      <svg viewBox="0 0 120 220" className="mx-auto w-44" role="img" aria-label="Estudiante">
        {tiene('Cabello recogido') ? <circle cx="60" cy="18" r="10" fill="#3b2a18" /> : <path d="M40 30 Q40 6 60 6 Q80 6 80 30 L84 60 H36 Z" fill="#3b2a18" />}
        <circle cx="60" cy="32" r="16" fill="#d9a77a" />
        {tiene('Gafas de seguridad') && <rect x="44" y="26" width="32" height="10" rx="4" fill="rgba(140,200,240,0.7)" stroke="#333" strokeWidth="2" />}
        <path d="M34 54 Q60 44 86 54 L92 130 H28 Z" fill={tiene('Bata de manga larga') ? '#fff' : '#e07a5f'} stroke="#555" strokeWidth="2" />
        <rect x={tiene('Bata de manga larga') ? 18 : 24} y="56" width="12" height={tiene('Bata de manga larga') ? 64 : 30} fill={tiene('Bata de manga larga') ? '#fff' : '#e07a5f'} stroke="#555" strokeWidth="2" />
        <rect x={tiene('Bata de manga larga') ? 90 : 86} y="56" width="12" height={tiene('Bata de manga larga') ? 64 : 30} fill={tiene('Bata de manga larga') ? '#fff' : '#e07a5f'} stroke="#555" strokeWidth="2" />
        <circle cx="24" cy="126" r="7" fill={tiene('Guantes') ? '#5fa8d3' : '#d9a77a'} />
        <circle cx="96" cy="126" r="7" fill={tiene('Guantes') ? '#5fa8d3' : '#d9a77a'} />
        <rect x="38" y="130" width="18" height={tiene('Pantaloneta') ? 30 : 70} fill="#34506b" />
        <rect x="64" y="130" width="18" height={tiene('Pantaloneta') ? 30 : 70} fill="#34506b" />
        {tiene('Pantaloneta') && (
          <>
            <rect x="40" y="160" width="14" height="40" fill="#d9a77a" />
            <rect x="66" y="160" width="14" height="40" fill="#d9a77a" />
          </>
        )}
        {tiene('Zapatos cerrados') ? (
          <>
            <rect x="34" y="198" width="24" height="12" rx="5" fill="#222" />
            <rect x="62" y="198" width="24" height="12" rx="5" fill="#222" />
          </>
        ) : (
          <>
            <rect x="34" y="206" width="24" height="4" fill={tiene('Sandalias') ? '#c8781e' : '#d9a77a'} />
            <rect x="62" y="206" width="24" height="4" fill={tiene('Sandalias') ? '#c8781e' : '#d9a77a'} />
          </>
        )}
        {tiene('Audífonos puestos') && <path d="M42 30 Q60 0 78 30" fill="none" stroke="#222" strokeWidth="4" />}
      </svg>
      <div>
        <p className="font-semibold">Elige lo que debes llevar puesto en el laboratorio.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {ROPA.map((r, k) => {
            const on = sel.has(k)
            const color = revisado ? (r.ok ? (on ? 'border-[#2e7d5a] bg-[#eaf5ee]' : 'border-[#c8781e] bg-[#fff6e8]') : on ? 'border-[#b5462c] bg-[#fbeee9]' : '') : on ? 'border-[var(--acento)] bg-[var(--fondo)]' : ''
            return (
              <button key={r.t} type="button" disabled={revisado} onClick={() => setSel((s) => { const n = new Set(s); if (n.has(k)) n.delete(k); else n.add(k); return n })} className={`min-h-10 rounded-full border border-[var(--linea)] px-3 text-sm font-semibold ${color}`}>
                {on ? '✔ ' : ''}{r.t}
              </button>
            )
          })}
        </div>
        {!revisado ? (
          <button type="button" onClick={() => setRevisado(true)} className="mt-4 min-h-10 rounded-full bg-[var(--acento)] px-5 text-sm font-semibold text-white">Revisar</button>
        ) : (
          <div className="mt-4 text-sm">
            <p>Verde: bien elegido. Naranja: te faltó. Rojo: no va en el laboratorio (sandalias y pantaloneta dejan la piel expuesta; los audífonos no te dejan oír una alerta; las manillas se enganchan o caen en los reactivos).</p>
            <button type="button" onClick={() => onFin(Math.max(0, p))} className="mt-3 min-h-10 rounded-full bg-[var(--acento)] px-5 font-semibold text-white">Siguiente ronda</button>
          </div>
        )}
      </div>
    </div>
  )
}

function Pictogramas({ grado, onFin }: { grado: number; onFin: (p: number) => void }) {
  const [lista] = useState(() => mezclar(PICTOS.filter((p) => grado >= 9 || p.basico)))
  const [i, setI] = useState(0)
  const [p, setP] = useState(0)
  const [elegido, setElegido] = useState<number | null>(null)
  const actual = lista[i]
  const [opciones, setOpciones] = useState<Picto[]>([])
  useEffect(() => {
    setOpciones(mezclar([actual, ...mezclar(lista.filter((x) => x.id !== actual.id)).slice(0, 3)]))
    setElegido(null)
  }, [i, actual, lista])
  const elegir = (k: number) => {
    if (elegido !== null || !opciones[k]) return
    setElegido(k)
    if (opciones[k].id === actual.id) setP((x) => x + 1)
  }
  useTeclas(opciones.length, elegir, elegido === null)
  const ultimo = i === lista.length - 1
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <p className="text-sm text-[var(--suave)]">Pictograma {i + 1} de {lista.length} · ¿Qué significa?</p>
      <Pictograma id={actual.id} />
      <div className="grid w-full max-w-xl gap-2 sm:grid-cols-2">
        {opciones.map((o, k) => {
          const c = elegido === null ? '' : o.id === actual.id ? 'border-[#2e7d5a] bg-[#eaf5ee]' : k === elegido ? 'border-[#b5462c] bg-[#fbeee9]' : 'opacity-50'
          return (
            <button key={o.id} type="button" onClick={() => elegir(k)} className={`min-h-11 rounded-xl border border-[var(--linea)] px-3 text-sm font-semibold ${c}`}>
              <span className="mr-1 opacity-50">{k + 1}</span> {o.nombre}
            </button>
          )
        })}
      </div>
      {elegido !== null && (
        <>
          <p className="text-sm">
            <b>{actual.nombre}.</b> Ejemplos: {actual.ejemplo}.
          </p>
          <button type="button" onClick={() => (ultimo ? onFin(p) : setI(i + 1))} className="min-h-10 rounded-full bg-[var(--acento)] px-5 text-sm font-semibold text-white">
            {ultimo ? 'Siguiente ronda' : 'Siguiente'}
          </button>
        </>
      )}
    </div>
  )
}

function BienMal({ onFin }: { onFin: (p: number) => void }) {
  const [lista] = useState(() => mezclar(SITUACIONES))
  const [i, setI] = useState(0)
  const [p, setP] = useState(0)
  const [r, setR] = useState<boolean | null>(null)
  const s = lista[i]
  const elegir = (k: number) => {
    if (r !== null) return
    const dijo = k === 0
    setR(dijo)
    if (dijo === s.ok) setP((x) => x + 1)
  }
  useTeclas(2, elegir, r === null)
  const ultimo = i === lista.length - 1
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <p className="text-sm text-[var(--suave)]">Situación {i + 1} de {lista.length}</p>
      <p className="max-w-xl text-lg font-semibold">«{s.t}»</p>
      <div className="flex gap-3">
        {['Bien hecho', 'Mal hecho'].map((t, k) => {
          const c = r === null ? '' : (k === 0) === s.ok ? 'border-[#2e7d5a] bg-[#eaf5ee]' : (k === 0) === r ? 'border-[#b5462c] bg-[#fbeee9]' : 'opacity-50'
          return (
            <button key={t} type="button" onClick={() => elegir(k)} className={`min-h-12 rounded-xl border border-[var(--linea)] px-6 font-semibold ${c}`}>
              <span className="mr-1 opacity-50">{k + 1}</span> {k === 0 ? '✔' : '✘'} {t}
            </button>
          )
        })}
      </div>
      {r !== null && (
        <>
          <p className="max-w-xl text-sm">
            <b>{r === s.ok ? '¡Correcto!' : 'No.'}</b> {s.x}
          </p>
          <button type="button" onClick={() => (ultimo ? onFin(p) : (setI(i + 1), setR(null)))} className="min-h-10 rounded-full bg-[var(--acento)] px-5 text-sm font-semibold text-white">
            {ultimo ? 'Siguiente ronda' : 'Siguiente'}
          </button>
        </>
      )}
    </div>
  )
}

function Residuos({ onFin }: { onFin: (p: number) => void }) {
  const [lista] = useState(() => mezclar(RESIDUOS))
  const [i, setI] = useState(0)
  const [p, setP] = useState(0)
  const [d, setD] = useState<number | null>(null)
  const s = lista[i]
  const elegir = (k: number) => {
    if (d !== null) return
    setD(k)
    if (k === s.d) setP((x) => x + 1)
  }
  useTeclas(DESTINOS.length, elegir, d === null)
  const ultimo = i === lista.length - 1
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <p className="text-sm text-[var(--suave)]">Residuo {i + 1} de {lista.length} · ¿A dónde va?</p>
      <p className="text-lg font-semibold">{s.t}</p>
      <div className="grid w-full max-w-2xl gap-2 sm:grid-cols-2">
        {DESTINOS.map((t, k) => {
          const c = d === null ? '' : k === s.d ? 'border-[#2e7d5a] bg-[#eaf5ee]' : k === d ? 'border-[#b5462c] bg-[#fbeee9]' : 'opacity-50'
          return (
            <button key={t} type="button" onClick={() => elegir(k)} className={`min-h-11 rounded-xl border border-[var(--linea)] px-3 text-sm font-semibold ${c}`}>
              <span className="mr-1 opacity-50">{k + 1}</span> {t}
            </button>
          )
        })}
      </div>
      {d !== null && (
        <>
          <p className="max-w-xl text-sm">{s.x}</p>
          <button type="button" onClick={() => (ultimo ? onFin(p) : (setI(i + 1), setD(null)))} className="min-h-10 rounded-full bg-[var(--acento)] px-5 text-sm font-semibold text-white">
            {ultimo ? 'Ver resultado' : 'Siguiente'}
          </button>
        </>
      )}
    </div>
  )
}
