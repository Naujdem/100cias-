import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» del área 3, tema 5 (Poblaciones). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })

export function DensidadJuego() {
  return (
    <JuegoDecide titulo="¿Sube o baja la población?" pregunta="¿Qué le pasa a la población?" instrucciones="Decide si cada hecho hace crecer o disminuir la población." clave="cien:densidad-mejor"
      opciones={[o('sube', 'Sube', '⬆️'), o('baja', 'Baja', '⬇️')]}
      cartas={[
        c('🐣', 'Nacen muchas crías', 'sube', 'Natalidad.'),
        c('🦅', 'Llegan aves de otro lugar', 'sube', 'Inmigración.'),
        c('💀', 'Una enfermedad mata a muchos', 'baja', 'Mortalidad.'),
        c('🚶', 'Muchos se van a otra región', 'baja', 'Emigración.'),
        c('🍃', 'Hay mucha comida y pocos depredadores', 'sube', 'Más nacimientos y menos muertes.'),
      ]}
      cierre="Nacimientos y llegadas suman; muertes y salidas restan." />
  )
}

export function CrecimientoJuego() {
  return (
    <JuegoDecide titulo="¿Curva en J o en S?" pregunta="¿Qué curva se espera?" instrucciones="Decide cómo crecerá la población en cada caso." clave="cien:crecimiento-mejor"
      opciones={[o('j', 'En J (sin freno)', '📈'), o('s', 'En S (se frena)', '〰️')]}
      cartas={[
        c('🦠', 'Unas pocas bacterias en un caldo nuevo, las primeras horas', 'j', 'Al comienzo sobra todo.'),
        c('🦌', 'Venados en un bosque con comida limitada, por muchos años', 's', 'Se acercan a la capacidad de carga.'),
        c('🐟', 'Peces en un estanque pequeño', 's', 'El espacio y el alimento se acaban.'),
        c('🐀', 'Ratas que llegan a una isla sin depredadores, los primeros años', 'j', 'Al principio crecen sin freno.'),
      ]}
      cierre="Ninguna población crece en J para siempre: el ambiente la frena." />
  )
}

export function DepredadorPresaJuego() {
  return (
    <JuegoDecide titulo="Depredador y presa" pregunta="¿Qué pasa después?" instrucciones="Piensa en conejos de monte y zorros." clave="cien:depredador-presa-mejor"
      opciones={[o('sube', 'Aumenta', '⬆️'), o('baja', 'Disminuye', '⬇️')]}
      cartas={[
        c('🐇', 'Hay muchos conejos. ¿Qué pasa luego con los zorros?', 'sube', 'Tienen más comida.'),
        c('🦊', 'Hay muchos zorros. ¿Qué pasa luego con los conejos?', 'baja', 'Los cazan más.'),
        c('🐇', 'Quedan pocos conejos. ¿Qué pasa luego con los zorros?', 'baja', 'Les falta comida.'),
        c('🦊', 'Quedan pocos zorros. ¿Qué pasa luego con los conejos?', 'sube', 'Tienen menos depredadores.'),
      ]}
      cierre="Las dos poblaciones suben y bajan una detrás de la otra." />
  )
}
