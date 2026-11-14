import { useState } from 'react'
import type { ReactNode } from 'react'
import PantallaCompleta from '../PantallaCompleta.tsx'
import VisorZoom from '../VisorZoom.tsx'
import { Lienzo, T } from '../ilustraciones/Dibujo.tsx'
import CelulaMeiosis, { ETAPAS_MEIOSIS, COLORES } from '../ilustraciones/CelulaMeiosis.tsx'
import type { EtapaMeiosis } from '../ilustraciones/CelulaMeiosis.tsx'
import { Pestanas, Nota } from './TiposCelulas.tsx'

// Subtema 4.2: diploide y haploide, por qué hace falta la meiosis, la meiosis paso a paso,
// la variedad de los gametos y la comparación con la mitosis. Esquemas sin escala; texto en borrador.

const CAJA = 'aspect-[4/3] max-h-[var(--alto-visor,38dvh)] w-full overflow-hidden rounded-xl border border-[var(--linea)]'
const Dos = ({ children }: { children: ReactNode }) => <div className="grid gap-3 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">{children}</div>
const Texto = ({ children }: { children: ReactNode }) => (
  <div aria-live="polite" className="rounded-xl bg-[var(--fondo)] p-3 text-sm">
    {children}
  </div>
)
function Deslizador({ id, etiqueta, valor, max, onCambio, rotulo }: { id: string; etiqueta: string; valor: number; max: number; onCambio: (n: number) => void; rotulo: string }) {
  return (
    <>
      <label htmlFor={id} className="mt-3 flex items-center justify-between text-sm font-semibold">
        <span>{etiqueta}</span>
        <span className="font-normal text-[var(--suave)]">{rotulo}</span>
      </label>
      <input id={id} type="range" min="0" max={max} step="1" value={valor} onChange={(e) => onCambio(Number(e.target.value))} onPointerUp={(e) => e.currentTarget.closest<HTMLElement>('[role=dialog]')?.focus()} className="mt-1 h-8 w-full accent-[var(--acento)]" />
    </>
  )
}
function Interruptor({ activo, onCambio, children }: { activo: boolean; onCambio: (v: boolean) => void; children: ReactNode }) {
  return (
    <button type="button" aria-pressed={activo} onClick={() => onCambio(!activo)} className="min-h-10 rounded-full border border-[var(--acento)] px-3 text-sm font-semibold text-[var(--acento)] aria-pressed:bg-[var(--acento)] aria-pressed:text-[var(--sobre-acento)]">
      {children}
    </button>
  )
}
function Leyenda() {
  return (
    <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--suave)]">
      <span><span className="inline-block h-2 w-4 rounded" style={{ background: COLORES[0][0] }} /> <span className="inline-block h-2 w-4 rounded" style={{ background: COLORES[1][0] }} /> de la madre</span>
      <span><span className="inline-block h-2 w-4 rounded" style={{ background: COLORES[0][1] }} /> <span className="inline-block h-2 w-4 rounded" style={{ background: COLORES[1][1] }} /> del padre</span>
      <span>Se dibujan 2 pares por claridad; las personas tenemos 23.</span>
    </p>
  )
}

/* ── Diploide y haploide ───────────────────────────────────────────────────── */

const PASOS_PARES = [
  { titulo: 'Célula del cuerpo', texto: 'Una célula de la piel o del músculo tiene sus cromosomas sueltos en el núcleo. Aquí hay cuatro: dos largos y dos cortos.' },
  { titulo: 'Ordenados en pares', texto: 'Si los ordenamos, forman pares: cada par tiene un cromosoma de la madre y uno del padre, del mismo tamaño y con los mismos genes. Son cromosomas homólogos. Una célula con pares es diploide (2n).' },
  { titulo: 'Un gameto', texto: 'Un óvulo o un espermatozoide lleva solo uno de cada par: es haploide (n). En las personas, 2n = 46 y n = 23.' },
]

function Cromo({ x, y, largo, color, giro = 0 }: { x: number; y: number; largo: number; color: string; giro?: number }) {
  return <line x1={x} y1={y - largo / 2} x2={x} y2={y + largo / 2} stroke={color} strokeWidth="9" strokeLinecap="round" transform={`rotate(${giro} ${x} ${y})`} style={{ transition: 'all 0.5s ease' }} />
}

