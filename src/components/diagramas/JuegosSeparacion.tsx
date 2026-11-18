import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» de Química, área 1, tema 6 (Separación de mezclas). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })

export function SepararHeteroJuego() {
  return (
    <JuegoDecide titulo="¿Con qué lo separo?" pregunta="¿Qué método usarías?" instrucciones="Elige el método para separar cada mezcla heterogénea." clave="cien:separar-hetero-mejor"
      opciones={[o('tam', 'Tamizado', '🕸️'), o('fil', 'Filtración', '☕'), o('dec', 'Decantación', '🫗'), o('ima', 'Imantación', '🧲')]}
      cartas={[
        c('🏗️', 'Arena y piedras para la obra', 'tam', 'La zaranda deja pasar la arena.'),
        c('☕', 'El tinto y el café molido', 'fil', 'El colador retiene el café molido.'),
        c('🫒', 'Aceite y agua', 'dec', 'El aceite flota; se separan las capas.'),
        c('🔩', 'Puntillas revueltas con aserrín', 'ima', 'El imán atrae el hierro.'),
        c('🌾', 'Harina con grumos', 'tam', 'El cedazo retiene los grumos.'),
        c('🟤', 'Agua con barro que se dejó quieta', 'dec', 'El barro se asienta y se vierte el agua de arriba.'),
        c('🍊', 'El jugo de naranja y las semillas', 'fil', 'El colador retiene las semillas y el bagazo.'),
        c('🧲', 'Limaduras de hierro y azufre', 'ima', 'Solo el hierro es atraído.'),
      ]}
      cierre="Tamaño distinto: tamiz. Sólido en líquido: filtro. Líquidos que no se mezclan o sólido que se asienta: decantación. Hierro: imán." />
  )
}

export function SepararHomoJuego() {
  return (
    <JuegoDecide titulo="Mezclas que no se ven" pregunta="¿Qué método usarías?" instrucciones="Las mezclas homogéneas no se separan con un filtro. Elige el método." clave="cien:separar-homo-mejor"
      opciones={[o('eva', 'Evaporación', '♨️'), o('des', 'Destilación', '⚗️'), o('cro', 'Cromatografía', '🌈'), o('fil', 'Filtración', '☕')]}
      cartas={[
        c('🧂', 'Sacar la sal del agua de mar', 'eva', 'Así funcionan las salinas de Manaure.'),
        c('🍶', 'Separar el alcohol del guarapo fermentado', 'des', 'El alcohol hierve antes que el agua.'),
        c('🖊️', 'Ver qué colores tiene la tinta de un marcador', 'cro', 'Cada color sube distinto por el papel.'),
        c('🍬', 'Obtener panela del guarapo', 'eva', 'Se hierve hasta que se va casi toda el agua.'),
        c('🏖️', 'Arena en el agua del río', 'fil', '¡Cuidado! Esta es heterogénea: con el filtro basta.'),
        c('💧', 'Obtener agua pura del agua de la llave', 'des', 'Se evapora el agua y se condensa sin las sales.'),
        c('🍃', 'Separar los pigmentos de una hoja verde', 'cro', 'Aparecen verdes y amarillos.'),
      ]}
      cierre="Sólido disuelto: evaporación. Dos líquidos mezclados o agua pura: destilación. Colores: cromatografía." />
  )
}

export function CafeSeparaJuego() {
  return (
    <JuegoDecide titulo="Separar en el beneficio" pregunta="¿Qué se aprovecha en este paso?" instrucciones="En el beneficio del café se separa varias veces. ¿Qué propiedad se usa en cada paso?" clave="cien:cafe-separa-mejor"
      opciones={[o('den', 'La densidad', '🛟'), o('tam', 'El tamaño', '🕸️'), o('eva', 'La evaporación', '☀️')]}
      cartas={[
        c('🪣', 'Echar las cerezas al tanque: las vanas flotan', 'den', 'Las cerezas vanas o brocadas son menos densas.'),
        c('🕸️', 'Pasar el grano por la zaranda tras despulpar', 'tam', 'Los granos con pulpa no pasan.'),
        c('☀️', 'Secar el café en la marquesina', 'eva', 'El agua del grano se evapora.'),
        c('🚿', 'Lavar el grano fermentado: el «flote» se retira', 'den', 'Los granos que flotan son de menor calidad.'),
        c('🟤', 'Clasificar el pergamino seco por tamaño', 'tam', 'Las mallas separan el grano por tamaño.'),
      ]}
      cierre="En la finca se separan mezclas todos los días: por densidad, por tamaño y por evaporación." />
  )
}
