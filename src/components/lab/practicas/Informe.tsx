import { useEffect, useState } from 'react'

// Práctica extra 1 (PLAN-LABORATORIOS.md): cuaderno e informe de laboratorio, práctica cero desde 6°.
// Ronda 1: armar el informe tocando sus partes en orden (las partes cambian con el grado).
// Ronda 2: encontrar los errores en un informe mal hecho (práctica de densidades).
// Fuente: guía de laboratorio de Química General (U. de Pamplona), práctica de cuaderno e informe.

type Parte = { t: string; x: string; desde: number }

const PARTES: Parte[] = [
  { t: 'Título y datos', x: 'Nombre de la práctica, integrantes, grado y fecha.', desde: 6 },
  { t: 'Objetivo', x: 'Qué se quiere averiguar, empezando con un verbo: «Determinar…», «Comparar…».', desde: 6 },
  { t: 'Marco teórico', x: 'Los conceptos que explican la práctica, con tus palabras.', desde: 11 },
  { t: 'Hipótesis', x: 'Lo que crees que va a pasar y por qué, escrito antes de medir.', desde: 9 },
  { t: 'Materiales y reactivos', x: 'Todo lo que se usó, con cantidades.', desde: 6 },
  { t: 'Procedimiento', x: 'Los pasos que se hicieron, en orden y en pasado.', desde: 6 },
  { t: 'Resultados', x: 'Datos medidos en tablas con unidades, gráficas y observaciones.', desde: 6 },
  { t: 'Análisis', x: 'Qué significan los datos, cálculos, comparación con la hipótesis y fuentes de error.', desde: 9 },
  { t: 'Conclusiones', x: 'La respuesta al objetivo, apoyada en los resultados.', desde: 6 },
  { t: 'Bibliografía', x: 'Libros y páginas consultados, con autor y año.', desde: 11 },
]

type Frase = { t: string; error?: string; desde?: number }
type Seccion = { s: string; frases: Frase[] }

const MAL: Seccion[] = [
  { s: 'Objetivo', frases: [{ t: 'Hacer la práctica de densidades y pasarla bien.', error: 'No es un objetivo medible: debería decir qué se quiere averiguar, p. ej. «Determinar la densidad de seis objetos».' }] },
  { s: 'Hipótesis', frases: [{ t: 'Como dio en los resultados, la piedra es más densa que el agua.', error: 'La hipótesis se escribe antes de medir; no puede apoyarse en los resultados.', desde: 9 }] },
  { s: 'Materiales', frases: [{ t: 'Balanza, probeta de 100 mL, agua, regla, seis objetos.' }] },
  {
    s: 'Procedimiento',
    frases: [
      { t: 'Pesamos cada objeto en la balanza.' },
      { t: 'Echamos agua en la probeta y metimos el objeto.', error: 'Falta cuánta agua había antes: sin el volumen inicial no se puede calcular el volumen desplazado.' },
    ],
  },
  {
    s: 'Resultados',
    frases: [
      { t: 'Piedra: masa 30, volumen 12.', error: 'Los datos no tienen unidades (g, mL). Sin unidades un número no dice nada.' },
      { t: 'Madera: 0,6 g/mL. Flota en el agua.' },
      { t: 'La tuerca nos dio 5 g/mL pero la borramos y pusimos 7,9 que es lo que dice el libro.', error: 'Nunca se cambia un dato medido por el «correcto»: se anota lo medido y se explica la diferencia en el análisis.' },
      { t: 'Gráfica de masa contra volumen, sin nombres en los ejes.', error: 'Una gráfica necesita título y ejes con nombre y unidades.', desde: 9 },
    ],
  },
  {
    s: 'Análisis',
    frases: [
      { t: 'La madera flota porque su densidad es menor que la del agua (1 g/mL).' },
      { t: 'Densidad de la piedra: 2,5 g/mL. El valor de la tabla es 2,7 g/mL; no calculamos el error.', error: 'En 11° se calcula el error porcentual: |2,5 − 2,7| / 2,7 × 100 ≈ 7 %, y se dice de dónde pudo salir.', desde: 11 },
      { t: 'Densidad del aluminio: 2,7037037 g/mL.', error: 'Demasiadas cifras: la balanza y la probeta no dan esa precisión. Basta 2,70 g/mL.', desde: 11 },
    ],
  },
  { s: 'Conclusiones', frases: [{ t: 'Nos gustó mucho la práctica y aprendimos bastante.', error: 'Eso es una opinión. La conclusión responde al objetivo con los datos: «La piedra y la tuerca son más densas que el agua; la madera y la vela, menos».' }] },
]

