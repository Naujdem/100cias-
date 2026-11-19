import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» del área 6, tema 6 (Sistema nervioso). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })

export function NerMapaJuego() {
  return (
    <JuegoDecide titulo="Recibe, procesa o responde" pregunta="¿Qué hace el sistema nervioso en este momento?" instrucciones="Decide si en cada caso el sistema nervioso recibe, procesa o responde." clave="cien:ner-mapa-mejor"
      opciones={[o('recibe', 'Recibe', '👁️'), o('procesa', 'Procesa', '🧠'), o('responde', 'Responde', '💪')]}
      cartas={[
        c('👂', 'Oyes el timbre del recreo', 'recibe', 'El oído capta el sonido.'),
        c('🤔', 'Decides si sales o terminas el ejercicio', 'procesa', 'El cerebro compara y decide.'),
        c('🏃', 'Te levantas y caminas a la puerta', 'responde', 'Los músculos obedecen.'),
        c('👅', 'Sientes que la sopa está muy caliente', 'recibe', 'Receptores de la lengua.'),
        c('📖', 'Recuerdas la respuesta del examen', 'procesa', 'La memoria está en el cerebro.'),
        c('🫡', 'Saludas con la mano', 'responde', 'Movimiento voluntario.'),
      ]}
      cierre="Recibir (sentidos), procesar (encéfalo y médula) y responder (músculos y glándulas)." />
  )
}

export function NeuronaJuego() {
  return (
    <JuegoDecide titulo="Partes de la neurona" pregunta="¿Qué parte de la neurona es?" instrucciones="Elige la parte de la neurona que describe cada tarjeta." clave="cien:neurona-mejor"
      opciones={[o('dendrita', 'Dendritas', '🌿'), o('cuerpo', 'Cuerpo', '⚪'), o('axon', 'Axón', '➖'), o('mielina', 'Mielina', '🧈')]}
      cartas={[
        c('📥', 'Ramitas que reciben las señales', 'dendrita', 'Son la entrada.'),
        c('🎯', 'Tiene el núcleo de la célula', 'cuerpo', 'Mantiene viva a la neurona.'),
        c('📤', 'Prolongación larga que lleva el impulso', 'axon', 'Puede medir más de un metro.'),
        c('🧈', 'Capa de grasa que aísla y acelera el impulso', 'mielina', 'Como el plástico de un cable.'),
        c('🦵', 'Va de la médula al pie', 'axon', 'Los más largos del cuerpo.'),
      ]}
      cierre="Dendritas reciben, el axón envía y la mielina acelera." />
  )
}

export function SinapsisJuego() {
  return (
    <JuegoDecide titulo="¿Qué pasa en la sinapsis?" pregunta="¿Verdad o falso?" instrucciones="Decide si cada frase sobre la sinapsis es verdadera o falsa." clave="cien:sinapsis-mejor"
      opciones={[o('v', 'Verdad', '✅'), o('f', 'Falso', '❌')]}
      cartas={[
        c('🔌', 'Las neuronas están pegadas como cables empalmados', 'f', 'Hay un espacio muy pequeño entre ellas.'),
        c('🧪', 'El mensaje cruza el espacio con sustancias químicas', 'v', 'Son los neurotransmisores.'),
        c('🔑', 'El neurotransmisor se une a un receptor de la otra neurona', 'v', 'Como llave y cerradura.'),
        c('↔️', 'El mensaje puede ir hacia atrás por la misma sinapsis', 'f', 'Va en un solo sentido.'),
        c('☕', 'La cafeína actúa sobre la sinapsis', 'v', 'Bloquea una señal de cansancio.'),
      ]}
      cierre="Eléctrico dentro de la neurona, químico entre neuronas." />
  )
}

export function ReflejoJuego() {
  return (
    <JuegoDecide titulo="¿Reflejo o voluntario?" pregunta="¿Es un reflejo o un acto voluntario?" instrucciones="Decide si cada movimiento es un reflejo o lo decides tú." clave="cien:reflejo-mejor"
      opciones={[o('ref', 'Reflejo', '⚡'), o('vol', 'Voluntario', '🧠')]}
      cartas={[
        c('🔥', 'Quitar la mano de una olla caliente', 'ref', 'La médula responde sola.'),
        c('✍️', 'Escribir tu nombre', 'vol', 'Lo decide el cerebro.'),
        c('👁️', 'Parpadear cuando algo se acerca al ojo', 'ref', 'Protege el ojo.'),
        c('🦵', 'La pierna salta con el martillito del médico', 'ref', 'El reflejo rotuliano.'),
        c('⚽', 'Patear un penal', 'vol', 'Se piensa y se apunta.'),
        c('🤧', 'Estornudar', 'ref', 'Expulsa lo que irrita la nariz.'),
      ]}
      cierre="Reflejo: rápido, automático y sin pasar por el cerebro." />
  )
}

export function EncefaloJuego() {
  return (
    <JuegoDecide titulo="¿Quién lo controla?" pregunta="¿Qué parte del encéfalo lo controla?" instrucciones="Elige la parte del encéfalo que se encarga de cada cosa." clave="cien:encefalo-mejor"
      opciones={[o('cerebro', 'Cerebro', '🧠'), o('cerebelo', 'Cerebelo', '⚖️'), o('tronco', 'Tronco encefálico', '🫀')]}
      cartas={[
        c('🚲', 'Mantener el equilibrio en la bicicleta', 'cerebelo', 'Coordina los movimientos.'),
        c('💓', 'Que el corazón siga latiendo mientras duermes', 'tronco', 'Funciones automáticas.'),
        c('📚', 'Aprender las tablas de multiplicar', 'cerebro', 'Memoria y pensamiento.'),
        c('🫁', 'Respirar sin pensar en ello', 'tronco', 'Lo controla el bulbo raquídeo.'),
        c('🎨', 'Imaginar un dibujo', 'cerebro', 'La corteza cerebral.'),
        c('🤹', 'Coordinar las manos para hacer malabares', 'cerebelo', 'Precisión y ritmo.'),
      ]}
      cierre="Cerebro: pensar. Cerebelo: coordinar. Tronco: mantener vivo." />
  )
}

export function PsicoactivasJuego() {
  return (
    <JuegoDecide titulo="¿Verdad o mito?" pregunta="¿Es verdad o es un mito?" instrucciones="Decide si cada frase sobre las sustancias psicoactivas es verdad o mito." clave="cien:psicoactivas-mejor"
      opciones={[o('v', 'Verdad', '✅'), o('m', 'Mito', '❌')]}
      cartas={[
        c('🧠', 'El cerebro sigue madurando hasta cerca de los 25 años', 'v', 'Por eso es más vulnerable en la adolescencia.'),
        c('🍺', 'El alcohol es estimulante: «anima»', 'm', 'Es depresor: vuelve lentas las neuronas.'),
        c('🚬', 'La nicotina crea dependencia', 'v', 'Es una de las sustancias más adictivas.'),
        c('🌿', 'Si es natural, no hace daño', 'm', 'Muchas plantas tienen sustancias peligrosas.'),
        c('🚗', 'Manejar después de tomar es peligroso aunque «uno se sienta bien»', 'v', 'La reacción y el juicio se vuelven lentos.'),
        c('🗣️', 'Pedir ayuda es de débiles', 'm', 'Hablar con alguien de confianza es lo más valiente.'),
      ]}
      cierre="Conocer cómo actúan en el cerebro ayuda a decidir mejor." />
  )
}
