import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» del área 6, tema 7 (Sistema endocrino). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })

export function HormonaQueJuego() {
  return (
    <JuegoDecide titulo="¿Verdad o falso?" pregunta="¿Es verdad lo que dice sobre las hormonas?" instrucciones="Decide si cada frase sobre las hormonas es verdadera o falsa." clave="cien:hormona-que-mejor"
      opciones={[o('v', 'Verdad', '✅'), o('f', 'Falso', '❌')]}
      cartas={[
        c('🩸', 'Las hormonas viajan por la sangre', 'v', 'Por eso llegan a todo el cuerpo.'),
        c('🎯', 'Todas las células responden a todas las hormonas', 'f', 'Solo las que tienen el receptor.'),
        c('🐢', 'Su efecto suele ser más lento y duradero que el de un nervio', 'v', 'Minutos, horas o años.'),
        c('🔌', 'Viajan por los nervios', 'f', 'Eso es el sistema nervioso.'),
        c('🤏', 'Basta una cantidad muy pequeña para tener efecto', 'v', 'Son mensajes muy potentes.'),
      ]}
      cierre="Hormona: mensaje químico que viaja por la sangre hasta sus células diana." />
  )
}

export function GlandulasJuego() {
  return (
    <JuegoDecide titulo="¿Qué glándula es?" pregunta="¿Qué glándula hace esto?" instrucciones="Elige la glándula que produce cada hormona o efecto." clave="cien:glandulas-mejor"
      opciones={[o('hip', 'Hipófisis', '🧠'), o('tir', 'Tiroides', '🦋'), o('pan', 'Páncreas', '🟡'), o('sup', 'Suprarrenales', '⚡')]}
      cartas={[
        c('📏', 'Hormona del crecimiento', 'hip', 'Se suelta sobre todo al dormir.'),
        c('🍬', 'Insulina y glucagón', 'pan', 'Regulan el azúcar.'),
        c('😱', 'Adrenalina en un susto', 'sup', 'Están sobre los riñones.'),
        c('🧂', 'Necesita yodo para trabajar', 'tir', 'Por eso la sal tiene yodo.'),
        c('🎼', 'Dirige a otras glándulas', 'hip', 'La «directora de orquesta».'),
        c('🔥', 'Marca el ritmo del metabolismo', 'tir', 'Cuánta energía gasta el cuerpo.'),
      ]}
      cierre="Cada glándula tiene sus hormonas y sus tareas." />
  )
}

export function DiabetesJuego() {
  return (
    <JuegoDecide titulo="Diabetes: ¿verdad o mito?" pregunta="¿Es verdad o es un mito?" instrucciones="Decide si cada frase sobre la diabetes es verdad o mito." clave="cien:diabetes-mejor"
      opciones={[o('v', 'Verdad', '✅'), o('m', 'Mito', '❌')]}
      cartas={[
        c('🍭', 'La diabetes se pega como una gripa', 'm', 'No es contagiosa.'),
        c('💉', 'En la tipo 1 el páncreas casi no produce insulina', 'v', 'Por eso se necesita inyectarla.'),
        c('🏃', 'El ejercicio y comer bien ayudan a prevenir la tipo 2', 'v', 'Y el peso saludable.'),
        c('🍬', 'Solo da por comer dulces', 'm', 'Influyen la herencia, el peso, el sedentarismo y más.'),
        c('🩸', 'Si no se controla, la glucosa alta daña ojos, riñones y nervios', 'v', 'Por eso hay que controlarla.'),
      ]}
      cierre="Tipo 1: falta insulina. Tipo 2: las células no le responden bien." />
  )
}

export function EstresJuego() {
  return (
    <JuegoDecide titulo="¿Qué hace la adrenalina?" pregunta="¿La adrenalina causa esto?" instrucciones="Decide si cada efecto lo causa la adrenalina en un susto." clave="cien:estres-mejor"
      opciones={[o('si', 'Sí', '⚡'), o('no', 'No', '😌')]}
      cartas={[
        c('💓', 'El corazón late más rápido', 'si', 'Más sangre a los músculos.'),
        c('🍽️', 'Aumenta el hambre y la digestión', 'no', 'La digestión se frena en un susto.'),
        c('👁️', 'Se agrandan las pupilas', 'si', 'Para ver mejor.'),
        c('🍬', 'Sube el azúcar en la sangre', 'si', 'Energía rápida para los músculos.'),
        c('😴', 'Da sueño', 'no', 'Al contrario: alerta.'),
        c('🫁', 'Se respira más rápido', 'si', 'Más oxígeno.'),
      ]}
      cierre="La adrenalina prepara al cuerpo para pelear o huir." />
  )
}

export function HormonasCrecimientoJuego() {
  return (
    <JuegoDecide titulo="¿Qué hormona actúa?" pregunta="¿Qué hormona está detrás?" instrucciones="Elige la hormona que explica cada situación." clave="cien:hormonas-crecimiento-mejor"
      opciones={[o('crec', 'Del crecimiento', '📏'), o('tiro', 'Tiroidea', '🦋'), o('sex', 'Sexuales', '🌱')]}
      cartas={[
        c('😴', 'Crecer mientras duermes', 'crec', 'Se suelta en el sueño profundo.'),
        c('🧂', 'El bocio por falta de yodo', 'tiro', 'La tiroides se agranda.'),
        c('🗣️', 'La voz cambia en la pubertad', 'sex', 'Por la testosterona.'),
        c('🔥', 'Gastar más o menos energía en reposo', 'tiro', 'Regula el metabolismo.'),
        c('🌸', 'Empieza la menstruación', 'sex', 'Por los estrógenos y la progesterona.'),
      ]}
      cierre="Crecimiento, tiroides y hormonas sexuales cambian el cuerpo con los años." />
  )
}

export function NervEndoJuego() {
  return (
    <JuegoDecide titulo="¿Nervioso o endocrino?" pregunta="¿Qué sistema es?" instrucciones="Decide si cada característica es del sistema nervioso o del endocrino." clave="cien:nerv-endo-mejor"
      opciones={[o('ner', 'Nervioso', '⚡'), o('end', 'Endocrino', '🧪')]}
      cartas={[
        c('⚡', 'Responde en milésimas de segundo', 'ner', 'Impulsos eléctricos.'),
        c('🩸', 'Sus mensajes viajan por la sangre', 'end', 'Son hormonas.'),
        c('📏', 'Controla el crecimiento durante años', 'end', 'Efectos lentos y duraderos.'),
        c('🎯', 'Llega a un músculo preciso por un cable', 'ner', 'Por un nervio.'),
        c('🔥', 'Retirar la mano del fogón', 'ner', 'Es un reflejo.'),
        c('🌱', 'Los cambios de la pubertad', 'end', 'Hormonas sexuales.'),
      ]}
      cierre="Nervioso: rápido y puntual. Endocrino: lento, amplio y duradero." />
  )
}
