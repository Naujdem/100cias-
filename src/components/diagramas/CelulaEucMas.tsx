import { useState } from 'react'
import type { ReactNode } from 'react'
import PantallaCompleta from '../PantallaCompleta.tsx'
import { Lienzo, T } from '../ilustraciones/Dibujo.tsx'
import { Pestanas, Nota } from './TiposCelulas.tsx'
import { useFlechas } from '../../lib/flechasDiagrama.ts'

// Tema 3: diagramas de los pasos nuevos (citoesqueleto, ribosomas, peroxisomas, matriz y pared).
// Esquemas sin escala; texto en borrador (ver VERIFICAR.md).

const CAJA = 'aspect-[4/3] max-h-[var(--alto-visor,38dvh)] w-full overflow-hidden rounded-xl border border-[var(--linea)]'
const Dos = ({ children }: { children: ReactNode }) => <div className="grid gap-3 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">{children}</div>
const Texto = ({ children }: { children: ReactNode }) => (
  <div aria-live="polite" className="rounded-xl bg-[var(--fondo)] p-3 text-sm">
    {children}
  </div>
)
const BOTON = 'min-h-10 rounded-full bg-[var(--acento)] px-5 text-sm font-bold text-[var(--sobre-acento)]'

/* ── Citoesqueleto ─────────────────────────────────────────────────────────── */

type Fil = 'micro' | 'inter' | 'tubulo'
const FILAMENTOS: Record<Fil, { nombre: string; color: string; grosor: number; hace: string; ejemplo: string }> = {
  micro: { nombre: 'Microfilamentos (actina)', color: '#d9534a', grosor: 2, hace: 'Los más delgados. Forman una malla bajo la membrana y permiten que la célula cambie de forma y se arrastre.', ejemplo: 'Una ameba que estira un «pie» o una célula de músculo que se contrae.' },
  inter: { nombre: 'Filamentos intermedios', color: '#6b4fa3', grosor: 3.5, hace: 'De grosor medio y muy resistentes, como cuerdas. Aguantan los tirones y sostienen el núcleo.', ejemplo: 'Las células de la piel, que reciben roces todo el día.' },
  tubulo: { nombre: 'Microtúbulos', color: '#2f7fbf', grosor: 5, hace: 'Los más gruesos: tubos huecos que salen del centro. Son los rieles por donde viajan las vesículas y separan los cromosomas al dividirse.', ejemplo: 'Una vesícula que viaja desde el Golgi hasta la membrana.' },
}
const RAYOS: [number, number][] = [[70, 90], [80, 200], [120, 252], [210, 262], [300, 240], [336, 160], [300, 70], [200, 46], [120, 54]]

