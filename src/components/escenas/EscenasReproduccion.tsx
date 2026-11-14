// Escenas del tema «Reproducción de los seres vivos»: unicelulares, la flor y los animales.
const suave = 'transform 1.1s cubic-bezier(.45,.05,.25,1), opacity 0.7s ease'
const ver = (si: boolean, mover = 'none', quieto = 'none') => ({ transition: suave, opacity: si ? 1 : 0, transform: si ? mover : quieto })
const T = ({ x, y, t, c = '#2b2b2b', s = 13 }: { x: number; y: number; t: string; c?: string; s?: number }) => (
  <text x={x} y={y} textAnchor="middle" fontSize={s} fontWeight="800" fill={c}>{t}</text>
)

/* ── unicelulares ───────────────────────────────────────────────────────── */
const UNI = ['biparticion', 'gemacion', 'esporulacion', 'conjugacion']

function Bacilo({ x, y, k = 1, color = '#e8a0b8' }: { x: number; y: number; k?: number; color?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <rect x="-34" y="-16" width="68" height="32" rx="16" fill={color} stroke="#a04a6a" strokeWidth="3" />
      <path d="M -14 -2 q 7 -9 14 0 t 14 0" fill="none" stroke="#a04a6a" strokeWidth="2.4" />
    </g>
  )
}

export function EscenaUnicelulares({ fase }: { fase: string }) {
  const i = Math.max(0, UNI.indexOf(fase))
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Reproducción de unicelulares: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#eef4f6" />
      {/* bipartición: una bacteria se alarga y se parte en dos */}
      <g style={ver(i === 0)}>
        <g key={`i${i}`} className={i === 0 ? 'animate-[partir-izq_1.6s_ease-in-out_0.3s_both]' : ''}><Bacilo x={200} y={150} /></g>
        <g key={`d${i}`} className={i === 0 ? 'animate-[partir-der_1.6s_ease-in-out_0.3s_both]' : ''}><Bacilo x={200} y={150} /></g>
        <T x={200} y={250} t="1 → 2 células iguales" c="#a04a6a" />
      </g>
      {/* gemación: la levadura forma una yema */}
      <g style={ver(i === 1)}>
        <ellipse cx="170" cy="160" rx="62" ry="52" fill="#f6e3b8" stroke="#a8841e" strokeWidth="3" />
        <circle cx="160" cy="160" r="15" fill="#c9a8e8" />
        <g style={{ transition: suave, transformOrigin: '226px 120px', transform: i === 1 ? 'translate(30px, -22px) scale(1)' : 'scale(0.2)' }}>
          <ellipse cx="226" cy="120" rx="30" ry="26" fill="#f6e3b8" stroke="#a8841e" strokeWidth="3" />
          <circle cx="226" cy="120" r="8" fill="#c9a8e8" />
        </g>
        <T x={200} y={262} t="levadura: le sale una yema" c="#8a6a1a" />
      </g>
      {/* esporulación: muchas células a la vez */}
      <g style={ver(i === 2)}>
        <circle cx="200" cy="140" r="70" fill="none" stroke="#7a4a8a" strokeWidth="3" strokeDasharray="7 6" />
        {Array.from({ length: 12 }, (_, k) => {
          const a = (k / 12) * Math.PI * 2
          return <circle key={k} cx="200" cy="140" r="11" fill="#e6d3f2" stroke="#7a4a8a" strokeWidth="2.5"
            style={{ transition: `${suave}`, transitionDelay: `${k * 0.04}s`, transform: i === 2 ? `translate(${Math.cos(a) * 96}px, ${Math.sin(a) * 82}px)` : 'none' }} />
        })}
        <T x={200} y={278} t="1 → muchas a la vez" c="#7a4a8a" />
      </g>
      {/* conjugación: intercambian ADN, no se reproducen */}
      <g style={ver(i === 3)}>
        <Bacilo x={120} y={150} k={1.3} />
        <Bacilo x={280} y={150} k={1.3} color="#a8d6c0" />
        <rect x="164" y="144" width="72" height="12" rx="6" fill="#d9c27a" stroke="#8a6a1a" strokeWidth="2" />
        <circle cx="200" cy="150" r="5" fill="#a04a6a" style={{ transition: 'transform 1.6s ease-in-out', transform: i === 3 ? 'translateX(30px)' : 'translateX(-30px)' }} />
        <T x={200} y={230} t="intercambian ADN: siguen siendo 2" c="#3f7a55" />
      </g>
    </svg>
  )
}

/* ── la flor: de la polinización a la semilla ───────────────────────────── */
const FLOR = ['flor', 'polinizacion', 'tubo', 'fecundacion', 'semilla']

