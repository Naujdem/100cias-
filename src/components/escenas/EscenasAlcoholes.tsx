// Escenas vivas de Química orgánica, tema 6: alcoholes, fenoles y éteres.
import { Molecula, construir, Lienzo, T, ver, idx, suave, ROJO, AZUL, VERDE, TINTA } from './Molecula.tsx'

const GU = ['cana', 'levadura', 'fermento', 'destilar']

export function EscenaGuarapo({ fase }: { fase: string }) {
  const i = idx(GU, fase)
  const nivel = [0, 0, 1, 1][i]
  return (
    <Lienzo etiqueta={`Fermentación del guarapo: ${fase}`}>
      <g style={ver(i === 0)}>
        {[60, 85, 110].map((x) => <rect key={x} x={x} y="60" width="10" height="170" rx="4" fill="#8fb35a" />)}
        {[60, 85, 110].map((x) => [90, 130, 170].map((y) => <rect key={`${x}${y}`} x={x - 1} y={y} width="12" height="3" fill="#5d7a35" />))}
        <path d="M140 150 h40" stroke={TINTA} strokeWidth="3" markerEnd="url(#gu-f)" />
      </g>
      <g style={ver(i < 3)}>
        <path d="M200 90 h80 v120 a10 10 0 0 1 -10 10 h-60 a10 10 0 0 1 -10 -10 z" fill="#fff" stroke={TINTA} strokeWidth="2" />
        <rect x="202" y={110} width="76" height="108" fill={nivel ? '#e8d27a' : '#cfe3a0'} style={{ transition: suave }} />
        <g style={ver(i >= 1)}>{Array.from({ length: 9 }, (_, k) => <ellipse key={k} cx={212 + (k % 3) * 26} cy={130 + Math.floor(k / 3) * 28} rx="6" ry="4.5" fill="#c9a36a" stroke="#8b6b3a" />)}</g>
        <g style={ver(i === 2)}>
          {Array.from({ length: 6 }, (_, k) => <circle key={k} cx={215 + k * 11} cy="200" r="3" fill="#fff" stroke="#999"><animate attributeName="cy" values="210;115" dur={`${1.2 + (k % 3) * 0.4}s`} repeatCount="indefinite" /></circle>)}
          <ellipse cx="240" cy="62" rx={22} ry={26} fill="#e2685c" opacity="0.8" /><path d="M240 88 v4" stroke={TINTA} />
          <T x={330} y={60} t="CO₂" s={13} c={ROJO} />
        </g>
      </g>
      <g style={ver(i === 3)}>
        <circle cx="110" cy="170" r="45" fill="#d9e6f2" stroke={TINTA} strokeWidth="2" />
        <path d="M80 222 h60" stroke="#f6a33c" strokeWidth="8" />
        <path d="M110 125 v-25 h120 l40 50" fill="none" stroke={TINTA} strokeWidth="5" />
        <rect x="235" y="90" width="20" height="50" fill="#b9d3ee" opacity="0.7" transform="rotate(50 245 115)" />
        <path d="M280 165 v40 h30 v-40" fill="#f8f3df" stroke={TINTA} strokeWidth="2" />
        {[0, 1, 2].map((k) => <circle key={k} cx="275" cy={150 + k * 8} r="2.5" fill={AZUL}><animate attributeName="cy" values="150;175" dur="1s" begin={`${k * 0.3}s`} repeatCount="indefinite" /></circle>)}
        <T x={300} y={225} t="aguardiente" s={11} />
      </g>
      <T x={200} y={36} t={['El guarapo: jugo dulce de la caña', 'Levaduras: hongos microscópicos', 'C₆H₁₂O₆ → 2 C₂H₅OH + 2 CO₂', 'El etanol hierve a 78 °C: se separa del agua'][i]} s={15} c={[VERDE, TINTA, ROJO, AZUL][i]} />
      <T x={200} y={268} t={['Tiene sacarosa, glucosa y fructosa', 'Sin oxígeno, transforman el azúcar…', '…en alcohol etílico y gas carbónico', 'Destilación: el vapor rico en alcohol se enfría y gotea'][i]} s={12} peso={600} />
      <defs><marker id="gu-f" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill={TINTA} /></marker></defs>
    </Lienzo>
  )
}

const TI = ['primario', 'secundario', 'terciario', 'oxidacion']

export function EscenaTiposAlcohol({ fase }: { fase: string }) {
  const i = idx(TI, fase)
  const c0: [string, number, number] = ['C', 200, 150]
  const vecinos: [string, number, number][] = [['C', 150, 150], ['C', 250, 150], ['C', 200, 200]]
  const n = Math.min(3, i + 1)
  const mol = construir([c0, ['O', 200, 100], ...vecinos.slice(0, n)], [[0, 1], ...vecinos.slice(0, n).map((_, k) => [0, k + 2] as [number, number])], 'todos', 22)
  const ox = [
    construir([['C', 60, 150], ['C', 95, 150], ['O', 130, 150]], [[0, 1], [1, 2]], 'todos', 18),
    construir([['C', 175, 150], ['C', 210, 150], ['O', 210, 115]], [[0, 1], [1, 2, 2]], 'todos', 18),
    construir([['C', 290, 150], ['C', 325, 150], ['O', 325, 115], ['O', 360, 150]], [[0, 1], [1, 2, 2], [1, 3]], 'todos', 18),
  ]
  return (
    <Lienzo etiqueta={`Tipos de alcohol: ${fase}`}>
      <g style={ver(i < 3)}>
        <circle cx="200" cy="150" r="22" fill="#f6d55c" opacity="0.6" />
        <Molecula mol={mol} />
        <T x={200} y={40} t={['Primario: etanol', 'Secundario: 2-propanol', 'Terciario: 2-metil-2-propanol'][Math.min(i, 2)]} s={16} c={AZUL} />
        <T x={200} y={260} t={`El carbono del –OH tiene ${n} carbono${n > 1 ? 's' : ''} vecino${n > 1 ? 's' : ''}`} s={13} />
      </g>
      <g style={ver(i === 3)}>
        {ox.map((m, k) => <Molecula key={k} mol={m} s={0.8} />)}
        <T x={150} y={155} t="→" s={20} c={ROJO} /><T x={262} y={155} t="→" s={20} c={ROJO} />
        <T x={95} y={205} t="etanol" s={11} /><T x={200} y={205} t="etanal" s={11} /><T x={325} y={205} t="ácido acético" s={11} />
        <T x={200} y={40} t="Oxidación de un alcohol primario" s={16} c={ROJO} />
        <T x={200} y={255} t="Por eso el guarapo o el vino destapados se vuelven vinagre" s={12} />
        <T x={200} y={275} t="Secundario → cetona · Terciario: casi no se oxida" s={11} peso={600} />
      </g>
    </Lienzo>
  )
}
