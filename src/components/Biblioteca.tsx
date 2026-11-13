import type { ReactNode } from 'react'
import type { Tema } from '../data/schema.ts'
import { MATERIAS, PROXIMOS, UNIDADES } from '../data/catalogo.ts'
import { enlace } from '../lib/ruta.ts'
import { CLAVE_TEMA, TEMAS, visiblesDe } from '../lib/temas.ts'
import { leer } from '../lib/almacen.ts'
import { estadoDe, usarProgreso } from '../lib/progreso.ts'
import type { Progreso } from '../lib/progreso.ts'
import Quiz from './Quiz.tsx'

// Pantallas de la biblioteca: Inicio → materia → unidad (la ruta de temas), y los apartados del menú.

const temasDe = (materia: string, unidad?: string) => TEMAS.filter((t) => t.materia === materia && (!unidad || t.area === unidad))

/** Fichas vistas y totales de un subtema, según lo que muestra el perfil. */
function avance(p: Progreso, t: Tema) {
  const vis = visiblesDe(t)
  return { vistas: vis.filter((b) => estadoDe(p, t.id, b) !== 'nuevo').length, total: vis.length, siguiente: vis.find((b) => estadoDe(p, t.id, b) === 'nuevo') }
}

const TARJETA = 'flex h-full flex-col gap-2 rounded-2xl border border-[var(--linea)] bg-[var(--tarjeta)] p-5 text-[var(--tinta)] no-underline hover:border-[var(--acento)]'
const PRONTO = 'flex h-full flex-col gap-2 rounded-2xl border border-dashed border-[var(--linea)] p-5 text-[var(--suave)]'

function Barra({ hechas, total }: { hechas: number; total: number }) {
  return (
    <span aria-hidden="true" className="mt-1 block h-1.5 overflow-hidden rounded-full bg-[var(--linea)]">
      <span className="block h-full rounded-full bg-[var(--acento)]" style={{ width: `${total ? (hechas / total) * 100 : 0}%` }} />
    </span>
  )
}

