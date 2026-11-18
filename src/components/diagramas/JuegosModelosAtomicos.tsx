import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» de la historia de los modelos atómicos (Química área 2, tema 1). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })
const VF = [o('v', 'Cierto', '✅'), o('f', 'Falso', '❌')]

export function DemocritoJuego() {
  return (
    <JuegoDecide titulo="¿Idea o experimento?" pregunta="¿Cómo lo supo?" instrucciones="Decide si cada afirmación sobre el átomo nació de pensar (filosofía) o de un experimento." clave="cien:democrito-mejor"
      opciones={[o('idea', 'Pensando', '💭'), o('exp', 'Experimentando', '🧪')]}
      cartas={[
        c('🪨', 'Demócrito: si parto algo muchas veces, llego a algo que no se puede partir', 'idea', 'Lo razonó; no tenía cómo comprobarlo.'),
        c('⚡', 'Thomson: el rayo del tubo se dobla hacia la placa positiva', 'exp', 'Lo midió en un tubo de rayos catódicos.'),
        c('🌍', 'Aristóteles: la materia es continua y se forma de agua, aire, tierra y fuego', 'idea', 'Una idea filosófica que dominó casi 2000 años.'),
        c('🥇', 'Rutherford: algunas alfa rebotan en la lámina de oro', 'exp', 'Lo vieron contando destellos en una pantalla.'),
        c('⚖️', 'Dalton: los elementos se combinan en proporciones fijas de masa', 'exp', 'Se basó en mediciones de masas en reacciones.'),
      ]}
      cierre="Demócrito tuvo la idea; 2200 años después los experimentos la volvieron ciencia." />
  )
}

export function DaltonJuego() {
  return (
    <JuegoDecide titulo="¿Dalton tenía razón?" pregunta="¿Sigue siendo cierto hoy?" instrucciones="Decide si cada idea de Dalton se mantiene hoy o tuvo que corregirse." clave="cien:dalton-mejor"
      opciones={[o('si', 'Se mantiene', '👍'), o('no', 'Se corrigió', '✏️')]}
      cartas={[
        c('⚪', 'La materia está formada por átomos', 'si', 'Es la base de toda la química.'),
        c('🔨', 'El átomo es una bola maciza que no se puede dividir', 'no', 'Tiene electrones, protones y neutrones.'),
        c('🧩', 'En una reacción los átomos se reorganizan, no se crean ni se destruyen', 'si', 'Por eso se conserva la masa.'),
        c('⚖️', 'Todos los átomos de un elemento tienen exactamente la misma masa', 'no', 'Existen isótopos: mismo elemento, distinta masa.'),
        c('💧', 'Los compuestos unen átomos en proporciones fijas', 'si', 'El agua siempre es 2 de hidrógeno por 1 de oxígeno.'),
      ]}
      cierre="Dalton acertó en lo grande: todo está hecho de átomos que se combinan." />
  )
}

export function ThomsonJuego() {
  return (
    <JuegoDecide titulo="El tubo de Thomson" pregunta="¿Es cierto?" instrucciones="Decide si cada frase sobre el experimento de Thomson es cierta o falsa." clave="cien:thomson-mejor" opciones={VF}
      cartas={[
        c('⚡', 'El rayo se doblaba hacia la placa positiva', 'v', 'Por eso supo que las partículas eran negativas.'),
        c('🧲', 'Las partículas del rayo tenían carga positiva', 'f', 'Eran negativas: los electrones.'),
        c('🔬', 'Los electrones son mucho más livianos que el átomo de hidrógeno', 'v', 'Unas 1800 veces más livianos.'),
        c('🍮', 'En su modelo, los electrones están incrustados en una masa positiva', 'v', 'El «budín con pasas».'),
        c('🎯', 'Thomson descubrió el núcleo', 'f', 'El núcleo lo descubrió Rutherford en 1911.'),
      ]}
      cierre="Thomson mostró que el átomo sí tiene partes: el electrón fue la primera." />
  )
}

