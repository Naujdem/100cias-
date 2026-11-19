import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» de la concentración (Química área 4, tema 5). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })

export function ConcentradaJuego() {
  return (
    <JuegoDecide titulo="¿Cuál está más concentrada?" pregunta="¿Cuál tiene más soluto por cada litro?" instrucciones="Concentración = cuánto soluto hay en cuánta solución." clave="cien:concentrada-mejor"
      opciones={[o('a', 'La primera', '⬅️'), o('b', 'La segunda', '➡️'), o('i', 'Igual', '⚖️')]}
      cartas={[
        c('🟫', '1 panela en 2 L de agua o 1 panela en 4 L', 'a', 'Menos agua para el mismo soluto.'),
        c('🧂', '10 g de sal en 1 L o 20 g de sal en 1 L', 'b', 'Más soluto en el mismo volumen.'),
        c('🥤', 'Un vaso o la jarra de la misma limonada', 'i', 'La concentración no depende de cuánto se sirva.'),
        c('☕', '2 cucharadas de café en 1 taza o 4 cucharadas en 2 tazas', 'i', 'La misma proporción.'),
        c('🧃', 'Jugo de caja sin agua o el mismo jugo con un vaso de agua', 'a', 'Al agregar agua, se diluye.'),
        c('🧪', '5 g en 100 mL o 40 g en 1 L', 'a', '5 g en 100 mL son 50 g en 1 L.'),
      ]}
      cierre="Para comparar hay que mirar soluto y volumen a la vez." />
  )
}

export function PorcentajeJuego() {
  return (
    <JuegoDecide titulo="¿Qué porcentaje es?" pregunta="¿Qué tipo de porcentaje conviene?" instrucciones="%m/m: masa en masa (sólidos). %V/V: volumen en volumen (líquidos en líquidos). %m/V: gramos en 100 mL de solución." clave="cien:porcentaje-mejor"
      opciones={[o('mm', '% m/m', '⚖️'), o('vv', '% V/V', '🧪'), o('mv', '% m/V', '💧')]}
      cartas={[
        c('🍶', 'Alcohol antiséptico al 70 %', 'vv', '70 mL de alcohol en 100 mL de solución.'),
        c('💉', 'Suero fisiológico: 0,9 g de sal en 100 mL', 'mv', 'Gramos en mililitros.'),
        c('💍', 'Oro de 18 quilates: 75 % de oro', 'mm', 'Una aleación: masa en masa.'),
        c('🍷', 'El vino dice 12 % vol.', 'vv', 'Grado alcohólico: volumen en volumen.'),
        c('🫙', 'Vinagre con 5 g de ácido acético en 100 mL', 'mv', 'Gramos en mililitros.'),
        c('🌱', 'Un abono con 15 % de nitrógeno', 'mm', '15 kg de nitrógeno en cada 100 kg de abono.'),
        c('🧴', 'Agua oxigenada al 3 %', 'mv', '3 g de peróxido en 100 mL.'),
        c('🍫', 'Chocolate con 70 % de cacao', 'mm', 'Masa en masa.'),
      ]}
      cierre="Siempre se divide la parte (soluto) entre el todo (la solución completa), por 100." />
  )
}

export function PpmJuego() {
  return (
    <JuegoDecide titulo="¿Porcentaje o ppm?" pregunta="¿Qué unidad usarías?" instrucciones="Las ppm se usan para cantidades muy pequeñas: 1 ppm = 1 mg en 1 L de agua." clave="cien:ppm-mejor"
      opciones={[o('p', 'Porcentaje', '💯'), o('ppm', 'ppm', '🔬')]}
      cartas={[
        c('🚰', 'El cloro del agua de la llave', 'ppm', 'Entre 0,3 y 2 mg por litro.'),
        c('🍶', 'El alcohol antiséptico', 'p', '70 %.'),
        c('🐟', 'El mercurio en el pescado de un río con minería', 'ppm', 'Cantidades muy pequeñas pero peligrosas.'),
        c('🥛', 'La grasa de la leche entera', 'p', 'Más o menos 3 %.'),
        c('🦷', 'El flúor de la crema dental', 'ppm', 'Más o menos 1000 a 1500 ppm.'),
        c('🌊', 'La sal del agua de mar', 'p', 'Más o menos 3,5 %.'),
        c('💨', 'El CO₂ del aire', 'ppm', 'Unas 420 ppm.'),
      ]}
      cierre="Porcentaje para lo que abunda; ppm para las trazas." />
  )
}

