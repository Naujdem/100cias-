// Escenas vivas de Química, área 2, tema 7: geometría molecular y fuerzas intermoleculares.

const suave = 'transform 1.1s cubic-bezier(.45,.05,.25,1), opacity 0.7s ease'
const ver = (si: boolean, mover = 'none', quieto = 'none') => ({ transition: suave, opacity: si ? 1 : 0, transform: si ? mover : quieto })
const fondo = (color: string) => <rect x="-1500" y="-1500" width="3400" height="3300" fill={color} style={{ transition: 'fill 0.8s' }} />
const idx = (orden: string[], fase: string) => Math.max(0, orden.indexOf(fase))

const TINTA = '#3a3a3a'
const AZUL = '#3f6fb8'
const ROJO = '#c43c3c'

function T({ x, y, t, c = TINTA, s = 12, peso = 800 }: { x: number; y: number; t: string; c?: string; s?: number; peso?: number }) {
  return <text x={x} y={y} textAnchor="middle" fontSize={s} fontWeight={peso} fill={c}>{t}</text>
}
/** Molécula de agua dibujada en (x, y), girada `a` grados. */
function Agua({ x, y, a = 0, cargas = false }: { x: number; y: number; a?: number; cargas?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${a})`}>
      <circle cx="0" cy="0" r="14" fill="#e06a5a" />
      <circle cx="-14" cy="12" r="8" fill="#f2f2f2" stroke="#999" />
      <circle cx="14" cy="12" r="8" fill="#f2f2f2" stroke="#999" />
      {cargas && <><text x="0" y="-17" textAnchor="middle" fontSize="10" fontWeight="800" fill={AZUL}>δ−</text><text x="0" y="32" textAnchor="middle" fontSize="10" fontWeight="800" fill={ROJO}>δ+</text></>}
    </g>
  )
}

/* ── Dentro y entre moléculas ─────────────────────────────────────────── */

const INTRA = ['dentro', 'entre', 'hervir']
const POS: [number, number, number][] = [[110, 100, 0], [170, 130, 120], [230, 95, 240], [140, 170, 60], [215, 175, 300], [280, 140, 180]]

export function EscenaIntra({ fase }: { fase: string }) {
  const i = idx(INTRA, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Dentro y entre moléculas: ${fase}`} className="h-full w-full">
      {fondo(i === 2 ? '#fdf1e6' : '#eef3f7')}
      {POS.map(([x, y, a], k) => (
        <g key={k} style={{ transition: suave, transform: i === 2 ? `translate(${(k - 2.5) * 22}px, ${-40 - (k % 3) * 20}px)` : 'none' }}>
          <Agua x={x} y={y} a={a} />
        </g>
      ))}
      <g style={ver(i === 1)}>
        <line x1="120" y1="110" x2="160" y2="125" stroke={AZUL} strokeWidth="2" strokeDasharray="3 3" />
        <line x1="185" y1="130" x2="222" y2="105" stroke={AZUL} strokeWidth="2" strokeDasharray="3 3" />
        <line x1="150" y1="160" x2="165" y2="140" stroke={AZUL} strokeWidth="2" strokeDasharray="3 3" />
        <line x1="225" y1="168" x2="270" y2="148" stroke={AZUL} strokeWidth="2" strokeDasharray="3 3" />
      </g>
      <g style={ver(i === 0)}><T x={200} y={250} t="Dentro de cada molécula: enlaces covalentes O–H (muy fuertes)" s={13} /></g>
      <g style={ver(i === 1)}><T x={200} y={250} t="Entre moléculas: fuerzas intermoleculares (más débiles)" s={13} c={AZUL} /></g>
      <g style={ver(i === 2)}>
        <T x={200} y={250} t="Al hervir se separan las moléculas, pero cada H₂O sigue entera:" s={12} />
        <T x={200} y={270} t="se rompen las fuerzas intermoleculares, no los enlaces" s={12} c={ROJO} />
      </g>
    </svg>
  )
}

/* ── Polaridad de las moléculas ───────────────────────────────────────── */

const POLAR = ['agua', 'co2']

