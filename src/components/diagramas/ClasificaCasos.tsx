import { useEffect, useRef, useState } from 'react'
import PantallaCompleta from '../PantallaCompleta.tsx'
import { useFlechas } from '../../lib/flechasDiagrama.ts'

// Juego reutilizable: llega un caso y se elige su categoría (teclas 1–4). Ronda de casos al azar,
// repaso de fallos y mejor marca guardada en `clave`.

export interface Caso {
  texto: string
  r: number
  por: string
}

function barajar<X>(a: X[]): X[] {
  const b = [...a]
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[b[i], b[j]] = [b[j], b[i]]
  }
  return b
}

export default function ClasificaCasos({ titulo, opciones, casos, clave, ronda = 10, pista }: { titulo: string; opciones: string[]; casos: Caso[]; clave: string; ronda?: number; pista: string }) {
  const nueva = () => barajar(casos).slice(0, ronda)
  const [cola, setCola] = useState(nueva)
  const [i, setI] = useState(0)
  const [elegida, setElegida] = useState<number | null>(null)
  const [aciertos, setAciertos] = useState(0)
  const [fallados, setFallados] = useState<string[]>([])
  const [fin, setFin] = useState(false)
  const [mejor, setMejor] = useState(() => {
    try {
      return Number(localStorage.getItem(clave)) || 0
    } catch {
      return 0
    }
  })
  const c = cola[i]
  const responder = (n: number) => {
    if (fin || elegida !== null) return
    setElegida(n)
    if (n === c.r) setAciertos((a) => a + 1)
    else setFallados((f) => [...f, c.texto])
  }
  const siguiente = () => {
    if (elegida === null || fin) return
    if (i >= cola.length - 1) {
      setFin(true)
      if (aciertos > mejor) {
        setMejor(aciertos)
        try {
          localStorage.setItem(clave, String(aciertos))
        } catch {
          /* sin almacenamiento */
        }
      }
    } else {
      setI(i + 1)
      setElegida(null)
    }
  }
  const otraVez = () => {
    setCola(nueva())
    setI(0)
    setElegida(null)
    setAciertos(0)
    setFallados([])
    setFin(false)
  }
  const ref = useRef(responder)
  ref.current = responder
  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      const n = Number(e.key)
      if (n >= 1 && n <= opciones.length) ref.current(n - 1)
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [opciones.length])
  useFlechas((dir) => {
    if (dir === 1) siguiente()
    return true
  })

  return (
    <PantallaCompleta conBoton>
      <p className="mb-2 text-base font-bold">{titulo}</p>
      {fin ? (
        <div aria-live="polite">
          <p className="text-lg font-bold">
            {aciertos} de {cola.length}
            {aciertos >= mejor && aciertos > 0 ? ' · ¡tu mejor marca!' : ` · tu mejor marca: ${mejor}`}
          </p>
          {fallados.length > 0 && (
            <div className="mt-2 text-sm">
              <p className="font-semibold">Para repasar:</p>
              <ul className="list-disc pl-5">
                {fallados.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          )}
          <p className="mt-2 text-sm">{pista}</p>
          <button type="button" data-principal onClick={otraVez} className="mt-3 min-h-11 rounded-full bg-[var(--acento)] px-6 font-bold text-[var(--sobre-acento)]">
            Jugar otra vez
          </button>
        </div>
      ) : (
        <>
          <p className="text-sm font-semibold">
            Caso {i + 1} de {cola.length} · {aciertos} aciertos
          </p>
          <div className="mt-2 rounded-xl border-2 border-[var(--linea)] p-4 text-center text-xl font-semibold">{c.texto}</div>
          <div role="group" aria-label="Respuestas" className="mt-3 grid gap-2" style={{ gridTemplateColumns: `repeat(${opciones.length}, minmax(0, 1fr))` }}>
            {opciones.map((o, n) => (
              <button key={o} type="button" disabled={elegida !== null} onClick={() => responder(n)} className={`min-h-12 rounded-lg border-2 px-2 text-base font-semibold ${elegida === null ? 'border-[var(--linea)] hover:border-[var(--acento)]' : n === c.r ? 'border-green-700 bg-[var(--acento-suave)]/40 dark:border-green-400' : n === elegida ? 'border-red-700 dark:border-red-400' : 'border-[var(--linea)] opacity-60'}`}>
                {n + 1} · {o}
              </button>
            ))}
          </div>
          <div aria-live="polite" className="mt-3 min-h-[3.5rem] rounded-xl bg-[var(--fondo)] p-3 text-sm">
            {elegida === null ? (
              <p className="text-[var(--suave)]">Elige con un toque o con las teclas 1 a {opciones.length}.</p>
            ) : (
              <>
                <p>
                  <span className="font-semibold">{elegida === c.r ? '¡Correcto!' : `Era: ${opciones[c.r].toLowerCase()}.`}</span> {c.por}
                </p>
                <button type="button" data-principal onClick={siguiente} className="mt-2 min-h-10 rounded-full bg-[var(--acento)] px-5 text-sm font-bold text-[var(--sobre-acento)]">
                  {i >= cola.length - 1 ? 'Ver resultado' : 'Siguiente ›'}
                </button>
              </>
            )}
          </div>
        </>
      )}
    </PantallaCompleta>
  )
}

