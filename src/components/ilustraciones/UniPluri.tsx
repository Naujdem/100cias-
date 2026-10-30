// Ilustraciones esquemáticas (no a escala) del subtema 1.3 «Unicelulares y pluricelulares».
// Mismo estilo que las demás: fondo crema, trazo oscuro, colores suaves.

const TINTA = '#4a3416'
const FONDO = '#f4efe4'

function Fondo() {
  return <rect x="-1500" y="-1500" width="3400" height="3300" fill={FONDO} />
}

const rad = (g: number) => (g * Math.PI) / 180

/** Colores por tipo de célula: A rosada (general), B verde, C azul, D amarilla. */
const TIPOS = {
  A: { relleno: '#f8d9d4', borde: '#b05a5a' },
  B: { relleno: '#cfe8c4', borde: '#4f8a43' },
  C: { relleno: '#dce9f7', borde: '#3b6fb6' },
  D: { relleno: '#fbeedd', borde: '#b3661f' },
} as const
type Tipo = keyof typeof TIPOS

function Celula({ x, y, r, tipo = 'A', nucleo = true, grosor = 2.5 }: { x: number; y: number; r: number; tipo?: Tipo; nucleo?: boolean; grosor?: number }) {
  const t = TIPOS[tipo]
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={t.relleno} stroke={t.borde} strokeWidth={grosor} />
      {nucleo && <circle cx={x + r * 0.12} cy={y - r * 0.1} r={r * 0.3} fill="#c9a0dc" stroke="#7a4a8a" strokeWidth={Math.max(1, grosor * 0.6)} />}
    </g>
  )
}

export const PASOS_CELULAS = 5

