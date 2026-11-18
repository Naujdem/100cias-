// Escenas vivas de Química, área 4, tema 5: concentración de las soluciones.

const suave = 'all 1.1s cubic-bezier(.45,.05,.25,1)'
const ver = (si: boolean) => ({ transition: 'opacity 0.7s ease', opacity: si ? 1 : 0 })
const idx = (orden: string[], fase: string) => Math.max(0, orden.indexOf(fase))

const TINTA = '#3a3a3a'
const AZUL = '#3f6fb8'
const ROJO = '#c43c3c'
const VERDE = '#4f8a3c'
const COBRE = (a: number) => `rgba(40, 110, 200, ${a})`

function T({ x, y, t, c = TINTA, s = 12, peso = 800 }: { x: number; y: number; t: string; c?: string; s?: number; peso?: number }) {
  return <text x={x} y={y} textAnchor="middle" fontSize={s} fontWeight={peso} fill={c}>{t}</text>
}
function Vaso({ x, y = 70, w = 90, h = 130, nivel = 1, color }: { x: number; y?: number; w?: number; h?: number; nivel?: number; color: string }) {
  const alto = (h - 10) * nivel
  return (
    <g>
      <rect x={x} y={y + h - alto} width={w} height={alto} fill={color} style={{ transition: suave }} />
      <path d={`M${x} ${y} V${y + h} H${x + w} V${y}`} fill="none" stroke={TINTA} strokeWidth="3" />
    </g>
  )
}
const puntos = (x: number, y: number, w: number, h: number, n: number, c = '#1f4f99') =>
  Array.from({ length: n }, (_, k) => <circle key={k} cx={x + 8 + ((k * 37) % (w - 16))} cy={y + 8 + ((k * 23) % (h - 16))} r="3" fill={c} />)

/* ── Diluida y concentrada ────────────────────────────────────────────── */

const CC = ['diluida', 'concentrada', 'mismo']

export function EscenaConcentracionColor({ fase }: { fase: string }) {
  const i = idx(CC, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Concentración: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#f4f1ea" />
      <g style={ver(i <= 1)}>
        <Vaso x={70} color={COBRE(0.2)} />{puntos(70, 80, 90, 120, 4)}
        <Vaso x={240} color={COBRE(0.7)} />{puntos(240, 80, 90, 120, 18)}
        <T x={115} y={225} t="diluida" s={14} c={AZUL} /><T x={115} y={242} t="poco soluto" s={11} peso={600} />
        <T x={285} y={225} t="concentrada" s={14} c={ROJO} /><T x={285} y={242} t="mucho soluto" s={11} peso={600} />
        <g style={{ opacity: i === 0 ? 1 : 0.25, transition: suave }}><rect x="60" y="60" width="110" height="200" fill="none" stroke={AZUL} strokeWidth="2" strokeDasharray="5 4" /></g>
        <g style={{ opacity: i === 1 ? 1 : 0.25, transition: suave }}><rect x="230" y="60" width="110" height="200" fill="none" stroke={ROJO} strokeWidth="2" strokeDasharray="5 4" /></g>
        <T x={200} y={282} t="Mismo volumen de agua, distinta cantidad de soluto" s={12} />
      </g>
      <g style={ver(i === 2)}>
        <Vaso x={60} y={110} w={60} h={90} color={COBRE(0.55)} />{puntos(60, 125, 60, 75, 4)}
        <Vaso x={190} w={150} color={COBRE(0.55)} />{puntos(190, 80, 150, 120, 14)}
        <T x={90} y={225} t="un vasito" s={12} /><T x={265} y={225} t="una jarra" s={12} />
        <T x={200} y={255} t="Mismo color = misma concentración" s={14} c={VERDE} />
        <T x={200} y={277} t="la concentración no depende de cuánto sirvas" s={11} peso={600} />
      </g>
    </svg>
  )
}

/* ── Partes por millón ────────────────────────────────────────────────── */

const PP = ['litro', 'tanque', 'cloro']

