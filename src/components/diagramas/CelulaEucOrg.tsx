import { useState } from 'react'
import type { ReactNode } from 'react'
import PantallaCompleta from '../PantallaCompleta.tsx'
import { Lienzo, T, TINTA } from '../ilustraciones/Dibujo.tsx'
import { Nucleo, Lisosoma, Mito, Cloroplasto } from '../ilustraciones/CelulaEuc.tsx'
import { Pestanas, Nota } from './TiposCelulas.tsx'

// Tema 3: diagramas propios del núcleo, los cloroplastos y los lisosomas (antes compartían).
// Esquemas sin escala; texto en borrador.

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

/* ── Núcleo: la receta sale del núcleo ─────────────────────────────────────── */

const PASOS_NUCLEO = [
  { titulo: 'El ADN guardado', texto: 'Dentro del núcleo está el ADN, el recetario de la célula. Nunca sale de ahí: la envoltura nuclear, una doble membrana, lo protege.' },
  { titulo: 'Se copia una receta', texto: 'Cuando la célula necesita una proteína, copia solo esa receta en una molécula más pequeña: el ARN mensajero.' },
  { titulo: 'Sale por un poro', texto: 'La envoltura tiene poros. Por ellos sale la copia hacia el citoplasma; el ADN original se queda guardado.' },
  { titulo: 'Llega al ribosoma', texto: 'Un ribosoma lee la copia y arma la proteína. Así el núcleo controla lo que hace la célula sin salir nunca de su sitio.' },
]

export function NucleoDiagrama() {
  const [paso, setPaso] = useState(0)
  // posición de la copia de ARN en cada paso
  const arn = [null, { x: 172, y: 150 }, { x: 218, y: 93 }, { x: 318, y: 82 }][paso]
  const p = PASOS_NUCLEO[paso]
  return (
    <PantallaCompleta conBoton>
      <Dos>
        <div className={CAJA}>
          <Lienzo etiqueta={`${p.titulo}. ${p.texto}`}>
            <g transform="translate(150 150)">
              <Nucleo k={2.4} />
            </g>
            {paso >= 1 && <path d="M 120 166 q 10 -14 20 0 t 20 0 t 20 0" fill="none" stroke="#e0a030" strokeWidth="5" strokeLinecap="round" opacity="0.5" />}
            <circle cx="218" cy="93" r="10" fill="none" stroke={paso === 2 ? '#e0a030' : 'transparent'} strokeWidth="3" />
            {/* ribosoma */}
            <circle cx="330" cy="76" r="13" fill="#8a5a2b" />
            <circle cx="340" cy="66" r="9" fill="#b07a45" />
            <T x={334} y={110} s={11}>ribosoma</T>
            {paso === 3 && <path d="M 344 82 q 16 12 8 28 q -6 12 10 20" fill="none" stroke="#d97f4a" strokeWidth="4" strokeLinecap="round" />}
            {arn && (
              <path d="M -16 0 q 4 -6 8 0 t 8 0 t 8 0 t 8 0" fill="none" stroke="#e0a030" strokeWidth="4" strokeLinecap="round" style={{ transform: `translate(${arn.x}px, ${arn.y}px)`, transition: 'transform 0.8s ease' }} className="motion-reduce:!transition-none" />
            )}
            <T x={150} y={266} s={12} b>Núcleo</T>
            <T x={150} y={286} s={10.5}>{paso >= 1 ? 'ADN (morado) y copia (naranja)' : 'ADN'}</T>
          </Lienzo>
        </div>
        <Texto>
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--acento)]">Paso {paso + 1} de {PASOS_NUCLEO.length}</p>
          <p className="text-lg font-bold">{p.titulo}</p>
          <p className="mt-1">{p.texto}</p>
          {paso === 3 && <p className="mt-2 text-[var(--suave)]">Un glóbulo rojo maduro pierde su núcleo: ya no puede hacer proteínas nuevas ni dividirse, y vive unos 120 días.</p>}
        </Texto>
      </Dos>
      <Deslizador id="nucleo-paso" etiqueta="Sigue la receta" valor={paso} max={PASOS_NUCLEO.length - 1} onCambio={setPaso} rotulo={p.titulo} />
      <Nota>Esquema: el ADN real es un hilo larguísimo enrollado; aquí se dibuja como unas pocas líneas.</Nota>
    </PantallaCompleta>
  )
}

