import { useEffect, useState } from 'react'

// Explora (Química área 2, tema 3): llenar orbitales. El estudiante elige un elemento (Z de 1 a 36) o agrega
// electrones uno por uno, y ve las cajas llenarse según el orden de Moeller, la regla de Hund y la de Pauli.

const SIM = ['', 'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca',
  'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr']
const NOM = ['', 'Hidrógeno', 'Helio', 'Litio', 'Berilio', 'Boro', 'Carbono', 'Nitrógeno', 'Oxígeno', 'Flúor', 'Neón', 'Sodio',
  'Magnesio', 'Aluminio', 'Silicio', 'Fósforo', 'Azufre', 'Cloro', 'Argón', 'Potasio', 'Calcio', 'Escandio', 'Titanio', 'Vanadio',
  'Cromo', 'Manganeso', 'Hierro', 'Cobalto', 'Níquel', 'Cobre', 'Zinc', 'Galio', 'Germanio', 'Arsénico', 'Selenio', 'Bromo', 'Kriptón']
const ORDEN = [
  { s: '1s', n: 1, cajas: 1 }, { s: '2s', n: 2, cajas: 1 }, { s: '2p', n: 2, cajas: 3 }, { s: '3s', n: 3, cajas: 1 },
  { s: '3p', n: 3, cajas: 3 }, { s: '4s', n: 4, cajas: 1 }, { s: '3d', n: 3, cajas: 5 }, { s: '4p', n: 4, cajas: 3 },
]
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹'
const sup = (k: number) => String(k).split('').map((d) => SUP[+d]).join('')

/** Reparte z electrones: por subnivel en orden de Moeller; dentro de él, primero uno por caja (Hund). */
function repartir(z: number) {
  let quedan = z
  return ORDEN.map((o) => {
    const m = Math.min(o.cajas * 2, quedan)
    quedan -= m
    const cajas = Array.from({ length: o.cajas }, (_, k) => (k < m ? 1 : 0) + (k + o.cajas < m ? 1 : 0))
    return { ...o, m, cajas }
  })
}

export default function LlenaOrbitales() {
  const [z, setZ] = useState(8)
  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      const t = e.key.toLowerCase()
      if (t === 'd' || t === 'e') setZ((v) => Math.min(36, v + 1))
      if (t === 'a' || t === 'q') setZ((v) => Math.max(1, v - 1))
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [])

  const subs = repartir(z)
  const usados = subs.filter((s) => s.m > 0)
  const ultimo = usados[usados.length - 1]
  const config = usados.map((s) => `${s.s}${sup(s.m)}`).join(' ')
  const nMax = Math.max(...usados.map((s) => s.n))
  const valencia = usados.filter((s) => s.n === nMax).reduce((a, s) => a + s.m, 0)
  const desap = subs.reduce((a, s) => a + s.cajas.filter((c) => c === 1).length, 0)

  return (
    <div data-diagrama className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-3">
        <button onClick={() => setZ(Math.max(1, z - 1))} className="h-10 rounded-full border bg-white px-3 text-sm font-semibold">− 1 e⁻ (A)</button>
        <div className="text-center">
          <p className="text-xl font-bold">{NOM[z]} ({SIM[z]})</p>
          <p className="text-sm">Z = {z} · {z} electrones</p>
        </div>
        <button onClick={() => setZ(Math.min(36, z + 1))} className="h-10 rounded-full bg-[var(--acento)] px-3 text-sm font-semibold text-white">+ 1 e⁻ (D)</button>
      </div>
      <input type="range" min={1} max={36} value={z} onChange={(e) => setZ(+e.target.value)} className="w-full max-w-md" aria-label="Número atómico" />
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-3">
        {subs.map((s) => (
          <div key={s.s} className={`flex flex-col items-center rounded-lg px-1 pb-1 ${s === ultimo ? 'bg-[#fff3cf]' : ''}`} style={{ opacity: s.m > 0 || s === subs.find((x) => x.m === 0) ? 1 : 0.35 }}>
            <div className="flex">
              {s.cajas.map((c, k) => (
                <div key={k} className="flex h-10 w-10 items-center justify-center gap-1 border-2 border-[#3a3a3a] bg-white text-lg font-bold" style={{ marginLeft: k ? -2 : 0 }}>
                  {c >= 1 && <span className="text-[#3f6fb8]">↑</span>}
                  {c === 2 && <span className="text-[#c43c3c]">↓</span>}
                </div>
              ))}
            </div>
            <span className="text-sm font-semibold">{s.s}{s.m ? sup(s.m) : ''}</span>
          </div>
        ))}
      </div>
      <div className="rounded-xl border-2 border-[var(--acento)] bg-white px-4 py-2 text-center">
        <p className="font-mono text-lg">{config}</p>
        <p className="text-sm">Último nivel: {nMax} · electrones de valencia: {valencia} · electrones desapareados: {desap}</p>
      </div>
      <p className="max-w-xl text-center text-xs opacity-70">
        {z === 24 || z === 29
          ? `Ojo: en la realidad el ${NOM[z].toLowerCase()} es una excepción y queda ${z === 24 ? '4s¹ 3d⁵' : '4s¹ 3d¹⁰'} (los subniveles d medio llenos o llenos son más estables).`
          : 'Fíjate en el 4s: se llena antes que el 3d. Y en los p: primero un electrón en cada caja (Hund), luego se aparean con giro opuesto (Pauli).'}
      </p>
    </div>
  )
}