/** Los cinco pasos de una célula a un organismo con tejidos (0 a 4). */
export function PasoCelulas({ paso }: { paso: number }) {
  const rotulos: [string, string][] = [
    ['Una sola célula', 'hace todo ella sola'],
    ['Células iguales, pegadas', 'cada una podría vivir sola'],
    ['Colonia (Volvox)', 'unas nadan y unas pocas se reproducen'],
    ['Esponja (esquema)', 'varios tipos de células, sin tejidos verdaderos'],
    ['Con tejidos y órganos (esquema)', 'muchos tipos de células, muy dependientes'],
  ]
  const [titulo, sub] = rotulos[paso] ?? rotulos[0]
  const etiqueta = `${titulo}: ${sub}`
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={etiqueta} className="h-full w-full">
      <Fondo />
      {paso === 0 && (
        <g>
          <Celula x={200} y={135} r={78} grosor={5} />
          {[[150, 170], [235, 175], [165, 100], [245, 105]].map(([x, y]) => (
            <ellipse key={`${x}-${y}`} cx={x} cy={y} rx="12" ry="6" fill="#f6d6b0" stroke="#b3661f" strokeWidth="1.5" />
          ))}
        </g>
      )}
      {paso === 1 && (
        <g>
          {[[0, 0], ...Array.from({ length: 6 }, (_, i) => [54 * Math.cos(rad(i * 60)), 54 * Math.sin(rad(i * 60))])].map(([dx, dy]) => (
            <Celula key={`${dx}-${dy}`} x={200 + dx} y={135 + dy} r={27} />
          ))}
        </g>
      )}
      {paso === 2 && (
        <g>
          <circle cx="200" cy="135" r="104" fill="#f1f7ec" stroke="#9cc58c" strokeWidth="2" strokeDasharray="5 4" />
          {Array.from({ length: 26 }, (_, i) => {
            const a = (i * 360) / 26
            const x = 200 + 96 * Math.cos(rad(a))
            const y = 135 + 96 * Math.sin(rad(a))
            return (
              <g key={i}>
                <line x1={200 + 105 * Math.cos(rad(a))} y1={135 + 105 * Math.sin(rad(a))} x2={200 + 118 * Math.cos(rad(a + 4))} y2={135 + 118 * Math.sin(rad(a + 4))} stroke="#4f8a43" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx={x} cy={y} r="8.5" fill={TIPOS.B.relleno} stroke={TIPOS.B.borde} strokeWidth="2" />
              </g>
            )
          })}
          {[[-34, -22], [28, -34], [-20, 30], [38, 22]].map(([dx, dy]) => (
            <Celula key={`${dx}-${dy}`} x={200 + dx} y={135 + dy} r={15} tipo="D" />
          ))}
        </g>
      )}
      {paso === 3 && (
        <g>
          <g transform="translate(45 0)">
          <defs>
            <clipPath id="clip-uni-paso3">
              <path d="M150 238 C132 192 138 122 160 74 L240 74 C262 122 268 192 250 238 Z" />
            </clipPath>
          </defs>
          <path d="M150 238 C132 192 138 122 160 74 L240 74 C262 122 268 192 250 238 Z" fill="#fffdf5" />
          <g clipPath="url(#clip-uni-paso3)">
            {Array.from({ length: 12 }, (_, j) =>
              Array.from({ length: 11 }, (_, i) => {
                const x = 124 + i * 15 + (j % 2 ? 7 : 0)
                const y = 70 + j * 15
                const lado = Math.abs(x - 200) > 38
                const tipo: Tipo = (i + j * 3) % 7 === 0 ? 'D' : lado ? 'C' : 'B'
                return <Celula key={`${i}-${j}`} x={x} y={y} r={6.5} tipo={tipo} nucleo={false} grosor={1.5} />
              }),
            )}
          </g>
          <path d="M150 238 C132 192 138 122 160 74 L240 74 C262 122 268 192 250 238 Z" fill="none" stroke={TINTA} strokeWidth="4" strokeLinejoin="round" />
          <ellipse cx="200" cy="74" rx="40" ry="8" fill="#fffdf5" stroke={TINTA} strokeWidth="3" />
          </g>
          <g fontSize="10.5" fill={TINTA}>
            <circle cx="40" cy="108" r="6" fill={TIPOS.C.relleno} stroke={TIPOS.C.borde} strokeWidth="1.5" />
            <text x="52" y="112">revestimiento</text>
            <circle cx="40" cy="132" r="6" fill={TIPOS.B.relleno} stroke={TIPOS.B.borde} strokeWidth="1.5" />
            <text x="52" y="136">células con flagelo</text>
            <circle cx="40" cy="156" r="6" fill={TIPOS.D.relleno} stroke={TIPOS.D.borde} strokeWidth="1.5" />
            <text x="52" y="160">células móviles</text>
          </g>
        </g>
      )}
      {paso === 4 && (
        <g>
          <ellipse cx="200" cy="135" rx="122" ry="88" fill={TIPOS.C.relleno} stroke={TIPOS.C.borde} strokeWidth="5" />
          <ellipse cx="200" cy="135" rx="98" ry="64" fill={TIPOS.A.relleno} stroke={TIPOS.A.borde} strokeWidth="3" />
          {Array.from({ length: 16 }, (_, i) => {
            const a = (i * 360) / 16
            return <ellipse key={i} cx={200 + 80 * Math.cos(rad(a))} cy={135 + 47 * Math.sin(rad(a))} rx="11" ry="4.5" transform={`rotate(${a + 90} ${200 + 80 * Math.cos(rad(a))} ${135 + 47 * Math.sin(rad(a))})`} fill="#f4b8b0" stroke={TIPOS.A.borde} strokeWidth="1.2" />
          })}
          {Array.from({ length: 28 }, (_, i) => {
            const a = (i * 360) / 28
            return <circle key={i} cx={200 + 111 * Math.cos(rad(a))} cy={135 + 76 * Math.sin(rad(a))} r="4" fill="#b9d3ee" stroke={TIPOS.C.borde} strokeWidth="1.2" />
          })}
          <ellipse cx="200" cy="135" rx="56" ry="34" fill="#e9f0e1" stroke={TIPOS.B.borde} strokeWidth="3" />
          {[[-26, -8], [-8, 10], [12, -10], [28, 8], [0, -14], [-30, 10]].map(([dx, dy]) => (
            <circle key={`${dx}-${dy}`} cx={200 + dx} cy={135 + dy} r="6" fill={TIPOS.B.relleno} stroke={TIPOS.B.borde} strokeWidth="1.5" />
          ))}
          <g stroke={TINTA} strokeWidth="1.5" fill="none">
            <line x1="66" y1="40" x2="106" y2="88" />
            <line x1="334" y1="40" x2="294" y2="88" />
            <line x1="200" y1="262" x2="200" y2="170" />
          </g>
          <g fill={TINTA} fontSize="11.5" fontWeight="600">
            <text x="10" y="36">tejido de revestimiento</text>
            <text x="334" y="36" textAnchor="end">tejido muscular</text>
            <text x="200" y="276" textAnchor="middle">un órgano</text>
          </g>
        </g>
      )}
      <g textAnchor="middle" fill={TINTA}>
        {paso !== 4 && <text x="200" y="272" fontSize="13" fontWeight="700">{titulo}</text>}
        {paso !== 4 && <text x="200" y="289" fontSize="11">{sub}</text>}
        {paso === 4 && <text x="200" y="293" fontSize="11">{titulo}</text>}
      </g>
    </svg>
  )
}

