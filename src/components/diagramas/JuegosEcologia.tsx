import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» del área 3 (Relaciones ecosistémicas), tema 1. Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })

export function EcologiaQueJuego() {
  return (
    <JuegoDecide titulo="¿Con quién se relaciona?" pregunta="¿Es un ser vivo o parte del entorno sin vida?" instrucciones="La rana se relaciona con muchas cosas. Decide si cada una está viva o no." clave="cien:ecologia-que-mejor"
      opciones={[o('vivo', 'Ser vivo', '🌱'), o('no', 'Entorno sin vida', '💧')]}
      cartas={[
        c('🦟', 'Los insectos que se come', 'vivo', 'Es una relación con otro ser vivo.'),
        c('💧', 'El agua de la laguna', 'no', 'El agua no está viva, pero la rana la necesita.'),
        c('🪶', 'La garza que la caza', 'vivo', 'Relación entre depredador y presa.'),
        c('🌡️', 'La temperatura del páramo', 'no', 'Es un factor del ambiente.'),
        c('🌿', 'Las plantas donde se esconde', 'vivo', 'Le dan refugio.'),
        c('☀️', 'La luz del sol', 'no', 'Calienta y da energía a las plantas.'),
      ]}
      cierre="La ecología estudia todas esas relaciones: con lo vivo y con lo no vivo." />
  )
}

export function NivelesEcologicosJuego() {
  return (
    <JuegoDecide titulo="¿Qué nivel ecológico es?" pregunta="¿Qué nivel es?" instrucciones="Decide a qué nivel corresponde cada ejemplo." clave="cien:niveles-ecologicos-mejor"
      opciones={[o('ind', 'Individuo', '1️⃣'), o('pob', 'Población', '👥'), o('com', 'Comunidad', '🐻🌿'), o('eco', 'Ecosistema', '🏞️')]}
      cartas={[
        c('🌵', 'Un frailejón', 'ind', 'Un solo ser vivo.'),
        c('🐻', 'Todos los osos de anteojos de un páramo', 'pob', 'Una sola especie en un lugar.'),
        c('🦌', 'Venados, frailejones, colibríes y ranas de un páramo', 'com', 'Varias especies que viven juntas.'),
        c('🏞️', 'El páramo con sus seres vivos, su agua, su suelo y su clima', 'eco', 'Seres vivos más el entorno sin vida.'),
        c('🐸', 'Todas las ranas de una especie en una laguna', 'pob', 'Una población.'),
        c('🌿', 'Las plantas, hongos y animales de un bosque, sin contar el suelo ni el agua', 'com', 'Solo lo vivo: comunidad.'),
      ]}
      cierre="Individuo → población → comunidad → ecosistema → bioma → biosfera." />
  )
}

export function HabitatNichoJuego() {
  return (
    <JuegoDecide titulo="¿Hábitat o nicho?" pregunta="¿Es su hábitat o su nicho?" instrucciones="El hábitat es dónde vive; el nicho, qué hace en el ecosistema." clave="cien:habitat-nicho-mejor"
      opciones={[o('hab', 'Hábitat (dónde vive)', '🏠'), o('nic', 'Nicho (qué hace)', '🛠️')]}
      cartas={[
        c('🌲', 'El colibrí vive en el bosque andino', 'hab', 'Es el lugar donde vive.'),
        c('🌸', 'El colibrí toma néctar y poliniza flores', 'nic', 'Es su papel en el ecosistema.'),
        c('🐦', 'El carpintero come insectos de la corteza', 'nic', 'Así se alimenta.'),
        c('🏔️', 'El oso de anteojos vive en páramos y bosques de niebla', 'hab', 'Su lugar.'),
        c('🌱', 'El oso dispersa semillas al comer frutos', 'nic', 'Ayuda a que el bosque crezca.'),
        c('💧', 'La rana vive en lagunas', 'hab', 'Su lugar.'),
      ]}
      cierre="El hábitat es la dirección; el nicho, la profesión." />
  )
}
