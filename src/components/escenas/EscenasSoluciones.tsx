// Escenas vivas de Química, área 4, tema 4: soluciones.

const suave = 'all 1.1s cubic-bezier(.45,.05,.25,1)'
const ver = (si: boolean) => ({ transition: 'opacity 0.7s ease', opacity: si ? 1 : 0 })
const idx = (orden: string[], fase: string) => Math.max(0, orden.indexOf(fase))

const TINTA = '#3a3a3a'
const AZUL = '#3f6fb8'
const ROJO = '#c43c3c'
const VERDE = '#4f8a3c'
const AGUA = '#cfe4f4'
const NA = '#a17fd1', CL = '#7dc47d', O = '#e2685c'

function T({ x, y, t, c = TINTA, s = 12, peso = 800 }: { x: number; y: number; t: string; c?: string; s?: number; peso?: number }) {
  return <text x={x} y={y} textAnchor="middle" fontSize={s} fontWeight={peso} fill={c}>{t}</text>
}
// Vaso visto de frente: devuelve el contorno y el agua.
function Vaso({ x, y = 70, w = 100, h = 140, liquido = AGUA, fondo = 0, color = '#fff' }: { x: number; y?: number; w?: number; h?: number; liquido?: string; fondo?: number; color?: string }) {
  return (
    <g>
      <rect x={x} y={y + 20} width={w} height={h - 20} fill={liquido} />
      {fondo > 0 && <path d={`M${x + 4} ${y + h} q${w / 2 - 4} ${-fondo * 2} ${w - 8} 0 Z`} fill={color} stroke="#bbb" />}
      <path d={`M${x} ${y} V${y + h} H${x + w} V${y}`} fill="none" stroke={TINTA} strokeWidth="3" />
    </g>
  )
}

/* ── Disolver sal en agua ─────────────────────────────────────────────── */

const DIS = ['cristal', 'rodean', 'solucion']

export function EscenaDisolver({ fase }: { fase: string }) {
  const i = idx(DIS, fase)
  const red = Array.from({ length: 16 }, (_, k) => ({ x: (k % 4) * 22, y: Math.floor(k / 4) * 22, na: (k + Math.floor(k / 4)) % 2 === 0 }))
  const sueltos = red.map((_, k) => ({ x: 70 + ((k * 53) % 260), y: 70 + ((k * 37) % 150) }))
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Disolución de la sal: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={AGUA} />
      {red.map((p, k) => {
        const x = i === 0 ? 160 + p.x : i === 1 ? 130 + p.x * 1.8 : sueltos[k].x
        const y = i === 0 ? 100 + p.y : i === 1 ? 70 + p.y * 1.8 : sueltos[k].y
        return (
          <g key={k} style={{ transition: suave, transform: `translate(${x}px, ${y}px)` }}>
            {i >= 1 && [0, 1, 2, 3].map((j) => {
              const a = (j * Math.PI) / 2 + 0.6
              return <circle key={j} cx={Math.cos(a) * 15} cy={Math.sin(a) * 15} r="4.5" fill={O} opacity="0.85" />
            })}
            <circle r={p.na ? 7 : 10} fill={p.na ? NA : CL} />
            <text y="4" textAnchor="middle" fontSize="8" fontWeight="800" fill="#fff">{p.na ? '+' : '−'}</text>
          </g>
        )
      })}
      <T x={200} y={260} t={['Un grano de sal: Na⁺ y Cl⁻ ordenados', 'El agua (solvente) rodea y separa los iones', 'Solución: iones repartidos, no se ven'][i]} s={14} />
      <T x={200} y={282} t={['soluto: la sal', 'los extremos del agua jalan cada ion', 'transparente y igual en todas partes'][i]} s={11} peso={600} />
    </svg>
  )
}

/* ── Insaturada, saturada, sobresaturada ──────────────────────────────── */

const SAT = ['insaturada', 'saturada', 'sobresaturada']