/** Cuatro seres unicelulares. */
export function EjemplosUnicelulares() {
  const cx = [52, 150, 250, 348]
  const cy = 112
  const rayas = Array.from({ length: 14 }, (_, i) => i)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label="Cuatro seres de una sola célula: una bacteria, una levadura, una ameba y un paramecio" className="h-full w-full">
      <Fondo />
      {cx.map((x) => (
        <circle key={x} cx={x} cy={cy} r="45" fill="#fffdf5" stroke={TINTA} strokeWidth="3" />
      ))}

      {/* bacteria */}
      <g transform={`rotate(-20 ${cx[0]} ${cy})`}>
        <rect x={cx[0] - 28} y={cy - 12} width="56" height="24" rx="12" fill={TIPOS.B.relleno} stroke={TIPOS.B.borde} strokeWidth="3" />
        <path d={`M${cx[0] - 14} ${cy} q5 -9 10 0 t10 0 t10 0`} fill="none" stroke="#6b3f8a" strokeWidth="2.5" strokeLinecap="round" />
      </g>

      {/* levadura con una yema */}
      <ellipse cx={cx[1] - 5} cy={cy + 3} rx="22" ry="18" fill={TIPOS.D.relleno} stroke={TIPOS.D.borde} strokeWidth="3" />
      <circle cx={cx[1] - 5} cy={cy + 3} r="7" fill="#c9a0dc" stroke="#7a4a8a" strokeWidth="1.8" />
      <circle cx={cx[1] + 22} cy={cy - 16} r="10" fill={TIPOS.D.relleno} stroke={TIPOS.D.borde} strokeWidth="3" />

      {/* ameba */}
      <path
        d={`M${cx[2] - 28} ${cy - 6} C${cx[2] - 40} ${cy - 22} ${cx[2] - 18} ${cy - 30} ${cx[2] - 4} ${cy - 22} C${cx[2] + 10} ${cy - 36} ${cx[2] + 34} ${cy - 24} ${cx[2] + 26} ${cy - 6} C${cx[2] + 44} ${cy + 4} ${cx[2] + 32} ${cy + 26} ${cx[2] + 14} ${cy + 20} C${cx[2] + 6} ${cy + 36} ${cx[2] - 16} ${cy + 32} ${cx[2] - 14} ${cy + 18} C${cx[2] - 36} ${cy + 22} ${cx[2] - 40} ${cy + 2} ${cx[2] - 28} ${cy - 6} Z`}
        fill={TIPOS.A.relleno}
        stroke={TIPOS.A.borde}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <circle cx={cx[2]} cy={cy} r="9" fill="#c9a0dc" stroke="#7a4a8a" strokeWidth="2" />

      {/* paramecio con cilios */}
      <g transform={`rotate(-25 ${cx[3]} ${cy})`}>
        {rayas.map((i) => {
          const a = (i * 360) / 14
          const x = cx[3] + 32 * Math.cos(rad(a))
          const y = cy + 15 * Math.sin(rad(a))
          return <line key={i} x1={x} y1={y} x2={x + 6 * Math.cos(rad(a))} y2={y + 6 * Math.sin(rad(a))} stroke={TIPOS.C.borde} strokeWidth="1.8" strokeLinecap="round" />
        })}
        <ellipse cx={cx[3]} cy={cy} rx="32" ry="15" fill={TIPOS.C.relleno} stroke={TIPOS.C.borde} strokeWidth="3" />
        <ellipse cx={cx[3] + 4} cy={cy} rx="8" ry="5" fill="#c9a0dc" stroke="#7a4a8a" strokeWidth="1.8" />
        <path d={`M${cx[3] - 22} ${cy - 4} q8 6 16 0`} fill="none" stroke={TIPOS.C.borde} strokeWidth="2" strokeLinecap="round" />
      </g>

      {[
        ['Bacteria', 'procariota'],
        ['Levadura', 'eucariota'],
        ['Ameba', 'eucariota'],
        ['Paramecio', 'eucariota'],
      ].map(([n, t], i) => (
        <g key={n} textAnchor="middle" fill={TINTA}>
          <text x={cx[i]} y="188" fontSize="12" fontWeight="700">{n}</text>
          <text x={cx[i]} y="203" fontSize="10.5">{t}</text>
        </g>
      ))}
      <text x="200" y="256" textAnchor="middle" fontSize="12" fontStyle="italic" fill={TINTA}>Cada una es una sola célula y un organismo completo</text>
      <text x="200" y="274" textAnchor="middle" fontSize="11" fill={TINTA}>(esquemas, tamaños no a escala)</text>
    </svg>
  )
}

