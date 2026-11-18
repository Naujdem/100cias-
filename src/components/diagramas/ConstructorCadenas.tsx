import { useEffect, useState } from 'react'
import { Molecula, construir, type Atomo, type Enlace } from '../escenas/Molecula.tsx'

// Explora (Química orgánica, temas 3 y 4): constructor de cadenas que nombra la molécula.
// W/S alargan o acortan la cadena principal; A/D mueven el cursor; Q pone o quita metilos en el carbono del cursor;
// E (solo en alquenos y alquinos) cambia el enlace que sigue al cursor: sencillo → doble → triple; R reinicia.
// Nombra con la regla de la cadena más larga y los localizadores más bajos (primero el enlace múltiple).
// Los metilos solo van en carbonos internos, así la cadena dibujada siempre es la principal.

const RAIZ = ['', 'met', 'et', 'prop', 'but', 'pent', 'hex', 'hept', 'oct', 'non', 'dec']
const MULT = ['', '', 'di', 'tri', 'tetra', 'penta', 'hexa']
const SUB = '₀₁₂₃₄₅₆₇₈₉'
const sub = (n: number) => String(n).replace(/\d/g, (d) => SUB[Number(d)])

function nombrar(n: number, metilos: number[], multi: { k: number; o: number } | null) {
  const versiones = [false, true].map((rev) => {
    const loc = (i: number) => (rev ? n - i : i + 1)
    const subs = metilos.flatMap((m, i) => Array(m).fill(loc(i))).sort((a, b) => a - b)
    const ml = multi ? Math.min(loc(multi.k), loc(multi.k + 1)) : 0
    return { subs, ml }
  })
  const mejor = (a: typeof versiones[0], b: typeof versiones[0]) => {
    if (a.ml !== b.ml) return a.ml < b.ml ? a : b
    for (let i = 0; i < a.subs.length; i++) if (a.subs[i] !== b.subs[i]) return a.subs[i] < b.subs[i] ? a : b
    return a
  }
  const v = mejor(versiones[0], versiones[1])
  const rev = v === versiones[1]
  const pre = v.subs.length ? `${v.subs.join(',')}-${MULT[v.subs.length]}metil` : ''
  const fin = !multi ? 'ano' : multi.o === 2 ? 'eno' : 'ino'
  const conLoc = multi && n >= 4
  const tradicional = `${pre}${pre && conLoc ? '-' : ''}${conLoc ? `${v.ml}-` : ''}${RAIZ[n]}${fin}`
  const actual = multi && n >= 4 ? `${pre}${RAIZ[n]}-${v.ml}-${fin}` : tradicional
  return { tradicional, actual, rev }
}

