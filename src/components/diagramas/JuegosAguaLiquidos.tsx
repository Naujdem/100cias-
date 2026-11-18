import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» del agua, los líquidos y los sólidos (Química área 4, tema 3). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })

export function EnlacePuenteJuego() {
  return (
    <JuegoDecide titulo="¿Dentro o entre?" pregunta="¿Qué se rompe o qué actúa?" instrucciones="Enlace covalente: une el O con los H dentro de la molécula. Puente de hidrógeno: une una molécula con otra." clave="cien:enlace-puente-mejor"
      opciones={[o('en', 'Enlace covalente', '🔗'), o('pu', 'Puente de hidrógeno', '〰️')]}
      cartas={[
        c('♨️', 'El agua hierve y se vuelve vapor', 'pu', 'Las moléculas se separan, pero siguen siendo H₂O.'),
        c('⚡', 'La electrólisis separa el agua en hidrógeno y oxígeno', 'en', 'Se rompen las moléculas: es un cambio químico.'),
        c('🧊', 'El hielo se derrite', 'pu', 'Se rompe parte de la red de puentes.'),
        c('💧', 'Dos gotas se juntan en una', 'pu', 'Las moléculas se atraen entre sí.'),
        c('🔥', 'El hidrógeno se quema con oxígeno y forma agua', 'en', 'Se forman enlaces nuevos.'),
        c('🌫️', 'La ropa se seca al sol', 'pu', 'Evaporación: las moléculas se separan.'),
      ]}
      cierre="Los cambios de estado rompen puentes; las reacciones rompen enlaces." />
  )
}

export function TensionJuego() {
  return (
    <JuegoDecide titulo="Tela de agua" pregunta="¿Qué lo explica?" instrucciones="Tensión superficial: la superficie actúa como una tela. Capilaridad: el agua sube por espacios delgados." clave="cien:tension-mejor"
      opciones={[o('ts', 'Tensión superficial', '🕸️'), o('ca', 'Capilaridad', '🌱')]}
      cartas={[
        c('🪲', 'Un zapatero camina sobre la quebrada', 'ts', 'La superficie lo sostiene.'),
        c('🧻', 'La toalla de papel absorbe el jugo regado', 'ca', 'El agua sube entre las fibras.'),
        c('💧', 'Las gotas son redondas', 'ts', 'La superficie se encoge lo más posible.'),
        c('🌳', 'El agua sube desde la raíz hasta las hojas', 'ca', 'Por tubitos muy delgados (con ayuda de la transpiración).'),
        c('📎', 'Un clip puesto con cuidado flota en el agua', 'ts', 'No flota por densidad: lo sostiene la superficie.'),
        c('🕯️', 'La cera derretida sube por la mecha de la vela', 'ca', 'Capilaridad en las fibras de la mecha.'),
        c('🧼', 'El jabón hace que el clip se hunda', 'ts', 'El jabón rompe la tensión superficial.'),
        c('🧱', 'La humedad sube por la pared desde el piso', 'ca', 'Por los poros del ladrillo.'),
      ]}
      cierre="Las dos vienen de que las moléculas de agua se atraen mucho entre sí." />
  )
}

export function CalorAguaJuego() {
  return (
    <JuegoDecide titulo="¿Quién se calienta primero?" pregunta="¿Cuál se calienta (o cambia de temperatura) más rápido?" instrucciones="El agua tiene un calor específico muy alto: le cuesta calentarse y enfriarse." clave="cien:calor-agua-mejor"
      opciones={[o('a', 'El primero', '⬅️'), o('b', 'El segundo', '➡️')]}
      cartas={[
        c('🍳', 'Una sartén vacía o una olla con agua (mismo fuego)', 'a', 'El metal tiene un calor específico bajo.'),
        c('🏖️', 'La arena o el mar al mediodía', 'a', 'La arena quema; el agua sigue fresca.'),
        c('🌵', 'La Tatacoa o la costa del Caribe (cambio entre día y noche)', 'a', 'En el desierto, con poca agua, el día es muy caliente y la noche fresca.'),
        c('🚗', 'Una carrocería al sol o el agua del radiador', 'a', 'Por eso el motor se enfría con agua.'),
        c('🥔', 'Una papa cocida o el aire de la cocina (enfriándose)', 'b', 'La papa, llena de agua, guarda el calor mucho tiempo.'),
        c('🏊', 'El agua de la piscina o las baldosas del borde', 'b', 'Las baldosas se calientan mucho más rápido.'),
      ]}
      cierre="El agua amortigua los cambios de temperatura: en el mar, en el clima y en nuestro cuerpo." />
  )
}

