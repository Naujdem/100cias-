import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» del área 6, tema 3 (Respiración y circulación). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })

export function VentilacionJuego() {
  return (
    <JuegoDecide titulo="¿Entra o sale el aire?" pregunta="¿Inspiración o espiración?" instrucciones="Decide si cada cosa pasa al inspirar o al espirar." clave="cien:ventilacion-mejor"
      opciones={[o('ins', 'Inspiración', '⬇️'), o('esp', 'Espiración', '⬆️')]}
      cartas={[
        c('⬇️', 'El diafragma baja', 'ins', 'El pecho se agranda y entra el aire.'),
        c('🎈', 'Inflas una bomba', 'esp', 'Sacas el aire de los pulmones.'),
        c('⬆️', 'El diafragma sube', 'esp', 'El pecho se achica y el aire sale.'),
        c('🌸', 'Hueles una flor', 'ins', 'El aire entra por la nariz.'),
        c('🪟', 'Empañas un vidrio', 'esp', 'El aire que sale lleva vapor de agua.'),
      ]}
      cierre="Inspirar: el diafragma baja y entra el aire. Espirar: sube y sale." />
  )
}

export function AlveoloJuego() {
  return (
    <JuegoDecide titulo="¿Hacia dónde va?" pregunta="En el alvéolo, ¿este gas pasa a la sangre o sale al aire?" instrucciones="Decide hacia dónde va cada cosa en el intercambio de gases." clave="cien:alveolo-mejor"
      opciones={[o('sangre', 'A la sangre', '🩸'), o('aire', 'Al aire', '🌬️')]}
      cartas={[
        c('🔵', 'El oxígeno del aire que respiras', 'sangre', 'Lo llevan los glóbulos rojos.'),
        c('⚫', 'El dióxido de carbono que hicieron las células', 'aire', 'Sale al espirar.'),
        c('💧', 'Vapor de agua', 'aire', 'Por eso se empaña el vidrio.'),
        c('🔴', 'El O₂ que se unirá a la hemoglobina', 'sangre', 'La hemoglobina lo transporta.'),
      ]}
      cierre="Entra el O₂, sale el CO₂: siempre del lado donde hay más hacia donde hay menos." />
  )
}

export function CorazonJuego() {
  return (
    <JuegoDecide titulo="Lado derecho o izquierdo" pregunta="¿Qué lado del corazón es?" instrucciones="Decide si cada cosa corresponde al lado derecho o al izquierdo del corazón." clave="cien:corazon-mejor"
      opciones={[o('der', 'Derecho', '🔵'), o('izq', 'Izquierdo', '🔴')]}
      cartas={[
        c('🫁', 'Manda la sangre a los pulmones', 'der', 'Circulación menor.'),
        c('🦶', 'Manda la sangre a todo el cuerpo', 'izq', 'Circulación mayor.'),
        c('💪', 'Su ventrículo tiene la pared más gruesa', 'izq', 'Tiene que empujar más lejos.'),
        c('🔵', 'Recibe la sangre pobre en oxígeno del cuerpo', 'der', 'Llega por las venas cavas.'),
        c('🔴', 'Recibe la sangre rica en oxígeno de los pulmones', 'izq', 'Llega por las venas pulmonares.'),
      ]}
      cierre="Derecho: sangre sin O₂ hacia los pulmones. Izquierdo: sangre con O₂ hacia el cuerpo." />
  )
}

export function SangreCompJuego() {
  return (
    <JuegoDecide titulo="¿Quién lo hace?" pregunta="¿Qué parte de la sangre cumple esta función?" instrucciones="Elige la parte de la sangre que hace cada trabajo." clave="cien:sangre-comp-mejor"
      opciones={[o('rojos', 'Glóbulos rojos', '🔴'), o('blancos', 'Glóbulos blancos', '⚪'), o('plaquetas', 'Plaquetas', '🩹'), o('plasma', 'Plasma', '🟡')]}
      cartas={[
        c('🫁', 'Llevan el oxígeno a las células', 'rojos', 'Gracias a la hemoglobina.'),
        c('🦠', 'Atacan a los microbios', 'blancos', 'Son parte del sistema inmune.'),
        c('🩹', 'Tapan una herida formando un coágulo', 'plaquetas', 'Son pedacitos de células.'),
        c('🍬', 'Transporta la glucosa, las hormonas y el agua', 'plasma', 'Es la parte líquida.'),
        c('🧪', 'Les falta el núcleo en los mamíferos', 'rojos', 'Así caben más hemoglobina.'),
      ]}
      cierre="Plasma, glóbulos rojos, glóbulos blancos y plaquetas." />
  )
}

export function RespAnimalesJuego() {
  return (
    <JuegoDecide titulo="¿Cómo respira?" pregunta="¿Con qué respira este animal?" instrucciones="Decide cómo respira cada animal." clave="cien:resp-animales-mejor"
      opciones={[o('branquias', 'Branquias', '🐟'), o('traqueas', 'Tráqueas', '🦗'), o('pulmones', 'Pulmones', '🫁'), o('piel', 'Pulmones y piel', '🐸')]}
      cartas={[
        c('🐠', 'Una mojarra del río', 'branquias', 'Toma el O₂ disuelto en el agua.'),
        c('🐝', 'Una abeja', 'traqueas', 'El aire llega por tubitos a las células.'),
        c('🐋', 'Una ballena', 'pulmones', 'Es mamífero: sube a respirar aire.'),
        c('🐸', 'Una rana', 'piel', 'Su piel húmeda también respira.'),
        c('🦅', 'Un águila', 'pulmones', 'Las aves tienen pulmones con sacos aéreos.'),
        c('🐜', 'Una hormiga', 'traqueas', 'Como todos los insectos.'),
      ]}
      cierre="Branquias en el agua; pulmones y tráqueas en el aire." />
  )
}

export function VasosJuego() {
  return (
    <JuegoDecide titulo="Arteria, vena o capilar" pregunta="¿Qué vaso sanguíneo es?" instrucciones="Elige el vaso sanguíneo que describe cada tarjeta." clave="cien:vasos-mejor"
      opciones={[o('arteria', 'Arteria', '🔴'), o('vena', 'Vena', '🔵'), o('capilar', 'Capilar', '🟣')]}
      cartas={[
        c('➡️', 'Saca la sangre del corazón con mucha presión', 'arteria', 'Por eso tiene la pared gruesa.'),
        c('⬅️', 'Devuelve la sangre al corazón', 'vena', 'Tiene válvulas para que no se devuelva.'),
        c('🔬', 'Tan delgado que los glóbulos rojos pasan en fila', 'capilar', 'Su pared es de una sola capa.'),
        c('🖐️', 'Se ve azulosa bajo la piel de la mano', 'vena', 'Está cerca de la superficie.'),
        c('💓', 'Donde te tomas el pulso en la muñeca', 'arteria', 'Cada latido la hace saltar.'),
        c('🔁', 'Donde pasan el oxígeno y los nutrientes a las células', 'capilar', 'Es el lugar del intercambio.'),
      ]}
      cierre="Arterias salen del corazón, venas vuelven y los capilares intercambian." />
  )
}
