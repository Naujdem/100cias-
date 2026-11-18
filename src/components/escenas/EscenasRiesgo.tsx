import type { ReactNode } from 'react'
// Escenas vivas del área 5, tema 8 (Gestión del riesgo).

const suave = 'transform 1.1s cubic-bezier(.45,.05,.25,1), opacity 0.7s ease, fill 0.8s ease'
const TINTA = '#3a3a3a'
const ROJO = '#c43c3c'
const VERDE = '#3f9a5a'
const AZUL = '#2f7fc1'

function T({ x, y, t, c = TINTA, s = 11, peso = 800 }: { x: number; y: number; t: string; c?: string; s?: number; peso?: number }) {
  return <text x={x} y={y} textAnchor="middle" fontSize={s} fontWeight={peso} fill={c} stroke="#fff" strokeWidth="3" paintOrder="stroke">{t}</text>
}
function Ver({ si, children }: { si: boolean; children: ReactNode }) {
  return <g style={{ transition: suave, opacity: si ? 1 : 0 }}>{children}</g>
}
function Arbol({ x, y, k = 1 }: { x: number; y: number; k?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${k})`}><rect x="-4" y="-34" width="8" height="34" fill="#7a5a3a" /><circle cy="-44" r="18" fill="#4f8f4f" /></g>
}

/* ── Amenaza, vulnerabilidad y riesgo ─────────────────────────────────── */

const RIE = ['amenaza', 'vulnerabilidad', 'riesgo', 'reducir']

export function EscenaRiesgo({ fase }: { fase: string }) {
  const i = Math.max(0, RIE.indexOf(fase))
  const crece = i === 0 || i >= 2
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Riesgo: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#e7eef2" />
      {Array.from({ length: 10 }, (_, k) => <line key={k} x1={20 + k * 40} y1="20" x2={14 + k * 40} y2="40" stroke={AZUL} strokeWidth="2" opacity={crece ? 0.8 : 0.2} />)}
      <rect x="-10" y="200" width="420" height="110" fill="#8ab06a" />
      {/* río: crece en amenaza y riesgo */}
      <rect x="150" y={crece ? 205 : 235} width="100" height={crece ? 105 : 75} fill="#7a9ab8" style={{ transition: 'all 1s ease' }} />
      <rect x={crece ? 130 : 150} y={crece ? 205 : 235} width={crece ? 140 : 100} height="12" fill="#a08a5a" opacity={crece ? 0.7 : 0} style={{ transition: 'all 1s ease' }} />
      {/* casa en la orilla o lejos */}
      <g style={{ transition: suave, transform: i === 3 ? 'translate(190px, 0px)' : 'none', opacity: i >= 1 ? 1 : 0 }}>
        <polygon points="105,170 130,150 155,170" fill="#a0603a" />
        <rect x="110" y="170" width="40" height="32" fill="#e8d8b8" />
      </g>
      <Ver si={i === 3}>{[40, 70, 330, 360].map((x) => <Arbol key={x} x={x} y={202} />)}</Ver>
      <Ver si={i === 2}><circle cx="130" cy="185" r="38" fill="none" stroke={ROJO} strokeWidth="4" strokeDasharray="7 5" /></Ver>
      <T x={200} y={70} t={['AMENAZA: el río puede crecer', 'VULNERABILIDAD: casa en la orilla', 'RIESGO = amenaza + vulnerabilidad', 'El río crece... pero no hay desastre'][i]} c={[AZUL, '#a0603a', ROJO, VERDE][i]} s={14} />
    </svg>
  )
}

/* ── Armero ──────────────────────────────────────────────────────────── */

const ARM = ['erupcion', 'lahar', 'armero', 'leccion']

export function EscenaArmero({ fase }: { fase: string }) {
  const i = Math.max(0, ARM.indexOf(fase))
  const lodo = [0, 0.55, 1, 1][i]
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Armero, 1985: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={i === 3 ? '#eef0f2' : '#e2e4e6'} />
      {/* volcán */}
      <polygon points="-10,180 70,50 150,180" fill="#7a746c" />
      <polygon points={i >= 1 ? '52,80 70,50 88,80' : '40,98 70,50 100,98'} fill="#fff" style={{ transition: 'all 1s ease' }} />
      <Ver si={i === 0}>{[0, 1, 2].map((n) => <circle key={n} cx={70 + n * 10} cy={38 - n * 14} r={10 + n * 5} fill="#666" opacity="0.6" />)}</Ver>
      {/* valle y río Lagunilla */}
      <rect x="-10" y="180" width="420" height="130" fill="#9ab06a" />
      <path d="M 90 120 C 150 170 220 200 330 240" fill="none" stroke="#7a9ab8" strokeWidth="6" />
      <path d="M 90 120 C 150 170 220 200 330 240" fill="none" stroke="#6a4a2a" strokeWidth="18" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - lodo} style={{ transition: 'stroke-dashoffset 1.6s ease' }} />
      {/* Armero */}
      <g style={{ transition: suave, opacity: i >= 2 && i < 3 ? 0.35 : 1 }}>
        {[[300, 235], [325, 225], [350, 238], [315, 255], [345, 258]].map(([x, y], k) => <rect key={k} x={x} y={y} width="16" height="12" fill="#e8d8b8" stroke="#a0603a" />)}
      </g>
      <Ver si={i >= 2}><ellipse cx="330" cy="248" rx="58" ry="26" fill="#6a4a2a" opacity="0.75" /></Ver>
      <T x={330} y={290} t="Armero" s={12} />
      <Ver si={i === 3}>
        <rect x="180" y="40" width="200" height="90" rx="10" fill="#fff" stroke="#ddd" strokeWidth="2" />
        <T x={280} y={66} t="Había un mapa de amenaza" s={11} />
        <T x={280} y={86} t="y señales del volcán por meses." s={11} peso={600} />
        <T x={280} y={110} t="Faltó comunicar y evacuar a tiempo." c={ROJO} s={11} />
      </Ver>
      <T x={200} y={24} t={['13 nov 1985: la erupción derrite parte del glaciar', 'el lahar baja por el río Lagunilla', 'horas después llega a Armero: unas 23.000 víctimas', ''][i]} c={i === 2 ? ROJO : TINTA} s={11} />
    </svg>
  )
}

/* ── Evacuación del colegio ───────────────────────────────────────────── */

const EVA = ['alarma', 'salida', 'encuentro', 'conteo']

export function EscenaEvacuacion({ fase }: { fase: string }) {
  const i = Math.max(0, EVA.indexOf(fase))
  const pos = (k: number): [number, number] => {
    if (i <= 0) return [90 + (k % 4) * 22, 140 + Math.floor(k / 4) * 26]
    if (i === 1) return [190 + k * 16, 200]
    return [300 + (k % 4) * 18, 200 + Math.floor(k / 4) * 20]
  }
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Simulacro: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#eef3ea" />
      {/* salón */}
      <rect x="60" y="110" width="130" height="110" fill="#fff" stroke="#888" strokeWidth="3" />
      <rect x="185" y="185" width="8" height="30" fill="#eef3ea" />
      <T x={125} y={102} t="salón" s={10} />
      {/* ruta */}
      <path d="M 193 200 H 290" stroke={VERDE} strokeWidth="4" strokeDasharray="10 6" markerEnd="url(#ev-f)" style={{ transition: suave, opacity: i >= 1 ? 1 : 0.3 }} />
      <defs><marker id="ev-f" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill={VERDE} /></marker></defs>
      {/* punto de encuentro */}
      <rect x="290" y="180" width="90" height="70" rx="8" fill="#dff0d8" stroke={VERDE} strokeWidth="2" />
      <T x={335} y={172} t="punto de encuentro" c={VERDE} s={10} />
      {/* estudiantes */}
      {Array.from({ length: 8 }, (_, k) => {
        const [x, y] = pos(k)
        return <circle key={k} cx={x} cy={y} r="7" fill={i === 3 ? VERDE : '#e0a800'} stroke="#fff" strokeWidth="2" style={{ transition: 'all 1.1s cubic-bezier(.45,.05,.25,1)' }} />
      })}
      <Ver si={i === 0}><text x="125" y="70" textAnchor="middle" fontSize="30">🔔</text></Ver>
      <Ver si={i === 3}><T x={335} y={275} t="8 de 8 ✓" c={VERDE} s={14} /></Ver>
      <T x={200} y={36} t={['Suena la alarma', 'Salen por la ruta: no correr, no gritar, no empujar', 'Se reúnen en un lugar abierto y seguro', 'El docente cuenta: ¿falta alguien?'][i]} s={12} />
    </svg>
  )
}