export function EscenaSaturacion({ fase }: { fase: string }) {
  const i = idx(SAT, fase)
  const puntos = (x: number, n: number) => Array.from({ length: n }, (_, k) => <circle key={k} cx={x + 10 + ((k * 29) % 80)} cy={100 + ((k * 17) % 100)} r="2.5" fill={NA} />)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Saturación: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#f4f1ea" />
      <g style={{ opacity: i === 0 ? 1 : 0.3, transition: suave }}>
        <Vaso x={20} />{puntos(20, 10)}
        <T x={70} y={240} t="insaturada" s={12} c={AZUL} /><T x={70} y={256} t="cabe más soluto" s={10} peso={600} />
      </g>
      <g style={{ opacity: i === 1 ? 1 : 0.3, transition: suave }}>
        <Vaso x={150} fondo={8} color="#eee" />{puntos(150, 26)}
        <T x={200} y={240} t="saturada" s={12} c={VERDE} /><T x={200} y={256} t="no cabe más: queda en el fondo" s={10} peso={600} />
      </g>
      <g style={{ opacity: i === 2 ? 1 : 0.3, transition: suave }}>
        <Vaso x={280} />{puntos(280, 34)}
        <T x={330} y={240} t="sobresaturada" s={12} c={ROJO} /><T x={330} y={256} t="más de lo que cabe: inestable" s={10} peso={600} />
        <g style={ver(i === 2)}>
          <path d="M330 50 l0 40" stroke={TINTA} strokeWidth="2" />
          <rect x="325" y="88" width="10" height="10" fill="#fff" stroke={TINTA} />
          <T x={330} y={40} t="un cristalito y…" s={11} />
        </g>
      </g>
      <T x={200} y={285} t={['Se disuelve todo lo que echo', 'Llegó al límite de solubilidad', 'Al tocarla con un cristal, el exceso cristaliza de golpe'][i]} s={12} />
    </svg>
  )
}

/* ── Factores de la solubilidad ───────────────────────────────────────── */

const FS = ['tamano', 'agitar', 'temperatura', 'presion']

export function EscenaFactoresSolubilidad({ fase }: { fase: string }) {
  const i = idx(FS, fase)
  const titulos = ['Tamaño: rallada se disuelve más rápido', 'Agitar acelera la disolución', 'Calor: casi todos los sólidos se disuelven más', 'Gases: más presión, más gas disuelto']
  const nota = ['más superficie en contacto con el agua', 'lleva agua «fresca» a los granos', 'el agua de panela caliente admite más panela', 'al destapar la gaseosa, el gas se escapa']
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Factores de la solubilidad: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#f4f1ea" />
      <g style={ver(i === 0)}>
        <Vaso x={60} liquido="#f0e1c4" /><rect x="90" y="180" width="40" height="26" rx="4" fill="#a8743c" />
        <Vaso x={240} liquido="#e3c48f" />
        {Array.from({ length: 14 }, (_, k) => <rect key={k} x={250 + ((k * 23) % 80)} y={196 + (k % 3) * 4} width="5" height="4" fill="#a8743c" />)}
        <T x={110} y={60} t="bloque" s={12} /><T x={290} y={60} t="rallada" s={12} />
      </g>
      <g style={ver(i === 1)}>
        <Vaso x={150} liquido="#e3c48f" />
        <g><line x1="200" y1="40" x2="200" y2="190" stroke="#8e5b2e" strokeWidth="6" strokeLinecap="round" />
          <animateTransform attributeName="transform" type="rotate" values="-12 200 40;12 200 40;-12 200 40" dur="0.8s" repeatCount="indefinite" /></g>
        <path d="M165 170 q35 20 70 0" fill="none" stroke={AZUL} strokeWidth="2" strokeDasharray="4 3" />
      </g>
      <g style={ver(i === 2)}>
        <Vaso x={60} liquido="#f0e1c4" fondo={10} color="#c99a5b" />
        <Vaso x={240} liquido="#d9a75e" />
        {[-14, 0, 14].map((d) => <path key={d} d={`M${290 + d} 250 q-5 -8 0 -15 q5 -7 0 -13`} fill="#f6a33c" />)}
        <T x={110} y={60} t="fría: queda en el fondo" s={11} c={AZUL} /><T x={290} y={60} t="caliente: se disolvió" s={11} c={ROJO} />
      </g>
      <g style={ver(i === 3)}>
        <rect x="95" y="60" width="50" height="150" rx="14" fill="#7b4a2a" opacity="0.85" />
        <rect x="108" y="40" width="24" height="22" fill={ROJO} />
        <rect x="255" y="60" width="50" height="150" rx="14" fill="#7b4a2a" opacity="0.85" />
        {Array.from({ length: 10 }, (_, k) => (
          <circle key={k} cx={265 + (k % 4) * 10} cy="200" r="3" fill="#fff">
            <animate attributeName="cy" values="205;30" dur={`${0.9 + (k % 3) * 0.3}s`} begin={`${k * 0.15}s`} repeatCount="indefinite" />
          </circle>
        ))}
        <T x={120} y={232} t="tapada" s={12} /><T x={280} y={232} t="destapada" s={12} />
      </g>
      <T x={200} y={262} t={titulos[i]} s={14} />
      <T x={200} y={284} t={nota[i]} s={11} peso={600} />
    </svg>
  )
}