export function EscenaPolaridad({ fase }: { fase: string }) {
  const i = idx(POLAR, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Polaridad de moléculas: ${fase}`} className="h-full w-full">
      <defs><marker id="po-f" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill={AZUL} /></marker></defs>
      {fondo('#f1eef6')}
      <g style={ver(i === 0)}>
        <circle cx="200" cy="100" r="30" fill="#e06a5a" /><T x={200} y={106} t="O" c="#fff" s={16} />
        <circle cx="150" cy="150" r="18" fill="#f2f2f2" stroke="#999" /><T x={150} y={155} t="H" s={13} />
        <circle cx="250" cy="150" r="18" fill="#f2f2f2" stroke="#999" /><T x={250} y={155} t="H" s={13} />
        <line x1="160" y1="140" x2="185" y2="115" stroke={AZUL} strokeWidth="2.5" markerEnd="url(#po-f)" />
        <line x1="240" y1="140" x2="215" y2="115" stroke={AZUL} strokeWidth="2.5" markerEnd="url(#po-f)" />
        <line x1="200" y1="190" x2="200" y2="75" stroke={ROJO} strokeWidth="4" markerEnd="url(#po-f)" />
        <T x={200} y={230} t="Agua (angular): las dos flechas suman hacia el oxígeno" s={13} />
        <T x={200} y={250} t="→ molécula POLAR, con un lado − y otro +" s={13} c={ROJO} />
      </g>
      <g style={ver(i === 1)}>
        <circle cx="200" cy="120" r="22" fill="#555" /><T x={200} y={126} t="C" c="#fff" s={15} />
        <circle cx="120" cy="120" r="26" fill="#e06a5a" /><T x={120} y={126} t="O" c="#fff" s={15} />
        <circle cx="280" cy="120" r="26" fill="#e06a5a" /><T x={280} y={126} t="O" c="#fff" s={15} />
        <line x1="180" y1="100" x2="140" y2="100" stroke={AZUL} strokeWidth="2.5" markerEnd="url(#po-f)" />
        <line x1="220" y1="100" x2="260" y2="100" stroke={AZUL} strokeWidth="2.5" markerEnd="url(#po-f)" />
        <T x={200} y={180} t="= 0" s={20} c={ROJO} />
        <T x={200} y={230} t="CO₂ (lineal): las flechas son iguales y opuestas, se anulan" s={13} />
        <T x={200} y={250} t="→ molécula APOLAR, aunque sus enlaces son polares" s={13} c={ROJO} />
      </g>
    </svg>
  )
}

/* ── Las tres fuerzas intermoleculares ────────────────────────────────── */

const FUERZAS = ['london', 'dipolo', 'puente', 'ebullicion']

export function EscenaFuerzas({ fase }: { fase: string }) {
  const i = idx(FUERZAS, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Fuerzas intermoleculares: ${fase}`} className="h-full w-full">
      {fondo('#eef4ee')}
      <g style={ver(i === 0)}>
        <ellipse cx="140" cy="120" rx="45" ry="35" fill="#dfe9f5" /><ellipse cx="260" cy="120" rx="45" ry="35" fill="#dfe9f5" />
        <ellipse cx="125" cy="120" rx="22" ry="25" fill={AZUL} opacity="0.35" />
        <ellipse cx="245" cy="120" rx="22" ry="25" fill={AZUL} opacity="0.35" />
        <T x={120} y={95} t="δ−" c={AZUL} s={12} /><T x={165} y={95} t="δ+" c={ROJO} s={12} />
        <T x={240} y={95} t="δ−" c={AZUL} s={12} /><T x={285} y={95} t="δ+" c={ROJO} s={12} />
        <T x={200} y={200} t="London: los electrones se amontonan un instante a un lado" s={12} />
        <T x={200} y={220} t="y crean dipolos pasajeros. Están en TODAS las moléculas" s={12} />
        <T x={200} y={250} t="(son las únicas en las apolares: O₂, CH₄, gasolina)" s={11} peso={600} />
      </g>
      <g style={ver(i === 1)}>
        {[0, 1, 2].map((k) => (
          <g key={k}>
            <rect x={70 + k * 95} y="100" width="70" height="36" rx="18" fill="#f2f2f2" stroke="#999" />
            <T x={85 + k * 95} y={124} t="H" s={13} /><T x={122 + k * 95} y={124} t="Cl" s={13} c="#4f8a3c" />
            <T x={85 + k * 95} y={95} t="δ+" s={11} c={ROJO} /><T x={122 + k * 95} y={95} t="δ−" s={11} c={AZUL} />
          </g>
        ))}
        <T x={200} y={200} t="Dipolo-dipolo: moléculas polares que se alinean," s={12} />
        <T x={200} y={220} t="el lado − de una atrae el lado + de la otra (HCl)" s={12} />
      </g>
      <g style={ver(i === 2)}>
        <Agua x={140} y={110} a={0} cargas />
        <Agua x={230} y={150} a={70} cargas />
        <line x1="154" y1="124" x2="218" y2="145" stroke={AZUL} strokeWidth="2.5" strokeDasharray="4 3" />
        <T x={200} y={215} t="Puente de hidrógeno: un H unido a O, N o F" s={12} />
        <T x={200} y={235} t="es atraído por el O, N o F de otra molécula. ¡La más fuerte!" s={12} />
      </g>
      <g style={ver(i === 3)}>
        {[['CH₄', -161, 'London'], ['H₂S', -60, 'dipolo'], ['H₂O', 100, 'puentes de H']].map(([s, t, f], k) => {
          const h = ((t as number) + 180) * 0.55
          return (
            <g key={s as string}>
              <rect x={70 + k * 100} y={200 - h} width="60" height={h} fill={k === 2 ? AZUL : '#9bb0c6'} />
              <T x={100 + k * 100} y={195 - h} t={`${t} °C`} s={12} />
              <T x={100 + k * 100} y={218} t={s as string} s={13} />
              <T x={100 + k * 100} y={234} t={f as string} s={10} peso={600} />
            </g>
          )
        })}
        <T x={200} y={268} t="Punto de ebullición: más fuerza entre moléculas → hierve a más temperatura" s={11} peso={600} />
      </g>
    </svg>
  )
}

