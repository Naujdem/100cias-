import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» del tema 7 del área 2 (Mutaciones y variación). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })
const VF = [o('v', 'Cierto', '✅'), o('f', 'Falso', '❌')]

export function QueEsMutacionJuego() {
  return (
    <JuegoDecide titulo="¿Somática o germinal?" pregunta="¿Pasa a los hijos?" instrucciones="Decide si la mutación ocurre en una célula del cuerpo (somática) o en un óvulo o espermatozoide (germinal)." clave="cien:que-es-mutacion-mejor"
      opciones={[o('som', 'Somática: no pasa a los hijos', '🧍'), o('ger', 'Germinal: pasa a los hijos', '👶')]}
      cartas={[
        c('☀️', 'Una mutación en una célula de la piel por el sol', 'som', 'Afecta solo a esa persona.'),
        c('🥚', 'Una mutación en un óvulo', 'ger', 'Si ese óvulo es fecundado, el hijo la tendrá en todas sus células.'),
        c('🫁', 'Una mutación en el pulmón por el humo del tabaco', 'som', 'No se hereda.'),
        c('🧬', 'Una mutación en un espermatozoide', 'ger', 'Puede pasar a la siguiente generación.'),
        c('🟤', 'Un lunar que aparece en la adultez', 'som', 'Es un cambio en células de la piel.'),
      ]}
      cierre="Solo las mutaciones germinales pasan a los hijos." />
  )
}

export function PuntualesJuego() {
  return (
    <JuegoDecide titulo="¿Qué tipo de mutación es?" pregunta="¿Qué tipo es?" instrucciones="Usa la rueda de codones si la necesitas." clave="cien:puntuales-mejor"
      opciones={[o('sil', 'Silenciosa', '🤫'), o('cam', 'Cambio de sentido', '🔀'), o('sin', 'Sin sentido', '🛑'), o('cor', 'Corrimiento', '↪️')]}
      cartas={[
        c('🔤', 'GGA → GGU (glicina → glicina)', 'sil', 'El aminoácido no cambia.'),
        c('🔤', 'GAG → GUG (Glu → Val)', 'cam', 'Cambia un aminoácido: es la de la anemia falciforme.'),
        c('🔤', 'UGG → UGA (Trp → parada)', 'sin', 'Aparece una parada antes de tiempo.'),
        c('➖', 'Se pierde una base en medio del gen', 'cor', 'Todos los codones siguientes se leen corridos.'),
        c('➕', 'Se agrega una base en medio del gen', 'cor', 'También corre el marco de lectura.'),
        c('🔤', 'AAA → AAG (lisina → lisina)', 'sil', 'El código es redundante.'),
      ]}
      cierre="Sustituciones: silenciosa, de cambio de sentido o sin sentido. Quitar o agregar: corrimiento." />
  )
}

export function EfectosJuego() {
  return (
    <JuegoDecide titulo="¿Dañina, neutra o útil?" pregunta="¿Qué efecto tiene?" instrucciones="Decide el efecto más común de cada mutación." clave="cien:efectos-mejor"
      opciones={[o('dan', 'Dañina', '⚠️'), o('neu', 'Neutra', '➖'), o('uti', 'Útil', '⭐')]}
      cartas={[
        c('🤫', 'Una mutación silenciosa', 'neu', 'No cambia la proteína.'),
        c('🥛', 'Poder digerir la leche de adulto', 'uti', 'Fue útil en pueblos que criaban ganado.'),
        c('🩸', 'Hemofilia: la sangre no coagula bien', 'dan', 'Causa sangrados difíciles de detener.'),
        c('🦠', 'Una bacteria que resiste a un antibiótico', 'uti', 'Útil para la bacteria… un problema para nosotros.'),
        c('👁️', 'Ojos de color azul', 'neu', 'No afecta la supervivencia.'),
      ]}
      cierre="La mayoría son neutras; algunas son dañinas y unas pocas, útiles según el ambiente." />
  )
}

export function NumericasJuego() {
  return (
    <JuegoDecide titulo="Número de cromosomas" pregunta="¿Es cierto?" instrucciones="Decide si cada frase es cierta o falsa." clave="cien:numericas-mejor" opciones={VF}
      cartas={[
        c('2️⃣1️⃣', 'El síndrome de Down se debe a tres cromosomas 21', 'v', 'Es una trisomía: 47 cromosomas.'),
        c('🔀', 'Suele originarse cuando un par no se separa en la meiosis', 'v', 'Se llama no disyunción.'),
        c('🧪', 'Se contagia de una persona a otra', 'f', 'No es una infección: es un cambio en los cromosomas.'),
        c('🍓', 'Algunas plantas cultivadas tienen muchos juegos de cromosomas', 'v', 'Como la fresa o el trigo (poliploidía).'),
        c('❌', 'Una persona con síndrome de Down no tiene el cromosoma 21', 'f', 'Tiene una copia de más.'),
      ]}
      cierre="Un cromosoma de más o de menos cambia el desarrollo de todo el organismo." />
  )
}

export function CromosomicasJuego() {
  return (
    <JuegoDecide titulo="¿Qué le pasó al cromosoma?" pregunta="¿Qué tipo es?" instrucciones="El cromosoma original es A-B-C-D-E-F." clave="cien:cromosomicas-mejor"
      opciones={[o('del', 'Deleción', '➖'), o('dup', 'Duplicación', '➕'), o('inv', 'Inversión', '🔃'), o('tra', 'Translocación', '🔀')]}
      cartas={[
        c('🧬', 'A-B-D-E-F', 'del', 'Se perdió C.'),
        c('🧬', 'A-B-C-C-D-E-F', 'dup', 'C está repetido.'),
        c('🧬', 'A-B-E-D-C-F', 'inv', 'El trozo C-D-E se dio la vuelta.'),
        c('🧬', 'A-B-C-X-Y', 'tra', 'D-E-F se cambió por un trozo de otro cromosoma.'),
        c('🧬', 'A-D-C-B-E-F', 'inv', 'El trozo B-C-D está al revés.'),
      ]}
      cierre="Deleción, duplicación, inversión y translocación cambian la estructura del cromosoma." />
  )
}

export function VariacionJuego() {
  return (
    <JuegoDecide titulo="¿De dónde sale la variación?" pregunta="¿Qué fuente es?" instrucciones="Decide de qué fuente de variación se trata." clave="cien:variacion-mejor"
      opciones={[o('mut', 'Mutación', '🧬'), o('rec', 'Recombinación', '🔀'), o('fec', 'Fecundación', '💞')]}
      cartas={[
        c('🆕', 'Aparece un alelo que nunca había existido', 'mut', 'Solo las mutaciones crean alelos nuevos.'),
        c('✂️', 'Dos cromosomas de un par intercambian trozos', 'rec', 'Ocurre en la meiosis (entrecruzamiento).'),
        c('🎲', 'Se junta un óvulo cualquiera con un espermatozoide cualquiera', 'fec', 'Cada hijo recibe una combinación distinta.'),
        c('🃏', 'Los cromosomas de la madre y del padre se reparten al azar en los gametos', 'rec', 'Es la distribución independiente en la meiosis.'),
      ]}
      cierre="Mutación crea alelos; recombinación y fecundación los combinan." />
  )
}