export function CitoesqueletoDiagrama() {
  const [fil, setFil] = useState<Fil>('tubulo')
  const [sin, setSin] = useState(false)
  const [viaje, setViaje] = useState(0)
  const f = FILAMENTOS[fil]
  const borde = sin ? 'M 60 200 Q 70 150 140 160 Q 200 120 260 165 Q 340 150 350 210 Q 330 262 200 262 Q 72 262 60 200 Z' : 'M 46 150 Q 44 66 120 50 Q 200 30 284 52 Q 360 76 354 160 Q 348 244 270 260 Q 190 276 112 258 Q 48 238 46 150 Z'
  return (
    <PantallaCompleta conBoton>
      <Pestanas valor={fil} opciones={[['micro', 'Microfilamentos'], ['inter', 'Intermedios'], ['tubulo', 'Microtúbulos']]} onCambio={(v) => { setFil(v); setSin(false) }} etiqueta="Tipo de filamento" />
      <Dos>
        <div className={CAJA}>
          <Lienzo etiqueta={sin ? 'Célula sin citoesqueleto: perdió la forma' : `Célula con sus ${f.nombre.toLowerCase()} resaltados`}>
            <path d={borde} fill="#f8d9d4" stroke="#b05a5a" strokeWidth="5" style={{ transition: 'd 0.6s ease' }} className="motion-reduce:!transition-none" />
            {!sin && (
              <>
                {/* microfilamentos: malla bajo la membrana */}
                <path d="M 66 150 Q 64 80 126 66 Q 200 48 278 68 Q 340 90 336 160 Q 330 230 266 244 Q 190 258 118 242 Q 66 226 66 150 Z" fill="none" stroke={FILAMENTOS.micro.color} strokeWidth={fil === 'micro' ? 3 : 1.2} strokeDasharray="3 3" opacity={fil === 'micro' ? 1 : 0.35} />
                {/* intermedios: cuerdas alrededor del núcleo */}
                {[[160, 150, 80, 90], [240, 150, 320, 110], [200, 180, 230, 248], [180, 120, 140, 60]].map(([a, b, c, d], i) => (
                  <path key={i} d={`M ${a} ${b} Q ${(a + c) / 2 + 12} ${(b + d) / 2 - 10} ${c} ${d}`} fill="none" stroke={FILAMENTOS.inter.color} strokeWidth={fil === 'inter' ? 3.5 : 1.4} opacity={fil === 'inter' ? 1 : 0.35} />
                ))}
                {/* microtúbulos: rayos desde el centro */}
                {RAYOS.map(([x, y]) => (
                  <line key={`${x}-${y}`} x1="252" y1="190" x2={x} y2={y} stroke={FILAMENTOS.tubulo.color} strokeWidth={fil === 'tubulo' ? 4 : 1.4} opacity={fil === 'tubulo' ? 0.9 : 0.3} />
                ))}
                <circle cx="252" cy="190" r="7" fill={FILAMENTOS.tubulo.color} />
                {fil === 'tubulo' && (
                  <circle r="10" fill="#f2c77a" stroke="#b3861f" strokeWidth="2" style={{ transform: `translate(${252 + (336 - 252) * viaje}px, ${190 + (160 - 190) * viaje}px)`, transition: 'transform 1s ease' }} className="motion-reduce:!transition-none" />
                )}
              </>
            )}
            <circle cx={sin ? 190 : 190} cy={sin ? 220 : 150} r="34" fill="#e8d9f2" stroke="#7a4a8a" strokeWidth="3" style={{ transition: 'cy 0.6s ease' }} />
            <T x={190} y={(sin ? 220 : 150) + 4} s={11} b>Núcleo</T>
          </Lienzo>
        </div>
        <Texto>
          {sin ? (
            <p>
              <span className="font-semibold">Sin citoesqueleto</span> la célula se aplasta, el núcleo se va al fondo y las vesículas ya no tienen por dónde viajar. Una célula animal no tiene pared: su forma depende de este andamio.
            </p>
          ) : (
            <>
              <p className="text-base font-bold" style={{ color: f.color }}>{f.nombre}</p>
              <p className="mt-1">{f.hace}</p>
              <p className="mt-2 text-[var(--suave)]">Ejemplo: {f.ejemplo}</p>
              {fil === 'tubulo' && (
                <button type="button" data-principal onClick={() => setViaje(viaje ? 0 : 1)} className={`${BOTON} mt-2`}>
                  {viaje ? 'Devolver la vesícula' : 'Mover una vesícula por el riel'}
                </button>
              )}
            </>
          )}
          <button type="button" aria-pressed={sin} onClick={() => setSin(!sin)} className="mt-2 block min-h-10 rounded-full border border-[var(--acento)] px-5 text-sm font-bold text-[var(--acento)]">
            {sin ? 'Devolver el citoesqueleto' : 'Quitar el citoesqueleto'}
          </button>
        </Texto>
      </Dos>
      <Nota>Esquema: en una célula real los filamentos son miles y forman una red mucho más densa.</Nota>
    </PantallaCompleta>
  )
}

/* ── Ribosomas ─────────────────────────────────────────────────────────────── */

const PROTEINAS: { nombre: string; donde: 'libre' | 'reticulo'; explica: string }[] = [
  { nombre: 'Una enzima que trabaja en el citosol', donde: 'libre', explica: 'Se queda dentro: la fabrica un ribosoma libre.' },
  { nombre: 'La insulina, que sale de la célula', donde: 'reticulo', explica: 'Va hacia afuera: la fabrica un ribosoma pegado al retículo y sigue la ruta hasta el Golgi.' },
  { nombre: 'Una proteína de la membrana', donde: 'reticulo', explica: 'Termina en la membrana: entra al retículo mientras se fabrica.' },
  { nombre: 'La actina del citoesqueleto', donde: 'libre', explica: 'Trabaja en el citoplasma: la fabrica un ribosoma libre.' },
  { nombre: 'Una enzima de los lisosomas', donde: 'reticulo', explica: 'Viaja en una vesícula hasta el lisosoma: empieza en el retículo.' },
]

