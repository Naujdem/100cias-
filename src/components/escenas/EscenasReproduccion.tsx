// Escenas del tema «Reproducción de los seres vivos», paso a paso.
// Cada proceso usa sus propias fases (p. ej. bip-1…bip-4); una lámina muestra solo las de un proceso.
const suave = 'transform 1.1s cubic-bezier(.45,.05,.25,1), opacity 0.7s ease'
const ver = (si: boolean, mover = 'none', quieto = 'none') => ({ transition: suave, opacity: si ? 1 : 0, transform: si ? mover : quieto })
const T = ({ x, y, t, c = '#2b2b2b', s = 13 }: { x: number; y: number; t: string; c?: string; s?: number }) => (
  <text x={x} y={y} textAnchor="middle" fontSize={s} fontWeight="800" fill={c}>{t}</text>
)
/** número de paso dentro de un proceso: «bip-3» → 3 */
const paso = (fase: string, pre: string) => (fase.startsWith(pre + '-') ? Number(fase.slice(pre.length + 1)) : 0)

/* ── unicelulares ───────────────────────────────────────────────────────── */
const ROSA = '#e8a0b8'
const BORDE = '#a04a6a'

export function EscenaUnicelulares({ fase }: { fase: string }) {
  const b = paso(fase, 'bip')
  const g = paso(fase, 'gem')
  const e = paso(fase, 'esp')
  const c = paso(fase, 'con')
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Reproducción de unicelulares: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#eef4f6" />

      {/* bipartición: copia el ADN → se alarga → tabique → dos hijas */}
      <g style={ver(b > 0)}>
        <g style={{ transition: suave, opacity: b < 4 ? 1 : 0 }}>
          <rect x={b >= 2 ? 110 : 160} y="128" width={b >= 2 ? 180 : 80} height="44" rx="22" fill={ROSA} stroke={BORDE} strokeWidth="3" style={{ transition: 'x 1s, width 1s' }} />
          <rect x="198" y="128" width="4" height="44" fill={BORDE} style={{ transition: 'transform 1s', transformOrigin: '200px 150px', transform: b >= 3 ? 'scaleY(1)' : 'scaleY(0)' }} />
        </g>
        {[-1, 1].map((s) => (
          <rect key={s} x={200 + s * 74 - 40} y="128" width="80" height="44" rx="22" fill={ROSA} stroke={BORDE} strokeWidth="3"
            style={{ transition: suave, opacity: b >= 4 ? 1 : 0, transform: b >= 4 ? 'none' : `translateX(${-s * 30}px)` }} />
        ))}
        {[-1, 1].map((s) => (
          <path key={s} d="M -14 -2 q 7 -9 14 0 t 14 0" fill="none" stroke={BORDE} strokeWidth="2.6"
            style={{ transition: suave, opacity: s === 1 && b < 1 ? 0 : 1, transform: `translate(${200 + s * (b >= 4 ? 74 : b >= 2 ? 46 : 2)}px, ${150 + (b >= 2 ? 0 : s * 7)}px)` }} />
        ))}
        <T x={200} y={240} t={['', 'el ADN se copia', 'la célula crece y se alarga', 'se forma un tabique en el medio', '1 → 2 células iguales'][b] ?? ''} c={BORDE} />
      </g>

      {/* gemación: copia el ADN → sale una yema → un núcleo pasa → se separa */}
      <g style={ver(g > 0)}>
        <ellipse cx="170" cy="160" rx="62" ry="52" fill="#f6e3b8" stroke="#a8841e" strokeWidth="3" />
        <g style={{ transition: suave, transformOrigin: '228px 116px', transform: g >= 4 ? 'translate(60px, -30px)' : g >= 3 ? 'scale(1)' : g >= 2 ? 'translate(-10px, 10px) scale(0.5)' : 'scale(0.01)', opacity: g >= 2 ? 1 : 0 }}>
          <ellipse cx="228" cy="116" rx="32" ry="28" fill="#f6e3b8" stroke="#a8841e" strokeWidth="3" />
        </g>
        <circle cx="160" cy="160" r="14" fill="#c9a8e8" />
        {/* la copia del núcleo: sin escalar (la escala en CSS se calcula desde la esquina del dibujo) */}
        <circle cx="160" cy="160" r="10" fill="#b08ad6"
          style={{ transition: suave, opacity: g >= 1 ? 1 : 0, transform: g >= 4 ? 'translate(128px, -74px)' : g >= 3 ? 'translate(68px, -44px)' : 'translate(12px, 8px)' }} />
        <T x={200} y={262} t={['', 'el núcleo se copia', 'sale una yema', 'un núcleo pasa a la yema, que crece', 'la yema se separa'][g] ?? ''} c="#8a6a1a" />
      </g>

      {/* esporulación: el núcleo se divide muchas veces → se rodean de citoplasma → salen */}
      <g style={ver(e > 0)}>
        <circle cx="200" cy="140" r="86" fill="#f1e6f8" stroke="#7a4a8a" strokeWidth="3" strokeDasharray={e >= 3 ? '7 9' : undefined} style={{ transition: 'opacity 0.7s', opacity: e >= 3 ? 0.5 : 1 }} />
        {Array.from({ length: 10 }, (_, k) => {
          const a = (k / 10) * Math.PI * 2
          const r = e >= 3 ? 130 : 50
          return (
            <g key={k} style={{ transition: suave, transitionDelay: `${k * 0.04}s`, transform: `translate(${200 + Math.cos(a) * r}px, ${140 + Math.sin(a) * r * 0.85}px)` }}>
              <circle r="15" fill="#e6d3f2" stroke="#7a4a8a" strokeWidth="2.5" style={{ transition: 'opacity 0.7s', opacity: e >= 2 ? 1 : 0 }} />
              <circle r="5" fill="#7a4a8a" />
            </g>
          )
        })}
        <T x={200} y={286} t={['', 'el núcleo se divide muchas veces', 'cada núcleo se rodea de citoplasma', 'la célula se rompe: salen muchas'][e] ?? ''} c="#7a4a8a" />
      </g>

      {/* conjugación: se acercan → puente → pasa una copia de ADN → se separan */}
      <g style={ver(c > 0)}>
        <g style={{ transition: suave, transform: c >= 2 && c <= 3 ? 'none' : 'translateX(-40px)' }}>
          <rect x="70" y="128" width="96" height="44" rx="22" fill={ROSA} stroke={BORDE} strokeWidth="3" />
          <circle cx="110" cy="150" r="9" fill="none" stroke={BORDE} strokeWidth="3" />
        </g>
        <g style={{ transition: suave, transform: c >= 2 && c <= 3 ? 'none' : 'translateX(40px)' }}>
          <rect x="234" y="128" width="96" height="44" rx="22" fill="#a8d6c0" stroke="#3f7a55" strokeWidth="3" />
          <circle cx="290" cy="150" r="9" fill="none" stroke={BORDE} strokeWidth="3" style={{ transition: 'opacity 0.7s', opacity: c >= 4 ? 1 : 0 }} />
        </g>
        <rect x="166" y="145" width="68" height="10" rx="5" fill="#d9c27a" stroke="#8a6a1a" strokeWidth="2" style={{ transition: 'opacity 0.6s', opacity: c >= 2 && c <= 3 ? 1 : 0 }} />
        <circle cx="180" cy="150" r="6" fill="none" stroke={BORDE} strokeWidth="2.5" style={{ transition: 'transform 1.4s ease-in-out, opacity 0.5s', opacity: c === 3 ? 1 : 0, transform: c === 3 ? 'translateX(46px)' : 'none' }} />
        <T x={200} y={230} t={['', 'dos bacterias se acercan', 'forman un puente', 'pasa una copia de ADN', 'se separan: siguen siendo 2'][c] ?? ''} c="#3f7a55" />
      </g>
    </svg>
  )
}

