import { useState } from 'react'
import PantallaCompleta from '../PantallaCompleta.tsx'
import VisorZoom from '../VisorZoom.tsx'
import { Lienzo, T } from '../ilustraciones/Dibujo.tsx'
import { CelulaPro, CelulaEu, CelulaVegetal, FormaBacteria, CelulaEspecial, type CapasProEu, type Especializada } from '../ilustraciones/CelulasTipos.tsx'
import { useFlechas } from '../../lib/flechasDiagrama.ts'

// Diagramas del subtema 2 «Tipos de células»: dos comparadores, el explorador de bacterias
// y la galería de células especializadas. Todo el texto es borrador (verificar antes de revisar).

/* ── piezas comunes ───────────────────────────────────────────────────────── */

export function Pestanas<T extends string>({ valor, opciones, onCambio, etiqueta }: { valor: T; opciones: [T, string][]; onCambio: (v: T) => void; etiqueta: string }) {
  return (
    <div role="group" aria-label={etiqueta} className="mb-3 flex flex-wrap gap-2">
      {opciones.map(([id, texto]) => (
        <button
          key={id}
          type="button"
          aria-pressed={valor === id}
          onClick={() => onCambio(id)}
          className="min-h-10 rounded-full border border-[var(--acento)] px-3 text-sm font-semibold text-[var(--acento)] aria-pressed:bg-[var(--acento)] aria-pressed:text-white"
        >
          {texto}
        </button>
      ))}
    </div>
  )
}

interface ItemClasifica {
  texto: string
  r: string
  explica: string
}

/** Juego de clasificar: una afirmación o un caso y dos o tres opciones. Se mueve con ← → y se responde con un toque. */
export function Clasifica({ intro, pregunta, items, opciones, pista = 'Piensa en el núcleo, la pared y los orgánulos.' }: { intro: string; pregunta: string; items: ItemClasifica[]; opciones: [string, string][]; pista?: string }) {
  const [i, setI] = useState(0)
  const [resp, setResp] = useState<(string | null)[]>(items.map(() => null))
  const it = items[i]
  const elegida = resp[i]
  const aciertos = resp.filter((r, k) => r === items[k].r).length
  useFlechas((dir) => {
    setI((x) => Math.max(0, Math.min(items.length - 1, x + dir)))
    return true
  })
  return (
    <PantallaCompleta conBoton>
      <p className="text-sm">{intro} Con ← → cambias de tarjeta.</p>
      <div role="group" aria-label="Tarjetas" className="mt-3 flex flex-wrap gap-2">
        {items.map((x, k) => (
          <button
            key={x.texto}
            type="button"
            aria-pressed={i === k}
            aria-label={`Tarjeta ${k + 1}${resp[k] === null ? '' : resp[k] === x.r ? ', acertada' : ', por repasar'}`}
            onClick={() => setI(k)}
            className="min-h-10 min-w-10 rounded-full border border-[var(--linea)] px-3 text-sm font-semibold aria-pressed:border-[var(--acento)] aria-pressed:bg-[var(--acento-suave)]/50"
          >
            {k + 1}
            {resp[k] !== null && <span aria-hidden="true">{resp[k] === x.r ? ' ✓' : ' ✗'}</span>}
          </button>
        ))}
      </div>
      <p className="mt-3 rounded-xl border border-[var(--linea)] bg-[var(--tarjeta)] p-3 text-base font-semibold">{it.texto}</p>
      <p className="mt-2 text-sm">{pregunta}</p>
      <div role="group" aria-label="Opciones" className="mt-2 flex flex-wrap gap-2">
        {opciones.map(([id, texto]) => {
          const marca = elegida === null ? '' : id === it.r ? 'border-green-700 bg-[var(--acento-suave)]/40' : id === elegida ? 'border-red-700' : 'opacity-60'
          return (
            <button
              key={id}
              type="button"
              disabled={elegida === it.r}
              onClick={() => setResp((r) => r.map((v, k) => (k === i ? id : v)))}
              className={`min-h-10 rounded-lg border-2 border-[var(--linea)] px-4 text-sm font-semibold enabled:hover:border-[var(--acento)] ${marca}`}
            >
              {texto}
            </button>
          )
        })}
      </div>
      <div aria-live="polite" className="mt-3 min-h-[3.5rem] rounded-xl bg-[var(--fondo)] p-3 text-sm">
        {elegida === null ? (
          <p className="text-[var(--suave)]">Elige una opción. Llevas {aciertos} de {items.length} acertadas.</p>
        ) : elegida === it.r ? (
          <p>
            <span className="font-semibold">¡Eso es!</span> {it.explica}
          </p>
        ) : (
          <p>
            <span className="font-semibold">Todavía no.</span> {pista} Inténtalo otra vez.
          </p>
        )}
      </div>
    </PantallaCompleta>
  )
}

