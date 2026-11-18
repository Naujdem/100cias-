import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» del área 5, tema 9 (Sostenibilidad y acción ambiental). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })

export function DesarrolloSostenibleJuego() {
  return (
    <JuegoDecide titulo="¿Qué dimensión?" pregunta="¿Ambiental, social o económica?" instrucciones="Decide a qué dimensión de la sostenibilidad pertenece cada tarjeta." clave="cien:desarrollo-sostenible-mejor"
      opciones={[o('amb', 'Ambiental', '🌳'), o('soc', 'Social', '🤝'), o('eco', 'Económica', '💰')]}
      cartas={[
        c('💧', 'Proteger los nacimientos de agua', 'amb', 'Cuida los ecosistemas.'),
        c('🏫', 'Que todos los niños de la vereda estudien', 'soc', 'Equidad y educación.'),
        c('☕', 'Un precio justo por el café', 'eco', 'Con qué vivir dignamente.'),
        c('🗣️', 'Respetar la lengua y la cultura de un pueblo indígena', 'soc', 'Las culturas también se sostienen.'),
        c('🌱', 'Recuperar el suelo con abonos orgánicos', 'amb', 'Cuida un recurso.'),
        c('🛒', 'Un mercado campesino que venda directo', 'eco', 'Más ingreso para quien produce.'),
      ]}
      cierre="Lo sostenible cuida las tres al mismo tiempo." />
  )
}

export function OdsJuego() {
  return (
    <JuegoDecide titulo="¿Qué ODS?" pregunta="¿A qué objetivo ayuda más?" instrucciones="Elige el ODS ambiental que más se relaciona con cada acción." clave="cien:ods-mejor"
      opciones={[o('6', '6 · Agua', '💧'), o('7', '7 · Energía', '⚡'), o('13', '13 · Clima', '🌡️'), o('15', '15 · Vida terrestre', '🌳')]}
      cartas={[
        c('🚽', 'Construir un pozo séptico', '6', 'Saneamiento.'),
        c('☀️', 'Paneles solares en la escuela', '7', 'Energía limpia.'),
        c('🦜', 'Proteger el hábitat del loro orejiamarillo', '15', 'Biodiversidad terrestre.'),
        c('🛢️', 'Recoger agua lluvia para la sequía', '13', 'Adaptación al clima.'),
        c('🪓', 'Frenar la tala de un bosque', '15', 'Y también ayuda al 13.'),
      ]}
      cierre="Los ODS están conectados: una acción puede ayudar a varios." />
  )
}

export function PraeJuego() {
  return (
    <JuegoDecide titulo="¿Es PRAE?" pregunta="¿Así se hace un buen PRAE?" instrucciones="Decide si cada idea corresponde a un buen Proyecto Ambiental Escolar." clave="cien:prae-mejor"
      opciones={[o('si', 'Sí', '✅'), o('no', 'No', '❌')]}
      cartas={[
        c('🗺️', 'Partir de un problema ambiental de la vereda', 'si', 'El territorio es el punto de partida.'),
        c('🧹', 'Hacer solo una jornada de aseo al año', 'no', 'Un PRAE es un proceso, no un evento.'),
        c('📚', 'Que lo trabajen todas las áreas', 'si', 'Matemáticas, lenguaje, sociales… todas aportan.'),
        c('👵', 'Escuchar a las familias y a los mayores', 'si', 'Conocen la historia del territorio.'),
        c('🔬', 'Que sea solo tarea del profe de Ciencias', 'no', 'Es de toda la comunidad educativa.'),
      ]}
      cierre="Un buen PRAE nace del territorio y es de todos." />
  )
}

export function ProyectoAulaJuego() {
  return (
    <JuegoDecide titulo="¿Causa o efecto?" pregunta="En el árbol, ¿es raíz o rama?" instrucciones="Problema: «la quebrada está contaminada». Decide si cada tarjeta es una causa (raíz) o un efecto (rama)." clave="cien:proyecto-aula-mejor"
      opciones={[o('causa', 'Causa (raíz)', '🌱'), o('efecto', 'Efecto (rama)', '🍂')]}
      cartas={[
        c('🚽', 'Las casas vierten aguas negras', 'causa', 'Origina el problema.'),
        c('🐟', 'Ya no se ven peces', 'efecto', 'Es una consecuencia.'),
        c('🤢', 'Los niños se enferman del estómago', 'efecto', 'Consecuencia para la salud.'),
        c('🧪', 'Los envases de agroquímicos se tiran al agua', 'causa', 'Origina el problema.'),
        c('🐄', 'El ganado bebe y defeca en la orilla', 'causa', 'Origina el problema.'),
      ]}
      cierre="Las soluciones van a las raíces." />
  )
}

export function ParticipacionJuego() {
  return (
    <JuegoDecide titulo="¿Qué herramienta?" pregunta="¿Qué herramienta usarías?" instrucciones="Elige la herramienta de participación que corresponde a cada situación." clave="cien:participacion-mejor"
      opciones={[o('peticion', 'Derecho de petición', '✉️'), o('tutela', 'Tutela', '⚖️'), o('consulta', 'Consulta previa', '🪶'), o('veeduria', 'Veeduría', '👀')]}
      cartas={[
        c('❓', 'Saber qué permisos tiene una obra cerca del río', 'peticion', 'Pedir información a la autoridad.'),
        c('🏗️', 'Una empresa quiere un proyecto en un resguardo indígena', 'consulta', 'Es obligatoria para pueblos étnicos.'),
        c('🚱', 'El agua contaminada enferma a la comunidad y nadie responde', 'tutela', 'Se vulneran derechos como la salud y la vida.'),
        c('🧾', 'Vigilar que el acueducto veredal se construya bien', 'veeduria', 'Control ciudadano a lo público.'),
      ]}
      cierre="La Constitución nos da herramientas: hay que conocerlas y usarlas." />
  )
}