export function EscenaPpm({ fase }: { fase: string }) {
  const i = idx(PP, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Partes por millón: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#eef2f6" />
      <g style={ver(i === 0)}>
        <path d="M160 60 h80 l10 30 v130 h-100 v-130 z" fill="#d7eaf7" stroke={TINTA} strokeWidth="3" />
        <circle cx="200" cy="160" r="2.5" fill={ROJO} />
        <line x1="205" y1="158" x2="270" y2="120" stroke={ROJO} />
        <T x={300} y={115} t="1 mg" s={14} c={ROJO} />
        <T x={200} y={250} t="1 mg de soluto en 1 L de agua = 1 ppm" s={14} />
        <T x={200} y={272} t="una parte en un millón (1 L de agua pesa 1 000 000 mg)" s={11} peso={600} />
      </g>
      <g style={ver(i === 1)}>
        <rect x="80" y="70" width="240" height="140" rx="10" fill="#d7eaf7" stroke={TINTA} strokeWidth="3" />
        <circle cx="200" cy="140" r="4" fill={ROJO} />
        <T x={200} y={60} t="tanque de 1000 litros" s={12} />
        <T x={200} y={250} t="1 g en 1000 L también es 1 ppm" s={14} />
        <T x={200} y={272} t="se usa para cantidades muy pequeñas" s={11} peso={600} />
      </g>
      <g style={ver(i === 2)}>
        <rect x="60" y="60" width="140" height="150" rx="10" fill="#d7eaf7" stroke={TINTA} strokeWidth="3" />
        <path d="M240 60 h40 v40 h30 v20 h-70 z" fill="#9aa1a8" stroke={TINTA} />
        <path d="M300 125 q0 12 -6 18 q-6 -6 -6 -18" fill="#9cc7e6" />
        <T x={130} y={140} t="agua potable" s={12} />
        <rect x="235" y="150" width="140" height="58" rx="8" fill="#fff" stroke={VERDE} strokeWidth="2" />
        <T x={305} y={172} t="cloro libre:" s={11} c={VERDE} />
        <T x={305} y={195} t="0,3 a 2 ppm" s={15} c={VERDE} />
        <T x={200} y={250} t="Suficiente para matar microbios" s={14} />
        <T x={200} y={272} t="y tan poco que se puede tomar sin peligro" s={11} peso={600} />
      </g>
    </svg>
  )
}

/* ── Preparar una solución molar ──────────────────────────────────────── */

const PM = ['pesar', 'disolver', 'aforar']

export function EscenaPrepararMolar({ fase }: { fase: string }) {
  const i = idx(PM, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Preparar una solución 1 M: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#f4f1ea" />
      <g style={ver(i === 0)}>
        <rect x="110" y="170" width="180" height="30" rx="6" fill="#9aa1a8" stroke={TINTA} strokeWidth="2" />
        <rect x="130" y="176" width="70" height="18" fill="#cfe9d0" /><T x={165} y={190} t="58,5 g" s={11} c={VERDE} />
        <path d="M220 168 q20 -30 40 0 z" fill="#fff" stroke="#bbb" />
        <T x={200} y={120} t="1 mol de NaCl = 58,5 g" s={15} c={AZUL} />
      </g>
      <g style={ver(i >= 1)}>
        <path d="M185 40 h30 v80 l60 70 q8 22 -14 24 h-122 q-22 -2 -14 -24 l60 -70 z" fill="#fff" stroke={TINTA} strokeWidth="3" />
        <path d={i === 1 ? 'M152 175 l-15 18 q-6 14 8 16 h110 q14 -2 8 -16 l-15 -18 z' : 'M185 70 h30 v50 l60 70 q8 22 -14 24 h-122 q-22 -2 -14 -24 l60 -70 z'} fill="#d7eaf7" style={{ transition: suave }} />
        <line x1="180" y1="70" x2="220" y2="70" stroke={ROJO} strokeWidth="2" />
        <T x={265} y={74} t="aforo: 1 L" s={11} c={ROJO} />
        <T x={200} y={255} t={i === 1 ? 'Se disuelve en un poco de agua' : 'Se completa con agua hasta la marca de 1 L'} s={13} />
        <g style={ver(i === 2)}><T x={200} y={280} t="1 mol en 1 L de solución = 1 M" s={15} c={VERDE} /></g>
      </g>
    </svg>
  )
}

/* ── Diluir ───────────────────────────────────────────────────────────── */

const DI = ['inicial', 'agregar', 'final']

export function EscenaDilucion({ fase }: { fase: string }) {
  const i = idx(DI, fase)
  const nivel = i === 2 ? 1 : i === 1 ? 0.7 : 0.25
  const color = i === 0 ? COBRE(0.8) : i === 1 ? COBRE(0.45) : COBRE(0.22)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Dilución: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#f4f1ea" />
      <Vaso x={150} y={50} w={110} h={160} nivel={nivel} color={color} />
      {puntos(150, 210 - 150 * nivel, 110, 150 * nivel, 8)}
      <g style={ver(i === 1)}>
        <path d="M300 30 h40 v20 l-12 20 h-16 l-12 -20 z" fill="#d7eaf7" stroke={TINTA} />
        <line x1="320" y1="70" x2="250" y2="120" stroke={AZUL} strokeWidth="3" strokeDasharray="5 4" />
        <T x={330} y={20} t="+ agua" s={12} c={AZUL} />
      </g>
      <rect x="20" y="70" width="110" height="80" rx="10" fill="#fff" stroke={TINTA} />
      <T x={75} y={92} t={['100 mL', '…', '400 mL'][i]} s={13} />
      <T x={75} y={114} t={['2 M', '…', '0,5 M'][i]} s={15} c={ROJO} />
      <T x={75} y={136} t="8 partículas" s={10} peso={600} />
      <T x={200} y={250} t={['Solución concentrada', 'Agregar agua no agrega soluto', 'Más volumen, la misma cantidad de soluto'][i]} s={14} />
      <g style={ver(i === 2)}><T x={200} y={275} t="C₁ × V₁ = C₂ × V₂ → 2 M × 100 mL = 0,5 M × 400 mL" s={12} c={VERDE} /></g>
    </svg>
  )
}