/* ── Cloroplastos: ¿qué necesita la fotosíntesis? ──────────────────────────── */

const INSUMOS = [
  { id: 'luz', nombre: 'Luz', icono: '☀️', falta: 'Sin luz no hay energía para la fotosíntesis: de noche el cloroplasto descansa.' },
  { id: 'agua', nombre: 'Agua', icono: '💧', falta: 'Sin agua no hay de dónde sacar el oxígeno ni los hidrógenos: la planta cierra sus poros y para.' },
  { id: 'co2', nombre: 'Dióxido de carbono', icono: '🌬️', falta: 'Sin CO₂ no hay carbono para armar la glucosa.' },
] as const

export function CloroplastoDiagrama() {
  const [on, setOn] = useState<boolean[]>([true, true, false])
  const todo = on.every(Boolean)
  return (
    <PantallaCompleta conBoton>
      <p className="text-sm">Enciende lo que necesita el cloroplasto para fabricar glucosa. Si falta uno, no hay fotosíntesis.</p>
      <Dos>
        <div className={CAJA}>
          <Lienzo etiqueta={todo ? 'El cloroplasto fabrica glucosa y suelta oxígeno' : 'El cloroplasto está detenido'}>
            {on[0] && (
              <>
                <circle cx="52" cy="48" r="22" fill="#ffd257" stroke="#b3861f" strokeWidth="2" />
                {[[90, 70], [100, 104], [86, 136]].map(([x, y]) => <path key={y} d={`M 76 ${y - 20} L ${x + 50} ${y + 10}`} stroke="#e8b830" strokeWidth="3" strokeDasharray="6 5" />)}
              </>
            )}
            <g transform="translate(200 150)" opacity={todo ? 1 : 0.55}>
              <Cloroplasto k={3.2} />
            </g>
            {on[1] && <T x={60} y={250} s={13} b c="#2f5f9a">H₂O →</T>}
            {on[2] && <T x={60} y={200} s={13} b c="#555">CO₂ →</T>}
            {todo ? (
              <>
                <T x={336} y={120} s={13} b c="#b3861f">→ glucosa</T>
                <T x={336} y={190} s={13} b c="#2f7fbf">→ O₂</T>
              </>
            ) : (
              <T x={200} y={270} s={12.5} b c="#b3261e">detenido</T>
            )}
          </Lienzo>
        </div>
        <Texto>
          {todo ? (
            <>
              <p className="text-base font-bold">¡Fotosíntesis!</p>
              <p className="mt-1">luz + agua + CO₂ → glucosa + oxígeno</p>
              <p className="mt-2">La glucosa alimenta a la planta (y a quien se la coma). El oxígeno sale por los poros de la hoja: es el que respiras.</p>
              <p className="mt-2 text-[var(--suave)]">Después, las mitocondrias de la misma planta sacan la energía de esa glucosa.</p>
            </>
          ) : (
            <ul className="list-disc space-y-1 pl-5">
              {INSUMOS.filter((_, i) => !on[i]).map((x) => (
                <li key={x.id}>
                  <span className="font-semibold">Falta {x.nombre.toLowerCase()}:</span> {x.falta}
                </li>
              ))}
            </ul>
          )}
        </Texto>
      </Dos>
      <div role="group" aria-label="Lo que necesita la fotosíntesis" className="mt-3 grid grid-cols-3 gap-2">
        {INSUMOS.map((x, i) => (
          <button key={x.id} type="button" aria-pressed={on[i]} onClick={() => setOn((o) => o.map((v, k) => (k === i ? !v : v)))} className="min-h-12 rounded-lg border-2 border-[var(--linea)] px-2 text-sm font-semibold aria-pressed:border-[var(--acento)] aria-pressed:bg-[var(--acento-suave)]/40">
            {x.icono} {x.nombre}
          </button>
        ))}
      </div>
      <Nota>Esquema sin escala. Dentro del cloroplasto, las pilas verdes (tilacoides) captan la luz.</Nota>
    </PantallaCompleta>
  )
}

/* ── Lisosomas: digerir y reciclar ─────────────────────────────────────────── */

