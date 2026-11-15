import type { ReactNode } from 'react'
import { Semilla } from '../ilustraciones/Semilla.tsx'

// Escena viva del experimento de Mendel con el color de la semilla, animada.
// Fases: p (dos plantas puras) · polinizar (pinzas y pincel) · f1 (la vaina se abre: todas amarillas)
// · autofecundar (el polen cae dentro de la flor cerrada) · f2 (cuatro vainas: 3 amarillas por cada verde)
// · alelos (las mismas vainas con sus letras).

const ORDEN = ['p', 'polinizar', 'f1', 'autofecundar', 'f2', 'alelos']
const TINTA = '#4a3416'
const TALLO = '#5c8a2e'
const HOJA = '#8bbf4a'

const CSS = `
.mdl-cambia { transition: opacity .6s ease }
.mdl-mece { transform-box: fill-box; transform-origin: 50% 100%; animation: mdl-mece 4s ease-in-out infinite }
@keyframes mdl-mece { 0%,100% { transform: rotate(-1.5deg) } 50% { transform: rotate(1.5deg) } }
.mdl-brota { transform-box: fill-box; transform-origin: center; animation: mdl-brota .5s cubic-bezier(.3,1.6,.6,1) both }
@keyframes mdl-brota { from { transform: scale(0); opacity: 0 } to { transform: scale(1); opacity: 1 } }
.mdl-aparece { animation: mdl-aparece .6s ease both }
@keyframes mdl-aparece { from { opacity: 0 } to { opacity: 1 } }
.mdl-valva-a { transform-box: fill-box; transform-origin: 50% 100%; animation: mdl-abre-a 1s ease .2s both }
.mdl-valva-b { transform-box: fill-box; transform-origin: 50% 0%; animation: mdl-abre-b 1s ease .2s both }
@keyframes mdl-abre-a { from { transform: scaleY(1) } to { transform: scaleY(.35) } }
@keyframes mdl-abre-b { from { transform: scaleY(1) } to { transform: scaleY(.35) } }
.mdl-pinzas { animation: mdl-pinzas 7s ease-in-out infinite }
@keyframes mdl-pinzas {
  0%,6% { transform: translate(40px,-80px); opacity: 0 }
  12% { transform: translate(40px,-80px); opacity: 1 }
  20%,23% { transform: translate(0,0); opacity: 1 }
  32% { transform: translate(-60px,-90px); opacity: 1 }
  36%,100% { transform: translate(-60px,-90px); opacity: 0 }
}
.mdl-estambres { animation: mdl-estambres 7s ease-in-out infinite }
@keyframes mdl-estambres {
  0%,23% { transform: translate(0,0); opacity: 1 }
  32% { transform: translate(-60px,-90px); opacity: 1 }
  36%,94% { transform: translate(-60px,-90px); opacity: 0 }
  100% { transform: translate(0,0); opacity: 0 }
}
.mdl-pincel { transform: translate(200px,40px); animation: mdl-pincel 7s ease-in-out infinite }
@keyframes mdl-pincel {
  0%,34% { transform: translate(200px,40px) }
  48%,52% { transform: translate(286px,118px) }
  66% { transform: translate(200px,40px) }
  78%,84% { transform: translate(112px,118px) }
  94%,100% { transform: translate(200px,40px) }
}
.mdl-polen-pincel { animation: mdl-polen-pincel 7s linear infinite }
@keyframes mdl-polen-pincel { 0%,49% { opacity: 0 } 51%,80% { opacity: 1 } 83%,100% { opacity: 0 } }
.mdl-polen-estigma { animation: mdl-polen-estigma 7s linear infinite }
@keyframes mdl-polen-estigma { 0%,80% { opacity: 0 } 83%,96% { opacity: 1 } 100% { opacity: 0 } }
.mdl-brillo { animation: mdl-brillo 7s ease infinite }
@keyframes mdl-brillo { 0%,80% { opacity: 0 } 84% { opacity: .9 } 96%,100% { opacity: 0 } }
.mdl-cae { animation: mdl-cae 2.4s ease-in infinite }
@keyframes mdl-cae { 0% { transform: translate(0,0); opacity: 0 } 15% { opacity: 1 } 80% { opacity: 1 } 100% { transform: var(--hacia); opacity: 0 } }
.mdl-gira { transform-box: view-box; transform-origin: 200px 150px; animation: mdl-gira 6s linear infinite }
@keyframes mdl-gira { to { transform: rotate(360deg) } }
@media (prefers-reduced-motion: reduce) { .mdl * { animation: none !important } }
`

/* ── piezas ─────────────────────────────────────────────── */

