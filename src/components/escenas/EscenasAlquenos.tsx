// Escenas vivas de Química orgánica, tema 4: alquenos y alquinos.
import { Molecula, construir, cadena, MOLS, Lienzo, T, ver, idx, suave, ROJO, AZUL, VERDE, TINTA } from './Molecula.tsx'

const CO = ['fruta', 'soldadura', 'carburo']

export function EscenaAlqCotidiano({ fase }: { fase: string }) {
  const i = idx(CO, fase)
  return (
    <Lienzo etiqueta={`Etileno y acetileno: ${fase}`}>
      <g style={ver(i === 0)}>
        <path d="M60 210 h170 l-15 -100 h-140 z" fill="#d9c49a" stroke={TINTA} strokeWidth="2" />
        <text x="110" y="185" fontSize="44" textAnchor="middle">🍌</text>
        <text x="175" y="185" fontSize="44" textAnchor="middle">🥑</text>
        {[0, 1, 2].map((k) => <circle key={k} cx={130 + k * 10} cy={140 - k * 6} r="4" fill={VERDE}><animate attributeName="cx" values={`${125 + k * 8};${165 + k * 5}`} dur="2s" repeatCount="indefinite" /></circle>)}
        <Molecula mol={MOLS.eteno(280, 150)} s={0.9} />
        <T x={300} y={200} t="etileno C₂H₄" s={12} c={VERDE} />
      </g>
      <g style={ver(i === 1)}>
        <rect x="60" y="90" width="34" height="120" rx="14" fill="#c43c3c" /><rect x="100" y="90" width="34" height="120" rx="14" fill="#3f6fb8" />
        <path d="M117 90 q20 -40 90 -30" fill="none" stroke="#333" strokeWidth="4" />
        <path d="M205 62 l30 -8" stroke="#888" strokeWidth="6" />
        <path d="M236 54 q30 -6 50 0 q-20 6 -50 0" fill="#9cc7ff" /><circle cx="292" cy="54" r="5" fill="#fff6c0" />
        <Molecula mol={MOLS.etino(250, 170)} s={0.9} />
        <T x={270} y={215} t="acetileno C₂H₂" s={12} c={ROJO} />
      </g>
      <g style={ver(i === 2)}>
        <rect x="120" y="120" width="60" height="90" rx="6" fill="#b8a77a" stroke={TINTA} strokeWidth="2" />
        <rect x="120" y="70" width="60" height="45" rx="6" fill="#d7eaf7" stroke={TINTA} strokeWidth="2" />
        <path d="M150 115 v10" stroke={AZUL} strokeWidth="3" strokeDasharray="2 2" />
        <path d="M180 140 h40" stroke="#888" strokeWidth="5" /><path d="M222 140 q14 -26 0 -46 q-10 20 0 46" fill="#f6a33c" />
        <T x={150} y={170} t="carburo" s={11} c="#fff" />
        <T x={200} y={240} t="CaC₂ + 2 H₂O → C₂H₂ + Ca(OH)₂" s={14} c={ROJO} />
      </g>
      <T x={200} y={40} t={['El banano maduro suelta etileno', 'Soplete oxiacetilénico: ≈ 3100 °C', 'Lámpara de carburo de los mineros'][i]} s={15} />
      {i === 0 && <T x={200} y={250} t="En una bolsa de papel, el aguacate madura más rápido" s={12} peso={600} />}
    </Lienzo>
  )
}

const CT = ['sencillo', 'cis', 'trans']