export const Nota = ({ children }: { children: string }) => <p className="mt-2 text-xs text-[var(--suave)]">{children}</p>

/* ── 1. Procariota vs eucariota ───────────────────────────────────────────── */

type CapaPE = keyof CapasProEu
const CAPAS_PE: { id: CapaPE; nombre: string; pro: string; eu: string }[] = [
  { id: 'nucleo', nombre: 'Núcleo', pro: 'No tiene núcleo: el ADN está en una zona del citoplasma llamada nucleoide, sin membrana que la rodee.', eu: 'Tiene núcleo: una bolsa con membrana que guarda el ADN.' },
  { id: 'adn', nombre: 'ADN', pro: 'Un cromosoma circular, suelto en el citoplasma.', eu: 'Varios cromosomas lineales, guardados dentro del núcleo.' },
  { id: 'organulos', nombre: 'Orgánulos', pro: 'No tiene orgánulos con membrana (como mitocondrias).', eu: 'Tiene orgánulos con membrana: mitocondrias, retículo, aparato de Golgi, etc.' },
  { id: 'ribosomas', nombre: 'Ribosomas', pro: 'Tiene ribosomas, más pequeños, para fabricar proteínas.', eu: 'También tiene ribosomas, un poco más grandes.' },
]

function ExploraProEu() {
  const [capas, setCapas] = useState<CapasProEu>({ nucleo: false, adn: false, organulos: false, ribosomas: false })
  const [ultima, setUltima] = useState<CapaPE | null>(null)
  const [relativo, setRelativo] = useState(false)
  const alternar = (id: CapaPE) => {
    setCapas((c) => ({ ...c, [id]: !c[id] }))
    setUltima(id)
  }
  const info = CAPAS_PE.find((c) => c.id === ultima)
  return (
    <PantallaCompleta>
      <VisorZoom etiqueta="Célula procariota y célula eucariota, lado a lado" alto="aspect-[4/3]">
        <Lienzo etiqueta="Célula procariota (izquierda) y eucariota (derecha) con capas que se encienden">
          <line x1="200" y1="20" x2="200" y2="280" stroke="#d6cdb8" strokeWidth="2" strokeDasharray="5 5" />
          <T x={100} y={30} s={16} b>Procariota</T>
          <T x={300} y={30} s={16} b>Eucariota</T>
          <g transform={`translate(${relativo ? 96 : 88} 140)`}>
            <CelulaPro capas={{ ...capas, nucleo: false, organulos: false }} k={relativo ? 0.3 : 0.68} />
          </g>
          <g transform="translate(300 140)">
            <CelulaEu capas={capas} k={1.05} />
          </g>
          {capas.nucleo && <T x={100} y={222} s={12} b>sin núcleo</T>}
          {capas.organulos && <T x={100} y={240} s={12} b>sin orgánulos con membrana</T>}
          {capas.nucleo && <T x={300} y={222} s={12} b>con núcleo</T>}
          {capas.organulos && <T x={300} y={240} s={12} b>con orgánulos con membrana</T>}
          {relativo && <T x={200} y={278} s={11} i>la procariota suele medir unas 10 veces menos (aprox.)</T>}
        </Lienzo>
      </VisorZoom>
      <div role="group" aria-label="Capas" className="mt-3 flex flex-wrap gap-2">
        {CAPAS_PE.map((c) => (
          <button
            key={c.id}
            type="button"
            aria-pressed={capas[c.id]}
            onClick={() => alternar(c.id)}
            className="min-h-10 rounded-full border border-[var(--acento)] px-3 text-sm font-semibold text-[var(--acento)] aria-pressed:bg-[var(--acento)] aria-pressed:text-white"
          >
            {c.nombre}
          </button>
        ))}
        <button
          type="button"
          aria-pressed={relativo}
          onClick={() => setRelativo((r) => !r)}
          className="min-h-10 rounded-full border border-[var(--linea)] px-3 text-sm font-semibold aria-pressed:border-[var(--acento)] aria-pressed:bg-[var(--acento-suave)]/50"
        >
          Tamaño relativo
        </button>
      </div>
      <div aria-live="polite" className="mt-2 min-h-[6rem] rounded-xl bg-[var(--fondo)] p-3 text-sm">
        {info ? (
          <div className="grid gap-2 sm:grid-cols-2">
            <p>
              <span className="font-semibold">Procariota: </span>
              {info.pro}
            </p>
            <p>
              <span className="font-semibold">Eucariota: </span>
              {info.eu}
            </p>
          </div>
        ) : (
          <p className="text-[var(--suave)]">Enciende las capas una a una y compara. Las dos tienen membrana, citoplasma, ADN y ribosomas; lo que cambia es cómo está organizado por dentro.</p>
        )}
      </div>
      <Nota>Esquemas simplificados: ni los tamaños ni las formas son reales.</Nota>
    </PantallaCompleta>
  )
}