function mezclar<T>(a: T[]) {
  const b = [...a]
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[b[i], b[j]] = [b[j], b[i]]
  }
  return b
}

export default function Informe({ grado }: { grado: number }) {
  const [ronda, setRonda] = useState(0)
  const [puntos, setPuntos] = useState<number[]>([])
  const fin = (p: number) => { setPuntos((x) => [...x, p]); setRonda((r) => r + 1) }
  const nombres = ['Arma el informe', 'Encuentra los errores']
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap justify-center gap-2 text-sm">
        {nombres.map((n, k) => (
          <span key={n} className={`rounded-full border px-3 py-1 ${k === ronda ? 'border-[var(--acento)] font-semibold' : 'border-[var(--linea)] opacity-60'}`}>{k + 1}. {n}</span>
        ))}
      </div>
      {ronda === 0 && <Armar grado={grado} onFin={fin} />}
      {ronda === 1 && <Errores grado={grado} onFin={fin} />}
      {ronda === 2 && (
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="text-2xl font-bold">📓 Informe listo</p>
          <p>Partes en orden al primer intento: <b>{puntos[0]}</b> · Errores bien marcados: <b>{puntos[1]}</b></p>
          <p className="max-w-xl text-sm text-[var(--suave)]">En cada práctica de esta app, el botón «Guía» trae las preguntas para tu informe. Anota lo que mides tal como sale: un dato raro bien explicado vale más que uno copiado del libro.</p>
          <button type="button" onClick={() => { setPuntos([]); setRonda(0) }} className="min-h-10 rounded-full bg-[var(--acento)] px-5 text-sm font-semibold text-white">Empezar de nuevo</button>
        </div>
      )}
    </div>
  )
}