export function EscenaAlqCisTrans({ fase }: { fase: string }) {
  const i = idx(CT, fase)
  // dos carbonos centrales; grupos a 120°
  const c1 = [170, 150], c2 = [230, 150]
  const arriba = (c: number[], izq: boolean) => [c[0] + (izq ? -35 : 35), c[1] - 50]
  const abajo = (c: number[], izq: boolean) => [c[0] + (izq ? -35 : 35), c[1] + 50]
  const me2 = i === 2 ? abajo(c2, false) : arriba(c2, false)
  const h2 = i === 2 ? arriba(c2, false) : abajo(c2, false)
  const giro = i === 0
  return (
    <Lienzo etiqueta={`Isomería cis-trans: ${fase}`}>
      <line x1={c1[0]} y1={c1[1]} x2={c2[0]} y2={c2[1]} stroke={TINTA} strokeWidth="3" />
      {!giro && <line x1={c1[0]} y1={c1[1] + 8} x2={c2[0]} y2={c2[1] + 8} stroke={TINTA} strokeWidth="3" />}
      <g style={{ transformOrigin: `${c2[0]}px ${c2[1]}px`, animation: giro ? 'giro-ct 3s linear infinite' : 'none' }}>
        {[[me2, 'CH₃', '#7a4fb0'], [h2, 'H', '#fff']].map(([p, t, col], k) => {
          const pp = p as number[]
          return <g key={k} style={{ transition: suave }}><line x1={c2[0]} y1={c2[1]} x2={pp[0]} y2={pp[1]} stroke={TINTA} strokeWidth="3" /><circle cx={pp[0]} cy={pp[1]} r={t === 'H' ? 10 : 16} fill={col as string} stroke={TINTA} /><T x={pp[0]} y={pp[1] + 4} t={t as string} s={10} c={t === 'H' ? TINTA : '#fff'} /></g>
        })}
      </g>
      {[[arriba(c1, true), 'CH₃', '#7a4fb0'], [abajo(c1, true), 'H', '#fff']].map(([p, t, col], k) => {
        const pp = p as number[]
        return <g key={k}><line x1={c1[0]} y1={c1[1]} x2={pp[0]} y2={pp[1]} stroke={TINTA} strokeWidth="3" /><circle cx={pp[0]} cy={pp[1]} r={t === 'H' ? 10 : 16} fill={col as string} stroke={TINTA} /><T x={pp[0]} y={pp[1] + 4} t={t as string} s={10} c={t === 'H' ? TINTA : '#fff'} /></g>
      })}
      {[c1, c2].map((c, k) => <circle key={k} cx={c[0]} cy={c[1] + (giro ? 0 : 4)} r="14" fill={TINTA} />)}
      <style>{'@keyframes giro-ct { from { transform: rotateX(0deg) } to { transform: rotateX(360deg) } }'}</style>
      <T x={200} y={40} t={['Enlace sencillo: un extremo gira', 'cis-2-buteno: los CH₃ del mismo lado', 'trans-2-buteno: los CH₃ en lados opuestos'][i]} s={15} c={[TINTA, AZUL, ROJO][i]} />
      <T x={200} y={260} t={giro ? 'Alrededor del sencillo, los grupos dan vueltas libremente' : 'El doble enlace no gira: cis y trans son sustancias distintas'} s={12} peso={600} />
    </Lienzo>
  )
}

const AD = ['eteno', 'bromo', 'producto']

export function EscenaAlqAdicion({ fase }: { fase: string }) {
  const i = idx(AD, fase)
  const eteno = MOLS.eteno(180, 150)
  const dibromo = construir([['C', 180, 150], ['C', 220, 150], ['Br', 180, 105], ['Br', 220, 195]], [[0, 1], [0, 2], [1, 3]], 'todos', 26)
  return (
    <Lienzo etiqueta={`Adición de bromo al eteno: ${fase}`}>
      <g style={ver(i < 2)}><Molecula mol={eteno} s={1.2} /></g>
      <g style={ver(i === 1)}>
        <g style={{ transition: suave }}><Molecula mol={construir([['Br', 290, 80], ['Br', 330, 80]], [[0, 1]], 'no')} s={1.1} /></g>
        <path d="M290 100 q-40 20 -80 35" fill="none" stroke={ROJO} strokeWidth="2" strokeDasharray="4 3" />
      </g>
      <g style={ver(i === 2)}><Molecula mol={dibromo} s={1.2} /></g>
      <rect x="40" y="200" width="50" height="60" rx="6" fill={i === 2 ? '#f1f1f1' : '#b5651d'} opacity="0.85" stroke={TINTA} style={{ transition: 'all 1.2s' }} />
      <T x={65} y={278} t="agua de bromo" s={10} peso={600} />
      <T x={200} y={40} t={['CH₂=CH₂', 'CH₂=CH₂ + Br₂', 'CH₂Br–CH₂Br (1,2-dibromoetano)'][i]} s={16} c={[TINTA, ROJO, VERDE][i]} />
      <T x={230} y={262} t={['El enlace π del doble se rompe con facilidad', 'Un Br para cada carbono del doble', 'El color café desaparece: hay insaturación'][i]} s={12} />
    </Lienzo>
  )
}

const PO = ['monomeros', 'abren', 'cadena']

