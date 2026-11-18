import { useEffect, useState } from 'react'

// Explora (Química área 2, tema 7): constructor de geometrías (TRePEV / VSEPR). El estudiante elige cuántos
// átomos se unen al átomo central (Q/A) y cuántos pares libres tiene (W/S); la app dibuja la forma, el ángulo
// y un ejemplo.

type Geo = { nombre: string; angulo: string; ejemplo: string; nota: string }
const GEOS: Record<string, Geo> = {
  '2-0': { nombre: 'Lineal', angulo: '180°', ejemplo: 'CO₂, BeCl₂', nota: 'Dos grupos de electrones se alejan al máximo: en línea recta.' },
  '3-0': { nombre: 'Trigonal plana', angulo: '120°', ejemplo: 'BF₃, SO₃', nota: 'Tres grupos en un mismo plano, como un triángulo.' },
  '2-1': { nombre: 'Angular', angulo: '≈ 117–119°', ejemplo: 'SO₂, O₃', nota: 'El par libre empuja los enlaces y dobla la molécula.' },
  '4-0': { nombre: 'Tetraédrica', angulo: '109,5°', ejemplo: 'CH₄, CCl₄', nota: 'Cuatro grupos en 3D: los vértices de un tetraedro.' },
  '3-1': { nombre: 'Piramidal', angulo: '≈ 107°', ejemplo: 'NH₃', nota: 'Un par libre arriba: queda una pirámide de base triangular.' },
  '2-2': { nombre: 'Angular', angulo: '≈ 104,5°', ejemplo: 'H₂O', nota: 'Dos pares libres empujan más: el agua queda doblada.' },
}
// direcciones en «falsa 3D» (x, y en el dibujo; z > 0 hacia el lector)
const DIRS: Record<number, [number, number, number][]> = {
  2: [[-1, 0, 0], [1, 0, 0]],
  3: [[0, -1, 0], [0.87, 0.5, 0], [-0.87, 0.5, 0]],
  4: [[0, -1, 0], [0.94, 0.33, 0.4], [-0.47, 0.33, 0.8], [-0.47, 0.33, -0.8]],
}

export default function GeometriaVsepr() {
  const [enl, setEnl] = useState(2)
  const [lib, setLib] = useState(2)
  const total = enl + lib
  const valido = total >= 2 && total <= 4 && enl >= 2
  const g = GEOS[`${enl}-${lib}`]

  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      const t = e.key.toLowerCase()
      if (t === 'q') setEnl((v) => Math.min(4, v + 1))
      if (t === 'a') setEnl((v) => Math.max(2, v - 1))
      if (t === 'w') setLib((v) => Math.min(2, v + 1))
      if (t === 's') setLib((v) => Math.max(0, v - 1))
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [])

  const dirs = valido ? DIRS[total] : []
  // los pares libres ocupan las primeras direcciones (arriba), los enlaces el resto
  const pares = dirs.slice(0, lib)
  const enlaces = dirs.slice(lib)
  const L = 80
  const cx = 150, cy = 110

  return (
    <div data-diagrama className="grid items-center gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
      <svg viewBox="0 0 300 220" role="img" aria-label={g ? `Geometría ${g.nombre}` : 'Combinación no válida'} className="mx-auto w-full max-w-md">
        <rect width="300" height="220" rx="14" fill="#f2f0f7" />
        {valido && (
          <>
            {pares.map(([x, y], k) => (
              <ellipse key={`p${k}`} cx={cx + x * 42} cy={cy + y * 42} rx="30" ry="17" transform={`rotate(${(Math.atan2(y, x) * 180) / Math.PI} ${cx + x * 42} ${cy + y * 42})`} fill="#3f6fb8" opacity="0.22" />
            ))}
            {pares.map(([x, y], k) => (
              <g key={`pp${k}`}><circle cx={cx + x * 46 - y * 5} cy={cy + y * 46 + x * 5} r="3" fill="#3f6fb8" /><circle cx={cx + x * 46 + y * 5} cy={cy + y * 46 - x * 5} r="3" fill="#3f6fb8" /></g>
            ))}
            {[...enlaces].sort((a, b) => a[2] - b[2]).map(([x, y, z], k) => (
              <g key={`e${k}`}>
                <line x1={cx} y1={cy} x2={cx + x * L} y2={cy + y * L} stroke="#3a3a3a" strokeWidth={z > 0.2 ? 6 : 3} strokeDasharray={z < -0.2 ? '4 4' : undefined} />
                <circle cx={cx + x * L} cy={cy + y * L} r={z > 0.2 ? 15 : z < -0.2 ? 11 : 13} fill="#f2f2f2" stroke="#3a3a3a" strokeWidth="1.5" />
              </g>
            ))}
            <circle cx={cx} cy={cy} r="17" fill="#c43c3c" />
            <text x={cx} y={cy + 5} textAnchor="middle" fontSize="13" fontWeight="800" fill="#fff">A</text>
          </>
        )}
        {!valido && <text x="150" y="115" textAnchor="middle" fontSize="13" fontWeight="700">Combina hasta 4 grupos (enlaces + pares libres)</text>}
      </svg>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between rounded-xl border bg-white px-3 py-2">
          <span className="text-sm font-semibold">Átomos unidos al central: {enl}</span>
          <span className="flex gap-1">
            <button onClick={() => setEnl(Math.max(2, enl - 1))} className="h-9 w-12 rounded-full border text-sm font-bold">− A</button>
            <button onClick={() => setEnl(Math.min(4, enl + 1))} className="h-9 w-12 rounded-full bg-[var(--acento)] text-sm font-bold text-white">+ Q</button>
          </span>
        </div>
        <div className="flex items-center justify-between rounded-xl border bg-white px-3 py-2">
          <span className="text-sm font-semibold text-[#3f6fb8]">Pares libres del central: {lib}</span>
          <span className="flex gap-1">
            <button onClick={() => setLib(Math.max(0, lib - 1))} className="h-9 w-12 rounded-full border text-sm font-bold">− S</button>
            <button onClick={() => setLib(Math.min(2, lib + 1))} className="h-9 w-12 rounded-full bg-[var(--acento)] text-sm font-bold text-white">+ W</button>
          </span>
        </div>
        <div className="rounded-xl border-2 border-[var(--acento)] bg-white p-3 text-center">
          {g ? (
            <>
              <p className="text-xl font-bold">{g.nombre}</p>
              <p className="text-sm">Ángulo: {g.angulo} · Ejemplo: {g.ejemplo}</p>
              <p className="mt-1 text-sm">{g.nota}</p>
            </>
          ) : <p className="text-sm">Con más de 4 grupos se forman otras geometrías (bipirámide, octaedro), que no se ven en el colegio.</p>}
        </div>
        <p className="text-xs opacity-70">Idea clave: los pares de electrones se repelen y se alejan lo más posible. Línea gruesa = hacia ti; punteada = hacia atrás.</p>
      </div>
    </div>
  )
}
