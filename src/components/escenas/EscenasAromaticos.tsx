// Escenas vivas de Química orgánica, tema 5: aromáticos y halogenuros.
import { Molecula, construir, hexagono, fuera, Lienzo, T, ver, idx, suave, ROJO, AZUL, VERDE, TINTA } from './Molecula.tsx'

function Anillo({ cx, cy, r = 45, dobles = 0, circulo = false, color = TINTA }: { cx: number; cy: number; r?: number; dobles?: 0 | 1 | 2; circulo?: boolean; color?: string }) {
  const p = hexagono(cx, cy, r)
  return (
    <g>
      <polygon points={p.map((q) => q.join(',')).join(' ')} fill="none" stroke={color} strokeWidth="3" />
      {dobles > 0 && [0, 2, 4].map((k) => {
        const a = p[(k + dobles - 1) % 6], b = p[(k + dobles) % 6]
        const m = (t: number[]) => [cx + (t[0] - cx) * 0.78, cy + (t[1] - cy) * 0.78]
        const [a2, b2] = [m(a), m(b)]
        return <line key={k} x1={a2[0]} y1={a2[1]} x2={b2[0]} y2={b2[1]} stroke={color} strokeWidth="3" />
      })}
      {circulo && <circle cx={cx} cy={cy} r={r * 0.6} fill="none" stroke={color} strokeWidth="3" />}
    </g>
  )
}

const KE = ['serpiente', 'kekule', 'resonancia', 'circulo']

export function EscenaKekule({ fase }: { fase: string }) {
  const i = idx(KE, fase)
  return (
    <Lienzo etiqueta={`El benceno de Kekulé: ${fase}`}>
      <g style={ver(i === 0)}>
        <circle cx="200" cy="140" r="60" fill="none" stroke={VERDE} strokeWidth="14" strokeLinecap="round" strokeDasharray="330 50" />
        <circle cx="244" cy="96" r="12" fill={VERDE} /><circle cx="248" cy="92" r="2.5" fill="#fff" />
        <T x={200} y={240} t="1865: Kekulé contó que soñó con una serpiente que se mordía la cola" s={12} />
      </g>
      <g style={ver(i === 1)}>
        <Molecula mol={construir(hexagono(200, 140, 45).map(([x, y]) => ['C', x, y] as [string, number, number]), [[0, 1, 2], [1, 2], [2, 3, 2], [3, 4], [4, 5, 2], [5, 0]], 'todos', 30)} />
        <T x={200} y={250} t="C₆H₆: anillo de 6 carbonos con dobles alternados" s={13} />
      </g>
      <g style={ver(i === 2)}>
        <Anillo cx={120} cy={140} dobles={1} /><Anillo cx={280} cy={140} dobles={2} />
        <T x={200} y={146} t="⟷" s={28} c={ROJO} />
        <T x={200} y={240} t="Los dobles no están quietos: las dos formas se alternan" s={13} />
      </g>
      <g style={ver(i === 3)}>
        <Anillo cx={200} cy={140} r={55} circulo color={AZUL} />
        <T x={200} y={240} t="Los 6 electrones π se reparten por todo el anillo" s={13} c={AZUL} />
        <T x={200} y={262} t="Los 6 enlaces son iguales: por eso es tan estable" s={12} peso={600} />
      </g>
    </Lienzo>
  )
}

const OM = ['orto', 'meta', 'para']

export function EscenaOrtoMetaPara({ fase }: { fase: string }) {
  const i = idx(OM, fase)
  const cx = 200, cy = 140
  const pos2 = [1, 2, 3][i]
  const p1 = fuera(cx, cy, 0, 75), p2 = fuera(cx, cy, pos2, 75)
  return (
    <Lienzo etiqueta={`Benceno disustituido: ${fase}`}>
      <Anillo cx={cx} cy={cy} r={45} circulo />
      {hexagono(cx, cy, 45).map(([x, y], k) => <T key={k} x={cx + (x - cx) * 0.55} y={cy + (y - cy) * 0.55 + 4} t={String(k + 1)} s={10} c={AZUL} />)}
      {[p1, p2].map((p, k) => {
        const v = hexagono(cx, cy, 45)[k === 0 ? 0 : pos2]
        return (
          <g key={k} style={{ transition: suave }}>
            <line x1={v[0]} y1={v[1]} x2={p[0]} y2={p[1]} stroke={TINTA} strokeWidth="3" style={{ transition: suave }} />
            <circle cx={p[0]} cy={p[1]} r="14" fill="#5aa84a" stroke={TINTA} style={{ transition: suave }} />
            <text x={p[0]} y={p[1] + 4} textAnchor="middle" fontSize="10" fontWeight="800" fill="#fff" style={{ transition: suave }}>Cl</text>
          </g>
        )
      })}
      <T x={200} y={36} t={['orto-diclorobenceno (1,2)', 'meta-diclorobenceno (1,3)', 'para-diclorobenceno (1,4)'][i]} s={16} c={ROJO} />
      <T x={200} y={265} t={['Vecinos', 'Separados por un carbono', 'Opuestos: el de las pastillas para baños'][i]} s={12} />
    </Lienzo>
  )
}