const ITEMS_PE: ItemClasifica[] = [
  { texto: 'Su ADN está dentro de un núcleo con membrana.', r: 'eu', explica: 'Tener núcleo verdadero es la marca de las eucariotas.' },
  { texto: 'Su ADN anda suelto en el citoplasma, en una zona llamada nucleoide.', r: 'pro', explica: 'Sin núcleo: es procariota.' },
  { texto: 'Tiene mitocondrias.', r: 'eu', explica: 'Las mitocondrias son orgánulos con membrana: solo las eucariotas los tienen.' },
  { texto: 'Una bacteria.', r: 'pro', explica: 'Las bacterias son procariotas.' },
  { texto: 'Una célula de tu piel.', r: 'eu', explica: 'Los animales, y por tanto las personas, tienen células eucariotas.' },
  { texto: 'Una arquea que vive en aguas muy calientes.', r: 'pro', explica: 'Las arqueas también son procariotas, aunque no son bacterias.' },
  { texto: 'Una levadura.', r: 'eu', explica: 'Es un hongo unicelular: una sola célula, pero con núcleo.' },
]

function ClasificaProEu() {
  return <Clasifica intro="Decide si cada pista describe una célula procariota o eucariota." pregunta="¿Es procariota o eucariota?" items={ITEMS_PE} opciones={[['pro', 'Procariota'], ['eu', 'Eucariota']]} />
}

export function ComparadorProEu({ modo = 'explora' }: { modo?: 'explora' | 'clasifica' }) {
  const [m, setM] = useState(modo)
  return (
    <div>
      <Pestanas valor={m} onCambio={setM} etiqueta="Actividad" opciones={[['explora', 'Compáralas'], ['clasifica', '¿Cuál es?']]} />
      {m === 'explora' ? <ExploraProEu /> : <ClasificaProEu />}
    </div>
  )
}

/* ── 2. Animal vs vegetal ─────────────────────────────────────────────────── */

type CapaAV = 'pared' | 'cloroplastos' | 'vacuola'
const CAPAS_AV: { id: CapaAV; nombre: string; animal: string; vegetal: string }[] = [
  { id: 'pared', nombre: 'Pared celular', animal: 'No tiene pared: solo membrana, por eso su forma es más flexible.', vegetal: 'Tiene una pared rígida de celulosa por fuera de la membrana: da forma y protege.' },
  { id: 'cloroplastos', nombre: 'Cloroplastos', animal: 'No tiene cloroplastos: no hace fotosíntesis y se alimenta de otros seres.', vegetal: 'Tiene cloroplastos, donde hace fotosíntesis y fabrica su alimento con luz.' },
  { id: 'vacuola', nombre: 'Vacuola grande', animal: 'Tiene vacuolas, pero pequeñas.', vegetal: 'Tiene una vacuola central grande que guarda agua y mantiene la célula firme.' },
]
const EXTRAS_AV = [
  'Forma: la vegetal suele ser más regular y rectangular por la pared; la animal, más variable.',
  'Centriolos: típicos de las células animales; las plantas con flores no los tienen.',
  'Comparten: membrana, citoplasma, núcleo, mitocondrias y ribosomas.',
]