/* ── plantas: de la flor a la semilla, y la germinación ─────────────────── */
const FLOR = ['flor', 'polen', 'polinizacion', 'tubo', 'fecundacion', 'semilla', 'germinacion']

export function EscenaFlor({ fase }: { fase: string }) {
  const i = Math.max(0, FLOR.indexOf(fase))
  const fruto = i >= 5
  const germina = i === 6
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Reproducción de la flor: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#eef6e4" />
      <g style={{ transition: 'opacity 0.8s', opacity: germina ? 0 : 1 }}>
        <path d="M 200 300 V 236" stroke="#4f8a3a" strokeWidth="8" />
        {[-1, 1].map((s) => (
          <path key={s} d={`M 200 220 Q ${200 + s * 110} 200 ${200 + s * 96} 120 Q ${200 + s * 40} 150 200 220 Z`} fill="#f4b8c8" stroke="#c4607a" strokeWidth="2.5"
            style={{ transition: suave, opacity: fruto ? 0 : 1, transformOrigin: '200px 220px', transform: fruto ? `rotate(${s * 40}deg) translateY(40px)` : 'none' }} />
        ))}
        <ellipse cx="200" cy="208" rx={fruto ? 46 : 26} ry={fruto ? 38 : 22} fill={fruto ? '#f2a03a' : '#cde6a0'} stroke={fruto ? '#a8641e' : '#4f8a3a'} strokeWidth="3" style={{ transition: 'rx 1s, ry 1s, fill 1s, stroke 1s' }} />
        {[[188, 210], [212, 210], [200, 196]].map(([x, y], k) => (
          <circle key={k} cx={x} cy={y} r={fruto ? 8 : 5} fill={fruto ? '#6b4a2a' : '#fff'} stroke="#4f8a3a" strokeWidth="2" style={{ transition: 'r 1s, fill 1s' }} />
        ))}
        <g style={{ transition: 'opacity 0.8s', opacity: fruto ? 0 : 1 }}>
          <rect x="196" y="110" width="8" height="78" fill="#cde6a0" stroke="#4f8a3a" strokeWidth="2" />
          <ellipse cx="200" cy="108" rx="14" ry="7" fill="#9fcf6a" stroke="#4f8a3a" strokeWidth="2" />
          {[-1, 1].map((s) => (
            <g key={s}>
              <path d={`M ${200 + s * 14} 200 Q ${200 + s * 40} 150 ${200 + s * 46} 116`} fill="none" stroke="#c9a23a" strokeWidth="3" />
              <ellipse cx={200 + s * 46} cy="112" rx="9" ry="6" fill="#f2c94c" stroke="#b8860b" strokeWidth="2" />
            </g>
          ))}
        </g>
        {/* granos de polen que salen de la antera */}
        {[[252, 100], [262, 92], [256, 84], [268, 104]].map(([x, y], k) => (
          <circle key={k} cx={x} cy={y} r="3.5" fill="#f2c94c" stroke="#b8860b" strokeWidth="1" style={{ transition: `opacity 0.5s ease ${k * 0.15}s`, opacity: i === 1 ? 1 : 0 }} />
        ))}
        <g style={ver(i === 2, 'translate(0, 0)', 'translate(-180px, -40px)')}>
          <ellipse cx="236" cy="86" rx="16" ry="10" fill="#f2c94c" stroke="#3a2a00" strokeWidth="2" />
          <path d="M 230 77 v 18 M 240 77 v 18" stroke="#3a2a00" strokeWidth="3" />
          <ellipse cx="232" cy="72" rx="8" ry="5" fill="#dff1ff" opacity="0.9" />
        </g>
        <circle cx="204" cy="103" r="5" fill="#f2c94c" stroke="#b8860b" strokeWidth="1.5" style={{ transition: 'opacity 0.6s', opacity: i >= 2 && i <= 4 ? 1 : 0 }} />
        <path d="M 204 106 C 206 140 194 170 200 196" fill="none" stroke="#e08a00" strokeWidth="3" strokeDasharray="120"
          style={{ transition: 'stroke-dashoffset 1.6s ease, opacity 0.6s', strokeDashoffset: i >= 3 ? 0 : 120, opacity: i >= 3 && i <= 4 ? 1 : 0 }} />
        <circle cx="200" cy="196" r="10" fill="#ffd34d" style={{ transition: 'opacity 0.6s', opacity: i === 4 ? 0.8 : 0 }} />
        <g style={{ transition: 'opacity 0.6s', opacity: i === 0 ? 1 : 0 }}>
          <T x={200} y={92} t="estigma" c="#3f7a35" s={12} />
          <T x={300} y={110} t="antera" c="#8a6a1a" s={12} />
          <T x={270} y={250} t="ovario" c="#3f7a35" s={12} />
          <T x={92} y={100} t="pétalo" c="#c4607a" s={12} />
        </g>
        <g style={{ transition: 'opacity 0.6s', opacity: i === 5 ? 1 : 0 }}>
          <T x={290} y={204} t="fruto" c="#a8641e" />
          <T x={290} y={222} t="con semillas" c="#6b4a2a" s={11} />
        </g>
      </g>
      {/* germinación: la semilla en la tierra echa raíz y tallo */}
      <g style={ver(germina)}>
        <rect x="0" y="190" width="400" height="110" fill="#8a6a4a" />
        <ellipse cx="200" cy="200" rx="16" ry="11" fill="#6b4a2a" />
        <path d="M 200 208 C 196 232 206 252 198 280" fill="none" stroke="#f3ead8" strokeWidth="4" strokeLinecap="round" />
        <path d="M 200 192 C 200 160 196 140 202 112" fill="none" stroke="#4f8a3a" strokeWidth="5" strokeLinecap="round" />
        <path d="M 202 118 q -30 -16 -40 6 q 24 8 40 -6 M 202 118 q 30 -16 40 6 q -24 8 -40 -6" fill="#7fbf5a" stroke="#4f8a3a" strokeWidth="2" />
        <T x={300} y={170} t="germinación" c="#3f7a35" />
      </g>
    </svg>
  )
}

