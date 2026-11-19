import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» del área 6, tema 2 (Nutrición y digestión). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })

export function NutrientesJuego() {
  return (
    <JuegoDecide titulo="¿Para qué sirve?" pregunta="¿Qué aporta sobre todo este alimento?" instrucciones="Decide si cada alimento sirve sobre todo para dar energía, para construir o para regular." clave="cien:nutrientes-mejor"
      opciones={[o('energia', 'Energía', '⚡'), o('construir', 'Construir', '🧱'), o('regular', 'Regular', '⚙️')]}
      cartas={[
        c('🍚', 'Arroz', 'energia', 'Carbohidratos: el combustible principal.'),
        c('🥚', 'Huevo', 'construir', 'Proteínas para músculos y tejidos.'),
        c('🥕', 'Zanahoria', 'regular', 'Vitaminas y minerales.'),
        c('🍌', 'Plátano', 'energia', 'Rico en almidón.'),
        c('🫘', 'Fríjoles', 'construir', 'Proteína vegetal.'),
        c('🍊', 'Naranja', 'regular', 'Vitamina C.'),
        c('🧈', 'Mantequilla', 'energia', 'Grasas: mucha energía guardada.'),
      ]}
      cierre="Un plato completo tiene alimentos de los tres grupos." />
  )
}

export function DigRecorridoJuego() {
  return (
    <JuegoDecide titulo="¿Dónde pasa?" pregunta="¿En qué parte del tubo digestivo ocurre?" instrucciones="Elige el órgano donde pasa cada cosa." clave="cien:dig-recorrido-mejor"
      opciones={[o('boca', 'Boca', '👄'), o('estomago', 'Estómago', '🫃'), o('delgado', 'Intestino delgado', '〰️'), o('grueso', 'Intestino grueso', '🟤')]}
      cartas={[
        c('🦷', 'Los dientes trituran y la saliva moja el alimento', 'boca', 'Empieza la digestión del almidón.'),
        c('🧪', 'Un jugo muy ácido mata microbios y empieza a digerir proteínas', 'estomago', 'El ácido clorhídrico y la pepsina.'),
        c('🩸', 'Los nutrientes pasan a la sangre', 'delgado', 'Por las vellosidades.'),
        c('💧', 'Se recupera agua y se forman las heces', 'grueso', 'Allí viven muchas bacterias útiles.'),
        c('🟢', 'Llegan la bilis y el jugo del páncreas', 'delgado', 'Terminan la digestión química.'),
        c('🦠', 'Las bacterias producen vitamina K', 'grueso', 'La microbiota intestinal.'),
      ]}
      cierre="Boca → esófago → estómago → intestino delgado → intestino grueso → ano." />
  )
}

export function DigMecanicaJuego() {
  return (
    <JuegoDecide titulo="¿Mecánica o química?" pregunta="¿Qué tipo de digestión es?" instrucciones="Decide si cada cosa parte el alimento (mecánica) o cambia sus moléculas (química)." clave="cien:dig-mecanica-mejor"
      opciones={[o('mec', 'Mecánica', '🦷'), o('qui', 'Química', '✂️')]}
      cartas={[
        c('🦷', 'Masticar', 'mec', 'Parte en pedazos sin cambiar la sustancia.'),
        c('🧪', 'La amilasa de la saliva corta el almidón', 'qui', 'Una enzima rompe la molécula.'),
        c('🌀', 'El estómago se contrae y revuelve el alimento', 'mec', 'Mezcla y tritura.'),
        c('✂️', 'La pepsina corta las proteínas', 'qui', 'En el estómago, con ácido.'),
        c('🫧', 'La bilis parte la grasa en gotitas', 'mec', 'No la cambia: la separa para que la lipasa trabaje.'),
        c('🟡', 'La lipasa convierte la grasa en ácidos grasos', 'qui', 'Viene del páncreas.'),
      ]}
      cierre="Mecánica: pedazos más pequeños. Química: moléculas más pequeñas." />
  )
}

export function DigAbsorcionJuego() {
  return (
    <JuegoDecide titulo="¿Pasa a la sangre?" pregunta="¿Esto se absorbe en el intestino delgado?" instrucciones="Decide si cada cosa se absorbe o sigue de largo." clave="cien:dig-absorcion-mejor"
      opciones={[o('si', 'Se absorbe', '🩸'), o('no', 'Sigue de largo', '➡️')]}
      cartas={[
        c('🍬', 'Glucosa', 'si', 'Es pequeña: pasa a la sangre.'),
        c('🥦', 'Fibra (celulosa)', 'no', 'No la digerimos: ayuda a formar las heces.'),
        c('🧩', 'Aminoácidos', 'si', 'Salen de digerir las proteínas.'),
        c('🍞', 'Un pedazo de almidón sin digerir', 'no', 'Es muy grande: primero hay que cortarlo.'),
        c('🟡', 'Ácidos grasos', 'si', 'Pasan sobre todo a los vasos linfáticos.'),
      ]}
      cierre="Solo pasan a la sangre las moléculas pequeñas." />
  )
}

export function DigAnimalesJuego() {
  return (
    <JuegoDecide titulo="¿De quién es?" pregunta="¿A qué animal le pertenece?" instrucciones="Decide de qué animal es cada parte o costumbre." clave="cien:dig-animales-mejor"
      opciones={[o('vaca', 'Vaca', '🐄'), o('gallina', 'Gallina', '🐔'), o('humano', 'Persona', '🧍')]}
      cartas={[
        c('🌀', 'Rumen, retículo, omaso y abomaso', 'vaca', 'Un estómago de cuatro cámaras.'),
        c('🪨', 'Una molleja con piedritas que muele el grano', 'gallina', 'Reemplaza a los dientes.'),
        c('🔁', 'Devuelve el pasto a la boca para masticarlo otra vez', 'vaca', 'Eso es rumiar.'),
        c('🎒', 'Guarda el maíz en el buche', 'gallina', 'El buche almacena y ablanda.'),
        c('🦷', 'Tiene dientes y un estómago simple', 'humano', 'Somos omnívoros.'),
        c('🦠', 'Bacterias que digieren la celulosa del pasto', 'vaca', 'Viven en el rumen.'),
      ]}
      cierre="Cada sistema digestivo está adaptado a lo que come el animal." />
  )
}
