import { Particulas } from './EscenasGases.tsx'

// Escenas vivas de Química, área 4, tema 2: leyes de los gases.

const suave = 'all 1.1s cubic-bezier(.45,.05,.25,1)'
const ver = (si: boolean) => ({ transition: 'opacity 0.7s ease', opacity: si ? 1 : 0 })
const idx = (orden: string[], fase: string) => Math.max(0, orden.indexOf(fase))

const TINTA = '#3a3a3a'
const AZUL = '#3f6fb8'
const ROJO = '#c43c3c'
const VERDE = '#4f8a3c'
const GAS = '#5b8fd6'

function T({ x, y, t, c = TINTA, s = 12, peso = 800 }: { x: number; y: number; t: string; c?: string; s?: number; peso?: number }) {
  return <text x={x} y={y} textAnchor="middle" fontSize={s} fontWeight={peso} fill={c}>{t}</text>
}

/* ── Boyle: la jeringa tapada ─────────────────────────────────────────── */

const BOY = ['libre', 'mitad', 'cuarto']

export function EscenaBoyle({ fase }: { fase: string }) {
  const i = idx(BOY, fase)
  const largo = [240, 120, 60][i]
  const P = ['1 atm', '2 atm', '4 atm'][i]
  const V = ['40 mL', '20 mL', '10 mL'][i]
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Ley de Boyle: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#f4f1ea" />
      <rect x="40" y="90" width="270" height="70" rx="6" fill="#fff" stroke={TINTA} strokeWidth="3" />
      <rect x="22" y="112" width="18" height="26" fill={TINTA} />
      <g key={fase}><Particulas x={42} y={92} w={largo} h={66} n={14} dur={1.6} r={5} semilla={4} /></g>
      <g style={{ transition: suave, transform: `translateX(${largo}px)` }}>
        <rect x="42" y="92" width="10" height="66" fill="#9aa1a8" />
        <rect x="52" y="120" width="300" height="10" fill="#9aa1a8" />
        <rect x="352" y="100" width="10" height="50" rx="3" fill="#9aa1a8" />
      </g>
      <g style={ver(i > 0)}><T x={200} y={70} t="← empujo el émbolo" s={12} c={AZUL} /></g>
      <rect x="70" y="190" width="120" height="50" rx="10" fill="#fff" stroke={AZUL} strokeWidth="2" />
      <T x={130} y={212} t="VOLUMEN" s={10} c={AZUL} /><T x={130} y={232} t={V} s={16} />
      <rect x="210" y="190" width="120" height="50" rx="10" fill="#fff" stroke={ROJO} strokeWidth="2" />
      <T x={270} y={212} t="PRESIÓN" s={10} c={ROJO} /><T x={270} y={232} t={P} s={16} />
      <T x={200} y={272} t={['La jeringa tapada, sin empujar', 'La mitad del volumen → el doble de presión', 'Un cuarto del volumen → cuatro veces la presión'][i]} s={12} />
      <T x={200} y={292} t="P × V = 40 siempre (a temperatura constante)" s={11} peso={600} c={VERDE} />
    </svg>
  )
}

/* ── Charles: el globo en la nevera y al sol ──────────────────────────── */

const CHA = ['nevera', 'ambiente', 'sol']

