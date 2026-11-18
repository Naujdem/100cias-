import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» de Química, área 1, tema 3 (Estados y cambios de estado). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })

export function EstadoJuego() {
  return (
    <JuegoDecide titulo="¿Sólido, líquido o gas?" pregunta="¿En qué estado está?" instrucciones="Decide el estado de cada cosa a temperatura ambiente o por la pista que se da." clave="cien:estado-mejor"
      opciones={[o('s', 'Sólido', '🧊'), o('l', 'Líquido', '💧'), o('g', 'Gas', '☁️')]}
      cartas={[
        c('🪨', 'Una piedra de río', 's', 'Forma y volumen fijos.'),
        c('🥛', 'La leche en el vaso', 'l', 'Toma la forma del vaso, pero no cambia su volumen.'),
        c('🎈', 'Lo que hay dentro de un globo', 'g', 'El aire llena todo el globo.'),
        c('🧂', 'La sal (aunque se pueda verter)', 's', 'Cada grano es un sólido con forma propia.'),
        c('🔥', 'El gas de la pipeta de la estufa', 'g', 'Ocupa todo el cilindro.'),
        c('🍯', 'La miel', 'l', 'Fluye, aunque despacio.'),
        c('🧈', 'Las partículas solo vibran en su sitio', 's', 'Así es en un sólido.'),
        c('💨', 'Las partículas están muy separadas y rápidas', 'g', 'Así es en un gas.'),
      ]}
      cierre="Sólido: forma y volumen fijos. Líquido: volumen fijo. Gas: ni forma ni volumen fijos." />
  )
}

export function CambioEstadoJuego() {
  return (
    <JuegoDecide titulo="¿Qué cambio es?" pregunta="¿Qué cambio de estado ocurre?" instrucciones="Elige el cambio de estado de cada situación." clave="cien:cambio-estado-mejor"
      opciones={[o('fus', 'Fusión', '🫠'), o('sol', 'Solidificación', '🧊'), o('eva', 'Evaporación', '♨️'), o('con', 'Condensación', '💧')]}
      cartas={[
        c('👕', 'La ropa se seca en el alambre', 'eva', 'El agua pasa de líquido a gas.'),
        c('🪟', 'El vidrio del bus se empaña', 'con', 'El vapor se enfría y se vuelve gotitas.'),
        c('🍦', 'El helado se derrite al sol', 'fus', 'De sólido a líquido.'),
        c('🕯️', 'La cera de la vela se endurece al caer', 'sol', 'De líquido a sólido al enfriarse.'),
        c('🥤', 'Gotas por fuera de un vaso con hielo', 'con', 'El vapor del aire se enfría en el vaso.'),
        c('🍬', 'La panela derretida se endurece en el molde', 'sol', 'Así se hace la panela en el trapiche.'),
        c('🌊', 'Un charco desaparece después de la lluvia', 'eva', 'El agua se va al aire como vapor.'),
        c('🍫', 'El chocolate se ablanda en la mano', 'fus', 'Se funde cerca de 34 °C.'),
      ]}
      cierre="Con calor: fusión y evaporación. Al enfriar: solidificación y condensación." />
  )
}

export function MesetaJuego() {
  return (
    <JuegoDecide titulo="¿Sube la temperatura?" pregunta="Mientras se calienta, ¿sube la temperatura?" instrucciones="Recuerda la curva de calentamiento: durante un cambio de estado la temperatura no sube." clave="cien:meseta-mejor"
      opciones={[o('si', 'Sí sube', '📈'), o('no', 'Se queda igual', '➖')]}
      cartas={[
        c('🧊', 'Hielo a −15 °C que se calienta', 'si', 'Todavía no llega al punto de fusión.'),
        c('🫠', 'Hielo que se está derritiendo a 0 °C', 'no', 'El calor se usa en separar las partículas.'),
        c('💧', 'Agua líquida a 40 °C que se calienta', 'si', 'Sube hasta el punto de ebullición.'),
        c('♨️', 'Agua hirviendo en una olla al nivel del mar', 'no', 'Se queda en 100 °C mientras hierve.'),
        c('🔥', 'Subir la llama a una olla que ya hierve', 'no', 'Hierve más rápido, pero no más caliente.'),
        c('☁️', 'Vapor a 105 °C que se sigue calentando', 'si', 'Ya es gas y su temperatura sube.'),
      ]}
      cierre="En las mesetas de la curva, el calor cambia el estado, no la temperatura." />
  )
}