export function RibosomasDiagrama() {
  const [i, setI] = useState(0)
  const [resp, setResp] = useState<('libre' | 'reticulo' | null)[]>(PROTEINAS.map(() => null))
  const p = PROTEINAS[i]
  const r = resp[i]
  useFlechas((dir) => {
    setI((x) => Math.max(0, Math.min(PROTEINAS.length - 1, x + dir)))
    return true
  })
  const aciertos = resp.filter((x, k) => x === PROTEINAS[k].donde).length
  const marca = (d: 'libre' | 'reticulo') => (r === null ? 'enabled:hover:border-[var(--acento)]' : d === p.donde ? 'border-green-700 dark:border-green-400 bg-[var(--acento-suave)]/40' : d === r ? 'border-red-700 dark:border-red-400' : 'opacity-60')
  return (
    <PantallaCompleta conBoton>
      <p className="text-sm">Hay ribosomas sueltos en el citosol y ribosomas pegados al retículo rugoso. Son iguales: lo que cambia es para dónde va la proteína. Con ← → cambias de proteína.</p>
      <Dos>
        <div className={CAJA}>
          <Lienzo etiqueta="Ribosomas libres y ribosomas pegados al retículo rugoso">
            <T x={100} y={30} s={13} b>Libres en el citosol</T>
            {[[60, 80], [110, 110], [150, 70], [80, 150], [140, 170]].map(([x, y]) => (
              <g key={`${x}-${y}`}>
                <circle cx={x} cy={y} r="9" fill="#8a5a2b" />
                <circle cx={x + 6} cy={y - 6} r="6" fill="#b07a45" />
                <path d={`M ${x + 9} ${y + 4} q 14 6 10 18 q -4 10 8 14`} fill="none" stroke="#d97f4a" strokeWidth="3" strokeLinecap="round" />
              </g>
            ))}
            <T x={100} y={222} s={11}>la proteína queda en el citosol</T>
            <T x={300} y={30} s={13} b>Pegados al retículo</T>
            <path d="M 230 70 Q 300 50 370 72 L 370 104 Q 300 84 230 104 Z M 230 130 Q 300 110 370 132 L 370 164 Q 300 144 230 164 Z" fill="#e6d3f0" stroke="#7a4a8a" strokeWidth="2.5" />
            {[240, 270, 300, 330, 360].flatMap((x) => [62, 122].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y + (x % 60 ? 2 : -2)} r="6" fill="#8a5a2b" />))}
            <path d="M 300 160 q 4 20 -6 34 q -8 12 4 26" fill="none" stroke="#d97f4a" strokeWidth="3" strokeLinecap="round" />
            <T x={300} y={244} s={11}>la proteína entra al retículo</T>
            <T x={300} y={260} s={11}>y sigue hacia el Golgi</T>
          </Lienzo>
        </div>
        <Texto>
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--acento)]">Proteína {i + 1} de {PROTEINAS.length} · {aciertos} aciertos</p>
          <p className="mt-1 text-base font-bold">{p.nombre}</p>
          <p className="mt-1">¿Qué ribosoma la fabrica?</p>
          <div className="mt-2 flex flex-col gap-2">
            <button type="button" disabled={r !== null} onClick={() => setResp((x) => x.map((v, k) => (k === i ? 'libre' : v)))} className={`min-h-10 rounded-lg border-2 border-[var(--linea)] px-3 text-left font-semibold ${marca('libre')}`}>Un ribosoma libre</button>
            <button type="button" disabled={r !== null} onClick={() => setResp((x) => x.map((v, k) => (k === i ? 'reticulo' : v)))} className={`min-h-10 rounded-lg border-2 border-[var(--linea)] px-3 text-left font-semibold ${marca('reticulo')}`}>Un ribosoma del retículo</button>
          </div>
          {r !== null && (
            <>
              <p className="mt-2">
                <span className="font-semibold">{r === p.donde ? '¡Correcto!' : 'No.'}</span> {p.explica}
              </p>
              {i < PROTEINAS.length - 1 && (
                <button type="button" data-principal onClick={() => setI(i + 1)} className={`${BOTON} mt-2`}>
                  Siguiente ›
                </button>
              )}
            </>
          )}
        </Texto>
      </Dos>
      <Nota>Los ribosomas no son orgánulos con membrana: son máquinas de ARN y proteínas. Esquema sin escala.</Nota>
    </PantallaCompleta>
  )
}