/* ── Curvas de solubilidad ────────────────────────────────────────────── */

const CU = ['leer', 'nitrato', 'gases']
const W = 260, H = 170, X0 = 70, Y0 = 40
const px = (t: number) => X0 + (t / 100) * W
const py = (g: number) => Y0 + H - (g / 250) * H
const KNO3 = [[0, 13], [20, 32], [40, 64], [60, 110], [80, 169], [100, 246]]
const NACL = [[0, 36], [20, 36], [40, 37], [60, 37], [80, 38], [100, 39]]

export function EscenaCurvasSolubilidad({ fase }: { fase: string }) {
  const i = idx(CU, fase)
  const linea = (d: number[][]) => d.map(([t, g]) => `${px(t)},${py(g)}`).join(' ')
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Curvas de solubilidad: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#fff" />
      <g style={ver(i <= 1)}>
        <line x1={X0} y1={Y0 + H} x2={X0 + W} y2={Y0 + H} stroke={TINTA} /><line x1={X0} y1={Y0} x2={X0} y2={Y0 + H} stroke={TINTA} />
        {[0, 50, 100].map((t) => <text key={t} x={px(t)} y={Y0 + H + 14} textAnchor="middle" fontSize="10">{t} °C</text>)}
        {[0, 100, 200].map((g) => <text key={g} x={X0 - 6} y={py(g) + 4} textAnchor="end" fontSize="10">{g}</text>)}
        <text x="20" y={Y0 + H / 2} fontSize="10" fontWeight="700" transform={`rotate(-90 20 ${Y0 + H / 2})`} textAnchor="middle">g por 100 g de agua</text>
        <polyline points={linea(NACL)} fill="none" stroke={NA} strokeWidth="3" />
        <text x={px(100) + 4} y={py(39) + 4} fontSize="11" fontWeight="800" fill={NA}>NaCl</text>
        <polyline points={linea(KNO3)} fill="none" stroke={ROJO} strokeWidth="3" style={{ opacity: i === 1 ? 1 : 0.25, transition: suave }} />
        <text x={px(80)} y={py(200)} fontSize="11" fontWeight="800" fill={ROJO} style={ver(i === 1)}>KNO₃</text>
        <g style={ver(i === 0)}>
          <line x1={px(20)} y1={Y0 + H} x2={px(20)} y2={py(36)} stroke={AZUL} strokeDasharray="4 3" />
          <line x1={X0} y1={py(36)} x2={px(20)} y2={py(36)} stroke={AZUL} strokeDasharray="4 3" />
          <circle cx={px(20)} cy={py(36)} r="5" fill={AZUL} />
          <T x={200} y={262} t="A 20 °C caben unos 36 g de sal en 100 g de agua" s={13} c={AZUL} />
          <T x={200} y={282} t="sobre la curva: saturada · debajo: insaturada" s={11} peso={600} />
        </g>
        <g style={ver(i === 1)}>
          <T x={200} y={262} t="El nitrato de potasio cambia muchísimo con la temperatura" s={13} c={ROJO} />
          <T x={200} y={282} t="la sal casi nada" s={11} peso={600} />
        </g>
      </g>
      <g style={ver(i === 2)}>
        <rect x="40" y="90" width="140" height="110" fill={AGUA} stroke={TINTA} strokeWidth="2" />
        <rect x="220" y="90" width="140" height="110" fill="#f6d1a8" stroke={TINTA} strokeWidth="2" />
        {Array.from({ length: 10 }, (_, k) => <circle key={k} cx={55 + (k % 5) * 25} cy={115 + Math.floor(k / 5) * 45} r="5" fill={O} />)}
        {Array.from({ length: 3 }, (_, k) => <circle key={k} cx={250 + k * 40} cy="150" r="5" fill={O} />)}
        <T x={110} y={80} t="río frío" s={12} c={AZUL} /><T x={290} y={80} t="agua caliente" s={12} c={ROJO} />
        <T x={200} y={240} t="Los gases se disuelven MENOS en agua caliente" s={14} />
        <T x={200} y={262} t="por eso los peces sufren cuando el agua se calienta" s={11} peso={600} />
      </g>
    </svg>
  )
}

