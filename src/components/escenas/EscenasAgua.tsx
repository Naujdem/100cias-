import type { ReactNode } from 'react'
// Escenas vivas del área 5, tema 2 (El agua y las cuencas).

const suave = 'transform 1.1s cubic-bezier(.45,.05,.25,1), opacity 0.7s ease, fill 0.8s ease, height 1s ease, y 1s ease'
const TINTA = '#3a3a3a'
const AZUL = '#2f7fc1'
const ROJO = '#c43c3c'

function T({ x, y, t, c = TINTA, s = 12, peso = 800 }: { x: number; y: number; t: string; c?: string; s?: number; peso?: number }) {
  return <text x={x} y={y} textAnchor="middle" fontSize={s} fontWeight={peso} fill={c} stroke="#fff" strokeWidth="3" paintOrder="stroke">{t}</text>
}
function Ver({ si, children }: { si: boolean; children: ReactNode }) {
  return <g style={{ transition: suave, opacity: si ? 1 : 0 }}>{children}</g>
}

/* ── El agua del planeta en un balde ──────────────────────────────────── */

const BALDE = ['toda', 'salada', 'dulce', 'rios']

export function EscenaAguaPlaneta({ fase }: { fase: string }) {
  const i = Math.max(0, BALDE.indexOf(fase))
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`El agua del planeta: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#eef4f8" />
      {/* balde */}
      <path d="M 70 90 L 90 250 H 190 L 210 90 Z" fill={i >= 1 ? '#3f78a8' : '#5aa0d6'} style={{ transition: suave }} />
      <path d="M 70 90 L 90 250 H 190 L 210 90" fill="none" stroke="#666" strokeWidth="4" />
      <path d="M 70 90 Q 140 30 210 90" fill="none" stroke="#666" strokeWidth="3" />
      <T x={140} y={275} t={i >= 1 ? '≈97 %: salada' : '10 litros = toda el agua'} c={i >= 1 ? '#2f5f88' : TINTA} />
      <Ver si={i >= 1}><text x="140" y="175" textAnchor="middle" fontSize="28">🌊</text></Ver>
      {/* tres vasos de agua dulce */}
      <Ver si={i >= 2}>
        {[250, 295, 340].map((x, k) => (
          <g key={x}>
            <path d={`M ${x - 16} 180 L ${x - 12} 240 H ${x + 12} L ${x + 16} 180 Z`} fill={k < 2 ? '#d8eefa' : '#9fd0f0'} stroke="#888" strokeWidth="2" />
            <text x={x} y="218" textAnchor="middle" fontSize="16">{k < 2 ? '🧊' : '🪨'}</text>
          </g>
        ))}
        <T x={295} y={170} t="≈3 %: dulce" c={AZUL} />
        <T x={295} y={262} t="hielo y bajo tierra" s={10} peso={600} />
      </Ver>
      {/* la cucharada */}
      <Ver si={i >= 3}>
        <ellipse cx="300" cy="95" rx="22" ry="11" fill="#5aa0d6" stroke="#888" strokeWidth="2" />
        <line x1="322" y1="95" x2="370" y2="80" stroke="#888" strokeWidth="5" strokeLinecap="round" />
        <T x={300} y={70} t="ríos y lagos: menos de una cucharada" c={ROJO} s={11} />
      </Ver>
    </svg>
  )
}

/* ── La cuenca, vista desde arriba ────────────────────────────────────── */

const CUENCA = ['divisoria', 'nacimientos', 'afluentes', 'rio', 'desembocadura']
const AFLUENTES = [
  'M 60 70 C 90 110 120 130 150 160', 'M 130 40 C 140 80 150 120 160 165', 'M 250 40 C 230 90 200 130 180 170',
  'M 340 80 C 300 120 250 160 215 200', 'M 40 200 C 90 205 130 210 175 215',
]
const NACIMIENTOS: [number, number][] = [[60, 70], [130, 40], [250, 40], [340, 80], [40, 200]]

export function EscenaCuenca({ fase }: { fase: string }) {
  const i = Math.max(0, CUENCA.indexOf(fase))
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Cuenca hidrográfica: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#e9f0e2" />
      <path d="M 20 210 C 10 120 50 40 140 25 C 230 10 330 30 375 90 C 390 150 360 220 330 250 C 250 270 100 270 20 210 Z" fill="#cfe2b8" />
      <path d="M 20 210 C 10 120 50 40 140 25 C 230 10 330 30 375 90 C 390 150 360 220 330 250"
        fill="none" stroke={ROJO} strokeWidth={i === 0 ? 4 : 2} strokeDasharray="8 6" style={{ transition: suave, opacity: i === 0 ? 1 : 0.4 }} />
      {[[60, 40], [190, 22], [320, 50], [30, 150], [370, 170]].map(([x, y]) => <text key={x} x={x} y={y + 8} textAnchor="middle" fontSize="18">⛰️</text>)}
      <Ver si={i === 0}><T x={200} y={140} t="la divisoria: los filos que separan las cuencas" c={ROJO} s={11} /></Ver>
      {AFLUENTES.map((d, k) => <path key={k} d={d} fill="none" stroke={AZUL} strokeWidth={i === 2 ? 4 : 2.5} strokeLinecap="round" style={{ transition: suave, opacity: i >= 2 ? 1 : 0 }} />)}
      <path d="M 155 160 C 170 190 185 210 210 220 C 250 235 290 255 330 285" fill="none" stroke={AZUL} strokeWidth={i === 3 ? 10 : 7} strokeLinecap="round" style={{ transition: suave, opacity: i >= 3 ? 1 : 0 }} />
      {NACIMIENTOS.map(([x, y]) => (
        <circle key={x + '-' + y} cx={x} cy={y} r={i === 1 ? 8 : 5} fill="#9fd0f0" stroke={AZUL} strokeWidth="2" style={{ transition: suave, opacity: i >= 1 ? 1 : 0 }} />
      ))}
      <Ver si={i === 1}><T x={200} y={140} t="nacimientos en la parte alta" c={AZUL} /></Ver>
      <Ver si={i === 2}><T x={290} y={150} t="quebradas que se unen" c={AZUL} /></Ver>
      <Ver si={i === 3}><T x={290} y={215} t="río principal" c={AZUL} /></Ver>
      <Ver si={i === 4}>
        <rect x="300" y="270" width="110" height="40" fill="#5aa0d6" />
        <circle cx="330" cy="285" r="14" fill="none" stroke={ROJO} strokeWidth="3" />
        <T x={300} y={262} t="desembocadura" c={ROJO} />
      </Ver>
    </svg>
  )
}

/* ── El páramo como esponja (corte del suelo) ─────────────────────────── */

const PARAMO = ['niebla', 'esponja', 'soltar', 'dano']

function Frailejon({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-5" y="-40" width="10" height="40" fill="#8a7a5a" />
      {[-60, -30, 0, 30, 60].map((a) => <ellipse key={a} cx="0" cy="-50" rx="5" ry="16" fill="#b8c8a0" transform={`rotate(${a} 0 -42)`} />)}
    </g>
  )
}

export function EscenaParamoEsponja({ fase }: { fase: string }) {
  const i = Math.max(0, PARAMO.indexOf(fase))
  const dano = i === 3
  const lleno = i === 0 ? 0.15 : i === 1 ? 0.85 : i === 2 ? 0.55 : 0.05
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`El páramo como esponja: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#e6ecef" />
      {/* niebla */}
      <g style={{ transition: suave, opacity: i === 0 ? 1 : 0.25 }}>
        {[60, 160, 260].map((x) => <ellipse key={x} cx={x} cy="60" rx="70" ry="18" fill="#fff" opacity="0.9" />)}
        {[90, 130, 200, 250].map((x) => <circle key={x} cx={x} cy="95" r="3" fill={AZUL} />)}
      </g>
      {/* suelo: esponja */}
      <rect x="-10" y="150" width="320" height="110" fill={dano ? '#8a7a6a' : '#2f2a26'} style={{ transition: suave }} />
      <rect x="-10" y={150 + 110 * (1 - lleno)} width="320" height={110 * lleno} fill={AZUL} opacity="0.45" style={{ transition: suave }} />
      {!dano && [20, 60, 100, 140, 180, 220, 260].map((x) => <ellipse key={x} cx={x} cy="150" rx="22" ry="7" fill="#6a9a4a" />)}
      <rect x="-10" y="260" width="420" height="50" fill="#9a8f84" />
      {!dano ? <g><Frailejon x={50} y={148} /><Frailejon x={150} y={146} /><Frailejon x={240} y={148} /></g>
        : <g><text x="80" y="146" textAnchor="middle" fontSize="26">🐄</text><text x="200" y="146" textAnchor="middle" fontSize="22">🥔</text><text x="260" y="146" textAnchor="middle" fontSize="22">🔥</text></g>}
      {/* nacimiento */}
      <path d="M 310 200 C 340 210 360 220 410 222" fill="none" stroke={AZUL} strokeWidth={i === 2 ? 7 : i === 3 ? 1.5 : 4} strokeLinecap="round" style={{ transition: suave }} />
      <T x={355} y={198} t="nacimiento" c={AZUL} s={10} />
      <Ver si={dano}><path d="M 20 140 C 120 145 220 145 300 150" fill="none" stroke="#a06a2a" strokeWidth="4" strokeDasharray="8 5" /><T x={160} y={128} t="el agua escurre por encima, con barro" c={ROJO} s={11} /></Ver>
      <T x={150} y={30} t={['Los frailejones y los pajonales atrapan la niebla', 'Musgos y suelo negro: una esponja llena de agua', 'El agua sale despacio, aun en verano', 'Suelo compactado: ya no guarda agua'][i]} c={dano ? ROJO : TINTA} s={11} />
    </svg>
  )
}