/* ── Peroxisomas ───────────────────────────────────────────────────────────── */

export function PeroxisomaDiagrama() {
  const [n, setN] = useState(0)
  const [sinEnzima, setSinEnzima] = useState(false)
  const dentro = Math.min(n, 6)
  return (
    <PantallaCompleta conBoton>
      <p className="text-sm">Al trabajar, la célula produce agua oxigenada (H₂O₂), que es dañina. El peroxisoma la atrapa y la rompe con una enzima llamada catalasa.</p>
      <Dos>
        <div className={CAJA}>
          <Lienzo etiqueta={sinEnzima ? 'Peroxisoma sin catalasa: el agua oxigenada se acumula' : `Peroxisoma: ${n} moléculas de agua oxigenada convertidas`}>
            <circle cx="200" cy="150" r="96" fill={sinEnzima ? '#f3d2c9' : '#e4f1d8'} stroke="#5b8a3a" strokeWidth="5" />
            <T x={200} y={70} s={13} b>Peroxisoma</T>
            {!sinEnzima && <rect x="172" y="132" width="56" height="36" rx="8" fill="#9ccf86" stroke="#3f6b3a" strokeWidth="2" />}
            {!sinEnzima && <T x={200} y={155} s={10.5} b>catalasa</T>}
            {Array.from({ length: dentro }, (_, k) => {
              const a = (k / 6) * Math.PI * 2
              const x = 200 + Math.cos(a) * 62
              const y = 150 + Math.sin(a) * 62
              return sinEnzima ? (
                <g key={k}>
                  <circle cx={x} cy={y} r="12" fill="#e8806f" stroke="#8f2f29" strokeWidth="2" />
                  <T x={x} y={y + 4} s={8.5} b c="#fff">H₂O₂</T>
                </g>
              ) : (
                <g key={k}>
                  <circle cx={x - 6} cy={y} r="8" fill="#7fb2e5" stroke="#2f5f9a" strokeWidth="1.5" />
                  <circle cx={x + 8} cy={y - 6} r="6" fill="#fff" stroke="#2f5f9a" strokeWidth="1.5" />
                </g>
              )
            })}
            <T x={200} y={278} s={12}>{sinEnzima ? 'se acumula y daña la célula' : 'se convierte en agua (azul) y oxígeno (blanco)'}</T>
          </Lienzo>
        </div>
        <Texto>
          <p className="text-xl font-bold">{n} H₂O₂ {sinEnzima ? 'acumuladas' : 'desarmadas'}</p>
          <p className="mt-1">
            {sinEnzima ? 'Sin catalasa, el agua oxigenada se queda y daña la membrana, las proteínas y el ADN.' : '2 H₂O₂ → 2 H₂O + O₂. Lo peligroso queda convertido en agua y oxígeno.'}
          </p>
          <p className="mt-2 text-[var(--suave)]">Los peroxisomas también desarman grasas largas. Abundan en las células del hígado.</p>
          <button type="button" data-principal onClick={() => setN(n + 1)} className={`${BOTON} mt-2`}>
            Llega agua oxigenada
          </button>
          <button type="button" aria-pressed={sinEnzima} onClick={() => { setSinEnzima(!sinEnzima); setN(0) }} className="mt-2 block min-h-10 rounded-full border border-[var(--acento)] px-5 text-sm font-bold text-[var(--acento)]">
            {sinEnzima ? 'Devolver la catalasa' : 'Quitar la catalasa'}
          </button>
        </Texto>
      </Dos>
      <Nota>Si pones agua oxigenada en una herida o en un trozo de hígado crudo, hace burbujas: es la catalasa liberando oxígeno.</Nota>
    </PantallaCompleta>
  )
}

/* ── Matriz extracelular y pared celular ──────────────────────────────────── */

