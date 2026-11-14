import { useState } from 'react'
import type { ComponentType, ReactNode } from 'react'
import PantallaCompleta from '../PantallaCompleta.tsx'
import { Lienzo, T, TINTA } from '../ilustraciones/Dibujo.tsx'
import { Pestanas } from './TiposCelulas.tsx'
import { ExploradorCelula } from './CelulaEucDiagramas.tsx'
import CuentaComoCelula from './CuentaComoCelula.tsx'
import { useFlechas } from '../../lib/flechasDiagrama.ts'

// Subtema 1.2: una mini-actividad propia para cada nivel (la primera pestaña de «Explora»).
// Orgánulos y célula reutilizan actividades de otros temas. Texto en borrador (ver VERIFICAR.md).

const CAJA = 'aspect-[4/3] max-h-[var(--alto-visor,38dvh)] w-full overflow-hidden rounded-xl border border-[var(--linea)]'
const BOTON = 'min-h-10 rounded-lg border border-[var(--linea)] px-3 text-sm font-semibold aria-pressed:border-[var(--acento)] aria-pressed:bg-[var(--acento-suave)]/40'
const Dos = ({ children }: { children: ReactNode }) => <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">{children}</div>
const Texto = ({ children }: { children: ReactNode }) => (
  <div aria-live="polite" className="rounded-xl bg-[var(--fondo)] p-3 text-sm">
    {children}
  </div>
)
const limitar = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n))

/* ── 1 · Átomos: de qué está hecho tu cuerpo ──────────────────────────────── */

const ATOMOS = [
  { id: 'O', nombre: 'Oxígeno', n: 65, color: '#d9534a', donde: 'Sobre todo en el agua, que es más de la mitad de tu cuerpo.' },
  { id: 'C', nombre: 'Carbono', n: 18, color: '#4a4a4a', donde: 'Forma el esqueleto de azúcares, grasas, proteínas y ADN.' },
  { id: 'H', nombre: 'Hidrógeno', n: 10, color: '#7fb2e5', donde: 'Está en el agua y en casi todas las moléculas del cuerpo.' },
  { id: 'N', nombre: 'Nitrógeno', n: 3, color: '#6b4fa3', donde: 'Está en las proteínas y en el ADN.' },
  { id: '+', nombre: 'Todos los demás', n: 4, color: '#e0b040', donde: 'Calcio, fósforo, potasio, hierro… muy poco de cada uno, pero indispensables.' },
]

function MiniAtomos() {
  const [sel, setSel] = useState(0)
  useFlechas((dir) => {
    setSel((s) => limitar(s + dir, 0, ATOMOS.length - 1))
    return true
  })
  const a = ATOMOS[sel]
  const cuadros = ATOMOS.flatMap((x, i) => Array.from({ length: x.n }, () => i))
  return (
    <PantallaCompleta conBoton>
      <p className="text-sm">Si tu cuerpo fueran 100 cuadritos de masa, ¿de qué átomo sería cada uno? Toca un átomo o usa ← →.</p>
      <Dos>
        <div className="grid grid-cols-[repeat(20,minmax(0,1fr))] gap-1 self-start" role="img" aria-label={`${a.nombre}: ${a.n} de cada 100 partes de la masa del cuerpo`}>
          {cuadros.map((i, k) => (
            <span key={k} className="aspect-square rounded-sm transition-opacity" style={{ background: ATOMOS[i].color, opacity: i === sel ? 1 : 0.22 }} />
          ))}
        </div>
        <Texto>
          <p className="text-xl font-bold">
            {a.nombre} <span className="text-[var(--suave)]">· {a.n} de 100</span>
          </p>
          <p className="mt-1">{a.donde}</p>
          <p className="mt-2 text-[var(--suave)]">Cuatro átomos suman 96 de cada 100. Son los mismos que hay en el aire, el agua y las rocas.</p>
        </Texto>
      </Dos>
      <div role="group" aria-label="Átomos" className="mt-3 flex flex-wrap gap-2">
        {ATOMOS.map((x, i) => (
          <button key={x.id} type="button" aria-pressed={i === sel} onClick={() => setSel(i)} className={BOTON}>
            <span aria-hidden="true" className="mr-2 inline-block h-3 w-3 rounded-sm align-middle" style={{ background: x.color }} />
            {x.nombre}
          </button>
        ))}
      </div>
    </PantallaCompleta>
  )
}

