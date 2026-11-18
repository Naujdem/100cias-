import { useEffect, useState } from 'react'

// Extremidades homólogas: el mismo plan de huesos (húmero, radio y cúbito, carpos, falanges) en el brazo humano,
// el ala del murciélago, la aleta de la ballena y el ala del ave. El dibujo se transforma de una a otra.
// `Extremidad` se reutiliza en la escena `ev-anatomia`.

export type Especie = 'humano' | 'murcielago' | 'ballena' | 'ave'
export type Hueso = 'humero' | 'antebrazo' | 'carpos' | 'falanges'

export const HUESOS: { id: Hueso; n: string; c: string }[] = [
  { id: 'humero', n: 'Húmero', c: '#3f6fb8' },
  { id: 'antebrazo', n: 'Radio y cúbito', c: '#4f8a3c' },
  { id: 'carpos', n: 'Carpos', c: '#d99a12' },
  { id: 'falanges', n: 'Falanges', c: '#c43c3c' },
]
export const ESPECIES: { id: Especie; n: string; ic: string; uso: string }[] = [
  { id: 'humano', n: 'Brazo humano', ic: '🧍', uso: 'agarrar' },
  { id: 'murcielago', n: 'Ala de murciélago', ic: '🦇', uso: 'volar' },
  { id: 'ballena', n: 'Aleta de ballena', ic: '🐋', uso: 'nadar' },
  { id: 'ave', n: 'Ala de ave', ic: '🐦', uso: 'volar' },
]

/** largo del húmero, del antebrazo, de los carpos y [largo, ángulo] de cada dedo */
const FORMAS: Record<Especie, { h: number; a: number; c: number; d: [number, number][] }> = {
  humano: { h: 95, a: 80, c: 18, d: [[38, -38], [50, -14], [56, 0], [50, 12], [40, 26]] },
  murcielago: { h: 60, a: 95, c: 10, d: [[22, -55], [115, -38], [125, -12], [110, 12], [90, 36]] },
  ballena: { h: 32, a: 34, c: 22, d: [[50, -22], [92, -9], [100, 2], [84, 13], [52, 24]] },
  ave: { h: 70, a: 85, c: 24, d: [[18, -20], [52, 0], [24, 14], [0, 0], [0, 0]] },
}
const mov = 'transform 1s cubic-bezier(.45,.05,.25,1), opacity 0.6s ease'

/** Dibujo en coordenadas propias: el hombro está en (0, 0) y la extremidad crece hacia la derecha. */
export function Extremidad({ especie, resalta = null }: { especie: Especie; resalta?: Hueso | null }) {
  const f = FORMAS[especie]
  const col = (h: Hueso) => {
    const c = HUESOS.find((x) => x.id === h)!.c
    return { fill: c, opacity: resalta && resalta !== h ? 0.18 : 1, transition: mov }
  }
  const seg = (x: number, largo: number, alto: number, h: Hueso, dy = 0) => (
    <g style={{ transition: mov, transform: `translate(${x}px, ${dy}px)` }}>
      <rect x="0" y={-alto / 2} width="100" height={alto} rx={alto / 2} style={{ ...col(h), transformOrigin: '0 0', transform: `scaleX(${largo / 100})` }} />
    </g>
  )
  const x2 = f.h + 4
  const x3 = x2 + f.a + 4
  const x4 = x3 + f.c + 4
  const puntas = f.d.map(([l, ang]) => [x4 + l * Math.cos((ang * Math.PI) / 180), l * Math.sin((ang * Math.PI) / 180)])
  return (
    <g>
      {/* piel del ala o de la aleta */}
      <polygon points={[[x3, -6], ...puntas.slice(1, 5), [x3 - 30, 30], [0, 10]].map((p) => p.join(',')).join(' ')}
        fill="#d9c4b4" style={{ transition: mov, opacity: especie === 'murcielago' ? 0.55 : 0 }} />
      <ellipse cx={(x4 + 80) / 2} cy="2" rx={(x4 + 120) / 2} ry="34" fill="#bfd0dc" style={{ transition: mov, opacity: especie === 'ballena' ? 0.6 : 0 }} />
      <path d={`M 10 -8 Q ${x4} -40 ${x4 + 140} -20 L ${x4 + 150} 0 Q ${x4} 10 10 10 Z`} fill="#eee6d8" style={{ transition: mov, opacity: especie === 'ave' ? 0.8 : 0 }} />
      {seg(0, f.h, 14, 'humero')}
      {seg(x2, f.a, 6, 'antebrazo', -5)}
      {seg(x2, f.a, 6, 'antebrazo', 5)}
      {seg(x3, f.c, 16, 'carpos')}
      {f.d.map(([l, ang], k) => (
        <g key={k} style={{ transition: mov, transform: `translate(${x4}px, 0px) rotate(${ang}deg)` }}>
          <rect x="0" y="-3" width="100" height="6" rx="3" style={{ ...col('falanges'), transformOrigin: '0 0', transform: `scaleX(${l / 100})`, opacity: l === 0 ? 0 : col('falanges').opacity }} />
        </g>
      ))}
    </g>
  )
}

export default function ExtremidadesHomologas() {
  const [especie, setEspecie] = useState<Especie>('humano')
  const [resalta, setResalta] = useState<Hueso | null>(null)
  const e = ESPECIES.find((x) => x.id === especie)!

  useEffect(() => {
    const alTeclear = (ev: KeyboardEvent) => {
      const n = Number(ev.key)
      if (n >= 1 && n <= 4) setEspecie(ESPECIES[n - 1].id)
      const h = { h: 'humero', r: 'antebrazo', c: 'carpos', f: 'falanges' }[ev.key.toLowerCase()] as Hueso | undefined
      if (h) setResalta((r) => (r === h ? null : h))
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [])

  return (
    <div data-diagrama className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap justify-center gap-2">
        {ESPECIES.map((x, k) => (
          <button key={x.id} onClick={() => setEspecie(x.id)}
            className={`rounded-full border px-3 py-1 text-sm font-semibold ${x.id === especie ? 'bg-[var(--acento)] text-white' : 'bg-white'}`}>
            {k + 1}. {x.ic} {x.n}
          </button>
        ))}
      </div>
      <svg viewBox="0 0 600 260" role="img" aria-label={`${e.n}: huesos homólogos`} className="mx-auto w-full max-w-3xl">
        <rect width="600" height="260" fill="#f4f1ea" rx="14" />
        <g transform="translate(70 130)"><Extremidad especie={especie} resalta={resalta} /></g>
        <text x="300" y="240" textAnchor="middle" fontSize="15" fontWeight="800" fill="#3a3a3a">{e.ic} {e.n}: sirve para {e.uso}</text>
      </svg>
      <div className="flex flex-wrap justify-center gap-2">
        {HUESOS.map((h) => (
          <button key={h.id} onClick={() => setResalta(resalta === h.id ? null : h.id)}
            className="rounded-full border px-3 py-1 text-sm font-semibold"
            style={{ borderColor: h.c, background: resalta === h.id ? h.c : '#fff', color: resalta === h.id ? '#fff' : h.c }}>
            {h.n} <span className="opacity-60">({h.id[0].toUpperCase()})</span>
          </button>
        ))}
      </div>
      <p className="max-w-xl text-center text-sm">Cambia de animal (teclas 1 a 4) y sigue un hueso (H, R, C, F): los mismos huesos, en el mismo orden, con funciones distintas. Son estructuras <b>homólogas</b>.</p>
    </div>
  )
}