/** Flor de arveja vista de frente, pequeña (para las plantas). */
function FlorChica({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <ellipse cx={x} cy={y - 6} rx={11} ry={10} fill="#f4f0fb" stroke="#9b7fc4" strokeWidth={1.5} />
      <ellipse cx={x - 8} cy={y + 3} rx={6} ry={5} fill="#e7dcf6" stroke="#9b7fc4" strokeWidth={1.2} />
      <ellipse cx={x + 8} cy={y + 3} rx={6} ry={5} fill="#e7dcf6" stroke="#9b7fc4" strokeWidth={1.2} />
      <path d={`M ${x - 3} ${y + 6} q 3 5 6 0`} fill="#d7c6ee" stroke="#9b7fc4" strokeWidth={1} />
    </g>
  )
}

/** Vaina abierta con sus semillas. */
function Vaina({ x, y, semillas, ancho = 92, r = 9, retraso = 0, letras }: { x: number; y: number; semillas: boolean[]; ancho?: number; r?: number; retraso?: number; letras?: string[] }) {
  const paso = ancho / (semillas.length + 0.6)
  return (
    <g>
      <path d={`M ${x - ancho / 2} ${y} Q ${x} ${y - r * 3.2} ${x + ancho / 2} ${y} Q ${x} ${y + r * 1.4} ${x - ancho / 2} ${y} Z`} fill="#a8cf6b" stroke={TALLO} strokeWidth={2} />
      {semillas.map((am, k) => {
        const sx = x - ancho / 2 + paso * (k + 0.8)
        return (
          <g key={k}>
            <g className="mdl-brota" style={{ animationDelay: `${retraso + 0.25 * k}s` }}>
              <Semilla x={sx} y={y - r * 0.6} r={r} amarilla={am} />
            </g>
            {letras && (
              <text x={sx} y={y + r * 1.9} textAnchor="middle" fontSize="10" fontWeight="800" fill={TINTA} className="mdl-aparece" style={{ animationDelay: `${0.1 * k}s` }}>
                {letras[k]}
              </text>
            )}
          </g>
        )
      })}
      <path d={`M ${x - ancho / 2} ${y} Q ${x} ${y + r * 1.4} ${x + ancho / 2} ${y}`} fill="none" stroke={TALLO} strokeWidth={2} />
    </g>
  )
}

/** Planta de arveja con flor, zarcillo y una vaina abierta. */
function Planta({ x, amarilla, rotulo }: { x: number; amarilla: boolean; rotulo: string }) {
  return (
    <g>
      <g className="mdl-mece">
        <path d={`M ${x} 262 C ${x - 10} 220 ${x + 12} 180 ${x} 120 C ${x - 6} 95 ${x + 4} 80 ${x} 66`} fill="none" stroke={TALLO} strokeWidth={4} strokeLinecap="round" />
        <ellipse cx={x - 22} cy={218} rx={18} ry={9} fill={HOJA} stroke={TALLO} strokeWidth={1.5} transform={`rotate(-20 ${x - 22} 218)`} />
        <ellipse cx={x + 22} cy={190} rx={18} ry={9} fill={HOJA} stroke={TALLO} strokeWidth={1.5} transform={`rotate(20 ${x + 22} 190)`} />
        <ellipse cx={x - 20} cy={150} rx={15} ry={8} fill={HOJA} stroke={TALLO} strokeWidth={1.5} transform={`rotate(-25 ${x - 20} 150)`} />
        <path d={`M ${x + 2} 110 c 18 -4 22 -20 10 -22 c -8 -1 -8 8 -1 8`} fill="none" stroke={TALLO} strokeWidth={1.5} />
        <FlorChica x={x} y={64} />
        <g transform={`translate(${x + 42} 150) rotate(-10)`}>
          <Vaina x={0} y={0} ancho={64} r={7} semillas={[amarilla, amarilla, amarilla, amarilla]} />
        </g>
      </g>
      <path d={`M ${x - 40} 264 h 80`} stroke="#8a6a3a" strokeWidth={4} strokeLinecap="round" />
      <text x={x} y={286} textAnchor="middle" fontSize="13" fontWeight="800" fill={TINTA}>{rotulo}</text>
    </g>
  )
}

