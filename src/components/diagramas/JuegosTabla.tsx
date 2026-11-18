import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» de la tabla periódica (Química área 2, tema 4). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })

export function HistoriaTablaJuego() {
  return (
    <JuegoDecide titulo="¿Quién lo propuso?" pregunta="¿De quién es la idea?" instrucciones="Decide qué científico propuso cada idea para ordenar los elementos." clave="cien:historia-tabla-mejor"
      opciones={[o('d', 'Döbereiner', '3️⃣'), o('n', 'Newlands', '🎵'), o('m', 'Mendeléiev', '❓'), o('mo', 'Moseley', '🔢')]}
      cartas={[
        c('3️⃣', 'Grupos de tres elementos parecidos', 'd', 'Las tríadas, como calcio, estroncio y bario.'),
        c('🎵', 'Las propiedades se repiten cada ocho elementos', 'n', 'La ley de las octavas.'),
        c('❓', 'Dejó espacios para elementos aún no descubiertos', 'm', 'Predijo el galio y el germanio.'),
        c('🔢', 'Ordenar por número atómico y no por masa', 'mo', 'Así el telurio queda antes que el yodo.'),
        c('🔮', 'Predijo la masa y la densidad del «eka-aluminio»', 'm', 'Se confirmó con el galio en 1875.'),
      ]}
      cierre="La tabla actual ordena por número atómico: las propiedades se repiten periódicamente." />
  )
}

export function GrupoPeriodoJuego() {
  return (
    <JuegoDecide titulo="¿Grupo o periodo?" pregunta="¿Comparten grupo o periodo?" instrucciones="Grupo = columna (misma valencia). Periodo = fila (mismo número de niveles)." clave="cien:grupo-periodo-mejor"
      opciones={[o('g', 'Mismo grupo', '⬇️'), o('p', 'Mismo periodo', '➡️')]}
      cartas={[
        c('🧂', 'Sodio y potasio', 'g', 'Ambos en el grupo 1: un electrón de valencia.'),
        c('🧂', 'Sodio y cloro', 'p', 'Ambos en el periodo 3: tres niveles.'),
        c('🧪', 'Flúor, cloro y bromo', 'g', 'Grupo 17, los halógenos.'),
        c('🎈', 'Litio, carbono y neón', 'p', 'Periodo 2.'),
        c('🎈', 'Helio, neón y argón', 'g', 'Grupo 18, los gases nobles.'),
        c('🔩', 'Potasio, hierro y kriptón', 'p', 'Periodo 4.'),
      ]}
      cierre="Los del mismo grupo se parecen químicamente; los del mismo periodo tienen los mismos niveles." />
  )
}

export function MetalJuego() {
  return (
    <JuegoDecide titulo="¿Metal o no metal?" pregunta="¿Qué es?" instrucciones="Usa las propiedades: brillo, conducción, si se dobla o se quiebra." clave="cien:metal-mejor"
      opciones={[o('m', 'Metal', '🔩'), o('n', 'No metal', '💨'), o('s', 'Metaloide', '💻')]}
      cartas={[
        c('🔌', 'Cobre: brillante, conduce y se estira en cables', 'm', 'Es el metal de los cables eléctricos.'),
        c('🟡', 'Azufre: amarillo, opaco y se quiebra', 'n', 'Un no metal sólido.'),
        c('💻', 'Silicio: brilla, pero es quebradizo y semiconductor', 's', 'Base de los chips.'),
        c('🫁', 'Oxígeno: gas que respiramos', 'n', 'Muchos no metales son gases.'),
        c('🌡️', 'Mercurio: líquido, brillante y conduce', 'm', 'El único metal líquido a temperatura ambiente.'),
        c('✏️', 'Carbono como grafito de lápiz', 'n', 'Es un no metal, aunque el grafito conduce: ¡una excepción!'),
      ]}
      cierre="Metales a la izquierda, no metales a la derecha y metaloides en la escalera." />
  )
}

export function FamiliaJuego() {
  return (
    <JuegoDecide titulo="¿De qué familia es?" pregunta="¿A qué familia pertenece?" instrucciones="Ubica cada pista en su familia de la tabla." clave="cien:familia-mejor"
      opciones={[o('a', 'Alcalinos (1)', '💥'), o('t', 'Alcalinotérreos (2)', '🦴'), o('h', 'Halógenos (17)', '🧪'), o('g', 'Gases nobles (18)', '🎈')]}
      cartas={[
        c('💥', 'El sodio reacciona violentamente con el agua', 'a', 'Los alcalinos son muy reactivos.'),
        c('🎈', 'El helio de los globos casi no reacciona', 'g', 'Su última capa está llena.'),
        c('🏊', 'El cloro desinfecta el agua de las piscinas', 'h', 'Los halógenos forman sales con los metales.'),
        c('🦴', 'El calcio de los huesos y la cal', 't', 'Grupo 2: dos electrones de valencia.'),
        c('💡', 'El neón brilla en los avisos luminosos', 'g', 'Los gases nobles emiten luz con electricidad.'),
        c('🦷', 'El flúor de la crema dental', 'h', 'El halógeno más reactivo.'),
        c('🔋', 'El litio de las baterías', 'a', 'Un metal alcalino liviano.'),
      ]}
      cierre="Los elementos de una misma familia tienen la misma cantidad de electrones de valencia." />
  )
}

export function ColombiaElementosJuego() {
  return (
    <JuegoDecide titulo="¿Qué elemento es?" pregunta="¿Qué elemento sale de aquí?" instrucciones="Relaciona cada lugar de Colombia con el elemento que se extrae o se usa." clave="cien:colombia-elementos-mejor"
      opciones={[o('au', 'Oro / platino', '🥇'), o('ni', 'Níquel / hierro', '🔩'), o('c', 'Carbono (carbón)', '⚫'), o('na', 'Sodio y cloro (sal)', '🧂')]}
      cartas={[
        c('⛏️', 'Cerro Matoso, en Córdoba', 'ni', 'Mina de ferroníquel.'),
        c('🏜️', 'El Cerrejón, en La Guajira', 'c', 'Mina de carbón a cielo abierto.'),
        c('⛪', 'La Catedral de Sal de Zipaquirá', 'na', 'Una mina de cloruro de sodio.'),
        c('🌊', 'Los ríos del Chocó', 'au', 'Oro y platino de aluvión.'),
        c('🏭', 'Paz de Río, en Boyacá', 'ni', 'Hierro para la siderurgia.'),
        c('🏺', 'Las piezas del Museo del Oro', 'au', 'Orfebrería precolombina en oro y tumbaga.'),
      ]}
      cierre="La tabla periódica también está en el territorio: minería, sal, carbón y orfebrería." />
  )
}