export function HieloJuego() {
  return (
    <JuegoDecide titulo="Hielo raro" pregunta="¿Qué pasa?" instrucciones="Al congelarse, el agua se expande y queda menos densa (0,92 g/mL)." clave="cien:hielo-mejor"
      opciones={[o('flota', 'Flota o queda arriba', '⬆️'), o('rompe', 'Se expande y rompe', '💥'), o('hunde', 'Se hunde', '⬇️')]}
      cartas={[
        c('🧊', 'Un cubo de hielo en un vaso de agua', 'flota', 'Es menos denso que el agua.'),
        c('🍾', 'Una botella de vidrio llena de agua en el congelador', 'rompe', 'El agua ocupa más al congelarse.'),
        c('🪨', 'Agua que se mete en las grietas de una roca del páramo y se congela', 'rompe', 'Así se fracturan las rocas.'),
        c('🧈', 'Un trozo de mantequilla sólida en mantequilla derretida', 'hunde', 'La mayoría de sólidos son más densos que su líquido.'),
        c('🏔️', 'Un témpano en el mar', 'flota', 'Solo se ve la punta: la mayor parte está debajo.'),
        c('🚰', 'El tubo del agua en una noche de helada en el páramo', 'rompe', 'Por eso se rompen las tuberías.'),
        c('🕯️', 'Un pedazo de cera sólida en cera derretida', 'hunde', 'La cera se porta como casi todo: el sólido es más denso.'),
      ]}
      cierre="El agua es rara: su sólido flota. Gracias a eso los lagos no se congelan hasta el fondo." />
  )
}

export function EbullicionJuego() {
  return (
    <JuegoDecide titulo="¿Hierve antes o después?" pregunta="Comparado con 100 °C a nivel del mar, el agua hierve…" instrucciones="Hierve cuando su presión de vapor iguala la presión que tiene encima." clave="cien:ebullicion-mejor" tiempo={12}
      opciones={[o('menos', 'A menos de 100 °C', '⬇️'), o('mas', 'A más de 100 °C', '⬆️'), o('igual', 'A unos 100 °C', '⚖️')]}
      cartas={[
        c('🏙️', 'En Bogotá', 'menos', 'Unos 92 °C.'),
        c('🍲', 'Dentro de una olla a presión', 'mas', 'Unos 120 °C: por eso cocina más rápido.'),
        c('🏖️', 'En Cartagena', 'igual', 'A nivel del mar.'),
        c('🏔️', 'En la cima del Nevado del Huila', 'menos', 'Más o menos 83 °C.'),
        c('🧂', 'Agua con mucha sal en Cartagena', 'mas', 'Un poquito más: lo verás en propiedades coligativas.'),
        c('🌄', 'En Neiva', 'igual', 'Unos 98 °C: casi igual.'),
      ]}
      cierre="En la montaña el agua hierve antes, pero está menos caliente: los fríjoles se demoran más." />
  )
}

export function SolidoJuego() {
  return (
    <JuegoDecide titulo="¿Ordenado o desordenado?" pregunta="¿Qué tipo de sólido es?" instrucciones="Cristalino: partículas en orden, se funde a una temperatura fija. Amorfo: sin orden, se ablanda poco a poco." clave="cien:solido-mejor"
      opciones={[o('cr', 'Cristalino', '💎'), o('am', 'Amorfo', '🫙')]}
      cartas={[
        c('🧂', 'Sal de cocina', 'cr', 'Cubitos: red de Na⁺ y Cl⁻.'),
        c('🪟', 'Vidrio de una ventana', 'am', 'Sílice sin orden.'),
        c('🍬', 'Azúcar', 'cr', 'Granos con caras planas.'),
        c('🕯️', 'Cera de vela', 'am', 'Se ablanda antes de derretirse.'),
        c('🧊', 'Hielo', 'cr', 'Red hexagonal.'),
        c('🥤', 'Plástico de una botella', 'am', 'Cadenas largas enredadas.'),
        c('💎', 'Esmeralda de Muzo', 'cr', 'Cristal de berilo.'),
        c('🍭', 'Caramelo duro (dulce de azúcar fundida)', 'am', 'El azúcar se enfrió tan rápido que no alcanzó a ordenarse.'),
      ]}
      cierre="Una misma sustancia puede ser cristalina o amorfa: azúcar y caramelo." />
  )
}
