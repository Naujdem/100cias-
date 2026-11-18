import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» de Química, área 1, tema 5 (Clasificación de la materia). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })

export function ElementoCompuestoJuego() {
  return (
    <JuegoDecide titulo="¿Elemento o compuesto?" pregunta="¿Qué tipo de sustancia pura es?" instrucciones="Elemento: una sola clase de átomos. Compuesto: varios elementos unidos." clave="cien:elemento-compuesto-mejor"
      opciones={[o('el', 'Elemento', '🟡'), o('co', 'Compuesto', '🔗')]}
      cartas={[
        c('💍', 'Oro (Au)', 'el', 'Solo átomos de oro.'),
        c('💧', 'Agua (H₂O)', 'co', 'Hidrógeno y oxígeno unidos.'),
        c('🧂', 'Sal de cocina (NaCl)', 'co', 'Sodio y cloro unidos.'),
        c('🔩', 'Hierro (Fe)', 'el', 'Solo átomos de hierro.'),
        c('🫁', 'Oxígeno (O₂)', 'el', 'Dos átomos, pero del mismo elemento.'),
        c('🍬', 'Azúcar (C₁₂H₂₂O₁₁)', 'co', 'Carbono, hidrógeno y oxígeno.'),
        c('✏️', 'El grafito del lápiz (C)', 'el', 'Es carbono puro.'),
        c('💨', 'Dióxido de carbono (CO₂)', 'co', 'Carbono y oxígeno unidos.'),
      ]}
      cierre="Si la fórmula tiene un solo símbolo de elemento, es un elemento; si tiene varios, es un compuesto." />
  )
}

export function HomoHeteroJuego() {
  return (
    <JuegoDecide titulo="¿Homogénea o heterogénea?" pregunta="¿Se distinguen sus partes?" instrucciones="Decide qué tipo de mezcla es cada una." clave="cien:homo-hetero-mejor"
      opciones={[o('ho', 'Homogénea', '🥤'), o('he', 'Heterogénea', '🥗')]}
      cartas={[
        c('☕', 'Tinto colado', 'ho', 'Se ve de un solo aspecto.'),
        c('🥗', 'Ensalada de frutas', 'he', 'Se distingue cada fruta.'),
        c('🧂', 'Agua con sal disuelta', 'ho', 'La sal no se ve.'),
        c('🫒', 'Agua con aceite', 'he', 'Se ven dos capas.'),
        c('🌬️', 'El aire limpio', 'ho', 'Es una mezcla de gases que no se distinguen.'),
        c('🏖️', 'Arena con piedritas', 'he', 'Se ven los granos y las piedras.'),
        c('🍲', 'El sancocho', 'he', 'Se ven la papa, la yuca y la carne.'),
        c('🥃', 'Aguapanela', 'ho', 'La panela queda disuelta.'),
      ]}
      cierre="Homogénea: un solo aspecto. Heterogénea: se distinguen las partes." />
  )
}

export function DondeVaJuego() {
  return (
    <JuegoDecide titulo="¿Dónde va en el árbol?" pregunta="¿Cómo se clasifica?" instrucciones="Ubica cada material en el árbol de la materia." clave="cien:donde-va-mejor"
      opciones={[o('el', 'Elemento', '🟡'), o('co', 'Compuesto', '🔗'), o('ho', 'Mezcla homogénea', '🥤'), o('he', 'Mezcla heterogénea', '🥗')]}
      cartas={[
        c('🥫', 'Una lata de aluminio (Al)', 'el', 'Solo átomos de aluminio.'),
        c('🥛', 'Gaseosa sin burbujas', 'ho', 'Agua, azúcar y otras sustancias disueltas.'),
        c('🧊', 'Un cubo de hielo de agua pura', 'co', 'Sigue siendo H₂O, en estado sólido.'),
        c('🌋', 'Granito con pintas de colores', 'he', 'Se ven los distintos minerales.'),
        c('🫙', 'Agua con tierra recién revuelta', 'he', 'La tierra se ve suspendida y se asienta.'),
        c('🧪', 'Bicarbonato de sodio (NaHCO₃)', 'co', 'Varios elementos unidos.'),
        c('🎈', 'Helio del globo (He)', 'el', 'Un elemento gaseoso.'),
        c('🍷', 'Vinagre', 'ho', 'Ácido acético disuelto en agua.'),
      ]}
      cierre="Primero: ¿una sola sustancia o varias? Luego: ¿un elemento o varios unidos? ¿Se ven las partes o no?" />
  )
}