export function ParesHomologos() {
  const [i, setI] = useState(0)
  const e = PASOS_PARES[i]
  // posiciones de los cuatro cromosomas: [par, homólogo]
  const pos: Record<number, [number, number, number][]> = {
    0: [[170, 125, 35], [232, 170, -20], [215, 118, 70], [178, 182, 100]],
    1: [[150, 150, 0], [178, 150, 0], [230, 160, 0], [258, 160, 0]],
    2: [[200, 150, 0], [-100, 150, 0], [240, 160, 0], [-100, 160, 0]],
  }
  const largo = [70, 42]
  return (
    <PantallaCompleta conBoton>
      <Dos>
        <div className={CAJA}>
          <Lienzo etiqueta={e.titulo}>
            <circle cx="200" cy="150" r={i === 2 ? 80 : 110} fill="#f8d9d4" stroke="#b05a5a" strokeWidth="4" style={{ transition: 'r 0.5s ease' }} />
            <circle cx="200" cy="150" r={i === 2 ? 52 : 74} fill="#ead3f2" stroke="#7a4a8a" strokeWidth="3" style={{ transition: 'r 0.5s ease' }} />
            {pos[i].map(([x, y, g], k) => {
              const p = k < 2 ? 0 : 1
              const h = k % 2
              return x > 0 ? <Cromo key={k} x={x} y={y} largo={largo[p]} color={COLORES[p][h]} giro={g} /> : null
            })}
            {i === 1 && (
              <>
                <T x={164} y={210} s={11}>par 1</T>
                <T x={244} y={210} s={11}>par 2</T>
              </>
            )}
            <T x={200} y={290} s={14} b>{i === 2 ? 'n (haploide)' : '2n (diploide)'}</T>
          </Lienzo>
        </div>
        <Texto>
          <p className="text-lg font-bold">{e.titulo}</p>
          <p className="mt-1">{e.texto}</p>
        </Texto>
      </Dos>
      <Deslizador id="pares-paso" etiqueta="Avanza" valor={i} max={2} onCambio={setI} rotulo={`${i + 1} de 3`} />
      <Leyenda />
    </PantallaCompleta>
  )
}

/* ── ¿Por qué hace falta la meiosis? ───────────────────────────────────────── */

export function CuentaCromosomas() {
  const [g, setG] = useState(0)
  const [meiosis, setMeiosis] = useState(false)
  const gameto = meiosis ? 23 : 46 * 2 ** g
  const hijo = meiosis ? 46 : 46 * 2 ** (g + 1)
  const fmt = (n: number) => n.toLocaleString('es-CO')
  return (
    <PantallaCompleta conBoton>
      <div className="mb-3 flex flex-wrap gap-2">
        <Interruptor activo={!meiosis} onCambio={(v) => setMeiosis(!v)}>Gametos hechos por mitosis</Interruptor>
        <Interruptor activo={meiosis} onCambio={setMeiosis}>Gametos hechos por meiosis</Interruptor>
      </div>
      <Dos>
        <div className={CAJA}>
          <Lienzo etiqueta={`Generación ${g + 1}: el hijo tendría ${hijo} cromosomas`}>
            <circle cx="90" cy="110" r="44" fill="#f6d6c9" stroke="#b05a5a" strokeWidth="3" />
            <T x={90} y={106} s={11}>óvulo</T>
            <T x={90} y={124} s={16} b>{fmt(gameto)}</T>
            <ellipse cx="310" cy="110" rx="26" ry="20" fill="#d6e4f6" stroke="#3b6fb6" strokeWidth="3" />
            <path d="M 336 110 q 15 -12 30 0 t 26 0" fill="none" stroke="#3b6fb6" strokeWidth="3" />
            <T x={300} y={150} s={11}>espermatozoide</T>
            <T x={310} y={116} s={14} b>{fmt(gameto)}</T>
            <T x={200} y={116} s={30} b>+</T>
            <path d="M 200 150 V 190" stroke="#4a3416" strokeWidth="3" markerEnd="url(#punta-m)" />
            <defs>
              <marker id="punta-m" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                <path d="M0 0 L8 4 L0 8 Z" fill="#4a3416" />
              </marker>
            </defs>
            <circle cx="200" cy="240" r="46" fill={meiosis ? '#cfe8c4' : g >= 2 ? '#f3b3a8' : '#f6d6c9'} stroke="#7a4a8a" strokeWidth="3" style={{ transition: 'fill 0.4s ease' }} />
            <T x={200} y={234} s={11}>hijo</T>
            <T x={200} y={254} s={16} b>{fmt(hijo)}</T>
          </Lienzo>
        </div>
        <Texto>
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--acento)]">Generación {g + 1}</p>
          {meiosis ? (
            <p className="mt-1">Con meiosis, cada gameto lleva la mitad: 23. Al unirse, el hijo vuelve a tener 46, igual que sus padres. Generación tras generación, la cantidad se mantiene.</p>
          ) : (
            <p className="mt-1">
              Si los gametos se hicieran por mitosis, llevarían todos los cromosomas del padre o la madre. El hijo tendría el doble: <strong>{fmt(hijo)}</strong>. {g >= 2 ? 'Ninguna célula podría funcionar con tantos cromosomas.' : 'Mueve el deslizador para ver qué pasa en las siguientes generaciones.'}
            </p>
          )}
        </Texto>
      </Dos>
      <Deslizador id="cuenta-gen" etiqueta="Generaciones" valor={g} max={5} onCambio={setG} rotulo={`${g + 1} de 6`} />
      <Nota>Un experimento mental: en la realidad los gametos siempre se forman por meiosis.</Nota>
    </PantallaCompleta>
  )
}

