// Escena viva del área 5, tema 9 (Sostenibilidad y acción ambiental): los pasos de un proyecto ambiental de aula,
// como un camino que se recorre parada a parada.

const suave = 'transform 1.1s cubic-bezier(.45,.05,.25,1), opacity 0.7s ease, fill 0.8s ease'
const TINTA = '#3a3a3a'
const VERDE = '#3f9a5a'

function T({ x, y, t, c = TINTA, s = 11, peso = 800 }: { x: number; y: number; t: string; c?: string; s?: number; peso?: number }) {
  return <text x={x} y={y} textAnchor="middle" fontSize={s} fontWeight={peso} fill={c} stroke="#fff" strokeWidth="3" paintOrder="stroke">{t}</text>
}

const PASOS = [
  { id: 'diagnostico', ic: '🔎', n: 'Diagnosticar', x: 50, y: 230 },
  { id: 'elegir', ic: '🎯', n: 'Elegir', x: 120, y: 160 },
  { id: 'causas', ic: '🌳', n: 'Investigar', x: 200, y: 210 },
  { id: 'actuar', ic: '🛠️', n: 'Actuar', x: 280, y: 140 },
  { id: 'evaluar', ic: '📣', n: 'Evaluar y compartir', x: 350, y: 200 },
]
const DETALLE = [
  'recorrer, preguntar a los mayores, mapa de problemas',
  'el que más importa y donde se puede actuar',
  'árbol: raíces = causas, ramas = efectos',
  'qué, quién, cuándo y con qué',
  'medir si funcionó y contarlo a la comunidad',
]

export function EscenaProyectoAula({ fase }: { fase: string }) {
  const i = Math.max(0, PASOS.findIndex((p) => p.id === fase))
  const camino = PASOS.map((p, k) => `${k ? 'L' : 'M'} ${p.x} ${p.y}`).join(' ')
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Proyecto ambiental de aula: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#eef3ea" />
      <path d={camino} fill="none" stroke="#c8b89a" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
      {PASOS.map((p, k) => (
        <g key={p.id} style={{ transition: suave, opacity: k <= i ? 1 : 0.35 }}>
          <circle cx={p.x} cy={p.y} r={k === i ? 26 : 20} fill={k < i ? '#dff0d8' : '#fff'} stroke={k <= i ? VERDE : '#aaa'} strokeWidth="3" style={{ transition: suave }} />
          <text x={p.x} y={p.y + 8} textAnchor="middle" fontSize={k === i ? 24 : 18}>{k < i ? '✓' : p.ic}</text>
          <T x={p.x} y={p.y + 44} t={p.n} s={10} c={k === i ? VERDE : TINTA} />
        </g>
      ))}
      <rect x="20" y="20" width="360" height="60" rx="12" fill="#fff" opacity="0.95" />
      <T x={200} y={46} t={`${PASOS[i].ic} ${PASOS[i].n}`} c={VERDE} s={15} />
      <T x={200} y={66} t={DETALLE[i]} s={11} peso={600} />
    </svg>
  )
}
