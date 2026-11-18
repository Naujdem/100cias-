import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» del área 5, tema 8 (Gestión del riesgo). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })

export function AmenazaVulnerabilidadJuego() {
  return (
    <JuegoDecide titulo="¿Amenaza o vulnerabilidad?" pregunta="¿Qué es?" instrucciones="Amenaza: lo que puede causar daño. Vulnerabilidad: qué tan expuestos y frágiles estamos." clave="cien:amenaza-vulnerabilidad-mejor"
      opciones={[o('am', 'Amenaza', '⚡'), o('vu', 'Vulnerabilidad', '🏚️')]}
      cartas={[
        c('🌋', 'Un volcán activo', 'am', 'Puede hacer erupción.'),
        c('🏠', 'Una casa de bahareque sin columnas', 'vu', 'Es frágil ante un sismo.'),
        c('🌧️', 'Un aguacero de tres días', 'am', 'Puede causar crecientes y deslizamientos.'),
        c('🤷', 'Una familia que no sabe qué hacer en un sismo', 'vu', 'No estar preparados también es vulnerabilidad.'),
        c('🏘️', 'Un barrio construido en la orilla del río', 'vu', 'Está expuesto a la creciente.'),
      ]}
      cierre="Riesgo = amenaza + vulnerabilidad. La vulnerabilidad la podemos reducir." />
  )
}

export function AmenazasColombiaJuego() {
  return (
    <JuegoDecide titulo="¿Qué amenaza es?" pregunta="¿Qué amenaza describe?" instrucciones="Elige la amenaza que corresponde a cada pista." clave="cien:amenazas-colombia-mejor"
      opciones={[o('volcan', 'Volcánica', '🌋'), o('sismo', 'Sísmica', '🫨'), o('agua', 'Creciente o avenida', '🌊'), o('fuego', 'Incendio forestal', '🔥')]}
      cartas={[
        c('🔴', 'El Servicio Geológico pasa el Nevado del Huila a alerta naranja', 'volcan', 'El semáforo del volcán.'),
        c('🪨', 'Lodo, piedras y troncos bajan de golpe por la quebrada', 'agua', 'Es una avenida torrencial.'),
        c('🏚️', 'Se agrietan las paredes y se caen las tejas', 'sismo', 'El suelo se sacude.'),
        c('☀️', 'Meses sin lluvia y una quema que se sale de control', 'fuego', 'Más frecuente con El Niño.'),
        c('🌫️', 'Cae ceniza sobre los cultivos', 'volcan', 'Una erupción la lanza al aire.'),
      ]}
      cierre="Colombia tiene casi todas las amenazas: conocerlas es el primer paso." />
  )
}

export function ArmeroJuego() {
  return (
    <JuegoDecide titulo="¿Verdad o mito?" pregunta="¿Es cierto?" instrucciones="Decide si cada frase sobre Armero es verdad o mito." clave="cien:armero-mejor"
      opciones={[o('v', 'Verdad', '✅'), o('m', 'Mito', '❌')]}
      cartas={[
        c('🔥', 'A Armero lo destruyó la lava del volcán', 'm', 'Fue un lahar: un flujo de lodo.'),
        c('🗺️', 'Antes de la tragedia ya había un mapa de amenaza', 'v', 'Se publicó en octubre de 1985.'),
        c('❄️', 'El lodo se formó porque se derritió parte del glaciar', 'v', 'El calor de la erupción lo derritió.'),
        c('🤷', 'Era imposible saber que podía pasar', 'm', 'El volcán llevaba meses dando señales.'),
        c('🏛️', 'Después de Armero se creó un sistema nacional para atender desastres', 'v', 'Hoy lo coordina la UNGRD.'),
      ]}
      cierre="Conocer el riesgo no basta: hay que comunicarlo y actuar." />
  )
}

export function AntesDuranteDespuesJuego() {
  return (
    <JuegoDecide titulo="¿Cuándo se hace?" pregunta="¿Antes, durante o después?" instrucciones="Decide en qué momento de la emergencia se hace cada acción." clave="cien:antes-durante-despues-mejor"
      opciones={[o('antes', 'Antes', '🎒'), o('durante', 'Durante', '🫨'), o('despues', 'Después', '📻')]}
      cartas={[
        c('🎒', 'Alistar la mochila de emergencia', 'antes', 'Para salir rápido si hace falta.'),
        c('🪑', 'Agacharse bajo una mesa firme', 'durante', 'Protegerse mientras tiembla.'),
        c('🏚️', 'No volver a la casa agrietada hasta que la revisen', 'despues', 'Puede caerse con una réplica.'),
        c('🗺️', 'Acordar un punto de encuentro con la familia', 'antes', 'Parte del plan familiar.'),
        c('⛰️', 'Subir a lo alto si viene la creciente', 'durante', 'Lejos del cauce.'),
        c('📻', 'Escuchar la radio y seguir a los organismos de socorro', 'despues', 'Información oficial.'),
      ]}
      cierre="Prepararse antes salva vidas durante." />
  )
}

export function PlanEscolarJuego() {
  return (
    <JuegoDecide titulo="¿Sí o no?" pregunta="¿Se debe hacer en una evacuación?" instrucciones="Decide si cada acción es correcta durante una evacuación del colegio." clave="cien:plan-escolar-mejor"
      opciones={[o('si', 'Sí', '✅'), o('no', 'No', '❌')]}
      cartas={[
        c('🏃', 'Correr para salir primero', 'no', 'Se camina rápido, sin correr.'),
        c('🟢', 'Seguir la ruta señalizada', 'si', 'Lleva al punto de encuentro.'),
        c('🎒', 'Devolverse por la mochila', 'no', 'Nada vale más que la vida.'),
        c('🙋', 'Avisar si un compañero no está en el punto de encuentro', 'si', 'Para que lo busquen.'),
        c('📱', 'Grabar con el celular mientras se sale', 'no', 'Distrae y frena la salida.'),
      ]}
      cierre="No correr, no gritar, no empujar, no devolverse." />
  )
}