const CF = ['aerosol', 'sube', 'rompe', 'ciclo', 'montreal']

export function EscenaCfc({ fase }: { fase: string }) {
  const i = idx(CF, fase)
  const y = [230, 120, 90, 90, 90][i]
  const cfc = (x: number, yy: number) => construir([['C', x, yy], ['Cl', x - 24, yy], ['Cl', x + 24, yy], ['F', x, yy - 24], ['F', x, yy + 24]], [[0, 1], [0, 2], [0, 3], [0, 4]], 'no')
  return (
    <Lienzo etiqueta={`Los CFC y el ozono: ${fase}`} fondo="#e3eef8">
      <rect x="-50" y="60" width="500" height="50" fill="#b9d3ee" opacity={i === 4 ? 0.9 : i >= 3 ? 0.4 : 0.8} style={{ transition: suave }} />
      <T x={360} y={80} t="capa de ozono" s={10} c={AZUL} />
      <rect x="-50" y="250" width="500" height="60" fill="#8fbf6f" />
      <g style={ver(i === 0)}><rect x="60" y="200" width="26" height="50" rx="6" fill="#c43c3c" /><rect x="66" y="192" width="14" height="10" fill="#666" /><text x="140" y="245" fontSize="36" textAnchor="middle">🧊</text></g>
      <g style={{ ...ver(i < 2), transition: suave, transform: `translate(0px, ${y - 230}px)` }}><Molecula mol={cfc(220, 230)} s={0.8} /></g>
      <g style={ver(i === 2 || i === 3)}>
        <text x="60" y="40" fontSize="32">☀️</text>
        <path d="M90 40 L180 80" stroke="#c48a00" strokeWidth="3" strokeDasharray="6 4" />
        <Molecula mol={construir([['C', 200, 90], ['Cl', 176, 90], ['F', 200, 66], ['F', 200, 114]], [[0, 1], [0, 2], [0, 3]], 'no')} s={0.8} opacidad={i === 2 ? 1 : 0.3} />
        <circle cx={i === 3 ? 290 : 248} cy="90" r="11" fill="#5aa84a" stroke={TINTA} style={{ transition: suave }} />
        <T x={i === 3 ? 290 : 248} y={94} t="Cl" s={10} c="#fff" />
      </g>
      <g style={ver(i === 3)}>
        {[[260, 140], [320, 150], [300, 190]].map(([x, yy], k) => (
          <g key={k} opacity="0.85"><circle cx={x} cy={yy} r="8" fill="#e2685c" /><circle cx={x + 13} cy={yy} r="8" fill="#e2685c" /><circle cx={x + 6} cy={yy - 11} r="8" fill="#e2685c" /></g>
        ))}
        <T x={300} y={225} t="Cl + O₃ → ClO + O₂ … y el Cl queda libre otra vez" s={11} c={ROJO} />
      </g>
      <g style={ver(i === 4)}>
        <T x={200} y={170} t="🤝 1987" s={30} />
        <T x={200} y={205} t="Los países acordaron dejar de fabricar CFC" s={13} c={VERDE} />
      </g>
      <T x={200} y={30} t={['Los CFC no reaccionan aquí abajo', 'Suben muy despacio a la estratosfera', 'La luz ultravioleta rompe el CFC', 'Un solo Cl destruye miles de moléculas de ozono', 'Protocolo de Montreal: la capa se recupera'][i]} s={14} />
    </Lienzo>
  )
}