function Armar({ grado, onFin }: { grado: number; onFin: (p: number) => void }) {
  const partes = PARTES.filter((p) => grado >= p.desde)
  const [cartas] = useState(() => mezclar(partes))
  const [n, setN] = useState(0)
  const [malas, setMalas] = useState<Set<string>>(new Set())
  const [sacude, setSacude] = useState<string | null>(null)
  const tocar = (p: Parte) => {
    if (partes.indexOf(p) < n) return
    if (p === partes[n]) setN(n + 1)
    else {
      setMalas((m) => new Set(m).add(partes[n].t))
      setSacude(p.t)
      setTimeout(() => setSacude(null), 450)
    }
  }
  const quedan = cartas.filter((p) => partes.indexOf(p) >= n)
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const k = Number(e.key)
      if (k >= 1 && k <= quedan.length) tocar(quedan[k - 1])
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  })
  const listo = n === partes.length
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
      <div className="flex flex-col gap-2">
        <p className="text-sm text-[var(--suave)]">{listo ? '¡Completo!' : `¿Qué parte va ahora? Toca la carta (o su número). Van ${n} de ${partes.length}.`}</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {quedan.map((p, k) => (
            <button key={p.t} type="button" onClick={() => tocar(p)}
              className={`min-h-12 rounded-xl border border-[var(--linea)] bg-white px-3 text-left font-semibold transition hover:border-[var(--acento)] ${sacude === p.t ? 'translate-x-1 border-[#b5462c] bg-[#fbeee9]' : ''}`}>
              <span className="mr-1 opacity-50">{k + 1}</span> {p.t}
            </button>
          ))}
        </div>
        {listo && (
          <button type="button" onClick={() => onFin(partes.length - malas.size)} className="mt-2 min-h-10 self-start rounded-full bg-[var(--acento)] px-5 text-sm font-semibold text-white">Siguiente ronda</button>
        )}
      </div>
      <div className="min-h-80 rounded-lg border border-[var(--linea)] bg-[#fffef8] p-5 shadow-sm" style={{ backgroundImage: 'repeating-linear-gradient(transparent 0 27px, #dfe8f1 27px 28px)' }}>
        <p className="mb-2 text-center font-bold">Informe de laboratorio</p>
        <ol className="flex flex-col gap-2">
          {partes.slice(0, n).map((p, k) => (
            <li key={p.t}>
              <b>{k + 1}. {p.t}</b>{malas.has(p.t) && <span className="ml-1 text-xs text-[#b5462c]">(con error)</span>}
              <p className="text-sm text-[var(--suave)]">{p.x}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

function Errores({ grado, onFin }: { grado: number; onFin: (p: number) => void }) {
  const secciones = MAL.filter((s) => s.frases.some((f) => grado >= (f.desde ?? 6)))
    .map((s) => ({ ...s, frases: s.frases.filter((f) => grado >= (f.desde ?? 6)) }))
  const todas = secciones.flatMap((s) => s.frases)
  const total = todas.filter((f) => f.error).length
  const [marcadas, setMarcadas] = useState<Set<string>>(new Set())
  const [revisado, setRevisado] = useState(false)
  const alternar = (f: Frase) => {
    if (revisado) return
    setMarcadas((m) => { const n = new Set(m); if (n.has(f.t)) n.delete(f.t); else n.add(f.t); return n })
  }
  const bien = todas.filter((f) => !!f.error === marcadas.has(f.t)).length
  const aciertos = todas.filter((f) => f.error && marcadas.has(f.t)).length
  return (
    <div className="flex flex-col gap-3">
      <p className="text-center text-sm text-[var(--suave)]">
        Este informe tiene <b>{total}</b> errores. Toca cada frase que esté mal (Tab y Enter también sirven) y luego «Revisar».
      </p>
      <div className="mx-auto w-full max-w-3xl rounded-lg border border-[var(--linea)] bg-[#fffef8] p-5 shadow-sm">
        <p className="mb-3 text-center font-bold">Práctica: densidades · Grupo 3</p>
        {secciones.map((s) => (
          <div key={s.s} className="mb-3">
            <p className="font-bold">{s.s}</p>
            {s.frases.map((f) => {
              const m = marcadas.has(f.t)
              let c = m ? 'bg-[#fff1c2] decoration-[#b5462c] underline decoration-wavy' : 'hover:bg-[#f2f5f8]'
              if (revisado) c = f.error ? (m ? 'bg-[#eaf5ee]' : 'bg-[#fbeee9]') : m ? 'bg-[#fbeee9] line-through' : ''
              return (
                <div key={f.t}>
                  <button type="button" onClick={() => alternar(f)} className={`rounded px-1 text-left transition ${c}`}>{f.t}</button>
                  {revisado && f.error && <p className="ml-3 text-sm text-[#2e5d8a]">{m ? '✔' : '✘ Se te pasó:'} {f.error}</p>}
                  {revisado && !f.error && m && <p className="ml-3 text-sm text-[#b5462c]">Esta frase estaba bien.</p>}
                </div>
              )
            })}
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-3">
        {!revisado ? (
          <button type="button" onClick={() => setRevisado(true)} className="min-h-10 rounded-full bg-[var(--acento)] px-5 text-sm font-semibold text-white">Revisar ({marcadas.size} marcadas)</button>
        ) : (
          <>
            <p className="self-center text-sm">Encontraste {aciertos} de {total} · {bien} de {todas.length} frases bien juzgadas</p>
            <button type="button" onClick={() => onFin(aciertos)} className="min-h-10 rounded-full bg-[var(--acento)] px-5 text-sm font-semibold text-white">Ver resultado</button>
          </>
        )}
      </div>
    </div>
  )
}
