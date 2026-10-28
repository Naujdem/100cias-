// Valida los archivos de contenido. Uso: npm run check:data
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const raiz = new URL('../src/data/', import.meta.url).pathname
const errores = []
const avisos = []
const err = (m) => errores.push(m)

function archivos(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f)
    return statSync(p).isDirectory() ? archivos(p) : p.endsWith('.json') ? [p] : []
  })
}

const NIVELES = ['basico', 'intermedio', 'avanzado']
const temas = new Map()

for (const f of archivos(join(raiz, 'materias'))) {
  const t = JSON.parse(readFileSync(f, 'utf8'))
  temas.set(t.id, t)
  const ids = new Set()
  for (const b of t.bloques) {
    const ctx = `${t.id}/${b.id}`
    if (ids.has(b.id)) err(`${ctx}: id de bloque repetido`)
    ids.add(b.id)
    if (!NIVELES.includes(b.nivel)) err(`${ctx}: nivel inválido (${b.nivel})`)
    if (!b.ficha?.idea) err(`${ctx}: falta ficha.idea`)
    for (const a of b.autores ?? []) if (!a.nombre || !a.aporte) err(`${ctx}: autor sin nombre o aporte`)
    if (!b.revisado) avisos.push(`${ctx}: borrador sin revisar`)
    const pids = new Set()
    for (const p of b.preguntas ?? []) {
      const pc = `${ctx}/${p.id}`
      if (pids.has(p.id)) err(`${pc}: id de pregunta repetido`)
      pids.add(p.id)
      if (!Number.isInteger(p.correcta) || p.correcta < 0 || p.correcta >= p.opciones.length)
        err(`${pc}: índice de respuesta correcta fuera de rango`)
      if (new Set(p.opciones.map((o) => o.trim().toLowerCase())).size !== p.opciones.length)
        err(`${pc}: opciones duplicadas`)
      if (p.opciones.length < 3) err(`${pc}: menos de 3 opciones`)
      if (!p.explicacion) err(`${pc}: falta explicación`)
    }
  }
  for (const b of t.bloques)
    for (const r of b.requiere ?? []) if (!ids.has(r)) err(`${t.id}/${b.id}: requiere un bloque inexistente (${r})`)
  // ciclos en requisitos
  const m = new Map(t.bloques.map((b) => [b.id, b]))
  const visita = (id, pila) => {
    if (pila.includes(id)) return err(`${t.id}: ciclo de requisitos ${[...pila, id].join(' -> ')}`)
    for (const r of m.get(id)?.requiere ?? []) visita(r, [...pila, id])
  }
  for (const b of t.bloques) visita(b.id, [])
}

const perfiles = JSON.parse(readFileSync(join(raiz, 'perfiles.json'), 'utf8'))
for (const p of perfiles) {
  if (!NIVELES.includes(p.nivelDibujo)) err(`perfil ${p.id}: nivelDibujo inválido`)
  for (const [tid, ids] of Object.entries(p.bloques)) {
    const t = temas.get(tid)
    if (!t) { err(`perfil ${p.id}: tema inexistente (${tid})`); continue }
    const validos = new Set(t.bloques.map((b) => b.id))
    for (const id of ids) if (!validos.has(id)) err(`perfil ${p.id}: bloque inexistente (${tid}/${id})`)
  }
}

for (const a of avisos) console.log('aviso:', a)
if (errores.length) {
  for (const e of errores) console.error('ERROR:', e)
  process.exit(1)
}
console.log(`OK: ${temas.size} tema(s), ${perfiles.length} perfil(es), sin errores.`)
