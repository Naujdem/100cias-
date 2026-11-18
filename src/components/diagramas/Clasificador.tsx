import { useEffect, useState } from 'react'

// Clasificador: se eligen dos seres vivos y se ve su clasificación completa, de dominio a especie, lado a lado.
// Los niveles que comparten se resaltan: cuanto más abajo llegan juntos, más cercano es su parentesco.

const NIVELES = ['Dominio', 'Reino', 'Filo', 'Clase', 'Orden', 'Familia', 'Género', 'Especie']
const SERES: { n: string; ic: string; t: string[] }[] = [
  { n: 'Oso de anteojos', ic: '🐻', t: ['Eukarya', 'Animalia', 'Chordata', 'Mammalia', 'Carnivora', 'Ursidae', 'Tremarctos', 'Tremarctos ornatus'] },
  { n: 'Jaguar', ic: '🐆', t: ['Eukarya', 'Animalia', 'Chordata', 'Mammalia', 'Carnivora', 'Felidae', 'Panthera', 'Panthera onca'] },
  { n: 'Ser humano', ic: '🧍', t: ['Eukarya', 'Animalia', 'Chordata', 'Mammalia', 'Primates', 'Hominidae', 'Homo', 'Homo sapiens'] },
  { n: 'Colibrí pico de espada', ic: '🐦', t: ['Eukarya', 'Animalia', 'Chordata', 'Aves', 'Apodiformes', 'Trochilidae', 'Ensifera', 'Ensifera ensifera'] },
  { n: 'Rana dorada', ic: '🐸', t: ['Eukarya', 'Animalia', 'Chordata', 'Amphibia', 'Anura', 'Dendrobatidae', 'Phyllobates', 'Phyllobates terribilis'] },
  { n: 'Frailejón', ic: '🌿', t: ['Eukarya', 'Plantae', 'Tracheophyta', 'Magnoliopsida', 'Asterales', 'Asteraceae', 'Espeletia', 'Espeletia grandiflora'] },
  { n: 'Maíz', ic: '🌽', t: ['Eukarya', 'Plantae', 'Tracheophyta', 'Liliopsida', 'Poales', 'Poaceae', 'Zea', 'Zea mays'] },
  { n: 'Champiñón', ic: '🍄', t: ['Eukarya', 'Fungi', 'Basidiomycota', 'Agaricomycetes', 'Agaricales', 'Agaricaceae', 'Agaricus', 'Agaricus bisporus'] },
  { n: 'Bacteria E. coli', ic: '🦠', t: ['Bacteria', 'Bacteria', 'Pseudomonadota', 'Gammaproteobacteria', 'Enterobacterales', 'Enterobacteriaceae', 'Escherichia', 'Escherichia coli'] },
]
const TECLAS_B = 'qwertyuio'

export default function Clasificador() {
  const [a, setA] = useState(0)
  const [b, setB] = useState(1)

  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      const n = Number(e.key)
      if (n >= 1 && n <= 9) setA(n - 1)
      const k = TECLAS_B.indexOf(e.key.toLowerCase())
      if (k >= 0) setB(k)
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [])

  const A = SERES[a]
  const B = SERES[b]
  let comparten = 0
  while (comparten < NIVELES.length && A.t[comparten] === B.t[comparten]) comparten++
  const ultimo = comparten > 0 ? `${NIVELES[comparten - 1].toLowerCase()} ${A.t[comparten - 1]}` : ''

  const botones = (sel: number, fijar: (k: number) => void, tecla: (k: number) => string) => (
    <div className="flex flex-wrap justify-center gap-1">
      {SERES.map((s, k) => (
        <button key={s.n} onClick={() => fijar(k)} title={s.n}
          className={`rounded-full border px-2 py-0.5 text-sm ${k === sel ? 'bg-[var(--acento)] text-white' : 'bg-white'}`}>
          <span className="opacity-60">{tecla(k)}</span> {s.ic}
        </button>
      ))}
    </div>
  )

  return (
    <div data-diagrama className="flex flex-col items-center gap-2">
      {botones(a, setA, (k) => String(k + 1))}
      <div className="w-full max-w-3xl overflow-hidden rounded-xl border bg-white text-sm">
        <div className="grid grid-cols-[7rem_1fr_1fr] bg-[#f4f1ea] font-bold">
          <div className="p-2">Nivel</div>
          <div className="p-2">{A.ic} {A.n}</div>
          <div className="p-2">{B.ic} {B.n}</div>
        </div>
        {NIVELES.map((nv, k) => {
          const igual = k < comparten
          const cursiva = k >= 6
          return (
            <div key={nv} className="grid grid-cols-[7rem_1fr_1fr] border-t transition-colors" style={{ background: igual ? '#e3f1dc' : undefined }}>
              <div className="p-2 font-semibold">{nv}</div>
              <div className="p-2" style={{ fontStyle: cursiva ? 'italic' : undefined }}>{A.t[k]}</div>
              <div className="p-2" style={{ fontStyle: cursiva ? 'italic' : undefined }}>{B.t[k]}</div>
            </div>
          )
        })}
      </div>
      {botones(b, setB, (k) => TECLAS_B[k].toUpperCase())}
      <p className="max-w-xl text-center text-sm font-semibold">
        {a === b ? 'Es el mismo ser vivo: comparten todo.' : comparten === 0 ? 'No comparten ni el dominio: su antepasado común es el más antiguo de todos.' : `Comparten hasta el nivel de ${ultimo}: ${comparten} de 8 niveles.`}
      </p>
      <p className="max-w-xl text-center text-xs opacity-70">Elige el primero con 1 a 9 y el segundo con Q a O. Cuantos más niveles comparten, más cercano es su antepasado común.</p>
    </div>
  )
}
