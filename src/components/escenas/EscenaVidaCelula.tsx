// Escenas vivas: muerte celular (apoptosis y necrosis) y diferenciación (de la célula madre a las especializadas).
const suave = 'transform 1s cubic-bezier(.45,.05,.25,1), opacity 0.7s ease, fill 0.8s'
const NUCLEO = '#7a4a8a'

/* ── muerte celular ─────────────────────────────────────────────────────── */
const MUERTE = ['sana', 'senal', 'encoge', 'fragmentos', 'macrofago', 'necrosis-dano', 'necrosis-revienta']
const TROZOS: [number, number, number][] = [[-38, -30, 20], [30, -36, 17], [44, 18, 19], [-8, 40, 16], [-46, 22, 14]]
const ESQUIRLAS: [number, number][] = [[-110, -70], [-60, -110], [40, -112], [110, -60], [124, 20], [80, 96], [-20, 110], [-100, 80], [-130, 0]]

export function EscenaMuerteCelular({ fase }: { fase: string }) {
  const i = Math.max(0, MUERTE.indexOf(fase))
  const necrosis = i >= 5
  const revienta = fase === 'necrosis-revienta'
  const escala = necrosis ? 1.28 : i === 2 ? 0.74 : 1
  const entera = i <= 2 || fase === 'necrosis-dano'
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Muerte celular: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={revienta ? '#f6d6cf' : '#f3efe6'} style={{ transition: 'fill 0.8s' }} />
      {/* inflamación */}
      <circle cx="200" cy="150" r="140" fill="#e8806f" style={{ transition: suave, opacity: revienta ? 0.25 : 0 }} />

      {/* la célula */}
      <g style={{ transition: suave, transformOrigin: '200px 150px', transform: `scale(${escala})`, opacity: entera ? 1 : 0 }}>
        <circle cx="200" cy="150" r="72" fill={necrosis ? '#fbe9e4' : '#f8d9d4'} stroke="#b05a5a" strokeWidth={necrosis ? 3 : 4} strokeDasharray={i === 2 ? '10 3' : undefined} style={{ transition: suave }} />
        <circle cx="196" cy="146" r="28" fill="#ead3f2" stroke={NUCLEO} strokeWidth="3" style={{ transition: suave, opacity: i === 2 ? 0 : 1 }} />
        {/* núcleo que se rompe en trocitos */}
        {[[-10, -8], [8, -4], [-2, 10], [12, 12]].map(([x, y], k) => (
          <circle key={k} cx={196 + x} cy={146 + y} r="7" fill="#5a3a6a" style={{ transition: suave, opacity: i === 2 ? 1 : 0 }} />
        ))}
      </g>
      {/* señal de apoptosis: se une a la membrana */}
      <g style={{ transition: suave, transform: i === 1 ? 'translate(0, 0)' : 'translate(90px, -60px)', opacity: i === 1 ? 1 : 0 }}>
        <path d="M 262 96 l 10 -10 l 10 10 l -10 10 z" fill="#3b6fb6" />
        <text x="290" y="84" fontSize="12" fontWeight="800" fill="#3b6fb6">señal</text>
      </g>

      {/* cuerpos apoptóticos */}
      {TROZOS.map(([x, y, r], k) => (
        <g key={k} style={{ transition: suave, transform: i === 4 ? `translate(${(-x) * 0.6 - 30}px, ${-y * 0.6}px) scale(0.5)` : i >= 3 && i <= 4 ? 'none' : `translate(${-x}px, ${-y}px) scale(0.4)`, transformOrigin: `${200 + x}px ${150 + y}px`, opacity: i === 3 || i === 4 ? 1 : 0 }}>
          <circle cx={200 + x} cy={150 + y} r={r} fill="#f8d9d4" stroke="#b05a5a" strokeWidth="3" />
          <circle cx={200 + x} cy={150 + y} r={r * 0.35} fill="#5a3a6a" opacity={k % 2 ? 1 : 0} />
        </g>
      ))}
      {/* macrófago que los traga */}
      <g style={{ transition: suave, transform: i === 4 ? 'translate(0, 0)' : 'translate(-200px, 0)', opacity: i === 4 ? 1 : 0 }}>
        <path d="M 110 150 C 110 86 196 80 214 112 C 230 84 262 120 236 150 C 268 176 232 222 196 200 C 168 230 110 214 110 150 Z" fill="#cfe0f5" stroke="#3b6fb6" strokeWidth="3.5" opacity="0.85" />
        <circle cx="150" cy="150" r="20" fill="#a9c6ec" stroke="#3b6fb6" strokeWidth="2" />
        <text x="140" y="236" fontSize="12" fontWeight="800" fill="#3b6fb6">macrófago</text>
      </g>

      {/* necrosis: revienta y el contenido se riega */}
      <path d="M 128 150 a 72 72 0 0 1 60 -71 M 214 80 a 72 72 0 0 1 58 82 M 262 196 a 72 72 0 0 1 -88 22 M 150 204 a 72 72 0 0 1 -20 -38" transform="translate(200 150) scale(1.28) translate(-200 -150)"
        fill="none" stroke="#b05a5a" strokeWidth="3" style={{ transition: 'opacity 0.6s', opacity: revienta ? 1 : 0 }} />
      {ESQUIRLAS.map(([x, y], k) => (
        <circle key={k} cx="200" cy="150" r={k % 3 ? 5 : 8} fill={k % 3 ? '#e8a33a' : '#5a3a6a'}
          style={{ transition: suave, transform: revienta ? `translate(${x}px, ${y}px)` : 'none', opacity: revienta ? 1 : 0 }} />
      ))}
    </svg>
  )
}