/* ── Bancos de casos del 4.3 ───────────────────────────────────────────────── */

export const CASOS_OXIGENO: Caso[] = [
  { texto: 'Caminas tranquilo al colegio.', r: 0, por: 'Llega suficiente oxígeno: el músculo respira.' },
  { texto: 'Corres 100 metros lo más rápido que puedes.', r: 1, por: 'El oxígeno no alcanza y el músculo fermenta.' },
  { texto: 'La masa del pan crece en la cocina.', r: 1, por: 'La levadura fermenta y suelta CO₂.' },
  { texto: 'Se obtienen unos 30 ATP por cada glucosa.', r: 0, por: 'La respiración saca mucha más energía.' },
  { texto: 'Se obtienen solo 2 ATP por cada glucosa.', r: 1, por: 'La fermentación se queda en la glucólisis.' },
  { texto: 'Trabaja la mitocondria.', r: 0, por: 'La mitocondria necesita oxígeno.' },
  { texto: 'Se produce ácido láctico.', r: 1, por: 'Es la fermentación del músculo.' },
  { texto: 'Se hace yogur a partir de leche.', r: 1, por: 'Las bacterias del yogur fermentan.' },
  { texto: 'Sale CO₂ y agua, que exhalas.', r: 0, por: 'Son los productos de la respiración.' },
  { texto: 'Se hace chicha o vino.', r: 1, por: 'La levadura fermenta y produce alcohol.' },
  { texto: 'Un pájaro vuela por horas en su migración.', r: 0, por: 'Un esfuerzo largo y sostenido necesita respiración.' },
  { texto: 'Una bacteria vive en el fondo de un pantano sin aire.', r: 1, por: 'Sin oxígeno, obtiene energía fermentando.' },
]

export const CASOS_MUERTE: Caso[] = [
  { texto: 'Se separan los dedos del embrión.', r: 0, por: 'Las células entre los dedos mueren por orden.' },
  { texto: 'Te quemas la mano con la olla.', r: 1, por: 'El daño mata las células de golpe.' },
  { texto: 'El renacuajo pierde la cola al volverse rana.', r: 0, por: 'Es una muerte programada del desarrollo.' },
  { texto: 'Un infarto deja sin sangre una parte del corazón.', r: 1, por: 'Sin oxígeno, las células mueren por daño.' },
  { texto: 'Una célula con el ADN muy dañado se elimina sola.', r: 0, por: 'Es una defensa contra el cáncer.' },
  { texto: 'La célula se hincha y revienta.', r: 1, por: 'Así muere en la necrosis.' },
  { texto: 'La célula se encoge y se parte en pedacitos.', r: 0, por: 'Así muere en la apoptosis.' },
  { texto: 'El tejido se pone rojo, caliente e hinchado.', r: 1, por: 'La necrosis causa inflamación.' },
  { texto: 'Un macrófago se come los restos sin causar inflamación.', r: 0, por: 'Es la limpieza ordenada de la apoptosis.' },
  { texto: 'Una célula infectada por un virus se elimina a sí misma.', r: 0, por: 'Así evita que el virus se multiplique.' },
  { texto: 'Una mordedura de serpiente destruye el tejido.', r: 1, por: 'El veneno mata las células por daño.' },
]