function ExploraAV() {
  const [capas, setCapas] = useState<Record<CapaAV, boolean>>({ pared: true, cloroplastos: true, vacuola: true })
  const [ultima, setUltima] = useState<CapaAV | null>(null)
  const alternar = (id: CapaAV) => {
    setCapas((c) => ({ ...c, [id]: !c[id] }))
    setUltima(id)
  }
  const info = CAPAS_AV.find((c) => c.id === ultima)
  return (
    <PantallaCompleta>
      <VisorZoom etiqueta="Célula animal y célula vegetal, lado a lado" alto="aspect-[4/3]">
        <Lienzo etiqueta="Célula animal (izquierda) y vegetal (derecha) con pared, cloroplastos y vacuola que se encienden">
          <line x1="200" y1="20" x2="200" y2="280" stroke="#d6cdb8" strokeWidth="2" strokeDasharray="5 5" />
          <T x={100} y={30} s={16} b>Animal</T>
          <T x={300} y={30} s={16} b>Vegetal</T>
          <g transform="translate(100 140)">
            <CelulaEu capas={{ adn: true, nucleo: true, organulos: true, ribosomas: false }} k={1.05} />
          </g>
          <g transform="translate(300 140)">
            <CelulaVegetal pared={capas.pared} cloroplastos={capas.cloroplastos} vacuola={capas.vacuola} k={1.1} />
          </g>
          <T x={100} y={236} s={12}>sin pared · sin cloroplastos</T>
          <T x={100} y={254} s={12}>vacuolas pequeñas</T>
          <T x={300} y={236} s={12}>{[capas.pared && 'pared', capas.cloroplastos && 'cloroplastos', capas.vacuola && 'vacuola grande'].filter(Boolean).join(' · ') || 'sin lo propio de las plantas'}</T>
        </Lienzo>
      </VisorZoom>
      <div role="group" aria-label="Capas de la célula vegetal" className="mt-3 flex flex-wrap gap-2">
        {CAPAS_AV.map((c) => (
          <button
            key={c.id}
            type="button"
            aria-pressed={capas[c.id]}
            onClick={() => alternar(c.id)}
            className="min-h-10 rounded-full border border-[var(--acento)] px-3 text-sm font-semibold text-[var(--acento)] aria-pressed:bg-[var(--acento)] aria-pressed:text-white"
          >
            {c.nombre}
          </button>
        ))}
      </div>
      <div aria-live="polite" className="mt-2 min-h-[6rem] rounded-xl bg-[var(--fondo)] p-3 text-sm">
        {info ? (
          <div className="grid gap-2 sm:grid-cols-2">
            <p>
              <span className="font-semibold">Animal: </span>
              {info.animal}
            </p>
            <p>
              <span className="font-semibold">Vegetal: </span>
              {info.vegetal}
            </p>
          </div>
        ) : (
          <ul className="list-disc space-y-1 pl-5">
            {EXTRAS_AV.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        )}
      </div>
      <Nota>Apaga las tres capas de la célula vegetal y verás cuánto se parece a la animal. Esquemas simplificados.</Nota>
    </PantallaCompleta>
  )
}

const ITEMS_AV: ItemClasifica[] = [
  { texto: 'Tiene pared de celulosa y cloroplastos.', r: 'veg', explica: 'La pared y los cloroplastos son propios de las células vegetales.' },
  { texto: 'No tiene pared, así que su forma puede cambiar con facilidad.', r: 'ani', explica: 'Sin pared, la célula animal es más flexible.' },
  { texto: 'Tiene una vacuola central enorme llena de agua.', r: 'veg', explica: 'La vacuola central grande es típica de las plantas.' },
  { texto: 'Se alimenta de otros seres; no hace fotosíntesis.', r: 'ani', explica: 'Sin cloroplastos no hay fotosíntesis: es una célula animal.' },
  { texto: 'Una célula de una hoja de lechuga.', r: 'veg', explica: 'Las hojas son tejido vegetal, con células con pared y cloroplastos.' },
  { texto: 'Una célula de tu mejilla.', r: 'ani', explica: 'Es una célula animal: sin pared y sin cloroplastos.' },
]

function ClasificaAV() {
  return <Clasifica intro="Decide si cada pista corresponde a una célula animal o vegetal." pregunta="¿Animal o vegetal?" items={ITEMS_AV} opciones={[['ani', 'Animal'], ['veg', 'Vegetal']]} />
}

export function ComparadorAnimalVegetal({ modo = 'explora' }: { modo?: 'explora' | 'clasifica' }) {
  const [m, setM] = useState(modo)
  return (
    <div>
      <Pestanas valor={m} onCambio={setM} etiqueta="Actividad" opciones={[['explora', 'Compáralas'], ['clasifica', '¿Cuál es?']]} />
      {m === 'explora' ? <ExploraAV /> : <ClasificaAV />}
    </div>
  )
}

/* ── 3. Explorador de bacterias y arqueas ─────────────────────────────────── */

type Forma = 'coco' | 'bacilo' | 'espirilo' | 'vibrio'
const FORMAS: { id: Forma; nombre: string; ejemplo: string; dato: string }[] = [
  { id: 'coco', nombre: 'Cocos', ejemplo: 'Staphylococcus (en racimos) y Streptococcus (en cadenas)', dato: 'Son redondas. Pueden quedar en parejas, cadenas o racimos después de dividirse.' },
  { id: 'bacilo', nombre: 'Bacilos', ejemplo: 'Escherichia coli y Lactobacillus', dato: 'Son alargadas, como bastoncitos. Es una de las formas más comunes.' },
  { id: 'espirilo', nombre: 'Espirilos', ejemplo: 'Spirillum; las espiroquetas, como Treponema, son espirales más flexibles', dato: 'Tienen forma de espiral o de resorte.' },
  { id: 'vibrio', nombre: 'Vibrios', ejemplo: 'Vibrio cholerae', dato: 'Son curvas, con forma de coma.' },
]

interface Hogar {
  icono: string
  titulo: string
  texto: string
}
const HOGARES: Record<'bacterias' | 'arqueas', Hogar[]> = {
  bacterias: [
    { icono: '🌱', titulo: 'Suelo', texto: 'Descomponen materia muerta. Algunas, como Rhizobium, ayudan a las plantas a obtener nitrógeno.' },
    { icono: '🫃', titulo: 'Intestino', texto: 'Muchas viven en tu intestino y ayudan a digerir; en general conviven con nosotros sin dañarnos.' },
    { icono: '🌊', titulo: 'Agua', texto: 'Las cianobacterias hacen fotosíntesis en lagos y mares.' },
    { icono: '🤒', titulo: 'Causan enfermedades', texto: 'Solo una minoría produce enfermedades, como el cólera o la tuberculosis.' },
  ],
  arqueas: [
    { icono: '♨️', titulo: 'Aguas muy calientes', texto: 'Algunas viven en fuentes termales a temperaturas altísimas.' },
    { icono: '🧂', titulo: 'Lugares muy salados', texto: 'Las halófilas viven en salinas y lagos con mucha sal.' },
    { icono: '🫧', titulo: 'Sin oxígeno', texto: 'Las metanógenas viven en pantanos y en el intestino de animales, y producen metano.' },
    { icono: '🌍', titulo: 'También en lugares comunes', texto: 'No solo viven en lo extremo: también están en el suelo y en el mar.' },
  ],
}

export function ExploradorBacterias({ modo = 'formas' }: { modo?: 'formas' | 'donde' }) {
  const [m, setM] = useState(modo)
  const [f, setF] = useState<Forma>('coco')
  const [g, setG] = useState<'bacterias' | 'arqueas'>('bacterias')
  const forma = FORMAS.find((x) => x.id === f)!
  return (
    <PantallaCompleta>
      <Pestanas valor={m} onCambio={setM} etiqueta="Qué explorar" opciones={[['formas', 'Formas'], ['donde', 'Dónde viven']]} />
      {m === 'formas' ? (
        <div>
          <VisorZoom etiqueta={`Bacterias en forma de ${forma.nombre.toLowerCase()}`} alto="aspect-[2/1]">
            <Lienzo etiqueta={`Bacterias en forma de ${forma.nombre.toLowerCase()}`}>
              <g transform="translate(200 150) scale(1.5)">
                <FormaBacteria forma={f} />
              </g>
            </Lienzo>
          </VisorZoom>
          <div role="group" aria-label="Formas" className="mt-3 flex flex-wrap gap-2">
            {FORMAS.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={f === x.id}
                onClick={() => setF(x.id)}
                className="min-h-10 rounded-full border border-[var(--acento)] px-3 text-sm font-semibold text-[var(--acento)] aria-pressed:bg-[var(--acento)] aria-pressed:text-white"
              >
                {x.nombre}
              </button>
            ))}
          </div>
          <div aria-live="polite" className="mt-2 rounded-xl bg-[var(--fondo)] p-3 text-sm">
            <p className="font-semibold">{forma.nombre}</p>
            <p>{forma.dato}</p>
            <p className="mt-1">
              <span className="font-semibold">Ejemplos: </span>
              {forma.ejemplo}
            </p>
          </div>
          <Nota>Las formas son una manera de reconocerlas al microscopio. Esquemas sin escala.</Nota>
        </div>
      ) : (
        <div>
          <Pestanas valor={g} onCambio={setG} etiqueta="Grupo" opciones={[['bacterias', 'Bacterias'], ['arqueas', 'Arqueas']]} />
          <ul className="grid gap-2 sm:grid-cols-2">
            {HOGARES[g].map((h) => (
              <li key={h.titulo} className="rounded-xl border border-[var(--linea)] bg-[var(--tarjeta)] p-3 text-sm">
                <p className="font-semibold">
                  <span aria-hidden="true">{h.icono} </span>
                  {h.titulo}
                </p>
                <p>{h.texto}</p>
              </li>
            ))}
          </ul>
          <Nota>Las dos son procariotas: sin núcleo. Se distinguen por su química y su historia evolutiva, no por cómo se ven.</Nota>
        </div>
      )}
    </PantallaCompleta>
  )
}

