// Escenas vivas de Química, área 4, tema 8: ácidos, bases y pH.

const suave = 'all 1.1s cubic-bezier(.45,.05,.25,1)'
const ver = (si: boolean) => ({ transition: 'opacity 0.7s ease', opacity: si ? 1 : 0 })
const idx = (orden: string[], fase: string) => Math.max(0, orden.indexOf(fase))

const TINTA = '#3a3a3a'
const AZUL = '#3f6fb8'
const ROJO = '#c43c3c'
const VERDE = '#4f8a3c'
export const COLOR_REPOLLO = ['#d6243b', '#d62a52', '#d9356b', '#c9407e', '#a34a95', '#8a4fa6', '#7356ad', '#5a5fb2', '#3f74a8', '#3a8a8a', '#3f9a5c', '#7fb03a', '#c2c22e', '#d9c62a', '#e0b927']

function T({ x, y, t, c = TINTA, s = 12, peso = 800 }: { x: number; y: number; t: string; c?: string; s?: number; peso?: number }) {
  return <text x={x} y={y} textAnchor="middle" fontSize={s} fontWeight={peso} fill={c}>{t}</text>
}
function Tubo({ x, color, et, y = 70 }: { x: number; color: string; et?: string; y?: number }) {
  return (
    <g>
      <path d={`M${x - 14} ${y} v110 a14 14 0 0 0 28 0 v-110`} fill="#fff" stroke={TINTA} strokeWidth="2" />
      <path d={`M${x - 12} ${y + 40} v70 a12 12 0 0 0 24 0 v-70 z`} fill={color} style={{ transition: suave }} />
      {et && <T x={x} y={y + 145} t={et} s={10} peso={600} />}
    </g>
  )
}

/* ── Ácidos y bases ───────────────────────────────────────────────────── */

const AB = ['acidos', 'bases', 'arrhenius']

export function EscenaAcidoBase({ fase }: { fase: string }) {
  const i = idx(AB, fase)
  const fila = (items: [string, string][]) => items.map(([ic, n], k) => (
    <g key={n}><text x={70 + k * 90} y={130} textAnchor="middle" fontSize="40">{ic}</text><T x={70 + k * 90} y={160} t={n} s={11} /></g>
  ))
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Ácidos y bases: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#f4f1ea" />
      <g style={ver(i === 0)}>
        {fila([['🍋', 'limón'], ['🫙', 'vinagre'], ['🍊', 'naranja'], ['🥤', 'gaseosa']])}
        <T x={200} y={60} t="ÁCIDOS" s={18} c={ROJO} />
        <T x={200} y={210} t="Sabor agrio · corroen metales · ponen rojo el repollo" s={12} />
      </g>
      <g style={ver(i === 1)}>
        {fila([['🧼', 'jabón'], ['🧂', 'bicarbonato'], ['🪨', 'cal'], ['🧴', 'blanqueador']])}
        <T x={200} y={60} t="BASES" s={18} c={AZUL} />
        <T x={200} y={210} t="Sabor amargo · se sienten jabonosas · ponen verde el repollo" s={12} />
      </g>
      <g style={ver(i === 2)}>
        <T x={200} y={80} t="HCl → H⁺ + Cl⁻" s={22} c={ROJO} />
        <T x={200} y={105} t="ácido: suelta H⁺ en el agua" s={12} peso={600} />
        <T x={200} y={160} t="NaOH → Na⁺ + OH⁻" s={22} c={AZUL} />
        <T x={200} y={185} t="base: suelta OH⁻ en el agua" s={12} peso={600} />
        <T x={200} y={225} t="Arrhenius, 1887" s={12} c={VERDE} />
      </g>
      <rect x="40" y="245" width="320" height="34" rx="8" fill="#fff3d6" stroke="#e0a43c" />
      <T x={200} y={267} t="⚠️ En el laboratorio nunca se prueba ni se toca nada" s={12} />
    </svg>
  )
}

/* ── El indicador de repollo morado ───────────────────────────────────── */

const RP = ['hervir', 'colores', 'fenolftaleina']