export function EscenaCharles({ fase }: { fase: string }) {
  const i = idx(CHA, fase)
  const r = [42, 55, 66][i]
  const fondo = ['#dbeaf5', '#f4f1ea', '#fbe7c6'][i]
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Ley de Charles: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={fondo} style={{ transition: suave }} />
      <g style={ver(i === 0)}>
        <rect x="90" y="30" width="220" height="200" rx="10" fill="#eef6fb" stroke={TINTA} strokeWidth="2" />
        <T x={200} y={50} t="nevera · 4 °C" s={12} c={AZUL} />
      </g>
      <g style={ver(i === 2)}>
        <circle cx="340" cy="50" r="26" fill="#f6b73c" />
        {Array.from({ length: 8 }, (_, k) => <line key={k} x1={340 + Math.cos(k * 0.785) * 32} y1={50 + Math.sin(k * 0.785) * 32} x2={340 + Math.cos(k * 0.785) * 42} y2={50 + Math.sin(k * 0.785) * 42} stroke="#f6b73c" strokeWidth="3" />)}
      </g>
      <ellipse cx="200" cy="135" rx={r} ry={r * 1.15} fill={i === 2 ? '#e98a7a' : '#e57373'} opacity="0.85" stroke={TINTA} strokeWidth="2" style={{ transition: suave }} />
      <path d={`M200 ${135 + r * 1.15} l-6 10 h12 z`} fill="#e57373" style={{ transition: suave }} />
      <path d={`M200 ${145 + r * 1.15} q-10 30 0 60`} fill="none" stroke={TINTA} strokeWidth="1.5" style={{ transition: suave }} />
      <g key={fase}><Particulas x={200 - r * 0.6} y={135 - r * 0.7} w={r * 1.2} h={r * 1.4} n={8} dur={[2.6, 1.8, 1.1][i]} r={4} c={i === 2 ? ROJO : GAS} semilla={2} /></g>
      <T x={200} y={268} t={['En la nevera, el globo se encoge', 'A temperatura ambiente', 'Al sol, el globo se agranda'][i]} s={14} />
      <T x={200} y={290} t="Más temperatura → más volumen (a presión constante)" s={11} peso={600} c={VERDE} />
    </svg>
  )
}

/* ── Gay-Lussac: la olla a presión ────────────────────────────────────── */

const GL = ['fria', 'calentando', 'silba']

export function EscenaGayLussac({ fase }: { fase: string }) {
  const i = idx(GL, fase)
  const aguja = [-60, 0, 60][i]
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Ley de Gay-Lussac: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#f4f1ea" />
      <rect x="110" y="100" width="180" height="110" rx="12" fill="#b9bec4" stroke={TINTA} strokeWidth="3" />
      <rect x="100" y="88" width="200" height="16" rx="6" fill="#8e959c" stroke={TINTA} strokeWidth="2" />
      <rect x="292" y="140" width="60" height="12" rx="5" fill={TINTA} />
      <rect x="194" y="72" width="12" height="16" fill={TINTA} />
      <g key={fase}><Particulas x={114} y={106} w={172} h={100} n={14} dur={[2.4, 1.3, 0.7][i]} r={5} c={i === 0 ? GAS : ROJO} semilla={9} /></g>
      <g style={ver(i >= 1)}>
        {[140, 170, 200, 230, 260].map((x, k) => (
          <path key={x} d={`M${x} 238 q-8 -10 0 -20 q8 -10 0 -18`} fill={k % 2 ? '#f6a33c' : ROJO} stroke="none" opacity={i === 2 ? 1 : 0.7} />
        ))}
      </g>
      <g style={ver(i === 2)}>
        {[0, 1, 2].map((k) => <path key={k} d={`M${200 + (k - 1) * 10} 68 q-6 -14 0 -26 q6 -12 0 -24`} fill="none" stroke="#aaa" strokeWidth="3" />)}
        <T x={260} y={45} t="¡pssss!" s={16} c={ROJO} />
      </g>
      <circle cx="60" cy="140" r="34" fill="#fff" stroke={TINTA} strokeWidth="2" />
      <line x1="60" y1="140" x2="60" y2="114" stroke={ROJO} strokeWidth="3" style={{ transition: suave, transformOrigin: '60px 140px', transform: `rotate(${aguja}deg)` }} />
      <T x={60} y={192} t="presión" s={10} peso={600} />
      <T x={200} y={270} t={['Olla cerrada y fría', 'Al calentar, la presión sube', 'La válvula deja salir el vapor'][i]} s={14} />
      <T x={200} y={290} t="Más temperatura → más presión (a volumen constante)" s={11} peso={600} c={VERDE} />
    </svg>
  )
}

/* ── Avogadro: más gas, más volumen ───────────────────────────────────── */

const AVO = ['uno', 'dos', 'iguales', 'molar']

