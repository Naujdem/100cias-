// Escenas vivas de energía y origen de orgánulos: endosimbiosis y respiración/fermentación.
import { Mito, Cloroplasto } from '../ilustraciones/CelulaEuc.tsx'

const suave = 'transform 1.1s cubic-bezier(.45,.05,.25,1), opacity 0.7s ease'
const mueve = (si: boolean, a: string, b = 'none') => ({ transition: suave, transform: si ? a : b })

/* ── endosimbiosis ──────────────────────────────────────────────────────── */
const ENDO = ['hospedera', 'atrapa', 'dentro', 'mitocondria', 'cloroplasto']

function Bacteria({ color = '#e8a0b8', borde = '#a04a6a' }: { color?: string; borde?: string }) {
  return (
    <g>
      <rect x="-24" y="-12" width="48" height="24" rx="12" fill={color} stroke={borde} strokeWidth="2.5" />
      <path d="M -10 -2 q 5 -7 10 0 t 10 0" fill="none" stroke={borde} strokeWidth="1.8" />
    </g>
  )
}

export function EscenaEndosimbiosis({ fase }: { fase: string }) {
  const i = Math.max(0, ENDO.indexOf(fase))
  // posición de la bacteria (que será mitocondria)
  const bx = i === 0 ? 345 : i === 1 ? 262 : 196
  const by = i === 0 ? 70 : i === 1 ? 104 : 104
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Endosimbiosis: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#eef3f0" />
      {/* célula hospedera; en la fase de atrapar, la membrana forma un bolsillo */}
      <circle cx="170" cy="155" r="118" fill="#f8d9d4" stroke="#b05a5a" strokeWidth="4" />
      <path d="M 262 72 Q 300 92 282 128 Q 266 140 248 128" fill="none" stroke="#b05a5a" strokeWidth="4" strokeLinecap="round"
        style={{ transition: 'opacity 0.5s', opacity: i === 1 ? 1 : 0 }} />
      <circle cx="140" cy="168" r="40" fill="#ead3f2" stroke="#7a4a8a" strokeWidth="3" />
      <path d="M 124 164 q 10 -14 22 -2 t 14 10" fill="none" stroke="#3b6fb6" strokeWidth="2.4" />

      {/* la bacteria que se vuelve mitocondria */}
      <g style={mueve(true, `translate(${bx}px, ${by}px)`)}>
        <g style={{ transition: suave, opacity: i >= 3 ? 0 : 1 }}><Bacteria /></g>
        {/* membrana extra que la envuelve al entrar */}
        <rect x="-31" y="-19" width="62" height="38" rx="19" fill="none" stroke="#b05a5a" strokeWidth="2" strokeDasharray="4 3" style={{ transition: suave, opacity: i === 2 ? 1 : 0 }} />
        <g style={{ transition: suave, opacity: i >= 3 ? 1 : 0 }}><Mito k={1.05} a={-10} /></g>
      </g>
      {/* intercambio: alimento hacia la bacteria, energía hacia la célula */}
      <g style={{ transition: 'opacity 0.6s', opacity: i === 2 ? 1 : 0 }} fontSize="11" fontWeight="700">
        <text x="196" y="66" textAnchor="middle" fill="#7a5a2a">alimento →</text>
        <text x="196" y="146" textAnchor="middle" fill="#a8641e">← energía</text>
      </g>
      {/* se multiplican dentro */}
      {[[90, 92, 25], [230, 214, -20]].map(([x, y, a], k) => (
        <g key={k} style={{ transition: `opacity 0.6s ease ${0.4 + k * 0.25}s`, opacity: i >= 3 ? 1 : 0 }}>
          <g transform={`translate(${x} ${y})`}><Mito k={0.9} a={a} /></g>
        </g>
      ))}

      {/* cianobacteria → cloroplasto */}
      <g style={mueve(i === 4, 'translate(244px, 168px)', 'translate(352px, 250px)')}>
        <g style={{ transition: suave, opacity: i === 4 ? 0 : i >= 3 ? 1 : 0 }}><Bacteria color="#a8d68f" borde="#4f7f3a" /></g>
        <g style={{ transition: suave, opacity: i === 4 ? 1 : 0 }}><Cloroplasto k={0.8} a={10} /></g>
      </g>
    </svg>
  )
}

/* ── respiración y fermentación ─────────────────────────────────────────── */
const RESP = ['glucosa', 'glucolisis', 'respiracion', 'fermentacion']
const ATP_POS: [number, number][] = [
  [128, 64], [164, 64],
  [262, 52], [300, 46], [338, 54], [366, 82], [372, 120], [372, 196], [362, 234], [330, 256], [292, 262], [254, 254], [226, 236], [372, 158],
]