export function MolaridadJuego() {
  return (
    <JuegoDecide titulo="¿Cuál es la molaridad?" pregunta="¿Cuántos moles por litro?" instrucciones="M = moles de soluto ÷ litros de solución. NaCl 58,5 g/mol · NaOH 40 g/mol" clave="cien:molaridad-mejor" tiempo={15}
      opciones={[o('01', '0,1 M', '💧'), o('05', '0,5 M', '🧪'), o('1', '1 M', '⚗️'), o('2', '2 M', '🔥')]}
      cartas={[
        c('🧪', '1 mol de NaCl en 1 L de solución', '1', '1 ÷ 1.'),
        c('🧪', '0,5 mol en 250 mL', '2', '0,5 ÷ 0,25.'),
        c('🧂', '58,5 g de NaCl en 500 mL', '2', '1 mol ÷ 0,5 L.'),
        c('🧂', '5,85 g de NaCl en 1 L', '01', '0,1 mol ÷ 1 L.'),
        c('⚗️', '40 g de NaOH en 2 L', '05', '1 mol ÷ 2 L.'),
        c('⚗️', '4 g de NaOH en 100 mL', '1', '0,1 mol ÷ 0,1 L.'),
        c('🧪', '0,05 mol en 100 mL', '05', '0,05 ÷ 0,1.'),
      ]}
      cierre="Primero los gramos a moles; luego los mL a litros; después se divide." />
  )
}

export function DilucionJuego() {
  return (
    <JuegoDecide titulo="Diluir sin perderse" pregunta="¿Cuál es la concentración final?" instrucciones="C₁ × V₁ = C₂ × V₂" clave="cien:dilucion-mejor" tiempo={15}
      opciones={[o('mitad', 'La mitad', '½'), o('cuarto', 'Un cuarto', '¼'), o('decimo', 'Un décimo', '⅒')]}
      cartas={[
        c('🧪', '100 mL de 2 M se completan hasta 200 mL', 'mitad', '2 × 100 = C₂ × 200 → 1 M.'),
        c('🧪', '50 mL de 1 M se completan hasta 500 mL', 'decimo', '0,1 M.'),
        c('🧃', '1 vaso de jugo concentrado + 3 vasos de agua', 'cuarto', 'De 1 a 4 vasos.'),
        c('🧴', '10 mL de blanqueador en 100 mL de solución', 'decimo', 'El volumen se multiplicó por 10.'),
        c('🧪', '25 mL de 0,8 M hasta 100 mL', 'cuarto', '0,2 M.'),
        c('🍋', 'Medio vaso de limonada + medio vaso de agua', 'mitad', 'El volumen se duplicó.'),
      ]}
      cierre="Al diluir, los moles de soluto no cambian: solo crece el volumen." />
  )
}

export function NormalidadJuego() {
  return (
    <JuegoDecide titulo="Equivalentes y fracciones" pregunta="¿Cuánto da?" instrucciones="N = M × equivalentes (H⁺ u OH⁻ que aporta). Fracción molar = moles de un componente ÷ moles totales." clave="cien:normalidad-mejor" tiempo={15}
      opciones={[o('1', '1', '1️⃣'), o('2', '2', '2️⃣'), o('05', '0,5', '½'), o('01', '0,1', '🔹')]}
      cartas={[
        c('⚗️', 'Normalidad de HCl 1 M', '1', '1 H⁺: N = M.'),
        c('⚗️', 'Normalidad de H₂SO₄ 1 M', '2', '2 H⁺ por molécula.'),
        c('⚗️', 'Normalidad de NaOH 0,5 M', '05', '1 OH⁻.'),
        c('⚗️', 'Normalidad de Ca(OH)₂ 1 M', '2', '2 OH⁻.'),
        c('🧪', 'Fracción molar del soluto: 1 mol de soluto en 1 mol de agua', '05', '1 ÷ 2.'),
        c('🧪', 'Fracción molar del soluto: 1 mol en 9 mol de agua', '01', '1 ÷ 10.'),
      ]}
      cierre="Las fracciones molares de una mezcla siempre suman 1." />
  )
}

export function EtiquetaJuego() {
  return (
    <JuegoDecide titulo="¿Cuál está más concentrado?" pregunta="Compara las dos etiquetas" instrucciones="Antes de comparar, pasa las dos a la misma unidad: %, g/L o ppm." clave="cien:etiqueta-mejor"
      opciones={[o('a', 'El primero', '🅰️'), o('b', 'El segundo', '🅱️'), o('igual', 'Igual', '🟰')]}
      cartas={[
        c('🧴', 'Blanqueador 5,25 % · blanqueador 3 %', 'a', '5,25 % es más concentrado.'),
        c('🍶', 'Vinagre 4 % · vinagre 5 %', 'b', '5 g de ácido acético en 100 mL.'),
        c('🦷', 'Crema dental 1450 ppm de flúor · otra de 1000 ppm', 'a', 'Más ppm, más flúor.'),
        c('💧', 'Suero 0,9 % de NaCl · suero de 9 g/L de NaCl', 'igual', '9 g en 1000 mL = 0,9 g en 100 mL.'),
        c('🧼', 'Jabón con 2 g en 100 mL · jabón con 15 g por litro', 'a', '2 % frente a 1,5 %.'),
        c('🩹', 'Alcohol 70 % · alcohol 96 %', 'b', 'Más concentrado, aunque el de 70 % desinfecta mejor la piel.'),
        c('🧪', 'Agua oxigenada 3 % · agua oxigenada de 10 volúmenes', 'igual', '10 volúmenes es más o menos 3 %.'),
      ]}
      cierre="Más grande no siempre es más: mira la unidad y el tamaño del envase." />
  )
}