export function EscenaAvogadro({ fase }: { fase: string }) {
  const i = idx(AVO, fase)
  const globo = (x: number, r: number, c: string, n: number, et: string, sem: number) => (
    <g>
      <ellipse cx={x} cy="125" rx={r} ry={r * 1.15} fill={c} opacity="0.8" stroke={TINTA} strokeWidth="2" style={{ transition: suave }} />
      <Particulas x={x - r * 0.6} y={125 - r * 0.7} w={r * 1.2} h={r * 1.4} n={n} dur={1.8} r={4} c={TINTA} semilla={sem} />
      <T x={x} y={210} t={et} s={12} />
    </g>
  )
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Ley de Avogadro: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#eef2f6" />
      <g key={fase}>
        {i <= 1 && globo(200, i === 0 ? 45 : 64, '#9cc7e6', i === 0 ? 6 : 12, i === 0 ? '1 mol de aire' : '2 mol: el doble de volumen', 1)}
        {i >= 2 && (
          <>
            {globo(110, 52, '#9cc7e6', 8, 'oxígeno O₂', 3)}
            {globo(290, 52, '#f1d27a', 8, 'helio He', 6)}
          </>
        )}
      </g>
      <g style={ver(i === 2)}><T x={200} y={245} t="Mismo volumen, P y T → mismo número de partículas" s={13} c={AZUL} /></g>
      <g style={ver(i === 3)}>
        <rect x="120" y="225" width="160" height="34" rx="8" fill="#fff" stroke={ROJO} strokeWidth="2" />
        <T x={200} y={247} t="1 mol de gas = 22,4 L" s={15} c={ROJO} />
        <T x={200} y={278} t="a 0 °C y 1 atm (condiciones normales)" s={11} peso={600} />
      </g>
      <g style={ver(i <= 1)}><T x={200} y={250} t="Más partículas → más volumen (a P y T constantes)" s={13} c={VERDE} /></g>
    </svg>
  )
}

/* ── Gas ideal: presiones parciales (Dalton) y difusión (Graham) ──────── */

const IDE = ['dalton', 'graham']

export function EscenaDaltonGraham({ fase }: { fase: string }) {
  const i = idx(IDE, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Presiones parciales y difusión: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#f4f1ea" />
      <g style={ver(i === 0)}>
        <rect x="60" y="40" width="160" height="160" fill="#fff" stroke={TINTA} strokeWidth="3" />
        <Particulas x={62} y={42} w={156} h={156} n={16} dur={1.6} r={5} c={AZUL} semilla={21} />
        <Particulas x={62} y={42} w={156} h={156} n={4} dur={1.6} r={5} c={ROJO} semilla={22} />
        <rect x="240" y="50" width="34" height="140" fill="#ddd" />
        <rect x="240" y="78" width="34" height="112" fill={AZUL} />
        <rect x="240" y="50" width="34" height="28" fill={ROJO} />
        <text x="282" y="70" fontSize="11" fontWeight="800" fill={ROJO}>O₂ ≈ 21 %</text>
        <text x="282" y="140" fontSize="11" fontWeight="800" fill={AZUL}>N₂ ≈ 78 %</text>
        <T x={200} y={235} t="P total = P(N₂) + P(O₂) + …" s={15} c={VERDE} />
        <T x={200} y={260} t="Cada gas empuja como si estuviera solo" s={12} peso={600} />
        <T x={200} y={280} t="En Bogotá: 560 mmHg × 0,21 ≈ 118 mmHg de oxígeno" s={11} peso={600} />
      </g>
      <g style={ver(i === 1)}>
        <rect x="40" y="105" width="320" height="40" rx="20" fill="#fff" stroke={TINTA} strokeWidth="3" />
        <rect x="30" y="100" width="20" height="50" fill="#d9c3a5" />
        <rect x="350" y="100" width="20" height="50" fill="#d9c3a5" />
        <T x={40} y={90} t="NH₃" s={13} c={AZUL} /><T x={360} y={90} t="HCl" s={13} c={ROJO} />
        <T x={40} y={175} t="17 g/mol" s={10} peso={600} /><T x={360} y={175} t="36,5 g/mol" s={10} peso={600} />
        <rect x="221" y="107" width="16" height="36" fill="#fff" stroke="#bbb">
          <animate attributeName="opacity" values="0;1;1" dur="3s" fill="freeze" />
        </rect>
        <T x={229} y={200} t="anillo blanco de NH₄Cl" s={11} />
        <T x={200} y={240} t="El gas más liviano llega más lejos" s={15} c={VERDE} />
        <T x={200} y={262} t="Graham: velocidad ∝ 1 / √(masa molar)" s={12} peso={600} />
      </g>
    </svg>
  )
}
