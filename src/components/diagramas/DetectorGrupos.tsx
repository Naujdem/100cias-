import { useEffect, useState } from 'react'
import { Molecula, construir, hexagono, fuera, grupo, type Mol, type Atomo, type Enlace } from '../escenas/Molecula.tsx'

// Explora (Química orgánica, tema 2): detector de grupos funcionales en moléculas conocidas.
// A/D cambian la molécula, 1–8 eligen el grupo que se busca (se resalta en amarillo), T muestra todos.
// Los anillos van en fórmula de esqueleto: los H de los carbonos del anillo no se dibujan.

const GRUPOS = ['Hidroxilo (–OH)', 'Aldehído (–CHO)', 'Cetona (C=O)', 'Ácido (–COOH)', 'Éster (–COO–)', 'Éter (–O–)', 'Amida / amina (N)', 'Anillo aromático']

const anilloBase = (cx: number, cy: number, r = 28): { at: Atomo[]; en: Enlace[] } => ({
  at: hexagono(cx, cy, r).map(([x, y]) => ['C', x, y] as Atomo),
  en: [[0, 1, 2], [1, 2, 1], [2, 3, 2], [3, 4, 1], [4, 5, 2], [5, 0, 1]],
})

interface Caso { nombre: string; f: string; nota: string; mol: Mol; grupos: Record<number, number[]> }

function casos(): Caso[] {
  const etanol = construir([['C', 140, 130], ['C', 190, 130], ['O', 240, 130]], [[0, 1], [1, 2]], 'todos', 28)
  const acetona = construir([['C', 140, 150], ['C', 195, 150], ['C', 250, 150], ['O', 195, 105]], [[0, 1], [1, 2], [1, 3, 2]], 'todos', 28)
  const acetico = construir([['C', 150, 150], ['C', 205, 150], ['O', 205, 105], ['O', 255, 150]], [[0, 1], [1, 2, 2], [1, 3]], 'todos', 28)
  const acetato = construir([['C', 90, 160], ['C', 140, 160], ['O', 140, 115], ['O', 190, 160], ['C', 240, 160], ['C', 290, 160]], [[0, 1], [1, 2, 2], [1, 3], [3, 4], [4, 5]], 'todos', 26)

  // vainillina: CHO arriba (C1), OCH₃ en C3 y OH en C4
  const v = anilloBase(190, 160)
  const [cx, cy] = [190, 160]
  const p6 = fuera(cx, cy, 0, 60), p9 = fuera(cx, cy, 3, 58), p10 = fuera(cx, cy, 4, 58), p11 = fuera(cx, cy, 4, 90)
  const vai = construir([...v.at, ['C', ...p6], ['O', p6[0] + 30, p6[1] - 18], ['H', p6[0] - 26, p6[1] - 14], ['O', ...p9], ['O', ...p10], ['C', ...p11]],
    [...v.en, [0, 6], [6, 7, 2], [6, 8], [3, 9], [4, 10], [10, 11]], 'hetero')

  // aspirina: COOH en C1 (arriba) y éster en C2 (arriba a la derecha)
  const a = anilloBase(170, 170)
  const q6 = fuera(170, 170, 0, 60), q9 = fuera(170, 170, 1, 58)
  const asp = construir([...a.at, ['C', ...q6], ['O', q6[0] - 30, q6[1] - 18], ['O', q6[0] + 6, q6[1] - 36], ['O', ...q9], ['C', q9[0] + 34, q9[1]], ['O', q9[0] + 34, q9[1] + 34], ['C', q9[0] + 68, q9[1]]],
    [...a.en, [0, 6], [6, 7, 2], [6, 8], [1, 9], [9, 10], [10, 11, 2], [10, 12]], 'hetero')

  // cafeína: anillo de 6 (C6, C5, C4, N3, C2, N1) fusionado con uno de 5 (C5, N7, C8, N9, C4)
  const h = hexagono(170, 150, 28)
  const caf = construir([
    ['C', ...h[0]], ['C', ...h[1]], ['C', ...h[2]], ['N', ...h[3]], ['C', ...h[4]], ['N', ...h[5]],
    ['N', 221, 127], ['C', 237, 150], ['N', 221, 173],
    ['O', ...fuera(170, 150, 0, 60)], ['C', ...fuera(170, 150, 5, 60)], ['O', ...fuera(170, 150, 4, 60)], ['C', ...fuera(170, 150, 3, 60)], ['C', 232, 98],
  ], [[0, 1], [1, 2, 2], [2, 3], [3, 4], [4, 5], [5, 0], [1, 6], [6, 7], [7, 8, 2], [8, 2], [0, 9, 2], [5, 10], [4, 11, 2], [3, 12], [6, 13]], 'hetero')

  return [
    { nombre: 'Etanol', f: 'CH₃–CH₂–OH', nota: 'El alcohol de las bebidas y del antiséptico.', mol: etanol, grupos: { 0: grupo(etanol, [2]) } },
    { nombre: 'Acetona (propanona)', f: 'CH₃–CO–CH₃', nota: 'El quitaesmalte.', mol: acetona, grupos: { 2: [1, 3] } },
    { nombre: 'Ácido acético', f: 'CH₃–COOH', nota: 'El ácido del vinagre.', mol: acetico, grupos: { 3: grupo(acetico, [1, 2, 3]) } },
    { nombre: 'Acetato de etilo', f: 'CH₃–COO–CH₂–CH₃', nota: 'Pegantes y quitaesmaltes; olor afrutado.', mol: acetato, grupos: { 4: [1, 2, 3] } },
    { nombre: 'Vainillina', f: 'C₈H₈O₃', nota: 'El aroma de la vainilla.', mol: vai, grupos: { 0: grupo(vai, [9]), 1: [6, 7, 8], 5: [10], 7: [0, 1, 2, 3, 4, 5] } },
    { nombre: 'Aspirina (ácido acetilsalicílico)', f: 'C₉H₈O₄', nota: 'Un medicamento para el dolor y la fiebre.', mol: asp, grupos: { 3: grupo(asp, [6, 7, 8]), 4: [9, 10, 11], 7: [0, 1, 2, 3, 4, 5] } },
    { nombre: 'Cafeína', f: 'C₈H₁₀N₄O₂', nota: 'La del café y el té: un alcaloide.', mol: caf, grupos: { 6: [0, 9, 5, 4, 11, 3, 6, 8] } },
  ]
}

