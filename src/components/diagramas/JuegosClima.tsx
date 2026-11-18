import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» del área 5, tema 4 (Clima y cambio climático). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })

export function TiempoClimaJuego() {
  return (
    <JuegoDecide titulo="¿Tiempo o clima?" pregunta="¿De qué habla?" instrucciones="Decide si cada frase habla del tiempo (ahora) o del clima (lo normal durante años)." clave="cien:tiempo-clima-mejor"
      opciones={[o('tiempo', 'Tiempo', '🌦️'), o('clima', 'Clima', '📅')]}
      cartas={[
        c('🌧️', 'Esta tarde cayó un aguacero en Neiva', 'tiempo', 'Es lo que pasó hoy.'),
        c('🏜️', 'La Tatacoa es seca y caliente casi todo el año', 'clima', 'Es lo normal durante años.'),
        c('❄️', 'En el páramo la temperatura media es de unos 8 °C', 'clima', 'Es un promedio.'),
        c('🌬️', 'Mañana habrá vientos fuertes', 'tiempo', 'Es un pronóstico de un día.'),
        c('📆', 'En la región llueve más en abril y en octubre', 'clima', 'Son las temporadas de lluvia de siempre.'),
      ]}
      cierre="El tiempo cambia en horas; el clima, en décadas." />
  )
}

export function InvernaderoJuego() {
  return (
    <JuegoDecide titulo="¿Atrapa calor?" pregunta="¿Es gas de efecto invernadero?" instrucciones="Decide si cada gas retiene calor en la atmósfera." clave="cien:invernadero-mejor"
      opciones={[o('si', 'Sí, atrapa calor', '🔥'), o('no', 'No', '🌬️')]}
      cartas={[
        c('🏭', 'Dióxido de carbono (CO₂)', 'si', 'El que más aumenta por las personas.'),
        c('🐄', 'Metano', 'si', 'Lo producen las vacas, los arrozales y la basura.'),
        c('🫁', 'Oxígeno', 'no', 'Casi no absorbe el calor infrarrojo.'),
        c('☁️', 'Vapor de agua', 'si', 'Es el gas de invernadero más abundante.'),
        c('🌫️', 'Nitrógeno (N₂)', 'no', 'Es la mayor parte del aire, pero no atrapa calor.'),
      ]}
      cierre="Unos pocos gases forman la cobija que calienta el planeta." />
  )
}

export function CambioClimaticoJuego() {
  return (
    <JuegoDecide titulo="¿Causa o evidencia?" pregunta="¿Es causa o evidencia?" instrucciones="Decide si cada tarjeta es una causa del cambio climático o una evidencia de que está pasando." clave="cien:cambio-climatico-mejor"
      opciones={[o('causa', 'Causa', '🏭'), o('evidencia', 'Evidencia', '🔎')]}
      cartas={[
        c('🏔️', 'El Nevado del Huila pierde hielo', 'evidencia', 'Los glaciares retroceden.'),
        c('🚚', 'Quemar diésel en camiones', 'causa', 'Emite CO₂.'),
        c('🪓', 'Talar la selva amazónica', 'causa', 'Libera carbono y quita árboles que lo toman.'),
        c('🌊', 'El nivel del mar sube', 'evidencia', 'Por el hielo que se derrite y el agua que se expande.'),
        c('🦋', 'Especies que suben por la montaña buscando frío', 'evidencia', 'Se mueven con el clima.'),
      ]}
      cierre="Las causas son nuestras emisiones; las evidencias se ven en todo el planeta." />
  )
}

export function NinoNinaJuego() {
  return (
    <JuegoDecide titulo="¿Niño o Niña?" pregunta="¿Qué fenómeno es?" instrucciones="Decide si cada situación en Colombia corresponde a El Niño o a La Niña." clave="cien:nino-nina-mejor"
      opciones={[o('nino', 'El Niño', '☀️'), o('nina', 'La Niña', '🌧️')]}
      cartas={[
        c('🔥', 'Incendios forestales en los cerros', 'nino', 'Hay sequía y calor.'),
        c('🌊', 'Inundaciones en La Mojana', 'nina', 'Lluvias muy fuertes.'),
        c('🚱', 'Racionamiento de agua en las ciudades', 'nino', 'Los embalses bajan.'),
        c('⛰️', 'Más deslizamientos en las vías', 'nina', 'El suelo se satura de agua.'),
        c('🏞️', 'El Magdalena muy bajo y difícil de navegar', 'nino', 'Llueve menos.'),
      ]}
      cierre="El Niño seca, La Niña moja." />
  )
}

export function MitigarAdaptarJuego() {
  return (
    <JuegoDecide titulo="¿Mitigar o adaptarse?" pregunta="¿Qué tipo de acción es?" instrucciones="Mitigar: emitir menos gases. Adaptarse: prepararse para los cambios." clave="cien:mitigar-adaptar-mejor"
      opciones={[o('mitigar', 'Mitigar', '🌱'), o('adaptar', 'Adaptarse', '☂️')]}
      cartas={[
        c('☀️', 'Poner paneles solares en la escuela', 'mitigar', 'Menos electricidad de combustibles.'),
        c('🛢️', 'Construir un tanque para recoger agua lluvia', 'adaptar', 'Para las sequías.'),
        c('🌳', 'Frenar la tala del bosque', 'mitigar', 'Es lo que más reduce emisiones en Colombia.'),
        c('🌾', 'Sembrar una variedad de fríjol que aguante la sequía', 'adaptar', 'Prepararse para el cambio.'),
        c('🚲', 'Ir en bicicleta en vez de en moto', 'mitigar', 'Menos gasolina quemada.'),
        c('🏠', 'No construir casas en la orilla del río', 'adaptar', 'Menos riesgo de inundación.'),
      ]}
      cierre="Hacen falta las dos: reducir las causas y prepararse." />
  )
}
