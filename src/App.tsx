import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Perfil, Tema } from './data/schema.ts'
import { alternar, normalizar } from './lib/seleccion.ts'
import { guardar } from './lib/almacen.ts'
import { aplicarPerfil, CLAVE_TEMA, guardadoDe, PERFILES, perfilActual, TEMAS } from './lib/temas.ts'
import type { Guardado } from './lib/temas.ts'
import { enlace, irA, usarRuta } from './lib/ruta.ts'
import { cambiarApariencia, usarApariencia } from './lib/apariencia.ts'
import type { Apariencia } from './lib/apariencia.ts'
import { MATERIAS, UNIDADES } from './data/catalogo.ts'
import SelectorContenido from './components/SelectorContenido.tsx'
import LineaTiempo from './components/LineaTiempo.tsx'
import { vistasDe } from './components/linea/vistas.ts'
import Buscador from './components/Buscador.tsx'
import Guia from './components/Guia.tsx'
import { Inicio, Migas, VistaJugar, VistaMateria, VistaQuices, VistaUnidad } from './components/Biblioteca.tsx'
import type { Resultado } from './lib/buscar.ts'
import { ContextoAtajos } from './lib/atajos.ts'

const Editor = lazy(() => import('./components/Editor.tsx'))

/** Petición de abrir una ficha al llegar a su tema (búsqueda, atajo, «Seguir», «Para tocar y jugar»). */
interface Salto {
  tema: string
  id: string
  n: number
  pestana?: 'diagrama' | 'juego'
}

export default function App() {
  const ruta = usarRuta()
  const [salto, setSalto] = useState<Salto | null>(null)
  const [editando, setEditando] = useState(false)
  const [perfilId, setPerfilId] = useState(() => perfilActual().id)
  const [version, setVersion] = useState(0) // cambia al elegir grado, para que el tema abierto lo tome

  const tema = ruta.v === 'tema' ? TEMAS.find((t) => t.id === ruta.tema) : undefined
  useEffect(() => {
    if (tema) guardar(CLAVE_TEMA, tema.id)
  }, [tema])
  // una petición de abrir ficha solo vale para su tema: al salir de él, se olvida
  useEffect(() => {
    setSalto((s) => (s && (ruta.v !== 'tema' || ruta.tema !== s.tema) ? null : s))
  }, [ruta])

  const abrir = (temaId: string, bloqueId?: string, pestana?: Salto['pestana']) => {
    setSalto(bloqueId ? { tema: temaId, id: bloqueId, n: Date.now(), pestana } : null)
    irA(enlace.tema(temaId))
  }
  const atajos = {
    existe: (id: string) => TEMAS.some((t) => t.id === id),
    ir: (id: string, bloqueId?: string) => abrir(id, bloqueId),
  }
  const elegirGrado = (p: Perfil) => {
    aplicarPerfil(p)
    setPerfilId(p.id)
    setVersion((v) => v + 1)
  }

  if (editando) {
    return (
      <div className="mx-auto max-w-4xl px-4 pb-16 pt-6">
        <Suspense fallback={<p>Cargando editor…</p>}>
          <Editor onCerrar={() => setEditando(false)} />
        </Suspense>
      </div>
    )
  }

  return (
    <ContextoAtajos.Provider value={atajos}>
      <header className="border-b border-[var(--linea)] bg-[var(--tarjeta)]">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-4 py-3">
          <a href={enlace.inicio} className="mr-auto flex items-center gap-2 text-[var(--tinta)] no-underline sm:mr-0">
            <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
              <circle cx="17" cy="17" r="15" fill="var(--acento)" />
              <circle cx="17" cy="17" r="6.5" fill="none" stroke="var(--fondo)" strokeWidth="2" />
              <circle cx="22" cy="12" r="2.4" fill="var(--fondo)" />
            </svg>
            <span className="titulo text-xl font-semibold">100ciencias</span>
          </a>
          <Buscador temas={TEMAS} onIr={(r: Resultado) => abrir(r.temaId, r.bloqueId)} className="order-last min-w-0 flex-1 basis-full sm:order-none sm:basis-56" />
          <label className="flex items-center">
            <span className="sr-only">Grado</span>
            <select
              value={perfilId}
              onChange={(e) => {
                const p = PERFILES.find((x) => x.id === e.target.value)
                if (p) elegirGrado(p)
              }}
              className="min-h-11 rounded-full border border-[var(--linea)] bg-[var(--tarjeta)] px-3 text-sm font-semibold text-[var(--tinta)]"
            >
              {PERFILES.map((p) => (
                <option key={p.id} value={p.id}>
                  Grado {p.nombre}
                </option>
              ))}
            </select>
          </label>
          <Menu onEditor={() => setEditando(true)} />
        </div>
      </header>

      <main className={`mx-auto px-4 pb-16 pt-6 ${ruta.v === 'tema' ? 'max-w-4xl' : 'max-w-5xl'}`}>
        {ruta.v === 'inicio' && <Inicio key={version} onSeguir={abrir} />}
        {ruta.v === 'materia' && <VistaMateria key={version} materia={ruta.materia} />}
        {ruta.v === 'unidad' && <VistaUnidad key={version} materia={ruta.materia} unidad={ruta.unidad} />}
        {ruta.v === 'jugar' && <VistaJugar key={version} onAbrir={abrir} />}
        {ruta.v === 'quices' && <VistaQuices key={`${version}-${ruta.tema}`} temaId={ruta.tema} onIr={abrir} />}
        {ruta.v === 'tema' &&
          (tema ? (
            <TemaView key={`${tema.id}-${version}`} TEMA={tema} salto={salto && salto.tema === tema.id ? salto : null} />
          ) : (
            <p>
              Ese tema no existe. <a href={enlace.inicio}>Volver al inicio</a>
            </p>
          ))}
      </main>
    </ContextoAtajos.Provider>
  )
}

