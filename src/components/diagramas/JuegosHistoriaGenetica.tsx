import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» de la historia de la genética (área 2, tema 1). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })

export function GriffithJuego() {
  return (
    <JuegoDecide
      titulo="¿Vive o muere?"
      pregunta="¿Qué le pasa al ratón?"
      instrucciones="Mira qué se le inyecta a cada ratón y decide si vive o muere."
      clave="cien:griffith-mejor"
      opciones={[o('vive', 'Vive', '🐭'), o('muere', 'Muere', '💀')]}
      cartas={[
        c('🔵', 'Bacterias S vivas', 'muere', 'La cápsula protege a la cepa S de las defensas: causa neumonía.'),
        c('🟠', 'Bacterias R vivas', 'vive', 'Sin cápsula, las defensas del ratón las eliminan.'),
        c('🔥', 'Bacterias S muertas por calor', 'vive', 'Muertas no pueden reproducirse ni enfermar al ratón.'),
        c('🔥🟠', 'Bacterias S muertas + bacterias R vivas', 'muere', 'Las R se transformaron en S con algo de las S muertas.'),
        c('🔥🔥', 'Bacterias R muertas por calor', 'vive', 'Ni vivas ni muertas las R son peligrosas.'),
        c('🟠🟠', 'El doble de bacterias R vivas', 'vive', 'Más bacterias R siguen sin poder esquivar las defensas.'),
      ]}
      cierre="Solo muere el ratón que recibe bacterias S vivas… o R que se volvieron S."
    />
  )
}

export function AveryJuego() {
  return (
    <JuegoDecide
      titulo="¿Hubo transformación?"
      pregunta="¿Aparecen bacterias S?"
      instrucciones="Al extracto de bacterias S muertas se le quita algo y se le agregan bacterias R vivas. Decide si se transforman."
      clave="cien:avery-mejor"
      opciones={[o('si', 'Sí, aparecen S', '🔵'), o('no', 'No, solo R', '🟠')]}
      cartas={[
        c('✂️', 'Extracto tratado con proteasa (sin proteínas)', 'si', 'Quitar las proteínas no impide la transformación.'),
        c('✂️', 'Extracto tratado con RNasa (sin ARN)', 'si', 'Quitar el ARN tampoco la impide.'),
        c('✂️', 'Extracto tratado con DNasa (sin ADN)', 'no', 'Sin ADN no hay transformación: el ADN es el factor.'),
        c('🧪', 'Extracto completo, sin ninguna enzima', 'si', 'Es como el cuarto ratón de Griffith: las R se transforman.'),
        c('🧬', 'Solo el ADN purificado de las S', 'si', 'El ADN solo basta para transformar a las R.'),
      ]}
      cierre="Solo cuando se destruye el ADN desaparece la transformación."
    />
  )
}

export function HersheyChaseJuego() {
  return (
    <JuegoDecide
      titulo="¿Proteína o ADN?"
      pregunta="¿De cuál de los dos es?"
      instrucciones="En el fago hay proteína por fuera y ADN por dentro. Decide a cuál corresponde cada dato."
      clave="cien:hershey-mejor"
      opciones={[o('prot', 'Proteína', '🛡️'), o('adn', 'ADN', '🧬')]}
      cartas={[
        c('🟡', 'Se marcó con azufre radiactivo', 'prot', 'Las proteínas tienen azufre; el ADN no.'),
        c('🔴', 'Se marcó con fósforo radiactivo', 'adn', 'El ADN tiene fósforo; las proteínas casi no.'),
        c('🛡️', 'Forma la cubierta del virus', 'prot', 'La cabeza, la cola y las patas son de proteína.'),
        c('💉', 'Entra en la bacteria', 'adn', 'El fago inyecta su ADN y deja la cubierta afuera.'),
        c('🌀', 'Se despega con la licuadora y queda en el líquido', 'prot', 'Las cubiertas vacías quedan arriba al centrifugar.'),
        c('🏭', 'Lleva las instrucciones para hacer virus nuevos', 'adn', 'Con el ADN del fago, la bacteria fabrica cientos de virus.'),
      ]}
      cierre="La proteína se queda afuera; el ADN entra y lleva las instrucciones."
    />
  )
}

export function MiescherJuego() {
  return (
    <JuegoDecide
      titulo="¿Qué hizo Miescher?"
      pregunta="¿Es cierto?"
      instrucciones="Decide si cada frase sobre Friedrich Miescher es cierta o falsa."
      clave="cien:miescher-mejor"
      opciones={[o('v', 'Cierto', '✅'), o('f', 'Falso', '❌')]}
      cartas={[
        c('🩹', 'Sacó células del pus de vendajes de hospital', 'v', 'El pus está lleno de glóbulos blancos, con un núcleo grande.'),
        c('🐖', 'Usó pepsina para deshacer las proteínas', 'v', 'La pepsina es una enzima digestiva del estómago.'),
        c('🅿️', 'La nucleína era rica en fósforo', 'v', 'Por eso supo que no era una proteína común.'),
        c('🧬', 'Supo que la nucleína guardaba la herencia', 'f', 'No conoció su función: eso se demostró casi 80 años después.'),
        c('🌀', 'Vio que la nucleína tenía forma de doble hélice', 'f', 'La forma la propusieron Watson y Crick en 1953.'),
        c('🐟', 'Luego usó esperma de salmón', 'v', 'Esas células son casi todo núcleo: más nucleína.'),
      ]}
      cierre="Miescher aisló el ADN en 1869, aunque no sabía para qué servía."
    />
  )
}
