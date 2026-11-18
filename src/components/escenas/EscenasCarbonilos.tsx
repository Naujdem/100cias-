// Escenas vivas de Química orgánica, tema 7: aldehídos, cetonas, ácidos y ésteres.
import { Molecula, construir, Lienzo, T, ver, idx, suave, ROJO, AZUL, VERDE, TINTA } from './Molecula.tsx'

const CA = ['grupo', 'aldehido', 'cetona']

export function EscenaCarbonilo({ fase }: { fase: string }) {
  const i = idx(CA, fase)
  const grupo = construir([['C', 200, 160], ['O', 200, 110]], [[0, 1, 2]], 'no')
  const metanal = construir([['C', 200, 160], ['O', 200, 110]], [[0, 1, 2]], 'todos', 28)
  const acetona = construir([['C', 150, 160], ['C', 200, 160], ['C', 250, 160], ['O', 200, 110]], [[0, 1], [1, 2], [1, 3, 2]], 'todos', 26)
  return (
    <Lienzo etiqueta={`Grupo carbonilo: ${fase}`}>
      <circle cx="200" cy="135" r="40" fill="#f6d55c" opacity="0.45" />
      <g style={ver(i === 0)}>
        <Molecula mol={grupo} s={1.3} />
        <line x1="182" y1="170" x2="160" y2="195" stroke={TINTA} strokeWidth="3" strokeDasharray="4 3" /><line x1="218" y1="170" x2="240" y2="195" stroke={TINTA} strokeWidth="3" strokeDasharray="4 3" />
      </g>
      <g style={ver(i === 1)}><Molecula mol={metanal} s={1.3} /></g>
      <g style={ver(i === 2)}><Molecula mol={acetona} s={1.15} /></g>
      <T x={200} y={40} t={['Grupo carbonilo: C=O', 'Aldehído: el C=O en la punta (–CHO)', 'Cetona: el C=O en medio'][i]} s={16} c={[TINTA, ROJO, AZUL][i]} />
      <T x={200} y={255} t={['¿Qué hay a cada lado del carbono?', 'Metanal (formaldehído): con agua es el formol', 'Propanona (acetona): el quitaesmalte'][i]} s={13} />
    </Lienzo>
  )
}

const JA = ['grasa', 'soda', 'jabon', 'micela']

export function EscenaJabon({ fase }: { fase: string }) {
  const i = idx(JA, fase)
  const colas = [0, 1, 2]
  return (
    <Lienzo etiqueta={`Saponificación: ${fase}`}>
      <g style={ver(i < 3)}>
        <rect x="60" y="80" width="26" height="150" rx="8" fill="#f2d7a6" stroke={TINTA} strokeWidth="2" />
        <T x={73} y={250} t="glicerina" s={10} peso={600} />
        {colas.map((k) => {
          const y = 100 + k * 55
          const sep = i >= 2 ? 50 : 0
          return (
            <g key={k} style={{ transition: suave, transform: `translateX(${sep}px)` }}>
              <circle cx="105" cy={y} r="9" fill={i >= 1 ? ROJO : '#e2685c'} style={{ transition: suave }} />
              <path d={`M114 ${y} ${Array.from({ length: 9 }, (_, j) => `L${130 + j * 22} ${y + (j % 2 ? -8 : 8)}`).join(' ')}`} fill="none" stroke={TINTA} strokeWidth="3" />
              <g style={ver(i >= 2)}><circle cx="96" cy={y - 12} r="7" fill="#9b8bd6" /><T x={96} y={y - 9} t="Na⁺" s={7} c="#fff" /></g>
            </g>
          )
        })}
        <g style={ver(i === 1)}>{colas.map((k) => <g key={k}><circle cx="95" cy={88 + k * 55} r="8" fill="#9b8bd6" /><T x={95} y={91 + k * 55} t="OH⁻" s={7} c="#fff" /></g>)}</g>
      </g>
      <g style={ver(i === 3)}>
        <circle cx="200" cy="150" r="30" fill="#f2c94c" opacity="0.8" />
        <T x={200} y={154} t="grasa" s={11} />
        {Array.from({ length: 12 }, (_, k) => {
          const a = (k / 12) * Math.PI * 2
          return (
            <g key={k}>
              <line x1={200 + Math.cos(a) * 28} y1={150 + Math.sin(a) * 28} x2={200 + Math.cos(a) * 70} y2={150 + Math.sin(a) * 70} stroke={TINTA} strokeWidth="3" />
              <circle cx={200 + Math.cos(a) * 76} cy={150 + Math.sin(a) * 76} r="8" fill={ROJO} />
            </g>
          )
        })}
      </g>
      <T x={200} y={36} t={['Una grasa: glicerina unida a 3 ácidos grasos', 'Grasa + 3 NaOH (soda cáustica)', '→ glicerina + 3 moléculas de jabón', 'Micela: las colas abrazan la grasa'][i]} s={14} c={[TINTA, ROJO, VERDE, AZUL][i]} />
      <T x={200} y={278} t={['Los enlaces éster están en los puntos rojos', 'El OH⁻ rompe cada enlace éster', 'Cada jabón: cabeza iónica (ama el agua) y cola de carbonos (ama la grasa)', 'Las cabezas miran al agua y el agua se lleva la mugre'][i]} s={11} peso={600} />
    </Lienzo>
  )
}
