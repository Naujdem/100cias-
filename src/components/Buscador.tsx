import { useEffect, useId, useMemo, useRef, useState } from 'react'
import type { Tema } from '../data/schema.ts'
import { buscar, normalizarTexto, palabras, type Resultado } from '../lib/buscar.ts'

interface Props {
  temas: Tema[]
  onIr: (r: Resultado) => void
}

/** Resalta las palabras buscadas dentro de un texto. */
function Resaltado({ texto, ps }: { texto: string; ps: string[] }) {
  const n = normalizarTexto(texto)
  const marcas: [number, number][] = []
  for (const p of ps) {
    let i = n.indexOf(p)
    while (i >= 0) {
      marcas.push([i, i + p.length])
      i = n.indexOf(p, i + p.length)
    }
  }
  marcas.sort((a, b) => a[0] - b[0])
  const partes: React.ReactNode[] = []
  let pos = 0
  for (const [a, b] of marcas) {
    if (a < pos) continue
    if (a > pos) partes.push(texto.slice(pos, a))
    partes.push(<mark key={a} className="rounded bg-[var(--acento-suave)] px-0.5 text-inherit">{texto.slice(a, b)}</mark>)
    pos = b
  }
  partes.push(texto.slice(pos))
  return <>{partes}</>
}

export default function Buscador({ temas, onIr }: Props) {
  const [q, setQ] = useState('')
  const [abierto, setAbierto] = useState(false)
  const [activo, setActivo] = useState(0)
  const entrada = useRef<HTMLInputElement>(null)
  const caja = useRef<HTMLDivElement>(null)
  const idLista = useId()
  const resultados = useMemo(() => buscar(temas, q), [temas, q])
  const ps = useMemo(() => palabras(q), [q])
  const hayConsulta = ps.length > 0

  // "/" enfoca el buscador (si no se está escribiendo ni hay un recuadro abierto)
  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return
      const t = e.target as HTMLElement | null
      if (t && (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable)) return
      if (document.querySelector('[role=dialog]')) return
      e.preventDefault()
      entrada.current?.focus()
      entrada.current?.select()
    }
    window.addEventListener('keydown', alTeclear)
    return () => window.removeEventListener('keydown', alTeclear)
  }, [])

  // clic fuera cierra la lista
  useEffect(() => {
    const fuera = (e: MouseEvent) => {
      if (caja.current && !caja.current.contains(e.target as Node)) setAbierto(false)
    }
    document.addEventListener('mousedown', fuera)
    return () => document.removeEventListener('mousedown', fuera)
  }, [])

  const elegir = (r: Resultado) => {
    setAbierto(false)
    setQ('')
    entrada.current?.blur()
    onIr(r)
  }

  const alTeclear = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      if (q) setQ('')
      else entrada.current?.blur()
      setAbierto(false)
      e.stopPropagation()
    } else if (e.key === 'ArrowDown' && resultados.length) {
      e.preventDefault()
      setAbierto(true)
      setActivo((a) => (a + 1) % resultados.length)
    } else if (e.key === 'ArrowUp' && resultados.length) {
      e.preventDefault()
      setAbierto(true)
      setActivo((a) => (a - 1 + resultados.length) % resultados.length)
    } else if (e.key === 'Enter' && abierto && resultados[activo]) {
      e.preventDefault()
      elegir(resultados[activo])
    }
  }

  return (
    <div ref={caja} className="relative mt-4">
      <label htmlFor="buscador" className="sr-only">
        Buscar en el contenido
      </label>
      <div className="flex items-center gap-2 rounded-xl border border-[var(--linea)] bg-[var(--tarjeta)] px-3 focus-within:border-[var(--acento)]">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="shrink-0 text-[var(--suave)]">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-4-4" />
        </svg>
        <input
          ref={entrada}
          id="buscador"
          type="text"
          role="combobox"
          aria-expanded={abierto && hayConsulta}
          aria-controls={idLista}
          aria-activedescendant={abierto && resultados[activo] ? `${idLista}-${activo}` : undefined}
          autoComplete="off"
          value={q}
          placeholder="Buscar: Hooke, mitocondria, tejido…"
          onChange={(e) => {
            setQ(e.target.value)
            setAbierto(true)
            setActivo(0)
          }}
          onFocus={() => setAbierto(true)}
          onKeyDown={alTeclear}
          className="min-h-11 w-full bg-transparent text-sm outline-none"
        />
        {q ? (
          <button
            type="button"
            aria-label="Borrar búsqueda"
            onClick={() => {
              setQ('')
              entrada.current?.focus()
            }}
            className="h-8 w-8 shrink-0 rounded-full text-lg text-[var(--suave)] hover:bg-[var(--fondo)]"
          >
            ×
          </button>
        ) : (
          <kbd className="hidden shrink-0 rounded border border-[var(--linea)] px-1.5 text-xs text-[var(--suave)] sm:block">/</kbd>
        )}
      </div>

      {abierto && hayConsulta && (
        <ul
          id={idLista}
          role="listbox"
          aria-label="Resultados de la búsqueda"
          className="absolute left-0 right-0 z-30 mt-1 max-h-[26rem] overflow-y-auto rounded-xl border border-[var(--linea)] bg-[var(--tarjeta)] p-1 shadow-xl"
        >
          {resultados.length === 0 ? (
            <li role="option" aria-selected="false" className="px-3 py-3 text-sm text-[var(--suave)]">
              No encontré nada para «{q}». Prueba con una sola palabra.
            </li>
          ) : (
            resultados.map((r, i) => (
              <li
                key={`${r.temaId}/${r.bloqueId}`}
                id={`${idLista}-${i}`}
                role="option"
                aria-selected={i === activo}
                onMouseEnter={() => setActivo(i)}
                // mousedown para que el clic no le quite el foco al campo antes de elegir
                onMouseDown={(e) => {
                  e.preventDefault()
                  elegir(r)
                }}
                className={`cursor-pointer rounded-lg px-3 py-2 ${i === activo ? 'bg-[var(--acento-suave)]/50' : ''}`}
              >
                <p className="text-sm font-semibold">
                  <span className="mr-2 text-[var(--acento)]">{r.temaEtiqueta}</span>
                  <Resaltado texto={r.titulo} ps={ps} />
                </p>
                <p className="mt-0.5 text-xs text-[var(--suave)]">
                  <Resaltado texto={r.extracto} ps={ps} />
                </p>
              </li>
            ))
          )}
        </ul>
      )}
      <p aria-live="polite" className="sr-only">
        {abierto && hayConsulta ? `${resultados.length} resultados` : ''}
      </p>
    </div>
  )
}
