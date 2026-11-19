import type { ReactNode } from 'react'
// Escenas vivas del área 6, tema 8 (Huesos y músculos).

const suave = 'transform 1.1s cubic-bezier(.45,.05,.25,1), opacity 0.7s ease, fill 0.8s ease, stroke 0.8s ease'
const TINTA = '#3a3a3a'
const AZUL = '#2f6fc1'
const ROJO = '#c43c3c'
const VERDE = '#3f9a5a'
const MORADO = '#7a4a9a'
const HUESO = '#efe6d0'
const BORDE = '#a89870'
const FONDO = '#f3f0ea'

function T({ x, y, t, c = TINTA, s = 12, peso = 800 }: { x: number; y: number; t: string; c?: string; s?: number; peso?: number }) {
  return <text x={x} y={y} textAnchor="middle" fontSize={s} fontWeight={peso} fill={c} stroke="#fff" strokeWidth="3" paintOrder="stroke">{t}</text>
}
function Ver({ si, children }: { si: boolean; children: ReactNode }) {
  return <g style={{ transition: suave, opacity: si ? 1 : 0 }}>{children}</g>
}
const idx = (lista: string[], fase: string) => Math.max(0, lista.indexOf(fase))

/* ── 1. El esqueleto y sus funciones ────────────────────────────────────── */

const ESQ = ['esqueleto', 'sosten', 'proteccion', 'movimiento', 'fabrica']
const ESQ_TXT: Record<string, [string, string]> = {
  esqueleto: ['206 huesos', 'en un adulto'],
  sosten: ['Sostén', 'la columna y las piernas cargan el cuerpo'],
  proteccion: ['Protección', 'cráneo: encéfalo · costillas: corazón y pulmones'],
  movimiento: ['Movimiento', 'los músculos jalan los huesos'],
  fabrica: ['Fábrica y despensa', 'médula roja: sangre · calcio guardado'],
}

export function EscenaLocEsqueleto({ fase }: { fase: string }) {
  const f = ESQ.includes(fase) ? fase : 'esqueleto'
  const on = (g: string) => f === 'esqueleto' || f === g || (f === 'fabrica' && g === 'largos')
  const st = (g: string) => ({ transition: suave, opacity: on(g) ? 1 : 0.25 })
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={ESQ_TXT[f][0]} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={FONDO} />
      <g fill={HUESO} stroke={BORDE} strokeWidth="2">
        <g style={st('proteccion')}><ellipse cx="140" cy="32" rx="20" ry="23" /></g>
        <g style={st('proteccion')}>{[0, 1, 2, 3, 4].map((k) => <path key={k} d={`M 140 ${72 + k * 12} q -32 4 -38 14 M 140 ${72 + k * 12} q 32 4 38 14`} fill="none" />)}</g>
        <g style={st('sosten')}>{Array.from({ length: 11 }, (_, k) => <rect key={k} x="134" y={56 + k * 11} width="12" height="9" rx="2" />)}</g>
        <g style={st('sosten')}><path d="M 112 178 Q 140 168 168 178 L 160 198 H 120 Z" /></g>
        <g style={st('movimiento')}>
          <path d="M 110 66 L 98 130 L 90 190 M 170 66 L 182 130 L 190 190" fill="none" strokeWidth="7" strokeLinecap="round" />
          <path d="M 125 198 L 120 245 L 118 290 M 155 198 L 160 245 L 162 290" fill="none" strokeWidth="9" strokeLinecap="round" />
        </g>
        <Ver si={f === 'fabrica'}><path d="M 125 205 L 121 240 M 155 205 L 159 240" stroke={ROJO} strokeWidth="3" fill="none" /></Ver>
      </g>
      <Ver si={f === 'movimiento'}>{[[98, 130], [182, 130], [120, 245], [160, 245]].map(([x, y]) => <circle key={x + y} cx={x} cy={y} r="6" fill={AZUL} />)}</Ver>
      <T x={300} y={130} t={ESQ_TXT[f][0]} c={AZUL} s={17} />
      <T x={300} y={152} t={ESQ_TXT[f][1]} s={10} peso={600} />
    </svg>
  )
}

/* ── 2. El hueso por dentro ─────────────────────────────────────────────── */

const HUE = ['hueso', 'compacto', 'esponjoso', 'medula', 'fractura']

