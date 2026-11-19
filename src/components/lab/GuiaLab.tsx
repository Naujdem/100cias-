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

const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** abre la guía en una ventana aparte, en blanco y negro, con espacio para nombre y respuestas, e imprime */
function imprimir(titulo: string, g: Guia) {
  const lista = (t: string, items: string[] | undefined, num = false) =>
    items?.length ? `<h2>${t}</h2><${num ? 'ol' : 'ul'}>${items.map((x) => `<li>${esc(x)}</li>`).join('')}</${num ? 'ol' : 'ul'}>` : ''
  const preguntas = g.preguntas.length
    ? `<h2>Preguntas</h2><ol>${g.preguntas.map((x) => `<li>${esc(x)}<div class="r"></div></li>`).join('')}</ol>`
    : ''
  const w = window.open('', '_blank')
  if (!w) return
  w.document.write(`<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Guía: ${esc(titulo)}</title><style>
body{font:12pt/1.45 Georgia,serif;color:#000;max-width:18cm;margin:1.5cm auto;padding:0 .5cm}
h1{font-size:18pt;margin:0 0 .2cm}h2{font-size:12pt;text-transform:uppercase;letter-spacing:.08em;margin:.5cm 0 .15cm;border-bottom:1px solid #000}
.d{display:flex;gap:.6cm;margin-bottom:.3cm}.d span{flex:1;border-bottom:1px solid #000;padding-top:.5cm;font-size:10pt}
li{margin:.1cm 0}.r{height:1.6cm;border-bottom:1px dotted #555;margin-bottom:.2cm}
.c{height:7cm;border:1px solid #000;margin-top:.2cm}@media print{body{margin:0 auto}}
</style></head><body><p style="font-size:9pt;letter-spacing:.1em">GUÍA DE LABORATORIO · 100CIENCIAS</p><h1>${esc(titulo)}</h1>
<div class="d"><span>Nombre:</span><span>Grado:</span><span>Fecha:</span></div>
${lista('Objetivo', g.objetivo)}${lista('Fundamento', g.fundamento)}${lista('Materiales', g.materiales)}${lista('Procedimiento', g.procedimiento, true)}${lista('Seguridad', g.seguridad)}
<h2>Observaciones y dibujos</h2><div class="c"></div>${preguntas}</body></html>`)
  w.document.close()
  w.focus()
  w.print()
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
              <div className="flex gap-2">
              <button type="button" onClick={() => imprimir(titulo, guia)} className="min-h-10 rounded-full border border-[var(--linea)] px-4 text-sm font-semibold hover:border-[var(--acento)]">🖨 Imprimir</button>
              <button type="button" onClick={() => setAbierta(false)} className="min-h-10 rounded-full border border-[var(--linea)] px-4 text-sm font-semibold" aria-label="Cerrar guía">✕ Cerrar</button>
              </div>
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