/* ── 2 · Moléculas: arma la molécula ──────────────────────────────────────── */

type At = 'H' | 'O' | 'C'
const BOLA: Record<At, { nombre: string; r: number; fill: string; texto: string }> = {
  H: { nombre: 'Hidrógeno', r: 15, fill: '#fff', texto: TINTA },
  O: { nombre: 'Oxígeno', r: 24, fill: '#d9534a', texto: '#fff' },
  C: { nombre: 'Carbono', r: 24, fill: '#4a4a4a', texto: '#fff' },
}
const RETOS: { nombre: string; formula: string; tiene: Record<At, number>; orden: At[]; dato: string }[] = [
  { nombre: 'agua', formula: 'H₂O', tiene: { H: 2, O: 1, C: 0 }, orden: ['H', 'O', 'H'], dato: 'Dos hidrógenos y un oxígeno. Es la molécula más abundante de tu cuerpo.' },
  { nombre: 'el oxígeno que respiras', formula: 'O₂', tiene: { H: 0, O: 2, C: 0 }, orden: ['O', 'O'], dato: 'Dos átomos de oxígeno unidos: ya no es un átomo suelto, es una molécula.' },
  { nombre: 'dióxido de carbono', formula: 'CO₂', tiene: { H: 0, O: 2, C: 1 }, orden: ['O', 'C', 'O'], dato: 'Un carbono entre dos oxígenos. Es lo que botas al respirar y lo que usan las plantas.' },
  { nombre: 'metano', formula: 'CH₄', tiene: { H: 4, O: 0, C: 1 }, orden: ['H', 'H', 'C', 'H', 'H'], dato: 'Un carbono con cuatro hidrógenos. Es el gas de los pantanos y del estiércol.' },
]

function MiniMoleculas() {
  const [reto, setReto] = useState(0)
  const [n, setN] = useState<Record<At, number>>({ H: 0, O: 0, C: 0 })
  const r = RETOS[reto]
  const listo = (['H', 'O', 'C'] as At[]).every((a) => n[a] === r.tiene[a])
  const ir = (i: number) => {
    setReto(limitar(i, 0, RETOS.length - 1))
    setN({ H: 0, O: 0, C: 0 })
  }
  useFlechas((dir) => {
    ir(reto + dir)
    return true
  })
  const bolas: At[] = listo ? r.orden : (['C', 'O', 'H'] as At[]).flatMap((a) => Array.from({ length: n[a] }, () => a))
  const paso = listo ? 38 : 52
  const x0 = 200 - ((bolas.length - 1) * paso) / 2
  return (
    <PantallaCompleta conBoton>
      <p className="text-sm">
        Reto {reto + 1} de {RETOS.length}: arma una molécula de <span className="font-bold">{r.nombre}</span> ({r.formula}). Con ← → cambias de reto.
      </p>
      <Dos>
        <div className={CAJA}>
          <Lienzo etiqueta={listo ? `Molécula de ${r.nombre}` : 'Átomos sueltos'}>
            {bolas.length === 0 && <T x={200} y={154} s={13}>Añade átomos con los botones</T>}
            {bolas.map((a, i) => (
              <g key={i}>
                <circle cx={x0 + i * paso} cy={150 + (listo && a === 'H' && r.orden.length > 2 ? (i % 2 ? 16 : -16) : 0)} r={BOLA[a].r} fill={BOLA[a].fill} stroke={TINTA} strokeWidth="2" />
                <T x={x0 + i * paso} y={155 + (listo && a === 'H' && r.orden.length > 2 ? (i % 2 ? 16 : -16) : 0)} s={13} b c={BOLA[a].texto}>{a}</T>
              </g>
            ))}
            <T x={200} y={262} s={13} b>{listo ? `${r.formula} · ¡unidos forman una molécula!` : 'átomos sueltos'}</T>
          </Lienzo>
        </div>
        <Texto>
          {(['H', 'O', 'C'] as At[]).map((a) => (
            <div key={a} className="mb-2 flex items-center gap-2">
              <span className="w-24 font-semibold">{BOLA[a].nombre}</span>
              <button type="button" aria-label={`Quitar ${BOLA[a].nombre}`} disabled={n[a] === 0} onClick={() => setN({ ...n, [a]: n[a] - 1 })} className="h-10 w-10 rounded-full border border-[var(--linea)] text-lg font-bold disabled:opacity-40">−</button>
              <span className="w-6 text-center text-lg font-bold">{n[a]}</span>
              <button type="button" aria-label={`Añadir ${BOLA[a].nombre}`} disabled={n[a] === 4} onClick={() => setN({ ...n, [a]: n[a] + 1 })} className="h-10 w-10 rounded-full border border-[var(--linea)] text-lg font-bold disabled:opacity-40">+</button>
            </div>
          ))}
          {listo ? (
            <>
              <p>
                <span className="font-semibold">¡Eso es!</span> {r.dato}
              </p>
              {reto < RETOS.length - 1 && (
                <button type="button" data-principal onClick={() => ir(reto + 1)} className="mt-2 min-h-10 rounded-full bg-[var(--acento)] px-5 text-sm font-bold text-[var(--sobre-acento)]">
                  Siguiente reto ›
                </button>
              )}
            </>
          ) : (
            <p className="text-[var(--suave)]">Los números pequeños de la fórmula dicen cuántos átomos de cada tipo lleva.</p>
          )}
        </Texto>
      </Dos>
    </PantallaCompleta>
  )
}

