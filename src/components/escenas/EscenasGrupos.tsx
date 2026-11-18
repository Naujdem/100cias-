// Escenas vivas de Química orgánica, tema 2: grupos funcionales (el mapa).
import { Molecula, MOLS, grupo, Lienzo, T, ver, idx, ROJO, AZUL, VERDE } from './Molecula.tsx'

const GI = ['etano', 'etanol', 'acido']

export function EscenaGrupoIdea({ fase }: { fase: string }) {
  const i = idx(GI, fase)
  const mols = [MOLS.etano(170, 150), MOLS.etanol(150, 150), MOLS.acetico(150, 160)]
  const grupos = [[], [2], [1, 2, 3]]
  return (
    <Lienzo etiqueta={`Grupo funcional: ${fase}`}>
      {mols.map((m, k) => <g key={k} style={ver(i === k)}><Molecula mol={m} s={1.3} resalta={grupo(m, grupos[k])} /></g>)}
      <T x={200} y={45} t={['Etano · CH₃–CH₃', 'Etanol · CH₃–CH₂–OH', 'Ácido acético · CH₃–COOH'][i]} s={16} c={[ROJO, AZUL, VERDE][i]} />
      <T x={200} y={250} t={['Gas que arde y no se mezcla con el agua', 'Grupo hidroxilo (–OH): líquido que se mezcla con el agua', 'Grupo carboxilo (–COOH): ácido, el del vinagre'][i]} s={13} />
      <T x={200} y={272} t="Mismo esqueleto de 2 carbonos; cambia el grupo funcional (en amarillo)" s={11} peso={600} />
    </Lienzo>
  )
}

const GM = ['hidrocarburos', 'oxigenados', 'nitrogenados']
const MAPA = [
  [['Alcano', 'C–C', '-ano'], ['Alqueno', 'C=C', '-eno'], ['Alquino', 'C≡C', '-ino'], ['Aromático', '⬡', 'benceno']],
  [['Alcohol', '–OH', '-ol'], ['Éter', '–O–', 'éter'], ['Aldehído', '–CHO', '-al'], ['Cetona', '–CO–', '-ona'], ['Ácido', '–COOH', 'ác. -oico'], ['Éster', '–COO–', '-ato de -ilo']],
  [['Amina', '–NH₂', '-amina'], ['Amida', '–CONH₂', '-amida'], ['Nitrilo', '–C≡N', '-nitrilo'], ['Halogenuro', '–X (Cl, Br…)', 'cloro-, bromo-']],
]
const COLORES = ['#efe3c4', '#f6d2cc', '#d3def3']

export function EscenaGrupoMapa({ fase }: { fase: string }) {
  const i = idx(GM, fase)
  return (
    <Lienzo etiqueta={`Mapa de familias: ${fase}`}>
      <T x={200} y={36} t={['Hidrocarburos: solo C y H', 'Compuestos oxigenados', 'Nitrogenados y halogenuros'][i]} s={16} c={[ROJO, '#b0482f', AZUL][i]} />
      {MAPA.map((fila, k) => (
        <g key={k} style={ver(i === k)}>
          {fila.map(([n, g, t], j) => {
            const x = 20 + (j % 3) * 125, y = 60 + Math.floor(j / 3) * 110
            return (
              <g key={n}>
                <rect x={x} y={y} width="110" height="95" rx="12" fill={COLORES[k]} stroke="#3a3a3a" strokeWidth="1.5" />
                <T x={x + 55} y={y + 24} t={n} s={13} />
                <T x={x + 55} y={y + 56} t={g} s={17} c={[ROJO, '#b0482f', AZUL][k]} />
                <T x={x + 55} y={y + 82} t={t} s={11} peso={600} />
              </g>
            )
          })}
        </g>
      ))}
    </Lienzo>
  )
}
