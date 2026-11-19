import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» del área 6, tema 1 (Homeostasis). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })

export function HomeoEquilibrioJuego() {
  return (
    <JuegoDecide titulo="¿Se mantiene o cambia?" pregunta="¿Este valor se mantiene casi igual o cambia mucho?" instrucciones="Decide si el cuerpo mantiene estable cada cosa o si cambia libremente." clave="cien:homeo-equilibrio-mejor"
      opciones={[o('estable', 'Se mantiene', '⚖️'), o('cambia', 'Cambia mucho', '🔀')]}
      cartas={[
        c('🌡️', 'La temperatura dentro del cuerpo', 'estable', 'Se queda cerca de 37 °C.'),
        c('🍬', 'El azúcar en la sangre', 'estable', 'Sube al comer, pero vuelve a su rango.'),
        c('💇', 'El largo del pelo', 'cambia', 'Crece sin que el cuerpo lo regule.'),
        c('💧', 'La cantidad de agua del cuerpo', 'estable', 'Los riñones y la sed la equilibran.'),
        c('☀️', 'La temperatura del patio del colegio', 'cambia', 'Es el ambiente, no el medio interno.'),
        c('🩸', 'El oxígeno en la sangre', 'estable', 'La respiración se acelera si hace falta.'),
      ]}
      cierre="Homeostasis: mantener estable el medio interno aunque afuera todo cambie." />
  )
}

export function HomeoAsaJuego() {
  return (
    <JuegoDecide titulo="Las partes del control" pregunta="¿Qué papel cumple?" instrucciones="Elige qué parte del asa de control es cada tarjeta." clave="cien:homeo-asa-mejor"
      opciones={[o('est', 'Estímulo', '⚡'), o('rec', 'Receptor', '👁️'), o('cen', 'Centro de control', '🧠'), o('efe', 'Efector', '💪')]}
      cartas={[
        c('🥶', 'Baja la temperatura del aire', 'est', 'Es el cambio que pone en marcha todo.'),
        c('🖐️', 'Las terminaciones nerviosas de la piel que sienten el frío', 'rec', 'Detectan el cambio y avisan.'),
        c('🧠', 'El hipotálamo compara con 37 °C y decide', 'cen', 'Es el «termostato» del cuerpo.'),
        c('💦', 'Las glándulas del sudor', 'efe', 'Hacen la respuesta: sudar.'),
        c('🍰', 'Sube el azúcar en la sangre después de comer', 'est', 'Es el cambio que hay que corregir.'),
        c('🧪', 'El páncreas que suelta insulina', 'efe', 'En este caso el páncreas detecta y responde.'),
      ]}
      cierre="Estímulo → receptor → centro de control → efector → respuesta." />
  )
}

export function HomeoTemperaturaJuego() {
  return (
    <JuegoDecide titulo="¿Frío o calor?" pregunta="¿Esta respuesta es contra el frío o contra el calor?" instrucciones="Decide para qué sirve cada respuesta del cuerpo." clave="cien:homeo-temperatura-mejor"
      opciones={[o('frio', 'Contra el frío', '🥶'), o('calor', 'Contra el calor', '🥵')]}
      cartas={[
        c('💦', 'Sudar', 'calor', 'El sudor, al evaporarse, se lleva calor.'),
        c('🫨', 'Temblar', 'frio', 'Los músculos producen calor al moverse.'),
        c('🐔', 'Se pone la piel de gallina', 'frio', 'Restos de erizar el pelo para atrapar aire.'),
        c('🔴', 'Se enrojece la piel', 'calor', 'Los vasos se abren y sueltan calor.'),
        c('⚪', 'Se ponen pálidos los dedos', 'frio', 'Los vasos se cierran para guardar calor.'),
        c('🐕', 'El perro jadea con la lengua afuera', 'calor', 'Los perros casi no sudan: jadean.'),
      ]}
      cierre="Contra el frío: guardar y producir calor. Contra el calor: soltarlo." />
  )
}