/* ── plantas: un esqueje paso a paso ────────────────────────────────────── */
export function EscenaEsqueje({ fase }: { fase: string }) {
  const k = paso(fase, 'esq')
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Esqueje: paso ${k}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#eef6e4" />
      <rect x="0" y="222" width="400" height="80" fill="#8a6a4a" />
      {/* planta madre */}
      <g style={{ transition: suave, opacity: k <= 1 ? 1 : 0.35 }}>
        <path d="M 100 222 V 128" stroke="#4f8a3a" strokeWidth="7" />
        {[150, 180].map((y, j) => <path key={y} d={`M 100 ${y} q ${j % 2 ? 34 : -34} -14 ${j % 2 ? 46 : -46} 4 q ${j % 2 ? -22 : 22} 10 ${j % 2 ? -46 : 46} -4`} fill="#7fbf5a" stroke="#4f8a3a" strokeWidth="2" />)}
        <path d="M 82 132 l 36 -10" stroke="#c43c3c" strokeWidth="3" strokeDasharray="5 4" style={{ transition: 'opacity 0.5s', opacity: k === 1 ? 1 : 0 }} />
      </g>
      {/* el trozo de tallo que se corta y se siembra */}
      <g style={{ transition: suave, transform: k >= 2 ? 'translate(170px, 120px)' : 'none' }}>
        <path d="M 100 70 V 128" stroke="#4f8a3a" strokeWidth="7" />
        <path d="M 100 90 q -34 -14 -46 4 q 22 10 46 -4 M 100 110 q 34 -14 46 4 q -22 10 -46 -4" fill="#7fbf5a" stroke="#4f8a3a" strokeWidth="2" />
        <g style={{ transition: 'opacity 0.8s', opacity: k >= 3 ? 1 : 0 }} stroke="#f3ead8" strokeWidth="3" fill="none" strokeLinecap="round">
          <path d="M 100 128 q -16 14 -20 30" /><path d="M 100 128 q 4 18 -2 34" /><path d="M 100 128 q 16 12 22 28" />
        </g>
        <g style={{ transition: 'opacity 0.8s, transform 1s', opacity: k >= 4 ? 1 : 0, transformOrigin: '100px 70px', transform: k >= 4 ? 'scale(1)' : 'scale(0.3)' }}>
          <path d="M 100 70 V 30" stroke="#4f8a3a" strokeWidth="6" />
          <path d="M 100 46 q 30 -16 42 4 q -22 10 -42 -4 M 100 36 q -30 -16 -42 4 q 22 10 42 -4" fill="#9fd37a" stroke="#4f8a3a" strokeWidth="2" />
        </g>
      </g>
      <T x={300} y={50} t={['', 'se corta un trozo de tallo', 'se entierra', 'echa raíces', 'una planta nueva, igual a la madre'][k] ?? ''} c="#3f7a35" s={12} />
    </svg>
  )
}