/** Menú de la cabecera: apartados que no hace falta tener siempre a la vista. */
function Menu({ onEditor }: { onEditor: () => void }) {
  const [abierto, setAbierto] = useState(false)
  const apariencia = usarApariencia()
  const caja = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!abierto) return
    const fuera = (e: MouseEvent) => {
      if (!caja.current?.contains(e.target as Node)) setAbierto(false)
    }
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAbierto(false)
    }
    document.addEventListener('mousedown', fuera)
    document.addEventListener('keydown', tecla)
    return () => {
      document.removeEventListener('mousedown', fuera)
      document.removeEventListener('keydown', tecla)
    }
  }, [abierto])
  const item = 'flex min-h-11 w-full items-center rounded-xl px-3 text-left text-sm font-semibold text-[var(--tinta)] no-underline hover:bg-[var(--fondo)]'
  return (
    <div ref={caja} className="relative">
      <button
        type="button"
        aria-label="Menú"
        aria-expanded={abierto}
        onClick={() => setAbierto((a) => !a)}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--linea)] bg-[var(--tarjeta)] aria-expanded:border-[var(--acento)]"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
          <circle cx="16" cy="7" r="2" />
          <circle cx="10" cy="17" r="2" />
        </svg>
      </button>
      {abierto && (
        <div className="absolute right-0 z-40 mt-2 w-60 rounded-2xl border border-[var(--linea)] bg-[var(--tarjeta)] p-2 shadow-xl">
          <a href={enlace.jugar} onClick={() => setAbierto(false)} className={item}>
            Para tocar y jugar
          </a>
          <a href={enlace.quices()} onClick={() => setAbierto(false)} className={item}>
            Quices
          </a>
          <button
            type="button"
            onClick={() => {
              setAbierto(false)
              onEditor()
            }}
            className={item}
          >
            Editor de documentos
          </button>
          <div role="group" aria-label="Apariencia" className="mt-2 border-t border-[var(--linea)] px-1 pt-3 pb-1">
            <p className="mb-2 px-2 text-xs font-semibold text-[var(--suave)]">Apariencia</p>
            <div className="grid grid-cols-3 gap-1 rounded-xl bg-[var(--fondo)] p-1">
              {([
                ['claro', 'Claro'],
                ['oscuro', 'Oscuro'],
                ['sistema', 'Auto'],
              ] as [Apariencia, string][]).map(([v, t]) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={apariencia === v}
                  title={v === 'sistema' ? 'Igual que el dispositivo' : undefined}
                  onClick={() => cambiarApariencia(v)}
                  className="min-h-9 rounded-lg text-xs font-semibold text-[var(--suave)] aria-pressed:bg-[var(--acento)] aria-pressed:text-[var(--sobre-acento)]"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function TemaView({ TEMA, salto }: { TEMA: Tema; salto: { id: string; n: number; pestana?: 'diagrama' | 'juego' } | null }) {
  const CLAVE = `cien:${TEMA.id}`
  const inicial = useMemo<Guardado>(() => guardadoDe(TEMA), [TEMA])

  const [perfil, setPerfil] = useState(inicial.perfil)
  const [activos, setActivos] = useState(() => normalizar(TEMA.bloques, inicial.activos))
  const [aviso, setAviso] = useState('')

  const persistir = useCallback((p: string, a: Set<string>) => guardar(CLAVE, { perfil: p, activos: [...a] }), [CLAVE])

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

  // «Empezar» abre el primer bloque visible; si hubo una búsqueda más reciente, gana la búsqueda
  const [empezar, setEmpezar] = useState<{ id: string; n: number } | null>(null)
  const pedido = empezar && (!salto || empezar.n > salto.n) ? empezar : salto

  return (
    <div>
      <Migas
        pasos={[
          { texto: 'Inicio', a: enlace.inicio },
          { texto: MATERIAS.find((m) => m.id === TEMA.materia)?.nombre ?? TEMA.materia, a: enlace.materia(TEMA.materia) },
          { texto: UNIDADES[TEMA.materia]?.find((u) => u.id === TEMA.area)?.nombre ?? TEMA.area, a: enlace.unidad(TEMA.materia, TEMA.area) },
        ]}
      />
      <h1 className="mt-1 text-3xl font-semibold leading-tight">
        <span className="text-[var(--acento)]">{TEMA.etiqueta}</span> {TEMA.subtema}
      </h1>

      <div className="mt-5">
        <SelectorContenido bloques={TEMA.bloques} activos={activos} onAlternar={alternarBloque} />
        {perfil === 'personalizado' && <p className="mt-2 text-sm text-[var(--suave)]">Elegiste tu propia combinación de contenido para este tema. Si cambias de grado arriba, se reemplaza.</p>}
        <p aria-live="polite" className={aviso ? 'mt-2 text-sm text-[var(--suave)]' : 'sr-only'}>
          {aviso}
        </p>
      </div>

      <Guia tema={TEMA} visibles={[...visibles].sort((a, b) => a.anio - b.anio)} onIr={(id) => setEmpezar({ id, n: Date.now() })} />

      <section aria-label={TEMA.tituloVista ?? 'Línea de tiempo'} className="mt-6">
        <h2 className="mb-3 text-lg font-bold">{TEMA.tituloVista ?? 'Línea de tiempo'}</h2>
        <LineaTiempo
          bloques={visibles}
          vistas={vistasDe(TEMA.vistas)}
          claveVista={TEMA.vistas ? `cien:vista-${TEMA.id}` : 'cien:vista-linea'}
          unidad={TEMA.unidad}
          abrir={pedido}
          temaId={TEMA.id}
          diapositivas={TEMA.diapositivas}
          pagina={
            // las fichas emergentes son de la línea de tiempo; los demás temas abren cada concepto como página
            TEMA.vistas
              ? { migas: [MATERIAS.find((m) => m.id === TEMA.materia)?.nombre ?? TEMA.materia, UNIDADES[TEMA.materia]?.find((u) => u.id === TEMA.area)?.nombre ?? TEMA.area, TEMA.subtema] }
              : undefined
          }
        />
      </section>

      <p className="mt-8">
        <a href={enlace.quices(TEMA.id)} className="inline-flex min-h-12 items-center rounded-full border-2 border-[var(--acento)] px-6 font-bold text-[var(--acento)] no-underline">
          Hacer el quiz de este tema
        </a>
      </p>
    </div>
  )
}
