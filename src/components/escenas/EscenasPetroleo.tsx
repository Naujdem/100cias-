// Escenas vivas de Química orgánica, tema 9 (opcional): petróleo, plásticos y biocombustibles.
import { Lienzo, T, ver, idx, suave, ROJO, AZUL, VERDE, TINTA } from './Molecula.tsx'

const OR = ['mar', 'entierro', 'coccion', 'trampa']

export function EscenaPetroleoOrigen({ fase }: { fase: string }) {
  const i = idx(OR, fase)
  const capas = i === 0 ? 0 : i === 1 ? 2 : 4
  return (
    <Lienzo etiqueta={`Origen del petróleo: ${fase}`} fondo={i === 0 ? '#cfe6f5' : '#e9dfcc'}>
      <g style={ver(i === 0)}>
        <rect x="-50" y="60" width="500" height="160" fill="#7fb6dc" />
        {Array.from({ length: 14 }, (_, k) => <circle key={k} cx={30 + k * 26} cy={90 + (k % 4) * 25} r="3" fill="#4f8a3c"><animate attributeName="cy" values={`${90 + (k % 4) * 25};215`} dur={`${4 + (k % 3)}s`} repeatCount="indefinite" /></circle>)}
      </g>
      <rect x="-50" y="220" width="500" height="20" fill="#3d3324" style={{ transition: suave, transform: `translateY(${-capas * 22}px)` }} />
      {Array.from({ length: capas }, (_, k) => <rect key={k} x="-50" y={198 - k * 22 + capas * 0} width="500" height="22" fill={['#c9b28a', '#b39b74', '#d8c59c', '#a68d64'][k % 4]} style={{ transition: suave }} />)}
      <g style={ver(i === 2)}>
        <T x={200} y={60} t="⬇ presión" s={14} c={TINTA} />
        <T x={200} y={290} t="🔥 calor de la profundidad" s={12} c={ROJO} />
        <rect x="-50" y="220" width="500" height="20" fill="#1f1a12" />
      </g>
      <g style={ver(i === 3)}>
        <path d="M60 230 Q200 80 340 230 Z" fill="#8c7a5b" />
        <path d="M100 230 Q200 120 300 230 Z" fill="#d8c59c" />
        <path d="M140 205 Q200 150 260 205 Z" fill="#1f1a12" />
        <path d="M150 180 Q200 140 250 180 Z" fill="#e0e6ea" />
        <T x={200} y={172} t="gas" s={10} /><T x={200} y={198} t="petróleo" s={10} c="#fff" />
        <T x={200} y={110} t="roca sello (impermeable)" s={10} c="#fff" />
      </g>
      <T x={200} y={34} t={['Hace millones de años: plancton en el mar', 'Se entierra en el fondo, sin oxígeno', 'Presión y calor por millones de años', 'El petróleo queda atrapado bajo una roca sello'][i]} s={14} c={[AZUL, TINTA, ROJO, VERDE][i]} />
    </Lienzo>
  )
}

const BI = ['cana', 'palma', 'ciclo', 'debate']

export function EscenaBiocombustibles({ fase }: { fase: string }) {
  const i = idx(BI, fase)
  return (
    <Lienzo etiqueta={`Biocombustibles: ${fase}`}>
      <g style={ver(i === 0)}>
        {[40, 60, 80].map((x) => <rect key={x} x={x} y="90" width="8" height="120" rx="3" fill="#8fb35a" />)}
        {['🍯 jugo', '🦠 fermentación', '🔥 destilación', '⛽ + gasolina'].map((t, k) => <T key={k} x={140 + k * 70} y={160} t={t} s={11} />)}
        <T x={200} y={240} t="Bioetanol de caña (valle del río Cauca)" s={13} c={VERDE} />
      </g>
      <g style={ver(i === 1)}>
        <text x="70" y="180" fontSize="60" textAnchor="middle">🌴</text>
        <T x={240} y={130} t="aceite (triglicérido) + 3 metanol" s={13} />
        <T x={240} y={160} t="↓" s={18} c={ROJO} />
        <T x={240} y={190} t="3 ésteres metílicos (biodiésel) + glicerina" s={13} c={VERDE} />
        <T x={200} y={240} t="Se mezcla con el ACPM" s={13} />
      </g>
      <g style={ver(i === 2)}>
        <circle cx="200" cy="150" r="80" fill="none" stroke={VERDE} strokeWidth="4" strokeDasharray="10 6" />
        <text x="200" y="85" fontSize="34" textAnchor="middle">🌱</text>
        <text x="200" y="245" fontSize="34" textAnchor="middle">🚚</text>
        <T x={300} y={155} t="CO₂ →" s={13} c={ROJO} /><T x={100} y={155} t="← CO₂" s={13} c={VERDE} />
        <T x={200} y={155} t="la planta toma lo que el motor suelta" s={11} peso={600} />
      </g>
      <g style={ver(i === 3)}>
        {[['🌳', 'Si se tumba bosque, el balance empeora'], ['💧', 'Usan mucha agua y tierra'], ['🌽', 'Pueden competir con los alimentos'], ['♻️', 'Mejor: residuos como bagazo o aceite usado']].map(([e, t], k) => (
          <g key={k}><text x="60" y={85 + k * 48} fontSize="28" textAnchor="middle">{e}</text><text x="90" y={80 + k * 48} fontSize="13" fontWeight="700" fill={TINTA}>{t}</text></g>
        ))}
      </g>
      <T x={200} y={36} t={['Bioetanol', 'Biodiésel: una transesterificación', 'Menos CO₂ nuevo en la atmósfera', 'No todo lo «bio» es automáticamente bueno'][i]} s={15} c={[VERDE, VERDE, AZUL, ROJO][i]} />
    </Lienzo>
  )
}
