// Escenas vivas del área 3, tema 4 (Relaciones entre seres vivos).

const suave = 'transform 1.1s cubic-bezier(.45,.05,.25,1), opacity 0.7s ease'
const ver = (si: boolean, mover = 'none', quieto = 'none') => ({ transition: suave, opacity: si ? 1 : 0, transform: si ? mover : quieto })
const fondo = (color: string) => <rect x="-1500" y="-1500" width="3400" height="3300" fill={color} style={{ transition: 'fill 0.8s' }} />

const VERDE = '#3f9a5a'
const ROJO = '#c43c3c'
const GRIS = '#8a8a8a'
const MOR = '#8a5aa8'
const TINTA = '#3a3a3a'

function Texto({ x, y, t, c = TINTA, s = 12, peso = 800 }: { x: number; y: number; t: string; c?: string; s?: number; peso?: number }) {
  return <text x={x} y={y} textAnchor="middle" fontSize={s} fontWeight={peso} fill={c}>{t}</text>
}
function Ic({ x, y, ic, s = 30 }: { x: number; y: number; ic: string; s?: number }) {
  return <text x={x} y={y + s * 0.35} textAnchor="middle" fontSize={s}>{ic}</text>
}
function Signo({ x, y, s }: { x: number; y: number; s: '+' | '−' | '0' }) {
  const c = s === '+' ? VERDE : s === '−' ? ROJO : GRIS
  return <g><circle cx={x} cy={y} r="15" fill={c} /><Texto x={x} y={y + 6} t={s} c="#fff" s={18} /></g>
}
function Pareja({ a, b, sa, sb, t, sub }: { a: string; b: string; sa: '+' | '−' | '0'; sb: '+' | '−' | '0'; t: string; sub: string }) {
  return (
    <g>
      <circle cx="130" cy="140" r="48" fill="#fff" stroke="#ccc" strokeWidth="2" /><Ic x={130} y={140} ic={a} s={44} />
      <circle cx="270" cy="140" r="48" fill="#fff" stroke="#ccc" strokeWidth="2" /><Ic x={270} y={140} ic={b} s={44} />
      <path d="M 182 140 H 218" stroke="#999" strokeWidth="3" strokeDasharray="5 4" />
      <Signo x={130} y={204} s={sa} /><Signo x={270} y={204} s={sb} />
      <Texto x={200} y={250} t={t} c={MOR} s={14} />
      <Texto x={200} y={270} t={sub} s={11} peso={600} />
    </g>
  )
}

/* ── Relaciones intraespecíficas ──────────────────────────────────────── */

const INTRA = ['manada', 'colonia', 'sociedad', 'competencia']

export function EscenaIntraespecificas({ fase }: { fase: string }) {
  const i = Math.max(0, INTRA.indexOf(fase))
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Relaciones intraespecíficas: ${fase}`} className="h-full w-full">
      {fondo('#f2f5ee')}
      <Texto x={200} y={30} t="Entre individuos de la misma especie" s={13} />
      <g style={ver(i === 0)}>
        {[[90, 140], [150, 120], [210, 150], [270, 125], [320, 155], [180, 190], [250, 195]].map(([x, y], k) => <Ic key={k} x={x} y={y} ic="🦫" s={34} />)}
        <Texto x={200} y={250} t="Manada: los chigüiros se protegen en grupo" c={MOR} s={12} />
      </g>
      <g style={ver(i === 1)}>
        {Array.from({ length: 18 }, (_, k) => <circle key={k} cx={110 + (k % 6) * 36} cy={110 + Math.floor(k / 6) * 34} r="15" fill="#e88a6a" stroke="#c46a4a" strokeWidth="2" />)}
        <Texto x={200} y={250} t="Colonia: los pólipos de coral viven unidos" c={MOR} s={12} />
      </g>
      <g style={ver(i === 2)}>
        <Ic x={200} y={110} ic="👑" s={22} /><Ic x={200} y={140} ic="🐝" s={34} />
        {[[120, 160], [280, 160], [150, 200], [250, 200], [200, 210]].map(([x, y], k) => <Ic key={k} x={x} y={y} ic="🐝" s={26} />)}
        <Texto x={200} y={250} t="Sociedad: las abejas se reparten el trabajo" c={MOR} s={12} />
        <Texto x={200} y={268} t="reina, obreras y zánganos" s={11} peso={600} />
      </g>
      <g style={ver(i === 3)}>
        <Ic x={130} y={140} ic="🦌" s={44} /><Ic x={270} y={140} ic="🦌" s={44} /><Ic x={200} y={120} ic="⚡" s={30} />
        <Texto x={200} y={230} t="Competencia: también compiten entre ellos" c={ROJO} s={12} />
        <Texto x={200} y={248} t="por comida, territorio o pareja" s={11} peso={600} />
      </g>
    </svg>
  )
}

/* ── Depredación y competencia ────────────────────────────────────────── */

const DEP = ['depredacion', 'competencia']

export function EscenaDepredacion({ fase }: { fase: string }) {
  const i = Math.max(0, DEP.indexOf(fase))
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Depredación y competencia: ${fase}`} className="h-full w-full">
      {fondo('#f6f3ec')}
      <Texto x={200} y={30} t="Entre especies distintas" s={13} />
      <g style={ver(i === 0)}><Pareja a="🐆" b="🦫" sa="+" sb="−" t="Depredación (+ / −)" sub="el jaguar gana alimento; el chigüiro muere" /></g>
      <g style={ver(i === 1)}><Pareja a="🦅" b="🦉" sa="−" sb="−" t="Competencia (− / −)" sub="el gavilán y la lechuza cazan los mismos ratones" /></g>
    </svg>
  )
}

/* ── Simbiosis: mutualismo, comensalismo y parasitismo ────────────────── */

const SIM = ['mutualismo', 'comensalismo', 'parasitismo', 'resumen']

export function EscenaSimbiosis({ fase }: { fase: string }) {
  const i = Math.max(0, SIM.indexOf(fase))
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Simbiosis: ${fase}`} className="h-full w-full">
      {fondo('#f2f5ee')}
      <Texto x={200} y={30} t={i < 3 ? 'Vivir muy cerca de otra especie' : 'Resumen de las relaciones'} s={13} />
      <g style={ver(i === 0)}><Pareja a="🐦" b="🌺" sa="+" sb="+" t="Mutualismo (+ / +)" sub="el colibrí toma néctar y poliniza la flor" /></g>
      <g style={ver(i === 1)}><Pareja a="🌸" b="🌳" sa="+" sb="0" t="Comensalismo (+ / 0)" sub="la orquídea vive sobre el árbol sin dañarlo" /></g>
      <g style={ver(i === 2)}><Pareja a="🪲" b="🐄" sa="+" sb="−" t="Parasitismo (+ / −)" sub="la garrapata chupa sangre a la vaca" /></g>
      <g style={ver(i === 3)}>
        {[['Mutualismo', '+', '+'], ['Comensalismo', '+', '0'], ['Parasitismo', '+', '−'], ['Depredación', '+', '−'], ['Competencia', '−', '−']].map(([t, a, b], k) => (
          <g key={t}>
            <rect x="70" y={56 + k * 44} width="260" height="36" rx="8" fill="#fff" stroke="#ddd" />
            <text x="86" y={79 + k * 44} fontSize="13" fontWeight="800" fill={TINTA}>{t}</text>
            <Signo x={262} y={74 + k * 44} s={a as '+'} /><Signo x={302} y={74 + k * 44} s={b as '+'} />
          </g>
        ))}
      </g>
    </svg>
  )
}