export function EscenaFlor({ fase }: { fase: string }) {
  const i = Math.max(0, FLOR.indexOf(fase))
  const fruto = i === 4
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Reproducción de la flor: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#eef6e4" />
      <path d="M 200 300 V 236" stroke="#4f8a3a" strokeWidth="8" />
      {/* pétalos: se caen cuando se forma el fruto */}
      {[-1, 1].map((s) => (
        <path key={s} d={`M 200 220 Q ${200 + s * 110} 200 ${200 + s * 96} 120 Q ${200 + s * 40} 150 200 220 Z`} fill="#f4b8c8" stroke="#c4607a" strokeWidth="2.5"
          style={{ transition: suave, opacity: fruto ? 0 : 1, transformOrigin: '200px 220px', transform: fruto ? `rotate(${s * 40}deg) translateY(40px)` : 'none' }} />
      ))}
      {/* ovario → fruto */}
      <ellipse cx="200" cy="208" rx={fruto ? 46 : 26} ry={fruto ? 38 : 22} fill={fruto ? '#f2a03a' : '#cde6a0'} stroke={fruto ? '#a8641e' : '#4f8a3a'} strokeWidth="3" style={{ transition: 'rx 1s, ry 1s, fill 1s, stroke 1s' }} />
      {/* óvulos → semillas */}
      {[[188, 210], [212, 210], [200, 196]].map(([x, y], k) => (
        <circle key={k} cx={x} cy={y} r={fruto ? 8 : 5} fill={fruto ? '#6b4a2a' : '#fff'} stroke="#4f8a3a" strokeWidth="2" style={{ transition: 'r 1s, fill 1s' }} />
      ))}
      {/* estilo y estigma (pistilo) */}
      <g style={{ transition: 'opacity 0.8s', opacity: fruto ? 0 : 1 }}>
        <rect x="196" y="110" width="8" height="78" fill="#cde6a0" stroke="#4f8a3a" strokeWidth="2" />
        <ellipse cx="200" cy="108" rx="14" ry="7" fill="#9fcf6a" stroke="#4f8a3a" strokeWidth="2" />
        {/* estambres con anteras */}
        {[-1, 1].map((s) => (
          <g key={s}>
            <path d={`M ${200 + s * 14} 200 Q ${200 + s * 40} 150 ${200 + s * 46} 116`} fill="none" stroke="#c9a23a" strokeWidth="3" />
            <ellipse cx={200 + s * 46} cy="112" rx="9" ry="6" fill="#f2c94c" stroke="#b8860b" strokeWidth="2" />
          </g>
        ))}
      </g>
      {/* abeja que lleva polen */}
      <g style={ver(i === 1, 'translate(0, 0)', 'translate(-180px, -40px)')}>
        <ellipse cx="236" cy="86" rx="16" ry="10" fill="#f2c94c" stroke="#3a2a00" strokeWidth="2" />
        <path d="M 230 77 v 18 M 240 77 v 18" stroke="#3a2a00" strokeWidth="3" />
        <ellipse cx="232" cy="72" rx="8" ry="5" fill="#dff1ff" opacity="0.9" />
      </g>
      {/* grano de polen en el estigma y tubo polínico */}
      <circle cx="204" cy="103" r="5" fill="#f2c94c" stroke="#b8860b" strokeWidth="1.5" style={{ transition: 'opacity 0.6s', opacity: i >= 1 && i <= 3 ? 1 : 0 }} />
      <path d="M 204 106 C 206 140 194 170 200 196" fill="none" stroke="#e08a00" strokeWidth="3" strokeDasharray="120"
        style={{ transition: 'stroke-dashoffset 1.6s ease, opacity 0.6s', strokeDashoffset: i >= 2 ? 0 : 120, opacity: i >= 2 && i <= 3 ? 1 : 0 }} />
      <circle cx="200" cy="196" r="10" fill="#ffd34d" style={{ transition: 'opacity 0.6s', opacity: i === 3 ? 0.8 : 0 }} />
      {/* rótulos de la flor */}
      <g style={{ transition: 'opacity 0.6s', opacity: i === 0 ? 1 : 0 }} fontSize="12">
        <T x={200} y={92} t="estigma" c="#3f7a35" s={12} />
        <T x={300} y={110} t="antera" c="#8a6a1a" s={12} />
        <T x={270} y={250} t="ovario" c="#3f7a35" s={12} />
        <T x={92} y={100} t="pétalo" c="#c4607a" s={12} />
      </g>
      <g style={{ transition: 'opacity 0.6s', opacity: fruto ? 1 : 0 }}>
        <T x={290} y={204} t="fruto" c="#a8641e" />
        <T x={290} y={222} t="con semillas" c="#6b4a2a" s={11} />
      </g>
    </svg>
  )
}

/* ── animales ───────────────────────────────────────────────────────────── */
const ANI = ['hidra', 'estrella', 'externa', 'interna']