export function ConstructorCadenas({ multiples = true }: { multiples?: boolean }) {
  const [n, setN] = useState(4)
  const [met, setMet] = useState<number[]>(Array(10).fill(0))
  const [multi, setMulti] = useState<{ k: number; o: number } | null>(null)
  const [cur, setCur] = useState(1)
  const [aviso, setAviso] = useState('')

  const orden = (k: number) => (multi && multi.k === k ? multi.o : 1)
  const usados = (i: number, m = met, mu = multi) => {
    const o = (k: number) => (mu && mu.k === k ? mu.o : 1)
    return (i > 0 ? o(i - 1) : 0) + (i < n - 1 ? o(i) : 0) + m[i]
  }

  const cambiarN = (d: number) => {
    const nn = Math.max(1, Math.min(10, n + d))
    setN(nn); setAviso('')
    setMet((m) => m.map((x, i) => (i >= 1 && i <= nn - 2 ? x : 0)))
    setMulti((mu) => (mu && mu.k < nn - 1 ? mu : null))
    setCur((c) => Math.min(c, nn - 1))
  }
  const ponerMetilo = (i: number) => {
    if (i === 0 || i === n - 1) { setAviso('Un metilo en la punta alarga la cadena: ponlo en un carbono de adentro.'); return }
    const nuevo = met.map((x, j) => (j === i ? (x + 1) % 3 : x))
    if (usados(i, nuevo) > 4) { setAviso('Ese carbono ya tiene sus 4 enlaces ocupados.'); setMet(met.map((x, j) => (j === i ? 0 : x))); return }
    setMet(nuevo); setAviso('')
  }
  const cambiarEnlace = (k: number) => {
    if (!multiples || k >= n - 1) return
    const o = orden(k) === 3 ? 1 : orden(k) + 1
    const mu = o === 1 ? null : { k, o }
    if (usados(k, met, mu) > 4 || usados(k + 1, met, mu) > 4) { setAviso('No cabe: algún carbono pasaría de 4 enlaces. Quita un metilo primero.'); setMulti(null); return }
    setMulti(mu); setAviso('')
  }
  const reiniciar = () => { setN(4); setMet(Array(10).fill(0)); setMulti(null); setCur(1); setAviso('') }

  useEffect(() => {
    const alTeclear = (ev: KeyboardEvent) => {
      const k = ev.key.toLowerCase()
      if (k === 'w') cambiarN(1)
      else if (k === 's') cambiarN(-1)
      else if (k === 'a' || k === 'arrowleft') setCur((c) => Math.max(0, c - 1))
      else if (k === 'd' || k === 'arrowright') setCur((c) => Math.min(n - 1, c + 1))
      else if (k === 'q') ponerMetilo(cur)
      else if (k === 'e' && multiples) cambiarEnlace(cur)
      else if (k === 'r') reiniciar()
      else return
      ev.preventDefault()
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  })

  const paso = Math.min(36, 340 / Math.max(1, n - 1))
  const x0 = 200 - ((n - 1) * paso) / 2
  const pesados: Atomo[] = Array.from({ length: n }, (_, i) => ['C', x0 + i * paso, 150])
  const enl: Enlace[] = Array.from({ length: n - 1 }, (_, i) => [i, i + 1, orden(i)])
  met.slice(0, n).forEach((m, i) => {
    for (let j = 0; j < m; j++) { pesados.push(['C', x0 + i * paso, j === 0 ? 108 : 192]); enl.push([i, pesados.length - 1, 1]) }
  })
  const mol = construir(pesados, enl, 'todos', 18)
  const totalMet = met.slice(0, n).reduce((a, b) => a + b, 0)
  const C = n + totalMet
  const H = 2 * C + 2 - 2 * ((multi?.o ?? 1) - 1)
  const { tradicional, actual, rev } = nombrar(n, met.slice(0, n), multi)
  const semi = Array.from({ length: n }, (_, i) => {
    const h = 4 - usados(i)
    const base = `C${h ? 'H' + (h > 1 ? sub(h) : '') : ''}${met[i] ? `(CH₃)${met[i] > 1 ? '₂' : ''}` : ''}`
    return i < n - 1 ? base + ['–', '–', '=', '≡'][orden(i)] : base
  }).join('')

  return (
    <div data-diagrama className="flex flex-col items-center gap-3">
      <div className="text-center">
        <p className="text-2xl font-black">{tradicional}</p>
        {multi && n >= 4 && <p className="text-xs opacity-70">Nombre IUPAC actual: {actual}</p>}
      </div>
      <svg viewBox="0 70 400 160" className="w-full max-w-2xl rounded-xl bg-white" role="img" aria-label={`Molécula de ${tradicional}`}>
        <rect x={x0 + cur * paso - 15} y="133" width="30" height="34" rx="8" fill="#fdf1c7" stroke="#d9a400" strokeWidth="2" />
        <Molecula mol={mol} s={0.9} />
        {Array.from({ length: n }, (_, i) => (
          <g key={i}>
            <text x={x0 + i * paso} y="222" textAnchor="middle" fontSize="11" fontWeight="800" fill="#3f6fb8">{rev ? n - i : i + 1}</text>
            <rect x={x0 + i * paso - 14} y="136" width="28" height="28" fill="transparent" className="cursor-pointer" onClick={() => { setCur(i); ponerMetilo(i) }} />
            {multiples && i < n - 1 && <rect x={x0 + i * paso + 10} y="142" width={paso - 20} height="16" fill="transparent" className="cursor-pointer" onClick={() => { setCur(i); cambiarEnlace(i) }} />}
          </g>
        ))}
      </svg>
      <p className="font-mono text-sm font-bold">{semi} · C{sub(C)}H{sub(H)}</p>
      <div className="flex flex-wrap justify-center gap-2 text-sm">
        <button onClick={() => cambiarN(-1)} className="rounded-full border bg-white px-3 py-1 font-semibold">Más corta (S)</button>
        <button onClick={() => cambiarN(1)} className="rounded-full border bg-white px-3 py-1 font-semibold">Más larga (W)</button>
        <button onClick={() => ponerMetilo(cur)} className="rounded-full border bg-white px-3 py-1 font-semibold">Metilo (Q)</button>
        {multiples && <button onClick={() => cambiarEnlace(cur)} className="rounded-full border bg-white px-3 py-1 font-semibold">Enlace (E)</button>}
        <button onClick={reiniciar} className="rounded-full border bg-white px-3 py-1 font-semibold">Reiniciar (R)</button>
      </div>
      {aviso && <p className="text-sm font-bold text-red-700">{aviso}</p>}
      <p className="max-w-xl text-center text-xs opacity-70">
        W/S: largo de la cadena · A/D: mover el cursor · Q: metilo en el carbono del cursor (0, 1 o 2){multiples ? ' · E: enlace después del cursor (sencillo → doble → triple)' : ''}. Los números azules muestran por dónde se empieza a contar: {multiples ? 'primero el enlace múltiple con el número más bajo, luego los metilos.' : 'los metilos deben quedar con los números más bajos.'}
      </p>
    </div>
  )
}

export const ConstructorAlcanos = () => <ConstructorCadenas multiples={false} />
export default ConstructorCadenas