/* ── animales ───────────────────────────────────────────────────────────── */
function Estrella({ x, y, k = 1, sin = -1, solo = -1 }: { x: number; y: number; k?: number; sin?: number; solo?: number }) {
  const d = Array.from({ length: 5 }, (_, j) => {
    if (j === sin || (solo >= 0 && j !== solo)) return ''
    const a = (j / 5) * Math.PI * 2 - Math.PI / 2
    return `M 0 0 L ${Math.cos(a - 0.3) * 16} ${Math.sin(a - 0.3) * 16} L ${Math.cos(a) * 50} ${Math.sin(a) * 50} L ${Math.cos(a + 0.3) * 16} ${Math.sin(a + 0.3) * 16} Z`
  }).join(' ')
  return <path d={d} transform={`translate(${x} ${y}) scale(${k})`} fill="#f2a03a" stroke="#a8541e" strokeWidth="2.5" strokeLinejoin="round" />
}

export function EscenaAnimales({ fase }: { fase: string }) {
  const h = paso(fase, 'hidra')
  const es = paso(fase, 'est')
  const ex = paso(fase, 'ext')
  const it = paso(fase, 'int')
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Reproducción en animales: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={ex > 0 ? '#dcecf6' : '#f3efe6'} style={{ transition: 'fill 0.8s' }} />
      {/* hidra: adulta → sale una yema → crece con tentáculos → se separa */}
      <g style={ver(h > 0)}>
        <path d="M 150 270 C 140 200 144 140 160 110 L 180 110 C 196 140 200 200 190 270 Z" fill="#a8d6a0" stroke="#3f7a35" strokeWidth="3" />
        {[-30, -12, 6, 24].map((d) => <path key={d} d={`M ${170 + d / 3} 112 q ${d} -40 ${d * 1.6} -70`} fill="none" stroke="#3f7a35" strokeWidth="3" />)}
        <g style={{ transition: suave, transformOrigin: '194px 220px', transform: h >= 4 ? 'translate(110px, 20px) rotate(-30deg)' : h >= 3 ? 'scale(1)' : h >= 2 ? 'scale(0.45)' : 'scale(0.01)', opacity: h >= 2 ? 1 : 0 }}>
          <path d="M 192 214 C 222 206 240 186 248 160 L 256 168 C 252 196 230 220 194 230 Z" fill="#c4e6bc" stroke="#3f7a35" strokeWidth="2.5" />
          <g style={{ transition: 'opacity 0.8s', opacity: h >= 3 ? 1 : 0 }}>
            {[-12, 0, 12].map((d) => <path key={d} d={`M 252 164 q ${12 + d} -18 ${24 + d} -28`} fill="none" stroke="#3f7a35" strokeWidth="2" />)}
          </g>
        </g>
        <T x={300} y={60} t={['', 'una hidra adulta', 'le sale una yema', 'la yema crece y saca tentáculos', 'se separa: otra hidra'][h] ?? ''} c="#3f7a35" s={12} />
      </g>
      {/* estrella: completa → pierde un brazo → el brazo regenera → dos estrellas */}
      <g style={ver(es > 0)}>
        <Estrella x={130} y={150} sin={es >= 2 && es < 4 ? 1 : -1} />
        <g style={{ transition: suave, opacity: es >= 2 ? 1 : 0, transform: es >= 2 ? 'translate(140px, 30px)' : 'none' }}>
          <g style={{ transition: 'opacity 0.8s', opacity: es >= 3 ? 0 : 1 }}><Estrella x={130} y={150} solo={1} /></g>
          <g style={{ transition: 'opacity 1s, transform 1.2s', transformOrigin: '130px 150px', opacity: es >= 3 ? 1 : 0, transform: es >= 4 ? 'scale(1)' : 'scale(0.55)' }}><Estrella x={130} y={150} /></g>
        </g>
        <T x={200} y={268} t={['', 'una estrella de mar', 'pierde un brazo con parte del centro', 'el brazo regenera lo que le falta', 'ahora son dos estrellas'][es] ?? ''} c="#a8541e" s={12} />
      </g>
      {/* fecundación externa */}
      <g style={ver(ex > 0)}>
        {[[110, 170], [140, 190], [124, 210], [160, 168], [150, 214], [100, 200]].map(([x, y], k) => (
          <circle key={k} cx={x} cy={y} r="11" fill={ex >= 3 ? '#ffe9a8' : '#fff6d6'} stroke="#c9a23a" strokeWidth="2" style={{ transition: 'fill 0.8s' }} />
        ))}
        {[[280, 110], [300, 140], [270, 160], [320, 120], [290, 180]].map(([x, y], k) => (
          <g key={k} style={{ transition: suave, transitionDelay: `${k * 0.1}s`, opacity: ex >= 2 ? 1 : 0, transform: ex >= 3 ? `translate(${-150 + k * 6}px, ${54 - k * 6}px)` : 'none' }}>
            <circle cx={x} cy={y} r="4" fill="#3b6fb6" />
            <path d={`M ${x + 4} ${y} q 8 -5 16 0`} fill="none" stroke="#3b6fb6" strokeWidth="2" />
          </g>
        ))}
        <T x={200} y={60} t={['', 'la hembra suelta óvulos en el agua', 'el macho suelta espermatozoides', 'se unen en el agua: huevos fecundados'][ex] ?? ''} c="#2f5f8a" s={12} />
        <T x={200} y={270} t="peces, ranas" c="#2f5f8a" s={12} />
      </g>
      {/* fecundación interna */}
      <g style={ver(it > 0)}>
        <ellipse cx="200" cy="160" rx="120" ry="80" fill="#fbe1e6" stroke="#c4607a" strokeWidth="3" strokeDasharray="8 6" />
        <circle cx="230" cy="160" r="16" fill={it >= 2 ? '#ffe9a8' : '#fff6d6'} stroke="#c9a23a" strokeWidth="2.5" style={{ transition: 'fill 0.8s' }} />
        {[0, 1, 2].map((k) => (
          <g key={k} style={{ transition: suave, transitionDelay: `${k * 0.15}s`, transform: it >= 2 ? `translate(${92 - k * 16}px, ${k * 8 - 8}px)` : 'none' }}>
            <circle cx={120} cy={160} r="4" fill="#3b6fb6" />
            <path d="M 116 160 q -8 -5 -16 0" fill="none" stroke="#3b6fb6" strokeWidth="2" />
          </g>
        ))}
        <T x={200} y={66} t={it >= 2 ? 'se unen dentro de la hembra: se forma el cigoto' : 'los espermatozoides entran al cuerpo de la hembra'} c="#a0405a" s={12} />
        <T x={200} y={268} t="aves, reptiles, mamíferos" c="#a0405a" s={12} />
      </g>
    </svg>
  )
}