function Estrella({ x, y, k = 1, brazos = 5 }: { x: number; y: number; k?: number; brazos?: number }) {
  const puntos = Array.from({ length: brazos }, (_, j) => {
    const a = (j / 5) * Math.PI * 2 - Math.PI / 2
    return `M 0 0 L ${Math.cos(a - 0.25) * 18} ${Math.sin(a - 0.25) * 18} L ${Math.cos(a) * 50} ${Math.sin(a) * 50} L ${Math.cos(a + 0.25) * 18} ${Math.sin(a + 0.25) * 18} Z`
  }).join(' ')
  return <path d={puntos} transform={`translate(${x} ${y}) scale(${k})`} fill="#f2a03a" stroke="#a8541e" strokeWidth="2.5" strokeLinejoin="round" />
}

export function EscenaAnimales({ fase }: { fase: string }) {
  const i = Math.max(0, ANI.indexOf(fase))
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Reproducción en animales: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={i === 2 ? '#dcecf6' : '#f3efe6'} style={{ transition: 'fill 0.8s' }} />
      {/* hidra con yema */}
      <g style={ver(i === 0)}>
        <path d="M 160 270 C 150 200 154 140 170 110 L 190 110 C 206 140 210 200 200 270 Z" fill="#a8d6a0" stroke="#3f7a35" strokeWidth="3" />
        {[-30, -12, 6, 24].map((d) => <path key={d} d={`M ${180 + d / 3} 112 q ${d} -40 ${d * 1.6} -70`} fill="none" stroke="#3f7a35" strokeWidth="3" />)}
        <g key={`y${i}`} style={{ transformOrigin: '204px 220px', transformBox: 'view-box' }} className={i === 0 ? 'animate-[crecer_1.8s_ease-out_0.3s_both]' : ''}>
          <path d="M 202 214 C 232 206 250 186 258 160 L 266 168 C 262 196 240 220 204 230 Z" fill="#c4e6bc" stroke="#3f7a35" strokeWidth="2.5" />
          {[-12, 0, 12].map((d) => <path key={d} d={`M 262 164 q ${12 + d} -18 ${24 + d} -28`} fill="none" stroke="#3f7a35" strokeWidth="2" />)}
        </g>
        <T x={300} y={250} t="hidra: gemación" c="#3f7a35" />
      </g>
      {/* estrella de mar que se regenera */}
      <g style={ver(i === 1)}>
        <Estrella x={150} y={150} brazos={4} />
        <g style={{ transition: suave, transform: i === 1 ? 'translate(110px, 20px)' : 'none' }}>
          <Estrella x={150} y={150} k={1} brazos={1} />
          <g style={{ transition: 'opacity 1s ease 0.8s', opacity: i === 1 ? 1 : 0 }}><Estrella x={150} y={150} k={0.45} /></g>
        </g>
        <T x={200} y={262} t="un brazo con parte del centro → una estrella nueva" c="#a8541e" s={12} />
      </g>
      {/* fecundación externa: en el agua */}
      <g style={ver(i === 2)}>
        {[[110, 170], [140, 190], [124, 210], [160, 168], [150, 214], [100, 200]].map(([x, y], k) => (
          <circle key={k} cx={x} cy={y} r="11" fill="#fff6d6" stroke="#c9a23a" strokeWidth="2" />
        ))}
        {[[260, 110], [280, 140], [250, 160], [300, 120], [270, 180]].map(([x, y], k) => (
          <g key={k} style={{ transition: suave, transitionDelay: `${k * 0.1}s`, transform: i === 2 ? `translate(${-120 + k * 6}px, ${50 - k * 4}px)` : 'none' }}>
            <circle cx={x} cy={y} r="4" fill="#3b6fb6" />
            <path d={`M ${x + 4} ${y} q 8 -5 16 0`} fill="none" stroke="#3b6fb6" strokeWidth="2" />
          </g>
        ))}
        <T x={200} y={60} t="fecundación externa: en el agua" c="#2f5f8a" />
        <T x={200} y={270} t="peces, ranas" c="#2f5f8a" s={12} />
      </g>
      {/* fecundación interna */}
      <g style={ver(i === 3)}>
        <ellipse cx="200" cy="160" rx="120" ry="80" fill="#fbe1e6" stroke="#c4607a" strokeWidth="3" strokeDasharray="8 6" />
        <circle cx="230" cy="160" r="16" fill="#fff6d6" stroke="#c9a23a" strokeWidth="2.5" />
        {[0, 1, 2].map((k) => (
          <g key={k} style={{ transition: suave, transitionDelay: `${k * 0.15}s`, transform: i === 3 ? `translate(${90 - k * 14}px, ${k * 8 - 8}px)` : 'none' }}>
            <circle cx={120} cy={160} r="4" fill="#3b6fb6" />
            <path d="M 116 160 q -8 -5 -16 0" fill="none" stroke="#3b6fb6" strokeWidth="2" />
          </g>
        ))}
        <T x={200} y={66} t="fecundación interna: dentro del cuerpo de la hembra" c="#a0405a" s={12} />
        <T x={200} y={268} t="aves, reptiles, mamíferos" c="#a0405a" s={12} />
      </g>
    </svg>
  )
}
