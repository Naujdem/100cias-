import { useEffect, useState } from 'react'

// Explora (Química orgánica, tema 7): fábrica de olores. Q cambia el ácido, W el alcohol; muestra la reacción de
// esterificación con fórmulas semidesarrolladas, el nombre del éster y su aroma (si es uno conocido).
// Aromas aproximados de referencia: verificar con un texto de química orgánica.

const ACIDOS = [
  { n: 'ácido metanoico (fórmico)', r: 'H', raiz: 'metanoato' },
  { n: 'ácido etanoico (acético)', r: 'CH₃', raiz: 'etanoato' },
  { n: 'ácido butanoico (butírico)', r: 'CH₃–CH₂–CH₂', raiz: 'butanoato' },
  { n: 'ácido salicílico', r: 'C₆H₄(OH)', raiz: 'salicilato' },
]
const ALCOHOLES = [
  { n: 'metanol', r: 'CH₃', ilo: 'metilo' },
  { n: 'etanol', r: 'CH₂–CH₃', ilo: 'etilo' },
  { n: 'propanol', r: 'CH₂–CH₂–CH₃', ilo: 'propilo' },
  { n: 'alcohol isoamílico', r: 'CH₂–CH₂–CH(CH₃)₂', ilo: 'isoamilo' },
  { n: 'octanol', r: '(CH₂)₇–CH₃', ilo: 'octilo' },
]
const AROMAS: Record<string, [string, string]> = {
  '0-1': ['🥃', 'ron y frambuesa'],
  '1-1': ['💅', 'quitaesmalte y pegante (afrutado)'],
  '1-2': ['🍐', 'pera'],
  '1-3': ['🍌', 'banano'],
  '1-4': ['🍊', 'naranja'],
  '2-0': ['🍎', 'manzana'],
  '2-1': ['🍍', 'piña'],
  '2-3': ['🍑', 'pera y albaricoque'],
  '3-0': ['🌿', 'pomada mentolada (aceite de gaulteria)'],
}

export default function FabricaOlores() {
  const [a, setA] = useState(1)
  const [b, setB] = useState(3)
  useEffect(() => {
    const alTeclear = (ev: KeyboardEvent) => {
      const k = ev.key.toLowerCase()
      if (k === 'q') setA((v) => (v + 1) % ACIDOS.length)
      else if (k === 'w') setB((v) => (v + 1) % ALCOHOLES.length)
      else return
      ev.preventDefault()
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [])
  const A = ACIDOS[a], B = ALCOHOLES[b]
  const aroma = AROMAS[`${a}-${b}`]
  return (
    <div data-diagrama className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap justify-center gap-1">
        {ACIDOS.map((x, j) => <button key={x.n} onClick={() => setA(j)} className={`rounded-full border px-3 py-1 text-xs font-semibold ${a === j ? 'bg-[#c43c3c] text-white' : 'bg-white'}`}>{x.n}</button>)}
      </div>
      <div className="flex flex-wrap justify-center gap-1">
        {ALCOHOLES.map((x, j) => <button key={x.n} onClick={() => setB(j)} className={`rounded-full border px-3 py-1 text-xs font-semibold ${b === j ? 'bg-[#3f6fb8] text-white' : 'bg-white'}`}>{x.n}</button>)}
      </div>
      <div className="w-full max-w-3xl rounded-xl bg-white p-4 text-center">
        <p className="font-mono text-base font-bold">
          <span className="text-[#c43c3c]">{A.r}–CO<span className="rounded bg-yellow-200">OH</span></span>
          {' + '}
          <span className="text-[#3f6fb8]"><span className="rounded bg-yellow-200">H</span>O–{B.r}</span>
          {' ⇌ '}
          <span className="text-[#c43c3c]">{A.r}–COO</span><span className="text-[#3f6fb8]">–{B.r}</span>
          {' + '}
          <span className="rounded bg-yellow-200">H₂O</span>
        </p>
        <p className="mt-1 text-xs opacity-70">El OH del ácido y el H del alcohol salen como agua (en amarillo); lo demás se une por el oxígeno.</p>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-6xl">{aroma ? aroma[0] : '🧪'}</span>
        <div>
          <p className="text-xl font-black">{A.raiz} de {B.ilo}</p>
          <p className="text-sm font-semibold">{aroma ? `Huele a ${aroma[1]}.` : 'Un éster de olor afrutado, sin un aroma famoso.'}</p>
        </div>
      </div>
      <p className="max-w-xl text-center text-xs opacity-70">Q: otro ácido · W: otro alcohol (o toca los botones). En el laboratorio se calienta con un poco de ácido sulfúrico como catalizador; la reacción es reversible. Los aromas de las frutas reales mezclan muchos compuestos.</p>
    </div>
  )
}