/* ── La meiosis paso a paso ────────────────────────────────────────────────── */

const TEXTOS_MEIOSIS = [
  'Antes de empezar, la célula copia su ADN, igual que antes de una mitosis. Cada cromosoma queda duplicado, aunque todavía no se ve.',
  'Los cromosomas se compactan y, a diferencia de la mitosis, cada uno busca a su homólogo y se aparean. Aquí puede ocurrir el entrecruzamiento: los homólogos intercambian trozos.',
  'Los pares se alinean en el centro: un homólogo a cada lado. Hacia qué lado queda el de la madre o el del padre es cuestión de azar en cada par.',
  'Se separan los homólogos (cada uno todavía en X, con sus dos cromátidas) y viajan a extremos opuestos.',
  'Quedan dos células, cada una con un cromosoma de cada par: ya son haploides, aunque cada cromosoma sigue duplicado.',
  'Empieza la meiosis II, sin copiar el ADN otra vez. En cada célula los cromosomas se alinean en el centro, como en una mitosis.',
  'Ahora sí se separan las cromátidas hermanas y viajan a extremos opuestos.',
  'Resultado: cuatro células haploides, cada una con un cromosoma de cada par y distintas entre sí. En los animales serán los gametos.',
]

export function MeiosisPasos({ inicial = 0 }: { inicial?: EtapaMeiosis }) {
  const [e, setE] = useState<EtapaMeiosis>(inicial)
  const [cruce, setCruce] = useState(false)
  return (
    <PantallaCompleta>
      <div className="mb-3 flex flex-wrap gap-2">
        <Interruptor activo={cruce} onCambio={setCruce}>Con entrecruzamiento</Interruptor>
      </div>
      <VisorZoom etiqueta="Meiosis paso a paso" alto="aspect-[4/3]">
        <CelulaMeiosis etapa={e} cruce={cruce} />
      </VisorZoom>
      <Deslizador id="meiosis-etapa" etiqueta={`Paso ${e + 1} de 8 · ${e <= 4 ? 'Meiosis I' : 'Meiosis II'}`} valor={e} max={7} onCambio={(n) => setE(n as EtapaMeiosis)} rotulo={ETAPAS_MEIOSIS[e]} />
      <div aria-live="polite" className="mt-2 min-h-[4.5rem] rounded-xl bg-[var(--fondo)] p-3 text-sm">
        <p className="font-semibold">{ETAPAS_MEIOSIS[e]}</p>
        <p>{TEXTOS_MEIOSIS[e]}</p>
      </div>
      <Leyenda />
    </PantallaCompleta>
  )
}

/* ── ¿Por qué los hermanos no son iguales? ─────────────────────────────────── */

export function VariedadGametos() {
  const [voltea, setVoltea] = useState<[boolean, boolean]>([false, false])
  const [cruce, setCruce] = useState(false)
  const [vistas, setVistas] = useState<Set<string>>(() => new Set(['00']))
  const cambiar = (p: 0 | 1) => {
    const v: [boolean, boolean] = [...voltea]
    v[p] = !v[p]
    setVoltea(v)
    setVistas((s) => new Set(s).add(`${+v[0]}${+v[1]}`))
  }
  return (
    <PantallaCompleta conBoton>
      <div className="mb-3 flex flex-wrap gap-2">
        <button type="button" onClick={() => cambiar(0)} className="min-h-10 rounded-full bg-[var(--acento)] px-4 text-sm font-bold text-[var(--sobre-acento)]">↔ Voltear par largo</button>
        <button type="button" onClick={() => cambiar(1)} className="min-h-10 rounded-full bg-[var(--acento)] px-4 text-sm font-bold text-[var(--sobre-acento)]">↔ Voltear par corto</button>
        <Interruptor activo={cruce} onCambio={setCruce}>Con entrecruzamiento</Interruptor>
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        <div>
          <p className="mb-1 text-sm font-semibold">Metafase I: cómo se alinean los pares</p>
          <div className={CAJA}>
            <CelulaMeiosis etapa={2} cruce={cruce} voltea={voltea} />
          </div>
        </div>
        <div>
          <p className="mb-1 text-sm font-semibold">Los cuatro gametos que resultan</p>
          <div className={CAJA}>
            <CelulaMeiosis etapa={7} cruce={cruce} voltea={voltea} />
          </div>
        </div>
      </div>
      <Texto>
        <p className="mt-1">
          Combinaciones de pares que has visto: <strong>{vistas.size} de 4</strong>. Con 2 pares hay 2 × 2 = 4 maneras de alinearlos. Una persona tiene 23 pares: 2<sup>23</sup>, más de 8 millones de combinaciones, {cruce ? 'y el entrecruzamiento multiplica todavía más la variedad: ahora ningún gameto es igual a otro.' : 'sin contar el entrecruzamiento. Actívalo y mira los gametos.'}
        </p>
      </Texto>
      <Leyenda />
    </PantallaCompleta>
  )
}