/* ── 3 · Macromoléculas: el collar de cuentas ─────────────────────────────── */

type Pieza = 'glucosa' | 'aminoacido' | 'nucleotido'
const PIEZAS: Record<Pieza, { pieza: string; macro: string; color: string; dato: string }> = {
  glucosa: { pieza: 'glucosa', macro: 'un carbohidrato, como el almidón o la celulosa', color: '#e0b040', dato: 'Un grano de almidón de papa tiene cadenas de miles de glucosas.' },
  aminoacido: { pieza: 'aminoácido', macro: 'una proteína', color: '#d97f4a', dato: 'Cada cadena de la hemoglobina tiene unos 140 aminoácidos.' },
  nucleotido: { pieza: 'nucleótido', macro: 'un ácido nucleico, como el ADN', color: '#6b9bd8', dato: 'El ADN de una sola de tus células tiene miles de millones de nucleótidos.' },
}

function MiniMacro() {
  const [tipo, setTipo] = useState<Pieza>('glucosa')
  const [n, setN] = useState(1)
  const p = PIEZAS[tipo]
  return (
    <PantallaCompleta conBoton>
      <Pestanas valor={tipo} opciones={[['glucosa', 'Glucosas'], ['aminoacido', 'Aminoácidos'], ['nucleotido', 'Nucleótidos']]} onCambio={setTipo} etiqueta="Tipo de pieza" />
      <Dos>
        <div className={CAJA}>
          <Lienzo etiqueta={`Cadena de ${n} piezas`}>
            {Array.from({ length: n }, (_, i) => {
              const fila = Math.floor(i / 12)
              const col = fila % 2 ? 11 - (i % 12) : i % 12
              return <circle key={i} cx={35 + col * 30} cy={50 + fila * 50} r="13" fill={p.color} stroke={TINTA} strokeWidth="1.8" />
            })}
          </Lienzo>
        </div>
        <Texto>
          <p className="text-xl font-bold">{n === 1 ? `1 ${p.pieza}` : `${n} piezas unidas`}</p>
          <p className="mt-1">
            {n === 1 ? 'Una sola pieza es una molécula pequeña.' : n < 12 ? 'Una cadena corta: todavía es pequeña.' : `Una cadena larga: así se arma ${p.macro}. Las de verdad tienen cientos o miles de piezas.`}
          </p>
          <p className="mt-2 text-[var(--suave)]">{p.dato}</p>
        </Texto>
      </Dos>
      <label htmlFor="mini-macro" className="mt-3 block text-sm font-semibold">Añade piezas a la cadena</label>
      <input id="mini-macro" type="range" min="1" max="60" step="1" value={n} onChange={(e) => setN(Number(e.target.value))} onPointerUp={(e) => e.currentTarget.closest<HTMLElement>('[role=dialog]')?.focus()} className="mt-1 h-8 w-full accent-[var(--acento)]" />
    </PantallaCompleta>
  )
}

