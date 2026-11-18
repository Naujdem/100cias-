import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» del área 5, tema 7 (Residuos y consumo). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })

export function ResiduosJuego() {
  return (
    <JuegoDecide titulo="¿Residuo o basura?" pregunta="¿Se puede aprovechar?" instrucciones="Decide si cada cosa todavía se puede aprovechar o ya es basura." clave="cien:residuos-mejor"
      opciones={[o('si', 'Se aprovecha', '♻️'), o('no', 'Es basura', '🗑️')]}
      cartas={[
        c('🥕', 'Cáscaras de zanahoria', 'si', 'Van al compost.'),
        c('🧻', 'Papel higiénico usado', 'no', 'No se puede aprovechar.'),
        c('🫙', 'Un frasco de vidrio', 'si', 'Se reutiliza o se recicla.'),
        c('🛍️', 'Bolsa con restos de comida y botellas mezcladas', 'no', 'Mezclado y sucio ya nadie lo aprovecha.'),
        c('👕', 'Una camiseta vieja', 'si', 'Se dona, se repara o se vuelve trapo.'),
      ]}
      cierre="Separar a tiempo evita que los residuos se vuelvan basura." />
  )
}

export function LasRJuego() {
  return (
    <JuegoDecide titulo="¿Qué R es?" pregunta="¿Qué R se aplica?" instrucciones="Elige la R que muestra cada acción." clave="cien:las-r-mejor"
      opciones={[o('reducir', 'Rechazar o reducir', '➖'), o('reutilizar', 'Reutilizar', '🔁'), o('reparar', 'Reparar', '🔧'), o('reciclar', 'Reciclar', '♻️')]}
      cartas={[
        c('🥤', 'Pedir el jugo sin pitillo', 'reducir', 'No aceptar lo que no se necesita.'),
        c('🫙', 'Guardar granos en frascos de vidrio usados', 'reutilizar', 'Otro uso para el mismo objeto.'),
        c('👟', 'Llevar los tenis al zapatero', 'reparar', 'Duran mucho más.'),
        c('📦', 'Entregar el cartón al reciclador', 'reciclar', 'Se convierte en cartón nuevo.'),
        c('🧺', 'Ir al mercado con canasto', 'reducir', 'Menos bolsas.'),
        c('🍼', 'Comprar gaseosa en botella retornable', 'reutilizar', 'La botella se lava y se vuelve a llenar.'),
      ]}
      cierre="Primero no generar el residuo; reciclar es la última opción." />
  )
}

export function SepararJuego() {
  return (
    <JuegoDecide titulo="¿Blanca o negra?" pregunta="¿En qué caneca va?" instrucciones="Los casos difíciles: decide si va en la blanca (aprovechable) o en la negra (no aprovechable)." clave="cien:separar-mejor"
      opciones={[o('blanca', 'Blanca', '⚪'), o('negra', 'Negra', '⚫')]}
      cartas={[
        c('🥛', 'Caja de leche enjuagada y seca', 'blanca', 'Limpia y seca: aprovechable.'),
        c('🍔', 'Papel de hamburguesa con grasa', 'negra', 'Papel sucio de comida.'),
        c('🧃', 'Botella de jugo con jugo adentro', 'negra', 'Si no se vacía y se enjuaga, ensucia lo demás.'),
        c('📄', 'Hojas de cuaderno usadas', 'blanca', 'Papel limpio.'),
        c('😷', 'Tapabocas usado', 'negra', 'Residuo sanitario.'),
      ]}
      cierre="Limpio y seco va en la blanca; sucio o sanitario, en la negra." />
  )
}

export function CompostajeJuego() {
  return (
    <JuegoDecide titulo="¿Va al compost?" pregunta="¿Se puede compostar en casa?" instrucciones="Decide si cada residuo sirve para el compost casero." clave="cien:compostaje-mejor"
      opciones={[o('si', 'Sí', '🟢'), o('no', 'No', '🚫')]}
      cartas={[
        c('🍊', 'Cáscaras de naranja', 'si', 'Material verde.'),
        c('🍖', 'Huesos y restos de carne', 'no', 'Atraen ratas y huelen mal.'),
        c('🍂', 'Hojas secas', 'si', 'Material café: aporta carbono.'),
        c('🥫', 'Una lata', 'no', 'Va en la blanca.'),
        c('☕', 'Pulpa del café', 'si', 'Muy buena para las lombrices.'),
        c('🛢️', 'Aceite de cocina', 'no', 'Se guarda en una botella y se entrega a un punto de recolección.'),
      ]}
      cierre="Verde y café, humedad y aire: así se hace buen abono." />
  )
}

export function EconomiaCircularJuego() {
  return (
    <JuegoDecide titulo="¿Línea o círculo?" pregunta="¿Lineal o circular?" instrucciones="Decide si cada ejemplo es de economía lineal o circular." clave="cien:economia-circular-mejor"
      opciones={[o('lineal', 'Lineal', '➡️'), o('circular', 'Circular', '🔄')]}
      cartas={[
        c('📱', 'Un celular al que no se le puede cambiar la batería', 'lineal', 'Hecho para durar poco.'),
        c('🔧', 'Un taller que repara electrodomésticos', 'circular', 'Alarga la vida de las cosas.'),
        c('☕', 'Volver abono la pulpa del café', 'circular', 'El residuo vuelve al cultivo.'),
        c('🥤', 'Vasos desechables en cada reunión', 'lineal', 'Se usan una vez y se botan.'),
        c('🚲', 'Bicicletas compartidas en el pueblo', 'circular', 'Usar sin tener que comprar.'),
      ]}
      cierre="En la naturaleza no hay basura: todo vuelve al ciclo." />
  )
}
