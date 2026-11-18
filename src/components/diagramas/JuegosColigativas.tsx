import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» de las propiedades coligativas (Química área 4, tema 9). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })

export function ColigativaJuego() {
  return (
    <JuegoDecide titulo="¿Cuál tiene más partículas?" pregunta="¿Cuál cambia más el punto de congelación?" instrucciones="Solo importa cuántas partículas hay. Azúcar: 1 por molécula. NaCl: 2. CaCl₂: 3." clave="cien:coligativa-mejor" tiempo={14}
      opciones={[o('a', 'La primera', '⬅️'), o('b', 'La segunda', '➡️'), o('i', 'Igual', '⚖️')]}
      cartas={[
        c('🧂', '1 mol de azúcar o 1 mol de sal (en 1 kg de agua)', 'b', 'La sal da 2 mol de partículas.'),
        c('🧪', '1 mol de NaCl o 1 mol de CaCl₂', 'b', 'El CaCl₂ da 3 partículas.'),
        c('🍬', '1 mol de azúcar o 1 mol de glucosa', 'i', 'Las dos dan 1 mol de partículas.'),
        c('⚖️', '2 mol de azúcar o 1 mol de sal', 'i', 'Las dos dan 2 mol de partículas.'),
        c('🧂', '0,5 mol de sal o 2 mol de azúcar', 'b', '1 mol de partículas frente a 2.'),
        c('🚗', '1 mol de anticongelante o 1 mol de sal', 'b', 'El anticongelante no se separa en iones.'),
      ]}
      cierre="Coligativa = depende de la cantidad de partículas, no de qué sean." />
  )
}

export function CrioscopiaJuego() {
  return (
    <JuegoDecide titulo="Hervir y congelar" pregunta="¿Qué propiedad coligativa se usa?" instrucciones="Ascenso ebulloscópico: hierve más arriba. Descenso crioscópico: se congela más abajo." clave="cien:crioscopia-mejor"
      opciones={[o('e', 'Sube la ebullición', '♨️'), o('c', 'Baja la congelación', '🧊')]}
      cartas={[
        c('🍦', 'Hielo con sal para hacer helado casero', 'c', 'La mezcla baja de 0 °C.'),
        c('🛣️', 'Echar sal en una carretera helada', 'c', 'El hielo se derrite bajo 0 °C.'),
        c('🚗', 'Anticongelante en el radiador en un país frío', 'c', 'El agua no se congela.'),
        c('🚙', 'El refrigerante del radiador evita que hierva en verano', 'e', 'El mismo líquido sube el punto de ebullición.'),
        c('🍝', 'El agua con mucha sal hierve un poquito por encima de 100 °C', 'e', 'Un poquito: con la sal de cocinar casi no se nota.'),
        c('🐟', 'Los peces del océano helado tienen sustancias en la sangre que evitan que se congele', 'c', 'Se suma a la sal del mar.'),
      ]}
      cierre="El agua de mar se congela a unos −2 °C por la sal disuelta." />
  )
}

export function OsmosisJuego() {
  return (
    <JuegoDecide titulo="¿Hacia dónde va el agua?" pregunta="Por ósmosis, el agua sale o entra…" instrucciones="El agua pasa por la membrana hacia donde hay MÁS soluto." clave="cien:osmosis-quimica-mejor"
      opciones={[o('entra', 'Entra (se hincha)', '⬅️'), o('sale', 'Sale (se arruga)', '➡️'), o('igual', 'Queda igual', '⚖️')]}
      cartas={[
        c('🥬', 'Lechuga marchita en agua fría', 'entra', 'Se pone crocante otra vez.'),
        c('🍓', 'Fresas con azúcar encima', 'sale', 'Sueltan su jugo.'),
        c('🩸', 'Un glóbulo rojo en agua pura', 'entra', 'Puede reventar.'),
        c('🩸', 'Un glóbulo rojo en suero fisiológico (0,9 %)', 'igual', 'Tiene la misma concentración que la sangre.'),
        c('🥒', 'Pepino en salmuera para encurtir', 'sale', 'Se arruga.'),
        c('🐌', 'Un caracol al que le echan sal', 'sale', 'Pierde agua (no se hace).'),
        c('🥩', 'Carne salada', 'sale', 'Se seca: así se conserva.'),
      ]}
      cierre="Por eso los sueros que van a la sangre tienen la misma concentración que ella." />
  )
}