function Atp() {
  return (
    <g>
      <rect x="-15" y="-9" width="30" height="18" rx="9" fill="#ffd34d" stroke="#b8860b" strokeWidth="2" />
      <text y="4" textAnchor="middle" fontSize="9" fontWeight="800" fill="#6b4a00">ATP</text>
    </g>
  )
}

export function EscenaRespiracion({ fase }: { fase: string }) {
  const i = Math.max(0, RESP.indexOf(fase))
  const resp = fase === 'respiracion'
  const ferm = fase === 'fermentacion'
  const nAtp = i === 0 ? 0 : resp ? ATP_POS.length : 2
  const total = i === 0 ? '0' : resp ? '≈ 32' : '2'
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Respiración celular: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#f8e7e2" />
      <text x="16" y="28" fontSize="13" fontWeight="800" fill="#6b4a00">ATP: <tspan fontSize="20">{total}</tspan></text>
      {/* mitocondria grande; se apaga si no hay oxígeno */}
      <g style={{ transition: 'opacity 0.7s', opacity: ferm ? 0.3 : 1 }}>
        <g transform="translate(300 155)"><Mito k={2.3} /></g>
      </g>
      <text x="300" y="232" textAnchor="middle" fontSize="11" fontWeight="700" fill="#7a3f12" style={{ transition: 'opacity 0.7s', opacity: ferm ? 0.3 : 1 }}>mitocondria</text>
      <text x="90" y="280" textAnchor="middle" fontSize="11" fontWeight="700" fill="#7a5a2a">citoplasma</text>

      {/* glucosa entera (6 carbonos) */}
      <g style={{ transition: suave, opacity: i === 0 ? 1 : 0 }}>
        <polygon points="90,110 120,128 120,166 90,184 60,166 60,128" fill="#fff3d6" stroke="#8a6a2a" strokeWidth="3" />
        <text x="90" y="152" textAnchor="middle" fontSize="12" fontWeight="800" fill="#6b4a00">glucosa</text>
      </g>
      {/* dos mitades (piruvato) */}
      {[-1, 1].map((s) => (
        <g key={s} style={mueve(true, resp ? `translate(${238}px, ${150 + s * 14}px) scale(0.6)` : `translate(${120}px, ${150 + s * 38}px)`)}>
          <g style={{ transition: 'opacity 0.7s', opacity: i === 0 ? 0 : resp ? 0 : 1 }}>
            <polygon points="0,-18 20,10 -20,10" fill={ferm ? '#f4c7c7' : '#fff3d6'} stroke={ferm ? '#a33' : '#8a6a2a'} strokeWidth="2.5" style={{ transition: 'fill 0.7s, stroke 0.7s' }} />
          </g>
        </g>
      ))}
      <text x="120" y="155" textAnchor="middle" fontSize="11" fontWeight="700" fill="#6b4a00" style={{ transition: 'opacity 0.7s', opacity: i === 1 ? 1 : 0 }}>2 piruvatos</text>
      <text x="120" y="155" textAnchor="middle" fontSize="11" fontWeight="700" fill="#a33" style={{ transition: 'opacity 0.7s', opacity: ferm ? 1 : 0 }}>ácido láctico</text>

      {/* oxígeno que entra y CO2 + agua que salen */}
      <g style={{ transition: suave, opacity: resp ? 1 : 0, transform: resp ? 'none' : 'translate(0, -30px)' }} fontSize="11" fontWeight="800">
        <circle cx="236" cy="90" r="8" fill="#e8806f" /><circle cx="249" cy="90" r="8" fill="#e8806f" />
        <text x="242" y="76" textAnchor="middle" fill="#a33">O₂</text>
        <text x="300" y="286" textAnchor="middle" fill="#555">→ CO₂ + agua</text>
      </g>
      {/* sin oxígeno: tachado */}
      <g style={{ transition: 'opacity 0.7s', opacity: ferm ? 1 : 0 }}>
        <text x="300" y="98" textAnchor="middle" fontSize="13" fontWeight="800" fill="#a33">sin O₂</text>
      </g>

      {/* fichas de ATP */}
      {ATP_POS.map(([x, y], k) => (
        <g key={k} style={{ transition: `opacity 0.4s ease ${k < 2 ? 0 : 0.5 + (k - 2) * 0.06}s, transform 0.6s ease`, opacity: k < nAtp ? 1 : 0, transform: `translate(${x}px, ${y}px) scale(${k < nAtp ? 1 : 0.4})` }}>
          <Atp />
        </g>
      ))}
    </svg>
  )
}
