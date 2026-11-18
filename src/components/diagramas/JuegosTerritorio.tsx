import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» del área 3, tema 8 (Territorio y saberes). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })

export function TerritorioJuego() {
  return (
    <JuegoDecide titulo="¿Qué hace parte del territorio?" pregunta="¿De qué parte del territorio se trata?" instrucciones="El territorio es lugar, relaciones y memoria." clave="cien:territorio-mejor"
      opciones={[o('lug', 'El lugar', '⛰️'), o('rel', 'Las relaciones', '🤝'), o('mem', 'La memoria', '📜')]}
      cartas={[
        c('💧', 'La quebrada que baja de la montaña', 'lug', 'Agua, suelo y relieve.'),
        c('🧑‍🌾', 'Las mingas para trabajar juntos en la vereda', 'rel', 'Cómo se organiza la gente.'),
        c('👵', 'Los nombres que los abuelos le dan a las plantas', 'mem', 'Saberes de generaciones.'),
        c('🌳', 'El bosque que protege el nacimiento de agua', 'lug', 'Parte del lugar.'),
        c('🎶', 'Las historias y cantos sobre el río', 'mem', 'También son territorio.'),
        c('🔄', 'Intercambiar semillas entre vecinos', 'rel', 'Una relación que cuida la diversidad.'),
      ]}
      cierre="El territorio no es solo tierra: es lugar, relaciones y memoria." />
  )
}

export function CalendarioJuego() {
  return (
    <JuegoDecide titulo="Leer el año" pregunta="¿Lluvias o verano?" instrucciones="En muchas zonas andinas hay dos temporadas de lluvias: marzo–mayo y septiembre–noviembre." clave="cien:calendario-mejor"
      opciones={[o('llu', 'Temporada de lluvias', '🌧️'), o('ver', 'Temporada seca (verano)', '☀️')]}
      cartas={[
        c('📅', 'Abril', 'llu', 'Primera temporada de lluvias.'),
        c('📅', 'Julio', 'ver', 'Mitad de año más seca.'),
        c('📅', 'Octubre', 'llu', 'Segunda temporada de lluvias.'),
        c('📅', 'Enero', 'ver', 'Comienzo de año más seco.'),
        c('🌱', 'Buen momento para sembrar', 'llu', 'Las semillas necesitan humedad para germinar.'),
      ]}
      cierre="Conocer el ritmo del año ayuda a decidir cuándo sembrar y cosechar." />
  )
}

export function PolicultivoJuego() {
  return (
    <JuegoDecide titulo="¿Monocultivo o policultivo?" pregunta="¿Cuál describe?" instrucciones="Decide a qué forma de cultivar corresponde cada frase." clave="cien:policultivo-mejor"
      opciones={[o('mono', 'Monocultivo', '🌽🌽'), o('poli', 'Policultivo', '🌽🫘🎃')]}
      cartas={[
        c('🌾', 'Una sola especie en todo el terreno', 'mono', 'Más fácil de cosechar con máquinas.'),
        c('🫘', 'Maíz, fríjol y ahuyama sembrados juntos', 'poli', 'Se ayudan entre sí.'),
        c('🐛', 'Una plaga se propaga rápido porque toda la comida está junta', 'mono', 'Es un riesgo del monocultivo.'),
        c('🏡', 'La chagra amazónica o la huerta de la casa', 'poli', 'Muchas especies útiles juntas.'),
        c('🍽️', 'Da comida variada a la familia todo el año', 'poli', 'Diversidad en la mesa.'),
      ]}
      cierre="Más especies juntas: suelo más protegido y menos plagas." />
  )
}

export function DialogoJuego() {
  return (
    <JuegoDecide titulo="Investigar con respeto" pregunta="¿Es una buena práctica?" instrucciones="Vas a aprender de los saberes de una comunidad. Decide qué es respetuoso." clave="cien:dialogo-mejor"
      opciones={[o('si', 'Sí, es respetuoso', '✅'), o('no', 'No es respetuoso', '❌')]}
      cartas={[
        c('🙏', 'Pedir permiso antes de grabar o tomar fotos', 'si', 'El consentimiento es lo primero.'),
        c('✍️', 'Decir quién te enseñó lo que aprendiste', 'si', 'Reconocer a quien enseña.'),
        c('🏷️', 'Publicar los saberes de la comunidad como si fueran tuyos', 'no', 'Es apropiarse de un conocimiento ajeno.'),
        c('🔁', 'Llevar a la comunidad los resultados del trabajo', 'si', 'Devolver lo aprendido.'),
        c('🙄', 'Decir que lo que saben los mayores «no sirve» sin escucharlo', 'no', 'El diálogo empieza por escuchar.'),
      ]}
      cierre="Pedir permiso, escuchar, reconocer y devolver." />
  )
}