function Etiqueta({ children, llena = false }: { children: ReactNode; llena?: boolean }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${llena ? 'bg-[var(--acento)] text-[var(--fondo)]' : 'border border-[var(--acento)] text-[var(--acento)]'}`}>{children}</span>
  )
}

/** Camino de vuelta: Inicio › Biología › … */
export function Migas({ pasos }: { pasos: { texto: string; a?: string }[] }) {
  return (
    <nav aria-label="Dónde estás" className="text-sm text-[var(--suave)]">
      {pasos.map((p, i) => (
        <span key={p.texto}>
          {i > 0 && <span aria-hidden="true"> › </span>}
          {p.a ? (
            <a href={p.a} className="inline-block py-2 font-semibold text-[var(--acento)] no-underline hover:underline">
              {p.texto}
            </a>
          ) : (
            <span aria-current="page">{p.texto}</span>
          )}
        </span>
      ))}
    </nav>
  )
}

const Icono = ({ id }: { id: string }) => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" aria-hidden="true">
    {id === 'biologia' && (
      <>
        <ellipse cx="18" cy="18" rx="15" ry="12" />
        <circle cx="15" cy="17" r="4.5" />
        <circle cx="25" cy="21" r="1.6" fill="currentColor" />
      </>
    )}
    {id === 'quimica' && <path d="M14 4h8M15 4v10L6 30h24L21 14V4M10 23h16" />}
    {id === 'fisica' && (
      <>
        <ellipse cx="18" cy="18" rx="15" ry="6" />
        <ellipse cx="18" cy="18" rx="15" ry="6" transform="rotate(60 18 18)" />
        <ellipse cx="18" cy="18" rx="15" ry="6" transform="rotate(120 18 18)" />
      </>
    )}
  </svg>
)

/* ── Inicio ───────────────────────────────────────────────────────────────── */

export function Inicio({ onSeguir }: { onSeguir: (temaId: string, bloqueId?: string) => void }) {
  const progreso = usarProgreso()
  const ultimo = TEMAS.find((t) => t.id === leer<string>(CLAVE_TEMA, ''))
  const empezado = Object.keys(progreso.vistos).length > 0
  const tema = ultimo ?? TEMAS[0]
  const a = avance(progreso, tema)
  return (
    <div className="space-y-10">
      <section className="rounded-3xl border border-[var(--linea)] bg-[var(--tarjeta)] p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--acento)]">{empezado && ultimo ? 'Continúa explorando' : 'Empieza por aquí'}</p>
        <h1 className="mt-2 text-3xl font-semibold leading-tight sm:text-4xl">{tema.subtema}</h1>
        <p className="mt-2 max-w-2xl text-[var(--suave)]">{a.siguiente ? `Sigue con: ${a.siguiente.titulo}.` : 'Ya viste todas las fichas de este tema. Puedes repasarlo o hacer su quiz.'}</p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <button type="button" onClick={() => onSeguir(tema.id, a.siguiente?.id)} className="min-h-12 rounded-full bg-[var(--acento)] px-7 text-base font-bold text-[var(--fondo)]">
            {empezado && ultimo ? 'Seguir' : 'Empezar'}
          </button>
          <span className="text-sm text-[var(--suave)]">
            {a.vistas} de {a.total} fichas vistas
          </span>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">Áreas de la ciencia</h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MATERIAS.map((m) => {
            const temas = temasDe(m.id)
            return (
              <li key={m.id}>
                {temas.length ? (
                  <a href={enlace.materia(m.id)} className={TARJETA}>
                    <span className="text-[var(--acento)]">
                      <Icono id={m.id} />
                    </span>
                    <span className="text-xl font-bold">{m.nombre}</span>
                    <span className="text-sm text-[var(--suave)]">{m.texto}</span>
                    <span className="mt-auto text-sm font-semibold">
                      {temas.length} temas · {temas.reduce((n, t) => n + t.bloques.length, 0)} fichas
                    </span>
                  </a>
                ) : (
                  <div className={PRONTO}>
                    <Icono id={m.id} />
                    <span className="text-xl font-bold">{m.nombre}</span>
                    <span className="text-sm">{m.texto}</span>
                    <span className="mt-auto text-sm font-semibold">Próximamente</span>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}

/* ── Una materia: su sub-biblioteca de unidades ───────────────────────────── */

export function VistaMateria({ materia }: { materia: string }) {
  const progreso = usarProgreso()
  const m = MATERIAS.find((x) => x.id === materia)
  if (!m) return <NoExiste />
  return (
    <div>
      <Migas pasos={[{ texto: 'Inicio', a: enlace.inicio }, { texto: m.nombre }]} />
      <h1 className="mt-1 text-3xl font-semibold sm:text-4xl">{m.nombre}</h1>
      <p className="mt-1 text-[var(--suave)]">{m.texto}</p>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(UNIDADES[m.id] ?? []).map((u) => {
          const temas = temasDe(m.id, u.id)
          const av = temas.map((t) => avance(progreso, t))
          const vistas = av.reduce((n, x) => n + x.vistas, 0)
          const total = av.reduce((n, x) => n + x.total, 0)
          return (
            <li key={u.id}>
              {temas.length ? (
                <a href={enlace.unidad(m.id, u.id)} className={TARJETA}>
                  <span className="text-xl font-bold">{u.nombre}</span>
                  <span className="text-sm text-[var(--suave)]">{u.texto}</span>
                  <span className="mt-auto pt-2 text-sm font-semibold">
                    {temas.length} temas · {vistas} de {total} fichas vistas
                  </span>
                  <Barra hechas={vistas} total={total} />
                </a>
              ) : (
                <div className={PRONTO}>
                  <span className="text-xl font-bold">{u.nombre}</span>
                  <span className="text-sm">{u.texto}</span>
                  <span className="mt-auto pt-2 text-sm font-semibold">Próximamente</span>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/* ── Una unidad: la ruta de temas ─────────────────────────────────────────── */

export function VistaUnidad({ materia, unidad }: { materia: string; unidad: string }) {
  const progreso = usarProgreso()
  const m = MATERIAS.find((x) => x.id === materia)
  const u = UNIDADES[materia]?.find((x) => x.id === unidad)
  const temas = temasDe(materia, unidad)
  if (!m || !u || !temas.length) return <NoExiste />
  const ultimo = leer<string>(CLAVE_TEMA, '')
  return (
    <div>
      <Migas pasos={[{ texto: 'Inicio', a: enlace.inicio }, { texto: m.nombre, a: enlace.materia(m.id) }, { texto: u.nombre }]} />
      <h1 className="mt-1 text-3xl font-semibold sm:text-4xl">{u.nombre}: tu ruta</h1>
      <p className="mt-1 text-[var(--suave)]">Toca una parada para entrar. Puedes ir en cualquier orden.</p>
      <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {temas.map((t) => {
          const a = avance(progreso, t)
          const aqui = t.id === ultimo
          return (
            <li key={t.id}>
              <a href={enlace.tema(t.id)} className={`${TARJETA} ${aqui ? 'border-2 !border-[var(--acento)]' : ''}`}>
                <span className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-[var(--acento)]">{t.etiqueta}</span>
                  {a.total > 0 && a.vistas === a.total ? <Etiqueta llena>Completo</Etiqueta> : a.vistas > 0 ? <Etiqueta>En curso</Etiqueta> : aqui ? <Etiqueta>Estás aquí</Etiqueta> : null}
                </span>
                <span className="titulo text-xl font-semibold leading-snug">{t.subtema}</span>
                {t.objetivos?.[0] && <span className="text-sm text-[var(--suave)]">{t.objetivos[0]}</span>}
                <span className="mt-auto pt-2 text-sm font-semibold">
                  {a.vistas} de {a.total} fichas
                </span>
                <Barra hechas={a.vistas} total={a.total} />
              </a>
            </li>
          )
        })}
        {(PROXIMOS[unidad] ?? []).map((p) => (
          <li key={p.etiqueta}>
            <div className={PRONTO}>
              <span className="text-sm font-bold">{p.etiqueta}</span>
              <span className="titulo text-xl font-semibold leading-snug">{p.nombre}</span>
              <span className="mt-auto pt-2 text-sm font-semibold">En construcción</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

/* ── Menú: para tocar y jugar ─────────────────────────────────────────────── */

export function VistaJugar({ onAbrir }: { onAbrir: (temaId: string, bloqueId: string, pestana: 'diagrama' | 'juego') => void }) {
  return (
    <div>
      <Migas pasos={[{ texto: 'Inicio', a: enlace.inicio }, { texto: 'Para tocar y jugar' }]} />
      <h1 className="mt-1 text-3xl font-semibold sm:text-4xl">Para tocar y jugar</h1>
      <p className="mt-1 text-[var(--suave)]">Todos los juegos y dibujos interactivos, por tema. Se abren dentro de su ficha.</p>
      {TEMAS.map((t) => {
        const items = visiblesDe(t).flatMap((b) => [
          ...(b.juego ? [{ b, pestana: 'juego' as const }] : []),
          ...(b.diagrama ? [{ b, pestana: 'diagrama' as const }] : []),
        ])
        if (!items.length) return null
        return (
          <section key={t.id} className="mt-7">
            <h2 className="text-xl font-semibold">
              <span className="text-[var(--acento)]">{t.etiqueta}</span> {t.subtema}
            </h2>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map(({ b, pestana }) => (
                <li key={`${b.id}-${pestana}`}>
                  <button type="button" onClick={() => onAbrir(t.id, b.id, pestana)} className={`${TARJETA} w-full !gap-1 !p-4 text-left`}>
                    <span className="text-xs font-bold uppercase tracking-widest text-[var(--acento)]">{pestana === 'juego' ? 'Juego' : 'Explorar'}</span>
                    <span className="font-semibold">{b.titulo}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}

/* ── Menú: quices por tema ────────────────────────────────────────────────── */

export function VistaQuices({ temaId, onIr }: { temaId?: string; onIr: (temaId: string, bloqueId: string) => void }) {
  const progreso = usarProgreso()
  const tema = TEMAS.find((t) => t.id === temaId)
  if (temaId && !tema) return <NoExiste />
  if (tema) {
    return (
      <div className="mx-auto max-w-3xl">
        <Migas pasos={[{ texto: 'Inicio', a: enlace.inicio }, { texto: 'Quices', a: enlace.quices() }, { texto: tema.subtema }]} />
        <h1 className="mt-1 text-3xl font-semibold">Quiz: {tema.subtema}</h1>
        <p className="mb-4 mt-1 text-sm text-[var(--suave)]">Solo pregunta las fichas que muestra tu grado.</p>
        <Quiz key={tema.id} bloques={visiblesDe(tema)} temaId={tema.id} onIr={(id) => onIr(tema.id, id)} />
      </div>
    )
  }
  return (
    <div>
      <Migas pasos={[{ texto: 'Inicio', a: enlace.inicio }, { texto: 'Quices' }]} />
      <h1 className="mt-1 text-3xl font-semibold sm:text-4xl">Quices</h1>
      <p className="mt-1 text-[var(--suave)]">Un quiz por tema, con las preguntas de las fichas que muestra tu grado.</p>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TEMAS.map((t) => {
          const n = visiblesDe(t).reduce((s, b) => s + b.preguntas.length, 0)
          const mejor = progreso.quiz[t.id]
          return (
            <li key={t.id}>
              <a href={enlace.quices(t.id)} className={TARJETA}>
                <span className="text-sm font-bold text-[var(--acento)]">{t.etiqueta}</span>
                <span className="titulo text-xl font-semibold leading-snug">{t.subtema}</span>
                <span className="mt-auto pt-2 text-sm font-semibold">
                  {n} preguntas{mejor ? ` · mejor puntaje: ${mejor.mejor} de ${mejor.total}` : ''}
                </span>
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function NoExiste() {
  return (
    <p>
      Esa página no existe. <a href={enlace.inicio}>Volver al inicio</a>
    </p>
  )
}
