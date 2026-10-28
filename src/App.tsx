import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import perfilesJson from './data/perfiles.json'
import type { Perfil, Tema } from './data/schema.ts'
import { alternar, normalizar } from './lib/seleccion.ts'
import { guardar, leer } from './lib/almacen.ts'
import SelectorContenido from './components/SelectorContenido.tsx'
import LineaTiempo from './components/LineaTiempo.tsx'
import Quiz from './components/Quiz.tsx'
import { vistasDe } from './components/linea/vistas.ts'
import Buscador from './components/Buscador.tsx'
import type { Resultado } from './lib/buscar.ts'

// Todos los subtemas del contenido, ordenados. Para agregar uno basta con crear su JSON en data/materias.
const TEMAS = Object.values(import.meta.glob('./data/materias/**/*.json', { eager: true, import: 'default' }))
  .map((t) => t as unknown as Tema)
  .sort((a, b) => (a.orden ?? 99) - (b.orden ?? 99))
const PERFILES = perfilesJson as unknown as Perfil[]
const CLAVE_TEMA = 'cien:tema-activo'

interface Guardado {
  perfil: string
  activos: string[]
}

export default function App() {
  const [temaId, setTemaId] = useState(() => {
    const g = leer<string>(CLAVE_TEMA, TEMAS[0].id)
    return TEMAS.some((t) => t.id === g) ? g : TEMAS[0].id
  })
  const tema = TEMAS.find((t) => t.id === temaId) ?? TEMAS[0]
  const [salto, setSalto] = useState<{ id: string; n: number } | null>(null)
  const ir = (r: Resultado) => {
    setTemaId(r.temaId)
    guardar(CLAVE_TEMA, r.temaId)
    setSalto({ id: r.bloqueId, n: Date.now() })
  }
  return (
    <div className="mx-auto max-w-4xl px-4 pb-16 pt-6">
      <header>
        <p className="text-sm font-semibold text-[var(--acento)]">Biología · Biología celular</p>
        <h1 className="mt-1 text-2xl font-bold leading-tight">{tema.titulo}</h1>
      </header>
      <Buscador temas={TEMAS} onIr={ir} />
      {TEMAS.length > 1 && (
        <nav aria-label="Subtemas" className="mt-4">
          <div className="flex flex-wrap gap-2">
            {TEMAS.map((t) => (
              <button
                key={t.id}
                type="button"
                aria-pressed={t.id === tema.id}
                onClick={() => {
                  setTemaId(t.id)
                  guardar(CLAVE_TEMA, t.id)
                }}
                className="min-h-11 rounded-xl border border-[var(--linea)] bg-[var(--tarjeta)] px-4 text-left text-sm font-semibold aria-pressed:border-[var(--acento)] aria-pressed:bg-[var(--acento-suave)]/40"
              >
                <span className="text-[var(--acento)]">{t.etiqueta}</span> {t.subtema}
              </button>
            ))}
          </div>
        </nav>
      )}
      <TemaView key={tema.id} TEMA={tema} salto={salto} />
    </div>
  )
}

