import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» de las leyes ponderales (Química área 3, tema 6). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })

export function MasaCambiaJuego() {
  return (
    <JuegoDecide titulo="¿Qué marca la balanza?" pregunta="Después de la reacción, la balanza…" instrucciones="Cerrado: la masa se conserva. Abierto: puede salir o entrar gas." clave="cien:masa-cambia-mejor" tiempo={12}
      opciones={[o('igual', 'Marca lo mismo', '⚖️'), o('baja', 'Marca menos', '⬇️'), o('sube', 'Marca más', '⬆️')]}
      cartas={[
        c('🪵', 'Leña que se quema en el fogón abierto', 'baja', 'El CO₂ y el vapor se van al aire.'),
        c('🔩', 'Lana de acero que se quema al aire', 'sube', 'El hierro toma oxígeno del aire.'),
        c('🎈', 'Vinagre y bicarbonato con un globo en la boca', 'igual', 'El gas queda atrapado.'),
        c('🕯️', 'Una vela encendida sobre la balanza', 'baja', 'Los gases de la combustión se escapan.'),
        c('💊', 'Pastilla efervescente en un vaso abierto', 'baja', 'Sale CO₂.'),
        c('🫙', 'Pastilla efervescente en un frasco bien tapado', 'igual', 'Sistema cerrado.'),
        c('🗡️', 'Un machete que se oxida durante meses', 'sube', 'Gana el oxígeno del óxido.'),
        c('🧪', 'Dos líquidos que forman un sólido en un tubo tapado', 'igual', 'Nada entra ni sale.'),
      ]}
      cierre="La masa siempre se conserva; lo que cambia es si dejas entrar o salir gases." />
  )
}

export function ProporcionAguaJuego() {
  return (
    <JuegoDecide titulo="Siempre 1 : 8" pregunta="¿Cuánto oxígeno hay o se necesita?" instrucciones="En el agua hay 8 g de oxígeno por cada 1 g de hidrógeno (9 g de agua)." clave="cien:proporcion-agua-mejor" tiempo={12}
      opciones={[o('8', '8 g', '8️⃣'), o('16', '16 g', '🔟'), o('24', '24 g', '💯')]}
      cartas={[
        c('💧', '1 g de hidrógeno', '8', '1 × 8.'),
        c('💧', '2 g de hidrógeno', '16', '2 × 8.'),
        c('💧', '3 g de hidrógeno', '24', '3 × 8.'),
        c('🏞️', '9 g de agua del río', '8', '9 g = 1 g de H + 8 g de O.'),
        c('🌧️', '18 g de agua de lluvia', '16', '18 g = 2 g de H + 16 g de O.'),
        c('🧪', '27 g de agua destilada', '24', '27 g = 3 g de H + 24 g de O.'),
        c('🧊', '18 g de hielo', '16', 'Sigue siendo agua: misma proporción.'),
        c('☁️', '27 g de vapor de agua', '24', 'El estado no cambia la composición.'),
      ]}
      cierre="Un compuesto tiene siempre la misma proporción, venga de donde venga." />
  )
}

export function CualLeyJuego() {
  return (
    <JuegoDecide titulo="¿Qué ley es?" pregunta="¿Qué ley describe esto?" instrucciones="Lavoisier: se conserva. Proust: proporción fija. Dalton: razones enteras." clave="cien:cual-ley-mejor"
      opciones={[o('lav', 'Lavoisier', '⚖️'), o('pro', 'Proust', '📏'), o('dal', 'Dalton', '✖️')]}
      cartas={[
        c('⚖️', '56 g de Fe + 32 g de S dan 88 g de FeS', 'lav', 'La masa total se conserva.'),
        c('💧', 'El agua de cualquier lugar tiene 1 g de H por 8 g de O', 'pro', 'Proporción definida.'),
        c('💨', 'El CO₂ tiene el doble de oxígeno que el CO para el mismo carbono', 'dal', 'Razón 1 : 2.'),
        c('🎈', 'La botella tapada pesa lo mismo antes y después', 'lav', 'Sistema cerrado.'),
        c('🔩', 'Al mezclar 10 g de Fe y 10 g de S sobra azufre', 'pro', 'Solo reacciona en proporción 7 : 4.'),
        c('🟤', 'FeO y Fe₂O₃: 2 : 3 en el oxígeno para el mismo hierro', 'dal', 'Proporciones múltiples.'),
        c('🪵', 'La ceniza pesa menos porque los gases se fueron', 'lav', 'Sistema abierto.'),
        c('🫧', 'H₂O y H₂O₂: 1 : 2 en el oxígeno', 'dal', 'Proporciones múltiples.'),
      ]}
      cierre="Una masa, una proporción, varias proporciones enteras." />
  )
}
