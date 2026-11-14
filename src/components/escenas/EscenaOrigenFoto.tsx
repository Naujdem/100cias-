// Escenas vivas: fotosíntesis (y su pareja, la respiración) y el origen de las primeras células.
import { Cloroplasto, Mito } from '../ilustraciones/CelulaEuc.tsx'

const suave = 'transform 1.1s cubic-bezier(.45,.05,.25,1), opacity 0.7s ease'
const ver = (si: boolean, mover = 'none', quieto = 'none') => ({ transition: suave, opacity: si ? 1 : 0, transform: si ? mover : quieto })

function Molecula({ x, y, texto, color }: { x: number; y: number; texto: string; color: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-20" y="-11" width="40" height="22" rx="11" fill="#fff" stroke={color} strokeWidth="2.5" />
      <text y="5" textAnchor="middle" fontSize="12" fontWeight="800" fill={color}>{texto}</text>
    </g>
  )
}

/* ── fotosíntesis ───────────────────────────────────────────────────────── */
const FOTO = ['ingredientes', 'luz', 'glucosa', 'pareja']

export function EscenaFotosintesis({ fase }: { fase: string }) {
  const i = Math.max(0, FOTO.indexOf(fase))
  const luz = i >= 1
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Fotosíntesis: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={luz ? '#eef6e4' : '#e4eadd'} style={{ transition: 'fill 0.8s' }} />
      {/* sol y rayos */}
      <circle cx="44" cy="40" r="24" fill="#ffd34d" stroke="#e0a020" strokeWidth="3" />
      <g stroke="#f0b020" strokeWidth="4" strokeLinecap="round" strokeDasharray="8 7" style={{ transition: 'opacity 0.7s', opacity: luz && i < 3 ? 1 : 0 }}>
        <line x1="70" y1="58" x2="160" y2="120" /><line x1="62" y1="72" x2="150" y2="150" /><line x1="78" y1="46" x2="190" y2="104" />
      </g>
      {/* cloroplasto grande */}
      <g style={{ transition: suave, transformOrigin: '210px 160px', transform: i === 3 ? 'translate(-70px, 0) scale(0.6)' : 'none' }}>
        <g transform="translate(210 160)"><Cloroplasto k={2.6} /></g>
      </g>
      <text x="210" y="238" textAnchor="middle" fontSize="12" fontWeight="800" fill="#3f7a35" style={{ transition: 'opacity 0.6s', opacity: i < 3 ? 1 : 0 }}>cloroplasto</text>

      {/* agua desde la raíz y CO₂ desde el aire */}
      <g style={{ transition: suave, opacity: i === 0 ? 1 : 0, transform: i >= 1 ? 'translate(40px, -110px)' : 'none' }}><Molecula x={170} y={282} texto="H₂O" color="#3b6fb6" /></g>
      <g style={{ transition: suave, opacity: i <= 1 ? 1 : 0, transform: i >= 2 ? 'translate(150px, -10px)' : 'none' }}><Molecula x={40} y={170} texto="CO₂" color="#555" /></g>
      {/* oxígeno que sale */}
      <g style={ver(luz && i < 3, 'translate(0, 0)', 'translate(-60px, 60px)')}><Molecula x={330} y={60} texto="O₂" color="#c43c3c" /></g>
      {/* glucosa que se forma */}
      <g style={ver(i === 2, 'none', 'translate(-60px, 0) scale(0.4)')}>
        <polygon points="340,140 366,155 366,185 340,200 314,185 314,155" fill="#fff3d6" stroke="#8a6a2a" strokeWidth="3" />
        <text x="340" y="174" textAnchor="middle" fontSize="11" fontWeight="800" fill="#6b4a00">glucosa</text>
      </g>

      {/* la pareja: lo que una fabrica, la otra lo usa */}
      <g style={ver(i === 3)}>
        <g transform="translate(300 160)"><Mito k={1.6} /></g>
        <text x="140" y="214" textAnchor="middle" fontSize="12" fontWeight="800" fill="#3f7a35">fotosíntesis</text>
        <text x="300" y="214" textAnchor="middle" fontSize="12" fontWeight="800" fill="#a8641e">respiración</text>
        <path d="M 170 110 Q 220 70 266 118" fill="none" stroke="#6b4a00" strokeWidth="3" markerEnd="url(#fl)" />
        <path d="M 266 205 Q 220 245 172 208" fill="none" stroke="#3b6fb6" strokeWidth="3" markerEnd="url(#fl)" />
        <text x="220" y="76" textAnchor="middle" fontSize="12" fontWeight="800" fill="#6b4a00">glucosa + O₂</text>
        <text x="220" y="262" textAnchor="middle" fontSize="12" fontWeight="800" fill="#3b6fb6">CO₂ + H₂O</text>
      </g>
      <defs>
        <marker id="fl" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#555" /></marker>
      </defs>
    </svg>
  )
}

/* ── origen de las primeras células ─────────────────────────────────────── */
const ORIGEN = ['tierra', 'sopa', 'miller', 'aminoacidos', 'protocelula', 'luca']