export function EscenaAlqPolimero({ fase }: { fase: string }) {
  const i = idx(PO, fase)
  const n = 5
  return (
    <Lienzo etiqueta={`Polimerización del etileno: ${fase}`}>
      {Array.from({ length: n }, (_, k) => {
        const sep = i === 0 ? 75 : i === 1 ? 70 : 56
        const x = 200 - ((n - 1) * sep) / 2 + k * sep - 20
        const y = i === 0 ? 130 + (k % 2) * 40 : 150
        const m = construir(cadena(2, x, y, 28, [i === 0 ? 2 : 1]).at, cadena(2, x, y, 28, [i === 0 ? 2 : 1]).en, 'todos', 18)
        return <g key={k} style={{ transition: suave }}><Molecula mol={m} s={0.75} /></g>
      })}
      <g style={ver(i === 2)}>
        {Array.from({ length: n - 1 }, (_, k) => {
          const x = 200 - ((n - 1) * 56) / 2 + k * 56 - 20 + 28
          return <line key={k} x1={x} y1="150" x2={x + 28} y2="150" stroke={VERDE} strokeWidth="3" />
        })}
        <T x={22} y={155} t="…" s={20} /><T x={378} y={155} t="…" s={20} />
      </g>
      <g style={ver(i === 1)}>{Array.from({ length: n }, (_, k) => <circle key={k} cx={200 - 140 + k * 70 - 26} cy="150" r="5" fill={ROJO} />)}</g>
      <T x={200} y={40} t={['n CH₂=CH₂', 'Se abren los dobles enlaces', '–(CH₂–CH₂)ₙ–  polietileno'][i]} s={16} c={[TINTA, ROJO, VERDE][i]} />
      <T x={200} y={255} t={['Monómeros: moléculas pequeñas de etileno', 'Cada carbono queda con un enlace libre', 'Miles de unidades en una sola cadena: bolsas y envases'][i]} s={12} />
    </Lienzo>
  )
}

const MEC = ['homolisis', 'heterolisis', 'electrofilica']

function Atomo({ x, y, s, c, e = '' }: { x: number; y: number; s: string; c: string; e?: string }) {
  return (
    <g style={{ transition: suave }}>
      <circle cx={x} cy={y} r="20" fill={c} stroke={TINTA} strokeWidth="2" />
      <T x={x} y={y + 5} t={s} s={14} c="#fff" />
      {e && <T x={x + 24} y={y - 14} t={e} s={16} c={ROJO} />}
    </g>
  )
}

export function EscenaAlqMecanismo({ fase }: { fase: string }) {
  const i = idx(MEC, fase)
  return (
    <Lienzo etiqueta={`Mecanismos de reacción: ${fase}`}>
      <g style={ver(i === 0)}>
        <T x={60} y={70} t="☀️ luz UV" s={13} />
        <Atomo x={i === 0 ? 150 : 175} y={140} s="Cl" c={VERDE} e="•" />
        <Atomo x={i === 0 ? 250 : 225} y={140} s="Cl" c={VERDE} e="•" />
        <T x={200} y={195} t="Cl–Cl  →  Cl•  +  Cl•" s={15} c={ROJO} />
      </g>
      <g style={ver(i === 1)}>
        <Atomo x={150} y={140} s="H" c={AZUL} e="+" />
        <Atomo x={250} y={140} s="Br" c="#9a5a2a" e="−" />
        <T x={250} y={105} t=":" s={18} c={ROJO} />
        <T x={200} y={195} t="H–Br  →  H⁺  +  Br⁻" s={15} c={ROJO} />
      </g>
      <g style={ver(i === 2)}>
        <T x={200} y={95} t="1) CH₂=CH₂ + H⁺  →  CH₃–CH₂⁺" s={14} />
        <T x={200} y={118} t="el doble enlace ataca al H⁺ (electrófilo)" s={10} peso={600} c={AZUL} />
        <T x={200} y={152} t="2) CH₃–CH₂⁺ + Br⁻  →  CH₃–CH₂Br" s={14} />
        <T x={200} y={175} t="el Br⁻ (nucleófilo) cierra la reacción" s={10} peso={600} c={VERDE} />
        <T x={200} y={205} t="CH₃–CH₂⁺ es un carbocatión: dura un instante" s={11} c={ROJO} />
      </g>
      <T x={200} y={40} t={['Homólisis: radicales libres', 'Heterólisis: iones', 'Adición electrofílica, paso a paso'][i]} s={16} c={[VERDE, AZUL, TINTA][i]} />
      <T x={200} y={250} t={['Cada átomo se lleva uno de los dos electrones del enlace', 'Un átomo se lleva los dos electrones; el otro queda sin ninguno', 'El mecanismo cuenta qué enlaces se rompen y se forman, y en qué orden'][i]} s={12} />
      <T x={200} y={272} t={['El radical (•) es muy reactivo: así empiezan la cloración del metano y el daño al ozono', 'Pasa en solventes polares; el átomo más electronegativo se queda con el par', 'Un mecanismo no se ve: se deduce de los productos y de la velocidad'][i]} s={10} peso={600} />
    </Lienzo>
  )
}