/* ── diferenciación ─────────────────────────────────────────────────────── */
const DIF = ['cigoto', 'embrion', 'madre', 'neurona', 'musculo', 'globulo', 'mismo-adn']
const MORULA: [number, number][] = [[0, 0], [-34, -22], [34, -22], [-34, 22], [34, 22], [0, -40], [0, 40], [-58, 0], [58, 0]]
const DESTINO = { neurona: [92, 82], musculo: [312, 84], globulo: [200, 248] } as const

function Neurona() {
  return (
    <g stroke="#7a4a8a" strokeWidth="4" strokeLinecap="round" fill="none">
      {[[-34, -24], [-30, 20], [6, -36], [-40, -2]].map(([x, y], k) => <line key={k} x1="0" y1="0" x2={x} y2={y} />)}
      <path d="M 14 6 C 40 18 60 0 84 14" />
      <circle cx="0" cy="0" r="15" fill="#e7d3f0" />
      <circle cx="0" cy="0" r="6" fill={NUCLEO} stroke="none" />
    </g>
  )
}
function Musculo() {
  return (
    <g>
      <ellipse cx="0" cy="0" rx="62" ry="16" fill="#f2b0a8" stroke="#a33" strokeWidth="3" />
      {[-40, -26, -12, 2, 16, 30, 44].map((x) => <line key={x} x1={x} y1="-12" x2={x} y2="12" stroke="#c4605a" strokeWidth="2" />)}
      {[-30, 10, 38].map((x) => <ellipse key={x} cx={x} cy="0" rx="6" ry="3.5" fill={NUCLEO} />)}
    </g>
  )
}
function Globulo() {
  return (
    <g>
      <circle cx="0" cy="0" r="24" fill="#e04848" stroke="#9a2020" strokeWidth="3" />
      <circle cx="0" cy="0" r="11" fill="#ee7a7a" />
    </g>
  )
}
/** barra de genes: todas tienen los mismos; cada una enciende uno distinto */
function Genes({ x, y, on }: { x: number; y: number; on: number }) {
  return (
    <g transform={`translate(${x - 30} ${y})`}>
      {[0, 1, 2, 3, 4].map((k) => <rect key={k} x={k * 12} y="0" width="10" height="10" rx="2" fill={k === on ? '#ffd34d' : '#d8d2c6'} stroke={k === on ? '#b8860b' : '#b5ad9f'} />)}
    </g>
  )
}

export function EscenaDiferenciacion({ fase }: { fase: string }) {
  const i = Math.max(0, DIF.indexOf(fase))
  const visto = (id: keyof typeof DESTINO) => i >= DIF.indexOf(id)
  const genes = fase === 'mismo-adn'
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Diferenciación celular: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#f3efe6" />
      {/* cigoto */}
      <g style={{ transition: suave, transformOrigin: '200px 150px', transform: i === 0 ? 'none' : 'scale(0.6)', opacity: i === 0 ? 1 : 0 }}>
        <circle cx="200" cy="150" r="56" fill="#fbe6d6" stroke="#b05a5a" strokeWidth="4" />
        <circle cx="200" cy="150" r="18" fill="#ead3f2" stroke={NUCLEO} strokeWidth="3" />
      </g>
      {/* embrión temprano: muchas células iguales; luego queda solo la célula madre */}
      {MORULA.map(([x, y], k) => (
        <g key={k} style={{ transition: suave, transform: i === 0 ? 'translate(0, 0) scale(0.4)' : `translate(${x}px, ${y}px)`, transformOrigin: '200px 150px', opacity: i === 1 || (k === 0 && i >= 2) ? 1 : 0 }}>
          <circle cx="200" cy="150" r={k === 0 && i >= 2 ? 26 : 20} fill="#fbe6d6" stroke={k === 0 && i >= 2 ? '#0f6e56' : '#b05a5a'} strokeWidth={k === 0 && i >= 2 ? 4 : 3} style={{ transition: 'r 0.8s, stroke 0.8s' }} />
          <circle cx="200" cy="150" r="7" fill="#ead3f2" stroke={NUCLEO} strokeWidth="2" />
        </g>
      ))}
      <text x="200" y="196" textAnchor="middle" fontSize="12" fontWeight="800" fill="#0f6e56" style={{ transition: 'opacity 0.6s', opacity: i >= 2 ? 1 : 0 }}>célula madre</text>

      {/* flechas y células especializadas */}
      {(Object.keys(DESTINO) as (keyof typeof DESTINO)[]).map((id, k) => {
        const [x, y] = DESTINO[id]
        const v = visto(id)
        return (
          <g key={id}>
            <line x1={200 + (x - 200) * 0.24} y1={150 + (y - 150) * 0.3} x2={200 + (x - 200) * 0.62} y2={150 + (y - 150) * 0.62} stroke="#0f6e56" strokeWidth="2.5" strokeDasharray="6 4"
              style={{ transition: 'opacity 0.6s', opacity: v ? 0.8 : 0 }} />
            <g style={{ transition: suave, transform: v ? `translate(${x}px, ${y}px)` : 'translate(200px, 150px) scale(0.3)', opacity: v ? 1 : 0 }}>
              {id === 'neurona' ? <Neurona /> : id === 'musculo' ? <Musculo /> : <Globulo />}
            </g>
            <g style={{ transition: 'opacity 0.6s', opacity: genes ? 1 : 0 }}>
              <Genes x={x + (id === 'globulo' ? 62 : 0)} y={y + (id === 'globulo' ? -5 : 30)} on={k} />
            </g>
          </g>
        )
      })}
      <g style={{ transition: 'opacity 0.6s', opacity: genes ? 1 : 0 }}>
        <Genes x={200} y={114} on={-1} />
      </g>
    </svg>
  )
}
