// Escenas vivas de Química, área 4, tema 9 (opcional): propiedades coligativas.

const suave = 'all 1.1s cubic-bezier(.45,.05,.25,1)'
const ver = (si: boolean) => ({ transition: 'opacity 0.7s ease', opacity: si ? 1 : 0 })
const idx = (orden: string[], fase: string) => Math.max(0, orden.indexOf(fase))

const TINTA = '#3a3a3a'
const AZUL = '#3f6fb8'
const ROJO = '#c43c3c'
const VERDE = '#4f8a3c'
const AGUA = '#d7eaf7'
const O = '#e2685c'

function T({ x, y, t, c = TINTA, s = 12, peso = 800 }: { x: number; y: number; t: string; c?: string; s?: number; peso?: number }) {
  return <text x={x} y={y} textAnchor="middle" fontSize={s} fontWeight={peso} fill={c}>{t}</text>
}

/* ── Raoult: el soluto estorba en la superficie ───────────────────────── */

const RA = ['pura', 'soluto', 'resultado']

export function EscenaRaoult({ fase }: { fase: string }) {
  const i = idx(RA, fase)
  const sup = Array.from({ length: 10 }, (_, k) => k)
  const tapados = i >= 1 ? [1, 4, 7] : []
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Presión de vapor y soluto: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#f4f1ea" />
      <rect x="60" y="130" width="280" height="90" fill={AGUA} stroke={TINTA} strokeWidth="2" />
      {sup.map((k) => tapados.includes(k)
        ? <circle key={k} cx={75 + k * 28} cy="138" r="9" fill="#a17fd1" />
        : (
          <g key={k}>
            <circle cx={75 + k * 28} cy="138" r="6" fill={O} />
            {k % 2 === 0 && (
              <circle cx={75 + k * 28} cy="138" r="5" fill={O} opacity="0.7">
                <animate attributeName="cy" values="138;60" dur={`${1.4 + (k % 3) * 0.3}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0" dur={`${1.4 + (k % 3) * 0.3}s`} repeatCount="indefinite" />
              </circle>
            )}
          </g>
        ))}
      {i >= 1 && Array.from({ length: 6 }, (_, k) => <circle key={k} cx={90 + k * 45} cy={175 + (k % 2) * 20} r="9" fill="#a17fd1" />)}
      <T x={200} y={40} t={['Agua pura: muchas moléculas escapan de la superficie', 'Con soluto: algunas partículas ocupan la superficie', 'Menos vapor: baja la presión de vapor'][i]} s={13} />
      <g style={ver(i === 2)}>
        <T x={200} y={250} t="Hierve más arriba de 100 °C y se congela más abajo de 0 °C" s={12} c={VERDE} />
        <T x={200} y={272} t="Solo importa CUÁNTAS partículas hay, no cuáles" s={12} c={ROJO} />
      </g>
    </svg>
  )
}

/* ── Ebullición y congelación con soluto ──────────────────────────────── */

const EC = ['hervir', 'helado', 'carretera']

export function EscenaEbullicionCongelacion({ fase }: { fase: string }) {
  const i = idx(EC, fase)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Ascenso ebulloscópico y descenso crioscópico: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill={i === 2 ? '#e8eef4' : '#f4f1ea'} style={{ transition: suave }} />
      <g style={ver(i === 0)}>
        {[[100, 'agua pura', '100 °C'], [290, 'agua con mucha sal', '≈ 102 °C']].map(([x, n, t]) => (
          <g key={String(n)}>
            <rect x={Number(x) - 55} y="110" width="110" height="80" rx="6" fill="#888" />
            <rect x={Number(x) - 51} y="120" width="102" height="66" fill={AGUA} />
            {Array.from({ length: 5 }, (_, k) => <circle key={k} cx={Number(x) - 40 + k * 20} cy="180" r="3" fill="#fff"><animate attributeName="cy" values="182;124" dur={`${0.8 + k * 0.15}s`} repeatCount="indefinite" /></circle>)}
            {[-20, 0, 20].map((d) => <path key={d} d={`M${Number(x) + d} 222 q-6 -10 0 -18 q6 -8 0 -16`} fill="#f6a33c" />)}
            <T x={Number(x)} y={95} t={String(t)} s={16} c={ROJO} />
            <T x={Number(x)} y={245} t={String(n)} s={11} peso={600} />
          </g>
        ))}
        <T x={200} y={278} t="Ascenso ebulloscópico: el soluto sube el punto de ebullición" s={12} />
      </g>
      <g style={ver(i === 1)}>
        <rect x="100" y="90" width="200" height="120" rx="12" fill="#c9d6e2" stroke={TINTA} strokeWidth="2" />
        {Array.from({ length: 16 }, (_, k) => <rect key={k} x={110 + (k % 8) * 23} y={100 + Math.floor(k / 8) * 85} width="16" height="14" rx="3" fill="#eef6fb" stroke="#9bb" />)}
        {Array.from({ length: 30 }, (_, k) => <rect key={k} x={112 + ((k * 37) % 180)} y={118 + ((k * 13) % 65)} width="3" height="3" fill="#fff" />)}
        <rect x="170" y="110" width="60" height="80" rx="8" fill="#f2c6d0" stroke={TINTA} />
        <T x={200} y={155} t="leche" s={11} />
        <T x={200} y={70} t="hielo + sal: ≈ −10 °C" s={15} c={AZUL} />
        <T x={200} y={245} t="Helado casero: la sal hace que el hielo se derrita bajo 0 °C" s={12} />
        <T x={200} y={267} t="y la mezcla queda más fría que el hielo solo" s={11} peso={600} />
      </g>
      <g style={ver(i === 2)}>
        <rect x="0" y="180" width="400" height="40" fill="#777" />
        <rect x="0" y="176" width="400" height="6" fill="#f4fbff" opacity="0.8" />
        {Array.from({ length: 40 }, (_, k) => <rect key={k} x={(k * 37) % 400} y={174 + (k % 3)} width="3" height="3" fill="#fff" />)}
        <rect x="140" y="130" width="120" height="45" rx="8" fill={ROJO} /><circle cx="165" cy="178" r="10" fill={TINTA} /><circle cx="235" cy="178" r="10" fill={TINTA} />
        <T x={200} y={70} t="sal en las carreteras heladas · anticongelante en el radiador" s={12} />
        <T x={200} y={255} t="Descenso crioscópico: el soluto baja el punto de congelación" s={12} c={AZUL} />
      </g>
    </svg>
  )
}

/* ── Ósmosis ──────────────────────────────────────────────────────────── */

const OS = ['inicio', 'pasa', 'presion']

export function EscenaOsmosisU({ fase }: { fase: string }) {
  const i = idx(OS, fase)
  const izq = [150, 175, 175][i], der = [150, 125, 150][i]
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Ósmosis: ${fase}`} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#f4f1ea" />
      <path d="M120 40 V220 a30 30 0 0 0 30 30 h100 a30 30 0 0 0 30 -30 V40" fill="none" stroke={TINTA} strokeWidth="3" />
      <path d="M180 40 V200 h40 V40" fill="none" stroke={TINTA} strokeWidth="3" />
      <path d={`M122 ${izq} H178 V222 H122 Z`} fill={AGUA} style={{ transition: suave }} />
      <path d={`M222 ${der} H278 V222 H222 Z`} fill="#c9b8e6" style={{ transition: suave }} />
      <rect x="122" y="222" width="156" height="26" fill="#d0cbe6" />
      <line x1="200" y1="200" x2="200" y2="250" stroke={VERDE} strokeWidth="4" strokeDasharray="4 3" />
      {Array.from({ length: 5 }, (_, k) => <circle key={k} cx={235 + (k % 3) * 15} cy={190 - Math.floor(k / 3) * 20} r="6" fill="#7b5ab8" />)}
      <g style={ver(i === 1)}>
        <path d="M170 236 h50" stroke={AZUL} strokeWidth="3" markerEnd="url(#os-f)" />
        <T x={200} y={275} t="El agua pasa hacia donde hay más soluto" s={13} c={AZUL} />
      </g>
      <g style={ver(i === 2)}>
        <rect x="224" y={der - 18} width="52" height="14" fill="#9aa1a8" />
        <path d={`M250 ${der - 50} v28`} stroke={ROJO} strokeWidth="3" markerEnd="url(#os-r)" />
        <T x={200} y={275} t="Presión osmótica: la que hay que hacer para detenerla" s={13} c={ROJO} />
      </g>
      <g style={ver(i === 0)}><T x={200} y={275} t="Agua pura | membrana semipermeable | agua con azúcar" s={12} /></g>
      <T x={150} y={30} t="agua" s={11} c={AZUL} /><T x={250} y={30} t="solución" s={11} c="#7b5ab8" />
      <T x={330} y={240} t="membrana" s={10} c={VERDE} />
      <defs>
        <marker id="os-f" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill={AZUL} /></marker>
        <marker id="os-r" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill={ROJO} /></marker>
      </defs>
    </svg>
  )
}