function TemaView({ TEMA, salto }: { TEMA: Tema; salto: { id: string; n: number } | null }) {
  const CLAVE = `cien:${TEMA.id}`
  const inicial = useMemo<Guardado>(() => {
    const g = leer<Guardado | null>(CLAVE, null)
    if (g) return g
    const p = PERFILES[0]
    return { perfil: p.id, activos: p.bloques[TEMA.id] ?? TEMA.bloques.map((b) => b.id) }
  }, [CLAVE, TEMA])

  const [perfil, setPerfil] = useState(inicial.perfil)
  const [activos, setActivos] = useState(() => normalizar(TEMA.bloques, inicial.activos))
  const [aviso, setAviso] = useState('')

  const persistir = useCallback((p: string, a: Set<string>) => guardar(CLAVE, { perfil: p, activos: [...a] }), [CLAVE])

  const elegirPerfil = (p: Perfil) => {
    const a = normalizar(TEMA.bloques, p.bloques[TEMA.id] ?? TEMA.bloques.map((b) => b.id))
    setPerfil(p.id)
    setActivos(a)
    setAviso('')
    persistir(p.id, a)
  }

  const alternarBloque = (id: string) => {
    const r = alternar(TEMA.bloques, activos, id)
    const titulo = (x: string) => TEMA.bloques.find((b) => b.id === x)?.titulo ?? x
    const activando = r.activos.has(id)
    setAviso(
      r.arrastrados.length
        ? `${activando ? 'También se activó' : 'También se desactivó'}: ${r.arrastrados.map(titulo).join(', ')}.`
        : '',
    )
    setActivos(r.activos)
    setPerfil('personalizado')
    persistir('personalizado', r.activos)
  }

  // Si la búsqueda lleva a un bloque que el perfil tiene apagado, se enciende (con sus requisitos).
  const atendido = useRef(0)
  useEffect(() => {
    if (!salto || salto.n === atendido.current) return
    atendido.current = salto.n
    if (!TEMA.bloques.some((b) => b.id === salto.id) || activos.has(salto.id)) return
    const r = alternar(TEMA.bloques, activos, salto.id)
    setActivos(r.activos)
    setPerfil('personalizado')
    persistir('personalizado', r.activos)
    setAviso('Ese contenido estaba oculto en tu perfil y se activó para mostrarlo.')
  }, [salto, TEMA, activos, persistir])

  const visibles = TEMA.bloques.filter((b) => activos.has(b.id))

  return (
    <div>
      <section aria-label="Perfil" className="mt-5">
        <p className="mb-2 text-sm font-semibold">Perfil</p>
        <div className="flex flex-wrap gap-2">
          {PERFILES.map((p) => (
            <button
              key={p.id}
              type="button"
              aria-pressed={perfil === p.id}
              onClick={() => elegirPerfil(p)}
              className={`min-h-11 rounded-full border px-4 text-sm font-medium ${
                perfil === p.id
                  ? 'border-[var(--acento)] bg-[var(--acento)] text-[var(--fondo)]'
                  : 'border-[var(--linea)] bg-[var(--tarjeta)]'
              }`}
            >
              {p.nombre}
            </button>
          ))}
          {perfil === 'personalizado' && (
            <span className="inline-flex min-h-11 items-center rounded-full border border-dashed border-[var(--acento)] px-4 text-sm">
              Personalizado
            </span>
          )}
        </div>
        <p className="mt-2 text-sm text-[var(--suave)]">
          {PERFILES.find((p) => p.id === perfil)?.descripcion ?? 'Elegiste tu propia combinación de contenido.'}
        </p>
      </section>

      <div className="mt-5">
        <SelectorContenido bloques={TEMA.bloques} activos={activos} onAlternar={alternarBloque} />
        <p aria-live="polite" className="mt-2 min-h-5 text-sm text-[var(--suave)]">
          {aviso}
        </p>
      </div>

      <section aria-label={TEMA.tituloVista ?? 'Línea de tiempo'} className="mt-6">
        <h2 className="mb-3 text-lg font-bold">{TEMA.tituloVista ?? 'Línea de tiempo'}</h2>
        <LineaTiempo
          bloques={visibles}
          vistas={vistasDe(TEMA.vistas)}
          claveVista={TEMA.vistas ? `cien:vista-${TEMA.id}` : 'cien:vista-linea'}
          unidad={TEMA.unidad}
          abrir={salto}
        />
      </section>

      <section aria-label="Quiz" className="mt-8">
        <h2 className="mb-1 text-lg font-bold">Mini-quiz</h2>
        <p className="mb-3 text-sm text-[var(--suave)]">Solo pregunta lo que tienes activado arriba.</p>
        <Quiz bloques={visibles} />
      </section>
    </div>
  )
}
