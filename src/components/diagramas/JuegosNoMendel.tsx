import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» del tema 6 del área 2 (Herencia no mendeliana). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })

export function IncompletaJuego() {
  return (
    <JuegoDecide titulo="¿De qué color sale?" pregunta="¿De qué color es la flor?" instrucciones="En el dondiego de noche, R es rojo y B es blanco, y ninguno domina." clave="cien:incompleta-mejor"
      opciones={[o('r', 'Roja', '🔴'), o('p', 'Rosada', '🌸'), o('b', 'Blanca', '⚪')]}
      cartas={[
        c('🧬', 'RR', 'r', 'Dos alelos rojos: roja.'),
        c('🧬', 'RB', 'p', 'Un alelo de cada uno: un intermedio, rosada.'),
        c('🧬', 'BB', 'b', 'Dos alelos blancos: blanca.'),
        c('🌺', 'Hija de una roja (RR) y una blanca (BB)', 'p', 'Todas las hijas son RB.'),
        c('🌸', 'Hija de dos rosadas que salió BB', 'b', 'En la F2 vuelve a aparecer el blanco.'),
      ]}
      cierre="En la dominancia incompleta, el heterocigoto muestra un intermedio." />
  )
}

export function CodominanciaJuego() {
  return (
    <JuegoDecide titulo="¿Qué tipo de herencia es?" pregunta="¿Cuál es?" instrucciones="Decide qué tipo de dominancia muestra cada ejemplo." clave="cien:codominancia-mejor"
      opciones={[o('com', 'Completa (Mendel)', '🫛'), o('inc', 'Incompleta', '🌸'), o('cod', 'Codominancia', '🐄')]}
      cartas={[
        c('🫛', 'Arveja Aa: amarilla, igual que la AA', 'com', 'El alelo dominante tapa al recesivo.'),
        c('🌸', 'Flor roja × blanca → todas rosadas', 'inc', 'Se ve un intermedio.'),
        c('🐄', 'Vaca roja × blanca → cría con pelos rojos y blancos', 'cod', 'Se ven los dos alelos completos.'),
        c('🩸', 'Persona IᴬIᴮ: tiene marcas A y B', 'cod', 'Los dos alelos se expresan: grupo AB.'),
        c('🐔', 'Gallina negra × blanca → crías con plumas negras y blancas', 'cod', 'Cada pluma muestra un alelo.'),
      ]}
      cierre="Completa: uno tapa al otro. Incompleta: intermedio. Codominancia: se ven los dos." />
  )
}

export function SangreJuego() {
  return (
    <JuegoDecide titulo="¿Qué grupo sanguíneo es?" pregunta="¿Qué grupo tiene?" instrucciones="Mira el genotipo y decide el grupo." clave="cien:sangre-mejor"
      opciones={[o('A', 'A', '🔺'), o('B', 'B', '🔵'), o('AB', 'AB', '🔷'), o('O', 'O', '⭕')]}
      cartas={[
        c('🧬', 'IᴬIᴬ', 'A', 'Solo marcas A.'),
        c('🧬', 'Iᴬi', 'A', 'Iᴬ domina sobre i.'),
        c('🧬', 'IᴮIᴮ', 'B', 'Solo marcas B.'),
        c('🧬', 'Iᴮi', 'B', 'Iᴮ domina sobre i.'),
        c('🧬', 'IᴬIᴮ', 'AB', 'Codominancia: marcas A y B.'),
        c('🧬', 'ii', 'O', 'Sin marcas: grupo O.'),
      ]}
      cierre="Tres alelos, seis genotipos y cuatro grupos." />
  )
}

export function LigadaJuego() {
  return (
    <JuegoDecide titulo="Ligada al X: ¿cierto o falso?" pregunta="¿Es cierto?" instrucciones="Decide si cada frase sobre el daltonismo es cierta o falsa." clave="cien:ligada-mejor"
      opciones={[o('v', 'Cierto', '✅'), o('f', 'Falso', '❌')]}
      cartas={[
        c('👨', 'El daltonismo es más común en hombres', 'v', 'Tienen un solo X: con un alelo d ya son daltónicos.'),
        c('👩', 'Una mujer portadora (XᴰXᵈ) es daltónica', 'f', 'Ve bien: su otro X tiene el alelo D.'),
        c('👦', 'Un hijo recibe su cromosoma X de la madre', 'v', 'Del padre recibe el Y.'),
        c('👧', 'Una hija puede ser daltónica si su padre lo es y su madre es portadora', 'v', 'Recibe Xᵈ del padre y puede recibir Xᵈ de la madre.'),
        c('🧔', 'Un padre daltónico le pasa el daltonismo a todos sus hijos varones', 'f', 'A los hijos les pasa el Y, no el X.'),
      ]}
      cierre="Genes en el X: los hombres los muestran con un solo alelo." />
  )
}

export function GenealogiaJuego() {
  return (
    <JuegoDecide titulo="Leer una genealogía" pregunta="¿Qué representa?" instrucciones="Decide qué representa cada símbolo." clave="cien:genealogia-mejor"
      opciones={[o('hs', 'Hombre sano', '⬜'), o('ms', 'Mujer sana', '⚪'), o('ha', 'Hombre afectado', '⬛'), o('mp', 'Mujer portadora', '◐')]}
      cartas={[
        c('⬜', 'Un cuadrado vacío', 'hs', 'Cuadrado = hombre; vacío = no tiene el rasgo.'),
        c('⚪', 'Un círculo vacío', 'ms', 'Círculo = mujer.'),
        c('⬛', 'Un cuadrado relleno', 'ha', 'Relleno = tiene el rasgo.'),
        c('◐', 'Un círculo relleno a la mitad', 'mp', 'Medio relleno = portadora: tiene el alelo pero no el rasgo.'),
      ]}
      cierre="Cuadrado hombre, círculo mujer, relleno afectado y medio relleno portador." />
  )
}

export function PoligenicaJuego() {
  return (
    <JuegoDecide titulo="¿Un gen o muchos?" pregunta="¿Cómo se hereda?" instrucciones="Decide si el rasgo depende de un gen, de muchos genes o mucho del ambiente." clave="cien:poligenica-mejor"
      opciones={[o('uno', 'Un gen', '1️⃣'), o('muchos', 'Muchos genes', '🔢'), o('amb', 'Sobre todo el ambiente', '🌦️')]}
      cartas={[
        c('🫛', 'Color amarillo o verde de la arveja', 'uno', 'Es el ejemplo clásico de Mendel.'),
        c('📏', 'Estatura de las personas', 'muchos', 'Cientos de genes, más la alimentación.'),
        c('🩸', 'Grupo sanguíneo ABO', 'uno', 'Un gen con tres alelos.'),
        c('🎨', 'Color de la piel', 'muchos', 'Varios genes; por eso hay tantos tonos.'),
        c('💐', 'Color de la hortensia (azul o rosada)', 'amb', 'Depende de la acidez del suelo.'),
        c('🗣️', 'El idioma que habla una persona', 'amb', 'Se aprende: no se hereda en los genes.'),
      ]}
      cierre="Muchos rasgos dependen de muchos genes y del ambiente." />
  )
}
