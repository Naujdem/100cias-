import { useState } from 'react'
import type { ReactNode } from 'react'
import PantallaCompleta from '../PantallaCompleta.tsx'
import { Lienzo, T } from '../ilustraciones/Dibujo.tsx'
import { Pestanas, Nota } from './TiposCelulas.tsx'
import { useFlechas } from '../../lib/flechasDiagrama.ts'

// Subtema 4.1: diagramas del ciclo celular, los cromosomas, la citocinesis y el control del ciclo.
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
const polar = (cx: number, cy: number, r: number, f: number) => [cx + r * Math.sin(f * 2 * Math.PI), cy - r * Math.cos(f * 2 * Math.PI)]
function arco(cx: number, cy: number, r: number, a: number, b: number) {
  const [x1, y1] = polar(cx, cy, r, a)
  const [x2, y2] = polar(cx, cy, r, b)
  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${b - a > 0.5 ? 1 : 0} 1 ${x2} ${y2} Z`
}

/* ── El ciclo como un reloj ────────────────────────────────────────────────── */

const ETAPAS = [
  { id: 'G1', nombre: 'G1: crece', de: 0, a: 0.4, color: '#9ccf86', adn: 1, texto: 'La célula recién nacida crece, fabrica proteínas y orgánulos, y hace su trabajo normal.' },
  { id: 'S', nombre: 'S: copia el ADN', de: 0.4, a: 0.75, color: '#7fb2e5', adn: 2, texto: 'Copia todo su ADN. Al terminar, tiene el doble: una copia para cada célula hija.' },
  { id: 'G2', nombre: 'G2: se prepara', de: 0.75, a: 0.9, color: '#e0b040', adn: 2, texto: 'Revisa que la copia esté bien y prepara lo necesario para dividirse.' },
  { id: 'M', nombre: 'M: se divide', de: 0.9, a: 1, color: '#e8806f', adn: 1, texto: 'Mitosis y citocinesis: reparte el ADN y el citoplasma. Al final hay dos células, cada una con la cantidad original de ADN.' },
]

export function CicloReloj() {
  const [i, setI] = useState(0)
  const e = ETAPAS[i]
  const [hx, hy] = polar(150, 150, 60, (e.de + e.a) / 2)
  return (
    <PantallaCompleta conBoton>
      <Dos>
        <div className={CAJA}>
          <Lienzo etiqueta={`Ciclo celular: ${e.nombre}`}>
            {ETAPAS.map((x, k) => (
              <path key={x.id} d={arco(150, 150, 120, x.de, x.a)} fill={x.color} stroke="#fff" strokeWidth="3" opacity={k === i ? 1 : 0.35} onClick={() => setI(k)} style={{ cursor: 'pointer' }} />
            ))}
            {ETAPAS.map((x) => {
              const [tx, ty] = polar(150, 150, 82, (x.de + x.a) / 2)
              return <T key={x.id} x={tx} y={ty + 5} s={15} b>{x.id}</T>
            })}
            <circle cx="150" cy="150" r="30" fill="#fbf5ee" stroke="#cbbfae" strokeWidth="2" />
            <line x1="150" y1="150" x2={hx} y2={hy} stroke="#2b1d08" strokeWidth="4" strokeLinecap="round" style={{ transition: 'all 0.5s ease' }} />
            <T x={150} y={290} s={11.5}>Interfase: G1 + S + G2</T>
            <T x={330} y={70} s={12.5} b>ADN en la célula</T>
            {[0, 1].map((k) => (
              <rect key={k} x={300 + k * 34} y={90} width="28" height="120" rx="6" fill={k < e.adn ? '#7a4a8a' : '#eee6f4'} stroke="#7a4a8a" strokeWidth="2" style={{ transition: 'fill 0.4s ease' }} />
            ))}
            <T x={330} y={232} s={12}>{e.adn === 2 ? 'doble' : 'normal'}</T>
          </Lienzo>
        </div>
        <Texto>
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--acento)]">{i < 3 ? 'Interfase' : 'Fase de división'}</p>
          <p className="text-lg font-bold">{e.nombre}</p>
          <p className="mt-1">{e.texto}</p>
          <p className="mt-2 text-[var(--suave)]">El tamaño de cada parte del reloj muestra cuánto tiempo dura, más o menos. La división es la parte más corta.</p>
        </Texto>
      </Dos>
      <Deslizador id="ciclo-etapa" etiqueta="Avanza por el ciclo" valor={i} max={ETAPAS.length - 1} onCambio={setI} rotulo={e.nombre} />
      <Nota>Las proporciones son aproximadas y cambian mucho de una célula a otra.</Nota>
    </PantallaCompleta>
  )
}

/* ── Del hilo de ADN al cromosoma ──────────────────────────────────────────── */

const ENROLLE = [
  { titulo: 'Un hilo larguísimo', texto: 'El ADN de una célula humana estirado mediría unos 2 metros. Así, suelto, no se podría repartir sin enredarse.' },
  { titulo: 'Enrollado en proteínas', texto: 'Se enrolla alrededor de proteínas, como hilo en carretes. Esta es la cromatina, la forma del ADN durante la interfase.' },
  { titulo: 'Copiado', texto: 'En la fase S se copia. Ahora hay dos hilos idénticos, todavía sueltos.' },
  { titulo: 'Cromosoma duplicado', texto: 'Antes de dividirse, cada hilo se compacta muchísimo. Las dos copias quedan unidas por el centrómero: son las cromátidas hermanas, la forma de X.' },
]

export function CromosomaCompacta() {
  const [i, setI] = useState(0)
  const e = ENROLLE[i]
  const hilo = (y: number, c: string) => <path d={`M 30 ${y} q 20 -30 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0`} fill="none" stroke={c} strokeWidth="3" />
  const carretes = (y: number, c: string) =>
    Array.from({ length: 7 }, (_, k) => (
      <g key={k}>
        <circle cx={60 + k * 46} cy={y} r="11" fill="#f2c77a" stroke="#b3861f" strokeWidth="1.5" />
        <circle cx={60 + k * 46} cy={y} r="14" fill="none" stroke={c} strokeWidth="3" />
        {k < 6 && <path d={`M ${74 + k * 46} ${y} q 9 -10 18 0`} fill="none" stroke={c} strokeWidth="3" />}
      </g>
    ))
  return (
    <PantallaCompleta conBoton>
      <Dos>
        <div className={CAJA}>
          <Lienzo etiqueta={e.titulo}>
            {i === 0 && hilo(150, '#7a4a8a')}
            {i === 1 && carretes(150, '#7a4a8a')}
            {i === 2 && (
              <>
                {carretes(120, '#7a4a8a')}
                {carretes(190, '#a37bbd')}
              </>
            )}
            {i === 3 && (
              <g transform="translate(200 150)">
                <path d="M -6 -6 Q -40 -60 -46 -100 Q -30 -104 -18 -64 Q -10 -30 -6 -6 Z M -6 6 Q -40 60 -46 100 Q -30 104 -18 64 Q -10 30 -6 6 Z" fill="#7a4a8a" />
                <path d="M 6 -6 Q 40 -60 46 -100 Q 30 -104 18 -64 Q 10 -30 6 -6 Z M 6 6 Q 40 60 46 100 Q 30 104 18 64 Q 10 30 6 6 Z" fill="#a37bbd" />
                <circle r="10" fill="#e0b040" stroke="#7a4a10" strokeWidth="2" />
                <T x={80} y={4} s={12} a="start">centrómero</T>
                <path d="M 76 0 H 14" stroke="#2b1d08" strokeWidth="1.5" />
                <T x={-90} y={-70} s={11.5}>cromátida</T>
                <T x={90} y={-70} s={11.5}>cromátida</T>
              </g>
            )}
          </Lienzo>
        </div>
        <Texto>
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--acento)]">Paso {i + 1} de {ENROLLE.length}</p>
          <p className="text-lg font-bold">{e.titulo}</p>
          <p className="mt-1">{e.texto}</p>
        </Texto>
      </Dos>
      <Deslizador id="cromosoma-paso" etiqueta="Compacta el ADN" valor={i} max={ENROLLE.length - 1} onCambio={setI} rotulo={e.titulo} />
      <Nota>Esquema: un cromosoma real tiene millones de vueltas, no unas pocas.</Nota>
    </PantallaCompleta>
  )
}

/* ── Citocinesis animal y vegetal ──────────────────────────────────────────── */

const CITO = {
  animal: ['Mitosis terminada: dos núcleos en una célula.', 'Aparece un surco alrededor del centro: un anillo de microfilamentos empieza a apretar.', 'El surco se hace más profundo, como una bolsa que se cierra con un cordón.', 'El anillo se cierra del todo: dos células animales.'],
  vegetal: ['Mitosis terminada: dos núcleos dentro de la pared.', 'Vesículas del Golgi llegan al centro de la célula.', 'Las vesículas se juntan en una placa que crece hacia los lados.', 'La placa llega a las paredes y se convierte en pared nueva: dos células vegetales.'],
}

export function CitocinesisDiagrama() {
  const [tipo, setTipo] = useState<'animal' | 'vegetal'>('animal')
  const [i, setI] = useState(0)
  const cin = [0, 22, 48, 78][i]
  return (
    <PantallaCompleta conBoton>
      <Pestanas valor={tipo} opciones={[['animal', 'Célula animal'], ['vegetal', 'Célula vegetal']]} onCambio={(v) => { setTipo(v); setI(0) }} etiqueta="Tipo de célula" />
      <Dos>
        <div className={CAJA}>
          <Lienzo etiqueta={CITO[tipo][i]}>
            {tipo === 'animal' ? (
              <>
                <path d={`M 60 150 C 60 70, 190 ${70 + cin}, 200 ${70 + cin} C 210 ${70 + cin}, 340 70, 340 150 C 340 230, 210 ${230 - cin}, 200 ${230 - cin} C 190 ${230 - cin}, 60 230, 60 150 Z`} fill="#f8d9d4" stroke="#b05a5a" strokeWidth="5" style={{ transition: 'd 0.5s ease' }} />
                {i === 3 && <line x1="200" y1="140" x2="200" y2="160" stroke="#b05a5a" strokeWidth="5" />}
                {i > 0 && i < 3 && <ellipse cx="200" cy="150" rx="6" ry={80 - cin} fill="none" stroke="#d9534a" strokeWidth="3" strokeDasharray="4 3" />}
              </>
            ) : (
              <>
                <rect x="50" y="60" width="300" height="180" fill="#e6f2d6" stroke="#5b8a3a" strokeWidth="6" />
                {i >= 1 && Array.from({ length: [0, 4, 9, 0][i] }, (_, k) => <circle key={k} cx={200 + (k % 2 ? 4 : -4)} cy={150 + (k - ([0, 4, 9, 0][i] - 1) / 2) * 14} r="5" fill="#e0b040" stroke="#7a4a10" strokeWidth="1" />)}
                {i === 3 && <rect x="196" y="60" width="8" height="180" fill="#5b8a3a" />}
              </>
            )}
            <circle cx="120" cy="150" r="22" fill="#e8d9f2" stroke="#7a4a8a" strokeWidth="2.5" />
            <circle cx="280" cy="150" r="22" fill="#e8d9f2" stroke="#7a4a8a" strokeWidth="2.5" />
          </Lienzo>
        </div>
        <Texto>
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--acento)]">Paso {i + 1} de 4</p>
          <p className="mt-1">{CITO[tipo][i]}</p>
          <p className="mt-2 text-[var(--suave)]">{tipo === 'animal' ? 'Puede apretarse porque no tiene pared.' : 'No puede apretarse: su pared rígida se lo impide, así que construye una pared nueva en medio.'}</p>
        </Texto>
      </Dos>
      <Deslizador id="cito-paso" etiqueta="Divide el citoplasma" valor={i} max={3} onCambio={setI} rotulo={`Paso ${i + 1}`} />
    </PantallaCompleta>
  )
}

/* ── Los semáforos del ciclo ───────────────────────────────────────────────── */

const CASOS = [
  { punto: 'Final de G1', situacion: 'La célula es pequeña y no tiene suficientes nutrientes.', pasa: false, explica: 'Rojo: si se dividiera así, saldrían dos células demasiado pequeñas. Espera a crecer.' },
  { punto: 'Final de G1', situacion: 'La célula creció bien y el cuerpo necesita células nuevas para cerrar una herida.', pasa: true, explica: 'Verde: todo está listo y hay una señal para dividirse.' },
  { punto: 'Final de G2', situacion: 'El ADN se copió, pero quedó un trozo con errores.', pasa: false, explica: 'Rojo: primero se repara. Si no tiene arreglo, la célula puede activar la apoptosis.' },
  { punto: 'Final de G2', situacion: 'El ADN está copiado completo y sin errores.', pasa: true, explica: 'Verde: puede empezar la mitosis.' },
  { punto: 'Metafase', situacion: 'Un cromosoma todavía no se ha enganchado a las fibras del huso.', pasa: false, explica: 'Rojo: si separara las cromátidas ahora, una hija se quedaría sin ese cromosoma.' },
  { punto: 'Metafase', situacion: 'Todos los cromosomas están alineados y enganchados.', pasa: true, explica: 'Verde: ya puede empezar la anafase.' },
  { punto: 'Final de G1', situacion: 'Una célula con los frenos dañados recibe la orden de dividirse sin parar, aunque no haga falta.', pasa: false, explica: 'Debería ser rojo, pero sus frenos no funcionan: así empieza un tumor.' },
]

export function SemaforosCiclo() {
  const [i, setI] = useState(0)
  const [resp, setResp] = useState<(boolean | null)[]>(CASOS.map(() => null))
  const c = CASOS[i]
  const r = resp[i]
  const aciertos = resp.filter((x, k) => x === CASOS[k].pasa).length
  useFlechas((dir) => {
    setI((x) => Math.max(0, Math.min(CASOS.length - 1, x + dir)))
    return true
  })
  const luz = r === null ? null : c.pasa
  return (
    <PantallaCompleta conBoton>
      <p className="text-sm">Eres el punto de control. Lee la situación y decide: ¿la célula sigue (verde) o se detiene (rojo)? Con ← → cambias de caso.</p>
      <Dos>
        <div className={`${CAJA} flex items-center justify-center bg-[#2b2b2b]`}>
          <div className="flex flex-col gap-4 rounded-2xl bg-[#1a1a1a] p-5" role="img" aria-label={luz === null ? 'Semáforo apagado' : luz ? 'Semáforo en verde' : 'Semáforo en rojo'}>
            <span className="h-16 w-16 rounded-full transition" style={{ background: luz === false ? '#e53935' : '#4a2020' }} />
            <span className="h-16 w-16 rounded-full transition" style={{ background: luz === true ? '#43a047' : '#1f3a20' }} />
          </div>
        </div>
        <Texto>
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--acento)]">Caso {i + 1} de {CASOS.length} · {c.punto} · {aciertos} aciertos</p>
          <p className="mt-1 text-base font-bold">{c.situacion}</p>
          <div className="mt-2 flex gap-2">
            {([true, false] as const).map((v) => (
              <button key={String(v)} type="button" disabled={r !== null} onClick={() => setResp((x) => x.map((y, k) => (k === i ? v : y)))} className={`min-h-10 flex-1 rounded-lg border-2 px-3 font-semibold ${r === null ? 'border-[var(--linea)] hover:border-[var(--acento)]' : v === c.pasa ? 'border-green-700 dark:border-green-400 bg-[var(--acento-suave)]/40' : v === r ? 'border-red-700 dark:border-red-400' : 'opacity-60'}`}>
                {v ? '🟢 Sigue' : '🔴 Se detiene'}
              </button>
            ))}
          </div>
          {r !== null && (
            <>
              <p className="mt-2">
                <span className="font-semibold">{r === c.pasa ? '¡Bien!' : 'No.'}</span> {c.explica}
              </p>
              {i < CASOS.length - 1 && (
                <button type="button" data-principal onClick={() => setI(i + 1)} className="mt-2 min-h-10 rounded-full bg-[var(--acento)] px-5 text-sm font-bold text-[var(--sobre-acento)]">
                  Siguiente caso ›
                </button>
              )}
            </>
          )}
        </Texto>
      </Dos>
    </PantallaCompleta>
  )
}