export function EscenaRepolloIndicador({ fase }: { fase: string }) {
  const i = idx(RP, fase)
  const tubos: [number, string][] = [[2, 'limón'], [3, 'vinagre'], [7, 'agua'], [8, 'bicarbonato'], [10, 'jabón'], [12, 'cal']]
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Indicador de repollo: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#f4f1ea" />
      <g style={ver(i === 0)}>
        <rect x="120" y="120" width="160" height="90" rx="8" fill="#888" />
        <rect x="124" y="130" width="152" height="76" fill="#6a3d8f" />
        {[150, 190, 230].map((x) => <path key={x} d={`M${x} 135 q12 -8 24 0 q-12 10 -24 0 z`} fill="#8e5bb5" />)}
        {[-30, 0, 30].map((d) => <path key={d} d={`M${200 + d} 245 q-6 -10 0 -18 q6 -8 0 -16`} fill="#f6a33c" />)}
        <T x={200} y={90} t="Repollo morado picado y hervido" s={14} />
        <T x={200} y={275} t="El agua morada es un indicador: cambia de color con el pH" s={11} peso={600} />
      </g>
      <g style={ver(i === 1)}>
        {tubos.map(([ph, n], k) => <Tubo key={n} x={55 + k * 58} color={COLOR_REPOLLO[ph]} et={n} y={50} />)}
        <T x={200} y={250} t="Ácido: rojo o rosado · neutro: morado · básico: azul, verde o amarillo" s={11} />
      </g>
      <g style={ver(i === 2)}>
        <Tubo x={130} color="#f3f3f3" et="ácido o neutro" />
        <Tubo x={270} color="#e0399a" et="básico" />
        <T x={200} y={50} t="Fenolftaleína" s={15} c="#c0307f" />
        <T x={200} y={260} t="Incolora en ácidos, fucsia en bases (desde pH ≈ 8,2)" s={12} />
      </g>
    </svg>
  )
}

/* ── El pH del suelo y el encalado ────────────────────────────────────── */

const SU = ['acido', 'cal', 'sano']

