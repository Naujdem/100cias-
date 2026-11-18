// Escenas vivas del área 3, tema 5 (Poblaciones): densidad, crecimiento y depredador–presa.

const suave = 'transform 1.1s cubic-bezier(.45,.05,.25,1), opacity 0.7s ease'
const ver = (si: boolean, mover = 'none', quieto = 'none') => ({ transition: suave, opacity: si ? 1 : 0, transform: si ? mover : quieto })
const fondo = (color: string) => <rect x="-1500" y="-1500" width="3400" height="3300" fill={color} style={{ transition: 'fill 0.8s' }} />

const VERDE = '#3f9a5a'
const AZUL = '#3f6fb8'
const ROJO = '#c43c3c'
const NARANJA = '#e08a2e'
const MOR = '#8a5aa8'
const TINTA = '#3a3a3a'

function Texto({ x, y, t, c = TINTA, s = 12, peso = 800 }: { x: number; y: number; t: string; c?: string; s?: number; peso?: number }) {
  return <text x={x} y={y} textAnchor="middle" fontSize={s} fontWeight={peso} fill={c}>{t}</text>
}

/* ── Tamaño y densidad ────────────────────────────────────────────────── */

const DEN = ['contar', 'cuadros', 'densidad', 'marcar']
// puntos «al azar» fijos (frailejones en una ladera)
const PUNTOS: [number, number][] = Array.from({ length: 48 }, (_, k) => [40 + ((k * 73) % 320), 70 + ((k * 151) % 190)])

export function EscenaDensidad({ fase }: { fase: string }) {
  const i = Math.max(0, DEN.indexOf(fase))
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Densidad de población: ${fase}`} className="h-full w-full">
      {fondo('#eef2e8')}
      <rect x="30" y="60" width="340" height="210" fill="#d9dcae" stroke="#a8a87a" strokeWidth="2" />
      {PUNTOS.map(([x, y], k) => (
        <g key={k}>
          <circle cx={x} cy={y} r="5" fill={VERDE} />
          {i === 3 && k % 6 === 0 && <circle cx={x} cy={y} r="8" fill="none" stroke={ROJO} strokeWidth="2" />}
        </g>
      ))}
      <g style={ver(i === 1 || i === 2)}>
        {[0, 1, 2, 3].map((k) => <rect key={k} x={[50, 160, 250, 300][k]} y={[80, 170, 90, 200][k]} width="50" height="50" fill="none" stroke={AZUL} strokeWidth="3" />)}
      </g>
      <rect x="10" y="8" width="380" height="44" rx="10" fill="#fff" opacity="0.92" />
      <g style={ver(i === 0)}><Texto x={200} y={36} t="¿Cuántos frailejones hay en esta ladera?" s={13} /></g>
      <g style={ver(i === 1)}><Texto x={200} y={28} t="Se cuentan en unos cuadros de muestra" s={12} /><Texto x={200} y={44} t="y se calcula para toda el área" s={11} peso={600} /></g>
      <g style={ver(i === 2)}><Texto x={200} y={28} t="Densidad = individuos ÷ área" c={MOR} s={13} /><Texto x={200} y={44} t="por ejemplo, 2 frailejones por metro cuadrado" s={11} peso={600} /></g>
      <g style={ver(i === 3)}><Texto x={200} y={28} t="Animales que se mueven: capturar, marcar, soltar" c={ROJO} s={12} /><Texto x={200} y={44} t="y volver a capturar para estimar cuántos hay" s={11} peso={600} /></g>
    </svg>
  )
}

/* ── Crecimiento: J y S ───────────────────────────────────────────────── */

const CRE = ['entradas', 'j', 's', 'carga']

export function EscenaCrecimiento({ fase }: { fase: string }) {
  const i = Math.max(0, CRE.indexOf(fase))
  const X0 = 60, Y0 = 250, W = 300, H = 180
  const jota = Array.from({ length: 41 }, (_, k) => `${X0 + (k / 40) * W},${Y0 - Math.min(H + 10, 4 * Math.exp(k * 0.1))}`).join(' ')
  const ese = Array.from({ length: 41 }, (_, k) => `${X0 + (k / 40) * W},${Y0 - (140 / (1 + 35 * Math.exp(-k * 0.22)))}`).join(' ')
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Crecimiento de poblaciones: ${fase}`} className="h-full w-full">
      {fondo('#f3f2ee')}
      <g style={ver(i === 0)}>
        <Texto x={200} y={36} t="¿Qué hace crecer o bajar una población?" s={13} />
        <circle cx="200" cy="155" r="58" fill="#fff" stroke={MOR} strokeWidth="3" />
        <Texto x={200} y={160} t="población" c={MOR} s={13} />
        {[['nacimientos', 200, 70, VERDE, '+'], ['llegadas', 70, 155, VERDE, '+'], ['muertes', 200, 250, ROJO, '−'], ['salidas', 330, 155, ROJO, '−']].map(([t, x, y, c, s]) => (
          <g key={t as string}><Texto x={x as number} y={(y as number) + 4} t={`${s} ${t}`} c={c as string} s={12} /></g>
        ))}
      </g>
      <g style={ver(i >= 1)}>
        <line x1={X0} y1={Y0} x2={X0 + W} y2={Y0} stroke={TINTA} strokeWidth="2" /><line x1={X0} y1={Y0} x2={X0} y2={Y0 - H - 20} stroke={TINTA} strokeWidth="2" />
        <Texto x={X0 + W / 2} y={Y0 + 22} t="tiempo →" s={10} peso={600} />
        <text x={X0 - 12} y={Y0 - H / 2} fontSize="10" fontWeight="600" fill={TINTA} transform={`rotate(-90 ${X0 - 12} ${Y0 - H / 2})`} textAnchor="middle">individuos</text>
        <polyline points={jota} fill="none" stroke={NARANJA} strokeWidth="4" style={{ transition: 'opacity 0.6s', opacity: i === 1 ? 1 : 0.3 }} />
        <polyline points={ese} fill="none" stroke={AZUL} strokeWidth="4" style={{ transition: 'opacity 0.6s', opacity: i >= 2 ? 1 : 0 }} />
        <g style={ver(i === 3)}><line x1={X0} x2={X0 + W} y1={Y0 - 140} y2={Y0 - 140} stroke={ROJO} strokeWidth="2" strokeDasharray="6 4" /><Texto x={X0 + W - 40} y={Y0 - 148} t="capacidad de carga" c={ROJO} s={10} /></g>
      </g>
      <g style={ver(i === 1)}><Texto x={200} y={30} t="Curva en J: con todo de sobra, crece cada vez más rápido" c={NARANJA} s={11} /></g>
      <g style={ver(i === 2)}><Texto x={200} y={30} t="Curva en S: al faltar recursos, el crecimiento se frena" c={AZUL} s={11} /></g>
      <g style={ver(i === 3)}><Texto x={200} y={30} t="El máximo que el ambiente puede sostener" c={ROJO} s={11} /></g>
    </svg>
  )
}