/* ── Mitosis y meiosis lado a lado ─────────────────────────────────────────── */

const FILAS: [string, string, string][] = [
  ['¿Para qué sirve?', 'Crecer, reparar y reemplazar células', 'Formar gametos (o esporas en plantas y hongos)'],
  ['¿Dónde ocurre?', 'En casi todas las células del cuerpo', 'Solo en células especiales de ovarios y testículos (en plantas, en la flor)'],
  ['¿Cuántas divisiones?', 'Una', 'Dos seguidas (meiosis I y II)'],
  ['¿Cuántas células resultan?', 'Dos', 'Cuatro'],
  ['¿Cuántos cromosomas tienen?', 'Los mismos que la madre (2n → 2n)', 'La mitad (2n → n)'],
  ['¿Son iguales a la célula madre?', 'Sí, son copias', 'No: cada una es una mezcla distinta'],
  ['¿Se aparean los homólogos?', 'No', 'Sí, en la profase I (y pueden entrecruzarse)'],
]

export function ComparaMitosisMeiosis() {
  const [modo, setModo] = useState<'tabla' | 'dibujo'>('tabla')
  const [e, setE] = useState(0)
  return (
    <PantallaCompleta conBoton>
      <Pestanas valor={modo} opciones={[['tabla', 'Lado a lado'], ['dibujo', 'Resultado final']]} onCambio={setModo} etiqueta="Comparación" />
      {modo === 'tabla' ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b-2 border-[var(--linea)]">
                <th className="p-2" />
                <th className="p-2 text-base">Mitosis</th>
                <th className="p-2 text-base">Meiosis</th>
              </tr>
            </thead>
            <tbody>
              {FILAS.map(([q, a, b], k) => (
                <tr key={q} onClick={() => setE(k)} className={`cursor-pointer border-b border-[var(--linea)] ${k === e ? 'bg-[var(--acento-suave)]/40' : ''}`}>
                  <th className="p-2 font-semibold">{q}</th>
                  <td className="p-2">{a}</td>
                  <td className="p-2">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          <div>
            <p className="mb-1 text-sm font-semibold">Mitosis: 2 células iguales (2n)</p>
            <div className={CAJA}>
              <MitosisFinal />
            </div>
          </div>
          <div>
            <p className="mb-1 text-sm font-semibold">Meiosis: 4 células distintas (n)</p>
            <div className={CAJA}>
              <CelulaMeiosis etapa={7} cruce />
            </div>
          </div>
        </div>
      )}
      <Leyenda />
    </PantallaCompleta>
  )
}

/** Resultado de una mitosis con los mismos colores: dos células con los cuatro cromosomas. */
function MitosisFinal() {
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label="Dos células hijas iguales, cada una con los cuatro cromosomas" className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#f3e7ef" />
      {[105, 295].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="150" r="86" fill="#f8d9d4" stroke="#b05a5a" strokeWidth="4" />
          <circle cx={cx} cy="150" r="48" fill="#ead3f2" stroke="#7a4a8a" strokeWidth="2" />
          {[
            [-24, 0, 0, 36],
            [-8, 0, 1, 36],
            [8, 1, 0, 22],
            [24, 1, 1, 22],
          ].map(([dx, p, h, l]) => (
            <line key={dx} x1={cx + dx} y1={150 - l / 2} x2={cx + dx} y2={150 + l / 2} stroke={COLORES[p][h]} strokeWidth="6" strokeLinecap="round" />
          ))}
        </g>
      ))}
    </svg>
  )
}