export function MatrizParedDiagrama() {
  const [tipo, setTipo] = useState<'animal' | 'vegetal'>('vegetal')
  const [agua, setAgua] = useState(2)
  const hinchado = 1 + agua * 0.06
  return (
    <PantallaCompleta conBoton>
      <Pestanas valor={tipo} opciones={[['vegetal', 'Célula vegetal: pared'], ['animal', 'Célula animal: matriz']]} onCambio={setTipo} etiqueta="Tipo de célula" />
      <Dos>
        <div className={CAJA}>
          {tipo === 'vegetal' ? (
            <Lienzo etiqueta={`Células vegetales con pared, con ${agua} de 4 de agua`}>
              {[0, 1, 2].flatMap((f) =>
                [0, 1, 2, 3].map((c) => {
                  const x = 50 + c * 80
                  const y = 40 + f * 76
                  const w = 62 * Math.min(hinchado, 1.18)
                  const h = 56 * Math.min(hinchado, 1.18)
                  return (
                    <g key={`${f}-${c}`}>
                      <rect x={x - 6} y={y - 6} width="80" height="76" fill="#cfe3a8" stroke="#5b8a3a" strokeWidth="5" />
                      <rect x={x + 6 + (62 - w) / 2} y={y + 4 + (56 - h) / 2} width={w - 12} height={h - 8} rx="10" fill="#e6f2d6" stroke="#3f6b3a" strokeWidth="1.6" style={{ transition: 'all 0.4s ease' }} />
                      <rect x={x + 18} y={y + 14} width={(w - 36) * (agua / 4)} height="28" rx="8" fill="#bcdcf2" />
                    </g>
                  )
                }),
              )}
            </Lienzo>
          ) : (
            <Lienzo etiqueta="Células animales rodeadas de matriz extracelular con fibras de colágeno">
              <rect x="0" y="0" width="400" height="300" fill="#f7efdc" />
              {[[20, 60, 380, 110], [10, 200, 390, 160], [80, 20, 150, 290], [260, 10, 330, 290], [30, 260, 370, 240]].map(([a, b, c, d], k) => (
                <path key={k} d={`M ${a} ${b} Q ${(a + c) / 2} ${(b + d) / 2 + 30} ${c} ${d}`} fill="none" stroke="#d6a560" strokeWidth="5" strokeLinecap="round" opacity="0.85" />
              ))}
              {[[90, 120], [210, 80], [320, 140], [150, 220], [280, 230]].map(([x, y]) => (
                <g key={`${x}-${y}`}>
                  <ellipse cx={x} cy={y} rx="34" ry="24" fill="#f8d9d4" stroke="#b05a5a" strokeWidth="3" />
                  <circle cx={x} cy={y} r="8" fill="#e8d9f2" stroke="#7a4a8a" strokeWidth="1.5" />
                </g>
              ))}
              <T x={200} y={290} s={11.5}>fibras de colágeno (dorado) entre las células</T>
            </Lienzo>
          )}
        </div>
        <Texto>
          {tipo === 'vegetal' ? (
            <>
              <p className="text-base font-bold">Pared celular</p>
              <p className="mt-1">Una caja rígida de celulosa por fuera de la membrana. Cuando la vacuola se llena de agua, la célula empuja contra la pared y queda firme, como un balón inflado dentro de una caja.</p>
              <p className="mt-2 font-semibold">{agua === 0 ? 'Sin agua: la célula se encoge y la planta se marchita.' : agua < 3 ? 'Con algo de agua: la célula todavía no empuja la pared.' : 'Llena de agua: empuja contra la pared y la planta queda firme.'}</p>
              <label htmlFor="pared-agua" className="mt-3 block text-sm font-semibold">Agua en la vacuola</label>
              <input id="pared-agua" type="range" min="0" max="4" step="1" value={agua} onChange={(e) => setAgua(Number(e.target.value))} onPointerUp={(e) => e.currentTarget.closest<HTMLElement>('[role=dialog]')?.focus()} className="mt-1 h-8 w-full accent-[var(--acento)]" />
            </>
          ) : (
            <>
              <p className="text-base font-bold">Matriz extracelular</p>
              <p className="mt-1">Las células animales no tienen pared. Las rodea una red de proteínas y azúcares que ellas mismas fabrican; la más abundante es el colágeno.</p>
              <p className="mt-2">Mantiene unidas a las células, da resistencia a los tejidos y les avisa dónde están. En el hueso se le suma calcio y por eso es duro; en el cartílago es flexible.</p>
            </>
          )}
        </Texto>
      </Dos>
      <Nota>Esquemas sin escala. La madera y el papel son paredes celulares de plantas; el cuero es sobre todo matriz extracelular.</Nota>
    </PantallaCompleta>
  )
}