/* ── Depredador y presa ───────────────────────────────────────────────── */

const DP = ['muchas-presas', 'crecen-depredadores', 'bajan-presas', 'bajan-depredadores', 'ciclo']

export function EscenaDepredadorPresa({ fase }: { fase: string }) {
  const i = Math.max(0, DP.indexOf(fase))
  const n = [[9, 2], [9, 6], [3, 6], [3, 2], [6, 4]][i]
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Depredador y presa: ${fase}`} className="h-full w-full">
      {fondo('#f2f5ee')}
      <Texto x={200} y={30} t={['Hay muchos conejos de monte', '…así que los zorros tienen comida y aumentan', '…se comen tantos conejos que estos disminuyen', '…y sin comida, los zorros también bajan', 'Y vuelve a empezar: un ciclo'][i]} s={12} />
      {Array.from({ length: 9 }, (_, k) => <text key={`p${k}`} x={50 + (k % 3) * 46} y={100 + Math.floor(k / 3) * 50} fontSize="32" style={{ transition: 'opacity 0.6s', opacity: k < n[0] ? 1 : 0.1 }}>🐇</text>)}
      {Array.from({ length: 6 }, (_, k) => <text key={`d${k}`} x={250 + (k % 3) * 46} y={110 + Math.floor(k / 3) * 60} fontSize="34" style={{ transition: 'opacity 0.6s', opacity: k < n[1] ? 1 : 0.1 }}>🦊</text>)}
      <Texto x={110} y={270} t="presas" c={VERDE} s={12} /><Texto x={300} y={270} t="depredadores" c={ROJO} s={12} />
    </svg>
  )
}