/* ── 6 · Tejido: muchas células tirando juntas ────────────────────────────── */

function MiniTejido() {
  const [n, setN] = useState(1)
  const [tira, setTira] = useState(false)
  return (
    <PantallaCompleta conBoton>
      <p className="text-sm">Junta células de músculo y pídeles que se contraigan. Con ← → cambias cuántas hay; Enter o Espacio las contrae.</p>
      <Dos>
        <div className={`${CAJA} flex flex-wrap content-center justify-center gap-1 bg-[#f4efe4] p-4`} role="img" aria-label={`${n} células de músculo ${tira ? 'contraídas' : 'relajadas'}`}>
          {Array.from({ length: n }, (_, i) => (
            <span key={i} className="h-7 rounded-full border-2 border-[#8f2f29] bg-[#e8806f] transition-all duration-500 motion-reduce:transition-none" style={{ width: tira ? '2.4rem' : '4rem' }} />
          ))}
        </div>
        <Texto>
          <p className="text-xl font-bold">{n === 1 ? '1 célula' : `${n} células`}</p>
          <p className="mt-1 font-semibold">Fuerza al contraerse:</p>
          <div className="mt-1 h-4 w-full rounded-full bg-[var(--linea)]">
            <div className="h-4 rounded-full bg-[var(--acento)] transition-all duration-500" style={{ width: `${tira ? (n / 24) * 100 : 0}%` }} />
          </div>
          <p className="mt-2">
            {n === 1 ? 'Una célula sola se acorta, pero casi no mueve nada.' : n < 10 ? 'Unas pocas ya tiran un poco más.' : 'Muchas células parecidas, unidas y a la vez: esa fuerza es del tejido, no de ninguna célula sola.'}
          </p>
          <button type="button" data-principal aria-pressed={tira} onClick={() => setTira(!tira)} className="mt-2 min-h-10 rounded-full bg-[var(--acento)] px-5 text-sm font-bold text-[var(--sobre-acento)]">
            {tira ? 'Relajar' : 'Contraer'}
          </button>
        </Texto>
      </Dos>
      <label htmlFor="mini-tejido" className="mt-3 block text-sm font-semibold">Número de células</label>
      <input id="mini-tejido" type="range" min="1" max="24" step="1" value={n} onChange={(e) => setN(Number(e.target.value))} onPointerUp={(e) => e.currentTarget.closest<HTMLElement>('[role=dialog]')?.focus()} className="mt-1 h-8 w-full accent-[var(--acento)]" />
    </PantallaCompleta>
  )
}

/* ── 7 · Órgano: el corazón necesita sus cuatro tejidos ───────────────────── */

const TEJIDOS = [
  { id: 'muscular', nombre: 'Muscular', hace: 'se contrae', falta: 'No se contrae: el corazón no bombea.' },
  { id: 'conectivo', nombre: 'Conectivo', hace: 'sostiene y forma las válvulas', falta: 'Sin sostén ni válvulas firmes, la sangre se devuelve.' },
  { id: 'nervioso', nombre: 'Nervioso', hace: 'ajusta el ritmo', falta: 'Late, pero no puede acelerar ni frenar según lo que el cuerpo necesita.' },
  { id: 'epitelial', nombre: 'Epitelial', hace: 'forra por dentro', falta: 'Sin su forro liso por dentro, la sangre roza y forma coágulos.' },
]