export function HomeoAguaJuego() {
  return (
    <JuegoDecide titulo="¿Entra o sale agua?" pregunta="¿El cuerpo gana o pierde agua?" instrucciones="Decide si cada cosa hace entrar o salir agua del cuerpo." clave="cien:homeo-agua-mejor"
      opciones={[o('entra', 'Entra', '⬇️'), o('sale', 'Sale', '⬆️')]}
      cartas={[
        c('🥤', 'Tomar un vaso de jugo', 'entra', 'La fuente principal de agua.'),
        c('🍉', 'Comer patilla', 'entra', 'Muchos alimentos tienen mucha agua.'),
        c('🏃', 'Sudar en un partido', 'sale', 'Por eso hay que hidratarse.'),
        c('🌬️', 'Echar vaho en un vidrio frío', 'sale', 'El aliento lleva vapor de agua.'),
        c('🚽', 'Orinar', 'sale', 'Los riñones regulan cuánta agua se va.'),
        c('🍲', 'Tomar sopa', 'entra', 'También cuenta como agua.'),
      ]}
      cierre="El agua se equilibra cuando lo que entra es igual a lo que sale." />
  )
}

export function HomeoGlucosaJuego() {
  return (
    <JuegoDecide titulo="Insulina o glucagón" pregunta="¿Qué hormona suelta el páncreas?" instrucciones="Decide qué hormona se necesita en cada situación." clave="cien:homeo-glucosa-mejor"
      opciones={[o('ins', 'Insulina (baja el azúcar)', '⬇️'), o('glu', 'Glucagón (sube el azúcar)', '⬆️')]}
      cartas={[
        c('🍚', 'Acabas de almorzar arroz con plátano', 'ins', 'El azúcar sube y hay que guardarlo.'),
        c('⏰', 'Llevas muchas horas sin comer', 'glu', 'El hígado suelta el azúcar guardado.'),
        c('🧃', 'Te tomaste una gaseosa', 'ins', 'El azúcar sube muy rápido.'),
        c('🌙', 'Estás durmiendo de madrugada', 'glu', 'Hay que mantener el azúcar sin comer.'),
        c('🎂', 'Comiste torta en un cumpleaños', 'ins', 'Las células toman el azúcar.'),
      ]}
      cierre="Insulina guarda el azúcar; glucagón lo saca. Juntas lo mantienen estable." />
  )
}

export function HomeoSistemasJuego() {
  return (
    <JuegoDecide titulo="¿Qué sistema es?" pregunta="¿Qué sistema hace esto?" instrucciones="Elige el sistema que hace cada trabajo." clave="cien:homeo-sistemas-mejor"
      opciones={[o('ner', 'Nervioso o endocrino', '🧠'), o('cir', 'Circulatorio o respiratorio', '❤️'), o('dig', 'Digestivo o excretor', '🍽️'), o('inm', 'Inmune', '🛡️')]}
      cartas={[
        c('⚡', 'Manda una orden rapidísima para quitar la mano del fogón', 'ner', 'El nervioso es el más rápido.'),
        c('🚚', 'Lleva oxígeno y alimento a cada célula', 'cir', 'La sangre reparte todo.'),
        c('🫘', 'Filtra la sangre y forma la orina', 'dig', 'Es el sistema excretor.'),
        c('🦠', 'Ataca un virus de la gripa', 'inm', 'Las defensas del cuerpo.'),
        c('🧪', 'Suelta hormonas que viajan por la sangre', 'ner', 'Es el endocrino: más lento y duradero.'),
        c('🥖', 'Parte el pan en moléculas pequeñas', 'dig', 'Es el sistema digestivo.'),
        c('🫁', 'Hace entrar oxígeno y sacar dióxido de carbono', 'cir', 'Es el sistema respiratorio.'),
      ]}
      cierre="Cada sistema tiene su trabajo, y todos juntos mantienen la homeostasis." />
  )
}