/** Flor grande abierta para ver por dentro: pétalos, pistilo y estambres. */
function FlorGrande({ x, y, estambres, claseEstambres }: { x: number; y: number; estambres: boolean; claseEstambres?: string }) {
  return (
    <g>
      <ellipse cx={x} cy={y - 18} rx={48} ry={42} fill="#f4f0fb" stroke="#9b7fc4" strokeWidth={2} />
      <ellipse cx={x - 34} cy={y + 18} rx={24} ry={20} fill="#e7dcf6" stroke="#9b7fc4" strokeWidth={1.8} />
      <ellipse cx={x + 34} cy={y + 18} rx={24} ry={20} fill="#e7dcf6" stroke="#9b7fc4" strokeWidth={1.8} />
      <path d={`M ${x - 20} ${y + 30} Q ${x} ${y + 62} ${x + 20} ${y + 30} Z`} fill="#d7c6ee" stroke="#9b7fc4" strokeWidth={1.8} />
      {/* pistilo */}
      <path d={`M ${x} ${y + 40} C ${x - 4} ${y + 20} ${x + 4} ${y} ${x} ${y - 28}`} fill="none" stroke="#6f9f3a" strokeWidth={5} strokeLinecap="round" />
      <circle cx={x} cy={y - 31} r={6} fill="#9cc65a" stroke="#4a7a1e" strokeWidth={1.5} />
      {/* estambres */}
      {estambres && (
        <g className={claseEstambres}>
          {[-22, -13, -5, 5, 13, 22].map((dx, k) => (
            <g key={k}>
              <path d={`M ${x + dx * 0.3} ${y + 38} Q ${x + dx} ${y + 5} ${x + dx} ${y - 14}`} fill="none" stroke="#c9b48a" strokeWidth={2} />
              <ellipse cx={x + dx} cy={y - 17} rx={4} ry={6} fill="#f2c52e" stroke="#a07c10" strokeWidth={1} />
            </g>
          ))}
        </g>
      )}
    </g>
  )
}

function Pincel() {
  return (
    <g>
      <path d="M 0 0 L 6 -14 L 12 -10 Z" fill="#c98a4a" stroke="#7a4a1a" strokeWidth={1} />
      <path d="M 9 -12 L 34 -52" stroke="#e05a8a" strokeWidth={5} strokeLinecap="round" />
      <g className="mdl-polen-pincel">
        <circle cx={2} cy={-3} r={2.2} fill="#f2c52e" />
        <circle cx={6} cy={-6} r={2} fill="#f2c52e" />
        <circle cx={9} cy={-2} r={1.8} fill="#f2c52e" />
      </g>
    </g>
  )
}

function Pinzas() {
  return (
    <g>
      <path d="M -4 -2 L 18 -60 M 4 -2 L 24 -58" stroke="#7d8790" strokeWidth={3} strokeLinecap="round" />
      <path d="M 18 -60 L 24 -58" stroke="#7d8790" strokeWidth={4} strokeLinecap="round" />
    </g>
  )
}

function Insignia({ texto }: { texto: string }) {
  return (
    <g>
      <rect x="10" y="10" width={20 + texto.length * 8} height="26" rx="13" fill="#3a4450" />
      <text x={20 + texto.length * 4} y="28" textAnchor="middle" fontSize="13" fontWeight="800" fill="#fff">{texto}</text>
    </g>
  )
}

function Escena({ ver, children }: { ver: boolean; children: ReactNode }) {
  return (
    <g className="mdl-cambia" opacity={ver ? 1 : 0} aria-hidden={!ver}>
      {children}
    </g>
  )
}

/* ── vainas de la F2: 12 amarillas y 4 verdes ─────────────── */
const F2: { x: number; y: number; g: string[] }[] = [
  { x: 110, y: 110, g: ['AA', 'Aa', 'aa', 'Aa'] },
  { x: 290, y: 110, g: ['Aa', 'AA', 'Aa', 'aa'] },
  { x: 110, y: 210, g: ['aa', 'Aa', 'AA', 'Aa'] },
  { x: 290, y: 210, g: ['Aa', 'aa', 'Aa', 'AA'] },
]

