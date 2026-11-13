import { useEffect, useRef, useState } from 'react'
import PantallaCompleta from '../PantallaCompleta.tsx'
import { Lienzo, T, TINTA } from '../ilustraciones/Dibujo.tsx'
import { useFlechas } from '../../lib/flechasDiagrama.ts'

// «¿Y si falla un nivel?» (subtema 1.2): la anemia falciforme, nivel por nivel.
// Un cambio en una molécula sube hasta el organismo y la población. El estudiante predice cada paso.
// Sigue el hilo de la gota de sangre. Texto y dibujos en borrador (ver VERIFICAR.md).

interface Paso {
  nivel: string
  titulo: string
  /** qué se ve en el dibujo: [sin el cambio, con el cambio] */
  pie: [string, string]
  /** rótulos del interruptor del dibujo */
  lados?: [string, string]
  pregunta?: string
  opciones?: string[]
  correcta?: number
  explica: string
}

const PASOS: Paso[] = [
  {
    nivel: 'Molécula',
    titulo: 'Una sola pieza distinta',
    pie: ['En la posición 6 hay un ácido glutámico: le gusta el agua.', 'En la posición 6 hay una valina: huye del agua y se pega a otras.'],
    pregunta: 'La hemoglobina es una cadena de piezas (aminoácidos). Cambia 1 sola de las 146 de una de sus cadenas. ¿Importará?',
    opciones: ['No: es una pieza entre cientos', 'Sí: puede cambiar cómo se comporta toda la proteína', 'Solo si cambiara la mitad de las piezas'],
    correcta: 1,
    explica: 'Esa pieza queda en la superficie y vuelve «pegajosa» a la hemoglobina. Todo empieza por una sola letra cambiada en el ADN.',
  },
  {
    nivel: 'Macromolécula',
    titulo: 'Las hemoglobinas se pegan',
    pie: ['Cada hemoglobina va suelta y lleva su oxígeno.', 'Al soltar el oxígeno, se pegan unas a otras en fibras largas y rígidas.'],
    pregunta: 'Dentro del glóbulo rojo se forman fibras largas y rígidas. ¿Qué le pasará al glóbulo?',
    opciones: ['Se deforma y se pone rígido', 'Se divide en dos', 'Fabrica más hemoglobina'],
    correcta: 0,
    explica: 'Las fibras lo estiran desde adentro hasta darle forma de hoz o media luna.',
  },
  {
    nivel: 'Célula',
    titulo: 'El glóbulo rojo cambia de forma',
    pie: ['Disco flexible: se dobla para pasar por vasos muy finos. Dura unos 120 días.', 'Forma de hoz, rígido y frágil: se rompe a los 10 o 20 días.'],
    pregunta: 'Los glóbulos en hoz se rompen mucho antes de tiempo. ¿Qué le pasa a la sangre?',
    opciones: ['Se vuelve más roja', 'Nada: los glóbulos blancos los reemplazan', 'Tiene menos glóbulos rojos y lleva menos oxígeno'],
    correcta: 2,
    explica: 'Faltan glóbulos rojos: eso es la anemia. Y los que quedan en hoz no se doblan bien.',
  },
  {
    nivel: 'Tejido',
    titulo: 'La sangre lleva menos oxígeno',
    pie: ['Muchos glóbulos rojos que fluyen sin problema.', 'Pocos glóbulos rojos, y varios en hoz.'],
    pregunta: 'Los glóbulos en hoz no se doblan y se atascan en los vasos más finos. ¿Qué les pasa a los órganos que esperan esa sangre?',
    opciones: ['Reciben menos oxígeno y se van dañando', 'Fabrican su propio oxígeno', 'Crecen para compensar'],
    correcta: 0,
    explica: 'Sin riego no llega oxígeno. Les puede pasar al bazo, los huesos, los pulmones o los riñones.',
  },
  {
    nivel: 'Órgano',
    titulo: 'Vasos tapados, órganos sin riego',
    pie: ['La sangre pasa por el vaso fino y el órgano recibe oxígeno.', 'Los glóbulos en hoz tapan el vaso: al órgano le llega poco oxígeno.'],
    pregunta: 'Con poca sangre útil y órganos lastimados, ¿cómo estará la persona?',
    opciones: ['No nota nada: el cuerpo se adapta', 'Cansancio, crisis de dolor y más infecciones', 'Solo le cambia el color de la piel'],
    correcta: 1,
    explica: 'El cansancio viene de la anemia; el dolor, de los vasos tapados; las infecciones, del bazo dañado.',
  },
  {
    nivel: 'Organismo',
    titulo: 'Una enfermedad de todo el cuerpo',
    pie: ['Todos los niveles funcionan: la persona está sana.', 'Anemia falciforme: cansancio, dolor e infecciones frecuentes.'],
    pregunta: 'Se hereda: enferma quien recibe dos copias del gen cambiado. Quien recibe una sola casi nunca enferma y resiste mejor la malaria. ¿Dónde será más común esa variante?',
    opciones: ['En las regiones frías', 'Igual en todo el mundo', 'En las regiones donde hay malaria'],
    correcta: 2,
    explica: 'Donde hay malaria, quienes llevan una copia sobreviven más y la pasan a sus hijos.',
  },
  {
    nivel: 'Más allá',
    titulo: 'Hasta la población',
    lados: ['Sin malaria', 'Con malaria'],
    pie: ['Región sin malaria: muy pocas personas llevan la variante.', 'Región con malaria: muchas más personas llevan una copia.'],
    explica: 'Un cambio en una molécula subió nivel por nivel hasta la población. Los niveles no son una lista: cada uno depende del anterior. Hoy la anemia falciforme tiene tratamiento médico.',
  },
]

