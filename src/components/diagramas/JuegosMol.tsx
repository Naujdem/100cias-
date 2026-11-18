import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» del mol (Química área 3, tema 7). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })

export function UnidadContarJuego() {
  return (
    <JuegoDecide titulo="¿Con qué se cuenta?" pregunta="¿Qué unidad usarías?" instrucciones="Docena: 12. Resma: 500. Mol: 6,022 × 10²³." clave="cien:unidad-contar-mejor"
      opciones={[o('doc', 'Docena', '🥚'), o('res', 'Resma', '📄'), o('mol', 'Mol', '⚛️')]}
      cartas={[
        c('🥚', 'Huevos en la tienda', 'doc', '12 huevos.'),
        c('📄', 'Hojas para la impresora', 'res', '500 hojas.'),
        c('💧', 'Moléculas de agua en un vaso', 'mol', 'Son demasiadas: se cuentan en moles.'),
        c('🔩', 'Átomos de hierro en un clavo', 'mol', 'Billones de billones.'),
        c('🫓', 'Arepas para el desayuno', 'doc', 'Una docena de arepas.'),
        c('🌹', 'Rosas para un ramo', 'doc', 'Una docena de rosas.'),
        c('🧂', 'Iones de sodio en una cucharadita de sal', 'mol', 'Partículas: moles.'),
        c('🗒️', 'Papel para fotocopias del colegio', 'res', 'Resmas.'),
      ]}
      cierre="Cosas grandes: docena o resma. Átomos y moléculas: el mol." />
  )
}

export function MasaMolarJuego() {
  return (
    <JuegoDecide titulo="¿Cuánto pesa un mol?" pregunta="¿Cuál es la masa molar?" instrucciones="H 1 · C 12 · N 14 · O 16 · Na 23 · S 32 · Cl 35,5" clave="cien:masa-molar-mejor" tiempo={15}
      opciones={[o('18', '18 g/mol', '💧'), o('32', '32 g/mol', '🌬️'), o('44', '44 g/mol', '💨'), o('58', '58,5 g/mol', '🧂')]}
      cartas={[
        c('💧', 'H₂O', '18', '2 × 1 + 16.'),
        c('🌬️', 'O₂', '32', '2 × 16.'),
        c('💨', 'CO₂', '44', '12 + 2 × 16.'),
        c('🧂', 'NaCl', '58', '23 + 35,5.'),
        c('🍳', 'C₃H₈ (propano)', '44', '3 × 12 + 8 × 1.'),
        c('🟡', 'S (azufre)', '32', 'Masa atómica 32.'),
        c('😂', 'N₂O (gas de la risa)', '44', '2 × 14 + 16.'),
        c('🧊', 'Hielo (H₂O)', '18', 'Sigue siendo agua.'),
      ]}
      cierre="Masa molar: suma de las masas atómicas por sus subíndices." />
  )
}

export function ConversionJuego() {
  return (
    <JuegoDecide titulo="¿Qué operación?" pregunta="¿Qué hay que hacer?" instrucciones="g → mol: ÷ M. mol → g: × M. mol → partículas: × Nₐ. partículas → mol: ÷ Nₐ." clave="cien:conversion-mejor" tiempo={12}
      opciones={[o('dm', '÷ masa molar', '➗'), o('xm', '× masa molar', '✖️'), o('xn', '× 6,022 × 10²³', '🚀'), o('dn', '÷ 6,022 × 10²³', '🔽')]}
      cartas={[
        c('⚖️', 'Tengo gramos y quiero moles', 'dm', 'g ÷ g/mol = mol.'),
        c('🧪', 'Tengo moles y quiero gramos', 'xm', 'mol × g/mol = g.'),
        c('⚛️', 'Tengo moles y quiero moléculas', 'xn', 'Cada mol tiene 6,022 × 10²³.'),
        c('🔢', 'Tengo átomos y quiero moles', 'dn', 'Se agrupan de a 6,022 × 10²³.'),
        c('💧', '36 g de agua → ¿cuántos moles?', 'dm', '36 ÷ 18 = 2.'),
        c('🔩', '2 mol de hierro → ¿cuántos gramos?', 'xm', '2 × 56 = 112 g.'),
        c('🧂', '0,5 mol de NaCl → ¿cuántas unidades?', 'xn', '3,011 × 10²³.'),
        c('🌬️', '1,2 × 10²⁴ moléculas de O₂ → ¿moles?', 'dn', '2 mol.'),
      ]}
      cierre="El mol es el puente: se llega a él dividiendo y se sale multiplicando." />
  )
}

export function EmpiricaJuego() {
  return (
    <JuegoDecide titulo="La proporción más simple" pregunta="¿Cuál es su fórmula empírica?" instrucciones="Divide los subíndices por su máximo común divisor." clave="cien:empirica-mejor" tiempo={12}
      opciones={[o('ch2o', 'CH₂O', '🍬'), o('ch', 'CH', '⬡'), o('ho', 'HO', '🫧'), o('no2', 'NO₂', '🟤')]}
      cartas={[
        c('🍬', 'Glucosa, C₆H₁₂O₆', 'ch2o', 'Todo entre 6.'),
        c('🫙', 'Ácido acético del vinagre, C₂H₄O₂', 'ch2o', 'Todo entre 2.'),
        c('⬡', 'Benceno, C₆H₆', 'ch', 'Todo entre 6.'),
        c('🔥', 'Acetileno (soldadura), C₂H₂', 'ch', 'Todo entre 2.'),
        c('🫧', 'Agua oxigenada, H₂O₂', 'ho', 'Todo entre 2.'),
        c('🟤', 'Tetróxido de dinitrógeno, N₂O₄', 'no2', 'Todo entre 2.'),
        c('🧪', 'Formaldehído, CH₂O', 'ch2o', 'Ya es la más simple.'),
        c('🟤', 'Dióxido de nitrógeno, NO₂', 'no2', 'Ya es la más simple.'),
      ]}
      cierre="Varias sustancias pueden compartir la misma fórmula empírica." />
  )
}