export default function EscenaMendel({ fase }: { fase: string }) {
  const f = ORDEN.includes(fase) ? fase : 'p'
  const es = (x: string) => f === x
  const f2 = es('f2') || es('alelos')
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label="Experimento de Mendel con semillas amarillas y verdes" className="mdl h-full w-full">
      <style>{CSS}</style>
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#fbf6e9" />

      {/* P: dos plantas de líneas puras */}
      <Escena ver={es('p')}>
        <Planta x={100} amarilla rotulo="amarilla pura" />
        <text x="196" y="110" textAnchor="middle" fontSize="30" fontWeight="800" fill={TINTA}>×</text>
        <Planta x={270} amarilla={false} rotulo="verde pura" />
      </Escena>

      {/* cruce a mano: pinzas y pincel (la escena se reinicia al entrar) */}
      {es('polinizar') && (
        <g key="polinizar">
          <FlorGrande x={120} y={150} estambres claseEstambres="mdl-estambres" />
          <FlorGrande x={290} y={150} estambres />
          <g className="mdl-brillo">
            <circle cx={120} cy={119} r={13} fill="none" stroke="#f2c52e" strokeWidth={3} />
          </g>
          <g className="mdl-polen-estigma">
            <circle cx={117} cy={116} r={2.2} fill="#f2c52e" />
            <circle cx={123} cy={117} r={2} fill="#f2c52e" />
            <circle cx={120} cy={121} r={1.8} fill="#f2c52e" />
          </g>
          <g transform="translate(120 128)">
            <g className="mdl-pinzas"><Pinzas /></g>
          </g>
          <g className="mdl-pincel"><Pincel /></g>
          <text x={120} y={250} textAnchor="middle" fontSize="11" fontWeight="800" fill={TINTA}>1. Le quita los estambres</text>
          <text x={120} y={265} textAnchor="middle" fontSize="11" fill={TINTA}>(planta amarilla)</text>
          <text x={290} y={250} textAnchor="middle" fontSize="11" fontWeight="800" fill={TINTA}>2. Toma su polen</text>
          <text x={290} y={265} textAnchor="middle" fontSize="11" fill={TINTA}>(planta verde)</text>
          <text x={200} y={290} textAnchor="middle" fontSize="11" fontWeight="800" fill="#b05a5a">3. Lo pone en el pistilo de la flor sin estambres</text>
        </g>
      )}

      {/* F1: la vaina se abre y todas son amarillas */}
      {es('f1') && (
        <g key="f1">
          <g transform="translate(200 150)">
            <Vaina x={0} y={20} ancho={300} r={20} semillas={[true, true, true, true, true]} retraso={0.6} />
          </g>
          <text x={200} y={250} textAnchor="middle" fontSize="15" fontWeight="800" fill={TINTA} className="mdl-aparece" style={{ animationDelay: '2s' }}>
            Todas amarillas
          </text>
          <text x={200} y={272} textAnchor="middle" fontSize="12" fill={TINTA} className="mdl-aparece" style={{ animationDelay: '2.4s' }}>
            ¿Dónde quedó el verde?
          </text>
        </g>
      )}

      {/* autofecundación: el polen cae dentro de la misma flor */}
      {es('autofecundar') && (
        <g key="auto">
          <circle cx={200} cy={150} r={100} fill="none" stroke="#b05a5a" strokeWidth={2} strokeDasharray="4 8" className="mdl-gira" />
          <FlorGrande x={200} y={160} estambres />
          {[-22, -5, 13, 22, -13, 5].map((dx, k) => (
            <circle
              key={k}
              cx={200 + dx}
              cy={143}
              r={2.4}
              fill="#f2c52e"
              className="mdl-cae"
              style={{ animationDelay: `${0.4 * k}s`, ['--hacia' as string]: `translate(${-dx}px, -14px)` }}
            />
          ))}
          <text x={200} y={28} textAnchor="middle" fontSize="12" fontWeight="800" fill={TINTA}>Flor de una planta F1</text>
          <text x={200} y={270} textAnchor="middle" fontSize="12" fontWeight="800" fill="#b05a5a">Su propio polen cae en su pistilo</text>
          <text x={200} y={286} textAnchor="middle" fontSize="11" fill={TINTA}>En la arveja pasa con la flor cerrada</text>
        </g>
      )}

      {/* F2: cuatro vainas, 3 amarillas por cada verde */}
      {f2 && (
        <g key="f2">
          {F2.map((v, k) => (
            <Vaina key={k} x={v.x} y={v.y} ancho={140} r={13} semillas={v.g.map((g) => g !== 'aa')} retraso={es('alelos') ? 0 : 0.3 + k * 0.9} letras={es('alelos') ? v.g : undefined} />
          ))}
          {es('f2') ? (
            <g className="mdl-aparece" style={{ animationDelay: '4.4s' }}>
              <rect x={70} y={258} width={260} height={30} rx={15} fill="#3a4450" />
              <text x={200} y={278} textAnchor="middle" fontSize="13" fontWeight="800" fill="#fff">12 amarillas : 4 verdes = 3 : 1</text>
            </g>
          ) : (
            <g className="mdl-aparece">
              <rect x={50} y={258} width={300} height={30} rx={15} fill="#3a4450" />
              <text x={200} y={278} textAnchor="middle" fontSize="13" fontWeight="800" fill="#fff">1 AA : 2 Aa : 1 aa → 3 amarillas : 1 verde</text>
            </g>
          )}
        </g>
      )}

      <Insignia texto={es('p') ? 'P' : es('polinizar') ? 'P · cruce' : es('f1') || es('autofecundar') ? 'F1' : 'F2'} />
    </svg>
  )
}