function MiniOrgano() {
  const [on, setOn] = useState([true, true, true, true])
  const [foco, setFoco] = useState(0)
  const todos = on.every(Boolean)
  const cambiar = (i: number) => setOn((o) => o.map((v, k) => (k === i ? !v : v)))
  useFlechas((dir) => {
    setFoco((f) => limitar(f + dir, 0, TEJIDOS.length - 1))
    return true
  })
  return (
    <PantallaCompleta conBoton>
      <p className="text-sm">El corazón está hecho de cuatro tejidos. Quita uno y mira qué pasa. Con ← → eliges y con Enter o Espacio lo quitas o lo pones.</p>
      <Dos>
        <div className={CAJA}>
          <Lienzo etiqueta={todos ? 'Corazón latiendo' : 'Corazón que no funciona bien'}>
            <g style={{ transformOrigin: '200px 150px', animation: on[0] ? `cien-late ${on[2] ? '0.9s' : '1.6s'} ease-in-out infinite` : 'none' }} className="motion-reduce:!animate-none">
              <path d="M 200 236 C 96 170, 118 74, 200 118 C 282 74, 304 170, 200 236 Z" fill={on[0] ? '#e8806f' : '#d8d2c8'} stroke={on[1] ? '#8f2f29' : '#c9a7a2'} strokeWidth={on[1] ? 6 : 2} strokeDasharray={on[1] ? undefined : '6 6'} />
              {on[3] && <path d="M 200 222 C 118 168, 134 96, 200 132 C 266 96, 282 168, 200 222 Z" fill="none" stroke="#f7c9c0" strokeWidth="4" />}
              {on[2] && <path d="M 200 126 q -14 30 0 52 q 12 22 0 44" fill="none" stroke="#6b4fa3" strokeWidth="3" strokeDasharray="3 5" strokeLinecap="round" />}
            </g>
            <T x={200} y={278} s={13} b c={todos ? '#0f766e' : '#b3261e'}>{todos ? 'Bombea sangre' : 'No funciona como órgano'}</T>
          </Lienzo>
        </div>
        <Texto>
          {todos ? (
            <p>
              <span className="font-semibold">Los cuatro juntos:</span> late, tiene forma, se ajusta y deja pasar la sangre. Bombear es algo que solo logra el órgano completo.
            </p>
          ) : (
            <ul className="list-disc space-y-1 pl-5">
              {TEJIDOS.filter((_, i) => !on[i]).map((t) => (
                <li key={t.id}>
                  <span className="font-semibold">Sin tejido {t.nombre.toLowerCase()}:</span> {t.falta}
                </li>
              ))}
            </ul>
          )}
        </Texto>
      </Dos>
      <div role="group" aria-label="Tejidos del corazón" className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-4">
        {TEJIDOS.map((t, i) => (
          <button key={t.id} type="button" data-principal={i === foco ? true : undefined} aria-pressed={on[i]} onClick={() => { setFoco(i); cambiar(i) }} className={`${BOTON} py-1 text-left ${i === foco ? 'outline outline-2 outline-[var(--acento)]' : ''}`}>
            {on[i] ? '✓' : '✗'} {t.nombre}
            <span className="block text-xs font-normal text-[var(--suave)]">{t.hace}</span>
          </button>
        ))}
      </div>
    </PantallaCompleta>
  )
}

/* ── 8 · Sistema: sigue la gota de sangre ─────────────────────────────────── */

const PARADAS: { nombre: string; x: number; y: number; rica: boolean; texto: string }[] = [
  { nombre: 'Corazón (lado derecho)', x: 186, y: 150, rica: false, texto: 'Llega sangre con poco oxígeno y el corazón la empuja hacia los pulmones.' },
  { nombre: 'Pulmones', x: 200, y: 52, rica: true, texto: 'La sangre suelta dióxido de carbono y recoge oxígeno.' },
  { nombre: 'Corazón (lado izquierdo)', x: 214, y: 150, rica: true, texto: 'Vuelve al corazón, que ahora la bombea con fuerza a todo el cuerpo.' },
  { nombre: 'Arterias', x: 318, y: 200, rica: true, texto: 'Vasos gruesos que llevan la sangre con oxígeno a cada órgano.' },
  { nombre: 'Capilares', x: 200, y: 254, rica: false, texto: 'Vasos finísimos: aquí la sangre entrega oxígeno y glucosa a las células y recoge sus desechos.' },
  { nombre: 'Venas', x: 82, y: 200, rica: false, texto: 'Devuelven la sangre al corazón, y la vuelta empieza otra vez.' },
]

