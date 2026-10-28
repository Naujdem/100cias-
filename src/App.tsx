import { useCallback, useMemo, useState } from 'react'
import tema from './data/materias/biologia/celular/teoria-celular.json'
import perfilesJson from './data/perfiles.json'
import type { Perfil, Tema } from './data/schema.ts'
import { alternar, normalizar } from './lib/seleccion.ts'
import { guardar, leer } from './lib/almacen.ts'
import SelectorContenido from './components/SelectorContenido.tsx'
import LineaTiempo from './components/LineaTiempo.tsx'
import Quiz from './components/Quiz.tsx'

const TEMA = tema as unknown as Tema
const PERFILES = perfilesJson as unknown as Perfil[]
const CLAVE = 'cien:teoria-celular'

interface Guardado {
  perfil: string
  activos: string[]
}

export default function App() {
  const inicial = useMemo<Guardado>(() => {
    const g = leer<Guardado | null>(CLAVE, null)
    if (g) return g
    const p = PERFILES[0]
    return { perfil: p.id, activos: p.bloques[TEMA.id] }
  }, [])

  const [perfil, setPerfil] = useState(inicial.perfil)
  const [activos, setActivos] = useState(() => normalizar(TEMA.bloques, inicial.activos))
  const [aviso, setAviso] = useState('')

  const persistir = useCallback((p: string, a: Set<string>) => guardar(CLAVE, { perfil: p, activos: [...a] }), [])

  const elegirPerfil = (p: Perfil) => {
    const a = normalizar(TEMA.bloques, p.bloques[TEMA.id] ?? [])
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

  const visibles = TEMA.bloques.filter((b) => activos.has(b.id))

  return (
    <div className="mx-auto max-w-4xl px-4 pb-16 pt-6">
      <header>
        <p className="text-sm font-semibold text-[var(--acento)]">Biología · Biología celular</p>
        <h1 className="mt-1 text-2xl font-bold leading-tight">{TEMA.titulo}</h1>
        <p className="text-[var(--suave)]">{TEMA.subtema}</p>
      </header>

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

      <section aria-label="Línea de tiempo" className="mt-6">
        <h2 className="mb-3 text-lg font-bold">Línea de tiempo</h2>
        <LineaTiempo bloques={visibles} />
      </section>

      <section aria-label="Quiz" className="mt-8">
        <h2 className="mb-1 text-lg font-bold">Mini-quiz</h2>
        <p className="mb-3 text-sm text-[var(--suave)]">Solo pregunta lo que tienes activado arriba.</p>
        <Quiz bloques={visibles} />
      </section>
    </div>
  )
}