/* ── 4. Galería de células especializadas ─────────────────────────────────── */

interface Especial {
  id: Especializada
  nombre: string
  donde: string
  forma: string
  funcion: string
  opciones: string[]
  correcta: number
}
const ESPECIALES: Especial[] = [
  { id: 'neurona', nombre: 'Neurona', donde: 'sistema nervioso', forma: 'ramas cortas y una prolongación larga (axón)', funcion: 'Recibe y transmite señales nerviosas, a veces a gran distancia.', opciones: ['Transportar oxígeno', 'Recibir y transmitir señales', 'Absorber agua'], correcta: 1 },
  { id: 'globulo', nombre: 'Glóbulo rojo', donde: 'sangre', forma: 'disco aplanado, sin núcleo en los mamíferos', funcion: 'Transporta oxígeno gracias a la hemoglobina; su forma es flexible para pasar por vasos muy finos.', opciones: ['Contraerse', 'Defender el cuerpo', 'Transportar oxígeno'], correcta: 2 },
  { id: 'muscular', nombre: 'Célula muscular', donde: 'músculos', forma: 'alargada, con fibras y muchas mitocondrias', funcion: 'Se contrae y se relaja para producir movimiento.', opciones: ['Contraerse para mover el cuerpo', 'Guardar información genética', 'Hacer fotosíntesis'], correcta: 0 },
  { id: 'espermatozoide', nombre: 'Espermatozoide', donde: 'reproducción animal', forma: 'cabeza con ADN y cola larga (flagelo)', funcion: 'Nada con su cola hasta el óvulo para llevar el ADN del padre.', opciones: ['Absorber nutrientes', 'Nadar hasta el óvulo', 'Transmitir señales'], correcta: 1 },
  { id: 'epitelial', nombre: 'Célula del epitelio intestinal', donde: 'intestino delgado', forma: 'alta, con microvellosidades en la parte superior', funcion: 'Las microvellosidades aumentan la superficie para absorber más nutrientes.', opciones: ['Absorber nutrientes', 'Producir movimiento', 'Transportar oxígeno'], correcta: 0 },
  { id: 'pelo', nombre: 'Célula del pelo de la raíz', donde: 'raíz de una planta', forma: 'tiene una prolongación muy larga y delgada', funcion: 'Esa prolongación aumenta la superficie para absorber agua y sales del suelo.', opciones: ['Hacer fotosíntesis', 'Absorber agua y sales', 'Defenderse'], correcta: 1 },
]