/* ── plantas: tubérculo, estolón y bulbo, paso a paso ───────────────────── */
const TIERRA = '#8a6a4a'
const RAIZ = '#f3ead8'
const VERDE = '#4f8a3a'
const Hoja = ({ x, y, a = 0, k = 1 }: { x: number; y: number; a?: number; k?: number }) => (
  <path d="M 0 0 q 16 -12 30 -2 q -14 12 -30 2 Z" transform={`translate(${x} ${y}) rotate(${a}) scale(${k})`} fill="#7fbf5a" stroke={VERDE} strokeWidth="2" />
)

export function EscenaPorPedazos({ fase }: { fase: string }) {
  const tu = paso(fase, 'tub')
  const es = paso(fase, 'esto')
  const bu = paso(fase, 'bul')
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Reproducción asexual de plantas: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#eef6e4" />
      <rect x="0" y="196" width="400" height="110" fill={TIERRA} />

      {/* tubérculo: papa con ojos → se siembra → brota → planta con papas nuevas */}
      <g style={ver(tu > 0)}>
        <g style={{ transition: suave, transform: tu >= 2 ? 'translate(0, 70px)' : 'none' }}>
          <ellipse cx="200" cy="160" rx="40" ry="28" fill="#d8b48a" stroke="#8a6a3a" strokeWidth="3" />
          {[[184, 150], [214, 156], [198, 172]].map(([x, y], k) => <circle key={k} cx={x} cy={y} r="3" fill="#6b4a2a" />)}
          <g style={{ transition: 'opacity 0.8s', opacity: tu >= 3 ? 1 : 0 }}>
            <path d="M 186 182 q -10 20 -18 34 M 210 184 q 6 18 2 34" fill="none" stroke={RAIZ} strokeWidth="3" strokeLinecap="round" />
            <path d="M 200 134 V 100" stroke={VERDE} strokeWidth="5" style={{ transition: 'transform 1s', transformOrigin: '200px 134px', transform: tu >= 4 ? 'scaleY(2.6)' : 'scaleY(1)' }} />
          </g>
        </g>
        <g style={{ transition: 'opacity 0.8s', opacity: tu >= 4 ? 1 : 0 }}>
          {[[200, 128], [-20, 136], [200, 158], [-20, 164], [-90, 120]].map(([a, y], k) => <Hoja key={k} x={200} y={y} a={a} k={1.1} />)}
          <path d="M 200 230 q -50 6 -80 30 M 200 230 q 50 6 84 26" fill="none" stroke="#c9b08a" strokeWidth="3" />
          {[[116, 262], [288, 258], [150, 280]].map(([x, y], k) => <ellipse key={k} cx={x} cy={y} rx="16" ry="11" fill="#d8b48a" stroke="#8a6a3a" strokeWidth="2.5" />)}
        </g>
        <T x={200} y={36} t={['', 'una papa con «ojos» (yemas)', 'se siembra en la tierra', 'de los ojos brotan raíces y tallo', 'planta nueva… y papas nuevas abajo'][tu] ?? ''} c="#6b4a2a" s={12} />
      </g>

      {/* estolón: planta madre → sale un estolón → echa raíces → planta hija */}
      <g style={ver(es > 0)}>
        <g>
          {[200, -20, 240, -60].map((a, k) => <Hoja key={k} x={110} y={190} a={a} k={1.4} />)}
          <path d="M 110 196 q -6 14 -2 26 M 110 196 q 8 14 4 28" fill="none" stroke={RAIZ} strokeWidth="3" />
          <path d="M 96 170 q -8 10 0 18 q 10 -4 6 -16 Z" fill="#e04848" stroke="#9a2020" strokeWidth="1.5" />
        </g>
        <path d="M 116 192 Q 200 176 286 192" fill="none" stroke={VERDE} strokeWidth="4" strokeDasharray="180"
          style={{ transition: 'stroke-dashoffset 1.4s ease', strokeDashoffset: es >= 2 ? 0 : 180 }} />
        <line x1="200" y1="174" x2="208" y2="196" stroke="#c43c3c" strokeWidth="3" strokeDasharray="4 3" style={{ transition: 'opacity 0.5s', opacity: es >= 4 ? 1 : 0 }} />
        <g style={{ transition: 'opacity 0.8s, transform 1s', transformOrigin: '288px 194px', opacity: es >= 3 ? 1 : 0, transform: es >= 4 ? 'scale(1.3)' : 'scale(0.6)' }}>
          {[[200], [-20], [240], [-60]].map(([a], k) => <Hoja key={k} x={288} y={192} a={a} />)}
          <path d="M 288 196 q -6 14 -2 24 M 288 196 q 8 12 4 26" fill="none" stroke={RAIZ} strokeWidth="3" />
        </g>
        <T x={200} y={50} t={['', 'una planta de fresa', 'sale un estolón: un tallo que corre por el suelo', 'en la punta echa raíces y hojas', 'se corta el estolón: una planta hija'][es] ?? ''} c={VERDE} s={12} />
      </g>

      {/* bulbo: un diente de ajo → se siembra → raíces y hojas → cabeza nueva */}
      <g style={ver(bu > 0)}>
        <g style={{ transition: suave, transform: bu >= 2 ? 'translate(0, 70px)' : 'none', opacity: bu >= 4 ? 0 : 1 }}>
          <path d="M 200 140 C 214 150 220 170 210 186 Q 200 192 190 186 C 180 170 186 150 200 140 Z" fill="#f4ecdc" stroke="#a8946a" strokeWidth="2.5" />
          <g style={{ transition: 'opacity 0.8s', opacity: bu >= 3 ? 1 : 0 }}>
            <path d="M 194 190 q -8 18 -14 26 M 200 192 v 26 M 206 190 q 8 18 14 26" fill="none" stroke={RAIZ} strokeWidth="3" strokeLinecap="round" />
          </g>
        </g>
        <g style={{ transition: 'opacity 0.8s, transform 1s', transformOrigin: '200px 210px', opacity: bu >= 3 ? 1 : 0, transform: bu >= 4 ? 'scaleY(1.25)' : 'scaleY(1)' }}>
          <path d="M 200 210 C 196 160 184 120 176 90 M 200 210 C 202 160 210 120 222 86 M 200 210 C 200 160 200 110 200 74" fill="none" stroke={VERDE} strokeWidth="5" strokeLinecap="round" />
        </g>
        <g style={{ transition: 'opacity 0.8s', opacity: bu >= 4 ? 1 : 0 }}>
          <path d="M 200 206 C 236 210 244 250 222 262 Q 200 270 178 262 C 156 250 164 210 200 206 Z" fill="#f4ecdc" stroke="#a8946a" strokeWidth="2.5" />
          <path d="M 200 210 V 264 M 186 214 Q 176 240 186 262 M 214 214 Q 224 240 214 262" fill="none" stroke="#c9b48a" strokeWidth="2" />
          <path d="M 190 264 q -6 14 -12 22 M 200 266 v 22 M 210 264 q 6 14 12 22" fill="none" stroke={RAIZ} strokeWidth="3" />
        </g>
        <T x={200} y={36} t={['', 'un diente de ajo', 'se siembra con la punta hacia arriba', 'echa raíces abajo y hojas arriba', 'bajo tierra se forma una cabeza nueva'][bu] ?? ''} c="#6b5a3a" s={12} />
      </g>
    </svg>
  )
}