/* ── Bancos de casos del tema 5 ────────────────────────────────────────────── */

export const CASOS_TEJIDOS: Caso[] = [
  { texto: 'Cubre el interior del intestino.', r: 0, por: 'Recubrir superficies es trabajo del epitelial.' },
  { texto: 'Forma los huesos.', r: 1, por: 'El hueso es un tejido conectivo con matriz dura.' },
  { texto: 'Hace latir el corazón.', r: 2, por: 'Es músculo cardíaco.' },
  { texto: 'Lleva la orden del cerebro a la mano.', r: 3, por: 'Las neuronas transmiten impulsos.' },
  { texto: 'La sangre que corre por las venas.', r: 1, por: 'La sangre es un conectivo con matriz líquida (plasma).' },
  { texto: 'La capa externa de la piel.', r: 0, por: 'La epidermis es un epitelio.' },
  { texto: 'Mueve la comida por el intestino.', r: 2, por: 'Es músculo liso.' },
  { texto: 'Guarda grasa bajo la piel.', r: 1, por: 'El tejido adiposo es conectivo.' },
  { texto: 'Te hace sentir el calor de una olla.', r: 3, por: 'Los receptores nerviosos captan el calor.' },
  { texto: 'Une el músculo con el hueso (tendón).', r: 1, por: 'Los tendones son conectivo con muchas fibras.' },
  { texto: 'Te permite levantar la mano cuando quieres.', r: 2, por: 'Es músculo esquelético, voluntario.' },
  { texto: 'Recubre por dentro los vasos sanguíneos.', r: 0, por: 'Es un epitelio muy delgado.' },
]

export const CASOS_REPRODUCCION: Caso[] = [
  { texto: 'Una bacteria se parte en dos.', r: 0, por: 'Bipartición: un solo progenitor.' },
  { texto: 'Una papa olvidada en la cocina echa brotes.', r: 0, por: 'El tubérculo produce una planta igual.' },
  { texto: 'Una abeja lleva polen de una flor a otra.', r: 1, por: 'Así se unen los gametos de dos plantas.' },
  { texto: 'Siembras un esqueje de yuca o de rosa.', r: 0, por: 'El pedazo de tallo da una planta igual.' },
  { texto: 'Nace un ternero de una vaca y un toro.', r: 1, por: 'Dos progenitores y fecundación.' },
  { texto: 'A una hidra le crece una yema que se suelta.', r: 0, por: 'Gemación: el hijo es una copia.' },
  { texto: 'Una gallina pone un huevo fecundado.', r: 1, por: 'Hubo unión de óvulo y espermatozoide.' },
  { texto: 'Una estrella de mar regenera un animal completo a partir de un brazo.', r: 0, por: 'Fragmentación: un solo progenitor.' },
  { texto: 'Los hijos son copias exactas del progenitor.', r: 0, por: 'La reproducción asexual produce clones.' },
  { texto: 'Los hijos son distintos entre sí y de sus padres.', r: 1, por: 'La meiosis y la fecundación crean variedad.' },
  { texto: 'Una semilla de mango germina.', r: 1, por: 'La semilla viene de una flor fecundada.' },
  { texto: 'Una levadura forma una yema que se separa.', r: 0, por: 'La levadura también se reproduce por gemación.' },
]
