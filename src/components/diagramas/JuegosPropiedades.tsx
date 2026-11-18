import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» de Química, área 1, tema 2 (Propiedades de la materia). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })

export function MasaVolumenJuego() {
  return (
    <JuegoDecide titulo="¿Masa o volumen?" pregunta="¿Qué se está midiendo?" instrucciones="Decide si cada medida es de masa o de volumen." clave="cien:masa-volumen-mejor"
      opciones={[o('masa', 'Masa', '⚖️'), o('vol', 'Volumen', '🧪')]}
      cartas={[
        c('🥛', '1 litro de leche', 'vol', 'El litro mide espacio ocupado.'),
        c('🍚', '500 gramos de arroz', 'masa', 'El gramo mide cantidad de materia.'),
        c('☕', 'Una carga de café de 125 kg', 'masa', 'El kilogramo es unidad de masa.'),
        c('💉', '5 mL de jarabe', 'vol', 'El mililitro es unidad de volumen.'),
        c('📦', 'Una caja de 30 cm³', 'vol', 'El centímetro cúbico mide volumen.'),
        c('⚖️', 'Lo que marca la báscula de la tienda', 'masa', 'La báscula mide la masa.'),
        c('🪣', 'Un balde de 10 litros', 'vol', 'Es su capacidad, un volumen.'),
      ]}
      cierre="Masa: g y kg, con balanza. Volumen: mL, L y cm³, con probeta o recipiente medidor." />
  )
}

export function FlotaHundeJuego() {
  return (
    <JuegoDecide titulo="¿Flota o se hunde?" pregunta="En agua (1 g/mL), ¿qué pasa?" instrucciones="Compara la densidad con la del agua y decide." clave="cien:flota-hunde-mejor"
      opciones={[o('flota', 'Flota', '🛟'), o('hunde', 'Se hunde', '⚓')]}
      cartas={[
        c('🪵', 'Madera de balso (0,15 g/mL)', 'flota', 'Mucho menos densa que el agua.'),
        c('🔩', 'Hierro (7,9 g/mL)', 'hunde', 'Casi 8 veces más denso que el agua.'),
        c('🧊', 'Hielo (0,92 g/mL)', 'flota', 'Por eso los cubos flotan en el vaso.'),
        c('🍯', 'Una gota de miel (1,4 g/mL)', 'hunde', 'Es más densa que el agua.'),
        c('🫒', 'Aceite de cocina (0,9 g/mL)', 'flota', 'Queda encima del agua.'),
        c('🪨', 'Piedra de río (≈ 2,6 g/mL)', 'hunde', 'Más densa que el agua.'),
        c('🕯️', 'Parafina de vela (0,9 g/mL)', 'flota', 'Un poco menos densa que el agua.'),
      ]}
      cierre="Menos de 1 g/mL flota en el agua; más de 1 g/mL se hunde." />
  )
}

export function QuePropiedadJuego() {
  return (
    <JuegoDecide titulo="¿Qué propiedad es?" pregunta="¿Qué propiedad se describe?" instrucciones="Elige la propiedad que describe cada caso." clave="cien:que-propiedad-mejor"
      opciones={[o('sol', 'Solubilidad', '🥄'), o('vis', 'Viscosidad', '🍯'), o('dur', 'Dureza', '💎'), o('cond', 'Conductividad', '⚡')]}
      cartas={[
        c('🧂', 'La sal desaparece en el agua del sancocho', 'sol', 'Se disuelve: es soluble en agua.'),
        c('🍯', 'La miel tarda en caer de la cuchara', 'vis', 'Es muy viscosa: fluye despacio.'),
        c('💎', 'El diamante raya el vidrio', 'dur', 'Es el material más duro.'),
        c('🔌', 'Los cables son de cobre', 'cond', 'El cobre conduce bien la electricidad.'),
        c('🫒', 'El aceite no se disuelve en el agua', 'sol', 'Es insoluble en agua.'),
        c('🧈', 'La uña raya una tiza', 'dur', 'La tiza es blanda.'),
        c('🍳', 'El mango de la olla es de madera', 'cond', 'La madera conduce mal el calor.'),
        c('🛢️', 'El aceite de motor fluye más lento que el agua', 'vis', 'Tiene mayor viscosidad.'),
      ]}
      cierre="Las propiedades específicas sirven para reconocer cada material." />
  )
}

export function HierveJuego() {
  return (
    <JuegoDecide titulo="¿Ya hierve?" pregunta="¿El agua está hirviendo?" instrucciones="Recuerda: a más altura, el agua hierve a menos temperatura." clave="cien:hierve-mejor"
      opciones={[o('si', 'Hierve', '♨️'), o('no', 'Todavía no', '🌡️')]}
      cartas={[
        c('🏖️', 'Agua a 100 °C en Cartagena (nivel del mar)', 'si', 'Al nivel del mar hierve a 100 °C.'),
        c('🏙️', 'Agua a 95 °C en Bogotá', 'si', 'En Bogotá hierve cerca de 91 °C.'),
        c('🌴', 'Agua a 95 °C en Neiva', 'no', 'En Neiva hierve cerca de 98 °C.'),
        c('🏔️', 'Agua a 85 °C en el Nevado del Huila', 'si', 'Allá hierve cerca de 83 °C.'),
        c('🏖️', 'Agua a 97 °C en Santa Marta', 'no', 'Al nivel del mar le faltan 3 °C.'),
        c('🍲', 'Agua a 110 °C dentro de una olla a presión', 'no', 'La olla sube la presión y el agua hierve cerca de 120 °C: por eso cocina más rápido.'),
      ]}
      cierre="El punto de ebullición depende de la presión: en la montaña hierve antes y los alimentos tardan más en cocinarse." />
  )
}