const ROJO = '#d9534a'
const ROJO_B = '#8f2f29'

function Disco({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse rx="16" ry="12" fill={ROJO} stroke={ROJO_B} strokeWidth="1.6" />
      <ellipse rx="7" ry="4.5" fill="#e98a82" />
    </g>
  )
}
function Hoz({ x, y, g = 0, s = 1 }: { x: number; y: number; g?: number; s?: number }) {
  return <path transform={`translate(${x} ${y}) rotate(${g}) scale(${s})`} d="M -22 -6 Q 0 -22 22 -4 Q 2 -6 -14 12 Q -24 6 -22 -6 Z" fill="#b8473f" stroke={ROJO_B} strokeWidth="1.6" strokeLinejoin="round" />
}
/** Una hemoglobina: cuatro partes juntas. */
function Hb({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {[[-6, -6], [6, -6], [-6, 6], [6, 6]].map(([a, b], i) => (
        <circle key={i} cx={a} cy={b} r="7" fill={i % 3 ? '#e59a6a' : '#d97f4a'} stroke="#8a4a22" strokeWidth="1.2" />
      ))}
    </g>
  )
}

function Escena({ paso, cambio }: { paso: number; cambio: boolean }) {
  if (paso === 0) {
    return (
      <>
        <T x={200} y={40} s={13} b>Un trozo de una cadena de la hemoglobina</T>
        <path d="M 30 150 Q 80 120 130 150 T 230 150 T 330 150 T 380 150" fill="none" stroke={TINTA} strokeWidth="2" />
        {Array.from({ length: 9 }, (_, i) => {
          const x = 40 + i * 40
          const y = 150 + (i % 2 ? 9 : -9)
          const es = i === 5
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={es ? 17 : 13} fill={es ? (cambio ? '#b8473f' : '#6fb7a8') : '#f2c77a'} stroke={TINTA} strokeWidth={es ? 2.6 : 1.6} />
              <T x={x} y={y + 4} s={es ? 11 : 10} b={es} c={es ? '#fff' : TINTA}>{es ? (cambio ? 'Val' : 'Glu') : String(i + 1)}</T>
            </g>
          )
        })}
        <path d="M 240 196 v 28" stroke={TINTA} strokeWidth="1.8" />
        <T x={240} y={242} s={12} b>{cambio ? 'Valina' : 'Ácido glutámico'}</T>
        <T x={240} y={258} s={11}>pieza número 6</T>
      </>
    )
  }
  if (paso === 1) {
    const sueltas: [number, number][] = [[70, 80], [150, 60], [240, 90], [330, 70], [100, 160], [200, 170], [300, 160], [60, 240], [160, 235], [260, 245], [345, 230]]
    return (
      <>
        <T x={200} y={28} s={13} b>{cambio ? 'Fibras de hemoglobina' : 'Hemoglobinas sueltas'}</T>
        {cambio
          ? [0, 1, 2].flatMap((f) => Array.from({ length: 11 }, (_, i) => <Hb key={`${f}-${i}`} x={45 + i * 31} y={95 + f * 62 + (i - 5) * 5} />))
          : sueltas.map(([x, y], i) => (
              <g key={i}>
                <Hb x={x} y={y} />
                <circle cx={x + 15} cy={y - 13} r="4.5" fill="#5d9be0" stroke="#2f5f9a" strokeWidth="1" />
              </g>
            ))}
        <T x={200} y={290} s={11}>{cambio ? 'ya soltaron el oxígeno y se pegaron' : 'el punto azul es el oxígeno que llevan'}</T>
      </>
    )
  }
  if (paso === 2) {
    return (
      <>
        <T x={200} y={36} s={13} b>{cambio ? 'Glóbulo rojo en hoz' : 'Glóbulo rojo sano'}</T>
        {cambio ? (
          <>
            <Hoz x={200} y={160} s={5.4} g={-8} />
            {[0, 1, 2].map((i) => (
              <path key={i} d={`M ${120 + i * 6} ${150 + i * 9} Q 200 ${96 + i * 10} ${286 - i * 6} ${146 + i * 6}`} fill="none" stroke="#f3c9a5" strokeWidth="2.2" strokeDasharray="7 4" />
            ))}
            <T x={200} y={262} s={12}>las fibras lo estiran por dentro</T>
          </>
        ) : (
          <>
            <Disco x={200} y={155} s={6.2} />
            <T x={200} y={262} s={12}>un disco hundido en el centro</T>
          </>
        )}
      </>
    )
  }
  if (paso === 3) {
    const sanos: [number, number][] = [[40, 120], [85, 165], [120, 110], [160, 185], [195, 135], [235, 175], [270, 115], [305, 160], [345, 125], [370, 185], [60, 190], [140, 150], [215, 100], [290, 195]]
    return (
      <>
        <T x={200} y={40} s={13} b>Sangre dentro de un vaso</T>
        <rect x="0" y="84" width="400" height="132" fill="#f8dcd6" />
        <path d="M 0 84 H 400 M 0 216 H 400" stroke="#b05a5a" strokeWidth="5" />
        {cambio ? (
          <>
            {([[60, 130], [170, 180], [250, 115], [350, 170]] as [number, number][]).map(([x, y], i) => <Disco key={i} x={x} y={y} />)}
            <Hoz x={110} y={170} g={20} />
            <Hoz x={205} y={125} g={-30} />
            <Hoz x={300} y={150} g={70} />
            <Hoz x={365} y={115} g={10} />
          </>
        ) : (
          sanos.map(([x, y], i) => <Disco key={i} x={x} y={y} />)
        )}
        <T x={200} y={252} s={12}>{cambio ? 'menos glóbulos rojos = anemia' : 'glóbulos rojos de sobra'}</T>
      </>
    )
  }
  if (paso === 4) {
    return (
      <>
        <T x={120} y={36} s={13} b>Vaso fino hacia un órgano</T>
        <path d="M 0 104 H 150 L 190 137 H 300 M 0 196 H 150 L 190 163 H 300" fill="none" stroke="#b05a5a" strokeWidth="5" strokeLinejoin="round" />
        <path d="M 0 106 H 149 L 189 139 H 300 V 161 H 189 L 149 194 H 0 Z" fill="#f8dcd6" />
        <circle cx="340" cy="150" r="48" fill={cambio ? '#c9c2bb' : '#f0a79c'} stroke={cambio ? '#8a8078' : ROJO_B} strokeWidth="3" />
        <T x={340} y={147} s={12} b>Órgano</T>
        <T x={340} y={163} s={10.5}>{cambio ? 'poco oxígeno' : 'con oxígeno'}</T>
        {cambio ? (
          <>
            <Disco x={40} y={150} />
            <Hoz x={100} y={128} g={15} />
            <Hoz x={135} y={168} g={-40} />
            <Hoz x={168} y={146} g={80} s={0.9} />
            <Hoz x={196} y={150} g={10} s={0.6} />
            <T x={170} y={232} s={12} b c="#b3261e">atasco</T>
          </>
        ) : (
          <>
            {([[35, 130], [80, 170], [125, 140]] as [number, number][]).map(([x, y], i) => <Disco key={i} x={x} y={y} />)}
            {[205, 240, 275].map((x) => <Disco key={x} x={x} y={150} s={0.62} />)}
            <T x={170} y={232} s={12}>pasan doblándose, de uno en uno</T>
          </>
        )}
      </>
    )
  }
  if (paso === 5) {
    const marcas: [number, number, string][] = [[200, 120, 'Cansancio: llega poco oxígeno'], [186, 156, 'Bazo dañado: más infecciones'], [214, 232, 'Crisis de dolor en huesos']]
    return (
      <>
        <g transform="translate(-90 0)">
          <circle cx="200" cy="58" r="24" fill="#f2c9a0" stroke={TINTA} strokeWidth="2.2" />
          <rect x="170" y="88" width="60" height="96" rx="20" fill={cambio ? '#d8d2c8' : '#8fc7bb'} stroke={TINTA} strokeWidth="2.2" />
          <path d="M 172 104 L 140 160 M 228 104 L 260 160 M 186 184 L 180 268 M 214 184 L 220 268" stroke={TINTA} strokeWidth="9" strokeLinecap="round" />
          {cambio && marcas.map(([x, y]) => <circle key={y} cx={x} cy={y} r="7" fill="#b3261e" stroke="#fff" strokeWidth="2" />)}
        </g>
        {cambio ? (
          marcas.map(([x, y, t]) => (
            <g key={t}>
              <path d={`M ${x - 80} ${y} H 196`} stroke="#b3261e" strokeWidth="1.5" strokeDasharray="4 3" />
              <T x={202} y={y + 4} s={11.5} a="start">{t}</T>
            </g>
          ))
        ) : (
          <T x={290} y={150} s={12.5} b>Persona sana</T>
        )}
      </>
    )
  }
  // población: quiénes llevan una copia de la variante (esquema, sin cifras reales)
  const llevan = cambio ? [1, 4, 8, 11, 14, 17, 21] : [9]
  return (
    <>
      <T x={200} y={36} s={13} b>{cambio ? 'Región con malaria' : 'Región sin malaria'}</T>
      {Array.from({ length: 24 }, (_, i) => {
        const x = 62 + (i % 8) * 40
        const y = 86 + Math.floor(i / 8) * 58
        const si = llevan.includes(i)
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="9" fill={si ? '#b8473f' : '#f2c9a0'} stroke={TINTA} strokeWidth="1.6" />
            <rect x={x - 10} y={y + 11} width="20" height="24" rx="8" fill={si ? '#b8473f' : '#8fc7bb'} stroke={TINTA} strokeWidth="1.6" />
          </g>
        )
      })}
      <circle cx="96" cy="270" r="7" fill="#b8473f" stroke={TINTA} strokeWidth="1.4" />
      <T x={110} y={274} s={11.5} a="start">lleva una copia de la variante · esquema, no son cifras reales</T>
    </>
  )
}

