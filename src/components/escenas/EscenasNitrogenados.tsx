// Escenas vivas de Química orgánica, tema 8: compuestos nitrogenados.
import { Molecula, construir, Lienzo, T, ver, idx, ROJO, AZUL, VERDE } from './Molecula.tsx'

const AM = ['amoniaco', 'primaria', 'secundaria', 'terciaria']

export function EscenaAminas({ fase }: { fase: string }) {
  const i = idx(AM, fase)
  const lados: [string, number, number][] = [['C', 145, 165], ['C', 255, 165], ['C', 200, 85]]
  const mol = construir([['N', 200, 145], ...lados.slice(0, i)], lados.slice(0, i).map((_, k) => [0, k + 1] as [number, number]), 'todos', 26)
  return (
    <Lienzo etiqueta={`Aminas: ${fase}`}>
      <circle cx="200" cy="145" r="22" fill="#f6d55c" opacity="0.5" />
      <Molecula mol={mol} s={1.15} />
      <T x={200} y={40} t={['Amoníaco, NH₃', 'Metilamina, CH₃–NH₂', 'Dimetilamina, (CH₃)₂NH', 'Trimetilamina, (CH₃)₃N'][i]} s={16} c={[AZUL, VERDE, VERDE, ROJO][i]} />
      <T x={200} y={255} t={['Un nitrógeno con tres hidrógenos', 'Amina primaria: un carbono en el N', 'Amina secundaria: dos carbonos', 'Amina terciaria: el olor a pescado 🐟'][i]} s={13} />
    </Lienzo>
  )
}

const AD = ['grupo', 'urea', 'peptido', 'nailon']

export function EscenaAmidas({ fase }: { fase: string }) {
  const i = idx(AD, fase)
  const grupo = construir([['C', 160, 150], ['C', 200, 150], ['O', 200, 110], ['N', 240, 150]], [[0, 1], [1, 2, 2], [1, 3]], 'todos', 24)
  const urea = construir([['C', 200, 150], ['O', 200, 108], ['N', 160, 172], ['N', 240, 172]], [[0, 1, 2], [0, 2], [0, 3]], 'todos', 24)
  const pep = construir([['N', 70, 160], ['C', 110, 160], ['C', 150, 160], ['O', 150, 120], ['N', 190, 160], ['C', 230, 160], ['C', 270, 160], ['O', 270, 120], ['O', 310, 160]],
    [[0, 1], [1, 2], [2, 3, 2], [2, 4], [4, 5], [5, 6], [6, 7, 2], [6, 8]], 'todos', 22)
  return (
    <Lienzo etiqueta={`Amidas: ${fase}`}>
      <g style={ver(i === 0)}><Molecula mol={grupo} s={1.1} resalta={[1, 2, 3]} /></g>
      <g style={ver(i === 1)}><Molecula mol={urea} s={1.15} /></g>
      <g style={ver(i === 2)}><Molecula mol={pep} s={0.9} resalta={[2, 3, 4]} /></g>
      <g style={ver(i === 3)}>
        {Array.from({ length: 6 }, (_, k) => (
          <g key={k}>
            <rect x={30 + k * 58} y="140" width="40" height="20" rx="6" fill={k % 2 ? '#9ec1e8' : '#f2b38c'} />
            {k < 5 && <rect x={70 + k * 58} y="144" width="18" height="12" rx="3" fill="#f6d55c" stroke="#3a3a3a" />}
          </g>
        ))}
        <T x={200} y={185} t="… –CO–NH– … –CO–NH– …" s={13} c={ROJO} />
      </g>
      <T x={200} y={40} t={['Grupo amida: –CO–NH₂', 'Urea: CO(NH₂)₂', 'Dos aminoácidos unidos: enlace peptídico', 'Nailon: una poliamida'][i]} s={16} c={[ROJO, VERDE, AZUL, ROJO][i]} />
      <T x={200} y={255} t={['Un carbonilo pegado a un nitrógeno', 'Abono con 46 % de nitrógeno; también sale en la orina', 'El ácido de uno y la amina del otro se unen y sueltan agua', 'Miles de uniones amida: medias, cuerdas, cerdas de cepillo'][i]} s={12} />
    </Lienzo>
  )
}
