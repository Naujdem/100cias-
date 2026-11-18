import { useEffect, useState } from 'react'

// Deriva génica: cinco poblaciones empiezan con la mitad de alelos A y la mitad a. En cada generación los hijos
// sacan sus alelos al azar de los padres (modelo de Wright-Fisher). Con poblaciones pequeñas el azar fija o
// pierde un alelo muy rápido; con poblaciones grandes, las frecuencias casi no se mueven.

const TAMANOS = [10, 50, 500]
const GEN = 50
const COLORES = ['#3f6fb8', '#c43c3c', '#4f8a3c', '#d99a12', '#7a3b8c']

function binomial(n: number, p: number) {
  let k = 0
  for (let i = 0; i < n; i++) if (Math.random() < p) k++
  return k
}

function simular(n: number): number[][] {
  return COLORES.map(() => {
    const serie = [0.5]
    let p = 0.5
    for (let g = 1; g <= GEN; g++) {
      p = binomial(2 * n, p) / (2 * n)
      serie.push(p)
    }
    return serie
  })
}

export default function SimuladorDeriva() {
  const [t, setT] = useState(0)
  const [series, setSeries] = useState(() => simular(TAMANOS[0]))
  const repetir = (k = t) => { setT(k); setSeries(simular(TAMANOS[k])) }

  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      const n = Number(e.key)
      if (n >= 1 && n <= 3) document.getElementById(`sd-t${n - 1}`)?.click()
      if (e.key.toLowerCase() === 'g') document.getElementById('sd-otra')?.click()
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [])

  const fijadas = series.filter((s) => s[GEN] === 0 || s[GEN] === 1).length
  const X = (g: number) => 60 + (g / GEN) * 500
  const Y = (p: number) => 250 - p * 210
  return (
    <div data-diagrama className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap justify-center gap-2">
        {TAMANOS.map((n, k) => (
          <button id={`sd-t${k}`} key={n} onClick={() => repetir(k)} className={`rounded-full border px-3 py-1 text-sm font-semibold ${k === t ? 'bg-[var(--acento)] text-white' : 'bg-white'}`}>
            {k + 1}. Población de {n}
          </button>
        ))}
        <button id="sd-otra" onClick={() => repetir()} className="rounded-full border bg-white px-3 py-1 text-sm font-semibold">🎲 Otra vez (G)</button>
      </div>
      <svg viewBox="0 0 600 290" role="img" aria-label="Simulación de deriva génica" className="mx-auto w-full max-w-3xl">
        <rect width="600" height="290" rx="14" fill="#f4f1ea" />
        {[0, 0.5, 1].map((p) => (
          <g key={p}>
            <line x1="60" x2="560" y1={Y(p)} y2={Y(p)} stroke="#ddd" />
            <text x="52" y={Y(p) + 4} textAnchor="end" fontSize="11" fontWeight="700">{p * 100} %</text>
          </g>
        ))}
        {series.map((s, k) => (
          <polyline key={k} fill="none" stroke={COLORES[k]} strokeWidth="2.5" points={s.map((p, g) => `${X(g)},${Y(p)}`).join(' ')} />
        ))}
        <text x="310" y="278" textAnchor="middle" fontSize="11" fontWeight="700">generaciones (0 a {GEN})</text>
        <text x="20" y="20" fontSize="11" fontWeight="700">frecuencia del alelo A</text>
        <text x="580" y="20" textAnchor="end" fontSize="12" fontWeight="800" fill="#c43c3c">{fijadas} de 5 poblaciones fijaron o perdieron A</text>
      </svg>
      <p className="max-w-xl text-center text-sm">Cada línea es una población distinta. Nadie selecciona: solo el azar decide qué alelos pasan a la siguiente generación. Compara una población de 10 con una de 500.</p>
    </div>
  )
}
