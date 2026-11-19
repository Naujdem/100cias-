import { useEffect, useState } from 'react'

// Guía de laboratorio de cada práctica (PLAN-LABORATORIOS.md): se abre desde un botón en la práctica,
// con la estructura de una guía de papel. Las guías están en data/guiasLab.ts, por id de práctica.

export interface Guia {
  objetivo: string[]
  fundamento: string[]
  materiales: string[]
  procedimiento: string[]
  seguridad?: string[]
  preguntas: string[]
}

function Seccion({ t, items, numerada = false }: { t: string; items?: string[]; numerada?: boolean }) {
  if (!items?.length) return null
  const L = numerada ? 'ol' : 'ul'
  return (
    <section className="mt-4">
      <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--acento)]">{t}</h3>
      {items.length === 1 && !numerada ? (
        <p className="mt-1">{items[0]}</p>
      ) : (
        <L className={`mt-1 space-y-1 pl-6 ${numerada ? 'list-decimal' : 'list-disc'}`}>{items.map((x) => <li key={x}>{x}</li>)}</L>
      )}
    </section>
  )
}

export default function GuiaLab({ titulo, guia }: { titulo: string; guia: Guia }) {
  const [abierta, setAbierta] = useState(false)
  useEffect(() => {
    if (!abierta) return
    const t = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.stopPropagation(); setAbierta(false) } }
    document.addEventListener('keydown', t, true)
    return () => document.removeEventListener('keydown', t, true)
  }, [abierta])
  return (
    <>
      <button type="button" onClick={() => setAbierta(true)} className="min-h-10 rounded-full border border-[var(--linea)] bg-[var(--tarjeta)] px-4 text-sm font-semibold hover:border-[var(--acento)]">
        📄 Guía de laboratorio
      </button>
      {abierta && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4" onClick={() => setAbierta(false)}>
          <article role="dialog" aria-label={`Guía: ${titulo}`} className="my-6 w-full max-w-3xl rounded-2xl bg-[var(--tarjeta)] p-6 text-[var(--tinta)] shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[var(--suave)]">Guía de laboratorio</p>
                <h2 className="text-2xl font-semibold">{titulo}</h2>
              </div>
              <button type="button" onClick={() => setAbierta(false)} className="min-h-10 rounded-full border border-[var(--linea)] px-4 text-sm font-semibold" aria-label="Cerrar guía">✕ Cerrar</button>
            </div>
            <Seccion t="Objetivo" items={guia.objetivo} />
            <Seccion t="Fundamento" items={guia.fundamento} />
            <Seccion t="Materiales" items={guia.materiales} />
            <Seccion t="Procedimiento" items={guia.procedimiento} numerada />
            <Seccion t="Seguridad" items={guia.seguridad} />
            <Seccion t="Preguntas" items={guia.preguntas} numerada />
          </article>
        </div>
      )}
    </>
  )
}