function MiniSistema() {
  const [i, setI] = useState(0)
  const p = PARADAS[i]
  return (
    <PantallaCompleta conBoton>
      <p className="text-sm">Ningún órgano reparte la sangre solo. Sigue una gota por todo el sistema circulatorio con el deslizador o con ← →.</p>
      <Dos>
        <div className={CAJA}>
          <Lienzo etiqueta={`La gota de sangre está en: ${p.nombre}`}>
            <path d="M 186 150 C 150 110, 160 60, 200 52" fill="none" stroke="#7a8fc0" strokeWidth="7" />
            <path d="M 200 52 C 240 60, 250 110, 214 150" fill="none" stroke="#d9534a" strokeWidth="7" />
            <path d="M 214 150 C 300 130, 330 170, 318 200 C 306 240, 250 254, 200 254" fill="none" stroke="#d9534a" strokeWidth="7" />
            <path d="M 200 254 C 150 254, 94 240, 82 200 C 70 170, 100 130, 186 150" fill="none" stroke="#7a8fc0" strokeWidth="7" />
            <ellipse cx="200" cy="48" rx="46" ry="20" fill="#f7c9c0" stroke="#8f2f29" strokeWidth="2" />
            <T x={200} y={52} s={11.5} b>Pulmones</T>
            <path d="M 200 176 C 162 152, 170 118, 200 134 C 230 118, 238 152, 200 176 Z" fill="#e8806f" stroke="#8f2f29" strokeWidth="2.5" />
            <T x={200} y={196} s={11.5} b>Corazón</T>
            <rect x="150" y="244" width="100" height="20" rx="10" fill="#f2c9a0" stroke={TINTA} strokeWidth="2" />
            <T x={200} y={284} s={11.5} b>Células del cuerpo</T>
            <T x={350} y={176} s={11}>arterias</T>
            <T x={52} y={176} s={11}>venas</T>
            <circle r="10" fill={p.rica ? '#c0261e' : '#3f5ea8'} stroke="#fff" strokeWidth="3" style={{ transform: `translate(${p.x}px, ${p.y}px)`, transition: 'transform 0.6s ease' }} className="motion-reduce:!transition-none" />
          </Lienzo>
        </div>
        <Texto>
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--acento)]">Parada {i + 1} de {PARADAS.length}</p>
          <p className="text-xl font-bold">{p.nombre}</p>
          <p className="mt-1">{p.texto}</p>
          <p className="mt-2 font-semibold" style={{ color: p.rica ? '#c0261e' : '#3f5ea8' }}>{p.rica ? 'Gota roja: lleva mucho oxígeno' : 'Gota azul: lleva poco oxígeno'}</p>
          <p className="mt-2 text-[var(--suave)]">Corazón, vasos y sangre: tres partes distintas que solo sirven juntas.</p>
        </Texto>
      </Dos>
      <label htmlFor="mini-sistema" className="sr-only">Parada de la gota de sangre</label>
      <input id="mini-sistema" type="range" min="0" max={PARADAS.length - 1} step="1" value={i} onChange={(e) => setI(Number(e.target.value))} onPointerUp={(e) => e.currentTarget.closest<HTMLElement>('[role=dialog]')?.focus()} className="mt-3 h-8 w-full accent-[var(--acento)]" />
      <p className="text-xs text-[var(--suave)]">Esquema: los colores azul y rojo son una convención; la sangre siempre es roja.</p>
    </PantallaCompleta>
  )
}

/* ── 9 · Organismo: apaga un sistema ──────────────────────────────────────── */