export function GaleriaEspecializadas() {
  const [sel, setSel] = useState(0)
  const [resp, setResp] = useState<(number | null)[]>(ESPECIALES.map(() => null))
  const e = ESPECIALES[sel]
  const elegida = resp[sel]
  useFlechas((dir) => {
    setSel((x) => Math.max(0, Math.min(ESPECIALES.length - 1, x + dir)))
    return true
  })
  return (
    <PantallaCompleta conBoton>
      <VisorZoom etiqueta={`Dibujo de ${e.nombre.toLowerCase()}`} alto="aspect-[2/1]">
        <Lienzo etiqueta={`Dibujo de ${e.nombre.toLowerCase()}`}>
          <g transform="translate(200 150) scale(1.35)">
            <CelulaEspecial id={e.id} />
          </g>
        </Lienzo>
      </VisorZoom>
      <div role="group" aria-label="Células especializadas" className="mt-3 flex flex-wrap gap-2">
        {ESPECIALES.map((x, k) => (
          <button
            key={x.id}
            type="button"
            aria-pressed={sel === k}
            onClick={() => setSel(k)}
            className="min-h-10 rounded-full border border-[var(--linea)] px-3 text-sm font-semibold aria-pressed:border-[var(--acento)] aria-pressed:bg-[var(--acento-suave)]/50"
          >
            {x.nombre}
            {resp[k] !== null && <span aria-hidden="true">{resp[k] === x.correcta ? ' ✓' : ' ✗'}</span>}
          </button>
        ))}
      </div>
      <div className="mt-3 rounded-xl bg-[var(--fondo)] p-3 text-sm">
        <p className="font-semibold">{e.nombre}</p>
        <p>
          <span className="font-semibold">Dónde: </span>
          {e.donde}. <span className="font-semibold">Forma: </span>
          {e.forma}.
        </p>
        <p className="mt-2 font-semibold">Mira su forma: ¿para qué le sirve?</p>
        <div role="group" aria-label="Opciones" className="mt-1 flex flex-wrap gap-2">
          {e.opciones.map((o, k) => {
            const marca = elegida === null ? '' : k === e.correcta ? 'border-green-700 bg-[var(--acento-suave)]/40' : k === elegida ? 'border-red-700' : 'opacity-60'
            return (
              <button
                key={o}
                type="button"
                disabled={elegida === e.correcta}
                onClick={() => setResp((r) => r.map((v, i) => (i === sel ? k : v)))}
                className={`min-h-10 rounded-lg border-2 border-[var(--linea)] px-3 text-sm font-semibold enabled:hover:border-[var(--acento)] ${marca}`}
              >
                {o}
              </button>
            )
          })}
        </div>
        <p aria-live="polite" className="mt-2 min-h-[2.5rem]">
          {elegida === null ? <span className="text-[var(--suave)]">Elige una opción. Con ← → cambias de célula.</span> : elegida === e.correcta ? <><span className="font-semibold">¡Eso es!</span> {e.funcion}</> : <><span className="font-semibold">Todavía no.</span> Fíjate en la forma y piensa qué ventaja da.</>}
        </p>
      </div>
      <Nota>Casi todas tienen el mismo ADN que el resto de células de su organismo; cambian los genes que usan (el glóbulo rojo maduro de mamífero perdió su núcleo). Dibujos sin escala.</Nota>
    </PantallaCompleta>
  )
}
