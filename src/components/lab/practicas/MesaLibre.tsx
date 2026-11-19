import { useState } from 'react'
import MesaViva from '../MesaViva.tsx'
import type { Pieza, Uso } from '../MesaViva.tsx'
import { Caneca } from '../dibujos.tsx'
import { REACTIVOS, evaluar, guardarPendiente, clave } from '../../../data/reaccionesLibre.ts'
import type { Resultado } from '../../../data/reaccionesLibre.ts'

// Mesa libre, Fase 1 (PLAN-LABORATORIOS.md). Parte 1: estante con los reactivos de las prácticas, tres vasos, mechero
// y el catálogo de `data/reaccionesLibre.ts`. Cada porción se echa tomando el frasco y soltándolo en un vaso; el vaso
// se lleva al mechero para calentarlo. Lo que no está en el catálogo se guarda como pendiente en el dispositivo.
// Pendiente (partes 2 a 4): efectos SVG completos, panel del docente con exportar/importar y libreta de descubrimientos.

interface Vaso { ids: string[]; calor: boolean }
const VACIO: Vaso = { ids: [], calor: false }
const MAX = 8

export default function MesaLibre({ grado }: { grado: number }) {
  const estante = REACTIVOS.filter((r) => r.desde <= grado)
  const [vasos, setVasos] = useState<Vaso[]>([VACIO, VACIO, VACIO])
  const [visto, setVisto] = useState(0)
  const [guardadas, setGuardadas] = useState<Set<string>>(new Set())
  const [msg, setMsg] = useState<string | null>(null)

  const res = vasos.map((v) => evaluar(v.ids, v.calor, grado))
  const colorVaso = (v: Vaso, r: Resultado) => {
    if (!v.ids.length) return null
    const ind = r.indicadores.filter((i) => i.c !== 'transparent')
    if (ind.length) return ind[ind.length - 1].c
    const final = [...r.reacciones].reverse().find((x) => x.colorFinal)
    if (final) return final.colorFinal!
    const liq = [...v.ids].reverse().map((id) => REACTIVOS.find((x) => x.id === id)!).find((x) => x.forma === 'liquido')
    return liq ? liq.color : '#eef3f6'
  }
  const fila = Math.ceil(estante.length / 2)
  const sep = Math.min(62, 880 / fila)
  const piezas: Pieza[] = [
    { id: 'repisa', nombre: 'Estante', x: 500, y: 250, ancho: 960, alto: 10, dibujo: <g><rect x="-480" y="-34" width="960" height="6" fill="#a5743f" /><rect x="-480" y="34" width="960" height="6" fill="#a5743f" /></g> },
    ...estante.map((r, k) => {
      const fil = k < fila ? 0 : 1
      const x = 60 + (k % fila) * sep
      const y = fil ? 278 : 210
      return {
        id: r.id, nombre: `${r.n}${r.peligro ? ` (⚠ ${r.peligro})` : ''}`, x, y, ancho: sep - 6, alto: 60, tomable: true, color: r.color,
        dibujo: <g>
          {r.forma === 'gotas'
            ? <g><rect x="-8" y="-12" width="16" height="32" rx="4" fill={r.color} stroke="#2b2b2b" strokeWidth="1.5" /><path d="M-5 -12 v-10 h10 v10" fill="#333" /></g>
            : r.forma === 'objeto'
              ? <rect x="-14" y="2" width="28" height="7" rx="2" fill={r.color} stroke="#2b2b2b" />
              : r.forma === 'solido'
                ? <g><rect x="-13" y="-16" width="26" height="34" rx="4" fill={r.color} stroke="#2b2b2b" strokeWidth="1.5" /><rect x="-13" y="-21" width="26" height="6" fill="#888" /></g>
                : <g><path d="M-6 -24 h12 v8 l6 6 v28 h-24 v-28 l6 -6 z" fill={r.color} stroke="#2b2b2b" strokeWidth="1.5" /></g>}
          {r.peligro && <path d="M8 -26 l6 10 h-12 z" fill="#f2c14e" stroke="#c0392b" />}
          <text y="30" textAnchor="middle" fontSize="7" fontWeight="700">{r.n.split(' ')[0].slice(0, 10)}</text>
        </g>,
      }
    }),
    ...vasos.map((v, k) => {
      const r = res[k]
      const color = colorVaso(v, r)
      const efectos = new Set(r.reacciones.flatMap((x) => x.efectos))
      const solido = r.reacciones.find((x) => x.colorSolido)?.colorSolido
      const h = Math.min(60, v.ids.length * 9)
      return {
        id: `v${k}`, nombre: `Vaso ${k + 1}${v.ids.length ? `: ${[...new Set(v.ids)].map((id) => REACTIVOS.find((x) => x.id === id)!.n.toLowerCase()).join(', ')}${v.calor ? ' (calentado)' : ''}` : ' (vacío)'}`,
        x: 300 + k * 160, y: 365, ancho: 90, alto: 90, tomable: v.ids.length > 0,
        dibujo: <g>
          {efectos.has('calor') && <circle r="46" fill="rgba(230,90,40,0.18)" />}
          {efectos.has('frio') && <circle r="46" fill="rgba(60,130,230,0.15)" />}
          <path d="M-32 -36 V30 Q-32 36 -26 36 H26 Q32 36 32 30 V-36" fill="rgba(255,255,255,0.6)" stroke="#2b2b2b" strokeWidth="2" />
          {color && <rect x="-30" y={34 - h} width="60" height={h} fill={color} opacity="0.85" style={{ transition: 'fill 1s' }} />}
          {efectos.has('capas') && <rect x="-30" y={34 - h} width="60" height="8" fill={solido ?? '#e9c94a'} />}
          {efectos.has('precipitado') && <ellipse cx="0" cy="31" rx="22" ry="4" fill={solido ?? '#fff'} stroke="#999" strokeWidth="0.5" />}
          {(efectos.has('burbujas') || efectos.has('espuma')) && [-14, 0, 14].map((x, i) => <circle key={x} cx={x} r="2.5" fill="#fff"><animate attributeName="cy" values={`30;${34 - h}`} dur={`${0.7 + i * 0.25}s`} repeatCount="indefinite" /></circle>)}
          {efectos.has('espuma') && <ellipse cx="0" cy={32 - h} rx="30" ry="6" fill="#fff" />}
          {efectos.has('humo') && <path d="M-8 -40 q6 -10 0 -20 M8 -40 q6 -10 0 -20" stroke="#aaa" strokeWidth="3" fill="none" />}
          <text y="52" textAnchor="middle" fontSize="11" fontWeight="800">{k + 1}</text>
        </g>,
      }
    }),
    { id: 'mechero', nombre: 'Mechero (lleva un vaso para calentarlo)', x: 790, y: 380, ancho: 70, alto: 80, dibujo: <g><rect x="-8" y="-6" width="16" height="36" fill="#7a7a7a" stroke="#2b2b2b" /><rect x="-24" y="30" width="48" height="8" fill="#555" /><path d="M0 -36 q-8 14 0 30 q8 -16 0 -30" fill="#4a90e2" opacity="0.8" /></g> },
    { id: 'caneca', nombre: 'Vaciar un vaso (lleva el vaso aquí)', x: 920, y: 375, ancho: 60, alto: 80, dibujo: <g transform="scale(0.85)"><Caneca /></g> },
  ]

  const registrar = (k: number, v: Vaso) => {
    const r = evaluar(v.ids, v.calor, grado)
    setVisto(k)
    if (r.nada) {
      const c = clave(v.ids, v.calor)
      if (!guardadas.has(c)) { guardarPendiente(v.ids, v.calor); setGuardadas((g) => new Set(g).add(c)) }
    }
  }
  const destinos = (de: string) => (de.startsWith('v') ? ['mechero', 'caneca'] : ['v0', 'v1', 'v2'])
  const soltar = (de: string, en: string): Uso | string => {
    if (de.startsWith('v')) {
      const k = Number(de.slice(1))
      if (en === 'caneca') return { anim: 'verter', hecho: () => { setVasos((vs) => vs.map((x, j) => (j === k ? VACIO : x))); setMsg(`Vaso ${k + 1} vacío.`) } }
      if (en === 'mechero') return { anim: 'poner', hecho: () => { const n = { ...vasos[k], calor: true }; setVasos((vs) => vs.map((x, j) => (j === k ? n : x))); registrar(k, n); setMsg(`Vaso ${k + 1} calentado.`) } }
      return 'Lleva el vaso al mechero o a la caneca.'
    }
    const k = Number(en.slice(1))
    const v = vasos[k]
    if (v.ids.length >= MAX) return 'El vaso está lleno: vacíalo en la caneca.'
    const r = REACTIVOS.find((x) => x.id === de)!
    return { anim: r.forma === 'liquido' ? 'verter' : r.forma === 'gotas' ? 'gotas' : r.forma === 'solido' ? 'polvo' : 'poner', hecho: () => {
      const n = { ...v, ids: [...v.ids, de] }
      setVasos((vs) => vs.map((x, j) => (j === k ? n : x)))
      registrar(k, n)
      setMsg(null)
    } }
  }

  const v = vasos[visto], r = res[visto]
  const txt = (t: [string, string?, string?]) => (grado >= 11 ? t[2] ?? t[1] ?? t[0] : grado >= 9 ? t[1] ?? t[0] : t[0])
  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-2xl border border-[var(--linea)] bg-[var(--tarjeta)] p-4 text-sm"><b>Mesa libre.</b> Toma lo que quieras del estante y échalo en los vasos; lleva un vaso al mechero para calentarlo. Algunas mezclas reaccionan y otras no. Si encuentras una que la app todavía no conoce, queda guardada para que tu docente diga qué pasa. Los reactivos con ⚠ son peligrosos en la vida real: aquí solo se simulan.</p>
      <MesaViva desde={170} piezas={piezas} destinos={destinos} soltar={soltar} />
      {msg && <p className="-mt-2 text-sm">› {msg}</p>}
      {v.ids.length > 0 && (
        <div className="rounded-lg bg-[var(--tarjeta)] p-3 text-sm">
          <p className="font-semibold">Vaso {visto + 1}</p>
          {r.reacciones.map((x) => (
            <div key={x.id} className="mt-1">
              <p><b>{x.nombre}.</b> {txt(x.texto)}</p>
              {grado >= 9 && x.ecuacion && <p className="font-mono text-xs">{x.ecuacion}</p>}
              {x.peligro && <p className="text-xs font-semibold text-[#c0392b]">⚠ {x.peligro}</p>}
            </div>
          ))}
          {r.indicadores.map((i) => <p key={i.id} className="mt-1">{REACTIVOS.find((x) => x.id === i.id)!.n}: <b style={{ color: i.c === 'transparent' ? undefined : i.c }}>{i.t}</b>{grado >= 9 ? ` (pH ≈ ${Math.round(r.pH)})` : r.pH < 6 ? ' → ácido' : r.pH > 8 ? ' → básico' : ' → neutro'}</p>)}
          {r.nada && <p className="mt-1">Se mezclan, pero <b>no hay reacción visible</b>. Esta mezcla quedó guardada para que tu docente la revise.</p>}
          {!r.nada && !r.reacciones.length && !r.indicadores.length && <p className="mt-1 text-[var(--suave)]">Echa algo más.</p>}
        </div>
      )}
    </div>
  )
}
