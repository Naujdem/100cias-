import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» de la radiactividad (Química área 2, tema 8). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })

export function TiposRadiacionJuego() {
  return (
    <JuegoDecide titulo="¿Alfa, beta o gamma?" pregunta="¿Qué radiación es?" instrucciones="Alfa: núcleo de helio. Beta: electrón. Gamma: energía sin masa." clave="cien:radiacion-mejor"
      opciones={[o('a', 'Alfa', '🔴'), o('b', 'Beta', '🔵'), o('g', 'Gamma', '🟢')]}
      cartas={[
        c('📄', 'La frena una hoja de papel', 'a', 'Es la más pesada y la menos penetrante.'),
        c('🧱', 'Hace falta plomo o concreto grueso para frenarla', 'g', 'Es la más penetrante.'),
        c('🔵', 'Es un electrón que sale del núcleo', 'b', 'Un neutrón se convierte en protón.'),
        c('⚖️', 'Tiene 2 protones y 2 neutrones', 'a', 'Es un núcleo de helio.'),
        c('🌈', 'No tiene masa ni carga; es como la luz pero más energética', 'g', 'Radiación electromagnética.'),
        c('🥫', 'La frenan unos milímetros de aluminio', 'b', 'Penetración intermedia.'),
      ]}
      cierre="α (papel) < β (aluminio) < γ (plomo): de menos a más penetrante." />
  )
}

export function VidaMediaJuego() {
  return (
    <JuegoDecide titulo="¿Cuánto queda?" pregunta="¿Qué fracción queda?" instrucciones="En cada vida media queda la mitad: 1 → ½ → ¼ → ⅛." clave="cien:vida-media-mejor"
      opciones={[o('2', 'La mitad (½)', '🌓'), o('4', 'Un cuarto (¼)', '🌒'), o('8', 'Un octavo (⅛)', '🌑')]}
      cartas={[
        c('🦴', 'Carbono-14 después de 5730 años', '2', 'Pasó una vida media.'),
        c('🦴', 'Carbono-14 después de 11 460 años', '4', 'Dos vidas medias: ½ × ½.'),
        c('💊', 'Yodo-131 (8 días) después de 24 días', '8', 'Tres vidas medias.'),
        c('💊', 'Yodo-131 después de 16 días', '4', 'Dos vidas medias.'),
        c('🪨', 'Uranio-238 después de 4500 millones de años', '2', 'Una vida media: la edad de la Tierra.'),
        c('🦴', 'Carbono-14 después de 17 190 años', '8', '17 190 ÷ 5730 = 3 vidas medias.'),
      ]}
      cierre="Fracción que queda = (½) elevado al número de vidas medias." />
  )
}

export function UsosNuclearesJuego() {
  return (
    <JuegoDecide titulo="¿Para qué se usa?" pregunta="¿En qué campo se usa?" instrucciones="Relaciona cada uso de la radiactividad con su campo." clave="cien:usos-nucleares-mejor"
      opciones={[o('med', 'Medicina', '🏥'), o('dat', 'Datación', '🦴'), o('ene', 'Energía', '⚡'), o('ind', 'Industria y alimentos', '🏭')]}
      cartas={[
        c('💊', 'Yodo-131 para tratar la tiroides', 'med', 'La glándula lo absorbe y la radiación actúa allí.'),
        c('🦴', 'Calcular la edad de un hueso con carbono-14', 'dat', 'Sirve hasta unos 50 000 años.'),
        c('🏭', 'Una central nuclear produce electricidad', 'ene', 'Con la fisión del uranio-235.'),
        c('🍓', 'Irradiar alimentos para que duren más', 'ind', 'La radiación gamma mata microbios; el alimento no queda radiactivo.'),
        c('🩻', 'Tecnecio-99m para ver órganos por dentro', 'med', 'Imágenes de medicina nuclear.'),
        c('🪨', 'Saber la edad de una roca con uranio-238', 'dat', 'Por eso sabemos que la Tierra tiene unos 4500 millones de años.'),
        c('🔥', 'Detectores de humo con americio-241', 'ind', 'Una pequeña fuente alfa.'),
      ]}
      cierre="La radiactividad bien controlada salva vidas, fecha el pasado y produce energía." />
  )
}

export function ProteccionJuego() {
  return (
    <JuegoDecide titulo="¿Te protege?" pregunta="¿Esto protege de la radiación?" instrucciones="Las tres reglas: menos tiempo, más distancia, más blindaje." clave="cien:proteccion-mejor"
      opciones={[o('si', 'Sí protege', '🛡️'), o('no', 'No protege', '⚠️')]}
      cartas={[
        c('🦺', 'El técnico de rayos X se pone un delantal de plomo', 'si', 'Blindaje.'),
        c('⏱️', 'Estar el menor tiempo posible cerca de una fuente', 'si', 'Tiempo.'),
        c('🤲', 'Recoger con la mano un objeto metálico brillante desconocido de un hospital abandonado', 'no', 'Así ocurrió el accidente de Goiânia (Brasil, 1987) con cesio-137.'),
        c('📏', 'Alejarse de la fuente', 'si', 'Distancia: la dosis baja muy rápido.'),
        c('☢️', 'Ignorar el símbolo del trébol amarillo y negro', 'no', 'Ese símbolo avisa que hay material radiactivo.'),
        c('🧱', 'Paredes gruesas de concreto en un reactor', 'si', 'Blindaje contra la gamma y los neutrones.'),
      ]}
      cierre="Tiempo, distancia y blindaje. Y nunca tocar un objeto con el trébol ☢️." />
  )
}