export default function NivelesFalla() {
  const [paso, setPaso] = useState(0)
  const [cambio, setCambio] = useState(true)
  const [resp, setResp] = useState<(number | null)[]>(PASOS.map(() => null))
  const p = PASOS[paso]
  const elegida = resp[paso]
  const resuelto = !p.opciones || elegida === p.correcta
  const lados = p.lados ?? ['Sano', 'Con el cambio']

  const ir = (i: number) => setPaso(Math.max(0, Math.min(PASOS.length - 1, i)))
  const responder = (i: number) => {
    if (!p.opciones || resuelto || i >= p.opciones.length) return
    setResp((r) => r.map((v, k) => (k === paso ? i : v)))
  }
  useFlechas((dir) => {
    ir(paso + dir)
    return true
  })
  // teclas 1–3 responden
  const responderRef = useRef(responder)
  responderRef.current = responder
  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      const t = e.target as HTMLElement | null
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return
      const n = Number(e.key)
      if (n >= 1 && n <= 3) responderRef.current(n - 1)
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [])

  return (
    <PantallaCompleta conBoton>
      <p className="text-sm">Los niveles dependen unos de otros. Sigue lo que pasa cuando cambia una sola pieza de una molécula de la sangre: la hemoglobina. Con ← → cambias de nivel.</p>
      <ol aria-label="Niveles" className="mt-3 flex flex-wrap items-center gap-1 text-sm font-semibold">
        {PASOS.map((x, i) => (
          <li key={x.nivel} className="flex items-center gap-1">
            {i > 0 && <span aria-hidden="true" className={i <= paso ? 'text-red-700' : 'text-[var(--suave)]'}>→</span>}
            <button
              type="button"
              aria-current={i === paso ? 'step' : undefined}
              onClick={() => ir(i)}
              className={`min-h-9 rounded-full border-2 px-3 ${i === paso ? 'border-red-700 bg-red-700 text-white' : i < paso ? 'border-red-700 text-red-800' : 'border-[var(--linea)] text-[var(--suave)]'}`}
            >
              {x.nivel}
            </button>
          </li>
        ))}
      </ol>
      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <div>
          <div className="aspect-[4/3] max-h-[var(--alto-visor,38dvh)] w-full overflow-hidden rounded-xl border border-[var(--linea)]">
            <Lienzo etiqueta={`${p.titulo}. ${p.pie[cambio ? 1 : 0]}`}>
              <Escena paso={paso} cambio={cambio} />
            </Lienzo>
          </div>
          <div role="group" aria-label="Qué mostrar en el dibujo" className="mt-2 flex gap-2">
            {lados.map((t, i) => (
              <button
                key={t}
                type="button"
                aria-pressed={cambio === (i === 1)}
                onClick={() => setCambio(i === 1)}
                className="min-h-10 flex-1 rounded-lg border border-[var(--linea)] px-3 text-sm font-semibold aria-pressed:border-[var(--acento)] aria-pressed:bg-[var(--acento-suave)]/40"
              >
                {t}
              </button>
            ))}
          </div>
          <p aria-live="polite" className="mt-1 min-h-10 text-sm text-[var(--suave)]">{p.pie[cambio ? 1 : 0]}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-red-800">{p.nivel}</p>
          <p className="text-lg font-bold">{p.titulo}</p>
          {p.opciones ? (
            <>
              <p className="mt-2 text-sm font-semibold">{p.pregunta}</p>
              <div role="group" aria-label="Opciones" className="mt-2 flex flex-col gap-2">
                {p.opciones.map((o, i) => {
                  const marca = elegida === null ? '' : i === p.correcta && resuelto ? 'border-green-700 bg-[var(--acento-suave)]/40' : i === elegida ? 'border-red-700' : 'opacity-60'
                  return (
                    <button key={o} type="button" disabled={resuelto} onClick={() => responder(i)} className={`min-h-10 rounded-lg border-2 border-[var(--linea)] px-3 py-2 text-left text-sm enabled:hover:border-[var(--acento)] ${marca}`}>
                      {i + 1} · {o}
                    </button>
                  )
                })}
              </div>
              <div aria-live="polite" className="mt-2 min-h-[4.5rem] rounded-xl bg-[var(--fondo)] p-3 text-sm">
                {elegida === null ? (
                  <p className="text-[var(--suave)]">Haz tu predicción con un toque o con las teclas 1 a 3.</p>
                ) : resuelto ? (
                  <>
                    <p>
                      <span className="font-semibold">¡Eso es!</span> {p.explica}
                    </p>
                    <button type="button" data-principal onClick={() => ir(paso + 1)} className="mt-2 min-h-10 rounded-full bg-[var(--acento)] px-5 text-sm font-bold text-white">
                      Subir a: {PASOS[paso + 1].nivel.toLowerCase()} ›
                    </button>
                  </>
                ) : (
                  <p>
                    <span className="font-semibold">Todavía no.</span> Mira el dibujo con y sin el cambio e inténtalo otra vez.
                  </p>
                )}
              </div>
            </>
          ) : (
            <>
              <p className="mt-2 rounded-xl bg-[var(--fondo)] p-3 text-sm">{p.explica}</p>
              <button type="button" data-principal onClick={() => ir(0)} className="mt-2 min-h-10 rounded-full border border-[var(--acento)] px-5 text-sm font-bold text-[var(--acento)]">
                Volver al comienzo
              </button>
            </>
          )}
        </div>
      </div>
      <p className="mt-2 text-xs text-[var(--suave)]">Dibujos esquemáticos, sin escala.</p>
    </PantallaCompleta>
  )
}