/* ── Semejante disuelve a semejante ───────────────────────────────────── */

const SOLUBLE = ['aceite', 'sal', 'adn']

export function EscenaSoluble({ fase }: { fase: string }) {
  const i = idx(SOLUBLE, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Solubilidad: ${fase}`} className="h-full w-full">
      {fondo('#eef3f7')}
      <g style={ver(i < 2)}>
        <path d="M 140 40 L 140 220 Q 140 235 155 235 L 245 235 Q 260 235 260 220 L 260 40" fill="none" stroke="#9bb0c6" strokeWidth="3" />
        <rect x="142" y={i === 0 ? 120 : 70} width="116" height={i === 0 ? 113 : 163} fill="#bcd9f0" style={{ transition: suave }} />
        <g style={ver(i === 0)}><rect x="142" y="80" width="116" height="40" fill="#f2d84b" opacity="0.85" /><T x={200} y={105} t="aceite (apolar)" s={11} /></g>
        <T x={200} y={185} t="agua (polar)" s={11} />
        <g style={ver(i === 1)}>
          {Array.from({ length: 10 }, (_, k) => <circle key={k} cx={155 + (k % 5) * 22} cy={110 + Math.floor(k / 5) * 40} r="5" fill={k % 2 ? ROJO : '#4f8a3c'} />)}
        </g>
        <T x={200} y={265} t={i === 0 ? 'Agua y aceite no se mezclan: polar y apolar no se atraen' : 'La sal (iónica) se disuelve: el agua rodea a cada ion'} s={12} />
      </g>
      <g style={ver(i === 2)}>
        {Array.from({ length: 7 }, (_, k) => (
          <g key={k}>
            <line x1="130" y1={50 + k * 28} x2="190" y2={50 + k * 28} stroke="#f4a07a" strokeWidth="8" />
            <line x1="210" y1={50 + k * 28} x2="270" y2={50 + k * 28} stroke="#9fc3ec" strokeWidth="8" />
            <line x1="190" y1={50 + k * 28} x2="210" y2={50 + k * 28} stroke={AZUL} strokeWidth="2" strokeDasharray="3 2" />
          </g>
        ))}
        <path d="M 125 40 L 125 240 M 275 40 L 275 240" stroke="#8a5a34" strokeWidth="6" />
        <T x={200} y={265} t="Puentes de hidrógeno unen las dos cadenas del ADN" s={12} />
        <T x={200} y={283} t="(fuertes juntos, pero se abren para copiar el ADN)" s={11} peso={600} />
      </g>
    </svg>
  )
}