export function EscenaSueloPh({ fase }: { fase: string }) {
  const i = idx(SU, fase)
  const verde = ['#b8b86a', '#9fb062', VERDE][i]
  const alto = [40, 55, 80][i]
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`pH del suelo: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#dcecf7" />
      <rect x="0" y="190" width="400" height="110" fill="#7a5233" />
      {[70, 150, 230, 310].map((x) => (
        <g key={x}>
          <line x1={x} y1="190" x2={x} y2={190 - alto} stroke="#5f7d47" strokeWidth="4" style={{ transition: suave }} />
          {[0, 1, 2].map((k) => <ellipse key={k} cx={x + (k % 2 ? 10 : -10)} cy={190 - alto * (0.4 + k * 0.25)} rx="11" ry="6" fill={verde} style={{ transition: suave }} />)}
        </g>
      ))}
      <g style={ver(i === 1)}>
        {Array.from({ length: 30 }, (_, k) => <circle key={k} cx={20 + ((k * 53) % 360)} cy={150 + ((k * 17) % 40)} r="2.5" fill="#f4f4f4" />)}
        <T x={200} y={60} t="cal agrícola (CaCO₃)" s={14} />
      </g>
      <rect x="290" y="20" width="96" height="44" rx="8" fill="#fff" stroke={TINTA} />
      <T x={338} y={38} t="pH del suelo" s={10} peso={600} />
      <T x={338} y={57} t={['4,5', '5,0 → …', '5,8'][i]} s={15} c={i === 2 ? VERDE : ROJO} />
      <T x={200} y={235} t={['Suelo muy ácido: las plantas no aprovechan el abono', 'Encalado: la cal neutraliza parte de la acidez', 'Con el pH adecuado, la planta toma mejor los nutrientes'][i]} s={13} c="#fff" />
      <T x={200} y={258} t={['mucha lluvia lava el calcio y el magnesio', 'se hace según el análisis de suelo', 'el café prefiere suelos algo ácidos (≈ 5 a 5,5)'][i]} s={11} peso={600} c="#fff" />
    </svg>
  )
}

/* ── Fuertes y débiles ────────────────────────────────────────────────── */

const FD = ['fuerte', 'debil', 'comparar']

export function EscenaFuerteDebil({ fase }: { fase: string }) {
  const i = idx(FD, fase)
  const vaso = (x: number, iones: number, enteras: number, et: string, c: string) => (
    <g>
      <rect x={x} y="70" width="130" height="130" fill="#e8f2fa" />
      <path d={`M${x} 60 V200 H${x + 130} V60`} fill="none" stroke={TINTA} strokeWidth="3" />
      {Array.from({ length: iones }, (_, k) => <g key={`i${k}`}><circle cx={x + 15 + ((k * 37) % 100)} cy={85 + ((k * 23) % 100)} r="5" fill={ROJO} /><text x={x + 15 + ((k * 37) % 100)} y={88 + ((k * 23) % 100)} textAnchor="middle" fontSize="7" fill="#fff" fontWeight="800">H⁺</text></g>)}
      {Array.from({ length: enteras }, (_, k) => <g key={`e${k}`}><circle cx={x + 25 + ((k * 41) % 90)} cy={95 + ((k * 29) % 90)} r="7" fill="#9aa1a8" /><circle cx={x + 33 + ((k * 41) % 90)} cy={95 + ((k * 29) % 90)} r="4" fill={ROJO} /></g>)}
      <T x={x + 65} y={225} t={et} s={12} c={c} />
    </g>
  )
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Ácidos fuertes y débiles: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#f4f1ea" />
      <g style={{ ...ver(i !== 1), transform: i === 2 ? 'translateX(-60px)' : 'translateX(65px)', transition: suave }}>{vaso(70, 10, 0, 'HCl: fuerte', ROJO)}</g>
      <g style={{ ...ver(i !== 0), transform: i === 2 ? 'translateX(60px)' : 'translateX(-65px)', transition: suave }}>{vaso(200, 1, 9, 'ácido acético: débil', AZUL)}</g>
      <T x={200} y={30} t={['Fuerte: TODAS sus moléculas sueltan el H⁺', 'Débil: solo unas pocas lo sueltan (equilibrio ⇌)', 'Misma concentración, distinto pH'][i]} s={13} />
      <T x={200} y={262} t={['HCl, H₂SO₄, HNO₃ · NaOH, KOH', 'vinagre, ácido carbónico, ácido cítrico · amoníaco', 'HCl 0,1 M: pH 1 · ácido acético 0,1 M: pH ≈ 2,9'][i]} s={11} peso={600} />
      <T x={200} y={282} t="«Fuerte» no es lo mismo que «concentrado»" s={11} peso={600} c={VERDE} />
    </svg>
  )
}

/* ── Titulación ───────────────────────────────────────────────────────── */

const TI = ['inicio', 'goteo', 'punto']

export function EscenaTitulacion({ fase }: { fase: string }) {
  const i = idx(TI, fase)
  const color = ['#f6f6f6', '#f9eef4', '#f4c4de'][i]
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Titulación: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#f4f1ea" />
      <rect x="112" y="10" width="16" height="150" fill="#fff" stroke={TINTA} strokeWidth="2" />
      <rect x="114" y={[20, 60, 90][i]} width="12" height={[138, 98, 68][i]} fill="#dbe9f6" style={{ transition: suave }} />
      <path d="M116 160 h8 l-2 14 h-4 z" fill={TINTA} />
      {i === 1 && <circle cx="120" cy="178" r="3" fill="#dbe9f6" stroke="#9bb"><animate attributeName="cy" values="178;215" dur="0.8s" repeatCount="indefinite" /></circle>}
      <path d="M95 200 h50 l25 60 q4 12 -10 12 h-80 q-14 0 -10 -12 z" fill="#fff" stroke={TINTA} strokeWidth="2" />
      <path d="M85 240 h70 l10 22 q2 8 -8 8 h-74 q-10 0 -8 -8 z" fill={color} style={{ transition: suave }} />
      <T x={150} y={20} t="bureta: NaOH 0,1 M" s={10} c={AZUL} />
      <T x={120} y={292} t="HCl + fenolftaleína" s={10} c={ROJO} />
      <line x1="230" y1="250" x2="380" y2="250" stroke={TINTA} /><line x1="230" y1="90" x2="230" y2="250" stroke={TINTA} />
      <path d="M230 230 C 280 225 295 215 300 170 C 305 125 320 115 380 110" fill="none" stroke={VERDE} strokeWidth="3" />
      <circle cx={[232, 285, 300][i]} cy={[229, 222, 170][i]} r="6" fill={ROJO} style={{ transition: suave }} />
      <line x1="230" y1="170" x2="380" y2="170" stroke="#bbb" strokeDasharray="3 3" />
      <T x={250} y={166} t="pH 7" s={9} peso={600} />
      <T x={305} y={268} t="NaOH agregado" s={10} peso={600} />
      <T x={305} y={70} t={['Al empezar: ácido, incoloro', 'Gota a gota, se neutraliza', '¡Rosado pálido! Punto final'][i]} s={12} c={i === 2 ? '#c0307f' : TINTA} />
    </svg>
  )
}