export default function DetectorGrupos() {
  const [lista] = useState(casos)
  const [m, setM] = useState(0)
  const [g, setG] = useState<number | 'todos' | null>(null)
  useEffect(() => {
    const alTeclear = (ev: KeyboardEvent) => {
      const k = ev.key.toLowerCase()
      if (k === 'a' || k === 'arrowleft') setM((v) => (v + lista.length - 1) % lista.length)
      else if (k === 'd' || k === 'arrowright') setM((v) => (v + 1) % lista.length)
      else if (/^[1-8]$/.test(k)) setG(Number(k) - 1)
      else if (k === 't') setG('todos')
      else return
      ev.preventDefault()
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [lista.length])
  const C = lista[m]
  const tiene = Object.keys(C.grupos).map(Number)
  const resalta = g === 'todos' ? tiene.flatMap((k) => C.grupos[k]) : g !== null ? C.grupos[g] ?? [] : []
  const msg = g === null ? 'Elige un grupo (1–8) para buscarlo, o T para verlos todos.'
    : g === 'todos' ? `Tiene: ${tiene.map((k) => GRUPOS[k]).join(' · ')}`
    : tiene.includes(g) ? `Sí: ${GRUPOS[g]} (en amarillo).` : `No tiene ${GRUPOS[g]}.`

  return (
    <div data-diagrama className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button onClick={() => setM((v) => (v + lista.length - 1) % lista.length)} className="rounded-full border bg-white px-3 py-1 text-sm font-bold">← A</button>
        <span className="min-w-56 text-center font-bold">{C.nombre} · {C.f}</span>
        <button onClick={() => setM((v) => (v + 1) % lista.length)} className="rounded-full border bg-white px-3 py-1 text-sm font-bold">D →</button>
      </div>
      <svg viewBox="40 40 320 220" className="w-full max-w-lg rounded-xl bg-white" role="img" aria-label={`Estructura de ${C.nombre}`}>
        <Molecula mol={C.mol} resalta={resalta} />
      </svg>
      <p className="text-sm opacity-80">{C.nota}</p>
      <div className="flex max-w-2xl flex-wrap justify-center gap-1">
        {GRUPOS.map((n, k) => <button key={n} onClick={() => setG(k)} className={`rounded-full border px-3 py-1 text-xs font-semibold ${g === k ? 'bg-[var(--acento)] text-white' : 'bg-white'}`}>{k + 1} · {n}</button>)}
        <button onClick={() => setG('todos')} className={`rounded-full border px-3 py-1 text-xs font-semibold ${g === 'todos' ? 'bg-[var(--acento)] text-white' : 'bg-white'}`}>T · Todos</button>
      </div>
      <p className="text-sm font-bold">{msg}</p>
      <p className="max-w-xl text-center text-xs opacity-70">A/D o flechas: otra molécula · 1–8: buscar un grupo · T: todos. En los anillos cada vértice es un carbono con sus hidrógenos sin dibujar. El –OH de la vainillina está en el anillo: es un fenol.</p>
    </div>
  )
}
