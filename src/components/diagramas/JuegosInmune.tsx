import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» del área 6, tema 5 (Sistema inmune). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })

export function LineasJuego() {
  return (
    <JuegoDecide titulo="¿Qué línea de defensa?" pregunta="¿A qué línea de defensa pertenece?" instrucciones="Elige la línea de defensa de cada tarjeta." clave="cien:lineas-mejor"
      opciones={[o('barrera', '1.ª Barreras', '🧱'), o('innata', '2.ª Innata', '🔥'), o('adaptativa', '3.ª Adaptativa', '🎯')]}
      cartas={[
        c('🧴', 'La piel sana', 'barrera', 'Impide la entrada de microbios.'),
        c('🔥', 'Una herida se pone roja y caliente', 'innata', 'Es la inflamación.'),
        c('🎯', 'Anticuerpos contra el virus del sarampión', 'adaptativa', 'Son específicos para ese microbio.'),
        c('🤧', 'El moco y los estornudos', 'barrera', 'Atrapan y expulsan partículas.'),
        c('🍽️', 'Un glóbulo blanco se come una bacteria cualquiera', 'innata', 'Fagocitosis: no distingue cuál es.'),
        c('🧠', 'Linfocitos que recuerdan una infección de hace años', 'adaptativa', 'La memoria inmunológica.'),
      ]}
      cierre="Barreras, defensa innata y defensa adaptativa." />
  )
}

export function BarrerasJuego() {
  return (
    <JuegoDecide titulo="¿Es una barrera?" pregunta="¿Esto impide que los microbios entren?" instrucciones="Decide si cada cosa funciona como barrera de la primera línea." clave="cien:barreras-mejor"
      opciones={[o('si', 'Sí, es barrera', '🧱'), o('no', 'No', '❌')]}
      cartas={[
        c('😢', 'Las lágrimas', 'si', 'Lavan el ojo y tienen lisozima, que rompe bacterias.'),
        c('🧪', 'El ácido del estómago', 'si', 'Mata muchos microbios de la comida.'),
        c('💉', 'Los anticuerpos de la sangre', 'no', 'Son de la tercera línea.'),
        c('👃', 'Los pelitos y el moco de la nariz', 'si', 'Atrapan polvo y microbios.'),
        c('🦠', 'Las bacterias buenas del intestino', 'si', 'No dejan espacio a las dañinas.'),
        c('🤒', 'La fiebre', 'no', 'Es parte de la defensa innata, cuando el microbio ya entró.'),
      ]}
      cierre="Las barreras actúan antes de que el microbio entre." />
  )
}

export function InnataJuego() {
  return (
    <JuegoDecide titulo="Señales de la inflamación" pregunta="¿Por qué pasa esto en una herida?" instrucciones="Elige la causa de cada señal de la inflamación." clave="cien:innata-mejor"
      opciones={[o('sangre', 'Llega más sangre', '🩸'), o('liquido', 'Sale líquido', '💧'), o('defensas', 'Llegan defensas', '⚪')]}
      cartas={[
        c('🔴', 'La piel se pone roja', 'sangre', 'Los vasos se abren.'),
        c('🌡️', 'Se siente caliente', 'sangre', 'La sangre trae calor.'),
        c('🎈', 'Se hincha', 'liquido', 'Sale líquido del vaso al tejido.'),
        c('🟡', 'Sale pus', 'defensas', 'Son glóbulos blancos y bacterias muertos.'),
        c('🍽️', 'Las bacterias desaparecen', 'defensas', 'Los fagocitos se las comen.'),
      ]}
      cierre="La inflamación trae sangre y defensas al lugar del ataque." />
  )
}

export function AnticuerposJuego() {
  return (
    <JuegoDecide titulo="Innata o adaptativa" pregunta="¿Es de la defensa innata o de la adaptativa?" instrucciones="Decide a qué defensa pertenece cada característica." clave="cien:anticuerpos-mejor"
      opciones={[o('innata', 'Innata', '🔥'), o('adaptativa', 'Adaptativa', '🎯')]}
      cartas={[
        c('⚡', 'Responde en minutos u horas', 'innata', 'Está lista desde que nacemos.'),
        c('🗓️', 'La primera vez tarda una o dos semanas', 'adaptativa', 'Tiene que aprender el antígeno.'),
        c('🔑', 'Ataca a un solo microbio, como llave y cerradura', 'adaptativa', 'Es específica.'),
        c('🧠', 'Tiene memoria', 'adaptativa', 'La segunda vez es más rápida.'),
        c('🍽️', 'Ataca igual a cualquier microbio', 'innata', 'No es específica.'),
        c('🅱️', 'Linfocitos B que fabrican anticuerpos', 'adaptativa', 'Y los T que destruyen células infectadas.'),
      ]}
      cierre="Innata: rápida y general. Adaptativa: lenta la primera vez, específica y con memoria." />
  )
}

export function VacunasJuego() {
  return (
    <JuegoDecide titulo="¿Verdad o mito?" pregunta="¿Es verdad o es un mito?" instrucciones="Decide si cada frase sobre las vacunas es verdad o mito." clave="cien:vacunas-mejor"
      opciones={[o('v', 'Verdad', '✅'), o('m', 'Mito', '❌')]}
      cartas={[
        c('🧠', 'La vacuna enseña al cuerpo sin hacerlo pasar por la enfermedad', 'v', 'Usa el microbio muerto, debilitado o una parte.'),
        c('💊', 'Las vacunas curan una enfermedad que ya tienes', 'm', 'Previenen; no curan.'),
        c('👨‍👩‍👧', 'Vacunarse también protege a quien no puede vacunarse', 'v', 'Es la inmunidad de rebaño.'),
        c('🦠', 'Los antibióticos sirven contra los virus de la gripa', 'm', 'Solo sirven contra bacterias.'),
        c('🌍', 'Gracias a las vacunas se erradicó la viruela', 'v', 'Fue declarada erradicada en 1980.'),
        c('💉', 'Algunas vacunas necesitan refuerzos', 'v', 'Para mantener la memoria fuerte.'),
      ]}
      cierre="La vacuna crea memoria sin pasar por la enfermedad." />
  )
}

export function FallasInmuneJuego() {
  return (
    <JuegoDecide titulo="¿Qué falla?" pregunta="¿Qué le pasa al sistema inmune?" instrucciones="Elige qué tipo de falla describe cada caso." clave="cien:fallas-inmune-mejor"
      opciones={[o('alergia', 'Exagera (alergia)', '🤧'), o('auto', 'Se ataca a sí mismo', '🎯'), o('debil', 'Queda débil', '🪫')]}
      cartas={[
        c('🌼', 'Estornudos y ojos rojos con el polen', 'alergia', 'Reacciona contra algo inofensivo.'),
        c('🦠', 'El VIH destruye linfocitos T', 'debil', 'Por eso aparecen otras infecciones.'),
        c('🍬', 'Las defensas destruyen las células del páncreas que hacen insulina', 'auto', 'Así empieza la diabetes tipo 1.'),
        c('🥜', 'Ronchas al comer maní', 'alergia', 'Una alergia alimentaria puede ser grave.'),
        c('💊', 'Medicamentos para un trasplante que bajan las defensas', 'debil', 'Para que no rechace el órgano.'),
      ]}
      cierre="El sistema inmune puede exagerar, equivocarse de blanco o quedar débil." />
  )
}