/* ── Solución, coloide y suspensión ───────────────────────────────────── */

const TM = ['tres', 'luz', 'reposo']

export function EscenaTiposMezcla({ fase }: { fase: string }) {
  const i = idx(TM, fase)
  const v = [
    { x: 30, n: 'solución', e: 'agua con sal', liq: AGUA, r: 1.5 },
    { x: 150, n: 'coloide', e: 'leche, gelatina', liq: '#f3efe6', r: 4 },
    { x: 270, n: 'suspensión', e: 'agua con tierra', liq: '#c8a87e', r: 7 },
  ]
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Solución, coloide y suspensión: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={i === 1 ? '#2f3540' : '#f4f1ea'} style={{ transition: suave }} />
      {i === 1 && <line x1="0" y1="140" x2="400" y2="140" stroke="#fff6a8" strokeWidth="2" opacity="0.4" />}
      {v.map((m, k) => (
        <g key={m.n}>
          <Vaso x={m.x} liquido={i === 2 && k === 2 ? '#e7dccb' : m.liq} fondo={i === 2 && k === 2 ? 14 : 0} color="#8a6a44" />
          {k === 1 && i === 1 && <line x1={m.x} y1="140" x2={m.x + 100} y2="140" stroke="#fff6a8" strokeWidth="8" />}
          {!(i === 2 && k === 2) && Array.from({ length: 8 }, (_, j) => <circle key={j} cx={m.x + 12 + ((j * 31) % 76)} cy={100 + ((j * 23) % 100)} r={m.r} fill={k === 2 ? '#6b4f2a' : '#999'} opacity="0.7" />)}
          <T x={m.x + 50} y={232} t={m.n} s={13} c={i === 1 ? '#fff' : TINTA} />
          <T x={m.x + 50} y={248} t={m.e} s={10} peso={600} c={i === 1 ? '#fff' : TINTA} />
        </g>
      ))}
      <T x={200} y={280} t={['Partículas pequeñas → medianas → grandes', 'Efecto Tyndall: la luz se ve en el coloide', 'En reposo, solo la suspensión se asienta'][i]} s={13} c={i === 1 ? '#fff' : TINTA} />
    </svg>
  )
}