export function RutherfordJuego() {
  return (
    <JuegoDecide titulo="¿Qué le pasa a la alfa?" pregunta="¿Qué hace esta partícula?" instrucciones="Según por dónde pase la partícula alfa, decide qué le ocurre." clave="cien:rutherford-mejor"
      opciones={[o('recto', 'Pasa derecho', '➡️'), o('desvia', 'Se desvía', '↗️'), o('rebota', 'Rebota', '↩️')]}
      cartas={[
        c('🌌', 'Pasa por el espacio vacío, lejos de cualquier núcleo', 'recto', 'Así pasa la gran mayoría.'),
        c('🎯', 'Va directo contra un núcleo', 'rebota', 'La repulsión de dos cargas positivas la devuelve.'),
        c('🔴', 'Pasa cerca de un núcleo, pero no de frente', 'desvia', 'El núcleo positivo la empuja a un lado.'),
        c('🔵', 'Pasa entre los electrones, lejos del núcleo', 'recto', 'Los electrones son demasiado livianos para frenarla.'),
        c('🎯', 'Roza un núcleo por un costado', 'desvia', 'Cambia de rumbo, pero sigue avanzando.'),
      ]}
      cierre="Casi todo pasa: el átomo es casi vacío. Lo que rebota revela un núcleo diminuto y positivo." />
  )
}

export function BohrJuego() {
  return (
    <JuegoDecide titulo="¿Sube o baja?" pregunta="¿Qué hace el electrón?" instrucciones="Decide si el electrón sube de nivel (absorbe energía) o baja (suelta luz)." clave="cien:bohr-mejor"
      opciones={[o('sube', 'Sube: absorbe', '⬆️'), o('baja', 'Baja: emite luz', '💡')]}
      cartas={[
        c('🔥', 'Se calienta una sal en la llama del mechero', 'sube', 'El calor le da energía al electrón.'),
        c('🎆', 'Los fuegos artificiales sueltan colores', 'baja', 'Al volver a su nivel, cada elemento emite su color.'),
        c('🟠', 'La lámpara de sodio del alumbrado da luz naranja', 'baja', 'El sodio emite ese color al bajar de nivel.'),
        c('☀️', 'Un átomo recibe la luz del Sol y su electrón salta', 'sube', 'Absorbe exactamente la energía del salto.'),
        c('💚', 'La llama se pone verde con un alambre de cobre', 'baja', 'El cobre emite verde al soltar la energía.'),
      ]}
      cierre="Cada salto tiene una energía fija: por eso cada elemento tiene sus propios colores." />
  )
}

export function NubeJuego() {
  return (
    <JuegoDecide titulo="¿Bohr o el modelo actual?" pregunta="¿Qué modelo lo dice?" instrucciones="Decide si cada frase corresponde al modelo de Bohr o al modelo actual (mecánico-cuántico)." clave="cien:nube-mejor"
      opciones={[o('bohr', 'Bohr', '🪐'), o('actual', 'Modelo actual', '☁️')]}
      cartas={[
        c('🪐', 'El electrón gira en una órbita circular fija', 'bohr', 'Como un planeta alrededor del Sol.'),
        c('☁️', 'Solo se sabe dónde es más probable hallar al electrón', 'actual', 'Por eso se habla de nube y orbitales.'),
        c('🎈', 'Hay orbitales con forma de esfera y de dos lóbulos', 'actual', 'Los orbitales s y p.'),
        c('🎯', 'Se puede saber a la vez dónde está y a qué velocidad va el electrón', 'bohr', 'Heisenberg mostró que no es posible.'),
        c('🌊', 'El electrón se describe con una ecuación de onda', 'actual', 'La ecuación de Schrödinger (1926).'),
      ]}
      cierre="Bohr acertó con los niveles de energía; el modelo actual cambió las órbitas por orbitales." />
  )
}

export function ChadwickJuego() {
  return (
    <JuegoDecide titulo="¿Dónde está y qué carga tiene?" pregunta="¿Qué partícula es?" instrucciones="Decide qué partícula subatómica describe cada pista." clave="cien:chadwick-mejor"
      opciones={[o('p', 'Protón', '🔴'), o('n', 'Neutrón', '⚪'), o('e', 'Electrón', '🔵')]}
      cartas={[
        c('➖', 'Tiene carga negativa y está fuera del núcleo', 'e', 'Lo descubrió Thomson en 1897.'),
        c('⚪', 'Está en el núcleo y no tiene carga', 'n', 'Lo descubrió Chadwick en 1932.'),
        c('➕', 'Está en el núcleo y tiene carga positiva', 'p', 'Su número dice qué elemento es.'),
        c('🪶', 'Es la más liviana de las tres', 'e', 'Pesa unas 1800 veces menos que un protón.'),
        c('🧲', 'No se desvía en un campo eléctrico porque es neutra', 'n', 'Por eso tardaron tanto en encontrarlo.'),
      ]}
      cierre="Protón (+) y neutrón (0) en el núcleo; electrón (−) afuera." />
  )
}
