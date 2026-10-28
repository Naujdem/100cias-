import test from 'node:test'
import assert from 'node:assert/strict'
import { alternar, normalizar } from '../src/lib/seleccion.ts'
import tema from '../src/data/materias/biologia/celular/teoria-celular.json' with { type: 'json' }
import perfiles from '../src/data/perfiles.json' with { type: 'json' }

const bloques = tema.bloques as any[]

test('normalizar agrega el núcleo y los requisitos', () => {
  const s = normalizar(bloques, ['pasteur'])
  assert.ok(s.has('schwann'))
  assert.ok(s.has('schleiden'))
  assert.ok(s.has('virchow'))
  assert.ok(s.has('pasteur'))
})

test('activar un bloque arrastra sus requisitos', () => {
  const base = normalizar(bloques, [])
  const r = alternar(bloques, base, 'teoria-moderna')
  assert.ok(r.activos.has('teoria-moderna'))
})

test('el núcleo no se puede desactivar', () => {
  const base = normalizar(bloques, ['virchow'])
  const r = alternar(bloques, base, 'virchow')
  assert.ok(r.activos.has('virchow'))
})

test('desactivar un requisito opcional apaga a sus dependientes', () => {
  // pasteur requiere virchow (núcleo): no se puede apagar; usamos un caso sintético
  const sint = [
    { id: 'a', requiere: [] },
    { id: 'b', requiere: ['a'] },
    { id: 'c', requiere: ['b'] },
  ] as any[]
  const r = alternar(sint, new Set(['a', 'b', 'c']), 'a')
  assert.deepEqual([...r.activos], [])
  assert.deepEqual(r.arrastrados.sort(), ['b', 'c'])
})

test('los perfiles ya vienen normalizados', () => {
  for (const p of perfiles) {
    const ids = (p.bloques as Record<string, string[]>)['teoria-celular']
    const n = normalizar(bloques, ids)
    assert.deepEqual([...n].sort(), [...ids].sort(), `perfil ${p.id}`)
  }
})

import { buscar, normalizarTexto } from '../src/lib/buscar.ts'

test('buscar ignora tildes y mayúsculas y exige todas las palabras', () => {
  assert.equal(normalizarTexto('Órgano ÁTOMO'), 'organo atomo')
  const t = tema as any
  const r = buscar([t], 'HOOKE corcho')
  assert.equal(r[0]?.bloqueId, 'hooke')
  assert.equal(buscar([t], 'hooke xyzinexistente').length, 0)
  assert.ok(buscar([t], 'celula').length > 3)
  assert.equal(buscar([t], 'a').length, 0) // palabras de una letra no cuentan
})
