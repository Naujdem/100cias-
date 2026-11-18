// Escenas vivas de Química, área 1, tema 3 (Estados y cambios de estado).

const suave = 'transform 1.1s cubic-bezier(.45,.05,.25,1), opacity 0.7s ease, fill 0.8s ease, stroke 0.8s ease'
const TINTA = '#3a3a3a'
const ROJO = '#c43c3c'
const AZUL = '#2f6db3'

function T({ x, y, t, c = TINTA, s = 11, peso = 800 }: { x: number; y: number; t: string; c?: string; s?: number; peso?: number }) {
  return <text x={x} y={y} textAnchor="middle" fontSize={s} fontWeight={peso} fill={c} stroke="#fff" strokeWidth="3" paintOrder="stroke">{t}</text>
}

/* ── El triángulo de los cambios de estado ────────────────────────────── */

const NODOS = { s: { x: 80, y: 230, n: 'SÓLIDO', e: '🧊' }, l: { x: 320, y: 230, n: 'LÍQUIDO', e: '💧' }, g: { x: 200, y: 80, n: 'GAS', e: '☁️' } }
type N = keyof typeof NODOS
const CAMBIOS: { id: string; de: N; a: N; nombre: string; ej: string; calor: boolean }[] = [
  { id: 'fusion', de: 's', a: 'l', nombre: 'Fusión', ej: 'el hielo se derrite', calor: true },
  { id: 'solidificacion', de: 'l', a: 's', nombre: 'Solidificación', ej: 'el agua se congela', calor: false },
  { id: 'evaporacion', de: 'l', a: 'g', nombre: 'Evaporación', ej: 'la ropa se seca', calor: true },
  { id: 'condensacion', de: 'g', a: 'l', nombre: 'Condensación', ej: 'la ventana se empaña', calor: false },
  { id: 'sublimacion', de: 's', a: 'g', nombre: 'Sublimación', ej: 'la naftalina desaparece', calor: true },
  { id: 'deposicion', de: 'g', a: 's', nombre: 'Sublimación inversa', ej: 'la escarcha del páramo', calor: false },
]

export function EscenaCicloEstados({ fase }: { fase: string }) {
  const act = CAMBIOS.find((c) => c.id === fase) ?? CAMBIOS[0]
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Cambio de estado: ${act.nombre}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={act.calor ? '#fbefe6' : '#e8f1fb'} style={{ transition: suave }} />
      {CAMBIOS.map((c) => {
        const a = NODOS[c.de], b = NODOS[c.a]
        // desplazar cada flecha a un lado para que ida y vuelta no se monten
        const dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy), nx = -dy / L * 12, ny = dx / L * 12
        const x1 = a.x + dx * 0.25 + nx, y1 = a.y + dy * 0.25 + ny, x2 = a.x + dx * 0.75 + nx, y2 = a.y + dy * 0.75 + ny
        const si = c.id === act.id
        const col = si ? (c.calor ? ROJO : AZUL) : '#c9c9c9'
        return (
          <g key={c.id} style={{ transition: suave, opacity: si ? 1 : 0.5 }}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={col} strokeWidth={si ? 6 : 3} style={{ transition: suave }} />
            <circle cx={x2} cy={y2} r={si ? 7 : 4} fill={col} />
          </g>
        )
      })}
      {(Object.keys(NODOS) as N[]).map((k) => {
        const n = NODOS[k]
        const si = k === act.de || k === act.a
        return (
          <g key={k} style={{ transition: suave, opacity: si ? 1 : 0.55 }}>
            <circle cx={n.x} cy={n.y} r="36" fill="#fff" stroke={si ? TINTA : '#bbb'} strokeWidth="3" />
            <text x={n.x} y={n.y + 8} textAnchor="middle" fontSize="28">{n.e}</text>
            <T x={n.x} y={n.y + 54} t={n.n} s={11} />
          </g>
        )
      })}
      <T x={200} y={30} t={`${act.nombre}: ${act.ej}`} c={act.calor ? ROJO : AZUL} s={14} />
      <T x={200} y={185} t={act.calor ? '🔥 gana calor' : '❄️ pierde calor'} c={act.calor ? ROJO : AZUL} s={12} />
    </svg>
  )
}

/* ── Curva de calentamiento del agua (11°) ────────────────────────────── */

const CURVA = ['hielo', 'fusion', 'agua', 'ebullicion', 'vapor']
// puntos de la gráfica (tiempo → x, temperatura → y): −20 °C en y=250, 120 °C en y=50
const ty = (t: number) => 250 - (t + 20) * (200 / 140)
const PTS: [number, number][] = [[60, ty(-20)], [100, ty(0)], [160, ty(0)], [230, ty(100)], [320, ty(100)], [370, ty(120)]]

export function EscenaCurvaCalentamiento({ fase }: { fase: string }) {
  const i = Math.max(0, CURVA.indexOf(fase))
  const tramo = PTS.slice(0, i + 2)
  const [px, py] = PTS[i + 1]
  const meseta = i === 1 || i === 3
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Curva de calentamiento del agua: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#fbfaf6" />
      <path d="M 50 40 V 255 H 385" stroke={TINTA} strokeWidth="2" fill="none" />
      <T x={30} y={ty(0) + 4} t="0 °C" s={10} />
      <T x={26} y={ty(100) + 4} t="100 °C" s={10} />
      <path d={`M 50 ${ty(0)} H 385 M 50 ${ty(100)} H 385`} stroke="#ddd" strokeDasharray="4 4" />
      <T x={330} y={275} t="tiempo (calor que se suministra) →" s={10} peso={600} />
      <polyline points={PTS.map((p) => p.join(',')).join(' ')} fill="none" stroke="#e5e5e5" strokeWidth="5" />
      <polyline points={tramo.map((p) => p.join(',')).join(' ')} fill="none" stroke={meseta ? ROJO : AZUL} strokeWidth="5" style={{ transition: suave }} />
      <circle cx={px} cy={py} r="8" fill={meseta ? ROJO : AZUL} style={{ transition: suave }} />
      <T x={200} y={28} t={['Hielo: la temperatura sube', 'Fusión: la temperatura NO sube (0 °C)', 'Agua: la temperatura sube', 'Ebullición: la temperatura NO sube (100 °C)', 'Vapor: la temperatura sube'][i]} c={meseta ? ROJO : AZUL} s={13} />
      {meseta && <T x={200} y={46} t="el calor se usa en separar las partículas" s={11} peso={600} />}
    </svg>
  )
}