export function EscenaLocHueso({ fase }: { fase: string }) {
  const i = idx(HUE, fase)
  const roto = fase === 'fractura'
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`El hueso: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={FONDO} />
      {/* fémur en corte */}
      <g style={{ transition: suave, transform: roto ? 'rotate(4deg)' : 'none', transformOrigin: '200px 150px' }}>
        <path d="M 60 120 C 40 90 90 80 110 110 H 290 C 310 80 360 90 340 120 C 360 150 310 170 290 150 H 110 C 90 170 40 150 60 120 Z" fill={HUESO} stroke={BORDE} strokeWidth="3" />
        <rect x="120" y="117" width="160" height="26" fill={i >= 3 ? '#f2d47a' : '#f6efe0'} style={{ transition: suave }} />
        <g style={{ transition: suave, opacity: i >= 2 ? 1 : 0.2 }}>
          {Array.from({ length: 14 }, (_, k) => <circle key={k} cx={58 + (k % 4) * 9 + (k > 6 ? 250 : 0)} cy={108 + Math.floor((k % 7) / 2) * 9} r="3.5" fill={i >= 3 ? '#d86a6a' : '#fff'} stroke={BORDE} />)}
        </g>
      </g>
      <Ver si={roto}>
        <path d="M 195 100 l 8 15 l -8 15 l 10 15 l -6 15" fill="none" stroke={ROJO} strokeWidth="4" />
        <ellipse cx="200" cy="130" rx="30" ry="40" fill="none" stroke={VERDE} strokeWidth="3" strokeDasharray="5 4" />
      </Ver>
      <T x={200} y={36} t={['El fémur: el hueso más largo', 'Hueso compacto: duro y denso, por fuera', 'Hueso esponjoso: liviano y fuerte, en los extremos', 'Médula: roja hace sangre; amarilla guarda grasa', 'Fractura: el hueso es vivo y se repara'][i]} c={AZUL} s={13} />
      <Ver si={i === 1}><T x={200} y={185} t="calcio y fósforo lo hacen duro; el colágeno, flexible" s={11} peso={600} /></Ver>
      <Ver si={i === 3}><T x={200} y={185} t="médula roja en los extremos · amarilla en el centro" s={11} peso={600} /></Ver>
      <Ver si={roto}><T x={200} y={210} t="se forma un callo que en semanas une los pedazos" c={VERDE} s={11} /></Ver>
    </svg>
  )
}

/* ── 3. Las articulaciones ──────────────────────────────────────────────── */

const ART = ['fijas', 'semimoviles', 'moviles', 'partes']

export function EscenaLocArticulaciones({ fase }: { fase: string }) {
  const f = ART.includes(fase) ? fase : 'fijas'
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Articulaciones: ${f}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={FONDO} />
      <Ver si={f === 'fijas'}>
        <ellipse cx="200" cy="150" rx="90" ry="80" fill={HUESO} stroke={BORDE} strokeWidth="3" />
        <path d="M 200 72 l -6 14 l 8 12 l -8 14 l 6 14 l -6 12 M 130 120 l 14 4 l 10 -6 l 14 6 l 12 -4 l 20 4" fill="none" stroke={BORDE} strokeWidth="2.5" />
        <T x={200} y={265} t="Fijas: los huesos del cráneo no se mueven (suturas)" c={AZUL} s={12} />
      </Ver>
      <Ver si={f === 'semimoviles'}>
        {[60, 115, 170].map((y) => <rect key={y} x="160" y={y} width="80" height="40" rx="6" fill={HUESO} stroke={BORDE} strokeWidth="3" />)}
        {[100, 155].map((y) => <rect key={y} x="165" y={y} width="70" height="15" rx="6" fill="#9cc8ec" />)}
        <T x={300} y={115} t="disco de cartílago" c={AZUL} s={10} />
        <T x={200} y={265} t="Semimóviles: las vértebras se mueven un poco" c={AZUL} s={12} />
      </Ver>
      <Ver si={f === 'moviles' || f === 'partes'}>
        <rect x="170" y="20" width="60" height="105" rx="20" fill={HUESO} stroke={BORDE} strokeWidth="3" />
        <rect x="170" y="155" width="60" height="105" rx="20" fill={HUESO} stroke={BORDE} strokeWidth="3" />
        <g style={{ transition: suave, opacity: f === 'partes' ? 1 : 0 }}>
          <rect x="172" y="115" width="56" height="12" rx="5" fill="#9cc8ec" />
          <rect x="172" y="153" width="56" height="12" rx="5" fill="#9cc8ec" />
          <ellipse cx="200" cy="140" rx="34" ry="14" fill="#d8ecf8" opacity="0.8" />
          <path d="M 166 95 C 150 140 150 140 166 185 M 234 95 C 250 140 250 140 234 185" fill="none" stroke={MORADO} strokeWidth="5" />
          <T x={300} y={122} t="cartílago" c={AZUL} s={10} /><T x={300} y={145} t="líquido sinovial" c={AZUL} s={10} /><T x={100} y={140} t="ligamentos" c={MORADO} s={10} />
        </g>
        <T x={200} y={290} t={f === 'partes' ? 'Partes que la protegen y la lubrican' : 'Móviles: rodilla, codo, hombro, cadera'} c={AZUL} s={12} />
      </Ver>
    </svg>
  )
}

/* ── 4. Músculos en pareja: bíceps y tríceps ────────────────────────────── */

export function EscenaLocAntagonistas({ fase }: { fase: string }) {
  const doblado = fase === 'flexion'
  const ang = doblado ? -70 : 0
  const bic = doblado ? ROJO : '#e8a8a0'
  const tri = fase === 'extension' ? ROJO : '#e8a8a0'
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Bíceps y tríceps: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={FONDO} />
      {/* húmero */}
      <rect x="60" y="140" width="160" height="16" rx="8" fill={HUESO} stroke={BORDE} strokeWidth="2" />
      {/* bíceps arriba, tríceps abajo */}
      <ellipse cx="140" cy="128" rx={doblado ? 55 : 70} ry={doblado ? 20 : 12} fill={bic} style={{ transition: suave }} />
      <ellipse cx="140" cy="168" rx={fase === 'extension' ? 55 : 70} ry={fase === 'extension' ? 18 : 12} fill={tri} style={{ transition: suave }} />
      {/* antebrazo que gira en el codo */}
      <g style={{ transition: suave, transform: `rotate(${ang}deg)`, transformOrigin: '228px 148px' }}>
        <rect x="228" y="141" width="130" height="14" rx="7" fill={HUESO} stroke={BORDE} strokeWidth="2" />
        <text x="370" y="156" fontSize="22">✊</text>
      </g>
      <circle cx="228" cy="148" r="9" fill="#9cc8ec" stroke={AZUL} strokeWidth="2" />
      <T x={140} y={doblado ? 98 : 110} t={`bíceps ${doblado ? '(se contrae)' : ''}`} c={doblado ? ROJO : TINTA} s={11} />
      <T x={140} y={198} t={`tríceps ${fase === 'extension' ? '(se contrae)' : ''}`} c={fase === 'extension' ? ROJO : TINTA} s={11} />
      <T x={200} y={28} t={fase === 'flexion' ? 'Flexión: el bíceps se acorta y jala; el tríceps se estira' : fase === 'extension' ? 'Extensión: el tríceps se acorta y jala; el bíceps se estira' : 'Los músculos solo jalan; por eso trabajan en pareja'} c={AZUL} s={12} />
      <T x={228} y={280} t="codo: la articulación" c={AZUL} s={10} peso={600} />
    </svg>
  )
}

/* ── 5. El sarcómero: actina y miosina ──────────────────────────────────── */

const SAR = ['relajado', 'contraido']

export function EscenaLocSarcomero({ fase }: { fase: string }) {
  const c = fase === 'contraido'
  const d = c ? 40 : 0
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`El sarcómero: ${SAR.includes(fase) ? fase : 'relajado'}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={FONDO} />
      {/* líneas Z */}
      <line x1={60 + d} y1="80" x2={60 + d} y2="220" stroke={TINTA} strokeWidth="5" style={{ transition: suave }} />
      <line x1={340 - d} y1="80" x2={340 - d} y2="220" stroke={TINTA} strokeWidth="5" style={{ transition: suave }} />
      {/* actina (delgada) pegada a las Z */}
      {[100, 140, 180, 120, 160, 200].map((y, k) => (
        <g key={k}>
          <line x1={60 + d} y1={y} x2={170 + d} y2={y} stroke={AZUL} strokeWidth="3" style={{ transition: suave }} />
          <line x1={340 - d} y1={y} x2={230 - d} y2={y} stroke={AZUL} strokeWidth="3" style={{ transition: suave }} />
        </g>
      ))}
      {/* miosina (gruesa) en el centro */}
      {[110, 150, 190].map((y) => (
        <g key={y}>
          <rect x="130" y={y - 5} width="140" height="10" rx="5" fill={ROJO} />
          {Array.from({ length: 6 }, (_, k) => <line key={k} x1={140 + k * 24} y1={y - 5} x2={146 + k * 24} y2={y - 12} stroke={ROJO} strokeWidth="2" />)}
        </g>
      ))}
      <T x={200} y={40} t={c ? 'Contraído: la miosina jala la actina hacia el centro' : 'Relajado: los filamentos apenas se tocan'} c={AZUL} s={13} />
      <T x={200} y={250} t="azul: actina · rojo: miosina · negro: líneas Z" s={10} peso={600} />
      <T x={200} y={272} t={c ? 'el sarcómero se acorta (usa ATP); miles juntos acortan el músculo' : 'el sarcómero es la unidad que se contrae'} s={10} peso={600} />
    </svg>
  )
}