export function EscenaOrigen({ fase }: { fase: string }) {
  const i = Math.max(0, ORIGEN.indexOf(fase))
  const en = (...k: number[]) => k.includes(i)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Origen de las primeras células: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={i <= 1 ? '#3a2f3f' : i >= 4 ? '#e6f0f4' : '#f3efe6'} style={{ transition: 'fill 0.9s' }} />

      {/* Tierra primitiva: volcán, rayos y océano */}
      <g style={ver(en(0, 1))}>
        <polygon points="40,200 110,90 180,200" fill="#6b4a3a" />
        <path d="M 96 92 q 14 -30 6 -50 M 120 92 q 10 -26 24 -40" fill="none" stroke="#9a8a8a" strokeWidth="8" strokeLinecap="round" opacity="0.7" />
        <path d="M 270 30 l -16 40 h 14 l -14 40" fill="none" stroke="#ffd34d" strokeWidth="5" strokeLinejoin="round" />
        <rect x="0" y="200" width="400" height="100" fill="#2f5f8a" />
        {/* moléculas que se forman en la «sopa» */}
        {[[60, 240], [120, 260], [190, 236], [250, 270], [310, 246], [360, 262], [90, 278], [230, 250]].map(([x, y], k) => (
          <circle key={k} cx={x} cy={y} r={k % 2 ? 5 : 7} fill={['#ffd34d', '#e8806f', '#9fd3b5', '#c9a8e8'][k % 4]} style={{ transition: `opacity 0.6s ease ${k * 0.08}s`, opacity: i === 1 ? 1 : 0 }} />
        ))}
      </g>

      {/* aparato de Miller y Urey */}
      <g style={ver(en(2, 3))}>
        {/* matraz con agua que hierve (el océano) */}
        <circle cx="90" cy="220" r="40" fill="#cfe6f6" stroke="#3b6fb6" strokeWidth="3" />
        <path d="M 74 270 q 8 -12 16 0 q 8 -12 16 0" fill="none" stroke="#e8806f" strokeWidth="4" />
        <text x="90" y="290" textAnchor="middle" fontSize="11" fontWeight="700" fill="#555">calor</text>
        {/* tubo hacia arriba */}
        <path d="M 90 180 V 70 H 260" fill="none" stroke="#8a8a8a" strokeWidth="6" />
        {/* matraz de gases con chispas (los rayos) */}
        <circle cx="290" cy="90" r="42" fill="#f5f0fa" stroke="#7a4a8a" strokeWidth="3" />
        <text x="290" y="84" textAnchor="middle" fontSize="10" fontWeight="700" fill="#7a4a8a">CH₄ · NH₃</text>
        <text x="290" y="98" textAnchor="middle" fontSize="10" fontWeight="700" fill="#7a4a8a">H₂ · H₂O</text>
        <path d="M 270 112 l 8 -10 l 6 8 l 8 -10" fill="none" stroke="#e0a020" strokeWidth="3" />
        {/* condensador y trampa donde se juntan los productos */}
        <path d="M 290 132 V 200 Q 290 240 250 240 H 130" fill="none" stroke="#8a8a8a" strokeWidth="6" />
        <rect x="300" y="150" width="22" height="50" rx="6" fill="#bfe0f5" stroke="#3b6fb6" strokeWidth="2" />
        <text x="350" y="180" fontSize="10" fontWeight="700" fill="#3b6fb6">frío</text>
        <ellipse cx="200" cy="246" rx="22" ry="14" fill="#fff" stroke="#8a8a8a" strokeWidth="3" />
        {[[192, 246], [200, 250], [208, 244], [198, 240]].map(([x, y], k) => (
          <circle key={k} cx={x} cy={y} r="4" fill={['#e8806f', '#9fd3b5', '#ffd34d', '#c9a8e8'][k]} style={{ transition: `opacity 0.6s ease ${0.3 + k * 0.15}s`, opacity: i === 3 ? 1 : 0 }} />
        ))}
        <text x="200" y="278" textAnchor="middle" fontSize="12" fontWeight="800" fill="#a33" style={{ transition: 'opacity 0.6s', opacity: i === 3 ? 1 : 0 }}>¡aminoácidos!</text>
      </g>

      {/* protocélulas: burbujas de lípidos con moléculas dentro */}
      <g style={ver(i === 4, 'none', 'scale(0.6)')}>
        {[[110, 140, 46], [240, 120, 36], [300, 210, 30], [170, 230, 26]].map(([x, y, r], k) => (
          <g key={k}>
            <circle cx={x} cy={y} r={r} fill="#fff6e0" stroke="#d9a23a" strokeWidth="5" strokeDasharray="2 3" />
            <circle cx={x - r / 3} cy={y} r="5" fill="#e8806f" />
            <circle cx={x + r / 4} cy={y - r / 4} r="4" fill="#9fd3b5" />
          </g>
        ))}
      </g>

      {/* el ancestro común y las tres ramas */}
      <g style={ver(i === 5)}>
        <path d="M 200 250 V 180 M 200 180 L 90 80 M 200 180 L 200 70 M 200 180 L 310 80" fill="none" stroke="#6b4a2a" strokeWidth="7" strokeLinecap="round" />
        <circle cx="200" cy="254" r="16" fill="#fff6e0" stroke="#d9a23a" strokeWidth="4" />
        <text x="200" y="290" textAnchor="middle" fontSize="12" fontWeight="800" fill="#6b4a2a">ancestro común</text>
        <text x="90" y="66" textAnchor="middle" fontSize="13" fontWeight="800" fill="#2f6b2a">Bacterias</text>
        <text x="200" y="56" textAnchor="middle" fontSize="13" fontWeight="800" fill="#7a4a8a">Arqueas</text>
        <text x="310" y="66" textAnchor="middle" fontSize="13" fontWeight="800" fill="#3b6fb6">Eucariotas</text>
      </g>
    </svg>
  )
}