/** Cubos de lado 1, 2 y 3: el volumen crece más rápido que la superficie. */
export function SuperficieVolumen() {
  const base = 150
  const cubos = [
    { cx: 70, lado: 1, sup: 6, vol: 1, rel: 6 },
    { cx: 196, lado: 2, sup: 24, vol: 8, rel: 3 },
    { cx: 322, lado: 3, sup: 54, vol: 27, rel: 2 },
  ]
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label="Tres cubos de lado 1, 2 y 3: al crecer, el volumen aumenta más rápido que la superficie" className="h-full w-full">
      <Fondo />
      <text x="200" y="28" textAnchor="middle" fontSize="12.5" fontWeight="700" fill={TINTA}>Al crecer, el volumen aumenta más rápido que la superficie</text>
      {cubos.map(({ cx, lado, sup, vol, rel }) => {
        const w = lado * 28
        const d = w * 0.4
        const x = cx - (w + d) / 2
        const y = base - w
        return (
          <g key={lado}>
            <rect x={x} y={y} width={w} height={w} fill="#f8d9d4" stroke="#b05a5a" strokeWidth="2.5" strokeLinejoin="round" />
            <polygon points={`${x},${y} ${x + d},${y - d * 0.8} ${x + w + d},${y - d * 0.8} ${x + w},${y}`} fill="#fbeae7" stroke="#b05a5a" strokeWidth="2.5" strokeLinejoin="round" />
            <polygon points={`${x + w},${y} ${x + w + d},${y - d * 0.8} ${x + w + d},${y + w - d * 0.8} ${x + w},${y + w}`} fill="#eebfb8" stroke="#b05a5a" strokeWidth="2.5" strokeLinejoin="round" />
            <g textAnchor="middle" fill={TINTA}>
              <text x={cx} y="182" fontSize="12" fontWeight="700">Lado {lado}</text>
              <text x={cx} y="199" fontSize="11">superficie: {sup}</text>
              <text x={cx} y="214" fontSize="11">volumen: {vol}</text>
              <text x={cx} y="234" fontSize="11" fontWeight="700">superficie ÷ volumen</text>
              <text x={cx} y="249" fontSize="13" fontWeight="700">= {rel}</text>
            </g>
          </g>
        )
      })}
      <text x="200" y="282" textAnchor="middle" fontSize="11" fill={TINTA}>Cuanto menor es esa relación, más difícil es que llegue todo al interior</text>
    </svg>
  )
}

/** La pluricelularidad surgió muchas veces, por separado. */
export function OrigenesPluri() {
  const tips = Array.from({ length: 9 }, (_, i) => ({ x: 40 + i * 40, pluri: i % 2 === 0 }))
  const nombres = ['Animales', 'Plantas', 'Hongos', 'Algas pardas', 'Algas rojas']
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label="Esquema de un tronco de ancestros unicelulares con ramas: cinco terminan en grupos pluricelulares y cuatro en unicelulares" className="h-full w-full">
      <Fondo />
      {tips.map((t) => (
        <path key={t.x} d={`M200 240 C200 200 ${t.x} 190 ${t.x} 112`} fill="none" stroke="#7a6a4a" strokeWidth="3" strokeLinecap="round" />
      ))}
      {tips.map((t, i) =>
        t.pluri ? (
          <g key={t.x}>
            {[[-6, -6], [6, -6], [-6, 6], [6, 6]].map(([dx, dy]) => (
              <circle key={`${dx}-${dy}`} cx={t.x + dx} cy={96 + dy} r="7" fill={TIPOS.B.relleno} stroke={TIPOS.B.borde} strokeWidth="2" />
            ))}
            <text x={t.x} y="64" textAnchor="middle" fontSize="11" fontWeight="700" fill={TINTA}>{nombres[i / 2]}</text>
          </g>
        ) : (
          <circle key={t.x} cx={t.x} cy="96" r="9" fill={TIPOS.D.relleno} stroke={TIPOS.D.borde} strokeWidth="2.5" />
        ),
      )}
      <circle cx="200" cy="244" r="12" fill={TIPOS.D.relleno} stroke={TIPOS.D.borde} strokeWidth="3" />
      <text x="200" y="266" textAnchor="middle" fontSize="12" fontWeight="700" fill={TINTA}>Ancestros unicelulares</text>
      <text x="200" y="26" textAnchor="middle" fontSize="12" fontStyle="italic" fill={TINTA}>Cada grupo pluricelular surgió por separado</text>
      <text x="200" y="282" textAnchor="middle" fontSize="10.5" fill={TINTA}>círculo solo: unicelular · grupo de círculos: pluricelular</text>
      <text x="200" y="295" textAnchor="middle" fontSize="10" fill={TINTA}>(esquema, sin parentescos reales)</text>
    </svg>
  )
}