const SISTEMAS = [
  { id: 'respiratorio', icono: '🫁', nombre: 'Respiratorio', hace: 'Mete oxígeno y saca dióxido de carbono', falta: 'No entra oxígeno: la sangre no tiene qué repartir y las células se quedan sin energía en pocos minutos.' },
  { id: 'circulatorio', icono: '🫀', nombre: 'Circulatorio', hace: 'Reparte oxígeno y nutrientes', falta: 'El oxígeno y los nutrientes no llegan a ningún órgano, aunque los pulmones y el intestino funcionen bien.' },
  { id: 'digestivo', icono: '🍽️', nombre: 'Digestivo', hace: 'Saca nutrientes de los alimentos', falta: 'No entran nutrientes: los demás sistemas se quedan sin materiales y sin energía.' },
  { id: 'nervioso', icono: '🧠', nombre: 'Nervioso', hace: 'Coordina y responde', falta: 'Nadie coordina: ni la respiración ni el latido se ajustan a lo que el cuerpo necesita.' },
  { id: 'excretor', icono: '💧', nombre: 'Excretor', hace: 'Limpia la sangre de desechos', falta: 'Los desechos se acumulan en la sangre y afectan a todas las células.' },
]

function MiniOrganismo() {
  const [off, setOff] = useState<number | null>(null)
  useFlechas((dir) => {
    setOff((o) => (o === null ? (dir > 0 ? 0 : SISTEMAS.length - 1) : limitar(o + dir, 0, SISTEMAS.length - 1)))
    return true
  })
  return (
    <PantallaCompleta conBoton>
      <p className="text-sm">Un organismo no es una suma de sistemas sueltos. Apaga uno (tócalo o usa ← →) y mira qué les pasa a los demás.</p>
      <div role="group" aria-label="Sistemas del cuerpo" className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-5">
        {SISTEMAS.map((s, i) => {
          const apagado = off === i
          return (
            <button
              key={s.id}
              type="button"
              aria-pressed={apagado}
              onClick={() => setOff(apagado ? null : i)}
              className={`min-h-24 rounded-xl border-2 p-2 text-center text-sm font-semibold transition ${apagado ? 'border-red-700 dark:border-red-400 bg-[var(--fondo)] opacity-60 grayscale' : off !== null ? 'border-amber-600' : 'border-[var(--linea)] hover:border-[var(--acento)]'}`}
            >
              <span aria-hidden="true" className="block text-3xl">{s.icono}</span>
              {s.nombre}
              <span className="block text-xs font-normal text-[var(--suave)]">{apagado ? 'apagado' : off !== null ? 'afectado' : s.hace}</span>
            </button>
          )
        })}
      </div>
      <div aria-live="polite" className="mt-3 min-h-[5.5rem] rounded-xl bg-[var(--fondo)] p-3 text-sm">
        {off === null ? (
          <p>
            <span className="font-semibold">Todos funcionando:</span> el organismo se mantiene vivo como un todo. Cada sistema depende de los otros.
          </p>
        ) : (
          <>
            <p>
              <span className="font-semibold">Sin el sistema {SISTEMAS[off].nombre.toLowerCase()}:</span> {SISTEMAS[off].falta}
            </p>
            <p className="mt-1 text-[var(--suave)]">Falla uno y se afectan todos: por eso el organismo es un nivel aparte, no una lista de sistemas.</p>
            <button type="button" data-principal onClick={() => setOff(null)} className="mt-2 min-h-10 rounded-full border border-[var(--acento)] px-5 text-sm font-bold text-[var(--acento)]">
              Encender todos
            </button>
          </>
        )}
      </div>
    </PantallaCompleta>
  )
}

/** Una mini-actividad por nivel, en el mismo orden que NIVELES (el nivel 10 usa «Más allá»). */
export const MINIS: ({ titulo: string; C: ComponentType } | null)[] = [
  { titulo: 'De qué estás hecho', C: MiniAtomos },
  { titulo: 'Arma la molécula', C: MiniMoleculas },
  { titulo: 'El collar de piezas', C: MiniMacro },
  { titulo: '¿Quién hace qué?', C: () => <ExploradorCelula modo="une" /> },
  { titulo: '¿Cuenta como célula?', C: CuentaComoCelula },
  { titulo: 'Tirar juntas', C: MiniTejido },
  { titulo: 'Quita un tejido', C: MiniOrgano },
  { titulo: 'Sigue la gota', C: MiniSistema },
  { titulo: 'Apaga un sistema', C: MiniOrganismo },
  null,
]