type Caso = 'bacteria' | 'mito'
const PASOS_LISO: Record<Caso, { titulo: string; texto: string }[]> = {
  bacteria: [
    { titulo: 'Llega una bacteria', texto: 'Un glóbulo blanco encuentra una bacteria fuera de él.' },
    { titulo: 'La envuelve', texto: 'La membrana la rodea y la mete en una vesícula (fagocitosis).' },
    { titulo: 'Se une el lisosoma', texto: 'Un lisosoma se fusiona con la vesícula y le vacía sus enzimas en un medio ácido.' },
    { titulo: 'Digerida y reciclada', texto: 'La bacteria queda en piezas pequeñas, que la célula reutiliza o expulsa.' },
  ],
  mito: [
    { titulo: 'Una mitocondria vieja', texto: 'Los orgánulos también se gastan. Esta mitocondria ya no funciona bien.' },
    { titulo: 'La célula la encierra', texto: 'Una membrana la envuelve: la célula se prepara para «comerse» a sí misma (autofagia).' },
    { titulo: 'Se une el lisosoma', texto: 'El lisosoma se fusiona y sus enzimas desarman la mitocondria vieja.' },
    { titulo: 'Piezas para construir', texto: 'Sus piezas vuelven al citoplasma y sirven para fabricar orgánulos nuevos.' },
  ],
}

export function LisosomaDiagrama() {
  const [caso, setCaso] = useState<Caso>('bacteria')
  const [paso, setPaso] = useState(0)
  const p = PASOS_LISO[caso][paso]
  const cx = paso === 0 && caso === 'bacteria' ? 86 : 214
  return (
    <PantallaCompleta conBoton>
      <Pestanas valor={caso} opciones={[['bacteria', 'Digerir una bacteria'], ['mito', 'Reciclar un orgánulo']]} onCambio={(v) => { setCaso(v); setPaso(0) }} etiqueta="Qué digiere el lisosoma" />
      <Dos>
        <div className={CAJA}>
          <Lienzo etiqueta={`${p.titulo}. ${p.texto}`}>
            <path d="M 150 150 Q 150 60 250 54 Q 360 60 362 150 Q 360 246 250 250 Q 150 246 150 150 Z" fill="#f8d9d4" stroke="#b05a5a" strokeWidth="5" />
            {caso === 'bacteria' && paso === 0 && <path d="M 150 120 q -18 30 0 60" fill="none" stroke="#b05a5a" strokeWidth="5" />}
            {paso >= 1 && <circle cx={214} cy={150} r="34" fill={paso >= 2 ? '#f5d6e2' : '#fbeee9'} stroke={paso >= 2 ? '#b05a7a' : '#b05a5a'} strokeWidth="3" />}
            {paso < 3 &&
              (caso === 'bacteria' ? (
                <g style={{ transform: `translate(${cx}px, 150px)`, transition: 'transform 0.7s ease' }} className="motion-reduce:!transition-none">
                  <rect x="-20" y="-10" width="40" height="20" rx="10" fill="#9ccf86" stroke="#3f6b3a" strokeWidth="2" />
                </g>
              ) : (
                <g transform="translate(214 150)" opacity={paso === 2 ? 0.55 : 1}>
                  <Mito k={0.9} />
                </g>
              ))}
            {paso === 3 && [[-14, -8], [10, -12], [-6, 10], [14, 8], [0, -2]].map(([x, y]) => <circle key={`${x}${y}`} cx={214 + x} cy={150 + y} r="4" fill="#9a7a6a" />)}
            {paso < 2 ? (
              <g transform="translate(300 110)">
                <Lisosoma k={1.6} />
              </g>
            ) : null}
            <T x={300} y={86} s={11}>{paso < 2 ? 'lisosoma' : ''}</T>
            {paso === 3 && <T x={214} y={210} s={11.5} b>piezas para reutilizar</T>}
            <T x={70} y={276} s={11} c={TINTA}>{caso === 'bacteria' ? 'glóbulo blanco' : 'una célula cualquiera'}</T>
          </Lienzo>
        </div>
        <Texto>
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--acento)]">Paso {paso + 1} de 4</p>
          <p className="text-lg font-bold">{p.titulo}</p>
          <p className="mt-1">{p.texto}</p>
          {paso === 3 && <p className="mt-2 text-[var(--suave)]">Las enzimas del lisosoma solo funcionan en medio ácido. Si una se escapa al citoplasma, que no es ácido, casi no hace daño.</p>}
        </Texto>
      </Dos>
      <Deslizador id="liso-paso" etiqueta="Avanza el proceso" valor={paso} max={3} onCambio={setPaso} rotulo={p.titulo} />
      <Nota>Esquema sin escala.</Nota>
    </PantallaCompleta>
  )
}
